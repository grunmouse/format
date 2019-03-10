module.exports = {
	/**
	 * вставляет в строку свойства объекта
	 * @param {String} template - шаблон, строка, содержащая конструкции вида "{0}" или "{name}", которые будут
	 *  заменены значениями свойств объекта, переданного вторым аргументом
	 * @param {(Object|Array)} variables - объект или массив, содержащий необходимые свойства
	 * @returned {String} - результат подстановки
	 */
	format:function(template, variables){
		var result;
		//Если передан не объект - возвращаем строку как была
		if(!(variables instanceof Object)){
			result = template;
		}
		else{
			result = template.replace(
				/\{([^{}]+)\}/gi,
				function(str, key){
					return (key in variables) ? variables[key] : str;
				}
			);
		}
		return result;
	},

	/**
	 * @param {String} template - шаблон, строка, содержащая конструкции вида "{0}" или "{name}"
	 * @returned {Function<{(Object|Array)}, {String}>} - функция, принимающая объект или массив, значения свойств которого будут подставлены в шаблон
	 */
	compileFormat : function(template){
		var values = {},
			code = 'return data ? "' + template.replace(
				/\{([^{}]+)\}/gi,
				function(str, key){
					values[key]=true;
					return '" + ("'+key+'" in data ? data' + (isNaN(key) ? '.'+key : '['+key+']') + ' : "{'+key+'}") + "';
				}
			) + '" : "'+template+'"';
		return new Function('data', code);
	},
	
	/**
	 * @param {String} template - шаблон, строка, содержащая конструкции вида "{name}", где name - имя одного из аргументов, перечисленных во втором аргументе
	 * @param {String} args - имена аргуметнов через запятую
	 * @returned {Function<{...any}, {String}>} - функция, принимающая несколько аргументов, значения которых будут подставлены в шаблон
	 */
	compileFormatWithArgs : function(template, args){
		var values = {},
			code = 'return "' + template
			.split('"').join('\\"')
			.replace(
				/\{([^{}]+)\}/gi,
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
	}
};