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
			// console.log(`Attempting to load command ${commandName}`);
			client.commands.set(commandName.toLowerCase(), props);
		}
		message.reply("commands reloaded");
	});
};

exports.owner = true;