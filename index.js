const curve = /\{([^{}]+)\}/gi;
const bucks = /\$\{([^{}]+)\}/gi;

/**
 * вставляет в строку свойства объекта
 * @param {String} template - шаблон, строка, содержащая конструкции вида "{0}" или "{name}", которые будут
 *  заменены значениями свойств объекта, переданного вторым аргументом
 * @param {(Object|Array)} variables - объект или массив, содержащий необходимые свойства
 * @returned {String} - результат подстановки
 */
const useFormat = (reg)=>(template, variables)=>{
	var result;
	//Если передан не объект - возвращаем строку как была
	if(!(variables instanceof Object)){
		result = template;
	}
	else{
		result = template.replace(
			reg,
			function(str, key){
				return (key in variables) ? variables[key] : str;
			}
		);
	}
	return result;
};

/**
 * @param {String} template - шаблон, строка, содержащая конструкции вида "{0}" или "{name}"
 * @returned {Function<{(Object|Array)}, {String}>} - функция, принимающая объект или массив, значения свойств которого будут подставлены в шаблон
 */
const compile = (reg)=>(template)=>{
	var values = {},
		code = 'return data ? "' + template.replace(
			reg,
			function(str, key){
				values[key]=true;
				return '" + ("'+key+'" in data ? data' + (isNaN(key) ? '.'+key : '['+key+']') + ' : "{'+key+'}") + "';
			}
		) + '" : "'+template+'"';
	return new Function('data', code);
};

/**
 * @param {String} template - шаблон, строка, содержащая конструкции вида "{name}", где name - имя одного из аргументов, перечисленных во втором аргументе
 * @param {Array<String>} args - имена аргуметнов
 * @returned {Function<{...any}, {String}>} - функция, принимающая несколько аргументов, значения которых будут подставлены в шаблон
 */
const compileArgs = (reg)=>(template, args)=>{
	var values = {},
		code = 'return "' + template
		.split('"').join('\\"')
		.replace(
			reg,
			function(str, key){
				values[key]=true;
				if(~args.indexOf(key)){
					return '" + (' + key + ') + "';
				}
				else{
					return str;
				}
			}
		) + '"';
	return new Function(args.join(','), code);		
};


const format = (reg)=>({
	use:useFormat(reg),
	compile:compile(reg),
	compileArgs:compileArgs(reg)
});



module.exports = format(curve);

module.exports.buck = format(bucks)