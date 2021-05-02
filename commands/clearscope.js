exports.run = async (client, message) => {
	await client.db.query("delete from scopes where id = ?", [message.author.id]);
	message.reply("ok");
};