var config=require('./config.js');
var Twit=require('twitter');
const pup= require('puppeteer');


var Twitter= new Twit(config);

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
}

async function scrapeScore(url){
    const browser= await pup.launch();
    const page= await browser.newPage();
    await page.goto(url) 
    while(1){
        const [el]= await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[1]/div/div[1]");
        const txt= await el.getProperty('textContent');
        var playing= await txt.jsonValue();
        playing=playing.replace(/(\r\n|\n|\r)/gm,"");
        playing=playing.replace(/\s/g, '');
        var score1=0;
        var score2=0;
        if(playing.includes("Final")){
            const [en]= await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[2]/div/div[2]/div/a/div[2]/div[1]");
            const x= await en.getProperty('textContent');
            var team1= await x.jsonValue();
            team1=team1.replace(/(\r\n|\n|\r)/gm,"");
            team1=team1.replace(/\s/g, '');

            const [ep]= await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[2]/div/div[3]/div/a/div[2]/div[1]");
            const x2= await ep.getProperty('textContent');
            var team2= await x2.jsonValue();
            team2=team2.replace(/(\r\n|\n|\r)/gm,"");
            team2=team2.replace(/\s/g, '');

            const [em]= await page.$x("//*[@id=\"tb-2-body row-0 col-0\"]/div");
            const t= await em.getProperty('textContent');
            score1= await t.jsonValue();
            score1=score1.replace(/(\r\n|\n|\r)/gm,"");
            score1=score1.replace(/\s/g, '');

            const [eo]= await page.$x("//*[@id=\"tb-2-body row-1 col-0\"]/div");
            const t1= await eo.getProperty('textContent');
            score2= await t1.jsonValue();
            score2=score2.replace(/(\r\n|\n|\r)/gm,"");
            score2=score2.replace(/\s/g, '');

            var yankeeScore;
            var otherScore;
            var otherName;
            if(team1[0]=="Y"){
                yankeeScore = score1;
                otherScore = score2;
                otherName = team2.substring(0, team2.length-3);
            }
            else{
                yankeeScore = score2;
                otherScore = score1;
                otherName = team1.substring(0,team1.length-3);
            }
            var score = "Final: Yankees: "+ yankeeScore + " " + otherName + ": "+ otherScore;
            console.log(score);
            while(1){
                if(yankeeScore<otherScore){
                    var messageIndex=Math.floor(Math.random()*3);
                    var messageArray=["Thank you to the " + otherName + " for sticking it to the Yankees today! ",
                            "What a beauitful day for a Yankees loss! ",
                            "Tough day to be a Yankees fan. Great day to be literally anyone else. "];
                    var message = "DAAAAAAAAAAAAAAAAA JANKEES LOSE! "
                    var message1 = message.concat(messageArray[messageIndex]);
                    var message2 = message1.concat(score)
                    console.log(message2);
                }
            }

        }
        else/*(playing.includes("BOT") || playing.includes("TOP") || playing.includes("MID"))*/{
            /*const [em]= await page.$x("//*[@id=\"tb-2-body row-0 col-0\"]/div");
            const t= await em.getProperty('textContent');
            score1= await t.jsonValue();
            score1=score1.replace(/(\r\n|\n|\r)/gm,"");
            score1=score1.replace(/\s/g, '');

            const [eo]= await page.$x("//*[@id=\"tb-2-body row-1 col-0\"]/div");
            const t1= await eo.getProperty('textContent');
            score2= await t1.jsonValue();
            score2=score2.replace(/(\r\n|\n|\r)/gm,"");
            score2=score2.replace(/\s/g, '');

            const [en]= await page.$x();
            const x= await en.getProperty('textContent');
            var team1= await x.jsonValue();
            team1=team1.replace(/(\r\n|\n|\r)/gm,"");
            team1=team1.replace(/\s/g, '');

            const [ep]= await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[2]/div[1]/div[3]/div/a/div[2]/div[1]");
            const x2= await ep.getProperty('textContent');
            var team2= await x2.jsonValue();
            team2=team2.replace(/(\r\n|\n|\r)/gm,"");
            team2=team2.replace(/\s/g, '');
            console.log(playing, team1,team2);
            console.log(score1, score2);*/
            console.log("Waiting")
            await sleep(2000);
        }
    }
    //console.log(score1, score2);
    browser.close();
    
    //return playing,team1,score1,team2,score2;
    
} 



var writeTweet = function (message){
    Twitter.post('statuses/update',{
        status: message

    },function (err, data, response){
        console.log(data);
    });
}

console.log("Thank you for starting the Yankees Lose Twitter bot!")
scrapeScore("https://www.mlb.com/yankees/scores/2020-08-05");
