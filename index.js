const express = require('express');
const { chromium } = require("playwright-chromium");

const app = express();

console.log('Starting Server....');

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    app.get('/translate', function (req, res) {
        console.log('Translate ' + req.query.text);
        translate(req.query.text, res);
    })

    async function translate(text, res) {
        try{
            const googleTranslate = await context.newPage();
            await googleTranslate.goto('https://translate.google.com.vn/?hl=vi&sl=vi&tl=en&op=translate');
            await googleTranslate.waitForLoadState('networkidle');
            await googleTranslate.locator('textarea[aria-label="Văn bản nguồn"]').fill(text);
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
            res.send(LAST_TRANS_OUTPUT);
            await browser.close();
        } catch (error) {
            console.log(error);
        }
    }
})();