import { CopyFolderHook, CopyFolderPluginOptions } from '../index';
import { writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { HooksType } from 'src/plugin';

export interface ReplacementOption {
  filename: string;
  [key: string]: string;
}

export default class ReplacementPlugin {
  constructor(private options: ReplacementOption[] = []) {}
  private escapeStringRegexp(str: string) {
    if (typeof str !== 'string') {
      throw new TypeError('Expected a string');
    }

    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  }
  public apply(hook: HooksType) {
    hook.beforeCopyHook.tapPromise(
      'onBeforeCopy',
      (options: CopyFolderPluginOptions) => {
        const {
          from,
          to,
          filename,
          RawOptions: { from: RawFrom },
        } = options;

        this.options.forEach((option) => {
          const { filename: _filename, ...restOption } = option;

          const filenameMatched = globSync(_filename, { cwd: RawFrom });

          const result = filenameMatched.find((f) => {
            return path.resolve(RawFrom, f) === path.resolve(from, filename);
          });

          if (result) {
            let readmeContent = readFileSync(
              path.join(from, filename),
              'utf-8',
            );

            Object.entries(restOption).forEach(([key, value]) => {
              readmeContent = readmeContent.replace(
                new RegExp('%' + this.escapeStringRegexp(key) + '%', 'g'),
                value,
              );
            });

            writeFileSync(path.join(to, filename), readmeContent, 'utf-8');
          }
        });

        return Promise.resolve(options);
      },
    );
  }
}
