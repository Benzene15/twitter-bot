var config=require('./config.js');
var Twit=require('twitter');
const pup= require('puppeteer');


var Twitter= new Twit(config);

async function scrapeScore(url){
    const browser= await pup.launch();
    const page= await browser.newPage();
    await page.goto(url) 

    const [el]= await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[1]/div/div[1]");
    const txt= await el.getProperty('textContent');
    var playing= await txt.jsonValue();
    playing=playing.replace(/(\r\n|\n|\r)/gm,"");
    playing=playing.replace(/\s/g, '');
    
    if(playing.includes("BOT") || playing.includes("TOP") || playing.includes("MID")){
        const [em]= await page.$x("//*[@id=\"tb-2-body row-0 col-0\"]/div");
        const t= await em.getProperty('textContent');
        var score1= await t.jsonValue();
        score1=score1.replace(/(\r\n|\n|\r)/gm,"");
        score1=score1.replace(/\s/g, '');

        const [eo]= await page.$x("//*[@id=\"tb-2-body row-1 col-0\"]/div");
        const t1= await eo.getProperty('textContent');
        var score2= await t1.jsonValue();
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
        console.log(score1, score2);
    }
    else{
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
        console.log(playing, team1,team2);
    }

    


    
    //console.log(score1, score2);
    browser.close();
    
    //return playing,team1,score1,team2,score2;
    
} 



var writeTweet = function (days){
    var message= "Wow look at how the time flies! It's been ";
    var secondHalf=days.concat(" Since the Yankees have won the World Series.");
    var finalM=message.concat(secondHalf);
    Twitter.post('statuses/update',{
        status: finalM

    },function (err, data, response){
        console.log(data);
    });
}

var scoreList=scrapeScore("https://www.mlb.com/yankees/scores");

//console.log(daysSinceYankeesWS);
//writeTweet(daysSinceYankeesWS);

//setInterval(writeTweet, 1000);