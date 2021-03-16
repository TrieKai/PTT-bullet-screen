import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream;charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("X-Accel-Buffering", "no");

  for (let i = 0; i < 5; i++) {
    // res.write(`data: Hello seq ${i}\n\n`);
    const data = `data: ${JSON.stringify({ a: 123, b: 777 })}\n\n`;
    res.write(data);
    await new Promise((res, rej) => setTimeout(res, 5000));
  }
  res.end("done");
  console.log("done");
};
