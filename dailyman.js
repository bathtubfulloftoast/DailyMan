const axios = require('axios');
const fs = require('fs');
var cron = require('node-cron');
const { key, album, geturl, publicurl,webhook,webhookname,webhookicon,cronenabled,crontime } = require('./config.json');

async function getimage(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    return new Blob([arrayBuffer], { type: contentType });
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}


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
      thumburl: `${geturl}/api/assets/${photoid}/thumbnail?size=preview&key=${key}`,
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

  const form = new FormData();


const discordconf = {
    "content": null,
    "embeds": [
      {
        "title": "Today's white man!",
        "description": `Today's white man is named ${name}`,
        "color": Math.round(Math.random() * 16777215),
        "timestamp": isoString,
        "image": { "url": `attachment://${name}.jpg` }, // it doesnt matter if its incorrect it just needs to register as an image.
        "footer": {"text": type},
      }
    ]
  };

if(webhookname) {
discordconf.username = webhookname;
}
if(webhookicon) {
discordconf.avatar_url = webhookicon;
}

if(publicurl) {
discordconf.embeds[0].url = photourl;
}

form.append('payload_json', JSON.stringify(discordconf));






const imageBuffer = await getimage(thumburl);
form.append('file1', imageBuffer, `${name}.jpg` // I LOVE HARDCODING FILETYPESSS!!!
);

  try {
    var datetime = new Date();
    await axios.post(webhook,form);
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
