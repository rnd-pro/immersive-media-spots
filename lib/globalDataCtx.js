import { PubSub } from '@symbiotejs/symbiote';
import { imsCtxName } from './imsCtxName.js';
import { FullscreenMgr } from './FullscreenMgr.js';

let ctx = PubSub.registerCtx({
  fsTarget: null,
  fullscreen: false,
  fsStateIcon: 'fs_on'
}, imsCtxName);

FullscreenMgr.init();

ctx.sub('fullscreen', (val) => {
  let target = ctx.read('fsTarget');
  if (val) {
    FullscreenMgr.enable(target);
    target?.setAttribute('fullscreen', '');
    ctx.pub('fsStateIcon', 'fs_off');
  } else {
    FullscreenMgr.disable();
    target?.removeAttribute('fullscreen');
    ctx.pub('fsStateIcon', 'fs_on');
  }
}, false);

export default ctx;

