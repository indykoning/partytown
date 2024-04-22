import { submodulePackageJson } from './utils.js';
import { join } from 'node:path';
export function buildUtils(opts) {
    return {
        input: join(opts.tscUtilsDir, 'index.js'),
        output: [
            {
                file: join(opts.distUtilsDir, 'index.cjs'),
                format: 'cjs',
            },
            {
                file: join(opts.distUtilsDir, 'index.mjs'),
                format: 'es',
            },
        ],
        external: ['fs', 'path', 'url', 'util'],
        plugins: [
            submodulePackageJson('@builder.io/partytown/utils', opts.srcUtilsDir, opts.distUtilsDir, opts),
        ],
    };
}
