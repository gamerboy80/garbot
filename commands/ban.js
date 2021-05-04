exports.run = async (client, message, args) => {
	if (message.member.permissions.has("BAN_MEMBERS")) {

	} else
		message.reply({
			embed: {
				description: "You need the `Ban Members` permission.",
				color: 0xff0000,
			},
		});
};

exports.help = {
	description: "Bans member",
	usage: "[prefix]ban [member] [reason]",
	example: "[prefix]ban @toxicperson being toxic",
};

exports.owner = true;