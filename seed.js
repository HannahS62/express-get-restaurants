//const Restaurant = require("./models/Restaurant");
const { Restaurant, Menu, Item } = require("./models/index");
const { seedRestaurant, seedMenu, seedItem } = require("./seedData");
const db = require("./db/connection");

const syncSeed = async () => {
  await db.sync({ force: true });
  await Restaurant.bulkCreate(seedRestaurant);
  await Menu.bulkCreate(seedMenu);
  await Item.bulkCreate(seedItem);
};

syncSeed();

module.exports = syncSeed;
