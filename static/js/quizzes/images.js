import map from 'lodash-node/modern/collection/map';

function idFromSrc(src) {
    const id = src.replace(/^.*\/\/media.guim.co.uk\//, '');
    return (id === src) ? null : id;
}

function resizerUrl(id, width) {
    return `http://i.guim.co.uk/media/w-${width}/h--/q-95/${id}`
}

export function genSrcset(src) {
    const widths = [320, 460, 620];
    const srcId = idFromSrc(src);
    return map(
        widths,
        (width) => `${resizerUrl(srcId, width)} ${width}w`
    ).join(', ');
}

export function genSrc620(src) {
    return genSrc(src, 620);
}

export function genSrc(src, width) {
    const id = idFromSrc(src);

    if (id) {
        return resizerUrl(id, width);
    } else {
        return src;
    }
}