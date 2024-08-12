const fs = require('fs');
const path = require('path');
const { rimrafSync } = require('rimraf');
const cpdir = require('../dist').default;

const sourcePath = path.resolve(__dirname, '../dist');
const targetPath = path.resolve(__dirname, '../build');

rimrafSync(targetPath);

cpdir({
  exclude: ['./**/*.js'],
  from: sourcePath,
  to: targetPath,
}).then(() => {
  const result = fs.readdirSync(targetPath);
  console.log('result', result);
});
