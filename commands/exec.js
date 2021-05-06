const c = require("child_process");

exports.run = (client, message, args) => {
	if (args[0]) {
		var s = true;
		var cm = args.join(" ");
		if (cm.startsWith("!")) {
			s = false;
			cm = cm.slice(1);
		}
		const proc = c.exec(cm);
		var l = "";
		proc.stdout.on("data", (data) => (l += data?.toString()));
		proc.stderr.on("data", (data) => (l += data?.toString()));
		proc.on("exit", (c) => {
			if (s) message.reply(c + ": " + l, { split: true });
			else message.reply(c);
		});
	}
};

exports.owner = true;

exports.help = {
	description: "Executes things in shell",
	usage: "[prefix]exec [shell command]",
	example: "[prefix]exec echo hi",
};
