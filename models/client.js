//MODEL
const client = function (database) {
	const Pulse           = database || require('../config/database')();
	const CALC_FOUND_ROWS = function (rows, callback) {
		Pulse.db.query("SELECT FOUND_ROWS() AS total", function (e, info) {
			if(e) {
				return callback(e, info);
			}
			callback(e, {
				total: info[0].total,
				rows: rows
			});
		});
	};

	this.getClients = function (params, callback) {
		let query = `SELECT SQL_CALC_FOUND_ROWS
						aplications_clients.id
						, aplications_clients.client_id
						, aplications_clients.group_id
						, aplications_clients.client_name
						, aplications_clients.client_avatar
						, aplications_clients.state
						, aplications_clients.last_activity
					FROM aplications_clients
					INNER JOIN aplications ON (aplications_clients.apiid = aplications.id)
					WHERE aplications.user_id = ? AND aplications.id = ?`;

		Pulse.db.query(query, params, function (error, rows) {
			if(error) return callback(error, rows);
			CALC_FOUND_ROWS(rows, callback);
		});
	};

	this.deleteClient = function (params, callback) {
		let query = `DELETE aplications_clients.*, messages.* FROM aplications_clients INNER JOIN aplications ON(aplications.id=aplications_clients.apiid)
					LEFT JOIN messages ON(messages.from=aplications_clients.id OR messages.to=aplications_clients.id)
					WHERE aplications.user_id=? AND aplications_clients.apiid=? AND (aplications_clients.id=? OR aplications_clients.client_id=SHA2(?,256))`;
		console.log(Pulse.db.query(query, params, callback).sql);
	};

	return this;
};

module.exports = client;