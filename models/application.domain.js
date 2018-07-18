const domain = function (database) {
	const Pulse = database || require('../config/database')();

	this.getDomainsByAPI = function (params, callback) {
		let query = `SELECT
						aplications_domains.id,
						aplications_domains.domain_name,
						aplications_domains.time_create
					FROM
						aplications_domains
						INNER JOIN aplications 
							ON (aplications_domains.aplication_id = aplications.id)
					WHERE aplications.user_id = ? AND aplications_domains.aplication_id LIKE ?`;

		Pulse.db.query(query, params, callback);
	};

	return this;
};

module.exports = domain;