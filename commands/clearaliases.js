exports.run = async (client, message) => {
	const result = await client.db.query("DELETE FROM `aliases` WHERE `id` = ?", [
		message.author.id,
	]);
	if (result.rowsAffected)
		message.reply({
			embed: {
				description: "Cleared your aliases",
				color: 0x00ff00,
			},
		});
	else
		message.reply({
			embed: {
				description: "No aliases to clear",
				color: 0xffa500,
			},
		});
};

exports.help = {
	description: "Clears your aliases",
	usage: "[prefix]clearaliases",
	example: "[prefix]clearaliases",
};
