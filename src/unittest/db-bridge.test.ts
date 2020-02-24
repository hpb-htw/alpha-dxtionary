import {getBinariesPath, DbBridge} from "../db-bridge";
import * as assert from "assert";

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
        let result = await bridge.queryText("Rosa");
        console.log(result);
    });
});

