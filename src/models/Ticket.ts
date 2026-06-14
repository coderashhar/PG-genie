import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITicket extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema<ITicket> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling model in development
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Ticket;
}

const Ticket: Model<ITicket> =
  mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
