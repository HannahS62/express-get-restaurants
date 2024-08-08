const request = require("supertest");
const app = require("./src/app.js");
const db = require("./db/connection.js");
const { Restaurant } = require("./models/index.js");
const syncSeed = require("./seed.js");
const { check, validationResult } = require("express-validator");
let restQuantity;

beforeAll(async () => {
  await syncSeed();
  const restaurants = await Restaurant.findAll({});
  restQuantity = restaurants.length;
});
afterEach(async () => {
  await db.truncate({ cascade: true }); // cascade will remove assosiated data
  await syncSeed();
  const restaurants = await Restaurant.findAll({});
  restQuantity = restaurants.length;
});

describe("./restaurants endpoint", () => {
  it("returns 200 status code", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toBe(200);
  });

  it("returns an array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    const responseData = JSON.parse(response.text);
    expect(Array.isArray(responseData)).toBe(true);
  });
  it("returns the correct number of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    const responseData = JSON.parse(response.text);
    expect(responseData.length).toBe(restQuantity);
  });
  it("returns the correct restaurant data", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body).toContainEqual(
      expect.objectContaining({
        id: 1,
        name: "AppleBees",
        location: "Texas",
        cuisine: "FastFood",
      })
    );
  });
  it("returns the correct restaurant", async () => {
    const response = await request(app).get("/restaurants/1");
    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        name: "AppleBees",
        location: "Texas",
        cuisine: "FastFood",
      })
    );
  });
  it("returns the updated restaurant array", async () => {
    const response = await request(app).post("/restaurants").send({
      name: "BeefyBoys",
      location: "Shrewsbury",
      cuisine: "BBQ",
    });
    expect(response.body.length).toEqual(restQuantity + 1);
  });

  it("should update first item in the database", async () => {
    const response = await request(app).put("/restaurants/1").send({
      name: "AppleBees",
      location: "LA",
      cuisine: "FastFood",
    });
    restaurant = await Restaurant.findByPk(1);
    expect(restaurant.location).toEqual("LA");
  });

  //   it("should delete db enrty by id", async () => {
  //     const response = await request(app).delete("/restaurants/1");
  //     const restaurants = await Restaurant.findAll({});
  //     expect(restaurants.length).toEqual(restQuantity);
  //     expect(restaurants[0].id).not.toEqual(1);
  //   });
});

describe("restaurant Express Validation", () => {
  it("returns 201 status code when correct data passed", async () => {
    const response = await request(app)
      .post("/restaurants")
      .set("Content-Type", "application/json")
      .send({
        name: "Jive",
        location: "Norwich",
        cuisine: "Mexican",
      });
    expect(response.statusCode).toBe(201);
  });
  it("returns an error if name is missing", async () => {
    const response = await request(app)
      .post("/restaurants")
      .set("Content-Type", "application/json")
      .send({
        location: "Norwich",
        cuisine: "Mexican",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "name",
        }),
      ])
    );
  });
  it("returns an error if location is missing", async () => {
    const response = await request(app)
      .post("/restaurants")
      .set("Content-Type", "application/json")
      .send({
        name: "Jive",
        cuisine: "Mexican",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "location",
        }),
      ])
    );
  });
  it("returns an error if cuisine is missing", async () => {
    const response = await request(app)
      .post("/restaurants")
      .set("Content-Type", "application/json")
      .send({
        name: "Jive",
        location: "Norwich",
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "cuisine",
        }),
      ])
    );
  });
});
