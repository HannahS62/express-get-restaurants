const Sequelize = require("sequelize");
const db = require("../db/connection.js");

const Menu = db.define("Menu", {
  title: Sequelize.STRING,
});

module.exports = Menu;
