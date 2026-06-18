import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooking extends Document {
  studentId: mongoose.Types.ObjectId;
  pgId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  visitDate?: Date;
  visitTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
    },
    visitDate: {
      type: Date,
    },
    visitTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Targeted index for querying a student's bookings
BookingSchema.index({ studentId: 1, createdAt: -1 });
// Targeted index for an owner's bookings
BookingSchema.index({ ownerId: 1, createdAt: -1 });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
