#!/usr/local/bin/node

var fs          = require('fs'),
	path        = require('path'),
	express     = require('express'),
	app         = express.createServer(),
	stylus      = require('stylus'),
	envfile     = process.env.HOME + '/environment.json',
	environment = JSON.parse( fs.readFileSync(envfile) ),
	version     = fs.readFileSync('version'),
	gzip        = require('connect-gzip');

app.configure(function(){

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.set('view options', { layout : false });
	app.enable('view cache');
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.set('title', 'zodiac');
	app.set('js', version);

	app.use(stylus.middleware({
		src: __dirname + '/public',
		compile: function(str, path) {
			return stylus(str)
			.define('url', stylus.url({
				paths: [__dirname + '/public/images']
			}))
			.set('compress', true)
			.set('filename', path)
			.include(require('nib').path);
		}
	}));

	app.use(app.router);

});

app.configure('production', function () {
	app.use(express.staticCache());
	app.use(gzip.staticGzip(__dirname + '/public', { maxAge : 86400000*30 }));
});

app.configure('development', function () {
	app.use(express.errorHandler({
		showStack: true,
		dumpExceptions: true
	}));
	app.use(express['static']( __dirname + '/public'));
	app.get('/dev', function(req, res){
		res.render('dev');
	});
});

app.get('/', function(req, res){
	res.render('index');
});


app.listen(8080);
