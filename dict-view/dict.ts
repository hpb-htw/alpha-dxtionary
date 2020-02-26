import {WikiLang}  from "de-wiktionary-parser";

/** impportant to get CSS work */
import "./dict.css";


window.addEventListener("DOMContentLoaded", initPage);

function initPage() {    
    
    console.log('init file');
    try{
        window.addEventListener('message', showEntry);
        let btn = document.getElementById('search')!;
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
type postMesageData = {
    match: WikiLang.WikiEntry [],
    word: string
};
function showEntry(message:{isTrusted:boolean, data:string|postMesageData}) {    
    let data = message.data;    
    try {
        if (typeof data === 'string') {
            showLoading();
        } else {
            document.getElementById('main-title')!.innerHTML = `Suchergebnis von „${data.word}“`;
            showMatchedPage(data);
        }
    }catch(ex) {
        // 
    }
}

function showLoading() {
    console.log("show Loading ...");
}

function showMatchedPage(messageData:postMesageData) {
    let wikiEntries:WikiLang.WikiEntry [] = messageData.match;
    let wikiEntry = wikiEntries[0];    // wiki text => h2
    /* One wiki text contain one or more pages. */
    let firstPage:WikiLang.WikiPage = wikiEntry[0]; // page => h3
    let cached = rendernWikiPage(firstPage);    
    document.getElementById("search-result")!.innerHTML = cached;
    let lexSimilarity = rendernSimilarity(wikiEntries);
    document.getElementById('lexical-similarity')!.innerHTML = lexSimilarity;
}

function rendernWikiPage(wikiPage:WikiLang.WikiPage) {
    //let title = `<h3>h3: ${wikiPage.title.lemma}</h3>`;
    let title = ''; // only one page so there is no need for an extra title
    let cached = `${title}`; //<pre>${JSON.stringify(wikiPage['body'], null, 2)}</pre>`;
    for(let body of wikiPage.body) {
        cached += `<h4>h4:${body.lemma} ${body.partofSpeech.pos.join(',')}</h4>`;
        cached += `<pre>${JSON.stringify(body, null, 2)}</pre>`;
    }
    return cached;
}

function rendernSimilarity(match:WikiLang.WikiEntry[]) {
    let words = [];
    for(let i = 1; i < match.length; ++i) {
        let wikiText = match[i];
        words.push(wikiText[0].title.lemma);
    }
    return words.join(", ");
}

// TODO
function postMessage(event:Event) {
    console.log('Btn clicked');
    let input = document.getElementById('search-word')!;
    // @ts-ignore
    console.log(input.value);
}


