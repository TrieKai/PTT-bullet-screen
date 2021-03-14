import Head from "next/head";
import { useEffect, useRef } from "react";

interface bullet {
  text: string;
  x?: number;
  y?: number;
  color: string;
}

const Home = () => {
  const cnavasElf = useRef<HTMLCanvasElement>();
  const inputRef = useRef<HTMLInputElement>();
  const bulletList: bullet[] = [];
  let canvasWidth: number;
  let canvasHeight: number;

  useEffect(() => {
    const canvas = cnavasElf.current;
    canvasWidth = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;

    const render = () => {
      // if (bulletList.length === 0) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      bulletList.forEach((bullet, i) => {
        console.log(canvas.offsetHeight * Math.random());
        bullet.x -= 1;
        const bulletWidth = ctx.measureText(bullet.text).width;
        if (bullet.x + bulletWidth < 0) {
          bulletList.splice(i, 1);
        } else {
          ctx.fillText(bullet.text, bullet.x, bullet.y);
        }
      });

      window.requestAnimationFrame(render);
    };

    render();
  }, [cnavasElf]);

  const addBullet = (message: string) => {
    bulletList.push({
      text: message,
      x: canvasWidth,
      y: canvasHeight * Math.random(),
      color: "#000",
    });
  };

  return (
    <div>
      <canvas ref={cnavasElf} style={{ border: "1px solid #000" }}></canvas>
      <input ref={inputRef} type="text" />
      <button
        onClick={() => {
          addBullet(inputRef.current.value);
        }}
      >
        send
      </button>
    </div>
  );
};

export default Home;
