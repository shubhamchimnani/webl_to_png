
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function usePageAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero .eyebrow", {
        y: 15,
        opacity: 0,
        duration: 0.6,
        delay: 0.1,
      });

      gsap.from(".hero h1", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".hero-copy, .hero-actions", {
        y: 20,
        opacity: 0,
        duration: 0.65,
        delay: 0.35,
        stagger: 0.12,
      });

      gsap.from(".converter-card", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        delay: 0.25,
        ease: "power3.out",
      });

      gsap.from(".benefit-card", {
        scrollTrigger: {
          trigger: ".benefit-grid",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);
}
