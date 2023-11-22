/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@protobufjs/base64/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@protobufjs/base64/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * A minimal base64 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var base64 = exports;

/**
 * Calculates the byte length of a base64 encoded string.
 * @param {string} string Base64 encoded string
 * @returns {number} Byte length
 */
base64.length = function length(string) {
    var p = string.length;
    if (!p)
        return 0;
    var n = 0;
    while (--p % 4 > 1 && string.charAt(p) === "=")
        ++n;
    return Math.ceil(string.length * 3) / 4 - n;
};

// Base64 encoding table
var b64 = new Array(64);

// Base64 decoding table
var s64 = new Array(123);

// 65..90, 97..122, 48..57, 43, 47
for (var i = 0; i < 64;)
    s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

/**
 * Encodes a buffer to a base64 encoded string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} Base64 encoded string
 */
base64.encode = function encode(buffer, start, end) {
    var parts = null,
        chunk = [];
    var i = 0, // output index
        j = 0, // goto index
        t;     // temporary
    while (start < end) {
        var b = buffer[start++];
        switch (j) {
            case 0:
                chunk[i++] = b64[b >> 2];
                t = (b & 3) << 4;
                j = 1;
                break;
            case 1:
                chunk[i++] = b64[t | b >> 4];
                t = (b & 15) << 2;
                j = 2;
                break;
            case 2:
                chunk[i++] = b64[t | b >> 6];
                chunk[i++] = b64[b & 63];
                j = 0;
                break;
        }
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (j) {
        chunk[i++] = b64[t];
        chunk[i++] = 61;
        if (j === 1)
            chunk[i++] = 61;
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

var invalidEncoding = "invalid encoding";

/**
 * Decodes a base64 encoded string to a buffer.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Number of bytes written
 * @throws {Error} If encoding is invalid
 */
base64.decode = function decode(string, buffer, offset) {
    var start = offset;
    var j = 0, // goto index
        t;     // temporary
    for (var i = 0; i < string.length;) {
        var c = string.charCodeAt(i++);
        if (c === 61 && j > 1)
            break;
        if ((c = s64[c]) === undefined)
            throw Error(invalidEncoding);
        switch (j) {
            case 0:
                t = c;
                j = 1;
                break;
            case 1:
                buffer[offset++] = t << 2 | (c & 48) >> 4;
                t = c;
                j = 2;
                break;
            case 2:
                buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                t = c;
                j = 3;
                break;
            case 3:
                buffer[offset++] = (t & 3) << 6 | c;
                j = 0;
                break;
        }
    }
    if (j === 1)
        throw Error(invalidEncoding);
    return offset - start;
};

/**
 * Tests if the specified string appears to be base64 encoded.
 * @param {string} string String to test
 * @returns {boolean} `true` if probably base64 encoded, otherwise false
 */
base64.test = function test(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
};


/***/ }),

/***/ "./node_modules/@protobufjs/utf8/index.js":
/*!************************************************!*\
  !*** ./node_modules/@protobufjs/utf8/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


/**
 * A minimal UTF8 implementation for number arrays.
 * @memberof util
 * @namespace
 */
var utf8 = exports;

/**
 * Calculates the UTF8 byte length of a string.
 * @param {string} string String
 * @returns {number} Byte length
 */
utf8.length = function utf8_length(string) {
    var len = 0,
        c = 0;
    for (var i = 0; i < string.length; ++i) {
        c = string.charCodeAt(i);
        if (c < 128)
            len += 1;
        else if (c < 2048)
            len += 2;
        else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
            ++i;
            len += 4;
        } else
            len += 3;
    }
    return len;
};

/**
 * Reads UTF8 bytes as a string.
 * @param {Uint8Array} buffer Source buffer
 * @param {number} start Source start
 * @param {number} end Source end
 * @returns {string} String read
 */
utf8.read = function utf8_read(buffer, start, end) {
    var len = end - start;
    if (len < 1)
        return "";
    var parts = null,
        chunk = [],
        i = 0, // char offset
        t;     // temporary
    while (start < end) {
        t = buffer[start++];
        if (t < 128)
            chunk[i++] = t;
        else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
        else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
            chunk[i++] = 0xD800 + (t >> 10);
            chunk[i++] = 0xDC00 + (t & 1023);
        } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
        if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
        }
    }
    if (parts) {
        if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
        return parts.join("");
    }
    return String.fromCharCode.apply(String, chunk.slice(0, i));
};

/**
 * Writes a string as UTF8 bytes.
 * @param {string} string Source string
 * @param {Uint8Array} buffer Destination buffer
 * @param {number} offset Destination offset
 * @returns {number} Bytes written
 */
utf8.write = function utf8_write(string, buffer, offset) {
    var start = offset,
        c1, // character 1
        c2; // character 2
    for (var i = 0; i < string.length; ++i) {
        c1 = string.charCodeAt(i);
        if (c1 < 128) {
            buffer[offset++] = c1;
        } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6       | 192;
            buffer[offset++] = c1       & 63 | 128;
        } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
            c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
            ++i;
            buffer[offset++] = c1 >> 18      | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        } else {
            buffer[offset++] = c1 >> 12      | 224;
            buffer[offset++] = c1 >> 6  & 63 | 128;
            buffer[offset++] = c1       & 63 | 128;
        }
    }
    return offset - start;
};


/***/ }),

/***/ "./node_modules/file-saver/dist/FileSaver.min.js":
/*!*******************************************************!*\
  !*** ./node_modules/file-saver/dist/FileSaver.min.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof __webpack_require__.g&&__webpack_require__.g.global===__webpack_require__.g?__webpack_require__.g:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g, true&&(module.exports=g)});

//# sourceMappingURL=FileSaver.min.js.map

/***/ }),

/***/ "./node_modules/jsbn-rsa/jsbn.js":
/*!***************************************!*\
  !*** ./node_modules/jsbn-rsa/jsbn.js ***!
  \***************************************/
/***/ (function(module, exports) {


(function() {

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

var inBrowser =
    typeof navigator !== 'undefined' && typeof window !== 'undefined';

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);

// (public) Constructor
function BigInteger(a, b, c) {
  if (a != null)
    if ('number' == typeof a)
      this.fromNumber(a, b, c);
    else if (b == null && 'string' != typeof a)
      this.fromString(a, 256);
    else
      this.fromString(a, b);
}

// return new, unset BigInteger
function nbi() {
  return new BigInteger(null);
}

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this[i++] + w[j] + c;
    c = Math.floor(v / 0x4000000);
    w[j++] = v & 0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
  var xl = x & 0x7fff, xh = x >> 15;
  while (--n >= 0) {
    var l = this[i] & 0x7fff;
    var h = this[i++] >> 15;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
    w[j++] = l & 0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
  var xl = x & 0x3fff, xh = x >> 14;
  while (--n >= 0) {
    var l = this[i] & 0x3fff;
    var h = this[i++] >> 14;
    var m = xh * l + h * xl;
    l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
    c = (l >> 28) + (m >> 14) + xh * h;
    w[j++] = l & 0xfffffff;
  }
  return c;
}
if (inBrowser && j_lm && (navigator.appName == 'Microsoft Internet Explorer')) {
  BigInteger.prototype.am = am2;
  dbits = 30;
} else if (inBrowser && j_lm && (navigator.appName != 'Netscape')) {
  BigInteger.prototype.am = am1;
  dbits = 26;
} else {  // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;

// Digit conversions
var BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz';
var BI_RC = new Array();
var rr, vv;
rr = '0'.charCodeAt(0);
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = 'a'.charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = 'A'.charCodeAt(0);
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) {
  return BI_RM.charAt(n);
}
function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c == null) ? -1 : c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x < 0) ? -1 : 0;
  if (x > 0)
    this[0] = x;
  else if (x < -1)
    this[0] = x + this.DV;
  else
    this.t = 0;
}

// return bigint initialized to value
function nbv(i) {
  var r = nbi();
  r.fromInt(i);
  return r;
}

// (protected) set from string and radix
function bnpFromString(s, b) {
  var k;
  if (b == 16)
    k = 4;
  else if (b == 8)
    k = 3;
  else if (b == 256)
    k = 8;  // byte array
  else if (b == 2)
    k = 1;
  else if (b == 32)
    k = 5;
  else if (b == 4)
    k = 2;
  else {
    this.fromRadix(s, b);
    return;
  }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while (--i >= 0) {
    var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) == '-') mi = true;
      continue;
    }
    mi = false;
    if (sh == 0)
      this[this.t++] = x;
    else if (sh + k > this.DB) {
      this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
      this[this.t++] = (x >> (this.DB - sh));
    } else
      this[this.t - 1] |= x << sh;
    sh += k;
    if (sh >= this.DB) sh -= this.DB;
  }
  if (k == 8 && (s[0] & 0x80) != 0) {
    this.s = -1;
    if (sh > 0) this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
  }
  this.clamp();
  if (mi) BigInteger.ZERO.subTo(this, this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s & this.DM;
  while (this.t > 0 && this[this.t - 1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if (this.s < 0) return '-' + this.negate().toString(b);
  var k;
  if (b == 16)
    k = 4;
  else if (b == 8)
    k = 3;
  else if (b == 2)
    k = 1;
  else if (b == 32)
    k = 5;
  else if (b == 4)
    k = 2;
  else
    return this.toRadix(b);
  var km = (1 << k) - 1, d, m = false, r = '', i = this.t;
  var p = this.DB - (i * this.DB) % k;
  if (i-- > 0) {
    if (p < this.DB && (d = this[i] >> p) > 0) {
      m = true;
      r = int2char(d);
    }
    while (i >= 0) {
      if (p < k) {
        d = (this[i] & ((1 << p) - 1)) << (k - p);
        d |= this[--i] >> (p += this.DB - k);
      } else {
        d = (this[i] >> (p -= k)) & km;
        if (p <= 0) {
          p += this.DB;
          --i;
        }
      }
      if (d > 0) m = true;
      if (m) r += int2char(d);
    }
  }
  return m ? r : '0';
}

// (public) -this
function bnNegate() {
  var r = nbi();
  BigInteger.ZERO.subTo(this, r);
  return r;
}

// (public) |this|
function bnAbs() {
  return (this.s < 0) ? this.negate() : this;
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s - a.s;
  if (r != 0) return r;
  var i = this.t;
  r = i - a.t;
  if (r != 0) return (this.s < 0) ? -r : r;
  while (--i >= 0)
    if ((r = this[i] - a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if ((t = x >>> 16) != 0) {
    x = t;
    r += 16;
  }
  if ((t = x >> 8) != 0) {
    x = t;
    r += 8;
  }
  if ((t = x >> 4) != 0) {
    x = t;
    r += 4;
  }
  if ((t = x >> 2) != 0) {
    x = t;
    r += 2;
  }
  if ((t = x >> 1) != 0) {
    x = t;
    r += 1;
  }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if (this.t <= 0) return 0;
  return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n, r) {
  var i;
  for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];
  for (i = n - 1; i >= 0; --i) r[i] = 0;
  r.t = this.t + n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n, r) {
  for (var i = n; i < this.t; ++i) r[i - n] = this[i];
  r.t = Math.max(this.t - n, 0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n, r) {
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << cbs) - 1;
  var ds = Math.floor(n / this.DB), c = (this.s << bs) & this.DM, i;
  for (i = this.t - 1; i >= 0; --i) {
    r[i + ds + 1] = (this[i] >> cbs) | c;
    c = (this[i] & bm) << bs;
  }
  for (i = ds - 1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t + ds + 1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n, r) {
  r.s = this.s;
  var ds = Math.floor(n / this.DB);
  if (ds >= this.t) {
    r.t = 0;
    return;
  }
  var bs = n % this.DB;
  var cbs = this.DB - bs;
  var bm = (1 << bs) - 1;
  r[0] = this[ds] >> bs;
  for (var i = ds + 1; i < this.t; ++i) {
    r[i - ds - 1] |= (this[i] & bm) << cbs;
    r[i - ds] = this[i] >> bs;
  }
  if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
  r.t = this.t - ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a, r) {
  var i = 0, c = 0, m = Math.min(a.t, this.t);
  while (i < m) {
    c += this[i] - a[i];
    r[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c -= a.s;
    while (i < this.t) {
      c += this[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while (i < a.t) {
      c -= a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c < 0) ? -1 : 0;
  if (c < -1)
    r[i++] = this.DV + c;
  else if (c > 0)
    r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a, r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i + y.t;
  while (--i >= 0) r[i] = 0;
  for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
  r.s = 0;
  r.clamp();
  if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2 * x.t;
  while (--i >= 0) r[i] = 0;
  for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x[i], r, 2 * i, 0, 1);
    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >=
        x.DV) {
      r[i + x.t] -= x.DV;
      r[i + x.t + 1] = 1;
    }
  }
  if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m, q, r) {
  var pm = m.abs();
  if (pm.t <= 0) return;
  var pt = this.abs();
  if (pt.t < pm.t) {
    if (q != null) q.fromInt(0);
    if (r != null) this.copyTo(r);
    return;
  }
  if (r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB - nbits(pm[pm.t - 1]);  // normalize modulus
  if (nsh > 0) {
    pm.lShiftTo(nsh, y);
    pt.lShiftTo(nsh, r);
  } else {
    pm.copyTo(y);
    pt.copyTo(r);
  }
  var ys = y.t;
  var y0 = y[ys - 1];
  if (y0 == 0) return;
  var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
  var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
  var i = r.t, j = i - ys, t = (q == null) ? nbi() : q;
  y.dlShiftTo(j, t);
  if (r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t, r);
  }
  BigInteger.ONE.dlShiftTo(ys, t);
  t.subTo(y, y);  // "negative" y so we can replace sub with am later
  while (y.t < ys) y[y.t++] = 0;
  while (--j >= 0) {
    // Estimate quotient digit
    var qd =
        (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {  // Try it out
      y.dlShiftTo(j, t);
      r.subTo(t, r);
      while (r[i] < --qd) r.subTo(t, r);
    }
  }
  if (q != null) {
    r.drShiftTo(ys, q);
    if (ts != ms) BigInteger.ZERO.subTo(q, q);
  }
  r.t = ys;
  r.clamp();
  if (nsh > 0) r.rShiftTo(nsh, r);  // Denormalize remainder
  if (ts < 0) BigInteger.ZERO.subTo(r, r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a, null, r);
  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) {
  this.m = m;
}
function cConvert(x) {
  if (x.s < 0 || x.compareTo(this.m) >= 0)
    return x.mod(this.m);
  else
    return x;
}
function cRevert(x) {
  return x;
}
function cReduce(x) {
  x.divRemTo(this.m, null, x);
}
function cMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}
function cSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if (this.t < 1) return 0;
  var x = this[0];
  if ((x & 1) == 0) return 0;
  var y = x & 3;                                           // y == 1/x mod 2^2
  y = (y * (2 - (x & 0xf) * y)) & 0xf;                     // y == 1/x mod 2^4
  y = (y * (2 - (x & 0xff) * y)) & 0xff;                   // y == 1/x mod 2^8
  y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;  // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y * (2 - x * y % this.DV)) % this.DV;  // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y > 0) ? this.DV - y : -y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp & 0x7fff;
  this.mph = this.mp >> 15;
  this.um = (1 << (m.DB - 15)) - 1;
  this.mt2 = 2 * m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t, r);
  r.divRemTo(this.m, null, r);
  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while (x.t <= this.mt2)  // pad x so am has enough room later
    x[x.t++] = 0;
  for (var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i] & 0x7fff;
    var u0 = (j * this.mpl +
              (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) &
        x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i + this.m.t;
    x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
    // propagate carry
    while (x[j] >= x.DV) {
      x[j] -= x.DV;
      x[++j]++;
    }
  }
  x.clamp();
  x.drShiftTo(this.m.t, x);
  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() {
  return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
}

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e, z) {
  if (e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
  g.copyTo(r);
  while (--i >= 0) {
    z.sqrTo(r, r2);
    if ((e & (1 << i)) > 0)
      z.mulTo(r2, g, r);
    else {
      var t = r;
      r = r2;
      r2 = t;
    }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e, m) {
  var z;
  if (e < 256 || m.isEven())
    z = new Classic(m);
  else
    z = new Montgomery(m);
  return this.exp(e, z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

if (true) {
  exports = module.exports = {
    default: BigInteger,
    BigInteger: BigInteger,
  };
} else {}

// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() {
  var r = nbi();
  this.copyTo(r);
  return r;
}

// (public) return value as integer
function bnIntValue() {
  if (this.s < 0) {
    if (this.t == 1)
      return this[0] - this.DV;
    else if (this.t == 0)
      return -1;
  } else if (this.t == 1)
    return this[0];
  else if (this.t == 0)
    return 0;
  // assumes 16 < DB < 32
  return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
}

// (public) return value as byte
function bnByteValue() {
  return (this.t == 0) ? this.s : (this[0] << 24) >> 24;
}

// (public) return value as short (assumes DB>=16)
function bnShortValue() {
  return (this.t == 0) ? this.s : (this[0] << 16) >> 16;
}

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) {
  return Math.floor(Math.LN2 * this.DB / Math.log(r));
}

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if (this.s < 0)
    return -1;
  else if (this.t <= 0 || (this.t == 1 && this[0] <= 0))
    return 0;
  else
    return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if (b == null) b = 10;
  if (this.signum() == 0 || b < 2 || b > 36) return '0';
  var cs = this.chunkSize(b);
  var a = Math.pow(b, cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = '';
  this.divRemTo(d, y, z);
  while (y.signum() > 0) {
    r = (a + z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d, y, z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s, b) {
  this.fromInt(0);
  if (b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
  for (var i = 0; i < s.length; ++i) {
    var x = intAt(s, i);
    if (x < 0) {
      if (s.charAt(i) == '-' && this.signum() == 0) mi = true;
      continue;
    }
    w = b * w + x;
    if (++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w, 0);
      j = 0;
      w = 0;
    }
  }
  if (j > 0) {
    this.dMultiply(Math.pow(b, j));
    this.dAddOffset(w, 0);
  }
  if (mi) BigInteger.ZERO.subTo(this, this);
}

// (protected) alternate constructor
function bnpFromNumber(a, b, c) {
  if ('number' == typeof b) {
    // new BigInteger(int,int,RNG)
    if (a < 2)
      this.fromInt(1);
    else {
      this.fromNumber(a, c);
      if (!this.testBit(a - 1))  // force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
      if (this.isEven()) this.dAddOffset(1, 0);  // force odd
      while (!this.isProbablePrime(b)) {
        this.dAddOffset(2, 0);
        if (this.bitLength() > a)
          this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
      }
    }
  } else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a & 7;
    x.length = (a >> 3) + 1;
    b.nextBytes(x);
    if (t > 0)
      x[0] &= ((1 << t) - 1);
    else
      x[0] = 0;
    this.fromString(x, 256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB - (i * this.DB) % 8, d, k = 0;
  if (i-- > 0) {
    if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
      r[k++] = d | (this.s << (this.DB - p));
    while (i >= 0) {
      if (p < 8) {
        d = (this[i] & ((1 << p) - 1)) << (8 - p);
        d |= this[--i] >> (p += this.DB - 8);
      } else {
        d = (this[i] >> (p -= 8)) & 0xff;
        if (p <= 0) {
          p += this.DB;
          --i;
        }
      }
      if ((d & 0x80) != 0) d |= -256;
      if (k == 0 && (this.s & 0x80) != (d & 0x80)) ++k;
      if (k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) {
  return (this.compareTo(a) == 0);
}
function bnMin(a) {
  return (this.compareTo(a) < 0) ? this : a;
}
function bnMax(a) {
  return (this.compareTo(a) > 0) ? this : a;
}

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a, op, r) {
  var i, f, m = Math.min(a.t, this.t);
  for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);
  if (a.t < this.t) {
    f = a.s & this.DM;
    for (i = m; i < this.t; ++i) r[i] = op(this[i], f);
    r.t = this.t;
  } else {
    f = this.s & this.DM;
    for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);
    r.t = a.t;
  }
  r.s = op(this.s, a.s);
  r.clamp();
}

// (public) this & a
function op_and(x, y) {
  return x & y;
}
function bnAnd(a) {
  var r = nbi();
  this.bitwiseTo(a, op_and, r);
  return r;
}

// (public) this | a
function op_or(x, y) {
  return x | y;
}
function bnOr(a) {
  var r = nbi();
  this.bitwiseTo(a, op_or, r);
  return r;
}

// (public) this ^ a
function op_xor(x, y) {
  return x ^ y;
}
function bnXor(a) {
  var r = nbi();
  this.bitwiseTo(a, op_xor, r);
  return r;
}

// (public) this & ~a
function op_andnot(x, y) {
  return x & ~y;
}
function bnAndNot(a) {
  var r = nbi();
  this.bitwiseTo(a, op_andnot, r);
  return r;
}

// (public) ~this
function bnNot() {
  var r = nbi();
  for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if (n < 0)
    this.rShiftTo(-n, r);
  else
    this.lShiftTo(n, r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if (n < 0)
    this.lShiftTo(-n, r);
  else
    this.rShiftTo(n, r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if (x == 0) return -1;
  var r = 0;
  if ((x & 0xffff) == 0) {
    x >>= 16;
    r += 16;
  }
  if ((x & 0xff) == 0) {
    x >>= 8;
    r += 8;
  }
  if ((x & 0xf) == 0) {
    x >>= 4;
    r += 4;
  }
  if ((x & 3) == 0) {
    x >>= 2;
    r += 2;
  }
  if ((x & 1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for (var i = 0; i < this.t; ++i)
    if (this[i] != 0) return i * this.DB + lbit(this[i]);
  if (this.s < 0) return this.t * this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while (x != 0) {
    x &= x - 1;
    ++r;
  }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s & this.DM;
  for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n / this.DB);
  if (j >= this.t) return (this.s != 0);
  return ((this[j] & (1 << (n % this.DB))) != 0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n, op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r, op, r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) {
  return this.changeBit(n, op_or);
}

// (public) this & ~(1<<n)
function bnClearBit(n) {
  return this.changeBit(n, op_andnot);
}

// (public) this ^ (1<<n)
function bnFlipBit(n) {
  return this.changeBit(n, op_xor);
}

// (protected) r = this + a
function bnpAddTo(a, r) {
  var i = 0, c = 0, m = Math.min(a.t, this.t);
  while (i < m) {
    c += this[i] + a[i];
    r[i++] = c & this.DM;
    c >>= this.DB;
  }
  if (a.t < this.t) {
    c += a.s;
    while (i < this.t) {
      c += this[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += this.s;
  } else {
    c += this.s;
    while (i < a.t) {
      c += a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c < 0) ? -1 : 0;
  if (c > 0)
    r[i++] = c;
  else if (c < -1)
    r[i++] = this.DV + c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) {
  var r = nbi();
  this.addTo(a, r);
  return r;
}

// (public) this - a
function bnSubtract(a) {
  var r = nbi();
  this.subTo(a, r);
  return r;
}

// (public) this * a
function bnMultiply(a) {
  var r = nbi();
  this.multiplyTo(a, r);
  return r;
}

// (public) this^2
function bnSquare() {
  var r = nbi();
  this.squareTo(r);
  return r;
}

// (public) this / a
function bnDivide(a) {
  var r = nbi();
  this.divRemTo(a, r, null);
  return r;
}

// (public) this % a
function bnRemainder(a) {
  var r = nbi();
  this.divRemTo(a, null, r);
  return r;
}

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a, q, r);
  return new Array(q, r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n, w) {
  if (n == 0) return;
  while (this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while (this[w] >= this.DV) {
    this[w] -= this.DV;
    if (++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
// tslint:disable-next-line
function NullExp() {}
function nNop(x) {
  return x;
}
function nMulTo(x, y, r) {
  x.multiplyTo(y, r);
}
function nSqrTo(x, r) {
  x.squareTo(r);
}

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) {
  return this.exp(e, new NullExp());
}

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a, n, r) {
  var i = Math.min(this.t + a.t, n);
  r.s = 0;  // assumes a,this >= 0
  r.t = i;
  while (i > 0) r[--i] = 0;
  var j;
  for (j = r.t - this.t; i < j; ++i)
    r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
  for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a, n, r) {
  --n;
  var i = r.t = this.t + a.t - n;
  r.s = 0;  // assumes a,this >= 0
  while (--i >= 0) r[i] = 0;
  for (i = Math.max(n - this.t, 0); i < a.t; ++i)
    r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
  r.clamp();
  r.drShiftTo(1, r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if (x.s < 0 || x.t > 2 * this.m.t)
    return x.mod(this.m);
  else if (x.compareTo(this.m) < 0)
    return x;
  else {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }
}

function barrettRevert(x) {
  return x;
}

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t - 1, this.r2);
  if (x.t > this.m.t + 1) {
    x.t = this.m.t + 1;
    x.clamp();
  }
  this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
  this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
  while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
  x.subTo(this.r2, x);
  while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x, r) {
  x.squareTo(r);
  this.reduce(r);
}

// r = x*y mod m; x,y != r
function barrettMulTo(x, y, r) {
  x.multiplyTo(y, r);
  this.reduce(r);
}

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e, m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if (i <= 0)
    return r;
  else if (i < 18)
    k = 1;
  else if (i < 48)
    k = 3;
  else if (i < 144)
    k = 4;
  else if (i < 768)
    k = 5;
  else
    k = 6;
  if (i < 8)
    z = new Classic(m);
  else if (m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
  g[1] = z.convert(this);
  if (k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1], g2);
    while (n <= km) {
      g[n] = nbi();
      z.mulTo(g2, g[n - 2], g[n]);
      n += 2;
    }
  }

  var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j]) - 1;
  while (j >= 0) {
    if (i >= k1)
      w = (e[j] >> (i - k1)) & km;
    else {
      w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
      if (j > 0) w |= e[j - 1] >> (this.DB + i - k1);
    }

    n = k;
    while ((w & 1) == 0) {
      w >>= 1;
      --n;
    }
    if ((i -= n) < 0) {
      i += this.DB;
      --j;
    }
    if (is1) {  // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    } else {
      while (n > 1) {
        z.sqrTo(r, r2);
        z.sqrTo(r2, r);
        n -= 2;
      }
      if (n > 0)
        z.sqrTo(r, r2);
      else {
        t = r;
        r = r2;
        r2 = t;
      }
      z.mulTo(r2, g[w], r);
    }

    while (j >= 0 && (e[j] & (1 << i)) == 0) {
      z.sqrTo(r, r2);
      t = r;
      r = r2;
      r2 = t;
      if (--i < 0) {
        i = this.DB - 1;
        --j;
      }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s < 0) ? this.negate() : this.clone();
  var y = (a.s < 0) ? a.negate() : a.clone();
  if (x.compareTo(y) < 0) {
    var t = x;
    x = y;
    y = t;
  }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if (g < 0) return x;
  if (i < g) g = i;
  if (g > 0) {
    x.rShiftTo(g, x);
    y.rShiftTo(g, y);
  }
  while (x.signum() > 0) {
    if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
    if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
    if (x.compareTo(y) >= 0) {
      x.subTo(y, x);
      x.rShiftTo(1, x);
    } else {
      y.subTo(x, y);
      y.rShiftTo(1, y);
    }
  }
  if (g > 0) y.lShiftTo(g, y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if (n <= 0) return 0;
  var d = this.DV % n, r = (this.s < 0) ? n - 1 : 0;
  if (this.t > 0)
    if (d == 0)
      r = this[0] % n;
    else
      for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while (u.signum() != 0) {
    while (u.isEven()) {
      u.rShiftTo(1, u);
      if (ac) {
        if (!a.isEven() || !b.isEven()) {
          a.addTo(this, a);
          b.subTo(m, b);
        }
        a.rShiftTo(1, a);
      } else if (!b.isEven())
        b.subTo(m, b);
      b.rShiftTo(1, b);
    }
    while (v.isEven()) {
      v.rShiftTo(1, v);
      if (ac) {
        if (!c.isEven() || !d.isEven()) {
          c.addTo(this, c);
          d.subTo(m, d);
        }
        c.rShiftTo(1, c);
      } else if (!d.isEven())
        d.subTo(m, d);
      d.rShiftTo(1, d);
    }
    if (u.compareTo(v) >= 0) {
      u.subTo(v, u);
      if (ac) a.subTo(c, a);
      b.subTo(d, b);
    } else {
      v.subTo(u, v);
      if (ac) c.subTo(a, c);
      d.subTo(b, d);
    }
  }
  if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if (d.compareTo(m) >= 0) return d.subtract(m);
  if (d.signum() < 0)
    d.addTo(m, d);
  else
    return d;
  if (d.signum() < 0)
    return d.add(m);
  else
    return d;
}

var lowprimes = [
  2,   3,   5,   7,   11,  13,  17,  19,  23,  29,  31,  37,  41,  43,
  47,  53,  59,  61,  67,  71,  73,  79,  83,  89,  97,  101, 103, 107,
  109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181,
  191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263,
  269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349,
  353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433,
  439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521,
  523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613,
  617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701,
  709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809,
  811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887,
  907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
    for (i = 0; i < lowprimes.length; ++i)
      if (x[0] == lowprimes[i]) return true;
    return false;
  }
  if (x.isEven()) return false;
  i = 1;
  while (i < lowprimes.length) {
    var m = lowprimes[i], j = i + 1;
    while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while (i < j)
      if (m % lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if (k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t + 1) >> 1;
  if (t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for (var i = 0; i < t; ++i) {
    // Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
    var y = a.modPow(r, this);
    if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while (j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2, this);
        if (y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if (y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)

// Depends on jsbn.js and rng.js

// Version 1.1: support utf-8 encoding in pkcs1pad2

// convert a (hex) string to a bignum object
function parseBigInt(str, r) {
  return new BigInteger(str, r);
}

function linebrk(s, n) {
  var ret = '';
  var i = 0;
  while (i + n < s.length) {
    ret += s.substring(i, i + n) + '\n';
    i += n;
  }
  return ret + s.substring(i, s.length);
}

function byte2Hex(b) {
  if (b < 0x10)
    return '0' + b.toString(16);
  else
    return b.toString(16);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
  if (n < s.length + 11) {  // TODO: fix for utf-8
    alert('Message too long for RSA');
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while (i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if (c < 128) {  // encode using utf-8
      ba[--n] = c;
    } else if ((c > 127) && (c < 2048)) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    } else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while (n > 2) {  // random non-zero pad
    x[0] = 0;
    while (x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// "empty" RSA key constructor
function RSAKey() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}

// Set the public key fields N and e from hex strings
function RSASetPublic(N, E) {
  if (N != null && E != null && N.length > 0 && E.length > 0) {
    this.n = parseBigInt(N, 16);
    this.e = parseInt(E, 16);
  } else
    alert('Invalid RSA public key');
}

// Set the private key fields N, e, d and CRT params from hex strings
function RSASetPrivateEx(N,E,D,P,Q,DP,DQ,C) {
    if(N != null && E != null && N.length > 0 && E.length > 0) {
      this.n = parseBigInt(N,16);
      this.e = parseInt(E,16);
      this.d = parseBigInt(D,16);
      this.p = parseBigInt(P,16);
      this.q = parseBigInt(Q,16);
      this.dmp1 = parseBigInt(DP,16);
      this.dmq1 = parseBigInt(DQ,16);
      this.coeff = parseBigInt(C,16);
    }
    else
      alert("Invalid RSA private key");
  }

// Perform raw private operation on "x": return x^d (mod n)
function RSADoPrivate(x) {
  if(this.p == null || this.q == null)
    return x.modPow(this.d, this.n);

  // TODO: re-calculate any missing CRT params
  var xp = x.mod(this.p).modPow(this.dmp1, this.p);
  var xq = x.mod(this.q).modPow(this.dmq1, this.q);

  while(xp.compareTo(xq) < 0)
    xp = xp.add(this.p);
  return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
}

// Perform raw public operation on "x": return x^e (mod n)
function RSADoPublic(x) {
  return x.modPowInt(this.e, this.n);
}

// Return the PKCS#1 RSA encryption of "text" as an even-length hex string
function RSAEncrypt(text) {
  var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
  if (m == null) return null;
  var c = this.doPublic(m);
  if (c == null) return null;
  var h = c.toString(16);
  if ((h.length & 1) == 0)
    return h;
  else
    return '0' + h;
}

// Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
// function RSAEncryptB64(text) {
//  var h = this.encrypt(text);
//  if(h) return hex2b64(h); else return null;
//}

// protected
RSAKey.prototype.doPublic = RSADoPublic;

// public
RSAKey.prototype.doPrivate = RSADoPrivate;
RSAKey.prototype.setPublic = RSASetPublic;
RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
RSAKey.prototype.encrypt = RSAEncrypt;
// RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

var rng_state;
var rng_pool;
var rng_pptr;

// Mix in a 32-bit integer into the pool
function rng_seed_int(x) {
  rng_pool[rng_pptr++] ^= x & 255;
  rng_pool[rng_pptr++] ^= (x >> 8) & 255;
  rng_pool[rng_pptr++] ^= (x >> 16) & 255;
  rng_pool[rng_pptr++] ^= (x >> 24) & 255;
  if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
}

// Mix in the current time (w/milliseconds) into the pool
function rng_seed_time() {
  rng_seed_int(new Date().getTime());
}

// Initialize the pool with junk if needed.
if (rng_pool == null) {
  rng_pool = new Array();
  rng_pptr = 0;
  var t;
  if (inBrowser && window.crypto && window.crypto.getRandomValues) {
    // Use webcrypto if available
    var ua = new Uint8Array(32);
    window.crypto.getRandomValues(ua);
    for (t = 0; t < 32; ++t) rng_pool[rng_pptr++] = ua[t];
  }
  if (inBrowser && navigator.appName == 'Netscape' &&
      navigator.appVersion < '5' && window.crypto) {
    // Extract entropy (256 bits) from NS4 RNG if available
    var z = window.crypto.random(32);
    for (t = 0; t < z.length; ++t) rng_pool[rng_pptr++] = z.charCodeAt(t) & 255;
  }
  while (rng_pptr < rng_psize) {  // extract some randomness from Math.random()
    t = Math.floor(65536 * Math.random());
    rng_pool[rng_pptr++] = t >>> 8;
    rng_pool[rng_pptr++] = t & 255;
  }
  rng_pptr = 0;
  rng_seed_time();
  // rng_seed_int(window.screenX);
  // rng_seed_int(window.screenY);
}

function rng_get_byte() {
  if (rng_state == null) {
    rng_seed_time();
    rng_state = prng_newstate();
    rng_state.init(rng_pool);
    for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
      rng_pool[rng_pptr] = 0;
    rng_pptr = 0;
    // rng_pool = null;
  }
  // TODO: allow reseeding after first request
  return rng_state.next();
}

function rng_get_bytes(ba) {
  var i;
  for (i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
}

// tslint:disable-next-line
function SecureRandom() {}

SecureRandom.prototype.nextBytes = rng_get_bytes;

// prng4.js - uses Arcfour as a PRNG

function Arcfour() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}

// Initialize arcfour context from key, an array of ints, each from [0..255]
function ARC4init(key) {
  var i, j, t;
  for (i = 0; i < 256; ++i) this.S[i] = i;
  j = 0;
  for (i = 0; i < 256; ++i) {
    j = (j + this.S[i] + key[i % key.length]) & 255;
    t = this.S[i];
    this.S[i] = this.S[j];
    this.S[j] = t;
  }
  this.i = 0;
  this.j = 0;
}

function ARC4next() {
  var t;
  this.i = (this.i + 1) & 255;
  this.j = (this.j + this.S[this.i]) & 255;
  t = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = t;
  return this.S[(t + this.S[this.i]) & 255];
}

Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

// Plug in your RNG constructor here
function prng_newstate() {
  return new Arcfour();
}

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;

if (true) {
  exports = module.exports = {
      default: BigInteger,
      BigInteger: BigInteger,
      RSAKey: RSAKey,
  };
} else {}

}).call(this);


/***/ }),

/***/ "./node_modules/jszip/dist/jszip.min.js":
/*!**********************************************!*\
  !*** ./node_modules/jszip/dist/jszip.min.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/

!function(e){if(true)module.exports=e();else {}}(function(){return function s(a,o,h){function u(r,e){if(!o[r]){if(!a[r]){var t=undefined;if(!e&&t)return require(r,!0);if(l)return l(r,!0);var n=new Error("Cannot find module '"+r+"'");throw n.code="MODULE_NOT_FOUND",n}var i=o[r]={exports:{}};a[r][0].call(i.exports,function(e){var t=a[r][1][e];return u(t||e)},i,i.exports,s,a,o,h)}return o[r].exports}for(var l=undefined,e=0;e<h.length;e++)u(h[e]);return u}({1:[function(e,t,r){"use strict";var d=e("./utils"),c=e("./support"),p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";r.encode=function(e){for(var t,r,n,i,s,a,o,h=[],u=0,l=e.length,f=l,c="string"!==d.getTypeOf(e);u<e.length;)f=l-u,n=c?(t=e[u++],r=u<l?e[u++]:0,u<l?e[u++]:0):(t=e.charCodeAt(u++),r=u<l?e.charCodeAt(u++):0,u<l?e.charCodeAt(u++):0),i=t>>2,s=(3&t)<<4|r>>4,a=1<f?(15&r)<<2|n>>6:64,o=2<f?63&n:64,h.push(p.charAt(i)+p.charAt(s)+p.charAt(a)+p.charAt(o));return h.join("")},r.decode=function(e){var t,r,n,i,s,a,o=0,h=0,u="data:";if(e.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var l,f=3*(e=e.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(e.charAt(e.length-1)===p.charAt(64)&&f--,e.charAt(e.length-2)===p.charAt(64)&&f--,f%1!=0)throw new Error("Invalid base64 input, bad content length.");for(l=c.uint8array?new Uint8Array(0|f):new Array(0|f);o<e.length;)t=p.indexOf(e.charAt(o++))<<2|(i=p.indexOf(e.charAt(o++)))>>4,r=(15&i)<<4|(s=p.indexOf(e.charAt(o++)))>>2,n=(3&s)<<6|(a=p.indexOf(e.charAt(o++))),l[h++]=t,64!==s&&(l[h++]=r),64!==a&&(l[h++]=n);return l}},{"./support":30,"./utils":32}],2:[function(e,t,r){"use strict";var n=e("./external"),i=e("./stream/DataWorker"),s=e("./stream/Crc32Probe"),a=e("./stream/DataLengthProbe");function o(e,t,r,n,i){this.compressedSize=e,this.uncompressedSize=t,this.crc32=r,this.compression=n,this.compressedContent=i}o.prototype={getContentWorker:function(){var e=new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),t=this;return e.on("end",function(){if(this.streamInfo.data_length!==t.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),e},getCompressedWorker:function(){return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},o.createWorkerFrom=function(e,t,r){return e.pipe(new s).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression",t)},t.exports=o},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(e,t,r){"use strict";var n=e("./stream/GenericWorker");r.STORE={magic:"\0\0",compressWorker:function(){return new n("STORE compression")},uncompressWorker:function(){return new n("STORE decompression")}},r.DEFLATE=e("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(e,t,r){"use strict";var n=e("./utils");var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t){return void 0!==e&&e.length?"string"!==n.getTypeOf(e)?function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}(0|t,e,e.length,0):function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t.charCodeAt(a))];return-1^e}(0|t,e,e.length,0):0}},{"./utils":32}],5:[function(e,t,r){"use strict";r.base64=!1,r.binary=!1,r.dir=!1,r.createFolders=!0,r.date=null,r.compression=null,r.compressionOptions=null,r.comment=null,r.unixPermissions=null,r.dosPermissions=null},{}],6:[function(e,t,r){"use strict";var n=null;n="undefined"!=typeof Promise?Promise:e("lie"),t.exports={Promise:n}},{lie:37}],7:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,i=e("pako"),s=e("./utils"),a=e("./stream/GenericWorker"),o=n?"uint8array":"array";function h(e,t){a.call(this,"FlateWorker/"+e),this._pako=null,this._pakoAction=e,this._pakoOptions=t,this.meta={}}r.magic="\b\0",s.inherits(h,a),h.prototype.processChunk=function(e){this.meta=e.meta,null===this._pako&&this._createPako(),this._pako.push(s.transformTo(o,e.data),!1)},h.prototype.flush=function(){a.prototype.flush.call(this),null===this._pako&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){a.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var t=this;this._pako.onData=function(e){t.push({data:e,meta:t.meta})}},r.compressWorker=function(e){return new h("Deflate",e)},r.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(e,t,r){"use strict";function A(e,t){var r,n="";for(r=0;r<t;r++)n+=String.fromCharCode(255&e),e>>>=8;return n}function n(e,t,r,n,i,s){var a,o,h=e.file,u=e.compression,l=s!==O.utf8encode,f=I.transformTo("string",s(h.name)),c=I.transformTo("string",O.utf8encode(h.name)),d=h.comment,p=I.transformTo("string",s(d)),m=I.transformTo("string",O.utf8encode(d)),_=c.length!==h.name.length,g=m.length!==d.length,b="",v="",y="",w=h.dir,k=h.date,x={crc32:0,compressedSize:0,uncompressedSize:0};t&&!r||(x.crc32=e.crc32,x.compressedSize=e.compressedSize,x.uncompressedSize=e.uncompressedSize);var S=0;t&&(S|=8),l||!_&&!g||(S|=2048);var z=0,C=0;w&&(z|=16),"UNIX"===i?(C=798,z|=function(e,t){var r=e;return e||(r=t?16893:33204),(65535&r)<<16}(h.unixPermissions,w)):(C=20,z|=function(e){return 63&(e||0)}(h.dosPermissions)),a=k.getUTCHours(),a<<=6,a|=k.getUTCMinutes(),a<<=5,a|=k.getUTCSeconds()/2,o=k.getUTCFullYear()-1980,o<<=4,o|=k.getUTCMonth()+1,o<<=5,o|=k.getUTCDate(),_&&(v=A(1,1)+A(B(f),4)+c,b+="up"+A(v.length,2)+v),g&&(y=A(1,1)+A(B(p),4)+m,b+="uc"+A(y.length,2)+y);var E="";return E+="\n\0",E+=A(S,2),E+=u.magic,E+=A(a,2),E+=A(o,2),E+=A(x.crc32,4),E+=A(x.compressedSize,4),E+=A(x.uncompressedSize,4),E+=A(f.length,2),E+=A(b.length,2),{fileRecord:R.LOCAL_FILE_HEADER+E+f+b,dirRecord:R.CENTRAL_FILE_HEADER+A(C,2)+E+A(p.length,2)+"\0\0\0\0"+A(z,4)+A(n,4)+f+b+p}}var I=e("../utils"),i=e("../stream/GenericWorker"),O=e("../utf8"),B=e("../crc32"),R=e("../signature");function s(e,t,r,n){i.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=t,this.zipPlatform=r,this.encodeFileName=n,this.streamFiles=e,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}I.inherits(s,i),s.prototype.push=function(e){var t=e.meta.percent||0,r=this.entriesCount,n=this._sources.length;this.accumulate?this.contentBuffer.push(e):(this.bytesWritten+=e.data.length,i.prototype.push.call(this,{data:e.data,meta:{currentFile:this.currentFile,percent:r?(t+100*(r-n-1))/r:100}}))},s.prototype.openedSource=function(e){this.currentSourceOffset=this.bytesWritten,this.currentFile=e.file.name;var t=this.streamFiles&&!e.file.dir;if(t){var r=n(e,t,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:r.fileRecord,meta:{percent:0}})}else this.accumulate=!0},s.prototype.closedSource=function(e){this.accumulate=!1;var t=this.streamFiles&&!e.file.dir,r=n(e,t,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(r.dirRecord),t)this.push({data:function(e){return R.DATA_DESCRIPTOR+A(e.crc32,4)+A(e.compressedSize,4)+A(e.uncompressedSize,4)}(e),meta:{percent:100}});else for(this.push({data:r.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},s.prototype.flush=function(){for(var e=this.bytesWritten,t=0;t<this.dirRecords.length;t++)this.push({data:this.dirRecords[t],meta:{percent:100}});var r=this.bytesWritten-e,n=function(e,t,r,n,i){var s=I.transformTo("string",i(n));return R.CENTRAL_DIRECTORY_END+"\0\0\0\0"+A(e,2)+A(e,2)+A(t,4)+A(r,4)+A(s.length,2)+s}(this.dirRecords.length,r,e,this.zipComment,this.encodeFileName);this.push({data:n,meta:{percent:100}})},s.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},s.prototype.registerPrevious=function(e){this._sources.push(e);var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.closedSource(t.previous.streamInfo),t._sources.length?t.prepareNextSource():t.end()}),e.on("error",function(e){t.error(e)}),this},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},s.prototype.error=function(e){var t=this._sources;if(!i.prototype.error.call(this,e))return!1;for(var r=0;r<t.length;r++)try{t[r].error(e)}catch(e){}return!0},s.prototype.lock=function(){i.prototype.lock.call(this);for(var e=this._sources,t=0;t<e.length;t++)e[t].lock()},t.exports=s},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(e,t,r){"use strict";var u=e("../compressions"),n=e("./ZipFileWorker");r.generateWorker=function(e,a,t){var o=new n(a.streamFiles,t,a.platform,a.encodeFileName),h=0;try{e.forEach(function(e,t){h++;var r=function(e,t){var r=e||t,n=u[r];if(!n)throw new Error(r+" is not a valid compression method !");return n}(t.options.compression,a.compression),n=t.options.compressionOptions||a.compressionOptions||{},i=t.dir,s=t.date;t._compressWorker(r,n).withStreamInfo("file",{name:e,dir:i,date:s,comment:t.comment||"",unixPermissions:t.unixPermissions,dosPermissions:t.dosPermissions}).pipe(o)}),o.entriesCount=h}catch(e){o.error(e)}return o}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(e,t,r){"use strict";function n(){if(!(this instanceof n))return new n;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var e=new n;for(var t in this)"function"!=typeof this[t]&&(e[t]=this[t]);return e}}(n.prototype=e("./object")).loadAsync=e("./load"),n.support=e("./support"),n.defaults=e("./defaults"),n.version="3.10.1",n.loadAsync=function(e,t){return(new n).loadAsync(e,t)},n.external=e("./external"),t.exports=n},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(e,t,r){"use strict";var u=e("./utils"),i=e("./external"),n=e("./utf8"),s=e("./zipEntries"),a=e("./stream/Crc32Probe"),l=e("./nodejsUtils");function f(n){return new i.Promise(function(e,t){var r=n.decompressed.getContentWorker().pipe(new a);r.on("error",function(e){t(e)}).on("end",function(){r.streamInfo.crc32!==n.decompressed.crc32?t(new Error("Corrupted zip : CRC32 mismatch")):e()}).resume()})}t.exports=function(e,o){var h=this;return o=u.extend(o||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:n.utf8decode}),l.isNode&&l.isStream(e)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):u.prepareContent("the loaded zip file",e,!0,o.optimizedBinaryString,o.base64).then(function(e){var t=new s(o);return t.load(e),t}).then(function(e){var t=[i.Promise.resolve(e)],r=e.files;if(o.checkCRC32)for(var n=0;n<r.length;n++)t.push(f(r[n]));return i.Promise.all(t)}).then(function(e){for(var t=e.shift(),r=t.files,n=0;n<r.length;n++){var i=r[n],s=i.fileNameStr,a=u.resolve(i.fileNameStr);h.file(a,i.decompressed,{binary:!0,optimizedBinaryString:!0,date:i.date,dir:i.dir,comment:i.fileCommentStr.length?i.fileCommentStr:null,unixPermissions:i.unixPermissions,dosPermissions:i.dosPermissions,createFolders:o.createFolders}),i.dir||(h.file(a).unsafeOriginalName=s)}return t.zipComment.length&&(h.comment=t.zipComment),h})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../stream/GenericWorker");function s(e,t){i.call(this,"Nodejs stream input adapter for "+e),this._upstreamEnded=!1,this._bindStream(t)}n.inherits(s,i),s.prototype._bindStream=function(e){var t=this;(this._stream=e).pause(),e.on("data",function(e){t.push({data:e,meta:{percent:0}})}).on("error",function(e){t.isPaused?this.generatedError=e:t.error(e)}).on("end",function(){t.isPaused?t._upstreamEnded=!0:t.end()})},s.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},t.exports=s},{"../stream/GenericWorker":28,"../utils":32}],13:[function(e,t,r){"use strict";var i=e("readable-stream").Readable;function n(e,t,r){i.call(this,t),this._helper=e;var n=this;e.on("data",function(e,t){n.push(e)||n._helper.pause(),r&&r(t)}).on("error",function(e){n.emit("error",e)}).on("end",function(){n.push(null)})}e("../utils").inherits(n,i),n.prototype._read=function(){this._helper.resume()},t.exports=n},{"../utils":32,"readable-stream":16}],14:[function(e,t,r){"use strict";t.exports={isNode:"undefined"!=typeof Buffer,newBufferFrom:function(e,t){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(e,t);if("number"==typeof e)throw new Error('The "data" argument must not be a number');return new Buffer(e,t)},allocBuffer:function(e){if(Buffer.alloc)return Buffer.alloc(e);var t=new Buffer(e);return t.fill(0),t},isBuffer:function(e){return Buffer.isBuffer(e)},isStream:function(e){return e&&"function"==typeof e.on&&"function"==typeof e.pause&&"function"==typeof e.resume}}},{}],15:[function(e,t,r){"use strict";function s(e,t,r){var n,i=u.getTypeOf(t),s=u.extend(r||{},f);s.date=s.date||new Date,null!==s.compression&&(s.compression=s.compression.toUpperCase()),"string"==typeof s.unixPermissions&&(s.unixPermissions=parseInt(s.unixPermissions,8)),s.unixPermissions&&16384&s.unixPermissions&&(s.dir=!0),s.dosPermissions&&16&s.dosPermissions&&(s.dir=!0),s.dir&&(e=g(e)),s.createFolders&&(n=_(e))&&b.call(this,n,!0);var a="string"===i&&!1===s.binary&&!1===s.base64;r&&void 0!==r.binary||(s.binary=!a),(t instanceof c&&0===t.uncompressedSize||s.dir||!t||0===t.length)&&(s.base64=!1,s.binary=!0,t="",s.compression="STORE",i="string");var o=null;o=t instanceof c||t instanceof l?t:p.isNode&&p.isStream(t)?new m(e,t):u.prepareContent(e,t,s.binary,s.optimizedBinaryString,s.base64);var h=new d(e,o,s);this.files[e]=h}var i=e("./utf8"),u=e("./utils"),l=e("./stream/GenericWorker"),a=e("./stream/StreamHelper"),f=e("./defaults"),c=e("./compressedObject"),d=e("./zipObject"),o=e("./generate"),p=e("./nodejsUtils"),m=e("./nodejs/NodejsStreamInputAdapter"),_=function(e){"/"===e.slice(-1)&&(e=e.substring(0,e.length-1));var t=e.lastIndexOf("/");return 0<t?e.substring(0,t):""},g=function(e){return"/"!==e.slice(-1)&&(e+="/"),e},b=function(e,t){return t=void 0!==t?t:f.createFolders,e=g(e),this.files[e]||s.call(this,e,null,{dir:!0,createFolders:t}),this.files[e]};function h(e){return"[object RegExp]"===Object.prototype.toString.call(e)}var n={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(e){var t,r,n;for(t in this.files)n=this.files[t],(r=t.slice(this.root.length,t.length))&&t.slice(0,this.root.length)===this.root&&e(r,n)},filter:function(r){var n=[];return this.forEach(function(e,t){r(e,t)&&n.push(t)}),n},file:function(e,t,r){if(1!==arguments.length)return e=this.root+e,s.call(this,e,t,r),this;if(h(e)){var n=e;return this.filter(function(e,t){return!t.dir&&n.test(e)})}var i=this.files[this.root+e];return i&&!i.dir?i:null},folder:function(r){if(!r)return this;if(h(r))return this.filter(function(e,t){return t.dir&&r.test(e)});var e=this.root+r,t=b.call(this,e),n=this.clone();return n.root=t.name,n},remove:function(r){r=this.root+r;var e=this.files[r];if(e||("/"!==r.slice(-1)&&(r+="/"),e=this.files[r]),e&&!e.dir)delete this.files[r];else for(var t=this.filter(function(e,t){return t.name.slice(0,r.length)===r}),n=0;n<t.length;n++)delete this.files[t[n].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(e){var t,r={};try{if((r=u.extend(e||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=r.type.toLowerCase(),r.compression=r.compression.toUpperCase(),"binarystring"===r.type&&(r.type="string"),!r.type)throw new Error("No output type specified.");u.checkSupport(r.type),"darwin"!==r.platform&&"freebsd"!==r.platform&&"linux"!==r.platform&&"sunos"!==r.platform||(r.platform="UNIX"),"win32"===r.platform&&(r.platform="DOS");var n=r.comment||this.comment||"";t=o.generateWorker(this,r,n)}catch(e){(t=new l("error")).error(e)}return new a(t,r.type||"string",r.mimeType)},generateAsync:function(e,t){return this.generateInternalStream(e).accumulate(t)},generateNodeStream:function(e,t){return(e=e||{}).type||(e.type="nodebuffer"),this.generateInternalStream(e).toNodejsStream(t)}};t.exports=n},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(e,t,r){"use strict";t.exports=e("stream")},{stream:void 0}],17:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e);for(var t=0;t<this.data.length;t++)e[t]=255&e[t]}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data[this.zero+e]},i.prototype.lastIndexOfSignature=function(e){for(var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.length-4;0<=s;--s)if(this.data[s]===t&&this.data[s+1]===r&&this.data[s+2]===n&&this.data[s+3]===i)return s-this.zero;return-1},i.prototype.readAndCheckSignature=function(e){var t=e.charCodeAt(0),r=e.charCodeAt(1),n=e.charCodeAt(2),i=e.charCodeAt(3),s=this.readData(4);return t===s[0]&&r===s[1]&&n===s[2]&&i===s[3]},i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return[];var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],18:[function(e,t,r){"use strict";var n=e("../utils");function i(e){this.data=e,this.length=e.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(e){this.checkIndex(this.index+e)},checkIndex:function(e){if(this.length<this.zero+e||e<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+e+"). Corrupted zip ?")},setIndex:function(e){this.checkIndex(e),this.index=e},skip:function(e){this.setIndex(this.index+e)},byteAt:function(){},readInt:function(e){var t,r=0;for(this.checkOffset(e),t=this.index+e-1;t>=this.index;t--)r=(r<<8)+this.byteAt(t);return this.index+=e,r},readString:function(e){return n.transformTo("string",this.readData(e))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var e=this.readInt(4);return new Date(Date.UTC(1980+(e>>25&127),(e>>21&15)-1,e>>16&31,e>>11&31,e>>5&63,(31&e)<<1))}},t.exports=i},{"../utils":32}],19:[function(e,t,r){"use strict";var n=e("./Uint8ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(e,t,r){"use strict";var n=e("./DataReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.byteAt=function(e){return this.data.charCodeAt(this.zero+e)},i.prototype.lastIndexOfSignature=function(e){return this.data.lastIndexOf(e)-this.zero},i.prototype.readAndCheckSignature=function(e){return e===this.readData(4)},i.prototype.readData=function(e){this.checkOffset(e);var t=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./DataReader":18}],21:[function(e,t,r){"use strict";var n=e("./ArrayReader");function i(e){n.call(this,e)}e("../utils").inherits(i,n),i.prototype.readData=function(e){if(this.checkOffset(e),0===e)return new Uint8Array(0);var t=this.data.subarray(this.zero+this.index,this.zero+this.index+e);return this.index+=e,t},t.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(e,t,r){"use strict";var n=e("../utils"),i=e("../support"),s=e("./ArrayReader"),a=e("./StringReader"),o=e("./NodeBufferReader"),h=e("./Uint8ArrayReader");t.exports=function(e){var t=n.getTypeOf(e);return n.checkSupport(t),"string"!==t||i.uint8array?"nodebuffer"===t?new o(e):i.uint8array?new h(n.transformTo("uint8array",e)):new s(n.transformTo("array",e)):new a(e)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(e,t,r){"use strict";r.LOCAL_FILE_HEADER="PK",r.CENTRAL_FILE_HEADER="PK",r.CENTRAL_DIRECTORY_END="PK",r.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",r.ZIP64_CENTRAL_DIRECTORY_END="PK",r.DATA_DESCRIPTOR="PK\b"},{}],24:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../utils");function s(e){n.call(this,"ConvertWorker to "+e),this.destType=e}i.inherits(s,n),s.prototype.processChunk=function(e){this.push({data:i.transformTo(this.destType,e.data),meta:e.meta})},t.exports=s},{"../utils":32,"./GenericWorker":28}],25:[function(e,t,r){"use strict";var n=e("./GenericWorker"),i=e("../crc32");function s(){n.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}e("../utils").inherits(s,n),s.prototype.processChunk=function(e){this.streamInfo.crc32=i(e.data,this.streamInfo.crc32||0),this.push(e)},t.exports=s},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataLengthProbe for "+e),this.propName=e,this.withStreamInfo(e,0)}n.inherits(s,i),s.prototype.processChunk=function(e){if(e){var t=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=t+e.data.length}i.prototype.processChunk.call(this,e)},t.exports=s},{"../utils":32,"./GenericWorker":28}],27:[function(e,t,r){"use strict";var n=e("../utils"),i=e("./GenericWorker");function s(e){i.call(this,"DataWorker");var t=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,e.then(function(e){t.dataIsReady=!0,t.data=e,t.max=e&&e.length||0,t.type=n.getTypeOf(e),t.isPaused||t._tickAndRepeat()},function(e){t.error(e)})}n.inherits(s,i),s.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},s.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,n.delay(this._tickAndRepeat,[],this)),!0)},s.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(n.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},s.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var e=null,t=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":e=this.data.substring(this.index,t);break;case"uint8array":e=this.data.subarray(this.index,t);break;case"array":case"nodebuffer":e=this.data.slice(this.index,t)}return this.index=t,this.push({data:e,meta:{percent:this.max?this.index/this.max*100:0}})},t.exports=s},{"../utils":32,"./GenericWorker":28}],28:[function(e,t,r){"use strict";function n(e){this.name=e||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}n.prototype={push:function(e){this.emit("data",e)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(e){this.emit("error",e)}return!0},error:function(e){return!this.isFinished&&(this.isPaused?this.generatedError=e:(this.isFinished=!0,this.emit("error",e),this.previous&&this.previous.error(e),this.cleanUp()),!0)},on:function(e,t){return this._listeners[e].push(t),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(e,t){if(this._listeners[e])for(var r=0;r<this._listeners[e].length;r++)this._listeners[e][r].call(this,t)},pipe:function(e){return e.registerPrevious(this)},registerPrevious:function(e){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=e.streamInfo,this.mergeStreamInfo(),this.previous=e;var t=this;return e.on("data",function(e){t.processChunk(e)}),e.on("end",function(){t.end()}),e.on("error",function(e){t.error(e)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var e=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),e=!0),this.previous&&this.previous.resume(),!e},flush:function(){},processChunk:function(e){this.push(e)},withStreamInfo:function(e,t){return this.extraStreamInfo[e]=t,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var e in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,e)&&(this.streamInfo[e]=this.extraStreamInfo[e])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var e="Worker "+this.name;return this.previous?this.previous+" -> "+e:e}},t.exports=n},{}],29:[function(e,t,r){"use strict";var h=e("../utils"),i=e("./ConvertWorker"),s=e("./GenericWorker"),u=e("../base64"),n=e("../support"),a=e("../external"),o=null;if(n.nodestream)try{o=e("../nodejs/NodejsStreamOutputAdapter")}catch(e){}function l(e,o){return new a.Promise(function(t,r){var n=[],i=e._internalType,s=e._outputType,a=e._mimeType;e.on("data",function(e,t){n.push(e),o&&o(t)}).on("error",function(e){n=[],r(e)}).on("end",function(){try{var e=function(e,t,r){switch(e){case"blob":return h.newBlob(h.transformTo("arraybuffer",t),r);case"base64":return u.encode(t);default:return h.transformTo(e,t)}}(s,function(e,t){var r,n=0,i=null,s=0;for(r=0;r<t.length;r++)s+=t[r].length;switch(e){case"string":return t.join("");case"array":return Array.prototype.concat.apply([],t);case"uint8array":for(i=new Uint8Array(s),r=0;r<t.length;r++)i.set(t[r],n),n+=t[r].length;return i;case"nodebuffer":return Buffer.concat(t);default:throw new Error("concat : unsupported type '"+e+"'")}}(i,n),a);t(e)}catch(e){r(e)}n=[]}).resume()})}function f(e,t,r){var n=t;switch(t){case"blob":case"arraybuffer":n="uint8array";break;case"base64":n="string"}try{this._internalType=n,this._outputType=t,this._mimeType=r,h.checkSupport(n),this._worker=e.pipe(new i(n)),e.lock()}catch(e){this._worker=new s("error"),this._worker.error(e)}}f.prototype={accumulate:function(e){return l(this,e)},on:function(e,t){var r=this;return"data"===e?this._worker.on(e,function(e){t.call(r,e.data,e.meta)}):this._worker.on(e,function(){h.delay(t,arguments,r)}),this},resume:function(){return h.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(e){if(h.checkSupport("nodestream"),"nodebuffer"!==this._outputType)throw new Error(this._outputType+" is not supported by this method");return new o(this,{objectMode:"nodebuffer"!==this._outputType},e)}},t.exports=f},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(e,t,r){"use strict";if(r.base64=!0,r.array=!0,r.string=!0,r.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,r.nodebuffer="undefined"!=typeof Buffer,r.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)r.blob=!1;else{var n=new ArrayBuffer(0);try{r.blob=0===new Blob([n],{type:"application/zip"}).size}catch(e){try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(n),r.blob=0===i.getBlob("application/zip").size}catch(e){r.blob=!1}}}try{r.nodestream=!!e("readable-stream").Readable}catch(e){r.nodestream=!1}},{"readable-stream":16}],31:[function(e,t,s){"use strict";for(var o=e("./utils"),h=e("./support"),r=e("./nodejsUtils"),n=e("./stream/GenericWorker"),u=new Array(256),i=0;i<256;i++)u[i]=252<=i?6:248<=i?5:240<=i?4:224<=i?3:192<=i?2:1;u[254]=u[254]=1;function a(){n.call(this,"utf-8 decode"),this.leftOver=null}function l(){n.call(this,"utf-8 encode")}s.utf8encode=function(e){return h.nodebuffer?r.newBufferFrom(e,"utf-8"):function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=h.uint8array?new Uint8Array(o):new Array(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t}(e)},s.utf8decode=function(e){return h.nodebuffer?o.transformTo("nodebuffer",e).toString("utf-8"):function(e){var t,r,n,i,s=e.length,a=new Array(2*s);for(t=r=0;t<s;)if((n=e[t++])<128)a[r++]=n;else if(4<(i=u[n]))a[r++]=65533,t+=i-1;else{for(n&=2===i?31:3===i?15:7;1<i&&t<s;)n=n<<6|63&e[t++],i--;1<i?a[r++]=65533:n<65536?a[r++]=n:(n-=65536,a[r++]=55296|n>>10&1023,a[r++]=56320|1023&n)}return a.length!==r&&(a.subarray?a=a.subarray(0,r):a.length=r),o.applyFromCharCode(a)}(e=o.transformTo(h.uint8array?"uint8array":"array",e))},o.inherits(a,n),a.prototype.processChunk=function(e){var t=o.transformTo(h.uint8array?"uint8array":"array",e.data);if(this.leftOver&&this.leftOver.length){if(h.uint8array){var r=t;(t=new Uint8Array(r.length+this.leftOver.length)).set(this.leftOver,0),t.set(r,this.leftOver.length)}else t=this.leftOver.concat(t);this.leftOver=null}var n=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}(t),i=t;n!==t.length&&(h.uint8array?(i=t.subarray(0,n),this.leftOver=t.subarray(n,t.length)):(i=t.slice(0,n),this.leftOver=t.slice(n,t.length))),this.push({data:s.utf8decode(i),meta:e.meta})},a.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=a,o.inherits(l,n),l.prototype.processChunk=function(e){this.push({data:s.utf8encode(e.data),meta:e.meta})},s.Utf8EncodeWorker=l},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(e,t,a){"use strict";var o=e("./support"),h=e("./base64"),r=e("./nodejsUtils"),u=e("./external");function n(e){return e}function l(e,t){for(var r=0;r<e.length;++r)t[r]=255&e.charCodeAt(r);return t}e("setimmediate"),a.newBlob=function(t,r){a.checkSupport("blob");try{return new Blob([t],{type:r})}catch(e){try{var n=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return n.append(t),n.getBlob(r)}catch(e){throw new Error("Bug : can't construct the Blob.")}}};var i={stringifyByChunk:function(e,t,r){var n=[],i=0,s=e.length;if(s<=r)return String.fromCharCode.apply(null,e);for(;i<s;)"array"===t||"nodebuffer"===t?n.push(String.fromCharCode.apply(null,e.slice(i,Math.min(i+r,s)))):n.push(String.fromCharCode.apply(null,e.subarray(i,Math.min(i+r,s)))),i+=r;return n.join("")},stringifyByChar:function(e){for(var t="",r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t},applyCanBeUsed:{uint8array:function(){try{return o.uint8array&&1===String.fromCharCode.apply(null,new Uint8Array(1)).length}catch(e){return!1}}(),nodebuffer:function(){try{return o.nodebuffer&&1===String.fromCharCode.apply(null,r.allocBuffer(1)).length}catch(e){return!1}}()}};function s(e){var t=65536,r=a.getTypeOf(e),n=!0;if("uint8array"===r?n=i.applyCanBeUsed.uint8array:"nodebuffer"===r&&(n=i.applyCanBeUsed.nodebuffer),n)for(;1<t;)try{return i.stringifyByChunk(e,r,t)}catch(e){t=Math.floor(t/2)}return i.stringifyByChar(e)}function f(e,t){for(var r=0;r<e.length;r++)t[r]=e[r];return t}a.applyFromCharCode=s;var c={};c.string={string:n,array:function(e){return l(e,new Array(e.length))},arraybuffer:function(e){return c.string.uint8array(e).buffer},uint8array:function(e){return l(e,new Uint8Array(e.length))},nodebuffer:function(e){return l(e,r.allocBuffer(e.length))}},c.array={string:s,array:n,arraybuffer:function(e){return new Uint8Array(e).buffer},uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(e)}},c.arraybuffer={string:function(e){return s(new Uint8Array(e))},array:function(e){return f(new Uint8Array(e),new Array(e.byteLength))},arraybuffer:n,uint8array:function(e){return new Uint8Array(e)},nodebuffer:function(e){return r.newBufferFrom(new Uint8Array(e))}},c.uint8array={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return e.buffer},uint8array:n,nodebuffer:function(e){return r.newBufferFrom(e)}},c.nodebuffer={string:s,array:function(e){return f(e,new Array(e.length))},arraybuffer:function(e){return c.nodebuffer.uint8array(e).buffer},uint8array:function(e){return f(e,new Uint8Array(e.length))},nodebuffer:n},a.transformTo=function(e,t){if(t=t||"",!e)return t;a.checkSupport(e);var r=a.getTypeOf(t);return c[r][e](t)},a.resolve=function(e){for(var t=e.split("/"),r=[],n=0;n<t.length;n++){var i=t[n];"."===i||""===i&&0!==n&&n!==t.length-1||(".."===i?r.pop():r.push(i))}return r.join("/")},a.getTypeOf=function(e){return"string"==typeof e?"string":"[object Array]"===Object.prototype.toString.call(e)?"array":o.nodebuffer&&r.isBuffer(e)?"nodebuffer":o.uint8array&&e instanceof Uint8Array?"uint8array":o.arraybuffer&&e instanceof ArrayBuffer?"arraybuffer":void 0},a.checkSupport=function(e){if(!o[e.toLowerCase()])throw new Error(e+" is not supported by this platform")},a.MAX_VALUE_16BITS=65535,a.MAX_VALUE_32BITS=-1,a.pretty=function(e){var t,r,n="";for(r=0;r<(e||"").length;r++)n+="\\x"+((t=e.charCodeAt(r))<16?"0":"")+t.toString(16).toUpperCase();return n},a.delay=function(e,t,r){setImmediate(function(){e.apply(r||null,t||[])})},a.inherits=function(e,t){function r(){}r.prototype=t.prototype,e.prototype=new r},a.extend=function(){var e,t,r={};for(e=0;e<arguments.length;e++)for(t in arguments[e])Object.prototype.hasOwnProperty.call(arguments[e],t)&&void 0===r[t]&&(r[t]=arguments[e][t]);return r},a.prepareContent=function(r,e,n,i,s){return u.Promise.resolve(e).then(function(n){return o.blob&&(n instanceof Blob||-1!==["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(n)))&&"undefined"!=typeof FileReader?new u.Promise(function(t,r){var e=new FileReader;e.onload=function(e){t(e.target.result)},e.onerror=function(e){r(e.target.error)},e.readAsArrayBuffer(n)}):n}).then(function(e){var t=a.getTypeOf(e);return t?("arraybuffer"===t?e=a.transformTo("uint8array",e):"string"===t&&(s?e=h.decode(e):n&&!0!==i&&(e=function(e){return l(e,o.uint8array?new Uint8Array(e.length):new Array(e.length))}(e))),e):u.Promise.reject(new Error("Can't read the data of '"+r+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),i=e("./utils"),s=e("./signature"),a=e("./zipEntry"),o=e("./support");function h(e){this.files=[],this.loadOptions=e}h.prototype={checkSignature:function(e){if(!this.reader.readAndCheckSignature(e)){this.reader.index-=4;var t=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(t)+", expected "+i.pretty(e)+")")}},isSignature:function(e,t){var r=this.reader.index;this.reader.setIndex(e);var n=this.reader.readString(4)===t;return this.reader.setIndex(r),n},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var e=this.reader.readData(this.zipCommentLength),t=o.uint8array?"uint8array":"array",r=i.transformTo(t,e);this.zipComment=this.loadOptions.decodeFileName(r)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var e,t,r,n=this.zip64EndOfCentralSize-44;0<n;)e=this.reader.readInt(2),t=this.reader.readInt(4),r=this.reader.readData(t),this.zip64ExtensibleData[e]={id:e,length:t,value:r}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var e,t;for(e=0;e<this.files.length;e++)t=this.files[e],this.reader.setIndex(t.localHeaderOffset),this.checkSignature(s.LOCAL_FILE_HEADER),t.readLocalPart(this.reader),t.handleUTF8(),t.processAttributes()},readCentralDir:function(){var e;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);)(e=new a({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(e);if(this.centralDirRecords!==this.files.length&&0!==this.centralDirRecords&&0===this.files.length)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var e=this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);if(e<0)throw!this.isSignature(0,s.LOCAL_FILE_HEADER)?new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html"):new Error("Corrupted zip: can't find end of central directory");this.reader.setIndex(e);var t=e;if(this.checkSignature(s.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(e=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(e),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,s.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var r=this.centralDirOffset+this.centralDirSize;this.zip64&&(r+=20,r+=12+this.zip64EndOfCentralSize);var n=t-r;if(0<n)this.isSignature(t,s.CENTRAL_FILE_HEADER)||(this.reader.zero=n);else if(n<0)throw new Error("Corrupted zip: missing "+Math.abs(n)+" bytes.")},prepareReader:function(e){this.reader=n(e)},load:function(e){this.prepareReader(e),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},t.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(e,t,r){"use strict";var n=e("./reader/readerFor"),s=e("./utils"),i=e("./compressedObject"),a=e("./crc32"),o=e("./utf8"),h=e("./compressions"),u=e("./support");function l(e,t){this.options=e,this.loadOptions=t}l.prototype={isEncrypted:function(){return 1==(1&this.bitFlag)},useUTF8:function(){return 2048==(2048&this.bitFlag)},readLocalPart:function(e){var t,r;if(e.skip(22),this.fileNameLength=e.readInt(2),r=e.readInt(2),this.fileName=e.readData(this.fileNameLength),e.skip(r),-1===this.compressedSize||-1===this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if(null===(t=function(e){for(var t in h)if(Object.prototype.hasOwnProperty.call(h,t)&&h[t].magic===e)return h[t];return null}(this.compressionMethod)))throw new Error("Corrupted zip : compression "+s.pretty(this.compressionMethod)+" unknown (inner file : "+s.transformTo("string",this.fileName)+")");this.decompressed=new i(this.compressedSize,this.uncompressedSize,this.crc32,t,e.readData(this.compressedSize))},readCentralPart:function(e){this.versionMadeBy=e.readInt(2),e.skip(2),this.bitFlag=e.readInt(2),this.compressionMethod=e.readString(2),this.date=e.readDate(),this.crc32=e.readInt(4),this.compressedSize=e.readInt(4),this.uncompressedSize=e.readInt(4);var t=e.readInt(2);if(this.extraFieldsLength=e.readInt(2),this.fileCommentLength=e.readInt(2),this.diskNumberStart=e.readInt(2),this.internalFileAttributes=e.readInt(2),this.externalFileAttributes=e.readInt(4),this.localHeaderOffset=e.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");e.skip(t),this.readExtraFields(e),this.parseZIP64ExtraField(e),this.fileComment=e.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var e=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),0==e&&(this.dosPermissions=63&this.externalFileAttributes),3==e&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||"/"!==this.fileNameStr.slice(-1)||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var e=n(this.extraFields[1].value);this.uncompressedSize===s.MAX_VALUE_32BITS&&(this.uncompressedSize=e.readInt(8)),this.compressedSize===s.MAX_VALUE_32BITS&&(this.compressedSize=e.readInt(8)),this.localHeaderOffset===s.MAX_VALUE_32BITS&&(this.localHeaderOffset=e.readInt(8)),this.diskNumberStart===s.MAX_VALUE_32BITS&&(this.diskNumberStart=e.readInt(4))}},readExtraFields:function(e){var t,r,n,i=e.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});e.index+4<i;)t=e.readInt(2),r=e.readInt(2),n=e.readData(r),this.extraFields[t]={id:t,length:r,value:n};e.setIndex(i)},handleUTF8:function(){var e=u.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=o.utf8decode(this.fileName),this.fileCommentStr=o.utf8decode(this.fileComment);else{var t=this.findExtraFieldUnicodePath();if(null!==t)this.fileNameStr=t;else{var r=s.transformTo(e,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(r)}var n=this.findExtraFieldUnicodeComment();if(null!==n)this.fileCommentStr=n;else{var i=s.transformTo(e,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(i)}}},findExtraFieldUnicodePath:function(){var e=this.extraFields[28789];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileName)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null},findExtraFieldUnicodeComment:function(){var e=this.extraFields[25461];if(e){var t=n(e.value);return 1!==t.readInt(1)?null:a(this.fileComment)!==t.readInt(4)?null:o.utf8decode(t.readData(e.length-5))}return null}},t.exports=l},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(e,t,r){"use strict";function n(e,t,r){this.name=e,this.dir=r.dir,this.date=r.date,this.comment=r.comment,this.unixPermissions=r.unixPermissions,this.dosPermissions=r.dosPermissions,this._data=t,this._dataBinary=r.binary,this.options={compression:r.compression,compressionOptions:r.compressionOptions}}var s=e("./stream/StreamHelper"),i=e("./stream/DataWorker"),a=e("./utf8"),o=e("./compressedObject"),h=e("./stream/GenericWorker");n.prototype={internalStream:function(e){var t=null,r="string";try{if(!e)throw new Error("No output type specified.");var n="string"===(r=e.toLowerCase())||"text"===r;"binarystring"!==r&&"text"!==r||(r="string"),t=this._decompressWorker();var i=!this._dataBinary;i&&!n&&(t=t.pipe(new a.Utf8EncodeWorker)),!i&&n&&(t=t.pipe(new a.Utf8DecodeWorker))}catch(e){(t=new h("error")).error(e)}return new s(t,r,"")},async:function(e,t){return this.internalStream(e).accumulate(t)},nodeStream:function(e,t){return this.internalStream(e||"nodebuffer").toNodejsStream(t)},_compressWorker:function(e,t){if(this._data instanceof o&&this._data.compression.magic===e.magic)return this._data.getCompressedWorker();var r=this._decompressWorker();return this._dataBinary||(r=r.pipe(new a.Utf8EncodeWorker)),o.createWorkerFrom(r,e,t)},_decompressWorker:function(){return this._data instanceof o?this._data.getContentWorker():this._data instanceof h?this._data:new i(this._data)}};for(var u=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],l=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},f=0;f<u.length;f++)n.prototype[u[f]]=l;t.exports=n},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(e,l,t){(function(t){"use strict";var r,n,e=t.MutationObserver||t.WebKitMutationObserver;if(e){var i=0,s=new e(u),a=t.document.createTextNode("");s.observe(a,{characterData:!0}),r=function(){a.data=i=++i%2}}else if(t.setImmediate||void 0===t.MessageChannel)r="document"in t&&"onreadystatechange"in t.document.createElement("script")?function(){var e=t.document.createElement("script");e.onreadystatechange=function(){u(),e.onreadystatechange=null,e.parentNode.removeChild(e),e=null},t.document.documentElement.appendChild(e)}:function(){setTimeout(u,0)};else{var o=new t.MessageChannel;o.port1.onmessage=u,r=function(){o.port2.postMessage(0)}}var h=[];function u(){var e,t;n=!0;for(var r=h.length;r;){for(t=h,h=[],e=-1;++e<r;)t[e]();r=h.length}n=!1}l.exports=function(e){1!==h.push(e)||n||r()}}).call(this,"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],37:[function(e,t,r){"use strict";var i=e("immediate");function u(){}var l={},s=["REJECTED"],a=["FULFILLED"],n=["PENDING"];function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=n,this.queue=[],this.outcome=void 0,e!==u&&d(this,e)}function h(e,t,r){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof r&&(this.onRejected=r,this.callRejected=this.otherCallRejected)}function f(t,r,n){i(function(){var e;try{e=r(n)}catch(e){return l.reject(t,e)}e===t?l.reject(t,new TypeError("Cannot resolve promise with itself")):l.resolve(t,e)})}function c(e){var t=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof t)return function(){t.apply(e,arguments)}}function d(t,e){var r=!1;function n(e){r||(r=!0,l.reject(t,e))}function i(e){r||(r=!0,l.resolve(t,e))}var s=p(function(){e(i,n)});"error"===s.status&&n(s.value)}function p(e,t){var r={};try{r.value=e(t),r.status="success"}catch(e){r.status="error",r.value=e}return r}(t.exports=o).prototype.finally=function(t){if("function"!=typeof t)return this;var r=this.constructor;return this.then(function(e){return r.resolve(t()).then(function(){return e})},function(e){return r.resolve(t()).then(function(){throw e})})},o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===a||"function"!=typeof t&&this.state===s)return this;var r=new this.constructor(u);this.state!==n?f(r,this.state===a?e:t,this.outcome):this.queue.push(new h(r,e,t));return r},h.prototype.callFulfilled=function(e){l.resolve(this.promise,e)},h.prototype.otherCallFulfilled=function(e){f(this.promise,this.onFulfilled,e)},h.prototype.callRejected=function(e){l.reject(this.promise,e)},h.prototype.otherCallRejected=function(e){f(this.promise,this.onRejected,e)},l.resolve=function(e,t){var r=p(c,t);if("error"===r.status)return l.reject(e,r.value);var n=r.value;if(n)d(e,n);else{e.state=a,e.outcome=t;for(var i=-1,s=e.queue.length;++i<s;)e.queue[i].callFulfilled(t)}return e},l.reject=function(e,t){e.state=s,e.outcome=t;for(var r=-1,n=e.queue.length;++r<n;)e.queue[r].callRejected(t);return e},o.resolve=function(e){if(e instanceof this)return e;return l.resolve(new this(u),e)},o.reject=function(e){var t=new this(u);return l.reject(t,e)},o.all=function(e){var r=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var n=e.length,i=!1;if(!n)return this.resolve([]);var s=new Array(n),a=0,t=-1,o=new this(u);for(;++t<n;)h(e[t],t);return o;function h(e,t){r.resolve(e).then(function(e){s[t]=e,++a!==n||i||(i=!0,l.resolve(o,s))},function(e){i||(i=!0,l.reject(o,e))})}},o.race=function(e){var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var r=e.length,n=!1;if(!r)return this.resolve([]);var i=-1,s=new this(u);for(;++i<r;)a=e[i],t.resolve(a).then(function(e){n||(n=!0,l.resolve(s,e))},function(e){n||(n=!0,l.reject(s,e))});var a;return s}},{immediate:36}],38:[function(e,t,r){"use strict";var n={};(0,e("./lib/utils/common").assign)(n,e("./lib/deflate"),e("./lib/inflate"),e("./lib/zlib/constants")),t.exports=n},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(e,t,r){"use strict";var a=e("./zlib/deflate"),o=e("./utils/common"),h=e("./utils/strings"),i=e("./zlib/messages"),s=e("./zlib/zstream"),u=Object.prototype.toString,l=0,f=-1,c=0,d=8;function p(e){if(!(this instanceof p))return new p(e);this.options=o.assign({level:f,method:d,chunkSize:16384,windowBits:15,memLevel:8,strategy:c,to:""},e||{});var t=this.options;t.raw&&0<t.windowBits?t.windowBits=-t.windowBits:t.gzip&&0<t.windowBits&&t.windowBits<16&&(t.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new s,this.strm.avail_out=0;var r=a.deflateInit2(this.strm,t.level,t.method,t.windowBits,t.memLevel,t.strategy);if(r!==l)throw new Error(i[r]);if(t.header&&a.deflateSetHeader(this.strm,t.header),t.dictionary){var n;if(n="string"==typeof t.dictionary?h.string2buf(t.dictionary):"[object ArrayBuffer]"===u.call(t.dictionary)?new Uint8Array(t.dictionary):t.dictionary,(r=a.deflateSetDictionary(this.strm,n))!==l)throw new Error(i[r]);this._dict_set=!0}}function n(e,t){var r=new p(t);if(r.push(e,!0),r.err)throw r.msg||i[r.err];return r.result}p.prototype.push=function(e,t){var r,n,i=this.strm,s=this.options.chunkSize;if(this.ended)return!1;n=t===~~t?t:!0===t?4:0,"string"==typeof e?i.input=h.string2buf(e):"[object ArrayBuffer]"===u.call(e)?i.input=new Uint8Array(e):i.input=e,i.next_in=0,i.avail_in=i.input.length;do{if(0===i.avail_out&&(i.output=new o.Buf8(s),i.next_out=0,i.avail_out=s),1!==(r=a.deflate(i,n))&&r!==l)return this.onEnd(r),!(this.ended=!0);0!==i.avail_out&&(0!==i.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(h.buf2binstring(o.shrinkBuf(i.output,i.next_out))):this.onData(o.shrinkBuf(i.output,i.next_out)))}while((0<i.avail_in||0===i.avail_out)&&1!==r);return 4===n?(r=a.deflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===l):2!==n||(this.onEnd(l),!(i.avail_out=0))},p.prototype.onData=function(e){this.chunks.push(e)},p.prototype.onEnd=function(e){e===l&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=o.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Deflate=p,r.deflate=n,r.deflateRaw=function(e,t){return(t=t||{}).raw=!0,n(e,t)},r.gzip=function(e,t){return(t=t||{}).gzip=!0,n(e,t)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(e,t,r){"use strict";var c=e("./zlib/inflate"),d=e("./utils/common"),p=e("./utils/strings"),m=e("./zlib/constants"),n=e("./zlib/messages"),i=e("./zlib/zstream"),s=e("./zlib/gzheader"),_=Object.prototype.toString;function a(e){if(!(this instanceof a))return new a(e);this.options=d.assign({chunkSize:16384,windowBits:0,to:""},e||{});var t=this.options;t.raw&&0<=t.windowBits&&t.windowBits<16&&(t.windowBits=-t.windowBits,0===t.windowBits&&(t.windowBits=-15)),!(0<=t.windowBits&&t.windowBits<16)||e&&e.windowBits||(t.windowBits+=32),15<t.windowBits&&t.windowBits<48&&0==(15&t.windowBits)&&(t.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var r=c.inflateInit2(this.strm,t.windowBits);if(r!==m.Z_OK)throw new Error(n[r]);this.header=new s,c.inflateGetHeader(this.strm,this.header)}function o(e,t){var r=new a(t);if(r.push(e,!0),r.err)throw r.msg||n[r.err];return r.result}a.prototype.push=function(e,t){var r,n,i,s,a,o,h=this.strm,u=this.options.chunkSize,l=this.options.dictionary,f=!1;if(this.ended)return!1;n=t===~~t?t:!0===t?m.Z_FINISH:m.Z_NO_FLUSH,"string"==typeof e?h.input=p.binstring2buf(e):"[object ArrayBuffer]"===_.call(e)?h.input=new Uint8Array(e):h.input=e,h.next_in=0,h.avail_in=h.input.length;do{if(0===h.avail_out&&(h.output=new d.Buf8(u),h.next_out=0,h.avail_out=u),(r=c.inflate(h,m.Z_NO_FLUSH))===m.Z_NEED_DICT&&l&&(o="string"==typeof l?p.string2buf(l):"[object ArrayBuffer]"===_.call(l)?new Uint8Array(l):l,r=c.inflateSetDictionary(this.strm,o)),r===m.Z_BUF_ERROR&&!0===f&&(r=m.Z_OK,f=!1),r!==m.Z_STREAM_END&&r!==m.Z_OK)return this.onEnd(r),!(this.ended=!0);h.next_out&&(0!==h.avail_out&&r!==m.Z_STREAM_END&&(0!==h.avail_in||n!==m.Z_FINISH&&n!==m.Z_SYNC_FLUSH)||("string"===this.options.to?(i=p.utf8border(h.output,h.next_out),s=h.next_out-i,a=p.buf2string(h.output,i),h.next_out=s,h.avail_out=u-s,s&&d.arraySet(h.output,h.output,i,s,0),this.onData(a)):this.onData(d.shrinkBuf(h.output,h.next_out)))),0===h.avail_in&&0===h.avail_out&&(f=!0)}while((0<h.avail_in||0===h.avail_out)&&r!==m.Z_STREAM_END);return r===m.Z_STREAM_END&&(n=m.Z_FINISH),n===m.Z_FINISH?(r=c.inflateEnd(this.strm),this.onEnd(r),this.ended=!0,r===m.Z_OK):n!==m.Z_SYNC_FLUSH||(this.onEnd(m.Z_OK),!(h.avail_out=0))},a.prototype.onData=function(e){this.chunks.push(e)},a.prototype.onEnd=function(e){e===m.Z_OK&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=d.flattenChunks(this.chunks)),this.chunks=[],this.err=e,this.msg=this.strm.msg},r.Inflate=a,r.inflate=o,r.inflateRaw=function(e,t){return(t=t||{}).raw=!0,o(e,t)},r.ungzip=o},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(e,t,r){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;r.assign=function(e){for(var t=Array.prototype.slice.call(arguments,1);t.length;){var r=t.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var n in r)r.hasOwnProperty(n)&&(e[n]=r[n])}}return e},r.shrinkBuf=function(e,t){return e.length===t?e:e.subarray?e.subarray(0,t):(e.length=t,e)};var i={arraySet:function(e,t,r,n,i){if(t.subarray&&e.subarray)e.set(t.subarray(r,r+n),i);else for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){var t,r,n,i,s,a;for(t=n=0,r=e.length;t<r;t++)n+=e[t].length;for(a=new Uint8Array(n),t=i=0,r=e.length;t<r;t++)s=e[t],a.set(s,i),i+=s.length;return a}},s={arraySet:function(e,t,r,n,i){for(var s=0;s<n;s++)e[i+s]=t[r+s]},flattenChunks:function(e){return[].concat.apply([],e)}};r.setTyped=function(e){e?(r.Buf8=Uint8Array,r.Buf16=Uint16Array,r.Buf32=Int32Array,r.assign(r,i)):(r.Buf8=Array,r.Buf16=Array,r.Buf32=Array,r.assign(r,s))},r.setTyped(n)},{}],42:[function(e,t,r){"use strict";var h=e("./common"),i=!0,s=!0;try{String.fromCharCode.apply(null,[0])}catch(e){i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(e){s=!1}for(var u=new h.Buf8(256),n=0;n<256;n++)u[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function l(e,t){if(t<65537&&(e.subarray&&s||!e.subarray&&i))return String.fromCharCode.apply(null,h.shrinkBuf(e,t));for(var r="",n=0;n<t;n++)r+=String.fromCharCode(e[n]);return r}u[254]=u[254]=1,r.string2buf=function(e){var t,r,n,i,s,a=e.length,o=0;for(i=0;i<a;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),o+=r<128?1:r<2048?2:r<65536?3:4;for(t=new h.Buf8(o),i=s=0;s<o;i++)55296==(64512&(r=e.charCodeAt(i)))&&i+1<a&&56320==(64512&(n=e.charCodeAt(i+1)))&&(r=65536+(r-55296<<10)+(n-56320),i++),r<128?t[s++]=r:(r<2048?t[s++]=192|r>>>6:(r<65536?t[s++]=224|r>>>12:(t[s++]=240|r>>>18,t[s++]=128|r>>>12&63),t[s++]=128|r>>>6&63),t[s++]=128|63&r);return t},r.buf2binstring=function(e){return l(e,e.length)},r.binstring2buf=function(e){for(var t=new h.Buf8(e.length),r=0,n=t.length;r<n;r++)t[r]=e.charCodeAt(r);return t},r.buf2string=function(e,t){var r,n,i,s,a=t||e.length,o=new Array(2*a);for(r=n=0;r<a;)if((i=e[r++])<128)o[n++]=i;else if(4<(s=u[i]))o[n++]=65533,r+=s-1;else{for(i&=2===s?31:3===s?15:7;1<s&&r<a;)i=i<<6|63&e[r++],s--;1<s?o[n++]=65533:i<65536?o[n++]=i:(i-=65536,o[n++]=55296|i>>10&1023,o[n++]=56320|1023&i)}return l(o,n)},r.utf8border=function(e,t){var r;for((t=t||e.length)>e.length&&(t=e.length),r=t-1;0<=r&&128==(192&e[r]);)r--;return r<0?t:0===r?t:r+u[e[r]]>t?r:t}},{"./common":41}],43:[function(e,t,r){"use strict";t.exports=function(e,t,r,n){for(var i=65535&e|0,s=e>>>16&65535|0,a=0;0!==r;){for(r-=a=2e3<r?2e3:r;s=s+(i=i+t[n++]|0)|0,--a;);i%=65521,s%=65521}return i|s<<16|0}},{}],44:[function(e,t,r){"use strict";t.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(e,t,r){"use strict";var o=function(){for(var e,t=[],r=0;r<256;r++){e=r;for(var n=0;n<8;n++)e=1&e?3988292384^e>>>1:e>>>1;t[r]=e}return t}();t.exports=function(e,t,r,n){var i=o,s=n+r;e^=-1;for(var a=n;a<s;a++)e=e>>>8^i[255&(e^t[a])];return-1^e}},{}],46:[function(e,t,r){"use strict";var h,c=e("../utils/common"),u=e("./trees"),d=e("./adler32"),p=e("./crc32"),n=e("./messages"),l=0,f=4,m=0,_=-2,g=-1,b=4,i=2,v=8,y=9,s=286,a=30,o=19,w=2*s+1,k=15,x=3,S=258,z=S+x+1,C=42,E=113,A=1,I=2,O=3,B=4;function R(e,t){return e.msg=n[t],t}function T(e){return(e<<1)-(4<e?9:0)}function D(e){for(var t=e.length;0<=--t;)e[t]=0}function F(e){var t=e.state,r=t.pending;r>e.avail_out&&(r=e.avail_out),0!==r&&(c.arraySet(e.output,t.pending_buf,t.pending_out,r,e.next_out),e.next_out+=r,t.pending_out+=r,e.total_out+=r,e.avail_out-=r,t.pending-=r,0===t.pending&&(t.pending_out=0))}function N(e,t){u._tr_flush_block(e,0<=e.block_start?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,F(e.strm)}function U(e,t){e.pending_buf[e.pending++]=t}function P(e,t){e.pending_buf[e.pending++]=t>>>8&255,e.pending_buf[e.pending++]=255&t}function L(e,t){var r,n,i=e.max_chain_length,s=e.strstart,a=e.prev_length,o=e.nice_match,h=e.strstart>e.w_size-z?e.strstart-(e.w_size-z):0,u=e.window,l=e.w_mask,f=e.prev,c=e.strstart+S,d=u[s+a-1],p=u[s+a];e.prev_length>=e.good_match&&(i>>=2),o>e.lookahead&&(o=e.lookahead);do{if(u[(r=t)+a]===p&&u[r+a-1]===d&&u[r]===u[s]&&u[++r]===u[s+1]){s+=2,r++;do{}while(u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&u[++s]===u[++r]&&s<c);if(n=S-(c-s),s=c-S,a<n){if(e.match_start=t,o<=(a=n))break;d=u[s+a-1],p=u[s+a]}}}while((t=f[t&l])>h&&0!=--i);return a<=e.lookahead?a:e.lookahead}function j(e){var t,r,n,i,s,a,o,h,u,l,f=e.w_size;do{if(i=e.window_size-e.lookahead-e.strstart,e.strstart>=f+(f-z)){for(c.arraySet(e.window,e.window,f,f,0),e.match_start-=f,e.strstart-=f,e.block_start-=f,t=r=e.hash_size;n=e.head[--t],e.head[t]=f<=n?n-f:0,--r;);for(t=r=f;n=e.prev[--t],e.prev[t]=f<=n?n-f:0,--r;);i+=f}if(0===e.strm.avail_in)break;if(a=e.strm,o=e.window,h=e.strstart+e.lookahead,u=i,l=void 0,l=a.avail_in,u<l&&(l=u),r=0===l?0:(a.avail_in-=l,c.arraySet(o,a.input,a.next_in,l,h),1===a.state.wrap?a.adler=d(a.adler,o,l,h):2===a.state.wrap&&(a.adler=p(a.adler,o,l,h)),a.next_in+=l,a.total_in+=l,l),e.lookahead+=r,e.lookahead+e.insert>=x)for(s=e.strstart-e.insert,e.ins_h=e.window[s],e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+1])&e.hash_mask;e.insert&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[s+x-1])&e.hash_mask,e.prev[s&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=s,s++,e.insert--,!(e.lookahead+e.insert<x)););}while(e.lookahead<z&&0!==e.strm.avail_in)}function Z(e,t){for(var r,n;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!==r&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r)),e.match_length>=x)if(n=u._tr_tally(e,e.strstart-e.match_start,e.match_length-x),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=x){for(e.match_length--;e.strstart++,e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart,0!=--e.match_length;);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.ins_h=e.window[e.strstart],e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+1])&e.hash_mask;else n=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(n&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function W(e,t){for(var r,n,i;;){if(e.lookahead<z){if(j(e),e.lookahead<z&&t===l)return A;if(0===e.lookahead)break}if(r=0,e.lookahead>=x&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=x-1,0!==r&&e.prev_length<e.max_lazy_match&&e.strstart-r<=e.w_size-z&&(e.match_length=L(e,r),e.match_length<=5&&(1===e.strategy||e.match_length===x&&4096<e.strstart-e.match_start)&&(e.match_length=x-1)),e.prev_length>=x&&e.match_length<=e.prev_length){for(i=e.strstart+e.lookahead-x,n=u._tr_tally(e,e.strstart-1-e.prev_match,e.prev_length-x),e.lookahead-=e.prev_length-1,e.prev_length-=2;++e.strstart<=i&&(e.ins_h=(e.ins_h<<e.hash_shift^e.window[e.strstart+x-1])&e.hash_mask,r=e.prev[e.strstart&e.w_mask]=e.head[e.ins_h],e.head[e.ins_h]=e.strstart),0!=--e.prev_length;);if(e.match_available=0,e.match_length=x-1,e.strstart++,n&&(N(e,!1),0===e.strm.avail_out))return A}else if(e.match_available){if((n=u._tr_tally(e,0,e.window[e.strstart-1]))&&N(e,!1),e.strstart++,e.lookahead--,0===e.strm.avail_out)return A}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(n=u._tr_tally(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<x-1?e.strstart:x-1,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}function M(e,t,r,n,i){this.good_length=e,this.max_lazy=t,this.nice_length=r,this.max_chain=n,this.func=i}function H(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new c.Buf16(2*w),this.dyn_dtree=new c.Buf16(2*(2*a+1)),this.bl_tree=new c.Buf16(2*(2*o+1)),D(this.dyn_ltree),D(this.dyn_dtree),D(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new c.Buf16(k+1),this.heap=new c.Buf16(2*s+1),D(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new c.Buf16(2*s+1),D(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(e){var t;return e&&e.state?(e.total_in=e.total_out=0,e.data_type=i,(t=e.state).pending=0,t.pending_out=0,t.wrap<0&&(t.wrap=-t.wrap),t.status=t.wrap?C:E,e.adler=2===t.wrap?0:1,t.last_flush=l,u._tr_init(t),m):R(e,_)}function K(e){var t=G(e);return t===m&&function(e){e.window_size=2*e.w_size,D(e.head),e.max_lazy_match=h[e.level].max_lazy,e.good_match=h[e.level].good_length,e.nice_match=h[e.level].nice_length,e.max_chain_length=h[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=x-1,e.match_available=0,e.ins_h=0}(e.state),t}function Y(e,t,r,n,i,s){if(!e)return _;var a=1;if(t===g&&(t=6),n<0?(a=0,n=-n):15<n&&(a=2,n-=16),i<1||y<i||r!==v||n<8||15<n||t<0||9<t||s<0||b<s)return R(e,_);8===n&&(n=9);var o=new H;return(e.state=o).strm=e,o.wrap=a,o.gzhead=null,o.w_bits=n,o.w_size=1<<o.w_bits,o.w_mask=o.w_size-1,o.hash_bits=i+7,o.hash_size=1<<o.hash_bits,o.hash_mask=o.hash_size-1,o.hash_shift=~~((o.hash_bits+x-1)/x),o.window=new c.Buf8(2*o.w_size),o.head=new c.Buf16(o.hash_size),o.prev=new c.Buf16(o.w_size),o.lit_bufsize=1<<i+6,o.pending_buf_size=4*o.lit_bufsize,o.pending_buf=new c.Buf8(o.pending_buf_size),o.d_buf=1*o.lit_bufsize,o.l_buf=3*o.lit_bufsize,o.level=t,o.strategy=s,o.method=r,K(e)}h=[new M(0,0,0,0,function(e,t){var r=65535;for(r>e.pending_buf_size-5&&(r=e.pending_buf_size-5);;){if(e.lookahead<=1){if(j(e),0===e.lookahead&&t===l)return A;if(0===e.lookahead)break}e.strstart+=e.lookahead,e.lookahead=0;var n=e.block_start+r;if((0===e.strstart||e.strstart>=n)&&(e.lookahead=e.strstart-n,e.strstart=n,N(e,!1),0===e.strm.avail_out))return A;if(e.strstart-e.block_start>=e.w_size-z&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):(e.strstart>e.block_start&&(N(e,!1),e.strm.avail_out),A)}),new M(4,4,8,4,Z),new M(4,5,16,8,Z),new M(4,6,32,32,Z),new M(4,4,16,16,W),new M(8,16,32,32,W),new M(8,16,128,128,W),new M(8,32,128,256,W),new M(32,128,258,1024,W),new M(32,258,258,4096,W)],r.deflateInit=function(e,t){return Y(e,t,v,15,8,0)},r.deflateInit2=Y,r.deflateReset=K,r.deflateResetKeep=G,r.deflateSetHeader=function(e,t){return e&&e.state?2!==e.state.wrap?_:(e.state.gzhead=t,m):_},r.deflate=function(e,t){var r,n,i,s;if(!e||!e.state||5<t||t<0)return e?R(e,_):_;if(n=e.state,!e.output||!e.input&&0!==e.avail_in||666===n.status&&t!==f)return R(e,0===e.avail_out?-5:_);if(n.strm=e,r=n.last_flush,n.last_flush=t,n.status===C)if(2===n.wrap)e.adler=0,U(n,31),U(n,139),U(n,8),n.gzhead?(U(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),U(n,255&n.gzhead.time),U(n,n.gzhead.time>>8&255),U(n,n.gzhead.time>>16&255),U(n,n.gzhead.time>>24&255),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(U(n,255&n.gzhead.extra.length),U(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(e.adler=p(e.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(U(n,0),U(n,0),U(n,0),U(n,0),U(n,0),U(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),U(n,3),n.status=E);else{var a=v+(n.w_bits-8<<4)<<8;a|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(a|=32),a+=31-a%31,n.status=E,P(n,a),0!==n.strstart&&(P(n,e.adler>>>16),P(n,65535&e.adler)),e.adler=1}if(69===n.status)if(n.gzhead.extra){for(i=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending!==n.pending_buf_size));)U(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73)}else n.status=73;if(73===n.status)if(n.gzhead.name){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0,U(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.gzindex=0,n.status=91)}else n.status=91;if(91===n.status)if(n.gzhead.comment){i=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),F(e),i=n.pending,n.pending===n.pending_buf_size)){s=1;break}s=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0,U(n,s)}while(0!==s);n.gzhead.hcrc&&n.pending>i&&(e.adler=p(e.adler,n.pending_buf,n.pending-i,i)),0===s&&(n.status=103)}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&F(e),n.pending+2<=n.pending_buf_size&&(U(n,255&e.adler),U(n,e.adler>>8&255),e.adler=0,n.status=E)):n.status=E),0!==n.pending){if(F(e),0===e.avail_out)return n.last_flush=-1,m}else if(0===e.avail_in&&T(t)<=T(r)&&t!==f)return R(e,-5);if(666===n.status&&0!==e.avail_in)return R(e,-5);if(0!==e.avail_in||0!==n.lookahead||t!==l&&666!==n.status){var o=2===n.strategy?function(e,t){for(var r;;){if(0===e.lookahead&&(j(e),0===e.lookahead)){if(t===l)return A;break}if(e.match_length=0,r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++,r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):3===n.strategy?function(e,t){for(var r,n,i,s,a=e.window;;){if(e.lookahead<=S){if(j(e),e.lookahead<=S&&t===l)return A;if(0===e.lookahead)break}if(e.match_length=0,e.lookahead>=x&&0<e.strstart&&(n=a[i=e.strstart-1])===a[++i]&&n===a[++i]&&n===a[++i]){s=e.strstart+S;do{}while(n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&n===a[++i]&&i<s);e.match_length=S-(s-i),e.match_length>e.lookahead&&(e.match_length=e.lookahead)}if(e.match_length>=x?(r=u._tr_tally(e,1,e.match_length-x),e.lookahead-=e.match_length,e.strstart+=e.match_length,e.match_length=0):(r=u._tr_tally(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++),r&&(N(e,!1),0===e.strm.avail_out))return A}return e.insert=0,t===f?(N(e,!0),0===e.strm.avail_out?O:B):e.last_lit&&(N(e,!1),0===e.strm.avail_out)?A:I}(n,t):h[n.level].func(n,t);if(o!==O&&o!==B||(n.status=666),o===A||o===O)return 0===e.avail_out&&(n.last_flush=-1),m;if(o===I&&(1===t?u._tr_align(n):5!==t&&(u._tr_stored_block(n,0,0,!1),3===t&&(D(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),F(e),0===e.avail_out))return n.last_flush=-1,m}return t!==f?m:n.wrap<=0?1:(2===n.wrap?(U(n,255&e.adler),U(n,e.adler>>8&255),U(n,e.adler>>16&255),U(n,e.adler>>24&255),U(n,255&e.total_in),U(n,e.total_in>>8&255),U(n,e.total_in>>16&255),U(n,e.total_in>>24&255)):(P(n,e.adler>>>16),P(n,65535&e.adler)),F(e),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?m:1)},r.deflateEnd=function(e){var t;return e&&e.state?(t=e.state.status)!==C&&69!==t&&73!==t&&91!==t&&103!==t&&t!==E&&666!==t?R(e,_):(e.state=null,t===E?R(e,-3):m):_},r.deflateSetDictionary=function(e,t){var r,n,i,s,a,o,h,u,l=t.length;if(!e||!e.state)return _;if(2===(s=(r=e.state).wrap)||1===s&&r.status!==C||r.lookahead)return _;for(1===s&&(e.adler=d(e.adler,t,l,0)),r.wrap=0,l>=r.w_size&&(0===s&&(D(r.head),r.strstart=0,r.block_start=0,r.insert=0),u=new c.Buf8(r.w_size),c.arraySet(u,t,l-r.w_size,r.w_size,0),t=u,l=r.w_size),a=e.avail_in,o=e.next_in,h=e.input,e.avail_in=l,e.next_in=0,e.input=t,j(r);r.lookahead>=x;){for(n=r.strstart,i=r.lookahead-(x-1);r.ins_h=(r.ins_h<<r.hash_shift^r.window[n+x-1])&r.hash_mask,r.prev[n&r.w_mask]=r.head[r.ins_h],r.head[r.ins_h]=n,n++,--i;);r.strstart=n,r.lookahead=x-1,j(r)}return r.strstart+=r.lookahead,r.block_start=r.strstart,r.insert=r.lookahead,r.lookahead=0,r.match_length=r.prev_length=x-1,r.match_available=0,e.next_in=o,e.input=h,e.avail_in=a,r.wrap=s,m},r.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(e,t,r){"use strict";t.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(e,t,r){"use strict";t.exports=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C;r=e.state,n=e.next_in,z=e.input,i=n+(e.avail_in-5),s=e.next_out,C=e.output,a=s-(t-e.avail_out),o=s+(e.avail_out-257),h=r.dmax,u=r.wsize,l=r.whave,f=r.wnext,c=r.window,d=r.hold,p=r.bits,m=r.lencode,_=r.distcode,g=(1<<r.lenbits)-1,b=(1<<r.distbits)-1;e:do{p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=m[d&g];t:for(;;){if(d>>>=y=v>>>24,p-=y,0===(y=v>>>16&255))C[s++]=65535&v;else{if(!(16&y)){if(0==(64&y)){v=m[(65535&v)+(d&(1<<y)-1)];continue t}if(32&y){r.mode=12;break e}e.msg="invalid literal/length code",r.mode=30;break e}w=65535&v,(y&=15)&&(p<y&&(d+=z[n++]<<p,p+=8),w+=d&(1<<y)-1,d>>>=y,p-=y),p<15&&(d+=z[n++]<<p,p+=8,d+=z[n++]<<p,p+=8),v=_[d&b];r:for(;;){if(d>>>=y=v>>>24,p-=y,!(16&(y=v>>>16&255))){if(0==(64&y)){v=_[(65535&v)+(d&(1<<y)-1)];continue r}e.msg="invalid distance code",r.mode=30;break e}if(k=65535&v,p<(y&=15)&&(d+=z[n++]<<p,(p+=8)<y&&(d+=z[n++]<<p,p+=8)),h<(k+=d&(1<<y)-1)){e.msg="invalid distance too far back",r.mode=30;break e}if(d>>>=y,p-=y,(y=s-a)<k){if(l<(y=k-y)&&r.sane){e.msg="invalid distance too far back",r.mode=30;break e}if(S=c,(x=0)===f){if(x+=u-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C}}else if(f<y){if(x+=u+f-y,(y-=f)<w){for(w-=y;C[s++]=c[x++],--y;);if(x=0,f<w){for(w-=y=f;C[s++]=c[x++],--y;);x=s-k,S=C}}}else if(x+=f-y,y<w){for(w-=y;C[s++]=c[x++],--y;);x=s-k,S=C}for(;2<w;)C[s++]=S[x++],C[s++]=S[x++],C[s++]=S[x++],w-=3;w&&(C[s++]=S[x++],1<w&&(C[s++]=S[x++]))}else{for(x=s-k;C[s++]=C[x++],C[s++]=C[x++],C[s++]=C[x++],2<(w-=3););w&&(C[s++]=C[x++],1<w&&(C[s++]=C[x++]))}break}}break}}while(n<i&&s<o);n-=w=p>>3,d&=(1<<(p-=w<<3))-1,e.next_in=n,e.next_out=s,e.avail_in=n<i?i-n+5:5-(n-i),e.avail_out=s<o?o-s+257:257-(s-o),r.hold=d,r.bits=p}},{}],49:[function(e,t,r){"use strict";var I=e("../utils/common"),O=e("./adler32"),B=e("./crc32"),R=e("./inffast"),T=e("./inftrees"),D=1,F=2,N=0,U=-2,P=1,n=852,i=592;function L(e){return(e>>>24&255)+(e>>>8&65280)+((65280&e)<<8)+((255&e)<<24)}function s(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new I.Buf16(320),this.work=new I.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function a(e){var t;return e&&e.state?(t=e.state,e.total_in=e.total_out=t.total=0,e.msg="",t.wrap&&(e.adler=1&t.wrap),t.mode=P,t.last=0,t.havedict=0,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new I.Buf32(n),t.distcode=t.distdyn=new I.Buf32(i),t.sane=1,t.back=-1,N):U}function o(e){var t;return e&&e.state?((t=e.state).wsize=0,t.whave=0,t.wnext=0,a(e)):U}function h(e,t){var r,n;return e&&e.state?(n=e.state,t<0?(r=0,t=-t):(r=1+(t>>4),t<48&&(t&=15)),t&&(t<8||15<t)?U:(null!==n.window&&n.wbits!==t&&(n.window=null),n.wrap=r,n.wbits=t,o(e))):U}function u(e,t){var r,n;return e?(n=new s,(e.state=n).window=null,(r=h(e,t))!==N&&(e.state=null),r):U}var l,f,c=!0;function j(e){if(c){var t;for(l=new I.Buf32(512),f=new I.Buf32(32),t=0;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(T(D,e.lens,0,288,l,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;T(F,e.lens,0,32,f,0,e.work,{bits:5}),c=!1}e.lencode=l,e.lenbits=9,e.distcode=f,e.distbits=5}function Z(e,t,r,n){var i,s=e.state;return null===s.window&&(s.wsize=1<<s.wbits,s.wnext=0,s.whave=0,s.window=new I.Buf8(s.wsize)),n>=s.wsize?(I.arraySet(s.window,t,r-s.wsize,s.wsize,0),s.wnext=0,s.whave=s.wsize):(n<(i=s.wsize-s.wnext)&&(i=n),I.arraySet(s.window,t,r-n,i,s.wnext),(n-=i)?(I.arraySet(s.window,t,r-n,n,0),s.wnext=n,s.whave=s.wsize):(s.wnext+=i,s.wnext===s.wsize&&(s.wnext=0),s.whave<s.wsize&&(s.whave+=i))),0}r.inflateReset=o,r.inflateReset2=h,r.inflateResetKeep=a,r.inflateInit=function(e){return u(e,15)},r.inflateInit2=u,r.inflate=function(e,t){var r,n,i,s,a,o,h,u,l,f,c,d,p,m,_,g,b,v,y,w,k,x,S,z,C=0,E=new I.Buf8(4),A=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!e||!e.state||!e.output||!e.input&&0!==e.avail_in)return U;12===(r=e.state).mode&&(r.mode=13),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,f=o,c=h,x=N;e:for(;;)switch(r.mode){case P:if(0===r.wrap){r.mode=13;break}for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(2&r.wrap&&35615===u){E[r.check=0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0),l=u=0,r.mode=2;break}if(r.flags=0,r.head&&(r.head.done=!1),!(1&r.wrap)||(((255&u)<<8)+(u>>8))%31){e.msg="incorrect header check",r.mode=30;break}if(8!=(15&u)){e.msg="unknown compression method",r.mode=30;break}if(l-=4,k=8+(15&(u>>>=4)),0===r.wbits)r.wbits=k;else if(k>r.wbits){e.msg="invalid window size",r.mode=30;break}r.dmax=1<<k,e.adler=r.check=1,r.mode=512&u?10:12,l=u=0;break;case 2:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(r.flags=u,8!=(255&r.flags)){e.msg="unknown compression method",r.mode=30;break}if(57344&r.flags){e.msg="unknown header flags set",r.mode=30;break}r.head&&(r.head.text=u>>8&1),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=3;case 3:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.head&&(r.head.time=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,E[2]=u>>>16&255,E[3]=u>>>24&255,r.check=B(r.check,E,4,0)),l=u=0,r.mode=4;case 4:for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.head&&(r.head.xflags=255&u,r.head.os=u>>8),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0,r.mode=5;case 5:if(1024&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.length=u,r.head&&(r.head.extra_len=u),512&r.flags&&(E[0]=255&u,E[1]=u>>>8&255,r.check=B(r.check,E,2,0)),l=u=0}else r.head&&(r.head.extra=null);r.mode=6;case 6:if(1024&r.flags&&(o<(d=r.length)&&(d=o),d&&(r.head&&(k=r.head.extra_len-r.length,r.head.extra||(r.head.extra=new Array(r.head.extra_len)),I.arraySet(r.head.extra,n,s,d,k)),512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,r.length-=d),r.length))break e;r.length=0,r.mode=7;case 7:if(2048&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.name+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.name=null);r.length=0,r.mode=8;case 8:if(4096&r.flags){if(0===o)break e;for(d=0;k=n[s+d++],r.head&&k&&r.length<65536&&(r.head.comment+=String.fromCharCode(k)),k&&d<o;);if(512&r.flags&&(r.check=B(r.check,n,d,s)),o-=d,s+=d,k)break e}else r.head&&(r.head.comment=null);r.mode=9;case 9:if(512&r.flags){for(;l<16;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u!==(65535&r.check)){e.msg="header crc mismatch",r.mode=30;break}l=u=0}r.head&&(r.head.hcrc=r.flags>>9&1,r.head.done=!0),e.adler=r.check=0,r.mode=12;break;case 10:for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}e.adler=r.check=L(u),l=u=0,r.mode=11;case 11:if(0===r.havedict)return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,2;e.adler=r.check=1,r.mode=12;case 12:if(5===t||6===t)break e;case 13:if(r.last){u>>>=7&l,l-=7&l,r.mode=27;break}for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}switch(r.last=1&u,l-=1,3&(u>>>=1)){case 0:r.mode=14;break;case 1:if(j(r),r.mode=20,6!==t)break;u>>>=2,l-=2;break e;case 2:r.mode=17;break;case 3:e.msg="invalid block type",r.mode=30}u>>>=2,l-=2;break;case 14:for(u>>>=7&l,l-=7&l;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if((65535&u)!=(u>>>16^65535)){e.msg="invalid stored block lengths",r.mode=30;break}if(r.length=65535&u,l=u=0,r.mode=15,6===t)break e;case 15:r.mode=16;case 16:if(d=r.length){if(o<d&&(d=o),h<d&&(d=h),0===d)break e;I.arraySet(i,n,s,d,a),o-=d,s+=d,h-=d,a+=d,r.length-=d;break}r.mode=12;break;case 17:for(;l<14;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(r.nlen=257+(31&u),u>>>=5,l-=5,r.ndist=1+(31&u),u>>>=5,l-=5,r.ncode=4+(15&u),u>>>=4,l-=4,286<r.nlen||30<r.ndist){e.msg="too many length or distance symbols",r.mode=30;break}r.have=0,r.mode=18;case 18:for(;r.have<r.ncode;){for(;l<3;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.lens[A[r.have++]]=7&u,u>>>=3,l-=3}for(;r.have<19;)r.lens[A[r.have++]]=0;if(r.lencode=r.lendyn,r.lenbits=7,S={bits:r.lenbits},x=T(0,r.lens,0,19,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid code lengths set",r.mode=30;break}r.have=0,r.mode=19;case 19:for(;r.have<r.nlen+r.ndist;){for(;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(b<16)u>>>=_,l-=_,r.lens[r.have++]=b;else{if(16===b){for(z=_+2;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u>>>=_,l-=_,0===r.have){e.msg="invalid bit length repeat",r.mode=30;break}k=r.lens[r.have-1],d=3+(3&u),u>>>=2,l-=2}else if(17===b){for(z=_+3;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}l-=_,k=0,d=3+(7&(u>>>=_)),u>>>=3,l-=3}else{for(z=_+7;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}l-=_,k=0,d=11+(127&(u>>>=_)),u>>>=7,l-=7}if(r.have+d>r.nlen+r.ndist){e.msg="invalid bit length repeat",r.mode=30;break}for(;d--;)r.lens[r.have++]=k}}if(30===r.mode)break;if(0===r.lens[256]){e.msg="invalid code -- missing end-of-block",r.mode=30;break}if(r.lenbits=9,S={bits:r.lenbits},x=T(D,r.lens,0,r.nlen,r.lencode,0,r.work,S),r.lenbits=S.bits,x){e.msg="invalid literal/lengths set",r.mode=30;break}if(r.distbits=6,r.distcode=r.distdyn,S={bits:r.distbits},x=T(F,r.lens,r.nlen,r.ndist,r.distcode,0,r.work,S),r.distbits=S.bits,x){e.msg="invalid distances set",r.mode=30;break}if(r.mode=20,6===t)break e;case 20:r.mode=21;case 21:if(6<=o&&258<=h){e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,R(e,c),a=e.next_out,i=e.output,h=e.avail_out,s=e.next_in,n=e.input,o=e.avail_in,u=r.hold,l=r.bits,12===r.mode&&(r.back=-1);break}for(r.back=0;g=(C=r.lencode[u&(1<<r.lenbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(g&&0==(240&g)){for(v=_,y=g,w=b;g=(C=r.lencode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,r.length=b,0===g){r.mode=26;break}if(32&g){r.back=-1,r.mode=12;break}if(64&g){e.msg="invalid literal/length code",r.mode=30;break}r.extra=15&g,r.mode=22;case 22:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.length+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}r.was=r.length,r.mode=23;case 23:for(;g=(C=r.distcode[u&(1<<r.distbits)-1])>>>16&255,b=65535&C,!((_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(0==(240&g)){for(v=_,y=g,w=b;g=(C=r.distcode[w+((u&(1<<v+y)-1)>>v)])>>>16&255,b=65535&C,!(v+(_=C>>>24)<=l);){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}u>>>=v,l-=v,r.back+=v}if(u>>>=_,l-=_,r.back+=_,64&g){e.msg="invalid distance code",r.mode=30;break}r.offset=b,r.extra=15&g,r.mode=24;case 24:if(r.extra){for(z=r.extra;l<z;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}r.offset+=u&(1<<r.extra)-1,u>>>=r.extra,l-=r.extra,r.back+=r.extra}if(r.offset>r.dmax){e.msg="invalid distance too far back",r.mode=30;break}r.mode=25;case 25:if(0===h)break e;if(d=c-h,r.offset>d){if((d=r.offset-d)>r.whave&&r.sane){e.msg="invalid distance too far back",r.mode=30;break}p=d>r.wnext?(d-=r.wnext,r.wsize-d):r.wnext-d,d>r.length&&(d=r.length),m=r.window}else m=i,p=a-r.offset,d=r.length;for(h<d&&(d=h),h-=d,r.length-=d;i[a++]=m[p++],--d;);0===r.length&&(r.mode=21);break;case 26:if(0===h)break e;i[a++]=r.length,h--,r.mode=21;break;case 27:if(r.wrap){for(;l<32;){if(0===o)break e;o--,u|=n[s++]<<l,l+=8}if(c-=h,e.total_out+=c,r.total+=c,c&&(e.adler=r.check=r.flags?B(r.check,i,c,a-c):O(r.check,i,c,a-c)),c=h,(r.flags?u:L(u))!==r.check){e.msg="incorrect data check",r.mode=30;break}l=u=0}r.mode=28;case 28:if(r.wrap&&r.flags){for(;l<32;){if(0===o)break e;o--,u+=n[s++]<<l,l+=8}if(u!==(4294967295&r.total)){e.msg="incorrect length check",r.mode=30;break}l=u=0}r.mode=29;case 29:x=1;break e;case 30:x=-3;break e;case 31:return-4;case 32:default:return U}return e.next_out=a,e.avail_out=h,e.next_in=s,e.avail_in=o,r.hold=u,r.bits=l,(r.wsize||c!==e.avail_out&&r.mode<30&&(r.mode<27||4!==t))&&Z(e,e.output,e.next_out,c-e.avail_out)?(r.mode=31,-4):(f-=e.avail_in,c-=e.avail_out,e.total_in+=f,e.total_out+=c,r.total+=c,r.wrap&&c&&(e.adler=r.check=r.flags?B(r.check,i,c,e.next_out-c):O(r.check,i,c,e.next_out-c)),e.data_type=r.bits+(r.last?64:0)+(12===r.mode?128:0)+(20===r.mode||15===r.mode?256:0),(0==f&&0===c||4===t)&&x===N&&(x=-5),x)},r.inflateEnd=function(e){if(!e||!e.state)return U;var t=e.state;return t.window&&(t.window=null),e.state=null,N},r.inflateGetHeader=function(e,t){var r;return e&&e.state?0==(2&(r=e.state).wrap)?U:((r.head=t).done=!1,N):U},r.inflateSetDictionary=function(e,t){var r,n=t.length;return e&&e.state?0!==(r=e.state).wrap&&11!==r.mode?U:11===r.mode&&O(1,t,n,0)!==r.check?-3:Z(e,t,n,n)?(r.mode=31,-4):(r.havedict=1,N):U},r.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(e,t,r){"use strict";var D=e("../utils/common"),F=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],N=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],U=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],P=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];t.exports=function(e,t,r,n,i,s,a,o){var h,u,l,f,c,d,p,m,_,g=o.bits,b=0,v=0,y=0,w=0,k=0,x=0,S=0,z=0,C=0,E=0,A=null,I=0,O=new D.Buf16(16),B=new D.Buf16(16),R=null,T=0;for(b=0;b<=15;b++)O[b]=0;for(v=0;v<n;v++)O[t[r+v]]++;for(k=g,w=15;1<=w&&0===O[w];w--);if(w<k&&(k=w),0===w)return i[s++]=20971520,i[s++]=20971520,o.bits=1,0;for(y=1;y<w&&0===O[y];y++);for(k<y&&(k=y),b=z=1;b<=15;b++)if(z<<=1,(z-=O[b])<0)return-1;if(0<z&&(0===e||1!==w))return-1;for(B[1]=0,b=1;b<15;b++)B[b+1]=B[b]+O[b];for(v=0;v<n;v++)0!==t[r+v]&&(a[B[t[r+v]]++]=v);if(d=0===e?(A=R=a,19):1===e?(A=F,I-=257,R=N,T-=257,256):(A=U,R=P,-1),b=y,c=s,S=v=E=0,l=-1,f=(C=1<<(x=k))-1,1===e&&852<C||2===e&&592<C)return 1;for(;;){for(p=b-S,_=a[v]<d?(m=0,a[v]):a[v]>d?(m=R[T+a[v]],A[I+a[v]]):(m=96,0),h=1<<b-S,y=u=1<<x;i[c+(E>>S)+(u-=h)]=p<<24|m<<16|_|0,0!==u;);for(h=1<<b-1;E&h;)h>>=1;if(0!==h?(E&=h-1,E+=h):E=0,v++,0==--O[b]){if(b===w)break;b=t[r+a[v]]}if(k<b&&(E&f)!==l){for(0===S&&(S=k),c+=y,z=1<<(x=b-S);x+S<w&&!((z-=O[x+S])<=0);)x++,z<<=1;if(C+=1<<x,1===e&&852<C||2===e&&592<C)return 1;i[l=E&f]=k<<24|x<<16|c-s|0}}return 0!==E&&(i[c+E]=b-S<<24|64<<16|0),o.bits=k,0}},{"../utils/common":41}],51:[function(e,t,r){"use strict";t.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(e,t,r){"use strict";var i=e("../utils/common"),o=0,h=1;function n(e){for(var t=e.length;0<=--t;)e[t]=0}var s=0,a=29,u=256,l=u+1+a,f=30,c=19,_=2*l+1,g=15,d=16,p=7,m=256,b=16,v=17,y=18,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(l+2));n(z);var C=new Array(2*f);n(C);var E=new Array(512);n(E);var A=new Array(256);n(A);var I=new Array(a);n(I);var O,B,R,T=new Array(f);function D(e,t,r,n,i){this.static_tree=e,this.extra_bits=t,this.extra_base=r,this.elems=n,this.max_length=i,this.has_stree=e&&e.length}function F(e,t){this.dyn_tree=e,this.max_code=0,this.stat_desc=t}function N(e){return e<256?E[e]:E[256+(e>>>7)]}function U(e,t){e.pending_buf[e.pending++]=255&t,e.pending_buf[e.pending++]=t>>>8&255}function P(e,t,r){e.bi_valid>d-r?(e.bi_buf|=t<<e.bi_valid&65535,U(e,e.bi_buf),e.bi_buf=t>>d-e.bi_valid,e.bi_valid+=r-d):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=r)}function L(e,t,r){P(e,r[2*t],r[2*t+1])}function j(e,t){for(var r=0;r|=1&e,e>>>=1,r<<=1,0<--t;);return r>>>1}function Z(e,t,r){var n,i,s=new Array(g+1),a=0;for(n=1;n<=g;n++)s[n]=a=a+r[n-1]<<1;for(i=0;i<=t;i++){var o=e[2*i+1];0!==o&&(e[2*i]=j(s[o]++,o))}}function W(e){var t;for(t=0;t<l;t++)e.dyn_ltree[2*t]=0;for(t=0;t<f;t++)e.dyn_dtree[2*t]=0;for(t=0;t<c;t++)e.bl_tree[2*t]=0;e.dyn_ltree[2*m]=1,e.opt_len=e.static_len=0,e.last_lit=e.matches=0}function M(e){8<e.bi_valid?U(e,e.bi_buf):0<e.bi_valid&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0}function H(e,t,r,n){var i=2*t,s=2*r;return e[i]<e[s]||e[i]===e[s]&&n[t]<=n[r]}function G(e,t,r){for(var n=e.heap[r],i=r<<1;i<=e.heap_len&&(i<e.heap_len&&H(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!H(t,n,e.heap[i],e.depth));)e.heap[r]=e.heap[i],r=i,i<<=1;e.heap[r]=n}function K(e,t,r){var n,i,s,a,o=0;if(0!==e.last_lit)for(;n=e.pending_buf[e.d_buf+2*o]<<8|e.pending_buf[e.d_buf+2*o+1],i=e.pending_buf[e.l_buf+o],o++,0===n?L(e,i,t):(L(e,(s=A[i])+u+1,t),0!==(a=w[s])&&P(e,i-=I[s],a),L(e,s=N(--n),r),0!==(a=k[s])&&P(e,n-=T[s],a)),o<e.last_lit;);L(e,m,t)}function Y(e,t){var r,n,i,s=t.dyn_tree,a=t.stat_desc.static_tree,o=t.stat_desc.has_stree,h=t.stat_desc.elems,u=-1;for(e.heap_len=0,e.heap_max=_,r=0;r<h;r++)0!==s[2*r]?(e.heap[++e.heap_len]=u=r,e.depth[r]=0):s[2*r+1]=0;for(;e.heap_len<2;)s[2*(i=e.heap[++e.heap_len]=u<2?++u:0)]=1,e.depth[i]=0,e.opt_len--,o&&(e.static_len-=a[2*i+1]);for(t.max_code=u,r=e.heap_len>>1;1<=r;r--)G(e,s,r);for(i=h;r=e.heap[1],e.heap[1]=e.heap[e.heap_len--],G(e,s,1),n=e.heap[1],e.heap[--e.heap_max]=r,e.heap[--e.heap_max]=n,s[2*i]=s[2*r]+s[2*n],e.depth[i]=(e.depth[r]>=e.depth[n]?e.depth[r]:e.depth[n])+1,s[2*r+1]=s[2*n+1]=i,e.heap[1]=i++,G(e,s,1),2<=e.heap_len;);e.heap[--e.heap_max]=e.heap[1],function(e,t){var r,n,i,s,a,o,h=t.dyn_tree,u=t.max_code,l=t.stat_desc.static_tree,f=t.stat_desc.has_stree,c=t.stat_desc.extra_bits,d=t.stat_desc.extra_base,p=t.stat_desc.max_length,m=0;for(s=0;s<=g;s++)e.bl_count[s]=0;for(h[2*e.heap[e.heap_max]+1]=0,r=e.heap_max+1;r<_;r++)p<(s=h[2*h[2*(n=e.heap[r])+1]+1]+1)&&(s=p,m++),h[2*n+1]=s,u<n||(e.bl_count[s]++,a=0,d<=n&&(a=c[n-d]),o=h[2*n],e.opt_len+=o*(s+a),f&&(e.static_len+=o*(l[2*n+1]+a)));if(0!==m){do{for(s=p-1;0===e.bl_count[s];)s--;e.bl_count[s]--,e.bl_count[s+1]+=2,e.bl_count[p]--,m-=2}while(0<m);for(s=p;0!==s;s--)for(n=e.bl_count[s];0!==n;)u<(i=e.heap[--r])||(h[2*i+1]!==s&&(e.opt_len+=(s-h[2*i+1])*h[2*i],h[2*i+1]=s),n--)}}(e,t),Z(s,u,e.bl_count)}function X(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),t[2*(r+1)+1]=65535,n=0;n<=r;n++)i=a,a=t[2*(n+1)+1],++o<h&&i===a||(o<u?e.bl_tree[2*i]+=o:0!==i?(i!==s&&e.bl_tree[2*i]++,e.bl_tree[2*b]++):o<=10?e.bl_tree[2*v]++:e.bl_tree[2*y]++,s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4))}function V(e,t,r){var n,i,s=-1,a=t[1],o=0,h=7,u=4;for(0===a&&(h=138,u=3),n=0;n<=r;n++)if(i=a,a=t[2*(n+1)+1],!(++o<h&&i===a)){if(o<u)for(;L(e,i,e.bl_tree),0!=--o;);else 0!==i?(i!==s&&(L(e,i,e.bl_tree),o--),L(e,b,e.bl_tree),P(e,o-3,2)):o<=10?(L(e,v,e.bl_tree),P(e,o-3,3)):(L(e,y,e.bl_tree),P(e,o-11,7));s=i,u=(o=0)===a?(h=138,3):i===a?(h=6,3):(h=7,4)}}n(T);var q=!1;function J(e,t,r,n){P(e,(s<<1)+(n?1:0),3),function(e,t,r,n){M(e),n&&(U(e,r),U(e,~r)),i.arraySet(e.pending_buf,e.window,t,r,e.pending),e.pending+=r}(e,t,r,!0)}r._tr_init=function(e){q||(function(){var e,t,r,n,i,s=new Array(g+1);for(n=r=0;n<a-1;n++)for(I[n]=r,e=0;e<1<<w[n];e++)A[r++]=n;for(A[r-1]=n,n=i=0;n<16;n++)for(T[n]=i,e=0;e<1<<k[n];e++)E[i++]=n;for(i>>=7;n<f;n++)for(T[n]=i<<7,e=0;e<1<<k[n]-7;e++)E[256+i++]=n;for(t=0;t<=g;t++)s[t]=0;for(e=0;e<=143;)z[2*e+1]=8,e++,s[8]++;for(;e<=255;)z[2*e+1]=9,e++,s[9]++;for(;e<=279;)z[2*e+1]=7,e++,s[7]++;for(;e<=287;)z[2*e+1]=8,e++,s[8]++;for(Z(z,l+1,s),e=0;e<f;e++)C[2*e+1]=5,C[2*e]=j(e,5);O=new D(z,w,u+1,l,g),B=new D(C,k,0,f,g),R=new D(new Array(0),x,0,c,p)}(),q=!0),e.l_desc=new F(e.dyn_ltree,O),e.d_desc=new F(e.dyn_dtree,B),e.bl_desc=new F(e.bl_tree,R),e.bi_buf=0,e.bi_valid=0,W(e)},r._tr_stored_block=J,r._tr_flush_block=function(e,t,r,n){var i,s,a=0;0<e.level?(2===e.strm.data_type&&(e.strm.data_type=function(e){var t,r=4093624447;for(t=0;t<=31;t++,r>>>=1)if(1&r&&0!==e.dyn_ltree[2*t])return o;if(0!==e.dyn_ltree[18]||0!==e.dyn_ltree[20]||0!==e.dyn_ltree[26])return h;for(t=32;t<u;t++)if(0!==e.dyn_ltree[2*t])return h;return o}(e)),Y(e,e.l_desc),Y(e,e.d_desc),a=function(e){var t;for(X(e,e.dyn_ltree,e.l_desc.max_code),X(e,e.dyn_dtree,e.d_desc.max_code),Y(e,e.bl_desc),t=c-1;3<=t&&0===e.bl_tree[2*S[t]+1];t--);return e.opt_len+=3*(t+1)+5+5+4,t}(e),i=e.opt_len+3+7>>>3,(s=e.static_len+3+7>>>3)<=i&&(i=s)):i=s=r+5,r+4<=i&&-1!==t?J(e,t,r,n):4===e.strategy||s===i?(P(e,2+(n?1:0),3),K(e,z,C)):(P(e,4+(n?1:0),3),function(e,t,r,n){var i;for(P(e,t-257,5),P(e,r-1,5),P(e,n-4,4),i=0;i<n;i++)P(e,e.bl_tree[2*S[i]+1],3);V(e,e.dyn_ltree,t-1),V(e,e.dyn_dtree,r-1)}(e,e.l_desc.max_code+1,e.d_desc.max_code+1,a+1),K(e,e.dyn_ltree,e.dyn_dtree)),W(e),n&&M(e)},r._tr_tally=function(e,t,r){return e.pending_buf[e.d_buf+2*e.last_lit]=t>>>8&255,e.pending_buf[e.d_buf+2*e.last_lit+1]=255&t,e.pending_buf[e.l_buf+e.last_lit]=255&r,e.last_lit++,0===t?e.dyn_ltree[2*r]++:(e.matches++,t--,e.dyn_ltree[2*(A[r]+u+1)]++,e.dyn_dtree[2*N(t)]++),e.last_lit===e.lit_bufsize-1},r._tr_align=function(e){P(e,2,3),L(e,m,z),function(e){16===e.bi_valid?(U(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}(e)}},{"../utils/common":41}],53:[function(e,t,r){"use strict";t.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(e,t,r){(function(e){!function(r,n){"use strict";if(!r.setImmediate){var i,s,t,a,o=1,h={},u=!1,l=r.document,e=Object.getPrototypeOf&&Object.getPrototypeOf(r);e=e&&e.setTimeout?e:r,i="[object process]"==={}.toString.call(r.process)?function(e){process.nextTick(function(){c(e)})}:function(){if(r.postMessage&&!r.importScripts){var e=!0,t=r.onmessage;return r.onmessage=function(){e=!1},r.postMessage("","*"),r.onmessage=t,e}}()?(a="setImmediate$"+Math.random()+"$",r.addEventListener?r.addEventListener("message",d,!1):r.attachEvent("onmessage",d),function(e){r.postMessage(a+e,"*")}):r.MessageChannel?((t=new MessageChannel).port1.onmessage=function(e){c(e.data)},function(e){t.port2.postMessage(e)}):l&&"onreadystatechange"in l.createElement("script")?(s=l.documentElement,function(e){var t=l.createElement("script");t.onreadystatechange=function(){c(e),t.onreadystatechange=null,s.removeChild(t),t=null},s.appendChild(t)}):function(e){setTimeout(c,0,e)},e.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),r=0;r<t.length;r++)t[r]=arguments[r+1];var n={callback:e,args:t};return h[o]=n,i(o),o++},e.clearImmediate=f}function f(e){delete h[e]}function c(e){if(u)setTimeout(c,0,e);else{var t=h[e];if(t){u=!0;try{!function(e){var t=e.callback,r=e.args;switch(r.length){case 0:t();break;case 1:t(r[0]);break;case 2:t(r[0],r[1]);break;case 3:t(r[0],r[1],r[2]);break;default:t.apply(n,r)}}(t)}finally{f(e),u=!1}}}}function d(e){e.source===r&&"string"==typeof e.data&&0===e.data.indexOf(a)&&c(+e.data.slice(a.length))}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[10])(10)});

/***/ }),

/***/ "./src/WebAdb/base/deferred.ts":
/*!*************************************!*\
  !*** ./src/WebAdb/base/deferred.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Copyright (C) 2018 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defer = void 0;
// Create a promise with exposed resolve and reject callbacks.
function defer() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolve = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let reject = null;
    const p = new Promise((res, rej) => [resolve, reject] = [res, rej]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.assign(p, { resolve, reject });
}
exports.defer = defer;


/***/ }),

/***/ "./src/WebAdb/base/errors.ts":
/*!***********************************!*\
  !*** ./src/WebAdb/base/errors.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ignoreCacheUnactionableErrors = exports.getErrorMessage = void 0;
// Attempt to coerce an error object into a string message.
// Sometimes an error message is wrapped in an Error object, sometimes not.
function getErrorMessage(e) {
    if (e && typeof e === 'object') {
        const errorObject = e;
        if (errorObject.message) { // regular Error Object
            return String(errorObject.message);
        }
        else if (errorObject.error?.message) { // API result
            return String(errorObject.error.message);
        }
    }
    const asString = String(e);
    if (asString === '[object Object]') {
        try {
            return JSON.stringify(e);
        }
        catch (stringifyError) {
            // ignore failures and just fall through
        }
    }
    return asString;
}
exports.getErrorMessage = getErrorMessage;
// Occasionally operations using the cache API throw:
// 'UnknownError: Unexpected internal error. {}'
// It's not clear under which circumstances this can occur. A dive of
// the Chromium code didn't shed much light:
// https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/modules/cache_storage/cache_storage_error.cc;l=26;drc=4cfe86482b000e848009077783ba35f83f3c3cfe
// https://source.chromium.org/chromium/chromium/src/+/main:content/browser/cache_storage/cache_storage_cache.cc;l=1686;drc=ab68c05beb790d04d1cb7fd8faa0a197fb40d399
// Given the error is not actionable at present and caching is 'best
// effort' in any case ignore this error. We will want to throw for
// errors in general though so as not to hide errors we actually could
// fix.
// See b/227785665 for an example.
function ignoreCacheUnactionableErrors(e, result) {
    if (getErrorMessage(e).includes('UnknownError')) {
        return result;
    }
    else {
        throw e;
    }
}
exports.ignoreCacheUnactionableErrors = ignoreCacheUnactionableErrors;


/***/ }),

/***/ "./src/WebAdb/base/logging.ts":
/*!************************************!*\
  !*** ./src/WebAdb/base/logging.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Copyright (C) 2018 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assertUnreachable = exports.reportError = exports.setErrorHandler = exports.assertFalse = exports.assertTrue = exports.assertExists = void 0;
let errorHandler = (_) => { };
function assertExists(value) {
    if (value === null || value === undefined) {
        throw new Error('Value doesn\'t exist');
    }
    return value;
}
exports.assertExists = assertExists;
function assertTrue(value, optMsg) {
    if (!value) {
        throw new Error(optMsg ?? 'Failed assertion');
    }
}
exports.assertTrue = assertTrue;
function assertFalse(value, optMsg) {
    assertTrue(!value, optMsg);
}
exports.assertFalse = assertFalse;
function setErrorHandler(handler) {
    errorHandler = handler;
}
exports.setErrorHandler = setErrorHandler;
function reportError(err) {
    let errLog = '';
    let errorObj = undefined;
    if (err instanceof ErrorEvent) {
        errLog = err.message;
        errorObj = err.error;
    }
    else if (err instanceof PromiseRejectionEvent) {
        errLog = `${err.reason}`;
        errorObj = err.reason;
    }
    else {
        errLog = `${err}`;
    }
    if (errorObj !== undefined && errorObj !== null) {
        const errStack = errorObj.stack;
        errLog += '\n';
        errLog += errStack !== undefined ? errStack : JSON.stringify(errorObj);
    }
    errLog += '\n\n';
    errLog += `UA: ${navigator.userAgent}\n`;
    console.error(errLog, err);
    errorHandler(errLog);
}
exports.reportError = reportError;
// This function serves two purposes.
// 1) A runtime check - if we are ever called, we throw an exception.
// This is useful for checking that code we suspect should never be reached is
// actually never reached.
// 2) A compile time check where typescript asserts that the value passed can be
// cast to the "never" type.
// This is useful for ensuring we exhastively check union types.
function assertUnreachable(_x) {
    throw new Error('This code should not be reachable');
}
exports.assertUnreachable = assertUnreachable;


/***/ }),

/***/ "./src/WebAdb/base/object_utils.ts":
/*!*****************************************!*\
  !*** ./src/WebAdb/base/object_utils.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Copyright (C) 2023 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isEnumValue = exports.isString = exports.shallowEquals = exports.lookupPath = void 0;
// Given an object, return a ref to the object or item at at a given path.
// A path is defined using an array of path-like elements: I.e. [string|number].
// Returns undefined if the path doesn't exist.
// Note: This is an appropriate use of `any`, as we are knowingly getting fast
// and loose with the type system in this function: it's basically JavaScript.
// Attempting to pretend it's anything else would result in superfluous type
// assertions which would have no benefit.
// I'm sure we could convince TypeScript to follow the path and type everything
// correctly along the way, but that's a job for another day.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lookupPath(value, path) {
    let o = value;
    for (const p of path) {
        if (p in o) {
            o = o[p];
        }
        else {
            return undefined;
        }
    }
    return o;
}
exports.lookupPath = lookupPath;
function shallowEquals(a, b) {
    if (a === b) {
        return true;
    }
    if (a === undefined || b === undefined) {
        return false;
    }
    if (a === null || b === null) {
        return false;
    }
    const objA = a;
    const objB = b;
    for (const key of Object.keys(objA)) {
        if (objA[key] !== objB[key]) {
            return false;
        }
    }
    for (const key of Object.keys(objB)) {
        if (objA[key] !== objB[key]) {
            return false;
        }
    }
    return true;
}
exports.shallowEquals = shallowEquals;
function isString(s) {
    return typeof s === 'string' || s instanceof String;
}
exports.isString = isString;
// Given a string enum |enum|, check that |value| is a valid member of |enum|.
function isEnumValue(enm, value) {
    return Object.values(enm).includes(value);
}
exports.isEnumValue = isEnumValue;


/***/ }),

/***/ "./src/WebAdb/base/string_utils.ts":
/*!*****************************************!*\
  !*** ./src/WebAdb/base/string_utils.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2019 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.undoCommonChatAppReplacements = exports.sqliteString = exports.binaryDecode = exports.binaryEncode = exports.utf8Decode = exports.utf8Encode = exports.hexEncode = exports.base64Decode = exports.base64Encode = void 0;
const base64_1 = __webpack_require__(/*! @protobufjs/base64 */ "./node_modules/@protobufjs/base64/index.js");
const utf8_1 = __webpack_require__(/*! @protobufjs/utf8 */ "./node_modules/@protobufjs/utf8/index.js");
const logging_1 = __webpack_require__(/*! ./logging */ "./src/WebAdb/base/logging.ts");
// TextDecoder/Decoder requires the full DOM and isn't available in all types
// of tests. Use fallback implementation from protbufjs.
let Utf8Decoder;
let Utf8Encoder;
try {
    Utf8Decoder = new TextDecoder('utf-8');
    Utf8Encoder = new TextEncoder();
}
catch (_) {
    if (typeof process === 'undefined') {
        // Silence the warning when we know we are running under NodeJS.
        console.warn('Using fallback UTF8 Encoder/Decoder, This should happen only in ' +
            'tests and NodeJS-based environments, not in browsers.');
    }
    Utf8Decoder = { decode: (buf) => (0, utf8_1.read)(buf, 0, buf.length) };
    Utf8Encoder = {
        encode: (str) => {
            const arr = new Uint8Array((0, utf8_1.length)(str));
            const written = (0, utf8_1.write)(str, arr, 0);
            (0, logging_1.assertTrue)(written === arr.length);
            return arr;
        },
    };
}
function base64Encode(buffer) {
    return (0, base64_1.encode)(buffer, 0, buffer.length);
}
exports.base64Encode = base64Encode;
function base64Decode(str) {
    // if the string is in base64url format, convert to base64
    const b64 = str.replaceAll('-', '+').replaceAll('_', '/');
    const arr = new Uint8Array((0, base64_1.length)(b64));
    const written = (0, base64_1.decode)(b64, arr, 0);
    (0, logging_1.assertTrue)(written === arr.length);
    return arr;
}
exports.base64Decode = base64Decode;
// encode binary array to hex string
function hexEncode(bytes) {
    return bytes.reduce((prev, cur) => prev + ('0' + cur.toString(16)).slice(-2), '');
}
exports.hexEncode = hexEncode;
function utf8Encode(str) {
    return Utf8Encoder.encode(str);
}
exports.utf8Encode = utf8Encode;
// Note: not all byte sequences can be converted to<>from UTF8. This can be
// used only with valid unicode strings, not arbitrary byte buffers.
function utf8Decode(buffer) {
    return Utf8Decoder.decode(buffer);
}
exports.utf8Decode = utf8Decode;
// The binaryEncode/Decode functions below allow to encode an arbitrary binary
// buffer into a string that can be JSON-encoded. binaryEncode() applies
// UTF-16 encoding to each byte individually.
// Unlike utf8Encode/Decode, any arbitrary byte sequence can be converted into a
// valid string, and viceversa.
// This should be only used when a byte array needs to be transmitted over an
// interface that supports only JSON serialization (e.g., postmessage to a
// chrome extension).
function binaryEncode(buf) {
    let str = '';
    for (let i = 0; i < buf.length; i++) {
        str += String.fromCharCode(buf[i]);
    }
    return str;
}
exports.binaryEncode = binaryEncode;
function binaryDecode(str) {
    const buf = new Uint8Array(str.length);
    const strLen = str.length;
    for (let i = 0; i < strLen; i++) {
        buf[i] = str.charCodeAt(i);
    }
    return buf;
}
exports.binaryDecode = binaryDecode;
// A function used to interpolate strings into SQL query. The only replacement
// is done is that single quote replaced with two single quotes, according to
// SQLite documentation:
// https://www.sqlite.org/lang_expr.html#literal_values_constants_
//
// The purpose of this function is to use in simple comparisons, to escape
// strings used in GLOB clauses see escapeQuery function.
function sqliteString(str) {
    return `'${str.replaceAll('\'', '\'\'')}'`;
}
exports.sqliteString = sqliteString;
// Chat apps (including G Chat) sometimes replace ASCII characters with similar
// looking unicode characters that break code snippets.
// This function attempts to undo these replacements.
function undoCommonChatAppReplacements(str) {
    // Replace non-breaking spaces with normal spaces.
    return str.replaceAll('\u00A0', ' ');
}
exports.undoCommonChatAppReplacements = undoCommonChatAppReplacements;


/***/ }),

/***/ "./src/WebAdb/common/array_buffer_builder.ts":
/*!***************************************************!*\
  !*** ./src/WebAdb/common/array_buffer_builder.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ArrayBufferBuilder = void 0;
const utf8_1 = __webpack_require__(/*! @protobufjs/utf8 */ "./node_modules/@protobufjs/utf8/index.js");
const logging_1 = __webpack_require__(/*! ../base/logging */ "./src/WebAdb/base/logging.ts");
const object_utils_1 = __webpack_require__(/*! ../base/object_utils */ "./src/WebAdb/base/object_utils.ts");
// Return the length, in bytes, of a token to be inserted.
function tokenLength(token) {
    if ((0, object_utils_1.isString)(token)) {
        return (0, utf8_1.length)(token);
    }
    else if (token instanceof Uint8Array) {
        return token.byteLength;
    }
    else {
        (0, logging_1.assertTrue)(token >= 0 && token <= 0xffffffff);
        // 32-bit integers take 4 bytes
        return 4;
    }
}
// Insert a token into the buffer, at position `byteOffset`.
//
// @param dataView A DataView into the buffer to write into.
// @param typedArray A Uint8Array view into the buffer to write into.
// @param byteOffset Position to write at, in the buffer.
// @param token Token to insert into the buffer.
function insertToken(dataView, typedArray, byteOffset, token) {
    if ((0, object_utils_1.isString)(token)) {
        // Encode the string in UTF-8
        const written = (0, utf8_1.write)(token, typedArray, byteOffset);
        (0, logging_1.assertTrue)(written === (0, utf8_1.length)(token));
    }
    else if (token instanceof Uint8Array) {
        // Copy the bytes from the other array
        typedArray.set(token, byteOffset);
    }
    else {
        (0, logging_1.assertTrue)(token >= 0 && token <= 0xffffffff);
        // 32-bit little-endian value
        dataView.setUint32(byteOffset, token, true);
    }
}
// Like a string builder, but for an ArrayBuffer instead of a string. This
// allows us to assemble messages to send/receive over the wire. Data can be
// appended to the buffer using `append()`. The data we append can be of the
// following types:
//
// - string: the ASCII string is appended. Throws an error if there are
//           non-ASCII characters.
// - number: the number is appended as a 32-bit little-endian integer.
// - Uint8Array: the bytes are appended as-is to the buffer.
class ArrayBufferBuilder {
    constructor() {
        this.tokens = [];
    }
    // Return an `ArrayBuffer` that is the concatenation of all the tokens.
    toArrayBuffer() {
        // Calculate the size of the buffer we need.
        let byteLength = 0;
        for (const token of this.tokens) {
            byteLength += tokenLength(token);
        }
        // Allocate the buffer.
        const buffer = new ArrayBuffer(byteLength);
        const dataView = new DataView(buffer);
        const typedArray = new Uint8Array(buffer);
        // Fill the buffer with the tokens.
        let byteOffset = 0;
        for (const token of this.tokens) {
            insertToken(dataView, typedArray, byteOffset, token);
            byteOffset += tokenLength(token);
        }
        (0, logging_1.assertTrue)(byteOffset === byteLength);
        // Return the values.
        return buffer;
    }
    // Add one or more tokens to the value of this object.
    append(token) {
        this.tokens.push(token);
    }
}
exports.ArrayBufferBuilder = ArrayBufferBuilder;


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/adb_connection_impl.ts":
/*!**************************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/adb_connection_impl.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdbConnectionImpl = void 0;
const custom_utils_1 = __webpack_require__(/*! custom_utils */ "./src/WebAdb/base/utils/index-browser.js");
const deferred_1 = __webpack_require__(/*! ../../base/deferred */ "./src/WebAdb/base/deferred.ts");
const array_buffer_builder_1 = __webpack_require__(/*! ../array_buffer_builder */ "./src/WebAdb/common/array_buffer_builder.ts");
const adb_file_handler_1 = __webpack_require__(/*! ./adb_file_handler */ "./src/WebAdb/common/recordingV2/adb_file_handler.ts");
const textDecoder = new custom_utils_1._TextDecoder();
class AdbConnectionImpl {
    constructor() {
        // onStatus and onDisconnect are set to callbacks passed from the caller.
        // This happens for instance in the AndroidWebusbTarget, which instantiates
        // them with callbacks passed from the UI.
        this.onStatus = () => { };
        this.onDisconnect = (_) => { };
    }
    // Starts a shell command, and returns a promise resolved when the command
    // completes.
    async shellAndWaitCompletion(cmd) {
        const adbStream = await this.shell(cmd);
        const onStreamingEnded = (0, deferred_1.defer)();
        // We wait for the stream to be closed by the device, which happens
        // after the shell command is successfully received.
        adbStream.addOnStreamCloseCallback(() => {
            onStreamingEnded.resolve();
        });
        return onStreamingEnded;
    }
    // Starts a shell command, then gathers all its output and returns it as
    // a string.
    async shellAndGetOutput(cmd) {
        const adbStream = await this.shell(cmd);
        const commandOutput = new array_buffer_builder_1.ArrayBufferBuilder();
        const onStreamingEnded = (0, deferred_1.defer)();
        adbStream.addOnStreamDataCallback((data) => {
            commandOutput.append(data);
        });
        adbStream.addOnStreamCloseCallback(() => {
            onStreamingEnded.resolve(textDecoder.decode(commandOutput.toArrayBuffer()));
        });
        return onStreamingEnded;
    }
    async push(binary, path) {
        const byteStream = await this.openStream('sync:');
        await (new adb_file_handler_1.AdbFileHandler(byteStream)).pushBinary(binary, path);
        // We need to wait until the bytestream is closed. Otherwise, we can have a
        // race condition:
        // If this is the last stream, it will try to disconnect the device. In the
        // meantime, the caller might create another stream which will try to open
        // the device.
        await byteStream.closeAndWaitForTeardown();
    }
}
exports.AdbConnectionImpl = AdbConnectionImpl;


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/adb_connection_over_webusb.ts":
/*!*********************************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/adb_connection_over_webusb.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdbOverWebusbStream = exports.AdbConnectionOverWebusb = exports.AdbState = exports.DEFAULT_MAX_PAYLOAD_BYTES = exports.VERSION_NO_CHECKSUM = exports.VERSION_WITH_CHECKSUM = void 0;
const custom_utils_1 = __webpack_require__(/*! custom_utils */ "./src/WebAdb/base/utils/index-browser.js");
const deferred_1 = __webpack_require__(/*! ../../base/deferred */ "./src/WebAdb/base/deferred.ts");
const logging_1 = __webpack_require__(/*! ../../base/logging */ "./src/WebAdb/base/logging.ts");
const object_utils_1 = __webpack_require__(/*! ../../base/object_utils */ "./src/WebAdb/base/object_utils.ts");
const adb_connection_impl_1 = __webpack_require__(/*! ./adb_connection_impl */ "./src/WebAdb/common/recordingV2/adb_connection_impl.ts");
const adb_key_manager_1 = __webpack_require__(/*! ./auth/adb_key_manager */ "./src/WebAdb/common/recordingV2/auth/adb_key_manager.ts");
const recording_error_handling_1 = __webpack_require__(/*! ./recording_error_handling */ "./src/WebAdb/common/recordingV2/recording_error_handling.ts");
const recording_utils_1 = __webpack_require__(/*! ./recording_utils */ "./src/WebAdb/common/recordingV2/recording_utils.ts");
const textEncoder = new custom_utils_1._TextEncoder();
const textDecoder = new custom_utils_1._TextDecoder();
exports.VERSION_WITH_CHECKSUM = 0x01000000;
exports.VERSION_NO_CHECKSUM = 0x01000001;
exports.DEFAULT_MAX_PAYLOAD_BYTES = 256 * 1024;
var AdbState;
(function (AdbState) {
    AdbState[AdbState["DISCONNECTED"] = 0] = "DISCONNECTED";
    // Authentication steps, see AdbConnectionOverWebUsb's handleAuthentication().
    AdbState[AdbState["AUTH_STARTED"] = 1] = "AUTH_STARTED";
    AdbState[AdbState["AUTH_WITH_PRIVATE"] = 2] = "AUTH_WITH_PRIVATE";
    AdbState[AdbState["AUTH_WITH_PUBLIC"] = 3] = "AUTH_WITH_PUBLIC";
    AdbState[AdbState["CONNECTED"] = 4] = "CONNECTED";
})(AdbState || (exports.AdbState = AdbState = {}));
var AuthCmd;
(function (AuthCmd) {
    AuthCmd[AuthCmd["TOKEN"] = 1] = "TOKEN";
    AuthCmd[AuthCmd["SIGNATURE"] = 2] = "SIGNATURE";
    AuthCmd[AuthCmd["RSAPUBLICKEY"] = 3] = "RSAPUBLICKEY";
})(AuthCmd || (AuthCmd = {}));
function generateChecksum(data) {
    let res = 0;
    for (let i = 0; i < data.byteLength; i++)
        res += data[i];
    return res & 0xFFFFFFFF;
}
class AdbConnectionOverWebusb extends adb_connection_impl_1.AdbConnectionImpl {
    // We use a key pair for authenticating with the device, which we do in
    // two ways:
    // - Firstly, signing with the private key.
    // - Secondly, sending over the public key (at which point the device asks the
    //   user for permissions).
    // Once we've sent the public key, for future recordings we only need to
    // sign with the private key, so the user doesn't need to give permissions
    // again.
    constructor(device, keyManager) {
        super();
        this.device = device;
        this.keyManager = keyManager;
        this.state = AdbState.DISCONNECTED;
        this.connectingStreams = new Map();
        this.streams = new Set();
        this.maxPayload = exports.DEFAULT_MAX_PAYLOAD_BYTES;
        this.writeInProgress = false;
        this.writeQueue = [];
        // Devices after Dec 2017 don't use checksum. This will be auto-detected
        // during the connection.
        this.useChecksum = true;
        this.lastStreamId = 0;
        this.usbReadEndpoint = -1;
        this.usbWriteEpEndpoint = -1;
        this.isUsbReceiveLoopRunning = false;
        this.pendingConnPromises = [];
    }
    shell(cmd) {
        return this.openStream('shell:' + cmd);
    }
    connectSocket(path) {
        return this.openStream(path);
    }
    async canConnectWithoutContention() {
        await this.device.open();
        const usbInterfaceNumber = await this.setupUsbInterface();
        try {
            await this.device.claimInterface(usbInterfaceNumber);
            await this.device.releaseInterface(usbInterfaceNumber);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async openStream(destination) {
        const streamId = ++this.lastStreamId;
        const connectingStream = (0, deferred_1.defer)();
        this.connectingStreams.set(streamId, connectingStream);
        // We create the stream before trying to establish the connection, so
        // that if we fail to connect, we will reject the connecting stream.
        await this.ensureConnectionEstablished();
        await this.sendMessage('OPEN', streamId, 0, destination);
        return connectingStream;
    }
    async ensureConnectionEstablished() {
        if (this.state === AdbState.CONNECTED) {
            return;
        }
        if (this.state === AdbState.DISCONNECTED) {
            await this.device.open();
            if (!(await this.canConnectWithoutContention())) {
                await this.device.reset();
            }
            const usbInterfaceNumber = await this.setupUsbInterface();
            await this.device.claimInterface(usbInterfaceNumber);
        }
        await this.startAdbAuth();
        if (!this.isUsbReceiveLoopRunning) {
            this.usbReceiveLoop();
        }
        const connPromise = (0, deferred_1.defer)();
        this.pendingConnPromises.push(connPromise);
        await connPromise;
    }
    async setupUsbInterface() {
        const interfaceAndEndpoint = (0, recording_utils_1.findInterfaceAndEndpoint)(this.device);
        // `findInterfaceAndEndpoint` will always return a non-null value because
        // we check for this in 'android_webusb_target_factory'. If no interface and
        // endpoints are found, we do not create a target, so we can not connect to
        // it, so we will never reach this logic.
        const { configurationValue, usbInterfaceNumber, endpoints } = (0, logging_1.assertExists)(interfaceAndEndpoint);
        this.usbInterfaceNumber = usbInterfaceNumber;
        this.usbReadEndpoint = this.findEndpointNumber(endpoints, 'in');
        this.usbWriteEpEndpoint = this.findEndpointNumber(endpoints, 'out');
        (0, logging_1.assertTrue)(this.usbReadEndpoint >= 0 && this.usbWriteEpEndpoint >= 0);
        await this.device.selectConfiguration(configurationValue);
        return usbInterfaceNumber;
    }
    async streamClose(stream) {
        const otherStreamsQueue = this.writeQueue.filter((queueElement) => queueElement.localStreamId !== stream.localStreamId);
        const droppedPacketCount = this.writeQueue.length - otherStreamsQueue.length;
        if (droppedPacketCount > 0) {
            console.debug(`Dropping ${droppedPacketCount} queued messages due to stream closing.`);
            this.writeQueue = otherStreamsQueue;
        }
        this.streams.delete(stream);
        if (this.streams.size === 0) {
            // We disconnect BEFORE calling `signalStreamClosed`. Otherwise, there can
            // be a race condition:
            // Stream A: streamA.onStreamClose
            // Stream B: device.open
            // Stream A: device.releaseInterface
            // Stream B: device.transferOut -> CRASH
            await this.disconnect();
        }
        stream.signalStreamClosed();
    }
    streamWrite(msg, stream) {
        const raw = ((0, object_utils_1.isString)(msg)) ? textEncoder.encode(msg) : msg;
        if (this.writeInProgress) {
            this.writeQueue.push({ message: raw, localStreamId: stream.localStreamId });
            return;
        }
        this.writeInProgress = true;
        this.sendMessage('WRTE', stream.localStreamId, stream.remoteStreamId, raw);
    }
    // We disconnect in 2 cases:
    // 1. When we close the last stream of the connection. This is to prevent the
    // browser holding onto the USB interface after having finished a trace
    // recording, which would make it impossible to use "adb shell" from the same
    // machine until the browser is closed.
    // 2. When we get a USB disconnect event. This happens for instance when the
    // device is unplugged.
    async disconnect(disconnectMessage) {
        if (this.state === AdbState.DISCONNECTED) {
            return;
        }
        // Clear the resources in a synchronous method, because this can be used
        // for error handling callbacks as well.
        this.reachDisconnectState(disconnectMessage);
        // We have already disconnected so there is no need to pass a callback
        // which clears resources or notifies the user into 'wrapRecordingError'.
        await (0, recording_error_handling_1.wrapRecordingError)(this.device.releaseInterface((0, logging_1.assertExists)(this.usbInterfaceNumber)), () => { });
        this.usbInterfaceNumber = undefined;
    }
    // This is a synchronous method which clears all resources.
    // It can be used as a callback for error handling.
    reachDisconnectState(disconnectMessage) {
        // We need to delete the streams BEFORE checking the Adb state because:
        //
        // We create streams before changing the Adb state from DISCONNECTED.
        // In case we can not claim the device, we will create a stream, but fail
        // to connect to the WebUSB device so the state will remain DISCONNECTED.
        const streamsToDelete = this.connectingStreams.entries();
        // Clear the streams before rejecting so we are not caught in a loop of
        // handling promise rejections.
        this.connectingStreams.clear();
        for (const [id, stream] of streamsToDelete) {
            stream.reject(`Failed to open stream with id ${id} because adb was disconnected.`);
        }
        if (this.state === AdbState.DISCONNECTED) {
            return;
        }
        this.state = AdbState.DISCONNECTED;
        this.writeInProgress = false;
        this.writeQueue = [];
        this.streams.forEach((stream) => stream.close());
        this.onDisconnect(disconnectMessage);
    }
    async startAdbAuth() {
        const VERSION = this.useChecksum ? exports.VERSION_WITH_CHECKSUM : exports.VERSION_NO_CHECKSUM;
        this.state = AdbState.AUTH_STARTED;
        await this.sendMessage('CNXN', VERSION, this.maxPayload, 'host:1:UsbADB');
    }
    findEndpointNumber(endpoints, direction, type = 'bulk') {
        const ep = endpoints.find((ep) => ep.type === type && ep.direction === direction);
        if (ep)
            return ep.endpointNumber;
        throw new recording_error_handling_1.RecordingError(`Cannot find ${direction} endpoint`);
    }
    async usbReceiveLoop() {
        (0, logging_1.assertFalse)(this.isUsbReceiveLoopRunning);
        this.isUsbReceiveLoopRunning = true;
        for (; this.state !== AdbState.DISCONNECTED;) {
            const res = await this.wrapUsb(this.device.transferIn(this.usbReadEndpoint, ADB_MSG_SIZE));
            if (!res) {
                this.isUsbReceiveLoopRunning = false;
                return;
            }
            if (res.status !== 'ok') {
                // Log and ignore messages with invalid status. These can occur
                // when the device is connected/disconnected repeatedly.
                console.error(`Received message with unexpected status '${res.status}'`);
                continue;
            }
            const msg = AdbMsg.decodeHeader(res.data);
            if (msg.dataLen > 0) {
                const resp = await this.wrapUsb(this.device.transferIn(this.usbReadEndpoint, msg.dataLen));
                if (!resp) {
                    this.isUsbReceiveLoopRunning = false;
                    return;
                }
                msg.data = new Uint8Array(resp.data.buffer, resp.data.byteOffset, resp.data.byteLength);
            }
            if (this.useChecksum && generateChecksum(msg.data) !== msg.dataChecksum) {
                // We ignore messages with an invalid checksum. These sometimes appear
                // when the page is re-loaded in a middle of a recording.
                continue;
            }
            // The server can still send messages streams for previous streams.
            // This happens for instance if we record, reload the recording page and
            // then record again. We can also receive a 'WRTE' or 'OKAY' after
            // we have sent a 'CLSE' and marked the state as disconnected.
            if ((msg.cmd === 'CLSE' || msg.cmd === 'WRTE') &&
                !this.getStreamForLocalStreamId(msg.arg1)) {
                continue;
            }
            else if (msg.cmd === 'OKAY' && !this.connectingStreams.has(msg.arg1) &&
                !this.getStreamForLocalStreamId(msg.arg1)) {
                continue;
            }
            else if (msg.cmd === 'AUTH' && msg.arg0 === AuthCmd.TOKEN &&
                this.state === AdbState.AUTH_WITH_PUBLIC) {
                // If we start a recording but fail because of a faulty physical
                // connection to the device, when we start a new recording, we will
                // received multiple AUTH tokens, of which we should ignore all but
                // one.
                continue;
            }
            // handle the ADB message from the device
            if (msg.cmd === 'CLSE') {
                (0, logging_1.assertExists)(this.getStreamForLocalStreamId(msg.arg1)).close();
            }
            else if (msg.cmd === 'AUTH' && msg.arg0 === AuthCmd.TOKEN) {
                const key = await this.keyManager.getKey();
                if (this.state === AdbState.AUTH_STARTED) {
                    // During this step, we send back the token received signed with our
                    // private key. If the device has previously received our public key,
                    // the dialog asking for user confirmation will not be displayed on
                    // the device.
                    this.state = AdbState.AUTH_WITH_PRIVATE;
                    await this.sendMessage('AUTH', AuthCmd.SIGNATURE, 0, key.sign(msg.data));
                }
                else {
                    // If our signature with the private key is not accepted by the
                    // device, we generate a new keypair and send the public key.
                    this.state = AdbState.AUTH_WITH_PUBLIC;
                    await this.sendMessage('AUTH', AuthCmd.RSAPUBLICKEY, 0, key.getPublicKey() + '\0');
                    this.onStatus(recording_utils_1.ALLOW_USB_DEBUGGING);
                    await (0, adb_key_manager_1.maybeStoreKey)(key);
                }
            }
            else if (msg.cmd === 'CNXN') {
                //assertTrue(
                //    [AdbState.AUTH_WITH_PRIVATE, AdbState.AUTH_WITH_PUBLIC].includes(
                //        this.state));
                this.state = AdbState.CONNECTED;
                this.maxPayload = msg.arg1;
                const deviceVersion = msg.arg0;
                if (![exports.VERSION_WITH_CHECKSUM, exports.VERSION_NO_CHECKSUM].includes(deviceVersion)) {
                    throw new recording_error_handling_1.RecordingError(`Version ${msg.arg0} not supported.`);
                }
                this.useChecksum = deviceVersion === exports.VERSION_WITH_CHECKSUM;
                this.state = AdbState.CONNECTED;
                // This will resolve the promises awaited by
                // "ensureConnectionEstablished".
                this.pendingConnPromises.forEach((connPromise) => connPromise.resolve());
                this.pendingConnPromises = [];
            }
            else if (msg.cmd === 'OKAY') {
                if (this.connectingStreams.has(msg.arg1)) {
                    const connectingStream = (0, logging_1.assertExists)(this.connectingStreams.get(msg.arg1));
                    const stream = new AdbOverWebusbStream(this, msg.arg1, msg.arg0);
                    this.streams.add(stream);
                    this.connectingStreams.delete(msg.arg1);
                    connectingStream.resolve(stream);
                }
                else {
                    (0, logging_1.assertTrue)(this.writeInProgress);
                    this.writeInProgress = false;
                    for (; this.writeQueue.length;) {
                        // We go through the queued writes and choose the first one
                        // corresponding to a stream that's still active.
                        const queuedElement = (0, logging_1.assertExists)(this.writeQueue.shift());
                        const queuedStream = this.getStreamForLocalStreamId(queuedElement.localStreamId);
                        if (queuedStream) {
                            queuedStream.write(queuedElement.message);
                            break;
                        }
                    }
                }
            }
            else if (msg.cmd === 'WRTE') {
                const stream = (0, logging_1.assertExists)(this.getStreamForLocalStreamId(msg.arg1));
                await this.sendMessage('OKAY', stream.localStreamId, stream.remoteStreamId);
                stream.signalStreamData(msg.data);
            }
            else {
                this.isUsbReceiveLoopRunning = false;
                throw new recording_error_handling_1.RecordingError(`Unexpected message ${msg} in state ${this.state}`);
            }
        }
        this.isUsbReceiveLoopRunning = false;
    }
    getStreamForLocalStreamId(localStreamId) {
        for (const stream of this.streams) {
            if (stream.localStreamId === localStreamId) {
                return stream;
            }
        }
        return undefined;
    }
    //  The header and the message data must be sent consecutively. Using 2 awaits
    //  Another message can interleave after the first header has been sent,
    //  resulting in something like [header1] [header2] [data1] [data2];
    //  In this way we are waiting both promises to be resolved before continuing.
    async sendMessage(cmd, arg0, arg1, data) {
        const msg = AdbMsg.create({ cmd, arg0, arg1, data, useChecksum: this.useChecksum });
        const msgHeader = msg.encodeHeader();
        const msgData = msg.data;
        (0, logging_1.assertTrue)(msgHeader.length <= this.maxPayload &&
            msgData.length <= this.maxPayload);
        const sendPromises = [this.wrapUsb(this.device.transferOut(this.usbWriteEpEndpoint, msgHeader.buffer))];
        if (msg.data.length > 0) {
            sendPromises.push(this.wrapUsb(this.device.transferOut(this.usbWriteEpEndpoint, msgData.buffer)));
        }
        await Promise.all(sendPromises);
    }
    wrapUsb(promise) {
        return (0, recording_error_handling_1.wrapRecordingError)(promise, this.reachDisconnectState.bind(this));
    }
}
exports.AdbConnectionOverWebusb = AdbConnectionOverWebusb;
// An AdbOverWebusbStream is instantiated after the creation of a socket to the
// device. Thanks to this, we can send commands and receive their output.
// Messages are received in the main adb class, and are forwarded to an instance
// of this class based on a stream id match.
class AdbOverWebusbStream {
    constructor(adb, localStreamId, remoteStreamId) {
        this.onStreamDataCallbacks = [];
        this.onStreamCloseCallbacks = [];
        this.remoteStreamId = -1;
        this.adbConnection = adb;
        this.localStreamId = localStreamId;
        this.remoteStreamId = remoteStreamId;
        // When the stream is created, the connection has been already established.
        this._isConnected = true;
    }
    addOnStreamDataCallback(onStreamData) {
        this.onStreamDataCallbacks.push(onStreamData);
    }
    addOnStreamCloseCallback(onStreamClose) {
        this.onStreamCloseCallbacks.push(onStreamClose);
    }
    // Used by the connection object to signal newly received data, not exposed
    // in the interface.
    signalStreamData(data) {
        for (const onStreamData of this.onStreamDataCallbacks) {
            onStreamData(data);
        }
    }
    // Used by the connection object to signal the stream is closed, not exposed
    // in the interface.
    signalStreamClosed() {
        for (const onStreamClose of this.onStreamCloseCallbacks) {
            onStreamClose();
        }
        this.onStreamDataCallbacks = [];
        this.onStreamCloseCallbacks = [];
    }
    close() {
        this.closeAndWaitForTeardown();
    }
    async closeAndWaitForTeardown() {
        this._isConnected = false;
        await this.adbConnection.streamClose(this);
    }
    write(msg) {
        this.adbConnection.streamWrite(msg, this);
    }
    isConnected() {
        return this._isConnected;
    }
}
exports.AdbOverWebusbStream = AdbOverWebusbStream;
const ADB_MSG_SIZE = 6 * 4; // 6 * int32.
class AdbMsg {
    constructor(cmd, arg0, arg1, dataLen, dataChecksum, useChecksum = false) {
        (0, logging_1.assertTrue)(cmd.length === 4);
        this.cmd = cmd;
        this.arg0 = arg0;
        this.arg1 = arg1;
        this.dataLen = dataLen;
        this.data = new Uint8Array(dataLen);
        this.dataChecksum = dataChecksum;
        this.useChecksum = useChecksum;
    }
    static create({ cmd, arg0, arg1, data, useChecksum = true }) {
        const encodedData = this.encodeData(data);
        const msg = new AdbMsg(cmd, arg0, arg1, encodedData.length, 0, useChecksum);
        msg.data = encodedData;
        return msg;
    }
    get dataStr() {
        return textDecoder.decode(this.data);
    }
    toString() {
        return `${this.cmd} [${this.arg0},${this.arg1}] ${this.dataStr}`;
    }
    // A brief description of the message can be found here:
    // https://android.googlesource.com/platform/system/core/+/main/adb/protocol.txt
    //
    // struct amessage {
    //     uint32_t command;    // command identifier constant
    //     uint32_t arg0;       // first argument
    //     uint32_t arg1;       // second argument
    //     uint32_t data_length;// length of payload (0 is allowed)
    //     uint32_t data_check; // checksum of data payload
    //     uint32_t magic;      // command ^ 0xffffffff
    // };
    static decodeHeader(dv) {
        (0, logging_1.assertTrue)(dv.byteLength === ADB_MSG_SIZE);
        const cmd = textDecoder.decode(dv.buffer.slice(0, 4));
        const cmdNum = dv.getUint32(0, true);
        const arg0 = dv.getUint32(4, true);
        const arg1 = dv.getUint32(8, true);
        const dataLen = dv.getUint32(12, true);
        const dataChecksum = dv.getUint32(16, true);
        const cmdChecksum = dv.getUint32(20, true);
        (0, logging_1.assertTrue)(cmdNum === (cmdChecksum ^ 0xFFFFFFFF));
        return new AdbMsg(cmd, arg0, arg1, dataLen, dataChecksum);
    }
    encodeHeader() {
        const buf = new Uint8Array(ADB_MSG_SIZE);
        const dv = new DataView(buf.buffer);
        const cmdBytes = textEncoder.encode(this.cmd);
        const rawMsg = AdbMsg.encodeData(this.data);
        const checksum = this.useChecksum ? generateChecksum(rawMsg) : 0;
        for (let i = 0; i < 4; i++)
            dv.setUint8(i, cmdBytes[i]);
        dv.setUint32(4, this.arg0, true);
        dv.setUint32(8, this.arg1, true);
        dv.setUint32(12, rawMsg.byteLength, true);
        dv.setUint32(16, checksum, true);
        dv.setUint32(20, dv.getUint32(0, true) ^ 0xFFFFFFFF, true);
        return buf;
    }
    static encodeData(data) {
        if (data === undefined)
            return new Uint8Array([]);
        if ((0, object_utils_1.isString)(data))
            return textEncoder.encode(data + '\0');
        return data;
    }
}


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/adb_file_handler.ts":
/*!***********************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/adb_file_handler.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdbFileHandler = void 0;
const custom_utils_1 = __webpack_require__(/*! custom_utils */ "./src/WebAdb/base/utils/index-browser.js");
const deferred_1 = __webpack_require__(/*! ../../base/deferred */ "./src/WebAdb/base/deferred.ts");
const logging_1 = __webpack_require__(/*! ../../base/logging */ "./src/WebAdb/base/logging.ts");
const array_buffer_builder_1 = __webpack_require__(/*! ../array_buffer_builder */ "./src/WebAdb/common/array_buffer_builder.ts");
const recording_error_handling_1 = __webpack_require__(/*! ./recording_error_handling */ "./src/WebAdb/common/recordingV2/recording_error_handling.ts");
const recording_utils_1 = __webpack_require__(/*! ./recording_utils */ "./src/WebAdb/common/recordingV2/recording_utils.ts");
// https://cs.android.com/android/platform/superproject/+/main:packages/
// modules/adb/file_sync_protocol.h;l=144
const MAX_SYNC_SEND_CHUNK_SIZE = 64 * 1024;
// Adb does not accurately send some file permissions. If you need a special set
// of permissions, do not rely on this value. Rather, send a shell command which
// explicitly sets permissions, such as:
// 'shell:chmod ${permissions} ${path}'
const FILE_PERMISSIONS = 2 ** 15 + 0o644;
const textDecoder = new custom_utils_1._TextDecoder();
// For details about the protocol, see:
// https://cs.android.com/android/platform/superproject/+/main:packages/modules/adb/SYNC.TXT
class AdbFileHandler {
    constructor(byteStream) {
        this.byteStream = byteStream;
        this.sentByteCount = 0;
        this.isPushOngoing = false;
    }
    async pushBinary(binary, path) {
        // For a given byteStream, we only support pushing one binary at a time.
        (0, logging_1.assertFalse)(this.isPushOngoing);
        this.isPushOngoing = true;
        const transferFinished = (0, deferred_1.defer)();
        this.byteStream.addOnStreamDataCallback((data) => this.onStreamData(data, transferFinished));
        this.byteStream.addOnStreamCloseCallback(() => this.isPushOngoing = false);
        const sendMessage = new array_buffer_builder_1.ArrayBufferBuilder();
        // 'SEND' is the API method used to send a file to device.
        sendMessage.append('SEND');
        // The remote file name is split into two parts separated by the last
        // comma (","). The first part is the actual path, while the second is a
        // decimal encoded file mode containing the permissions of the file on
        // device.
        sendMessage.append(path.length + 6);
        sendMessage.append(path);
        sendMessage.append(',');
        sendMessage.append(FILE_PERMISSIONS.toString());
        this.byteStream.write(new Uint8Array(sendMessage.toArrayBuffer()));
        while (!(await this.sendNextDataChunk(binary)))
            ;
        return transferFinished;
    }
    onStreamData(data, transferFinished) {
        this.sentByteCount = 0;
        const response = textDecoder.decode(data);
        if (response.split('\n')[0].includes('FAIL')) {
            // Sample failure response (when the file is transferred successfully
            // but the date is not formatted correctly):
            // 'OKAYFAIL\npath too long'
            transferFinished.reject(new recording_error_handling_1.RecordingError(`${recording_utils_1.BINARY_PUSH_FAILURE}: ${response}`));
        }
        else if (textDecoder.decode(data).substring(0, 4) === 'OKAY') {
            // In case of success, the server responds to the last request with
            // 'OKAY'.
            transferFinished.resolve();
        }
        else {
            throw new recording_error_handling_1.RecordingError(`${recording_utils_1.BINARY_PUSH_UNKNOWN_RESPONSE}: ${response}`);
        }
    }
    async sendNextDataChunk(binary) {
        const endPosition = Math.min(this.sentByteCount + MAX_SYNC_SEND_CHUNK_SIZE, binary.byteLength);
        const chunk = await binary.slice(this.sentByteCount, endPosition);
        // The file is sent in chunks. Each chunk is prefixed with "DATA" and the
        // chunk length. This is repeated until the entire file is transferred. Each
        // chunk must not be larger than 64k.
        const chunkLength = chunk.byteLength;
        const dataMessage = new array_buffer_builder_1.ArrayBufferBuilder();
        dataMessage.append('DATA');
        dataMessage.append(chunkLength);
        dataMessage.append(new Uint8Array(chunk.buffer, chunk.byteOffset, chunkLength));
        this.sentByteCount += chunkLength;
        const isDone = this.sentByteCount === binary.byteLength;
        if (isDone) {
            // When the file is transferred a sync request "DONE" is sent, together
            // with a timestamp, representing the last modified time for the file. The
            // server responds to this last request.
            dataMessage.append('DONE');
            // We send the date in seconds.
            dataMessage.append(Math.floor(Date.now() / 1000));
        }
        this.byteStream.write(new Uint8Array(dataMessage.toArrayBuffer()));
        return isDone;
    }
}
exports.AdbFileHandler = AdbFileHandler;


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/auth/adb_auth.ts":
/*!********************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/auth/adb_auth.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdbKey = void 0;
const jsbn_rsa_1 = __webpack_require__(/*! jsbn-rsa */ "./node_modules/jsbn-rsa/jsbn.js");
const logging_1 = __webpack_require__(/*! ../../../base/logging */ "./src/WebAdb/base/logging.ts");
const string_utils_1 = __webpack_require__(/*! ../../../base/string_utils */ "./src/WebAdb/base/string_utils.ts");
const recording_error_handling_1 = __webpack_require__(/*! ../recording_error_handling */ "./src/WebAdb/common/recordingV2/recording_error_handling.ts");
const WORD_SIZE = 4;
const MODULUS_SIZE_BITS = 2048;
const MODULUS_SIZE = MODULUS_SIZE_BITS / 8;
const MODULUS_SIZE_WORDS = MODULUS_SIZE / WORD_SIZE;
const PUBKEY_ENCODED_SIZE = 3 * WORD_SIZE + 2 * MODULUS_SIZE;
const ADB_WEB_CRYPTO_ALGORITHM = {
    name: 'RSASSA-PKCS1-v1_5',
    hash: { name: 'SHA-1' },
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
    modulusLength: MODULUS_SIZE_BITS,
};
const ADB_WEB_CRYPTO_EXPORTABLE = true;
const ADB_WEB_CRYPTO_OPERATIONS = ['sign'];
const SIGNING_ASN1_PREFIX = [
    0x00,
    0x30,
    0x21,
    0x30,
    0x09,
    0x06,
    0x05,
    0x2B,
    0x0E,
    0x03,
    0x02,
    0x1A,
    0x05,
    0x00,
    0x04,
    0x14,
];
const R32 = jsbn_rsa_1.BigInteger.ONE.shiftLeft(32); // 1 << 32
function isValidJsonWebKey(key) {
    return key.n !== undefined && key.e !== undefined && key.d !== undefined &&
        key.p !== undefined && key.q !== undefined && key.dp !== undefined &&
        key.dq !== undefined && key.qi !== undefined;
}
// Convert a BigInteger to an array of a specified size in bytes.
function bigIntToFixedByteArray(bn, size) {
    const paddedBnBytes = bn.toByteArray();
    let firstNonZeroIndex = 0;
    while (firstNonZeroIndex < paddedBnBytes.length &&
        paddedBnBytes[firstNonZeroIndex] === 0) {
        firstNonZeroIndex++;
    }
    const bnBytes = Uint8Array.from(paddedBnBytes.slice(firstNonZeroIndex));
    const res = new Uint8Array(size);
    (0, logging_1.assertTrue)(bnBytes.length <= res.length);
    res.set(bnBytes, res.length - bnBytes.length);
    return res;
}
class AdbKey {
    constructor(jwkPrivate) {
        this.jwkPrivate = jwkPrivate;
    }
    static async GenerateNewKeyPair() {
        // Construct a new CryptoKeyPair and keep its private key in JWB format.
        const keyPair = await crypto.subtle.generateKey(ADB_WEB_CRYPTO_ALGORITHM, ADB_WEB_CRYPTO_EXPORTABLE, ADB_WEB_CRYPTO_OPERATIONS);
        const jwkPrivate = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
        if (!isValidJsonWebKey(jwkPrivate)) {
            throw new recording_error_handling_1.RecordingError('Could not generate a valid private key.');
        }
        return new AdbKey(jwkPrivate);
    }
    static DeserializeKey(serializedKey) {
        return new AdbKey(JSON.parse(serializedKey));
    }
    // Perform an RSA signing operation for the ADB auth challenge.
    //
    // For the RSA signature, the token is expected to have already
    // had the SHA-1 message digest applied.
    //
    // However, the adb token we receive from the device is made up of 20 randomly
    // generated bytes that are treated like a SHA-1. Therefore, we need to update
    // the message format.
    sign(token) {
        const rsaKey = new jsbn_rsa_1.RSAKey();
        rsaKey.setPrivateEx((0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(this.jwkPrivate.n)), (0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(this.jwkPrivate.e)), (0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(this.jwkPrivate.d)), (0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(this.jwkPrivate.p)), (0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(this.jwkPrivate.q)), (0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(this.jwkPrivate.dp)), (0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(this.jwkPrivate.dq)), (0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(this.jwkPrivate.qi)));
        (0, logging_1.assertTrue)(rsaKey.n.bitLength() === MODULUS_SIZE_BITS);
        // Message Layout (size equals that of the key modulus):
        // 00 01 FF FF FF FF ... FF [ASN.1 PREFIX] [TOKEN]
        const message = new Uint8Array(MODULUS_SIZE);
        // Initially fill the buffer with the padding
        message.fill(0xFF);
        // add prefix
        message[0] = 0x00;
        message[1] = 0x01;
        // add the ASN.1 prefix
        message.set(SIGNING_ASN1_PREFIX, message.length - SIGNING_ASN1_PREFIX.length - token.length);
        // then the actual token at the end
        message.set(token, message.length - token.length);
        const messageInteger = new jsbn_rsa_1.BigInteger(Array.from(message));
        const signature = rsaKey.doPrivate(messageInteger);
        return new Uint8Array(bigIntToFixedByteArray(signature, MODULUS_SIZE));
    }
    // Construct public key to match the adb format:
    // go/codesearch/rvc-arc/system/core/libcrypto_utils/android_pubkey.c;l=38-53
    getPublicKey() {
        const rsaKey = new jsbn_rsa_1.RSAKey();
        rsaKey.setPublic((0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(((0, logging_1.assertExists)(this.jwkPrivate.n)))), (0, string_utils_1.hexEncode)((0, string_utils_1.base64Decode)(((0, logging_1.assertExists)(this.jwkPrivate.e)))));
        const n0inv = R32.subtract(rsaKey.n.modInverse(R32)).intValue();
        const r = jsbn_rsa_1.BigInteger.ONE.shiftLeft(1).pow(MODULUS_SIZE_BITS);
        const rr = r.multiply(r).mod(rsaKey.n);
        const buffer = new ArrayBuffer(PUBKEY_ENCODED_SIZE);
        const dv = new DataView(buffer);
        dv.setUint32(0, MODULUS_SIZE_WORDS, true);
        dv.setUint32(WORD_SIZE, n0inv, true);
        const dvU8 = new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength);
        dvU8.set(bigIntToFixedByteArray(rsaKey.n, MODULUS_SIZE).reverse(), 2 * WORD_SIZE);
        dvU8.set(bigIntToFixedByteArray(rr, MODULUS_SIZE).reverse(), 2 * WORD_SIZE + MODULUS_SIZE);
        dv.setUint32(2 * WORD_SIZE + 2 * MODULUS_SIZE, rsaKey.e, true);
        return (0, string_utils_1.base64Encode)(dvU8) + ' ui.perfetto.dev';
    }
    serializeKey() {
        return JSON.stringify(this.jwkPrivate);
    }
}
exports.AdbKey = AdbKey;


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/auth/adb_key_manager.ts":
/*!***************************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/auth/adb_key_manager.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdbKeyManager = exports.maybeStoreKey = void 0;
const adb_auth_1 = __webpack_require__(/*! ./adb_auth */ "./src/WebAdb/common/recordingV2/auth/adb_auth.ts");
function isPasswordCredential(cred) {
    return cred !== null && cred.type === 'password';
}
function hasPasswordCredential() {
    return 'PasswordCredential' in window;
}
// how long we will store the key in memory
const KEY_IN_MEMORY_TIMEOUT = 1000 * 60 * 30; // 30 minutes
// Update credential store with the given key.
async function maybeStoreKey(key) {
    if (!hasPasswordCredential()) {
        return;
    }
    const credential = new PasswordCredential({
        id: 'webusb-adb-key',
        password: key.serializeKey(),
        name: 'WebUSB ADB Key',
        iconURL: 'https://www.google.com/favicon.ico'
    });
    // The 'Save password?' Chrome dialogue only appears if the key is
    // not already stored in Chrome.
    await navigator.credentials.store(credential);
    // 'preventSilentAccess' guarantees the user is always notified when
    // credentials are accessed. Sometimes the user is asked to click a button
    // and other times only a notification is shown temporarily.
    await navigator.credentials.preventSilentAccess();
}
exports.maybeStoreKey = maybeStoreKey;
class AdbKeyManager {
    // Finds a key, by priority:
    // - looking in memory (i.e. this.key)
    // - looking in the credential store
    // - and finally creating one from scratch if needed
    async getKey() {
        // 1. If we have a private key in memory, we return it.
        if (this.key) {
            return this.key;
        }
        // 2. We try to get the private key from the browser.
        // The mediation is set as 'optional', because we use
        // 'preventSilentAccess', which sometimes requests the user to click
        // on a button to allow the auth, but sometimes only shows a
        // notification and does not require the user to click on anything.
        // If we had set mediation to 'required', the user would have been
        // asked to click on a button every time.
        if (hasPasswordCredential()) {
            const options = {
                password: true,
                mediation: 'optional',
            };
            const credential = await navigator.credentials.get(options);
            if (isPasswordCredential(credential)) {
                return this.assignKey(adb_auth_1.AdbKey.DeserializeKey(credential.password));
            }
        }
        // 3. We generate a new key pair.
        return this.assignKey(await adb_auth_1.AdbKey.GenerateNewKeyPair());
    }
    // Assigns the key a new value, sets a timeout for storing the key in memory
    // and then returns the new key.
    assignKey(key) {
        this.key = key;
        if (this.keyInMemoryTimerId) {
            clearTimeout(this.keyInMemoryTimerId);
        }
        this.keyInMemoryTimerId =
            setTimeout(() => this.key = undefined, KEY_IN_MEMORY_TIMEOUT);
        return key;
    }
}
exports.AdbKeyManager = AdbKeyManager;


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/recording_error_handling.ts":
/*!*******************************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/recording_error_handling.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecordingError = exports.showRecordingModal = exports.wrapRecordingError = void 0;
const errors_1 = __webpack_require__(/*! ../../base/errors */ "./src/WebAdb/base/errors.ts");
const recording_utils_1 = __webpack_require__(/*! ./recording_utils */ "./src/WebAdb/common/recordingV2/recording_utils.ts");
// The pattern for handling recording error can have the following nesting in
// case of errors:
// A. wrapRecordingError -> wraps a promise
// B. onFailure -> has user defined logic and calls showRecordingModal
// C. showRecordingModal -> shows UX for a given error; this is not called
//    directly by wrapRecordingError, because we want the caller (such as the
//    UI) to dictate the UX
// This method takes a promise and a callback to be execute in case the promise
// fails. It then awaits the promise and executes the callback in case of
// failure. In the recording code it is used to wrap:
// 1. Acessing the WebUSB API.
// 2. Methods returning promises which can be rejected. For instance:
// a) When the user clicks 'Add a new device' but then doesn't select a valid
//    device.
// b) When the user starts a tracing session, but cancels it before they
//    authorize the session on the device.
async function wrapRecordingError(promise, onFailure) {
    try {
        return await promise;
    }
    catch (e) {
        // Sometimes the message is wrapped in an Error object, sometimes not, so
        // we make sure we transform it into a string.
        const errorMessage = (0, errors_1.getErrorMessage)(e);
        onFailure(errorMessage);
        return undefined;
    }
}
exports.wrapRecordingError = wrapRecordingError;
function showAllowUSBDebugging() { console.log("NOT IMPLEMENTED!!!!!"); }
function showConnectionLostError() { console.log("NOT IMPLEMENTED!!!!!"); }
function showExtensionNotInstalled() { console.log("NOT IMPLEMENTED!!!!!"); }
function showFailedToPushBinary(str) { console.log("NOT IMPLEMENTED!!!!!"); }
function showIssueParsingTheTracedResponse(str) { console.log("NOT IMPLEMENTED!!!!!"); }
function showNoDeviceSelected() { console.log("NOT IMPLEMENTED!!!!!"); }
function showWebsocketConnectionIssue(str) { console.log("NOT IMPLEMENTED!!!!!"); }
function showWebUSBErrorV2() { console.log("NOT IMPLEMENTED!!!!!"); }
// Shows a modal for every known type of error which can arise during recording.
// In this way, errors occuring at different levels of the recording process
// can be handled in a central location.
function showRecordingModal(message) {
    if ([
        'Unable to claim interface.',
        'The specified endpoint is not part of a claimed and selected ' +
            'alternate interface.',
        // thrown when calling the 'reset' method on a WebUSB device.
        'Unable to reset the device.',
    ].some((partOfMessage) => message.includes(partOfMessage))) {
        showWebUSBErrorV2();
    }
    else if ([
        'A transfer error has occurred.',
        'The device was disconnected.',
        'The transfer was cancelled.',
    ].some((partOfMessage) => message.includes(partOfMessage)) ||
        isDeviceDisconnectedError(message)) {
        showConnectionLostError();
    }
    else if (message === recording_utils_1.ALLOW_USB_DEBUGGING) {
        showAllowUSBDebugging();
    }
    else if (isMessageComposedOf(message, [recording_utils_1.BINARY_PUSH_FAILURE, recording_utils_1.BINARY_PUSH_UNKNOWN_RESPONSE])) {
        showFailedToPushBinary(message.substring(message.indexOf(':') + 1));
    }
    else if (message === recording_utils_1.NO_DEVICE_SELECTED) {
        showNoDeviceSelected();
    }
    else if (recording_utils_1.WEBSOCKET_UNABLE_TO_CONNECT === message) {
        showWebsocketConnectionIssue(message);
    }
    else if (message === recording_utils_1.EXTENSION_NOT_INSTALLED) {
        showExtensionNotInstalled();
    }
    else if (isMessageComposedOf(message, [
        recording_utils_1.PARSING_UNKNWON_REQUEST_ID,
        recording_utils_1.PARSING_UNABLE_TO_DECODE_METHOD,
        recording_utils_1.PARSING_UNRECOGNIZED_PORT,
        recording_utils_1.PARSING_UNRECOGNIZED_MESSAGE,
    ])) {
        showIssueParsingTheTracedResponse(message);
    }
    else {
        throw new Error(`${message}`);
    }
}
exports.showRecordingModal = showRecordingModal;
function isDeviceDisconnectedError(message) {
    return message.includes('Device with serial') &&
        message.includes('was disconnected.');
}
function isMessageComposedOf(message, issues) {
    for (const issue of issues) {
        if (message.includes(issue)) {
            return true;
        }
    }
    return false;
}
// Exception thrown by the Recording logic.
class RecordingError extends Error {
}
exports.RecordingError = RecordingError;


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/recording_utils.ts":
/*!**********************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/recording_utils.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PARSING_UNRECOGNIZED_MESSAGE = exports.PARSING_UNRECOGNIZED_PORT = exports.PARSING_UNABLE_TO_DECODE_METHOD = exports.PARSING_UNKNWON_REQUEST_ID = exports.RECORDING_IN_PROGRESS = exports.BUFFER_USAGE_INCORRECT_FORMAT = exports.BUFFER_USAGE_NOT_ACCESSIBLE = exports.MALFORMED_EXTENSION_MESSAGE = exports.EXTENSION_NOT_INSTALLED = exports.EXTENSION_NAME = exports.EXTENSION_URL = exports.EXTENSION_ID = exports.findInterfaceAndEndpoint = exports.ADB_DEVICE_FILTER = exports.NO_DEVICE_SELECTED = exports.CUSTOM_TRACED_CONSUMER_SOCKET_PATH = exports.DEFAULT_TRACED_CONSUMER_SOCKET_PATH = exports.ALLOW_USB_DEBUGGING = exports.TRACEBOX_FETCH_TIMEOUT = exports.TRACEBOX_DEVICE_PATH = exports.BINARY_PUSH_UNKNOWN_RESPONSE = exports.BINARY_PUSH_FAILURE = exports.isCrOS = exports.isLinux = exports.isMacOs = exports.buildAbdWebsocketCommand = exports.WEBSOCKET_CLOSED_ABNORMALLY_CODE = exports.WEBSOCKET_UNABLE_TO_CONNECT = void 0;
// Begin Websocket ////////////////////////////////////////////////////////
exports.WEBSOCKET_UNABLE_TO_CONNECT = 'Unable to connect to device via websocket.';
// https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
exports.WEBSOCKET_CLOSED_ABNORMALLY_CODE = 1006;
// The messages read by the adb server have their length prepended in hex.
// This method adds the length at the beginning of the message.
// Example: 'host:track-devices' -> '0012host:track-devices'
// go/codesearch/aosp-android11/system/core/adb/SERVICES.TXT
function buildAbdWebsocketCommand(cmd) {
    const hdr = cmd.length.toString(16).padStart(4, '0');
    return hdr + cmd;
}
exports.buildAbdWebsocketCommand = buildAbdWebsocketCommand;
// Sample user agent for Chrome on Mac OS:
// 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
// (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
function isMacOs(userAgent) {
    return userAgent.toLowerCase().includes(' mac os ');
}
exports.isMacOs = isMacOs;
// Sample user agent for Chrome on Linux:
// Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)
// Chrome/105.0.0.0 Safari/537.36
function isLinux(userAgent) {
    return userAgent.toLowerCase().includes(' linux ');
}
exports.isLinux = isLinux;
// Sample user agent for Chrome on Chrome OS:
// "Mozilla/5.0 (X11; CrOS x86_64 14816.99.0) AppleWebKit/537.36
// (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
// This condition is wider, in the unlikely possibility of different casing,
function isCrOS(userAgent) {
    return userAgent.toLowerCase().includes(' cros ');
}
exports.isCrOS = isCrOS;
// End Websocket //////////////////////////////////////////////////////////
// Begin Adb //////////////////////////////////////////////////////////////
exports.BINARY_PUSH_FAILURE = 'BinaryPushFailure';
exports.BINARY_PUSH_UNKNOWN_RESPONSE = 'BinaryPushUnknownResponse';
// In case the device doesn't have the tracebox, we upload the latest version
// to this path.
exports.TRACEBOX_DEVICE_PATH = '/data/local/tmp/tracebox';
// Experimentally, this takes 900ms on the first fetch and 20-30ms after
// because of caching.
exports.TRACEBOX_FETCH_TIMEOUT = 30000;
// Message shown to the user when they need to allow authentication on the
// device in order to connect.
exports.ALLOW_USB_DEBUGGING = 'Please allow USB debugging on device and try again.';
// If the Android device has the tracing service on it (from API version 29),
// then we can connect to this consumer socket.
exports.DEFAULT_TRACED_CONSUMER_SOCKET_PATH = 'localfilesystem:/dev/socket/traced_consumer';
// If the Android device does not have the tracing service on it (before API
// version 29), we will have to push the tracebox on the device. Then, we
// can connect to this consumer socket (using it does not require system admin
// privileges).
exports.CUSTOM_TRACED_CONSUMER_SOCKET_PATH = 'localabstract:traced_consumer';
// End Adb /////////////////////////////////////////////////////////////////
// Begin Webusb ///////////////////////////////////////////////////////////
exports.NO_DEVICE_SELECTED = 'No device selected.';
exports.ADB_DEVICE_FILTER = {
    classCode: 255, // USB vendor specific code
    subclassCode: 66, // Android vendor specific subclass
    protocolCode: 1, // Adb protocol
};
function findInterfaceAndEndpoint(device) {
    const adbDeviceFilter = exports.ADB_DEVICE_FILTER;
    for (const config of device.configurations) {
        for (const interface_ of config.interfaces) {
            for (const alt of interface_.alternates) {
                if (alt.interfaceClass === adbDeviceFilter.classCode &&
                    alt.interfaceSubclass === adbDeviceFilter.subclassCode &&
                    alt.interfaceProtocol === adbDeviceFilter.protocolCode) {
                    return {
                        configurationValue: config.configurationValue,
                        usbInterfaceNumber: interface_.interfaceNumber,
                        endpoints: alt.endpoints,
                    };
                } // if (alternate)
            } // for (interface.alternates)
        } // for (configuration.interfaces)
    } // for (configurations)
    return undefined;
}
exports.findInterfaceAndEndpoint = findInterfaceAndEndpoint;
// End Webusb //////////////////////////////////////////////////////////////
// Begin Chrome ///////////////////////////////////////////////////////////
exports.EXTENSION_ID = 'lfmkphfpdbjijhpomgecfikhfohaoine';
exports.EXTENSION_URL = `https://chrome.google.com/webstore/detail/perfetto-ui/${exports.EXTENSION_ID}`;
exports.EXTENSION_NAME = 'Chrome extension';
exports.EXTENSION_NOT_INSTALLED = `To trace Chrome from the Perfetto UI, you need to install our
    ${exports.EXTENSION_URL} and then reload this page.`;
exports.MALFORMED_EXTENSION_MESSAGE = 'Malformed extension message.';
exports.BUFFER_USAGE_NOT_ACCESSIBLE = 'Buffer usage not accessible';
exports.BUFFER_USAGE_INCORRECT_FORMAT = 'The buffer usage data has am incorrect format';
// End Chrome /////////////////////////////////////////////////////////////
// Begin Traced //////////////////////////////////////////////////////////
exports.RECORDING_IN_PROGRESS = 'Recording in progress';
exports.PARSING_UNKNWON_REQUEST_ID = 'Unknown request id';
exports.PARSING_UNABLE_TO_DECODE_METHOD = 'Unable to decode method';
exports.PARSING_UNRECOGNIZED_PORT = 'Unrecognized consumer port response';
exports.PARSING_UNRECOGNIZED_MESSAGE = 'Unrecognized frame message';
// End Traced ///////////////////////////////////////////////////////////


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/target_factories/android_webusb_target_factory.ts":
/*!*****************************************************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/target_factories/android_webusb_target_factory.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AndroidWebusbTargetFactory = exports.ANDROID_WEBUSB_TARGET_FACTORY = void 0;
const errors_1 = __webpack_require__(/*! ../../../base/errors */ "./src/WebAdb/base/errors.ts");
const logging_1 = __webpack_require__(/*! ../../../base/logging */ "./src/WebAdb/base/logging.ts");
const adb_key_manager_1 = __webpack_require__(/*! ../auth/adb_key_manager */ "./src/WebAdb/common/recordingV2/auth/adb_key_manager.ts");
const recording_error_handling_1 = __webpack_require__(/*! ../recording_error_handling */ "./src/WebAdb/common/recordingV2/recording_error_handling.ts");
const recording_utils_1 = __webpack_require__(/*! ../recording_utils */ "./src/WebAdb/common/recordingV2/recording_utils.ts");
const android_webusb_target_1 = __webpack_require__(/*! ../targets/android_webusb_target */ "./src/WebAdb/common/recordingV2/targets/android_webusb_target.ts");
exports.ANDROID_WEBUSB_TARGET_FACTORY = 'AndroidWebusbTargetFactory';
const SERIAL_NUMBER_ISSUE = 'an invalid serial number';
const ADB_INTERFACE_ISSUE = 'an incompatible adb interface';
function createDeviceErrorMessage(device, issue) {
    const productName = device.productName;
    return `USB device${productName ? ' ' + productName : ''} has ${issue}`;
}
class AndroidWebusbTargetFactory {
    constructor(usb) {
        this.usb = usb;
        this.kind = exports.ANDROID_WEBUSB_TARGET_FACTORY;
        this.onTargetChange = () => { };
        this.recordingProblems = [];
        this.targets = new Map();
        // AdbKeyManager should only be instantiated once, so we can use the same key
        // for all devices.
        this.keyManager = new adb_key_manager_1.AdbKeyManager();
        this.init();
    }
    getName() {
        return 'Android WebUsb';
    }
    listTargets() {
        return Array.from(this.targets.values());
    }
    listRecordingProblems() {
        return this.recordingProblems;
    }
    async connectNewTarget() {
        let device;
        try {
            device = await this.usb.requestDevice({ filters: [recording_utils_1.ADB_DEVICE_FILTER] });
        }
        catch (e) {
            throw new recording_error_handling_1.RecordingError((0, errors_1.getErrorMessage)(e));
        }
        const deviceValid = this.checkDeviceValidity(device);
        if (!deviceValid.isValid) {
            throw new recording_error_handling_1.RecordingError(deviceValid.issues.join('\n'));
        }
        const androidTarget = new android_webusb_target_1.AndroidWebusbTarget(device, this.keyManager, this.onTargetChange);
        this.targets.set((0, logging_1.assertExists)(device.serialNumber), androidTarget);
        return androidTarget;
    }
    setOnTargetChange(onTargetChange) {
        this.onTargetChange = onTargetChange;
    }
    async init() {
        let devices = [];
        try {
            devices = await this.usb.getDevices();
        }
        catch (_) {
            return; // WebUSB not available or disallowed in iframe.
        }
        for (const device of devices) {
            if (this.checkDeviceValidity(device).isValid) {
                this.targets.set((0, logging_1.assertExists)(device.serialNumber), new android_webusb_target_1.AndroidWebusbTarget(device, this.keyManager, this.onTargetChange));
            }
        }
        this.usb.addEventListener('connect', (ev) => {
            if (this.checkDeviceValidity(ev.device).isValid) {
                this.targets.set((0, logging_1.assertExists)(ev.device.serialNumber), new android_webusb_target_1.AndroidWebusbTarget(ev.device, this.keyManager, this.onTargetChange));
                this.onTargetChange();
            }
        });
        this.usb.addEventListener('disconnect', async (ev) => {
            // We don't check device validity when disconnecting because if the device
            // is invalid we would not have connected in the first place.
            const serialNumber = (0, logging_1.assertExists)(ev.device.serialNumber);
            await (0, logging_1.assertExists)(this.targets.get(serialNumber))
                .disconnect(`Device with serial ${serialNumber} was disconnected.`);
            this.targets.delete(serialNumber);
            this.onTargetChange();
        });
    }
    checkDeviceValidity(device) {
        const deviceValidity = { isValid: true, issues: [] };
        if (!device.serialNumber) {
            deviceValidity.issues.push(createDeviceErrorMessage(device, SERIAL_NUMBER_ISSUE));
            deviceValidity.isValid = false;
        }
        if (!(0, recording_utils_1.findInterfaceAndEndpoint)(device)) {
            deviceValidity.issues.push(createDeviceErrorMessage(device, ADB_INTERFACE_ISSUE));
            deviceValidity.isValid = false;
        }
        this.recordingProblems.push(...deviceValidity.issues);
        return deviceValidity;
    }
}
exports.AndroidWebusbTargetFactory = AndroidWebusbTargetFactory;


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/targets/android_target.ts":
/*!*****************************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/targets/android_target.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AndroidTarget = void 0;
const recording_utils_1 = __webpack_require__(/*! ../recording_utils */ "./src/WebAdb/common/recordingV2/recording_utils.ts");
class AndroidTarget {
    constructor(adbConnection, onTargetChange) {
        this.adbConnection = adbConnection;
        this.onTargetChange = onTargetChange;
        this.consumerSocketPath = recording_utils_1.DEFAULT_TRACED_CONSUMER_SOCKET_PATH;
    }
    // This is called when a usb USBConnectionEvent of type 'disconnect' event is
    // emitted. This event is emitted when the USB connection is lost (example:
    // when the user unplugged the connecting cable).
    async disconnect(disconnectMessage) {
        await this.adbConnection.disconnect(disconnectMessage);
    }
    // Starts a tracing session in order to fetch information such as apiLevel
    // and dataSources from the device. Then, it cancels the session.
    async fetchTargetInfo(listener) {
    }
    // We do not support long tracing on Android.
    canCreateTracingSession(recordingMode) {
        return false;
    }
    async createTracingSession(tracingSessionListener) {
    }
    canConnectWithoutContention() {
        return this.adbConnection.canConnectWithoutContention();
    }
    getAdbConnectino() {
        return this.adbConnection;
    }
}
exports.AndroidTarget = AndroidTarget;


/***/ }),

/***/ "./src/WebAdb/common/recordingV2/targets/android_webusb_target.ts":
/*!************************************************************************!*\
  !*** ./src/WebAdb/common/recordingV2/targets/android_webusb_target.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// Copyright (C) 2022 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AndroidWebusbTarget = void 0;
const logging_1 = __webpack_require__(/*! ../../../base/logging */ "./src/WebAdb/base/logging.ts");
const adb_connection_over_webusb_1 = __webpack_require__(/*! ../adb_connection_over_webusb */ "./src/WebAdb/common/recordingV2/adb_connection_over_webusb.ts");
const android_target_1 = __webpack_require__(/*! ./android_target */ "./src/WebAdb/common/recordingV2/targets/android_target.ts");
class AndroidWebusbTarget extends android_target_1.AndroidTarget {
    constructor(device, keyManager, onTargetChange) {
        super(new adb_connection_over_webusb_1.AdbConnectionOverWebusb(device, keyManager), onTargetChange);
        this.device = device;
    }
    getInfo() {
        const name = (0, logging_1.assertExists)(this.device.productName) + ' ' +
            (0, logging_1.assertExists)(this.device.serialNumber) + ' WebUsb';
        return {
            targetType: 'ANDROID',
            // 'androidApiLevel' will be populated after ADB authorization.
            androidApiLevel: this.androidApiLevel,
            dataSources: this.dataSources || [],
            name,
        };
    }
}
exports.AndroidWebusbTarget = AndroidWebusbTarget;


/***/ }),

/***/ "./src/pal.ts":
/*!********************!*\
  !*** ./src/pal.ts ***!
  \********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const android_webusb_target_factory_1 = __webpack_require__(/*! ./WebAdb/common/recordingV2/target_factories/android_webusb_target_factory */ "./src/WebAdb/common/recordingV2/target_factories/android_webusb_target_factory.ts");
const jszip_1 = __importDefault(__webpack_require__(/*! jszip */ "./node_modules/jszip/dist/jszip.min.js"));
const file_saver_1 = __webpack_require__(/*! file-saver */ "./node_modules/file-saver/dist/FileSaver.min.js");
const connectButton = document.getElementById("connect_button");
const runButton = document.getElementById("run_button");
runButton.disabled = true;
const scriptArea = document.getElementById("script_area");
scriptArea.disabled = true;
const outputArea = document.getElementById("output_area");
outputArea.disabled = true;
const logcatArea = document.getElementById("logcat_area");
logcatArea.disabled = true;
const bugreportButton = document.getElementById("bugreport_button");
bugreportButton.disabled = true;
bugreportButton.addEventListener('click', takeBugreport, false);
const startRecordButton = document.getElementById("record_button");
startRecordButton.disabled = true;
startRecordButton.addEventListener('click', toggleRecording, false);
const saveButton = document.getElementById("save_button");
saveButton.disabled = true;
saveButton.addEventListener('click', download, false);
const webusb = new android_webusb_target_factory_1.AndroidWebusbTargetFactory(navigator.usb);
var adbConnection;
scriptArea.value = "getprop";
const logcatDecode = new TextDecoder();
var toRun = [];
function logcatData(data) {
    logcatArea.value = logcatArea.value + logcatDecode.decode(data);
    logcatArea.scrollTop = logcatArea.scrollHeight;
}
function deviceConnected(dev) {
    const adbTarget = dev;
    adbConnection = adbTarget.adbConnection;
    console.log("Start logcat");
    adbConnection.shell("logcat").then((bytes) => { bytes.addOnStreamDataCallback(logcatData); });
    connectButton.disabled = true;
    connectButton.innerText = "Connected\n" + dev.getInfo().name;
    runButton.disabled = false;
    scriptArea.disabled = false;
    outputArea.disabled = false;
    logcatArea.disabled = false;
    ;
    bugreportButton.disabled = false;
    ;
    startRecordButton.disabled = false;
}
function connectDevice() {
    console.log("Connect device");
    let deviceP = webusb.connectNewTarget().then((device) => deviceConnected(device), (reason) => { console.log("Failed to connect"); });
}
function recurseCommandLine(result) {
    console.log("Got " + result);
    outputArea.value = outputArea.value + result;
    outputArea.scrollTop = outputArea.scrollHeight;
    var nextCMD = getNextCMD();
    if (nextCMD == "") {
        console.log("Finished");
        scriptArea.disabled = false;
        runButton.disabled = false;
    }
    else {
        console.log("Running next: " + nextCMD);
        adbConnection.shellAndGetOutput(nextCMD).then((val) => { recurseCommandLine(val); });
    }
}
function getNextCMD() {
    if (toRun.length > 0) {
        var nextCommand = toRun[0];
        toRun.shift();
        console.log("Returning: " + nextCommand);
        return nextCommand;
    }
    return "";
}
function runTest() {
    runButton.disabled = true;
    scriptArea.disabled = true;
    outputArea.value = "";
    let testScript = scriptArea.value;
    if (testScript.split("\n").length > 1) {
        toRun = testScript.split("\n");
    }
    toRun = [testScript];
    var command = getNextCMD();
    console.log("Running: " + testScript);
    // do something with the script
    adbConnection.shellAndGetOutput(command).then((val) => { recurseCommandLine(val); });
}
function updateURL(ele, ev) {
}
connectButton.addEventListener('click', connectDevice, false);
document.getElementById("run_button")?.addEventListener('click', runTest, false);
scriptArea.addEventListener('input', (ev) => {
    console.log("EVENT");
    let params = new URLSearchParams();
    params.set('script', '' + scriptArea.value);
    window.history.replaceState('1', 'PAL', window.location.pathname + '?' + params);
}, false);
function populateScriptFromURL() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const name = urlSearchParams.get('script');
    if (name) {
        scriptArea.value = name;
    }
    console.log("EVENT");
    let params = new URLSearchParams();
    params.set('script', '' + scriptArea.value);
    window.history.replaceState('1', 'PAL', window.location.pathname + '?' + params);
}
populateScriptFromURL();
var mediaRecorder;
var chunks;
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: {
            facingMode: 'environment'
        } })
        .then(function (stream) {
        mediaRecorder = new MediaRecorder(stream);
        let videoElement = document.getElementById("video");
        videoElement.srcObject = stream;
    })
        .catch(function (err0r) {
        console.log("Something went wrong!", err0r);
    });
}
var recording = false;
function toggleRecording() {
    if (recording) {
        stopRecording();
    }
    else {
        startRecording();
    }
}
function startRecording() {
    startRecordButton.disabled = true;
    recording = true;
    logcatArea.value = "";
    startRecordButton.innerText = "Stop Recording";
    startVideoRecording();
    startRecordButton.disabled = false;
}
function stopRecording() {
    startRecordButton.disabled = true;
    recording = false;
    startRecordButton.innerText = "Start Recording";
    stopVideoRecording();
    startRecordButton.disabled = false;
    saveButton.disabled = false;
}
function startVideoRecording() {
    console.log("start record");
    chunks = [];
    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
    };
    mediaRecorder.start(1000);
}
function stopVideoRecording() {
    mediaRecorder.stop();
}
function download() {
    var zip = new jszip_1.default();
    // add logcat
    zip.file("logcat.txt", logcatArea.value);
    // add commands output
    zip.file("output.txt", outputArea.value);
    // add video
    const blob = new Blob(chunks, { type: "video/x-matroska;codecs=avc1" });
    chunks = [];
    zip.file("video.webm", blob);
    zip.generateAsync({ type: "blob" })
        .then(function (content) {
        // see FileSaver.js
        (0, file_saver_1.saveAs)(content, "session.zip");
    });
}
function takeBugreport() {
    bugreportButton.disabled = true;
    adbConnection.shellAndGetOutput("bugreportz")
        .then((val) => {
        if (val.startsWith("OK")) {
            var path = val.slice(3);
            console.log("bugreport path is " + path);
        }
        else {
            console.error("Error capturing bugreport");
        }
    });
}


/***/ }),

/***/ "./src/WebAdb/base/utils/index-browser.js":
/*!************************************************!*\
  !*** ./src/WebAdb/base/utils/index-browser.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _TextDecoder: () => (/* binding */ _TextDecoder),
/* harmony export */   _TextEncoder: () => (/* binding */ _TextEncoder)
/* harmony export */ });
// Copyright (C) 2019 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const _TextDecoder = TextDecoder;
const _TextEncoder = TextEncoder;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/pal.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBLGNBQWMsU0FBUzs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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OztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLElBQThCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxLQUFLLEVBSU47O0FBRUQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsT0FBTztBQUNyQjtBQUNBO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUI7QUFDQSxJQUFJO0FBQ0o7QUFDQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsT0FBTztBQUNoQztBQUNBLDZCQUE2QixPQUFPO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLG9DQUFvQyxTQUFTO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsUUFBUTtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixzQkFBc0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsT0FBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG1EQUFtRDtBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4SkFBOEo7QUFDOUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELElBQUk7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsV0FBVztBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUNBQXFDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEUsV0FBVztBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1GQUFtRixVQUFVO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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S0FBSztBQUNMOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNBOzs7Ozs7O1VDZlA7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7V0NQRDs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vbm9kZV9tb2R1bGVzL0Bwcm90b2J1ZmpzL2Jhc2U2NC9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vbm9kZV9tb2R1bGVzL0Bwcm90b2J1ZmpzL3V0ZjgvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL25vZGVfbW9kdWxlcy9maWxlLXNhdmVyL2Rpc3QvRmlsZVNhdmVyLm1pbi5qcyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vbm9kZV9tb2R1bGVzL2pzYm4tcnNhL2pzYm4uanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL25vZGVfbW9kdWxlcy9qc3ppcC9kaXN0L2pzemlwLm1pbi5qcyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL2RlZmVycmVkLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2UvZXJyb3JzLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2UvbG9nZ2luZy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL29iamVjdF91dGlscy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL3N0cmluZ191dGlscy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vYXJyYXlfYnVmZmVyX2J1aWxkZXIudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL2FkYl9jb25uZWN0aW9uX2ltcGwudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL2FkYl9jb25uZWN0aW9uX292ZXJfd2VidXNiLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hZGJfZmlsZV9oYW5kbGVyLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hdXRoL2FkYl9hdXRoLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hdXRoL2FkYl9rZXlfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9yZWNvcmRpbmdfdXRpbHMudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3RhcmdldF9mYWN0b3JpZXMvYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0X2ZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3RhcmdldHMvYW5kcm9pZF90YXJnZXQudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3RhcmdldHMvYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0LnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvcGFsLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2UvdXRpbHMvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BhbF9naXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BhbF9naXQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhbF9naXQvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qKlxyXG4gKiBBIG1pbmltYWwgYmFzZTY0IGltcGxlbWVudGF0aW9uIGZvciBudW1iZXIgYXJyYXlzLlxyXG4gKiBAbWVtYmVyb2YgdXRpbFxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqL1xyXG52YXIgYmFzZTY0ID0gZXhwb3J0cztcclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGVzIHRoZSBieXRlIGxlbmd0aCBvZiBhIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBCYXNlNjQgZW5jb2RlZCBzdHJpbmdcclxuICogQHJldHVybnMge251bWJlcn0gQnl0ZSBsZW5ndGhcclxuICovXHJcbmJhc2U2NC5sZW5ndGggPSBmdW5jdGlvbiBsZW5ndGgoc3RyaW5nKSB7XHJcbiAgICB2YXIgcCA9IHN0cmluZy5sZW5ndGg7XHJcbiAgICBpZiAoIXApXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB2YXIgbiA9IDA7XHJcbiAgICB3aGlsZSAoLS1wICUgNCA+IDEgJiYgc3RyaW5nLmNoYXJBdChwKSA9PT0gXCI9XCIpXHJcbiAgICAgICAgKytuO1xyXG4gICAgcmV0dXJuIE1hdGguY2VpbChzdHJpbmcubGVuZ3RoICogMykgLyA0IC0gbjtcclxufTtcclxuXHJcbi8vIEJhc2U2NCBlbmNvZGluZyB0YWJsZVxyXG52YXIgYjY0ID0gbmV3IEFycmF5KDY0KTtcclxuXHJcbi8vIEJhc2U2NCBkZWNvZGluZyB0YWJsZVxyXG52YXIgczY0ID0gbmV3IEFycmF5KDEyMyk7XHJcblxyXG4vLyA2NS4uOTAsIDk3Li4xMjIsIDQ4Li41NywgNDMsIDQ3XHJcbmZvciAodmFyIGkgPSAwOyBpIDwgNjQ7KVxyXG4gICAgczY0W2I2NFtpXSA9IGkgPCAyNiA/IGkgKyA2NSA6IGkgPCA1MiA/IGkgKyA3MSA6IGkgPCA2MiA/IGkgLSA0IDogaSAtIDU5IHwgNDNdID0gaSsrO1xyXG5cclxuLyoqXHJcbiAqIEVuY29kZXMgYSBidWZmZXIgdG8gYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7VWludDhBcnJheX0gYnVmZmVyIFNvdXJjZSBidWZmZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFNvdXJjZSBzdGFydFxyXG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFNvdXJjZSBlbmRcclxuICogQHJldHVybnMge3N0cmluZ30gQmFzZTY0IGVuY29kZWQgc3RyaW5nXHJcbiAqL1xyXG5iYXNlNjQuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGJ1ZmZlciwgc3RhcnQsIGVuZCkge1xyXG4gICAgdmFyIHBhcnRzID0gbnVsbCxcclxuICAgICAgICBjaHVuayA9IFtdO1xyXG4gICAgdmFyIGkgPSAwLCAvLyBvdXRwdXQgaW5kZXhcclxuICAgICAgICBqID0gMCwgLy8gZ290byBpbmRleFxyXG4gICAgICAgIHQ7ICAgICAvLyB0ZW1wb3JhcnlcclxuICAgIHdoaWxlIChzdGFydCA8IGVuZCkge1xyXG4gICAgICAgIHZhciBiID0gYnVmZmVyW3N0YXJ0KytdO1xyXG4gICAgICAgIHN3aXRjaCAoaikge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBjaHVua1tpKytdID0gYjY0W2IgPj4gMl07XHJcbiAgICAgICAgICAgICAgICB0ID0gKGIgJiAzKSA8PCA0O1xyXG4gICAgICAgICAgICAgICAgaiA9IDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgY2h1bmtbaSsrXSA9IGI2NFt0IHwgYiA+PiA0XTtcclxuICAgICAgICAgICAgICAgIHQgPSAoYiAmIDE1KSA8PCAyO1xyXG4gICAgICAgICAgICAgICAgaiA9IDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgY2h1bmtbaSsrXSA9IGI2NFt0IHwgYiA+PiA2XTtcclxuICAgICAgICAgICAgICAgIGNodW5rW2krK10gPSBiNjRbYiAmIDYzXTtcclxuICAgICAgICAgICAgICAgIGogPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpID4gODE5MSkge1xyXG4gICAgICAgICAgICAocGFydHMgfHwgKHBhcnRzID0gW10pKS5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjaHVuaykpO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaikge1xyXG4gICAgICAgIGNodW5rW2krK10gPSBiNjRbdF07XHJcbiAgICAgICAgY2h1bmtbaSsrXSA9IDYxO1xyXG4gICAgICAgIGlmIChqID09PSAxKVxyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gNjE7XHJcbiAgICB9XHJcbiAgICBpZiAocGFydHMpIHtcclxuICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgcGFydHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmsuc2xpY2UoMCwgaSkpKTtcclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmsuc2xpY2UoMCwgaSkpO1xyXG59O1xyXG5cclxudmFyIGludmFsaWRFbmNvZGluZyA9IFwiaW52YWxpZCBlbmNvZGluZ1wiO1xyXG5cclxuLyoqXHJcbiAqIERlY29kZXMgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcgdG8gYSBidWZmZXIuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU291cmNlIHN0cmluZ1xyXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IGJ1ZmZlciBEZXN0aW5hdGlvbiBidWZmZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCBEZXN0aW5hdGlvbiBvZmZzZXRcclxuICogQHJldHVybnMge251bWJlcn0gTnVtYmVyIG9mIGJ5dGVzIHdyaXR0ZW5cclxuICogQHRocm93cyB7RXJyb3J9IElmIGVuY29kaW5nIGlzIGludmFsaWRcclxuICovXHJcbmJhc2U2NC5kZWNvZGUgPSBmdW5jdGlvbiBkZWNvZGUoc3RyaW5nLCBidWZmZXIsIG9mZnNldCkge1xyXG4gICAgdmFyIHN0YXJ0ID0gb2Zmc2V0O1xyXG4gICAgdmFyIGogPSAwLCAvLyBnb3RvIGluZGV4XHJcbiAgICAgICAgdDsgICAgIC8vIHRlbXBvcmFyeVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOykge1xyXG4gICAgICAgIHZhciBjID0gc3RyaW5nLmNoYXJDb2RlQXQoaSsrKTtcclxuICAgICAgICBpZiAoYyA9PT0gNjEgJiYgaiA+IDEpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGlmICgoYyA9IHM2NFtjXSkgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEVuY29kaW5nKTtcclxuICAgICAgICBzd2l0Y2ggKGopIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgdCA9IGM7XHJcbiAgICAgICAgICAgICAgICBqID0gMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gdCA8PCAyIHwgKGMgJiA0OCkgPj4gNDtcclxuICAgICAgICAgICAgICAgIHQgPSBjO1xyXG4gICAgICAgICAgICAgICAgaiA9IDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9ICh0ICYgMTUpIDw8IDQgfCAoYyAmIDYwKSA+PiAyO1xyXG4gICAgICAgICAgICAgICAgdCA9IGM7XHJcbiAgICAgICAgICAgICAgICBqID0gMztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gKHQgJiAzKSA8PCA2IHwgYztcclxuICAgICAgICAgICAgICAgIGogPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGogPT09IDEpXHJcbiAgICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEVuY29kaW5nKTtcclxuICAgIHJldHVybiBvZmZzZXQgLSBzdGFydDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGUgc3BlY2lmaWVkIHN0cmluZyBhcHBlYXJzIHRvIGJlIGJhc2U2NCBlbmNvZGVkLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFN0cmluZyB0byB0ZXN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgcHJvYmFibHkgYmFzZTY0IGVuY29kZWQsIG90aGVyd2lzZSBmYWxzZVxyXG4gKi9cclxuYmFzZTY0LnRlc3QgPSBmdW5jdGlvbiB0ZXN0KHN0cmluZykge1xyXG4gICAgcmV0dXJuIC9eKD86W0EtWmEtejAtOSsvXXs0fSkqKD86W0EtWmEtejAtOSsvXXsyfT09fFtBLVphLXowLTkrL117M309KT8kLy50ZXN0KHN0cmluZyk7XHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIEEgbWluaW1hbCBVVEY4IGltcGxlbWVudGF0aW9uIGZvciBudW1iZXIgYXJyYXlzLlxyXG4gKiBAbWVtYmVyb2YgdXRpbFxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqL1xyXG52YXIgdXRmOCA9IGV4cG9ydHM7XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB0aGUgVVRGOCBieXRlIGxlbmd0aCBvZiBhIHN0cmluZy5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmdcclxuICogQHJldHVybnMge251bWJlcn0gQnl0ZSBsZW5ndGhcclxuICovXHJcbnV0ZjgubGVuZ3RoID0gZnVuY3Rpb24gdXRmOF9sZW5ndGgoc3RyaW5nKSB7XHJcbiAgICB2YXIgbGVuID0gMCxcclxuICAgICAgICBjID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgYyA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIGlmIChjIDwgMTI4KVxyXG4gICAgICAgICAgICBsZW4gKz0gMTtcclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OClcclxuICAgICAgICAgICAgbGVuICs9IDI7XHJcbiAgICAgICAgZWxzZSBpZiAoKGMgJiAweEZDMDApID09PSAweEQ4MDAgJiYgKHN0cmluZy5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4RkMwMCkgPT09IDB4REMwMCkge1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGxlbiArPSA0O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBsZW4gKz0gMztcclxuICAgIH1cclxuICAgIHJldHVybiBsZW47XHJcbn07XHJcblxyXG4vKipcclxuICogUmVhZHMgVVRGOCBieXRlcyBhcyBhIHN0cmluZy5cclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBidWZmZXIgU291cmNlIGJ1ZmZlclxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgU291cmNlIHN0YXJ0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgU291cmNlIGVuZFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBTdHJpbmcgcmVhZFxyXG4gKi9cclxudXRmOC5yZWFkID0gZnVuY3Rpb24gdXRmOF9yZWFkKGJ1ZmZlciwgc3RhcnQsIGVuZCkge1xyXG4gICAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0O1xyXG4gICAgaWYgKGxlbiA8IDEpXHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB2YXIgcGFydHMgPSBudWxsLFxyXG4gICAgICAgIGNodW5rID0gW10sXHJcbiAgICAgICAgaSA9IDAsIC8vIGNoYXIgb2Zmc2V0XHJcbiAgICAgICAgdDsgICAgIC8vIHRlbXBvcmFyeVxyXG4gICAgd2hpbGUgKHN0YXJ0IDwgZW5kKSB7XHJcbiAgICAgICAgdCA9IGJ1ZmZlcltzdGFydCsrXTtcclxuICAgICAgICBpZiAodCA8IDEyOClcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9IHQ7XHJcbiAgICAgICAgZWxzZSBpZiAodCA+IDE5MSAmJiB0IDwgMjI0KVxyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gKHQgJiAzMSkgPDwgNiB8IGJ1ZmZlcltzdGFydCsrXSAmIDYzO1xyXG4gICAgICAgIGVsc2UgaWYgKHQgPiAyMzkgJiYgdCA8IDM2NSkge1xyXG4gICAgICAgICAgICB0ID0gKCh0ICYgNykgPDwgMTggfCAoYnVmZmVyW3N0YXJ0KytdICYgNjMpIDw8IDEyIHwgKGJ1ZmZlcltzdGFydCsrXSAmIDYzKSA8PCA2IHwgYnVmZmVyW3N0YXJ0KytdICYgNjMpIC0gMHgxMDAwMDtcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9IDB4RDgwMCArICh0ID4+IDEwKTtcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9IDB4REMwMCArICh0ICYgMTAyMyk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSAodCAmIDE1KSA8PCAxMiB8IChidWZmZXJbc3RhcnQrK10gJiA2MykgPDwgNiB8IGJ1ZmZlcltzdGFydCsrXSAmIDYzO1xyXG4gICAgICAgIGlmIChpID4gODE5MSkge1xyXG4gICAgICAgICAgICAocGFydHMgfHwgKHBhcnRzID0gW10pKS5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjaHVuaykpO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAocGFydHMpIHtcclxuICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgcGFydHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmsuc2xpY2UoMCwgaSkpKTtcclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmsuc2xpY2UoMCwgaSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFdyaXRlcyBhIHN0cmluZyBhcyBVVEY4IGJ5dGVzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFNvdXJjZSBzdHJpbmdcclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBidWZmZXIgRGVzdGluYXRpb24gYnVmZmVyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgRGVzdGluYXRpb24gb2Zmc2V0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGVzIHdyaXR0ZW5cclxuICovXHJcbnV0Zjgud3JpdGUgPSBmdW5jdGlvbiB1dGY4X3dyaXRlKHN0cmluZywgYnVmZmVyLCBvZmZzZXQpIHtcclxuICAgIHZhciBzdGFydCA9IG9mZnNldCxcclxuICAgICAgICBjMSwgLy8gY2hhcmFjdGVyIDFcclxuICAgICAgICBjMjsgLy8gY2hhcmFjdGVyIDJcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgYzEgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBpZiAoYzEgPCAxMjgpIHtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYzEgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiA2ICAgICAgIHwgMTkyO1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgICAgICAgJiA2MyB8IDEyODtcclxuICAgICAgICB9IGVsc2UgaWYgKChjMSAmIDB4RkMwMCkgPT09IDB4RDgwMCAmJiAoKGMyID0gc3RyaW5nLmNoYXJDb2RlQXQoaSArIDEpKSAmIDB4RkMwMCkgPT09IDB4REMwMCkge1xyXG4gICAgICAgICAgICBjMSA9IDB4MTAwMDAgKyAoKGMxICYgMHgwM0ZGKSA8PCAxMCkgKyAoYzIgJiAweDAzRkYpO1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiAxOCAgICAgIHwgMjQwO1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gMTIgJiA2MyB8IDEyODtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDYgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSAgICAgICAmIDYzIHwgMTI4O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiAxMiAgICAgIHwgMjI0O1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gNiAgJiA2MyB8IDEyODtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxICAgICAgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9mZnNldCAtIHN0YXJ0O1xyXG59O1xyXG4iLCIoZnVuY3Rpb24oYSxiKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGIpO2Vsc2UgaWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGV4cG9ydHMpYigpO2Vsc2V7YigpLGEuRmlsZVNhdmVyPXtleHBvcnRzOnt9fS5leHBvcnRzfX0pKHRoaXMsZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBiKGEsYil7cmV0dXJuXCJ1bmRlZmluZWRcIj09dHlwZW9mIGI/Yj17YXV0b0JvbTohMX06XCJvYmplY3RcIiE9dHlwZW9mIGImJihjb25zb2xlLndhcm4oXCJEZXByZWNhdGVkOiBFeHBlY3RlZCB0aGlyZCBhcmd1bWVudCB0byBiZSBhIG9iamVjdFwiKSxiPXthdXRvQm9tOiFifSksYi5hdXRvQm9tJiYvXlxccyooPzp0ZXh0XFwvXFxTKnxhcHBsaWNhdGlvblxcL3htbHxcXFMqXFwvXFxTKlxcK3htbClcXHMqOy4qY2hhcnNldFxccyo9XFxzKnV0Zi04L2kudGVzdChhLnR5cGUpP25ldyBCbG9iKFtcIlxcdUZFRkZcIixhXSx7dHlwZTphLnR5cGV9KTphfWZ1bmN0aW9uIGMoYSxiLGMpe3ZhciBkPW5ldyBYTUxIdHRwUmVxdWVzdDtkLm9wZW4oXCJHRVRcIixhKSxkLnJlc3BvbnNlVHlwZT1cImJsb2JcIixkLm9ubG9hZD1mdW5jdGlvbigpe2coZC5yZXNwb25zZSxiLGMpfSxkLm9uZXJyb3I9ZnVuY3Rpb24oKXtjb25zb2xlLmVycm9yKFwiY291bGQgbm90IGRvd25sb2FkIGZpbGVcIil9LGQuc2VuZCgpfWZ1bmN0aW9uIGQoYSl7dmFyIGI9bmV3IFhNTEh0dHBSZXF1ZXN0O2Iub3BlbihcIkhFQURcIixhLCExKTt0cnl7Yi5zZW5kKCl9Y2F0Y2goYSl7fXJldHVybiAyMDA8PWIuc3RhdHVzJiYyOTk+PWIuc3RhdHVzfWZ1bmN0aW9uIGUoYSl7dHJ5e2EuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudChcImNsaWNrXCIpKX1jYXRjaChjKXt2YXIgYj1kb2N1bWVudC5jcmVhdGVFdmVudChcIk1vdXNlRXZlbnRzXCIpO2IuaW5pdE1vdXNlRXZlbnQoXCJjbGlja1wiLCEwLCEwLHdpbmRvdywwLDAsMCw4MCwyMCwhMSwhMSwhMSwhMSwwLG51bGwpLGEuZGlzcGF0Y2hFdmVudChiKX19dmFyIGY9XCJvYmplY3RcIj09dHlwZW9mIHdpbmRvdyYmd2luZG93LndpbmRvdz09PXdpbmRvdz93aW5kb3c6XCJvYmplY3RcIj09dHlwZW9mIHNlbGYmJnNlbGYuc2VsZj09PXNlbGY/c2VsZjpcIm9iamVjdFwiPT10eXBlb2YgZ2xvYmFsJiZnbG9iYWwuZ2xvYmFsPT09Z2xvYmFsP2dsb2JhbDp2b2lkIDAsYT1mLm5hdmlnYXRvciYmL01hY2ludG9zaC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSYmL0FwcGxlV2ViS2l0Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpJiYhL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxnPWYuc2F2ZUFzfHwoXCJvYmplY3RcIiE9dHlwZW9mIHdpbmRvd3x8d2luZG93IT09Zj9mdW5jdGlvbigpe306XCJkb3dubG9hZFwiaW4gSFRNTEFuY2hvckVsZW1lbnQucHJvdG90eXBlJiYhYT9mdW5jdGlvbihiLGcsaCl7dmFyIGk9Zi5VUkx8fGYud2Via2l0VVJMLGo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7Zz1nfHxiLm5hbWV8fFwiZG93bmxvYWRcIixqLmRvd25sb2FkPWcsai5yZWw9XCJub29wZW5lclwiLFwic3RyaW5nXCI9PXR5cGVvZiBiPyhqLmhyZWY9YixqLm9yaWdpbj09PWxvY2F0aW9uLm9yaWdpbj9lKGopOmQoai5ocmVmKT9jKGIsZyxoKTplKGosai50YXJnZXQ9XCJfYmxhbmtcIikpOihqLmhyZWY9aS5jcmVhdGVPYmplY3RVUkwoYiksc2V0VGltZW91dChmdW5jdGlvbigpe2kucmV2b2tlT2JqZWN0VVJMKGouaHJlZil9LDRFNCksc2V0VGltZW91dChmdW5jdGlvbigpe2Uoail9LDApKX06XCJtc1NhdmVPck9wZW5CbG9iXCJpbiBuYXZpZ2F0b3I/ZnVuY3Rpb24oZixnLGgpe2lmKGc9Z3x8Zi5uYW1lfHxcImRvd25sb2FkXCIsXCJzdHJpbmdcIiE9dHlwZW9mIGYpbmF2aWdhdG9yLm1zU2F2ZU9yT3BlbkJsb2IoYihmLGgpLGcpO2Vsc2UgaWYoZChmKSljKGYsZyxoKTtlbHNle3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2kuaHJlZj1mLGkudGFyZ2V0PVwiX2JsYW5rXCIsc2V0VGltZW91dChmdW5jdGlvbigpe2UoaSl9KX19OmZ1bmN0aW9uKGIsZCxlLGcpe2lmKGc9Z3x8b3BlbihcIlwiLFwiX2JsYW5rXCIpLGcmJihnLmRvY3VtZW50LnRpdGxlPWcuZG9jdW1lbnQuYm9keS5pbm5lclRleHQ9XCJkb3dubG9hZGluZy4uLlwiKSxcInN0cmluZ1wiPT10eXBlb2YgYilyZXR1cm4gYyhiLGQsZSk7dmFyIGg9XCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIj09PWIudHlwZSxpPS9jb25zdHJ1Y3Rvci9pLnRlc3QoZi5IVE1MRWxlbWVudCl8fGYuc2FmYXJpLGo9L0NyaU9TXFwvW1xcZF0rLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO2lmKChqfHxoJiZpfHxhKSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIEZpbGVSZWFkZXIpe3ZhciBrPW5ldyBGaWxlUmVhZGVyO2sub25sb2FkZW5kPWZ1bmN0aW9uKCl7dmFyIGE9ay5yZXN1bHQ7YT1qP2E6YS5yZXBsYWNlKC9eZGF0YTpbXjtdKjsvLFwiZGF0YTphdHRhY2htZW50L2ZpbGU7XCIpLGc/Zy5sb2NhdGlvbi5ocmVmPWE6bG9jYXRpb249YSxnPW51bGx9LGsucmVhZEFzRGF0YVVSTChiKX1lbHNle3ZhciBsPWYuVVJMfHxmLndlYmtpdFVSTCxtPWwuY3JlYXRlT2JqZWN0VVJMKGIpO2c/Zy5sb2NhdGlvbj1tOmxvY2F0aW9uLmhyZWY9bSxnPW51bGwsc2V0VGltZW91dChmdW5jdGlvbigpe2wucmV2b2tlT2JqZWN0VVJMKG0pfSw0RTQpfX0pO2Yuc2F2ZUFzPWcuc2F2ZUFzPWcsXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmKG1vZHVsZS5leHBvcnRzPWcpfSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUZpbGVTYXZlci5taW4uanMubWFwIiwiXG4oZnVuY3Rpb24oKSB7XG5cbi8vIENvcHlyaWdodCAoYykgMjAwNSAgVG9tIFd1XG4vLyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gU2VlIFwiTElDRU5TRVwiIGZvciBkZXRhaWxzLlxuXG4vLyBCYXNpYyBKYXZhU2NyaXB0IEJOIGxpYnJhcnkgLSBzdWJzZXQgdXNlZnVsIGZvciBSU0EgZW5jcnlwdGlvbi5cblxudmFyIGluQnJvd3NlciA9XG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIEJpdHMgcGVyIGRpZ2l0XG52YXIgZGJpdHM7XG5cbi8vIEphdmFTY3JpcHQgZW5naW5lIGFuYWx5c2lzXG52YXIgY2FuYXJ5ID0gMHhkZWFkYmVlZmNhZmU7XG52YXIgal9sbSA9ICgoY2FuYXJ5ICYgMHhmZmZmZmYpID09IDB4ZWZjYWZlKTtcblxuLy8gKHB1YmxpYykgQ29uc3RydWN0b3JcbmZ1bmN0aW9uIEJpZ0ludGVnZXIoYSwgYiwgYykge1xuICBpZiAoYSAhPSBudWxsKVxuICAgIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgYSlcbiAgICAgIHRoaXMuZnJvbU51bWJlcihhLCBiLCBjKTtcbiAgICBlbHNlIGlmIChiID09IG51bGwgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGEpXG4gICAgICB0aGlzLmZyb21TdHJpbmcoYSwgMjU2KTtcbiAgICBlbHNlXG4gICAgICB0aGlzLmZyb21TdHJpbmcoYSwgYik7XG59XG5cbi8vIHJldHVybiBuZXcsIHVuc2V0IEJpZ0ludGVnZXJcbmZ1bmN0aW9uIG5iaSgpIHtcbiAgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKG51bGwpO1xufVxuXG4vLyBhbTogQ29tcHV0ZSB3X2ogKz0gKHgqdGhpc19pKSwgcHJvcGFnYXRlIGNhcnJpZXMsXG4vLyBjIGlzIGluaXRpYWwgY2FycnksIHJldHVybnMgZmluYWwgY2FycnkuXG4vLyBjIDwgMypkdmFsdWUsIHggPCAyKmR2YWx1ZSwgdGhpc19pIDwgZHZhbHVlXG4vLyBXZSBuZWVkIHRvIHNlbGVjdCB0aGUgZmFzdGVzdCBvbmUgdGhhdCB3b3JrcyBpbiB0aGlzIGVudmlyb25tZW50LlxuXG4vLyBhbTE6IHVzZSBhIHNpbmdsZSBtdWx0IGFuZCBkaXZpZGUgdG8gZ2V0IHRoZSBoaWdoIGJpdHMsXG4vLyBtYXggZGlnaXQgYml0cyBzaG91bGQgYmUgMjYgYmVjYXVzZVxuLy8gbWF4IGludGVybmFsIHZhbHVlID0gMipkdmFsdWVeMi0yKmR2YWx1ZSAoPCAyXjUzKVxuZnVuY3Rpb24gYW0xKGksIHgsIHcsIGosIGMsIG4pIHtcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIHYgPSB4ICogdGhpc1tpKytdICsgd1tqXSArIGM7XG4gICAgYyA9IE1hdGguZmxvb3IodiAvIDB4NDAwMDAwMCk7XG4gICAgd1tqKytdID0gdiAmIDB4M2ZmZmZmZjtcbiAgfVxuICByZXR1cm4gYztcbn1cbi8vIGFtMiBhdm9pZHMgYSBiaWcgbXVsdC1hbmQtZXh0cmFjdCBjb21wbGV0ZWx5LlxuLy8gTWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDw9IDMwIGJlY2F1c2Ugd2UgZG8gYml0d2lzZSBvcHNcbi8vIG9uIHZhbHVlcyB1cCB0byAyKmhkdmFsdWVeMi1oZHZhbHVlLTEgKDwgMl4zMSlcbmZ1bmN0aW9uIGFtMihpLCB4LCB3LCBqLCBjLCBuKSB7XG4gIHZhciB4bCA9IHggJiAweDdmZmYsIHhoID0geCA+PiAxNTtcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIGwgPSB0aGlzW2ldICYgMHg3ZmZmO1xuICAgIHZhciBoID0gdGhpc1tpKytdID4+IDE1O1xuICAgIHZhciBtID0geGggKiBsICsgaCAqIHhsO1xuICAgIGwgPSB4bCAqIGwgKyAoKG0gJiAweDdmZmYpIDw8IDE1KSArIHdbal0gKyAoYyAmIDB4M2ZmZmZmZmYpO1xuICAgIGMgPSAobCA+Pj4gMzApICsgKG0gPj4+IDE1KSArIHhoICogaCArIChjID4+PiAzMCk7XG4gICAgd1tqKytdID0gbCAmIDB4M2ZmZmZmZmY7XG4gIH1cbiAgcmV0dXJuIGM7XG59XG4vLyBBbHRlcm5hdGVseSwgc2V0IG1heCBkaWdpdCBiaXRzIHRvIDI4IHNpbmNlIHNvbWVcbi8vIGJyb3dzZXJzIHNsb3cgZG93biB3aGVuIGRlYWxpbmcgd2l0aCAzMi1iaXQgbnVtYmVycy5cbmZ1bmN0aW9uIGFtMyhpLCB4LCB3LCBqLCBjLCBuKSB7XG4gIHZhciB4bCA9IHggJiAweDNmZmYsIHhoID0geCA+PiAxNDtcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIGwgPSB0aGlzW2ldICYgMHgzZmZmO1xuICAgIHZhciBoID0gdGhpc1tpKytdID4+IDE0O1xuICAgIHZhciBtID0geGggKiBsICsgaCAqIHhsO1xuICAgIGwgPSB4bCAqIGwgKyAoKG0gJiAweDNmZmYpIDw8IDE0KSArIHdbal0gKyBjO1xuICAgIGMgPSAobCA+PiAyOCkgKyAobSA+PiAxNCkgKyB4aCAqIGg7XG4gICAgd1tqKytdID0gbCAmIDB4ZmZmZmZmZjtcbiAgfVxuICByZXR1cm4gYztcbn1cbmlmIChpbkJyb3dzZXIgJiYgal9sbSAmJiAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ01pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlcicpKSB7XG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0yO1xuICBkYml0cyA9IDMwO1xufSBlbHNlIGlmIChpbkJyb3dzZXIgJiYgal9sbSAmJiAobmF2aWdhdG9yLmFwcE5hbWUgIT0gJ05ldHNjYXBlJykpIHtcbiAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTE7XG4gIGRiaXRzID0gMjY7XG59IGVsc2UgeyAgLy8gTW96aWxsYS9OZXRzY2FwZSBzZWVtcyB0byBwcmVmZXIgYW0zXG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0zO1xuICBkYml0cyA9IDI4O1xufVxuXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5EQiA9IGRiaXRzO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRE0gPSAoKDEgPDwgZGJpdHMpIC0gMSk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5EViA9ICgxIDw8IGRiaXRzKTtcblxudmFyIEJJX0ZQID0gNTI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GViA9IE1hdGgucG93KDIsIEJJX0ZQKTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLkYxID0gQklfRlAgLSBkYml0cztcbkJpZ0ludGVnZXIucHJvdG90eXBlLkYyID0gMiAqIGRiaXRzIC0gQklfRlA7XG5cbi8vIERpZ2l0IGNvbnZlcnNpb25zXG52YXIgQklfUk0gPSAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbnZhciBCSV9SQyA9IG5ldyBBcnJheSgpO1xudmFyIHJyLCB2djtcbnJyID0gJzAnLmNoYXJDb2RlQXQoMCk7XG5mb3IgKHZ2ID0gMDsgdnYgPD0gOTsgKyt2dikgQklfUkNbcnIrK10gPSB2djtcbnJyID0gJ2EnLmNoYXJDb2RlQXQoMCk7XG5mb3IgKHZ2ID0gMTA7IHZ2IDwgMzY7ICsrdnYpIEJJX1JDW3JyKytdID0gdnY7XG5yciA9ICdBJy5jaGFyQ29kZUF0KDApO1xuZm9yICh2diA9IDEwOyB2diA8IDM2OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2O1xuXG5mdW5jdGlvbiBpbnQyY2hhcihuKSB7XG4gIHJldHVybiBCSV9STS5jaGFyQXQobik7XG59XG5mdW5jdGlvbiBpbnRBdChzLCBpKSB7XG4gIHZhciBjID0gQklfUkNbcy5jaGFyQ29kZUF0KGkpXTtcbiAgcmV0dXJuIChjID09IG51bGwpID8gLTEgOiBjO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjb3B5IHRoaXMgdG8gclxuZnVuY3Rpb24gYm5wQ29weVRvKHIpIHtcbiAgZm9yICh2YXIgaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSByW2ldID0gdGhpc1tpXTtcbiAgci50ID0gdGhpcy50O1xuICByLnMgPSB0aGlzLnM7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHNldCBmcm9tIGludGVnZXIgdmFsdWUgeCwgLURWIDw9IHggPCBEVlxuZnVuY3Rpb24gYm5wRnJvbUludCh4KSB7XG4gIHRoaXMudCA9IDE7XG4gIHRoaXMucyA9ICh4IDwgMCkgPyAtMSA6IDA7XG4gIGlmICh4ID4gMClcbiAgICB0aGlzWzBdID0geDtcbiAgZWxzZSBpZiAoeCA8IC0xKVxuICAgIHRoaXNbMF0gPSB4ICsgdGhpcy5EVjtcbiAgZWxzZVxuICAgIHRoaXMudCA9IDA7XG59XG5cbi8vIHJldHVybiBiaWdpbnQgaW5pdGlhbGl6ZWQgdG8gdmFsdWVcbmZ1bmN0aW9uIG5idihpKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHIuZnJvbUludChpKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHNldCBmcm9tIHN0cmluZyBhbmQgcmFkaXhcbmZ1bmN0aW9uIGJucEZyb21TdHJpbmcocywgYikge1xuICB2YXIgaztcbiAgaWYgKGIgPT0gMTYpXG4gICAgayA9IDQ7XG4gIGVsc2UgaWYgKGIgPT0gOClcbiAgICBrID0gMztcbiAgZWxzZSBpZiAoYiA9PSAyNTYpXG4gICAgayA9IDg7ICAvLyBieXRlIGFycmF5XG4gIGVsc2UgaWYgKGIgPT0gMilcbiAgICBrID0gMTtcbiAgZWxzZSBpZiAoYiA9PSAzMilcbiAgICBrID0gNTtcbiAgZWxzZSBpZiAoYiA9PSA0KVxuICAgIGsgPSAyO1xuICBlbHNlIHtcbiAgICB0aGlzLmZyb21SYWRpeChzLCBiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy50ID0gMDtcbiAgdGhpcy5zID0gMDtcbiAgdmFyIGkgPSBzLmxlbmd0aCwgbWkgPSBmYWxzZSwgc2ggPSAwO1xuICB3aGlsZSAoLS1pID49IDApIHtcbiAgICB2YXIgeCA9IChrID09IDgpID8gc1tpXSAmIDB4ZmYgOiBpbnRBdChzLCBpKTtcbiAgICBpZiAoeCA8IDApIHtcbiAgICAgIGlmIChzLmNoYXJBdChpKSA9PSAnLScpIG1pID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBtaSA9IGZhbHNlO1xuICAgIGlmIChzaCA9PSAwKVxuICAgICAgdGhpc1t0aGlzLnQrK10gPSB4O1xuICAgIGVsc2UgaWYgKHNoICsgayA+IHRoaXMuREIpIHtcbiAgICAgIHRoaXNbdGhpcy50IC0gMV0gfD0gKHggJiAoKDEgPDwgKHRoaXMuREIgLSBzaCkpIC0gMSkpIDw8IHNoO1xuICAgICAgdGhpc1t0aGlzLnQrK10gPSAoeCA+PiAodGhpcy5EQiAtIHNoKSk7XG4gICAgfSBlbHNlXG4gICAgICB0aGlzW3RoaXMudCAtIDFdIHw9IHggPDwgc2g7XG4gICAgc2ggKz0gaztcbiAgICBpZiAoc2ggPj0gdGhpcy5EQikgc2ggLT0gdGhpcy5EQjtcbiAgfVxuICBpZiAoayA9PSA4ICYmIChzWzBdICYgMHg4MCkgIT0gMCkge1xuICAgIHRoaXMucyA9IC0xO1xuICAgIGlmIChzaCA+IDApIHRoaXNbdGhpcy50IC0gMV0gfD0gKCgxIDw8ICh0aGlzLkRCIC0gc2gpKSAtIDEpIDw8IHNoO1xuICB9XG4gIHRoaXMuY2xhbXAoKTtcbiAgaWYgKG1pKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcywgdGhpcyk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNsYW1wIG9mZiBleGNlc3MgaGlnaCB3b3Jkc1xuZnVuY3Rpb24gYm5wQ2xhbXAoKSB7XG4gIHZhciBjID0gdGhpcy5zICYgdGhpcy5ETTtcbiAgd2hpbGUgKHRoaXMudCA+IDAgJiYgdGhpc1t0aGlzLnQgLSAxXSA9PSBjKSAtLXRoaXMudDtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbiBnaXZlbiByYWRpeFxuZnVuY3Rpb24gYm5Ub1N0cmluZyhiKSB7XG4gIGlmICh0aGlzLnMgPCAwKSByZXR1cm4gJy0nICsgdGhpcy5uZWdhdGUoKS50b1N0cmluZyhiKTtcbiAgdmFyIGs7XG4gIGlmIChiID09IDE2KVxuICAgIGsgPSA0O1xuICBlbHNlIGlmIChiID09IDgpXG4gICAgayA9IDM7XG4gIGVsc2UgaWYgKGIgPT0gMilcbiAgICBrID0gMTtcbiAgZWxzZSBpZiAoYiA9PSAzMilcbiAgICBrID0gNTtcbiAgZWxzZSBpZiAoYiA9PSA0KVxuICAgIGsgPSAyO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMudG9SYWRpeChiKTtcbiAgdmFyIGttID0gKDEgPDwgaykgLSAxLCBkLCBtID0gZmFsc2UsIHIgPSAnJywgaSA9IHRoaXMudDtcbiAgdmFyIHAgPSB0aGlzLkRCIC0gKGkgKiB0aGlzLkRCKSAlIGs7XG4gIGlmIChpLS0gPiAwKSB7XG4gICAgaWYgKHAgPCB0aGlzLkRCICYmIChkID0gdGhpc1tpXSA+PiBwKSA+IDApIHtcbiAgICAgIG0gPSB0cnVlO1xuICAgICAgciA9IGludDJjaGFyKGQpO1xuICAgIH1cbiAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICBpZiAocCA8IGspIHtcbiAgICAgICAgZCA9ICh0aGlzW2ldICYgKCgxIDw8IHApIC0gMSkpIDw8IChrIC0gcCk7XG4gICAgICAgIGQgfD0gdGhpc1stLWldID4+IChwICs9IHRoaXMuREIgLSBrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSA+PiAocCAtPSBrKSkgJiBrbTtcbiAgICAgICAgaWYgKHAgPD0gMCkge1xuICAgICAgICAgIHAgKz0gdGhpcy5EQjtcbiAgICAgICAgICAtLWk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkID4gMCkgbSA9IHRydWU7XG4gICAgICBpZiAobSkgciArPSBpbnQyY2hhcihkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG0gPyByIDogJzAnO1xufVxuXG4vLyAocHVibGljKSAtdGhpc1xuZnVuY3Rpb24gYm5OZWdhdGUoKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHx0aGlzfFxuZnVuY3Rpb24gYm5BYnMoKSB7XG4gIHJldHVybiAodGhpcy5zIDwgMCkgPyB0aGlzLm5lZ2F0ZSgpIDogdGhpcztcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuICsgaWYgdGhpcyA+IGEsIC0gaWYgdGhpcyA8IGEsIDAgaWYgZXF1YWxcbmZ1bmN0aW9uIGJuQ29tcGFyZVRvKGEpIHtcbiAgdmFyIHIgPSB0aGlzLnMgLSBhLnM7XG4gIGlmIChyICE9IDApIHJldHVybiByO1xuICB2YXIgaSA9IHRoaXMudDtcbiAgciA9IGkgLSBhLnQ7XG4gIGlmIChyICE9IDApIHJldHVybiAodGhpcy5zIDwgMCkgPyAtciA6IHI7XG4gIHdoaWxlICgtLWkgPj0gMClcbiAgICBpZiAoKHIgPSB0aGlzW2ldIC0gYVtpXSkgIT0gMCkgcmV0dXJuIHI7XG4gIHJldHVybiAwO1xufVxuXG4vLyByZXR1cm5zIGJpdCBsZW5ndGggb2YgdGhlIGludGVnZXIgeFxuZnVuY3Rpb24gbmJpdHMoeCkge1xuICB2YXIgciA9IDEsIHQ7XG4gIGlmICgodCA9IHggPj4+IDE2KSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSAxNjtcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDgpICE9IDApIHtcbiAgICB4ID0gdDtcbiAgICByICs9IDg7XG4gIH1cbiAgaWYgKCh0ID0geCA+PiA0KSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSA0O1xuICB9XG4gIGlmICgodCA9IHggPj4gMikgIT0gMCkge1xuICAgIHggPSB0O1xuICAgIHIgKz0gMjtcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDEpICE9IDApIHtcbiAgICB4ID0gdDtcbiAgICByICs9IDE7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiB0aGUgbnVtYmVyIG9mIGJpdHMgaW4gXCJ0aGlzXCJcbmZ1bmN0aW9uIGJuQml0TGVuZ3RoKCkge1xuICBpZiAodGhpcy50IDw9IDApIHJldHVybiAwO1xuICByZXR1cm4gdGhpcy5EQiAqICh0aGlzLnQgLSAxKSArIG5iaXRzKHRoaXNbdGhpcy50IC0gMV0gXiAodGhpcy5zICYgdGhpcy5ETSkpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA8PCBuKkRCXG5mdW5jdGlvbiBibnBETFNoaWZ0VG8obiwgcikge1xuICB2YXIgaTtcbiAgZm9yIChpID0gdGhpcy50IC0gMTsgaSA+PSAwOyAtLWkpIHJbaSArIG5dID0gdGhpc1tpXTtcbiAgZm9yIChpID0gbiAtIDE7IGkgPj0gMDsgLS1pKSByW2ldID0gMDtcbiAgci50ID0gdGhpcy50ICsgbjtcbiAgci5zID0gdGhpcy5zO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA+PiBuKkRCXG5mdW5jdGlvbiBibnBEUlNoaWZ0VG8obiwgcikge1xuICBmb3IgKHZhciBpID0gbjsgaSA8IHRoaXMudDsgKytpKSByW2kgLSBuXSA9IHRoaXNbaV07XG4gIHIudCA9IE1hdGgubWF4KHRoaXMudCAtIG4sIDApO1xuICByLnMgPSB0aGlzLnM7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIDw8IG5cbmZ1bmN0aW9uIGJucExTaGlmdFRvKG4sIHIpIHtcbiAgdmFyIGJzID0gbiAlIHRoaXMuREI7XG4gIHZhciBjYnMgPSB0aGlzLkRCIC0gYnM7XG4gIHZhciBibSA9ICgxIDw8IGNicykgLSAxO1xuICB2YXIgZHMgPSBNYXRoLmZsb29yKG4gLyB0aGlzLkRCKSwgYyA9ICh0aGlzLnMgPDwgYnMpICYgdGhpcy5ETSwgaTtcbiAgZm9yIChpID0gdGhpcy50IC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICByW2kgKyBkcyArIDFdID0gKHRoaXNbaV0gPj4gY2JzKSB8IGM7XG4gICAgYyA9ICh0aGlzW2ldICYgYm0pIDw8IGJzO1xuICB9XG4gIGZvciAoaSA9IGRzIC0gMTsgaSA+PSAwOyAtLWkpIHJbaV0gPSAwO1xuICByW2RzXSA9IGM7XG4gIHIudCA9IHRoaXMudCArIGRzICsgMTtcbiAgci5zID0gdGhpcy5zO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzID4+IG5cbmZ1bmN0aW9uIGJucFJTaGlmdFRvKG4sIHIpIHtcbiAgci5zID0gdGhpcy5zO1xuICB2YXIgZHMgPSBNYXRoLmZsb29yKG4gLyB0aGlzLkRCKTtcbiAgaWYgKGRzID49IHRoaXMudCkge1xuICAgIHIudCA9IDA7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBicyA9IG4gJSB0aGlzLkRCO1xuICB2YXIgY2JzID0gdGhpcy5EQiAtIGJzO1xuICB2YXIgYm0gPSAoMSA8PCBicykgLSAxO1xuICByWzBdID0gdGhpc1tkc10gPj4gYnM7XG4gIGZvciAodmFyIGkgPSBkcyArIDE7IGkgPCB0aGlzLnQ7ICsraSkge1xuICAgIHJbaSAtIGRzIC0gMV0gfD0gKHRoaXNbaV0gJiBibSkgPDwgY2JzO1xuICAgIHJbaSAtIGRzXSA9IHRoaXNbaV0gPj4gYnM7XG4gIH1cbiAgaWYgKGJzID4gMCkgclt0aGlzLnQgLSBkcyAtIDFdIHw9ICh0aGlzLnMgJiBibSkgPDwgY2JzO1xuICByLnQgPSB0aGlzLnQgLSBkcztcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyAtIGFcbmZ1bmN0aW9uIGJucFN1YlRvKGEsIHIpIHtcbiAgdmFyIGkgPSAwLCBjID0gMCwgbSA9IE1hdGgubWluKGEudCwgdGhpcy50KTtcbiAgd2hpbGUgKGkgPCBtKSB7XG4gICAgYyArPSB0aGlzW2ldIC0gYVtpXTtcbiAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICBjID4+PSB0aGlzLkRCO1xuICB9XG4gIGlmIChhLnQgPCB0aGlzLnQpIHtcbiAgICBjIC09IGEucztcbiAgICB3aGlsZSAoaSA8IHRoaXMudCkge1xuICAgICAgYyArPSB0aGlzW2ldO1xuICAgICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjICs9IHRoaXMucztcbiAgfSBlbHNlIHtcbiAgICBjICs9IHRoaXMucztcbiAgICB3aGlsZSAoaSA8IGEudCkge1xuICAgICAgYyAtPSBhW2ldO1xuICAgICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjIC09IGEucztcbiAgfVxuICByLnMgPSAoYyA8IDApID8gLTEgOiAwO1xuICBpZiAoYyA8IC0xKVxuICAgIHJbaSsrXSA9IHRoaXMuRFYgKyBjO1xuICBlbHNlIGlmIChjID4gMClcbiAgICByW2krK10gPSBjO1xuICByLnQgPSBpO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzICogYSwgciAhPSB0aGlzLGEgKEhBQyAxNC4xMilcbi8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbmZ1bmN0aW9uIGJucE11bHRpcGx5VG8oYSwgcikge1xuICB2YXIgeCA9IHRoaXMuYWJzKCksIHkgPSBhLmFicygpO1xuICB2YXIgaSA9IHgudDtcbiAgci50ID0gaSArIHkudDtcbiAgd2hpbGUgKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IHkudDsgKytpKSByW2kgKyB4LnRdID0geC5hbSgwLCB5W2ldLCByLCBpLCAwLCB4LnQpO1xuICByLnMgPSAwO1xuICByLmNsYW1wKCk7XG4gIGlmICh0aGlzLnMgIT0gYS5zKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ociwgcik7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzXjIsIHIgIT0gdGhpcyAoSEFDIDE0LjE2KVxuZnVuY3Rpb24gYm5wU3F1YXJlVG8ocikge1xuICB2YXIgeCA9IHRoaXMuYWJzKCk7XG4gIHZhciBpID0gci50ID0gMiAqIHgudDtcbiAgd2hpbGUgKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IHgudCAtIDE7ICsraSkge1xuICAgIHZhciBjID0geC5hbShpLCB4W2ldLCByLCAyICogaSwgMCwgMSk7XG4gICAgaWYgKChyW2kgKyB4LnRdICs9IHguYW0oaSArIDEsIDIgKiB4W2ldLCByLCAyICogaSArIDEsIGMsIHgudCAtIGkgLSAxKSkgPj1cbiAgICAgICAgeC5EVikge1xuICAgICAgcltpICsgeC50XSAtPSB4LkRWO1xuICAgICAgcltpICsgeC50ICsgMV0gPSAxO1xuICAgIH1cbiAgfVxuICBpZiAoci50ID4gMCkgcltyLnQgLSAxXSArPSB4LmFtKGksIHhbaV0sIHIsIDIgKiBpLCAwLCAxKTtcbiAgci5zID0gMDtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSBkaXZpZGUgdGhpcyBieSBtLCBxdW90aWVudCBhbmQgcmVtYWluZGVyIHRvIHEsIHIgKEhBQyAxNC4yMClcbi8vIHIgIT0gcSwgdGhpcyAhPSBtLiAgcSBvciByIG1heSBiZSBudWxsLlxuZnVuY3Rpb24gYm5wRGl2UmVtVG8obSwgcSwgcikge1xuICB2YXIgcG0gPSBtLmFicygpO1xuICBpZiAocG0udCA8PSAwKSByZXR1cm47XG4gIHZhciBwdCA9IHRoaXMuYWJzKCk7XG4gIGlmIChwdC50IDwgcG0udCkge1xuICAgIGlmIChxICE9IG51bGwpIHEuZnJvbUludCgwKTtcbiAgICBpZiAociAhPSBudWxsKSB0aGlzLmNvcHlUbyhyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHIgPT0gbnVsbCkgciA9IG5iaSgpO1xuICB2YXIgeSA9IG5iaSgpLCB0cyA9IHRoaXMucywgbXMgPSBtLnM7XG4gIHZhciBuc2ggPSB0aGlzLkRCIC0gbmJpdHMocG1bcG0udCAtIDFdKTsgIC8vIG5vcm1hbGl6ZSBtb2R1bHVzXG4gIGlmIChuc2ggPiAwKSB7XG4gICAgcG0ubFNoaWZ0VG8obnNoLCB5KTtcbiAgICBwdC5sU2hpZnRUbyhuc2gsIHIpO1xuICB9IGVsc2Uge1xuICAgIHBtLmNvcHlUbyh5KTtcbiAgICBwdC5jb3B5VG8ocik7XG4gIH1cbiAgdmFyIHlzID0geS50O1xuICB2YXIgeTAgPSB5W3lzIC0gMV07XG4gIGlmICh5MCA9PSAwKSByZXR1cm47XG4gIHZhciB5dCA9IHkwICogKDEgPDwgdGhpcy5GMSkgKyAoKHlzID4gMSkgPyB5W3lzIC0gMl0gPj4gdGhpcy5GMiA6IDApO1xuICB2YXIgZDEgPSB0aGlzLkZWIC8geXQsIGQyID0gKDEgPDwgdGhpcy5GMSkgLyB5dCwgZSA9IDEgPDwgdGhpcy5GMjtcbiAgdmFyIGkgPSByLnQsIGogPSBpIC0geXMsIHQgPSAocSA9PSBudWxsKSA/IG5iaSgpIDogcTtcbiAgeS5kbFNoaWZ0VG8oaiwgdCk7XG4gIGlmIChyLmNvbXBhcmVUbyh0KSA+PSAwKSB7XG4gICAgcltyLnQrK10gPSAxO1xuICAgIHIuc3ViVG8odCwgcik7XG4gIH1cbiAgQmlnSW50ZWdlci5PTkUuZGxTaGlmdFRvKHlzLCB0KTtcbiAgdC5zdWJUbyh5LCB5KTsgIC8vIFwibmVnYXRpdmVcIiB5IHNvIHdlIGNhbiByZXBsYWNlIHN1YiB3aXRoIGFtIGxhdGVyXG4gIHdoaWxlICh5LnQgPCB5cykgeVt5LnQrK10gPSAwO1xuICB3aGlsZSAoLS1qID49IDApIHtcbiAgICAvLyBFc3RpbWF0ZSBxdW90aWVudCBkaWdpdFxuICAgIHZhciBxZCA9XG4gICAgICAgIChyWy0taV0gPT0geTApID8gdGhpcy5ETSA6IE1hdGguZmxvb3IocltpXSAqIGQxICsgKHJbaSAtIDFdICsgZSkgKiBkMik7XG4gICAgaWYgKChyW2ldICs9IHkuYW0oMCwgcWQsIHIsIGosIDAsIHlzKSkgPCBxZCkgeyAgLy8gVHJ5IGl0IG91dFxuICAgICAgeS5kbFNoaWZ0VG8oaiwgdCk7XG4gICAgICByLnN1YlRvKHQsIHIpO1xuICAgICAgd2hpbGUgKHJbaV0gPCAtLXFkKSByLnN1YlRvKHQsIHIpO1xuICAgIH1cbiAgfVxuICBpZiAocSAhPSBudWxsKSB7XG4gICAgci5kclNoaWZ0VG8oeXMsIHEpO1xuICAgIGlmICh0cyAhPSBtcykgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHEsIHEpO1xuICB9XG4gIHIudCA9IHlzO1xuICByLmNsYW1wKCk7XG4gIGlmIChuc2ggPiAwKSByLnJTaGlmdFRvKG5zaCwgcik7ICAvLyBEZW5vcm1hbGl6ZSByZW1haW5kZXJcbiAgaWYgKHRzIDwgMCkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIsIHIpO1xufVxuXG4vLyAocHVibGljKSB0aGlzIG1vZCBhXG5mdW5jdGlvbiBibk1vZChhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYWJzKCkuZGl2UmVtVG8oYSwgbnVsbCwgcik7XG4gIGlmICh0aGlzLnMgPCAwICYmIHIuY29tcGFyZVRvKEJpZ0ludGVnZXIuWkVSTykgPiAwKSBhLnN1YlRvKHIsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gTW9kdWxhciByZWR1Y3Rpb24gdXNpbmcgXCJjbGFzc2ljXCIgYWxnb3JpdGhtXG5mdW5jdGlvbiBDbGFzc2ljKG0pIHtcbiAgdGhpcy5tID0gbTtcbn1cbmZ1bmN0aW9uIGNDb252ZXJ0KHgpIHtcbiAgaWYgKHgucyA8IDAgfHwgeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKVxuICAgIHJldHVybiB4Lm1vZCh0aGlzLm0pO1xuICBlbHNlXG4gICAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBjUmV2ZXJ0KHgpIHtcbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBjUmVkdWNlKHgpIHtcbiAgeC5kaXZSZW1Ubyh0aGlzLm0sIG51bGwsIHgpO1xufVxuZnVuY3Rpb24gY011bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cbmZ1bmN0aW9uIGNTcXJUbyh4LCByKSB7XG4gIHguc3F1YXJlVG8ocik7XG4gIHRoaXMucmVkdWNlKHIpO1xufVxuXG5DbGFzc2ljLnByb3RvdHlwZS5jb252ZXJ0ID0gY0NvbnZlcnQ7XG5DbGFzc2ljLnByb3RvdHlwZS5yZXZlcnQgPSBjUmV2ZXJ0O1xuQ2xhc3NpYy5wcm90b3R5cGUucmVkdWNlID0gY1JlZHVjZTtcbkNsYXNzaWMucHJvdG90eXBlLm11bFRvID0gY011bFRvO1xuQ2xhc3NpYy5wcm90b3R5cGUuc3FyVG8gPSBjU3FyVG87XG5cbi8vIChwcm90ZWN0ZWQpIHJldHVybiBcIi0xL3RoaXMgJSAyXkRCXCI7IHVzZWZ1bCBmb3IgTW9udC4gcmVkdWN0aW9uXG4vLyBqdXN0aWZpY2F0aW9uOlxuLy8gICAgICAgICB4eSA9PSAxIChtb2QgbSlcbi8vICAgICAgICAgeHkgPSAgMStrbVxuLy8gICB4eSgyLXh5KSA9ICgxK2ttKSgxLWttKVxuLy8geFt5KDIteHkpXSA9IDEta14ybV4yXG4vLyB4W3koMi14eSldID09IDEgKG1vZCBtXjIpXG4vLyBpZiB5IGlzIDEveCBtb2QgbSwgdGhlbiB5KDIteHkpIGlzIDEveCBtb2QgbV4yXG4vLyBzaG91bGQgcmVkdWNlIHggYW5kIHkoMi14eSkgYnkgbV4yIGF0IGVhY2ggc3RlcCB0byBrZWVwIHNpemUgYm91bmRlZC5cbi8vIEpTIG11bHRpcGx5IFwib3ZlcmZsb3dzXCIgZGlmZmVyZW50bHkgZnJvbSBDL0MrKywgc28gY2FyZSBpcyBuZWVkZWQgaGVyZS5cbmZ1bmN0aW9uIGJucEludkRpZ2l0KCkge1xuICBpZiAodGhpcy50IDwgMSkgcmV0dXJuIDA7XG4gIHZhciB4ID0gdGhpc1swXTtcbiAgaWYgKCh4ICYgMSkgPT0gMCkgcmV0dXJuIDA7XG4gIHZhciB5ID0geCAmIDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHkgPT0gMS94IG1vZCAyXjJcbiAgeSA9ICh5ICogKDIgLSAoeCAmIDB4ZikgKiB5KSkgJiAweGY7ICAgICAgICAgICAgICAgICAgICAgLy8geSA9PSAxL3ggbW9kIDJeNFxuICB5ID0gKHkgKiAoMiAtICh4ICYgMHhmZikgKiB5KSkgJiAweGZmOyAgICAgICAgICAgICAgICAgICAvLyB5ID09IDEveCBtb2QgMl44XG4gIHkgPSAoeSAqICgyIC0gKCgoeCAmIDB4ZmZmZikgKiB5KSAmIDB4ZmZmZikpKSAmIDB4ZmZmZjsgIC8vIHkgPT0gMS94IG1vZCAyXjE2XG4gIC8vIGxhc3Qgc3RlcCAtIGNhbGN1bGF0ZSBpbnZlcnNlIG1vZCBEViBkaXJlY3RseTtcbiAgLy8gYXNzdW1lcyAxNiA8IERCIDw9IDMyIGFuZCBhc3N1bWVzIGFiaWxpdHkgdG8gaGFuZGxlIDQ4LWJpdCBpbnRzXG4gIHkgPSAoeSAqICgyIC0geCAqIHkgJSB0aGlzLkRWKSkgJSB0aGlzLkRWOyAgLy8geSA9PSAxL3ggbW9kIDJeZGJpdHNcbiAgLy8gd2UgcmVhbGx5IHdhbnQgdGhlIG5lZ2F0aXZlIGludmVyc2UsIGFuZCAtRFYgPCB5IDwgRFZcbiAgcmV0dXJuICh5ID4gMCkgPyB0aGlzLkRWIC0geSA6IC15O1xufVxuXG4vLyBNb250Z29tZXJ5IHJlZHVjdGlvblxuZnVuY3Rpb24gTW9udGdvbWVyeShtKSB7XG4gIHRoaXMubSA9IG07XG4gIHRoaXMubXAgPSBtLmludkRpZ2l0KCk7XG4gIHRoaXMubXBsID0gdGhpcy5tcCAmIDB4N2ZmZjtcbiAgdGhpcy5tcGggPSB0aGlzLm1wID4+IDE1O1xuICB0aGlzLnVtID0gKDEgPDwgKG0uREIgLSAxNSkpIC0gMTtcbiAgdGhpcy5tdDIgPSAyICogbS50O1xufVxuXG4vLyB4UiBtb2QgbVxuZnVuY3Rpb24gbW9udENvbnZlcnQoeCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB4LmFicygpLmRsU2hpZnRUbyh0aGlzLm0udCwgcik7XG4gIHIuZGl2UmVtVG8odGhpcy5tLCBudWxsLCByKTtcbiAgaWYgKHgucyA8IDAgJiYgci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKSA+IDApIHRoaXMubS5zdWJUbyhyLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIHgvUiBtb2QgbVxuZnVuY3Rpb24gbW9udFJldmVydCh4KSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHguY29weVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIHggPSB4L1IgbW9kIG0gKEhBQyAxNC4zMilcbmZ1bmN0aW9uIG1vbnRSZWR1Y2UoeCkge1xuICB3aGlsZSAoeC50IDw9IHRoaXMubXQyKSAgLy8gcGFkIHggc28gYW0gaGFzIGVub3VnaCByb29tIGxhdGVyXG4gICAgeFt4LnQrK10gPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubS50OyArK2kpIHtcbiAgICAvLyBmYXN0ZXIgd2F5IG9mIGNhbGN1bGF0aW5nIHUwID0geFtpXSptcCBtb2QgRFZcbiAgICB2YXIgaiA9IHhbaV0gJiAweDdmZmY7XG4gICAgdmFyIHUwID0gKGogKiB0aGlzLm1wbCArXG4gICAgICAgICAgICAgICgoKGogKiB0aGlzLm1waCArICh4W2ldID4+IDE1KSAqIHRoaXMubXBsKSAmIHRoaXMudW0pIDw8IDE1KSkgJlxuICAgICAgICB4LkRNO1xuICAgIC8vIHVzZSBhbSB0byBjb21iaW5lIHRoZSBtdWx0aXBseS1zaGlmdC1hZGQgaW50byBvbmUgY2FsbFxuICAgIGogPSBpICsgdGhpcy5tLnQ7XG4gICAgeFtqXSArPSB0aGlzLm0uYW0oMCwgdTAsIHgsIGksIDAsIHRoaXMubS50KTtcbiAgICAvLyBwcm9wYWdhdGUgY2FycnlcbiAgICB3aGlsZSAoeFtqXSA+PSB4LkRWKSB7XG4gICAgICB4W2pdIC09IHguRFY7XG4gICAgICB4Wysral0rKztcbiAgICB9XG4gIH1cbiAgeC5jbGFtcCgpO1xuICB4LmRyU2hpZnRUbyh0aGlzLm0udCwgeCk7XG4gIGlmICh4LmNvbXBhcmVUbyh0aGlzLm0pID49IDApIHguc3ViVG8odGhpcy5tLCB4KTtcbn1cblxuLy8gciA9IFwieF4yL1IgbW9kIG1cIjsgeCAhPSByXG5mdW5jdGlvbiBtb250U3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuLy8gciA9IFwieHkvUiBtb2QgbVwiOyB4LHkgIT0gclxuZnVuY3Rpb24gbW9udE11bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuTW9udGdvbWVyeS5wcm90b3R5cGUuY29udmVydCA9IG1vbnRDb252ZXJ0O1xuTW9udGdvbWVyeS5wcm90b3R5cGUucmV2ZXJ0ID0gbW9udFJldmVydDtcbk1vbnRnb21lcnkucHJvdG90eXBlLnJlZHVjZSA9IG1vbnRSZWR1Y2U7XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5tdWxUbyA9IG1vbnRNdWxUbztcbk1vbnRnb21lcnkucHJvdG90eXBlLnNxclRvID0gbW9udFNxclRvO1xuXG4vLyAocHJvdGVjdGVkKSB0cnVlIGlmZiB0aGlzIGlzIGV2ZW5cbmZ1bmN0aW9uIGJucElzRXZlbigpIHtcbiAgcmV0dXJuICgodGhpcy50ID4gMCkgPyAodGhpc1swXSAmIDEpIDogdGhpcy5zKSA9PSAwO1xufVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzXmUsIGUgPCAyXjMyLCBkb2luZyBzcXIgYW5kIG11bCB3aXRoIFwiclwiIChIQUMgMTQuNzkpXG5mdW5jdGlvbiBibnBFeHAoZSwgeikge1xuICBpZiAoZSA+IDB4ZmZmZmZmZmYgfHwgZSA8IDEpIHJldHVybiBCaWdJbnRlZ2VyLk9ORTtcbiAgdmFyIHIgPSBuYmkoKSwgcjIgPSBuYmkoKSwgZyA9IHouY29udmVydCh0aGlzKSwgaSA9IG5iaXRzKGUpIC0gMTtcbiAgZy5jb3B5VG8ocik7XG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIHouc3FyVG8ociwgcjIpO1xuICAgIGlmICgoZSAmICgxIDw8IGkpKSA+IDApXG4gICAgICB6Lm11bFRvKHIyLCBnLCByKTtcbiAgICBlbHNlIHtcbiAgICAgIHZhciB0ID0gcjtcbiAgICAgIHIgPSByMjtcbiAgICAgIHIyID0gdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHoucmV2ZXJ0KHIpO1xufVxuXG4vLyAocHVibGljKSB0aGlzXmUgJSBtLCAwIDw9IGUgPCAyXjMyXG5mdW5jdGlvbiBibk1vZFBvd0ludChlLCBtKSB7XG4gIHZhciB6O1xuICBpZiAoZSA8IDI1NiB8fCBtLmlzRXZlbigpKVxuICAgIHogPSBuZXcgQ2xhc3NpYyhtKTtcbiAgZWxzZVxuICAgIHogPSBuZXcgTW9udGdvbWVyeShtKTtcbiAgcmV0dXJuIHRoaXMuZXhwKGUsIHopO1xufVxuXG4vLyBwcm90ZWN0ZWRcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNvcHlUbyA9IGJucENvcHlUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21JbnQgPSBibnBGcm9tSW50O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVN0cmluZyA9IGJucEZyb21TdHJpbmc7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGFtcCA9IGJucENsYW1wO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGxTaGlmdFRvID0gYm5wRExTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZHJTaGlmdFRvID0gYm5wRFJTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubFNoaWZ0VG8gPSBibnBMU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLnJTaGlmdFRvID0gYm5wUlNoaWZ0VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zdWJUbyA9IGJucFN1YlRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlUbyA9IGJucE11bHRpcGx5VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zcXVhcmVUbyA9IGJucFNxdWFyZVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2UmVtVG8gPSBibnBEaXZSZW1UbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmludkRpZ2l0ID0gYm5wSW52RGlnaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0V2ZW4gPSBibnBJc0V2ZW47XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5leHAgPSBibnBFeHA7XG5cbi8vIHB1YmxpY1xuQmlnSW50ZWdlci5wcm90b3R5cGUudG9TdHJpbmcgPSBiblRvU3RyaW5nO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubmVnYXRlID0gYm5OZWdhdGU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hYnMgPSBibkFicztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbyA9IGJuQ29tcGFyZVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYml0TGVuZ3RoID0gYm5CaXRMZW5ndGg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2QgPSBibk1vZDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZFBvd0ludCA9IGJuTW9kUG93SW50O1xuXG4vLyBcImNvbnN0YW50c1wiXG5CaWdJbnRlZ2VyLlpFUk8gPSBuYnYoMCk7XG5CaWdJbnRlZ2VyLk9ORSA9IG5idigxKTtcblxuLy8gUG9vbCBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0IGFuZCBncmVhdGVyIHRoYW4gMzIuXG4vLyBBbiBhcnJheSBvZiBieXRlcyB0aGUgc2l6ZSBvZiB0aGUgcG9vbCB3aWxsIGJlIHBhc3NlZCB0byBpbml0KClcbnZhciBybmdfcHNpemUgPSAyNTY7XG5cbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRlZmF1bHQ6IEJpZ0ludGVnZXIsXG4gICAgQmlnSW50ZWdlcjogQmlnSW50ZWdlcixcbiAgfTtcbn0gZWxzZSB7XG4gIHRoaXMuanNibiA9IHtcbiAgICBCaWdJbnRlZ2VyOiBCaWdJbnRlZ2VyLFxuICB9O1xufVxuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDUtMjAwOSAgVG9tIFd1XG4vLyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gU2VlIFwiTElDRU5TRVwiIGZvciBkZXRhaWxzLlxuXG4vLyBFeHRlbmRlZCBKYXZhU2NyaXB0IEJOIGZ1bmN0aW9ucywgcmVxdWlyZWQgZm9yIFJTQSBwcml2YXRlIG9wcy5cblxuLy8gVmVyc2lvbiAxLjE6IG5ldyBCaWdJbnRlZ2VyKFwiMFwiLCAxMCkgcmV0dXJucyBcInByb3BlclwiIHplcm9cbi8vIFZlcnNpb24gMS4yOiBzcXVhcmUoKSBBUEksIGlzUHJvYmFibGVQcmltZSBmaXhcblxuLy8gKHB1YmxpYylcbmZ1bmN0aW9uIGJuQ2xvbmUoKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuY29weVRvKHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGludGVnZXJcbmZ1bmN0aW9uIGJuSW50VmFsdWUoKSB7XG4gIGlmICh0aGlzLnMgPCAwKSB7XG4gICAgaWYgKHRoaXMudCA9PSAxKVxuICAgICAgcmV0dXJuIHRoaXNbMF0gLSB0aGlzLkRWO1xuICAgIGVsc2UgaWYgKHRoaXMudCA9PSAwKVxuICAgICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKHRoaXMudCA9PSAxKVxuICAgIHJldHVybiB0aGlzWzBdO1xuICBlbHNlIGlmICh0aGlzLnQgPT0gMClcbiAgICByZXR1cm4gMDtcbiAgLy8gYXNzdW1lcyAxNiA8IERCIDwgMzJcbiAgcmV0dXJuICgodGhpc1sxXSAmICgoMSA8PCAoMzIgLSB0aGlzLkRCKSkgLSAxKSkgPDwgdGhpcy5EQikgfCB0aGlzWzBdO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgYnl0ZVxuZnVuY3Rpb24gYm5CeXRlVmFsdWUoKSB7XG4gIHJldHVybiAodGhpcy50ID09IDApID8gdGhpcy5zIDogKHRoaXNbMF0gPDwgMjQpID4+IDI0O1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgc2hvcnQgKGFzc3VtZXMgREI+PTE2KVxuZnVuY3Rpb24gYm5TaG9ydFZhbHVlKCkge1xuICByZXR1cm4gKHRoaXMudCA9PSAwKSA/IHRoaXMucyA6ICh0aGlzWzBdIDw8IDE2KSA+PiAxNjtcbn1cblxuLy8gKHByb3RlY3RlZCkgcmV0dXJuIHggcy50LiByXnggPCBEVlxuZnVuY3Rpb24gYm5wQ2h1bmtTaXplKHIpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5MTjIgKiB0aGlzLkRCIC8gTWF0aC5sb2cocikpO1xufVxuXG4vLyAocHVibGljKSAwIGlmIHRoaXMgPT0gMCwgMSBpZiB0aGlzID4gMFxuZnVuY3Rpb24gYm5TaWdOdW0oKSB7XG4gIGlmICh0aGlzLnMgPCAwKVxuICAgIHJldHVybiAtMTtcbiAgZWxzZSBpZiAodGhpcy50IDw9IDAgfHwgKHRoaXMudCA9PSAxICYmIHRoaXNbMF0gPD0gMCkpXG4gICAgcmV0dXJuIDA7XG4gIGVsc2VcbiAgICByZXR1cm4gMTtcbn1cblxuLy8gKHByb3RlY3RlZCkgY29udmVydCB0byByYWRpeCBzdHJpbmdcbmZ1bmN0aW9uIGJucFRvUmFkaXgoYikge1xuICBpZiAoYiA9PSBudWxsKSBiID0gMTA7XG4gIGlmICh0aGlzLnNpZ251bSgpID09IDAgfHwgYiA8IDIgfHwgYiA+IDM2KSByZXR1cm4gJzAnO1xuICB2YXIgY3MgPSB0aGlzLmNodW5rU2l6ZShiKTtcbiAgdmFyIGEgPSBNYXRoLnBvdyhiLCBjcyk7XG4gIHZhciBkID0gbmJ2KGEpLCB5ID0gbmJpKCksIHogPSBuYmkoKSwgciA9ICcnO1xuICB0aGlzLmRpdlJlbVRvKGQsIHksIHopO1xuICB3aGlsZSAoeS5zaWdudW0oKSA+IDApIHtcbiAgICByID0gKGEgKyB6LmludFZhbHVlKCkpLnRvU3RyaW5nKGIpLnN1YnN0cigxKSArIHI7XG4gICAgeS5kaXZSZW1UbyhkLCB5LCB6KTtcbiAgfVxuICByZXR1cm4gei5pbnRWYWx1ZSgpLnRvU3RyaW5nKGIpICsgcjtcbn1cblxuLy8gKHByb3RlY3RlZCkgY29udmVydCBmcm9tIHJhZGl4IHN0cmluZ1xuZnVuY3Rpb24gYm5wRnJvbVJhZGl4KHMsIGIpIHtcbiAgdGhpcy5mcm9tSW50KDApO1xuICBpZiAoYiA9PSBudWxsKSBiID0gMTA7XG4gIHZhciBjcyA9IHRoaXMuY2h1bmtTaXplKGIpO1xuICB2YXIgZCA9IE1hdGgucG93KGIsIGNzKSwgbWkgPSBmYWxzZSwgaiA9IDAsIHcgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgeCA9IGludEF0KHMsIGkpO1xuICAgIGlmICh4IDwgMCkge1xuICAgICAgaWYgKHMuY2hhckF0KGkpID09ICctJyAmJiB0aGlzLnNpZ251bSgpID09IDApIG1pID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB3ID0gYiAqIHcgKyB4O1xuICAgIGlmICgrK2ogPj0gY3MpIHtcbiAgICAgIHRoaXMuZE11bHRpcGx5KGQpO1xuICAgICAgdGhpcy5kQWRkT2Zmc2V0KHcsIDApO1xuICAgICAgaiA9IDA7XG4gICAgICB3ID0gMDtcbiAgICB9XG4gIH1cbiAgaWYgKGogPiAwKSB7XG4gICAgdGhpcy5kTXVsdGlwbHkoTWF0aC5wb3coYiwgaikpO1xuICAgIHRoaXMuZEFkZE9mZnNldCh3LCAwKTtcbiAgfVxuICBpZiAobWkpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLCB0aGlzKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgYWx0ZXJuYXRlIGNvbnN0cnVjdG9yXG5mdW5jdGlvbiBibnBGcm9tTnVtYmVyKGEsIGIsIGMpIHtcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiBiKSB7XG4gICAgLy8gbmV3IEJpZ0ludGVnZXIoaW50LGludCxSTkcpXG4gICAgaWYgKGEgPCAyKVxuICAgICAgdGhpcy5mcm9tSW50KDEpO1xuICAgIGVsc2Uge1xuICAgICAgdGhpcy5mcm9tTnVtYmVyKGEsIGMpO1xuICAgICAgaWYgKCF0aGlzLnRlc3RCaXQoYSAtIDEpKSAgLy8gZm9yY2UgTVNCIHNldFxuICAgICAgICB0aGlzLmJpdHdpc2VUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYSAtIDEpLCBvcF9vciwgdGhpcyk7XG4gICAgICBpZiAodGhpcy5pc0V2ZW4oKSkgdGhpcy5kQWRkT2Zmc2V0KDEsIDApOyAgLy8gZm9yY2Ugb2RkXG4gICAgICB3aGlsZSAoIXRoaXMuaXNQcm9iYWJsZVByaW1lKGIpKSB7XG4gICAgICAgIHRoaXMuZEFkZE9mZnNldCgyLCAwKTtcbiAgICAgICAgaWYgKHRoaXMuYml0TGVuZ3RoKCkgPiBhKVxuICAgICAgICAgIHRoaXMuc3ViVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEgLSAxKSwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIG5ldyBCaWdJbnRlZ2VyKGludCxSTkcpXG4gICAgdmFyIHggPSBuZXcgQXJyYXkoKSwgdCA9IGEgJiA3O1xuICAgIHgubGVuZ3RoID0gKGEgPj4gMykgKyAxO1xuICAgIGIubmV4dEJ5dGVzKHgpO1xuICAgIGlmICh0ID4gMClcbiAgICAgIHhbMF0gJj0gKCgxIDw8IHQpIC0gMSk7XG4gICAgZWxzZVxuICAgICAgeFswXSA9IDA7XG4gICAgdGhpcy5mcm9tU3RyaW5nKHgsIDI1Nik7XG4gIH1cbn1cblxuLy8gKHB1YmxpYykgY29udmVydCB0byBiaWdlbmRpYW4gYnl0ZSBhcnJheVxuZnVuY3Rpb24gYm5Ub0J5dGVBcnJheSgpIHtcbiAgdmFyIGkgPSB0aGlzLnQsIHIgPSBuZXcgQXJyYXkoKTtcbiAgclswXSA9IHRoaXMucztcbiAgdmFyIHAgPSB0aGlzLkRCIC0gKGkgKiB0aGlzLkRCKSAlIDgsIGQsIGsgPSAwO1xuICBpZiAoaS0tID4gMCkge1xuICAgIGlmIChwIDwgdGhpcy5EQiAmJiAoZCA9IHRoaXNbaV0gPj4gcCkgIT0gKHRoaXMucyAmIHRoaXMuRE0pID4+IHApXG4gICAgICByW2srK10gPSBkIHwgKHRoaXMucyA8PCAodGhpcy5EQiAtIHApKTtcbiAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICBpZiAocCA8IDgpIHtcbiAgICAgICAgZCA9ICh0aGlzW2ldICYgKCgxIDw8IHApIC0gMSkpIDw8ICg4IC0gcCk7XG4gICAgICAgIGQgfD0gdGhpc1stLWldID4+IChwICs9IHRoaXMuREIgLSA4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSA+PiAocCAtPSA4KSkgJiAweGZmO1xuICAgICAgICBpZiAocCA8PSAwKSB7XG4gICAgICAgICAgcCArPSB0aGlzLkRCO1xuICAgICAgICAgIC0taTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKChkICYgMHg4MCkgIT0gMCkgZCB8PSAtMjU2O1xuICAgICAgaWYgKGsgPT0gMCAmJiAodGhpcy5zICYgMHg4MCkgIT0gKGQgJiAweDgwKSkgKytrO1xuICAgICAgaWYgKGsgPiAwIHx8IGQgIT0gdGhpcy5zKSByW2srK10gPSBkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gYm5FcXVhbHMoYSkge1xuICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpID09IDApO1xufVxuZnVuY3Rpb24gYm5NaW4oYSkge1xuICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpIDwgMCkgPyB0aGlzIDogYTtcbn1cbmZ1bmN0aW9uIGJuTWF4KGEpIHtcbiAgcmV0dXJuICh0aGlzLmNvbXBhcmVUbyhhKSA+IDApID8gdGhpcyA6IGE7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIG9wIGEgKGJpdHdpc2UpXG5mdW5jdGlvbiBibnBCaXR3aXNlVG8oYSwgb3AsIHIpIHtcbiAgdmFyIGksIGYsIG0gPSBNYXRoLm1pbihhLnQsIHRoaXMudCk7XG4gIGZvciAoaSA9IDA7IGkgPCBtOyArK2kpIHJbaV0gPSBvcCh0aGlzW2ldLCBhW2ldKTtcbiAgaWYgKGEudCA8IHRoaXMudCkge1xuICAgIGYgPSBhLnMgJiB0aGlzLkRNO1xuICAgIGZvciAoaSA9IG07IGkgPCB0aGlzLnQ7ICsraSkgcltpXSA9IG9wKHRoaXNbaV0sIGYpO1xuICAgIHIudCA9IHRoaXMudDtcbiAgfSBlbHNlIHtcbiAgICBmID0gdGhpcy5zICYgdGhpcy5ETTtcbiAgICBmb3IgKGkgPSBtOyBpIDwgYS50OyArK2kpIHJbaV0gPSBvcChmLCBhW2ldKTtcbiAgICByLnQgPSBhLnQ7XG4gIH1cbiAgci5zID0gb3AodGhpcy5zLCBhLnMpO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgJiBhXG5mdW5jdGlvbiBvcF9hbmQoeCwgeSkge1xuICByZXR1cm4geCAmIHk7XG59XG5mdW5jdGlvbiBibkFuZChhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX2FuZCwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzIHwgYVxuZnVuY3Rpb24gb3Bfb3IoeCwgeSkge1xuICByZXR1cm4geCB8IHk7XG59XG5mdW5jdGlvbiBibk9yKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3Bfb3IsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyBeIGFcbmZ1bmN0aW9uIG9wX3hvcih4LCB5KSB7XG4gIHJldHVybiB4IF4geTtcbn1cbmZ1bmN0aW9uIGJuWG9yKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3BfeG9yLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgJiB+YVxuZnVuY3Rpb24gb3BfYW5kbm90KHgsIHkpIHtcbiAgcmV0dXJuIHggJiB+eTtcbn1cbmZ1bmN0aW9uIGJuQW5kTm90KGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3BfYW5kbm90LCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIH50aGlzXG5mdW5jdGlvbiBibk5vdCgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnQ7ICsraSkgcltpXSA9IHRoaXMuRE0gJiB+dGhpc1tpXTtcbiAgci50ID0gdGhpcy50O1xuICByLnMgPSB+dGhpcy5zO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyA8PCBuXG5mdW5jdGlvbiBiblNoaWZ0TGVmdChuKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIGlmIChuIDwgMClcbiAgICB0aGlzLnJTaGlmdFRvKC1uLCByKTtcbiAgZWxzZVxuICAgIHRoaXMubFNoaWZ0VG8obiwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzID4+IG5cbmZ1bmN0aW9uIGJuU2hpZnRSaWdodChuKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIGlmIChuIDwgMClcbiAgICB0aGlzLmxTaGlmdFRvKC1uLCByKTtcbiAgZWxzZVxuICAgIHRoaXMuclNoaWZ0VG8obiwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyByZXR1cm4gaW5kZXggb2YgbG93ZXN0IDEtYml0IGluIHgsIHggPCAyXjMxXG5mdW5jdGlvbiBsYml0KHgpIHtcbiAgaWYgKHggPT0gMCkgcmV0dXJuIC0xO1xuICB2YXIgciA9IDA7XG4gIGlmICgoeCAmIDB4ZmZmZikgPT0gMCkge1xuICAgIHggPj49IDE2O1xuICAgIHIgKz0gMTY7XG4gIH1cbiAgaWYgKCh4ICYgMHhmZikgPT0gMCkge1xuICAgIHggPj49IDg7XG4gICAgciArPSA4O1xuICB9XG4gIGlmICgoeCAmIDB4ZikgPT0gMCkge1xuICAgIHggPj49IDQ7XG4gICAgciArPSA0O1xuICB9XG4gIGlmICgoeCAmIDMpID09IDApIHtcbiAgICB4ID4+PSAyO1xuICAgIHIgKz0gMjtcbiAgfVxuICBpZiAoKHggJiAxKSA9PSAwKSArK3I7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm5zIGluZGV4IG9mIGxvd2VzdCAxLWJpdCAob3IgLTEgaWYgbm9uZSlcbmZ1bmN0aW9uIGJuR2V0TG93ZXN0U2V0Qml0KCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudDsgKytpKVxuICAgIGlmICh0aGlzW2ldICE9IDApIHJldHVybiBpICogdGhpcy5EQiArIGxiaXQodGhpc1tpXSk7XG4gIGlmICh0aGlzLnMgPCAwKSByZXR1cm4gdGhpcy50ICogdGhpcy5EQjtcbiAgcmV0dXJuIC0xO1xufVxuXG4vLyByZXR1cm4gbnVtYmVyIG9mIDEgYml0cyBpbiB4XG5mdW5jdGlvbiBjYml0KHgpIHtcbiAgdmFyIHIgPSAwO1xuICB3aGlsZSAoeCAhPSAwKSB7XG4gICAgeCAmPSB4IC0gMTtcbiAgICArK3I7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiBudW1iZXIgb2Ygc2V0IGJpdHNcbmZ1bmN0aW9uIGJuQml0Q291bnQoKSB7XG4gIHZhciByID0gMCwgeCA9IHRoaXMucyAmIHRoaXMuRE07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHIgKz0gY2JpdCh0aGlzW2ldIF4geCk7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0cnVlIGlmZiBudGggYml0IGlzIHNldFxuZnVuY3Rpb24gYm5UZXN0Qml0KG4pIHtcbiAgdmFyIGogPSBNYXRoLmZsb29yKG4gLyB0aGlzLkRCKTtcbiAgaWYgKGogPj0gdGhpcy50KSByZXR1cm4gKHRoaXMucyAhPSAwKTtcbiAgcmV0dXJuICgodGhpc1tqXSAmICgxIDw8IChuICUgdGhpcy5EQikpKSAhPSAwKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyBvcCAoMTw8bilcbmZ1bmN0aW9uIGJucENoYW5nZUJpdChuLCBvcCkge1xuICB2YXIgciA9IEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChuKTtcbiAgdGhpcy5iaXR3aXNlVG8ociwgb3AsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyB8ICgxPDxuKVxuZnVuY3Rpb24gYm5TZXRCaXQobikge1xuICByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobiwgb3Bfb3IpO1xufVxuXG4vLyAocHVibGljKSB0aGlzICYgfigxPDxuKVxuZnVuY3Rpb24gYm5DbGVhckJpdChuKSB7XG4gIHJldHVybiB0aGlzLmNoYW5nZUJpdChuLCBvcF9hbmRub3QpO1xufVxuXG4vLyAocHVibGljKSB0aGlzIF4gKDE8PG4pXG5mdW5jdGlvbiBibkZsaXBCaXQobikge1xuICByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobiwgb3BfeG9yKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgKyBhXG5mdW5jdGlvbiBibnBBZGRUbyhhLCByKSB7XG4gIHZhciBpID0gMCwgYyA9IDAsIG0gPSBNYXRoLm1pbihhLnQsIHRoaXMudCk7XG4gIHdoaWxlIChpIDwgbSkge1xuICAgIGMgKz0gdGhpc1tpXSArIGFbaV07XG4gICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgYyA+Pj0gdGhpcy5EQjtcbiAgfVxuICBpZiAoYS50IDwgdGhpcy50KSB7XG4gICAgYyArPSBhLnM7XG4gICAgd2hpbGUgKGkgPCB0aGlzLnQpIHtcbiAgICAgIGMgKz0gdGhpc1tpXTtcbiAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyArPSB0aGlzLnM7XG4gIH0gZWxzZSB7XG4gICAgYyArPSB0aGlzLnM7XG4gICAgd2hpbGUgKGkgPCBhLnQpIHtcbiAgICAgIGMgKz0gYVtpXTtcbiAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyArPSBhLnM7XG4gIH1cbiAgci5zID0gKGMgPCAwKSA/IC0xIDogMDtcbiAgaWYgKGMgPiAwKVxuICAgIHJbaSsrXSA9IGM7XG4gIGVsc2UgaWYgKGMgPCAtMSlcbiAgICByW2krK10gPSB0aGlzLkRWICsgYztcbiAgci50ID0gaTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHVibGljKSB0aGlzICsgYVxuZnVuY3Rpb24gYm5BZGQoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmFkZFRvKGEsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAtIGFcbmZ1bmN0aW9uIGJuU3VidHJhY3QoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLnN1YlRvKGEsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAqIGFcbmZ1bmN0aW9uIGJuTXVsdGlwbHkoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLm11bHRpcGx5VG8oYSwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzXjJcbmZ1bmN0aW9uIGJuU3F1YXJlKCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLnNxdWFyZVRvKHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAvIGFcbmZ1bmN0aW9uIGJuRGl2aWRlKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5kaXZSZW1UbyhhLCByLCBudWxsKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgJSBhXG5mdW5jdGlvbiBiblJlbWFpbmRlcihhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuZGl2UmVtVG8oYSwgbnVsbCwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSBbdGhpcy9hLHRoaXMlYV1cbmZ1bmN0aW9uIGJuRGl2aWRlQW5kUmVtYWluZGVyKGEpIHtcbiAgdmFyIHEgPSBuYmkoKSwgciA9IG5iaSgpO1xuICB0aGlzLmRpdlJlbVRvKGEsIHEsIHIpO1xuICByZXR1cm4gbmV3IEFycmF5KHEsIHIpO1xufVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzICo9IG4sIHRoaXMgPj0gMCwgMSA8IG4gPCBEVlxuZnVuY3Rpb24gYm5wRE11bHRpcGx5KG4pIHtcbiAgdGhpc1t0aGlzLnRdID0gdGhpcy5hbSgwLCBuIC0gMSwgdGhpcywgMCwgMCwgdGhpcy50KTtcbiAgKyt0aGlzLnQ7XG4gIHRoaXMuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyArPSBuIDw8IHcgd29yZHMsIHRoaXMgPj0gMFxuZnVuY3Rpb24gYm5wREFkZE9mZnNldChuLCB3KSB7XG4gIGlmIChuID09IDApIHJldHVybjtcbiAgd2hpbGUgKHRoaXMudCA8PSB3KSB0aGlzW3RoaXMudCsrXSA9IDA7XG4gIHRoaXNbd10gKz0gbjtcbiAgd2hpbGUgKHRoaXNbd10gPj0gdGhpcy5EVikge1xuICAgIHRoaXNbd10gLT0gdGhpcy5EVjtcbiAgICBpZiAoKyt3ID49IHRoaXMudCkgdGhpc1t0aGlzLnQrK10gPSAwO1xuICAgICsrdGhpc1t3XTtcbiAgfVxufVxuXG4vLyBBIFwibnVsbFwiIHJlZHVjZXJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZnVuY3Rpb24gTnVsbEV4cCgpIHt9XG5mdW5jdGlvbiBuTm9wKHgpIHtcbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBuTXVsVG8oeCwgeSwgcikge1xuICB4Lm11bHRpcGx5VG8oeSwgcik7XG59XG5mdW5jdGlvbiBuU3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpO1xufVxuXG5OdWxsRXhwLnByb3RvdHlwZS5jb252ZXJ0ID0gbk5vcDtcbk51bGxFeHAucHJvdG90eXBlLnJldmVydCA9IG5Ob3A7XG5OdWxsRXhwLnByb3RvdHlwZS5tdWxUbyA9IG5NdWxUbztcbk51bGxFeHAucHJvdG90eXBlLnNxclRvID0gblNxclRvO1xuXG4vLyAocHVibGljKSB0aGlzXmVcbmZ1bmN0aW9uIGJuUG93KGUpIHtcbiAgcmV0dXJuIHRoaXMuZXhwKGUsIG5ldyBOdWxsRXhwKCkpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gbG93ZXIgbiB3b3JkcyBvZiBcInRoaXMgKiBhXCIsIGEudCA8PSBuXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseUxvd2VyVG8oYSwgbiwgcikge1xuICB2YXIgaSA9IE1hdGgubWluKHRoaXMudCArIGEudCwgbik7XG4gIHIucyA9IDA7ICAvLyBhc3N1bWVzIGEsdGhpcyA+PSAwXG4gIHIudCA9IGk7XG4gIHdoaWxlIChpID4gMCkgclstLWldID0gMDtcbiAgdmFyIGo7XG4gIGZvciAoaiA9IHIudCAtIHRoaXMudDsgaSA8IGo7ICsraSlcbiAgICByW2kgKyB0aGlzLnRdID0gdGhpcy5hbSgwLCBhW2ldLCByLCBpLCAwLCB0aGlzLnQpO1xuICBmb3IgKGogPSBNYXRoLm1pbihhLnQsIG4pOyBpIDwgajsgKytpKSB0aGlzLmFtKDAsIGFbaV0sIHIsIGksIDAsIG4gLSBpKTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gXCJ0aGlzICogYVwiIHdpdGhvdXQgbG93ZXIgbiB3b3JkcywgbiA+IDBcbi8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbmZ1bmN0aW9uIGJucE11bHRpcGx5VXBwZXJUbyhhLCBuLCByKSB7XG4gIC0tbjtcbiAgdmFyIGkgPSByLnQgPSB0aGlzLnQgKyBhLnQgLSBuO1xuICByLnMgPSAwOyAgLy8gYXNzdW1lcyBhLHRoaXMgPj0gMFxuICB3aGlsZSAoLS1pID49IDApIHJbaV0gPSAwO1xuICBmb3IgKGkgPSBNYXRoLm1heChuIC0gdGhpcy50LCAwKTsgaSA8IGEudDsgKytpKVxuICAgIHJbdGhpcy50ICsgaSAtIG5dID0gdGhpcy5hbShuIC0gaSwgYVtpXSwgciwgMCwgMCwgdGhpcy50ICsgaSAtIG4pO1xuICByLmNsYW1wKCk7XG4gIHIuZHJTaGlmdFRvKDEsIHIpO1xufVxuXG4vLyBCYXJyZXR0IG1vZHVsYXIgcmVkdWN0aW9uXG5mdW5jdGlvbiBCYXJyZXR0KG0pIHtcbiAgLy8gc2V0dXAgQmFycmV0dFxuICB0aGlzLnIyID0gbmJpKCk7XG4gIHRoaXMucTMgPSBuYmkoKTtcbiAgQmlnSW50ZWdlci5PTkUuZGxTaGlmdFRvKDIgKiBtLnQsIHRoaXMucjIpO1xuICB0aGlzLm11ID0gdGhpcy5yMi5kaXZpZGUobSk7XG4gIHRoaXMubSA9IG07XG59XG5cbmZ1bmN0aW9uIGJhcnJldHRDb252ZXJ0KHgpIHtcbiAgaWYgKHgucyA8IDAgfHwgeC50ID4gMiAqIHRoaXMubS50KVxuICAgIHJldHVybiB4Lm1vZCh0aGlzLm0pO1xuICBlbHNlIGlmICh4LmNvbXBhcmVUbyh0aGlzLm0pIDwgMClcbiAgICByZXR1cm4geDtcbiAgZWxzZSB7XG4gICAgdmFyIHIgPSBuYmkoKTtcbiAgICB4LmNvcHlUbyhyKTtcbiAgICB0aGlzLnJlZHVjZShyKTtcbiAgICByZXR1cm4gcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXJyZXR0UmV2ZXJ0KHgpIHtcbiAgcmV0dXJuIHg7XG59XG5cbi8vIHggPSB4IG1vZCBtIChIQUMgMTQuNDIpXG5mdW5jdGlvbiBiYXJyZXR0UmVkdWNlKHgpIHtcbiAgeC5kclNoaWZ0VG8odGhpcy5tLnQgLSAxLCB0aGlzLnIyKTtcbiAgaWYgKHgudCA+IHRoaXMubS50ICsgMSkge1xuICAgIHgudCA9IHRoaXMubS50ICsgMTtcbiAgICB4LmNsYW1wKCk7XG4gIH1cbiAgdGhpcy5tdS5tdWx0aXBseVVwcGVyVG8odGhpcy5yMiwgdGhpcy5tLnQgKyAxLCB0aGlzLnEzKTtcbiAgdGhpcy5tLm11bHRpcGx5TG93ZXJUbyh0aGlzLnEzLCB0aGlzLm0udCArIDEsIHRoaXMucjIpO1xuICB3aGlsZSAoeC5jb21wYXJlVG8odGhpcy5yMikgPCAwKSB4LmRBZGRPZmZzZXQoMSwgdGhpcy5tLnQgKyAxKTtcbiAgeC5zdWJUbyh0aGlzLnIyLCB4KTtcbiAgd2hpbGUgKHguY29tcGFyZVRvKHRoaXMubSkgPj0gMCkgeC5zdWJUbyh0aGlzLm0sIHgpO1xufVxuXG4vLyByID0geF4yIG1vZCBtOyB4ICE9IHJcbmZ1bmN0aW9uIGJhcnJldHRTcXJUbyh4LCByKSB7XG4gIHguc3F1YXJlVG8ocik7XG4gIHRoaXMucmVkdWNlKHIpO1xufVxuXG4vLyByID0geCp5IG1vZCBtOyB4LHkgIT0gclxuZnVuY3Rpb24gYmFycmV0dE11bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuQmFycmV0dC5wcm90b3R5cGUuY29udmVydCA9IGJhcnJldHRDb252ZXJ0O1xuQmFycmV0dC5wcm90b3R5cGUucmV2ZXJ0ID0gYmFycmV0dFJldmVydDtcbkJhcnJldHQucHJvdG90eXBlLnJlZHVjZSA9IGJhcnJldHRSZWR1Y2U7XG5CYXJyZXR0LnByb3RvdHlwZS5tdWxUbyA9IGJhcnJldHRNdWxUbztcbkJhcnJldHQucHJvdG90eXBlLnNxclRvID0gYmFycmV0dFNxclRvO1xuXG4vLyAocHVibGljKSB0aGlzXmUgJSBtIChIQUMgMTQuODUpXG5mdW5jdGlvbiBibk1vZFBvdyhlLCBtKSB7XG4gIHZhciBpID0gZS5iaXRMZW5ndGgoKSwgaywgciA9IG5idigxKSwgejtcbiAgaWYgKGkgPD0gMClcbiAgICByZXR1cm4gcjtcbiAgZWxzZSBpZiAoaSA8IDE4KVxuICAgIGsgPSAxO1xuICBlbHNlIGlmIChpIDwgNDgpXG4gICAgayA9IDM7XG4gIGVsc2UgaWYgKGkgPCAxNDQpXG4gICAgayA9IDQ7XG4gIGVsc2UgaWYgKGkgPCA3NjgpXG4gICAgayA9IDU7XG4gIGVsc2VcbiAgICBrID0gNjtcbiAgaWYgKGkgPCA4KVxuICAgIHogPSBuZXcgQ2xhc3NpYyhtKTtcbiAgZWxzZSBpZiAobS5pc0V2ZW4oKSlcbiAgICB6ID0gbmV3IEJhcnJldHQobSk7XG4gIGVsc2VcbiAgICB6ID0gbmV3IE1vbnRnb21lcnkobSk7XG5cbiAgLy8gcHJlY29tcHV0YXRpb25cbiAgdmFyIGcgPSBuZXcgQXJyYXkoKSwgbiA9IDMsIGsxID0gayAtIDEsIGttID0gKDEgPDwgaykgLSAxO1xuICBnWzFdID0gei5jb252ZXJ0KHRoaXMpO1xuICBpZiAoayA+IDEpIHtcbiAgICB2YXIgZzIgPSBuYmkoKTtcbiAgICB6LnNxclRvKGdbMV0sIGcyKTtcbiAgICB3aGlsZSAobiA8PSBrbSkge1xuICAgICAgZ1tuXSA9IG5iaSgpO1xuICAgICAgei5tdWxUbyhnMiwgZ1tuIC0gMl0sIGdbbl0pO1xuICAgICAgbiArPSAyO1xuICAgIH1cbiAgfVxuXG4gIHZhciBqID0gZS50IC0gMSwgdywgaXMxID0gdHJ1ZSwgcjIgPSBuYmkoKSwgdDtcbiAgaSA9IG5iaXRzKGVbal0pIC0gMTtcbiAgd2hpbGUgKGogPj0gMCkge1xuICAgIGlmIChpID49IGsxKVxuICAgICAgdyA9IChlW2pdID4+IChpIC0gazEpKSAmIGttO1xuICAgIGVsc2Uge1xuICAgICAgdyA9IChlW2pdICYgKCgxIDw8IChpICsgMSkpIC0gMSkpIDw8IChrMSAtIGkpO1xuICAgICAgaWYgKGogPiAwKSB3IHw9IGVbaiAtIDFdID4+ICh0aGlzLkRCICsgaSAtIGsxKTtcbiAgICB9XG5cbiAgICBuID0gaztcbiAgICB3aGlsZSAoKHcgJiAxKSA9PSAwKSB7XG4gICAgICB3ID4+PSAxO1xuICAgICAgLS1uO1xuICAgIH1cbiAgICBpZiAoKGkgLT0gbikgPCAwKSB7XG4gICAgICBpICs9IHRoaXMuREI7XG4gICAgICAtLWo7XG4gICAgfVxuICAgIGlmIChpczEpIHsgIC8vIHJldCA9PSAxLCBkb24ndCBib3RoZXIgc3F1YXJpbmcgb3IgbXVsdGlwbHlpbmcgaXRcbiAgICAgIGdbd10uY29weVRvKHIpO1xuICAgICAgaXMxID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlIChuID4gMSkge1xuICAgICAgICB6LnNxclRvKHIsIHIyKTtcbiAgICAgICAgei5zcXJUbyhyMiwgcik7XG4gICAgICAgIG4gLT0gMjtcbiAgICAgIH1cbiAgICAgIGlmIChuID4gMClcbiAgICAgICAgei5zcXJUbyhyLCByMik7XG4gICAgICBlbHNlIHtcbiAgICAgICAgdCA9IHI7XG4gICAgICAgIHIgPSByMjtcbiAgICAgICAgcjIgPSB0O1xuICAgICAgfVxuICAgICAgei5tdWxUbyhyMiwgZ1t3XSwgcik7XG4gICAgfVxuXG4gICAgd2hpbGUgKGogPj0gMCAmJiAoZVtqXSAmICgxIDw8IGkpKSA9PSAwKSB7XG4gICAgICB6LnNxclRvKHIsIHIyKTtcbiAgICAgIHQgPSByO1xuICAgICAgciA9IHIyO1xuICAgICAgcjIgPSB0O1xuICAgICAgaWYgKC0taSA8IDApIHtcbiAgICAgICAgaSA9IHRoaXMuREIgLSAxO1xuICAgICAgICAtLWo7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB6LnJldmVydChyKTtcbn1cblxuLy8gKHB1YmxpYykgZ2NkKHRoaXMsYSkgKEhBQyAxNC41NClcbmZ1bmN0aW9uIGJuR0NEKGEpIHtcbiAgdmFyIHggPSAodGhpcy5zIDwgMCkgPyB0aGlzLm5lZ2F0ZSgpIDogdGhpcy5jbG9uZSgpO1xuICB2YXIgeSA9IChhLnMgPCAwKSA/IGEubmVnYXRlKCkgOiBhLmNsb25lKCk7XG4gIGlmICh4LmNvbXBhcmVUbyh5KSA8IDApIHtcbiAgICB2YXIgdCA9IHg7XG4gICAgeCA9IHk7XG4gICAgeSA9IHQ7XG4gIH1cbiAgdmFyIGkgPSB4LmdldExvd2VzdFNldEJpdCgpLCBnID0geS5nZXRMb3dlc3RTZXRCaXQoKTtcbiAgaWYgKGcgPCAwKSByZXR1cm4geDtcbiAgaWYgKGkgPCBnKSBnID0gaTtcbiAgaWYgKGcgPiAwKSB7XG4gICAgeC5yU2hpZnRUbyhnLCB4KTtcbiAgICB5LnJTaGlmdFRvKGcsIHkpO1xuICB9XG4gIHdoaWxlICh4LnNpZ251bSgpID4gMCkge1xuICAgIGlmICgoaSA9IHguZ2V0TG93ZXN0U2V0Qml0KCkpID4gMCkgeC5yU2hpZnRUbyhpLCB4KTtcbiAgICBpZiAoKGkgPSB5LmdldExvd2VzdFNldEJpdCgpKSA+IDApIHkuclNoaWZ0VG8oaSwgeSk7XG4gICAgaWYgKHguY29tcGFyZVRvKHkpID49IDApIHtcbiAgICAgIHguc3ViVG8oeSwgeCk7XG4gICAgICB4LnJTaGlmdFRvKDEsIHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB5LnN1YlRvKHgsIHkpO1xuICAgICAgeS5yU2hpZnRUbygxLCB5KTtcbiAgICB9XG4gIH1cbiAgaWYgKGcgPiAwKSB5LmxTaGlmdFRvKGcsIHkpO1xuICByZXR1cm4geTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyAlIG4sIG4gPCAyXjI2XG5mdW5jdGlvbiBibnBNb2RJbnQobikge1xuICBpZiAobiA8PSAwKSByZXR1cm4gMDtcbiAgdmFyIGQgPSB0aGlzLkRWICUgbiwgciA9ICh0aGlzLnMgPCAwKSA/IG4gLSAxIDogMDtcbiAgaWYgKHRoaXMudCA+IDApXG4gICAgaWYgKGQgPT0gMClcbiAgICAgIHIgPSB0aGlzWzBdICUgbjtcbiAgICBlbHNlXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50IC0gMTsgaSA+PSAwOyAtLWkpIHIgPSAoZCAqIHIgKyB0aGlzW2ldKSAlIG47XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSAxL3RoaXMgJSBtIChIQUMgMTQuNjEpXG5mdW5jdGlvbiBibk1vZEludmVyc2UobSkge1xuICB2YXIgYWMgPSBtLmlzRXZlbigpO1xuICBpZiAoKHRoaXMuaXNFdmVuKCkgJiYgYWMpIHx8IG0uc2lnbnVtKCkgPT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcbiAgdmFyIHUgPSBtLmNsb25lKCksIHYgPSB0aGlzLmNsb25lKCk7XG4gIHZhciBhID0gbmJ2KDEpLCBiID0gbmJ2KDApLCBjID0gbmJ2KDApLCBkID0gbmJ2KDEpO1xuICB3aGlsZSAodS5zaWdudW0oKSAhPSAwKSB7XG4gICAgd2hpbGUgKHUuaXNFdmVuKCkpIHtcbiAgICAgIHUuclNoaWZ0VG8oMSwgdSk7XG4gICAgICBpZiAoYWMpIHtcbiAgICAgICAgaWYgKCFhLmlzRXZlbigpIHx8ICFiLmlzRXZlbigpKSB7XG4gICAgICAgICAgYS5hZGRUbyh0aGlzLCBhKTtcbiAgICAgICAgICBiLnN1YlRvKG0sIGIpO1xuICAgICAgICB9XG4gICAgICAgIGEuclNoaWZ0VG8oMSwgYSk7XG4gICAgICB9IGVsc2UgaWYgKCFiLmlzRXZlbigpKVxuICAgICAgICBiLnN1YlRvKG0sIGIpO1xuICAgICAgYi5yU2hpZnRUbygxLCBiKTtcbiAgICB9XG4gICAgd2hpbGUgKHYuaXNFdmVuKCkpIHtcbiAgICAgIHYuclNoaWZ0VG8oMSwgdik7XG4gICAgICBpZiAoYWMpIHtcbiAgICAgICAgaWYgKCFjLmlzRXZlbigpIHx8ICFkLmlzRXZlbigpKSB7XG4gICAgICAgICAgYy5hZGRUbyh0aGlzLCBjKTtcbiAgICAgICAgICBkLnN1YlRvKG0sIGQpO1xuICAgICAgICB9XG4gICAgICAgIGMuclNoaWZ0VG8oMSwgYyk7XG4gICAgICB9IGVsc2UgaWYgKCFkLmlzRXZlbigpKVxuICAgICAgICBkLnN1YlRvKG0sIGQpO1xuICAgICAgZC5yU2hpZnRUbygxLCBkKTtcbiAgICB9XG4gICAgaWYgKHUuY29tcGFyZVRvKHYpID49IDApIHtcbiAgICAgIHUuc3ViVG8odiwgdSk7XG4gICAgICBpZiAoYWMpIGEuc3ViVG8oYywgYSk7XG4gICAgICBiLnN1YlRvKGQsIGIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2LnN1YlRvKHUsIHYpO1xuICAgICAgaWYgKGFjKSBjLnN1YlRvKGEsIGMpO1xuICAgICAgZC5zdWJUbyhiLCBkKTtcbiAgICB9XG4gIH1cbiAgaWYgKHYuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSAhPSAwKSByZXR1cm4gQmlnSW50ZWdlci5aRVJPO1xuICBpZiAoZC5jb21wYXJlVG8obSkgPj0gMCkgcmV0dXJuIGQuc3VidHJhY3QobSk7XG4gIGlmIChkLnNpZ251bSgpIDwgMClcbiAgICBkLmFkZFRvKG0sIGQpO1xuICBlbHNlXG4gICAgcmV0dXJuIGQ7XG4gIGlmIChkLnNpZ251bSgpIDwgMClcbiAgICByZXR1cm4gZC5hZGQobSk7XG4gIGVsc2VcbiAgICByZXR1cm4gZDtcbn1cblxudmFyIGxvd3ByaW1lcyA9IFtcbiAgMiwgICAzLCAgIDUsICAgNywgICAxMSwgIDEzLCAgMTcsICAxOSwgIDIzLCAgMjksICAzMSwgIDM3LCAgNDEsICA0MyxcbiAgNDcsICA1MywgIDU5LCAgNjEsICA2NywgIDcxLCAgNzMsICA3OSwgIDgzLCAgODksICA5NywgIDEwMSwgMTAzLCAxMDcsXG4gIDEwOSwgMTEzLCAxMjcsIDEzMSwgMTM3LCAxMzksIDE0OSwgMTUxLCAxNTcsIDE2MywgMTY3LCAxNzMsIDE3OSwgMTgxLFxuICAxOTEsIDE5MywgMTk3LCAxOTksIDIxMSwgMjIzLCAyMjcsIDIyOSwgMjMzLCAyMzksIDI0MSwgMjUxLCAyNTcsIDI2MyxcbiAgMjY5LCAyNzEsIDI3NywgMjgxLCAyODMsIDI5MywgMzA3LCAzMTEsIDMxMywgMzE3LCAzMzEsIDMzNywgMzQ3LCAzNDksXG4gIDM1MywgMzU5LCAzNjcsIDM3MywgMzc5LCAzODMsIDM4OSwgMzk3LCA0MDEsIDQwOSwgNDE5LCA0MjEsIDQzMSwgNDMzLFxuICA0MzksIDQ0MywgNDQ5LCA0NTcsIDQ2MSwgNDYzLCA0NjcsIDQ3OSwgNDg3LCA0OTEsIDQ5OSwgNTAzLCA1MDksIDUyMSxcbiAgNTIzLCA1NDEsIDU0NywgNTU3LCA1NjMsIDU2OSwgNTcxLCA1NzcsIDU4NywgNTkzLCA1OTksIDYwMSwgNjA3LCA2MTMsXG4gIDYxNywgNjE5LCA2MzEsIDY0MSwgNjQzLCA2NDcsIDY1MywgNjU5LCA2NjEsIDY3MywgNjc3LCA2ODMsIDY5MSwgNzAxLFxuICA3MDksIDcxOSwgNzI3LCA3MzMsIDczOSwgNzQzLCA3NTEsIDc1NywgNzYxLCA3NjksIDc3MywgNzg3LCA3OTcsIDgwOSxcbiAgODExLCA4MjEsIDgyMywgODI3LCA4MjksIDgzOSwgODUzLCA4NTcsIDg1OSwgODYzLCA4NzcsIDg4MSwgODgzLCA4ODcsXG4gIDkwNywgOTExLCA5MTksIDkyOSwgOTM3LCA5NDEsIDk0NywgOTUzLCA5NjcsIDk3MSwgOTc3LCA5ODMsIDk5MSwgOTk3XG5dO1xudmFyIGxwbGltID0gKDEgPDwgMjYpIC8gbG93cHJpbWVzW2xvd3ByaW1lcy5sZW5ndGggLSAxXTtcblxuLy8gKHB1YmxpYykgdGVzdCBwcmltYWxpdHkgd2l0aCBjZXJ0YWludHkgPj0gMS0uNV50XG5mdW5jdGlvbiBibklzUHJvYmFibGVQcmltZSh0KSB7XG4gIHZhciBpLCB4ID0gdGhpcy5hYnMoKTtcbiAgaWYgKHgudCA9PSAxICYmIHhbMF0gPD0gbG93cHJpbWVzW2xvd3ByaW1lcy5sZW5ndGggLSAxXSkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsb3dwcmltZXMubGVuZ3RoOyArK2kpXG4gICAgICBpZiAoeFswXSA9PSBsb3dwcmltZXNbaV0pIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoeC5pc0V2ZW4oKSkgcmV0dXJuIGZhbHNlO1xuICBpID0gMTtcbiAgd2hpbGUgKGkgPCBsb3dwcmltZXMubGVuZ3RoKSB7XG4gICAgdmFyIG0gPSBsb3dwcmltZXNbaV0sIGogPSBpICsgMTtcbiAgICB3aGlsZSAoaiA8IGxvd3ByaW1lcy5sZW5ndGggJiYgbSA8IGxwbGltKSBtICo9IGxvd3ByaW1lc1tqKytdO1xuICAgIG0gPSB4Lm1vZEludChtKTtcbiAgICB3aGlsZSAoaSA8IGopXG4gICAgICBpZiAobSAlIGxvd3ByaW1lc1tpKytdID09IDApIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4geC5taWxsZXJSYWJpbih0KTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdHJ1ZSBpZiBwcm9iYWJseSBwcmltZSAoSEFDIDQuMjQsIE1pbGxlci1SYWJpbilcbmZ1bmN0aW9uIGJucE1pbGxlclJhYmluKHQpIHtcbiAgdmFyIG4xID0gdGhpcy5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7XG4gIHZhciBrID0gbjEuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gIGlmIChrIDw9IDApIHJldHVybiBmYWxzZTtcbiAgdmFyIHIgPSBuMS5zaGlmdFJpZ2h0KGspO1xuICB0ID0gKHQgKyAxKSA+PiAxO1xuICBpZiAodCA+IGxvd3ByaW1lcy5sZW5ndGgpIHQgPSBsb3dwcmltZXMubGVuZ3RoO1xuICB2YXIgYSA9IG5iaSgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHQ7ICsraSkge1xuICAgIC8vIFBpY2sgYmFzZXMgYXQgcmFuZG9tLCBpbnN0ZWFkIG9mIHN0YXJ0aW5nIGF0IDJcbiAgICBhLmZyb21JbnQobG93cHJpbWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxvd3ByaW1lcy5sZW5ndGgpXSk7XG4gICAgdmFyIHkgPSBhLm1vZFBvdyhyLCB0aGlzKTtcbiAgICBpZiAoeS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpICE9IDAgJiYgeS5jb21wYXJlVG8objEpICE9IDApIHtcbiAgICAgIHZhciBqID0gMTtcbiAgICAgIHdoaWxlIChqKysgPCBrICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICAgIHkgPSB5Lm1vZFBvd0ludCgyLCB0aGlzKTtcbiAgICAgICAgaWYgKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSA9PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoeS5jb21wYXJlVG8objEpICE9IDApIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIHByb3RlY3RlZFxuQmlnSW50ZWdlci5wcm90b3R5cGUuY2h1bmtTaXplID0gYm5wQ2h1bmtTaXplO1xuQmlnSW50ZWdlci5wcm90b3R5cGUudG9SYWRpeCA9IGJucFRvUmFkaXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tUmFkaXggPSBibnBGcm9tUmFkaXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tTnVtYmVyID0gYm5wRnJvbU51bWJlcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJpdHdpc2VUbyA9IGJucEJpdHdpc2VUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNoYW5nZUJpdCA9IGJucENoYW5nZUJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFkZFRvID0gYm5wQWRkVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kTXVsdGlwbHkgPSBibnBETXVsdGlwbHk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kQWRkT2Zmc2V0ID0gYm5wREFkZE9mZnNldDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5TG93ZXJUbyA9IGJucE11bHRpcGx5TG93ZXJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5VXBwZXJUbyA9IGJucE11bHRpcGx5VXBwZXJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludCA9IGJucE1vZEludDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1pbGxlclJhYmluID0gYm5wTWlsbGVyUmFiaW47XG5cbi8vIHB1YmxpY1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xvbmUgPSBibkNsb25lO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaW50VmFsdWUgPSBibkludFZhbHVlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYnl0ZVZhbHVlID0gYm5CeXRlVmFsdWU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaG9ydFZhbHVlID0gYm5TaG9ydFZhbHVlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2lnbnVtID0gYm5TaWdOdW07XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50b0J5dGVBcnJheSA9IGJuVG9CeXRlQXJyYXk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5lcXVhbHMgPSBibkVxdWFscztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1pbiA9IGJuTWluO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubWF4ID0gYm5NYXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQgPSBibkFuZDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm9yID0gYm5PcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnhvciA9IGJuWG9yO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYW5kTm90ID0gYm5BbmROb3Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5ub3QgPSBibk5vdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0TGVmdCA9IGJuU2hpZnRMZWZ0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRSaWdodCA9IGJuU2hpZnRSaWdodDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmdldExvd2VzdFNldEJpdCA9IGJuR2V0TG93ZXN0U2V0Qml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYml0Q291bnQgPSBibkJpdENvdW50O1xuQmlnSW50ZWdlci5wcm90b3R5cGUudGVzdEJpdCA9IGJuVGVzdEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNldEJpdCA9IGJuU2V0Qml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xlYXJCaXQgPSBibkNsZWFyQml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZmxpcEJpdCA9IGJuRmxpcEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFkZCA9IGJuQWRkO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3QgPSBiblN1YnRyYWN0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHkgPSBibk11bHRpcGx5O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2aWRlID0gYm5EaXZpZGU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5yZW1haW5kZXIgPSBiblJlbWFpbmRlcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZUFuZFJlbWFpbmRlciA9IGJuRGl2aWRlQW5kUmVtYWluZGVyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93ID0gYm5Nb2RQb3c7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnZlcnNlID0gYm5Nb2RJbnZlcnNlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUucG93ID0gYm5Qb3c7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5nY2QgPSBibkdDRDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZSA9IGJuSXNQcm9iYWJsZVByaW1lO1xuXG4vLyBKU0JOLXNwZWNpZmljIGV4dGVuc2lvblxuQmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlID0gYm5TcXVhcmU7XG5cbi8vIEJpZ0ludGVnZXIgaW50ZXJmYWNlcyBub3QgaW1wbGVtZW50ZWQgaW4ganNibjpcblxuLy8gQmlnSW50ZWdlcihpbnQgc2lnbnVtLCBieXRlW10gbWFnbml0dWRlKVxuLy8gZG91YmxlIGRvdWJsZVZhbHVlKClcbi8vIGZsb2F0IGZsb2F0VmFsdWUoKVxuLy8gaW50IGhhc2hDb2RlKClcbi8vIGxvbmcgbG9uZ1ZhbHVlKClcbi8vIHN0YXRpYyBCaWdJbnRlZ2VyIHZhbHVlT2YobG9uZyB2YWwpXG5cbi8vIERlcGVuZHMgb24ganNibi5qcyBhbmQgcm5nLmpzXG5cbi8vIFZlcnNpb24gMS4xOiBzdXBwb3J0IHV0Zi04IGVuY29kaW5nIGluIHBrY3MxcGFkMlxuXG4vLyBjb252ZXJ0IGEgKGhleCkgc3RyaW5nIHRvIGEgYmlnbnVtIG9iamVjdFxuZnVuY3Rpb24gcGFyc2VCaWdJbnQoc3RyLCByKSB7XG4gIHJldHVybiBuZXcgQmlnSW50ZWdlcihzdHIsIHIpO1xufVxuXG5mdW5jdGlvbiBsaW5lYnJrKHMsIG4pIHtcbiAgdmFyIHJldCA9ICcnO1xuICB2YXIgaSA9IDA7XG4gIHdoaWxlIChpICsgbiA8IHMubGVuZ3RoKSB7XG4gICAgcmV0ICs9IHMuc3Vic3RyaW5nKGksIGkgKyBuKSArICdcXG4nO1xuICAgIGkgKz0gbjtcbiAgfVxuICByZXR1cm4gcmV0ICsgcy5zdWJzdHJpbmcoaSwgcy5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBieXRlMkhleChiKSB7XG4gIGlmIChiIDwgMHgxMClcbiAgICByZXR1cm4gJzAnICsgYi50b1N0cmluZygxNik7XG4gIGVsc2VcbiAgICByZXR1cm4gYi50b1N0cmluZygxNik7XG59XG5cbi8vIFBLQ1MjMSAodHlwZSAyLCByYW5kb20pIHBhZCBpbnB1dCBzdHJpbmcgcyB0byBuIGJ5dGVzLCBhbmQgcmV0dXJuIGEgYmlnaW50XG5mdW5jdGlvbiBwa2NzMXBhZDIocywgbikge1xuICBpZiAobiA8IHMubGVuZ3RoICsgMTEpIHsgIC8vIFRPRE86IGZpeCBmb3IgdXRmLThcbiAgICBhbGVydCgnTWVzc2FnZSB0b28gbG9uZyBmb3IgUlNBJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIGJhID0gbmV3IEFycmF5KCk7XG4gIHZhciBpID0gcy5sZW5ndGggLSAxO1xuICB3aGlsZSAoaSA+PSAwICYmIG4gPiAwKSB7XG4gICAgdmFyIGMgPSBzLmNoYXJDb2RlQXQoaS0tKTtcbiAgICBpZiAoYyA8IDEyOCkgeyAgLy8gZW5jb2RlIHVzaW5nIHV0Zi04XG4gICAgICBiYVstLW5dID0gYztcbiAgICB9IGVsc2UgaWYgKChjID4gMTI3KSAmJiAoYyA8IDIwNDgpKSB7XG4gICAgICBiYVstLW5dID0gKGMgJiA2MykgfCAxMjg7XG4gICAgICBiYVstLW5dID0gKGMgPj4gNikgfCAxOTI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhWy0tbl0gPSAoYyAmIDYzKSB8IDEyODtcbiAgICAgIGJhWy0tbl0gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XG4gICAgICBiYVstLW5dID0gKGMgPj4gMTIpIHwgMjI0O1xuICAgIH1cbiAgfVxuICBiYVstLW5dID0gMDtcbiAgdmFyIHJuZyA9IG5ldyBTZWN1cmVSYW5kb20oKTtcbiAgdmFyIHggPSBuZXcgQXJyYXkoKTtcbiAgd2hpbGUgKG4gPiAyKSB7ICAvLyByYW5kb20gbm9uLXplcm8gcGFkXG4gICAgeFswXSA9IDA7XG4gICAgd2hpbGUgKHhbMF0gPT0gMCkgcm5nLm5leHRCeXRlcyh4KTtcbiAgICBiYVstLW5dID0geFswXTtcbiAgfVxuICBiYVstLW5dID0gMjtcbiAgYmFbLS1uXSA9IDA7XG4gIHJldHVybiBuZXcgQmlnSW50ZWdlcihiYSk7XG59XG5cbi8vIFwiZW1wdHlcIiBSU0Ega2V5IGNvbnN0cnVjdG9yXG5mdW5jdGlvbiBSU0FLZXkoKSB7XG4gIHRoaXMubiA9IG51bGw7XG4gIHRoaXMuZSA9IDA7XG4gIHRoaXMuZCA9IG51bGw7XG4gIHRoaXMucCA9IG51bGw7XG4gIHRoaXMucSA9IG51bGw7XG4gIHRoaXMuZG1wMSA9IG51bGw7XG4gIHRoaXMuZG1xMSA9IG51bGw7XG4gIHRoaXMuY29lZmYgPSBudWxsO1xufVxuXG4vLyBTZXQgdGhlIHB1YmxpYyBrZXkgZmllbGRzIE4gYW5kIGUgZnJvbSBoZXggc3RyaW5nc1xuZnVuY3Rpb24gUlNBU2V0UHVibGljKE4sIEUpIHtcbiAgaWYgKE4gIT0gbnVsbCAmJiBFICE9IG51bGwgJiYgTi5sZW5ndGggPiAwICYmIEUubGVuZ3RoID4gMCkge1xuICAgIHRoaXMubiA9IHBhcnNlQmlnSW50KE4sIDE2KTtcbiAgICB0aGlzLmUgPSBwYXJzZUludChFLCAxNik7XG4gIH0gZWxzZVxuICAgIGFsZXJ0KCdJbnZhbGlkIFJTQSBwdWJsaWMga2V5Jyk7XG59XG5cbi8vIFNldCB0aGUgcHJpdmF0ZSBrZXkgZmllbGRzIE4sIGUsIGQgYW5kIENSVCBwYXJhbXMgZnJvbSBoZXggc3RyaW5nc1xuZnVuY3Rpb24gUlNBU2V0UHJpdmF0ZUV4KE4sRSxELFAsUSxEUCxEUSxDKSB7XG4gICAgaWYoTiAhPSBudWxsICYmIEUgIT0gbnVsbCAmJiBOLmxlbmd0aCA+IDAgJiYgRS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLm4gPSBwYXJzZUJpZ0ludChOLDE2KTtcbiAgICAgIHRoaXMuZSA9IHBhcnNlSW50KEUsMTYpO1xuICAgICAgdGhpcy5kID0gcGFyc2VCaWdJbnQoRCwxNik7XG4gICAgICB0aGlzLnAgPSBwYXJzZUJpZ0ludChQLDE2KTtcbiAgICAgIHRoaXMucSA9IHBhcnNlQmlnSW50KFEsMTYpO1xuICAgICAgdGhpcy5kbXAxID0gcGFyc2VCaWdJbnQoRFAsMTYpO1xuICAgICAgdGhpcy5kbXExID0gcGFyc2VCaWdJbnQoRFEsMTYpO1xuICAgICAgdGhpcy5jb2VmZiA9IHBhcnNlQmlnSW50KEMsMTYpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICBhbGVydChcIkludmFsaWQgUlNBIHByaXZhdGUga2V5XCIpO1xuICB9XG5cbi8vIFBlcmZvcm0gcmF3IHByaXZhdGUgb3BlcmF0aW9uIG9uIFwieFwiOiByZXR1cm4geF5kIChtb2QgbilcbmZ1bmN0aW9uIFJTQURvUHJpdmF0ZSh4KSB7XG4gIGlmKHRoaXMucCA9PSBudWxsIHx8IHRoaXMucSA9PSBudWxsKVxuICAgIHJldHVybiB4Lm1vZFBvdyh0aGlzLmQsIHRoaXMubik7XG5cbiAgLy8gVE9ETzogcmUtY2FsY3VsYXRlIGFueSBtaXNzaW5nIENSVCBwYXJhbXNcbiAgdmFyIHhwID0geC5tb2QodGhpcy5wKS5tb2RQb3codGhpcy5kbXAxLCB0aGlzLnApO1xuICB2YXIgeHEgPSB4Lm1vZCh0aGlzLnEpLm1vZFBvdyh0aGlzLmRtcTEsIHRoaXMucSk7XG5cbiAgd2hpbGUoeHAuY29tcGFyZVRvKHhxKSA8IDApXG4gICAgeHAgPSB4cC5hZGQodGhpcy5wKTtcbiAgcmV0dXJuIHhwLnN1YnRyYWN0KHhxKS5tdWx0aXBseSh0aGlzLmNvZWZmKS5tb2QodGhpcy5wKS5tdWx0aXBseSh0aGlzLnEpLmFkZCh4cSk7XG59XG5cbi8vIFBlcmZvcm0gcmF3IHB1YmxpYyBvcGVyYXRpb24gb24gXCJ4XCI6IHJldHVybiB4XmUgKG1vZCBuKVxuZnVuY3Rpb24gUlNBRG9QdWJsaWMoeCkge1xuICByZXR1cm4geC5tb2RQb3dJbnQodGhpcy5lLCB0aGlzLm4pO1xufVxuXG4vLyBSZXR1cm4gdGhlIFBLQ1MjMSBSU0EgZW5jcnlwdGlvbiBvZiBcInRleHRcIiBhcyBhbiBldmVuLWxlbmd0aCBoZXggc3RyaW5nXG5mdW5jdGlvbiBSU0FFbmNyeXB0KHRleHQpIHtcbiAgdmFyIG0gPSBwa2NzMXBhZDIodGV4dCwgKHRoaXMubi5iaXRMZW5ndGgoKSArIDcpID4+IDMpO1xuICBpZiAobSA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgdmFyIGMgPSB0aGlzLmRvUHVibGljKG0pO1xuICBpZiAoYyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgdmFyIGggPSBjLnRvU3RyaW5nKDE2KTtcbiAgaWYgKChoLmxlbmd0aCAmIDEpID09IDApXG4gICAgcmV0dXJuIGg7XG4gIGVsc2VcbiAgICByZXR1cm4gJzAnICsgaDtcbn1cblxuLy8gUmV0dXJuIHRoZSBQS0NTIzEgUlNBIGVuY3J5cHRpb24gb2YgXCJ0ZXh0XCIgYXMgYSBCYXNlNjQtZW5jb2RlZCBzdHJpbmdcbi8vIGZ1bmN0aW9uIFJTQUVuY3J5cHRCNjQodGV4dCkge1xuLy8gIHZhciBoID0gdGhpcy5lbmNyeXB0KHRleHQpO1xuLy8gIGlmKGgpIHJldHVybiBoZXgyYjY0KGgpOyBlbHNlIHJldHVybiBudWxsO1xuLy99XG5cbi8vIHByb3RlY3RlZFxuUlNBS2V5LnByb3RvdHlwZS5kb1B1YmxpYyA9IFJTQURvUHVibGljO1xuXG4vLyBwdWJsaWNcblJTQUtleS5wcm90b3R5cGUuZG9Qcml2YXRlID0gUlNBRG9Qcml2YXRlO1xuUlNBS2V5LnByb3RvdHlwZS5zZXRQdWJsaWMgPSBSU0FTZXRQdWJsaWM7XG5SU0FLZXkucHJvdG90eXBlLnNldFByaXZhdGVFeCA9IFJTQVNldFByaXZhdGVFeDtcblJTQUtleS5wcm90b3R5cGUuZW5jcnlwdCA9IFJTQUVuY3J5cHQ7XG4vLyBSU0FLZXkucHJvdG90eXBlLmVuY3J5cHRfYjY0ID0gUlNBRW5jcnlwdEI2NDtcblxuLy8gUmFuZG9tIG51bWJlciBnZW5lcmF0b3IgLSByZXF1aXJlcyBhIFBSTkcgYmFja2VuZCwgZS5nLiBwcm5nNC5qc1xuXG4vLyBGb3IgYmVzdCByZXN1bHRzLCBwdXQgY29kZSBsaWtlXG4vLyA8Ym9keSBvbkNsaWNrPSdybmdfc2VlZF90aW1lKCk7JyBvbktleVByZXNzPSdybmdfc2VlZF90aW1lKCk7Jz5cbi8vIGluIHlvdXIgbWFpbiBIVE1MIGRvY3VtZW50LlxuXG52YXIgcm5nX3N0YXRlO1xudmFyIHJuZ19wb29sO1xudmFyIHJuZ19wcHRyO1xuXG4vLyBNaXggaW4gYSAzMi1iaXQgaW50ZWdlciBpbnRvIHRoZSBwb29sXG5mdW5jdGlvbiBybmdfc2VlZF9pbnQoeCkge1xuICBybmdfcG9vbFtybmdfcHB0cisrXSBePSB4ICYgMjU1O1xuICBybmdfcG9vbFtybmdfcHB0cisrXSBePSAoeCA+PiA4KSAmIDI1NTtcbiAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0gKHggPj4gMTYpICYgMjU1O1xuICBybmdfcG9vbFtybmdfcHB0cisrXSBePSAoeCA+PiAyNCkgJiAyNTU7XG4gIGlmIChybmdfcHB0ciA+PSBybmdfcHNpemUpIHJuZ19wcHRyIC09IHJuZ19wc2l6ZTtcbn1cblxuLy8gTWl4IGluIHRoZSBjdXJyZW50IHRpbWUgKHcvbWlsbGlzZWNvbmRzKSBpbnRvIHRoZSBwb29sXG5mdW5jdGlvbiBybmdfc2VlZF90aW1lKCkge1xuICBybmdfc2VlZF9pbnQobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xufVxuXG4vLyBJbml0aWFsaXplIHRoZSBwb29sIHdpdGgganVuayBpZiBuZWVkZWQuXG5pZiAocm5nX3Bvb2wgPT0gbnVsbCkge1xuICBybmdfcG9vbCA9IG5ldyBBcnJheSgpO1xuICBybmdfcHB0ciA9IDA7XG4gIHZhciB0O1xuICBpZiAoaW5Ccm93c2VyICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBVc2Ugd2ViY3J5cHRvIGlmIGF2YWlsYWJsZVxuICAgIHZhciB1YSA9IG5ldyBVaW50OEFycmF5KDMyKTtcbiAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyh1YSk7XG4gICAgZm9yICh0ID0gMDsgdCA8IDMyOyArK3QpIHJuZ19wb29sW3JuZ19wcHRyKytdID0gdWFbdF07XG4gIH1cbiAgaWYgKGluQnJvd3NlciAmJiBuYXZpZ2F0b3IuYXBwTmFtZSA9PSAnTmV0c2NhcGUnICYmXG4gICAgICBuYXZpZ2F0b3IuYXBwVmVyc2lvbiA8ICc1JyAmJiB3aW5kb3cuY3J5cHRvKSB7XG4gICAgLy8gRXh0cmFjdCBlbnRyb3B5ICgyNTYgYml0cykgZnJvbSBOUzQgUk5HIGlmIGF2YWlsYWJsZVxuICAgIHZhciB6ID0gd2luZG93LmNyeXB0by5yYW5kb20oMzIpO1xuICAgIGZvciAodCA9IDA7IHQgPCB6Lmxlbmd0aDsgKyt0KSBybmdfcG9vbFtybmdfcHB0cisrXSA9IHouY2hhckNvZGVBdCh0KSAmIDI1NTtcbiAgfVxuICB3aGlsZSAocm5nX3BwdHIgPCBybmdfcHNpemUpIHsgIC8vIGV4dHJhY3Qgc29tZSByYW5kb21uZXNzIGZyb20gTWF0aC5yYW5kb20oKVxuICAgIHQgPSBNYXRoLmZsb29yKDY1NTM2ICogTWF0aC5yYW5kb20oKSk7XG4gICAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSB0ID4+PiA4O1xuICAgIHJuZ19wb29sW3JuZ19wcHRyKytdID0gdCAmIDI1NTtcbiAgfVxuICBybmdfcHB0ciA9IDA7XG4gIHJuZ19zZWVkX3RpbWUoKTtcbiAgLy8gcm5nX3NlZWRfaW50KHdpbmRvdy5zY3JlZW5YKTtcbiAgLy8gcm5nX3NlZWRfaW50KHdpbmRvdy5zY3JlZW5ZKTtcbn1cblxuZnVuY3Rpb24gcm5nX2dldF9ieXRlKCkge1xuICBpZiAocm5nX3N0YXRlID09IG51bGwpIHtcbiAgICBybmdfc2VlZF90aW1lKCk7XG4gICAgcm5nX3N0YXRlID0gcHJuZ19uZXdzdGF0ZSgpO1xuICAgIHJuZ19zdGF0ZS5pbml0KHJuZ19wb29sKTtcbiAgICBmb3IgKHJuZ19wcHRyID0gMDsgcm5nX3BwdHIgPCBybmdfcG9vbC5sZW5ndGg7ICsrcm5nX3BwdHIpXG4gICAgICBybmdfcG9vbFtybmdfcHB0cl0gPSAwO1xuICAgIHJuZ19wcHRyID0gMDtcbiAgICAvLyBybmdfcG9vbCA9IG51bGw7XG4gIH1cbiAgLy8gVE9ETzogYWxsb3cgcmVzZWVkaW5nIGFmdGVyIGZpcnN0IHJlcXVlc3RcbiAgcmV0dXJuIHJuZ19zdGF0ZS5uZXh0KCk7XG59XG5cbmZ1bmN0aW9uIHJuZ19nZXRfYnl0ZXMoYmEpIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBiYS5sZW5ndGg7ICsraSkgYmFbaV0gPSBybmdfZ2V0X2J5dGUoKTtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5mdW5jdGlvbiBTZWN1cmVSYW5kb20oKSB7fVxuXG5TZWN1cmVSYW5kb20ucHJvdG90eXBlLm5leHRCeXRlcyA9IHJuZ19nZXRfYnl0ZXM7XG5cbi8vIHBybmc0LmpzIC0gdXNlcyBBcmNmb3VyIGFzIGEgUFJOR1xuXG5mdW5jdGlvbiBBcmNmb3VyKCkge1xuICB0aGlzLmkgPSAwO1xuICB0aGlzLmogPSAwO1xuICB0aGlzLlMgPSBuZXcgQXJyYXkoKTtcbn1cblxuLy8gSW5pdGlhbGl6ZSBhcmNmb3VyIGNvbnRleHQgZnJvbSBrZXksIGFuIGFycmF5IG9mIGludHMsIGVhY2ggZnJvbSBbMC4uMjU1XVxuZnVuY3Rpb24gQVJDNGluaXQoa2V5KSB7XG4gIHZhciBpLCBqLCB0O1xuICBmb3IgKGkgPSAwOyBpIDwgMjU2OyArK2kpIHRoaXMuU1tpXSA9IGk7XG4gIGogPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICBqID0gKGogKyB0aGlzLlNbaV0gKyBrZXlbaSAlIGtleS5sZW5ndGhdKSAmIDI1NTtcbiAgICB0ID0gdGhpcy5TW2ldO1xuICAgIHRoaXMuU1tpXSA9IHRoaXMuU1tqXTtcbiAgICB0aGlzLlNbal0gPSB0O1xuICB9XG4gIHRoaXMuaSA9IDA7XG4gIHRoaXMuaiA9IDA7XG59XG5cbmZ1bmN0aW9uIEFSQzRuZXh0KCkge1xuICB2YXIgdDtcbiAgdGhpcy5pID0gKHRoaXMuaSArIDEpICYgMjU1O1xuICB0aGlzLmogPSAodGhpcy5qICsgdGhpcy5TW3RoaXMuaV0pICYgMjU1O1xuICB0ID0gdGhpcy5TW3RoaXMuaV07XG4gIHRoaXMuU1t0aGlzLmldID0gdGhpcy5TW3RoaXMual07XG4gIHRoaXMuU1t0aGlzLmpdID0gdDtcbiAgcmV0dXJuIHRoaXMuU1sodCArIHRoaXMuU1t0aGlzLmldKSAmIDI1NV07XG59XG5cbkFyY2ZvdXIucHJvdG90eXBlLmluaXQgPSBBUkM0aW5pdDtcbkFyY2ZvdXIucHJvdG90eXBlLm5leHQgPSBBUkM0bmV4dDtcblxuLy8gUGx1ZyBpbiB5b3VyIFJORyBjb25zdHJ1Y3RvciBoZXJlXG5mdW5jdGlvbiBwcm5nX25ld3N0YXRlKCkge1xuICByZXR1cm4gbmV3IEFyY2ZvdXIoKTtcbn1cblxuLy8gUG9vbCBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0IGFuZCBncmVhdGVyIHRoYW4gMzIuXG4vLyBBbiBhcnJheSBvZiBieXRlcyB0aGUgc2l6ZSBvZiB0aGUgcG9vbCB3aWxsIGJlIHBhc3NlZCB0byBpbml0KClcbnZhciBybmdfcHNpemUgPSAyNTY7XG5cbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgZGVmYXVsdDogQmlnSW50ZWdlcixcbiAgICAgIEJpZ0ludGVnZXI6IEJpZ0ludGVnZXIsXG4gICAgICBSU0FLZXk6IFJTQUtleSxcbiAgfTtcbn0gZWxzZSB7XG4gIHRoaXMuanNibiA9IHtcbiAgICBCaWdJbnRlZ2VyOiBCaWdJbnRlZ2VyLFxuICAgIFJTQUtleTogUlNBS2V5LFxuICB9O1xufVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiLyohXG5cbkpTWmlwIHYzLjEwLjEgLSBBIEphdmFTY3JpcHQgY2xhc3MgZm9yIGdlbmVyYXRpbmcgYW5kIHJlYWRpbmcgemlwIGZpbGVzXG48aHR0cDovL3N0dWFydGsuY29tL2pzemlwPlxuXG4oYykgMjAwOS0yMDE2IFN0dWFydCBLbmlnaHRsZXkgPHN0dWFydCBbYXRdIHN0dWFydGsuY29tPlxuRHVhbCBsaWNlbmNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2Ugb3IgR1BMdjMuIFNlZSBodHRwczovL3Jhdy5naXRodWIuY29tL1N0dWsvanN6aXAvbWFpbi9MSUNFTlNFLm1hcmtkb3duLlxuXG5KU1ppcCB1c2VzIHRoZSBsaWJyYXJ5IHBha28gcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIDpcbmh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlY2EvcGFrby9ibG9iL21haW4vTElDRU5TRVxuKi9cblxuIWZ1bmN0aW9uKGUpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPWUoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sZSk7ZWxzZXsoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp0aGlzKS5KU1ppcD1lKCl9fShmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbiBzKGEsbyxoKXtmdW5jdGlvbiB1KHIsZSl7aWYoIW9bcl0pe2lmKCFhW3JdKXt2YXIgdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFlJiZ0KXJldHVybiB0KHIsITApO2lmKGwpcmV0dXJuIGwociwhMCk7dmFyIG49bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIityK1wiJ1wiKTt0aHJvdyBuLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsbn12YXIgaT1vW3JdPXtleHBvcnRzOnt9fTthW3JdWzBdLmNhbGwoaS5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciB0PWFbcl1bMV1bZV07cmV0dXJuIHUodHx8ZSl9LGksaS5leHBvcnRzLHMsYSxvLGgpfXJldHVybiBvW3JdLmV4cG9ydHN9Zm9yKHZhciBsPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsZT0wO2U8aC5sZW5ndGg7ZSsrKXUoaFtlXSk7cmV0dXJuIHV9KHsxOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGQ9ZShcIi4vdXRpbHNcIiksYz1lKFwiLi9zdXBwb3J0XCIpLHA9XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO3IuZW5jb2RlPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdCxyLG4saSxzLGEsbyxoPVtdLHU9MCxsPWUubGVuZ3RoLGY9bCxjPVwic3RyaW5nXCIhPT1kLmdldFR5cGVPZihlKTt1PGUubGVuZ3RoOylmPWwtdSxuPWM/KHQ9ZVt1KytdLHI9dTxsP2VbdSsrXTowLHU8bD9lW3UrK106MCk6KHQ9ZS5jaGFyQ29kZUF0KHUrKykscj11PGw/ZS5jaGFyQ29kZUF0KHUrKyk6MCx1PGw/ZS5jaGFyQ29kZUF0KHUrKyk6MCksaT10Pj4yLHM9KDMmdCk8PDR8cj4+NCxhPTE8Zj8oMTUmcik8PDJ8bj4+Njo2NCxvPTI8Zj82MyZuOjY0LGgucHVzaChwLmNoYXJBdChpKStwLmNoYXJBdChzKStwLmNoYXJBdChhKStwLmNoYXJBdChvKSk7cmV0dXJuIGguam9pbihcIlwiKX0sci5kZWNvZGU9ZnVuY3Rpb24oZSl7dmFyIHQscixuLGkscyxhLG89MCxoPTAsdT1cImRhdGE6XCI7aWYoZS5zdWJzdHIoMCx1Lmxlbmd0aCk9PT11KXRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYmFzZTY0IGlucHV0LCBpdCBsb29rcyBsaWtlIGEgZGF0YSB1cmwuXCIpO3ZhciBsLGY9MyooZT1lLnJlcGxhY2UoL1teQS1aYS16MC05Ky89XS9nLFwiXCIpKS5sZW5ndGgvNDtpZihlLmNoYXJBdChlLmxlbmd0aC0xKT09PXAuY2hhckF0KDY0KSYmZi0tLGUuY2hhckF0KGUubGVuZ3RoLTIpPT09cC5jaGFyQXQoNjQpJiZmLS0sZiUxIT0wKXRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYmFzZTY0IGlucHV0LCBiYWQgY29udGVudCBsZW5ndGguXCIpO2ZvcihsPWMudWludDhhcnJheT9uZXcgVWludDhBcnJheSgwfGYpOm5ldyBBcnJheSgwfGYpO288ZS5sZW5ndGg7KXQ9cC5pbmRleE9mKGUuY2hhckF0KG8rKykpPDwyfChpPXAuaW5kZXhPZihlLmNoYXJBdChvKyspKSk+PjQscj0oMTUmaSk8PDR8KHM9cC5pbmRleE9mKGUuY2hhckF0KG8rKykpKT4+MixuPSgzJnMpPDw2fChhPXAuaW5kZXhPZihlLmNoYXJBdChvKyspKSksbFtoKytdPXQsNjQhPT1zJiYobFtoKytdPXIpLDY0IT09YSYmKGxbaCsrXT1uKTtyZXR1cm4gbH19LHtcIi4vc3VwcG9ydFwiOjMwLFwiLi91dGlsc1wiOjMyfV0sMjpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL2V4dGVybmFsXCIpLGk9ZShcIi4vc3RyZWFtL0RhdGFXb3JrZXJcIikscz1lKFwiLi9zdHJlYW0vQ3JjMzJQcm9iZVwiKSxhPWUoXCIuL3N0cmVhbS9EYXRhTGVuZ3RoUHJvYmVcIik7ZnVuY3Rpb24gbyhlLHQscixuLGkpe3RoaXMuY29tcHJlc3NlZFNpemU9ZSx0aGlzLnVuY29tcHJlc3NlZFNpemU9dCx0aGlzLmNyYzMyPXIsdGhpcy5jb21wcmVzc2lvbj1uLHRoaXMuY29tcHJlc3NlZENvbnRlbnQ9aX1vLnByb3RvdHlwZT17Z2V0Q29udGVudFdvcmtlcjpmdW5jdGlvbigpe3ZhciBlPW5ldyBpKG4uUHJvbWlzZS5yZXNvbHZlKHRoaXMuY29tcHJlc3NlZENvbnRlbnQpKS5waXBlKHRoaXMuY29tcHJlc3Npb24udW5jb21wcmVzc1dvcmtlcigpKS5waXBlKG5ldyBhKFwiZGF0YV9sZW5ndGhcIikpLHQ9dGhpcztyZXR1cm4gZS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7aWYodGhpcy5zdHJlYW1JbmZvLmRhdGFfbGVuZ3RoIT09dC51bmNvbXByZXNzZWRTaXplKXRocm93IG5ldyBFcnJvcihcIkJ1ZyA6IHVuY29tcHJlc3NlZCBkYXRhIHNpemUgbWlzbWF0Y2hcIil9KSxlfSxnZXRDb21wcmVzc2VkV29ya2VyOmZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBpKG4uUHJvbWlzZS5yZXNvbHZlKHRoaXMuY29tcHJlc3NlZENvbnRlbnQpKS53aXRoU3RyZWFtSW5mbyhcImNvbXByZXNzZWRTaXplXCIsdGhpcy5jb21wcmVzc2VkU2l6ZSkud2l0aFN0cmVhbUluZm8oXCJ1bmNvbXByZXNzZWRTaXplXCIsdGhpcy51bmNvbXByZXNzZWRTaXplKS53aXRoU3RyZWFtSW5mbyhcImNyYzMyXCIsdGhpcy5jcmMzMikud2l0aFN0cmVhbUluZm8oXCJjb21wcmVzc2lvblwiLHRoaXMuY29tcHJlc3Npb24pfX0sby5jcmVhdGVXb3JrZXJGcm9tPWZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4gZS5waXBlKG5ldyBzKS5waXBlKG5ldyBhKFwidW5jb21wcmVzc2VkU2l6ZVwiKSkucGlwZSh0LmNvbXByZXNzV29ya2VyKHIpKS5waXBlKG5ldyBhKFwiY29tcHJlc3NlZFNpemVcIikpLndpdGhTdHJlYW1JbmZvKFwiY29tcHJlc3Npb25cIix0KX0sdC5leHBvcnRzPW99LHtcIi4vZXh0ZXJuYWxcIjo2LFwiLi9zdHJlYW0vQ3JjMzJQcm9iZVwiOjI1LFwiLi9zdHJlYW0vRGF0YUxlbmd0aFByb2JlXCI6MjYsXCIuL3N0cmVhbS9EYXRhV29ya2VyXCI6Mjd9XSwzOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIik7ci5TVE9SRT17bWFnaWM6XCJcXDBcXDBcIixjb21wcmVzc1dvcmtlcjpmdW5jdGlvbigpe3JldHVybiBuZXcgbihcIlNUT1JFIGNvbXByZXNzaW9uXCIpfSx1bmNvbXByZXNzV29ya2VyOmZ1bmN0aW9uKCl7cmV0dXJuIG5ldyBuKFwiU1RPUkUgZGVjb21wcmVzc2lvblwiKX19LHIuREVGTEFURT1lKFwiLi9mbGF0ZVwiKX0se1wiLi9mbGF0ZVwiOjcsXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCI6Mjh9XSw0OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vdXRpbHNcIik7dmFyIG89ZnVuY3Rpb24oKXtmb3IodmFyIGUsdD1bXSxyPTA7cjwyNTY7cisrKXtlPXI7Zm9yKHZhciBuPTA7bjw4O24rKyllPTEmZT8zOTg4MjkyMzg0XmU+Pj4xOmU+Pj4xO3Rbcl09ZX1yZXR1cm4gdH0oKTt0LmV4cG9ydHM9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdm9pZCAwIT09ZSYmZS5sZW5ndGg/XCJzdHJpbmdcIiE9PW4uZ2V0VHlwZU9mKGUpP2Z1bmN0aW9uKGUsdCxyLG4pe3ZhciBpPW8scz1uK3I7ZV49LTE7Zm9yKHZhciBhPW47YTxzO2ErKyllPWU+Pj44XmlbMjU1JihlXnRbYV0pXTtyZXR1cm4tMV5lfSgwfHQsZSxlLmxlbmd0aCwwKTpmdW5jdGlvbihlLHQscixuKXt2YXIgaT1vLHM9bityO2VePS0xO2Zvcih2YXIgYT1uO2E8czthKyspZT1lPj4+OF5pWzI1NSYoZV50LmNoYXJDb2RlQXQoYSkpXTtyZXR1cm4tMV5lfSgwfHQsZSxlLmxlbmd0aCwwKTowfX0se1wiLi91dGlsc1wiOjMyfV0sNTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3IuYmFzZTY0PSExLHIuYmluYXJ5PSExLHIuZGlyPSExLHIuY3JlYXRlRm9sZGVycz0hMCxyLmRhdGU9bnVsbCxyLmNvbXByZXNzaW9uPW51bGwsci5jb21wcmVzc2lvbk9wdGlvbnM9bnVsbCxyLmNvbW1lbnQ9bnVsbCxyLnVuaXhQZXJtaXNzaW9ucz1udWxsLHIuZG9zUGVybWlzc2lvbnM9bnVsbH0se31dLDY6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1udWxsO249XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFByb21pc2U/UHJvbWlzZTplKFwibGllXCIpLHQuZXhwb3J0cz17UHJvbWlzZTpufX0se2xpZTozN31dLDc6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cInVuZGVmaW5lZFwiIT10eXBlb2YgVWludDhBcnJheSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQxNkFycmF5JiZcInVuZGVmaW5lZFwiIT10eXBlb2YgVWludDMyQXJyYXksaT1lKFwicGFrb1wiKSxzPWUoXCIuL3V0aWxzXCIpLGE9ZShcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIiksbz1uP1widWludDhhcnJheVwiOlwiYXJyYXlcIjtmdW5jdGlvbiBoKGUsdCl7YS5jYWxsKHRoaXMsXCJGbGF0ZVdvcmtlci9cIitlKSx0aGlzLl9wYWtvPW51bGwsdGhpcy5fcGFrb0FjdGlvbj1lLHRoaXMuX3Bha29PcHRpb25zPXQsdGhpcy5tZXRhPXt9fXIubWFnaWM9XCJcXGJcXDBcIixzLmluaGVyaXRzKGgsYSksaC5wcm90b3R5cGUucHJvY2Vzc0NodW5rPWZ1bmN0aW9uKGUpe3RoaXMubWV0YT1lLm1ldGEsbnVsbD09PXRoaXMuX3Bha28mJnRoaXMuX2NyZWF0ZVBha28oKSx0aGlzLl9wYWtvLnB1c2gocy50cmFuc2Zvcm1UbyhvLGUuZGF0YSksITEpfSxoLnByb3RvdHlwZS5mbHVzaD1mdW5jdGlvbigpe2EucHJvdG90eXBlLmZsdXNoLmNhbGwodGhpcyksbnVsbD09PXRoaXMuX3Bha28mJnRoaXMuX2NyZWF0ZVBha28oKSx0aGlzLl9wYWtvLnB1c2goW10sITApfSxoLnByb3RvdHlwZS5jbGVhblVwPWZ1bmN0aW9uKCl7YS5wcm90b3R5cGUuY2xlYW5VcC5jYWxsKHRoaXMpLHRoaXMuX3Bha289bnVsbH0saC5wcm90b3R5cGUuX2NyZWF0ZVBha289ZnVuY3Rpb24oKXt0aGlzLl9wYWtvPW5ldyBpW3RoaXMuX3Bha29BY3Rpb25dKHtyYXc6ITAsbGV2ZWw6dGhpcy5fcGFrb09wdGlvbnMubGV2ZWx8fC0xfSk7dmFyIHQ9dGhpczt0aGlzLl9wYWtvLm9uRGF0YT1mdW5jdGlvbihlKXt0LnB1c2goe2RhdGE6ZSxtZXRhOnQubWV0YX0pfX0sci5jb21wcmVzc1dvcmtlcj1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IGgoXCJEZWZsYXRlXCIsZSl9LHIudW5jb21wcmVzc1dvcmtlcj1mdW5jdGlvbigpe3JldHVybiBuZXcgaChcIkluZmxhdGVcIix7fSl9fSx7XCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCI6MjgsXCIuL3V0aWxzXCI6MzIscGFrbzozOH1dLDg6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBBKGUsdCl7dmFyIHIsbj1cIlwiO2ZvcihyPTA7cjx0O3IrKyluKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDI1NSZlKSxlPj4+PTg7cmV0dXJuIG59ZnVuY3Rpb24gbihlLHQscixuLGkscyl7dmFyIGEsbyxoPWUuZmlsZSx1PWUuY29tcHJlc3Npb24sbD1zIT09Ty51dGY4ZW5jb2RlLGY9SS50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLHMoaC5uYW1lKSksYz1JLnRyYW5zZm9ybVRvKFwic3RyaW5nXCIsTy51dGY4ZW5jb2RlKGgubmFtZSkpLGQ9aC5jb21tZW50LHA9SS50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLHMoZCkpLG09SS50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLE8udXRmOGVuY29kZShkKSksXz1jLmxlbmd0aCE9PWgubmFtZS5sZW5ndGgsZz1tLmxlbmd0aCE9PWQubGVuZ3RoLGI9XCJcIix2PVwiXCIseT1cIlwiLHc9aC5kaXIsaz1oLmRhdGUseD17Y3JjMzI6MCxjb21wcmVzc2VkU2l6ZTowLHVuY29tcHJlc3NlZFNpemU6MH07dCYmIXJ8fCh4LmNyYzMyPWUuY3JjMzIseC5jb21wcmVzc2VkU2l6ZT1lLmNvbXByZXNzZWRTaXplLHgudW5jb21wcmVzc2VkU2l6ZT1lLnVuY29tcHJlc3NlZFNpemUpO3ZhciBTPTA7dCYmKFN8PTgpLGx8fCFfJiYhZ3x8KFN8PTIwNDgpO3ZhciB6PTAsQz0wO3cmJih6fD0xNiksXCJVTklYXCI9PT1pPyhDPTc5OCx6fD1mdW5jdGlvbihlLHQpe3ZhciByPWU7cmV0dXJuIGV8fChyPXQ/MTY4OTM6MzMyMDQpLCg2NTUzNSZyKTw8MTZ9KGgudW5peFBlcm1pc3Npb25zLHcpKTooQz0yMCx6fD1mdW5jdGlvbihlKXtyZXR1cm4gNjMmKGV8fDApfShoLmRvc1Blcm1pc3Npb25zKSksYT1rLmdldFVUQ0hvdXJzKCksYTw8PTYsYXw9ay5nZXRVVENNaW51dGVzKCksYTw8PTUsYXw9ay5nZXRVVENTZWNvbmRzKCkvMixvPWsuZ2V0VVRDRnVsbFllYXIoKS0xOTgwLG88PD00LG98PWsuZ2V0VVRDTW9udGgoKSsxLG88PD01LG98PWsuZ2V0VVRDRGF0ZSgpLF8mJih2PUEoMSwxKStBKEIoZiksNCkrYyxiKz1cInVwXCIrQSh2Lmxlbmd0aCwyKSt2KSxnJiYoeT1BKDEsMSkrQShCKHApLDQpK20sYis9XCJ1Y1wiK0EoeS5sZW5ndGgsMikreSk7dmFyIEU9XCJcIjtyZXR1cm4gRSs9XCJcXG5cXDBcIixFKz1BKFMsMiksRSs9dS5tYWdpYyxFKz1BKGEsMiksRSs9QShvLDIpLEUrPUEoeC5jcmMzMiw0KSxFKz1BKHguY29tcHJlc3NlZFNpemUsNCksRSs9QSh4LnVuY29tcHJlc3NlZFNpemUsNCksRSs9QShmLmxlbmd0aCwyKSxFKz1BKGIubGVuZ3RoLDIpLHtmaWxlUmVjb3JkOlIuTE9DQUxfRklMRV9IRUFERVIrRStmK2IsZGlyUmVjb3JkOlIuQ0VOVFJBTF9GSUxFX0hFQURFUitBKEMsMikrRStBKHAubGVuZ3RoLDIpK1wiXFwwXFwwXFwwXFwwXCIrQSh6LDQpK0Eobiw0KStmK2IrcH19dmFyIEk9ZShcIi4uL3V0aWxzXCIpLGk9ZShcIi4uL3N0cmVhbS9HZW5lcmljV29ya2VyXCIpLE89ZShcIi4uL3V0ZjhcIiksQj1lKFwiLi4vY3JjMzJcIiksUj1lKFwiLi4vc2lnbmF0dXJlXCIpO2Z1bmN0aW9uIHMoZSx0LHIsbil7aS5jYWxsKHRoaXMsXCJaaXBGaWxlV29ya2VyXCIpLHRoaXMuYnl0ZXNXcml0dGVuPTAsdGhpcy56aXBDb21tZW50PXQsdGhpcy56aXBQbGF0Zm9ybT1yLHRoaXMuZW5jb2RlRmlsZU5hbWU9bix0aGlzLnN0cmVhbUZpbGVzPWUsdGhpcy5hY2N1bXVsYXRlPSExLHRoaXMuY29udGVudEJ1ZmZlcj1bXSx0aGlzLmRpclJlY29yZHM9W10sdGhpcy5jdXJyZW50U291cmNlT2Zmc2V0PTAsdGhpcy5lbnRyaWVzQ291bnQ9MCx0aGlzLmN1cnJlbnRGaWxlPW51bGwsdGhpcy5fc291cmNlcz1bXX1JLmluaGVyaXRzKHMsaSkscy5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihlKXt2YXIgdD1lLm1ldGEucGVyY2VudHx8MCxyPXRoaXMuZW50cmllc0NvdW50LG49dGhpcy5fc291cmNlcy5sZW5ndGg7dGhpcy5hY2N1bXVsYXRlP3RoaXMuY29udGVudEJ1ZmZlci5wdXNoKGUpOih0aGlzLmJ5dGVzV3JpdHRlbis9ZS5kYXRhLmxlbmd0aCxpLnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcyx7ZGF0YTplLmRhdGEsbWV0YTp7Y3VycmVudEZpbGU6dGhpcy5jdXJyZW50RmlsZSxwZXJjZW50OnI/KHQrMTAwKihyLW4tMSkpL3I6MTAwfX0pKX0scy5wcm90b3R5cGUub3BlbmVkU291cmNlPWZ1bmN0aW9uKGUpe3RoaXMuY3VycmVudFNvdXJjZU9mZnNldD10aGlzLmJ5dGVzV3JpdHRlbix0aGlzLmN1cnJlbnRGaWxlPWUuZmlsZS5uYW1lO3ZhciB0PXRoaXMuc3RyZWFtRmlsZXMmJiFlLmZpbGUuZGlyO2lmKHQpe3ZhciByPW4oZSx0LCExLHRoaXMuY3VycmVudFNvdXJjZU9mZnNldCx0aGlzLnppcFBsYXRmb3JtLHRoaXMuZW5jb2RlRmlsZU5hbWUpO3RoaXMucHVzaCh7ZGF0YTpyLmZpbGVSZWNvcmQsbWV0YTp7cGVyY2VudDowfX0pfWVsc2UgdGhpcy5hY2N1bXVsYXRlPSEwfSxzLnByb3RvdHlwZS5jbG9zZWRTb3VyY2U9ZnVuY3Rpb24oZSl7dGhpcy5hY2N1bXVsYXRlPSExO3ZhciB0PXRoaXMuc3RyZWFtRmlsZXMmJiFlLmZpbGUuZGlyLHI9bihlLHQsITAsdGhpcy5jdXJyZW50U291cmNlT2Zmc2V0LHRoaXMuemlwUGxhdGZvcm0sdGhpcy5lbmNvZGVGaWxlTmFtZSk7aWYodGhpcy5kaXJSZWNvcmRzLnB1c2goci5kaXJSZWNvcmQpLHQpdGhpcy5wdXNoKHtkYXRhOmZ1bmN0aW9uKGUpe3JldHVybiBSLkRBVEFfREVTQ1JJUFRPUitBKGUuY3JjMzIsNCkrQShlLmNvbXByZXNzZWRTaXplLDQpK0EoZS51bmNvbXByZXNzZWRTaXplLDQpfShlKSxtZXRhOntwZXJjZW50OjEwMH19KTtlbHNlIGZvcih0aGlzLnB1c2goe2RhdGE6ci5maWxlUmVjb3JkLG1ldGE6e3BlcmNlbnQ6MH19KTt0aGlzLmNvbnRlbnRCdWZmZXIubGVuZ3RoOyl0aGlzLnB1c2godGhpcy5jb250ZW50QnVmZmVyLnNoaWZ0KCkpO3RoaXMuY3VycmVudEZpbGU9bnVsbH0scy5wcm90b3R5cGUuZmx1c2g9ZnVuY3Rpb24oKXtmb3IodmFyIGU9dGhpcy5ieXRlc1dyaXR0ZW4sdD0wO3Q8dGhpcy5kaXJSZWNvcmRzLmxlbmd0aDt0KyspdGhpcy5wdXNoKHtkYXRhOnRoaXMuZGlyUmVjb3Jkc1t0XSxtZXRhOntwZXJjZW50OjEwMH19KTt2YXIgcj10aGlzLmJ5dGVzV3JpdHRlbi1lLG49ZnVuY3Rpb24oZSx0LHIsbixpKXt2YXIgcz1JLnRyYW5zZm9ybVRvKFwic3RyaW5nXCIsaShuKSk7cmV0dXJuIFIuQ0VOVFJBTF9ESVJFQ1RPUllfRU5EK1wiXFwwXFwwXFwwXFwwXCIrQShlLDIpK0EoZSwyKStBKHQsNCkrQShyLDQpK0Eocy5sZW5ndGgsMikrc30odGhpcy5kaXJSZWNvcmRzLmxlbmd0aCxyLGUsdGhpcy56aXBDb21tZW50LHRoaXMuZW5jb2RlRmlsZU5hbWUpO3RoaXMucHVzaCh7ZGF0YTpuLG1ldGE6e3BlcmNlbnQ6MTAwfX0pfSxzLnByb3RvdHlwZS5wcmVwYXJlTmV4dFNvdXJjZT1mdW5jdGlvbigpe3RoaXMucHJldmlvdXM9dGhpcy5fc291cmNlcy5zaGlmdCgpLHRoaXMub3BlbmVkU291cmNlKHRoaXMucHJldmlvdXMuc3RyZWFtSW5mbyksdGhpcy5pc1BhdXNlZD90aGlzLnByZXZpb3VzLnBhdXNlKCk6dGhpcy5wcmV2aW91cy5yZXN1bWUoKX0scy5wcm90b3R5cGUucmVnaXN0ZXJQcmV2aW91cz1mdW5jdGlvbihlKXt0aGlzLl9zb3VyY2VzLnB1c2goZSk7dmFyIHQ9dGhpcztyZXR1cm4gZS5vbihcImRhdGFcIixmdW5jdGlvbihlKXt0LnByb2Nlc3NDaHVuayhlKX0pLGUub24oXCJlbmRcIixmdW5jdGlvbigpe3QuY2xvc2VkU291cmNlKHQucHJldmlvdXMuc3RyZWFtSW5mbyksdC5fc291cmNlcy5sZW5ndGg/dC5wcmVwYXJlTmV4dFNvdXJjZSgpOnQuZW5kKCl9KSxlLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlKXt0LmVycm9yKGUpfSksdGhpc30scy5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7cmV0dXJuISFpLnByb3RvdHlwZS5yZXN1bWUuY2FsbCh0aGlzKSYmKCF0aGlzLnByZXZpb3VzJiZ0aGlzLl9zb3VyY2VzLmxlbmd0aD8odGhpcy5wcmVwYXJlTmV4dFNvdXJjZSgpLCEwKTp0aGlzLnByZXZpb3VzfHx0aGlzLl9zb3VyY2VzLmxlbmd0aHx8dGhpcy5nZW5lcmF0ZWRFcnJvcj92b2lkIDA6KHRoaXMuZW5kKCksITApKX0scy5wcm90b3R5cGUuZXJyb3I9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy5fc291cmNlcztpZighaS5wcm90b3R5cGUuZXJyb3IuY2FsbCh0aGlzLGUpKXJldHVybiExO2Zvcih2YXIgcj0wO3I8dC5sZW5ndGg7cisrKXRyeXt0W3JdLmVycm9yKGUpfWNhdGNoKGUpe31yZXR1cm4hMH0scy5wcm90b3R5cGUubG9jaz1mdW5jdGlvbigpe2kucHJvdG90eXBlLmxvY2suY2FsbCh0aGlzKTtmb3IodmFyIGU9dGhpcy5fc291cmNlcyx0PTA7dDxlLmxlbmd0aDt0KyspZVt0XS5sb2NrKCl9LHQuZXhwb3J0cz1zfSx7XCIuLi9jcmMzMlwiOjQsXCIuLi9zaWduYXR1cmVcIjoyMyxcIi4uL3N0cmVhbS9HZW5lcmljV29ya2VyXCI6MjgsXCIuLi91dGY4XCI6MzEsXCIuLi91dGlsc1wiOjMyfV0sOTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciB1PWUoXCIuLi9jb21wcmVzc2lvbnNcIiksbj1lKFwiLi9aaXBGaWxlV29ya2VyXCIpO3IuZ2VuZXJhdGVXb3JrZXI9ZnVuY3Rpb24oZSxhLHQpe3ZhciBvPW5ldyBuKGEuc3RyZWFtRmlsZXMsdCxhLnBsYXRmb3JtLGEuZW5jb2RlRmlsZU5hbWUpLGg9MDt0cnl7ZS5mb3JFYWNoKGZ1bmN0aW9uKGUsdCl7aCsrO3ZhciByPWZ1bmN0aW9uKGUsdCl7dmFyIHI9ZXx8dCxuPXVbcl07aWYoIW4pdGhyb3cgbmV3IEVycm9yKHIrXCIgaXMgbm90IGEgdmFsaWQgY29tcHJlc3Npb24gbWV0aG9kICFcIik7cmV0dXJuIG59KHQub3B0aW9ucy5jb21wcmVzc2lvbixhLmNvbXByZXNzaW9uKSxuPXQub3B0aW9ucy5jb21wcmVzc2lvbk9wdGlvbnN8fGEuY29tcHJlc3Npb25PcHRpb25zfHx7fSxpPXQuZGlyLHM9dC5kYXRlO3QuX2NvbXByZXNzV29ya2VyKHIsbikud2l0aFN0cmVhbUluZm8oXCJmaWxlXCIse25hbWU6ZSxkaXI6aSxkYXRlOnMsY29tbWVudDp0LmNvbW1lbnR8fFwiXCIsdW5peFBlcm1pc3Npb25zOnQudW5peFBlcm1pc3Npb25zLGRvc1Blcm1pc3Npb25zOnQuZG9zUGVybWlzc2lvbnN9KS5waXBlKG8pfSksby5lbnRyaWVzQ291bnQ9aH1jYXRjaChlKXtvLmVycm9yKGUpfXJldHVybiBvfX0se1wiLi4vY29tcHJlc3Npb25zXCI6MyxcIi4vWmlwRmlsZVdvcmtlclwiOjh9XSwxMDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oKXtpZighKHRoaXMgaW5zdGFuY2VvZiBuKSlyZXR1cm4gbmV3IG47aWYoYXJndW1lbnRzLmxlbmd0aCl0aHJvdyBuZXcgRXJyb3IoXCJUaGUgY29uc3RydWN0b3Igd2l0aCBwYXJhbWV0ZXJzIGhhcyBiZWVuIHJlbW92ZWQgaW4gSlNaaXAgMy4wLCBwbGVhc2UgY2hlY2sgdGhlIHVwZ3JhZGUgZ3VpZGUuXCIpO3RoaXMuZmlsZXM9T2JqZWN0LmNyZWF0ZShudWxsKSx0aGlzLmNvbW1lbnQ9bnVsbCx0aGlzLnJvb3Q9XCJcIix0aGlzLmNsb25lPWZ1bmN0aW9uKCl7dmFyIGU9bmV3IG47Zm9yKHZhciB0IGluIHRoaXMpXCJmdW5jdGlvblwiIT10eXBlb2YgdGhpc1t0XSYmKGVbdF09dGhpc1t0XSk7cmV0dXJuIGV9fShuLnByb3RvdHlwZT1lKFwiLi9vYmplY3RcIikpLmxvYWRBc3luYz1lKFwiLi9sb2FkXCIpLG4uc3VwcG9ydD1lKFwiLi9zdXBwb3J0XCIpLG4uZGVmYXVsdHM9ZShcIi4vZGVmYXVsdHNcIiksbi52ZXJzaW9uPVwiMy4xMC4xXCIsbi5sb2FkQXN5bmM9ZnVuY3Rpb24oZSx0KXtyZXR1cm4obmV3IG4pLmxvYWRBc3luYyhlLHQpfSxuLmV4dGVybmFsPWUoXCIuL2V4dGVybmFsXCIpLHQuZXhwb3J0cz1ufSx7XCIuL2RlZmF1bHRzXCI6NSxcIi4vZXh0ZXJuYWxcIjo2LFwiLi9sb2FkXCI6MTEsXCIuL29iamVjdFwiOjE1LFwiLi9zdXBwb3J0XCI6MzB9XSwxMTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciB1PWUoXCIuL3V0aWxzXCIpLGk9ZShcIi4vZXh0ZXJuYWxcIiksbj1lKFwiLi91dGY4XCIpLHM9ZShcIi4vemlwRW50cmllc1wiKSxhPWUoXCIuL3N0cmVhbS9DcmMzMlByb2JlXCIpLGw9ZShcIi4vbm9kZWpzVXRpbHNcIik7ZnVuY3Rpb24gZihuKXtyZXR1cm4gbmV3IGkuUHJvbWlzZShmdW5jdGlvbihlLHQpe3ZhciByPW4uZGVjb21wcmVzc2VkLmdldENvbnRlbnRXb3JrZXIoKS5waXBlKG5ldyBhKTtyLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlKXt0KGUpfSkub24oXCJlbmRcIixmdW5jdGlvbigpe3Iuc3RyZWFtSW5mby5jcmMzMiE9PW4uZGVjb21wcmVzc2VkLmNyYzMyP3QobmV3IEVycm9yKFwiQ29ycnVwdGVkIHppcCA6IENSQzMyIG1pc21hdGNoXCIpKTplKCl9KS5yZXN1bWUoKX0pfXQuZXhwb3J0cz1mdW5jdGlvbihlLG8pe3ZhciBoPXRoaXM7cmV0dXJuIG89dS5leHRlbmQob3x8e30se2Jhc2U2NDohMSxjaGVja0NSQzMyOiExLG9wdGltaXplZEJpbmFyeVN0cmluZzohMSxjcmVhdGVGb2xkZXJzOiExLGRlY29kZUZpbGVOYW1lOm4udXRmOGRlY29kZX0pLGwuaXNOb2RlJiZsLmlzU3RyZWFtKGUpP2kuUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiSlNaaXAgY2FuJ3QgYWNjZXB0IGEgc3RyZWFtIHdoZW4gbG9hZGluZyBhIHppcCBmaWxlLlwiKSk6dS5wcmVwYXJlQ29udGVudChcInRoZSBsb2FkZWQgemlwIGZpbGVcIixlLCEwLG8ub3B0aW1pemVkQmluYXJ5U3RyaW5nLG8uYmFzZTY0KS50aGVuKGZ1bmN0aW9uKGUpe3ZhciB0PW5ldyBzKG8pO3JldHVybiB0LmxvYWQoZSksdH0pLnRoZW4oZnVuY3Rpb24oZSl7dmFyIHQ9W2kuUHJvbWlzZS5yZXNvbHZlKGUpXSxyPWUuZmlsZXM7aWYoby5jaGVja0NSQzMyKWZvcih2YXIgbj0wO248ci5sZW5ndGg7bisrKXQucHVzaChmKHJbbl0pKTtyZXR1cm4gaS5Qcm9taXNlLmFsbCh0KX0pLnRoZW4oZnVuY3Rpb24oZSl7Zm9yKHZhciB0PWUuc2hpZnQoKSxyPXQuZmlsZXMsbj0wO248ci5sZW5ndGg7bisrKXt2YXIgaT1yW25dLHM9aS5maWxlTmFtZVN0cixhPXUucmVzb2x2ZShpLmZpbGVOYW1lU3RyKTtoLmZpbGUoYSxpLmRlY29tcHJlc3NlZCx7YmluYXJ5OiEwLG9wdGltaXplZEJpbmFyeVN0cmluZzohMCxkYXRlOmkuZGF0ZSxkaXI6aS5kaXIsY29tbWVudDppLmZpbGVDb21tZW50U3RyLmxlbmd0aD9pLmZpbGVDb21tZW50U3RyOm51bGwsdW5peFBlcm1pc3Npb25zOmkudW5peFBlcm1pc3Npb25zLGRvc1Blcm1pc3Npb25zOmkuZG9zUGVybWlzc2lvbnMsY3JlYXRlRm9sZGVyczpvLmNyZWF0ZUZvbGRlcnN9KSxpLmRpcnx8KGguZmlsZShhKS51bnNhZmVPcmlnaW5hbE5hbWU9cyl9cmV0dXJuIHQuemlwQ29tbWVudC5sZW5ndGgmJihoLmNvbW1lbnQ9dC56aXBDb21tZW50KSxofSl9fSx7XCIuL2V4dGVybmFsXCI6NixcIi4vbm9kZWpzVXRpbHNcIjoxNCxcIi4vc3RyZWFtL0NyYzMyUHJvYmVcIjoyNSxcIi4vdXRmOFwiOjMxLFwiLi91dGlsc1wiOjMyLFwiLi96aXBFbnRyaWVzXCI6MzN9XSwxMjpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuLi91dGlsc1wiKSxpPWUoXCIuLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiKTtmdW5jdGlvbiBzKGUsdCl7aS5jYWxsKHRoaXMsXCJOb2RlanMgc3RyZWFtIGlucHV0IGFkYXB0ZXIgZm9yIFwiK2UpLHRoaXMuX3Vwc3RyZWFtRW5kZWQ9ITEsdGhpcy5fYmluZFN0cmVhbSh0KX1uLmluaGVyaXRzKHMsaSkscy5wcm90b3R5cGUuX2JpbmRTdHJlYW09ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpczsodGhpcy5fc3RyZWFtPWUpLnBhdXNlKCksZS5vbihcImRhdGFcIixmdW5jdGlvbihlKXt0LnB1c2goe2RhdGE6ZSxtZXRhOntwZXJjZW50OjB9fSl9KS5vbihcImVycm9yXCIsZnVuY3Rpb24oZSl7dC5pc1BhdXNlZD90aGlzLmdlbmVyYXRlZEVycm9yPWU6dC5lcnJvcihlKX0pLm9uKFwiZW5kXCIsZnVuY3Rpb24oKXt0LmlzUGF1c2VkP3QuX3Vwc3RyZWFtRW5kZWQ9ITA6dC5lbmQoKX0pfSxzLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbigpe3JldHVybiEhaS5wcm90b3R5cGUucGF1c2UuY2FsbCh0aGlzKSYmKHRoaXMuX3N0cmVhbS5wYXVzZSgpLCEwKX0scy5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7cmV0dXJuISFpLnByb3RvdHlwZS5yZXN1bWUuY2FsbCh0aGlzKSYmKHRoaXMuX3Vwc3RyZWFtRW5kZWQ/dGhpcy5lbmQoKTp0aGlzLl9zdHJlYW0ucmVzdW1lKCksITApfSx0LmV4cG9ydHM9c30se1wiLi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIjoyOCxcIi4uL3V0aWxzXCI6MzJ9XSwxMzpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBpPWUoXCJyZWFkYWJsZS1zdHJlYW1cIikuUmVhZGFibGU7ZnVuY3Rpb24gbihlLHQscil7aS5jYWxsKHRoaXMsdCksdGhpcy5faGVscGVyPWU7dmFyIG49dGhpcztlLm9uKFwiZGF0YVwiLGZ1bmN0aW9uKGUsdCl7bi5wdXNoKGUpfHxuLl9oZWxwZXIucGF1c2UoKSxyJiZyKHQpfSkub24oXCJlcnJvclwiLGZ1bmN0aW9uKGUpe24uZW1pdChcImVycm9yXCIsZSl9KS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7bi5wdXNoKG51bGwpfSl9ZShcIi4uL3V0aWxzXCIpLmluaGVyaXRzKG4saSksbi5wcm90b3R5cGUuX3JlYWQ9ZnVuY3Rpb24oKXt0aGlzLl9oZWxwZXIucmVzdW1lKCl9LHQuZXhwb3J0cz1ufSx7XCIuLi91dGlsc1wiOjMyLFwicmVhZGFibGUtc3RyZWFtXCI6MTZ9XSwxNDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3QuZXhwb3J0cz17aXNOb2RlOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBCdWZmZXIsbmV3QnVmZmVyRnJvbTpmdW5jdGlvbihlLHQpe2lmKEJ1ZmZlci5mcm9tJiZCdWZmZXIuZnJvbSE9PVVpbnQ4QXJyYXkuZnJvbSlyZXR1cm4gQnVmZmVyLmZyb20oZSx0KTtpZihcIm51bWJlclwiPT10eXBlb2YgZSl0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcImRhdGFcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBhIG51bWJlcicpO3JldHVybiBuZXcgQnVmZmVyKGUsdCl9LGFsbG9jQnVmZmVyOmZ1bmN0aW9uKGUpe2lmKEJ1ZmZlci5hbGxvYylyZXR1cm4gQnVmZmVyLmFsbG9jKGUpO3ZhciB0PW5ldyBCdWZmZXIoZSk7cmV0dXJuIHQuZmlsbCgwKSx0fSxpc0J1ZmZlcjpmdW5jdGlvbihlKXtyZXR1cm4gQnVmZmVyLmlzQnVmZmVyKGUpfSxpc1N0cmVhbTpmdW5jdGlvbihlKXtyZXR1cm4gZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgZS5vbiYmXCJmdW5jdGlvblwiPT10eXBlb2YgZS5wYXVzZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgZS5yZXN1bWV9fX0se31dLDE1OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcyhlLHQscil7dmFyIG4saT11LmdldFR5cGVPZih0KSxzPXUuZXh0ZW5kKHJ8fHt9LGYpO3MuZGF0ZT1zLmRhdGV8fG5ldyBEYXRlLG51bGwhPT1zLmNvbXByZXNzaW9uJiYocy5jb21wcmVzc2lvbj1zLmNvbXByZXNzaW9uLnRvVXBwZXJDYXNlKCkpLFwic3RyaW5nXCI9PXR5cGVvZiBzLnVuaXhQZXJtaXNzaW9ucyYmKHMudW5peFBlcm1pc3Npb25zPXBhcnNlSW50KHMudW5peFBlcm1pc3Npb25zLDgpKSxzLnVuaXhQZXJtaXNzaW9ucyYmMTYzODQmcy51bml4UGVybWlzc2lvbnMmJihzLmRpcj0hMCkscy5kb3NQZXJtaXNzaW9ucyYmMTYmcy5kb3NQZXJtaXNzaW9ucyYmKHMuZGlyPSEwKSxzLmRpciYmKGU9ZyhlKSkscy5jcmVhdGVGb2xkZXJzJiYobj1fKGUpKSYmYi5jYWxsKHRoaXMsbiwhMCk7dmFyIGE9XCJzdHJpbmdcIj09PWkmJiExPT09cy5iaW5hcnkmJiExPT09cy5iYXNlNjQ7ciYmdm9pZCAwIT09ci5iaW5hcnl8fChzLmJpbmFyeT0hYSksKHQgaW5zdGFuY2VvZiBjJiYwPT09dC51bmNvbXByZXNzZWRTaXplfHxzLmRpcnx8IXR8fDA9PT10Lmxlbmd0aCkmJihzLmJhc2U2ND0hMSxzLmJpbmFyeT0hMCx0PVwiXCIscy5jb21wcmVzc2lvbj1cIlNUT1JFXCIsaT1cInN0cmluZ1wiKTt2YXIgbz1udWxsO289dCBpbnN0YW5jZW9mIGN8fHQgaW5zdGFuY2VvZiBsP3Q6cC5pc05vZGUmJnAuaXNTdHJlYW0odCk/bmV3IG0oZSx0KTp1LnByZXBhcmVDb250ZW50KGUsdCxzLmJpbmFyeSxzLm9wdGltaXplZEJpbmFyeVN0cmluZyxzLmJhc2U2NCk7dmFyIGg9bmV3IGQoZSxvLHMpO3RoaXMuZmlsZXNbZV09aH12YXIgaT1lKFwiLi91dGY4XCIpLHU9ZShcIi4vdXRpbHNcIiksbD1lKFwiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiKSxhPWUoXCIuL3N0cmVhbS9TdHJlYW1IZWxwZXJcIiksZj1lKFwiLi9kZWZhdWx0c1wiKSxjPWUoXCIuL2NvbXByZXNzZWRPYmplY3RcIiksZD1lKFwiLi96aXBPYmplY3RcIiksbz1lKFwiLi9nZW5lcmF0ZVwiKSxwPWUoXCIuL25vZGVqc1V0aWxzXCIpLG09ZShcIi4vbm9kZWpzL05vZGVqc1N0cmVhbUlucHV0QWRhcHRlclwiKSxfPWZ1bmN0aW9uKGUpe1wiL1wiPT09ZS5zbGljZSgtMSkmJihlPWUuc3Vic3RyaW5nKDAsZS5sZW5ndGgtMSkpO3ZhciB0PWUubGFzdEluZGV4T2YoXCIvXCIpO3JldHVybiAwPHQ/ZS5zdWJzdHJpbmcoMCx0KTpcIlwifSxnPWZ1bmN0aW9uKGUpe3JldHVyblwiL1wiIT09ZS5zbGljZSgtMSkmJihlKz1cIi9cIiksZX0sYj1mdW5jdGlvbihlLHQpe3JldHVybiB0PXZvaWQgMCE9PXQ/dDpmLmNyZWF0ZUZvbGRlcnMsZT1nKGUpLHRoaXMuZmlsZXNbZV18fHMuY2FsbCh0aGlzLGUsbnVsbCx7ZGlyOiEwLGNyZWF0ZUZvbGRlcnM6dH0pLHRoaXMuZmlsZXNbZV19O2Z1bmN0aW9uIGgoZSl7cmV0dXJuXCJbb2JqZWN0IFJlZ0V4cF1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKX12YXIgbj17bG9hZDpmdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihcIlRoaXMgbWV0aG9kIGhhcyBiZWVuIHJlbW92ZWQgaW4gSlNaaXAgMy4wLCBwbGVhc2UgY2hlY2sgdGhlIHVwZ3JhZGUgZ3VpZGUuXCIpfSxmb3JFYWNoOmZ1bmN0aW9uKGUpe3ZhciB0LHIsbjtmb3IodCBpbiB0aGlzLmZpbGVzKW49dGhpcy5maWxlc1t0XSwocj10LnNsaWNlKHRoaXMucm9vdC5sZW5ndGgsdC5sZW5ndGgpKSYmdC5zbGljZSgwLHRoaXMucm9vdC5sZW5ndGgpPT09dGhpcy5yb290JiZlKHIsbil9LGZpbHRlcjpmdW5jdGlvbihyKXt2YXIgbj1bXTtyZXR1cm4gdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGUsdCl7cihlLHQpJiZuLnB1c2godCl9KSxufSxmaWxlOmZ1bmN0aW9uKGUsdCxyKXtpZigxIT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gZT10aGlzLnJvb3QrZSxzLmNhbGwodGhpcyxlLHQsciksdGhpcztpZihoKGUpKXt2YXIgbj1lO3JldHVybiB0aGlzLmZpbHRlcihmdW5jdGlvbihlLHQpe3JldHVybiF0LmRpciYmbi50ZXN0KGUpfSl9dmFyIGk9dGhpcy5maWxlc1t0aGlzLnJvb3QrZV07cmV0dXJuIGkmJiFpLmRpcj9pOm51bGx9LGZvbGRlcjpmdW5jdGlvbihyKXtpZighcilyZXR1cm4gdGhpcztpZihoKHIpKXJldHVybiB0aGlzLmZpbHRlcihmdW5jdGlvbihlLHQpe3JldHVybiB0LmRpciYmci50ZXN0KGUpfSk7dmFyIGU9dGhpcy5yb290K3IsdD1iLmNhbGwodGhpcyxlKSxuPXRoaXMuY2xvbmUoKTtyZXR1cm4gbi5yb290PXQubmFtZSxufSxyZW1vdmU6ZnVuY3Rpb24ocil7cj10aGlzLnJvb3Qrcjt2YXIgZT10aGlzLmZpbGVzW3JdO2lmKGV8fChcIi9cIiE9PXIuc2xpY2UoLTEpJiYocis9XCIvXCIpLGU9dGhpcy5maWxlc1tyXSksZSYmIWUuZGlyKWRlbGV0ZSB0aGlzLmZpbGVzW3JdO2Vsc2UgZm9yKHZhciB0PXRoaXMuZmlsdGVyKGZ1bmN0aW9uKGUsdCl7cmV0dXJuIHQubmFtZS5zbGljZSgwLHIubGVuZ3RoKT09PXJ9KSxuPTA7bjx0Lmxlbmd0aDtuKyspZGVsZXRlIHRoaXMuZmlsZXNbdFtuXS5uYW1lXTtyZXR1cm4gdGhpc30sZ2VuZXJhdGU6ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBoYXMgYmVlbiByZW1vdmVkIGluIEpTWmlwIDMuMCwgcGxlYXNlIGNoZWNrIHRoZSB1cGdyYWRlIGd1aWRlLlwiKX0sZ2VuZXJhdGVJbnRlcm5hbFN0cmVhbTpmdW5jdGlvbihlKXt2YXIgdCxyPXt9O3RyeXtpZigocj11LmV4dGVuZChlfHx7fSx7c3RyZWFtRmlsZXM6ITEsY29tcHJlc3Npb246XCJTVE9SRVwiLGNvbXByZXNzaW9uT3B0aW9uczpudWxsLHR5cGU6XCJcIixwbGF0Zm9ybTpcIkRPU1wiLGNvbW1lbnQ6bnVsbCxtaW1lVHlwZTpcImFwcGxpY2F0aW9uL3ppcFwiLGVuY29kZUZpbGVOYW1lOmkudXRmOGVuY29kZX0pKS50eXBlPXIudHlwZS50b0xvd2VyQ2FzZSgpLHIuY29tcHJlc3Npb249ci5jb21wcmVzc2lvbi50b1VwcGVyQ2FzZSgpLFwiYmluYXJ5c3RyaW5nXCI9PT1yLnR5cGUmJihyLnR5cGU9XCJzdHJpbmdcIiksIXIudHlwZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBvdXRwdXQgdHlwZSBzcGVjaWZpZWQuXCIpO3UuY2hlY2tTdXBwb3J0KHIudHlwZSksXCJkYXJ3aW5cIiE9PXIucGxhdGZvcm0mJlwiZnJlZWJzZFwiIT09ci5wbGF0Zm9ybSYmXCJsaW51eFwiIT09ci5wbGF0Zm9ybSYmXCJzdW5vc1wiIT09ci5wbGF0Zm9ybXx8KHIucGxhdGZvcm09XCJVTklYXCIpLFwid2luMzJcIj09PXIucGxhdGZvcm0mJihyLnBsYXRmb3JtPVwiRE9TXCIpO3ZhciBuPXIuY29tbWVudHx8dGhpcy5jb21tZW50fHxcIlwiO3Q9by5nZW5lcmF0ZVdvcmtlcih0aGlzLHIsbil9Y2F0Y2goZSl7KHQ9bmV3IGwoXCJlcnJvclwiKSkuZXJyb3IoZSl9cmV0dXJuIG5ldyBhKHQsci50eXBlfHxcInN0cmluZ1wiLHIubWltZVR5cGUpfSxnZW5lcmF0ZUFzeW5jOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuZ2VuZXJhdGVJbnRlcm5hbFN0cmVhbShlKS5hY2N1bXVsYXRlKHQpfSxnZW5lcmF0ZU5vZGVTdHJlYW06ZnVuY3Rpb24oZSx0KXtyZXR1cm4oZT1lfHx7fSkudHlwZXx8KGUudHlwZT1cIm5vZGVidWZmZXJcIiksdGhpcy5nZW5lcmF0ZUludGVybmFsU3RyZWFtKGUpLnRvTm9kZWpzU3RyZWFtKHQpfX07dC5leHBvcnRzPW59LHtcIi4vY29tcHJlc3NlZE9iamVjdFwiOjIsXCIuL2RlZmF1bHRzXCI6NSxcIi4vZ2VuZXJhdGVcIjo5LFwiLi9ub2RlanMvTm9kZWpzU3RyZWFtSW5wdXRBZGFwdGVyXCI6MTIsXCIuL25vZGVqc1V0aWxzXCI6MTQsXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCI6MjgsXCIuL3N0cmVhbS9TdHJlYW1IZWxwZXJcIjoyOSxcIi4vdXRmOFwiOjMxLFwiLi91dGlsc1wiOjMyLFwiLi96aXBPYmplY3RcIjozNX1dLDE2OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dC5leHBvcnRzPWUoXCJzdHJlYW1cIil9LHtzdHJlYW06dm9pZCAwfV0sMTc6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi9EYXRhUmVhZGVyXCIpO2Z1bmN0aW9uIGkoZSl7bi5jYWxsKHRoaXMsZSk7Zm9yKHZhciB0PTA7dDx0aGlzLmRhdGEubGVuZ3RoO3QrKyllW3RdPTI1NSZlW3RdfWUoXCIuLi91dGlsc1wiKS5pbmhlcml0cyhpLG4pLGkucHJvdG90eXBlLmJ5dGVBdD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5kYXRhW3RoaXMuemVybytlXX0saS5wcm90b3R5cGUubGFzdEluZGV4T2ZTaWduYXR1cmU9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PWUuY2hhckNvZGVBdCgwKSxyPWUuY2hhckNvZGVBdCgxKSxuPWUuY2hhckNvZGVBdCgyKSxpPWUuY2hhckNvZGVBdCgzKSxzPXRoaXMubGVuZ3RoLTQ7MDw9czstLXMpaWYodGhpcy5kYXRhW3NdPT09dCYmdGhpcy5kYXRhW3MrMV09PT1yJiZ0aGlzLmRhdGFbcysyXT09PW4mJnRoaXMuZGF0YVtzKzNdPT09aSlyZXR1cm4gcy10aGlzLnplcm87cmV0dXJuLTF9LGkucHJvdG90eXBlLnJlYWRBbmRDaGVja1NpZ25hdHVyZT1mdW5jdGlvbihlKXt2YXIgdD1lLmNoYXJDb2RlQXQoMCkscj1lLmNoYXJDb2RlQXQoMSksbj1lLmNoYXJDb2RlQXQoMiksaT1lLmNoYXJDb2RlQXQoMykscz10aGlzLnJlYWREYXRhKDQpO3JldHVybiB0PT09c1swXSYmcj09PXNbMV0mJm49PT1zWzJdJiZpPT09c1szXX0saS5wcm90b3R5cGUucmVhZERhdGE9ZnVuY3Rpb24oZSl7aWYodGhpcy5jaGVja09mZnNldChlKSwwPT09ZSlyZXR1cm5bXTt2YXIgdD10aGlzLmRhdGEuc2xpY2UodGhpcy56ZXJvK3RoaXMuaW5kZXgsdGhpcy56ZXJvK3RoaXMuaW5kZXgrZSk7cmV0dXJuIHRoaXMuaW5kZXgrPWUsdH0sdC5leHBvcnRzPWl9LHtcIi4uL3V0aWxzXCI6MzIsXCIuL0RhdGFSZWFkZXJcIjoxOH1dLDE4OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4uL3V0aWxzXCIpO2Z1bmN0aW9uIGkoZSl7dGhpcy5kYXRhPWUsdGhpcy5sZW5ndGg9ZS5sZW5ndGgsdGhpcy5pbmRleD0wLHRoaXMuemVybz0wfWkucHJvdG90eXBlPXtjaGVja09mZnNldDpmdW5jdGlvbihlKXt0aGlzLmNoZWNrSW5kZXgodGhpcy5pbmRleCtlKX0sY2hlY2tJbmRleDpmdW5jdGlvbihlKXtpZih0aGlzLmxlbmd0aDx0aGlzLnplcm8rZXx8ZTwwKXRocm93IG5ldyBFcnJvcihcIkVuZCBvZiBkYXRhIHJlYWNoZWQgKGRhdGEgbGVuZ3RoID0gXCIrdGhpcy5sZW5ndGgrXCIsIGFza2VkIGluZGV4ID0gXCIrZStcIikuIENvcnJ1cHRlZCB6aXAgP1wiKX0sc2V0SW5kZXg6ZnVuY3Rpb24oZSl7dGhpcy5jaGVja0luZGV4KGUpLHRoaXMuaW5kZXg9ZX0sc2tpcDpmdW5jdGlvbihlKXt0aGlzLnNldEluZGV4KHRoaXMuaW5kZXgrZSl9LGJ5dGVBdDpmdW5jdGlvbigpe30scmVhZEludDpmdW5jdGlvbihlKXt2YXIgdCxyPTA7Zm9yKHRoaXMuY2hlY2tPZmZzZXQoZSksdD10aGlzLmluZGV4K2UtMTt0Pj10aGlzLmluZGV4O3QtLSlyPShyPDw4KSt0aGlzLmJ5dGVBdCh0KTtyZXR1cm4gdGhpcy5pbmRleCs9ZSxyfSxyZWFkU3RyaW5nOmZ1bmN0aW9uKGUpe3JldHVybiBuLnRyYW5zZm9ybVRvKFwic3RyaW5nXCIsdGhpcy5yZWFkRGF0YShlKSl9LHJlYWREYXRhOmZ1bmN0aW9uKCl7fSxsYXN0SW5kZXhPZlNpZ25hdHVyZTpmdW5jdGlvbigpe30scmVhZEFuZENoZWNrU2lnbmF0dXJlOmZ1bmN0aW9uKCl7fSxyZWFkRGF0ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMucmVhZEludCg0KTtyZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoMTk4MCsoZT4+MjUmMTI3KSwoZT4+MjEmMTUpLTEsZT4+MTYmMzEsZT4+MTEmMzEsZT4+NSY2MywoMzEmZSk8PDEpKX19LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyfV0sMTk6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi9VaW50OEFycmF5UmVhZGVyXCIpO2Z1bmN0aW9uIGkoZSl7bi5jYWxsKHRoaXMsZSl9ZShcIi4uL3V0aWxzXCIpLmluaGVyaXRzKGksbiksaS5wcm90b3R5cGUucmVhZERhdGE9ZnVuY3Rpb24oZSl7dGhpcy5jaGVja09mZnNldChlKTt2YXIgdD10aGlzLmRhdGEuc2xpY2UodGhpcy56ZXJvK3RoaXMuaW5kZXgsdGhpcy56ZXJvK3RoaXMuaW5kZXgrZSk7cmV0dXJuIHRoaXMuaW5kZXgrPWUsdH0sdC5leHBvcnRzPWl9LHtcIi4uL3V0aWxzXCI6MzIsXCIuL1VpbnQ4QXJyYXlSZWFkZXJcIjoyMX1dLDIwOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vRGF0YVJlYWRlclwiKTtmdW5jdGlvbiBpKGUpe24uY2FsbCh0aGlzLGUpfWUoXCIuLi91dGlsc1wiKS5pbmhlcml0cyhpLG4pLGkucHJvdG90eXBlLmJ5dGVBdD1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5kYXRhLmNoYXJDb2RlQXQodGhpcy56ZXJvK2UpfSxpLnByb3RvdHlwZS5sYXN0SW5kZXhPZlNpZ25hdHVyZT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5kYXRhLmxhc3RJbmRleE9mKGUpLXRoaXMuemVyb30saS5wcm90b3R5cGUucmVhZEFuZENoZWNrU2lnbmF0dXJlPWZ1bmN0aW9uKGUpe3JldHVybiBlPT09dGhpcy5yZWFkRGF0YSg0KX0saS5wcm90b3R5cGUucmVhZERhdGE9ZnVuY3Rpb24oZSl7dGhpcy5jaGVja09mZnNldChlKTt2YXIgdD10aGlzLmRhdGEuc2xpY2UodGhpcy56ZXJvK3RoaXMuaW5kZXgsdGhpcy56ZXJvK3RoaXMuaW5kZXgrZSk7cmV0dXJuIHRoaXMuaW5kZXgrPWUsdH0sdC5leHBvcnRzPWl9LHtcIi4uL3V0aWxzXCI6MzIsXCIuL0RhdGFSZWFkZXJcIjoxOH1dLDIxOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vQXJyYXlSZWFkZXJcIik7ZnVuY3Rpb24gaShlKXtuLmNhbGwodGhpcyxlKX1lKFwiLi4vdXRpbHNcIikuaW5oZXJpdHMoaSxuKSxpLnByb3RvdHlwZS5yZWFkRGF0YT1mdW5jdGlvbihlKXtpZih0aGlzLmNoZWNrT2Zmc2V0KGUpLDA9PT1lKXJldHVybiBuZXcgVWludDhBcnJheSgwKTt2YXIgdD10aGlzLmRhdGEuc3ViYXJyYXkodGhpcy56ZXJvK3RoaXMuaW5kZXgsdGhpcy56ZXJvK3RoaXMuaW5kZXgrZSk7cmV0dXJuIHRoaXMuaW5kZXgrPWUsdH0sdC5leHBvcnRzPWl9LHtcIi4uL3V0aWxzXCI6MzIsXCIuL0FycmF5UmVhZGVyXCI6MTd9XSwyMjpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuLi91dGlsc1wiKSxpPWUoXCIuLi9zdXBwb3J0XCIpLHM9ZShcIi4vQXJyYXlSZWFkZXJcIiksYT1lKFwiLi9TdHJpbmdSZWFkZXJcIiksbz1lKFwiLi9Ob2RlQnVmZmVyUmVhZGVyXCIpLGg9ZShcIi4vVWludDhBcnJheVJlYWRlclwiKTt0LmV4cG9ydHM9ZnVuY3Rpb24oZSl7dmFyIHQ9bi5nZXRUeXBlT2YoZSk7cmV0dXJuIG4uY2hlY2tTdXBwb3J0KHQpLFwic3RyaW5nXCIhPT10fHxpLnVpbnQ4YXJyYXk/XCJub2RlYnVmZmVyXCI9PT10P25ldyBvKGUpOmkudWludDhhcnJheT9uZXcgaChuLnRyYW5zZm9ybVRvKFwidWludDhhcnJheVwiLGUpKTpuZXcgcyhuLnRyYW5zZm9ybVRvKFwiYXJyYXlcIixlKSk6bmV3IGEoZSl9fSx7XCIuLi9zdXBwb3J0XCI6MzAsXCIuLi91dGlsc1wiOjMyLFwiLi9BcnJheVJlYWRlclwiOjE3LFwiLi9Ob2RlQnVmZmVyUmVhZGVyXCI6MTksXCIuL1N0cmluZ1JlYWRlclwiOjIwLFwiLi9VaW50OEFycmF5UmVhZGVyXCI6MjF9XSwyMzpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3IuTE9DQUxfRklMRV9IRUFERVI9XCJQS1x1MDAwM1x1MDAwNFwiLHIuQ0VOVFJBTF9GSUxFX0hFQURFUj1cIlBLXHUwMDAxXHUwMDAyXCIsci5DRU5UUkFMX0RJUkVDVE9SWV9FTkQ9XCJQS1x1MDAwNVx1MDAwNlwiLHIuWklQNjRfQ0VOVFJBTF9ESVJFQ1RPUllfTE9DQVRPUj1cIlBLXHUwMDA2XHUwMDA3XCIsci5aSVA2NF9DRU5UUkFMX0RJUkVDVE9SWV9FTkQ9XCJQS1x1MDAwNlx1MDAwNlwiLHIuREFUQV9ERVNDUklQVE9SPVwiUEtcdTAwMDdcXGJcIn0se31dLDI0OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vR2VuZXJpY1dvcmtlclwiKSxpPWUoXCIuLi91dGlsc1wiKTtmdW5jdGlvbiBzKGUpe24uY2FsbCh0aGlzLFwiQ29udmVydFdvcmtlciB0byBcIitlKSx0aGlzLmRlc3RUeXBlPWV9aS5pbmhlcml0cyhzLG4pLHMucHJvdG90eXBlLnByb2Nlc3NDaHVuaz1mdW5jdGlvbihlKXt0aGlzLnB1c2goe2RhdGE6aS50cmFuc2Zvcm1Ubyh0aGlzLmRlc3RUeXBlLGUuZGF0YSksbWV0YTplLm1ldGF9KX0sdC5leHBvcnRzPXN9LHtcIi4uL3V0aWxzXCI6MzIsXCIuL0dlbmVyaWNXb3JrZXJcIjoyOH1dLDI1OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vR2VuZXJpY1dvcmtlclwiKSxpPWUoXCIuLi9jcmMzMlwiKTtmdW5jdGlvbiBzKCl7bi5jYWxsKHRoaXMsXCJDcmMzMlByb2JlXCIpLHRoaXMud2l0aFN0cmVhbUluZm8oXCJjcmMzMlwiLDApfWUoXCIuLi91dGlsc1wiKS5pbmhlcml0cyhzLG4pLHMucHJvdG90eXBlLnByb2Nlc3NDaHVuaz1mdW5jdGlvbihlKXt0aGlzLnN0cmVhbUluZm8uY3JjMzI9aShlLmRhdGEsdGhpcy5zdHJlYW1JbmZvLmNyYzMyfHwwKSx0aGlzLnB1c2goZSl9LHQuZXhwb3J0cz1zfSx7XCIuLi9jcmMzMlwiOjQsXCIuLi91dGlsc1wiOjMyLFwiLi9HZW5lcmljV29ya2VyXCI6Mjh9XSwyNjpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuLi91dGlsc1wiKSxpPWUoXCIuL0dlbmVyaWNXb3JrZXJcIik7ZnVuY3Rpb24gcyhlKXtpLmNhbGwodGhpcyxcIkRhdGFMZW5ndGhQcm9iZSBmb3IgXCIrZSksdGhpcy5wcm9wTmFtZT1lLHRoaXMud2l0aFN0cmVhbUluZm8oZSwwKX1uLmluaGVyaXRzKHMsaSkscy5wcm90b3R5cGUucHJvY2Vzc0NodW5rPWZ1bmN0aW9uKGUpe2lmKGUpe3ZhciB0PXRoaXMuc3RyZWFtSW5mb1t0aGlzLnByb3BOYW1lXXx8MDt0aGlzLnN0cmVhbUluZm9bdGhpcy5wcm9wTmFtZV09dCtlLmRhdGEubGVuZ3RofWkucHJvdG90eXBlLnByb2Nlc3NDaHVuay5jYWxsKHRoaXMsZSl9LHQuZXhwb3J0cz1zfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9HZW5lcmljV29ya2VyXCI6Mjh9XSwyNzpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuLi91dGlsc1wiKSxpPWUoXCIuL0dlbmVyaWNXb3JrZXJcIik7ZnVuY3Rpb24gcyhlKXtpLmNhbGwodGhpcyxcIkRhdGFXb3JrZXJcIik7dmFyIHQ9dGhpczt0aGlzLmRhdGFJc1JlYWR5PSExLHRoaXMuaW5kZXg9MCx0aGlzLm1heD0wLHRoaXMuZGF0YT1udWxsLHRoaXMudHlwZT1cIlwiLHRoaXMuX3RpY2tTY2hlZHVsZWQ9ITEsZS50aGVuKGZ1bmN0aW9uKGUpe3QuZGF0YUlzUmVhZHk9ITAsdC5kYXRhPWUsdC5tYXg9ZSYmZS5sZW5ndGh8fDAsdC50eXBlPW4uZ2V0VHlwZU9mKGUpLHQuaXNQYXVzZWR8fHQuX3RpY2tBbmRSZXBlYXQoKX0sZnVuY3Rpb24oZSl7dC5lcnJvcihlKX0pfW4uaW5oZXJpdHMocyxpKSxzLnByb3RvdHlwZS5jbGVhblVwPWZ1bmN0aW9uKCl7aS5wcm90b3R5cGUuY2xlYW5VcC5jYWxsKHRoaXMpLHRoaXMuZGF0YT1udWxsfSxzLnByb3RvdHlwZS5yZXN1bWU9ZnVuY3Rpb24oKXtyZXR1cm4hIWkucHJvdG90eXBlLnJlc3VtZS5jYWxsKHRoaXMpJiYoIXRoaXMuX3RpY2tTY2hlZHVsZWQmJnRoaXMuZGF0YUlzUmVhZHkmJih0aGlzLl90aWNrU2NoZWR1bGVkPSEwLG4uZGVsYXkodGhpcy5fdGlja0FuZFJlcGVhdCxbXSx0aGlzKSksITApfSxzLnByb3RvdHlwZS5fdGlja0FuZFJlcGVhdD1mdW5jdGlvbigpe3RoaXMuX3RpY2tTY2hlZHVsZWQ9ITEsdGhpcy5pc1BhdXNlZHx8dGhpcy5pc0ZpbmlzaGVkfHwodGhpcy5fdGljaygpLHRoaXMuaXNGaW5pc2hlZHx8KG4uZGVsYXkodGhpcy5fdGlja0FuZFJlcGVhdCxbXSx0aGlzKSx0aGlzLl90aWNrU2NoZWR1bGVkPSEwKSl9LHMucHJvdG90eXBlLl90aWNrPWZ1bmN0aW9uKCl7aWYodGhpcy5pc1BhdXNlZHx8dGhpcy5pc0ZpbmlzaGVkKXJldHVybiExO3ZhciBlPW51bGwsdD1NYXRoLm1pbih0aGlzLm1heCx0aGlzLmluZGV4KzE2Mzg0KTtpZih0aGlzLmluZGV4Pj10aGlzLm1heClyZXR1cm4gdGhpcy5lbmQoKTtzd2l0Y2godGhpcy50eXBlKXtjYXNlXCJzdHJpbmdcIjplPXRoaXMuZGF0YS5zdWJzdHJpbmcodGhpcy5pbmRleCx0KTticmVhaztjYXNlXCJ1aW50OGFycmF5XCI6ZT10aGlzLmRhdGEuc3ViYXJyYXkodGhpcy5pbmRleCx0KTticmVhaztjYXNlXCJhcnJheVwiOmNhc2VcIm5vZGVidWZmZXJcIjplPXRoaXMuZGF0YS5zbGljZSh0aGlzLmluZGV4LHQpfXJldHVybiB0aGlzLmluZGV4PXQsdGhpcy5wdXNoKHtkYXRhOmUsbWV0YTp7cGVyY2VudDp0aGlzLm1heD90aGlzLmluZGV4L3RoaXMubWF4KjEwMDowfX0pfSx0LmV4cG9ydHM9c30se1wiLi4vdXRpbHNcIjozMixcIi4vR2VuZXJpY1dvcmtlclwiOjI4fV0sMjg6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKGUpe3RoaXMubmFtZT1lfHxcImRlZmF1bHRcIix0aGlzLnN0cmVhbUluZm89e30sdGhpcy5nZW5lcmF0ZWRFcnJvcj1udWxsLHRoaXMuZXh0cmFTdHJlYW1JbmZvPXt9LHRoaXMuaXNQYXVzZWQ9ITAsdGhpcy5pc0ZpbmlzaGVkPSExLHRoaXMuaXNMb2NrZWQ9ITEsdGhpcy5fbGlzdGVuZXJzPXtkYXRhOltdLGVuZDpbXSxlcnJvcjpbXX0sdGhpcy5wcmV2aW91cz1udWxsfW4ucHJvdG90eXBlPXtwdXNoOmZ1bmN0aW9uKGUpe3RoaXMuZW1pdChcImRhdGFcIixlKX0sZW5kOmZ1bmN0aW9uKCl7aWYodGhpcy5pc0ZpbmlzaGVkKXJldHVybiExO3RoaXMuZmx1c2goKTt0cnl7dGhpcy5lbWl0KFwiZW5kXCIpLHRoaXMuY2xlYW5VcCgpLHRoaXMuaXNGaW5pc2hlZD0hMH1jYXRjaChlKXt0aGlzLmVtaXQoXCJlcnJvclwiLGUpfXJldHVybiEwfSxlcnJvcjpmdW5jdGlvbihlKXtyZXR1cm4hdGhpcy5pc0ZpbmlzaGVkJiYodGhpcy5pc1BhdXNlZD90aGlzLmdlbmVyYXRlZEVycm9yPWU6KHRoaXMuaXNGaW5pc2hlZD0hMCx0aGlzLmVtaXQoXCJlcnJvclwiLGUpLHRoaXMucHJldmlvdXMmJnRoaXMucHJldmlvdXMuZXJyb3IoZSksdGhpcy5jbGVhblVwKCkpLCEwKX0sb246ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5fbGlzdGVuZXJzW2VdLnB1c2godCksdGhpc30sY2xlYW5VcDpmdW5jdGlvbigpe3RoaXMuc3RyZWFtSW5mbz10aGlzLmdlbmVyYXRlZEVycm9yPXRoaXMuZXh0cmFTdHJlYW1JbmZvPW51bGwsdGhpcy5fbGlzdGVuZXJzPVtdfSxlbWl0OmZ1bmN0aW9uKGUsdCl7aWYodGhpcy5fbGlzdGVuZXJzW2VdKWZvcih2YXIgcj0wO3I8dGhpcy5fbGlzdGVuZXJzW2VdLmxlbmd0aDtyKyspdGhpcy5fbGlzdGVuZXJzW2VdW3JdLmNhbGwodGhpcyx0KX0scGlwZTpmdW5jdGlvbihlKXtyZXR1cm4gZS5yZWdpc3RlclByZXZpb3VzKHRoaXMpfSxyZWdpc3RlclByZXZpb3VzOmZ1bmN0aW9uKGUpe2lmKHRoaXMuaXNMb2NrZWQpdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cmVhbSAnXCIrdGhpcytcIicgaGFzIGFscmVhZHkgYmVlbiB1c2VkLlwiKTt0aGlzLnN0cmVhbUluZm89ZS5zdHJlYW1JbmZvLHRoaXMubWVyZ2VTdHJlYW1JbmZvKCksdGhpcy5wcmV2aW91cz1lO3ZhciB0PXRoaXM7cmV0dXJuIGUub24oXCJkYXRhXCIsZnVuY3Rpb24oZSl7dC5wcm9jZXNzQ2h1bmsoZSl9KSxlLm9uKFwiZW5kXCIsZnVuY3Rpb24oKXt0LmVuZCgpfSksZS5vbihcImVycm9yXCIsZnVuY3Rpb24oZSl7dC5lcnJvcihlKX0pLHRoaXN9LHBhdXNlOmZ1bmN0aW9uKCl7cmV0dXJuIXRoaXMuaXNQYXVzZWQmJiF0aGlzLmlzRmluaXNoZWQmJih0aGlzLmlzUGF1c2VkPSEwLHRoaXMucHJldmlvdXMmJnRoaXMucHJldmlvdXMucGF1c2UoKSwhMCl9LHJlc3VtZTpmdW5jdGlvbigpe2lmKCF0aGlzLmlzUGF1c2VkfHx0aGlzLmlzRmluaXNoZWQpcmV0dXJuITE7dmFyIGU9dGhpcy5pc1BhdXNlZD0hMTtyZXR1cm4gdGhpcy5nZW5lcmF0ZWRFcnJvciYmKHRoaXMuZXJyb3IodGhpcy5nZW5lcmF0ZWRFcnJvciksZT0hMCksdGhpcy5wcmV2aW91cyYmdGhpcy5wcmV2aW91cy5yZXN1bWUoKSwhZX0sZmx1c2g6ZnVuY3Rpb24oKXt9LHByb2Nlc3NDaHVuazpmdW5jdGlvbihlKXt0aGlzLnB1c2goZSl9LHdpdGhTdHJlYW1JbmZvOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuZXh0cmFTdHJlYW1JbmZvW2VdPXQsdGhpcy5tZXJnZVN0cmVhbUluZm8oKSx0aGlzfSxtZXJnZVN0cmVhbUluZm86ZnVuY3Rpb24oKXtmb3IodmFyIGUgaW4gdGhpcy5leHRyYVN0cmVhbUluZm8pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuZXh0cmFTdHJlYW1JbmZvLGUpJiYodGhpcy5zdHJlYW1JbmZvW2VdPXRoaXMuZXh0cmFTdHJlYW1JbmZvW2VdKX0sbG9jazpmdW5jdGlvbigpe2lmKHRoaXMuaXNMb2NrZWQpdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cmVhbSAnXCIrdGhpcytcIicgaGFzIGFscmVhZHkgYmVlbiB1c2VkLlwiKTt0aGlzLmlzTG9ja2VkPSEwLHRoaXMucHJldmlvdXMmJnRoaXMucHJldmlvdXMubG9jaygpfSx0b1N0cmluZzpmdW5jdGlvbigpe3ZhciBlPVwiV29ya2VyIFwiK3RoaXMubmFtZTtyZXR1cm4gdGhpcy5wcmV2aW91cz90aGlzLnByZXZpb3VzK1wiIC0+IFwiK2U6ZX19LHQuZXhwb3J0cz1ufSx7fV0sMjk6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaD1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi9Db252ZXJ0V29ya2VyXCIpLHM9ZShcIi4vR2VuZXJpY1dvcmtlclwiKSx1PWUoXCIuLi9iYXNlNjRcIiksbj1lKFwiLi4vc3VwcG9ydFwiKSxhPWUoXCIuLi9leHRlcm5hbFwiKSxvPW51bGw7aWYobi5ub2Rlc3RyZWFtKXRyeXtvPWUoXCIuLi9ub2RlanMvTm9kZWpzU3RyZWFtT3V0cHV0QWRhcHRlclwiKX1jYXRjaChlKXt9ZnVuY3Rpb24gbChlLG8pe3JldHVybiBuZXcgYS5Qcm9taXNlKGZ1bmN0aW9uKHQscil7dmFyIG49W10saT1lLl9pbnRlcm5hbFR5cGUscz1lLl9vdXRwdXRUeXBlLGE9ZS5fbWltZVR5cGU7ZS5vbihcImRhdGFcIixmdW5jdGlvbihlLHQpe24ucHVzaChlKSxvJiZvKHQpfSkub24oXCJlcnJvclwiLGZ1bmN0aW9uKGUpe249W10scihlKX0pLm9uKFwiZW5kXCIsZnVuY3Rpb24oKXt0cnl7dmFyIGU9ZnVuY3Rpb24oZSx0LHIpe3N3aXRjaChlKXtjYXNlXCJibG9iXCI6cmV0dXJuIGgubmV3QmxvYihoLnRyYW5zZm9ybVRvKFwiYXJyYXlidWZmZXJcIix0KSxyKTtjYXNlXCJiYXNlNjRcIjpyZXR1cm4gdS5lbmNvZGUodCk7ZGVmYXVsdDpyZXR1cm4gaC50cmFuc2Zvcm1UbyhlLHQpfX0ocyxmdW5jdGlvbihlLHQpe3ZhciByLG49MCxpPW51bGwscz0wO2ZvcihyPTA7cjx0Lmxlbmd0aDtyKyspcys9dFtyXS5sZW5ndGg7c3dpdGNoKGUpe2Nhc2VcInN0cmluZ1wiOnJldHVybiB0LmpvaW4oXCJcIik7Y2FzZVwiYXJyYXlcIjpyZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSx0KTtjYXNlXCJ1aW50OGFycmF5XCI6Zm9yKGk9bmV3IFVpbnQ4QXJyYXkocykscj0wO3I8dC5sZW5ndGg7cisrKWkuc2V0KHRbcl0sbiksbis9dFtyXS5sZW5ndGg7cmV0dXJuIGk7Y2FzZVwibm9kZWJ1ZmZlclwiOnJldHVybiBCdWZmZXIuY29uY2F0KHQpO2RlZmF1bHQ6dGhyb3cgbmV3IEVycm9yKFwiY29uY2F0IDogdW5zdXBwb3J0ZWQgdHlwZSAnXCIrZStcIidcIil9fShpLG4pLGEpO3QoZSl9Y2F0Y2goZSl7cihlKX1uPVtdfSkucmVzdW1lKCl9KX1mdW5jdGlvbiBmKGUsdCxyKXt2YXIgbj10O3N3aXRjaCh0KXtjYXNlXCJibG9iXCI6Y2FzZVwiYXJyYXlidWZmZXJcIjpuPVwidWludDhhcnJheVwiO2JyZWFrO2Nhc2VcImJhc2U2NFwiOm49XCJzdHJpbmdcIn10cnl7dGhpcy5faW50ZXJuYWxUeXBlPW4sdGhpcy5fb3V0cHV0VHlwZT10LHRoaXMuX21pbWVUeXBlPXIsaC5jaGVja1N1cHBvcnQobiksdGhpcy5fd29ya2VyPWUucGlwZShuZXcgaShuKSksZS5sb2NrKCl9Y2F0Y2goZSl7dGhpcy5fd29ya2VyPW5ldyBzKFwiZXJyb3JcIiksdGhpcy5fd29ya2VyLmVycm9yKGUpfX1mLnByb3RvdHlwZT17YWNjdW11bGF0ZTpmdW5jdGlvbihlKXtyZXR1cm4gbCh0aGlzLGUpfSxvbjpmdW5jdGlvbihlLHQpe3ZhciByPXRoaXM7cmV0dXJuXCJkYXRhXCI9PT1lP3RoaXMuX3dvcmtlci5vbihlLGZ1bmN0aW9uKGUpe3QuY2FsbChyLGUuZGF0YSxlLm1ldGEpfSk6dGhpcy5fd29ya2VyLm9uKGUsZnVuY3Rpb24oKXtoLmRlbGF5KHQsYXJndW1lbnRzLHIpfSksdGhpc30scmVzdW1lOmZ1bmN0aW9uKCl7cmV0dXJuIGguZGVsYXkodGhpcy5fd29ya2VyLnJlc3VtZSxbXSx0aGlzLl93b3JrZXIpLHRoaXN9LHBhdXNlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3dvcmtlci5wYXVzZSgpLHRoaXN9LHRvTm9kZWpzU3RyZWFtOmZ1bmN0aW9uKGUpe2lmKGguY2hlY2tTdXBwb3J0KFwibm9kZXN0cmVhbVwiKSxcIm5vZGVidWZmZXJcIiE9PXRoaXMuX291dHB1dFR5cGUpdGhyb3cgbmV3IEVycm9yKHRoaXMuX291dHB1dFR5cGUrXCIgaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIG1ldGhvZFwiKTtyZXR1cm4gbmV3IG8odGhpcyx7b2JqZWN0TW9kZTpcIm5vZGVidWZmZXJcIiE9PXRoaXMuX291dHB1dFR5cGV9LGUpfX0sdC5leHBvcnRzPWZ9LHtcIi4uL2Jhc2U2NFwiOjEsXCIuLi9leHRlcm5hbFwiOjYsXCIuLi9ub2RlanMvTm9kZWpzU3RyZWFtT3V0cHV0QWRhcHRlclwiOjEzLFwiLi4vc3VwcG9ydFwiOjMwLFwiLi4vdXRpbHNcIjozMixcIi4vQ29udmVydFdvcmtlclwiOjI0LFwiLi9HZW5lcmljV29ya2VyXCI6Mjh9XSwzMDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO2lmKHIuYmFzZTY0PSEwLHIuYXJyYXk9ITAsci5zdHJpbmc9ITAsci5hcnJheWJ1ZmZlcj1cInVuZGVmaW5lZFwiIT10eXBlb2YgQXJyYXlCdWZmZXImJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBVaW50OEFycmF5LHIubm9kZWJ1ZmZlcj1cInVuZGVmaW5lZFwiIT10eXBlb2YgQnVmZmVyLHIudWludDhhcnJheT1cInVuZGVmaW5lZFwiIT10eXBlb2YgVWludDhBcnJheSxcInVuZGVmaW5lZFwiPT10eXBlb2YgQXJyYXlCdWZmZXIpci5ibG9iPSExO2Vsc2V7dmFyIG49bmV3IEFycmF5QnVmZmVyKDApO3RyeXtyLmJsb2I9MD09PW5ldyBCbG9iKFtuXSx7dHlwZTpcImFwcGxpY2F0aW9uL3ppcFwifSkuc2l6ZX1jYXRjaChlKXt0cnl7dmFyIGk9bmV3KHNlbGYuQmxvYkJ1aWxkZXJ8fHNlbGYuV2ViS2l0QmxvYkJ1aWxkZXJ8fHNlbGYuTW96QmxvYkJ1aWxkZXJ8fHNlbGYuTVNCbG9iQnVpbGRlcik7aS5hcHBlbmQobiksci5ibG9iPTA9PT1pLmdldEJsb2IoXCJhcHBsaWNhdGlvbi96aXBcIikuc2l6ZX1jYXRjaChlKXtyLmJsb2I9ITF9fX10cnl7ci5ub2Rlc3RyZWFtPSEhZShcInJlYWRhYmxlLXN0cmVhbVwiKS5SZWFkYWJsZX1jYXRjaChlKXtyLm5vZGVzdHJlYW09ITF9fSx7XCJyZWFkYWJsZS1zdHJlYW1cIjoxNn1dLDMxOltmdW5jdGlvbihlLHQscyl7XCJ1c2Ugc3RyaWN0XCI7Zm9yKHZhciBvPWUoXCIuL3V0aWxzXCIpLGg9ZShcIi4vc3VwcG9ydFwiKSxyPWUoXCIuL25vZGVqc1V0aWxzXCIpLG49ZShcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIiksdT1uZXcgQXJyYXkoMjU2KSxpPTA7aTwyNTY7aSsrKXVbaV09MjUyPD1pPzY6MjQ4PD1pPzU6MjQwPD1pPzQ6MjI0PD1pPzM6MTkyPD1pPzI6MTt1WzI1NF09dVsyNTRdPTE7ZnVuY3Rpb24gYSgpe24uY2FsbCh0aGlzLFwidXRmLTggZGVjb2RlXCIpLHRoaXMubGVmdE92ZXI9bnVsbH1mdW5jdGlvbiBsKCl7bi5jYWxsKHRoaXMsXCJ1dGYtOCBlbmNvZGVcIil9cy51dGY4ZW5jb2RlPWZ1bmN0aW9uKGUpe3JldHVybiBoLm5vZGVidWZmZXI/ci5uZXdCdWZmZXJGcm9tKGUsXCJ1dGYtOFwiKTpmdW5jdGlvbihlKXt2YXIgdCxyLG4saSxzLGE9ZS5sZW5ndGgsbz0wO2ZvcihpPTA7aTxhO2krKyk1NTI5Nj09KDY0NTEyJihyPWUuY2hhckNvZGVBdChpKSkpJiZpKzE8YSYmNTYzMjA9PSg2NDUxMiYobj1lLmNoYXJDb2RlQXQoaSsxKSkpJiYocj02NTUzNisoci01NTI5Njw8MTApKyhuLTU2MzIwKSxpKyspLG8rPXI8MTI4PzE6cjwyMDQ4PzI6cjw2NTUzNj8zOjQ7Zm9yKHQ9aC51aW50OGFycmF5P25ldyBVaW50OEFycmF5KG8pOm5ldyBBcnJheShvKSxpPXM9MDtzPG87aSsrKTU1Mjk2PT0oNjQ1MTImKHI9ZS5jaGFyQ29kZUF0KGkpKSkmJmkrMTxhJiY1NjMyMD09KDY0NTEyJihuPWUuY2hhckNvZGVBdChpKzEpKSkmJihyPTY1NTM2KyhyLTU1Mjk2PDwxMCkrKG4tNTYzMjApLGkrKykscjwxMjg/dFtzKytdPXI6KHI8MjA0OD90W3MrK109MTkyfHI+Pj42OihyPDY1NTM2P3RbcysrXT0yMjR8cj4+PjEyOih0W3MrK109MjQwfHI+Pj4xOCx0W3MrK109MTI4fHI+Pj4xMiY2MyksdFtzKytdPTEyOHxyPj4+NiY2MyksdFtzKytdPTEyOHw2MyZyKTtyZXR1cm4gdH0oZSl9LHMudXRmOGRlY29kZT1mdW5jdGlvbihlKXtyZXR1cm4gaC5ub2RlYnVmZmVyP28udHJhbnNmb3JtVG8oXCJub2RlYnVmZmVyXCIsZSkudG9TdHJpbmcoXCJ1dGYtOFwiKTpmdW5jdGlvbihlKXt2YXIgdCxyLG4saSxzPWUubGVuZ3RoLGE9bmV3IEFycmF5KDIqcyk7Zm9yKHQ9cj0wO3Q8czspaWYoKG49ZVt0KytdKTwxMjgpYVtyKytdPW47ZWxzZSBpZig0PChpPXVbbl0pKWFbcisrXT02NTUzMyx0Kz1pLTE7ZWxzZXtmb3IobiY9Mj09PWk/MzE6Mz09PWk/MTU6NzsxPGkmJnQ8czspbj1uPDw2fDYzJmVbdCsrXSxpLS07MTxpP2FbcisrXT02NTUzMzpuPDY1NTM2P2FbcisrXT1uOihuLT02NTUzNixhW3IrK109NTUyOTZ8bj4+MTAmMTAyMyxhW3IrK109NTYzMjB8MTAyMyZuKX1yZXR1cm4gYS5sZW5ndGghPT1yJiYoYS5zdWJhcnJheT9hPWEuc3ViYXJyYXkoMCxyKTphLmxlbmd0aD1yKSxvLmFwcGx5RnJvbUNoYXJDb2RlKGEpfShlPW8udHJhbnNmb3JtVG8oaC51aW50OGFycmF5P1widWludDhhcnJheVwiOlwiYXJyYXlcIixlKSl9LG8uaW5oZXJpdHMoYSxuKSxhLnByb3RvdHlwZS5wcm9jZXNzQ2h1bms9ZnVuY3Rpb24oZSl7dmFyIHQ9by50cmFuc2Zvcm1UbyhoLnVpbnQ4YXJyYXk/XCJ1aW50OGFycmF5XCI6XCJhcnJheVwiLGUuZGF0YSk7aWYodGhpcy5sZWZ0T3ZlciYmdGhpcy5sZWZ0T3Zlci5sZW5ndGgpe2lmKGgudWludDhhcnJheSl7dmFyIHI9dDsodD1uZXcgVWludDhBcnJheShyLmxlbmd0aCt0aGlzLmxlZnRPdmVyLmxlbmd0aCkpLnNldCh0aGlzLmxlZnRPdmVyLDApLHQuc2V0KHIsdGhpcy5sZWZ0T3Zlci5sZW5ndGgpfWVsc2UgdD10aGlzLmxlZnRPdmVyLmNvbmNhdCh0KTt0aGlzLmxlZnRPdmVyPW51bGx9dmFyIG49ZnVuY3Rpb24oZSx0KXt2YXIgcjtmb3IoKHQ9dHx8ZS5sZW5ndGgpPmUubGVuZ3RoJiYodD1lLmxlbmd0aCkscj10LTE7MDw9ciYmMTI4PT0oMTkyJmVbcl0pOylyLS07cmV0dXJuIHI8MD90OjA9PT1yP3Q6cit1W2Vbcl1dPnQ/cjp0fSh0KSxpPXQ7biE9PXQubGVuZ3RoJiYoaC51aW50OGFycmF5PyhpPXQuc3ViYXJyYXkoMCxuKSx0aGlzLmxlZnRPdmVyPXQuc3ViYXJyYXkobix0Lmxlbmd0aCkpOihpPXQuc2xpY2UoMCxuKSx0aGlzLmxlZnRPdmVyPXQuc2xpY2Uobix0Lmxlbmd0aCkpKSx0aGlzLnB1c2goe2RhdGE6cy51dGY4ZGVjb2RlKGkpLG1ldGE6ZS5tZXRhfSl9LGEucHJvdG90eXBlLmZsdXNoPWZ1bmN0aW9uKCl7dGhpcy5sZWZ0T3ZlciYmdGhpcy5sZWZ0T3Zlci5sZW5ndGgmJih0aGlzLnB1c2goe2RhdGE6cy51dGY4ZGVjb2RlKHRoaXMubGVmdE92ZXIpLG1ldGE6e319KSx0aGlzLmxlZnRPdmVyPW51bGwpfSxzLlV0ZjhEZWNvZGVXb3JrZXI9YSxvLmluaGVyaXRzKGwsbiksbC5wcm90b3R5cGUucHJvY2Vzc0NodW5rPWZ1bmN0aW9uKGUpe3RoaXMucHVzaCh7ZGF0YTpzLnV0ZjhlbmNvZGUoZS5kYXRhKSxtZXRhOmUubWV0YX0pfSxzLlV0ZjhFbmNvZGVXb3JrZXI9bH0se1wiLi9ub2RlanNVdGlsc1wiOjE0LFwiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4LFwiLi9zdXBwb3J0XCI6MzAsXCIuL3V0aWxzXCI6MzJ9XSwzMjpbZnVuY3Rpb24oZSx0LGEpe1widXNlIHN0cmljdFwiO3ZhciBvPWUoXCIuL3N1cHBvcnRcIiksaD1lKFwiLi9iYXNlNjRcIikscj1lKFwiLi9ub2RlanNVdGlsc1wiKSx1PWUoXCIuL2V4dGVybmFsXCIpO2Z1bmN0aW9uIG4oZSl7cmV0dXJuIGV9ZnVuY3Rpb24gbChlLHQpe2Zvcih2YXIgcj0wO3I8ZS5sZW5ndGg7KytyKXRbcl09MjU1JmUuY2hhckNvZGVBdChyKTtyZXR1cm4gdH1lKFwic2V0aW1tZWRpYXRlXCIpLGEubmV3QmxvYj1mdW5jdGlvbih0LHIpe2EuY2hlY2tTdXBwb3J0KFwiYmxvYlwiKTt0cnl7cmV0dXJuIG5ldyBCbG9iKFt0XSx7dHlwZTpyfSl9Y2F0Y2goZSl7dHJ5e3ZhciBuPW5ldyhzZWxmLkJsb2JCdWlsZGVyfHxzZWxmLldlYktpdEJsb2JCdWlsZGVyfHxzZWxmLk1vekJsb2JCdWlsZGVyfHxzZWxmLk1TQmxvYkJ1aWxkZXIpO3JldHVybiBuLmFwcGVuZCh0KSxuLmdldEJsb2Iocil9Y2F0Y2goZSl7dGhyb3cgbmV3IEVycm9yKFwiQnVnIDogY2FuJ3QgY29uc3RydWN0IHRoZSBCbG9iLlwiKX19fTt2YXIgaT17c3RyaW5naWZ5QnlDaHVuazpmdW5jdGlvbihlLHQscil7dmFyIG49W10saT0wLHM9ZS5sZW5ndGg7aWYoczw9cilyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGUpO2Zvcig7aTxzOylcImFycmF5XCI9PT10fHxcIm5vZGVidWZmZXJcIj09PXQ/bi5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxlLnNsaWNlKGksTWF0aC5taW4oaStyLHMpKSkpOm4ucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsZS5zdWJhcnJheShpLE1hdGgubWluKGkrcixzKSkpKSxpKz1yO3JldHVybiBuLmpvaW4oXCJcIil9LHN0cmluZ2lmeUJ5Q2hhcjpmdW5jdGlvbihlKXtmb3IodmFyIHQ9XCJcIixyPTA7cjxlLmxlbmd0aDtyKyspdCs9U3RyaW5nLmZyb21DaGFyQ29kZShlW3JdKTtyZXR1cm4gdH0sYXBwbHlDYW5CZVVzZWQ6e3VpbnQ4YXJyYXk6ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIG8udWludDhhcnJheSYmMT09PVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuZXcgVWludDhBcnJheSgxKSkubGVuZ3RofWNhdGNoKGUpe3JldHVybiExfX0oKSxub2RlYnVmZmVyOmZ1bmN0aW9uKCl7dHJ5e3JldHVybiBvLm5vZGVidWZmZXImJjE9PT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsci5hbGxvY0J1ZmZlcigxKSkubGVuZ3RofWNhdGNoKGUpe3JldHVybiExfX0oKX19O2Z1bmN0aW9uIHMoZSl7dmFyIHQ9NjU1MzYscj1hLmdldFR5cGVPZihlKSxuPSEwO2lmKFwidWludDhhcnJheVwiPT09cj9uPWkuYXBwbHlDYW5CZVVzZWQudWludDhhcnJheTpcIm5vZGVidWZmZXJcIj09PXImJihuPWkuYXBwbHlDYW5CZVVzZWQubm9kZWJ1ZmZlciksbilmb3IoOzE8dDspdHJ5e3JldHVybiBpLnN0cmluZ2lmeUJ5Q2h1bmsoZSxyLHQpfWNhdGNoKGUpe3Q9TWF0aC5mbG9vcih0LzIpfXJldHVybiBpLnN0cmluZ2lmeUJ5Q2hhcihlKX1mdW5jdGlvbiBmKGUsdCl7Zm9yKHZhciByPTA7cjxlLmxlbmd0aDtyKyspdFtyXT1lW3JdO3JldHVybiB0fWEuYXBwbHlGcm9tQ2hhckNvZGU9czt2YXIgYz17fTtjLnN0cmluZz17c3RyaW5nOm4sYXJyYXk6ZnVuY3Rpb24oZSl7cmV0dXJuIGwoZSxuZXcgQXJyYXkoZS5sZW5ndGgpKX0sYXJyYXlidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGMuc3RyaW5nLnVpbnQ4YXJyYXkoZSkuYnVmZmVyfSx1aW50OGFycmF5OmZ1bmN0aW9uKGUpe3JldHVybiBsKGUsbmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpKX0sbm9kZWJ1ZmZlcjpmdW5jdGlvbihlKXtyZXR1cm4gbChlLHIuYWxsb2NCdWZmZXIoZS5sZW5ndGgpKX19LGMuYXJyYXk9e3N0cmluZzpzLGFycmF5Om4sYXJyYXlidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBVaW50OEFycmF5KGUpLmJ1ZmZlcn0sdWludDhhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZSl9LG5vZGVidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIHIubmV3QnVmZmVyRnJvbShlKX19LGMuYXJyYXlidWZmZXI9e3N0cmluZzpmdW5jdGlvbihlKXtyZXR1cm4gcyhuZXcgVWludDhBcnJheShlKSl9LGFycmF5OmZ1bmN0aW9uKGUpe3JldHVybiBmKG5ldyBVaW50OEFycmF5KGUpLG5ldyBBcnJheShlLmJ5dGVMZW5ndGgpKX0sYXJyYXlidWZmZXI6bix1aW50OGFycmF5OmZ1bmN0aW9uKGUpe3JldHVybiBuZXcgVWludDhBcnJheShlKX0sbm9kZWJ1ZmZlcjpmdW5jdGlvbihlKXtyZXR1cm4gci5uZXdCdWZmZXJGcm9tKG5ldyBVaW50OEFycmF5KGUpKX19LGMudWludDhhcnJheT17c3RyaW5nOnMsYXJyYXk6ZnVuY3Rpb24oZSl7cmV0dXJuIGYoZSxuZXcgQXJyYXkoZS5sZW5ndGgpKX0sYXJyYXlidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGUuYnVmZmVyfSx1aW50OGFycmF5Om4sbm9kZWJ1ZmZlcjpmdW5jdGlvbihlKXtyZXR1cm4gci5uZXdCdWZmZXJGcm9tKGUpfX0sYy5ub2RlYnVmZmVyPXtzdHJpbmc6cyxhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gZihlLG5ldyBBcnJheShlLmxlbmd0aCkpfSxhcnJheWJ1ZmZlcjpmdW5jdGlvbihlKXtyZXR1cm4gYy5ub2RlYnVmZmVyLnVpbnQ4YXJyYXkoZSkuYnVmZmVyfSx1aW50OGFycmF5OmZ1bmN0aW9uKGUpe3JldHVybiBmKGUsbmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpKX0sbm9kZWJ1ZmZlcjpufSxhLnRyYW5zZm9ybVRvPWZ1bmN0aW9uKGUsdCl7aWYodD10fHxcIlwiLCFlKXJldHVybiB0O2EuY2hlY2tTdXBwb3J0KGUpO3ZhciByPWEuZ2V0VHlwZU9mKHQpO3JldHVybiBjW3JdW2VdKHQpfSxhLnJlc29sdmU9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PWUuc3BsaXQoXCIvXCIpLHI9W10sbj0wO248dC5sZW5ndGg7bisrKXt2YXIgaT10W25dO1wiLlwiPT09aXx8XCJcIj09PWkmJjAhPT1uJiZuIT09dC5sZW5ndGgtMXx8KFwiLi5cIj09PWk/ci5wb3AoKTpyLnB1c2goaSkpfXJldHVybiByLmpvaW4oXCIvXCIpfSxhLmdldFR5cGVPZj1mdW5jdGlvbihlKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgZT9cInN0cmluZ1wiOlwiW29iamVjdCBBcnJheV1cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKT9cImFycmF5XCI6by5ub2RlYnVmZmVyJiZyLmlzQnVmZmVyKGUpP1wibm9kZWJ1ZmZlclwiOm8udWludDhhcnJheSYmZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXk/XCJ1aW50OGFycmF5XCI6by5hcnJheWJ1ZmZlciYmZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyP1wiYXJyYXlidWZmZXJcIjp2b2lkIDB9LGEuY2hlY2tTdXBwb3J0PWZ1bmN0aW9uKGUpe2lmKCFvW2UudG9Mb3dlckNhc2UoKV0pdGhyb3cgbmV3IEVycm9yKGUrXCIgaXMgbm90IHN1cHBvcnRlZCBieSB0aGlzIHBsYXRmb3JtXCIpfSxhLk1BWF9WQUxVRV8xNkJJVFM9NjU1MzUsYS5NQVhfVkFMVUVfMzJCSVRTPS0xLGEucHJldHR5PWZ1bmN0aW9uKGUpe3ZhciB0LHIsbj1cIlwiO2ZvcihyPTA7cjwoZXx8XCJcIikubGVuZ3RoO3IrKyluKz1cIlxcXFx4XCIrKCh0PWUuY2hhckNvZGVBdChyKSk8MTY/XCIwXCI6XCJcIikrdC50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtyZXR1cm4gbn0sYS5kZWxheT1mdW5jdGlvbihlLHQscil7c2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCl7ZS5hcHBseShyfHxudWxsLHR8fFtdKX0pfSxhLmluaGVyaXRzPWZ1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gcigpe31yLnByb3RvdHlwZT10LnByb3RvdHlwZSxlLnByb3RvdHlwZT1uZXcgcn0sYS5leHRlbmQ9ZnVuY3Rpb24oKXt2YXIgZSx0LHI9e307Zm9yKGU9MDtlPGFyZ3VtZW50cy5sZW5ndGg7ZSsrKWZvcih0IGluIGFyZ3VtZW50c1tlXSlPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXJndW1lbnRzW2VdLHQpJiZ2b2lkIDA9PT1yW3RdJiYoclt0XT1hcmd1bWVudHNbZV1bdF0pO3JldHVybiByfSxhLnByZXBhcmVDb250ZW50PWZ1bmN0aW9uKHIsZSxuLGkscyl7cmV0dXJuIHUuUHJvbWlzZS5yZXNvbHZlKGUpLnRoZW4oZnVuY3Rpb24obil7cmV0dXJuIG8uYmxvYiYmKG4gaW5zdGFuY2VvZiBCbG9ifHwtMSE9PVtcIltvYmplY3QgRmlsZV1cIixcIltvYmplY3QgQmxvYl1cIl0uaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobikpKSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIEZpbGVSZWFkZXI/bmV3IHUuUHJvbWlzZShmdW5jdGlvbih0LHIpe3ZhciBlPW5ldyBGaWxlUmVhZGVyO2Uub25sb2FkPWZ1bmN0aW9uKGUpe3QoZS50YXJnZXQucmVzdWx0KX0sZS5vbmVycm9yPWZ1bmN0aW9uKGUpe3IoZS50YXJnZXQuZXJyb3IpfSxlLnJlYWRBc0FycmF5QnVmZmVyKG4pfSk6bn0pLnRoZW4oZnVuY3Rpb24oZSl7dmFyIHQ9YS5nZXRUeXBlT2YoZSk7cmV0dXJuIHQ/KFwiYXJyYXlidWZmZXJcIj09PXQ/ZT1hLnRyYW5zZm9ybVRvKFwidWludDhhcnJheVwiLGUpOlwic3RyaW5nXCI9PT10JiYocz9lPWguZGVjb2RlKGUpOm4mJiEwIT09aSYmKGU9ZnVuY3Rpb24oZSl7cmV0dXJuIGwoZSxvLnVpbnQ4YXJyYXk/bmV3IFVpbnQ4QXJyYXkoZS5sZW5ndGgpOm5ldyBBcnJheShlLmxlbmd0aCkpfShlKSkpLGUpOnUuUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKFwiQ2FuJ3QgcmVhZCB0aGUgZGF0YSBvZiAnXCIrcitcIicuIElzIGl0IGluIGEgc3VwcG9ydGVkIEphdmFTY3JpcHQgdHlwZSAoU3RyaW5nLCBCbG9iLCBBcnJheUJ1ZmZlciwgZXRjKSA/XCIpKX0pfX0se1wiLi9iYXNlNjRcIjoxLFwiLi9leHRlcm5hbFwiOjYsXCIuL25vZGVqc1V0aWxzXCI6MTQsXCIuL3N1cHBvcnRcIjozMCxzZXRpbW1lZGlhdGU6NTR9XSwzMzpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL3JlYWRlci9yZWFkZXJGb3JcIiksaT1lKFwiLi91dGlsc1wiKSxzPWUoXCIuL3NpZ25hdHVyZVwiKSxhPWUoXCIuL3ppcEVudHJ5XCIpLG89ZShcIi4vc3VwcG9ydFwiKTtmdW5jdGlvbiBoKGUpe3RoaXMuZmlsZXM9W10sdGhpcy5sb2FkT3B0aW9ucz1lfWgucHJvdG90eXBlPXtjaGVja1NpZ25hdHVyZTpmdW5jdGlvbihlKXtpZighdGhpcy5yZWFkZXIucmVhZEFuZENoZWNrU2lnbmF0dXJlKGUpKXt0aGlzLnJlYWRlci5pbmRleC09NDt2YXIgdD10aGlzLnJlYWRlci5yZWFkU3RyaW5nKDQpO3Rocm93IG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXAgb3IgYnVnOiB1bmV4cGVjdGVkIHNpZ25hdHVyZSAoXCIraS5wcmV0dHkodCkrXCIsIGV4cGVjdGVkIFwiK2kucHJldHR5KGUpK1wiKVwiKX19LGlzU2lnbmF0dXJlOmZ1bmN0aW9uKGUsdCl7dmFyIHI9dGhpcy5yZWFkZXIuaW5kZXg7dGhpcy5yZWFkZXIuc2V0SW5kZXgoZSk7dmFyIG49dGhpcy5yZWFkZXIucmVhZFN0cmluZyg0KT09PXQ7cmV0dXJuIHRoaXMucmVhZGVyLnNldEluZGV4KHIpLG59LHJlYWRCbG9ja0VuZE9mQ2VudHJhbDpmdW5jdGlvbigpe3RoaXMuZGlza051bWJlcj10aGlzLnJlYWRlci5yZWFkSW50KDIpLHRoaXMuZGlza1dpdGhDZW50cmFsRGlyU3RhcnQ9dGhpcy5yZWFkZXIucmVhZEludCgyKSx0aGlzLmNlbnRyYWxEaXJSZWNvcmRzT25UaGlzRGlzaz10aGlzLnJlYWRlci5yZWFkSW50KDIpLHRoaXMuY2VudHJhbERpclJlY29yZHM9dGhpcy5yZWFkZXIucmVhZEludCgyKSx0aGlzLmNlbnRyYWxEaXJTaXplPXRoaXMucmVhZGVyLnJlYWRJbnQoNCksdGhpcy5jZW50cmFsRGlyT2Zmc2V0PXRoaXMucmVhZGVyLnJlYWRJbnQoNCksdGhpcy56aXBDb21tZW50TGVuZ3RoPXRoaXMucmVhZGVyLnJlYWRJbnQoMik7dmFyIGU9dGhpcy5yZWFkZXIucmVhZERhdGEodGhpcy56aXBDb21tZW50TGVuZ3RoKSx0PW8udWludDhhcnJheT9cInVpbnQ4YXJyYXlcIjpcImFycmF5XCIscj1pLnRyYW5zZm9ybVRvKHQsZSk7dGhpcy56aXBDb21tZW50PXRoaXMubG9hZE9wdGlvbnMuZGVjb2RlRmlsZU5hbWUocil9LHJlYWRCbG9ja1ppcDY0RW5kT2ZDZW50cmFsOmZ1bmN0aW9uKCl7dGhpcy56aXA2NEVuZE9mQ2VudHJhbFNpemU9dGhpcy5yZWFkZXIucmVhZEludCg4KSx0aGlzLnJlYWRlci5za2lwKDQpLHRoaXMuZGlza051bWJlcj10aGlzLnJlYWRlci5yZWFkSW50KDQpLHRoaXMuZGlza1dpdGhDZW50cmFsRGlyU3RhcnQ9dGhpcy5yZWFkZXIucmVhZEludCg0KSx0aGlzLmNlbnRyYWxEaXJSZWNvcmRzT25UaGlzRGlzaz10aGlzLnJlYWRlci5yZWFkSW50KDgpLHRoaXMuY2VudHJhbERpclJlY29yZHM9dGhpcy5yZWFkZXIucmVhZEludCg4KSx0aGlzLmNlbnRyYWxEaXJTaXplPXRoaXMucmVhZGVyLnJlYWRJbnQoOCksdGhpcy5jZW50cmFsRGlyT2Zmc2V0PXRoaXMucmVhZGVyLnJlYWRJbnQoOCksdGhpcy56aXA2NEV4dGVuc2libGVEYXRhPXt9O2Zvcih2YXIgZSx0LHIsbj10aGlzLnppcDY0RW5kT2ZDZW50cmFsU2l6ZS00NDswPG47KWU9dGhpcy5yZWFkZXIucmVhZEludCgyKSx0PXRoaXMucmVhZGVyLnJlYWRJbnQoNCkscj10aGlzLnJlYWRlci5yZWFkRGF0YSh0KSx0aGlzLnppcDY0RXh0ZW5zaWJsZURhdGFbZV09e2lkOmUsbGVuZ3RoOnQsdmFsdWU6cn19LHJlYWRCbG9ja1ppcDY0RW5kT2ZDZW50cmFsTG9jYXRvcjpmdW5jdGlvbigpe2lmKHRoaXMuZGlza1dpdGhaaXA2NENlbnRyYWxEaXJTdGFydD10aGlzLnJlYWRlci5yZWFkSW50KDQpLHRoaXMucmVsYXRpdmVPZmZzZXRFbmRPZlppcDY0Q2VudHJhbERpcj10aGlzLnJlYWRlci5yZWFkSW50KDgpLHRoaXMuZGlza3NDb3VudD10aGlzLnJlYWRlci5yZWFkSW50KDQpLDE8dGhpcy5kaXNrc0NvdW50KXRocm93IG5ldyBFcnJvcihcIk11bHRpLXZvbHVtZXMgemlwIGFyZSBub3Qgc3VwcG9ydGVkXCIpfSxyZWFkTG9jYWxGaWxlczpmdW5jdGlvbigpe3ZhciBlLHQ7Zm9yKGU9MDtlPHRoaXMuZmlsZXMubGVuZ3RoO2UrKyl0PXRoaXMuZmlsZXNbZV0sdGhpcy5yZWFkZXIuc2V0SW5kZXgodC5sb2NhbEhlYWRlck9mZnNldCksdGhpcy5jaGVja1NpZ25hdHVyZShzLkxPQ0FMX0ZJTEVfSEVBREVSKSx0LnJlYWRMb2NhbFBhcnQodGhpcy5yZWFkZXIpLHQuaGFuZGxlVVRGOCgpLHQucHJvY2Vzc0F0dHJpYnV0ZXMoKX0scmVhZENlbnRyYWxEaXI6ZnVuY3Rpb24oKXt2YXIgZTtmb3IodGhpcy5yZWFkZXIuc2V0SW5kZXgodGhpcy5jZW50cmFsRGlyT2Zmc2V0KTt0aGlzLnJlYWRlci5yZWFkQW5kQ2hlY2tTaWduYXR1cmUocy5DRU5UUkFMX0ZJTEVfSEVBREVSKTspKGU9bmV3IGEoe3ppcDY0OnRoaXMuemlwNjR9LHRoaXMubG9hZE9wdGlvbnMpKS5yZWFkQ2VudHJhbFBhcnQodGhpcy5yZWFkZXIpLHRoaXMuZmlsZXMucHVzaChlKTtpZih0aGlzLmNlbnRyYWxEaXJSZWNvcmRzIT09dGhpcy5maWxlcy5sZW5ndGgmJjAhPT10aGlzLmNlbnRyYWxEaXJSZWNvcmRzJiYwPT09dGhpcy5maWxlcy5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ29ycnVwdGVkIHppcCBvciBidWc6IGV4cGVjdGVkIFwiK3RoaXMuY2VudHJhbERpclJlY29yZHMrXCIgcmVjb3JkcyBpbiBjZW50cmFsIGRpciwgZ290IFwiK3RoaXMuZmlsZXMubGVuZ3RoKX0scmVhZEVuZE9mQ2VudHJhbDpmdW5jdGlvbigpe3ZhciBlPXRoaXMucmVhZGVyLmxhc3RJbmRleE9mU2lnbmF0dXJlKHMuQ0VOVFJBTF9ESVJFQ1RPUllfRU5EKTtpZihlPDApdGhyb3chdGhpcy5pc1NpZ25hdHVyZSgwLHMuTE9DQUxfRklMRV9IRUFERVIpP25ldyBFcnJvcihcIkNhbid0IGZpbmQgZW5kIG9mIGNlbnRyYWwgZGlyZWN0b3J5IDogaXMgdGhpcyBhIHppcCBmaWxlID8gSWYgaXQgaXMsIHNlZSBodHRwczovL3N0dWsuZ2l0aHViLmlvL2pzemlwL2RvY3VtZW50YXRpb24vaG93dG8vcmVhZF96aXAuaHRtbFwiKTpuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwOiBjYW4ndCBmaW5kIGVuZCBvZiBjZW50cmFsIGRpcmVjdG9yeVwiKTt0aGlzLnJlYWRlci5zZXRJbmRleChlKTt2YXIgdD1lO2lmKHRoaXMuY2hlY2tTaWduYXR1cmUocy5DRU5UUkFMX0RJUkVDVE9SWV9FTkQpLHRoaXMucmVhZEJsb2NrRW5kT2ZDZW50cmFsKCksdGhpcy5kaXNrTnVtYmVyPT09aS5NQVhfVkFMVUVfMTZCSVRTfHx0aGlzLmRpc2tXaXRoQ2VudHJhbERpclN0YXJ0PT09aS5NQVhfVkFMVUVfMTZCSVRTfHx0aGlzLmNlbnRyYWxEaXJSZWNvcmRzT25UaGlzRGlzaz09PWkuTUFYX1ZBTFVFXzE2QklUU3x8dGhpcy5jZW50cmFsRGlyUmVjb3Jkcz09PWkuTUFYX1ZBTFVFXzE2QklUU3x8dGhpcy5jZW50cmFsRGlyU2l6ZT09PWkuTUFYX1ZBTFVFXzMyQklUU3x8dGhpcy5jZW50cmFsRGlyT2Zmc2V0PT09aS5NQVhfVkFMVUVfMzJCSVRTKXtpZih0aGlzLnppcDY0PSEwLChlPXRoaXMucmVhZGVyLmxhc3RJbmRleE9mU2lnbmF0dXJlKHMuWklQNjRfQ0VOVFJBTF9ESVJFQ1RPUllfTE9DQVRPUikpPDApdGhyb3cgbmV3IEVycm9yKFwiQ29ycnVwdGVkIHppcDogY2FuJ3QgZmluZCB0aGUgWklQNjQgZW5kIG9mIGNlbnRyYWwgZGlyZWN0b3J5IGxvY2F0b3JcIik7aWYodGhpcy5yZWFkZXIuc2V0SW5kZXgoZSksdGhpcy5jaGVja1NpZ25hdHVyZShzLlpJUDY0X0NFTlRSQUxfRElSRUNUT1JZX0xPQ0FUT1IpLHRoaXMucmVhZEJsb2NrWmlwNjRFbmRPZkNlbnRyYWxMb2NhdG9yKCksIXRoaXMuaXNTaWduYXR1cmUodGhpcy5yZWxhdGl2ZU9mZnNldEVuZE9mWmlwNjRDZW50cmFsRGlyLHMuWklQNjRfQ0VOVFJBTF9ESVJFQ1RPUllfRU5EKSYmKHRoaXMucmVsYXRpdmVPZmZzZXRFbmRPZlppcDY0Q2VudHJhbERpcj10aGlzLnJlYWRlci5sYXN0SW5kZXhPZlNpZ25hdHVyZShzLlpJUDY0X0NFTlRSQUxfRElSRUNUT1JZX0VORCksdGhpcy5yZWxhdGl2ZU9mZnNldEVuZE9mWmlwNjRDZW50cmFsRGlyPDApKXRocm93IG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXA6IGNhbid0IGZpbmQgdGhlIFpJUDY0IGVuZCBvZiBjZW50cmFsIGRpcmVjdG9yeVwiKTt0aGlzLnJlYWRlci5zZXRJbmRleCh0aGlzLnJlbGF0aXZlT2Zmc2V0RW5kT2ZaaXA2NENlbnRyYWxEaXIpLHRoaXMuY2hlY2tTaWduYXR1cmUocy5aSVA2NF9DRU5UUkFMX0RJUkVDVE9SWV9FTkQpLHRoaXMucmVhZEJsb2NrWmlwNjRFbmRPZkNlbnRyYWwoKX12YXIgcj10aGlzLmNlbnRyYWxEaXJPZmZzZXQrdGhpcy5jZW50cmFsRGlyU2l6ZTt0aGlzLnppcDY0JiYocis9MjAscis9MTIrdGhpcy56aXA2NEVuZE9mQ2VudHJhbFNpemUpO3ZhciBuPXQtcjtpZigwPG4pdGhpcy5pc1NpZ25hdHVyZSh0LHMuQ0VOVFJBTF9GSUxFX0hFQURFUil8fCh0aGlzLnJlYWRlci56ZXJvPW4pO2Vsc2UgaWYobjwwKXRocm93IG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXA6IG1pc3NpbmcgXCIrTWF0aC5hYnMobikrXCIgYnl0ZXMuXCIpfSxwcmVwYXJlUmVhZGVyOmZ1bmN0aW9uKGUpe3RoaXMucmVhZGVyPW4oZSl9LGxvYWQ6ZnVuY3Rpb24oZSl7dGhpcy5wcmVwYXJlUmVhZGVyKGUpLHRoaXMucmVhZEVuZE9mQ2VudHJhbCgpLHRoaXMucmVhZENlbnRyYWxEaXIoKSx0aGlzLnJlYWRMb2NhbEZpbGVzKCl9fSx0LmV4cG9ydHM9aH0se1wiLi9yZWFkZXIvcmVhZGVyRm9yXCI6MjIsXCIuL3NpZ25hdHVyZVwiOjIzLFwiLi9zdXBwb3J0XCI6MzAsXCIuL3V0aWxzXCI6MzIsXCIuL3ppcEVudHJ5XCI6MzR9XSwzNDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL3JlYWRlci9yZWFkZXJGb3JcIikscz1lKFwiLi91dGlsc1wiKSxpPWUoXCIuL2NvbXByZXNzZWRPYmplY3RcIiksYT1lKFwiLi9jcmMzMlwiKSxvPWUoXCIuL3V0ZjhcIiksaD1lKFwiLi9jb21wcmVzc2lvbnNcIiksdT1lKFwiLi9zdXBwb3J0XCIpO2Z1bmN0aW9uIGwoZSx0KXt0aGlzLm9wdGlvbnM9ZSx0aGlzLmxvYWRPcHRpb25zPXR9bC5wcm90b3R5cGU9e2lzRW5jcnlwdGVkOmZ1bmN0aW9uKCl7cmV0dXJuIDE9PSgxJnRoaXMuYml0RmxhZyl9LHVzZVVURjg6ZnVuY3Rpb24oKXtyZXR1cm4gMjA0OD09KDIwNDgmdGhpcy5iaXRGbGFnKX0scmVhZExvY2FsUGFydDpmdW5jdGlvbihlKXt2YXIgdCxyO2lmKGUuc2tpcCgyMiksdGhpcy5maWxlTmFtZUxlbmd0aD1lLnJlYWRJbnQoMikscj1lLnJlYWRJbnQoMiksdGhpcy5maWxlTmFtZT1lLnJlYWREYXRhKHRoaXMuZmlsZU5hbWVMZW5ndGgpLGUuc2tpcChyKSwtMT09PXRoaXMuY29tcHJlc3NlZFNpemV8fC0xPT09dGhpcy51bmNvbXByZXNzZWRTaXplKXRocm93IG5ldyBFcnJvcihcIkJ1ZyBvciBjb3JydXB0ZWQgemlwIDogZGlkbid0IGdldCBlbm91Z2ggaW5mb3JtYXRpb24gZnJvbSB0aGUgY2VudHJhbCBkaXJlY3RvcnkgKGNvbXByZXNzZWRTaXplID09PSAtMSB8fCB1bmNvbXByZXNzZWRTaXplID09PSAtMSlcIik7aWYobnVsbD09PSh0PWZ1bmN0aW9uKGUpe2Zvcih2YXIgdCBpbiBoKWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChoLHQpJiZoW3RdLm1hZ2ljPT09ZSlyZXR1cm4gaFt0XTtyZXR1cm4gbnVsbH0odGhpcy5jb21wcmVzc2lvbk1ldGhvZCkpKXRocm93IG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXAgOiBjb21wcmVzc2lvbiBcIitzLnByZXR0eSh0aGlzLmNvbXByZXNzaW9uTWV0aG9kKStcIiB1bmtub3duIChpbm5lciBmaWxlIDogXCIrcy50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLHRoaXMuZmlsZU5hbWUpK1wiKVwiKTt0aGlzLmRlY29tcHJlc3NlZD1uZXcgaSh0aGlzLmNvbXByZXNzZWRTaXplLHRoaXMudW5jb21wcmVzc2VkU2l6ZSx0aGlzLmNyYzMyLHQsZS5yZWFkRGF0YSh0aGlzLmNvbXByZXNzZWRTaXplKSl9LHJlYWRDZW50cmFsUGFydDpmdW5jdGlvbihlKXt0aGlzLnZlcnNpb25NYWRlQnk9ZS5yZWFkSW50KDIpLGUuc2tpcCgyKSx0aGlzLmJpdEZsYWc9ZS5yZWFkSW50KDIpLHRoaXMuY29tcHJlc3Npb25NZXRob2Q9ZS5yZWFkU3RyaW5nKDIpLHRoaXMuZGF0ZT1lLnJlYWREYXRlKCksdGhpcy5jcmMzMj1lLnJlYWRJbnQoNCksdGhpcy5jb21wcmVzc2VkU2l6ZT1lLnJlYWRJbnQoNCksdGhpcy51bmNvbXByZXNzZWRTaXplPWUucmVhZEludCg0KTt2YXIgdD1lLnJlYWRJbnQoMik7aWYodGhpcy5leHRyYUZpZWxkc0xlbmd0aD1lLnJlYWRJbnQoMiksdGhpcy5maWxlQ29tbWVudExlbmd0aD1lLnJlYWRJbnQoMiksdGhpcy5kaXNrTnVtYmVyU3RhcnQ9ZS5yZWFkSW50KDIpLHRoaXMuaW50ZXJuYWxGaWxlQXR0cmlidXRlcz1lLnJlYWRJbnQoMiksdGhpcy5leHRlcm5hbEZpbGVBdHRyaWJ1dGVzPWUucmVhZEludCg0KSx0aGlzLmxvY2FsSGVhZGVyT2Zmc2V0PWUucmVhZEludCg0KSx0aGlzLmlzRW5jcnlwdGVkKCkpdGhyb3cgbmV3IEVycm9yKFwiRW5jcnlwdGVkIHppcCBhcmUgbm90IHN1cHBvcnRlZFwiKTtlLnNraXAodCksdGhpcy5yZWFkRXh0cmFGaWVsZHMoZSksdGhpcy5wYXJzZVpJUDY0RXh0cmFGaWVsZChlKSx0aGlzLmZpbGVDb21tZW50PWUucmVhZERhdGEodGhpcy5maWxlQ29tbWVudExlbmd0aCl9LHByb2Nlc3NBdHRyaWJ1dGVzOmZ1bmN0aW9uKCl7dGhpcy51bml4UGVybWlzc2lvbnM9bnVsbCx0aGlzLmRvc1Blcm1pc3Npb25zPW51bGw7dmFyIGU9dGhpcy52ZXJzaW9uTWFkZUJ5Pj44O3RoaXMuZGlyPSEhKDE2JnRoaXMuZXh0ZXJuYWxGaWxlQXR0cmlidXRlcyksMD09ZSYmKHRoaXMuZG9zUGVybWlzc2lvbnM9NjMmdGhpcy5leHRlcm5hbEZpbGVBdHRyaWJ1dGVzKSwzPT1lJiYodGhpcy51bml4UGVybWlzc2lvbnM9dGhpcy5leHRlcm5hbEZpbGVBdHRyaWJ1dGVzPj4xNiY2NTUzNSksdGhpcy5kaXJ8fFwiL1wiIT09dGhpcy5maWxlTmFtZVN0ci5zbGljZSgtMSl8fCh0aGlzLmRpcj0hMCl9LHBhcnNlWklQNjRFeHRyYUZpZWxkOmZ1bmN0aW9uKCl7aWYodGhpcy5leHRyYUZpZWxkc1sxXSl7dmFyIGU9bih0aGlzLmV4dHJhRmllbGRzWzFdLnZhbHVlKTt0aGlzLnVuY29tcHJlc3NlZFNpemU9PT1zLk1BWF9WQUxVRV8zMkJJVFMmJih0aGlzLnVuY29tcHJlc3NlZFNpemU9ZS5yZWFkSW50KDgpKSx0aGlzLmNvbXByZXNzZWRTaXplPT09cy5NQVhfVkFMVUVfMzJCSVRTJiYodGhpcy5jb21wcmVzc2VkU2l6ZT1lLnJlYWRJbnQoOCkpLHRoaXMubG9jYWxIZWFkZXJPZmZzZXQ9PT1zLk1BWF9WQUxVRV8zMkJJVFMmJih0aGlzLmxvY2FsSGVhZGVyT2Zmc2V0PWUucmVhZEludCg4KSksdGhpcy5kaXNrTnVtYmVyU3RhcnQ9PT1zLk1BWF9WQUxVRV8zMkJJVFMmJih0aGlzLmRpc2tOdW1iZXJTdGFydD1lLnJlYWRJbnQoNCkpfX0scmVhZEV4dHJhRmllbGRzOmZ1bmN0aW9uKGUpe3ZhciB0LHIsbixpPWUuaW5kZXgrdGhpcy5leHRyYUZpZWxkc0xlbmd0aDtmb3IodGhpcy5leHRyYUZpZWxkc3x8KHRoaXMuZXh0cmFGaWVsZHM9e30pO2UuaW5kZXgrNDxpOyl0PWUucmVhZEludCgyKSxyPWUucmVhZEludCgyKSxuPWUucmVhZERhdGEociksdGhpcy5leHRyYUZpZWxkc1t0XT17aWQ6dCxsZW5ndGg6cix2YWx1ZTpufTtlLnNldEluZGV4KGkpfSxoYW5kbGVVVEY4OmZ1bmN0aW9uKCl7dmFyIGU9dS51aW50OGFycmF5P1widWludDhhcnJheVwiOlwiYXJyYXlcIjtpZih0aGlzLnVzZVVURjgoKSl0aGlzLmZpbGVOYW1lU3RyPW8udXRmOGRlY29kZSh0aGlzLmZpbGVOYW1lKSx0aGlzLmZpbGVDb21tZW50U3RyPW8udXRmOGRlY29kZSh0aGlzLmZpbGVDb21tZW50KTtlbHNle3ZhciB0PXRoaXMuZmluZEV4dHJhRmllbGRVbmljb2RlUGF0aCgpO2lmKG51bGwhPT10KXRoaXMuZmlsZU5hbWVTdHI9dDtlbHNle3ZhciByPXMudHJhbnNmb3JtVG8oZSx0aGlzLmZpbGVOYW1lKTt0aGlzLmZpbGVOYW1lU3RyPXRoaXMubG9hZE9wdGlvbnMuZGVjb2RlRmlsZU5hbWUocil9dmFyIG49dGhpcy5maW5kRXh0cmFGaWVsZFVuaWNvZGVDb21tZW50KCk7aWYobnVsbCE9PW4pdGhpcy5maWxlQ29tbWVudFN0cj1uO2Vsc2V7dmFyIGk9cy50cmFuc2Zvcm1UbyhlLHRoaXMuZmlsZUNvbW1lbnQpO3RoaXMuZmlsZUNvbW1lbnRTdHI9dGhpcy5sb2FkT3B0aW9ucy5kZWNvZGVGaWxlTmFtZShpKX19fSxmaW5kRXh0cmFGaWVsZFVuaWNvZGVQYXRoOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5leHRyYUZpZWxkc1syODc4OV07aWYoZSl7dmFyIHQ9bihlLnZhbHVlKTtyZXR1cm4gMSE9PXQucmVhZEludCgxKT9udWxsOmEodGhpcy5maWxlTmFtZSkhPT10LnJlYWRJbnQoNCk/bnVsbDpvLnV0ZjhkZWNvZGUodC5yZWFkRGF0YShlLmxlbmd0aC01KSl9cmV0dXJuIG51bGx9LGZpbmRFeHRyYUZpZWxkVW5pY29kZUNvbW1lbnQ6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmV4dHJhRmllbGRzWzI1NDYxXTtpZihlKXt2YXIgdD1uKGUudmFsdWUpO3JldHVybiAxIT09dC5yZWFkSW50KDEpP251bGw6YSh0aGlzLmZpbGVDb21tZW50KSE9PXQucmVhZEludCg0KT9udWxsOm8udXRmOGRlY29kZSh0LnJlYWREYXRhKGUubGVuZ3RoLTUpKX1yZXR1cm4gbnVsbH19LHQuZXhwb3J0cz1sfSx7XCIuL2NvbXByZXNzZWRPYmplY3RcIjoyLFwiLi9jb21wcmVzc2lvbnNcIjozLFwiLi9jcmMzMlwiOjQsXCIuL3JlYWRlci9yZWFkZXJGb3JcIjoyMixcIi4vc3VwcG9ydFwiOjMwLFwiLi91dGY4XCI6MzEsXCIuL3V0aWxzXCI6MzJ9XSwzNTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4oZSx0LHIpe3RoaXMubmFtZT1lLHRoaXMuZGlyPXIuZGlyLHRoaXMuZGF0ZT1yLmRhdGUsdGhpcy5jb21tZW50PXIuY29tbWVudCx0aGlzLnVuaXhQZXJtaXNzaW9ucz1yLnVuaXhQZXJtaXNzaW9ucyx0aGlzLmRvc1Blcm1pc3Npb25zPXIuZG9zUGVybWlzc2lvbnMsdGhpcy5fZGF0YT10LHRoaXMuX2RhdGFCaW5hcnk9ci5iaW5hcnksdGhpcy5vcHRpb25zPXtjb21wcmVzc2lvbjpyLmNvbXByZXNzaW9uLGNvbXByZXNzaW9uT3B0aW9uczpyLmNvbXByZXNzaW9uT3B0aW9uc319dmFyIHM9ZShcIi4vc3RyZWFtL1N0cmVhbUhlbHBlclwiKSxpPWUoXCIuL3N0cmVhbS9EYXRhV29ya2VyXCIpLGE9ZShcIi4vdXRmOFwiKSxvPWUoXCIuL2NvbXByZXNzZWRPYmplY3RcIiksaD1lKFwiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiKTtuLnByb3RvdHlwZT17aW50ZXJuYWxTdHJlYW06ZnVuY3Rpb24oZSl7dmFyIHQ9bnVsbCxyPVwic3RyaW5nXCI7dHJ5e2lmKCFlKXRocm93IG5ldyBFcnJvcihcIk5vIG91dHB1dCB0eXBlIHNwZWNpZmllZC5cIik7dmFyIG49XCJzdHJpbmdcIj09PShyPWUudG9Mb3dlckNhc2UoKSl8fFwidGV4dFwiPT09cjtcImJpbmFyeXN0cmluZ1wiIT09ciYmXCJ0ZXh0XCIhPT1yfHwocj1cInN0cmluZ1wiKSx0PXRoaXMuX2RlY29tcHJlc3NXb3JrZXIoKTt2YXIgaT0hdGhpcy5fZGF0YUJpbmFyeTtpJiYhbiYmKHQ9dC5waXBlKG5ldyBhLlV0ZjhFbmNvZGVXb3JrZXIpKSwhaSYmbiYmKHQ9dC5waXBlKG5ldyBhLlV0ZjhEZWNvZGVXb3JrZXIpKX1jYXRjaChlKXsodD1uZXcgaChcImVycm9yXCIpKS5lcnJvcihlKX1yZXR1cm4gbmV3IHModCxyLFwiXCIpfSxhc3luYzpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmludGVybmFsU3RyZWFtKGUpLmFjY3VtdWxhdGUodCl9LG5vZGVTdHJlYW06ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5pbnRlcm5hbFN0cmVhbShlfHxcIm5vZGVidWZmZXJcIikudG9Ob2RlanNTdHJlYW0odCl9LF9jb21wcmVzc1dvcmtlcjpmdW5jdGlvbihlLHQpe2lmKHRoaXMuX2RhdGEgaW5zdGFuY2VvZiBvJiZ0aGlzLl9kYXRhLmNvbXByZXNzaW9uLm1hZ2ljPT09ZS5tYWdpYylyZXR1cm4gdGhpcy5fZGF0YS5nZXRDb21wcmVzc2VkV29ya2VyKCk7dmFyIHI9dGhpcy5fZGVjb21wcmVzc1dvcmtlcigpO3JldHVybiB0aGlzLl9kYXRhQmluYXJ5fHwocj1yLnBpcGUobmV3IGEuVXRmOEVuY29kZVdvcmtlcikpLG8uY3JlYXRlV29ya2VyRnJvbShyLGUsdCl9LF9kZWNvbXByZXNzV29ya2VyOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2RhdGEgaW5zdGFuY2VvZiBvP3RoaXMuX2RhdGEuZ2V0Q29udGVudFdvcmtlcigpOnRoaXMuX2RhdGEgaW5zdGFuY2VvZiBoP3RoaXMuX2RhdGE6bmV3IGkodGhpcy5fZGF0YSl9fTtmb3IodmFyIHU9W1wiYXNUZXh0XCIsXCJhc0JpbmFyeVwiLFwiYXNOb2RlQnVmZmVyXCIsXCJhc1VpbnQ4QXJyYXlcIixcImFzQXJyYXlCdWZmZXJcIl0sbD1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihcIlRoaXMgbWV0aG9kIGhhcyBiZWVuIHJlbW92ZWQgaW4gSlNaaXAgMy4wLCBwbGVhc2UgY2hlY2sgdGhlIHVwZ3JhZGUgZ3VpZGUuXCIpfSxmPTA7Zjx1Lmxlbmd0aDtmKyspbi5wcm90b3R5cGVbdVtmXV09bDt0LmV4cG9ydHM9bn0se1wiLi9jb21wcmVzc2VkT2JqZWN0XCI6MixcIi4vc3RyZWFtL0RhdGFXb3JrZXJcIjoyNyxcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIjoyOCxcIi4vc3RyZWFtL1N0cmVhbUhlbHBlclwiOjI5LFwiLi91dGY4XCI6MzF9XSwzNjpbZnVuY3Rpb24oZSxsLHQpeyhmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjt2YXIgcixuLGU9dC5NdXRhdGlvbk9ic2VydmVyfHx0LldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7aWYoZSl7dmFyIGk9MCxzPW5ldyBlKHUpLGE9dC5kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtzLm9ic2VydmUoYSx7Y2hhcmFjdGVyRGF0YTohMH0pLHI9ZnVuY3Rpb24oKXthLmRhdGE9aT0rK2klMn19ZWxzZSBpZih0LnNldEltbWVkaWF0ZXx8dm9pZCAwPT09dC5NZXNzYWdlQ2hhbm5lbClyPVwiZG9jdW1lbnRcImluIHQmJlwib25yZWFkeXN0YXRlY2hhbmdlXCJpbiB0LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik/ZnVuY3Rpb24oKXt2YXIgZT10LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7ZS5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXt1KCksZS5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZSksZT1udWxsfSx0LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChlKX06ZnVuY3Rpb24oKXtzZXRUaW1lb3V0KHUsMCl9O2Vsc2V7dmFyIG89bmV3IHQuTWVzc2FnZUNoYW5uZWw7by5wb3J0MS5vbm1lc3NhZ2U9dSxyPWZ1bmN0aW9uKCl7by5wb3J0Mi5wb3N0TWVzc2FnZSgwKX19dmFyIGg9W107ZnVuY3Rpb24gdSgpe3ZhciBlLHQ7bj0hMDtmb3IodmFyIHI9aC5sZW5ndGg7cjspe2Zvcih0PWgsaD1bXSxlPS0xOysrZTxyOyl0W2VdKCk7cj1oLmxlbmd0aH1uPSExfWwuZXhwb3J0cz1mdW5jdGlvbihlKXsxIT09aC5wdXNoKGUpfHxufHxyKCl9fSkuY2FsbCh0aGlzLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6e30pfSx7fV0sMzc6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaT1lKFwiaW1tZWRpYXRlXCIpO2Z1bmN0aW9uIHUoKXt9dmFyIGw9e30scz1bXCJSRUpFQ1RFRFwiXSxhPVtcIkZVTEZJTExFRFwiXSxuPVtcIlBFTkRJTkdcIl07ZnVuY3Rpb24gbyhlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlKXRocm93IG5ldyBUeXBlRXJyb3IoXCJyZXNvbHZlciBtdXN0IGJlIGEgZnVuY3Rpb25cIik7dGhpcy5zdGF0ZT1uLHRoaXMucXVldWU9W10sdGhpcy5vdXRjb21lPXZvaWQgMCxlIT09dSYmZCh0aGlzLGUpfWZ1bmN0aW9uIGgoZSx0LHIpe3RoaXMucHJvbWlzZT1lLFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJih0aGlzLm9uRnVsZmlsbGVkPXQsdGhpcy5jYWxsRnVsZmlsbGVkPXRoaXMub3RoZXJDYWxsRnVsZmlsbGVkKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYodGhpcy5vblJlamVjdGVkPXIsdGhpcy5jYWxsUmVqZWN0ZWQ9dGhpcy5vdGhlckNhbGxSZWplY3RlZCl9ZnVuY3Rpb24gZih0LHIsbil7aShmdW5jdGlvbigpe3ZhciBlO3RyeXtlPXIobil9Y2F0Y2goZSl7cmV0dXJuIGwucmVqZWN0KHQsZSl9ZT09PXQ/bC5yZWplY3QodCxuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHJlc29sdmUgcHJvbWlzZSB3aXRoIGl0c2VsZlwiKSk6bC5yZXNvbHZlKHQsZSl9KX1mdW5jdGlvbiBjKGUpe3ZhciB0PWUmJmUudGhlbjtpZihlJiYoXCJvYmplY3RcIj09dHlwZW9mIGV8fFwiZnVuY3Rpb25cIj09dHlwZW9mIGUpJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0KXJldHVybiBmdW5jdGlvbigpe3QuYXBwbHkoZSxhcmd1bWVudHMpfX1mdW5jdGlvbiBkKHQsZSl7dmFyIHI9ITE7ZnVuY3Rpb24gbihlKXtyfHwocj0hMCxsLnJlamVjdCh0LGUpKX1mdW5jdGlvbiBpKGUpe3J8fChyPSEwLGwucmVzb2x2ZSh0LGUpKX12YXIgcz1wKGZ1bmN0aW9uKCl7ZShpLG4pfSk7XCJlcnJvclwiPT09cy5zdGF0dXMmJm4ocy52YWx1ZSl9ZnVuY3Rpb24gcChlLHQpe3ZhciByPXt9O3RyeXtyLnZhbHVlPWUodCksci5zdGF0dXM9XCJzdWNjZXNzXCJ9Y2F0Y2goZSl7ci5zdGF0dXM9XCJlcnJvclwiLHIudmFsdWU9ZX1yZXR1cm4gcn0odC5leHBvcnRzPW8pLnByb3RvdHlwZS5maW5hbGx5PWZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJuIHRoaXM7dmFyIHI9dGhpcy5jb25zdHJ1Y3RvcjtyZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uKGUpe3JldHVybiByLnJlc29sdmUodCgpKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIGV9KX0sZnVuY3Rpb24oZSl7cmV0dXJuIHIucmVzb2x2ZSh0KCkpLnRoZW4oZnVuY3Rpb24oKXt0aHJvdyBlfSl9KX0sby5wcm90b3R5cGUuY2F0Y2g9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMudGhlbihudWxsLGUpfSxvLnByb3RvdHlwZS50aGVuPWZ1bmN0aW9uKGUsdCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmdGhpcy5zdGF0ZT09PWF8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQmJnRoaXMuc3RhdGU9PT1zKXJldHVybiB0aGlzO3ZhciByPW5ldyB0aGlzLmNvbnN0cnVjdG9yKHUpO3RoaXMuc3RhdGUhPT1uP2Yocix0aGlzLnN0YXRlPT09YT9lOnQsdGhpcy5vdXRjb21lKTp0aGlzLnF1ZXVlLnB1c2gobmV3IGgocixlLHQpKTtyZXR1cm4gcn0saC5wcm90b3R5cGUuY2FsbEZ1bGZpbGxlZD1mdW5jdGlvbihlKXtsLnJlc29sdmUodGhpcy5wcm9taXNlLGUpfSxoLnByb3RvdHlwZS5vdGhlckNhbGxGdWxmaWxsZWQ9ZnVuY3Rpb24oZSl7Zih0aGlzLnByb21pc2UsdGhpcy5vbkZ1bGZpbGxlZCxlKX0saC5wcm90b3R5cGUuY2FsbFJlamVjdGVkPWZ1bmN0aW9uKGUpe2wucmVqZWN0KHRoaXMucHJvbWlzZSxlKX0saC5wcm90b3R5cGUub3RoZXJDYWxsUmVqZWN0ZWQ9ZnVuY3Rpb24oZSl7Zih0aGlzLnByb21pc2UsdGhpcy5vblJlamVjdGVkLGUpfSxsLnJlc29sdmU9ZnVuY3Rpb24oZSx0KXt2YXIgcj1wKGMsdCk7aWYoXCJlcnJvclwiPT09ci5zdGF0dXMpcmV0dXJuIGwucmVqZWN0KGUsci52YWx1ZSk7dmFyIG49ci52YWx1ZTtpZihuKWQoZSxuKTtlbHNle2Uuc3RhdGU9YSxlLm91dGNvbWU9dDtmb3IodmFyIGk9LTEscz1lLnF1ZXVlLmxlbmd0aDsrK2k8czspZS5xdWV1ZVtpXS5jYWxsRnVsZmlsbGVkKHQpfXJldHVybiBlfSxsLnJlamVjdD1mdW5jdGlvbihlLHQpe2Uuc3RhdGU9cyxlLm91dGNvbWU9dDtmb3IodmFyIHI9LTEsbj1lLnF1ZXVlLmxlbmd0aDsrK3I8bjspZS5xdWV1ZVtyXS5jYWxsUmVqZWN0ZWQodCk7cmV0dXJuIGV9LG8ucmVzb2x2ZT1mdW5jdGlvbihlKXtpZihlIGluc3RhbmNlb2YgdGhpcylyZXR1cm4gZTtyZXR1cm4gbC5yZXNvbHZlKG5ldyB0aGlzKHUpLGUpfSxvLnJlamVjdD1mdW5jdGlvbihlKXt2YXIgdD1uZXcgdGhpcyh1KTtyZXR1cm4gbC5yZWplY3QodCxlKX0sby5hbGw9ZnVuY3Rpb24oZSl7dmFyIHI9dGhpcztpZihcIltvYmplY3QgQXJyYXldXCIhPT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSkpcmV0dXJuIHRoaXMucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJtdXN0IGJlIGFuIGFycmF5XCIpKTt2YXIgbj1lLmxlbmd0aCxpPSExO2lmKCFuKXJldHVybiB0aGlzLnJlc29sdmUoW10pO3ZhciBzPW5ldyBBcnJheShuKSxhPTAsdD0tMSxvPW5ldyB0aGlzKHUpO2Zvcig7Kyt0PG47KWgoZVt0XSx0KTtyZXR1cm4gbztmdW5jdGlvbiBoKGUsdCl7ci5yZXNvbHZlKGUpLnRoZW4oZnVuY3Rpb24oZSl7c1t0XT1lLCsrYSE9PW58fGl8fChpPSEwLGwucmVzb2x2ZShvLHMpKX0sZnVuY3Rpb24oZSl7aXx8KGk9ITAsbC5yZWplY3QobyxlKSl9KX19LG8ucmFjZT1mdW5jdGlvbihlKXt2YXIgdD10aGlzO2lmKFwiW29iamVjdCBBcnJheV1cIiE9PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKSlyZXR1cm4gdGhpcy5yZWplY3QobmV3IFR5cGVFcnJvcihcIm11c3QgYmUgYW4gYXJyYXlcIikpO3ZhciByPWUubGVuZ3RoLG49ITE7aWYoIXIpcmV0dXJuIHRoaXMucmVzb2x2ZShbXSk7dmFyIGk9LTEscz1uZXcgdGhpcyh1KTtmb3IoOysraTxyOylhPWVbaV0sdC5yZXNvbHZlKGEpLnRoZW4oZnVuY3Rpb24oZSl7bnx8KG49ITAsbC5yZXNvbHZlKHMsZSkpfSxmdW5jdGlvbihlKXtufHwobj0hMCxsLnJlamVjdChzLGUpKX0pO3ZhciBhO3JldHVybiBzfX0se2ltbWVkaWF0ZTozNn1dLDM4OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49e307KDAsZShcIi4vbGliL3V0aWxzL2NvbW1vblwiKS5hc3NpZ24pKG4sZShcIi4vbGliL2RlZmxhdGVcIiksZShcIi4vbGliL2luZmxhdGVcIiksZShcIi4vbGliL3psaWIvY29uc3RhbnRzXCIpKSx0LmV4cG9ydHM9bn0se1wiLi9saWIvZGVmbGF0ZVwiOjM5LFwiLi9saWIvaW5mbGF0ZVwiOjQwLFwiLi9saWIvdXRpbHMvY29tbW9uXCI6NDEsXCIuL2xpYi96bGliL2NvbnN0YW50c1wiOjQ0fV0sMzk6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgYT1lKFwiLi96bGliL2RlZmxhdGVcIiksbz1lKFwiLi91dGlscy9jb21tb25cIiksaD1lKFwiLi91dGlscy9zdHJpbmdzXCIpLGk9ZShcIi4vemxpYi9tZXNzYWdlc1wiKSxzPWUoXCIuL3psaWIvenN0cmVhbVwiKSx1PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsbD0wLGY9LTEsYz0wLGQ9ODtmdW5jdGlvbiBwKGUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIHApKXJldHVybiBuZXcgcChlKTt0aGlzLm9wdGlvbnM9by5hc3NpZ24oe2xldmVsOmYsbWV0aG9kOmQsY2h1bmtTaXplOjE2Mzg0LHdpbmRvd0JpdHM6MTUsbWVtTGV2ZWw6OCxzdHJhdGVneTpjLHRvOlwiXCJ9LGV8fHt9KTt2YXIgdD10aGlzLm9wdGlvbnM7dC5yYXcmJjA8dC53aW5kb3dCaXRzP3Qud2luZG93Qml0cz0tdC53aW5kb3dCaXRzOnQuZ3ppcCYmMDx0LndpbmRvd0JpdHMmJnQud2luZG93Qml0czwxNiYmKHQud2luZG93Qml0cys9MTYpLHRoaXMuZXJyPTAsdGhpcy5tc2c9XCJcIix0aGlzLmVuZGVkPSExLHRoaXMuY2h1bmtzPVtdLHRoaXMuc3RybT1uZXcgcyx0aGlzLnN0cm0uYXZhaWxfb3V0PTA7dmFyIHI9YS5kZWZsYXRlSW5pdDIodGhpcy5zdHJtLHQubGV2ZWwsdC5tZXRob2QsdC53aW5kb3dCaXRzLHQubWVtTGV2ZWwsdC5zdHJhdGVneSk7aWYociE9PWwpdGhyb3cgbmV3IEVycm9yKGlbcl0pO2lmKHQuaGVhZGVyJiZhLmRlZmxhdGVTZXRIZWFkZXIodGhpcy5zdHJtLHQuaGVhZGVyKSx0LmRpY3Rpb25hcnkpe3ZhciBuO2lmKG49XCJzdHJpbmdcIj09dHlwZW9mIHQuZGljdGlvbmFyeT9oLnN0cmluZzJidWYodC5kaWN0aW9uYXJ5KTpcIltvYmplY3QgQXJyYXlCdWZmZXJdXCI9PT11LmNhbGwodC5kaWN0aW9uYXJ5KT9uZXcgVWludDhBcnJheSh0LmRpY3Rpb25hcnkpOnQuZGljdGlvbmFyeSwocj1hLmRlZmxhdGVTZXREaWN0aW9uYXJ5KHRoaXMuc3RybSxuKSkhPT1sKXRocm93IG5ldyBFcnJvcihpW3JdKTt0aGlzLl9kaWN0X3NldD0hMH19ZnVuY3Rpb24gbihlLHQpe3ZhciByPW5ldyBwKHQpO2lmKHIucHVzaChlLCEwKSxyLmVycil0aHJvdyByLm1zZ3x8aVtyLmVycl07cmV0dXJuIHIucmVzdWx0fXAucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oZSx0KXt2YXIgcixuLGk9dGhpcy5zdHJtLHM9dGhpcy5vcHRpb25zLmNodW5rU2l6ZTtpZih0aGlzLmVuZGVkKXJldHVybiExO249dD09PX5+dD90OiEwPT09dD80OjAsXCJzdHJpbmdcIj09dHlwZW9mIGU/aS5pbnB1dD1oLnN0cmluZzJidWYoZSk6XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiPT09dS5jYWxsKGUpP2kuaW5wdXQ9bmV3IFVpbnQ4QXJyYXkoZSk6aS5pbnB1dD1lLGkubmV4dF9pbj0wLGkuYXZhaWxfaW49aS5pbnB1dC5sZW5ndGg7ZG97aWYoMD09PWkuYXZhaWxfb3V0JiYoaS5vdXRwdXQ9bmV3IG8uQnVmOChzKSxpLm5leHRfb3V0PTAsaS5hdmFpbF9vdXQ9cyksMSE9PShyPWEuZGVmbGF0ZShpLG4pKSYmciE9PWwpcmV0dXJuIHRoaXMub25FbmQociksISh0aGlzLmVuZGVkPSEwKTswIT09aS5hdmFpbF9vdXQmJigwIT09aS5hdmFpbF9pbnx8NCE9PW4mJjIhPT1uKXx8KFwic3RyaW5nXCI9PT10aGlzLm9wdGlvbnMudG8/dGhpcy5vbkRhdGEoaC5idWYyYmluc3RyaW5nKG8uc2hyaW5rQnVmKGkub3V0cHV0LGkubmV4dF9vdXQpKSk6dGhpcy5vbkRhdGEoby5zaHJpbmtCdWYoaS5vdXRwdXQsaS5uZXh0X291dCkpKX13aGlsZSgoMDxpLmF2YWlsX2lufHwwPT09aS5hdmFpbF9vdXQpJiYxIT09cik7cmV0dXJuIDQ9PT1uPyhyPWEuZGVmbGF0ZUVuZCh0aGlzLnN0cm0pLHRoaXMub25FbmQociksdGhpcy5lbmRlZD0hMCxyPT09bCk6MiE9PW58fCh0aGlzLm9uRW5kKGwpLCEoaS5hdmFpbF9vdXQ9MCkpfSxwLnByb3RvdHlwZS5vbkRhdGE9ZnVuY3Rpb24oZSl7dGhpcy5jaHVua3MucHVzaChlKX0scC5wcm90b3R5cGUub25FbmQ9ZnVuY3Rpb24oZSl7ZT09PWwmJihcInN0cmluZ1wiPT09dGhpcy5vcHRpb25zLnRvP3RoaXMucmVzdWx0PXRoaXMuY2h1bmtzLmpvaW4oXCJcIik6dGhpcy5yZXN1bHQ9by5mbGF0dGVuQ2h1bmtzKHRoaXMuY2h1bmtzKSksdGhpcy5jaHVua3M9W10sdGhpcy5lcnI9ZSx0aGlzLm1zZz10aGlzLnN0cm0ubXNnfSxyLkRlZmxhdGU9cCxyLmRlZmxhdGU9bixyLmRlZmxhdGVSYXc9ZnVuY3Rpb24oZSx0KXtyZXR1cm4odD10fHx7fSkucmF3PSEwLG4oZSx0KX0sci5nemlwPWZ1bmN0aW9uKGUsdCl7cmV0dXJuKHQ9dHx8e30pLmd6aXA9ITAsbihlLHQpfX0se1wiLi91dGlscy9jb21tb25cIjo0MSxcIi4vdXRpbHMvc3RyaW5nc1wiOjQyLFwiLi96bGliL2RlZmxhdGVcIjo0NixcIi4vemxpYi9tZXNzYWdlc1wiOjUxLFwiLi96bGliL3pzdHJlYW1cIjo1M31dLDQwOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGM9ZShcIi4vemxpYi9pbmZsYXRlXCIpLGQ9ZShcIi4vdXRpbHMvY29tbW9uXCIpLHA9ZShcIi4vdXRpbHMvc3RyaW5nc1wiKSxtPWUoXCIuL3psaWIvY29uc3RhbnRzXCIpLG49ZShcIi4vemxpYi9tZXNzYWdlc1wiKSxpPWUoXCIuL3psaWIvenN0cmVhbVwiKSxzPWUoXCIuL3psaWIvZ3poZWFkZXJcIiksXz1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO2Z1bmN0aW9uIGEoZSl7aWYoISh0aGlzIGluc3RhbmNlb2YgYSkpcmV0dXJuIG5ldyBhKGUpO3RoaXMub3B0aW9ucz1kLmFzc2lnbih7Y2h1bmtTaXplOjE2Mzg0LHdpbmRvd0JpdHM6MCx0bzpcIlwifSxlfHx7fSk7dmFyIHQ9dGhpcy5vcHRpb25zO3QucmF3JiYwPD10LndpbmRvd0JpdHMmJnQud2luZG93Qml0czwxNiYmKHQud2luZG93Qml0cz0tdC53aW5kb3dCaXRzLDA9PT10LndpbmRvd0JpdHMmJih0LndpbmRvd0JpdHM9LTE1KSksISgwPD10LndpbmRvd0JpdHMmJnQud2luZG93Qml0czwxNil8fGUmJmUud2luZG93Qml0c3x8KHQud2luZG93Qml0cys9MzIpLDE1PHQud2luZG93Qml0cyYmdC53aW5kb3dCaXRzPDQ4JiYwPT0oMTUmdC53aW5kb3dCaXRzKSYmKHQud2luZG93Qml0c3w9MTUpLHRoaXMuZXJyPTAsdGhpcy5tc2c9XCJcIix0aGlzLmVuZGVkPSExLHRoaXMuY2h1bmtzPVtdLHRoaXMuc3RybT1uZXcgaSx0aGlzLnN0cm0uYXZhaWxfb3V0PTA7dmFyIHI9Yy5pbmZsYXRlSW5pdDIodGhpcy5zdHJtLHQud2luZG93Qml0cyk7aWYociE9PW0uWl9PSyl0aHJvdyBuZXcgRXJyb3IobltyXSk7dGhpcy5oZWFkZXI9bmV3IHMsYy5pbmZsYXRlR2V0SGVhZGVyKHRoaXMuc3RybSx0aGlzLmhlYWRlcil9ZnVuY3Rpb24gbyhlLHQpe3ZhciByPW5ldyBhKHQpO2lmKHIucHVzaChlLCEwKSxyLmVycil0aHJvdyByLm1zZ3x8bltyLmVycl07cmV0dXJuIHIucmVzdWx0fWEucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oZSx0KXt2YXIgcixuLGkscyxhLG8saD10aGlzLnN0cm0sdT10aGlzLm9wdGlvbnMuY2h1bmtTaXplLGw9dGhpcy5vcHRpb25zLmRpY3Rpb25hcnksZj0hMTtpZih0aGlzLmVuZGVkKXJldHVybiExO249dD09PX5+dD90OiEwPT09dD9tLlpfRklOSVNIOm0uWl9OT19GTFVTSCxcInN0cmluZ1wiPT10eXBlb2YgZT9oLmlucHV0PXAuYmluc3RyaW5nMmJ1ZihlKTpcIltvYmplY3QgQXJyYXlCdWZmZXJdXCI9PT1fLmNhbGwoZSk/aC5pbnB1dD1uZXcgVWludDhBcnJheShlKTpoLmlucHV0PWUsaC5uZXh0X2luPTAsaC5hdmFpbF9pbj1oLmlucHV0Lmxlbmd0aDtkb3tpZigwPT09aC5hdmFpbF9vdXQmJihoLm91dHB1dD1uZXcgZC5CdWY4KHUpLGgubmV4dF9vdXQ9MCxoLmF2YWlsX291dD11KSwocj1jLmluZmxhdGUoaCxtLlpfTk9fRkxVU0gpKT09PW0uWl9ORUVEX0RJQ1QmJmwmJihvPVwic3RyaW5nXCI9PXR5cGVvZiBsP3Auc3RyaW5nMmJ1ZihsKTpcIltvYmplY3QgQXJyYXlCdWZmZXJdXCI9PT1fLmNhbGwobCk/bmV3IFVpbnQ4QXJyYXkobCk6bCxyPWMuaW5mbGF0ZVNldERpY3Rpb25hcnkodGhpcy5zdHJtLG8pKSxyPT09bS5aX0JVRl9FUlJPUiYmITA9PT1mJiYocj1tLlpfT0ssZj0hMSksciE9PW0uWl9TVFJFQU1fRU5EJiZyIT09bS5aX09LKXJldHVybiB0aGlzLm9uRW5kKHIpLCEodGhpcy5lbmRlZD0hMCk7aC5uZXh0X291dCYmKDAhPT1oLmF2YWlsX291dCYmciE9PW0uWl9TVFJFQU1fRU5EJiYoMCE9PWguYXZhaWxfaW58fG4hPT1tLlpfRklOSVNIJiZuIT09bS5aX1NZTkNfRkxVU0gpfHwoXCJzdHJpbmdcIj09PXRoaXMub3B0aW9ucy50bz8oaT1wLnV0Zjhib3JkZXIoaC5vdXRwdXQsaC5uZXh0X291dCkscz1oLm5leHRfb3V0LWksYT1wLmJ1ZjJzdHJpbmcoaC5vdXRwdXQsaSksaC5uZXh0X291dD1zLGguYXZhaWxfb3V0PXUtcyxzJiZkLmFycmF5U2V0KGgub3V0cHV0LGgub3V0cHV0LGkscywwKSx0aGlzLm9uRGF0YShhKSk6dGhpcy5vbkRhdGEoZC5zaHJpbmtCdWYoaC5vdXRwdXQsaC5uZXh0X291dCkpKSksMD09PWguYXZhaWxfaW4mJjA9PT1oLmF2YWlsX291dCYmKGY9ITApfXdoaWxlKCgwPGguYXZhaWxfaW58fDA9PT1oLmF2YWlsX291dCkmJnIhPT1tLlpfU1RSRUFNX0VORCk7cmV0dXJuIHI9PT1tLlpfU1RSRUFNX0VORCYmKG49bS5aX0ZJTklTSCksbj09PW0uWl9GSU5JU0g/KHI9Yy5pbmZsYXRlRW5kKHRoaXMuc3RybSksdGhpcy5vbkVuZChyKSx0aGlzLmVuZGVkPSEwLHI9PT1tLlpfT0spOm4hPT1tLlpfU1lOQ19GTFVTSHx8KHRoaXMub25FbmQobS5aX09LKSwhKGguYXZhaWxfb3V0PTApKX0sYS5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKGUpe3RoaXMuY2h1bmtzLnB1c2goZSl9LGEucHJvdG90eXBlLm9uRW5kPWZ1bmN0aW9uKGUpe2U9PT1tLlpfT0smJihcInN0cmluZ1wiPT09dGhpcy5vcHRpb25zLnRvP3RoaXMucmVzdWx0PXRoaXMuY2h1bmtzLmpvaW4oXCJcIik6dGhpcy5yZXN1bHQ9ZC5mbGF0dGVuQ2h1bmtzKHRoaXMuY2h1bmtzKSksdGhpcy5jaHVua3M9W10sdGhpcy5lcnI9ZSx0aGlzLm1zZz10aGlzLnN0cm0ubXNnfSxyLkluZmxhdGU9YSxyLmluZmxhdGU9byxyLmluZmxhdGVSYXc9ZnVuY3Rpb24oZSx0KXtyZXR1cm4odD10fHx7fSkucmF3PSEwLG8oZSx0KX0sci51bmd6aXA9b30se1wiLi91dGlscy9jb21tb25cIjo0MSxcIi4vdXRpbHMvc3RyaW5nc1wiOjQyLFwiLi96bGliL2NvbnN0YW50c1wiOjQ0LFwiLi96bGliL2d6aGVhZGVyXCI6NDcsXCIuL3psaWIvaW5mbGF0ZVwiOjQ5LFwiLi96bGliL21lc3NhZ2VzXCI6NTEsXCIuL3psaWIvenN0cmVhbVwiOjUzfV0sNDE6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1cInVuZGVmaW5lZFwiIT10eXBlb2YgVWludDhBcnJheSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQxNkFycmF5JiZcInVuZGVmaW5lZFwiIT10eXBlb2YgSW50MzJBcnJheTtyLmFzc2lnbj1mdW5jdGlvbihlKXtmb3IodmFyIHQ9QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpO3QubGVuZ3RoOyl7dmFyIHI9dC5zaGlmdCgpO2lmKHIpe2lmKFwib2JqZWN0XCIhPXR5cGVvZiByKXRocm93IG5ldyBUeXBlRXJyb3IocitcIm11c3QgYmUgbm9uLW9iamVjdFwiKTtmb3IodmFyIG4gaW4gcilyLmhhc093blByb3BlcnR5KG4pJiYoZVtuXT1yW25dKX19cmV0dXJuIGV9LHIuc2hyaW5rQnVmPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUubGVuZ3RoPT09dD9lOmUuc3ViYXJyYXk/ZS5zdWJhcnJheSgwLHQpOihlLmxlbmd0aD10LGUpfTt2YXIgaT17YXJyYXlTZXQ6ZnVuY3Rpb24oZSx0LHIsbixpKXtpZih0LnN1YmFycmF5JiZlLnN1YmFycmF5KWUuc2V0KHQuc3ViYXJyYXkocixyK24pLGkpO2Vsc2UgZm9yKHZhciBzPTA7czxuO3MrKyllW2krc109dFtyK3NdfSxmbGF0dGVuQ2h1bmtzOmZ1bmN0aW9uKGUpe3ZhciB0LHIsbixpLHMsYTtmb3IodD1uPTAscj1lLmxlbmd0aDt0PHI7dCsrKW4rPWVbdF0ubGVuZ3RoO2ZvcihhPW5ldyBVaW50OEFycmF5KG4pLHQ9aT0wLHI9ZS5sZW5ndGg7dDxyO3QrKylzPWVbdF0sYS5zZXQocyxpKSxpKz1zLmxlbmd0aDtyZXR1cm4gYX19LHM9e2FycmF5U2V0OmZ1bmN0aW9uKGUsdCxyLG4saSl7Zm9yKHZhciBzPTA7czxuO3MrKyllW2krc109dFtyK3NdfSxmbGF0dGVuQ2h1bmtzOmZ1bmN0aW9uKGUpe3JldHVybltdLmNvbmNhdC5hcHBseShbXSxlKX19O3Iuc2V0VHlwZWQ9ZnVuY3Rpb24oZSl7ZT8oci5CdWY4PVVpbnQ4QXJyYXksci5CdWYxNj1VaW50MTZBcnJheSxyLkJ1ZjMyPUludDMyQXJyYXksci5hc3NpZ24ocixpKSk6KHIuQnVmOD1BcnJheSxyLkJ1ZjE2PUFycmF5LHIuQnVmMzI9QXJyYXksci5hc3NpZ24ocixzKSl9LHIuc2V0VHlwZWQobil9LHt9XSw0MjpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBoPWUoXCIuL2NvbW1vblwiKSxpPSEwLHM9ITA7dHJ5e1N0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxbMF0pfWNhdGNoKGUpe2k9ITF9dHJ5e1N0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxuZXcgVWludDhBcnJheSgxKSl9Y2F0Y2goZSl7cz0hMX1mb3IodmFyIHU9bmV3IGguQnVmOCgyNTYpLG49MDtuPDI1NjtuKyspdVtuXT0yNTI8PW4/NjoyNDg8PW4/NToyNDA8PW4/NDoyMjQ8PW4/MzoxOTI8PW4/MjoxO2Z1bmN0aW9uIGwoZSx0KXtpZih0PDY1NTM3JiYoZS5zdWJhcnJheSYmc3x8IWUuc3ViYXJyYXkmJmkpKXJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsaC5zaHJpbmtCdWYoZSx0KSk7Zm9yKHZhciByPVwiXCIsbj0wO248dDtuKyspcis9U3RyaW5nLmZyb21DaGFyQ29kZShlW25dKTtyZXR1cm4gcn11WzI1NF09dVsyNTRdPTEsci5zdHJpbmcyYnVmPWZ1bmN0aW9uKGUpe3ZhciB0LHIsbixpLHMsYT1lLmxlbmd0aCxvPTA7Zm9yKGk9MDtpPGE7aSsrKTU1Mjk2PT0oNjQ1MTImKHI9ZS5jaGFyQ29kZUF0KGkpKSkmJmkrMTxhJiY1NjMyMD09KDY0NTEyJihuPWUuY2hhckNvZGVBdChpKzEpKSkmJihyPTY1NTM2KyhyLTU1Mjk2PDwxMCkrKG4tNTYzMjApLGkrKyksbys9cjwxMjg/MTpyPDIwNDg/MjpyPDY1NTM2PzM6NDtmb3IodD1uZXcgaC5CdWY4KG8pLGk9cz0wO3M8bztpKyspNTUyOTY9PSg2NDUxMiYocj1lLmNoYXJDb2RlQXQoaSkpKSYmaSsxPGEmJjU2MzIwPT0oNjQ1MTImKG49ZS5jaGFyQ29kZUF0KGkrMSkpKSYmKHI9NjU1MzYrKHItNTUyOTY8PDEwKSsobi01NjMyMCksaSsrKSxyPDEyOD90W3MrK109cjoocjwyMDQ4P3RbcysrXT0xOTJ8cj4+PjY6KHI8NjU1MzY/dFtzKytdPTIyNHxyPj4+MTI6KHRbcysrXT0yNDB8cj4+PjE4LHRbcysrXT0xMjh8cj4+PjEyJjYzKSx0W3MrK109MTI4fHI+Pj42JjYzKSx0W3MrK109MTI4fDYzJnIpO3JldHVybiB0fSxyLmJ1ZjJiaW5zdHJpbmc9ZnVuY3Rpb24oZSl7cmV0dXJuIGwoZSxlLmxlbmd0aCl9LHIuYmluc3RyaW5nMmJ1Zj1mdW5jdGlvbihlKXtmb3IodmFyIHQ9bmV3IGguQnVmOChlLmxlbmd0aCkscj0wLG49dC5sZW5ndGg7cjxuO3IrKyl0W3JdPWUuY2hhckNvZGVBdChyKTtyZXR1cm4gdH0sci5idWYyc3RyaW5nPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYT10fHxlLmxlbmd0aCxvPW5ldyBBcnJheSgyKmEpO2ZvcihyPW49MDtyPGE7KWlmKChpPWVbcisrXSk8MTI4KW9bbisrXT1pO2Vsc2UgaWYoNDwocz11W2ldKSlvW24rK109NjU1MzMscis9cy0xO2Vsc2V7Zm9yKGkmPTI9PT1zPzMxOjM9PT1zPzE1Ojc7MTxzJiZyPGE7KWk9aTw8Nnw2MyZlW3IrK10scy0tOzE8cz9vW24rK109NjU1MzM6aTw2NTUzNj9vW24rK109aTooaS09NjU1MzYsb1tuKytdPTU1Mjk2fGk+PjEwJjEwMjMsb1tuKytdPTU2MzIwfDEwMjMmaSl9cmV0dXJuIGwobyxuKX0sci51dGY4Ym9yZGVyPWZ1bmN0aW9uKGUsdCl7dmFyIHI7Zm9yKCh0PXR8fGUubGVuZ3RoKT5lLmxlbmd0aCYmKHQ9ZS5sZW5ndGgpLHI9dC0xOzA8PXImJjEyOD09KDE5MiZlW3JdKTspci0tO3JldHVybiByPDA/dDowPT09cj90OnIrdVtlW3JdXT50P3I6dH19LHtcIi4vY29tbW9uXCI6NDF9XSw0MzpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3QuZXhwb3J0cz1mdW5jdGlvbihlLHQscixuKXtmb3IodmFyIGk9NjU1MzUmZXwwLHM9ZT4+PjE2JjY1NTM1fDAsYT0wOzAhPT1yOyl7Zm9yKHItPWE9MmUzPHI/MmUzOnI7cz1zKyhpPWkrdFtuKytdfDApfDAsLS1hOyk7aSU9NjU1MjEscyU9NjU1MjF9cmV0dXJuIGl8czw8MTZ8MH19LHt9XSw0NDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3QuZXhwb3J0cz17Wl9OT19GTFVTSDowLFpfUEFSVElBTF9GTFVTSDoxLFpfU1lOQ19GTFVTSDoyLFpfRlVMTF9GTFVTSDozLFpfRklOSVNIOjQsWl9CTE9DSzo1LFpfVFJFRVM6NixaX09LOjAsWl9TVFJFQU1fRU5EOjEsWl9ORUVEX0RJQ1Q6MixaX0VSUk5POi0xLFpfU1RSRUFNX0VSUk9SOi0yLFpfREFUQV9FUlJPUjotMyxaX0JVRl9FUlJPUjotNSxaX05PX0NPTVBSRVNTSU9OOjAsWl9CRVNUX1NQRUVEOjEsWl9CRVNUX0NPTVBSRVNTSU9OOjksWl9ERUZBVUxUX0NPTVBSRVNTSU9OOi0xLFpfRklMVEVSRUQ6MSxaX0hVRkZNQU5fT05MWToyLFpfUkxFOjMsWl9GSVhFRDo0LFpfREVGQVVMVF9TVFJBVEVHWTowLFpfQklOQVJZOjAsWl9URVhUOjEsWl9VTktOT1dOOjIsWl9ERUZMQVRFRDo4fX0se31dLDQ1OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG89ZnVuY3Rpb24oKXtmb3IodmFyIGUsdD1bXSxyPTA7cjwyNTY7cisrKXtlPXI7Zm9yKHZhciBuPTA7bjw4O24rKyllPTEmZT8zOTg4MjkyMzg0XmU+Pj4xOmU+Pj4xO3Rbcl09ZX1yZXR1cm4gdH0oKTt0LmV4cG9ydHM9ZnVuY3Rpb24oZSx0LHIsbil7dmFyIGk9byxzPW4rcjtlXj0tMTtmb3IodmFyIGE9bjthPHM7YSsrKWU9ZT4+PjheaVsyNTUmKGVedFthXSldO3JldHVybi0xXmV9fSx7fV0sNDY6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaCxjPWUoXCIuLi91dGlscy9jb21tb25cIiksdT1lKFwiLi90cmVlc1wiKSxkPWUoXCIuL2FkbGVyMzJcIikscD1lKFwiLi9jcmMzMlwiKSxuPWUoXCIuL21lc3NhZ2VzXCIpLGw9MCxmPTQsbT0wLF89LTIsZz0tMSxiPTQsaT0yLHY9OCx5PTkscz0yODYsYT0zMCxvPTE5LHc9MipzKzEsaz0xNSx4PTMsUz0yNTgsej1TK3grMSxDPTQyLEU9MTEzLEE9MSxJPTIsTz0zLEI9NDtmdW5jdGlvbiBSKGUsdCl7cmV0dXJuIGUubXNnPW5bdF0sdH1mdW5jdGlvbiBUKGUpe3JldHVybihlPDwxKS0oNDxlPzk6MCl9ZnVuY3Rpb24gRChlKXtmb3IodmFyIHQ9ZS5sZW5ndGg7MDw9LS10OyllW3RdPTB9ZnVuY3Rpb24gRihlKXt2YXIgdD1lLnN0YXRlLHI9dC5wZW5kaW5nO3I+ZS5hdmFpbF9vdXQmJihyPWUuYXZhaWxfb3V0KSwwIT09ciYmKGMuYXJyYXlTZXQoZS5vdXRwdXQsdC5wZW5kaW5nX2J1Zix0LnBlbmRpbmdfb3V0LHIsZS5uZXh0X291dCksZS5uZXh0X291dCs9cix0LnBlbmRpbmdfb3V0Kz1yLGUudG90YWxfb3V0Kz1yLGUuYXZhaWxfb3V0LT1yLHQucGVuZGluZy09ciwwPT09dC5wZW5kaW5nJiYodC5wZW5kaW5nX291dD0wKSl9ZnVuY3Rpb24gTihlLHQpe3UuX3RyX2ZsdXNoX2Jsb2NrKGUsMDw9ZS5ibG9ja19zdGFydD9lLmJsb2NrX3N0YXJ0Oi0xLGUuc3Ryc3RhcnQtZS5ibG9ja19zdGFydCx0KSxlLmJsb2NrX3N0YXJ0PWUuc3Ryc3RhcnQsRihlLnN0cm0pfWZ1bmN0aW9uIFUoZSx0KXtlLnBlbmRpbmdfYnVmW2UucGVuZGluZysrXT10fWZ1bmN0aW9uIFAoZSx0KXtlLnBlbmRpbmdfYnVmW2UucGVuZGluZysrXT10Pj4+OCYyNTUsZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109MjU1JnR9ZnVuY3Rpb24gTChlLHQpe3ZhciByLG4saT1lLm1heF9jaGFpbl9sZW5ndGgscz1lLnN0cnN0YXJ0LGE9ZS5wcmV2X2xlbmd0aCxvPWUubmljZV9tYXRjaCxoPWUuc3Ryc3RhcnQ+ZS53X3NpemUtej9lLnN0cnN0YXJ0LShlLndfc2l6ZS16KTowLHU9ZS53aW5kb3csbD1lLndfbWFzayxmPWUucHJldixjPWUuc3Ryc3RhcnQrUyxkPXVbcythLTFdLHA9dVtzK2FdO2UucHJldl9sZW5ndGg+PWUuZ29vZF9tYXRjaCYmKGk+Pj0yKSxvPmUubG9va2FoZWFkJiYobz1lLmxvb2thaGVhZCk7ZG97aWYodVsocj10KSthXT09PXAmJnVbcithLTFdPT09ZCYmdVtyXT09PXVbc10mJnVbKytyXT09PXVbcysxXSl7cys9MixyKys7ZG97fXdoaWxlKHVbKytzXT09PXVbKytyXSYmdVsrK3NdPT09dVsrK3JdJiZ1Wysrc109PT11Wysrcl0mJnVbKytzXT09PXVbKytyXSYmdVsrK3NdPT09dVsrK3JdJiZ1Wysrc109PT11Wysrcl0mJnVbKytzXT09PXVbKytyXSYmdVsrK3NdPT09dVsrK3JdJiZzPGMpO2lmKG49Uy0oYy1zKSxzPWMtUyxhPG4pe2lmKGUubWF0Y2hfc3RhcnQ9dCxvPD0oYT1uKSlicmVhaztkPXVbcythLTFdLHA9dVtzK2FdfX19d2hpbGUoKHQ9Zlt0JmxdKT5oJiYwIT0tLWkpO3JldHVybiBhPD1lLmxvb2thaGVhZD9hOmUubG9va2FoZWFkfWZ1bmN0aW9uIGooZSl7dmFyIHQscixuLGkscyxhLG8saCx1LGwsZj1lLndfc2l6ZTtkb3tpZihpPWUud2luZG93X3NpemUtZS5sb29rYWhlYWQtZS5zdHJzdGFydCxlLnN0cnN0YXJ0Pj1mKyhmLXopKXtmb3IoYy5hcnJheVNldChlLndpbmRvdyxlLndpbmRvdyxmLGYsMCksZS5tYXRjaF9zdGFydC09ZixlLnN0cnN0YXJ0LT1mLGUuYmxvY2tfc3RhcnQtPWYsdD1yPWUuaGFzaF9zaXplO249ZS5oZWFkWy0tdF0sZS5oZWFkW3RdPWY8PW4/bi1mOjAsLS1yOyk7Zm9yKHQ9cj1mO249ZS5wcmV2Wy0tdF0sZS5wcmV2W3RdPWY8PW4/bi1mOjAsLS1yOyk7aSs9Zn1pZigwPT09ZS5zdHJtLmF2YWlsX2luKWJyZWFrO2lmKGE9ZS5zdHJtLG89ZS53aW5kb3csaD1lLnN0cnN0YXJ0K2UubG9va2FoZWFkLHU9aSxsPXZvaWQgMCxsPWEuYXZhaWxfaW4sdTxsJiYobD11KSxyPTA9PT1sPzA6KGEuYXZhaWxfaW4tPWwsYy5hcnJheVNldChvLGEuaW5wdXQsYS5uZXh0X2luLGwsaCksMT09PWEuc3RhdGUud3JhcD9hLmFkbGVyPWQoYS5hZGxlcixvLGwsaCk6Mj09PWEuc3RhdGUud3JhcCYmKGEuYWRsZXI9cChhLmFkbGVyLG8sbCxoKSksYS5uZXh0X2luKz1sLGEudG90YWxfaW4rPWwsbCksZS5sb29rYWhlYWQrPXIsZS5sb29rYWhlYWQrZS5pbnNlcnQ+PXgpZm9yKHM9ZS5zdHJzdGFydC1lLmluc2VydCxlLmluc19oPWUud2luZG93W3NdLGUuaW5zX2g9KGUuaW5zX2g8PGUuaGFzaF9zaGlmdF5lLndpbmRvd1tzKzFdKSZlLmhhc2hfbWFzaztlLmluc2VydCYmKGUuaW5zX2g9KGUuaW5zX2g8PGUuaGFzaF9zaGlmdF5lLndpbmRvd1tzK3gtMV0pJmUuaGFzaF9tYXNrLGUucHJldltzJmUud19tYXNrXT1lLmhlYWRbZS5pbnNfaF0sZS5oZWFkW2UuaW5zX2hdPXMscysrLGUuaW5zZXJ0LS0sIShlLmxvb2thaGVhZCtlLmluc2VydDx4KSk7KTt9d2hpbGUoZS5sb29rYWhlYWQ8eiYmMCE9PWUuc3RybS5hdmFpbF9pbil9ZnVuY3Rpb24gWihlLHQpe2Zvcih2YXIgcixuOzspe2lmKGUubG9va2FoZWFkPHope2lmKGooZSksZS5sb29rYWhlYWQ8eiYmdD09PWwpcmV0dXJuIEE7aWYoMD09PWUubG9va2FoZWFkKWJyZWFrfWlmKHI9MCxlLmxvb2thaGVhZD49eCYmKGUuaW5zX2g9KGUuaW5zX2g8PGUuaGFzaF9zaGlmdF5lLndpbmRvd1tlLnN0cnN0YXJ0K3gtMV0pJmUuaGFzaF9tYXNrLHI9ZS5wcmV2W2Uuc3Ryc3RhcnQmZS53X21hc2tdPWUuaGVhZFtlLmluc19oXSxlLmhlYWRbZS5pbnNfaF09ZS5zdHJzdGFydCksMCE9PXImJmUuc3Ryc3RhcnQtcjw9ZS53X3NpemUteiYmKGUubWF0Y2hfbGVuZ3RoPUwoZSxyKSksZS5tYXRjaF9sZW5ndGg+PXgpaWYobj11Ll90cl90YWxseShlLGUuc3Ryc3RhcnQtZS5tYXRjaF9zdGFydCxlLm1hdGNoX2xlbmd0aC14KSxlLmxvb2thaGVhZC09ZS5tYXRjaF9sZW5ndGgsZS5tYXRjaF9sZW5ndGg8PWUubWF4X2xhenlfbWF0Y2gmJmUubG9va2FoZWFkPj14KXtmb3IoZS5tYXRjaF9sZW5ndGgtLTtlLnN0cnN0YXJ0KyssZS5pbnNfaD0oZS5pbnNfaDw8ZS5oYXNoX3NoaWZ0XmUud2luZG93W2Uuc3Ryc3RhcnQreC0xXSkmZS5oYXNoX21hc2sscj1lLnByZXZbZS5zdHJzdGFydCZlLndfbWFza109ZS5oZWFkW2UuaW5zX2hdLGUuaGVhZFtlLmluc19oXT1lLnN0cnN0YXJ0LDAhPS0tZS5tYXRjaF9sZW5ndGg7KTtlLnN0cnN0YXJ0Kyt9ZWxzZSBlLnN0cnN0YXJ0Kz1lLm1hdGNoX2xlbmd0aCxlLm1hdGNoX2xlbmd0aD0wLGUuaW5zX2g9ZS53aW5kb3dbZS5zdHJzdGFydF0sZS5pbnNfaD0oZS5pbnNfaDw8ZS5oYXNoX3NoaWZ0XmUud2luZG93W2Uuc3Ryc3RhcnQrMV0pJmUuaGFzaF9tYXNrO2Vsc2Ugbj11Ll90cl90YWxseShlLDAsZS53aW5kb3dbZS5zdHJzdGFydF0pLGUubG9va2FoZWFkLS0sZS5zdHJzdGFydCsrO2lmKG4mJihOKGUsITEpLDA9PT1lLnN0cm0uYXZhaWxfb3V0KSlyZXR1cm4gQX1yZXR1cm4gZS5pbnNlcnQ9ZS5zdHJzdGFydDx4LTE/ZS5zdHJzdGFydDp4LTEsdD09PWY/KE4oZSwhMCksMD09PWUuc3RybS5hdmFpbF9vdXQ/TzpCKTplLmxhc3RfbGl0JiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCk/QTpJfWZ1bmN0aW9uIFcoZSx0KXtmb3IodmFyIHIsbixpOzspe2lmKGUubG9va2FoZWFkPHope2lmKGooZSksZS5sb29rYWhlYWQ8eiYmdD09PWwpcmV0dXJuIEE7aWYoMD09PWUubG9va2FoZWFkKWJyZWFrfWlmKHI9MCxlLmxvb2thaGVhZD49eCYmKGUuaW5zX2g9KGUuaW5zX2g8PGUuaGFzaF9zaGlmdF5lLndpbmRvd1tlLnN0cnN0YXJ0K3gtMV0pJmUuaGFzaF9tYXNrLHI9ZS5wcmV2W2Uuc3Ryc3RhcnQmZS53X21hc2tdPWUuaGVhZFtlLmluc19oXSxlLmhlYWRbZS5pbnNfaF09ZS5zdHJzdGFydCksZS5wcmV2X2xlbmd0aD1lLm1hdGNoX2xlbmd0aCxlLnByZXZfbWF0Y2g9ZS5tYXRjaF9zdGFydCxlLm1hdGNoX2xlbmd0aD14LTEsMCE9PXImJmUucHJldl9sZW5ndGg8ZS5tYXhfbGF6eV9tYXRjaCYmZS5zdHJzdGFydC1yPD1lLndfc2l6ZS16JiYoZS5tYXRjaF9sZW5ndGg9TChlLHIpLGUubWF0Y2hfbGVuZ3RoPD01JiYoMT09PWUuc3RyYXRlZ3l8fGUubWF0Y2hfbGVuZ3RoPT09eCYmNDA5NjxlLnN0cnN0YXJ0LWUubWF0Y2hfc3RhcnQpJiYoZS5tYXRjaF9sZW5ndGg9eC0xKSksZS5wcmV2X2xlbmd0aD49eCYmZS5tYXRjaF9sZW5ndGg8PWUucHJldl9sZW5ndGgpe2ZvcihpPWUuc3Ryc3RhcnQrZS5sb29rYWhlYWQteCxuPXUuX3RyX3RhbGx5KGUsZS5zdHJzdGFydC0xLWUucHJldl9tYXRjaCxlLnByZXZfbGVuZ3RoLXgpLGUubG9va2FoZWFkLT1lLnByZXZfbGVuZ3RoLTEsZS5wcmV2X2xlbmd0aC09MjsrK2Uuc3Ryc3RhcnQ8PWkmJihlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbZS5zdHJzdGFydCt4LTFdKSZlLmhhc2hfbWFzayxyPWUucHJldltlLnN0cnN0YXJ0JmUud19tYXNrXT1lLmhlYWRbZS5pbnNfaF0sZS5oZWFkW2UuaW5zX2hdPWUuc3Ryc3RhcnQpLDAhPS0tZS5wcmV2X2xlbmd0aDspO2lmKGUubWF0Y2hfYXZhaWxhYmxlPTAsZS5tYXRjaF9sZW5ndGg9eC0xLGUuc3Ryc3RhcnQrKyxuJiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCkpcmV0dXJuIEF9ZWxzZSBpZihlLm1hdGNoX2F2YWlsYWJsZSl7aWYoKG49dS5fdHJfdGFsbHkoZSwwLGUud2luZG93W2Uuc3Ryc3RhcnQtMV0pKSYmTihlLCExKSxlLnN0cnN0YXJ0KyssZS5sb29rYWhlYWQtLSwwPT09ZS5zdHJtLmF2YWlsX291dClyZXR1cm4gQX1lbHNlIGUubWF0Y2hfYXZhaWxhYmxlPTEsZS5zdHJzdGFydCsrLGUubG9va2FoZWFkLS19cmV0dXJuIGUubWF0Y2hfYXZhaWxhYmxlJiYobj11Ll90cl90YWxseShlLDAsZS53aW5kb3dbZS5zdHJzdGFydC0xXSksZS5tYXRjaF9hdmFpbGFibGU9MCksZS5pbnNlcnQ9ZS5zdHJzdGFydDx4LTE/ZS5zdHJzdGFydDp4LTEsdD09PWY/KE4oZSwhMCksMD09PWUuc3RybS5hdmFpbF9vdXQ/TzpCKTplLmxhc3RfbGl0JiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCk/QTpJfWZ1bmN0aW9uIE0oZSx0LHIsbixpKXt0aGlzLmdvb2RfbGVuZ3RoPWUsdGhpcy5tYXhfbGF6eT10LHRoaXMubmljZV9sZW5ndGg9cix0aGlzLm1heF9jaGFpbj1uLHRoaXMuZnVuYz1pfWZ1bmN0aW9uIEgoKXt0aGlzLnN0cm09bnVsbCx0aGlzLnN0YXR1cz0wLHRoaXMucGVuZGluZ19idWY9bnVsbCx0aGlzLnBlbmRpbmdfYnVmX3NpemU9MCx0aGlzLnBlbmRpbmdfb3V0PTAsdGhpcy5wZW5kaW5nPTAsdGhpcy53cmFwPTAsdGhpcy5nemhlYWQ9bnVsbCx0aGlzLmd6aW5kZXg9MCx0aGlzLm1ldGhvZD12LHRoaXMubGFzdF9mbHVzaD0tMSx0aGlzLndfc2l6ZT0wLHRoaXMud19iaXRzPTAsdGhpcy53X21hc2s9MCx0aGlzLndpbmRvdz1udWxsLHRoaXMud2luZG93X3NpemU9MCx0aGlzLnByZXY9bnVsbCx0aGlzLmhlYWQ9bnVsbCx0aGlzLmluc19oPTAsdGhpcy5oYXNoX3NpemU9MCx0aGlzLmhhc2hfYml0cz0wLHRoaXMuaGFzaF9tYXNrPTAsdGhpcy5oYXNoX3NoaWZ0PTAsdGhpcy5ibG9ja19zdGFydD0wLHRoaXMubWF0Y2hfbGVuZ3RoPTAsdGhpcy5wcmV2X21hdGNoPTAsdGhpcy5tYXRjaF9hdmFpbGFibGU9MCx0aGlzLnN0cnN0YXJ0PTAsdGhpcy5tYXRjaF9zdGFydD0wLHRoaXMubG9va2FoZWFkPTAsdGhpcy5wcmV2X2xlbmd0aD0wLHRoaXMubWF4X2NoYWluX2xlbmd0aD0wLHRoaXMubWF4X2xhenlfbWF0Y2g9MCx0aGlzLmxldmVsPTAsdGhpcy5zdHJhdGVneT0wLHRoaXMuZ29vZF9tYXRjaD0wLHRoaXMubmljZV9tYXRjaD0wLHRoaXMuZHluX2x0cmVlPW5ldyBjLkJ1ZjE2KDIqdyksdGhpcy5keW5fZHRyZWU9bmV3IGMuQnVmMTYoMiooMiphKzEpKSx0aGlzLmJsX3RyZWU9bmV3IGMuQnVmMTYoMiooMipvKzEpKSxEKHRoaXMuZHluX2x0cmVlKSxEKHRoaXMuZHluX2R0cmVlKSxEKHRoaXMuYmxfdHJlZSksdGhpcy5sX2Rlc2M9bnVsbCx0aGlzLmRfZGVzYz1udWxsLHRoaXMuYmxfZGVzYz1udWxsLHRoaXMuYmxfY291bnQ9bmV3IGMuQnVmMTYoaysxKSx0aGlzLmhlYXA9bmV3IGMuQnVmMTYoMipzKzEpLEQodGhpcy5oZWFwKSx0aGlzLmhlYXBfbGVuPTAsdGhpcy5oZWFwX21heD0wLHRoaXMuZGVwdGg9bmV3IGMuQnVmMTYoMipzKzEpLEQodGhpcy5kZXB0aCksdGhpcy5sX2J1Zj0wLHRoaXMubGl0X2J1ZnNpemU9MCx0aGlzLmxhc3RfbGl0PTAsdGhpcy5kX2J1Zj0wLHRoaXMub3B0X2xlbj0wLHRoaXMuc3RhdGljX2xlbj0wLHRoaXMubWF0Y2hlcz0wLHRoaXMuaW5zZXJ0PTAsdGhpcy5iaV9idWY9MCx0aGlzLmJpX3ZhbGlkPTB9ZnVuY3Rpb24gRyhlKXt2YXIgdDtyZXR1cm4gZSYmZS5zdGF0ZT8oZS50b3RhbF9pbj1lLnRvdGFsX291dD0wLGUuZGF0YV90eXBlPWksKHQ9ZS5zdGF0ZSkucGVuZGluZz0wLHQucGVuZGluZ19vdXQ9MCx0LndyYXA8MCYmKHQud3JhcD0tdC53cmFwKSx0LnN0YXR1cz10LndyYXA/QzpFLGUuYWRsZXI9Mj09PXQud3JhcD8wOjEsdC5sYXN0X2ZsdXNoPWwsdS5fdHJfaW5pdCh0KSxtKTpSKGUsXyl9ZnVuY3Rpb24gSyhlKXt2YXIgdD1HKGUpO3JldHVybiB0PT09bSYmZnVuY3Rpb24oZSl7ZS53aW5kb3dfc2l6ZT0yKmUud19zaXplLEQoZS5oZWFkKSxlLm1heF9sYXp5X21hdGNoPWhbZS5sZXZlbF0ubWF4X2xhenksZS5nb29kX21hdGNoPWhbZS5sZXZlbF0uZ29vZF9sZW5ndGgsZS5uaWNlX21hdGNoPWhbZS5sZXZlbF0ubmljZV9sZW5ndGgsZS5tYXhfY2hhaW5fbGVuZ3RoPWhbZS5sZXZlbF0ubWF4X2NoYWluLGUuc3Ryc3RhcnQ9MCxlLmJsb2NrX3N0YXJ0PTAsZS5sb29rYWhlYWQ9MCxlLmluc2VydD0wLGUubWF0Y2hfbGVuZ3RoPWUucHJldl9sZW5ndGg9eC0xLGUubWF0Y2hfYXZhaWxhYmxlPTAsZS5pbnNfaD0wfShlLnN0YXRlKSx0fWZ1bmN0aW9uIFkoZSx0LHIsbixpLHMpe2lmKCFlKXJldHVybiBfO3ZhciBhPTE7aWYodD09PWcmJih0PTYpLG48MD8oYT0wLG49LW4pOjE1PG4mJihhPTIsbi09MTYpLGk8MXx8eTxpfHxyIT09dnx8bjw4fHwxNTxufHx0PDB8fDk8dHx8czwwfHxiPHMpcmV0dXJuIFIoZSxfKTs4PT09biYmKG49OSk7dmFyIG89bmV3IEg7cmV0dXJuKGUuc3RhdGU9bykuc3RybT1lLG8ud3JhcD1hLG8uZ3poZWFkPW51bGwsby53X2JpdHM9bixvLndfc2l6ZT0xPDxvLndfYml0cyxvLndfbWFzaz1vLndfc2l6ZS0xLG8uaGFzaF9iaXRzPWkrNyxvLmhhc2hfc2l6ZT0xPDxvLmhhc2hfYml0cyxvLmhhc2hfbWFzaz1vLmhhc2hfc2l6ZS0xLG8uaGFzaF9zaGlmdD1+figoby5oYXNoX2JpdHMreC0xKS94KSxvLndpbmRvdz1uZXcgYy5CdWY4KDIqby53X3NpemUpLG8uaGVhZD1uZXcgYy5CdWYxNihvLmhhc2hfc2l6ZSksby5wcmV2PW5ldyBjLkJ1ZjE2KG8ud19zaXplKSxvLmxpdF9idWZzaXplPTE8PGkrNixvLnBlbmRpbmdfYnVmX3NpemU9NCpvLmxpdF9idWZzaXplLG8ucGVuZGluZ19idWY9bmV3IGMuQnVmOChvLnBlbmRpbmdfYnVmX3NpemUpLG8uZF9idWY9MSpvLmxpdF9idWZzaXplLG8ubF9idWY9MypvLmxpdF9idWZzaXplLG8ubGV2ZWw9dCxvLnN0cmF0ZWd5PXMsby5tZXRob2Q9cixLKGUpfWg9W25ldyBNKDAsMCwwLDAsZnVuY3Rpb24oZSx0KXt2YXIgcj02NTUzNTtmb3Iocj5lLnBlbmRpbmdfYnVmX3NpemUtNSYmKHI9ZS5wZW5kaW5nX2J1Zl9zaXplLTUpOzspe2lmKGUubG9va2FoZWFkPD0xKXtpZihqKGUpLDA9PT1lLmxvb2thaGVhZCYmdD09PWwpcmV0dXJuIEE7aWYoMD09PWUubG9va2FoZWFkKWJyZWFrfWUuc3Ryc3RhcnQrPWUubG9va2FoZWFkLGUubG9va2FoZWFkPTA7dmFyIG49ZS5ibG9ja19zdGFydCtyO2lmKCgwPT09ZS5zdHJzdGFydHx8ZS5zdHJzdGFydD49bikmJihlLmxvb2thaGVhZD1lLnN0cnN0YXJ0LW4sZS5zdHJzdGFydD1uLE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpKXJldHVybiBBO2lmKGUuc3Ryc3RhcnQtZS5ibG9ja19zdGFydD49ZS53X3NpemUteiYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpKXJldHVybiBBfXJldHVybiBlLmluc2VydD0wLHQ9PT1mPyhOKGUsITApLDA9PT1lLnN0cm0uYXZhaWxfb3V0P086Qik6KGUuc3Ryc3RhcnQ+ZS5ibG9ja19zdGFydCYmKE4oZSwhMSksZS5zdHJtLmF2YWlsX291dCksQSl9KSxuZXcgTSg0LDQsOCw0LFopLG5ldyBNKDQsNSwxNiw4LFopLG5ldyBNKDQsNiwzMiwzMixaKSxuZXcgTSg0LDQsMTYsMTYsVyksbmV3IE0oOCwxNiwzMiwzMixXKSxuZXcgTSg4LDE2LDEyOCwxMjgsVyksbmV3IE0oOCwzMiwxMjgsMjU2LFcpLG5ldyBNKDMyLDEyOCwyNTgsMTAyNCxXKSxuZXcgTSgzMiwyNTgsMjU4LDQwOTYsVyldLHIuZGVmbGF0ZUluaXQ9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gWShlLHQsdiwxNSw4LDApfSxyLmRlZmxhdGVJbml0Mj1ZLHIuZGVmbGF0ZVJlc2V0PUssci5kZWZsYXRlUmVzZXRLZWVwPUcsci5kZWZsYXRlU2V0SGVhZGVyPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUmJmUuc3RhdGU/MiE9PWUuc3RhdGUud3JhcD9fOihlLnN0YXRlLmd6aGVhZD10LG0pOl99LHIuZGVmbGF0ZT1mdW5jdGlvbihlLHQpe3ZhciByLG4saSxzO2lmKCFlfHwhZS5zdGF0ZXx8NTx0fHx0PDApcmV0dXJuIGU/UihlLF8pOl87aWYobj1lLnN0YXRlLCFlLm91dHB1dHx8IWUuaW5wdXQmJjAhPT1lLmF2YWlsX2lufHw2NjY9PT1uLnN0YXR1cyYmdCE9PWYpcmV0dXJuIFIoZSwwPT09ZS5hdmFpbF9vdXQ/LTU6Xyk7aWYobi5zdHJtPWUscj1uLmxhc3RfZmx1c2gsbi5sYXN0X2ZsdXNoPXQsbi5zdGF0dXM9PT1DKWlmKDI9PT1uLndyYXApZS5hZGxlcj0wLFUobiwzMSksVShuLDEzOSksVShuLDgpLG4uZ3poZWFkPyhVKG4sKG4uZ3poZWFkLnRleHQ/MTowKSsobi5nemhlYWQuaGNyYz8yOjApKyhuLmd6aGVhZC5leHRyYT80OjApKyhuLmd6aGVhZC5uYW1lPzg6MCkrKG4uZ3poZWFkLmNvbW1lbnQ/MTY6MCkpLFUobiwyNTUmbi5nemhlYWQudGltZSksVShuLG4uZ3poZWFkLnRpbWU+PjgmMjU1KSxVKG4sbi5nemhlYWQudGltZT4+MTYmMjU1KSxVKG4sbi5nemhlYWQudGltZT4+MjQmMjU1KSxVKG4sOT09PW4ubGV2ZWw/MjoyPD1uLnN0cmF0ZWd5fHxuLmxldmVsPDI/NDowKSxVKG4sMjU1Jm4uZ3poZWFkLm9zKSxuLmd6aGVhZC5leHRyYSYmbi5nemhlYWQuZXh0cmEubGVuZ3RoJiYoVShuLDI1NSZuLmd6aGVhZC5leHRyYS5sZW5ndGgpLFUobixuLmd6aGVhZC5leHRyYS5sZW5ndGg+PjgmMjU1KSksbi5nemhlYWQuaGNyYyYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLDApKSxuLmd6aW5kZXg9MCxuLnN0YXR1cz02OSk6KFUobiwwKSxVKG4sMCksVShuLDApLFUobiwwKSxVKG4sMCksVShuLDk9PT1uLmxldmVsPzI6Mjw9bi5zdHJhdGVneXx8bi5sZXZlbDwyPzQ6MCksVShuLDMpLG4uc3RhdHVzPUUpO2Vsc2V7dmFyIGE9disobi53X2JpdHMtODw8NCk8PDg7YXw9KDI8PW4uc3RyYXRlZ3l8fG4ubGV2ZWw8Mj8wOm4ubGV2ZWw8Nj8xOjY9PT1uLmxldmVsPzI6Myk8PDYsMCE9PW4uc3Ryc3RhcnQmJihhfD0zMiksYSs9MzEtYSUzMSxuLnN0YXR1cz1FLFAobixhKSwwIT09bi5zdHJzdGFydCYmKFAobixlLmFkbGVyPj4+MTYpLFAobiw2NTUzNSZlLmFkbGVyKSksZS5hZGxlcj0xfWlmKDY5PT09bi5zdGF0dXMpaWYobi5nemhlYWQuZXh0cmEpe2ZvcihpPW4ucGVuZGluZztuLmd6aW5kZXg8KDY1NTM1Jm4uZ3poZWFkLmV4dHJhLmxlbmd0aCkmJihuLnBlbmRpbmchPT1uLnBlbmRpbmdfYnVmX3NpemV8fChuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLEYoZSksaT1uLnBlbmRpbmcsbi5wZW5kaW5nIT09bi5wZW5kaW5nX2J1Zl9zaXplKSk7KVUobiwyNTUmbi5nemhlYWQuZXh0cmFbbi5nemluZGV4XSksbi5nemluZGV4Kys7bi5nemhlYWQuaGNyYyYmbi5wZW5kaW5nPmkmJihlLmFkbGVyPXAoZS5hZGxlcixuLnBlbmRpbmdfYnVmLG4ucGVuZGluZy1pLGkpKSxuLmd6aW5kZXg9PT1uLmd6aGVhZC5leHRyYS5sZW5ndGgmJihuLmd6aW5kZXg9MCxuLnN0YXR1cz03Myl9ZWxzZSBuLnN0YXR1cz03MztpZig3Mz09PW4uc3RhdHVzKWlmKG4uZ3poZWFkLm5hbWUpe2k9bi5wZW5kaW5nO2Rve2lmKG4ucGVuZGluZz09PW4ucGVuZGluZ19idWZfc2l6ZSYmKG4uZ3poZWFkLmhjcmMmJm4ucGVuZGluZz5pJiYoZS5hZGxlcj1wKGUuYWRsZXIsbi5wZW5kaW5nX2J1ZixuLnBlbmRpbmctaSxpKSksRihlKSxpPW4ucGVuZGluZyxuLnBlbmRpbmc9PT1uLnBlbmRpbmdfYnVmX3NpemUpKXtzPTE7YnJlYWt9cz1uLmd6aW5kZXg8bi5nemhlYWQubmFtZS5sZW5ndGg/MjU1Jm4uZ3poZWFkLm5hbWUuY2hhckNvZGVBdChuLmd6aW5kZXgrKyk6MCxVKG4scyl9d2hpbGUoMCE9PXMpO24uZ3poZWFkLmhjcmMmJm4ucGVuZGluZz5pJiYoZS5hZGxlcj1wKGUuYWRsZXIsbi5wZW5kaW5nX2J1ZixuLnBlbmRpbmctaSxpKSksMD09PXMmJihuLmd6aW5kZXg9MCxuLnN0YXR1cz05MSl9ZWxzZSBuLnN0YXR1cz05MTtpZig5MT09PW4uc3RhdHVzKWlmKG4uZ3poZWFkLmNvbW1lbnQpe2k9bi5wZW5kaW5nO2Rve2lmKG4ucGVuZGluZz09PW4ucGVuZGluZ19idWZfc2l6ZSYmKG4uZ3poZWFkLmhjcmMmJm4ucGVuZGluZz5pJiYoZS5hZGxlcj1wKGUuYWRsZXIsbi5wZW5kaW5nX2J1ZixuLnBlbmRpbmctaSxpKSksRihlKSxpPW4ucGVuZGluZyxuLnBlbmRpbmc9PT1uLnBlbmRpbmdfYnVmX3NpemUpKXtzPTE7YnJlYWt9cz1uLmd6aW5kZXg8bi5nemhlYWQuY29tbWVudC5sZW5ndGg/MjU1Jm4uZ3poZWFkLmNvbW1lbnQuY2hhckNvZGVBdChuLmd6aW5kZXgrKyk6MCxVKG4scyl9d2hpbGUoMCE9PXMpO24uZ3poZWFkLmhjcmMmJm4ucGVuZGluZz5pJiYoZS5hZGxlcj1wKGUuYWRsZXIsbi5wZW5kaW5nX2J1ZixuLnBlbmRpbmctaSxpKSksMD09PXMmJihuLnN0YXR1cz0xMDMpfWVsc2Ugbi5zdGF0dXM9MTAzO2lmKDEwMz09PW4uc3RhdHVzJiYobi5nemhlYWQuaGNyYz8obi5wZW5kaW5nKzI+bi5wZW5kaW5nX2J1Zl9zaXplJiZGKGUpLG4ucGVuZGluZysyPD1uLnBlbmRpbmdfYnVmX3NpemUmJihVKG4sMjU1JmUuYWRsZXIpLFUobixlLmFkbGVyPj44JjI1NSksZS5hZGxlcj0wLG4uc3RhdHVzPUUpKTpuLnN0YXR1cz1FKSwwIT09bi5wZW5kaW5nKXtpZihGKGUpLDA9PT1lLmF2YWlsX291dClyZXR1cm4gbi5sYXN0X2ZsdXNoPS0xLG19ZWxzZSBpZigwPT09ZS5hdmFpbF9pbiYmVCh0KTw9VChyKSYmdCE9PWYpcmV0dXJuIFIoZSwtNSk7aWYoNjY2PT09bi5zdGF0dXMmJjAhPT1lLmF2YWlsX2luKXJldHVybiBSKGUsLTUpO2lmKDAhPT1lLmF2YWlsX2lufHwwIT09bi5sb29rYWhlYWR8fHQhPT1sJiY2NjYhPT1uLnN0YXR1cyl7dmFyIG89Mj09PW4uc3RyYXRlZ3k/ZnVuY3Rpb24oZSx0KXtmb3IodmFyIHI7Oyl7aWYoMD09PWUubG9va2FoZWFkJiYoaihlKSwwPT09ZS5sb29rYWhlYWQpKXtpZih0PT09bClyZXR1cm4gQTticmVha31pZihlLm1hdGNoX2xlbmd0aD0wLHI9dS5fdHJfdGFsbHkoZSwwLGUud2luZG93W2Uuc3Ryc3RhcnRdKSxlLmxvb2thaGVhZC0tLGUuc3Ryc3RhcnQrKyxyJiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCkpcmV0dXJuIEF9cmV0dXJuIGUuaW5zZXJ0PTAsdD09PWY/KE4oZSwhMCksMD09PWUuc3RybS5hdmFpbF9vdXQ/TzpCKTplLmxhc3RfbGl0JiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCk/QTpJfShuLHQpOjM9PT1uLnN0cmF0ZWd5P2Z1bmN0aW9uKGUsdCl7Zm9yKHZhciByLG4saSxzLGE9ZS53aW5kb3c7Oyl7aWYoZS5sb29rYWhlYWQ8PVMpe2lmKGooZSksZS5sb29rYWhlYWQ8PVMmJnQ9PT1sKXJldHVybiBBO2lmKDA9PT1lLmxvb2thaGVhZClicmVha31pZihlLm1hdGNoX2xlbmd0aD0wLGUubG9va2FoZWFkPj14JiYwPGUuc3Ryc3RhcnQmJihuPWFbaT1lLnN0cnN0YXJ0LTFdKT09PWFbKytpXSYmbj09PWFbKytpXSYmbj09PWFbKytpXSl7cz1lLnN0cnN0YXJ0K1M7ZG97fXdoaWxlKG49PT1hWysraV0mJm49PT1hWysraV0mJm49PT1hWysraV0mJm49PT1hWysraV0mJm49PT1hWysraV0mJm49PT1hWysraV0mJm49PT1hWysraV0mJm49PT1hWysraV0mJmk8cyk7ZS5tYXRjaF9sZW5ndGg9Uy0ocy1pKSxlLm1hdGNoX2xlbmd0aD5lLmxvb2thaGVhZCYmKGUubWF0Y2hfbGVuZ3RoPWUubG9va2FoZWFkKX1pZihlLm1hdGNoX2xlbmd0aD49eD8ocj11Ll90cl90YWxseShlLDEsZS5tYXRjaF9sZW5ndGgteCksZS5sb29rYWhlYWQtPWUubWF0Y2hfbGVuZ3RoLGUuc3Ryc3RhcnQrPWUubWF0Y2hfbGVuZ3RoLGUubWF0Y2hfbGVuZ3RoPTApOihyPXUuX3RyX3RhbGx5KGUsMCxlLndpbmRvd1tlLnN0cnN0YXJ0XSksZS5sb29rYWhlYWQtLSxlLnN0cnN0YXJ0KyspLHImJihOKGUsITEpLDA9PT1lLnN0cm0uYXZhaWxfb3V0KSlyZXR1cm4gQX1yZXR1cm4gZS5pbnNlcnQ9MCx0PT09Zj8oTihlLCEwKSwwPT09ZS5zdHJtLmF2YWlsX291dD9POkIpOmUubGFzdF9saXQmJihOKGUsITEpLDA9PT1lLnN0cm0uYXZhaWxfb3V0KT9BOkl9KG4sdCk6aFtuLmxldmVsXS5mdW5jKG4sdCk7aWYobyE9PU8mJm8hPT1CfHwobi5zdGF0dXM9NjY2KSxvPT09QXx8bz09PU8pcmV0dXJuIDA9PT1lLmF2YWlsX291dCYmKG4ubGFzdF9mbHVzaD0tMSksbTtpZihvPT09SSYmKDE9PT10P3UuX3RyX2FsaWduKG4pOjUhPT10JiYodS5fdHJfc3RvcmVkX2Jsb2NrKG4sMCwwLCExKSwzPT09dCYmKEQobi5oZWFkKSwwPT09bi5sb29rYWhlYWQmJihuLnN0cnN0YXJ0PTAsbi5ibG9ja19zdGFydD0wLG4uaW5zZXJ0PTApKSksRihlKSwwPT09ZS5hdmFpbF9vdXQpKXJldHVybiBuLmxhc3RfZmx1c2g9LTEsbX1yZXR1cm4gdCE9PWY/bTpuLndyYXA8PTA/MTooMj09PW4ud3JhcD8oVShuLDI1NSZlLmFkbGVyKSxVKG4sZS5hZGxlcj4+OCYyNTUpLFUobixlLmFkbGVyPj4xNiYyNTUpLFUobixlLmFkbGVyPj4yNCYyNTUpLFUobiwyNTUmZS50b3RhbF9pbiksVShuLGUudG90YWxfaW4+PjgmMjU1KSxVKG4sZS50b3RhbF9pbj4+MTYmMjU1KSxVKG4sZS50b3RhbF9pbj4+MjQmMjU1KSk6KFAobixlLmFkbGVyPj4+MTYpLFAobiw2NTUzNSZlLmFkbGVyKSksRihlKSwwPG4ud3JhcCYmKG4ud3JhcD0tbi53cmFwKSwwIT09bi5wZW5kaW5nP206MSl9LHIuZGVmbGF0ZUVuZD1mdW5jdGlvbihlKXt2YXIgdDtyZXR1cm4gZSYmZS5zdGF0ZT8odD1lLnN0YXRlLnN0YXR1cykhPT1DJiY2OSE9PXQmJjczIT09dCYmOTEhPT10JiYxMDMhPT10JiZ0IT09RSYmNjY2IT09dD9SKGUsXyk6KGUuc3RhdGU9bnVsbCx0PT09RT9SKGUsLTMpOm0pOl99LHIuZGVmbGF0ZVNldERpY3Rpb25hcnk9ZnVuY3Rpb24oZSx0KXt2YXIgcixuLGkscyxhLG8saCx1LGw9dC5sZW5ndGg7aWYoIWV8fCFlLnN0YXRlKXJldHVybiBfO2lmKDI9PT0ocz0ocj1lLnN0YXRlKS53cmFwKXx8MT09PXMmJnIuc3RhdHVzIT09Q3x8ci5sb29rYWhlYWQpcmV0dXJuIF87Zm9yKDE9PT1zJiYoZS5hZGxlcj1kKGUuYWRsZXIsdCxsLDApKSxyLndyYXA9MCxsPj1yLndfc2l6ZSYmKDA9PT1zJiYoRChyLmhlYWQpLHIuc3Ryc3RhcnQ9MCxyLmJsb2NrX3N0YXJ0PTAsci5pbnNlcnQ9MCksdT1uZXcgYy5CdWY4KHIud19zaXplKSxjLmFycmF5U2V0KHUsdCxsLXIud19zaXplLHIud19zaXplLDApLHQ9dSxsPXIud19zaXplKSxhPWUuYXZhaWxfaW4sbz1lLm5leHRfaW4saD1lLmlucHV0LGUuYXZhaWxfaW49bCxlLm5leHRfaW49MCxlLmlucHV0PXQsaihyKTtyLmxvb2thaGVhZD49eDspe2ZvcihuPXIuc3Ryc3RhcnQsaT1yLmxvb2thaGVhZC0oeC0xKTtyLmluc19oPShyLmluc19oPDxyLmhhc2hfc2hpZnReci53aW5kb3dbbit4LTFdKSZyLmhhc2hfbWFzayxyLnByZXZbbiZyLndfbWFza109ci5oZWFkW3IuaW5zX2hdLHIuaGVhZFtyLmluc19oXT1uLG4rKywtLWk7KTtyLnN0cnN0YXJ0PW4sci5sb29rYWhlYWQ9eC0xLGoocil9cmV0dXJuIHIuc3Ryc3RhcnQrPXIubG9va2FoZWFkLHIuYmxvY2tfc3RhcnQ9ci5zdHJzdGFydCxyLmluc2VydD1yLmxvb2thaGVhZCxyLmxvb2thaGVhZD0wLHIubWF0Y2hfbGVuZ3RoPXIucHJldl9sZW5ndGg9eC0xLHIubWF0Y2hfYXZhaWxhYmxlPTAsZS5uZXh0X2luPW8sZS5pbnB1dD1oLGUuYXZhaWxfaW49YSxyLndyYXA9cyxtfSxyLmRlZmxhdGVJbmZvPVwicGFrbyBkZWZsYXRlIChmcm9tIE5vZGVjYSBwcm9qZWN0KVwifSx7XCIuLi91dGlscy9jb21tb25cIjo0MSxcIi4vYWRsZXIzMlwiOjQzLFwiLi9jcmMzMlwiOjQ1LFwiLi9tZXNzYWdlc1wiOjUxLFwiLi90cmVlc1wiOjUyfV0sNDc6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9ZnVuY3Rpb24oKXt0aGlzLnRleHQ9MCx0aGlzLnRpbWU9MCx0aGlzLnhmbGFncz0wLHRoaXMub3M9MCx0aGlzLmV4dHJhPW51bGwsdGhpcy5leHRyYV9sZW49MCx0aGlzLm5hbWU9XCJcIix0aGlzLmNvbW1lbnQ9XCJcIix0aGlzLmhjcmM9MCx0aGlzLmRvbmU9ITF9fSx7fV0sNDg6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9ZnVuY3Rpb24oZSx0KXt2YXIgcixuLGkscyxhLG8saCx1LGwsZixjLGQscCxtLF8sZyxiLHYseSx3LGsseCxTLHosQztyPWUuc3RhdGUsbj1lLm5leHRfaW4sej1lLmlucHV0LGk9bisoZS5hdmFpbF9pbi01KSxzPWUubmV4dF9vdXQsQz1lLm91dHB1dCxhPXMtKHQtZS5hdmFpbF9vdXQpLG89cysoZS5hdmFpbF9vdXQtMjU3KSxoPXIuZG1heCx1PXIud3NpemUsbD1yLndoYXZlLGY9ci53bmV4dCxjPXIud2luZG93LGQ9ci5ob2xkLHA9ci5iaXRzLG09ci5sZW5jb2RlLF89ci5kaXN0Y29kZSxnPSgxPDxyLmxlbmJpdHMpLTEsYj0oMTw8ci5kaXN0Yml0cyktMTtlOmRve3A8MTUmJihkKz16W24rK108PHAscCs9OCxkKz16W24rK108PHAscCs9OCksdj1tW2QmZ107dDpmb3IoOzspe2lmKGQ+Pj49eT12Pj4+MjQscC09eSwwPT09KHk9dj4+PjE2JjI1NSkpQ1tzKytdPTY1NTM1JnY7ZWxzZXtpZighKDE2JnkpKXtpZigwPT0oNjQmeSkpe3Y9bVsoNjU1MzUmdikrKGQmKDE8PHkpLTEpXTtjb250aW51ZSB0fWlmKDMyJnkpe3IubW9kZT0xMjticmVhayBlfWUubXNnPVwiaW52YWxpZCBsaXRlcmFsL2xlbmd0aCBjb2RlXCIsci5tb2RlPTMwO2JyZWFrIGV9dz02NTUzNSZ2LCh5Jj0xNSkmJihwPHkmJihkKz16W24rK108PHAscCs9OCksdys9ZCYoMTw8eSktMSxkPj4+PXkscC09eSkscDwxNSYmKGQrPXpbbisrXTw8cCxwKz04LGQrPXpbbisrXTw8cCxwKz04KSx2PV9bZCZiXTtyOmZvcig7Oyl7aWYoZD4+Pj15PXY+Pj4yNCxwLT15LCEoMTYmKHk9dj4+PjE2JjI1NSkpKXtpZigwPT0oNjQmeSkpe3Y9X1soNjU1MzUmdikrKGQmKDE8PHkpLTEpXTtjb250aW51ZSByfWUubXNnPVwiaW52YWxpZCBkaXN0YW5jZSBjb2RlXCIsci5tb2RlPTMwO2JyZWFrIGV9aWYoaz02NTUzNSZ2LHA8KHkmPTE1KSYmKGQrPXpbbisrXTw8cCwocCs9OCk8eSYmKGQrPXpbbisrXTw8cCxwKz04KSksaDwoays9ZCYoMTw8eSktMSkpe2UubXNnPVwiaW52YWxpZCBkaXN0YW5jZSB0b28gZmFyIGJhY2tcIixyLm1vZGU9MzA7YnJlYWsgZX1pZihkPj4+PXkscC09eSwoeT1zLWEpPGspe2lmKGw8KHk9ay15KSYmci5zYW5lKXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2UgdG9vIGZhciBiYWNrXCIsci5tb2RlPTMwO2JyZWFrIGV9aWYoUz1jLCh4PTApPT09Zil7aWYoeCs9dS15LHk8dyl7Zm9yKHctPXk7Q1tzKytdPWNbeCsrXSwtLXk7KTt4PXMtayxTPUN9fWVsc2UgaWYoZjx5KXtpZih4Kz11K2YteSwoeS09Zik8dyl7Zm9yKHctPXk7Q1tzKytdPWNbeCsrXSwtLXk7KTtpZih4PTAsZjx3KXtmb3Iody09eT1mO0NbcysrXT1jW3grK10sLS15Oyk7eD1zLWssUz1DfX19ZWxzZSBpZih4Kz1mLXkseTx3KXtmb3Iody09eTtDW3MrK109Y1t4KytdLC0teTspO3g9cy1rLFM9Q31mb3IoOzI8dzspQ1tzKytdPVNbeCsrXSxDW3MrK109U1t4KytdLENbcysrXT1TW3grK10sdy09Mzt3JiYoQ1tzKytdPVNbeCsrXSwxPHcmJihDW3MrK109U1t4KytdKSl9ZWxzZXtmb3IoeD1zLWs7Q1tzKytdPUNbeCsrXSxDW3MrK109Q1t4KytdLENbcysrXT1DW3grK10sMjwody09Myk7KTt3JiYoQ1tzKytdPUNbeCsrXSwxPHcmJihDW3MrK109Q1t4KytdKSl9YnJlYWt9fWJyZWFrfX13aGlsZShuPGkmJnM8byk7bi09dz1wPj4zLGQmPSgxPDwocC09dzw8MykpLTEsZS5uZXh0X2luPW4sZS5uZXh0X291dD1zLGUuYXZhaWxfaW49bjxpP2ktbis1OjUtKG4taSksZS5hdmFpbF9vdXQ9czxvP28tcysyNTc6MjU3LShzLW8pLHIuaG9sZD1kLHIuYml0cz1wfX0se31dLDQ5OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIEk9ZShcIi4uL3V0aWxzL2NvbW1vblwiKSxPPWUoXCIuL2FkbGVyMzJcIiksQj1lKFwiLi9jcmMzMlwiKSxSPWUoXCIuL2luZmZhc3RcIiksVD1lKFwiLi9pbmZ0cmVlc1wiKSxEPTEsRj0yLE49MCxVPS0yLFA9MSxuPTg1MixpPTU5MjtmdW5jdGlvbiBMKGUpe3JldHVybihlPj4+MjQmMjU1KSsoZT4+PjgmNjUyODApKygoNjUyODAmZSk8PDgpKygoMjU1JmUpPDwyNCl9ZnVuY3Rpb24gcygpe3RoaXMubW9kZT0wLHRoaXMubGFzdD0hMSx0aGlzLndyYXA9MCx0aGlzLmhhdmVkaWN0PSExLHRoaXMuZmxhZ3M9MCx0aGlzLmRtYXg9MCx0aGlzLmNoZWNrPTAsdGhpcy50b3RhbD0wLHRoaXMuaGVhZD1udWxsLHRoaXMud2JpdHM9MCx0aGlzLndzaXplPTAsdGhpcy53aGF2ZT0wLHRoaXMud25leHQ9MCx0aGlzLndpbmRvdz1udWxsLHRoaXMuaG9sZD0wLHRoaXMuYml0cz0wLHRoaXMubGVuZ3RoPTAsdGhpcy5vZmZzZXQ9MCx0aGlzLmV4dHJhPTAsdGhpcy5sZW5jb2RlPW51bGwsdGhpcy5kaXN0Y29kZT1udWxsLHRoaXMubGVuYml0cz0wLHRoaXMuZGlzdGJpdHM9MCx0aGlzLm5jb2RlPTAsdGhpcy5ubGVuPTAsdGhpcy5uZGlzdD0wLHRoaXMuaGF2ZT0wLHRoaXMubmV4dD1udWxsLHRoaXMubGVucz1uZXcgSS5CdWYxNigzMjApLHRoaXMud29yaz1uZXcgSS5CdWYxNigyODgpLHRoaXMubGVuZHluPW51bGwsdGhpcy5kaXN0ZHluPW51bGwsdGhpcy5zYW5lPTAsdGhpcy5iYWNrPTAsdGhpcy53YXM9MH1mdW5jdGlvbiBhKGUpe3ZhciB0O3JldHVybiBlJiZlLnN0YXRlPyh0PWUuc3RhdGUsZS50b3RhbF9pbj1lLnRvdGFsX291dD10LnRvdGFsPTAsZS5tc2c9XCJcIix0LndyYXAmJihlLmFkbGVyPTEmdC53cmFwKSx0Lm1vZGU9UCx0Lmxhc3Q9MCx0LmhhdmVkaWN0PTAsdC5kbWF4PTMyNzY4LHQuaGVhZD1udWxsLHQuaG9sZD0wLHQuYml0cz0wLHQubGVuY29kZT10LmxlbmR5bj1uZXcgSS5CdWYzMihuKSx0LmRpc3Rjb2RlPXQuZGlzdGR5bj1uZXcgSS5CdWYzMihpKSx0LnNhbmU9MSx0LmJhY2s9LTEsTik6VX1mdW5jdGlvbiBvKGUpe3ZhciB0O3JldHVybiBlJiZlLnN0YXRlPygodD1lLnN0YXRlKS53c2l6ZT0wLHQud2hhdmU9MCx0LnduZXh0PTAsYShlKSk6VX1mdW5jdGlvbiBoKGUsdCl7dmFyIHIsbjtyZXR1cm4gZSYmZS5zdGF0ZT8obj1lLnN0YXRlLHQ8MD8ocj0wLHQ9LXQpOihyPTErKHQ+PjQpLHQ8NDgmJih0Jj0xNSkpLHQmJih0PDh8fDE1PHQpP1U6KG51bGwhPT1uLndpbmRvdyYmbi53Yml0cyE9PXQmJihuLndpbmRvdz1udWxsKSxuLndyYXA9cixuLndiaXRzPXQsbyhlKSkpOlV9ZnVuY3Rpb24gdShlLHQpe3ZhciByLG47cmV0dXJuIGU/KG49bmV3IHMsKGUuc3RhdGU9bikud2luZG93PW51bGwsKHI9aChlLHQpKSE9PU4mJihlLnN0YXRlPW51bGwpLHIpOlV9dmFyIGwsZixjPSEwO2Z1bmN0aW9uIGooZSl7aWYoYyl7dmFyIHQ7Zm9yKGw9bmV3IEkuQnVmMzIoNTEyKSxmPW5ldyBJLkJ1ZjMyKDMyKSx0PTA7dDwxNDQ7KWUubGVuc1t0KytdPTg7Zm9yKDt0PDI1NjspZS5sZW5zW3QrK109OTtmb3IoO3Q8MjgwOyllLmxlbnNbdCsrXT03O2Zvcig7dDwyODg7KWUubGVuc1t0KytdPTg7Zm9yKFQoRCxlLmxlbnMsMCwyODgsbCwwLGUud29yayx7Yml0czo5fSksdD0wO3Q8MzI7KWUubGVuc1t0KytdPTU7VChGLGUubGVucywwLDMyLGYsMCxlLndvcmsse2JpdHM6NX0pLGM9ITF9ZS5sZW5jb2RlPWwsZS5sZW5iaXRzPTksZS5kaXN0Y29kZT1mLGUuZGlzdGJpdHM9NX1mdW5jdGlvbiBaKGUsdCxyLG4pe3ZhciBpLHM9ZS5zdGF0ZTtyZXR1cm4gbnVsbD09PXMud2luZG93JiYocy53c2l6ZT0xPDxzLndiaXRzLHMud25leHQ9MCxzLndoYXZlPTAscy53aW5kb3c9bmV3IEkuQnVmOChzLndzaXplKSksbj49cy53c2l6ZT8oSS5hcnJheVNldChzLndpbmRvdyx0LHItcy53c2l6ZSxzLndzaXplLDApLHMud25leHQ9MCxzLndoYXZlPXMud3NpemUpOihuPChpPXMud3NpemUtcy53bmV4dCkmJihpPW4pLEkuYXJyYXlTZXQocy53aW5kb3csdCxyLW4saSxzLnduZXh0KSwobi09aSk/KEkuYXJyYXlTZXQocy53aW5kb3csdCxyLW4sbiwwKSxzLnduZXh0PW4scy53aGF2ZT1zLndzaXplKToocy53bmV4dCs9aSxzLnduZXh0PT09cy53c2l6ZSYmKHMud25leHQ9MCkscy53aGF2ZTxzLndzaXplJiYocy53aGF2ZSs9aSkpKSwwfXIuaW5mbGF0ZVJlc2V0PW8sci5pbmZsYXRlUmVzZXQyPWgsci5pbmZsYXRlUmVzZXRLZWVwPWEsci5pbmZsYXRlSW5pdD1mdW5jdGlvbihlKXtyZXR1cm4gdShlLDE1KX0sci5pbmZsYXRlSW5pdDI9dSxyLmluZmxhdGU9ZnVuY3Rpb24oZSx0KXt2YXIgcixuLGkscyxhLG8saCx1LGwsZixjLGQscCxtLF8sZyxiLHYseSx3LGsseCxTLHosQz0wLEU9bmV3IEkuQnVmOCg0KSxBPVsxNiwxNywxOCwwLDgsNyw5LDYsMTAsNSwxMSw0LDEyLDMsMTMsMiwxNCwxLDE1XTtpZighZXx8IWUuc3RhdGV8fCFlLm91dHB1dHx8IWUuaW5wdXQmJjAhPT1lLmF2YWlsX2luKXJldHVybiBVOzEyPT09KHI9ZS5zdGF0ZSkubW9kZSYmKHIubW9kZT0xMyksYT1lLm5leHRfb3V0LGk9ZS5vdXRwdXQsaD1lLmF2YWlsX291dCxzPWUubmV4dF9pbixuPWUuaW5wdXQsbz1lLmF2YWlsX2luLHU9ci5ob2xkLGw9ci5iaXRzLGY9byxjPWgseD1OO2U6Zm9yKDs7KXN3aXRjaChyLm1vZGUpe2Nhc2UgUDppZigwPT09ci53cmFwKXtyLm1vZGU9MTM7YnJlYWt9Zm9yKDtsPDE2Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYoMiZyLndyYXAmJjM1NjE1PT09dSl7RVtyLmNoZWNrPTBdPTI1NSZ1LEVbMV09dT4+PjgmMjU1LHIuY2hlY2s9QihyLmNoZWNrLEUsMiwwKSxsPXU9MCxyLm1vZGU9MjticmVha31pZihyLmZsYWdzPTAsci5oZWFkJiYoci5oZWFkLmRvbmU9ITEpLCEoMSZyLndyYXApfHwoKCgyNTUmdSk8PDgpKyh1Pj44KSklMzEpe2UubXNnPVwiaW5jb3JyZWN0IGhlYWRlciBjaGVja1wiLHIubW9kZT0zMDticmVha31pZig4IT0oMTUmdSkpe2UubXNnPVwidW5rbm93biBjb21wcmVzc2lvbiBtZXRob2RcIixyLm1vZGU9MzA7YnJlYWt9aWYobC09NCxrPTgrKDE1Jih1Pj4+PTQpKSwwPT09ci53Yml0cylyLndiaXRzPWs7ZWxzZSBpZihrPnIud2JpdHMpe2UubXNnPVwiaW52YWxpZCB3aW5kb3cgc2l6ZVwiLHIubW9kZT0zMDticmVha31yLmRtYXg9MTw8ayxlLmFkbGVyPXIuY2hlY2s9MSxyLm1vZGU9NTEyJnU/MTA6MTIsbD11PTA7YnJlYWs7Y2FzZSAyOmZvcig7bDwxNjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKHIuZmxhZ3M9dSw4IT0oMjU1JnIuZmxhZ3MpKXtlLm1zZz1cInVua25vd24gY29tcHJlc3Npb24gbWV0aG9kXCIsci5tb2RlPTMwO2JyZWFrfWlmKDU3MzQ0JnIuZmxhZ3Mpe2UubXNnPVwidW5rbm93biBoZWFkZXIgZmxhZ3Mgc2V0XCIsci5tb2RlPTMwO2JyZWFrfXIuaGVhZCYmKHIuaGVhZC50ZXh0PXU+PjgmMSksNTEyJnIuZmxhZ3MmJihFWzBdPTI1NSZ1LEVbMV09dT4+PjgmMjU1LHIuY2hlY2s9QihyLmNoZWNrLEUsMiwwKSksbD11PTAsci5tb2RlPTM7Y2FzZSAzOmZvcig7bDwzMjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXIuaGVhZCYmKHIuaGVhZC50aW1lPXUpLDUxMiZyLmZsYWdzJiYoRVswXT0yNTUmdSxFWzFdPXU+Pj44JjI1NSxFWzJdPXU+Pj4xNiYyNTUsRVszXT11Pj4+MjQmMjU1LHIuY2hlY2s9QihyLmNoZWNrLEUsNCwwKSksbD11PTAsci5tb2RlPTQ7Y2FzZSA0OmZvcig7bDwxNjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXIuaGVhZCYmKHIuaGVhZC54ZmxhZ3M9MjU1JnUsci5oZWFkLm9zPXU+PjgpLDUxMiZyLmZsYWdzJiYoRVswXT0yNTUmdSxFWzFdPXU+Pj44JjI1NSxyLmNoZWNrPUIoci5jaGVjayxFLDIsMCkpLGw9dT0wLHIubW9kZT01O2Nhc2UgNTppZigxMDI0JnIuZmxhZ3Mpe2Zvcig7bDwxNjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXIubGVuZ3RoPXUsci5oZWFkJiYoci5oZWFkLmV4dHJhX2xlbj11KSw1MTImci5mbGFncyYmKEVbMF09MjU1JnUsRVsxXT11Pj4+OCYyNTUsci5jaGVjaz1CKHIuY2hlY2ssRSwyLDApKSxsPXU9MH1lbHNlIHIuaGVhZCYmKHIuaGVhZC5leHRyYT1udWxsKTtyLm1vZGU9NjtjYXNlIDY6aWYoMTAyNCZyLmZsYWdzJiYobzwoZD1yLmxlbmd0aCkmJihkPW8pLGQmJihyLmhlYWQmJihrPXIuaGVhZC5leHRyYV9sZW4tci5sZW5ndGgsci5oZWFkLmV4dHJhfHwoci5oZWFkLmV4dHJhPW5ldyBBcnJheShyLmhlYWQuZXh0cmFfbGVuKSksSS5hcnJheVNldChyLmhlYWQuZXh0cmEsbixzLGQsaykpLDUxMiZyLmZsYWdzJiYoci5jaGVjaz1CKHIuY2hlY2ssbixkLHMpKSxvLT1kLHMrPWQsci5sZW5ndGgtPWQpLHIubGVuZ3RoKSlicmVhayBlO3IubGVuZ3RoPTAsci5tb2RlPTc7Y2FzZSA3OmlmKDIwNDgmci5mbGFncyl7aWYoMD09PW8pYnJlYWsgZTtmb3IoZD0wO2s9bltzK2QrK10sci5oZWFkJiZrJiZyLmxlbmd0aDw2NTUzNiYmKHIuaGVhZC5uYW1lKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGspKSxrJiZkPG87KTtpZig1MTImci5mbGFncyYmKHIuY2hlY2s9QihyLmNoZWNrLG4sZCxzKSksby09ZCxzKz1kLGspYnJlYWsgZX1lbHNlIHIuaGVhZCYmKHIuaGVhZC5uYW1lPW51bGwpO3IubGVuZ3RoPTAsci5tb2RlPTg7Y2FzZSA4OmlmKDQwOTYmci5mbGFncyl7aWYoMD09PW8pYnJlYWsgZTtmb3IoZD0wO2s9bltzK2QrK10sci5oZWFkJiZrJiZyLmxlbmd0aDw2NTUzNiYmKHIuaGVhZC5jb21tZW50Kz1TdHJpbmcuZnJvbUNoYXJDb2RlKGspKSxrJiZkPG87KTtpZig1MTImci5mbGFncyYmKHIuY2hlY2s9QihyLmNoZWNrLG4sZCxzKSksby09ZCxzKz1kLGspYnJlYWsgZX1lbHNlIHIuaGVhZCYmKHIuaGVhZC5jb21tZW50PW51bGwpO3IubW9kZT05O2Nhc2UgOTppZig1MTImci5mbGFncyl7Zm9yKDtsPDE2Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYodSE9PSg2NTUzNSZyLmNoZWNrKSl7ZS5tc2c9XCJoZWFkZXIgY3JjIG1pc21hdGNoXCIsci5tb2RlPTMwO2JyZWFrfWw9dT0wfXIuaGVhZCYmKHIuaGVhZC5oY3JjPXIuZmxhZ3M+PjkmMSxyLmhlYWQuZG9uZT0hMCksZS5hZGxlcj1yLmNoZWNrPTAsci5tb2RlPTEyO2JyZWFrO2Nhc2UgMTA6Zm9yKDtsPDMyOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9ZS5hZGxlcj1yLmNoZWNrPUwodSksbD11PTAsci5tb2RlPTExO2Nhc2UgMTE6aWYoMD09PXIuaGF2ZWRpY3QpcmV0dXJuIGUubmV4dF9vdXQ9YSxlLmF2YWlsX291dD1oLGUubmV4dF9pbj1zLGUuYXZhaWxfaW49byxyLmhvbGQ9dSxyLmJpdHM9bCwyO2UuYWRsZXI9ci5jaGVjaz0xLHIubW9kZT0xMjtjYXNlIDEyOmlmKDU9PT10fHw2PT09dClicmVhayBlO2Nhc2UgMTM6aWYoci5sYXN0KXt1Pj4+PTcmbCxsLT03Jmwsci5tb2RlPTI3O2JyZWFrfWZvcig7bDwzOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9c3dpdGNoKHIubGFzdD0xJnUsbC09MSwzJih1Pj4+PTEpKXtjYXNlIDA6ci5tb2RlPTE0O2JyZWFrO2Nhc2UgMTppZihqKHIpLHIubW9kZT0yMCw2IT09dClicmVhazt1Pj4+PTIsbC09MjticmVhayBlO2Nhc2UgMjpyLm1vZGU9MTc7YnJlYWs7Y2FzZSAzOmUubXNnPVwiaW52YWxpZCBibG9jayB0eXBlXCIsci5tb2RlPTMwfXU+Pj49MixsLT0yO2JyZWFrO2Nhc2UgMTQ6Zm9yKHU+Pj49NyZsLGwtPTcmbDtsPDMyOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYoKDY1NTM1JnUpIT0odT4+PjE2XjY1NTM1KSl7ZS5tc2c9XCJpbnZhbGlkIHN0b3JlZCBibG9jayBsZW5ndGhzXCIsci5tb2RlPTMwO2JyZWFrfWlmKHIubGVuZ3RoPTY1NTM1JnUsbD11PTAsci5tb2RlPTE1LDY9PT10KWJyZWFrIGU7Y2FzZSAxNTpyLm1vZGU9MTY7Y2FzZSAxNjppZihkPXIubGVuZ3RoKXtpZihvPGQmJihkPW8pLGg8ZCYmKGQ9aCksMD09PWQpYnJlYWsgZTtJLmFycmF5U2V0KGksbixzLGQsYSksby09ZCxzKz1kLGgtPWQsYSs9ZCxyLmxlbmd0aC09ZDticmVha31yLm1vZGU9MTI7YnJlYWs7Y2FzZSAxNzpmb3IoO2w8MTQ7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1pZihyLm5sZW49MjU3KygzMSZ1KSx1Pj4+PTUsbC09NSxyLm5kaXN0PTErKDMxJnUpLHU+Pj49NSxsLT01LHIubmNvZGU9NCsoMTUmdSksdT4+Pj00LGwtPTQsMjg2PHIubmxlbnx8MzA8ci5uZGlzdCl7ZS5tc2c9XCJ0b28gbWFueSBsZW5ndGggb3IgZGlzdGFuY2Ugc3ltYm9sc1wiLHIubW9kZT0zMDticmVha31yLmhhdmU9MCxyLm1vZGU9MTg7Y2FzZSAxODpmb3IoO3IuaGF2ZTxyLm5jb2RlOyl7Zm9yKDtsPDM7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLmxlbnNbQVtyLmhhdmUrK11dPTcmdSx1Pj4+PTMsbC09M31mb3IoO3IuaGF2ZTwxOTspci5sZW5zW0Fbci5oYXZlKytdXT0wO2lmKHIubGVuY29kZT1yLmxlbmR5bixyLmxlbmJpdHM9NyxTPXtiaXRzOnIubGVuYml0c30seD1UKDAsci5sZW5zLDAsMTksci5sZW5jb2RlLDAsci53b3JrLFMpLHIubGVuYml0cz1TLmJpdHMseCl7ZS5tc2c9XCJpbnZhbGlkIGNvZGUgbGVuZ3RocyBzZXRcIixyLm1vZGU9MzA7YnJlYWt9ci5oYXZlPTAsci5tb2RlPTE5O2Nhc2UgMTk6Zm9yKDtyLmhhdmU8ci5ubGVuK3IubmRpc3Q7KXtmb3IoO2c9KEM9ci5sZW5jb2RlW3UmKDE8PHIubGVuYml0cyktMV0pPj4+MTYmMjU1LGI9NjU1MzUmQywhKChfPUM+Pj4yNCk8PWwpOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYoYjwxNil1Pj4+PV8sbC09XyxyLmxlbnNbci5oYXZlKytdPWI7ZWxzZXtpZigxNj09PWIpe2Zvcih6PV8rMjtsPHo7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1pZih1Pj4+PV8sbC09XywwPT09ci5oYXZlKXtlLm1zZz1cImludmFsaWQgYml0IGxlbmd0aCByZXBlYXRcIixyLm1vZGU9MzA7YnJlYWt9az1yLmxlbnNbci5oYXZlLTFdLGQ9MysoMyZ1KSx1Pj4+PTIsbC09Mn1lbHNlIGlmKDE3PT09Yil7Zm9yKHo9XyszO2w8ejspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWwtPV8saz0wLGQ9MysoNyYodT4+Pj1fKSksdT4+Pj0zLGwtPTN9ZWxzZXtmb3Ioej1fKzc7bDx6Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9bC09XyxrPTAsZD0xMSsoMTI3Jih1Pj4+PV8pKSx1Pj4+PTcsbC09N31pZihyLmhhdmUrZD5yLm5sZW4rci5uZGlzdCl7ZS5tc2c9XCJpbnZhbGlkIGJpdCBsZW5ndGggcmVwZWF0XCIsci5tb2RlPTMwO2JyZWFrfWZvcig7ZC0tOylyLmxlbnNbci5oYXZlKytdPWt9fWlmKDMwPT09ci5tb2RlKWJyZWFrO2lmKDA9PT1yLmxlbnNbMjU2XSl7ZS5tc2c9XCJpbnZhbGlkIGNvZGUgLS0gbWlzc2luZyBlbmQtb2YtYmxvY2tcIixyLm1vZGU9MzA7YnJlYWt9aWYoci5sZW5iaXRzPTksUz17Yml0czpyLmxlbmJpdHN9LHg9VChELHIubGVucywwLHIubmxlbixyLmxlbmNvZGUsMCxyLndvcmssUyksci5sZW5iaXRzPVMuYml0cyx4KXtlLm1zZz1cImludmFsaWQgbGl0ZXJhbC9sZW5ndGhzIHNldFwiLHIubW9kZT0zMDticmVha31pZihyLmRpc3RiaXRzPTYsci5kaXN0Y29kZT1yLmRpc3RkeW4sUz17Yml0czpyLmRpc3RiaXRzfSx4PVQoRixyLmxlbnMsci5ubGVuLHIubmRpc3Qsci5kaXN0Y29kZSwwLHIud29yayxTKSxyLmRpc3RiaXRzPVMuYml0cyx4KXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2VzIHNldFwiLHIubW9kZT0zMDticmVha31pZihyLm1vZGU9MjAsNj09PXQpYnJlYWsgZTtjYXNlIDIwOnIubW9kZT0yMTtjYXNlIDIxOmlmKDY8PW8mJjI1ODw9aCl7ZS5uZXh0X291dD1hLGUuYXZhaWxfb3V0PWgsZS5uZXh0X2luPXMsZS5hdmFpbF9pbj1vLHIuaG9sZD11LHIuYml0cz1sLFIoZSxjKSxhPWUubmV4dF9vdXQsaT1lLm91dHB1dCxoPWUuYXZhaWxfb3V0LHM9ZS5uZXh0X2luLG49ZS5pbnB1dCxvPWUuYXZhaWxfaW4sdT1yLmhvbGQsbD1yLmJpdHMsMTI9PT1yLm1vZGUmJihyLmJhY2s9LTEpO2JyZWFrfWZvcihyLmJhY2s9MDtnPShDPXIubGVuY29kZVt1JigxPDxyLmxlbmJpdHMpLTFdKT4+PjE2JjI1NSxiPTY1NTM1JkMsISgoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKGcmJjA9PSgyNDAmZykpe2Zvcih2PV8seT1nLHc9YjtnPShDPXIubGVuY29kZVt3KygodSYoMTw8dit5KS0xKT4+dildKT4+PjE2JjI1NSxiPTY1NTM1JkMsISh2KyhfPUM+Pj4yNCk8PWwpOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9dT4+Pj12LGwtPXYsci5iYWNrKz12fWlmKHU+Pj49XyxsLT1fLHIuYmFjays9XyxyLmxlbmd0aD1iLDA9PT1nKXtyLm1vZGU9MjY7YnJlYWt9aWYoMzImZyl7ci5iYWNrPS0xLHIubW9kZT0xMjticmVha31pZig2NCZnKXtlLm1zZz1cImludmFsaWQgbGl0ZXJhbC9sZW5ndGggY29kZVwiLHIubW9kZT0zMDticmVha31yLmV4dHJhPTE1Jmcsci5tb2RlPTIyO2Nhc2UgMjI6aWYoci5leHRyYSl7Zm9yKHo9ci5leHRyYTtsPHo7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLmxlbmd0aCs9dSYoMTw8ci5leHRyYSktMSx1Pj4+PXIuZXh0cmEsbC09ci5leHRyYSxyLmJhY2srPXIuZXh0cmF9ci53YXM9ci5sZW5ndGgsci5tb2RlPTIzO2Nhc2UgMjM6Zm9yKDtnPShDPXIuZGlzdGNvZGVbdSYoMTw8ci5kaXN0Yml0cyktMV0pPj4+MTYmMjU1LGI9NjU1MzUmQywhKChfPUM+Pj4yNCk8PWwpOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYoMD09KDI0MCZnKSl7Zm9yKHY9Xyx5PWcsdz1iO2c9KEM9ci5kaXN0Y29kZVt3KygodSYoMTw8dit5KS0xKT4+dildKT4+PjE2JjI1NSxiPTY1NTM1JkMsISh2KyhfPUM+Pj4yNCk8PWwpOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9dT4+Pj12LGwtPXYsci5iYWNrKz12fWlmKHU+Pj49XyxsLT1fLHIuYmFjays9Xyw2NCZnKXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2UgY29kZVwiLHIubW9kZT0zMDticmVha31yLm9mZnNldD1iLHIuZXh0cmE9MTUmZyxyLm1vZGU9MjQ7Y2FzZSAyNDppZihyLmV4dHJhKXtmb3Ioej1yLmV4dHJhO2w8ejspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXIub2Zmc2V0Kz11JigxPDxyLmV4dHJhKS0xLHU+Pj49ci5leHRyYSxsLT1yLmV4dHJhLHIuYmFjays9ci5leHRyYX1pZihyLm9mZnNldD5yLmRtYXgpe2UubXNnPVwiaW52YWxpZCBkaXN0YW5jZSB0b28gZmFyIGJhY2tcIixyLm1vZGU9MzA7YnJlYWt9ci5tb2RlPTI1O2Nhc2UgMjU6aWYoMD09PWgpYnJlYWsgZTtpZihkPWMtaCxyLm9mZnNldD5kKXtpZigoZD1yLm9mZnNldC1kKT5yLndoYXZlJiZyLnNhbmUpe2UubXNnPVwiaW52YWxpZCBkaXN0YW5jZSB0b28gZmFyIGJhY2tcIixyLm1vZGU9MzA7YnJlYWt9cD1kPnIud25leHQ/KGQtPXIud25leHQsci53c2l6ZS1kKTpyLnduZXh0LWQsZD5yLmxlbmd0aCYmKGQ9ci5sZW5ndGgpLG09ci53aW5kb3d9ZWxzZSBtPWkscD1hLXIub2Zmc2V0LGQ9ci5sZW5ndGg7Zm9yKGg8ZCYmKGQ9aCksaC09ZCxyLmxlbmd0aC09ZDtpW2ErK109bVtwKytdLC0tZDspOzA9PT1yLmxlbmd0aCYmKHIubW9kZT0yMSk7YnJlYWs7Y2FzZSAyNjppZigwPT09aClicmVhayBlO2lbYSsrXT1yLmxlbmd0aCxoLS0sci5tb2RlPTIxO2JyZWFrO2Nhc2UgMjc6aWYoci53cmFwKXtmb3IoO2w8MzI7KXtpZigwPT09bylicmVhayBlO28tLSx1fD1uW3MrK108PGwsbCs9OH1pZihjLT1oLGUudG90YWxfb3V0Kz1jLHIudG90YWwrPWMsYyYmKGUuYWRsZXI9ci5jaGVjaz1yLmZsYWdzP0Ioci5jaGVjayxpLGMsYS1jKTpPKHIuY2hlY2ssaSxjLGEtYykpLGM9aCwoci5mbGFncz91OkwodSkpIT09ci5jaGVjayl7ZS5tc2c9XCJpbmNvcnJlY3QgZGF0YSBjaGVja1wiLHIubW9kZT0zMDticmVha31sPXU9MH1yLm1vZGU9Mjg7Y2FzZSAyODppZihyLndyYXAmJnIuZmxhZ3Mpe2Zvcig7bDwzMjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKHUhPT0oNDI5NDk2NzI5NSZyLnRvdGFsKSl7ZS5tc2c9XCJpbmNvcnJlY3QgbGVuZ3RoIGNoZWNrXCIsci5tb2RlPTMwO2JyZWFrfWw9dT0wfXIubW9kZT0yOTtjYXNlIDI5Ong9MTticmVhayBlO2Nhc2UgMzA6eD0tMzticmVhayBlO2Nhc2UgMzE6cmV0dXJuLTQ7Y2FzZSAzMjpkZWZhdWx0OnJldHVybiBVfXJldHVybiBlLm5leHRfb3V0PWEsZS5hdmFpbF9vdXQ9aCxlLm5leHRfaW49cyxlLmF2YWlsX2luPW8sci5ob2xkPXUsci5iaXRzPWwsKHIud3NpemV8fGMhPT1lLmF2YWlsX291dCYmci5tb2RlPDMwJiYoci5tb2RlPDI3fHw0IT09dCkpJiZaKGUsZS5vdXRwdXQsZS5uZXh0X291dCxjLWUuYXZhaWxfb3V0KT8oci5tb2RlPTMxLC00KTooZi09ZS5hdmFpbF9pbixjLT1lLmF2YWlsX291dCxlLnRvdGFsX2luKz1mLGUudG90YWxfb3V0Kz1jLHIudG90YWwrPWMsci53cmFwJiZjJiYoZS5hZGxlcj1yLmNoZWNrPXIuZmxhZ3M/QihyLmNoZWNrLGksYyxlLm5leHRfb3V0LWMpOk8oci5jaGVjayxpLGMsZS5uZXh0X291dC1jKSksZS5kYXRhX3R5cGU9ci5iaXRzKyhyLmxhc3Q/NjQ6MCkrKDEyPT09ci5tb2RlPzEyODowKSsoMjA9PT1yLm1vZGV8fDE1PT09ci5tb2RlPzI1NjowKSwoMD09ZiYmMD09PWN8fDQ9PT10KSYmeD09PU4mJih4PS01KSx4KX0sci5pbmZsYXRlRW5kPWZ1bmN0aW9uKGUpe2lmKCFlfHwhZS5zdGF0ZSlyZXR1cm4gVTt2YXIgdD1lLnN0YXRlO3JldHVybiB0LndpbmRvdyYmKHQud2luZG93PW51bGwpLGUuc3RhdGU9bnVsbCxOfSxyLmluZmxhdGVHZXRIZWFkZXI9ZnVuY3Rpb24oZSx0KXt2YXIgcjtyZXR1cm4gZSYmZS5zdGF0ZT8wPT0oMiYocj1lLnN0YXRlKS53cmFwKT9VOigoci5oZWFkPXQpLmRvbmU9ITEsTik6VX0sci5pbmZsYXRlU2V0RGljdGlvbmFyeT1mdW5jdGlvbihlLHQpe3ZhciByLG49dC5sZW5ndGg7cmV0dXJuIGUmJmUuc3RhdGU/MCE9PShyPWUuc3RhdGUpLndyYXAmJjExIT09ci5tb2RlP1U6MTE9PT1yLm1vZGUmJk8oMSx0LG4sMCkhPT1yLmNoZWNrPy0zOlooZSx0LG4sbik/KHIubW9kZT0zMSwtNCk6KHIuaGF2ZWRpY3Q9MSxOKTpVfSxyLmluZmxhdGVJbmZvPVwicGFrbyBpbmZsYXRlIChmcm9tIE5vZGVjYSBwcm9qZWN0KVwifSx7XCIuLi91dGlscy9jb21tb25cIjo0MSxcIi4vYWRsZXIzMlwiOjQzLFwiLi9jcmMzMlwiOjQ1LFwiLi9pbmZmYXN0XCI6NDgsXCIuL2luZnRyZWVzXCI6NTB9XSw1MDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBEPWUoXCIuLi91dGlscy9jb21tb25cIiksRj1bMyw0LDUsNiw3LDgsOSwxMCwxMSwxMywxNSwxNywxOSwyMywyNywzMSwzNSw0Myw1MSw1OSw2Nyw4Myw5OSwxMTUsMTMxLDE2MywxOTUsMjI3LDI1OCwwLDBdLE49WzE2LDE2LDE2LDE2LDE2LDE2LDE2LDE2LDE3LDE3LDE3LDE3LDE4LDE4LDE4LDE4LDE5LDE5LDE5LDE5LDIwLDIwLDIwLDIwLDIxLDIxLDIxLDIxLDE2LDcyLDc4XSxVPVsxLDIsMyw0LDUsNyw5LDEzLDE3LDI1LDMzLDQ5LDY1LDk3LDEyOSwxOTMsMjU3LDM4NSw1MTMsNzY5LDEwMjUsMTUzNywyMDQ5LDMwNzMsNDA5Nyw2MTQ1LDgxOTMsMTIyODksMTYzODUsMjQ1NzcsMCwwXSxQPVsxNiwxNiwxNiwxNiwxNywxNywxOCwxOCwxOSwxOSwyMCwyMCwyMSwyMSwyMiwyMiwyMywyMywyNCwyNCwyNSwyNSwyNiwyNiwyNywyNywyOCwyOCwyOSwyOSw2NCw2NF07dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCxyLG4saSxzLGEsbyl7dmFyIGgsdSxsLGYsYyxkLHAsbSxfLGc9by5iaXRzLGI9MCx2PTAseT0wLHc9MCxrPTAseD0wLFM9MCx6PTAsQz0wLEU9MCxBPW51bGwsST0wLE89bmV3IEQuQnVmMTYoMTYpLEI9bmV3IEQuQnVmMTYoMTYpLFI9bnVsbCxUPTA7Zm9yKGI9MDtiPD0xNTtiKyspT1tiXT0wO2Zvcih2PTA7djxuO3YrKylPW3Rbcit2XV0rKztmb3Ioaz1nLHc9MTU7MTw9dyYmMD09PU9bd107dy0tKTtpZih3PGsmJihrPXcpLDA9PT13KXJldHVybiBpW3MrK109MjA5NzE1MjAsaVtzKytdPTIwOTcxNTIwLG8uYml0cz0xLDA7Zm9yKHk9MTt5PHcmJjA9PT1PW3ldO3krKyk7Zm9yKGs8eSYmKGs9eSksYj16PTE7Yjw9MTU7YisrKWlmKHo8PD0xLCh6LT1PW2JdKTwwKXJldHVybi0xO2lmKDA8eiYmKDA9PT1lfHwxIT09dykpcmV0dXJuLTE7Zm9yKEJbMV09MCxiPTE7YjwxNTtiKyspQltiKzFdPUJbYl0rT1tiXTtmb3Iodj0wO3Y8bjt2KyspMCE9PXRbcit2XSYmKGFbQlt0W3Irdl1dKytdPXYpO2lmKGQ9MD09PWU/KEE9Uj1hLDE5KToxPT09ZT8oQT1GLEktPTI1NyxSPU4sVC09MjU3LDI1Nik6KEE9VSxSPVAsLTEpLGI9eSxjPXMsUz12PUU9MCxsPS0xLGY9KEM9MTw8KHg9aykpLTEsMT09PWUmJjg1MjxDfHwyPT09ZSYmNTkyPEMpcmV0dXJuIDE7Zm9yKDs7KXtmb3IocD1iLVMsXz1hW3ZdPGQ/KG09MCxhW3ZdKTphW3ZdPmQ/KG09UltUK2Fbdl1dLEFbSSthW3ZdXSk6KG09OTYsMCksaD0xPDxiLVMseT11PTE8PHg7aVtjKyhFPj5TKSsodS09aCldPXA8PDI0fG08PDE2fF98MCwwIT09dTspO2ZvcihoPTE8PGItMTtFJmg7KWg+Pj0xO2lmKDAhPT1oPyhFJj1oLTEsRSs9aCk6RT0wLHYrKywwPT0tLU9bYl0pe2lmKGI9PT13KWJyZWFrO2I9dFtyK2Fbdl1dfWlmKGs8YiYmKEUmZikhPT1sKXtmb3IoMD09PVMmJihTPWspLGMrPXksej0xPDwoeD1iLVMpO3grUzx3JiYhKCh6LT1PW3grU10pPD0wKTspeCsrLHo8PD0xO2lmKEMrPTE8PHgsMT09PWUmJjg1MjxDfHwyPT09ZSYmNTkyPEMpcmV0dXJuIDE7aVtsPUUmZl09azw8MjR8eDw8MTZ8Yy1zfDB9fXJldHVybiAwIT09RSYmKGlbYytFXT1iLVM8PDI0fDY0PDwxNnwwKSxvLmJpdHM9aywwfX0se1wiLi4vdXRpbHMvY29tbW9uXCI6NDF9XSw1MTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3QuZXhwb3J0cz17MjpcIm5lZWQgZGljdGlvbmFyeVwiLDE6XCJzdHJlYW0gZW5kXCIsMDpcIlwiLFwiLTFcIjpcImZpbGUgZXJyb3JcIixcIi0yXCI6XCJzdHJlYW0gZXJyb3JcIixcIi0zXCI6XCJkYXRhIGVycm9yXCIsXCItNFwiOlwiaW5zdWZmaWNpZW50IG1lbW9yeVwiLFwiLTVcIjpcImJ1ZmZlciBlcnJvclwiLFwiLTZcIjpcImluY29tcGF0aWJsZSB2ZXJzaW9uXCJ9fSx7fV0sNTI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaT1lKFwiLi4vdXRpbHMvY29tbW9uXCIpLG89MCxoPTE7ZnVuY3Rpb24gbihlKXtmb3IodmFyIHQ9ZS5sZW5ndGg7MDw9LS10OyllW3RdPTB9dmFyIHM9MCxhPTI5LHU9MjU2LGw9dSsxK2EsZj0zMCxjPTE5LF89MipsKzEsZz0xNSxkPTE2LHA9NyxtPTI1NixiPTE2LHY9MTcseT0xOCx3PVswLDAsMCwwLDAsMCwwLDAsMSwxLDEsMSwyLDIsMiwyLDMsMywzLDMsNCw0LDQsNCw1LDUsNSw1LDBdLGs9WzAsMCwwLDAsMSwxLDIsMiwzLDMsNCw0LDUsNSw2LDYsNyw3LDgsOCw5LDksMTAsMTAsMTEsMTEsMTIsMTIsMTMsMTNdLHg9WzAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMiwzLDddLFM9WzE2LDE3LDE4LDAsOCw3LDksNiwxMCw1LDExLDQsMTIsMywxMywyLDE0LDEsMTVdLHo9bmV3IEFycmF5KDIqKGwrMikpO24oeik7dmFyIEM9bmV3IEFycmF5KDIqZik7bihDKTt2YXIgRT1uZXcgQXJyYXkoNTEyKTtuKEUpO3ZhciBBPW5ldyBBcnJheSgyNTYpO24oQSk7dmFyIEk9bmV3IEFycmF5KGEpO24oSSk7dmFyIE8sQixSLFQ9bmV3IEFycmF5KGYpO2Z1bmN0aW9uIEQoZSx0LHIsbixpKXt0aGlzLnN0YXRpY190cmVlPWUsdGhpcy5leHRyYV9iaXRzPXQsdGhpcy5leHRyYV9iYXNlPXIsdGhpcy5lbGVtcz1uLHRoaXMubWF4X2xlbmd0aD1pLHRoaXMuaGFzX3N0cmVlPWUmJmUubGVuZ3RofWZ1bmN0aW9uIEYoZSx0KXt0aGlzLmR5bl90cmVlPWUsdGhpcy5tYXhfY29kZT0wLHRoaXMuc3RhdF9kZXNjPXR9ZnVuY3Rpb24gTihlKXtyZXR1cm4gZTwyNTY/RVtlXTpFWzI1NisoZT4+PjcpXX1mdW5jdGlvbiBVKGUsdCl7ZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109MjU1JnQsZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109dD4+PjgmMjU1fWZ1bmN0aW9uIFAoZSx0LHIpe2UuYmlfdmFsaWQ+ZC1yPyhlLmJpX2J1Znw9dDw8ZS5iaV92YWxpZCY2NTUzNSxVKGUsZS5iaV9idWYpLGUuYmlfYnVmPXQ+PmQtZS5iaV92YWxpZCxlLmJpX3ZhbGlkKz1yLWQpOihlLmJpX2J1Znw9dDw8ZS5iaV92YWxpZCY2NTUzNSxlLmJpX3ZhbGlkKz1yKX1mdW5jdGlvbiBMKGUsdCxyKXtQKGUsclsyKnRdLHJbMip0KzFdKX1mdW5jdGlvbiBqKGUsdCl7Zm9yKHZhciByPTA7cnw9MSZlLGU+Pj49MSxyPDw9MSwwPC0tdDspO3JldHVybiByPj4+MX1mdW5jdGlvbiBaKGUsdCxyKXt2YXIgbixpLHM9bmV3IEFycmF5KGcrMSksYT0wO2ZvcihuPTE7bjw9ZztuKyspc1tuXT1hPWErcltuLTFdPDwxO2ZvcihpPTA7aTw9dDtpKyspe3ZhciBvPWVbMippKzFdOzAhPT1vJiYoZVsyKmldPWooc1tvXSsrLG8pKX19ZnVuY3Rpb24gVyhlKXt2YXIgdDtmb3IodD0wO3Q8bDt0KyspZS5keW5fbHRyZWVbMip0XT0wO2Zvcih0PTA7dDxmO3QrKyllLmR5bl9kdHJlZVsyKnRdPTA7Zm9yKHQ9MDt0PGM7dCsrKWUuYmxfdHJlZVsyKnRdPTA7ZS5keW5fbHRyZWVbMiptXT0xLGUub3B0X2xlbj1lLnN0YXRpY19sZW49MCxlLmxhc3RfbGl0PWUubWF0Y2hlcz0wfWZ1bmN0aW9uIE0oZSl7ODxlLmJpX3ZhbGlkP1UoZSxlLmJpX2J1Zik6MDxlLmJpX3ZhbGlkJiYoZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109ZS5iaV9idWYpLGUuYmlfYnVmPTAsZS5iaV92YWxpZD0wfWZ1bmN0aW9uIEgoZSx0LHIsbil7dmFyIGk9Mip0LHM9MipyO3JldHVybiBlW2ldPGVbc118fGVbaV09PT1lW3NdJiZuW3RdPD1uW3JdfWZ1bmN0aW9uIEcoZSx0LHIpe2Zvcih2YXIgbj1lLmhlYXBbcl0saT1yPDwxO2k8PWUuaGVhcF9sZW4mJihpPGUuaGVhcF9sZW4mJkgodCxlLmhlYXBbaSsxXSxlLmhlYXBbaV0sZS5kZXB0aCkmJmkrKywhSCh0LG4sZS5oZWFwW2ldLGUuZGVwdGgpKTspZS5oZWFwW3JdPWUuaGVhcFtpXSxyPWksaTw8PTE7ZS5oZWFwW3JdPW59ZnVuY3Rpb24gSyhlLHQscil7dmFyIG4saSxzLGEsbz0wO2lmKDAhPT1lLmxhc3RfbGl0KWZvcig7bj1lLnBlbmRpbmdfYnVmW2UuZF9idWYrMipvXTw8OHxlLnBlbmRpbmdfYnVmW2UuZF9idWYrMipvKzFdLGk9ZS5wZW5kaW5nX2J1ZltlLmxfYnVmK29dLG8rKywwPT09bj9MKGUsaSx0KTooTChlLChzPUFbaV0pK3UrMSx0KSwwIT09KGE9d1tzXSkmJlAoZSxpLT1JW3NdLGEpLEwoZSxzPU4oLS1uKSxyKSwwIT09KGE9a1tzXSkmJlAoZSxuLT1UW3NdLGEpKSxvPGUubGFzdF9saXQ7KTtMKGUsbSx0KX1mdW5jdGlvbiBZKGUsdCl7dmFyIHIsbixpLHM9dC5keW5fdHJlZSxhPXQuc3RhdF9kZXNjLnN0YXRpY190cmVlLG89dC5zdGF0X2Rlc2MuaGFzX3N0cmVlLGg9dC5zdGF0X2Rlc2MuZWxlbXMsdT0tMTtmb3IoZS5oZWFwX2xlbj0wLGUuaGVhcF9tYXg9XyxyPTA7cjxoO3IrKykwIT09c1syKnJdPyhlLmhlYXBbKytlLmhlYXBfbGVuXT11PXIsZS5kZXB0aFtyXT0wKTpzWzIqcisxXT0wO2Zvcig7ZS5oZWFwX2xlbjwyOylzWzIqKGk9ZS5oZWFwWysrZS5oZWFwX2xlbl09dTwyPysrdTowKV09MSxlLmRlcHRoW2ldPTAsZS5vcHRfbGVuLS0sbyYmKGUuc3RhdGljX2xlbi09YVsyKmkrMV0pO2Zvcih0Lm1heF9jb2RlPXUscj1lLmhlYXBfbGVuPj4xOzE8PXI7ci0tKUcoZSxzLHIpO2ZvcihpPWg7cj1lLmhlYXBbMV0sZS5oZWFwWzFdPWUuaGVhcFtlLmhlYXBfbGVuLS1dLEcoZSxzLDEpLG49ZS5oZWFwWzFdLGUuaGVhcFstLWUuaGVhcF9tYXhdPXIsZS5oZWFwWy0tZS5oZWFwX21heF09bixzWzIqaV09c1syKnJdK3NbMipuXSxlLmRlcHRoW2ldPShlLmRlcHRoW3JdPj1lLmRlcHRoW25dP2UuZGVwdGhbcl06ZS5kZXB0aFtuXSkrMSxzWzIqcisxXT1zWzIqbisxXT1pLGUuaGVhcFsxXT1pKyssRyhlLHMsMSksMjw9ZS5oZWFwX2xlbjspO2UuaGVhcFstLWUuaGVhcF9tYXhdPWUuaGVhcFsxXSxmdW5jdGlvbihlLHQpe3ZhciByLG4saSxzLGEsbyxoPXQuZHluX3RyZWUsdT10Lm1heF9jb2RlLGw9dC5zdGF0X2Rlc2Muc3RhdGljX3RyZWUsZj10LnN0YXRfZGVzYy5oYXNfc3RyZWUsYz10LnN0YXRfZGVzYy5leHRyYV9iaXRzLGQ9dC5zdGF0X2Rlc2MuZXh0cmFfYmFzZSxwPXQuc3RhdF9kZXNjLm1heF9sZW5ndGgsbT0wO2ZvcihzPTA7czw9ZztzKyspZS5ibF9jb3VudFtzXT0wO2ZvcihoWzIqZS5oZWFwW2UuaGVhcF9tYXhdKzFdPTAscj1lLmhlYXBfbWF4KzE7cjxfO3IrKylwPChzPWhbMipoWzIqKG49ZS5oZWFwW3JdKSsxXSsxXSsxKSYmKHM9cCxtKyspLGhbMipuKzFdPXMsdTxufHwoZS5ibF9jb3VudFtzXSsrLGE9MCxkPD1uJiYoYT1jW24tZF0pLG89aFsyKm5dLGUub3B0X2xlbis9byoocythKSxmJiYoZS5zdGF0aWNfbGVuKz1vKihsWzIqbisxXSthKSkpO2lmKDAhPT1tKXtkb3tmb3Iocz1wLTE7MD09PWUuYmxfY291bnRbc107KXMtLTtlLmJsX2NvdW50W3NdLS0sZS5ibF9jb3VudFtzKzFdKz0yLGUuYmxfY291bnRbcF0tLSxtLT0yfXdoaWxlKDA8bSk7Zm9yKHM9cDswIT09cztzLS0pZm9yKG49ZS5ibF9jb3VudFtzXTswIT09bjspdTwoaT1lLmhlYXBbLS1yXSl8fChoWzIqaSsxXSE9PXMmJihlLm9wdF9sZW4rPShzLWhbMippKzFdKSpoWzIqaV0saFsyKmkrMV09cyksbi0tKX19KGUsdCksWihzLHUsZS5ibF9jb3VudCl9ZnVuY3Rpb24gWChlLHQscil7dmFyIG4saSxzPS0xLGE9dFsxXSxvPTAsaD03LHU9NDtmb3IoMD09PWEmJihoPTEzOCx1PTMpLHRbMioocisxKSsxXT02NTUzNSxuPTA7bjw9cjtuKyspaT1hLGE9dFsyKihuKzEpKzFdLCsrbzxoJiZpPT09YXx8KG88dT9lLmJsX3RyZWVbMippXSs9bzowIT09aT8oaSE9PXMmJmUuYmxfdHJlZVsyKmldKyssZS5ibF90cmVlWzIqYl0rKyk6bzw9MTA/ZS5ibF90cmVlWzIqdl0rKzplLmJsX3RyZWVbMip5XSsrLHM9aSx1PShvPTApPT09YT8oaD0xMzgsMyk6aT09PWE/KGg9NiwzKTooaD03LDQpKX1mdW5jdGlvbiBWKGUsdCxyKXt2YXIgbixpLHM9LTEsYT10WzFdLG89MCxoPTcsdT00O2ZvcigwPT09YSYmKGg9MTM4LHU9Myksbj0wO248PXI7bisrKWlmKGk9YSxhPXRbMioobisxKSsxXSwhKCsrbzxoJiZpPT09YSkpe2lmKG88dSlmb3IoO0woZSxpLGUuYmxfdHJlZSksMCE9LS1vOyk7ZWxzZSAwIT09aT8oaSE9PXMmJihMKGUsaSxlLmJsX3RyZWUpLG8tLSksTChlLGIsZS5ibF90cmVlKSxQKGUsby0zLDIpKTpvPD0xMD8oTChlLHYsZS5ibF90cmVlKSxQKGUsby0zLDMpKTooTChlLHksZS5ibF90cmVlKSxQKGUsby0xMSw3KSk7cz1pLHU9KG89MCk9PT1hPyhoPTEzOCwzKTppPT09YT8oaD02LDMpOihoPTcsNCl9fW4oVCk7dmFyIHE9ITE7ZnVuY3Rpb24gSihlLHQscixuKXtQKGUsKHM8PDEpKyhuPzE6MCksMyksZnVuY3Rpb24oZSx0LHIsbil7TShlKSxuJiYoVShlLHIpLFUoZSx+cikpLGkuYXJyYXlTZXQoZS5wZW5kaW5nX2J1ZixlLndpbmRvdyx0LHIsZS5wZW5kaW5nKSxlLnBlbmRpbmcrPXJ9KGUsdCxyLCEwKX1yLl90cl9pbml0PWZ1bmN0aW9uKGUpe3F8fChmdW5jdGlvbigpe3ZhciBlLHQscixuLGkscz1uZXcgQXJyYXkoZysxKTtmb3Iobj1yPTA7bjxhLTE7bisrKWZvcihJW25dPXIsZT0wO2U8MTw8d1tuXTtlKyspQVtyKytdPW47Zm9yKEFbci0xXT1uLG49aT0wO248MTY7bisrKWZvcihUW25dPWksZT0wO2U8MTw8a1tuXTtlKyspRVtpKytdPW47Zm9yKGk+Pj03O248ZjtuKyspZm9yKFRbbl09aTw8NyxlPTA7ZTwxPDxrW25dLTc7ZSsrKUVbMjU2K2krK109bjtmb3IodD0wO3Q8PWc7dCsrKXNbdF09MDtmb3IoZT0wO2U8PTE0MzspelsyKmUrMV09OCxlKyssc1s4XSsrO2Zvcig7ZTw9MjU1Oyl6WzIqZSsxXT05LGUrKyxzWzldKys7Zm9yKDtlPD0yNzk7KXpbMiplKzFdPTcsZSsrLHNbN10rKztmb3IoO2U8PTI4NzspelsyKmUrMV09OCxlKyssc1s4XSsrO2ZvcihaKHosbCsxLHMpLGU9MDtlPGY7ZSsrKUNbMiplKzFdPTUsQ1syKmVdPWooZSw1KTtPPW5ldyBEKHosdyx1KzEsbCxnKSxCPW5ldyBEKEMsaywwLGYsZyksUj1uZXcgRChuZXcgQXJyYXkoMCkseCwwLGMscCl9KCkscT0hMCksZS5sX2Rlc2M9bmV3IEYoZS5keW5fbHRyZWUsTyksZS5kX2Rlc2M9bmV3IEYoZS5keW5fZHRyZWUsQiksZS5ibF9kZXNjPW5ldyBGKGUuYmxfdHJlZSxSKSxlLmJpX2J1Zj0wLGUuYmlfdmFsaWQ9MCxXKGUpfSxyLl90cl9zdG9yZWRfYmxvY2s9SixyLl90cl9mbHVzaF9ibG9jaz1mdW5jdGlvbihlLHQscixuKXt2YXIgaSxzLGE9MDswPGUubGV2ZWw/KDI9PT1lLnN0cm0uZGF0YV90eXBlJiYoZS5zdHJtLmRhdGFfdHlwZT1mdW5jdGlvbihlKXt2YXIgdCxyPTQwOTM2MjQ0NDc7Zm9yKHQ9MDt0PD0zMTt0Kysscj4+Pj0xKWlmKDEmciYmMCE9PWUuZHluX2x0cmVlWzIqdF0pcmV0dXJuIG87aWYoMCE9PWUuZHluX2x0cmVlWzE4XXx8MCE9PWUuZHluX2x0cmVlWzIwXXx8MCE9PWUuZHluX2x0cmVlWzI2XSlyZXR1cm4gaDtmb3IodD0zMjt0PHU7dCsrKWlmKDAhPT1lLmR5bl9sdHJlZVsyKnRdKXJldHVybiBoO3JldHVybiBvfShlKSksWShlLGUubF9kZXNjKSxZKGUsZS5kX2Rlc2MpLGE9ZnVuY3Rpb24oZSl7dmFyIHQ7Zm9yKFgoZSxlLmR5bl9sdHJlZSxlLmxfZGVzYy5tYXhfY29kZSksWChlLGUuZHluX2R0cmVlLGUuZF9kZXNjLm1heF9jb2RlKSxZKGUsZS5ibF9kZXNjKSx0PWMtMTszPD10JiYwPT09ZS5ibF90cmVlWzIqU1t0XSsxXTt0LS0pO3JldHVybiBlLm9wdF9sZW4rPTMqKHQrMSkrNSs1KzQsdH0oZSksaT1lLm9wdF9sZW4rMys3Pj4+Mywocz1lLnN0YXRpY19sZW4rMys3Pj4+Myk8PWkmJihpPXMpKTppPXM9cis1LHIrNDw9aSYmLTEhPT10P0ooZSx0LHIsbik6ND09PWUuc3RyYXRlZ3l8fHM9PT1pPyhQKGUsMisobj8xOjApLDMpLEsoZSx6LEMpKTooUChlLDQrKG4/MTowKSwzKSxmdW5jdGlvbihlLHQscixuKXt2YXIgaTtmb3IoUChlLHQtMjU3LDUpLFAoZSxyLTEsNSksUChlLG4tNCw0KSxpPTA7aTxuO2krKylQKGUsZS5ibF90cmVlWzIqU1tpXSsxXSwzKTtWKGUsZS5keW5fbHRyZWUsdC0xKSxWKGUsZS5keW5fZHRyZWUsci0xKX0oZSxlLmxfZGVzYy5tYXhfY29kZSsxLGUuZF9kZXNjLm1heF9jb2RlKzEsYSsxKSxLKGUsZS5keW5fbHRyZWUsZS5keW5fZHRyZWUpKSxXKGUpLG4mJk0oZSl9LHIuX3RyX3RhbGx5PWZ1bmN0aW9uKGUsdCxyKXtyZXR1cm4gZS5wZW5kaW5nX2J1ZltlLmRfYnVmKzIqZS5sYXN0X2xpdF09dD4+PjgmMjU1LGUucGVuZGluZ19idWZbZS5kX2J1ZisyKmUubGFzdF9saXQrMV09MjU1JnQsZS5wZW5kaW5nX2J1ZltlLmxfYnVmK2UubGFzdF9saXRdPTI1NSZyLGUubGFzdF9saXQrKywwPT09dD9lLmR5bl9sdHJlZVsyKnJdKys6KGUubWF0Y2hlcysrLHQtLSxlLmR5bl9sdHJlZVsyKihBW3JdK3UrMSldKyssZS5keW5fZHRyZWVbMipOKHQpXSsrKSxlLmxhc3RfbGl0PT09ZS5saXRfYnVmc2l6ZS0xfSxyLl90cl9hbGlnbj1mdW5jdGlvbihlKXtQKGUsMiwzKSxMKGUsbSx6KSxmdW5jdGlvbihlKXsxNj09PWUuYmlfdmFsaWQ/KFUoZSxlLmJpX2J1ZiksZS5iaV9idWY9MCxlLmJpX3ZhbGlkPTApOjg8PWUuYmlfdmFsaWQmJihlLnBlbmRpbmdfYnVmW2UucGVuZGluZysrXT0yNTUmZS5iaV9idWYsZS5iaV9idWY+Pj04LGUuYmlfdmFsaWQtPTgpfShlKX19LHtcIi4uL3V0aWxzL2NvbW1vblwiOjQxfV0sNTM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9ZnVuY3Rpb24oKXt0aGlzLmlucHV0PW51bGwsdGhpcy5uZXh0X2luPTAsdGhpcy5hdmFpbF9pbj0wLHRoaXMudG90YWxfaW49MCx0aGlzLm91dHB1dD1udWxsLHRoaXMubmV4dF9vdXQ9MCx0aGlzLmF2YWlsX291dD0wLHRoaXMudG90YWxfb3V0PTAsdGhpcy5tc2c9XCJcIix0aGlzLnN0YXRlPW51bGwsdGhpcy5kYXRhX3R5cGU9Mix0aGlzLmFkbGVyPTB9fSx7fV0sNTQ6W2Z1bmN0aW9uKGUsdCxyKXsoZnVuY3Rpb24oZSl7IWZ1bmN0aW9uKHIsbil7XCJ1c2Ugc3RyaWN0XCI7aWYoIXIuc2V0SW1tZWRpYXRlKXt2YXIgaSxzLHQsYSxvPTEsaD17fSx1PSExLGw9ci5kb2N1bWVudCxlPU9iamVjdC5nZXRQcm90b3R5cGVPZiYmT2JqZWN0LmdldFByb3RvdHlwZU9mKHIpO2U9ZSYmZS5zZXRUaW1lb3V0P2U6cixpPVwiW29iamVjdCBwcm9jZXNzXVwiPT09e30udG9TdHJpbmcuY2FsbChyLnByb2Nlc3MpP2Z1bmN0aW9uKGUpe3Byb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKXtjKGUpfSl9OmZ1bmN0aW9uKCl7aWYoci5wb3N0TWVzc2FnZSYmIXIuaW1wb3J0U2NyaXB0cyl7dmFyIGU9ITAsdD1yLm9ubWVzc2FnZTtyZXR1cm4gci5vbm1lc3NhZ2U9ZnVuY3Rpb24oKXtlPSExfSxyLnBvc3RNZXNzYWdlKFwiXCIsXCIqXCIpLHIub25tZXNzYWdlPXQsZX19KCk/KGE9XCJzZXRJbW1lZGlhdGUkXCIrTWF0aC5yYW5kb20oKStcIiRcIixyLmFkZEV2ZW50TGlzdGVuZXI/ci5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLGQsITEpOnIuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIixkKSxmdW5jdGlvbihlKXtyLnBvc3RNZXNzYWdlKGErZSxcIipcIil9KTpyLk1lc3NhZ2VDaGFubmVsPygodD1uZXcgTWVzc2FnZUNoYW5uZWwpLnBvcnQxLm9ubWVzc2FnZT1mdW5jdGlvbihlKXtjKGUuZGF0YSl9LGZ1bmN0aW9uKGUpe3QucG9ydDIucG9zdE1lc3NhZ2UoZSl9KTpsJiZcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiaW4gbC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpPyhzPWwuZG9jdW1lbnRFbGVtZW50LGZ1bmN0aW9uKGUpe3ZhciB0PWwuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTt0Lm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2MoZSksdC5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCxzLnJlbW92ZUNoaWxkKHQpLHQ9bnVsbH0scy5hcHBlbmRDaGlsZCh0KX0pOmZ1bmN0aW9uKGUpe3NldFRpbWVvdXQoYywwLGUpfSxlLnNldEltbWVkaWF0ZT1mdW5jdGlvbihlKXtcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiYoZT1uZXcgRnVuY3Rpb24oXCJcIitlKSk7Zm9yKHZhciB0PW5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoLTEpLHI9MDtyPHQubGVuZ3RoO3IrKyl0W3JdPWFyZ3VtZW50c1tyKzFdO3ZhciBuPXtjYWxsYmFjazplLGFyZ3M6dH07cmV0dXJuIGhbb109bixpKG8pLG8rK30sZS5jbGVhckltbWVkaWF0ZT1mfWZ1bmN0aW9uIGYoZSl7ZGVsZXRlIGhbZV19ZnVuY3Rpb24gYyhlKXtpZih1KXNldFRpbWVvdXQoYywwLGUpO2Vsc2V7dmFyIHQ9aFtlXTtpZih0KXt1PSEwO3RyeXshZnVuY3Rpb24oZSl7dmFyIHQ9ZS5jYWxsYmFjayxyPWUuYXJncztzd2l0Y2goci5sZW5ndGgpe2Nhc2UgMDp0KCk7YnJlYWs7Y2FzZSAxOnQoclswXSk7YnJlYWs7Y2FzZSAyOnQoclswXSxyWzFdKTticmVhaztjYXNlIDM6dChyWzBdLHJbMV0sclsyXSk7YnJlYWs7ZGVmYXVsdDp0LmFwcGx5KG4scil9fSh0KX1maW5hbGx5e2YoZSksdT0hMX19fX1mdW5jdGlvbiBkKGUpe2Uuc291cmNlPT09ciYmXCJzdHJpbmdcIj09dHlwZW9mIGUuZGF0YSYmMD09PWUuZGF0YS5pbmRleE9mKGEpJiZjKCtlLmRhdGEuc2xpY2UoYS5sZW5ndGgpKX19KFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzZWxmP3ZvaWQgMD09PWU/dGhpczplOnNlbGYpfSkuY2FsbCh0aGlzLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6e30pfSx7fV19LHt9LFsxMF0pKDEwKX0pOyIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDE4IFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZlciA9IHZvaWQgMDtcbi8vIENyZWF0ZSBhIHByb21pc2Ugd2l0aCBleHBvc2VkIHJlc29sdmUgYW5kIHJlamVjdCBjYWxsYmFja3MuXG5mdW5jdGlvbiBkZWZlcigpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGxldCByZXNvbHZlID0gbnVsbDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGxldCByZWplY3QgPSBudWxsO1xuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IFtyZXNvbHZlLCByZWplY3RdID0gW3JlcywgcmVqXSk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihwLCB7IHJlc29sdmUsIHJlamVjdCB9KTtcbn1cbmV4cG9ydHMuZGVmZXIgPSBkZWZlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pZ25vcmVDYWNoZVVuYWN0aW9uYWJsZUVycm9ycyA9IGV4cG9ydHMuZ2V0RXJyb3JNZXNzYWdlID0gdm9pZCAwO1xuLy8gQXR0ZW1wdCB0byBjb2VyY2UgYW4gZXJyb3Igb2JqZWN0IGludG8gYSBzdHJpbmcgbWVzc2FnZS5cbi8vIFNvbWV0aW1lcyBhbiBlcnJvciBtZXNzYWdlIGlzIHdyYXBwZWQgaW4gYW4gRXJyb3Igb2JqZWN0LCBzb21ldGltZXMgbm90LlxuZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKGUpIHtcbiAgICBpZiAoZSAmJiB0eXBlb2YgZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3QgZXJyb3JPYmplY3QgPSBlO1xuICAgICAgICBpZiAoZXJyb3JPYmplY3QubWVzc2FnZSkgeyAvLyByZWd1bGFyIEVycm9yIE9iamVjdFxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhlcnJvck9iamVjdC5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChlcnJvck9iamVjdC5lcnJvcj8ubWVzc2FnZSkgeyAvLyBBUEkgcmVzdWx0XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKGVycm9yT2JqZWN0LmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFzU3RyaW5nID0gU3RyaW5nKGUpO1xuICAgIGlmIChhc1N0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoc3RyaW5naWZ5RXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBmYWlsdXJlcyBhbmQganVzdCBmYWxsIHRocm91Z2hcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXNTdHJpbmc7XG59XG5leHBvcnRzLmdldEVycm9yTWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZTtcbi8vIE9jY2FzaW9uYWxseSBvcGVyYXRpb25zIHVzaW5nIHRoZSBjYWNoZSBBUEkgdGhyb3c6XG4vLyAnVW5rbm93bkVycm9yOiBVbmV4cGVjdGVkIGludGVybmFsIGVycm9yLiB7fSdcbi8vIEl0J3Mgbm90IGNsZWFyIHVuZGVyIHdoaWNoIGNpcmN1bXN0YW5jZXMgdGhpcyBjYW4gb2NjdXIuIEEgZGl2ZSBvZlxuLy8gdGhlIENocm9taXVtIGNvZGUgZGlkbid0IHNoZWQgbXVjaCBsaWdodDpcbi8vIGh0dHBzOi8vc291cmNlLmNocm9taXVtLm9yZy9jaHJvbWl1bS9jaHJvbWl1bS9zcmMvKy9tYWluOnRoaXJkX3BhcnR5L2JsaW5rL3JlbmRlcmVyL21vZHVsZXMvY2FjaGVfc3RvcmFnZS9jYWNoZV9zdG9yYWdlX2Vycm9yLmNjO2w9MjY7ZHJjPTRjZmU4NjQ4MmIwMDBlODQ4MDA5MDc3NzgzYmEzNWY4M2YzYzNjZmVcbi8vIGh0dHBzOi8vc291cmNlLmNocm9taXVtLm9yZy9jaHJvbWl1bS9jaHJvbWl1bS9zcmMvKy9tYWluOmNvbnRlbnQvYnJvd3Nlci9jYWNoZV9zdG9yYWdlL2NhY2hlX3N0b3JhZ2VfY2FjaGUuY2M7bD0xNjg2O2RyYz1hYjY4YzA1YmViNzkwZDA0ZDFjYjdmZDhmYWEwYTE5N2ZiNDBkMzk5XG4vLyBHaXZlbiB0aGUgZXJyb3IgaXMgbm90IGFjdGlvbmFibGUgYXQgcHJlc2VudCBhbmQgY2FjaGluZyBpcyAnYmVzdFxuLy8gZWZmb3J0JyBpbiBhbnkgY2FzZSBpZ25vcmUgdGhpcyBlcnJvci4gV2Ugd2lsbCB3YW50IHRvIHRocm93IGZvclxuLy8gZXJyb3JzIGluIGdlbmVyYWwgdGhvdWdoIHNvIGFzIG5vdCB0byBoaWRlIGVycm9ycyB3ZSBhY3R1YWxseSBjb3VsZFxuLy8gZml4LlxuLy8gU2VlIGIvMjI3Nzg1NjY1IGZvciBhbiBleGFtcGxlLlxuZnVuY3Rpb24gaWdub3JlQ2FjaGVVbmFjdGlvbmFibGVFcnJvcnMoZSwgcmVzdWx0KSB7XG4gICAgaWYgKGdldEVycm9yTWVzc2FnZShlKS5pbmNsdWRlcygnVW5rbm93bkVycm9yJykpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgfVxufVxuZXhwb3J0cy5pZ25vcmVDYWNoZVVuYWN0aW9uYWJsZUVycm9ycyA9IGlnbm9yZUNhY2hlVW5hY3Rpb25hYmxlRXJyb3JzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMTggVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFzc2VydFVucmVhY2hhYmxlID0gZXhwb3J0cy5yZXBvcnRFcnJvciA9IGV4cG9ydHMuc2V0RXJyb3JIYW5kbGVyID0gZXhwb3J0cy5hc3NlcnRGYWxzZSA9IGV4cG9ydHMuYXNzZXJ0VHJ1ZSA9IGV4cG9ydHMuYXNzZXJ0RXhpc3RzID0gdm9pZCAwO1xubGV0IGVycm9ySGFuZGxlciA9IChfKSA9PiB7IH07XG5mdW5jdGlvbiBhc3NlcnRFeGlzdHModmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIGRvZXNuXFwndCBleGlzdCcpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5leHBvcnRzLmFzc2VydEV4aXN0cyA9IGFzc2VydEV4aXN0cztcbmZ1bmN0aW9uIGFzc2VydFRydWUodmFsdWUsIG9wdE1zZykge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG9wdE1zZyA/PyAnRmFpbGVkIGFzc2VydGlvbicpO1xuICAgIH1cbn1cbmV4cG9ydHMuYXNzZXJ0VHJ1ZSA9IGFzc2VydFRydWU7XG5mdW5jdGlvbiBhc3NlcnRGYWxzZSh2YWx1ZSwgb3B0TXNnKSB7XG4gICAgYXNzZXJ0VHJ1ZSghdmFsdWUsIG9wdE1zZyk7XG59XG5leHBvcnRzLmFzc2VydEZhbHNlID0gYXNzZXJ0RmFsc2U7XG5mdW5jdGlvbiBzZXRFcnJvckhhbmRsZXIoaGFuZGxlcikge1xuICAgIGVycm9ySGFuZGxlciA9IGhhbmRsZXI7XG59XG5leHBvcnRzLnNldEVycm9ySGFuZGxlciA9IHNldEVycm9ySGFuZGxlcjtcbmZ1bmN0aW9uIHJlcG9ydEVycm9yKGVycikge1xuICAgIGxldCBlcnJMb2cgPSAnJztcbiAgICBsZXQgZXJyb3JPYmogPSB1bmRlZmluZWQ7XG4gICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yRXZlbnQpIHtcbiAgICAgICAgZXJyTG9nID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgIGVycm9yT2JqID0gZXJyLmVycm9yO1xuICAgIH1cbiAgICBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQpIHtcbiAgICAgICAgZXJyTG9nID0gYCR7ZXJyLnJlYXNvbn1gO1xuICAgICAgICBlcnJvck9iaiA9IGVyci5yZWFzb247XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlcnJMb2cgPSBgJHtlcnJ9YDtcbiAgICB9XG4gICAgaWYgKGVycm9yT2JqICE9PSB1bmRlZmluZWQgJiYgZXJyb3JPYmogIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgZXJyU3RhY2sgPSBlcnJvck9iai5zdGFjaztcbiAgICAgICAgZXJyTG9nICs9ICdcXG4nO1xuICAgICAgICBlcnJMb2cgKz0gZXJyU3RhY2sgIT09IHVuZGVmaW5lZCA/IGVyclN0YWNrIDogSlNPTi5zdHJpbmdpZnkoZXJyb3JPYmopO1xuICAgIH1cbiAgICBlcnJMb2cgKz0gJ1xcblxcbic7XG4gICAgZXJyTG9nICs9IGBVQTogJHtuYXZpZ2F0b3IudXNlckFnZW50fVxcbmA7XG4gICAgY29uc29sZS5lcnJvcihlcnJMb2csIGVycik7XG4gICAgZXJyb3JIYW5kbGVyKGVyckxvZyk7XG59XG5leHBvcnRzLnJlcG9ydEVycm9yID0gcmVwb3J0RXJyb3I7XG4vLyBUaGlzIGZ1bmN0aW9uIHNlcnZlcyB0d28gcHVycG9zZXMuXG4vLyAxKSBBIHJ1bnRpbWUgY2hlY2sgLSBpZiB3ZSBhcmUgZXZlciBjYWxsZWQsIHdlIHRocm93IGFuIGV4Y2VwdGlvbi5cbi8vIFRoaXMgaXMgdXNlZnVsIGZvciBjaGVja2luZyB0aGF0IGNvZGUgd2Ugc3VzcGVjdCBzaG91bGQgbmV2ZXIgYmUgcmVhY2hlZCBpc1xuLy8gYWN0dWFsbHkgbmV2ZXIgcmVhY2hlZC5cbi8vIDIpIEEgY29tcGlsZSB0aW1lIGNoZWNrIHdoZXJlIHR5cGVzY3JpcHQgYXNzZXJ0cyB0aGF0IHRoZSB2YWx1ZSBwYXNzZWQgY2FuIGJlXG4vLyBjYXN0IHRvIHRoZSBcIm5ldmVyXCIgdHlwZS5cbi8vIFRoaXMgaXMgdXNlZnVsIGZvciBlbnN1cmluZyB3ZSBleGhhc3RpdmVseSBjaGVjayB1bmlvbiB0eXBlcy5cbmZ1bmN0aW9uIGFzc2VydFVucmVhY2hhYmxlKF94KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGNvZGUgc2hvdWxkIG5vdCBiZSByZWFjaGFibGUnKTtcbn1cbmV4cG9ydHMuYXNzZXJ0VW5yZWFjaGFibGUgPSBhc3NlcnRVbnJlYWNoYWJsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIzIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0VudW1WYWx1ZSA9IGV4cG9ydHMuaXNTdHJpbmcgPSBleHBvcnRzLnNoYWxsb3dFcXVhbHMgPSBleHBvcnRzLmxvb2t1cFBhdGggPSB2b2lkIDA7XG4vLyBHaXZlbiBhbiBvYmplY3QsIHJldHVybiBhIHJlZiB0byB0aGUgb2JqZWN0IG9yIGl0ZW0gYXQgYXQgYSBnaXZlbiBwYXRoLlxuLy8gQSBwYXRoIGlzIGRlZmluZWQgdXNpbmcgYW4gYXJyYXkgb2YgcGF0aC1saWtlIGVsZW1lbnRzOiBJLmUuIFtzdHJpbmd8bnVtYmVyXS5cbi8vIFJldHVybnMgdW5kZWZpbmVkIGlmIHRoZSBwYXRoIGRvZXNuJ3QgZXhpc3QuXG4vLyBOb3RlOiBUaGlzIGlzIGFuIGFwcHJvcHJpYXRlIHVzZSBvZiBgYW55YCwgYXMgd2UgYXJlIGtub3dpbmdseSBnZXR0aW5nIGZhc3Rcbi8vIGFuZCBsb29zZSB3aXRoIHRoZSB0eXBlIHN5c3RlbSBpbiB0aGlzIGZ1bmN0aW9uOiBpdCdzIGJhc2ljYWxseSBKYXZhU2NyaXB0LlxuLy8gQXR0ZW1wdGluZyB0byBwcmV0ZW5kIGl0J3MgYW55dGhpbmcgZWxzZSB3b3VsZCByZXN1bHQgaW4gc3VwZXJmbHVvdXMgdHlwZVxuLy8gYXNzZXJ0aW9ucyB3aGljaCB3b3VsZCBoYXZlIG5vIGJlbmVmaXQuXG4vLyBJJ20gc3VyZSB3ZSBjb3VsZCBjb252aW5jZSBUeXBlU2NyaXB0IHRvIGZvbGxvdyB0aGUgcGF0aCBhbmQgdHlwZSBldmVyeXRoaW5nXG4vLyBjb3JyZWN0bHkgYWxvbmcgdGhlIHdheSwgYnV0IHRoYXQncyBhIGpvYiBmb3IgYW5vdGhlciBkYXkuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuZnVuY3Rpb24gbG9va3VwUGF0aCh2YWx1ZSwgcGF0aCkge1xuICAgIGxldCBvID0gdmFsdWU7XG4gICAgZm9yIChjb25zdCBwIG9mIHBhdGgpIHtcbiAgICAgICAgaWYgKHAgaW4gbykge1xuICAgICAgICAgICAgbyA9IG9bcF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvO1xufVxuZXhwb3J0cy5sb29rdXBQYXRoID0gbG9va3VwUGF0aDtcbmZ1bmN0aW9uIHNoYWxsb3dFcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBvYmpBID0gYTtcbiAgICBjb25zdCBvYmpCID0gYjtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmpBKSkge1xuICAgICAgICBpZiAob2JqQVtrZXldICE9PSBvYmpCW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmpCKSkge1xuICAgICAgICBpZiAob2JqQVtrZXldICE9PSBvYmpCW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuc2hhbGxvd0VxdWFscyA9IHNoYWxsb3dFcXVhbHM7XG5mdW5jdGlvbiBpc1N0cmluZyhzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzID09PSAnc3RyaW5nJyB8fCBzIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuLy8gR2l2ZW4gYSBzdHJpbmcgZW51bSB8ZW51bXwsIGNoZWNrIHRoYXQgfHZhbHVlfCBpcyBhIHZhbGlkIG1lbWJlciBvZiB8ZW51bXwuXG5mdW5jdGlvbiBpc0VudW1WYWx1ZShlbm0sIHZhbHVlKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZW5tKS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5leHBvcnRzLmlzRW51bVZhbHVlID0gaXNFbnVtVmFsdWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAxOSBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudW5kb0NvbW1vbkNoYXRBcHBSZXBsYWNlbWVudHMgPSBleHBvcnRzLnNxbGl0ZVN0cmluZyA9IGV4cG9ydHMuYmluYXJ5RGVjb2RlID0gZXhwb3J0cy5iaW5hcnlFbmNvZGUgPSBleHBvcnRzLnV0ZjhEZWNvZGUgPSBleHBvcnRzLnV0ZjhFbmNvZGUgPSBleHBvcnRzLmhleEVuY29kZSA9IGV4cG9ydHMuYmFzZTY0RGVjb2RlID0gZXhwb3J0cy5iYXNlNjRFbmNvZGUgPSB2b2lkIDA7XG5jb25zdCBiYXNlNjRfMSA9IHJlcXVpcmUoXCJAcHJvdG9idWZqcy9iYXNlNjRcIik7XG5jb25zdCB1dGY4XzEgPSByZXF1aXJlKFwiQHByb3RvYnVmanMvdXRmOFwiKTtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuL2xvZ2dpbmdcIik7XG4vLyBUZXh0RGVjb2Rlci9EZWNvZGVyIHJlcXVpcmVzIHRoZSBmdWxsIERPTSBhbmQgaXNuJ3QgYXZhaWxhYmxlIGluIGFsbCB0eXBlc1xuLy8gb2YgdGVzdHMuIFVzZSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBmcm9tIHByb3RidWZqcy5cbmxldCBVdGY4RGVjb2RlcjtcbmxldCBVdGY4RW5jb2RlcjtcbnRyeSB7XG4gICAgVXRmOERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0Zi04Jyk7XG4gICAgVXRmOEVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbn1cbmNhdGNoIChfKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBTaWxlbmNlIHRoZSB3YXJuaW5nIHdoZW4gd2Uga25vdyB3ZSBhcmUgcnVubmluZyB1bmRlciBOb2RlSlMuXG4gICAgICAgIGNvbnNvbGUud2FybignVXNpbmcgZmFsbGJhY2sgVVRGOCBFbmNvZGVyL0RlY29kZXIsIFRoaXMgc2hvdWxkIGhhcHBlbiBvbmx5IGluICcgK1xuICAgICAgICAgICAgJ3Rlc3RzIGFuZCBOb2RlSlMtYmFzZWQgZW52aXJvbm1lbnRzLCBub3QgaW4gYnJvd3NlcnMuJyk7XG4gICAgfVxuICAgIFV0ZjhEZWNvZGVyID0geyBkZWNvZGU6IChidWYpID0+ICgwLCB1dGY4XzEucmVhZCkoYnVmLCAwLCBidWYubGVuZ3RoKSB9O1xuICAgIFV0ZjhFbmNvZGVyID0ge1xuICAgICAgICBlbmNvZGU6IChzdHIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KCgwLCB1dGY4XzEubGVuZ3RoKShzdHIpKTtcbiAgICAgICAgICAgIGNvbnN0IHdyaXR0ZW4gPSAoMCwgdXRmOF8xLndyaXRlKShzdHIsIGFyciwgMCk7XG4gICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHdyaXR0ZW4gPT09IGFyci5sZW5ndGgpO1xuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZnVuY3Rpb24gYmFzZTY0RW5jb2RlKGJ1ZmZlcikge1xuICAgIHJldHVybiAoMCwgYmFzZTY0XzEuZW5jb2RlKShidWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGgpO1xufVxuZXhwb3J0cy5iYXNlNjRFbmNvZGUgPSBiYXNlNjRFbmNvZGU7XG5mdW5jdGlvbiBiYXNlNjREZWNvZGUoc3RyKSB7XG4gICAgLy8gaWYgdGhlIHN0cmluZyBpcyBpbiBiYXNlNjR1cmwgZm9ybWF0LCBjb252ZXJ0IHRvIGJhc2U2NFxuICAgIGNvbnN0IGI2NCA9IHN0ci5yZXBsYWNlQWxsKCctJywgJysnKS5yZXBsYWNlQWxsKCdfJywgJy8nKTtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheSgoMCwgYmFzZTY0XzEubGVuZ3RoKShiNjQpKTtcbiAgICBjb25zdCB3cml0dGVuID0gKDAsIGJhc2U2NF8xLmRlY29kZSkoYjY0LCBhcnIsIDApO1xuICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkod3JpdHRlbiA9PT0gYXJyLmxlbmd0aCk7XG4gICAgcmV0dXJuIGFycjtcbn1cbmV4cG9ydHMuYmFzZTY0RGVjb2RlID0gYmFzZTY0RGVjb2RlO1xuLy8gZW5jb2RlIGJpbmFyeSBhcnJheSB0byBoZXggc3RyaW5nXG5mdW5jdGlvbiBoZXhFbmNvZGUoYnl0ZXMpIHtcbiAgICByZXR1cm4gYnl0ZXMucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyAoJzAnICsgY3VyLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpLCAnJyk7XG59XG5leHBvcnRzLmhleEVuY29kZSA9IGhleEVuY29kZTtcbmZ1bmN0aW9uIHV0ZjhFbmNvZGUoc3RyKSB7XG4gICAgcmV0dXJuIFV0ZjhFbmNvZGVyLmVuY29kZShzdHIpO1xufVxuZXhwb3J0cy51dGY4RW5jb2RlID0gdXRmOEVuY29kZTtcbi8vIE5vdGU6IG5vdCBhbGwgYnl0ZSBzZXF1ZW5jZXMgY2FuIGJlIGNvbnZlcnRlZCB0bzw+ZnJvbSBVVEY4LiBUaGlzIGNhbiBiZVxuLy8gdXNlZCBvbmx5IHdpdGggdmFsaWQgdW5pY29kZSBzdHJpbmdzLCBub3QgYXJiaXRyYXJ5IGJ5dGUgYnVmZmVycy5cbmZ1bmN0aW9uIHV0ZjhEZWNvZGUoYnVmZmVyKSB7XG4gICAgcmV0dXJuIFV0ZjhEZWNvZGVyLmRlY29kZShidWZmZXIpO1xufVxuZXhwb3J0cy51dGY4RGVjb2RlID0gdXRmOERlY29kZTtcbi8vIFRoZSBiaW5hcnlFbmNvZGUvRGVjb2RlIGZ1bmN0aW9ucyBiZWxvdyBhbGxvdyB0byBlbmNvZGUgYW4gYXJiaXRyYXJ5IGJpbmFyeVxuLy8gYnVmZmVyIGludG8gYSBzdHJpbmcgdGhhdCBjYW4gYmUgSlNPTi1lbmNvZGVkLiBiaW5hcnlFbmNvZGUoKSBhcHBsaWVzXG4vLyBVVEYtMTYgZW5jb2RpbmcgdG8gZWFjaCBieXRlIGluZGl2aWR1YWxseS5cbi8vIFVubGlrZSB1dGY4RW5jb2RlL0RlY29kZSwgYW55IGFyYml0cmFyeSBieXRlIHNlcXVlbmNlIGNhbiBiZSBjb252ZXJ0ZWQgaW50byBhXG4vLyB2YWxpZCBzdHJpbmcsIGFuZCB2aWNldmVyc2EuXG4vLyBUaGlzIHNob3VsZCBiZSBvbmx5IHVzZWQgd2hlbiBhIGJ5dGUgYXJyYXkgbmVlZHMgdG8gYmUgdHJhbnNtaXR0ZWQgb3ZlciBhblxuLy8gaW50ZXJmYWNlIHRoYXQgc3VwcG9ydHMgb25seSBKU09OIHNlcmlhbGl6YXRpb24gKGUuZy4sIHBvc3RtZXNzYWdlIHRvIGFcbi8vIGNocm9tZSBleHRlbnNpb24pLlxuZnVuY3Rpb24gYmluYXJ5RW5jb2RlKGJ1Zikge1xuICAgIGxldCBzdHIgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuZXhwb3J0cy5iaW5hcnlFbmNvZGUgPSBiaW5hcnlFbmNvZGU7XG5mdW5jdGlvbiBiaW5hcnlEZWNvZGUoc3RyKSB7XG4gICAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc3RyLmxlbmd0aCk7XG4gICAgY29uc3Qgc3RyTGVuID0gc3RyLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgICAgIGJ1ZltpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXR1cm4gYnVmO1xufVxuZXhwb3J0cy5iaW5hcnlEZWNvZGUgPSBiaW5hcnlEZWNvZGU7XG4vLyBBIGZ1bmN0aW9uIHVzZWQgdG8gaW50ZXJwb2xhdGUgc3RyaW5ncyBpbnRvIFNRTCBxdWVyeS4gVGhlIG9ubHkgcmVwbGFjZW1lbnRcbi8vIGlzIGRvbmUgaXMgdGhhdCBzaW5nbGUgcXVvdGUgcmVwbGFjZWQgd2l0aCB0d28gc2luZ2xlIHF1b3RlcywgYWNjb3JkaW5nIHRvXG4vLyBTUUxpdGUgZG9jdW1lbnRhdGlvbjpcbi8vIGh0dHBzOi8vd3d3LnNxbGl0ZS5vcmcvbGFuZ19leHByLmh0bWwjbGl0ZXJhbF92YWx1ZXNfY29uc3RhbnRzX1xuLy9cbi8vIFRoZSBwdXJwb3NlIG9mIHRoaXMgZnVuY3Rpb24gaXMgdG8gdXNlIGluIHNpbXBsZSBjb21wYXJpc29ucywgdG8gZXNjYXBlXG4vLyBzdHJpbmdzIHVzZWQgaW4gR0xPQiBjbGF1c2VzIHNlZSBlc2NhcGVRdWVyeSBmdW5jdGlvbi5cbmZ1bmN0aW9uIHNxbGl0ZVN0cmluZyhzdHIpIHtcbiAgICByZXR1cm4gYCcke3N0ci5yZXBsYWNlQWxsKCdcXCcnLCAnXFwnXFwnJyl9J2A7XG59XG5leHBvcnRzLnNxbGl0ZVN0cmluZyA9IHNxbGl0ZVN0cmluZztcbi8vIENoYXQgYXBwcyAoaW5jbHVkaW5nIEcgQ2hhdCkgc29tZXRpbWVzIHJlcGxhY2UgQVNDSUkgY2hhcmFjdGVycyB3aXRoIHNpbWlsYXJcbi8vIGxvb2tpbmcgdW5pY29kZSBjaGFyYWN0ZXJzIHRoYXQgYnJlYWsgY29kZSBzbmlwcGV0cy5cbi8vIFRoaXMgZnVuY3Rpb24gYXR0ZW1wdHMgdG8gdW5kbyB0aGVzZSByZXBsYWNlbWVudHMuXG5mdW5jdGlvbiB1bmRvQ29tbW9uQ2hhdEFwcFJlcGxhY2VtZW50cyhzdHIpIHtcbiAgICAvLyBSZXBsYWNlIG5vbi1icmVha2luZyBzcGFjZXMgd2l0aCBub3JtYWwgc3BhY2VzLlxuICAgIHJldHVybiBzdHIucmVwbGFjZUFsbCgnXFx1MDBBMCcsICcgJyk7XG59XG5leHBvcnRzLnVuZG9Db21tb25DaGF0QXBwUmVwbGFjZW1lbnRzID0gdW5kb0NvbW1vbkNoYXRBcHBSZXBsYWNlbWVudHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQXJyYXlCdWZmZXJCdWlsZGVyID0gdm9pZCAwO1xuY29uc3QgdXRmOF8xID0gcmVxdWlyZShcIkBwcm90b2J1ZmpzL3V0ZjhcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3Qgb2JqZWN0X3V0aWxzXzEgPSByZXF1aXJlKFwiLi4vYmFzZS9vYmplY3RfdXRpbHNcIik7XG4vLyBSZXR1cm4gdGhlIGxlbmd0aCwgaW4gYnl0ZXMsIG9mIGEgdG9rZW4gdG8gYmUgaW5zZXJ0ZWQuXG5mdW5jdGlvbiB0b2tlbkxlbmd0aCh0b2tlbikge1xuICAgIGlmICgoMCwgb2JqZWN0X3V0aWxzXzEuaXNTdHJpbmcpKHRva2VuKSkge1xuICAgICAgICByZXR1cm4gKDAsIHV0ZjhfMS5sZW5ndGgpKHRva2VuKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG9rZW4gaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgIHJldHVybiB0b2tlbi5ieXRlTGVuZ3RoO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh0b2tlbiA+PSAwICYmIHRva2VuIDw9IDB4ZmZmZmZmZmYpO1xuICAgICAgICAvLyAzMi1iaXQgaW50ZWdlcnMgdGFrZSA0IGJ5dGVzXG4gICAgICAgIHJldHVybiA0O1xuICAgIH1cbn1cbi8vIEluc2VydCBhIHRva2VuIGludG8gdGhlIGJ1ZmZlciwgYXQgcG9zaXRpb24gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEBwYXJhbSBkYXRhVmlldyBBIERhdGFWaWV3IGludG8gdGhlIGJ1ZmZlciB0byB3cml0ZSBpbnRvLlxuLy8gQHBhcmFtIHR5cGVkQXJyYXkgQSBVaW50OEFycmF5IHZpZXcgaW50byB0aGUgYnVmZmVyIHRvIHdyaXRlIGludG8uXG4vLyBAcGFyYW0gYnl0ZU9mZnNldCBQb3NpdGlvbiB0byB3cml0ZSBhdCwgaW4gdGhlIGJ1ZmZlci5cbi8vIEBwYXJhbSB0b2tlbiBUb2tlbiB0byBpbnNlcnQgaW50byB0aGUgYnVmZmVyLlxuZnVuY3Rpb24gaW5zZXJ0VG9rZW4oZGF0YVZpZXcsIHR5cGVkQXJyYXksIGJ5dGVPZmZzZXQsIHRva2VuKSB7XG4gICAgaWYgKCgwLCBvYmplY3RfdXRpbHNfMS5pc1N0cmluZykodG9rZW4pKSB7XG4gICAgICAgIC8vIEVuY29kZSB0aGUgc3RyaW5nIGluIFVURi04XG4gICAgICAgIGNvbnN0IHdyaXR0ZW4gPSAoMCwgdXRmOF8xLndyaXRlKSh0b2tlbiwgdHlwZWRBcnJheSwgYnl0ZU9mZnNldCk7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkod3JpdHRlbiA9PT0gKDAsIHV0ZjhfMS5sZW5ndGgpKHRva2VuKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRva2VuIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAvLyBDb3B5IHRoZSBieXRlcyBmcm9tIHRoZSBvdGhlciBhcnJheVxuICAgICAgICB0eXBlZEFycmF5LnNldCh0b2tlbiwgYnl0ZU9mZnNldCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHRva2VuID49IDAgJiYgdG9rZW4gPD0gMHhmZmZmZmZmZik7XG4gICAgICAgIC8vIDMyLWJpdCBsaXR0bGUtZW5kaWFuIHZhbHVlXG4gICAgICAgIGRhdGFWaWV3LnNldFVpbnQzMihieXRlT2Zmc2V0LCB0b2tlbiwgdHJ1ZSk7XG4gICAgfVxufVxuLy8gTGlrZSBhIHN0cmluZyBidWlsZGVyLCBidXQgZm9yIGFuIEFycmF5QnVmZmVyIGluc3RlYWQgb2YgYSBzdHJpbmcuIFRoaXNcbi8vIGFsbG93cyB1cyB0byBhc3NlbWJsZSBtZXNzYWdlcyB0byBzZW5kL3JlY2VpdmUgb3ZlciB0aGUgd2lyZS4gRGF0YSBjYW4gYmVcbi8vIGFwcGVuZGVkIHRvIHRoZSBidWZmZXIgdXNpbmcgYGFwcGVuZCgpYC4gVGhlIGRhdGEgd2UgYXBwZW5kIGNhbiBiZSBvZiB0aGVcbi8vIGZvbGxvd2luZyB0eXBlczpcbi8vXG4vLyAtIHN0cmluZzogdGhlIEFTQ0lJIHN0cmluZyBpcyBhcHBlbmRlZC4gVGhyb3dzIGFuIGVycm9yIGlmIHRoZXJlIGFyZVxuLy8gICAgICAgICAgIG5vbi1BU0NJSSBjaGFyYWN0ZXJzLlxuLy8gLSBudW1iZXI6IHRoZSBudW1iZXIgaXMgYXBwZW5kZWQgYXMgYSAzMi1iaXQgbGl0dGxlLWVuZGlhbiBpbnRlZ2VyLlxuLy8gLSBVaW50OEFycmF5OiB0aGUgYnl0ZXMgYXJlIGFwcGVuZGVkIGFzLWlzIHRvIHRoZSBidWZmZXIuXG5jbGFzcyBBcnJheUJ1ZmZlckJ1aWxkZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYW4gYEFycmF5QnVmZmVyYCB0aGF0IGlzIHRoZSBjb25jYXRlbmF0aW9uIG9mIGFsbCB0aGUgdG9rZW5zLlxuICAgIHRvQXJyYXlCdWZmZXIoKSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgYnVmZmVyIHdlIG5lZWQuXG4gICAgICAgIGxldCBieXRlTGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgYnl0ZUxlbmd0aCArPSB0b2tlbkxlbmd0aCh0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWxsb2NhdGUgdGhlIGJ1ZmZlci5cbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVMZW5ndGgpO1xuICAgICAgICBjb25zdCBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgICAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgICAgICAgLy8gRmlsbCB0aGUgYnVmZmVyIHdpdGggdGhlIHRva2Vucy5cbiAgICAgICAgbGV0IGJ5dGVPZmZzZXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICBpbnNlcnRUb2tlbihkYXRhVmlldywgdHlwZWRBcnJheSwgYnl0ZU9mZnNldCwgdG9rZW4pO1xuICAgICAgICAgICAgYnl0ZU9mZnNldCArPSB0b2tlbkxlbmd0aCh0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShieXRlT2Zmc2V0ID09PSBieXRlTGVuZ3RoKTtcbiAgICAgICAgLy8gUmV0dXJuIHRoZSB2YWx1ZXMuXG4gICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgfVxuICAgIC8vIEFkZCBvbmUgb3IgbW9yZSB0b2tlbnMgdG8gdGhlIHZhbHVlIG9mIHRoaXMgb2JqZWN0LlxuICAgIGFwcGVuZCh0b2tlbikge1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHRva2VuKTtcbiAgICB9XG59XG5leHBvcnRzLkFycmF5QnVmZmVyQnVpbGRlciA9IEFycmF5QnVmZmVyQnVpbGRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZGJDb25uZWN0aW9uSW1wbCA9IHZvaWQgMDtcbmNvbnN0IGN1c3RvbV91dGlsc18xID0gcmVxdWlyZShcImN1c3RvbV91dGlsc1wiKTtcbmNvbnN0IGRlZmVycmVkXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9kZWZlcnJlZFwiKTtcbmNvbnN0IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEgPSByZXF1aXJlKFwiLi4vYXJyYXlfYnVmZmVyX2J1aWxkZXJcIik7XG5jb25zdCBhZGJfZmlsZV9oYW5kbGVyXzEgPSByZXF1aXJlKFwiLi9hZGJfZmlsZV9oYW5kbGVyXCIpO1xuY29uc3QgdGV4dERlY29kZXIgPSBuZXcgY3VzdG9tX3V0aWxzXzEuX1RleHREZWNvZGVyKCk7XG5jbGFzcyBBZGJDb25uZWN0aW9uSW1wbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIG9uU3RhdHVzIGFuZCBvbkRpc2Nvbm5lY3QgYXJlIHNldCB0byBjYWxsYmFja3MgcGFzc2VkIGZyb20gdGhlIGNhbGxlci5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zIGZvciBpbnN0YW5jZSBpbiB0aGUgQW5kcm9pZFdlYnVzYlRhcmdldCwgd2hpY2ggaW5zdGFudGlhdGVzXG4gICAgICAgIC8vIHRoZW0gd2l0aCBjYWxsYmFja3MgcGFzc2VkIGZyb20gdGhlIFVJLlxuICAgICAgICB0aGlzLm9uU3RhdHVzID0gKCkgPT4geyB9O1xuICAgICAgICB0aGlzLm9uRGlzY29ubmVjdCA9IChfKSA9PiB7IH07XG4gICAgfVxuICAgIC8vIFN0YXJ0cyBhIHNoZWxsIGNvbW1hbmQsIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBjb21tYW5kXG4gICAgLy8gY29tcGxldGVzLlxuICAgIGFzeW5jIHNoZWxsQW5kV2FpdENvbXBsZXRpb24oY21kKSB7XG4gICAgICAgIGNvbnN0IGFkYlN0cmVhbSA9IGF3YWl0IHRoaXMuc2hlbGwoY21kKTtcbiAgICAgICAgY29uc3Qgb25TdHJlYW1pbmdFbmRlZCA9ICgwLCBkZWZlcnJlZF8xLmRlZmVyKSgpO1xuICAgICAgICAvLyBXZSB3YWl0IGZvciB0aGUgc3RyZWFtIHRvIGJlIGNsb3NlZCBieSB0aGUgZGV2aWNlLCB3aGljaCBoYXBwZW5zXG4gICAgICAgIC8vIGFmdGVyIHRoZSBzaGVsbCBjb21tYW5kIGlzIHN1Y2Nlc3NmdWxseSByZWNlaXZlZC5cbiAgICAgICAgYWRiU3RyZWFtLmFkZE9uU3RyZWFtQ2xvc2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgICAgICBvblN0cmVhbWluZ0VuZGVkLnJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvblN0cmVhbWluZ0VuZGVkO1xuICAgIH1cbiAgICAvLyBTdGFydHMgYSBzaGVsbCBjb21tYW5kLCB0aGVuIGdhdGhlcnMgYWxsIGl0cyBvdXRwdXQgYW5kIHJldHVybnMgaXQgYXNcbiAgICAvLyBhIHN0cmluZy5cbiAgICBhc3luYyBzaGVsbEFuZEdldE91dHB1dChjbWQpIHtcbiAgICAgICAgY29uc3QgYWRiU3RyZWFtID0gYXdhaXQgdGhpcy5zaGVsbChjbWQpO1xuICAgICAgICBjb25zdCBjb21tYW5kT3V0cHV0ID0gbmV3IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEuQXJyYXlCdWZmZXJCdWlsZGVyKCk7XG4gICAgICAgIGNvbnN0IG9uU3RyZWFtaW5nRW5kZWQgPSAoMCwgZGVmZXJyZWRfMS5kZWZlcikoKTtcbiAgICAgICAgYWRiU3RyZWFtLmFkZE9uU3RyZWFtRGF0YUNhbGxiYWNrKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb21tYW5kT3V0cHV0LmFwcGVuZChkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFkYlN0cmVhbS5hZGRPblN0cmVhbUNsb3NlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgb25TdHJlYW1pbmdFbmRlZC5yZXNvbHZlKHRleHREZWNvZGVyLmRlY29kZShjb21tYW5kT3V0cHV0LnRvQXJyYXlCdWZmZXIoKSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9uU3RyZWFtaW5nRW5kZWQ7XG4gICAgfVxuICAgIGFzeW5jIHB1c2goYmluYXJ5LCBwYXRoKSB7XG4gICAgICAgIGNvbnN0IGJ5dGVTdHJlYW0gPSBhd2FpdCB0aGlzLm9wZW5TdHJlYW0oJ3N5bmM6Jyk7XG4gICAgICAgIGF3YWl0IChuZXcgYWRiX2ZpbGVfaGFuZGxlcl8xLkFkYkZpbGVIYW5kbGVyKGJ5dGVTdHJlYW0pKS5wdXNoQmluYXJ5KGJpbmFyeSwgcGF0aCk7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gd2FpdCB1bnRpbCB0aGUgYnl0ZXN0cmVhbSBpcyBjbG9zZWQuIE90aGVyd2lzZSwgd2UgY2FuIGhhdmUgYVxuICAgICAgICAvLyByYWNlIGNvbmRpdGlvbjpcbiAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgbGFzdCBzdHJlYW0sIGl0IHdpbGwgdHJ5IHRvIGRpc2Nvbm5lY3QgdGhlIGRldmljZS4gSW4gdGhlXG4gICAgICAgIC8vIG1lYW50aW1lLCB0aGUgY2FsbGVyIG1pZ2h0IGNyZWF0ZSBhbm90aGVyIHN0cmVhbSB3aGljaCB3aWxsIHRyeSB0byBvcGVuXG4gICAgICAgIC8vIHRoZSBkZXZpY2UuXG4gICAgICAgIGF3YWl0IGJ5dGVTdHJlYW0uY2xvc2VBbmRXYWl0Rm9yVGVhcmRvd24oKTtcbiAgICB9XG59XG5leHBvcnRzLkFkYkNvbm5lY3Rpb25JbXBsID0gQWRiQ29ubmVjdGlvbkltcGw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiT3ZlcldlYnVzYlN0cmVhbSA9IGV4cG9ydHMuQWRiQ29ubmVjdGlvbk92ZXJXZWJ1c2IgPSBleHBvcnRzLkFkYlN0YXRlID0gZXhwb3J0cy5ERUZBVUxUX01BWF9QQVlMT0FEX0JZVEVTID0gZXhwb3J0cy5WRVJTSU9OX05PX0NIRUNLU1VNID0gZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU0gPSB2b2lkIDA7XG5jb25zdCBjdXN0b21fdXRpbHNfMSA9IHJlcXVpcmUoXCJjdXN0b21fdXRpbHNcIik7XG5jb25zdCBkZWZlcnJlZF8xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvZGVmZXJyZWRcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3Qgb2JqZWN0X3V0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9vYmplY3RfdXRpbHNcIik7XG5jb25zdCBhZGJfY29ubmVjdGlvbl9pbXBsXzEgPSByZXF1aXJlKFwiLi9hZGJfY29ubmVjdGlvbl9pbXBsXCIpO1xuY29uc3QgYWRiX2tleV9tYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9hdXRoL2FkYl9rZXlfbWFuYWdlclwiKTtcbmNvbnN0IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXCIpO1xuY29uc3QgcmVjb3JkaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9yZWNvcmRpbmdfdXRpbHNcIik7XG5jb25zdCB0ZXh0RW5jb2RlciA9IG5ldyBjdXN0b21fdXRpbHNfMS5fVGV4dEVuY29kZXIoKTtcbmNvbnN0IHRleHREZWNvZGVyID0gbmV3IGN1c3RvbV91dGlsc18xLl9UZXh0RGVjb2RlcigpO1xuZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU0gPSAweDAxMDAwMDAwO1xuZXhwb3J0cy5WRVJTSU9OX05PX0NIRUNLU1VNID0gMHgwMTAwMDAwMTtcbmV4cG9ydHMuREVGQVVMVF9NQVhfUEFZTE9BRF9CWVRFUyA9IDI1NiAqIDEwMjQ7XG52YXIgQWRiU3RhdGU7XG4oZnVuY3Rpb24gKEFkYlN0YXRlKSB7XG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJESVNDT05ORUNURURcIl0gPSAwXSA9IFwiRElTQ09OTkVDVEVEXCI7XG4gICAgLy8gQXV0aGVudGljYXRpb24gc3RlcHMsIHNlZSBBZGJDb25uZWN0aW9uT3ZlcldlYlVzYidzIGhhbmRsZUF1dGhlbnRpY2F0aW9uKCkuXG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJBVVRIX1NUQVJURURcIl0gPSAxXSA9IFwiQVVUSF9TVEFSVEVEXCI7XG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJBVVRIX1dJVEhfUFJJVkFURVwiXSA9IDJdID0gXCJBVVRIX1dJVEhfUFJJVkFURVwiO1xuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiQVVUSF9XSVRIX1BVQkxJQ1wiXSA9IDNdID0gXCJBVVRIX1dJVEhfUFVCTElDXCI7XG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJDT05ORUNURURcIl0gPSA0XSA9IFwiQ09OTkVDVEVEXCI7XG59KShBZGJTdGF0ZSB8fCAoZXhwb3J0cy5BZGJTdGF0ZSA9IEFkYlN0YXRlID0ge30pKTtcbnZhciBBdXRoQ21kO1xuKGZ1bmN0aW9uIChBdXRoQ21kKSB7XG4gICAgQXV0aENtZFtBdXRoQ21kW1wiVE9LRU5cIl0gPSAxXSA9IFwiVE9LRU5cIjtcbiAgICBBdXRoQ21kW0F1dGhDbWRbXCJTSUdOQVRVUkVcIl0gPSAyXSA9IFwiU0lHTkFUVVJFXCI7XG4gICAgQXV0aENtZFtBdXRoQ21kW1wiUlNBUFVCTElDS0VZXCJdID0gM10gPSBcIlJTQVBVQkxJQ0tFWVwiO1xufSkoQXV0aENtZCB8fCAoQXV0aENtZCA9IHt9KSk7XG5mdW5jdGlvbiBnZW5lcmF0ZUNoZWNrc3VtKGRhdGEpIHtcbiAgICBsZXQgcmVzID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuYnl0ZUxlbmd0aDsgaSsrKVxuICAgICAgICByZXMgKz0gZGF0YVtpXTtcbiAgICByZXR1cm4gcmVzICYgMHhGRkZGRkZGRjtcbn1cbmNsYXNzIEFkYkNvbm5lY3Rpb25PdmVyV2VidXNiIGV4dGVuZHMgYWRiX2Nvbm5lY3Rpb25faW1wbF8xLkFkYkNvbm5lY3Rpb25JbXBsIHtcbiAgICAvLyBXZSB1c2UgYSBrZXkgcGFpciBmb3IgYXV0aGVudGljYXRpbmcgd2l0aCB0aGUgZGV2aWNlLCB3aGljaCB3ZSBkbyBpblxuICAgIC8vIHR3byB3YXlzOlxuICAgIC8vIC0gRmlyc3RseSwgc2lnbmluZyB3aXRoIHRoZSBwcml2YXRlIGtleS5cbiAgICAvLyAtIFNlY29uZGx5LCBzZW5kaW5nIG92ZXIgdGhlIHB1YmxpYyBrZXkgKGF0IHdoaWNoIHBvaW50IHRoZSBkZXZpY2UgYXNrcyB0aGVcbiAgICAvLyAgIHVzZXIgZm9yIHBlcm1pc3Npb25zKS5cbiAgICAvLyBPbmNlIHdlJ3ZlIHNlbnQgdGhlIHB1YmxpYyBrZXksIGZvciBmdXR1cmUgcmVjb3JkaW5ncyB3ZSBvbmx5IG5lZWQgdG9cbiAgICAvLyBzaWduIHdpdGggdGhlIHByaXZhdGUga2V5LCBzbyB0aGUgdXNlciBkb2Vzbid0IG5lZWQgdG8gZ2l2ZSBwZXJtaXNzaW9uc1xuICAgIC8vIGFnYWluLlxuICAgIGNvbnN0cnVjdG9yKGRldmljZSwga2V5TWFuYWdlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyID0ga2V5TWFuYWdlcjtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRDtcbiAgICAgICAgdGhpcy5jb25uZWN0aW5nU3RyZWFtcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5zdHJlYW1zID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLm1heFBheWxvYWQgPSBleHBvcnRzLkRFRkFVTFRfTUFYX1BBWUxPQURfQllURVM7XG4gICAgICAgIHRoaXMud3JpdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoaXMud3JpdGVRdWV1ZSA9IFtdO1xuICAgICAgICAvLyBEZXZpY2VzIGFmdGVyIERlYyAyMDE3IGRvbid0IHVzZSBjaGVja3N1bS4gVGhpcyB3aWxsIGJlIGF1dG8tZGV0ZWN0ZWRcbiAgICAgICAgLy8gZHVyaW5nIHRoZSBjb25uZWN0aW9uLlxuICAgICAgICB0aGlzLnVzZUNoZWNrc3VtID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0U3RyZWFtSWQgPSAwO1xuICAgICAgICB0aGlzLnVzYlJlYWRFbmRwb2ludCA9IC0xO1xuICAgICAgICB0aGlzLnVzYldyaXRlRXBFbmRwb2ludCA9IC0xO1xuICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGVuZGluZ0Nvbm5Qcm9taXNlcyA9IFtdO1xuICAgIH1cbiAgICBzaGVsbChjbWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlblN0cmVhbSgnc2hlbGw6JyArIGNtZCk7XG4gICAgfVxuICAgIGNvbm5lY3RTb2NrZXQocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuU3RyZWFtKHBhdGgpO1xuICAgIH1cbiAgICBhc3luYyBjYW5Db25uZWN0V2l0aG91dENvbnRlbnRpb24oKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLm9wZW4oKTtcbiAgICAgICAgY29uc3QgdXNiSW50ZXJmYWNlTnVtYmVyID0gYXdhaXQgdGhpcy5zZXR1cFVzYkludGVyZmFjZSgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2UuY2xhaW1JbnRlcmZhY2UodXNiSW50ZXJmYWNlTnVtYmVyKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLnJlbGVhc2VJbnRlcmZhY2UodXNiSW50ZXJmYWNlTnVtYmVyKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgb3BlblN0cmVhbShkZXN0aW5hdGlvbikge1xuICAgICAgICBjb25zdCBzdHJlYW1JZCA9ICsrdGhpcy5sYXN0U3RyZWFtSWQ7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RpbmdTdHJlYW0gPSAoMCwgZGVmZXJyZWRfMS5kZWZlcikoKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5zZXQoc3RyZWFtSWQsIGNvbm5lY3RpbmdTdHJlYW0pO1xuICAgICAgICAvLyBXZSBjcmVhdGUgdGhlIHN0cmVhbSBiZWZvcmUgdHJ5aW5nIHRvIGVzdGFibGlzaCB0aGUgY29ubmVjdGlvbiwgc29cbiAgICAgICAgLy8gdGhhdCBpZiB3ZSBmYWlsIHRvIGNvbm5lY3QsIHdlIHdpbGwgcmVqZWN0IHRoZSBjb25uZWN0aW5nIHN0cmVhbS5cbiAgICAgICAgYXdhaXQgdGhpcy5lbnN1cmVDb25uZWN0aW9uRXN0YWJsaXNoZWQoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5zZW5kTWVzc2FnZSgnT1BFTicsIHN0cmVhbUlkLCAwLCBkZXN0aW5hdGlvbik7XG4gICAgICAgIHJldHVybiBjb25uZWN0aW5nU3RyZWFtO1xuICAgIH1cbiAgICBhc3luYyBlbnN1cmVDb25uZWN0aW9uRXN0YWJsaXNoZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5DT05ORUNURUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuRElTQ09OTkVDVEVEKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5vcGVuKCk7XG4gICAgICAgICAgICBpZiAoIShhd2FpdCB0aGlzLmNhbkNvbm5lY3RXaXRob3V0Q29udGVudGlvbigpKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB1c2JJbnRlcmZhY2VOdW1iZXIgPSBhd2FpdCB0aGlzLnNldHVwVXNiSW50ZXJmYWNlKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5jbGFpbUludGVyZmFjZSh1c2JJbnRlcmZhY2VOdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuc3RhcnRBZGJBdXRoKCk7XG4gICAgICAgIGlmICghdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZykge1xuICAgICAgICAgICAgdGhpcy51c2JSZWNlaXZlTG9vcCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbm5Qcm9taXNlID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIHRoaXMucGVuZGluZ0Nvbm5Qcm9taXNlcy5wdXNoKGNvbm5Qcm9taXNlKTtcbiAgICAgICAgYXdhaXQgY29ublByb21pc2U7XG4gICAgfVxuICAgIGFzeW5jIHNldHVwVXNiSW50ZXJmYWNlKCkge1xuICAgICAgICBjb25zdCBpbnRlcmZhY2VBbmRFbmRwb2ludCA9ICgwLCByZWNvcmRpbmdfdXRpbHNfMS5maW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQpKHRoaXMuZGV2aWNlKTtcbiAgICAgICAgLy8gYGZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludGAgd2lsbCBhbHdheXMgcmV0dXJuIGEgbm9uLW51bGwgdmFsdWUgYmVjYXVzZVxuICAgICAgICAvLyB3ZSBjaGVjayBmb3IgdGhpcyBpbiAnYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0X2ZhY3RvcnknLiBJZiBubyBpbnRlcmZhY2UgYW5kXG4gICAgICAgIC8vIGVuZHBvaW50cyBhcmUgZm91bmQsIHdlIGRvIG5vdCBjcmVhdGUgYSB0YXJnZXQsIHNvIHdlIGNhbiBub3QgY29ubmVjdCB0b1xuICAgICAgICAvLyBpdCwgc28gd2Ugd2lsbCBuZXZlciByZWFjaCB0aGlzIGxvZ2ljLlxuICAgICAgICBjb25zdCB7IGNvbmZpZ3VyYXRpb25WYWx1ZSwgdXNiSW50ZXJmYWNlTnVtYmVyLCBlbmRwb2ludHMgfSA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShpbnRlcmZhY2VBbmRFbmRwb2ludCk7XG4gICAgICAgIHRoaXMudXNiSW50ZXJmYWNlTnVtYmVyID0gdXNiSW50ZXJmYWNlTnVtYmVyO1xuICAgICAgICB0aGlzLnVzYlJlYWRFbmRwb2ludCA9IHRoaXMuZmluZEVuZHBvaW50TnVtYmVyKGVuZHBvaW50cywgJ2luJyk7XG4gICAgICAgIHRoaXMudXNiV3JpdGVFcEVuZHBvaW50ID0gdGhpcy5maW5kRW5kcG9pbnROdW1iZXIoZW5kcG9pbnRzLCAnb3V0Jyk7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkodGhpcy51c2JSZWFkRW5kcG9pbnQgPj0gMCAmJiB0aGlzLnVzYldyaXRlRXBFbmRwb2ludCA+PSAwKTtcbiAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2Uuc2VsZWN0Q29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uVmFsdWUpO1xuICAgICAgICByZXR1cm4gdXNiSW50ZXJmYWNlTnVtYmVyO1xuICAgIH1cbiAgICBhc3luYyBzdHJlYW1DbG9zZShzdHJlYW0pIHtcbiAgICAgICAgY29uc3Qgb3RoZXJTdHJlYW1zUXVldWUgPSB0aGlzLndyaXRlUXVldWUuZmlsdGVyKChxdWV1ZUVsZW1lbnQpID0+IHF1ZXVlRWxlbWVudC5sb2NhbFN0cmVhbUlkICE9PSBzdHJlYW0ubG9jYWxTdHJlYW1JZCk7XG4gICAgICAgIGNvbnN0IGRyb3BwZWRQYWNrZXRDb3VudCA9IHRoaXMud3JpdGVRdWV1ZS5sZW5ndGggLSBvdGhlclN0cmVhbXNRdWV1ZS5sZW5ndGg7XG4gICAgICAgIGlmIChkcm9wcGVkUGFja2V0Q291bnQgPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBEcm9wcGluZyAke2Ryb3BwZWRQYWNrZXRDb3VudH0gcXVldWVkIG1lc3NhZ2VzIGR1ZSB0byBzdHJlYW0gY2xvc2luZy5gKTtcbiAgICAgICAgICAgIHRoaXMud3JpdGVRdWV1ZSA9IG90aGVyU3RyZWFtc1F1ZXVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtcy5kZWxldGUoc3RyZWFtKTtcbiAgICAgICAgaWYgKHRoaXMuc3RyZWFtcy5zaXplID09PSAwKSB7XG4gICAgICAgICAgICAvLyBXZSBkaXNjb25uZWN0IEJFRk9SRSBjYWxsaW5nIGBzaWduYWxTdHJlYW1DbG9zZWRgLiBPdGhlcndpc2UsIHRoZXJlIGNhblxuICAgICAgICAgICAgLy8gYmUgYSByYWNlIGNvbmRpdGlvbjpcbiAgICAgICAgICAgIC8vIFN0cmVhbSBBOiBzdHJlYW1BLm9uU3RyZWFtQ2xvc2VcbiAgICAgICAgICAgIC8vIFN0cmVhbSBCOiBkZXZpY2Uub3BlblxuICAgICAgICAgICAgLy8gU3RyZWFtIEE6IGRldmljZS5yZWxlYXNlSW50ZXJmYWNlXG4gICAgICAgICAgICAvLyBTdHJlYW0gQjogZGV2aWNlLnRyYW5zZmVyT3V0IC0+IENSQVNIXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBzdHJlYW0uc2lnbmFsU3RyZWFtQ2xvc2VkKCk7XG4gICAgfVxuICAgIHN0cmVhbVdyaXRlKG1zZywgc3RyZWFtKSB7XG4gICAgICAgIGNvbnN0IHJhdyA9ICgoMCwgb2JqZWN0X3V0aWxzXzEuaXNTdHJpbmcpKG1zZykpID8gdGV4dEVuY29kZXIuZW5jb2RlKG1zZykgOiBtc2c7XG4gICAgICAgIGlmICh0aGlzLndyaXRlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgdGhpcy53cml0ZVF1ZXVlLnB1c2goeyBtZXNzYWdlOiByYXcsIGxvY2FsU3RyZWFtSWQ6IHN0cmVhbS5sb2NhbFN0cmVhbUlkIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud3JpdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSgnV1JURScsIHN0cmVhbS5sb2NhbFN0cmVhbUlkLCBzdHJlYW0ucmVtb3RlU3RyZWFtSWQsIHJhdyk7XG4gICAgfVxuICAgIC8vIFdlIGRpc2Nvbm5lY3QgaW4gMiBjYXNlczpcbiAgICAvLyAxLiBXaGVuIHdlIGNsb3NlIHRoZSBsYXN0IHN0cmVhbSBvZiB0aGUgY29ubmVjdGlvbi4gVGhpcyBpcyB0byBwcmV2ZW50IHRoZVxuICAgIC8vIGJyb3dzZXIgaG9sZGluZyBvbnRvIHRoZSBVU0IgaW50ZXJmYWNlIGFmdGVyIGhhdmluZyBmaW5pc2hlZCBhIHRyYWNlXG4gICAgLy8gcmVjb3JkaW5nLCB3aGljaCB3b3VsZCBtYWtlIGl0IGltcG9zc2libGUgdG8gdXNlIFwiYWRiIHNoZWxsXCIgZnJvbSB0aGUgc2FtZVxuICAgIC8vIG1hY2hpbmUgdW50aWwgdGhlIGJyb3dzZXIgaXMgY2xvc2VkLlxuICAgIC8vIDIuIFdoZW4gd2UgZ2V0IGEgVVNCIGRpc2Nvbm5lY3QgZXZlbnQuIFRoaXMgaGFwcGVucyBmb3IgaW5zdGFuY2Ugd2hlbiB0aGVcbiAgICAvLyBkZXZpY2UgaXMgdW5wbHVnZ2VkLlxuICAgIGFzeW5jIGRpc2Nvbm5lY3QoZGlzY29ubmVjdE1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENsZWFyIHRoZSByZXNvdXJjZXMgaW4gYSBzeW5jaHJvbm91cyBtZXRob2QsIGJlY2F1c2UgdGhpcyBjYW4gYmUgdXNlZFxuICAgICAgICAvLyBmb3IgZXJyb3IgaGFuZGxpbmcgY2FsbGJhY2tzIGFzIHdlbGwuXG4gICAgICAgIHRoaXMucmVhY2hEaXNjb25uZWN0U3RhdGUoZGlzY29ubmVjdE1lc3NhZ2UpO1xuICAgICAgICAvLyBXZSBoYXZlIGFscmVhZHkgZGlzY29ubmVjdGVkIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gcGFzcyBhIGNhbGxiYWNrXG4gICAgICAgIC8vIHdoaWNoIGNsZWFycyByZXNvdXJjZXMgb3Igbm90aWZpZXMgdGhlIHVzZXIgaW50byAnd3JhcFJlY29yZGluZ0Vycm9yJy5cbiAgICAgICAgYXdhaXQgKDAsIHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLndyYXBSZWNvcmRpbmdFcnJvcikodGhpcy5kZXZpY2UucmVsZWFzZUludGVyZmFjZSgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy51c2JJbnRlcmZhY2VOdW1iZXIpKSwgKCkgPT4geyB9KTtcbiAgICAgICAgdGhpcy51c2JJbnRlcmZhY2VOdW1iZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgYSBzeW5jaHJvbm91cyBtZXRob2Qgd2hpY2ggY2xlYXJzIGFsbCByZXNvdXJjZXMuXG4gICAgLy8gSXQgY2FuIGJlIHVzZWQgYXMgYSBjYWxsYmFjayBmb3IgZXJyb3IgaGFuZGxpbmcuXG4gICAgcmVhY2hEaXNjb25uZWN0U3RhdGUoZGlzY29ubmVjdE1lc3NhZ2UpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWxldGUgdGhlIHN0cmVhbXMgQkVGT1JFIGNoZWNraW5nIHRoZSBBZGIgc3RhdGUgYmVjYXVzZTpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgY3JlYXRlIHN0cmVhbXMgYmVmb3JlIGNoYW5naW5nIHRoZSBBZGIgc3RhdGUgZnJvbSBESVNDT05ORUNURUQuXG4gICAgICAgIC8vIEluIGNhc2Ugd2UgY2FuIG5vdCBjbGFpbSB0aGUgZGV2aWNlLCB3ZSB3aWxsIGNyZWF0ZSBhIHN0cmVhbSwgYnV0IGZhaWxcbiAgICAgICAgLy8gdG8gY29ubmVjdCB0byB0aGUgV2ViVVNCIGRldmljZSBzbyB0aGUgc3RhdGUgd2lsbCByZW1haW4gRElTQ09OTkVDVEVELlxuICAgICAgICBjb25zdCBzdHJlYW1zVG9EZWxldGUgPSB0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmVudHJpZXMoKTtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHN0cmVhbXMgYmVmb3JlIHJlamVjdGluZyBzbyB3ZSBhcmUgbm90IGNhdWdodCBpbiBhIGxvb3Agb2ZcbiAgICAgICAgLy8gaGFuZGxpbmcgcHJvbWlzZSByZWplY3Rpb25zLlxuICAgICAgICB0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmNsZWFyKCk7XG4gICAgICAgIGZvciAoY29uc3QgW2lkLCBzdHJlYW1dIG9mIHN0cmVhbXNUb0RlbGV0ZSkge1xuICAgICAgICAgICAgc3RyZWFtLnJlamVjdChgRmFpbGVkIHRvIG9wZW4gc3RyZWFtIHdpdGggaWQgJHtpZH0gYmVjYXVzZSBhZGIgd2FzIGRpc2Nvbm5lY3RlZC5gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuRElTQ09OTkVDVEVEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRDtcbiAgICAgICAgdGhpcy53cml0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgdGhpcy53cml0ZVF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuc3RyZWFtcy5mb3JFYWNoKChzdHJlYW0pID0+IHN0cmVhbS5jbG9zZSgpKTtcbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZGlzY29ubmVjdE1lc3NhZ2UpO1xuICAgIH1cbiAgICBhc3luYyBzdGFydEFkYkF1dGgoKSB7XG4gICAgICAgIGNvbnN0IFZFUlNJT04gPSB0aGlzLnVzZUNoZWNrc3VtID8gZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU0gOiBleHBvcnRzLlZFUlNJT05fTk9fQ0hFQ0tTVU07XG4gICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5BVVRIX1NUQVJURUQ7XG4gICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ0NOWE4nLCBWRVJTSU9OLCB0aGlzLm1heFBheWxvYWQsICdob3N0OjE6VXNiQURCJyk7XG4gICAgfVxuICAgIGZpbmRFbmRwb2ludE51bWJlcihlbmRwb2ludHMsIGRpcmVjdGlvbiwgdHlwZSA9ICdidWxrJykge1xuICAgICAgICBjb25zdCBlcCA9IGVuZHBvaW50cy5maW5kKChlcCkgPT4gZXAudHlwZSA9PT0gdHlwZSAmJiBlcC5kaXJlY3Rpb24gPT09IGRpcmVjdGlvbik7XG4gICAgICAgIGlmIChlcClcbiAgICAgICAgICAgIHJldHVybiBlcC5lbmRwb2ludE51bWJlcjtcbiAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGBDYW5ub3QgZmluZCAke2RpcmVjdGlvbn0gZW5kcG9pbnRgKTtcbiAgICB9XG4gICAgYXN5bmMgdXNiUmVjZWl2ZUxvb3AoKSB7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0RmFsc2UpKHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcpO1xuICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgZm9yICg7IHRoaXMuc3RhdGUgIT09IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRDspIHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMud3JhcFVzYih0aGlzLmRldmljZS50cmFuc2ZlckluKHRoaXMudXNiUmVhZEVuZHBvaW50LCBBREJfTVNHX1NJWkUpKTtcbiAgICAgICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICE9PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgLy8gTG9nIGFuZCBpZ25vcmUgbWVzc2FnZXMgd2l0aCBpbnZhbGlkIHN0YXR1cy4gVGhlc2UgY2FuIG9jY3VyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgZGV2aWNlIGlzIGNvbm5lY3RlZC9kaXNjb25uZWN0ZWQgcmVwZWF0ZWRseS5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBSZWNlaXZlZCBtZXNzYWdlIHdpdGggdW5leHBlY3RlZCBzdGF0dXMgJyR7cmVzLnN0YXR1c30nYCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtc2cgPSBBZGJNc2cuZGVjb2RlSGVhZGVyKHJlcy5kYXRhKTtcbiAgICAgICAgICAgIGlmIChtc2cuZGF0YUxlbiA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgdGhpcy53cmFwVXNiKHRoaXMuZGV2aWNlLnRyYW5zZmVySW4odGhpcy51c2JSZWFkRW5kcG9pbnQsIG1zZy5kYXRhTGVuKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtc2cuZGF0YSA9IG5ldyBVaW50OEFycmF5KHJlc3AuZGF0YS5idWZmZXIsIHJlc3AuZGF0YS5ieXRlT2Zmc2V0LCByZXNwLmRhdGEuYnl0ZUxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy51c2VDaGVja3N1bSAmJiBnZW5lcmF0ZUNoZWNrc3VtKG1zZy5kYXRhKSAhPT0gbXNnLmRhdGFDaGVja3N1bSkge1xuICAgICAgICAgICAgICAgIC8vIFdlIGlnbm9yZSBtZXNzYWdlcyB3aXRoIGFuIGludmFsaWQgY2hlY2tzdW0uIFRoZXNlIHNvbWV0aW1lcyBhcHBlYXJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBwYWdlIGlzIHJlLWxvYWRlZCBpbiBhIG1pZGRsZSBvZiBhIHJlY29yZGluZy5cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoZSBzZXJ2ZXIgY2FuIHN0aWxsIHNlbmQgbWVzc2FnZXMgc3RyZWFtcyBmb3IgcHJldmlvdXMgc3RyZWFtcy5cbiAgICAgICAgICAgIC8vIFRoaXMgaGFwcGVucyBmb3IgaW5zdGFuY2UgaWYgd2UgcmVjb3JkLCByZWxvYWQgdGhlIHJlY29yZGluZyBwYWdlIGFuZFxuICAgICAgICAgICAgLy8gdGhlbiByZWNvcmQgYWdhaW4uIFdlIGNhbiBhbHNvIHJlY2VpdmUgYSAnV1JURScgb3IgJ09LQVknIGFmdGVyXG4gICAgICAgICAgICAvLyB3ZSBoYXZlIHNlbnQgYSAnQ0xTRScgYW5kIG1hcmtlZCB0aGUgc3RhdGUgYXMgZGlzY29ubmVjdGVkLlxuICAgICAgICAgICAgaWYgKChtc2cuY21kID09PSAnQ0xTRScgfHwgbXNnLmNtZCA9PT0gJ1dSVEUnKSAmJlxuICAgICAgICAgICAgICAgICF0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobXNnLmFyZzEpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnT0tBWScgJiYgIXRoaXMuY29ubmVjdGluZ1N0cmVhbXMuaGFzKG1zZy5hcmcxKSAmJlxuICAgICAgICAgICAgICAgICF0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobXNnLmFyZzEpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnQVVUSCcgJiYgbXNnLmFyZzAgPT09IEF1dGhDbWQuVE9LRU4gJiZcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5BVVRIX1dJVEhfUFVCTElDKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgd2Ugc3RhcnQgYSByZWNvcmRpbmcgYnV0IGZhaWwgYmVjYXVzZSBvZiBhIGZhdWx0eSBwaHlzaWNhbFxuICAgICAgICAgICAgICAgIC8vIGNvbm5lY3Rpb24gdG8gdGhlIGRldmljZSwgd2hlbiB3ZSBzdGFydCBhIG5ldyByZWNvcmRpbmcsIHdlIHdpbGxcbiAgICAgICAgICAgICAgICAvLyByZWNlaXZlZCBtdWx0aXBsZSBBVVRIIHRva2Vucywgb2Ygd2hpY2ggd2Ugc2hvdWxkIGlnbm9yZSBhbGwgYnV0XG4gICAgICAgICAgICAgICAgLy8gb25lLlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaGFuZGxlIHRoZSBBREIgbWVzc2FnZSBmcm9tIHRoZSBkZXZpY2VcbiAgICAgICAgICAgIGlmIChtc2cuY21kID09PSAnQ0xTRScpIHtcbiAgICAgICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5nZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKG1zZy5hcmcxKSkuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdBVVRIJyAmJiBtc2cuYXJnMCA9PT0gQXV0aENtZC5UT0tFTikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHRoaXMua2V5TWFuYWdlci5nZXRLZXkoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuQVVUSF9TVEFSVEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIER1cmluZyB0aGlzIHN0ZXAsIHdlIHNlbmQgYmFjayB0aGUgdG9rZW4gcmVjZWl2ZWQgc2lnbmVkIHdpdGggb3VyXG4gICAgICAgICAgICAgICAgICAgIC8vIHByaXZhdGUga2V5LiBJZiB0aGUgZGV2aWNlIGhhcyBwcmV2aW91c2x5IHJlY2VpdmVkIG91ciBwdWJsaWMga2V5LFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZGlhbG9nIGFza2luZyBmb3IgdXNlciBjb25maXJtYXRpb24gd2lsbCBub3QgYmUgZGlzcGxheWVkIG9uXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBkZXZpY2UuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5BVVRIX1dJVEhfUFJJVkFURTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZW5kTWVzc2FnZSgnQVVUSCcsIEF1dGhDbWQuU0lHTkFUVVJFLCAwLCBrZXkuc2lnbihtc2cuZGF0YSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgb3VyIHNpZ25hdHVyZSB3aXRoIHRoZSBwcml2YXRlIGtleSBpcyBub3QgYWNjZXB0ZWQgYnkgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIGRldmljZSwgd2UgZ2VuZXJhdGUgYSBuZXcga2V5cGFpciBhbmQgc2VuZCB0aGUgcHVibGljIGtleS5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkFVVEhfV0lUSF9QVUJMSUM7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ0FVVEgnLCBBdXRoQ21kLlJTQVBVQkxJQ0tFWSwgMCwga2V5LmdldFB1YmxpY0tleSgpICsgJ1xcMCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU3RhdHVzKHJlY29yZGluZ191dGlsc18xLkFMTE9XX1VTQl9ERUJVR0dJTkcpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCAoMCwgYWRiX2tleV9tYW5hZ2VyXzEubWF5YmVTdG9yZUtleSkoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnQ05YTicpIHtcbiAgICAgICAgICAgICAgICAvL2Fzc2VydFRydWUoXG4gICAgICAgICAgICAgICAgLy8gICAgW0FkYlN0YXRlLkFVVEhfV0lUSF9QUklWQVRFLCBBZGJTdGF0ZS5BVVRIX1dJVEhfUFVCTElDXS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5zdGF0ZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5DT05ORUNURUQ7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXhQYXlsb2FkID0gbXNnLmFyZzE7XG4gICAgICAgICAgICAgICAgY29uc3QgZGV2aWNlVmVyc2lvbiA9IG1zZy5hcmcwO1xuICAgICAgICAgICAgICAgIGlmICghW2V4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNLCBleHBvcnRzLlZFUlNJT05fTk9fQ0hFQ0tTVU1dLmluY2x1ZGVzKGRldmljZVZlcnNpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihgVmVyc2lvbiAke21zZy5hcmcwfSBub3Qgc3VwcG9ydGVkLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnVzZUNoZWNrc3VtID0gZGV2aWNlVmVyc2lvbiA9PT0gZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU07XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkNPTk5FQ1RFRDtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHdpbGwgcmVzb2x2ZSB0aGUgcHJvbWlzZXMgYXdhaXRlZCBieVxuICAgICAgICAgICAgICAgIC8vIFwiZW5zdXJlQ29ubmVjdGlvbkVzdGFibGlzaGVkXCIuXG4gICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nQ29ublByb21pc2VzLmZvckVhY2goKGNvbm5Qcm9taXNlKSA9PiBjb25uUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0Nvbm5Qcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ09LQVknKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuaGFzKG1zZy5hcmcxKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25uZWN0aW5nU3RyZWFtID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuZ2V0KG1zZy5hcmcxKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0cmVhbSA9IG5ldyBBZGJPdmVyV2VidXNiU3RyZWFtKHRoaXMsIG1zZy5hcmcxLCBtc2cuYXJnMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtcy5hZGQoc3RyZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5kZWxldGUobXNnLmFyZzEpO1xuICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW5nU3RyZWFtLnJlc29sdmUoc3RyZWFtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkodGhpcy53cml0ZUluUHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgdGhpcy53cml0ZVF1ZXVlLmxlbmd0aDspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGdvIHRocm91Z2ggdGhlIHF1ZXVlZCB3cml0ZXMgYW5kIGNob29zZSB0aGUgZmlyc3Qgb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3JyZXNwb25kaW5nIHRvIGEgc3RyZWFtIHRoYXQncyBzdGlsbCBhY3RpdmUuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWV1ZWRFbGVtZW50ID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMud3JpdGVRdWV1ZS5zaGlmdCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXVlZFN0cmVhbSA9IHRoaXMuZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChxdWV1ZWRFbGVtZW50LmxvY2FsU3RyZWFtSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXVlZFN0cmVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlZFN0cmVhbS53cml0ZShxdWV1ZWRFbGVtZW50Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ1dSVEUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyZWFtID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChtc2cuYXJnMSkpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ09LQVknLCBzdHJlYW0ubG9jYWxTdHJlYW1JZCwgc3RyZWFtLnJlbW90ZVN0cmVhbUlkKTtcbiAgICAgICAgICAgICAgICBzdHJlYW0uc2lnbmFsU3RyZWFtRGF0YShtc2cuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGBVbmV4cGVjdGVkIG1lc3NhZ2UgJHttc2d9IGluIHN0YXRlICR7dGhpcy5zdGF0ZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobG9jYWxTdHJlYW1JZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHN0cmVhbSBvZiB0aGlzLnN0cmVhbXMpIHtcbiAgICAgICAgICAgIGlmIChzdHJlYW0ubG9jYWxTdHJlYW1JZCA9PT0gbG9jYWxTdHJlYW1JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJlYW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gIFRoZSBoZWFkZXIgYW5kIHRoZSBtZXNzYWdlIGRhdGEgbXVzdCBiZSBzZW50IGNvbnNlY3V0aXZlbHkuIFVzaW5nIDIgYXdhaXRzXG4gICAgLy8gIEFub3RoZXIgbWVzc2FnZSBjYW4gaW50ZXJsZWF2ZSBhZnRlciB0aGUgZmlyc3QgaGVhZGVyIGhhcyBiZWVuIHNlbnQsXG4gICAgLy8gIHJlc3VsdGluZyBpbiBzb21ldGhpbmcgbGlrZSBbaGVhZGVyMV0gW2hlYWRlcjJdIFtkYXRhMV0gW2RhdGEyXTtcbiAgICAvLyAgSW4gdGhpcyB3YXkgd2UgYXJlIHdhaXRpbmcgYm90aCBwcm9taXNlcyB0byBiZSByZXNvbHZlZCBiZWZvcmUgY29udGludWluZy5cbiAgICBhc3luYyBzZW5kTWVzc2FnZShjbWQsIGFyZzAsIGFyZzEsIGRhdGEpIHtcbiAgICAgICAgY29uc3QgbXNnID0gQWRiTXNnLmNyZWF0ZSh7IGNtZCwgYXJnMCwgYXJnMSwgZGF0YSwgdXNlQ2hlY2tzdW06IHRoaXMudXNlQ2hlY2tzdW0gfSk7XG4gICAgICAgIGNvbnN0IG1zZ0hlYWRlciA9IG1zZy5lbmNvZGVIZWFkZXIoKTtcbiAgICAgICAgY29uc3QgbXNnRGF0YSA9IG1zZy5kYXRhO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKG1zZ0hlYWRlci5sZW5ndGggPD0gdGhpcy5tYXhQYXlsb2FkICYmXG4gICAgICAgICAgICBtc2dEYXRhLmxlbmd0aCA8PSB0aGlzLm1heFBheWxvYWQpO1xuICAgICAgICBjb25zdCBzZW5kUHJvbWlzZXMgPSBbdGhpcy53cmFwVXNiKHRoaXMuZGV2aWNlLnRyYW5zZmVyT3V0KHRoaXMudXNiV3JpdGVFcEVuZHBvaW50LCBtc2dIZWFkZXIuYnVmZmVyKSldO1xuICAgICAgICBpZiAobXNnLmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VuZFByb21pc2VzLnB1c2godGhpcy53cmFwVXNiKHRoaXMuZGV2aWNlLnRyYW5zZmVyT3V0KHRoaXMudXNiV3JpdGVFcEVuZHBvaW50LCBtc2dEYXRhLmJ1ZmZlcikpKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChzZW5kUHJvbWlzZXMpO1xuICAgIH1cbiAgICB3cmFwVXNiKHByb21pc2UpIHtcbiAgICAgICAgcmV0dXJuICgwLCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS53cmFwUmVjb3JkaW5nRXJyb3IpKHByb21pc2UsIHRoaXMucmVhY2hEaXNjb25uZWN0U3RhdGUuYmluZCh0aGlzKSk7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJDb25uZWN0aW9uT3ZlcldlYnVzYiA9IEFkYkNvbm5lY3Rpb25PdmVyV2VidXNiO1xuLy8gQW4gQWRiT3ZlcldlYnVzYlN0cmVhbSBpcyBpbnN0YW50aWF0ZWQgYWZ0ZXIgdGhlIGNyZWF0aW9uIG9mIGEgc29ja2V0IHRvIHRoZVxuLy8gZGV2aWNlLiBUaGFua3MgdG8gdGhpcywgd2UgY2FuIHNlbmQgY29tbWFuZHMgYW5kIHJlY2VpdmUgdGhlaXIgb3V0cHV0LlxuLy8gTWVzc2FnZXMgYXJlIHJlY2VpdmVkIGluIHRoZSBtYWluIGFkYiBjbGFzcywgYW5kIGFyZSBmb3J3YXJkZWQgdG8gYW4gaW5zdGFuY2Vcbi8vIG9mIHRoaXMgY2xhc3MgYmFzZWQgb24gYSBzdHJlYW0gaWQgbWF0Y2guXG5jbGFzcyBBZGJPdmVyV2VidXNiU3RyZWFtIHtcbiAgICBjb25zdHJ1Y3RvcihhZGIsIGxvY2FsU3RyZWFtSWQsIHJlbW90ZVN0cmVhbUlkKSB7XG4gICAgICAgIHRoaXMub25TdHJlYW1EYXRhQ2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMub25TdHJlYW1DbG9zZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLnJlbW90ZVN0cmVhbUlkID0gLTE7XG4gICAgICAgIHRoaXMuYWRiQ29ubmVjdGlvbiA9IGFkYjtcbiAgICAgICAgdGhpcy5sb2NhbFN0cmVhbUlkID0gbG9jYWxTdHJlYW1JZDtcbiAgICAgICAgdGhpcy5yZW1vdGVTdHJlYW1JZCA9IHJlbW90ZVN0cmVhbUlkO1xuICAgICAgICAvLyBXaGVuIHRoZSBzdHJlYW0gaXMgY3JlYXRlZCwgdGhlIGNvbm5lY3Rpb24gaGFzIGJlZW4gYWxyZWFkeSBlc3RhYmxpc2hlZC5cbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBhZGRPblN0cmVhbURhdGFDYWxsYmFjayhvblN0cmVhbURhdGEpIHtcbiAgICAgICAgdGhpcy5vblN0cmVhbURhdGFDYWxsYmFja3MucHVzaChvblN0cmVhbURhdGEpO1xuICAgIH1cbiAgICBhZGRPblN0cmVhbUNsb3NlQ2FsbGJhY2sob25TdHJlYW1DbG9zZSkge1xuICAgICAgICB0aGlzLm9uU3RyZWFtQ2xvc2VDYWxsYmFja3MucHVzaChvblN0cmVhbUNsb3NlKTtcbiAgICB9XG4gICAgLy8gVXNlZCBieSB0aGUgY29ubmVjdGlvbiBvYmplY3QgdG8gc2lnbmFsIG5ld2x5IHJlY2VpdmVkIGRhdGEsIG5vdCBleHBvc2VkXG4gICAgLy8gaW4gdGhlIGludGVyZmFjZS5cbiAgICBzaWduYWxTdHJlYW1EYXRhKGRhdGEpIHtcbiAgICAgICAgZm9yIChjb25zdCBvblN0cmVhbURhdGEgb2YgdGhpcy5vblN0cmVhbURhdGFDYWxsYmFja3MpIHtcbiAgICAgICAgICAgIG9uU3RyZWFtRGF0YShkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBVc2VkIGJ5IHRoZSBjb25uZWN0aW9uIG9iamVjdCB0byBzaWduYWwgdGhlIHN0cmVhbSBpcyBjbG9zZWQsIG5vdCBleHBvc2VkXG4gICAgLy8gaW4gdGhlIGludGVyZmFjZS5cbiAgICBzaWduYWxTdHJlYW1DbG9zZWQoKSB7XG4gICAgICAgIGZvciAoY29uc3Qgb25TdHJlYW1DbG9zZSBvZiB0aGlzLm9uU3RyZWFtQ2xvc2VDYWxsYmFja3MpIHtcbiAgICAgICAgICAgIG9uU3RyZWFtQ2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uU3RyZWFtRGF0YUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLm9uU3RyZWFtQ2xvc2VDYWxsYmFja3MgPSBbXTtcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHRoaXMuY2xvc2VBbmRXYWl0Rm9yVGVhcmRvd24oKTtcbiAgICB9XG4gICAgYXN5bmMgY2xvc2VBbmRXYWl0Rm9yVGVhcmRvd24oKSB7XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRiQ29ubmVjdGlvbi5zdHJlYW1DbG9zZSh0aGlzKTtcbiAgICB9XG4gICAgd3JpdGUobXNnKSB7XG4gICAgICAgIHRoaXMuYWRiQ29ubmVjdGlvbi5zdHJlYW1Xcml0ZShtc2csIHRoaXMpO1xuICAgIH1cbiAgICBpc0Nvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQ29ubmVjdGVkO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiT3ZlcldlYnVzYlN0cmVhbSA9IEFkYk92ZXJXZWJ1c2JTdHJlYW07XG5jb25zdCBBREJfTVNHX1NJWkUgPSA2ICogNDsgLy8gNiAqIGludDMyLlxuY2xhc3MgQWRiTXNnIHtcbiAgICBjb25zdHJ1Y3RvcihjbWQsIGFyZzAsIGFyZzEsIGRhdGFMZW4sIGRhdGFDaGVja3N1bSwgdXNlQ2hlY2tzdW0gPSBmYWxzZSkge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGNtZC5sZW5ndGggPT09IDQpO1xuICAgICAgICB0aGlzLmNtZCA9IGNtZDtcbiAgICAgICAgdGhpcy5hcmcwID0gYXJnMDtcbiAgICAgICAgdGhpcy5hcmcxID0gYXJnMTtcbiAgICAgICAgdGhpcy5kYXRhTGVuID0gZGF0YUxlbjtcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YUxlbik7XG4gICAgICAgIHRoaXMuZGF0YUNoZWNrc3VtID0gZGF0YUNoZWNrc3VtO1xuICAgICAgICB0aGlzLnVzZUNoZWNrc3VtID0gdXNlQ2hlY2tzdW07XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUoeyBjbWQsIGFyZzAsIGFyZzEsIGRhdGEsIHVzZUNoZWNrc3VtID0gdHJ1ZSB9KSB7XG4gICAgICAgIGNvbnN0IGVuY29kZWREYXRhID0gdGhpcy5lbmNvZGVEYXRhKGRhdGEpO1xuICAgICAgICBjb25zdCBtc2cgPSBuZXcgQWRiTXNnKGNtZCwgYXJnMCwgYXJnMSwgZW5jb2RlZERhdGEubGVuZ3RoLCAwLCB1c2VDaGVja3N1bSk7XG4gICAgICAgIG1zZy5kYXRhID0gZW5jb2RlZERhdGE7XG4gICAgICAgIHJldHVybiBtc2c7XG4gICAgfVxuICAgIGdldCBkYXRhU3RyKCkge1xuICAgICAgICByZXR1cm4gdGV4dERlY29kZXIuZGVjb2RlKHRoaXMuZGF0YSk7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5jbWR9IFske3RoaXMuYXJnMH0sJHt0aGlzLmFyZzF9XSAke3RoaXMuZGF0YVN0cn1gO1xuICAgIH1cbiAgICAvLyBBIGJyaWVmIGRlc2NyaXB0aW9uIG9mIHRoZSBtZXNzYWdlIGNhbiBiZSBmb3VuZCBoZXJlOlxuICAgIC8vIGh0dHBzOi8vYW5kcm9pZC5nb29nbGVzb3VyY2UuY29tL3BsYXRmb3JtL3N5c3RlbS9jb3JlLysvbWFpbi9hZGIvcHJvdG9jb2wudHh0XG4gICAgLy9cbiAgICAvLyBzdHJ1Y3QgYW1lc3NhZ2Uge1xuICAgIC8vICAgICB1aW50MzJfdCBjb21tYW5kOyAgICAvLyBjb21tYW5kIGlkZW50aWZpZXIgY29uc3RhbnRcbiAgICAvLyAgICAgdWludDMyX3QgYXJnMDsgICAgICAgLy8gZmlyc3QgYXJndW1lbnRcbiAgICAvLyAgICAgdWludDMyX3QgYXJnMTsgICAgICAgLy8gc2Vjb25kIGFyZ3VtZW50XG4gICAgLy8gICAgIHVpbnQzMl90IGRhdGFfbGVuZ3RoOy8vIGxlbmd0aCBvZiBwYXlsb2FkICgwIGlzIGFsbG93ZWQpXG4gICAgLy8gICAgIHVpbnQzMl90IGRhdGFfY2hlY2s7IC8vIGNoZWNrc3VtIG9mIGRhdGEgcGF5bG9hZFxuICAgIC8vICAgICB1aW50MzJfdCBtYWdpYzsgICAgICAvLyBjb21tYW5kIF4gMHhmZmZmZmZmZlxuICAgIC8vIH07XG4gICAgc3RhdGljIGRlY29kZUhlYWRlcihkdikge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGR2LmJ5dGVMZW5ndGggPT09IEFEQl9NU0dfU0laRSk7XG4gICAgICAgIGNvbnN0IGNtZCA9IHRleHREZWNvZGVyLmRlY29kZShkdi5idWZmZXIuc2xpY2UoMCwgNCkpO1xuICAgICAgICBjb25zdCBjbWROdW0gPSBkdi5nZXRVaW50MzIoMCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGFyZzAgPSBkdi5nZXRVaW50MzIoNCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGFyZzEgPSBkdi5nZXRVaW50MzIoOCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGRhdGFMZW4gPSBkdi5nZXRVaW50MzIoMTIsIHRydWUpO1xuICAgICAgICBjb25zdCBkYXRhQ2hlY2tzdW0gPSBkdi5nZXRVaW50MzIoMTYsIHRydWUpO1xuICAgICAgICBjb25zdCBjbWRDaGVja3N1bSA9IGR2LmdldFVpbnQzMigyMCwgdHJ1ZSk7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkoY21kTnVtID09PSAoY21kQ2hlY2tzdW0gXiAweEZGRkZGRkZGKSk7XG4gICAgICAgIHJldHVybiBuZXcgQWRiTXNnKGNtZCwgYXJnMCwgYXJnMSwgZGF0YUxlbiwgZGF0YUNoZWNrc3VtKTtcbiAgICB9XG4gICAgZW5jb2RlSGVhZGVyKCkge1xuICAgICAgICBjb25zdCBidWYgPSBuZXcgVWludDhBcnJheShBREJfTVNHX1NJWkUpO1xuICAgICAgICBjb25zdCBkdiA9IG5ldyBEYXRhVmlldyhidWYuYnVmZmVyKTtcbiAgICAgICAgY29uc3QgY21kQnl0ZXMgPSB0ZXh0RW5jb2Rlci5lbmNvZGUodGhpcy5jbWQpO1xuICAgICAgICBjb25zdCByYXdNc2cgPSBBZGJNc2cuZW5jb2RlRGF0YSh0aGlzLmRhdGEpO1xuICAgICAgICBjb25zdCBjaGVja3N1bSA9IHRoaXMudXNlQ2hlY2tzdW0gPyBnZW5lcmF0ZUNoZWNrc3VtKHJhd01zZykgOiAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKylcbiAgICAgICAgICAgIGR2LnNldFVpbnQ4KGksIGNtZEJ5dGVzW2ldKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDQsIHRoaXMuYXJnMCwgdHJ1ZSk7XG4gICAgICAgIGR2LnNldFVpbnQzMig4LCB0aGlzLmFyZzEsIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMTIsIHJhd01zZy5ieXRlTGVuZ3RoLCB0cnVlKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDE2LCBjaGVja3N1bSwgdHJ1ZSk7XG4gICAgICAgIGR2LnNldFVpbnQzMigyMCwgZHYuZ2V0VWludDMyKDAsIHRydWUpIF4gMHhGRkZGRkZGRiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBidWY7XG4gICAgfVxuICAgIHN0YXRpYyBlbmNvZGVEYXRhKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShbXSk7XG4gICAgICAgIGlmICgoMCwgb2JqZWN0X3V0aWxzXzEuaXNTdHJpbmcpKGRhdGEpKVxuICAgICAgICAgICAgcmV0dXJuIHRleHRFbmNvZGVyLmVuY29kZShkYXRhICsgJ1xcMCcpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiRmlsZUhhbmRsZXIgPSB2b2lkIDA7XG5jb25zdCBjdXN0b21fdXRpbHNfMSA9IHJlcXVpcmUoXCJjdXN0b21fdXRpbHNcIik7XG5jb25zdCBkZWZlcnJlZF8xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvZGVmZXJyZWRcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3QgYXJyYXlfYnVmZmVyX2J1aWxkZXJfMSA9IHJlcXVpcmUoXCIuLi9hcnJheV9idWZmZXJfYnVpbGRlclwiKTtcbmNvbnN0IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXCIpO1xuY29uc3QgcmVjb3JkaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9yZWNvcmRpbmdfdXRpbHNcIik7XG4vLyBodHRwczovL2NzLmFuZHJvaWQuY29tL2FuZHJvaWQvcGxhdGZvcm0vc3VwZXJwcm9qZWN0LysvbWFpbjpwYWNrYWdlcy9cbi8vIG1vZHVsZXMvYWRiL2ZpbGVfc3luY19wcm90b2NvbC5oO2w9MTQ0XG5jb25zdCBNQVhfU1lOQ19TRU5EX0NIVU5LX1NJWkUgPSA2NCAqIDEwMjQ7XG4vLyBBZGIgZG9lcyBub3QgYWNjdXJhdGVseSBzZW5kIHNvbWUgZmlsZSBwZXJtaXNzaW9ucy4gSWYgeW91IG5lZWQgYSBzcGVjaWFsIHNldFxuLy8gb2YgcGVybWlzc2lvbnMsIGRvIG5vdCByZWx5IG9uIHRoaXMgdmFsdWUuIFJhdGhlciwgc2VuZCBhIHNoZWxsIGNvbW1hbmQgd2hpY2hcbi8vIGV4cGxpY2l0bHkgc2V0cyBwZXJtaXNzaW9ucywgc3VjaCBhczpcbi8vICdzaGVsbDpjaG1vZCAke3Blcm1pc3Npb25zfSAke3BhdGh9J1xuY29uc3QgRklMRV9QRVJNSVNTSU9OUyA9IDIgKiogMTUgKyAwbzY0NDtcbmNvbnN0IHRleHREZWNvZGVyID0gbmV3IGN1c3RvbV91dGlsc18xLl9UZXh0RGVjb2RlcigpO1xuLy8gRm9yIGRldGFpbHMgYWJvdXQgdGhlIHByb3RvY29sLCBzZWU6XG4vLyBodHRwczovL2NzLmFuZHJvaWQuY29tL2FuZHJvaWQvcGxhdGZvcm0vc3VwZXJwcm9qZWN0LysvbWFpbjpwYWNrYWdlcy9tb2R1bGVzL2FkYi9TWU5DLlRYVFxuY2xhc3MgQWRiRmlsZUhhbmRsZXIge1xuICAgIGNvbnN0cnVjdG9yKGJ5dGVTdHJlYW0pIHtcbiAgICAgICAgdGhpcy5ieXRlU3RyZWFtID0gYnl0ZVN0cmVhbTtcbiAgICAgICAgdGhpcy5zZW50Qnl0ZUNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5pc1B1c2hPbmdvaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGFzeW5jIHB1c2hCaW5hcnkoYmluYXJ5LCBwYXRoKSB7XG4gICAgICAgIC8vIEZvciBhIGdpdmVuIGJ5dGVTdHJlYW0sIHdlIG9ubHkgc3VwcG9ydCBwdXNoaW5nIG9uZSBiaW5hcnkgYXQgYSB0aW1lLlxuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydEZhbHNlKSh0aGlzLmlzUHVzaE9uZ29pbmcpO1xuICAgICAgICB0aGlzLmlzUHVzaE9uZ29pbmcgPSB0cnVlO1xuICAgICAgICBjb25zdCB0cmFuc2ZlckZpbmlzaGVkID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIHRoaXMuYnl0ZVN0cmVhbS5hZGRPblN0cmVhbURhdGFDYWxsYmFjaygoZGF0YSkgPT4gdGhpcy5vblN0cmVhbURhdGEoZGF0YSwgdHJhbnNmZXJGaW5pc2hlZCkpO1xuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0uYWRkT25TdHJlYW1DbG9zZUNhbGxiYWNrKCgpID0+IHRoaXMuaXNQdXNoT25nb2luZyA9IGZhbHNlKTtcbiAgICAgICAgY29uc3Qgc2VuZE1lc3NhZ2UgPSBuZXcgYXJyYXlfYnVmZmVyX2J1aWxkZXJfMS5BcnJheUJ1ZmZlckJ1aWxkZXIoKTtcbiAgICAgICAgLy8gJ1NFTkQnIGlzIHRoZSBBUEkgbWV0aG9kIHVzZWQgdG8gc2VuZCBhIGZpbGUgdG8gZGV2aWNlLlxuICAgICAgICBzZW5kTWVzc2FnZS5hcHBlbmQoJ1NFTkQnKTtcbiAgICAgICAgLy8gVGhlIHJlbW90ZSBmaWxlIG5hbWUgaXMgc3BsaXQgaW50byB0d28gcGFydHMgc2VwYXJhdGVkIGJ5IHRoZSBsYXN0XG4gICAgICAgIC8vIGNvbW1hIChcIixcIikuIFRoZSBmaXJzdCBwYXJ0IGlzIHRoZSBhY3R1YWwgcGF0aCwgd2hpbGUgdGhlIHNlY29uZCBpcyBhXG4gICAgICAgIC8vIGRlY2ltYWwgZW5jb2RlZCBmaWxlIG1vZGUgY29udGFpbmluZyB0aGUgcGVybWlzc2lvbnMgb2YgdGhlIGZpbGUgb25cbiAgICAgICAgLy8gZGV2aWNlLlxuICAgICAgICBzZW5kTWVzc2FnZS5hcHBlbmQocGF0aC5sZW5ndGggKyA2KTtcbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKHBhdGgpO1xuICAgICAgICBzZW5kTWVzc2FnZS5hcHBlbmQoJywnKTtcbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKEZJTEVfUEVSTUlTU0lPTlMudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuYnl0ZVN0cmVhbS53cml0ZShuZXcgVWludDhBcnJheShzZW5kTWVzc2FnZS50b0FycmF5QnVmZmVyKCkpKTtcbiAgICAgICAgd2hpbGUgKCEoYXdhaXQgdGhpcy5zZW5kTmV4dERhdGFDaHVuayhiaW5hcnkpKSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgcmV0dXJuIHRyYW5zZmVyRmluaXNoZWQ7XG4gICAgfVxuICAgIG9uU3RyZWFtRGF0YShkYXRhLCB0cmFuc2ZlckZpbmlzaGVkKSB7XG4gICAgICAgIHRoaXMuc2VudEJ5dGVDb3VudCA9IDA7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gdGV4dERlY29kZXIuZGVjb2RlKGRhdGEpO1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3BsaXQoJ1xcbicpWzBdLmluY2x1ZGVzKCdGQUlMJykpIHtcbiAgICAgICAgICAgIC8vIFNhbXBsZSBmYWlsdXJlIHJlc3BvbnNlICh3aGVuIHRoZSBmaWxlIGlzIHRyYW5zZmVycmVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICAgICAgLy8gYnV0IHRoZSBkYXRlIGlzIG5vdCBmb3JtYXR0ZWQgY29ycmVjdGx5KTpcbiAgICAgICAgICAgIC8vICdPS0FZRkFJTFxcbnBhdGggdG9vIGxvbmcnXG4gICAgICAgICAgICB0cmFuc2ZlckZpbmlzaGVkLnJlamVjdChuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoYCR7cmVjb3JkaW5nX3V0aWxzXzEuQklOQVJZX1BVU0hfRkFJTFVSRX06ICR7cmVzcG9uc2V9YCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRleHREZWNvZGVyLmRlY29kZShkYXRhKS5zdWJzdHJpbmcoMCwgNCkgPT09ICdPS0FZJykge1xuICAgICAgICAgICAgLy8gSW4gY2FzZSBvZiBzdWNjZXNzLCB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSBsYXN0IHJlcXVlc3Qgd2l0aFxuICAgICAgICAgICAgLy8gJ09LQVknLlxuICAgICAgICAgICAgdHJhbnNmZXJGaW5pc2hlZC5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoYCR7cmVjb3JkaW5nX3V0aWxzXzEuQklOQVJZX1BVU0hfVU5LTk9XTl9SRVNQT05TRX06ICR7cmVzcG9uc2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgc2VuZE5leHREYXRhQ2h1bmsoYmluYXJ5KSB7XG4gICAgICAgIGNvbnN0IGVuZFBvc2l0aW9uID0gTWF0aC5taW4odGhpcy5zZW50Qnl0ZUNvdW50ICsgTUFYX1NZTkNfU0VORF9DSFVOS19TSVpFLCBiaW5hcnkuYnl0ZUxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGNodW5rID0gYXdhaXQgYmluYXJ5LnNsaWNlKHRoaXMuc2VudEJ5dGVDb3VudCwgZW5kUG9zaXRpb24pO1xuICAgICAgICAvLyBUaGUgZmlsZSBpcyBzZW50IGluIGNodW5rcy4gRWFjaCBjaHVuayBpcyBwcmVmaXhlZCB3aXRoIFwiREFUQVwiIGFuZCB0aGVcbiAgICAgICAgLy8gY2h1bmsgbGVuZ3RoLiBUaGlzIGlzIHJlcGVhdGVkIHVudGlsIHRoZSBlbnRpcmUgZmlsZSBpcyB0cmFuc2ZlcnJlZC4gRWFjaFxuICAgICAgICAvLyBjaHVuayBtdXN0IG5vdCBiZSBsYXJnZXIgdGhhbiA2NGsuXG4gICAgICAgIGNvbnN0IGNodW5rTGVuZ3RoID0gY2h1bmsuYnl0ZUxlbmd0aDtcbiAgICAgICAgY29uc3QgZGF0YU1lc3NhZ2UgPSBuZXcgYXJyYXlfYnVmZmVyX2J1aWxkZXJfMS5BcnJheUJ1ZmZlckJ1aWxkZXIoKTtcbiAgICAgICAgZGF0YU1lc3NhZ2UuYXBwZW5kKCdEQVRBJyk7XG4gICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZChjaHVua0xlbmd0aCk7XG4gICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZChuZXcgVWludDhBcnJheShjaHVuay5idWZmZXIsIGNodW5rLmJ5dGVPZmZzZXQsIGNodW5rTGVuZ3RoKSk7XG4gICAgICAgIHRoaXMuc2VudEJ5dGVDb3VudCArPSBjaHVua0xlbmd0aDtcbiAgICAgICAgY29uc3QgaXNEb25lID0gdGhpcy5zZW50Qnl0ZUNvdW50ID09PSBiaW5hcnkuYnl0ZUxlbmd0aDtcbiAgICAgICAgaWYgKGlzRG9uZSkge1xuICAgICAgICAgICAgLy8gV2hlbiB0aGUgZmlsZSBpcyB0cmFuc2ZlcnJlZCBhIHN5bmMgcmVxdWVzdCBcIkRPTkVcIiBpcyBzZW50LCB0b2dldGhlclxuICAgICAgICAgICAgLy8gd2l0aCBhIHRpbWVzdGFtcCwgcmVwcmVzZW50aW5nIHRoZSBsYXN0IG1vZGlmaWVkIHRpbWUgZm9yIHRoZSBmaWxlLiBUaGVcbiAgICAgICAgICAgIC8vIHNlcnZlciByZXNwb25kcyB0byB0aGlzIGxhc3QgcmVxdWVzdC5cbiAgICAgICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZCgnRE9ORScpO1xuICAgICAgICAgICAgLy8gV2Ugc2VuZCB0aGUgZGF0ZSBpbiBzZWNvbmRzLlxuICAgICAgICAgICAgZGF0YU1lc3NhZ2UuYXBwZW5kKE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0ud3JpdGUobmV3IFVpbnQ4QXJyYXkoZGF0YU1lc3NhZ2UudG9BcnJheUJ1ZmZlcigpKSk7XG4gICAgICAgIHJldHVybiBpc0RvbmU7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJGaWxlSGFuZGxlciA9IEFkYkZpbGVIYW5kbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYktleSA9IHZvaWQgMDtcbmNvbnN0IGpzYm5fcnNhXzEgPSByZXF1aXJlKFwianNibi1yc2FcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3Qgc3RyaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9zdHJpbmdfdXRpbHNcIik7XG5jb25zdCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMSA9IHJlcXVpcmUoXCIuLi9yZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdcIik7XG5jb25zdCBXT1JEX1NJWkUgPSA0O1xuY29uc3QgTU9EVUxVU19TSVpFX0JJVFMgPSAyMDQ4O1xuY29uc3QgTU9EVUxVU19TSVpFID0gTU9EVUxVU19TSVpFX0JJVFMgLyA4O1xuY29uc3QgTU9EVUxVU19TSVpFX1dPUkRTID0gTU9EVUxVU19TSVpFIC8gV09SRF9TSVpFO1xuY29uc3QgUFVCS0VZX0VOQ09ERURfU0laRSA9IDMgKiBXT1JEX1NJWkUgKyAyICogTU9EVUxVU19TSVpFO1xuY29uc3QgQURCX1dFQl9DUllQVE9fQUxHT1JJVEhNID0ge1xuICAgIG5hbWU6ICdSU0FTU0EtUEtDUzEtdjFfNScsXG4gICAgaGFzaDogeyBuYW1lOiAnU0hBLTEnIH0sXG4gICAgcHVibGljRXhwb25lbnQ6IG5ldyBVaW50OEFycmF5KFsweDAxLCAweDAwLCAweDAxXSksIC8vIDY1NTM3XG4gICAgbW9kdWx1c0xlbmd0aDogTU9EVUxVU19TSVpFX0JJVFMsXG59O1xuY29uc3QgQURCX1dFQl9DUllQVE9fRVhQT1JUQUJMRSA9IHRydWU7XG5jb25zdCBBREJfV0VCX0NSWVBUT19PUEVSQVRJT05TID0gWydzaWduJ107XG5jb25zdCBTSUdOSU5HX0FTTjFfUFJFRklYID0gW1xuICAgIDB4MDAsXG4gICAgMHgzMCxcbiAgICAweDIxLFxuICAgIDB4MzAsXG4gICAgMHgwOSxcbiAgICAweDA2LFxuICAgIDB4MDUsXG4gICAgMHgyQixcbiAgICAweDBFLFxuICAgIDB4MDMsXG4gICAgMHgwMixcbiAgICAweDFBLFxuICAgIDB4MDUsXG4gICAgMHgwMCxcbiAgICAweDA0LFxuICAgIDB4MTQsXG5dO1xuY29uc3QgUjMyID0ganNibl9yc2FfMS5CaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoMzIpOyAvLyAxIDw8IDMyXG5mdW5jdGlvbiBpc1ZhbGlkSnNvbldlYktleShrZXkpIHtcbiAgICByZXR1cm4ga2V5Lm4gIT09IHVuZGVmaW5lZCAmJiBrZXkuZSAhPT0gdW5kZWZpbmVkICYmIGtleS5kICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAga2V5LnAgIT09IHVuZGVmaW5lZCAmJiBrZXkucSAhPT0gdW5kZWZpbmVkICYmIGtleS5kcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIGtleS5kcSAhPT0gdW5kZWZpbmVkICYmIGtleS5xaSAhPT0gdW5kZWZpbmVkO1xufVxuLy8gQ29udmVydCBhIEJpZ0ludGVnZXIgdG8gYW4gYXJyYXkgb2YgYSBzcGVjaWZpZWQgc2l6ZSBpbiBieXRlcy5cbmZ1bmN0aW9uIGJpZ0ludFRvRml4ZWRCeXRlQXJyYXkoYm4sIHNpemUpIHtcbiAgICBjb25zdCBwYWRkZWRCbkJ5dGVzID0gYm4udG9CeXRlQXJyYXkoKTtcbiAgICBsZXQgZmlyc3ROb25aZXJvSW5kZXggPSAwO1xuICAgIHdoaWxlIChmaXJzdE5vblplcm9JbmRleCA8IHBhZGRlZEJuQnl0ZXMubGVuZ3RoICYmXG4gICAgICAgIHBhZGRlZEJuQnl0ZXNbZmlyc3ROb25aZXJvSW5kZXhdID09PSAwKSB7XG4gICAgICAgIGZpcnN0Tm9uWmVyb0luZGV4Kys7XG4gICAgfVxuICAgIGNvbnN0IGJuQnl0ZXMgPSBVaW50OEFycmF5LmZyb20ocGFkZGVkQm5CeXRlcy5zbGljZShmaXJzdE5vblplcm9JbmRleCkpO1xuICAgIGNvbnN0IHJlcyA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkoYm5CeXRlcy5sZW5ndGggPD0gcmVzLmxlbmd0aCk7XG4gICAgcmVzLnNldChibkJ5dGVzLCByZXMubGVuZ3RoIC0gYm5CeXRlcy5sZW5ndGgpO1xuICAgIHJldHVybiByZXM7XG59XG5jbGFzcyBBZGJLZXkge1xuICAgIGNvbnN0cnVjdG9yKGp3a1ByaXZhdGUpIHtcbiAgICAgICAgdGhpcy5qd2tQcml2YXRlID0gandrUHJpdmF0ZTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIEdlbmVyYXRlTmV3S2V5UGFpcigpIHtcbiAgICAgICAgLy8gQ29uc3RydWN0IGEgbmV3IENyeXB0b0tleVBhaXIgYW5kIGtlZXAgaXRzIHByaXZhdGUga2V5IGluIEpXQiBmb3JtYXQuXG4gICAgICAgIGNvbnN0IGtleVBhaXIgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmdlbmVyYXRlS2V5KEFEQl9XRUJfQ1JZUFRPX0FMR09SSVRITSwgQURCX1dFQl9DUllQVE9fRVhQT1JUQUJMRSwgQURCX1dFQl9DUllQVE9fT1BFUkFUSU9OUyk7XG4gICAgICAgIGNvbnN0IGp3a1ByaXZhdGUgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmV4cG9ydEtleSgnandrJywga2V5UGFpci5wcml2YXRlS2V5KTtcbiAgICAgICAgaWYgKCFpc1ZhbGlkSnNvbldlYktleShqd2tQcml2YXRlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKCdDb3VsZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBwcml2YXRlIGtleS4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFkYktleShqd2tQcml2YXRlKTtcbiAgICB9XG4gICAgc3RhdGljIERlc2VyaWFsaXplS2V5KHNlcmlhbGl6ZWRLZXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBZGJLZXkoSlNPTi5wYXJzZShzZXJpYWxpemVkS2V5KSk7XG4gICAgfVxuICAgIC8vIFBlcmZvcm0gYW4gUlNBIHNpZ25pbmcgb3BlcmF0aW9uIGZvciB0aGUgQURCIGF1dGggY2hhbGxlbmdlLlxuICAgIC8vXG4gICAgLy8gRm9yIHRoZSBSU0Egc2lnbmF0dXJlLCB0aGUgdG9rZW4gaXMgZXhwZWN0ZWQgdG8gaGF2ZSBhbHJlYWR5XG4gICAgLy8gaGFkIHRoZSBTSEEtMSBtZXNzYWdlIGRpZ2VzdCBhcHBsaWVkLlxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgdGhlIGFkYiB0b2tlbiB3ZSByZWNlaXZlIGZyb20gdGhlIGRldmljZSBpcyBtYWRlIHVwIG9mIDIwIHJhbmRvbWx5XG4gICAgLy8gZ2VuZXJhdGVkIGJ5dGVzIHRoYXQgYXJlIHRyZWF0ZWQgbGlrZSBhIFNIQS0xLiBUaGVyZWZvcmUsIHdlIG5lZWQgdG8gdXBkYXRlXG4gICAgLy8gdGhlIG1lc3NhZ2UgZm9ybWF0LlxuICAgIHNpZ24odG9rZW4pIHtcbiAgICAgICAgY29uc3QgcnNhS2V5ID0gbmV3IGpzYm5fcnNhXzEuUlNBS2V5KCk7XG4gICAgICAgIHJzYUtleS5zZXRQcml2YXRlRXgoKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLm4pKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLmUpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLmQpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLnApKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLnEpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLmRwKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5kcSkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUucWkpKSk7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkocnNhS2V5Lm4uYml0TGVuZ3RoKCkgPT09IE1PRFVMVVNfU0laRV9CSVRTKTtcbiAgICAgICAgLy8gTWVzc2FnZSBMYXlvdXQgKHNpemUgZXF1YWxzIHRoYXQgb2YgdGhlIGtleSBtb2R1bHVzKTpcbiAgICAgICAgLy8gMDAgMDEgRkYgRkYgRkYgRkYgLi4uIEZGIFtBU04uMSBQUkVGSVhdIFtUT0tFTl1cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KE1PRFVMVVNfU0laRSk7XG4gICAgICAgIC8vIEluaXRpYWxseSBmaWxsIHRoZSBidWZmZXIgd2l0aCB0aGUgcGFkZGluZ1xuICAgICAgICBtZXNzYWdlLmZpbGwoMHhGRik7XG4gICAgICAgIC8vIGFkZCBwcmVmaXhcbiAgICAgICAgbWVzc2FnZVswXSA9IDB4MDA7XG4gICAgICAgIG1lc3NhZ2VbMV0gPSAweDAxO1xuICAgICAgICAvLyBhZGQgdGhlIEFTTi4xIHByZWZpeFxuICAgICAgICBtZXNzYWdlLnNldChTSUdOSU5HX0FTTjFfUFJFRklYLCBtZXNzYWdlLmxlbmd0aCAtIFNJR05JTkdfQVNOMV9QUkVGSVgubGVuZ3RoIC0gdG9rZW4ubGVuZ3RoKTtcbiAgICAgICAgLy8gdGhlbiB0aGUgYWN0dWFsIHRva2VuIGF0IHRoZSBlbmRcbiAgICAgICAgbWVzc2FnZS5zZXQodG9rZW4sIG1lc3NhZ2UubGVuZ3RoIC0gdG9rZW4ubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgbWVzc2FnZUludGVnZXIgPSBuZXcganNibl9yc2FfMS5CaWdJbnRlZ2VyKEFycmF5LmZyb20obWVzc2FnZSkpO1xuICAgICAgICBjb25zdCBzaWduYXR1cmUgPSByc2FLZXkuZG9Qcml2YXRlKG1lc3NhZ2VJbnRlZ2VyKTtcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJpZ0ludFRvRml4ZWRCeXRlQXJyYXkoc2lnbmF0dXJlLCBNT0RVTFVTX1NJWkUpKTtcbiAgICB9XG4gICAgLy8gQ29uc3RydWN0IHB1YmxpYyBrZXkgdG8gbWF0Y2ggdGhlIGFkYiBmb3JtYXQ6XG4gICAgLy8gZ28vY29kZXNlYXJjaC9ydmMtYXJjL3N5c3RlbS9jb3JlL2xpYmNyeXB0b191dGlscy9hbmRyb2lkX3B1YmtleS5jO2w9MzgtNTNcbiAgICBnZXRQdWJsaWNLZXkoKSB7XG4gICAgICAgIGNvbnN0IHJzYUtleSA9IG5ldyBqc2JuX3JzYV8xLlJTQUtleSgpO1xuICAgICAgICByc2FLZXkuc2V0UHVibGljKCgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5qd2tQcml2YXRlLm4pKSkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSgoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuandrUHJpdmF0ZS5lKSkpKSk7XG4gICAgICAgIGNvbnN0IG4waW52ID0gUjMyLnN1YnRyYWN0KHJzYUtleS5uLm1vZEludmVyc2UoUjMyKSkuaW50VmFsdWUoKTtcbiAgICAgICAgY29uc3QgciA9IGpzYm5fcnNhXzEuQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KDEpLnBvdyhNT0RVTFVTX1NJWkVfQklUUyk7XG4gICAgICAgIGNvbnN0IHJyID0gci5tdWx0aXBseShyKS5tb2QocnNhS2V5Lm4pO1xuICAgICAgICBjb25zdCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoUFVCS0VZX0VOQ09ERURfU0laRSk7XG4gICAgICAgIGNvbnN0IGR2ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgICAgIGR2LnNldFVpbnQzMigwLCBNT0RVTFVTX1NJWkVfV09SRFMsIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoV09SRF9TSVpFLCBuMGludiwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGR2VTggPSBuZXcgVWludDhBcnJheShkdi5idWZmZXIsIGR2LmJ5dGVPZmZzZXQsIGR2LmJ5dGVMZW5ndGgpO1xuICAgICAgICBkdlU4LnNldChiaWdJbnRUb0ZpeGVkQnl0ZUFycmF5KHJzYUtleS5uLCBNT0RVTFVTX1NJWkUpLnJldmVyc2UoKSwgMiAqIFdPUkRfU0laRSk7XG4gICAgICAgIGR2VTguc2V0KGJpZ0ludFRvRml4ZWRCeXRlQXJyYXkocnIsIE1PRFVMVVNfU0laRSkucmV2ZXJzZSgpLCAyICogV09SRF9TSVpFICsgTU9EVUxVU19TSVpFKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDIgKiBXT1JEX1NJWkUgKyAyICogTU9EVUxVU19TSVpFLCByc2FLZXkuZSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiAoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RW5jb2RlKShkdlU4KSArICcgdWkucGVyZmV0dG8uZGV2JztcbiAgICB9XG4gICAgc2VyaWFsaXplS2V5KCkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5qd2tQcml2YXRlKTtcbiAgICB9XG59XG5leHBvcnRzLkFkYktleSA9IEFkYktleTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZGJLZXlNYW5hZ2VyID0gZXhwb3J0cy5tYXliZVN0b3JlS2V5ID0gdm9pZCAwO1xuY29uc3QgYWRiX2F1dGhfMSA9IHJlcXVpcmUoXCIuL2FkYl9hdXRoXCIpO1xuZnVuY3Rpb24gaXNQYXNzd29yZENyZWRlbnRpYWwoY3JlZCkge1xuICAgIHJldHVybiBjcmVkICE9PSBudWxsICYmIGNyZWQudHlwZSA9PT0gJ3Bhc3N3b3JkJztcbn1cbmZ1bmN0aW9uIGhhc1Bhc3N3b3JkQ3JlZGVudGlhbCgpIHtcbiAgICByZXR1cm4gJ1Bhc3N3b3JkQ3JlZGVudGlhbCcgaW4gd2luZG93O1xufVxuLy8gaG93IGxvbmcgd2Ugd2lsbCBzdG9yZSB0aGUga2V5IGluIG1lbW9yeVxuY29uc3QgS0VZX0lOX01FTU9SWV9USU1FT1VUID0gMTAwMCAqIDYwICogMzA7IC8vIDMwIG1pbnV0ZXNcbi8vIFVwZGF0ZSBjcmVkZW50aWFsIHN0b3JlIHdpdGggdGhlIGdpdmVuIGtleS5cbmFzeW5jIGZ1bmN0aW9uIG1heWJlU3RvcmVLZXkoa2V5KSB7XG4gICAgaWYgKCFoYXNQYXNzd29yZENyZWRlbnRpYWwoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBuZXcgUGFzc3dvcmRDcmVkZW50aWFsKHtcbiAgICAgICAgaWQ6ICd3ZWJ1c2ItYWRiLWtleScsXG4gICAgICAgIHBhc3N3b3JkOiBrZXkuc2VyaWFsaXplS2V5KCksXG4gICAgICAgIG5hbWU6ICdXZWJVU0IgQURCIEtleScsXG4gICAgICAgIGljb25VUkw6ICdodHRwczovL3d3dy5nb29nbGUuY29tL2Zhdmljb24uaWNvJ1xuICAgIH0pO1xuICAgIC8vIFRoZSAnU2F2ZSBwYXNzd29yZD8nIENocm9tZSBkaWFsb2d1ZSBvbmx5IGFwcGVhcnMgaWYgdGhlIGtleSBpc1xuICAgIC8vIG5vdCBhbHJlYWR5IHN0b3JlZCBpbiBDaHJvbWUuXG4gICAgYXdhaXQgbmF2aWdhdG9yLmNyZWRlbnRpYWxzLnN0b3JlKGNyZWRlbnRpYWwpO1xuICAgIC8vICdwcmV2ZW50U2lsZW50QWNjZXNzJyBndWFyYW50ZWVzIHRoZSB1c2VyIGlzIGFsd2F5cyBub3RpZmllZCB3aGVuXG4gICAgLy8gY3JlZGVudGlhbHMgYXJlIGFjY2Vzc2VkLiBTb21ldGltZXMgdGhlIHVzZXIgaXMgYXNrZWQgdG8gY2xpY2sgYSBidXR0b25cbiAgICAvLyBhbmQgb3RoZXIgdGltZXMgb25seSBhIG5vdGlmaWNhdGlvbiBpcyBzaG93biB0ZW1wb3JhcmlseS5cbiAgICBhd2FpdCBuYXZpZ2F0b3IuY3JlZGVudGlhbHMucHJldmVudFNpbGVudEFjY2VzcygpO1xufVxuZXhwb3J0cy5tYXliZVN0b3JlS2V5ID0gbWF5YmVTdG9yZUtleTtcbmNsYXNzIEFkYktleU1hbmFnZXIge1xuICAgIC8vIEZpbmRzIGEga2V5LCBieSBwcmlvcml0eTpcbiAgICAvLyAtIGxvb2tpbmcgaW4gbWVtb3J5IChpLmUuIHRoaXMua2V5KVxuICAgIC8vIC0gbG9va2luZyBpbiB0aGUgY3JlZGVudGlhbCBzdG9yZVxuICAgIC8vIC0gYW5kIGZpbmFsbHkgY3JlYXRpbmcgb25lIGZyb20gc2NyYXRjaCBpZiBuZWVkZWRcbiAgICBhc3luYyBnZXRLZXkoKSB7XG4gICAgICAgIC8vIDEuIElmIHdlIGhhdmUgYSBwcml2YXRlIGtleSBpbiBtZW1vcnksIHdlIHJldHVybiBpdC5cbiAgICAgICAgaWYgKHRoaXMua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rZXk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMi4gV2UgdHJ5IHRvIGdldCB0aGUgcHJpdmF0ZSBrZXkgZnJvbSB0aGUgYnJvd3Nlci5cbiAgICAgICAgLy8gVGhlIG1lZGlhdGlvbiBpcyBzZXQgYXMgJ29wdGlvbmFsJywgYmVjYXVzZSB3ZSB1c2VcbiAgICAgICAgLy8gJ3ByZXZlbnRTaWxlbnRBY2Nlc3MnLCB3aGljaCBzb21ldGltZXMgcmVxdWVzdHMgdGhlIHVzZXIgdG8gY2xpY2tcbiAgICAgICAgLy8gb24gYSBidXR0b24gdG8gYWxsb3cgdGhlIGF1dGgsIGJ1dCBzb21ldGltZXMgb25seSBzaG93cyBhXG4gICAgICAgIC8vIG5vdGlmaWNhdGlvbiBhbmQgZG9lcyBub3QgcmVxdWlyZSB0aGUgdXNlciB0byBjbGljayBvbiBhbnl0aGluZy5cbiAgICAgICAgLy8gSWYgd2UgaGFkIHNldCBtZWRpYXRpb24gdG8gJ3JlcXVpcmVkJywgdGhlIHVzZXIgd291bGQgaGF2ZSBiZWVuXG4gICAgICAgIC8vIGFza2VkIHRvIGNsaWNrIG9uIGEgYnV0dG9uIGV2ZXJ5IHRpbWUuXG4gICAgICAgIGlmIChoYXNQYXNzd29yZENyZWRlbnRpYWwoKSkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZWRpYXRpb246ICdvcHRpb25hbCcsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgY3JlZGVudGlhbCA9IGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5nZXQob3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAoaXNQYXNzd29yZENyZWRlbnRpYWwoY3JlZGVudGlhbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NpZ25LZXkoYWRiX2F1dGhfMS5BZGJLZXkuRGVzZXJpYWxpemVLZXkoY3JlZGVudGlhbC5wYXNzd29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIDMuIFdlIGdlbmVyYXRlIGEgbmV3IGtleSBwYWlyLlxuICAgICAgICByZXR1cm4gdGhpcy5hc3NpZ25LZXkoYXdhaXQgYWRiX2F1dGhfMS5BZGJLZXkuR2VuZXJhdGVOZXdLZXlQYWlyKCkpO1xuICAgIH1cbiAgICAvLyBBc3NpZ25zIHRoZSBrZXkgYSBuZXcgdmFsdWUsIHNldHMgYSB0aW1lb3V0IGZvciBzdG9yaW5nIHRoZSBrZXkgaW4gbWVtb3J5XG4gICAgLy8gYW5kIHRoZW4gcmV0dXJucyB0aGUgbmV3IGtleS5cbiAgICBhc3NpZ25LZXkoa2V5KSB7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICBpZiAodGhpcy5rZXlJbk1lbW9yeVRpbWVySWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmtleUluTWVtb3J5VGltZXJJZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rZXlJbk1lbW9yeVRpbWVySWQgPVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmtleSA9IHVuZGVmaW5lZCwgS0VZX0lOX01FTU9SWV9USU1FT1VUKTtcbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG59XG5leHBvcnRzLkFkYktleU1hbmFnZXIgPSBBZGJLZXlNYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlJlY29yZGluZ0Vycm9yID0gZXhwb3J0cy5zaG93UmVjb3JkaW5nTW9kYWwgPSBleHBvcnRzLndyYXBSZWNvcmRpbmdFcnJvciA9IHZvaWQgMDtcbmNvbnN0IGVycm9yc18xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvZXJyb3JzXCIpO1xuY29uc3QgcmVjb3JkaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9yZWNvcmRpbmdfdXRpbHNcIik7XG4vLyBUaGUgcGF0dGVybiBmb3IgaGFuZGxpbmcgcmVjb3JkaW5nIGVycm9yIGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgbmVzdGluZyBpblxuLy8gY2FzZSBvZiBlcnJvcnM6XG4vLyBBLiB3cmFwUmVjb3JkaW5nRXJyb3IgLT4gd3JhcHMgYSBwcm9taXNlXG4vLyBCLiBvbkZhaWx1cmUgLT4gaGFzIHVzZXIgZGVmaW5lZCBsb2dpYyBhbmQgY2FsbHMgc2hvd1JlY29yZGluZ01vZGFsXG4vLyBDLiBzaG93UmVjb3JkaW5nTW9kYWwgLT4gc2hvd3MgVVggZm9yIGEgZ2l2ZW4gZXJyb3I7IHRoaXMgaXMgbm90IGNhbGxlZFxuLy8gICAgZGlyZWN0bHkgYnkgd3JhcFJlY29yZGluZ0Vycm9yLCBiZWNhdXNlIHdlIHdhbnQgdGhlIGNhbGxlciAoc3VjaCBhcyB0aGVcbi8vICAgIFVJKSB0byBkaWN0YXRlIHRoZSBVWFxuLy8gVGhpcyBtZXRob2QgdGFrZXMgYSBwcm9taXNlIGFuZCBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGUgaW4gY2FzZSB0aGUgcHJvbWlzZVxuLy8gZmFpbHMuIEl0IHRoZW4gYXdhaXRzIHRoZSBwcm9taXNlIGFuZCBleGVjdXRlcyB0aGUgY2FsbGJhY2sgaW4gY2FzZSBvZlxuLy8gZmFpbHVyZS4gSW4gdGhlIHJlY29yZGluZyBjb2RlIGl0IGlzIHVzZWQgdG8gd3JhcDpcbi8vIDEuIEFjZXNzaW5nIHRoZSBXZWJVU0IgQVBJLlxuLy8gMi4gTWV0aG9kcyByZXR1cm5pbmcgcHJvbWlzZXMgd2hpY2ggY2FuIGJlIHJlamVjdGVkLiBGb3IgaW5zdGFuY2U6XG4vLyBhKSBXaGVuIHRoZSB1c2VyIGNsaWNrcyAnQWRkIGEgbmV3IGRldmljZScgYnV0IHRoZW4gZG9lc24ndCBzZWxlY3QgYSB2YWxpZFxuLy8gICAgZGV2aWNlLlxuLy8gYikgV2hlbiB0aGUgdXNlciBzdGFydHMgYSB0cmFjaW5nIHNlc3Npb24sIGJ1dCBjYW5jZWxzIGl0IGJlZm9yZSB0aGV5XG4vLyAgICBhdXRob3JpemUgdGhlIHNlc3Npb24gb24gdGhlIGRldmljZS5cbmFzeW5jIGZ1bmN0aW9uIHdyYXBSZWNvcmRpbmdFcnJvcihwcm9taXNlLCBvbkZhaWx1cmUpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gU29tZXRpbWVzIHRoZSBtZXNzYWdlIGlzIHdyYXBwZWQgaW4gYW4gRXJyb3Igb2JqZWN0LCBzb21ldGltZXMgbm90LCBzb1xuICAgICAgICAvLyB3ZSBtYWtlIHN1cmUgd2UgdHJhbnNmb3JtIGl0IGludG8gYSBzdHJpbmcuXG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICgwLCBlcnJvcnNfMS5nZXRFcnJvck1lc3NhZ2UpKGUpO1xuICAgICAgICBvbkZhaWx1cmUoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG5leHBvcnRzLndyYXBSZWNvcmRpbmdFcnJvciA9IHdyYXBSZWNvcmRpbmdFcnJvcjtcbmZ1bmN0aW9uIHNob3dBbGxvd1VTQkRlYnVnZ2luZygpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd0Nvbm5lY3Rpb25Mb3N0RXJyb3IoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dFeHRlbnNpb25Ob3RJbnN0YWxsZWQoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dGYWlsZWRUb1B1c2hCaW5hcnkoc3RyKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dJc3N1ZVBhcnNpbmdUaGVUcmFjZWRSZXNwb25zZShzdHIpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd05vRGV2aWNlU2VsZWN0ZWQoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dXZWJzb2NrZXRDb25uZWN0aW9uSXNzdWUoc3RyKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dXZWJVU0JFcnJvclYyKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG4vLyBTaG93cyBhIG1vZGFsIGZvciBldmVyeSBrbm93biB0eXBlIG9mIGVycm9yIHdoaWNoIGNhbiBhcmlzZSBkdXJpbmcgcmVjb3JkaW5nLlxuLy8gSW4gdGhpcyB3YXksIGVycm9ycyBvY2N1cmluZyBhdCBkaWZmZXJlbnQgbGV2ZWxzIG9mIHRoZSByZWNvcmRpbmcgcHJvY2Vzc1xuLy8gY2FuIGJlIGhhbmRsZWQgaW4gYSBjZW50cmFsIGxvY2F0aW9uLlxuZnVuY3Rpb24gc2hvd1JlY29yZGluZ01vZGFsKG1lc3NhZ2UpIHtcbiAgICBpZiAoW1xuICAgICAgICAnVW5hYmxlIHRvIGNsYWltIGludGVyZmFjZS4nLFxuICAgICAgICAnVGhlIHNwZWNpZmllZCBlbmRwb2ludCBpcyBub3QgcGFydCBvZiBhIGNsYWltZWQgYW5kIHNlbGVjdGVkICcgK1xuICAgICAgICAgICAgJ2FsdGVybmF0ZSBpbnRlcmZhY2UuJyxcbiAgICAgICAgLy8gdGhyb3duIHdoZW4gY2FsbGluZyB0aGUgJ3Jlc2V0JyBtZXRob2Qgb24gYSBXZWJVU0IgZGV2aWNlLlxuICAgICAgICAnVW5hYmxlIHRvIHJlc2V0IHRoZSBkZXZpY2UuJyxcbiAgICBdLnNvbWUoKHBhcnRPZk1lc3NhZ2UpID0+IG1lc3NhZ2UuaW5jbHVkZXMocGFydE9mTWVzc2FnZSkpKSB7XG4gICAgICAgIHNob3dXZWJVU0JFcnJvclYyKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKFtcbiAgICAgICAgJ0EgdHJhbnNmZXIgZXJyb3IgaGFzIG9jY3VycmVkLicsXG4gICAgICAgICdUaGUgZGV2aWNlIHdhcyBkaXNjb25uZWN0ZWQuJyxcbiAgICAgICAgJ1RoZSB0cmFuc2ZlciB3YXMgY2FuY2VsbGVkLicsXG4gICAgXS5zb21lKChwYXJ0T2ZNZXNzYWdlKSA9PiBtZXNzYWdlLmluY2x1ZGVzKHBhcnRPZk1lc3NhZ2UpKSB8fFxuICAgICAgICBpc0RldmljZURpc2Nvbm5lY3RlZEVycm9yKG1lc3NhZ2UpKSB7XG4gICAgICAgIHNob3dDb25uZWN0aW9uTG9zdEVycm9yKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IHJlY29yZGluZ191dGlsc18xLkFMTE9XX1VTQl9ERUJVR0dJTkcpIHtcbiAgICAgICAgc2hvd0FsbG93VVNCRGVidWdnaW5nKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzTWVzc2FnZUNvbXBvc2VkT2YobWVzc2FnZSwgW3JlY29yZGluZ191dGlsc18xLkJJTkFSWV9QVVNIX0ZBSUxVUkUsIHJlY29yZGluZ191dGlsc18xLkJJTkFSWV9QVVNIX1VOS05PV05fUkVTUE9OU0VdKSkge1xuICAgICAgICBzaG93RmFpbGVkVG9QdXNoQmluYXJ5KG1lc3NhZ2Uuc3Vic3RyaW5nKG1lc3NhZ2UuaW5kZXhPZignOicpICsgMSkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXNzYWdlID09PSByZWNvcmRpbmdfdXRpbHNfMS5OT19ERVZJQ0VfU0VMRUNURUQpIHtcbiAgICAgICAgc2hvd05vRGV2aWNlU2VsZWN0ZWQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocmVjb3JkaW5nX3V0aWxzXzEuV0VCU09DS0VUX1VOQUJMRV9UT19DT05ORUNUID09PSBtZXNzYWdlKSB7XG4gICAgICAgIHNob3dXZWJzb2NrZXRDb25uZWN0aW9uSXNzdWUobWVzc2FnZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IHJlY29yZGluZ191dGlsc18xLkVYVEVOU0lPTl9OT1RfSU5TVEFMTEVEKSB7XG4gICAgICAgIHNob3dFeHRlbnNpb25Ob3RJbnN0YWxsZWQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNNZXNzYWdlQ29tcG9zZWRPZihtZXNzYWdlLCBbXG4gICAgICAgIHJlY29yZGluZ191dGlsc18xLlBBUlNJTkdfVU5LTldPTl9SRVFVRVNUX0lELFxuICAgICAgICByZWNvcmRpbmdfdXRpbHNfMS5QQVJTSU5HX1VOQUJMRV9UT19ERUNPREVfTUVUSE9ELFxuICAgICAgICByZWNvcmRpbmdfdXRpbHNfMS5QQVJTSU5HX1VOUkVDT0dOSVpFRF9QT1JULFxuICAgICAgICByZWNvcmRpbmdfdXRpbHNfMS5QQVJTSU5HX1VOUkVDT0dOSVpFRF9NRVNTQUdFLFxuICAgIF0pKSB7XG4gICAgICAgIHNob3dJc3N1ZVBhcnNpbmdUaGVUcmFjZWRSZXNwb25zZShtZXNzYWdlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHttZXNzYWdlfWApO1xuICAgIH1cbn1cbmV4cG9ydHMuc2hvd1JlY29yZGluZ01vZGFsID0gc2hvd1JlY29yZGluZ01vZGFsO1xuZnVuY3Rpb24gaXNEZXZpY2VEaXNjb25uZWN0ZWRFcnJvcihtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UuaW5jbHVkZXMoJ0RldmljZSB3aXRoIHNlcmlhbCcpICYmXG4gICAgICAgIG1lc3NhZ2UuaW5jbHVkZXMoJ3dhcyBkaXNjb25uZWN0ZWQuJyk7XG59XG5mdW5jdGlvbiBpc01lc3NhZ2VDb21wb3NlZE9mKG1lc3NhZ2UsIGlzc3Vlcykge1xuICAgIGZvciAoY29uc3QgaXNzdWUgb2YgaXNzdWVzKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLmluY2x1ZGVzKGlzc3VlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy8gRXhjZXB0aW9uIHRocm93biBieSB0aGUgUmVjb3JkaW5nIGxvZ2ljLlxuY2xhc3MgUmVjb3JkaW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG5leHBvcnRzLlJlY29yZGluZ0Vycm9yID0gUmVjb3JkaW5nRXJyb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUEFSU0lOR19VTlJFQ09HTklaRURfTUVTU0FHRSA9IGV4cG9ydHMuUEFSU0lOR19VTlJFQ09HTklaRURfUE9SVCA9IGV4cG9ydHMuUEFSU0lOR19VTkFCTEVfVE9fREVDT0RFX01FVEhPRCA9IGV4cG9ydHMuUEFSU0lOR19VTktOV09OX1JFUVVFU1RfSUQgPSBleHBvcnRzLlJFQ09SRElOR19JTl9QUk9HUkVTUyA9IGV4cG9ydHMuQlVGRkVSX1VTQUdFX0lOQ09SUkVDVF9GT1JNQVQgPSBleHBvcnRzLkJVRkZFUl9VU0FHRV9OT1RfQUNDRVNTSUJMRSA9IGV4cG9ydHMuTUFMRk9STUVEX0VYVEVOU0lPTl9NRVNTQUdFID0gZXhwb3J0cy5FWFRFTlNJT05fTk9UX0lOU1RBTExFRCA9IGV4cG9ydHMuRVhURU5TSU9OX05BTUUgPSBleHBvcnRzLkVYVEVOU0lPTl9VUkwgPSBleHBvcnRzLkVYVEVOU0lPTl9JRCA9IGV4cG9ydHMuZmluZEludGVyZmFjZUFuZEVuZHBvaW50ID0gZXhwb3J0cy5BREJfREVWSUNFX0ZJTFRFUiA9IGV4cG9ydHMuTk9fREVWSUNFX1NFTEVDVEVEID0gZXhwb3J0cy5DVVNUT01fVFJBQ0VEX0NPTlNVTUVSX1NPQ0tFVF9QQVRIID0gZXhwb3J0cy5ERUZBVUxUX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSCA9IGV4cG9ydHMuQUxMT1dfVVNCX0RFQlVHR0lORyA9IGV4cG9ydHMuVFJBQ0VCT1hfRkVUQ0hfVElNRU9VVCA9IGV4cG9ydHMuVFJBQ0VCT1hfREVWSUNFX1BBVEggPSBleHBvcnRzLkJJTkFSWV9QVVNIX1VOS05PV05fUkVTUE9OU0UgPSBleHBvcnRzLkJJTkFSWV9QVVNIX0ZBSUxVUkUgPSBleHBvcnRzLmlzQ3JPUyA9IGV4cG9ydHMuaXNMaW51eCA9IGV4cG9ydHMuaXNNYWNPcyA9IGV4cG9ydHMuYnVpbGRBYmRXZWJzb2NrZXRDb21tYW5kID0gZXhwb3J0cy5XRUJTT0NLRVRfQ0xPU0VEX0FCTk9STUFMTFlfQ09ERSA9IGV4cG9ydHMuV0VCU09DS0VUX1VOQUJMRV9UT19DT05ORUNUID0gdm9pZCAwO1xuLy8gQmVnaW4gV2Vic29ja2V0IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnRzLldFQlNPQ0tFVF9VTkFCTEVfVE9fQ09OTkVDVCA9ICdVbmFibGUgdG8gY29ubmVjdCB0byBkZXZpY2UgdmlhIHdlYnNvY2tldC4nO1xuLy8gaHR0cHM6Ly93d3cucmZjLWVkaXRvci5vcmcvcmZjL3JmYzY0NTUjc2VjdGlvbi03LjQuMVxuZXhwb3J0cy5XRUJTT0NLRVRfQ0xPU0VEX0FCTk9STUFMTFlfQ09ERSA9IDEwMDY7XG4vLyBUaGUgbWVzc2FnZXMgcmVhZCBieSB0aGUgYWRiIHNlcnZlciBoYXZlIHRoZWlyIGxlbmd0aCBwcmVwZW5kZWQgaW4gaGV4LlxuLy8gVGhpcyBtZXRob2QgYWRkcyB0aGUgbGVuZ3RoIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIG1lc3NhZ2UuXG4vLyBFeGFtcGxlOiAnaG9zdDp0cmFjay1kZXZpY2VzJyAtPiAnMDAxMmhvc3Q6dHJhY2stZGV2aWNlcydcbi8vIGdvL2NvZGVzZWFyY2gvYW9zcC1hbmRyb2lkMTEvc3lzdGVtL2NvcmUvYWRiL1NFUlZJQ0VTLlRYVFxuZnVuY3Rpb24gYnVpbGRBYmRXZWJzb2NrZXRDb21tYW5kKGNtZCkge1xuICAgIGNvbnN0IGhkciA9IGNtZC5sZW5ndGgudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDQsICcwJyk7XG4gICAgcmV0dXJuIGhkciArIGNtZDtcbn1cbmV4cG9ydHMuYnVpbGRBYmRXZWJzb2NrZXRDb21tYW5kID0gYnVpbGRBYmRXZWJzb2NrZXRDb21tYW5kO1xuLy8gU2FtcGxlIHVzZXIgYWdlbnQgZm9yIENocm9tZSBvbiBNYWMgT1M6XG4vLyAnTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2XG4vLyAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMDQuMC4wLjAgU2FmYXJpLzUzNy4zNidcbmZ1bmN0aW9uIGlzTWFjT3ModXNlckFnZW50KSB7XG4gICAgcmV0dXJuIHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCcgbWFjIG9zICcpO1xufVxuZXhwb3J0cy5pc01hY09zID0gaXNNYWNPcztcbi8vIFNhbXBsZSB1c2VyIGFnZW50IGZvciBDaHJvbWUgb24gTGludXg6XG4vLyBNb3ppbGxhLzUuMCAoWDExOyBMaW51eCB4ODZfNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pXG4vLyBDaHJvbWUvMTA1LjAuMC4wIFNhZmFyaS81MzcuMzZcbmZ1bmN0aW9uIGlzTGludXgodXNlckFnZW50KSB7XG4gICAgcmV0dXJuIHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCcgbGludXggJyk7XG59XG5leHBvcnRzLmlzTGludXggPSBpc0xpbnV4O1xuLy8gU2FtcGxlIHVzZXIgYWdlbnQgZm9yIENocm9tZSBvbiBDaHJvbWUgT1M6XG4vLyBcIk1vemlsbGEvNS4wIChYMTE7IENyT1MgeDg2XzY0IDE0ODE2Ljk5LjApIEFwcGxlV2ViS2l0LzUzNy4zNlxuLy8gKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTAzLjAuNTA2MC4xMTQgU2FmYXJpLzUzNy4zNlwiXG4vLyBUaGlzIGNvbmRpdGlvbiBpcyB3aWRlciwgaW4gdGhlIHVubGlrZWx5IHBvc3NpYmlsaXR5IG9mIGRpZmZlcmVudCBjYXNpbmcsXG5mdW5jdGlvbiBpc0NyT1ModXNlckFnZW50KSB7XG4gICAgcmV0dXJuIHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCcgY3JvcyAnKTtcbn1cbmV4cG9ydHMuaXNDck9TID0gaXNDck9TO1xuLy8gRW5kIFdlYnNvY2tldCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCZWdpbiBBZGIgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuQklOQVJZX1BVU0hfRkFJTFVSRSA9ICdCaW5hcnlQdXNoRmFpbHVyZSc7XG5leHBvcnRzLkJJTkFSWV9QVVNIX1VOS05PV05fUkVTUE9OU0UgPSAnQmluYXJ5UHVzaFVua25vd25SZXNwb25zZSc7XG4vLyBJbiBjYXNlIHRoZSBkZXZpY2UgZG9lc24ndCBoYXZlIHRoZSB0cmFjZWJveCwgd2UgdXBsb2FkIHRoZSBsYXRlc3QgdmVyc2lvblxuLy8gdG8gdGhpcyBwYXRoLlxuZXhwb3J0cy5UUkFDRUJPWF9ERVZJQ0VfUEFUSCA9ICcvZGF0YS9sb2NhbC90bXAvdHJhY2Vib3gnO1xuLy8gRXhwZXJpbWVudGFsbHksIHRoaXMgdGFrZXMgOTAwbXMgb24gdGhlIGZpcnN0IGZldGNoIGFuZCAyMC0zMG1zIGFmdGVyXG4vLyBiZWNhdXNlIG9mIGNhY2hpbmcuXG5leHBvcnRzLlRSQUNFQk9YX0ZFVENIX1RJTUVPVVQgPSAzMDAwMDtcbi8vIE1lc3NhZ2Ugc2hvd24gdG8gdGhlIHVzZXIgd2hlbiB0aGV5IG5lZWQgdG8gYWxsb3cgYXV0aGVudGljYXRpb24gb24gdGhlXG4vLyBkZXZpY2UgaW4gb3JkZXIgdG8gY29ubmVjdC5cbmV4cG9ydHMuQUxMT1dfVVNCX0RFQlVHR0lORyA9ICdQbGVhc2UgYWxsb3cgVVNCIGRlYnVnZ2luZyBvbiBkZXZpY2UgYW5kIHRyeSBhZ2Fpbi4nO1xuLy8gSWYgdGhlIEFuZHJvaWQgZGV2aWNlIGhhcyB0aGUgdHJhY2luZyBzZXJ2aWNlIG9uIGl0IChmcm9tIEFQSSB2ZXJzaW9uIDI5KSxcbi8vIHRoZW4gd2UgY2FuIGNvbm5lY3QgdG8gdGhpcyBjb25zdW1lciBzb2NrZXQuXG5leHBvcnRzLkRFRkFVTFRfVFJBQ0VEX0NPTlNVTUVSX1NPQ0tFVF9QQVRIID0gJ2xvY2FsZmlsZXN5c3RlbTovZGV2L3NvY2tldC90cmFjZWRfY29uc3VtZXInO1xuLy8gSWYgdGhlIEFuZHJvaWQgZGV2aWNlIGRvZXMgbm90IGhhdmUgdGhlIHRyYWNpbmcgc2VydmljZSBvbiBpdCAoYmVmb3JlIEFQSVxuLy8gdmVyc2lvbiAyOSksIHdlIHdpbGwgaGF2ZSB0byBwdXNoIHRoZSB0cmFjZWJveCBvbiB0aGUgZGV2aWNlLiBUaGVuLCB3ZVxuLy8gY2FuIGNvbm5lY3QgdG8gdGhpcyBjb25zdW1lciBzb2NrZXQgKHVzaW5nIGl0IGRvZXMgbm90IHJlcXVpcmUgc3lzdGVtIGFkbWluXG4vLyBwcml2aWxlZ2VzKS5cbmV4cG9ydHMuQ1VTVE9NX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSCA9ICdsb2NhbGFic3RyYWN0OnRyYWNlZF9jb25zdW1lcic7XG4vLyBFbmQgQWRiIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCZWdpbiBXZWJ1c2IgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuTk9fREVWSUNFX1NFTEVDVEVEID0gJ05vIGRldmljZSBzZWxlY3RlZC4nO1xuZXhwb3J0cy5BREJfREVWSUNFX0ZJTFRFUiA9IHtcbiAgICBjbGFzc0NvZGU6IDI1NSwgLy8gVVNCIHZlbmRvciBzcGVjaWZpYyBjb2RlXG4gICAgc3ViY2xhc3NDb2RlOiA2NiwgLy8gQW5kcm9pZCB2ZW5kb3Igc3BlY2lmaWMgc3ViY2xhc3NcbiAgICBwcm90b2NvbENvZGU6IDEsIC8vIEFkYiBwcm90b2NvbFxufTtcbmZ1bmN0aW9uIGZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludChkZXZpY2UpIHtcbiAgICBjb25zdCBhZGJEZXZpY2VGaWx0ZXIgPSBleHBvcnRzLkFEQl9ERVZJQ0VfRklMVEVSO1xuICAgIGZvciAoY29uc3QgY29uZmlnIG9mIGRldmljZS5jb25maWd1cmF0aW9ucykge1xuICAgICAgICBmb3IgKGNvbnN0IGludGVyZmFjZV8gb2YgY29uZmlnLmludGVyZmFjZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYWx0IG9mIGludGVyZmFjZV8uYWx0ZXJuYXRlcykge1xuICAgICAgICAgICAgICAgIGlmIChhbHQuaW50ZXJmYWNlQ2xhc3MgPT09IGFkYkRldmljZUZpbHRlci5jbGFzc0NvZGUgJiZcbiAgICAgICAgICAgICAgICAgICAgYWx0LmludGVyZmFjZVN1YmNsYXNzID09PSBhZGJEZXZpY2VGaWx0ZXIuc3ViY2xhc3NDb2RlICYmXG4gICAgICAgICAgICAgICAgICAgIGFsdC5pbnRlcmZhY2VQcm90b2NvbCA9PT0gYWRiRGV2aWNlRmlsdGVyLnByb3RvY29sQ29kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiBjb25maWcuY29uZmlndXJhdGlvblZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNiSW50ZXJmYWNlTnVtYmVyOiBpbnRlcmZhY2VfLmludGVyZmFjZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czogYWx0LmVuZHBvaW50cyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IC8vIGlmIChhbHRlcm5hdGUpXG4gICAgICAgICAgICB9IC8vIGZvciAoaW50ZXJmYWNlLmFsdGVybmF0ZXMpXG4gICAgICAgIH0gLy8gZm9yIChjb25maWd1cmF0aW9uLmludGVyZmFjZXMpXG4gICAgfSAvLyBmb3IgKGNvbmZpZ3VyYXRpb25zKVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludCA9IGZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludDtcbi8vIEVuZCBXZWJ1c2IgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEJlZ2luIENocm9tZSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0cy5FWFRFTlNJT05fSUQgPSAnbGZta3BoZnBkYmppamhwb21nZWNmaWtoZm9oYW9pbmUnO1xuZXhwb3J0cy5FWFRFTlNJT05fVVJMID0gYGh0dHBzOi8vY2hyb21lLmdvb2dsZS5jb20vd2Vic3RvcmUvZGV0YWlsL3BlcmZldHRvLXVpLyR7ZXhwb3J0cy5FWFRFTlNJT05fSUR9YDtcbmV4cG9ydHMuRVhURU5TSU9OX05BTUUgPSAnQ2hyb21lIGV4dGVuc2lvbic7XG5leHBvcnRzLkVYVEVOU0lPTl9OT1RfSU5TVEFMTEVEID0gYFRvIHRyYWNlIENocm9tZSBmcm9tIHRoZSBQZXJmZXR0byBVSSwgeW91IG5lZWQgdG8gaW5zdGFsbCBvdXJcbiAgICAke2V4cG9ydHMuRVhURU5TSU9OX1VSTH0gYW5kIHRoZW4gcmVsb2FkIHRoaXMgcGFnZS5gO1xuZXhwb3J0cy5NQUxGT1JNRURfRVhURU5TSU9OX01FU1NBR0UgPSAnTWFsZm9ybWVkIGV4dGVuc2lvbiBtZXNzYWdlLic7XG5leHBvcnRzLkJVRkZFUl9VU0FHRV9OT1RfQUNDRVNTSUJMRSA9ICdCdWZmZXIgdXNhZ2Ugbm90IGFjY2Vzc2libGUnO1xuZXhwb3J0cy5CVUZGRVJfVVNBR0VfSU5DT1JSRUNUX0ZPUk1BVCA9ICdUaGUgYnVmZmVyIHVzYWdlIGRhdGEgaGFzIGFtIGluY29ycmVjdCBmb3JtYXQnO1xuLy8gRW5kIENocm9tZSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCZWdpbiBUcmFjZWQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0cy5SRUNPUkRJTkdfSU5fUFJPR1JFU1MgPSAnUmVjb3JkaW5nIGluIHByb2dyZXNzJztcbmV4cG9ydHMuUEFSU0lOR19VTktOV09OX1JFUVVFU1RfSUQgPSAnVW5rbm93biByZXF1ZXN0IGlkJztcbmV4cG9ydHMuUEFSU0lOR19VTkFCTEVfVE9fREVDT0RFX01FVEhPRCA9ICdVbmFibGUgdG8gZGVjb2RlIG1ldGhvZCc7XG5leHBvcnRzLlBBUlNJTkdfVU5SRUNPR05JWkVEX1BPUlQgPSAnVW5yZWNvZ25pemVkIGNvbnN1bWVyIHBvcnQgcmVzcG9uc2UnO1xuZXhwb3J0cy5QQVJTSU5HX1VOUkVDT0dOSVpFRF9NRVNTQUdFID0gJ1VucmVjb2duaXplZCBmcmFtZSBtZXNzYWdlJztcbi8vIEVuZCBUcmFjZWQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeSA9IGV4cG9ydHMuQU5EUk9JRF9XRUJVU0JfVEFSR0VUX0ZBQ1RPUlkgPSB2b2lkIDA7XG5jb25zdCBlcnJvcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9iYXNlL2Vycm9yc1wiKTtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9iYXNlL2xvZ2dpbmdcIik7XG5jb25zdCBhZGJfa2V5X21hbmFnZXJfMSA9IHJlcXVpcmUoXCIuLi9hdXRoL2FkYl9rZXlfbWFuYWdlclwiKTtcbmNvbnN0IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xID0gcmVxdWlyZShcIi4uL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZ1wiKTtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4uL3JlY29yZGluZ191dGlsc1wiKTtcbmNvbnN0IGFuZHJvaWRfd2VidXNiX3RhcmdldF8xID0gcmVxdWlyZShcIi4uL3RhcmdldHMvYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0XCIpO1xuZXhwb3J0cy5BTkRST0lEX1dFQlVTQl9UQVJHRVRfRkFDVE9SWSA9ICdBbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeSc7XG5jb25zdCBTRVJJQUxfTlVNQkVSX0lTU1VFID0gJ2FuIGludmFsaWQgc2VyaWFsIG51bWJlcic7XG5jb25zdCBBREJfSU5URVJGQUNFX0lTU1VFID0gJ2FuIGluY29tcGF0aWJsZSBhZGIgaW50ZXJmYWNlJztcbmZ1bmN0aW9uIGNyZWF0ZURldmljZUVycm9yTWVzc2FnZShkZXZpY2UsIGlzc3VlKSB7XG4gICAgY29uc3QgcHJvZHVjdE5hbWUgPSBkZXZpY2UucHJvZHVjdE5hbWU7XG4gICAgcmV0dXJuIGBVU0IgZGV2aWNlJHtwcm9kdWN0TmFtZSA/ICcgJyArIHByb2R1Y3ROYW1lIDogJyd9IGhhcyAke2lzc3VlfWA7XG59XG5jbGFzcyBBbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeSB7XG4gICAgY29uc3RydWN0b3IodXNiKSB7XG4gICAgICAgIHRoaXMudXNiID0gdXNiO1xuICAgICAgICB0aGlzLmtpbmQgPSBleHBvcnRzLkFORFJPSURfV0VCVVNCX1RBUkdFVF9GQUNUT1JZO1xuICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlID0gKCkgPT4geyB9O1xuICAgICAgICB0aGlzLnJlY29yZGluZ1Byb2JsZW1zID0gW107XG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgLy8gQWRiS2V5TWFuYWdlciBzaG91bGQgb25seSBiZSBpbnN0YW50aWF0ZWQgb25jZSwgc28gd2UgY2FuIHVzZSB0aGUgc2FtZSBrZXlcbiAgICAgICAgLy8gZm9yIGFsbCBkZXZpY2VzLlxuICAgICAgICB0aGlzLmtleU1hbmFnZXIgPSBuZXcgYWRiX2tleV9tYW5hZ2VyXzEuQWRiS2V5TWFuYWdlcigpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdBbmRyb2lkIFdlYlVzYic7XG4gICAgfVxuICAgIGxpc3RUYXJnZXRzKCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnRhcmdldHMudmFsdWVzKCkpO1xuICAgIH1cbiAgICBsaXN0UmVjb3JkaW5nUHJvYmxlbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZGluZ1Byb2JsZW1zO1xuICAgIH1cbiAgICBhc3luYyBjb25uZWN0TmV3VGFyZ2V0KCkge1xuICAgICAgICBsZXQgZGV2aWNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGV2aWNlID0gYXdhaXQgdGhpcy51c2IucmVxdWVzdERldmljZSh7IGZpbHRlcnM6IFtyZWNvcmRpbmdfdXRpbHNfMS5BREJfREVWSUNFX0ZJTFRFUl0gfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcigoMCwgZXJyb3JzXzEuZ2V0RXJyb3JNZXNzYWdlKShlKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGV2aWNlVmFsaWQgPSB0aGlzLmNoZWNrRGV2aWNlVmFsaWRpdHkoZGV2aWNlKTtcbiAgICAgICAgaWYgKCFkZXZpY2VWYWxpZC5pc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoZGV2aWNlVmFsaWQuaXNzdWVzLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbmRyb2lkVGFyZ2V0ID0gbmV3IGFuZHJvaWRfd2VidXNiX3RhcmdldF8xLkFuZHJvaWRXZWJ1c2JUYXJnZXQoZGV2aWNlLCB0aGlzLmtleU1hbmFnZXIsIHRoaXMub25UYXJnZXRDaGFuZ2UpO1xuICAgICAgICB0aGlzLnRhcmdldHMuc2V0KCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShkZXZpY2Uuc2VyaWFsTnVtYmVyKSwgYW5kcm9pZFRhcmdldCk7XG4gICAgICAgIHJldHVybiBhbmRyb2lkVGFyZ2V0O1xuICAgIH1cbiAgICBzZXRPblRhcmdldENoYW5nZShvblRhcmdldENoYW5nZSkge1xuICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlID0gb25UYXJnZXRDaGFuZ2U7XG4gICAgfVxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIGxldCBkZXZpY2VzID0gW107XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkZXZpY2VzID0gYXdhaXQgdGhpcy51c2IuZ2V0RGV2aWNlcygpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChfKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIFdlYlVTQiBub3QgYXZhaWxhYmxlIG9yIGRpc2FsbG93ZWQgaW4gaWZyYW1lLlxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZGV2aWNlIG9mIGRldmljZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRGV2aWNlVmFsaWRpdHkoZGV2aWNlKS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzLnNldCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoZGV2aWNlLnNlcmlhbE51bWJlciksIG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfMS5BbmRyb2lkV2VidXNiVGFyZ2V0KGRldmljZSwgdGhpcy5rZXlNYW5hZ2VyLCB0aGlzLm9uVGFyZ2V0Q2hhbmdlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51c2IuYWRkRXZlbnRMaXN0ZW5lcignY29ubmVjdCcsIChldikgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tEZXZpY2VWYWxpZGl0eShldi5kZXZpY2UpLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldHMuc2V0KCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShldi5kZXZpY2Uuc2VyaWFsTnVtYmVyKSwgbmV3IGFuZHJvaWRfd2VidXNiX3RhcmdldF8xLkFuZHJvaWRXZWJ1c2JUYXJnZXQoZXYuZGV2aWNlLCB0aGlzLmtleU1hbmFnZXIsIHRoaXMub25UYXJnZXRDaGFuZ2UpKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVzYi5hZGRFdmVudExpc3RlbmVyKCdkaXNjb25uZWN0JywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICAvLyBXZSBkb24ndCBjaGVjayBkZXZpY2UgdmFsaWRpdHkgd2hlbiBkaXNjb25uZWN0aW5nIGJlY2F1c2UgaWYgdGhlIGRldmljZVxuICAgICAgICAgICAgLy8gaXMgaW52YWxpZCB3ZSB3b3VsZCBub3QgaGF2ZSBjb25uZWN0ZWQgaW4gdGhlIGZpcnN0IHBsYWNlLlxuICAgICAgICAgICAgY29uc3Qgc2VyaWFsTnVtYmVyID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKGV2LmRldmljZS5zZXJpYWxOdW1iZXIpO1xuICAgICAgICAgICAgYXdhaXQgKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMudGFyZ2V0cy5nZXQoc2VyaWFsTnVtYmVyKSlcbiAgICAgICAgICAgICAgICAuZGlzY29ubmVjdChgRGV2aWNlIHdpdGggc2VyaWFsICR7c2VyaWFsTnVtYmVyfSB3YXMgZGlzY29ubmVjdGVkLmApO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzLmRlbGV0ZShzZXJpYWxOdW1iZXIpO1xuICAgICAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2hlY2tEZXZpY2VWYWxpZGl0eShkZXZpY2UpIHtcbiAgICAgICAgY29uc3QgZGV2aWNlVmFsaWRpdHkgPSB7IGlzVmFsaWQ6IHRydWUsIGlzc3VlczogW10gfTtcbiAgICAgICAgaWYgKCFkZXZpY2Uuc2VyaWFsTnVtYmVyKSB7XG4gICAgICAgICAgICBkZXZpY2VWYWxpZGl0eS5pc3N1ZXMucHVzaChjcmVhdGVEZXZpY2VFcnJvck1lc3NhZ2UoZGV2aWNlLCBTRVJJQUxfTlVNQkVSX0lTU1VFKSk7XG4gICAgICAgICAgICBkZXZpY2VWYWxpZGl0eS5pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoMCwgcmVjb3JkaW5nX3V0aWxzXzEuZmluZEludGVyZmFjZUFuZEVuZHBvaW50KShkZXZpY2UpKSB7XG4gICAgICAgICAgICBkZXZpY2VWYWxpZGl0eS5pc3N1ZXMucHVzaChjcmVhdGVEZXZpY2VFcnJvck1lc3NhZ2UoZGV2aWNlLCBBREJfSU5URVJGQUNFX0lTU1VFKSk7XG4gICAgICAgICAgICBkZXZpY2VWYWxpZGl0eS5pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWNvcmRpbmdQcm9ibGVtcy5wdXNoKC4uLmRldmljZVZhbGlkaXR5Lmlzc3Vlcyk7XG4gICAgICAgIHJldHVybiBkZXZpY2VWYWxpZGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5ID0gQW5kcm9pZFdlYnVzYlRhcmdldEZhY3Rvcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQW5kcm9pZFRhcmdldCA9IHZvaWQgMDtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4uL3JlY29yZGluZ191dGlsc1wiKTtcbmNsYXNzIEFuZHJvaWRUYXJnZXQge1xuICAgIGNvbnN0cnVjdG9yKGFkYkNvbm5lY3Rpb24sIG9uVGFyZ2V0Q2hhbmdlKSB7XG4gICAgICAgIHRoaXMuYWRiQ29ubmVjdGlvbiA9IGFkYkNvbm5lY3Rpb247XG4gICAgICAgIHRoaXMub25UYXJnZXRDaGFuZ2UgPSBvblRhcmdldENoYW5nZTtcbiAgICAgICAgdGhpcy5jb25zdW1lclNvY2tldFBhdGggPSByZWNvcmRpbmdfdXRpbHNfMS5ERUZBVUxUX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBjYWxsZWQgd2hlbiBhIHVzYiBVU0JDb25uZWN0aW9uRXZlbnQgb2YgdHlwZSAnZGlzY29ubmVjdCcgZXZlbnQgaXNcbiAgICAvLyBlbWl0dGVkLiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiB0aGUgVVNCIGNvbm5lY3Rpb24gaXMgbG9zdCAoZXhhbXBsZTpcbiAgICAvLyB3aGVuIHRoZSB1c2VyIHVucGx1Z2dlZCB0aGUgY29ubmVjdGluZyBjYWJsZSkuXG4gICAgYXN5bmMgZGlzY29ubmVjdChkaXNjb25uZWN0TWVzc2FnZSkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkYkNvbm5lY3Rpb24uZGlzY29ubmVjdChkaXNjb25uZWN0TWVzc2FnZSk7XG4gICAgfVxuICAgIC8vIFN0YXJ0cyBhIHRyYWNpbmcgc2Vzc2lvbiBpbiBvcmRlciB0byBmZXRjaCBpbmZvcm1hdGlvbiBzdWNoIGFzIGFwaUxldmVsXG4gICAgLy8gYW5kIGRhdGFTb3VyY2VzIGZyb20gdGhlIGRldmljZS4gVGhlbiwgaXQgY2FuY2VscyB0aGUgc2Vzc2lvbi5cbiAgICBhc3luYyBmZXRjaFRhcmdldEluZm8obGlzdGVuZXIpIHtcbiAgICB9XG4gICAgLy8gV2UgZG8gbm90IHN1cHBvcnQgbG9uZyB0cmFjaW5nIG9uIEFuZHJvaWQuXG4gICAgY2FuQ3JlYXRlVHJhY2luZ1Nlc3Npb24ocmVjb3JkaW5nTW9kZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGFzeW5jIGNyZWF0ZVRyYWNpbmdTZXNzaW9uKHRyYWNpbmdTZXNzaW9uTGlzdGVuZXIpIHtcbiAgICB9XG4gICAgY2FuQ29ubmVjdFdpdGhvdXRDb250ZW50aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGJDb25uZWN0aW9uLmNhbkNvbm5lY3RXaXRob3V0Q29udGVudGlvbigpO1xuICAgIH1cbiAgICBnZXRBZGJDb25uZWN0aW5vKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGJDb25uZWN0aW9uO1xuICAgIH1cbn1cbmV4cG9ydHMuQW5kcm9pZFRhcmdldCA9IEFuZHJvaWRUYXJnZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQW5kcm9pZFdlYnVzYlRhcmdldCA9IHZvaWQgMDtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9iYXNlL2xvZ2dpbmdcIik7XG5jb25zdCBhZGJfY29ubmVjdGlvbl9vdmVyX3dlYnVzYl8xID0gcmVxdWlyZShcIi4uL2FkYl9jb25uZWN0aW9uX292ZXJfd2VidXNiXCIpO1xuY29uc3QgYW5kcm9pZF90YXJnZXRfMSA9IHJlcXVpcmUoXCIuL2FuZHJvaWRfdGFyZ2V0XCIpO1xuY2xhc3MgQW5kcm9pZFdlYnVzYlRhcmdldCBleHRlbmRzIGFuZHJvaWRfdGFyZ2V0XzEuQW5kcm9pZFRhcmdldCB7XG4gICAgY29uc3RydWN0b3IoZGV2aWNlLCBrZXlNYW5hZ2VyLCBvblRhcmdldENoYW5nZSkge1xuICAgICAgICBzdXBlcihuZXcgYWRiX2Nvbm5lY3Rpb25fb3Zlcl93ZWJ1c2JfMS5BZGJDb25uZWN0aW9uT3ZlcldlYnVzYihkZXZpY2UsIGtleU1hbmFnZXIpLCBvblRhcmdldENoYW5nZSk7XG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuICAgIH1cbiAgICBnZXRJbmZvKCkge1xuICAgICAgICBjb25zdCBuYW1lID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuZGV2aWNlLnByb2R1Y3ROYW1lKSArICcgJyArXG4gICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5kZXZpY2Uuc2VyaWFsTnVtYmVyKSArICcgV2ViVXNiJztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldFR5cGU6ICdBTkRST0lEJyxcbiAgICAgICAgICAgIC8vICdhbmRyb2lkQXBpTGV2ZWwnIHdpbGwgYmUgcG9wdWxhdGVkIGFmdGVyIEFEQiBhdXRob3JpemF0aW9uLlxuICAgICAgICAgICAgYW5kcm9pZEFwaUxldmVsOiB0aGlzLmFuZHJvaWRBcGlMZXZlbCxcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzOiB0aGlzLmRhdGFTb3VyY2VzIHx8IFtdLFxuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnRzLkFuZHJvaWRXZWJ1c2JUYXJnZXQgPSBBbmRyb2lkV2VidXNiVGFyZ2V0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeV8xID0gcmVxdWlyZShcIi4vV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi90YXJnZXRfZmFjdG9yaWVzL2FuZHJvaWRfd2VidXNiX3RhcmdldF9mYWN0b3J5XCIpO1xuY29uc3QganN6aXBfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwianN6aXBcIikpO1xuY29uc3QgZmlsZV9zYXZlcl8xID0gcmVxdWlyZShcImZpbGUtc2F2ZXJcIik7XG5jb25zdCBjb25uZWN0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uZWN0X2J1dHRvblwiKTtcbmNvbnN0IHJ1bkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnVuX2J1dHRvblwiKTtcbnJ1bkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5jb25zdCBzY3JpcHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3JpcHRfYXJlYVwiKTtcbnNjcmlwdEFyZWEuZGlzYWJsZWQgPSB0cnVlO1xuY29uc3Qgb3V0cHV0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3V0cHV0X2FyZWFcIik7XG5vdXRwdXRBcmVhLmRpc2FibGVkID0gdHJ1ZTtcbmNvbnN0IGxvZ2NhdEFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2NhdF9hcmVhXCIpO1xubG9nY2F0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG5jb25zdCBidWdyZXBvcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1Z3JlcG9ydF9idXR0b25cIik7XG5idWdyZXBvcnRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuYnVncmVwb3J0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGFrZUJ1Z3JlcG9ydCwgZmFsc2UpO1xuY29uc3Qgc3RhcnRSZWNvcmRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZF9idXR0b25cIik7XG5zdGFydFJlY29yZEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5zdGFydFJlY29yZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZVJlY29yZGluZywgZmFsc2UpO1xuY29uc3Qgc2F2ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZV9idXR0b25cIik7XG5zYXZlQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbnNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkb3dubG9hZCwgZmFsc2UpO1xuY29uc3Qgd2VidXNiID0gbmV3IGFuZHJvaWRfd2VidXNiX3RhcmdldF9mYWN0b3J5XzEuQW5kcm9pZFdlYnVzYlRhcmdldEZhY3RvcnkobmF2aWdhdG9yLnVzYik7XG52YXIgYWRiQ29ubmVjdGlvbjtcbnNjcmlwdEFyZWEudmFsdWUgPSBcImdldHByb3BcIjtcbmNvbnN0IGxvZ2NhdERlY29kZSA9IG5ldyBUZXh0RGVjb2RlcigpO1xudmFyIHRvUnVuID0gW107XG5mdW5jdGlvbiBsb2djYXREYXRhKGRhdGEpIHtcbiAgICBsb2djYXRBcmVhLnZhbHVlID0gbG9nY2F0QXJlYS52YWx1ZSArIGxvZ2NhdERlY29kZS5kZWNvZGUoZGF0YSk7XG4gICAgbG9nY2F0QXJlYS5zY3JvbGxUb3AgPSBsb2djYXRBcmVhLnNjcm9sbEhlaWdodDtcbn1cbmZ1bmN0aW9uIGRldmljZUNvbm5lY3RlZChkZXYpIHtcbiAgICBjb25zdCBhZGJUYXJnZXQgPSBkZXY7XG4gICAgYWRiQ29ubmVjdGlvbiA9IGFkYlRhcmdldC5hZGJDb25uZWN0aW9uO1xuICAgIGNvbnNvbGUubG9nKFwiU3RhcnQgbG9nY2F0XCIpO1xuICAgIGFkYkNvbm5lY3Rpb24uc2hlbGwoXCJsb2djYXRcIikudGhlbigoYnl0ZXMpID0+IHsgYnl0ZXMuYWRkT25TdHJlYW1EYXRhQ2FsbGJhY2sobG9nY2F0RGF0YSk7IH0pO1xuICAgIGNvbm5lY3RCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIGNvbm5lY3RCdXR0b24uaW5uZXJUZXh0ID0gXCJDb25uZWN0ZWRcXG5cIiArIGRldi5nZXRJbmZvKCkubmFtZTtcbiAgICBydW5CdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBzY3JpcHRBcmVhLmRpc2FibGVkID0gZmFsc2U7XG4gICAgb3V0cHV0QXJlYS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIGxvZ2NhdEFyZWEuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICA7XG4gICAgYnVncmVwb3J0QnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgO1xuICAgIHN0YXJ0UmVjb3JkQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG59XG5mdW5jdGlvbiBjb25uZWN0RGV2aWNlKCkge1xuICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCBkZXZpY2VcIik7XG4gICAgbGV0IGRldmljZVAgPSB3ZWJ1c2IuY29ubmVjdE5ld1RhcmdldCgpLnRoZW4oKGRldmljZSkgPT4gZGV2aWNlQ29ubmVjdGVkKGRldmljZSksIChyZWFzb24pID0+IHsgY29uc29sZS5sb2coXCJGYWlsZWQgdG8gY29ubmVjdFwiKTsgfSk7XG59XG5mdW5jdGlvbiByZWN1cnNlQ29tbWFuZExpbmUocmVzdWx0KSB7XG4gICAgY29uc29sZS5sb2coXCJHb3QgXCIgKyByZXN1bHQpO1xuICAgIG91dHB1dEFyZWEudmFsdWUgPSBvdXRwdXRBcmVhLnZhbHVlICsgcmVzdWx0O1xuICAgIG91dHB1dEFyZWEuc2Nyb2xsVG9wID0gb3V0cHV0QXJlYS5zY3JvbGxIZWlnaHQ7XG4gICAgdmFyIG5leHRDTUQgPSBnZXROZXh0Q01EKCk7XG4gICAgaWYgKG5leHRDTUQgPT0gXCJcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmlzaGVkXCIpO1xuICAgICAgICBzY3JpcHRBcmVhLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIG5leHQ6IFwiICsgbmV4dENNRCk7XG4gICAgICAgIGFkYkNvbm5lY3Rpb24uc2hlbGxBbmRHZXRPdXRwdXQobmV4dENNRCkudGhlbigodmFsKSA9PiB7IHJlY3Vyc2VDb21tYW5kTGluZSh2YWwpOyB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXROZXh0Q01EKCkge1xuICAgIGlmICh0b1J1bi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBuZXh0Q29tbWFuZCA9IHRvUnVuWzBdO1xuICAgICAgICB0b1J1bi5zaGlmdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJldHVybmluZzogXCIgKyBuZXh0Q29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0Q29tbWFuZDtcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG59XG5mdW5jdGlvbiBydW5UZXN0KCkge1xuICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgc2NyaXB0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG4gICAgb3V0cHV0QXJlYS52YWx1ZSA9IFwiXCI7XG4gICAgbGV0IHRlc3RTY3JpcHQgPSBzY3JpcHRBcmVhLnZhbHVlO1xuICAgIGlmICh0ZXN0U2NyaXB0LnNwbGl0KFwiXFxuXCIpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdG9SdW4gPSB0ZXN0U2NyaXB0LnNwbGl0KFwiXFxuXCIpO1xuICAgIH1cbiAgICB0b1J1biA9IFt0ZXN0U2NyaXB0XTtcbiAgICB2YXIgY29tbWFuZCA9IGdldE5leHRDTUQoKTtcbiAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmc6IFwiICsgdGVzdFNjcmlwdCk7XG4gICAgLy8gZG8gc29tZXRoaW5nIHdpdGggdGhlIHNjcmlwdFxuICAgIGFkYkNvbm5lY3Rpb24uc2hlbGxBbmRHZXRPdXRwdXQoY29tbWFuZCkudGhlbigodmFsKSA9PiB7IHJlY3Vyc2VDb21tYW5kTGluZSh2YWwpOyB9KTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZVVSTChlbGUsIGV2KSB7XG59XG5jb25uZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY29ubmVjdERldmljZSwgZmFsc2UpO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJydW5fYnV0dG9uXCIpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJ1blRlc3QsIGZhbHNlKTtcbnNjcmlwdEFyZWEuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoZXYpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIkVWRU5UXCIpO1xuICAgIGxldCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgcGFyYW1zLnNldCgnc2NyaXB0JywgJycgKyBzY3JpcHRBcmVhLnZhbHVlKTtcbiAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoJzEnLCAnUEFMJywgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgJz8nICsgcGFyYW1zKTtcbn0sIGZhbHNlKTtcbmZ1bmN0aW9uIHBvcHVsYXRlU2NyaXB0RnJvbVVSTCgpIHtcbiAgICBjb25zdCB1cmxTZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgIGNvbnN0IG5hbWUgPSB1cmxTZWFyY2hQYXJhbXMuZ2V0KCdzY3JpcHQnKTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgICBzY3JpcHRBcmVhLnZhbHVlID0gbmFtZTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJFVkVOVFwiKTtcbiAgICBsZXQgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHBhcmFtcy5zZXQoJ3NjcmlwdCcsICcnICsgc2NyaXB0QXJlYS52YWx1ZSk7XG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCcxJywgJ1BBTCcsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArICc/JyArIHBhcmFtcyk7XG59XG5wb3B1bGF0ZVNjcmlwdEZyb21VUkwoKTtcbnZhciBtZWRpYVJlY29yZGVyO1xudmFyIGNodW5rcztcbmlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHtcbiAgICAgICAgICAgIGZhY2luZ01vZGU6ICdlbnZpcm9ubWVudCdcbiAgICAgICAgfSB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XG4gICAgICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0pO1xuICAgICAgICBsZXQgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWRlb1wiKTtcbiAgICAgICAgdmlkZW9FbGVtZW50LnNyY09iamVjdCA9IHN0cmVhbTtcbiAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycjByKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU29tZXRoaW5nIHdlbnQgd3JvbmchXCIsIGVycjByKTtcbiAgICB9KTtcbn1cbnZhciByZWNvcmRpbmcgPSBmYWxzZTtcbmZ1bmN0aW9uIHRvZ2dsZVJlY29yZGluZygpIHtcbiAgICBpZiAocmVjb3JkaW5nKSB7XG4gICAgICAgIHN0b3BSZWNvcmRpbmcoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgfVxufVxuZnVuY3Rpb24gc3RhcnRSZWNvcmRpbmcoKSB7XG4gICAgc3RhcnRSZWNvcmRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIHJlY29yZGluZyA9IHRydWU7XG4gICAgbG9nY2F0QXJlYS52YWx1ZSA9IFwiXCI7XG4gICAgc3RhcnRSZWNvcmRCdXR0b24uaW5uZXJUZXh0ID0gXCJTdG9wIFJlY29yZGluZ1wiO1xuICAgIHN0YXJ0VmlkZW9SZWNvcmRpbmcoKTtcbiAgICBzdGFydFJlY29yZEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xufVxuZnVuY3Rpb24gc3RvcFJlY29yZGluZygpIHtcbiAgICBzdGFydFJlY29yZEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgcmVjb3JkaW5nID0gZmFsc2U7XG4gICAgc3RhcnRSZWNvcmRCdXR0b24uaW5uZXJUZXh0ID0gXCJTdGFydCBSZWNvcmRpbmdcIjtcbiAgICBzdG9wVmlkZW9SZWNvcmRpbmcoKTtcbiAgICBzdGFydFJlY29yZEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHNhdmVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHN0YXJ0VmlkZW9SZWNvcmRpbmcoKSB7XG4gICAgY29uc29sZS5sb2coXCJzdGFydCByZWNvcmRcIik7XG4gICAgY2h1bmtzID0gW107XG4gICAgbWVkaWFSZWNvcmRlci5vbmRhdGFhdmFpbGFibGUgPSAoZSkgPT4ge1xuICAgICAgICBjaHVua3MucHVzaChlLmRhdGEpO1xuICAgIH07XG4gICAgbWVkaWFSZWNvcmRlci5zdGFydCgxMDAwKTtcbn1cbmZ1bmN0aW9uIHN0b3BWaWRlb1JlY29yZGluZygpIHtcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcbn1cbmZ1bmN0aW9uIGRvd25sb2FkKCkge1xuICAgIHZhciB6aXAgPSBuZXcganN6aXBfMS5kZWZhdWx0KCk7XG4gICAgLy8gYWRkIGxvZ2NhdFxuICAgIHppcC5maWxlKFwibG9nY2F0LnR4dFwiLCBsb2djYXRBcmVhLnZhbHVlKTtcbiAgICAvLyBhZGQgY29tbWFuZHMgb3V0cHV0XG4gICAgemlwLmZpbGUoXCJvdXRwdXQudHh0XCIsIG91dHB1dEFyZWEudmFsdWUpO1xuICAgIC8vIGFkZCB2aWRlb1xuICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihjaHVua3MsIHsgdHlwZTogXCJ2aWRlby94LW1hdHJvc2thO2NvZGVjcz1hdmMxXCIgfSk7XG4gICAgY2h1bmtzID0gW107XG4gICAgemlwLmZpbGUoXCJ2aWRlby53ZWJtXCIsIGJsb2IpO1xuICAgIHppcC5nZW5lcmF0ZUFzeW5jKHsgdHlwZTogXCJibG9iXCIgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgICAgICAgLy8gc2VlIEZpbGVTYXZlci5qc1xuICAgICAgICAoMCwgZmlsZV9zYXZlcl8xLnNhdmVBcykoY29udGVudCwgXCJzZXNzaW9uLnppcFwiKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHRha2VCdWdyZXBvcnQoKSB7XG4gICAgYnVncmVwb3J0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBhZGJDb25uZWN0aW9uLnNoZWxsQW5kR2V0T3V0cHV0KFwiYnVncmVwb3J0elwiKVxuICAgICAgICAudGhlbigodmFsKSA9PiB7XG4gICAgICAgIGlmICh2YWwuc3RhcnRzV2l0aChcIk9LXCIpKSB7XG4gICAgICAgICAgICB2YXIgcGF0aCA9IHZhbC5zbGljZSgzKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVncmVwb3J0IHBhdGggaXMgXCIgKyBwYXRoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjYXB0dXJpbmcgYnVncmVwb3J0XCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDIwMTkgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbmV4cG9ydCBjb25zdCBfVGV4dERlY29kZXIgPSBUZXh0RGVjb2RlcjtcbmV4cG9ydCBjb25zdCBfVGV4dEVuY29kZXIgPSBUZXh0RW5jb2RlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wYWwudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=