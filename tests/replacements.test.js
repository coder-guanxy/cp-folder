const path = require('node:path');
const fs = require('node:fs');
const { describe, it, expect } = require('@jest/globals');
const { rimrafSync } = require('rimraf');
const cpdir = require('../dist').default;

describe('cpdir replacements', () => {
  afterEach(() => {
    const targetPath = path.join(__dirname, '../build');
    if (fs.existsSync(targetPath)) {
      rimrafSync(targetPath);
    }
  });

  it('should replacements %PORJECTNAME% replace __project_name__', async () => {
    const sourcePath = path.resolve(__dirname, '../dist');
    const targetPath = path.resolve(__dirname, '../build');

    const readmePath = path.join(sourcePath, 'README.md');
    const content = '%PORJECTNAME%';
    fs.writeFileSync(readmePath, content, { encoding: 'utf8' });

    await cpdir({
      from: sourcePath,
      to: targetPath,
      replacements: [{ filename: ['**.md'], PORJECTNAME: '__project_name__' }],
    }).then(() => {
      const readmeTargetPath = path.join(targetPath, 'README.md');

      const result = fs.readFileSync(readmeTargetPath, { encoding: 'utf8' });

      expect(result).toContain('__project_name__');

      rimrafSync(readmePath);
    });
  });
});
