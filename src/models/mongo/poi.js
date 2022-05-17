import Mongoose from "mongoose";

const { Schema } = Mongoose;

const POISchema = new Schema({
  title: String,
  description: String,
  latitude: Number,
  longitude: Number,
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "POICategory",
    },
  ],
  creatorid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
export const POI = Mongoose.model("POI", POISchema);
