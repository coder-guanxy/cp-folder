import {
  mkdirSync,
  readdirSync,
  statSync,
  copyFileSync,
  existsSync,
  renameSync,
} from 'node:fs';
import path from 'node:path';
import { handleRename } from './rename';
import type { CopyFolderPluginOptions, InnnerCopyFolderOptions } from './types';
import { hooks } from './plugin';

export default function copyFolder(
  options: InnnerCopyFolderOptions,
  wrapFlag?: boolean,
) {
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

    hooks.beforeCopyHook.callAsync(
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
