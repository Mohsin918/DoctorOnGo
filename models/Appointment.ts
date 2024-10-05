"use server"
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',  // Referencing the Patient model
    required: true,
  },
    userId: {
      type: String,
      required: true,

    },
  schedule: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  doctor: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'cancelled'],
    required: true,
  },
  cancellationReason: {
    type: String,
  },
});

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);


export default Appointment;
