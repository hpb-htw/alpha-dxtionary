window.addEventListener("DOMContentLoaded", initPage);
window.addEventListener('message', showEntry);


function initPage() {
    try{
        let btn = document.getElementById('search');
        console.log(btn);
        btn.addEventListener('click', function (event){
            console.log('Btn clicked');
            let input = document.getElementById('search-word');
            console.log(input.value);
        });
    } catch(e) {
        console.error(e);
    }
}

/** 
 * expected a message with construction as follow:
 * 
 * ```
 * {
 *      lema: `...`,
 *      pages: [
 *          // each element is likely a Wikipage of the project ../../..
 *      ]
 *      
 * }
 * ```
 * 
 */
function showEntry(message) {
    for(let [k,v] of Object.entries(message)) {
        console.log(`${k} -> ${v}`);
    }
    let data = message.data;
    for(let key in data) {
        let value = data[key];
        console.log(`${key} -> ${value}`);
    }

    console.log( JSON.stringify(message.data) )

}
