exports.run = async (client, message, args) => {
	const proc = require("child_process").exec("/bin/sh");
	const messages = [];
	const mevfunc = (m) => {
		if (
			!m.author.bot &&
			m.channel.id === message.channel.id &&
			message.author.id === m.author.id &&
			!m.content.startsWith("!")
		) {
			if (m.content.startsWith("$"))
				proc.kill(m.content.slice(1).toUpperCase());
			else proc.stdin.write(m.content + "\n");
		}
	};
	client.on("message", mevfunc);
	proc.stdout.on("data", (data) =>
		message.channel
			.send(data.toString(), { split: true })
			.then((_) => messages.push(..._))
	);
	proc.stderr.on("data", (data) =>
		message.channel
			.send(data.toString(), { split: true })
			.then((_) => messages.push(..._))
	);
	proc.on("exit", (code, signal) => {
		client.off("message", mevfunc);
		message.channel.send(`shell exited with code ${code} (${signal})`);
		message.channel.bulkDelete(messages);
	});
};

exports.owner = true;
