// @ts-ignore
import { useTracking } from 'tracker';

const getTrue = () => true;

const getFalse = () => false;

const getFromIf = () => {
  const _end = useTracking();
  try {
    if (Math.random() < 0.5) {
      return _end(getTrue());
    } else {
      return _end(getFalse());
    }
    _end();
  } catch (_e) {
    throw _end(_e);
  }
};

const getFromTernaryOperator = () => {
  const _end2 = useTracking();
  try {
    return _end2(Math.random() < 0.5 ? getTrue() : getFalse());
  } catch (_e2) {
    throw _end2(_e2);
  }
};
