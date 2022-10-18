const { EmbedBuilder } = require('discord.js');
const chalk = require('chalk');

const sendNews = ({ roleId, channel, title, link }) => {
	const embed = new EmbedBuilder()
		.setColor(0x000000)
		.setTitle(title)
		.setDescription(`:point_right:  [ㅤㅤREAD ㅤㅤ](${link}) :point_left:`);

	channel.send({ content: `<@&${roleId}>`, embeds: [embed] })
		.then(message => message.crosspost())
		.catch((e) => {
			console.log(chalk.red(`[ERROR]: There was an error while posting "${title}" news.`));
			console.log(e);
		})
		.then(() => {
			console.log('[INFO]: ' + chalk.blue(title) + chalk.green(' has been crossposted.'));
		});
};

module.exports = sendNews;