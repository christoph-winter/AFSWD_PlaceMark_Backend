import { assert } from "chai";
import { appService } from "./app-service.js";
import { arena, jahnstadion, michael, testPOIs } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

const POIs = new Array(testPOIs.length);
let arenaCategory;
let michaelUser;
suite("POI API tests", () => {
  setup(async () => {
    await appService.deleteAllUsers();
    michaelUser = await appService.createUser(michael);
    await appService.deleteAllCategories();
    arenaCategory = await appService.createCategory(arena);
    await appService.deleteAllPOIs();
    for (let i = 0; i < POIs.length; i += 1) {
      testPOIs[i].creator = michaelUser._id;
      testPOIs[i].categories = [arenaCategory._id];
      // eslint-disable-next-line no-await-in-loop
      POIs[i] = await appService.createPOI(testPOIs[i]);
    }
  });
  teardown(async () => {});

  test("create a new POI", async () => {
    const POIWithCatAndUser = jahnstadion;
    POIWithCatAndUser.categories = [arenaCategory._id];
    POIWithCatAndUser.creator = michaelUser._id;
    const newPOI = await appService.createPOI(POIWithCatAndUser);
    assertSubset(POIWithCatAndUser, newPOI);
    assert.isDefined(newPOI._id);
  });
  test("delete all POIs", async () => {
    let returnedPOI = await appService.getAllPOIs();
    assert.equal(returnedPOI.length, POIs.length);
    await appService.deleteAllPOIs();
    returnedPOI = await appService.getAllPOIs();
    assert.equal(returnedPOI.length, 0);
  });
  test("delete one POI", async () => {
    await appService.deletePOI(POIs[1]._id);
    const returnedPOI = await appService.getAllPOIs();
    assert.equal(returnedPOI.length, testPOIs.length - 1);
    try {
      const deletedPOI = await appService.getPOI(POIs[1]._id);
      assert.fail();
    } catch (e) {
      console.log(e.response.data.message);
      assert.equal(e.response.data.statusCode, 404);
    }
  });
  test("get a POI", async () => {
    const returnedPOI = await appService.getPOI(POIs[1]._id);
    assert.deepEqual(POIs[1], returnedPOI);
  });
  test("get a POI - bad id", async () => {
    try {
      const returnedPOI = await appService.getPOI("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 404);
    }
  });
  test("update one POI", async () => {
    const newCategory = arenaCategory;
    const newTitle = "small theatre in Regensburg";
    const returnedPOI = await appService.updatePOI(POIs[1]._id, { categories: [newCategory._id], title: newTitle });
    assert.equal(returnedPOI.categories[0], newCategory._id);
    assert.equal(returnedPOI.title, newTitle);
    assert.notEqual(returnedPOI.categories[0], POIs[1].categories[0]);
    const allPOI = await appService.getAllPOIs();
    assert.equal(allPOI.length, POIs.length);
  });
});
