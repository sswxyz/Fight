//#1: crazy!
//
// see: http://javascriptweblog.wordpress.com/2010/04/27/the-russian-doll-principle-re-writing%C2%A0functions%C2%A0at%C2%A0runtime/
// see: http://osteele.com/posts/2006/04/one-line-javascript-memoization

function System() {
}

System.prototype.requestDownload = function(pkg, cb) {
    console.log('download ' + pkg);
    setTimeout(function() {
        cb('done');
    });
};

System.prototype.download = function(pkg) {
    this.download = function() {
        console.log('still downloading...');
    };

    var self = this;
    this.requestDownload(pkg, function(data) {
        console.log('downloaded ' + data);
        delete self.download;
    });
};

var system = new System();
system.download('kde');
system.download('qt');

setTimeout(function() {
    system.download('gnome');
}, 0);


//#2: tracer
// see: http://javascriptweblog.wordpress.com/2010/06/01/a-tracer-utility-in-2kb
// for a better one

var tracer = {
    traceAll: function(root, recursive) {
        if (!root || typeof root !== 'object') {
            return;
        }

        Object.getOwnPropertyNames(root).forEach(function(prop) {
            var type = typeof root[prop];
            if (type === 'function') {
                tracer.traceMe(root, prop);
            } else if (type === 'object' && recursive) {
               tracer.traceAll(root[prop], recursive);
            }
        });
    },

    traceMe: function(obj, func) {
        console.log('tracing [%s]', func);
        var orig = obj[func];
        var around = function() {
            var start = +Date.now();
            var ret = orig.apply(obj, [].slice.apply(arguments));
            console.log('%s -> %s [%d]', func, ret, Date.now() - start);
            return ret;
        };

        obj[func] = around;
    }
};


var root = {
    init: function() {
        var res = 0;
        for (var i = 0; i < 100000; i++) {
            res += Math.sqrt(i);
        }
        return this.prepare();
    },

    prepare: function() {
        var res = 0;
        for (var i = 0; i < 1000000; i++) {
            res += Math.sqrt(i);
        }
        return this.scan();
    },

    scan: function() {
        return true;
        // throw new MyError('scan failed');
    }
};

tracer.traceAll(root, true);
root.init();

// var esprima = require('esprima');
// tracer.traceAll(esprima, true);
// esprima.parse(require('fs').readFileSync('selfmodifiedfunc.js'));

// tracer.traceAll(require('fs'));

// tracer.traceAll(require('express'));

//#3: self-mod memoization fib

function fib(n) {
    var memos = [];

    var fibMemo = function(n) {
        if (!memos[n]) {
            if (n <= 2) {
                memos[n] = 1;
            } else {
                memos[n] = fibMemo(n-1) + fibMemo(n-2);
            }
        }
        return memos[n];
    };

    return fibMemo(n);
}

function fib2(n) {
    if (n <= 2) {
        return 1;
    } else {
        return fib2(n-1) + fib2(n-2);
    }
}

var assert = require('assert');
assert.equal(fib(5), 5);
assert.equal(fib(6), 8);
assert.equal(fib(10), 55);
assert.equal(fib(20), 6765);
// assert.equal(fib2(30), 832040);
// console.log(fib(40));

//#4: thunk?

//#5: cache wrapper for fib2
function memoize(fn) {
    var cache = {};
    return function() {
        var arg = arguments[0];
        cache[arg] = cache[arg] || fn(arg);
        return cache[arg];
    };
}

var fib2 = memoize(fib2);
assert.equal(fib(40), fib2(40));
fib2(40);

var memoizee = require('memoizee');
var fm = memoizee(fib2);
// assert.equal(fib(40), fm(40));
// fm(50);
