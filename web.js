const express = require('express');
const { webkit } = require('playwright');

const app = express();

(async () => {
    
const browser = await webkit.launch();

const googleTranslate = await browser.newPage();
await googleTranslate.goto('https://translate.google.com/?hl=vi&sl=vi&tl=en&op=translate');

const mail = await browser.newPage();
const google = await browser.newPage();
await google.goto('https://www.google.com.vn/search?q=google');

const hltv = await browser.newPage();
const youtube = await browser.newPage();

let LAST_TRANS_INPUT = "";
let LAST_TRANS_OUTPUT = "";

    app.get('/google', function (req, res) {
        googleSearch(req.query.text, res);
    })

    app.get('/translate', function (req, res) {
        console.log(req.query.text);
        translate(req.query.text, res);
    })

    app.get('/hltv', function (req, res) {
        hltvHome(res);
    })

    app.get('/youtube', function (req, res) {
        youtubeHome(res);
    })

    app.listen(3000);

    async function googleSearch(text, res) {
        await google.locator('input[aria-label="Tìm kiếm"]').fill(text);
        await google.locator('button[aria-label="Tìm kiếm"]').click();
        await google.waitForLoadState('networkidle');
        await google.screenshot({ path: `google.png` });
        let output = await google.locator('#center_col >> nth=0').innerHTML();
        res.send(output);
    }

    async function youtubeHome(res) {
        await youtube.goto('https://www.youtube.com/');
        await youtube.screenshot({ path: `youtube.png` });
        await youtube.waitForLoadState('networkidle');
        let output = await youtube.locator('#contents >> nth=0').innerHTML();
        res.send(output);
    }

    async function hltvHome(res) {
        await hltv.goto('https://www.hltv.org/');
        await hltv.screenshot({ path: `hltv.png` });
        await hltv.waitForLoadState('networkidle');
        let output = await hltv.locator('.top-border-hide >> nth=0').innerHTML();
        res.send(output);
    }

    async function translate(text, res) {
        await googleTranslate.locator('textarea[aria-label="Văn bản nguồn"]').fill(text);
        // await googleTranslate.waitForTimeout(200);
        await googleTranslate.waitForLoadState('networkidle');
        while(true) {
            let output = await googleTranslate.locator('span[data-language-to-translate-into="vi"]').innerText();
            if (output != LAST_TRANS_OUTPUT){
                LAST_TRANS_OUTPUT = output;
                break;
            }else{
                await googleTranslate.waitForTimeout(100);
            }
        }
        await googleTranslate.screenshot({ path: `page.png` });
        console.log(LAST_TRANS_OUTPUT);
        res.send(LAST_TRANS_OUTPUT);
    }

    // await browser.close();
})();

