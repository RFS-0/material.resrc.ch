import path from "path";
import {defineConfig} from "vite";
import dts from "vite-plugin-dts";
import solidPlugin from "vite-plugin-solid";

import pkg from "./package.json";

export default defineConfig({
    plugins: [
        solidPlugin({
            dev: true,
        }),
        dts({
            tsConfigFilePath: "tsconfig.build.json",
            insertTypesEntry: true,
            noEmitOnError: true,
            skipDiagnostics: false,
            logLevel: "info"
        })
    ],
    build: {
        sourcemap: true,
        cssCodeSplit: true,
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            formats: ["es", "cjs"],
            fileName: format => (format === "es" ? "index.mjs" : "index.cjs")
        },
        rollupOptions: {
            external: [
                ...Object.keys(pkg.dependencies),
                ...Object.keys(pkg.peerDependencies),
                "solid-js",
                "solid-js/web",
                "solid-js/store"
            ]
        }
    }
});
