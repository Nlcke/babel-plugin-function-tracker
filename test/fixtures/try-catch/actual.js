// @ts-ignore
import { useTracking } from 'tracker';

const f = () => {
  useTracking();
  if (Math.random() < 0.5) {
    throw 'error';
  }
  return false;
};
