exports.run = async (client, message, args) => {
	const proc = require("child_process").exec("/bin/sh");
	const mevfunc = (m) => {
		if (
			!m.author.bot &&
			m.channel.id === message.channel.id &&
			!m.content.startsWith("!")
		) {
			proc.stdin.write(m.content + "\n");
		}
	};
	client.on("message", mevfunc);
	proc.stdout.on("data", (data) =>
		message.channel.send(data.toString(), { split: true })
	);
	proc.stderr.on("data", (data) =>
		message.channel.send(data.toString(), { split: true })
	);
	proc.on("exit", () => {
		client.off("message", mevfunc);
	});
};

exports.owner = true;
