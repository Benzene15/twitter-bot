var config=require('./config.js');
var Twit=require('twitter');
const pup= require('puppeteer');


var Twitter= new Twit(config);

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
}

var writeTweet = function (message){
    Twitter.post('statuses/update',{
        status: message

    },function (err, data, response){
        console.log(data);
    });
}

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
    var messageIndex=Math.floor(Math.random()*3);
    var messageArray=["Wow look at how the time flies! It's been ",
                        "What a beauitful day for the Yankees not to win the World Series! It's Been ",
                        "Damn,  .@jomboy_ how does it feel "];
    var message= messageArray[messageIndex];
    var secondHalf=days.concat(" since the  .@Yankees have won the World Series.");
    var finalM=message.concat(secondHalf);
    if(daysInt%69==0){
        finalM=finalM.concat(" Nice. ");
        finalM=finalM.concat(daysInt.toString());
        finalM=finalM.concat(" = 69 * ");
        finalM=finalM.concat((daysInt/69).toString());
    }
    console.log(finalM);
    Twitter.post('statuses/update',{
        status: finalM
    })
}

async function scrapeScore(url){
    const browser = await pup.launch();
    const page= await browser.newPage();
    await page.goto(url) 
    while(1){
        const [el]= await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[1]/div/div[1]");
        const txt= await el.getProperty('textContent');
        var playing= await txt.jsonValue();
        playing=playing.replace(/(\r\n|\n|\r)/gm,"");
        playing=playing.replace(/\s/g, '');
        var score1 = 0;
        var score2 = 0;
        if(playing.includes("Final")){
            try{
                var [en]= await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[2]/div/div[2]/div/a/div[2]/div[1]");
                var x= await en.getProperty('textContent');
                var team1= await x.jsonValue();
                team1=team1.replace(/(\r\n|\n|\r)/gm,"");
                team1=team1.replace(/\s/g, '');

                var [ep]= await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[2]/div/div[3]/div/a/div[2]/div[1]");
                var x2= await ep.getProperty('textContent');
                var team2= await x2.jsonValue();
                team2=team2.replace(/(\r\n|\n|\r)/gm,"");
                team2=team2.replace(/\s/g, '');

                var [em]= await page.$x("//*[@id=\"tb-2-body row-0 col-0\"]/div");
                var t= await em.getProperty('textContent');
                score1= await t.jsonValue();
                score1=score1.replace(/(\r\n|\n|\r)/gm,"");
                score1=score1.replace(/\s/g, '');

                const [eo]= await page.$x("//*[@id=\"tb-2-body row-1 col-0\"]/div");
                const t1= await eo.getProperty('textContent');
                score2= await t1.jsonValue();
                score2=score2.replace(/(\r\n|\n|\r)/gm,"");
                score2=score2.replace(/\s/g, '');
            } catch (err) {
                console.log("Could not read website");
                continue;
            }
            var yankeeScore;
            var otherScore;
            var otherName;
            if(team1[0]=="Y"){
                yankeeScore = score1;
                otherScore = score2;
                otherName = team2.substring(0, team2.length-3);
            }
            else if(team2[0]=="Y"){
                yankeeScore = score2;
                otherScore = score1;
                otherName = team1.substring(0,team1.length-3);
                var score = "Final: Yankees: "+ yankeeScore + " " + otherName + ": "+ otherScore;
            }
            else{
                console.log("No Yankee game today");
                scrapeDays("https://datedatego.com/how-many-days-november-4-2009");
                await sleep(86400000);
                continue;
            }
            var score = "Final: Yankees: "+ yankeeScore + " " + otherName + ": "+ otherScore;
            console.log(score);
            if(yankeeScore<otherScore){
                var messageIndex=Math.floor(Math.random()*3);
                var messageArray=["Thank you to the " + otherName + " for sticking it to the Yankees today! ",
                        "What a beauitful day for a Yankees loss! ",
                        "Tough day to be a Yankees fan. Great day to be literally anyone else. "];
                var message = "DAAAAAAAAAAAAAAAAA JANKEES LOSE! "
                var message1 = message.concat(messageArray[messageIndex]);
                var message2 = message1.concat("\n" + score);
                writeTweet(message2);
                await sleep(36000000);                
            }
        }
        else{
            console.log("Waiting");
            await sleep(300000);
        }
    }
    //console.log(score1, score2);
    browser.close();
    
    //return playing,team1,score1,team2,score2;
    
} 

console.log("Thank you for starting the Yankees Lose Twitter bot!")
scrapeScore("https://www.mlb.com/yankees/scores");
