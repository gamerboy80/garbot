const axios = require("axios");
const base = "https://discord.com/api/v8/applications";

exports.run = async (client, message, args) => {
	try {
		switch (args.shift().toLowerCase()) {
			case "global":
				const resp1 = await axios.post(
					`${base}/${client.user.id}/commands`,
					JSON.parse(args[1] ?? args[0]),
					{
						headers: {
							Authorization: `Bot ${client.token}`,
						},
					}
				);
				if (resp1.statusCode >= 200 && resp1.statusCode <= 299)
					message.reply("registered");
				else {
					console.log(resp1.data);
					message.reply("error?");
				}
				break;
			default:
				message.reply("https://rauf.wtf/slash/");
				break;
			case "guild":
				const resp2 = await axios.post(
					`${base}/${client.user.id}/guilds/${message.guild.id}/commands`,
					JSON.parse(args.join(" ")),
					{
						headers: {
							Authorization: `Bot ${client.token}`,
						},
					}
				);
				// console.log(resp2.status);
				if (resp2.status >= 200 && resp2.status <= 299)
					message.reply("registered");
				else {
					console.log(resp2.data);
					message.reply("error?");
				}
				break;
		}
	} catch (e) {
		console.error(e);
	}
};

exports.owner = true;
