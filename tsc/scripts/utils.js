import gzipSize from 'gzip-size';
import { basename, join } from 'path';
import fsExtra from 'fs-extra';
const { readdirSync, readFileSync, readJson, statSync, writeJson } = fsExtra;
export function syncCommunicationModulesPlugin(opts, msgType) {
    return {
        name: 'syncCommunicationModulesPlugin',
        resolveId(id) {
            if (id.endsWith('sync-send-message-to-main')) {
                if (msgType === 'sw') {
                    return join(opts.tscLibDir, 'service-worker', `sync-send-message-to-main-sw.js`);
                }
                if (msgType === 'atomics') {
                    return join(opts.tscLibDir, 'atomics', `sync-send-message-to-main-atomics.js`);
                }
            }
            if (id.endsWith('sync-create-messenger')) {
                if (msgType === 'sw') {
                    return join(opts.tscLibDir, 'service-worker', `sync-create-messenger-sw.js`);
                }
                if (msgType === 'atomics') {
                    return join(opts.tscLibDir, 'atomics', `sync-create-messenger-atomics.js`);
                }
            }
            return null;
        },
    };
}
export function fileSize() {
    return {
        name: 'fileSize',
        writeBundle(options) {
            const filePath = options.file;
            if (!filePath.includes('debug')) {
                const s = statSync(filePath);
                const gzip = gzipSize.sync(readFileSync(filePath, 'utf-8'));
                console.log(`🕺 ${basename(filePath)}: ${s.size} b`);
                console.log(`🎉 ${basename(filePath)}: ${gzip} b (gzip)`);
            }
        },
    };
}
export function submodulePath(moduleId, submodulePath) {
    return {
        name: 'resolveSubmodule',
        async resolveId(id) {
            if (id === moduleId) {
                return {
                    external: true,
                    id: submodulePath + '._MODULE_EXT_',
                };
            }
            return null;
        },
        generateBundle(opts, bundle) {
            const ext = opts.format === 'cjs' ? 'cjs' : 'mjs';
            for (const f in bundle) {
                const b = bundle[f];
                if (b.type === 'chunk') {
                    b.code = b.code.replace(/_MODULE_EXT_/g, ext);
                }
            }
        },
    };
}
export function submodulePackageJson(submoduleName, submoduleSrcDir, submoduleBuildDir, opts) {
    return {
        name: 'submodulePackageJson',
        async writeBundle() {
            const pkg = await readJson(join(submoduleSrcDir, 'package.json'));
            pkg.name = submoduleName;
            pkg.version = opts.packageJson.version;
            pkg.private = true;
            await writeJson(join(submoduleBuildDir, 'package.json'), pkg, { spaces: 2 });
        },
    };
}
export function watchDir(opts, dir) {
    return {
        name: 'watchDir',
        buildStart() {
            const addWatch = (p) => {
                const s = statSync(p);
                if (s.isDirectory()) {
                    readdirSync(p).forEach((fileName) => addWatch(join(p, fileName)));
                }
                else if (s.isFile() && p.endsWith('.js')) {
                    this.addWatchFile(p);
                }
            };
            if (opts.isDev) {
                addWatch(dir);
            }
        },
    };
}
export function onwarn(warning) {
    if (warning.code === 'CIRCULAR_DEPENDENCY')
        return;
    console.log(warning.code);
}
export function getJsBanner(opts, jsCode) {
    return `/* Partytown ${opts.packageJson.version} - MIT builder.io */\n${jsCode}`;
}
export function jsBannerPlugin(opts) {
    return {
        name: 'jsBanner',
        async generateBundle(_, bundles) {
            for (const f in bundles) {
                const bundle = bundles[f];
                if (bundle.type === 'chunk') {
                    bundle.code = getJsBanner(opts, bundle.code);
                }
            }
        },
    };
}
export function versionPlugin(opts) {
    return {
        name: 'versionPlugin',
        generateBundle(_, bundles) {
            for (const f in bundles) {
                const bundle = bundles[f];
                if (bundle.type === 'chunk') {
                    bundle.code = bundle.code.replace(/_VERSION_/g, opts.packageJson.version);
                }
            }
        },
    };
}
