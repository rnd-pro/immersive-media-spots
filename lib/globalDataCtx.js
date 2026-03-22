import { PubSub } from '@symbiotejs/symbiote';
import { imsCtxName } from './imsCtxName.js';

let ctx = PubSub.registerCtx({
  fullscreen: false,
  fsStateIcon: 'fs_on'
}, imsCtxName);

ctx.sub('fullscreen', (val) => {
  ctx.pub('fsStateIcon', val ? 'fs_off' : 'fs_on');
});

export default ctx;

