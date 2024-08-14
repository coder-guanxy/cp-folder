import { AsyncSeriesWaterfallHook } from '@rspack/lite-tapable';
import {
  mkdirSync,
  readdirSync,
  statSync,
  copyFileSync,
  existsSync,
  renameSync,
} from 'node:fs';
import { globSync } from 'glob';
import path from 'node:path';
import { rimrafSync } from 'rimraf';
import { handleRename } from './rename';
import { getLogger } from './utils/logger';
import { registerPlugins, pluginHook } from './plugin';
import ReplacementPlugin from './build-in-plugins/replacement-plugin';
import type {
  CopyFolderPluginOptions,
  CopyFolderOptions,
  InnnerCopyFolderOptions,
} from './types';

export * from './types';

export type CopyFolderHook = typeof pluginHook;

/**
 * @description copy folder content to other folder
 */

const logger = getLogger('cpdirplus');

export default (options: CopyFolderOptions) => {
  return new Promise((resolve) => {
    if (typeof options !== 'object') {
      throw new Error('options must be an object');
    }

    if (!options.to || typeof options.to !== 'string') {
      throw new Error('to must be a string');
    }

    if (!options.from || typeof options.from !== 'string') {
      throw new Error('from must be a string');
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
      logger.success(`\nCopy folders successfully.
  from: ${from}
  to: ${options.to}\n`);
      resolve('done');
    };

    resultOptions = { ...resultOptions, onFinish };
    copyFolder(resultOptions, true);
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

function copyFolder(options: InnnerCopyFolderOptions, wrapFlag?: boolean) {
  const {
    from,
    to,
    excludeMatches = [],
    includeMatches,
    RawOptions: { from: RawFrom },
    onFinish,
    test: regExpTest,
  } = options;

  mkdirSync(to, { recursive: true });

  let count = 0;

  const fromDir = readdirSync(from);

  const onDone = (count: number) => {
    if (wrapFlag) {
      if (fromDir.length === count) {
        onFinish?.();
      }
    }
  };

  for (const filename of fromDir) {
    const excludeMatched = excludeMatches.find((matched) =>
      path.resolve(RawFrom, matched).startsWith(path.resolve(from, filename)),
    );

    if (excludeMatched) {
      if (wrapFlag) {
        count++;

        onDone(count);
      }

      continue;
    }

    const includeMatched = includeMatches!.find((matched) =>
      path.resolve(RawFrom, matched).startsWith(path.resolve(from, filename)),
    );

    if (!includeMatched) {
      if (wrapFlag) {
        count++;
      }

      onDone(count);
      continue;
    }

    pluginHook.callAsync(
      { ...options, filename },
      (
        err: Error | null,
        result: CopyFolderPluginOptions | null | undefined,
      ) => {
        const { from, to, renameFiles = {} } = result!;

        if (err) {
          throw err;
        } else {
          if (result === undefined || result === null) {
            return;
          }

          if (wrapFlag) {
            count++;
          }

          // rename file
          const _filename = handleRename(renameFiles, filename);

          const srcPath = path.resolve(from, filename);
          const targetPath = path.resolve(to, result!?.filename);

          if (statSync(srcPath).isDirectory()) {
            copyFolder({ ...result, from: srcPath, to: targetPath });
          } else {
            // unmatched file
            if (regExpTest && !regExpTest.test(filename)) return onDone(count);

            // copy file
            if (!existsSync(targetPath)) {
              copyFileSync(srcPath, targetPath);
            }

            if (_filename) {
              const finishPath = path.resolve(to, _filename);
              renameSync(targetPath, finishPath);
            }
          }

          if (wrapFlag) {
            onDone(count);
          }
        }
      },
    );
  }
}
