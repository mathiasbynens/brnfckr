/*! https://mths.be/brnfckr v0.1.1 by @mathias */
;(function(root) {
	'use strict';

	// Detect free variables `exports`
	var freeExports = typeof exports == 'object' && exports;

	// Detect free variable `module`
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global` and use it as `root`
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal)
		root = freeGlobal;

	/*--------------------------------------------------------------------------*/

	var regexNotBF = /[^\x2B-\x2E\x3C\x3E\x5B\x5D]/g;
	// exploit arithmetic mod 256 (byte wrap-around)
	var regexUint8Wrap = /\x2B{256}|-{256}/g;
	var regexMutualCancel = /(\x2B-)|(-\x2B)|(\x3E\x3C)|(\x3C\x3E)/g;

	var minify = function(/**@type {string}*/code) {
		code = code
			.replace(regexNotBF, '')
			.replace(regexUint8Wrap, '');

		// this is O(n^2), but it's a temporary "patch"
		do {
			var len = code.length;
			code = code.replace(regexMutualCancel, '');
		} while (len != code.length)

		return code;
	};

	/*--------------------------------------------------------------------------*/

	var brnfckr = {
		'version': '0.1.1',
		'minify': minify
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	var isAMD =
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd;
	if (isAMD) {
		define(function() { return brnfckr });
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = brnfckr;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in brnfckr)
				if (brnfckr.hasOwnProperty(key))
					freeExports[key] = brnfckr[key];
		}
	} else { // in Rhino or a web browser
		root.brnfckr = brnfckr;
	}

}(this));
