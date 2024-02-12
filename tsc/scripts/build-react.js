import { submodulePackageJson, submodulePath } from './utils.js';
import { join } from 'node:path';
export function buildReact(opts) {
    return {
        input: join(opts.tscReactDir, 'index.js'),
        output: [
            {
                file: join(opts.distReactDir, 'index.cjs'),
                format: 'cjs',
            },
            {
                file: join(opts.distReactDir, 'index.mjs'),
                format: 'es',
            },
        ],
        external: ['react'],
        plugins: [
            submodulePath('@builder.io/partytown/integration', '../integration/index'),
            submodulePackageJson('@builder.io/partytown/react', opts.srcReactDir, opts.distReactDir, opts),
        ],
    };
}
