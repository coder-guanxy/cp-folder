import { AsyncSeriesWaterfallHook } from '@rspack/lite-tapable';
import { CopyFolderPlugin, CopyFolderPluginOptions } from './types';

export function registerPlugins(plugins: CopyFolderPlugin[]) {
  plugins.forEach((plugin) => {
    plugin.onBeforeCopy(pluginHook);
  });
}

export const pluginHook = new AsyncSeriesWaterfallHook<CopyFolderPluginOptions>(
  ['options'],
);
