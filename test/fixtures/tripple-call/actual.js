// @ts-ignore
import { useTracking } from 'tracker';

const f = () => {
  if (true) {
    useTracking();
  }
  console.log('here');
  useTracking();
  console.log('there');
  useTracking();
};
