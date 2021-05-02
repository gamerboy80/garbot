module.exports = (id) => {
	id.user.setPresence({
		activities: [
			{
				name: `${id.config.prefix}help - prefix is ${id.config.prefix}`,
			},
		],
	});
};