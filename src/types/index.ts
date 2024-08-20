import { ReplacementOption } from '../build-in-plugins/replacement-plugin';
import { HooksType } from 'src/plugin';

export interface CopyFolderPlugin {
  apply?: (hook: HooksType) => unknown;
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
  base?: string;
  plugins?: CopyFolderPlugin[];
}

export interface InnnerCopyFolderOptions extends CopyFolderOptions {
  excludeMatches?: string[];
  includeMatches?: string[];
  onFinish?: () => void;
  readonly RawOptions: CopyFolderOptions;
}

export interface CopyFolderPluginOptions extends InnnerCopyFolderOptions {
  filename: string;
}

export abstract class CPDirPlugin {
  abstract apply(hook: HooksType): unknown;
}

export type FinishOption = InnnerCopyFolderOptions;
export type AfterFinishHook = HooksType['finishHook'];

export type OptionsOption = InnnerCopyFolderOptions;
export type AfterOptionHook = HooksType['optionHook'];

export type AfterCopyOption = CopyFolderPluginOptions;
export type AfterCopyHook = HooksType['afterCopyHook'];

export type BeforeCopyOption = CopyFolderPluginOptions;
export type BeforeCopyHook = HooksType['beforeCopyHook'];
