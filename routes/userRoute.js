const Route = require('express').Router(),
    controller = require('../controllers/userContoller');

// NOT YET
Route.put("/:id", controller.update);

module.exports = Route;