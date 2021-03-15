import Head from "next/head";
import { useEffect, useRef } from "react";

import { GET } from "../utils/request";

interface bullet {
  text: string;
  x?: number;
  y?: number;
  color: string;
}

interface crawlerResp {
  data: { userId: string; message: string; time: string }[];
}

const Home = () => {
  const cnavasElf = useRef<HTMLCanvasElement>();
  // const inputRef = useRef<HTMLInputElement>();
  const bulletList: bullet[] = [];
  let canvasWidth: number;
  let canvasHeight: number;

  useEffect(() => {
    const canvas = cnavasElf.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;

    init();
  }, [cnavasElf]);

  const init = async () => {
    await fetchData();
    render();
  };

  const fetchData = async () => {
    const resp: crawlerResp = await GET("api/crawler", null);
    console.log(resp.data);
    resp.data.forEach((item, i) => {
      const y = canvasHeight * Math.random() + 20;
      const maxPosY = canvasHeight - 10;
      console.log(canvasHeight, y);
      const bullet: bullet = {
        text: item.userId.replace(/\s/g, "") + item.message,
        x: canvasWidth,
        y: y > maxPosY ? maxPosY : y,
        color: `#${(((1 << 24) * Math.random()) | 0).toString(16)}`,
      };
      setTimeout(() => {
        bulletList.push(bullet);
      }, 500 * i);
    });
    console.log(bulletList);
  };

  const render = () => {
    // if (bulletList.length === 0) return;
    const canvas = cnavasElf.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    bulletList.forEach((bullet, i) => {
      bullet.x -= 2;
      const bulletWidth = ctx.measureText(bullet.text).width;
      if (bullet.x + bulletWidth < 0) {
        bulletList.splice(i, 1);
      } else {
        ctx.font = "20px Microsoft JhengHei, PMingLiU, sans-serif";
        ctx.fillStyle = bullet.color;
        ctx.fillText(bullet.text, bullet.x, bullet.y);
      }
    });

    window.requestAnimationFrame(render);
  };

  // const addBullet = (message: string) => {
  //   const y = canvasHeight * Math.random() + 20;
  //   bulletList.push({
  //     text: message,
  //     x: canvasWidth,
  //     y: y > canvasHeight ? canvasHeight : y,
  //     color: "#000",
  //   });
  // };

  return (
    <div>
      <canvas
        ref={cnavasElf}
        style={{ width: "100%", height: "500px" }}
      ></canvas>
      {/* <input ref={inputRef} type="text" />
      <button
        onClick={() => {
          addBullet(inputRef.current.value);
        }}
      >
        send
      </button> */}
    </div>
  );
};

export default Home;
