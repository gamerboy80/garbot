const Discord = require("discord.js");
const chokidar = require("chokidar");
const Enmap = require("enmap");
const mysql = require("promise-mysql");
const fs = require("fs");

const client = new Discord.Client({
	ws: { properties: { $browser: "Discord iOS" } },
	intents: Discord.Intents.ALL,
	partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
});
const config = require("./config.json");
const eventFunctions = {};
// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;
client.prefixes = {};
client.randomColor = () => Math.floor(Math.random() * 0xffffff);
client.msglog = fs.createWriteStream("msglog.txt", {
	flags: "a",
	encoding: "utf8",
});
mysql
	.createConnection({
		host: client.config.database.host,
		user: client.config.database.username,
		password: client.config.database.password,
		database: client.config.database.database,
		charset: "utf8mb4",
	})
	.then((con) => (client.db = con));
client.on("error", (err) => console.error(err));

fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	for (const file of files) {
		const event = require(`./events/${file}`);
		let [eventName] = file.split(".");
		client.on(
			eventName,
			(eventFunctions[eventName] = event.bind(null, client))
		);
	}
});

var et = 0;

function reloadEvents(path) {
	try {
		console.log(path);
		const f = `./${path}`;
		let [eventName] = f.replace("./events/", "").split(".");
		delete require.cache[require.resolve(f)];
		client.off(eventName, eventFunctions[eventName] ?? (() => {}));
		delete eventFunctions[eventName];
		const event = require(f);
		client.on(
			eventName,
			(eventFunctions[eventName] = event.bind(null, client))
		);
		et = 0;
	} catch (e) {
		console.error(e);
		if (et < 5) {
			setTimeout(() => reloadEvents(path), 1000);
			et++;
		}
	}
}
const eventsWatcher = chokidar.watch("./events", { ignoreInitial: true });
eventsWatcher.on("add", reloadEvents);
eventsWatcher.on("unlink", reloadEvents);
eventsWatcher.on("change", reloadEvents);
eventsWatcher.on("error", console.error);

var aq = [];
function thePain(n) {
	if (client.db) {
		if (aq.length)
			for (const x of aq)
				client.db.query("delete from aliases where alias = ?", [x]);
		client.db.query("delete from aliases where alias = ?", [n]);
	} else aq.push(n);
}

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
	if (err) return console.error(err);
	for (const file of files) {
		if (!file.endsWith(".js")) continue;
		let props = require(`./commands/${file}`);
		let [commandName] = file.split(".");
		console.log(`Attempting to load command ${commandName}`);
		client.commands.set(commandName.toLowerCase(), props);
		thePain(commandName.toLowerCase());
	}
});

var ct = 0;

function reloadCommands(path) {
	try {
		console.log("reloading " + path);
		const f = `./${path}`;
		if (!f.endsWith(".js")) return;
		let [commandName] = f.replace("./commands/", "").split(".");
		delete require.cache[require.resolve(f)];
		client.commands.delete(commandName);
		let props = require(f);
		if (!props.run) throw new Error("why");
		client.commands.set(commandName.toLowerCase(), props);
		console.log("reloaded " + path);
		ct = 0;
		thePain(commandName.toLowerCase());
	} catch (e) {
		if (!e.message.startsWith("ENOENT")) console.error(e);
		if (ct < 5) {
			setTimeout(() => reloadCommands(path), 1000);
			ct++;
		}
	}
}
const commandsWatcher = chokidar.watch("./commands", { ignoreInitial: true });
commandsWatcher.on("add", reloadCommands);
commandsWatcher.on("unlink", reloadCommands);
commandsWatcher.on("change", reloadCommands);
commandsWatcher.on("error", console.error);

client.login(config.token);