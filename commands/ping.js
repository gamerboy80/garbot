exports.run = (client, message) => {
	const start = Date.now();
	const something = start - (message.id / 4_194_304 + 1_420_070_400_000);
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
					}ms\nsomething?: ${Math.round(something)}ms`,
				},
			});
		});
};