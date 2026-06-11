import { useEffect, useRef, useState } from "react";

const CountUp = ({ value, suffix = "", duration = 1200 }) => {
  const [count, setCount] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const start = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));

      if (progress < 1) {
        frame.current = requestAnimationFrame(animate);
      }
    };

    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [duration, value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default CountUp;
