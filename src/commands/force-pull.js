const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const checkNews = require('../utils/checkNews');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('force-pull')
		.setDescription('Forcefully pull and check all news from first site of official Undecember page.')
		.setDefaultMemberPermissions(0),
	execute: async (interaction) => {
		const embed = new EmbedBuilder()
			.setColor(0x34EB67)
			.setTitle('Success')
			.setDescription('Successfully pulled and checked all news!');

		try {
			await checkNews(interaction.client, true);


			await interaction.reply({ embeds: [embed], ephemeral: true });

		}
		catch (e) {
			await interaction.reply({ embeds: [
				embed
					.setColor(0xEB4934)
					.setTitle('Failure')
					.setDescription('Something went wrong during checking news...'),
			], ephemeral: true });
		}


	},
};