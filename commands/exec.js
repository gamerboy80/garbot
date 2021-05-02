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
		proc.on("exit", (c) => {
			if (s) for (const x of xd(l)) message.reply(x, { split: true });
			else message.reply(c);
		});
	}
};

exports.owner = true;

function xd(str) {
	var sa = [];
	while (str) {
		sa.push(str.slice(0, 2000));
		str = str.slice(2000);
	}
	return sa;
}