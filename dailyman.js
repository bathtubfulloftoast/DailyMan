const axios = require('axios');
const fs = require('fs');
var cron = require('node-cron');
const { key, album, geturl, publicurl,webhook,webhookname,webhookicon,cronenabled,crontime } = require('./config.json');

// stolen from https://stackoverflow.com/a/1026087
function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// grab names from the text file and grab a random one
async function getRandomName() {
  const names = fs.readFileSync('./names.txt', 'utf-8')
  .split('\n')
  .map(name => name.trim())
  .filter(Boolean);
  const nameid = Math.floor(Math.random() * names.length);
  return capitalizeFirstLetter(names?.[nameid]);
}

// Async function to fetch a random image from Immich
async function getRandomImage() {
  const immichconf = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${geturl}/api/albums/${album}?key=${key}`,
    headers: { 'Accept': 'application/json' }
  };

  try {
    const response = await axios.request(immichconf);
    const maxphotos = response.data.assets.length;
    const id = Math.round(Math.random() * maxphotos);

    

    const filename = response.data.assets?.[id]?.originalFileName;
    const photoid = response.data.assets?.[id]?.id;

    return {
      photourl: `${publicurl}/share/${key}/photos/${photoid}`,
      thumburl: `${publicurl}/api/assets/${photoid}/thumbnail?size=preview&key=${key}`,
      shareurl: `${publicurl}/share/${key}`,
      response: response.data,
      type: response.data.assets?.[id]?.type,
    };
  } catch (error) {
    console.error("Error fetching image from Immich:", error);
    throw error;
  }
}

// Async function to send data to Discord
async function sendToDiscord(name, photourl, thumburl, type) {
  // set up date and turn it into the ISO 8601 format
  const now = new Date();
  const isoString = now.toISOString();

  const discordconf = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${webhook}`,
    headers: { 'Accept': 'application/json' },
    data: {
      "content": null,
      "username": webhookname,
      "avatar_url": webhookicon,
      "embeds": [
        {
          "title": "Today's white man!",
          "description": `Today's white man is named ${name}`,
          "url": photourl,
          "color": Math.round(Math.random() * 16777215),
          "timestamp": isoString,
          "image": { "url": thumburl },
          "footer": {"text": type},
        }
      ]
    }
  };

  try {
    var datetime = new Date();
    await axios.request(discordconf);
    console.log(`[${datetime}] ${name} has been released into the wild.`);
  } catch (error) {
    console.error("Error sending data to Discord:", error);
  }
}

// Main function to coordinate tasks
async function main() {
  try {
    const name = await getRandomName();
    const { photourl, thumburl, type } = await getRandomImage();
    await sendToDiscord(name, photourl, thumburl, type);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

if (process.argv.includes('--nocron') || !cronenabled) {
  main();
} else {
  cron.schedule(crontime, main);
}
