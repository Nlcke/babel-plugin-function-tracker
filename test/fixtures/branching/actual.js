// @ts-ignore
import { useTracking } from 'tracker';

const getTrue = () => true;

const getFalse = () => false;

const getFromIf = () => {
  useTracking();
  if (Math.random() < 0.5) {
    return getTrue();
  } else {
    return getFalse();
  }
};

const getFromTernaryOperator = () => {
  useTracking();
  return Math.random() < 0.5 ? getTrue() : getFalse();
};
