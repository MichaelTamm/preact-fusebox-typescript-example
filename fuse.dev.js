const fs = require("fs-extra");

fs.removeSync("dist");

const TypeHelper = require('fuse-box-typechecker').TypeHelper;

const typeHelper = TypeHelper({
    basePath: "./",
    tsConfig: "./tsconfig.json",
    tsLint: "./tslint.json"
});

const {
    EnvPlugin,
    FuseBox,
    TypeScriptHelpers,
    WebIndexPlugin,
} = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: "src",
    useTypescriptCompiler: true,
    sourceMaps: true,
    target: "browser",
    plugins: [
        EnvPlugin({
            NODE_ENV: "development"
        }),
        TypeScriptHelpers(),
        WebIndexPlugin({
            template: "src/index.html",
            target: "index.html"
        }),
    ],
    output: "dist/$name.js",
});

fuse.bundle("vendor")
    .instructions("~/index.tsx");

let appJsCreated = false;

fuse.bundle("app")
    .instructions("!> index.tsx [index.tsx]")
    .watch("**/*.(ts|tsx)")
    .hmr({reload: true})
    .completed(() => {
        if (appJsCreated) {
            console.log("\napp.js successfully updated\n");
        } else {
            appJsCreated = true;
            console.log("\napp.js successfully created\n");
        }
        console.log("Running typechecker ...");
        typeHelper.runSync();
    });

fuse.dev({
    root: "dist",
    open : true,
});

fuse.run();
