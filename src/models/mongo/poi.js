import Mongoose from "mongoose";

const { Schema } = Mongoose;

const POISchema = new Schema({
  title: String,
  description: String,
  latitude: Number,
  longitude: Number,
  images: [{ src: String }],
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "POICategory",
    },
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
export const POI = Mongoose.model("POI", POISchema);
