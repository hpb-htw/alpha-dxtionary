import {makeTemplate} from '../template-processor';
import * as assert from "assert";


suite('makeTemplate', () => {
    test('makeTemplate', () => {
        let plainHTML = 
        `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="dict.a69f6b45.css">    
        </head>
        <body>
            <h2><span id="main-title">Suchergebnis von „\${word}“</span>
                
                <span id="search-mask"><input type="text" id="search-word" placeholder="Suche">
                <input type="button" id="search" value="Ok"></span>
            </h2>
            
            <br>
            <div id="search-result">
            \${lookupResult}
            </div>
            
            <div id="similar">
                <h4>Lexikalisch ähnliche Wörter</h4>
                (Ähnliche Wörter werden hier dargestellt)
                
                <h4>Sinnverwandte Wörter</h4>
                (Wörter im Zusammenhang mit dem gesuchten Wort)
            </div>
            <script src="dict.0e90a8c5.js"></script>
        </body>
        </html>	
        `;
        let htmlTemplate = makeTemplate(plainHTML);        
        assert.ok(htmlTemplate.includes('@link'));
        assert.ok(htmlTemplate.includes('@script'));
        assert.ok(!htmlTemplate.includes('<link'));
        assert.ok(!htmlTemplate.includes('<script'));
    });
});