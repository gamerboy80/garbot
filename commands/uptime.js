exports.run = (client, message) => {
	message.reply({
		embed: {
			description: msToTime(client.uptime),
			color: 0x00ff00,
		},
	});
};

// thanks stackoverflow
function msToTime(ms) {
	let seconds = (ms / 1000).toFixed(1);
	let minutes = (ms / (1000 * 60)).toFixed(1);
	let hours = (ms / (1000 * 60 * 60)).toFixed(1);
	let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
	if (seconds < 60) return seconds + " Seconds";
	else if (minutes < 60) return minutes + " Minutes";
	else if (hours < 24) return hours + " Hours";
	else return days + " Days";
}

exports.help = {
	description: "Gets client uptime",
	usage: "[prefix]uptime",
	example: "[prefix]uptime",
};