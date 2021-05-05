const m = new Map();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const similar = require("fuzzyset.js");
const linkRegex = /^https?:\/\/(www\.)?[\w#%\+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()\+./:=?@~-]*)$/;
if (!fs.existsSync("savedAttachments")) fs.mkdirSync("savedAttachments");

const cd = new Map();
const cds = new Map();
const cdt = 1000;

const ocrcd = new Map();

var ps = 0;

module.exports = async (client, message) => {
	if (client.msglog.writable) {
		let e = message.embeds.map((a) => JSON.stringify(a.toJSON())).join(", ");
		client.msglog.write(
			`${Date.now()} | ${
				message.guild
					? `${message.guild.name} (${message.guild.id}, ${
							message.guild.members.cache.size
					  } cached members, which ${
							message.guild.members.cache.filter((a) => a.user.bot).size
					  } are bots)`
					: message.channel.type
			} | ${message.author.tag} (${message.author.id}, bot: ${
				message.author.bot
			}) (${message.attachments.size} attachment${
				message.attachments.size === 1 ? "" : "s"
			}${e ? ", embeds: " : ""}${e}): ${message.content}\n`
		);
	} else console.error("MSG LOG ISN'T WRITABLE!!!");
	if (
		(
			await client.db.query(
				"select blacklisted from blacklist where blacklisted = 1 and id = ?",
				[message.author.id]
			)
		)[0]?.blacklisted
	)
		return;
	if (message.attachments.size > 0) {
		await client.db.query("REPLACE INTO `last_images` SET ?", [
			{
				id: message.channel.id,
				link: message.attachments.first()?.proxyURL,
			},
		]);
		try {
			for (const x of message.attachments.array()) {
				axios({
					url: x.proxyURL,
					method: "GET",
					responseType: "stream",
				})
					.then((resp) => {
						const p = path.resolve(
							__dirname,
							"../savedAttachments",
							`${x.id}${message.channel.nsfw ? "_nsfw" : ""}${
								x.name ? `_${x.name}` : ""
							}`
						);
						const writer = fs.createWriteStream(p);
						resp.data.pipe(writer);
					})
					.catch(() => {});
			}
		} catch (e) {
			console.error(e);
		}
	}
	// Ignore all bots
	if (message.author.bot) return;
	if (client.config.apiKeys.ocrSpace) {
		var pr = message.content.split(/ +/);
		if (pr[0] === "!" && Date.now() - ocrcd.get(message.author.id) > 10000) {
			const msg = message.reply("ok wait");
			var u;
			if (pr[1]) {
				if (s.match(linkRegex)) [, u] = pr;
			} else {
				u =
					message.attachments.first()?.proxyURL ??
					(
						await client.db.query(
							"SELECT `link` FROM `last_images` WHERE `id` = ?",
							[message.channel.id]
						)
					)[0]?.link;
			}
			if (u) {
				axios
					.get(
						"https://api.ocr.space/parse/ImageUrl?" +
							objToURI({
								url: u,
								apikey: client.config.apiKeys.ocrSpace,
							})
					)
					.then((resp) => {
						if (resp.data.OCRExitCode === 1) {
							var parsedstr = resp.data?.ParsedResults[0]?.ParsedText;
							var str = parsedstr || "no str :(";
							msg.then((m) => m.delete());
							message.reply(str, { split: true });
						} else {
							if (resp.data.IsErroredOnProcessing) {
								message.reply(resp.data.ErrorMessage[1]);
							}
						}
					})
					.catch(console.error);
			} else message.reply("unable to find image");
			ocrcd.set(message.author.id, Date.now());
		}
	}
	if (!message.guild) {
		const t = m.get(message.author.id);
		if (Date.now() - t > 30_000)
			message.reply(
				"hello, if you're trying to use a command, you can't in dms sorry"
			);
		m.set(message.author.id, Date.now());
		return;
	}

	var prefix = client.config.prefix;
	if (client.prefixes[message.guild.id])
		prefix = client.prefixes[message.guild.id];
	else {
		var guildPrefix = (
			await client.db.query(
				"SELECT `prefix` FROM `server_settings` WHERE `id` = ?",
				[message.guild.id]
			)
		)[0]?.prefix;
		if (guildPrefix) prefix = guildPrefix;
		client.prefixes[message.guild.id] = prefix;
	}
	if (message.content.match(new RegExp(`^<@!?${client.user.id}>$`)))
		message.reply({
			embed: {
				description: `The prefix for this guild is ${prefix}`,
				color: 0x00ff00,
			},
		});
	prefix = prefix.toLowerCase();

	// Ignore messages not starting with the prefix (in config.json)
	if (message.content.toLowerCase().indexOf(prefix) !== 0) return;

	// Our standard argument/command name definition.
	const args = message.content.slice(prefix.length).split(/ +/g);

	var command = args.shift().toLowerCase().split("\n")[0].trim();
	let nc;
	if (
		(nc = (
			await client.db.query(
				"SELECT `command` FROM `aliases` WHERE `alias` = ?",
				[command]
			)
		)[0]?.command)
	)
		command = nc;

	// Grab the command data from the client.commands Enmap
	const cmd = client.commands.get(command);

	// If that command doesn't exist, silently exit and do nothing
	if (!cmd) {
		const fuzz = similar(
			client.commands.keyArray().map((a) => a.toLowerCase())
		);
		const fuzzed = fuzz.get(command);
		if (fuzzed)
			message.reply(`Command not found, did you mean \`${fuzzed[0][1]}\`?`);
		return;
	}
	if (cmd.owner && message.author.id !== client.config.owner) return;

	// Run the command
	if (Date.now() - ((cd.get(message.author.id) ?? {})[command] ?? 0) > cdt) {
		try {
			var r = cmd.run(client, message, args);
			if (r instanceof Promise)
				r.catch((err) => {
					console.error(err);
					message.reply(err.toString()).catch(console.error);
				});
		} catch (e) {
			console.error(e);
			message.reply("something went wrong").catch(console.error);
		} finally {
			const ucd = cd.get(message.author.id) ?? {};
			ucd[command] = Date.now();
			cd.set(message.author.id, ucd);
			cds.delete(message.author.id);
			ps++;
			setTimeout(() => ps--, 1000);
		}
	} else {
		if (!cds.get(message.author.id)) {
			var msg = await message.reply("wait");
			msg.delete({ timeout: 3000 });
			message.delete();
			cds.set(message.author.id, true);
		}
	}
};

function objToURI(obj) {
	var str = "";
	for (const x of Object.keys(obj)) {
		str += "&";
		str += encodeURIComponent(x);
		str += "=";
		str += encodeURIComponent(obj[x]);
	}
	return str.slice(1);
}
