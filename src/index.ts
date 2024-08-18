import { statSync, existsSync } from 'node:fs';
import { globSync } from 'glob';
import path from 'node:path';
import { rimrafSync } from 'rimraf';
import { getLogger } from './utils/logger';
import { registerPlugins, pluginHook } from './plugin';
import ReplacementPlugin from './build-in-plugins/replacement-plugin';
import type { CopyFolderOptions, InnnerCopyFolderOptions } from './types';
import copyFolder from './copy-folder';

export * from './types';

export type CopyFolderHook = typeof pluginHook;

/**
 * @description copy folder content to other folder
 */

const logger = getLogger('cpdirplus');

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
  if (typeof from === 'string' && typeof to === 'string') {
    if (typeof options !== 'object') {
      options = {};
    }

    if (options === null) {
      options = {};
    }

    return cpdirplusImpl({
      from,
      to,
      ...options,
    });
  }

  if (typeof from === 'string' && !to) {
    return Promise.reject(
      new Error('The second parameter mean target path, be required'),
    );
  }

  if (typeof from === 'object' && !to) {
    return cpdirplusImpl(from);
  }
}

const cpdirplusImpl = (options: CopyFolderOptions) => {
  return new Promise((resolve) => {
    if (typeof options !== 'object') {
      throw new Error('options must be an object');
    }

    if (!options.to || typeof options.to !== 'string') {
      throw new Error('to [target path] must be a string');
    }

    if (!options.from || typeof options.from !== 'string') {
      throw new Error('from [source path] must be a string');
    }

    let { from, plugins = [], exclude = [], include = ['**/*'] } = options;
    let resultOptions = {
      ...options,
      RawOptions: options,
    } as InnnerCopyFolderOptions;

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

    registerPlugins(plugins);

    const onFinish = () => {
      // logger.success(` Copy folders successfully.`);
      // from: ./${path.relative(process.cwd(), from)}
      // to: ./${path.relative(process.cwd(), options.to)}\n`);
      resolve('done');
    };

    resultOptions = { ...resultOptions, onFinish };
    copyFolder(resultOptions, true);
  })
    .then((...args) => {
      logger.success(` Copy folders successfully.`);
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
