// @ts-ignore
import { useTracking } from 'tracker';

const f = () => {
  const _end = useTracking();
  try {
    if (Math.random() < 0.5) {
      throw 'error';
    }
    return _end(false);
  } catch (_e) {
    throw _end(_e);
  }
};
