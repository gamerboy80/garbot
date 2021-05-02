exports.run = async (client, message) => {
	await client.db.query("delete from aliases where id = ?", [
		message.author.id,
	]);
	message.reply("ok cleared");
};