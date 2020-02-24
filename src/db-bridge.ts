import { platform, arch } from 'os';
import {join} from 'path';
import { existsSync } from 'fs';

import {ENTRIES_IN_DE_WIKI} from 'wikinary-eintopf';

// TODO: make a log system that write info into VScode chanel
let logger = {
    debug: function (...what:any) {
        console.log(what);
    },

    info: function (...what:any) {
        console.log(what);
    }
};

export function getDxtionaryBinariesPath(extensionPath: string): string {
    let plat = platform();
    let os_arch = arch();
    let sqliteBin: string;

    const dxtionary = 'dxtionary-db';
    
    switch (plat) {
        case 'win32':
            sqliteBin = `Windows-AMD64/${dxtionary}.exe`;
            break;
        case 'linux':
            if (os_arch === 'x64') {
                sqliteBin = `Linux-x86_64/${dxtionary}`;
            } else {
                sqliteBin = '';
            }
            break;
        case 'darwin':
            sqliteBin = `Darwin-x86_64/${dxtionary}`;
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
            logger.debug(`binary not found: '${path}' does not exist.`);
            return '';
        }
    } else {
        return '';
    }
}


export function runDxtionaryQuery(bin:string, word:string) {
    console.log(ENTRIES_IN_DE_WIKI);
}
