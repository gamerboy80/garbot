module.exports = (client, id) => {
	client.user.setPresence({
		activities: [
			{
				name: `${client.config.prefix}help - prefix is ${client.config.prefix}`,
			},
		],
	});
};