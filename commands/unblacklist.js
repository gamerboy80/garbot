exports.run = async (client, message, args) => {
	if (args[0]) {
		var i = 0;
		for (const x of args) {
			var s = client.utils.getMentionFromId(x);
			const result = await client.db.query(
				"delete from blacklist where id = ?",
				[s]
			);
			i += result?.affectedRows ?? 0;
		}
		message.reply({
			embed: {
				description: `Unblacklisted ${i} users`,
				color: 0x00ff00,
			},
		});
	}
};

exports.owner = true;

exports.help = {
	description: "Removes user from blacklist",
	usage: "[prefix]unblacklist [1 or more users to unblacklist]",
	example: "[prefix]unblacklist @notabusiveuser1 @notabusiveuser2",
};