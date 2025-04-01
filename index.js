//  access express library
const express = require("express")
// create express instance
const app = express();

// access puppeteer library
const puppeteer = require("puppeteer")

const port = 3000

app.get("/scraper", async (req, res) => {
    // define route /scraper

    const website = req.query.website;

    // look for query parameter called 'website' if not there throw an error
    if (!website) {
        const error = new Error("website missing")
        error.status(400)
        next(error)
    }

    // if website query parameter available proceed to try catch block
    
    try {

        // first basic use of scraping for initial html
        // // use puppeteer to create browser instance
        // const browser = await puppeteer.launch()
        // // create new page on browser
        // const page = await browser.newPage()
        // // go to query website
        // await page.goto(req.query.website)
        // const html = await page.content()
        // await page.close()

        const registry = {}
        const queue = [website]
        
        while (queue.length > 0) {
            const url = queue[queue.length - 1]
        }



        // res.status(200).send(html)
    } catch (e) {
        console.log(e);
        res.status(500).send("broken")
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})