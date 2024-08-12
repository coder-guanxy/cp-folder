const path = require("node:path");
const fs = require("node:fs");
const { describe, it, expect } = require("@jest/globals")
const {rimrafSync} = require("rimraf");
const cpdir = require("../dist").default

describe("cpdir rename", () => {

    afterEach(() => {
        const targetPath = path.join(__dirname, "../build")
        if (fs.existsSync(targetPath)) {
            rimrafSync(targetPath)            
        }
    })

    it("should rename files", async () => {
        const sourcePath = path.resolve(__dirname, "../dist")
        const targetPath = path.resolve(__dirname, "../build")

        cpdir({
            from: sourcePath,
            to: targetPath,
            renameFiles: {"index.js.map": "_index.js.map"}
        }).then(() => {
            const result = fs.readdirSync(targetPath);

            expect(result).toContain('_index.js.map');
        })
    })

    it("should rename no exist file", async () => {
        const sourcePath = path.resolve(__dirname, "../dist")
        const targetPath = path.resolve(__dirname, "../build")

        cpdir({
            from: sourcePath,
            to: targetPath,
            renameFiles: {"_index.js.map": "index.js.map"}
        }).then(() => {
            const sourceFiles = fs.readdirSync(targetPath);
            const targetFiles = fs.readdirSync(targetPath);

            expect(sourceFiles).toMatchObject(targetFiles);
        })
    })
})