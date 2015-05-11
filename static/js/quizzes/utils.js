import filter from 'lodash-node/modern/collection/filter';

export function countWhere(as, f) {
    return filter(as, f).length;
}
