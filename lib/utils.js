export function nthLetter(n) {
    return 'abcdefghijklmnopqrstuvwxyz'[n];
}

export function insertAt(xs, n, x) {
    return xs.slice(0, n).push(x).concat(xs.slice(n));
}

export function move(xs, n, m) {
    const x = xs.get(n);

    return insertAt(xs, m, x).remove(m < n ? n + 1 : n);
}
