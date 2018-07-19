const services = [
  /https?:\/\/(?:open|play)\.spotify\.com\/(album|artist|track)\/(.+)/,
  /https?:\/\/itunes\.apple\.com\/(?:([a-z]{2})\/)?(?:album|artist).+?id(\d+)/,
  /https?:\/\/(?:www\.)?itun\.es.+/,
  /https?:\/\/(?:www\.)?deezer\.com(?:\/\w{2})?\/(?:album|artist|track)\/(.+)/,
  /https?:\/\/play\.google\.com\/music\/.+\/(?:[B|A|T])([a-z0-9]+)/,
  /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=(?:.+)/,
  /https?:\/\/(?:www\.)?youtu.be\/(?:.+)/,
  /https?:\/\/soundcloud\.com\/(.+?)\/(.+)/,
];

module.exports = (string) => {
  if (!string) return;
  for (let regex of services) {
    const match = string.match(regex);
    if (match) return match[0];
  }
};
