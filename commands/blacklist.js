exports.run = async (client, message, args) => {
	if (args[0]) {
		const b = (await client.db.query("SELECT * FROM `blacklist`")).map(
			(a) => a.id
		);
		var i = 0;
		for (const x of args) {
			var s = client.utils.getMentionFromId(x);
			if (s.match(/\d+/) && !b.includes(s)) {
				i++;
				await client.db.query(
					"INSERT INTO `blacklist` (blacklisted, id) VALUES (1, ?)",
					[s]
				);
			}
		}
		message.reply({
			embed: {
				description: `Blacklisted ${i} users`,
				color: 0x00ff00,
			},
		});
	}
};

exports.owner = true;

exports.help = {
	description: "Blacklists users",
	usage: "[prefix]blacklist [1 or more users to blacklist]",
	example: "[prefix]blacklist @abusiveuser1 @abusiveuser2",
};
