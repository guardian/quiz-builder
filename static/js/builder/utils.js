import reqwest from 'reqwest';

export function nthLetter(n) {
    return 'abcdefghijklmnopqrstuvwxyz'[n];
}

export function insertAt(xs, n, x) {
    return xs.slice(0, n).push(x).concat(xs.slice(n));
}

export function move(xs, n, m) {
    const xn = xs.get(n);

    return insertAt(xs.remove(n), m, xn);
}

/**
 * Allowing you to sort by some key function
 */
export function on(f) {
    return function (x, y) {
        const fx = f(x);
        const fy = f(y);

        if (fx < fy) {
            return -1;
        } else if (fx > fy) {
            return 1;
        } else {
            return 0;
        }
    }
}

export function postJson(url, json) {
    return reqwest({
        url: url,
        method: 'post',
        type: 'json',
        contentType: 'application/json',
        data: JSON.stringify(json)
    });
}

export function getJson(url) {
    return reqwest({
        url: url,
        method: 'get',
        type: 'json'
    });
}

export function postNothing(url) {
    return reqwest({
        url: url,
        method: 'post'
    });
}

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
