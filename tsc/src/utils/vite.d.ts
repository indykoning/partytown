import type { PartytownRollupOptions } from './rollup';
/** @public */
export interface PartytownViteOptions extends PartytownRollupOptions {
}
/**
 * The Vite plugin will copy Partytown `lib` directory to the given destination,
 * which must be an absolute file path. When in dev mode, the Partytown
 * lib files will be served using the Vite Dev Server.
 *
 * https://partytown.builder.io/copy-library-files
 *
 * @public
 */
export declare function partytownVite(opts: PartytownViteOptions): {
    name: string;
};
