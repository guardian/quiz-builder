export function nthLetter(n) {
    return 'abcdefghijklmnopqrstuvwxyz'[n];
}

export function insertAt(xs, n, x) {
    return xs.slice(0, n).push(x).concat(xs.slice(n));
}
