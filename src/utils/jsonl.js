export default function json2jsonl(json) {
    const arr = validateArray(json)

    let jsonl = '';
    arr.map(x => {
        jsonl += JSON.stringify(x) + '\n';
    })
    // console.log(jsonl)
   
    return jsonl;
}

function validateArray(arr) {
    if (!Array.isArray(arr)) {
        throw Error('Could not find array.')
    }
    return arr
}

