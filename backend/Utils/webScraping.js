const cheerio = require('cheerio');
const axios = require('axios');
const priceUtil = require('./price');

exports.getPriceFromRawHTMLData = (data) => {
  const $ = cheerio.load(data);
  let price = $('#priceblock_ourprice').text() || $('#priceblock_dealprice').text();
  let title = $('#productTitle').text();
  title = title.replace(/\s\s+/g, ' ');
  price = priceUtil.priceFormatter(price);
  console.log('price', price);
  return price;
};
