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
var incBuiltIn = ["fs", "child_process"];
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
						.reply(`rejection: ${err.name}: ${err.message}`)
						.catch(() => message.channel.send(`${err.name}: ${err.message}`))
				);
			message.reply("result: " + result, { split: true }).catch(() => {});
		} catch (e) {
			message
				.reply(`${e.name}: ${e.message}`)
				.catch(() => message.channel.send(`${e.name}: ${e.message}`));
		}
	} else {
		try {
			const vm = new VM(vmOpts);
			vm.sandbox.code = code;
			vm.run("result = eval(code)");
			message.reply("result: " + vm.sandbox.result);
		} catch (e) {
			// console.error(e);
			var a = goodTry[e.name];
			if (a?.includes(e.message)) message.reply("good try :slight_smile:");
			else message.reply(`${e.name}: ${e.message}`);
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