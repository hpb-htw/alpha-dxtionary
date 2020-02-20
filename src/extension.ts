import * as vscode from 'vscode';

const CMD_PREFIX = "alpha.";

const LOOKUP_CMD        = `${CMD_PREFIX}dxtionary.lookup`;
const LOOKUP_CMD_UI     = `${CMD_PREFIX}dxtionary.lookup.ui`;
const LOOKUP_CMD_CURSOR = `${CMD_PREFIX}dxtionary.lookup.cursor`;
const EXTRACT_BUILT_IN_DICT = `${CMD_PREFIX}dxtionary.extract.builtin.dict`;

const normalizedArg = (word:string|undefined) => word && word.trim().length > 0 ? [word] : [""];
let webviewDictPanelReady = false;
export function activate(context: vscode.ExtensionContext) {

	console.log(`registry extension`);
	
	// every lookup can use command ${LOOKUP_CMD} to perform lookup.
	const lookupHandler = async (word: string) => {
		if(word && word.length > 0) {
			try{
				let entry = await lookup(word, context);				
				showEntry(word, entry, context);
			}catch(ex) {
				console.log(ex);//log exception
				vscode.window.showInformationMessage(`something goes wrong as lookup ${word}`);
			}
		}else {
			vscode.window.showInformationMessage(webviewDictPanelReady ? "Wörterbuch ist initialisiert": "Kein Wort zum Nachschlagen" );
		}
	};
	context.subscriptions.push(vscode.commands.registerCommand(LOOKUP_CMD, lookupHandler));
	
	// User can trigger dictionary lookup
	const lookupUIHandler = async () => {
		let word = await vscode.window.showInputBox({ placeHolder: 'type your looking word up' });
		const args = normalizedArg(word);
		vscode.commands.executeCommand(LOOKUP_CMD, ...args)
			.then(done => {
				console.log(`success lookup ${done}`);
			});
	};
	context.subscriptions.push(vscode.commands.registerCommand(LOOKUP_CMD_UI, lookupUIHandler));

	// User can trigger lookup word under cursor
	const lookupCursorHandler = async () => {
		let word = determinateWordUnderCurser();
		const args = normalizedArg(word);
		vscode.commands.executeCommand(LOOKUP_CMD, ...args)
			.then(done => {
				console.log(`lookup „${word}“ done`);
			});
	};
	context.subscriptions.push(vscode.commands.registerCommand(LOOKUP_CMD_CURSOR, lookupCursorHandler));

	// Auxiliary commands
	const extractBuiltinDicts = async() => {
		let extractMsg = `Please be patient, dxtionary will inform you when extracting is done.
		Extract dictionary to database file ....`;
		vscode.window.showInformationMessage(extractMsg);
		let dictPath = "This variable should save the path to compressed dictionary, which is deliveried with this extension";
		let dbFile = "This variable should save the path to install directory of this extension on target system and the database sqlite";
		_extractBuiltinDicts(dictPath, dbFile);
	};
	context.subscriptions.push(vscode.commands.registerCommand(EXTRACT_BUILT_IN_DICT, extractBuiltinDicts));
}


export function deactivate() {}


async function lookup(word: string, context: vscode.ExtensionContext):Promise<string>{
	return Promise.resolve(`TODO: write code to lookup ${word}`);
}


function showEntry(word: string, entry: string, context: vscode.ExtensionContext) {	
	console.log(`Entry of ${word} in wiktionary.org should be shown.`);
}


function determinateWordUnderCurser(): string|undefined {
	const { activeTextEditor } = vscode.window;

	// If there's no activeTextEditor, do nothing.
	if (!activeTextEditor) {
		return undefined;
	}

	const { document, selection } = activeTextEditor;
	const { end, start } = selection;
	
	// text too long, so do nothing
	if (!selection.isSingleLine) {
		return undefined;
	}
	let wordRange:vscode.Range|undefined;
	if (start.character === end.character){			
		wordRange = document.getWordRangeAtPosition(start);
	}else {		
		wordRange = new vscode.Range(start, end);
	}
	if(wordRange) {
		let highlight = document.getText(wordRange);		
		return highlight;
	}else {
		return undefined;
	}
}

function _extractBuiltinDicts(dictPath:string, dbFile:string){
	console.log(dictPath);
	console.log(dbFile);
}