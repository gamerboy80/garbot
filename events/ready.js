// const enmap = require("enmap");
// const sending = new enmap();

module.exports = async (client) => {
	console.log("ready");
	let a;
	if ((a = (await client.db.query("select id from exit_channel"))[0]?.id)) {
		await client.channels.resolve(a)?.send("im back");
		client.db.query("truncate exit_channel");
	}
	if (client.config.guildStats.enabled) {
		const bot_guild = client.guilds.resolve(client.config.guildStats.guildId);
		if (bot_guild) {
			const cArray = bot_guild.channels.cache
				.array()
				.sort((a, b) => a.rawPosition - b.rawPosition)
				.filter((a) => a.parentID === client.config.guildStats.categoryId);
			if (cArray.length >= 3)
				bot_guild.members
					.fetch()
					.then((members) => {
						const mArray = members.array();
						const bots = members.filter((a) => a.user.bot).array();
						cArray[0].setName(`total members: ${mArray.length}`);
						cArray[1].setName(`users: ${mArray.length - bots.length}`);
						cArray[2].setName(`bots: ${bots.length}`);
						const prefixes = ["users: ", "bots: "];
						const counts = [mArray.length - bots.length, bots.length];
						function changeCount(index, change) {
							counts[index] += change;
							cArray[index + 1].setName(prefixes[index] + counts[index]);
							cArray[0].setName(
								"total members: " + counts.reduce((a, b) => a + b)
							);
						}
						client.cc = changeCount;
					})
					.catch(console.error);
		}
	}
};
