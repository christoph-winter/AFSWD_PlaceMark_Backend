import { POI } from "./poi.js";
import { User } from "./user.js";

export const POIMongoStore = {
  async getAllPOIs() {
    const poi = await POI.find().lean().populate("creator", "-password").populate("categories");
    return poi;
  },
  async getPOIById(id) {
    try {
      const poi = await POI.findOne({ _id: id }).lean().populate("creator", "-password").populate("categories");
      return poi;
    } catch (err) {
      console.log(err.message);
      return null;
    }
  },
  async addPOI(poi, creator, categories) {
    poi.creator = creator;
    poi.categories = categories;
    const newPOI = new POI(poi);
    const poiObj = await newPOI.save();
    const u = await this.getPOIById(poiObj._id);
    return u;
  },
  async updatePOITitle(poiId, title) {
    try {
      await POI.updateOne({ _id: poiId }, { title: title });
    } catch (e) {
      console.log(e.message);
    }
  },
  async updatePOIDescription(poiId, description) {
    try {
      await POI.updateOne({ _id: poiId }, { description: description });
    } catch (e) {
      console.log(e.message);
    }
  },
  async updatePOILocation(poiId, lat, long) {
    try {
      await POI.updateOne({ _id: poiId }, { latitude: lat, longitude: long });
    } catch (e) {
      console.log(e.message);
    }
  },
  async updatePOI(id, newValues) {
    const poi = await POI.findOneAndUpdate({ _id: id }, { $set: newValues }, { new: true, upsert: false });
    return poi;
  },
  async getPOIByCategory(category) {
    const poi = await POI.find({ categories: { $elemMatch: { _id: { $gte: category._id } } } }).lean();
    return poi;
  },
  async getPOIByCreator(creator) {
    const poi = await POI.find({ creatorid: creator._id }).lean();
    return poi;
  },
  async deletePOIById(id) {
    try {
      await POI.deleteOne({ _id: id });
    } catch (error) {
      console.log(error.message);
    }
  },
  async deleteAll() {
    await POI.deleteMany({});
  },
};
