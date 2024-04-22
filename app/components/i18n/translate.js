import en from './en.json';
import te from './te.json';
import hi from './hi.json';
import { I18n } from 'i18n-js';

const translations = {
    en: en,
    hi: hi,
    te: te
};

const translate = new I18n(translations);
translate.enableFallback = true;

export default translate;