import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { arena, jahnstadion, testPOICategories, testPOIs } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("POI Category Model tests", () => {
  setup(async () => {
    db.init();
    await db.poiCategoryStore.delete;
    await db.poiCategoryStore.deleteAllCategories();
    for (let i = 0; i < testPOICategories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOICategories[i] = await db.poiCategoryStore.addCategory(testPOICategories[i]);
    }
  });
  test("delete all Categories", async () => {
    let returnedCategories = await db.poiCategoryStore.getAllCategories();
    assert.equal(returnedCategories.length, testPOICategories.length);
    await db.poiCategoryStore.deleteAllCategories();
    returnedCategories = await db.poiCategoryStore.getAllCategories();
    assert.equal(returnedCategories.length, 0);
  });
  test("create a Category", async () => {
    const newCategory = await db.poiCategoryStore.addCategory(arena);
    assertSubset(newCategory, arena);
  });

  test("get a Category - success", async () => {
    const POICategory = await db.poiCategoryStore.addCategory(arena);
    let returnedPOICategory = await db.poiCategoryStore.getCategoryById(POICategory._id);
    assert.deepEqual(POICategory, returnedPOICategory);
    returnedPOICategory = await db.poiCategoryStore.getCategoryByTitle(POICategory.title);
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
  test("update One Category", async () => {
    const newCategory = await db.poiCategoryStore.addCategory(arena);
    const newDesc = "new test description";
    await db.poiCategoryStore.updateCategoryDescription(newCategory._id, newDesc);
    const returnedCategory = await db.poiCategoryStore.getCategoryById(newCategory._id);
    assert.equal(returnedCategory.description, newDesc);
  });
  test("update One POI Category (2) - success", async () => {
    const updatedTitle = "new test title";
    const updatedDesc = "new test description";
    const returnedCategory = await db.poiCategoryStore.updateCategory(testPOICategories[0], { description: updatedDesc, title: updatedTitle });
    assert.deepEqual(returnedCategory.description, updatedDesc);
    assert.deepEqual(returnedCategory.title, updatedTitle);
    const allCategories = await db.poiCategoryStore.getAllCategories();
    assert.equal(testPOICategories.length, allCategories.length);
  });
  test("update One POI Category (2) - failure", async () => {
    const newCategory = await db.poiCategoryStore.addCategory(arena);
    await db.poiCategoryStore.deleteCategoryById(newCategory._id);
    const updatedTitle = "new test title";
    const updatedDesc = "new test description";
    const returnedCategory = await db.poiCategoryStore.updateCategory(newCategory._id, { description: updatedDesc, title: updatedTitle });
    const allCategories = await db.poiCategoryStore.getAllCategories();
    assert.equal(testPOICategories.length, allCategories.length);
    assert.isNull(returnedCategory);
  });
});
