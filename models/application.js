const application = function (database) {
	const Pulse           = database || require('../config/database')();
	const CALC_FOUND_ROWS = function (rows, callback) {
		Pulse.db.query("SELECT FOUND_ROWS() AS total", function (e, info) {
			if (e) {
				return callback(e, info);
			}
			callback(e, {
				total: info[0].total,
				rows: rows
			});
		});
	};

	this.getList = function (params, callback) {
		let query = "SELECT SQL_CALC_FOUND_ROWS aplications.* FROM aplications WHERE user_id=? LIMIT ? OFFSET ?";
		Pulse.db.query(query, params, function (error, rows) {
			if (error) return callback(error, rows);
			CALC_FOUND_ROWS(rows, callback);
		});
	};

	this.getApplication = function (params, callback) {
		let query = "SELECT * FROM aplications WHERE user_id=? AND id=?";
		Pulse.db.query(query, params, callback);
	};

	this.setApplication = function (params, callback) {
		let query = `INSERT INTO aplications(user_id,id,aplications.name,url_logo) VALUES (?,?,?,?)`;
		Pulse.db.query(query, params, callback);
	};

	this.updateApplication = function (params, callback) {
		let query = `UPDATE aplications SET aplications.name = ?, aplications.url_logo = ?
					 WHERE aplications.user_id = ? AND aplications.id = ?`;
		Pulse.db.query(query, params, callback);
	};

	this.deleteApplication = function (params, callback) {
		let query = `DELETE FROM aplications WHERE aplications.user_id = ? AND aplications.id = ?`;
		Pulse.db.query(query, params, callback);
	};

	return this;
};

module.exports = application;