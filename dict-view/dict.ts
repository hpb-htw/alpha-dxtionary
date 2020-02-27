import {WikiLang}  from "wikinary-eintopf";
// @ts-ignore
import {renderjson} from "./renderjson";


let vscode:any = undefined;


/** impportant to get CSS work */
import "./dict.css";
type WikiPage = WikiLang.WikiPage;


window.addEventListener("DOMContentLoaded", initPage);

function initPage() {        
    console.log('init file');
    try{
        window.addEventListener('message', showEntry);
        let btn = document.getElementById('search')!;        
        btn.addEventListener('click', searchBtnClick);
        
        /* 
        This function can only be invoked once per session. 
        You must hang onto the instance of the VS Code API 
        returned by this method, and hand it out to any 
        other functions that wish to use it.
        */
        // @ts-ignore
        vscode = acquireVsCodeApi();
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
        unlockGui();
        if (typeof data === 'string') {
            showLoading(data);
        } else {            
            showMatchedPage(data);
        }
    }catch(ex) {
        console.error(ex);
    }
}

function showLoading(word:string) {
    try{
        document.getElementById('main-title')!.innerHTML = `Suchen „${word}“, bitte warten...`;
        lockGui();
    }catch(ex) {
        console.error(ex);
    }
}

function lockGui() {
    (<HTMLInputElement>document.getElementById('search')!).disabled = true;
    (<HTMLInputElement>document.getElementById('search-word')!).disabled = true;
}

function unlockGui() {
    (<HTMLInputElement>document.getElementById('search')!).disabled = false;
    (<HTMLInputElement>document.getElementById('search-word')!).disabled = false;
}

function showMatchedPage(messageData:postMesageData) {
    let word = messageData.word;
    document.getElementById('main-title')!.innerHTML = `Suchergebnis von „${word}“`;
    let wikiEntries:WikiLang.WikiEntry [] = messageData.match;
    let wikiEntry = wikiEntries[0];    // wiki text => h2
    /* One wiki text contain one or more pages. */
    let firstPage:WikiLang.WikiPage = wikiEntry[0]; // page => h3    
    let container = document.getElementById("search-result")!;
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    }
    let cached = renderWikiPage2(firstPage);
    container.appendChild(cached);
    let lexSimilarity = rendernSimilarity(wikiEntries);
    document.getElementById('lexical-similarity')!.innerHTML = lexSimilarity;
    document.querySelectorAll(".similar").forEach(e => e.addEventListener("click", searchLinkClick) );
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

function renderWikiPage2(wikiPage:WikiPage):DocumentFragment {
    let cached = document.createDocumentFragment();
    cached.appendChild (
        renderjson.set_show_by_default(true)
            .set_show_to_level(3)
            (wikiPage) 
    );
    console.log(cached) ;
    return cached;
}


function rendernSimilarity(match:WikiLang.WikiEntry[]) {    
    let words = [];
    for(let i = 1; i < match.length; ++i) {
        let wikiText = match[i];
        let template = `<a class="similar" href="#">${wikiText[0].title.lemma}</a>`;
        words.push(template);
    }    
    return words.join(", ");
}

function searchBtnClick(event:Event) {
    console.log('Btn clicked');
    const input:HTMLInputElement = <HTMLInputElement>document.getElementById('search-word')!;
    const word = input.value;
    console.log(word);    
   postSearchWord(word);
}   

function searchLinkClick(event:Event) {
    const word = (<HTMLElement>event.srcElement).innerHTML;
    console.log(word);
    postSearchWord(word);
}


function postSearchWord(word:string) {
    (function(){
        //@ts-ignore
        vscode.postMessage(word);
    })();
}
