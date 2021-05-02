const fs = require("fs");

exports.run = async (client, message) => {
	client.removeAllListeners();
	fs.readdir("./events/", (err, files) => {
		if (err) return console.error(err);
		for (const file of files) {
			const f = `../events/${file}`;
			delete require.cache[require.resolve(f)];
			const event = require(f);
			let [eventName] = file.split(".");
			client.on(eventName, event.bind(null, client));
		}
		message.reply({
			embed: {
				description: "Reloaded events",
				color: 0x00ff00,
			},
		});
	});
};

exports.owner = true;

exports.help = {
	description: "Reloads all the events",
	usage: "[prefix]reloadevents",
	example: "[prefix]reloadevents",
};