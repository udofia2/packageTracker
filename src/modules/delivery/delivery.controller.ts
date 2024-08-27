import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as deliveryService from './delivery.service';

export const createDelivery = catchAsync(async (req: Request, res: Response) => {
  const delivery = await deliveryService.createDelivery(req.body);

  res.status(httpStatus.CREATED).send(delivery);
});

export const getDeliverys = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['title', 'owner', 'tags']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await deliveryService.queryDeliverys(filter, options);
  res.send(result);
});

export const trackDelivery = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['deliveryId'] === 'string') {
    const delivery = await deliveryService.trackDeliveryById(req.params['deliveryId']);
    if (!delivery) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Delivery not found');
    }
    res.send(delivery);
  }
});

export const updateDelivery = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['deliveryId'] === 'string') {
    const delivery = await deliveryService.updateDeliveryById(req.params['deliveryId'], req.body);

    res.send(delivery);
  }
});

export const deleteDelivery = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['deliveryId'] === 'string') {
    await deliveryService.deleteDeliveryById(req.params['deliveryId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
