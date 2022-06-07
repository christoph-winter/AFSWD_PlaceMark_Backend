import { assert } from "chai";
import { appService } from "./app-service.js";
import { michael, michaelCredentials, ryan, ryanCredentials, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";

const users = new Array(testUsers.length);
suite("User API tests", () => {
  setup(async () => {
    await appService.clearAuth();
    await appService.createUser(ryan);
    await appService.authenticate(ryanCredentials);
    await appService.deleteAllUsers();
    users[0] = await appService.createUser(testUsers[0]);
    await appService.authenticate({ email: testUsers[0].email, password: testUsers[0].password });
    for (let i = 1; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[i] = await appService.createUser(testUsers[i]);
    }
  });
  teardown(async () => {
    await appService.clearAuth();
    await appService.createUser(ryan);
    await appService.authenticate(ryanCredentials);
    await appService.deleteAllUsers();
  });

  test("create a new user", async () => {
    const newUser = await appService.createUser(michael);
    assertSubset(michael, newUser);
    assert.isDefined(newUser._id);
  });
  test("delete all users", async () => {
    let returnedUsers = await appService.getAllUsers();
    assert.equal(returnedUsers.length, users.length);
    await appService.deleteAllUsers();
    await appService.createUser(michael);
    await appService.authenticate(michaelCredentials);
    returnedUsers = await appService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
    assertSubset(returnedUsers[0], michael);
  });
  test("delete one user", async () => {
    await appService.deleteUser(users[1]._id);
    const returnedUsers = await appService.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    try {
      const deletedUser = await appService.getUser(users[1]._id);
      assert.fail();
    } catch (e) {
      assert(e.response.data.message === "No User with this id", "Incorrect response message");
    }
  });
  test("get a user", async () => {
    const returnedUser = await appService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });
  test("get a user - bad id", async () => {
    try {
      const returnedUser = await appService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });
  test("update one user", async () => {
    const newFirstName = "Angela";
    const returnedUser = await appService.updateUser(users[1]._id, { firstname: newFirstName });
    assert.equal(returnedUser.firstname, newFirstName);
    assert.notEqual(returnedUser.firstname, users[1].firstname);
    const allUsers = await appService.getAllUsers();
    assert.equal(allUsers.length, users.length);
  });
});
