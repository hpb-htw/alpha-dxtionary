import {getBinariesPath, DbBridge} from "../db-bridge";
import * as assert from "assert";
import { WikiLang } from "wikinary-eintopf";

suite("getBinariesPath", ()=>{
    let extensionPath = "./";
    test("linux", ()=>{
        let bin = getBinariesPath(extensionPath, 'dxtionary-db');
        assert.equal(bin, 'bin/Linux-x86_64/dxtionary-db');        
    });
});

suite("DbBridge", ()=> {
    let extensionPath = "./";
    test("query a word", async () => {
        let bridge:DbBridge  = new  DbBridge(extensionPath);
        let result:WikiLang.WikiEntry[] = await bridge.queryText("Rosa");
        assert.equal(result.length, 5);
        for(let e of result) {
            for(let p of e) {
                console.log(p.title);
            }
        }
    });
});

