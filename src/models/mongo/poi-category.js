import Mongoose from "mongoose";

const { Schema } = Mongoose;

const POICategorySchema = new Schema({
  title: String,
  description: String,
});

export const POICategory = Mongoose.model("POICategory", POICategorySchema);
