exports.run = async (client, message) => {
	await client.db.query("INSERT INTO `exit_channel` (id) VALUES (?)", [
		message.channel.id,
	]);
	message.reply("bye").then(() => process.reallyExit(0));
};

exports.owner = true;

exports.help = {
	description: "Exits the bot",
	usage: "[prefix]exit",
	example: "[prefix]exit",
};
