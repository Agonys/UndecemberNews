require('dotenv').config();
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const chalk = require('chalk');

const checkNews = require('./utils/checkNews');
const getCommandsList = require('./utils/getCommandsList');
const config = require('./config/config.json');

if (process.argv.at(-1) === 'development') console.clear();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});
client.news = [];
client.commands = new Collection();

const commandsList = getCommandsList();
commandsList.forEach(command => client.commands.set(command.data.name, command));


client.on(Events.Error, error => {
	console.error('A websocket connection encountered an error: ', error);
});

client.once('ready', (bot) => {
	console.log(chalk.green(`${bot.user.tag} is ready to work!`));

	if (config.enableInterval) checkNews(bot);
});


client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (e) {
		console.error(e);
		await interaction.reply({ content: 'There was an error during command execution!', ephemeral: true });
	}
});

client.login(process.env.TOKEN);