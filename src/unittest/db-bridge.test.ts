import {getDxtionaryBinariesPath, runDxtionaryQuery} from "../db-bridge";
import * as assert from "assert";

suite("getDxtionaryBinariesPath", ()=>{
    let extensionPath = "./";
    test("linux", ()=>{
        let bin = getDxtionaryBinariesPath(extensionPath);
        assert.equal(bin, 'bin/Linux-x86_64/dxtionary-db');
        runDxtionaryQuery(bin, 'test');
    });
});