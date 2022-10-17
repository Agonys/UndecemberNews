const fetch = require('cross-fetch');
const { JSDOM } = require('jsdom');
const { officialPageNewsUrl, officialPageBaseUrl } = require('../config/config.json');

const getNews = async () => {
	const startTime = performance.now();
	const response = await fetch(officialPageNewsUrl, { cache: 'no-store' }).then((res) => {
		if (res.status >= 400) {
			throw new Error('Bad response from server');
		}
		return res.text();
	});
	const { document } = new JSDOM(response).window;
	const newsList = [...document.querySelectorAll('.board-list:not(.noti-fixed)')[0].children]
		.filter(node => node.tagName === 'LI')
		.map(news => {
			const link = news.querySelector('a');
			return {
				link: officialPageBaseUrl + link.href,
				title: link.children[0].textContent.trim(),
			};
		})
		.reverse();

	return {
		executionTime: ((performance.now() - startTime) / 1000).toFixed(2),
		list: newsList,
	};
};

module.exports = getNews;