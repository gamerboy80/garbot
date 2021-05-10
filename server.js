const bodyParser = require("body-parser");
const express = require("express");
const nacl = require("tweetnacl");
const app = express();
var client, pubKey;

app.use(bodyParser.json());
var d = 3000;

app.post("/", async (req, res) => {
	if (!client) res.status(202).send("wait");
	const sig = req.headers["x-signature-ed25519"];
	const tim = req.headers["x-signature-timestamp"];
	const verify = nacl.sign.detached.verify(
		Buffer.from(tim + JSON.stringify(req.body)),
		Buffer.from(sig, "hex"),
		Buffer.from(pubKey, "hex")
	);
	if (verify) {
		switch (req.body.type) {
			case 1:
				res.send({
					type: 1,
				});
				break;
			default:
				const cmd = client.commands.get(req.body.data.name);
				if (cmd) {
					if (cmd.owner && req.body.member.user.id !== client.config.owner)
						return;
					var sent = false,
						start = Date.now();
					const channel = client.channels.resolve(req.body.channel_id);
					const funny = {
						send(content, options) {
							if (sent || Date.now() - start > d) {
								channel.send(content, { split: options?.split });
							} else {
								if (typeof content === "string") {
									res.send({
										type: 4,
										data: {
											content,
										},
									});
								} else {
									res.send({
										type: 4,
										data: {
											embeds: [content],
										},
									});
								}
								sent = true;
							}
						},
					};
					const newChannel = { ...channel, ...funny };
					cmd.run(
						client,
						{
							channel: newChannel,
							member: client.guilds
								.resolve(req.body.guild_id)
								?.members?.resolve(req.body.member.user.id),
							author: client.users.resolve(req.body.member.user.id),
							reply(content, options) {
								if (sent || Date.now() - start > d) {
									channel.send(content, { split: options?.split });
								} else {
									if (typeof content === "string") {
										res.send({
											type: 4,
											data: {
												content,
											},
										});
									} else {
										res.send({
											type: 4,
											data: {
												embeds: [content.embed],
											},
										});
									}
									sent = true;
								}
							},
						},
						req.body.data.options?.map((a) => a.value) ?? []
					);
					setTimeout(() => {
						if (!sent)
							res.send({
								type: 4,
								data: {
									content: "_ _",
									flags: 64,
								},
							});
						sent = true;
					}, d);
				} else
					res.send({
						type: 4,
						data: {
							content: "command doesn't exist",
							flags: 64,
						},
					});
				break;
		}
	} else {
		res.status(401).end("invalid request signature");
		console.log("not verified", req.headers, req.body);
	}
});

function init(cl, port, key) {
	client = cl;
	pubKey = key;
	app.listen(port);
	return app;
}

module.exports = { init };
