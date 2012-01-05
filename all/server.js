#!/usr/local/bin/node

var matador = require('matador'),
	routes = require('./app/config/routes'),
	fs = require('fs');

app.configure(function () {

	app.set('models', __dirname + '/app/models');
	app.set('helpers', __dirname + '/app/helpers');
	app.set('views', __dirname + '/app/views');
	app.set('controllers', __dirname + '/app/controllers');

	app.set('view engine', 'jade');
	app.set('view options', { layout : false });
	app.enable('view cache');

	app.use(matador.cookieParser());
	app.use(matador.bodyParser());
	app.use(matador.methodOverride());

	app.set('version', fs.readFileSync(__dirname + '/version'));

});

app.configure('development', function () {
	app.use(matador.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
	app.use(matador['static']( __dirname + '/public'));
	routes.root.push(['get', '/dev', 'Dev']);
});

app.configure('production', function () {
	var gzip = require('connect-gzip');
	app.use(matador.errorHandler());
	app.use(matador.staticCache());
	app.use(gzip.staticGzip(__dirname + '/public', { maxAge : 86400000*30 }));
});

matador.mount(routes);
app.listen(8080);
