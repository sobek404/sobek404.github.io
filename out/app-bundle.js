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
        iconURL: 'favicon.ico'
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!********************!*\
  !*** ./src/pal.ts ***!
  \********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const android_webusb_target_factory_1 = __webpack_require__(/*! ./WebAdb/common/recordingV2/target_factories/android_webusb_target_factory */ "./src/WebAdb/common/recordingV2/target_factories/android_webusb_target_factory.ts");
const runButton = document.getElementById("run_button");
const scriptArea = document.getElementById("script_area");
const outputArea = document.getElementById("output_area");
const logcatArea = document.getElementById("logcat_area");
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
document.getElementById("connect_button")?.addEventListener('click', connectDevice, false);
document.getElementById("run_button")?.addEventListener('click', runTest, false);
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: {
            facingMode: 'environment'
        } })
        .then(function (stream) {
        let videoElement = document.getElementById("video");
        videoElement.srcObject = stream;
    })
        .catch(function (err0r) {
        console.log("Something went wrong!", err0r);
    });
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRSxRQUFRO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0EsY0FBYyxTQUFTOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLFFBQVE7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQixrQkFBa0IsUUFBUTtBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGFBQWE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRCwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLElBQUksSUFBOEI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEtBQUssRUFJTjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCO0FBQ0E7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBLElBQUk7QUFDSjtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixPQUFPO0FBQ2hDO0FBQ0EsNkJBQTZCLE9BQU87QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0Esb0NBQW9DLFNBQVM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1GQUFtRixVQUFVO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHVCQUF1QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsS0FBSyxXQUFXLFdBQVc7QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxzREFBc0Q7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTCIsInNvdXJjZXMiOlsid2VicGFjazovL3BhbF9naXQvLi9ub2RlX21vZHVsZXMvQHByb3RvYnVmanMvYmFzZTY0L2luZGV4LmpzIiwid2VicGFjazovL3BhbF9naXQvLi9ub2RlX21vZHVsZXMvQHByb3RvYnVmanMvdXRmOC9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vbm9kZV9tb2R1bGVzL2pzYm4tcnNhL2pzYm4uanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS9kZWZlcnJlZC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL2Vycm9ycy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL2xvZ2dpbmcudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS9vYmplY3RfdXRpbHMudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS9zdHJpbmdfdXRpbHMudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL2FycmF5X2J1ZmZlcl9idWlsZGVyLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hZGJfY29ubmVjdGlvbl9pbXBsLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hZGJfY29ubmVjdGlvbl9vdmVyX3dlYnVzYi50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvYWRiX2ZpbGVfaGFuZGxlci50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvYXV0aC9hZGJfYXV0aC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvYXV0aC9hZGJfa2V5X21hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvcmVjb3JkaW5nX3V0aWxzLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi90YXJnZXRfZmFjdG9yaWVzL2FuZHJvaWRfd2VidXNiX3RhcmdldF9mYWN0b3J5LnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi90YXJnZXRzL2FuZHJvaWRfdGFyZ2V0LnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi90YXJnZXRzL2FuZHJvaWRfd2VidXNiX3RhcmdldC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL3V0aWxzL2luZGV4LWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvcGFsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIEEgbWluaW1hbCBiYXNlNjQgaW1wbGVtZW50YXRpb24gZm9yIG51bWJlciBhcnJheXMuXHJcbiAqIEBtZW1iZXJvZiB1dGlsXHJcbiAqIEBuYW1lc3BhY2VcclxuICovXHJcbnZhciBiYXNlNjQgPSBleHBvcnRzO1xyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIGJ5dGUgbGVuZ3RoIG9mIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIEJhc2U2NCBlbmNvZGVkIHN0cmluZ1xyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBCeXRlIGxlbmd0aFxyXG4gKi9cclxuYmFzZTY0Lmxlbmd0aCA9IGZ1bmN0aW9uIGxlbmd0aChzdHJpbmcpIHtcclxuICAgIHZhciBwID0gc3RyaW5nLmxlbmd0aDtcclxuICAgIGlmICghcClcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIHZhciBuID0gMDtcclxuICAgIHdoaWxlICgtLXAgJSA0ID4gMSAmJiBzdHJpbmcuY2hhckF0KHApID09PSBcIj1cIilcclxuICAgICAgICArK247XHJcbiAgICByZXR1cm4gTWF0aC5jZWlsKHN0cmluZy5sZW5ndGggKiAzKSAvIDQgLSBuO1xyXG59O1xyXG5cclxuLy8gQmFzZTY0IGVuY29kaW5nIHRhYmxlXHJcbnZhciBiNjQgPSBuZXcgQXJyYXkoNjQpO1xyXG5cclxuLy8gQmFzZTY0IGRlY29kaW5nIHRhYmxlXHJcbnZhciBzNjQgPSBuZXcgQXJyYXkoMTIzKTtcclxuXHJcbi8vIDY1Li45MCwgOTcuLjEyMiwgNDguLjU3LCA0MywgNDdcclxuZm9yICh2YXIgaSA9IDA7IGkgPCA2NDspXHJcbiAgICBzNjRbYjY0W2ldID0gaSA8IDI2ID8gaSArIDY1IDogaSA8IDUyID8gaSArIDcxIDogaSA8IDYyID8gaSAtIDQgOiBpIC0gNTkgfCA0M10gPSBpKys7XHJcblxyXG4vKipcclxuICogRW5jb2RlcyBhIGJ1ZmZlciB0byBhIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBidWZmZXIgU291cmNlIGJ1ZmZlclxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgU291cmNlIHN0YXJ0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgU291cmNlIGVuZFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBCYXNlNjQgZW5jb2RlZCBzdHJpbmdcclxuICovXHJcbmJhc2U2NC5lbmNvZGUgPSBmdW5jdGlvbiBlbmNvZGUoYnVmZmVyLCBzdGFydCwgZW5kKSB7XHJcbiAgICB2YXIgcGFydHMgPSBudWxsLFxyXG4gICAgICAgIGNodW5rID0gW107XHJcbiAgICB2YXIgaSA9IDAsIC8vIG91dHB1dCBpbmRleFxyXG4gICAgICAgIGogPSAwLCAvLyBnb3RvIGluZGV4XHJcbiAgICAgICAgdDsgICAgIC8vIHRlbXBvcmFyeVxyXG4gICAgd2hpbGUgKHN0YXJ0IDwgZW5kKSB7XHJcbiAgICAgICAgdmFyIGIgPSBidWZmZXJbc3RhcnQrK107XHJcbiAgICAgICAgc3dpdGNoIChqKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGNodW5rW2krK10gPSBiNjRbYiA+PiAyXTtcclxuICAgICAgICAgICAgICAgIHQgPSAoYiAmIDMpIDw8IDQ7XHJcbiAgICAgICAgICAgICAgICBqID0gMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBjaHVua1tpKytdID0gYjY0W3QgfCBiID4+IDRdO1xyXG4gICAgICAgICAgICAgICAgdCA9IChiICYgMTUpIDw8IDI7XHJcbiAgICAgICAgICAgICAgICBqID0gMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBjaHVua1tpKytdID0gYjY0W3QgfCBiID4+IDZdO1xyXG4gICAgICAgICAgICAgICAgY2h1bmtbaSsrXSA9IGI2NFtiICYgNjNdO1xyXG4gICAgICAgICAgICAgICAgaiA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGkgPiA4MTkxKSB7XHJcbiAgICAgICAgICAgIChwYXJ0cyB8fCAocGFydHMgPSBbXSkpLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rKSk7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChqKSB7XHJcbiAgICAgICAgY2h1bmtbaSsrXSA9IGI2NFt0XTtcclxuICAgICAgICBjaHVua1tpKytdID0gNjE7XHJcbiAgICAgICAgaWYgKGogPT09IDEpXHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSA2MTtcclxuICAgIH1cclxuICAgIGlmIChwYXJ0cykge1xyXG4gICAgICAgIGlmIChpKVxyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjaHVuay5zbGljZSgwLCBpKSkpO1xyXG4gICAgICAgIHJldHVybiBwYXJ0cy5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjaHVuay5zbGljZSgwLCBpKSk7XHJcbn07XHJcblxyXG52YXIgaW52YWxpZEVuY29kaW5nID0gXCJpbnZhbGlkIGVuY29kaW5nXCI7XHJcblxyXG4vKipcclxuICogRGVjb2RlcyBhIGJhc2U2NCBlbmNvZGVkIHN0cmluZyB0byBhIGJ1ZmZlci5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTb3VyY2Ugc3RyaW5nXHJcbiAqIEBwYXJhbSB7VWludDhBcnJheX0gYnVmZmVyIERlc3RpbmF0aW9uIGJ1ZmZlclxyXG4gKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IERlc3RpbmF0aW9uIG9mZnNldFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBOdW1iZXIgb2YgYnl0ZXMgd3JpdHRlblxyXG4gKiBAdGhyb3dzIHtFcnJvcn0gSWYgZW5jb2RpbmcgaXMgaW52YWxpZFxyXG4gKi9cclxuYmFzZTY0LmRlY29kZSA9IGZ1bmN0aW9uIGRlY29kZShzdHJpbmcsIGJ1ZmZlciwgb2Zmc2V0KSB7XHJcbiAgICB2YXIgc3RhcnQgPSBvZmZzZXQ7XHJcbiAgICB2YXIgaiA9IDAsIC8vIGdvdG8gaW5kZXhcclxuICAgICAgICB0OyAgICAgLy8gdGVtcG9yYXJ5XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7KSB7XHJcbiAgICAgICAgdmFyIGMgPSBzdHJpbmcuY2hhckNvZGVBdChpKyspO1xyXG4gICAgICAgIGlmIChjID09PSA2MSAmJiBqID4gMSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgaWYgKChjID0gczY0W2NdKSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihpbnZhbGlkRW5jb2RpbmcpO1xyXG4gICAgICAgIHN3aXRjaCAoaikge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICB0ID0gYztcclxuICAgICAgICAgICAgICAgIGogPSAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSB0IDw8IDIgfCAoYyAmIDQ4KSA+PiA0O1xyXG4gICAgICAgICAgICAgICAgdCA9IGM7XHJcbiAgICAgICAgICAgICAgICBqID0gMjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gKHQgJiAxNSkgPDwgNCB8IChjICYgNjApID4+IDI7XHJcbiAgICAgICAgICAgICAgICB0ID0gYztcclxuICAgICAgICAgICAgICAgIGogPSAzO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSAodCAmIDMpIDw8IDYgfCBjO1xyXG4gICAgICAgICAgICAgICAgaiA9IDA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaiA9PT0gMSlcclxuICAgICAgICB0aHJvdyBFcnJvcihpbnZhbGlkRW5jb2RpbmcpO1xyXG4gICAgcmV0dXJuIG9mZnNldCAtIHN0YXJ0O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFRlc3RzIGlmIHRoZSBzcGVjaWZpZWQgc3RyaW5nIGFwcGVhcnMgdG8gYmUgYmFzZTY0IGVuY29kZWQuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU3RyaW5nIHRvIHRlc3RcclxuICogQHJldHVybnMge2Jvb2xlYW59IGB0cnVlYCBpZiBwcm9iYWJseSBiYXNlNjQgZW5jb2RlZCwgb3RoZXJ3aXNlIGZhbHNlXHJcbiAqL1xyXG5iYXNlNjQudGVzdCA9IGZ1bmN0aW9uIHRlc3Qoc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gL14oPzpbQS1aYS16MC05Ky9dezR9KSooPzpbQS1aYS16MC05Ky9dezJ9PT18W0EtWmEtejAtOSsvXXszfT0pPyQvLnRlc3Qoc3RyaW5nKTtcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogQSBtaW5pbWFsIFVURjggaW1wbGVtZW50YXRpb24gZm9yIG51bWJlciBhcnJheXMuXHJcbiAqIEBtZW1iZXJvZiB1dGlsXHJcbiAqIEBuYW1lc3BhY2VcclxuICovXHJcbnZhciB1dGY4ID0gZXhwb3J0cztcclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGVzIHRoZSBVVEY4IGJ5dGUgbGVuZ3RoIG9mIGEgc3RyaW5nLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFN0cmluZ1xyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBCeXRlIGxlbmd0aFxyXG4gKi9cclxudXRmOC5sZW5ndGggPSBmdW5jdGlvbiB1dGY4X2xlbmd0aChzdHJpbmcpIHtcclxuICAgIHZhciBsZW4gPSAwLFxyXG4gICAgICAgIGMgPSAwO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpXHJcbiAgICAgICAgICAgIGxlbiArPSAxO1xyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KVxyXG4gICAgICAgICAgICBsZW4gKz0gMjtcclxuICAgICAgICBlbHNlIGlmICgoYyAmIDB4RkMwMCkgPT09IDB4RDgwMCAmJiAoc3RyaW5nLmNoYXJDb2RlQXQoaSArIDEpICYgMHhGQzAwKSA9PT0gMHhEQzAwKSB7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgbGVuICs9IDQ7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGxlbiArPSAzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxlbjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBSZWFkcyBVVEY4IGJ5dGVzIGFzIGEgc3RyaW5nLlxyXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IGJ1ZmZlciBTb3VyY2UgYnVmZmVyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBTb3VyY2Ugc3RhcnRcclxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBTb3VyY2UgZW5kXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFN0cmluZyByZWFkXHJcbiAqL1xyXG51dGY4LnJlYWQgPSBmdW5jdGlvbiB1dGY4X3JlYWQoYnVmZmVyLCBzdGFydCwgZW5kKSB7XHJcbiAgICB2YXIgbGVuID0gZW5kIC0gc3RhcnQ7XHJcbiAgICBpZiAobGVuIDwgMSlcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIHZhciBwYXJ0cyA9IG51bGwsXHJcbiAgICAgICAgY2h1bmsgPSBbXSxcclxuICAgICAgICBpID0gMCwgLy8gY2hhciBvZmZzZXRcclxuICAgICAgICB0OyAgICAgLy8gdGVtcG9yYXJ5XHJcbiAgICB3aGlsZSAoc3RhcnQgPCBlbmQpIHtcclxuICAgICAgICB0ID0gYnVmZmVyW3N0YXJ0KytdO1xyXG4gICAgICAgIGlmICh0IDwgMTI4KVxyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gdDtcclxuICAgICAgICBlbHNlIGlmICh0ID4gMTkxICYmIHQgPCAyMjQpXHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSAodCAmIDMxKSA8PCA2IHwgYnVmZmVyW3N0YXJ0KytdICYgNjM7XHJcbiAgICAgICAgZWxzZSBpZiAodCA+IDIzOSAmJiB0IDwgMzY1KSB7XHJcbiAgICAgICAgICAgIHQgPSAoKHQgJiA3KSA8PCAxOCB8IChidWZmZXJbc3RhcnQrK10gJiA2MykgPDwgMTIgfCAoYnVmZmVyW3N0YXJ0KytdICYgNjMpIDw8IDYgfCBidWZmZXJbc3RhcnQrK10gJiA2MykgLSAweDEwMDAwO1xyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gMHhEODAwICsgKHQgPj4gMTApO1xyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gMHhEQzAwICsgKHQgJiAxMDIzKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9ICh0ICYgMTUpIDw8IDEyIHwgKGJ1ZmZlcltzdGFydCsrXSAmIDYzKSA8PCA2IHwgYnVmZmVyW3N0YXJ0KytdICYgNjM7XHJcbiAgICAgICAgaWYgKGkgPiA4MTkxKSB7XHJcbiAgICAgICAgICAgIChwYXJ0cyB8fCAocGFydHMgPSBbXSkpLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rKSk7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwYXJ0cykge1xyXG4gICAgICAgIGlmIChpKVxyXG4gICAgICAgICAgICBwYXJ0cy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjaHVuay5zbGljZSgwLCBpKSkpO1xyXG4gICAgICAgIHJldHVybiBwYXJ0cy5qb2luKFwiXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjaHVuay5zbGljZSgwLCBpKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogV3JpdGVzIGEgc3RyaW5nIGFzIFVURjggYnl0ZXMuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU291cmNlIHN0cmluZ1xyXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IGJ1ZmZlciBEZXN0aW5hdGlvbiBidWZmZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCBEZXN0aW5hdGlvbiBvZmZzZXRcclxuICogQHJldHVybnMge251bWJlcn0gQnl0ZXMgd3JpdHRlblxyXG4gKi9cclxudXRmOC53cml0ZSA9IGZ1bmN0aW9uIHV0Zjhfd3JpdGUoc3RyaW5nLCBidWZmZXIsIG9mZnNldCkge1xyXG4gICAgdmFyIHN0YXJ0ID0gb2Zmc2V0LFxyXG4gICAgICAgIGMxLCAvLyBjaGFyYWN0ZXIgMVxyXG4gICAgICAgIGMyOyAvLyBjaGFyYWN0ZXIgMlxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBjMSA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIGlmIChjMSA8IDEyOCkge1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzE7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjMSA8IDIwNDgpIHtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDYgICAgICAgfCAxOTI7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSAgICAgICAmIDYzIHwgMTI4O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoKGMxICYgMHhGQzAwKSA9PT0gMHhEODAwICYmICgoYzIgPSBzdHJpbmcuY2hhckNvZGVBdChpICsgMSkpICYgMHhGQzAwKSA9PT0gMHhEQzAwKSB7XHJcbiAgICAgICAgICAgIGMxID0gMHgxMDAwMCArICgoYzEgJiAweDAzRkYpIDw8IDEwKSArIChjMiAmIDB4MDNGRik7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDE4ICAgICAgfCAyNDA7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiAxMiAmIDYzIHwgMTI4O1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gNiAgJiA2MyB8IDEyODtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxICAgICAgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDEyICAgICAgfCAyMjQ7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiA2ICAmIDYzIHwgMTI4O1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgICAgICAgJiA2MyB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2Zmc2V0IC0gc3RhcnQ7XHJcbn07XHJcbiIsIlxuKGZ1bmN0aW9uKCkge1xuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDUgIFRvbSBXdVxuLy8gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIFNlZSBcIkxJQ0VOU0VcIiBmb3IgZGV0YWlscy5cblxuLy8gQmFzaWMgSmF2YVNjcmlwdCBCTiBsaWJyYXJ5IC0gc3Vic2V0IHVzZWZ1bCBmb3IgUlNBIGVuY3J5cHRpb24uXG5cbnZhciBpbkJyb3dzZXIgPVxuICAgIHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xuXG4vLyBCaXRzIHBlciBkaWdpdFxudmFyIGRiaXRzO1xuXG4vLyBKYXZhU2NyaXB0IGVuZ2luZSBhbmFseXNpc1xudmFyIGNhbmFyeSA9IDB4ZGVhZGJlZWZjYWZlO1xudmFyIGpfbG0gPSAoKGNhbmFyeSAmIDB4ZmZmZmZmKSA9PSAweGVmY2FmZSk7XG5cbi8vIChwdWJsaWMpIENvbnN0cnVjdG9yXG5mdW5jdGlvbiBCaWdJbnRlZ2VyKGEsIGIsIGMpIHtcbiAgaWYgKGEgIT0gbnVsbClcbiAgICBpZiAoJ251bWJlcicgPT0gdHlwZW9mIGEpXG4gICAgICB0aGlzLmZyb21OdW1iZXIoYSwgYiwgYyk7XG4gICAgZWxzZSBpZiAoYiA9PSBudWxsICYmICdzdHJpbmcnICE9IHR5cGVvZiBhKVxuICAgICAgdGhpcy5mcm9tU3RyaW5nKGEsIDI1Nik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5mcm9tU3RyaW5nKGEsIGIpO1xufVxuXG4vLyByZXR1cm4gbmV3LCB1bnNldCBCaWdJbnRlZ2VyXG5mdW5jdGlvbiBuYmkoKSB7XG4gIHJldHVybiBuZXcgQmlnSW50ZWdlcihudWxsKTtcbn1cblxuLy8gYW06IENvbXB1dGUgd19qICs9ICh4KnRoaXNfaSksIHByb3BhZ2F0ZSBjYXJyaWVzLFxuLy8gYyBpcyBpbml0aWFsIGNhcnJ5LCByZXR1cm5zIGZpbmFsIGNhcnJ5LlxuLy8gYyA8IDMqZHZhbHVlLCB4IDwgMipkdmFsdWUsIHRoaXNfaSA8IGR2YWx1ZVxuLy8gV2UgbmVlZCB0byBzZWxlY3QgdGhlIGZhc3Rlc3Qgb25lIHRoYXQgd29ya3MgaW4gdGhpcyBlbnZpcm9ubWVudC5cblxuLy8gYW0xOiB1c2UgYSBzaW5nbGUgbXVsdCBhbmQgZGl2aWRlIHRvIGdldCB0aGUgaGlnaCBiaXRzLFxuLy8gbWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDI2IGJlY2F1c2Vcbi8vIG1heCBpbnRlcm5hbCB2YWx1ZSA9IDIqZHZhbHVlXjItMipkdmFsdWUgKDwgMl41MylcbmZ1bmN0aW9uIGFtMShpLCB4LCB3LCBqLCBjLCBuKSB7XG4gIHdoaWxlICgtLW4gPj0gMCkge1xuICAgIHZhciB2ID0geCAqIHRoaXNbaSsrXSArIHdbal0gKyBjO1xuICAgIGMgPSBNYXRoLmZsb29yKHYgLyAweDQwMDAwMDApO1xuICAgIHdbaisrXSA9IHYgJiAweDNmZmZmZmY7XG4gIH1cbiAgcmV0dXJuIGM7XG59XG4vLyBhbTIgYXZvaWRzIGEgYmlnIG11bHQtYW5kLWV4dHJhY3QgY29tcGxldGVseS5cbi8vIE1heCBkaWdpdCBiaXRzIHNob3VsZCBiZSA8PSAzMCBiZWNhdXNlIHdlIGRvIGJpdHdpc2Ugb3BzXG4vLyBvbiB2YWx1ZXMgdXAgdG8gMipoZHZhbHVlXjItaGR2YWx1ZS0xICg8IDJeMzEpXG5mdW5jdGlvbiBhbTIoaSwgeCwgdywgaiwgYywgbikge1xuICB2YXIgeGwgPSB4ICYgMHg3ZmZmLCB4aCA9IHggPj4gMTU7XG4gIHdoaWxlICgtLW4gPj0gMCkge1xuICAgIHZhciBsID0gdGhpc1tpXSAmIDB4N2ZmZjtcbiAgICB2YXIgaCA9IHRoaXNbaSsrXSA+PiAxNTtcbiAgICB2YXIgbSA9IHhoICogbCArIGggKiB4bDtcbiAgICBsID0geGwgKiBsICsgKChtICYgMHg3ZmZmKSA8PCAxNSkgKyB3W2pdICsgKGMgJiAweDNmZmZmZmZmKTtcbiAgICBjID0gKGwgPj4+IDMwKSArIChtID4+PiAxNSkgKyB4aCAqIGggKyAoYyA+Pj4gMzApO1xuICAgIHdbaisrXSA9IGwgJiAweDNmZmZmZmZmO1xuICB9XG4gIHJldHVybiBjO1xufVxuLy8gQWx0ZXJuYXRlbHksIHNldCBtYXggZGlnaXQgYml0cyB0byAyOCBzaW5jZSBzb21lXG4vLyBicm93c2VycyBzbG93IGRvd24gd2hlbiBkZWFsaW5nIHdpdGggMzItYml0IG51bWJlcnMuXG5mdW5jdGlvbiBhbTMoaSwgeCwgdywgaiwgYywgbikge1xuICB2YXIgeGwgPSB4ICYgMHgzZmZmLCB4aCA9IHggPj4gMTQ7XG4gIHdoaWxlICgtLW4gPj0gMCkge1xuICAgIHZhciBsID0gdGhpc1tpXSAmIDB4M2ZmZjtcbiAgICB2YXIgaCA9IHRoaXNbaSsrXSA+PiAxNDtcbiAgICB2YXIgbSA9IHhoICogbCArIGggKiB4bDtcbiAgICBsID0geGwgKiBsICsgKChtICYgMHgzZmZmKSA8PCAxNCkgKyB3W2pdICsgYztcbiAgICBjID0gKGwgPj4gMjgpICsgKG0gPj4gMTQpICsgeGggKiBoO1xuICAgIHdbaisrXSA9IGwgJiAweGZmZmZmZmY7XG4gIH1cbiAgcmV0dXJuIGM7XG59XG5pZiAoaW5Ccm93c2VyICYmIGpfbG0gJiYgKG5hdmlnYXRvci5hcHBOYW1lID09ICdNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXInKSkge1xuICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbSA9IGFtMjtcbiAgZGJpdHMgPSAzMDtcbn0gZWxzZSBpZiAoaW5Ccm93c2VyICYmIGpfbG0gJiYgKG5hdmlnYXRvci5hcHBOYW1lICE9ICdOZXRzY2FwZScpKSB7XG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0xO1xuICBkYml0cyA9IDI2O1xufSBlbHNlIHsgIC8vIE1vemlsbGEvTmV0c2NhcGUgc2VlbXMgdG8gcHJlZmVyIGFtM1xuICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbSA9IGFtMztcbiAgZGJpdHMgPSAyODtcbn1cblxuQmlnSW50ZWdlci5wcm90b3R5cGUuREIgPSBkYml0cztcbkJpZ0ludGVnZXIucHJvdG90eXBlLkRNID0gKCgxIDw8IGRiaXRzKSAtIDEpO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRFYgPSAoMSA8PCBkYml0cyk7XG5cbnZhciBCSV9GUCA9IDUyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRlYgPSBNYXRoLnBvdygyLCBCSV9GUCk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GMSA9IEJJX0ZQIC0gZGJpdHM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GMiA9IDIgKiBkYml0cyAtIEJJX0ZQO1xuXG4vLyBEaWdpdCBjb252ZXJzaW9uc1xudmFyIEJJX1JNID0gJzAxMjM0NTY3ODlhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eic7XG52YXIgQklfUkMgPSBuZXcgQXJyYXkoKTtcbnZhciByciwgdnY7XG5yciA9ICcwJy5jaGFyQ29kZUF0KDApO1xuZm9yICh2diA9IDA7IHZ2IDw9IDk7ICsrdnYpIEJJX1JDW3JyKytdID0gdnY7XG5yciA9ICdhJy5jaGFyQ29kZUF0KDApO1xuZm9yICh2diA9IDEwOyB2diA8IDM2OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2O1xucnIgPSAnQScuY2hhckNvZGVBdCgwKTtcbmZvciAodnYgPSAxMDsgdnYgPCAzNjsgKyt2dikgQklfUkNbcnIrK10gPSB2djtcblxuZnVuY3Rpb24gaW50MmNoYXIobikge1xuICByZXR1cm4gQklfUk0uY2hhckF0KG4pO1xufVxuZnVuY3Rpb24gaW50QXQocywgaSkge1xuICB2YXIgYyA9IEJJX1JDW3MuY2hhckNvZGVBdChpKV07XG4gIHJldHVybiAoYyA9PSBudWxsKSA/IC0xIDogYztcbn1cblxuLy8gKHByb3RlY3RlZCkgY29weSB0aGlzIHRvIHJcbmZ1bmN0aW9uIGJucENvcHlUbyhyKSB7XG4gIGZvciAodmFyIGkgPSB0aGlzLnQgLSAxOyBpID49IDA7IC0taSkgcltpXSA9IHRoaXNbaV07XG4gIHIudCA9IHRoaXMudDtcbiAgci5zID0gdGhpcy5zO1xufVxuXG4vLyAocHJvdGVjdGVkKSBzZXQgZnJvbSBpbnRlZ2VyIHZhbHVlIHgsIC1EViA8PSB4IDwgRFZcbmZ1bmN0aW9uIGJucEZyb21JbnQoeCkge1xuICB0aGlzLnQgPSAxO1xuICB0aGlzLnMgPSAoeCA8IDApID8gLTEgOiAwO1xuICBpZiAoeCA+IDApXG4gICAgdGhpc1swXSA9IHg7XG4gIGVsc2UgaWYgKHggPCAtMSlcbiAgICB0aGlzWzBdID0geCArIHRoaXMuRFY7XG4gIGVsc2VcbiAgICB0aGlzLnQgPSAwO1xufVxuXG4vLyByZXR1cm4gYmlnaW50IGluaXRpYWxpemVkIHRvIHZhbHVlXG5mdW5jdGlvbiBuYnYoaSkge1xuICB2YXIgciA9IG5iaSgpO1xuICByLmZyb21JbnQoaSk7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHJvdGVjdGVkKSBzZXQgZnJvbSBzdHJpbmcgYW5kIHJhZGl4XG5mdW5jdGlvbiBibnBGcm9tU3RyaW5nKHMsIGIpIHtcbiAgdmFyIGs7XG4gIGlmIChiID09IDE2KVxuICAgIGsgPSA0O1xuICBlbHNlIGlmIChiID09IDgpXG4gICAgayA9IDM7XG4gIGVsc2UgaWYgKGIgPT0gMjU2KVxuICAgIGsgPSA4OyAgLy8gYnl0ZSBhcnJheVxuICBlbHNlIGlmIChiID09IDIpXG4gICAgayA9IDE7XG4gIGVsc2UgaWYgKGIgPT0gMzIpXG4gICAgayA9IDU7XG4gIGVsc2UgaWYgKGIgPT0gNClcbiAgICBrID0gMjtcbiAgZWxzZSB7XG4gICAgdGhpcy5mcm9tUmFkaXgocywgYik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRoaXMudCA9IDA7XG4gIHRoaXMucyA9IDA7XG4gIHZhciBpID0gcy5sZW5ndGgsIG1pID0gZmFsc2UsIHNoID0gMDtcbiAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgdmFyIHggPSAoayA9PSA4KSA/IHNbaV0gJiAweGZmIDogaW50QXQocywgaSk7XG4gICAgaWYgKHggPCAwKSB7XG4gICAgICBpZiAocy5jaGFyQXQoaSkgPT0gJy0nKSBtaSA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgbWkgPSBmYWxzZTtcbiAgICBpZiAoc2ggPT0gMClcbiAgICAgIHRoaXNbdGhpcy50KytdID0geDtcbiAgICBlbHNlIGlmIChzaCArIGsgPiB0aGlzLkRCKSB7XG4gICAgICB0aGlzW3RoaXMudCAtIDFdIHw9ICh4ICYgKCgxIDw8ICh0aGlzLkRCIC0gc2gpKSAtIDEpKSA8PCBzaDtcbiAgICAgIHRoaXNbdGhpcy50KytdID0gKHggPj4gKHRoaXMuREIgLSBzaCkpO1xuICAgIH0gZWxzZVxuICAgICAgdGhpc1t0aGlzLnQgLSAxXSB8PSB4IDw8IHNoO1xuICAgIHNoICs9IGs7XG4gICAgaWYgKHNoID49IHRoaXMuREIpIHNoIC09IHRoaXMuREI7XG4gIH1cbiAgaWYgKGsgPT0gOCAmJiAoc1swXSAmIDB4ODApICE9IDApIHtcbiAgICB0aGlzLnMgPSAtMTtcbiAgICBpZiAoc2ggPiAwKSB0aGlzW3RoaXMudCAtIDFdIHw9ICgoMSA8PCAodGhpcy5EQiAtIHNoKSkgLSAxKSA8PCBzaDtcbiAgfVxuICB0aGlzLmNsYW1wKCk7XG4gIGlmIChtaSkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsIHRoaXMpO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjbGFtcCBvZmYgZXhjZXNzIGhpZ2ggd29yZHNcbmZ1bmN0aW9uIGJucENsYW1wKCkge1xuICB2YXIgYyA9IHRoaXMucyAmIHRoaXMuRE07XG4gIHdoaWxlICh0aGlzLnQgPiAwICYmIHRoaXNbdGhpcy50IC0gMV0gPT0gYykgLS10aGlzLnQ7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiBzdHJpbmcgcmVwcmVzZW50YXRpb24gaW4gZ2l2ZW4gcmFkaXhcbmZ1bmN0aW9uIGJuVG9TdHJpbmcoYikge1xuICBpZiAodGhpcy5zIDwgMCkgcmV0dXJuICctJyArIHRoaXMubmVnYXRlKCkudG9TdHJpbmcoYik7XG4gIHZhciBrO1xuICBpZiAoYiA9PSAxNilcbiAgICBrID0gNDtcbiAgZWxzZSBpZiAoYiA9PSA4KVxuICAgIGsgPSAzO1xuICBlbHNlIGlmIChiID09IDIpXG4gICAgayA9IDE7XG4gIGVsc2UgaWYgKGIgPT0gMzIpXG4gICAgayA9IDU7XG4gIGVsc2UgaWYgKGIgPT0gNClcbiAgICBrID0gMjtcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzLnRvUmFkaXgoYik7XG4gIHZhciBrbSA9ICgxIDw8IGspIC0gMSwgZCwgbSA9IGZhbHNlLCByID0gJycsIGkgPSB0aGlzLnQ7XG4gIHZhciBwID0gdGhpcy5EQiAtIChpICogdGhpcy5EQikgJSBrO1xuICBpZiAoaS0tID4gMCkge1xuICAgIGlmIChwIDwgdGhpcy5EQiAmJiAoZCA9IHRoaXNbaV0gPj4gcCkgPiAwKSB7XG4gICAgICBtID0gdHJ1ZTtcbiAgICAgIHIgPSBpbnQyY2hhcihkKTtcbiAgICB9XG4gICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgaWYgKHAgPCBrKSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSAmICgoMSA8PCBwKSAtIDEpKSA8PCAoayAtIHApO1xuICAgICAgICBkIHw9IHRoaXNbLS1pXSA+PiAocCArPSB0aGlzLkRCIC0gayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkID0gKHRoaXNbaV0gPj4gKHAgLT0gaykpICYga207XG4gICAgICAgIGlmIChwIDw9IDApIHtcbiAgICAgICAgICBwICs9IHRoaXMuREI7XG4gICAgICAgICAgLS1pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZCA+IDApIG0gPSB0cnVlO1xuICAgICAgaWYgKG0pIHIgKz0gaW50MmNoYXIoZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtID8gciA6ICcwJztcbn1cblxuLy8gKHB1YmxpYykgLXRoaXNcbmZ1bmN0aW9uIGJuTmVnYXRlKCkge1xuICB2YXIgciA9IG5iaSgpO1xuICBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcywgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB8dGhpc3xcbmZ1bmN0aW9uIGJuQWJzKCkge1xuICByZXR1cm4gKHRoaXMucyA8IDApID8gdGhpcy5uZWdhdGUoKSA6IHRoaXM7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiArIGlmIHRoaXMgPiBhLCAtIGlmIHRoaXMgPCBhLCAwIGlmIGVxdWFsXG5mdW5jdGlvbiBibkNvbXBhcmVUbyhhKSB7XG4gIHZhciByID0gdGhpcy5zIC0gYS5zO1xuICBpZiAociAhPSAwKSByZXR1cm4gcjtcbiAgdmFyIGkgPSB0aGlzLnQ7XG4gIHIgPSBpIC0gYS50O1xuICBpZiAociAhPSAwKSByZXR1cm4gKHRoaXMucyA8IDApID8gLXIgOiByO1xuICB3aGlsZSAoLS1pID49IDApXG4gICAgaWYgKChyID0gdGhpc1tpXSAtIGFbaV0pICE9IDApIHJldHVybiByO1xuICByZXR1cm4gMDtcbn1cblxuLy8gcmV0dXJucyBiaXQgbGVuZ3RoIG9mIHRoZSBpbnRlZ2VyIHhcbmZ1bmN0aW9uIG5iaXRzKHgpIHtcbiAgdmFyIHIgPSAxLCB0O1xuICBpZiAoKHQgPSB4ID4+PiAxNikgIT0gMCkge1xuICAgIHggPSB0O1xuICAgIHIgKz0gMTY7XG4gIH1cbiAgaWYgKCh0ID0geCA+PiA4KSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSA4O1xuICB9XG4gIGlmICgodCA9IHggPj4gNCkgIT0gMCkge1xuICAgIHggPSB0O1xuICAgIHIgKz0gNDtcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDIpICE9IDApIHtcbiAgICB4ID0gdDtcbiAgICByICs9IDI7XG4gIH1cbiAgaWYgKCh0ID0geCA+PiAxKSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSAxO1xuICB9XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdGhlIG51bWJlciBvZiBiaXRzIGluIFwidGhpc1wiXG5mdW5jdGlvbiBibkJpdExlbmd0aCgpIHtcbiAgaWYgKHRoaXMudCA8PSAwKSByZXR1cm4gMDtcbiAgcmV0dXJuIHRoaXMuREIgKiAodGhpcy50IC0gMSkgKyBuYml0cyh0aGlzW3RoaXMudCAtIDFdIF4gKHRoaXMucyAmIHRoaXMuRE0pKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPDwgbipEQlxuZnVuY3Rpb24gYm5wRExTaGlmdFRvKG4sIHIpIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSByW2kgKyBuXSA9IHRoaXNbaV07XG4gIGZvciAoaSA9IG4gLSAxOyBpID49IDA7IC0taSkgcltpXSA9IDA7XG4gIHIudCA9IHRoaXMudCArIG47XG4gIHIucyA9IHRoaXMucztcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gbipEQlxuZnVuY3Rpb24gYm5wRFJTaGlmdFRvKG4sIHIpIHtcbiAgZm9yICh2YXIgaSA9IG47IGkgPCB0aGlzLnQ7ICsraSkgcltpIC0gbl0gPSB0aGlzW2ldO1xuICByLnQgPSBNYXRoLm1heCh0aGlzLnQgLSBuLCAwKTtcbiAgci5zID0gdGhpcy5zO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA8PCBuXG5mdW5jdGlvbiBibnBMU2hpZnRUbyhuLCByKSB7XG4gIHZhciBicyA9IG4gJSB0aGlzLkRCO1xuICB2YXIgY2JzID0gdGhpcy5EQiAtIGJzO1xuICB2YXIgYm0gPSAoMSA8PCBjYnMpIC0gMTtcbiAgdmFyIGRzID0gTWF0aC5mbG9vcihuIC8gdGhpcy5EQiksIGMgPSAodGhpcy5zIDw8IGJzKSAmIHRoaXMuRE0sIGk7XG4gIGZvciAoaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgcltpICsgZHMgKyAxXSA9ICh0aGlzW2ldID4+IGNicykgfCBjO1xuICAgIGMgPSAodGhpc1tpXSAmIGJtKSA8PCBicztcbiAgfVxuICBmb3IgKGkgPSBkcyAtIDE7IGkgPj0gMDsgLS1pKSByW2ldID0gMDtcbiAgcltkc10gPSBjO1xuICByLnQgPSB0aGlzLnQgKyBkcyArIDE7XG4gIHIucyA9IHRoaXMucztcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA+PiBuXG5mdW5jdGlvbiBibnBSU2hpZnRUbyhuLCByKSB7XG4gIHIucyA9IHRoaXMucztcbiAgdmFyIGRzID0gTWF0aC5mbG9vcihuIC8gdGhpcy5EQik7XG4gIGlmIChkcyA+PSB0aGlzLnQpIHtcbiAgICByLnQgPSAwO1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgYnMgPSBuICUgdGhpcy5EQjtcbiAgdmFyIGNicyA9IHRoaXMuREIgLSBicztcbiAgdmFyIGJtID0gKDEgPDwgYnMpIC0gMTtcbiAgclswXSA9IHRoaXNbZHNdID4+IGJzO1xuICBmb3IgKHZhciBpID0gZHMgKyAxOyBpIDwgdGhpcy50OyArK2kpIHtcbiAgICByW2kgLSBkcyAtIDFdIHw9ICh0aGlzW2ldICYgYm0pIDw8IGNicztcbiAgICByW2kgLSBkc10gPSB0aGlzW2ldID4+IGJzO1xuICB9XG4gIGlmIChicyA+IDApIHJbdGhpcy50IC0gZHMgLSAxXSB8PSAodGhpcy5zICYgYm0pIDw8IGNicztcbiAgci50ID0gdGhpcy50IC0gZHM7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgLSBhXG5mdW5jdGlvbiBibnBTdWJUbyhhLCByKSB7XG4gIHZhciBpID0gMCwgYyA9IDAsIG0gPSBNYXRoLm1pbihhLnQsIHRoaXMudCk7XG4gIHdoaWxlIChpIDwgbSkge1xuICAgIGMgKz0gdGhpc1tpXSAtIGFbaV07XG4gICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgYyA+Pj0gdGhpcy5EQjtcbiAgfVxuICBpZiAoYS50IDwgdGhpcy50KSB7XG4gICAgYyAtPSBhLnM7XG4gICAgd2hpbGUgKGkgPCB0aGlzLnQpIHtcbiAgICAgIGMgKz0gdGhpc1tpXTtcbiAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyArPSB0aGlzLnM7XG4gIH0gZWxzZSB7XG4gICAgYyArPSB0aGlzLnM7XG4gICAgd2hpbGUgKGkgPCBhLnQpIHtcbiAgICAgIGMgLT0gYVtpXTtcbiAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyAtPSBhLnM7XG4gIH1cbiAgci5zID0gKGMgPCAwKSA/IC0xIDogMDtcbiAgaWYgKGMgPCAtMSlcbiAgICByW2krK10gPSB0aGlzLkRWICsgYztcbiAgZWxzZSBpZiAoYyA+IDApXG4gICAgcltpKytdID0gYztcbiAgci50ID0gaTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyAqIGEsIHIgIT0gdGhpcyxhIChIQUMgMTQuMTIpXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseVRvKGEsIHIpIHtcbiAgdmFyIHggPSB0aGlzLmFicygpLCB5ID0gYS5hYnMoKTtcbiAgdmFyIGkgPSB4LnQ7XG4gIHIudCA9IGkgKyB5LnQ7XG4gIHdoaWxlICgtLWkgPj0gMCkgcltpXSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCB5LnQ7ICsraSkgcltpICsgeC50XSA9IHguYW0oMCwgeVtpXSwgciwgaSwgMCwgeC50KTtcbiAgci5zID0gMDtcbiAgci5jbGFtcCgpO1xuICBpZiAodGhpcy5zICE9IGEucykgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIsIHIpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpc14yLCByICE9IHRoaXMgKEhBQyAxNC4xNilcbmZ1bmN0aW9uIGJucFNxdWFyZVRvKHIpIHtcbiAgdmFyIHggPSB0aGlzLmFicygpO1xuICB2YXIgaSA9IHIudCA9IDIgKiB4LnQ7XG4gIHdoaWxlICgtLWkgPj0gMCkgcltpXSA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCB4LnQgLSAxOyArK2kpIHtcbiAgICB2YXIgYyA9IHguYW0oaSwgeFtpXSwgciwgMiAqIGksIDAsIDEpO1xuICAgIGlmICgocltpICsgeC50XSArPSB4LmFtKGkgKyAxLCAyICogeFtpXSwgciwgMiAqIGkgKyAxLCBjLCB4LnQgLSBpIC0gMSkpID49XG4gICAgICAgIHguRFYpIHtcbiAgICAgIHJbaSArIHgudF0gLT0geC5EVjtcbiAgICAgIHJbaSArIHgudCArIDFdID0gMTtcbiAgICB9XG4gIH1cbiAgaWYgKHIudCA+IDApIHJbci50IC0gMV0gKz0geC5hbShpLCB4W2ldLCByLCAyICogaSwgMCwgMSk7XG4gIHIucyA9IDA7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgZGl2aWRlIHRoaXMgYnkgbSwgcXVvdGllbnQgYW5kIHJlbWFpbmRlciB0byBxLCByIChIQUMgMTQuMjApXG4vLyByICE9IHEsIHRoaXMgIT0gbS4gIHEgb3IgciBtYXkgYmUgbnVsbC5cbmZ1bmN0aW9uIGJucERpdlJlbVRvKG0sIHEsIHIpIHtcbiAgdmFyIHBtID0gbS5hYnMoKTtcbiAgaWYgKHBtLnQgPD0gMCkgcmV0dXJuO1xuICB2YXIgcHQgPSB0aGlzLmFicygpO1xuICBpZiAocHQudCA8IHBtLnQpIHtcbiAgICBpZiAocSAhPSBudWxsKSBxLmZyb21JbnQoMCk7XG4gICAgaWYgKHIgIT0gbnVsbCkgdGhpcy5jb3B5VG8ocik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChyID09IG51bGwpIHIgPSBuYmkoKTtcbiAgdmFyIHkgPSBuYmkoKSwgdHMgPSB0aGlzLnMsIG1zID0gbS5zO1xuICB2YXIgbnNoID0gdGhpcy5EQiAtIG5iaXRzKHBtW3BtLnQgLSAxXSk7ICAvLyBub3JtYWxpemUgbW9kdWx1c1xuICBpZiAobnNoID4gMCkge1xuICAgIHBtLmxTaGlmdFRvKG5zaCwgeSk7XG4gICAgcHQubFNoaWZ0VG8obnNoLCByKTtcbiAgfSBlbHNlIHtcbiAgICBwbS5jb3B5VG8oeSk7XG4gICAgcHQuY29weVRvKHIpO1xuICB9XG4gIHZhciB5cyA9IHkudDtcbiAgdmFyIHkwID0geVt5cyAtIDFdO1xuICBpZiAoeTAgPT0gMCkgcmV0dXJuO1xuICB2YXIgeXQgPSB5MCAqICgxIDw8IHRoaXMuRjEpICsgKCh5cyA+IDEpID8geVt5cyAtIDJdID4+IHRoaXMuRjIgOiAwKTtcbiAgdmFyIGQxID0gdGhpcy5GViAvIHl0LCBkMiA9ICgxIDw8IHRoaXMuRjEpIC8geXQsIGUgPSAxIDw8IHRoaXMuRjI7XG4gIHZhciBpID0gci50LCBqID0gaSAtIHlzLCB0ID0gKHEgPT0gbnVsbCkgPyBuYmkoKSA6IHE7XG4gIHkuZGxTaGlmdFRvKGosIHQpO1xuICBpZiAoci5jb21wYXJlVG8odCkgPj0gMCkge1xuICAgIHJbci50KytdID0gMTtcbiAgICByLnN1YlRvKHQsIHIpO1xuICB9XG4gIEJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbyh5cywgdCk7XG4gIHQuc3ViVG8oeSwgeSk7ICAvLyBcIm5lZ2F0aXZlXCIgeSBzbyB3ZSBjYW4gcmVwbGFjZSBzdWIgd2l0aCBhbSBsYXRlclxuICB3aGlsZSAoeS50IDwgeXMpIHlbeS50KytdID0gMDtcbiAgd2hpbGUgKC0taiA+PSAwKSB7XG4gICAgLy8gRXN0aW1hdGUgcXVvdGllbnQgZGlnaXRcbiAgICB2YXIgcWQgPVxuICAgICAgICAoclstLWldID09IHkwKSA/IHRoaXMuRE0gOiBNYXRoLmZsb29yKHJbaV0gKiBkMSArIChyW2kgLSAxXSArIGUpICogZDIpO1xuICAgIGlmICgocltpXSArPSB5LmFtKDAsIHFkLCByLCBqLCAwLCB5cykpIDwgcWQpIHsgIC8vIFRyeSBpdCBvdXRcbiAgICAgIHkuZGxTaGlmdFRvKGosIHQpO1xuICAgICAgci5zdWJUbyh0LCByKTtcbiAgICAgIHdoaWxlIChyW2ldIDwgLS1xZCkgci5zdWJUbyh0LCByKTtcbiAgICB9XG4gIH1cbiAgaWYgKHEgIT0gbnVsbCkge1xuICAgIHIuZHJTaGlmdFRvKHlzLCBxKTtcbiAgICBpZiAodHMgIT0gbXMpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhxLCBxKTtcbiAgfVxuICByLnQgPSB5cztcbiAgci5jbGFtcCgpO1xuICBpZiAobnNoID4gMCkgci5yU2hpZnRUbyhuc2gsIHIpOyAgLy8gRGVub3JtYWxpemUgcmVtYWluZGVyXG4gIGlmICh0cyA8IDApIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhyLCByKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyBtb2QgYVxuZnVuY3Rpb24gYm5Nb2QoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmFicygpLmRpdlJlbVRvKGEsIG51bGwsIHIpO1xuICBpZiAodGhpcy5zIDwgMCAmJiByLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLlpFUk8pID4gMCkgYS5zdWJUbyhyLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIE1vZHVsYXIgcmVkdWN0aW9uIHVzaW5nIFwiY2xhc3NpY1wiIGFsZ29yaXRobVxuZnVuY3Rpb24gQ2xhc3NpYyhtKSB7XG4gIHRoaXMubSA9IG07XG59XG5mdW5jdGlvbiBjQ29udmVydCh4KSB7XG4gIGlmICh4LnMgPCAwIHx8IHguY29tcGFyZVRvKHRoaXMubSkgPj0gMClcbiAgICByZXR1cm4geC5tb2QodGhpcy5tKTtcbiAgZWxzZVxuICAgIHJldHVybiB4O1xufVxuZnVuY3Rpb24gY1JldmVydCh4KSB7XG4gIHJldHVybiB4O1xufVxuZnVuY3Rpb24gY1JlZHVjZSh4KSB7XG4gIHguZGl2UmVtVG8odGhpcy5tLCBudWxsLCB4KTtcbn1cbmZ1bmN0aW9uIGNNdWxUbyh4LCB5LCByKSB7XG4gIHgubXVsdGlwbHlUbyh5LCByKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5mdW5jdGlvbiBjU3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuQ2xhc3NpYy5wcm90b3R5cGUuY29udmVydCA9IGNDb252ZXJ0O1xuQ2xhc3NpYy5wcm90b3R5cGUucmV2ZXJ0ID0gY1JldmVydDtcbkNsYXNzaWMucHJvdG90eXBlLnJlZHVjZSA9IGNSZWR1Y2U7XG5DbGFzc2ljLnByb3RvdHlwZS5tdWxUbyA9IGNNdWxUbztcbkNsYXNzaWMucHJvdG90eXBlLnNxclRvID0gY1NxclRvO1xuXG4vLyAocHJvdGVjdGVkKSByZXR1cm4gXCItMS90aGlzICUgMl5EQlwiOyB1c2VmdWwgZm9yIE1vbnQuIHJlZHVjdGlvblxuLy8ganVzdGlmaWNhdGlvbjpcbi8vICAgICAgICAgeHkgPT0gMSAobW9kIG0pXG4vLyAgICAgICAgIHh5ID0gIDEra21cbi8vICAgeHkoMi14eSkgPSAoMStrbSkoMS1rbSlcbi8vIHhbeSgyLXh5KV0gPSAxLWteMm1eMlxuLy8geFt5KDIteHkpXSA9PSAxIChtb2QgbV4yKVxuLy8gaWYgeSBpcyAxL3ggbW9kIG0sIHRoZW4geSgyLXh5KSBpcyAxL3ggbW9kIG1eMlxuLy8gc2hvdWxkIHJlZHVjZSB4IGFuZCB5KDIteHkpIGJ5IG1eMiBhdCBlYWNoIHN0ZXAgdG8ga2VlcCBzaXplIGJvdW5kZWQuXG4vLyBKUyBtdWx0aXBseSBcIm92ZXJmbG93c1wiIGRpZmZlcmVudGx5IGZyb20gQy9DKyssIHNvIGNhcmUgaXMgbmVlZGVkIGhlcmUuXG5mdW5jdGlvbiBibnBJbnZEaWdpdCgpIHtcbiAgaWYgKHRoaXMudCA8IDEpIHJldHVybiAwO1xuICB2YXIgeCA9IHRoaXNbMF07XG4gIGlmICgoeCAmIDEpID09IDApIHJldHVybiAwO1xuICB2YXIgeSA9IHggJiAzOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB5ID09IDEveCBtb2QgMl4yXG4gIHkgPSAoeSAqICgyIC0gKHggJiAweGYpICogeSkpICYgMHhmOyAgICAgICAgICAgICAgICAgICAgIC8vIHkgPT0gMS94IG1vZCAyXjRcbiAgeSA9ICh5ICogKDIgLSAoeCAmIDB4ZmYpICogeSkpICYgMHhmZjsgICAgICAgICAgICAgICAgICAgLy8geSA9PSAxL3ggbW9kIDJeOFxuICB5ID0gKHkgKiAoMiAtICgoKHggJiAweGZmZmYpICogeSkgJiAweGZmZmYpKSkgJiAweGZmZmY7ICAvLyB5ID09IDEveCBtb2QgMl4xNlxuICAvLyBsYXN0IHN0ZXAgLSBjYWxjdWxhdGUgaW52ZXJzZSBtb2QgRFYgZGlyZWN0bHk7XG4gIC8vIGFzc3VtZXMgMTYgPCBEQiA8PSAzMiBhbmQgYXNzdW1lcyBhYmlsaXR5IHRvIGhhbmRsZSA0OC1iaXQgaW50c1xuICB5ID0gKHkgKiAoMiAtIHggKiB5ICUgdGhpcy5EVikpICUgdGhpcy5EVjsgIC8vIHkgPT0gMS94IG1vZCAyXmRiaXRzXG4gIC8vIHdlIHJlYWxseSB3YW50IHRoZSBuZWdhdGl2ZSBpbnZlcnNlLCBhbmQgLURWIDwgeSA8IERWXG4gIHJldHVybiAoeSA+IDApID8gdGhpcy5EViAtIHkgOiAteTtcbn1cblxuLy8gTW9udGdvbWVyeSByZWR1Y3Rpb25cbmZ1bmN0aW9uIE1vbnRnb21lcnkobSkge1xuICB0aGlzLm0gPSBtO1xuICB0aGlzLm1wID0gbS5pbnZEaWdpdCgpO1xuICB0aGlzLm1wbCA9IHRoaXMubXAgJiAweDdmZmY7XG4gIHRoaXMubXBoID0gdGhpcy5tcCA+PiAxNTtcbiAgdGhpcy51bSA9ICgxIDw8IChtLkRCIC0gMTUpKSAtIDE7XG4gIHRoaXMubXQyID0gMiAqIG0udDtcbn1cblxuLy8geFIgbW9kIG1cbmZ1bmN0aW9uIG1vbnRDb252ZXJ0KHgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgeC5hYnMoKS5kbFNoaWZ0VG8odGhpcy5tLnQsIHIpO1xuICByLmRpdlJlbVRvKHRoaXMubSwgbnVsbCwgcik7XG4gIGlmICh4LnMgPCAwICYmIHIuY29tcGFyZVRvKEJpZ0ludGVnZXIuWkVSTykgPiAwKSB0aGlzLm0uc3ViVG8ociwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyB4L1IgbW9kIG1cbmZ1bmN0aW9uIG1vbnRSZXZlcnQoeCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB4LmNvcHlUbyhyKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG4gIHJldHVybiByO1xufVxuXG4vLyB4ID0geC9SIG1vZCBtIChIQUMgMTQuMzIpXG5mdW5jdGlvbiBtb250UmVkdWNlKHgpIHtcbiAgd2hpbGUgKHgudCA8PSB0aGlzLm10MikgIC8vIHBhZCB4IHNvIGFtIGhhcyBlbm91Z2ggcm9vbSBsYXRlclxuICAgIHhbeC50KytdID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm0udDsgKytpKSB7XG4gICAgLy8gZmFzdGVyIHdheSBvZiBjYWxjdWxhdGluZyB1MCA9IHhbaV0qbXAgbW9kIERWXG4gICAgdmFyIGogPSB4W2ldICYgMHg3ZmZmO1xuICAgIHZhciB1MCA9IChqICogdGhpcy5tcGwgK1xuICAgICAgICAgICAgICAoKChqICogdGhpcy5tcGggKyAoeFtpXSA+PiAxNSkgKiB0aGlzLm1wbCkgJiB0aGlzLnVtKSA8PCAxNSkpICZcbiAgICAgICAgeC5ETTtcbiAgICAvLyB1c2UgYW0gdG8gY29tYmluZSB0aGUgbXVsdGlwbHktc2hpZnQtYWRkIGludG8gb25lIGNhbGxcbiAgICBqID0gaSArIHRoaXMubS50O1xuICAgIHhbal0gKz0gdGhpcy5tLmFtKDAsIHUwLCB4LCBpLCAwLCB0aGlzLm0udCk7XG4gICAgLy8gcHJvcGFnYXRlIGNhcnJ5XG4gICAgd2hpbGUgKHhbal0gPj0geC5EVikge1xuICAgICAgeFtqXSAtPSB4LkRWO1xuICAgICAgeFsrK2pdKys7XG4gICAgfVxuICB9XG4gIHguY2xhbXAoKTtcbiAgeC5kclNoaWZ0VG8odGhpcy5tLnQsIHgpO1xuICBpZiAoeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB4LnN1YlRvKHRoaXMubSwgeCk7XG59XG5cbi8vIHIgPSBcInheMi9SIG1vZCBtXCI7IHggIT0gclxuZnVuY3Rpb24gbW9udFNxclRvKHgsIHIpIHtcbiAgeC5zcXVhcmVUbyhyKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5cbi8vIHIgPSBcInh5L1IgbW9kIG1cIjsgeCx5ICE9IHJcbmZ1bmN0aW9uIG1vbnRNdWxUbyh4LCB5LCByKSB7XG4gIHgubXVsdGlwbHlUbyh5LCByKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5cbk1vbnRnb21lcnkucHJvdG90eXBlLmNvbnZlcnQgPSBtb250Q29udmVydDtcbk1vbnRnb21lcnkucHJvdG90eXBlLnJldmVydCA9IG1vbnRSZXZlcnQ7XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5yZWR1Y2UgPSBtb250UmVkdWNlO1xuTW9udGdvbWVyeS5wcm90b3R5cGUubXVsVG8gPSBtb250TXVsVG87XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5zcXJUbyA9IG1vbnRTcXJUbztcblxuLy8gKHByb3RlY3RlZCkgdHJ1ZSBpZmYgdGhpcyBpcyBldmVuXG5mdW5jdGlvbiBibnBJc0V2ZW4oKSB7XG4gIHJldHVybiAoKHRoaXMudCA+IDApID8gKHRoaXNbMF0gJiAxKSA6IHRoaXMucykgPT0gMDtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpc15lLCBlIDwgMl4zMiwgZG9pbmcgc3FyIGFuZCBtdWwgd2l0aCBcInJcIiAoSEFDIDE0Ljc5KVxuZnVuY3Rpb24gYm5wRXhwKGUsIHopIHtcbiAgaWYgKGUgPiAweGZmZmZmZmZmIHx8IGUgPCAxKSByZXR1cm4gQmlnSW50ZWdlci5PTkU7XG4gIHZhciByID0gbmJpKCksIHIyID0gbmJpKCksIGcgPSB6LmNvbnZlcnQodGhpcyksIGkgPSBuYml0cyhlKSAtIDE7XG4gIGcuY29weVRvKHIpO1xuICB3aGlsZSAoLS1pID49IDApIHtcbiAgICB6LnNxclRvKHIsIHIyKTtcbiAgICBpZiAoKGUgJiAoMSA8PCBpKSkgPiAwKVxuICAgICAgei5tdWxUbyhyMiwgZywgcik7XG4gICAgZWxzZSB7XG4gICAgICB2YXIgdCA9IHI7XG4gICAgICByID0gcjI7XG4gICAgICByMiA9IHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiB6LnJldmVydChyKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpc15lICUgbSwgMCA8PSBlIDwgMl4zMlxuZnVuY3Rpb24gYm5Nb2RQb3dJbnQoZSwgbSkge1xuICB2YXIgejtcbiAgaWYgKGUgPCAyNTYgfHwgbS5pc0V2ZW4oKSlcbiAgICB6ID0gbmV3IENsYXNzaWMobSk7XG4gIGVsc2VcbiAgICB6ID0gbmV3IE1vbnRnb21lcnkobSk7XG4gIHJldHVybiB0aGlzLmV4cChlLCB6KTtcbn1cblxuLy8gcHJvdGVjdGVkXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb3B5VG8gPSBibnBDb3B5VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tSW50ID0gYm5wRnJvbUludDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21TdHJpbmcgPSBibnBGcm9tU3RyaW5nO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xhbXAgPSBibnBDbGFtcDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRsU2hpZnRUbyA9IGJucERMU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRyU2hpZnRUbyA9IGJucERSU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmxTaGlmdFRvID0gYm5wTFNoaWZ0VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5yU2hpZnRUbyA9IGJucFJTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3ViVG8gPSBibnBTdWJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5VG8gPSBibnBNdWx0aXBseVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlVG8gPSBibnBTcXVhcmVUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRpdlJlbVRvID0gYm5wRGl2UmVtVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnZEaWdpdCA9IGJucEludkRpZ2l0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaXNFdmVuID0gYm5wSXNFdmVuO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZXhwID0gYm5wRXhwO1xuXG4vLyBwdWJsaWNcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRvU3RyaW5nID0gYm5Ub1N0cmluZztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm5lZ2F0ZSA9IGJuTmVnYXRlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYWJzID0gYm5BYnM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb21wYXJlVG8gPSBibkNvbXBhcmVUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJpdExlbmd0aCA9IGJuQml0TGVuZ3RoO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kID0gYm5Nb2Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3dJbnQgPSBibk1vZFBvd0ludDtcblxuLy8gXCJjb25zdGFudHNcIlxuQmlnSW50ZWdlci5aRVJPID0gbmJ2KDApO1xuQmlnSW50ZWdlci5PTkUgPSBuYnYoMSk7XG5cbi8vIFBvb2wgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCBhbmQgZ3JlYXRlciB0aGFuIDMyLlxuLy8gQW4gYXJyYXkgb2YgYnl0ZXMgdGhlIHNpemUgb2YgdGhlIHBvb2wgd2lsbCBiZSBwYXNzZWQgdG8gaW5pdCgpXG52YXIgcm5nX3BzaXplID0gMjU2O1xuXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBkZWZhdWx0OiBCaWdJbnRlZ2VyLFxuICAgIEJpZ0ludGVnZXI6IEJpZ0ludGVnZXIsXG4gIH07XG59IGVsc2Uge1xuICB0aGlzLmpzYm4gPSB7XG4gICAgQmlnSW50ZWdlcjogQmlnSW50ZWdlcixcbiAgfTtcbn1cblxuLy8gQ29weXJpZ2h0IChjKSAyMDA1LTIwMDkgIFRvbSBXdVxuLy8gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbi8vIFNlZSBcIkxJQ0VOU0VcIiBmb3IgZGV0YWlscy5cblxuLy8gRXh0ZW5kZWQgSmF2YVNjcmlwdCBCTiBmdW5jdGlvbnMsIHJlcXVpcmVkIGZvciBSU0EgcHJpdmF0ZSBvcHMuXG5cbi8vIFZlcnNpb24gMS4xOiBuZXcgQmlnSW50ZWdlcihcIjBcIiwgMTApIHJldHVybnMgXCJwcm9wZXJcIiB6ZXJvXG4vLyBWZXJzaW9uIDEuMjogc3F1YXJlKCkgQVBJLCBpc1Byb2JhYmxlUHJpbWUgZml4XG5cbi8vIChwdWJsaWMpXG5mdW5jdGlvbiBibkNsb25lKCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmNvcHlUbyhyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiB2YWx1ZSBhcyBpbnRlZ2VyXG5mdW5jdGlvbiBibkludFZhbHVlKCkge1xuICBpZiAodGhpcy5zIDwgMCkge1xuICAgIGlmICh0aGlzLnQgPT0gMSlcbiAgICAgIHJldHVybiB0aGlzWzBdIC0gdGhpcy5EVjtcbiAgICBlbHNlIGlmICh0aGlzLnQgPT0gMClcbiAgICAgIHJldHVybiAtMTtcbiAgfSBlbHNlIGlmICh0aGlzLnQgPT0gMSlcbiAgICByZXR1cm4gdGhpc1swXTtcbiAgZWxzZSBpZiAodGhpcy50ID09IDApXG4gICAgcmV0dXJuIDA7XG4gIC8vIGFzc3VtZXMgMTYgPCBEQiA8IDMyXG4gIHJldHVybiAoKHRoaXNbMV0gJiAoKDEgPDwgKDMyIC0gdGhpcy5EQikpIC0gMSkpIDw8IHRoaXMuREIpIHwgdGhpc1swXTtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGJ5dGVcbmZ1bmN0aW9uIGJuQnl0ZVZhbHVlKCkge1xuICByZXR1cm4gKHRoaXMudCA9PSAwKSA/IHRoaXMucyA6ICh0aGlzWzBdIDw8IDI0KSA+PiAyNDtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIHNob3J0IChhc3N1bWVzIERCPj0xNilcbmZ1bmN0aW9uIGJuU2hvcnRWYWx1ZSgpIHtcbiAgcmV0dXJuICh0aGlzLnQgPT0gMCkgPyB0aGlzLnMgOiAodGhpc1swXSA8PCAxNikgPj4gMTY7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHJldHVybiB4IHMudC4gcl54IDwgRFZcbmZ1bmN0aW9uIGJucENodW5rU2l6ZShyKSB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGguTE4yICogdGhpcy5EQiAvIE1hdGgubG9nKHIpKTtcbn1cblxuLy8gKHB1YmxpYykgMCBpZiB0aGlzID09IDAsIDEgaWYgdGhpcyA+IDBcbmZ1bmN0aW9uIGJuU2lnTnVtKCkge1xuICBpZiAodGhpcy5zIDwgMClcbiAgICByZXR1cm4gLTE7XG4gIGVsc2UgaWYgKHRoaXMudCA8PSAwIHx8ICh0aGlzLnQgPT0gMSAmJiB0aGlzWzBdIDw9IDApKVxuICAgIHJldHVybiAwO1xuICBlbHNlXG4gICAgcmV0dXJuIDE7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvbnZlcnQgdG8gcmFkaXggc3RyaW5nXG5mdW5jdGlvbiBibnBUb1JhZGl4KGIpIHtcbiAgaWYgKGIgPT0gbnVsbCkgYiA9IDEwO1xuICBpZiAodGhpcy5zaWdudW0oKSA9PSAwIHx8IGIgPCAyIHx8IGIgPiAzNikgcmV0dXJuICcwJztcbiAgdmFyIGNzID0gdGhpcy5jaHVua1NpemUoYik7XG4gIHZhciBhID0gTWF0aC5wb3coYiwgY3MpO1xuICB2YXIgZCA9IG5idihhKSwgeSA9IG5iaSgpLCB6ID0gbmJpKCksIHIgPSAnJztcbiAgdGhpcy5kaXZSZW1UbyhkLCB5LCB6KTtcbiAgd2hpbGUgKHkuc2lnbnVtKCkgPiAwKSB7XG4gICAgciA9IChhICsgei5pbnRWYWx1ZSgpKS50b1N0cmluZyhiKS5zdWJzdHIoMSkgKyByO1xuICAgIHkuZGl2UmVtVG8oZCwgeSwgeik7XG4gIH1cbiAgcmV0dXJuIHouaW50VmFsdWUoKS50b1N0cmluZyhiKSArIHI7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvbnZlcnQgZnJvbSByYWRpeCBzdHJpbmdcbmZ1bmN0aW9uIGJucEZyb21SYWRpeChzLCBiKSB7XG4gIHRoaXMuZnJvbUludCgwKTtcbiAgaWYgKGIgPT0gbnVsbCkgYiA9IDEwO1xuICB2YXIgY3MgPSB0aGlzLmNodW5rU2l6ZShiKTtcbiAgdmFyIGQgPSBNYXRoLnBvdyhiLCBjcyksIG1pID0gZmFsc2UsIGogPSAwLCB3ID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHggPSBpbnRBdChzLCBpKTtcbiAgICBpZiAoeCA8IDApIHtcbiAgICAgIGlmIChzLmNoYXJBdChpKSA9PSAnLScgJiYgdGhpcy5zaWdudW0oKSA9PSAwKSBtaSA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgdyA9IGIgKiB3ICsgeDtcbiAgICBpZiAoKytqID49IGNzKSB7XG4gICAgICB0aGlzLmRNdWx0aXBseShkKTtcbiAgICAgIHRoaXMuZEFkZE9mZnNldCh3LCAwKTtcbiAgICAgIGogPSAwO1xuICAgICAgdyA9IDA7XG4gICAgfVxuICB9XG4gIGlmIChqID4gMCkge1xuICAgIHRoaXMuZE11bHRpcGx5KE1hdGgucG93KGIsIGopKTtcbiAgICB0aGlzLmRBZGRPZmZzZXQodywgMCk7XG4gIH1cbiAgaWYgKG1pKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcywgdGhpcyk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGFsdGVybmF0ZSBjb25zdHJ1Y3RvclxuZnVuY3Rpb24gYm5wRnJvbU51bWJlcihhLCBiLCBjKSB7XG4gIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgYikge1xuICAgIC8vIG5ldyBCaWdJbnRlZ2VyKGludCxpbnQsUk5HKVxuICAgIGlmIChhIDwgMilcbiAgICAgIHRoaXMuZnJvbUludCgxKTtcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZnJvbU51bWJlcihhLCBjKTtcbiAgICAgIGlmICghdGhpcy50ZXN0Qml0KGEgLSAxKSkgIC8vIGZvcmNlIE1TQiBzZXRcbiAgICAgICAgdGhpcy5iaXR3aXNlVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEgLSAxKSwgb3Bfb3IsIHRoaXMpO1xuICAgICAgaWYgKHRoaXMuaXNFdmVuKCkpIHRoaXMuZEFkZE9mZnNldCgxLCAwKTsgIC8vIGZvcmNlIG9kZFxuICAgICAgd2hpbGUgKCF0aGlzLmlzUHJvYmFibGVQcmltZShiKSkge1xuICAgICAgICB0aGlzLmRBZGRPZmZzZXQoMiwgMCk7XG4gICAgICAgIGlmICh0aGlzLmJpdExlbmd0aCgpID4gYSlcbiAgICAgICAgICB0aGlzLnN1YlRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhIC0gMSksIHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBuZXcgQmlnSW50ZWdlcihpbnQsUk5HKVxuICAgIHZhciB4ID0gbmV3IEFycmF5KCksIHQgPSBhICYgNztcbiAgICB4Lmxlbmd0aCA9IChhID4+IDMpICsgMTtcbiAgICBiLm5leHRCeXRlcyh4KTtcbiAgICBpZiAodCA+IDApXG4gICAgICB4WzBdICY9ICgoMSA8PCB0KSAtIDEpO1xuICAgIGVsc2VcbiAgICAgIHhbMF0gPSAwO1xuICAgIHRoaXMuZnJvbVN0cmluZyh4LCAyNTYpO1xuICB9XG59XG5cbi8vIChwdWJsaWMpIGNvbnZlcnQgdG8gYmlnZW5kaWFuIGJ5dGUgYXJyYXlcbmZ1bmN0aW9uIGJuVG9CeXRlQXJyYXkoKSB7XG4gIHZhciBpID0gdGhpcy50LCByID0gbmV3IEFycmF5KCk7XG4gIHJbMF0gPSB0aGlzLnM7XG4gIHZhciBwID0gdGhpcy5EQiAtIChpICogdGhpcy5EQikgJSA4LCBkLCBrID0gMDtcbiAgaWYgKGktLSA+IDApIHtcbiAgICBpZiAocCA8IHRoaXMuREIgJiYgKGQgPSB0aGlzW2ldID4+IHApICE9ICh0aGlzLnMgJiB0aGlzLkRNKSA+PiBwKVxuICAgICAgcltrKytdID0gZCB8ICh0aGlzLnMgPDwgKHRoaXMuREIgLSBwKSk7XG4gICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgaWYgKHAgPCA4KSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSAmICgoMSA8PCBwKSAtIDEpKSA8PCAoOCAtIHApO1xuICAgICAgICBkIHw9IHRoaXNbLS1pXSA+PiAocCArPSB0aGlzLkRCIC0gOCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkID0gKHRoaXNbaV0gPj4gKHAgLT0gOCkpICYgMHhmZjtcbiAgICAgICAgaWYgKHAgPD0gMCkge1xuICAgICAgICAgIHAgKz0gdGhpcy5EQjtcbiAgICAgICAgICAtLWk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgoZCAmIDB4ODApICE9IDApIGQgfD0gLTI1NjtcbiAgICAgIGlmIChrID09IDAgJiYgKHRoaXMucyAmIDB4ODApICE9IChkICYgMHg4MCkpICsraztcbiAgICAgIGlmIChrID4gMCB8fCBkICE9IHRoaXMucykgcltrKytdID0gZDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbmZ1bmN0aW9uIGJuRXF1YWxzKGEpIHtcbiAgcmV0dXJuICh0aGlzLmNvbXBhcmVUbyhhKSA9PSAwKTtcbn1cbmZ1bmN0aW9uIGJuTWluKGEpIHtcbiAgcmV0dXJuICh0aGlzLmNvbXBhcmVUbyhhKSA8IDApID8gdGhpcyA6IGE7XG59XG5mdW5jdGlvbiBibk1heChhKSB7XG4gIHJldHVybiAodGhpcy5jb21wYXJlVG8oYSkgPiAwKSA/IHRoaXMgOiBhO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyBvcCBhIChiaXR3aXNlKVxuZnVuY3Rpb24gYm5wQml0d2lzZVRvKGEsIG9wLCByKSB7XG4gIHZhciBpLCBmLCBtID0gTWF0aC5taW4oYS50LCB0aGlzLnQpO1xuICBmb3IgKGkgPSAwOyBpIDwgbTsgKytpKSByW2ldID0gb3AodGhpc1tpXSwgYVtpXSk7XG4gIGlmIChhLnQgPCB0aGlzLnQpIHtcbiAgICBmID0gYS5zICYgdGhpcy5ETTtcbiAgICBmb3IgKGkgPSBtOyBpIDwgdGhpcy50OyArK2kpIHJbaV0gPSBvcCh0aGlzW2ldLCBmKTtcbiAgICByLnQgPSB0aGlzLnQ7XG4gIH0gZWxzZSB7XG4gICAgZiA9IHRoaXMucyAmIHRoaXMuRE07XG4gICAgZm9yIChpID0gbTsgaSA8IGEudDsgKytpKSByW2ldID0gb3AoZiwgYVtpXSk7XG4gICAgci50ID0gYS50O1xuICB9XG4gIHIucyA9IG9wKHRoaXMucywgYS5zKTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHVibGljKSB0aGlzICYgYVxuZnVuY3Rpb24gb3BfYW5kKHgsIHkpIHtcbiAgcmV0dXJuIHggJiB5O1xufVxuZnVuY3Rpb24gYm5BbmQoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmJpdHdpc2VUbyhhLCBvcF9hbmQsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyB8IGFcbmZ1bmN0aW9uIG9wX29yKHgsIHkpIHtcbiAgcmV0dXJuIHggfCB5O1xufVxuZnVuY3Rpb24gYm5PcihhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX29yLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgXiBhXG5mdW5jdGlvbiBvcF94b3IoeCwgeSkge1xuICByZXR1cm4geCBeIHk7XG59XG5mdW5jdGlvbiBiblhvcihhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX3hvciwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzICYgfmFcbmZ1bmN0aW9uIG9wX2FuZG5vdCh4LCB5KSB7XG4gIHJldHVybiB4ICYgfnk7XG59XG5mdW5jdGlvbiBibkFuZE5vdChhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX2FuZG5vdCwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB+dGhpc1xuZnVuY3Rpb24gYm5Ob3QoKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHJbaV0gPSB0aGlzLkRNICYgfnRoaXNbaV07XG4gIHIudCA9IHRoaXMudDtcbiAgci5zID0gfnRoaXMucztcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgPDwgblxuZnVuY3Rpb24gYm5TaGlmdExlZnQobikge1xuICB2YXIgciA9IG5iaSgpO1xuICBpZiAobiA8IDApXG4gICAgdGhpcy5yU2hpZnRUbygtbiwgcik7XG4gIGVsc2VcbiAgICB0aGlzLmxTaGlmdFRvKG4sIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyA+PiBuXG5mdW5jdGlvbiBiblNoaWZ0UmlnaHQobikge1xuICB2YXIgciA9IG5iaSgpO1xuICBpZiAobiA8IDApXG4gICAgdGhpcy5sU2hpZnRUbygtbiwgcik7XG4gIGVsc2VcbiAgICB0aGlzLnJTaGlmdFRvKG4sIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gcmV0dXJuIGluZGV4IG9mIGxvd2VzdCAxLWJpdCBpbiB4LCB4IDwgMl4zMVxuZnVuY3Rpb24gbGJpdCh4KSB7XG4gIGlmICh4ID09IDApIHJldHVybiAtMTtcbiAgdmFyIHIgPSAwO1xuICBpZiAoKHggJiAweGZmZmYpID09IDApIHtcbiAgICB4ID4+PSAxNjtcbiAgICByICs9IDE2O1xuICB9XG4gIGlmICgoeCAmIDB4ZmYpID09IDApIHtcbiAgICB4ID4+PSA4O1xuICAgIHIgKz0gODtcbiAgfVxuICBpZiAoKHggJiAweGYpID09IDApIHtcbiAgICB4ID4+PSA0O1xuICAgIHIgKz0gNDtcbiAgfVxuICBpZiAoKHggJiAzKSA9PSAwKSB7XG4gICAgeCA+Pj0gMjtcbiAgICByICs9IDI7XG4gIH1cbiAgaWYgKCh4ICYgMSkgPT0gMCkgKytyO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJucyBpbmRleCBvZiBsb3dlc3QgMS1iaXQgKG9yIC0xIGlmIG5vbmUpXG5mdW5jdGlvbiBibkdldExvd2VzdFNldEJpdCgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnQ7ICsraSlcbiAgICBpZiAodGhpc1tpXSAhPSAwKSByZXR1cm4gaSAqIHRoaXMuREIgKyBsYml0KHRoaXNbaV0pO1xuICBpZiAodGhpcy5zIDwgMCkgcmV0dXJuIHRoaXMudCAqIHRoaXMuREI7XG4gIHJldHVybiAtMTtcbn1cblxuLy8gcmV0dXJuIG51bWJlciBvZiAxIGJpdHMgaW4geFxuZnVuY3Rpb24gY2JpdCh4KSB7XG4gIHZhciByID0gMDtcbiAgd2hpbGUgKHggIT0gMCkge1xuICAgIHggJj0geCAtIDE7XG4gICAgKytyO1xuICB9XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gbnVtYmVyIG9mIHNldCBiaXRzXG5mdW5jdGlvbiBibkJpdENvdW50KCkge1xuICB2YXIgciA9IDAsIHggPSB0aGlzLnMgJiB0aGlzLkRNO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudDsgKytpKSByICs9IGNiaXQodGhpc1tpXSBeIHgpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdHJ1ZSBpZmYgbnRoIGJpdCBpcyBzZXRcbmZ1bmN0aW9uIGJuVGVzdEJpdChuKSB7XG4gIHZhciBqID0gTWF0aC5mbG9vcihuIC8gdGhpcy5EQik7XG4gIGlmIChqID49IHRoaXMudCkgcmV0dXJuICh0aGlzLnMgIT0gMCk7XG4gIHJldHVybiAoKHRoaXNbal0gJiAoMSA8PCAobiAlIHRoaXMuREIpKSkgIT0gMCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgb3AgKDE8PG4pXG5mdW5jdGlvbiBibnBDaGFuZ2VCaXQobiwgb3ApIHtcbiAgdmFyIHIgPSBCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQobik7XG4gIHRoaXMuYml0d2lzZVRvKHIsIG9wLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgfCAoMTw8bilcbmZ1bmN0aW9uIGJuU2V0Qml0KG4pIHtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sIG9wX29yKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAmIH4oMTw8bilcbmZ1bmN0aW9uIGJuQ2xlYXJCaXQobikge1xuICByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobiwgb3BfYW5kbm90KTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyBeICgxPDxuKVxuZnVuY3Rpb24gYm5GbGlwQml0KG4pIHtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sIG9wX3hvcik7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzICsgYVxuZnVuY3Rpb24gYm5wQWRkVG8oYSwgcikge1xuICB2YXIgaSA9IDAsIGMgPSAwLCBtID0gTWF0aC5taW4oYS50LCB0aGlzLnQpO1xuICB3aGlsZSAoaSA8IG0pIHtcbiAgICBjICs9IHRoaXNbaV0gKyBhW2ldO1xuICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgIGMgPj49IHRoaXMuREI7XG4gIH1cbiAgaWYgKGEudCA8IHRoaXMudCkge1xuICAgIGMgKz0gYS5zO1xuICAgIHdoaWxlIChpIDwgdGhpcy50KSB7XG4gICAgICBjICs9IHRoaXNbaV07XG4gICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgfVxuICAgIGMgKz0gdGhpcy5zO1xuICB9IGVsc2Uge1xuICAgIGMgKz0gdGhpcy5zO1xuICAgIHdoaWxlIChpIDwgYS50KSB7XG4gICAgICBjICs9IGFbaV07XG4gICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgfVxuICAgIGMgKz0gYS5zO1xuICB9XG4gIHIucyA9IChjIDwgMCkgPyAtMSA6IDA7XG4gIGlmIChjID4gMClcbiAgICByW2krK10gPSBjO1xuICBlbHNlIGlmIChjIDwgLTEpXG4gICAgcltpKytdID0gdGhpcy5EViArIGM7XG4gIHIudCA9IGk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyArIGFcbmZ1bmN0aW9uIGJuQWRkKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5hZGRUbyhhLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgLSBhXG5mdW5jdGlvbiBiblN1YnRyYWN0KGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5zdWJUbyhhLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgKiBhXG5mdW5jdGlvbiBibk11bHRpcGx5KGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5tdWx0aXBseVRvKGEsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpc14yXG5mdW5jdGlvbiBiblNxdWFyZSgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5zcXVhcmVUbyhyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgLyBhXG5mdW5jdGlvbiBibkRpdmlkZShhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuZGl2UmVtVG8oYSwgciwgbnVsbCk7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzICUgYVxuZnVuY3Rpb24gYm5SZW1haW5kZXIoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmRpdlJlbVRvKGEsIG51bGwsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgW3RoaXMvYSx0aGlzJWFdXG5mdW5jdGlvbiBibkRpdmlkZUFuZFJlbWFpbmRlcihhKSB7XG4gIHZhciBxID0gbmJpKCksIHIgPSBuYmkoKTtcbiAgdGhpcy5kaXZSZW1UbyhhLCBxLCByKTtcbiAgcmV0dXJuIG5ldyBBcnJheShxLCByKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyAqPSBuLCB0aGlzID49IDAsIDEgPCBuIDwgRFZcbmZ1bmN0aW9uIGJucERNdWx0aXBseShuKSB7XG4gIHRoaXNbdGhpcy50XSA9IHRoaXMuYW0oMCwgbiAtIDEsIHRoaXMsIDAsIDAsIHRoaXMudCk7XG4gICsrdGhpcy50O1xuICB0aGlzLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgKz0gbiA8PCB3IHdvcmRzLCB0aGlzID49IDBcbmZ1bmN0aW9uIGJucERBZGRPZmZzZXQobiwgdykge1xuICBpZiAobiA9PSAwKSByZXR1cm47XG4gIHdoaWxlICh0aGlzLnQgPD0gdykgdGhpc1t0aGlzLnQrK10gPSAwO1xuICB0aGlzW3ddICs9IG47XG4gIHdoaWxlICh0aGlzW3ddID49IHRoaXMuRFYpIHtcbiAgICB0aGlzW3ddIC09IHRoaXMuRFY7XG4gICAgaWYgKCsrdyA+PSB0aGlzLnQpIHRoaXNbdGhpcy50KytdID0gMDtcbiAgICArK3RoaXNbd107XG4gIH1cbn1cblxuLy8gQSBcIm51bGxcIiByZWR1Y2VyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmZ1bmN0aW9uIE51bGxFeHAoKSB7fVxuZnVuY3Rpb24gbk5vcCh4KSB7XG4gIHJldHVybiB4O1xufVxuZnVuY3Rpb24gbk11bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpO1xufVxuZnVuY3Rpb24gblNxclRvKHgsIHIpIHtcbiAgeC5zcXVhcmVUbyhyKTtcbn1cblxuTnVsbEV4cC5wcm90b3R5cGUuY29udmVydCA9IG5Ob3A7XG5OdWxsRXhwLnByb3RvdHlwZS5yZXZlcnQgPSBuTm9wO1xuTnVsbEV4cC5wcm90b3R5cGUubXVsVG8gPSBuTXVsVG87XG5OdWxsRXhwLnByb3RvdHlwZS5zcXJUbyA9IG5TcXJUbztcblxuLy8gKHB1YmxpYykgdGhpc15lXG5mdW5jdGlvbiBiblBvdyhlKSB7XG4gIHJldHVybiB0aGlzLmV4cChlLCBuZXcgTnVsbEV4cCgpKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IGxvd2VyIG4gd29yZHMgb2YgXCJ0aGlzICogYVwiLCBhLnQgPD0gblxuLy8gXCJ0aGlzXCIgc2hvdWxkIGJlIHRoZSBsYXJnZXIgb25lIGlmIGFwcHJvcHJpYXRlLlxuZnVuY3Rpb24gYm5wTXVsdGlwbHlMb3dlclRvKGEsIG4sIHIpIHtcbiAgdmFyIGkgPSBNYXRoLm1pbih0aGlzLnQgKyBhLnQsIG4pO1xuICByLnMgPSAwOyAgLy8gYXNzdW1lcyBhLHRoaXMgPj0gMFxuICByLnQgPSBpO1xuICB3aGlsZSAoaSA+IDApIHJbLS1pXSA9IDA7XG4gIHZhciBqO1xuICBmb3IgKGogPSByLnQgLSB0aGlzLnQ7IGkgPCBqOyArK2kpXG4gICAgcltpICsgdGhpcy50XSA9IHRoaXMuYW0oMCwgYVtpXSwgciwgaSwgMCwgdGhpcy50KTtcbiAgZm9yIChqID0gTWF0aC5taW4oYS50LCBuKTsgaSA8IGo7ICsraSkgdGhpcy5hbSgwLCBhW2ldLCByLCBpLCAwLCBuIC0gaSk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IFwidGhpcyAqIGFcIiB3aXRob3V0IGxvd2VyIG4gd29yZHMsIG4gPiAwXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseVVwcGVyVG8oYSwgbiwgcikge1xuICAtLW47XG4gIHZhciBpID0gci50ID0gdGhpcy50ICsgYS50IC0gbjtcbiAgci5zID0gMDsgIC8vIGFzc3VtZXMgYSx0aGlzID49IDBcbiAgd2hpbGUgKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yIChpID0gTWF0aC5tYXgobiAtIHRoaXMudCwgMCk7IGkgPCBhLnQ7ICsraSlcbiAgICByW3RoaXMudCArIGkgLSBuXSA9IHRoaXMuYW0obiAtIGksIGFbaV0sIHIsIDAsIDAsIHRoaXMudCArIGkgLSBuKTtcbiAgci5jbGFtcCgpO1xuICByLmRyU2hpZnRUbygxLCByKTtcbn1cblxuLy8gQmFycmV0dCBtb2R1bGFyIHJlZHVjdGlvblxuZnVuY3Rpb24gQmFycmV0dChtKSB7XG4gIC8vIHNldHVwIEJhcnJldHRcbiAgdGhpcy5yMiA9IG5iaSgpO1xuICB0aGlzLnEzID0gbmJpKCk7XG4gIEJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbygyICogbS50LCB0aGlzLnIyKTtcbiAgdGhpcy5tdSA9IHRoaXMucjIuZGl2aWRlKG0pO1xuICB0aGlzLm0gPSBtO1xufVxuXG5mdW5jdGlvbiBiYXJyZXR0Q29udmVydCh4KSB7XG4gIGlmICh4LnMgPCAwIHx8IHgudCA+IDIgKiB0aGlzLm0udClcbiAgICByZXR1cm4geC5tb2QodGhpcy5tKTtcbiAgZWxzZSBpZiAoeC5jb21wYXJlVG8odGhpcy5tKSA8IDApXG4gICAgcmV0dXJuIHg7XG4gIGVsc2Uge1xuICAgIHZhciByID0gbmJpKCk7XG4gICAgeC5jb3B5VG8ocik7XG4gICAgdGhpcy5yZWR1Y2Uocik7XG4gICAgcmV0dXJuIHI7XG4gIH1cbn1cblxuZnVuY3Rpb24gYmFycmV0dFJldmVydCh4KSB7XG4gIHJldHVybiB4O1xufVxuXG4vLyB4ID0geCBtb2QgbSAoSEFDIDE0LjQyKVxuZnVuY3Rpb24gYmFycmV0dFJlZHVjZSh4KSB7XG4gIHguZHJTaGlmdFRvKHRoaXMubS50IC0gMSwgdGhpcy5yMik7XG4gIGlmICh4LnQgPiB0aGlzLm0udCArIDEpIHtcbiAgICB4LnQgPSB0aGlzLm0udCArIDE7XG4gICAgeC5jbGFtcCgpO1xuICB9XG4gIHRoaXMubXUubXVsdGlwbHlVcHBlclRvKHRoaXMucjIsIHRoaXMubS50ICsgMSwgdGhpcy5xMyk7XG4gIHRoaXMubS5tdWx0aXBseUxvd2VyVG8odGhpcy5xMywgdGhpcy5tLnQgKyAxLCB0aGlzLnIyKTtcbiAgd2hpbGUgKHguY29tcGFyZVRvKHRoaXMucjIpIDwgMCkgeC5kQWRkT2Zmc2V0KDEsIHRoaXMubS50ICsgMSk7XG4gIHguc3ViVG8odGhpcy5yMiwgeCk7XG4gIHdoaWxlICh4LmNvbXBhcmVUbyh0aGlzLm0pID49IDApIHguc3ViVG8odGhpcy5tLCB4KTtcbn1cblxuLy8gciA9IHheMiBtb2QgbTsgeCAhPSByXG5mdW5jdGlvbiBiYXJyZXR0U3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuLy8gciA9IHgqeSBtb2QgbTsgeCx5ICE9IHJcbmZ1bmN0aW9uIGJhcnJldHRNdWxUbyh4LCB5LCByKSB7XG4gIHgubXVsdGlwbHlUbyh5LCByKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5cbkJhcnJldHQucHJvdG90eXBlLmNvbnZlcnQgPSBiYXJyZXR0Q29udmVydDtcbkJhcnJldHQucHJvdG90eXBlLnJldmVydCA9IGJhcnJldHRSZXZlcnQ7XG5CYXJyZXR0LnByb3RvdHlwZS5yZWR1Y2UgPSBiYXJyZXR0UmVkdWNlO1xuQmFycmV0dC5wcm90b3R5cGUubXVsVG8gPSBiYXJyZXR0TXVsVG87XG5CYXJyZXR0LnByb3RvdHlwZS5zcXJUbyA9IGJhcnJldHRTcXJUbztcblxuLy8gKHB1YmxpYykgdGhpc15lICUgbSAoSEFDIDE0Ljg1KVxuZnVuY3Rpb24gYm5Nb2RQb3coZSwgbSkge1xuICB2YXIgaSA9IGUuYml0TGVuZ3RoKCksIGssIHIgPSBuYnYoMSksIHo7XG4gIGlmIChpIDw9IDApXG4gICAgcmV0dXJuIHI7XG4gIGVsc2UgaWYgKGkgPCAxOClcbiAgICBrID0gMTtcbiAgZWxzZSBpZiAoaSA8IDQ4KVxuICAgIGsgPSAzO1xuICBlbHNlIGlmIChpIDwgMTQ0KVxuICAgIGsgPSA0O1xuICBlbHNlIGlmIChpIDwgNzY4KVxuICAgIGsgPSA1O1xuICBlbHNlXG4gICAgayA9IDY7XG4gIGlmIChpIDwgOClcbiAgICB6ID0gbmV3IENsYXNzaWMobSk7XG4gIGVsc2UgaWYgKG0uaXNFdmVuKCkpXG4gICAgeiA9IG5ldyBCYXJyZXR0KG0pO1xuICBlbHNlXG4gICAgeiA9IG5ldyBNb250Z29tZXJ5KG0pO1xuXG4gIC8vIHByZWNvbXB1dGF0aW9uXG4gIHZhciBnID0gbmV3IEFycmF5KCksIG4gPSAzLCBrMSA9IGsgLSAxLCBrbSA9ICgxIDw8IGspIC0gMTtcbiAgZ1sxXSA9IHouY29udmVydCh0aGlzKTtcbiAgaWYgKGsgPiAxKSB7XG4gICAgdmFyIGcyID0gbmJpKCk7XG4gICAgei5zcXJUbyhnWzFdLCBnMik7XG4gICAgd2hpbGUgKG4gPD0ga20pIHtcbiAgICAgIGdbbl0gPSBuYmkoKTtcbiAgICAgIHoubXVsVG8oZzIsIGdbbiAtIDJdLCBnW25dKTtcbiAgICAgIG4gKz0gMjtcbiAgICB9XG4gIH1cblxuICB2YXIgaiA9IGUudCAtIDEsIHcsIGlzMSA9IHRydWUsIHIyID0gbmJpKCksIHQ7XG4gIGkgPSBuYml0cyhlW2pdKSAtIDE7XG4gIHdoaWxlIChqID49IDApIHtcbiAgICBpZiAoaSA+PSBrMSlcbiAgICAgIHcgPSAoZVtqXSA+PiAoaSAtIGsxKSkgJiBrbTtcbiAgICBlbHNlIHtcbiAgICAgIHcgPSAoZVtqXSAmICgoMSA8PCAoaSArIDEpKSAtIDEpKSA8PCAoazEgLSBpKTtcbiAgICAgIGlmIChqID4gMCkgdyB8PSBlW2ogLSAxXSA+PiAodGhpcy5EQiArIGkgLSBrMSk7XG4gICAgfVxuXG4gICAgbiA9IGs7XG4gICAgd2hpbGUgKCh3ICYgMSkgPT0gMCkge1xuICAgICAgdyA+Pj0gMTtcbiAgICAgIC0tbjtcbiAgICB9XG4gICAgaWYgKChpIC09IG4pIDwgMCkge1xuICAgICAgaSArPSB0aGlzLkRCO1xuICAgICAgLS1qO1xuICAgIH1cbiAgICBpZiAoaXMxKSB7ICAvLyByZXQgPT0gMSwgZG9uJ3QgYm90aGVyIHNxdWFyaW5nIG9yIG11bHRpcGx5aW5nIGl0XG4gICAgICBnW3ddLmNvcHlUbyhyKTtcbiAgICAgIGlzMSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobiA+IDEpIHtcbiAgICAgICAgei5zcXJUbyhyLCByMik7XG4gICAgICAgIHouc3FyVG8ocjIsIHIpO1xuICAgICAgICBuIC09IDI7XG4gICAgICB9XG4gICAgICBpZiAobiA+IDApXG4gICAgICAgIHouc3FyVG8ociwgcjIpO1xuICAgICAgZWxzZSB7XG4gICAgICAgIHQgPSByO1xuICAgICAgICByID0gcjI7XG4gICAgICAgIHIyID0gdDtcbiAgICAgIH1cbiAgICAgIHoubXVsVG8ocjIsIGdbd10sIHIpO1xuICAgIH1cblxuICAgIHdoaWxlIChqID49IDAgJiYgKGVbal0gJiAoMSA8PCBpKSkgPT0gMCkge1xuICAgICAgei5zcXJUbyhyLCByMik7XG4gICAgICB0ID0gcjtcbiAgICAgIHIgPSByMjtcbiAgICAgIHIyID0gdDtcbiAgICAgIGlmICgtLWkgPCAwKSB7XG4gICAgICAgIGkgPSB0aGlzLkRCIC0gMTtcbiAgICAgICAgLS1qO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gei5yZXZlcnQocik7XG59XG5cbi8vIChwdWJsaWMpIGdjZCh0aGlzLGEpIChIQUMgMTQuNTQpXG5mdW5jdGlvbiBibkdDRChhKSB7XG4gIHZhciB4ID0gKHRoaXMucyA8IDApID8gdGhpcy5uZWdhdGUoKSA6IHRoaXMuY2xvbmUoKTtcbiAgdmFyIHkgPSAoYS5zIDwgMCkgPyBhLm5lZ2F0ZSgpIDogYS5jbG9uZSgpO1xuICBpZiAoeC5jb21wYXJlVG8oeSkgPCAwKSB7XG4gICAgdmFyIHQgPSB4O1xuICAgIHggPSB5O1xuICAgIHkgPSB0O1xuICB9XG4gIHZhciBpID0geC5nZXRMb3dlc3RTZXRCaXQoKSwgZyA9IHkuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gIGlmIChnIDwgMCkgcmV0dXJuIHg7XG4gIGlmIChpIDwgZykgZyA9IGk7XG4gIGlmIChnID4gMCkge1xuICAgIHguclNoaWZ0VG8oZywgeCk7XG4gICAgeS5yU2hpZnRUbyhnLCB5KTtcbiAgfVxuICB3aGlsZSAoeC5zaWdudW0oKSA+IDApIHtcbiAgICBpZiAoKGkgPSB4LmdldExvd2VzdFNldEJpdCgpKSA+IDApIHguclNoaWZ0VG8oaSwgeCk7XG4gICAgaWYgKChpID0geS5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB5LnJTaGlmdFRvKGksIHkpO1xuICAgIGlmICh4LmNvbXBhcmVUbyh5KSA+PSAwKSB7XG4gICAgICB4LnN1YlRvKHksIHgpO1xuICAgICAgeC5yU2hpZnRUbygxLCB4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgeS5zdWJUbyh4LCB5KTtcbiAgICAgIHkuclNoaWZ0VG8oMSwgeSk7XG4gICAgfVxuICB9XG4gIGlmIChnID4gMCkgeS5sU2hpZnRUbyhnLCB5KTtcbiAgcmV0dXJuIHk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgJSBuLCBuIDwgMl4yNlxuZnVuY3Rpb24gYm5wTW9kSW50KG4pIHtcbiAgaWYgKG4gPD0gMCkgcmV0dXJuIDA7XG4gIHZhciBkID0gdGhpcy5EViAlIG4sIHIgPSAodGhpcy5zIDwgMCkgPyBuIC0gMSA6IDA7XG4gIGlmICh0aGlzLnQgPiAwKVxuICAgIGlmIChkID09IDApXG4gICAgICByID0gdGhpc1swXSAlIG47XG4gICAgZWxzZVxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSByID0gKGQgKiByICsgdGhpc1tpXSkgJSBuO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgMS90aGlzICUgbSAoSEFDIDE0LjYxKVxuZnVuY3Rpb24gYm5Nb2RJbnZlcnNlKG0pIHtcbiAgdmFyIGFjID0gbS5pc0V2ZW4oKTtcbiAgaWYgKCh0aGlzLmlzRXZlbigpICYmIGFjKSB8fCBtLnNpZ251bSgpID09IDApIHJldHVybiBCaWdJbnRlZ2VyLlpFUk87XG4gIHZhciB1ID0gbS5jbG9uZSgpLCB2ID0gdGhpcy5jbG9uZSgpO1xuICB2YXIgYSA9IG5idigxKSwgYiA9IG5idigwKSwgYyA9IG5idigwKSwgZCA9IG5idigxKTtcbiAgd2hpbGUgKHUuc2lnbnVtKCkgIT0gMCkge1xuICAgIHdoaWxlICh1LmlzRXZlbigpKSB7XG4gICAgICB1LnJTaGlmdFRvKDEsIHUpO1xuICAgICAgaWYgKGFjKSB7XG4gICAgICAgIGlmICghYS5pc0V2ZW4oKSB8fCAhYi5pc0V2ZW4oKSkge1xuICAgICAgICAgIGEuYWRkVG8odGhpcywgYSk7XG4gICAgICAgICAgYi5zdWJUbyhtLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBhLnJTaGlmdFRvKDEsIGEpO1xuICAgICAgfSBlbHNlIGlmICghYi5pc0V2ZW4oKSlcbiAgICAgICAgYi5zdWJUbyhtLCBiKTtcbiAgICAgIGIuclNoaWZ0VG8oMSwgYik7XG4gICAgfVxuICAgIHdoaWxlICh2LmlzRXZlbigpKSB7XG4gICAgICB2LnJTaGlmdFRvKDEsIHYpO1xuICAgICAgaWYgKGFjKSB7XG4gICAgICAgIGlmICghYy5pc0V2ZW4oKSB8fCAhZC5pc0V2ZW4oKSkge1xuICAgICAgICAgIGMuYWRkVG8odGhpcywgYyk7XG4gICAgICAgICAgZC5zdWJUbyhtLCBkKTtcbiAgICAgICAgfVxuICAgICAgICBjLnJTaGlmdFRvKDEsIGMpO1xuICAgICAgfSBlbHNlIGlmICghZC5pc0V2ZW4oKSlcbiAgICAgICAgZC5zdWJUbyhtLCBkKTtcbiAgICAgIGQuclNoaWZ0VG8oMSwgZCk7XG4gICAgfVxuICAgIGlmICh1LmNvbXBhcmVUbyh2KSA+PSAwKSB7XG4gICAgICB1LnN1YlRvKHYsIHUpO1xuICAgICAgaWYgKGFjKSBhLnN1YlRvKGMsIGEpO1xuICAgICAgYi5zdWJUbyhkLCBiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdi5zdWJUbyh1LCB2KTtcbiAgICAgIGlmIChhYykgYy5zdWJUbyhhLCBjKTtcbiAgICAgIGQuc3ViVG8oYiwgZCk7XG4gICAgfVxuICB9XG4gIGlmICh2LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgIT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcbiAgaWYgKGQuY29tcGFyZVRvKG0pID49IDApIHJldHVybiBkLnN1YnRyYWN0KG0pO1xuICBpZiAoZC5zaWdudW0oKSA8IDApXG4gICAgZC5hZGRUbyhtLCBkKTtcbiAgZWxzZVxuICAgIHJldHVybiBkO1xuICBpZiAoZC5zaWdudW0oKSA8IDApXG4gICAgcmV0dXJuIGQuYWRkKG0pO1xuICBlbHNlXG4gICAgcmV0dXJuIGQ7XG59XG5cbnZhciBsb3dwcmltZXMgPSBbXG4gIDIsICAgMywgICA1LCAgIDcsICAgMTEsICAxMywgIDE3LCAgMTksICAyMywgIDI5LCAgMzEsICAzNywgIDQxLCAgNDMsXG4gIDQ3LCAgNTMsICA1OSwgIDYxLCAgNjcsICA3MSwgIDczLCAgNzksICA4MywgIDg5LCAgOTcsICAxMDEsIDEwMywgMTA3LFxuICAxMDksIDExMywgMTI3LCAxMzEsIDEzNywgMTM5LCAxNDksIDE1MSwgMTU3LCAxNjMsIDE2NywgMTczLCAxNzksIDE4MSxcbiAgMTkxLCAxOTMsIDE5NywgMTk5LCAyMTEsIDIyMywgMjI3LCAyMjksIDIzMywgMjM5LCAyNDEsIDI1MSwgMjU3LCAyNjMsXG4gIDI2OSwgMjcxLCAyNzcsIDI4MSwgMjgzLCAyOTMsIDMwNywgMzExLCAzMTMsIDMxNywgMzMxLCAzMzcsIDM0NywgMzQ5LFxuICAzNTMsIDM1OSwgMzY3LCAzNzMsIDM3OSwgMzgzLCAzODksIDM5NywgNDAxLCA0MDksIDQxOSwgNDIxLCA0MzEsIDQzMyxcbiAgNDM5LCA0NDMsIDQ0OSwgNDU3LCA0NjEsIDQ2MywgNDY3LCA0NzksIDQ4NywgNDkxLCA0OTksIDUwMywgNTA5LCA1MjEsXG4gIDUyMywgNTQxLCA1NDcsIDU1NywgNTYzLCA1NjksIDU3MSwgNTc3LCA1ODcsIDU5MywgNTk5LCA2MDEsIDYwNywgNjEzLFxuICA2MTcsIDYxOSwgNjMxLCA2NDEsIDY0MywgNjQ3LCA2NTMsIDY1OSwgNjYxLCA2NzMsIDY3NywgNjgzLCA2OTEsIDcwMSxcbiAgNzA5LCA3MTksIDcyNywgNzMzLCA3MzksIDc0MywgNzUxLCA3NTcsIDc2MSwgNzY5LCA3NzMsIDc4NywgNzk3LCA4MDksXG4gIDgxMSwgODIxLCA4MjMsIDgyNywgODI5LCA4MzksIDg1MywgODU3LCA4NTksIDg2MywgODc3LCA4ODEsIDg4MywgODg3LFxuICA5MDcsIDkxMSwgOTE5LCA5MjksIDkzNywgOTQxLCA5NDcsIDk1MywgOTY3LCA5NzEsIDk3NywgOTgzLCA5OTEsIDk5N1xuXTtcbnZhciBscGxpbSA9ICgxIDw8IDI2KSAvIGxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoIC0gMV07XG5cbi8vIChwdWJsaWMpIHRlc3QgcHJpbWFsaXR5IHdpdGggY2VydGFpbnR5ID49IDEtLjVedFxuZnVuY3Rpb24gYm5Jc1Byb2JhYmxlUHJpbWUodCkge1xuICB2YXIgaSwgeCA9IHRoaXMuYWJzKCk7XG4gIGlmICh4LnQgPT0gMSAmJiB4WzBdIDw9IGxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbG93cHJpbWVzLmxlbmd0aDsgKytpKVxuICAgICAgaWYgKHhbMF0gPT0gbG93cHJpbWVzW2ldKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHguaXNFdmVuKCkpIHJldHVybiBmYWxzZTtcbiAgaSA9IDE7XG4gIHdoaWxlIChpIDwgbG93cHJpbWVzLmxlbmd0aCkge1xuICAgIHZhciBtID0gbG93cHJpbWVzW2ldLCBqID0gaSArIDE7XG4gICAgd2hpbGUgKGogPCBsb3dwcmltZXMubGVuZ3RoICYmIG0gPCBscGxpbSkgbSAqPSBsb3dwcmltZXNbaisrXTtcbiAgICBtID0geC5tb2RJbnQobSk7XG4gICAgd2hpbGUgKGkgPCBqKVxuICAgICAgaWYgKG0gJSBsb3dwcmltZXNbaSsrXSA9PSAwKSByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHgubWlsbGVyUmFiaW4odCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRydWUgaWYgcHJvYmFibHkgcHJpbWUgKEhBQyA0LjI0LCBNaWxsZXItUmFiaW4pXG5mdW5jdGlvbiBibnBNaWxsZXJSYWJpbih0KSB7XG4gIHZhciBuMSA9IHRoaXMuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpO1xuICB2YXIgayA9IG4xLmdldExvd2VzdFNldEJpdCgpO1xuICBpZiAoayA8PSAwKSByZXR1cm4gZmFsc2U7XG4gIHZhciByID0gbjEuc2hpZnRSaWdodChrKTtcbiAgdCA9ICh0ICsgMSkgPj4gMTtcbiAgaWYgKHQgPiBsb3dwcmltZXMubGVuZ3RoKSB0ID0gbG93cHJpbWVzLmxlbmd0aDtcbiAgdmFyIGEgPSBuYmkoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0OyArK2kpIHtcbiAgICAvLyBQaWNrIGJhc2VzIGF0IHJhbmRvbSwgaW5zdGVhZCBvZiBzdGFydGluZyBhdCAyXG4gICAgYS5mcm9tSW50KGxvd3ByaW1lc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBsb3dwcmltZXMubGVuZ3RoKV0pO1xuICAgIHZhciB5ID0gYS5tb2RQb3cociwgdGhpcyk7XG4gICAgaWYgKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSAhPSAwICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICB2YXIgaiA9IDE7XG4gICAgICB3aGlsZSAoaisrIDwgayAmJiB5LmNvbXBhcmVUbyhuMSkgIT0gMCkge1xuICAgICAgICB5ID0geS5tb2RQb3dJbnQoMiwgdGhpcyk7XG4gICAgICAgIGlmICh5LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHkuY29tcGFyZVRvKG4xKSAhPSAwKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBwcm90ZWN0ZWRcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNodW5rU2l6ZSA9IGJucENodW5rU2l6ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRvUmFkaXggPSBibnBUb1JhZGl4O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVJhZGl4ID0gYm5wRnJvbVJhZGl4O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbU51bWJlciA9IGJucEZyb21OdW1iZXI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXR3aXNlVG8gPSBibnBCaXR3aXNlVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jaGFuZ2VCaXQgPSBibnBDaGFuZ2VCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGRUbyA9IGJucEFkZFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZE11bHRpcGx5ID0gYm5wRE11bHRpcGx5O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZEFkZE9mZnNldCA9IGJucERBZGRPZmZzZXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseUxvd2VyVG8gPSBibnBNdWx0aXBseUxvd2VyVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseVVwcGVyVG8gPSBibnBNdWx0aXBseVVwcGVyVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnQgPSBibnBNb2RJbnQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5taWxsZXJSYWJpbiA9IGJucE1pbGxlclJhYmluO1xuXG4vLyBwdWJsaWNcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNsb25lID0gYm5DbG9uZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmludFZhbHVlID0gYm5JbnRWYWx1ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJ5dGVWYWx1ZSA9IGJuQnl0ZVZhbHVlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2hvcnRWYWx1ZSA9IGJuU2hvcnRWYWx1ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNpZ251bSA9IGJuU2lnTnVtO1xuQmlnSW50ZWdlci5wcm90b3R5cGUudG9CeXRlQXJyYXkgPSBiblRvQnl0ZUFycmF5O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZXF1YWxzID0gYm5FcXVhbHM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5taW4gPSBibk1pbjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1heCA9IGJuTWF4O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYW5kID0gYm5BbmQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5vciA9IGJuT3I7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS54b3IgPSBiblhvcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFuZE5vdCA9IGJuQW5kTm90O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubm90ID0gYm5Ob3Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdExlZnQgPSBiblNoaWZ0TGVmdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0UmlnaHQgPSBiblNoaWZ0UmlnaHQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5nZXRMb3dlc3RTZXRCaXQgPSBibkdldExvd2VzdFNldEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJpdENvdW50ID0gYm5CaXRDb3VudDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRlc3RCaXQgPSBiblRlc3RCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zZXRCaXQgPSBiblNldEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNsZWFyQml0ID0gYm5DbGVhckJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZsaXBCaXQgPSBibkZsaXBCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hZGQgPSBibkFkZDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnN1YnRyYWN0ID0gYm5TdWJ0cmFjdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5ID0gYm5NdWx0aXBseTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZSA9IGJuRGl2aWRlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUucmVtYWluZGVyID0gYm5SZW1haW5kZXI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGVBbmRSZW1haW5kZXIgPSBibkRpdmlkZUFuZFJlbWFpbmRlcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZFBvdyA9IGJuTW9kUG93O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kSW52ZXJzZSA9IGJuTW9kSW52ZXJzZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnBvdyA9IGJuUG93O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZ2NkID0gYm5HQ0Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc1Byb2JhYmxlUHJpbWUgPSBibklzUHJvYmFibGVQcmltZTtcblxuLy8gSlNCTi1zcGVjaWZpYyBleHRlbnNpb25cbkJpZ0ludGVnZXIucHJvdG90eXBlLnNxdWFyZSA9IGJuU3F1YXJlO1xuXG4vLyBCaWdJbnRlZ2VyIGludGVyZmFjZXMgbm90IGltcGxlbWVudGVkIGluIGpzYm46XG5cbi8vIEJpZ0ludGVnZXIoaW50IHNpZ251bSwgYnl0ZVtdIG1hZ25pdHVkZSlcbi8vIGRvdWJsZSBkb3VibGVWYWx1ZSgpXG4vLyBmbG9hdCBmbG9hdFZhbHVlKClcbi8vIGludCBoYXNoQ29kZSgpXG4vLyBsb25nIGxvbmdWYWx1ZSgpXG4vLyBzdGF0aWMgQmlnSW50ZWdlciB2YWx1ZU9mKGxvbmcgdmFsKVxuXG4vLyBEZXBlbmRzIG9uIGpzYm4uanMgYW5kIHJuZy5qc1xuXG4vLyBWZXJzaW9uIDEuMTogc3VwcG9ydCB1dGYtOCBlbmNvZGluZyBpbiBwa2NzMXBhZDJcblxuLy8gY29udmVydCBhIChoZXgpIHN0cmluZyB0byBhIGJpZ251bSBvYmplY3RcbmZ1bmN0aW9uIHBhcnNlQmlnSW50KHN0ciwgcikge1xuICByZXR1cm4gbmV3IEJpZ0ludGVnZXIoc3RyLCByKTtcbn1cblxuZnVuY3Rpb24gbGluZWJyayhzLCBuKSB7XG4gIHZhciByZXQgPSAnJztcbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAoaSArIG4gPCBzLmxlbmd0aCkge1xuICAgIHJldCArPSBzLnN1YnN0cmluZyhpLCBpICsgbikgKyAnXFxuJztcbiAgICBpICs9IG47XG4gIH1cbiAgcmV0dXJuIHJldCArIHMuc3Vic3RyaW5nKGksIHMubGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gYnl0ZTJIZXgoYikge1xuICBpZiAoYiA8IDB4MTApXG4gICAgcmV0dXJuICcwJyArIGIudG9TdHJpbmcoMTYpO1xuICBlbHNlXG4gICAgcmV0dXJuIGIudG9TdHJpbmcoMTYpO1xufVxuXG4vLyBQS0NTIzEgKHR5cGUgMiwgcmFuZG9tKSBwYWQgaW5wdXQgc3RyaW5nIHMgdG8gbiBieXRlcywgYW5kIHJldHVybiBhIGJpZ2ludFxuZnVuY3Rpb24gcGtjczFwYWQyKHMsIG4pIHtcbiAgaWYgKG4gPCBzLmxlbmd0aCArIDExKSB7ICAvLyBUT0RPOiBmaXggZm9yIHV0Zi04XG4gICAgYWxlcnQoJ01lc3NhZ2UgdG9vIGxvbmcgZm9yIFJTQScpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZhciBiYSA9IG5ldyBBcnJheSgpO1xuICB2YXIgaSA9IHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKGkgPj0gMCAmJiBuID4gMCkge1xuICAgIHZhciBjID0gcy5jaGFyQ29kZUF0KGktLSk7XG4gICAgaWYgKGMgPCAxMjgpIHsgIC8vIGVuY29kZSB1c2luZyB1dGYtOFxuICAgICAgYmFbLS1uXSA9IGM7XG4gICAgfSBlbHNlIGlmICgoYyA+IDEyNykgJiYgKGMgPCAyMDQ4KSkge1xuICAgICAgYmFbLS1uXSA9IChjICYgNjMpIHwgMTI4O1xuICAgICAgYmFbLS1uXSA9IChjID4+IDYpIHwgMTkyO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYVstLW5dID0gKGMgJiA2MykgfCAxMjg7XG4gICAgICBiYVstLW5dID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xuICAgICAgYmFbLS1uXSA9IChjID4+IDEyKSB8IDIyNDtcbiAgICB9XG4gIH1cbiAgYmFbLS1uXSA9IDA7XG4gIHZhciBybmcgPSBuZXcgU2VjdXJlUmFuZG9tKCk7XG4gIHZhciB4ID0gbmV3IEFycmF5KCk7XG4gIHdoaWxlIChuID4gMikgeyAgLy8gcmFuZG9tIG5vbi16ZXJvIHBhZFxuICAgIHhbMF0gPSAwO1xuICAgIHdoaWxlICh4WzBdID09IDApIHJuZy5uZXh0Qnl0ZXMoeCk7XG4gICAgYmFbLS1uXSA9IHhbMF07XG4gIH1cbiAgYmFbLS1uXSA9IDI7XG4gIGJhWy0tbl0gPSAwO1xuICByZXR1cm4gbmV3IEJpZ0ludGVnZXIoYmEpO1xufVxuXG4vLyBcImVtcHR5XCIgUlNBIGtleSBjb25zdHJ1Y3RvclxuZnVuY3Rpb24gUlNBS2V5KCkge1xuICB0aGlzLm4gPSBudWxsO1xuICB0aGlzLmUgPSAwO1xuICB0aGlzLmQgPSBudWxsO1xuICB0aGlzLnAgPSBudWxsO1xuICB0aGlzLnEgPSBudWxsO1xuICB0aGlzLmRtcDEgPSBudWxsO1xuICB0aGlzLmRtcTEgPSBudWxsO1xuICB0aGlzLmNvZWZmID0gbnVsbDtcbn1cblxuLy8gU2V0IHRoZSBwdWJsaWMga2V5IGZpZWxkcyBOIGFuZCBlIGZyb20gaGV4IHN0cmluZ3NcbmZ1bmN0aW9uIFJTQVNldFB1YmxpYyhOLCBFKSB7XG4gIGlmIChOICE9IG51bGwgJiYgRSAhPSBudWxsICYmIE4ubGVuZ3RoID4gMCAmJiBFLmxlbmd0aCA+IDApIHtcbiAgICB0aGlzLm4gPSBwYXJzZUJpZ0ludChOLCAxNik7XG4gICAgdGhpcy5lID0gcGFyc2VJbnQoRSwgMTYpO1xuICB9IGVsc2VcbiAgICBhbGVydCgnSW52YWxpZCBSU0EgcHVibGljIGtleScpO1xufVxuXG4vLyBTZXQgdGhlIHByaXZhdGUga2V5IGZpZWxkcyBOLCBlLCBkIGFuZCBDUlQgcGFyYW1zIGZyb20gaGV4IHN0cmluZ3NcbmZ1bmN0aW9uIFJTQVNldFByaXZhdGVFeChOLEUsRCxQLFEsRFAsRFEsQykge1xuICAgIGlmKE4gIT0gbnVsbCAmJiBFICE9IG51bGwgJiYgTi5sZW5ndGggPiAwICYmIEUubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5uID0gcGFyc2VCaWdJbnQoTiwxNik7XG4gICAgICB0aGlzLmUgPSBwYXJzZUludChFLDE2KTtcbiAgICAgIHRoaXMuZCA9IHBhcnNlQmlnSW50KEQsMTYpO1xuICAgICAgdGhpcy5wID0gcGFyc2VCaWdJbnQoUCwxNik7XG4gICAgICB0aGlzLnEgPSBwYXJzZUJpZ0ludChRLDE2KTtcbiAgICAgIHRoaXMuZG1wMSA9IHBhcnNlQmlnSW50KERQLDE2KTtcbiAgICAgIHRoaXMuZG1xMSA9IHBhcnNlQmlnSW50KERRLDE2KTtcbiAgICAgIHRoaXMuY29lZmYgPSBwYXJzZUJpZ0ludChDLDE2KTtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgYWxlcnQoXCJJbnZhbGlkIFJTQSBwcml2YXRlIGtleVwiKTtcbiAgfVxuXG4vLyBQZXJmb3JtIHJhdyBwcml2YXRlIG9wZXJhdGlvbiBvbiBcInhcIjogcmV0dXJuIHheZCAobW9kIG4pXG5mdW5jdGlvbiBSU0FEb1ByaXZhdGUoeCkge1xuICBpZih0aGlzLnAgPT0gbnVsbCB8fCB0aGlzLnEgPT0gbnVsbClcbiAgICByZXR1cm4geC5tb2RQb3codGhpcy5kLCB0aGlzLm4pO1xuXG4gIC8vIFRPRE86IHJlLWNhbGN1bGF0ZSBhbnkgbWlzc2luZyBDUlQgcGFyYW1zXG4gIHZhciB4cCA9IHgubW9kKHRoaXMucCkubW9kUG93KHRoaXMuZG1wMSwgdGhpcy5wKTtcbiAgdmFyIHhxID0geC5tb2QodGhpcy5xKS5tb2RQb3codGhpcy5kbXExLCB0aGlzLnEpO1xuXG4gIHdoaWxlKHhwLmNvbXBhcmVUbyh4cSkgPCAwKVxuICAgIHhwID0geHAuYWRkKHRoaXMucCk7XG4gIHJldHVybiB4cC5zdWJ0cmFjdCh4cSkubXVsdGlwbHkodGhpcy5jb2VmZikubW9kKHRoaXMucCkubXVsdGlwbHkodGhpcy5xKS5hZGQoeHEpO1xufVxuXG4vLyBQZXJmb3JtIHJhdyBwdWJsaWMgb3BlcmF0aW9uIG9uIFwieFwiOiByZXR1cm4geF5lIChtb2QgbilcbmZ1bmN0aW9uIFJTQURvUHVibGljKHgpIHtcbiAgcmV0dXJuIHgubW9kUG93SW50KHRoaXMuZSwgdGhpcy5uKTtcbn1cblxuLy8gUmV0dXJuIHRoZSBQS0NTIzEgUlNBIGVuY3J5cHRpb24gb2YgXCJ0ZXh0XCIgYXMgYW4gZXZlbi1sZW5ndGggaGV4IHN0cmluZ1xuZnVuY3Rpb24gUlNBRW5jcnlwdCh0ZXh0KSB7XG4gIHZhciBtID0gcGtjczFwYWQyKHRleHQsICh0aGlzLm4uYml0TGVuZ3RoKCkgKyA3KSA+PiAzKTtcbiAgaWYgKG0gPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIHZhciBjID0gdGhpcy5kb1B1YmxpYyhtKTtcbiAgaWYgKGMgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gIHZhciBoID0gYy50b1N0cmluZygxNik7XG4gIGlmICgoaC5sZW5ndGggJiAxKSA9PSAwKVxuICAgIHJldHVybiBoO1xuICBlbHNlXG4gICAgcmV0dXJuICcwJyArIGg7XG59XG5cbi8vIFJldHVybiB0aGUgUEtDUyMxIFJTQSBlbmNyeXB0aW9uIG9mIFwidGV4dFwiIGFzIGEgQmFzZTY0LWVuY29kZWQgc3RyaW5nXG4vLyBmdW5jdGlvbiBSU0FFbmNyeXB0QjY0KHRleHQpIHtcbi8vICB2YXIgaCA9IHRoaXMuZW5jcnlwdCh0ZXh0KTtcbi8vICBpZihoKSByZXR1cm4gaGV4MmI2NChoKTsgZWxzZSByZXR1cm4gbnVsbDtcbi8vfVxuXG4vLyBwcm90ZWN0ZWRcblJTQUtleS5wcm90b3R5cGUuZG9QdWJsaWMgPSBSU0FEb1B1YmxpYztcblxuLy8gcHVibGljXG5SU0FLZXkucHJvdG90eXBlLmRvUHJpdmF0ZSA9IFJTQURvUHJpdmF0ZTtcblJTQUtleS5wcm90b3R5cGUuc2V0UHVibGljID0gUlNBU2V0UHVibGljO1xuUlNBS2V5LnByb3RvdHlwZS5zZXRQcml2YXRlRXggPSBSU0FTZXRQcml2YXRlRXg7XG5SU0FLZXkucHJvdG90eXBlLmVuY3J5cHQgPSBSU0FFbmNyeXB0O1xuLy8gUlNBS2V5LnByb3RvdHlwZS5lbmNyeXB0X2I2NCA9IFJTQUVuY3J5cHRCNjQ7XG5cbi8vIFJhbmRvbSBudW1iZXIgZ2VuZXJhdG9yIC0gcmVxdWlyZXMgYSBQUk5HIGJhY2tlbmQsIGUuZy4gcHJuZzQuanNcblxuLy8gRm9yIGJlc3QgcmVzdWx0cywgcHV0IGNvZGUgbGlrZVxuLy8gPGJvZHkgb25DbGljaz0ncm5nX3NlZWRfdGltZSgpOycgb25LZXlQcmVzcz0ncm5nX3NlZWRfdGltZSgpOyc+XG4vLyBpbiB5b3VyIG1haW4gSFRNTCBkb2N1bWVudC5cblxudmFyIHJuZ19zdGF0ZTtcbnZhciBybmdfcG9vbDtcbnZhciBybmdfcHB0cjtcblxuLy8gTWl4IGluIGEgMzItYml0IGludGVnZXIgaW50byB0aGUgcG9vbFxuZnVuY3Rpb24gcm5nX3NlZWRfaW50KHgpIHtcbiAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0geCAmIDI1NTtcbiAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0gKHggPj4gOCkgJiAyNTU7XG4gIHJuZ19wb29sW3JuZ19wcHRyKytdIF49ICh4ID4+IDE2KSAmIDI1NTtcbiAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0gKHggPj4gMjQpICYgMjU1O1xuICBpZiAocm5nX3BwdHIgPj0gcm5nX3BzaXplKSBybmdfcHB0ciAtPSBybmdfcHNpemU7XG59XG5cbi8vIE1peCBpbiB0aGUgY3VycmVudCB0aW1lICh3L21pbGxpc2Vjb25kcykgaW50byB0aGUgcG9vbFxuZnVuY3Rpb24gcm5nX3NlZWRfdGltZSgpIHtcbiAgcm5nX3NlZWRfaW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbn1cblxuLy8gSW5pdGlhbGl6ZSB0aGUgcG9vbCB3aXRoIGp1bmsgaWYgbmVlZGVkLlxuaWYgKHJuZ19wb29sID09IG51bGwpIHtcbiAgcm5nX3Bvb2wgPSBuZXcgQXJyYXkoKTtcbiAgcm5nX3BwdHIgPSAwO1xuICB2YXIgdDtcbiAgaWYgKGluQnJvd3NlciAmJiB3aW5kb3cuY3J5cHRvICYmIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKSB7XG4gICAgLy8gVXNlIHdlYmNyeXB0byBpZiBhdmFpbGFibGVcbiAgICB2YXIgdWEgPSBuZXcgVWludDhBcnJheSgzMik7XG4gICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXModWEpO1xuICAgIGZvciAodCA9IDA7IHQgPCAzMjsgKyt0KSBybmdfcG9vbFtybmdfcHB0cisrXSA9IHVhW3RdO1xuICB9XG4gIGlmIChpbkJyb3dzZXIgJiYgbmF2aWdhdG9yLmFwcE5hbWUgPT0gJ05ldHNjYXBlJyAmJlxuICAgICAgbmF2aWdhdG9yLmFwcFZlcnNpb24gPCAnNScgJiYgd2luZG93LmNyeXB0bykge1xuICAgIC8vIEV4dHJhY3QgZW50cm9weSAoMjU2IGJpdHMpIGZyb20gTlM0IFJORyBpZiBhdmFpbGFibGVcbiAgICB2YXIgeiA9IHdpbmRvdy5jcnlwdG8ucmFuZG9tKDMyKTtcbiAgICBmb3IgKHQgPSAwOyB0IDwgei5sZW5ndGg7ICsrdCkgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSB6LmNoYXJDb2RlQXQodCkgJiAyNTU7XG4gIH1cbiAgd2hpbGUgKHJuZ19wcHRyIDwgcm5nX3BzaXplKSB7ICAvLyBleHRyYWN0IHNvbWUgcmFuZG9tbmVzcyBmcm9tIE1hdGgucmFuZG9tKClcbiAgICB0ID0gTWF0aC5mbG9vcig2NTUzNiAqIE1hdGgucmFuZG9tKCkpO1xuICAgIHJuZ19wb29sW3JuZ19wcHRyKytdID0gdCA+Pj4gODtcbiAgICBybmdfcG9vbFtybmdfcHB0cisrXSA9IHQgJiAyNTU7XG4gIH1cbiAgcm5nX3BwdHIgPSAwO1xuICBybmdfc2VlZF90aW1lKCk7XG4gIC8vIHJuZ19zZWVkX2ludCh3aW5kb3cuc2NyZWVuWCk7XG4gIC8vIHJuZ19zZWVkX2ludCh3aW5kb3cuc2NyZWVuWSk7XG59XG5cbmZ1bmN0aW9uIHJuZ19nZXRfYnl0ZSgpIHtcbiAgaWYgKHJuZ19zdGF0ZSA9PSBudWxsKSB7XG4gICAgcm5nX3NlZWRfdGltZSgpO1xuICAgIHJuZ19zdGF0ZSA9IHBybmdfbmV3c3RhdGUoKTtcbiAgICBybmdfc3RhdGUuaW5pdChybmdfcG9vbCk7XG4gICAgZm9yIChybmdfcHB0ciA9IDA7IHJuZ19wcHRyIDwgcm5nX3Bvb2wubGVuZ3RoOyArK3JuZ19wcHRyKVxuICAgICAgcm5nX3Bvb2xbcm5nX3BwdHJdID0gMDtcbiAgICBybmdfcHB0ciA9IDA7XG4gICAgLy8gcm5nX3Bvb2wgPSBudWxsO1xuICB9XG4gIC8vIFRPRE86IGFsbG93IHJlc2VlZGluZyBhZnRlciBmaXJzdCByZXF1ZXN0XG4gIHJldHVybiBybmdfc3RhdGUubmV4dCgpO1xufVxuXG5mdW5jdGlvbiBybmdfZ2V0X2J5dGVzKGJhKSB7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAwOyBpIDwgYmEubGVuZ3RoOyArK2kpIGJhW2ldID0gcm5nX2dldF9ieXRlKCk7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZnVuY3Rpb24gU2VjdXJlUmFuZG9tKCkge31cblxuU2VjdXJlUmFuZG9tLnByb3RvdHlwZS5uZXh0Qnl0ZXMgPSBybmdfZ2V0X2J5dGVzO1xuXG4vLyBwcm5nNC5qcyAtIHVzZXMgQXJjZm91ciBhcyBhIFBSTkdcblxuZnVuY3Rpb24gQXJjZm91cigpIHtcbiAgdGhpcy5pID0gMDtcbiAgdGhpcy5qID0gMDtcbiAgdGhpcy5TID0gbmV3IEFycmF5KCk7XG59XG5cbi8vIEluaXRpYWxpemUgYXJjZm91ciBjb250ZXh0IGZyb20ga2V5LCBhbiBhcnJheSBvZiBpbnRzLCBlYWNoIGZyb20gWzAuLjI1NV1cbmZ1bmN0aW9uIEFSQzRpbml0KGtleSkge1xuICB2YXIgaSwgaiwgdDtcbiAgZm9yIChpID0gMDsgaSA8IDI1NjsgKytpKSB0aGlzLlNbaV0gPSBpO1xuICBqID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gICAgaiA9IChqICsgdGhpcy5TW2ldICsga2V5W2kgJSBrZXkubGVuZ3RoXSkgJiAyNTU7XG4gICAgdCA9IHRoaXMuU1tpXTtcbiAgICB0aGlzLlNbaV0gPSB0aGlzLlNbal07XG4gICAgdGhpcy5TW2pdID0gdDtcbiAgfVxuICB0aGlzLmkgPSAwO1xuICB0aGlzLmogPSAwO1xufVxuXG5mdW5jdGlvbiBBUkM0bmV4dCgpIHtcbiAgdmFyIHQ7XG4gIHRoaXMuaSA9ICh0aGlzLmkgKyAxKSAmIDI1NTtcbiAgdGhpcy5qID0gKHRoaXMuaiArIHRoaXMuU1t0aGlzLmldKSAmIDI1NTtcbiAgdCA9IHRoaXMuU1t0aGlzLmldO1xuICB0aGlzLlNbdGhpcy5pXSA9IHRoaXMuU1t0aGlzLmpdO1xuICB0aGlzLlNbdGhpcy5qXSA9IHQ7XG4gIHJldHVybiB0aGlzLlNbKHQgKyB0aGlzLlNbdGhpcy5pXSkgJiAyNTVdO1xufVxuXG5BcmNmb3VyLnByb3RvdHlwZS5pbml0ID0gQVJDNGluaXQ7XG5BcmNmb3VyLnByb3RvdHlwZS5uZXh0ID0gQVJDNG5leHQ7XG5cbi8vIFBsdWcgaW4geW91ciBSTkcgY29uc3RydWN0b3IgaGVyZVxuZnVuY3Rpb24gcHJuZ19uZXdzdGF0ZSgpIHtcbiAgcmV0dXJuIG5ldyBBcmNmb3VyKCk7XG59XG5cbi8vIFBvb2wgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCBhbmQgZ3JlYXRlciB0aGFuIDMyLlxuLy8gQW4gYXJyYXkgb2YgYnl0ZXMgdGhlIHNpemUgb2YgdGhlIHBvb2wgd2lsbCBiZSBwYXNzZWQgdG8gaW5pdCgpXG52YXIgcm5nX3BzaXplID0gMjU2O1xuXG5pZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgIGRlZmF1bHQ6IEJpZ0ludGVnZXIsXG4gICAgICBCaWdJbnRlZ2VyOiBCaWdJbnRlZ2VyLFxuICAgICAgUlNBS2V5OiBSU0FLZXksXG4gIH07XG59IGVsc2Uge1xuICB0aGlzLmpzYm4gPSB7XG4gICAgQmlnSW50ZWdlcjogQmlnSW50ZWdlcixcbiAgICBSU0FLZXk6IFJTQUtleSxcbiAgfTtcbn1cblxufSkuY2FsbCh0aGlzKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDE4IFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWZlciA9IHZvaWQgMDtcbi8vIENyZWF0ZSBhIHByb21pc2Ugd2l0aCBleHBvc2VkIHJlc29sdmUgYW5kIHJlamVjdCBjYWxsYmFja3MuXG5mdW5jdGlvbiBkZWZlcigpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGxldCByZXNvbHZlID0gbnVsbDtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGxldCByZWplY3QgPSBudWxsO1xuICAgIGNvbnN0IHAgPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IFtyZXNvbHZlLCByZWplY3RdID0gW3JlcywgcmVqXSk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihwLCB7IHJlc29sdmUsIHJlamVjdCB9KTtcbn1cbmV4cG9ydHMuZGVmZXIgPSBkZWZlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pZ25vcmVDYWNoZVVuYWN0aW9uYWJsZUVycm9ycyA9IGV4cG9ydHMuZ2V0RXJyb3JNZXNzYWdlID0gdm9pZCAwO1xuLy8gQXR0ZW1wdCB0byBjb2VyY2UgYW4gZXJyb3Igb2JqZWN0IGludG8gYSBzdHJpbmcgbWVzc2FnZS5cbi8vIFNvbWV0aW1lcyBhbiBlcnJvciBtZXNzYWdlIGlzIHdyYXBwZWQgaW4gYW4gRXJyb3Igb2JqZWN0LCBzb21ldGltZXMgbm90LlxuZnVuY3Rpb24gZ2V0RXJyb3JNZXNzYWdlKGUpIHtcbiAgICBpZiAoZSAmJiB0eXBlb2YgZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3QgZXJyb3JPYmplY3QgPSBlO1xuICAgICAgICBpZiAoZXJyb3JPYmplY3QubWVzc2FnZSkgeyAvLyByZWd1bGFyIEVycm9yIE9iamVjdFxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhlcnJvck9iamVjdC5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChlcnJvck9iamVjdC5lcnJvcj8ubWVzc2FnZSkgeyAvLyBBUEkgcmVzdWx0XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKGVycm9yT2JqZWN0LmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFzU3RyaW5nID0gU3RyaW5nKGUpO1xuICAgIGlmIChhc1N0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoc3RyaW5naWZ5RXJyb3IpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBmYWlsdXJlcyBhbmQganVzdCBmYWxsIHRocm91Z2hcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXNTdHJpbmc7XG59XG5leHBvcnRzLmdldEVycm9yTWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZTtcbi8vIE9jY2FzaW9uYWxseSBvcGVyYXRpb25zIHVzaW5nIHRoZSBjYWNoZSBBUEkgdGhyb3c6XG4vLyAnVW5rbm93bkVycm9yOiBVbmV4cGVjdGVkIGludGVybmFsIGVycm9yLiB7fSdcbi8vIEl0J3Mgbm90IGNsZWFyIHVuZGVyIHdoaWNoIGNpcmN1bXN0YW5jZXMgdGhpcyBjYW4gb2NjdXIuIEEgZGl2ZSBvZlxuLy8gdGhlIENocm9taXVtIGNvZGUgZGlkbid0IHNoZWQgbXVjaCBsaWdodDpcbi8vIGh0dHBzOi8vc291cmNlLmNocm9taXVtLm9yZy9jaHJvbWl1bS9jaHJvbWl1bS9zcmMvKy9tYWluOnRoaXJkX3BhcnR5L2JsaW5rL3JlbmRlcmVyL21vZHVsZXMvY2FjaGVfc3RvcmFnZS9jYWNoZV9zdG9yYWdlX2Vycm9yLmNjO2w9MjY7ZHJjPTRjZmU4NjQ4MmIwMDBlODQ4MDA5MDc3NzgzYmEzNWY4M2YzYzNjZmVcbi8vIGh0dHBzOi8vc291cmNlLmNocm9taXVtLm9yZy9jaHJvbWl1bS9jaHJvbWl1bS9zcmMvKy9tYWluOmNvbnRlbnQvYnJvd3Nlci9jYWNoZV9zdG9yYWdlL2NhY2hlX3N0b3JhZ2VfY2FjaGUuY2M7bD0xNjg2O2RyYz1hYjY4YzA1YmViNzkwZDA0ZDFjYjdmZDhmYWEwYTE5N2ZiNDBkMzk5XG4vLyBHaXZlbiB0aGUgZXJyb3IgaXMgbm90IGFjdGlvbmFibGUgYXQgcHJlc2VudCBhbmQgY2FjaGluZyBpcyAnYmVzdFxuLy8gZWZmb3J0JyBpbiBhbnkgY2FzZSBpZ25vcmUgdGhpcyBlcnJvci4gV2Ugd2lsbCB3YW50IHRvIHRocm93IGZvclxuLy8gZXJyb3JzIGluIGdlbmVyYWwgdGhvdWdoIHNvIGFzIG5vdCB0byBoaWRlIGVycm9ycyB3ZSBhY3R1YWxseSBjb3VsZFxuLy8gZml4LlxuLy8gU2VlIGIvMjI3Nzg1NjY1IGZvciBhbiBleGFtcGxlLlxuZnVuY3Rpb24gaWdub3JlQ2FjaGVVbmFjdGlvbmFibGVFcnJvcnMoZSwgcmVzdWx0KSB7XG4gICAgaWYgKGdldEVycm9yTWVzc2FnZShlKS5pbmNsdWRlcygnVW5rbm93bkVycm9yJykpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgfVxufVxuZXhwb3J0cy5pZ25vcmVDYWNoZVVuYWN0aW9uYWJsZUVycm9ycyA9IGlnbm9yZUNhY2hlVW5hY3Rpb25hYmxlRXJyb3JzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMTggVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFzc2VydFVucmVhY2hhYmxlID0gZXhwb3J0cy5yZXBvcnRFcnJvciA9IGV4cG9ydHMuc2V0RXJyb3JIYW5kbGVyID0gZXhwb3J0cy5hc3NlcnRGYWxzZSA9IGV4cG9ydHMuYXNzZXJ0VHJ1ZSA9IGV4cG9ydHMuYXNzZXJ0RXhpc3RzID0gdm9pZCAwO1xubGV0IGVycm9ySGFuZGxlciA9IChfKSA9PiB7IH07XG5mdW5jdGlvbiBhc3NlcnRFeGlzdHModmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIGRvZXNuXFwndCBleGlzdCcpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5leHBvcnRzLmFzc2VydEV4aXN0cyA9IGFzc2VydEV4aXN0cztcbmZ1bmN0aW9uIGFzc2VydFRydWUodmFsdWUsIG9wdE1zZykge1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG9wdE1zZyA/PyAnRmFpbGVkIGFzc2VydGlvbicpO1xuICAgIH1cbn1cbmV4cG9ydHMuYXNzZXJ0VHJ1ZSA9IGFzc2VydFRydWU7XG5mdW5jdGlvbiBhc3NlcnRGYWxzZSh2YWx1ZSwgb3B0TXNnKSB7XG4gICAgYXNzZXJ0VHJ1ZSghdmFsdWUsIG9wdE1zZyk7XG59XG5leHBvcnRzLmFzc2VydEZhbHNlID0gYXNzZXJ0RmFsc2U7XG5mdW5jdGlvbiBzZXRFcnJvckhhbmRsZXIoaGFuZGxlcikge1xuICAgIGVycm9ySGFuZGxlciA9IGhhbmRsZXI7XG59XG5leHBvcnRzLnNldEVycm9ySGFuZGxlciA9IHNldEVycm9ySGFuZGxlcjtcbmZ1bmN0aW9uIHJlcG9ydEVycm9yKGVycikge1xuICAgIGxldCBlcnJMb2cgPSAnJztcbiAgICBsZXQgZXJyb3JPYmogPSB1bmRlZmluZWQ7XG4gICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yRXZlbnQpIHtcbiAgICAgICAgZXJyTG9nID0gZXJyLm1lc3NhZ2U7XG4gICAgICAgIGVycm9yT2JqID0gZXJyLmVycm9yO1xuICAgIH1cbiAgICBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQpIHtcbiAgICAgICAgZXJyTG9nID0gYCR7ZXJyLnJlYXNvbn1gO1xuICAgICAgICBlcnJvck9iaiA9IGVyci5yZWFzb247XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBlcnJMb2cgPSBgJHtlcnJ9YDtcbiAgICB9XG4gICAgaWYgKGVycm9yT2JqICE9PSB1bmRlZmluZWQgJiYgZXJyb3JPYmogIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgZXJyU3RhY2sgPSBlcnJvck9iai5zdGFjaztcbiAgICAgICAgZXJyTG9nICs9ICdcXG4nO1xuICAgICAgICBlcnJMb2cgKz0gZXJyU3RhY2sgIT09IHVuZGVmaW5lZCA/IGVyclN0YWNrIDogSlNPTi5zdHJpbmdpZnkoZXJyb3JPYmopO1xuICAgIH1cbiAgICBlcnJMb2cgKz0gJ1xcblxcbic7XG4gICAgZXJyTG9nICs9IGBVQTogJHtuYXZpZ2F0b3IudXNlckFnZW50fVxcbmA7XG4gICAgY29uc29sZS5lcnJvcihlcnJMb2csIGVycik7XG4gICAgZXJyb3JIYW5kbGVyKGVyckxvZyk7XG59XG5leHBvcnRzLnJlcG9ydEVycm9yID0gcmVwb3J0RXJyb3I7XG4vLyBUaGlzIGZ1bmN0aW9uIHNlcnZlcyB0d28gcHVycG9zZXMuXG4vLyAxKSBBIHJ1bnRpbWUgY2hlY2sgLSBpZiB3ZSBhcmUgZXZlciBjYWxsZWQsIHdlIHRocm93IGFuIGV4Y2VwdGlvbi5cbi8vIFRoaXMgaXMgdXNlZnVsIGZvciBjaGVja2luZyB0aGF0IGNvZGUgd2Ugc3VzcGVjdCBzaG91bGQgbmV2ZXIgYmUgcmVhY2hlZCBpc1xuLy8gYWN0dWFsbHkgbmV2ZXIgcmVhY2hlZC5cbi8vIDIpIEEgY29tcGlsZSB0aW1lIGNoZWNrIHdoZXJlIHR5cGVzY3JpcHQgYXNzZXJ0cyB0aGF0IHRoZSB2YWx1ZSBwYXNzZWQgY2FuIGJlXG4vLyBjYXN0IHRvIHRoZSBcIm5ldmVyXCIgdHlwZS5cbi8vIFRoaXMgaXMgdXNlZnVsIGZvciBlbnN1cmluZyB3ZSBleGhhc3RpdmVseSBjaGVjayB1bmlvbiB0eXBlcy5cbmZ1bmN0aW9uIGFzc2VydFVucmVhY2hhYmxlKF94KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGNvZGUgc2hvdWxkIG5vdCBiZSByZWFjaGFibGUnKTtcbn1cbmV4cG9ydHMuYXNzZXJ0VW5yZWFjaGFibGUgPSBhc3NlcnRVbnJlYWNoYWJsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIzIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pc0VudW1WYWx1ZSA9IGV4cG9ydHMuaXNTdHJpbmcgPSBleHBvcnRzLnNoYWxsb3dFcXVhbHMgPSBleHBvcnRzLmxvb2t1cFBhdGggPSB2b2lkIDA7XG4vLyBHaXZlbiBhbiBvYmplY3QsIHJldHVybiBhIHJlZiB0byB0aGUgb2JqZWN0IG9yIGl0ZW0gYXQgYXQgYSBnaXZlbiBwYXRoLlxuLy8gQSBwYXRoIGlzIGRlZmluZWQgdXNpbmcgYW4gYXJyYXkgb2YgcGF0aC1saWtlIGVsZW1lbnRzOiBJLmUuIFtzdHJpbmd8bnVtYmVyXS5cbi8vIFJldHVybnMgdW5kZWZpbmVkIGlmIHRoZSBwYXRoIGRvZXNuJ3QgZXhpc3QuXG4vLyBOb3RlOiBUaGlzIGlzIGFuIGFwcHJvcHJpYXRlIHVzZSBvZiBgYW55YCwgYXMgd2UgYXJlIGtub3dpbmdseSBnZXR0aW5nIGZhc3Rcbi8vIGFuZCBsb29zZSB3aXRoIHRoZSB0eXBlIHN5c3RlbSBpbiB0aGlzIGZ1bmN0aW9uOiBpdCdzIGJhc2ljYWxseSBKYXZhU2NyaXB0LlxuLy8gQXR0ZW1wdGluZyB0byBwcmV0ZW5kIGl0J3MgYW55dGhpbmcgZWxzZSB3b3VsZCByZXN1bHQgaW4gc3VwZXJmbHVvdXMgdHlwZVxuLy8gYXNzZXJ0aW9ucyB3aGljaCB3b3VsZCBoYXZlIG5vIGJlbmVmaXQuXG4vLyBJJ20gc3VyZSB3ZSBjb3VsZCBjb252aW5jZSBUeXBlU2NyaXB0IHRvIGZvbGxvdyB0aGUgcGF0aCBhbmQgdHlwZSBldmVyeXRoaW5nXG4vLyBjb3JyZWN0bHkgYWxvbmcgdGhlIHdheSwgYnV0IHRoYXQncyBhIGpvYiBmb3IgYW5vdGhlciBkYXkuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuZnVuY3Rpb24gbG9va3VwUGF0aCh2YWx1ZSwgcGF0aCkge1xuICAgIGxldCBvID0gdmFsdWU7XG4gICAgZm9yIChjb25zdCBwIG9mIHBhdGgpIHtcbiAgICAgICAgaWYgKHAgaW4gbykge1xuICAgICAgICAgICAgbyA9IG9bcF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvO1xufVxuZXhwb3J0cy5sb29rdXBQYXRoID0gbG9va3VwUGF0aDtcbmZ1bmN0aW9uIHNoYWxsb3dFcXVhbHMoYSwgYikge1xuICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChhID09PSBudWxsIHx8IGIgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBvYmpBID0gYTtcbiAgICBjb25zdCBvYmpCID0gYjtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmpBKSkge1xuICAgICAgICBpZiAob2JqQVtrZXldICE9PSBvYmpCW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmpCKSkge1xuICAgICAgICBpZiAob2JqQVtrZXldICE9PSBvYmpCW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydHMuc2hhbGxvd0VxdWFscyA9IHNoYWxsb3dFcXVhbHM7XG5mdW5jdGlvbiBpc1N0cmluZyhzKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzID09PSAnc3RyaW5nJyB8fCBzIGluc3RhbmNlb2YgU3RyaW5nO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuLy8gR2l2ZW4gYSBzdHJpbmcgZW51bSB8ZW51bXwsIGNoZWNrIHRoYXQgfHZhbHVlfCBpcyBhIHZhbGlkIG1lbWJlciBvZiB8ZW51bXwuXG5mdW5jdGlvbiBpc0VudW1WYWx1ZShlbm0sIHZhbHVlKSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMoZW5tKS5pbmNsdWRlcyh2YWx1ZSk7XG59XG5leHBvcnRzLmlzRW51bVZhbHVlID0gaXNFbnVtVmFsdWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAxOSBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudW5kb0NvbW1vbkNoYXRBcHBSZXBsYWNlbWVudHMgPSBleHBvcnRzLnNxbGl0ZVN0cmluZyA9IGV4cG9ydHMuYmluYXJ5RGVjb2RlID0gZXhwb3J0cy5iaW5hcnlFbmNvZGUgPSBleHBvcnRzLnV0ZjhEZWNvZGUgPSBleHBvcnRzLnV0ZjhFbmNvZGUgPSBleHBvcnRzLmhleEVuY29kZSA9IGV4cG9ydHMuYmFzZTY0RGVjb2RlID0gZXhwb3J0cy5iYXNlNjRFbmNvZGUgPSB2b2lkIDA7XG5jb25zdCBiYXNlNjRfMSA9IHJlcXVpcmUoXCJAcHJvdG9idWZqcy9iYXNlNjRcIik7XG5jb25zdCB1dGY4XzEgPSByZXF1aXJlKFwiQHByb3RvYnVmanMvdXRmOFwiKTtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuL2xvZ2dpbmdcIik7XG4vLyBUZXh0RGVjb2Rlci9EZWNvZGVyIHJlcXVpcmVzIHRoZSBmdWxsIERPTSBhbmQgaXNuJ3QgYXZhaWxhYmxlIGluIGFsbCB0eXBlc1xuLy8gb2YgdGVzdHMuIFVzZSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBmcm9tIHByb3RidWZqcy5cbmxldCBVdGY4RGVjb2RlcjtcbmxldCBVdGY4RW5jb2RlcjtcbnRyeSB7XG4gICAgVXRmOERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoJ3V0Zi04Jyk7XG4gICAgVXRmOEVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbn1cbmNhdGNoIChfKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBTaWxlbmNlIHRoZSB3YXJuaW5nIHdoZW4gd2Uga25vdyB3ZSBhcmUgcnVubmluZyB1bmRlciBOb2RlSlMuXG4gICAgICAgIGNvbnNvbGUud2FybignVXNpbmcgZmFsbGJhY2sgVVRGOCBFbmNvZGVyL0RlY29kZXIsIFRoaXMgc2hvdWxkIGhhcHBlbiBvbmx5IGluICcgK1xuICAgICAgICAgICAgJ3Rlc3RzIGFuZCBOb2RlSlMtYmFzZWQgZW52aXJvbm1lbnRzLCBub3QgaW4gYnJvd3NlcnMuJyk7XG4gICAgfVxuICAgIFV0ZjhEZWNvZGVyID0geyBkZWNvZGU6IChidWYpID0+ICgwLCB1dGY4XzEucmVhZCkoYnVmLCAwLCBidWYubGVuZ3RoKSB9O1xuICAgIFV0ZjhFbmNvZGVyID0ge1xuICAgICAgICBlbmNvZGU6IChzdHIpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KCgwLCB1dGY4XzEubGVuZ3RoKShzdHIpKTtcbiAgICAgICAgICAgIGNvbnN0IHdyaXR0ZW4gPSAoMCwgdXRmOF8xLndyaXRlKShzdHIsIGFyciwgMCk7XG4gICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHdyaXR0ZW4gPT09IGFyci5sZW5ndGgpO1xuICAgICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuZnVuY3Rpb24gYmFzZTY0RW5jb2RlKGJ1ZmZlcikge1xuICAgIHJldHVybiAoMCwgYmFzZTY0XzEuZW5jb2RlKShidWZmZXIsIDAsIGJ1ZmZlci5sZW5ndGgpO1xufVxuZXhwb3J0cy5iYXNlNjRFbmNvZGUgPSBiYXNlNjRFbmNvZGU7XG5mdW5jdGlvbiBiYXNlNjREZWNvZGUoc3RyKSB7XG4gICAgLy8gaWYgdGhlIHN0cmluZyBpcyBpbiBiYXNlNjR1cmwgZm9ybWF0LCBjb252ZXJ0IHRvIGJhc2U2NFxuICAgIGNvbnN0IGI2NCA9IHN0ci5yZXBsYWNlQWxsKCctJywgJysnKS5yZXBsYWNlQWxsKCdfJywgJy8nKTtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheSgoMCwgYmFzZTY0XzEubGVuZ3RoKShiNjQpKTtcbiAgICBjb25zdCB3cml0dGVuID0gKDAsIGJhc2U2NF8xLmRlY29kZSkoYjY0LCBhcnIsIDApO1xuICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkod3JpdHRlbiA9PT0gYXJyLmxlbmd0aCk7XG4gICAgcmV0dXJuIGFycjtcbn1cbmV4cG9ydHMuYmFzZTY0RGVjb2RlID0gYmFzZTY0RGVjb2RlO1xuLy8gZW5jb2RlIGJpbmFyeSBhcnJheSB0byBoZXggc3RyaW5nXG5mdW5jdGlvbiBoZXhFbmNvZGUoYnl0ZXMpIHtcbiAgICByZXR1cm4gYnl0ZXMucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyAoJzAnICsgY3VyLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpLCAnJyk7XG59XG5leHBvcnRzLmhleEVuY29kZSA9IGhleEVuY29kZTtcbmZ1bmN0aW9uIHV0ZjhFbmNvZGUoc3RyKSB7XG4gICAgcmV0dXJuIFV0ZjhFbmNvZGVyLmVuY29kZShzdHIpO1xufVxuZXhwb3J0cy51dGY4RW5jb2RlID0gdXRmOEVuY29kZTtcbi8vIE5vdGU6IG5vdCBhbGwgYnl0ZSBzZXF1ZW5jZXMgY2FuIGJlIGNvbnZlcnRlZCB0bzw+ZnJvbSBVVEY4LiBUaGlzIGNhbiBiZVxuLy8gdXNlZCBvbmx5IHdpdGggdmFsaWQgdW5pY29kZSBzdHJpbmdzLCBub3QgYXJiaXRyYXJ5IGJ5dGUgYnVmZmVycy5cbmZ1bmN0aW9uIHV0ZjhEZWNvZGUoYnVmZmVyKSB7XG4gICAgcmV0dXJuIFV0ZjhEZWNvZGVyLmRlY29kZShidWZmZXIpO1xufVxuZXhwb3J0cy51dGY4RGVjb2RlID0gdXRmOERlY29kZTtcbi8vIFRoZSBiaW5hcnlFbmNvZGUvRGVjb2RlIGZ1bmN0aW9ucyBiZWxvdyBhbGxvdyB0byBlbmNvZGUgYW4gYXJiaXRyYXJ5IGJpbmFyeVxuLy8gYnVmZmVyIGludG8gYSBzdHJpbmcgdGhhdCBjYW4gYmUgSlNPTi1lbmNvZGVkLiBiaW5hcnlFbmNvZGUoKSBhcHBsaWVzXG4vLyBVVEYtMTYgZW5jb2RpbmcgdG8gZWFjaCBieXRlIGluZGl2aWR1YWxseS5cbi8vIFVubGlrZSB1dGY4RW5jb2RlL0RlY29kZSwgYW55IGFyYml0cmFyeSBieXRlIHNlcXVlbmNlIGNhbiBiZSBjb252ZXJ0ZWQgaW50byBhXG4vLyB2YWxpZCBzdHJpbmcsIGFuZCB2aWNldmVyc2EuXG4vLyBUaGlzIHNob3VsZCBiZSBvbmx5IHVzZWQgd2hlbiBhIGJ5dGUgYXJyYXkgbmVlZHMgdG8gYmUgdHJhbnNtaXR0ZWQgb3ZlciBhblxuLy8gaW50ZXJmYWNlIHRoYXQgc3VwcG9ydHMgb25seSBKU09OIHNlcmlhbGl6YXRpb24gKGUuZy4sIHBvc3RtZXNzYWdlIHRvIGFcbi8vIGNocm9tZSBleHRlbnNpb24pLlxuZnVuY3Rpb24gYmluYXJ5RW5jb2RlKGJ1Zikge1xuICAgIGxldCBzdHIgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7IGkrKykge1xuICAgICAgICBzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufVxuZXhwb3J0cy5iaW5hcnlFbmNvZGUgPSBiaW5hcnlFbmNvZGU7XG5mdW5jdGlvbiBiaW5hcnlEZWNvZGUoc3RyKSB7XG4gICAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkoc3RyLmxlbmd0aCk7XG4gICAgY29uc3Qgc3RyTGVuID0gc3RyLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ckxlbjsgaSsrKSB7XG4gICAgICAgIGJ1ZltpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICByZXR1cm4gYnVmO1xufVxuZXhwb3J0cy5iaW5hcnlEZWNvZGUgPSBiaW5hcnlEZWNvZGU7XG4vLyBBIGZ1bmN0aW9uIHVzZWQgdG8gaW50ZXJwb2xhdGUgc3RyaW5ncyBpbnRvIFNRTCBxdWVyeS4gVGhlIG9ubHkgcmVwbGFjZW1lbnRcbi8vIGlzIGRvbmUgaXMgdGhhdCBzaW5nbGUgcXVvdGUgcmVwbGFjZWQgd2l0aCB0d28gc2luZ2xlIHF1b3RlcywgYWNjb3JkaW5nIHRvXG4vLyBTUUxpdGUgZG9jdW1lbnRhdGlvbjpcbi8vIGh0dHBzOi8vd3d3LnNxbGl0ZS5vcmcvbGFuZ19leHByLmh0bWwjbGl0ZXJhbF92YWx1ZXNfY29uc3RhbnRzX1xuLy9cbi8vIFRoZSBwdXJwb3NlIG9mIHRoaXMgZnVuY3Rpb24gaXMgdG8gdXNlIGluIHNpbXBsZSBjb21wYXJpc29ucywgdG8gZXNjYXBlXG4vLyBzdHJpbmdzIHVzZWQgaW4gR0xPQiBjbGF1c2VzIHNlZSBlc2NhcGVRdWVyeSBmdW5jdGlvbi5cbmZ1bmN0aW9uIHNxbGl0ZVN0cmluZyhzdHIpIHtcbiAgICByZXR1cm4gYCcke3N0ci5yZXBsYWNlQWxsKCdcXCcnLCAnXFwnXFwnJyl9J2A7XG59XG5leHBvcnRzLnNxbGl0ZVN0cmluZyA9IHNxbGl0ZVN0cmluZztcbi8vIENoYXQgYXBwcyAoaW5jbHVkaW5nIEcgQ2hhdCkgc29tZXRpbWVzIHJlcGxhY2UgQVNDSUkgY2hhcmFjdGVycyB3aXRoIHNpbWlsYXJcbi8vIGxvb2tpbmcgdW5pY29kZSBjaGFyYWN0ZXJzIHRoYXQgYnJlYWsgY29kZSBzbmlwcGV0cy5cbi8vIFRoaXMgZnVuY3Rpb24gYXR0ZW1wdHMgdG8gdW5kbyB0aGVzZSByZXBsYWNlbWVudHMuXG5mdW5jdGlvbiB1bmRvQ29tbW9uQ2hhdEFwcFJlcGxhY2VtZW50cyhzdHIpIHtcbiAgICAvLyBSZXBsYWNlIG5vbi1icmVha2luZyBzcGFjZXMgd2l0aCBub3JtYWwgc3BhY2VzLlxuICAgIHJldHVybiBzdHIucmVwbGFjZUFsbCgnXFx1MDBBMCcsICcgJyk7XG59XG5leHBvcnRzLnVuZG9Db21tb25DaGF0QXBwUmVwbGFjZW1lbnRzID0gdW5kb0NvbW1vbkNoYXRBcHBSZXBsYWNlbWVudHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQXJyYXlCdWZmZXJCdWlsZGVyID0gdm9pZCAwO1xuY29uc3QgdXRmOF8xID0gcmVxdWlyZShcIkBwcm90b2J1ZmpzL3V0ZjhcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3Qgb2JqZWN0X3V0aWxzXzEgPSByZXF1aXJlKFwiLi4vYmFzZS9vYmplY3RfdXRpbHNcIik7XG4vLyBSZXR1cm4gdGhlIGxlbmd0aCwgaW4gYnl0ZXMsIG9mIGEgdG9rZW4gdG8gYmUgaW5zZXJ0ZWQuXG5mdW5jdGlvbiB0b2tlbkxlbmd0aCh0b2tlbikge1xuICAgIGlmICgoMCwgb2JqZWN0X3V0aWxzXzEuaXNTdHJpbmcpKHRva2VuKSkge1xuICAgICAgICByZXR1cm4gKDAsIHV0ZjhfMS5sZW5ndGgpKHRva2VuKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG9rZW4gaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgIHJldHVybiB0b2tlbi5ieXRlTGVuZ3RoO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh0b2tlbiA+PSAwICYmIHRva2VuIDw9IDB4ZmZmZmZmZmYpO1xuICAgICAgICAvLyAzMi1iaXQgaW50ZWdlcnMgdGFrZSA0IGJ5dGVzXG4gICAgICAgIHJldHVybiA0O1xuICAgIH1cbn1cbi8vIEluc2VydCBhIHRva2VuIGludG8gdGhlIGJ1ZmZlciwgYXQgcG9zaXRpb24gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEBwYXJhbSBkYXRhVmlldyBBIERhdGFWaWV3IGludG8gdGhlIGJ1ZmZlciB0byB3cml0ZSBpbnRvLlxuLy8gQHBhcmFtIHR5cGVkQXJyYXkgQSBVaW50OEFycmF5IHZpZXcgaW50byB0aGUgYnVmZmVyIHRvIHdyaXRlIGludG8uXG4vLyBAcGFyYW0gYnl0ZU9mZnNldCBQb3NpdGlvbiB0byB3cml0ZSBhdCwgaW4gdGhlIGJ1ZmZlci5cbi8vIEBwYXJhbSB0b2tlbiBUb2tlbiB0byBpbnNlcnQgaW50byB0aGUgYnVmZmVyLlxuZnVuY3Rpb24gaW5zZXJ0VG9rZW4oZGF0YVZpZXcsIHR5cGVkQXJyYXksIGJ5dGVPZmZzZXQsIHRva2VuKSB7XG4gICAgaWYgKCgwLCBvYmplY3RfdXRpbHNfMS5pc1N0cmluZykodG9rZW4pKSB7XG4gICAgICAgIC8vIEVuY29kZSB0aGUgc3RyaW5nIGluIFVURi04XG4gICAgICAgIGNvbnN0IHdyaXR0ZW4gPSAoMCwgdXRmOF8xLndyaXRlKSh0b2tlbiwgdHlwZWRBcnJheSwgYnl0ZU9mZnNldCk7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkod3JpdHRlbiA9PT0gKDAsIHV0ZjhfMS5sZW5ndGgpKHRva2VuKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRva2VuIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICAvLyBDb3B5IHRoZSBieXRlcyBmcm9tIHRoZSBvdGhlciBhcnJheVxuICAgICAgICB0eXBlZEFycmF5LnNldCh0b2tlbiwgYnl0ZU9mZnNldCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHRva2VuID49IDAgJiYgdG9rZW4gPD0gMHhmZmZmZmZmZik7XG4gICAgICAgIC8vIDMyLWJpdCBsaXR0bGUtZW5kaWFuIHZhbHVlXG4gICAgICAgIGRhdGFWaWV3LnNldFVpbnQzMihieXRlT2Zmc2V0LCB0b2tlbiwgdHJ1ZSk7XG4gICAgfVxufVxuLy8gTGlrZSBhIHN0cmluZyBidWlsZGVyLCBidXQgZm9yIGFuIEFycmF5QnVmZmVyIGluc3RlYWQgb2YgYSBzdHJpbmcuIFRoaXNcbi8vIGFsbG93cyB1cyB0byBhc3NlbWJsZSBtZXNzYWdlcyB0byBzZW5kL3JlY2VpdmUgb3ZlciB0aGUgd2lyZS4gRGF0YSBjYW4gYmVcbi8vIGFwcGVuZGVkIHRvIHRoZSBidWZmZXIgdXNpbmcgYGFwcGVuZCgpYC4gVGhlIGRhdGEgd2UgYXBwZW5kIGNhbiBiZSBvZiB0aGVcbi8vIGZvbGxvd2luZyB0eXBlczpcbi8vXG4vLyAtIHN0cmluZzogdGhlIEFTQ0lJIHN0cmluZyBpcyBhcHBlbmRlZC4gVGhyb3dzIGFuIGVycm9yIGlmIHRoZXJlIGFyZVxuLy8gICAgICAgICAgIG5vbi1BU0NJSSBjaGFyYWN0ZXJzLlxuLy8gLSBudW1iZXI6IHRoZSBudW1iZXIgaXMgYXBwZW5kZWQgYXMgYSAzMi1iaXQgbGl0dGxlLWVuZGlhbiBpbnRlZ2VyLlxuLy8gLSBVaW50OEFycmF5OiB0aGUgYnl0ZXMgYXJlIGFwcGVuZGVkIGFzLWlzIHRvIHRoZSBidWZmZXIuXG5jbGFzcyBBcnJheUJ1ZmZlckJ1aWxkZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYW4gYEFycmF5QnVmZmVyYCB0aGF0IGlzIHRoZSBjb25jYXRlbmF0aW9uIG9mIGFsbCB0aGUgdG9rZW5zLlxuICAgIHRvQXJyYXlCdWZmZXIoKSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgYnVmZmVyIHdlIG5lZWQuXG4gICAgICAgIGxldCBieXRlTGVuZ3RoID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgYnl0ZUxlbmd0aCArPSB0b2tlbkxlbmd0aCh0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWxsb2NhdGUgdGhlIGJ1ZmZlci5cbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVMZW5ndGgpO1xuICAgICAgICBjb25zdCBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgICAgICBjb25zdCB0eXBlZEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcbiAgICAgICAgLy8gRmlsbCB0aGUgYnVmZmVyIHdpdGggdGhlIHRva2Vucy5cbiAgICAgICAgbGV0IGJ5dGVPZmZzZXQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICBpbnNlcnRUb2tlbihkYXRhVmlldywgdHlwZWRBcnJheSwgYnl0ZU9mZnNldCwgdG9rZW4pO1xuICAgICAgICAgICAgYnl0ZU9mZnNldCArPSB0b2tlbkxlbmd0aCh0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShieXRlT2Zmc2V0ID09PSBieXRlTGVuZ3RoKTtcbiAgICAgICAgLy8gUmV0dXJuIHRoZSB2YWx1ZXMuXG4gICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgfVxuICAgIC8vIEFkZCBvbmUgb3IgbW9yZSB0b2tlbnMgdG8gdGhlIHZhbHVlIG9mIHRoaXMgb2JqZWN0LlxuICAgIGFwcGVuZCh0b2tlbikge1xuICAgICAgICB0aGlzLnRva2Vucy5wdXNoKHRva2VuKTtcbiAgICB9XG59XG5leHBvcnRzLkFycmF5QnVmZmVyQnVpbGRlciA9IEFycmF5QnVmZmVyQnVpbGRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZGJDb25uZWN0aW9uSW1wbCA9IHZvaWQgMDtcbmNvbnN0IGN1c3RvbV91dGlsc18xID0gcmVxdWlyZShcImN1c3RvbV91dGlsc1wiKTtcbmNvbnN0IGRlZmVycmVkXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9kZWZlcnJlZFwiKTtcbmNvbnN0IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEgPSByZXF1aXJlKFwiLi4vYXJyYXlfYnVmZmVyX2J1aWxkZXJcIik7XG5jb25zdCBhZGJfZmlsZV9oYW5kbGVyXzEgPSByZXF1aXJlKFwiLi9hZGJfZmlsZV9oYW5kbGVyXCIpO1xuY29uc3QgdGV4dERlY29kZXIgPSBuZXcgY3VzdG9tX3V0aWxzXzEuX1RleHREZWNvZGVyKCk7XG5jbGFzcyBBZGJDb25uZWN0aW9uSW1wbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIG9uU3RhdHVzIGFuZCBvbkRpc2Nvbm5lY3QgYXJlIHNldCB0byBjYWxsYmFja3MgcGFzc2VkIGZyb20gdGhlIGNhbGxlci5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zIGZvciBpbnN0YW5jZSBpbiB0aGUgQW5kcm9pZFdlYnVzYlRhcmdldCwgd2hpY2ggaW5zdGFudGlhdGVzXG4gICAgICAgIC8vIHRoZW0gd2l0aCBjYWxsYmFja3MgcGFzc2VkIGZyb20gdGhlIFVJLlxuICAgICAgICB0aGlzLm9uU3RhdHVzID0gKCkgPT4geyB9O1xuICAgICAgICB0aGlzLm9uRGlzY29ubmVjdCA9IChfKSA9PiB7IH07XG4gICAgfVxuICAgIC8vIFN0YXJ0cyBhIHNoZWxsIGNvbW1hbmQsIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBjb21tYW5kXG4gICAgLy8gY29tcGxldGVzLlxuICAgIGFzeW5jIHNoZWxsQW5kV2FpdENvbXBsZXRpb24oY21kKSB7XG4gICAgICAgIGNvbnN0IGFkYlN0cmVhbSA9IGF3YWl0IHRoaXMuc2hlbGwoY21kKTtcbiAgICAgICAgY29uc3Qgb25TdHJlYW1pbmdFbmRlZCA9ICgwLCBkZWZlcnJlZF8xLmRlZmVyKSgpO1xuICAgICAgICAvLyBXZSB3YWl0IGZvciB0aGUgc3RyZWFtIHRvIGJlIGNsb3NlZCBieSB0aGUgZGV2aWNlLCB3aGljaCBoYXBwZW5zXG4gICAgICAgIC8vIGFmdGVyIHRoZSBzaGVsbCBjb21tYW5kIGlzIHN1Y2Nlc3NmdWxseSByZWNlaXZlZC5cbiAgICAgICAgYWRiU3RyZWFtLmFkZE9uU3RyZWFtQ2xvc2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgICAgICBvblN0cmVhbWluZ0VuZGVkLnJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvblN0cmVhbWluZ0VuZGVkO1xuICAgIH1cbiAgICAvLyBTdGFydHMgYSBzaGVsbCBjb21tYW5kLCB0aGVuIGdhdGhlcnMgYWxsIGl0cyBvdXRwdXQgYW5kIHJldHVybnMgaXQgYXNcbiAgICAvLyBhIHN0cmluZy5cbiAgICBhc3luYyBzaGVsbEFuZEdldE91dHB1dChjbWQpIHtcbiAgICAgICAgY29uc3QgYWRiU3RyZWFtID0gYXdhaXQgdGhpcy5zaGVsbChjbWQpO1xuICAgICAgICBjb25zdCBjb21tYW5kT3V0cHV0ID0gbmV3IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEuQXJyYXlCdWZmZXJCdWlsZGVyKCk7XG4gICAgICAgIGNvbnN0IG9uU3RyZWFtaW5nRW5kZWQgPSAoMCwgZGVmZXJyZWRfMS5kZWZlcikoKTtcbiAgICAgICAgYWRiU3RyZWFtLmFkZE9uU3RyZWFtRGF0YUNhbGxiYWNrKChkYXRhKSA9PiB7XG4gICAgICAgICAgICBjb21tYW5kT3V0cHV0LmFwcGVuZChkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGFkYlN0cmVhbS5hZGRPblN0cmVhbUNsb3NlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgb25TdHJlYW1pbmdFbmRlZC5yZXNvbHZlKHRleHREZWNvZGVyLmRlY29kZShjb21tYW5kT3V0cHV0LnRvQXJyYXlCdWZmZXIoKSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9uU3RyZWFtaW5nRW5kZWQ7XG4gICAgfVxuICAgIGFzeW5jIHB1c2goYmluYXJ5LCBwYXRoKSB7XG4gICAgICAgIGNvbnN0IGJ5dGVTdHJlYW0gPSBhd2FpdCB0aGlzLm9wZW5TdHJlYW0oJ3N5bmM6Jyk7XG4gICAgICAgIGF3YWl0IChuZXcgYWRiX2ZpbGVfaGFuZGxlcl8xLkFkYkZpbGVIYW5kbGVyKGJ5dGVTdHJlYW0pKS5wdXNoQmluYXJ5KGJpbmFyeSwgcGF0aCk7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gd2FpdCB1bnRpbCB0aGUgYnl0ZXN0cmVhbSBpcyBjbG9zZWQuIE90aGVyd2lzZSwgd2UgY2FuIGhhdmUgYVxuICAgICAgICAvLyByYWNlIGNvbmRpdGlvbjpcbiAgICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgbGFzdCBzdHJlYW0sIGl0IHdpbGwgdHJ5IHRvIGRpc2Nvbm5lY3QgdGhlIGRldmljZS4gSW4gdGhlXG4gICAgICAgIC8vIG1lYW50aW1lLCB0aGUgY2FsbGVyIG1pZ2h0IGNyZWF0ZSBhbm90aGVyIHN0cmVhbSB3aGljaCB3aWxsIHRyeSB0byBvcGVuXG4gICAgICAgIC8vIHRoZSBkZXZpY2UuXG4gICAgICAgIGF3YWl0IGJ5dGVTdHJlYW0uY2xvc2VBbmRXYWl0Rm9yVGVhcmRvd24oKTtcbiAgICB9XG59XG5leHBvcnRzLkFkYkNvbm5lY3Rpb25JbXBsID0gQWRiQ29ubmVjdGlvbkltcGw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiT3ZlcldlYnVzYlN0cmVhbSA9IGV4cG9ydHMuQWRiQ29ubmVjdGlvbk92ZXJXZWJ1c2IgPSBleHBvcnRzLkFkYlN0YXRlID0gZXhwb3J0cy5ERUZBVUxUX01BWF9QQVlMT0FEX0JZVEVTID0gZXhwb3J0cy5WRVJTSU9OX05PX0NIRUNLU1VNID0gZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU0gPSB2b2lkIDA7XG5jb25zdCBjdXN0b21fdXRpbHNfMSA9IHJlcXVpcmUoXCJjdXN0b21fdXRpbHNcIik7XG5jb25zdCBkZWZlcnJlZF8xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvZGVmZXJyZWRcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3Qgb2JqZWN0X3V0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9vYmplY3RfdXRpbHNcIik7XG5jb25zdCBhZGJfY29ubmVjdGlvbl9pbXBsXzEgPSByZXF1aXJlKFwiLi9hZGJfY29ubmVjdGlvbl9pbXBsXCIpO1xuY29uc3QgYWRiX2tleV9tYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9hdXRoL2FkYl9rZXlfbWFuYWdlclwiKTtcbmNvbnN0IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXCIpO1xuY29uc3QgcmVjb3JkaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9yZWNvcmRpbmdfdXRpbHNcIik7XG5jb25zdCB0ZXh0RW5jb2RlciA9IG5ldyBjdXN0b21fdXRpbHNfMS5fVGV4dEVuY29kZXIoKTtcbmNvbnN0IHRleHREZWNvZGVyID0gbmV3IGN1c3RvbV91dGlsc18xLl9UZXh0RGVjb2RlcigpO1xuZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU0gPSAweDAxMDAwMDAwO1xuZXhwb3J0cy5WRVJTSU9OX05PX0NIRUNLU1VNID0gMHgwMTAwMDAwMTtcbmV4cG9ydHMuREVGQVVMVF9NQVhfUEFZTE9BRF9CWVRFUyA9IDI1NiAqIDEwMjQ7XG52YXIgQWRiU3RhdGU7XG4oZnVuY3Rpb24gKEFkYlN0YXRlKSB7XG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJESVNDT05ORUNURURcIl0gPSAwXSA9IFwiRElTQ09OTkVDVEVEXCI7XG4gICAgLy8gQXV0aGVudGljYXRpb24gc3RlcHMsIHNlZSBBZGJDb25uZWN0aW9uT3ZlcldlYlVzYidzIGhhbmRsZUF1dGhlbnRpY2F0aW9uKCkuXG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJBVVRIX1NUQVJURURcIl0gPSAxXSA9IFwiQVVUSF9TVEFSVEVEXCI7XG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJBVVRIX1dJVEhfUFJJVkFURVwiXSA9IDJdID0gXCJBVVRIX1dJVEhfUFJJVkFURVwiO1xuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiQVVUSF9XSVRIX1BVQkxJQ1wiXSA9IDNdID0gXCJBVVRIX1dJVEhfUFVCTElDXCI7XG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJDT05ORUNURURcIl0gPSA0XSA9IFwiQ09OTkVDVEVEXCI7XG59KShBZGJTdGF0ZSB8fCAoZXhwb3J0cy5BZGJTdGF0ZSA9IEFkYlN0YXRlID0ge30pKTtcbnZhciBBdXRoQ21kO1xuKGZ1bmN0aW9uIChBdXRoQ21kKSB7XG4gICAgQXV0aENtZFtBdXRoQ21kW1wiVE9LRU5cIl0gPSAxXSA9IFwiVE9LRU5cIjtcbiAgICBBdXRoQ21kW0F1dGhDbWRbXCJTSUdOQVRVUkVcIl0gPSAyXSA9IFwiU0lHTkFUVVJFXCI7XG4gICAgQXV0aENtZFtBdXRoQ21kW1wiUlNBUFVCTElDS0VZXCJdID0gM10gPSBcIlJTQVBVQkxJQ0tFWVwiO1xufSkoQXV0aENtZCB8fCAoQXV0aENtZCA9IHt9KSk7XG5mdW5jdGlvbiBnZW5lcmF0ZUNoZWNrc3VtKGRhdGEpIHtcbiAgICBsZXQgcmVzID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuYnl0ZUxlbmd0aDsgaSsrKVxuICAgICAgICByZXMgKz0gZGF0YVtpXTtcbiAgICByZXR1cm4gcmVzICYgMHhGRkZGRkZGRjtcbn1cbmNsYXNzIEFkYkNvbm5lY3Rpb25PdmVyV2VidXNiIGV4dGVuZHMgYWRiX2Nvbm5lY3Rpb25faW1wbF8xLkFkYkNvbm5lY3Rpb25JbXBsIHtcbiAgICAvLyBXZSB1c2UgYSBrZXkgcGFpciBmb3IgYXV0aGVudGljYXRpbmcgd2l0aCB0aGUgZGV2aWNlLCB3aGljaCB3ZSBkbyBpblxuICAgIC8vIHR3byB3YXlzOlxuICAgIC8vIC0gRmlyc3RseSwgc2lnbmluZyB3aXRoIHRoZSBwcml2YXRlIGtleS5cbiAgICAvLyAtIFNlY29uZGx5LCBzZW5kaW5nIG92ZXIgdGhlIHB1YmxpYyBrZXkgKGF0IHdoaWNoIHBvaW50IHRoZSBkZXZpY2UgYXNrcyB0aGVcbiAgICAvLyAgIHVzZXIgZm9yIHBlcm1pc3Npb25zKS5cbiAgICAvLyBPbmNlIHdlJ3ZlIHNlbnQgdGhlIHB1YmxpYyBrZXksIGZvciBmdXR1cmUgcmVjb3JkaW5ncyB3ZSBvbmx5IG5lZWQgdG9cbiAgICAvLyBzaWduIHdpdGggdGhlIHByaXZhdGUga2V5LCBzbyB0aGUgdXNlciBkb2Vzbid0IG5lZWQgdG8gZ2l2ZSBwZXJtaXNzaW9uc1xuICAgIC8vIGFnYWluLlxuICAgIGNvbnN0cnVjdG9yKGRldmljZSwga2V5TWFuYWdlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyID0ga2V5TWFuYWdlcjtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRDtcbiAgICAgICAgdGhpcy5jb25uZWN0aW5nU3RyZWFtcyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5zdHJlYW1zID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLm1heFBheWxvYWQgPSBleHBvcnRzLkRFRkFVTFRfTUFYX1BBWUxPQURfQllURVM7XG4gICAgICAgIHRoaXMud3JpdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoaXMud3JpdGVRdWV1ZSA9IFtdO1xuICAgICAgICAvLyBEZXZpY2VzIGFmdGVyIERlYyAyMDE3IGRvbid0IHVzZSBjaGVja3N1bS4gVGhpcyB3aWxsIGJlIGF1dG8tZGV0ZWN0ZWRcbiAgICAgICAgLy8gZHVyaW5nIHRoZSBjb25uZWN0aW9uLlxuICAgICAgICB0aGlzLnVzZUNoZWNrc3VtID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYXN0U3RyZWFtSWQgPSAwO1xuICAgICAgICB0aGlzLnVzYlJlYWRFbmRwb2ludCA9IC0xO1xuICAgICAgICB0aGlzLnVzYldyaXRlRXBFbmRwb2ludCA9IC0xO1xuICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGVuZGluZ0Nvbm5Qcm9taXNlcyA9IFtdO1xuICAgIH1cbiAgICBzaGVsbChjbWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlblN0cmVhbSgnc2hlbGw6JyArIGNtZCk7XG4gICAgfVxuICAgIGNvbm5lY3RTb2NrZXQocGF0aCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuU3RyZWFtKHBhdGgpO1xuICAgIH1cbiAgICBhc3luYyBjYW5Db25uZWN0V2l0aG91dENvbnRlbnRpb24oKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLm9wZW4oKTtcbiAgICAgICAgY29uc3QgdXNiSW50ZXJmYWNlTnVtYmVyID0gYXdhaXQgdGhpcy5zZXR1cFVzYkludGVyZmFjZSgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2UuY2xhaW1JbnRlcmZhY2UodXNiSW50ZXJmYWNlTnVtYmVyKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLnJlbGVhc2VJbnRlcmZhY2UodXNiSW50ZXJmYWNlTnVtYmVyKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgb3BlblN0cmVhbShkZXN0aW5hdGlvbikge1xuICAgICAgICBjb25zdCBzdHJlYW1JZCA9ICsrdGhpcy5sYXN0U3RyZWFtSWQ7XG4gICAgICAgIGNvbnN0IGNvbm5lY3RpbmdTdHJlYW0gPSAoMCwgZGVmZXJyZWRfMS5kZWZlcikoKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5zZXQoc3RyZWFtSWQsIGNvbm5lY3RpbmdTdHJlYW0pO1xuICAgICAgICAvLyBXZSBjcmVhdGUgdGhlIHN0cmVhbSBiZWZvcmUgdHJ5aW5nIHRvIGVzdGFibGlzaCB0aGUgY29ubmVjdGlvbiwgc29cbiAgICAgICAgLy8gdGhhdCBpZiB3ZSBmYWlsIHRvIGNvbm5lY3QsIHdlIHdpbGwgcmVqZWN0IHRoZSBjb25uZWN0aW5nIHN0cmVhbS5cbiAgICAgICAgYXdhaXQgdGhpcy5lbnN1cmVDb25uZWN0aW9uRXN0YWJsaXNoZWQoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5zZW5kTWVzc2FnZSgnT1BFTicsIHN0cmVhbUlkLCAwLCBkZXN0aW5hdGlvbik7XG4gICAgICAgIHJldHVybiBjb25uZWN0aW5nU3RyZWFtO1xuICAgIH1cbiAgICBhc3luYyBlbnN1cmVDb25uZWN0aW9uRXN0YWJsaXNoZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5DT05ORUNURUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuRElTQ09OTkVDVEVEKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5vcGVuKCk7XG4gICAgICAgICAgICBpZiAoIShhd2FpdCB0aGlzLmNhbkNvbm5lY3RXaXRob3V0Q29udGVudGlvbigpKSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLnJlc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB1c2JJbnRlcmZhY2VOdW1iZXIgPSBhd2FpdCB0aGlzLnNldHVwVXNiSW50ZXJmYWNlKCk7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5jbGFpbUludGVyZmFjZSh1c2JJbnRlcmZhY2VOdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMuc3RhcnRBZGJBdXRoKCk7XG4gICAgICAgIGlmICghdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZykge1xuICAgICAgICAgICAgdGhpcy51c2JSZWNlaXZlTG9vcCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNvbm5Qcm9taXNlID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIHRoaXMucGVuZGluZ0Nvbm5Qcm9taXNlcy5wdXNoKGNvbm5Qcm9taXNlKTtcbiAgICAgICAgYXdhaXQgY29ublByb21pc2U7XG4gICAgfVxuICAgIGFzeW5jIHNldHVwVXNiSW50ZXJmYWNlKCkge1xuICAgICAgICBjb25zdCBpbnRlcmZhY2VBbmRFbmRwb2ludCA9ICgwLCByZWNvcmRpbmdfdXRpbHNfMS5maW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQpKHRoaXMuZGV2aWNlKTtcbiAgICAgICAgLy8gYGZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludGAgd2lsbCBhbHdheXMgcmV0dXJuIGEgbm9uLW51bGwgdmFsdWUgYmVjYXVzZVxuICAgICAgICAvLyB3ZSBjaGVjayBmb3IgdGhpcyBpbiAnYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0X2ZhY3RvcnknLiBJZiBubyBpbnRlcmZhY2UgYW5kXG4gICAgICAgIC8vIGVuZHBvaW50cyBhcmUgZm91bmQsIHdlIGRvIG5vdCBjcmVhdGUgYSB0YXJnZXQsIHNvIHdlIGNhbiBub3QgY29ubmVjdCB0b1xuICAgICAgICAvLyBpdCwgc28gd2Ugd2lsbCBuZXZlciByZWFjaCB0aGlzIGxvZ2ljLlxuICAgICAgICBjb25zdCB7IGNvbmZpZ3VyYXRpb25WYWx1ZSwgdXNiSW50ZXJmYWNlTnVtYmVyLCBlbmRwb2ludHMgfSA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShpbnRlcmZhY2VBbmRFbmRwb2ludCk7XG4gICAgICAgIHRoaXMudXNiSW50ZXJmYWNlTnVtYmVyID0gdXNiSW50ZXJmYWNlTnVtYmVyO1xuICAgICAgICB0aGlzLnVzYlJlYWRFbmRwb2ludCA9IHRoaXMuZmluZEVuZHBvaW50TnVtYmVyKGVuZHBvaW50cywgJ2luJyk7XG4gICAgICAgIHRoaXMudXNiV3JpdGVFcEVuZHBvaW50ID0gdGhpcy5maW5kRW5kcG9pbnROdW1iZXIoZW5kcG9pbnRzLCAnb3V0Jyk7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkodGhpcy51c2JSZWFkRW5kcG9pbnQgPj0gMCAmJiB0aGlzLnVzYldyaXRlRXBFbmRwb2ludCA+PSAwKTtcbiAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2Uuc2VsZWN0Q29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uVmFsdWUpO1xuICAgICAgICByZXR1cm4gdXNiSW50ZXJmYWNlTnVtYmVyO1xuICAgIH1cbiAgICBhc3luYyBzdHJlYW1DbG9zZShzdHJlYW0pIHtcbiAgICAgICAgY29uc3Qgb3RoZXJTdHJlYW1zUXVldWUgPSB0aGlzLndyaXRlUXVldWUuZmlsdGVyKChxdWV1ZUVsZW1lbnQpID0+IHF1ZXVlRWxlbWVudC5sb2NhbFN0cmVhbUlkICE9PSBzdHJlYW0ubG9jYWxTdHJlYW1JZCk7XG4gICAgICAgIGNvbnN0IGRyb3BwZWRQYWNrZXRDb3VudCA9IHRoaXMud3JpdGVRdWV1ZS5sZW5ndGggLSBvdGhlclN0cmVhbXNRdWV1ZS5sZW5ndGg7XG4gICAgICAgIGlmIChkcm9wcGVkUGFja2V0Q291bnQgPiAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBEcm9wcGluZyAke2Ryb3BwZWRQYWNrZXRDb3VudH0gcXVldWVkIG1lc3NhZ2VzIGR1ZSB0byBzdHJlYW0gY2xvc2luZy5gKTtcbiAgICAgICAgICAgIHRoaXMud3JpdGVRdWV1ZSA9IG90aGVyU3RyZWFtc1F1ZXVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RyZWFtcy5kZWxldGUoc3RyZWFtKTtcbiAgICAgICAgaWYgKHRoaXMuc3RyZWFtcy5zaXplID09PSAwKSB7XG4gICAgICAgICAgICAvLyBXZSBkaXNjb25uZWN0IEJFRk9SRSBjYWxsaW5nIGBzaWduYWxTdHJlYW1DbG9zZWRgLiBPdGhlcndpc2UsIHRoZXJlIGNhblxuICAgICAgICAgICAgLy8gYmUgYSByYWNlIGNvbmRpdGlvbjpcbiAgICAgICAgICAgIC8vIFN0cmVhbSBBOiBzdHJlYW1BLm9uU3RyZWFtQ2xvc2VcbiAgICAgICAgICAgIC8vIFN0cmVhbSBCOiBkZXZpY2Uub3BlblxuICAgICAgICAgICAgLy8gU3RyZWFtIEE6IGRldmljZS5yZWxlYXNlSW50ZXJmYWNlXG4gICAgICAgICAgICAvLyBTdHJlYW0gQjogZGV2aWNlLnRyYW5zZmVyT3V0IC0+IENSQVNIXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBzdHJlYW0uc2lnbmFsU3RyZWFtQ2xvc2VkKCk7XG4gICAgfVxuICAgIHN0cmVhbVdyaXRlKG1zZywgc3RyZWFtKSB7XG4gICAgICAgIGNvbnN0IHJhdyA9ICgoMCwgb2JqZWN0X3V0aWxzXzEuaXNTdHJpbmcpKG1zZykpID8gdGV4dEVuY29kZXIuZW5jb2RlKG1zZykgOiBtc2c7XG4gICAgICAgIGlmICh0aGlzLndyaXRlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgdGhpcy53cml0ZVF1ZXVlLnB1c2goeyBtZXNzYWdlOiByYXcsIGxvY2FsU3RyZWFtSWQ6IHN0cmVhbS5sb2NhbFN0cmVhbUlkIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMud3JpdGVJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zZW5kTWVzc2FnZSgnV1JURScsIHN0cmVhbS5sb2NhbFN0cmVhbUlkLCBzdHJlYW0ucmVtb3RlU3RyZWFtSWQsIHJhdyk7XG4gICAgfVxuICAgIC8vIFdlIGRpc2Nvbm5lY3QgaW4gMiBjYXNlczpcbiAgICAvLyAxLiBXaGVuIHdlIGNsb3NlIHRoZSBsYXN0IHN0cmVhbSBvZiB0aGUgY29ubmVjdGlvbi4gVGhpcyBpcyB0byBwcmV2ZW50IHRoZVxuICAgIC8vIGJyb3dzZXIgaG9sZGluZyBvbnRvIHRoZSBVU0IgaW50ZXJmYWNlIGFmdGVyIGhhdmluZyBmaW5pc2hlZCBhIHRyYWNlXG4gICAgLy8gcmVjb3JkaW5nLCB3aGljaCB3b3VsZCBtYWtlIGl0IGltcG9zc2libGUgdG8gdXNlIFwiYWRiIHNoZWxsXCIgZnJvbSB0aGUgc2FtZVxuICAgIC8vIG1hY2hpbmUgdW50aWwgdGhlIGJyb3dzZXIgaXMgY2xvc2VkLlxuICAgIC8vIDIuIFdoZW4gd2UgZ2V0IGEgVVNCIGRpc2Nvbm5lY3QgZXZlbnQuIFRoaXMgaGFwcGVucyBmb3IgaW5zdGFuY2Ugd2hlbiB0aGVcbiAgICAvLyBkZXZpY2UgaXMgdW5wbHVnZ2VkLlxuICAgIGFzeW5jIGRpc2Nvbm5lY3QoZGlzY29ubmVjdE1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIENsZWFyIHRoZSByZXNvdXJjZXMgaW4gYSBzeW5jaHJvbm91cyBtZXRob2QsIGJlY2F1c2UgdGhpcyBjYW4gYmUgdXNlZFxuICAgICAgICAvLyBmb3IgZXJyb3IgaGFuZGxpbmcgY2FsbGJhY2tzIGFzIHdlbGwuXG4gICAgICAgIHRoaXMucmVhY2hEaXNjb25uZWN0U3RhdGUoZGlzY29ubmVjdE1lc3NhZ2UpO1xuICAgICAgICAvLyBXZSBoYXZlIGFscmVhZHkgZGlzY29ubmVjdGVkIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gcGFzcyBhIGNhbGxiYWNrXG4gICAgICAgIC8vIHdoaWNoIGNsZWFycyByZXNvdXJjZXMgb3Igbm90aWZpZXMgdGhlIHVzZXIgaW50byAnd3JhcFJlY29yZGluZ0Vycm9yJy5cbiAgICAgICAgYXdhaXQgKDAsIHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLndyYXBSZWNvcmRpbmdFcnJvcikodGhpcy5kZXZpY2UucmVsZWFzZUludGVyZmFjZSgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy51c2JJbnRlcmZhY2VOdW1iZXIpKSwgKCkgPT4geyB9KTtcbiAgICAgICAgdGhpcy51c2JJbnRlcmZhY2VOdW1iZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgYSBzeW5jaHJvbm91cyBtZXRob2Qgd2hpY2ggY2xlYXJzIGFsbCByZXNvdXJjZXMuXG4gICAgLy8gSXQgY2FuIGJlIHVzZWQgYXMgYSBjYWxsYmFjayBmb3IgZXJyb3IgaGFuZGxpbmcuXG4gICAgcmVhY2hEaXNjb25uZWN0U3RhdGUoZGlzY29ubmVjdE1lc3NhZ2UpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWxldGUgdGhlIHN0cmVhbXMgQkVGT1JFIGNoZWNraW5nIHRoZSBBZGIgc3RhdGUgYmVjYXVzZTpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgY3JlYXRlIHN0cmVhbXMgYmVmb3JlIGNoYW5naW5nIHRoZSBBZGIgc3RhdGUgZnJvbSBESVNDT05ORUNURUQuXG4gICAgICAgIC8vIEluIGNhc2Ugd2UgY2FuIG5vdCBjbGFpbSB0aGUgZGV2aWNlLCB3ZSB3aWxsIGNyZWF0ZSBhIHN0cmVhbSwgYnV0IGZhaWxcbiAgICAgICAgLy8gdG8gY29ubmVjdCB0byB0aGUgV2ViVVNCIGRldmljZSBzbyB0aGUgc3RhdGUgd2lsbCByZW1haW4gRElTQ09OTkVDVEVELlxuICAgICAgICBjb25zdCBzdHJlYW1zVG9EZWxldGUgPSB0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmVudHJpZXMoKTtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHN0cmVhbXMgYmVmb3JlIHJlamVjdGluZyBzbyB3ZSBhcmUgbm90IGNhdWdodCBpbiBhIGxvb3Agb2ZcbiAgICAgICAgLy8gaGFuZGxpbmcgcHJvbWlzZSByZWplY3Rpb25zLlxuICAgICAgICB0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmNsZWFyKCk7XG4gICAgICAgIGZvciAoY29uc3QgW2lkLCBzdHJlYW1dIG9mIHN0cmVhbXNUb0RlbGV0ZSkge1xuICAgICAgICAgICAgc3RyZWFtLnJlamVjdChgRmFpbGVkIHRvIG9wZW4gc3RyZWFtIHdpdGggaWQgJHtpZH0gYmVjYXVzZSBhZGIgd2FzIGRpc2Nvbm5lY3RlZC5gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuRElTQ09OTkVDVEVEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRDtcbiAgICAgICAgdGhpcy53cml0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgdGhpcy53cml0ZVF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuc3RyZWFtcy5mb3JFYWNoKChzdHJlYW0pID0+IHN0cmVhbS5jbG9zZSgpKTtcbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QoZGlzY29ubmVjdE1lc3NhZ2UpO1xuICAgIH1cbiAgICBhc3luYyBzdGFydEFkYkF1dGgoKSB7XG4gICAgICAgIGNvbnN0IFZFUlNJT04gPSB0aGlzLnVzZUNoZWNrc3VtID8gZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU0gOiBleHBvcnRzLlZFUlNJT05fTk9fQ0hFQ0tTVU07XG4gICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5BVVRIX1NUQVJURUQ7XG4gICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ0NOWE4nLCBWRVJTSU9OLCB0aGlzLm1heFBheWxvYWQsICdob3N0OjE6VXNiQURCJyk7XG4gICAgfVxuICAgIGZpbmRFbmRwb2ludE51bWJlcihlbmRwb2ludHMsIGRpcmVjdGlvbiwgdHlwZSA9ICdidWxrJykge1xuICAgICAgICBjb25zdCBlcCA9IGVuZHBvaW50cy5maW5kKChlcCkgPT4gZXAudHlwZSA9PT0gdHlwZSAmJiBlcC5kaXJlY3Rpb24gPT09IGRpcmVjdGlvbik7XG4gICAgICAgIGlmIChlcClcbiAgICAgICAgICAgIHJldHVybiBlcC5lbmRwb2ludE51bWJlcjtcbiAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGBDYW5ub3QgZmluZCAke2RpcmVjdGlvbn0gZW5kcG9pbnRgKTtcbiAgICB9XG4gICAgYXN5bmMgdXNiUmVjZWl2ZUxvb3AoKSB7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0RmFsc2UpKHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcpO1xuICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgZm9yICg7IHRoaXMuc3RhdGUgIT09IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRDspIHtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMud3JhcFVzYih0aGlzLmRldmljZS50cmFuc2ZlckluKHRoaXMudXNiUmVhZEVuZHBvaW50LCBBREJfTVNHX1NJWkUpKTtcbiAgICAgICAgICAgIGlmICghcmVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzICE9PSAnb2snKSB7XG4gICAgICAgICAgICAgICAgLy8gTG9nIGFuZCBpZ25vcmUgbWVzc2FnZXMgd2l0aCBpbnZhbGlkIHN0YXR1cy4gVGhlc2UgY2FuIG9jY3VyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgZGV2aWNlIGlzIGNvbm5lY3RlZC9kaXNjb25uZWN0ZWQgcmVwZWF0ZWRseS5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBSZWNlaXZlZCBtZXNzYWdlIHdpdGggdW5leHBlY3RlZCBzdGF0dXMgJyR7cmVzLnN0YXR1c30nYCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtc2cgPSBBZGJNc2cuZGVjb2RlSGVhZGVyKHJlcy5kYXRhKTtcbiAgICAgICAgICAgIGlmIChtc2cuZGF0YUxlbiA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgdGhpcy53cmFwVXNiKHRoaXMuZGV2aWNlLnRyYW5zZmVySW4odGhpcy51c2JSZWFkRW5kcG9pbnQsIG1zZy5kYXRhTGVuKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtc2cuZGF0YSA9IG5ldyBVaW50OEFycmF5KHJlc3AuZGF0YS5idWZmZXIsIHJlc3AuZGF0YS5ieXRlT2Zmc2V0LCByZXNwLmRhdGEuYnl0ZUxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy51c2VDaGVja3N1bSAmJiBnZW5lcmF0ZUNoZWNrc3VtKG1zZy5kYXRhKSAhPT0gbXNnLmRhdGFDaGVja3N1bSkge1xuICAgICAgICAgICAgICAgIC8vIFdlIGlnbm9yZSBtZXNzYWdlcyB3aXRoIGFuIGludmFsaWQgY2hlY2tzdW0uIFRoZXNlIHNvbWV0aW1lcyBhcHBlYXJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBwYWdlIGlzIHJlLWxvYWRlZCBpbiBhIG1pZGRsZSBvZiBhIHJlY29yZGluZy5cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoZSBzZXJ2ZXIgY2FuIHN0aWxsIHNlbmQgbWVzc2FnZXMgc3RyZWFtcyBmb3IgcHJldmlvdXMgc3RyZWFtcy5cbiAgICAgICAgICAgIC8vIFRoaXMgaGFwcGVucyBmb3IgaW5zdGFuY2UgaWYgd2UgcmVjb3JkLCByZWxvYWQgdGhlIHJlY29yZGluZyBwYWdlIGFuZFxuICAgICAgICAgICAgLy8gdGhlbiByZWNvcmQgYWdhaW4uIFdlIGNhbiBhbHNvIHJlY2VpdmUgYSAnV1JURScgb3IgJ09LQVknIGFmdGVyXG4gICAgICAgICAgICAvLyB3ZSBoYXZlIHNlbnQgYSAnQ0xTRScgYW5kIG1hcmtlZCB0aGUgc3RhdGUgYXMgZGlzY29ubmVjdGVkLlxuICAgICAgICAgICAgaWYgKChtc2cuY21kID09PSAnQ0xTRScgfHwgbXNnLmNtZCA9PT0gJ1dSVEUnKSAmJlxuICAgICAgICAgICAgICAgICF0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobXNnLmFyZzEpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnT0tBWScgJiYgIXRoaXMuY29ubmVjdGluZ1N0cmVhbXMuaGFzKG1zZy5hcmcxKSAmJlxuICAgICAgICAgICAgICAgICF0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobXNnLmFyZzEpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnQVVUSCcgJiYgbXNnLmFyZzAgPT09IEF1dGhDbWQuVE9LRU4gJiZcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5BVVRIX1dJVEhfUFVCTElDKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgd2Ugc3RhcnQgYSByZWNvcmRpbmcgYnV0IGZhaWwgYmVjYXVzZSBvZiBhIGZhdWx0eSBwaHlzaWNhbFxuICAgICAgICAgICAgICAgIC8vIGNvbm5lY3Rpb24gdG8gdGhlIGRldmljZSwgd2hlbiB3ZSBzdGFydCBhIG5ldyByZWNvcmRpbmcsIHdlIHdpbGxcbiAgICAgICAgICAgICAgICAvLyByZWNlaXZlZCBtdWx0aXBsZSBBVVRIIHRva2Vucywgb2Ygd2hpY2ggd2Ugc2hvdWxkIGlnbm9yZSBhbGwgYnV0XG4gICAgICAgICAgICAgICAgLy8gb25lLlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaGFuZGxlIHRoZSBBREIgbWVzc2FnZSBmcm9tIHRoZSBkZXZpY2VcbiAgICAgICAgICAgIGlmIChtc2cuY21kID09PSAnQ0xTRScpIHtcbiAgICAgICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5nZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKG1zZy5hcmcxKSkuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdBVVRIJyAmJiBtc2cuYXJnMCA9PT0gQXV0aENtZC5UT0tFTikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGF3YWl0IHRoaXMua2V5TWFuYWdlci5nZXRLZXkoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuQVVUSF9TVEFSVEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIER1cmluZyB0aGlzIHN0ZXAsIHdlIHNlbmQgYmFjayB0aGUgdG9rZW4gcmVjZWl2ZWQgc2lnbmVkIHdpdGggb3VyXG4gICAgICAgICAgICAgICAgICAgIC8vIHByaXZhdGUga2V5LiBJZiB0aGUgZGV2aWNlIGhhcyBwcmV2aW91c2x5IHJlY2VpdmVkIG91ciBwdWJsaWMga2V5LFxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZGlhbG9nIGFza2luZyBmb3IgdXNlciBjb25maXJtYXRpb24gd2lsbCBub3QgYmUgZGlzcGxheWVkIG9uXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBkZXZpY2UuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5BVVRIX1dJVEhfUFJJVkFURTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZW5kTWVzc2FnZSgnQVVUSCcsIEF1dGhDbWQuU0lHTkFUVVJFLCAwLCBrZXkuc2lnbihtc2cuZGF0YSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgb3VyIHNpZ25hdHVyZSB3aXRoIHRoZSBwcml2YXRlIGtleSBpcyBub3QgYWNjZXB0ZWQgYnkgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIGRldmljZSwgd2UgZ2VuZXJhdGUgYSBuZXcga2V5cGFpciBhbmQgc2VuZCB0aGUgcHVibGljIGtleS5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkFVVEhfV0lUSF9QVUJMSUM7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ0FVVEgnLCBBdXRoQ21kLlJTQVBVQkxJQ0tFWSwgMCwga2V5LmdldFB1YmxpY0tleSgpICsgJ1xcMCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uU3RhdHVzKHJlY29yZGluZ191dGlsc18xLkFMTE9XX1VTQl9ERUJVR0dJTkcpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCAoMCwgYWRiX2tleV9tYW5hZ2VyXzEubWF5YmVTdG9yZUtleSkoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnQ05YTicpIHtcbiAgICAgICAgICAgICAgICAvL2Fzc2VydFRydWUoXG4gICAgICAgICAgICAgICAgLy8gICAgW0FkYlN0YXRlLkFVVEhfV0lUSF9QUklWQVRFLCBBZGJTdGF0ZS5BVVRIX1dJVEhfUFVCTElDXS5pbmNsdWRlcyhcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgdGhpcy5zdGF0ZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5DT05ORUNURUQ7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXhQYXlsb2FkID0gbXNnLmFyZzE7XG4gICAgICAgICAgICAgICAgY29uc3QgZGV2aWNlVmVyc2lvbiA9IG1zZy5hcmcwO1xuICAgICAgICAgICAgICAgIGlmICghW2V4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNLCBleHBvcnRzLlZFUlNJT05fTk9fQ0hFQ0tTVU1dLmluY2x1ZGVzKGRldmljZVZlcnNpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihgVmVyc2lvbiAke21zZy5hcmcwfSBub3Qgc3VwcG9ydGVkLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnVzZUNoZWNrc3VtID0gZGV2aWNlVmVyc2lvbiA9PT0gZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU07XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkNPTk5FQ1RFRDtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHdpbGwgcmVzb2x2ZSB0aGUgcHJvbWlzZXMgYXdhaXRlZCBieVxuICAgICAgICAgICAgICAgIC8vIFwiZW5zdXJlQ29ubmVjdGlvbkVzdGFibGlzaGVkXCIuXG4gICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nQ29ublByb21pc2VzLmZvckVhY2goKGNvbm5Qcm9taXNlKSA9PiBjb25uUHJvbWlzZS5yZXNvbHZlKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0Nvbm5Qcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ09LQVknKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuaGFzKG1zZy5hcmcxKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25uZWN0aW5nU3RyZWFtID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuZ2V0KG1zZy5hcmcxKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0cmVhbSA9IG5ldyBBZGJPdmVyV2VidXNiU3RyZWFtKHRoaXMsIG1zZy5hcmcxLCBtc2cuYXJnMCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtcy5hZGQoc3RyZWFtKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5kZWxldGUobXNnLmFyZzEpO1xuICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW5nU3RyZWFtLnJlc29sdmUoc3RyZWFtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkodGhpcy53cml0ZUluUHJvZ3Jlc3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndyaXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgdGhpcy53cml0ZVF1ZXVlLmxlbmd0aDspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGdvIHRocm91Z2ggdGhlIHF1ZXVlZCB3cml0ZXMgYW5kIGNob29zZSB0aGUgZmlyc3Qgb25lXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb3JyZXNwb25kaW5nIHRvIGEgc3RyZWFtIHRoYXQncyBzdGlsbCBhY3RpdmUuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWV1ZWRFbGVtZW50ID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMud3JpdGVRdWV1ZS5zaGlmdCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXVlZFN0cmVhbSA9IHRoaXMuZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChxdWV1ZWRFbGVtZW50LmxvY2FsU3RyZWFtSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHF1ZXVlZFN0cmVhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXVlZFN0cmVhbS53cml0ZShxdWV1ZWRFbGVtZW50Lm1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ1dSVEUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RyZWFtID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChtc2cuYXJnMSkpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ09LQVknLCBzdHJlYW0ubG9jYWxTdHJlYW1JZCwgc3RyZWFtLnJlbW90ZVN0cmVhbUlkKTtcbiAgICAgICAgICAgICAgICBzdHJlYW0uc2lnbmFsU3RyZWFtRGF0YShtc2cuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGBVbmV4cGVjdGVkIG1lc3NhZ2UgJHttc2d9IGluIHN0YXRlICR7dGhpcy5zdGF0ZX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobG9jYWxTdHJlYW1JZCkge1xuICAgICAgICBmb3IgKGNvbnN0IHN0cmVhbSBvZiB0aGlzLnN0cmVhbXMpIHtcbiAgICAgICAgICAgIGlmIChzdHJlYW0ubG9jYWxTdHJlYW1JZCA9PT0gbG9jYWxTdHJlYW1JZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdHJlYW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gIFRoZSBoZWFkZXIgYW5kIHRoZSBtZXNzYWdlIGRhdGEgbXVzdCBiZSBzZW50IGNvbnNlY3V0aXZlbHkuIFVzaW5nIDIgYXdhaXRzXG4gICAgLy8gIEFub3RoZXIgbWVzc2FnZSBjYW4gaW50ZXJsZWF2ZSBhZnRlciB0aGUgZmlyc3QgaGVhZGVyIGhhcyBiZWVuIHNlbnQsXG4gICAgLy8gIHJlc3VsdGluZyBpbiBzb21ldGhpbmcgbGlrZSBbaGVhZGVyMV0gW2hlYWRlcjJdIFtkYXRhMV0gW2RhdGEyXTtcbiAgICAvLyAgSW4gdGhpcyB3YXkgd2UgYXJlIHdhaXRpbmcgYm90aCBwcm9taXNlcyB0byBiZSByZXNvbHZlZCBiZWZvcmUgY29udGludWluZy5cbiAgICBhc3luYyBzZW5kTWVzc2FnZShjbWQsIGFyZzAsIGFyZzEsIGRhdGEpIHtcbiAgICAgICAgY29uc3QgbXNnID0gQWRiTXNnLmNyZWF0ZSh7IGNtZCwgYXJnMCwgYXJnMSwgZGF0YSwgdXNlQ2hlY2tzdW06IHRoaXMudXNlQ2hlY2tzdW0gfSk7XG4gICAgICAgIGNvbnN0IG1zZ0hlYWRlciA9IG1zZy5lbmNvZGVIZWFkZXIoKTtcbiAgICAgICAgY29uc3QgbXNnRGF0YSA9IG1zZy5kYXRhO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKG1zZ0hlYWRlci5sZW5ndGggPD0gdGhpcy5tYXhQYXlsb2FkICYmXG4gICAgICAgICAgICBtc2dEYXRhLmxlbmd0aCA8PSB0aGlzLm1heFBheWxvYWQpO1xuICAgICAgICBjb25zdCBzZW5kUHJvbWlzZXMgPSBbdGhpcy53cmFwVXNiKHRoaXMuZGV2aWNlLnRyYW5zZmVyT3V0KHRoaXMudXNiV3JpdGVFcEVuZHBvaW50LCBtc2dIZWFkZXIuYnVmZmVyKSldO1xuICAgICAgICBpZiAobXNnLmRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VuZFByb21pc2VzLnB1c2godGhpcy53cmFwVXNiKHRoaXMuZGV2aWNlLnRyYW5zZmVyT3V0KHRoaXMudXNiV3JpdGVFcEVuZHBvaW50LCBtc2dEYXRhLmJ1ZmZlcikpKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChzZW5kUHJvbWlzZXMpO1xuICAgIH1cbiAgICB3cmFwVXNiKHByb21pc2UpIHtcbiAgICAgICAgcmV0dXJuICgwLCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS53cmFwUmVjb3JkaW5nRXJyb3IpKHByb21pc2UsIHRoaXMucmVhY2hEaXNjb25uZWN0U3RhdGUuYmluZCh0aGlzKSk7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJDb25uZWN0aW9uT3ZlcldlYnVzYiA9IEFkYkNvbm5lY3Rpb25PdmVyV2VidXNiO1xuLy8gQW4gQWRiT3ZlcldlYnVzYlN0cmVhbSBpcyBpbnN0YW50aWF0ZWQgYWZ0ZXIgdGhlIGNyZWF0aW9uIG9mIGEgc29ja2V0IHRvIHRoZVxuLy8gZGV2aWNlLiBUaGFua3MgdG8gdGhpcywgd2UgY2FuIHNlbmQgY29tbWFuZHMgYW5kIHJlY2VpdmUgdGhlaXIgb3V0cHV0LlxuLy8gTWVzc2FnZXMgYXJlIHJlY2VpdmVkIGluIHRoZSBtYWluIGFkYiBjbGFzcywgYW5kIGFyZSBmb3J3YXJkZWQgdG8gYW4gaW5zdGFuY2Vcbi8vIG9mIHRoaXMgY2xhc3MgYmFzZWQgb24gYSBzdHJlYW0gaWQgbWF0Y2guXG5jbGFzcyBBZGJPdmVyV2VidXNiU3RyZWFtIHtcbiAgICBjb25zdHJ1Y3RvcihhZGIsIGxvY2FsU3RyZWFtSWQsIHJlbW90ZVN0cmVhbUlkKSB7XG4gICAgICAgIHRoaXMub25TdHJlYW1EYXRhQ2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMub25TdHJlYW1DbG9zZUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLnJlbW90ZVN0cmVhbUlkID0gLTE7XG4gICAgICAgIHRoaXMuYWRiQ29ubmVjdGlvbiA9IGFkYjtcbiAgICAgICAgdGhpcy5sb2NhbFN0cmVhbUlkID0gbG9jYWxTdHJlYW1JZDtcbiAgICAgICAgdGhpcy5yZW1vdGVTdHJlYW1JZCA9IHJlbW90ZVN0cmVhbUlkO1xuICAgICAgICAvLyBXaGVuIHRoZSBzdHJlYW0gaXMgY3JlYXRlZCwgdGhlIGNvbm5lY3Rpb24gaGFzIGJlZW4gYWxyZWFkeSBlc3RhYmxpc2hlZC5cbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBhZGRPblN0cmVhbURhdGFDYWxsYmFjayhvblN0cmVhbURhdGEpIHtcbiAgICAgICAgdGhpcy5vblN0cmVhbURhdGFDYWxsYmFja3MucHVzaChvblN0cmVhbURhdGEpO1xuICAgIH1cbiAgICBhZGRPblN0cmVhbUNsb3NlQ2FsbGJhY2sob25TdHJlYW1DbG9zZSkge1xuICAgICAgICB0aGlzLm9uU3RyZWFtQ2xvc2VDYWxsYmFja3MucHVzaChvblN0cmVhbUNsb3NlKTtcbiAgICB9XG4gICAgLy8gVXNlZCBieSB0aGUgY29ubmVjdGlvbiBvYmplY3QgdG8gc2lnbmFsIG5ld2x5IHJlY2VpdmVkIGRhdGEsIG5vdCBleHBvc2VkXG4gICAgLy8gaW4gdGhlIGludGVyZmFjZS5cbiAgICBzaWduYWxTdHJlYW1EYXRhKGRhdGEpIHtcbiAgICAgICAgZm9yIChjb25zdCBvblN0cmVhbURhdGEgb2YgdGhpcy5vblN0cmVhbURhdGFDYWxsYmFja3MpIHtcbiAgICAgICAgICAgIG9uU3RyZWFtRGF0YShkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBVc2VkIGJ5IHRoZSBjb25uZWN0aW9uIG9iamVjdCB0byBzaWduYWwgdGhlIHN0cmVhbSBpcyBjbG9zZWQsIG5vdCBleHBvc2VkXG4gICAgLy8gaW4gdGhlIGludGVyZmFjZS5cbiAgICBzaWduYWxTdHJlYW1DbG9zZWQoKSB7XG4gICAgICAgIGZvciAoY29uc3Qgb25TdHJlYW1DbG9zZSBvZiB0aGlzLm9uU3RyZWFtQ2xvc2VDYWxsYmFja3MpIHtcbiAgICAgICAgICAgIG9uU3RyZWFtQ2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uU3RyZWFtRGF0YUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLm9uU3RyZWFtQ2xvc2VDYWxsYmFja3MgPSBbXTtcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHRoaXMuY2xvc2VBbmRXYWl0Rm9yVGVhcmRvd24oKTtcbiAgICB9XG4gICAgYXN5bmMgY2xvc2VBbmRXYWl0Rm9yVGVhcmRvd24oKSB7XG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRiQ29ubmVjdGlvbi5zdHJlYW1DbG9zZSh0aGlzKTtcbiAgICB9XG4gICAgd3JpdGUobXNnKSB7XG4gICAgICAgIHRoaXMuYWRiQ29ubmVjdGlvbi5zdHJlYW1Xcml0ZShtc2csIHRoaXMpO1xuICAgIH1cbiAgICBpc0Nvbm5lY3RlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQ29ubmVjdGVkO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiT3ZlcldlYnVzYlN0cmVhbSA9IEFkYk92ZXJXZWJ1c2JTdHJlYW07XG5jb25zdCBBREJfTVNHX1NJWkUgPSA2ICogNDsgLy8gNiAqIGludDMyLlxuY2xhc3MgQWRiTXNnIHtcbiAgICBjb25zdHJ1Y3RvcihjbWQsIGFyZzAsIGFyZzEsIGRhdGFMZW4sIGRhdGFDaGVja3N1bSwgdXNlQ2hlY2tzdW0gPSBmYWxzZSkge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGNtZC5sZW5ndGggPT09IDQpO1xuICAgICAgICB0aGlzLmNtZCA9IGNtZDtcbiAgICAgICAgdGhpcy5hcmcwID0gYXJnMDtcbiAgICAgICAgdGhpcy5hcmcxID0gYXJnMTtcbiAgICAgICAgdGhpcy5kYXRhTGVuID0gZGF0YUxlbjtcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YUxlbik7XG4gICAgICAgIHRoaXMuZGF0YUNoZWNrc3VtID0gZGF0YUNoZWNrc3VtO1xuICAgICAgICB0aGlzLnVzZUNoZWNrc3VtID0gdXNlQ2hlY2tzdW07XG4gICAgfVxuICAgIHN0YXRpYyBjcmVhdGUoeyBjbWQsIGFyZzAsIGFyZzEsIGRhdGEsIHVzZUNoZWNrc3VtID0gdHJ1ZSB9KSB7XG4gICAgICAgIGNvbnN0IGVuY29kZWREYXRhID0gdGhpcy5lbmNvZGVEYXRhKGRhdGEpO1xuICAgICAgICBjb25zdCBtc2cgPSBuZXcgQWRiTXNnKGNtZCwgYXJnMCwgYXJnMSwgZW5jb2RlZERhdGEubGVuZ3RoLCAwLCB1c2VDaGVja3N1bSk7XG4gICAgICAgIG1zZy5kYXRhID0gZW5jb2RlZERhdGE7XG4gICAgICAgIHJldHVybiBtc2c7XG4gICAgfVxuICAgIGdldCBkYXRhU3RyKCkge1xuICAgICAgICByZXR1cm4gdGV4dERlY29kZXIuZGVjb2RlKHRoaXMuZGF0YSk7XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYCR7dGhpcy5jbWR9IFske3RoaXMuYXJnMH0sJHt0aGlzLmFyZzF9XSAke3RoaXMuZGF0YVN0cn1gO1xuICAgIH1cbiAgICAvLyBBIGJyaWVmIGRlc2NyaXB0aW9uIG9mIHRoZSBtZXNzYWdlIGNhbiBiZSBmb3VuZCBoZXJlOlxuICAgIC8vIGh0dHBzOi8vYW5kcm9pZC5nb29nbGVzb3VyY2UuY29tL3BsYXRmb3JtL3N5c3RlbS9jb3JlLysvbWFpbi9hZGIvcHJvdG9jb2wudHh0XG4gICAgLy9cbiAgICAvLyBzdHJ1Y3QgYW1lc3NhZ2Uge1xuICAgIC8vICAgICB1aW50MzJfdCBjb21tYW5kOyAgICAvLyBjb21tYW5kIGlkZW50aWZpZXIgY29uc3RhbnRcbiAgICAvLyAgICAgdWludDMyX3QgYXJnMDsgICAgICAgLy8gZmlyc3QgYXJndW1lbnRcbiAgICAvLyAgICAgdWludDMyX3QgYXJnMTsgICAgICAgLy8gc2Vjb25kIGFyZ3VtZW50XG4gICAgLy8gICAgIHVpbnQzMl90IGRhdGFfbGVuZ3RoOy8vIGxlbmd0aCBvZiBwYXlsb2FkICgwIGlzIGFsbG93ZWQpXG4gICAgLy8gICAgIHVpbnQzMl90IGRhdGFfY2hlY2s7IC8vIGNoZWNrc3VtIG9mIGRhdGEgcGF5bG9hZFxuICAgIC8vICAgICB1aW50MzJfdCBtYWdpYzsgICAgICAvLyBjb21tYW5kIF4gMHhmZmZmZmZmZlxuICAgIC8vIH07XG4gICAgc3RhdGljIGRlY29kZUhlYWRlcihkdikge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGR2LmJ5dGVMZW5ndGggPT09IEFEQl9NU0dfU0laRSk7XG4gICAgICAgIGNvbnN0IGNtZCA9IHRleHREZWNvZGVyLmRlY29kZShkdi5idWZmZXIuc2xpY2UoMCwgNCkpO1xuICAgICAgICBjb25zdCBjbWROdW0gPSBkdi5nZXRVaW50MzIoMCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGFyZzAgPSBkdi5nZXRVaW50MzIoNCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGFyZzEgPSBkdi5nZXRVaW50MzIoOCwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGRhdGFMZW4gPSBkdi5nZXRVaW50MzIoMTIsIHRydWUpO1xuICAgICAgICBjb25zdCBkYXRhQ2hlY2tzdW0gPSBkdi5nZXRVaW50MzIoMTYsIHRydWUpO1xuICAgICAgICBjb25zdCBjbWRDaGVja3N1bSA9IGR2LmdldFVpbnQzMigyMCwgdHJ1ZSk7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkoY21kTnVtID09PSAoY21kQ2hlY2tzdW0gXiAweEZGRkZGRkZGKSk7XG4gICAgICAgIHJldHVybiBuZXcgQWRiTXNnKGNtZCwgYXJnMCwgYXJnMSwgZGF0YUxlbiwgZGF0YUNoZWNrc3VtKTtcbiAgICB9XG4gICAgZW5jb2RlSGVhZGVyKCkge1xuICAgICAgICBjb25zdCBidWYgPSBuZXcgVWludDhBcnJheShBREJfTVNHX1NJWkUpO1xuICAgICAgICBjb25zdCBkdiA9IG5ldyBEYXRhVmlldyhidWYuYnVmZmVyKTtcbiAgICAgICAgY29uc3QgY21kQnl0ZXMgPSB0ZXh0RW5jb2Rlci5lbmNvZGUodGhpcy5jbWQpO1xuICAgICAgICBjb25zdCByYXdNc2cgPSBBZGJNc2cuZW5jb2RlRGF0YSh0aGlzLmRhdGEpO1xuICAgICAgICBjb25zdCBjaGVja3N1bSA9IHRoaXMudXNlQ2hlY2tzdW0gPyBnZW5lcmF0ZUNoZWNrc3VtKHJhd01zZykgOiAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKylcbiAgICAgICAgICAgIGR2LnNldFVpbnQ4KGksIGNtZEJ5dGVzW2ldKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDQsIHRoaXMuYXJnMCwgdHJ1ZSk7XG4gICAgICAgIGR2LnNldFVpbnQzMig4LCB0aGlzLmFyZzEsIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMTIsIHJhd01zZy5ieXRlTGVuZ3RoLCB0cnVlKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDE2LCBjaGVja3N1bSwgdHJ1ZSk7XG4gICAgICAgIGR2LnNldFVpbnQzMigyMCwgZHYuZ2V0VWludDMyKDAsIHRydWUpIF4gMHhGRkZGRkZGRiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBidWY7XG4gICAgfVxuICAgIHN0YXRpYyBlbmNvZGVEYXRhKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShbXSk7XG4gICAgICAgIGlmICgoMCwgb2JqZWN0X3V0aWxzXzEuaXNTdHJpbmcpKGRhdGEpKVxuICAgICAgICAgICAgcmV0dXJuIHRleHRFbmNvZGVyLmVuY29kZShkYXRhICsgJ1xcMCcpO1xuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiRmlsZUhhbmRsZXIgPSB2b2lkIDA7XG5jb25zdCBjdXN0b21fdXRpbHNfMSA9IHJlcXVpcmUoXCJjdXN0b21fdXRpbHNcIik7XG5jb25zdCBkZWZlcnJlZF8xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvZGVmZXJyZWRcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3QgYXJyYXlfYnVmZmVyX2J1aWxkZXJfMSA9IHJlcXVpcmUoXCIuLi9hcnJheV9idWZmZXJfYnVpbGRlclwiKTtcbmNvbnN0IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXCIpO1xuY29uc3QgcmVjb3JkaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9yZWNvcmRpbmdfdXRpbHNcIik7XG4vLyBodHRwczovL2NzLmFuZHJvaWQuY29tL2FuZHJvaWQvcGxhdGZvcm0vc3VwZXJwcm9qZWN0LysvbWFpbjpwYWNrYWdlcy9cbi8vIG1vZHVsZXMvYWRiL2ZpbGVfc3luY19wcm90b2NvbC5oO2w9MTQ0XG5jb25zdCBNQVhfU1lOQ19TRU5EX0NIVU5LX1NJWkUgPSA2NCAqIDEwMjQ7XG4vLyBBZGIgZG9lcyBub3QgYWNjdXJhdGVseSBzZW5kIHNvbWUgZmlsZSBwZXJtaXNzaW9ucy4gSWYgeW91IG5lZWQgYSBzcGVjaWFsIHNldFxuLy8gb2YgcGVybWlzc2lvbnMsIGRvIG5vdCByZWx5IG9uIHRoaXMgdmFsdWUuIFJhdGhlciwgc2VuZCBhIHNoZWxsIGNvbW1hbmQgd2hpY2hcbi8vIGV4cGxpY2l0bHkgc2V0cyBwZXJtaXNzaW9ucywgc3VjaCBhczpcbi8vICdzaGVsbDpjaG1vZCAke3Blcm1pc3Npb25zfSAke3BhdGh9J1xuY29uc3QgRklMRV9QRVJNSVNTSU9OUyA9IDIgKiogMTUgKyAwbzY0NDtcbmNvbnN0IHRleHREZWNvZGVyID0gbmV3IGN1c3RvbV91dGlsc18xLl9UZXh0RGVjb2RlcigpO1xuLy8gRm9yIGRldGFpbHMgYWJvdXQgdGhlIHByb3RvY29sLCBzZWU6XG4vLyBodHRwczovL2NzLmFuZHJvaWQuY29tL2FuZHJvaWQvcGxhdGZvcm0vc3VwZXJwcm9qZWN0LysvbWFpbjpwYWNrYWdlcy9tb2R1bGVzL2FkYi9TWU5DLlRYVFxuY2xhc3MgQWRiRmlsZUhhbmRsZXIge1xuICAgIGNvbnN0cnVjdG9yKGJ5dGVTdHJlYW0pIHtcbiAgICAgICAgdGhpcy5ieXRlU3RyZWFtID0gYnl0ZVN0cmVhbTtcbiAgICAgICAgdGhpcy5zZW50Qnl0ZUNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5pc1B1c2hPbmdvaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIGFzeW5jIHB1c2hCaW5hcnkoYmluYXJ5LCBwYXRoKSB7XG4gICAgICAgIC8vIEZvciBhIGdpdmVuIGJ5dGVTdHJlYW0sIHdlIG9ubHkgc3VwcG9ydCBwdXNoaW5nIG9uZSBiaW5hcnkgYXQgYSB0aW1lLlxuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydEZhbHNlKSh0aGlzLmlzUHVzaE9uZ29pbmcpO1xuICAgICAgICB0aGlzLmlzUHVzaE9uZ29pbmcgPSB0cnVlO1xuICAgICAgICBjb25zdCB0cmFuc2ZlckZpbmlzaGVkID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIHRoaXMuYnl0ZVN0cmVhbS5hZGRPblN0cmVhbURhdGFDYWxsYmFjaygoZGF0YSkgPT4gdGhpcy5vblN0cmVhbURhdGEoZGF0YSwgdHJhbnNmZXJGaW5pc2hlZCkpO1xuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0uYWRkT25TdHJlYW1DbG9zZUNhbGxiYWNrKCgpID0+IHRoaXMuaXNQdXNoT25nb2luZyA9IGZhbHNlKTtcbiAgICAgICAgY29uc3Qgc2VuZE1lc3NhZ2UgPSBuZXcgYXJyYXlfYnVmZmVyX2J1aWxkZXJfMS5BcnJheUJ1ZmZlckJ1aWxkZXIoKTtcbiAgICAgICAgLy8gJ1NFTkQnIGlzIHRoZSBBUEkgbWV0aG9kIHVzZWQgdG8gc2VuZCBhIGZpbGUgdG8gZGV2aWNlLlxuICAgICAgICBzZW5kTWVzc2FnZS5hcHBlbmQoJ1NFTkQnKTtcbiAgICAgICAgLy8gVGhlIHJlbW90ZSBmaWxlIG5hbWUgaXMgc3BsaXQgaW50byB0d28gcGFydHMgc2VwYXJhdGVkIGJ5IHRoZSBsYXN0XG4gICAgICAgIC8vIGNvbW1hIChcIixcIikuIFRoZSBmaXJzdCBwYXJ0IGlzIHRoZSBhY3R1YWwgcGF0aCwgd2hpbGUgdGhlIHNlY29uZCBpcyBhXG4gICAgICAgIC8vIGRlY2ltYWwgZW5jb2RlZCBmaWxlIG1vZGUgY29udGFpbmluZyB0aGUgcGVybWlzc2lvbnMgb2YgdGhlIGZpbGUgb25cbiAgICAgICAgLy8gZGV2aWNlLlxuICAgICAgICBzZW5kTWVzc2FnZS5hcHBlbmQocGF0aC5sZW5ndGggKyA2KTtcbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKHBhdGgpO1xuICAgICAgICBzZW5kTWVzc2FnZS5hcHBlbmQoJywnKTtcbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKEZJTEVfUEVSTUlTU0lPTlMudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMuYnl0ZVN0cmVhbS53cml0ZShuZXcgVWludDhBcnJheShzZW5kTWVzc2FnZS50b0FycmF5QnVmZmVyKCkpKTtcbiAgICAgICAgd2hpbGUgKCEoYXdhaXQgdGhpcy5zZW5kTmV4dERhdGFDaHVuayhiaW5hcnkpKSlcbiAgICAgICAgICAgIDtcbiAgICAgICAgcmV0dXJuIHRyYW5zZmVyRmluaXNoZWQ7XG4gICAgfVxuICAgIG9uU3RyZWFtRGF0YShkYXRhLCB0cmFuc2ZlckZpbmlzaGVkKSB7XG4gICAgICAgIHRoaXMuc2VudEJ5dGVDb3VudCA9IDA7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gdGV4dERlY29kZXIuZGVjb2RlKGRhdGEpO1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3BsaXQoJ1xcbicpWzBdLmluY2x1ZGVzKCdGQUlMJykpIHtcbiAgICAgICAgICAgIC8vIFNhbXBsZSBmYWlsdXJlIHJlc3BvbnNlICh3aGVuIHRoZSBmaWxlIGlzIHRyYW5zZmVycmVkIHN1Y2Nlc3NmdWxseVxuICAgICAgICAgICAgLy8gYnV0IHRoZSBkYXRlIGlzIG5vdCBmb3JtYXR0ZWQgY29ycmVjdGx5KTpcbiAgICAgICAgICAgIC8vICdPS0FZRkFJTFxcbnBhdGggdG9vIGxvbmcnXG4gICAgICAgICAgICB0cmFuc2ZlckZpbmlzaGVkLnJlamVjdChuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoYCR7cmVjb3JkaW5nX3V0aWxzXzEuQklOQVJZX1BVU0hfRkFJTFVSRX06ICR7cmVzcG9uc2V9YCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRleHREZWNvZGVyLmRlY29kZShkYXRhKS5zdWJzdHJpbmcoMCwgNCkgPT09ICdPS0FZJykge1xuICAgICAgICAgICAgLy8gSW4gY2FzZSBvZiBzdWNjZXNzLCB0aGUgc2VydmVyIHJlc3BvbmRzIHRvIHRoZSBsYXN0IHJlcXVlc3Qgd2l0aFxuICAgICAgICAgICAgLy8gJ09LQVknLlxuICAgICAgICAgICAgdHJhbnNmZXJGaW5pc2hlZC5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoYCR7cmVjb3JkaW5nX3V0aWxzXzEuQklOQVJZX1BVU0hfVU5LTk9XTl9SRVNQT05TRX06ICR7cmVzcG9uc2V9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgc2VuZE5leHREYXRhQ2h1bmsoYmluYXJ5KSB7XG4gICAgICAgIGNvbnN0IGVuZFBvc2l0aW9uID0gTWF0aC5taW4odGhpcy5zZW50Qnl0ZUNvdW50ICsgTUFYX1NZTkNfU0VORF9DSFVOS19TSVpFLCBiaW5hcnkuYnl0ZUxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGNodW5rID0gYXdhaXQgYmluYXJ5LnNsaWNlKHRoaXMuc2VudEJ5dGVDb3VudCwgZW5kUG9zaXRpb24pO1xuICAgICAgICAvLyBUaGUgZmlsZSBpcyBzZW50IGluIGNodW5rcy4gRWFjaCBjaHVuayBpcyBwcmVmaXhlZCB3aXRoIFwiREFUQVwiIGFuZCB0aGVcbiAgICAgICAgLy8gY2h1bmsgbGVuZ3RoLiBUaGlzIGlzIHJlcGVhdGVkIHVudGlsIHRoZSBlbnRpcmUgZmlsZSBpcyB0cmFuc2ZlcnJlZC4gRWFjaFxuICAgICAgICAvLyBjaHVuayBtdXN0IG5vdCBiZSBsYXJnZXIgdGhhbiA2NGsuXG4gICAgICAgIGNvbnN0IGNodW5rTGVuZ3RoID0gY2h1bmsuYnl0ZUxlbmd0aDtcbiAgICAgICAgY29uc3QgZGF0YU1lc3NhZ2UgPSBuZXcgYXJyYXlfYnVmZmVyX2J1aWxkZXJfMS5BcnJheUJ1ZmZlckJ1aWxkZXIoKTtcbiAgICAgICAgZGF0YU1lc3NhZ2UuYXBwZW5kKCdEQVRBJyk7XG4gICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZChjaHVua0xlbmd0aCk7XG4gICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZChuZXcgVWludDhBcnJheShjaHVuay5idWZmZXIsIGNodW5rLmJ5dGVPZmZzZXQsIGNodW5rTGVuZ3RoKSk7XG4gICAgICAgIHRoaXMuc2VudEJ5dGVDb3VudCArPSBjaHVua0xlbmd0aDtcbiAgICAgICAgY29uc3QgaXNEb25lID0gdGhpcy5zZW50Qnl0ZUNvdW50ID09PSBiaW5hcnkuYnl0ZUxlbmd0aDtcbiAgICAgICAgaWYgKGlzRG9uZSkge1xuICAgICAgICAgICAgLy8gV2hlbiB0aGUgZmlsZSBpcyB0cmFuc2ZlcnJlZCBhIHN5bmMgcmVxdWVzdCBcIkRPTkVcIiBpcyBzZW50LCB0b2dldGhlclxuICAgICAgICAgICAgLy8gd2l0aCBhIHRpbWVzdGFtcCwgcmVwcmVzZW50aW5nIHRoZSBsYXN0IG1vZGlmaWVkIHRpbWUgZm9yIHRoZSBmaWxlLiBUaGVcbiAgICAgICAgICAgIC8vIHNlcnZlciByZXNwb25kcyB0byB0aGlzIGxhc3QgcmVxdWVzdC5cbiAgICAgICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZCgnRE9ORScpO1xuICAgICAgICAgICAgLy8gV2Ugc2VuZCB0aGUgZGF0ZSBpbiBzZWNvbmRzLlxuICAgICAgICAgICAgZGF0YU1lc3NhZ2UuYXBwZW5kKE1hdGguZmxvb3IoRGF0ZS5ub3coKSAvIDEwMDApKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0ud3JpdGUobmV3IFVpbnQ4QXJyYXkoZGF0YU1lc3NhZ2UudG9BcnJheUJ1ZmZlcigpKSk7XG4gICAgICAgIHJldHVybiBpc0RvbmU7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJGaWxlSGFuZGxlciA9IEFkYkZpbGVIYW5kbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYktleSA9IHZvaWQgMDtcbmNvbnN0IGpzYm5fcnNhXzEgPSByZXF1aXJlKFwianNibi1yc2FcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3Qgc3RyaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9zdHJpbmdfdXRpbHNcIik7XG5jb25zdCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMSA9IHJlcXVpcmUoXCIuLi9yZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdcIik7XG5jb25zdCBXT1JEX1NJWkUgPSA0O1xuY29uc3QgTU9EVUxVU19TSVpFX0JJVFMgPSAyMDQ4O1xuY29uc3QgTU9EVUxVU19TSVpFID0gTU9EVUxVU19TSVpFX0JJVFMgLyA4O1xuY29uc3QgTU9EVUxVU19TSVpFX1dPUkRTID0gTU9EVUxVU19TSVpFIC8gV09SRF9TSVpFO1xuY29uc3QgUFVCS0VZX0VOQ09ERURfU0laRSA9IDMgKiBXT1JEX1NJWkUgKyAyICogTU9EVUxVU19TSVpFO1xuY29uc3QgQURCX1dFQl9DUllQVE9fQUxHT1JJVEhNID0ge1xuICAgIG5hbWU6ICdSU0FTU0EtUEtDUzEtdjFfNScsXG4gICAgaGFzaDogeyBuYW1lOiAnU0hBLTEnIH0sXG4gICAgcHVibGljRXhwb25lbnQ6IG5ldyBVaW50OEFycmF5KFsweDAxLCAweDAwLCAweDAxXSksIC8vIDY1NTM3XG4gICAgbW9kdWx1c0xlbmd0aDogTU9EVUxVU19TSVpFX0JJVFMsXG59O1xuY29uc3QgQURCX1dFQl9DUllQVE9fRVhQT1JUQUJMRSA9IHRydWU7XG5jb25zdCBBREJfV0VCX0NSWVBUT19PUEVSQVRJT05TID0gWydzaWduJ107XG5jb25zdCBTSUdOSU5HX0FTTjFfUFJFRklYID0gW1xuICAgIDB4MDAsXG4gICAgMHgzMCxcbiAgICAweDIxLFxuICAgIDB4MzAsXG4gICAgMHgwOSxcbiAgICAweDA2LFxuICAgIDB4MDUsXG4gICAgMHgyQixcbiAgICAweDBFLFxuICAgIDB4MDMsXG4gICAgMHgwMixcbiAgICAweDFBLFxuICAgIDB4MDUsXG4gICAgMHgwMCxcbiAgICAweDA0LFxuICAgIDB4MTQsXG5dO1xuY29uc3QgUjMyID0ganNibl9yc2FfMS5CaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoMzIpOyAvLyAxIDw8IDMyXG5mdW5jdGlvbiBpc1ZhbGlkSnNvbldlYktleShrZXkpIHtcbiAgICByZXR1cm4ga2V5Lm4gIT09IHVuZGVmaW5lZCAmJiBrZXkuZSAhPT0gdW5kZWZpbmVkICYmIGtleS5kICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAga2V5LnAgIT09IHVuZGVmaW5lZCAmJiBrZXkucSAhPT0gdW5kZWZpbmVkICYmIGtleS5kcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIGtleS5kcSAhPT0gdW5kZWZpbmVkICYmIGtleS5xaSAhPT0gdW5kZWZpbmVkO1xufVxuLy8gQ29udmVydCBhIEJpZ0ludGVnZXIgdG8gYW4gYXJyYXkgb2YgYSBzcGVjaWZpZWQgc2l6ZSBpbiBieXRlcy5cbmZ1bmN0aW9uIGJpZ0ludFRvRml4ZWRCeXRlQXJyYXkoYm4sIHNpemUpIHtcbiAgICBjb25zdCBwYWRkZWRCbkJ5dGVzID0gYm4udG9CeXRlQXJyYXkoKTtcbiAgICBsZXQgZmlyc3ROb25aZXJvSW5kZXggPSAwO1xuICAgIHdoaWxlIChmaXJzdE5vblplcm9JbmRleCA8IHBhZGRlZEJuQnl0ZXMubGVuZ3RoICYmXG4gICAgICAgIHBhZGRlZEJuQnl0ZXNbZmlyc3ROb25aZXJvSW5kZXhdID09PSAwKSB7XG4gICAgICAgIGZpcnN0Tm9uWmVyb0luZGV4Kys7XG4gICAgfVxuICAgIGNvbnN0IGJuQnl0ZXMgPSBVaW50OEFycmF5LmZyb20ocGFkZGVkQm5CeXRlcy5zbGljZShmaXJzdE5vblplcm9JbmRleCkpO1xuICAgIGNvbnN0IHJlcyA9IG5ldyBVaW50OEFycmF5KHNpemUpO1xuICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkoYm5CeXRlcy5sZW5ndGggPD0gcmVzLmxlbmd0aCk7XG4gICAgcmVzLnNldChibkJ5dGVzLCByZXMubGVuZ3RoIC0gYm5CeXRlcy5sZW5ndGgpO1xuICAgIHJldHVybiByZXM7XG59XG5jbGFzcyBBZGJLZXkge1xuICAgIGNvbnN0cnVjdG9yKGp3a1ByaXZhdGUpIHtcbiAgICAgICAgdGhpcy5qd2tQcml2YXRlID0gandrUHJpdmF0ZTtcbiAgICB9XG4gICAgc3RhdGljIGFzeW5jIEdlbmVyYXRlTmV3S2V5UGFpcigpIHtcbiAgICAgICAgLy8gQ29uc3RydWN0IGEgbmV3IENyeXB0b0tleVBhaXIgYW5kIGtlZXAgaXRzIHByaXZhdGUga2V5IGluIEpXQiBmb3JtYXQuXG4gICAgICAgIGNvbnN0IGtleVBhaXIgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmdlbmVyYXRlS2V5KEFEQl9XRUJfQ1JZUFRPX0FMR09SSVRITSwgQURCX1dFQl9DUllQVE9fRVhQT1JUQUJMRSwgQURCX1dFQl9DUllQVE9fT1BFUkFUSU9OUyk7XG4gICAgICAgIGNvbnN0IGp3a1ByaXZhdGUgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmV4cG9ydEtleSgnandrJywga2V5UGFpci5wcml2YXRlS2V5KTtcbiAgICAgICAgaWYgKCFpc1ZhbGlkSnNvbldlYktleShqd2tQcml2YXRlKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKCdDb3VsZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBwcml2YXRlIGtleS4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFkYktleShqd2tQcml2YXRlKTtcbiAgICB9XG4gICAgc3RhdGljIERlc2VyaWFsaXplS2V5KHNlcmlhbGl6ZWRLZXkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBZGJLZXkoSlNPTi5wYXJzZShzZXJpYWxpemVkS2V5KSk7XG4gICAgfVxuICAgIC8vIFBlcmZvcm0gYW4gUlNBIHNpZ25pbmcgb3BlcmF0aW9uIGZvciB0aGUgQURCIGF1dGggY2hhbGxlbmdlLlxuICAgIC8vXG4gICAgLy8gRm9yIHRoZSBSU0Egc2lnbmF0dXJlLCB0aGUgdG9rZW4gaXMgZXhwZWN0ZWQgdG8gaGF2ZSBhbHJlYWR5XG4gICAgLy8gaGFkIHRoZSBTSEEtMSBtZXNzYWdlIGRpZ2VzdCBhcHBsaWVkLlxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgdGhlIGFkYiB0b2tlbiB3ZSByZWNlaXZlIGZyb20gdGhlIGRldmljZSBpcyBtYWRlIHVwIG9mIDIwIHJhbmRvbWx5XG4gICAgLy8gZ2VuZXJhdGVkIGJ5dGVzIHRoYXQgYXJlIHRyZWF0ZWQgbGlrZSBhIFNIQS0xLiBUaGVyZWZvcmUsIHdlIG5lZWQgdG8gdXBkYXRlXG4gICAgLy8gdGhlIG1lc3NhZ2UgZm9ybWF0LlxuICAgIHNpZ24odG9rZW4pIHtcbiAgICAgICAgY29uc3QgcnNhS2V5ID0gbmV3IGpzYm5fcnNhXzEuUlNBS2V5KCk7XG4gICAgICAgIHJzYUtleS5zZXRQcml2YXRlRXgoKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLm4pKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLmUpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLmQpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLnApKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLnEpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLmRwKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5kcSkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUucWkpKSk7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkocnNhS2V5Lm4uYml0TGVuZ3RoKCkgPT09IE1PRFVMVVNfU0laRV9CSVRTKTtcbiAgICAgICAgLy8gTWVzc2FnZSBMYXlvdXQgKHNpemUgZXF1YWxzIHRoYXQgb2YgdGhlIGtleSBtb2R1bHVzKTpcbiAgICAgICAgLy8gMDAgMDEgRkYgRkYgRkYgRkYgLi4uIEZGIFtBU04uMSBQUkVGSVhdIFtUT0tFTl1cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG5ldyBVaW50OEFycmF5KE1PRFVMVVNfU0laRSk7XG4gICAgICAgIC8vIEluaXRpYWxseSBmaWxsIHRoZSBidWZmZXIgd2l0aCB0aGUgcGFkZGluZ1xuICAgICAgICBtZXNzYWdlLmZpbGwoMHhGRik7XG4gICAgICAgIC8vIGFkZCBwcmVmaXhcbiAgICAgICAgbWVzc2FnZVswXSA9IDB4MDA7XG4gICAgICAgIG1lc3NhZ2VbMV0gPSAweDAxO1xuICAgICAgICAvLyBhZGQgdGhlIEFTTi4xIHByZWZpeFxuICAgICAgICBtZXNzYWdlLnNldChTSUdOSU5HX0FTTjFfUFJFRklYLCBtZXNzYWdlLmxlbmd0aCAtIFNJR05JTkdfQVNOMV9QUkVGSVgubGVuZ3RoIC0gdG9rZW4ubGVuZ3RoKTtcbiAgICAgICAgLy8gdGhlbiB0aGUgYWN0dWFsIHRva2VuIGF0IHRoZSBlbmRcbiAgICAgICAgbWVzc2FnZS5zZXQodG9rZW4sIG1lc3NhZ2UubGVuZ3RoIC0gdG9rZW4ubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgbWVzc2FnZUludGVnZXIgPSBuZXcganNibl9yc2FfMS5CaWdJbnRlZ2VyKEFycmF5LmZyb20obWVzc2FnZSkpO1xuICAgICAgICBjb25zdCBzaWduYXR1cmUgPSByc2FLZXkuZG9Qcml2YXRlKG1lc3NhZ2VJbnRlZ2VyKTtcbiAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KGJpZ0ludFRvRml4ZWRCeXRlQXJyYXkoc2lnbmF0dXJlLCBNT0RVTFVTX1NJWkUpKTtcbiAgICB9XG4gICAgLy8gQ29uc3RydWN0IHB1YmxpYyBrZXkgdG8gbWF0Y2ggdGhlIGFkYiBmb3JtYXQ6XG4gICAgLy8gZ28vY29kZXNlYXJjaC9ydmMtYXJjL3N5c3RlbS9jb3JlL2xpYmNyeXB0b191dGlscy9hbmRyb2lkX3B1YmtleS5jO2w9MzgtNTNcbiAgICBnZXRQdWJsaWNLZXkoKSB7XG4gICAgICAgIGNvbnN0IHJzYUtleSA9IG5ldyBqc2JuX3JzYV8xLlJTQUtleSgpO1xuICAgICAgICByc2FLZXkuc2V0UHVibGljKCgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5qd2tQcml2YXRlLm4pKSkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSgoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuandrUHJpdmF0ZS5lKSkpKSk7XG4gICAgICAgIGNvbnN0IG4waW52ID0gUjMyLnN1YnRyYWN0KHJzYUtleS5uLm1vZEludmVyc2UoUjMyKSkuaW50VmFsdWUoKTtcbiAgICAgICAgY29uc3QgciA9IGpzYm5fcnNhXzEuQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KDEpLnBvdyhNT0RVTFVTX1NJWkVfQklUUyk7XG4gICAgICAgIGNvbnN0IHJyID0gci5tdWx0aXBseShyKS5tb2QocnNhS2V5Lm4pO1xuICAgICAgICBjb25zdCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoUFVCS0VZX0VOQ09ERURfU0laRSk7XG4gICAgICAgIGNvbnN0IGR2ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgICAgIGR2LnNldFVpbnQzMigwLCBNT0RVTFVTX1NJWkVfV09SRFMsIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoV09SRF9TSVpFLCBuMGludiwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGR2VTggPSBuZXcgVWludDhBcnJheShkdi5idWZmZXIsIGR2LmJ5dGVPZmZzZXQsIGR2LmJ5dGVMZW5ndGgpO1xuICAgICAgICBkdlU4LnNldChiaWdJbnRUb0ZpeGVkQnl0ZUFycmF5KHJzYUtleS5uLCBNT0RVTFVTX1NJWkUpLnJldmVyc2UoKSwgMiAqIFdPUkRfU0laRSk7XG4gICAgICAgIGR2VTguc2V0KGJpZ0ludFRvRml4ZWRCeXRlQXJyYXkocnIsIE1PRFVMVVNfU0laRSkucmV2ZXJzZSgpLCAyICogV09SRF9TSVpFICsgTU9EVUxVU19TSVpFKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDIgKiBXT1JEX1NJWkUgKyAyICogTU9EVUxVU19TSVpFLCByc2FLZXkuZSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiAoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RW5jb2RlKShkdlU4KSArICcgdWkucGVyZmV0dG8uZGV2JztcbiAgICB9XG4gICAgc2VyaWFsaXplS2V5KCkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5qd2tQcml2YXRlKTtcbiAgICB9XG59XG5leHBvcnRzLkFkYktleSA9IEFkYktleTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZGJLZXlNYW5hZ2VyID0gZXhwb3J0cy5tYXliZVN0b3JlS2V5ID0gdm9pZCAwO1xuY29uc3QgYWRiX2F1dGhfMSA9IHJlcXVpcmUoXCIuL2FkYl9hdXRoXCIpO1xuZnVuY3Rpb24gaXNQYXNzd29yZENyZWRlbnRpYWwoY3JlZCkge1xuICAgIHJldHVybiBjcmVkICE9PSBudWxsICYmIGNyZWQudHlwZSA9PT0gJ3Bhc3N3b3JkJztcbn1cbmZ1bmN0aW9uIGhhc1Bhc3N3b3JkQ3JlZGVudGlhbCgpIHtcbiAgICByZXR1cm4gJ1Bhc3N3b3JkQ3JlZGVudGlhbCcgaW4gd2luZG93O1xufVxuLy8gaG93IGxvbmcgd2Ugd2lsbCBzdG9yZSB0aGUga2V5IGluIG1lbW9yeVxuY29uc3QgS0VZX0lOX01FTU9SWV9USU1FT1VUID0gMTAwMCAqIDYwICogMzA7IC8vIDMwIG1pbnV0ZXNcbi8vIFVwZGF0ZSBjcmVkZW50aWFsIHN0b3JlIHdpdGggdGhlIGdpdmVuIGtleS5cbmFzeW5jIGZ1bmN0aW9uIG1heWJlU3RvcmVLZXkoa2V5KSB7XG4gICAgaWYgKCFoYXNQYXNzd29yZENyZWRlbnRpYWwoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBuZXcgUGFzc3dvcmRDcmVkZW50aWFsKHtcbiAgICAgICAgaWQ6ICd3ZWJ1c2ItYWRiLWtleScsXG4gICAgICAgIHBhc3N3b3JkOiBrZXkuc2VyaWFsaXplS2V5KCksXG4gICAgICAgIG5hbWU6ICdXZWJVU0IgQURCIEtleScsXG4gICAgICAgIGljb25VUkw6ICdmYXZpY29uLmljbydcbiAgICB9KTtcbiAgICAvLyBUaGUgJ1NhdmUgcGFzc3dvcmQ/JyBDaHJvbWUgZGlhbG9ndWUgb25seSBhcHBlYXJzIGlmIHRoZSBrZXkgaXNcbiAgICAvLyBub3QgYWxyZWFkeSBzdG9yZWQgaW4gQ2hyb21lLlxuICAgIGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5zdG9yZShjcmVkZW50aWFsKTtcbiAgICAvLyAncHJldmVudFNpbGVudEFjY2VzcycgZ3VhcmFudGVlcyB0aGUgdXNlciBpcyBhbHdheXMgbm90aWZpZWQgd2hlblxuICAgIC8vIGNyZWRlbnRpYWxzIGFyZSBhY2Nlc3NlZC4gU29tZXRpbWVzIHRoZSB1c2VyIGlzIGFza2VkIHRvIGNsaWNrIGEgYnV0dG9uXG4gICAgLy8gYW5kIG90aGVyIHRpbWVzIG9ubHkgYSBub3RpZmljYXRpb24gaXMgc2hvd24gdGVtcG9yYXJpbHkuXG4gICAgYXdhaXQgbmF2aWdhdG9yLmNyZWRlbnRpYWxzLnByZXZlbnRTaWxlbnRBY2Nlc3MoKTtcbn1cbmV4cG9ydHMubWF5YmVTdG9yZUtleSA9IG1heWJlU3RvcmVLZXk7XG5jbGFzcyBBZGJLZXlNYW5hZ2VyIHtcbiAgICAvLyBGaW5kcyBhIGtleSwgYnkgcHJpb3JpdHk6XG4gICAgLy8gLSBsb29raW5nIGluIG1lbW9yeSAoaS5lLiB0aGlzLmtleSlcbiAgICAvLyAtIGxvb2tpbmcgaW4gdGhlIGNyZWRlbnRpYWwgc3RvcmVcbiAgICAvLyAtIGFuZCBmaW5hbGx5IGNyZWF0aW5nIG9uZSBmcm9tIHNjcmF0Y2ggaWYgbmVlZGVkXG4gICAgYXN5bmMgZ2V0S2V5KCkge1xuICAgICAgICAvLyAxLiBJZiB3ZSBoYXZlIGEgcHJpdmF0ZSBrZXkgaW4gbWVtb3J5LCB3ZSByZXR1cm4gaXQuXG4gICAgICAgIGlmICh0aGlzLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMua2V5O1xuICAgICAgICB9XG4gICAgICAgIC8vIDIuIFdlIHRyeSB0byBnZXQgdGhlIHByaXZhdGUga2V5IGZyb20gdGhlIGJyb3dzZXIuXG4gICAgICAgIC8vIFRoZSBtZWRpYXRpb24gaXMgc2V0IGFzICdvcHRpb25hbCcsIGJlY2F1c2Ugd2UgdXNlXG4gICAgICAgIC8vICdwcmV2ZW50U2lsZW50QWNjZXNzJywgd2hpY2ggc29tZXRpbWVzIHJlcXVlc3RzIHRoZSB1c2VyIHRvIGNsaWNrXG4gICAgICAgIC8vIG9uIGEgYnV0dG9uIHRvIGFsbG93IHRoZSBhdXRoLCBidXQgc29tZXRpbWVzIG9ubHkgc2hvd3MgYVxuICAgICAgICAvLyBub3RpZmljYXRpb24gYW5kIGRvZXMgbm90IHJlcXVpcmUgdGhlIHVzZXIgdG8gY2xpY2sgb24gYW55dGhpbmcuXG4gICAgICAgIC8vIElmIHdlIGhhZCBzZXQgbWVkaWF0aW9uIHRvICdyZXF1aXJlZCcsIHRoZSB1c2VyIHdvdWxkIGhhdmUgYmVlblxuICAgICAgICAvLyBhc2tlZCB0byBjbGljayBvbiBhIGJ1dHRvbiBldmVyeSB0aW1lLlxuICAgICAgICBpZiAoaGFzUGFzc3dvcmRDcmVkZW50aWFsKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHRydWUsXG4gICAgICAgICAgICAgICAgbWVkaWF0aW9uOiAnb3B0aW9uYWwnLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IGNyZWRlbnRpYWwgPSBhd2FpdCBuYXZpZ2F0b3IuY3JlZGVudGlhbHMuZ2V0KG9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKGlzUGFzc3dvcmRDcmVkZW50aWFsKGNyZWRlbnRpYWwpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXNzaWduS2V5KGFkYl9hdXRoXzEuQWRiS2V5LkRlc2VyaWFsaXplS2V5KGNyZWRlbnRpYWwucGFzc3dvcmQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyAzLiBXZSBnZW5lcmF0ZSBhIG5ldyBrZXkgcGFpci5cbiAgICAgICAgcmV0dXJuIHRoaXMuYXNzaWduS2V5KGF3YWl0IGFkYl9hdXRoXzEuQWRiS2V5LkdlbmVyYXRlTmV3S2V5UGFpcigpKTtcbiAgICB9XG4gICAgLy8gQXNzaWducyB0aGUga2V5IGEgbmV3IHZhbHVlLCBzZXRzIGEgdGltZW91dCBmb3Igc3RvcmluZyB0aGUga2V5IGluIG1lbW9yeVxuICAgIC8vIGFuZCB0aGVuIHJldHVybnMgdGhlIG5ldyBrZXkuXG4gICAgYXNzaWduS2V5KGtleSkge1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgaWYgKHRoaXMua2V5SW5NZW1vcnlUaW1lcklkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5rZXlJbk1lbW9yeVRpbWVySWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMua2V5SW5NZW1vcnlUaW1lcklkID1cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5rZXkgPSB1bmRlZmluZWQsIEtFWV9JTl9NRU1PUllfVElNRU9VVCk7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJLZXlNYW5hZ2VyID0gQWRiS2V5TWFuYWdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5SZWNvcmRpbmdFcnJvciA9IGV4cG9ydHMuc2hvd1JlY29yZGluZ01vZGFsID0gZXhwb3J0cy53cmFwUmVjb3JkaW5nRXJyb3IgPSB2b2lkIDA7XG5jb25zdCBlcnJvcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2Vycm9yc1wiKTtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX3V0aWxzXCIpO1xuLy8gVGhlIHBhdHRlcm4gZm9yIGhhbmRsaW5nIHJlY29yZGluZyBlcnJvciBjYW4gaGF2ZSB0aGUgZm9sbG93aW5nIG5lc3RpbmcgaW5cbi8vIGNhc2Ugb2YgZXJyb3JzOlxuLy8gQS4gd3JhcFJlY29yZGluZ0Vycm9yIC0+IHdyYXBzIGEgcHJvbWlzZVxuLy8gQi4gb25GYWlsdXJlIC0+IGhhcyB1c2VyIGRlZmluZWQgbG9naWMgYW5kIGNhbGxzIHNob3dSZWNvcmRpbmdNb2RhbFxuLy8gQy4gc2hvd1JlY29yZGluZ01vZGFsIC0+IHNob3dzIFVYIGZvciBhIGdpdmVuIGVycm9yOyB0aGlzIGlzIG5vdCBjYWxsZWRcbi8vICAgIGRpcmVjdGx5IGJ5IHdyYXBSZWNvcmRpbmdFcnJvciwgYmVjYXVzZSB3ZSB3YW50IHRoZSBjYWxsZXIgKHN1Y2ggYXMgdGhlXG4vLyAgICBVSSkgdG8gZGljdGF0ZSB0aGUgVVhcbi8vIFRoaXMgbWV0aG9kIHRha2VzIGEgcHJvbWlzZSBhbmQgYSBjYWxsYmFjayB0byBiZSBleGVjdXRlIGluIGNhc2UgdGhlIHByb21pc2Vcbi8vIGZhaWxzLiBJdCB0aGVuIGF3YWl0cyB0aGUgcHJvbWlzZSBhbmQgZXhlY3V0ZXMgdGhlIGNhbGxiYWNrIGluIGNhc2Ugb2Zcbi8vIGZhaWx1cmUuIEluIHRoZSByZWNvcmRpbmcgY29kZSBpdCBpcyB1c2VkIHRvIHdyYXA6XG4vLyAxLiBBY2Vzc2luZyB0aGUgV2ViVVNCIEFQSS5cbi8vIDIuIE1ldGhvZHMgcmV0dXJuaW5nIHByb21pc2VzIHdoaWNoIGNhbiBiZSByZWplY3RlZC4gRm9yIGluc3RhbmNlOlxuLy8gYSkgV2hlbiB0aGUgdXNlciBjbGlja3MgJ0FkZCBhIG5ldyBkZXZpY2UnIGJ1dCB0aGVuIGRvZXNuJ3Qgc2VsZWN0IGEgdmFsaWRcbi8vICAgIGRldmljZS5cbi8vIGIpIFdoZW4gdGhlIHVzZXIgc3RhcnRzIGEgdHJhY2luZyBzZXNzaW9uLCBidXQgY2FuY2VscyBpdCBiZWZvcmUgdGhleVxuLy8gICAgYXV0aG9yaXplIHRoZSBzZXNzaW9uIG9uIHRoZSBkZXZpY2UuXG5hc3luYyBmdW5jdGlvbiB3cmFwUmVjb3JkaW5nRXJyb3IocHJvbWlzZSwgb25GYWlsdXJlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHByb21pc2U7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIC8vIFNvbWV0aW1lcyB0aGUgbWVzc2FnZSBpcyB3cmFwcGVkIGluIGFuIEVycm9yIG9iamVjdCwgc29tZXRpbWVzIG5vdCwgc29cbiAgICAgICAgLy8gd2UgbWFrZSBzdXJlIHdlIHRyYW5zZm9ybSBpdCBpbnRvIGEgc3RyaW5nLlxuICAgICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAoMCwgZXJyb3JzXzEuZ2V0RXJyb3JNZXNzYWdlKShlKTtcbiAgICAgICAgb25GYWlsdXJlKGVycm9yTWVzc2FnZSk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuZXhwb3J0cy53cmFwUmVjb3JkaW5nRXJyb3IgPSB3cmFwUmVjb3JkaW5nRXJyb3I7XG5mdW5jdGlvbiBzaG93QWxsb3dVU0JEZWJ1Z2dpbmcoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dDb25uZWN0aW9uTG9zdEVycm9yKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93RXh0ZW5zaW9uTm90SW5zdGFsbGVkKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93RmFpbGVkVG9QdXNoQmluYXJ5KHN0cikgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93SXNzdWVQYXJzaW5nVGhlVHJhY2VkUmVzcG9uc2Uoc3RyKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dOb0RldmljZVNlbGVjdGVkKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93V2Vic29ja2V0Q29ubmVjdGlvbklzc3VlKHN0cikgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93V2ViVVNCRXJyb3JWMigpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuLy8gU2hvd3MgYSBtb2RhbCBmb3IgZXZlcnkga25vd24gdHlwZSBvZiBlcnJvciB3aGljaCBjYW4gYXJpc2UgZHVyaW5nIHJlY29yZGluZy5cbi8vIEluIHRoaXMgd2F5LCBlcnJvcnMgb2NjdXJpbmcgYXQgZGlmZmVyZW50IGxldmVscyBvZiB0aGUgcmVjb3JkaW5nIHByb2Nlc3Ncbi8vIGNhbiBiZSBoYW5kbGVkIGluIGEgY2VudHJhbCBsb2NhdGlvbi5cbmZ1bmN0aW9uIHNob3dSZWNvcmRpbmdNb2RhbChtZXNzYWdlKSB7XG4gICAgaWYgKFtcbiAgICAgICAgJ1VuYWJsZSB0byBjbGFpbSBpbnRlcmZhY2UuJyxcbiAgICAgICAgJ1RoZSBzcGVjaWZpZWQgZW5kcG9pbnQgaXMgbm90IHBhcnQgb2YgYSBjbGFpbWVkIGFuZCBzZWxlY3RlZCAnICtcbiAgICAgICAgICAgICdhbHRlcm5hdGUgaW50ZXJmYWNlLicsXG4gICAgICAgIC8vIHRocm93biB3aGVuIGNhbGxpbmcgdGhlICdyZXNldCcgbWV0aG9kIG9uIGEgV2ViVVNCIGRldmljZS5cbiAgICAgICAgJ1VuYWJsZSB0byByZXNldCB0aGUgZGV2aWNlLicsXG4gICAgXS5zb21lKChwYXJ0T2ZNZXNzYWdlKSA9PiBtZXNzYWdlLmluY2x1ZGVzKHBhcnRPZk1lc3NhZ2UpKSkge1xuICAgICAgICBzaG93V2ViVVNCRXJyb3JWMigpO1xuICAgIH1cbiAgICBlbHNlIGlmIChbXG4gICAgICAgICdBIHRyYW5zZmVyIGVycm9yIGhhcyBvY2N1cnJlZC4nLFxuICAgICAgICAnVGhlIGRldmljZSB3YXMgZGlzY29ubmVjdGVkLicsXG4gICAgICAgICdUaGUgdHJhbnNmZXIgd2FzIGNhbmNlbGxlZC4nLFxuICAgIF0uc29tZSgocGFydE9mTWVzc2FnZSkgPT4gbWVzc2FnZS5pbmNsdWRlcyhwYXJ0T2ZNZXNzYWdlKSkgfHxcbiAgICAgICAgaXNEZXZpY2VEaXNjb25uZWN0ZWRFcnJvcihtZXNzYWdlKSkge1xuICAgICAgICBzaG93Q29ubmVjdGlvbkxvc3RFcnJvcigpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXNzYWdlID09PSByZWNvcmRpbmdfdXRpbHNfMS5BTExPV19VU0JfREVCVUdHSU5HKSB7XG4gICAgICAgIHNob3dBbGxvd1VTQkRlYnVnZ2luZygpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc01lc3NhZ2VDb21wb3NlZE9mKG1lc3NhZ2UsIFtyZWNvcmRpbmdfdXRpbHNfMS5CSU5BUllfUFVTSF9GQUlMVVJFLCByZWNvcmRpbmdfdXRpbHNfMS5CSU5BUllfUFVTSF9VTktOT1dOX1JFU1BPTlNFXSkpIHtcbiAgICAgICAgc2hvd0ZhaWxlZFRvUHVzaEJpbmFyeShtZXNzYWdlLnN1YnN0cmluZyhtZXNzYWdlLmluZGV4T2YoJzonKSArIDEpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gcmVjb3JkaW5nX3V0aWxzXzEuTk9fREVWSUNFX1NFTEVDVEVEKSB7XG4gICAgICAgIHNob3dOb0RldmljZVNlbGVjdGVkKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHJlY29yZGluZ191dGlsc18xLldFQlNPQ0tFVF9VTkFCTEVfVE9fQ09OTkVDVCA9PT0gbWVzc2FnZSkge1xuICAgICAgICBzaG93V2Vic29ja2V0Q29ubmVjdGlvbklzc3VlKG1lc3NhZ2UpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXNzYWdlID09PSByZWNvcmRpbmdfdXRpbHNfMS5FWFRFTlNJT05fTk9UX0lOU1RBTExFRCkge1xuICAgICAgICBzaG93RXh0ZW5zaW9uTm90SW5zdGFsbGVkKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzTWVzc2FnZUNvbXBvc2VkT2YobWVzc2FnZSwgW1xuICAgICAgICByZWNvcmRpbmdfdXRpbHNfMS5QQVJTSU5HX1VOS05XT05fUkVRVUVTVF9JRCxcbiAgICAgICAgcmVjb3JkaW5nX3V0aWxzXzEuUEFSU0lOR19VTkFCTEVfVE9fREVDT0RFX01FVEhPRCxcbiAgICAgICAgcmVjb3JkaW5nX3V0aWxzXzEuUEFSU0lOR19VTlJFQ09HTklaRURfUE9SVCxcbiAgICAgICAgcmVjb3JkaW5nX3V0aWxzXzEuUEFSU0lOR19VTlJFQ09HTklaRURfTUVTU0FHRSxcbiAgICBdKSkge1xuICAgICAgICBzaG93SXNzdWVQYXJzaW5nVGhlVHJhY2VkUmVzcG9uc2UobWVzc2FnZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZX1gKTtcbiAgICB9XG59XG5leHBvcnRzLnNob3dSZWNvcmRpbmdNb2RhbCA9IHNob3dSZWNvcmRpbmdNb2RhbDtcbmZ1bmN0aW9uIGlzRGV2aWNlRGlzY29ubmVjdGVkRXJyb3IobWVzc2FnZSkge1xuICAgIHJldHVybiBtZXNzYWdlLmluY2x1ZGVzKCdEZXZpY2Ugd2l0aCBzZXJpYWwnKSAmJlxuICAgICAgICBtZXNzYWdlLmluY2x1ZGVzKCd3YXMgZGlzY29ubmVjdGVkLicpO1xufVxuZnVuY3Rpb24gaXNNZXNzYWdlQ29tcG9zZWRPZihtZXNzYWdlLCBpc3N1ZXMpIHtcbiAgICBmb3IgKGNvbnN0IGlzc3VlIG9mIGlzc3Vlcykge1xuICAgICAgICBpZiAobWVzc2FnZS5pbmNsdWRlcyhpc3N1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbi8vIEV4Y2VwdGlvbiB0aHJvd24gYnkgdGhlIFJlY29yZGluZyBsb2dpYy5cbmNsYXNzIFJlY29yZGluZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuZXhwb3J0cy5SZWNvcmRpbmdFcnJvciA9IFJlY29yZGluZ0Vycm9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBBUlNJTkdfVU5SRUNPR05JWkVEX01FU1NBR0UgPSBleHBvcnRzLlBBUlNJTkdfVU5SRUNPR05JWkVEX1BPUlQgPSBleHBvcnRzLlBBUlNJTkdfVU5BQkxFX1RPX0RFQ09ERV9NRVRIT0QgPSBleHBvcnRzLlBBUlNJTkdfVU5LTldPTl9SRVFVRVNUX0lEID0gZXhwb3J0cy5SRUNPUkRJTkdfSU5fUFJPR1JFU1MgPSBleHBvcnRzLkJVRkZFUl9VU0FHRV9JTkNPUlJFQ1RfRk9STUFUID0gZXhwb3J0cy5CVUZGRVJfVVNBR0VfTk9UX0FDQ0VTU0lCTEUgPSBleHBvcnRzLk1BTEZPUk1FRF9FWFRFTlNJT05fTUVTU0FHRSA9IGV4cG9ydHMuRVhURU5TSU9OX05PVF9JTlNUQUxMRUQgPSBleHBvcnRzLkVYVEVOU0lPTl9OQU1FID0gZXhwb3J0cy5FWFRFTlNJT05fVVJMID0gZXhwb3J0cy5FWFRFTlNJT05fSUQgPSBleHBvcnRzLmZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludCA9IGV4cG9ydHMuQURCX0RFVklDRV9GSUxURVIgPSBleHBvcnRzLk5PX0RFVklDRV9TRUxFQ1RFRCA9IGV4cG9ydHMuQ1VTVE9NX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSCA9IGV4cG9ydHMuREVGQVVMVF9UUkFDRURfQ09OU1VNRVJfU09DS0VUX1BBVEggPSBleHBvcnRzLkFMTE9XX1VTQl9ERUJVR0dJTkcgPSBleHBvcnRzLlRSQUNFQk9YX0ZFVENIX1RJTUVPVVQgPSBleHBvcnRzLlRSQUNFQk9YX0RFVklDRV9QQVRIID0gZXhwb3J0cy5CSU5BUllfUFVTSF9VTktOT1dOX1JFU1BPTlNFID0gZXhwb3J0cy5CSU5BUllfUFVTSF9GQUlMVVJFID0gZXhwb3J0cy5pc0NyT1MgPSBleHBvcnRzLmlzTGludXggPSBleHBvcnRzLmlzTWFjT3MgPSBleHBvcnRzLmJ1aWxkQWJkV2Vic29ja2V0Q29tbWFuZCA9IGV4cG9ydHMuV0VCU09DS0VUX0NMT1NFRF9BQk5PUk1BTExZX0NPREUgPSBleHBvcnRzLldFQlNPQ0tFVF9VTkFCTEVfVE9fQ09OTkVDVCA9IHZvaWQgMDtcbi8vIEJlZ2luIFdlYnNvY2tldCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0cy5XRUJTT0NLRVRfVU5BQkxFX1RPX0NPTk5FQ1QgPSAnVW5hYmxlIHRvIGNvbm5lY3QgdG8gZGV2aWNlIHZpYSB3ZWJzb2NrZXQuJztcbi8vIGh0dHBzOi8vd3d3LnJmYy1lZGl0b3Iub3JnL3JmYy9yZmM2NDU1I3NlY3Rpb24tNy40LjFcbmV4cG9ydHMuV0VCU09DS0VUX0NMT1NFRF9BQk5PUk1BTExZX0NPREUgPSAxMDA2O1xuLy8gVGhlIG1lc3NhZ2VzIHJlYWQgYnkgdGhlIGFkYiBzZXJ2ZXIgaGF2ZSB0aGVpciBsZW5ndGggcHJlcGVuZGVkIGluIGhleC5cbi8vIFRoaXMgbWV0aG9kIGFkZHMgdGhlIGxlbmd0aCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBtZXNzYWdlLlxuLy8gRXhhbXBsZTogJ2hvc3Q6dHJhY2stZGV2aWNlcycgLT4gJzAwMTJob3N0OnRyYWNrLWRldmljZXMnXG4vLyBnby9jb2Rlc2VhcmNoL2Fvc3AtYW5kcm9pZDExL3N5c3RlbS9jb3JlL2FkYi9TRVJWSUNFUy5UWFRcbmZ1bmN0aW9uIGJ1aWxkQWJkV2Vic29ja2V0Q29tbWFuZChjbWQpIHtcbiAgICBjb25zdCBoZHIgPSBjbWQubGVuZ3RoLnRvU3RyaW5nKDE2KS5wYWRTdGFydCg0LCAnMCcpO1xuICAgIHJldHVybiBoZHIgKyBjbWQ7XG59XG5leHBvcnRzLmJ1aWxkQWJkV2Vic29ja2V0Q29tbWFuZCA9IGJ1aWxkQWJkV2Vic29ja2V0Q29tbWFuZDtcbi8vIFNhbXBsZSB1c2VyIGFnZW50IGZvciBDaHJvbWUgb24gTWFjIE9TOlxuLy8gJ01vemlsbGEvNS4wIChNYWNpbnRvc2g7IEludGVsIE1hYyBPUyBYIDEwXzE1XzcpIEFwcGxlV2ViS2l0LzUzNy4zNlxuLy8gKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTA0LjAuMC4wIFNhZmFyaS81MzcuMzYnXG5mdW5jdGlvbiBpc01hY09zKHVzZXJBZ2VudCkge1xuICAgIHJldHVybiB1c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnIG1hYyBvcyAnKTtcbn1cbmV4cG9ydHMuaXNNYWNPcyA9IGlzTWFjT3M7XG4vLyBTYW1wbGUgdXNlciBhZ2VudCBmb3IgQ2hyb21lIG9uIExpbnV4OlxuLy8gTW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKVxuLy8gQ2hyb21lLzEwNS4wLjAuMCBTYWZhcmkvNTM3LjM2XG5mdW5jdGlvbiBpc0xpbnV4KHVzZXJBZ2VudCkge1xuICAgIHJldHVybiB1c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnIGxpbnV4ICcpO1xufVxuZXhwb3J0cy5pc0xpbnV4ID0gaXNMaW51eDtcbi8vIFNhbXBsZSB1c2VyIGFnZW50IGZvciBDaHJvbWUgb24gQ2hyb21lIE9TOlxuLy8gXCJNb3ppbGxhLzUuMCAoWDExOyBDck9TIHg4Nl82NCAxNDgxNi45OS4wKSBBcHBsZVdlYktpdC81MzcuMzZcbi8vIChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwMy4wLjUwNjAuMTE0IFNhZmFyaS81MzcuMzZcIlxuLy8gVGhpcyBjb25kaXRpb24gaXMgd2lkZXIsIGluIHRoZSB1bmxpa2VseSBwb3NzaWJpbGl0eSBvZiBkaWZmZXJlbnQgY2FzaW5nLFxuZnVuY3Rpb24gaXNDck9TKHVzZXJBZ2VudCkge1xuICAgIHJldHVybiB1c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnIGNyb3MgJyk7XG59XG5leHBvcnRzLmlzQ3JPUyA9IGlzQ3JPUztcbi8vIEVuZCBXZWJzb2NrZXQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQmVnaW4gQWRiIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnRzLkJJTkFSWV9QVVNIX0ZBSUxVUkUgPSAnQmluYXJ5UHVzaEZhaWx1cmUnO1xuZXhwb3J0cy5CSU5BUllfUFVTSF9VTktOT1dOX1JFU1BPTlNFID0gJ0JpbmFyeVB1c2hVbmtub3duUmVzcG9uc2UnO1xuLy8gSW4gY2FzZSB0aGUgZGV2aWNlIGRvZXNuJ3QgaGF2ZSB0aGUgdHJhY2Vib3gsIHdlIHVwbG9hZCB0aGUgbGF0ZXN0IHZlcnNpb25cbi8vIHRvIHRoaXMgcGF0aC5cbmV4cG9ydHMuVFJBQ0VCT1hfREVWSUNFX1BBVEggPSAnL2RhdGEvbG9jYWwvdG1wL3RyYWNlYm94Jztcbi8vIEV4cGVyaW1lbnRhbGx5LCB0aGlzIHRha2VzIDkwMG1zIG9uIHRoZSBmaXJzdCBmZXRjaCBhbmQgMjAtMzBtcyBhZnRlclxuLy8gYmVjYXVzZSBvZiBjYWNoaW5nLlxuZXhwb3J0cy5UUkFDRUJPWF9GRVRDSF9USU1FT1VUID0gMzAwMDA7XG4vLyBNZXNzYWdlIHNob3duIHRvIHRoZSB1c2VyIHdoZW4gdGhleSBuZWVkIHRvIGFsbG93IGF1dGhlbnRpY2F0aW9uIG9uIHRoZVxuLy8gZGV2aWNlIGluIG9yZGVyIHRvIGNvbm5lY3QuXG5leHBvcnRzLkFMTE9XX1VTQl9ERUJVR0dJTkcgPSAnUGxlYXNlIGFsbG93IFVTQiBkZWJ1Z2dpbmcgb24gZGV2aWNlIGFuZCB0cnkgYWdhaW4uJztcbi8vIElmIHRoZSBBbmRyb2lkIGRldmljZSBoYXMgdGhlIHRyYWNpbmcgc2VydmljZSBvbiBpdCAoZnJvbSBBUEkgdmVyc2lvbiAyOSksXG4vLyB0aGVuIHdlIGNhbiBjb25uZWN0IHRvIHRoaXMgY29uc3VtZXIgc29ja2V0LlxuZXhwb3J0cy5ERUZBVUxUX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSCA9ICdsb2NhbGZpbGVzeXN0ZW06L2Rldi9zb2NrZXQvdHJhY2VkX2NvbnN1bWVyJztcbi8vIElmIHRoZSBBbmRyb2lkIGRldmljZSBkb2VzIG5vdCBoYXZlIHRoZSB0cmFjaW5nIHNlcnZpY2Ugb24gaXQgKGJlZm9yZSBBUElcbi8vIHZlcnNpb24gMjkpLCB3ZSB3aWxsIGhhdmUgdG8gcHVzaCB0aGUgdHJhY2Vib3ggb24gdGhlIGRldmljZS4gVGhlbiwgd2Vcbi8vIGNhbiBjb25uZWN0IHRvIHRoaXMgY29uc3VtZXIgc29ja2V0ICh1c2luZyBpdCBkb2VzIG5vdCByZXF1aXJlIHN5c3RlbSBhZG1pblxuLy8gcHJpdmlsZWdlcykuXG5leHBvcnRzLkNVU1RPTV9UUkFDRURfQ09OU1VNRVJfU09DS0VUX1BBVEggPSAnbG9jYWxhYnN0cmFjdDp0cmFjZWRfY29uc3VtZXInO1xuLy8gRW5kIEFkYiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQmVnaW4gV2VidXNiIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnRzLk5PX0RFVklDRV9TRUxFQ1RFRCA9ICdObyBkZXZpY2Ugc2VsZWN0ZWQuJztcbmV4cG9ydHMuQURCX0RFVklDRV9GSUxURVIgPSB7XG4gICAgY2xhc3NDb2RlOiAyNTUsIC8vIFVTQiB2ZW5kb3Igc3BlY2lmaWMgY29kZVxuICAgIHN1YmNsYXNzQ29kZTogNjYsIC8vIEFuZHJvaWQgdmVuZG9yIHNwZWNpZmljIHN1YmNsYXNzXG4gICAgcHJvdG9jb2xDb2RlOiAxLCAvLyBBZGIgcHJvdG9jb2xcbn07XG5mdW5jdGlvbiBmaW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQoZGV2aWNlKSB7XG4gICAgY29uc3QgYWRiRGV2aWNlRmlsdGVyID0gZXhwb3J0cy5BREJfREVWSUNFX0ZJTFRFUjtcbiAgICBmb3IgKGNvbnN0IGNvbmZpZyBvZiBkZXZpY2UuY29uZmlndXJhdGlvbnMpIHtcbiAgICAgICAgZm9yIChjb25zdCBpbnRlcmZhY2VfIG9mIGNvbmZpZy5pbnRlcmZhY2VzKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFsdCBvZiBpbnRlcmZhY2VfLmFsdGVybmF0ZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWx0LmludGVyZmFjZUNsYXNzID09PSBhZGJEZXZpY2VGaWx0ZXIuY2xhc3NDb2RlICYmXG4gICAgICAgICAgICAgICAgICAgIGFsdC5pbnRlcmZhY2VTdWJjbGFzcyA9PT0gYWRiRGV2aWNlRmlsdGVyLnN1YmNsYXNzQ29kZSAmJlxuICAgICAgICAgICAgICAgICAgICBhbHQuaW50ZXJmYWNlUHJvdG9jb2wgPT09IGFkYkRldmljZUZpbHRlci5wcm90b2NvbENvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb25WYWx1ZTogY29uZmlnLmNvbmZpZ3VyYXRpb25WYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzYkludGVyZmFjZU51bWJlcjogaW50ZXJmYWNlXy5pbnRlcmZhY2VOdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludHM6IGFsdC5lbmRwb2ludHMsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSAvLyBpZiAoYWx0ZXJuYXRlKVxuICAgICAgICAgICAgfSAvLyBmb3IgKGludGVyZmFjZS5hbHRlcm5hdGVzKVxuICAgICAgICB9IC8vIGZvciAoY29uZmlndXJhdGlvbi5pbnRlcmZhY2VzKVxuICAgIH0gLy8gZm9yIChjb25maWd1cmF0aW9ucylcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZXhwb3J0cy5maW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQgPSBmaW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQ7XG4vLyBFbmQgV2VidXNiIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCZWdpbiBDaHJvbWUgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuRVhURU5TSU9OX0lEID0gJ2xmbWtwaGZwZGJqaWpocG9tZ2VjZmlraGZvaGFvaW5lJztcbmV4cG9ydHMuRVhURU5TSU9OX1VSTCA9IGBodHRwczovL2Nocm9tZS5nb29nbGUuY29tL3dlYnN0b3JlL2RldGFpbC9wZXJmZXR0by11aS8ke2V4cG9ydHMuRVhURU5TSU9OX0lEfWA7XG5leHBvcnRzLkVYVEVOU0lPTl9OQU1FID0gJ0Nocm9tZSBleHRlbnNpb24nO1xuZXhwb3J0cy5FWFRFTlNJT05fTk9UX0lOU1RBTExFRCA9IGBUbyB0cmFjZSBDaHJvbWUgZnJvbSB0aGUgUGVyZmV0dG8gVUksIHlvdSBuZWVkIHRvIGluc3RhbGwgb3VyXG4gICAgJHtleHBvcnRzLkVYVEVOU0lPTl9VUkx9IGFuZCB0aGVuIHJlbG9hZCB0aGlzIHBhZ2UuYDtcbmV4cG9ydHMuTUFMRk9STUVEX0VYVEVOU0lPTl9NRVNTQUdFID0gJ01hbGZvcm1lZCBleHRlbnNpb24gbWVzc2FnZS4nO1xuZXhwb3J0cy5CVUZGRVJfVVNBR0VfTk9UX0FDQ0VTU0lCTEUgPSAnQnVmZmVyIHVzYWdlIG5vdCBhY2Nlc3NpYmxlJztcbmV4cG9ydHMuQlVGRkVSX1VTQUdFX0lOQ09SUkVDVF9GT1JNQVQgPSAnVGhlIGJ1ZmZlciB1c2FnZSBkYXRhIGhhcyBhbSBpbmNvcnJlY3QgZm9ybWF0Jztcbi8vIEVuZCBDaHJvbWUgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQmVnaW4gVHJhY2VkIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuUkVDT1JESU5HX0lOX1BST0dSRVNTID0gJ1JlY29yZGluZyBpbiBwcm9ncmVzcyc7XG5leHBvcnRzLlBBUlNJTkdfVU5LTldPTl9SRVFVRVNUX0lEID0gJ1Vua25vd24gcmVxdWVzdCBpZCc7XG5leHBvcnRzLlBBUlNJTkdfVU5BQkxFX1RPX0RFQ09ERV9NRVRIT0QgPSAnVW5hYmxlIHRvIGRlY29kZSBtZXRob2QnO1xuZXhwb3J0cy5QQVJTSU5HX1VOUkVDT0dOSVpFRF9QT1JUID0gJ1VucmVjb2duaXplZCBjb25zdW1lciBwb3J0IHJlc3BvbnNlJztcbmV4cG9ydHMuUEFSU0lOR19VTlJFQ09HTklaRURfTUVTU0FHRSA9ICdVbnJlY29nbml6ZWQgZnJhbWUgbWVzc2FnZSc7XG4vLyBFbmQgVHJhY2VkIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQW5kcm9pZFdlYnVzYlRhcmdldEZhY3RvcnkgPSBleHBvcnRzLkFORFJPSURfV0VCVVNCX1RBUkdFVF9GQUNUT1JZID0gdm9pZCAwO1xuY29uc3QgZXJyb3JzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9lcnJvcnNcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3QgYWRiX2tleV9tYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi4vYXV0aC9hZGJfa2V5X21hbmFnZXJcIik7XG5jb25zdCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMSA9IHJlcXVpcmUoXCIuLi9yZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdcIik7XG5jb25zdCByZWNvcmRpbmdfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi9yZWNvcmRpbmdfdXRpbHNcIik7XG5jb25zdCBhbmRyb2lkX3dlYnVzYl90YXJnZXRfMSA9IHJlcXVpcmUoXCIuLi90YXJnZXRzL2FuZHJvaWRfd2VidXNiX3RhcmdldFwiKTtcbmV4cG9ydHMuQU5EUk9JRF9XRUJVU0JfVEFSR0VUX0ZBQ1RPUlkgPSAnQW5kcm9pZFdlYnVzYlRhcmdldEZhY3RvcnknO1xuY29uc3QgU0VSSUFMX05VTUJFUl9JU1NVRSA9ICdhbiBpbnZhbGlkIHNlcmlhbCBudW1iZXInO1xuY29uc3QgQURCX0lOVEVSRkFDRV9JU1NVRSA9ICdhbiBpbmNvbXBhdGlibGUgYWRiIGludGVyZmFjZSc7XG5mdW5jdGlvbiBjcmVhdGVEZXZpY2VFcnJvck1lc3NhZ2UoZGV2aWNlLCBpc3N1ZSkge1xuICAgIGNvbnN0IHByb2R1Y3ROYW1lID0gZGV2aWNlLnByb2R1Y3ROYW1lO1xuICAgIHJldHVybiBgVVNCIGRldmljZSR7cHJvZHVjdE5hbWUgPyAnICcgKyBwcm9kdWN0TmFtZSA6ICcnfSBoYXMgJHtpc3N1ZX1gO1xufVxuY2xhc3MgQW5kcm9pZFdlYnVzYlRhcmdldEZhY3Rvcnkge1xuICAgIGNvbnN0cnVjdG9yKHVzYikge1xuICAgICAgICB0aGlzLnVzYiA9IHVzYjtcbiAgICAgICAgdGhpcy5raW5kID0gZXhwb3J0cy5BTkRST0lEX1dFQlVTQl9UQVJHRVRfRkFDVE9SWTtcbiAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSA9ICgpID0+IHsgfTtcbiAgICAgICAgdGhpcy5yZWNvcmRpbmdQcm9ibGVtcyA9IFtdO1xuICAgICAgICB0aGlzLnRhcmdldHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIC8vIEFkYktleU1hbmFnZXIgc2hvdWxkIG9ubHkgYmUgaW5zdGFudGlhdGVkIG9uY2UsIHNvIHdlIGNhbiB1c2UgdGhlIHNhbWUga2V5XG4gICAgICAgIC8vIGZvciBhbGwgZGV2aWNlcy5cbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyID0gbmV3IGFkYl9rZXlfbWFuYWdlcl8xLkFkYktleU1hbmFnZXIoKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiAnQW5kcm9pZCBXZWJVc2InO1xuICAgIH1cbiAgICBsaXN0VGFyZ2V0cygpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy50YXJnZXRzLnZhbHVlcygpKTtcbiAgICB9XG4gICAgbGlzdFJlY29yZGluZ1Byb2JsZW1zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZWNvcmRpbmdQcm9ibGVtcztcbiAgICB9XG4gICAgYXN5bmMgY29ubmVjdE5ld1RhcmdldCgpIHtcbiAgICAgICAgbGV0IGRldmljZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRldmljZSA9IGF3YWl0IHRoaXMudXNiLnJlcXVlc3REZXZpY2UoeyBmaWx0ZXJzOiBbcmVjb3JkaW5nX3V0aWxzXzEuQURCX0RFVklDRV9GSUxURVJdIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoKDAsIGVycm9yc18xLmdldEVycm9yTWVzc2FnZSkoZSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRldmljZVZhbGlkID0gdGhpcy5jaGVja0RldmljZVZhbGlkaXR5KGRldmljZSk7XG4gICAgICAgIGlmICghZGV2aWNlVmFsaWQuaXNWYWxpZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGRldmljZVZhbGlkLmlzc3Vlcy5qb2luKCdcXG4nKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYW5kcm9pZFRhcmdldCA9IG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfMS5BbmRyb2lkV2VidXNiVGFyZ2V0KGRldmljZSwgdGhpcy5rZXlNYW5hZ2VyLCB0aGlzLm9uVGFyZ2V0Q2hhbmdlKTtcbiAgICAgICAgdGhpcy50YXJnZXRzLnNldCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoZGV2aWNlLnNlcmlhbE51bWJlciksIGFuZHJvaWRUYXJnZXQpO1xuICAgICAgICByZXR1cm4gYW5kcm9pZFRhcmdldDtcbiAgICB9XG4gICAgc2V0T25UYXJnZXRDaGFuZ2Uob25UYXJnZXRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSA9IG9uVGFyZ2V0Q2hhbmdlO1xuICAgIH1cbiAgICBhc3luYyBpbml0KCkge1xuICAgICAgICBsZXQgZGV2aWNlcyA9IFtdO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGV2aWNlcyA9IGF3YWl0IHRoaXMudXNiLmdldERldmljZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoXykge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBXZWJVU0Igbm90IGF2YWlsYWJsZSBvciBkaXNhbGxvd2VkIGluIGlmcmFtZS5cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGRldmljZSBvZiBkZXZpY2VzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0RldmljZVZhbGlkaXR5KGRldmljZSkuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0cy5zZXQoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKGRldmljZS5zZXJpYWxOdW1iZXIpLCBuZXcgYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0XzEuQW5kcm9pZFdlYnVzYlRhcmdldChkZXZpY2UsIHRoaXMua2V5TWFuYWdlciwgdGhpcy5vblRhcmdldENoYW5nZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXNiLmFkZEV2ZW50TGlzdGVuZXIoJ2Nvbm5lY3QnLCAoZXYpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRGV2aWNlVmFsaWRpdHkoZXYuZGV2aWNlKS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzLnNldCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoZXYuZGV2aWNlLnNlcmlhbE51bWJlciksIG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfMS5BbmRyb2lkV2VidXNiVGFyZ2V0KGV2LmRldmljZSwgdGhpcy5rZXlNYW5hZ2VyLCB0aGlzLm9uVGFyZ2V0Q2hhbmdlKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy51c2IuYWRkRXZlbnRMaXN0ZW5lcignZGlzY29ubmVjdCcsIGFzeW5jIChldikgPT4ge1xuICAgICAgICAgICAgLy8gV2UgZG9uJ3QgY2hlY2sgZGV2aWNlIHZhbGlkaXR5IHdoZW4gZGlzY29ubmVjdGluZyBiZWNhdXNlIGlmIHRoZSBkZXZpY2VcbiAgICAgICAgICAgIC8vIGlzIGludmFsaWQgd2Ugd291bGQgbm90IGhhdmUgY29ubmVjdGVkIGluIHRoZSBmaXJzdCBwbGFjZS5cbiAgICAgICAgICAgIGNvbnN0IHNlcmlhbE51bWJlciA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShldi5kZXZpY2Uuc2VyaWFsTnVtYmVyKTtcbiAgICAgICAgICAgIGF3YWl0ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLnRhcmdldHMuZ2V0KHNlcmlhbE51bWJlcikpXG4gICAgICAgICAgICAgICAgLmRpc2Nvbm5lY3QoYERldmljZSB3aXRoIHNlcmlhbCAke3NlcmlhbE51bWJlcn0gd2FzIGRpc2Nvbm5lY3RlZC5gKTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0cy5kZWxldGUoc2VyaWFsTnVtYmVyKTtcbiAgICAgICAgICAgIHRoaXMub25UYXJnZXRDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNoZWNrRGV2aWNlVmFsaWRpdHkoZGV2aWNlKSB7XG4gICAgICAgIGNvbnN0IGRldmljZVZhbGlkaXR5ID0geyBpc1ZhbGlkOiB0cnVlLCBpc3N1ZXM6IFtdIH07XG4gICAgICAgIGlmICghZGV2aWNlLnNlcmlhbE51bWJlcikge1xuICAgICAgICAgICAgZGV2aWNlVmFsaWRpdHkuaXNzdWVzLnB1c2goY3JlYXRlRGV2aWNlRXJyb3JNZXNzYWdlKGRldmljZSwgU0VSSUFMX05VTUJFUl9JU1NVRSkpO1xuICAgICAgICAgICAgZGV2aWNlVmFsaWRpdHkuaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKDAsIHJlY29yZGluZ191dGlsc18xLmZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludCkoZGV2aWNlKSkge1xuICAgICAgICAgICAgZGV2aWNlVmFsaWRpdHkuaXNzdWVzLnB1c2goY3JlYXRlRGV2aWNlRXJyb3JNZXNzYWdlKGRldmljZSwgQURCX0lOVEVSRkFDRV9JU1NVRSkpO1xuICAgICAgICAgICAgZGV2aWNlVmFsaWRpdHkuaXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb3JkaW5nUHJvYmxlbXMucHVzaCguLi5kZXZpY2VWYWxpZGl0eS5pc3N1ZXMpO1xuICAgICAgICByZXR1cm4gZGV2aWNlVmFsaWRpdHk7XG4gICAgfVxufVxuZXhwb3J0cy5BbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeSA9IEFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuZHJvaWRUYXJnZXQgPSB2b2lkIDA7XG5jb25zdCByZWNvcmRpbmdfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi9yZWNvcmRpbmdfdXRpbHNcIik7XG5jbGFzcyBBbmRyb2lkVGFyZ2V0IHtcbiAgICBjb25zdHJ1Y3RvcihhZGJDb25uZWN0aW9uLCBvblRhcmdldENoYW5nZSkge1xuICAgICAgICB0aGlzLmFkYkNvbm5lY3Rpb24gPSBhZGJDb25uZWN0aW9uO1xuICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlID0gb25UYXJnZXRDaGFuZ2U7XG4gICAgICAgIHRoaXMuY29uc3VtZXJTb2NrZXRQYXRoID0gcmVjb3JkaW5nX3V0aWxzXzEuREVGQVVMVF9UUkFDRURfQ09OU1VNRVJfU09DS0VUX1BBVEg7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgY2FsbGVkIHdoZW4gYSB1c2IgVVNCQ29ubmVjdGlvbkV2ZW50IG9mIHR5cGUgJ2Rpc2Nvbm5lY3QnIGV2ZW50IGlzXG4gICAgLy8gZW1pdHRlZC4gVGhpcyBldmVudCBpcyBlbWl0dGVkIHdoZW4gdGhlIFVTQiBjb25uZWN0aW9uIGlzIGxvc3QgKGV4YW1wbGU6XG4gICAgLy8gd2hlbiB0aGUgdXNlciB1bnBsdWdnZWQgdGhlIGNvbm5lY3RpbmcgY2FibGUpLlxuICAgIGFzeW5jIGRpc2Nvbm5lY3QoZGlzY29ubmVjdE1lc3NhZ2UpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGJDb25uZWN0aW9uLmRpc2Nvbm5lY3QoZGlzY29ubmVjdE1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBTdGFydHMgYSB0cmFjaW5nIHNlc3Npb24gaW4gb3JkZXIgdG8gZmV0Y2ggaW5mb3JtYXRpb24gc3VjaCBhcyBhcGlMZXZlbFxuICAgIC8vIGFuZCBkYXRhU291cmNlcyBmcm9tIHRoZSBkZXZpY2UuIFRoZW4sIGl0IGNhbmNlbHMgdGhlIHNlc3Npb24uXG4gICAgYXN5bmMgZmV0Y2hUYXJnZXRJbmZvKGxpc3RlbmVyKSB7XG4gICAgfVxuICAgIC8vIFdlIGRvIG5vdCBzdXBwb3J0IGxvbmcgdHJhY2luZyBvbiBBbmRyb2lkLlxuICAgIGNhbkNyZWF0ZVRyYWNpbmdTZXNzaW9uKHJlY29yZGluZ01vZGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBhc3luYyBjcmVhdGVUcmFjaW5nU2Vzc2lvbih0cmFjaW5nU2Vzc2lvbkxpc3RlbmVyKSB7XG4gICAgfVxuICAgIGNhbkNvbm5lY3RXaXRob3V0Q29udGVudGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRiQ29ubmVjdGlvbi5jYW5Db25uZWN0V2l0aG91dENvbnRlbnRpb24oKTtcbiAgICB9XG4gICAgZ2V0QWRiQ29ubmVjdGlubygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRiQ29ubmVjdGlvbjtcbiAgICB9XG59XG5leHBvcnRzLkFuZHJvaWRUYXJnZXQgPSBBbmRyb2lkVGFyZ2V0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuZHJvaWRXZWJ1c2JUYXJnZXQgPSB2b2lkIDA7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vYmFzZS9sb2dnaW5nXCIpO1xuY29uc3QgYWRiX2Nvbm5lY3Rpb25fb3Zlcl93ZWJ1c2JfMSA9IHJlcXVpcmUoXCIuLi9hZGJfY29ubmVjdGlvbl9vdmVyX3dlYnVzYlwiKTtcbmNvbnN0IGFuZHJvaWRfdGFyZ2V0XzEgPSByZXF1aXJlKFwiLi9hbmRyb2lkX3RhcmdldFwiKTtcbmNsYXNzIEFuZHJvaWRXZWJ1c2JUYXJnZXQgZXh0ZW5kcyBhbmRyb2lkX3RhcmdldF8xLkFuZHJvaWRUYXJnZXQge1xuICAgIGNvbnN0cnVjdG9yKGRldmljZSwga2V5TWFuYWdlciwgb25UYXJnZXRDaGFuZ2UpIHtcbiAgICAgICAgc3VwZXIobmV3IGFkYl9jb25uZWN0aW9uX292ZXJfd2VidXNiXzEuQWRiQ29ubmVjdGlvbk92ZXJXZWJ1c2IoZGV2aWNlLCBrZXlNYW5hZ2VyKSwgb25UYXJnZXRDaGFuZ2UpO1xuICAgICAgICB0aGlzLmRldmljZSA9IGRldmljZTtcbiAgICB9XG4gICAgZ2V0SW5mbygpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmRldmljZS5wcm9kdWN0TmFtZSkgKyAnICcgK1xuICAgICAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuZGV2aWNlLnNlcmlhbE51bWJlcikgKyAnIFdlYlVzYic7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0YXJnZXRUeXBlOiAnQU5EUk9JRCcsXG4gICAgICAgICAgICAvLyAnYW5kcm9pZEFwaUxldmVsJyB3aWxsIGJlIHBvcHVsYXRlZCBhZnRlciBBREIgYXV0aG9yaXphdGlvbi5cbiAgICAgICAgICAgIGFuZHJvaWRBcGlMZXZlbDogdGhpcy5hbmRyb2lkQXBpTGV2ZWwsXG4gICAgICAgICAgICBkYXRhU291cmNlczogdGhpcy5kYXRhU291cmNlcyB8fCBbXSxcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgIH07XG4gICAgfVxufVxuZXhwb3J0cy5BbmRyb2lkV2VidXNiVGFyZ2V0ID0gQW5kcm9pZFdlYnVzYlRhcmdldDtcbiIsIi8vIENvcHlyaWdodCAoQykgMjAxOSBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cblxuZXhwb3J0IGNvbnN0IF9UZXh0RGVjb2RlciA9IFRleHREZWNvZGVyO1xuZXhwb3J0IGNvbnN0IF9UZXh0RW5jb2RlciA9IFRleHRFbmNvZGVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGFuZHJvaWRfd2VidXNiX3RhcmdldF9mYWN0b3J5XzEgPSByZXF1aXJlKFwiLi9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3RhcmdldF9mYWN0b3JpZXMvYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0X2ZhY3RvcnlcIik7XG5jb25zdCBydW5CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJ1bl9idXR0b25cIik7XG5jb25zdCBzY3JpcHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3JpcHRfYXJlYVwiKTtcbmNvbnN0IG91dHB1dEFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm91dHB1dF9hcmVhXCIpO1xuY29uc3QgbG9nY2F0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nY2F0X2FyZWFcIik7XG5jb25zdCB3ZWJ1c2IgPSBuZXcgYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0X2ZhY3RvcnlfMS5BbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeShuYXZpZ2F0b3IudXNiKTtcbnZhciBhZGJDb25uZWN0aW9uO1xuc2NyaXB0QXJlYS52YWx1ZSA9IFwiZ2V0cHJvcFwiO1xuY29uc3QgbG9nY2F0RGVjb2RlID0gbmV3IFRleHREZWNvZGVyKCk7XG52YXIgdG9SdW4gPSBbXTtcbmZ1bmN0aW9uIGxvZ2NhdERhdGEoZGF0YSkge1xuICAgIGxvZ2NhdEFyZWEudmFsdWUgPSBsb2djYXRBcmVhLnZhbHVlICsgbG9nY2F0RGVjb2RlLmRlY29kZShkYXRhKTtcbiAgICBsb2djYXRBcmVhLnNjcm9sbFRvcCA9IGxvZ2NhdEFyZWEuc2Nyb2xsSGVpZ2h0O1xufVxuZnVuY3Rpb24gZGV2aWNlQ29ubmVjdGVkKGRldikge1xuICAgIGNvbnN0IGFkYlRhcmdldCA9IGRldjtcbiAgICBhZGJDb25uZWN0aW9uID0gYWRiVGFyZ2V0LmFkYkNvbm5lY3Rpb247XG4gICAgY29uc29sZS5sb2coXCJTdGFydCBsb2djYXRcIik7XG4gICAgYWRiQ29ubmVjdGlvbi5zaGVsbChcImxvZ2NhdFwiKS50aGVuKChieXRlcykgPT4geyBieXRlcy5hZGRPblN0cmVhbURhdGFDYWxsYmFjayhsb2djYXREYXRhKTsgfSk7XG59XG5mdW5jdGlvbiBjb25uZWN0RGV2aWNlKCkge1xuICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCBkZXZpY2VcIik7XG4gICAgbGV0IGRldmljZVAgPSB3ZWJ1c2IuY29ubmVjdE5ld1RhcmdldCgpLnRoZW4oKGRldmljZSkgPT4gZGV2aWNlQ29ubmVjdGVkKGRldmljZSksIChyZWFzb24pID0+IHsgY29uc29sZS5sb2coXCJGYWlsZWQgdG8gY29ubmVjdFwiKTsgfSk7XG59XG5mdW5jdGlvbiByZWN1cnNlQ29tbWFuZExpbmUocmVzdWx0KSB7XG4gICAgY29uc29sZS5sb2coXCJHb3QgXCIgKyByZXN1bHQpO1xuICAgIG91dHB1dEFyZWEudmFsdWUgPSBvdXRwdXRBcmVhLnZhbHVlICsgcmVzdWx0O1xuICAgIG91dHB1dEFyZWEuc2Nyb2xsVG9wID0gb3V0cHV0QXJlYS5zY3JvbGxIZWlnaHQ7XG4gICAgdmFyIG5leHRDTUQgPSBnZXROZXh0Q01EKCk7XG4gICAgaWYgKG5leHRDTUQgPT0gXCJcIikge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkZpbmlzaGVkXCIpO1xuICAgICAgICBzY3JpcHRBcmVhLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSdW5uaW5nIG5leHQ6IFwiICsgbmV4dENNRCk7XG4gICAgICAgIGFkYkNvbm5lY3Rpb24uc2hlbGxBbmRHZXRPdXRwdXQobmV4dENNRCkudGhlbigodmFsKSA9PiB7IHJlY3Vyc2VDb21tYW5kTGluZSh2YWwpOyB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBnZXROZXh0Q01EKCkge1xuICAgIGlmICh0b1J1bi5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBuZXh0Q29tbWFuZCA9IHRvUnVuWzBdO1xuICAgICAgICB0b1J1bi5zaGlmdCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJldHVybmluZzogXCIgKyBuZXh0Q29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0Q29tbWFuZDtcbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG59XG5mdW5jdGlvbiBydW5UZXN0KCkge1xuICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgc2NyaXB0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG4gICAgb3V0cHV0QXJlYS52YWx1ZSA9IFwiXCI7XG4gICAgbGV0IHRlc3RTY3JpcHQgPSBzY3JpcHRBcmVhLnZhbHVlO1xuICAgIGlmICh0ZXN0U2NyaXB0LnNwbGl0KFwiXFxuXCIpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdG9SdW4gPSB0ZXN0U2NyaXB0LnNwbGl0KFwiXFxuXCIpO1xuICAgIH1cbiAgICB0b1J1biA9IFt0ZXN0U2NyaXB0XTtcbiAgICB2YXIgY29tbWFuZCA9IGdldE5leHRDTUQoKTtcbiAgICBjb25zb2xlLmxvZyhcIlJ1bm5pbmc6IFwiICsgdGVzdFNjcmlwdCk7XG4gICAgLy8gZG8gc29tZXRoaW5nIHdpdGggdGhlIHNjcmlwdFxuICAgIGFkYkNvbm5lY3Rpb24uc2hlbGxBbmRHZXRPdXRwdXQoY29tbWFuZCkudGhlbigodmFsKSA9PiB7IHJlY3Vyc2VDb21tYW5kTGluZSh2YWwpOyB9KTtcbn1cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29ubmVjdF9idXR0b25cIik/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY29ubmVjdERldmljZSwgZmFsc2UpO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJydW5fYnV0dG9uXCIpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJ1blRlc3QsIGZhbHNlKTtcbmlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHtcbiAgICAgICAgICAgIGZhY2luZ01vZGU6ICdlbnZpcm9ubWVudCdcbiAgICAgICAgfSB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XG4gICAgICAgIGxldCB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpO1xuICAgICAgICB2aWRlb0VsZW1lbnQuc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyMHIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTb21ldGhpbmcgd2VudCB3cm9uZyFcIiwgZXJyMHIpO1xuICAgIH0pO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9