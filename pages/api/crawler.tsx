import { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import puppeteer from "puppeteer";

const pttCrawler = async (response: NextApiResponse) => {
  const pttUrl = "https://www.ptt.cc/bbs/Stock/M.1617369009.A.904.html";
  return new Promise(async (resolve, reject) => {
    const results = [];
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto(pttUrl);
    const autoUpdateBtn = await page.waitForXPath(
      "//div[contains(text(), '推文自動更新已關閉')]"
    );
    if (autoUpdateBtn) await autoUpdateBtn.click();

    setTimeout(async () => {
      const content = await page.content();
      const $ = cheerio.load(content); // 載入 body
      const list = $(".bbs-content .push");
      for (let i = 0; i < list.length; i++) {
        const userId = list.eq(i).find(".push-userid").text();
        const message = list.eq(i).find(".push-content").text();
        const time = list.eq(i).find(".push-ipdatetime").text();
        results.push({ userId, message, time });
      }
      const data = `data: ${JSON.stringify({ results })}\n\n`;
      response.write(data);
      await browser.close();
      resolve(null);
    }, 3000);
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("crawler");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  await pttCrawler(res);
  res.end("done");
};
