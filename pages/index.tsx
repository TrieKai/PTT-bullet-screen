import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import styles from "./index.module.scss";

interface bullet {
  time: string;
  text: string;
  x?: number;
  y?: number;
  color: string;
}

interface crawlerResp {
  results: { userId: string; message: string; time: string }[];
}

const Home = () => {
  const cnavasElf = useRef<HTMLCanvasElement>();
  // const inputRef = useRef<HTMLInputElement>();
  const [messages, setMessages] = useState<bullet[]>([]);
  let bulletList: bullet[] = [];
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
    let tempBulletList = [];
    const events = new EventSource("api/crawler");
    console.log(events);
    events.onmessage = (event) => {
      console.log(event);
      let ms = 0;
      const data: crawlerResp = JSON.parse(event.data);
      const comments = data.results;
      const diff = comments.length - tempBulletList.length;
      console.log(diff, comments.length);
      if (diff > 0) {
        for (let i = comments.length - diff; i < comments.length; i++) {
          // default bullet height is 23px
          const slots = Math.floor((canvasHeight - 30) / 23); // total slots number
          const y = Math.floor(Math.random() * slots) * 23 + 20;
          const bullet: bullet = {
            time: comments[i].time,
            text: comments[i].userId.replace(/\s/g, "") + comments[i].message,
            x: canvasWidth,
            y: y,
            color: `#${(((1 << 24) * Math.random()) | 0).toString(16)}`,
          };
          tempBulletList = [...tempBulletList, bullet];
          setTimeout(() => {
            setMessages(tempBulletList);
            bulletList.push(bullet);
          }, 500 * ms++);
        }
      }
    };
    renderBullets();
  };

  const renderBullets = () => {
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

    window.requestAnimationFrame(renderBullets);
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
    <main className={styles.main}>
      <canvas ref={cnavasElf} className={styles.bulletCanvas}></canvas>
      <div className={styles.chatroomBox}>
        {messages.map((bullet, i) => (
          <div className={styles.messageBox} key={`bullet_${i}`}>
            <span className={styles.messageTime}>{bullet.time}</span>
            {bullet.text}
          </div>
        ))}
      </div>
      {/* <input ref={inputRef} type="text" />
      <button
        onClick={() => {
          addBullet(inputRef.current.value);
        }}
      >
        send
      </button> */}
    </main>
  );
};

export default Home;
