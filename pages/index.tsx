import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import styles from "./index.module.scss";

interface bullet {
  time: string;
  author: string;
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
  const inputRef = useRef<HTMLInputElement>();
  const [messages, setMessages] = useState<bullet[]>([]);
  const eventSource = useRef<EventSource>();
  const bulletList = useRef<bullet[]>([]);
  const canvasWidth = useRef<number>();
  const canvasHeight = useRef<number>();

  useEffect(() => {
    const canvas = cnavasElf.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvasWidth.current = canvas.offsetWidth;
    canvasHeight.current = canvas.offsetHeight;

    renderBullets();
  }, [cnavasElf]);

  const initEventSource = async () => {
    let tempBulletList: bullet[] = [];
    eventSource.current = new EventSource(
      `api/crawler?url=${inputRef.current.value}`
    );
    console.log(eventSource.current);
    eventSource.current.onmessage = (event) => {
      console.log(event);
      let ms = 0;
      const data: crawlerResp = JSON.parse(event.data);
      const comments = data.results;
      const diff = comments.length - tempBulletList.length;
      if (diff > 0) {
        for (let i = comments.length - diff; i < comments.length; i++) {
          // default bullet height is 23px
          const slots = Math.floor((canvasHeight.current - 30) / 23); // total slots number
          const y = Math.floor(Math.random() * slots) * 23 + 20;
          const bullet: bullet = {
            time: comments[i].time,
            author: comments[i].userId.replace(/\s/g, ""),
            text: comments[i].message,
            x: canvasWidth.current,
            y: y,
            color: `#${(((1 << 24) * Math.random()) | 0).toString(16)}`,
          };
          tempBulletList = [...tempBulletList, bullet];
          setTimeout(() => {
            setMessages(tempBulletList);
            bulletList.current.push(bullet);
          }, 500 * ms++);
        }
      }
    };
  };

  const renderBullets = () => {
    // if (bulletList.length === 0) return;
    const canvas = cnavasElf.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    bulletList.current.forEach((bullet, i) => {
      bullet.x -= 2;
      const bulletWidth = ctx.measureText(bullet.text).width;
      if (bullet.x + bulletWidth < 0) {
        bulletList.current.splice(i, 1);
      } else {
        ctx.font = "20px Microsoft JhengHei, PMingLiU, sans-serif";
        ctx.fillStyle = bullet.color;
        ctx.fillText(bullet.author + bullet.text, bullet.x, bullet.y);
      }
    });

    requestAnimationFrame(renderBullets);
  };

  const close = () => {
    if (eventSource.current) eventSource.current.close();
    setMessages([]);
    bulletList.current = [];
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
    <>
      <Head>
        <title>PTT 留言區彈幕</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <main className={styles.main}>
        <canvas ref={cnavasElf} className={styles.bulletCanvas}></canvas>
        <div className={styles.inputContainer}>
          <div className={styles.inputBox}>
            <span>PTT 網址：</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="https://www.ptt.cc/bbs/Stock/M.1617381183.A.504.html"
            />
            <button
              onClick={() => {
                // addBullet(inputRef.current.value);
                close();
                initEventSource();
              }}
            >
              send
            </button>
          </div>
        </div>
        <div className={styles.chatroomBox}>
          {messages.map((bullet, i) => (
            <div className={styles.messageBox} key={`bullet_${i}`}>
              <span className={styles.messageTime}>{bullet.time}</span>
              <span style={{ color: bullet.color }}>{bullet.author}</span>
              {bullet.text}
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
