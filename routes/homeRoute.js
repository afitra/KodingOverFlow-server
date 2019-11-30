const Route = require("express").Router(),
    controller = require("../controllers/userContoller");

Route.post("/register", controller.register);
Route.post("/login", controller.login);
Route.post("/google", controller.login);

module.exports = Route;