import { assert } from "chai";
import { appService } from "./app-service.js";
import { adminCredentials, adminUser, michael, michaelCredentials, ryan, ryanCredentials, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

const users = new Array(testUsers.length);
suite("User API tests", () => {
  setup(async () => {
    // Cannot create admin user when no admin is logged in. --> So that test is successful: comment out check if user is admin in api
    await appService.clearAuth();
    await appService.createUser(adminUser);
    await appService.authenticate(adminCredentials);
    await appService.deleteAllUsers();
    await appService.createUser(adminUser);
    await appService.authenticate(adminCredentials);
    for (let i = 0; i < testUsers.length; i += 1) {
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
    assert.notEqual(returnedUsers.length, 0);
    await appService.deleteAllUsers();
    await appService.createUser(adminUser);
    await appService.authenticate(adminCredentials);
    returnedUsers = await appService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
    assertSubset(returnedUsers[0], adminUser);
  });
  test("delete one user", async () => {
    const returnedUsers1 = await appService.getAllUsers();
    await appService.deleteUser(users[1]._id);
    const returnedUsers2 = await appService.getAllUsers();
    assert.equal(returnedUsers1.length - 1, returnedUsers2.length);
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
    const allUsersBefore = await appService.getAllUsers();
    const newFirstName = "Angela";
    const returnedUser = await appService.updateUser(users[1]._id, { firstname: newFirstName, isadmin: true });
    assert.equal(returnedUser.firstname, newFirstName);
    assert.notEqual(returnedUser.firstname, users[1].firstname);
    const allUsersAfter = await appService.getAllUsers();
    assert.equal(allUsersBefore.length, allUsersAfter.length);
  });
  test("do action unauthorized", async () => {
    await appService.deleteAllUsers();
    await appService.clearAuth();
    const newUser = await appService.createUser(michael); // michael is not an admin user
    await appService.authenticate(michaelCredentials);
    try {
      await appService.deleteAllUsers();
      assert.fail();
    } catch (e) {
      assert.equal(e.response.data.statusCode, 403);
    }
    try {
      await appService.deleteUser(users[0]._id);
      assert.fail();
    } catch (e) {
      assert.equal(e.response.data.statusCode, 403);
    }
    try {
      await appService.updateUser(users[0]._id, { username: "Bad Title" });
      assert.fail();
    } catch (e) {
      assert.equal(e.response.data.statusCode, 403);
    }
    try {
      await appService.updateUser(newUser._id, { isadmin: true });
      assert.fail();
    } catch (e) {
      assert.equal(e.response.data.statusCode, 403);
    }
  });
  test("do action authorized", async () => {
    await appService.deleteAllUsers();
    await appService.clearAuth();
    const newUser = await appService.createUser(michael); // michael is not an admin user
    await appService.authenticate(michaelCredentials);
    await appService.updateUser(newUser._id, { firstname: "Peter" });
    const returned = await appService.getUser(newUser._id);
    assert.equal("Peter", returned.firstname);
  });
});
