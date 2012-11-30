;(function(window, undefined) {
	var freeExports = typeof exports == 'object' && exports;

	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal) {
		window = freeGlobal;
	}

	var arrayRef = [].
		objectRef = new function(){};

	var idCounter = 0;

	var indicatorObject = objectRef;

	var larg	eArraySize = 30;

	var oldDash = window._;

	var reComplexDelimiter = /[-?+=!~*%&^<>|{(\/]|\[\D|\b(?:delete|in|instanceof|new|typeof|void)\b/;

	var reEscapedHtml = /&(?:amp|lt|gt|quot|#x27);/g;

	var reEmptyStringLeading = /\b__p \+= '';/g,
		reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      	reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

	var reFlags = /\w*$/;

	var reInsertVariable = /(?:__e|__t = )\(\s*(?![\d\s"']|this\.)/g;

	var reNative = RegExp('^' +
    	   (objectRef.valueOf + '')
      	.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&')
      	.replace(/valueOf|for [^\]]+/g, '.+?') + '$'
  	);

  	var reEsTemplate = /\$\{((?:(?=\\?)\\?[\s\S])*?)}/g;

  	var reInterpolate = /<%=([\s\S]+?)%>/g;

  	var reNoMatch = /($^)/;

  	var reUnescapedHtml = /[&<>"']/g;

  	var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  	var shad	owed = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumberable', 
  					'toLocaleString', 'toString', 'valueOf'];
  	var templateCounter = 0;

  	var ceil = Math.ceil,
  		concat = arrayRef.concat,
  		floor = Math.floor,
  		getPrototypeOf = reNative.test(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
  		hasOwnProperty = objectRef.hasOwnProperty,
  		push = arrayRef.push,
  		propertyIsEnumberable = objectRef.propertyIsEnumberable,
  		slice = arrayRef.slice,
  		toString = objectRef.toString;

  	var nativeBind = reNative.test(nativeBind = slice.bind) && nativeBind,
  		nativeIsArray = reNative.test(nativeIsArray = Array.isArray) && nativeIsArray,
  		nativeIsFinite = window.isFinite,
  		nativeIsNaN = window.isNaN,
  		nativeKeys = reNative.test(nativeKeys = Object.keys) && nativeKeys,
  		nativeMax = Math.max,
  		nativeMin = Math.min,
  		nativeRandom = Math.random;

  	var argsClass = '[object Arguments]',
  		arrayClass = '[object Array]',
  		boolClass = '[object Boolean]',
  		dateClass = '[object Date]',
  		funcClass = '[object function]',
  		numberClass = '[object Number]',
  		objectClass = '[object Object]',
  		regexpClass = '[object RegExp]',
  		stringClass = '[object String]';

  	var hasDontEnumBug;
  	var iteratesOwnLast;

  	var hasObjectSpliceBug = (hasObjectSpliceBug = { '0': 1, 'length':1},
  		arrayRef.slice.call(hasObjectSpliceBug, 0, 1), hasObjectSpliceBug[0]);

  	var noArgsEnum = true;

  	(function() {
  		var props = [];
  		function ctor() { this.x = 1; }
  		ctor.prototype = { 'valueOf' : 1, 'y' : 1 };
  		for (var prop in new ctor) { props.push(prop); }
  		for (prop in arguments) { noArgsEnum = !prop; }

  		hasDontEnumBug = !/valueOf/.test(props);
  		iteratesOwnLast = props[0] != 'x';
  	}(1));

  	var noArgsClass = !isArguments(arguments);

  	var noArraySliceOnStrings = slice.call('x')[0] != 'x';

  	var noCharByIndex = ('x'[0] + Object('x')[0]) != 'xx';

  	try {
  		var noNodeClass = ({ 'toString' : 0} + '', toString.call(window.document || 0) == objectClass);
  	}catch (e) {}

  	var isBindFast = nativeBind && /\n|Opera/.test(nativeKeys + !!window.attachEvent);

  	try {
  		var useSourceURL = (Function('//@')(), !window.attachEvent);
  	}catch (e) {}

  	var cloneableClasses = {};
  	cloneableClasses[argsClass] = cloneableClasses[funcClass] = false;
  	cloneableClasses[arrayClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  	cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] =
  	cloneableClasses[stringClass] = true;

  	var objectTy	pes = {
  		'boolean' : false,
  		'function' : true,
  		'object' : true,
  		'number' : false,
  		'string' : false,
  		'undefined' : false
  	};

  	var stringEscapes = {
  		'\\' : '\\',
  		"'" : "'",
  		'\n' : 'n',
  		'\t' : 't',
  		'\r' : 'r',
  		'\u2028' : 'u2028',
  		'\u2029' : 'u2029'
  	};

  	function lodash(value) {
  		if (value && value.__wrapped__) {
  			return value;
  		}

  		if (!(this instanceof lodash)) {
  			return new lodash(value);
  		}
  		this.__wrapped__ = value;
  	}

  	lodash.templateSettings = {
  		'escape': /<%-([\s\S]+?)%>/g,
  		'evaluate': /<%([\s\S]+?)%>/g,
  		'interpolate' : reInterpolate,
  		'variable': ''
  	};

  	var iteratorTemplate = template(
  		'<% if (obj.useStrict) { %>\'use strict\';\n<% } %>' +
  		'var index, value, iteratee = <%= firstArg %>, ' +
  		'result = <%= firstArg %>;\n' +
  		'if (!<%= firstArg %>) return result;\n' +
  		'<%= top %>;\n' +

  		'<% if (arrayLoop) { %>' +
  		'var length = iteratee.length; index = -1;\n' +
  		'if (typeof length == \'number\') {' +

  		'  <% if (noCharByIndex) { %>\n' +
  		'  if (isString(iteratee)) {\n' +
  		'    iteratee = iteratee.split(\'\')\n' +
  		'  }' +
  		'  <% } %>\n' +

  		'  while (++index < length) {\n' +
  		'    value = iteratee[index];\n' +
  		'    <%= arrayLoop %>\n' +
  		'  }\n' +
  		'}\n' +
  		'else {' +

	    '  <%  } else if (noArgsEnum) { %>\n' +
	    '  var length = iteratee.length; index = -1;\n' +
	    '  if (length && isArguments(iteratee)) {\n' +
	    '    while (++index < length) {\n' +
	    '      value = iteratee[index += \'\'];\n' +
	    '      <%= objectLoop %>\n' +
	    '    }\n' +
	    '  } else {' +
	    '  <% } %>' +

	    '  <% if (!hasDontEnumBug) { %>\n' +
	    '  var skipProto = typeof iteratee == \'function\' && \n' +
	    '    propertyIsEnumerable.call(iteratee, \'prototype\');\n' +
	    '  <% } %>' +

	    '  <% if (isKeysFast && useHas) { %>\n' +
	    '  var ownIndex = -1,\n' +
	    '      ownProps = objectTypes[typeof iteratee] ? nativeKeys(iteratee) : [],\n' +
	    '      length = ownProps.length;\n\n' +
	    '  while (++ownIndex < length) {\n' +
	    '    index = ownProps[ownIndex];\n' +
	    '    <% if (!hasDontEnumBug) { %>if (!(skipProto && index == \'prototype\')) {\n  <% } %>' +
	    '    value = iteratee[index];\n' +
	    '    <%= objectLoop %>\n' +
	    '    <% if (!hasDontEnumBug) { %>}\n<% } %>' +
	    '  }' +

	    '  <% } else { %>\n' +
	    '  for (index in iteratee) {<%' +
	    '    if (!hasDontEnumBug || useHas) { %>\n    if (<%' +
	    	'      if (!hasDontEnumBug) { %>!(skipProto && index == \'prototype\')<% }' +
	    	'      if (!hasDontEnumBug && useHas) { %> && <% }' +
	    	'      if (useHas) { %>hasOwnProperty.call(iteratee, index)<% }' +
	    	'    %>) {' +
		'    <% } %>\n' +
		'    value = iteratee[index];\n' +
		'    <%= objectLoop %>;' +
		'    <% if (!hasDontEnumBug || useHas) { %>\n    }<% } %>\n' +
		'  }' +
		'  <% } %>' +

	    '  <% if (hasDontEnumBug) { %>\n\n' +
	    '  var ctor = iteratee.constructor;\n' +
	    '    <% for (var k = 0; k < 7; k++) { %>\n' +
	    '  index = \'<%= shadowed[k] %>\';\n' +
	    '  if (<%' +
	    	'      if (shadowed[k] == \'constructor\') {' +
	    	'        %>!(ctor && ctor.prototype === iteratee) && <%' +
	    	'      } %>hasOwnProperty.call(iteratee, index)) {\n' +
		'    value = iteratee[index];\n' +
		'    <%= objectLoop %>\n' +
		'  }' +
		'    <% } %>' +
		'  <% } %>' +
		'  <% if (arrayLoop || noArgsEnum) { %>\n}<% } %>\n' +
	   	'<%= bottom %>;\n' +
		'return result'
    );

	var assignIteratorOptions = {
		'args' : 'object, source, guard',
		'top' :
			'for (var argsIndex = 1, argsLength = typeof guard == \'number\' ? 2 : arguments.length; argsIndex < argsLength; argsIndex++) {\n' +
			'	if ((iteratee = arguments[argsIndex])) {',
		'objectLoop' : 'result[index] = value',
		'bottom' : '   }\n}'
	};

	var forEachIteratorOptions = {
		'args' : 'collection, callback, thisArg',
		'top' : 'callback = createCallback(callback, thisArg)',
		'arrayLoop' : 'if (callback(value, index, collection) === false) return result',
		'objectLoop' : 'if (callback(value, index, collection) === false) return result'
	};

	var forOwnIteratorOptions = {
		'arrayLoop' : null
	};

	function catchedContains(array, fromIndex, largeSize) {
		fromIndex || (fromIndex = 0);

		var length = array.length,
			isLarge = (length - fromIndex) >= (largeSize || largeArraySize);

		if (isLarge) {
			var cache = {},
				index = fromIndex - 1;

			while(++index < length) {
				var key = array[index] + '';
				(hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = [])).push(array[index]);
			}
		}
		return function(value) {
			if (isLarge) {
				var key = value + '';
				return hasOwnProperty.call(cache, key) && indexOf(cache[key], value) > -1;
			}
			return indexOf(array, value, fromIndex) > -1;
		}
	}

	function charAtCallback(value) {
		return value.charCodeAt(0);
	}

	function compareAscending(a, b) {
		var ai = a.index,
			bi = b.index;

		a = a.criteria;
		b = b.criteria;

		if (a !== b) {
			if (a > b || a === undefined) {
				return 1;
			}

			if (a < b || b === undefined) {
				return -1;
			}
		}
		return ai < bi ? -1 : 1;
	}

	function createBound(func, thisArg, partialArgs) {
		var isFunc = isFunction(func),
			isPartial = !partialArgs,
			key = thisArg;

		if (isPartial) {
			partialArgs = thisArg;
		}

		if (!isFunc) {
			thisArg = func;
		}

		function bound () {
			var args = arguments,
				thisBinding = isPartial ? this : thisArg;

			if (!isFunc) {
				func = thisArg[key];
			}

			if (partialArgs.length) {
				args = args.length
					? partialArgs.concat(slice.call(args))
					: partialArgs;
			}

			if (this instanceof	bound) {
				noop.prototype = func.prototype;
				thisBinding = new noop;

				var result = func.apply(thisBinding, args);
				return isObject(result) ? result : thisBinding
			}
			return func.apply(thisBinding, args);
		}
		return bound;
	}

	function createCallback(func, thisArg) {
		if (!func) {
			return identity;
		}

		if (typeof func != 'function') {
			return function(object) {
				return object[func];
			};
		}

		if (thisArg !== undefined) {
			return function(value, index, object) {
				return func.call(thisArg, value, index, object);
			};
		}
		return func;
	}

	function createIterator() {
		var data = {
			'arrayLoop' : '',
			'bottom':'',
			'hasDontEnumBug':hasDontEnumBug,
			'isKeysFast':isArray

		}
	}

  })