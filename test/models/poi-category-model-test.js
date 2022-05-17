import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { arena, testPOICategories } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("POI Category Model tests", () => {
  setup(async () => {
    db.init();
    await db.poiCategoryStore.deleteAllCategories();
    for (let i = 0; i < testPOICategories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOICategories[i] = await db.poiCategoryStore.addCategory(testPOICategories[i]);
    }
  });

  test("create a Category", async () => {
    const newCategory = await db.poiCategoryStore.addCategory(arena);
    assertSubset(newCategory, arena);
  });
  test("delete all Categories", async () => {
    let returnedCategories = await db.poiCategoryStore.getAllCategories();
    assert.equal(returnedCategories.length, testPOICategories.length);
    await db.poiCategoryStore.deleteAllCategories();
    returnedCategories = await db.poiCategoryStore.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });
  test("get a Category - success", async () => {
    const POICategory = await db.poiCategoryStore.addCategory(arena);
    const returnedPOICategory = await db.poiCategoryStore.getCategoryById(POICategory._id);
    assert.deepEqual(POICategory, returnedPOICategory);
  });
  test("delete One Category - success", async () => {
    await db.poiCategoryStore.deleteCategoryById(testPOICategories[0]._id);
    const returnedPOICategories = await db.poiCategoryStore.getAllCategories();
    assert.equal(returnedPOICategories.length, testPOICategories.length - 1);
    const deletedPOICategory = await db.poiCategoryStore.getCategoryById(testPOICategories[0]._id);
    assert.isNull(deletedPOICategory);
  });
  test("get a Category - bad params", async () => {
    assert.isNull(await db.poiCategoryStore.getCategoryById("bad-id"));
  });
  test("delete One Category - fail", async () => {
    await db.poiCategoryStore.deleteCategoryById("bad-id");
    const allPOICategories = await db.poiCategoryStore.getAllCategories();
    assert.equal(testPOICategories.length, allPOICategories.length);
  });
});
