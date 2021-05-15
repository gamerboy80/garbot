const bodyParser = require("body-parser");
const chokidar = require("chokidar");
const express = require("express");
const app = express();
var client, pubKey, route;

app.use(bodyParser.json());
app.use((req, res, next) => {
	route(req, res, next);
});

function init(cl, port, key) {
	client = cl;
	pubKey = key;
	route = require("./serverRoute").grab(client, pubKey);
	const watcher = chokidar.watch("./serverRoute.js", { ignoreInitial: true });
	function reloadRoute() {
		delete require.cache(require.resolve("./serverRoute"));
		route = require("./serverRoute").grab(client, pubKey);
	}
	// watcher.on("add", reloadRoute);
	// watcher.on("unlink", reloadRoute);
	watcher.on("change", reloadRoute);
	watcher.on("error", console.error);
	app.listen(port);
	return app;
}

module.exports = { init };
