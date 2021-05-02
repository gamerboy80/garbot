exports.run = async (client, message) => {
	if (message.member.permissions.has("MANAGE_SERVER")) {
		const currentState = (
			await client.db.query("select enabled from eval_enabled where id = ?", [
				message.guild.id,
			])
		)[0]?.enabled;
		if (currentState == null) currentState = true;
		await client.db.query(
			"insert into eval_enabled (id, enabled) values (?, ?) on duplicate key update ?",
			[
				message.guild.id,
				!currentState,
				{
					id: message.guild.id,
					enabled: !currentState,
				},
			]
		);
		message.reply(`set eval to ${!currentState ? "on" : "off"}`);
	} else message.reply("no permission");
};