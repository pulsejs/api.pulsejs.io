const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const auth         = require('basic-auth');
const Pulse        = require('./config/database')();
const models       = {
	auth: require('./models/auth')(Pulse)
};

const routers = {
	applications: require('./routes/applications')(Pulse),
	domains: require('./routes/applications.domain')(Pulse)
};

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/:v1*?', function (req, res, next) {
	let credentials = auth(req);

	if (!credentials) {
		res.setHeader('WWW-Authenticate', 'Basic realm="example"');
		res.statusCode = 401;
		return res.end(JSON.stringify({
			success: false,
			errors: [{
				code: 401,
				message: "Authentication fail"
			}]
		}));
	}

	models.auth.login(credentials.name, credentials.pass, function (error, row) {
		if (error) {
			console.log('error', error);
			res.statusCode = 500;
			return res.end(JSON.stringify({
				success: false,
				errors: [{
					code: 500,
					message: error
				}]
			}));
		}

		if (row.length) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('X-Powered-By', 'C++');
			res.setHeader('Server', 'PulseJS Server');
			res.params = Object.assign({AuthUser: row[0]}, res.query, res.params, res.body, req.body, req.params, req.query);
			next();
		} else {
			res.statusCode = 401;
			return res.end(JSON.stringify({
				success: false,
				errors: [{
					code: 401,
					message: "Authentication fail"
				}]
			}));
		}
	});
});

app.use('/v1/applications', routers.applications);
app.use('/v1/applications/domains', routers.domains);

module.exports = app;
