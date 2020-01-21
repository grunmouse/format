const format = require('../index.js');
const assert = require('assert');


//function prapare

describe('@grunmouse/format', ()=>{
	describe('format', ()=>{
		it('exist', ()=>{
			assert.ok(format);
		});

		const tmpobj = 'select {a} from {b} where {c}';
		const tmparr = 'select {0} from {1} where {2}';
		const dataobj = {a:'*', b:'t', c:'x=y'};
		const dataarr = ['*','t','x=y'];
		const etalon = 'select * from t where x=y';
		it('use', ()=>{
			let f1 = format.use(tmpobj, dataobj);
			assert.equal(f1, etalon);
			let f2 = format.use(tmparr, dataarr);
			assert.equal(f2, etalon);
		});
		it('compile', ()=>{
			let f1 = format.compile(tmpobj);
			assert.equal(f1(dataobj), etalon);
			let f2 = format.compile(tmparr);
			assert.equal(f2(dataarr), etalon);
		});
		it('compileArgs', ()=>{
			let f1 = format.compileArgs(tmpobj, 'a,b,c'.split(','));
			assert.equal(f1(...dataarr), etalon);
		});
	});

	describe('buck', ()=>{
		it('exist', ()=>{
			assert.ok(format.buck);
		});

		const tmpobj = 'select ${a} from ${b} where ${c}';
		const tmparr = 'select ${0} from ${1} where ${2}';
		const dataobj = {a:'*', b:'t', c:'x=y'};
		const dataarr = ['*','t','x=y'];
		const etalon = 'select * from t where x=y';
		it('use', ()=>{
			let f1 = format.buck.use(tmpobj, dataobj);
			assert.equal(f1, etalon);
			let f2 = format.buck.use(tmparr, dataarr);
			assert.equal(f2, etalon);
		});
		it('compile', ()=>{
			let f1 = format.buck.compile(tmpobj);
			assert.equal(f1(dataobj), etalon);
			let f2 = format.buck.compile(tmparr);
			assert.equal(f2(dataarr), etalon);
		});
		it('compileArgs', ()=>{
			let f1 = format.buck.compileArgs(tmpobj, 'a,b,c'.split(','));
			assert.equal(f1(...dataarr), etalon);
		});
	});
});