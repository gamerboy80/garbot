const { VM } = require("vm2");
const { camelCase } = require("lodash");

const goodTry = {
	ReferenceError: [
		"client is not defined",
		"message is not defined",
		"args is not defined",
	],
};
const vmOpts = {
	eval: true,
	wasm: false,
	timeout: 1000,
	sandbox: {
		result: null,
		code: null,
		Promise: undefined,
	},
};
var incBuiltIn = ["fs", "child_process", "os", "zlib"];
var packages = Object.keys(require("../package.json").dependencies).concat(
	incBuiltIn
);
var packObj = {};
packages.map((a) => (packObj[camelCase(a)] = require(a)));

exports.run = async (client, message, args) => {
	const code = args
		.join(" ")
		.trim()
		.replace(/^```(.+)?\n/, "")
		.replace(/```$/, "");
	if (client.config.owner === message.author.id) {
		try {
			var result = evalInScope(
				code,
				Object.assign({ client, message, args }, packObj)
			);
			if (result instanceof Promise)
				result.catch((err) =>
					message
						.reply({
							embed: {
								description: `Rejection: ${err.name}: ${err.message}`,
								color: 0xff0000,
							},
						})
						.catch(() =>
							message.channel
								.send({
									embed: {
										description: `${err.name}: ${err.message}`,
										color: 0xff0000,
									},
								})
								.catch(() => {})
						)
				);
			message
				.reply({
					embed: {
						fields: [{ name: "Result", value: "" + result }],
						color: 0xff0000,
					},
				})
				.catch(() => {});
		} catch (e) {
			message
				.reply({
					embed: {
						fields: [
							{
								name: e.name,
								value: e.message,
							},
						],
						color: 0xff0000,
					},
				})
				.catch(() => message.channel.send(`${e.name}: ${e.message}`));
		}
	} else {
		if (
			(await client.db.query(
				"SELECT `eval` FROM `server_settings` WHERE `id` = ?",
				[message.guild.id]
			)[0]?.eval) ??
			true
		) {
			try {
				const vm = new VM(vmOpts);
				vm.sandbox.code = code;
				vm.run("result = eval(code)");
				message.reply({
					embed: {
						fields: [{ name: "Result", value: "" + vm.sandbox.result }],
						color: 0xff0000,
					},
				});
			} catch (e) {
				// console.error(e);
				if (goodTry[e.name]?.includes(e.message))
					message.reply("good try :slight_smile:");
				else message.reply(`${e.name}: ${e.message}`);
			}
		}
	}
};
function evalInScope(js, contextAsScope) {
	return function () {
		with (this) {
			return eval(js);
		}
	}.call(contextAsScope);
}
exports.help = {
	description: "Executes JavaScript code",
	usage: "[prefix]eval [code]",
	example: "[prefix]eval ```js\nwhile (false) {\n}\n```",
};
