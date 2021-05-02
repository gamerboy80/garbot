exports.run = async (client, message) => {
	if (message.member.permissions.has("MANAGE_SERVER")) {
		const currentState = (
			await client.db.query("select eval from server_settings where id = ?", [
				message.guild.id,
			])
		)[0]?.eval;
		if (currentState == null) currentState = true;
		await client.db.query(
			"insert into server_settings (id, eval) values (?, ?) on duplicate key update ?",
			[
				message.guild.id,
				!currentState,
				{
					id: message.guild.id,
					eval: !currentState,
				},
			]
		);
		message.reply({
			embed: {
				description: `${
					!currentState ? "Enabled" : "Disabled"
				} eval on this guild`,
				color: 0x00ff00,
			},
		});
	} else
		message.reply({
			embed: {
				description: "You don't have the `Manage Guild` permission",
				color: 0xff0000,
			},
		});
};

exports.help = {
	description: "Toggles using eval in this guild",
	usage: "[prefix]toggleeval",
	example: "[prefix]toggleeval",
};