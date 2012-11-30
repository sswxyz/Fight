(function () {
    var root = this;
    var previousUnderscore = root._;
    var breaker = {};
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        unshift = ArrayProto.unshift,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var nativeForEach = ArrayProto.forEach,
        nativeMap = ArrayProto.map,
        nativeReduce = ArrayProto.reduce,
        nativeReduceRight = ArrayProto.reduceRight,
        nativeFilter = ArrayProto.filter,
        nativeEvery = ArrayProto.every,
        nativeSome = ArrayProto.some,
        nativeIndexOf = ArrayProto.indexOf,
        nativeLastIndexOf = ArrayProto.lastIndexOf,
        nativeIsArray = ArrayProto.isArray,
        nativeKeys = ObjProto.keys,
        nativeBind = FuncProto.bind;

    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports;
        }
        exports._ = _;
    } else {
        root["_"] = _;  // ???root._ = _
    }

    _.VERSION = 'MUHAHAH';

    var each = _.each = _.forEach = function (obj, iterator, context) {
        if (obj == null) return; //???===
        if (nativeForEach && obj.forEach === nativeForEach ) {
            obj.forEach(iterator, context);  
        }else if (obj.length === +obj.length ) {
            for (var i = 0, l = obj.length; i < l; i++ ) {
                if (iterator.call (context, obj[i], i, obj) === breaker) return;
            }
        } else {
            for (var key in obj) {
                if (_.has(obj, key)){
                    if (iterator.call(context, obj[key], key, obj) === breaker ) return;
                }
            }
        };
    };

    var map = _.map = _.collect = function (obj, iterator, context) {
        var results = [];
        if (obj == null)return results;

        if (nativeMap && obj.map === nativeMap) {
            return obj.map(iterator, context);
        }
        each(obj, function (value, index, list) {
            results[results.length] = iterator.call(context, value, index, list);
        });
        return results;
    };

    var reduce = _.reduce = _.inject = _.foldl = function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduce && nativeReduce === obj.reduce) {
            if (context) iterator = _.bind (iterator, context);
            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
        }
        each(obj, function (value, index, list) {
            if (!initial) {
                memo = value;
                initial = true;
            } else {
                memo = iterator.call(context, memo, value,index, list);
            }
        });
        if (!initial) throw new TypeError('Reduce of empty array with no initial value');
        return memo;
    };

    var reduceRight = _.reduceRight = _.foldr = function (obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduceRight && nativeReduceRight === obj.reduceRight) {
            if (context) iterator = _.bind (iterator, context);
            return initial ? obj.reduceRight (iterator, memo) : obj.reduceRight(iterator);
        }
        var length = obj.length;
        if (length !== +length) {
            var keys = _.keys(obj);
            length = keys.length;
        }
        each(obj, function (value, index, list) {
            index = keys ? keys[--length] : --length;
            if (!initial) {
                memo = obj[index];
                initial = true;
            } else {
                memo = iterator.call(context, memo, obj[index], index, list);
            }
        });
        if (!initial) throw new TypeError('Reduce of empty array with no initial value');
        return memo;
    };

    var find = _.find = _.detect = function (obj, iterator, context) {
        var result;
        any(obj, function (value, index, list) {
            if (iterator.call(context, value, index, list)) {
                result = value;
                return true;
            };
        });
        return result;
    };

    var filter = _.filter = _.select = function (obj, iterator, context) {
        var results=[];
        if (obj == null) return results;
        if (nativeFilter && nativeFilter == obj.filter) {
            return obj.filter(iterator, context);
        }
        each(obj, function (value, index, list) {
            if (iterator.call(context, value, index, list)){
                results[results.length] = value;
            }
        });
        return results;
    };

    var where = _.where = function (obj, properties) {
        var results = [];
        //FIXME
        return results;
    };

    var reject = _.reject = function (obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        each(obj, function (value, index, list) {
            if (!iterator.call(context, value, index, list)) {
                results[results.length] = value;
            } 
        });
        return results;
    };

    _.all =_.every = function (obj, iterator, context) {
        var result = true;
        if (obj == null) return result;
        if (nativeEvery && nativeEvery === obj.every) {
            return obj.every(iterator, context);
        }
        each(obj, function (value, index, list) {
            if (!(result = result && iterator.call(context, value, index, list))) {
                return breaker;
            }
        });
        return !!result;
    };

    var any = _.some = _.any = function (obj, iterator, context) {
        var result = false;
        if (obj == null) return result;
        if (nativeSome && nativeSome === obj.some) {
            return obj.some(iterator, context);
        }
        each(obj, function(value ,index, list) {
            if (result || result = iterator.call(context, value, index, list)) {
                return breaker;
            }
        });
        return result;
    };

    _.contains = _.include = function (obj, target) {
        var result = false;
        if (obj == null) return result;
        if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
            return obj.indexOf(target) !== -1;
        }
        result = any(obj, function (value) {
            return value === target;
        });
        return result;
    }

    _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2);
        return _.map(obj, function (value) {
            return (_.isFunction(method) ? method : value[method]).apply(value, args);
        });
    };

    _.pluck = function (obj, key) {
        return _.map(obj, function (value) {
            return value[key];
        });
    };

    _.max = function (obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.max.apply(Math, obj);        
        }//hack!!
        if (!iterator && _.isEmpty(obj)) {
            return -Infinity;
        }
        var result = {computed : -Infinity};
        each(obj, function (value, index, list) {
            var computed = iterator ? iterator.call(context, value, index,list) : value;
            computed >= result.computed && (result = {computed : computed, value : value});
        });
        return result.value;
    };

    _.min = function (obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.min.apply(Math, obj);        
        }//hack!!
        if (!iterator && _.isEmpty(obj)) {
            return Infinity;
        }
        var result = {computed : Infinity};
        each(obj, function (value, index, list) {
            var computed = iterator ? iterator.call(context, value, index,list) : value;
            computed <= result.computed && (result = {computed : computed, value : value});
        });
        return result.value;
    };

    _.sortBy = function (obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        _.pluck(_.map(obj,function (value, index, list) {
                return {
                    value : value,
                    index : index,
                    criteria: iterator.call(context, value, index, list)
                };
            }).sort(function (left, right){return left.criteria - right.criteria;}),'value');
    };

    var lookupIterator = function (value) {
        return _.isFunction(value) ? value : function (obj) { return obj[value]; };
    };

    var group = function (obj, value, context, behavior) {
        var results = {};
        var iterator = lookupIterator(value);
        each(obj, function(value, index) {
            var key = iterator.call(context, value, index, obj);
            behavior(results, key, value);
        });
    };

    _.groupBy = function (obj, iterator) {
        //var results = {};
        //each(obj, function (value, index, list) {
        //    var tmp = iterator.call(this, value, index, list);
        //    if (typeof results[tmp] === "undefined") results[tmp] =[];
        //    results[tmp].push(value);
        //});
        //return results;
        return group(obj, value, context, function () {
            (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
        });
    };

    _.countBy = function (obj, iterator) {
        return group(obj, value, context, function () {
            _.has(result,key) ? result[key]++ : (result[key] = 1);
        })
    };

    _.shuffle = function (obj) {
        //FIXME 
    };

    _.toArray = function (obj) {
        if (!obj) return [];
        if (obj.length === +obj.length) return slice.call(obj);
        return _.values(obj);
    };

    _.size = function(obj) {
        return (obj.length === +obj.length) ? obj.length : _.keys[obj].length;
    };

    _.first = _.head = _.take =function (array, n, guard) {
        return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
    };

    _.initial = function (array, n, guard) {
        return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
    };

    _.last = function (array, n, guard) {
        return slice.call(array, array.length - ((n == null) || guard ? 1 : n));
    };

    _.rest = _.tail = _.drop = function (array, n, guard) {
        return slice.call(array, array.length )
    };

    _.compact = function (array) {
        //var new_arr = [];
        //each(array, function (value) {
        //    value && new_arr.push(value);
        //})
        //return new_arr;
        return _.filter(array, function(value) {
            return !!value;
        })
    };

    var flatten = function (array, shallow, output) {
        each(array, function(value) {
            if (_.isArray(value)) {
                shallow ? output.push(value) : flatten(value, shallow, output);
            }else {
                output.push(value);
            }
        });
        return output;
    };

    _.flatten = function (array, shallow) {
        return flatten(array, shallow, []);
    };

    _.without = function (array) {
        return _.difference(array, slice.call(arguments, 1));
    };

    _.uniq = _.unique = function (array, isSorted, iterator, context) {
        var initial = iterator ? _.map(array, iterator, context) : array;
        var seen = [];
        var results = [];//instesting~~
        each(array, function (value, index) {
            if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)){
                seen.push(value);
                results.push(array[index]);
            }
        });
        return results;
    };

    _.union = function() {
        //FIXME
        return _.uniq(concat.apply(ArrayProto, arguments));
    };

    _.intersection = function (array) {
        //FIXME
        var rest = slice.call(arguments, 1);
        return _.filter(_.uniq(array), function (item) {
            return _.every(rest, function (other) {
                return _.indexOf(other, item) >= 0;
            })
        });
    }

    _.difference = function (array) {
        var rest = _.concat.apply(ArrayProto, slice.call(arguments, 1));
        return _.filter(array, function (value) {
            return !_.contains(rest, value);
        });
    };

    _.zip = function () {
        var args = slice.call(arguments);
        var length = _.max(_.pluck(args,'length'));
        var results = new Array(length);
        for (var i = 0; i < length; i++) {
            results[i] = _.pluck(args, ""  +  i);
        }
        return results;
    };

    _.object = function (list, values) {
        var results = {};
        for (var i = 0; i < list.length; i++) {
            if (values) {
                results[list[i]] = values[i];
            }else {
                results[list[i][0]] = list[i][1];
            }
        }
    };

    _.indexOf = function (array, item, isSorted) {
        if (array == null) return -1;
        var i, l = array.length;
        if (isSorted) {
            if (typeof isSorted == 'number') {
                i = (isSorted < 0 ? Math.max(0, l+isSorted) : isSorted);
            } else {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
        }
        if (nativeIndexOf && nativeIndexOf === array.indexOf) return array.indexOf(item, isSorted);
        for (; i < l; i++) if (array[i] === item) return i;
        return -1;
    };

    _.lastIndexOf = function (array, item, from) {
        if (array == null) return -1;
        var hasIndex = from !=null;
        if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
            return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
        }
        var i = (hasIndex ? from: array.length);
        while(i--) if (array[i] === item) return i;
        return -1;
    };

    _.range = function (start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = arguments[2] || 1;

        var len = Math.max(Math.ceil((stop - start)/step), 0);
        var idx = 0;
        var range = new Array(len);

        while(idx < len) {
            range[idx++] = start;
            start += step;
        }
        return range;
    };

    var ctor = function () {};
    _.bind = function bind (func, context) {
        var bound, args;
        if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError;
        args = slice.call(arguments, 2);
        return bound = function () {
            if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
            ctor.prototype = func.prototype;
            var self = new ctor;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) return result;
            return self;
        };
    };

    _.bindAll = function (obj) {
        var funcs = slice.call(arguments, 1);
        if (funcs.length == 0) funcs = _.functions(obj);
        each(funcs, function (f) {
            obj[f]= _.bind(obj[f], obj);
        });
        return obj;
    };

//need to understand~~~
    _.memoize = function (func, hasher) {
        var memo = {};
        hasher || (hasher = _.identity);
        return function () {
            var key = hasher.apply(this, arguments);
            return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this,arguments));
        };
    };

    _.delay = function (func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function () {
            return func.apply(null, args);
        }, wait);
    };

    _.defer = function (func) {
        return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };

    _.throttle = function (func, wait) {
        var context, args, timeout, throttling, more, result;
        var whenDone = _.debounce(function () {
            more = throttling = false;
        }, wait);
        return function() {
            context = this;
            args = arguments;
            var later = function () {
                timeout = null;
                if (more) {
                    result = func.apply(context, args);
                }
                whenDone();
            };
            if (!timeout) timeout = setTimeout(later, wait);
            if (throttling) {
                more = true;
            }else {
                throttling = true;
                result = func.apply(context, args);
            }
            whenDone();
            return result;
        };
    };

    _.debounce = function (func, wait, immediate) {
        var timeout, result;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) result = func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };

    _.once = function (func) {
        var ran = false, memo;
        return function () {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };

    _.wrap = function(func, wrapper) {
        return function() {
            var args = [func];
            push.apply(args, arguments);
            return wrapper.apply(this, args);
        };
    };

    _.compose = function() {
        var funcs = arguments;
        return function() {
            var args = arguments;
            for (var i = funcs.length-1; i >=0; i--) {
                args = [funcs[i].apply(this, args)];
            }
            return args[0];
        };
    };

    _.after = function(times, func) {
        if (times <= 0) return func();
        return function() {
            if(--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };

    _.keys = nativeKeys || function(obj) {
        if(obj !== Object(obj)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
        return keys;
    };

    _.values = function(obj) {
        var values = [];
        for (var key in obj) if (_.has(obj,key)) values.push(obj[key]);
        return values;
    };

    _.pairs = function (obj) {
        var pairs = [];
        for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
        return pairs;
    }

    _.invert = function(obj) {
        var result = {};
        for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
        return result;
    };

    _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    _.extend = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            for(var prop in source) {
                obj[prop] = source[prop];
            }
        });
        return obj;
    };

    _.pick = function (obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        each(keys, function(key){
            if (key in obj) copy[key] = obj[key];
        });
        return copy;
    };

    _.omit = function(obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments,1));
        for(var key in obj) {
            if (!_.contains(keys, key))copy[key] = obj[key];
        }
        return copy;
    }

    _.defaults = function(obj) {
        each(slice.call(arguments, 1), function (source) {
            for (var prop in source) {
                if (obj[prop] == null) obj[prop] = source[prop];
            }
        });
    };

    _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    }

    _.tap = function(obj, intercepter) {
        intercepter(obj);
        return obj;
    }

    var eq = function(a, b, aStack, bStack) {
        if (a===b) return a!==0 || 1/a == 1/b;
        if (a == null || b == null) return a===b;
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;

        var className = toString.call(a);
        if (className != toString.call(b)) return false;
        switch (className) {
            case '[object String]':
                return a == String(b);
            case '[object Number]':
                return a != +a ? b != +b : (a == 0 ? 1/a == 1/b : a == +b);
            case '[object Date]':
            case '[object Boolean]':
                return +a == +b;
            case '[object RegExp]':
                return a.source == b.source &&
                        a.global == b.global &&
                        a.multiline == b.multiline &&
                        a.ignoreCase == b.ignoreCase;
        }
        if (typeof a!= 'object' || typeof b != 'object') return false;
        var length = aStack.length;
        while (length -- ) {
            if (aStack[length] == a) return bStack[length] == b;
        }
        aStack.push(a);
        bStack.push(b);
        var size = 0, result = true;
        if (className == '[object Array]') {
            size = a.length;
            result = size == b.length;
            if (result) {
                while(size--) {
                    if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                }
            }
        }else {
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !)
        }
    }

    _.isEqual = function(a, b) {
        return eq(a, b, [], []);
    };

    _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (_.isArray(obj) || _.isString(obj)) return obj.length ===0;
        for (var key in obj) if(_.has(obj, key)) return false;
        return true;
    };

    _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
    };

    _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) == '[object Array]';
    }

    _.isObject = function(obj) {
        return obj === Object(obj);
    }

    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
        _['is'+name] = function(obj) {
            return toString.call(obj) == '[object' + name + ']';
        };
    });

    if (!_.isArguments(arguments)) {
        _.isArguments = function(obj) {
            return !!((obj)&& _.has(obj, 'callee'));
        }
    }

    if (typeof (/./) !== 'function') {
        _.isFunction = function(obj) {
            return typeof obj === 'function';
        };
    }

    _.isFinite = function(obj) {
        return _.isNumber(obj) && isFinite(obj);
    }

    _.isNaN = function (obj) {
        return _.isNumber(obj) && obj != +obj;
    }

    _.isBoolean = function (obj) {
        return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };

    _.isNull = function (obj) {
        return obj === null;
    };

    _.isUndefined = function(obj) {
        //return typeof obj === 'undefined';
        return obj === void 0;
    };

    _.has = function (obj, key) {
        return hasOwnProperty.call(obj, key);
    }

    _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
    }

    _.identity = function(value) {
        return value;
    }

    _.times = function(n, iterator, context) {
        for (var i = 0; i < n; i++) {
            iterator.call(context, i);
        };
    }

    _.random = function(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + (o | Math.random()*(max - min + 1));
    }

    var entityMap = {
        escape: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        }
    };
    entityMap.unescape = _.invert(entityMap.escape);

    var entityRegexes = {
        escape: new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
        unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
    };

    _.each(['escape', 'unescape'], function(method) {
        _[method] = function (string) {
            if (string == null) return '';
            return ('' + string).replace(entityRegexes[method], function(match) {
                return entityMap[method][match];
            });
        };
    });

    _.result = function(object, property) {
        if (object == null) return null;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    };

    _.mixin = function (obj) {
        each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function () {
                var args = [this._wrapped];
                push.apply(args, arguments);
                return result.call(this, func.apply(_, args));
            };
        });
    };

    var idCounter = 0;
    _.uniqueId = function(prefix) {
        var id = idCounter++;
        return prefix ? prefix + id : id;
    };

    _.templateSetting = {
        evalute: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g,
    };

    var noMatch = /(.)^/;
    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\t': 't',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

    _.template = function(text, data, settings) {
        settings = _.defaults({}, settings, _.templateSetting);
        var matcher = new RegExp([
            (settings.escape || noMatch).source,
            (settings.interpolate || noMatch).source,
            (settings.evalute || noMatch).source
        ].join('|') + '|$', 'g');

        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evalute, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function(match) { return '\\'+escapes[match]});
            source +=
                escape ? "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'":
                interpolate ? "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'":
                evalute ? "';\n" + evalute + "\n__p+'" : '';
            index = offset + match.length;
        });
        source += "';\n";

        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t, __p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";

        try {
            var render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) return render(data, _);
        var template = function(data) {
            return render.call(this, data, _);
        }

        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    }

    _.chain = function(obj) {
        return _(obj).chain();
    };

    var result = function (obj) {
        return this._chain ? _(obj).chain() : obj;
    }

    _.mixin(_);

    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name === 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
            return result.call(this, obj);
        };
    });

    each(['concat', 'join', 'slice'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    });

    _.extend(_.prototype, {
        chain: function() {
            this._chain = true;
            return this;
        },
        value: function () {
            return this._wrapped;
        }
    });
}).call(this);
