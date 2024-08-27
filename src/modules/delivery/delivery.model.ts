import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { DELIVERY_STATUS_ENUM } from './deliveryStatusEnum';
import { IDeliveryDoc, IDeliveryModel } from './delivery.interfaces';

const deliverySchema = new mongoose.Schema<IDeliveryDoc, IDeliveryModel>({
  delivery_id: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  package_id: {
    type: String,
    ref: 'packages',
    trim: true,
  },
  pickup_time: {
    type: Date,
  },
  start_time: {
    type: Date,
  },
  end_time: {
    type: Date,
  },
  location: {
    type: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
  },
  status: {
    type: String,
    enum: DELIVERY_STATUS_ENUM,
    default: DELIVERY_STATUS_ENUM.Open,
  },
});

deliverySchema.plugin(toJSON);
deliverySchema.plugin(paginate);

const Delivery = mongoose.model<IDeliveryDoc, IDeliveryModel>('delivery', deliverySchema);

export default Delivery;
