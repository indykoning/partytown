import { isAbsolute } from 'path';
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
    if (typeof opts.dest !== 'string' || opts.dest.length === 0) {
        throw new Error(`Partytown plugin must have "dest" property.`);
    }
    if (!isAbsolute(opts.dest)) {
        throw new Error(`Partytown plugin "dest" property must be an absolute path.`);
    }
    let hasCopied = false;
    const plugin = {
        name: 'rollup-plugin-partytown',
        async writeBundle() {
            if (!hasCopied) {
                await copyLibFiles(opts.dest, { debugDir: opts.debug });
                hasCopied = true;
            }
        },
    };
    return plugin;
}
