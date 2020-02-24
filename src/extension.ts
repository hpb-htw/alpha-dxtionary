import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { makeTemplate, applyTemplate, LINK, SCRIPT } from './template-processor';
import { DbBridge } from './db-bridge';



const CMD_PREFIX = "alpha.";

const LOOKUP_CMD        = `${CMD_PREFIX}dxtionary.lookup`;
const LOOKUP_CMD_UI     = `${CMD_PREFIX}dxtionary.lookup.ui`;
const LOOKUP_CMD_CURSOR = `${CMD_PREFIX}dxtionary.lookup.cursor`;
const EXTRACT_BUILT_IN_DICT = `${CMD_PREFIX}dxtionary.extract.builtin.dict`;



/** where to save static css and js files for Extension's Webview */
const RESOURCE_PATH = "resource";

const normalizedArg = (word:string|undefined) => word && word.trim().length > 0 ? [word] : [""];

export function activate(context: vscode.ExtensionContext) {

	console.log(`registry extension`);
	const bridge = new DbBridge(context.extensionPath);

	// every lookup can use command ${LOOKUP_CMD} to perform lookup.
	const lookupHandler = async (word: string) => {
		if(word && word.length > 0) {
			try{
				let entries = await bridge.queryText(word);
				DictView.showEntry(word, {match:entries, word:word}, context);
			}catch(ex) {
				console.log(ex);//log exception
				vscode.window.showInformationMessage(`something goes wrong as lookup ${word}`);
			}
		}else {
			vscode.window.showInformationMessage("Kein Wort zum Nachschlagen" );
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


class DictView {

	public static readonly viewType = "DictView";

	/** These resources depend on _output_ of sub-project dict-view */
	private static readonly templateName = "template.html";
	private static readonly jsName = 'dict.0e90a8c5.js';
	private static readonly cssName = 'dict.a69f6b45.css';

	/** there should be only one instance of this class at a time */
	private static instance : DictView|undefined;

	private static cachedHTMLTemplate:string|undefined;

	private dictionaryPanel: vscode.WebviewPanel;
	private extensionPath:string ;
	private htmlTemplate:string;

	public static showEntry(word:string, entry:any, context: vscode.ExtensionContext) {
		if (!DictView.instance) {
			let dictionaryPanel = DictView.makeNewPanel(context) ;
			DictView.instance = new DictView(dictionaryPanel, context.extensionPath);
		}
		DictView.instance.showLookupWord(word, entry);
	}


	private constructor(dictionaryPanel: vscode.WebviewPanel , extensionPath:string) {
		// Init html template
		this.extensionPath = extensionPath;
		this.htmlTemplate = DictView.getTemplate(extensionPath);

		this.dictionaryPanel = dictionaryPanel;
		this.updateHTML();
	}

	private showLookupWord(word:string, entry:any) {
		try{
			this.dictionaryPanel.reveal(vscode.ViewColumn.Beside, true);
			this.dictionaryPanel.webview.postMessage( entry );
		}catch(e) { // anything can happen :(
			console.log(e);
		}
		//TODO
		console.dir(`TODO: show ${word} with result ${entry}`);
	}

	private updateHTML() {		
		let cssUri = this.buildResourceUri(DictView.cssName);
		let cssTag = `<link rel="stylesheet" type="text/css" href="${cssUri}"></link>`;			
		let jsUri = this.buildResourceUri(DictView.jsName);
		let jsTag = `<script src="${jsUri}"></script>`;
		let html = applyTemplate(this.htmlTemplate, {[LINK]: cssTag, [SCRIPT]:jsTag});
		this.dictionaryPanel.webview.html = html;
	}

	private buildResourceUri(resoureFileName:string) : vscode.Uri {
		const webview = this.dictionaryPanel.webview;
		let resourcePath = vscode.Uri.file(
			path.join(this.extensionPath, RESOURCE_PATH, resoureFileName)
		);
		return webview.asWebviewUri(resourcePath);
	}


	private static makeNewPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
		let dictionaryPanel =  vscode.window.createWebviewPanel(
			LOOKUP_CMD,
			DictView.viewType,
			vscode.ViewColumn.Beside,
			{
				// allow all script 
				enableScripts: true,
				// restrict to only load content from resource (not at dev time)
				//localResourceRoots: [vscode.Uri.file(path.join(extensionPath, RESOURCE_PATH) )]
			}
		);
		// free all resources
		dictionaryPanel.onDidDispose(
			() => {
				DictView.instance = undefined; // see showEntry
				dictionaryPanel.dispose();
			},
			null,
			context.subscriptions
		);

		// install handler for Post Message from the webview
		dictionaryPanel.webview.onDidReceiveMessage(message => {
			console.log(`TODO: show received data ${message}`);			
		});
		return dictionaryPanel;
	}

	private static getTemplate(extensionPath:string):string {
		if(! DictView.cachedHTMLTemplate) { // not cached, so read it from fs, else nothing to do
			let htmlPath = path.join(extensionPath, RESOURCE_PATH, DictView.templateName);
			let plainHtml = fs.readFileSync(htmlPath, 'utf8');
			DictView.cachedHTMLTemplate = makeTemplate(plainHtml);
		}
		return DictView.cachedHTMLTemplate;
	}

	

}








/** STATUS: TODO */
async function lookup(word: string, context: vscode.ExtensionContext):Promise<string>{
	return Promise.resolve(`<pre>TODO: write code to lookup „${word}“</pre>`);
}



/**
 * STATUS: Done! This functions works well
 */
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

/**
 * STATUS: in TODO List
*/
function _extractBuiltinDicts(dictPath:string, dbFile:string){
	console.log(dictPath);
	console.log(dbFile);
}