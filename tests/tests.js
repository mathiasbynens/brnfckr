;(function(root) {
	'use strict';

	/** Use a single "load" function */
	var load = typeof require == 'function' ? require : root.load;

	/** The unit testing framework */
	var QUnit = (function() {
		var noop = Function.prototype;
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			(load('../node_modules/qunit-clib/qunit-clib.js') || { 'runInContext': noop }).runInContext(root),
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	/** The `brnfckr` function to test */
	var brnfckr = root.brnfckr || (root.brnfckr = (
		brnfckr = load('../brnfckr.js') || root.brnfckr,
		brnfckr = brnfckr.brnfckr || brnfckr
	));
	var minify = brnfckr.minify;

	/*--------------------------------------------------------------------------*/

	var data = {

		// Miscellaneous
		'Miscellaneous': [
			{
				'description': 'Empty input',
				'original': '',
				'minified': ''
			},
			{
				'description': 'Hello world',
				'original': '+++++ +++++             initialize counter (cell #0) to 10\n[                       use loop to set the next four cells to 70/100/30/10\n    > +++++ ++              add  7 to cell #1\n    > +++++ +++++           add 10 to cell #2 \n    > +++                   add  3 to cell #3\n    > +                     add  1 to cell #4\n    <<<< -                  decrement counter (cell #0)\n]                   \n> ++ .                  print \'H\'\n> + .                   print \'e\'\n+++++ ++ .              print \'l\'\n.                       print \'l\'\n+++ .                   print \'o\'\n> ++ .                  print \' \'\n<< +++++ +++++ +++++ .  print \'W\'\n> .                     print \'o\'\n+++ .                   print \'r\'\n----- - .               print \'l\'\n----- --- .             print \'d\'\n> + .                   print \'!\'\n> .                     print \'\\n\'',
				'minified': '++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.'
			},
			{ // http://codegolf.stackexchange.com/a/4815/4035
				'description': 'brainfuck minifier in brainfuck',
				'original': '>>>,\n[\n[->+>+<<]             copy input\n\n<<<+++++++++++++      fill cell with 13 for subtraction\n[->+>+>+<<<]          and duplicate some times\n\n>>>[->---<]           sub 39\n>----                 43\n\n[                     plus\n-\n[                     comma\n-\n[                     minus\n-\n[                     dot\n\n<<[->>-<<]>>-         60\n\n[                     less than\n--\n[                     greater than\n\n<<<[->>>--<<<]>>>     86\n---                   91\n\n[                     open square bracket\n--\n[                     closing square bracket\n\n>[-]                  remove copy\n\n]]]]]]]]\n\n>[.[-]>]              the copy has not been removed; print\n\n<<[-]<<<[-]>[-]>      clean up\n\n,]',
				'minified': '>>>,[[->+>+<<]<<<+++++++++++++[->+>+>+<<<]>>>[->---<]>----[-[-[-[<<[->>-<<]>>-[--[<<<[->>>--<<<]>>>---[--[>[-]]]]]]]]]>[.[-]>]<<[-]<<<[-]>[-]>,]'
			}
		],

		// Error handling
		'Error handling': [
			{
				'description': 'Passing a non-string to `minify()`',
				'original': {},
				'error': TypeError
			}

		]
	};

	function forEach(array, fn) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			fn(array[index]);
		}
	}

	function forOwn(object, fn) {
		var key;
		for (key in object) {
			if (object.hasOwnProperty(key)) {
				fn(object[key], key);
			}
		}
	}

	// explicitly call `QUnit.module()` instead of `module()`
	// in case we are in a CLI environment

	// `throws` is a reserved word in ES3; alias it to avoid errors
	var raises = QUnit.assert['throws'];

	QUnit.module('brnfckr');
	forOwn(data, function(items, groupName) {
		test(groupName, function() {
			if (groupName == 'Error handling') {
				forEach(items, function(item) {
					raises(
						function() {
							minify(item.original);
						},
						item.error,
						item.description
					);
				});
			} else {
				forEach(items, function(item) {
					equal(
						minify(item.original),
						item.minified,
						item.description
					);
				});
			}
		});
	});



	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}
}(typeof global == 'object' && global || this));
