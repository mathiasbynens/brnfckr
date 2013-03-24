(function(root) {

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global` and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	var regexNotBrainfuck = /[^\+\-<>\[\],\.]/g;

	var minify = function(code) {
		return code.replace(regexNotBrainfuck, '');
	};

	/*--------------------------------------------------------------------------*/

	var brnfckr = {
		'version': '0.1.0',
		'minify': minify
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define(function() {
			return brnfckr;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = brnfckr;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in brnfckr) {
				brnfckr.hasOwnProperty(key) && (freeExports[key] = brnfckr[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.brnfckr = brnfckr;
	}

}(this));
