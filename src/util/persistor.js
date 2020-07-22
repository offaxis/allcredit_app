import { storagePersistent } from './storage';

export function persistData(key, data) {
    if(storagePersistent) {
        storagePersistent.setItem(key, data ? JSON.stringify(data) : '');
    }
}

export function getPersistedData(key, defaultData = {}) {
    if(storagePersistent) {
        try {
            const data = storagePersistent.getItem(key) && JSON.parse(storagePersistent.getItem(key));
            return data || defaultData;
        } catch (e) {
            return defaultData;
        }
    }
    return defaultData;
}
