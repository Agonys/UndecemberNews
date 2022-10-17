const getNews = require('./getNews');
const sendNews = require('./sendNews');
const chalk = require('chalk');
const { pageFetchInterval, newsChannelId } = require('../config/config.json');

const checkNews = async (client, isExecutionForced = false) => {
	console.log(!isExecutionForced
		? chalk.blue('Fetching news list...')
		: chalk.yellow('Forcefully checking news list...'),
	);
	const newsList = await getNews();
	client.news = newsList.list;
	console.log(chalk[!isExecutionForced ? 'blue' : 'yellow'](`Fetched news list in ${newsList.executionTime}s`));

	const channel = await client.channels.fetch(newsChannelId);
	const lastMessage = await channel.messages.fetch({ limit: 1 }).then(messages => {
		const message = messages.first();
		if (!message) return null;

		return message.embeds[0].title;
	});
	const roleId = await channel.guild.roles.fetch().then(data => {
		const newsRole = data.find(({ name }) => name === 'News');
		return newsRole?.id || null;
	});

	if (!roleId) {
		console.error(chalk.red('Couldn\'t find role with specified name "News"'));
		return !isExecutionForced ? setTimeout(() => checkNews(client), pageFetchInterval) : null;
	}

	const lastNewsIndex = client.news.findIndex(news => news.title === lastMessage);
	const slicedNews = client.news.slice(lastNewsIndex + 1);
	if (slicedNews.length) {
		slicedNews.forEach(({ title, link }) => sendNews({ roleId, channel, title, link }));
	}

	return !isExecutionForced ? setTimeout(() => checkNews(client), pageFetchInterval) : null;
};

module.exports = checkNews;