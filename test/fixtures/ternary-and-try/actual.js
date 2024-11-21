// @ts-ignore
import { useTracking } from 'tracker';

useTracking();

if (true) {
  const done = true ? useTracking() : null;
  if (true) {
    useTracking();
    console.log(done);
    console.log('nice');
  }
  console.log('great');
}

try {
  useTracking();
} catch {}
