// General
import aboutUs from './data/about-us';
import legalMention from './data/legal-mention';

// Métiers
import metiers from './data/metiers';
import metiersPretImmo from './data/metiers/pret-immobilier';
import metiersRegroupementCredits from './data/metiers/regroupement-credits';
import metiersPretPro from './data/metiers/pret-professionnel';
import metiersAssurancePret from './data/metiers/assurance-pret';
import metiersEngagements from './data/metiers/engagements';


export const PAGES = {
    'about-us': aboutUs,
    'legal-mention': legalMention,
    'metiers': metiers,
    'metiers/assurance-pret': metiersAssurancePret,
    'metiers/engagements': metiersEngagements,
    'metiers/pret-immobilier': metiersPretImmo,
    'metiers/pret-professionnel': metiersPretPro,
    'metiers/regroupement-credits': metiersRegroupementCredits,
};

export function getPageData(id) {
    console.log('getPageData', id, !!PAGES[id] && 'found');
    return PAGES[id] || {};
}
