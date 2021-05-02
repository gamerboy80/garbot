exports.run = async (client, message) => {
	const b = await client.db.query(
		"select * from blacklist where blacklisted = 1"
	);
	const userListString = b.map((a) => a.id).join(", ");
	message.reply({
		embed: {
			fields: [
				{ name: "Blacklisted Users", value: userListString || "no users" },
			],
			color: 0x00ff00,
		},
	});
};

exports.owner = true;

exports.help = {
	description: "Lists blacklisted users",
	usage: "[prefix]listaliases",
	example: "[prefix]listaliases",
};