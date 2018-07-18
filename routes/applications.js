const applications = function (Pulse) {
	const express = require('express');
	const uuid    = require('uuid');
	const router  = express.Router();
	const models  = {
		applications: require('../models/application')(Pulse),
		domains: require('../models/application.domain')(Pulse)
	};

	router.get('/', function (req, res, next) {
		let Filters = {
			user: res.params.AuthUser.id,
			start: parseInt(res.params.start) || 0,
			limit: parseInt(res.params.limit) || 30
		};

		models.applications.getList([Filters.user, Filters.limit, Filters.start], function (error, rows) {

			if (error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			res.end(JSON.stringify({
				success: true,
				data: rows
			}));
		});
	});

	router.get('/:apiid', function (req, res, next) {
		let params = [res.params.AuthUser.id, req.params.apiid];

		models.applications.getApplication(params, function (error, rows) {

			if (error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			if (!rows.length) {
				return res.status(404).end(JSON.stringify({
					success: false,
					errors: [{
						code: 404,
						message: 'This application is not found'
					}]
				}));
			}

			models.domains.getDomainsByAPI(params, function (error, domains) {
				if (error) {
					return res.status(500).end(JSON.stringify({
						success: false,
						errors: [{
							code: error.errno,
							message: error.sqlMessage
						}]
					}));
				}

				return res.end(JSON.stringify({
					success: true,
					data: Object.assign(rows[0], {domains: domains})
				}));
			});

		});

	});

	router.post('/', function (req, res, next) {
		let params = [res.params.AuthUser.id, uuid(), res.params.name, res.params.url_logo];
		if (!res.params.name || !res.params.name.length) {
			return res.status(400).end(JSON.stringify({
				success: false,
				errors: [{
					code: 400,
					message: 'The information to create the model does not exist or is invalid'
				}]
			}));
		}

		models.applications.setApplication(params, function (error, rows) {
			if (error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			models.applications.getApplication(params, function (e, application) {
				if (e) {
					return res.status(500).end(JSON.stringify({
						success: false,
						errors: [{
							code: e.errno,
							message: e.sqlMessage
						}]
					}));
				}

				return res.status(201).end(JSON.stringify({
					success: true,
					data: application[0]
				}));
			});

		});

	});

	router.put('/:apiid', function (req, res, next) {
		let params = [res.params.name, res.params.url_logo, res.params.AuthUser.id, req.params.apiid];
		if (!res.params.name || !res.params.name.length) {
			return res.status(400).end(JSON.stringify({
				success: false,
				errors: [{
					code: 400,
					message: 'The information to create the model does not exist or is invalid'
				}]
			}));
		}

		models.applications.getApplication([res.params.AuthUser.id, req.params.apiid], function (error, application) {
			if (error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			if (!application.length) {
				return res.status(404).end(JSON.stringify({
					success: false,
					errors: [{
						code: 404,
						message: 'This application is not found'
					}]
				}));
			}

			models.applications.update(params, function (e, result) {
				if (e) {
					return res.status(500).end(JSON.stringify({
						success: false,
						errors: [{
							code: e.errno,
							message: e.sqlMessage
						}]
					}));
				}

				models.applications.getApplication([res.params.AuthUser.id,
													req.params.apiid], function (error, result) {
					return res.status(200).end(JSON.stringify({
						success: true,
						data: result
					}));
				});
			});
		});
	});

	router.delete('/:apiid', function (req, res, next) {
		let params = [res.params.AuthUser.id, req.params.apiid];
		if (!req.params.apiid || !req.params.apiid.length) {
			return res.status(400).end(JSON.stringify({
				success: false,
				errors: [{
					code: 400,
					message: 'The information to create the model does not exist or is invalid'
				}]
			}));
		}

		models.applications.getApplication(params, function (error, application) {
			if (error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			if (!application.length) {
				return res.status(404).end(JSON.stringify({
					success: false,
					errors: [{
						code: 404,
						message: 'This application is not found'
					}]
				}));
			}

			models.applications.delete(params, function (e, result) {
				if (e) {
					return res.status(500).end(JSON.stringify({
						success: false,
						errors: [{
							code: e.errno,
							message: e.sqlMessage
						}]
					}));
				}

				return res.status(200).end(JSON.stringify({
					success: true,
					data: {
						code: 200,
						message: 'The instance was deleted successfully.'
					}
				}));
			});
		});
	});

	return router;
};

module.exports = applications;
