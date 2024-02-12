import { isAbsolute, join } from 'node:path';
import { copyLibFiles } from './copy-lib-files';
/**
 * The Rollup plugin will copy Partytown `lib` directory to the given destination,
 * which must be an absolute file path.
 *
 * https://partytown.builder.io/copy-library-files
 *
 * @public
 */
export function partytownRollup(opts) {
    opts = opts || {};
    const plugin = {
        name: 'rollup-plugin-partytown',
        async writeBundle(rollupOpts) {
            const dir = (opts === null || opts === void 0 ? void 0 : opts.dest) || (rollupOpts.dir ? join(rollupOpts.dir, '~partytown') : undefined);
            if (typeof dir !== 'string') {
                throw new Error(`A destination directory must be specified either via the Partytown "dest" option or Rollup output dir option.`);
            }
            if (!isAbsolute(dir)) {
                throw new Error(`Partytown plugin "dest" property must be an absolute path.`);
            }
            await copyLibFiles(dir, { debugDir: opts === null || opts === void 0 ? void 0 : opts.debug });
        },
    };
    return plugin;
}
