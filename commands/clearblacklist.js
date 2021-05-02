exports.run = async (client, message) => {
	message
		.reply(
			`are you sure you want to remove ${
				(
					await client.db.query(
						"select blacklisted from blacklist where blacklisted = 1"
					)
				).length
			} users from the blacklist??? (you have 10 minutes to react)`
		)
		.then((m) => {
			m.react("✅");
			const collector = m.createReactionCollector(
				(r, u) => u.id === message.author.id && r.emoji.name === "✅",
				{
					time: 600_000,
				}
			);
			collector.on("collect", async () => {
				await client.db.query("truncate blacklist");
				message.reply("ok done");
				collector.stop();
			});
		});
};

exports.owner = true;