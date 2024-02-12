import { submodulePackageJson } from './utils.js';
import { join } from 'node:path';
export function buildServices(opts) {
    const output = [
        {
            file: join(opts.distServicesDir, 'index.cjs'),
            format: 'cjs',
        },
        {
            file: join(opts.distServicesDir, 'index.mjs'),
            format: 'es',
        },
    ];
    return {
        input: join(opts.tscServicesDir, 'index.js'),
        output,
        plugins: [
            submodulePackageJson('@builder.io/partytown/services', opts.srcServicesDir, opts.distServicesDir, opts),
        ],
    };
}
