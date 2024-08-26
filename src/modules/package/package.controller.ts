import httpStatus from 'http-status';
import { Request, Response } from 'express';
// import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import pick from '../utils/pick';
import { IOptions } from '../paginate/paginate';
import * as packageService from './package.service';
export const createPackage = catchAsync(async (req: Request, res: Response) => {
  const newPackage = await packageService.createPackage(req.body);
  res.status(httpStatus.CREATED).send(newPackage);
});

export const getPackages = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['active_delivery_id', 'from_name', 'to_name']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const result = await packageService.queryPackages(filter, options);
  res.send(result);
});

export const trackPackage = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['packageId'] === 'string') {
    const retrievePackage = await packageService.trackPackageById(req.params['packageId']);
    if (!retrievePackage) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Package not found');
    }
    res.send(retrievePackage);
  }
});

export const updatePackage = catchAsync(async (req: Request, res: Response) => {
  
  if (typeof req.params['packageId'] === 'string') {
    const updatedPackage = await packageService.updatePackageById(req.params['packageId'], req.body);

    res.send(updatedPackage);
  }
});

export const deletePackage = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['packageId'] === 'string') {
    await packageService.deletePackageById(req.params['packageId']);
    res.status(httpStatus.NO_CONTENT).send();
  }
});
