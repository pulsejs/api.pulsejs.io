const domains = function (Pulse) {
	const express = require('express');
	const uuid    = require('uuid');
	const router  = express.Router();
	const models  = {
		domains: require('../models/application.domain')(Pulse)
	};

	router.get('/:apiid', function (req, res, next) {
		let params = [res.params.AuthUser.id, req.params.apiid];
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

			if (!domains.length) {
				return res.status(404).end(JSON.stringify({
					success: false,
					errors: [{
						code: 404,
						message: 'This application is not found'
					}]
				}));
			}

			return res.end(JSON.stringify({
				success: true,
				data: domains
			}));
		});
	});

	router.post('/:apiid', function (req, res, next) {
		let domain = res.params.domain_name || '';
		let params = [res.params.AuthUser.id, req.params.apiid, domain];
		let valid  = new RegExp('^((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))?$', 'i');
		if (!domain || !domain.length || !valid.test(domain)) {
			return res.status(400).end(JSON.stringify({
				success: false,
				errors: [{
					code: 400,
					message: 'The domain is not valid'
				}]
			}));
		}

		models.domains.setDomain([req.params.apiid, domain], function (e, row) {
			if (e) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: e.errno,
						message: e.sqlMessage
					}]
				}));
			}

			models.domains.getDomainByID([res.params.AuthUser.id, req.params.apiid,
										  row.insertId], function (error, domain) {
				return res.status(201).end(JSON.stringify({
					success: true,
					data: domain[0]
				}));
			});
		});
	});

	router.put('/:apiid/:id(\\d+)', function (req, res, next) {
		let domain = res.params.domain_name || '';
		let params = [domain, res.params.AuthUser.id, req.params.apiid, req.params.id];

		let valid = new RegExp('^((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))?$', 'i');
		if (!domain || !domain.length || !valid.test(domain)) {
			return res.status(400).end(JSON.stringify({
				success: false,
				errors: [{
					code: 400,
					message: 'The domain is not valid'
				}]
			}));
		}

		models.domains.getDomainByID([res.params.AuthUser.id, req.params.apiid,
									  req.params.id], function (error, domains) {
			if (error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			if (!domains.length) {
				return res.status(404).end(JSON.stringify({
					success: false,
					errors: [{
						code: 404,
						message: 'This domain application is not found'
					}]
				}));
			}

			models.domains.update(params, function (e, status) {
				if (e) {
					return res.status(500).end(JSON.stringify({
						success: false,
						errors: [{
							code: e.errno,
							message: e.sqlMessage
						}]
					}));
				}

				params.shift();

				models.domains.getDomainByID(params, function (error, domain) {
					return res.status(200).end(JSON.stringify({
						success: true,
						data: domain[0]
					}));
				});
			});
		});

	});

	router.delete('/:apiid/:id(\\d+)', function (req, res, next) {
		let params = [res.params.AuthUser.id, req.params.apiid, req.params.id];
		if (!req.params.apiid || !req.params.apiid.length) {
			return res.status(400).end(JSON.stringify({
				success: false,
				errors: [{
					code: 400,
					message: 'The information to create the model does not exist or is invalid'
				}]
			}));
		}

		models.domains.getDomainByID(params, function (error, domain) {
			if (error) {
				return res.status(500).end(JSON.stringify({
					success: false,
					errors: [{
						code: error.errno,
						message: error.sqlMessage
					}]
				}));
			}

			if (!domain.length) {
				return res.status(404).end(JSON.stringify({
					success: false,
					errors: [{
						code: 404,
						message: 'This domain application is not found'
					}]
				}));
			}

			models.domains.delete(params, function (e, result) {
				if (e) {
					return res.status(500).end(JSON.stringify({
						success: false,
						errors: [{
							code: e.errno,
							message: (e.errno === 1451) ? 'Referential integrity error, child records' : e.sqlMessage
						}]
					}));
				}

				return res.status(200).end(JSON.stringify({
					success: true,
					data: {
						code: 200,
						message: 'The domain instance was deleted successfully.'
					}
				}));
			});

		});

	});

	return router
};

module.exports = domains;