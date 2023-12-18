import puppeteer from 'puppeteer-core'
import * as cheerio from 'cheerio'
import * as fs from 'fs'

// const url = 'https://cloudyuga.guru/hands_on_lab/how-to-run-docker-in-docker'
// const url = 'https://cloudyuga.guru/hands_on_lab/k8s-1-28-native-sidecar-container'
const url = 'https://cloudyuga.guru/hands_on_lab/vector-parseable'

// Open the browser
const load = async (targetUrl: string) => {
    const browser = await puppeteer.launch({
        // ignoreHTTPSErrors: true,
        headless: true,
        args: ['--no-sandbox'],
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    })
    try {  
        const page = await browser.newPage()
        await page.goto(targetUrl)
        const document = await page.content()
        // console.log(document)
        const $ = cheerio.load(document)
        const meta = $('.meta-info').html()
        const content = $('[data-cy="handsOnContents"]').html()
        // console.log(content)
        const target = await fs.promises.readFile('./index.html', 'utf-8')
        const $$ = cheerio.load(target)
        $$('body').html('')
        $$('body').append(meta ?? '')
        $$('body').append(content ?? '')
        fs.promises.writeFile('./index.html', $$.html())
    } catch(error) {
        console.error('error =>', error)
    } finally {
        await browser.close()
    }
}

load(url)