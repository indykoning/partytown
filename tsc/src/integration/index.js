import PartytownSnippet from '@snippet';
import { createSnippet } from './snippet';
/**
 * Function that returns the Partytown snippet as a string, which can be
 * used as the innerHTML of the inlined Partytown script in the head.
 *
 * @public
 */
export const partytownSnippet = (config) => createSnippet(config, PartytownSnippet);
export { SCRIPT_TYPE } from '../lib/utils';
