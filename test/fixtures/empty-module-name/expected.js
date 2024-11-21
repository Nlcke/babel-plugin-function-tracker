// @ts-ignore
import { useTracking } from '';

const f = () => {
  const _end = useTracking();
  try {
    _end();
  } catch (_e) {
    throw _end(_e);
  }
};
