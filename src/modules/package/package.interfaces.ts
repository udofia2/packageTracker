import  { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface ILocation {
  lat: number;
  lng: number;
}

export interface IPackage {
  package_id: string;
  active_delivery_id: string;
  description: string;
  from_name: string;
  from_location: ILocation;
  from_address: string;
  to_name: string;
  to_address: string;
  to_location: ILocation;
  height: number;
  depth: number;
  width: number
}

export interface IPackageDoc extends IPackage, Document {}

export interface IPackageModel extends Model<IPackageDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdatePackageBody = Partial<IPackage>;
export type ModelPackageTest = Partial<IPackage>;

export type NewPackage = Omit<IPackage, 'active_delivery_id' | 'package_id'>;