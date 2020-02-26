import {makeTemplate} from '../template-processor';
import * as assert from "assert";
import {readFileSync} from "fs";

suite('makeTemplate', () => {
    test('makeTemplate', () => {
        let plainHTML:string = readFileSync("./resource/template.html", "utf8");
        let htmlTemplate = makeTemplate(plainHTML);        
        assert.ok(htmlTemplate.includes('@link'));
        assert.ok(htmlTemplate.includes('@script'));
        assert.ok(!htmlTemplate.includes('<link'));
        assert.ok(!htmlTemplate.includes('<script'));
    });
});