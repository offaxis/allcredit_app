import { name } from '../../package.json';

export function getReducerNamespace(namespace) {
    return `${name}_${namespace}`;
}
