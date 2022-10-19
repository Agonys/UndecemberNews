const getNews = require('./getNews');
const sendNews = require('./sendNews');
const chalk = require('chalk');
const { pageFetchInterval, newsChannelId } = require('../config/config.json');


const linkRegex = new RegExp('https.+\\d+', 'g');
const checkNews = async (client, isExecutionForced = false) => {
	console.log(!isExecutionForced
		? chalk.blue('Fetching news list...')
		: chalk.yellow('Forcefully checking news list...'),
	);
	const newsList = await getNews();
	client.news = newsList.list;
	console.log(chalk[!isExecutionForced ? 'blue' : 'yellow'](`Fetched news list in ${newsList.executionTime}s`));

	const channel = await client.channels.fetch(newsChannelId);
	const lastMessageLink = await channel.messages.fetch({ limit: 5 }).then(messages => {
		const lastEmbedMessage = messages.find(message => message.embeds.length);
		if (!lastEmbedMessage) return null;

		const link = lastEmbedMessage.embeds[0].description.match(linkRegex);
		return link ? link[0] : null;
	});

	if (!lastMessageLink) {
		console.error(chalk.red('Couldn\'t find link in last message.'));
		return !isExecutionForced ? setTimeout(() => checkNews(client), pageFetchInterval) : null;
	}

	const roleId = await channel.guild.roles.fetch().then(data => {
		const newsRole = data.find(({ name }) => name === 'News');
		return newsRole?.id || null;
	});

	if (!roleId) {
		console.error(chalk.red('Couldn\'t find role with specified name "News"'));
		return !isExecutionForced ? setTimeout(() => checkNews(client), pageFetchInterval) : null;
	}

	const lastNewsIndex = client.news.findIndex(news => news.link === lastMessageLink);
	const slicedNews = client.news.slice(lastNewsIndex + 1);
	if (slicedNews.length) {
		console.log(chalk.magenta(`[DEBUG]: lastNewsIndex: ${lastNewsIndex}`));
		console.log(chalk.magenta(`[DEBUG]: lastMessageLink: ${lastMessageLink}`));
		console.log(chalk.magenta(`[DEBUG]: client.news: ${JSON.stringify(client.news, null, 2)}`));
		slicedNews.forEach(({ title, link }) => sendNews({ roleId, channel, title, link }));
	}

	return !isExecutionForced ? setTimeout(() => checkNews(client), pageFetchInterval) : null;
};

module.exports = checkNews;