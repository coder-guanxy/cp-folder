import { AsyncSeriesWaterfallHook } from '@rspack/lite-tapable';
import { ReplacementOption } from '../build-in-plugins/replacement-plugin';

export interface CopyFolderPlugin {
  onBeforeCopy: (
    hook: AsyncSeriesWaterfallHook<CopyFolderPluginOptions>,
  ) => void;
}

export type CopyFolderOptionRename = Record<string, string>;

export interface CopyFolderOptions {
  test?: RegExp; // filter file
  include?: string[] | string; // filter dir
  exclude?: string[] | string; // filter dir
  from: string;
  to: string;
  renameFiles?: CopyFolderOptionRename;
  replacements?: ReplacementOption[];
  move?: boolean;
  plugins?: CopyFolderPlugin[];
}

export interface InnnerCopyFolderOptions extends CopyFolderOptions {
  tempFile?: string;
  excludeMatches?: string[];
  includeMatches?: string[];
  onFinish?: () => void;
  readonly RawOptions: CopyFolderOptions;
}

export interface CopyFolderPluginOptions extends InnnerCopyFolderOptions {
  filename: string;
}
