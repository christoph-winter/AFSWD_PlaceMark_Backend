import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { michael, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("User Model tests", () => {
  setup(async () => {
    db.init();
    await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(michael);
    assertSubset(newUser, michael);
  });
  test("delete all users", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });
  test("get a user - success", async () => {
    const user = await db.userStore.addUser(michael);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUser2);
    const returnedUser3 = await db.userStore.getUserByUsername(user.username);
    assert.deepEqual(user, returnedUser3);
  });
  test("delete One User - success", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);
  });
  test("get a user - bad params", async () => {
    assert.isNull(await db.userStore.getUserByEmail(""));
    assert.isNull(await db.userStore.getUserById(""));
    assert.isNull(await db.userStore.getUserById());
  });
  test("delete One User - fail", async () => {
    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(testUsers.length, allUsers.length);
  });
  test("update One User - success", async () => {
    const beforeUpdate = await db.userStore.getUserById(testUsers[0]._id);
    const updatedUser = await db.userStore.updateUser(testUsers[0]._id, { firstname: "Angela" });
    assert.notEqual(beforeUpdate.firstname, updatedUser.firstname);
    assert.ok(beforeUpdate._id.equals(updatedUser._id));
    assert.equal(beforeUpdate.email, updatedUser.email);
    assert.equal(beforeUpdate.lastname, updatedUser.lastname);
  });
  test("update One User - not exists", async () => {
    const returnedUser = await db.userStore.addUser(michael);
    await db.userStore.deleteUserById(returnedUser._id);
    assert.isNull(await db.userStore.getUserById(returnedUser._id));
    const updatedUser = await db.userStore.updateUser(returnedUser._id, { firstname: "Toby" });
    assert.isNull(updatedUser);
  });
});
