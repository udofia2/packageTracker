import Joi from 'joi';
import { NewPackage } from './package.interfaces';
import { DELIVERY_STATUS_ENUM } from '../delivery/deliveryStatusEnum';

const locationSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

const createPackageBody: Record<keyof NewPackage, any> = {
  description: Joi.string(),
  from_name: Joi.string().required(),
  from_location: locationSchema.required(),
  from_address: Joi.string().required(),
  to_name: Joi.string().required(),
  to_address: Joi.string().required(),
  to_location: locationSchema.required(),
  height: Joi.number().required(),
  depth: Joi.number().required(),
  width: Joi.number().required(),
};

export const createPackage = {
  body: Joi.object().keys(createPackageBody),
};

export const getPackages = {
  query: Joi.object().keys({
    active_delivery_id: Joi.string(),
    from_name: Joi.string(),
    to_name: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getPackage = {
  params: Joi.object().keys({
    packageId: Joi.string(),
  }),
};

export const updatePackage = {
  params: Joi.object().keys({
    packageId: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      active_delivery_id: Joi.string(),
      description: Joi.string(),
      from_name: Joi.string(),
      from_address: Joi.string(),
      from_location: locationSchema,
      to_name: Joi.string(),
      to_address: Joi.string(),
      to_location: locationSchema,
      height: Joi.number(),
      depth: Joi.number(),
      width: Joi.number(),
      status: Joi.string().valid(DELIVERY_STATUS_ENUM.Open, DELIVERY_STATUS_ENUM.Delivered, DELIVERY_STATUS_ENUM.Failed, DELIVERY_STATUS_ENUM.InTransit, DELIVERY_STATUS_ENUM.PickUp)
    })
    .min(1),
};

export const deletePackage = {
  params: Joi.object().keys({
    packageId: Joi.string().required()
  }),
};
