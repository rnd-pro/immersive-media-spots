import { PubSub } from '@symbiotejs/symbiote';
import { imsCtxName } from './imsCtxName.js';
import { FullscreenMgr } from './FullscreenMgr.js';

let ctx = PubSub.registerCtx({
  fsHideUnsupported: false,
  fsTarget: null,
  fullscreen: false,
  fsStateIcon: 'fs_on'
}, imsCtxName);

ctx.sub('fullscreen', (val) => {
  let target = ctx.read('fsTarget');
  if (val) {
    FullscreenMgr.enable(target);
    ctx.pub('fsStateIcon', 'fs_off');
  } else {
    FullscreenMgr.disable();
    ctx.pub('fsStateIcon', 'fs_on');
  }
}, false);

export default ctx;

