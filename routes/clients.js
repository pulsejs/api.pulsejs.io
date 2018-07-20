const domains = function (Pulse) {
	const express = require('express');
	const uuid    = require('uuid');
	const router  = express.Router();
	const models  = {
		client: require('../models/client')(Pulse),
		application: require('../models/application')(Pulse)
	};

	router.get('/:apiid', function (req, res, next) {
		let params = [res.params.AuthUser.id, req.params.apiid];
		models.application.getApplication(params, function (error, application) {
			if(error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			if(!application.length) {
				return res.status(404).end(JSON.stringify({
					success: false,
					errors: [{
						code: 404,
						message: 'This application is not found'
					}]
				}));
			}

			models.client.getClients(params, function (e, clients) {
				if(e) {
					return res.status(500).end(JSON.stringify({
						success: false,
						errors: [{
							code: e.errno,
							message: e.sqlMessage
						}]
					}));
				}

				return res.end(JSON.stringify({
					success: true,
					data: clients
				}));
			});
		});
	});

	router.delete('/:apiid/:uuid', function (req, res, next) {
		let params = [res.params.AuthUser.id, req.params.apiid, req.params.uuid, req.params.uuid];

		models.application.getApplication(params, function (error, application) {
			if(error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			if(!application.length) {
				return res.status(404).end(JSON.stringify({
					success: false,
					errors: [{
						code: 404,
						message: 'This application is not found'
					}]
				}));
			}

			models.client.superquite(params, function (e, rta) {
				if(e) {
					return res.status(500).end(JSON.stringify({
						success: false,
						errors: [{
							code: e.errno,
							message: e
						}]
					}));
				}

				if(!rta.affectedRows) {
					return res.status(404).end(JSON.stringify({
						success: false,
						errors: [{
							code: 404,
							message: 'This subject does not exist'
						}]
					}));
				}

				return res.status(200).end(JSON.stringify({
					success: true,
					data: {
						code: 200,
						message: 'The subject was deleted successfully'
					}
				}));
			});
		});
	});

	return router;
};

module.exports = domains;