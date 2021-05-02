exports.run = async (client, message) => {
	const b = await client.db.query(
		"select * from blacklist where blacklisted = 1"
	);
	message.reply("u: " + b.map((a) => a.id).join(", "));
};

exports.owner = true;