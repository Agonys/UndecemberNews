const fetch = require('cross-fetch');
const { JSDOM } = require('jsdom');
const { officialPageNewsUrl, officialPageBaseUrl } = require('../config/config.json');
const chalk = require('chalk');

const titleRegex = /^[^\]]*.(.+)/;
const getNews = async () => {
	const startTime = performance.now();
	const response = await fetch(`${officialPageNewsUrl}?dummy=${Date.now()}`, {
		cache: 'no-cache',
		headers: {
			'Cache-Control': 'no-cache',
		},
	}).then(async (res) => {
		if (res.status >= 400) {
			console.log(chalk.red('[ERROR]: Bad response from server'));
			return null;
		}

		return {
			text: await res.text(),
			headers: res.headers,
		};
	}).catch(error => {
		console.log(chalk.red(error));
		return null;
	});


	if (!response) {
		return {
			executionTime: ((performance.now() - startTime) / 1000).toFixed(2),
			list: [],
			headers: response.headers,
		};
	}

	const { document } = new JSDOM(response.text).window;
	global.currentDocument = document.querySelector('.board-list.noti-fixed');
	const list = [...document.querySelectorAll('.board-list.noti-fixed li')]
		.map(news => {
			const link = news.querySelector('a');
			const title = link.children[0].textContent.trim().match(titleRegex)[1];
			return {
				link: officialPageBaseUrl + link.href,
				title: title || 'Unknown title, notify administrator',
			};
		})
		.reverse();


	return {
		executionTime: ((performance.now() - startTime) / 1000).toFixed(2),
		list,
		headers: response.headers,
	};
};

module.exports = getNews;