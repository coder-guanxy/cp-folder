import { statSync, existsSync } from 'node:fs';
import { globSync } from 'glob';
import path from 'node:path';
import { rimrafSync } from 'rimraf';
import { getLogger } from './utils/logger';
import { registerPlugins, pluginHook, hooks } from './plugin';

import * as BuildInPlugin from './build-in-plugins';

import type { CopyFolderOptions, InnnerCopyFolderOptions } from './types';
import copyFolder from './copy-folder';
import { isArray, isObject, isString } from './utils/check-type';
import CustomError from './custom-error';

const { ReplacementPlugin, SuccessLogPlugin } = BuildInPlugin;

export * from './types';

export type CopyFolderHook = typeof pluginHook;

/**
 * @description copy folder content to other folder
 */

export const logger = getLogger('cpdirplus');

export function cpdirplus(
  from: string,
  to: string,
  options?: Omit<CopyFolderOptions, 'from' | 'to'>,
): Promise<void>;

export function cpdirplus(options: CopyFolderOptions): Promise<void>;

export default function cpdirplus(
  from: string | CopyFolderOptions,
  to?: string,
  options?: Omit<CopyFolderOptions, 'from' | 'to'>,
) {
  let resultOptions = {} as CopyFolderOptions;
  // 1. from is options
  const fromIsOptions = isObject(from) && !isArray(from) && !to;

  if (fromIsOptions) {
    resultOptions = from as CopyFolderOptions;
  }

  // 2. from is string or sting[], to is string, options is object
  //  - from is pattern
  //  - from is path
  //  - from is file
  const toIsPath = (isString(from) || isArray(from)) && isString(to);

  if (toIsPath) {
    const isPattern = isArray(from) || !existsSync(from);
    if (isPattern) {
      if (options?.base) {
      }

      resultOptions = {
        to,
        from: options?.base ?? process.cwd(),
        include: from as string | string[],
        ...options,
      };
    } else {
      resultOptions = {
        from,
        to,
        ...options,
      };
    }
  }

  return cpdirplusImpl(resultOptions);
}

const cpdirplusImpl = (options: CopyFolderOptions) => {
  let resultOptions = {} as InnnerCopyFolderOptions;
  return new Promise((resolve) => {
    if (typeof options !== 'object') {
      throw new CustomError('options must be an object');
    }

    if (!options.to || typeof options.to !== 'string') {
      throw new CustomError('to [target path] must be a string');
    }

    if (!options.from || typeof options.from !== 'string') {
      throw new CustomError('from [source path] must be a string');
    }

    let { from, plugins = [], exclude = [], include = ['**/*'] } = options;
    resultOptions = {
      ...options,
      RawOptions: options,
    };

    if (statSync(from).isFile()) {
      const fromPathParse = path.parse(from);

      from = resultOptions.from = fromPathParse.dir;
      include = resultOptions.include = [fromPathParse.base];
    }

    let includeMatches = globSync(include, { cwd: from });
    resultOptions.includeMatches = includeMatches;

    let excludeMatches = globSync(exclude, { cwd: from });
    resultOptions.excludeMatches = excludeMatches;

    if (options.replacements) {
      plugins.unshift(new ReplacementPlugin(options.replacements));
    }

    plugins.unshift(new SuccessLogPlugin());

    registerPlugins(plugins);

    const onFinish = () => {
      // logger.success(` Copy folders successfully.`);
      // from: ./${path.relative(process.cwd(), from)}
      // to: ./${path.relative(process.cwd(), options.to)}\n`);
      resolve('done');
    };

    resultOptions = { ...resultOptions, onFinish };

    resultOptions = hooks.optionHook.call(resultOptions);

    copyFolder(resultOptions, true);
  })
    .then((...args) => {
      hooks.finishHook.call(resultOptions);
      // logger.success(` Copy folders successfully.`);
      return Promise.resolve(...args);
    })
    .then((...args) => {
      // move
      if (options.move) {
        if (existsSync(options.from)) {
          rimrafSync(options.from);
        }
      }

      return Promise.resolve(...args);
    })
    .catch((err) => {
      logger.error(err.message);
      return Promise.reject(err);
    });
};
