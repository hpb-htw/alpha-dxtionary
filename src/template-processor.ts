export const LINK = '@link';
export const SCRIPT = '@script'; 

const TEMPLATE_REPLACE = {	
	[LINK]: '<link rel="stylesheet" type="text/css" href="dict.a69f6b45.css">', 
	[SCRIPT]: '<script src="dict.0e90a8c5.js"></script>'
};

/** 
 * create a template from a correct HTML code.
 * 
 * */
export function makeTemplate(plainHTML:string):string {
	let result = plainHTML;
	for (let [key, value] of Object.entries(TEMPLATE_REPLACE) ) {
		result = result.replace(value, key);
	}
	return result;
}


export function applyTemplate(template:string, values:any): string {
	let result = template;
	for(let [key, value] of Object.entries(values)) {
		result = result.replace(key.toString(), String(value));
	}
	return result;
}
