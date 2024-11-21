// @ts-ignore
import { useTracking } from 'tracker';

useTracking();

if (true) {
  const done = true ? useTracking() : null;
  if (true) {
    const _end2 = useTracking();
    try {
      console.log(done);
      console.log('nice');
      _end2();
    } catch (_e2) {
      throw _end2(_e2);
    }
  }
  console.log('great');
}
try {
  const _end = useTracking();
  try {
    _end();
  } catch (_e) {
    throw _end(_e);
  }
} catch {}
