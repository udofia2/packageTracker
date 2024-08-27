import httpStatus from 'http-status';
import Delivery from './delivery.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewCreatedDelivery, IDeliveryDoc, UpdateDeliveryBody } from './delivery.interfaces';
import { generateReadableId } from '../utils/generateUniqueId';
import { Package } from '../package';

/**
 * Create a delivery
 * @param {NewDelivery} deliveryBody
 * @returns {Promise<IDeliveryDoc>}
 */
export const createDelivery = async (reqBody: NewCreatedDelivery): Promise<IDeliveryDoc> => {
  const existingPackage = await Package.findOne({ package_id: reqBody.package_id });

  if (!existingPackage) {
    throw new ApiError(404, 'Package not found');
  }

  if (existingPackage.active_delivery_id) {
    throw new ApiError(400, 'There is an active delivery on this Package');
  }

  const deliveryBody = { delivery_id: generateReadableId('delivery'), ...reqBody };

  await Package.updateOne({ package_id: reqBody.package_id }, { active_delivery_id: deliveryBody.delivery_id });

  return Delivery.create(deliveryBody);
};

/**
 * Query for deliveries
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryDeliverys = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const deliveries = await Delivery.paginate(filter, options);
  return deliveries;
};

/**
 * Get package and delivery information using MongoDB aggregation
 * @param {string} id
 * @returns {Promise<{ package: any; delivery: any } | null>}
 */
export const trackDeliveryById = async (id: string): Promise<{ package: any; } | null> => {
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
        'delivery.delivery_id': id,
      },
    },
  ];

  const result = await Package.aggregate(pipeline);

  if (result.length === 0) {
    throw new ApiError(404, 'Delivery not found');
  }

  return result[0]
};

/**
 * Get delivery by id
 * @param {string} id
 * @returns {Promise<IDeliveryDoc | null>}
 */
export const getDeliveryById = async (id: string): Promise<IDeliveryDoc | null> => Delivery.findOne({ delivery_id: id });

/**
 * Update delivery by id
 * @param {mongoose.Types.ObjectId} deliveryId
 * @param {UpdateDeliveryBody} updateBody
 * @returns {Promise<IDeliveryDoc | null>}
 */
export const updateDeliveryById = async (
  deliveryId: string,
  updateBody: UpdateDeliveryBody
): Promise<IDeliveryDoc | null> => {
  const delivery = await getDeliveryById(deliveryId);

  if (!delivery) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Delivery not found');
  }

  Object.assign(delivery, updateBody);
  await delivery.save();
  return delivery;
};

/**
 * Delete delivery by id
 * @param {mongoose.Types.ObjectId} deliveryId
 * @returns {Promise<IDeliveryDoc | null>}
 */
export const deleteDeliveryById = async (deliveryId: string): Promise<IDeliveryDoc | null> => {
  const delivery = await getDeliveryById(deliveryId);

  if (!delivery) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Delivery not found');
  }

  await delivery.deleteOne();
  return delivery;
};
