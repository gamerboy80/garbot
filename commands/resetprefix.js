exports.run = (client, message) => {
	if (message.member.permissions.has("MANAGE_GUILD")) {
		client.prefixes[message.guild.id] = client.config.prefix;
		client.db.query(
			"insert into server_settings (id, prefix) values (?, ?) on duplicate key update ?",
			[
				message.guild.id,
				client.config.prefix,
				{ id: message.guild.id, prefix: client.config.prefix },
			]
		);
		message.reply("reset prefix to " + client.config.prefix);
	} else {
		message.reply(
			`you don't have permission to reset the prefix (you need the \`Manage Guild\` permission)`
		);
	}
};