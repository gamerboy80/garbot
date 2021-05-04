// const enmap = require("enmap");
// const sending = new enmap();
const c = require("child_process");

const restartList = ["index.js", "utils.js"];
const logCutString = "Fast-forward";

module.exports = async (client) => {
	console.log("ready");
	let a;
	if (
		(a = (await client.db.query("SELECT `id` FROM `exit_channel`"))[0]?.id) !=
		null
	) {
		await client.channels.resolve(a)?.send("im back");
		client.db.query("TRUNCATE `exit_channel`");
	}
	setInterval(() => {
		var log = "";
		const proc = c.exec("git pull");
		proc.stdout.on("data", (d) => (log += d));
		proc.on("exit", () => {
			log = log.slice(log.indexOf(logCutString) + logCutString.length);
			for (const x of restartList) if (log.includes(x)) process.exit(0);
		});
	}, 60 * 60 * 1000);
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
