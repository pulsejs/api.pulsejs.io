const PulseDB = function () {
	const mysql   = require('mysql');
	this.db = mysql.createConnection({
		host: 'localhost',
		user: 'pulse',
		password: '+CDXB1bHNlLWNoYXQuZ2Ewgf4GA1UdIASB9jCB8zAIBgZn',
		database: 'pulse_chat',
		port: 3306
	});

	//PULSEJS.connect();

	//this.db = PULSEJS;

	return this;
};

module.exports = PulseDB;