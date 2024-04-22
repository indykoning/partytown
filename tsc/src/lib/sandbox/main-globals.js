import { debug } from '../utils';
export const mainWindow = window.parent;
export const docImpl = document.implementation.createHTMLDocument();
export const config = mainWindow.partytown || {};
export const libPath = (config.lib || '/~partytown/') + (debug ? 'debug/' : '');
