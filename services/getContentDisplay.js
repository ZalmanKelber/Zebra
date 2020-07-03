const axios = require("axios");
const wikiApiUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=";

module.exports = async function getContentDisplay(content) {
  //isolate all of the html tags
  const htmlTagsArray = content.split(/(<[^>]*>)/);
  //isolate all of the phrases in backticks
  const backtickArray = [];
  htmlTagsArray.forEach(htmlString => {
    const backtickSubArray = htmlString.split(/(`[^`]+`)/);
    backtickSubArray.forEach(backtickString => {
      backtickArray.push(backtickString);
    });
  });
  //isolate words not in backticks
  const phrasesArray = [];
  backtickArray.forEach(btString => {
    if (btString.length > 0) {
      if (btString[0].match(/[`<]/)) {
        phrasesArray.push(btString.replace(/`/g, "").trim());
      }
      else {
        const wordsSubArray = btString.split(/(\s+)/);
        wordsSubArray.forEach(word => {
          if (word.length > 0) {
            phrasesArray.push(word);
          }
        });
      }
    }
  });
  //replace all words and phrases with links to their respective wikipedia articles
  const data = await Promise.all(phrasesArray.map(async phrase => {
    if (phrase.length > 0 && phrase[0] !== "<" && !phrase.match(/^\s+$/)) {
      const res = await axios.get(wikiApiUrl + phrase);
      if (res.data.query != undefined) {
        if (res.data.query.search.length > 0) {
          const linkUrl = "https://en.wikipedia.org/wiki/" + res.data.query.search[0].title.replace(/\s/g, "_");
          return `<a target="_blank" href="${linkUrl}">${phrase}</a>`;
        }
      }
    }
    return phrase;
  }));
  const dataString = data.join("").trim();
  //locate the first character and, if it's a capital letter, move it to the beginning of the string
  //and wrap it in a span with class initial
  if (dataString[0] === "<") {
    const firstCharacterString = dataString.match(/>[^<]/);
    if (firstCharacterString !== null && firstCharacterString[0].length > 1) {
      if (firstCharacterString[0][1].match(/[A-Z]/)) {
        return `<span class="initial">${firstCharacterString[0][1]}</span>` + dataString.replace(/>[^<]/, ">");
      }
    }
    return dataString;
  }
  if (dataString[0].match(/[A-Z]/)) {
    return `<span class="initial">${dataString[0]}</span>` + dataString.slice(1);
  }
  return dataString;
}
