import mongoose from "mongoose";

const PendienteShema = new mongoose.Schema({
    recordatorio: String,
    userId: Number,
    tag: String,
});

export const Pendiente = mongoose.model('Pendiente', PendienteShema);
