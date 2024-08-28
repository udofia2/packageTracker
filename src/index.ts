import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './modules/logger/logger';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { Delivery } from './modules/delivery';
import { IDelivery } from './modules/delivery/delivery.interfaces';
import { DELIVERY_STATUS_ENUM } from './modules/delivery/deliveryStatusEnum';
import { Package } from './modules/package';


let server: any = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  logger.info('A client connected');
socket.on('location_changed', async (data) => {
  try {
    const { delivery_id, location } = data;

    const delivery = await Delivery.findOne({ delivery_id });
    if (!delivery) {
      return socket.emit('error', { message: 'Delivery not found' });
    }

    const updatedDelivery = await Delivery.findOneAndUpdate({ delivery_id }, { location }, { new: true });

    if (!updatedDelivery) {
      return console.error('Delivery not updated successfully');
    }

    const pipeline = [
      {
        $lookup: {
          from: 'deliveries',
          localField: 'active_delivery_id',
          foreignField: 'delivery_id',
          as: 'delivery',
        },
      },
      {
        $unwind: '$delivery',
      },
      {
        $match: {
          'delivery.delivery_id': delivery_id,
        },
      },
    ];

    const updatedPackage = await Package.aggregate(pipeline, {
      allowDiskUse: true,
    });

    io.emit('delivery_updated', {
      event: 'delivery_updated',
      delivery: updatedPackage[0].delivery,
    });
  } catch (error) {
    console.error('Error handling location update:', error);
  }
});

socket.on('status_changed', async (data) => {
  try {
    const { delivery_id, status } = data;

    const delivery = await Delivery.findOne({ delivery_id });
    if (!delivery) {
      return socket.emit('error', { message: 'Delivery not found' });
    }

    let updateFields: Partial<IDelivery> = { status };
    const now = new Date();

    if (status === DELIVERY_STATUS_ENUM.PickUp && delivery.status === DELIVERY_STATUS_ENUM.Open) {
      updateFields = { ...updateFields, pickup_time: now }; 
    } else if (status === DELIVERY_STATUS_ENUM.InTransit && delivery.status === DELIVERY_STATUS_ENUM.PickUp) {
      updateFields = { ...updateFields, start_time: now };
    } else if (
      (status === DELIVERY_STATUS_ENUM.Delivered || status === DELIVERY_STATUS_ENUM.Failed) &&
      delivery.status === DELIVERY_STATUS_ENUM.InTransit
    ) {
      updateFields = { ...updateFields, end_time: now };
    }

    const updatedDelivery = await Delivery.findOneAndUpdate(
      { delivery_id },
      updateFields,
      { new: true } 
    );

    if (!updatedDelivery) {
      return console.error('Delivery not updated successfully'); 
    }

    const pipeline = [
      {
        $lookup: {
          from: 'deliveries',
          localField: 'active_delivery_id',
          foreignField: 'delivery_id',
          as: 'delivery',
        },
      },
      {
        $unwind: '$delivery',
      },
      {
        $match: {
          'delivery.delivery_id': delivery_id,
        },
      },
    ];


    const updatedPackage = await Package.aggregate(pipeline, {
      allowDiskUse: true, 
    });

    io.emit('delivery_updated', { event: 'delivery_updated', delivery: updatedPackage[0].delivery });
  } catch (error) {
    console.error('Error handling status update:', error);
  }
});

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

mongoose.connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });

  io.listen(server);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
