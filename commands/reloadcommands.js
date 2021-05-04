const fs = require("fs");

exports.run = async (client, message) => {
	fs.readdir("./commands", (err, files) => {
		if (err) return console.error(err);
		client.commands.clear();
		for (const file of files) {
			if (!file.endsWith(".js")) continue;
			const f = `./${file}`;
			delete require.cache[require.resolve(f)];
			let props = require(f);
			let [commandName] = file.split(".");
			client.commands.set(commandName.toLowerCase(), props);
		}
		message.reply({
			embed: {
				description: "Commands reloaded",
				color: 0x00ff00,
			},
		});
	});
};

exports.owner = true;

exports.help = {
	description: "Reloads all the commands",
	usage: "[prefix]reloadcommands",
	example: "[prefix]reloadcommands",
};
