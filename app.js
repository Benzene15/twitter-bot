var config=require('./config.js');
var Twit=require('twitter');
const pup= require('puppeteer');


var Twitter= new Twit(config);

function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
}
function makeDate(){
    var d = new Date();
    year = d.getFullYear();
    month = parseInt(d.getMonth()) + 1
    if(month<10){
        month = "0" + month.toString();
    }
    else{
        month = month.toString();
    }
    date = d.getDate();
    return ['/'+year + '-' + month + '-' + date,date]; 
}
async function getTeamNames(page, team1Spot, team2Spot){
    const [en] = await page.$x(team1Spot);
    const x = await en.getProperty('textContent');
    var team1= await x.jsonValue();
    team1=team1.replace(/(\r\n|\n|\r)/gm,"");
    team1=team1.replace(/\s/g, '');

    const [ep]= await page.$x(team2Spot);
    const x2= await ep.getProperty('textContent');
    var team2= await x2.jsonValue();
    team2=team2.replace(/(\r\n|\n|\r)/gm,"");
    team2=team2.replace(/\s/g, '');

    return [team1,team2]
}
async function getScore(page){
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

    return [score1,score2]
}
async function scrapeScore(){
    while(1){
        playingGame = true;
        base_url = "https://www.mlb.com/yankees/scores";
        [date,searchDate] = await makeDate();
        full_url = base_url + date
        const browser= await pup.launch();
        const page= await browser.newPage(); 
        await page.setDefaultNavigationTimeout(0);
        //console.log(full_url);
        while(playingGame){
            var d1 = new Date();
            //console.log(d1.getDate())
            //console.log(searchDate)
            if(d1.getDate() == searchDate){
                await page.goto(base_url);
                var playing;
                var team1;
                var team2;
                const [el] = await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[1]/div/div[1]");
                const txt = await el.getProperty('textContent');
                var playing = await txt.jsonValue();
                playing = playing.replace(/(\r\n|\n|\r)/gm,"");
                playing = playing.replace(/\s/g, '');
                if(!playing.includes(":")){
                    [team1,team2] = await getTeamNames(page,
                        "//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[3]/div[1]/div[2]/div/a/div[2]/div[1]/div[1]",
                        "//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[3]/div[1]/div[3]/div/a/div[2]/div[1]/div[1]");
                        console.log(team1,team2)
                    if(team1[0]!="Y" && team2[0]!="Y"){
                        playingGame = false;
                        console.log("Yankees are not playing today");
                        browser.close();
                        while(d1.getDate()==searchDate){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getDate())
                        }
                        while(d1.getHours()<8){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getHours())
                        }
                    }
                    else if(playing.includes("Final")){
                        [score1,score2] = await getScore(page);
    
                        var yankeeScore;
                        var otherScore;
                        var otherName;
                        if(team1[0]=="Y"){
                            yankeeScore = parseInt(score1);
                            otherScore = parseInt(score2);
                            otherName = team2;
                        }
                        else{
                            yankeeScore = parseInt(score2);
                            otherScore = parseInt(score1);
                            otherName = team1;
                        }
                        var score = "Final: Yankees: "+ yankeeScore + " " + otherName + ": "+ otherScore;
                        console.log(score);
                        if(yankeeScore<otherScore){
                            var messageIndex=Math.floor(Math.random()*3);
                            var messageArray=["Thank you to the " + otherName + " for sticking it to the Yankees today! ",
                                    "What a beauitful day for a Yankees loss! ",
                                    "Tough day to be a Yankees fan. Great day to be literally anyone else. "];
                            var message = "DAAAAAAAAAAAAAAAAA JANKEES LOSE! ";
                            var message1 = message.concat(messageArray[messageIndex]);
                            var message2 = message1.concat(score);
                            console.log(message2);
                            writeTweet(message2);
                        }
                        else{
                            console.log("Yankees won :(")
                        }
                        playingGame = false;
                        browser.close();
                        while(d1.getDate()==searchDate){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getDate())
                        }
                        while(d1.getHours()<8){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getHours())
                        }
                    }
                    else if(playing.includes("POSTPONED")){
                        playingGame = false;
                        browser.close();
                        console.log("Game is postponed")
                        while(d1.getDate()==searchDate){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getDate())
                        }
                        while(d1.getHours()<8){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getHours())
                        }
                    }
                    else{
                        console.log(playing,team1,team2)
                        await sleep(300000);
                    }
                }
                else{
                    console.log("Game at " + playing);
                    await sleep(1800000);

                }
                
            }
            else{
                await page.goto(full_url);
                var playing;
                var team1;
                var team2;
                const [el] = await page.$x("//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[1]/div/div[1]");
                const txt = await el.getProperty('textContent');
                var playing = await txt.jsonValue();
                playing = playing.replace(/(\r\n|\n|\r)/gm,"");
                playing = playing.replace(/\s/g, '');
                if(!playing.includes(":")){
                    [team1,team2] = await getTeamNames(page,
                        "//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[3]/div[1]/div[2]/div/a/div[2]/div[1]/div[1]",
                        "//*[@id=\"gridWrapper\"]/div/div[1]/div/div/div/div[2]/div[1]/div[3]/div[1]/div[3]/div/a/div[2]/div[1]/div[1]");

                    console.log(playing,team1,team2)
                    if(team1[0]!="Y" && team2[0]!="Y"){
                        playingGame = false;
                        browser.close();
                        while(d1.getDate()==searchDate){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getDate())
                        }
                        while(d1.getHours()<8){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getHours())
                        }
                    }
                    else if(playing.includes("Final")){
                        [score1,score2] = await getScore(page);
                        var yankeeScore;
                        var otherScore;
                        var otherName;
                        if(team1[0]=="Y"){
                            yankeeScore = parseInt(score1);
                            otherScore = parseInt(score2);
                            otherName = team2;
                        }
                        else{
                            yankeeScore = parseInt(score2);
                            otherScore = parseInt(score1);
                            otherName = team1;
                        }
                        var score = "Final: Yankees: "+ yankeeScore + " " + otherName + ": "+ otherScore;
                        console.log(score);
                        if(yankeeScore<otherScore){
                            var messageIndex=Math.floor(Math.random()*3);
                            var messageArray=["Thank you to the " + otherName + " for sticking it to the Yankees today! ",
                                    "What a beauitful day for a Yankees loss! ",
                                    "Tough day to be a Yankees fan. Great day to be literally anyone else. "];
                            var message = "DAAAAAAAAAAAAAAAAA JANKEES LOSE! ";
                            var message1 = message.concat(messageArray[messageIndex]);
                            var message2 = message1.concat(score);
                            console.log(message2);
                            writeTweet(message2);
                        }
                        playingGame = false;
                        browser.close();
                        while(d1.getDate()==searchDate){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getDate())
                        }
                        while(d1.getHours()<8){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getHours())
                        }
                    }
                    else if(playing.includes("POSTPONED")){
                        playingGame = false;
                        console.log("Game is postponed");
                        browser.close();
                        while(d1.getDate()==searchDate){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getDate())
                        }
                        while(d1.getHours()<8){
                            await sleep(1800000);
                            var d1 = new Date();
                            console.log(d1.getHours())
                        }
                    }
                    else{
                        console.log("Waiting "+ playing)
                        await sleep(300000);
                    }
                }
                else{
                    console.log("Game at " + playing);
                    await sleep(1800000);

                }
            }
        }
    }
    //console.log(score1, score2);
    
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
scrapeScore();
//"https://www.mlb.com/yankees/scores/2020-08-05"