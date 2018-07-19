module.exports = (json) => {
  switch (json.type) {
    case 'artist': return `${json.name}`;
    case 'album':
    case 'track': return `"${json.name}" by ${json.artists[0].name}`;
  }
};