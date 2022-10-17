import type { Plugin, RollupWarning } from 'rollup';
export declare function syncCommunicationModulesPlugin(opts: BuildOptions, msgType: MessageType): Plugin;
export declare function fileSize(): Plugin;
export declare function submodulePath(moduleId: string, submodulePath: string): Plugin;
export declare function submodulePackageJson(submoduleName: string, submoduleSrcDir: string, submoduleBuildDir: string, opts: BuildOptions): Plugin;
export declare function watchDir(opts: BuildOptions, dir: string): Plugin;
export declare function onwarn(warning: RollupWarning): void;
export declare function getJsBanner(opts: BuildOptions, jsCode: string): string;
export declare function jsBannerPlugin(opts: BuildOptions): Plugin;
export declare function versionPlugin(opts: BuildOptions): Plugin;
export interface BuildOptions {
    isDev: boolean;
    isReleaseBuild: boolean;
    rootDir: string;
    distIntegrationDir: string;
    distLibDir: string;
    distLibDebugDir: string;
    distServicesDir: string;
    distReactDir: string;
    distUtilsDir: string;
    srcDir: string;
    srcIntegrationDir: string;
    srcServicesDir: string;
    srcLibDir: string;
    srcReactDir: string;
    srcUtilsDir: string;
    testsDir: string;
    testsVideosDir: string;
    tscDir: string;
    tscIntegrationDir: string;
    tscServicesDir: string;
    tscLibDir: string;
    tscReactDir: string;
    tscUtilsDir: string;
    packageJson: PackageJson;
}
export interface PackageJson {
    version: string;
}
export declare type MessageType = 'sw' | 'atomics';
