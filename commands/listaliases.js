exports.run = async (client, message) => {
	const result = await client.db.query(
		"select alias, command from aliases where id = ?",
		[message.author.id]
	);
	var astr = "";
	for (const x of result) astr += `, \`${x.alias}\` -> \`${x.command}\``;
	message.reply(astr.slice(2) || "no aliases");
};