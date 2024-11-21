// @ts-ignore
import { useTracking } from 'tracker';

const f = () => {
  if (true) {
    useTracking();
  }
  console.log('here');
  const _end = useTracking();
  try {
    console.log('there');
    useTracking();
    _end();
  } catch (_e) {
    throw _end(_e);
  }
};
