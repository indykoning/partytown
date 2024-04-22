/**
 * Absolute path to the Partytown lib directory within the
 * `@builder.io/partytown` package.
 *
 * https://partytown.builder.io/copy-library-files
 *
 * @public
 */
export declare function libDirPath(opts?: LibDirOptions): string;
/**
 * Utility to copy the Partytown library files to a destination on the server.
 * Partytown requires its library files, such as `partytown.js` to be served
 * as static files from the same origin. By default the library assumes all the
 * files can be found at `/~partytown/`, but this can be configured.
 *
 * This utility function is to make it easier to locate the source library files
 * and copy them to your server's correct location, for example: `./public/~partytown/`.
 *
 * By default, both the production and debug builds are copied to the destination.
 * However, by setting the `debugDir` option to `false`, the debug directory will
 * not be copied.
 *
 * https://partytown.builder.io/copy-library-files
 *
 * @public
 */
export declare function copyLibFiles(dest: string, opts?: CopyLibFilesOptions): Promise<{
    src: string;
    dest: string;
}>;
/**
 * @public
 */
export interface CopyLibFilesOptions {
    /**
     * When set to `false` the `lib/debug` directory will not be copied. The default is
     * that both the production and debug directories are copied to the destination.
     */
    debugDir?: boolean;
}
/**
 * @public
 */
export interface LibDirOptions {
    /**
     * When the `debugDir` option is set to `true`, the returned
     * directory is the absolute path to the `lib/debug` directory.
     */
    debugDir?: boolean;
}
