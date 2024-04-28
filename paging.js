function present(table_frame, nf, page) {
    for (let i = 0; i < nf; i++) {
        if (page === table_frame[i]) {
            return true;
        }
    }
    return false;
}

function printTable(table_frame, nf) {
    let tableCells = '';
    for (let i = 0; i < nf; i++) {
        let value = table_frame[i] === -1 ? '--' : table_frame[i];
        tableCells += `<td>${value}</td>`;
    }
    return tableCells;
}

function LFUfindPos(table_frame, nf, pages, curr, np) {
    for (let i = 0; i < nf; i++) {
        if (table_frame[i] === -1) {
            return i;
        }
    }

    let pos = Array(nf).fill(-1e9);
    for (let i = 0; i < nf; i++) {
        for (let j = curr - 1; j >= 0; j--) {
            if (pages[j] === table_frame[i]) {
                pos[i] = j;
                break;
            }
        }
    }

    let min1 = 1000000, retPos = -1;
    for (let i = 0; i < nf; i++) {
        if (min1 > pos[i]) {
            min1 = pos[i];
            retPos = i;
        }
    }

    return retPos;
}

function OptimalfindPos(table_frame, nf, pages, curr, np) {
    for (let i = 0; i < nf; i++) {
        if (table_frame[i] === -1) {
            return i;
        }
    }

    let pos = Array(nf).fill(Infinity);
    for (let i = 0; i < nf; i++) {
        for (let j = curr + 1; j < np; j++) {
            if (pages[j] === table_frame[i]) {
                pos[i] = j;
                break;
            }
        }
    }

    let maxPos = -1;
    let returnPos = -1;
    for (let i = 0; i < nf; i++) {
        if (pos[i] > maxPos) {
            maxPos = pos[i];
            returnPos = i;
        }
    }

    return returnPos;
}

function FIFOPageReplacement() {
    const nf = parseInt(document.getElementById('frames').value);
    const n = parseInt(document.getElementById('requests').value);
    const references = document.getElementById('references').value.trim().split(' ').map(Number);

    let table_frame = Array(nf).fill(-1);
    let pos = 0;
    let page_faults = 0;
    let output = '';

    for (let i = 0; i < n; i++) {
        let rowOutput = '';
        if (!present(table_frame, nf, references[i])) {
            table_frame[pos] = references[i];
            pos = (pos + 1) % nf;
            page_faults++;
            rowOutput = `<tr><td>Request from ${references[i]}</td>${printTable(table_frame, nf)}<td>Page Fault</td></tr>`;
        } else {
            rowOutput = `<tr><td>Request from ${references[i]}</td>${printTable(table_frame, nf)}<td></td></tr>`;
        }
        output += rowOutput;
    }

    document.getElementById('output').innerHTML = `
    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>Request</th>
            ${Array.from({ length: nf }, (_, i) => `<th>Frame ${i + 1}</th>`).join('')}
            <th>Status</th>
        </tr>
        ${output}
    </table>
    <p>Number of page faults: ${page_faults}</p>`;
}

function LFUPageReplacement() {
    const nf = parseInt(document.getElementById('frames').value);
    const n = parseInt(document.getElementById('requests').value);
    const references = document.getElementById('references').value.trim().split(' ').map(Number);

    let table_frame = Array(nf).fill(-1);
    let pos = 0;
    let page_faults = 0;
    let output = '';

    for (let i = 0; i < n; i++) {
        let rowOutput = '';
        if (!present(table_frame, nf, references[i])) {
            pos = LFUfindPos(table_frame, nf, references, i, n);
            table_frame[pos] = references[i];
            page_faults++;
            rowOutput = `<tr><td>Request from ${references[i]}</td>${printTable(table_frame, nf)}<td>Page Fault</td></tr>`;
        } else {
            rowOutput = `<tr><td>Request from ${references[i]}</td>${printTable(table_frame, nf)}<td></td></tr>`;
        }
        output += rowOutput;
    }

    document.getElementById('output').innerHTML = `
    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>Request</th>
            ${Array.from({ length: nf }, (_, i) => `<th>Frame ${i + 1}</th>`).join('')}
            <th>Status</th>
        </tr>
        ${output}
    </table>
    <p>Number of page faults: ${page_faults}</p>`;
}

function OptimalPageReplacement() {
    const nf = parseInt(document.getElementById('frames').value);
    const n = parseInt(document.getElementById('requests').value);
    const references = document.getElementById('references').value.trim().split(' ').map(Number);

    let table_frame = Array(nf).fill(-1);
    let pos = 0;
    let page_faults = 0;
    let output = '';

    for (let i = 0; i < n; i++) {
        let rowOutput = '';
        if (!present(table_frame, nf, references[i])) {
            let newPos = OptimalfindPos(table_frame, nf, references, i, n);
            table_frame[newPos] = references[i];
            page_faults++;
            rowOutput = `<tr><td>Request from ${references[i]}</td>${printTable(table_frame, nf)}<td>Page Fault</td></tr>`;
        } else {
            rowOutput = `<tr><td>Request from ${references[i]}</td>${printTable(table_frame, nf)}<td></td></tr>`;
        }
        output += rowOutput;
    }

    document.getElementById('output').innerHTML = `
    <table border="1" cellpadding="5" cellspacing="0">
        <tr>
            <th>Request</th>
            ${Array.from({ length: nf }, (_, i) => `<th>Frame ${i + 1}</th>`).join('')}
            <th>Status</th>
        </tr>
        ${output}
    </table>
    <p>Number of page faults: ${page_faults}</p>`;
}
