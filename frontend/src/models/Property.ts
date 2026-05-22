import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProperty extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  price: number;
  roomTypes: string[];
  amenities: string[];
  images: string[];
  status: 'active' | 'inactive';
  views: number;
  monthlyViews: { month: number; year: number; count: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema<IProperty> = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String },
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    roomTypes: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    monthlyViews: [
      {
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        count: { type: Number, default: 0 },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Property: Model<IProperty> = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
