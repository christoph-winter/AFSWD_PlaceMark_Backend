import { POICategory } from "./poi-category.js";

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
      console.log("bad id");
    }
    return null;
  },
  async getCategoryByTitle(title) {
    try {
      const category = await POICategory.findOne({ title: title }).lean();
      return category;
    } catch (e) {
      console.log("bad id");
    }
    return null;
  },

  async addCategory(category) {
    const newCategory = new POICategory(category);
    const categoryObj = await newCategory.save();
    return this.getCategoryById(categoryObj._id);
  },
  async updateCategoryDescription(id, description) {
    try {
      await POICategory.updateOne({ _id: id }, { description: description });
    } catch (e) {
      console.log("bad id");
    }
  },
  async deleteCategoryById(id) {
    try {
      await POICategory.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllCategories() {
    await POICategory.deleteMany({});
  },
};
