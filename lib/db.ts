import mongoose from "mongoose";
import { buffer } from "stream/consumers";

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
    throw new Error("Please define the mongodb url in the env file");

}

let cached = global.mongoose;
//ek global chache mein store karta hai taaki baar baar connection na bane
//mongoose exist nhi karta toh ek naya object bana deta hai

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
}

export async function connectToDB(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        }
    

    cached.promise = mongoose
        .connect(MONGODB_URL, opts)
        .then(() => mongoose.connection);
 }

 try {
    cached.conn = await cached.promise
 }catch(err) {
    cached.promise = null
    throw err
 }
 
 return cached.conn;
 
}