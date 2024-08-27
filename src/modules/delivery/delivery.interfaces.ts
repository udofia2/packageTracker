import  { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';
import { DELIVERY_STATUS_ENUM } from './deliveryStatusEnum';

export interface ILocation {
  lat: number;
  lng: number;
}

export interface IDelivery {
  delivery_id: string;
  package_id: string;
  pickup_time?: Date;
  start_time?: Date;
  end_time?: Date;
  location: ILocation;
  status: DELIVERY_STATUS_ENUM;
}

export interface IDeliveryDoc extends IDelivery, Document {}

export interface IDeliveryModel extends Model<IDeliveryDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateDeliveryBody = Partial<IDelivery>;
export type ModelDeliveryTest = Partial<IDelivery>;

export type NewCreatedDelivery = Omit<IDelivery, 'status' | 'delivery_id' | 'pickup_time' | 'start_time' | 'end_time' | 'location'>;