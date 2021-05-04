exports.run = async (client, message) => {
	message
		.reply({
			embed: {
				description: `Are you sure you want to remove ${
					(
						await client.db.query(
							"SELECT `blacklisted` FROM `blacklist` WHERE `blacklisted` = 1"
						)
					).length
				} users from the blacklist? (You have 10 minutes to react)`,
				color: 0xffff00,
			},
		})
		.then((m) => {
			m.react("✅");
			const collector = m.createReactionCollector(
				(r, u) => u.id === message.author.id && r.emoji.name === "✅",
				{
					time: 600000,
				}
			);
			collector.on("collect", async () => {
				await client.db.query("TRUNCATE `blacklist`");
				m.edit({
					embed: {
						description: "Cleared blacklist",
						color: 0xff0000,
					},
				});
				collector.stop();
			});
		});
};

exports.owner = true;

exports.help = {
	description: "Clears user blacklist",
	usage: "[prefix]clearblacklist",
	example: "[prefix]clearblacklist",
};