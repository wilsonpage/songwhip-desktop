const debug = require('debug')('songwhip:songwhipify');
const fetch = require('node-fetch');

const SONGWHIP_WEB_URL = 'https://songwhip.com?country=gb';

module.exports = async (url) => {
  debug('get', url);
  const response = await fetch(SONGWHIP_WEB_URL, {
    method: 'post',
    body: url,
  });

  if (!response.ok) return;
  const text = await response.text();

  try { return JSON.parse(text); }
  catch (e) { debug('error parsing json', text); }
};