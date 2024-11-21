// @ts-ignore
import { useTracking } from 'tracker';

const f = () => {
  if (true) {
    const _end3 = useTracking();
    try {
      _end3();
    } catch (_e3) {
      throw _end3(_e3);
    }
  }
  console.log('here');
  const _end2 = useTracking();
  try {
    console.log('there');
    const _end = useTracking();
    try {
      if (Math.random() < 0.5) {
        return _end2(_end(true));
      }
      _end();
    } catch (_e) {
      throw _end(_e);
    }
    _end2();
  } catch (_e2) {
    throw _end2(_e2);
  }
};
