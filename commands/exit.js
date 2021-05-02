exports.run = async (client, message) => {
	await client.db.query("insert into exit_channel (id) values (?)", [
		message.channel.id,
	]);
	message.reply("bye").then(() => process.reallyExit(0));
};

exports.owner = true;