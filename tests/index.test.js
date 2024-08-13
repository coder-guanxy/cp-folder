const path = require('node:path');
const fs = require('node:fs');
const { describe, it, expect, afterEach, beforeAll } = require('@jest/globals');
const { rimrafSync } = require('rimraf');
const cpdir = require('../dist').default;

describe('cpdir basic copy', () => {
  beforeAll(() => {
    const targetPath = path.join(__dirname, '../build');
    if (fs.existsSync(targetPath)) {
      rimrafSync(targetPath);
    }
  });

  afterEach(() => {
    const targetPath = path.join(__dirname, '../build');
    if (fs.existsSync(targetPath)) {
      rimrafSync(targetPath);
    }
  });

  it("basic copy 'from, to' filed", () => {
    const sourcePath = path.resolve(__dirname, '../dist');
    const targetPath = path.resolve(__dirname, '../build');
    cpdir({
      from: sourcePath,
      to: targetPath,
    }).then(() => {
      const sourceFiles = fs.readdirSync(sourcePath);
      const targetFiles = fs.readdirSync(targetPath);

      expect(sourceFiles).toMatchObject(targetFiles);
    });
  });

  it("basic no 'from' option", async () => {
    try {
      await cpdir({
        to: path.resolve(__dirname, '../build'),
      });
    } catch (e) {
      expect(e.message).toBe('from must be a string');
    }
  });

  it("basic no exist 'from, to' option", async () => {
    try {
      await cpdir({
        from: 'xxx',
        to: path.resolve(__dirname, '../build'),
      });
    } catch (e) {
      expect(e.message).toContain('no such file or directory');
    }
  });

  it('basic from is file path', () => {
    const sourcePath = path.resolve(__dirname, '../dist/index.js');
    const targetPath = path.resolve(__dirname, '../build1');
    cpdir({
      from: sourcePath,
      to: targetPath,
    }).then(() => {
      const files = fs.readdirSync(targetPath);
      expect(files.length).toBe(1);
      expect(files).toMatchObject(['index.js']);
    });
  });
});
