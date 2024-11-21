// @ts-ignore
import { useTracking } from 'tracker';

const outer = () => {
  const inner = () => {
    useTracking();
    return Math.random() < 0.5 ? 0 : 1;
  };

  if (inner() === 1) {
    return Object.keys({ a: 1, b: 2 });
  }

  return Object.keys({ x: 1, y: 2 });
};
