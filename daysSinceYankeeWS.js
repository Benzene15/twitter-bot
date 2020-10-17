var config=require('./config.js');
var Twit=require('twitter');
const pup= require('puppeteer');

async function scrapeDays(url){
    var Twitter= new Twit(config);
    const browser= await pup.launch();
    const page= await browser.newPage();
    await page.goto(url);
    
    
    const [el]= await page.$x('//*[@id="time"]');
    const txt= await el.getProperty('textContent');
    var days= await txt.jsonValue();
    
    days=days.replace(/(\r\n|\n|\r)/gm,"");
    //days=days.replace(" days",'');
    console.log({days});
    browser.close()
    
    var daysInt=parseInt(days);
    var messageIndex=Math.floor(Math.random()*10);
    var messageArray=["Wow look at how the time flies! It's been ",
                        "What a beauitful day for the yankees not to win the World Series! It's Been ",
                        "Damn  .@jomboy_ how"]
    var message= messageArray[messageIndex]
    var secondHalf=days.concat(" since the  .@Yankees have won the World Series.");
    var finalM=message.concat(secondHalf);
    if(daysInt%69==0){
        finalM.concat("Nice. "+daysInt+"=69"+"+"+(daysInt/69));
    }
    Twitter.post('statuses/update',{
        status: finalM
    })
}
function writeTweet(){
    scrapeDays("https://datedatego.com/how-many-days-november-4-2009")
}
writeTweet();
setInterval(writeTweet,86400000);