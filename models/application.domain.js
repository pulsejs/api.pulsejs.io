const domain = function (database) {
	const Pulse = database || require('../config/database')();

	this.getDomainsByAPI = function (params, callback) {
		let query = `SELECT
						aplications_domains.id,
						aplications_domains.domain_name,
						aplications_domains.time_create
					FROM aplications_domains
					INNER JOIN aplications ON (aplications_domains.aplication_id = aplications.id)
					WHERE aplications.user_id = ? AND aplications_domains.aplication_id LIKE ?`;

		Pulse.db.query(query, params, callback);
	};

	this.getDomainByID = function (params, callback) {
		let query = `SELECT
						aplications_domains.id,
						aplications_domains.domain_name,
						aplications_domains.time_create
					FROM
						aplications_domains
						INNER JOIN aplications ON (aplications_domains.aplication_id = aplications.id)
					WHERE aplications.user_id = ? AND aplications_domains.aplication_id LIKE ?
						  AND aplications_domains.id = ?`;
		Pulse.db.query(query, params, callback);
	};

	this.setDomain = function (params, callback) {
		let query = `INSERT INTO aplications_domains (aplication_id,domain_name) VALUES (?,?)`;
		Pulse.db.query(query, params, callback);
	};

	this.updateDomain = function (params, callback) {
		let query = `UPDATE aplications_domains
					 INNER JOIN aplications ON(aplications.id=aplications_domains.aplication_id)
					 SET domain_name = ?
					 WHERE aplications.user_id=? AND aplications_domains.aplication_id=? AND aplications_domains.id=?`;
		Pulse.db.query(query, params, callback);
	};

	this.deleteDomain = function (params, callback) {
		let query = `DELETE aplications_domains.* FROM aplications_domains INNER JOIN aplications ON(aplications.id=aplications_domains.aplication_id)
					 WHERE aplications.user_id=? AND aplications_domains.aplication_id=? AND aplications_domains.id=?`;
		Pulse.db.query(query, params, callback);
	};

	return this;
};

module.exports = domain;