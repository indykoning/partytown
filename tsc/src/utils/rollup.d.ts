/** @public */
export interface PartytownRollupOptions {
    /** An absolute path to the destination directory where the lib files should be copied. */
    dest: string;
    /**
     * When `debug` is set to `false`, the `lib/debug` directory will not be copied.
     * The default is that both the production and debug directories are copied to the destination.
     */
    debug?: boolean;
}
/**
 * The Rollup plugin will copy Partytown `lib` directory to the given destination,
 * which must be an absolute file path.
 *
 * https://partytown.builder.io/copy-library-files
 *
 * @public
 */
export declare function partytownRollup(opts: PartytownRollupOptions): {
    name: string;
};
