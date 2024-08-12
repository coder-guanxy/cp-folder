# cpdir

cpdir mean copy directory, copy folder

 ## Installation

```bash
# npm
npm install cpdir --save-dev
# yarn
yarn add cpdir --save-dev
# pnpm
pnpm add cpdir --save-dev
```

## Usage

### basic

copy ./dist to ./build/productionDist

```
cpdir({
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
})
```

### renameFiles

rename then file. base path is from field.

```js
cpdir({
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
    renameFiles: {_gitignore: ".gitignore"},
})
```


### replacements

 `%PORJECTNAME%` to replace with a `CopyDirectory` string in the `README.md` file.

```js
cpdir({
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
    replacements: [{filename: "README.md", PORJECTNAME: "CopyDirectory"}],
})
```

### filter 

The are three ways to filter.

#### test

Use a regular approach.

All js file under the `from` path.

```js
cpdir({
    test: /\.js$/
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
})
```

#### include

Using the globs rule.

All ts files in the src directory will be included.

```js
cpdir({
    include: ["src/*.ts"]
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
})
```

#### include

Using the globs rule.

Exclude all css files under dist.

```js
cpdir({
    exclude: ["dist/*.css"]
    from: path.join(__dirname, "dist"),
    to: path.join(__dirname, "build/productionDist"),
})
```


## Options

| name | type | default | description | required | 
| -- | -- | -- | -- | -- |
|from| string| - | source path | true |
|to| string| - | target path | true |
|test| Regex | - | match file | false |
|include| Regex | - | match file | false |
|exclude| Regex | - | match file | false |
|renameFiles| string[] | - | rename file | false |
|replacements| ReplacementOption[] | - | replacement field - %Public% | false |
