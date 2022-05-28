import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";
import { jahnstadion, testPOIs, michael, arena } from "../fixtures.js";

suite("POI Model tests", () => {
  let michaelUser = null;
  let arenaCategory = null;
  suiteSetup(async () => {
    db.init();
    await db.userStore.deleteAll();
    await db.poiCategoryStore.deleteAllCategories();
    await db.poiStore.deleteAll();
  });
  setup(async () => {
    michaelUser = await db.userStore.addUser(michael);
    arenaCategory = await db.poiCategoryStore.addCategory(arena);
    // Inconsistent and somewhat non-deterministic behaviour. Seems like addPOI ins some cases does not wait till addUser or addCategory has finished.
    for (let i = 0; i < testPOIs.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPOIs[i] = await db.poiStore.addPOI(testPOIs[i], michaelUser._id, [arenaCategory._id]);
    }
  });
  test("create a POI", async () => {
    const newPOI = await db.poiStore.addPOI(jahnstadion, michaelUser._id, [arenaCategory._id]);
    assertSubset(newPOI, jahnstadion);
    assert.isDefined(newPOI._id);
  });
  test("delete all POIs", async () => {
    let returnedPOIs = await db.poiStore.getAllPOIs();
    assert.equal(returnedPOIs.length, testPOIs.length);
    await db.poiStore.deleteAll();
    returnedPOIs = await db.poiStore.getAllPOIs();
    assert.equal(returnedPOIs.length, 0);
  });
  test("get a POI - success", async () => {
    const poi = await db.poiStore.addPOI(jahnstadion);
    const returnedPOI = await db.poiStore.getPOIById(poi._id);
    assertSubset(jahnstadion, returnedPOI);
  });
  test("delete One POI - success", async () => {
    const id = testPOIs[0]._id;
    await db.poiStore.deletePOIById(id);
    const returnedPOI = await db.poiStore.getAllPOIs();
    assert.equal(returnedPOI.length, testPOIs.length - 1);
    const deletedPOI = await db.poiStore.getPOIById(id);
    assert.isNull(deletedPOI);
  });
  test("get a POI - bad params", async () => {
    assert.isNull(await db.poiStore.getPOIById(""));
    assert.isNull(await db.poiStore.getPOIById());
  });

  test("delete One POI - fail", async () => {
    await db.poiStore.deletePOIById("no-valid-id");
    const allPOIs = await db.poiStore.getAllPOIs();
    assert.equal(testPOIs.length, allPOIs.length);
  });
  test("update One POI - success", async () => {
    const newPOI = await db.poiStore.addPOI(jahnstadion, michaelUser._id, [arenaCategory._id]);
    const updatedDesc = "new test description";
    await db.poiStore.updatePOIDescription(newPOI._id, updatedDesc);
    const returnedPOI1 = await db.poiStore.getPOIById(newPOI._id);
    assert.equal(returnedPOI1.description, updatedDesc);
    const updatedTitle = "new test title";
    await db.poiStore.updatePOITitle(newPOI._id, updatedTitle);
    const returnedPOI2 = await db.poiStore.getPOIById(newPOI._id);
    assert.equal(returnedPOI2.title, updatedTitle);
    const updatedLat = 3.0;
    const updatedLong = 4.0;
    await db.poiStore.updatePOILocation(newPOI._id, updatedLat, updatedLong);
    const returnedPOI3 = await db.poiStore.getPOIById(newPOI._id);
    assert.equal(returnedPOI3.latitude, updatedLat);
    assert.equal(returnedPOI3.longitude, updatedLong);
  });
  test("update One POI - success", async () => {
    const newPOI = await db.poiStore.addPOI(jahnstadion, michaelUser._id, [arenaCategory._id]);
    const updatedDesc = "new test description";
    await db.poiStore.updatePOIDescription("bad id", updatedDesc);
    const returnedPOI1 = await db.poiStore.getPOIById(newPOI._id);
    assert.equal(returnedPOI1.description, newPOI.description);
    const updatedTitle = "new test title";
    await db.poiStore.updatePOITitle("not valid", updatedTitle);
    const returnedPOI2 = await db.poiStore.getPOIById(newPOI._id);
    assert.equal(returnedPOI2.title, newPOI.title);
    const updatedLat = 3.0;
    const updatedLong = 4.0;
    await db.poiStore.updatePOILocation("bad id", updatedLat, updatedLong);
    const returnedPOI3 = await db.poiStore.getPOIById(newPOI._id);
    assert.equal(returnedPOI3.latitude, newPOI.latitude);
    assert.equal(returnedPOI3.longitude, newPOI.longitude);
  });
  teardown(async () => {
    await db.userStore.deleteAll();
    await db.poiCategoryStore.deleteAllCategories();
    await db.poiStore.deleteAll();
  });
});
