# Daily Man
a very basic script for sending a random image from an immich album to a discord server.
it also gives the image a name.


## Installation
to install this script just clone it into the directory youd like to have it in then just run ``npm install`` to get the dependencies.

next copy or rename config-example.json to config.json
``cp config.example.json config.json``

## Config Example
```
{
  "key": "Immich-Share-Key",
  "album": "Immich-Album-ID",
  "geturl": "https://my.immich.app/",
  "publicurl": "https://my.immich.app/",
  "webhook": "Discord-Webhook-Url",
  "webhookname": null,
  "webhookicon": null,
  "cronenabled": true,
  "crontime": "0 7 * * *"
}
```

### Config Flags
| Key    | Value |
| -------- | ------- |
| key | your immich share key | 
| album | immich album id | 
| geturl | the retrieval url | 
| publicurl | the public url that will serve as the sent link | 
| webhook | discord webhook | 
| webhookname | discord webhook name | 
| webhookicon | discord webhook icon url | 
| cronenabled | weather cron is enabled or not | 
| crontime | the cron time | 

### how do i run without cron without editing the config?
to run as a basic non-cron task you can just run it like this ``node dailyman.js --nocron``

### My immich api key wont work
api keys wont work for this 
you need to share the album and get a share key
to get the share key you can just copy it from the share url
``https://my.immich.app/share/{key}``

### How do i get the album id
the album id can be found in the url while looking at an album
``https://my.immich.app/albums/{album}``

### why are geturl and publicurl different
get url is the link that the script will use for the api request
if you're running the script on the same machine as the immich server you should set this to ``http://localhost:2283`` or ``http://127.0.0.1:2283``
if you aren't running this script on the same machine its recommended to make this the same as the public url.

public url is the actual url discord is going to display
THIS HAS TO BE A PUBLIC IP OR DOMAIN!
discord cannot see ips such as ``192.168.0.*`` or ``10.0.0.*``
if you want to know how to do this refer to [the immich documentation](https://immich.app/docs/guides/remote-access/)

### how do i get a webhook url?
if you're not already familiar with discord webhooks you can [read the documentation](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)

### what are webhookname and webhookicon
these are optional flags for setting the webhooks name and icon through the script
the icon must be a direct image file
if left unset it will just use the webhooks regular name and icon set through discord.

### TypeError: Cannot read properties of undefined (reading 'replace')
this error happens whenever you input the cron time wrong.
the full error can be read like this

```
DailyMan/node_modules/node-cron/src/convert-expression/month-names-conversion.js:10
            expression = expression.replace(new RegExp(items[i], 'gi'), parseInt(i, 10) + 1);
                                    ^

TypeError: Cannot read properties of undefined (reading 'replace')
    at convertMonthName (DailyMan/node_modules/node-cron/src/convert-expression/month-names-conversion.js:10:37)
    at interprete (DailyMan/node_modules/node-cron/src/convert-expression/month-names-conversion.js:16:27)
    at interprete (DailyMan/node_modules/node-cron/src/convert-expression/index.js:54:26)
    at validate (DailyMan/node_modules/node-cron/src/pattern-validation.js:117:32)
    at new TimeMatcher (DailyMan/node_modules/node-cron/src/time-matcher.js:14:9)
    at new Scheduler (DailyMan/node_modules/node-cron/src/scheduler.js:9:28)
    at new ScheduledTask (DailyMan/node_modules/node-cron/src/scheduled-task.js:22:27)
    at createTask (DailyMan/node_modules/node-cron/src/node-cron.js:36:12)
    at Object.schedule (DailyMan/node_modules/node-cron/src/node-cron.js:25:18)
    at Object.<anonymous> (DailyMan/dailyman.js:99:6)

Node.js v23.8.0
```
if you need help setting the time for cron you can use [crontab guru](https://crontab.guru) to get the correct value 

## Other Information
with this script comes a very convenient list of male names
this is very convenient for if you forget which white man you're talking to
also not every name is white

another fun fact this script is entirely [bodged](https://www.youtube.com/watch?v=lIFE7h3m40U) together
this script is NOT meant to be the best solution for sending a random image from an immich album to a discord server
its just meant for me to send a funny image to my friends every day

this was originally a PHP script
but i kind of realized that was stupid so
