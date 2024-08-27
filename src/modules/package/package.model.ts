import mongoose from 'mongoose';
import toJSON from '../toJSON/toJSON';
import paginate from '../paginate/paginate';
import { IPackageDoc, IPackageModel } from './package.interfaces';

const packageSchema = new mongoose.Schema<IPackageDoc, IPackageModel>(
  {
    package_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    active_delivery_id: {
      type: String,
      ref: 'deliveries',
    },
    description: {
      type: String,
      trim: true,
    },
    from_name: {
      type: String,
      trim: true,
    },
    from_address: {
      type: String,
      trim: true,
    },
    from_location: {
      type: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    to_name: {
      type: String,
      trim: true,
    },
    to_address: {
      type: String,
      trim: true,
    },
    to_location: {
      type: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    height: {
      type: Number,
      default: 0,
    },
    depth: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.plugin(toJSON);
packageSchema.plugin(paginate);

const Package = mongoose.model<IPackageDoc, IPackageModel>('package', packageSchema);

export default Package;
