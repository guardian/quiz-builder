import reqwest from 'reqwest';

export function saveResults(results) {
    return reqwest({
        url: 'http://beacon.guim.co.uk/quiz/update',
        contentType: 'application/json',
        method: 'post',
        data: JSON.stringify(results)
    });
}

export function getResults(path) {
    return reqwest({
        method: 'get',
        url: `http://beacon.guim.co.uk/quiz/results/${path}`
    });
}
