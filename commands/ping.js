exports.run = (client, message) => {
	const start = Date.now();
	const something = start - (message.id / 4194304 + 1420070400000);
	message.channel
		.send({
			embed: {
				color: 0xff000,
				description: "Pong!",
			},
		})
		.then((msg) => {
			msg.edit({
				embed: {
					color: 0x00ff00,
					title: "Pong!",
					description: `API: ${Date.now() - start}ms\nWebSocket: ${
						client.ws.ping
					}ms\nTime after receiving message: ${Math.round(something)}ms`,
				},
			});
		});
};

exports.help = {
	description: "Gets ping of the bot",
	usage: "[prefix]ping",
	example: "[prefix]ping",
};
