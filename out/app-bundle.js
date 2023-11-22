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
const string_utils_1 = __webpack_require__(/*! ./WebAdb/base/string_utils */ "./src/WebAdb/base/string_utils.ts");
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
saveButton.addEventListener('click', download, false);
const webusb = new android_webusb_target_factory_1.AndroidWebusbTargetFactory(navigator.usb);
var adbConnection;
scriptArea.value = "getprop";
const logcatDecode = new TextDecoder();
var toRun = [];
var bugreports = [];
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
    // Pad with adb log -t debug commands
    var paddedLogs = [];
    toRun.forEach((val) => { paddedLogs.push("log -t debug " + "\"" + val.replaceAll("\"", "_") + "\""); paddedLogs.push(val); });
    toRun = paddedLogs;
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
    startRecordButton.classList.add("button-red");
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
    saveButton.classList.add("button-green");
    startRecordButton.classList.remove("button-red");
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
    saveButton.disabled = true;
    var zip = new jszip_1.default();
    if (bugreports.length > 0) {
        zip.file("bugreport.zip", bugreports[0]);
    }
    // add logcat
    zip.file("logcat.txt", logcatArea.value);
    // add commands output
    zip.file("output.txt", outputArea.value);
    // add video
    if (chunks.length > 0) {
        const blob = new Blob(chunks, { type: "video/x-matroska;codecs=avc1" });
        chunks = [];
        zip.file("video.webm", blob);
    }
    zip.generateAsync({ type: "blob" })
        .then(function (content) {
        saveButton.disabled = false;
        // see FileSaver.js
        (0, file_saver_1.saveAs)(content, "session.zip");
    });
}
function takeBugreport() {
    bugreportButton.disabled = true;
    bugreportButton.innerText = "Taking bug report";
    bugreportButton.classList.add("button-yellow");
    adbConnection.shellAndGetOutput("bugreportz")
        .then((val) => {
        if (val.startsWith("OK")) {
            bugreportButton.innerText = "Downloading bug report";
            var path = val.slice(3);
            console.log("bugreport path is " + path);
            adbConnection.shellAndGetOutput("base64 " + path).then((base64String) => {
                base64String = base64String.replaceAll("\n", "");
                bugreports.push((0, string_utils_1.base64Decode)(base64String));
                bugreportButton.classList.add("button-green");
                bugreportButton.classList.remove("button-yellow");
                bugreportButton.innerText = "Bugreport saved";
            });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsU0FBUztBQUN0QjtBQUNBLGNBQWMsU0FBUztBQUN2QjtBQUNBLGNBQWMsU0FBUzs7QUFFdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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OztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJLElBQThCO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRSxLQUFLLEVBSU47O0FBRUQ7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsY0FBYztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsT0FBTztBQUNyQjtBQUNBO0FBQ0EsZ0JBQWdCLFlBQVk7QUFDNUI7QUFDQSxJQUFJO0FBQ0o7QUFDQSxnQkFBZ0IsU0FBUztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsWUFBWTtBQUM5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsT0FBTztBQUNoQztBQUNBLDZCQUE2QixPQUFPO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLG9DQUFvQyxTQUFTO0FBQzdDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsUUFBUTtBQUN2QztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixzQkFBc0I7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsT0FBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG1EQUFtRDtBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4SkFBOEo7QUFDOUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELElBQUk7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsV0FBVztBQUN0RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUNBQXFDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEUsV0FBVztBQUNyRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1GQUFtRixVQUFVO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGNBQWM7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDQTs7Ozs7OztVQ2ZQO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGFsX2dpdC8uL25vZGVfbW9kdWxlcy9AcHJvdG9idWZqcy9iYXNlNjQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL25vZGVfbW9kdWxlcy9AcHJvdG9idWZqcy91dGY4L2luZGV4LmpzIiwid2VicGFjazovL3BhbF9naXQvLi9ub2RlX21vZHVsZXMvZmlsZS1zYXZlci9kaXN0L0ZpbGVTYXZlci5taW4uanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL25vZGVfbW9kdWxlcy9qc2JuLXJzYS9qc2JuLmpzIiwid2VicGFjazovL3BhbF9naXQvLi9ub2RlX21vZHVsZXMvanN6aXAvZGlzdC9qc3ppcC5taW4uanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS9kZWZlcnJlZC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL2Vycm9ycy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL2xvZ2dpbmcudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS9vYmplY3RfdXRpbHMudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS9zdHJpbmdfdXRpbHMudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL2FycmF5X2J1ZmZlcl9idWlsZGVyLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hZGJfY29ubmVjdGlvbl9pbXBsLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hZGJfY29ubmVjdGlvbl9vdmVyX3dlYnVzYi50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvYWRiX2ZpbGVfaGFuZGxlci50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvYXV0aC9hZGJfYXV0aC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvYXV0aC9hZGJfa2V5X21hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvcmVjb3JkaW5nX3V0aWxzLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi90YXJnZXRfZmFjdG9yaWVzL2FuZHJvaWRfd2VidXNiX3RhcmdldF9mYWN0b3J5LnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi90YXJnZXRzL2FuZHJvaWRfdGFyZ2V0LnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi90YXJnZXRzL2FuZHJvaWRfd2VidXNiX3RhcmdldC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL3BhbC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL3V0aWxzL2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BhbF9naXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogQSBtaW5pbWFsIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBmb3IgbnVtYmVyIGFycmF5cy5cclxuICogQG1lbWJlcm9mIHV0aWxcclxuICogQG5hbWVzcGFjZVxyXG4gKi9cclxudmFyIGJhc2U2NCA9IGV4cG9ydHM7XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB0aGUgYnl0ZSBsZW5ndGggb2YgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgQmFzZTY0IGVuY29kZWQgc3RyaW5nXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGUgbGVuZ3RoXHJcbiAqL1xyXG5iYXNlNjQubGVuZ3RoID0gZnVuY3Rpb24gbGVuZ3RoKHN0cmluZykge1xyXG4gICAgdmFyIHAgPSBzdHJpbmcubGVuZ3RoO1xyXG4gICAgaWYgKCFwKVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgdmFyIG4gPSAwO1xyXG4gICAgd2hpbGUgKC0tcCAlIDQgPiAxICYmIHN0cmluZy5jaGFyQXQocCkgPT09IFwiPVwiKVxyXG4gICAgICAgICsrbjtcclxuICAgIHJldHVybiBNYXRoLmNlaWwoc3RyaW5nLmxlbmd0aCAqIDMpIC8gNCAtIG47XHJcbn07XHJcblxyXG4vLyBCYXNlNjQgZW5jb2RpbmcgdGFibGVcclxudmFyIGI2NCA9IG5ldyBBcnJheSg2NCk7XHJcblxyXG4vLyBCYXNlNjQgZGVjb2RpbmcgdGFibGVcclxudmFyIHM2NCA9IG5ldyBBcnJheSgxMjMpO1xyXG5cclxuLy8gNjUuLjkwLCA5Ny4uMTIyLCA0OC4uNTcsIDQzLCA0N1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IDY0OylcclxuICAgIHM2NFtiNjRbaV0gPSBpIDwgMjYgPyBpICsgNjUgOiBpIDwgNTIgPyBpICsgNzEgOiBpIDwgNjIgPyBpIC0gNCA6IGkgLSA1OSB8IDQzXSA9IGkrKztcclxuXHJcbi8qKlxyXG4gKiBFbmNvZGVzIGEgYnVmZmVyIHRvIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxyXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IGJ1ZmZlciBTb3VyY2UgYnVmZmVyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBTb3VyY2Ugc3RhcnRcclxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBTb3VyY2UgZW5kXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEJhc2U2NCBlbmNvZGVkIHN0cmluZ1xyXG4gKi9cclxuYmFzZTY0LmVuY29kZSA9IGZ1bmN0aW9uIGVuY29kZShidWZmZXIsIHN0YXJ0LCBlbmQpIHtcclxuICAgIHZhciBwYXJ0cyA9IG51bGwsXHJcbiAgICAgICAgY2h1bmsgPSBbXTtcclxuICAgIHZhciBpID0gMCwgLy8gb3V0cHV0IGluZGV4XHJcbiAgICAgICAgaiA9IDAsIC8vIGdvdG8gaW5kZXhcclxuICAgICAgICB0OyAgICAgLy8gdGVtcG9yYXJ5XHJcbiAgICB3aGlsZSAoc3RhcnQgPCBlbmQpIHtcclxuICAgICAgICB2YXIgYiA9IGJ1ZmZlcltzdGFydCsrXTtcclxuICAgICAgICBzd2l0Y2ggKGopIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgY2h1bmtbaSsrXSA9IGI2NFtiID4+IDJdO1xyXG4gICAgICAgICAgICAgICAgdCA9IChiICYgMykgPDwgNDtcclxuICAgICAgICAgICAgICAgIGogPSAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGNodW5rW2krK10gPSBiNjRbdCB8IGIgPj4gNF07XHJcbiAgICAgICAgICAgICAgICB0ID0gKGIgJiAxNSkgPDwgMjtcclxuICAgICAgICAgICAgICAgIGogPSAyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGNodW5rW2krK10gPSBiNjRbdCB8IGIgPj4gNl07XHJcbiAgICAgICAgICAgICAgICBjaHVua1tpKytdID0gYjY0W2IgJiA2M107XHJcbiAgICAgICAgICAgICAgICBqID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaSA+IDgxOTEpIHtcclxuICAgICAgICAgICAgKHBhcnRzIHx8IChwYXJ0cyA9IFtdKSkucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmspKTtcclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGopIHtcclxuICAgICAgICBjaHVua1tpKytdID0gYjY0W3RdO1xyXG4gICAgICAgIGNodW5rW2krK10gPSA2MTtcclxuICAgICAgICBpZiAoaiA9PT0gMSlcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9IDYxO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcnRzKSB7XHJcbiAgICAgICAgaWYgKGkpXHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rLnNsaWNlKDAsIGkpKSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rLnNsaWNlKDAsIGkpKTtcclxufTtcclxuXHJcbnZhciBpbnZhbGlkRW5jb2RpbmcgPSBcImludmFsaWQgZW5jb2RpbmdcIjtcclxuXHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nIHRvIGEgYnVmZmVyLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFNvdXJjZSBzdHJpbmdcclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBidWZmZXIgRGVzdGluYXRpb24gYnVmZmVyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgRGVzdGluYXRpb24gb2Zmc2V0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IE51bWJlciBvZiBieXRlcyB3cml0dGVuXHJcbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiBlbmNvZGluZyBpcyBpbnZhbGlkXHJcbiAqL1xyXG5iYXNlNjQuZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKHN0cmluZywgYnVmZmVyLCBvZmZzZXQpIHtcclxuICAgIHZhciBzdGFydCA9IG9mZnNldDtcclxuICAgIHZhciBqID0gMCwgLy8gZ290byBpbmRleFxyXG4gICAgICAgIHQ7ICAgICAvLyB0ZW1wb3JhcnlcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDspIHtcclxuICAgICAgICB2YXIgYyA9IHN0cmluZy5jaGFyQ29kZUF0KGkrKyk7XHJcbiAgICAgICAgaWYgKGMgPT09IDYxICYmIGogPiAxKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBpZiAoKGMgPSBzNjRbY10pID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGludmFsaWRFbmNvZGluZyk7XHJcbiAgICAgICAgc3dpdGNoIChqKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHQgPSBjO1xyXG4gICAgICAgICAgICAgICAgaiA9IDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IHQgPDwgMiB8IChjICYgNDgpID4+IDQ7XHJcbiAgICAgICAgICAgICAgICB0ID0gYztcclxuICAgICAgICAgICAgICAgIGogPSAyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSAodCAmIDE1KSA8PCA0IHwgKGMgJiA2MCkgPj4gMjtcclxuICAgICAgICAgICAgICAgIHQgPSBjO1xyXG4gICAgICAgICAgICAgICAgaiA9IDM7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9ICh0ICYgMykgPDwgNiB8IGM7XHJcbiAgICAgICAgICAgICAgICBqID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChqID09PSAxKVxyXG4gICAgICAgIHRocm93IEVycm9yKGludmFsaWRFbmNvZGluZyk7XHJcbiAgICByZXR1cm4gb2Zmc2V0IC0gc3RhcnQ7XHJcbn07XHJcblxyXG4vKipcclxuICogVGVzdHMgaWYgdGhlIHNwZWNpZmllZCBzdHJpbmcgYXBwZWFycyB0byBiZSBiYXNlNjQgZW5jb2RlZC5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmcgdG8gdGVzdFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHByb2JhYmx5IGJhc2U2NCBlbmNvZGVkLCBvdGhlcndpc2UgZmFsc2VcclxuICovXHJcbmJhc2U2NC50ZXN0ID0gZnVuY3Rpb24gdGVzdChzdHJpbmcpIHtcclxuICAgIHJldHVybiAvXig/OltBLVphLXowLTkrL117NH0pKig/OltBLVphLXowLTkrL117Mn09PXxbQS1aYS16MC05Ky9dezN9PSk/JC8udGVzdChzdHJpbmcpO1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qKlxyXG4gKiBBIG1pbmltYWwgVVRGOCBpbXBsZW1lbnRhdGlvbiBmb3IgbnVtYmVyIGFycmF5cy5cclxuICogQG1lbWJlcm9mIHV0aWxcclxuICogQG5hbWVzcGFjZVxyXG4gKi9cclxudmFyIHV0ZjggPSBleHBvcnRzO1xyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIFVURjggYnl0ZSBsZW5ndGggb2YgYSBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU3RyaW5nXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGUgbGVuZ3RoXHJcbiAqL1xyXG51dGY4Lmxlbmd0aCA9IGZ1bmN0aW9uIHV0ZjhfbGVuZ3RoKHN0cmluZykge1xyXG4gICAgdmFyIGxlbiA9IDAsXHJcbiAgICAgICAgYyA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGMgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBpZiAoYyA8IDEyOClcclxuICAgICAgICAgICAgbGVuICs9IDE7XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpXHJcbiAgICAgICAgICAgIGxlbiArPSAyO1xyXG4gICAgICAgIGVsc2UgaWYgKChjICYgMHhGQzAwKSA9PT0gMHhEODAwICYmIChzdHJpbmcuY2hhckNvZGVBdChpICsgMSkgJiAweEZDMDApID09PSAweERDMDApIHtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBsZW4gKz0gNDtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgbGVuICs9IDM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVuO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlYWRzIFVURjggYnl0ZXMgYXMgYSBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7VWludDhBcnJheX0gYnVmZmVyIFNvdXJjZSBidWZmZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFNvdXJjZSBzdGFydFxyXG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFNvdXJjZSBlbmRcclxuICogQHJldHVybnMge3N0cmluZ30gU3RyaW5nIHJlYWRcclxuICovXHJcbnV0ZjgucmVhZCA9IGZ1bmN0aW9uIHV0ZjhfcmVhZChidWZmZXIsIHN0YXJ0LCBlbmQpIHtcclxuICAgIHZhciBsZW4gPSBlbmQgLSBzdGFydDtcclxuICAgIGlmIChsZW4gPCAxKVxyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgdmFyIHBhcnRzID0gbnVsbCxcclxuICAgICAgICBjaHVuayA9IFtdLFxyXG4gICAgICAgIGkgPSAwLCAvLyBjaGFyIG9mZnNldFxyXG4gICAgICAgIHQ7ICAgICAvLyB0ZW1wb3JhcnlcclxuICAgIHdoaWxlIChzdGFydCA8IGVuZCkge1xyXG4gICAgICAgIHQgPSBidWZmZXJbc3RhcnQrK107XHJcbiAgICAgICAgaWYgKHQgPCAxMjgpXHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSB0O1xyXG4gICAgICAgIGVsc2UgaWYgKHQgPiAxOTEgJiYgdCA8IDIyNClcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9ICh0ICYgMzEpIDw8IDYgfCBidWZmZXJbc3RhcnQrK10gJiA2MztcclxuICAgICAgICBlbHNlIGlmICh0ID4gMjM5ICYmIHQgPCAzNjUpIHtcclxuICAgICAgICAgICAgdCA9ICgodCAmIDcpIDw8IDE4IHwgKGJ1ZmZlcltzdGFydCsrXSAmIDYzKSA8PCAxMiB8IChidWZmZXJbc3RhcnQrK10gJiA2MykgPDwgNiB8IGJ1ZmZlcltzdGFydCsrXSAmIDYzKSAtIDB4MTAwMDA7XHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSAweEQ4MDAgKyAodCA+PiAxMCk7XHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSAweERDMDAgKyAodCAmIDEwMjMpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gKHQgJiAxNSkgPDwgMTIgfCAoYnVmZmVyW3N0YXJ0KytdICYgNjMpIDw8IDYgfCBidWZmZXJbc3RhcnQrK10gJiA2MztcclxuICAgICAgICBpZiAoaSA+IDgxOTEpIHtcclxuICAgICAgICAgICAgKHBhcnRzIHx8IChwYXJ0cyA9IFtdKSkucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmspKTtcclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHBhcnRzKSB7XHJcbiAgICAgICAgaWYgKGkpXHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rLnNsaWNlKDAsIGkpKSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rLnNsaWNlKDAsIGkpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBXcml0ZXMgYSBzdHJpbmcgYXMgVVRGOCBieXRlcy5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTb3VyY2Ugc3RyaW5nXHJcbiAqIEBwYXJhbSB7VWludDhBcnJheX0gYnVmZmVyIERlc3RpbmF0aW9uIGJ1ZmZlclxyXG4gKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IERlc3RpbmF0aW9uIG9mZnNldFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBCeXRlcyB3cml0dGVuXHJcbiAqL1xyXG51dGY4LndyaXRlID0gZnVuY3Rpb24gdXRmOF93cml0ZShzdHJpbmcsIGJ1ZmZlciwgb2Zmc2V0KSB7XHJcbiAgICB2YXIgc3RhcnQgPSBvZmZzZXQsXHJcbiAgICAgICAgYzEsIC8vIGNoYXJhY3RlciAxXHJcbiAgICAgICAgYzI7IC8vIGNoYXJhY3RlciAyXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGMxID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMxIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMTtcclxuICAgICAgICB9IGVsc2UgaWYgKGMxIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gNiAgICAgICB8IDE5MjtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxICAgICAgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgfSBlbHNlIGlmICgoYzEgJiAweEZDMDApID09PSAweEQ4MDAgJiYgKChjMiA9IHN0cmluZy5jaGFyQ29kZUF0KGkgKyAxKSkgJiAweEZDMDApID09PSAweERDMDApIHtcclxuICAgICAgICAgICAgYzEgPSAweDEwMDAwICsgKChjMSAmIDB4MDNGRikgPDwgMTApICsgKGMyICYgMHgwM0ZGKTtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gMTggICAgICB8IDI0MDtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDEyICYgNjMgfCAxMjg7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiA2ICAmIDYzIHwgMTI4O1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgICAgICAgJiA2MyB8IDEyODtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gMTIgICAgICB8IDIyNDtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDYgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSAgICAgICAmIDYzIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvZmZzZXQgLSBzdGFydDtcclxufTtcclxuIiwiKGZ1bmN0aW9uKGEsYil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSxiKTtlbHNlIGlmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBleHBvcnRzKWIoKTtlbHNle2IoKSxhLkZpbGVTYXZlcj17ZXhwb3J0czp7fX0uZXhwb3J0c319KSh0aGlzLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYihhLGIpe3JldHVyblwidW5kZWZpbmVkXCI9PXR5cGVvZiBiP2I9e2F1dG9Cb206ITF9Olwib2JqZWN0XCIhPXR5cGVvZiBiJiYoY29uc29sZS53YXJuKFwiRGVwcmVjYXRlZDogRXhwZWN0ZWQgdGhpcmQgYXJndW1lbnQgdG8gYmUgYSBvYmplY3RcIiksYj17YXV0b0JvbTohYn0pLGIuYXV0b0JvbSYmL15cXHMqKD86dGV4dFxcL1xcUyp8YXBwbGljYXRpb25cXC94bWx8XFxTKlxcL1xcUypcXCt4bWwpXFxzKjsuKmNoYXJzZXRcXHMqPVxccyp1dGYtOC9pLnRlc3QoYS50eXBlKT9uZXcgQmxvYihbXCJcXHVGRUZGXCIsYV0se3R5cGU6YS50eXBlfSk6YX1mdW5jdGlvbiBjKGEsYixjKXt2YXIgZD1uZXcgWE1MSHR0cFJlcXVlc3Q7ZC5vcGVuKFwiR0VUXCIsYSksZC5yZXNwb25zZVR5cGU9XCJibG9iXCIsZC5vbmxvYWQ9ZnVuY3Rpb24oKXtnKGQucmVzcG9uc2UsYixjKX0sZC5vbmVycm9yPWZ1bmN0aW9uKCl7Y29uc29sZS5lcnJvcihcImNvdWxkIG5vdCBkb3dubG9hZCBmaWxlXCIpfSxkLnNlbmQoKX1mdW5jdGlvbiBkKGEpe3ZhciBiPW5ldyBYTUxIdHRwUmVxdWVzdDtiLm9wZW4oXCJIRUFEXCIsYSwhMSk7dHJ5e2Iuc2VuZCgpfWNhdGNoKGEpe31yZXR1cm4gMjAwPD1iLnN0YXR1cyYmMjk5Pj1iLnN0YXR1c31mdW5jdGlvbiBlKGEpe3RyeXthLmRpc3BhdGNoRXZlbnQobmV3IE1vdXNlRXZlbnQoXCJjbGlja1wiKSl9Y2F0Y2goYyl7dmFyIGI9ZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJNb3VzZUV2ZW50c1wiKTtiLmluaXRNb3VzZUV2ZW50KFwiY2xpY2tcIiwhMCwhMCx3aW5kb3csMCwwLDAsODAsMjAsITEsITEsITEsITEsMCxudWxsKSxhLmRpc3BhdGNoRXZlbnQoYil9fXZhciBmPVwib2JqZWN0XCI9PXR5cGVvZiB3aW5kb3cmJndpbmRvdy53aW5kb3c9PT13aW5kb3c/d2luZG93Olwib2JqZWN0XCI9PXR5cGVvZiBzZWxmJiZzZWxmLnNlbGY9PT1zZWxmP3NlbGY6XCJvYmplY3RcIj09dHlwZW9mIGdsb2JhbCYmZ2xvYmFsLmdsb2JhbD09PWdsb2JhbD9nbG9iYWw6dm9pZCAwLGE9Zi5uYXZpZ2F0b3ImJi9NYWNpbnRvc2gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkmJi9BcHBsZVdlYktpdC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSYmIS9TYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksZz1mLnNhdmVBc3x8KFwib2JqZWN0XCIhPXR5cGVvZiB3aW5kb3d8fHdpbmRvdyE9PWY/ZnVuY3Rpb24oKXt9OlwiZG93bmxvYWRcImluIEhUTUxBbmNob3JFbGVtZW50LnByb3RvdHlwZSYmIWE/ZnVuY3Rpb24oYixnLGgpe3ZhciBpPWYuVVJMfHxmLndlYmtpdFVSTCxqPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2c9Z3x8Yi5uYW1lfHxcImRvd25sb2FkXCIsai5kb3dubG9hZD1nLGoucmVsPVwibm9vcGVuZXJcIixcInN0cmluZ1wiPT10eXBlb2YgYj8oai5ocmVmPWIsai5vcmlnaW49PT1sb2NhdGlvbi5vcmlnaW4/ZShqKTpkKGouaHJlZik/YyhiLGcsaCk6ZShqLGoudGFyZ2V0PVwiX2JsYW5rXCIpKTooai5ocmVmPWkuY3JlYXRlT2JqZWN0VVJMKGIpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtpLnJldm9rZU9iamVjdFVSTChqLmhyZWYpfSw0RTQpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKGopfSwwKSl9OlwibXNTYXZlT3JPcGVuQmxvYlwiaW4gbmF2aWdhdG9yP2Z1bmN0aW9uKGYsZyxoKXtpZihnPWd8fGYubmFtZXx8XCJkb3dubG9hZFwiLFwic3RyaW5nXCIhPXR5cGVvZiBmKW5hdmlnYXRvci5tc1NhdmVPck9wZW5CbG9iKGIoZixoKSxnKTtlbHNlIGlmKGQoZikpYyhmLGcsaCk7ZWxzZXt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtpLmhyZWY9ZixpLnRhcmdldD1cIl9ibGFua1wiLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlKGkpfSl9fTpmdW5jdGlvbihiLGQsZSxnKXtpZihnPWd8fG9wZW4oXCJcIixcIl9ibGFua1wiKSxnJiYoZy5kb2N1bWVudC50aXRsZT1nLmRvY3VtZW50LmJvZHkuaW5uZXJUZXh0PVwiZG93bmxvYWRpbmcuLi5cIiksXCJzdHJpbmdcIj09dHlwZW9mIGIpcmV0dXJuIGMoYixkLGUpO3ZhciBoPVwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCI9PT1iLnR5cGUsaT0vY29uc3RydWN0b3IvaS50ZXN0KGYuSFRNTEVsZW1lbnQpfHxmLnNhZmFyaSxqPS9DcmlPU1xcL1tcXGRdKy8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtpZigoanx8aCYmaXx8YSkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBGaWxlUmVhZGVyKXt2YXIgaz1uZXcgRmlsZVJlYWRlcjtrLm9ubG9hZGVuZD1mdW5jdGlvbigpe3ZhciBhPWsucmVzdWx0O2E9aj9hOmEucmVwbGFjZSgvXmRhdGE6W147XSo7LyxcImRhdGE6YXR0YWNobWVudC9maWxlO1wiKSxnP2cubG9jYXRpb24uaHJlZj1hOmxvY2F0aW9uPWEsZz1udWxsfSxrLnJlYWRBc0RhdGFVUkwoYil9ZWxzZXt2YXIgbD1mLlVSTHx8Zi53ZWJraXRVUkwsbT1sLmNyZWF0ZU9iamVjdFVSTChiKTtnP2cubG9jYXRpb249bTpsb2NhdGlvbi5ocmVmPW0sZz1udWxsLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtsLnJldm9rZU9iamVjdFVSTChtKX0sNEU0KX19KTtmLnNhdmVBcz1nLnNhdmVBcz1nLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJihtb2R1bGUuZXhwb3J0cz1nKX0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1GaWxlU2F2ZXIubWluLmpzLm1hcCIsIlxuKGZ1bmN0aW9uKCkge1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDUgIFRvbSBXdVxuLy8gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIFNlZSBcIkxJQ0VOU0VcIiBmb3IgZGV0YWlscy5cblxuLy8gQmFzaWMgSmF2YVNjcmlwdCBCTiBsaWJyYXJ5IC0gc3Vic2V0IHVzZWZ1bCBmb3IgUlNBIGVuY3J5cHRpb24uXG5cbnZhciBpbkJyb3dzZXIgPVxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBCaXRzIHBlciBkaWdpdFxudmFyIGRiaXRzO1xuXG4vLyBKYXZhU2NyaXB0IGVuZ2luZSBhbmFseXNpc1xudmFyIGNhbmFyeSA9IDB4ZGVhZGJlZWZjYWZlO1xudmFyIGpfbG0gPSAoKGNhbmFyeSAmIDB4ZmZmZmZmKSA9PSAweGVmY2FmZSk7XG5cbi8vIChwdWJsaWMpIENvbnN0cnVjdG9yXG5mdW5jdGlvbiBCaWdJbnRlZ2VyKGEsIGIsIGMpIHtcbiAgaWYgKGEgIT0gbnVsbClcbiAgICBpZiAoJ251bWJlcicgPT0gdHlwZW9mIGEpXG4gICAgICB0aGlzLmZyb21OdW1iZXIoYSwgYiwgYyk7XG4gICAgZWxzZSBpZiAoYiA9PSBudWxsICYmICdzdHJpbmcnICE9IHR5cGVvZiBhKVxuICAgICAgdGhpcy5mcm9tU3RyaW5nKGEsIDI1Nik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5mcm9tU3RyaW5nKGEsIGIpO1xufVxuXG4vLyByZXR1cm4gbmV3LCB1bnNldCBCaWdJbnRlZ2VyXG5mdW5jdGlvbiBuYmkoKSB7XG4gIHJldHVybiBuZXcgQmlnSW50ZWdlcihudWxsKTtcbn1cblxuLy8gYW06IENvbXB1dGUgd19qICs9ICh4KnRoaXNfaSksIHByb3BhZ2F0ZSBjYXJyaWVzLFxuLy8gYyBpcyBpbml0aWFsIGNhcnJ5LCByZXR1cm5zIGZpbmFsIGNhcnJ5LlxuLy8gYyA8IDMqZHZhbHVlLCB4IDwgMipkdmFsdWUsIHRoaXNfaSA8IGR2YWx1ZVxuLy8gV2UgbmVlZCB0byBzZWxlY3QgdGhlIGZhc3Rlc3Qgb25lIHRoYXQgd29ya3MgaW4gdGhpcyBlbnZpcm9ubWVudC5cblxuLy8gYW0xOiB1c2UgYSBzaW5nbGUgbXVsdCBhbmQgZGl2aWRlIHRvIGdldCB0aGUgaGlnaCBiaXRzLFxuLy8gbWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDI2IGJlY2F1c2Vcbi8vIG1heCBpbnRlcm5hbCB2YWx1ZSA9IDIqZHZhbHVlXjItMipkdmFsdWUgKDwgMl41MylcbmZ1bmN0aW9uIGFtMShpLCB4LCB3LCBqLCBjLCBuKSB7XG4gIHdoaWxlICgtLW4gPj0gMCkge1xuICAgIHZhciB2ID0geCAqIHRoaXNbaSsrXSArIHdbal0gKyBjO1xuICAgIGMgPSBNYXRoLmZsb29yKHYgLyAweDQwMDAwMDApO1xuICAgIHdbaisrXSA9IHYgJiAweDNmZmZmZmY7XG4gIH1cbiAgcmV0dXJuIGM7XG59XG4vLyBhbTIgYXZvaWRzIGEgYmlnIG11bHQtYW5kLWV4dHJhY3QgY29tcGxldGVseS5cbi8vIE1heCBkaWdpdCBiaXRzIHNob3VsZCBiZSA8PSAzMCBiZWNhdXNlIHdlIGRvIGJpdHdpc2Ugb3BzXG4vLyBvbiB2YWx1ZXMgdXAgdG8gMipoZHZhbHVlXjItaGR2YWx1ZS0xICg8IDJeMzEpXG5mdW5jdGlvbiBhbTIoaSwgeCwgdywgaiwgYywgbikge1xuICB2YXIgeGwgPSB4ICYgMHg3ZmZmLCB4aCA9IHggPj4gMTU7XG4gIHdoaWxlICgtLW4gPj0gMCkge1xuICAgIHZhciBsID0gdGhpc1tpXSAmIDB4N2ZmZjtcbiAgICB2YXIgaCA9IHRoaXNbaSsrXSA+PiAxNTtcbiAgICB2YXIgbSA9IHhoICogbCArIGggKiB4bDtcbiAgICBsID0geGwgKiBsICsgKChtICYgMHg3ZmZmKSA8PCAxNSkgKyB3W2pdICsgKGMgJiAweDNmZmZmZmZmKTtcbiAgICBjID0gKGwgPj4+IDMwKSArIChtID4+PiAxNSkgKyB4aCAqIGggKyAoYyA+Pj4gMzApO1xuICAgIHdbaisrXSA9IGwgJiAweDNmZmZmZmZmO1xuICB9XG4gIHJldHVybiBjO1xufVxuLy8gQWx0ZXJuYXRlbHksIHNldCBtYXggZGlnaXQgYml0cyB0byAyOCBzaW5jZSBzb21lXG4vLyBicm93c2VycyBzbG93IGRvd24gd2hlbiBkZWFsaW5nIHdpdGggMzItYml0IG51bWJlcnMuXG5mdW5jdGlvbiBhbTMoaSwgeCwgdywgaiwgYywgbikge1xuICB2YXIgeGwgPSB4ICYgMHgzZmZmLCB4aCA9IHggPj4gMTQ7XG4gIHdoaWxlICgtLW4gPj0gMCkge1xuICAgIHZhciBsID0gdGhpc1tpXSAmIDB4M2ZmZjtcbiAgICB2YXIgaCA9IHRoaXNbaSsrXSA+PiAxNDtcbiAgICB2YXIgbSA9IHhoICogbCArIGggKiB4bDtcbiAgICBsID0geGwgKiBsICsgKChtICYgMHgzZmZmKSA8PCAxNCkgKyB3W2pdICsgYztcbiAgICBjID0gKGwgPj4gMjgpICsgKG0gPj4gMTQpICsgeGggKiBoO1xuICAgIHdbaisrXSA9IGwgJiAweGZmZmZmZmY7XG4gIH1cbiAgcmV0dXJuIGM7XG59XG5pZiAoaW5Ccm93c2VyICYmIGpfbG0gJiYgKG5hdmlnYXRvci5hcHBOYW1lID09ICdNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXInKSkge1xuICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbSA9IGFtMjtcbiAgZGJpdHMgPSAzMDtcbn0gZWxzZSBpZiAoaW5Ccm93c2VyICYmIGpfbG0gJiYgKG5hdmlnYXRvci5hcHBOYW1lICE9ICdOZXRzY2FwZScpKSB7XG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0xO1xuICBkYml0cyA9IDI2O1xufSBlbHNlIHsgIC8vIE1vemlsbGEvTmV0c2NhcGUgc2VlbXMgdG8gcHJlZmVyIGFtM1xuICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbSA9IGFtMztcbiAgZGJpdHMgPSAyODtcbn1cblxuQmlnSW50ZWdlci5wcm90b3R5cGUuREIgPSBkYml0cztcbkJpZ0ludGVnZXIucHJvdG90eXBlLkRNID0gKCgxIDw8IGRiaXRzKSAtIDEpO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRFYgPSAoMSA8PCBkYml0cyk7XG5cbnZhciBCSV9GUCA9IDUyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRlYgPSBNYXRoLnBvdygyLCBCSV9GUCk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GMSA9IEJJX0ZQIC0gZGJpdHM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GMiA9IDIgKiBkYml0cyAtIEJJX0ZQO1xuXG4vLyBEaWdpdCBjb252ZXJzaW9uc1xudmFyIEJJX1JNID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XG52YXIgQklfUkMgPSBuZXcgQXJyYXkoKTtcbnZhciByciwgdnY7XG5yciA9ICcwJy5jaGFyQ29kZUF0KDApO1xuZm9yICh2diA9IDA7IHZ2IDw9IDk7ICsrdnYpIEJJX1JDW3JyKytdID0gdnY7XG5yciA9ICdhJy5jaGFyQ29kZUF0KDApO1xuZm9yICh2diA9IDEwOyB2diA8IDM2OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2O1xucnIgPSAnQScuY2hhckNvZGVBdCgwKTtcbmZvciAodnYgPSAxMDsgdnYgPCAzNjsgKyt2dikgQklfUkNbcnIrK10gPSB2djtcblxuZnVuY3Rpb24gaW50MmNoYXIobikge1xuICByZXR1cm4gQklfUk0uY2hhckF0KG4pO1xufVxuZnVuY3Rpb24gaW50QXQocywgaSkge1xuICB2YXIgYyA9IEJJX1JDW3MuY2hhckNvZGVBdChpKV07XG4gIHJldHVybiAoYyA9PSBudWxsKSA/IC0xIDogYztcbn1cblxuLy8gKHByb3RlY3RlZCkgY29weSB0aGlzIHRvIHJcbmZ1bmN0aW9uIGJucENvcHlUbyhyKSB7XG4gIGZvciAodmFyIGkgPSB0aGlzLnQgLSAxOyBpID49IDA7IC0taSkgcltpXSA9IHRoaXNbaV07XG4gIHIudCA9IHRoaXMudDtcbiAgci5zID0gdGhpcy5zO1xufVxuXG4vLyAocHJvdGVjdGVkKSBzZXQgZnJvbSBpbnRlZ2VyIHZhbHVlIHgsIC1EViA8PSB4IDwgRFZcbmZ1bmN0aW9uIGJucEZyb21JbnQoeCkge1xuICB0aGlzLnQgPSAxO1xuICB0aGlzLnMgPSAoeCA8IDApID8gLTEgOiAwO1xuICBpZiAoeCA+IDApXG4gICAgdGhpc1swXSA9IHg7XG4gIGVsc2UgaWYgKHggPCAtMSlcbiAgICB0aGlzWzBdID0geCArIHRoaXMuRFY7XG4gIGVsc2VcbiAgICB0aGlzLnQgPSAwO1xufVxuXG4vLyByZXR1cm4gYmlnaW50IGluaXRpYWxpemVkIHRvIHZhbHVlXG5mdW5jdGlvbiBuYnYoaSkge1xuICB2YXIgciA9IG5iaSgpO1xuICByLmZyb21JbnQoaSk7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHJvdGVjdGVkKSBzZXQgZnJvbSBzdHJpbmcgYW5kIHJhZGl4XG5mdW5jdGlvbiBibnBGcm9tU3RyaW5nKHMsIGIpIHtcbiAgdmFyIGs7XG4gIGlmIChiID09IDE2KVxuICAgIGsgPSA0O1xuICBlbHNlIGlmIChiID09IDgpXG4gICAgayA9IDM7XG4gIGVsc2UgaWYgKGIgPT0gMjU2KVxuICAgIGsgPSA4OyAgLy8gYnl0ZSBhcnJheVxuICBlbHNlIGlmIChiID09IDIpXG4gICAgayA9IDE7XG4gIGVsc2UgaWYgKGIgPT0gMzIpXG4gICAgayA9IDU7XG4gIGVsc2UgaWYgKGIgPT0gNClcbiAgICBrID0gMjtcbiAgZWxzZSB7XG4gICAgdGhpcy5mcm9tUmFkaXgocywgYik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMudCA9IDA7XG4gIHRoaXMucyA9IDA7XG4gIHZhciBpID0gcy5sZW5ndGgsIG1pID0gZmFsc2UsIHNoID0gMDtcbiAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgdmFyIHggPSAoayA9PSA4KSA/IHNbaV0gJiAweGZmIDogaW50QXQocywgaSk7XG4gICAgaWYgKHggPCAwKSB7XG4gICAgICBpZiAocy5jaGFyQXQoaSkgPT0gJy0nKSBtaSA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgbWkgPSBmYWxzZTtcbiAgICBpZiAoc2ggPT0gMClcbiAgICAgIHRoaXNbdGhpcy50KytdID0geDtcbiAgICBlbHNlIGlmIChzaCArIGsgPiB0aGlzLkRCKSB7XG4gICAgICB0aGlzW3RoaXMudCAtIDFdIHw9ICh4ICYgKCgxIDw8ICh0aGlzLkRCIC0gc2gpKSAtIDEpKSA8PCBzaDtcbiAgICAgIHRoaXNbdGhpcy50KytdID0gKHggPj4gKHRoaXMuREIgLSBzaCkpO1xuICAgIH0gZWxzZVxuICAgICAgdGhpc1t0aGlzLnQgLSAxXSB8PSB4IDw8IHNoO1xuICAgIHNoICs9IGs7XG4gICAgaWYgKHNoID49IHRoaXMuREIpIHNoIC09IHRoaXMuREI7XG4gIH1cbiAgaWYgKGsgPT0gOCAmJiAoc1swXSAmIDB4ODApICE9IDApIHtcbiAgICB0aGlzLnMgPSAtMTtcbiAgICBpZiAoc2ggPiAwKSB0aGlzW3RoaXMudCAtIDFdIHw9ICgoMSA8PCAodGhpcy5EQiAtIHNoKSkgLSAxKSA8PCBzaDtcbiAgfVxuICB0aGlzLmNsYW1wKCk7XG4gIGlmIChtaSkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsIHRoaXMpO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjbGFtcCBvZmYgZXhjZXNzIGhpZ2ggd29yZHNcbmZ1bmN0aW9uIGJucENsYW1wKCkge1xuICB2YXIgYyA9IHRoaXMucyAmIHRoaXMuRE07XG4gIHdoaWxlICh0aGlzLnQgPiAwICYmIHRoaXNbdGhpcy50IC0gMV0gPT0gYykgLS10aGlzLnQ7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW4gZ2l2ZW4gcmFkaXhcbmZ1bmN0aW9uIGJuVG9TdHJpbmcoYikge1xuICBpZiAodGhpcy5zIDwgMCkgcmV0dXJuICctJyArIHRoaXMubmVnYXRlKCkudG9TdHJpbmcoYik7XG4gIHZhciBrO1xuICBpZiAoYiA9PSAxNilcbiAgICBrID0gNDtcbiAgZWxzZSBpZiAoYiA9PSA4KVxuICAgIGsgPSAzO1xuICBlbHNlIGlmIChiID09IDIpXG4gICAgayA9IDE7XG4gIGVsc2UgaWYgKGIgPT0gMzIpXG4gICAgayA9IDU7XG4gIGVsc2UgaWYgKGIgPT0gNClcbiAgICBrID0gMjtcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzLnRvUmFkaXgoYik7XG4gIHZhciBrbSA9ICgxIDw8IGspIC0gMSwgZCwgbSA9IGZhbHNlLCByID0gJycsIGkgPSB0aGlzLnQ7XG4gIHZhciBwID0gdGhpcy5EQiAtIChpICogdGhpcy5EQikgJSBrO1xuICBpZiAoaS0tID4gMCkge1xuICAgIGlmIChwIDwgdGhpcy5EQiAmJiAoZCA9IHRoaXNbaV0gPj4gcCkgPiAwKSB7XG4gICAgICBtID0gdHJ1ZTtcbiAgICAgIHIgPSBpbnQyY2hhcihkKTtcbiAgICB9XG4gICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgaWYgKHAgPCBrKSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSAmICgoMSA8PCBwKSAtIDEpKSA8PCAoayAtIHApO1xuICAgICAgICBkIHw9IHRoaXNbLS1pXSA+PiAocCArPSB0aGlzLkRCIC0gayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkID0gKHRoaXNbaV0gPj4gKHAgLT0gaykpICYga207XG4gICAgICAgIGlmIChwIDw9IDApIHtcbiAgICAgICAgICBwICs9IHRoaXMuREI7XG4gICAgICAgICAgLS1pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZCA+IDApIG0gPSB0cnVlO1xuICAgICAgaWYgKG0pIHIgKz0gaW50MmNoYXIoZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtID8gciA6ICcwJztcbn1cblxuLy8gKHB1YmxpYykgLXRoaXNcbmZ1bmN0aW9uIGJuTmVnYXRlKCkge1xuICB2YXIgciA9IG5iaSgpO1xuICBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcywgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB8dGhpc3xcbmZ1bmN0aW9uIGJuQWJzKCkge1xuICByZXR1cm4gKHRoaXMucyA8IDApID8gdGhpcy5uZWdhdGUoKSA6IHRoaXM7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiArIGlmIHRoaXMgPiBhLCAtIGlmIHRoaXMgPCBhLCAwIGlmIGVxdWFsXG5mdW5jdGlvbiBibkNvbXBhcmVUbyhhKSB7XG4gIHZhciByID0gdGhpcy5zIC0gYS5zO1xuICBpZiAociAhPSAwKSByZXR1cm4gcjtcbiAgdmFyIGkgPSB0aGlzLnQ7XG4gIHIgPSBpIC0gYS50O1xuICBpZiAociAhPSAwKSByZXR1cm4gKHRoaXMucyA8IDApID8gLXIgOiByO1xuICB3aGlsZSAoLS1pID49IDApXG4gICAgaWYgKChyID0gdGhpc1tpXSAtIGFbaV0pICE9IDApIHJldHVybiByO1xuICByZXR1cm4gMDtcbn1cblxuLy8gcmV0dXJucyBiaXQgbGVuZ3RoIG9mIHRoZSBpbnRlZ2VyIHhcbmZ1bmN0aW9uIG5iaXRzKHgpIHtcbiAgdmFyIHIgPSAxLCB0O1xuICBpZiAoKHQgPSB4ID4+PiAxNikgIT0gMCkge1xuICAgIHggPSB0O1xuICAgIHIgKz0gMTY7XG4gIH1cbiAgaWYgKCh0ID0geCA+PiA4KSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSA4O1xuICB9XG4gIGlmICgodCA9IHggPj4gNCkgIT0gMCkge1xuICAgIHggPSB0O1xuICAgIHIgKz0gNDtcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDIpICE9IDApIHtcbiAgICB4ID0gdDtcbiAgICByICs9IDI7XG4gIH1cbiAgaWYgKCh0ID0geCA+PiAxKSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSAxO1xuICB9XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdGhlIG51bWJlciBvZiBiaXRzIGluIFwidGhpc1wiXG5mdW5jdGlvbiBibkJpdExlbmd0aCgpIHtcbiAgaWYgKHRoaXMudCA8PSAwKSByZXR1cm4gMDtcbiAgcmV0dXJuIHRoaXMuREIgKiAodGhpcy50IC0gMSkgKyBuYml0cyh0aGlzW3RoaXMudCAtIDFdIF4gKHRoaXMucyAmIHRoaXMuRE0pKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPDwgbipEQlxuZnVuY3Rpb24gYm5wRExTaGlmdFRvKG4sIHIpIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSByW2kgKyBuXSA9IHRoaXNbaV07XG4gIGZvciAoaSA9IG4gLSAxOyBpID49IDA7IC0taSkgcltpXSA9IDA7XG4gIHIudCA9IHRoaXMudCArIG47XG4gIHIucyA9IHRoaXMucztcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gbipEQlxuZnVuY3Rpb24gYm5wRFJTaGlmdFRvKG4sIHIpIHtcbiAgZm9yICh2YXIgaSA9IG47IGkgPCB0aGlzLnQ7ICsraSkgcltpIC0gbl0gPSB0aGlzW2ldO1xuICByLnQgPSBNYXRoLm1heCh0aGlzLnQgLSBuLCAwKTtcbiAgci5zID0gdGhpcy5zO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA8PCBuXG5mdW5jdGlvbiBibnBMU2hpZnRUbyhuLCByKSB7XG4gIHZhciBicyA9IG4gJSB0aGlzLkRCO1xuICB2YXIgY2JzID0gdGhpcy5EQiAtIGJzO1xuICB2YXIgYm0gPSAoMSA8PCBjYnMpIC0gMTtcbiAgdmFyIGRzID0gTWF0aC5mbG9vcihuIC8gdGhpcy5EQiksIGMgPSAodGhpcy5zIDw8IGJzKSAmIHRoaXMuRE0sIGk7XG4gIGZvciAoaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgcltpICsgZHMgKyAxXSA9ICh0aGlzW2ldID4+IGNicykgfCBjO1xuICAgIGMgPSAodGhpc1tpXSAmIGJtKSA8PCBicztcbiAgfVxuICBmb3IgKGkgPSBkcyAtIDE7IGkgPj0gMDsgLS1pKSByW2ldID0gMDtcbiAgcltkc10gPSBjO1xuICByLnQgPSB0aGlzLnQgKyBkcyArIDE7XG4gIHIucyA9IHRoaXMucztcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA+PiBuXG5mdW5jdGlvbiBibnBSU2hpZnRUbyhuLCByKSB7XG4gIHIucyA9IHRoaXMucztcbiAgdmFyIGRzID0gTWF0aC5mbG9vcihuIC8gdGhpcy5EQik7XG4gIGlmIChkcyA+PSB0aGlzLnQpIHtcbiAgICByLnQgPSAwO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgYnMgPSBuICUgdGhpcy5EQjtcbiAgdmFyIGNicyA9IHRoaXMuREIgLSBicztcbiAgdmFyIGJtID0gKDEgPDwgYnMpIC0gMTtcbiAgclswXSA9IHRoaXNbZHNdID4+IGJzO1xuICBmb3IgKHZhciBpID0gZHMgKyAxOyBpIDwgdGhpcy50OyArK2kpIHtcbiAgICByW2kgLSBkcyAtIDFdIHw9ICh0aGlzW2ldICYgYm0pIDw8IGNicztcbiAgICByW2kgLSBkc10gPSB0aGlzW2ldID4+IGJzO1xuICB9XG4gIGlmIChicyA+IDApIHJbdGhpcy50IC0gZHMgLSAxXSB8PSAodGhpcy5zICYgYm0pIDw8IGNicztcbiAgci50ID0gdGhpcy50IC0gZHM7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgLSBhXG5mdW5jdGlvbiBibnBTdWJUbyhhLCByKSB7XG4gIHZhciBpID0gMCwgYyA9IDAsIG0gPSBNYXRoLm1pbihhLnQsIHRoaXMudCk7XG4gIHdoaWxlIChpIDwgbSkge1xuICAgIGMgKz0gdGhpc1tpXSAtIGFbaV07XG4gICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgYyA+Pj0gdGhpcy5EQjtcbiAgfVxuICBpZiAoYS50IDwgdGhpcy50KSB7XG4gICAgYyAtPSBhLnM7XG4gICAgd2hpbGUgKGkgPCB0aGlzLnQpIHtcbiAgICAgIGMgKz0gdGhpc1tpXTtcbiAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyArPSB0aGlzLnM7XG4gIH0gZWxzZSB7XG4gICAgYyArPSB0aGlzLnM7XG4gICAgd2hpbGUgKGkgPCBhLnQpIHtcbiAgICAgIGMgLT0gYVtpXTtcbiAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyAtPSBhLnM7XG4gIH1cbiAgci5zID0gKGMgPCAwKSA/IC0xIDogMDtcbiAgaWYgKGMgPCAtMSlcbiAgICByW2krK10gPSB0aGlzLkRWICsgYztcbiAgZWxzZSBpZiAoYyA+IDApXG4gICAgcltpKytdID0gYztcbiAgci50ID0gaTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyAqIGEsIHIgIT0gdGhpcyxhIChIQUMgMTQuMTIpXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseVRvKGEsIHIpIHtcbiAgdmFyIHggPSB0aGlzLmFicygpLCB5ID0gYS5hYnMoKTtcbiAgdmFyIGkgPSB4LnQ7XG4gIHIudCA9IGkgKyB5LnQ7XG4gIHdoaWxlICgtLWkgPj0gMCkgcltpXSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCB5LnQ7ICsraSkgcltpICsgeC50XSA9IHguYW0oMCwgeVtpXSwgciwgaSwgMCwgeC50KTtcbiAgci5zID0gMDtcbiAgci5jbGFtcCgpO1xuICBpZiAodGhpcy5zICE9IGEucykgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIsIHIpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpc14yLCByICE9IHRoaXMgKEhBQyAxNC4xNilcbmZ1bmN0aW9uIGJucFNxdWFyZVRvKHIpIHtcbiAgdmFyIHggPSB0aGlzLmFicygpO1xuICB2YXIgaSA9IHIudCA9IDIgKiB4LnQ7XG4gIHdoaWxlICgtLWkgPj0gMCkgcltpXSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCB4LnQgLSAxOyArK2kpIHtcbiAgICB2YXIgYyA9IHguYW0oaSwgeFtpXSwgciwgMiAqIGksIDAsIDEpO1xuICAgIGlmICgocltpICsgeC50XSArPSB4LmFtKGkgKyAxLCAyICogeFtpXSwgciwgMiAqIGkgKyAxLCBjLCB4LnQgLSBpIC0gMSkpID49XG4gICAgICAgIHguRFYpIHtcbiAgICAgIHJbaSArIHgudF0gLT0geC5EVjtcbiAgICAgIHJbaSArIHgudCArIDFdID0gMTtcbiAgICB9XG4gIH1cbiAgaWYgKHIudCA+IDApIHJbci50IC0gMV0gKz0geC5hbShpLCB4W2ldLCByLCAyICogaSwgMCwgMSk7XG4gIHIucyA9IDA7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgZGl2aWRlIHRoaXMgYnkgbSwgcXVvdGllbnQgYW5kIHJlbWFpbmRlciB0byBxLCByIChIQUMgMTQuMjApXG4vLyByICE9IHEsIHRoaXMgIT0gbS4gIHEgb3IgciBtYXkgYmUgbnVsbC5cbmZ1bmN0aW9uIGJucERpdlJlbVRvKG0sIHEsIHIpIHtcbiAgdmFyIHBtID0gbS5hYnMoKTtcbiAgaWYgKHBtLnQgPD0gMCkgcmV0dXJuO1xuICB2YXIgcHQgPSB0aGlzLmFicygpO1xuICBpZiAocHQudCA8IHBtLnQpIHtcbiAgICBpZiAocSAhPSBudWxsKSBxLmZyb21JbnQoMCk7XG4gICAgaWYgKHIgIT0gbnVsbCkgdGhpcy5jb3B5VG8ocik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChyID09IG51bGwpIHIgPSBuYmkoKTtcbiAgdmFyIHkgPSBuYmkoKSwgdHMgPSB0aGlzLnMsIG1zID0gbS5zO1xuICB2YXIgbnNoID0gdGhpcy5EQiAtIG5iaXRzKHBtW3BtLnQgLSAxXSk7ICAvLyBub3JtYWxpemUgbW9kdWx1c1xuICBpZiAobnNoID4gMCkge1xuICAgIHBtLmxTaGlmdFRvKG5zaCwgeSk7XG4gICAgcHQubFNoaWZ0VG8obnNoLCByKTtcbiAgfSBlbHNlIHtcbiAgICBwbS5jb3B5VG8oeSk7XG4gICAgcHQuY29weVRvKHIpO1xuICB9XG4gIHZhciB5cyA9IHkudDtcbiAgdmFyIHkwID0geVt5cyAtIDFdO1xuICBpZiAoeTAgPT0gMCkgcmV0dXJuO1xuICB2YXIgeXQgPSB5MCAqICgxIDw8IHRoaXMuRjEpICsgKCh5cyA+IDEpID8geVt5cyAtIDJdID4+IHRoaXMuRjIgOiAwKTtcbiAgdmFyIGQxID0gdGhpcy5GViAvIHl0LCBkMiA9ICgxIDw8IHRoaXMuRjEpIC8geXQsIGUgPSAxIDw8IHRoaXMuRjI7XG4gIHZhciBpID0gci50LCBqID0gaSAtIHlzLCB0ID0gKHEgPT0gbnVsbCkgPyBuYmkoKSA6IHE7XG4gIHkuZGxTaGlmdFRvKGosIHQpO1xuICBpZiAoci5jb21wYXJlVG8odCkgPj0gMCkge1xuICAgIHJbci50KytdID0gMTtcbiAgICByLnN1YlRvKHQsIHIpO1xuICB9XG4gIEJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbyh5cywgdCk7XG4gIHQuc3ViVG8oeSwgeSk7ICAvLyBcIm5lZ2F0aXZlXCIgeSBzbyB3ZSBjYW4gcmVwbGFjZSBzdWIgd2l0aCBhbSBsYXRlclxuICB3aGlsZSAoeS50IDwgeXMpIHlbeS50KytdID0gMDtcbiAgd2hpbGUgKC0taiA+PSAwKSB7XG4gICAgLy8gRXN0aW1hdGUgcXVvdGllbnQgZGlnaXRcbiAgICB2YXIgcWQgPVxuICAgICAgICAoclstLWldID09IHkwKSA/IHRoaXMuRE0gOiBNYXRoLmZsb29yKHJbaV0gKiBkMSArIChyW2kgLSAxXSArIGUpICogZDIpO1xuICAgIGlmICgocltpXSArPSB5LmFtKDAsIHFkLCByLCBqLCAwLCB5cykpIDwgcWQpIHsgIC8vIFRyeSBpdCBvdXRcbiAgICAgIHkuZGxTaGlmdFRvKGosIHQpO1xuICAgICAgci5zdWJUbyh0LCByKTtcbiAgICAgIHdoaWxlIChyW2ldIDwgLS1xZCkgci5zdWJUbyh0LCByKTtcbiAgICB9XG4gIH1cbiAgaWYgKHEgIT0gbnVsbCkge1xuICAgIHIuZHJTaGlmdFRvKHlzLCBxKTtcbiAgICBpZiAodHMgIT0gbXMpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhxLCBxKTtcbiAgfVxuICByLnQgPSB5cztcbiAgci5jbGFtcCgpO1xuICBpZiAobnNoID4gMCkgci5yU2hpZnRUbyhuc2gsIHIpOyAgLy8gRGVub3JtYWxpemUgcmVtYWluZGVyXG4gIGlmICh0cyA8IDApIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhyLCByKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyBtb2QgYVxuZnVuY3Rpb24gYm5Nb2QoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmFicygpLmRpdlJlbVRvKGEsIG51bGwsIHIpO1xuICBpZiAodGhpcy5zIDwgMCAmJiByLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLlpFUk8pID4gMCkgYS5zdWJUbyhyLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIE1vZHVsYXIgcmVkdWN0aW9uIHVzaW5nIFwiY2xhc3NpY1wiIGFsZ29yaXRobVxuZnVuY3Rpb24gQ2xhc3NpYyhtKSB7XG4gIHRoaXMubSA9IG07XG59XG5mdW5jdGlvbiBjQ29udmVydCh4KSB7XG4gIGlmICh4LnMgPCAwIHx8IHguY29tcGFyZVRvKHRoaXMubSkgPj0gMClcbiAgICByZXR1cm4geC5tb2QodGhpcy5tKTtcbiAgZWxzZVxuICAgIHJldHVybiB4O1xufVxuZnVuY3Rpb24gY1JldmVydCh4KSB7XG4gIHJldHVybiB4O1xufVxuZnVuY3Rpb24gY1JlZHVjZSh4KSB7XG4gIHguZGl2UmVtVG8odGhpcy5tLCBudWxsLCB4KTtcbn1cbmZ1bmN0aW9uIGNNdWxUbyh4LCB5LCByKSB7XG4gIHgubXVsdGlwbHlUbyh5LCByKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5mdW5jdGlvbiBjU3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuQ2xhc3NpYy5wcm90b3R5cGUuY29udmVydCA9IGNDb252ZXJ0O1xuQ2xhc3NpYy5wcm90b3R5cGUucmV2ZXJ0ID0gY1JldmVydDtcbkNsYXNzaWMucHJvdG90eXBlLnJlZHVjZSA9IGNSZWR1Y2U7XG5DbGFzc2ljLnByb3RvdHlwZS5tdWxUbyA9IGNNdWxUbztcbkNsYXNzaWMucHJvdG90eXBlLnNxclRvID0gY1NxclRvO1xuXG4vLyAocHJvdGVjdGVkKSByZXR1cm4gXCItMS90aGlzICUgMl5EQlwiOyB1c2VmdWwgZm9yIE1vbnQuIHJlZHVjdGlvblxuLy8ganVzdGlmaWNhdGlvbjpcbi8vICAgICAgICAgeHkgPT0gMSAobW9kIG0pXG4vLyAgICAgICAgIHh5ID0gIDEra21cbi8vICAgeHkoMi14eSkgPSAoMStrbSkoMS1rbSlcbi8vIHhbeSgyLXh5KV0gPSAxLWteMm1eMlxuLy8geFt5KDIteHkpXSA9PSAxIChtb2QgbV4yKVxuLy8gaWYgeSBpcyAxL3ggbW9kIG0sIHRoZW4geSgyLXh5KSBpcyAxL3ggbW9kIG1eMlxuLy8gc2hvdWxkIHJlZHVjZSB4IGFuZCB5KDIteHkpIGJ5IG1eMiBhdCBlYWNoIHN0ZXAgdG8ga2VlcCBzaXplIGJvdW5kZWQuXG4vLyBKUyBtdWx0aXBseSBcIm92ZXJmbG93c1wiIGRpZmZlcmVudGx5IGZyb20gQy9DKyssIHNvIGNhcmUgaXMgbmVlZGVkIGhlcmUuXG5mdW5jdGlvbiBibnBJbnZEaWdpdCgpIHtcbiAgaWYgKHRoaXMudCA8IDEpIHJldHVybiAwO1xuICB2YXIgeCA9IHRoaXNbMF07XG4gIGlmICgoeCAmIDEpID09IDApIHJldHVybiAwO1xuICB2YXIgeSA9IHggJiAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB5ID09IDEveCBtb2QgMl4yXG4gIHkgPSAoeSAqICgyIC0gKHggJiAweGYpICogeSkpICYgMHhmOyAgICAgICAgICAgICAgICAgICAgIC8vIHkgPT0gMS94IG1vZCAyXjRcbiAgeSA9ICh5ICogKDIgLSAoeCAmIDB4ZmYpICogeSkpICYgMHhmZjsgICAgICAgICAgICAgICAgICAgLy8geSA9PSAxL3ggbW9kIDJeOFxuICB5ID0gKHkgKiAoMiAtICgoKHggJiAweGZmZmYpICogeSkgJiAweGZmZmYpKSkgJiAweGZmZmY7ICAvLyB5ID09IDEveCBtb2QgMl4xNlxuICAvLyBsYXN0IHN0ZXAgLSBjYWxjdWxhdGUgaW52ZXJzZSBtb2QgRFYgZGlyZWN0bHk7XG4gIC8vIGFzc3VtZXMgMTYgPCBEQiA8PSAzMiBhbmQgYXNzdW1lcyBhYmlsaXR5IHRvIGhhbmRsZSA0OC1iaXQgaW50c1xuICB5ID0gKHkgKiAoMiAtIHggKiB5ICUgdGhpcy5EVikpICUgdGhpcy5EVjsgIC8vIHkgPT0gMS94IG1vZCAyXmRiaXRzXG4gIC8vIHdlIHJlYWxseSB3YW50IHRoZSBuZWdhdGl2ZSBpbnZlcnNlLCBhbmQgLURWIDwgeSA8IERWXG4gIHJldHVybiAoeSA+IDApID8gdGhpcy5EViAtIHkgOiAteTtcbn1cblxuLy8gTW9udGdvbWVyeSByZWR1Y3Rpb25cbmZ1bmN0aW9uIE1vbnRnb21lcnkobSkge1xuICB0aGlzLm0gPSBtO1xuICB0aGlzLm1wID0gbS5pbnZEaWdpdCgpO1xuICB0aGlzLm1wbCA9IHRoaXMubXAgJiAweDdmZmY7XG4gIHRoaXMubXBoID0gdGhpcy5tcCA+PiAxNTtcbiAgdGhpcy51bSA9ICgxIDw8IChtLkRCIC0gMTUpKSAtIDE7XG4gIHRoaXMubXQyID0gMiAqIG0udDtcbn1cblxuLy8geFIgbW9kIG1cbmZ1bmN0aW9uIG1vbnRDb252ZXJ0KHgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgeC5hYnMoKS5kbFNoaWZ0VG8odGhpcy5tLnQsIHIpO1xuICByLmRpdlJlbVRvKHRoaXMubSwgbnVsbCwgcik7XG4gIGlmICh4LnMgPCAwICYmIHIuY29tcGFyZVRvKEJpZ0ludGVnZXIuWkVSTykgPiAwKSB0aGlzLm0uc3ViVG8ociwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyB4L1IgbW9kIG1cbmZ1bmN0aW9uIG1vbnRSZXZlcnQoeCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB4LmNvcHlUbyhyKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG4gIHJldHVybiByO1xufVxuXG4vLyB4ID0geC9SIG1vZCBtIChIQUMgMTQuMzIpXG5mdW5jdGlvbiBtb250UmVkdWNlKHgpIHtcbiAgd2hpbGUgKHgudCA8PSB0aGlzLm10MikgIC8vIHBhZCB4IHNvIGFtIGhhcyBlbm91Z2ggcm9vbSBsYXRlclxuICAgIHhbeC50KytdID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm0udDsgKytpKSB7XG4gICAgLy8gZmFzdGVyIHdheSBvZiBjYWxjdWxhdGluZyB1MCA9IHhbaV0qbXAgbW9kIERWXG4gICAgdmFyIGogPSB4W2ldICYgMHg3ZmZmO1xuICAgIHZhciB1MCA9IChqICogdGhpcy5tcGwgK1xuICAgICAgICAgICAgICAoKChqICogdGhpcy5tcGggKyAoeFtpXSA+PiAxNSkgKiB0aGlzLm1wbCkgJiB0aGlzLnVtKSA8PCAxNSkpICZcbiAgICAgICAgeC5ETTtcbiAgICAvLyB1c2UgYW0gdG8gY29tYmluZSB0aGUgbXVsdGlwbHktc2hpZnQtYWRkIGludG8gb25lIGNhbGxcbiAgICBqID0gaSArIHRoaXMubS50O1xuICAgIHhbal0gKz0gdGhpcy5tLmFtKDAsIHUwLCB4LCBpLCAwLCB0aGlzLm0udCk7XG4gICAgLy8gcHJvcGFnYXRlIGNhcnJ5XG4gICAgd2hpbGUgKHhbal0gPj0geC5EVikge1xuICAgICAgeFtqXSAtPSB4LkRWO1xuICAgICAgeFsrK2pdKys7XG4gICAgfVxuICB9XG4gIHguY2xhbXAoKTtcbiAgeC5kclNoaWZ0VG8odGhpcy5tLnQsIHgpO1xuICBpZiAoeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB4LnN1YlRvKHRoaXMubSwgeCk7XG59XG5cbi8vIHIgPSBcInheMi9SIG1vZCBtXCI7IHggIT0gclxuZnVuY3Rpb24gbW9udFNxclRvKHgsIHIpIHtcbiAgeC5zcXVhcmVUbyhyKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5cbi8vIHIgPSBcInh5L1IgbW9kIG1cIjsgeCx5ICE9IHJcbmZ1bmN0aW9uIG1vbnRNdWxUbyh4LCB5LCByKSB7XG4gIHgubXVsdGlwbHlUbyh5LCByKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5cbk1vbnRnb21lcnkucHJvdG90eXBlLmNvbnZlcnQgPSBtb250Q29udmVydDtcbk1vbnRnb21lcnkucHJvdG90eXBlLnJldmVydCA9IG1vbnRSZXZlcnQ7XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5yZWR1Y2UgPSBtb250UmVkdWNlO1xuTW9udGdvbWVyeS5wcm90b3R5cGUubXVsVG8gPSBtb250TXVsVG87XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5zcXJUbyA9IG1vbnRTcXJUbztcblxuLy8gKHByb3RlY3RlZCkgdHJ1ZSBpZmYgdGhpcyBpcyBldmVuXG5mdW5jdGlvbiBibnBJc0V2ZW4oKSB7XG4gIHJldHVybiAoKHRoaXMudCA+IDApID8gKHRoaXNbMF0gJiAxKSA6IHRoaXMucykgPT0gMDtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpc15lLCBlIDwgMl4zMiwgZG9pbmcgc3FyIGFuZCBtdWwgd2l0aCBcInJcIiAoSEFDIDE0Ljc5KVxuZnVuY3Rpb24gYm5wRXhwKGUsIHopIHtcbiAgaWYgKGUgPiAweGZmZmZmZmZmIHx8IGUgPCAxKSByZXR1cm4gQmlnSW50ZWdlci5PTkU7XG4gIHZhciByID0gbmJpKCksIHIyID0gbmJpKCksIGcgPSB6LmNvbnZlcnQodGhpcyksIGkgPSBuYml0cyhlKSAtIDE7XG4gIGcuY29weVRvKHIpO1xuICB3aGlsZSAoLS1pID49IDApIHtcbiAgICB6LnNxclRvKHIsIHIyKTtcbiAgICBpZiAoKGUgJiAoMSA8PCBpKSkgPiAwKVxuICAgICAgei5tdWxUbyhyMiwgZywgcik7XG4gICAgZWxzZSB7XG4gICAgICB2YXIgdCA9IHI7XG4gICAgICByID0gcjI7XG4gICAgICByMiA9IHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiB6LnJldmVydChyKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpc15lICUgbSwgMCA8PSBlIDwgMl4zMlxuZnVuY3Rpb24gYm5Nb2RQb3dJbnQoZSwgbSkge1xuICB2YXIgejtcbiAgaWYgKGUgPCAyNTYgfHwgbS5pc0V2ZW4oKSlcbiAgICB6ID0gbmV3IENsYXNzaWMobSk7XG4gIGVsc2VcbiAgICB6ID0gbmV3IE1vbnRnb21lcnkobSk7XG4gIHJldHVybiB0aGlzLmV4cChlLCB6KTtcbn1cblxuLy8gcHJvdGVjdGVkXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb3B5VG8gPSBibnBDb3B5VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tSW50ID0gYm5wRnJvbUludDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21TdHJpbmcgPSBibnBGcm9tU3RyaW5nO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xhbXAgPSBibnBDbGFtcDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRsU2hpZnRUbyA9IGJucERMU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRyU2hpZnRUbyA9IGJucERSU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmxTaGlmdFRvID0gYm5wTFNoaWZ0VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5yU2hpZnRUbyA9IGJucFJTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3ViVG8gPSBibnBTdWJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5VG8gPSBibnBNdWx0aXBseVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlVG8gPSBibnBTcXVhcmVUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRpdlJlbVRvID0gYm5wRGl2UmVtVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnZEaWdpdCA9IGJucEludkRpZ2l0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaXNFdmVuID0gYm5wSXNFdmVuO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZXhwID0gYm5wRXhwO1xuXG4vLyBwdWJsaWNcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRvU3RyaW5nID0gYm5Ub1N0cmluZztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm5lZ2F0ZSA9IGJuTmVnYXRlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYWJzID0gYm5BYnM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb21wYXJlVG8gPSBibkNvbXBhcmVUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJpdExlbmd0aCA9IGJuQml0TGVuZ3RoO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kID0gYm5Nb2Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3dJbnQgPSBibk1vZFBvd0ludDtcblxuLy8gXCJjb25zdGFudHNcIlxuQmlnSW50ZWdlci5aRVJPID0gbmJ2KDApO1xuQmlnSW50ZWdlci5PTkUgPSBuYnYoMSk7XG5cbi8vIFBvb2wgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCBhbmQgZ3JlYXRlciB0aGFuIDMyLlxuLy8gQW4gYXJyYXkgb2YgYnl0ZXMgdGhlIHNpemUgb2YgdGhlIHBvb2wgd2lsbCBiZSBwYXNzZWQgdG8gaW5pdCgpXG52YXIgcm5nX3BzaXplID0gMjU2O1xuXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkZWZhdWx0OiBCaWdJbnRlZ2VyLFxuICAgIEJpZ0ludGVnZXI6IEJpZ0ludGVnZXIsXG4gIH07XG59IGVsc2Uge1xuICB0aGlzLmpzYm4gPSB7XG4gICAgQmlnSW50ZWdlcjogQmlnSW50ZWdlcixcbiAgfTtcbn1cblxuLy8gQ29weXJpZ2h0IChjKSAyMDA1LTIwMDkgIFRvbSBXdVxuLy8gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIFNlZSBcIkxJQ0VOU0VcIiBmb3IgZGV0YWlscy5cblxuLy8gRXh0ZW5kZWQgSmF2YVNjcmlwdCBCTiBmdW5jdGlvbnMsIHJlcXVpcmVkIGZvciBSU0EgcHJpdmF0ZSBvcHMuXG5cbi8vIFZlcnNpb24gMS4xOiBuZXcgQmlnSW50ZWdlcihcIjBcIiwgMTApIHJldHVybnMgXCJwcm9wZXJcIiB6ZXJvXG4vLyBWZXJzaW9uIDEuMjogc3F1YXJlKCkgQVBJLCBpc1Byb2JhYmxlUHJpbWUgZml4XG5cbi8vIChwdWJsaWMpXG5mdW5jdGlvbiBibkNsb25lKCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmNvcHlUbyhyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiB2YWx1ZSBhcyBpbnRlZ2VyXG5mdW5jdGlvbiBibkludFZhbHVlKCkge1xuICBpZiAodGhpcy5zIDwgMCkge1xuICAgIGlmICh0aGlzLnQgPT0gMSlcbiAgICAgIHJldHVybiB0aGlzWzBdIC0gdGhpcy5EVjtcbiAgICBlbHNlIGlmICh0aGlzLnQgPT0gMClcbiAgICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmICh0aGlzLnQgPT0gMSlcbiAgICByZXR1cm4gdGhpc1swXTtcbiAgZWxzZSBpZiAodGhpcy50ID09IDApXG4gICAgcmV0dXJuIDA7XG4gIC8vIGFzc3VtZXMgMTYgPCBEQiA8IDMyXG4gIHJldHVybiAoKHRoaXNbMV0gJiAoKDEgPDwgKDMyIC0gdGhpcy5EQikpIC0gMSkpIDw8IHRoaXMuREIpIHwgdGhpc1swXTtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGJ5dGVcbmZ1bmN0aW9uIGJuQnl0ZVZhbHVlKCkge1xuICByZXR1cm4gKHRoaXMudCA9PSAwKSA/IHRoaXMucyA6ICh0aGlzWzBdIDw8IDI0KSA+PiAyNDtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIHNob3J0IChhc3N1bWVzIERCPj0xNilcbmZ1bmN0aW9uIGJuU2hvcnRWYWx1ZSgpIHtcbiAgcmV0dXJuICh0aGlzLnQgPT0gMCkgPyB0aGlzLnMgOiAodGhpc1swXSA8PCAxNikgPj4gMTY7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHJldHVybiB4IHMudC4gcl54IDwgRFZcbmZ1bmN0aW9uIGJucENodW5rU2l6ZShyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGguTE4yICogdGhpcy5EQiAvIE1hdGgubG9nKHIpKTtcbn1cblxuLy8gKHB1YmxpYykgMCBpZiB0aGlzID09IDAsIDEgaWYgdGhpcyA+IDBcbmZ1bmN0aW9uIGJuU2lnTnVtKCkge1xuICBpZiAodGhpcy5zIDwgMClcbiAgICByZXR1cm4gLTE7XG4gIGVsc2UgaWYgKHRoaXMudCA8PSAwIHx8ICh0aGlzLnQgPT0gMSAmJiB0aGlzWzBdIDw9IDApKVxuICAgIHJldHVybiAwO1xuICBlbHNlXG4gICAgcmV0dXJuIDE7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvbnZlcnQgdG8gcmFkaXggc3RyaW5nXG5mdW5jdGlvbiBibnBUb1JhZGl4KGIpIHtcbiAgaWYgKGIgPT0gbnVsbCkgYiA9IDEwO1xuICBpZiAodGhpcy5zaWdudW0oKSA9PSAwIHx8IGIgPCAyIHx8IGIgPiAzNikgcmV0dXJuICcwJztcbiAgdmFyIGNzID0gdGhpcy5jaHVua1NpemUoYik7XG4gIHZhciBhID0gTWF0aC5wb3coYiwgY3MpO1xuICB2YXIgZCA9IG5idihhKSwgeSA9IG5iaSgpLCB6ID0gbmJpKCksIHIgPSAnJztcbiAgdGhpcy5kaXZSZW1UbyhkLCB5LCB6KTtcbiAgd2hpbGUgKHkuc2lnbnVtKCkgPiAwKSB7XG4gICAgciA9IChhICsgei5pbnRWYWx1ZSgpKS50b1N0cmluZyhiKS5zdWJzdHIoMSkgKyByO1xuICAgIHkuZGl2UmVtVG8oZCwgeSwgeik7XG4gIH1cbiAgcmV0dXJuIHouaW50VmFsdWUoKS50b1N0cmluZyhiKSArIHI7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvbnZlcnQgZnJvbSByYWRpeCBzdHJpbmdcbmZ1bmN0aW9uIGJucEZyb21SYWRpeChzLCBiKSB7XG4gIHRoaXMuZnJvbUludCgwKTtcbiAgaWYgKGIgPT0gbnVsbCkgYiA9IDEwO1xuICB2YXIgY3MgPSB0aGlzLmNodW5rU2l6ZShiKTtcbiAgdmFyIGQgPSBNYXRoLnBvdyhiLCBjcyksIG1pID0gZmFsc2UsIGogPSAwLCB3ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHggPSBpbnRBdChzLCBpKTtcbiAgICBpZiAoeCA8IDApIHtcbiAgICAgIGlmIChzLmNoYXJBdChpKSA9PSAnLScgJiYgdGhpcy5zaWdudW0oKSA9PSAwKSBtaSA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdyA9IGIgKiB3ICsgeDtcbiAgICBpZiAoKytqID49IGNzKSB7XG4gICAgICB0aGlzLmRNdWx0aXBseShkKTtcbiAgICAgIHRoaXMuZEFkZE9mZnNldCh3LCAwKTtcbiAgICAgIGogPSAwO1xuICAgICAgdyA9IDA7XG4gICAgfVxuICB9XG4gIGlmIChqID4gMCkge1xuICAgIHRoaXMuZE11bHRpcGx5KE1hdGgucG93KGIsIGopKTtcbiAgICB0aGlzLmRBZGRPZmZzZXQodywgMCk7XG4gIH1cbiAgaWYgKG1pKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcywgdGhpcyk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGFsdGVybmF0ZSBjb25zdHJ1Y3RvclxuZnVuY3Rpb24gYm5wRnJvbU51bWJlcihhLCBiLCBjKSB7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgYikge1xuICAgIC8vIG5ldyBCaWdJbnRlZ2VyKGludCxpbnQsUk5HKVxuICAgIGlmIChhIDwgMilcbiAgICAgIHRoaXMuZnJvbUludCgxKTtcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZnJvbU51bWJlcihhLCBjKTtcbiAgICAgIGlmICghdGhpcy50ZXN0Qml0KGEgLSAxKSkgIC8vIGZvcmNlIE1TQiBzZXRcbiAgICAgICAgdGhpcy5iaXR3aXNlVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEgLSAxKSwgb3Bfb3IsIHRoaXMpO1xuICAgICAgaWYgKHRoaXMuaXNFdmVuKCkpIHRoaXMuZEFkZE9mZnNldCgxLCAwKTsgIC8vIGZvcmNlIG9kZFxuICAgICAgd2hpbGUgKCF0aGlzLmlzUHJvYmFibGVQcmltZShiKSkge1xuICAgICAgICB0aGlzLmRBZGRPZmZzZXQoMiwgMCk7XG4gICAgICAgIGlmICh0aGlzLmJpdExlbmd0aCgpID4gYSlcbiAgICAgICAgICB0aGlzLnN1YlRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhIC0gMSksIHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBuZXcgQmlnSW50ZWdlcihpbnQsUk5HKVxuICAgIHZhciB4ID0gbmV3IEFycmF5KCksIHQgPSBhICYgNztcbiAgICB4Lmxlbmd0aCA9IChhID4+IDMpICsgMTtcbiAgICBiLm5leHRCeXRlcyh4KTtcbiAgICBpZiAodCA+IDApXG4gICAgICB4WzBdICY9ICgoMSA8PCB0KSAtIDEpO1xuICAgIGVsc2VcbiAgICAgIHhbMF0gPSAwO1xuICAgIHRoaXMuZnJvbVN0cmluZyh4LCAyNTYpO1xuICB9XG59XG5cbi8vIChwdWJsaWMpIGNvbnZlcnQgdG8gYmlnZW5kaWFuIGJ5dGUgYXJyYXlcbmZ1bmN0aW9uIGJuVG9CeXRlQXJyYXkoKSB7XG4gIHZhciBpID0gdGhpcy50LCByID0gbmV3IEFycmF5KCk7XG4gIHJbMF0gPSB0aGlzLnM7XG4gIHZhciBwID0gdGhpcy5EQiAtIChpICogdGhpcy5EQikgJSA4LCBkLCBrID0gMDtcbiAgaWYgKGktLSA+IDApIHtcbiAgICBpZiAocCA8IHRoaXMuREIgJiYgKGQgPSB0aGlzW2ldID4+IHApICE9ICh0aGlzLnMgJiB0aGlzLkRNKSA+PiBwKVxuICAgICAgcltrKytdID0gZCB8ICh0aGlzLnMgPDwgKHRoaXMuREIgLSBwKSk7XG4gICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgaWYgKHAgPCA4KSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSAmICgoMSA8PCBwKSAtIDEpKSA8PCAoOCAtIHApO1xuICAgICAgICBkIHw9IHRoaXNbLS1pXSA+PiAocCArPSB0aGlzLkRCIC0gOCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkID0gKHRoaXNbaV0gPj4gKHAgLT0gOCkpICYgMHhmZjtcbiAgICAgICAgaWYgKHAgPD0gMCkge1xuICAgICAgICAgIHAgKz0gdGhpcy5EQjtcbiAgICAgICAgICAtLWk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgoZCAmIDB4ODApICE9IDApIGQgfD0gLTI1NjtcbiAgICAgIGlmIChrID09IDAgJiYgKHRoaXMucyAmIDB4ODApICE9IChkICYgMHg4MCkpICsraztcbiAgICAgIGlmIChrID4gMCB8fCBkICE9IHRoaXMucykgcltrKytdID0gZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbmZ1bmN0aW9uIGJuRXF1YWxzKGEpIHtcbiAgcmV0dXJuICh0aGlzLmNvbXBhcmVUbyhhKSA9PSAwKTtcbn1cbmZ1bmN0aW9uIGJuTWluKGEpIHtcbiAgcmV0dXJuICh0aGlzLmNvbXBhcmVUbyhhKSA8IDApID8gdGhpcyA6IGE7XG59XG5mdW5jdGlvbiBibk1heChhKSB7XG4gIHJldHVybiAodGhpcy5jb21wYXJlVG8oYSkgPiAwKSA/IHRoaXMgOiBhO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyBvcCBhIChiaXR3aXNlKVxuZnVuY3Rpb24gYm5wQml0d2lzZVRvKGEsIG9wLCByKSB7XG4gIHZhciBpLCBmLCBtID0gTWF0aC5taW4oYS50LCB0aGlzLnQpO1xuICBmb3IgKGkgPSAwOyBpIDwgbTsgKytpKSByW2ldID0gb3AodGhpc1tpXSwgYVtpXSk7XG4gIGlmIChhLnQgPCB0aGlzLnQpIHtcbiAgICBmID0gYS5zICYgdGhpcy5ETTtcbiAgICBmb3IgKGkgPSBtOyBpIDwgdGhpcy50OyArK2kpIHJbaV0gPSBvcCh0aGlzW2ldLCBmKTtcbiAgICByLnQgPSB0aGlzLnQ7XG4gIH0gZWxzZSB7XG4gICAgZiA9IHRoaXMucyAmIHRoaXMuRE07XG4gICAgZm9yIChpID0gbTsgaSA8IGEudDsgKytpKSByW2ldID0gb3AoZiwgYVtpXSk7XG4gICAgci50ID0gYS50O1xuICB9XG4gIHIucyA9IG9wKHRoaXMucywgYS5zKTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHVibGljKSB0aGlzICYgYVxuZnVuY3Rpb24gb3BfYW5kKHgsIHkpIHtcbiAgcmV0dXJuIHggJiB5O1xufVxuZnVuY3Rpb24gYm5BbmQoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmJpdHdpc2VUbyhhLCBvcF9hbmQsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyB8IGFcbmZ1bmN0aW9uIG9wX29yKHgsIHkpIHtcbiAgcmV0dXJuIHggfCB5O1xufVxuZnVuY3Rpb24gYm5PcihhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX29yLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgXiBhXG5mdW5jdGlvbiBvcF94b3IoeCwgeSkge1xuICByZXR1cm4geCBeIHk7XG59XG5mdW5jdGlvbiBiblhvcihhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX3hvciwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzICYgfmFcbmZ1bmN0aW9uIG9wX2FuZG5vdCh4LCB5KSB7XG4gIHJldHVybiB4ICYgfnk7XG59XG5mdW5jdGlvbiBibkFuZE5vdChhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX2FuZG5vdCwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB+dGhpc1xuZnVuY3Rpb24gYm5Ob3QoKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHJbaV0gPSB0aGlzLkRNICYgfnRoaXNbaV07XG4gIHIudCA9IHRoaXMudDtcbiAgci5zID0gfnRoaXMucztcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgPDwgblxuZnVuY3Rpb24gYm5TaGlmdExlZnQobikge1xuICB2YXIgciA9IG5iaSgpO1xuICBpZiAobiA8IDApXG4gICAgdGhpcy5yU2hpZnRUbygtbiwgcik7XG4gIGVsc2VcbiAgICB0aGlzLmxTaGlmdFRvKG4sIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyA+PiBuXG5mdW5jdGlvbiBiblNoaWZ0UmlnaHQobikge1xuICB2YXIgciA9IG5iaSgpO1xuICBpZiAobiA8IDApXG4gICAgdGhpcy5sU2hpZnRUbygtbiwgcik7XG4gIGVsc2VcbiAgICB0aGlzLnJTaGlmdFRvKG4sIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gcmV0dXJuIGluZGV4IG9mIGxvd2VzdCAxLWJpdCBpbiB4LCB4IDwgMl4zMVxuZnVuY3Rpb24gbGJpdCh4KSB7XG4gIGlmICh4ID09IDApIHJldHVybiAtMTtcbiAgdmFyIHIgPSAwO1xuICBpZiAoKHggJiAweGZmZmYpID09IDApIHtcbiAgICB4ID4+PSAxNjtcbiAgICByICs9IDE2O1xuICB9XG4gIGlmICgoeCAmIDB4ZmYpID09IDApIHtcbiAgICB4ID4+PSA4O1xuICAgIHIgKz0gODtcbiAgfVxuICBpZiAoKHggJiAweGYpID09IDApIHtcbiAgICB4ID4+PSA0O1xuICAgIHIgKz0gNDtcbiAgfVxuICBpZiAoKHggJiAzKSA9PSAwKSB7XG4gICAgeCA+Pj0gMjtcbiAgICByICs9IDI7XG4gIH1cbiAgaWYgKCh4ICYgMSkgPT0gMCkgKytyO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJucyBpbmRleCBvZiBsb3dlc3QgMS1iaXQgKG9yIC0xIGlmIG5vbmUpXG5mdW5jdGlvbiBibkdldExvd2VzdFNldEJpdCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnQ7ICsraSlcbiAgICBpZiAodGhpc1tpXSAhPSAwKSByZXR1cm4gaSAqIHRoaXMuREIgKyBsYml0KHRoaXNbaV0pO1xuICBpZiAodGhpcy5zIDwgMCkgcmV0dXJuIHRoaXMudCAqIHRoaXMuREI7XG4gIHJldHVybiAtMTtcbn1cblxuLy8gcmV0dXJuIG51bWJlciBvZiAxIGJpdHMgaW4geFxuZnVuY3Rpb24gY2JpdCh4KSB7XG4gIHZhciByID0gMDtcbiAgd2hpbGUgKHggIT0gMCkge1xuICAgIHggJj0geCAtIDE7XG4gICAgKytyO1xuICB9XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gbnVtYmVyIG9mIHNldCBiaXRzXG5mdW5jdGlvbiBibkJpdENvdW50KCkge1xuICB2YXIgciA9IDAsIHggPSB0aGlzLnMgJiB0aGlzLkRNO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudDsgKytpKSByICs9IGNiaXQodGhpc1tpXSBeIHgpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdHJ1ZSBpZmYgbnRoIGJpdCBpcyBzZXRcbmZ1bmN0aW9uIGJuVGVzdEJpdChuKSB7XG4gIHZhciBqID0gTWF0aC5mbG9vcihuIC8gdGhpcy5EQik7XG4gIGlmIChqID49IHRoaXMudCkgcmV0dXJuICh0aGlzLnMgIT0gMCk7XG4gIHJldHVybiAoKHRoaXNbal0gJiAoMSA8PCAobiAlIHRoaXMuREIpKSkgIT0gMCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgb3AgKDE8PG4pXG5mdW5jdGlvbiBibnBDaGFuZ2VCaXQobiwgb3ApIHtcbiAgdmFyIHIgPSBCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQobik7XG4gIHRoaXMuYml0d2lzZVRvKHIsIG9wLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgfCAoMTw8bilcbmZ1bmN0aW9uIGJuU2V0Qml0KG4pIHtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sIG9wX29yKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAmIH4oMTw8bilcbmZ1bmN0aW9uIGJuQ2xlYXJCaXQobikge1xuICByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobiwgb3BfYW5kbm90KTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyBeICgxPDxuKVxuZnVuY3Rpb24gYm5GbGlwQml0KG4pIHtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sIG9wX3hvcik7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzICsgYVxuZnVuY3Rpb24gYm5wQWRkVG8oYSwgcikge1xuICB2YXIgaSA9IDAsIGMgPSAwLCBtID0gTWF0aC5taW4oYS50LCB0aGlzLnQpO1xuICB3aGlsZSAoaSA8IG0pIHtcbiAgICBjICs9IHRoaXNbaV0gKyBhW2ldO1xuICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgIGMgPj49IHRoaXMuREI7XG4gIH1cbiAgaWYgKGEudCA8IHRoaXMudCkge1xuICAgIGMgKz0gYS5zO1xuICAgIHdoaWxlIChpIDwgdGhpcy50KSB7XG4gICAgICBjICs9IHRoaXNbaV07XG4gICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgfVxuICAgIGMgKz0gdGhpcy5zO1xuICB9IGVsc2Uge1xuICAgIGMgKz0gdGhpcy5zO1xuICAgIHdoaWxlIChpIDwgYS50KSB7XG4gICAgICBjICs9IGFbaV07XG4gICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgfVxuICAgIGMgKz0gYS5zO1xuICB9XG4gIHIucyA9IChjIDwgMCkgPyAtMSA6IDA7XG4gIGlmIChjID4gMClcbiAgICByW2krK10gPSBjO1xuICBlbHNlIGlmIChjIDwgLTEpXG4gICAgcltpKytdID0gdGhpcy5EViArIGM7XG4gIHIudCA9IGk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyArIGFcbmZ1bmN0aW9uIGJuQWRkKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5hZGRUbyhhLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgLSBhXG5mdW5jdGlvbiBiblN1YnRyYWN0KGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5zdWJUbyhhLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgKiBhXG5mdW5jdGlvbiBibk11bHRpcGx5KGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5tdWx0aXBseVRvKGEsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpc14yXG5mdW5jdGlvbiBiblNxdWFyZSgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5zcXVhcmVUbyhyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgLyBhXG5mdW5jdGlvbiBibkRpdmlkZShhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuZGl2UmVtVG8oYSwgciwgbnVsbCk7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzICUgYVxuZnVuY3Rpb24gYm5SZW1haW5kZXIoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmRpdlJlbVRvKGEsIG51bGwsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgW3RoaXMvYSx0aGlzJWFdXG5mdW5jdGlvbiBibkRpdmlkZUFuZFJlbWFpbmRlcihhKSB7XG4gIHZhciBxID0gbmJpKCksIHIgPSBuYmkoKTtcbiAgdGhpcy5kaXZSZW1UbyhhLCBxLCByKTtcbiAgcmV0dXJuIG5ldyBBcnJheShxLCByKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyAqPSBuLCB0aGlzID49IDAsIDEgPCBuIDwgRFZcbmZ1bmN0aW9uIGJucERNdWx0aXBseShuKSB7XG4gIHRoaXNbdGhpcy50XSA9IHRoaXMuYW0oMCwgbiAtIDEsIHRoaXMsIDAsIDAsIHRoaXMudCk7XG4gICsrdGhpcy50O1xuICB0aGlzLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgKz0gbiA8PCB3IHdvcmRzLCB0aGlzID49IDBcbmZ1bmN0aW9uIGJucERBZGRPZmZzZXQobiwgdykge1xuICBpZiAobiA9PSAwKSByZXR1cm47XG4gIHdoaWxlICh0aGlzLnQgPD0gdykgdGhpc1t0aGlzLnQrK10gPSAwO1xuICB0aGlzW3ddICs9IG47XG4gIHdoaWxlICh0aGlzW3ddID49IHRoaXMuRFYpIHtcbiAgICB0aGlzW3ddIC09IHRoaXMuRFY7XG4gICAgaWYgKCsrdyA+PSB0aGlzLnQpIHRoaXNbdGhpcy50KytdID0gMDtcbiAgICArK3RoaXNbd107XG4gIH1cbn1cblxuLy8gQSBcIm51bGxcIiByZWR1Y2VyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmZ1bmN0aW9uIE51bGxFeHAoKSB7fVxuZnVuY3Rpb24gbk5vcCh4KSB7XG4gIHJldHVybiB4O1xufVxuZnVuY3Rpb24gbk11bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpO1xufVxuZnVuY3Rpb24gblNxclRvKHgsIHIpIHtcbiAgeC5zcXVhcmVUbyhyKTtcbn1cblxuTnVsbEV4cC5wcm90b3R5cGUuY29udmVydCA9IG5Ob3A7XG5OdWxsRXhwLnByb3RvdHlwZS5yZXZlcnQgPSBuTm9wO1xuTnVsbEV4cC5wcm90b3R5cGUubXVsVG8gPSBuTXVsVG87XG5OdWxsRXhwLnByb3RvdHlwZS5zcXJUbyA9IG5TcXJUbztcblxuLy8gKHB1YmxpYykgdGhpc15lXG5mdW5jdGlvbiBiblBvdyhlKSB7XG4gIHJldHVybiB0aGlzLmV4cChlLCBuZXcgTnVsbEV4cCgpKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IGxvd2VyIG4gd29yZHMgb2YgXCJ0aGlzICogYVwiLCBhLnQgPD0gblxuLy8gXCJ0aGlzXCIgc2hvdWxkIGJlIHRoZSBsYXJnZXIgb25lIGlmIGFwcHJvcHJpYXRlLlxuZnVuY3Rpb24gYm5wTXVsdGlwbHlMb3dlclRvKGEsIG4sIHIpIHtcbiAgdmFyIGkgPSBNYXRoLm1pbih0aGlzLnQgKyBhLnQsIG4pO1xuICByLnMgPSAwOyAgLy8gYXNzdW1lcyBhLHRoaXMgPj0gMFxuICByLnQgPSBpO1xuICB3aGlsZSAoaSA+IDApIHJbLS1pXSA9IDA7XG4gIHZhciBqO1xuICBmb3IgKGogPSByLnQgLSB0aGlzLnQ7IGkgPCBqOyArK2kpXG4gICAgcltpICsgdGhpcy50XSA9IHRoaXMuYW0oMCwgYVtpXSwgciwgaSwgMCwgdGhpcy50KTtcbiAgZm9yIChqID0gTWF0aC5taW4oYS50LCBuKTsgaSA8IGo7ICsraSkgdGhpcy5hbSgwLCBhW2ldLCByLCBpLCAwLCBuIC0gaSk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IFwidGhpcyAqIGFcIiB3aXRob3V0IGxvd2VyIG4gd29yZHMsIG4gPiAwXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseVVwcGVyVG8oYSwgbiwgcikge1xuICAtLW47XG4gIHZhciBpID0gci50ID0gdGhpcy50ICsgYS50IC0gbjtcbiAgci5zID0gMDsgIC8vIGFzc3VtZXMgYSx0aGlzID49IDBcbiAgd2hpbGUgKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yIChpID0gTWF0aC5tYXgobiAtIHRoaXMudCwgMCk7IGkgPCBhLnQ7ICsraSlcbiAgICByW3RoaXMudCArIGkgLSBuXSA9IHRoaXMuYW0obiAtIGksIGFbaV0sIHIsIDAsIDAsIHRoaXMudCArIGkgLSBuKTtcbiAgci5jbGFtcCgpO1xuICByLmRyU2hpZnRUbygxLCByKTtcbn1cblxuLy8gQmFycmV0dCBtb2R1bGFyIHJlZHVjdGlvblxuZnVuY3Rpb24gQmFycmV0dChtKSB7XG4gIC8vIHNldHVwIEJhcnJldHRcbiAgdGhpcy5yMiA9IG5iaSgpO1xuICB0aGlzLnEzID0gbmJpKCk7XG4gIEJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbygyICogbS50LCB0aGlzLnIyKTtcbiAgdGhpcy5tdSA9IHRoaXMucjIuZGl2aWRlKG0pO1xuICB0aGlzLm0gPSBtO1xufVxuXG5mdW5jdGlvbiBiYXJyZXR0Q29udmVydCh4KSB7XG4gIGlmICh4LnMgPCAwIHx8IHgudCA+IDIgKiB0aGlzLm0udClcbiAgICByZXR1cm4geC5tb2QodGhpcy5tKTtcbiAgZWxzZSBpZiAoeC5jb21wYXJlVG8odGhpcy5tKSA8IDApXG4gICAgcmV0dXJuIHg7XG4gIGVsc2Uge1xuICAgIHZhciByID0gbmJpKCk7XG4gICAgeC5jb3B5VG8ocik7XG4gICAgdGhpcy5yZWR1Y2Uocik7XG4gICAgcmV0dXJuIHI7XG4gIH1cbn1cblxuZnVuY3Rpb24gYmFycmV0dFJldmVydCh4KSB7XG4gIHJldHVybiB4O1xufVxuXG4vLyB4ID0geCBtb2QgbSAoSEFDIDE0LjQyKVxuZnVuY3Rpb24gYmFycmV0dFJlZHVjZSh4KSB7XG4gIHguZHJTaGlmdFRvKHRoaXMubS50IC0gMSwgdGhpcy5yMik7XG4gIGlmICh4LnQgPiB0aGlzLm0udCArIDEpIHtcbiAgICB4LnQgPSB0aGlzLm0udCArIDE7XG4gICAgeC5jbGFtcCgpO1xuICB9XG4gIHRoaXMubXUubXVsdGlwbHlVcHBlclRvKHRoaXMucjIsIHRoaXMubS50ICsgMSwgdGhpcy5xMyk7XG4gIHRoaXMubS5tdWx0aXBseUxvd2VyVG8odGhpcy5xMywgdGhpcy5tLnQgKyAxLCB0aGlzLnIyKTtcbiAgd2hpbGUgKHguY29tcGFyZVRvKHRoaXMucjIpIDwgMCkgeC5kQWRkT2Zmc2V0KDEsIHRoaXMubS50ICsgMSk7XG4gIHguc3ViVG8odGhpcy5yMiwgeCk7XG4gIHdoaWxlICh4LmNvbXBhcmVUbyh0aGlzLm0pID49IDApIHguc3ViVG8odGhpcy5tLCB4KTtcbn1cblxuLy8gciA9IHheMiBtb2QgbTsgeCAhPSByXG5mdW5jdGlvbiBiYXJyZXR0U3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuLy8gciA9IHgqeSBtb2QgbTsgeCx5ICE9IHJcbmZ1bmN0aW9uIGJhcnJldHRNdWxUbyh4LCB5LCByKSB7XG4gIHgubXVsdGlwbHlUbyh5LCByKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5cbkJhcnJldHQucHJvdG90eXBlLmNvbnZlcnQgPSBiYXJyZXR0Q29udmVydDtcbkJhcnJldHQucHJvdG90eXBlLnJldmVydCA9IGJhcnJldHRSZXZlcnQ7XG5CYXJyZXR0LnByb3RvdHlwZS5yZWR1Y2UgPSBiYXJyZXR0UmVkdWNlO1xuQmFycmV0dC5wcm90b3R5cGUubXVsVG8gPSBiYXJyZXR0TXVsVG87XG5CYXJyZXR0LnByb3RvdHlwZS5zcXJUbyA9IGJhcnJldHRTcXJUbztcblxuLy8gKHB1YmxpYykgdGhpc15lICUgbSAoSEFDIDE0Ljg1KVxuZnVuY3Rpb24gYm5Nb2RQb3coZSwgbSkge1xuICB2YXIgaSA9IGUuYml0TGVuZ3RoKCksIGssIHIgPSBuYnYoMSksIHo7XG4gIGlmIChpIDw9IDApXG4gICAgcmV0dXJuIHI7XG4gIGVsc2UgaWYgKGkgPCAxOClcbiAgICBrID0gMTtcbiAgZWxzZSBpZiAoaSA8IDQ4KVxuICAgIGsgPSAzO1xuICBlbHNlIGlmIChpIDwgMTQ0KVxuICAgIGsgPSA0O1xuICBlbHNlIGlmIChpIDwgNzY4KVxuICAgIGsgPSA1O1xuICBlbHNlXG4gICAgayA9IDY7XG4gIGlmIChpIDwgOClcbiAgICB6ID0gbmV3IENsYXNzaWMobSk7XG4gIGVsc2UgaWYgKG0uaXNFdmVuKCkpXG4gICAgeiA9IG5ldyBCYXJyZXR0KG0pO1xuICBlbHNlXG4gICAgeiA9IG5ldyBNb250Z29tZXJ5KG0pO1xuXG4gIC8vIHByZWNvbXB1dGF0aW9uXG4gIHZhciBnID0gbmV3IEFycmF5KCksIG4gPSAzLCBrMSA9IGsgLSAxLCBrbSA9ICgxIDw8IGspIC0gMTtcbiAgZ1sxXSA9IHouY29udmVydCh0aGlzKTtcbiAgaWYgKGsgPiAxKSB7XG4gICAgdmFyIGcyID0gbmJpKCk7XG4gICAgei5zcXJUbyhnWzFdLCBnMik7XG4gICAgd2hpbGUgKG4gPD0ga20pIHtcbiAgICAgIGdbbl0gPSBuYmkoKTtcbiAgICAgIHoubXVsVG8oZzIsIGdbbiAtIDJdLCBnW25dKTtcbiAgICAgIG4gKz0gMjtcbiAgICB9XG4gIH1cblxuICB2YXIgaiA9IGUudCAtIDEsIHcsIGlzMSA9IHRydWUsIHIyID0gbmJpKCksIHQ7XG4gIGkgPSBuYml0cyhlW2pdKSAtIDE7XG4gIHdoaWxlIChqID49IDApIHtcbiAgICBpZiAoaSA+PSBrMSlcbiAgICAgIHcgPSAoZVtqXSA+PiAoaSAtIGsxKSkgJiBrbTtcbiAgICBlbHNlIHtcbiAgICAgIHcgPSAoZVtqXSAmICgoMSA8PCAoaSArIDEpKSAtIDEpKSA8PCAoazEgLSBpKTtcbiAgICAgIGlmIChqID4gMCkgdyB8PSBlW2ogLSAxXSA+PiAodGhpcy5EQiArIGkgLSBrMSk7XG4gICAgfVxuXG4gICAgbiA9IGs7XG4gICAgd2hpbGUgKCh3ICYgMSkgPT0gMCkge1xuICAgICAgdyA+Pj0gMTtcbiAgICAgIC0tbjtcbiAgICB9XG4gICAgaWYgKChpIC09IG4pIDwgMCkge1xuICAgICAgaSArPSB0aGlzLkRCO1xuICAgICAgLS1qO1xuICAgIH1cbiAgICBpZiAoaXMxKSB7ICAvLyByZXQgPT0gMSwgZG9uJ3QgYm90aGVyIHNxdWFyaW5nIG9yIG11bHRpcGx5aW5nIGl0XG4gICAgICBnW3ddLmNvcHlUbyhyKTtcbiAgICAgIGlzMSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobiA+IDEpIHtcbiAgICAgICAgei5zcXJUbyhyLCByMik7XG4gICAgICAgIHouc3FyVG8ocjIsIHIpO1xuICAgICAgICBuIC09IDI7XG4gICAgICB9XG4gICAgICBpZiAobiA+IDApXG4gICAgICAgIHouc3FyVG8ociwgcjIpO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHQgPSByO1xuICAgICAgICByID0gcjI7XG4gICAgICAgIHIyID0gdDtcbiAgICAgIH1cbiAgICAgIHoubXVsVG8ocjIsIGdbd10sIHIpO1xuICAgIH1cblxuICAgIHdoaWxlIChqID49IDAgJiYgKGVbal0gJiAoMSA8PCBpKSkgPT0gMCkge1xuICAgICAgei5zcXJUbyhyLCByMik7XG4gICAgICB0ID0gcjtcbiAgICAgIHIgPSByMjtcbiAgICAgIHIyID0gdDtcbiAgICAgIGlmICgtLWkgPCAwKSB7XG4gICAgICAgIGkgPSB0aGlzLkRCIC0gMTtcbiAgICAgICAgLS1qO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gei5yZXZlcnQocik7XG59XG5cbi8vIChwdWJsaWMpIGdjZCh0aGlzLGEpIChIQUMgMTQuNTQpXG5mdW5jdGlvbiBibkdDRChhKSB7XG4gIHZhciB4ID0gKHRoaXMucyA8IDApID8gdGhpcy5uZWdhdGUoKSA6IHRoaXMuY2xvbmUoKTtcbiAgdmFyIHkgPSAoYS5zIDwgMCkgPyBhLm5lZ2F0ZSgpIDogYS5jbG9uZSgpO1xuICBpZiAoeC5jb21wYXJlVG8oeSkgPCAwKSB7XG4gICAgdmFyIHQgPSB4O1xuICAgIHggPSB5O1xuICAgIHkgPSB0O1xuICB9XG4gIHZhciBpID0geC5nZXRMb3dlc3RTZXRCaXQoKSwgZyA9IHkuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gIGlmIChnIDwgMCkgcmV0dXJuIHg7XG4gIGlmIChpIDwgZykgZyA9IGk7XG4gIGlmIChnID4gMCkge1xuICAgIHguclNoaWZ0VG8oZywgeCk7XG4gICAgeS5yU2hpZnRUbyhnLCB5KTtcbiAgfVxuICB3aGlsZSAoeC5zaWdudW0oKSA+IDApIHtcbiAgICBpZiAoKGkgPSB4LmdldExvd2VzdFNldEJpdCgpKSA+IDApIHguclNoaWZ0VG8oaSwgeCk7XG4gICAgaWYgKChpID0geS5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB5LnJTaGlmdFRvKGksIHkpO1xuICAgIGlmICh4LmNvbXBhcmVUbyh5KSA+PSAwKSB7XG4gICAgICB4LnN1YlRvKHksIHgpO1xuICAgICAgeC5yU2hpZnRUbygxLCB4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgeS5zdWJUbyh4LCB5KTtcbiAgICAgIHkuclNoaWZ0VG8oMSwgeSk7XG4gICAgfVxuICB9XG4gIGlmIChnID4gMCkgeS5sU2hpZnRUbyhnLCB5KTtcbiAgcmV0dXJuIHk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgJSBuLCBuIDwgMl4yNlxuZnVuY3Rpb24gYm5wTW9kSW50KG4pIHtcbiAgaWYgKG4gPD0gMCkgcmV0dXJuIDA7XG4gIHZhciBkID0gdGhpcy5EViAlIG4sIHIgPSAodGhpcy5zIDwgMCkgPyBuIC0gMSA6IDA7XG4gIGlmICh0aGlzLnQgPiAwKVxuICAgIGlmIChkID09IDApXG4gICAgICByID0gdGhpc1swXSAlIG47XG4gICAgZWxzZVxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSByID0gKGQgKiByICsgdGhpc1tpXSkgJSBuO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgMS90aGlzICUgbSAoSEFDIDE0LjYxKVxuZnVuY3Rpb24gYm5Nb2RJbnZlcnNlKG0pIHtcbiAgdmFyIGFjID0gbS5pc0V2ZW4oKTtcbiAgaWYgKCh0aGlzLmlzRXZlbigpICYmIGFjKSB8fCBtLnNpZ251bSgpID09IDApIHJldHVybiBCaWdJbnRlZ2VyLlpFUk87XG4gIHZhciB1ID0gbS5jbG9uZSgpLCB2ID0gdGhpcy5jbG9uZSgpO1xuICB2YXIgYSA9IG5idigxKSwgYiA9IG5idigwKSwgYyA9IG5idigwKSwgZCA9IG5idigxKTtcbiAgd2hpbGUgKHUuc2lnbnVtKCkgIT0gMCkge1xuICAgIHdoaWxlICh1LmlzRXZlbigpKSB7XG4gICAgICB1LnJTaGlmdFRvKDEsIHUpO1xuICAgICAgaWYgKGFjKSB7XG4gICAgICAgIGlmICghYS5pc0V2ZW4oKSB8fCAhYi5pc0V2ZW4oKSkge1xuICAgICAgICAgIGEuYWRkVG8odGhpcywgYSk7XG4gICAgICAgICAgYi5zdWJUbyhtLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBhLnJTaGlmdFRvKDEsIGEpO1xuICAgICAgfSBlbHNlIGlmICghYi5pc0V2ZW4oKSlcbiAgICAgICAgYi5zdWJUbyhtLCBiKTtcbiAgICAgIGIuclNoaWZ0VG8oMSwgYik7XG4gICAgfVxuICAgIHdoaWxlICh2LmlzRXZlbigpKSB7XG4gICAgICB2LnJTaGlmdFRvKDEsIHYpO1xuICAgICAgaWYgKGFjKSB7XG4gICAgICAgIGlmICghYy5pc0V2ZW4oKSB8fCAhZC5pc0V2ZW4oKSkge1xuICAgICAgICAgIGMuYWRkVG8odGhpcywgYyk7XG4gICAgICAgICAgZC5zdWJUbyhtLCBkKTtcbiAgICAgICAgfVxuICAgICAgICBjLnJTaGlmdFRvKDEsIGMpO1xuICAgICAgfSBlbHNlIGlmICghZC5pc0V2ZW4oKSlcbiAgICAgICAgZC5zdWJUbyhtLCBkKTtcbiAgICAgIGQuclNoaWZ0VG8oMSwgZCk7XG4gICAgfVxuICAgIGlmICh1LmNvbXBhcmVUbyh2KSA+PSAwKSB7XG4gICAgICB1LnN1YlRvKHYsIHUpO1xuICAgICAgaWYgKGFjKSBhLnN1YlRvKGMsIGEpO1xuICAgICAgYi5zdWJUbyhkLCBiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdi5zdWJUbyh1LCB2KTtcbiAgICAgIGlmIChhYykgYy5zdWJUbyhhLCBjKTtcbiAgICAgIGQuc3ViVG8oYiwgZCk7XG4gICAgfVxuICB9XG4gIGlmICh2LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgIT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcbiAgaWYgKGQuY29tcGFyZVRvKG0pID49IDApIHJldHVybiBkLnN1YnRyYWN0KG0pO1xuICBpZiAoZC5zaWdudW0oKSA8IDApXG4gICAgZC5hZGRUbyhtLCBkKTtcbiAgZWxzZVxuICAgIHJldHVybiBkO1xuICBpZiAoZC5zaWdudW0oKSA8IDApXG4gICAgcmV0dXJuIGQuYWRkKG0pO1xuICBlbHNlXG4gICAgcmV0dXJuIGQ7XG59XG5cbnZhciBsb3dwcmltZXMgPSBbXG4gIDIsICAgMywgICA1LCAgIDcsICAgMTEsICAxMywgIDE3LCAgMTksICAyMywgIDI5LCAgMzEsICAzNywgIDQxLCAgNDMsXG4gIDQ3LCAgNTMsICA1OSwgIDYxLCAgNjcsICA3MSwgIDczLCAgNzksICA4MywgIDg5LCAgOTcsICAxMDEsIDEwMywgMTA3LFxuICAxMDksIDExMywgMTI3LCAxMzEsIDEzNywgMTM5LCAxNDksIDE1MSwgMTU3LCAxNjMsIDE2NywgMTczLCAxNzksIDE4MSxcbiAgMTkxLCAxOTMsIDE5NywgMTk5LCAyMTEsIDIyMywgMjI3LCAyMjksIDIzMywgMjM5LCAyNDEsIDI1MSwgMjU3LCAyNjMsXG4gIDI2OSwgMjcxLCAyNzcsIDI4MSwgMjgzLCAyOTMsIDMwNywgMzExLCAzMTMsIDMxNywgMzMxLCAzMzcsIDM0NywgMzQ5LFxuICAzNTMsIDM1OSwgMzY3LCAzNzMsIDM3OSwgMzgzLCAzODksIDM5NywgNDAxLCA0MDksIDQxOSwgNDIxLCA0MzEsIDQzMyxcbiAgNDM5LCA0NDMsIDQ0OSwgNDU3LCA0NjEsIDQ2MywgNDY3LCA0NzksIDQ4NywgNDkxLCA0OTksIDUwMywgNTA5LCA1MjEsXG4gIDUyMywgNTQxLCA1NDcsIDU1NywgNTYzLCA1NjksIDU3MSwgNTc3LCA1ODcsIDU5MywgNTk5LCA2MDEsIDYwNywgNjEzLFxuICA2MTcsIDYxOSwgNjMxLCA2NDEsIDY0MywgNjQ3LCA2NTMsIDY1OSwgNjYxLCA2NzMsIDY3NywgNjgzLCA2OTEsIDcwMSxcbiAgNzA5LCA3MTksIDcyNywgNzMzLCA3MzksIDc0MywgNzUxLCA3NTcsIDc2MSwgNzY5LCA3NzMsIDc4NywgNzk3LCA4MDksXG4gIDgxMSwgODIxLCA4MjMsIDgyNywgODI5LCA4MzksIDg1MywgODU3LCA4NTksIDg2MywgODc3LCA4ODEsIDg4MywgODg3LFxuICA5MDcsIDkxMSwgOTE5LCA5MjksIDkzNywgOTQxLCA5NDcsIDk1MywgOTY3LCA5NzEsIDk3NywgOTgzLCA5OTEsIDk5N1xuXTtcbnZhciBscGxpbSA9ICgxIDw8IDI2KSAvIGxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoIC0gMV07XG5cbi8vIChwdWJsaWMpIHRlc3QgcHJpbWFsaXR5IHdpdGggY2VydGFpbnR5ID49IDEtLjVedFxuZnVuY3Rpb24gYm5Jc1Byb2JhYmxlUHJpbWUodCkge1xuICB2YXIgaSwgeCA9IHRoaXMuYWJzKCk7XG4gIGlmICh4LnQgPT0gMSAmJiB4WzBdIDw9IGxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbG93cHJpbWVzLmxlbmd0aDsgKytpKVxuICAgICAgaWYgKHhbMF0gPT0gbG93cHJpbWVzW2ldKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHguaXNFdmVuKCkpIHJldHVybiBmYWxzZTtcbiAgaSA9IDE7XG4gIHdoaWxlIChpIDwgbG93cHJpbWVzLmxlbmd0aCkge1xuICAgIHZhciBtID0gbG93cHJpbWVzW2ldLCBqID0gaSArIDE7XG4gICAgd2hpbGUgKGogPCBsb3dwcmltZXMubGVuZ3RoICYmIG0gPCBscGxpbSkgbSAqPSBsb3dwcmltZXNbaisrXTtcbiAgICBtID0geC5tb2RJbnQobSk7XG4gICAgd2hpbGUgKGkgPCBqKVxuICAgICAgaWYgKG0gJSBsb3dwcmltZXNbaSsrXSA9PSAwKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHgubWlsbGVyUmFiaW4odCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRydWUgaWYgcHJvYmFibHkgcHJpbWUgKEhBQyA0LjI0LCBNaWxsZXItUmFiaW4pXG5mdW5jdGlvbiBibnBNaWxsZXJSYWJpbih0KSB7XG4gIHZhciBuMSA9IHRoaXMuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpO1xuICB2YXIgayA9IG4xLmdldExvd2VzdFNldEJpdCgpO1xuICBpZiAoayA8PSAwKSByZXR1cm4gZmFsc2U7XG4gIHZhciByID0gbjEuc2hpZnRSaWdodChrKTtcbiAgdCA9ICh0ICsgMSkgPj4gMTtcbiAgaWYgKHQgPiBsb3dwcmltZXMubGVuZ3RoKSB0ID0gbG93cHJpbWVzLmxlbmd0aDtcbiAgdmFyIGEgPSBuYmkoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0OyArK2kpIHtcbiAgICAvLyBQaWNrIGJhc2VzIGF0IHJhbmRvbSwgaW5zdGVhZCBvZiBzdGFydGluZyBhdCAyXG4gICAgYS5mcm9tSW50KGxvd3ByaW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsb3dwcmltZXMubGVuZ3RoKV0pO1xuICAgIHZhciB5ID0gYS5tb2RQb3cociwgdGhpcyk7XG4gICAgaWYgKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSAhPSAwICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICB2YXIgaiA9IDE7XG4gICAgICB3aGlsZSAoaisrIDwgayAmJiB5LmNvbXBhcmVUbyhuMSkgIT0gMCkge1xuICAgICAgICB5ID0geS5tb2RQb3dJbnQoMiwgdGhpcyk7XG4gICAgICAgIGlmICh5LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHkuY29tcGFyZVRvKG4xKSAhPSAwKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBwcm90ZWN0ZWRcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNodW5rU2l6ZSA9IGJucENodW5rU2l6ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRvUmFkaXggPSBibnBUb1JhZGl4O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVJhZGl4ID0gYm5wRnJvbVJhZGl4O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbU51bWJlciA9IGJucEZyb21OdW1iZXI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXR3aXNlVG8gPSBibnBCaXR3aXNlVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jaGFuZ2VCaXQgPSBibnBDaGFuZ2VCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGRUbyA9IGJucEFkZFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZE11bHRpcGx5ID0gYm5wRE11bHRpcGx5O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZEFkZE9mZnNldCA9IGJucERBZGRPZmZzZXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseUxvd2VyVG8gPSBibnBNdWx0aXBseUxvd2VyVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseVVwcGVyVG8gPSBibnBNdWx0aXBseVVwcGVyVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnQgPSBibnBNb2RJbnQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5taWxsZXJSYWJpbiA9IGJucE1pbGxlclJhYmluO1xuXG4vLyBwdWJsaWNcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNsb25lID0gYm5DbG9uZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmludFZhbHVlID0gYm5JbnRWYWx1ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJ5dGVWYWx1ZSA9IGJuQnl0ZVZhbHVlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2hvcnRWYWx1ZSA9IGJuU2hvcnRWYWx1ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNpZ251bSA9IGJuU2lnTnVtO1xuQmlnSW50ZWdlci5wcm90b3R5cGUudG9CeXRlQXJyYXkgPSBiblRvQnl0ZUFycmF5O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzID0gYm5FcXVhbHM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5taW4gPSBibk1pbjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1heCA9IGJuTWF4O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYW5kID0gYm5BbmQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5vciA9IGJuT3I7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS54b3IgPSBiblhvcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFuZE5vdCA9IGJuQW5kTm90O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubm90ID0gYm5Ob3Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdExlZnQgPSBiblNoaWZ0TGVmdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0UmlnaHQgPSBiblNoaWZ0UmlnaHQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5nZXRMb3dlc3RTZXRCaXQgPSBibkdldExvd2VzdFNldEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJpdENvdW50ID0gYm5CaXRDb3VudDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRlc3RCaXQgPSBiblRlc3RCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zZXRCaXQgPSBiblNldEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNsZWFyQml0ID0gYm5DbGVhckJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZsaXBCaXQgPSBibkZsaXBCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGQgPSBibkFkZDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnN1YnRyYWN0ID0gYm5TdWJ0cmFjdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5ID0gYm5NdWx0aXBseTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZSA9IGJuRGl2aWRlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUucmVtYWluZGVyID0gYm5SZW1haW5kZXI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGVBbmRSZW1haW5kZXIgPSBibkRpdmlkZUFuZFJlbWFpbmRlcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZFBvdyA9IGJuTW9kUG93O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kSW52ZXJzZSA9IGJuTW9kSW52ZXJzZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnBvdyA9IGJuUG93O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZ2NkID0gYm5HQ0Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1Byb2JhYmxlUHJpbWUgPSBibklzUHJvYmFibGVQcmltZTtcblxuLy8gSlNCTi1zcGVjaWZpYyBleHRlbnNpb25cbkJpZ0ludGVnZXIucHJvdG90eXBlLnNxdWFyZSA9IGJuU3F1YXJlO1xuXG4vLyBCaWdJbnRlZ2VyIGludGVyZmFjZXMgbm90IGltcGxlbWVudGVkIGluIGpzYm46XG5cbi8vIEJpZ0ludGVnZXIoaW50IHNpZ251bSwgYnl0ZVtdIG1hZ25pdHVkZSlcbi8vIGRvdWJsZSBkb3VibGVWYWx1ZSgpXG4vLyBmbG9hdCBmbG9hdFZhbHVlKClcbi8vIGludCBoYXNoQ29kZSgpXG4vLyBsb25nIGxvbmdWYWx1ZSgpXG4vLyBzdGF0aWMgQmlnSW50ZWdlciB2YWx1ZU9mKGxvbmcgdmFsKVxuXG4vLyBEZXBlbmRzIG9uIGpzYm4uanMgYW5kIHJuZy5qc1xuXG4vLyBWZXJzaW9uIDEuMTogc3VwcG9ydCB1dGYtOCBlbmNvZGluZyBpbiBwa2NzMXBhZDJcblxuLy8gY29udmVydCBhIChoZXgpIHN0cmluZyB0byBhIGJpZ251bSBvYmplY3RcbmZ1bmN0aW9uIHBhcnNlQmlnSW50KHN0ciwgcikge1xuICByZXR1cm4gbmV3IEJpZ0ludGVnZXIoc3RyLCByKTtcbn1cblxuZnVuY3Rpb24gbGluZWJyayhzLCBuKSB7XG4gIHZhciByZXQgPSAnJztcbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAoaSArIG4gPCBzLmxlbmd0aCkge1xuICAgIHJldCArPSBzLnN1YnN0cmluZyhpLCBpICsgbikgKyAnXFxuJztcbiAgICBpICs9IG47XG4gIH1cbiAgcmV0dXJuIHJldCArIHMuc3Vic3RyaW5nKGksIHMubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gYnl0ZTJIZXgoYikge1xuICBpZiAoYiA8IDB4MTApXG4gICAgcmV0dXJuICcwJyArIGIudG9TdHJpbmcoMTYpO1xuICBlbHNlXG4gICAgcmV0dXJuIGIudG9TdHJpbmcoMTYpO1xufVxuXG4vLyBQS0NTIzEgKHR5cGUgMiwgcmFuZG9tKSBwYWQgaW5wdXQgc3RyaW5nIHMgdG8gbiBieXRlcywgYW5kIHJldHVybiBhIGJpZ2ludFxuZnVuY3Rpb24gcGtjczFwYWQyKHMsIG4pIHtcbiAgaWYgKG4gPCBzLmxlbmd0aCArIDExKSB7ICAvLyBUT0RPOiBmaXggZm9yIHV0Zi04XG4gICAgYWxlcnQoJ01lc3NhZ2UgdG9vIGxvbmcgZm9yIFJTQScpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBiYSA9IG5ldyBBcnJheSgpO1xuICB2YXIgaSA9IHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGkgPj0gMCAmJiBuID4gMCkge1xuICAgIHZhciBjID0gcy5jaGFyQ29kZUF0KGktLSk7XG4gICAgaWYgKGMgPCAxMjgpIHsgIC8vIGVuY29kZSB1c2luZyB1dGYtOFxuICAgICAgYmFbLS1uXSA9IGM7XG4gICAgfSBlbHNlIGlmICgoYyA+IDEyNykgJiYgKGMgPCAyMDQ4KSkge1xuICAgICAgYmFbLS1uXSA9IChjICYgNjMpIHwgMTI4O1xuICAgICAgYmFbLS1uXSA9IChjID4+IDYpIHwgMTkyO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYVstLW5dID0gKGMgJiA2MykgfCAxMjg7XG4gICAgICBiYVstLW5dID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xuICAgICAgYmFbLS1uXSA9IChjID4+IDEyKSB8IDIyNDtcbiAgICB9XG4gIH1cbiAgYmFbLS1uXSA9IDA7XG4gIHZhciBybmcgPSBuZXcgU2VjdXJlUmFuZG9tKCk7XG4gIHZhciB4ID0gbmV3IEFycmF5KCk7XG4gIHdoaWxlIChuID4gMikgeyAgLy8gcmFuZG9tIG5vbi16ZXJvIHBhZFxuICAgIHhbMF0gPSAwO1xuICAgIHdoaWxlICh4WzBdID09IDApIHJuZy5uZXh0Qnl0ZXMoeCk7XG4gICAgYmFbLS1uXSA9IHhbMF07XG4gIH1cbiAgYmFbLS1uXSA9IDI7XG4gIGJhWy0tbl0gPSAwO1xuICByZXR1cm4gbmV3IEJpZ0ludGVnZXIoYmEpO1xufVxuXG4vLyBcImVtcHR5XCIgUlNBIGtleSBjb25zdHJ1Y3RvclxuZnVuY3Rpb24gUlNBS2V5KCkge1xuICB0aGlzLm4gPSBudWxsO1xuICB0aGlzLmUgPSAwO1xuICB0aGlzLmQgPSBudWxsO1xuICB0aGlzLnAgPSBudWxsO1xuICB0aGlzLnEgPSBudWxsO1xuICB0aGlzLmRtcDEgPSBudWxsO1xuICB0aGlzLmRtcTEgPSBudWxsO1xuICB0aGlzLmNvZWZmID0gbnVsbDtcbn1cblxuLy8gU2V0IHRoZSBwdWJsaWMga2V5IGZpZWxkcyBOIGFuZCBlIGZyb20gaGV4IHN0cmluZ3NcbmZ1bmN0aW9uIFJTQVNldFB1YmxpYyhOLCBFKSB7XG4gIGlmIChOICE9IG51bGwgJiYgRSAhPSBudWxsICYmIE4ubGVuZ3RoID4gMCAmJiBFLmxlbmd0aCA+IDApIHtcbiAgICB0aGlzLm4gPSBwYXJzZUJpZ0ludChOLCAxNik7XG4gICAgdGhpcy5lID0gcGFyc2VJbnQoRSwgMTYpO1xuICB9IGVsc2VcbiAgICBhbGVydCgnSW52YWxpZCBSU0EgcHVibGljIGtleScpO1xufVxuXG4vLyBTZXQgdGhlIHByaXZhdGUga2V5IGZpZWxkcyBOLCBlLCBkIGFuZCBDUlQgcGFyYW1zIGZyb20gaGV4IHN0cmluZ3NcbmZ1bmN0aW9uIFJTQVNldFByaXZhdGVFeChOLEUsRCxQLFEsRFAsRFEsQykge1xuICAgIGlmKE4gIT0gbnVsbCAmJiBFICE9IG51bGwgJiYgTi5sZW5ndGggPiAwICYmIEUubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5uID0gcGFyc2VCaWdJbnQoTiwxNik7XG4gICAgICB0aGlzLmUgPSBwYXJzZUludChFLDE2KTtcbiAgICAgIHRoaXMuZCA9IHBhcnNlQmlnSW50KEQsMTYpO1xuICAgICAgdGhpcy5wID0gcGFyc2VCaWdJbnQoUCwxNik7XG4gICAgICB0aGlzLnEgPSBwYXJzZUJpZ0ludChRLDE2KTtcbiAgICAgIHRoaXMuZG1wMSA9IHBhcnNlQmlnSW50KERQLDE2KTtcbiAgICAgIHRoaXMuZG1xMSA9IHBhcnNlQmlnSW50KERRLDE2KTtcbiAgICAgIHRoaXMuY29lZmYgPSBwYXJzZUJpZ0ludChDLDE2KTtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgYWxlcnQoXCJJbnZhbGlkIFJTQSBwcml2YXRlIGtleVwiKTtcbiAgfVxuXG4vLyBQZXJmb3JtIHJhdyBwcml2YXRlIG9wZXJhdGlvbiBvbiBcInhcIjogcmV0dXJuIHheZCAobW9kIG4pXG5mdW5jdGlvbiBSU0FEb1ByaXZhdGUoeCkge1xuICBpZih0aGlzLnAgPT0gbnVsbCB8fCB0aGlzLnEgPT0gbnVsbClcbiAgICByZXR1cm4geC5tb2RQb3codGhpcy5kLCB0aGlzLm4pO1xuXG4gIC8vIFRPRE86IHJlLWNhbGN1bGF0ZSBhbnkgbWlzc2luZyBDUlQgcGFyYW1zXG4gIHZhciB4cCA9IHgubW9kKHRoaXMucCkubW9kUG93KHRoaXMuZG1wMSwgdGhpcy5wKTtcbiAgdmFyIHhxID0geC5tb2QodGhpcy5xKS5tb2RQb3codGhpcy5kbXExLCB0aGlzLnEpO1xuXG4gIHdoaWxlKHhwLmNvbXBhcmVUbyh4cSkgPCAwKVxuICAgIHhwID0geHAuYWRkKHRoaXMucCk7XG4gIHJldHVybiB4cC5zdWJ0cmFjdCh4cSkubXVsdGlwbHkodGhpcy5jb2VmZikubW9kKHRoaXMucCkubXVsdGlwbHkodGhpcy5xKS5hZGQoeHEpO1xufVxuXG4vLyBQZXJmb3JtIHJhdyBwdWJsaWMgb3BlcmF0aW9uIG9uIFwieFwiOiByZXR1cm4geF5lIChtb2QgbilcbmZ1bmN0aW9uIFJTQURvUHVibGljKHgpIHtcbiAgcmV0dXJuIHgubW9kUG93SW50KHRoaXMuZSwgdGhpcy5uKTtcbn1cblxuLy8gUmV0dXJuIHRoZSBQS0NTIzEgUlNBIGVuY3J5cHRpb24gb2YgXCJ0ZXh0XCIgYXMgYW4gZXZlbi1sZW5ndGggaGV4IHN0cmluZ1xuZnVuY3Rpb24gUlNBRW5jcnlwdCh0ZXh0KSB7XG4gIHZhciBtID0gcGtjczFwYWQyKHRleHQsICh0aGlzLm4uYml0TGVuZ3RoKCkgKyA3KSA+PiAzKTtcbiAgaWYgKG0gPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIHZhciBjID0gdGhpcy5kb1B1YmxpYyhtKTtcbiAgaWYgKGMgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIHZhciBoID0gYy50b1N0cmluZygxNik7XG4gIGlmICgoaC5sZW5ndGggJiAxKSA9PSAwKVxuICAgIHJldHVybiBoO1xuICBlbHNlXG4gICAgcmV0dXJuICcwJyArIGg7XG59XG5cbi8vIFJldHVybiB0aGUgUEtDUyMxIFJTQSBlbmNyeXB0aW9uIG9mIFwidGV4dFwiIGFzIGEgQmFzZTY0LWVuY29kZWQgc3RyaW5nXG4vLyBmdW5jdGlvbiBSU0FFbmNyeXB0QjY0KHRleHQpIHtcbi8vICB2YXIgaCA9IHRoaXMuZW5jcnlwdCh0ZXh0KTtcbi8vICBpZihoKSByZXR1cm4gaGV4MmI2NChoKTsgZWxzZSByZXR1cm4gbnVsbDtcbi8vfVxuXG4vLyBwcm90ZWN0ZWRcblJTQUtleS5wcm90b3R5cGUuZG9QdWJsaWMgPSBSU0FEb1B1YmxpYztcblxuLy8gcHVibGljXG5SU0FLZXkucHJvdG90eXBlLmRvUHJpdmF0ZSA9IFJTQURvUHJpdmF0ZTtcblJTQUtleS5wcm90b3R5cGUuc2V0UHVibGljID0gUlNBU2V0UHVibGljO1xuUlNBS2V5LnByb3RvdHlwZS5zZXRQcml2YXRlRXggPSBSU0FTZXRQcml2YXRlRXg7XG5SU0FLZXkucHJvdG90eXBlLmVuY3J5cHQgPSBSU0FFbmNyeXB0O1xuLy8gUlNBS2V5LnByb3RvdHlwZS5lbmNyeXB0X2I2NCA9IFJTQUVuY3J5cHRCNjQ7XG5cbi8vIFJhbmRvbSBudW1iZXIgZ2VuZXJhdG9yIC0gcmVxdWlyZXMgYSBQUk5HIGJhY2tlbmQsIGUuZy4gcHJuZzQuanNcblxuLy8gRm9yIGJlc3QgcmVzdWx0cywgcHV0IGNvZGUgbGlrZVxuLy8gPGJvZHkgb25DbGljaz0ncm5nX3NlZWRfdGltZSgpOycgb25LZXlQcmVzcz0ncm5nX3NlZWRfdGltZSgpOyc+XG4vLyBpbiB5b3VyIG1haW4gSFRNTCBkb2N1bWVudC5cblxudmFyIHJuZ19zdGF0ZTtcbnZhciBybmdfcG9vbDtcbnZhciBybmdfcHB0cjtcblxuLy8gTWl4IGluIGEgMzItYml0IGludGVnZXIgaW50byB0aGUgcG9vbFxuZnVuY3Rpb24gcm5nX3NlZWRfaW50KHgpIHtcbiAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0geCAmIDI1NTtcbiAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0gKHggPj4gOCkgJiAyNTU7XG4gIHJuZ19wb29sW3JuZ19wcHRyKytdIF49ICh4ID4+IDE2KSAmIDI1NTtcbiAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0gKHggPj4gMjQpICYgMjU1O1xuICBpZiAocm5nX3BwdHIgPj0gcm5nX3BzaXplKSBybmdfcHB0ciAtPSBybmdfcHNpemU7XG59XG5cbi8vIE1peCBpbiB0aGUgY3VycmVudCB0aW1lICh3L21pbGxpc2Vjb25kcykgaW50byB0aGUgcG9vbFxuZnVuY3Rpb24gcm5nX3NlZWRfdGltZSgpIHtcbiAgcm5nX3NlZWRfaW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbn1cblxuLy8gSW5pdGlhbGl6ZSB0aGUgcG9vbCB3aXRoIGp1bmsgaWYgbmVlZGVkLlxuaWYgKHJuZ19wb29sID09IG51bGwpIHtcbiAgcm5nX3Bvb2wgPSBuZXcgQXJyYXkoKTtcbiAgcm5nX3BwdHIgPSAwO1xuICB2YXIgdDtcbiAgaWYgKGluQnJvd3NlciAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gVXNlIHdlYmNyeXB0byBpZiBhdmFpbGFibGVcbiAgICB2YXIgdWEgPSBuZXcgVWludDhBcnJheSgzMik7XG4gICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXModWEpO1xuICAgIGZvciAodCA9IDA7IHQgPCAzMjsgKyt0KSBybmdfcG9vbFtybmdfcHB0cisrXSA9IHVhW3RdO1xuICB9XG4gIGlmIChpbkJyb3dzZXIgJiYgbmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJlxuICAgICAgbmF2aWdhdG9yLmFwcFZlcnNpb24gPCAnNScgJiYgd2luZG93LmNyeXB0bykge1xuICAgIC8vIEV4dHJhY3QgZW50cm9weSAoMjU2IGJpdHMpIGZyb20gTlM0IFJORyBpZiBhdmFpbGFibGVcbiAgICB2YXIgeiA9IHdpbmRvdy5jcnlwdG8ucmFuZG9tKDMyKTtcbiAgICBmb3IgKHQgPSAwOyB0IDwgei5sZW5ndGg7ICsrdCkgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSB6LmNoYXJDb2RlQXQodCkgJiAyNTU7XG4gIH1cbiAgd2hpbGUgKHJuZ19wcHRyIDwgcm5nX3BzaXplKSB7ICAvLyBleHRyYWN0IHNvbWUgcmFuZG9tbmVzcyBmcm9tIE1hdGgucmFuZG9tKClcbiAgICB0ID0gTWF0aC5mbG9vcig2NTUzNiAqIE1hdGgucmFuZG9tKCkpO1xuICAgIHJuZ19wb29sW3JuZ19wcHRyKytdID0gdCA+Pj4gODtcbiAgICBybmdfcG9vbFtybmdfcHB0cisrXSA9IHQgJiAyNTU7XG4gIH1cbiAgcm5nX3BwdHIgPSAwO1xuICBybmdfc2VlZF90aW1lKCk7XG4gIC8vIHJuZ19zZWVkX2ludCh3aW5kb3cuc2NyZWVuWCk7XG4gIC8vIHJuZ19zZWVkX2ludCh3aW5kb3cuc2NyZWVuWSk7XG59XG5cbmZ1bmN0aW9uIHJuZ19nZXRfYnl0ZSgpIHtcbiAgaWYgKHJuZ19zdGF0ZSA9PSBudWxsKSB7XG4gICAgcm5nX3NlZWRfdGltZSgpO1xuICAgIHJuZ19zdGF0ZSA9IHBybmdfbmV3c3RhdGUoKTtcbiAgICBybmdfc3RhdGUuaW5pdChybmdfcG9vbCk7XG4gICAgZm9yIChybmdfcHB0ciA9IDA7IHJuZ19wcHRyIDwgcm5nX3Bvb2wubGVuZ3RoOyArK3JuZ19wcHRyKVxuICAgICAgcm5nX3Bvb2xbcm5nX3BwdHJdID0gMDtcbiAgICBybmdfcHB0ciA9IDA7XG4gICAgLy8gcm5nX3Bvb2wgPSBudWxsO1xuICB9XG4gIC8vIFRPRE86IGFsbG93IHJlc2VlZGluZyBhZnRlciBmaXJzdCByZXF1ZXN0XG4gIHJldHVybiBybmdfc3RhdGUubmV4dCgpO1xufVxuXG5mdW5jdGlvbiBybmdfZ2V0X2J5dGVzKGJhKSB7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgYmEubGVuZ3RoOyArK2kpIGJhW2ldID0gcm5nX2dldF9ieXRlKCk7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZnVuY3Rpb24gU2VjdXJlUmFuZG9tKCkge31cblxuU2VjdXJlUmFuZG9tLnByb3RvdHlwZS5uZXh0Qnl0ZXMgPSBybmdfZ2V0X2J5dGVzO1xuXG4vLyBwcm5nNC5qcyAtIHVzZXMgQXJjZm91ciBhcyBhIFBSTkdcblxuZnVuY3Rpb24gQXJjZm91cigpIHtcbiAgdGhpcy5pID0gMDtcbiAgdGhpcy5qID0gMDtcbiAgdGhpcy5TID0gbmV3IEFycmF5KCk7XG59XG5cbi8vIEluaXRpYWxpemUgYXJjZm91ciBjb250ZXh0IGZyb20ga2V5LCBhbiBhcnJheSBvZiBpbnRzLCBlYWNoIGZyb20gWzAuLjI1NV1cbmZ1bmN0aW9uIEFSQzRpbml0KGtleSkge1xuICB2YXIgaSwgaiwgdDtcbiAgZm9yIChpID0gMDsgaSA8IDI1NjsgKytpKSB0aGlzLlNbaV0gPSBpO1xuICBqID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gICAgaiA9IChqICsgdGhpcy5TW2ldICsga2V5W2kgJSBrZXkubGVuZ3RoXSkgJiAyNTU7XG4gICAgdCA9IHRoaXMuU1tpXTtcbiAgICB0aGlzLlNbaV0gPSB0aGlzLlNbal07XG4gICAgdGhpcy5TW2pdID0gdDtcbiAgfVxuICB0aGlzLmkgPSAwO1xuICB0aGlzLmogPSAwO1xufVxuXG5mdW5jdGlvbiBBUkM0bmV4dCgpIHtcbiAgdmFyIHQ7XG4gIHRoaXMuaSA9ICh0aGlzLmkgKyAxKSAmIDI1NTtcbiAgdGhpcy5qID0gKHRoaXMuaiArIHRoaXMuU1t0aGlzLmldKSAmIDI1NTtcbiAgdCA9IHRoaXMuU1t0aGlzLmldO1xuICB0aGlzLlNbdGhpcy5pXSA9IHRoaXMuU1t0aGlzLmpdO1xuICB0aGlzLlNbdGhpcy5qXSA9IHQ7XG4gIHJldHVybiB0aGlzLlNbKHQgKyB0aGlzLlNbdGhpcy5pXSkgJiAyNTVdO1xufVxuXG5BcmNmb3VyLnByb3RvdHlwZS5pbml0ID0gQVJDNGluaXQ7XG5BcmNmb3VyLnByb3RvdHlwZS5uZXh0ID0gQVJDNG5leHQ7XG5cbi8vIFBsdWcgaW4geW91ciBSTkcgY29uc3RydWN0b3IgaGVyZVxuZnVuY3Rpb24gcHJuZ19uZXdzdGF0ZSgpIHtcbiAgcmV0dXJuIG5ldyBBcmNmb3VyKCk7XG59XG5cbi8vIFBvb2wgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCBhbmQgZ3JlYXRlciB0aGFuIDMyLlxuLy8gQW4gYXJyYXkgb2YgYnl0ZXMgdGhlIHNpemUgb2YgdGhlIHBvb2wgd2lsbCBiZSBwYXNzZWQgdG8gaW5pdCgpXG52YXIgcm5nX3BzaXplID0gMjU2O1xuXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgIGRlZmF1bHQ6IEJpZ0ludGVnZXIsXG4gICAgICBCaWdJbnRlZ2VyOiBCaWdJbnRlZ2VyLFxuICAgICAgUlNBS2V5OiBSU0FLZXksXG4gIH07XG59IGVsc2Uge1xuICB0aGlzLmpzYm4gPSB7XG4gICAgQmlnSW50ZWdlcjogQmlnSW50ZWdlcixcbiAgICBSU0FLZXk6IFJTQUtleSxcbiAgfTtcbn1cblxufSkuY2FsbCh0aGlzKTtcbiIsIi8qIVxuXG5KU1ppcCB2My4xMC4xIC0gQSBKYXZhU2NyaXB0IGNsYXNzIGZvciBnZW5lcmF0aW5nIGFuZCByZWFkaW5nIHppcCBmaWxlc1xuPGh0dHA6Ly9zdHVhcnRrLmNvbS9qc3ppcD5cblxuKGMpIDIwMDktMjAxNiBTdHVhcnQgS25pZ2h0bGV5IDxzdHVhcnQgW2F0XSBzdHVhcnRrLmNvbT5cbkR1YWwgbGljZW5jZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIG9yIEdQTHYzLiBTZWUgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS9TdHVrL2pzemlwL21haW4vTElDRU5TRS5tYXJrZG93bi5cblxuSlNaaXAgdXNlcyB0aGUgbGlicmFyeSBwYWtvIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSA6XG5odHRwczovL2dpdGh1Yi5jb20vbm9kZWNhL3Bha28vYmxvYi9tYWluL0xJQ0VOU0VcbiovXG5cbiFmdW5jdGlvbihlKXtpZihcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSltb2R1bGUuZXhwb3J0cz1lKCk7ZWxzZSBpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQpZGVmaW5lKFtdLGUpO2Vsc2V7KFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93OlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6dGhpcykuSlNaaXA9ZSgpfX0oZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24gcyhhLG8saCl7ZnVuY3Rpb24gdShyLGUpe2lmKCFvW3JdKXtpZighYVtyXSl7dmFyIHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZSYmdClyZXR1cm4gdChyLCEwKTtpZihsKXJldHVybiBsKHIsITApO3ZhciBuPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrcitcIidcIik7dGhyb3cgbi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLG59dmFyIGk9b1tyXT17ZXhwb3J0czp7fX07YVtyXVswXS5jYWxsKGkuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgdD1hW3JdWzFdW2VdO3JldHVybiB1KHR8fGUpfSxpLGkuZXhwb3J0cyxzLGEsbyxoKX1yZXR1cm4gb1tyXS5leHBvcnRzfWZvcih2YXIgbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGU9MDtlPGgubGVuZ3RoO2UrKyl1KGhbZV0pO3JldHVybiB1fSh7MTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBkPWUoXCIuL3V0aWxzXCIpLGM9ZShcIi4vc3VwcG9ydFwiKSxwPVwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIjtyLmVuY29kZT1mdW5jdGlvbihlKXtmb3IodmFyIHQscixuLGkscyxhLG8saD1bXSx1PTAsbD1lLmxlbmd0aCxmPWwsYz1cInN0cmluZ1wiIT09ZC5nZXRUeXBlT2YoZSk7dTxlLmxlbmd0aDspZj1sLXUsbj1jPyh0PWVbdSsrXSxyPXU8bD9lW3UrK106MCx1PGw/ZVt1KytdOjApOih0PWUuY2hhckNvZGVBdCh1KyspLHI9dTxsP2UuY2hhckNvZGVBdCh1KyspOjAsdTxsP2UuY2hhckNvZGVBdCh1KyspOjApLGk9dD4+MixzPSgzJnQpPDw0fHI+PjQsYT0xPGY/KDE1JnIpPDwyfG4+PjY6NjQsbz0yPGY/NjMmbjo2NCxoLnB1c2gocC5jaGFyQXQoaSkrcC5jaGFyQXQocykrcC5jaGFyQXQoYSkrcC5jaGFyQXQobykpO3JldHVybiBoLmpvaW4oXCJcIil9LHIuZGVjb2RlPWZ1bmN0aW9uKGUpe3ZhciB0LHIsbixpLHMsYSxvPTAsaD0wLHU9XCJkYXRhOlwiO2lmKGUuc3Vic3RyKDAsdS5sZW5ndGgpPT09dSl0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2U2NCBpbnB1dCwgaXQgbG9va3MgbGlrZSBhIGRhdGEgdXJsLlwiKTt2YXIgbCxmPTMqKGU9ZS5yZXBsYWNlKC9bXkEtWmEtejAtOSsvPV0vZyxcIlwiKSkubGVuZ3RoLzQ7aWYoZS5jaGFyQXQoZS5sZW5ndGgtMSk9PT1wLmNoYXJBdCg2NCkmJmYtLSxlLmNoYXJBdChlLmxlbmd0aC0yKT09PXAuY2hhckF0KDY0KSYmZi0tLGYlMSE9MCl0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGJhc2U2NCBpbnB1dCwgYmFkIGNvbnRlbnQgbGVuZ3RoLlwiKTtmb3IobD1jLnVpbnQ4YXJyYXk/bmV3IFVpbnQ4QXJyYXkoMHxmKTpuZXcgQXJyYXkoMHxmKTtvPGUubGVuZ3RoOyl0PXAuaW5kZXhPZihlLmNoYXJBdChvKyspKTw8MnwoaT1wLmluZGV4T2YoZS5jaGFyQXQobysrKSkpPj40LHI9KDE1JmkpPDw0fChzPXAuaW5kZXhPZihlLmNoYXJBdChvKyspKSk+PjIsbj0oMyZzKTw8NnwoYT1wLmluZGV4T2YoZS5jaGFyQXQobysrKSkpLGxbaCsrXT10LDY0IT09cyYmKGxbaCsrXT1yKSw2NCE9PWEmJihsW2grK109bik7cmV0dXJuIGx9fSx7XCIuL3N1cHBvcnRcIjozMCxcIi4vdXRpbHNcIjozMn1dLDI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi9leHRlcm5hbFwiKSxpPWUoXCIuL3N0cmVhbS9EYXRhV29ya2VyXCIpLHM9ZShcIi4vc3RyZWFtL0NyYzMyUHJvYmVcIiksYT1lKFwiLi9zdHJlYW0vRGF0YUxlbmd0aFByb2JlXCIpO2Z1bmN0aW9uIG8oZSx0LHIsbixpKXt0aGlzLmNvbXByZXNzZWRTaXplPWUsdGhpcy51bmNvbXByZXNzZWRTaXplPXQsdGhpcy5jcmMzMj1yLHRoaXMuY29tcHJlc3Npb249bix0aGlzLmNvbXByZXNzZWRDb250ZW50PWl9by5wcm90b3R5cGU9e2dldENvbnRlbnRXb3JrZXI6ZnVuY3Rpb24oKXt2YXIgZT1uZXcgaShuLlByb21pc2UucmVzb2x2ZSh0aGlzLmNvbXByZXNzZWRDb250ZW50KSkucGlwZSh0aGlzLmNvbXByZXNzaW9uLnVuY29tcHJlc3NXb3JrZXIoKSkucGlwZShuZXcgYShcImRhdGFfbGVuZ3RoXCIpKSx0PXRoaXM7cmV0dXJuIGUub24oXCJlbmRcIixmdW5jdGlvbigpe2lmKHRoaXMuc3RyZWFtSW5mby5kYXRhX2xlbmd0aCE9PXQudW5jb21wcmVzc2VkU2l6ZSl0aHJvdyBuZXcgRXJyb3IoXCJCdWcgOiB1bmNvbXByZXNzZWQgZGF0YSBzaXplIG1pc21hdGNoXCIpfSksZX0sZ2V0Q29tcHJlc3NlZFdvcmtlcjpmdW5jdGlvbigpe3JldHVybiBuZXcgaShuLlByb21pc2UucmVzb2x2ZSh0aGlzLmNvbXByZXNzZWRDb250ZW50KSkud2l0aFN0cmVhbUluZm8oXCJjb21wcmVzc2VkU2l6ZVwiLHRoaXMuY29tcHJlc3NlZFNpemUpLndpdGhTdHJlYW1JbmZvKFwidW5jb21wcmVzc2VkU2l6ZVwiLHRoaXMudW5jb21wcmVzc2VkU2l6ZSkud2l0aFN0cmVhbUluZm8oXCJjcmMzMlwiLHRoaXMuY3JjMzIpLndpdGhTdHJlYW1JbmZvKFwiY29tcHJlc3Npb25cIix0aGlzLmNvbXByZXNzaW9uKX19LG8uY3JlYXRlV29ya2VyRnJvbT1mdW5jdGlvbihlLHQscil7cmV0dXJuIGUucGlwZShuZXcgcykucGlwZShuZXcgYShcInVuY29tcHJlc3NlZFNpemVcIikpLnBpcGUodC5jb21wcmVzc1dvcmtlcihyKSkucGlwZShuZXcgYShcImNvbXByZXNzZWRTaXplXCIpKS53aXRoU3RyZWFtSW5mbyhcImNvbXByZXNzaW9uXCIsdCl9LHQuZXhwb3J0cz1vfSx7XCIuL2V4dGVybmFsXCI6NixcIi4vc3RyZWFtL0NyYzMyUHJvYmVcIjoyNSxcIi4vc3RyZWFtL0RhdGFMZW5ndGhQcm9iZVwiOjI2LFwiLi9zdHJlYW0vRGF0YVdvcmtlclwiOjI3fV0sMzpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCIpO3IuU1RPUkU9e21hZ2ljOlwiXFwwXFwwXCIsY29tcHJlc3NXb3JrZXI6ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IG4oXCJTVE9SRSBjb21wcmVzc2lvblwiKX0sdW5jb21wcmVzc1dvcmtlcjpmdW5jdGlvbigpe3JldHVybiBuZXcgbihcIlNUT1JFIGRlY29tcHJlc3Npb25cIil9fSxyLkRFRkxBVEU9ZShcIi4vZmxhdGVcIil9LHtcIi4vZmxhdGVcIjo3LFwiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4fV0sNDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL3V0aWxzXCIpO3ZhciBvPWZ1bmN0aW9uKCl7Zm9yKHZhciBlLHQ9W10scj0wO3I8MjU2O3IrKyl7ZT1yO2Zvcih2YXIgbj0wO248ODtuKyspZT0xJmU/Mzk4ODI5MjM4NF5lPj4+MTplPj4+MTt0W3JdPWV9cmV0dXJuIHR9KCk7dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHZvaWQgMCE9PWUmJmUubGVuZ3RoP1wic3RyaW5nXCIhPT1uLmdldFR5cGVPZihlKT9mdW5jdGlvbihlLHQscixuKXt2YXIgaT1vLHM9bityO2VePS0xO2Zvcih2YXIgYT1uO2E8czthKyspZT1lPj4+OF5pWzI1NSYoZV50W2FdKV07cmV0dXJuLTFeZX0oMHx0LGUsZS5sZW5ndGgsMCk6ZnVuY3Rpb24oZSx0LHIsbil7dmFyIGk9byxzPW4rcjtlXj0tMTtmb3IodmFyIGE9bjthPHM7YSsrKWU9ZT4+PjheaVsyNTUmKGVedC5jaGFyQ29kZUF0KGEpKV07cmV0dXJuLTFeZX0oMHx0LGUsZS5sZW5ndGgsMCk6MH19LHtcIi4vdXRpbHNcIjozMn1dLDU6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtyLmJhc2U2ND0hMSxyLmJpbmFyeT0hMSxyLmRpcj0hMSxyLmNyZWF0ZUZvbGRlcnM9ITAsci5kYXRlPW51bGwsci5jb21wcmVzc2lvbj1udWxsLHIuY29tcHJlc3Npb25PcHRpb25zPW51bGwsci5jb21tZW50PW51bGwsci51bml4UGVybWlzc2lvbnM9bnVsbCxyLmRvc1Blcm1pc3Npb25zPW51bGx9LHt9XSw2OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49bnVsbDtuPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBQcm9taXNlP1Byb21pc2U6ZShcImxpZVwiKSx0LmV4cG9ydHM9e1Byb21pc2U6bn19LHtsaWU6Mzd9XSw3OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQ4QXJyYXkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBVaW50MTZBcnJheSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQzMkFycmF5LGk9ZShcInBha29cIikscz1lKFwiLi91dGlsc1wiKSxhPWUoXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCIpLG89bj9cInVpbnQ4YXJyYXlcIjpcImFycmF5XCI7ZnVuY3Rpb24gaChlLHQpe2EuY2FsbCh0aGlzLFwiRmxhdGVXb3JrZXIvXCIrZSksdGhpcy5fcGFrbz1udWxsLHRoaXMuX3Bha29BY3Rpb249ZSx0aGlzLl9wYWtvT3B0aW9ucz10LHRoaXMubWV0YT17fX1yLm1hZ2ljPVwiXFxiXFwwXCIscy5pbmhlcml0cyhoLGEpLGgucHJvdG90eXBlLnByb2Nlc3NDaHVuaz1mdW5jdGlvbihlKXt0aGlzLm1ldGE9ZS5tZXRhLG51bGw9PT10aGlzLl9wYWtvJiZ0aGlzLl9jcmVhdGVQYWtvKCksdGhpcy5fcGFrby5wdXNoKHMudHJhbnNmb3JtVG8obyxlLmRhdGEpLCExKX0saC5wcm90b3R5cGUuZmx1c2g9ZnVuY3Rpb24oKXthLnByb3RvdHlwZS5mbHVzaC5jYWxsKHRoaXMpLG51bGw9PT10aGlzLl9wYWtvJiZ0aGlzLl9jcmVhdGVQYWtvKCksdGhpcy5fcGFrby5wdXNoKFtdLCEwKX0saC5wcm90b3R5cGUuY2xlYW5VcD1mdW5jdGlvbigpe2EucHJvdG90eXBlLmNsZWFuVXAuY2FsbCh0aGlzKSx0aGlzLl9wYWtvPW51bGx9LGgucHJvdG90eXBlLl9jcmVhdGVQYWtvPWZ1bmN0aW9uKCl7dGhpcy5fcGFrbz1uZXcgaVt0aGlzLl9wYWtvQWN0aW9uXSh7cmF3OiEwLGxldmVsOnRoaXMuX3Bha29PcHRpb25zLmxldmVsfHwtMX0pO3ZhciB0PXRoaXM7dGhpcy5fcGFrby5vbkRhdGE9ZnVuY3Rpb24oZSl7dC5wdXNoKHtkYXRhOmUsbWV0YTp0Lm1ldGF9KX19LHIuY29tcHJlc3NXb3JrZXI9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBoKFwiRGVmbGF0ZVwiLGUpfSxyLnVuY29tcHJlc3NXb3JrZXI9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGgoXCJJbmZsYXRlXCIse30pfX0se1wiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4LFwiLi91dGlsc1wiOjMyLHBha286Mzh9XSw4OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gQShlLHQpe3ZhciByLG49XCJcIjtmb3Iocj0wO3I8dDtyKyspbis9U3RyaW5nLmZyb21DaGFyQ29kZSgyNTUmZSksZT4+Pj04O3JldHVybiBufWZ1bmN0aW9uIG4oZSx0LHIsbixpLHMpe3ZhciBhLG8saD1lLmZpbGUsdT1lLmNvbXByZXNzaW9uLGw9cyE9PU8udXRmOGVuY29kZSxmPUkudHJhbnNmb3JtVG8oXCJzdHJpbmdcIixzKGgubmFtZSkpLGM9SS50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLE8udXRmOGVuY29kZShoLm5hbWUpKSxkPWguY29tbWVudCxwPUkudHJhbnNmb3JtVG8oXCJzdHJpbmdcIixzKGQpKSxtPUkudHJhbnNmb3JtVG8oXCJzdHJpbmdcIixPLnV0ZjhlbmNvZGUoZCkpLF89Yy5sZW5ndGghPT1oLm5hbWUubGVuZ3RoLGc9bS5sZW5ndGghPT1kLmxlbmd0aCxiPVwiXCIsdj1cIlwiLHk9XCJcIix3PWguZGlyLGs9aC5kYXRlLHg9e2NyYzMyOjAsY29tcHJlc3NlZFNpemU6MCx1bmNvbXByZXNzZWRTaXplOjB9O3QmJiFyfHwoeC5jcmMzMj1lLmNyYzMyLHguY29tcHJlc3NlZFNpemU9ZS5jb21wcmVzc2VkU2l6ZSx4LnVuY29tcHJlc3NlZFNpemU9ZS51bmNvbXByZXNzZWRTaXplKTt2YXIgUz0wO3QmJihTfD04KSxsfHwhXyYmIWd8fChTfD0yMDQ4KTt2YXIgej0wLEM9MDt3JiYoenw9MTYpLFwiVU5JWFwiPT09aT8oQz03OTgsenw9ZnVuY3Rpb24oZSx0KXt2YXIgcj1lO3JldHVybiBlfHwocj10PzE2ODkzOjMzMjA0KSwoNjU1MzUmcik8PDE2fShoLnVuaXhQZXJtaXNzaW9ucyx3KSk6KEM9MjAsenw9ZnVuY3Rpb24oZSl7cmV0dXJuIDYzJihlfHwwKX0oaC5kb3NQZXJtaXNzaW9ucykpLGE9ay5nZXRVVENIb3VycygpLGE8PD02LGF8PWsuZ2V0VVRDTWludXRlcygpLGE8PD01LGF8PWsuZ2V0VVRDU2Vjb25kcygpLzIsbz1rLmdldFVUQ0Z1bGxZZWFyKCktMTk4MCxvPDw9NCxvfD1rLmdldFVUQ01vbnRoKCkrMSxvPDw9NSxvfD1rLmdldFVUQ0RhdGUoKSxfJiYodj1BKDEsMSkrQShCKGYpLDQpK2MsYis9XCJ1cFwiK0Eodi5sZW5ndGgsMikrdiksZyYmKHk9QSgxLDEpK0EoQihwKSw0KSttLGIrPVwidWNcIitBKHkubGVuZ3RoLDIpK3kpO3ZhciBFPVwiXCI7cmV0dXJuIEUrPVwiXFxuXFwwXCIsRSs9QShTLDIpLEUrPXUubWFnaWMsRSs9QShhLDIpLEUrPUEobywyKSxFKz1BKHguY3JjMzIsNCksRSs9QSh4LmNvbXByZXNzZWRTaXplLDQpLEUrPUEoeC51bmNvbXByZXNzZWRTaXplLDQpLEUrPUEoZi5sZW5ndGgsMiksRSs9QShiLmxlbmd0aCwyKSx7ZmlsZVJlY29yZDpSLkxPQ0FMX0ZJTEVfSEVBREVSK0UrZitiLGRpclJlY29yZDpSLkNFTlRSQUxfRklMRV9IRUFERVIrQShDLDIpK0UrQShwLmxlbmd0aCwyKStcIlxcMFxcMFxcMFxcMFwiK0Eoeiw0KStBKG4sNCkrZitiK3B9fXZhciBJPWUoXCIuLi91dGlsc1wiKSxpPWUoXCIuLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiKSxPPWUoXCIuLi91dGY4XCIpLEI9ZShcIi4uL2NyYzMyXCIpLFI9ZShcIi4uL3NpZ25hdHVyZVwiKTtmdW5jdGlvbiBzKGUsdCxyLG4pe2kuY2FsbCh0aGlzLFwiWmlwRmlsZVdvcmtlclwiKSx0aGlzLmJ5dGVzV3JpdHRlbj0wLHRoaXMuemlwQ29tbWVudD10LHRoaXMuemlwUGxhdGZvcm09cix0aGlzLmVuY29kZUZpbGVOYW1lPW4sdGhpcy5zdHJlYW1GaWxlcz1lLHRoaXMuYWNjdW11bGF0ZT0hMSx0aGlzLmNvbnRlbnRCdWZmZXI9W10sdGhpcy5kaXJSZWNvcmRzPVtdLHRoaXMuY3VycmVudFNvdXJjZU9mZnNldD0wLHRoaXMuZW50cmllc0NvdW50PTAsdGhpcy5jdXJyZW50RmlsZT1udWxsLHRoaXMuX3NvdXJjZXM9W119SS5pbmhlcml0cyhzLGkpLHMucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5tZXRhLnBlcmNlbnR8fDAscj10aGlzLmVudHJpZXNDb3VudCxuPXRoaXMuX3NvdXJjZXMubGVuZ3RoO3RoaXMuYWNjdW11bGF0ZT90aGlzLmNvbnRlbnRCdWZmZXIucHVzaChlKToodGhpcy5ieXRlc1dyaXR0ZW4rPWUuZGF0YS5sZW5ndGgsaS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMse2RhdGE6ZS5kYXRhLG1ldGE6e2N1cnJlbnRGaWxlOnRoaXMuY3VycmVudEZpbGUscGVyY2VudDpyPyh0KzEwMCooci1uLTEpKS9yOjEwMH19KSl9LHMucHJvdG90eXBlLm9wZW5lZFNvdXJjZT1mdW5jdGlvbihlKXt0aGlzLmN1cnJlbnRTb3VyY2VPZmZzZXQ9dGhpcy5ieXRlc1dyaXR0ZW4sdGhpcy5jdXJyZW50RmlsZT1lLmZpbGUubmFtZTt2YXIgdD10aGlzLnN0cmVhbUZpbGVzJiYhZS5maWxlLmRpcjtpZih0KXt2YXIgcj1uKGUsdCwhMSx0aGlzLmN1cnJlbnRTb3VyY2VPZmZzZXQsdGhpcy56aXBQbGF0Zm9ybSx0aGlzLmVuY29kZUZpbGVOYW1lKTt0aGlzLnB1c2goe2RhdGE6ci5maWxlUmVjb3JkLG1ldGE6e3BlcmNlbnQ6MH19KX1lbHNlIHRoaXMuYWNjdW11bGF0ZT0hMH0scy5wcm90b3R5cGUuY2xvc2VkU291cmNlPWZ1bmN0aW9uKGUpe3RoaXMuYWNjdW11bGF0ZT0hMTt2YXIgdD10aGlzLnN0cmVhbUZpbGVzJiYhZS5maWxlLmRpcixyPW4oZSx0LCEwLHRoaXMuY3VycmVudFNvdXJjZU9mZnNldCx0aGlzLnppcFBsYXRmb3JtLHRoaXMuZW5jb2RlRmlsZU5hbWUpO2lmKHRoaXMuZGlyUmVjb3Jkcy5wdXNoKHIuZGlyUmVjb3JkKSx0KXRoaXMucHVzaCh7ZGF0YTpmdW5jdGlvbihlKXtyZXR1cm4gUi5EQVRBX0RFU0NSSVBUT1IrQShlLmNyYzMyLDQpK0EoZS5jb21wcmVzc2VkU2l6ZSw0KStBKGUudW5jb21wcmVzc2VkU2l6ZSw0KX0oZSksbWV0YTp7cGVyY2VudDoxMDB9fSk7ZWxzZSBmb3IodGhpcy5wdXNoKHtkYXRhOnIuZmlsZVJlY29yZCxtZXRhOntwZXJjZW50OjB9fSk7dGhpcy5jb250ZW50QnVmZmVyLmxlbmd0aDspdGhpcy5wdXNoKHRoaXMuY29udGVudEJ1ZmZlci5zaGlmdCgpKTt0aGlzLmN1cnJlbnRGaWxlPW51bGx9LHMucHJvdG90eXBlLmZsdXNoPWZ1bmN0aW9uKCl7Zm9yKHZhciBlPXRoaXMuYnl0ZXNXcml0dGVuLHQ9MDt0PHRoaXMuZGlyUmVjb3Jkcy5sZW5ndGg7dCsrKXRoaXMucHVzaCh7ZGF0YTp0aGlzLmRpclJlY29yZHNbdF0sbWV0YTp7cGVyY2VudDoxMDB9fSk7dmFyIHI9dGhpcy5ieXRlc1dyaXR0ZW4tZSxuPWZ1bmN0aW9uKGUsdCxyLG4saSl7dmFyIHM9SS50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLGkobikpO3JldHVybiBSLkNFTlRSQUxfRElSRUNUT1JZX0VORCtcIlxcMFxcMFxcMFxcMFwiK0EoZSwyKStBKGUsMikrQSh0LDQpK0Eociw0KStBKHMubGVuZ3RoLDIpK3N9KHRoaXMuZGlyUmVjb3Jkcy5sZW5ndGgscixlLHRoaXMuemlwQ29tbWVudCx0aGlzLmVuY29kZUZpbGVOYW1lKTt0aGlzLnB1c2goe2RhdGE6bixtZXRhOntwZXJjZW50OjEwMH19KX0scy5wcm90b3R5cGUucHJlcGFyZU5leHRTb3VyY2U9ZnVuY3Rpb24oKXt0aGlzLnByZXZpb3VzPXRoaXMuX3NvdXJjZXMuc2hpZnQoKSx0aGlzLm9wZW5lZFNvdXJjZSh0aGlzLnByZXZpb3VzLnN0cmVhbUluZm8pLHRoaXMuaXNQYXVzZWQ/dGhpcy5wcmV2aW91cy5wYXVzZSgpOnRoaXMucHJldmlvdXMucmVzdW1lKCl9LHMucHJvdG90eXBlLnJlZ2lzdGVyUHJldmlvdXM9ZnVuY3Rpb24oZSl7dGhpcy5fc291cmNlcy5wdXNoKGUpO3ZhciB0PXRoaXM7cmV0dXJuIGUub24oXCJkYXRhXCIsZnVuY3Rpb24oZSl7dC5wcm9jZXNzQ2h1bmsoZSl9KSxlLm9uKFwiZW5kXCIsZnVuY3Rpb24oKXt0LmNsb3NlZFNvdXJjZSh0LnByZXZpb3VzLnN0cmVhbUluZm8pLHQuX3NvdXJjZXMubGVuZ3RoP3QucHJlcGFyZU5leHRTb3VyY2UoKTp0LmVuZCgpfSksZS5vbihcImVycm9yXCIsZnVuY3Rpb24oZSl7dC5lcnJvcihlKX0pLHRoaXN9LHMucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbigpe3JldHVybiEhaS5wcm90b3R5cGUucmVzdW1lLmNhbGwodGhpcykmJighdGhpcy5wcmV2aW91cyYmdGhpcy5fc291cmNlcy5sZW5ndGg/KHRoaXMucHJlcGFyZU5leHRTb3VyY2UoKSwhMCk6dGhpcy5wcmV2aW91c3x8dGhpcy5fc291cmNlcy5sZW5ndGh8fHRoaXMuZ2VuZXJhdGVkRXJyb3I/dm9pZCAwOih0aGlzLmVuZCgpLCEwKSl9LHMucHJvdG90eXBlLmVycm9yPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX3NvdXJjZXM7aWYoIWkucHJvdG90eXBlLmVycm9yLmNhbGwodGhpcyxlKSlyZXR1cm4hMTtmb3IodmFyIHI9MDtyPHQubGVuZ3RoO3IrKyl0cnl7dFtyXS5lcnJvcihlKX1jYXRjaChlKXt9cmV0dXJuITB9LHMucHJvdG90eXBlLmxvY2s9ZnVuY3Rpb24oKXtpLnByb3RvdHlwZS5sb2NrLmNhbGwodGhpcyk7Zm9yKHZhciBlPXRoaXMuX3NvdXJjZXMsdD0wO3Q8ZS5sZW5ndGg7dCsrKWVbdF0ubG9jaygpfSx0LmV4cG9ydHM9c30se1wiLi4vY3JjMzJcIjo0LFwiLi4vc2lnbmF0dXJlXCI6MjMsXCIuLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4LFwiLi4vdXRmOFwiOjMxLFwiLi4vdXRpbHNcIjozMn1dLDk6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgdT1lKFwiLi4vY29tcHJlc3Npb25zXCIpLG49ZShcIi4vWmlwRmlsZVdvcmtlclwiKTtyLmdlbmVyYXRlV29ya2VyPWZ1bmN0aW9uKGUsYSx0KXt2YXIgbz1uZXcgbihhLnN0cmVhbUZpbGVzLHQsYS5wbGF0Zm9ybSxhLmVuY29kZUZpbGVOYW1lKSxoPTA7dHJ5e2UuZm9yRWFjaChmdW5jdGlvbihlLHQpe2grKzt2YXIgcj1mdW5jdGlvbihlLHQpe3ZhciByPWV8fHQsbj11W3JdO2lmKCFuKXRocm93IG5ldyBFcnJvcihyK1wiIGlzIG5vdCBhIHZhbGlkIGNvbXByZXNzaW9uIG1ldGhvZCAhXCIpO3JldHVybiBufSh0Lm9wdGlvbnMuY29tcHJlc3Npb24sYS5jb21wcmVzc2lvbiksbj10Lm9wdGlvbnMuY29tcHJlc3Npb25PcHRpb25zfHxhLmNvbXByZXNzaW9uT3B0aW9uc3x8e30saT10LmRpcixzPXQuZGF0ZTt0Ll9jb21wcmVzc1dvcmtlcihyLG4pLndpdGhTdHJlYW1JbmZvKFwiZmlsZVwiLHtuYW1lOmUsZGlyOmksZGF0ZTpzLGNvbW1lbnQ6dC5jb21tZW50fHxcIlwiLHVuaXhQZXJtaXNzaW9uczp0LnVuaXhQZXJtaXNzaW9ucyxkb3NQZXJtaXNzaW9uczp0LmRvc1Blcm1pc3Npb25zfSkucGlwZShvKX0pLG8uZW50cmllc0NvdW50PWh9Y2F0Y2goZSl7by5lcnJvcihlKX1yZXR1cm4gb319LHtcIi4uL2NvbXByZXNzaW9uc1wiOjMsXCIuL1ppcEZpbGVXb3JrZXJcIjo4fV0sMTA6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKCl7aWYoISh0aGlzIGluc3RhbmNlb2YgbikpcmV0dXJuIG5ldyBuO2lmKGFyZ3VtZW50cy5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiVGhlIGNvbnN0cnVjdG9yIHdpdGggcGFyYW1ldGVycyBoYXMgYmVlbiByZW1vdmVkIGluIEpTWmlwIDMuMCwgcGxlYXNlIGNoZWNrIHRoZSB1cGdyYWRlIGd1aWRlLlwiKTt0aGlzLmZpbGVzPU9iamVjdC5jcmVhdGUobnVsbCksdGhpcy5jb21tZW50PW51bGwsdGhpcy5yb290PVwiXCIsdGhpcy5jbG9uZT1mdW5jdGlvbigpe3ZhciBlPW5ldyBuO2Zvcih2YXIgdCBpbiB0aGlzKVwiZnVuY3Rpb25cIiE9dHlwZW9mIHRoaXNbdF0mJihlW3RdPXRoaXNbdF0pO3JldHVybiBlfX0obi5wcm90b3R5cGU9ZShcIi4vb2JqZWN0XCIpKS5sb2FkQXN5bmM9ZShcIi4vbG9hZFwiKSxuLnN1cHBvcnQ9ZShcIi4vc3VwcG9ydFwiKSxuLmRlZmF1bHRzPWUoXCIuL2RlZmF1bHRzXCIpLG4udmVyc2lvbj1cIjMuMTAuMVwiLG4ubG9hZEFzeW5jPWZ1bmN0aW9uKGUsdCl7cmV0dXJuKG5ldyBuKS5sb2FkQXN5bmMoZSx0KX0sbi5leHRlcm5hbD1lKFwiLi9leHRlcm5hbFwiKSx0LmV4cG9ydHM9bn0se1wiLi9kZWZhdWx0c1wiOjUsXCIuL2V4dGVybmFsXCI6NixcIi4vbG9hZFwiOjExLFwiLi9vYmplY3RcIjoxNSxcIi4vc3VwcG9ydFwiOjMwfV0sMTE6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgdT1lKFwiLi91dGlsc1wiKSxpPWUoXCIuL2V4dGVybmFsXCIpLG49ZShcIi4vdXRmOFwiKSxzPWUoXCIuL3ppcEVudHJpZXNcIiksYT1lKFwiLi9zdHJlYW0vQ3JjMzJQcm9iZVwiKSxsPWUoXCIuL25vZGVqc1V0aWxzXCIpO2Z1bmN0aW9uIGYobil7cmV0dXJuIG5ldyBpLlByb21pc2UoZnVuY3Rpb24oZSx0KXt2YXIgcj1uLmRlY29tcHJlc3NlZC5nZXRDb250ZW50V29ya2VyKCkucGlwZShuZXcgYSk7ci5vbihcImVycm9yXCIsZnVuY3Rpb24oZSl7dChlKX0pLm9uKFwiZW5kXCIsZnVuY3Rpb24oKXtyLnN0cmVhbUluZm8uY3JjMzIhPT1uLmRlY29tcHJlc3NlZC5jcmMzMj90KG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXAgOiBDUkMzMiBtaXNtYXRjaFwiKSk6ZSgpfSkucmVzdW1lKCl9KX10LmV4cG9ydHM9ZnVuY3Rpb24oZSxvKXt2YXIgaD10aGlzO3JldHVybiBvPXUuZXh0ZW5kKG98fHt9LHtiYXNlNjQ6ITEsY2hlY2tDUkMzMjohMSxvcHRpbWl6ZWRCaW5hcnlTdHJpbmc6ITEsY3JlYXRlRm9sZGVyczohMSxkZWNvZGVGaWxlTmFtZTpuLnV0ZjhkZWNvZGV9KSxsLmlzTm9kZSYmbC5pc1N0cmVhbShlKT9pLlByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkpTWmlwIGNhbid0IGFjY2VwdCBhIHN0cmVhbSB3aGVuIGxvYWRpbmcgYSB6aXAgZmlsZS5cIikpOnUucHJlcGFyZUNvbnRlbnQoXCJ0aGUgbG9hZGVkIHppcCBmaWxlXCIsZSwhMCxvLm9wdGltaXplZEJpbmFyeVN0cmluZyxvLmJhc2U2NCkudGhlbihmdW5jdGlvbihlKXt2YXIgdD1uZXcgcyhvKTtyZXR1cm4gdC5sb2FkKGUpLHR9KS50aGVuKGZ1bmN0aW9uKGUpe3ZhciB0PVtpLlByb21pc2UucmVzb2x2ZShlKV0scj1lLmZpbGVzO2lmKG8uY2hlY2tDUkMzMilmb3IodmFyIG49MDtuPHIubGVuZ3RoO24rKyl0LnB1c2goZihyW25dKSk7cmV0dXJuIGkuUHJvbWlzZS5hbGwodCl9KS50aGVuKGZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLnNoaWZ0KCkscj10LmZpbGVzLG49MDtuPHIubGVuZ3RoO24rKyl7dmFyIGk9cltuXSxzPWkuZmlsZU5hbWVTdHIsYT11LnJlc29sdmUoaS5maWxlTmFtZVN0cik7aC5maWxlKGEsaS5kZWNvbXByZXNzZWQse2JpbmFyeTohMCxvcHRpbWl6ZWRCaW5hcnlTdHJpbmc6ITAsZGF0ZTppLmRhdGUsZGlyOmkuZGlyLGNvbW1lbnQ6aS5maWxlQ29tbWVudFN0ci5sZW5ndGg/aS5maWxlQ29tbWVudFN0cjpudWxsLHVuaXhQZXJtaXNzaW9uczppLnVuaXhQZXJtaXNzaW9ucyxkb3NQZXJtaXNzaW9uczppLmRvc1Blcm1pc3Npb25zLGNyZWF0ZUZvbGRlcnM6by5jcmVhdGVGb2xkZXJzfSksaS5kaXJ8fChoLmZpbGUoYSkudW5zYWZlT3JpZ2luYWxOYW1lPXMpfXJldHVybiB0LnppcENvbW1lbnQubGVuZ3RoJiYoaC5jb21tZW50PXQuemlwQ29tbWVudCksaH0pfX0se1wiLi9leHRlcm5hbFwiOjYsXCIuL25vZGVqc1V0aWxzXCI6MTQsXCIuL3N0cmVhbS9DcmMzMlByb2JlXCI6MjUsXCIuL3V0ZjhcIjozMSxcIi4vdXRpbHNcIjozMixcIi4vemlwRW50cmllc1wiOjMzfV0sMTI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIik7ZnVuY3Rpb24gcyhlLHQpe2kuY2FsbCh0aGlzLFwiTm9kZWpzIHN0cmVhbSBpbnB1dCBhZGFwdGVyIGZvciBcIitlKSx0aGlzLl91cHN0cmVhbUVuZGVkPSExLHRoaXMuX2JpbmRTdHJlYW0odCl9bi5pbmhlcml0cyhzLGkpLHMucHJvdG90eXBlLl9iaW5kU3RyZWFtPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXM7KHRoaXMuX3N0cmVhbT1lKS5wYXVzZSgpLGUub24oXCJkYXRhXCIsZnVuY3Rpb24oZSl7dC5wdXNoKHtkYXRhOmUsbWV0YTp7cGVyY2VudDowfX0pfSkub24oXCJlcnJvclwiLGZ1bmN0aW9uKGUpe3QuaXNQYXVzZWQ/dGhpcy5nZW5lcmF0ZWRFcnJvcj1lOnQuZXJyb3IoZSl9KS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7dC5pc1BhdXNlZD90Ll91cHN0cmVhbUVuZGVkPSEwOnQuZW5kKCl9KX0scy5wcm90b3R5cGUucGF1c2U9ZnVuY3Rpb24oKXtyZXR1cm4hIWkucHJvdG90eXBlLnBhdXNlLmNhbGwodGhpcykmJih0aGlzLl9zdHJlYW0ucGF1c2UoKSwhMCl9LHMucHJvdG90eXBlLnJlc3VtZT1mdW5jdGlvbigpe3JldHVybiEhaS5wcm90b3R5cGUucmVzdW1lLmNhbGwodGhpcykmJih0aGlzLl91cHN0cmVhbUVuZGVkP3RoaXMuZW5kKCk6dGhpcy5fc3RyZWFtLnJlc3VtZSgpLCEwKX0sdC5leHBvcnRzPXN9LHtcIi4uL3N0cmVhbS9HZW5lcmljV29ya2VyXCI6MjgsXCIuLi91dGlsc1wiOjMyfV0sMTM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaT1lKFwicmVhZGFibGUtc3RyZWFtXCIpLlJlYWRhYmxlO2Z1bmN0aW9uIG4oZSx0LHIpe2kuY2FsbCh0aGlzLHQpLHRoaXMuX2hlbHBlcj1lO3ZhciBuPXRoaXM7ZS5vbihcImRhdGFcIixmdW5jdGlvbihlLHQpe24ucHVzaChlKXx8bi5faGVscGVyLnBhdXNlKCksciYmcih0KX0pLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlKXtuLmVtaXQoXCJlcnJvclwiLGUpfSkub24oXCJlbmRcIixmdW5jdGlvbigpe24ucHVzaChudWxsKX0pfWUoXCIuLi91dGlsc1wiKS5pbmhlcml0cyhuLGkpLG4ucHJvdG90eXBlLl9yZWFkPWZ1bmN0aW9uKCl7dGhpcy5faGVscGVyLnJlc3VtZSgpfSx0LmV4cG9ydHM9bn0se1wiLi4vdXRpbHNcIjozMixcInJlYWRhYmxlLXN0cmVhbVwiOjE2fV0sMTQ6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9e2lzTm9kZTpcInVuZGVmaW5lZFwiIT10eXBlb2YgQnVmZmVyLG5ld0J1ZmZlckZyb206ZnVuY3Rpb24oZSx0KXtpZihCdWZmZXIuZnJvbSYmQnVmZmVyLmZyb20hPT1VaW50OEFycmF5LmZyb20pcmV0dXJuIEJ1ZmZlci5mcm9tKGUsdCk7aWYoXCJudW1iZXJcIj09dHlwZW9mIGUpdGhyb3cgbmV3IEVycm9yKCdUaGUgXCJkYXRhXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKTtyZXR1cm4gbmV3IEJ1ZmZlcihlLHQpfSxhbGxvY0J1ZmZlcjpmdW5jdGlvbihlKXtpZihCdWZmZXIuYWxsb2MpcmV0dXJuIEJ1ZmZlci5hbGxvYyhlKTt2YXIgdD1uZXcgQnVmZmVyKGUpO3JldHVybiB0LmZpbGwoMCksdH0saXNCdWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIEJ1ZmZlci5pc0J1ZmZlcihlKX0saXNTdHJlYW06ZnVuY3Rpb24oZSl7cmV0dXJuIGUmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGUub24mJlwiZnVuY3Rpb25cIj09dHlwZW9mIGUucGF1c2UmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGUucmVzdW1lfX19LHt9XSwxNTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHMoZSx0LHIpe3ZhciBuLGk9dS5nZXRUeXBlT2YodCkscz11LmV4dGVuZChyfHx7fSxmKTtzLmRhdGU9cy5kYXRlfHxuZXcgRGF0ZSxudWxsIT09cy5jb21wcmVzc2lvbiYmKHMuY29tcHJlc3Npb249cy5jb21wcmVzc2lvbi50b1VwcGVyQ2FzZSgpKSxcInN0cmluZ1wiPT10eXBlb2Ygcy51bml4UGVybWlzc2lvbnMmJihzLnVuaXhQZXJtaXNzaW9ucz1wYXJzZUludChzLnVuaXhQZXJtaXNzaW9ucyw4KSkscy51bml4UGVybWlzc2lvbnMmJjE2Mzg0JnMudW5peFBlcm1pc3Npb25zJiYocy5kaXI9ITApLHMuZG9zUGVybWlzc2lvbnMmJjE2JnMuZG9zUGVybWlzc2lvbnMmJihzLmRpcj0hMCkscy5kaXImJihlPWcoZSkpLHMuY3JlYXRlRm9sZGVycyYmKG49XyhlKSkmJmIuY2FsbCh0aGlzLG4sITApO3ZhciBhPVwic3RyaW5nXCI9PT1pJiYhMT09PXMuYmluYXJ5JiYhMT09PXMuYmFzZTY0O3ImJnZvaWQgMCE9PXIuYmluYXJ5fHwocy5iaW5hcnk9IWEpLCh0IGluc3RhbmNlb2YgYyYmMD09PXQudW5jb21wcmVzc2VkU2l6ZXx8cy5kaXJ8fCF0fHwwPT09dC5sZW5ndGgpJiYocy5iYXNlNjQ9ITEscy5iaW5hcnk9ITAsdD1cIlwiLHMuY29tcHJlc3Npb249XCJTVE9SRVwiLGk9XCJzdHJpbmdcIik7dmFyIG89bnVsbDtvPXQgaW5zdGFuY2VvZiBjfHx0IGluc3RhbmNlb2YgbD90OnAuaXNOb2RlJiZwLmlzU3RyZWFtKHQpP25ldyBtKGUsdCk6dS5wcmVwYXJlQ29udGVudChlLHQscy5iaW5hcnkscy5vcHRpbWl6ZWRCaW5hcnlTdHJpbmcscy5iYXNlNjQpO3ZhciBoPW5ldyBkKGUsbyxzKTt0aGlzLmZpbGVzW2VdPWh9dmFyIGk9ZShcIi4vdXRmOFwiKSx1PWUoXCIuL3V0aWxzXCIpLGw9ZShcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIiksYT1lKFwiLi9zdHJlYW0vU3RyZWFtSGVscGVyXCIpLGY9ZShcIi4vZGVmYXVsdHNcIiksYz1lKFwiLi9jb21wcmVzc2VkT2JqZWN0XCIpLGQ9ZShcIi4vemlwT2JqZWN0XCIpLG89ZShcIi4vZ2VuZXJhdGVcIikscD1lKFwiLi9ub2RlanNVdGlsc1wiKSxtPWUoXCIuL25vZGVqcy9Ob2RlanNTdHJlYW1JbnB1dEFkYXB0ZXJcIiksXz1mdW5jdGlvbihlKXtcIi9cIj09PWUuc2xpY2UoLTEpJiYoZT1lLnN1YnN0cmluZygwLGUubGVuZ3RoLTEpKTt2YXIgdD1lLmxhc3RJbmRleE9mKFwiL1wiKTtyZXR1cm4gMDx0P2Uuc3Vic3RyaW5nKDAsdCk6XCJcIn0sZz1mdW5jdGlvbihlKXtyZXR1cm5cIi9cIiE9PWUuc2xpY2UoLTEpJiYoZSs9XCIvXCIpLGV9LGI9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdD12b2lkIDAhPT10P3Q6Zi5jcmVhdGVGb2xkZXJzLGU9ZyhlKSx0aGlzLmZpbGVzW2VdfHxzLmNhbGwodGhpcyxlLG51bGwse2RpcjohMCxjcmVhdGVGb2xkZXJzOnR9KSx0aGlzLmZpbGVzW2VdfTtmdW5jdGlvbiBoKGUpe3JldHVyblwiW29iamVjdCBSZWdFeHBdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSl9dmFyIG49e2xvYWQ6ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBoYXMgYmVlbiByZW1vdmVkIGluIEpTWmlwIDMuMCwgcGxlYXNlIGNoZWNrIHRoZSB1cGdyYWRlIGd1aWRlLlwiKX0sZm9yRWFjaDpmdW5jdGlvbihlKXt2YXIgdCxyLG47Zm9yKHQgaW4gdGhpcy5maWxlcyluPXRoaXMuZmlsZXNbdF0sKHI9dC5zbGljZSh0aGlzLnJvb3QubGVuZ3RoLHQubGVuZ3RoKSkmJnQuc2xpY2UoMCx0aGlzLnJvb3QubGVuZ3RoKT09PXRoaXMucm9vdCYmZShyLG4pfSxmaWx0ZXI6ZnVuY3Rpb24ocil7dmFyIG49W107cmV0dXJuIHRoaXMuZm9yRWFjaChmdW5jdGlvbihlLHQpe3IoZSx0KSYmbi5wdXNoKHQpfSksbn0sZmlsZTpmdW5jdGlvbihlLHQscil7aWYoMSE9PWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIGU9dGhpcy5yb290K2Uscy5jYWxsKHRoaXMsZSx0LHIpLHRoaXM7aWYoaChlKSl7dmFyIG49ZTtyZXR1cm4gdGhpcy5maWx0ZXIoZnVuY3Rpb24oZSx0KXtyZXR1cm4hdC5kaXImJm4udGVzdChlKX0pfXZhciBpPXRoaXMuZmlsZXNbdGhpcy5yb290K2VdO3JldHVybiBpJiYhaS5kaXI/aTpudWxsfSxmb2xkZXI6ZnVuY3Rpb24ocil7aWYoIXIpcmV0dXJuIHRoaXM7aWYoaChyKSlyZXR1cm4gdGhpcy5maWx0ZXIoZnVuY3Rpb24oZSx0KXtyZXR1cm4gdC5kaXImJnIudGVzdChlKX0pO3ZhciBlPXRoaXMucm9vdCtyLHQ9Yi5jYWxsKHRoaXMsZSksbj10aGlzLmNsb25lKCk7cmV0dXJuIG4ucm9vdD10Lm5hbWUsbn0scmVtb3ZlOmZ1bmN0aW9uKHIpe3I9dGhpcy5yb290K3I7dmFyIGU9dGhpcy5maWxlc1tyXTtpZihlfHwoXCIvXCIhPT1yLnNsaWNlKC0xKSYmKHIrPVwiL1wiKSxlPXRoaXMuZmlsZXNbcl0pLGUmJiFlLmRpcilkZWxldGUgdGhpcy5maWxlc1tyXTtlbHNlIGZvcih2YXIgdD10aGlzLmZpbHRlcihmdW5jdGlvbihlLHQpe3JldHVybiB0Lm5hbWUuc2xpY2UoMCxyLmxlbmd0aCk9PT1yfSksbj0wO248dC5sZW5ndGg7bisrKWRlbGV0ZSB0aGlzLmZpbGVzW3Rbbl0ubmFtZV07cmV0dXJuIHRoaXN9LGdlbmVyYXRlOmZ1bmN0aW9uKCl7dGhyb3cgbmV3IEVycm9yKFwiVGhpcyBtZXRob2QgaGFzIGJlZW4gcmVtb3ZlZCBpbiBKU1ppcCAzLjAsIHBsZWFzZSBjaGVjayB0aGUgdXBncmFkZSBndWlkZS5cIil9LGdlbmVyYXRlSW50ZXJuYWxTdHJlYW06ZnVuY3Rpb24oZSl7dmFyIHQscj17fTt0cnl7aWYoKHI9dS5leHRlbmQoZXx8e30se3N0cmVhbUZpbGVzOiExLGNvbXByZXNzaW9uOlwiU1RPUkVcIixjb21wcmVzc2lvbk9wdGlvbnM6bnVsbCx0eXBlOlwiXCIscGxhdGZvcm06XCJET1NcIixjb21tZW50Om51bGwsbWltZVR5cGU6XCJhcHBsaWNhdGlvbi96aXBcIixlbmNvZGVGaWxlTmFtZTppLnV0ZjhlbmNvZGV9KSkudHlwZT1yLnR5cGUudG9Mb3dlckNhc2UoKSxyLmNvbXByZXNzaW9uPXIuY29tcHJlc3Npb24udG9VcHBlckNhc2UoKSxcImJpbmFyeXN0cmluZ1wiPT09ci50eXBlJiYoci50eXBlPVwic3RyaW5nXCIpLCFyLnR5cGUpdGhyb3cgbmV3IEVycm9yKFwiTm8gb3V0cHV0IHR5cGUgc3BlY2lmaWVkLlwiKTt1LmNoZWNrU3VwcG9ydChyLnR5cGUpLFwiZGFyd2luXCIhPT1yLnBsYXRmb3JtJiZcImZyZWVic2RcIiE9PXIucGxhdGZvcm0mJlwibGludXhcIiE9PXIucGxhdGZvcm0mJlwic3Vub3NcIiE9PXIucGxhdGZvcm18fChyLnBsYXRmb3JtPVwiVU5JWFwiKSxcIndpbjMyXCI9PT1yLnBsYXRmb3JtJiYoci5wbGF0Zm9ybT1cIkRPU1wiKTt2YXIgbj1yLmNvbW1lbnR8fHRoaXMuY29tbWVudHx8XCJcIjt0PW8uZ2VuZXJhdGVXb3JrZXIodGhpcyxyLG4pfWNhdGNoKGUpeyh0PW5ldyBsKFwiZXJyb3JcIikpLmVycm9yKGUpfXJldHVybiBuZXcgYSh0LHIudHlwZXx8XCJzdHJpbmdcIixyLm1pbWVUeXBlKX0sZ2VuZXJhdGVBc3luYzpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmdlbmVyYXRlSW50ZXJuYWxTdHJlYW0oZSkuYWNjdW11bGF0ZSh0KX0sZ2VuZXJhdGVOb2RlU3RyZWFtOmZ1bmN0aW9uKGUsdCl7cmV0dXJuKGU9ZXx8e30pLnR5cGV8fChlLnR5cGU9XCJub2RlYnVmZmVyXCIpLHRoaXMuZ2VuZXJhdGVJbnRlcm5hbFN0cmVhbShlKS50b05vZGVqc1N0cmVhbSh0KX19O3QuZXhwb3J0cz1ufSx7XCIuL2NvbXByZXNzZWRPYmplY3RcIjoyLFwiLi9kZWZhdWx0c1wiOjUsXCIuL2dlbmVyYXRlXCI6OSxcIi4vbm9kZWpzL05vZGVqc1N0cmVhbUlucHV0QWRhcHRlclwiOjEyLFwiLi9ub2RlanNVdGlsc1wiOjE0LFwiLi9zdHJlYW0vR2VuZXJpY1dvcmtlclwiOjI4LFwiLi9zdHJlYW0vU3RyZWFtSGVscGVyXCI6MjksXCIuL3V0ZjhcIjozMSxcIi4vdXRpbHNcIjozMixcIi4vemlwT2JqZWN0XCI6MzV9XSwxNjpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3QuZXhwb3J0cz1lKFwic3RyZWFtXCIpfSx7c3RyZWFtOnZvaWQgMH1dLDE3OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vRGF0YVJlYWRlclwiKTtmdW5jdGlvbiBpKGUpe24uY2FsbCh0aGlzLGUpO2Zvcih2YXIgdD0wO3Q8dGhpcy5kYXRhLmxlbmd0aDt0KyspZVt0XT0yNTUmZVt0XX1lKFwiLi4vdXRpbHNcIikuaW5oZXJpdHMoaSxuKSxpLnByb3RvdHlwZS5ieXRlQXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZGF0YVt0aGlzLnplcm8rZV19LGkucHJvdG90eXBlLmxhc3RJbmRleE9mU2lnbmF0dXJlPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLmNoYXJDb2RlQXQoMCkscj1lLmNoYXJDb2RlQXQoMSksbj1lLmNoYXJDb2RlQXQoMiksaT1lLmNoYXJDb2RlQXQoMykscz10aGlzLmxlbmd0aC00OzA8PXM7LS1zKWlmKHRoaXMuZGF0YVtzXT09PXQmJnRoaXMuZGF0YVtzKzFdPT09ciYmdGhpcy5kYXRhW3MrMl09PT1uJiZ0aGlzLmRhdGFbcyszXT09PWkpcmV0dXJuIHMtdGhpcy56ZXJvO3JldHVybi0xfSxpLnByb3RvdHlwZS5yZWFkQW5kQ2hlY2tTaWduYXR1cmU9ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5jaGFyQ29kZUF0KDApLHI9ZS5jaGFyQ29kZUF0KDEpLG49ZS5jaGFyQ29kZUF0KDIpLGk9ZS5jaGFyQ29kZUF0KDMpLHM9dGhpcy5yZWFkRGF0YSg0KTtyZXR1cm4gdD09PXNbMF0mJnI9PT1zWzFdJiZuPT09c1syXSYmaT09PXNbM119LGkucHJvdG90eXBlLnJlYWREYXRhPWZ1bmN0aW9uKGUpe2lmKHRoaXMuY2hlY2tPZmZzZXQoZSksMD09PWUpcmV0dXJuW107dmFyIHQ9dGhpcy5kYXRhLnNsaWNlKHRoaXMuemVybyt0aGlzLmluZGV4LHRoaXMuemVybyt0aGlzLmluZGV4K2UpO3JldHVybiB0aGlzLmluZGV4Kz1lLHR9LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9EYXRhUmVhZGVyXCI6MTh9XSwxODpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuLi91dGlsc1wiKTtmdW5jdGlvbiBpKGUpe3RoaXMuZGF0YT1lLHRoaXMubGVuZ3RoPWUubGVuZ3RoLHRoaXMuaW5kZXg9MCx0aGlzLnplcm89MH1pLnByb3RvdHlwZT17Y2hlY2tPZmZzZXQ6ZnVuY3Rpb24oZSl7dGhpcy5jaGVja0luZGV4KHRoaXMuaW5kZXgrZSl9LGNoZWNrSW5kZXg6ZnVuY3Rpb24oZSl7aWYodGhpcy5sZW5ndGg8dGhpcy56ZXJvK2V8fGU8MCl0aHJvdyBuZXcgRXJyb3IoXCJFbmQgb2YgZGF0YSByZWFjaGVkIChkYXRhIGxlbmd0aCA9IFwiK3RoaXMubGVuZ3RoK1wiLCBhc2tlZCBpbmRleCA9IFwiK2UrXCIpLiBDb3JydXB0ZWQgemlwID9cIil9LHNldEluZGV4OmZ1bmN0aW9uKGUpe3RoaXMuY2hlY2tJbmRleChlKSx0aGlzLmluZGV4PWV9LHNraXA6ZnVuY3Rpb24oZSl7dGhpcy5zZXRJbmRleCh0aGlzLmluZGV4K2UpfSxieXRlQXQ6ZnVuY3Rpb24oKXt9LHJlYWRJbnQ6ZnVuY3Rpb24oZSl7dmFyIHQscj0wO2Zvcih0aGlzLmNoZWNrT2Zmc2V0KGUpLHQ9dGhpcy5pbmRleCtlLTE7dD49dGhpcy5pbmRleDt0LS0pcj0ocjw8OCkrdGhpcy5ieXRlQXQodCk7cmV0dXJuIHRoaXMuaW5kZXgrPWUscn0scmVhZFN0cmluZzpmdW5jdGlvbihlKXtyZXR1cm4gbi50cmFuc2Zvcm1UbyhcInN0cmluZ1wiLHRoaXMucmVhZERhdGEoZSkpfSxyZWFkRGF0YTpmdW5jdGlvbigpe30sbGFzdEluZGV4T2ZTaWduYXR1cmU6ZnVuY3Rpb24oKXt9LHJlYWRBbmRDaGVja1NpZ25hdHVyZTpmdW5jdGlvbigpe30scmVhZERhdGU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnJlYWRJbnQoNCk7cmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDKDE5ODArKGU+PjI1JjEyNyksKGU+PjIxJjE1KS0xLGU+PjE2JjMxLGU+PjExJjMxLGU+PjUmNjMsKDMxJmUpPDwxKSl9fSx0LmV4cG9ydHM9aX0se1wiLi4vdXRpbHNcIjozMn1dLDE5OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49ZShcIi4vVWludDhBcnJheVJlYWRlclwiKTtmdW5jdGlvbiBpKGUpe24uY2FsbCh0aGlzLGUpfWUoXCIuLi91dGlsc1wiKS5pbmhlcml0cyhpLG4pLGkucHJvdG90eXBlLnJlYWREYXRhPWZ1bmN0aW9uKGUpe3RoaXMuY2hlY2tPZmZzZXQoZSk7dmFyIHQ9dGhpcy5kYXRhLnNsaWNlKHRoaXMuemVybyt0aGlzLmluZGV4LHRoaXMuemVybyt0aGlzLmluZGV4K2UpO3JldHVybiB0aGlzLmluZGV4Kz1lLHR9LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9VaW50OEFycmF5UmVhZGVyXCI6MjF9XSwyMDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL0RhdGFSZWFkZXJcIik7ZnVuY3Rpb24gaShlKXtuLmNhbGwodGhpcyxlKX1lKFwiLi4vdXRpbHNcIikuaW5oZXJpdHMoaSxuKSxpLnByb3RvdHlwZS5ieXRlQXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZGF0YS5jaGFyQ29kZUF0KHRoaXMuemVybytlKX0saS5wcm90b3R5cGUubGFzdEluZGV4T2ZTaWduYXR1cmU9ZnVuY3Rpb24oZSl7cmV0dXJuIHRoaXMuZGF0YS5sYXN0SW5kZXhPZihlKS10aGlzLnplcm99LGkucHJvdG90eXBlLnJlYWRBbmRDaGVja1NpZ25hdHVyZT1mdW5jdGlvbihlKXtyZXR1cm4gZT09PXRoaXMucmVhZERhdGEoNCl9LGkucHJvdG90eXBlLnJlYWREYXRhPWZ1bmN0aW9uKGUpe3RoaXMuY2hlY2tPZmZzZXQoZSk7dmFyIHQ9dGhpcy5kYXRhLnNsaWNlKHRoaXMuemVybyt0aGlzLmluZGV4LHRoaXMuemVybyt0aGlzLmluZGV4K2UpO3JldHVybiB0aGlzLmluZGV4Kz1lLHR9LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9EYXRhUmVhZGVyXCI6MTh9XSwyMTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL0FycmF5UmVhZGVyXCIpO2Z1bmN0aW9uIGkoZSl7bi5jYWxsKHRoaXMsZSl9ZShcIi4uL3V0aWxzXCIpLmluaGVyaXRzKGksbiksaS5wcm90b3R5cGUucmVhZERhdGE9ZnVuY3Rpb24oZSl7aWYodGhpcy5jaGVja09mZnNldChlKSwwPT09ZSlyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoMCk7dmFyIHQ9dGhpcy5kYXRhLnN1YmFycmF5KHRoaXMuemVybyt0aGlzLmluZGV4LHRoaXMuemVybyt0aGlzLmluZGV4K2UpO3JldHVybiB0aGlzLmluZGV4Kz1lLHR9LHQuZXhwb3J0cz1pfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9BcnJheVJlYWRlclwiOjE3fV0sMjI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi4vc3VwcG9ydFwiKSxzPWUoXCIuL0FycmF5UmVhZGVyXCIpLGE9ZShcIi4vU3RyaW5nUmVhZGVyXCIpLG89ZShcIi4vTm9kZUJ1ZmZlclJlYWRlclwiKSxoPWUoXCIuL1VpbnQ4QXJyYXlSZWFkZXJcIik7dC5leHBvcnRzPWZ1bmN0aW9uKGUpe3ZhciB0PW4uZ2V0VHlwZU9mKGUpO3JldHVybiBuLmNoZWNrU3VwcG9ydCh0KSxcInN0cmluZ1wiIT09dHx8aS51aW50OGFycmF5P1wibm9kZWJ1ZmZlclwiPT09dD9uZXcgbyhlKTppLnVpbnQ4YXJyYXk/bmV3IGgobi50cmFuc2Zvcm1UbyhcInVpbnQ4YXJyYXlcIixlKSk6bmV3IHMobi50cmFuc2Zvcm1UbyhcImFycmF5XCIsZSkpOm5ldyBhKGUpfX0se1wiLi4vc3VwcG9ydFwiOjMwLFwiLi4vdXRpbHNcIjozMixcIi4vQXJyYXlSZWFkZXJcIjoxNyxcIi4vTm9kZUJ1ZmZlclJlYWRlclwiOjE5LFwiLi9TdHJpbmdSZWFkZXJcIjoyMCxcIi4vVWludDhBcnJheVJlYWRlclwiOjIxfV0sMjM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtyLkxPQ0FMX0ZJTEVfSEVBREVSPVwiUEtcdTAwMDNcdTAwMDRcIixyLkNFTlRSQUxfRklMRV9IRUFERVI9XCJQS1x1MDAwMVx1MDAwMlwiLHIuQ0VOVFJBTF9ESVJFQ1RPUllfRU5EPVwiUEtcdTAwMDVcdTAwMDZcIixyLlpJUDY0X0NFTlRSQUxfRElSRUNUT1JZX0xPQ0FUT1I9XCJQS1x1MDAwNlx1MDAwN1wiLHIuWklQNjRfQ0VOVFJBTF9ESVJFQ1RPUllfRU5EPVwiUEtcdTAwMDZcdTAwMDZcIixyLkRBVEFfREVTQ1JJUFRPUj1cIlBLXHUwMDA3XFxiXCJ9LHt9XSwyNDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL0dlbmVyaWNXb3JrZXJcIiksaT1lKFwiLi4vdXRpbHNcIik7ZnVuY3Rpb24gcyhlKXtuLmNhbGwodGhpcyxcIkNvbnZlcnRXb3JrZXIgdG8gXCIrZSksdGhpcy5kZXN0VHlwZT1lfWkuaW5oZXJpdHMocyxuKSxzLnByb3RvdHlwZS5wcm9jZXNzQ2h1bms9ZnVuY3Rpb24oZSl7dGhpcy5wdXNoKHtkYXRhOmkudHJhbnNmb3JtVG8odGhpcy5kZXN0VHlwZSxlLmRhdGEpLG1ldGE6ZS5tZXRhfSl9LHQuZXhwb3J0cz1zfSx7XCIuLi91dGlsc1wiOjMyLFwiLi9HZW5lcmljV29ya2VyXCI6Mjh9XSwyNTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPWUoXCIuL0dlbmVyaWNXb3JrZXJcIiksaT1lKFwiLi4vY3JjMzJcIik7ZnVuY3Rpb24gcygpe24uY2FsbCh0aGlzLFwiQ3JjMzJQcm9iZVwiKSx0aGlzLndpdGhTdHJlYW1JbmZvKFwiY3JjMzJcIiwwKX1lKFwiLi4vdXRpbHNcIikuaW5oZXJpdHMocyxuKSxzLnByb3RvdHlwZS5wcm9jZXNzQ2h1bms9ZnVuY3Rpb24oZSl7dGhpcy5zdHJlYW1JbmZvLmNyYzMyPWkoZS5kYXRhLHRoaXMuc3RyZWFtSW5mby5jcmMzMnx8MCksdGhpcy5wdXNoKGUpfSx0LmV4cG9ydHM9c30se1wiLi4vY3JjMzJcIjo0LFwiLi4vdXRpbHNcIjozMixcIi4vR2VuZXJpY1dvcmtlclwiOjI4fV0sMjY6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi9HZW5lcmljV29ya2VyXCIpO2Z1bmN0aW9uIHMoZSl7aS5jYWxsKHRoaXMsXCJEYXRhTGVuZ3RoUHJvYmUgZm9yIFwiK2UpLHRoaXMucHJvcE5hbWU9ZSx0aGlzLndpdGhTdHJlYW1JbmZvKGUsMCl9bi5pbmhlcml0cyhzLGkpLHMucHJvdG90eXBlLnByb2Nlc3NDaHVuaz1mdW5jdGlvbihlKXtpZihlKXt2YXIgdD10aGlzLnN0cmVhbUluZm9bdGhpcy5wcm9wTmFtZV18fDA7dGhpcy5zdHJlYW1JbmZvW3RoaXMucHJvcE5hbWVdPXQrZS5kYXRhLmxlbmd0aH1pLnByb3RvdHlwZS5wcm9jZXNzQ2h1bmsuY2FsbCh0aGlzLGUpfSx0LmV4cG9ydHM9c30se1wiLi4vdXRpbHNcIjozMixcIi4vR2VuZXJpY1dvcmtlclwiOjI4fV0sMjc6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi4vdXRpbHNcIiksaT1lKFwiLi9HZW5lcmljV29ya2VyXCIpO2Z1bmN0aW9uIHMoZSl7aS5jYWxsKHRoaXMsXCJEYXRhV29ya2VyXCIpO3ZhciB0PXRoaXM7dGhpcy5kYXRhSXNSZWFkeT0hMSx0aGlzLmluZGV4PTAsdGhpcy5tYXg9MCx0aGlzLmRhdGE9bnVsbCx0aGlzLnR5cGU9XCJcIix0aGlzLl90aWNrU2NoZWR1bGVkPSExLGUudGhlbihmdW5jdGlvbihlKXt0LmRhdGFJc1JlYWR5PSEwLHQuZGF0YT1lLHQubWF4PWUmJmUubGVuZ3RofHwwLHQudHlwZT1uLmdldFR5cGVPZihlKSx0LmlzUGF1c2VkfHx0Ll90aWNrQW5kUmVwZWF0KCl9LGZ1bmN0aW9uKGUpe3QuZXJyb3IoZSl9KX1uLmluaGVyaXRzKHMsaSkscy5wcm90b3R5cGUuY2xlYW5VcD1mdW5jdGlvbigpe2kucHJvdG90eXBlLmNsZWFuVXAuY2FsbCh0aGlzKSx0aGlzLmRhdGE9bnVsbH0scy5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7cmV0dXJuISFpLnByb3RvdHlwZS5yZXN1bWUuY2FsbCh0aGlzKSYmKCF0aGlzLl90aWNrU2NoZWR1bGVkJiZ0aGlzLmRhdGFJc1JlYWR5JiYodGhpcy5fdGlja1NjaGVkdWxlZD0hMCxuLmRlbGF5KHRoaXMuX3RpY2tBbmRSZXBlYXQsW10sdGhpcykpLCEwKX0scy5wcm90b3R5cGUuX3RpY2tBbmRSZXBlYXQ9ZnVuY3Rpb24oKXt0aGlzLl90aWNrU2NoZWR1bGVkPSExLHRoaXMuaXNQYXVzZWR8fHRoaXMuaXNGaW5pc2hlZHx8KHRoaXMuX3RpY2soKSx0aGlzLmlzRmluaXNoZWR8fChuLmRlbGF5KHRoaXMuX3RpY2tBbmRSZXBlYXQsW10sdGhpcyksdGhpcy5fdGlja1NjaGVkdWxlZD0hMCkpfSxzLnByb3RvdHlwZS5fdGljaz1mdW5jdGlvbigpe2lmKHRoaXMuaXNQYXVzZWR8fHRoaXMuaXNGaW5pc2hlZClyZXR1cm4hMTt2YXIgZT1udWxsLHQ9TWF0aC5taW4odGhpcy5tYXgsdGhpcy5pbmRleCsxNjM4NCk7aWYodGhpcy5pbmRleD49dGhpcy5tYXgpcmV0dXJuIHRoaXMuZW5kKCk7c3dpdGNoKHRoaXMudHlwZSl7Y2FzZVwic3RyaW5nXCI6ZT10aGlzLmRhdGEuc3Vic3RyaW5nKHRoaXMuaW5kZXgsdCk7YnJlYWs7Y2FzZVwidWludDhhcnJheVwiOmU9dGhpcy5kYXRhLnN1YmFycmF5KHRoaXMuaW5kZXgsdCk7YnJlYWs7Y2FzZVwiYXJyYXlcIjpjYXNlXCJub2RlYnVmZmVyXCI6ZT10aGlzLmRhdGEuc2xpY2UodGhpcy5pbmRleCx0KX1yZXR1cm4gdGhpcy5pbmRleD10LHRoaXMucHVzaCh7ZGF0YTplLG1ldGE6e3BlcmNlbnQ6dGhpcy5tYXg/dGhpcy5pbmRleC90aGlzLm1heCoxMDA6MH19KX0sdC5leHBvcnRzPXN9LHtcIi4uL3V0aWxzXCI6MzIsXCIuL0dlbmVyaWNXb3JrZXJcIjoyOH1dLDI4OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbihlKXt0aGlzLm5hbWU9ZXx8XCJkZWZhdWx0XCIsdGhpcy5zdHJlYW1JbmZvPXt9LHRoaXMuZ2VuZXJhdGVkRXJyb3I9bnVsbCx0aGlzLmV4dHJhU3RyZWFtSW5mbz17fSx0aGlzLmlzUGF1c2VkPSEwLHRoaXMuaXNGaW5pc2hlZD0hMSx0aGlzLmlzTG9ja2VkPSExLHRoaXMuX2xpc3RlbmVycz17ZGF0YTpbXSxlbmQ6W10sZXJyb3I6W119LHRoaXMucHJldmlvdXM9bnVsbH1uLnByb3RvdHlwZT17cHVzaDpmdW5jdGlvbihlKXt0aGlzLmVtaXQoXCJkYXRhXCIsZSl9LGVuZDpmdW5jdGlvbigpe2lmKHRoaXMuaXNGaW5pc2hlZClyZXR1cm4hMTt0aGlzLmZsdXNoKCk7dHJ5e3RoaXMuZW1pdChcImVuZFwiKSx0aGlzLmNsZWFuVXAoKSx0aGlzLmlzRmluaXNoZWQ9ITB9Y2F0Y2goZSl7dGhpcy5lbWl0KFwiZXJyb3JcIixlKX1yZXR1cm4hMH0sZXJyb3I6ZnVuY3Rpb24oZSl7cmV0dXJuIXRoaXMuaXNGaW5pc2hlZCYmKHRoaXMuaXNQYXVzZWQ/dGhpcy5nZW5lcmF0ZWRFcnJvcj1lOih0aGlzLmlzRmluaXNoZWQ9ITAsdGhpcy5lbWl0KFwiZXJyb3JcIixlKSx0aGlzLnByZXZpb3VzJiZ0aGlzLnByZXZpb3VzLmVycm9yKGUpLHRoaXMuY2xlYW5VcCgpKSwhMCl9LG9uOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuX2xpc3RlbmVyc1tlXS5wdXNoKHQpLHRoaXN9LGNsZWFuVXA6ZnVuY3Rpb24oKXt0aGlzLnN0cmVhbUluZm89dGhpcy5nZW5lcmF0ZWRFcnJvcj10aGlzLmV4dHJhU3RyZWFtSW5mbz1udWxsLHRoaXMuX2xpc3RlbmVycz1bXX0sZW1pdDpmdW5jdGlvbihlLHQpe2lmKHRoaXMuX2xpc3RlbmVyc1tlXSlmb3IodmFyIHI9MDtyPHRoaXMuX2xpc3RlbmVyc1tlXS5sZW5ndGg7cisrKXRoaXMuX2xpc3RlbmVyc1tlXVtyXS5jYWxsKHRoaXMsdCl9LHBpcGU6ZnVuY3Rpb24oZSl7cmV0dXJuIGUucmVnaXN0ZXJQcmV2aW91cyh0aGlzKX0scmVnaXN0ZXJQcmV2aW91czpmdW5jdGlvbihlKXtpZih0aGlzLmlzTG9ja2VkKXRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJlYW0gJ1wiK3RoaXMrXCInIGhhcyBhbHJlYWR5IGJlZW4gdXNlZC5cIik7dGhpcy5zdHJlYW1JbmZvPWUuc3RyZWFtSW5mbyx0aGlzLm1lcmdlU3RyZWFtSW5mbygpLHRoaXMucHJldmlvdXM9ZTt2YXIgdD10aGlzO3JldHVybiBlLm9uKFwiZGF0YVwiLGZ1bmN0aW9uKGUpe3QucHJvY2Vzc0NodW5rKGUpfSksZS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7dC5lbmQoKX0pLGUub24oXCJlcnJvclwiLGZ1bmN0aW9uKGUpe3QuZXJyb3IoZSl9KSx0aGlzfSxwYXVzZTpmdW5jdGlvbigpe3JldHVybiF0aGlzLmlzUGF1c2VkJiYhdGhpcy5pc0ZpbmlzaGVkJiYodGhpcy5pc1BhdXNlZD0hMCx0aGlzLnByZXZpb3VzJiZ0aGlzLnByZXZpb3VzLnBhdXNlKCksITApfSxyZXN1bWU6ZnVuY3Rpb24oKXtpZighdGhpcy5pc1BhdXNlZHx8dGhpcy5pc0ZpbmlzaGVkKXJldHVybiExO3ZhciBlPXRoaXMuaXNQYXVzZWQ9ITE7cmV0dXJuIHRoaXMuZ2VuZXJhdGVkRXJyb3ImJih0aGlzLmVycm9yKHRoaXMuZ2VuZXJhdGVkRXJyb3IpLGU9ITApLHRoaXMucHJldmlvdXMmJnRoaXMucHJldmlvdXMucmVzdW1lKCksIWV9LGZsdXNoOmZ1bmN0aW9uKCl7fSxwcm9jZXNzQ2h1bms6ZnVuY3Rpb24oZSl7dGhpcy5wdXNoKGUpfSx3aXRoU3RyZWFtSW5mbzpmdW5jdGlvbihlLHQpe3JldHVybiB0aGlzLmV4dHJhU3RyZWFtSW5mb1tlXT10LHRoaXMubWVyZ2VTdHJlYW1JbmZvKCksdGhpc30sbWVyZ2VTdHJlYW1JbmZvOmZ1bmN0aW9uKCl7Zm9yKHZhciBlIGluIHRoaXMuZXh0cmFTdHJlYW1JbmZvKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLmV4dHJhU3RyZWFtSW5mbyxlKSYmKHRoaXMuc3RyZWFtSW5mb1tlXT10aGlzLmV4dHJhU3RyZWFtSW5mb1tlXSl9LGxvY2s6ZnVuY3Rpb24oKXtpZih0aGlzLmlzTG9ja2VkKXRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJlYW0gJ1wiK3RoaXMrXCInIGhhcyBhbHJlYWR5IGJlZW4gdXNlZC5cIik7dGhpcy5pc0xvY2tlZD0hMCx0aGlzLnByZXZpb3VzJiZ0aGlzLnByZXZpb3VzLmxvY2soKX0sdG9TdHJpbmc6ZnVuY3Rpb24oKXt2YXIgZT1cIldvcmtlciBcIit0aGlzLm5hbWU7cmV0dXJuIHRoaXMucHJldmlvdXM/dGhpcy5wcmV2aW91cytcIiAtPiBcIitlOmV9fSx0LmV4cG9ydHM9bn0se31dLDI5OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGg9ZShcIi4uL3V0aWxzXCIpLGk9ZShcIi4vQ29udmVydFdvcmtlclwiKSxzPWUoXCIuL0dlbmVyaWNXb3JrZXJcIiksdT1lKFwiLi4vYmFzZTY0XCIpLG49ZShcIi4uL3N1cHBvcnRcIiksYT1lKFwiLi4vZXh0ZXJuYWxcIiksbz1udWxsO2lmKG4ubm9kZXN0cmVhbSl0cnl7bz1lKFwiLi4vbm9kZWpzL05vZGVqc1N0cmVhbU91dHB1dEFkYXB0ZXJcIil9Y2F0Y2goZSl7fWZ1bmN0aW9uIGwoZSxvKXtyZXR1cm4gbmV3IGEuUHJvbWlzZShmdW5jdGlvbih0LHIpe3ZhciBuPVtdLGk9ZS5faW50ZXJuYWxUeXBlLHM9ZS5fb3V0cHV0VHlwZSxhPWUuX21pbWVUeXBlO2Uub24oXCJkYXRhXCIsZnVuY3Rpb24oZSx0KXtuLnB1c2goZSksbyYmbyh0KX0pLm9uKFwiZXJyb3JcIixmdW5jdGlvbihlKXtuPVtdLHIoZSl9KS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7dHJ5e3ZhciBlPWZ1bmN0aW9uKGUsdCxyKXtzd2l0Y2goZSl7Y2FzZVwiYmxvYlwiOnJldHVybiBoLm5ld0Jsb2IoaC50cmFuc2Zvcm1UbyhcImFycmF5YnVmZmVyXCIsdCkscik7Y2FzZVwiYmFzZTY0XCI6cmV0dXJuIHUuZW5jb2RlKHQpO2RlZmF1bHQ6cmV0dXJuIGgudHJhbnNmb3JtVG8oZSx0KX19KHMsZnVuY3Rpb24oZSx0KXt2YXIgcixuPTAsaT1udWxsLHM9MDtmb3Iocj0wO3I8dC5sZW5ndGg7cisrKXMrPXRbcl0ubGVuZ3RoO3N3aXRjaChlKXtjYXNlXCJzdHJpbmdcIjpyZXR1cm4gdC5qb2luKFwiXCIpO2Nhc2VcImFycmF5XCI6cmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sdCk7Y2FzZVwidWludDhhcnJheVwiOmZvcihpPW5ldyBVaW50OEFycmF5KHMpLHI9MDtyPHQubGVuZ3RoO3IrKylpLnNldCh0W3JdLG4pLG4rPXRbcl0ubGVuZ3RoO3JldHVybiBpO2Nhc2VcIm5vZGVidWZmZXJcIjpyZXR1cm4gQnVmZmVyLmNvbmNhdCh0KTtkZWZhdWx0OnRocm93IG5ldyBFcnJvcihcImNvbmNhdCA6IHVuc3VwcG9ydGVkIHR5cGUgJ1wiK2UrXCInXCIpfX0oaSxuKSxhKTt0KGUpfWNhdGNoKGUpe3IoZSl9bj1bXX0pLnJlc3VtZSgpfSl9ZnVuY3Rpb24gZihlLHQscil7dmFyIG49dDtzd2l0Y2godCl7Y2FzZVwiYmxvYlwiOmNhc2VcImFycmF5YnVmZmVyXCI6bj1cInVpbnQ4YXJyYXlcIjticmVhaztjYXNlXCJiYXNlNjRcIjpuPVwic3RyaW5nXCJ9dHJ5e3RoaXMuX2ludGVybmFsVHlwZT1uLHRoaXMuX291dHB1dFR5cGU9dCx0aGlzLl9taW1lVHlwZT1yLGguY2hlY2tTdXBwb3J0KG4pLHRoaXMuX3dvcmtlcj1lLnBpcGUobmV3IGkobikpLGUubG9jaygpfWNhdGNoKGUpe3RoaXMuX3dvcmtlcj1uZXcgcyhcImVycm9yXCIpLHRoaXMuX3dvcmtlci5lcnJvcihlKX19Zi5wcm90b3R5cGU9e2FjY3VtdWxhdGU6ZnVuY3Rpb24oZSl7cmV0dXJuIGwodGhpcyxlKX0sb246ZnVuY3Rpb24oZSx0KXt2YXIgcj10aGlzO3JldHVyblwiZGF0YVwiPT09ZT90aGlzLl93b3JrZXIub24oZSxmdW5jdGlvbihlKXt0LmNhbGwocixlLmRhdGEsZS5tZXRhKX0pOnRoaXMuX3dvcmtlci5vbihlLGZ1bmN0aW9uKCl7aC5kZWxheSh0LGFyZ3VtZW50cyxyKX0pLHRoaXN9LHJlc3VtZTpmdW5jdGlvbigpe3JldHVybiBoLmRlbGF5KHRoaXMuX3dvcmtlci5yZXN1bWUsW10sdGhpcy5fd29ya2VyKSx0aGlzfSxwYXVzZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLl93b3JrZXIucGF1c2UoKSx0aGlzfSx0b05vZGVqc1N0cmVhbTpmdW5jdGlvbihlKXtpZihoLmNoZWNrU3VwcG9ydChcIm5vZGVzdHJlYW1cIiksXCJub2RlYnVmZmVyXCIhPT10aGlzLl9vdXRwdXRUeXBlKXRocm93IG5ldyBFcnJvcih0aGlzLl9vdXRwdXRUeXBlK1wiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBtZXRob2RcIik7cmV0dXJuIG5ldyBvKHRoaXMse29iamVjdE1vZGU6XCJub2RlYnVmZmVyXCIhPT10aGlzLl9vdXRwdXRUeXBlfSxlKX19LHQuZXhwb3J0cz1mfSx7XCIuLi9iYXNlNjRcIjoxLFwiLi4vZXh0ZXJuYWxcIjo2LFwiLi4vbm9kZWpzL05vZGVqc1N0cmVhbU91dHB1dEFkYXB0ZXJcIjoxMyxcIi4uL3N1cHBvcnRcIjozMCxcIi4uL3V0aWxzXCI6MzIsXCIuL0NvbnZlcnRXb3JrZXJcIjoyNCxcIi4vR2VuZXJpY1dvcmtlclwiOjI4fV0sMzA6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtpZihyLmJhc2U2ND0hMCxyLmFycmF5PSEwLHIuc3RyaW5nPSEwLHIuYXJyYXlidWZmZXI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEFycmF5QnVmZmVyJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgVWludDhBcnJheSxyLm5vZGVidWZmZXI9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEJ1ZmZlcixyLnVpbnQ4YXJyYXk9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQ4QXJyYXksXCJ1bmRlZmluZWRcIj09dHlwZW9mIEFycmF5QnVmZmVyKXIuYmxvYj0hMTtlbHNle3ZhciBuPW5ldyBBcnJheUJ1ZmZlcigwKTt0cnl7ci5ibG9iPTA9PT1uZXcgQmxvYihbbl0se3R5cGU6XCJhcHBsaWNhdGlvbi96aXBcIn0pLnNpemV9Y2F0Y2goZSl7dHJ5e3ZhciBpPW5ldyhzZWxmLkJsb2JCdWlsZGVyfHxzZWxmLldlYktpdEJsb2JCdWlsZGVyfHxzZWxmLk1vekJsb2JCdWlsZGVyfHxzZWxmLk1TQmxvYkJ1aWxkZXIpO2kuYXBwZW5kKG4pLHIuYmxvYj0wPT09aS5nZXRCbG9iKFwiYXBwbGljYXRpb24vemlwXCIpLnNpemV9Y2F0Y2goZSl7ci5ibG9iPSExfX19dHJ5e3Iubm9kZXN0cmVhbT0hIWUoXCJyZWFkYWJsZS1zdHJlYW1cIikuUmVhZGFibGV9Y2F0Y2goZSl7ci5ub2Rlc3RyZWFtPSExfX0se1wicmVhZGFibGUtc3RyZWFtXCI6MTZ9XSwzMTpbZnVuY3Rpb24oZSx0LHMpe1widXNlIHN0cmljdFwiO2Zvcih2YXIgbz1lKFwiLi91dGlsc1wiKSxoPWUoXCIuL3N1cHBvcnRcIikscj1lKFwiLi9ub2RlanNVdGlsc1wiKSxuPWUoXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCIpLHU9bmV3IEFycmF5KDI1NiksaT0wO2k8MjU2O2krKyl1W2ldPTI1Mjw9aT82OjI0ODw9aT81OjI0MDw9aT80OjIyNDw9aT8zOjE5Mjw9aT8yOjE7dVsyNTRdPXVbMjU0XT0xO2Z1bmN0aW9uIGEoKXtuLmNhbGwodGhpcyxcInV0Zi04IGRlY29kZVwiKSx0aGlzLmxlZnRPdmVyPW51bGx9ZnVuY3Rpb24gbCgpe24uY2FsbCh0aGlzLFwidXRmLTggZW5jb2RlXCIpfXMudXRmOGVuY29kZT1mdW5jdGlvbihlKXtyZXR1cm4gaC5ub2RlYnVmZmVyP3IubmV3QnVmZmVyRnJvbShlLFwidXRmLThcIik6ZnVuY3Rpb24oZSl7dmFyIHQscixuLGkscyxhPWUubGVuZ3RoLG89MDtmb3IoaT0wO2k8YTtpKyspNTUyOTY9PSg2NDUxMiYocj1lLmNoYXJDb2RlQXQoaSkpKSYmaSsxPGEmJjU2MzIwPT0oNjQ1MTImKG49ZS5jaGFyQ29kZUF0KGkrMSkpKSYmKHI9NjU1MzYrKHItNTUyOTY8PDEwKSsobi01NjMyMCksaSsrKSxvKz1yPDEyOD8xOnI8MjA0OD8yOnI8NjU1MzY/Mzo0O2Zvcih0PWgudWludDhhcnJheT9uZXcgVWludDhBcnJheShvKTpuZXcgQXJyYXkobyksaT1zPTA7czxvO2krKyk1NTI5Nj09KDY0NTEyJihyPWUuY2hhckNvZGVBdChpKSkpJiZpKzE8YSYmNTYzMjA9PSg2NDUxMiYobj1lLmNoYXJDb2RlQXQoaSsxKSkpJiYocj02NTUzNisoci01NTI5Njw8MTApKyhuLTU2MzIwKSxpKyspLHI8MTI4P3RbcysrXT1yOihyPDIwNDg/dFtzKytdPTE5MnxyPj4+Njoocjw2NTUzNj90W3MrK109MjI0fHI+Pj4xMjoodFtzKytdPTI0MHxyPj4+MTgsdFtzKytdPTEyOHxyPj4+MTImNjMpLHRbcysrXT0xMjh8cj4+PjYmNjMpLHRbcysrXT0xMjh8NjMmcik7cmV0dXJuIHR9KGUpfSxzLnV0ZjhkZWNvZGU9ZnVuY3Rpb24oZSl7cmV0dXJuIGgubm9kZWJ1ZmZlcj9vLnRyYW5zZm9ybVRvKFwibm9kZWJ1ZmZlclwiLGUpLnRvU3RyaW5nKFwidXRmLThcIik6ZnVuY3Rpb24oZSl7dmFyIHQscixuLGkscz1lLmxlbmd0aCxhPW5ldyBBcnJheSgyKnMpO2Zvcih0PXI9MDt0PHM7KWlmKChuPWVbdCsrXSk8MTI4KWFbcisrXT1uO2Vsc2UgaWYoNDwoaT11W25dKSlhW3IrK109NjU1MzMsdCs9aS0xO2Vsc2V7Zm9yKG4mPTI9PT1pPzMxOjM9PT1pPzE1Ojc7MTxpJiZ0PHM7KW49bjw8Nnw2MyZlW3QrK10saS0tOzE8aT9hW3IrK109NjU1MzM6bjw2NTUzNj9hW3IrK109bjoobi09NjU1MzYsYVtyKytdPTU1Mjk2fG4+PjEwJjEwMjMsYVtyKytdPTU2MzIwfDEwMjMmbil9cmV0dXJuIGEubGVuZ3RoIT09ciYmKGEuc3ViYXJyYXk/YT1hLnN1YmFycmF5KDAscik6YS5sZW5ndGg9ciksby5hcHBseUZyb21DaGFyQ29kZShhKX0oZT1vLnRyYW5zZm9ybVRvKGgudWludDhhcnJheT9cInVpbnQ4YXJyYXlcIjpcImFycmF5XCIsZSkpfSxvLmluaGVyaXRzKGEsbiksYS5wcm90b3R5cGUucHJvY2Vzc0NodW5rPWZ1bmN0aW9uKGUpe3ZhciB0PW8udHJhbnNmb3JtVG8oaC51aW50OGFycmF5P1widWludDhhcnJheVwiOlwiYXJyYXlcIixlLmRhdGEpO2lmKHRoaXMubGVmdE92ZXImJnRoaXMubGVmdE92ZXIubGVuZ3RoKXtpZihoLnVpbnQ4YXJyYXkpe3ZhciByPXQ7KHQ9bmV3IFVpbnQ4QXJyYXkoci5sZW5ndGgrdGhpcy5sZWZ0T3Zlci5sZW5ndGgpKS5zZXQodGhpcy5sZWZ0T3ZlciwwKSx0LnNldChyLHRoaXMubGVmdE92ZXIubGVuZ3RoKX1lbHNlIHQ9dGhpcy5sZWZ0T3Zlci5jb25jYXQodCk7dGhpcy5sZWZ0T3Zlcj1udWxsfXZhciBuPWZ1bmN0aW9uKGUsdCl7dmFyIHI7Zm9yKCh0PXR8fGUubGVuZ3RoKT5lLmxlbmd0aCYmKHQ9ZS5sZW5ndGgpLHI9dC0xOzA8PXImJjEyOD09KDE5MiZlW3JdKTspci0tO3JldHVybiByPDA/dDowPT09cj90OnIrdVtlW3JdXT50P3I6dH0odCksaT10O24hPT10Lmxlbmd0aCYmKGgudWludDhhcnJheT8oaT10LnN1YmFycmF5KDAsbiksdGhpcy5sZWZ0T3Zlcj10LnN1YmFycmF5KG4sdC5sZW5ndGgpKTooaT10LnNsaWNlKDAsbiksdGhpcy5sZWZ0T3Zlcj10LnNsaWNlKG4sdC5sZW5ndGgpKSksdGhpcy5wdXNoKHtkYXRhOnMudXRmOGRlY29kZShpKSxtZXRhOmUubWV0YX0pfSxhLnByb3RvdHlwZS5mbHVzaD1mdW5jdGlvbigpe3RoaXMubGVmdE92ZXImJnRoaXMubGVmdE92ZXIubGVuZ3RoJiYodGhpcy5wdXNoKHtkYXRhOnMudXRmOGRlY29kZSh0aGlzLmxlZnRPdmVyKSxtZXRhOnt9fSksdGhpcy5sZWZ0T3Zlcj1udWxsKX0scy5VdGY4RGVjb2RlV29ya2VyPWEsby5pbmhlcml0cyhsLG4pLGwucHJvdG90eXBlLnByb2Nlc3NDaHVuaz1mdW5jdGlvbihlKXt0aGlzLnB1c2goe2RhdGE6cy51dGY4ZW5jb2RlKGUuZGF0YSksbWV0YTplLm1ldGF9KX0scy5VdGY4RW5jb2RlV29ya2VyPWx9LHtcIi4vbm9kZWpzVXRpbHNcIjoxNCxcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIjoyOCxcIi4vc3VwcG9ydFwiOjMwLFwiLi91dGlsc1wiOjMyfV0sMzI6W2Z1bmN0aW9uKGUsdCxhKXtcInVzZSBzdHJpY3RcIjt2YXIgbz1lKFwiLi9zdXBwb3J0XCIpLGg9ZShcIi4vYmFzZTY0XCIpLHI9ZShcIi4vbm9kZWpzVXRpbHNcIiksdT1lKFwiLi9leHRlcm5hbFwiKTtmdW5jdGlvbiBuKGUpe3JldHVybiBlfWZ1bmN0aW9uIGwoZSx0KXtmb3IodmFyIHI9MDtyPGUubGVuZ3RoOysrcil0W3JdPTI1NSZlLmNoYXJDb2RlQXQocik7cmV0dXJuIHR9ZShcInNldGltbWVkaWF0ZVwiKSxhLm5ld0Jsb2I9ZnVuY3Rpb24odCxyKXthLmNoZWNrU3VwcG9ydChcImJsb2JcIik7dHJ5e3JldHVybiBuZXcgQmxvYihbdF0se3R5cGU6cn0pfWNhdGNoKGUpe3RyeXt2YXIgbj1uZXcoc2VsZi5CbG9iQnVpbGRlcnx8c2VsZi5XZWJLaXRCbG9iQnVpbGRlcnx8c2VsZi5Nb3pCbG9iQnVpbGRlcnx8c2VsZi5NU0Jsb2JCdWlsZGVyKTtyZXR1cm4gbi5hcHBlbmQodCksbi5nZXRCbG9iKHIpfWNhdGNoKGUpe3Rocm93IG5ldyBFcnJvcihcIkJ1ZyA6IGNhbid0IGNvbnN0cnVjdCB0aGUgQmxvYi5cIil9fX07dmFyIGk9e3N0cmluZ2lmeUJ5Q2h1bms6ZnVuY3Rpb24oZSx0LHIpe3ZhciBuPVtdLGk9MCxzPWUubGVuZ3RoO2lmKHM8PXIpcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxlKTtmb3IoO2k8czspXCJhcnJheVwiPT09dHx8XCJub2RlYnVmZmVyXCI9PT10P24ucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsZS5zbGljZShpLE1hdGgubWluKGkrcixzKSkpKTpuLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGUuc3ViYXJyYXkoaSxNYXRoLm1pbihpK3IscykpKSksaSs9cjtyZXR1cm4gbi5qb2luKFwiXCIpfSxzdHJpbmdpZnlCeUNoYXI6ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PVwiXCIscj0wO3I8ZS5sZW5ndGg7cisrKXQrPVN0cmluZy5mcm9tQ2hhckNvZGUoZVtyXSk7cmV0dXJuIHR9LGFwcGx5Q2FuQmVVc2VkOnt1aW50OGFycmF5OmZ1bmN0aW9uKCl7dHJ5e3JldHVybiBvLnVpbnQ4YXJyYXkmJjE9PT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkoMSkpLmxlbmd0aH1jYXRjaChlKXtyZXR1cm4hMX19KCksbm9kZWJ1ZmZlcjpmdW5jdGlvbigpe3RyeXtyZXR1cm4gby5ub2RlYnVmZmVyJiYxPT09U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLHIuYWxsb2NCdWZmZXIoMSkpLmxlbmd0aH1jYXRjaChlKXtyZXR1cm4hMX19KCl9fTtmdW5jdGlvbiBzKGUpe3ZhciB0PTY1NTM2LHI9YS5nZXRUeXBlT2YoZSksbj0hMDtpZihcInVpbnQ4YXJyYXlcIj09PXI/bj1pLmFwcGx5Q2FuQmVVc2VkLnVpbnQ4YXJyYXk6XCJub2RlYnVmZmVyXCI9PT1yJiYobj1pLmFwcGx5Q2FuQmVVc2VkLm5vZGVidWZmZXIpLG4pZm9yKDsxPHQ7KXRyeXtyZXR1cm4gaS5zdHJpbmdpZnlCeUNodW5rKGUscix0KX1jYXRjaChlKXt0PU1hdGguZmxvb3IodC8yKX1yZXR1cm4gaS5zdHJpbmdpZnlCeUNoYXIoZSl9ZnVuY3Rpb24gZihlLHQpe2Zvcih2YXIgcj0wO3I8ZS5sZW5ndGg7cisrKXRbcl09ZVtyXTtyZXR1cm4gdH1hLmFwcGx5RnJvbUNoYXJDb2RlPXM7dmFyIGM9e307Yy5zdHJpbmc9e3N0cmluZzpuLGFycmF5OmZ1bmN0aW9uKGUpe3JldHVybiBsKGUsbmV3IEFycmF5KGUubGVuZ3RoKSl9LGFycmF5YnVmZmVyOmZ1bmN0aW9uKGUpe3JldHVybiBjLnN0cmluZy51aW50OGFycmF5KGUpLmJ1ZmZlcn0sdWludDhhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gbChlLG5ldyBVaW50OEFycmF5KGUubGVuZ3RoKSl9LG5vZGVidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGwoZSxyLmFsbG9jQnVmZmVyKGUubGVuZ3RoKSl9fSxjLmFycmF5PXtzdHJpbmc6cyxhcnJheTpuLGFycmF5YnVmZmVyOmZ1bmN0aW9uKGUpe3JldHVybiBuZXcgVWludDhBcnJheShlKS5idWZmZXJ9LHVpbnQ4YXJyYXk6ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBVaW50OEFycmF5KGUpfSxub2RlYnVmZmVyOmZ1bmN0aW9uKGUpe3JldHVybiByLm5ld0J1ZmZlckZyb20oZSl9fSxjLmFycmF5YnVmZmVyPXtzdHJpbmc6ZnVuY3Rpb24oZSl7cmV0dXJuIHMobmV3IFVpbnQ4QXJyYXkoZSkpfSxhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gZihuZXcgVWludDhBcnJheShlKSxuZXcgQXJyYXkoZS5ieXRlTGVuZ3RoKSl9LGFycmF5YnVmZmVyOm4sdWludDhhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gbmV3IFVpbnQ4QXJyYXkoZSl9LG5vZGVidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIHIubmV3QnVmZmVyRnJvbShuZXcgVWludDhBcnJheShlKSl9fSxjLnVpbnQ4YXJyYXk9e3N0cmluZzpzLGFycmF5OmZ1bmN0aW9uKGUpe3JldHVybiBmKGUsbmV3IEFycmF5KGUubGVuZ3RoKSl9LGFycmF5YnVmZmVyOmZ1bmN0aW9uKGUpe3JldHVybiBlLmJ1ZmZlcn0sdWludDhhcnJheTpuLG5vZGVidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIHIubmV3QnVmZmVyRnJvbShlKX19LGMubm9kZWJ1ZmZlcj17c3RyaW5nOnMsYXJyYXk6ZnVuY3Rpb24oZSl7cmV0dXJuIGYoZSxuZXcgQXJyYXkoZS5sZW5ndGgpKX0sYXJyYXlidWZmZXI6ZnVuY3Rpb24oZSl7cmV0dXJuIGMubm9kZWJ1ZmZlci51aW50OGFycmF5KGUpLmJ1ZmZlcn0sdWludDhhcnJheTpmdW5jdGlvbihlKXtyZXR1cm4gZihlLG5ldyBVaW50OEFycmF5KGUubGVuZ3RoKSl9LG5vZGVidWZmZXI6bn0sYS50cmFuc2Zvcm1Ubz1mdW5jdGlvbihlLHQpe2lmKHQ9dHx8XCJcIiwhZSlyZXR1cm4gdDthLmNoZWNrU3VwcG9ydChlKTt2YXIgcj1hLmdldFR5cGVPZih0KTtyZXR1cm4gY1tyXVtlXSh0KX0sYS5yZXNvbHZlPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLnNwbGl0KFwiL1wiKSxyPVtdLG49MDtuPHQubGVuZ3RoO24rKyl7dmFyIGk9dFtuXTtcIi5cIj09PWl8fFwiXCI9PT1pJiYwIT09biYmbiE9PXQubGVuZ3RoLTF8fChcIi4uXCI9PT1pP3IucG9wKCk6ci5wdXNoKGkpKX1yZXR1cm4gci5qb2luKFwiL1wiKX0sYS5nZXRUeXBlT2Y9ZnVuY3Rpb24oZSl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIGU/XCJzdHJpbmdcIjpcIltvYmplY3QgQXJyYXldXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSk/XCJhcnJheVwiOm8ubm9kZWJ1ZmZlciYmci5pc0J1ZmZlcihlKT9cIm5vZGVidWZmZXJcIjpvLnVpbnQ4YXJyYXkmJmUgaW5zdGFuY2VvZiBVaW50OEFycmF5P1widWludDhhcnJheVwiOm8uYXJyYXlidWZmZXImJmUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcj9cImFycmF5YnVmZmVyXCI6dm9pZCAwfSxhLmNoZWNrU3VwcG9ydD1mdW5jdGlvbihlKXtpZighb1tlLnRvTG93ZXJDYXNlKCldKXRocm93IG5ldyBFcnJvcihlK1wiIGlzIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBwbGF0Zm9ybVwiKX0sYS5NQVhfVkFMVUVfMTZCSVRTPTY1NTM1LGEuTUFYX1ZBTFVFXzMyQklUUz0tMSxhLnByZXR0eT1mdW5jdGlvbihlKXt2YXIgdCxyLG49XCJcIjtmb3Iocj0wO3I8KGV8fFwiXCIpLmxlbmd0aDtyKyspbis9XCJcXFxceFwiKygodD1lLmNoYXJDb2RlQXQocikpPDE2P1wiMFwiOlwiXCIpK3QudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7cmV0dXJuIG59LGEuZGVsYXk9ZnVuY3Rpb24oZSx0LHIpe3NldEltbWVkaWF0ZShmdW5jdGlvbigpe2UuYXBwbHkocnx8bnVsbCx0fHxbXSl9KX0sYS5pbmhlcml0cz1mdW5jdGlvbihlLHQpe2Z1bmN0aW9uIHIoKXt9ci5wcm90b3R5cGU9dC5wcm90b3R5cGUsZS5wcm90b3R5cGU9bmV3IHJ9LGEuZXh0ZW5kPWZ1bmN0aW9uKCl7dmFyIGUsdCxyPXt9O2ZvcihlPTA7ZTxhcmd1bWVudHMubGVuZ3RoO2UrKylmb3IodCBpbiBhcmd1bWVudHNbZV0pT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyZ3VtZW50c1tlXSx0KSYmdm9pZCAwPT09clt0XSYmKHJbdF09YXJndW1lbnRzW2VdW3RdKTtyZXR1cm4gcn0sYS5wcmVwYXJlQ29udGVudD1mdW5jdGlvbihyLGUsbixpLHMpe3JldHVybiB1LlByb21pc2UucmVzb2x2ZShlKS50aGVuKGZ1bmN0aW9uKG4pe3JldHVybiBvLmJsb2ImJihuIGluc3RhbmNlb2YgQmxvYnx8LTEhPT1bXCJbb2JqZWN0IEZpbGVdXCIsXCJbb2JqZWN0IEJsb2JdXCJdLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG4pKSkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBGaWxlUmVhZGVyP25ldyB1LlByb21pc2UoZnVuY3Rpb24odCxyKXt2YXIgZT1uZXcgRmlsZVJlYWRlcjtlLm9ubG9hZD1mdW5jdGlvbihlKXt0KGUudGFyZ2V0LnJlc3VsdCl9LGUub25lcnJvcj1mdW5jdGlvbihlKXtyKGUudGFyZ2V0LmVycm9yKX0sZS5yZWFkQXNBcnJheUJ1ZmZlcihuKX0pOm59KS50aGVuKGZ1bmN0aW9uKGUpe3ZhciB0PWEuZ2V0VHlwZU9mKGUpO3JldHVybiB0PyhcImFycmF5YnVmZmVyXCI9PT10P2U9YS50cmFuc2Zvcm1UbyhcInVpbnQ4YXJyYXlcIixlKTpcInN0cmluZ1wiPT09dCYmKHM/ZT1oLmRlY29kZShlKTpuJiYhMCE9PWkmJihlPWZ1bmN0aW9uKGUpe3JldHVybiBsKGUsby51aW50OGFycmF5P25ldyBVaW50OEFycmF5KGUubGVuZ3RoKTpuZXcgQXJyYXkoZS5sZW5ndGgpKX0oZSkpKSxlKTp1LlByb21pc2UucmVqZWN0KG5ldyBFcnJvcihcIkNhbid0IHJlYWQgdGhlIGRhdGEgb2YgJ1wiK3IrXCInLiBJcyBpdCBpbiBhIHN1cHBvcnRlZCBKYXZhU2NyaXB0IHR5cGUgKFN0cmluZywgQmxvYiwgQXJyYXlCdWZmZXIsIGV0YykgP1wiKSl9KX19LHtcIi4vYmFzZTY0XCI6MSxcIi4vZXh0ZXJuYWxcIjo2LFwiLi9ub2RlanNVdGlsc1wiOjE0LFwiLi9zdXBwb3J0XCI6MzAsc2V0aW1tZWRpYXRlOjU0fV0sMzM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi9yZWFkZXIvcmVhZGVyRm9yXCIpLGk9ZShcIi4vdXRpbHNcIikscz1lKFwiLi9zaWduYXR1cmVcIiksYT1lKFwiLi96aXBFbnRyeVwiKSxvPWUoXCIuL3N1cHBvcnRcIik7ZnVuY3Rpb24gaChlKXt0aGlzLmZpbGVzPVtdLHRoaXMubG9hZE9wdGlvbnM9ZX1oLnByb3RvdHlwZT17Y2hlY2tTaWduYXR1cmU6ZnVuY3Rpb24oZSl7aWYoIXRoaXMucmVhZGVyLnJlYWRBbmRDaGVja1NpZ25hdHVyZShlKSl7dGhpcy5yZWFkZXIuaW5kZXgtPTQ7dmFyIHQ9dGhpcy5yZWFkZXIucmVhZFN0cmluZyg0KTt0aHJvdyBuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwIG9yIGJ1ZzogdW5leHBlY3RlZCBzaWduYXR1cmUgKFwiK2kucHJldHR5KHQpK1wiLCBleHBlY3RlZCBcIitpLnByZXR0eShlKStcIilcIil9fSxpc1NpZ25hdHVyZTpmdW5jdGlvbihlLHQpe3ZhciByPXRoaXMucmVhZGVyLmluZGV4O3RoaXMucmVhZGVyLnNldEluZGV4KGUpO3ZhciBuPXRoaXMucmVhZGVyLnJlYWRTdHJpbmcoNCk9PT10O3JldHVybiB0aGlzLnJlYWRlci5zZXRJbmRleChyKSxufSxyZWFkQmxvY2tFbmRPZkNlbnRyYWw6ZnVuY3Rpb24oKXt0aGlzLmRpc2tOdW1iZXI9dGhpcy5yZWFkZXIucmVhZEludCgyKSx0aGlzLmRpc2tXaXRoQ2VudHJhbERpclN0YXJ0PXRoaXMucmVhZGVyLnJlYWRJbnQoMiksdGhpcy5jZW50cmFsRGlyUmVjb3Jkc09uVGhpc0Rpc2s9dGhpcy5yZWFkZXIucmVhZEludCgyKSx0aGlzLmNlbnRyYWxEaXJSZWNvcmRzPXRoaXMucmVhZGVyLnJlYWRJbnQoMiksdGhpcy5jZW50cmFsRGlyU2l6ZT10aGlzLnJlYWRlci5yZWFkSW50KDQpLHRoaXMuY2VudHJhbERpck9mZnNldD10aGlzLnJlYWRlci5yZWFkSW50KDQpLHRoaXMuemlwQ29tbWVudExlbmd0aD10aGlzLnJlYWRlci5yZWFkSW50KDIpO3ZhciBlPXRoaXMucmVhZGVyLnJlYWREYXRhKHRoaXMuemlwQ29tbWVudExlbmd0aCksdD1vLnVpbnQ4YXJyYXk/XCJ1aW50OGFycmF5XCI6XCJhcnJheVwiLHI9aS50cmFuc2Zvcm1Ubyh0LGUpO3RoaXMuemlwQ29tbWVudD10aGlzLmxvYWRPcHRpb25zLmRlY29kZUZpbGVOYW1lKHIpfSxyZWFkQmxvY2taaXA2NEVuZE9mQ2VudHJhbDpmdW5jdGlvbigpe3RoaXMuemlwNjRFbmRPZkNlbnRyYWxTaXplPXRoaXMucmVhZGVyLnJlYWRJbnQoOCksdGhpcy5yZWFkZXIuc2tpcCg0KSx0aGlzLmRpc2tOdW1iZXI9dGhpcy5yZWFkZXIucmVhZEludCg0KSx0aGlzLmRpc2tXaXRoQ2VudHJhbERpclN0YXJ0PXRoaXMucmVhZGVyLnJlYWRJbnQoNCksdGhpcy5jZW50cmFsRGlyUmVjb3Jkc09uVGhpc0Rpc2s9dGhpcy5yZWFkZXIucmVhZEludCg4KSx0aGlzLmNlbnRyYWxEaXJSZWNvcmRzPXRoaXMucmVhZGVyLnJlYWRJbnQoOCksdGhpcy5jZW50cmFsRGlyU2l6ZT10aGlzLnJlYWRlci5yZWFkSW50KDgpLHRoaXMuY2VudHJhbERpck9mZnNldD10aGlzLnJlYWRlci5yZWFkSW50KDgpLHRoaXMuemlwNjRFeHRlbnNpYmxlRGF0YT17fTtmb3IodmFyIGUsdCxyLG49dGhpcy56aXA2NEVuZE9mQ2VudHJhbFNpemUtNDQ7MDxuOyllPXRoaXMucmVhZGVyLnJlYWRJbnQoMiksdD10aGlzLnJlYWRlci5yZWFkSW50KDQpLHI9dGhpcy5yZWFkZXIucmVhZERhdGEodCksdGhpcy56aXA2NEV4dGVuc2libGVEYXRhW2VdPXtpZDplLGxlbmd0aDp0LHZhbHVlOnJ9fSxyZWFkQmxvY2taaXA2NEVuZE9mQ2VudHJhbExvY2F0b3I6ZnVuY3Rpb24oKXtpZih0aGlzLmRpc2tXaXRoWmlwNjRDZW50cmFsRGlyU3RhcnQ9dGhpcy5yZWFkZXIucmVhZEludCg0KSx0aGlzLnJlbGF0aXZlT2Zmc2V0RW5kT2ZaaXA2NENlbnRyYWxEaXI9dGhpcy5yZWFkZXIucmVhZEludCg4KSx0aGlzLmRpc2tzQ291bnQ9dGhpcy5yZWFkZXIucmVhZEludCg0KSwxPHRoaXMuZGlza3NDb3VudCl0aHJvdyBuZXcgRXJyb3IoXCJNdWx0aS12b2x1bWVzIHppcCBhcmUgbm90IHN1cHBvcnRlZFwiKX0scmVhZExvY2FsRmlsZXM6ZnVuY3Rpb24oKXt2YXIgZSx0O2ZvcihlPTA7ZTx0aGlzLmZpbGVzLmxlbmd0aDtlKyspdD10aGlzLmZpbGVzW2VdLHRoaXMucmVhZGVyLnNldEluZGV4KHQubG9jYWxIZWFkZXJPZmZzZXQpLHRoaXMuY2hlY2tTaWduYXR1cmUocy5MT0NBTF9GSUxFX0hFQURFUiksdC5yZWFkTG9jYWxQYXJ0KHRoaXMucmVhZGVyKSx0LmhhbmRsZVVURjgoKSx0LnByb2Nlc3NBdHRyaWJ1dGVzKCl9LHJlYWRDZW50cmFsRGlyOmZ1bmN0aW9uKCl7dmFyIGU7Zm9yKHRoaXMucmVhZGVyLnNldEluZGV4KHRoaXMuY2VudHJhbERpck9mZnNldCk7dGhpcy5yZWFkZXIucmVhZEFuZENoZWNrU2lnbmF0dXJlKHMuQ0VOVFJBTF9GSUxFX0hFQURFUik7KShlPW5ldyBhKHt6aXA2NDp0aGlzLnppcDY0fSx0aGlzLmxvYWRPcHRpb25zKSkucmVhZENlbnRyYWxQYXJ0KHRoaXMucmVhZGVyKSx0aGlzLmZpbGVzLnB1c2goZSk7aWYodGhpcy5jZW50cmFsRGlyUmVjb3JkcyE9PXRoaXMuZmlsZXMubGVuZ3RoJiYwIT09dGhpcy5jZW50cmFsRGlyUmVjb3JkcyYmMD09PXRoaXMuZmlsZXMubGVuZ3RoKXRocm93IG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXAgb3IgYnVnOiBleHBlY3RlZCBcIit0aGlzLmNlbnRyYWxEaXJSZWNvcmRzK1wiIHJlY29yZHMgaW4gY2VudHJhbCBkaXIsIGdvdCBcIit0aGlzLmZpbGVzLmxlbmd0aCl9LHJlYWRFbmRPZkNlbnRyYWw6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnJlYWRlci5sYXN0SW5kZXhPZlNpZ25hdHVyZShzLkNFTlRSQUxfRElSRUNUT1JZX0VORCk7aWYoZTwwKXRocm93IXRoaXMuaXNTaWduYXR1cmUoMCxzLkxPQ0FMX0ZJTEVfSEVBREVSKT9uZXcgRXJyb3IoXCJDYW4ndCBmaW5kIGVuZCBvZiBjZW50cmFsIGRpcmVjdG9yeSA6IGlzIHRoaXMgYSB6aXAgZmlsZSA/IElmIGl0IGlzLCBzZWUgaHR0cHM6Ly9zdHVrLmdpdGh1Yi5pby9qc3ppcC9kb2N1bWVudGF0aW9uL2hvd3RvL3JlYWRfemlwLmh0bWxcIik6bmV3IEVycm9yKFwiQ29ycnVwdGVkIHppcDogY2FuJ3QgZmluZCBlbmQgb2YgY2VudHJhbCBkaXJlY3RvcnlcIik7dGhpcy5yZWFkZXIuc2V0SW5kZXgoZSk7dmFyIHQ9ZTtpZih0aGlzLmNoZWNrU2lnbmF0dXJlKHMuQ0VOVFJBTF9ESVJFQ1RPUllfRU5EKSx0aGlzLnJlYWRCbG9ja0VuZE9mQ2VudHJhbCgpLHRoaXMuZGlza051bWJlcj09PWkuTUFYX1ZBTFVFXzE2QklUU3x8dGhpcy5kaXNrV2l0aENlbnRyYWxEaXJTdGFydD09PWkuTUFYX1ZBTFVFXzE2QklUU3x8dGhpcy5jZW50cmFsRGlyUmVjb3Jkc09uVGhpc0Rpc2s9PT1pLk1BWF9WQUxVRV8xNkJJVFN8fHRoaXMuY2VudHJhbERpclJlY29yZHM9PT1pLk1BWF9WQUxVRV8xNkJJVFN8fHRoaXMuY2VudHJhbERpclNpemU9PT1pLk1BWF9WQUxVRV8zMkJJVFN8fHRoaXMuY2VudHJhbERpck9mZnNldD09PWkuTUFYX1ZBTFVFXzMyQklUUyl7aWYodGhpcy56aXA2ND0hMCwoZT10aGlzLnJlYWRlci5sYXN0SW5kZXhPZlNpZ25hdHVyZShzLlpJUDY0X0NFTlRSQUxfRElSRUNUT1JZX0xPQ0FUT1IpKTwwKXRocm93IG5ldyBFcnJvcihcIkNvcnJ1cHRlZCB6aXA6IGNhbid0IGZpbmQgdGhlIFpJUDY0IGVuZCBvZiBjZW50cmFsIGRpcmVjdG9yeSBsb2NhdG9yXCIpO2lmKHRoaXMucmVhZGVyLnNldEluZGV4KGUpLHRoaXMuY2hlY2tTaWduYXR1cmUocy5aSVA2NF9DRU5UUkFMX0RJUkVDVE9SWV9MT0NBVE9SKSx0aGlzLnJlYWRCbG9ja1ppcDY0RW5kT2ZDZW50cmFsTG9jYXRvcigpLCF0aGlzLmlzU2lnbmF0dXJlKHRoaXMucmVsYXRpdmVPZmZzZXRFbmRPZlppcDY0Q2VudHJhbERpcixzLlpJUDY0X0NFTlRSQUxfRElSRUNUT1JZX0VORCkmJih0aGlzLnJlbGF0aXZlT2Zmc2V0RW5kT2ZaaXA2NENlbnRyYWxEaXI9dGhpcy5yZWFkZXIubGFzdEluZGV4T2ZTaWduYXR1cmUocy5aSVA2NF9DRU5UUkFMX0RJUkVDVE9SWV9FTkQpLHRoaXMucmVsYXRpdmVPZmZzZXRFbmRPZlppcDY0Q2VudHJhbERpcjwwKSl0aHJvdyBuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwOiBjYW4ndCBmaW5kIHRoZSBaSVA2NCBlbmQgb2YgY2VudHJhbCBkaXJlY3RvcnlcIik7dGhpcy5yZWFkZXIuc2V0SW5kZXgodGhpcy5yZWxhdGl2ZU9mZnNldEVuZE9mWmlwNjRDZW50cmFsRGlyKSx0aGlzLmNoZWNrU2lnbmF0dXJlKHMuWklQNjRfQ0VOVFJBTF9ESVJFQ1RPUllfRU5EKSx0aGlzLnJlYWRCbG9ja1ppcDY0RW5kT2ZDZW50cmFsKCl9dmFyIHI9dGhpcy5jZW50cmFsRGlyT2Zmc2V0K3RoaXMuY2VudHJhbERpclNpemU7dGhpcy56aXA2NCYmKHIrPTIwLHIrPTEyK3RoaXMuemlwNjRFbmRPZkNlbnRyYWxTaXplKTt2YXIgbj10LXI7aWYoMDxuKXRoaXMuaXNTaWduYXR1cmUodCxzLkNFTlRSQUxfRklMRV9IRUFERVIpfHwodGhpcy5yZWFkZXIuemVybz1uKTtlbHNlIGlmKG48MCl0aHJvdyBuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwOiBtaXNzaW5nIFwiK01hdGguYWJzKG4pK1wiIGJ5dGVzLlwiKX0scHJlcGFyZVJlYWRlcjpmdW5jdGlvbihlKXt0aGlzLnJlYWRlcj1uKGUpfSxsb2FkOmZ1bmN0aW9uKGUpe3RoaXMucHJlcGFyZVJlYWRlcihlKSx0aGlzLnJlYWRFbmRPZkNlbnRyYWwoKSx0aGlzLnJlYWRDZW50cmFsRGlyKCksdGhpcy5yZWFkTG9jYWxGaWxlcygpfX0sdC5leHBvcnRzPWh9LHtcIi4vcmVhZGVyL3JlYWRlckZvclwiOjIyLFwiLi9zaWduYXR1cmVcIjoyMyxcIi4vc3VwcG9ydFwiOjMwLFwiLi91dGlsc1wiOjMyLFwiLi96aXBFbnRyeVwiOjM0fV0sMzQ6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgbj1lKFwiLi9yZWFkZXIvcmVhZGVyRm9yXCIpLHM9ZShcIi4vdXRpbHNcIiksaT1lKFwiLi9jb21wcmVzc2VkT2JqZWN0XCIpLGE9ZShcIi4vY3JjMzJcIiksbz1lKFwiLi91dGY4XCIpLGg9ZShcIi4vY29tcHJlc3Npb25zXCIpLHU9ZShcIi4vc3VwcG9ydFwiKTtmdW5jdGlvbiBsKGUsdCl7dGhpcy5vcHRpb25zPWUsdGhpcy5sb2FkT3B0aW9ucz10fWwucHJvdG90eXBlPXtpc0VuY3J5cHRlZDpmdW5jdGlvbigpe3JldHVybiAxPT0oMSZ0aGlzLmJpdEZsYWcpfSx1c2VVVEY4OmZ1bmN0aW9uKCl7cmV0dXJuIDIwNDg9PSgyMDQ4JnRoaXMuYml0RmxhZyl9LHJlYWRMb2NhbFBhcnQ6ZnVuY3Rpb24oZSl7dmFyIHQscjtpZihlLnNraXAoMjIpLHRoaXMuZmlsZU5hbWVMZW5ndGg9ZS5yZWFkSW50KDIpLHI9ZS5yZWFkSW50KDIpLHRoaXMuZmlsZU5hbWU9ZS5yZWFkRGF0YSh0aGlzLmZpbGVOYW1lTGVuZ3RoKSxlLnNraXAociksLTE9PT10aGlzLmNvbXByZXNzZWRTaXplfHwtMT09PXRoaXMudW5jb21wcmVzc2VkU2l6ZSl0aHJvdyBuZXcgRXJyb3IoXCJCdWcgb3IgY29ycnVwdGVkIHppcCA6IGRpZG4ndCBnZXQgZW5vdWdoIGluZm9ybWF0aW9uIGZyb20gdGhlIGNlbnRyYWwgZGlyZWN0b3J5IChjb21wcmVzc2VkU2l6ZSA9PT0gLTEgfHwgdW5jb21wcmVzc2VkU2l6ZSA9PT0gLTEpXCIpO2lmKG51bGw9PT0odD1mdW5jdGlvbihlKXtmb3IodmFyIHQgaW4gaClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaCx0KSYmaFt0XS5tYWdpYz09PWUpcmV0dXJuIGhbdF07cmV0dXJuIG51bGx9KHRoaXMuY29tcHJlc3Npb25NZXRob2QpKSl0aHJvdyBuZXcgRXJyb3IoXCJDb3JydXB0ZWQgemlwIDogY29tcHJlc3Npb24gXCIrcy5wcmV0dHkodGhpcy5jb21wcmVzc2lvbk1ldGhvZCkrXCIgdW5rbm93biAoaW5uZXIgZmlsZSA6IFwiK3MudHJhbnNmb3JtVG8oXCJzdHJpbmdcIix0aGlzLmZpbGVOYW1lKStcIilcIik7dGhpcy5kZWNvbXByZXNzZWQ9bmV3IGkodGhpcy5jb21wcmVzc2VkU2l6ZSx0aGlzLnVuY29tcHJlc3NlZFNpemUsdGhpcy5jcmMzMix0LGUucmVhZERhdGEodGhpcy5jb21wcmVzc2VkU2l6ZSkpfSxyZWFkQ2VudHJhbFBhcnQ6ZnVuY3Rpb24oZSl7dGhpcy52ZXJzaW9uTWFkZUJ5PWUucmVhZEludCgyKSxlLnNraXAoMiksdGhpcy5iaXRGbGFnPWUucmVhZEludCgyKSx0aGlzLmNvbXByZXNzaW9uTWV0aG9kPWUucmVhZFN0cmluZygyKSx0aGlzLmRhdGU9ZS5yZWFkRGF0ZSgpLHRoaXMuY3JjMzI9ZS5yZWFkSW50KDQpLHRoaXMuY29tcHJlc3NlZFNpemU9ZS5yZWFkSW50KDQpLHRoaXMudW5jb21wcmVzc2VkU2l6ZT1lLnJlYWRJbnQoNCk7dmFyIHQ9ZS5yZWFkSW50KDIpO2lmKHRoaXMuZXh0cmFGaWVsZHNMZW5ndGg9ZS5yZWFkSW50KDIpLHRoaXMuZmlsZUNvbW1lbnRMZW5ndGg9ZS5yZWFkSW50KDIpLHRoaXMuZGlza051bWJlclN0YXJ0PWUucmVhZEludCgyKSx0aGlzLmludGVybmFsRmlsZUF0dHJpYnV0ZXM9ZS5yZWFkSW50KDIpLHRoaXMuZXh0ZXJuYWxGaWxlQXR0cmlidXRlcz1lLnJlYWRJbnQoNCksdGhpcy5sb2NhbEhlYWRlck9mZnNldD1lLnJlYWRJbnQoNCksdGhpcy5pc0VuY3J5cHRlZCgpKXRocm93IG5ldyBFcnJvcihcIkVuY3J5cHRlZCB6aXAgYXJlIG5vdCBzdXBwb3J0ZWRcIik7ZS5za2lwKHQpLHRoaXMucmVhZEV4dHJhRmllbGRzKGUpLHRoaXMucGFyc2VaSVA2NEV4dHJhRmllbGQoZSksdGhpcy5maWxlQ29tbWVudD1lLnJlYWREYXRhKHRoaXMuZmlsZUNvbW1lbnRMZW5ndGgpfSxwcm9jZXNzQXR0cmlidXRlczpmdW5jdGlvbigpe3RoaXMudW5peFBlcm1pc3Npb25zPW51bGwsdGhpcy5kb3NQZXJtaXNzaW9ucz1udWxsO3ZhciBlPXRoaXMudmVyc2lvbk1hZGVCeT4+ODt0aGlzLmRpcj0hISgxNiZ0aGlzLmV4dGVybmFsRmlsZUF0dHJpYnV0ZXMpLDA9PWUmJih0aGlzLmRvc1Blcm1pc3Npb25zPTYzJnRoaXMuZXh0ZXJuYWxGaWxlQXR0cmlidXRlcyksMz09ZSYmKHRoaXMudW5peFBlcm1pc3Npb25zPXRoaXMuZXh0ZXJuYWxGaWxlQXR0cmlidXRlcz4+MTYmNjU1MzUpLHRoaXMuZGlyfHxcIi9cIiE9PXRoaXMuZmlsZU5hbWVTdHIuc2xpY2UoLTEpfHwodGhpcy5kaXI9ITApfSxwYXJzZVpJUDY0RXh0cmFGaWVsZDpmdW5jdGlvbigpe2lmKHRoaXMuZXh0cmFGaWVsZHNbMV0pe3ZhciBlPW4odGhpcy5leHRyYUZpZWxkc1sxXS52YWx1ZSk7dGhpcy51bmNvbXByZXNzZWRTaXplPT09cy5NQVhfVkFMVUVfMzJCSVRTJiYodGhpcy51bmNvbXByZXNzZWRTaXplPWUucmVhZEludCg4KSksdGhpcy5jb21wcmVzc2VkU2l6ZT09PXMuTUFYX1ZBTFVFXzMyQklUUyYmKHRoaXMuY29tcHJlc3NlZFNpemU9ZS5yZWFkSW50KDgpKSx0aGlzLmxvY2FsSGVhZGVyT2Zmc2V0PT09cy5NQVhfVkFMVUVfMzJCSVRTJiYodGhpcy5sb2NhbEhlYWRlck9mZnNldD1lLnJlYWRJbnQoOCkpLHRoaXMuZGlza051bWJlclN0YXJ0PT09cy5NQVhfVkFMVUVfMzJCSVRTJiYodGhpcy5kaXNrTnVtYmVyU3RhcnQ9ZS5yZWFkSW50KDQpKX19LHJlYWRFeHRyYUZpZWxkczpmdW5jdGlvbihlKXt2YXIgdCxyLG4saT1lLmluZGV4K3RoaXMuZXh0cmFGaWVsZHNMZW5ndGg7Zm9yKHRoaXMuZXh0cmFGaWVsZHN8fCh0aGlzLmV4dHJhRmllbGRzPXt9KTtlLmluZGV4KzQ8aTspdD1lLnJlYWRJbnQoMikscj1lLnJlYWRJbnQoMiksbj1lLnJlYWREYXRhKHIpLHRoaXMuZXh0cmFGaWVsZHNbdF09e2lkOnQsbGVuZ3RoOnIsdmFsdWU6bn07ZS5zZXRJbmRleChpKX0saGFuZGxlVVRGODpmdW5jdGlvbigpe3ZhciBlPXUudWludDhhcnJheT9cInVpbnQ4YXJyYXlcIjpcImFycmF5XCI7aWYodGhpcy51c2VVVEY4KCkpdGhpcy5maWxlTmFtZVN0cj1vLnV0ZjhkZWNvZGUodGhpcy5maWxlTmFtZSksdGhpcy5maWxlQ29tbWVudFN0cj1vLnV0ZjhkZWNvZGUodGhpcy5maWxlQ29tbWVudCk7ZWxzZXt2YXIgdD10aGlzLmZpbmRFeHRyYUZpZWxkVW5pY29kZVBhdGgoKTtpZihudWxsIT09dCl0aGlzLmZpbGVOYW1lU3RyPXQ7ZWxzZXt2YXIgcj1zLnRyYW5zZm9ybVRvKGUsdGhpcy5maWxlTmFtZSk7dGhpcy5maWxlTmFtZVN0cj10aGlzLmxvYWRPcHRpb25zLmRlY29kZUZpbGVOYW1lKHIpfXZhciBuPXRoaXMuZmluZEV4dHJhRmllbGRVbmljb2RlQ29tbWVudCgpO2lmKG51bGwhPT1uKXRoaXMuZmlsZUNvbW1lbnRTdHI9bjtlbHNle3ZhciBpPXMudHJhbnNmb3JtVG8oZSx0aGlzLmZpbGVDb21tZW50KTt0aGlzLmZpbGVDb21tZW50U3RyPXRoaXMubG9hZE9wdGlvbnMuZGVjb2RlRmlsZU5hbWUoaSl9fX0sZmluZEV4dHJhRmllbGRVbmljb2RlUGF0aDpmdW5jdGlvbigpe3ZhciBlPXRoaXMuZXh0cmFGaWVsZHNbMjg3ODldO2lmKGUpe3ZhciB0PW4oZS52YWx1ZSk7cmV0dXJuIDEhPT10LnJlYWRJbnQoMSk/bnVsbDphKHRoaXMuZmlsZU5hbWUpIT09dC5yZWFkSW50KDQpP251bGw6by51dGY4ZGVjb2RlKHQucmVhZERhdGEoZS5sZW5ndGgtNSkpfXJldHVybiBudWxsfSxmaW5kRXh0cmFGaWVsZFVuaWNvZGVDb21tZW50OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5leHRyYUZpZWxkc1syNTQ2MV07aWYoZSl7dmFyIHQ9bihlLnZhbHVlKTtyZXR1cm4gMSE9PXQucmVhZEludCgxKT9udWxsOmEodGhpcy5maWxlQ29tbWVudCkhPT10LnJlYWRJbnQoNCk/bnVsbDpvLnV0ZjhkZWNvZGUodC5yZWFkRGF0YShlLmxlbmd0aC01KSl9cmV0dXJuIG51bGx9fSx0LmV4cG9ydHM9bH0se1wiLi9jb21wcmVzc2VkT2JqZWN0XCI6MixcIi4vY29tcHJlc3Npb25zXCI6MyxcIi4vY3JjMzJcIjo0LFwiLi9yZWFkZXIvcmVhZGVyRm9yXCI6MjIsXCIuL3N1cHBvcnRcIjozMCxcIi4vdXRmOFwiOjMxLFwiLi91dGlsc1wiOjMyfV0sMzU6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKGUsdCxyKXt0aGlzLm5hbWU9ZSx0aGlzLmRpcj1yLmRpcix0aGlzLmRhdGU9ci5kYXRlLHRoaXMuY29tbWVudD1yLmNvbW1lbnQsdGhpcy51bml4UGVybWlzc2lvbnM9ci51bml4UGVybWlzc2lvbnMsdGhpcy5kb3NQZXJtaXNzaW9ucz1yLmRvc1Blcm1pc3Npb25zLHRoaXMuX2RhdGE9dCx0aGlzLl9kYXRhQmluYXJ5PXIuYmluYXJ5LHRoaXMub3B0aW9ucz17Y29tcHJlc3Npb246ci5jb21wcmVzc2lvbixjb21wcmVzc2lvbk9wdGlvbnM6ci5jb21wcmVzc2lvbk9wdGlvbnN9fXZhciBzPWUoXCIuL3N0cmVhbS9TdHJlYW1IZWxwZXJcIiksaT1lKFwiLi9zdHJlYW0vRGF0YVdvcmtlclwiKSxhPWUoXCIuL3V0ZjhcIiksbz1lKFwiLi9jb21wcmVzc2VkT2JqZWN0XCIpLGg9ZShcIi4vc3RyZWFtL0dlbmVyaWNXb3JrZXJcIik7bi5wcm90b3R5cGU9e2ludGVybmFsU3RyZWFtOmZ1bmN0aW9uKGUpe3ZhciB0PW51bGwscj1cInN0cmluZ1wiO3RyeXtpZighZSl0aHJvdyBuZXcgRXJyb3IoXCJObyBvdXRwdXQgdHlwZSBzcGVjaWZpZWQuXCIpO3ZhciBuPVwic3RyaW5nXCI9PT0ocj1lLnRvTG93ZXJDYXNlKCkpfHxcInRleHRcIj09PXI7XCJiaW5hcnlzdHJpbmdcIiE9PXImJlwidGV4dFwiIT09cnx8KHI9XCJzdHJpbmdcIiksdD10aGlzLl9kZWNvbXByZXNzV29ya2VyKCk7dmFyIGk9IXRoaXMuX2RhdGFCaW5hcnk7aSYmIW4mJih0PXQucGlwZShuZXcgYS5VdGY4RW5jb2RlV29ya2VyKSksIWkmJm4mJih0PXQucGlwZShuZXcgYS5VdGY4RGVjb2RlV29ya2VyKSl9Y2F0Y2goZSl7KHQ9bmV3IGgoXCJlcnJvclwiKSkuZXJyb3IoZSl9cmV0dXJuIG5ldyBzKHQscixcIlwiKX0sYXN5bmM6ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5pbnRlcm5hbFN0cmVhbShlKS5hY2N1bXVsYXRlKHQpfSxub2RlU3RyZWFtOmZ1bmN0aW9uKGUsdCl7cmV0dXJuIHRoaXMuaW50ZXJuYWxTdHJlYW0oZXx8XCJub2RlYnVmZmVyXCIpLnRvTm9kZWpzU3RyZWFtKHQpfSxfY29tcHJlc3NXb3JrZXI6ZnVuY3Rpb24oZSx0KXtpZih0aGlzLl9kYXRhIGluc3RhbmNlb2YgbyYmdGhpcy5fZGF0YS5jb21wcmVzc2lvbi5tYWdpYz09PWUubWFnaWMpcmV0dXJuIHRoaXMuX2RhdGEuZ2V0Q29tcHJlc3NlZFdvcmtlcigpO3ZhciByPXRoaXMuX2RlY29tcHJlc3NXb3JrZXIoKTtyZXR1cm4gdGhpcy5fZGF0YUJpbmFyeXx8KHI9ci5waXBlKG5ldyBhLlV0ZjhFbmNvZGVXb3JrZXIpKSxvLmNyZWF0ZVdvcmtlckZyb20ocixlLHQpfSxfZGVjb21wcmVzc1dvcmtlcjpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9kYXRhIGluc3RhbmNlb2Ygbz90aGlzLl9kYXRhLmdldENvbnRlbnRXb3JrZXIoKTp0aGlzLl9kYXRhIGluc3RhbmNlb2YgaD90aGlzLl9kYXRhOm5ldyBpKHRoaXMuX2RhdGEpfX07Zm9yKHZhciB1PVtcImFzVGV4dFwiLFwiYXNCaW5hcnlcIixcImFzTm9kZUJ1ZmZlclwiLFwiYXNVaW50OEFycmF5XCIsXCJhc0FycmF5QnVmZmVyXCJdLGw9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIG1ldGhvZCBoYXMgYmVlbiByZW1vdmVkIGluIEpTWmlwIDMuMCwgcGxlYXNlIGNoZWNrIHRoZSB1cGdyYWRlIGd1aWRlLlwiKX0sZj0wO2Y8dS5sZW5ndGg7ZisrKW4ucHJvdG90eXBlW3VbZl1dPWw7dC5leHBvcnRzPW59LHtcIi4vY29tcHJlc3NlZE9iamVjdFwiOjIsXCIuL3N0cmVhbS9EYXRhV29ya2VyXCI6MjcsXCIuL3N0cmVhbS9HZW5lcmljV29ya2VyXCI6MjgsXCIuL3N0cmVhbS9TdHJlYW1IZWxwZXJcIjoyOSxcIi4vdXRmOFwiOjMxfV0sMzY6W2Z1bmN0aW9uKGUsbCx0KXsoZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHIsbixlPXQuTXV0YXRpb25PYnNlcnZlcnx8dC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO2lmKGUpe3ZhciBpPTAscz1uZXcgZSh1KSxhPXQuZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7cy5vYnNlcnZlKGEse2NoYXJhY3RlckRhdGE6ITB9KSxyPWZ1bmN0aW9uKCl7YS5kYXRhPWk9KytpJTJ9fWVsc2UgaWYodC5zZXRJbW1lZGlhdGV8fHZvaWQgMD09PXQuTWVzc2FnZUNoYW5uZWwpcj1cImRvY3VtZW50XCJpbiB0JiZcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiaW4gdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpP2Z1bmN0aW9uKCl7dmFyIGU9dC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO2Uub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7dSgpLGUub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGUpLGU9bnVsbH0sdC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoZSl9OmZ1bmN0aW9uKCl7c2V0VGltZW91dCh1LDApfTtlbHNle3ZhciBvPW5ldyB0Lk1lc3NhZ2VDaGFubmVsO28ucG9ydDEub25tZXNzYWdlPXUscj1mdW5jdGlvbigpe28ucG9ydDIucG9zdE1lc3NhZ2UoMCl9fXZhciBoPVtdO2Z1bmN0aW9uIHUoKXt2YXIgZSx0O249ITA7Zm9yKHZhciByPWgubGVuZ3RoO3I7KXtmb3IodD1oLGg9W10sZT0tMTsrK2U8cjspdFtlXSgpO3I9aC5sZW5ndGh9bj0hMX1sLmV4cG9ydHM9ZnVuY3Rpb24oZSl7MSE9PWgucHVzaChlKXx8bnx8cigpfX0pLmNhbGwodGhpcyxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9KX0se31dLDM3OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGk9ZShcImltbWVkaWF0ZVwiKTtmdW5jdGlvbiB1KCl7fXZhciBsPXt9LHM9W1wiUkVKRUNURURcIl0sYT1bXCJGVUxGSUxMRURcIl0sbj1bXCJQRU5ESU5HXCJdO2Z1bmN0aW9uIG8oZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVzb2x2ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO3RoaXMuc3RhdGU9bix0aGlzLnF1ZXVlPVtdLHRoaXMub3V0Y29tZT12b2lkIDAsZSE9PXUmJmQodGhpcyxlKX1mdW5jdGlvbiBoKGUsdCxyKXt0aGlzLnByb21pc2U9ZSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYodGhpcy5vbkZ1bGZpbGxlZD10LHRoaXMuY2FsbEZ1bGZpbGxlZD10aGlzLm90aGVyQ2FsbEZ1bGZpbGxlZCksXCJmdW5jdGlvblwiPT10eXBlb2YgciYmKHRoaXMub25SZWplY3RlZD1yLHRoaXMuY2FsbFJlamVjdGVkPXRoaXMub3RoZXJDYWxsUmVqZWN0ZWQpfWZ1bmN0aW9uIGYodCxyLG4pe2koZnVuY3Rpb24oKXt2YXIgZTt0cnl7ZT1yKG4pfWNhdGNoKGUpe3JldHVybiBsLnJlamVjdCh0LGUpfWU9PT10P2wucmVqZWN0KHQsbmV3IFR5cGVFcnJvcihcIkNhbm5vdCByZXNvbHZlIHByb21pc2Ugd2l0aCBpdHNlbGZcIikpOmwucmVzb2x2ZSh0LGUpfSl9ZnVuY3Rpb24gYyhlKXt2YXIgdD1lJiZlLnRoZW47aWYoZSYmKFwib2JqZWN0XCI9PXR5cGVvZiBlfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBlKSYmXCJmdW5jdGlvblwiPT10eXBlb2YgdClyZXR1cm4gZnVuY3Rpb24oKXt0LmFwcGx5KGUsYXJndW1lbnRzKX19ZnVuY3Rpb24gZCh0LGUpe3ZhciByPSExO2Z1bmN0aW9uIG4oZSl7cnx8KHI9ITAsbC5yZWplY3QodCxlKSl9ZnVuY3Rpb24gaShlKXtyfHwocj0hMCxsLnJlc29sdmUodCxlKSl9dmFyIHM9cChmdW5jdGlvbigpe2UoaSxuKX0pO1wiZXJyb3JcIj09PXMuc3RhdHVzJiZuKHMudmFsdWUpfWZ1bmN0aW9uIHAoZSx0KXt2YXIgcj17fTt0cnl7ci52YWx1ZT1lKHQpLHIuc3RhdHVzPVwic3VjY2Vzc1wifWNhdGNoKGUpe3Iuc3RhdHVzPVwiZXJyb3JcIixyLnZhbHVlPWV9cmV0dXJuIHJ9KHQuZXhwb3J0cz1vKS5wcm90b3R5cGUuZmluYWxseT1mdW5jdGlvbih0KXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybiB0aGlzO3ZhciByPXRoaXMuY29uc3RydWN0b3I7cmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbihlKXtyZXR1cm4gci5yZXNvbHZlKHQoKSkudGhlbihmdW5jdGlvbigpe3JldHVybiBlfSl9LGZ1bmN0aW9uKGUpe3JldHVybiByLnJlc29sdmUodCgpKS50aGVuKGZ1bmN0aW9uKCl7dGhyb3cgZX0pfSl9LG8ucHJvdG90eXBlLmNhdGNoPWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLnRoZW4obnVsbCxlKX0sby5wcm90b3R5cGUudGhlbj1mdW5jdGlvbihlLHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJnRoaXMuc3RhdGU9PT1hfHxcImZ1bmN0aW9uXCIhPXR5cGVvZiB0JiZ0aGlzLnN0YXRlPT09cylyZXR1cm4gdGhpczt2YXIgcj1uZXcgdGhpcy5jb25zdHJ1Y3Rvcih1KTt0aGlzLnN0YXRlIT09bj9mKHIsdGhpcy5zdGF0ZT09PWE/ZTp0LHRoaXMub3V0Y29tZSk6dGhpcy5xdWV1ZS5wdXNoKG5ldyBoKHIsZSx0KSk7cmV0dXJuIHJ9LGgucHJvdG90eXBlLmNhbGxGdWxmaWxsZWQ9ZnVuY3Rpb24oZSl7bC5yZXNvbHZlKHRoaXMucHJvbWlzZSxlKX0saC5wcm90b3R5cGUub3RoZXJDYWxsRnVsZmlsbGVkPWZ1bmN0aW9uKGUpe2YodGhpcy5wcm9taXNlLHRoaXMub25GdWxmaWxsZWQsZSl9LGgucHJvdG90eXBlLmNhbGxSZWplY3RlZD1mdW5jdGlvbihlKXtsLnJlamVjdCh0aGlzLnByb21pc2UsZSl9LGgucHJvdG90eXBlLm90aGVyQ2FsbFJlamVjdGVkPWZ1bmN0aW9uKGUpe2YodGhpcy5wcm9taXNlLHRoaXMub25SZWplY3RlZCxlKX0sbC5yZXNvbHZlPWZ1bmN0aW9uKGUsdCl7dmFyIHI9cChjLHQpO2lmKFwiZXJyb3JcIj09PXIuc3RhdHVzKXJldHVybiBsLnJlamVjdChlLHIudmFsdWUpO3ZhciBuPXIudmFsdWU7aWYobilkKGUsbik7ZWxzZXtlLnN0YXRlPWEsZS5vdXRjb21lPXQ7Zm9yKHZhciBpPS0xLHM9ZS5xdWV1ZS5sZW5ndGg7KytpPHM7KWUucXVldWVbaV0uY2FsbEZ1bGZpbGxlZCh0KX1yZXR1cm4gZX0sbC5yZWplY3Q9ZnVuY3Rpb24oZSx0KXtlLnN0YXRlPXMsZS5vdXRjb21lPXQ7Zm9yKHZhciByPS0xLG49ZS5xdWV1ZS5sZW5ndGg7KytyPG47KWUucXVldWVbcl0uY2FsbFJlamVjdGVkKHQpO3JldHVybiBlfSxvLnJlc29sdmU9ZnVuY3Rpb24oZSl7aWYoZSBpbnN0YW5jZW9mIHRoaXMpcmV0dXJuIGU7cmV0dXJuIGwucmVzb2x2ZShuZXcgdGhpcyh1KSxlKX0sby5yZWplY3Q9ZnVuY3Rpb24oZSl7dmFyIHQ9bmV3IHRoaXModSk7cmV0dXJuIGwucmVqZWN0KHQsZSl9LG8uYWxsPWZ1bmN0aW9uKGUpe3ZhciByPXRoaXM7aWYoXCJbb2JqZWN0IEFycmF5XVwiIT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpKXJldHVybiB0aGlzLnJlamVjdChuZXcgVHlwZUVycm9yKFwibXVzdCBiZSBhbiBhcnJheVwiKSk7dmFyIG49ZS5sZW5ndGgsaT0hMTtpZighbilyZXR1cm4gdGhpcy5yZXNvbHZlKFtdKTt2YXIgcz1uZXcgQXJyYXkobiksYT0wLHQ9LTEsbz1uZXcgdGhpcyh1KTtmb3IoOysrdDxuOyloKGVbdF0sdCk7cmV0dXJuIG87ZnVuY3Rpb24gaChlLHQpe3IucmVzb2x2ZShlKS50aGVuKGZ1bmN0aW9uKGUpe3NbdF09ZSwrK2EhPT1ufHxpfHwoaT0hMCxsLnJlc29sdmUobyxzKSl9LGZ1bmN0aW9uKGUpe2l8fChpPSEwLGwucmVqZWN0KG8sZSkpfSl9fSxvLnJhY2U9ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcztpZihcIltvYmplY3QgQXJyYXldXCIhPT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSkpcmV0dXJuIHRoaXMucmVqZWN0KG5ldyBUeXBlRXJyb3IoXCJtdXN0IGJlIGFuIGFycmF5XCIpKTt2YXIgcj1lLmxlbmd0aCxuPSExO2lmKCFyKXJldHVybiB0aGlzLnJlc29sdmUoW10pO3ZhciBpPS0xLHM9bmV3IHRoaXModSk7Zm9yKDsrK2k8cjspYT1lW2ldLHQucmVzb2x2ZShhKS50aGVuKGZ1bmN0aW9uKGUpe258fChuPSEwLGwucmVzb2x2ZShzLGUpKX0sZnVuY3Rpb24oZSl7bnx8KG49ITAsbC5yZWplY3QocyxlKSl9KTt2YXIgYTtyZXR1cm4gc319LHtpbW1lZGlhdGU6MzZ9XSwzODpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBuPXt9OygwLGUoXCIuL2xpYi91dGlscy9jb21tb25cIikuYXNzaWduKShuLGUoXCIuL2xpYi9kZWZsYXRlXCIpLGUoXCIuL2xpYi9pbmZsYXRlXCIpLGUoXCIuL2xpYi96bGliL2NvbnN0YW50c1wiKSksdC5leHBvcnRzPW59LHtcIi4vbGliL2RlZmxhdGVcIjozOSxcIi4vbGliL2luZmxhdGVcIjo0MCxcIi4vbGliL3V0aWxzL2NvbW1vblwiOjQxLFwiLi9saWIvemxpYi9jb25zdGFudHNcIjo0NH1dLDM5OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGE9ZShcIi4vemxpYi9kZWZsYXRlXCIpLG89ZShcIi4vdXRpbHMvY29tbW9uXCIpLGg9ZShcIi4vdXRpbHMvc3RyaW5nc1wiKSxpPWUoXCIuL3psaWIvbWVzc2FnZXNcIikscz1lKFwiLi96bGliL3pzdHJlYW1cIiksdT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLGw9MCxmPS0xLGM9MCxkPTg7ZnVuY3Rpb24gcChlKXtpZighKHRoaXMgaW5zdGFuY2VvZiBwKSlyZXR1cm4gbmV3IHAoZSk7dGhpcy5vcHRpb25zPW8uYXNzaWduKHtsZXZlbDpmLG1ldGhvZDpkLGNodW5rU2l6ZToxNjM4NCx3aW5kb3dCaXRzOjE1LG1lbUxldmVsOjgsc3RyYXRlZ3k6Yyx0bzpcIlwifSxlfHx7fSk7dmFyIHQ9dGhpcy5vcHRpb25zO3QucmF3JiYwPHQud2luZG93Qml0cz90LndpbmRvd0JpdHM9LXQud2luZG93Qml0czp0Lmd6aXAmJjA8dC53aW5kb3dCaXRzJiZ0LndpbmRvd0JpdHM8MTYmJih0LndpbmRvd0JpdHMrPTE2KSx0aGlzLmVycj0wLHRoaXMubXNnPVwiXCIsdGhpcy5lbmRlZD0hMSx0aGlzLmNodW5rcz1bXSx0aGlzLnN0cm09bmV3IHMsdGhpcy5zdHJtLmF2YWlsX291dD0wO3ZhciByPWEuZGVmbGF0ZUluaXQyKHRoaXMuc3RybSx0LmxldmVsLHQubWV0aG9kLHQud2luZG93Qml0cyx0Lm1lbUxldmVsLHQuc3RyYXRlZ3kpO2lmKHIhPT1sKXRocm93IG5ldyBFcnJvcihpW3JdKTtpZih0LmhlYWRlciYmYS5kZWZsYXRlU2V0SGVhZGVyKHRoaXMuc3RybSx0LmhlYWRlciksdC5kaWN0aW9uYXJ5KXt2YXIgbjtpZihuPVwic3RyaW5nXCI9PXR5cGVvZiB0LmRpY3Rpb25hcnk/aC5zdHJpbmcyYnVmKHQuZGljdGlvbmFyeSk6XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiPT09dS5jYWxsKHQuZGljdGlvbmFyeSk/bmV3IFVpbnQ4QXJyYXkodC5kaWN0aW9uYXJ5KTp0LmRpY3Rpb25hcnksKHI9YS5kZWZsYXRlU2V0RGljdGlvbmFyeSh0aGlzLnN0cm0sbikpIT09bCl0aHJvdyBuZXcgRXJyb3IoaVtyXSk7dGhpcy5fZGljdF9zZXQ9ITB9fWZ1bmN0aW9uIG4oZSx0KXt2YXIgcj1uZXcgcCh0KTtpZihyLnB1c2goZSwhMCksci5lcnIpdGhyb3cgci5tc2d8fGlbci5lcnJdO3JldHVybiByLnJlc3VsdH1wLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpPXRoaXMuc3RybSxzPXRoaXMub3B0aW9ucy5jaHVua1NpemU7aWYodGhpcy5lbmRlZClyZXR1cm4hMTtuPXQ9PT1+fnQ/dDohMD09PXQ/NDowLFwic3RyaW5nXCI9PXR5cGVvZiBlP2kuaW5wdXQ9aC5zdHJpbmcyYnVmKGUpOlwiW29iamVjdCBBcnJheUJ1ZmZlcl1cIj09PXUuY2FsbChlKT9pLmlucHV0PW5ldyBVaW50OEFycmF5KGUpOmkuaW5wdXQ9ZSxpLm5leHRfaW49MCxpLmF2YWlsX2luPWkuaW5wdXQubGVuZ3RoO2Rve2lmKDA9PT1pLmF2YWlsX291dCYmKGkub3V0cHV0PW5ldyBvLkJ1ZjgocyksaS5uZXh0X291dD0wLGkuYXZhaWxfb3V0PXMpLDEhPT0ocj1hLmRlZmxhdGUoaSxuKSkmJnIhPT1sKXJldHVybiB0aGlzLm9uRW5kKHIpLCEodGhpcy5lbmRlZD0hMCk7MCE9PWkuYXZhaWxfb3V0JiYoMCE9PWkuYXZhaWxfaW58fDQhPT1uJiYyIT09bil8fChcInN0cmluZ1wiPT09dGhpcy5vcHRpb25zLnRvP3RoaXMub25EYXRhKGguYnVmMmJpbnN0cmluZyhvLnNocmlua0J1ZihpLm91dHB1dCxpLm5leHRfb3V0KSkpOnRoaXMub25EYXRhKG8uc2hyaW5rQnVmKGkub3V0cHV0LGkubmV4dF9vdXQpKSl9d2hpbGUoKDA8aS5hdmFpbF9pbnx8MD09PWkuYXZhaWxfb3V0KSYmMSE9PXIpO3JldHVybiA0PT09bj8ocj1hLmRlZmxhdGVFbmQodGhpcy5zdHJtKSx0aGlzLm9uRW5kKHIpLHRoaXMuZW5kZWQ9ITAscj09PWwpOjIhPT1ufHwodGhpcy5vbkVuZChsKSwhKGkuYXZhaWxfb3V0PTApKX0scC5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKGUpe3RoaXMuY2h1bmtzLnB1c2goZSl9LHAucHJvdG90eXBlLm9uRW5kPWZ1bmN0aW9uKGUpe2U9PT1sJiYoXCJzdHJpbmdcIj09PXRoaXMub3B0aW9ucy50bz90aGlzLnJlc3VsdD10aGlzLmNodW5rcy5qb2luKFwiXCIpOnRoaXMucmVzdWx0PW8uZmxhdHRlbkNodW5rcyh0aGlzLmNodW5rcykpLHRoaXMuY2h1bmtzPVtdLHRoaXMuZXJyPWUsdGhpcy5tc2c9dGhpcy5zdHJtLm1zZ30sci5EZWZsYXRlPXAsci5kZWZsYXRlPW4sci5kZWZsYXRlUmF3PWZ1bmN0aW9uKGUsdCl7cmV0dXJuKHQ9dHx8e30pLnJhdz0hMCxuKGUsdCl9LHIuZ3ppcD1mdW5jdGlvbihlLHQpe3JldHVybih0PXR8fHt9KS5nemlwPSEwLG4oZSx0KX19LHtcIi4vdXRpbHMvY29tbW9uXCI6NDEsXCIuL3V0aWxzL3N0cmluZ3NcIjo0MixcIi4vemxpYi9kZWZsYXRlXCI6NDYsXCIuL3psaWIvbWVzc2FnZXNcIjo1MSxcIi4vemxpYi96c3RyZWFtXCI6NTN9XSw0MDpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBjPWUoXCIuL3psaWIvaW5mbGF0ZVwiKSxkPWUoXCIuL3V0aWxzL2NvbW1vblwiKSxwPWUoXCIuL3V0aWxzL3N0cmluZ3NcIiksbT1lKFwiLi96bGliL2NvbnN0YW50c1wiKSxuPWUoXCIuL3psaWIvbWVzc2FnZXNcIiksaT1lKFwiLi96bGliL3pzdHJlYW1cIikscz1lKFwiLi96bGliL2d6aGVhZGVyXCIpLF89T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztmdW5jdGlvbiBhKGUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIGEpKXJldHVybiBuZXcgYShlKTt0aGlzLm9wdGlvbnM9ZC5hc3NpZ24oe2NodW5rU2l6ZToxNjM4NCx3aW5kb3dCaXRzOjAsdG86XCJcIn0sZXx8e30pO3ZhciB0PXRoaXMub3B0aW9uczt0LnJhdyYmMDw9dC53aW5kb3dCaXRzJiZ0LndpbmRvd0JpdHM8MTYmJih0LndpbmRvd0JpdHM9LXQud2luZG93Qml0cywwPT09dC53aW5kb3dCaXRzJiYodC53aW5kb3dCaXRzPS0xNSkpLCEoMDw9dC53aW5kb3dCaXRzJiZ0LndpbmRvd0JpdHM8MTYpfHxlJiZlLndpbmRvd0JpdHN8fCh0LndpbmRvd0JpdHMrPTMyKSwxNTx0LndpbmRvd0JpdHMmJnQud2luZG93Qml0czw0OCYmMD09KDE1JnQud2luZG93Qml0cykmJih0LndpbmRvd0JpdHN8PTE1KSx0aGlzLmVycj0wLHRoaXMubXNnPVwiXCIsdGhpcy5lbmRlZD0hMSx0aGlzLmNodW5rcz1bXSx0aGlzLnN0cm09bmV3IGksdGhpcy5zdHJtLmF2YWlsX291dD0wO3ZhciByPWMuaW5mbGF0ZUluaXQyKHRoaXMuc3RybSx0LndpbmRvd0JpdHMpO2lmKHIhPT1tLlpfT0spdGhyb3cgbmV3IEVycm9yKG5bcl0pO3RoaXMuaGVhZGVyPW5ldyBzLGMuaW5mbGF0ZUdldEhlYWRlcih0aGlzLnN0cm0sdGhpcy5oZWFkZXIpfWZ1bmN0aW9uIG8oZSx0KXt2YXIgcj1uZXcgYSh0KTtpZihyLnB1c2goZSwhMCksci5lcnIpdGhyb3cgci5tc2d8fG5bci5lcnJdO3JldHVybiByLnJlc3VsdH1hLnByb3RvdHlwZS5wdXNoPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYSxvLGg9dGhpcy5zdHJtLHU9dGhpcy5vcHRpb25zLmNodW5rU2l6ZSxsPXRoaXMub3B0aW9ucy5kaWN0aW9uYXJ5LGY9ITE7aWYodGhpcy5lbmRlZClyZXR1cm4hMTtuPXQ9PT1+fnQ/dDohMD09PXQ/bS5aX0ZJTklTSDptLlpfTk9fRkxVU0gsXCJzdHJpbmdcIj09dHlwZW9mIGU/aC5pbnB1dD1wLmJpbnN0cmluZzJidWYoZSk6XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiPT09Xy5jYWxsKGUpP2guaW5wdXQ9bmV3IFVpbnQ4QXJyYXkoZSk6aC5pbnB1dD1lLGgubmV4dF9pbj0wLGguYXZhaWxfaW49aC5pbnB1dC5sZW5ndGg7ZG97aWYoMD09PWguYXZhaWxfb3V0JiYoaC5vdXRwdXQ9bmV3IGQuQnVmOCh1KSxoLm5leHRfb3V0PTAsaC5hdmFpbF9vdXQ9dSksKHI9Yy5pbmZsYXRlKGgsbS5aX05PX0ZMVVNIKSk9PT1tLlpfTkVFRF9ESUNUJiZsJiYobz1cInN0cmluZ1wiPT10eXBlb2YgbD9wLnN0cmluZzJidWYobCk6XCJbb2JqZWN0IEFycmF5QnVmZmVyXVwiPT09Xy5jYWxsKGwpP25ldyBVaW50OEFycmF5KGwpOmwscj1jLmluZmxhdGVTZXREaWN0aW9uYXJ5KHRoaXMuc3RybSxvKSkscj09PW0uWl9CVUZfRVJST1ImJiEwPT09ZiYmKHI9bS5aX09LLGY9ITEpLHIhPT1tLlpfU1RSRUFNX0VORCYmciE9PW0uWl9PSylyZXR1cm4gdGhpcy5vbkVuZChyKSwhKHRoaXMuZW5kZWQ9ITApO2gubmV4dF9vdXQmJigwIT09aC5hdmFpbF9vdXQmJnIhPT1tLlpfU1RSRUFNX0VORCYmKDAhPT1oLmF2YWlsX2lufHxuIT09bS5aX0ZJTklTSCYmbiE9PW0uWl9TWU5DX0ZMVVNIKXx8KFwic3RyaW5nXCI9PT10aGlzLm9wdGlvbnMudG8/KGk9cC51dGY4Ym9yZGVyKGgub3V0cHV0LGgubmV4dF9vdXQpLHM9aC5uZXh0X291dC1pLGE9cC5idWYyc3RyaW5nKGgub3V0cHV0LGkpLGgubmV4dF9vdXQ9cyxoLmF2YWlsX291dD11LXMscyYmZC5hcnJheVNldChoLm91dHB1dCxoLm91dHB1dCxpLHMsMCksdGhpcy5vbkRhdGEoYSkpOnRoaXMub25EYXRhKGQuc2hyaW5rQnVmKGgub3V0cHV0LGgubmV4dF9vdXQpKSkpLDA9PT1oLmF2YWlsX2luJiYwPT09aC5hdmFpbF9vdXQmJihmPSEwKX13aGlsZSgoMDxoLmF2YWlsX2lufHwwPT09aC5hdmFpbF9vdXQpJiZyIT09bS5aX1NUUkVBTV9FTkQpO3JldHVybiByPT09bS5aX1NUUkVBTV9FTkQmJihuPW0uWl9GSU5JU0gpLG49PT1tLlpfRklOSVNIPyhyPWMuaW5mbGF0ZUVuZCh0aGlzLnN0cm0pLHRoaXMub25FbmQociksdGhpcy5lbmRlZD0hMCxyPT09bS5aX09LKTpuIT09bS5aX1NZTkNfRkxVU0h8fCh0aGlzLm9uRW5kKG0uWl9PSyksIShoLmF2YWlsX291dD0wKSl9LGEucHJvdG90eXBlLm9uRGF0YT1mdW5jdGlvbihlKXt0aGlzLmNodW5rcy5wdXNoKGUpfSxhLnByb3RvdHlwZS5vbkVuZD1mdW5jdGlvbihlKXtlPT09bS5aX09LJiYoXCJzdHJpbmdcIj09PXRoaXMub3B0aW9ucy50bz90aGlzLnJlc3VsdD10aGlzLmNodW5rcy5qb2luKFwiXCIpOnRoaXMucmVzdWx0PWQuZmxhdHRlbkNodW5rcyh0aGlzLmNodW5rcykpLHRoaXMuY2h1bmtzPVtdLHRoaXMuZXJyPWUsdGhpcy5tc2c9dGhpcy5zdHJtLm1zZ30sci5JbmZsYXRlPWEsci5pbmZsYXRlPW8sci5pbmZsYXRlUmF3PWZ1bmN0aW9uKGUsdCl7cmV0dXJuKHQ9dHx8e30pLnJhdz0hMCxvKGUsdCl9LHIudW5nemlwPW99LHtcIi4vdXRpbHMvY29tbW9uXCI6NDEsXCIuL3V0aWxzL3N0cmluZ3NcIjo0MixcIi4vemxpYi9jb25zdGFudHNcIjo0NCxcIi4vemxpYi9nemhlYWRlclwiOjQ3LFwiLi96bGliL2luZmxhdGVcIjo0OSxcIi4vemxpYi9tZXNzYWdlc1wiOjUxLFwiLi96bGliL3pzdHJlYW1cIjo1M31dLDQxOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIG49XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFVpbnQ4QXJyYXkmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBVaW50MTZBcnJheSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIEludDMyQXJyYXk7ci5hc3NpZ249ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKTt0Lmxlbmd0aDspe3ZhciByPXQuc2hpZnQoKTtpZihyKXtpZihcIm9iamVjdFwiIT10eXBlb2Ygcil0aHJvdyBuZXcgVHlwZUVycm9yKHIrXCJtdXN0IGJlIG5vbi1vYmplY3RcIik7Zm9yKHZhciBuIGluIHIpci5oYXNPd25Qcm9wZXJ0eShuKSYmKGVbbl09cltuXSl9fXJldHVybiBlfSxyLnNocmlua0J1Zj1mdW5jdGlvbihlLHQpe3JldHVybiBlLmxlbmd0aD09PXQ/ZTplLnN1YmFycmF5P2Uuc3ViYXJyYXkoMCx0KTooZS5sZW5ndGg9dCxlKX07dmFyIGk9e2FycmF5U2V0OmZ1bmN0aW9uKGUsdCxyLG4saSl7aWYodC5zdWJhcnJheSYmZS5zdWJhcnJheSllLnNldCh0LnN1YmFycmF5KHIscituKSxpKTtlbHNlIGZvcih2YXIgcz0wO3M8bjtzKyspZVtpK3NdPXRbcitzXX0sZmxhdHRlbkNodW5rczpmdW5jdGlvbihlKXt2YXIgdCxyLG4saSxzLGE7Zm9yKHQ9bj0wLHI9ZS5sZW5ndGg7dDxyO3QrKyluKz1lW3RdLmxlbmd0aDtmb3IoYT1uZXcgVWludDhBcnJheShuKSx0PWk9MCxyPWUubGVuZ3RoO3Q8cjt0Kyspcz1lW3RdLGEuc2V0KHMsaSksaSs9cy5sZW5ndGg7cmV0dXJuIGF9fSxzPXthcnJheVNldDpmdW5jdGlvbihlLHQscixuLGkpe2Zvcih2YXIgcz0wO3M8bjtzKyspZVtpK3NdPXRbcitzXX0sZmxhdHRlbkNodW5rczpmdW5jdGlvbihlKXtyZXR1cm5bXS5jb25jYXQuYXBwbHkoW10sZSl9fTtyLnNldFR5cGVkPWZ1bmN0aW9uKGUpe2U/KHIuQnVmOD1VaW50OEFycmF5LHIuQnVmMTY9VWludDE2QXJyYXksci5CdWYzMj1JbnQzMkFycmF5LHIuYXNzaWduKHIsaSkpOihyLkJ1Zjg9QXJyYXksci5CdWYxNj1BcnJheSxyLkJ1ZjMyPUFycmF5LHIuYXNzaWduKHIscykpfSxyLnNldFR5cGVkKG4pfSx7fV0sNDI6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgaD1lKFwiLi9jb21tb25cIiksaT0hMCxzPSEwO3RyeXtTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsWzBdKX1jYXRjaChlKXtpPSExfXRyeXtTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkoMSkpfWNhdGNoKGUpe3M9ITF9Zm9yKHZhciB1PW5ldyBoLkJ1ZjgoMjU2KSxuPTA7bjwyNTY7bisrKXVbbl09MjUyPD1uPzY6MjQ4PD1uPzU6MjQwPD1uPzQ6MjI0PD1uPzM6MTkyPD1uPzI6MTtmdW5jdGlvbiBsKGUsdCl7aWYodDw2NTUzNyYmKGUuc3ViYXJyYXkmJnN8fCFlLnN1YmFycmF5JiZpKSlyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGguc2hyaW5rQnVmKGUsdCkpO2Zvcih2YXIgcj1cIlwiLG49MDtuPHQ7bisrKXIrPVN0cmluZy5mcm9tQ2hhckNvZGUoZVtuXSk7cmV0dXJuIHJ9dVsyNTRdPXVbMjU0XT0xLHIuc3RyaW5nMmJ1Zj1mdW5jdGlvbihlKXt2YXIgdCxyLG4saSxzLGE9ZS5sZW5ndGgsbz0wO2ZvcihpPTA7aTxhO2krKyk1NTI5Nj09KDY0NTEyJihyPWUuY2hhckNvZGVBdChpKSkpJiZpKzE8YSYmNTYzMjA9PSg2NDUxMiYobj1lLmNoYXJDb2RlQXQoaSsxKSkpJiYocj02NTUzNisoci01NTI5Njw8MTApKyhuLTU2MzIwKSxpKyspLG8rPXI8MTI4PzE6cjwyMDQ4PzI6cjw2NTUzNj8zOjQ7Zm9yKHQ9bmV3IGguQnVmOChvKSxpPXM9MDtzPG87aSsrKTU1Mjk2PT0oNjQ1MTImKHI9ZS5jaGFyQ29kZUF0KGkpKSkmJmkrMTxhJiY1NjMyMD09KDY0NTEyJihuPWUuY2hhckNvZGVBdChpKzEpKSkmJihyPTY1NTM2KyhyLTU1Mjk2PDwxMCkrKG4tNTYzMjApLGkrKykscjwxMjg/dFtzKytdPXI6KHI8MjA0OD90W3MrK109MTkyfHI+Pj42OihyPDY1NTM2P3RbcysrXT0yMjR8cj4+PjEyOih0W3MrK109MjQwfHI+Pj4xOCx0W3MrK109MTI4fHI+Pj4xMiY2MyksdFtzKytdPTEyOHxyPj4+NiY2MyksdFtzKytdPTEyOHw2MyZyKTtyZXR1cm4gdH0sci5idWYyYmluc3RyaW5nPWZ1bmN0aW9uKGUpe3JldHVybiBsKGUsZS5sZW5ndGgpfSxyLmJpbnN0cmluZzJidWY9ZnVuY3Rpb24oZSl7Zm9yKHZhciB0PW5ldyBoLkJ1ZjgoZS5sZW5ndGgpLHI9MCxuPXQubGVuZ3RoO3I8bjtyKyspdFtyXT1lLmNoYXJDb2RlQXQocik7cmV0dXJuIHR9LHIuYnVmMnN0cmluZz1mdW5jdGlvbihlLHQpe3ZhciByLG4saSxzLGE9dHx8ZS5sZW5ndGgsbz1uZXcgQXJyYXkoMiphKTtmb3Iocj1uPTA7cjxhOylpZigoaT1lW3IrK10pPDEyOClvW24rK109aTtlbHNlIGlmKDQ8KHM9dVtpXSkpb1tuKytdPTY1NTMzLHIrPXMtMTtlbHNle2ZvcihpJj0yPT09cz8zMTozPT09cz8xNTo3OzE8cyYmcjxhOylpPWk8PDZ8NjMmZVtyKytdLHMtLTsxPHM/b1tuKytdPTY1NTMzOmk8NjU1MzY/b1tuKytdPWk6KGktPTY1NTM2LG9bbisrXT01NTI5NnxpPj4xMCYxMDIzLG9bbisrXT01NjMyMHwxMDIzJmkpfXJldHVybiBsKG8sbil9LHIudXRmOGJvcmRlcj1mdW5jdGlvbihlLHQpe3ZhciByO2ZvcigodD10fHxlLmxlbmd0aCk+ZS5sZW5ndGgmJih0PWUubGVuZ3RoKSxyPXQtMTswPD1yJiYxMjg9PSgxOTImZVtyXSk7KXItLTtyZXR1cm4gcjwwP3Q6MD09PXI/dDpyK3VbZVtyXV0+dD9yOnR9fSx7XCIuL2NvbW1vblwiOjQxfV0sNDM6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9ZnVuY3Rpb24oZSx0LHIsbil7Zm9yKHZhciBpPTY1NTM1JmV8MCxzPWU+Pj4xNiY2NTUzNXwwLGE9MDswIT09cjspe2ZvcihyLT1hPTJlMzxyPzJlMzpyO3M9cysoaT1pK3RbbisrXXwwKXwwLC0tYTspO2klPTY1NTIxLHMlPTY1NTIxfXJldHVybiBpfHM8PDE2fDB9fSx7fV0sNDQ6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9e1pfTk9fRkxVU0g6MCxaX1BBUlRJQUxfRkxVU0g6MSxaX1NZTkNfRkxVU0g6MixaX0ZVTExfRkxVU0g6MyxaX0ZJTklTSDo0LFpfQkxPQ0s6NSxaX1RSRUVTOjYsWl9PSzowLFpfU1RSRUFNX0VORDoxLFpfTkVFRF9ESUNUOjIsWl9FUlJOTzotMSxaX1NUUkVBTV9FUlJPUjotMixaX0RBVEFfRVJST1I6LTMsWl9CVUZfRVJST1I6LTUsWl9OT19DT01QUkVTU0lPTjowLFpfQkVTVF9TUEVFRDoxLFpfQkVTVF9DT01QUkVTU0lPTjo5LFpfREVGQVVMVF9DT01QUkVTU0lPTjotMSxaX0ZJTFRFUkVEOjEsWl9IVUZGTUFOX09OTFk6MixaX1JMRTozLFpfRklYRUQ6NCxaX0RFRkFVTFRfU1RSQVRFR1k6MCxaX0JJTkFSWTowLFpfVEVYVDoxLFpfVU5LTk9XTjoyLFpfREVGTEFURUQ6OH19LHt9XSw0NTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBvPWZ1bmN0aW9uKCl7Zm9yKHZhciBlLHQ9W10scj0wO3I8MjU2O3IrKyl7ZT1yO2Zvcih2YXIgbj0wO248ODtuKyspZT0xJmU/Mzk4ODI5MjM4NF5lPj4+MTplPj4+MTt0W3JdPWV9cmV0dXJuIHR9KCk7dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCxyLG4pe3ZhciBpPW8scz1uK3I7ZV49LTE7Zm9yKHZhciBhPW47YTxzO2ErKyllPWU+Pj44XmlbMjU1JihlXnRbYV0pXTtyZXR1cm4tMV5lfX0se31dLDQ2OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGgsYz1lKFwiLi4vdXRpbHMvY29tbW9uXCIpLHU9ZShcIi4vdHJlZXNcIiksZD1lKFwiLi9hZGxlcjMyXCIpLHA9ZShcIi4vY3JjMzJcIiksbj1lKFwiLi9tZXNzYWdlc1wiKSxsPTAsZj00LG09MCxfPS0yLGc9LTEsYj00LGk9Mix2PTgseT05LHM9Mjg2LGE9MzAsbz0xOSx3PTIqcysxLGs9MTUseD0zLFM9MjU4LHo9Uyt4KzEsQz00MixFPTExMyxBPTEsST0yLE89MyxCPTQ7ZnVuY3Rpb24gUihlLHQpe3JldHVybiBlLm1zZz1uW3RdLHR9ZnVuY3Rpb24gVChlKXtyZXR1cm4oZTw8MSktKDQ8ZT85OjApfWZ1bmN0aW9uIEQoZSl7Zm9yKHZhciB0PWUubGVuZ3RoOzA8PS0tdDspZVt0XT0wfWZ1bmN0aW9uIEYoZSl7dmFyIHQ9ZS5zdGF0ZSxyPXQucGVuZGluZztyPmUuYXZhaWxfb3V0JiYocj1lLmF2YWlsX291dCksMCE9PXImJihjLmFycmF5U2V0KGUub3V0cHV0LHQucGVuZGluZ19idWYsdC5wZW5kaW5nX291dCxyLGUubmV4dF9vdXQpLGUubmV4dF9vdXQrPXIsdC5wZW5kaW5nX291dCs9cixlLnRvdGFsX291dCs9cixlLmF2YWlsX291dC09cix0LnBlbmRpbmctPXIsMD09PXQucGVuZGluZyYmKHQucGVuZGluZ19vdXQ9MCkpfWZ1bmN0aW9uIE4oZSx0KXt1Ll90cl9mbHVzaF9ibG9jayhlLDA8PWUuYmxvY2tfc3RhcnQ/ZS5ibG9ja19zdGFydDotMSxlLnN0cnN0YXJ0LWUuYmxvY2tfc3RhcnQsdCksZS5ibG9ja19zdGFydD1lLnN0cnN0YXJ0LEYoZS5zdHJtKX1mdW5jdGlvbiBVKGUsdCl7ZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109dH1mdW5jdGlvbiBQKGUsdCl7ZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109dD4+PjgmMjU1LGUucGVuZGluZ19idWZbZS5wZW5kaW5nKytdPTI1NSZ0fWZ1bmN0aW9uIEwoZSx0KXt2YXIgcixuLGk9ZS5tYXhfY2hhaW5fbGVuZ3RoLHM9ZS5zdHJzdGFydCxhPWUucHJldl9sZW5ndGgsbz1lLm5pY2VfbWF0Y2gsaD1lLnN0cnN0YXJ0PmUud19zaXplLXo/ZS5zdHJzdGFydC0oZS53X3NpemUteik6MCx1PWUud2luZG93LGw9ZS53X21hc2ssZj1lLnByZXYsYz1lLnN0cnN0YXJ0K1MsZD11W3MrYS0xXSxwPXVbcythXTtlLnByZXZfbGVuZ3RoPj1lLmdvb2RfbWF0Y2gmJihpPj49Miksbz5lLmxvb2thaGVhZCYmKG89ZS5sb29rYWhlYWQpO2Rve2lmKHVbKHI9dCkrYV09PT1wJiZ1W3IrYS0xXT09PWQmJnVbcl09PT11W3NdJiZ1Wysrcl09PT11W3MrMV0pe3MrPTIscisrO2Rve313aGlsZSh1Wysrc109PT11Wysrcl0mJnVbKytzXT09PXVbKytyXSYmdVsrK3NdPT09dVsrK3JdJiZ1Wysrc109PT11Wysrcl0mJnVbKytzXT09PXVbKytyXSYmdVsrK3NdPT09dVsrK3JdJiZ1Wysrc109PT11Wysrcl0mJnVbKytzXT09PXVbKytyXSYmczxjKTtpZihuPVMtKGMtcykscz1jLVMsYTxuKXtpZihlLm1hdGNoX3N0YXJ0PXQsbzw9KGE9bikpYnJlYWs7ZD11W3MrYS0xXSxwPXVbcythXX19fXdoaWxlKCh0PWZbdCZsXSk+aCYmMCE9LS1pKTtyZXR1cm4gYTw9ZS5sb29rYWhlYWQ/YTplLmxvb2thaGVhZH1mdW5jdGlvbiBqKGUpe3ZhciB0LHIsbixpLHMsYSxvLGgsdSxsLGY9ZS53X3NpemU7ZG97aWYoaT1lLndpbmRvd19zaXplLWUubG9va2FoZWFkLWUuc3Ryc3RhcnQsZS5zdHJzdGFydD49ZisoZi16KSl7Zm9yKGMuYXJyYXlTZXQoZS53aW5kb3csZS53aW5kb3csZixmLDApLGUubWF0Y2hfc3RhcnQtPWYsZS5zdHJzdGFydC09ZixlLmJsb2NrX3N0YXJ0LT1mLHQ9cj1lLmhhc2hfc2l6ZTtuPWUuaGVhZFstLXRdLGUuaGVhZFt0XT1mPD1uP24tZjowLC0tcjspO2Zvcih0PXI9ZjtuPWUucHJldlstLXRdLGUucHJldlt0XT1mPD1uP24tZjowLC0tcjspO2krPWZ9aWYoMD09PWUuc3RybS5hdmFpbF9pbilicmVhaztpZihhPWUuc3RybSxvPWUud2luZG93LGg9ZS5zdHJzdGFydCtlLmxvb2thaGVhZCx1PWksbD12b2lkIDAsbD1hLmF2YWlsX2luLHU8bCYmKGw9dSkscj0wPT09bD8wOihhLmF2YWlsX2luLT1sLGMuYXJyYXlTZXQobyxhLmlucHV0LGEubmV4dF9pbixsLGgpLDE9PT1hLnN0YXRlLndyYXA/YS5hZGxlcj1kKGEuYWRsZXIsbyxsLGgpOjI9PT1hLnN0YXRlLndyYXAmJihhLmFkbGVyPXAoYS5hZGxlcixvLGwsaCkpLGEubmV4dF9pbis9bCxhLnRvdGFsX2luKz1sLGwpLGUubG9va2FoZWFkKz1yLGUubG9va2FoZWFkK2UuaW5zZXJ0Pj14KWZvcihzPWUuc3Ryc3RhcnQtZS5pbnNlcnQsZS5pbnNfaD1lLndpbmRvd1tzXSxlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbcysxXSkmZS5oYXNoX21hc2s7ZS5pbnNlcnQmJihlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbcyt4LTFdKSZlLmhhc2hfbWFzayxlLnByZXZbcyZlLndfbWFza109ZS5oZWFkW2UuaW5zX2hdLGUuaGVhZFtlLmluc19oXT1zLHMrKyxlLmluc2VydC0tLCEoZS5sb29rYWhlYWQrZS5pbnNlcnQ8eCkpOyk7fXdoaWxlKGUubG9va2FoZWFkPHomJjAhPT1lLnN0cm0uYXZhaWxfaW4pfWZ1bmN0aW9uIFooZSx0KXtmb3IodmFyIHIsbjs7KXtpZihlLmxvb2thaGVhZDx6KXtpZihqKGUpLGUubG9va2FoZWFkPHomJnQ9PT1sKXJldHVybiBBO2lmKDA9PT1lLmxvb2thaGVhZClicmVha31pZihyPTAsZS5sb29rYWhlYWQ+PXgmJihlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbZS5zdHJzdGFydCt4LTFdKSZlLmhhc2hfbWFzayxyPWUucHJldltlLnN0cnN0YXJ0JmUud19tYXNrXT1lLmhlYWRbZS5pbnNfaF0sZS5oZWFkW2UuaW5zX2hdPWUuc3Ryc3RhcnQpLDAhPT1yJiZlLnN0cnN0YXJ0LXI8PWUud19zaXplLXomJihlLm1hdGNoX2xlbmd0aD1MKGUscikpLGUubWF0Y2hfbGVuZ3RoPj14KWlmKG49dS5fdHJfdGFsbHkoZSxlLnN0cnN0YXJ0LWUubWF0Y2hfc3RhcnQsZS5tYXRjaF9sZW5ndGgteCksZS5sb29rYWhlYWQtPWUubWF0Y2hfbGVuZ3RoLGUubWF0Y2hfbGVuZ3RoPD1lLm1heF9sYXp5X21hdGNoJiZlLmxvb2thaGVhZD49eCl7Zm9yKGUubWF0Y2hfbGVuZ3RoLS07ZS5zdHJzdGFydCsrLGUuaW5zX2g9KGUuaW5zX2g8PGUuaGFzaF9zaGlmdF5lLndpbmRvd1tlLnN0cnN0YXJ0K3gtMV0pJmUuaGFzaF9tYXNrLHI9ZS5wcmV2W2Uuc3Ryc3RhcnQmZS53X21hc2tdPWUuaGVhZFtlLmluc19oXSxlLmhlYWRbZS5pbnNfaF09ZS5zdHJzdGFydCwwIT0tLWUubWF0Y2hfbGVuZ3RoOyk7ZS5zdHJzdGFydCsrfWVsc2UgZS5zdHJzdGFydCs9ZS5tYXRjaF9sZW5ndGgsZS5tYXRjaF9sZW5ndGg9MCxlLmluc19oPWUud2luZG93W2Uuc3Ryc3RhcnRdLGUuaW5zX2g9KGUuaW5zX2g8PGUuaGFzaF9zaGlmdF5lLndpbmRvd1tlLnN0cnN0YXJ0KzFdKSZlLmhhc2hfbWFzaztlbHNlIG49dS5fdHJfdGFsbHkoZSwwLGUud2luZG93W2Uuc3Ryc3RhcnRdKSxlLmxvb2thaGVhZC0tLGUuc3Ryc3RhcnQrKztpZihuJiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCkpcmV0dXJuIEF9cmV0dXJuIGUuaW5zZXJ0PWUuc3Ryc3RhcnQ8eC0xP2Uuc3Ryc3RhcnQ6eC0xLHQ9PT1mPyhOKGUsITApLDA9PT1lLnN0cm0uYXZhaWxfb3V0P086Qik6ZS5sYXN0X2xpdCYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpP0E6SX1mdW5jdGlvbiBXKGUsdCl7Zm9yKHZhciByLG4saTs7KXtpZihlLmxvb2thaGVhZDx6KXtpZihqKGUpLGUubG9va2FoZWFkPHomJnQ9PT1sKXJldHVybiBBO2lmKDA9PT1lLmxvb2thaGVhZClicmVha31pZihyPTAsZS5sb29rYWhlYWQ+PXgmJihlLmluc19oPShlLmluc19oPDxlLmhhc2hfc2hpZnReZS53aW5kb3dbZS5zdHJzdGFydCt4LTFdKSZlLmhhc2hfbWFzayxyPWUucHJldltlLnN0cnN0YXJ0JmUud19tYXNrXT1lLmhlYWRbZS5pbnNfaF0sZS5oZWFkW2UuaW5zX2hdPWUuc3Ryc3RhcnQpLGUucHJldl9sZW5ndGg9ZS5tYXRjaF9sZW5ndGgsZS5wcmV2X21hdGNoPWUubWF0Y2hfc3RhcnQsZS5tYXRjaF9sZW5ndGg9eC0xLDAhPT1yJiZlLnByZXZfbGVuZ3RoPGUubWF4X2xhenlfbWF0Y2gmJmUuc3Ryc3RhcnQtcjw9ZS53X3NpemUteiYmKGUubWF0Y2hfbGVuZ3RoPUwoZSxyKSxlLm1hdGNoX2xlbmd0aDw9NSYmKDE9PT1lLnN0cmF0ZWd5fHxlLm1hdGNoX2xlbmd0aD09PXgmJjQwOTY8ZS5zdHJzdGFydC1lLm1hdGNoX3N0YXJ0KSYmKGUubWF0Y2hfbGVuZ3RoPXgtMSkpLGUucHJldl9sZW5ndGg+PXgmJmUubWF0Y2hfbGVuZ3RoPD1lLnByZXZfbGVuZ3RoKXtmb3IoaT1lLnN0cnN0YXJ0K2UubG9va2FoZWFkLXgsbj11Ll90cl90YWxseShlLGUuc3Ryc3RhcnQtMS1lLnByZXZfbWF0Y2gsZS5wcmV2X2xlbmd0aC14KSxlLmxvb2thaGVhZC09ZS5wcmV2X2xlbmd0aC0xLGUucHJldl9sZW5ndGgtPTI7KytlLnN0cnN0YXJ0PD1pJiYoZS5pbnNfaD0oZS5pbnNfaDw8ZS5oYXNoX3NoaWZ0XmUud2luZG93W2Uuc3Ryc3RhcnQreC0xXSkmZS5oYXNoX21hc2sscj1lLnByZXZbZS5zdHJzdGFydCZlLndfbWFza109ZS5oZWFkW2UuaW5zX2hdLGUuaGVhZFtlLmluc19oXT1lLnN0cnN0YXJ0KSwwIT0tLWUucHJldl9sZW5ndGg7KTtpZihlLm1hdGNoX2F2YWlsYWJsZT0wLGUubWF0Y2hfbGVuZ3RoPXgtMSxlLnN0cnN0YXJ0KyssbiYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpKXJldHVybiBBfWVsc2UgaWYoZS5tYXRjaF9hdmFpbGFibGUpe2lmKChuPXUuX3RyX3RhbGx5KGUsMCxlLndpbmRvd1tlLnN0cnN0YXJ0LTFdKSkmJk4oZSwhMSksZS5zdHJzdGFydCsrLGUubG9va2FoZWFkLS0sMD09PWUuc3RybS5hdmFpbF9vdXQpcmV0dXJuIEF9ZWxzZSBlLm1hdGNoX2F2YWlsYWJsZT0xLGUuc3Ryc3RhcnQrKyxlLmxvb2thaGVhZC0tfXJldHVybiBlLm1hdGNoX2F2YWlsYWJsZSYmKG49dS5fdHJfdGFsbHkoZSwwLGUud2luZG93W2Uuc3Ryc3RhcnQtMV0pLGUubWF0Y2hfYXZhaWxhYmxlPTApLGUuaW5zZXJ0PWUuc3Ryc3RhcnQ8eC0xP2Uuc3Ryc3RhcnQ6eC0xLHQ9PT1mPyhOKGUsITApLDA9PT1lLnN0cm0uYXZhaWxfb3V0P086Qik6ZS5sYXN0X2xpdCYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpP0E6SX1mdW5jdGlvbiBNKGUsdCxyLG4saSl7dGhpcy5nb29kX2xlbmd0aD1lLHRoaXMubWF4X2xhenk9dCx0aGlzLm5pY2VfbGVuZ3RoPXIsdGhpcy5tYXhfY2hhaW49bix0aGlzLmZ1bmM9aX1mdW5jdGlvbiBIKCl7dGhpcy5zdHJtPW51bGwsdGhpcy5zdGF0dXM9MCx0aGlzLnBlbmRpbmdfYnVmPW51bGwsdGhpcy5wZW5kaW5nX2J1Zl9zaXplPTAsdGhpcy5wZW5kaW5nX291dD0wLHRoaXMucGVuZGluZz0wLHRoaXMud3JhcD0wLHRoaXMuZ3poZWFkPW51bGwsdGhpcy5nemluZGV4PTAsdGhpcy5tZXRob2Q9dix0aGlzLmxhc3RfZmx1c2g9LTEsdGhpcy53X3NpemU9MCx0aGlzLndfYml0cz0wLHRoaXMud19tYXNrPTAsdGhpcy53aW5kb3c9bnVsbCx0aGlzLndpbmRvd19zaXplPTAsdGhpcy5wcmV2PW51bGwsdGhpcy5oZWFkPW51bGwsdGhpcy5pbnNfaD0wLHRoaXMuaGFzaF9zaXplPTAsdGhpcy5oYXNoX2JpdHM9MCx0aGlzLmhhc2hfbWFzaz0wLHRoaXMuaGFzaF9zaGlmdD0wLHRoaXMuYmxvY2tfc3RhcnQ9MCx0aGlzLm1hdGNoX2xlbmd0aD0wLHRoaXMucHJldl9tYXRjaD0wLHRoaXMubWF0Y2hfYXZhaWxhYmxlPTAsdGhpcy5zdHJzdGFydD0wLHRoaXMubWF0Y2hfc3RhcnQ9MCx0aGlzLmxvb2thaGVhZD0wLHRoaXMucHJldl9sZW5ndGg9MCx0aGlzLm1heF9jaGFpbl9sZW5ndGg9MCx0aGlzLm1heF9sYXp5X21hdGNoPTAsdGhpcy5sZXZlbD0wLHRoaXMuc3RyYXRlZ3k9MCx0aGlzLmdvb2RfbWF0Y2g9MCx0aGlzLm5pY2VfbWF0Y2g9MCx0aGlzLmR5bl9sdHJlZT1uZXcgYy5CdWYxNigyKncpLHRoaXMuZHluX2R0cmVlPW5ldyBjLkJ1ZjE2KDIqKDIqYSsxKSksdGhpcy5ibF90cmVlPW5ldyBjLkJ1ZjE2KDIqKDIqbysxKSksRCh0aGlzLmR5bl9sdHJlZSksRCh0aGlzLmR5bl9kdHJlZSksRCh0aGlzLmJsX3RyZWUpLHRoaXMubF9kZXNjPW51bGwsdGhpcy5kX2Rlc2M9bnVsbCx0aGlzLmJsX2Rlc2M9bnVsbCx0aGlzLmJsX2NvdW50PW5ldyBjLkJ1ZjE2KGsrMSksdGhpcy5oZWFwPW5ldyBjLkJ1ZjE2KDIqcysxKSxEKHRoaXMuaGVhcCksdGhpcy5oZWFwX2xlbj0wLHRoaXMuaGVhcF9tYXg9MCx0aGlzLmRlcHRoPW5ldyBjLkJ1ZjE2KDIqcysxKSxEKHRoaXMuZGVwdGgpLHRoaXMubF9idWY9MCx0aGlzLmxpdF9idWZzaXplPTAsdGhpcy5sYXN0X2xpdD0wLHRoaXMuZF9idWY9MCx0aGlzLm9wdF9sZW49MCx0aGlzLnN0YXRpY19sZW49MCx0aGlzLm1hdGNoZXM9MCx0aGlzLmluc2VydD0wLHRoaXMuYmlfYnVmPTAsdGhpcy5iaV92YWxpZD0wfWZ1bmN0aW9uIEcoZSl7dmFyIHQ7cmV0dXJuIGUmJmUuc3RhdGU/KGUudG90YWxfaW49ZS50b3RhbF9vdXQ9MCxlLmRhdGFfdHlwZT1pLCh0PWUuc3RhdGUpLnBlbmRpbmc9MCx0LnBlbmRpbmdfb3V0PTAsdC53cmFwPDAmJih0LndyYXA9LXQud3JhcCksdC5zdGF0dXM9dC53cmFwP0M6RSxlLmFkbGVyPTI9PT10LndyYXA/MDoxLHQubGFzdF9mbHVzaD1sLHUuX3RyX2luaXQodCksbSk6UihlLF8pfWZ1bmN0aW9uIEsoZSl7dmFyIHQ9RyhlKTtyZXR1cm4gdD09PW0mJmZ1bmN0aW9uKGUpe2Uud2luZG93X3NpemU9MiplLndfc2l6ZSxEKGUuaGVhZCksZS5tYXhfbGF6eV9tYXRjaD1oW2UubGV2ZWxdLm1heF9sYXp5LGUuZ29vZF9tYXRjaD1oW2UubGV2ZWxdLmdvb2RfbGVuZ3RoLGUubmljZV9tYXRjaD1oW2UubGV2ZWxdLm5pY2VfbGVuZ3RoLGUubWF4X2NoYWluX2xlbmd0aD1oW2UubGV2ZWxdLm1heF9jaGFpbixlLnN0cnN0YXJ0PTAsZS5ibG9ja19zdGFydD0wLGUubG9va2FoZWFkPTAsZS5pbnNlcnQ9MCxlLm1hdGNoX2xlbmd0aD1lLnByZXZfbGVuZ3RoPXgtMSxlLm1hdGNoX2F2YWlsYWJsZT0wLGUuaW5zX2g9MH0oZS5zdGF0ZSksdH1mdW5jdGlvbiBZKGUsdCxyLG4saSxzKXtpZighZSlyZXR1cm4gXzt2YXIgYT0xO2lmKHQ9PT1nJiYodD02KSxuPDA/KGE9MCxuPS1uKToxNTxuJiYoYT0yLG4tPTE2KSxpPDF8fHk8aXx8ciE9PXZ8fG48OHx8MTU8bnx8dDwwfHw5PHR8fHM8MHx8YjxzKXJldHVybiBSKGUsXyk7OD09PW4mJihuPTkpO3ZhciBvPW5ldyBIO3JldHVybihlLnN0YXRlPW8pLnN0cm09ZSxvLndyYXA9YSxvLmd6aGVhZD1udWxsLG8ud19iaXRzPW4sby53X3NpemU9MTw8by53X2JpdHMsby53X21hc2s9by53X3NpemUtMSxvLmhhc2hfYml0cz1pKzcsby5oYXNoX3NpemU9MTw8by5oYXNoX2JpdHMsby5oYXNoX21hc2s9by5oYXNoX3NpemUtMSxvLmhhc2hfc2hpZnQ9fn4oKG8uaGFzaF9iaXRzK3gtMSkveCksby53aW5kb3c9bmV3IGMuQnVmOCgyKm8ud19zaXplKSxvLmhlYWQ9bmV3IGMuQnVmMTYoby5oYXNoX3NpemUpLG8ucHJldj1uZXcgYy5CdWYxNihvLndfc2l6ZSksby5saXRfYnVmc2l6ZT0xPDxpKzYsby5wZW5kaW5nX2J1Zl9zaXplPTQqby5saXRfYnVmc2l6ZSxvLnBlbmRpbmdfYnVmPW5ldyBjLkJ1Zjgoby5wZW5kaW5nX2J1Zl9zaXplKSxvLmRfYnVmPTEqby5saXRfYnVmc2l6ZSxvLmxfYnVmPTMqby5saXRfYnVmc2l6ZSxvLmxldmVsPXQsby5zdHJhdGVneT1zLG8ubWV0aG9kPXIsSyhlKX1oPVtuZXcgTSgwLDAsMCwwLGZ1bmN0aW9uKGUsdCl7dmFyIHI9NjU1MzU7Zm9yKHI+ZS5wZW5kaW5nX2J1Zl9zaXplLTUmJihyPWUucGVuZGluZ19idWZfc2l6ZS01KTs7KXtpZihlLmxvb2thaGVhZDw9MSl7aWYoaihlKSwwPT09ZS5sb29rYWhlYWQmJnQ9PT1sKXJldHVybiBBO2lmKDA9PT1lLmxvb2thaGVhZClicmVha31lLnN0cnN0YXJ0Kz1lLmxvb2thaGVhZCxlLmxvb2thaGVhZD0wO3ZhciBuPWUuYmxvY2tfc3RhcnQrcjtpZigoMD09PWUuc3Ryc3RhcnR8fGUuc3Ryc3RhcnQ+PW4pJiYoZS5sb29rYWhlYWQ9ZS5zdHJzdGFydC1uLGUuc3Ryc3RhcnQ9bixOKGUsITEpLDA9PT1lLnN0cm0uYXZhaWxfb3V0KSlyZXR1cm4gQTtpZihlLnN0cnN0YXJ0LWUuYmxvY2tfc3RhcnQ+PWUud19zaXplLXomJihOKGUsITEpLDA9PT1lLnN0cm0uYXZhaWxfb3V0KSlyZXR1cm4gQX1yZXR1cm4gZS5pbnNlcnQ9MCx0PT09Zj8oTihlLCEwKSwwPT09ZS5zdHJtLmF2YWlsX291dD9POkIpOihlLnN0cnN0YXJ0PmUuYmxvY2tfc3RhcnQmJihOKGUsITEpLGUuc3RybS5hdmFpbF9vdXQpLEEpfSksbmV3IE0oNCw0LDgsNCxaKSxuZXcgTSg0LDUsMTYsOCxaKSxuZXcgTSg0LDYsMzIsMzIsWiksbmV3IE0oNCw0LDE2LDE2LFcpLG5ldyBNKDgsMTYsMzIsMzIsVyksbmV3IE0oOCwxNiwxMjgsMTI4LFcpLG5ldyBNKDgsMzIsMTI4LDI1NixXKSxuZXcgTSgzMiwxMjgsMjU4LDEwMjQsVyksbmV3IE0oMzIsMjU4LDI1OCw0MDk2LFcpXSxyLmRlZmxhdGVJbml0PWZ1bmN0aW9uKGUsdCl7cmV0dXJuIFkoZSx0LHYsMTUsOCwwKX0sci5kZWZsYXRlSW5pdDI9WSxyLmRlZmxhdGVSZXNldD1LLHIuZGVmbGF0ZVJlc2V0S2VlcD1HLHIuZGVmbGF0ZVNldEhlYWRlcj1mdW5jdGlvbihlLHQpe3JldHVybiBlJiZlLnN0YXRlPzIhPT1lLnN0YXRlLndyYXA/XzooZS5zdGF0ZS5nemhlYWQ9dCxtKTpffSxyLmRlZmxhdGU9ZnVuY3Rpb24oZSx0KXt2YXIgcixuLGkscztpZighZXx8IWUuc3RhdGV8fDU8dHx8dDwwKXJldHVybiBlP1IoZSxfKTpfO2lmKG49ZS5zdGF0ZSwhZS5vdXRwdXR8fCFlLmlucHV0JiYwIT09ZS5hdmFpbF9pbnx8NjY2PT09bi5zdGF0dXMmJnQhPT1mKXJldHVybiBSKGUsMD09PWUuYXZhaWxfb3V0Py01Ol8pO2lmKG4uc3RybT1lLHI9bi5sYXN0X2ZsdXNoLG4ubGFzdF9mbHVzaD10LG4uc3RhdHVzPT09QylpZigyPT09bi53cmFwKWUuYWRsZXI9MCxVKG4sMzEpLFUobiwxMzkpLFUobiw4KSxuLmd6aGVhZD8oVShuLChuLmd6aGVhZC50ZXh0PzE6MCkrKG4uZ3poZWFkLmhjcmM/MjowKSsobi5nemhlYWQuZXh0cmE/NDowKSsobi5nemhlYWQubmFtZT84OjApKyhuLmd6aGVhZC5jb21tZW50PzE2OjApKSxVKG4sMjU1Jm4uZ3poZWFkLnRpbWUpLFUobixuLmd6aGVhZC50aW1lPj44JjI1NSksVShuLG4uZ3poZWFkLnRpbWU+PjE2JjI1NSksVShuLG4uZ3poZWFkLnRpbWU+PjI0JjI1NSksVShuLDk9PT1uLmxldmVsPzI6Mjw9bi5zdHJhdGVneXx8bi5sZXZlbDwyPzQ6MCksVShuLDI1NSZuLmd6aGVhZC5vcyksbi5nemhlYWQuZXh0cmEmJm4uZ3poZWFkLmV4dHJhLmxlbmd0aCYmKFUobiwyNTUmbi5nemhlYWQuZXh0cmEubGVuZ3RoKSxVKG4sbi5nemhlYWQuZXh0cmEubGVuZ3RoPj44JjI1NSkpLG4uZ3poZWFkLmhjcmMmJihlLmFkbGVyPXAoZS5hZGxlcixuLnBlbmRpbmdfYnVmLG4ucGVuZGluZywwKSksbi5nemluZGV4PTAsbi5zdGF0dXM9NjkpOihVKG4sMCksVShuLDApLFUobiwwKSxVKG4sMCksVShuLDApLFUobiw5PT09bi5sZXZlbD8yOjI8PW4uc3RyYXRlZ3l8fG4ubGV2ZWw8Mj80OjApLFUobiwzKSxuLnN0YXR1cz1FKTtlbHNle3ZhciBhPXYrKG4ud19iaXRzLTg8PDQpPDw4O2F8PSgyPD1uLnN0cmF0ZWd5fHxuLmxldmVsPDI/MDpuLmxldmVsPDY/MTo2PT09bi5sZXZlbD8yOjMpPDw2LDAhPT1uLnN0cnN0YXJ0JiYoYXw9MzIpLGErPTMxLWElMzEsbi5zdGF0dXM9RSxQKG4sYSksMCE9PW4uc3Ryc3RhcnQmJihQKG4sZS5hZGxlcj4+PjE2KSxQKG4sNjU1MzUmZS5hZGxlcikpLGUuYWRsZXI9MX1pZig2OT09PW4uc3RhdHVzKWlmKG4uZ3poZWFkLmV4dHJhKXtmb3IoaT1uLnBlbmRpbmc7bi5nemluZGV4PCg2NTUzNSZuLmd6aGVhZC5leHRyYS5sZW5ndGgpJiYobi5wZW5kaW5nIT09bi5wZW5kaW5nX2J1Zl9zaXplfHwobi5nemhlYWQuaGNyYyYmbi5wZW5kaW5nPmkmJihlLmFkbGVyPXAoZS5hZGxlcixuLnBlbmRpbmdfYnVmLG4ucGVuZGluZy1pLGkpKSxGKGUpLGk9bi5wZW5kaW5nLG4ucGVuZGluZyE9PW4ucGVuZGluZ19idWZfc2l6ZSkpOylVKG4sMjU1Jm4uZ3poZWFkLmV4dHJhW24uZ3ppbmRleF0pLG4uZ3ppbmRleCsrO24uZ3poZWFkLmhjcmMmJm4ucGVuZGluZz5pJiYoZS5hZGxlcj1wKGUuYWRsZXIsbi5wZW5kaW5nX2J1ZixuLnBlbmRpbmctaSxpKSksbi5nemluZGV4PT09bi5nemhlYWQuZXh0cmEubGVuZ3RoJiYobi5nemluZGV4PTAsbi5zdGF0dXM9NzMpfWVsc2Ugbi5zdGF0dXM9NzM7aWYoNzM9PT1uLnN0YXR1cylpZihuLmd6aGVhZC5uYW1lKXtpPW4ucGVuZGluZztkb3tpZihuLnBlbmRpbmc9PT1uLnBlbmRpbmdfYnVmX3NpemUmJihuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLEYoZSksaT1uLnBlbmRpbmcsbi5wZW5kaW5nPT09bi5wZW5kaW5nX2J1Zl9zaXplKSl7cz0xO2JyZWFrfXM9bi5nemluZGV4PG4uZ3poZWFkLm5hbWUubGVuZ3RoPzI1NSZuLmd6aGVhZC5uYW1lLmNoYXJDb2RlQXQobi5nemluZGV4KyspOjAsVShuLHMpfXdoaWxlKDAhPT1zKTtuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLDA9PT1zJiYobi5nemluZGV4PTAsbi5zdGF0dXM9OTEpfWVsc2Ugbi5zdGF0dXM9OTE7aWYoOTE9PT1uLnN0YXR1cylpZihuLmd6aGVhZC5jb21tZW50KXtpPW4ucGVuZGluZztkb3tpZihuLnBlbmRpbmc9PT1uLnBlbmRpbmdfYnVmX3NpemUmJihuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLEYoZSksaT1uLnBlbmRpbmcsbi5wZW5kaW5nPT09bi5wZW5kaW5nX2J1Zl9zaXplKSl7cz0xO2JyZWFrfXM9bi5nemluZGV4PG4uZ3poZWFkLmNvbW1lbnQubGVuZ3RoPzI1NSZuLmd6aGVhZC5jb21tZW50LmNoYXJDb2RlQXQobi5nemluZGV4KyspOjAsVShuLHMpfXdoaWxlKDAhPT1zKTtuLmd6aGVhZC5oY3JjJiZuLnBlbmRpbmc+aSYmKGUuYWRsZXI9cChlLmFkbGVyLG4ucGVuZGluZ19idWYsbi5wZW5kaW5nLWksaSkpLDA9PT1zJiYobi5zdGF0dXM9MTAzKX1lbHNlIG4uc3RhdHVzPTEwMztpZigxMDM9PT1uLnN0YXR1cyYmKG4uZ3poZWFkLmhjcmM/KG4ucGVuZGluZysyPm4ucGVuZGluZ19idWZfc2l6ZSYmRihlKSxuLnBlbmRpbmcrMjw9bi5wZW5kaW5nX2J1Zl9zaXplJiYoVShuLDI1NSZlLmFkbGVyKSxVKG4sZS5hZGxlcj4+OCYyNTUpLGUuYWRsZXI9MCxuLnN0YXR1cz1FKSk6bi5zdGF0dXM9RSksMCE9PW4ucGVuZGluZyl7aWYoRihlKSwwPT09ZS5hdmFpbF9vdXQpcmV0dXJuIG4ubGFzdF9mbHVzaD0tMSxtfWVsc2UgaWYoMD09PWUuYXZhaWxfaW4mJlQodCk8PVQocikmJnQhPT1mKXJldHVybiBSKGUsLTUpO2lmKDY2Nj09PW4uc3RhdHVzJiYwIT09ZS5hdmFpbF9pbilyZXR1cm4gUihlLC01KTtpZigwIT09ZS5hdmFpbF9pbnx8MCE9PW4ubG9va2FoZWFkfHx0IT09bCYmNjY2IT09bi5zdGF0dXMpe3ZhciBvPTI9PT1uLnN0cmF0ZWd5P2Z1bmN0aW9uKGUsdCl7Zm9yKHZhciByOzspe2lmKDA9PT1lLmxvb2thaGVhZCYmKGooZSksMD09PWUubG9va2FoZWFkKSl7aWYodD09PWwpcmV0dXJuIEE7YnJlYWt9aWYoZS5tYXRjaF9sZW5ndGg9MCxyPXUuX3RyX3RhbGx5KGUsMCxlLndpbmRvd1tlLnN0cnN0YXJ0XSksZS5sb29rYWhlYWQtLSxlLnN0cnN0YXJ0KyssciYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpKXJldHVybiBBfXJldHVybiBlLmluc2VydD0wLHQ9PT1mPyhOKGUsITApLDA9PT1lLnN0cm0uYXZhaWxfb3V0P086Qik6ZS5sYXN0X2xpdCYmKE4oZSwhMSksMD09PWUuc3RybS5hdmFpbF9vdXQpP0E6SX0obix0KTozPT09bi5zdHJhdGVneT9mdW5jdGlvbihlLHQpe2Zvcih2YXIgcixuLGkscyxhPWUud2luZG93Ozspe2lmKGUubG9va2FoZWFkPD1TKXtpZihqKGUpLGUubG9va2FoZWFkPD1TJiZ0PT09bClyZXR1cm4gQTtpZigwPT09ZS5sb29rYWhlYWQpYnJlYWt9aWYoZS5tYXRjaF9sZW5ndGg9MCxlLmxvb2thaGVhZD49eCYmMDxlLnN0cnN0YXJ0JiYobj1hW2k9ZS5zdHJzdGFydC0xXSk9PT1hWysraV0mJm49PT1hWysraV0mJm49PT1hWysraV0pe3M9ZS5zdHJzdGFydCtTO2Rve313aGlsZShuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZuPT09YVsrK2ldJiZpPHMpO2UubWF0Y2hfbGVuZ3RoPVMtKHMtaSksZS5tYXRjaF9sZW5ndGg+ZS5sb29rYWhlYWQmJihlLm1hdGNoX2xlbmd0aD1lLmxvb2thaGVhZCl9aWYoZS5tYXRjaF9sZW5ndGg+PXg/KHI9dS5fdHJfdGFsbHkoZSwxLGUubWF0Y2hfbGVuZ3RoLXgpLGUubG9va2FoZWFkLT1lLm1hdGNoX2xlbmd0aCxlLnN0cnN0YXJ0Kz1lLm1hdGNoX2xlbmd0aCxlLm1hdGNoX2xlbmd0aD0wKToocj11Ll90cl90YWxseShlLDAsZS53aW5kb3dbZS5zdHJzdGFydF0pLGUubG9va2FoZWFkLS0sZS5zdHJzdGFydCsrKSxyJiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCkpcmV0dXJuIEF9cmV0dXJuIGUuaW5zZXJ0PTAsdD09PWY/KE4oZSwhMCksMD09PWUuc3RybS5hdmFpbF9vdXQ/TzpCKTplLmxhc3RfbGl0JiYoTihlLCExKSwwPT09ZS5zdHJtLmF2YWlsX291dCk/QTpJfShuLHQpOmhbbi5sZXZlbF0uZnVuYyhuLHQpO2lmKG8hPT1PJiZvIT09Qnx8KG4uc3RhdHVzPTY2Niksbz09PUF8fG89PT1PKXJldHVybiAwPT09ZS5hdmFpbF9vdXQmJihuLmxhc3RfZmx1c2g9LTEpLG07aWYobz09PUkmJigxPT09dD91Ll90cl9hbGlnbihuKTo1IT09dCYmKHUuX3RyX3N0b3JlZF9ibG9jayhuLDAsMCwhMSksMz09PXQmJihEKG4uaGVhZCksMD09PW4ubG9va2FoZWFkJiYobi5zdHJzdGFydD0wLG4uYmxvY2tfc3RhcnQ9MCxuLmluc2VydD0wKSkpLEYoZSksMD09PWUuYXZhaWxfb3V0KSlyZXR1cm4gbi5sYXN0X2ZsdXNoPS0xLG19cmV0dXJuIHQhPT1mP206bi53cmFwPD0wPzE6KDI9PT1uLndyYXA/KFUobiwyNTUmZS5hZGxlciksVShuLGUuYWRsZXI+PjgmMjU1KSxVKG4sZS5hZGxlcj4+MTYmMjU1KSxVKG4sZS5hZGxlcj4+MjQmMjU1KSxVKG4sMjU1JmUudG90YWxfaW4pLFUobixlLnRvdGFsX2luPj44JjI1NSksVShuLGUudG90YWxfaW4+PjE2JjI1NSksVShuLGUudG90YWxfaW4+PjI0JjI1NSkpOihQKG4sZS5hZGxlcj4+PjE2KSxQKG4sNjU1MzUmZS5hZGxlcikpLEYoZSksMDxuLndyYXAmJihuLndyYXA9LW4ud3JhcCksMCE9PW4ucGVuZGluZz9tOjEpfSxyLmRlZmxhdGVFbmQ9ZnVuY3Rpb24oZSl7dmFyIHQ7cmV0dXJuIGUmJmUuc3RhdGU/KHQ9ZS5zdGF0ZS5zdGF0dXMpIT09QyYmNjkhPT10JiY3MyE9PXQmJjkxIT09dCYmMTAzIT09dCYmdCE9PUUmJjY2NiE9PXQ/UihlLF8pOihlLnN0YXRlPW51bGwsdD09PUU/UihlLC0zKTptKTpffSxyLmRlZmxhdGVTZXREaWN0aW9uYXJ5PWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYSxvLGgsdSxsPXQubGVuZ3RoO2lmKCFlfHwhZS5zdGF0ZSlyZXR1cm4gXztpZigyPT09KHM9KHI9ZS5zdGF0ZSkud3JhcCl8fDE9PT1zJiZyLnN0YXR1cyE9PUN8fHIubG9va2FoZWFkKXJldHVybiBfO2ZvcigxPT09cyYmKGUuYWRsZXI9ZChlLmFkbGVyLHQsbCwwKSksci53cmFwPTAsbD49ci53X3NpemUmJigwPT09cyYmKEQoci5oZWFkKSxyLnN0cnN0YXJ0PTAsci5ibG9ja19zdGFydD0wLHIuaW5zZXJ0PTApLHU9bmV3IGMuQnVmOChyLndfc2l6ZSksYy5hcnJheVNldCh1LHQsbC1yLndfc2l6ZSxyLndfc2l6ZSwwKSx0PXUsbD1yLndfc2l6ZSksYT1lLmF2YWlsX2luLG89ZS5uZXh0X2luLGg9ZS5pbnB1dCxlLmF2YWlsX2luPWwsZS5uZXh0X2luPTAsZS5pbnB1dD10LGoocik7ci5sb29rYWhlYWQ+PXg7KXtmb3Iobj1yLnN0cnN0YXJ0LGk9ci5sb29rYWhlYWQtKHgtMSk7ci5pbnNfaD0oci5pbnNfaDw8ci5oYXNoX3NoaWZ0XnIud2luZG93W24reC0xXSkmci5oYXNoX21hc2ssci5wcmV2W24mci53X21hc2tdPXIuaGVhZFtyLmluc19oXSxyLmhlYWRbci5pbnNfaF09bixuKyssLS1pOyk7ci5zdHJzdGFydD1uLHIubG9va2FoZWFkPXgtMSxqKHIpfXJldHVybiByLnN0cnN0YXJ0Kz1yLmxvb2thaGVhZCxyLmJsb2NrX3N0YXJ0PXIuc3Ryc3RhcnQsci5pbnNlcnQ9ci5sb29rYWhlYWQsci5sb29rYWhlYWQ9MCxyLm1hdGNoX2xlbmd0aD1yLnByZXZfbGVuZ3RoPXgtMSxyLm1hdGNoX2F2YWlsYWJsZT0wLGUubmV4dF9pbj1vLGUuaW5wdXQ9aCxlLmF2YWlsX2luPWEsci53cmFwPXMsbX0sci5kZWZsYXRlSW5mbz1cInBha28gZGVmbGF0ZSAoZnJvbSBOb2RlY2EgcHJvamVjdClcIn0se1wiLi4vdXRpbHMvY29tbW9uXCI6NDEsXCIuL2FkbGVyMzJcIjo0MyxcIi4vY3JjMzJcIjo0NSxcIi4vbWVzc2FnZXNcIjo1MSxcIi4vdHJlZXNcIjo1Mn1dLDQ3OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dC5leHBvcnRzPWZ1bmN0aW9uKCl7dGhpcy50ZXh0PTAsdGhpcy50aW1lPTAsdGhpcy54ZmxhZ3M9MCx0aGlzLm9zPTAsdGhpcy5leHRyYT1udWxsLHRoaXMuZXh0cmFfbGVuPTAsdGhpcy5uYW1lPVwiXCIsdGhpcy5jb21tZW50PVwiXCIsdGhpcy5oY3JjPTAsdGhpcy5kb25lPSExfX0se31dLDQ4OltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYSxvLGgsdSxsLGYsYyxkLHAsbSxfLGcsYix2LHksdyxrLHgsUyx6LEM7cj1lLnN0YXRlLG49ZS5uZXh0X2luLHo9ZS5pbnB1dCxpPW4rKGUuYXZhaWxfaW4tNSkscz1lLm5leHRfb3V0LEM9ZS5vdXRwdXQsYT1zLSh0LWUuYXZhaWxfb3V0KSxvPXMrKGUuYXZhaWxfb3V0LTI1NyksaD1yLmRtYXgsdT1yLndzaXplLGw9ci53aGF2ZSxmPXIud25leHQsYz1yLndpbmRvdyxkPXIuaG9sZCxwPXIuYml0cyxtPXIubGVuY29kZSxfPXIuZGlzdGNvZGUsZz0oMTw8ci5sZW5iaXRzKS0xLGI9KDE8PHIuZGlzdGJpdHMpLTE7ZTpkb3twPDE1JiYoZCs9eltuKytdPDxwLHArPTgsZCs9eltuKytdPDxwLHArPTgpLHY9bVtkJmddO3Q6Zm9yKDs7KXtpZihkPj4+PXk9dj4+PjI0LHAtPXksMD09PSh5PXY+Pj4xNiYyNTUpKUNbcysrXT02NTUzNSZ2O2Vsc2V7aWYoISgxNiZ5KSl7aWYoMD09KDY0JnkpKXt2PW1bKDY1NTM1JnYpKyhkJigxPDx5KS0xKV07Y29udGludWUgdH1pZigzMiZ5KXtyLm1vZGU9MTI7YnJlYWsgZX1lLm1zZz1cImludmFsaWQgbGl0ZXJhbC9sZW5ndGggY29kZVwiLHIubW9kZT0zMDticmVhayBlfXc9NjU1MzUmdiwoeSY9MTUpJiYocDx5JiYoZCs9eltuKytdPDxwLHArPTgpLHcrPWQmKDE8PHkpLTEsZD4+Pj15LHAtPXkpLHA8MTUmJihkKz16W24rK108PHAscCs9OCxkKz16W24rK108PHAscCs9OCksdj1fW2QmYl07cjpmb3IoOzspe2lmKGQ+Pj49eT12Pj4+MjQscC09eSwhKDE2Jih5PXY+Pj4xNiYyNTUpKSl7aWYoMD09KDY0JnkpKXt2PV9bKDY1NTM1JnYpKyhkJigxPDx5KS0xKV07Y29udGludWUgcn1lLm1zZz1cImludmFsaWQgZGlzdGFuY2UgY29kZVwiLHIubW9kZT0zMDticmVhayBlfWlmKGs9NjU1MzUmdixwPCh5Jj0xNSkmJihkKz16W24rK108PHAsKHArPTgpPHkmJihkKz16W24rK108PHAscCs9OCkpLGg8KGsrPWQmKDE8PHkpLTEpKXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2UgdG9vIGZhciBiYWNrXCIsci5tb2RlPTMwO2JyZWFrIGV9aWYoZD4+Pj15LHAtPXksKHk9cy1hKTxrKXtpZihsPCh5PWsteSkmJnIuc2FuZSl7ZS5tc2c9XCJpbnZhbGlkIGRpc3RhbmNlIHRvbyBmYXIgYmFja1wiLHIubW9kZT0zMDticmVhayBlfWlmKFM9YywoeD0wKT09PWYpe2lmKHgrPXUteSx5PHcpe2Zvcih3LT15O0NbcysrXT1jW3grK10sLS15Oyk7eD1zLWssUz1DfX1lbHNlIGlmKGY8eSl7aWYoeCs9dStmLXksKHktPWYpPHcpe2Zvcih3LT15O0NbcysrXT1jW3grK10sLS15Oyk7aWYoeD0wLGY8dyl7Zm9yKHctPXk9ZjtDW3MrK109Y1t4KytdLC0teTspO3g9cy1rLFM9Q319fWVsc2UgaWYoeCs9Zi15LHk8dyl7Zm9yKHctPXk7Q1tzKytdPWNbeCsrXSwtLXk7KTt4PXMtayxTPUN9Zm9yKDsyPHc7KUNbcysrXT1TW3grK10sQ1tzKytdPVNbeCsrXSxDW3MrK109U1t4KytdLHctPTM7dyYmKENbcysrXT1TW3grK10sMTx3JiYoQ1tzKytdPVNbeCsrXSkpfWVsc2V7Zm9yKHg9cy1rO0NbcysrXT1DW3grK10sQ1tzKytdPUNbeCsrXSxDW3MrK109Q1t4KytdLDI8KHctPTMpOyk7dyYmKENbcysrXT1DW3grK10sMTx3JiYoQ1tzKytdPUNbeCsrXSkpfWJyZWFrfX1icmVha319d2hpbGUobjxpJiZzPG8pO24tPXc9cD4+MyxkJj0oMTw8KHAtPXc8PDMpKS0xLGUubmV4dF9pbj1uLGUubmV4dF9vdXQ9cyxlLmF2YWlsX2luPW48aT9pLW4rNTo1LShuLWkpLGUuYXZhaWxfb3V0PXM8bz9vLXMrMjU3OjI1Ny0ocy1vKSxyLmhvbGQ9ZCxyLmJpdHM9cH19LHt9XSw0OTpbZnVuY3Rpb24oZSx0LHIpe1widXNlIHN0cmljdFwiO3ZhciBJPWUoXCIuLi91dGlscy9jb21tb25cIiksTz1lKFwiLi9hZGxlcjMyXCIpLEI9ZShcIi4vY3JjMzJcIiksUj1lKFwiLi9pbmZmYXN0XCIpLFQ9ZShcIi4vaW5mdHJlZXNcIiksRD0xLEY9MixOPTAsVT0tMixQPTEsbj04NTIsaT01OTI7ZnVuY3Rpb24gTChlKXtyZXR1cm4oZT4+PjI0JjI1NSkrKGU+Pj44JjY1MjgwKSsoKDY1MjgwJmUpPDw4KSsoKDI1NSZlKTw8MjQpfWZ1bmN0aW9uIHMoKXt0aGlzLm1vZGU9MCx0aGlzLmxhc3Q9ITEsdGhpcy53cmFwPTAsdGhpcy5oYXZlZGljdD0hMSx0aGlzLmZsYWdzPTAsdGhpcy5kbWF4PTAsdGhpcy5jaGVjaz0wLHRoaXMudG90YWw9MCx0aGlzLmhlYWQ9bnVsbCx0aGlzLndiaXRzPTAsdGhpcy53c2l6ZT0wLHRoaXMud2hhdmU9MCx0aGlzLnduZXh0PTAsdGhpcy53aW5kb3c9bnVsbCx0aGlzLmhvbGQ9MCx0aGlzLmJpdHM9MCx0aGlzLmxlbmd0aD0wLHRoaXMub2Zmc2V0PTAsdGhpcy5leHRyYT0wLHRoaXMubGVuY29kZT1udWxsLHRoaXMuZGlzdGNvZGU9bnVsbCx0aGlzLmxlbmJpdHM9MCx0aGlzLmRpc3RiaXRzPTAsdGhpcy5uY29kZT0wLHRoaXMubmxlbj0wLHRoaXMubmRpc3Q9MCx0aGlzLmhhdmU9MCx0aGlzLm5leHQ9bnVsbCx0aGlzLmxlbnM9bmV3IEkuQnVmMTYoMzIwKSx0aGlzLndvcms9bmV3IEkuQnVmMTYoMjg4KSx0aGlzLmxlbmR5bj1udWxsLHRoaXMuZGlzdGR5bj1udWxsLHRoaXMuc2FuZT0wLHRoaXMuYmFjaz0wLHRoaXMud2FzPTB9ZnVuY3Rpb24gYShlKXt2YXIgdDtyZXR1cm4gZSYmZS5zdGF0ZT8odD1lLnN0YXRlLGUudG90YWxfaW49ZS50b3RhbF9vdXQ9dC50b3RhbD0wLGUubXNnPVwiXCIsdC53cmFwJiYoZS5hZGxlcj0xJnQud3JhcCksdC5tb2RlPVAsdC5sYXN0PTAsdC5oYXZlZGljdD0wLHQuZG1heD0zMjc2OCx0LmhlYWQ9bnVsbCx0LmhvbGQ9MCx0LmJpdHM9MCx0LmxlbmNvZGU9dC5sZW5keW49bmV3IEkuQnVmMzIobiksdC5kaXN0Y29kZT10LmRpc3RkeW49bmV3IEkuQnVmMzIoaSksdC5zYW5lPTEsdC5iYWNrPS0xLE4pOlV9ZnVuY3Rpb24gbyhlKXt2YXIgdDtyZXR1cm4gZSYmZS5zdGF0ZT8oKHQ9ZS5zdGF0ZSkud3NpemU9MCx0LndoYXZlPTAsdC53bmV4dD0wLGEoZSkpOlV9ZnVuY3Rpb24gaChlLHQpe3ZhciByLG47cmV0dXJuIGUmJmUuc3RhdGU/KG49ZS5zdGF0ZSx0PDA/KHI9MCx0PS10KToocj0xKyh0Pj40KSx0PDQ4JiYodCY9MTUpKSx0JiYodDw4fHwxNTx0KT9VOihudWxsIT09bi53aW5kb3cmJm4ud2JpdHMhPT10JiYobi53aW5kb3c9bnVsbCksbi53cmFwPXIsbi53Yml0cz10LG8oZSkpKTpVfWZ1bmN0aW9uIHUoZSx0KXt2YXIgcixuO3JldHVybiBlPyhuPW5ldyBzLChlLnN0YXRlPW4pLndpbmRvdz1udWxsLChyPWgoZSx0KSkhPT1OJiYoZS5zdGF0ZT1udWxsKSxyKTpVfXZhciBsLGYsYz0hMDtmdW5jdGlvbiBqKGUpe2lmKGMpe3ZhciB0O2ZvcihsPW5ldyBJLkJ1ZjMyKDUxMiksZj1uZXcgSS5CdWYzMigzMiksdD0wO3Q8MTQ0OyllLmxlbnNbdCsrXT04O2Zvcig7dDwyNTY7KWUubGVuc1t0KytdPTk7Zm9yKDt0PDI4MDspZS5sZW5zW3QrK109Nztmb3IoO3Q8Mjg4OyllLmxlbnNbdCsrXT04O2ZvcihUKEQsZS5sZW5zLDAsMjg4LGwsMCxlLndvcmsse2JpdHM6OX0pLHQ9MDt0PDMyOyllLmxlbnNbdCsrXT01O1QoRixlLmxlbnMsMCwzMixmLDAsZS53b3JrLHtiaXRzOjV9KSxjPSExfWUubGVuY29kZT1sLGUubGVuYml0cz05LGUuZGlzdGNvZGU9ZixlLmRpc3RiaXRzPTV9ZnVuY3Rpb24gWihlLHQscixuKXt2YXIgaSxzPWUuc3RhdGU7cmV0dXJuIG51bGw9PT1zLndpbmRvdyYmKHMud3NpemU9MTw8cy53Yml0cyxzLnduZXh0PTAscy53aGF2ZT0wLHMud2luZG93PW5ldyBJLkJ1Zjgocy53c2l6ZSkpLG4+PXMud3NpemU/KEkuYXJyYXlTZXQocy53aW5kb3csdCxyLXMud3NpemUscy53c2l6ZSwwKSxzLnduZXh0PTAscy53aGF2ZT1zLndzaXplKToobjwoaT1zLndzaXplLXMud25leHQpJiYoaT1uKSxJLmFycmF5U2V0KHMud2luZG93LHQsci1uLGkscy53bmV4dCksKG4tPWkpPyhJLmFycmF5U2V0KHMud2luZG93LHQsci1uLG4sMCkscy53bmV4dD1uLHMud2hhdmU9cy53c2l6ZSk6KHMud25leHQrPWkscy53bmV4dD09PXMud3NpemUmJihzLnduZXh0PTApLHMud2hhdmU8cy53c2l6ZSYmKHMud2hhdmUrPWkpKSksMH1yLmluZmxhdGVSZXNldD1vLHIuaW5mbGF0ZVJlc2V0Mj1oLHIuaW5mbGF0ZVJlc2V0S2VlcD1hLHIuaW5mbGF0ZUluaXQ9ZnVuY3Rpb24oZSl7cmV0dXJuIHUoZSwxNSl9LHIuaW5mbGF0ZUluaXQyPXUsci5pbmZsYXRlPWZ1bmN0aW9uKGUsdCl7dmFyIHIsbixpLHMsYSxvLGgsdSxsLGYsYyxkLHAsbSxfLGcsYix2LHksdyxrLHgsUyx6LEM9MCxFPW5ldyBJLkJ1ZjgoNCksQT1bMTYsMTcsMTgsMCw4LDcsOSw2LDEwLDUsMTEsNCwxMiwzLDEzLDIsMTQsMSwxNV07aWYoIWV8fCFlLnN0YXRlfHwhZS5vdXRwdXR8fCFlLmlucHV0JiYwIT09ZS5hdmFpbF9pbilyZXR1cm4gVTsxMj09PShyPWUuc3RhdGUpLm1vZGUmJihyLm1vZGU9MTMpLGE9ZS5uZXh0X291dCxpPWUub3V0cHV0LGg9ZS5hdmFpbF9vdXQscz1lLm5leHRfaW4sbj1lLmlucHV0LG89ZS5hdmFpbF9pbix1PXIuaG9sZCxsPXIuYml0cyxmPW8sYz1oLHg9TjtlOmZvcig7Oylzd2l0Y2goci5tb2RlKXtjYXNlIFA6aWYoMD09PXIud3JhcCl7ci5tb2RlPTEzO2JyZWFrfWZvcig7bDwxNjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKDImci53cmFwJiYzNTYxNT09PXUpe0Vbci5jaGVjaz0wXT0yNTUmdSxFWzFdPXU+Pj44JjI1NSxyLmNoZWNrPUIoci5jaGVjayxFLDIsMCksbD11PTAsci5tb2RlPTI7YnJlYWt9aWYoci5mbGFncz0wLHIuaGVhZCYmKHIuaGVhZC5kb25lPSExKSwhKDEmci53cmFwKXx8KCgoMjU1JnUpPDw4KSsodT4+OCkpJTMxKXtlLm1zZz1cImluY29ycmVjdCBoZWFkZXIgY2hlY2tcIixyLm1vZGU9MzA7YnJlYWt9aWYoOCE9KDE1JnUpKXtlLm1zZz1cInVua25vd24gY29tcHJlc3Npb24gbWV0aG9kXCIsci5tb2RlPTMwO2JyZWFrfWlmKGwtPTQsaz04KygxNSYodT4+Pj00KSksMD09PXIud2JpdHMpci53Yml0cz1rO2Vsc2UgaWYoaz5yLndiaXRzKXtlLm1zZz1cImludmFsaWQgd2luZG93IHNpemVcIixyLm1vZGU9MzA7YnJlYWt9ci5kbWF4PTE8PGssZS5hZGxlcj1yLmNoZWNrPTEsci5tb2RlPTUxMiZ1PzEwOjEyLGw9dT0wO2JyZWFrO2Nhc2UgMjpmb3IoO2w8MTY7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1pZihyLmZsYWdzPXUsOCE9KDI1NSZyLmZsYWdzKSl7ZS5tc2c9XCJ1bmtub3duIGNvbXByZXNzaW9uIG1ldGhvZFwiLHIubW9kZT0zMDticmVha31pZig1NzM0NCZyLmZsYWdzKXtlLm1zZz1cInVua25vd24gaGVhZGVyIGZsYWdzIHNldFwiLHIubW9kZT0zMDticmVha31yLmhlYWQmJihyLmhlYWQudGV4dD11Pj44JjEpLDUxMiZyLmZsYWdzJiYoRVswXT0yNTUmdSxFWzFdPXU+Pj44JjI1NSxyLmNoZWNrPUIoci5jaGVjayxFLDIsMCkpLGw9dT0wLHIubW9kZT0zO2Nhc2UgMzpmb3IoO2w8MzI7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLmhlYWQmJihyLmhlYWQudGltZT11KSw1MTImci5mbGFncyYmKEVbMF09MjU1JnUsRVsxXT11Pj4+OCYyNTUsRVsyXT11Pj4+MTYmMjU1LEVbM109dT4+PjI0JjI1NSxyLmNoZWNrPUIoci5jaGVjayxFLDQsMCkpLGw9dT0wLHIubW9kZT00O2Nhc2UgNDpmb3IoO2w8MTY7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLmhlYWQmJihyLmhlYWQueGZsYWdzPTI1NSZ1LHIuaGVhZC5vcz11Pj44KSw1MTImci5mbGFncyYmKEVbMF09MjU1JnUsRVsxXT11Pj4+OCYyNTUsci5jaGVjaz1CKHIuY2hlY2ssRSwyLDApKSxsPXU9MCxyLm1vZGU9NTtjYXNlIDU6aWYoMTAyNCZyLmZsYWdzKXtmb3IoO2w8MTY7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLmxlbmd0aD11LHIuaGVhZCYmKHIuaGVhZC5leHRyYV9sZW49dSksNTEyJnIuZmxhZ3MmJihFWzBdPTI1NSZ1LEVbMV09dT4+PjgmMjU1LHIuY2hlY2s9QihyLmNoZWNrLEUsMiwwKSksbD11PTB9ZWxzZSByLmhlYWQmJihyLmhlYWQuZXh0cmE9bnVsbCk7ci5tb2RlPTY7Y2FzZSA2OmlmKDEwMjQmci5mbGFncyYmKG88KGQ9ci5sZW5ndGgpJiYoZD1vKSxkJiYoci5oZWFkJiYoaz1yLmhlYWQuZXh0cmFfbGVuLXIubGVuZ3RoLHIuaGVhZC5leHRyYXx8KHIuaGVhZC5leHRyYT1uZXcgQXJyYXkoci5oZWFkLmV4dHJhX2xlbikpLEkuYXJyYXlTZXQoci5oZWFkLmV4dHJhLG4scyxkLGspKSw1MTImci5mbGFncyYmKHIuY2hlY2s9QihyLmNoZWNrLG4sZCxzKSksby09ZCxzKz1kLHIubGVuZ3RoLT1kKSxyLmxlbmd0aCkpYnJlYWsgZTtyLmxlbmd0aD0wLHIubW9kZT03O2Nhc2UgNzppZigyMDQ4JnIuZmxhZ3Mpe2lmKDA9PT1vKWJyZWFrIGU7Zm9yKGQ9MDtrPW5bcytkKytdLHIuaGVhZCYmayYmci5sZW5ndGg8NjU1MzYmJihyLmhlYWQubmFtZSs9U3RyaW5nLmZyb21DaGFyQ29kZShrKSksayYmZDxvOyk7aWYoNTEyJnIuZmxhZ3MmJihyLmNoZWNrPUIoci5jaGVjayxuLGQscykpLG8tPWQscys9ZCxrKWJyZWFrIGV9ZWxzZSByLmhlYWQmJihyLmhlYWQubmFtZT1udWxsKTtyLmxlbmd0aD0wLHIubW9kZT04O2Nhc2UgODppZig0MDk2JnIuZmxhZ3Mpe2lmKDA9PT1vKWJyZWFrIGU7Zm9yKGQ9MDtrPW5bcytkKytdLHIuaGVhZCYmayYmci5sZW5ndGg8NjU1MzYmJihyLmhlYWQuY29tbWVudCs9U3RyaW5nLmZyb21DaGFyQ29kZShrKSksayYmZDxvOyk7aWYoNTEyJnIuZmxhZ3MmJihyLmNoZWNrPUIoci5jaGVjayxuLGQscykpLG8tPWQscys9ZCxrKWJyZWFrIGV9ZWxzZSByLmhlYWQmJihyLmhlYWQuY29tbWVudD1udWxsKTtyLm1vZGU9OTtjYXNlIDk6aWYoNTEyJnIuZmxhZ3Mpe2Zvcig7bDwxNjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKHUhPT0oNjU1MzUmci5jaGVjaykpe2UubXNnPVwiaGVhZGVyIGNyYyBtaXNtYXRjaFwiLHIubW9kZT0zMDticmVha31sPXU9MH1yLmhlYWQmJihyLmhlYWQuaGNyYz1yLmZsYWdzPj45JjEsci5oZWFkLmRvbmU9ITApLGUuYWRsZXI9ci5jaGVjaz0wLHIubW9kZT0xMjticmVhaztjYXNlIDEwOmZvcig7bDwzMjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWUuYWRsZXI9ci5jaGVjaz1MKHUpLGw9dT0wLHIubW9kZT0xMTtjYXNlIDExOmlmKDA9PT1yLmhhdmVkaWN0KXJldHVybiBlLm5leHRfb3V0PWEsZS5hdmFpbF9vdXQ9aCxlLm5leHRfaW49cyxlLmF2YWlsX2luPW8sci5ob2xkPXUsci5iaXRzPWwsMjtlLmFkbGVyPXIuY2hlY2s9MSxyLm1vZGU9MTI7Y2FzZSAxMjppZig1PT09dHx8Nj09PXQpYnJlYWsgZTtjYXNlIDEzOmlmKHIubGFzdCl7dT4+Pj03JmwsbC09NyZsLHIubW9kZT0yNzticmVha31mb3IoO2w8Mzspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXN3aXRjaChyLmxhc3Q9MSZ1LGwtPTEsMyYodT4+Pj0xKSl7Y2FzZSAwOnIubW9kZT0xNDticmVhaztjYXNlIDE6aWYoaihyKSxyLm1vZGU9MjAsNiE9PXQpYnJlYWs7dT4+Pj0yLGwtPTI7YnJlYWsgZTtjYXNlIDI6ci5tb2RlPTE3O2JyZWFrO2Nhc2UgMzplLm1zZz1cImludmFsaWQgYmxvY2sgdHlwZVwiLHIubW9kZT0zMH11Pj4+PTIsbC09MjticmVhaztjYXNlIDE0OmZvcih1Pj4+PTcmbCxsLT03Jmw7bDwzMjspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKCg2NTUzNSZ1KSE9KHU+Pj4xNl42NTUzNSkpe2UubXNnPVwiaW52YWxpZCBzdG9yZWQgYmxvY2sgbGVuZ3Roc1wiLHIubW9kZT0zMDticmVha31pZihyLmxlbmd0aD02NTUzNSZ1LGw9dT0wLHIubW9kZT0xNSw2PT09dClicmVhayBlO2Nhc2UgMTU6ci5tb2RlPTE2O2Nhc2UgMTY6aWYoZD1yLmxlbmd0aCl7aWYobzxkJiYoZD1vKSxoPGQmJihkPWgpLDA9PT1kKWJyZWFrIGU7SS5hcnJheVNldChpLG4scyxkLGEpLG8tPWQscys9ZCxoLT1kLGErPWQsci5sZW5ndGgtPWQ7YnJlYWt9ci5tb2RlPTEyO2JyZWFrO2Nhc2UgMTc6Zm9yKDtsPDE0Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYoci5ubGVuPTI1NysoMzEmdSksdT4+Pj01LGwtPTUsci5uZGlzdD0xKygzMSZ1KSx1Pj4+PTUsbC09NSxyLm5jb2RlPTQrKDE1JnUpLHU+Pj49NCxsLT00LDI4NjxyLm5sZW58fDMwPHIubmRpc3Qpe2UubXNnPVwidG9vIG1hbnkgbGVuZ3RoIG9yIGRpc3RhbmNlIHN5bWJvbHNcIixyLm1vZGU9MzA7YnJlYWt9ci5oYXZlPTAsci5tb2RlPTE4O2Nhc2UgMTg6Zm9yKDtyLmhhdmU8ci5uY29kZTspe2Zvcig7bDwzOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9ci5sZW5zW0Fbci5oYXZlKytdXT03JnUsdT4+Pj0zLGwtPTN9Zm9yKDtyLmhhdmU8MTk7KXIubGVuc1tBW3IuaGF2ZSsrXV09MDtpZihyLmxlbmNvZGU9ci5sZW5keW4sci5sZW5iaXRzPTcsUz17Yml0czpyLmxlbmJpdHN9LHg9VCgwLHIubGVucywwLDE5LHIubGVuY29kZSwwLHIud29yayxTKSxyLmxlbmJpdHM9Uy5iaXRzLHgpe2UubXNnPVwiaW52YWxpZCBjb2RlIGxlbmd0aHMgc2V0XCIsci5tb2RlPTMwO2JyZWFrfXIuaGF2ZT0wLHIubW9kZT0xOTtjYXNlIDE5OmZvcig7ci5oYXZlPHIubmxlbityLm5kaXN0Oyl7Zm9yKDtnPShDPXIubGVuY29kZVt1JigxPDxyLmxlbmJpdHMpLTFdKT4+PjE2JjI1NSxiPTY1NTM1JkMsISgoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKGI8MTYpdT4+Pj1fLGwtPV8sci5sZW5zW3IuaGF2ZSsrXT1iO2Vsc2V7aWYoMTY9PT1iKXtmb3Ioej1fKzI7bDx6Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9aWYodT4+Pj1fLGwtPV8sMD09PXIuaGF2ZSl7ZS5tc2c9XCJpbnZhbGlkIGJpdCBsZW5ndGggcmVwZWF0XCIsci5tb2RlPTMwO2JyZWFrfWs9ci5sZW5zW3IuaGF2ZS0xXSxkPTMrKDMmdSksdT4+Pj0yLGwtPTJ9ZWxzZSBpZigxNz09PWIpe2Zvcih6PV8rMztsPHo7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1sLT1fLGs9MCxkPTMrKDcmKHU+Pj49XykpLHU+Pj49MyxsLT0zfWVsc2V7Zm9yKHo9Xys3O2w8ejspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWwtPV8saz0wLGQ9MTErKDEyNyYodT4+Pj1fKSksdT4+Pj03LGwtPTd9aWYoci5oYXZlK2Q+ci5ubGVuK3IubmRpc3Qpe2UubXNnPVwiaW52YWxpZCBiaXQgbGVuZ3RoIHJlcGVhdFwiLHIubW9kZT0zMDticmVha31mb3IoO2QtLTspci5sZW5zW3IuaGF2ZSsrXT1rfX1pZigzMD09PXIubW9kZSlicmVhaztpZigwPT09ci5sZW5zWzI1Nl0pe2UubXNnPVwiaW52YWxpZCBjb2RlIC0tIG1pc3NpbmcgZW5kLW9mLWJsb2NrXCIsci5tb2RlPTMwO2JyZWFrfWlmKHIubGVuYml0cz05LFM9e2JpdHM6ci5sZW5iaXRzfSx4PVQoRCxyLmxlbnMsMCxyLm5sZW4sci5sZW5jb2RlLDAsci53b3JrLFMpLHIubGVuYml0cz1TLmJpdHMseCl7ZS5tc2c9XCJpbnZhbGlkIGxpdGVyYWwvbGVuZ3RocyBzZXRcIixyLm1vZGU9MzA7YnJlYWt9aWYoci5kaXN0Yml0cz02LHIuZGlzdGNvZGU9ci5kaXN0ZHluLFM9e2JpdHM6ci5kaXN0Yml0c30seD1UKEYsci5sZW5zLHIubmxlbixyLm5kaXN0LHIuZGlzdGNvZGUsMCxyLndvcmssUyksci5kaXN0Yml0cz1TLmJpdHMseCl7ZS5tc2c9XCJpbnZhbGlkIGRpc3RhbmNlcyBzZXRcIixyLm1vZGU9MzA7YnJlYWt9aWYoci5tb2RlPTIwLDY9PT10KWJyZWFrIGU7Y2FzZSAyMDpyLm1vZGU9MjE7Y2FzZSAyMTppZig2PD1vJiYyNTg8PWgpe2UubmV4dF9vdXQ9YSxlLmF2YWlsX291dD1oLGUubmV4dF9pbj1zLGUuYXZhaWxfaW49byxyLmhvbGQ9dSxyLmJpdHM9bCxSKGUsYyksYT1lLm5leHRfb3V0LGk9ZS5vdXRwdXQsaD1lLmF2YWlsX291dCxzPWUubmV4dF9pbixuPWUuaW5wdXQsbz1lLmF2YWlsX2luLHU9ci5ob2xkLGw9ci5iaXRzLDEyPT09ci5tb2RlJiYoci5iYWNrPS0xKTticmVha31mb3Ioci5iYWNrPTA7Zz0oQz1yLmxlbmNvZGVbdSYoMTw8ci5sZW5iaXRzKS0xXSk+Pj4xNiYyNTUsYj02NTUzNSZDLCEoKF89Qz4+PjI0KTw9bCk7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1pZihnJiYwPT0oMjQwJmcpKXtmb3Iodj1fLHk9Zyx3PWI7Zz0oQz1yLmxlbmNvZGVbdysoKHUmKDE8PHYreSktMSk+PnYpXSk+Pj4xNiYyNTUsYj02NTUzNSZDLCEodisoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXU+Pj49dixsLT12LHIuYmFjays9dn1pZih1Pj4+PV8sbC09XyxyLmJhY2srPV8sci5sZW5ndGg9YiwwPT09Zyl7ci5tb2RlPTI2O2JyZWFrfWlmKDMyJmcpe3IuYmFjaz0tMSxyLm1vZGU9MTI7YnJlYWt9aWYoNjQmZyl7ZS5tc2c9XCJpbnZhbGlkIGxpdGVyYWwvbGVuZ3RoIGNvZGVcIixyLm1vZGU9MzA7YnJlYWt9ci5leHRyYT0xNSZnLHIubW9kZT0yMjtjYXNlIDIyOmlmKHIuZXh0cmEpe2Zvcih6PXIuZXh0cmE7bDx6Oyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdSs9bltzKytdPDxsLGwrPTh9ci5sZW5ndGgrPXUmKDE8PHIuZXh0cmEpLTEsdT4+Pj1yLmV4dHJhLGwtPXIuZXh0cmEsci5iYWNrKz1yLmV4dHJhfXIud2FzPXIubGVuZ3RoLHIubW9kZT0yMztjYXNlIDIzOmZvcig7Zz0oQz1yLmRpc3Rjb2RlW3UmKDE8PHIuZGlzdGJpdHMpLTFdKT4+PjE2JjI1NSxiPTY1NTM1JkMsISgoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fWlmKDA9PSgyNDAmZykpe2Zvcih2PV8seT1nLHc9YjtnPShDPXIuZGlzdGNvZGVbdysoKHUmKDE8PHYreSktMSk+PnYpXSk+Pj4xNiYyNTUsYj02NTUzNSZDLCEodisoXz1DPj4+MjQpPD1sKTspe2lmKDA9PT1vKWJyZWFrIGU7by0tLHUrPW5bcysrXTw8bCxsKz04fXU+Pj49dixsLT12LHIuYmFjays9dn1pZih1Pj4+PV8sbC09XyxyLmJhY2srPV8sNjQmZyl7ZS5tc2c9XCJpbnZhbGlkIGRpc3RhbmNlIGNvZGVcIixyLm1vZGU9MzA7YnJlYWt9ci5vZmZzZXQ9YixyLmV4dHJhPTE1Jmcsci5tb2RlPTI0O2Nhc2UgMjQ6aWYoci5leHRyYSl7Zm9yKHo9ci5leHRyYTtsPHo7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1yLm9mZnNldCs9dSYoMTw8ci5leHRyYSktMSx1Pj4+PXIuZXh0cmEsbC09ci5leHRyYSxyLmJhY2srPXIuZXh0cmF9aWYoci5vZmZzZXQ+ci5kbWF4KXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2UgdG9vIGZhciBiYWNrXCIsci5tb2RlPTMwO2JyZWFrfXIubW9kZT0yNTtjYXNlIDI1OmlmKDA9PT1oKWJyZWFrIGU7aWYoZD1jLWgsci5vZmZzZXQ+ZCl7aWYoKGQ9ci5vZmZzZXQtZCk+ci53aGF2ZSYmci5zYW5lKXtlLm1zZz1cImludmFsaWQgZGlzdGFuY2UgdG9vIGZhciBiYWNrXCIsci5tb2RlPTMwO2JyZWFrfXA9ZD5yLnduZXh0PyhkLT1yLnduZXh0LHIud3NpemUtZCk6ci53bmV4dC1kLGQ+ci5sZW5ndGgmJihkPXIubGVuZ3RoKSxtPXIud2luZG93fWVsc2UgbT1pLHA9YS1yLm9mZnNldCxkPXIubGVuZ3RoO2ZvcihoPGQmJihkPWgpLGgtPWQsci5sZW5ndGgtPWQ7aVthKytdPW1bcCsrXSwtLWQ7KTswPT09ci5sZW5ndGgmJihyLm1vZGU9MjEpO2JyZWFrO2Nhc2UgMjY6aWYoMD09PWgpYnJlYWsgZTtpW2ErK109ci5sZW5ndGgsaC0tLHIubW9kZT0yMTticmVhaztjYXNlIDI3OmlmKHIud3JhcCl7Zm9yKDtsPDMyOyl7aWYoMD09PW8pYnJlYWsgZTtvLS0sdXw9bltzKytdPDxsLGwrPTh9aWYoYy09aCxlLnRvdGFsX291dCs9YyxyLnRvdGFsKz1jLGMmJihlLmFkbGVyPXIuY2hlY2s9ci5mbGFncz9CKHIuY2hlY2ssaSxjLGEtYyk6TyhyLmNoZWNrLGksYyxhLWMpKSxjPWgsKHIuZmxhZ3M/dTpMKHUpKSE9PXIuY2hlY2spe2UubXNnPVwiaW5jb3JyZWN0IGRhdGEgY2hlY2tcIixyLm1vZGU9MzA7YnJlYWt9bD11PTB9ci5tb2RlPTI4O2Nhc2UgMjg6aWYoci53cmFwJiZyLmZsYWdzKXtmb3IoO2w8MzI7KXtpZigwPT09bylicmVhayBlO28tLSx1Kz1uW3MrK108PGwsbCs9OH1pZih1IT09KDQyOTQ5NjcyOTUmci50b3RhbCkpe2UubXNnPVwiaW5jb3JyZWN0IGxlbmd0aCBjaGVja1wiLHIubW9kZT0zMDticmVha31sPXU9MH1yLm1vZGU9Mjk7Y2FzZSAyOTp4PTE7YnJlYWsgZTtjYXNlIDMwOng9LTM7YnJlYWsgZTtjYXNlIDMxOnJldHVybi00O2Nhc2UgMzI6ZGVmYXVsdDpyZXR1cm4gVX1yZXR1cm4gZS5uZXh0X291dD1hLGUuYXZhaWxfb3V0PWgsZS5uZXh0X2luPXMsZS5hdmFpbF9pbj1vLHIuaG9sZD11LHIuYml0cz1sLChyLndzaXplfHxjIT09ZS5hdmFpbF9vdXQmJnIubW9kZTwzMCYmKHIubW9kZTwyN3x8NCE9PXQpKSYmWihlLGUub3V0cHV0LGUubmV4dF9vdXQsYy1lLmF2YWlsX291dCk/KHIubW9kZT0zMSwtNCk6KGYtPWUuYXZhaWxfaW4sYy09ZS5hdmFpbF9vdXQsZS50b3RhbF9pbis9ZixlLnRvdGFsX291dCs9YyxyLnRvdGFsKz1jLHIud3JhcCYmYyYmKGUuYWRsZXI9ci5jaGVjaz1yLmZsYWdzP0Ioci5jaGVjayxpLGMsZS5uZXh0X291dC1jKTpPKHIuY2hlY2ssaSxjLGUubmV4dF9vdXQtYykpLGUuZGF0YV90eXBlPXIuYml0cysoci5sYXN0PzY0OjApKygxMj09PXIubW9kZT8xMjg6MCkrKDIwPT09ci5tb2RlfHwxNT09PXIubW9kZT8yNTY6MCksKDA9PWYmJjA9PT1jfHw0PT09dCkmJng9PT1OJiYoeD0tNSkseCl9LHIuaW5mbGF0ZUVuZD1mdW5jdGlvbihlKXtpZighZXx8IWUuc3RhdGUpcmV0dXJuIFU7dmFyIHQ9ZS5zdGF0ZTtyZXR1cm4gdC53aW5kb3cmJih0LndpbmRvdz1udWxsKSxlLnN0YXRlPW51bGwsTn0sci5pbmZsYXRlR2V0SGVhZGVyPWZ1bmN0aW9uKGUsdCl7dmFyIHI7cmV0dXJuIGUmJmUuc3RhdGU/MD09KDImKHI9ZS5zdGF0ZSkud3JhcCk/VTooKHIuaGVhZD10KS5kb25lPSExLE4pOlV9LHIuaW5mbGF0ZVNldERpY3Rpb25hcnk9ZnVuY3Rpb24oZSx0KXt2YXIgcixuPXQubGVuZ3RoO3JldHVybiBlJiZlLnN0YXRlPzAhPT0ocj1lLnN0YXRlKS53cmFwJiYxMSE9PXIubW9kZT9VOjExPT09ci5tb2RlJiZPKDEsdCxuLDApIT09ci5jaGVjaz8tMzpaKGUsdCxuLG4pPyhyLm1vZGU9MzEsLTQpOihyLmhhdmVkaWN0PTEsTik6VX0sci5pbmZsYXRlSW5mbz1cInBha28gaW5mbGF0ZSAoZnJvbSBOb2RlY2EgcHJvamVjdClcIn0se1wiLi4vdXRpbHMvY29tbW9uXCI6NDEsXCIuL2FkbGVyMzJcIjo0MyxcIi4vY3JjMzJcIjo0NSxcIi4vaW5mZmFzdFwiOjQ4LFwiLi9pbmZ0cmVlc1wiOjUwfV0sNTA6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt2YXIgRD1lKFwiLi4vdXRpbHMvY29tbW9uXCIpLEY9WzMsNCw1LDYsNyw4LDksMTAsMTEsMTMsMTUsMTcsMTksMjMsMjcsMzEsMzUsNDMsNTEsNTksNjcsODMsOTksMTE1LDEzMSwxNjMsMTk1LDIyNywyNTgsMCwwXSxOPVsxNiwxNiwxNiwxNiwxNiwxNiwxNiwxNiwxNywxNywxNywxNywxOCwxOCwxOCwxOCwxOSwxOSwxOSwxOSwyMCwyMCwyMCwyMCwyMSwyMSwyMSwyMSwxNiw3Miw3OF0sVT1bMSwyLDMsNCw1LDcsOSwxMywxNywyNSwzMyw0OSw2NSw5NywxMjksMTkzLDI1NywzODUsNTEzLDc2OSwxMDI1LDE1MzcsMjA0OSwzMDczLDQwOTcsNjE0NSw4MTkzLDEyMjg5LDE2Mzg1LDI0NTc3LDAsMF0sUD1bMTYsMTYsMTYsMTYsMTcsMTcsMTgsMTgsMTksMTksMjAsMjAsMjEsMjEsMjIsMjIsMjMsMjMsMjQsMjQsMjUsMjUsMjYsMjYsMjcsMjcsMjgsMjgsMjksMjksNjQsNjRdO3QuZXhwb3J0cz1mdW5jdGlvbihlLHQscixuLGkscyxhLG8pe3ZhciBoLHUsbCxmLGMsZCxwLG0sXyxnPW8uYml0cyxiPTAsdj0wLHk9MCx3PTAsaz0wLHg9MCxTPTAsej0wLEM9MCxFPTAsQT1udWxsLEk9MCxPPW5ldyBELkJ1ZjE2KDE2KSxCPW5ldyBELkJ1ZjE2KDE2KSxSPW51bGwsVD0wO2ZvcihiPTA7Yjw9MTU7YisrKU9bYl09MDtmb3Iodj0wO3Y8bjt2KyspT1t0W3Irdl1dKys7Zm9yKGs9Zyx3PTE1OzE8PXcmJjA9PT1PW3ddO3ctLSk7aWYodzxrJiYoaz13KSwwPT09dylyZXR1cm4gaVtzKytdPTIwOTcxNTIwLGlbcysrXT0yMDk3MTUyMCxvLmJpdHM9MSwwO2Zvcih5PTE7eTx3JiYwPT09T1t5XTt5KyspO2ZvcihrPHkmJihrPXkpLGI9ej0xO2I8PTE1O2IrKylpZih6PDw9MSwoei09T1tiXSk8MClyZXR1cm4tMTtpZigwPHomJigwPT09ZXx8MSE9PXcpKXJldHVybi0xO2ZvcihCWzFdPTAsYj0xO2I8MTU7YisrKUJbYisxXT1CW2JdK09bYl07Zm9yKHY9MDt2PG47disrKTAhPT10W3Irdl0mJihhW0JbdFtyK3ZdXSsrXT12KTtpZihkPTA9PT1lPyhBPVI9YSwxOSk6MT09PWU/KEE9RixJLT0yNTcsUj1OLFQtPTI1NywyNTYpOihBPVUsUj1QLC0xKSxiPXksYz1zLFM9dj1FPTAsbD0tMSxmPShDPTE8PCh4PWspKS0xLDE9PT1lJiY4NTI8Q3x8Mj09PWUmJjU5MjxDKXJldHVybiAxO2Zvcig7Oyl7Zm9yKHA9Yi1TLF89YVt2XTxkPyhtPTAsYVt2XSk6YVt2XT5kPyhtPVJbVCthW3ZdXSxBW0krYVt2XV0pOihtPTk2LDApLGg9MTw8Yi1TLHk9dT0xPDx4O2lbYysoRT4+UykrKHUtPWgpXT1wPDwyNHxtPDwxNnxffDAsMCE9PXU7KTtmb3IoaD0xPDxiLTE7RSZoOyloPj49MTtpZigwIT09aD8oRSY9aC0xLEUrPWgpOkU9MCx2KyssMD09LS1PW2JdKXtpZihiPT09dylicmVhaztiPXRbcithW3ZdXX1pZihrPGImJihFJmYpIT09bCl7Zm9yKDA9PT1TJiYoUz1rKSxjKz15LHo9MTw8KHg9Yi1TKTt4K1M8dyYmISgoei09T1t4K1NdKTw9MCk7KXgrKyx6PDw9MTtpZihDKz0xPDx4LDE9PT1lJiY4NTI8Q3x8Mj09PWUmJjU5MjxDKXJldHVybiAxO2lbbD1FJmZdPWs8PDI0fHg8PDE2fGMtc3wwfX1yZXR1cm4gMCE9PUUmJihpW2MrRV09Yi1TPDwyNHw2NDw8MTZ8MCksby5iaXRzPWssMH19LHtcIi4uL3V0aWxzL2NvbW1vblwiOjQxfV0sNTE6W2Z1bmN0aW9uKGUsdCxyKXtcInVzZSBzdHJpY3RcIjt0LmV4cG9ydHM9ezI6XCJuZWVkIGRpY3Rpb25hcnlcIiwxOlwic3RyZWFtIGVuZFwiLDA6XCJcIixcIi0xXCI6XCJmaWxlIGVycm9yXCIsXCItMlwiOlwic3RyZWFtIGVycm9yXCIsXCItM1wiOlwiZGF0YSBlcnJvclwiLFwiLTRcIjpcImluc3VmZmljaWVudCBtZW1vcnlcIixcIi01XCI6XCJidWZmZXIgZXJyb3JcIixcIi02XCI6XCJpbmNvbXBhdGlibGUgdmVyc2lvblwifX0se31dLDUyOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dmFyIGk9ZShcIi4uL3V0aWxzL2NvbW1vblwiKSxvPTAsaD0xO2Z1bmN0aW9uIG4oZSl7Zm9yKHZhciB0PWUubGVuZ3RoOzA8PS0tdDspZVt0XT0wfXZhciBzPTAsYT0yOSx1PTI1NixsPXUrMSthLGY9MzAsYz0xOSxfPTIqbCsxLGc9MTUsZD0xNixwPTcsbT0yNTYsYj0xNix2PTE3LHk9MTgsdz1bMCwwLDAsMCwwLDAsMCwwLDEsMSwxLDEsMiwyLDIsMiwzLDMsMywzLDQsNCw0LDQsNSw1LDUsNSwwXSxrPVswLDAsMCwwLDEsMSwyLDIsMywzLDQsNCw1LDUsNiw2LDcsNyw4LDgsOSw5LDEwLDEwLDExLDExLDEyLDEyLDEzLDEzXSx4PVswLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDIsMyw3XSxTPVsxNiwxNywxOCwwLDgsNyw5LDYsMTAsNSwxMSw0LDEyLDMsMTMsMiwxNCwxLDE1XSx6PW5ldyBBcnJheSgyKihsKzIpKTtuKHopO3ZhciBDPW5ldyBBcnJheSgyKmYpO24oQyk7dmFyIEU9bmV3IEFycmF5KDUxMik7bihFKTt2YXIgQT1uZXcgQXJyYXkoMjU2KTtuKEEpO3ZhciBJPW5ldyBBcnJheShhKTtuKEkpO3ZhciBPLEIsUixUPW5ldyBBcnJheShmKTtmdW5jdGlvbiBEKGUsdCxyLG4saSl7dGhpcy5zdGF0aWNfdHJlZT1lLHRoaXMuZXh0cmFfYml0cz10LHRoaXMuZXh0cmFfYmFzZT1yLHRoaXMuZWxlbXM9bix0aGlzLm1heF9sZW5ndGg9aSx0aGlzLmhhc19zdHJlZT1lJiZlLmxlbmd0aH1mdW5jdGlvbiBGKGUsdCl7dGhpcy5keW5fdHJlZT1lLHRoaXMubWF4X2NvZGU9MCx0aGlzLnN0YXRfZGVzYz10fWZ1bmN0aW9uIE4oZSl7cmV0dXJuIGU8MjU2P0VbZV06RVsyNTYrKGU+Pj43KV19ZnVuY3Rpb24gVShlLHQpe2UucGVuZGluZ19idWZbZS5wZW5kaW5nKytdPTI1NSZ0LGUucGVuZGluZ19idWZbZS5wZW5kaW5nKytdPXQ+Pj44JjI1NX1mdW5jdGlvbiBQKGUsdCxyKXtlLmJpX3ZhbGlkPmQtcj8oZS5iaV9idWZ8PXQ8PGUuYmlfdmFsaWQmNjU1MzUsVShlLGUuYmlfYnVmKSxlLmJpX2J1Zj10Pj5kLWUuYmlfdmFsaWQsZS5iaV92YWxpZCs9ci1kKTooZS5iaV9idWZ8PXQ8PGUuYmlfdmFsaWQmNjU1MzUsZS5iaV92YWxpZCs9cil9ZnVuY3Rpb24gTChlLHQscil7UChlLHJbMip0XSxyWzIqdCsxXSl9ZnVuY3Rpb24gaihlLHQpe2Zvcih2YXIgcj0wO3J8PTEmZSxlPj4+PTEscjw8PTEsMDwtLXQ7KTtyZXR1cm4gcj4+PjF9ZnVuY3Rpb24gWihlLHQscil7dmFyIG4saSxzPW5ldyBBcnJheShnKzEpLGE9MDtmb3Iobj0xO248PWc7bisrKXNbbl09YT1hK3Jbbi0xXTw8MTtmb3IoaT0wO2k8PXQ7aSsrKXt2YXIgbz1lWzIqaSsxXTswIT09byYmKGVbMippXT1qKHNbb10rKyxvKSl9fWZ1bmN0aW9uIFcoZSl7dmFyIHQ7Zm9yKHQ9MDt0PGw7dCsrKWUuZHluX2x0cmVlWzIqdF09MDtmb3IodD0wO3Q8Zjt0KyspZS5keW5fZHRyZWVbMip0XT0wO2Zvcih0PTA7dDxjO3QrKyllLmJsX3RyZWVbMip0XT0wO2UuZHluX2x0cmVlWzIqbV09MSxlLm9wdF9sZW49ZS5zdGF0aWNfbGVuPTAsZS5sYXN0X2xpdD1lLm1hdGNoZXM9MH1mdW5jdGlvbiBNKGUpezg8ZS5iaV92YWxpZD9VKGUsZS5iaV9idWYpOjA8ZS5iaV92YWxpZCYmKGUucGVuZGluZ19idWZbZS5wZW5kaW5nKytdPWUuYmlfYnVmKSxlLmJpX2J1Zj0wLGUuYmlfdmFsaWQ9MH1mdW5jdGlvbiBIKGUsdCxyLG4pe3ZhciBpPTIqdCxzPTIqcjtyZXR1cm4gZVtpXTxlW3NdfHxlW2ldPT09ZVtzXSYmblt0XTw9bltyXX1mdW5jdGlvbiBHKGUsdCxyKXtmb3IodmFyIG49ZS5oZWFwW3JdLGk9cjw8MTtpPD1lLmhlYXBfbGVuJiYoaTxlLmhlYXBfbGVuJiZIKHQsZS5oZWFwW2krMV0sZS5oZWFwW2ldLGUuZGVwdGgpJiZpKyssIUgodCxuLGUuaGVhcFtpXSxlLmRlcHRoKSk7KWUuaGVhcFtyXT1lLmhlYXBbaV0scj1pLGk8PD0xO2UuaGVhcFtyXT1ufWZ1bmN0aW9uIEsoZSx0LHIpe3ZhciBuLGkscyxhLG89MDtpZigwIT09ZS5sYXN0X2xpdClmb3IoO249ZS5wZW5kaW5nX2J1ZltlLmRfYnVmKzIqb108PDh8ZS5wZW5kaW5nX2J1ZltlLmRfYnVmKzIqbysxXSxpPWUucGVuZGluZ19idWZbZS5sX2J1ZitvXSxvKyssMD09PW4/TChlLGksdCk6KEwoZSwocz1BW2ldKSt1KzEsdCksMCE9PShhPXdbc10pJiZQKGUsaS09SVtzXSxhKSxMKGUscz1OKC0tbiksciksMCE9PShhPWtbc10pJiZQKGUsbi09VFtzXSxhKSksbzxlLmxhc3RfbGl0Oyk7TChlLG0sdCl9ZnVuY3Rpb24gWShlLHQpe3ZhciByLG4saSxzPXQuZHluX3RyZWUsYT10LnN0YXRfZGVzYy5zdGF0aWNfdHJlZSxvPXQuc3RhdF9kZXNjLmhhc19zdHJlZSxoPXQuc3RhdF9kZXNjLmVsZW1zLHU9LTE7Zm9yKGUuaGVhcF9sZW49MCxlLmhlYXBfbWF4PV8scj0wO3I8aDtyKyspMCE9PXNbMipyXT8oZS5oZWFwWysrZS5oZWFwX2xlbl09dT1yLGUuZGVwdGhbcl09MCk6c1syKnIrMV09MDtmb3IoO2UuaGVhcF9sZW48Mjspc1syKihpPWUuaGVhcFsrK2UuaGVhcF9sZW5dPXU8Mj8rK3U6MCldPTEsZS5kZXB0aFtpXT0wLGUub3B0X2xlbi0tLG8mJihlLnN0YXRpY19sZW4tPWFbMippKzFdKTtmb3IodC5tYXhfY29kZT11LHI9ZS5oZWFwX2xlbj4+MTsxPD1yO3ItLSlHKGUscyxyKTtmb3IoaT1oO3I9ZS5oZWFwWzFdLGUuaGVhcFsxXT1lLmhlYXBbZS5oZWFwX2xlbi0tXSxHKGUscywxKSxuPWUuaGVhcFsxXSxlLmhlYXBbLS1lLmhlYXBfbWF4XT1yLGUuaGVhcFstLWUuaGVhcF9tYXhdPW4sc1syKmldPXNbMipyXStzWzIqbl0sZS5kZXB0aFtpXT0oZS5kZXB0aFtyXT49ZS5kZXB0aFtuXT9lLmRlcHRoW3JdOmUuZGVwdGhbbl0pKzEsc1syKnIrMV09c1syKm4rMV09aSxlLmhlYXBbMV09aSsrLEcoZSxzLDEpLDI8PWUuaGVhcF9sZW47KTtlLmhlYXBbLS1lLmhlYXBfbWF4XT1lLmhlYXBbMV0sZnVuY3Rpb24oZSx0KXt2YXIgcixuLGkscyxhLG8saD10LmR5bl90cmVlLHU9dC5tYXhfY29kZSxsPXQuc3RhdF9kZXNjLnN0YXRpY190cmVlLGY9dC5zdGF0X2Rlc2MuaGFzX3N0cmVlLGM9dC5zdGF0X2Rlc2MuZXh0cmFfYml0cyxkPXQuc3RhdF9kZXNjLmV4dHJhX2Jhc2UscD10LnN0YXRfZGVzYy5tYXhfbGVuZ3RoLG09MDtmb3Iocz0wO3M8PWc7cysrKWUuYmxfY291bnRbc109MDtmb3IoaFsyKmUuaGVhcFtlLmhlYXBfbWF4XSsxXT0wLHI9ZS5oZWFwX21heCsxO3I8XztyKyspcDwocz1oWzIqaFsyKihuPWUuaGVhcFtyXSkrMV0rMV0rMSkmJihzPXAsbSsrKSxoWzIqbisxXT1zLHU8bnx8KGUuYmxfY291bnRbc10rKyxhPTAsZDw9biYmKGE9Y1tuLWRdKSxvPWhbMipuXSxlLm9wdF9sZW4rPW8qKHMrYSksZiYmKGUuc3RhdGljX2xlbis9byoobFsyKm4rMV0rYSkpKTtpZigwIT09bSl7ZG97Zm9yKHM9cC0xOzA9PT1lLmJsX2NvdW50W3NdOylzLS07ZS5ibF9jb3VudFtzXS0tLGUuYmxfY291bnRbcysxXSs9MixlLmJsX2NvdW50W3BdLS0sbS09Mn13aGlsZSgwPG0pO2ZvcihzPXA7MCE9PXM7cy0tKWZvcihuPWUuYmxfY291bnRbc107MCE9PW47KXU8KGk9ZS5oZWFwWy0tcl0pfHwoaFsyKmkrMV0hPT1zJiYoZS5vcHRfbGVuKz0ocy1oWzIqaSsxXSkqaFsyKmldLGhbMippKzFdPXMpLG4tLSl9fShlLHQpLFoocyx1LGUuYmxfY291bnQpfWZ1bmN0aW9uIFgoZSx0LHIpe3ZhciBuLGkscz0tMSxhPXRbMV0sbz0wLGg9Nyx1PTQ7Zm9yKDA9PT1hJiYoaD0xMzgsdT0zKSx0WzIqKHIrMSkrMV09NjU1MzUsbj0wO248PXI7bisrKWk9YSxhPXRbMioobisxKSsxXSwrK288aCYmaT09PWF8fChvPHU/ZS5ibF90cmVlWzIqaV0rPW86MCE9PWk/KGkhPT1zJiZlLmJsX3RyZWVbMippXSsrLGUuYmxfdHJlZVsyKmJdKyspOm88PTEwP2UuYmxfdHJlZVsyKnZdKys6ZS5ibF90cmVlWzIqeV0rKyxzPWksdT0obz0wKT09PWE/KGg9MTM4LDMpOmk9PT1hPyhoPTYsMyk6KGg9Nyw0KSl9ZnVuY3Rpb24gVihlLHQscil7dmFyIG4saSxzPS0xLGE9dFsxXSxvPTAsaD03LHU9NDtmb3IoMD09PWEmJihoPTEzOCx1PTMpLG49MDtuPD1yO24rKylpZihpPWEsYT10WzIqKG4rMSkrMV0sISgrK288aCYmaT09PWEpKXtpZihvPHUpZm9yKDtMKGUsaSxlLmJsX3RyZWUpLDAhPS0tbzspO2Vsc2UgMCE9PWk/KGkhPT1zJiYoTChlLGksZS5ibF90cmVlKSxvLS0pLEwoZSxiLGUuYmxfdHJlZSksUChlLG8tMywyKSk6bzw9MTA/KEwoZSx2LGUuYmxfdHJlZSksUChlLG8tMywzKSk6KEwoZSx5LGUuYmxfdHJlZSksUChlLG8tMTEsNykpO3M9aSx1PShvPTApPT09YT8oaD0xMzgsMyk6aT09PWE/KGg9NiwzKTooaD03LDQpfX1uKFQpO3ZhciBxPSExO2Z1bmN0aW9uIEooZSx0LHIsbil7UChlLChzPDwxKSsobj8xOjApLDMpLGZ1bmN0aW9uKGUsdCxyLG4pe00oZSksbiYmKFUoZSxyKSxVKGUsfnIpKSxpLmFycmF5U2V0KGUucGVuZGluZ19idWYsZS53aW5kb3csdCxyLGUucGVuZGluZyksZS5wZW5kaW5nKz1yfShlLHQsciwhMCl9ci5fdHJfaW5pdD1mdW5jdGlvbihlKXtxfHwoZnVuY3Rpb24oKXt2YXIgZSx0LHIsbixpLHM9bmV3IEFycmF5KGcrMSk7Zm9yKG49cj0wO248YS0xO24rKylmb3IoSVtuXT1yLGU9MDtlPDE8PHdbbl07ZSsrKUFbcisrXT1uO2ZvcihBW3ItMV09bixuPWk9MDtuPDE2O24rKylmb3IoVFtuXT1pLGU9MDtlPDE8PGtbbl07ZSsrKUVbaSsrXT1uO2ZvcihpPj49NztuPGY7bisrKWZvcihUW25dPWk8PDcsZT0wO2U8MTw8a1tuXS03O2UrKylFWzI1NitpKytdPW47Zm9yKHQ9MDt0PD1nO3QrKylzW3RdPTA7Zm9yKGU9MDtlPD0xNDM7KXpbMiplKzFdPTgsZSsrLHNbOF0rKztmb3IoO2U8PTI1NTspelsyKmUrMV09OSxlKyssc1s5XSsrO2Zvcig7ZTw9Mjc5Oyl6WzIqZSsxXT03LGUrKyxzWzddKys7Zm9yKDtlPD0yODc7KXpbMiplKzFdPTgsZSsrLHNbOF0rKztmb3IoWih6LGwrMSxzKSxlPTA7ZTxmO2UrKylDWzIqZSsxXT01LENbMiplXT1qKGUsNSk7Tz1uZXcgRCh6LHcsdSsxLGwsZyksQj1uZXcgRChDLGssMCxmLGcpLFI9bmV3IEQobmV3IEFycmF5KDApLHgsMCxjLHApfSgpLHE9ITApLGUubF9kZXNjPW5ldyBGKGUuZHluX2x0cmVlLE8pLGUuZF9kZXNjPW5ldyBGKGUuZHluX2R0cmVlLEIpLGUuYmxfZGVzYz1uZXcgRihlLmJsX3RyZWUsUiksZS5iaV9idWY9MCxlLmJpX3ZhbGlkPTAsVyhlKX0sci5fdHJfc3RvcmVkX2Jsb2NrPUosci5fdHJfZmx1c2hfYmxvY2s9ZnVuY3Rpb24oZSx0LHIsbil7dmFyIGkscyxhPTA7MDxlLmxldmVsPygyPT09ZS5zdHJtLmRhdGFfdHlwZSYmKGUuc3RybS5kYXRhX3R5cGU9ZnVuY3Rpb24oZSl7dmFyIHQscj00MDkzNjI0NDQ3O2Zvcih0PTA7dDw9MzE7dCsrLHI+Pj49MSlpZigxJnImJjAhPT1lLmR5bl9sdHJlZVsyKnRdKXJldHVybiBvO2lmKDAhPT1lLmR5bl9sdHJlZVsxOF18fDAhPT1lLmR5bl9sdHJlZVsyMF18fDAhPT1lLmR5bl9sdHJlZVsyNl0pcmV0dXJuIGg7Zm9yKHQ9MzI7dDx1O3QrKylpZigwIT09ZS5keW5fbHRyZWVbMip0XSlyZXR1cm4gaDtyZXR1cm4gb30oZSkpLFkoZSxlLmxfZGVzYyksWShlLGUuZF9kZXNjKSxhPWZ1bmN0aW9uKGUpe3ZhciB0O2ZvcihYKGUsZS5keW5fbHRyZWUsZS5sX2Rlc2MubWF4X2NvZGUpLFgoZSxlLmR5bl9kdHJlZSxlLmRfZGVzYy5tYXhfY29kZSksWShlLGUuYmxfZGVzYyksdD1jLTE7Mzw9dCYmMD09PWUuYmxfdHJlZVsyKlNbdF0rMV07dC0tKTtyZXR1cm4gZS5vcHRfbGVuKz0zKih0KzEpKzUrNSs0LHR9KGUpLGk9ZS5vcHRfbGVuKzMrNz4+PjMsKHM9ZS5zdGF0aWNfbGVuKzMrNz4+PjMpPD1pJiYoaT1zKSk6aT1zPXIrNSxyKzQ8PWkmJi0xIT09dD9KKGUsdCxyLG4pOjQ9PT1lLnN0cmF0ZWd5fHxzPT09aT8oUChlLDIrKG4/MTowKSwzKSxLKGUseixDKSk6KFAoZSw0KyhuPzE6MCksMyksZnVuY3Rpb24oZSx0LHIsbil7dmFyIGk7Zm9yKFAoZSx0LTI1Nyw1KSxQKGUsci0xLDUpLFAoZSxuLTQsNCksaT0wO2k8bjtpKyspUChlLGUuYmxfdHJlZVsyKlNbaV0rMV0sMyk7VihlLGUuZHluX2x0cmVlLHQtMSksVihlLGUuZHluX2R0cmVlLHItMSl9KGUsZS5sX2Rlc2MubWF4X2NvZGUrMSxlLmRfZGVzYy5tYXhfY29kZSsxLGErMSksSyhlLGUuZHluX2x0cmVlLGUuZHluX2R0cmVlKSksVyhlKSxuJiZNKGUpfSxyLl90cl90YWxseT1mdW5jdGlvbihlLHQscil7cmV0dXJuIGUucGVuZGluZ19idWZbZS5kX2J1ZisyKmUubGFzdF9saXRdPXQ+Pj44JjI1NSxlLnBlbmRpbmdfYnVmW2UuZF9idWYrMiplLmxhc3RfbGl0KzFdPTI1NSZ0LGUucGVuZGluZ19idWZbZS5sX2J1ZitlLmxhc3RfbGl0XT0yNTUmcixlLmxhc3RfbGl0KyssMD09PXQ/ZS5keW5fbHRyZWVbMipyXSsrOihlLm1hdGNoZXMrKyx0LS0sZS5keW5fbHRyZWVbMiooQVtyXSt1KzEpXSsrLGUuZHluX2R0cmVlWzIqTih0KV0rKyksZS5sYXN0X2xpdD09PWUubGl0X2J1ZnNpemUtMX0sci5fdHJfYWxpZ249ZnVuY3Rpb24oZSl7UChlLDIsMyksTChlLG0seiksZnVuY3Rpb24oZSl7MTY9PT1lLmJpX3ZhbGlkPyhVKGUsZS5iaV9idWYpLGUuYmlfYnVmPTAsZS5iaV92YWxpZD0wKTo4PD1lLmJpX3ZhbGlkJiYoZS5wZW5kaW5nX2J1ZltlLnBlbmRpbmcrK109MjU1JmUuYmlfYnVmLGUuYmlfYnVmPj49OCxlLmJpX3ZhbGlkLT04KX0oZSl9fSx7XCIuLi91dGlscy9jb21tb25cIjo0MX1dLDUzOltmdW5jdGlvbihlLHQscil7XCJ1c2Ugc3RyaWN0XCI7dC5leHBvcnRzPWZ1bmN0aW9uKCl7dGhpcy5pbnB1dD1udWxsLHRoaXMubmV4dF9pbj0wLHRoaXMuYXZhaWxfaW49MCx0aGlzLnRvdGFsX2luPTAsdGhpcy5vdXRwdXQ9bnVsbCx0aGlzLm5leHRfb3V0PTAsdGhpcy5hdmFpbF9vdXQ9MCx0aGlzLnRvdGFsX291dD0wLHRoaXMubXNnPVwiXCIsdGhpcy5zdGF0ZT1udWxsLHRoaXMuZGF0YV90eXBlPTIsdGhpcy5hZGxlcj0wfX0se31dLDU0OltmdW5jdGlvbihlLHQscil7KGZ1bmN0aW9uKGUpeyFmdW5jdGlvbihyLG4pe1widXNlIHN0cmljdFwiO2lmKCFyLnNldEltbWVkaWF0ZSl7dmFyIGkscyx0LGEsbz0xLGg9e30sdT0hMSxsPXIuZG9jdW1lbnQsZT1PYmplY3QuZ2V0UHJvdG90eXBlT2YmJk9iamVjdC5nZXRQcm90b3R5cGVPZihyKTtlPWUmJmUuc2V0VGltZW91dD9lOnIsaT1cIltvYmplY3QgcHJvY2Vzc11cIj09PXt9LnRvU3RyaW5nLmNhbGwoci5wcm9jZXNzKT9mdW5jdGlvbihlKXtwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCl7YyhlKX0pfTpmdW5jdGlvbigpe2lmKHIucG9zdE1lc3NhZ2UmJiFyLmltcG9ydFNjcmlwdHMpe3ZhciBlPSEwLHQ9ci5vbm1lc3NhZ2U7cmV0dXJuIHIub25tZXNzYWdlPWZ1bmN0aW9uKCl7ZT0hMX0sci5wb3N0TWVzc2FnZShcIlwiLFwiKlwiKSxyLm9ubWVzc2FnZT10LGV9fSgpPyhhPVwic2V0SW1tZWRpYXRlJFwiK01hdGgucmFuZG9tKCkrXCIkXCIsci5hZGRFdmVudExpc3RlbmVyP3IuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIixkLCExKTpyLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsZCksZnVuY3Rpb24oZSl7ci5wb3N0TWVzc2FnZShhK2UsXCIqXCIpfSk6ci5NZXNzYWdlQ2hhbm5lbD8oKHQ9bmV3IE1lc3NhZ2VDaGFubmVsKS5wb3J0MS5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7YyhlLmRhdGEpfSxmdW5jdGlvbihlKXt0LnBvcnQyLnBvc3RNZXNzYWdlKGUpfSk6bCYmXCJvbnJlYWR5c3RhdGVjaGFuZ2VcImluIGwuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKT8ocz1sLmRvY3VtZW50RWxlbWVudCxmdW5jdGlvbihlKXt2YXIgdD1sLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7dC5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtjKGUpLHQub25yZWFkeXN0YXRlY2hhbmdlPW51bGwscy5yZW1vdmVDaGlsZCh0KSx0PW51bGx9LHMuYXBwZW5kQ2hpbGQodCl9KTpmdW5jdGlvbihlKXtzZXRUaW1lb3V0KGMsMCxlKX0sZS5zZXRJbW1lZGlhdGU9ZnVuY3Rpb24oZSl7XCJmdW5jdGlvblwiIT10eXBlb2YgZSYmKGU9bmV3IEZ1bmN0aW9uKFwiXCIrZSkpO2Zvcih2YXIgdD1uZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aC0xKSxyPTA7cjx0Lmxlbmd0aDtyKyspdFtyXT1hcmd1bWVudHNbcisxXTt2YXIgbj17Y2FsbGJhY2s6ZSxhcmdzOnR9O3JldHVybiBoW29dPW4saShvKSxvKyt9LGUuY2xlYXJJbW1lZGlhdGU9Zn1mdW5jdGlvbiBmKGUpe2RlbGV0ZSBoW2VdfWZ1bmN0aW9uIGMoZSl7aWYodSlzZXRUaW1lb3V0KGMsMCxlKTtlbHNle3ZhciB0PWhbZV07aWYodCl7dT0hMDt0cnl7IWZ1bmN0aW9uKGUpe3ZhciB0PWUuY2FsbGJhY2sscj1lLmFyZ3M7c3dpdGNoKHIubGVuZ3RoKXtjYXNlIDA6dCgpO2JyZWFrO2Nhc2UgMTp0KHJbMF0pO2JyZWFrO2Nhc2UgMjp0KHJbMF0sclsxXSk7YnJlYWs7Y2FzZSAzOnQoclswXSxyWzFdLHJbMl0pO2JyZWFrO2RlZmF1bHQ6dC5hcHBseShuLHIpfX0odCl9ZmluYWxseXtmKGUpLHU9ITF9fX19ZnVuY3Rpb24gZChlKXtlLnNvdXJjZT09PXImJlwic3RyaW5nXCI9PXR5cGVvZiBlLmRhdGEmJjA9PT1lLmRhdGEuaW5kZXhPZihhKSYmYygrZS5kYXRhLnNsaWNlKGEubGVuZ3RoKSl9fShcInVuZGVmaW5lZFwiPT10eXBlb2Ygc2VsZj92b2lkIDA9PT1lP3RoaXM6ZTpzZWxmKX0pLmNhbGwodGhpcyxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9KX0se31dfSx7fSxbMTBdKSgxMCl9KTsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAxOCBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmZXIgPSB2b2lkIDA7XG4vLyBDcmVhdGUgYSBwcm9taXNlIHdpdGggZXhwb3NlZCByZXNvbHZlIGFuZCByZWplY3QgY2FsbGJhY2tzLlxuZnVuY3Rpb24gZGVmZXIoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBsZXQgcmVzb2x2ZSA9IG51bGw7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBsZXQgcmVqZWN0ID0gbnVsbDtcbiAgICBjb25zdCBwID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiBbcmVzb2x2ZSwgcmVqZWN0XSA9IFtyZXMsIHJlal0pO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocCwgeyByZXNvbHZlLCByZWplY3QgfSk7XG59XG5leHBvcnRzLmRlZmVyID0gZGVmZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaWdub3JlQ2FjaGVVbmFjdGlvbmFibGVFcnJvcnMgPSBleHBvcnRzLmdldEVycm9yTWVzc2FnZSA9IHZvaWQgMDtcbi8vIEF0dGVtcHQgdG8gY29lcmNlIGFuIGVycm9yIG9iamVjdCBpbnRvIGEgc3RyaW5nIG1lc3NhZ2UuXG4vLyBTb21ldGltZXMgYW4gZXJyb3IgbWVzc2FnZSBpcyB3cmFwcGVkIGluIGFuIEVycm9yIG9iamVjdCwgc29tZXRpbWVzIG5vdC5cbmZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShlKSB7XG4gICAgaWYgKGUgJiYgdHlwZW9mIGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnN0IGVycm9yT2JqZWN0ID0gZTtcbiAgICAgICAgaWYgKGVycm9yT2JqZWN0Lm1lc3NhZ2UpIHsgLy8gcmVndWxhciBFcnJvciBPYmplY3RcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoZXJyb3JPYmplY3QubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXJyb3JPYmplY3QuZXJyb3I/Lm1lc3NhZ2UpIHsgLy8gQVBJIHJlc3VsdFxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhlcnJvck9iamVjdC5lcnJvci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhc1N0cmluZyA9IFN0cmluZyhlKTtcbiAgICBpZiAoYXNTdHJpbmcgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKHN0cmluZ2lmeUVycm9yKSB7XG4gICAgICAgICAgICAvLyBpZ25vcmUgZmFpbHVyZXMgYW5kIGp1c3QgZmFsbCB0aHJvdWdoXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFzU3RyaW5nO1xufVxuZXhwb3J0cy5nZXRFcnJvck1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2U7XG4vLyBPY2Nhc2lvbmFsbHkgb3BlcmF0aW9ucyB1c2luZyB0aGUgY2FjaGUgQVBJIHRocm93OlxuLy8gJ1Vua25vd25FcnJvcjogVW5leHBlY3RlZCBpbnRlcm5hbCBlcnJvci4ge30nXG4vLyBJdCdzIG5vdCBjbGVhciB1bmRlciB3aGljaCBjaXJjdW1zdGFuY2VzIHRoaXMgY2FuIG9jY3VyLiBBIGRpdmUgb2Zcbi8vIHRoZSBDaHJvbWl1bSBjb2RlIGRpZG4ndCBzaGVkIG11Y2ggbGlnaHQ6XG4vLyBodHRwczovL3NvdXJjZS5jaHJvbWl1bS5vcmcvY2hyb21pdW0vY2hyb21pdW0vc3JjLysvbWFpbjp0aGlyZF9wYXJ0eS9ibGluay9yZW5kZXJlci9tb2R1bGVzL2NhY2hlX3N0b3JhZ2UvY2FjaGVfc3RvcmFnZV9lcnJvci5jYztsPTI2O2RyYz00Y2ZlODY0ODJiMDAwZTg0ODAwOTA3Nzc4M2JhMzVmODNmM2MzY2ZlXG4vLyBodHRwczovL3NvdXJjZS5jaHJvbWl1bS5vcmcvY2hyb21pdW0vY2hyb21pdW0vc3JjLysvbWFpbjpjb250ZW50L2Jyb3dzZXIvY2FjaGVfc3RvcmFnZS9jYWNoZV9zdG9yYWdlX2NhY2hlLmNjO2w9MTY4NjtkcmM9YWI2OGMwNWJlYjc5MGQwNGQxY2I3ZmQ4ZmFhMGExOTdmYjQwZDM5OVxuLy8gR2l2ZW4gdGhlIGVycm9yIGlzIG5vdCBhY3Rpb25hYmxlIGF0IHByZXNlbnQgYW5kIGNhY2hpbmcgaXMgJ2Jlc3Rcbi8vIGVmZm9ydCcgaW4gYW55IGNhc2UgaWdub3JlIHRoaXMgZXJyb3IuIFdlIHdpbGwgd2FudCB0byB0aHJvdyBmb3Jcbi8vIGVycm9ycyBpbiBnZW5lcmFsIHRob3VnaCBzbyBhcyBub3QgdG8gaGlkZSBlcnJvcnMgd2UgYWN0dWFsbHkgY291bGRcbi8vIGZpeC5cbi8vIFNlZSBiLzIyNzc4NTY2NSBmb3IgYW4gZXhhbXBsZS5cbmZ1bmN0aW9uIGlnbm9yZUNhY2hlVW5hY3Rpb25hYmxlRXJyb3JzKGUsIHJlc3VsdCkge1xuICAgIGlmIChnZXRFcnJvck1lc3NhZ2UoZSkuaW5jbHVkZXMoJ1Vua25vd25FcnJvcicpKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbn1cbmV4cG9ydHMuaWdub3JlQ2FjaGVVbmFjdGlvbmFibGVFcnJvcnMgPSBpZ25vcmVDYWNoZVVuYWN0aW9uYWJsZUVycm9ycztcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDE4IFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hc3NlcnRVbnJlYWNoYWJsZSA9IGV4cG9ydHMucmVwb3J0RXJyb3IgPSBleHBvcnRzLnNldEVycm9ySGFuZGxlciA9IGV4cG9ydHMuYXNzZXJ0RmFsc2UgPSBleHBvcnRzLmFzc2VydFRydWUgPSBleHBvcnRzLmFzc2VydEV4aXN0cyA9IHZvaWQgMDtcbmxldCBlcnJvckhhbmRsZXIgPSAoXykgPT4geyB9O1xuZnVuY3Rpb24gYXNzZXJ0RXhpc3RzKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZXhwb3J0cy5hc3NlcnRFeGlzdHMgPSBhc3NlcnRFeGlzdHM7XG5mdW5jdGlvbiBhc3NlcnRUcnVlKHZhbHVlLCBvcHRNc2cpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihvcHRNc2cgPz8gJ0ZhaWxlZCBhc3NlcnRpb24nKTtcbiAgICB9XG59XG5leHBvcnRzLmFzc2VydFRydWUgPSBhc3NlcnRUcnVlO1xuZnVuY3Rpb24gYXNzZXJ0RmFsc2UodmFsdWUsIG9wdE1zZykge1xuICAgIGFzc2VydFRydWUoIXZhbHVlLCBvcHRNc2cpO1xufVxuZXhwb3J0cy5hc3NlcnRGYWxzZSA9IGFzc2VydEZhbHNlO1xuZnVuY3Rpb24gc2V0RXJyb3JIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICBlcnJvckhhbmRsZXIgPSBoYW5kbGVyO1xufVxuZXhwb3J0cy5zZXRFcnJvckhhbmRsZXIgPSBzZXRFcnJvckhhbmRsZXI7XG5mdW5jdGlvbiByZXBvcnRFcnJvcihlcnIpIHtcbiAgICBsZXQgZXJyTG9nID0gJyc7XG4gICAgbGV0IGVycm9yT2JqID0gdW5kZWZpbmVkO1xuICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvckV2ZW50KSB7XG4gICAgICAgIGVyckxvZyA9IGVyci5tZXNzYWdlO1xuICAgICAgICBlcnJvck9iaiA9IGVyci5lcnJvcjtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50KSB7XG4gICAgICAgIGVyckxvZyA9IGAke2Vyci5yZWFzb259YDtcbiAgICAgICAgZXJyb3JPYmogPSBlcnIucmVhc29uO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXJyTG9nID0gYCR7ZXJyfWA7XG4gICAgfVxuICAgIGlmIChlcnJvck9iaiAhPT0gdW5kZWZpbmVkICYmIGVycm9yT2JqICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGVyclN0YWNrID0gZXJyb3JPYmouc3RhY2s7XG4gICAgICAgIGVyckxvZyArPSAnXFxuJztcbiAgICAgICAgZXJyTG9nICs9IGVyclN0YWNrICE9PSB1bmRlZmluZWQgPyBlcnJTdGFjayA6IEpTT04uc3RyaW5naWZ5KGVycm9yT2JqKTtcbiAgICB9XG4gICAgZXJyTG9nICs9ICdcXG5cXG4nO1xuICAgIGVyckxvZyArPSBgVUE6ICR7bmF2aWdhdG9yLnVzZXJBZ2VudH1cXG5gO1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyTG9nLCBlcnIpO1xuICAgIGVycm9ySGFuZGxlcihlcnJMb2cpO1xufVxuZXhwb3J0cy5yZXBvcnRFcnJvciA9IHJlcG9ydEVycm9yO1xuLy8gVGhpcyBmdW5jdGlvbiBzZXJ2ZXMgdHdvIHB1cnBvc2VzLlxuLy8gMSkgQSBydW50aW1lIGNoZWNrIC0gaWYgd2UgYXJlIGV2ZXIgY2FsbGVkLCB3ZSB0aHJvdyBhbiBleGNlcHRpb24uXG4vLyBUaGlzIGlzIHVzZWZ1bCBmb3IgY2hlY2tpbmcgdGhhdCBjb2RlIHdlIHN1c3BlY3Qgc2hvdWxkIG5ldmVyIGJlIHJlYWNoZWQgaXNcbi8vIGFjdHVhbGx5IG5ldmVyIHJlYWNoZWQuXG4vLyAyKSBBIGNvbXBpbGUgdGltZSBjaGVjayB3aGVyZSB0eXBlc2NyaXB0IGFzc2VydHMgdGhhdCB0aGUgdmFsdWUgcGFzc2VkIGNhbiBiZVxuLy8gY2FzdCB0byB0aGUgXCJuZXZlclwiIHR5cGUuXG4vLyBUaGlzIGlzIHVzZWZ1bCBmb3IgZW5zdXJpbmcgd2UgZXhoYXN0aXZlbHkgY2hlY2sgdW5pb24gdHlwZXMuXG5mdW5jdGlvbiBhc3NlcnRVbnJlYWNoYWJsZShfeCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBjb2RlIHNob3VsZCBub3QgYmUgcmVhY2hhYmxlJyk7XG59XG5leHBvcnRzLmFzc2VydFVucmVhY2hhYmxlID0gYXNzZXJ0VW5yZWFjaGFibGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMyBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNFbnVtVmFsdWUgPSBleHBvcnRzLmlzU3RyaW5nID0gZXhwb3J0cy5zaGFsbG93RXF1YWxzID0gZXhwb3J0cy5sb29rdXBQYXRoID0gdm9pZCAwO1xuLy8gR2l2ZW4gYW4gb2JqZWN0LCByZXR1cm4gYSByZWYgdG8gdGhlIG9iamVjdCBvciBpdGVtIGF0IGF0IGEgZ2l2ZW4gcGF0aC5cbi8vIEEgcGF0aCBpcyBkZWZpbmVkIHVzaW5nIGFuIGFycmF5IG9mIHBhdGgtbGlrZSBlbGVtZW50czogSS5lLiBbc3RyaW5nfG51bWJlcl0uXG4vLyBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGUgcGF0aCBkb2Vzbid0IGV4aXN0LlxuLy8gTm90ZTogVGhpcyBpcyBhbiBhcHByb3ByaWF0ZSB1c2Ugb2YgYGFueWAsIGFzIHdlIGFyZSBrbm93aW5nbHkgZ2V0dGluZyBmYXN0XG4vLyBhbmQgbG9vc2Ugd2l0aCB0aGUgdHlwZSBzeXN0ZW0gaW4gdGhpcyBmdW5jdGlvbjogaXQncyBiYXNpY2FsbHkgSmF2YVNjcmlwdC5cbi8vIEF0dGVtcHRpbmcgdG8gcHJldGVuZCBpdCdzIGFueXRoaW5nIGVsc2Ugd291bGQgcmVzdWx0IGluIHN1cGVyZmx1b3VzIHR5cGVcbi8vIGFzc2VydGlvbnMgd2hpY2ggd291bGQgaGF2ZSBubyBiZW5lZml0LlxuLy8gSSdtIHN1cmUgd2UgY291bGQgY29udmluY2UgVHlwZVNjcmlwdCB0byBmb2xsb3cgdGhlIHBhdGggYW5kIHR5cGUgZXZlcnl0aGluZ1xuLy8gY29ycmVjdGx5IGFsb25nIHRoZSB3YXksIGJ1dCB0aGF0J3MgYSBqb2IgZm9yIGFub3RoZXIgZGF5LlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmZ1bmN0aW9uIGxvb2t1cFBhdGgodmFsdWUsIHBhdGgpIHtcbiAgICBsZXQgbyA9IHZhbHVlO1xuICAgIGZvciAoY29uc3QgcCBvZiBwYXRoKSB7XG4gICAgICAgIGlmIChwIGluIG8pIHtcbiAgICAgICAgICAgIG8gPSBvW3BdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbztcbn1cbmV4cG9ydHMubG9va3VwUGF0aCA9IGxvb2t1cFBhdGg7XG5mdW5jdGlvbiBzaGFsbG93RXF1YWxzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3Qgb2JqQSA9IGE7XG4gICAgY29uc3Qgb2JqQiA9IGI7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqQSkpIHtcbiAgICAgICAgaWYgKG9iakFba2V5XSAhPT0gb2JqQltrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqQikpIHtcbiAgICAgICAgaWYgKG9iakFba2V5XSAhPT0gb2JqQltrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLnNoYWxsb3dFcXVhbHMgPSBzaGFsbG93RXF1YWxzO1xuZnVuY3Rpb24gaXNTdHJpbmcocykge1xuICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgfHwgcyBpbnN0YW5jZW9mIFN0cmluZztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbi8vIEdpdmVuIGEgc3RyaW5nIGVudW0gfGVudW18LCBjaGVjayB0aGF0IHx2YWx1ZXwgaXMgYSB2YWxpZCBtZW1iZXIgb2YgfGVudW18LlxuZnVuY3Rpb24gaXNFbnVtVmFsdWUoZW5tLCB2YWx1ZSkge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGVubSkuaW5jbHVkZXModmFsdWUpO1xufVxuZXhwb3J0cy5pc0VudW1WYWx1ZSA9IGlzRW51bVZhbHVlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMTkgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVuZG9Db21tb25DaGF0QXBwUmVwbGFjZW1lbnRzID0gZXhwb3J0cy5zcWxpdGVTdHJpbmcgPSBleHBvcnRzLmJpbmFyeURlY29kZSA9IGV4cG9ydHMuYmluYXJ5RW5jb2RlID0gZXhwb3J0cy51dGY4RGVjb2RlID0gZXhwb3J0cy51dGY4RW5jb2RlID0gZXhwb3J0cy5oZXhFbmNvZGUgPSBleHBvcnRzLmJhc2U2NERlY29kZSA9IGV4cG9ydHMuYmFzZTY0RW5jb2RlID0gdm9pZCAwO1xuY29uc3QgYmFzZTY0XzEgPSByZXF1aXJlKFwiQHByb3RvYnVmanMvYmFzZTY0XCIpO1xuY29uc3QgdXRmOF8xID0gcmVxdWlyZShcIkBwcm90b2J1ZmpzL3V0ZjhcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi9sb2dnaW5nXCIpO1xuLy8gVGV4dERlY29kZXIvRGVjb2RlciByZXF1aXJlcyB0aGUgZnVsbCBET00gYW5kIGlzbid0IGF2YWlsYWJsZSBpbiBhbGwgdHlwZXNcbi8vIG9mIHRlc3RzLiBVc2UgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gZnJvbSBwcm90YnVmanMuXG5sZXQgVXRmOERlY29kZXI7XG5sZXQgVXRmOEVuY29kZXI7XG50cnkge1xuICAgIFV0ZjhEZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcpO1xuICAgIFV0ZjhFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG59XG5jYXRjaCAoXykge1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gU2lsZW5jZSB0aGUgd2FybmluZyB3aGVuIHdlIGtub3cgd2UgYXJlIHJ1bm5pbmcgdW5kZXIgTm9kZUpTLlxuICAgICAgICBjb25zb2xlLndhcm4oJ1VzaW5nIGZhbGxiYWNrIFVURjggRW5jb2Rlci9EZWNvZGVyLCBUaGlzIHNob3VsZCBoYXBwZW4gb25seSBpbiAnICtcbiAgICAgICAgICAgICd0ZXN0cyBhbmQgTm9kZUpTLWJhc2VkIGVudmlyb25tZW50cywgbm90IGluIGJyb3dzZXJzLicpO1xuICAgIH1cbiAgICBVdGY4RGVjb2RlciA9IHsgZGVjb2RlOiAoYnVmKSA9PiAoMCwgdXRmOF8xLnJlYWQpKGJ1ZiwgMCwgYnVmLmxlbmd0aCkgfTtcbiAgICBVdGY4RW5jb2RlciA9IHtcbiAgICAgICAgZW5jb2RlOiAoc3RyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheSgoMCwgdXRmOF8xLmxlbmd0aCkoc3RyKSk7XG4gICAgICAgICAgICBjb25zdCB3cml0dGVuID0gKDAsIHV0ZjhfMS53cml0ZSkoc3RyLCBhcnIsIDApO1xuICAgICAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh3cml0dGVuID09PSBhcnIubGVuZ3RoKTtcbiAgICAgICAgICAgIHJldHVybiBhcnI7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGJhc2U2NEVuY29kZShidWZmZXIpIHtcbiAgICByZXR1cm4gKDAsIGJhc2U2NF8xLmVuY29kZSkoYnVmZmVyLCAwLCBidWZmZXIubGVuZ3RoKTtcbn1cbmV4cG9ydHMuYmFzZTY0RW5jb2RlID0gYmFzZTY0RW5jb2RlO1xuZnVuY3Rpb24gYmFzZTY0RGVjb2RlKHN0cikge1xuICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgaW4gYmFzZTY0dXJsIGZvcm1hdCwgY29udmVydCB0byBiYXNlNjRcbiAgICBjb25zdCBiNjQgPSBzdHIucmVwbGFjZUFsbCgnLScsICcrJykucmVwbGFjZUFsbCgnXycsICcvJyk7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoKDAsIGJhc2U2NF8xLmxlbmd0aCkoYjY0KSk7XG4gICAgY29uc3Qgd3JpdHRlbiA9ICgwLCBiYXNlNjRfMS5kZWNvZGUpKGI2NCwgYXJyLCAwKTtcbiAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHdyaXR0ZW4gPT09IGFyci5sZW5ndGgpO1xuICAgIHJldHVybiBhcnI7XG59XG5leHBvcnRzLmJhc2U2NERlY29kZSA9IGJhc2U2NERlY29kZTtcbi8vIGVuY29kZSBiaW5hcnkgYXJyYXkgdG8gaGV4IHN0cmluZ1xuZnVuY3Rpb24gaGV4RW5jb2RlKGJ5dGVzKSB7XG4gICAgcmV0dXJuIGJ5dGVzLnJlZHVjZSgocHJldiwgY3VyKSA9PiBwcmV2ICsgKCcwJyArIGN1ci50b1N0cmluZygxNikpLnNsaWNlKC0yKSwgJycpO1xufVxuZXhwb3J0cy5oZXhFbmNvZGUgPSBoZXhFbmNvZGU7XG5mdW5jdGlvbiB1dGY4RW5jb2RlKHN0cikge1xuICAgIHJldHVybiBVdGY4RW5jb2Rlci5lbmNvZGUoc3RyKTtcbn1cbmV4cG9ydHMudXRmOEVuY29kZSA9IHV0ZjhFbmNvZGU7XG4vLyBOb3RlOiBub3QgYWxsIGJ5dGUgc2VxdWVuY2VzIGNhbiBiZSBjb252ZXJ0ZWQgdG88PmZyb20gVVRGOC4gVGhpcyBjYW4gYmVcbi8vIHVzZWQgb25seSB3aXRoIHZhbGlkIHVuaWNvZGUgc3RyaW5ncywgbm90IGFyYml0cmFyeSBieXRlIGJ1ZmZlcnMuXG5mdW5jdGlvbiB1dGY4RGVjb2RlKGJ1ZmZlcikge1xuICAgIHJldHVybiBVdGY4RGVjb2Rlci5kZWNvZGUoYnVmZmVyKTtcbn1cbmV4cG9ydHMudXRmOERlY29kZSA9IHV0ZjhEZWNvZGU7XG4vLyBUaGUgYmluYXJ5RW5jb2RlL0RlY29kZSBmdW5jdGlvbnMgYmVsb3cgYWxsb3cgdG8gZW5jb2RlIGFuIGFyYml0cmFyeSBiaW5hcnlcbi8vIGJ1ZmZlciBpbnRvIGEgc3RyaW5nIHRoYXQgY2FuIGJlIEpTT04tZW5jb2RlZC4gYmluYXJ5RW5jb2RlKCkgYXBwbGllc1xuLy8gVVRGLTE2IGVuY29kaW5nIHRvIGVhY2ggYnl0ZSBpbmRpdmlkdWFsbHkuXG4vLyBVbmxpa2UgdXRmOEVuY29kZS9EZWNvZGUsIGFueSBhcmJpdHJhcnkgYnl0ZSBzZXF1ZW5jZSBjYW4gYmUgY29udmVydGVkIGludG8gYVxuLy8gdmFsaWQgc3RyaW5nLCBhbmQgdmljZXZlcnNhLlxuLy8gVGhpcyBzaG91bGQgYmUgb25seSB1c2VkIHdoZW4gYSBieXRlIGFycmF5IG5lZWRzIHRvIGJlIHRyYW5zbWl0dGVkIG92ZXIgYW5cbi8vIGludGVyZmFjZSB0aGF0IHN1cHBvcnRzIG9ubHkgSlNPTiBzZXJpYWxpemF0aW9uIChlLmcuLCBwb3N0bWVzc2FnZSB0byBhXG4vLyBjaHJvbWUgZXh0ZW5zaW9uKS5cbmZ1bmN0aW9uIGJpbmFyeUVuY29kZShidWYpIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbmV4cG9ydHMuYmluYXJ5RW5jb2RlID0gYmluYXJ5RW5jb2RlO1xuZnVuY3Rpb24gYmluYXJ5RGVjb2RlKHN0cikge1xuICAgIGNvbnN0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHN0ci5sZW5ndGgpO1xuICAgIGNvbnN0IHN0ckxlbiA9IHN0ci5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJMZW47IGkrKykge1xuICAgICAgICBidWZbaV0gPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1Zjtcbn1cbmV4cG9ydHMuYmluYXJ5RGVjb2RlID0gYmluYXJ5RGVjb2RlO1xuLy8gQSBmdW5jdGlvbiB1c2VkIHRvIGludGVycG9sYXRlIHN0cmluZ3MgaW50byBTUUwgcXVlcnkuIFRoZSBvbmx5IHJlcGxhY2VtZW50XG4vLyBpcyBkb25lIGlzIHRoYXQgc2luZ2xlIHF1b3RlIHJlcGxhY2VkIHdpdGggdHdvIHNpbmdsZSBxdW90ZXMsIGFjY29yZGluZyB0b1xuLy8gU1FMaXRlIGRvY3VtZW50YXRpb246XG4vLyBodHRwczovL3d3dy5zcWxpdGUub3JnL2xhbmdfZXhwci5odG1sI2xpdGVyYWxfdmFsdWVzX2NvbnN0YW50c19cbi8vXG4vLyBUaGUgcHVycG9zZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHRvIHVzZSBpbiBzaW1wbGUgY29tcGFyaXNvbnMsIHRvIGVzY2FwZVxuLy8gc3RyaW5ncyB1c2VkIGluIEdMT0IgY2xhdXNlcyBzZWUgZXNjYXBlUXVlcnkgZnVuY3Rpb24uXG5mdW5jdGlvbiBzcWxpdGVTdHJpbmcoc3RyKSB7XG4gICAgcmV0dXJuIGAnJHtzdHIucmVwbGFjZUFsbCgnXFwnJywgJ1xcJ1xcJycpfSdgO1xufVxuZXhwb3J0cy5zcWxpdGVTdHJpbmcgPSBzcWxpdGVTdHJpbmc7XG4vLyBDaGF0IGFwcHMgKGluY2x1ZGluZyBHIENoYXQpIHNvbWV0aW1lcyByZXBsYWNlIEFTQ0lJIGNoYXJhY3RlcnMgd2l0aCBzaW1pbGFyXG4vLyBsb29raW5nIHVuaWNvZGUgY2hhcmFjdGVycyB0aGF0IGJyZWFrIGNvZGUgc25pcHBldHMuXG4vLyBUaGlzIGZ1bmN0aW9uIGF0dGVtcHRzIHRvIHVuZG8gdGhlc2UgcmVwbGFjZW1lbnRzLlxuZnVuY3Rpb24gdW5kb0NvbW1vbkNoYXRBcHBSZXBsYWNlbWVudHMoc3RyKSB7XG4gICAgLy8gUmVwbGFjZSBub24tYnJlYWtpbmcgc3BhY2VzIHdpdGggbm9ybWFsIHNwYWNlcy5cbiAgICByZXR1cm4gc3RyLnJlcGxhY2VBbGwoJ1xcdTAwQTAnLCAnICcpO1xufVxuZXhwb3J0cy51bmRvQ29tbW9uQ2hhdEFwcFJlcGxhY2VtZW50cyA9IHVuZG9Db21tb25DaGF0QXBwUmVwbGFjZW1lbnRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFycmF5QnVmZmVyQnVpbGRlciA9IHZvaWQgMDtcbmNvbnN0IHV0ZjhfMSA9IHJlcXVpcmUoXCJAcHJvdG9idWZqcy91dGY4XCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IG9iamVjdF91dGlsc18xID0gcmVxdWlyZShcIi4uL2Jhc2Uvb2JqZWN0X3V0aWxzXCIpO1xuLy8gUmV0dXJuIHRoZSBsZW5ndGgsIGluIGJ5dGVzLCBvZiBhIHRva2VuIHRvIGJlIGluc2VydGVkLlxuZnVuY3Rpb24gdG9rZW5MZW5ndGgodG9rZW4pIHtcbiAgICBpZiAoKDAsIG9iamVjdF91dGlsc18xLmlzU3RyaW5nKSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuICgwLCB1dGY4XzEubGVuZ3RoKSh0b2tlbik7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRva2VuIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICByZXR1cm4gdG9rZW4uYnl0ZUxlbmd0aDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkodG9rZW4gPj0gMCAmJiB0b2tlbiA8PSAweGZmZmZmZmZmKTtcbiAgICAgICAgLy8gMzItYml0IGludGVnZXJzIHRha2UgNCBieXRlc1xuICAgICAgICByZXR1cm4gNDtcbiAgICB9XG59XG4vLyBJbnNlcnQgYSB0b2tlbiBpbnRvIHRoZSBidWZmZXIsIGF0IHBvc2l0aW9uIGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBAcGFyYW0gZGF0YVZpZXcgQSBEYXRhVmlldyBpbnRvIHRoZSBidWZmZXIgdG8gd3JpdGUgaW50by5cbi8vIEBwYXJhbSB0eXBlZEFycmF5IEEgVWludDhBcnJheSB2aWV3IGludG8gdGhlIGJ1ZmZlciB0byB3cml0ZSBpbnRvLlxuLy8gQHBhcmFtIGJ5dGVPZmZzZXQgUG9zaXRpb24gdG8gd3JpdGUgYXQsIGluIHRoZSBidWZmZXIuXG4vLyBAcGFyYW0gdG9rZW4gVG9rZW4gdG8gaW5zZXJ0IGludG8gdGhlIGJ1ZmZlci5cbmZ1bmN0aW9uIGluc2VydFRva2VuKGRhdGFWaWV3LCB0eXBlZEFycmF5LCBieXRlT2Zmc2V0LCB0b2tlbikge1xuICAgIGlmICgoMCwgb2JqZWN0X3V0aWxzXzEuaXNTdHJpbmcpKHRva2VuKSkge1xuICAgICAgICAvLyBFbmNvZGUgdGhlIHN0cmluZyBpbiBVVEYtOFxuICAgICAgICBjb25zdCB3cml0dGVuID0gKDAsIHV0ZjhfMS53cml0ZSkodG9rZW4sIHR5cGVkQXJyYXksIGJ5dGVPZmZzZXQpO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHdyaXR0ZW4gPT09ICgwLCB1dGY4XzEubGVuZ3RoKSh0b2tlbikpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0b2tlbiBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgICAgLy8gQ29weSB0aGUgYnl0ZXMgZnJvbSB0aGUgb3RoZXIgYXJyYXlcbiAgICAgICAgdHlwZWRBcnJheS5zZXQodG9rZW4sIGJ5dGVPZmZzZXQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh0b2tlbiA+PSAwICYmIHRva2VuIDw9IDB4ZmZmZmZmZmYpO1xuICAgICAgICAvLyAzMi1iaXQgbGl0dGxlLWVuZGlhbiB2YWx1ZVxuICAgICAgICBkYXRhVmlldy5zZXRVaW50MzIoYnl0ZU9mZnNldCwgdG9rZW4sIHRydWUpO1xuICAgIH1cbn1cbi8vIExpa2UgYSBzdHJpbmcgYnVpbGRlciwgYnV0IGZvciBhbiBBcnJheUJ1ZmZlciBpbnN0ZWFkIG9mIGEgc3RyaW5nLiBUaGlzXG4vLyBhbGxvd3MgdXMgdG8gYXNzZW1ibGUgbWVzc2FnZXMgdG8gc2VuZC9yZWNlaXZlIG92ZXIgdGhlIHdpcmUuIERhdGEgY2FuIGJlXG4vLyBhcHBlbmRlZCB0byB0aGUgYnVmZmVyIHVzaW5nIGBhcHBlbmQoKWAuIFRoZSBkYXRhIHdlIGFwcGVuZCBjYW4gYmUgb2YgdGhlXG4vLyBmb2xsb3dpbmcgdHlwZXM6XG4vL1xuLy8gLSBzdHJpbmc6IHRoZSBBU0NJSSBzdHJpbmcgaXMgYXBwZW5kZWQuIFRocm93cyBhbiBlcnJvciBpZiB0aGVyZSBhcmVcbi8vICAgICAgICAgICBub24tQVNDSUkgY2hhcmFjdGVycy5cbi8vIC0gbnVtYmVyOiB0aGUgbnVtYmVyIGlzIGFwcGVuZGVkIGFzIGEgMzItYml0IGxpdHRsZS1lbmRpYW4gaW50ZWdlci5cbi8vIC0gVWludDhBcnJheTogdGhlIGJ5dGVzIGFyZSBhcHBlbmRlZCBhcy1pcyB0byB0aGUgYnVmZmVyLlxuY2xhc3MgQXJyYXlCdWZmZXJCdWlsZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFuIGBBcnJheUJ1ZmZlcmAgdGhhdCBpcyB0aGUgY29uY2F0ZW5hdGlvbiBvZiBhbGwgdGhlIHRva2Vucy5cbiAgICB0b0FycmF5QnVmZmVyKCkge1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHNpemUgb2YgdGhlIGJ1ZmZlciB3ZSBuZWVkLlxuICAgICAgICBsZXQgYnl0ZUxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgIGJ5dGVMZW5ndGggKz0gdG9rZW5MZW5ndGgodG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFsbG9jYXRlIHRoZSBidWZmZXIuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihieXRlTGVuZ3RoKTtcbiAgICAgICAgY29uc3QgZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcbiAgICAgICAgY29uc3QgdHlwZWRBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gICAgICAgIC8vIEZpbGwgdGhlIGJ1ZmZlciB3aXRoIHRoZSB0b2tlbnMuXG4gICAgICAgIGxldCBieXRlT2Zmc2V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgaW5zZXJ0VG9rZW4oZGF0YVZpZXcsIHR5cGVkQXJyYXksIGJ5dGVPZmZzZXQsIHRva2VuKTtcbiAgICAgICAgICAgIGJ5dGVPZmZzZXQgKz0gdG9rZW5MZW5ndGgodG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkoYnl0ZU9mZnNldCA9PT0gYnl0ZUxlbmd0aCk7XG4gICAgICAgIC8vIFJldHVybiB0aGUgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgIH1cbiAgICAvLyBBZGQgb25lIG9yIG1vcmUgdG9rZW5zIHRvIHRoZSB2YWx1ZSBvZiB0aGlzIG9iamVjdC5cbiAgICBhcHBlbmQodG9rZW4pIHtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh0b2tlbik7XG4gICAgfVxufVxuZXhwb3J0cy5BcnJheUJ1ZmZlckJ1aWxkZXIgPSBBcnJheUJ1ZmZlckJ1aWxkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiQ29ubmVjdGlvbkltcGwgPSB2b2lkIDA7XG5jb25zdCBjdXN0b21fdXRpbHNfMSA9IHJlcXVpcmUoXCJjdXN0b21fdXRpbHNcIik7XG5jb25zdCBkZWZlcnJlZF8xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvZGVmZXJyZWRcIik7XG5jb25zdCBhcnJheV9idWZmZXJfYnVpbGRlcl8xID0gcmVxdWlyZShcIi4uL2FycmF5X2J1ZmZlcl9idWlsZGVyXCIpO1xuY29uc3QgYWRiX2ZpbGVfaGFuZGxlcl8xID0gcmVxdWlyZShcIi4vYWRiX2ZpbGVfaGFuZGxlclwiKTtcbmNvbnN0IHRleHREZWNvZGVyID0gbmV3IGN1c3RvbV91dGlsc18xLl9UZXh0RGVjb2RlcigpO1xuY2xhc3MgQWRiQ29ubmVjdGlvbkltcGwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyBvblN0YXR1cyBhbmQgb25EaXNjb25uZWN0IGFyZSBzZXQgdG8gY2FsbGJhY2tzIHBhc3NlZCBmcm9tIHRoZSBjYWxsZXIuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucyBmb3IgaW5zdGFuY2UgaW4gdGhlIEFuZHJvaWRXZWJ1c2JUYXJnZXQsIHdoaWNoIGluc3RhbnRpYXRlc1xuICAgICAgICAvLyB0aGVtIHdpdGggY2FsbGJhY2tzIHBhc3NlZCBmcm9tIHRoZSBVSS5cbiAgICAgICAgdGhpcy5vblN0YXR1cyA9ICgpID0+IHsgfTtcbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QgPSAoXykgPT4geyB9O1xuICAgIH1cbiAgICAvLyBTdGFydHMgYSBzaGVsbCBjb21tYW5kLCBhbmQgcmV0dXJucyBhIHByb21pc2UgcmVzb2x2ZWQgd2hlbiB0aGUgY29tbWFuZFxuICAgIC8vIGNvbXBsZXRlcy5cbiAgICBhc3luYyBzaGVsbEFuZFdhaXRDb21wbGV0aW9uKGNtZCkge1xuICAgICAgICBjb25zdCBhZGJTdHJlYW0gPSBhd2FpdCB0aGlzLnNoZWxsKGNtZCk7XG4gICAgICAgIGNvbnN0IG9uU3RyZWFtaW5nRW5kZWQgPSAoMCwgZGVmZXJyZWRfMS5kZWZlcikoKTtcbiAgICAgICAgLy8gV2Ugd2FpdCBmb3IgdGhlIHN0cmVhbSB0byBiZSBjbG9zZWQgYnkgdGhlIGRldmljZSwgd2hpY2ggaGFwcGVuc1xuICAgICAgICAvLyBhZnRlciB0aGUgc2hlbGwgY29tbWFuZCBpcyBzdWNjZXNzZnVsbHkgcmVjZWl2ZWQuXG4gICAgICAgIGFkYlN0cmVhbS5hZGRPblN0cmVhbUNsb3NlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgb25TdHJlYW1pbmdFbmRlZC5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb25TdHJlYW1pbmdFbmRlZDtcbiAgICB9XG4gICAgLy8gU3RhcnRzIGEgc2hlbGwgY29tbWFuZCwgdGhlbiBnYXRoZXJzIGFsbCBpdHMgb3V0cHV0IGFuZCByZXR1cm5zIGl0IGFzXG4gICAgLy8gYSBzdHJpbmcuXG4gICAgYXN5bmMgc2hlbGxBbmRHZXRPdXRwdXQoY21kKSB7XG4gICAgICAgIGNvbnN0IGFkYlN0cmVhbSA9IGF3YWl0IHRoaXMuc2hlbGwoY21kKTtcbiAgICAgICAgY29uc3QgY29tbWFuZE91dHB1dCA9IG5ldyBhcnJheV9idWZmZXJfYnVpbGRlcl8xLkFycmF5QnVmZmVyQnVpbGRlcigpO1xuICAgICAgICBjb25zdCBvblN0cmVhbWluZ0VuZGVkID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIGFkYlN0cmVhbS5hZGRPblN0cmVhbURhdGFDYWxsYmFjaygoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29tbWFuZE91dHB1dC5hcHBlbmQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhZGJTdHJlYW0uYWRkT25TdHJlYW1DbG9zZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICAgIG9uU3RyZWFtaW5nRW5kZWQucmVzb2x2ZSh0ZXh0RGVjb2Rlci5kZWNvZGUoY29tbWFuZE91dHB1dC50b0FycmF5QnVmZmVyKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvblN0cmVhbWluZ0VuZGVkO1xuICAgIH1cbiAgICBhc3luYyBwdXNoKGJpbmFyeSwgcGF0aCkge1xuICAgICAgICBjb25zdCBieXRlU3RyZWFtID0gYXdhaXQgdGhpcy5vcGVuU3RyZWFtKCdzeW5jOicpO1xuICAgICAgICBhd2FpdCAobmV3IGFkYl9maWxlX2hhbmRsZXJfMS5BZGJGaWxlSGFuZGxlcihieXRlU3RyZWFtKSkucHVzaEJpbmFyeShiaW5hcnksIHBhdGgpO1xuICAgICAgICAvLyBXZSBuZWVkIHRvIHdhaXQgdW50aWwgdGhlIGJ5dGVzdHJlYW0gaXMgY2xvc2VkLiBPdGhlcndpc2UsIHdlIGNhbiBoYXZlIGFcbiAgICAgICAgLy8gcmFjZSBjb25kaXRpb246XG4gICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGxhc3Qgc3RyZWFtLCBpdCB3aWxsIHRyeSB0byBkaXNjb25uZWN0IHRoZSBkZXZpY2UuIEluIHRoZVxuICAgICAgICAvLyBtZWFudGltZSwgdGhlIGNhbGxlciBtaWdodCBjcmVhdGUgYW5vdGhlciBzdHJlYW0gd2hpY2ggd2lsbCB0cnkgdG8gb3BlblxuICAgICAgICAvLyB0aGUgZGV2aWNlLlxuICAgICAgICBhd2FpdCBieXRlU3RyZWFtLmNsb3NlQW5kV2FpdEZvclRlYXJkb3duKCk7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJDb25uZWN0aW9uSW1wbCA9IEFkYkNvbm5lY3Rpb25JbXBsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYk92ZXJXZWJ1c2JTdHJlYW0gPSBleHBvcnRzLkFkYkNvbm5lY3Rpb25PdmVyV2VidXNiID0gZXhwb3J0cy5BZGJTdGF0ZSA9IGV4cG9ydHMuREVGQVVMVF9NQVhfUEFZTE9BRF9CWVRFUyA9IGV4cG9ydHMuVkVSU0lPTl9OT19DSEVDS1NVTSA9IGV4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNID0gdm9pZCAwO1xuY29uc3QgY3VzdG9tX3V0aWxzXzEgPSByZXF1aXJlKFwiY3VzdG9tX3V0aWxzXCIpO1xuY29uc3QgZGVmZXJyZWRfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2RlZmVycmVkXCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IG9iamVjdF91dGlsc18xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2Uvb2JqZWN0X3V0aWxzXCIpO1xuY29uc3QgYWRiX2Nvbm5lY3Rpb25faW1wbF8xID0gcmVxdWlyZShcIi4vYWRiX2Nvbm5lY3Rpb25faW1wbFwiKTtcbmNvbnN0IGFkYl9rZXlfbWFuYWdlcl8xID0gcmVxdWlyZShcIi4vYXV0aC9hZGJfa2V5X21hbmFnZXJcIik7XG5jb25zdCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMSA9IHJlcXVpcmUoXCIuL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZ1wiKTtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX3V0aWxzXCIpO1xuY29uc3QgdGV4dEVuY29kZXIgPSBuZXcgY3VzdG9tX3V0aWxzXzEuX1RleHRFbmNvZGVyKCk7XG5jb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBjdXN0b21fdXRpbHNfMS5fVGV4dERlY29kZXIoKTtcbmV4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNID0gMHgwMTAwMDAwMDtcbmV4cG9ydHMuVkVSU0lPTl9OT19DSEVDS1NVTSA9IDB4MDEwMDAwMDE7XG5leHBvcnRzLkRFRkFVTFRfTUFYX1BBWUxPQURfQllURVMgPSAyNTYgKiAxMDI0O1xudmFyIEFkYlN0YXRlO1xuKGZ1bmN0aW9uIChBZGJTdGF0ZSkge1xuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiRElTQ09OTkVDVEVEXCJdID0gMF0gPSBcIkRJU0NPTk5FQ1RFRFwiO1xuICAgIC8vIEF1dGhlbnRpY2F0aW9uIHN0ZXBzLCBzZWUgQWRiQ29ubmVjdGlvbk92ZXJXZWJVc2IncyBoYW5kbGVBdXRoZW50aWNhdGlvbigpLlxuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiQVVUSF9TVEFSVEVEXCJdID0gMV0gPSBcIkFVVEhfU1RBUlRFRFwiO1xuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiQVVUSF9XSVRIX1BSSVZBVEVcIl0gPSAyXSA9IFwiQVVUSF9XSVRIX1BSSVZBVEVcIjtcbiAgICBBZGJTdGF0ZVtBZGJTdGF0ZVtcIkFVVEhfV0lUSF9QVUJMSUNcIl0gPSAzXSA9IFwiQVVUSF9XSVRIX1BVQkxJQ1wiO1xuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiQ09OTkVDVEVEXCJdID0gNF0gPSBcIkNPTk5FQ1RFRFwiO1xufSkoQWRiU3RhdGUgfHwgKGV4cG9ydHMuQWRiU3RhdGUgPSBBZGJTdGF0ZSA9IHt9KSk7XG52YXIgQXV0aENtZDtcbihmdW5jdGlvbiAoQXV0aENtZCkge1xuICAgIEF1dGhDbWRbQXV0aENtZFtcIlRPS0VOXCJdID0gMV0gPSBcIlRPS0VOXCI7XG4gICAgQXV0aENtZFtBdXRoQ21kW1wiU0lHTkFUVVJFXCJdID0gMl0gPSBcIlNJR05BVFVSRVwiO1xuICAgIEF1dGhDbWRbQXV0aENtZFtcIlJTQVBVQkxJQ0tFWVwiXSA9IDNdID0gXCJSU0FQVUJMSUNLRVlcIjtcbn0pKEF1dGhDbWQgfHwgKEF1dGhDbWQgPSB7fSkpO1xuZnVuY3Rpb24gZ2VuZXJhdGVDaGVja3N1bShkYXRhKSB7XG4gICAgbGV0IHJlcyA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmJ5dGVMZW5ndGg7IGkrKylcbiAgICAgICAgcmVzICs9IGRhdGFbaV07XG4gICAgcmV0dXJuIHJlcyAmIDB4RkZGRkZGRkY7XG59XG5jbGFzcyBBZGJDb25uZWN0aW9uT3ZlcldlYnVzYiBleHRlbmRzIGFkYl9jb25uZWN0aW9uX2ltcGxfMS5BZGJDb25uZWN0aW9uSW1wbCB7XG4gICAgLy8gV2UgdXNlIGEga2V5IHBhaXIgZm9yIGF1dGhlbnRpY2F0aW5nIHdpdGggdGhlIGRldmljZSwgd2hpY2ggd2UgZG8gaW5cbiAgICAvLyB0d28gd2F5czpcbiAgICAvLyAtIEZpcnN0bHksIHNpZ25pbmcgd2l0aCB0aGUgcHJpdmF0ZSBrZXkuXG4gICAgLy8gLSBTZWNvbmRseSwgc2VuZGluZyBvdmVyIHRoZSBwdWJsaWMga2V5IChhdCB3aGljaCBwb2ludCB0aGUgZGV2aWNlIGFza3MgdGhlXG4gICAgLy8gICB1c2VyIGZvciBwZXJtaXNzaW9ucykuXG4gICAgLy8gT25jZSB3ZSd2ZSBzZW50IHRoZSBwdWJsaWMga2V5LCBmb3IgZnV0dXJlIHJlY29yZGluZ3Mgd2Ugb25seSBuZWVkIHRvXG4gICAgLy8gc2lnbiB3aXRoIHRoZSBwcml2YXRlIGtleSwgc28gdGhlIHVzZXIgZG9lc24ndCBuZWVkIHRvIGdpdmUgcGVybWlzc2lvbnNcbiAgICAvLyBhZ2Fpbi5cbiAgICBjb25zdHJ1Y3RvcihkZXZpY2UsIGtleU1hbmFnZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBkZXZpY2U7XG4gICAgICAgIHRoaXMua2V5TWFuYWdlciA9IGtleU1hbmFnZXI7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5ESVNDT05ORUNURUQ7XG4gICAgICAgIHRoaXMuY29ubmVjdGluZ1N0cmVhbXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc3RyZWFtcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5tYXhQYXlsb2FkID0gZXhwb3J0cy5ERUZBVUxUX01BWF9QQVlMT0FEX0JZVEVTO1xuICAgICAgICB0aGlzLndyaXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLndyaXRlUXVldWUgPSBbXTtcbiAgICAgICAgLy8gRGV2aWNlcyBhZnRlciBEZWMgMjAxNyBkb24ndCB1c2UgY2hlY2tzdW0uIFRoaXMgd2lsbCBiZSBhdXRvLWRldGVjdGVkXG4gICAgICAgIC8vIGR1cmluZyB0aGUgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy51c2VDaGVja3N1bSA9IHRydWU7XG4gICAgICAgIHRoaXMubGFzdFN0cmVhbUlkID0gMDtcbiAgICAgICAgdGhpcy51c2JSZWFkRW5kcG9pbnQgPSAtMTtcbiAgICAgICAgdGhpcy51c2JXcml0ZUVwRW5kcG9pbnQgPSAtMTtcbiAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBlbmRpbmdDb25uUHJvbWlzZXMgPSBbXTtcbiAgICB9XG4gICAgc2hlbGwoY21kKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5TdHJlYW0oJ3NoZWxsOicgKyBjbWQpO1xuICAgIH1cbiAgICBjb25uZWN0U29ja2V0KHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlblN0cmVhbShwYXRoKTtcbiAgICB9XG4gICAgYXN5bmMgY2FuQ29ubmVjdFdpdGhvdXRDb250ZW50aW9uKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5vcGVuKCk7XG4gICAgICAgIGNvbnN0IHVzYkludGVyZmFjZU51bWJlciA9IGF3YWl0IHRoaXMuc2V0dXBVc2JJbnRlcmZhY2UoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLmNsYWltSW50ZXJmYWNlKHVzYkludGVyZmFjZU51bWJlcik7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5yZWxlYXNlSW50ZXJmYWNlKHVzYkludGVyZmFjZU51bWJlcik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIG9wZW5TdHJlYW0oZGVzdGluYXRpb24pIHtcbiAgICAgICAgY29uc3Qgc3RyZWFtSWQgPSArK3RoaXMubGFzdFN0cmVhbUlkO1xuICAgICAgICBjb25zdCBjb25uZWN0aW5nU3RyZWFtID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuc2V0KHN0cmVhbUlkLCBjb25uZWN0aW5nU3RyZWFtKTtcbiAgICAgICAgLy8gV2UgY3JlYXRlIHRoZSBzdHJlYW0gYmVmb3JlIHRyeWluZyB0byBlc3RhYmxpc2ggdGhlIGNvbm5lY3Rpb24sIHNvXG4gICAgICAgIC8vIHRoYXQgaWYgd2UgZmFpbCB0byBjb25uZWN0LCB3ZSB3aWxsIHJlamVjdCB0aGUgY29ubmVjdGluZyBzdHJlYW0uXG4gICAgICAgIGF3YWl0IHRoaXMuZW5zdXJlQ29ubmVjdGlvbkVzdGFibGlzaGVkKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ09QRU4nLCBzdHJlYW1JZCwgMCwgZGVzdGluYXRpb24pO1xuICAgICAgICByZXR1cm4gY29ubmVjdGluZ1N0cmVhbTtcbiAgICB9XG4gICAgYXN5bmMgZW5zdXJlQ29ubmVjdGlvbkVzdGFibGlzaGVkKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuQ09OTkVDVEVEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2Uub3BlbigpO1xuICAgICAgICAgICAgaWYgKCEoYXdhaXQgdGhpcy5jYW5Db25uZWN0V2l0aG91dENvbnRlbnRpb24oKSkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5yZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdXNiSW50ZXJmYWNlTnVtYmVyID0gYXdhaXQgdGhpcy5zZXR1cFVzYkludGVyZmFjZSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2UuY2xhaW1JbnRlcmZhY2UodXNiSW50ZXJmYWNlTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLnN0YXJ0QWRiQXV0aCgpO1xuICAgICAgICBpZiAoIXRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHRoaXMudXNiUmVjZWl2ZUxvb3AoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb25uUHJvbWlzZSA9ICgwLCBkZWZlcnJlZF8xLmRlZmVyKSgpO1xuICAgICAgICB0aGlzLnBlbmRpbmdDb25uUHJvbWlzZXMucHVzaChjb25uUHJvbWlzZSk7XG4gICAgICAgIGF3YWl0IGNvbm5Qcm9taXNlO1xuICAgIH1cbiAgICBhc3luYyBzZXR1cFVzYkludGVyZmFjZSgpIHtcbiAgICAgICAgY29uc3QgaW50ZXJmYWNlQW5kRW5kcG9pbnQgPSAoMCwgcmVjb3JkaW5nX3V0aWxzXzEuZmluZEludGVyZmFjZUFuZEVuZHBvaW50KSh0aGlzLmRldmljZSk7XG4gICAgICAgIC8vIGBmaW5kSW50ZXJmYWNlQW5kRW5kcG9pbnRgIHdpbGwgYWx3YXlzIHJldHVybiBhIG5vbi1udWxsIHZhbHVlIGJlY2F1c2VcbiAgICAgICAgLy8gd2UgY2hlY2sgZm9yIHRoaXMgaW4gJ2FuZHJvaWRfd2VidXNiX3RhcmdldF9mYWN0b3J5Jy4gSWYgbm8gaW50ZXJmYWNlIGFuZFxuICAgICAgICAvLyBlbmRwb2ludHMgYXJlIGZvdW5kLCB3ZSBkbyBub3QgY3JlYXRlIGEgdGFyZ2V0LCBzbyB3ZSBjYW4gbm90IGNvbm5lY3QgdG9cbiAgICAgICAgLy8gaXQsIHNvIHdlIHdpbGwgbmV2ZXIgcmVhY2ggdGhpcyBsb2dpYy5cbiAgICAgICAgY29uc3QgeyBjb25maWd1cmF0aW9uVmFsdWUsIHVzYkludGVyZmFjZU51bWJlciwgZW5kcG9pbnRzIH0gPSAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoaW50ZXJmYWNlQW5kRW5kcG9pbnQpO1xuICAgICAgICB0aGlzLnVzYkludGVyZmFjZU51bWJlciA9IHVzYkludGVyZmFjZU51bWJlcjtcbiAgICAgICAgdGhpcy51c2JSZWFkRW5kcG9pbnQgPSB0aGlzLmZpbmRFbmRwb2ludE51bWJlcihlbmRwb2ludHMsICdpbicpO1xuICAgICAgICB0aGlzLnVzYldyaXRlRXBFbmRwb2ludCA9IHRoaXMuZmluZEVuZHBvaW50TnVtYmVyKGVuZHBvaW50cywgJ291dCcpO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHRoaXMudXNiUmVhZEVuZHBvaW50ID49IDAgJiYgdGhpcy51c2JXcml0ZUVwRW5kcG9pbnQgPj0gMCk7XG4gICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLnNlbGVjdENvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvblZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHVzYkludGVyZmFjZU51bWJlcjtcbiAgICB9XG4gICAgYXN5bmMgc3RyZWFtQ2xvc2Uoc3RyZWFtKSB7XG4gICAgICAgIGNvbnN0IG90aGVyU3RyZWFtc1F1ZXVlID0gdGhpcy53cml0ZVF1ZXVlLmZpbHRlcigocXVldWVFbGVtZW50KSA9PiBxdWV1ZUVsZW1lbnQubG9jYWxTdHJlYW1JZCAhPT0gc3RyZWFtLmxvY2FsU3RyZWFtSWQpO1xuICAgICAgICBjb25zdCBkcm9wcGVkUGFja2V0Q291bnQgPSB0aGlzLndyaXRlUXVldWUubGVuZ3RoIC0gb3RoZXJTdHJlYW1zUXVldWUubGVuZ3RoO1xuICAgICAgICBpZiAoZHJvcHBlZFBhY2tldENvdW50ID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgRHJvcHBpbmcgJHtkcm9wcGVkUGFja2V0Q291bnR9IHF1ZXVlZCBtZXNzYWdlcyBkdWUgdG8gc3RyZWFtIGNsb3NpbmcuYCk7XG4gICAgICAgICAgICB0aGlzLndyaXRlUXVldWUgPSBvdGhlclN0cmVhbXNRdWV1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbXMuZGVsZXRlKHN0cmVhbSk7XG4gICAgICAgIGlmICh0aGlzLnN0cmVhbXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgZGlzY29ubmVjdCBCRUZPUkUgY2FsbGluZyBgc2lnbmFsU3RyZWFtQ2xvc2VkYC4gT3RoZXJ3aXNlLCB0aGVyZSBjYW5cbiAgICAgICAgICAgIC8vIGJlIGEgcmFjZSBjb25kaXRpb246XG4gICAgICAgICAgICAvLyBTdHJlYW0gQTogc3RyZWFtQS5vblN0cmVhbUNsb3NlXG4gICAgICAgICAgICAvLyBTdHJlYW0gQjogZGV2aWNlLm9wZW5cbiAgICAgICAgICAgIC8vIFN0cmVhbSBBOiBkZXZpY2UucmVsZWFzZUludGVyZmFjZVxuICAgICAgICAgICAgLy8gU3RyZWFtIEI6IGRldmljZS50cmFuc2Zlck91dCAtPiBDUkFTSFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgc3RyZWFtLnNpZ25hbFN0cmVhbUNsb3NlZCgpO1xuICAgIH1cbiAgICBzdHJlYW1Xcml0ZShtc2csIHN0cmVhbSkge1xuICAgICAgICBjb25zdCByYXcgPSAoKDAsIG9iamVjdF91dGlsc18xLmlzU3RyaW5nKShtc2cpKSA/IHRleHRFbmNvZGVyLmVuY29kZShtc2cpIDogbXNnO1xuICAgICAgICBpZiAodGhpcy53cml0ZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHRoaXMud3JpdGVRdWV1ZS5wdXNoKHsgbWVzc2FnZTogcmF3LCBsb2NhbFN0cmVhbUlkOiBzdHJlYW0ubG9jYWxTdHJlYW1JZCB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndyaXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoJ1dSVEUnLCBzdHJlYW0ubG9jYWxTdHJlYW1JZCwgc3RyZWFtLnJlbW90ZVN0cmVhbUlkLCByYXcpO1xuICAgIH1cbiAgICAvLyBXZSBkaXNjb25uZWN0IGluIDIgY2FzZXM6XG4gICAgLy8gMS4gV2hlbiB3ZSBjbG9zZSB0aGUgbGFzdCBzdHJlYW0gb2YgdGhlIGNvbm5lY3Rpb24uIFRoaXMgaXMgdG8gcHJldmVudCB0aGVcbiAgICAvLyBicm93c2VyIGhvbGRpbmcgb250byB0aGUgVVNCIGludGVyZmFjZSBhZnRlciBoYXZpbmcgZmluaXNoZWQgYSB0cmFjZVxuICAgIC8vIHJlY29yZGluZywgd2hpY2ggd291bGQgbWFrZSBpdCBpbXBvc3NpYmxlIHRvIHVzZSBcImFkYiBzaGVsbFwiIGZyb20gdGhlIHNhbWVcbiAgICAvLyBtYWNoaW5lIHVudGlsIHRoZSBicm93c2VyIGlzIGNsb3NlZC5cbiAgICAvLyAyLiBXaGVuIHdlIGdldCBhIFVTQiBkaXNjb25uZWN0IGV2ZW50LiBUaGlzIGhhcHBlbnMgZm9yIGluc3RhbmNlIHdoZW4gdGhlXG4gICAgLy8gZGV2aWNlIGlzIHVucGx1Z2dlZC5cbiAgICBhc3luYyBkaXNjb25uZWN0KGRpc2Nvbm5lY3RNZXNzYWdlKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5ESVNDT05ORUNURUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDbGVhciB0aGUgcmVzb3VyY2VzIGluIGEgc3luY2hyb25vdXMgbWV0aG9kLCBiZWNhdXNlIHRoaXMgY2FuIGJlIHVzZWRcbiAgICAgICAgLy8gZm9yIGVycm9yIGhhbmRsaW5nIGNhbGxiYWNrcyBhcyB3ZWxsLlxuICAgICAgICB0aGlzLnJlYWNoRGlzY29ubmVjdFN0YXRlKGRpc2Nvbm5lY3RNZXNzYWdlKTtcbiAgICAgICAgLy8gV2UgaGF2ZSBhbHJlYWR5IGRpc2Nvbm5lY3RlZCBzbyB0aGVyZSBpcyBubyBuZWVkIHRvIHBhc3MgYSBjYWxsYmFja1xuICAgICAgICAvLyB3aGljaCBjbGVhcnMgcmVzb3VyY2VzIG9yIG5vdGlmaWVzIHRoZSB1c2VyIGludG8gJ3dyYXBSZWNvcmRpbmdFcnJvcicuXG4gICAgICAgIGF3YWl0ICgwLCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS53cmFwUmVjb3JkaW5nRXJyb3IpKHRoaXMuZGV2aWNlLnJlbGVhc2VJbnRlcmZhY2UoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMudXNiSW50ZXJmYWNlTnVtYmVyKSksICgpID0+IHsgfSk7XG4gICAgICAgIHRoaXMudXNiSW50ZXJmYWNlTnVtYmVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBUaGlzIGlzIGEgc3luY2hyb25vdXMgbWV0aG9kIHdoaWNoIGNsZWFycyBhbGwgcmVzb3VyY2VzLlxuICAgIC8vIEl0IGNhbiBiZSB1c2VkIGFzIGEgY2FsbGJhY2sgZm9yIGVycm9yIGhhbmRsaW5nLlxuICAgIHJlYWNoRGlzY29ubmVjdFN0YXRlKGRpc2Nvbm5lY3RNZXNzYWdlKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVsZXRlIHRoZSBzdHJlYW1zIEJFRk9SRSBjaGVja2luZyB0aGUgQWRiIHN0YXRlIGJlY2F1c2U6XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIGNyZWF0ZSBzdHJlYW1zIGJlZm9yZSBjaGFuZ2luZyB0aGUgQWRiIHN0YXRlIGZyb20gRElTQ09OTkVDVEVELlxuICAgICAgICAvLyBJbiBjYXNlIHdlIGNhbiBub3QgY2xhaW0gdGhlIGRldmljZSwgd2Ugd2lsbCBjcmVhdGUgYSBzdHJlYW0sIGJ1dCBmYWlsXG4gICAgICAgIC8vIHRvIGNvbm5lY3QgdG8gdGhlIFdlYlVTQiBkZXZpY2Ugc28gdGhlIHN0YXRlIHdpbGwgcmVtYWluIERJU0NPTk5FQ1RFRC5cbiAgICAgICAgY29uc3Qgc3RyZWFtc1RvRGVsZXRlID0gdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5lbnRyaWVzKCk7XG4gICAgICAgIC8vIENsZWFyIHRoZSBzdHJlYW1zIGJlZm9yZSByZWplY3Rpbmcgc28gd2UgYXJlIG5vdCBjYXVnaHQgaW4gYSBsb29wIG9mXG4gICAgICAgIC8vIGhhbmRsaW5nIHByb21pc2UgcmVqZWN0aW9ucy5cbiAgICAgICAgdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5jbGVhcigpO1xuICAgICAgICBmb3IgKGNvbnN0IFtpZCwgc3RyZWFtXSBvZiBzdHJlYW1zVG9EZWxldGUpIHtcbiAgICAgICAgICAgIHN0cmVhbS5yZWplY3QoYEZhaWxlZCB0byBvcGVuIHN0cmVhbSB3aXRoIGlkICR7aWR9IGJlY2F1c2UgYWRiIHdhcyBkaXNjb25uZWN0ZWQuYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5ESVNDT05ORUNURUQ7XG4gICAgICAgIHRoaXMud3JpdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoaXMud3JpdGVRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLnN0cmVhbXMuZm9yRWFjaCgoc3RyZWFtKSA9PiBzdHJlYW0uY2xvc2UoKSk7XG4gICAgICAgIHRoaXMub25EaXNjb25uZWN0KGRpc2Nvbm5lY3RNZXNzYWdlKTtcbiAgICB9XG4gICAgYXN5bmMgc3RhcnRBZGJBdXRoKCkge1xuICAgICAgICBjb25zdCBWRVJTSU9OID0gdGhpcy51c2VDaGVja3N1bSA/IGV4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNIDogZXhwb3J0cy5WRVJTSU9OX05PX0NIRUNLU1VNO1xuICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuQVVUSF9TVEFSVEVEO1xuICAgICAgICBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKCdDTlhOJywgVkVSU0lPTiwgdGhpcy5tYXhQYXlsb2FkLCAnaG9zdDoxOlVzYkFEQicpO1xuICAgIH1cbiAgICBmaW5kRW5kcG9pbnROdW1iZXIoZW5kcG9pbnRzLCBkaXJlY3Rpb24sIHR5cGUgPSAnYnVsaycpIHtcbiAgICAgICAgY29uc3QgZXAgPSBlbmRwb2ludHMuZmluZCgoZXApID0+IGVwLnR5cGUgPT09IHR5cGUgJiYgZXAuZGlyZWN0aW9uID09PSBkaXJlY3Rpb24pO1xuICAgICAgICBpZiAoZXApXG4gICAgICAgICAgICByZXR1cm4gZXAuZW5kcG9pbnROdW1iZXI7XG4gICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihgQ2Fubm90IGZpbmQgJHtkaXJlY3Rpb259IGVuZHBvaW50YCk7XG4gICAgfVxuICAgIGFzeW5jIHVzYlJlY2VpdmVMb29wKCkge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydEZhbHNlKSh0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nKTtcbiAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IHRydWU7XG4gICAgICAgIGZvciAoOyB0aGlzLnN0YXRlICE9PSBBZGJTdGF0ZS5ESVNDT05ORUNURUQ7KSB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLndyYXBVc2IodGhpcy5kZXZpY2UudHJhbnNmZXJJbih0aGlzLnVzYlJlYWRFbmRwb2ludCwgQURCX01TR19TSVpFKSk7XG4gICAgICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAhPT0gJ29rJykge1xuICAgICAgICAgICAgICAgIC8vIExvZyBhbmQgaWdub3JlIG1lc3NhZ2VzIHdpdGggaW52YWxpZCBzdGF0dXMuIFRoZXNlIGNhbiBvY2N1clxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGRldmljZSBpcyBjb25uZWN0ZWQvZGlzY29ubmVjdGVkIHJlcGVhdGVkbHkuXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgUmVjZWl2ZWQgbWVzc2FnZSB3aXRoIHVuZXhwZWN0ZWQgc3RhdHVzICcke3Jlcy5zdGF0dXN9J2ApO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbXNnID0gQWRiTXNnLmRlY29kZUhlYWRlcihyZXMuZGF0YSk7XG4gICAgICAgICAgICBpZiAobXNnLmRhdGFMZW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMud3JhcFVzYih0aGlzLmRldmljZS50cmFuc2ZlckluKHRoaXMudXNiUmVhZEVuZHBvaW50LCBtc2cuZGF0YUxlbikpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzcCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbXNnLmRhdGEgPSBuZXcgVWludDhBcnJheShyZXNwLmRhdGEuYnVmZmVyLCByZXNwLmRhdGEuYnl0ZU9mZnNldCwgcmVzcC5kYXRhLmJ5dGVMZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMudXNlQ2hlY2tzdW0gJiYgZ2VuZXJhdGVDaGVja3N1bShtc2cuZGF0YSkgIT09IG1zZy5kYXRhQ2hlY2tzdW0pIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBpZ25vcmUgbWVzc2FnZXMgd2l0aCBhbiBpbnZhbGlkIGNoZWNrc3VtLiBUaGVzZSBzb21ldGltZXMgYXBwZWFyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgcGFnZSBpcyByZS1sb2FkZWQgaW4gYSBtaWRkbGUgb2YgYSByZWNvcmRpbmcuXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGUgc2VydmVyIGNhbiBzdGlsbCBzZW5kIG1lc3NhZ2VzIHN0cmVhbXMgZm9yIHByZXZpb3VzIHN0cmVhbXMuXG4gICAgICAgICAgICAvLyBUaGlzIGhhcHBlbnMgZm9yIGluc3RhbmNlIGlmIHdlIHJlY29yZCwgcmVsb2FkIHRoZSByZWNvcmRpbmcgcGFnZSBhbmRcbiAgICAgICAgICAgIC8vIHRoZW4gcmVjb3JkIGFnYWluLiBXZSBjYW4gYWxzbyByZWNlaXZlIGEgJ1dSVEUnIG9yICdPS0FZJyBhZnRlclxuICAgICAgICAgICAgLy8gd2UgaGF2ZSBzZW50IGEgJ0NMU0UnIGFuZCBtYXJrZWQgdGhlIHN0YXRlIGFzIGRpc2Nvbm5lY3RlZC5cbiAgICAgICAgICAgIGlmICgobXNnLmNtZCA9PT0gJ0NMU0UnIHx8IG1zZy5jbWQgPT09ICdXUlRFJykgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5nZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKG1zZy5hcmcxKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ09LQVknICYmICF0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmhhcyhtc2cuYXJnMSkgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5nZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKG1zZy5hcmcxKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ0FVVEgnICYmIG1zZy5hcmcwID09PSBBdXRoQ21kLlRPS0VOICYmXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuQVVUSF9XSVRIX1BVQkxJQykge1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIHN0YXJ0IGEgcmVjb3JkaW5nIGJ1dCBmYWlsIGJlY2F1c2Ugb2YgYSBmYXVsdHkgcGh5c2ljYWxcbiAgICAgICAgICAgICAgICAvLyBjb25uZWN0aW9uIHRvIHRoZSBkZXZpY2UsIHdoZW4gd2Ugc3RhcnQgYSBuZXcgcmVjb3JkaW5nLCB3ZSB3aWxsXG4gICAgICAgICAgICAgICAgLy8gcmVjZWl2ZWQgbXVsdGlwbGUgQVVUSCB0b2tlbnMsIG9mIHdoaWNoIHdlIHNob3VsZCBpZ25vcmUgYWxsIGJ1dFxuICAgICAgICAgICAgICAgIC8vIG9uZS5cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgQURCIG1lc3NhZ2UgZnJvbSB0aGUgZGV2aWNlXG4gICAgICAgICAgICBpZiAobXNnLmNtZCA9PT0gJ0NMU0UnKSB7XG4gICAgICAgICAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChtc2cuYXJnMSkpLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnQVVUSCcgJiYgbXNnLmFyZzAgPT09IEF1dGhDbWQuVE9LRU4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBhd2FpdCB0aGlzLmtleU1hbmFnZXIuZ2V0S2V5KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkFVVEhfU1RBUlRFRCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEdXJpbmcgdGhpcyBzdGVwLCB3ZSBzZW5kIGJhY2sgdGhlIHRva2VuIHJlY2VpdmVkIHNpZ25lZCB3aXRoIG91clxuICAgICAgICAgICAgICAgICAgICAvLyBwcml2YXRlIGtleS4gSWYgdGhlIGRldmljZSBoYXMgcHJldmlvdXNseSByZWNlaXZlZCBvdXIgcHVibGljIGtleSxcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGRpYWxvZyBhc2tpbmcgZm9yIHVzZXIgY29uZmlybWF0aW9uIHdpbGwgbm90IGJlIGRpc3BsYXllZCBvblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZGV2aWNlLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuQVVUSF9XSVRIX1BSSVZBVEU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ0FVVEgnLCBBdXRoQ21kLlNJR05BVFVSRSwgMCwga2V5LnNpZ24obXNnLmRhdGEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIG91ciBzaWduYXR1cmUgd2l0aCB0aGUgcHJpdmF0ZSBrZXkgaXMgbm90IGFjY2VwdGVkIGJ5IHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyBkZXZpY2UsIHdlIGdlbmVyYXRlIGEgbmV3IGtleXBhaXIgYW5kIHNlbmQgdGhlIHB1YmxpYyBrZXkuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5BVVRIX1dJVEhfUFVCTElDO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKCdBVVRIJywgQXV0aENtZC5SU0FQVUJMSUNLRVksIDAsIGtleS5nZXRQdWJsaWNLZXkoKSArICdcXDAnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0YXR1cyhyZWNvcmRpbmdfdXRpbHNfMS5BTExPV19VU0JfREVCVUdHSU5HKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgKDAsIGFkYl9rZXlfbWFuYWdlcl8xLm1heWJlU3RvcmVLZXkpKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ0NOWE4nKSB7XG4gICAgICAgICAgICAgICAgLy9hc3NlcnRUcnVlKFxuICAgICAgICAgICAgICAgIC8vICAgIFtBZGJTdGF0ZS5BVVRIX1dJVEhfUFJJVkFURSwgQWRiU3RhdGUuQVVUSF9XSVRIX1BVQkxJQ10uaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIHRoaXMuc3RhdGUpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuQ09OTkVDVEVEO1xuICAgICAgICAgICAgICAgIHRoaXMubWF4UGF5bG9hZCA9IG1zZy5hcmcxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRldmljZVZlcnNpb24gPSBtc2cuYXJnMDtcbiAgICAgICAgICAgICAgICBpZiAoIVtleHBvcnRzLlZFUlNJT05fV0lUSF9DSEVDS1NVTSwgZXhwb3J0cy5WRVJTSU9OX05PX0NIRUNLU1VNXS5pbmNsdWRlcyhkZXZpY2VWZXJzaW9uKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoYFZlcnNpb24gJHttc2cuYXJnMH0gbm90IHN1cHBvcnRlZC5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy51c2VDaGVja3N1bSA9IGRldmljZVZlcnNpb24gPT09IGV4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5DT05ORUNURUQ7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIHJlc29sdmUgdGhlIHByb21pc2VzIGF3YWl0ZWQgYnlcbiAgICAgICAgICAgICAgICAvLyBcImVuc3VyZUNvbm5lY3Rpb25Fc3RhYmxpc2hlZFwiLlxuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0Nvbm5Qcm9taXNlcy5mb3JFYWNoKChjb25uUHJvbWlzZSkgPT4gY29ublByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdDb25uUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdPS0FZJykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmhhcyhtc2cuYXJnMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29ubmVjdGluZ1N0cmVhbSA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmdldChtc2cuYXJnMSkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJlYW0gPSBuZXcgQWRiT3ZlcldlYnVzYlN0cmVhbSh0aGlzLCBtc2cuYXJnMSwgbXNnLmFyZzApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbXMuYWRkKHN0cmVhbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuZGVsZXRlKG1zZy5hcmcxKTtcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdGluZ1N0cmVhbS5yZXNvbHZlKHN0cmVhbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHRoaXMud3JpdGVJblByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cml0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IHRoaXMud3JpdGVRdWV1ZS5sZW5ndGg7KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBnbyB0aHJvdWdoIHRoZSBxdWV1ZWQgd3JpdGVzIGFuZCBjaG9vc2UgdGhlIGZpcnN0IG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29ycmVzcG9uZGluZyB0byBhIHN0cmVhbSB0aGF0J3Mgc3RpbGwgYWN0aXZlLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcXVldWVkRWxlbWVudCA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLndyaXRlUXVldWUuc2hpZnQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWV1ZWRTdHJlYW0gPSB0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQocXVldWVkRWxlbWVudC5sb2NhbFN0cmVhbUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZWRTdHJlYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZWRTdHJlYW0ud3JpdGUocXVldWVkRWxlbWVudC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdXUlRFJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmVhbSA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobXNnLmFyZzEpKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKCdPS0FZJywgc3RyZWFtLmxvY2FsU3RyZWFtSWQsIHN0cmVhbS5yZW1vdGVTdHJlYW1JZCk7XG4gICAgICAgICAgICAgICAgc3RyZWFtLnNpZ25hbFN0cmVhbURhdGEobXNnLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihgVW5leHBlY3RlZCBtZXNzYWdlICR7bXNnfSBpbiBzdGF0ZSAke3RoaXMuc3RhdGV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBnZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKGxvY2FsU3RyZWFtSWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBzdHJlYW0gb2YgdGhpcy5zdHJlYW1zKSB7XG4gICAgICAgICAgICBpZiAoc3RyZWFtLmxvY2FsU3RyZWFtSWQgPT09IGxvY2FsU3RyZWFtSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyZWFtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vICBUaGUgaGVhZGVyIGFuZCB0aGUgbWVzc2FnZSBkYXRhIG11c3QgYmUgc2VudCBjb25zZWN1dGl2ZWx5LiBVc2luZyAyIGF3YWl0c1xuICAgIC8vICBBbm90aGVyIG1lc3NhZ2UgY2FuIGludGVybGVhdmUgYWZ0ZXIgdGhlIGZpcnN0IGhlYWRlciBoYXMgYmVlbiBzZW50LFxuICAgIC8vICByZXN1bHRpbmcgaW4gc29tZXRoaW5nIGxpa2UgW2hlYWRlcjFdIFtoZWFkZXIyXSBbZGF0YTFdIFtkYXRhMl07XG4gICAgLy8gIEluIHRoaXMgd2F5IHdlIGFyZSB3YWl0aW5nIGJvdGggcHJvbWlzZXMgdG8gYmUgcmVzb2x2ZWQgYmVmb3JlIGNvbnRpbnVpbmcuXG4gICAgYXN5bmMgc2VuZE1lc3NhZ2UoY21kLCBhcmcwLCBhcmcxLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IEFkYk1zZy5jcmVhdGUoeyBjbWQsIGFyZzAsIGFyZzEsIGRhdGEsIHVzZUNoZWNrc3VtOiB0aGlzLnVzZUNoZWNrc3VtIH0pO1xuICAgICAgICBjb25zdCBtc2dIZWFkZXIgPSBtc2cuZW5jb2RlSGVhZGVyKCk7XG4gICAgICAgIGNvbnN0IG1zZ0RhdGEgPSBtc2cuZGF0YTtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShtc2dIZWFkZXIubGVuZ3RoIDw9IHRoaXMubWF4UGF5bG9hZCAmJlxuICAgICAgICAgICAgbXNnRGF0YS5sZW5ndGggPD0gdGhpcy5tYXhQYXlsb2FkKTtcbiAgICAgICAgY29uc3Qgc2VuZFByb21pc2VzID0gW3RoaXMud3JhcFVzYih0aGlzLmRldmljZS50cmFuc2Zlck91dCh0aGlzLnVzYldyaXRlRXBFbmRwb2ludCwgbXNnSGVhZGVyLmJ1ZmZlcikpXTtcbiAgICAgICAgaWYgKG1zZy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlcy5wdXNoKHRoaXMud3JhcFVzYih0aGlzLmRldmljZS50cmFuc2Zlck91dCh0aGlzLnVzYldyaXRlRXBFbmRwb2ludCwgbXNnRGF0YS5idWZmZXIpKSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoc2VuZFByb21pc2VzKTtcbiAgICB9XG4gICAgd3JhcFVzYihwcm9taXNlKSB7XG4gICAgICAgIHJldHVybiAoMCwgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEud3JhcFJlY29yZGluZ0Vycm9yKShwcm9taXNlLCB0aGlzLnJlYWNoRGlzY29ubmVjdFN0YXRlLmJpbmQodGhpcykpO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiQ29ubmVjdGlvbk92ZXJXZWJ1c2IgPSBBZGJDb25uZWN0aW9uT3ZlcldlYnVzYjtcbi8vIEFuIEFkYk92ZXJXZWJ1c2JTdHJlYW0gaXMgaW5zdGFudGlhdGVkIGFmdGVyIHRoZSBjcmVhdGlvbiBvZiBhIHNvY2tldCB0byB0aGVcbi8vIGRldmljZS4gVGhhbmtzIHRvIHRoaXMsIHdlIGNhbiBzZW5kIGNvbW1hbmRzIGFuZCByZWNlaXZlIHRoZWlyIG91dHB1dC5cbi8vIE1lc3NhZ2VzIGFyZSByZWNlaXZlZCBpbiB0aGUgbWFpbiBhZGIgY2xhc3MsIGFuZCBhcmUgZm9yd2FyZGVkIHRvIGFuIGluc3RhbmNlXG4vLyBvZiB0aGlzIGNsYXNzIGJhc2VkIG9uIGEgc3RyZWFtIGlkIG1hdGNoLlxuY2xhc3MgQWRiT3ZlcldlYnVzYlN0cmVhbSB7XG4gICAgY29uc3RydWN0b3IoYWRiLCBsb2NhbFN0cmVhbUlkLCByZW1vdGVTdHJlYW1JZCkge1xuICAgICAgICB0aGlzLm9uU3RyZWFtRGF0YUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLm9uU3RyZWFtQ2xvc2VDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5yZW1vdGVTdHJlYW1JZCA9IC0xO1xuICAgICAgICB0aGlzLmFkYkNvbm5lY3Rpb24gPSBhZGI7XG4gICAgICAgIHRoaXMubG9jYWxTdHJlYW1JZCA9IGxvY2FsU3RyZWFtSWQ7XG4gICAgICAgIHRoaXMucmVtb3RlU3RyZWFtSWQgPSByZW1vdGVTdHJlYW1JZDtcbiAgICAgICAgLy8gV2hlbiB0aGUgc3RyZWFtIGlzIGNyZWF0ZWQsIHRoZSBjb25uZWN0aW9uIGhhcyBiZWVuIGFscmVhZHkgZXN0YWJsaXNoZWQuXG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgYWRkT25TdHJlYW1EYXRhQ2FsbGJhY2sob25TdHJlYW1EYXRhKSB7XG4gICAgICAgIHRoaXMub25TdHJlYW1EYXRhQ2FsbGJhY2tzLnB1c2gob25TdHJlYW1EYXRhKTtcbiAgICB9XG4gICAgYWRkT25TdHJlYW1DbG9zZUNhbGxiYWNrKG9uU3RyZWFtQ2xvc2UpIHtcbiAgICAgICAgdGhpcy5vblN0cmVhbUNsb3NlQ2FsbGJhY2tzLnB1c2gob25TdHJlYW1DbG9zZSk7XG4gICAgfVxuICAgIC8vIFVzZWQgYnkgdGhlIGNvbm5lY3Rpb24gb2JqZWN0IHRvIHNpZ25hbCBuZXdseSByZWNlaXZlZCBkYXRhLCBub3QgZXhwb3NlZFxuICAgIC8vIGluIHRoZSBpbnRlcmZhY2UuXG4gICAgc2lnbmFsU3RyZWFtRGF0YShkYXRhKSB7XG4gICAgICAgIGZvciAoY29uc3Qgb25TdHJlYW1EYXRhIG9mIHRoaXMub25TdHJlYW1EYXRhQ2FsbGJhY2tzKSB7XG4gICAgICAgICAgICBvblN0cmVhbURhdGEoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVXNlZCBieSB0aGUgY29ubmVjdGlvbiBvYmplY3QgdG8gc2lnbmFsIHRoZSBzdHJlYW0gaXMgY2xvc2VkLCBub3QgZXhwb3NlZFxuICAgIC8vIGluIHRoZSBpbnRlcmZhY2UuXG4gICAgc2lnbmFsU3RyZWFtQ2xvc2VkKCkge1xuICAgICAgICBmb3IgKGNvbnN0IG9uU3RyZWFtQ2xvc2Ugb2YgdGhpcy5vblN0cmVhbUNsb3NlQ2FsbGJhY2tzKSB7XG4gICAgICAgICAgICBvblN0cmVhbUNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vblN0cmVhbURhdGFDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5vblN0cmVhbUNsb3NlQ2FsbGJhY2tzID0gW107XG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLmNsb3NlQW5kV2FpdEZvclRlYXJkb3duKCk7XG4gICAgfVxuICAgIGFzeW5jIGNsb3NlQW5kV2FpdEZvclRlYXJkb3duKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICBhd2FpdCB0aGlzLmFkYkNvbm5lY3Rpb24uc3RyZWFtQ2xvc2UodGhpcyk7XG4gICAgfVxuICAgIHdyaXRlKG1zZykge1xuICAgICAgICB0aGlzLmFkYkNvbm5lY3Rpb24uc3RyZWFtV3JpdGUobXNnLCB0aGlzKTtcbiAgICB9XG4gICAgaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Nvbm5lY3RlZDtcbiAgICB9XG59XG5leHBvcnRzLkFkYk92ZXJXZWJ1c2JTdHJlYW0gPSBBZGJPdmVyV2VidXNiU3RyZWFtO1xuY29uc3QgQURCX01TR19TSVpFID0gNiAqIDQ7IC8vIDYgKiBpbnQzMi5cbmNsYXNzIEFkYk1zZyB7XG4gICAgY29uc3RydWN0b3IoY21kLCBhcmcwLCBhcmcxLCBkYXRhTGVuLCBkYXRhQ2hlY2tzdW0sIHVzZUNoZWNrc3VtID0gZmFsc2UpIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShjbWQubGVuZ3RoID09PSA0KTtcbiAgICAgICAgdGhpcy5jbWQgPSBjbWQ7XG4gICAgICAgIHRoaXMuYXJnMCA9IGFyZzA7XG4gICAgICAgIHRoaXMuYXJnMSA9IGFyZzE7XG4gICAgICAgIHRoaXMuZGF0YUxlbiA9IGRhdGFMZW47XG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGFMZW4pO1xuICAgICAgICB0aGlzLmRhdGFDaGVja3N1bSA9IGRhdGFDaGVja3N1bTtcbiAgICAgICAgdGhpcy51c2VDaGVja3N1bSA9IHVzZUNoZWNrc3VtO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHsgY21kLCBhcmcwLCBhcmcxLCBkYXRhLCB1c2VDaGVja3N1bSA9IHRydWUgfSkge1xuICAgICAgICBjb25zdCBlbmNvZGVkRGF0YSA9IHRoaXMuZW5jb2RlRGF0YShkYXRhKTtcbiAgICAgICAgY29uc3QgbXNnID0gbmV3IEFkYk1zZyhjbWQsIGFyZzAsIGFyZzEsIGVuY29kZWREYXRhLmxlbmd0aCwgMCwgdXNlQ2hlY2tzdW0pO1xuICAgICAgICBtc2cuZGF0YSA9IGVuY29kZWREYXRhO1xuICAgICAgICByZXR1cm4gbXNnO1xuICAgIH1cbiAgICBnZXQgZGF0YVN0cigpIHtcbiAgICAgICAgcmV0dXJuIHRleHREZWNvZGVyLmRlY29kZSh0aGlzLmRhdGEpO1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuY21kfSBbJHt0aGlzLmFyZzB9LCR7dGhpcy5hcmcxfV0gJHt0aGlzLmRhdGFTdHJ9YDtcbiAgICB9XG4gICAgLy8gQSBicmllZiBkZXNjcmlwdGlvbiBvZiB0aGUgbWVzc2FnZSBjYW4gYmUgZm91bmQgaGVyZTpcbiAgICAvLyBodHRwczovL2FuZHJvaWQuZ29vZ2xlc291cmNlLmNvbS9wbGF0Zm9ybS9zeXN0ZW0vY29yZS8rL21haW4vYWRiL3Byb3RvY29sLnR4dFxuICAgIC8vXG4gICAgLy8gc3RydWN0IGFtZXNzYWdlIHtcbiAgICAvLyAgICAgdWludDMyX3QgY29tbWFuZDsgICAgLy8gY29tbWFuZCBpZGVudGlmaWVyIGNvbnN0YW50XG4gICAgLy8gICAgIHVpbnQzMl90IGFyZzA7ICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50XG4gICAgLy8gICAgIHVpbnQzMl90IGFyZzE7ICAgICAgIC8vIHNlY29uZCBhcmd1bWVudFxuICAgIC8vICAgICB1aW50MzJfdCBkYXRhX2xlbmd0aDsvLyBsZW5ndGggb2YgcGF5bG9hZCAoMCBpcyBhbGxvd2VkKVxuICAgIC8vICAgICB1aW50MzJfdCBkYXRhX2NoZWNrOyAvLyBjaGVja3N1bSBvZiBkYXRhIHBheWxvYWRcbiAgICAvLyAgICAgdWludDMyX3QgbWFnaWM7ICAgICAgLy8gY29tbWFuZCBeIDB4ZmZmZmZmZmZcbiAgICAvLyB9O1xuICAgIHN0YXRpYyBkZWNvZGVIZWFkZXIoZHYpIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShkdi5ieXRlTGVuZ3RoID09PSBBREJfTVNHX1NJWkUpO1xuICAgICAgICBjb25zdCBjbWQgPSB0ZXh0RGVjb2Rlci5kZWNvZGUoZHYuYnVmZmVyLnNsaWNlKDAsIDQpKTtcbiAgICAgICAgY29uc3QgY21kTnVtID0gZHYuZ2V0VWludDMyKDAsIHRydWUpO1xuICAgICAgICBjb25zdCBhcmcwID0gZHYuZ2V0VWludDMyKDQsIHRydWUpO1xuICAgICAgICBjb25zdCBhcmcxID0gZHYuZ2V0VWludDMyKDgsIHRydWUpO1xuICAgICAgICBjb25zdCBkYXRhTGVuID0gZHYuZ2V0VWludDMyKDEyLCB0cnVlKTtcbiAgICAgICAgY29uc3QgZGF0YUNoZWNrc3VtID0gZHYuZ2V0VWludDMyKDE2LCB0cnVlKTtcbiAgICAgICAgY29uc3QgY21kQ2hlY2tzdW0gPSBkdi5nZXRVaW50MzIoMjAsIHRydWUpO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGNtZE51bSA9PT0gKGNtZENoZWNrc3VtIF4gMHhGRkZGRkZGRikpO1xuICAgICAgICByZXR1cm4gbmV3IEFkYk1zZyhjbWQsIGFyZzAsIGFyZzEsIGRhdGFMZW4sIGRhdGFDaGVja3N1bSk7XG4gICAgfVxuICAgIGVuY29kZUhlYWRlcigpIHtcbiAgICAgICAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkoQURCX01TR19TSVpFKTtcbiAgICAgICAgY29uc3QgZHYgPSBuZXcgRGF0YVZpZXcoYnVmLmJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGNtZEJ5dGVzID0gdGV4dEVuY29kZXIuZW5jb2RlKHRoaXMuY21kKTtcbiAgICAgICAgY29uc3QgcmF3TXNnID0gQWRiTXNnLmVuY29kZURhdGEodGhpcy5kYXRhKTtcbiAgICAgICAgY29uc3QgY2hlY2tzdW0gPSB0aGlzLnVzZUNoZWNrc3VtID8gZ2VuZXJhdGVDaGVja3N1bShyYXdNc2cpIDogMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspXG4gICAgICAgICAgICBkdi5zZXRVaW50OChpLCBjbWRCeXRlc1tpXSk7XG4gICAgICAgIGR2LnNldFVpbnQzMig0LCB0aGlzLmFyZzAsIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoOCwgdGhpcy5hcmcxLCB0cnVlKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDEyLCByYXdNc2cuYnl0ZUxlbmd0aCwgdHJ1ZSk7XG4gICAgICAgIGR2LnNldFVpbnQzMigxNiwgY2hlY2tzdW0sIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMjAsIGR2LmdldFVpbnQzMigwLCB0cnVlKSBeIDB4RkZGRkZGRkYsIHRydWUpO1xuICAgICAgICByZXR1cm4gYnVmO1xuICAgIH1cbiAgICBzdGF0aWMgZW5jb2RlRGF0YShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoW10pO1xuICAgICAgICBpZiAoKDAsIG9iamVjdF91dGlsc18xLmlzU3RyaW5nKShkYXRhKSlcbiAgICAgICAgICAgIHJldHVybiB0ZXh0RW5jb2Rlci5lbmNvZGUoZGF0YSArICdcXDAnKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYkZpbGVIYW5kbGVyID0gdm9pZCAwO1xuY29uc3QgY3VzdG9tX3V0aWxzXzEgPSByZXF1aXJlKFwiY3VzdG9tX3V0aWxzXCIpO1xuY29uc3QgZGVmZXJyZWRfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2RlZmVycmVkXCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEgPSByZXF1aXJlKFwiLi4vYXJyYXlfYnVmZmVyX2J1aWxkZXJcIik7XG5jb25zdCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMSA9IHJlcXVpcmUoXCIuL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZ1wiKTtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX3V0aWxzXCIpO1xuLy8gaHR0cHM6Ly9jcy5hbmRyb2lkLmNvbS9hbmRyb2lkL3BsYXRmb3JtL3N1cGVycHJvamVjdC8rL21haW46cGFja2FnZXMvXG4vLyBtb2R1bGVzL2FkYi9maWxlX3N5bmNfcHJvdG9jb2wuaDtsPTE0NFxuY29uc3QgTUFYX1NZTkNfU0VORF9DSFVOS19TSVpFID0gNjQgKiAxMDI0O1xuLy8gQWRiIGRvZXMgbm90IGFjY3VyYXRlbHkgc2VuZCBzb21lIGZpbGUgcGVybWlzc2lvbnMuIElmIHlvdSBuZWVkIGEgc3BlY2lhbCBzZXRcbi8vIG9mIHBlcm1pc3Npb25zLCBkbyBub3QgcmVseSBvbiB0aGlzIHZhbHVlLiBSYXRoZXIsIHNlbmQgYSBzaGVsbCBjb21tYW5kIHdoaWNoXG4vLyBleHBsaWNpdGx5IHNldHMgcGVybWlzc2lvbnMsIHN1Y2ggYXM6XG4vLyAnc2hlbGw6Y2htb2QgJHtwZXJtaXNzaW9uc30gJHtwYXRofSdcbmNvbnN0IEZJTEVfUEVSTUlTU0lPTlMgPSAyICoqIDE1ICsgMG82NDQ7XG5jb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBjdXN0b21fdXRpbHNfMS5fVGV4dERlY29kZXIoKTtcbi8vIEZvciBkZXRhaWxzIGFib3V0IHRoZSBwcm90b2NvbCwgc2VlOlxuLy8gaHR0cHM6Ly9jcy5hbmRyb2lkLmNvbS9hbmRyb2lkL3BsYXRmb3JtL3N1cGVycHJvamVjdC8rL21haW46cGFja2FnZXMvbW9kdWxlcy9hZGIvU1lOQy5UWFRcbmNsYXNzIEFkYkZpbGVIYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihieXRlU3RyZWFtKSB7XG4gICAgICAgIHRoaXMuYnl0ZVN0cmVhbSA9IGJ5dGVTdHJlYW07XG4gICAgICAgIHRoaXMuc2VudEJ5dGVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuaXNQdXNoT25nb2luZyA9IGZhbHNlO1xuICAgIH1cbiAgICBhc3luYyBwdXNoQmluYXJ5KGJpbmFyeSwgcGF0aCkge1xuICAgICAgICAvLyBGb3IgYSBnaXZlbiBieXRlU3RyZWFtLCB3ZSBvbmx5IHN1cHBvcnQgcHVzaGluZyBvbmUgYmluYXJ5IGF0IGEgdGltZS5cbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRGYWxzZSkodGhpcy5pc1B1c2hPbmdvaW5nKTtcbiAgICAgICAgdGhpcy5pc1B1c2hPbmdvaW5nID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdHJhbnNmZXJGaW5pc2hlZCA9ICgwLCBkZWZlcnJlZF8xLmRlZmVyKSgpO1xuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0uYWRkT25TdHJlYW1EYXRhQ2FsbGJhY2soKGRhdGEpID0+IHRoaXMub25TdHJlYW1EYXRhKGRhdGEsIHRyYW5zZmVyRmluaXNoZWQpKTtcbiAgICAgICAgdGhpcy5ieXRlU3RyZWFtLmFkZE9uU3RyZWFtQ2xvc2VDYWxsYmFjaygoKSA9PiB0aGlzLmlzUHVzaE9uZ29pbmcgPSBmYWxzZSk7XG4gICAgICAgIGNvbnN0IHNlbmRNZXNzYWdlID0gbmV3IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEuQXJyYXlCdWZmZXJCdWlsZGVyKCk7XG4gICAgICAgIC8vICdTRU5EJyBpcyB0aGUgQVBJIG1ldGhvZCB1c2VkIHRvIHNlbmQgYSBmaWxlIHRvIGRldmljZS5cbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKCdTRU5EJyk7XG4gICAgICAgIC8vIFRoZSByZW1vdGUgZmlsZSBuYW1lIGlzIHNwbGl0IGludG8gdHdvIHBhcnRzIHNlcGFyYXRlZCBieSB0aGUgbGFzdFxuICAgICAgICAvLyBjb21tYSAoXCIsXCIpLiBUaGUgZmlyc3QgcGFydCBpcyB0aGUgYWN0dWFsIHBhdGgsIHdoaWxlIHRoZSBzZWNvbmQgaXMgYVxuICAgICAgICAvLyBkZWNpbWFsIGVuY29kZWQgZmlsZSBtb2RlIGNvbnRhaW5pbmcgdGhlIHBlcm1pc3Npb25zIG9mIHRoZSBmaWxlIG9uXG4gICAgICAgIC8vIGRldmljZS5cbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKHBhdGgubGVuZ3RoICsgNik7XG4gICAgICAgIHNlbmRNZXNzYWdlLmFwcGVuZChwYXRoKTtcbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKCcsJyk7XG4gICAgICAgIHNlbmRNZXNzYWdlLmFwcGVuZChGSUxFX1BFUk1JU1NJT05TLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0ud3JpdGUobmV3IFVpbnQ4QXJyYXkoc2VuZE1lc3NhZ2UudG9BcnJheUJ1ZmZlcigpKSk7XG4gICAgICAgIHdoaWxlICghKGF3YWl0IHRoaXMuc2VuZE5leHREYXRhQ2h1bmsoYmluYXJ5KSkpXG4gICAgICAgICAgICA7XG4gICAgICAgIHJldHVybiB0cmFuc2ZlckZpbmlzaGVkO1xuICAgIH1cbiAgICBvblN0cmVhbURhdGEoZGF0YSwgdHJhbnNmZXJGaW5pc2hlZCkge1xuICAgICAgICB0aGlzLnNlbnRCeXRlQ291bnQgPSAwO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IHRleHREZWNvZGVyLmRlY29kZShkYXRhKTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnNwbGl0KCdcXG4nKVswXS5pbmNsdWRlcygnRkFJTCcpKSB7XG4gICAgICAgICAgICAvLyBTYW1wbGUgZmFpbHVyZSByZXNwb25zZSAod2hlbiB0aGUgZmlsZSBpcyB0cmFuc2ZlcnJlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgICAgIC8vIGJ1dCB0aGUgZGF0ZSBpcyBub3QgZm9ybWF0dGVkIGNvcnJlY3RseSk6XG4gICAgICAgICAgICAvLyAnT0tBWUZBSUxcXG5wYXRoIHRvbyBsb25nJ1xuICAgICAgICAgICAgdHJhbnNmZXJGaW5pc2hlZC5yZWplY3QobmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGAke3JlY29yZGluZ191dGlsc18xLkJJTkFSWV9QVVNIX0ZBSUxVUkV9OiAke3Jlc3BvbnNlfWApKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0ZXh0RGVjb2Rlci5kZWNvZGUoZGF0YSkuc3Vic3RyaW5nKDAsIDQpID09PSAnT0tBWScpIHtcbiAgICAgICAgICAgIC8vIEluIGNhc2Ugb2Ygc3VjY2VzcywgdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgbGFzdCByZXF1ZXN0IHdpdGhcbiAgICAgICAgICAgIC8vICdPS0FZJy5cbiAgICAgICAgICAgIHRyYW5zZmVyRmluaXNoZWQucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGAke3JlY29yZGluZ191dGlsc18xLkJJTkFSWV9QVVNIX1VOS05PV05fUkVTUE9OU0V9OiAke3Jlc3BvbnNlfWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIHNlbmROZXh0RGF0YUNodW5rKGJpbmFyeSkge1xuICAgICAgICBjb25zdCBlbmRQb3NpdGlvbiA9IE1hdGgubWluKHRoaXMuc2VudEJ5dGVDb3VudCArIE1BWF9TWU5DX1NFTkRfQ0hVTktfU0laRSwgYmluYXJ5LmJ5dGVMZW5ndGgpO1xuICAgICAgICBjb25zdCBjaHVuayA9IGF3YWl0IGJpbmFyeS5zbGljZSh0aGlzLnNlbnRCeXRlQ291bnQsIGVuZFBvc2l0aW9uKTtcbiAgICAgICAgLy8gVGhlIGZpbGUgaXMgc2VudCBpbiBjaHVua3MuIEVhY2ggY2h1bmsgaXMgcHJlZml4ZWQgd2l0aCBcIkRBVEFcIiBhbmQgdGhlXG4gICAgICAgIC8vIGNodW5rIGxlbmd0aC4gVGhpcyBpcyByZXBlYXRlZCB1bnRpbCB0aGUgZW50aXJlIGZpbGUgaXMgdHJhbnNmZXJyZWQuIEVhY2hcbiAgICAgICAgLy8gY2h1bmsgbXVzdCBub3QgYmUgbGFyZ2VyIHRoYW4gNjRrLlxuICAgICAgICBjb25zdCBjaHVua0xlbmd0aCA9IGNodW5rLmJ5dGVMZW5ndGg7XG4gICAgICAgIGNvbnN0IGRhdGFNZXNzYWdlID0gbmV3IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEuQXJyYXlCdWZmZXJCdWlsZGVyKCk7XG4gICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZCgnREFUQScpO1xuICAgICAgICBkYXRhTWVzc2FnZS5hcHBlbmQoY2h1bmtMZW5ndGgpO1xuICAgICAgICBkYXRhTWVzc2FnZS5hcHBlbmQobmV3IFVpbnQ4QXJyYXkoY2h1bmsuYnVmZmVyLCBjaHVuay5ieXRlT2Zmc2V0LCBjaHVua0xlbmd0aCkpO1xuICAgICAgICB0aGlzLnNlbnRCeXRlQ291bnQgKz0gY2h1bmtMZW5ndGg7XG4gICAgICAgIGNvbnN0IGlzRG9uZSA9IHRoaXMuc2VudEJ5dGVDb3VudCA9PT0gYmluYXJ5LmJ5dGVMZW5ndGg7XG4gICAgICAgIGlmIChpc0RvbmUpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gdGhlIGZpbGUgaXMgdHJhbnNmZXJyZWQgYSBzeW5jIHJlcXVlc3QgXCJET05FXCIgaXMgc2VudCwgdG9nZXRoZXJcbiAgICAgICAgICAgIC8vIHdpdGggYSB0aW1lc3RhbXAsIHJlcHJlc2VudGluZyB0aGUgbGFzdCBtb2RpZmllZCB0aW1lIGZvciB0aGUgZmlsZS4gVGhlXG4gICAgICAgICAgICAvLyBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhpcyBsYXN0IHJlcXVlc3QuXG4gICAgICAgICAgICBkYXRhTWVzc2FnZS5hcHBlbmQoJ0RPTkUnKTtcbiAgICAgICAgICAgIC8vIFdlIHNlbmQgdGhlIGRhdGUgaW4gc2Vjb25kcy5cbiAgICAgICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZChNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ieXRlU3RyZWFtLndyaXRlKG5ldyBVaW50OEFycmF5KGRhdGFNZXNzYWdlLnRvQXJyYXlCdWZmZXIoKSkpO1xuICAgICAgICByZXR1cm4gaXNEb25lO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiRmlsZUhhbmRsZXIgPSBBZGJGaWxlSGFuZGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZGJLZXkgPSB2b2lkIDA7XG5jb25zdCBqc2JuX3JzYV8xID0gcmVxdWlyZShcImpzYm4tcnNhXCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IHN0cmluZ191dGlsc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2Jhc2Uvc3RyaW5nX3V0aWxzXCIpO1xuY29uc3QgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEgPSByZXF1aXJlKFwiLi4vcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXCIpO1xuY29uc3QgV09SRF9TSVpFID0gNDtcbmNvbnN0IE1PRFVMVVNfU0laRV9CSVRTID0gMjA0ODtcbmNvbnN0IE1PRFVMVVNfU0laRSA9IE1PRFVMVVNfU0laRV9CSVRTIC8gODtcbmNvbnN0IE1PRFVMVVNfU0laRV9XT1JEUyA9IE1PRFVMVVNfU0laRSAvIFdPUkRfU0laRTtcbmNvbnN0IFBVQktFWV9FTkNPREVEX1NJWkUgPSAzICogV09SRF9TSVpFICsgMiAqIE1PRFVMVVNfU0laRTtcbmNvbnN0IEFEQl9XRUJfQ1JZUFRPX0FMR09SSVRITSA9IHtcbiAgICBuYW1lOiAnUlNBU1NBLVBLQ1MxLXYxXzUnLFxuICAgIGhhc2g6IHsgbmFtZTogJ1NIQS0xJyB9LFxuICAgIHB1YmxpY0V4cG9uZW50OiBuZXcgVWludDhBcnJheShbMHgwMSwgMHgwMCwgMHgwMV0pLCAvLyA2NTUzN1xuICAgIG1vZHVsdXNMZW5ndGg6IE1PRFVMVVNfU0laRV9CSVRTLFxufTtcbmNvbnN0IEFEQl9XRUJfQ1JZUFRPX0VYUE9SVEFCTEUgPSB0cnVlO1xuY29uc3QgQURCX1dFQl9DUllQVE9fT1BFUkFUSU9OUyA9IFsnc2lnbiddO1xuY29uc3QgU0lHTklOR19BU04xX1BSRUZJWCA9IFtcbiAgICAweDAwLFxuICAgIDB4MzAsXG4gICAgMHgyMSxcbiAgICAweDMwLFxuICAgIDB4MDksXG4gICAgMHgwNixcbiAgICAweDA1LFxuICAgIDB4MkIsXG4gICAgMHgwRSxcbiAgICAweDAzLFxuICAgIDB4MDIsXG4gICAgMHgxQSxcbiAgICAweDA1LFxuICAgIDB4MDAsXG4gICAgMHgwNCxcbiAgICAweDE0LFxuXTtcbmNvbnN0IFIzMiA9IGpzYm5fcnNhXzEuQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KDMyKTsgLy8gMSA8PCAzMlxuZnVuY3Rpb24gaXNWYWxpZEpzb25XZWJLZXkoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5uICE9PSB1bmRlZmluZWQgJiYga2V5LmUgIT09IHVuZGVmaW5lZCAmJiBrZXkuZCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIGtleS5wICE9PSB1bmRlZmluZWQgJiYga2V5LnEgIT09IHVuZGVmaW5lZCAmJiBrZXkuZHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBrZXkuZHEgIT09IHVuZGVmaW5lZCAmJiBrZXkucWkgIT09IHVuZGVmaW5lZDtcbn1cbi8vIENvbnZlcnQgYSBCaWdJbnRlZ2VyIHRvIGFuIGFycmF5IG9mIGEgc3BlY2lmaWVkIHNpemUgaW4gYnl0ZXMuXG5mdW5jdGlvbiBiaWdJbnRUb0ZpeGVkQnl0ZUFycmF5KGJuLCBzaXplKSB7XG4gICAgY29uc3QgcGFkZGVkQm5CeXRlcyA9IGJuLnRvQnl0ZUFycmF5KCk7XG4gICAgbGV0IGZpcnN0Tm9uWmVyb0luZGV4ID0gMDtcbiAgICB3aGlsZSAoZmlyc3ROb25aZXJvSW5kZXggPCBwYWRkZWRCbkJ5dGVzLmxlbmd0aCAmJlxuICAgICAgICBwYWRkZWRCbkJ5dGVzW2ZpcnN0Tm9uWmVyb0luZGV4XSA9PT0gMCkge1xuICAgICAgICBmaXJzdE5vblplcm9JbmRleCsrO1xuICAgIH1cbiAgICBjb25zdCBibkJ5dGVzID0gVWludDhBcnJheS5mcm9tKHBhZGRlZEJuQnl0ZXMuc2xpY2UoZmlyc3ROb25aZXJvSW5kZXgpKTtcbiAgICBjb25zdCByZXMgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGJuQnl0ZXMubGVuZ3RoIDw9IHJlcy5sZW5ndGgpO1xuICAgIHJlcy5zZXQoYm5CeXRlcywgcmVzLmxlbmd0aCAtIGJuQnl0ZXMubGVuZ3RoKTtcbiAgICByZXR1cm4gcmVzO1xufVxuY2xhc3MgQWRiS2V5IHtcbiAgICBjb25zdHJ1Y3Rvcihqd2tQcml2YXRlKSB7XG4gICAgICAgIHRoaXMuandrUHJpdmF0ZSA9IGp3a1ByaXZhdGU7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBHZW5lcmF0ZU5ld0tleVBhaXIoKSB7XG4gICAgICAgIC8vIENvbnN0cnVjdCBhIG5ldyBDcnlwdG9LZXlQYWlyIGFuZCBrZWVwIGl0cyBwcml2YXRlIGtleSBpbiBKV0IgZm9ybWF0LlxuICAgICAgICBjb25zdCBrZXlQYWlyID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5nZW5lcmF0ZUtleShBREJfV0VCX0NSWVBUT19BTEdPUklUSE0sIEFEQl9XRUJfQ1JZUFRPX0VYUE9SVEFCTEUsIEFEQl9XRUJfQ1JZUFRPX09QRVJBVElPTlMpO1xuICAgICAgICBjb25zdCBqd2tQcml2YXRlID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5leHBvcnRLZXkoJ2p3aycsIGtleVBhaXIucHJpdmF0ZUtleSk7XG4gICAgICAgIGlmICghaXNWYWxpZEpzb25XZWJLZXkoandrUHJpdmF0ZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcignQ291bGQgbm90IGdlbmVyYXRlIGEgdmFsaWQgcHJpdmF0ZSBrZXkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBZGJLZXkoandrUHJpdmF0ZSk7XG4gICAgfVxuICAgIHN0YXRpYyBEZXNlcmlhbGl6ZUtleShzZXJpYWxpemVkS2V5KSB7XG4gICAgICAgIHJldHVybiBuZXcgQWRiS2V5KEpTT04ucGFyc2Uoc2VyaWFsaXplZEtleSkpO1xuICAgIH1cbiAgICAvLyBQZXJmb3JtIGFuIFJTQSBzaWduaW5nIG9wZXJhdGlvbiBmb3IgdGhlIEFEQiBhdXRoIGNoYWxsZW5nZS5cbiAgICAvL1xuICAgIC8vIEZvciB0aGUgUlNBIHNpZ25hdHVyZSwgdGhlIHRva2VuIGlzIGV4cGVjdGVkIHRvIGhhdmUgYWxyZWFkeVxuICAgIC8vIGhhZCB0aGUgU0hBLTEgbWVzc2FnZSBkaWdlc3QgYXBwbGllZC5cbiAgICAvL1xuICAgIC8vIEhvd2V2ZXIsIHRoZSBhZGIgdG9rZW4gd2UgcmVjZWl2ZSBmcm9tIHRoZSBkZXZpY2UgaXMgbWFkZSB1cCBvZiAyMCByYW5kb21seVxuICAgIC8vIGdlbmVyYXRlZCBieXRlcyB0aGF0IGFyZSB0cmVhdGVkIGxpa2UgYSBTSEEtMS4gVGhlcmVmb3JlLCB3ZSBuZWVkIHRvIHVwZGF0ZVxuICAgIC8vIHRoZSBtZXNzYWdlIGZvcm1hdC5cbiAgICBzaWduKHRva2VuKSB7XG4gICAgICAgIGNvbnN0IHJzYUtleSA9IG5ldyBqc2JuX3JzYV8xLlJTQUtleSgpO1xuICAgICAgICByc2FLZXkuc2V0UHJpdmF0ZUV4KCgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5uKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5lKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5kKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5wKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5xKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5kcCkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUuZHEpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLnFpKSkpO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHJzYUtleS5uLmJpdExlbmd0aCgpID09PSBNT0RVTFVTX1NJWkVfQklUUyk7XG4gICAgICAgIC8vIE1lc3NhZ2UgTGF5b3V0IChzaXplIGVxdWFscyB0aGF0IG9mIHRoZSBrZXkgbW9kdWx1cyk6XG4gICAgICAgIC8vIDAwIDAxIEZGIEZGIEZGIEZGIC4uLiBGRiBbQVNOLjEgUFJFRklYXSBbVE9LRU5dXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBuZXcgVWludDhBcnJheShNT0RVTFVTX1NJWkUpO1xuICAgICAgICAvLyBJbml0aWFsbHkgZmlsbCB0aGUgYnVmZmVyIHdpdGggdGhlIHBhZGRpbmdcbiAgICAgICAgbWVzc2FnZS5maWxsKDB4RkYpO1xuICAgICAgICAvLyBhZGQgcHJlZml4XG4gICAgICAgIG1lc3NhZ2VbMF0gPSAweDAwO1xuICAgICAgICBtZXNzYWdlWzFdID0gMHgwMTtcbiAgICAgICAgLy8gYWRkIHRoZSBBU04uMSBwcmVmaXhcbiAgICAgICAgbWVzc2FnZS5zZXQoU0lHTklOR19BU04xX1BSRUZJWCwgbWVzc2FnZS5sZW5ndGggLSBTSUdOSU5HX0FTTjFfUFJFRklYLmxlbmd0aCAtIHRva2VuLmxlbmd0aCk7XG4gICAgICAgIC8vIHRoZW4gdGhlIGFjdHVhbCB0b2tlbiBhdCB0aGUgZW5kXG4gICAgICAgIG1lc3NhZ2Uuc2V0KHRva2VuLCBtZXNzYWdlLmxlbmd0aCAtIHRva2VuLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VJbnRlZ2VyID0gbmV3IGpzYm5fcnNhXzEuQmlnSW50ZWdlcihBcnJheS5mcm9tKG1lc3NhZ2UpKTtcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gcnNhS2V5LmRvUHJpdmF0ZShtZXNzYWdlSW50ZWdlcik7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShiaWdJbnRUb0ZpeGVkQnl0ZUFycmF5KHNpZ25hdHVyZSwgTU9EVUxVU19TSVpFKSk7XG4gICAgfVxuICAgIC8vIENvbnN0cnVjdCBwdWJsaWMga2V5IHRvIG1hdGNoIHRoZSBhZGIgZm9ybWF0OlxuICAgIC8vIGdvL2NvZGVzZWFyY2gvcnZjLWFyYy9zeXN0ZW0vY29yZS9saWJjcnlwdG9fdXRpbHMvYW5kcm9pZF9wdWJrZXkuYztsPTM4LTUzXG4gICAgZ2V0UHVibGljS2V5KCkge1xuICAgICAgICBjb25zdCByc2FLZXkgPSBuZXcganNibl9yc2FfMS5SU0FLZXkoKTtcbiAgICAgICAgcnNhS2V5LnNldFB1YmxpYygoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSgoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuandrUHJpdmF0ZS5uKSkpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkoKCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmp3a1ByaXZhdGUuZSkpKSkpO1xuICAgICAgICBjb25zdCBuMGludiA9IFIzMi5zdWJ0cmFjdChyc2FLZXkubi5tb2RJbnZlcnNlKFIzMikpLmludFZhbHVlKCk7XG4gICAgICAgIGNvbnN0IHIgPSBqc2JuX3JzYV8xLkJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdCgxKS5wb3coTU9EVUxVU19TSVpFX0JJVFMpO1xuICAgICAgICBjb25zdCByciA9IHIubXVsdGlwbHkocikubW9kKHJzYUtleS5uKTtcbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKFBVQktFWV9FTkNPREVEX1NJWkUpO1xuICAgICAgICBjb25zdCBkdiA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMCwgTU9EVUxVU19TSVpFX1dPUkRTLCB0cnVlKTtcbiAgICAgICAgZHYuc2V0VWludDMyKFdPUkRfU0laRSwgbjBpbnYsIHRydWUpO1xuICAgICAgICBjb25zdCBkdlU4ID0gbmV3IFVpbnQ4QXJyYXkoZHYuYnVmZmVyLCBkdi5ieXRlT2Zmc2V0LCBkdi5ieXRlTGVuZ3RoKTtcbiAgICAgICAgZHZVOC5zZXQoYmlnSW50VG9GaXhlZEJ5dGVBcnJheShyc2FLZXkubiwgTU9EVUxVU19TSVpFKS5yZXZlcnNlKCksIDIgKiBXT1JEX1NJWkUpO1xuICAgICAgICBkdlU4LnNldChiaWdJbnRUb0ZpeGVkQnl0ZUFycmF5KHJyLCBNT0RVTFVTX1NJWkUpLnJldmVyc2UoKSwgMiAqIFdPUkRfU0laRSArIE1PRFVMVVNfU0laRSk7XG4gICAgICAgIGR2LnNldFVpbnQzMigyICogV09SRF9TSVpFICsgMiAqIE1PRFVMVVNfU0laRSwgcnNhS2V5LmUsIHRydWUpO1xuICAgICAgICByZXR1cm4gKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NEVuY29kZSkoZHZVOCkgKyAnIHVpLnBlcmZldHRvLmRldic7XG4gICAgfVxuICAgIHNlcmlhbGl6ZUtleSgpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuandrUHJpdmF0ZSk7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJLZXkgPSBBZGJLZXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiS2V5TWFuYWdlciA9IGV4cG9ydHMubWF5YmVTdG9yZUtleSA9IHZvaWQgMDtcbmNvbnN0IGFkYl9hdXRoXzEgPSByZXF1aXJlKFwiLi9hZGJfYXV0aFwiKTtcbmZ1bmN0aW9uIGlzUGFzc3dvcmRDcmVkZW50aWFsKGNyZWQpIHtcbiAgICByZXR1cm4gY3JlZCAhPT0gbnVsbCAmJiBjcmVkLnR5cGUgPT09ICdwYXNzd29yZCc7XG59XG5mdW5jdGlvbiBoYXNQYXNzd29yZENyZWRlbnRpYWwoKSB7XG4gICAgcmV0dXJuICdQYXNzd29yZENyZWRlbnRpYWwnIGluIHdpbmRvdztcbn1cbi8vIGhvdyBsb25nIHdlIHdpbGwgc3RvcmUgdGhlIGtleSBpbiBtZW1vcnlcbmNvbnN0IEtFWV9JTl9NRU1PUllfVElNRU9VVCA9IDEwMDAgKiA2MCAqIDMwOyAvLyAzMCBtaW51dGVzXG4vLyBVcGRhdGUgY3JlZGVudGlhbCBzdG9yZSB3aXRoIHRoZSBnaXZlbiBrZXkuXG5hc3luYyBmdW5jdGlvbiBtYXliZVN0b3JlS2V5KGtleSkge1xuICAgIGlmICghaGFzUGFzc3dvcmRDcmVkZW50aWFsKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjcmVkZW50aWFsID0gbmV3IFBhc3N3b3JkQ3JlZGVudGlhbCh7XG4gICAgICAgIGlkOiAnd2VidXNiLWFkYi1rZXknLFxuICAgICAgICBwYXNzd29yZDoga2V5LnNlcmlhbGl6ZUtleSgpLFxuICAgICAgICBuYW1lOiAnV2ViVVNCIEFEQiBLZXknLFxuICAgICAgICBpY29uVVJMOiAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9mYXZpY29uLmljbydcbiAgICB9KTtcbiAgICAvLyBUaGUgJ1NhdmUgcGFzc3dvcmQ/JyBDaHJvbWUgZGlhbG9ndWUgb25seSBhcHBlYXJzIGlmIHRoZSBrZXkgaXNcbiAgICAvLyBub3QgYWxyZWFkeSBzdG9yZWQgaW4gQ2hyb21lLlxuICAgIGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5zdG9yZShjcmVkZW50aWFsKTtcbiAgICAvLyAncHJldmVudFNpbGVudEFjY2VzcycgZ3VhcmFudGVlcyB0aGUgdXNlciBpcyBhbHdheXMgbm90aWZpZWQgd2hlblxuICAgIC8vIGNyZWRlbnRpYWxzIGFyZSBhY2Nlc3NlZC4gU29tZXRpbWVzIHRoZSB1c2VyIGlzIGFza2VkIHRvIGNsaWNrIGEgYnV0dG9uXG4gICAgLy8gYW5kIG90aGVyIHRpbWVzIG9ubHkgYSBub3RpZmljYXRpb24gaXMgc2hvd24gdGVtcG9yYXJpbHkuXG4gICAgYXdhaXQgbmF2aWdhdG9yLmNyZWRlbnRpYWxzLnByZXZlbnRTaWxlbnRBY2Nlc3MoKTtcbn1cbmV4cG9ydHMubWF5YmVTdG9yZUtleSA9IG1heWJlU3RvcmVLZXk7XG5jbGFzcyBBZGJLZXlNYW5hZ2VyIHtcbiAgICAvLyBGaW5kcyBhIGtleSwgYnkgcHJpb3JpdHk6XG4gICAgLy8gLSBsb29raW5nIGluIG1lbW9yeSAoaS5lLiB0aGlzLmtleSlcbiAgICAvLyAtIGxvb2tpbmcgaW4gdGhlIGNyZWRlbnRpYWwgc3RvcmVcbiAgICAvLyAtIGFuZCBmaW5hbGx5IGNyZWF0aW5nIG9uZSBmcm9tIHNjcmF0Y2ggaWYgbmVlZGVkXG4gICAgYXN5bmMgZ2V0S2V5KCkge1xuICAgICAgICAvLyAxLiBJZiB3ZSBoYXZlIGEgcHJpdmF0ZSBrZXkgaW4gbWVtb3J5LCB3ZSByZXR1cm4gaXQuXG4gICAgICAgIGlmICh0aGlzLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5O1xuICAgICAgICB9XG4gICAgICAgIC8vIDIuIFdlIHRyeSB0byBnZXQgdGhlIHByaXZhdGUga2V5IGZyb20gdGhlIGJyb3dzZXIuXG4gICAgICAgIC8vIFRoZSBtZWRpYXRpb24gaXMgc2V0IGFzICdvcHRpb25hbCcsIGJlY2F1c2Ugd2UgdXNlXG4gICAgICAgIC8vICdwcmV2ZW50U2lsZW50QWNjZXNzJywgd2hpY2ggc29tZXRpbWVzIHJlcXVlc3RzIHRoZSB1c2VyIHRvIGNsaWNrXG4gICAgICAgIC8vIG9uIGEgYnV0dG9uIHRvIGFsbG93IHRoZSBhdXRoLCBidXQgc29tZXRpbWVzIG9ubHkgc2hvd3MgYVxuICAgICAgICAvLyBub3RpZmljYXRpb24gYW5kIGRvZXMgbm90IHJlcXVpcmUgdGhlIHVzZXIgdG8gY2xpY2sgb24gYW55dGhpbmcuXG4gICAgICAgIC8vIElmIHdlIGhhZCBzZXQgbWVkaWF0aW9uIHRvICdyZXF1aXJlZCcsIHRoZSB1c2VyIHdvdWxkIGhhdmUgYmVlblxuICAgICAgICAvLyBhc2tlZCB0byBjbGljayBvbiBhIGJ1dHRvbiBldmVyeSB0aW1lLlxuICAgICAgICBpZiAoaGFzUGFzc3dvcmRDcmVkZW50aWFsKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVkaWF0aW9uOiAnb3B0aW9uYWwnLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBhd2FpdCBuYXZpZ2F0b3IuY3JlZGVudGlhbHMuZ2V0KG9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKGlzUGFzc3dvcmRDcmVkZW50aWFsKGNyZWRlbnRpYWwpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzaWduS2V5KGFkYl9hdXRoXzEuQWRiS2V5LkRlc2VyaWFsaXplS2V5KGNyZWRlbnRpYWwucGFzc3dvcmQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyAzLiBXZSBnZW5lcmF0ZSBhIG5ldyBrZXkgcGFpci5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXNzaWduS2V5KGF3YWl0IGFkYl9hdXRoXzEuQWRiS2V5LkdlbmVyYXRlTmV3S2V5UGFpcigpKTtcbiAgICB9XG4gICAgLy8gQXNzaWducyB0aGUga2V5IGEgbmV3IHZhbHVlLCBzZXRzIGEgdGltZW91dCBmb3Igc3RvcmluZyB0aGUga2V5IGluIG1lbW9yeVxuICAgIC8vIGFuZCB0aGVuIHJldHVybnMgdGhlIG5ldyBrZXkuXG4gICAgYXNzaWduS2V5KGtleSkge1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgaWYgKHRoaXMua2V5SW5NZW1vcnlUaW1lcklkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5rZXlJbk1lbW9yeVRpbWVySWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua2V5SW5NZW1vcnlUaW1lcklkID1cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5rZXkgPSB1bmRlZmluZWQsIEtFWV9JTl9NRU1PUllfVElNRU9VVCk7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJLZXlNYW5hZ2VyID0gQWRiS2V5TWFuYWdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZWNvcmRpbmdFcnJvciA9IGV4cG9ydHMuc2hvd1JlY29yZGluZ01vZGFsID0gZXhwb3J0cy53cmFwUmVjb3JkaW5nRXJyb3IgPSB2b2lkIDA7XG5jb25zdCBlcnJvcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2Vycm9yc1wiKTtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX3V0aWxzXCIpO1xuLy8gVGhlIHBhdHRlcm4gZm9yIGhhbmRsaW5nIHJlY29yZGluZyBlcnJvciBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIG5lc3RpbmcgaW5cbi8vIGNhc2Ugb2YgZXJyb3JzOlxuLy8gQS4gd3JhcFJlY29yZGluZ0Vycm9yIC0+IHdyYXBzIGEgcHJvbWlzZVxuLy8gQi4gb25GYWlsdXJlIC0+IGhhcyB1c2VyIGRlZmluZWQgbG9naWMgYW5kIGNhbGxzIHNob3dSZWNvcmRpbmdNb2RhbFxuLy8gQy4gc2hvd1JlY29yZGluZ01vZGFsIC0+IHNob3dzIFVYIGZvciBhIGdpdmVuIGVycm9yOyB0aGlzIGlzIG5vdCBjYWxsZWRcbi8vICAgIGRpcmVjdGx5IGJ5IHdyYXBSZWNvcmRpbmdFcnJvciwgYmVjYXVzZSB3ZSB3YW50IHRoZSBjYWxsZXIgKHN1Y2ggYXMgdGhlXG4vLyAgICBVSSkgdG8gZGljdGF0ZSB0aGUgVVhcbi8vIFRoaXMgbWV0aG9kIHRha2VzIGEgcHJvbWlzZSBhbmQgYSBjYWxsYmFjayB0byBiZSBleGVjdXRlIGluIGNhc2UgdGhlIHByb21pc2Vcbi8vIGZhaWxzLiBJdCB0aGVuIGF3YWl0cyB0aGUgcHJvbWlzZSBhbmQgZXhlY3V0ZXMgdGhlIGNhbGxiYWNrIGluIGNhc2Ugb2Zcbi8vIGZhaWx1cmUuIEluIHRoZSByZWNvcmRpbmcgY29kZSBpdCBpcyB1c2VkIHRvIHdyYXA6XG4vLyAxLiBBY2Vzc2luZyB0aGUgV2ViVVNCIEFQSS5cbi8vIDIuIE1ldGhvZHMgcmV0dXJuaW5nIHByb21pc2VzIHdoaWNoIGNhbiBiZSByZWplY3RlZC4gRm9yIGluc3RhbmNlOlxuLy8gYSkgV2hlbiB0aGUgdXNlciBjbGlja3MgJ0FkZCBhIG5ldyBkZXZpY2UnIGJ1dCB0aGVuIGRvZXNuJ3Qgc2VsZWN0IGEgdmFsaWRcbi8vICAgIGRldmljZS5cbi8vIGIpIFdoZW4gdGhlIHVzZXIgc3RhcnRzIGEgdHJhY2luZyBzZXNzaW9uLCBidXQgY2FuY2VscyBpdCBiZWZvcmUgdGhleVxuLy8gICAgYXV0aG9yaXplIHRoZSBzZXNzaW9uIG9uIHRoZSBkZXZpY2UuXG5hc3luYyBmdW5jdGlvbiB3cmFwUmVjb3JkaW5nRXJyb3IocHJvbWlzZSwgb25GYWlsdXJlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIFNvbWV0aW1lcyB0aGUgbWVzc2FnZSBpcyB3cmFwcGVkIGluIGFuIEVycm9yIG9iamVjdCwgc29tZXRpbWVzIG5vdCwgc29cbiAgICAgICAgLy8gd2UgbWFrZSBzdXJlIHdlIHRyYW5zZm9ybSBpdCBpbnRvIGEgc3RyaW5nLlxuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAoMCwgZXJyb3JzXzEuZ2V0RXJyb3JNZXNzYWdlKShlKTtcbiAgICAgICAgb25GYWlsdXJlKGVycm9yTWVzc2FnZSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuZXhwb3J0cy53cmFwUmVjb3JkaW5nRXJyb3IgPSB3cmFwUmVjb3JkaW5nRXJyb3I7XG5mdW5jdGlvbiBzaG93QWxsb3dVU0JEZWJ1Z2dpbmcoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dDb25uZWN0aW9uTG9zdEVycm9yKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93RXh0ZW5zaW9uTm90SW5zdGFsbGVkKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93RmFpbGVkVG9QdXNoQmluYXJ5KHN0cikgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93SXNzdWVQYXJzaW5nVGhlVHJhY2VkUmVzcG9uc2Uoc3RyKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dOb0RldmljZVNlbGVjdGVkKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93V2Vic29ja2V0Q29ubmVjdGlvbklzc3VlKHN0cikgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93V2ViVVNCRXJyb3JWMigpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuLy8gU2hvd3MgYSBtb2RhbCBmb3IgZXZlcnkga25vd24gdHlwZSBvZiBlcnJvciB3aGljaCBjYW4gYXJpc2UgZHVyaW5nIHJlY29yZGluZy5cbi8vIEluIHRoaXMgd2F5LCBlcnJvcnMgb2NjdXJpbmcgYXQgZGlmZmVyZW50IGxldmVscyBvZiB0aGUgcmVjb3JkaW5nIHByb2Nlc3Ncbi8vIGNhbiBiZSBoYW5kbGVkIGluIGEgY2VudHJhbCBsb2NhdGlvbi5cbmZ1bmN0aW9uIHNob3dSZWNvcmRpbmdNb2RhbChtZXNzYWdlKSB7XG4gICAgaWYgKFtcbiAgICAgICAgJ1VuYWJsZSB0byBjbGFpbSBpbnRlcmZhY2UuJyxcbiAgICAgICAgJ1RoZSBzcGVjaWZpZWQgZW5kcG9pbnQgaXMgbm90IHBhcnQgb2YgYSBjbGFpbWVkIGFuZCBzZWxlY3RlZCAnICtcbiAgICAgICAgICAgICdhbHRlcm5hdGUgaW50ZXJmYWNlLicsXG4gICAgICAgIC8vIHRocm93biB3aGVuIGNhbGxpbmcgdGhlICdyZXNldCcgbWV0aG9kIG9uIGEgV2ViVVNCIGRldmljZS5cbiAgICAgICAgJ1VuYWJsZSB0byByZXNldCB0aGUgZGV2aWNlLicsXG4gICAgXS5zb21lKChwYXJ0T2ZNZXNzYWdlKSA9PiBtZXNzYWdlLmluY2x1ZGVzKHBhcnRPZk1lc3NhZ2UpKSkge1xuICAgICAgICBzaG93V2ViVVNCRXJyb3JWMigpO1xuICAgIH1cbiAgICBlbHNlIGlmIChbXG4gICAgICAgICdBIHRyYW5zZmVyIGVycm9yIGhhcyBvY2N1cnJlZC4nLFxuICAgICAgICAnVGhlIGRldmljZSB3YXMgZGlzY29ubmVjdGVkLicsXG4gICAgICAgICdUaGUgdHJhbnNmZXIgd2FzIGNhbmNlbGxlZC4nLFxuICAgIF0uc29tZSgocGFydE9mTWVzc2FnZSkgPT4gbWVzc2FnZS5pbmNsdWRlcyhwYXJ0T2ZNZXNzYWdlKSkgfHxcbiAgICAgICAgaXNEZXZpY2VEaXNjb25uZWN0ZWRFcnJvcihtZXNzYWdlKSkge1xuICAgICAgICBzaG93Q29ubmVjdGlvbkxvc3RFcnJvcigpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXNzYWdlID09PSByZWNvcmRpbmdfdXRpbHNfMS5BTExPV19VU0JfREVCVUdHSU5HKSB7XG4gICAgICAgIHNob3dBbGxvd1VTQkRlYnVnZ2luZygpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc01lc3NhZ2VDb21wb3NlZE9mKG1lc3NhZ2UsIFtyZWNvcmRpbmdfdXRpbHNfMS5CSU5BUllfUFVTSF9GQUlMVVJFLCByZWNvcmRpbmdfdXRpbHNfMS5CSU5BUllfUFVTSF9VTktOT1dOX1JFU1BPTlNFXSkpIHtcbiAgICAgICAgc2hvd0ZhaWxlZFRvUHVzaEJpbmFyeShtZXNzYWdlLnN1YnN0cmluZyhtZXNzYWdlLmluZGV4T2YoJzonKSArIDEpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gcmVjb3JkaW5nX3V0aWxzXzEuTk9fREVWSUNFX1NFTEVDVEVEKSB7XG4gICAgICAgIHNob3dOb0RldmljZVNlbGVjdGVkKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHJlY29yZGluZ191dGlsc18xLldFQlNPQ0tFVF9VTkFCTEVfVE9fQ09OTkVDVCA9PT0gbWVzc2FnZSkge1xuICAgICAgICBzaG93V2Vic29ja2V0Q29ubmVjdGlvbklzc3VlKG1lc3NhZ2UpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXNzYWdlID09PSByZWNvcmRpbmdfdXRpbHNfMS5FWFRFTlNJT05fTk9UX0lOU1RBTExFRCkge1xuICAgICAgICBzaG93RXh0ZW5zaW9uTm90SW5zdGFsbGVkKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzTWVzc2FnZUNvbXBvc2VkT2YobWVzc2FnZSwgW1xuICAgICAgICByZWNvcmRpbmdfdXRpbHNfMS5QQVJTSU5HX1VOS05XT05fUkVRVUVTVF9JRCxcbiAgICAgICAgcmVjb3JkaW5nX3V0aWxzXzEuUEFSU0lOR19VTkFCTEVfVE9fREVDT0RFX01FVEhPRCxcbiAgICAgICAgcmVjb3JkaW5nX3V0aWxzXzEuUEFSU0lOR19VTlJFQ09HTklaRURfUE9SVCxcbiAgICAgICAgcmVjb3JkaW5nX3V0aWxzXzEuUEFSU0lOR19VTlJFQ09HTklaRURfTUVTU0FHRSxcbiAgICBdKSkge1xuICAgICAgICBzaG93SXNzdWVQYXJzaW5nVGhlVHJhY2VkUmVzcG9uc2UobWVzc2FnZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZX1gKTtcbiAgICB9XG59XG5leHBvcnRzLnNob3dSZWNvcmRpbmdNb2RhbCA9IHNob3dSZWNvcmRpbmdNb2RhbDtcbmZ1bmN0aW9uIGlzRGV2aWNlRGlzY29ubmVjdGVkRXJyb3IobWVzc2FnZSkge1xuICAgIHJldHVybiBtZXNzYWdlLmluY2x1ZGVzKCdEZXZpY2Ugd2l0aCBzZXJpYWwnKSAmJlxuICAgICAgICBtZXNzYWdlLmluY2x1ZGVzKCd3YXMgZGlzY29ubmVjdGVkLicpO1xufVxuZnVuY3Rpb24gaXNNZXNzYWdlQ29tcG9zZWRPZihtZXNzYWdlLCBpc3N1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGlzc3VlIG9mIGlzc3Vlcykge1xuICAgICAgICBpZiAobWVzc2FnZS5pbmNsdWRlcyhpc3N1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbi8vIEV4Y2VwdGlvbiB0aHJvd24gYnkgdGhlIFJlY29yZGluZyBsb2dpYy5cbmNsYXNzIFJlY29yZGluZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuZXhwb3J0cy5SZWNvcmRpbmdFcnJvciA9IFJlY29yZGluZ0Vycm9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBBUlNJTkdfVU5SRUNPR05JWkVEX01FU1NBR0UgPSBleHBvcnRzLlBBUlNJTkdfVU5SRUNPR05JWkVEX1BPUlQgPSBleHBvcnRzLlBBUlNJTkdfVU5BQkxFX1RPX0RFQ09ERV9NRVRIT0QgPSBleHBvcnRzLlBBUlNJTkdfVU5LTldPTl9SRVFVRVNUX0lEID0gZXhwb3J0cy5SRUNPUkRJTkdfSU5fUFJPR1JFU1MgPSBleHBvcnRzLkJVRkZFUl9VU0FHRV9JTkNPUlJFQ1RfRk9STUFUID0gZXhwb3J0cy5CVUZGRVJfVVNBR0VfTk9UX0FDQ0VTU0lCTEUgPSBleHBvcnRzLk1BTEZPUk1FRF9FWFRFTlNJT05fTUVTU0FHRSA9IGV4cG9ydHMuRVhURU5TSU9OX05PVF9JTlNUQUxMRUQgPSBleHBvcnRzLkVYVEVOU0lPTl9OQU1FID0gZXhwb3J0cy5FWFRFTlNJT05fVVJMID0gZXhwb3J0cy5FWFRFTlNJT05fSUQgPSBleHBvcnRzLmZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludCA9IGV4cG9ydHMuQURCX0RFVklDRV9GSUxURVIgPSBleHBvcnRzLk5PX0RFVklDRV9TRUxFQ1RFRCA9IGV4cG9ydHMuQ1VTVE9NX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSCA9IGV4cG9ydHMuREVGQVVMVF9UUkFDRURfQ09OU1VNRVJfU09DS0VUX1BBVEggPSBleHBvcnRzLkFMTE9XX1VTQl9ERUJVR0dJTkcgPSBleHBvcnRzLlRSQUNFQk9YX0ZFVENIX1RJTUVPVVQgPSBleHBvcnRzLlRSQUNFQk9YX0RFVklDRV9QQVRIID0gZXhwb3J0cy5CSU5BUllfUFVTSF9VTktOT1dOX1JFU1BPTlNFID0gZXhwb3J0cy5CSU5BUllfUFVTSF9GQUlMVVJFID0gZXhwb3J0cy5pc0NyT1MgPSBleHBvcnRzLmlzTGludXggPSBleHBvcnRzLmlzTWFjT3MgPSBleHBvcnRzLmJ1aWxkQWJkV2Vic29ja2V0Q29tbWFuZCA9IGV4cG9ydHMuV0VCU09DS0VUX0NMT1NFRF9BQk5PUk1BTExZX0NPREUgPSBleHBvcnRzLldFQlNPQ0tFVF9VTkFCTEVfVE9fQ09OTkVDVCA9IHZvaWQgMDtcbi8vIEJlZ2luIFdlYnNvY2tldCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0cy5XRUJTT0NLRVRfVU5BQkxFX1RPX0NPTk5FQ1QgPSAnVW5hYmxlIHRvIGNvbm5lY3QgdG8gZGV2aWNlIHZpYSB3ZWJzb2NrZXQuJztcbi8vIGh0dHBzOi8vd3d3LnJmYy1lZGl0b3Iub3JnL3JmYy9yZmM2NDU1I3NlY3Rpb24tNy40LjFcbmV4cG9ydHMuV0VCU09DS0VUX0NMT1NFRF9BQk5PUk1BTExZX0NPREUgPSAxMDA2O1xuLy8gVGhlIG1lc3NhZ2VzIHJlYWQgYnkgdGhlIGFkYiBzZXJ2ZXIgaGF2ZSB0aGVpciBsZW5ndGggcHJlcGVuZGVkIGluIGhleC5cbi8vIFRoaXMgbWV0aG9kIGFkZHMgdGhlIGxlbmd0aCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBtZXNzYWdlLlxuLy8gRXhhbXBsZTogJ2hvc3Q6dHJhY2stZGV2aWNlcycgLT4gJzAwMTJob3N0OnRyYWNrLWRldmljZXMnXG4vLyBnby9jb2Rlc2VhcmNoL2Fvc3AtYW5kcm9pZDExL3N5c3RlbS9jb3JlL2FkYi9TRVJWSUNFUy5UWFRcbmZ1bmN0aW9uIGJ1aWxkQWJkV2Vic29ja2V0Q29tbWFuZChjbWQpIHtcbiAgICBjb25zdCBoZHIgPSBjbWQubGVuZ3RoLnRvU3RyaW5nKDE2KS5wYWRTdGFydCg0LCAnMCcpO1xuICAgIHJldHVybiBoZHIgKyBjbWQ7XG59XG5leHBvcnRzLmJ1aWxkQWJkV2Vic29ja2V0Q29tbWFuZCA9IGJ1aWxkQWJkV2Vic29ja2V0Q29tbWFuZDtcbi8vIFNhbXBsZSB1c2VyIGFnZW50IGZvciBDaHJvbWUgb24gTWFjIE9TOlxuLy8gJ01vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNlxuLy8gKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTA0LjAuMC4wIFNhZmFyaS81MzcuMzYnXG5mdW5jdGlvbiBpc01hY09zKHVzZXJBZ2VudCkge1xuICAgIHJldHVybiB1c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnIG1hYyBvcyAnKTtcbn1cbmV4cG9ydHMuaXNNYWNPcyA9IGlzTWFjT3M7XG4vLyBTYW1wbGUgdXNlciBhZ2VudCBmb3IgQ2hyb21lIG9uIExpbnV4OlxuLy8gTW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKVxuLy8gQ2hyb21lLzEwNS4wLjAuMCBTYWZhcmkvNTM3LjM2XG5mdW5jdGlvbiBpc0xpbnV4KHVzZXJBZ2VudCkge1xuICAgIHJldHVybiB1c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnIGxpbnV4ICcpO1xufVxuZXhwb3J0cy5pc0xpbnV4ID0gaXNMaW51eDtcbi8vIFNhbXBsZSB1c2VyIGFnZW50IGZvciBDaHJvbWUgb24gQ2hyb21lIE9TOlxuLy8gXCJNb3ppbGxhLzUuMCAoWDExOyBDck9TIHg4Nl82NCAxNDgxNi45OS4wKSBBcHBsZVdlYktpdC81MzcuMzZcbi8vIChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMy4wLjUwNjAuMTE0IFNhZmFyaS81MzcuMzZcIlxuLy8gVGhpcyBjb25kaXRpb24gaXMgd2lkZXIsIGluIHRoZSB1bmxpa2VseSBwb3NzaWJpbGl0eSBvZiBkaWZmZXJlbnQgY2FzaW5nLFxuZnVuY3Rpb24gaXNDck9TKHVzZXJBZ2VudCkge1xuICAgIHJldHVybiB1c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnIGNyb3MgJyk7XG59XG5leHBvcnRzLmlzQ3JPUyA9IGlzQ3JPUztcbi8vIEVuZCBXZWJzb2NrZXQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQmVnaW4gQWRiIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnRzLkJJTkFSWV9QVVNIX0ZBSUxVUkUgPSAnQmluYXJ5UHVzaEZhaWx1cmUnO1xuZXhwb3J0cy5CSU5BUllfUFVTSF9VTktOT1dOX1JFU1BPTlNFID0gJ0JpbmFyeVB1c2hVbmtub3duUmVzcG9uc2UnO1xuLy8gSW4gY2FzZSB0aGUgZGV2aWNlIGRvZXNuJ3QgaGF2ZSB0aGUgdHJhY2Vib3gsIHdlIHVwbG9hZCB0aGUgbGF0ZXN0IHZlcnNpb25cbi8vIHRvIHRoaXMgcGF0aC5cbmV4cG9ydHMuVFJBQ0VCT1hfREVWSUNFX1BBVEggPSAnL2RhdGEvbG9jYWwvdG1wL3RyYWNlYm94Jztcbi8vIEV4cGVyaW1lbnRhbGx5LCB0aGlzIHRha2VzIDkwMG1zIG9uIHRoZSBmaXJzdCBmZXRjaCBhbmQgMjAtMzBtcyBhZnRlclxuLy8gYmVjYXVzZSBvZiBjYWNoaW5nLlxuZXhwb3J0cy5UUkFDRUJPWF9GRVRDSF9USU1FT1VUID0gMzAwMDA7XG4vLyBNZXNzYWdlIHNob3duIHRvIHRoZSB1c2VyIHdoZW4gdGhleSBuZWVkIHRvIGFsbG93IGF1dGhlbnRpY2F0aW9uIG9uIHRoZVxuLy8gZGV2aWNlIGluIG9yZGVyIHRvIGNvbm5lY3QuXG5leHBvcnRzLkFMTE9XX1VTQl9ERUJVR0dJTkcgPSAnUGxlYXNlIGFsbG93IFVTQiBkZWJ1Z2dpbmcgb24gZGV2aWNlIGFuZCB0cnkgYWdhaW4uJztcbi8vIElmIHRoZSBBbmRyb2lkIGRldmljZSBoYXMgdGhlIHRyYWNpbmcgc2VydmljZSBvbiBpdCAoZnJvbSBBUEkgdmVyc2lvbiAyOSksXG4vLyB0aGVuIHdlIGNhbiBjb25uZWN0IHRvIHRoaXMgY29uc3VtZXIgc29ja2V0LlxuZXhwb3J0cy5ERUZBVUxUX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSCA9ICdsb2NhbGZpbGVzeXN0ZW06L2Rldi9zb2NrZXQvdHJhY2VkX2NvbnN1bWVyJztcbi8vIElmIHRoZSBBbmRyb2lkIGRldmljZSBkb2VzIG5vdCBoYXZlIHRoZSB0cmFjaW5nIHNlcnZpY2Ugb24gaXQgKGJlZm9yZSBBUElcbi8vIHZlcnNpb24gMjkpLCB3ZSB3aWxsIGhhdmUgdG8gcHVzaCB0aGUgdHJhY2Vib3ggb24gdGhlIGRldmljZS4gVGhlbiwgd2Vcbi8vIGNhbiBjb25uZWN0IHRvIHRoaXMgY29uc3VtZXIgc29ja2V0ICh1c2luZyBpdCBkb2VzIG5vdCByZXF1aXJlIHN5c3RlbSBhZG1pblxuLy8gcHJpdmlsZWdlcykuXG5leHBvcnRzLkNVU1RPTV9UUkFDRURfQ09OU1VNRVJfU09DS0VUX1BBVEggPSAnbG9jYWxhYnN0cmFjdDp0cmFjZWRfY29uc3VtZXInO1xuLy8gRW5kIEFkYiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQmVnaW4gV2VidXNiIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnRzLk5PX0RFVklDRV9TRUxFQ1RFRCA9ICdObyBkZXZpY2Ugc2VsZWN0ZWQuJztcbmV4cG9ydHMuQURCX0RFVklDRV9GSUxURVIgPSB7XG4gICAgY2xhc3NDb2RlOiAyNTUsIC8vIFVTQiB2ZW5kb3Igc3BlY2lmaWMgY29kZVxuICAgIHN1YmNsYXNzQ29kZTogNjYsIC8vIEFuZHJvaWQgdmVuZG9yIHNwZWNpZmljIHN1YmNsYXNzXG4gICAgcHJvdG9jb2xDb2RlOiAxLCAvLyBBZGIgcHJvdG9jb2xcbn07XG5mdW5jdGlvbiBmaW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQoZGV2aWNlKSB7XG4gICAgY29uc3QgYWRiRGV2aWNlRmlsdGVyID0gZXhwb3J0cy5BREJfREVWSUNFX0ZJTFRFUjtcbiAgICBmb3IgKGNvbnN0IGNvbmZpZyBvZiBkZXZpY2UuY29uZmlndXJhdGlvbnMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpbnRlcmZhY2VfIG9mIGNvbmZpZy5pbnRlcmZhY2VzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFsdCBvZiBpbnRlcmZhY2VfLmFsdGVybmF0ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWx0LmludGVyZmFjZUNsYXNzID09PSBhZGJEZXZpY2VGaWx0ZXIuY2xhc3NDb2RlICYmXG4gICAgICAgICAgICAgICAgICAgIGFsdC5pbnRlcmZhY2VTdWJjbGFzcyA9PT0gYWRiRGV2aWNlRmlsdGVyLnN1YmNsYXNzQ29kZSAmJlxuICAgICAgICAgICAgICAgICAgICBhbHQuaW50ZXJmYWNlUHJvdG9jb2wgPT09IGFkYkRldmljZUZpbHRlci5wcm90b2NvbENvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25WYWx1ZTogY29uZmlnLmNvbmZpZ3VyYXRpb25WYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzYkludGVyZmFjZU51bWJlcjogaW50ZXJmYWNlXy5pbnRlcmZhY2VOdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludHM6IGFsdC5lbmRwb2ludHMsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSAvLyBpZiAoYWx0ZXJuYXRlKVxuICAgICAgICAgICAgfSAvLyBmb3IgKGludGVyZmFjZS5hbHRlcm5hdGVzKVxuICAgICAgICB9IC8vIGZvciAoY29uZmlndXJhdGlvbi5pbnRlcmZhY2VzKVxuICAgIH0gLy8gZm9yIChjb25maWd1cmF0aW9ucylcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5maW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQgPSBmaW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQ7XG4vLyBFbmQgV2VidXNiIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCZWdpbiBDaHJvbWUgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuRVhURU5TSU9OX0lEID0gJ2xmbWtwaGZwZGJqaWpocG9tZ2VjZmlraGZvaGFvaW5lJztcbmV4cG9ydHMuRVhURU5TSU9OX1VSTCA9IGBodHRwczovL2Nocm9tZS5nb29nbGUuY29tL3dlYnN0b3JlL2RldGFpbC9wZXJmZXR0by11aS8ke2V4cG9ydHMuRVhURU5TSU9OX0lEfWA7XG5leHBvcnRzLkVYVEVOU0lPTl9OQU1FID0gJ0Nocm9tZSBleHRlbnNpb24nO1xuZXhwb3J0cy5FWFRFTlNJT05fTk9UX0lOU1RBTExFRCA9IGBUbyB0cmFjZSBDaHJvbWUgZnJvbSB0aGUgUGVyZmV0dG8gVUksIHlvdSBuZWVkIHRvIGluc3RhbGwgb3VyXG4gICAgJHtleHBvcnRzLkVYVEVOU0lPTl9VUkx9IGFuZCB0aGVuIHJlbG9hZCB0aGlzIHBhZ2UuYDtcbmV4cG9ydHMuTUFMRk9STUVEX0VYVEVOU0lPTl9NRVNTQUdFID0gJ01hbGZvcm1lZCBleHRlbnNpb24gbWVzc2FnZS4nO1xuZXhwb3J0cy5CVUZGRVJfVVNBR0VfTk9UX0FDQ0VTU0lCTEUgPSAnQnVmZmVyIHVzYWdlIG5vdCBhY2Nlc3NpYmxlJztcbmV4cG9ydHMuQlVGRkVSX1VTQUdFX0lOQ09SUkVDVF9GT1JNQVQgPSAnVGhlIGJ1ZmZlciB1c2FnZSBkYXRhIGhhcyBhbSBpbmNvcnJlY3QgZm9ybWF0Jztcbi8vIEVuZCBDaHJvbWUgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQmVnaW4gVHJhY2VkIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuUkVDT1JESU5HX0lOX1BST0dSRVNTID0gJ1JlY29yZGluZyBpbiBwcm9ncmVzcyc7XG5leHBvcnRzLlBBUlNJTkdfVU5LTldPTl9SRVFVRVNUX0lEID0gJ1Vua25vd24gcmVxdWVzdCBpZCc7XG5leHBvcnRzLlBBUlNJTkdfVU5BQkxFX1RPX0RFQ09ERV9NRVRIT0QgPSAnVW5hYmxlIHRvIGRlY29kZSBtZXRob2QnO1xuZXhwb3J0cy5QQVJTSU5HX1VOUkVDT0dOSVpFRF9QT1JUID0gJ1VucmVjb2duaXplZCBjb25zdW1lciBwb3J0IHJlc3BvbnNlJztcbmV4cG9ydHMuUEFSU0lOR19VTlJFQ09HTklaRURfTUVTU0FHRSA9ICdVbnJlY29nbml6ZWQgZnJhbWUgbWVzc2FnZSc7XG4vLyBFbmQgVHJhY2VkIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQW5kcm9pZFdlYnVzYlRhcmdldEZhY3RvcnkgPSBleHBvcnRzLkFORFJPSURfV0VCVVNCX1RBUkdFVF9GQUNUT1JZID0gdm9pZCAwO1xuY29uc3QgZXJyb3JzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9lcnJvcnNcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3QgYWRiX2tleV9tYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi4vYXV0aC9hZGJfa2V5X21hbmFnZXJcIik7XG5jb25zdCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMSA9IHJlcXVpcmUoXCIuLi9yZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdcIik7XG5jb25zdCByZWNvcmRpbmdfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi9yZWNvcmRpbmdfdXRpbHNcIik7XG5jb25zdCBhbmRyb2lkX3dlYnVzYl90YXJnZXRfMSA9IHJlcXVpcmUoXCIuLi90YXJnZXRzL2FuZHJvaWRfd2VidXNiX3RhcmdldFwiKTtcbmV4cG9ydHMuQU5EUk9JRF9XRUJVU0JfVEFSR0VUX0ZBQ1RPUlkgPSAnQW5kcm9pZFdlYnVzYlRhcmdldEZhY3RvcnknO1xuY29uc3QgU0VSSUFMX05VTUJFUl9JU1NVRSA9ICdhbiBpbnZhbGlkIHNlcmlhbCBudW1iZXInO1xuY29uc3QgQURCX0lOVEVSRkFDRV9JU1NVRSA9ICdhbiBpbmNvbXBhdGlibGUgYWRiIGludGVyZmFjZSc7XG5mdW5jdGlvbiBjcmVhdGVEZXZpY2VFcnJvck1lc3NhZ2UoZGV2aWNlLCBpc3N1ZSkge1xuICAgIGNvbnN0IHByb2R1Y3ROYW1lID0gZGV2aWNlLnByb2R1Y3ROYW1lO1xuICAgIHJldHVybiBgVVNCIGRldmljZSR7cHJvZHVjdE5hbWUgPyAnICcgKyBwcm9kdWN0TmFtZSA6ICcnfSBoYXMgJHtpc3N1ZX1gO1xufVxuY2xhc3MgQW5kcm9pZFdlYnVzYlRhcmdldEZhY3Rvcnkge1xuICAgIGNvbnN0cnVjdG9yKHVzYikge1xuICAgICAgICB0aGlzLnVzYiA9IHVzYjtcbiAgICAgICAgdGhpcy5raW5kID0gZXhwb3J0cy5BTkRST0lEX1dFQlVTQl9UQVJHRVRfRkFDVE9SWTtcbiAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSA9ICgpID0+IHsgfTtcbiAgICAgICAgdGhpcy5yZWNvcmRpbmdQcm9ibGVtcyA9IFtdO1xuICAgICAgICB0aGlzLnRhcmdldHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIC8vIEFkYktleU1hbmFnZXIgc2hvdWxkIG9ubHkgYmUgaW5zdGFudGlhdGVkIG9uY2UsIHNvIHdlIGNhbiB1c2UgdGhlIHNhbWUga2V5XG4gICAgICAgIC8vIGZvciBhbGwgZGV2aWNlcy5cbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyID0gbmV3IGFkYl9rZXlfbWFuYWdlcl8xLkFkYktleU1hbmFnZXIoKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnQW5kcm9pZCBXZWJVc2InO1xuICAgIH1cbiAgICBsaXN0VGFyZ2V0cygpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy50YXJnZXRzLnZhbHVlcygpKTtcbiAgICB9XG4gICAgbGlzdFJlY29yZGluZ1Byb2JsZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRpbmdQcm9ibGVtcztcbiAgICB9XG4gICAgYXN5bmMgY29ubmVjdE5ld1RhcmdldCgpIHtcbiAgICAgICAgbGV0IGRldmljZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRldmljZSA9IGF3YWl0IHRoaXMudXNiLnJlcXVlc3REZXZpY2UoeyBmaWx0ZXJzOiBbcmVjb3JkaW5nX3V0aWxzXzEuQURCX0RFVklDRV9GSUxURVJdIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoKDAsIGVycm9yc18xLmdldEVycm9yTWVzc2FnZSkoZSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRldmljZVZhbGlkID0gdGhpcy5jaGVja0RldmljZVZhbGlkaXR5KGRldmljZSk7XG4gICAgICAgIGlmICghZGV2aWNlVmFsaWQuaXNWYWxpZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGRldmljZVZhbGlkLmlzc3Vlcy5qb2luKCdcXG4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYW5kcm9pZFRhcmdldCA9IG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfMS5BbmRyb2lkV2VidXNiVGFyZ2V0KGRldmljZSwgdGhpcy5rZXlNYW5hZ2VyLCB0aGlzLm9uVGFyZ2V0Q2hhbmdlKTtcbiAgICAgICAgdGhpcy50YXJnZXRzLnNldCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoZGV2aWNlLnNlcmlhbE51bWJlciksIGFuZHJvaWRUYXJnZXQpO1xuICAgICAgICByZXR1cm4gYW5kcm9pZFRhcmdldDtcbiAgICB9XG4gICAgc2V0T25UYXJnZXRDaGFuZ2Uob25UYXJnZXRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSA9IG9uVGFyZ2V0Q2hhbmdlO1xuICAgIH1cbiAgICBhc3luYyBpbml0KCkge1xuICAgICAgICBsZXQgZGV2aWNlcyA9IFtdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGV2aWNlcyA9IGF3YWl0IHRoaXMudXNiLmdldERldmljZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoXykge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBXZWJVU0Igbm90IGF2YWlsYWJsZSBvciBkaXNhbGxvd2VkIGluIGlmcmFtZS5cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGRldmljZSBvZiBkZXZpY2VzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0RldmljZVZhbGlkaXR5KGRldmljZSkuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0cy5zZXQoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKGRldmljZS5zZXJpYWxOdW1iZXIpLCBuZXcgYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0XzEuQW5kcm9pZFdlYnVzYlRhcmdldChkZXZpY2UsIHRoaXMua2V5TWFuYWdlciwgdGhpcy5vblRhcmdldENoYW5nZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXNiLmFkZEV2ZW50TGlzdGVuZXIoJ2Nvbm5lY3QnLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRGV2aWNlVmFsaWRpdHkoZXYuZGV2aWNlKS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzLnNldCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoZXYuZGV2aWNlLnNlcmlhbE51bWJlciksIG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfMS5BbmRyb2lkV2VidXNiVGFyZ2V0KGV2LmRldmljZSwgdGhpcy5rZXlNYW5hZ2VyLCB0aGlzLm9uVGFyZ2V0Q2hhbmdlKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51c2IuYWRkRXZlbnRMaXN0ZW5lcignZGlzY29ubmVjdCcsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgLy8gV2UgZG9uJ3QgY2hlY2sgZGV2aWNlIHZhbGlkaXR5IHdoZW4gZGlzY29ubmVjdGluZyBiZWNhdXNlIGlmIHRoZSBkZXZpY2VcbiAgICAgICAgICAgIC8vIGlzIGludmFsaWQgd2Ugd291bGQgbm90IGhhdmUgY29ubmVjdGVkIGluIHRoZSBmaXJzdCBwbGFjZS5cbiAgICAgICAgICAgIGNvbnN0IHNlcmlhbE51bWJlciA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShldi5kZXZpY2Uuc2VyaWFsTnVtYmVyKTtcbiAgICAgICAgICAgIGF3YWl0ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLnRhcmdldHMuZ2V0KHNlcmlhbE51bWJlcikpXG4gICAgICAgICAgICAgICAgLmRpc2Nvbm5lY3QoYERldmljZSB3aXRoIHNlcmlhbCAke3NlcmlhbE51bWJlcn0gd2FzIGRpc2Nvbm5lY3RlZC5gKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0cy5kZWxldGUoc2VyaWFsTnVtYmVyKTtcbiAgICAgICAgICAgIHRoaXMub25UYXJnZXRDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNoZWNrRGV2aWNlVmFsaWRpdHkoZGV2aWNlKSB7XG4gICAgICAgIGNvbnN0IGRldmljZVZhbGlkaXR5ID0geyBpc1ZhbGlkOiB0cnVlLCBpc3N1ZXM6IFtdIH07XG4gICAgICAgIGlmICghZGV2aWNlLnNlcmlhbE51bWJlcikge1xuICAgICAgICAgICAgZGV2aWNlVmFsaWRpdHkuaXNzdWVzLnB1c2goY3JlYXRlRGV2aWNlRXJyb3JNZXNzYWdlKGRldmljZSwgU0VSSUFMX05VTUJFUl9JU1NVRSkpO1xuICAgICAgICAgICAgZGV2aWNlVmFsaWRpdHkuaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKDAsIHJlY29yZGluZ191dGlsc18xLmZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludCkoZGV2aWNlKSkge1xuICAgICAgICAgICAgZGV2aWNlVmFsaWRpdHkuaXNzdWVzLnB1c2goY3JlYXRlRGV2aWNlRXJyb3JNZXNzYWdlKGRldmljZSwgQURCX0lOVEVSRkFDRV9JU1NVRSkpO1xuICAgICAgICAgICAgZGV2aWNlVmFsaWRpdHkuaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb3JkaW5nUHJvYmxlbXMucHVzaCguLi5kZXZpY2VWYWxpZGl0eS5pc3N1ZXMpO1xuICAgICAgICByZXR1cm4gZGV2aWNlVmFsaWRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5BbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeSA9IEFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuZHJvaWRUYXJnZXQgPSB2b2lkIDA7XG5jb25zdCByZWNvcmRpbmdfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi9yZWNvcmRpbmdfdXRpbHNcIik7XG5jbGFzcyBBbmRyb2lkVGFyZ2V0IHtcbiAgICBjb25zdHJ1Y3RvcihhZGJDb25uZWN0aW9uLCBvblRhcmdldENoYW5nZSkge1xuICAgICAgICB0aGlzLmFkYkNvbm5lY3Rpb24gPSBhZGJDb25uZWN0aW9uO1xuICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlID0gb25UYXJnZXRDaGFuZ2U7XG4gICAgICAgIHRoaXMuY29uc3VtZXJTb2NrZXRQYXRoID0gcmVjb3JkaW5nX3V0aWxzXzEuREVGQVVMVF9UUkFDRURfQ09OU1VNRVJfU09DS0VUX1BBVEg7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgY2FsbGVkIHdoZW4gYSB1c2IgVVNCQ29ubmVjdGlvbkV2ZW50IG9mIHR5cGUgJ2Rpc2Nvbm5lY3QnIGV2ZW50IGlzXG4gICAgLy8gZW1pdHRlZC4gVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gdGhlIFVTQiBjb25uZWN0aW9uIGlzIGxvc3QgKGV4YW1wbGU6XG4gICAgLy8gd2hlbiB0aGUgdXNlciB1bnBsdWdnZWQgdGhlIGNvbm5lY3RpbmcgY2FibGUpLlxuICAgIGFzeW5jIGRpc2Nvbm5lY3QoZGlzY29ubmVjdE1lc3NhZ2UpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGJDb25uZWN0aW9uLmRpc2Nvbm5lY3QoZGlzY29ubmVjdE1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBTdGFydHMgYSB0cmFjaW5nIHNlc3Npb24gaW4gb3JkZXIgdG8gZmV0Y2ggaW5mb3JtYXRpb24gc3VjaCBhcyBhcGlMZXZlbFxuICAgIC8vIGFuZCBkYXRhU291cmNlcyBmcm9tIHRoZSBkZXZpY2UuIFRoZW4sIGl0IGNhbmNlbHMgdGhlIHNlc3Npb24uXG4gICAgYXN5bmMgZmV0Y2hUYXJnZXRJbmZvKGxpc3RlbmVyKSB7XG4gICAgfVxuICAgIC8vIFdlIGRvIG5vdCBzdXBwb3J0IGxvbmcgdHJhY2luZyBvbiBBbmRyb2lkLlxuICAgIGNhbkNyZWF0ZVRyYWNpbmdTZXNzaW9uKHJlY29yZGluZ01vZGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhc3luYyBjcmVhdGVUcmFjaW5nU2Vzc2lvbih0cmFjaW5nU2Vzc2lvbkxpc3RlbmVyKSB7XG4gICAgfVxuICAgIGNhbkNvbm5lY3RXaXRob3V0Q29udGVudGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRiQ29ubmVjdGlvbi5jYW5Db25uZWN0V2l0aG91dENvbnRlbnRpb24oKTtcbiAgICB9XG4gICAgZ2V0QWRiQ29ubmVjdGlubygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRiQ29ubmVjdGlvbjtcbiAgICB9XG59XG5leHBvcnRzLkFuZHJvaWRUYXJnZXQgPSBBbmRyb2lkVGFyZ2V0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuZHJvaWRXZWJ1c2JUYXJnZXQgPSB2b2lkIDA7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3QgYWRiX2Nvbm5lY3Rpb25fb3Zlcl93ZWJ1c2JfMSA9IHJlcXVpcmUoXCIuLi9hZGJfY29ubmVjdGlvbl9vdmVyX3dlYnVzYlwiKTtcbmNvbnN0IGFuZHJvaWRfdGFyZ2V0XzEgPSByZXF1aXJlKFwiLi9hbmRyb2lkX3RhcmdldFwiKTtcbmNsYXNzIEFuZHJvaWRXZWJ1c2JUYXJnZXQgZXh0ZW5kcyBhbmRyb2lkX3RhcmdldF8xLkFuZHJvaWRUYXJnZXQge1xuICAgIGNvbnN0cnVjdG9yKGRldmljZSwga2V5TWFuYWdlciwgb25UYXJnZXRDaGFuZ2UpIHtcbiAgICAgICAgc3VwZXIobmV3IGFkYl9jb25uZWN0aW9uX292ZXJfd2VidXNiXzEuQWRiQ29ubmVjdGlvbk92ZXJXZWJ1c2IoZGV2aWNlLCBrZXlNYW5hZ2VyKSwgb25UYXJnZXRDaGFuZ2UpO1xuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcbiAgICB9XG4gICAgZ2V0SW5mbygpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmRldmljZS5wcm9kdWN0TmFtZSkgKyAnICcgK1xuICAgICAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuZGV2aWNlLnNlcmlhbE51bWJlcikgKyAnIFdlYlVzYic7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXRUeXBlOiAnQU5EUk9JRCcsXG4gICAgICAgICAgICAvLyAnYW5kcm9pZEFwaUxldmVsJyB3aWxsIGJlIHBvcHVsYXRlZCBhZnRlciBBREIgYXV0aG9yaXphdGlvbi5cbiAgICAgICAgICAgIGFuZHJvaWRBcGlMZXZlbDogdGhpcy5hbmRyb2lkQXBpTGV2ZWwsXG4gICAgICAgICAgICBkYXRhU291cmNlczogdGhpcy5kYXRhU291cmNlcyB8fCBbXSxcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0cy5BbmRyb2lkV2VidXNiVGFyZ2V0ID0gQW5kcm9pZFdlYnVzYlRhcmdldDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0X2ZhY3RvcnlfMSA9IHJlcXVpcmUoXCIuL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvdGFyZ2V0X2ZhY3Rvcmllcy9hbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeVwiKTtcbmNvbnN0IGpzemlwXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImpzemlwXCIpKTtcbmNvbnN0IGZpbGVfc2F2ZXJfMSA9IHJlcXVpcmUoXCJmaWxlLXNhdmVyXCIpO1xuY29uc3Qgc3RyaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9XZWJBZGIvYmFzZS9zdHJpbmdfdXRpbHNcIik7XG5jb25zdCBjb25uZWN0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uZWN0X2J1dHRvblwiKTtcbmNvbnN0IHJ1bkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnVuX2J1dHRvblwiKTtcbnJ1bkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5jb25zdCBzY3JpcHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3JpcHRfYXJlYVwiKTtcbnNjcmlwdEFyZWEuZGlzYWJsZWQgPSB0cnVlO1xuY29uc3Qgb3V0cHV0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3V0cHV0X2FyZWFcIik7XG5vdXRwdXRBcmVhLmRpc2FibGVkID0gdHJ1ZTtcbmNvbnN0IGxvZ2NhdEFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2NhdF9hcmVhXCIpO1xubG9nY2F0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG5jb25zdCBidWdyZXBvcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1Z3JlcG9ydF9idXR0b25cIik7XG5idWdyZXBvcnRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuYnVncmVwb3J0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGFrZUJ1Z3JlcG9ydCwgZmFsc2UpO1xuY29uc3Qgc3RhcnRSZWNvcmRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlY29yZF9idXR0b25cIik7XG5zdGFydFJlY29yZEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5zdGFydFJlY29yZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZVJlY29yZGluZywgZmFsc2UpO1xuY29uc3Qgc2F2ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F2ZV9idXR0b25cIik7XG5zYXZlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZG93bmxvYWQsIGZhbHNlKTtcbmNvbnN0IHdlYnVzYiA9IG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeV8xLkFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5KG5hdmlnYXRvci51c2IpO1xudmFyIGFkYkNvbm5lY3Rpb247XG5zY3JpcHRBcmVhLnZhbHVlID0gXCJnZXRwcm9wXCI7XG5jb25zdCBsb2djYXREZWNvZGUgPSBuZXcgVGV4dERlY29kZXIoKTtcbnZhciB0b1J1biA9IFtdO1xudmFyIGJ1Z3JlcG9ydHMgPSBbXTtcbmZ1bmN0aW9uIGxvZ2NhdERhdGEoZGF0YSkge1xuICAgIGxvZ2NhdEFyZWEudmFsdWUgPSBsb2djYXRBcmVhLnZhbHVlICsgbG9nY2F0RGVjb2RlLmRlY29kZShkYXRhKTtcbiAgICBsb2djYXRBcmVhLnNjcm9sbFRvcCA9IGxvZ2NhdEFyZWEuc2Nyb2xsSGVpZ2h0O1xufVxuZnVuY3Rpb24gZGV2aWNlQ29ubmVjdGVkKGRldikge1xuICAgIGNvbnN0IGFkYlRhcmdldCA9IGRldjtcbiAgICBhZGJDb25uZWN0aW9uID0gYWRiVGFyZ2V0LmFkYkNvbm5lY3Rpb247XG4gICAgY29uc29sZS5sb2coXCJTdGFydCBsb2djYXRcIik7XG4gICAgYWRiQ29ubmVjdGlvbi5zaGVsbChcImxvZ2NhdFwiKS50aGVuKChieXRlcykgPT4geyBieXRlcy5hZGRPblN0cmVhbURhdGFDYWxsYmFjayhsb2djYXREYXRhKTsgfSk7XG4gICAgY29ubmVjdEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgY29ubmVjdEJ1dHRvbi5pbm5lclRleHQgPSBcIkNvbm5lY3RlZFxcblwiICsgZGV2LmdldEluZm8oKS5uYW1lO1xuICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHNjcmlwdEFyZWEuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBvdXRwdXRBcmVhLmRpc2FibGVkID0gZmFsc2U7XG4gICAgbG9nY2F0QXJlYS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIDtcbiAgICBidWdyZXBvcnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICA7XG4gICAgc3RhcnRSZWNvcmRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIGNvbm5lY3REZXZpY2UoKSB7XG4gICAgY29uc29sZS5sb2coXCJDb25uZWN0IGRldmljZVwiKTtcbiAgICBsZXQgZGV2aWNlUCA9IHdlYnVzYi5jb25uZWN0TmV3VGFyZ2V0KCkudGhlbigoZGV2aWNlKSA9PiBkZXZpY2VDb25uZWN0ZWQoZGV2aWNlKSwgKHJlYXNvbikgPT4geyBjb25zb2xlLmxvZyhcIkZhaWxlZCB0byBjb25uZWN0XCIpOyB9KTtcbn1cbmZ1bmN0aW9uIHJlY3Vyc2VDb21tYW5kTGluZShyZXN1bHQpIHtcbiAgICBjb25zb2xlLmxvZyhcIkdvdCBcIiArIHJlc3VsdCk7XG4gICAgb3V0cHV0QXJlYS52YWx1ZSA9IG91dHB1dEFyZWEudmFsdWUgKyByZXN1bHQ7XG4gICAgb3V0cHV0QXJlYS5zY3JvbGxUb3AgPSBvdXRwdXRBcmVhLnNjcm9sbEhlaWdodDtcbiAgICB2YXIgbmV4dENNRCA9IGdldE5leHRDTUQoKTtcbiAgICBpZiAobmV4dENNRCA9PSBcIlwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmluaXNoZWRcIik7XG4gICAgICAgIHNjcmlwdEFyZWEuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgcnVuQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmcgbmV4dDogXCIgKyBuZXh0Q01EKTtcbiAgICAgICAgYWRiQ29ubmVjdGlvbi5zaGVsbEFuZEdldE91dHB1dChuZXh0Q01EKS50aGVuKCh2YWwpID0+IHsgcmVjdXJzZUNvbW1hbmRMaW5lKHZhbCk7IH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldE5leHRDTUQoKSB7XG4gICAgaWYgKHRvUnVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIG5leHRDb21tYW5kID0gdG9SdW5bMF07XG4gICAgICAgIHRvUnVuLnNoaWZ0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmV0dXJuaW5nOiBcIiArIG5leHRDb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHRDb21tYW5kO1xuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbn1cbmZ1bmN0aW9uIHJ1blRlc3QoKSB7XG4gICAgcnVuQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBzY3JpcHRBcmVhLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBvdXRwdXRBcmVhLnZhbHVlID0gXCJcIjtcbiAgICBsZXQgdGVzdFNjcmlwdCA9IHNjcmlwdEFyZWEudmFsdWU7XG4gICAgaWYgKHRlc3RTY3JpcHQuc3BsaXQoXCJcXG5cIikubGVuZ3RoID4gMSkge1xuICAgICAgICB0b1J1biA9IHRlc3RTY3JpcHQuc3BsaXQoXCJcXG5cIik7XG4gICAgfVxuICAgIHRvUnVuID0gW3Rlc3RTY3JpcHRdO1xuICAgIC8vIFBhZCB3aXRoIGFkYiBsb2cgLXQgZGVidWcgY29tbWFuZHNcbiAgICB2YXIgcGFkZGVkTG9ncyA9IFtdO1xuICAgIHRvUnVuLmZvckVhY2goKHZhbCkgPT4geyBwYWRkZWRMb2dzLnB1c2goXCJsb2cgLXQgZGVidWcgXCIgKyBcIlxcXCJcIiArIHZhbC5yZXBsYWNlQWxsKFwiXFxcIlwiLCBcIl9cIikgKyBcIlxcXCJcIik7IHBhZGRlZExvZ3MucHVzaCh2YWwpOyB9KTtcbiAgICB0b1J1biA9IHBhZGRlZExvZ3M7XG4gICAgdmFyIGNvbW1hbmQgPSBnZXROZXh0Q01EKCk7XG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nOiBcIiArIHRlc3RTY3JpcHQpO1xuICAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBzY3JpcHRcbiAgICBhZGJDb25uZWN0aW9uLnNoZWxsQW5kR2V0T3V0cHV0KGNvbW1hbmQpLnRoZW4oKHZhbCkgPT4geyByZWN1cnNlQ29tbWFuZExpbmUodmFsKTsgfSk7XG59XG5mdW5jdGlvbiB1cGRhdGVVUkwoZWxlLCBldikge1xufVxuY29ubmVjdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNvbm5lY3REZXZpY2UsIGZhbHNlKTtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicnVuX2J1dHRvblwiKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBydW5UZXN0LCBmYWxzZSk7XG5zY3JpcHRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGV2KSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFVkVOVFwiKTtcbiAgICBsZXQgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgIHBhcmFtcy5zZXQoJ3NjcmlwdCcsICcnICsgc2NyaXB0QXJlYS52YWx1ZSk7XG4gICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCcxJywgJ1BBTCcsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArICc/JyArIHBhcmFtcyk7XG59LCBmYWxzZSk7XG5mdW5jdGlvbiBwb3B1bGF0ZVNjcmlwdEZyb21VUkwoKSB7XG4gICAgY29uc3QgdXJsU2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICBjb25zdCBuYW1lID0gdXJsU2VhcmNoUGFyYW1zLmdldCgnc2NyaXB0Jyk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgICAgc2NyaXB0QXJlYS52YWx1ZSA9IG5hbWU7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKFwiRVZFTlRcIik7XG4gICAgbGV0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICBwYXJhbXMuc2V0KCdzY3JpcHQnLCAnJyArIHNjcmlwdEFyZWEudmFsdWUpO1xuICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSgnMScsICdQQUwnLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyAnPycgKyBwYXJhbXMpO1xufVxucG9wdWxhdGVTY3JpcHRGcm9tVVJMKCk7XG52YXIgbWVkaWFSZWNvcmRlcjtcbnZhciBjaHVua3M7XG5pZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEpIHtcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7IHZpZGVvOiB7XG4gICAgICAgICAgICBmYWNpbmdNb2RlOiAnZW52aXJvbm1lbnQnXG4gICAgICAgIH0gfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xuICAgICAgICBtZWRpYVJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtKTtcbiAgICAgICAgbGV0IHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidmlkZW9cIik7XG4gICAgICAgIHZpZGVvRWxlbWVudC5zcmNPYmplY3QgPSBzdHJlYW07XG4gICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIwcikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNvbWV0aGluZyB3ZW50IHdyb25nIVwiLCBlcnIwcik7XG4gICAgfSk7XG59XG52YXIgcmVjb3JkaW5nID0gZmFsc2U7XG5mdW5jdGlvbiB0b2dnbGVSZWNvcmRpbmcoKSB7XG4gICAgaWYgKHJlY29yZGluZykge1xuICAgICAgICBzdG9wUmVjb3JkaW5nKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGFydFJlY29yZGluZygpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHN0YXJ0UmVjb3JkaW5nKCkge1xuICAgIHN0YXJ0UmVjb3JkQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICByZWNvcmRpbmcgPSB0cnVlO1xuICAgIGxvZ2NhdEFyZWEudmFsdWUgPSBcIlwiO1xuICAgIHN0YXJ0UmVjb3JkQnV0dG9uLmlubmVyVGV4dCA9IFwiU3RvcCBSZWNvcmRpbmdcIjtcbiAgICBzdGFydFJlY29yZEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uLXJlZFwiKTtcbiAgICBzdGFydFZpZGVvUmVjb3JkaW5nKCk7XG4gICAgc3RhcnRSZWNvcmRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbn1cbmZ1bmN0aW9uIHN0b3BSZWNvcmRpbmcoKSB7XG4gICAgc3RhcnRSZWNvcmRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIHJlY29yZGluZyA9IGZhbHNlO1xuICAgIHN0YXJ0UmVjb3JkQnV0dG9uLmlubmVyVGV4dCA9IFwiU3RhcnQgUmVjb3JkaW5nXCI7XG4gICAgc3RvcFZpZGVvUmVjb3JkaW5nKCk7XG4gICAgc3RhcnRSZWNvcmRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBzYXZlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgc2F2ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uLWdyZWVuXCIpO1xuICAgIHN0YXJ0UmVjb3JkQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJidXR0b24tcmVkXCIpO1xufVxuZnVuY3Rpb24gc3RhcnRWaWRlb1JlY29yZGluZygpIHtcbiAgICBjb25zb2xlLmxvZyhcInN0YXJ0IHJlY29yZFwiKTtcbiAgICBjaHVua3MgPSBbXTtcbiAgICBtZWRpYVJlY29yZGVyLm9uZGF0YWF2YWlsYWJsZSA9IChlKSA9PiB7XG4gICAgICAgIGNodW5rcy5wdXNoKGUuZGF0YSk7XG4gICAgfTtcbiAgICBtZWRpYVJlY29yZGVyLnN0YXJ0KDEwMDApO1xufVxuZnVuY3Rpb24gc3RvcFZpZGVvUmVjb3JkaW5nKCkge1xuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xufVxuZnVuY3Rpb24gZG93bmxvYWQoKSB7XG4gICAgc2F2ZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgdmFyIHppcCA9IG5ldyBqc3ppcF8xLmRlZmF1bHQoKTtcbiAgICBpZiAoYnVncmVwb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHppcC5maWxlKFwiYnVncmVwb3J0LnppcFwiLCBidWdyZXBvcnRzWzBdKTtcbiAgICB9XG4gICAgLy8gYWRkIGxvZ2NhdFxuICAgIHppcC5maWxlKFwibG9nY2F0LnR4dFwiLCBsb2djYXRBcmVhLnZhbHVlKTtcbiAgICAvLyBhZGQgY29tbWFuZHMgb3V0cHV0XG4gICAgemlwLmZpbGUoXCJvdXRwdXQudHh0XCIsIG91dHB1dEFyZWEudmFsdWUpO1xuICAgIC8vIGFkZCB2aWRlb1xuICAgIGlmIChjaHVua3MubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoY2h1bmtzLCB7IHR5cGU6IFwidmlkZW8veC1tYXRyb3NrYTtjb2RlY3M9YXZjMVwiIH0pO1xuICAgICAgICBjaHVua3MgPSBbXTtcbiAgICAgICAgemlwLmZpbGUoXCJ2aWRlby53ZWJtXCIsIGJsb2IpO1xuICAgIH1cbiAgICB6aXAuZ2VuZXJhdGVBc3luYyh7IHR5cGU6IFwiYmxvYlwiIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChjb250ZW50KSB7XG4gICAgICAgIHNhdmVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgLy8gc2VlIEZpbGVTYXZlci5qc1xuICAgICAgICAoMCwgZmlsZV9zYXZlcl8xLnNhdmVBcykoY29udGVudCwgXCJzZXNzaW9uLnppcFwiKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHRha2VCdWdyZXBvcnQoKSB7XG4gICAgYnVncmVwb3J0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBidWdyZXBvcnRCdXR0b24uaW5uZXJUZXh0ID0gXCJUYWtpbmcgYnVnIHJlcG9ydFwiO1xuICAgIGJ1Z3JlcG9ydEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uLXllbGxvd1wiKTtcbiAgICBhZGJDb25uZWN0aW9uLnNoZWxsQW5kR2V0T3V0cHV0KFwiYnVncmVwb3J0elwiKVxuICAgICAgICAudGhlbigodmFsKSA9PiB7XG4gICAgICAgIGlmICh2YWwuc3RhcnRzV2l0aChcIk9LXCIpKSB7XG4gICAgICAgICAgICBidWdyZXBvcnRCdXR0b24uaW5uZXJUZXh0ID0gXCJEb3dubG9hZGluZyBidWcgcmVwb3J0XCI7XG4gICAgICAgICAgICB2YXIgcGF0aCA9IHZhbC5zbGljZSgzKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYnVncmVwb3J0IHBhdGggaXMgXCIgKyBwYXRoKTtcbiAgICAgICAgICAgIGFkYkNvbm5lY3Rpb24uc2hlbGxBbmRHZXRPdXRwdXQoXCJiYXNlNjQgXCIgKyBwYXRoKS50aGVuKChiYXNlNjRTdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICBiYXNlNjRTdHJpbmcgPSBiYXNlNjRTdHJpbmcucmVwbGFjZUFsbChcIlxcblwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBidWdyZXBvcnRzLnB1c2goKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkoYmFzZTY0U3RyaW5nKSk7XG4gICAgICAgICAgICAgICAgYnVncmVwb3J0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidXR0b24tZ3JlZW5cIik7XG4gICAgICAgICAgICAgICAgYnVncmVwb3J0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJidXR0b24teWVsbG93XCIpO1xuICAgICAgICAgICAgICAgIGJ1Z3JlcG9ydEJ1dHRvbi5pbm5lclRleHQgPSBcIkJ1Z3JlcG9ydCBzYXZlZFwiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgY2FwdHVyaW5nIGJ1Z3JlcG9ydFwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIiwiLy8gQ29weXJpZ2h0IChDKSAyMDE5IFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG5leHBvcnQgY29uc3QgX1RleHREZWNvZGVyID0gVGV4dERlY29kZXI7XG5leHBvcnQgY29uc3QgX1RleHRFbmNvZGVyID0gVGV4dEVuY29kZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcGFsLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9