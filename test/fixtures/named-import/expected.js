// @ts-ignore
import { anything as useTracking } from 'tracker';

if (true) {
  const _end = useTracking();
  try {
    console.log(true);
    _end();
  } catch (_e) {
    throw _end(_e);
  }
}
