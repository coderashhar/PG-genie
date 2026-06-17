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
    lat?: number;
    lng?: number;
  };
  price: number;
  roomTypes: string[];
  amenities: string[];
  furniture: boolean;
  attachedBath: boolean;
  waterSupply: boolean;
  geyser: boolean;
  wifi: boolean;
  backupPower: boolean;
  cctv: boolean;
  washingMachine: boolean;
  petFriendly: boolean;
  images: string[];
  status: 'active' | 'inactive' | 'pending' | 'rejected';
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
      lat: { type: Number },
      lng: { type: Number },
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
    furniture: { type: Boolean, default: false },
    attachedBath: { type: Boolean, default: false },
    waterSupply: { type: Boolean, default: false },
    geyser: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    backupPower: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    washingMachine: { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending', 'rejected'],
      default: 'pending',
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

// Delete the cached model to ensure schema updates are applied during Next.js hot reloads
if (mongoose.models.Property) {
  delete mongoose.models.Property;
}

const Property: Model<IProperty> = mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
