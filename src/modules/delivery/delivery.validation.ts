import Joi from 'joi';
import { NewCreatedDelivery } from './delivery.interfaces';
import { DELIVERY_STATUS_ENUM } from './deliveryStatusEnum';

const createDeliveryBody: Record<keyof NewCreatedDelivery, any> = {
  package_id: Joi.string().required(),
};

export const createDelivery = {
  body: Joi.object().keys(createDeliveryBody),
};

export const getDeliveries = {
  query: Joi.object().keys({
    delivery_id: Joi.string(),
    package_id: Joi.string(),
    status: Joi.string().valid(
      DELIVERY_STATUS_ENUM.Open,
      DELIVERY_STATUS_ENUM.PickUp,
      DELIVERY_STATUS_ENUM.InTransit,
      DELIVERY_STATUS_ENUM.Delivered,
      DELIVERY_STATUS_ENUM.Failed
    ),
    from_location: Joi.object({
      lat: Joi.number(),
      lng: Joi.number(),
    }),
    to_location: Joi.object({
      lat: Joi.number(),
      lng: Joi.number(),
    }),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};


export const getDelivery = {
  params: Joi.object().keys({
    deliveryId: Joi.string().required(),
  }),
};

export const updateDelivery  = {
  params: Joi.object().keys({
    deliveryId: Joi.string().required(),
  }),
  body: Joi.object()
    .keys({
      package_id: Joi.string(),
      pickup_time: Joi.date(),
      start_time: Joi.date(),
      end_time: Joi.date(),
      location: Joi.object({
        lat: Joi.number(),
        lng: Joi.number(),
      })
    })
    .min(1),
};

export const deleteDelivery = {
  params: Joi.object().keys({
    deliveryId: Joi.string().required(),
  }),
};
