import { NextApiRequest, NextApiResponse } from "next";
import request from "request";
import cheerio from "cheerio";

const pttCrawler = (response: NextApiResponse) => {
  request(
    {
      url: "https://www.ptt.cc/bbs/Stock/M.1615778650.A.E74.html",
      method: "GET",
    },
    (error, res, body) => {
      // 如果有錯誤訊息，或沒有 body(內容)，就 return
      if (error || !body) return;

      const data = [];
      const $ = cheerio.load(body); // 載入 body
      const list = $(".bbs-content .push");

      for (let i = 0; i < list.length; i++) {
        const userId = list.eq(i).find(".push-userid").text();
        const message = list.eq(i).find(".push-content").text();
        const time = list.eq(i).find(".push-ipdatetime").text();
        data.push({ userId, message, time });
      }

      console.log(data);
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ data }));
    }
  );
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  pttCrawler(res);
};
