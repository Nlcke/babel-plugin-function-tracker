// @ts-ignore
import { useTracking as useTracking2 } from 'tracker';
// @ts-ignore
import { useTracking } from 'tracker';

const useTracking3 = useTracking;
// @ts-ignore
const useTracking4 = require('tracker').useTracking;

const f = () => {
  const _end = useTracking();
  try {
    console.log(1);
    useTracking2();
    console.log(2);
    _end();
  } catch (_e) {
    throw _end(_e);
  }
};
