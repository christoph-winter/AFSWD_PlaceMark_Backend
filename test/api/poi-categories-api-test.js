import { assert } from "chai";
import { appService } from "./app-service.js";
import { arena, michael, michaelCredentials, ryan, ryanCredentials, testPOICategories } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

const categories = new Array(testPOICategories.length);
suite("POI Category API tests", () => {
  setup(async () => {
    await appService.clearAuth();
    await appService.createUser(ryan);
    await appService.authenticate(ryanCredentials);
    await appService.deleteAllCategories();
    await appService.deleteAllUsers();
    await appService.createUser(michael);
    await appService.authenticate(michaelCredentials);
    for (let i = 0; i < categories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      categories[i] = await appService.createCategory(testPOICategories[i]);
    }
  });
  teardown(async () => {
    await appService.clearAuth();
    await appService.createUser(ryan);
    await appService.authenticate(ryanCredentials);
    await appService.deleteAllUsers();
  });

  test("create a new Category", async () => {
    const newCategory = await appService.createCategory(arena);
    assertSubset(arena, newCategory);
    assert.isDefined(newCategory._id);
  });
  test("delete all Categories", async () => {
    let returnedCategory = await appService.getAllCategories();
    assert.equal(returnedCategory.length, categories.length);
    await appService.deleteAllCategories();
    returnedCategory = await appService.getAllCategories();
    assert.equal(returnedCategory.length, 0);
  });
  test("delete one Category", async () => {
    await appService.deleteCategory(categories[1]._id);
    const returnedCategory = await appService.getAllCategories();
    assert.equal(returnedCategory.length, testPOICategories.length - 1);
    try {
      const deletedCategory = await appService.getCategory(categories[1]._id);
      assert.fail();
    } catch (e) {
      assert.equal(e.response.data.statusCode, 404);
    }
  });
  test("get a Category", async () => {
    const returnedCategory = await appService.getCategory(categories[1]._id);
    assert.deepEqual(categories[1], returnedCategory);
  });
  test("get a Category - bad id", async () => {
    try {
      const returnedCategory = await appService.getCategory("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 404);
    }
  });
  test("update one Category", async () => {
    const newTitle = "Theatre";
    const returnedCategory = await appService.updateCategory(categories[1]._id, { title: newTitle });
    assert.equal(returnedCategory.title, newTitle);
    assert.notEqual(returnedCategory.title, categories[1].title);
    const allCategories = await appService.getAllCategories();
    assert.equal(allCategories.length, categories.length);
  });
});
