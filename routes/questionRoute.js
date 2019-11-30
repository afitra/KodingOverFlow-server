const Route = require("express").Router(),
    auth = require('../middlewares/auth'),
    controller = require("../controllers/questionController");

Route.get("/:id", controller.read);
Route.get("/", controller.read);

Route.use('', auth.authentication);

Route.post("/", controller.create);
Route.put("/:id", controller.update);
Route.delete("/:id", controller.delete);

module.exports = Route;