#!/usr/local/bin/node

/*global app:true*/

var	fs      = require('fs'),
	env     = process.env.NODE_ENV || 'development',
	config  = require('./app/config/' + env),
	matador = require('matador'),
	app     = matador.createApp(__dirname, config, {}),
	stylus  = require('stylus'),
	path    = require('path'),
	port    = 8080

app.configure(function () {

	app.set('view engine', 'jade')
	app.set('view options', { layout : false })

	app.use(matador.favicon())
	app.use(matador.cookieParser())
	app.use(matador.bodyParser())
	app.use(matador.methodOverride())

	app.set('version', fs.readFileSync(__dirname + '/version'))
	app.set('title', 'zodiac')

})

app.configure('development', function () {
	console.log('development...')
	app.use(matador.errorHandler({
		dumpExceptions: true,
		showStack: true
	}))
	// routes.root.push(['get', '/dev', 'Dev'])
})

app.configure('production', function () {
	app.use(matador.errorHandler())
	app.use(matador.staticCache())
	app.enable('view cache')
	// port = 80 // nodejitsu
	// port = 42800 // dotcloud
})

app.prefetch()
app.mount()
app.listen(port)
