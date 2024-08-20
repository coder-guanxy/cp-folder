import {
  AsyncSeriesWaterfallHook,
  SyncHook,
  SyncWaterfallHook,
} from '@rspack/lite-tapable';
import {
  FinishOption,
  OptionsOption,
  AfterCopyOption,
  BeforeCopyOption,
  CopyFolderPlugin,
  CopyFolderPluginOptions,
} from './types';

export function registerPlugins(plugins: CopyFolderPlugin[]) {
  plugins.forEach((plugin) => {
    plugin?.apply?.(hooks);
  });
}

export const pluginHook = new AsyncSeriesWaterfallHook<CopyFolderPluginOptions>(
  ['options'],
);

export const hooks = {
  optionHook: new SyncWaterfallHook<OptionsOption>(['options']),
  beforeCopyHook: new AsyncSeriesWaterfallHook<BeforeCopyOption>(['options']),
  afterCopyHook: new AsyncSeriesWaterfallHook<AfterCopyOption>(['options']),
  finishHook: new SyncHook<FinishOption>(['options']),
};

export type HooksType = typeof hooks;
