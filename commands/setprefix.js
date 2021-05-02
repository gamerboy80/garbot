exports.run = async (client, message, args) => {
	if (message.member.permissions.has("MANAGE_GUILD")) {
		if (args[0]) {
			var newPrefix = args[0].toLowerCase();
			client.prefixes[message.guild.id] = newPrefix;
			await client.db.query(
				"insert into server_settings (id, prefix) values (?, ?) on duplicate key update ?",
				[
					message.guild.id,
					newPrefix,
					{ id: message.guild.id, prefix: newPrefix },
				]
			);
			message.reply("set prefix to " + args[0]);
		} else message.reply("put a prefix (no spaces allowed)");
	} else {
		message.reply(
			`you don't have permission to set the prefix (you need the \`Manage Guild\` permission)`
		);
	}
};