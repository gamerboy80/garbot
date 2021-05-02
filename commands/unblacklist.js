exports.run = async (client, message, args) => {
	if (args[0]) {
		var i = 0;
		for (const x of args) {
			var s = utilFileWhen(x);
			const result = await client.db.query(
				"delete from blacklist where id = ?",
				[s]
			);
			i += result?.affectedRows ?? 0;
		}
		message.reply(`unblacklisted ${i} users`);
	}
};

exports.owner = true;

function utilFileWhen(str) {
	if (str.startsWith("<@")) str = str.slice(2);
	if (str.endsWith(">")) str = str.slice(0, -1);
	if (str.startsWith("!")) str = str.slice(1);
	return str;
}