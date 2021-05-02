exports.run = async (client, message) => {
	const result = await client.db.query(
		"select alias, command from aliases where id = ?",
		[message.author.id]
	);
	var astr = "";
	for (const x of result) astr += `, \`${x.alias}\` -> \`${x.command}\``;
	message.reply({
		embed: {
			description: astr.slice(2) || "No aliases",
			color: 0x00ff00,
		},
	});
};

exports.help = {
	description: "Lists your aliases",
	usage: "[prefix]listaliases",
	example: "[prefix]listaliases",
};