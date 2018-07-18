const auth = function (database) {
	const Pulse = database || require('../config/database')();

	this.login = function (user, password, callback) {
		Pulse.db.query("SELECT * FROM users WHERE email=? AND SHA1(passwd)=SHA1(?)", [user, password], callback);
	};

	return this;
};

module.exports = auth;