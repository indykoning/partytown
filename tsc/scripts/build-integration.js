import { submodulePackageJson } from './utils';
import { join } from 'path';
import { readFile } from 'fs-extra';
export function buildIntegration(opts) {
    const output = [
        {
            file: join(opts.distIntegrationDir, 'index.cjs'),
            format: 'cjs',
        },
        {
            file: join(opts.distIntegrationDir, 'index.mjs'),
            format: 'es',
        },
    ];
    return {
        input: join(opts.tscIntegrationDir, 'index.js'),
        output,
        plugins: [
            {
                name: 'snippet',
                resolveId(id) {
                    if (id === '@snippet') {
                        return id;
                    }
                },
                async load(id) {
                    if (id === '@snippet') {
                        const codeFileName = 'partytown.js';
                        let codeFilePath;
                        if (opts.isDev) {
                            codeFilePath = join(opts.distLibDebugDir, codeFileName);
                        }
                        else {
                            codeFilePath = join(opts.distLibDir, codeFileName);
                        }
                        const code = JSON.stringify((await readFile(codeFilePath, 'utf-8')).trim());
                        return `const PartytownSnippet = ${code}; export default PartytownSnippet;`;
                    }
                },
            },
            submodulePackageJson('@builder.io/partytown/integration', opts.srcIntegrationDir, opts.distIntegrationDir, opts),
        ],
    };
}
