
import { createFlatEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";

export class FlatAPItest {
    "Should create a simple univeral API"() {
        return createFlatEnv({
            project: {
                files: {
                    "index.js": `exports.something = require("./foo")`,
                    "foo.js": "module.exports = { result : '1'}",
                },

                instructions: "index.js",

            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: { result: '1' } });
        });
    }

    "Should give directory name"() {
        return createFlatEnv({
            project: {
                files: {
                    "index.js": `exports.out = __dirname`,
                },

                instructions: "index.js",

            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ out: "." });
        });
    }

    "Should give filename"() {
        return createFlatEnv({
            project: {
                files: {
                    "index.js": `exports.out = __filename`,
                },

                instructions: "index.js",

            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ out: "index.js" });
        });
    }

    "Should understand computed statements"() {
        return createFlatEnv({
            project: {
                files: {
                    "foo/hello.js": `
                        var a = "bar.js";
                        exports.test = require("./" + a)
                    `,
                    "foo/bar.js": `exports.out = __filename`
                },
                instructions: "**/**.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r("39d0381c");
            should(first).deepEqual({ test: { out: 'foo/bar.js' } });
        });
    }



    "Should understand computed statements with FuseBox.import"() {
        return createFlatEnv({
            project: {
                files: {
                    "foo/hello.js": `
                        var a = "bar.js";
                        exports.test = FuseBox.import("./" + a)
                    `,
                    "foo/bar.js": `exports.out = __filename`
                },
                instructions: "> **/**.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r("39d0381c");
            should(first).deepEqual({ test: { out: 'foo/bar.js' } });
        });
    }

    "Should execute an entry point"() {
        let random = new Date().getTime().toString();
        return createFlatEnv({
            project: {
                files: {
                    "index.ts": `
                        window.executed = "${random}";
                        module.export = {hello : "world" }
                    `,

                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            should(result.window.executed).equal(random);
        });
    }

    "Should execute twice without errors"() {
        return createFlatEnv({
            project: {
                files: {
                    "index.js": `exports.something = require("./foo")`,
                    "foo.js": "module.exports = { result : '1'}",
                },
                instructions: "> index.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: { result: '1' } });
        });
    }

    "Should bundle a partial function"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createFlatEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = require("fbjs/lib/emptyFunction")()`
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: "I am empty" });
        });
    }






}