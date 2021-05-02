module.exports = (client, member) => {
	if (member.guild.id === client.config.guildStats.guildId) {
		const f = client.cc;
		if (f) f(Number(member.user.bot), -1);
	}
};