const path = require('path');
const fs = require('fs');

const getCommandsList = ({ isForDeployment = false } = {}) => {
	const commands = [];
	const commandsPath = path.join(__dirname, '../commands');
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(isForDeployment ? command.data.toJSON() : command);
	}

	return commands;
};

module.exports = getCommandsList;