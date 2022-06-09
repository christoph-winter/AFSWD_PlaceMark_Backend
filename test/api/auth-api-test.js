import { assert } from "chai";
import { appService } from "./app-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { adminCredentials, adminUser, michael, michaelCredentials, ryan, ryanCredentials } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    await appService.clearAuth();
    await appService.createUser(adminUser);
    await appService.authenticate(adminCredentials);
    await appService.deleteAllUsers();
  });
  teardown(async () => {
    await appService.clearAuth();
    await appService.createUser(ryan);
    await appService.authenticate(ryanCredentials);
    await appService.deleteAllUsers();
  });
  test("authenticate", async () => {
    const returnedUser = await appService.createUser(michael);
    const response = await appService.authenticate(michaelCredentials);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await appService.createUser(michael);
    const response = await appService.authenticate(michaelCredentials);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.username, returnedUser.username);
    assert.equal(userInfo.userId, returnedUser._id);
  });
  test("check Unauthorized", async () => {
    await appService.clearAuth();
    try {
      await appService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
