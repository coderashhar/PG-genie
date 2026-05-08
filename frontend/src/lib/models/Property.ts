import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description?: string;
  rent: number;
  amenities: string[];
  ownerContact: string;
  ownerId: mongoose.Types.ObjectId;
  location?: string;
  createdAt: Date;
}

const propertySchema = new Schema<IProperty>({
  title: {
    type: String,
    required: true
  },
  description: String,
  rent: {
    type: Number,
    required: true
  },
  amenities: [String],
  ownerContact: {
    type: String,
    required: true
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  location: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Property: Model<IProperty> = mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);

export default Property;
