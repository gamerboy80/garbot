const r = require("recursive-readdir");
const c = require("child_process");
const path = require("path");
const fs = require("fs");

exports.run = async (client, message, args) => {
	const t = client.commands.get(
		__filename.split("/").reverse()[0].split(".")[0]
	);
	switch (args[0]) {
		case "t":
			var p = path.resolve(__dirname, "..");
			console.log(p);
			r(p, ["node_modules"], (err, files) => {
				if (err) message.reply(err.name + ": " + err.message);
				for (const x of files) {
					if (x.endsWith(".js")) {
						fs.readFile(x, (err, file) => {
							if (err) return;
							var fix = file.toString().trim();
							if (fix !== file.toString())
								fs.writeFile(x, fix, (err) => {
									if (err) return;
									console.log(x);
								});
						});
					}
				}
				message.reply("yeah yeah");
			});
			break;
		case "p":
			const proc = c.exec('prettier --use-tabs --write "**/*.js"');
			proc.on("exit", (c) => {
				message.reply("ok yeah " + c);
			});
			break;
		case "tp":
		case "pt":
			const msg = message.reply("hold on, this may take a while");
			t.run(
				client,
				{
					reply(s) {
						if (s.match(/ok yeah \d+/)) {
							t.run(
								client,
								{
									reply(s) {
										if (s === "yeah yeah") msg.then((m) => m.edit("finished"));
									},
								},
								["t"]
							);
						} else {
							console.log(s);
							message.reply("what");
						}
					},
				},
				["p"]
			);

			break;
		default:
			message.reply("p t or pt");
			break;
	}
};

exports.owner = true;

exports.help = {
	description: "Format files",
	usage: "[prefix]format [p, t, or both at the same time]",
	example: "[prefix]format pt",
};
