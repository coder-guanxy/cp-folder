const path = require('node:path');
const fs = require('node:fs');
const { describe, it, expect } = require('@jest/globals');
const cpdir = require('../dist').default;

describe('cpdir move', () => {
  it('should move source', async () => {
    const sourcePath = path.resolve(__dirname, '../dist');
    const tempPath = path.resolve(__dirname, '../temp');
    const targetPath = path.resolve(__dirname, '../build');

    await cpdir({
      from: sourcePath,
      to: tempPath,
    });

    cpdir({
      from: tempPath,
      to: targetPath,
      move: true,
    }).then(() => {
      const result = fs.existsSync(tempPath);

      expect(result).toBeFalsy();
    });
  });

  it('should rename no exist file', async () => {
    const sourcePath = path.resolve(__dirname, '../dist');
    const targetPath = path.resolve(__dirname, '../build');

    cpdir({
      from: sourcePath,
      to: targetPath,
      renameFiles: { '_index.js.map': 'index.js.map' },
    }).then(() => {
      const sourceFiles = fs.readdirSync(targetPath);
      const targetFiles = fs.readdirSync(targetPath);

      expect(sourceFiles).toMatchObject(targetFiles);
    });
  });
});
