exports.run = async (client, message) => {
	const result = await client.db.query("delete from scopes where id = ?", [
		message.author.id,
	]);
	if (result.rowsAffected)
		message.reply({
			embed: {
				description: "Cleared your math scopes",
				color: 0x00ff00,
			},
		});
	else
		message.reply({
			embed: {
				description: "Nothing was cleared, because there was nothing to clear",
				color: 0xffa500,
			},
		});
};

exports.help = {
	description: "Clears all your math scopes",
	usage: "[prefix]clearscope",
	example: "[prefix]clearscope",
};