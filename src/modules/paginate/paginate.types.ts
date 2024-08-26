import { Model, Document } from 'mongoose';
import { QueryResult, IOptions } from './paginate';

export interface IProject {
  name: string;
  milestones: number;
}

export interface IPackage {
  name: string;
  project: string;
}

export interface IProjectDoc extends IProject, Document {}
export interface IPackageDoc extends IPackage, Document {}

export interface IProjectModel extends Model<IProjectDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}
export interface IPackageModel extends Model<IPackageDoc> {
  paginate(filter: Record<string, any>, options: IOptions): Promise<QueryResult>;
}
