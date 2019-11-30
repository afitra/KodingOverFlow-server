const Route = require("express").Router(),
    auth = require('../middlewares/auth'),
    controller = require("../controllers/answerController");

Route.get("/:questionID", controller.read);

Route.use('', auth.authentication);

Route.post("/", controller.create);
Route.put("/:id", controller.update);
Route.delete("/:id", controller.delete);

module.exports = Route;