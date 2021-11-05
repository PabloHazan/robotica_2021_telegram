import { connect } from "mongoose";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
export const initDb = async () => {
    await connect(uri);
    console.log('Conectado a la DB')
}