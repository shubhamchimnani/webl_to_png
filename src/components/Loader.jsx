
import { useEffect, useState } from "react";
import gsap from "gsap";
import { FiImage } from "react-icons/fi";

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const counter = { value: 0 };

    const timeline = gsap.timeline({
      onComplete: () => onComplete?.(),
    });

    timeline
      .to(counter, {
        value: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          setProgress(Math.round(counter.value));
        },
      });

    gsap.fromTo(
      ".loader-logo",
      { scale: 0.7, opacity: 0, rotate: -12 },
      {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
      }
    );

    gsap.fromTo(
      ".loader-caption",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
    );

    return () => timeline.kill();
  }, [onComplete]);

  return (
    <div className="loader-screen">
      <div className="loader-content">
        <div className="loader-logo">
          <FiImage size={34} />
        </div>

        <h1>PixelConvert<span>.</span></h1>
        <p className="loader-caption">Making image conversion effortless</p>

        <div className="loader-track">
          <div
            className="loader-progress"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="loader-meta">
          <span>PREPARING YOUR WORKSPACE</span>
          <span>{progress}%</span>
        </div>
      </div>

      <style>{`
        .loader-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          background: #fff;
        }

        .loader-content {
          width: min(340px, 85vw);
          text-align: center;
        }

        .loader-logo {
          width: 72px;
          height: 72px;
          display: grid;
          place-items: center;
          margin: 0 auto 22px;
          color: white;
          background: linear-gradient(135deg, #6593ff, #2454ee);
          border-radius: 22px;
          box-shadow: 0 12px 35px #2855ed30;
        }

        .loader-content h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -1.3px;
        }

        .loader-content h1 span {
          color: #2855ed;
        }

        .loader-caption {
          color: #818591;
          font-size: 12px;
          margin: 10px 0 35px;
        }

        .loader-track {
          height: 4px;
          overflow: hidden;
          border-radius: 10px;
          background: #edf0f7;
        }

        .loader-progress {
          height: 100%;
          border-radius: inherit;
          background: #2855ed;
        }

        .loader-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          color: #8c91a0;
          font-size: 9px;
          letter-spacing: .7px;
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-screen * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
