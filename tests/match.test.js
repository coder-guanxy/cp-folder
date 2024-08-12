const path = require("node:path");
const fs = require("node:fs");
const { describe, it, expect } = require("@jest/globals")
const { rimrafSync } = require("rimraf");
const cpdir = require("../dist").default

describe("cpdir test, include, exclude", () => {

    afterEach(() => {
        const targetPath = path.join(__dirname, "../build")
        if (fs.existsSync(targetPath)) {
            rimrafSync(targetPath)            
        }
    })

    it("1 => 1", () => {
        expect(1).toBe(1)
    })

    // it("should test filter files", async () => {
    //     const sourcePath = path.resolve(__dirname, "../dist")
    //     const targetPath = path.resolve(__dirname, "../build")

    //     await cpdir({
    //         test: /\.js$/,
    //         from: sourcePath,
    //         to: targetPath,
    //     }).then(() => {

    //         const result = fs.readdirSync(targetPath);

    //         console.log("reuslt", result)

    //         expect(result).not.toContain(["index.js.map"]);
    //     })
    // })

    // it.concurrent("should include file", async () => {
    //     const sourcePath = path.resolve(__dirname, "../dist")
    //     const targetPath = path.resolve(__dirname, "../build")

    //     await cpdir({
    //         include: ["./**/*.js"],
    //         from: sourcePath,
    //         to: targetPath,
    //     }).then(() => {

    //         const result = fs.readdirSync(targetPath);

    //         console.log("reuslt", result)

    //         expect(result).not.toContain(["index.js.map"]);
    //     })
    // }, 100000)
})