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

      const browser = await puppeteer.launch({
        headless: false,
        args: [
          "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.3",
        ],
      });
      const registry = {};
      let queue = [website];

      while (queue.length > 0) {
        const url = queue[queue.length - 1];
        console.log("current url" + url);
        // open new tab
        const page = await browser.newPage({
          headless: false,
          args: [
            "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.3",
          ],
        });
        // go to current page in queue
        await page.goto(url);
        // add that page to the registry with the value being all text from that page
        registry[url] = await page.$eval("*", (el) => el.innerText);
        // remove that page from the queue
        queue.pop();
        console.log("queue", queue);

        // find all hrefs and add the links to the registry
        const hrefs = await page.$$eval("a", (anchorEls) =>
          anchorEls.map((a) => a.href)
        );

        // filter to only scrape hrefs that start with the same string as initial website url
        const filteredhrefs = hrefs.filter(
          (href) => href.startsWith(website) && registry[href] === undefined
        );

        const uniqueHrefs = [...new Set(filteredhrefs)];

        // now push into the queue array
        queue.push(...uniqueHrefs);

        // make sure no duplicates
        queue = [...new Set(queue)];

        await page.close();
      }

      browser.close();

      res.status(200).send(registry);
    } catch (e) {
        console.log(e);
        res.status(500).send("broken")
    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})