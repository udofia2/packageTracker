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

  if(existingPackage.active_delivery_id){
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
 * Query for published deliveries
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryPublishedDeliverys = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const deliveries = await Delivery.paginate(filter, options);
  return deliveries;
};

/**
 * Get package by id
 * @param {string} id
 * @returns {Promise<IPackageDoc | null>}
 */
export const trackDeliveryById = async (id: string): Promise<{ package: any; delivery: any } | null> => {
  const retrievedPackage = await getDeliveryById(id);

  const delivery = await Delivery.findOne({ package_id: retrievedPackage?.package_id });

  return {
    package: retrievedPackage,
    delivery: delivery ? delivery : 'No active delivery for this package.',
  };
};


/**
 * Get delivery by id
 * @param {string} id
 * @returns {Promise<IDeliveryDoc | null>}
 */
export const getDeliveryById = async (id: string): Promise<IDeliveryDoc | null> => Delivery.findOne({delivery_id: id});

/**
 * Update delivery by id
 * @param {mongoose.Types.ObjectId} deliveryId
 * @param {UpdateDeliveryBody} updateBody
 * @returns {Promise<IDeliveryDoc | null>}
 */
export const updateDeliveryById = async (
  deliveryId:string,
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
