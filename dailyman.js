// set up dependencies
const axios = require('axios');
const fs = require('fs');
const { key } = require('./config.json');
const { album } = require('./config.json');
const { geturl } = require('./config.json');
const { publicurl } = require('./config.json');
const { webhook } = require('./config.json');
const { webhookname } = require('./config.json');
const { webhookicon } = require('./config.json');

// set up date and turn it into the ISO 8601 format
const now = new Date();
const isoString = now.toISOString();

// stolen from https://stackoverflow.com/a/1026087
// makes the name proper
// also makes it so i dont have to capitalize my name list
function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// grab names from the text file and grab a random one
var names = fs.readFileSync('./names.txt').toString().split("\n");
var maxnames = names.length;
var nameid = Math.floor(Math.random() * maxnames);
var name = capitalizeFirstLetter(names?.[nameid]);

// stolen right from the immich api documentation
let immichconf = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${geturl}/api/albums/${album}?key=${key}`,
  headers: { 
    'Accept': 'application/json'
  }
};

axios.request(immichconf)
.then((response) => {
// i know the ammount of images in the album are shown in the api request itself but i dont trust it (i also didnt realize it was there until afterwards)
var maxphotos = response.data.assets.length;
var id = Math.floor(Math.random() * maxphotos);

var filename = response.data.assets?.[id]?.originalFileName;
var photoid = response.data.assets?.[id]?.id;

var photourl = `${publicurl}/share/${key}/photos/${photoid}`;
var thumburl = `${publicurl}/api/assets/${photoid}/thumbnail?size=preview&key=${key}`; // this is probably not the correct way to do this but it works!
var shareurl = `${publicurl}/share/${key}`;


let discordconf = {
method: 'post',
maxBodyLength: Infinity,
url: `${webhook}`,
headers: {'Accept': 'application/json'},
data: {
"content": null,
"username": webhookname,
"avatar_url": webhookicon,
"embeds":[
  {
    "title": "Todays white man!",
    "description": `todays white man is named ${name}`,
    "url": photourl,
    "color": Math.floor(Math.random() * 16777215), //this is for sure the best way to do it
    "timestamp": isoString,
    "image": {
      "url": thumburl
    }
  }
]
}
};

axios.request(discordconf) // just post the man
.then(() => {
  console.log(`${name} has been released into the wild.`);
})

})
.catch((error) => {
  console.log(error);
});


