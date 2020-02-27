import { platform, arch } from 'os';
import {join} from 'path';
import { existsSync } from 'fs';

import {ENTRIES_IN_DE_WIKI, 
    WikiDictionary, 
    EntryFormatter,
    Entry} from 'wikinary-eintopf';
import { WikiLang } from 'wikinary-eintopf';

// TODO: make a log system that write info into VScode chanel
let logger = {
    debug: function (...what:any) {
        console.log(what);
    },

    info: function (...what:any) {
        console.log(what);
    }
};



export function getBinariesPath(extensionPath: string, binName:string): string {
    let plat = platform();
    let os_arch = arch();
    let sqliteBin: string;
    
    switch (plat) {
        case 'win32':
            sqliteBin = `Windows-AMD64/${binName}.exe`;
            break;
        case 'linux':
            if (os_arch === 'x64') {
                sqliteBin = `Linux-x86_64/${binName}`;
            } else {
                sqliteBin = '';
            }
            break;
        case 'darwin':
            sqliteBin = `Darwin-x86_64/${binName}`;
            break;
        default:
            logger.info(`Fallback binary not found: system OS not recognized.`);
            sqliteBin = '';
            break;
    }
    if (sqliteBin) {
        let path = join(extensionPath, 'bin', sqliteBin);
        if ( existsSync(path)) {
            logger.debug(`binary found: '${path}'.`);
            return path;
        } else {
            throw new Error(`Binary not found: '${path}' does not exist.`);            
        }
    } else {
        throw new Error(`No support for platform ${plat} and architecture ${arch}`);
    }
}

class WebviewFormater implements EntryFormatter<WikiLang.WikiEntry[]> {

    data:WikiLang.WikiEntry[] = [];
    count:number = 0;

    accumulate(e: Entry): void {     
        this.data.push (JSON.parse(e.text));
    }   

    serialize():WikiLang.WikiEntry[] {
        return this.data;
    }
}

export class DbBridge {
    
    private static readonly DXTIONARY_BIN = "dxtionary-db";
    private static readonly SQLITE_DB = "dict.sqlite";

    private dict: WikiDictionary;

    constructor(extensionPath:string) {
        let executableBin = getBinariesPath(extensionPath, DbBridge.DXTIONARY_BIN);
        let dbPath = join(extensionPath, "data", DbBridge.SQLITE_DB);
        console.log({executableBin, dbPath});
        this.dict = new WikiDictionary(executableBin, dbPath);        
    }

    async queryText(word:string): Promise<WikiLang.WikiEntry[]> {
        return this.dict.typedQuery(word, new WebviewFormater());
    }

}
