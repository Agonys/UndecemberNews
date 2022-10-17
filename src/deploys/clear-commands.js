require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { clientId } = require('../config/config.json');

const rest = new REST().setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully removed all application commands.'))
	.catch(console.error);