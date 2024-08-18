/* istanbul ignore file */
const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const { describe, it, expect, afterEach } = require('@jest/globals');
const { rimrafSync } = require('rimraf');
describe('cpdir move', () => {
  afterEach(() => {
    const targetPath = path.join(__dirname, '../build');
    if (fs.existsSync(targetPath)) {
      rimrafSync(targetPath);
    }
  });

  it('should exec cpdirplus -m in shell', async () => {
    const sourcePath = path.resolve(__dirname, '../dist');
    const tempPath = path.resolve(__dirname, '../temp');
    const targetPath = path.resolve(__dirname, '../build');

    execSync(`cpdirplus ${sourcePath} ${tempPath}`);

    execSync(`cpdirplus ${tempPath} ${targetPath} -m`);
    expect(fs.existsSync(tempPath)).toBeFalsy();
  });

  it('should basic exec cpdirplus in shell', async () => {
    const sourcePath = path.resolve(__dirname, '../dist');
    const targetPath = path.resolve(__dirname, '../build');

    execSync(`cpdirplus ${sourcePath} ${targetPath}`);

    function readResultDir() {
      const sourceResult = fs.readdirSync(sourcePath);
      const targetResult = fs.readdirSync(targetPath);

      return [sourceResult, targetResult];
    }

    const [sourceResult1, targetResult1] = readResultDir();

    expect(sourceResult1).toEqual(targetResult1);

    rimrafSync(targetPath);

    execSync(`cpdirplus -f ${sourcePath} -t ${targetPath}`);

    const [sourceResult2, targetResult2] = readResultDir();

    expect(sourceResult2).toEqual(targetResult2);

    rimrafSync(targetPath);

    execSync(`cpdirplus --from ${sourcePath} --to ${targetPath}`);

    const [sourceResult3, targetResult3] = readResultDir();

    expect(sourceResult3).toEqual(targetResult3);
  });

  it('should exec be error when option is invalid', () => {
    const sourcePath = path.resolve(__dirname, '../dist');
    const targetPath = path.resolve(__dirname, '../build');

    try {
      execSync(`cpdirplus ${sourcePath} -s ${targetPath}`);
    } catch (err) {
      expect(err.message).toContain('to [target path] must be a string');
    }
  });
});
