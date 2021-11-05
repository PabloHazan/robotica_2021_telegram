import mongoose from "mongoose";

const NotaShema = new mongoose.Schema({
    mensaje: String,
    userId: Number,
});

export const Nota = mongoose.model('Nota', NotaShema);
