exports.run = async (client, message, args) => {
	delete require.cache[require.resolve(args[1])];
	client[args[0]] = require(args[1]);
};

exports.owner = true;
