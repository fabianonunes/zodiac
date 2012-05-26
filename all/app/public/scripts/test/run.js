/*global WebPage phantom injectJs format mocha*/
var page = new WebPage

page.onConsoleMessage = function (msg) {
	if(msg == '>exit') phantom.exit()
	console.log(msg)
}

page.open('all/public/scripts/test/test.html', function (status) {
	page.injectJs('lib/sprintf.js')
	page.evaluate(function () {
		window.onload = function () {
			mocha.runner.on('end', function () {
				console.dir('>exit')
			})
		}
		console.log = function (msg) {
			console.dir(format.apply(null, arguments))
		}
	})
})
