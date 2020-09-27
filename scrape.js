const pup= require('puppeteer');

async function scrapeSite(url){
    const browser= await pup.launch();
    const page= await browser.newPage();
    await page.goto(url) 

    const [el]= await page.$x('//*[@id="productTitle"]');
    const txt= await el.getProperty('textContent');
    var rawTxt= await txt.jsonValue();

    rawTxt=rawTxt.replace(/(\r\n|\n|\r)/gm,"");
    console.log({rawTxt});

    browser.close();
}

scrapeSite('https://www.amazon.com/Sceptre-Edge-Less-FreeSync-DisplayPort-C248B-144RN/dp/B07MTMCNLX/ref=sr_1_5?dchild=1&keywords=144hz+monitor&qid=1600717226&sr=8-5');