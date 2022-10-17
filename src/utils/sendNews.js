const { EmbedBuilder } = require('discord.js');

const sendNews = ({ roleId, channel, title, link }) => {
	const embed = new EmbedBuilder()
		.setColor(0x000000)
		.setTitle(title)
		.setDescription(`:point_right:  [ㅤㅤREAD ㅤㅤ](${link}) :point_left:`);

	channel.send({ content: `<@&${roleId}>`, embeds: [embed] });
};

module.exports = sendNews;