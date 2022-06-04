import { User } from "./user.js";

export const userMongoStore = {
  async getAllUsers() {
    const user = await User.find().lean();
    return user;
  },
  async getUserById(id) {
    if (id) {
      const user = await User.findOne({ _id: id }).lean();
      return user;
    }
    return null;
  },
  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },
  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    return user;
  },
  async getUserByUsername(username) {
    const user = await User.findOne({ username: username }).lean();
    return user;
  },
  async updateUser(id, newValues) {
    const user = await User.findOneAndUpdate({ _id: id }, { $set: newValues }, { new: true, upsert: false });
    return user;
  },
  async deleteUserById(id) {
    try {
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log(error.message);
    }
  },
  async deleteAll() {
    await User.deleteMany({});
  },
};
