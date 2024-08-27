import httpStatus from 'http-status';
import Package from './package.model';
import ApiError from '../errors/ApiError';
import { IOptions, QueryResult } from '../paginate/paginate';
import { NewPackage, IPackageDoc, UpdatePackageBody } from './package.interfaces';
import { generateReadableId } from '../utils/generateUniqueId';
// import { Delivery } from '../delivery';

/**
 * Create a package
 * @param {NewPackage} packageBody
 * @returns {Promise<IPackageDoc>}
 */
export const createPackage = async (reqBody: NewPackage): Promise<IPackageDoc> => {
  const packageBody = { package_id: generateReadableId('package'), ...reqBody };
  return Package.create(packageBody);
};

/**
 * Query for packages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryPackages = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const packages = await Package.paginate(filter, options);
  return packages;
};

/**
 * Track package by id using MongoDB aggregation
 * @param {string} id
 * @returns {Promise<{ package: any; delivery: any } | null>}
 */
export const trackPackageById = async (id: string): Promise<{ package: any } | null> => {
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
      $unwind: {
        path: '$delivery',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        package_id: id,
      },
    },
  ];
  const result = await Package.aggregate(pipeline);

  if (result.length === 0) {
    throw new ApiError(404, 'Package does not exist');
  }

  return result[0];
};

/**
 * Get package by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IPackageDoc | null>}
 */
export const getPackageById = async (id: string): Promise<IPackageDoc | null> => Package.findOne({ package_id: id });

/**
 * Update package by id
 * @param {mongoose.Types.ObjectId} packageId
 * @param {UpdatePackageBody} updateBody
 * @returns {Promise<IPackageDoc | null>}
 */
export const updatePackageById = async (packageId: string, updateBody: UpdatePackageBody): Promise<IPackageDoc | null> => {
  const retrievedPackage = await getPackageById(packageId);
  if (!retrievedPackage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Package not found');
  }

  Object.assign(retrievedPackage, updateBody);
  await retrievedPackage.save();
  return retrievedPackage;
};

/**
 * Delete package by id
 * @param {mongoose.Types.ObjectId} packageId
 * @returns {Promise<IPackageDoc | null>}
 */
export const deletePackageById = async (packageId: string): Promise<IPackageDoc | null> => {
  const retrievedPackage = await getPackageById(packageId);

  if (!retrievedPackage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Package not found');
  }

  await retrievedPackage.deleteOne();
  return retrievedPackage;
};
