
const reConst = /(?:^|\})((?:\\(?:\\|\}|\$)|[^$}]|\$(?!\$*\{))*)(?:(\$+)\{|$)/g;
const reEscape = /\\(\\|\}|\$)/g;
const reArgname = /(?:^|>)[,!;]?\s*("(?:\\"|[^"])*"|[^<]*)\s*(?:<|$)/g;

function use(format, variables){
	let parts = format.split(reConst);
	
	let result = [];
	for(let i=0; i<parts.length; i+=3){
		let equ = parts[i], text = parts[i+1];
		if(equ){
			//console.log(equ);
			let lev = parts[i-1].length;
			if(lev>1){
				let res = '$'.repeat(lev-1) + '{' + equ + '}';
				result.push(res);
			}
			else{
				let argpos = equ.indexOf('!');
				let name = ~argpos ? equ.slice(0, argpos) : equ;
				name = name.trim().replace(/^"(.+)"$/, '$1');
				
				let fmt = variables[name];
				
				if(fmt){
					if(~argpos){
						let arglist = equ.slice(argpos+1);
						let parts = arglist.split(reArgname);
						//console.log(arglist);
						let vars = {};
						for(let j=1; j<parts.length; j+=2){
							let key = parts[j], literal = parts[j+1];
							if(key){
								key = key.trim().replace(/^"(.+)"$/, '$1');
								let value = use(literal, variables);
								vars[key] = value;
							}
						}
						let res = use(fmt, {
							...variables,
							...vars
						});
						
						result.push(res);
					}
					else{
						result.push(fmt);
					}
				}
				else{
					result.push('${'+equ+'}');
				}
			}
		}
		if(text){
			let value = text.replace(reEscape, '$1');
			result.push(value);
		}
	}
	
	return result.join('');
}

module.exports = use;