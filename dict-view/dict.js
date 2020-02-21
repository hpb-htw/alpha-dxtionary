window.addEventListener("DOMContentLoaded", initPage);

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


