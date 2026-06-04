import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOtp extends Document {
  identifier: string; // Email or Phone Number
  otp: string;
  createdAt: Date;
}

const OtpSchema: Schema<IOtp> = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL Index for automatic deletion after 5 minutes (300 seconds)
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);

export default Otp;
