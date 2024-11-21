// @ts-ignore
import { useTracking } from 'tracker';

const getTrue = () => true;

const getFalse = () => false;

const getFromIf = () => {
  const _end2 = useTracking();
  try {
    if (Math.random() < 0.5) {
      return _end2(getTrue());
    } else {
      return _end2(getFalse());
    }
    _end2();
  } catch (_e2) {
    throw _end2(_e2);
  }
};

const getFromTernaryOperator = () => {
  const _end = useTracking();
  try {
    return _end(Math.random() < 0.5 ? getTrue() : getFalse());
  } catch (_e) {
    throw _end(_e);
  }
};
