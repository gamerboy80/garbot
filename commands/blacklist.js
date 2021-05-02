exports.run = async (client, message, args) => {
	if (args[0]) {
		const b = (await client.db.query("select * from blacklist")).map(
			(a) => a.id
		);
		var i = 0;
		for (const x of args) {
			var s = utilFileWhen(x);
			if (s.match(/\d+/) && !b.includes(s)) {
				i++;
				await client.db.query(
					"insert into blacklist (blacklisted, id) values (1, ?)",
					[s]
				);
			}
		}
		message.reply(`blacklisted ${i} users`);
	}
};

exports.owner = true;

function utilFileWhen(str) {
	if (str.startsWith("<@")) str = str.slice(2);
	if (str.endsWith(">")) str = str.slice(0, -1);
	if (str.startsWith("!")) str = str.slice(1);
	return str;
}