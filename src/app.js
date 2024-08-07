const express = require("express");
const app = express();
const { Restaurant, Menu, Item } = require("../models/index.js");
const db = require("../db/connection");

//Call app.use() and pass it express.json() so that we can parse the request body that contains JSON objects.
app.use(express.json());

//Call app.use() and pass it express.urlencoded() so that we can parse the request body with urlencoded values.
app.use(express.urlencoded({ extended: true }));

app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.findAll({
    // include: {
    //   model: Menu,
    //   include: [
    //     {
    //       model: Item,
    //     },
    //   ],
    // },
  });
  res.json(restaurants);
});

app.get("/restaurants/:id", async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: "restaurant not found" });
  }
});

// Create an Express route for creating (adding) a new restaurant on your restaurant database.
app.post("/restaurants", async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ error: "Missing restaurant name" });
    return;
  }
  if (!req.body.location) {
    res.status(400).json({ error: "Missing restaurant location" });
    return;
  }
  if (!req.body.cuisine) {
    res.status(400).json({ error: "Missing restaurant cuisine" });
    return;
  }

  const restaurant = await Restaurant.create({
    name: req.body.name,
    location: req.body.location,
    cuisine: req.body.cuisine,
  });
  const restaurants = await Restaurant.findAll({});
  res.status(201).json(restaurants);
});

//Create an express route for updating (replacing) an existing restaurant with a new restaurant in your restaurant database based on ID in the route.
//- For example, PUT /restaurant/2 would update the restaurant with an ID of 2.

app.put("/restaurants/:id", async (req, res) => {
  const updatedRestaurant = await Restaurant.update(req.body, {
    where: { id: req.params.id },
  });
  res.json(updatedRestaurant);
});

//DELETE

app.delete("/restaurants/:id", async (req, res) => {
  const restaurant = await Restaurant.findByPk(req.params.id);
  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
  }
  await restaurant.destroy();
  res.status(204).send;
});

module.exports = app;
