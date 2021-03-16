import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import cheerio from "cheerio";
import puppeteer from "puppeteer";

let currentDataLength: number = 0;

const pttCrawler = async (response: NextApiResponse) => {
  const pttUrl = "https://www.ptt.cc/bbs/Stock/M.1615874402.A.46B.html";
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(pttUrl);
    const content = await page.content();
    const $ = cheerio.load(content); // 載入 body
    const list = $(".bbs-content .push");
    console.log(list.length);
    // TODO: Click 自動推文
    resolve;
  });
  // return new Promise(async (resolve, reject) => {
  //   request(
  //     {
  //       url: pttUrl,
  //       method: "GET",
  //     },
  //     async (error, res, body) => {
  //       // 如果有錯誤訊息，或沒有 body(內容)，就 return
  //       if (error || !body) return;

  //       const results = [];
  //       const browser = await puppeteer.launch({ headless: false });
  //       const page = await browser.newPage();
  //       await page.goto(pttUrl);
  //       const content = await page.content();
  //       const $ = cheerio.load(content); // 載入 body
  //       const list = $(".bbs-content .push");

  //       for (let i = 0; i < list.length; i++) {
  //         const userId = list.eq(i).find(".push-userid").text();
  //         const message = list.eq(i).find(".push-content").text();
  //         const time = list.eq(i).find(".push-ipdatetime").text();
  //         results.push({ userId, message, time });
  //       }
  //       console.log(currentDataLength, results.length);
  //       if (currentDataLength !== results.length) {
  //         results.slice(currentDataLength);
  //         // console.log(results);
  //         const data = `data: ${JSON.stringify({ results })}\n\n`;
  //         response.write(data);

  //         currentDataLength = results.length;
  //       }
  //       resolve(null);
  //     }
  //   );
  // });
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
