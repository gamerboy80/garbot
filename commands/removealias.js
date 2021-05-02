exports.run = async (client, message, args) => {
	const aliases = await client.db.query("select * from aliases where id = ?", [
		message.author.id,
	]);
	if (args[0]) {
		const a = aliases.find((a) => a.alias === args[0].toLowerCase());
		if (a) {
			await client.db.query("delete from aliases where alias = ?", [
				args[0].toLowerCase(),
			]);
			message.reply("removed");
		} else message.reply("that alias doesn't exist");
	} else message.reply("please put alias to remove");
};