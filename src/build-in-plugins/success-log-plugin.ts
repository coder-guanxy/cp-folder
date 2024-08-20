import { HooksType } from 'src/plugin';
import { CopyFolderPlugin, logger } from '../index';

export default class SuccessLogPlugin implements CopyFolderPlugin {
  public apply(hooks: HooksType) {
    hooks.finishHook.tap('SuccessLogPlugin', (_) => {
      logger.success(` Copy success`);
    });
  }
}
