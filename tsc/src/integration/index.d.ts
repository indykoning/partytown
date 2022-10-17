import type { PartytownConfig } from '../lib/types';
/**
 * Function that returns the Partytown snippet as a string, which can be
 * used as the innerHTML of the inlined Partytown script in the head.
 *
 * @public
 */
export declare const partytownSnippet: (config?: PartytownConfig | undefined) => string;
export { SCRIPT_TYPE } from '../lib/utils';
export type { PartytownConfig, PartytownForwardProperty, ApplyHook, GetHook, SetHook, ResolveUrlType, } from '../lib/types';
