require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { clientId } = require('../config/config.json');
const getCommandsList = require('../utils/getCommandsList');

const rest = new REST().setToken(process.env.TOKEN);

const commands = getCommandsList({ isForDeployment: true });

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application command${data.length > 1 ? 's' : ''}.`))
	.catch(console.error);