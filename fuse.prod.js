const fs = require("fs-extra");

fs.removeSync("dist");

const {
    EnvPlugin,
    FuseBox,
    QuantumPlugin,
    WebIndexPlugin,
} = require("fuse-box");

const fuse = FuseBox.init({
    homeDir: "src",
    sourceMaps: false,
    target: "browser",
    plugins: [
        EnvPlugin({
            NODE_ENV: "production"
        }),
        // See http://fuse-box.org/page/quantum ...
        QuantumPlugin({
            target: "browser",
            bakeApiIntoBundle: "vendor",
            removeExportsInterop: true,
            treeshake: true,
            uglify: {
                warnings: true
            }
        }),
        WebIndexPlugin({
            template: "src/index.html",
            target: "index.html"
        }),
    ],
    hash:true,
    output: "dist/$name.$hash.js",
});

fuse.bundle("vendor")
    .instructions("~/index.tsx");

fuse.bundle("app")
    .instructions("!> index.tsx [index.tsx]");

fuse.run();
