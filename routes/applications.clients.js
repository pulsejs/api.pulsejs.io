const domains = function (Pulse) {
	const express = require('express');
	const uuid    = require('uuid');
	const router  = express.Router();
	const models  = {
		domains: require('../models/application.client')(Pulse)
	};

	router.get('/:apiid', function (req, res, next) {

	});
	return router;
};

module.exports = domains;