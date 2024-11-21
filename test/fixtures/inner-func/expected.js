// @ts-ignore
import { useTracking } from 'tracker';

const outer = () => {
  const inner = () => {
    const _end = useTracking();
    try {
      return _end(Math.random() < 0.5 ? 0 : 1);
    } catch (_e) {
      throw _end(_e);
    }
  };

  if (inner() === 1) {
    return Object.keys({ a: 1, b: 2 });
  }

  return Object.keys({ x: 1, y: 2 });
};
