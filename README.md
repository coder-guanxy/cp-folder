# cpdirplus

cpdirplus mean richer copy functions.

## Installation

```bash
# npm
npm install cpdirplus --save-dev
# yarn
yarn add cpdirplus --save-dev
# pnpm
pnpm add cpdirplus --save-dev
```

## Usage

### basic

copy ./dist to ./build/productionDist

```
cpdirplus({
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
})
```

### command line

just copy

```bash
cpdirplus ./dist ./build/productionDist
```

```bash
cpdirplus -f ./dist -t ./build/productionDist
```

```bash
cpdirplus --from ./dist --to ./build/productionDist
```

remove - delete source after copy.

```bash
cpdirplus ./dist ./build/productionDist -m
```

base

```bash
cpdirplus "**/*js" ./build/productionDist -b dist
```

### renameFiles

rename then file. base path is from field.

```js
cpdirplus({
  from: path.join(__dirname, 'dist'),
  to: path.join(__dirname, 'build/productionDist'),
  renameFiles: { _gitignore: '.gitignore' },
});
```

### replacements

`%PORJECTNAME%` to replace with a `CopyDirectory` string in the `README.md` file.

```js
// dist/README.md
xxxxx%PORJECTNAME%xxxxx
    🔽
// build/productionDist/README.md
xxxxxCopyDirectoryxxxxx
```

```js
cpdirplus({
  from: path.join(__dirname, 'dist'),
  to: path.join(__dirname, 'build/productionDist'),
  replacements: [{ filename: 'README.md', PORJECTNAME: 'CopyDirectory' }],
});
```

### test

Use a regular approach.

All js file under the `from` path.

```js
cpdirplus({
    test: /\.js$/
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
})
```

### include

Using the globs rule.

All ts files in the src directory will be included.

```js
cpdirplus({
    include: ["src/*.ts"]
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
})
```

### exclude

Using the globs rule.

Exclude all css files under dist.

```js
cpdirplus({
    exclude: ["dist/*.css"]
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
})
```

### move

Whether to delete the source.

just move the source.

```js
cpdirplus({
  move: true, // default false
  from: path.join(__dirname, 'dist'),
  to: path.join(__dirname, 'build/productionDist'),
});
```

## Options

| name         | type                | default | description            | required |
| ------------ | ------------------- | ------- | ---------------------- | -------- |
| from         | string              | -       | source path            | true     |
| to           | string              | -       | target path            | true     |
| test         | Regex               | -       | match file             | false    |
| include      | Regex               | -       | match file             | false    |
| exclude      | Regex               | -       | match file             | false    |
| renameFiles  | string[]            | -       | rename file            | false    |
| move         | boolean             | false   | remove source          | false    |
| replacements | ReplacementOption[] | -       | magic field - %Public% | false    |
