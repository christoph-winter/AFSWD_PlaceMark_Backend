import { POICategory } from "./poi-category.js";
import { POI } from "./poi.js";

export const POICategoryMongoStore = {
  async getAllCategories() {
    const categorys = await POICategory.find().lean();
    return categorys;
  },

  async getCategoryById(id) {
    try {
      const category = await POICategory.findOne({ _id: id }).lean();
      return category;
    } catch (e) {
      console.log(e.message);
    }
    return null;
  },
  async getCategoryByTitle(title) {
    try {
      const category = await POICategory.findOne({ title: title }).lean();
      return category;
    } catch (e) {
      console.log(e.message);
    }
    return null;
  },

  async addCategory(category) {
    const newCategory = new POICategory(category);
    const categoryObj = await newCategory.save();
    return this.getCategoryById(categoryObj._id);
  },
  async updateCategory(id, newValues) {
    const category = await POICategory.findOneAndUpdate({ _id: id }, { $set: newValues }, { new: true, upsert: false });
    return category;
  },
  async updateCategoryDescription(id, description) {
    try {
      await POICategory.updateOne({ _id: id }, { description: description });
    } catch (e) {
      console.log(e.message);
    }
  },
  async deleteCategoryById(id) {
    try {
      await POICategory.deleteOne({ _id: id });
    } catch (error) {
      console.log(error.message);
    }
  },

  async deleteAllCategories() {
    await POICategory.deleteMany({});
  },
};
