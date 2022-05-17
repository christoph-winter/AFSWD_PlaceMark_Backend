import { POI } from "./poi.js";

export const POIMongoStore = {
  async getAllPOIs() {
    const poi = await POI.find().lean();
    return poi;
  },
  async getPOIById(id) {
    if (id) {
      const poi = await POI.findOne({ _id: id }).lean();
      return poi;
    }
    return null;
  },
  async addPOI(poi, creatorId, categories) {
    poi.creatorid = creatorId;
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
      console.log("bad id");
    }
  },
  async updatePOIDescription(poiId, description) {
    try {
      await POI.updateOne({ _id: poiId }, { description: description });
    } catch (e) {
      console.log("bad id");
    }
  },
  async updatePOILocation(poiId, lat, long) {
    try {
      await POI.updateOne({ _id: poiId }, { latitude: lat, longitude: long });
    } catch (e) {
      console.log("bad id");
    }
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
      console.log("bad id");
    }
  },
  async deleteAll() {
    await POI.deleteMany({});
  },
};
