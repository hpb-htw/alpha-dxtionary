window.addEventListener("DOMContentLoaded", initPage);



function initPage() {
    try{
        window.addEventListener('message', showEntry);

        let btn = document.getElementById('search');
        console.log(btn);
        btn.addEventListener('click', postMessage);
    } catch(e) {
        console.error(e);
    }
}

/** 
 * expected a message with construction as follow:
 * 
 * ```
 * {
 *      isTrusted: true,
 *      data: {
 *          match: [
 *              [], // result of wiki page 1
 *              [], // result of wike page 2 (maxium 5)
 *              // ....
 *          ],
 *          word: "..." // to confirm that backend extension get the same word as front end requested.
 *      }
 * }
 * ```
 * 
 */
function showEntry(message) {    
    let data = message.data;
    document.getElementById('main-title').innerHTML = `Suchergebnis von „${data.word}“`;
    appendResult(data);
}

function appendResult(messageData) {
    let match = messageData.match;
    let wikiText = match[0];    // wiki text => h2
    /* One wiki text contain one or more pages. */
    let firstPage = wikiText[0] // page => h3
    let cached = rendernWikiPage(firstPage);    
    document.getElementById("search-result").innerHTML = cached;
    let lexSimilarity = rendernSimilarity(match);
    document.getElementById('lexical-similarity').innerHTML = lexSimilarity;
}

function rendernWikiPage(wikiPage) {
    //let title = `<h3>h3: ${wikiPage.title.lemma}</h3>`;
    let title = ''; // only one page so there is no need for an extra title
    let cached = `${title}`; //<pre>${JSON.stringify(wikiPage['body'], null, 2)}</pre>`;
    for(let body of wikiPage.body) {
        cached += `<h4>h4:${body.lemma} ${body.partofSpeech.pos.join(',')}</h4>`;
        cached += `<pre>${JSON.stringify(body, null, 2)}</pre>`;
    }
    return cached;
}

function rendernSimilarity(match) {
    let words = [];
    for(let i = 1; i < match.length; ++i) {
        let wikiText = match[i];
        words.push(wikiText[0].title.lemma);
    }
    return words.join(", ");
}

// TODO
function postMessage(event) {
    console.log('Btn clicked');
    let input = document.getElementById('search-word');
    console.log(input.value);
}


