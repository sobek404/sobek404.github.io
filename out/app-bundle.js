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
const startRecordButton = document.getElementById("record_button");
startRecordButton.disabled = true;
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
connectButton.addEventListener('click', connectDevice, false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRSxRQUFRO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0EsY0FBYyxTQUFTOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLFFBQVE7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQixrQkFBa0IsUUFBUTtBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGFBQWE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRCwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLElBQUksSUFBOEI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEtBQUssRUFJTjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCO0FBQ0E7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBLElBQUk7QUFDSjtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixPQUFPO0FBQ2hDO0FBQ0EsNkJBQTZCLE9BQU87QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0Esb0NBQW9DLFNBQVM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1GQUFtRixVQUFVO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHVCQUF1QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsS0FBSyxXQUFXLFdBQVc7QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxzREFBc0Q7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQSw2REFBNkQsMEJBQTBCO0FBQ3ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGFsX2dpdC8uL25vZGVfbW9kdWxlcy9AcHJvdG9idWZqcy9iYXNlNjQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL25vZGVfbW9kdWxlcy9AcHJvdG9idWZqcy91dGY4L2luZGV4LmpzIiwid2VicGFjazovL3BhbF9naXQvLi9ub2RlX21vZHVsZXMvanNibi1yc2EvanNibi5qcyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL2RlZmVycmVkLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2UvZXJyb3JzLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2UvbG9nZ2luZy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL29iamVjdF91dGlscy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9iYXNlL3N0cmluZ191dGlscy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vYXJyYXlfYnVmZmVyX2J1aWxkZXIudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL2FkYl9jb25uZWN0aW9uX2ltcGwudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL2FkYl9jb25uZWN0aW9uX292ZXJfd2VidXNiLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hZGJfZmlsZV9oYW5kbGVyLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hdXRoL2FkYl9hdXRoLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9hdXRoL2FkYl9rZXlfbWFuYWdlci50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9yZWNvcmRpbmdfdXRpbHMudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3RhcmdldF9mYWN0b3JpZXMvYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0X2ZhY3RvcnkudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3RhcmdldHMvYW5kcm9pZF90YXJnZXQudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3RhcmdldHMvYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0LnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2UvdXRpbHMvaW5kZXgtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3BhbF9naXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3BhbF9naXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9wYWxfZ2l0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9wYWwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vKipcclxuICogQSBtaW5pbWFsIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBmb3IgbnVtYmVyIGFycmF5cy5cclxuICogQG1lbWJlcm9mIHV0aWxcclxuICogQG5hbWVzcGFjZVxyXG4gKi9cclxudmFyIGJhc2U2NCA9IGV4cG9ydHM7XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB0aGUgYnl0ZSBsZW5ndGggb2YgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgQmFzZTY0IGVuY29kZWQgc3RyaW5nXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGUgbGVuZ3RoXHJcbiAqL1xyXG5iYXNlNjQubGVuZ3RoID0gZnVuY3Rpb24gbGVuZ3RoKHN0cmluZykge1xyXG4gICAgdmFyIHAgPSBzdHJpbmcubGVuZ3RoO1xyXG4gICAgaWYgKCFwKVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgdmFyIG4gPSAwO1xyXG4gICAgd2hpbGUgKC0tcCAlIDQgPiAxICYmIHN0cmluZy5jaGFyQXQocCkgPT09IFwiPVwiKVxyXG4gICAgICAgICsrbjtcclxuICAgIHJldHVybiBNYXRoLmNlaWwoc3RyaW5nLmxlbmd0aCAqIDMpIC8gNCAtIG47XHJcbn07XHJcblxyXG4vLyBCYXNlNjQgZW5jb2RpbmcgdGFibGVcclxudmFyIGI2NCA9IG5ldyBBcnJheSg2NCk7XHJcblxyXG4vLyBCYXNlNjQgZGVjb2RpbmcgdGFibGVcclxudmFyIHM2NCA9IG5ldyBBcnJheSgxMjMpO1xyXG5cclxuLy8gNjUuLjkwLCA5Ny4uMTIyLCA0OC4uNTcsIDQzLCA0N1xyXG5mb3IgKHZhciBpID0gMDsgaSA8IDY0OylcclxuICAgIHM2NFtiNjRbaV0gPSBpIDwgMjYgPyBpICsgNjUgOiBpIDwgNTIgPyBpICsgNzEgOiBpIDwgNjIgPyBpIC0gNCA6IGkgLSA1OSB8IDQzXSA9IGkrKztcclxuXHJcbi8qKlxyXG4gKiBFbmNvZGVzIGEgYnVmZmVyIHRvIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxyXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IGJ1ZmZlciBTb3VyY2UgYnVmZmVyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzdGFydCBTb3VyY2Ugc3RhcnRcclxuICogQHBhcmFtIHtudW1iZXJ9IGVuZCBTb3VyY2UgZW5kXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEJhc2U2NCBlbmNvZGVkIHN0cmluZ1xyXG4gKi9cclxuYmFzZTY0LmVuY29kZSA9IGZ1bmN0aW9uIGVuY29kZShidWZmZXIsIHN0YXJ0LCBlbmQpIHtcclxuICAgIHZhciBwYXJ0cyA9IG51bGwsXHJcbiAgICAgICAgY2h1bmsgPSBbXTtcclxuICAgIHZhciBpID0gMCwgLy8gb3V0cHV0IGluZGV4XHJcbiAgICAgICAgaiA9IDAsIC8vIGdvdG8gaW5kZXhcclxuICAgICAgICB0OyAgICAgLy8gdGVtcG9yYXJ5XHJcbiAgICB3aGlsZSAoc3RhcnQgPCBlbmQpIHtcclxuICAgICAgICB2YXIgYiA9IGJ1ZmZlcltzdGFydCsrXTtcclxuICAgICAgICBzd2l0Y2ggKGopIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgY2h1bmtbaSsrXSA9IGI2NFtiID4+IDJdO1xyXG4gICAgICAgICAgICAgICAgdCA9IChiICYgMykgPDwgNDtcclxuICAgICAgICAgICAgICAgIGogPSAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGNodW5rW2krK10gPSBiNjRbdCB8IGIgPj4gNF07XHJcbiAgICAgICAgICAgICAgICB0ID0gKGIgJiAxNSkgPDwgMjtcclxuICAgICAgICAgICAgICAgIGogPSAyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGNodW5rW2krK10gPSBiNjRbdCB8IGIgPj4gNl07XHJcbiAgICAgICAgICAgICAgICBjaHVua1tpKytdID0gYjY0W2IgJiA2M107XHJcbiAgICAgICAgICAgICAgICBqID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaSA+IDgxOTEpIHtcclxuICAgICAgICAgICAgKHBhcnRzIHx8IChwYXJ0cyA9IFtdKSkucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmspKTtcclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGopIHtcclxuICAgICAgICBjaHVua1tpKytdID0gYjY0W3RdO1xyXG4gICAgICAgIGNodW5rW2krK10gPSA2MTtcclxuICAgICAgICBpZiAoaiA9PT0gMSlcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9IDYxO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcnRzKSB7XHJcbiAgICAgICAgaWYgKGkpXHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rLnNsaWNlKDAsIGkpKSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rLnNsaWNlKDAsIGkpKTtcclxufTtcclxuXHJcbnZhciBpbnZhbGlkRW5jb2RpbmcgPSBcImludmFsaWQgZW5jb2RpbmdcIjtcclxuXHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nIHRvIGEgYnVmZmVyLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFNvdXJjZSBzdHJpbmdcclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBidWZmZXIgRGVzdGluYXRpb24gYnVmZmVyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgRGVzdGluYXRpb24gb2Zmc2V0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IE51bWJlciBvZiBieXRlcyB3cml0dGVuXHJcbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiBlbmNvZGluZyBpcyBpbnZhbGlkXHJcbiAqL1xyXG5iYXNlNjQuZGVjb2RlID0gZnVuY3Rpb24gZGVjb2RlKHN0cmluZywgYnVmZmVyLCBvZmZzZXQpIHtcclxuICAgIHZhciBzdGFydCA9IG9mZnNldDtcclxuICAgIHZhciBqID0gMCwgLy8gZ290byBpbmRleFxyXG4gICAgICAgIHQ7ICAgICAvLyB0ZW1wb3JhcnlcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDspIHtcclxuICAgICAgICB2YXIgYyA9IHN0cmluZy5jaGFyQ29kZUF0KGkrKyk7XHJcbiAgICAgICAgaWYgKGMgPT09IDYxICYmIGogPiAxKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBpZiAoKGMgPSBzNjRbY10pID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGludmFsaWRFbmNvZGluZyk7XHJcbiAgICAgICAgc3dpdGNoIChqKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHQgPSBjO1xyXG4gICAgICAgICAgICAgICAgaiA9IDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IHQgPDwgMiB8IChjICYgNDgpID4+IDQ7XHJcbiAgICAgICAgICAgICAgICB0ID0gYztcclxuICAgICAgICAgICAgICAgIGogPSAyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSAodCAmIDE1KSA8PCA0IHwgKGMgJiA2MCkgPj4gMjtcclxuICAgICAgICAgICAgICAgIHQgPSBjO1xyXG4gICAgICAgICAgICAgICAgaiA9IDM7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9ICh0ICYgMykgPDwgNiB8IGM7XHJcbiAgICAgICAgICAgICAgICBqID0gMDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChqID09PSAxKVxyXG4gICAgICAgIHRocm93IEVycm9yKGludmFsaWRFbmNvZGluZyk7XHJcbiAgICByZXR1cm4gb2Zmc2V0IC0gc3RhcnQ7XHJcbn07XHJcblxyXG4vKipcclxuICogVGVzdHMgaWYgdGhlIHNwZWNpZmllZCBzdHJpbmcgYXBwZWFycyB0byBiZSBiYXNlNjQgZW5jb2RlZC5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmcgdG8gdGVzdFxyXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gYHRydWVgIGlmIHByb2JhYmx5IGJhc2U2NCBlbmNvZGVkLCBvdGhlcndpc2UgZmFsc2VcclxuICovXHJcbmJhc2U2NC50ZXN0ID0gZnVuY3Rpb24gdGVzdChzdHJpbmcpIHtcclxuICAgIHJldHVybiAvXig/OltBLVphLXowLTkrL117NH0pKig/OltBLVphLXowLTkrL117Mn09PXxbQS1aYS16MC05Ky9dezN9PSk/JC8udGVzdChzdHJpbmcpO1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qKlxyXG4gKiBBIG1pbmltYWwgVVRGOCBpbXBsZW1lbnRhdGlvbiBmb3IgbnVtYmVyIGFycmF5cy5cclxuICogQG1lbWJlcm9mIHV0aWxcclxuICogQG5hbWVzcGFjZVxyXG4gKi9cclxudmFyIHV0ZjggPSBleHBvcnRzO1xyXG5cclxuLyoqXHJcbiAqIENhbGN1bGF0ZXMgdGhlIFVURjggYnl0ZSBsZW5ndGggb2YgYSBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU3RyaW5nXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGUgbGVuZ3RoXHJcbiAqL1xyXG51dGY4Lmxlbmd0aCA9IGZ1bmN0aW9uIHV0ZjhfbGVuZ3RoKHN0cmluZykge1xyXG4gICAgdmFyIGxlbiA9IDAsXHJcbiAgICAgICAgYyA9IDA7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGMgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBpZiAoYyA8IDEyOClcclxuICAgICAgICAgICAgbGVuICs9IDE7XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpXHJcbiAgICAgICAgICAgIGxlbiArPSAyO1xyXG4gICAgICAgIGVsc2UgaWYgKChjICYgMHhGQzAwKSA9PT0gMHhEODAwICYmIChzdHJpbmcuY2hhckNvZGVBdChpICsgMSkgJiAweEZDMDApID09PSAweERDMDApIHtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBsZW4gKz0gNDtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgbGVuICs9IDM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGVuO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJlYWRzIFVURjggYnl0ZXMgYXMgYSBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7VWludDhBcnJheX0gYnVmZmVyIFNvdXJjZSBidWZmZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFNvdXJjZSBzdGFydFxyXG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFNvdXJjZSBlbmRcclxuICogQHJldHVybnMge3N0cmluZ30gU3RyaW5nIHJlYWRcclxuICovXHJcbnV0ZjgucmVhZCA9IGZ1bmN0aW9uIHV0ZjhfcmVhZChidWZmZXIsIHN0YXJ0LCBlbmQpIHtcclxuICAgIHZhciBsZW4gPSBlbmQgLSBzdGFydDtcclxuICAgIGlmIChsZW4gPCAxKVxyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgdmFyIHBhcnRzID0gbnVsbCxcclxuICAgICAgICBjaHVuayA9IFtdLFxyXG4gICAgICAgIGkgPSAwLCAvLyBjaGFyIG9mZnNldFxyXG4gICAgICAgIHQ7ICAgICAvLyB0ZW1wb3JhcnlcclxuICAgIHdoaWxlIChzdGFydCA8IGVuZCkge1xyXG4gICAgICAgIHQgPSBidWZmZXJbc3RhcnQrK107XHJcbiAgICAgICAgaWYgKHQgPCAxMjgpXHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSB0O1xyXG4gICAgICAgIGVsc2UgaWYgKHQgPiAxOTEgJiYgdCA8IDIyNClcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9ICh0ICYgMzEpIDw8IDYgfCBidWZmZXJbc3RhcnQrK10gJiA2MztcclxuICAgICAgICBlbHNlIGlmICh0ID4gMjM5ICYmIHQgPCAzNjUpIHtcclxuICAgICAgICAgICAgdCA9ICgodCAmIDcpIDw8IDE4IHwgKGJ1ZmZlcltzdGFydCsrXSAmIDYzKSA8PCAxMiB8IChidWZmZXJbc3RhcnQrK10gJiA2MykgPDwgNiB8IGJ1ZmZlcltzdGFydCsrXSAmIDYzKSAtIDB4MTAwMDA7XHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSAweEQ4MDAgKyAodCA+PiAxMCk7XHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSAweERDMDAgKyAodCAmIDEwMjMpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gKHQgJiAxNSkgPDwgMTIgfCAoYnVmZmVyW3N0YXJ0KytdICYgNjMpIDw8IDYgfCBidWZmZXJbc3RhcnQrK10gJiA2MztcclxuICAgICAgICBpZiAoaSA+IDgxOTEpIHtcclxuICAgICAgICAgICAgKHBhcnRzIHx8IChwYXJ0cyA9IFtdKSkucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmspKTtcclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHBhcnRzKSB7XHJcbiAgICAgICAgaWYgKGkpXHJcbiAgICAgICAgICAgIHBhcnRzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rLnNsaWNlKDAsIGkpKSk7XHJcbiAgICAgICAgcmV0dXJuIHBhcnRzLmpvaW4oXCJcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNodW5rLnNsaWNlKDAsIGkpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBXcml0ZXMgYSBzdHJpbmcgYXMgVVRGOCBieXRlcy5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTb3VyY2Ugc3RyaW5nXHJcbiAqIEBwYXJhbSB7VWludDhBcnJheX0gYnVmZmVyIERlc3RpbmF0aW9uIGJ1ZmZlclxyXG4gKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IERlc3RpbmF0aW9uIG9mZnNldFxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBCeXRlcyB3cml0dGVuXHJcbiAqL1xyXG51dGY4LndyaXRlID0gZnVuY3Rpb24gdXRmOF93cml0ZShzdHJpbmcsIGJ1ZmZlciwgb2Zmc2V0KSB7XHJcbiAgICB2YXIgc3RhcnQgPSBvZmZzZXQsXHJcbiAgICAgICAgYzEsIC8vIGNoYXJhY3RlciAxXHJcbiAgICAgICAgYzI7IC8vIGNoYXJhY3RlciAyXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGMxID0gc3RyaW5nLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMxIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMTtcclxuICAgICAgICB9IGVsc2UgaWYgKGMxIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gNiAgICAgICB8IDE5MjtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxICAgICAgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgfSBlbHNlIGlmICgoYzEgJiAweEZDMDApID09PSAweEQ4MDAgJiYgKChjMiA9IHN0cmluZy5jaGFyQ29kZUF0KGkgKyAxKSkgJiAweEZDMDApID09PSAweERDMDApIHtcclxuICAgICAgICAgICAgYzEgPSAweDEwMDAwICsgKChjMSAmIDB4MDNGRikgPDwgMTApICsgKGMyICYgMHgwM0ZGKTtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gMTggICAgICB8IDI0MDtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDEyICYgNjMgfCAxMjg7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiA2ICAmIDYzIHwgMTI4O1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgICAgICAgJiA2MyB8IDEyODtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gMTIgICAgICB8IDIyNDtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDYgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSAgICAgICAmIDYzIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvZmZzZXQgLSBzdGFydDtcclxufTtcclxuIiwiXG4oZnVuY3Rpb24oKSB7XG5cbi8vIENvcHlyaWdodCAoYykgMjAwNSAgVG9tIFd1XG4vLyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gU2VlIFwiTElDRU5TRVwiIGZvciBkZXRhaWxzLlxuXG4vLyBCYXNpYyBKYXZhU2NyaXB0IEJOIGxpYnJhcnkgLSBzdWJzZXQgdXNlZnVsIGZvciBSU0EgZW5jcnlwdGlvbi5cblxudmFyIGluQnJvd3NlciA9XG4gICAgdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5cbi8vIEJpdHMgcGVyIGRpZ2l0XG52YXIgZGJpdHM7XG5cbi8vIEphdmFTY3JpcHQgZW5naW5lIGFuYWx5c2lzXG52YXIgY2FuYXJ5ID0gMHhkZWFkYmVlZmNhZmU7XG52YXIgal9sbSA9ICgoY2FuYXJ5ICYgMHhmZmZmZmYpID09IDB4ZWZjYWZlKTtcblxuLy8gKHB1YmxpYykgQ29uc3RydWN0b3JcbmZ1bmN0aW9uIEJpZ0ludGVnZXIoYSwgYiwgYykge1xuICBpZiAoYSAhPSBudWxsKVxuICAgIGlmICgnbnVtYmVyJyA9PSB0eXBlb2YgYSlcbiAgICAgIHRoaXMuZnJvbU51bWJlcihhLCBiLCBjKTtcbiAgICBlbHNlIGlmIChiID09IG51bGwgJiYgJ3N0cmluZycgIT0gdHlwZW9mIGEpXG4gICAgICB0aGlzLmZyb21TdHJpbmcoYSwgMjU2KTtcbiAgICBlbHNlXG4gICAgICB0aGlzLmZyb21TdHJpbmcoYSwgYik7XG59XG5cbi8vIHJldHVybiBuZXcsIHVuc2V0IEJpZ0ludGVnZXJcbmZ1bmN0aW9uIG5iaSgpIHtcbiAgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKG51bGwpO1xufVxuXG4vLyBhbTogQ29tcHV0ZSB3X2ogKz0gKHgqdGhpc19pKSwgcHJvcGFnYXRlIGNhcnJpZXMsXG4vLyBjIGlzIGluaXRpYWwgY2FycnksIHJldHVybnMgZmluYWwgY2FycnkuXG4vLyBjIDwgMypkdmFsdWUsIHggPCAyKmR2YWx1ZSwgdGhpc19pIDwgZHZhbHVlXG4vLyBXZSBuZWVkIHRvIHNlbGVjdCB0aGUgZmFzdGVzdCBvbmUgdGhhdCB3b3JrcyBpbiB0aGlzIGVudmlyb25tZW50LlxuXG4vLyBhbTE6IHVzZSBhIHNpbmdsZSBtdWx0IGFuZCBkaXZpZGUgdG8gZ2V0IHRoZSBoaWdoIGJpdHMsXG4vLyBtYXggZGlnaXQgYml0cyBzaG91bGQgYmUgMjYgYmVjYXVzZVxuLy8gbWF4IGludGVybmFsIHZhbHVlID0gMipkdmFsdWVeMi0yKmR2YWx1ZSAoPCAyXjUzKVxuZnVuY3Rpb24gYW0xKGksIHgsIHcsIGosIGMsIG4pIHtcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIHYgPSB4ICogdGhpc1tpKytdICsgd1tqXSArIGM7XG4gICAgYyA9IE1hdGguZmxvb3IodiAvIDB4NDAwMDAwMCk7XG4gICAgd1tqKytdID0gdiAmIDB4M2ZmZmZmZjtcbiAgfVxuICByZXR1cm4gYztcbn1cbi8vIGFtMiBhdm9pZHMgYSBiaWcgbXVsdC1hbmQtZXh0cmFjdCBjb21wbGV0ZWx5LlxuLy8gTWF4IGRpZ2l0IGJpdHMgc2hvdWxkIGJlIDw9IDMwIGJlY2F1c2Ugd2UgZG8gYml0d2lzZSBvcHNcbi8vIG9uIHZhbHVlcyB1cCB0byAyKmhkdmFsdWVeMi1oZHZhbHVlLTEgKDwgMl4zMSlcbmZ1bmN0aW9uIGFtMihpLCB4LCB3LCBqLCBjLCBuKSB7XG4gIHZhciB4bCA9IHggJiAweDdmZmYsIHhoID0geCA+PiAxNTtcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIGwgPSB0aGlzW2ldICYgMHg3ZmZmO1xuICAgIHZhciBoID0gdGhpc1tpKytdID4+IDE1O1xuICAgIHZhciBtID0geGggKiBsICsgaCAqIHhsO1xuICAgIGwgPSB4bCAqIGwgKyAoKG0gJiAweDdmZmYpIDw8IDE1KSArIHdbal0gKyAoYyAmIDB4M2ZmZmZmZmYpO1xuICAgIGMgPSAobCA+Pj4gMzApICsgKG0gPj4+IDE1KSArIHhoICogaCArIChjID4+PiAzMCk7XG4gICAgd1tqKytdID0gbCAmIDB4M2ZmZmZmZmY7XG4gIH1cbiAgcmV0dXJuIGM7XG59XG4vLyBBbHRlcm5hdGVseSwgc2V0IG1heCBkaWdpdCBiaXRzIHRvIDI4IHNpbmNlIHNvbWVcbi8vIGJyb3dzZXJzIHNsb3cgZG93biB3aGVuIGRlYWxpbmcgd2l0aCAzMi1iaXQgbnVtYmVycy5cbmZ1bmN0aW9uIGFtMyhpLCB4LCB3LCBqLCBjLCBuKSB7XG4gIHZhciB4bCA9IHggJiAweDNmZmYsIHhoID0geCA+PiAxNDtcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIGwgPSB0aGlzW2ldICYgMHgzZmZmO1xuICAgIHZhciBoID0gdGhpc1tpKytdID4+IDE0O1xuICAgIHZhciBtID0geGggKiBsICsgaCAqIHhsO1xuICAgIGwgPSB4bCAqIGwgKyAoKG0gJiAweDNmZmYpIDw8IDE0KSArIHdbal0gKyBjO1xuICAgIGMgPSAobCA+PiAyOCkgKyAobSA+PiAxNCkgKyB4aCAqIGg7XG4gICAgd1tqKytdID0gbCAmIDB4ZmZmZmZmZjtcbiAgfVxuICByZXR1cm4gYztcbn1cbmlmIChpbkJyb3dzZXIgJiYgal9sbSAmJiAobmF2aWdhdG9yLmFwcE5hbWUgPT0gJ01pY3Jvc29mdCBJbnRlcm5ldCBFeHBsb3JlcicpKSB7XG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0yO1xuICBkYml0cyA9IDMwO1xufSBlbHNlIGlmIChpbkJyb3dzZXIgJiYgal9sbSAmJiAobmF2aWdhdG9yLmFwcE5hbWUgIT0gJ05ldHNjYXBlJykpIHtcbiAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTE7XG4gIGRiaXRzID0gMjY7XG59IGVsc2UgeyAgLy8gTW96aWxsYS9OZXRzY2FwZSBzZWVtcyB0byBwcmVmZXIgYW0zXG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0zO1xuICBkYml0cyA9IDI4O1xufVxuXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5EQiA9IGRiaXRzO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRE0gPSAoKDEgPDwgZGJpdHMpIC0gMSk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5EViA9ICgxIDw8IGRiaXRzKTtcblxudmFyIEJJX0ZQID0gNTI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GViA9IE1hdGgucG93KDIsIEJJX0ZQKTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLkYxID0gQklfRlAgLSBkYml0cztcbkJpZ0ludGVnZXIucHJvdG90eXBlLkYyID0gMiAqIGRiaXRzIC0gQklfRlA7XG5cbi8vIERpZ2l0IGNvbnZlcnNpb25zXG52YXIgQklfUk0gPSAnMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JztcbnZhciBCSV9SQyA9IG5ldyBBcnJheSgpO1xudmFyIHJyLCB2djtcbnJyID0gJzAnLmNoYXJDb2RlQXQoMCk7XG5mb3IgKHZ2ID0gMDsgdnYgPD0gOTsgKyt2dikgQklfUkNbcnIrK10gPSB2djtcbnJyID0gJ2EnLmNoYXJDb2RlQXQoMCk7XG5mb3IgKHZ2ID0gMTA7IHZ2IDwgMzY7ICsrdnYpIEJJX1JDW3JyKytdID0gdnY7XG5yciA9ICdBJy5jaGFyQ29kZUF0KDApO1xuZm9yICh2diA9IDEwOyB2diA8IDM2OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2O1xuXG5mdW5jdGlvbiBpbnQyY2hhcihuKSB7XG4gIHJldHVybiBCSV9STS5jaGFyQXQobik7XG59XG5mdW5jdGlvbiBpbnRBdChzLCBpKSB7XG4gIHZhciBjID0gQklfUkNbcy5jaGFyQ29kZUF0KGkpXTtcbiAgcmV0dXJuIChjID09IG51bGwpID8gLTEgOiBjO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjb3B5IHRoaXMgdG8gclxuZnVuY3Rpb24gYm5wQ29weVRvKHIpIHtcbiAgZm9yICh2YXIgaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSByW2ldID0gdGhpc1tpXTtcbiAgci50ID0gdGhpcy50O1xuICByLnMgPSB0aGlzLnM7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHNldCBmcm9tIGludGVnZXIgdmFsdWUgeCwgLURWIDw9IHggPCBEVlxuZnVuY3Rpb24gYm5wRnJvbUludCh4KSB7XG4gIHRoaXMudCA9IDE7XG4gIHRoaXMucyA9ICh4IDwgMCkgPyAtMSA6IDA7XG4gIGlmICh4ID4gMClcbiAgICB0aGlzWzBdID0geDtcbiAgZWxzZSBpZiAoeCA8IC0xKVxuICAgIHRoaXNbMF0gPSB4ICsgdGhpcy5EVjtcbiAgZWxzZVxuICAgIHRoaXMudCA9IDA7XG59XG5cbi8vIHJldHVybiBiaWdpbnQgaW5pdGlhbGl6ZWQgdG8gdmFsdWVcbmZ1bmN0aW9uIG5idihpKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHIuZnJvbUludChpKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHNldCBmcm9tIHN0cmluZyBhbmQgcmFkaXhcbmZ1bmN0aW9uIGJucEZyb21TdHJpbmcocywgYikge1xuICB2YXIgaztcbiAgaWYgKGIgPT0gMTYpXG4gICAgayA9IDQ7XG4gIGVsc2UgaWYgKGIgPT0gOClcbiAgICBrID0gMztcbiAgZWxzZSBpZiAoYiA9PSAyNTYpXG4gICAgayA9IDg7ICAvLyBieXRlIGFycmF5XG4gIGVsc2UgaWYgKGIgPT0gMilcbiAgICBrID0gMTtcbiAgZWxzZSBpZiAoYiA9PSAzMilcbiAgICBrID0gNTtcbiAgZWxzZSBpZiAoYiA9PSA0KVxuICAgIGsgPSAyO1xuICBlbHNlIHtcbiAgICB0aGlzLmZyb21SYWRpeChzLCBiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy50ID0gMDtcbiAgdGhpcy5zID0gMDtcbiAgdmFyIGkgPSBzLmxlbmd0aCwgbWkgPSBmYWxzZSwgc2ggPSAwO1xuICB3aGlsZSAoLS1pID49IDApIHtcbiAgICB2YXIgeCA9IChrID09IDgpID8gc1tpXSAmIDB4ZmYgOiBpbnRBdChzLCBpKTtcbiAgICBpZiAoeCA8IDApIHtcbiAgICAgIGlmIChzLmNoYXJBdChpKSA9PSAnLScpIG1pID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBtaSA9IGZhbHNlO1xuICAgIGlmIChzaCA9PSAwKVxuICAgICAgdGhpc1t0aGlzLnQrK10gPSB4O1xuICAgIGVsc2UgaWYgKHNoICsgayA+IHRoaXMuREIpIHtcbiAgICAgIHRoaXNbdGhpcy50IC0gMV0gfD0gKHggJiAoKDEgPDwgKHRoaXMuREIgLSBzaCkpIC0gMSkpIDw8IHNoO1xuICAgICAgdGhpc1t0aGlzLnQrK10gPSAoeCA+PiAodGhpcy5EQiAtIHNoKSk7XG4gICAgfSBlbHNlXG4gICAgICB0aGlzW3RoaXMudCAtIDFdIHw9IHggPDwgc2g7XG4gICAgc2ggKz0gaztcbiAgICBpZiAoc2ggPj0gdGhpcy5EQikgc2ggLT0gdGhpcy5EQjtcbiAgfVxuICBpZiAoayA9PSA4ICYmIChzWzBdICYgMHg4MCkgIT0gMCkge1xuICAgIHRoaXMucyA9IC0xO1xuICAgIGlmIChzaCA+IDApIHRoaXNbdGhpcy50IC0gMV0gfD0gKCgxIDw8ICh0aGlzLkRCIC0gc2gpKSAtIDEpIDw8IHNoO1xuICB9XG4gIHRoaXMuY2xhbXAoKTtcbiAgaWYgKG1pKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8odGhpcywgdGhpcyk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNsYW1wIG9mZiBleGNlc3MgaGlnaCB3b3Jkc1xuZnVuY3Rpb24gYm5wQ2xhbXAoKSB7XG4gIHZhciBjID0gdGhpcy5zICYgdGhpcy5ETTtcbiAgd2hpbGUgKHRoaXMudCA+IDAgJiYgdGhpc1t0aGlzLnQgLSAxXSA9PSBjKSAtLXRoaXMudDtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHN0cmluZyByZXByZXNlbnRhdGlvbiBpbiBnaXZlbiByYWRpeFxuZnVuY3Rpb24gYm5Ub1N0cmluZyhiKSB7XG4gIGlmICh0aGlzLnMgPCAwKSByZXR1cm4gJy0nICsgdGhpcy5uZWdhdGUoKS50b1N0cmluZyhiKTtcbiAgdmFyIGs7XG4gIGlmIChiID09IDE2KVxuICAgIGsgPSA0O1xuICBlbHNlIGlmIChiID09IDgpXG4gICAgayA9IDM7XG4gIGVsc2UgaWYgKGIgPT0gMilcbiAgICBrID0gMTtcbiAgZWxzZSBpZiAoYiA9PSAzMilcbiAgICBrID0gNTtcbiAgZWxzZSBpZiAoYiA9PSA0KVxuICAgIGsgPSAyO1xuICBlbHNlXG4gICAgcmV0dXJuIHRoaXMudG9SYWRpeChiKTtcbiAgdmFyIGttID0gKDEgPDwgaykgLSAxLCBkLCBtID0gZmFsc2UsIHIgPSAnJywgaSA9IHRoaXMudDtcbiAgdmFyIHAgPSB0aGlzLkRCIC0gKGkgKiB0aGlzLkRCKSAlIGs7XG4gIGlmIChpLS0gPiAwKSB7XG4gICAgaWYgKHAgPCB0aGlzLkRCICYmIChkID0gdGhpc1tpXSA+PiBwKSA+IDApIHtcbiAgICAgIG0gPSB0cnVlO1xuICAgICAgciA9IGludDJjaGFyKGQpO1xuICAgIH1cbiAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICBpZiAocCA8IGspIHtcbiAgICAgICAgZCA9ICh0aGlzW2ldICYgKCgxIDw8IHApIC0gMSkpIDw8IChrIC0gcCk7XG4gICAgICAgIGQgfD0gdGhpc1stLWldID4+IChwICs9IHRoaXMuREIgLSBrKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSA+PiAocCAtPSBrKSkgJiBrbTtcbiAgICAgICAgaWYgKHAgPD0gMCkge1xuICAgICAgICAgIHAgKz0gdGhpcy5EQjtcbiAgICAgICAgICAtLWk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChkID4gMCkgbSA9IHRydWU7XG4gICAgICBpZiAobSkgciArPSBpbnQyY2hhcihkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG0gPyByIDogJzAnO1xufVxuXG4vLyAocHVibGljKSAtdGhpc1xuZnVuY3Rpb24gYm5OZWdhdGUoKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHx0aGlzfFxuZnVuY3Rpb24gYm5BYnMoKSB7XG4gIHJldHVybiAodGhpcy5zIDwgMCkgPyB0aGlzLm5lZ2F0ZSgpIDogdGhpcztcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuICsgaWYgdGhpcyA+IGEsIC0gaWYgdGhpcyA8IGEsIDAgaWYgZXF1YWxcbmZ1bmN0aW9uIGJuQ29tcGFyZVRvKGEpIHtcbiAgdmFyIHIgPSB0aGlzLnMgLSBhLnM7XG4gIGlmIChyICE9IDApIHJldHVybiByO1xuICB2YXIgaSA9IHRoaXMudDtcbiAgciA9IGkgLSBhLnQ7XG4gIGlmIChyICE9IDApIHJldHVybiAodGhpcy5zIDwgMCkgPyAtciA6IHI7XG4gIHdoaWxlICgtLWkgPj0gMClcbiAgICBpZiAoKHIgPSB0aGlzW2ldIC0gYVtpXSkgIT0gMCkgcmV0dXJuIHI7XG4gIHJldHVybiAwO1xufVxuXG4vLyByZXR1cm5zIGJpdCBsZW5ndGggb2YgdGhlIGludGVnZXIgeFxuZnVuY3Rpb24gbmJpdHMoeCkge1xuICB2YXIgciA9IDEsIHQ7XG4gIGlmICgodCA9IHggPj4+IDE2KSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSAxNjtcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDgpICE9IDApIHtcbiAgICB4ID0gdDtcbiAgICByICs9IDg7XG4gIH1cbiAgaWYgKCh0ID0geCA+PiA0KSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSA0O1xuICB9XG4gIGlmICgodCA9IHggPj4gMikgIT0gMCkge1xuICAgIHggPSB0O1xuICAgIHIgKz0gMjtcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDEpICE9IDApIHtcbiAgICB4ID0gdDtcbiAgICByICs9IDE7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiB0aGUgbnVtYmVyIG9mIGJpdHMgaW4gXCJ0aGlzXCJcbmZ1bmN0aW9uIGJuQml0TGVuZ3RoKCkge1xuICBpZiAodGhpcy50IDw9IDApIHJldHVybiAwO1xuICByZXR1cm4gdGhpcy5EQiAqICh0aGlzLnQgLSAxKSArIG5iaXRzKHRoaXNbdGhpcy50IC0gMV0gXiAodGhpcy5zICYgdGhpcy5ETSkpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA8PCBuKkRCXG5mdW5jdGlvbiBibnBETFNoaWZ0VG8obiwgcikge1xuICB2YXIgaTtcbiAgZm9yIChpID0gdGhpcy50IC0gMTsgaSA+PSAwOyAtLWkpIHJbaSArIG5dID0gdGhpc1tpXTtcbiAgZm9yIChpID0gbiAtIDE7IGkgPj0gMDsgLS1pKSByW2ldID0gMDtcbiAgci50ID0gdGhpcy50ICsgbjtcbiAgci5zID0gdGhpcy5zO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA+PiBuKkRCXG5mdW5jdGlvbiBibnBEUlNoaWZ0VG8obiwgcikge1xuICBmb3IgKHZhciBpID0gbjsgaSA8IHRoaXMudDsgKytpKSByW2kgLSBuXSA9IHRoaXNbaV07XG4gIHIudCA9IE1hdGgubWF4KHRoaXMudCAtIG4sIDApO1xuICByLnMgPSB0aGlzLnM7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIDw8IG5cbmZ1bmN0aW9uIGJucExTaGlmdFRvKG4sIHIpIHtcbiAgdmFyIGJzID0gbiAlIHRoaXMuREI7XG4gIHZhciBjYnMgPSB0aGlzLkRCIC0gYnM7XG4gIHZhciBibSA9ICgxIDw8IGNicykgLSAxO1xuICB2YXIgZHMgPSBNYXRoLmZsb29yKG4gLyB0aGlzLkRCKSwgYyA9ICh0aGlzLnMgPDwgYnMpICYgdGhpcy5ETSwgaTtcbiAgZm9yIChpID0gdGhpcy50IC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICByW2kgKyBkcyArIDFdID0gKHRoaXNbaV0gPj4gY2JzKSB8IGM7XG4gICAgYyA9ICh0aGlzW2ldICYgYm0pIDw8IGJzO1xuICB9XG4gIGZvciAoaSA9IGRzIC0gMTsgaSA+PSAwOyAtLWkpIHJbaV0gPSAwO1xuICByW2RzXSA9IGM7XG4gIHIudCA9IHRoaXMudCArIGRzICsgMTtcbiAgci5zID0gdGhpcy5zO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzID4+IG5cbmZ1bmN0aW9uIGJucFJTaGlmdFRvKG4sIHIpIHtcbiAgci5zID0gdGhpcy5zO1xuICB2YXIgZHMgPSBNYXRoLmZsb29yKG4gLyB0aGlzLkRCKTtcbiAgaWYgKGRzID49IHRoaXMudCkge1xuICAgIHIudCA9IDA7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBicyA9IG4gJSB0aGlzLkRCO1xuICB2YXIgY2JzID0gdGhpcy5EQiAtIGJzO1xuICB2YXIgYm0gPSAoMSA8PCBicykgLSAxO1xuICByWzBdID0gdGhpc1tkc10gPj4gYnM7XG4gIGZvciAodmFyIGkgPSBkcyArIDE7IGkgPCB0aGlzLnQ7ICsraSkge1xuICAgIHJbaSAtIGRzIC0gMV0gfD0gKHRoaXNbaV0gJiBibSkgPDwgY2JzO1xuICAgIHJbaSAtIGRzXSA9IHRoaXNbaV0gPj4gYnM7XG4gIH1cbiAgaWYgKGJzID4gMCkgclt0aGlzLnQgLSBkcyAtIDFdIHw9ICh0aGlzLnMgJiBibSkgPDwgY2JzO1xuICByLnQgPSB0aGlzLnQgLSBkcztcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyAtIGFcbmZ1bmN0aW9uIGJucFN1YlRvKGEsIHIpIHtcbiAgdmFyIGkgPSAwLCBjID0gMCwgbSA9IE1hdGgubWluKGEudCwgdGhpcy50KTtcbiAgd2hpbGUgKGkgPCBtKSB7XG4gICAgYyArPSB0aGlzW2ldIC0gYVtpXTtcbiAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICBjID4+PSB0aGlzLkRCO1xuICB9XG4gIGlmIChhLnQgPCB0aGlzLnQpIHtcbiAgICBjIC09IGEucztcbiAgICB3aGlsZSAoaSA8IHRoaXMudCkge1xuICAgICAgYyArPSB0aGlzW2ldO1xuICAgICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjICs9IHRoaXMucztcbiAgfSBlbHNlIHtcbiAgICBjICs9IHRoaXMucztcbiAgICB3aGlsZSAoaSA8IGEudCkge1xuICAgICAgYyAtPSBhW2ldO1xuICAgICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjIC09IGEucztcbiAgfVxuICByLnMgPSAoYyA8IDApID8gLTEgOiAwO1xuICBpZiAoYyA8IC0xKVxuICAgIHJbaSsrXSA9IHRoaXMuRFYgKyBjO1xuICBlbHNlIGlmIChjID4gMClcbiAgICByW2krK10gPSBjO1xuICByLnQgPSBpO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzICogYSwgciAhPSB0aGlzLGEgKEhBQyAxNC4xMilcbi8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbmZ1bmN0aW9uIGJucE11bHRpcGx5VG8oYSwgcikge1xuICB2YXIgeCA9IHRoaXMuYWJzKCksIHkgPSBhLmFicygpO1xuICB2YXIgaSA9IHgudDtcbiAgci50ID0gaSArIHkudDtcbiAgd2hpbGUgKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IHkudDsgKytpKSByW2kgKyB4LnRdID0geC5hbSgwLCB5W2ldLCByLCBpLCAwLCB4LnQpO1xuICByLnMgPSAwO1xuICByLmNsYW1wKCk7XG4gIGlmICh0aGlzLnMgIT0gYS5zKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ociwgcik7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzXjIsIHIgIT0gdGhpcyAoSEFDIDE0LjE2KVxuZnVuY3Rpb24gYm5wU3F1YXJlVG8ocikge1xuICB2YXIgeCA9IHRoaXMuYWJzKCk7XG4gIHZhciBpID0gci50ID0gMiAqIHgudDtcbiAgd2hpbGUgKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yIChpID0gMDsgaSA8IHgudCAtIDE7ICsraSkge1xuICAgIHZhciBjID0geC5hbShpLCB4W2ldLCByLCAyICogaSwgMCwgMSk7XG4gICAgaWYgKChyW2kgKyB4LnRdICs9IHguYW0oaSArIDEsIDIgKiB4W2ldLCByLCAyICogaSArIDEsIGMsIHgudCAtIGkgLSAxKSkgPj1cbiAgICAgICAgeC5EVikge1xuICAgICAgcltpICsgeC50XSAtPSB4LkRWO1xuICAgICAgcltpICsgeC50ICsgMV0gPSAxO1xuICAgIH1cbiAgfVxuICBpZiAoci50ID4gMCkgcltyLnQgLSAxXSArPSB4LmFtKGksIHhbaV0sIHIsIDIgKiBpLCAwLCAxKTtcbiAgci5zID0gMDtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSBkaXZpZGUgdGhpcyBieSBtLCBxdW90aWVudCBhbmQgcmVtYWluZGVyIHRvIHEsIHIgKEhBQyAxNC4yMClcbi8vIHIgIT0gcSwgdGhpcyAhPSBtLiAgcSBvciByIG1heSBiZSBudWxsLlxuZnVuY3Rpb24gYm5wRGl2UmVtVG8obSwgcSwgcikge1xuICB2YXIgcG0gPSBtLmFicygpO1xuICBpZiAocG0udCA8PSAwKSByZXR1cm47XG4gIHZhciBwdCA9IHRoaXMuYWJzKCk7XG4gIGlmIChwdC50IDwgcG0udCkge1xuICAgIGlmIChxICE9IG51bGwpIHEuZnJvbUludCgwKTtcbiAgICBpZiAociAhPSBudWxsKSB0aGlzLmNvcHlUbyhyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHIgPT0gbnVsbCkgciA9IG5iaSgpO1xuICB2YXIgeSA9IG5iaSgpLCB0cyA9IHRoaXMucywgbXMgPSBtLnM7XG4gIHZhciBuc2ggPSB0aGlzLkRCIC0gbmJpdHMocG1bcG0udCAtIDFdKTsgIC8vIG5vcm1hbGl6ZSBtb2R1bHVzXG4gIGlmIChuc2ggPiAwKSB7XG4gICAgcG0ubFNoaWZ0VG8obnNoLCB5KTtcbiAgICBwdC5sU2hpZnRUbyhuc2gsIHIpO1xuICB9IGVsc2Uge1xuICAgIHBtLmNvcHlUbyh5KTtcbiAgICBwdC5jb3B5VG8ocik7XG4gIH1cbiAgdmFyIHlzID0geS50O1xuICB2YXIgeTAgPSB5W3lzIC0gMV07XG4gIGlmICh5MCA9PSAwKSByZXR1cm47XG4gIHZhciB5dCA9IHkwICogKDEgPDwgdGhpcy5GMSkgKyAoKHlzID4gMSkgPyB5W3lzIC0gMl0gPj4gdGhpcy5GMiA6IDApO1xuICB2YXIgZDEgPSB0aGlzLkZWIC8geXQsIGQyID0gKDEgPDwgdGhpcy5GMSkgLyB5dCwgZSA9IDEgPDwgdGhpcy5GMjtcbiAgdmFyIGkgPSByLnQsIGogPSBpIC0geXMsIHQgPSAocSA9PSBudWxsKSA/IG5iaSgpIDogcTtcbiAgeS5kbFNoaWZ0VG8oaiwgdCk7XG4gIGlmIChyLmNvbXBhcmVUbyh0KSA+PSAwKSB7XG4gICAgcltyLnQrK10gPSAxO1xuICAgIHIuc3ViVG8odCwgcik7XG4gIH1cbiAgQmlnSW50ZWdlci5PTkUuZGxTaGlmdFRvKHlzLCB0KTtcbiAgdC5zdWJUbyh5LCB5KTsgIC8vIFwibmVnYXRpdmVcIiB5IHNvIHdlIGNhbiByZXBsYWNlIHN1YiB3aXRoIGFtIGxhdGVyXG4gIHdoaWxlICh5LnQgPCB5cykgeVt5LnQrK10gPSAwO1xuICB3aGlsZSAoLS1qID49IDApIHtcbiAgICAvLyBFc3RpbWF0ZSBxdW90aWVudCBkaWdpdFxuICAgIHZhciBxZCA9XG4gICAgICAgIChyWy0taV0gPT0geTApID8gdGhpcy5ETSA6IE1hdGguZmxvb3IocltpXSAqIGQxICsgKHJbaSAtIDFdICsgZSkgKiBkMik7XG4gICAgaWYgKChyW2ldICs9IHkuYW0oMCwgcWQsIHIsIGosIDAsIHlzKSkgPCBxZCkgeyAgLy8gVHJ5IGl0IG91dFxuICAgICAgeS5kbFNoaWZ0VG8oaiwgdCk7XG4gICAgICByLnN1YlRvKHQsIHIpO1xuICAgICAgd2hpbGUgKHJbaV0gPCAtLXFkKSByLnN1YlRvKHQsIHIpO1xuICAgIH1cbiAgfVxuICBpZiAocSAhPSBudWxsKSB7XG4gICAgci5kclNoaWZ0VG8oeXMsIHEpO1xuICAgIGlmICh0cyAhPSBtcykgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHEsIHEpO1xuICB9XG4gIHIudCA9IHlzO1xuICByLmNsYW1wKCk7XG4gIGlmIChuc2ggPiAwKSByLnJTaGlmdFRvKG5zaCwgcik7ICAvLyBEZW5vcm1hbGl6ZSByZW1haW5kZXJcbiAgaWYgKHRzIDwgMCkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIsIHIpO1xufVxuXG4vLyAocHVibGljKSB0aGlzIG1vZCBhXG5mdW5jdGlvbiBibk1vZChhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYWJzKCkuZGl2UmVtVG8oYSwgbnVsbCwgcik7XG4gIGlmICh0aGlzLnMgPCAwICYmIHIuY29tcGFyZVRvKEJpZ0ludGVnZXIuWkVSTykgPiAwKSBhLnN1YlRvKHIsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gTW9kdWxhciByZWR1Y3Rpb24gdXNpbmcgXCJjbGFzc2ljXCIgYWxnb3JpdGhtXG5mdW5jdGlvbiBDbGFzc2ljKG0pIHtcbiAgdGhpcy5tID0gbTtcbn1cbmZ1bmN0aW9uIGNDb252ZXJ0KHgpIHtcbiAgaWYgKHgucyA8IDAgfHwgeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKVxuICAgIHJldHVybiB4Lm1vZCh0aGlzLm0pO1xuICBlbHNlXG4gICAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBjUmV2ZXJ0KHgpIHtcbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBjUmVkdWNlKHgpIHtcbiAgeC5kaXZSZW1Ubyh0aGlzLm0sIG51bGwsIHgpO1xufVxuZnVuY3Rpb24gY011bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cbmZ1bmN0aW9uIGNTcXJUbyh4LCByKSB7XG4gIHguc3F1YXJlVG8ocik7XG4gIHRoaXMucmVkdWNlKHIpO1xufVxuXG5DbGFzc2ljLnByb3RvdHlwZS5jb252ZXJ0ID0gY0NvbnZlcnQ7XG5DbGFzc2ljLnByb3RvdHlwZS5yZXZlcnQgPSBjUmV2ZXJ0O1xuQ2xhc3NpYy5wcm90b3R5cGUucmVkdWNlID0gY1JlZHVjZTtcbkNsYXNzaWMucHJvdG90eXBlLm11bFRvID0gY011bFRvO1xuQ2xhc3NpYy5wcm90b3R5cGUuc3FyVG8gPSBjU3FyVG87XG5cbi8vIChwcm90ZWN0ZWQpIHJldHVybiBcIi0xL3RoaXMgJSAyXkRCXCI7IHVzZWZ1bCBmb3IgTW9udC4gcmVkdWN0aW9uXG4vLyBqdXN0aWZpY2F0aW9uOlxuLy8gICAgICAgICB4eSA9PSAxIChtb2QgbSlcbi8vICAgICAgICAgeHkgPSAgMStrbVxuLy8gICB4eSgyLXh5KSA9ICgxK2ttKSgxLWttKVxuLy8geFt5KDIteHkpXSA9IDEta14ybV4yXG4vLyB4W3koMi14eSldID09IDEgKG1vZCBtXjIpXG4vLyBpZiB5IGlzIDEveCBtb2QgbSwgdGhlbiB5KDIteHkpIGlzIDEveCBtb2QgbV4yXG4vLyBzaG91bGQgcmVkdWNlIHggYW5kIHkoMi14eSkgYnkgbV4yIGF0IGVhY2ggc3RlcCB0byBrZWVwIHNpemUgYm91bmRlZC5cbi8vIEpTIG11bHRpcGx5IFwib3ZlcmZsb3dzXCIgZGlmZmVyZW50bHkgZnJvbSBDL0MrKywgc28gY2FyZSBpcyBuZWVkZWQgaGVyZS5cbmZ1bmN0aW9uIGJucEludkRpZ2l0KCkge1xuICBpZiAodGhpcy50IDwgMSkgcmV0dXJuIDA7XG4gIHZhciB4ID0gdGhpc1swXTtcbiAgaWYgKCh4ICYgMSkgPT0gMCkgcmV0dXJuIDA7XG4gIHZhciB5ID0geCAmIDM7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHkgPT0gMS94IG1vZCAyXjJcbiAgeSA9ICh5ICogKDIgLSAoeCAmIDB4ZikgKiB5KSkgJiAweGY7ICAgICAgICAgICAgICAgICAgICAgLy8geSA9PSAxL3ggbW9kIDJeNFxuICB5ID0gKHkgKiAoMiAtICh4ICYgMHhmZikgKiB5KSkgJiAweGZmOyAgICAgICAgICAgICAgICAgICAvLyB5ID09IDEveCBtb2QgMl44XG4gIHkgPSAoeSAqICgyIC0gKCgoeCAmIDB4ZmZmZikgKiB5KSAmIDB4ZmZmZikpKSAmIDB4ZmZmZjsgIC8vIHkgPT0gMS94IG1vZCAyXjE2XG4gIC8vIGxhc3Qgc3RlcCAtIGNhbGN1bGF0ZSBpbnZlcnNlIG1vZCBEViBkaXJlY3RseTtcbiAgLy8gYXNzdW1lcyAxNiA8IERCIDw9IDMyIGFuZCBhc3N1bWVzIGFiaWxpdHkgdG8gaGFuZGxlIDQ4LWJpdCBpbnRzXG4gIHkgPSAoeSAqICgyIC0geCAqIHkgJSB0aGlzLkRWKSkgJSB0aGlzLkRWOyAgLy8geSA9PSAxL3ggbW9kIDJeZGJpdHNcbiAgLy8gd2UgcmVhbGx5IHdhbnQgdGhlIG5lZ2F0aXZlIGludmVyc2UsIGFuZCAtRFYgPCB5IDwgRFZcbiAgcmV0dXJuICh5ID4gMCkgPyB0aGlzLkRWIC0geSA6IC15O1xufVxuXG4vLyBNb250Z29tZXJ5IHJlZHVjdGlvblxuZnVuY3Rpb24gTW9udGdvbWVyeShtKSB7XG4gIHRoaXMubSA9IG07XG4gIHRoaXMubXAgPSBtLmludkRpZ2l0KCk7XG4gIHRoaXMubXBsID0gdGhpcy5tcCAmIDB4N2ZmZjtcbiAgdGhpcy5tcGggPSB0aGlzLm1wID4+IDE1O1xuICB0aGlzLnVtID0gKDEgPDwgKG0uREIgLSAxNSkpIC0gMTtcbiAgdGhpcy5tdDIgPSAyICogbS50O1xufVxuXG4vLyB4UiBtb2QgbVxuZnVuY3Rpb24gbW9udENvbnZlcnQoeCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB4LmFicygpLmRsU2hpZnRUbyh0aGlzLm0udCwgcik7XG4gIHIuZGl2UmVtVG8odGhpcy5tLCBudWxsLCByKTtcbiAgaWYgKHgucyA8IDAgJiYgci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKSA+IDApIHRoaXMubS5zdWJUbyhyLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIHgvUiBtb2QgbVxuZnVuY3Rpb24gbW9udFJldmVydCh4KSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHguY29weVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIHggPSB4L1IgbW9kIG0gKEhBQyAxNC4zMilcbmZ1bmN0aW9uIG1vbnRSZWR1Y2UoeCkge1xuICB3aGlsZSAoeC50IDw9IHRoaXMubXQyKSAgLy8gcGFkIHggc28gYW0gaGFzIGVub3VnaCByb29tIGxhdGVyXG4gICAgeFt4LnQrK10gPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubS50OyArK2kpIHtcbiAgICAvLyBmYXN0ZXIgd2F5IG9mIGNhbGN1bGF0aW5nIHUwID0geFtpXSptcCBtb2QgRFZcbiAgICB2YXIgaiA9IHhbaV0gJiAweDdmZmY7XG4gICAgdmFyIHUwID0gKGogKiB0aGlzLm1wbCArXG4gICAgICAgICAgICAgICgoKGogKiB0aGlzLm1waCArICh4W2ldID4+IDE1KSAqIHRoaXMubXBsKSAmIHRoaXMudW0pIDw8IDE1KSkgJlxuICAgICAgICB4LkRNO1xuICAgIC8vIHVzZSBhbSB0byBjb21iaW5lIHRoZSBtdWx0aXBseS1zaGlmdC1hZGQgaW50byBvbmUgY2FsbFxuICAgIGogPSBpICsgdGhpcy5tLnQ7XG4gICAgeFtqXSArPSB0aGlzLm0uYW0oMCwgdTAsIHgsIGksIDAsIHRoaXMubS50KTtcbiAgICAvLyBwcm9wYWdhdGUgY2FycnlcbiAgICB3aGlsZSAoeFtqXSA+PSB4LkRWKSB7XG4gICAgICB4W2pdIC09IHguRFY7XG4gICAgICB4Wysral0rKztcbiAgICB9XG4gIH1cbiAgeC5jbGFtcCgpO1xuICB4LmRyU2hpZnRUbyh0aGlzLm0udCwgeCk7XG4gIGlmICh4LmNvbXBhcmVUbyh0aGlzLm0pID49IDApIHguc3ViVG8odGhpcy5tLCB4KTtcbn1cblxuLy8gciA9IFwieF4yL1IgbW9kIG1cIjsgeCAhPSByXG5mdW5jdGlvbiBtb250U3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuLy8gciA9IFwieHkvUiBtb2QgbVwiOyB4LHkgIT0gclxuZnVuY3Rpb24gbW9udE11bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuTW9udGdvbWVyeS5wcm90b3R5cGUuY29udmVydCA9IG1vbnRDb252ZXJ0O1xuTW9udGdvbWVyeS5wcm90b3R5cGUucmV2ZXJ0ID0gbW9udFJldmVydDtcbk1vbnRnb21lcnkucHJvdG90eXBlLnJlZHVjZSA9IG1vbnRSZWR1Y2U7XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5tdWxUbyA9IG1vbnRNdWxUbztcbk1vbnRnb21lcnkucHJvdG90eXBlLnNxclRvID0gbW9udFNxclRvO1xuXG4vLyAocHJvdGVjdGVkKSB0cnVlIGlmZiB0aGlzIGlzIGV2ZW5cbmZ1bmN0aW9uIGJucElzRXZlbigpIHtcbiAgcmV0dXJuICgodGhpcy50ID4gMCkgPyAodGhpc1swXSAmIDEpIDogdGhpcy5zKSA9PSAwO1xufVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzXmUsIGUgPCAyXjMyLCBkb2luZyBzcXIgYW5kIG11bCB3aXRoIFwiclwiIChIQUMgMTQuNzkpXG5mdW5jdGlvbiBibnBFeHAoZSwgeikge1xuICBpZiAoZSA+IDB4ZmZmZmZmZmYgfHwgZSA8IDEpIHJldHVybiBCaWdJbnRlZ2VyLk9ORTtcbiAgdmFyIHIgPSBuYmkoKSwgcjIgPSBuYmkoKSwgZyA9IHouY29udmVydCh0aGlzKSwgaSA9IG5iaXRzKGUpIC0gMTtcbiAgZy5jb3B5VG8ocik7XG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIHouc3FyVG8ociwgcjIpO1xuICAgIGlmICgoZSAmICgxIDw8IGkpKSA+IDApXG4gICAgICB6Lm11bFRvKHIyLCBnLCByKTtcbiAgICBlbHNlIHtcbiAgICAgIHZhciB0ID0gcjtcbiAgICAgIHIgPSByMjtcbiAgICAgIHIyID0gdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHoucmV2ZXJ0KHIpO1xufVxuXG4vLyAocHVibGljKSB0aGlzXmUgJSBtLCAwIDw9IGUgPCAyXjMyXG5mdW5jdGlvbiBibk1vZFBvd0ludChlLCBtKSB7XG4gIHZhciB6O1xuICBpZiAoZSA8IDI1NiB8fCBtLmlzRXZlbigpKVxuICAgIHogPSBuZXcgQ2xhc3NpYyhtKTtcbiAgZWxzZVxuICAgIHogPSBuZXcgTW9udGdvbWVyeShtKTtcbiAgcmV0dXJuIHRoaXMuZXhwKGUsIHopO1xufVxuXG4vLyBwcm90ZWN0ZWRcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNvcHlUbyA9IGJucENvcHlUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21JbnQgPSBibnBGcm9tSW50O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbVN0cmluZyA9IGJucEZyb21TdHJpbmc7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGFtcCA9IGJucENsYW1wO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGxTaGlmdFRvID0gYm5wRExTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZHJTaGlmdFRvID0gYm5wRFJTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubFNoaWZ0VG8gPSBibnBMU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLnJTaGlmdFRvID0gYm5wUlNoaWZ0VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zdWJUbyA9IGJucFN1YlRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlUbyA9IGJucE11bHRpcGx5VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zcXVhcmVUbyA9IGJucFNxdWFyZVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2UmVtVG8gPSBibnBEaXZSZW1UbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmludkRpZ2l0ID0gYm5wSW52RGlnaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pc0V2ZW4gPSBibnBJc0V2ZW47XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5leHAgPSBibnBFeHA7XG5cbi8vIHB1YmxpY1xuQmlnSW50ZWdlci5wcm90b3R5cGUudG9TdHJpbmcgPSBiblRvU3RyaW5nO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubmVnYXRlID0gYm5OZWdhdGU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hYnMgPSBibkFicztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNvbXBhcmVUbyA9IGJuQ29tcGFyZVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYml0TGVuZ3RoID0gYm5CaXRMZW5ndGg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2QgPSBibk1vZDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZFBvd0ludCA9IGJuTW9kUG93SW50O1xuXG4vLyBcImNvbnN0YW50c1wiXG5CaWdJbnRlZ2VyLlpFUk8gPSBuYnYoMCk7XG5CaWdJbnRlZ2VyLk9ORSA9IG5idigxKTtcblxuLy8gUG9vbCBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0IGFuZCBncmVhdGVyIHRoYW4gMzIuXG4vLyBBbiBhcnJheSBvZiBieXRlcyB0aGUgc2l6ZSBvZiB0aGUgcG9vbCB3aWxsIGJlIHBhc3NlZCB0byBpbml0KClcbnZhciBybmdfcHNpemUgPSAyNTY7XG5cbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgIGRlZmF1bHQ6IEJpZ0ludGVnZXIsXG4gICAgQmlnSW50ZWdlcjogQmlnSW50ZWdlcixcbiAgfTtcbn0gZWxzZSB7XG4gIHRoaXMuanNibiA9IHtcbiAgICBCaWdJbnRlZ2VyOiBCaWdJbnRlZ2VyLFxuICB9O1xufVxuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDUtMjAwOSAgVG9tIFd1XG4vLyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuLy8gU2VlIFwiTElDRU5TRVwiIGZvciBkZXRhaWxzLlxuXG4vLyBFeHRlbmRlZCBKYXZhU2NyaXB0IEJOIGZ1bmN0aW9ucywgcmVxdWlyZWQgZm9yIFJTQSBwcml2YXRlIG9wcy5cblxuLy8gVmVyc2lvbiAxLjE6IG5ldyBCaWdJbnRlZ2VyKFwiMFwiLCAxMCkgcmV0dXJucyBcInByb3BlclwiIHplcm9cbi8vIFZlcnNpb24gMS4yOiBzcXVhcmUoKSBBUEksIGlzUHJvYmFibGVQcmltZSBmaXhcblxuLy8gKHB1YmxpYylcbmZ1bmN0aW9uIGJuQ2xvbmUoKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuY29weVRvKHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGludGVnZXJcbmZ1bmN0aW9uIGJuSW50VmFsdWUoKSB7XG4gIGlmICh0aGlzLnMgPCAwKSB7XG4gICAgaWYgKHRoaXMudCA9PSAxKVxuICAgICAgcmV0dXJuIHRoaXNbMF0gLSB0aGlzLkRWO1xuICAgIGVsc2UgaWYgKHRoaXMudCA9PSAwKVxuICAgICAgcmV0dXJuIC0xO1xuICB9IGVsc2UgaWYgKHRoaXMudCA9PSAxKVxuICAgIHJldHVybiB0aGlzWzBdO1xuICBlbHNlIGlmICh0aGlzLnQgPT0gMClcbiAgICByZXR1cm4gMDtcbiAgLy8gYXNzdW1lcyAxNiA8IERCIDwgMzJcbiAgcmV0dXJuICgodGhpc1sxXSAmICgoMSA8PCAoMzIgLSB0aGlzLkRCKSkgLSAxKSkgPDwgdGhpcy5EQikgfCB0aGlzWzBdO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgYnl0ZVxuZnVuY3Rpb24gYm5CeXRlVmFsdWUoKSB7XG4gIHJldHVybiAodGhpcy50ID09IDApID8gdGhpcy5zIDogKHRoaXNbMF0gPDwgMjQpID4+IDI0O1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgc2hvcnQgKGFzc3VtZXMgREI+PTE2KVxuZnVuY3Rpb24gYm5TaG9ydFZhbHVlKCkge1xuICByZXR1cm4gKHRoaXMudCA9PSAwKSA/IHRoaXMucyA6ICh0aGlzWzBdIDw8IDE2KSA+PiAxNjtcbn1cblxuLy8gKHByb3RlY3RlZCkgcmV0dXJuIHggcy50LiByXnggPCBEVlxuZnVuY3Rpb24gYm5wQ2h1bmtTaXplKHIpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5MTjIgKiB0aGlzLkRCIC8gTWF0aC5sb2cocikpO1xufVxuXG4vLyAocHVibGljKSAwIGlmIHRoaXMgPT0gMCwgMSBpZiB0aGlzID4gMFxuZnVuY3Rpb24gYm5TaWdOdW0oKSB7XG4gIGlmICh0aGlzLnMgPCAwKVxuICAgIHJldHVybiAtMTtcbiAgZWxzZSBpZiAodGhpcy50IDw9IDAgfHwgKHRoaXMudCA9PSAxICYmIHRoaXNbMF0gPD0gMCkpXG4gICAgcmV0dXJuIDA7XG4gIGVsc2VcbiAgICByZXR1cm4gMTtcbn1cblxuLy8gKHByb3RlY3RlZCkgY29udmVydCB0byByYWRpeCBzdHJpbmdcbmZ1bmN0aW9uIGJucFRvUmFkaXgoYikge1xuICBpZiAoYiA9PSBudWxsKSBiID0gMTA7XG4gIGlmICh0aGlzLnNpZ251bSgpID09IDAgfHwgYiA8IDIgfHwgYiA+IDM2KSByZXR1cm4gJzAnO1xuICB2YXIgY3MgPSB0aGlzLmNodW5rU2l6ZShiKTtcbiAgdmFyIGEgPSBNYXRoLnBvdyhiLCBjcyk7XG4gIHZhciBkID0gbmJ2KGEpLCB5ID0gbmJpKCksIHogPSBuYmkoKSwgciA9ICcnO1xuICB0aGlzLmRpdlJlbVRvKGQsIHksIHopO1xuICB3aGlsZSAoeS5zaWdudW0oKSA+IDApIHtcbiAgICByID0gKGEgKyB6LmludFZhbHVlKCkpLnRvU3RyaW5nKGIpLnN1YnN0cigxKSArIHI7XG4gICAgeS5kaXZSZW1UbyhkLCB5LCB6KTtcbiAgfVxuICByZXR1cm4gei5pbnRWYWx1ZSgpLnRvU3RyaW5nKGIpICsgcjtcbn1cblxuLy8gKHByb3RlY3RlZCkgY29udmVydCBmcm9tIHJhZGl4IHN0cmluZ1xuZnVuY3Rpb24gYm5wRnJvbVJhZGl4KHMsIGIpIHtcbiAgdGhpcy5mcm9tSW50KDApO1xuICBpZiAoYiA9PSBudWxsKSBiID0gMTA7XG4gIHZhciBjcyA9IHRoaXMuY2h1bmtTaXplKGIpO1xuICB2YXIgZCA9IE1hdGgucG93KGIsIGNzKSwgbWkgPSBmYWxzZSwgaiA9IDAsIHcgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgeCA9IGludEF0KHMsIGkpO1xuICAgIGlmICh4IDwgMCkge1xuICAgICAgaWYgKHMuY2hhckF0KGkpID09ICctJyAmJiB0aGlzLnNpZ251bSgpID09IDApIG1pID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB3ID0gYiAqIHcgKyB4O1xuICAgIGlmICgrK2ogPj0gY3MpIHtcbiAgICAgIHRoaXMuZE11bHRpcGx5KGQpO1xuICAgICAgdGhpcy5kQWRkT2Zmc2V0KHcsIDApO1xuICAgICAgaiA9IDA7XG4gICAgICB3ID0gMDtcbiAgICB9XG4gIH1cbiAgaWYgKGogPiAwKSB7XG4gICAgdGhpcy5kTXVsdGlwbHkoTWF0aC5wb3coYiwgaikpO1xuICAgIHRoaXMuZEFkZE9mZnNldCh3LCAwKTtcbiAgfVxuICBpZiAobWkpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLCB0aGlzKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgYWx0ZXJuYXRlIGNvbnN0cnVjdG9yXG5mdW5jdGlvbiBibnBGcm9tTnVtYmVyKGEsIGIsIGMpIHtcbiAgaWYgKCdudW1iZXInID09IHR5cGVvZiBiKSB7XG4gICAgLy8gbmV3IEJpZ0ludGVnZXIoaW50LGludCxSTkcpXG4gICAgaWYgKGEgPCAyKVxuICAgICAgdGhpcy5mcm9tSW50KDEpO1xuICAgIGVsc2Uge1xuICAgICAgdGhpcy5mcm9tTnVtYmVyKGEsIGMpO1xuICAgICAgaWYgKCF0aGlzLnRlc3RCaXQoYSAtIDEpKSAgLy8gZm9yY2UgTVNCIHNldFxuICAgICAgICB0aGlzLmJpdHdpc2VUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYSAtIDEpLCBvcF9vciwgdGhpcyk7XG4gICAgICBpZiAodGhpcy5pc0V2ZW4oKSkgdGhpcy5kQWRkT2Zmc2V0KDEsIDApOyAgLy8gZm9yY2Ugb2RkXG4gICAgICB3aGlsZSAoIXRoaXMuaXNQcm9iYWJsZVByaW1lKGIpKSB7XG4gICAgICAgIHRoaXMuZEFkZE9mZnNldCgyLCAwKTtcbiAgICAgICAgaWYgKHRoaXMuYml0TGVuZ3RoKCkgPiBhKVxuICAgICAgICAgIHRoaXMuc3ViVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEgLSAxKSwgdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIG5ldyBCaWdJbnRlZ2VyKGludCxSTkcpXG4gICAgdmFyIHggPSBuZXcgQXJyYXkoKSwgdCA9IGEgJiA3O1xuICAgIHgubGVuZ3RoID0gKGEgPj4gMykgKyAxO1xuICAgIGIubmV4dEJ5dGVzKHgpO1xuICAgIGlmICh0ID4gMClcbiAgICAgIHhbMF0gJj0gKCgxIDw8IHQpIC0gMSk7XG4gICAgZWxzZVxuICAgICAgeFswXSA9IDA7XG4gICAgdGhpcy5mcm9tU3RyaW5nKHgsIDI1Nik7XG4gIH1cbn1cblxuLy8gKHB1YmxpYykgY29udmVydCB0byBiaWdlbmRpYW4gYnl0ZSBhcnJheVxuZnVuY3Rpb24gYm5Ub0J5dGVBcnJheSgpIHtcbiAgdmFyIGkgPSB0aGlzLnQsIHIgPSBuZXcgQXJyYXkoKTtcbiAgclswXSA9IHRoaXMucztcbiAgdmFyIHAgPSB0aGlzLkRCIC0gKGkgKiB0aGlzLkRCKSAlIDgsIGQsIGsgPSAwO1xuICBpZiAoaS0tID4gMCkge1xuICAgIGlmIChwIDwgdGhpcy5EQiAmJiAoZCA9IHRoaXNbaV0gPj4gcCkgIT0gKHRoaXMucyAmIHRoaXMuRE0pID4+IHApXG4gICAgICByW2srK10gPSBkIHwgKHRoaXMucyA8PCAodGhpcy5EQiAtIHApKTtcbiAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICBpZiAocCA8IDgpIHtcbiAgICAgICAgZCA9ICh0aGlzW2ldICYgKCgxIDw8IHApIC0gMSkpIDw8ICg4IC0gcCk7XG4gICAgICAgIGQgfD0gdGhpc1stLWldID4+IChwICs9IHRoaXMuREIgLSA4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSA+PiAocCAtPSA4KSkgJiAweGZmO1xuICAgICAgICBpZiAocCA8PSAwKSB7XG4gICAgICAgICAgcCArPSB0aGlzLkRCO1xuICAgICAgICAgIC0taTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKChkICYgMHg4MCkgIT0gMCkgZCB8PSAtMjU2O1xuICAgICAgaWYgKGsgPT0gMCAmJiAodGhpcy5zICYgMHg4MCkgIT0gKGQgJiAweDgwKSkgKytrO1xuICAgICAgaWYgKGsgPiAwIHx8IGQgIT0gdGhpcy5zKSByW2srK10gPSBkO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gYm5FcXVhbHMoYSkge1xuICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpID09IDApO1xufVxuZnVuY3Rpb24gYm5NaW4oYSkge1xuICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpIDwgMCkgPyB0aGlzIDogYTtcbn1cbmZ1bmN0aW9uIGJuTWF4KGEpIHtcbiAgcmV0dXJuICh0aGlzLmNvbXBhcmVUbyhhKSA+IDApID8gdGhpcyA6IGE7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIG9wIGEgKGJpdHdpc2UpXG5mdW5jdGlvbiBibnBCaXR3aXNlVG8oYSwgb3AsIHIpIHtcbiAgdmFyIGksIGYsIG0gPSBNYXRoLm1pbihhLnQsIHRoaXMudCk7XG4gIGZvciAoaSA9IDA7IGkgPCBtOyArK2kpIHJbaV0gPSBvcCh0aGlzW2ldLCBhW2ldKTtcbiAgaWYgKGEudCA8IHRoaXMudCkge1xuICAgIGYgPSBhLnMgJiB0aGlzLkRNO1xuICAgIGZvciAoaSA9IG07IGkgPCB0aGlzLnQ7ICsraSkgcltpXSA9IG9wKHRoaXNbaV0sIGYpO1xuICAgIHIudCA9IHRoaXMudDtcbiAgfSBlbHNlIHtcbiAgICBmID0gdGhpcy5zICYgdGhpcy5ETTtcbiAgICBmb3IgKGkgPSBtOyBpIDwgYS50OyArK2kpIHJbaV0gPSBvcChmLCBhW2ldKTtcbiAgICByLnQgPSBhLnQ7XG4gIH1cbiAgci5zID0gb3AodGhpcy5zLCBhLnMpO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgJiBhXG5mdW5jdGlvbiBvcF9hbmQoeCwgeSkge1xuICByZXR1cm4geCAmIHk7XG59XG5mdW5jdGlvbiBibkFuZChhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX2FuZCwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzIHwgYVxuZnVuY3Rpb24gb3Bfb3IoeCwgeSkge1xuICByZXR1cm4geCB8IHk7XG59XG5mdW5jdGlvbiBibk9yKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3Bfb3IsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyBeIGFcbmZ1bmN0aW9uIG9wX3hvcih4LCB5KSB7XG4gIHJldHVybiB4IF4geTtcbn1cbmZ1bmN0aW9uIGJuWG9yKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3BfeG9yLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgJiB+YVxuZnVuY3Rpb24gb3BfYW5kbm90KHgsIHkpIHtcbiAgcmV0dXJuIHggJiB+eTtcbn1cbmZ1bmN0aW9uIGJuQW5kTm90KGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3BfYW5kbm90LCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIH50aGlzXG5mdW5jdGlvbiBibk5vdCgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnQ7ICsraSkgcltpXSA9IHRoaXMuRE0gJiB+dGhpc1tpXTtcbiAgci50ID0gdGhpcy50O1xuICByLnMgPSB+dGhpcy5zO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyA8PCBuXG5mdW5jdGlvbiBiblNoaWZ0TGVmdChuKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIGlmIChuIDwgMClcbiAgICB0aGlzLnJTaGlmdFRvKC1uLCByKTtcbiAgZWxzZVxuICAgIHRoaXMubFNoaWZ0VG8obiwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzID4+IG5cbmZ1bmN0aW9uIGJuU2hpZnRSaWdodChuKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIGlmIChuIDwgMClcbiAgICB0aGlzLmxTaGlmdFRvKC1uLCByKTtcbiAgZWxzZVxuICAgIHRoaXMuclNoaWZ0VG8obiwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyByZXR1cm4gaW5kZXggb2YgbG93ZXN0IDEtYml0IGluIHgsIHggPCAyXjMxXG5mdW5jdGlvbiBsYml0KHgpIHtcbiAgaWYgKHggPT0gMCkgcmV0dXJuIC0xO1xuICB2YXIgciA9IDA7XG4gIGlmICgoeCAmIDB4ZmZmZikgPT0gMCkge1xuICAgIHggPj49IDE2O1xuICAgIHIgKz0gMTY7XG4gIH1cbiAgaWYgKCh4ICYgMHhmZikgPT0gMCkge1xuICAgIHggPj49IDg7XG4gICAgciArPSA4O1xuICB9XG4gIGlmICgoeCAmIDB4ZikgPT0gMCkge1xuICAgIHggPj49IDQ7XG4gICAgciArPSA0O1xuICB9XG4gIGlmICgoeCAmIDMpID09IDApIHtcbiAgICB4ID4+PSAyO1xuICAgIHIgKz0gMjtcbiAgfVxuICBpZiAoKHggJiAxKSA9PSAwKSArK3I7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm5zIGluZGV4IG9mIGxvd2VzdCAxLWJpdCAob3IgLTEgaWYgbm9uZSlcbmZ1bmN0aW9uIGJuR2V0TG93ZXN0U2V0Qml0KCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudDsgKytpKVxuICAgIGlmICh0aGlzW2ldICE9IDApIHJldHVybiBpICogdGhpcy5EQiArIGxiaXQodGhpc1tpXSk7XG4gIGlmICh0aGlzLnMgPCAwKSByZXR1cm4gdGhpcy50ICogdGhpcy5EQjtcbiAgcmV0dXJuIC0xO1xufVxuXG4vLyByZXR1cm4gbnVtYmVyIG9mIDEgYml0cyBpbiB4XG5mdW5jdGlvbiBjYml0KHgpIHtcbiAgdmFyIHIgPSAwO1xuICB3aGlsZSAoeCAhPSAwKSB7XG4gICAgeCAmPSB4IC0gMTtcbiAgICArK3I7XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiBudW1iZXIgb2Ygc2V0IGJpdHNcbmZ1bmN0aW9uIGJuQml0Q291bnQoKSB7XG4gIHZhciByID0gMCwgeCA9IHRoaXMucyAmIHRoaXMuRE07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHIgKz0gY2JpdCh0aGlzW2ldIF4geCk7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0cnVlIGlmZiBudGggYml0IGlzIHNldFxuZnVuY3Rpb24gYm5UZXN0Qml0KG4pIHtcbiAgdmFyIGogPSBNYXRoLmZsb29yKG4gLyB0aGlzLkRCKTtcbiAgaWYgKGogPj0gdGhpcy50KSByZXR1cm4gKHRoaXMucyAhPSAwKTtcbiAgcmV0dXJuICgodGhpc1tqXSAmICgxIDw8IChuICUgdGhpcy5EQikpKSAhPSAwKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyBvcCAoMTw8bilcbmZ1bmN0aW9uIGJucENoYW5nZUJpdChuLCBvcCkge1xuICB2YXIgciA9IEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChuKTtcbiAgdGhpcy5iaXR3aXNlVG8ociwgb3AsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyB8ICgxPDxuKVxuZnVuY3Rpb24gYm5TZXRCaXQobikge1xuICByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobiwgb3Bfb3IpO1xufVxuXG4vLyAocHVibGljKSB0aGlzICYgfigxPDxuKVxuZnVuY3Rpb24gYm5DbGVhckJpdChuKSB7XG4gIHJldHVybiB0aGlzLmNoYW5nZUJpdChuLCBvcF9hbmRub3QpO1xufVxuXG4vLyAocHVibGljKSB0aGlzIF4gKDE8PG4pXG5mdW5jdGlvbiBibkZsaXBCaXQobikge1xuICByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobiwgb3BfeG9yKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgKyBhXG5mdW5jdGlvbiBibnBBZGRUbyhhLCByKSB7XG4gIHZhciBpID0gMCwgYyA9IDAsIG0gPSBNYXRoLm1pbihhLnQsIHRoaXMudCk7XG4gIHdoaWxlIChpIDwgbSkge1xuICAgIGMgKz0gdGhpc1tpXSArIGFbaV07XG4gICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgYyA+Pj0gdGhpcy5EQjtcbiAgfVxuICBpZiAoYS50IDwgdGhpcy50KSB7XG4gICAgYyArPSBhLnM7XG4gICAgd2hpbGUgKGkgPCB0aGlzLnQpIHtcbiAgICAgIGMgKz0gdGhpc1tpXTtcbiAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyArPSB0aGlzLnM7XG4gIH0gZWxzZSB7XG4gICAgYyArPSB0aGlzLnM7XG4gICAgd2hpbGUgKGkgPCBhLnQpIHtcbiAgICAgIGMgKz0gYVtpXTtcbiAgICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyArPSBhLnM7XG4gIH1cbiAgci5zID0gKGMgPCAwKSA/IC0xIDogMDtcbiAgaWYgKGMgPiAwKVxuICAgIHJbaSsrXSA9IGM7XG4gIGVsc2UgaWYgKGMgPCAtMSlcbiAgICByW2krK10gPSB0aGlzLkRWICsgYztcbiAgci50ID0gaTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHVibGljKSB0aGlzICsgYVxuZnVuY3Rpb24gYm5BZGQoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmFkZFRvKGEsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAtIGFcbmZ1bmN0aW9uIGJuU3VidHJhY3QoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLnN1YlRvKGEsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAqIGFcbmZ1bmN0aW9uIGJuTXVsdGlwbHkoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLm11bHRpcGx5VG8oYSwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzXjJcbmZ1bmN0aW9uIGJuU3F1YXJlKCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLnNxdWFyZVRvKHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAvIGFcbmZ1bmN0aW9uIGJuRGl2aWRlKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5kaXZSZW1UbyhhLCByLCBudWxsKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgJSBhXG5mdW5jdGlvbiBiblJlbWFpbmRlcihhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuZGl2UmVtVG8oYSwgbnVsbCwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSBbdGhpcy9hLHRoaXMlYV1cbmZ1bmN0aW9uIGJuRGl2aWRlQW5kUmVtYWluZGVyKGEpIHtcbiAgdmFyIHEgPSBuYmkoKSwgciA9IG5iaSgpO1xuICB0aGlzLmRpdlJlbVRvKGEsIHEsIHIpO1xuICByZXR1cm4gbmV3IEFycmF5KHEsIHIpO1xufVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzICo9IG4sIHRoaXMgPj0gMCwgMSA8IG4gPCBEVlxuZnVuY3Rpb24gYm5wRE11bHRpcGx5KG4pIHtcbiAgdGhpc1t0aGlzLnRdID0gdGhpcy5hbSgwLCBuIC0gMSwgdGhpcywgMCwgMCwgdGhpcy50KTtcbiAgKyt0aGlzLnQ7XG4gIHRoaXMuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyArPSBuIDw8IHcgd29yZHMsIHRoaXMgPj0gMFxuZnVuY3Rpb24gYm5wREFkZE9mZnNldChuLCB3KSB7XG4gIGlmIChuID09IDApIHJldHVybjtcbiAgd2hpbGUgKHRoaXMudCA8PSB3KSB0aGlzW3RoaXMudCsrXSA9IDA7XG4gIHRoaXNbd10gKz0gbjtcbiAgd2hpbGUgKHRoaXNbd10gPj0gdGhpcy5EVikge1xuICAgIHRoaXNbd10gLT0gdGhpcy5EVjtcbiAgICBpZiAoKyt3ID49IHRoaXMudCkgdGhpc1t0aGlzLnQrK10gPSAwO1xuICAgICsrdGhpc1t3XTtcbiAgfVxufVxuXG4vLyBBIFwibnVsbFwiIHJlZHVjZXJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZnVuY3Rpb24gTnVsbEV4cCgpIHt9XG5mdW5jdGlvbiBuTm9wKHgpIHtcbiAgcmV0dXJuIHg7XG59XG5mdW5jdGlvbiBuTXVsVG8oeCwgeSwgcikge1xuICB4Lm11bHRpcGx5VG8oeSwgcik7XG59XG5mdW5jdGlvbiBuU3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpO1xufVxuXG5OdWxsRXhwLnByb3RvdHlwZS5jb252ZXJ0ID0gbk5vcDtcbk51bGxFeHAucHJvdG90eXBlLnJldmVydCA9IG5Ob3A7XG5OdWxsRXhwLnByb3RvdHlwZS5tdWxUbyA9IG5NdWxUbztcbk51bGxFeHAucHJvdG90eXBlLnNxclRvID0gblNxclRvO1xuXG4vLyAocHVibGljKSB0aGlzXmVcbmZ1bmN0aW9uIGJuUG93KGUpIHtcbiAgcmV0dXJuIHRoaXMuZXhwKGUsIG5ldyBOdWxsRXhwKCkpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gbG93ZXIgbiB3b3JkcyBvZiBcInRoaXMgKiBhXCIsIGEudCA8PSBuXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseUxvd2VyVG8oYSwgbiwgcikge1xuICB2YXIgaSA9IE1hdGgubWluKHRoaXMudCArIGEudCwgbik7XG4gIHIucyA9IDA7ICAvLyBhc3N1bWVzIGEsdGhpcyA+PSAwXG4gIHIudCA9IGk7XG4gIHdoaWxlIChpID4gMCkgclstLWldID0gMDtcbiAgdmFyIGo7XG4gIGZvciAoaiA9IHIudCAtIHRoaXMudDsgaSA8IGo7ICsraSlcbiAgICByW2kgKyB0aGlzLnRdID0gdGhpcy5hbSgwLCBhW2ldLCByLCBpLCAwLCB0aGlzLnQpO1xuICBmb3IgKGogPSBNYXRoLm1pbihhLnQsIG4pOyBpIDwgajsgKytpKSB0aGlzLmFtKDAsIGFbaV0sIHIsIGksIDAsIG4gLSBpKTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gXCJ0aGlzICogYVwiIHdpdGhvdXQgbG93ZXIgbiB3b3JkcywgbiA+IDBcbi8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbmZ1bmN0aW9uIGJucE11bHRpcGx5VXBwZXJUbyhhLCBuLCByKSB7XG4gIC0tbjtcbiAgdmFyIGkgPSByLnQgPSB0aGlzLnQgKyBhLnQgLSBuO1xuICByLnMgPSAwOyAgLy8gYXNzdW1lcyBhLHRoaXMgPj0gMFxuICB3aGlsZSAoLS1pID49IDApIHJbaV0gPSAwO1xuICBmb3IgKGkgPSBNYXRoLm1heChuIC0gdGhpcy50LCAwKTsgaSA8IGEudDsgKytpKVxuICAgIHJbdGhpcy50ICsgaSAtIG5dID0gdGhpcy5hbShuIC0gaSwgYVtpXSwgciwgMCwgMCwgdGhpcy50ICsgaSAtIG4pO1xuICByLmNsYW1wKCk7XG4gIHIuZHJTaGlmdFRvKDEsIHIpO1xufVxuXG4vLyBCYXJyZXR0IG1vZHVsYXIgcmVkdWN0aW9uXG5mdW5jdGlvbiBCYXJyZXR0KG0pIHtcbiAgLy8gc2V0dXAgQmFycmV0dFxuICB0aGlzLnIyID0gbmJpKCk7XG4gIHRoaXMucTMgPSBuYmkoKTtcbiAgQmlnSW50ZWdlci5PTkUuZGxTaGlmdFRvKDIgKiBtLnQsIHRoaXMucjIpO1xuICB0aGlzLm11ID0gdGhpcy5yMi5kaXZpZGUobSk7XG4gIHRoaXMubSA9IG07XG59XG5cbmZ1bmN0aW9uIGJhcnJldHRDb252ZXJ0KHgpIHtcbiAgaWYgKHgucyA8IDAgfHwgeC50ID4gMiAqIHRoaXMubS50KVxuICAgIHJldHVybiB4Lm1vZCh0aGlzLm0pO1xuICBlbHNlIGlmICh4LmNvbXBhcmVUbyh0aGlzLm0pIDwgMClcbiAgICByZXR1cm4geDtcbiAgZWxzZSB7XG4gICAgdmFyIHIgPSBuYmkoKTtcbiAgICB4LmNvcHlUbyhyKTtcbiAgICB0aGlzLnJlZHVjZShyKTtcbiAgICByZXR1cm4gcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXJyZXR0UmV2ZXJ0KHgpIHtcbiAgcmV0dXJuIHg7XG59XG5cbi8vIHggPSB4IG1vZCBtIChIQUMgMTQuNDIpXG5mdW5jdGlvbiBiYXJyZXR0UmVkdWNlKHgpIHtcbiAgeC5kclNoaWZ0VG8odGhpcy5tLnQgLSAxLCB0aGlzLnIyKTtcbiAgaWYgKHgudCA+IHRoaXMubS50ICsgMSkge1xuICAgIHgudCA9IHRoaXMubS50ICsgMTtcbiAgICB4LmNsYW1wKCk7XG4gIH1cbiAgdGhpcy5tdS5tdWx0aXBseVVwcGVyVG8odGhpcy5yMiwgdGhpcy5tLnQgKyAxLCB0aGlzLnEzKTtcbiAgdGhpcy5tLm11bHRpcGx5TG93ZXJUbyh0aGlzLnEzLCB0aGlzLm0udCArIDEsIHRoaXMucjIpO1xuICB3aGlsZSAoeC5jb21wYXJlVG8odGhpcy5yMikgPCAwKSB4LmRBZGRPZmZzZXQoMSwgdGhpcy5tLnQgKyAxKTtcbiAgeC5zdWJUbyh0aGlzLnIyLCB4KTtcbiAgd2hpbGUgKHguY29tcGFyZVRvKHRoaXMubSkgPj0gMCkgeC5zdWJUbyh0aGlzLm0sIHgpO1xufVxuXG4vLyByID0geF4yIG1vZCBtOyB4ICE9IHJcbmZ1bmN0aW9uIGJhcnJldHRTcXJUbyh4LCByKSB7XG4gIHguc3F1YXJlVG8ocik7XG4gIHRoaXMucmVkdWNlKHIpO1xufVxuXG4vLyByID0geCp5IG1vZCBtOyB4LHkgIT0gclxuZnVuY3Rpb24gYmFycmV0dE11bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpO1xuICB0aGlzLnJlZHVjZShyKTtcbn1cblxuQmFycmV0dC5wcm90b3R5cGUuY29udmVydCA9IGJhcnJldHRDb252ZXJ0O1xuQmFycmV0dC5wcm90b3R5cGUucmV2ZXJ0ID0gYmFycmV0dFJldmVydDtcbkJhcnJldHQucHJvdG90eXBlLnJlZHVjZSA9IGJhcnJldHRSZWR1Y2U7XG5CYXJyZXR0LnByb3RvdHlwZS5tdWxUbyA9IGJhcnJldHRNdWxUbztcbkJhcnJldHQucHJvdG90eXBlLnNxclRvID0gYmFycmV0dFNxclRvO1xuXG4vLyAocHVibGljKSB0aGlzXmUgJSBtIChIQUMgMTQuODUpXG5mdW5jdGlvbiBibk1vZFBvdyhlLCBtKSB7XG4gIHZhciBpID0gZS5iaXRMZW5ndGgoKSwgaywgciA9IG5idigxKSwgejtcbiAgaWYgKGkgPD0gMClcbiAgICByZXR1cm4gcjtcbiAgZWxzZSBpZiAoaSA8IDE4KVxuICAgIGsgPSAxO1xuICBlbHNlIGlmIChpIDwgNDgpXG4gICAgayA9IDM7XG4gIGVsc2UgaWYgKGkgPCAxNDQpXG4gICAgayA9IDQ7XG4gIGVsc2UgaWYgKGkgPCA3NjgpXG4gICAgayA9IDU7XG4gIGVsc2VcbiAgICBrID0gNjtcbiAgaWYgKGkgPCA4KVxuICAgIHogPSBuZXcgQ2xhc3NpYyhtKTtcbiAgZWxzZSBpZiAobS5pc0V2ZW4oKSlcbiAgICB6ID0gbmV3IEJhcnJldHQobSk7XG4gIGVsc2VcbiAgICB6ID0gbmV3IE1vbnRnb21lcnkobSk7XG5cbiAgLy8gcHJlY29tcHV0YXRpb25cbiAgdmFyIGcgPSBuZXcgQXJyYXkoKSwgbiA9IDMsIGsxID0gayAtIDEsIGttID0gKDEgPDwgaykgLSAxO1xuICBnWzFdID0gei5jb252ZXJ0KHRoaXMpO1xuICBpZiAoayA+IDEpIHtcbiAgICB2YXIgZzIgPSBuYmkoKTtcbiAgICB6LnNxclRvKGdbMV0sIGcyKTtcbiAgICB3aGlsZSAobiA8PSBrbSkge1xuICAgICAgZ1tuXSA9IG5iaSgpO1xuICAgICAgei5tdWxUbyhnMiwgZ1tuIC0gMl0sIGdbbl0pO1xuICAgICAgbiArPSAyO1xuICAgIH1cbiAgfVxuXG4gIHZhciBqID0gZS50IC0gMSwgdywgaXMxID0gdHJ1ZSwgcjIgPSBuYmkoKSwgdDtcbiAgaSA9IG5iaXRzKGVbal0pIC0gMTtcbiAgd2hpbGUgKGogPj0gMCkge1xuICAgIGlmIChpID49IGsxKVxuICAgICAgdyA9IChlW2pdID4+IChpIC0gazEpKSAmIGttO1xuICAgIGVsc2Uge1xuICAgICAgdyA9IChlW2pdICYgKCgxIDw8IChpICsgMSkpIC0gMSkpIDw8IChrMSAtIGkpO1xuICAgICAgaWYgKGogPiAwKSB3IHw9IGVbaiAtIDFdID4+ICh0aGlzLkRCICsgaSAtIGsxKTtcbiAgICB9XG5cbiAgICBuID0gaztcbiAgICB3aGlsZSAoKHcgJiAxKSA9PSAwKSB7XG4gICAgICB3ID4+PSAxO1xuICAgICAgLS1uO1xuICAgIH1cbiAgICBpZiAoKGkgLT0gbikgPCAwKSB7XG4gICAgICBpICs9IHRoaXMuREI7XG4gICAgICAtLWo7XG4gICAgfVxuICAgIGlmIChpczEpIHsgIC8vIHJldCA9PSAxLCBkb24ndCBib3RoZXIgc3F1YXJpbmcgb3IgbXVsdGlwbHlpbmcgaXRcbiAgICAgIGdbd10uY29weVRvKHIpO1xuICAgICAgaXMxID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlIChuID4gMSkge1xuICAgICAgICB6LnNxclRvKHIsIHIyKTtcbiAgICAgICAgei5zcXJUbyhyMiwgcik7XG4gICAgICAgIG4gLT0gMjtcbiAgICAgIH1cbiAgICAgIGlmIChuID4gMClcbiAgICAgICAgei5zcXJUbyhyLCByMik7XG4gICAgICBlbHNlIHtcbiAgICAgICAgdCA9IHI7XG4gICAgICAgIHIgPSByMjtcbiAgICAgICAgcjIgPSB0O1xuICAgICAgfVxuICAgICAgei5tdWxUbyhyMiwgZ1t3XSwgcik7XG4gICAgfVxuXG4gICAgd2hpbGUgKGogPj0gMCAmJiAoZVtqXSAmICgxIDw8IGkpKSA9PSAwKSB7XG4gICAgICB6LnNxclRvKHIsIHIyKTtcbiAgICAgIHQgPSByO1xuICAgICAgciA9IHIyO1xuICAgICAgcjIgPSB0O1xuICAgICAgaWYgKC0taSA8IDApIHtcbiAgICAgICAgaSA9IHRoaXMuREIgLSAxO1xuICAgICAgICAtLWo7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB6LnJldmVydChyKTtcbn1cblxuLy8gKHB1YmxpYykgZ2NkKHRoaXMsYSkgKEhBQyAxNC41NClcbmZ1bmN0aW9uIGJuR0NEKGEpIHtcbiAgdmFyIHggPSAodGhpcy5zIDwgMCkgPyB0aGlzLm5lZ2F0ZSgpIDogdGhpcy5jbG9uZSgpO1xuICB2YXIgeSA9IChhLnMgPCAwKSA/IGEubmVnYXRlKCkgOiBhLmNsb25lKCk7XG4gIGlmICh4LmNvbXBhcmVUbyh5KSA8IDApIHtcbiAgICB2YXIgdCA9IHg7XG4gICAgeCA9IHk7XG4gICAgeSA9IHQ7XG4gIH1cbiAgdmFyIGkgPSB4LmdldExvd2VzdFNldEJpdCgpLCBnID0geS5nZXRMb3dlc3RTZXRCaXQoKTtcbiAgaWYgKGcgPCAwKSByZXR1cm4geDtcbiAgaWYgKGkgPCBnKSBnID0gaTtcbiAgaWYgKGcgPiAwKSB7XG4gICAgeC5yU2hpZnRUbyhnLCB4KTtcbiAgICB5LnJTaGlmdFRvKGcsIHkpO1xuICB9XG4gIHdoaWxlICh4LnNpZ251bSgpID4gMCkge1xuICAgIGlmICgoaSA9IHguZ2V0TG93ZXN0U2V0Qml0KCkpID4gMCkgeC5yU2hpZnRUbyhpLCB4KTtcbiAgICBpZiAoKGkgPSB5LmdldExvd2VzdFNldEJpdCgpKSA+IDApIHkuclNoaWZ0VG8oaSwgeSk7XG4gICAgaWYgKHguY29tcGFyZVRvKHkpID49IDApIHtcbiAgICAgIHguc3ViVG8oeSwgeCk7XG4gICAgICB4LnJTaGlmdFRvKDEsIHgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB5LnN1YlRvKHgsIHkpO1xuICAgICAgeS5yU2hpZnRUbygxLCB5KTtcbiAgICB9XG4gIH1cbiAgaWYgKGcgPiAwKSB5LmxTaGlmdFRvKGcsIHkpO1xuICByZXR1cm4geTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyAlIG4sIG4gPCAyXjI2XG5mdW5jdGlvbiBibnBNb2RJbnQobikge1xuICBpZiAobiA8PSAwKSByZXR1cm4gMDtcbiAgdmFyIGQgPSB0aGlzLkRWICUgbiwgciA9ICh0aGlzLnMgPCAwKSA/IG4gLSAxIDogMDtcbiAgaWYgKHRoaXMudCA+IDApXG4gICAgaWYgKGQgPT0gMClcbiAgICAgIHIgPSB0aGlzWzBdICUgbjtcbiAgICBlbHNlXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50IC0gMTsgaSA+PSAwOyAtLWkpIHIgPSAoZCAqIHIgKyB0aGlzW2ldKSAlIG47XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSAxL3RoaXMgJSBtIChIQUMgMTQuNjEpXG5mdW5jdGlvbiBibk1vZEludmVyc2UobSkge1xuICB2YXIgYWMgPSBtLmlzRXZlbigpO1xuICBpZiAoKHRoaXMuaXNFdmVuKCkgJiYgYWMpIHx8IG0uc2lnbnVtKCkgPT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVSTztcbiAgdmFyIHUgPSBtLmNsb25lKCksIHYgPSB0aGlzLmNsb25lKCk7XG4gIHZhciBhID0gbmJ2KDEpLCBiID0gbmJ2KDApLCBjID0gbmJ2KDApLCBkID0gbmJ2KDEpO1xuICB3aGlsZSAodS5zaWdudW0oKSAhPSAwKSB7XG4gICAgd2hpbGUgKHUuaXNFdmVuKCkpIHtcbiAgICAgIHUuclNoaWZ0VG8oMSwgdSk7XG4gICAgICBpZiAoYWMpIHtcbiAgICAgICAgaWYgKCFhLmlzRXZlbigpIHx8ICFiLmlzRXZlbigpKSB7XG4gICAgICAgICAgYS5hZGRUbyh0aGlzLCBhKTtcbiAgICAgICAgICBiLnN1YlRvKG0sIGIpO1xuICAgICAgICB9XG4gICAgICAgIGEuclNoaWZ0VG8oMSwgYSk7XG4gICAgICB9IGVsc2UgaWYgKCFiLmlzRXZlbigpKVxuICAgICAgICBiLnN1YlRvKG0sIGIpO1xuICAgICAgYi5yU2hpZnRUbygxLCBiKTtcbiAgICB9XG4gICAgd2hpbGUgKHYuaXNFdmVuKCkpIHtcbiAgICAgIHYuclNoaWZ0VG8oMSwgdik7XG4gICAgICBpZiAoYWMpIHtcbiAgICAgICAgaWYgKCFjLmlzRXZlbigpIHx8ICFkLmlzRXZlbigpKSB7XG4gICAgICAgICAgYy5hZGRUbyh0aGlzLCBjKTtcbiAgICAgICAgICBkLnN1YlRvKG0sIGQpO1xuICAgICAgICB9XG4gICAgICAgIGMuclNoaWZ0VG8oMSwgYyk7XG4gICAgICB9IGVsc2UgaWYgKCFkLmlzRXZlbigpKVxuICAgICAgICBkLnN1YlRvKG0sIGQpO1xuICAgICAgZC5yU2hpZnRUbygxLCBkKTtcbiAgICB9XG4gICAgaWYgKHUuY29tcGFyZVRvKHYpID49IDApIHtcbiAgICAgIHUuc3ViVG8odiwgdSk7XG4gICAgICBpZiAoYWMpIGEuc3ViVG8oYywgYSk7XG4gICAgICBiLnN1YlRvKGQsIGIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2LnN1YlRvKHUsIHYpO1xuICAgICAgaWYgKGFjKSBjLnN1YlRvKGEsIGMpO1xuICAgICAgZC5zdWJUbyhiLCBkKTtcbiAgICB9XG4gIH1cbiAgaWYgKHYuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSAhPSAwKSByZXR1cm4gQmlnSW50ZWdlci5aRVJPO1xuICBpZiAoZC5jb21wYXJlVG8obSkgPj0gMCkgcmV0dXJuIGQuc3VidHJhY3QobSk7XG4gIGlmIChkLnNpZ251bSgpIDwgMClcbiAgICBkLmFkZFRvKG0sIGQpO1xuICBlbHNlXG4gICAgcmV0dXJuIGQ7XG4gIGlmIChkLnNpZ251bSgpIDwgMClcbiAgICByZXR1cm4gZC5hZGQobSk7XG4gIGVsc2VcbiAgICByZXR1cm4gZDtcbn1cblxudmFyIGxvd3ByaW1lcyA9IFtcbiAgMiwgICAzLCAgIDUsICAgNywgICAxMSwgIDEzLCAgMTcsICAxOSwgIDIzLCAgMjksICAzMSwgIDM3LCAgNDEsICA0MyxcbiAgNDcsICA1MywgIDU5LCAgNjEsICA2NywgIDcxLCAgNzMsICA3OSwgIDgzLCAgODksICA5NywgIDEwMSwgMTAzLCAxMDcsXG4gIDEwOSwgMTEzLCAxMjcsIDEzMSwgMTM3LCAxMzksIDE0OSwgMTUxLCAxNTcsIDE2MywgMTY3LCAxNzMsIDE3OSwgMTgxLFxuICAxOTEsIDE5MywgMTk3LCAxOTksIDIxMSwgMjIzLCAyMjcsIDIyOSwgMjMzLCAyMzksIDI0MSwgMjUxLCAyNTcsIDI2MyxcbiAgMjY5LCAyNzEsIDI3NywgMjgxLCAyODMsIDI5MywgMzA3LCAzMTEsIDMxMywgMzE3LCAzMzEsIDMzNywgMzQ3LCAzNDksXG4gIDM1MywgMzU5LCAzNjcsIDM3MywgMzc5LCAzODMsIDM4OSwgMzk3LCA0MDEsIDQwOSwgNDE5LCA0MjEsIDQzMSwgNDMzLFxuICA0MzksIDQ0MywgNDQ5LCA0NTcsIDQ2MSwgNDYzLCA0NjcsIDQ3OSwgNDg3LCA0OTEsIDQ5OSwgNTAzLCA1MDksIDUyMSxcbiAgNTIzLCA1NDEsIDU0NywgNTU3LCA1NjMsIDU2OSwgNTcxLCA1NzcsIDU4NywgNTkzLCA1OTksIDYwMSwgNjA3LCA2MTMsXG4gIDYxNywgNjE5LCA2MzEsIDY0MSwgNjQzLCA2NDcsIDY1MywgNjU5LCA2NjEsIDY3MywgNjc3LCA2ODMsIDY5MSwgNzAxLFxuICA3MDksIDcxOSwgNzI3LCA3MzMsIDczOSwgNzQzLCA3NTEsIDc1NywgNzYxLCA3NjksIDc3MywgNzg3LCA3OTcsIDgwOSxcbiAgODExLCA4MjEsIDgyMywgODI3LCA4MjksIDgzOSwgODUzLCA4NTcsIDg1OSwgODYzLCA4NzcsIDg4MSwgODgzLCA4ODcsXG4gIDkwNywgOTExLCA5MTksIDkyOSwgOTM3LCA5NDEsIDk0NywgOTUzLCA5NjcsIDk3MSwgOTc3LCA5ODMsIDk5MSwgOTk3XG5dO1xudmFyIGxwbGltID0gKDEgPDwgMjYpIC8gbG93cHJpbWVzW2xvd3ByaW1lcy5sZW5ndGggLSAxXTtcblxuLy8gKHB1YmxpYykgdGVzdCBwcmltYWxpdHkgd2l0aCBjZXJ0YWludHkgPj0gMS0uNV50XG5mdW5jdGlvbiBibklzUHJvYmFibGVQcmltZSh0KSB7XG4gIHZhciBpLCB4ID0gdGhpcy5hYnMoKTtcbiAgaWYgKHgudCA9PSAxICYmIHhbMF0gPD0gbG93cHJpbWVzW2xvd3ByaW1lcy5sZW5ndGggLSAxXSkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsb3dwcmltZXMubGVuZ3RoOyArK2kpXG4gICAgICBpZiAoeFswXSA9PSBsb3dwcmltZXNbaV0pIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoeC5pc0V2ZW4oKSkgcmV0dXJuIGZhbHNlO1xuICBpID0gMTtcbiAgd2hpbGUgKGkgPCBsb3dwcmltZXMubGVuZ3RoKSB7XG4gICAgdmFyIG0gPSBsb3dwcmltZXNbaV0sIGogPSBpICsgMTtcbiAgICB3aGlsZSAoaiA8IGxvd3ByaW1lcy5sZW5ndGggJiYgbSA8IGxwbGltKSBtICo9IGxvd3ByaW1lc1tqKytdO1xuICAgIG0gPSB4Lm1vZEludChtKTtcbiAgICB3aGlsZSAoaSA8IGopXG4gICAgICBpZiAobSAlIGxvd3ByaW1lc1tpKytdID09IDApIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4geC5taWxsZXJSYWJpbih0KTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdHJ1ZSBpZiBwcm9iYWJseSBwcmltZSAoSEFDIDQuMjQsIE1pbGxlci1SYWJpbilcbmZ1bmN0aW9uIGJucE1pbGxlclJhYmluKHQpIHtcbiAgdmFyIG4xID0gdGhpcy5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7XG4gIHZhciBrID0gbjEuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gIGlmIChrIDw9IDApIHJldHVybiBmYWxzZTtcbiAgdmFyIHIgPSBuMS5zaGlmdFJpZ2h0KGspO1xuICB0ID0gKHQgKyAxKSA+PiAxO1xuICBpZiAodCA+IGxvd3ByaW1lcy5sZW5ndGgpIHQgPSBsb3dwcmltZXMubGVuZ3RoO1xuICB2YXIgYSA9IG5iaSgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHQ7ICsraSkge1xuICAgIC8vIFBpY2sgYmFzZXMgYXQgcmFuZG9tLCBpbnN0ZWFkIG9mIHN0YXJ0aW5nIGF0IDJcbiAgICBhLmZyb21JbnQobG93cHJpbWVzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGxvd3ByaW1lcy5sZW5ndGgpXSk7XG4gICAgdmFyIHkgPSBhLm1vZFBvdyhyLCB0aGlzKTtcbiAgICBpZiAoeS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpICE9IDAgJiYgeS5jb21wYXJlVG8objEpICE9IDApIHtcbiAgICAgIHZhciBqID0gMTtcbiAgICAgIHdoaWxlIChqKysgPCBrICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICAgIHkgPSB5Lm1vZFBvd0ludCgyLCB0aGlzKTtcbiAgICAgICAgaWYgKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSA9PSAwKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoeS5jb21wYXJlVG8objEpICE9IDApIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIHByb3RlY3RlZFxuQmlnSW50ZWdlci5wcm90b3R5cGUuY2h1bmtTaXplID0gYm5wQ2h1bmtTaXplO1xuQmlnSW50ZWdlci5wcm90b3R5cGUudG9SYWRpeCA9IGJucFRvUmFkaXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tUmFkaXggPSBibnBGcm9tUmFkaXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tTnVtYmVyID0gYm5wRnJvbU51bWJlcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJpdHdpc2VUbyA9IGJucEJpdHdpc2VUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNoYW5nZUJpdCA9IGJucENoYW5nZUJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFkZFRvID0gYm5wQWRkVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kTXVsdGlwbHkgPSBibnBETXVsdGlwbHk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kQWRkT2Zmc2V0ID0gYm5wREFkZE9mZnNldDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5TG93ZXJUbyA9IGJucE11bHRpcGx5TG93ZXJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5VXBwZXJUbyA9IGJucE11bHRpcGx5VXBwZXJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludCA9IGJucE1vZEludDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1pbGxlclJhYmluID0gYm5wTWlsbGVyUmFiaW47XG5cbi8vIHB1YmxpY1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xvbmUgPSBibkNsb25lO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaW50VmFsdWUgPSBibkludFZhbHVlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYnl0ZVZhbHVlID0gYm5CeXRlVmFsdWU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaG9ydFZhbHVlID0gYm5TaG9ydFZhbHVlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2lnbnVtID0gYm5TaWdOdW07XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50b0J5dGVBcnJheSA9IGJuVG9CeXRlQXJyYXk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5lcXVhbHMgPSBibkVxdWFscztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1pbiA9IGJuTWluO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubWF4ID0gYm5NYXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQgPSBibkFuZDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm9yID0gYm5PcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnhvciA9IGJuWG9yO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYW5kTm90ID0gYm5BbmROb3Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5ub3QgPSBibk5vdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0TGVmdCA9IGJuU2hpZnRMZWZ0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRSaWdodCA9IGJuU2hpZnRSaWdodDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmdldExvd2VzdFNldEJpdCA9IGJuR2V0TG93ZXN0U2V0Qml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYml0Q291bnQgPSBibkJpdENvdW50O1xuQmlnSW50ZWdlci5wcm90b3R5cGUudGVzdEJpdCA9IGJuVGVzdEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNldEJpdCA9IGJuU2V0Qml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xlYXJCaXQgPSBibkNsZWFyQml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZmxpcEJpdCA9IGJuRmxpcEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFkZCA9IGJuQWRkO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3QgPSBiblN1YnRyYWN0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHkgPSBibk11bHRpcGx5O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2aWRlID0gYm5EaXZpZGU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5yZW1haW5kZXIgPSBiblJlbWFpbmRlcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZUFuZFJlbWFpbmRlciA9IGJuRGl2aWRlQW5kUmVtYWluZGVyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93ID0gYm5Nb2RQb3c7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnZlcnNlID0gYm5Nb2RJbnZlcnNlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUucG93ID0gYm5Qb3c7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5nY2QgPSBibkdDRDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZSA9IGJuSXNQcm9iYWJsZVByaW1lO1xuXG4vLyBKU0JOLXNwZWNpZmljIGV4dGVuc2lvblxuQmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlID0gYm5TcXVhcmU7XG5cbi8vIEJpZ0ludGVnZXIgaW50ZXJmYWNlcyBub3QgaW1wbGVtZW50ZWQgaW4ganNibjpcblxuLy8gQmlnSW50ZWdlcihpbnQgc2lnbnVtLCBieXRlW10gbWFnbml0dWRlKVxuLy8gZG91YmxlIGRvdWJsZVZhbHVlKClcbi8vIGZsb2F0IGZsb2F0VmFsdWUoKVxuLy8gaW50IGhhc2hDb2RlKClcbi8vIGxvbmcgbG9uZ1ZhbHVlKClcbi8vIHN0YXRpYyBCaWdJbnRlZ2VyIHZhbHVlT2YobG9uZyB2YWwpXG5cbi8vIERlcGVuZHMgb24ganNibi5qcyBhbmQgcm5nLmpzXG5cbi8vIFZlcnNpb24gMS4xOiBzdXBwb3J0IHV0Zi04IGVuY29kaW5nIGluIHBrY3MxcGFkMlxuXG4vLyBjb252ZXJ0IGEgKGhleCkgc3RyaW5nIHRvIGEgYmlnbnVtIG9iamVjdFxuZnVuY3Rpb24gcGFyc2VCaWdJbnQoc3RyLCByKSB7XG4gIHJldHVybiBuZXcgQmlnSW50ZWdlcihzdHIsIHIpO1xufVxuXG5mdW5jdGlvbiBsaW5lYnJrKHMsIG4pIHtcbiAgdmFyIHJldCA9ICcnO1xuICB2YXIgaSA9IDA7XG4gIHdoaWxlIChpICsgbiA8IHMubGVuZ3RoKSB7XG4gICAgcmV0ICs9IHMuc3Vic3RyaW5nKGksIGkgKyBuKSArICdcXG4nO1xuICAgIGkgKz0gbjtcbiAgfVxuICByZXR1cm4gcmV0ICsgcy5zdWJzdHJpbmcoaSwgcy5sZW5ndGgpO1xufVxuXG5mdW5jdGlvbiBieXRlMkhleChiKSB7XG4gIGlmIChiIDwgMHgxMClcbiAgICByZXR1cm4gJzAnICsgYi50b1N0cmluZygxNik7XG4gIGVsc2VcbiAgICByZXR1cm4gYi50b1N0cmluZygxNik7XG59XG5cbi8vIFBLQ1MjMSAodHlwZSAyLCByYW5kb20pIHBhZCBpbnB1dCBzdHJpbmcgcyB0byBuIGJ5dGVzLCBhbmQgcmV0dXJuIGEgYmlnaW50XG5mdW5jdGlvbiBwa2NzMXBhZDIocywgbikge1xuICBpZiAobiA8IHMubGVuZ3RoICsgMTEpIHsgIC8vIFRPRE86IGZpeCBmb3IgdXRmLThcbiAgICBhbGVydCgnTWVzc2FnZSB0b28gbG9uZyBmb3IgUlNBJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmFyIGJhID0gbmV3IEFycmF5KCk7XG4gIHZhciBpID0gcy5sZW5ndGggLSAxO1xuICB3aGlsZSAoaSA+PSAwICYmIG4gPiAwKSB7XG4gICAgdmFyIGMgPSBzLmNoYXJDb2RlQXQoaS0tKTtcbiAgICBpZiAoYyA8IDEyOCkgeyAgLy8gZW5jb2RlIHVzaW5nIHV0Zi04XG4gICAgICBiYVstLW5dID0gYztcbiAgICB9IGVsc2UgaWYgKChjID4gMTI3KSAmJiAoYyA8IDIwNDgpKSB7XG4gICAgICBiYVstLW5dID0gKGMgJiA2MykgfCAxMjg7XG4gICAgICBiYVstLW5dID0gKGMgPj4gNikgfCAxOTI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhWy0tbl0gPSAoYyAmIDYzKSB8IDEyODtcbiAgICAgIGJhWy0tbl0gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XG4gICAgICBiYVstLW5dID0gKGMgPj4gMTIpIHwgMjI0O1xuICAgIH1cbiAgfVxuICBiYVstLW5dID0gMDtcbiAgdmFyIHJuZyA9IG5ldyBTZWN1cmVSYW5kb20oKTtcbiAgdmFyIHggPSBuZXcgQXJyYXkoKTtcbiAgd2hpbGUgKG4gPiAyKSB7ICAvLyByYW5kb20gbm9uLXplcm8gcGFkXG4gICAgeFswXSA9IDA7XG4gICAgd2hpbGUgKHhbMF0gPT0gMCkgcm5nLm5leHRCeXRlcyh4KTtcbiAgICBiYVstLW5dID0geFswXTtcbiAgfVxuICBiYVstLW5dID0gMjtcbiAgYmFbLS1uXSA9IDA7XG4gIHJldHVybiBuZXcgQmlnSW50ZWdlcihiYSk7XG59XG5cbi8vIFwiZW1wdHlcIiBSU0Ega2V5IGNvbnN0cnVjdG9yXG5mdW5jdGlvbiBSU0FLZXkoKSB7XG4gIHRoaXMubiA9IG51bGw7XG4gIHRoaXMuZSA9IDA7XG4gIHRoaXMuZCA9IG51bGw7XG4gIHRoaXMucCA9IG51bGw7XG4gIHRoaXMucSA9IG51bGw7XG4gIHRoaXMuZG1wMSA9IG51bGw7XG4gIHRoaXMuZG1xMSA9IG51bGw7XG4gIHRoaXMuY29lZmYgPSBudWxsO1xufVxuXG4vLyBTZXQgdGhlIHB1YmxpYyBrZXkgZmllbGRzIE4gYW5kIGUgZnJvbSBoZXggc3RyaW5nc1xuZnVuY3Rpb24gUlNBU2V0UHVibGljKE4sIEUpIHtcbiAgaWYgKE4gIT0gbnVsbCAmJiBFICE9IG51bGwgJiYgTi5sZW5ndGggPiAwICYmIEUubGVuZ3RoID4gMCkge1xuICAgIHRoaXMubiA9IHBhcnNlQmlnSW50KE4sIDE2KTtcbiAgICB0aGlzLmUgPSBwYXJzZUludChFLCAxNik7XG4gIH0gZWxzZVxuICAgIGFsZXJ0KCdJbnZhbGlkIFJTQSBwdWJsaWMga2V5Jyk7XG59XG5cbi8vIFNldCB0aGUgcHJpdmF0ZSBrZXkgZmllbGRzIE4sIGUsIGQgYW5kIENSVCBwYXJhbXMgZnJvbSBoZXggc3RyaW5nc1xuZnVuY3Rpb24gUlNBU2V0UHJpdmF0ZUV4KE4sRSxELFAsUSxEUCxEUSxDKSB7XG4gICAgaWYoTiAhPSBudWxsICYmIEUgIT0gbnVsbCAmJiBOLmxlbmd0aCA+IDAgJiYgRS5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLm4gPSBwYXJzZUJpZ0ludChOLDE2KTtcbiAgICAgIHRoaXMuZSA9IHBhcnNlSW50KEUsMTYpO1xuICAgICAgdGhpcy5kID0gcGFyc2VCaWdJbnQoRCwxNik7XG4gICAgICB0aGlzLnAgPSBwYXJzZUJpZ0ludChQLDE2KTtcbiAgICAgIHRoaXMucSA9IHBhcnNlQmlnSW50KFEsMTYpO1xuICAgICAgdGhpcy5kbXAxID0gcGFyc2VCaWdJbnQoRFAsMTYpO1xuICAgICAgdGhpcy5kbXExID0gcGFyc2VCaWdJbnQoRFEsMTYpO1xuICAgICAgdGhpcy5jb2VmZiA9IHBhcnNlQmlnSW50KEMsMTYpO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICBhbGVydChcIkludmFsaWQgUlNBIHByaXZhdGUga2V5XCIpO1xuICB9XG5cbi8vIFBlcmZvcm0gcmF3IHByaXZhdGUgb3BlcmF0aW9uIG9uIFwieFwiOiByZXR1cm4geF5kIChtb2QgbilcbmZ1bmN0aW9uIFJTQURvUHJpdmF0ZSh4KSB7XG4gIGlmKHRoaXMucCA9PSBudWxsIHx8IHRoaXMucSA9PSBudWxsKVxuICAgIHJldHVybiB4Lm1vZFBvdyh0aGlzLmQsIHRoaXMubik7XG5cbiAgLy8gVE9ETzogcmUtY2FsY3VsYXRlIGFueSBtaXNzaW5nIENSVCBwYXJhbXNcbiAgdmFyIHhwID0geC5tb2QodGhpcy5wKS5tb2RQb3codGhpcy5kbXAxLCB0aGlzLnApO1xuICB2YXIgeHEgPSB4Lm1vZCh0aGlzLnEpLm1vZFBvdyh0aGlzLmRtcTEsIHRoaXMucSk7XG5cbiAgd2hpbGUoeHAuY29tcGFyZVRvKHhxKSA8IDApXG4gICAgeHAgPSB4cC5hZGQodGhpcy5wKTtcbiAgcmV0dXJuIHhwLnN1YnRyYWN0KHhxKS5tdWx0aXBseSh0aGlzLmNvZWZmKS5tb2QodGhpcy5wKS5tdWx0aXBseSh0aGlzLnEpLmFkZCh4cSk7XG59XG5cbi8vIFBlcmZvcm0gcmF3IHB1YmxpYyBvcGVyYXRpb24gb24gXCJ4XCI6IHJldHVybiB4XmUgKG1vZCBuKVxuZnVuY3Rpb24gUlNBRG9QdWJsaWMoeCkge1xuICByZXR1cm4geC5tb2RQb3dJbnQodGhpcy5lLCB0aGlzLm4pO1xufVxuXG4vLyBSZXR1cm4gdGhlIFBLQ1MjMSBSU0EgZW5jcnlwdGlvbiBvZiBcInRleHRcIiBhcyBhbiBldmVuLWxlbmd0aCBoZXggc3RyaW5nXG5mdW5jdGlvbiBSU0FFbmNyeXB0KHRleHQpIHtcbiAgdmFyIG0gPSBwa2NzMXBhZDIodGV4dCwgKHRoaXMubi5iaXRMZW5ndGgoKSArIDcpID4+IDMpO1xuICBpZiAobSA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgdmFyIGMgPSB0aGlzLmRvUHVibGljKG0pO1xuICBpZiAoYyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgdmFyIGggPSBjLnRvU3RyaW5nKDE2KTtcbiAgaWYgKChoLmxlbmd0aCAmIDEpID09IDApXG4gICAgcmV0dXJuIGg7XG4gIGVsc2VcbiAgICByZXR1cm4gJzAnICsgaDtcbn1cblxuLy8gUmV0dXJuIHRoZSBQS0NTIzEgUlNBIGVuY3J5cHRpb24gb2YgXCJ0ZXh0XCIgYXMgYSBCYXNlNjQtZW5jb2RlZCBzdHJpbmdcbi8vIGZ1bmN0aW9uIFJTQUVuY3J5cHRCNjQodGV4dCkge1xuLy8gIHZhciBoID0gdGhpcy5lbmNyeXB0KHRleHQpO1xuLy8gIGlmKGgpIHJldHVybiBoZXgyYjY0KGgpOyBlbHNlIHJldHVybiBudWxsO1xuLy99XG5cbi8vIHByb3RlY3RlZFxuUlNBS2V5LnByb3RvdHlwZS5kb1B1YmxpYyA9IFJTQURvUHVibGljO1xuXG4vLyBwdWJsaWNcblJTQUtleS5wcm90b3R5cGUuZG9Qcml2YXRlID0gUlNBRG9Qcml2YXRlO1xuUlNBS2V5LnByb3RvdHlwZS5zZXRQdWJsaWMgPSBSU0FTZXRQdWJsaWM7XG5SU0FLZXkucHJvdG90eXBlLnNldFByaXZhdGVFeCA9IFJTQVNldFByaXZhdGVFeDtcblJTQUtleS5wcm90b3R5cGUuZW5jcnlwdCA9IFJTQUVuY3J5cHQ7XG4vLyBSU0FLZXkucHJvdG90eXBlLmVuY3J5cHRfYjY0ID0gUlNBRW5jcnlwdEI2NDtcblxuLy8gUmFuZG9tIG51bWJlciBnZW5lcmF0b3IgLSByZXF1aXJlcyBhIFBSTkcgYmFja2VuZCwgZS5nLiBwcm5nNC5qc1xuXG4vLyBGb3IgYmVzdCByZXN1bHRzLCBwdXQgY29kZSBsaWtlXG4vLyA8Ym9keSBvbkNsaWNrPSdybmdfc2VlZF90aW1lKCk7JyBvbktleVByZXNzPSdybmdfc2VlZF90aW1lKCk7Jz5cbi8vIGluIHlvdXIgbWFpbiBIVE1MIGRvY3VtZW50LlxuXG52YXIgcm5nX3N0YXRlO1xudmFyIHJuZ19wb29sO1xudmFyIHJuZ19wcHRyO1xuXG4vLyBNaXggaW4gYSAzMi1iaXQgaW50ZWdlciBpbnRvIHRoZSBwb29sXG5mdW5jdGlvbiBybmdfc2VlZF9pbnQoeCkge1xuICBybmdfcG9vbFtybmdfcHB0cisrXSBePSB4ICYgMjU1O1xuICBybmdfcG9vbFtybmdfcHB0cisrXSBePSAoeCA+PiA4KSAmIDI1NTtcbiAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gXj0gKHggPj4gMTYpICYgMjU1O1xuICBybmdfcG9vbFtybmdfcHB0cisrXSBePSAoeCA+PiAyNCkgJiAyNTU7XG4gIGlmIChybmdfcHB0ciA+PSBybmdfcHNpemUpIHJuZ19wcHRyIC09IHJuZ19wc2l6ZTtcbn1cblxuLy8gTWl4IGluIHRoZSBjdXJyZW50IHRpbWUgKHcvbWlsbGlzZWNvbmRzKSBpbnRvIHRoZSBwb29sXG5mdW5jdGlvbiBybmdfc2VlZF90aW1lKCkge1xuICBybmdfc2VlZF9pbnQobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xufVxuXG4vLyBJbml0aWFsaXplIHRoZSBwb29sIHdpdGgganVuayBpZiBuZWVkZWQuXG5pZiAocm5nX3Bvb2wgPT0gbnVsbCkge1xuICBybmdfcG9vbCA9IG5ldyBBcnJheSgpO1xuICBybmdfcHB0ciA9IDA7XG4gIHZhciB0O1xuICBpZiAoaW5Ccm93c2VyICYmIHdpbmRvdy5jcnlwdG8gJiYgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMpIHtcbiAgICAvLyBVc2Ugd2ViY3J5cHRvIGlmIGF2YWlsYWJsZVxuICAgIHZhciB1YSA9IG5ldyBVaW50OEFycmF5KDMyKTtcbiAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyh1YSk7XG4gICAgZm9yICh0ID0gMDsgdCA8IDMyOyArK3QpIHJuZ19wb29sW3JuZ19wcHRyKytdID0gdWFbdF07XG4gIH1cbiAgaWYgKGluQnJvd3NlciAmJiBuYXZpZ2F0b3IuYXBwTmFtZSA9PSAnTmV0c2NhcGUnICYmXG4gICAgICBuYXZpZ2F0b3IuYXBwVmVyc2lvbiA8ICc1JyAmJiB3aW5kb3cuY3J5cHRvKSB7XG4gICAgLy8gRXh0cmFjdCBlbnRyb3B5ICgyNTYgYml0cykgZnJvbSBOUzQgUk5HIGlmIGF2YWlsYWJsZVxuICAgIHZhciB6ID0gd2luZG93LmNyeXB0by5yYW5kb20oMzIpO1xuICAgIGZvciAodCA9IDA7IHQgPCB6Lmxlbmd0aDsgKyt0KSBybmdfcG9vbFtybmdfcHB0cisrXSA9IHouY2hhckNvZGVBdCh0KSAmIDI1NTtcbiAgfVxuICB3aGlsZSAocm5nX3BwdHIgPCBybmdfcHNpemUpIHsgIC8vIGV4dHJhY3Qgc29tZSByYW5kb21uZXNzIGZyb20gTWF0aC5yYW5kb20oKVxuICAgIHQgPSBNYXRoLmZsb29yKDY1NTM2ICogTWF0aC5yYW5kb20oKSk7XG4gICAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSB0ID4+PiA4O1xuICAgIHJuZ19wb29sW3JuZ19wcHRyKytdID0gdCAmIDI1NTtcbiAgfVxuICBybmdfcHB0ciA9IDA7XG4gIHJuZ19zZWVkX3RpbWUoKTtcbiAgLy8gcm5nX3NlZWRfaW50KHdpbmRvdy5zY3JlZW5YKTtcbiAgLy8gcm5nX3NlZWRfaW50KHdpbmRvdy5zY3JlZW5ZKTtcbn1cblxuZnVuY3Rpb24gcm5nX2dldF9ieXRlKCkge1xuICBpZiAocm5nX3N0YXRlID09IG51bGwpIHtcbiAgICBybmdfc2VlZF90aW1lKCk7XG4gICAgcm5nX3N0YXRlID0gcHJuZ19uZXdzdGF0ZSgpO1xuICAgIHJuZ19zdGF0ZS5pbml0KHJuZ19wb29sKTtcbiAgICBmb3IgKHJuZ19wcHRyID0gMDsgcm5nX3BwdHIgPCBybmdfcG9vbC5sZW5ndGg7ICsrcm5nX3BwdHIpXG4gICAgICBybmdfcG9vbFtybmdfcHB0cl0gPSAwO1xuICAgIHJuZ19wcHRyID0gMDtcbiAgICAvLyBybmdfcG9vbCA9IG51bGw7XG4gIH1cbiAgLy8gVE9ETzogYWxsb3cgcmVzZWVkaW5nIGFmdGVyIGZpcnN0IHJlcXVlc3RcbiAgcmV0dXJuIHJuZ19zdGF0ZS5uZXh0KCk7XG59XG5cbmZ1bmN0aW9uIHJuZ19nZXRfYnl0ZXMoYmEpIHtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBiYS5sZW5ndGg7ICsraSkgYmFbaV0gPSBybmdfZ2V0X2J5dGUoKTtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5mdW5jdGlvbiBTZWN1cmVSYW5kb20oKSB7fVxuXG5TZWN1cmVSYW5kb20ucHJvdG90eXBlLm5leHRCeXRlcyA9IHJuZ19nZXRfYnl0ZXM7XG5cbi8vIHBybmc0LmpzIC0gdXNlcyBBcmNmb3VyIGFzIGEgUFJOR1xuXG5mdW5jdGlvbiBBcmNmb3VyKCkge1xuICB0aGlzLmkgPSAwO1xuICB0aGlzLmogPSAwO1xuICB0aGlzLlMgPSBuZXcgQXJyYXkoKTtcbn1cblxuLy8gSW5pdGlhbGl6ZSBhcmNmb3VyIGNvbnRleHQgZnJvbSBrZXksIGFuIGFycmF5IG9mIGludHMsIGVhY2ggZnJvbSBbMC4uMjU1XVxuZnVuY3Rpb24gQVJDNGluaXQoa2V5KSB7XG4gIHZhciBpLCBqLCB0O1xuICBmb3IgKGkgPSAwOyBpIDwgMjU2OyArK2kpIHRoaXMuU1tpXSA9IGk7XG4gIGogPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgICBqID0gKGogKyB0aGlzLlNbaV0gKyBrZXlbaSAlIGtleS5sZW5ndGhdKSAmIDI1NTtcbiAgICB0ID0gdGhpcy5TW2ldO1xuICAgIHRoaXMuU1tpXSA9IHRoaXMuU1tqXTtcbiAgICB0aGlzLlNbal0gPSB0O1xuICB9XG4gIHRoaXMuaSA9IDA7XG4gIHRoaXMuaiA9IDA7XG59XG5cbmZ1bmN0aW9uIEFSQzRuZXh0KCkge1xuICB2YXIgdDtcbiAgdGhpcy5pID0gKHRoaXMuaSArIDEpICYgMjU1O1xuICB0aGlzLmogPSAodGhpcy5qICsgdGhpcy5TW3RoaXMuaV0pICYgMjU1O1xuICB0ID0gdGhpcy5TW3RoaXMuaV07XG4gIHRoaXMuU1t0aGlzLmldID0gdGhpcy5TW3RoaXMual07XG4gIHRoaXMuU1t0aGlzLmpdID0gdDtcbiAgcmV0dXJuIHRoaXMuU1sodCArIHRoaXMuU1t0aGlzLmldKSAmIDI1NV07XG59XG5cbkFyY2ZvdXIucHJvdG90eXBlLmluaXQgPSBBUkM0aW5pdDtcbkFyY2ZvdXIucHJvdG90eXBlLm5leHQgPSBBUkM0bmV4dDtcblxuLy8gUGx1ZyBpbiB5b3VyIFJORyBjb25zdHJ1Y3RvciBoZXJlXG5mdW5jdGlvbiBwcm5nX25ld3N0YXRlKCkge1xuICByZXR1cm4gbmV3IEFyY2ZvdXIoKTtcbn1cblxuLy8gUG9vbCBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0IGFuZCBncmVhdGVyIHRoYW4gMzIuXG4vLyBBbiBhcnJheSBvZiBieXRlcyB0aGUgc2l6ZSBvZiB0aGUgcG9vbCB3aWxsIGJlIHBhc3NlZCB0byBpbml0KClcbnZhciBybmdfcHNpemUgPSAyNTY7XG5cbmlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0ge1xuICAgICAgZGVmYXVsdDogQmlnSW50ZWdlcixcbiAgICAgIEJpZ0ludGVnZXI6IEJpZ0ludGVnZXIsXG4gICAgICBSU0FLZXk6IFJTQUtleSxcbiAgfTtcbn0gZWxzZSB7XG4gIHRoaXMuanNibiA9IHtcbiAgICBCaWdJbnRlZ2VyOiBCaWdJbnRlZ2VyLFxuICAgIFJTQUtleTogUlNBS2V5LFxuICB9O1xufVxuXG59KS5jYWxsKHRoaXMpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMTggVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlZmVyID0gdm9pZCAwO1xuLy8gQ3JlYXRlIGEgcHJvbWlzZSB3aXRoIGV4cG9zZWQgcmVzb2x2ZSBhbmQgcmVqZWN0IGNhbGxiYWNrcy5cbmZ1bmN0aW9uIGRlZmVyKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgbGV0IHJlc29sdmUgPSBudWxsO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgbGV0IHJlamVjdCA9IG51bGw7XG4gICAgY29uc3QgcCA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4gW3Jlc29sdmUsIHJlamVjdF0gPSBbcmVzLCByZWpdKTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHAsIHsgcmVzb2x2ZSwgcmVqZWN0IH0pO1xufVxuZXhwb3J0cy5kZWZlciA9IGRlZmVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlnbm9yZUNhY2hlVW5hY3Rpb25hYmxlRXJyb3JzID0gZXhwb3J0cy5nZXRFcnJvck1lc3NhZ2UgPSB2b2lkIDA7XG4vLyBBdHRlbXB0IHRvIGNvZXJjZSBhbiBlcnJvciBvYmplY3QgaW50byBhIHN0cmluZyBtZXNzYWdlLlxuLy8gU29tZXRpbWVzIGFuIGVycm9yIG1lc3NhZ2UgaXMgd3JhcHBlZCBpbiBhbiBFcnJvciBvYmplY3QsIHNvbWV0aW1lcyBub3QuXG5mdW5jdGlvbiBnZXRFcnJvck1lc3NhZ2UoZSkge1xuICAgIGlmIChlICYmIHR5cGVvZiBlID09PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25zdCBlcnJvck9iamVjdCA9IGU7XG4gICAgICAgIGlmIChlcnJvck9iamVjdC5tZXNzYWdlKSB7IC8vIHJlZ3VsYXIgRXJyb3IgT2JqZWN0XG4gICAgICAgICAgICByZXR1cm4gU3RyaW5nKGVycm9yT2JqZWN0Lm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGVycm9yT2JqZWN0LmVycm9yPy5tZXNzYWdlKSB7IC8vIEFQSSByZXN1bHRcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoZXJyb3JPYmplY3QuZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYXNTdHJpbmcgPSBTdHJpbmcoZSk7XG4gICAgaWYgKGFzU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChzdHJpbmdpZnlFcnJvcikge1xuICAgICAgICAgICAgLy8gaWdub3JlIGZhaWx1cmVzIGFuZCBqdXN0IGZhbGwgdGhyb3VnaFxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhc1N0cmluZztcbn1cbmV4cG9ydHMuZ2V0RXJyb3JNZXNzYWdlID0gZ2V0RXJyb3JNZXNzYWdlO1xuLy8gT2NjYXNpb25hbGx5IG9wZXJhdGlvbnMgdXNpbmcgdGhlIGNhY2hlIEFQSSB0aHJvdzpcbi8vICdVbmtub3duRXJyb3I6IFVuZXhwZWN0ZWQgaW50ZXJuYWwgZXJyb3IuIHt9J1xuLy8gSXQncyBub3QgY2xlYXIgdW5kZXIgd2hpY2ggY2lyY3Vtc3RhbmNlcyB0aGlzIGNhbiBvY2N1ci4gQSBkaXZlIG9mXG4vLyB0aGUgQ2hyb21pdW0gY29kZSBkaWRuJ3Qgc2hlZCBtdWNoIGxpZ2h0OlxuLy8gaHR0cHM6Ly9zb3VyY2UuY2hyb21pdW0ub3JnL2Nocm9taXVtL2Nocm9taXVtL3NyYy8rL21haW46dGhpcmRfcGFydHkvYmxpbmsvcmVuZGVyZXIvbW9kdWxlcy9jYWNoZV9zdG9yYWdlL2NhY2hlX3N0b3JhZ2VfZXJyb3IuY2M7bD0yNjtkcmM9NGNmZTg2NDgyYjAwMGU4NDgwMDkwNzc3ODNiYTM1ZjgzZjNjM2NmZVxuLy8gaHR0cHM6Ly9zb3VyY2UuY2hyb21pdW0ub3JnL2Nocm9taXVtL2Nocm9taXVtL3NyYy8rL21haW46Y29udGVudC9icm93c2VyL2NhY2hlX3N0b3JhZ2UvY2FjaGVfc3RvcmFnZV9jYWNoZS5jYztsPTE2ODY7ZHJjPWFiNjhjMDViZWI3OTBkMDRkMWNiN2ZkOGZhYTBhMTk3ZmI0MGQzOTlcbi8vIEdpdmVuIHRoZSBlcnJvciBpcyBub3QgYWN0aW9uYWJsZSBhdCBwcmVzZW50IGFuZCBjYWNoaW5nIGlzICdiZXN0XG4vLyBlZmZvcnQnIGluIGFueSBjYXNlIGlnbm9yZSB0aGlzIGVycm9yLiBXZSB3aWxsIHdhbnQgdG8gdGhyb3cgZm9yXG4vLyBlcnJvcnMgaW4gZ2VuZXJhbCB0aG91Z2ggc28gYXMgbm90IHRvIGhpZGUgZXJyb3JzIHdlIGFjdHVhbGx5IGNvdWxkXG4vLyBmaXguXG4vLyBTZWUgYi8yMjc3ODU2NjUgZm9yIGFuIGV4YW1wbGUuXG5mdW5jdGlvbiBpZ25vcmVDYWNoZVVuYWN0aW9uYWJsZUVycm9ycyhlLCByZXN1bHQpIHtcbiAgICBpZiAoZ2V0RXJyb3JNZXNzYWdlKGUpLmluY2x1ZGVzKCdVbmtub3duRXJyb3InKSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgZTtcbiAgICB9XG59XG5leHBvcnRzLmlnbm9yZUNhY2hlVW5hY3Rpb25hYmxlRXJyb3JzID0gaWdub3JlQ2FjaGVVbmFjdGlvbmFibGVFcnJvcnM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAxOCBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYXNzZXJ0VW5yZWFjaGFibGUgPSBleHBvcnRzLnJlcG9ydEVycm9yID0gZXhwb3J0cy5zZXRFcnJvckhhbmRsZXIgPSBleHBvcnRzLmFzc2VydEZhbHNlID0gZXhwb3J0cy5hc3NlcnRUcnVlID0gZXhwb3J0cy5hc3NlcnRFeGlzdHMgPSB2b2lkIDA7XG5sZXQgZXJyb3JIYW5kbGVyID0gKF8pID0+IHsgfTtcbmZ1bmN0aW9uIGFzc2VydEV4aXN0cyh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVmFsdWUgZG9lc25cXCd0IGV4aXN0Jyk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmV4cG9ydHMuYXNzZXJ0RXhpc3RzID0gYXNzZXJ0RXhpc3RzO1xuZnVuY3Rpb24gYXNzZXJ0VHJ1ZSh2YWx1ZSwgb3B0TXNnKSB7XG4gICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3Iob3B0TXNnID8/ICdGYWlsZWQgYXNzZXJ0aW9uJyk7XG4gICAgfVxufVxuZXhwb3J0cy5hc3NlcnRUcnVlID0gYXNzZXJ0VHJ1ZTtcbmZ1bmN0aW9uIGFzc2VydEZhbHNlKHZhbHVlLCBvcHRNc2cpIHtcbiAgICBhc3NlcnRUcnVlKCF2YWx1ZSwgb3B0TXNnKTtcbn1cbmV4cG9ydHMuYXNzZXJ0RmFsc2UgPSBhc3NlcnRGYWxzZTtcbmZ1bmN0aW9uIHNldEVycm9ySGFuZGxlcihoYW5kbGVyKSB7XG4gICAgZXJyb3JIYW5kbGVyID0gaGFuZGxlcjtcbn1cbmV4cG9ydHMuc2V0RXJyb3JIYW5kbGVyID0gc2V0RXJyb3JIYW5kbGVyO1xuZnVuY3Rpb24gcmVwb3J0RXJyb3IoZXJyKSB7XG4gICAgbGV0IGVyckxvZyA9ICcnO1xuICAgIGxldCBlcnJvck9iaiA9IHVuZGVmaW5lZDtcbiAgICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3JFdmVudCkge1xuICAgICAgICBlcnJMb2cgPSBlcnIubWVzc2FnZTtcbiAgICAgICAgZXJyb3JPYmogPSBlcnIuZXJyb3I7XG4gICAgfVxuICAgIGVsc2UgaWYgKGVyciBpbnN0YW5jZW9mIFByb21pc2VSZWplY3Rpb25FdmVudCkge1xuICAgICAgICBlcnJMb2cgPSBgJHtlcnIucmVhc29ufWA7XG4gICAgICAgIGVycm9yT2JqID0gZXJyLnJlYXNvbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGVyckxvZyA9IGAke2Vycn1gO1xuICAgIH1cbiAgICBpZiAoZXJyb3JPYmogIT09IHVuZGVmaW5lZCAmJiBlcnJvck9iaiAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBlcnJTdGFjayA9IGVycm9yT2JqLnN0YWNrO1xuICAgICAgICBlcnJMb2cgKz0gJ1xcbic7XG4gICAgICAgIGVyckxvZyArPSBlcnJTdGFjayAhPT0gdW5kZWZpbmVkID8gZXJyU3RhY2sgOiBKU09OLnN0cmluZ2lmeShlcnJvck9iaik7XG4gICAgfVxuICAgIGVyckxvZyArPSAnXFxuXFxuJztcbiAgICBlcnJMb2cgKz0gYFVBOiAke25hdmlnYXRvci51c2VyQWdlbnR9XFxuYDtcbiAgICBjb25zb2xlLmVycm9yKGVyckxvZywgZXJyKTtcbiAgICBlcnJvckhhbmRsZXIoZXJyTG9nKTtcbn1cbmV4cG9ydHMucmVwb3J0RXJyb3IgPSByZXBvcnRFcnJvcjtcbi8vIFRoaXMgZnVuY3Rpb24gc2VydmVzIHR3byBwdXJwb3Nlcy5cbi8vIDEpIEEgcnVudGltZSBjaGVjayAtIGlmIHdlIGFyZSBldmVyIGNhbGxlZCwgd2UgdGhyb3cgYW4gZXhjZXB0aW9uLlxuLy8gVGhpcyBpcyB1c2VmdWwgZm9yIGNoZWNraW5nIHRoYXQgY29kZSB3ZSBzdXNwZWN0IHNob3VsZCBuZXZlciBiZSByZWFjaGVkIGlzXG4vLyBhY3R1YWxseSBuZXZlciByZWFjaGVkLlxuLy8gMikgQSBjb21waWxlIHRpbWUgY2hlY2sgd2hlcmUgdHlwZXNjcmlwdCBhc3NlcnRzIHRoYXQgdGhlIHZhbHVlIHBhc3NlZCBjYW4gYmVcbi8vIGNhc3QgdG8gdGhlIFwibmV2ZXJcIiB0eXBlLlxuLy8gVGhpcyBpcyB1c2VmdWwgZm9yIGVuc3VyaW5nIHdlIGV4aGFzdGl2ZWx5IGNoZWNrIHVuaW9uIHR5cGVzLlxuZnVuY3Rpb24gYXNzZXJ0VW5yZWFjaGFibGUoX3gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgY29kZSBzaG91bGQgbm90IGJlIHJlYWNoYWJsZScpO1xufVxuZXhwb3J0cy5hc3NlcnRVbnJlYWNoYWJsZSA9IGFzc2VydFVucmVhY2hhYmxlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjMgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlzRW51bVZhbHVlID0gZXhwb3J0cy5pc1N0cmluZyA9IGV4cG9ydHMuc2hhbGxvd0VxdWFscyA9IGV4cG9ydHMubG9va3VwUGF0aCA9IHZvaWQgMDtcbi8vIEdpdmVuIGFuIG9iamVjdCwgcmV0dXJuIGEgcmVmIHRvIHRoZSBvYmplY3Qgb3IgaXRlbSBhdCBhdCBhIGdpdmVuIHBhdGguXG4vLyBBIHBhdGggaXMgZGVmaW5lZCB1c2luZyBhbiBhcnJheSBvZiBwYXRoLWxpa2UgZWxlbWVudHM6IEkuZS4gW3N0cmluZ3xudW1iZXJdLlxuLy8gUmV0dXJucyB1bmRlZmluZWQgaWYgdGhlIHBhdGggZG9lc24ndCBleGlzdC5cbi8vIE5vdGU6IFRoaXMgaXMgYW4gYXBwcm9wcmlhdGUgdXNlIG9mIGBhbnlgLCBhcyB3ZSBhcmUga25vd2luZ2x5IGdldHRpbmcgZmFzdFxuLy8gYW5kIGxvb3NlIHdpdGggdGhlIHR5cGUgc3lzdGVtIGluIHRoaXMgZnVuY3Rpb246IGl0J3MgYmFzaWNhbGx5IEphdmFTY3JpcHQuXG4vLyBBdHRlbXB0aW5nIHRvIHByZXRlbmQgaXQncyBhbnl0aGluZyBlbHNlIHdvdWxkIHJlc3VsdCBpbiBzdXBlcmZsdW91cyB0eXBlXG4vLyBhc3NlcnRpb25zIHdoaWNoIHdvdWxkIGhhdmUgbm8gYmVuZWZpdC5cbi8vIEknbSBzdXJlIHdlIGNvdWxkIGNvbnZpbmNlIFR5cGVTY3JpcHQgdG8gZm9sbG93IHRoZSBwYXRoIGFuZCB0eXBlIGV2ZXJ5dGhpbmdcbi8vIGNvcnJlY3RseSBhbG9uZyB0aGUgd2F5LCBidXQgdGhhdCdzIGEgam9iIGZvciBhbm90aGVyIGRheS5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG5mdW5jdGlvbiBsb29rdXBQYXRoKHZhbHVlLCBwYXRoKSB7XG4gICAgbGV0IG8gPSB2YWx1ZTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgcGF0aCkge1xuICAgICAgICBpZiAocCBpbiBvKSB7XG4gICAgICAgICAgICBvID0gb1twXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG87XG59XG5leHBvcnRzLmxvb2t1cFBhdGggPSBsb29rdXBQYXRoO1xuZnVuY3Rpb24gc2hhbGxvd0VxdWFscyhhLCBiKSB7XG4gICAgaWYgKGEgPT09IGIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGEgPT09IG51bGwgfHwgYiA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IG9iakEgPSBhO1xuICAgIGNvbnN0IG9iakIgPSBiO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iakEpKSB7XG4gICAgICAgIGlmIChvYmpBW2tleV0gIT09IG9iakJba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG9iakIpKSB7XG4gICAgICAgIGlmIChvYmpBW2tleV0gIT09IG9iakJba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZXhwb3J0cy5zaGFsbG93RXF1YWxzID0gc2hhbGxvd0VxdWFscztcbmZ1bmN0aW9uIGlzU3RyaW5nKHMpIHtcbiAgICByZXR1cm4gdHlwZW9mIHMgPT09ICdzdHJpbmcnIHx8IHMgaW5zdGFuY2VvZiBTdHJpbmc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG4vLyBHaXZlbiBhIHN0cmluZyBlbnVtIHxlbnVtfCwgY2hlY2sgdGhhdCB8dmFsdWV8IGlzIGEgdmFsaWQgbWVtYmVyIG9mIHxlbnVtfC5cbmZ1bmN0aW9uIGlzRW51bVZhbHVlKGVubSwgdmFsdWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhlbm0pLmluY2x1ZGVzKHZhbHVlKTtcbn1cbmV4cG9ydHMuaXNFbnVtVmFsdWUgPSBpc0VudW1WYWx1ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDE5IFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy51bmRvQ29tbW9uQ2hhdEFwcFJlcGxhY2VtZW50cyA9IGV4cG9ydHMuc3FsaXRlU3RyaW5nID0gZXhwb3J0cy5iaW5hcnlEZWNvZGUgPSBleHBvcnRzLmJpbmFyeUVuY29kZSA9IGV4cG9ydHMudXRmOERlY29kZSA9IGV4cG9ydHMudXRmOEVuY29kZSA9IGV4cG9ydHMuaGV4RW5jb2RlID0gZXhwb3J0cy5iYXNlNjREZWNvZGUgPSBleHBvcnRzLmJhc2U2NEVuY29kZSA9IHZvaWQgMDtcbmNvbnN0IGJhc2U2NF8xID0gcmVxdWlyZShcIkBwcm90b2J1ZmpzL2Jhc2U2NFwiKTtcbmNvbnN0IHV0ZjhfMSA9IHJlcXVpcmUoXCJAcHJvdG9idWZqcy91dGY4XCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4vbG9nZ2luZ1wiKTtcbi8vIFRleHREZWNvZGVyL0RlY29kZXIgcmVxdWlyZXMgdGhlIGZ1bGwgRE9NIGFuZCBpc24ndCBhdmFpbGFibGUgaW4gYWxsIHR5cGVzXG4vLyBvZiB0ZXN0cy4gVXNlIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIGZyb20gcHJvdGJ1ZmpzLlxubGV0IFV0ZjhEZWNvZGVyO1xubGV0IFV0ZjhFbmNvZGVyO1xudHJ5IHtcbiAgICBVdGY4RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnKTtcbiAgICBVdGY4RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xufVxuY2F0Y2ggKF8pIHtcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIFNpbGVuY2UgdGhlIHdhcm5pbmcgd2hlbiB3ZSBrbm93IHdlIGFyZSBydW5uaW5nIHVuZGVyIE5vZGVKUy5cbiAgICAgICAgY29uc29sZS53YXJuKCdVc2luZyBmYWxsYmFjayBVVEY4IEVuY29kZXIvRGVjb2RlciwgVGhpcyBzaG91bGQgaGFwcGVuIG9ubHkgaW4gJyArXG4gICAgICAgICAgICAndGVzdHMgYW5kIE5vZGVKUy1iYXNlZCBlbnZpcm9ubWVudHMsIG5vdCBpbiBicm93c2Vycy4nKTtcbiAgICB9XG4gICAgVXRmOERlY29kZXIgPSB7IGRlY29kZTogKGJ1ZikgPT4gKDAsIHV0ZjhfMS5yZWFkKShidWYsIDAsIGJ1Zi5sZW5ndGgpIH07XG4gICAgVXRmOEVuY29kZXIgPSB7XG4gICAgICAgIGVuY29kZTogKHN0cikgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoKDAsIHV0ZjhfMS5sZW5ndGgpKHN0cikpO1xuICAgICAgICAgICAgY29uc3Qgd3JpdHRlbiA9ICgwLCB1dGY4XzEud3JpdGUpKHN0ciwgYXJyLCAwKTtcbiAgICAgICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkod3JpdHRlbiA9PT0gYXJyLmxlbmd0aCk7XG4gICAgICAgICAgICByZXR1cm4gYXJyO1xuICAgICAgICB9LFxuICAgIH07XG59XG5mdW5jdGlvbiBiYXNlNjRFbmNvZGUoYnVmZmVyKSB7XG4gICAgcmV0dXJuICgwLCBiYXNlNjRfMS5lbmNvZGUpKGJ1ZmZlciwgMCwgYnVmZmVyLmxlbmd0aCk7XG59XG5leHBvcnRzLmJhc2U2NEVuY29kZSA9IGJhc2U2NEVuY29kZTtcbmZ1bmN0aW9uIGJhc2U2NERlY29kZShzdHIpIHtcbiAgICAvLyBpZiB0aGUgc3RyaW5nIGlzIGluIGJhc2U2NHVybCBmb3JtYXQsIGNvbnZlcnQgdG8gYmFzZTY0XG4gICAgY29uc3QgYjY0ID0gc3RyLnJlcGxhY2VBbGwoJy0nLCAnKycpLnJlcGxhY2VBbGwoJ18nLCAnLycpO1xuICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KCgwLCBiYXNlNjRfMS5sZW5ndGgpKGI2NCkpO1xuICAgIGNvbnN0IHdyaXR0ZW4gPSAoMCwgYmFzZTY0XzEuZGVjb2RlKShiNjQsIGFyciwgMCk7XG4gICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh3cml0dGVuID09PSBhcnIubGVuZ3RoKTtcbiAgICByZXR1cm4gYXJyO1xufVxuZXhwb3J0cy5iYXNlNjREZWNvZGUgPSBiYXNlNjREZWNvZGU7XG4vLyBlbmNvZGUgYmluYXJ5IGFycmF5IHRvIGhleCBzdHJpbmdcbmZ1bmN0aW9uIGhleEVuY29kZShieXRlcykge1xuICAgIHJldHVybiBieXRlcy5yZWR1Y2UoKHByZXYsIGN1cikgPT4gcHJldiArICgnMCcgKyBjdXIudG9TdHJpbmcoMTYpKS5zbGljZSgtMiksICcnKTtcbn1cbmV4cG9ydHMuaGV4RW5jb2RlID0gaGV4RW5jb2RlO1xuZnVuY3Rpb24gdXRmOEVuY29kZShzdHIpIHtcbiAgICByZXR1cm4gVXRmOEVuY29kZXIuZW5jb2RlKHN0cik7XG59XG5leHBvcnRzLnV0ZjhFbmNvZGUgPSB1dGY4RW5jb2RlO1xuLy8gTm90ZTogbm90IGFsbCBieXRlIHNlcXVlbmNlcyBjYW4gYmUgY29udmVydGVkIHRvPD5mcm9tIFVURjguIFRoaXMgY2FuIGJlXG4vLyB1c2VkIG9ubHkgd2l0aCB2YWxpZCB1bmljb2RlIHN0cmluZ3MsIG5vdCBhcmJpdHJhcnkgYnl0ZSBidWZmZXJzLlxuZnVuY3Rpb24gdXRmOERlY29kZShidWZmZXIpIHtcbiAgICByZXR1cm4gVXRmOERlY29kZXIuZGVjb2RlKGJ1ZmZlcik7XG59XG5leHBvcnRzLnV0ZjhEZWNvZGUgPSB1dGY4RGVjb2RlO1xuLy8gVGhlIGJpbmFyeUVuY29kZS9EZWNvZGUgZnVuY3Rpb25zIGJlbG93IGFsbG93IHRvIGVuY29kZSBhbiBhcmJpdHJhcnkgYmluYXJ5XG4vLyBidWZmZXIgaW50byBhIHN0cmluZyB0aGF0IGNhbiBiZSBKU09OLWVuY29kZWQuIGJpbmFyeUVuY29kZSgpIGFwcGxpZXNcbi8vIFVURi0xNiBlbmNvZGluZyB0byBlYWNoIGJ5dGUgaW5kaXZpZHVhbGx5LlxuLy8gVW5saWtlIHV0ZjhFbmNvZGUvRGVjb2RlLCBhbnkgYXJiaXRyYXJ5IGJ5dGUgc2VxdWVuY2UgY2FuIGJlIGNvbnZlcnRlZCBpbnRvIGFcbi8vIHZhbGlkIHN0cmluZywgYW5kIHZpY2V2ZXJzYS5cbi8vIFRoaXMgc2hvdWxkIGJlIG9ubHkgdXNlZCB3aGVuIGEgYnl0ZSBhcnJheSBuZWVkcyB0byBiZSB0cmFuc21pdHRlZCBvdmVyIGFuXG4vLyBpbnRlcmZhY2UgdGhhdCBzdXBwb3J0cyBvbmx5IEpTT04gc2VyaWFsaXphdGlvbiAoZS5nLiwgcG9zdG1lc3NhZ2UgdG8gYVxuLy8gY2hyb21lIGV4dGVuc2lvbikuXG5mdW5jdGlvbiBiaW5hcnlFbmNvZGUoYnVmKSB7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHN0ciArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59XG5leHBvcnRzLmJpbmFyeUVuY29kZSA9IGJpbmFyeUVuY29kZTtcbmZ1bmN0aW9uIGJpbmFyeURlY29kZShzdHIpIHtcbiAgICBjb25zdCBidWYgPSBuZXcgVWludDhBcnJheShzdHIubGVuZ3RoKTtcbiAgICBjb25zdCBzdHJMZW4gPSBzdHIubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyTGVuOyBpKyspIHtcbiAgICAgICAgYnVmW2ldID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHJldHVybiBidWY7XG59XG5leHBvcnRzLmJpbmFyeURlY29kZSA9IGJpbmFyeURlY29kZTtcbi8vIEEgZnVuY3Rpb24gdXNlZCB0byBpbnRlcnBvbGF0ZSBzdHJpbmdzIGludG8gU1FMIHF1ZXJ5LiBUaGUgb25seSByZXBsYWNlbWVudFxuLy8gaXMgZG9uZSBpcyB0aGF0IHNpbmdsZSBxdW90ZSByZXBsYWNlZCB3aXRoIHR3byBzaW5nbGUgcXVvdGVzLCBhY2NvcmRpbmcgdG9cbi8vIFNRTGl0ZSBkb2N1bWVudGF0aW9uOlxuLy8gaHR0cHM6Ly93d3cuc3FsaXRlLm9yZy9sYW5nX2V4cHIuaHRtbCNsaXRlcmFsX3ZhbHVlc19jb25zdGFudHNfXG4vL1xuLy8gVGhlIHB1cnBvc2Ugb2YgdGhpcyBmdW5jdGlvbiBpcyB0byB1c2UgaW4gc2ltcGxlIGNvbXBhcmlzb25zLCB0byBlc2NhcGVcbi8vIHN0cmluZ3MgdXNlZCBpbiBHTE9CIGNsYXVzZXMgc2VlIGVzY2FwZVF1ZXJ5IGZ1bmN0aW9uLlxuZnVuY3Rpb24gc3FsaXRlU3RyaW5nKHN0cikge1xuICAgIHJldHVybiBgJyR7c3RyLnJlcGxhY2VBbGwoJ1xcJycsICdcXCdcXCcnKX0nYDtcbn1cbmV4cG9ydHMuc3FsaXRlU3RyaW5nID0gc3FsaXRlU3RyaW5nO1xuLy8gQ2hhdCBhcHBzIChpbmNsdWRpbmcgRyBDaGF0KSBzb21ldGltZXMgcmVwbGFjZSBBU0NJSSBjaGFyYWN0ZXJzIHdpdGggc2ltaWxhclxuLy8gbG9va2luZyB1bmljb2RlIGNoYXJhY3RlcnMgdGhhdCBicmVhayBjb2RlIHNuaXBwZXRzLlxuLy8gVGhpcyBmdW5jdGlvbiBhdHRlbXB0cyB0byB1bmRvIHRoZXNlIHJlcGxhY2VtZW50cy5cbmZ1bmN0aW9uIHVuZG9Db21tb25DaGF0QXBwUmVwbGFjZW1lbnRzKHN0cikge1xuICAgIC8vIFJlcGxhY2Ugbm9uLWJyZWFraW5nIHNwYWNlcyB3aXRoIG5vcm1hbCBzcGFjZXMuXG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlQWxsKCdcXHUwMEEwJywgJyAnKTtcbn1cbmV4cG9ydHMudW5kb0NvbW1vbkNoYXRBcHBSZXBsYWNlbWVudHMgPSB1bmRvQ29tbW9uQ2hhdEFwcFJlcGxhY2VtZW50cztcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BcnJheUJ1ZmZlckJ1aWxkZXIgPSB2b2lkIDA7XG5jb25zdCB1dGY4XzEgPSByZXF1aXJlKFwiQHByb3RvYnVmanMvdXRmOFwiKTtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuLi9iYXNlL2xvZ2dpbmdcIik7XG5jb25zdCBvYmplY3RfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi9iYXNlL29iamVjdF91dGlsc1wiKTtcbi8vIFJldHVybiB0aGUgbGVuZ3RoLCBpbiBieXRlcywgb2YgYSB0b2tlbiB0byBiZSBpbnNlcnRlZC5cbmZ1bmN0aW9uIHRva2VuTGVuZ3RoKHRva2VuKSB7XG4gICAgaWYgKCgwLCBvYmplY3RfdXRpbHNfMS5pc1N0cmluZykodG9rZW4pKSB7XG4gICAgICAgIHJldHVybiAoMCwgdXRmOF8xLmxlbmd0aCkodG9rZW4pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0b2tlbiBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIHRva2VuLmJ5dGVMZW5ndGg7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHRva2VuID49IDAgJiYgdG9rZW4gPD0gMHhmZmZmZmZmZik7XG4gICAgICAgIC8vIDMyLWJpdCBpbnRlZ2VycyB0YWtlIDQgYnl0ZXNcbiAgICAgICAgcmV0dXJuIDQ7XG4gICAgfVxufVxuLy8gSW5zZXJ0IGEgdG9rZW4gaW50byB0aGUgYnVmZmVyLCBhdCBwb3NpdGlvbiBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQHBhcmFtIGRhdGFWaWV3IEEgRGF0YVZpZXcgaW50byB0aGUgYnVmZmVyIHRvIHdyaXRlIGludG8uXG4vLyBAcGFyYW0gdHlwZWRBcnJheSBBIFVpbnQ4QXJyYXkgdmlldyBpbnRvIHRoZSBidWZmZXIgdG8gd3JpdGUgaW50by5cbi8vIEBwYXJhbSBieXRlT2Zmc2V0IFBvc2l0aW9uIHRvIHdyaXRlIGF0LCBpbiB0aGUgYnVmZmVyLlxuLy8gQHBhcmFtIHRva2VuIFRva2VuIHRvIGluc2VydCBpbnRvIHRoZSBidWZmZXIuXG5mdW5jdGlvbiBpbnNlcnRUb2tlbihkYXRhVmlldywgdHlwZWRBcnJheSwgYnl0ZU9mZnNldCwgdG9rZW4pIHtcbiAgICBpZiAoKDAsIG9iamVjdF91dGlsc18xLmlzU3RyaW5nKSh0b2tlbikpIHtcbiAgICAgICAgLy8gRW5jb2RlIHRoZSBzdHJpbmcgaW4gVVRGLThcbiAgICAgICAgY29uc3Qgd3JpdHRlbiA9ICgwLCB1dGY4XzEud3JpdGUpKHRva2VuLCB0eXBlZEFycmF5LCBieXRlT2Zmc2V0KTtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh3cml0dGVuID09PSAoMCwgdXRmOF8xLmxlbmd0aCkodG9rZW4pKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG9rZW4gaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgICAgIC8vIENvcHkgdGhlIGJ5dGVzIGZyb20gdGhlIG90aGVyIGFycmF5XG4gICAgICAgIHR5cGVkQXJyYXkuc2V0KHRva2VuLCBieXRlT2Zmc2V0KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkodG9rZW4gPj0gMCAmJiB0b2tlbiA8PSAweGZmZmZmZmZmKTtcbiAgICAgICAgLy8gMzItYml0IGxpdHRsZS1lbmRpYW4gdmFsdWVcbiAgICAgICAgZGF0YVZpZXcuc2V0VWludDMyKGJ5dGVPZmZzZXQsIHRva2VuLCB0cnVlKTtcbiAgICB9XG59XG4vLyBMaWtlIGEgc3RyaW5nIGJ1aWxkZXIsIGJ1dCBmb3IgYW4gQXJyYXlCdWZmZXIgaW5zdGVhZCBvZiBhIHN0cmluZy4gVGhpc1xuLy8gYWxsb3dzIHVzIHRvIGFzc2VtYmxlIG1lc3NhZ2VzIHRvIHNlbmQvcmVjZWl2ZSBvdmVyIHRoZSB3aXJlLiBEYXRhIGNhbiBiZVxuLy8gYXBwZW5kZWQgdG8gdGhlIGJ1ZmZlciB1c2luZyBgYXBwZW5kKClgLiBUaGUgZGF0YSB3ZSBhcHBlbmQgY2FuIGJlIG9mIHRoZVxuLy8gZm9sbG93aW5nIHR5cGVzOlxuLy9cbi8vIC0gc3RyaW5nOiB0aGUgQVNDSUkgc3RyaW5nIGlzIGFwcGVuZGVkLiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlcmUgYXJlXG4vLyAgICAgICAgICAgbm9uLUFTQ0lJIGNoYXJhY3RlcnMuXG4vLyAtIG51bWJlcjogdGhlIG51bWJlciBpcyBhcHBlbmRlZCBhcyBhIDMyLWJpdCBsaXR0bGUtZW5kaWFuIGludGVnZXIuXG4vLyAtIFVpbnQ4QXJyYXk6IHRoZSBieXRlcyBhcmUgYXBwZW5kZWQgYXMtaXMgdG8gdGhlIGJ1ZmZlci5cbmNsYXNzIEFycmF5QnVmZmVyQnVpbGRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgfVxuICAgIC8vIFJldHVybiBhbiBgQXJyYXlCdWZmZXJgIHRoYXQgaXMgdGhlIGNvbmNhdGVuYXRpb24gb2YgYWxsIHRoZSB0b2tlbnMuXG4gICAgdG9BcnJheUJ1ZmZlcigpIHtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBzaXplIG9mIHRoZSBidWZmZXIgd2UgbmVlZC5cbiAgICAgICAgbGV0IGJ5dGVMZW5ndGggPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRoaXMudG9rZW5zKSB7XG4gICAgICAgICAgICBieXRlTGVuZ3RoICs9IHRva2VuTGVuZ3RoKHRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBbGxvY2F0ZSB0aGUgYnVmZmVyLlxuICAgICAgICBjb25zdCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZUxlbmd0aCk7XG4gICAgICAgIGNvbnN0IGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IHR5cGVkQXJyYXkgPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuICAgICAgICAvLyBGaWxsIHRoZSBidWZmZXIgd2l0aCB0aGUgdG9rZW5zLlxuICAgICAgICBsZXQgYnl0ZU9mZnNldCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgIGluc2VydFRva2VuKGRhdGFWaWV3LCB0eXBlZEFycmF5LCBieXRlT2Zmc2V0LCB0b2tlbik7XG4gICAgICAgICAgICBieXRlT2Zmc2V0ICs9IHRva2VuTGVuZ3RoKHRva2VuKTtcbiAgICAgICAgfVxuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGJ5dGVPZmZzZXQgPT09IGJ5dGVMZW5ndGgpO1xuICAgICAgICAvLyBSZXR1cm4gdGhlIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICB9XG4gICAgLy8gQWRkIG9uZSBvciBtb3JlIHRva2VucyB0byB0aGUgdmFsdWUgb2YgdGhpcyBvYmplY3QuXG4gICAgYXBwZW5kKHRva2VuKSB7XG4gICAgICAgIHRoaXMudG9rZW5zLnB1c2godG9rZW4pO1xuICAgIH1cbn1cbmV4cG9ydHMuQXJyYXlCdWZmZXJCdWlsZGVyID0gQXJyYXlCdWZmZXJCdWlsZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYkNvbm5lY3Rpb25JbXBsID0gdm9pZCAwO1xuY29uc3QgY3VzdG9tX3V0aWxzXzEgPSByZXF1aXJlKFwiY3VzdG9tX3V0aWxzXCIpO1xuY29uc3QgZGVmZXJyZWRfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2RlZmVycmVkXCIpO1xuY29uc3QgYXJyYXlfYnVmZmVyX2J1aWxkZXJfMSA9IHJlcXVpcmUoXCIuLi9hcnJheV9idWZmZXJfYnVpbGRlclwiKTtcbmNvbnN0IGFkYl9maWxlX2hhbmRsZXJfMSA9IHJlcXVpcmUoXCIuL2FkYl9maWxlX2hhbmRsZXJcIik7XG5jb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBjdXN0b21fdXRpbHNfMS5fVGV4dERlY29kZXIoKTtcbmNsYXNzIEFkYkNvbm5lY3Rpb25JbXBsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gb25TdGF0dXMgYW5kIG9uRGlzY29ubmVjdCBhcmUgc2V0IHRvIGNhbGxiYWNrcyBwYXNzZWQgZnJvbSB0aGUgY2FsbGVyLlxuICAgICAgICAvLyBUaGlzIGhhcHBlbnMgZm9yIGluc3RhbmNlIGluIHRoZSBBbmRyb2lkV2VidXNiVGFyZ2V0LCB3aGljaCBpbnN0YW50aWF0ZXNcbiAgICAgICAgLy8gdGhlbSB3aXRoIGNhbGxiYWNrcyBwYXNzZWQgZnJvbSB0aGUgVUkuXG4gICAgICAgIHRoaXMub25TdGF0dXMgPSAoKSA9PiB7IH07XG4gICAgICAgIHRoaXMub25EaXNjb25uZWN0ID0gKF8pID0+IHsgfTtcbiAgICB9XG4gICAgLy8gU3RhcnRzIGEgc2hlbGwgY29tbWFuZCwgYW5kIHJldHVybnMgYSBwcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIGNvbW1hbmRcbiAgICAvLyBjb21wbGV0ZXMuXG4gICAgYXN5bmMgc2hlbGxBbmRXYWl0Q29tcGxldGlvbihjbWQpIHtcbiAgICAgICAgY29uc3QgYWRiU3RyZWFtID0gYXdhaXQgdGhpcy5zaGVsbChjbWQpO1xuICAgICAgICBjb25zdCBvblN0cmVhbWluZ0VuZGVkID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIC8vIFdlIHdhaXQgZm9yIHRoZSBzdHJlYW0gdG8gYmUgY2xvc2VkIGJ5IHRoZSBkZXZpY2UsIHdoaWNoIGhhcHBlbnNcbiAgICAgICAgLy8gYWZ0ZXIgdGhlIHNoZWxsIGNvbW1hbmQgaXMgc3VjY2Vzc2Z1bGx5IHJlY2VpdmVkLlxuICAgICAgICBhZGJTdHJlYW0uYWRkT25TdHJlYW1DbG9zZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICAgIG9uU3RyZWFtaW5nRW5kZWQucmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9uU3RyZWFtaW5nRW5kZWQ7XG4gICAgfVxuICAgIC8vIFN0YXJ0cyBhIHNoZWxsIGNvbW1hbmQsIHRoZW4gZ2F0aGVycyBhbGwgaXRzIG91dHB1dCBhbmQgcmV0dXJucyBpdCBhc1xuICAgIC8vIGEgc3RyaW5nLlxuICAgIGFzeW5jIHNoZWxsQW5kR2V0T3V0cHV0KGNtZCkge1xuICAgICAgICBjb25zdCBhZGJTdHJlYW0gPSBhd2FpdCB0aGlzLnNoZWxsKGNtZCk7XG4gICAgICAgIGNvbnN0IGNvbW1hbmRPdXRwdXQgPSBuZXcgYXJyYXlfYnVmZmVyX2J1aWxkZXJfMS5BcnJheUJ1ZmZlckJ1aWxkZXIoKTtcbiAgICAgICAgY29uc3Qgb25TdHJlYW1pbmdFbmRlZCA9ICgwLCBkZWZlcnJlZF8xLmRlZmVyKSgpO1xuICAgICAgICBhZGJTdHJlYW0uYWRkT25TdHJlYW1EYXRhQ2FsbGJhY2soKGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbW1hbmRPdXRwdXQuYXBwZW5kKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgYWRiU3RyZWFtLmFkZE9uU3RyZWFtQ2xvc2VDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgICAgICBvblN0cmVhbWluZ0VuZGVkLnJlc29sdmUodGV4dERlY29kZXIuZGVjb2RlKGNvbW1hbmRPdXRwdXQudG9BcnJheUJ1ZmZlcigpKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb25TdHJlYW1pbmdFbmRlZDtcbiAgICB9XG4gICAgYXN5bmMgcHVzaChiaW5hcnksIHBhdGgpIHtcbiAgICAgICAgY29uc3QgYnl0ZVN0cmVhbSA9IGF3YWl0IHRoaXMub3BlblN0cmVhbSgnc3luYzonKTtcbiAgICAgICAgYXdhaXQgKG5ldyBhZGJfZmlsZV9oYW5kbGVyXzEuQWRiRmlsZUhhbmRsZXIoYnl0ZVN0cmVhbSkpLnB1c2hCaW5hcnkoYmluYXJ5LCBwYXRoKTtcbiAgICAgICAgLy8gV2UgbmVlZCB0byB3YWl0IHVudGlsIHRoZSBieXRlc3RyZWFtIGlzIGNsb3NlZC4gT3RoZXJ3aXNlLCB3ZSBjYW4gaGF2ZSBhXG4gICAgICAgIC8vIHJhY2UgY29uZGl0aW9uOlxuICAgICAgICAvLyBJZiB0aGlzIGlzIHRoZSBsYXN0IHN0cmVhbSwgaXQgd2lsbCB0cnkgdG8gZGlzY29ubmVjdCB0aGUgZGV2aWNlLiBJbiB0aGVcbiAgICAgICAgLy8gbWVhbnRpbWUsIHRoZSBjYWxsZXIgbWlnaHQgY3JlYXRlIGFub3RoZXIgc3RyZWFtIHdoaWNoIHdpbGwgdHJ5IHRvIG9wZW5cbiAgICAgICAgLy8gdGhlIGRldmljZS5cbiAgICAgICAgYXdhaXQgYnl0ZVN0cmVhbS5jbG9zZUFuZFdhaXRGb3JUZWFyZG93bigpO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiQ29ubmVjdGlvbkltcGwgPSBBZGJDb25uZWN0aW9uSW1wbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZGJPdmVyV2VidXNiU3RyZWFtID0gZXhwb3J0cy5BZGJDb25uZWN0aW9uT3ZlcldlYnVzYiA9IGV4cG9ydHMuQWRiU3RhdGUgPSBleHBvcnRzLkRFRkFVTFRfTUFYX1BBWUxPQURfQllURVMgPSBleHBvcnRzLlZFUlNJT05fTk9fQ0hFQ0tTVU0gPSBleHBvcnRzLlZFUlNJT05fV0lUSF9DSEVDS1NVTSA9IHZvaWQgMDtcbmNvbnN0IGN1c3RvbV91dGlsc18xID0gcmVxdWlyZShcImN1c3RvbV91dGlsc1wiKTtcbmNvbnN0IGRlZmVycmVkXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9kZWZlcnJlZFwiKTtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2xvZ2dpbmdcIik7XG5jb25zdCBvYmplY3RfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL29iamVjdF91dGlsc1wiKTtcbmNvbnN0IGFkYl9jb25uZWN0aW9uX2ltcGxfMSA9IHJlcXVpcmUoXCIuL2FkYl9jb25uZWN0aW9uX2ltcGxcIik7XG5jb25zdCBhZGJfa2V5X21hbmFnZXJfMSA9IHJlcXVpcmUoXCIuL2F1dGgvYWRiX2tleV9tYW5hZ2VyXCIpO1xuY29uc3QgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEgPSByZXF1aXJlKFwiLi9yZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdcIik7XG5jb25zdCByZWNvcmRpbmdfdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3JlY29yZGluZ191dGlsc1wiKTtcbmNvbnN0IHRleHRFbmNvZGVyID0gbmV3IGN1c3RvbV91dGlsc18xLl9UZXh0RW5jb2RlcigpO1xuY29uc3QgdGV4dERlY29kZXIgPSBuZXcgY3VzdG9tX3V0aWxzXzEuX1RleHREZWNvZGVyKCk7XG5leHBvcnRzLlZFUlNJT05fV0lUSF9DSEVDS1NVTSA9IDB4MDEwMDAwMDA7XG5leHBvcnRzLlZFUlNJT05fTk9fQ0hFQ0tTVU0gPSAweDAxMDAwMDAxO1xuZXhwb3J0cy5ERUZBVUxUX01BWF9QQVlMT0FEX0JZVEVTID0gMjU2ICogMTAyNDtcbnZhciBBZGJTdGF0ZTtcbihmdW5jdGlvbiAoQWRiU3RhdGUpIHtcbiAgICBBZGJTdGF0ZVtBZGJTdGF0ZVtcIkRJU0NPTk5FQ1RFRFwiXSA9IDBdID0gXCJESVNDT05ORUNURURcIjtcbiAgICAvLyBBdXRoZW50aWNhdGlvbiBzdGVwcywgc2VlIEFkYkNvbm5lY3Rpb25PdmVyV2ViVXNiJ3MgaGFuZGxlQXV0aGVudGljYXRpb24oKS5cbiAgICBBZGJTdGF0ZVtBZGJTdGF0ZVtcIkFVVEhfU1RBUlRFRFwiXSA9IDFdID0gXCJBVVRIX1NUQVJURURcIjtcbiAgICBBZGJTdGF0ZVtBZGJTdGF0ZVtcIkFVVEhfV0lUSF9QUklWQVRFXCJdID0gMl0gPSBcIkFVVEhfV0lUSF9QUklWQVRFXCI7XG4gICAgQWRiU3RhdGVbQWRiU3RhdGVbXCJBVVRIX1dJVEhfUFVCTElDXCJdID0gM10gPSBcIkFVVEhfV0lUSF9QVUJMSUNcIjtcbiAgICBBZGJTdGF0ZVtBZGJTdGF0ZVtcIkNPTk5FQ1RFRFwiXSA9IDRdID0gXCJDT05ORUNURURcIjtcbn0pKEFkYlN0YXRlIHx8IChleHBvcnRzLkFkYlN0YXRlID0gQWRiU3RhdGUgPSB7fSkpO1xudmFyIEF1dGhDbWQ7XG4oZnVuY3Rpb24gKEF1dGhDbWQpIHtcbiAgICBBdXRoQ21kW0F1dGhDbWRbXCJUT0tFTlwiXSA9IDFdID0gXCJUT0tFTlwiO1xuICAgIEF1dGhDbWRbQXV0aENtZFtcIlNJR05BVFVSRVwiXSA9IDJdID0gXCJTSUdOQVRVUkVcIjtcbiAgICBBdXRoQ21kW0F1dGhDbWRbXCJSU0FQVUJMSUNLRVlcIl0gPSAzXSA9IFwiUlNBUFVCTElDS0VZXCI7XG59KShBdXRoQ21kIHx8IChBdXRoQ21kID0ge30pKTtcbmZ1bmN0aW9uIGdlbmVyYXRlQ2hlY2tzdW0oZGF0YSkge1xuICAgIGxldCByZXMgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5ieXRlTGVuZ3RoOyBpKyspXG4gICAgICAgIHJlcyArPSBkYXRhW2ldO1xuICAgIHJldHVybiByZXMgJiAweEZGRkZGRkZGO1xufVxuY2xhc3MgQWRiQ29ubmVjdGlvbk92ZXJXZWJ1c2IgZXh0ZW5kcyBhZGJfY29ubmVjdGlvbl9pbXBsXzEuQWRiQ29ubmVjdGlvbkltcGwge1xuICAgIC8vIFdlIHVzZSBhIGtleSBwYWlyIGZvciBhdXRoZW50aWNhdGluZyB3aXRoIHRoZSBkZXZpY2UsIHdoaWNoIHdlIGRvIGluXG4gICAgLy8gdHdvIHdheXM6XG4gICAgLy8gLSBGaXJzdGx5LCBzaWduaW5nIHdpdGggdGhlIHByaXZhdGUga2V5LlxuICAgIC8vIC0gU2Vjb25kbHksIHNlbmRpbmcgb3ZlciB0aGUgcHVibGljIGtleSAoYXQgd2hpY2ggcG9pbnQgdGhlIGRldmljZSBhc2tzIHRoZVxuICAgIC8vICAgdXNlciBmb3IgcGVybWlzc2lvbnMpLlxuICAgIC8vIE9uY2Ugd2UndmUgc2VudCB0aGUgcHVibGljIGtleSwgZm9yIGZ1dHVyZSByZWNvcmRpbmdzIHdlIG9ubHkgbmVlZCB0b1xuICAgIC8vIHNpZ24gd2l0aCB0aGUgcHJpdmF0ZSBrZXksIHNvIHRoZSB1c2VyIGRvZXNuJ3QgbmVlZCB0byBnaXZlIHBlcm1pc3Npb25zXG4gICAgLy8gYWdhaW4uXG4gICAgY29uc3RydWN0b3IoZGV2aWNlLCBrZXlNYW5hZ2VyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuICAgICAgICB0aGlzLmtleU1hbmFnZXIgPSBrZXlNYW5hZ2VyO1xuICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuRElTQ09OTkVDVEVEO1xuICAgICAgICB0aGlzLmNvbm5lY3RpbmdTdHJlYW1zID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnN0cmVhbXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHRoaXMubWF4UGF5bG9hZCA9IGV4cG9ydHMuREVGQVVMVF9NQVhfUEFZTE9BRF9CWVRFUztcbiAgICAgICAgdGhpcy53cml0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgdGhpcy53cml0ZVF1ZXVlID0gW107XG4gICAgICAgIC8vIERldmljZXMgYWZ0ZXIgRGVjIDIwMTcgZG9uJ3QgdXNlIGNoZWNrc3VtLiBUaGlzIHdpbGwgYmUgYXV0by1kZXRlY3RlZFxuICAgICAgICAvLyBkdXJpbmcgdGhlIGNvbm5lY3Rpb24uXG4gICAgICAgIHRoaXMudXNlQ2hlY2tzdW0gPSB0cnVlO1xuICAgICAgICB0aGlzLmxhc3RTdHJlYW1JZCA9IDA7XG4gICAgICAgIHRoaXMudXNiUmVhZEVuZHBvaW50ID0gLTE7XG4gICAgICAgIHRoaXMudXNiV3JpdGVFcEVuZHBvaW50ID0gLTE7XG4gICAgICAgIHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wZW5kaW5nQ29ublByb21pc2VzID0gW107XG4gICAgfVxuICAgIHNoZWxsKGNtZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuU3RyZWFtKCdzaGVsbDonICsgY21kKTtcbiAgICB9XG4gICAgY29ubmVjdFNvY2tldChwYXRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5TdHJlYW0ocGF0aCk7XG4gICAgfVxuICAgIGFzeW5jIGNhbkNvbm5lY3RXaXRob3V0Q29udGVudGlvbigpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2Uub3BlbigpO1xuICAgICAgICBjb25zdCB1c2JJbnRlcmZhY2VOdW1iZXIgPSBhd2FpdCB0aGlzLnNldHVwVXNiSW50ZXJmYWNlKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5jbGFpbUludGVyZmFjZSh1c2JJbnRlcmZhY2VOdW1iZXIpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2UucmVsZWFzZUludGVyZmFjZSh1c2JJbnRlcmZhY2VOdW1iZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBvcGVuU3RyZWFtKGRlc3RpbmF0aW9uKSB7XG4gICAgICAgIGNvbnN0IHN0cmVhbUlkID0gKyt0aGlzLmxhc3RTdHJlYW1JZDtcbiAgICAgICAgY29uc3QgY29ubmVjdGluZ1N0cmVhbSA9ICgwLCBkZWZlcnJlZF8xLmRlZmVyKSgpO1xuICAgICAgICB0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLnNldChzdHJlYW1JZCwgY29ubmVjdGluZ1N0cmVhbSk7XG4gICAgICAgIC8vIFdlIGNyZWF0ZSB0aGUgc3RyZWFtIGJlZm9yZSB0cnlpbmcgdG8gZXN0YWJsaXNoIHRoZSBjb25uZWN0aW9uLCBzb1xuICAgICAgICAvLyB0aGF0IGlmIHdlIGZhaWwgdG8gY29ubmVjdCwgd2Ugd2lsbCByZWplY3QgdGhlIGNvbm5lY3Rpbmcgc3RyZWFtLlxuICAgICAgICBhd2FpdCB0aGlzLmVuc3VyZUNvbm5lY3Rpb25Fc3RhYmxpc2hlZCgpO1xuICAgICAgICBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKCdPUEVOJywgc3RyZWFtSWQsIDAsIGRlc3RpbmF0aW9uKTtcbiAgICAgICAgcmV0dXJuIGNvbm5lY3RpbmdTdHJlYW07XG4gICAgfVxuICAgIGFzeW5jIGVuc3VyZUNvbm5lY3Rpb25Fc3RhYmxpc2hlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkNPTk5FQ1RFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5ESVNDT05ORUNURUQpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLm9wZW4oKTtcbiAgICAgICAgICAgIGlmICghKGF3YWl0IHRoaXMuY2FuQ29ubmVjdFdpdGhvdXRDb250ZW50aW9uKCkpKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2UucmVzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHVzYkludGVyZmFjZU51bWJlciA9IGF3YWl0IHRoaXMuc2V0dXBVc2JJbnRlcmZhY2UoKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLmNsYWltSW50ZXJmYWNlKHVzYkludGVyZmFjZU51bWJlcik7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5zdGFydEFkYkF1dGgoKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLnVzYlJlY2VpdmVMb29wKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY29ublByb21pc2UgPSAoMCwgZGVmZXJyZWRfMS5kZWZlcikoKTtcbiAgICAgICAgdGhpcy5wZW5kaW5nQ29ublByb21pc2VzLnB1c2goY29ublByb21pc2UpO1xuICAgICAgICBhd2FpdCBjb25uUHJvbWlzZTtcbiAgICB9XG4gICAgYXN5bmMgc2V0dXBVc2JJbnRlcmZhY2UoKSB7XG4gICAgICAgIGNvbnN0IGludGVyZmFjZUFuZEVuZHBvaW50ID0gKDAsIHJlY29yZGluZ191dGlsc18xLmZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludCkodGhpcy5kZXZpY2UpO1xuICAgICAgICAvLyBgZmluZEludGVyZmFjZUFuZEVuZHBvaW50YCB3aWxsIGFsd2F5cyByZXR1cm4gYSBub24tbnVsbCB2YWx1ZSBiZWNhdXNlXG4gICAgICAgIC8vIHdlIGNoZWNrIGZvciB0aGlzIGluICdhbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeScuIElmIG5vIGludGVyZmFjZSBhbmRcbiAgICAgICAgLy8gZW5kcG9pbnRzIGFyZSBmb3VuZCwgd2UgZG8gbm90IGNyZWF0ZSBhIHRhcmdldCwgc28gd2UgY2FuIG5vdCBjb25uZWN0IHRvXG4gICAgICAgIC8vIGl0LCBzbyB3ZSB3aWxsIG5ldmVyIHJlYWNoIHRoaXMgbG9naWMuXG4gICAgICAgIGNvbnN0IHsgY29uZmlndXJhdGlvblZhbHVlLCB1c2JJbnRlcmZhY2VOdW1iZXIsIGVuZHBvaW50cyB9ID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKGludGVyZmFjZUFuZEVuZHBvaW50KTtcbiAgICAgICAgdGhpcy51c2JJbnRlcmZhY2VOdW1iZXIgPSB1c2JJbnRlcmZhY2VOdW1iZXI7XG4gICAgICAgIHRoaXMudXNiUmVhZEVuZHBvaW50ID0gdGhpcy5maW5kRW5kcG9pbnROdW1iZXIoZW5kcG9pbnRzLCAnaW4nKTtcbiAgICAgICAgdGhpcy51c2JXcml0ZUVwRW5kcG9pbnQgPSB0aGlzLmZpbmRFbmRwb2ludE51bWJlcihlbmRwb2ludHMsICdvdXQnKTtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh0aGlzLnVzYlJlYWRFbmRwb2ludCA+PSAwICYmIHRoaXMudXNiV3JpdGVFcEVuZHBvaW50ID49IDApO1xuICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5zZWxlY3RDb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb25WYWx1ZSk7XG4gICAgICAgIHJldHVybiB1c2JJbnRlcmZhY2VOdW1iZXI7XG4gICAgfVxuICAgIGFzeW5jIHN0cmVhbUNsb3NlKHN0cmVhbSkge1xuICAgICAgICBjb25zdCBvdGhlclN0cmVhbXNRdWV1ZSA9IHRoaXMud3JpdGVRdWV1ZS5maWx0ZXIoKHF1ZXVlRWxlbWVudCkgPT4gcXVldWVFbGVtZW50LmxvY2FsU3RyZWFtSWQgIT09IHN0cmVhbS5sb2NhbFN0cmVhbUlkKTtcbiAgICAgICAgY29uc3QgZHJvcHBlZFBhY2tldENvdW50ID0gdGhpcy53cml0ZVF1ZXVlLmxlbmd0aCAtIG90aGVyU3RyZWFtc1F1ZXVlLmxlbmd0aDtcbiAgICAgICAgaWYgKGRyb3BwZWRQYWNrZXRDb3VudCA+IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYERyb3BwaW5nICR7ZHJvcHBlZFBhY2tldENvdW50fSBxdWV1ZWQgbWVzc2FnZXMgZHVlIHRvIHN0cmVhbSBjbG9zaW5nLmApO1xuICAgICAgICAgICAgdGhpcy53cml0ZVF1ZXVlID0gb3RoZXJTdHJlYW1zUXVldWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdHJlYW1zLmRlbGV0ZShzdHJlYW0pO1xuICAgICAgICBpZiAodGhpcy5zdHJlYW1zLnNpemUgPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGRpc2Nvbm5lY3QgQkVGT1JFIGNhbGxpbmcgYHNpZ25hbFN0cmVhbUNsb3NlZGAuIE90aGVyd2lzZSwgdGhlcmUgY2FuXG4gICAgICAgICAgICAvLyBiZSBhIHJhY2UgY29uZGl0aW9uOlxuICAgICAgICAgICAgLy8gU3RyZWFtIEE6IHN0cmVhbUEub25TdHJlYW1DbG9zZVxuICAgICAgICAgICAgLy8gU3RyZWFtIEI6IGRldmljZS5vcGVuXG4gICAgICAgICAgICAvLyBTdHJlYW0gQTogZGV2aWNlLnJlbGVhc2VJbnRlcmZhY2VcbiAgICAgICAgICAgIC8vIFN0cmVhbSBCOiBkZXZpY2UudHJhbnNmZXJPdXQgLT4gQ1JBU0hcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIHN0cmVhbS5zaWduYWxTdHJlYW1DbG9zZWQoKTtcbiAgICB9XG4gICAgc3RyZWFtV3JpdGUobXNnLCBzdHJlYW0pIHtcbiAgICAgICAgY29uc3QgcmF3ID0gKCgwLCBvYmplY3RfdXRpbHNfMS5pc1N0cmluZykobXNnKSkgPyB0ZXh0RW5jb2Rlci5lbmNvZGUobXNnKSA6IG1zZztcbiAgICAgICAgaWYgKHRoaXMud3JpdGVJblByb2dyZXNzKSB7XG4gICAgICAgICAgICB0aGlzLndyaXRlUXVldWUucHVzaCh7IG1lc3NhZ2U6IHJhdywgbG9jYWxTdHJlYW1JZDogc3RyZWFtLmxvY2FsU3RyZWFtSWQgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53cml0ZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICB0aGlzLnNlbmRNZXNzYWdlKCdXUlRFJywgc3RyZWFtLmxvY2FsU3RyZWFtSWQsIHN0cmVhbS5yZW1vdGVTdHJlYW1JZCwgcmF3KTtcbiAgICB9XG4gICAgLy8gV2UgZGlzY29ubmVjdCBpbiAyIGNhc2VzOlxuICAgIC8vIDEuIFdoZW4gd2UgY2xvc2UgdGhlIGxhc3Qgc3RyZWFtIG9mIHRoZSBjb25uZWN0aW9uLiBUaGlzIGlzIHRvIHByZXZlbnQgdGhlXG4gICAgLy8gYnJvd3NlciBob2xkaW5nIG9udG8gdGhlIFVTQiBpbnRlcmZhY2UgYWZ0ZXIgaGF2aW5nIGZpbmlzaGVkIGEgdHJhY2VcbiAgICAvLyByZWNvcmRpbmcsIHdoaWNoIHdvdWxkIG1ha2UgaXQgaW1wb3NzaWJsZSB0byB1c2UgXCJhZGIgc2hlbGxcIiBmcm9tIHRoZSBzYW1lXG4gICAgLy8gbWFjaGluZSB1bnRpbCB0aGUgYnJvd3NlciBpcyBjbG9zZWQuXG4gICAgLy8gMi4gV2hlbiB3ZSBnZXQgYSBVU0IgZGlzY29ubmVjdCBldmVudC4gVGhpcyBoYXBwZW5zIGZvciBpbnN0YW5jZSB3aGVuIHRoZVxuICAgIC8vIGRldmljZSBpcyB1bnBsdWdnZWQuXG4gICAgYXN5bmMgZGlzY29ubmVjdChkaXNjb25uZWN0TWVzc2FnZSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuRElTQ09OTkVDVEVEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2xlYXIgdGhlIHJlc291cmNlcyBpbiBhIHN5bmNocm9ub3VzIG1ldGhvZCwgYmVjYXVzZSB0aGlzIGNhbiBiZSB1c2VkXG4gICAgICAgIC8vIGZvciBlcnJvciBoYW5kbGluZyBjYWxsYmFja3MgYXMgd2VsbC5cbiAgICAgICAgdGhpcy5yZWFjaERpc2Nvbm5lY3RTdGF0ZShkaXNjb25uZWN0TWVzc2FnZSk7XG4gICAgICAgIC8vIFdlIGhhdmUgYWxyZWFkeSBkaXNjb25uZWN0ZWQgc28gdGhlcmUgaXMgbm8gbmVlZCB0byBwYXNzIGEgY2FsbGJhY2tcbiAgICAgICAgLy8gd2hpY2ggY2xlYXJzIHJlc291cmNlcyBvciBub3RpZmllcyB0aGUgdXNlciBpbnRvICd3cmFwUmVjb3JkaW5nRXJyb3InLlxuICAgICAgICBhd2FpdCAoMCwgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEud3JhcFJlY29yZGluZ0Vycm9yKSh0aGlzLmRldmljZS5yZWxlYXNlSW50ZXJmYWNlKCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLnVzYkludGVyZmFjZU51bWJlcikpLCAoKSA9PiB7IH0pO1xuICAgICAgICB0aGlzLnVzYkludGVyZmFjZU51bWJlciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBhIHN5bmNocm9ub3VzIG1ldGhvZCB3aGljaCBjbGVhcnMgYWxsIHJlc291cmNlcy5cbiAgICAvLyBJdCBjYW4gYmUgdXNlZCBhcyBhIGNhbGxiYWNrIGZvciBlcnJvciBoYW5kbGluZy5cbiAgICByZWFjaERpc2Nvbm5lY3RTdGF0ZShkaXNjb25uZWN0TWVzc2FnZSkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlbGV0ZSB0aGUgc3RyZWFtcyBCRUZPUkUgY2hlY2tpbmcgdGhlIEFkYiBzdGF0ZSBiZWNhdXNlOlxuICAgICAgICAvL1xuICAgICAgICAvLyBXZSBjcmVhdGUgc3RyZWFtcyBiZWZvcmUgY2hhbmdpbmcgdGhlIEFkYiBzdGF0ZSBmcm9tIERJU0NPTk5FQ1RFRC5cbiAgICAgICAgLy8gSW4gY2FzZSB3ZSBjYW4gbm90IGNsYWltIHRoZSBkZXZpY2UsIHdlIHdpbGwgY3JlYXRlIGEgc3RyZWFtLCBidXQgZmFpbFxuICAgICAgICAvLyB0byBjb25uZWN0IHRvIHRoZSBXZWJVU0IgZGV2aWNlIHNvIHRoZSBzdGF0ZSB3aWxsIHJlbWFpbiBESVNDT05ORUNURUQuXG4gICAgICAgIGNvbnN0IHN0cmVhbXNUb0RlbGV0ZSA9IHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuZW50cmllcygpO1xuICAgICAgICAvLyBDbGVhciB0aGUgc3RyZWFtcyBiZWZvcmUgcmVqZWN0aW5nIHNvIHdlIGFyZSBub3QgY2F1Z2h0IGluIGEgbG9vcCBvZlxuICAgICAgICAvLyBoYW5kbGluZyBwcm9taXNlIHJlamVjdGlvbnMuXG4gICAgICAgIHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuY2xlYXIoKTtcbiAgICAgICAgZm9yIChjb25zdCBbaWQsIHN0cmVhbV0gb2Ygc3RyZWFtc1RvRGVsZXRlKSB7XG4gICAgICAgICAgICBzdHJlYW0ucmVqZWN0KGBGYWlsZWQgdG8gb3BlbiBzdHJlYW0gd2l0aCBpZCAke2lkfSBiZWNhdXNlIGFkYiB3YXMgZGlzY29ubmVjdGVkLmApO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5ESVNDT05ORUNURUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuRElTQ09OTkVDVEVEO1xuICAgICAgICB0aGlzLndyaXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLndyaXRlUXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy5zdHJlYW1zLmZvckVhY2goKHN0cmVhbSkgPT4gc3RyZWFtLmNsb3NlKCkpO1xuICAgICAgICB0aGlzLm9uRGlzY29ubmVjdChkaXNjb25uZWN0TWVzc2FnZSk7XG4gICAgfVxuICAgIGFzeW5jIHN0YXJ0QWRiQXV0aCgpIHtcbiAgICAgICAgY29uc3QgVkVSU0lPTiA9IHRoaXMudXNlQ2hlY2tzdW0gPyBleHBvcnRzLlZFUlNJT05fV0lUSF9DSEVDS1NVTSA6IGV4cG9ydHMuVkVSU0lPTl9OT19DSEVDS1NVTTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkFVVEhfU1RBUlRFRDtcbiAgICAgICAgYXdhaXQgdGhpcy5zZW5kTWVzc2FnZSgnQ05YTicsIFZFUlNJT04sIHRoaXMubWF4UGF5bG9hZCwgJ2hvc3Q6MTpVc2JBREInKTtcbiAgICB9XG4gICAgZmluZEVuZHBvaW50TnVtYmVyKGVuZHBvaW50cywgZGlyZWN0aW9uLCB0eXBlID0gJ2J1bGsnKSB7XG4gICAgICAgIGNvbnN0IGVwID0gZW5kcG9pbnRzLmZpbmQoKGVwKSA9PiBlcC50eXBlID09PSB0eXBlICYmIGVwLmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9uKTtcbiAgICAgICAgaWYgKGVwKVxuICAgICAgICAgICAgcmV0dXJuIGVwLmVuZHBvaW50TnVtYmVyO1xuICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoYENhbm5vdCBmaW5kICR7ZGlyZWN0aW9ufSBlbmRwb2ludGApO1xuICAgIH1cbiAgICBhc3luYyB1c2JSZWNlaXZlTG9vcCgpIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRGYWxzZSkodGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyk7XG4gICAgICAgIHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICBmb3IgKDsgdGhpcy5zdGF0ZSAhPT0gQWRiU3RhdGUuRElTQ09OTkVDVEVEOykge1xuICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgdGhpcy53cmFwVXNiKHRoaXMuZGV2aWNlLnRyYW5zZmVySW4odGhpcy51c2JSZWFkRW5kcG9pbnQsIEFEQl9NU0dfU0laRSkpO1xuICAgICAgICAgICAgaWYgKCFyZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXMgIT09ICdvaycpIHtcbiAgICAgICAgICAgICAgICAvLyBMb2cgYW5kIGlnbm9yZSBtZXNzYWdlcyB3aXRoIGludmFsaWQgc3RhdHVzLiBUaGVzZSBjYW4gb2NjdXJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBkZXZpY2UgaXMgY29ubmVjdGVkL2Rpc2Nvbm5lY3RlZCByZXBlYXRlZGx5LlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFJlY2VpdmVkIG1lc3NhZ2Ugd2l0aCB1bmV4cGVjdGVkIHN0YXR1cyAnJHtyZXMuc3RhdHVzfSdgKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IEFkYk1zZy5kZWNvZGVIZWFkZXIocmVzLmRhdGEpO1xuICAgICAgICAgICAgaWYgKG1zZy5kYXRhTGVuID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCB0aGlzLndyYXBVc2IodGhpcy5kZXZpY2UudHJhbnNmZXJJbih0aGlzLnVzYlJlYWRFbmRwb2ludCwgbXNnLmRhdGFMZW4pKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3ApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG1zZy5kYXRhID0gbmV3IFVpbnQ4QXJyYXkocmVzcC5kYXRhLmJ1ZmZlciwgcmVzcC5kYXRhLmJ5dGVPZmZzZXQsIHJlc3AuZGF0YS5ieXRlTGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnVzZUNoZWNrc3VtICYmIGdlbmVyYXRlQ2hlY2tzdW0obXNnLmRhdGEpICE9PSBtc2cuZGF0YUNoZWNrc3VtKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgaWdub3JlIG1lc3NhZ2VzIHdpdGggYW4gaW52YWxpZCBjaGVja3N1bS4gVGhlc2Ugc29tZXRpbWVzIGFwcGVhclxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIHBhZ2UgaXMgcmUtbG9hZGVkIGluIGEgbWlkZGxlIG9mIGEgcmVjb3JkaW5nLlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGhlIHNlcnZlciBjYW4gc3RpbGwgc2VuZCBtZXNzYWdlcyBzdHJlYW1zIGZvciBwcmV2aW91cyBzdHJlYW1zLlxuICAgICAgICAgICAgLy8gVGhpcyBoYXBwZW5zIGZvciBpbnN0YW5jZSBpZiB3ZSByZWNvcmQsIHJlbG9hZCB0aGUgcmVjb3JkaW5nIHBhZ2UgYW5kXG4gICAgICAgICAgICAvLyB0aGVuIHJlY29yZCBhZ2Fpbi4gV2UgY2FuIGFsc28gcmVjZWl2ZSBhICdXUlRFJyBvciAnT0tBWScgYWZ0ZXJcbiAgICAgICAgICAgIC8vIHdlIGhhdmUgc2VudCBhICdDTFNFJyBhbmQgbWFya2VkIHRoZSBzdGF0ZSBhcyBkaXNjb25uZWN0ZWQuXG4gICAgICAgICAgICBpZiAoKG1zZy5jbWQgPT09ICdDTFNFJyB8fCBtc2cuY21kID09PSAnV1JURScpICYmXG4gICAgICAgICAgICAgICAgIXRoaXMuZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChtc2cuYXJnMSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdPS0FZJyAmJiAhdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5oYXMobXNnLmFyZzEpICYmXG4gICAgICAgICAgICAgICAgIXRoaXMuZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChtc2cuYXJnMSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdBVVRIJyAmJiBtc2cuYXJnMCA9PT0gQXV0aENtZC5UT0tFTiAmJlxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkFVVEhfV0lUSF9QVUJMSUMpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBzdGFydCBhIHJlY29yZGluZyBidXQgZmFpbCBiZWNhdXNlIG9mIGEgZmF1bHR5IHBoeXNpY2FsXG4gICAgICAgICAgICAgICAgLy8gY29ubmVjdGlvbiB0byB0aGUgZGV2aWNlLCB3aGVuIHdlIHN0YXJ0IGEgbmV3IHJlY29yZGluZywgd2Ugd2lsbFxuICAgICAgICAgICAgICAgIC8vIHJlY2VpdmVkIG11bHRpcGxlIEFVVEggdG9rZW5zLCBvZiB3aGljaCB3ZSBzaG91bGQgaWdub3JlIGFsbCBidXRcbiAgICAgICAgICAgICAgICAvLyBvbmUuXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBoYW5kbGUgdGhlIEFEQiBtZXNzYWdlIGZyb20gdGhlIGRldmljZVxuICAgICAgICAgICAgaWYgKG1zZy5jbWQgPT09ICdDTFNFJykge1xuICAgICAgICAgICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobXNnLmFyZzEpKS5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ0FVVEgnICYmIG1zZy5hcmcwID09PSBBdXRoQ21kLlRPS0VOKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gYXdhaXQgdGhpcy5rZXlNYW5hZ2VyLmdldEtleSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5BVVRIX1NUQVJURUQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRHVyaW5nIHRoaXMgc3RlcCwgd2Ugc2VuZCBiYWNrIHRoZSB0b2tlbiByZWNlaXZlZCBzaWduZWQgd2l0aCBvdXJcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJpdmF0ZSBrZXkuIElmIHRoZSBkZXZpY2UgaGFzIHByZXZpb3VzbHkgcmVjZWl2ZWQgb3VyIHB1YmxpYyBrZXksXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBkaWFsb2cgYXNraW5nIGZvciB1c2VyIGNvbmZpcm1hdGlvbiB3aWxsIG5vdCBiZSBkaXNwbGF5ZWQgb25cbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGRldmljZS5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkFVVEhfV0lUSF9QUklWQVRFO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKCdBVVRIJywgQXV0aENtZC5TSUdOQVRVUkUsIDAsIGtleS5zaWduKG1zZy5kYXRhKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiBvdXIgc2lnbmF0dXJlIHdpdGggdGhlIHByaXZhdGUga2V5IGlzIG5vdCBhY2NlcHRlZCBieSB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gZGV2aWNlLCB3ZSBnZW5lcmF0ZSBhIG5ldyBrZXlwYWlyIGFuZCBzZW5kIHRoZSBwdWJsaWMga2V5LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuQVVUSF9XSVRIX1BVQkxJQztcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZW5kTWVzc2FnZSgnQVVUSCcsIEF1dGhDbWQuUlNBUFVCTElDS0VZLCAwLCBrZXkuZ2V0UHVibGljS2V5KCkgKyAnXFwwJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25TdGF0dXMocmVjb3JkaW5nX3V0aWxzXzEuQUxMT1dfVVNCX0RFQlVHR0lORyk7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0ICgwLCBhZGJfa2V5X21hbmFnZXJfMS5tYXliZVN0b3JlS2V5KShrZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdDTlhOJykge1xuICAgICAgICAgICAgICAgIC8vYXNzZXJ0VHJ1ZShcbiAgICAgICAgICAgICAgICAvLyAgICBbQWRiU3RhdGUuQVVUSF9XSVRIX1BSSVZBVEUsIEFkYlN0YXRlLkFVVEhfV0lUSF9QVUJMSUNdLmluY2x1ZGVzKFxuICAgICAgICAgICAgICAgIC8vICAgICAgICB0aGlzLnN0YXRlKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IEFkYlN0YXRlLkNPTk5FQ1RFRDtcbiAgICAgICAgICAgICAgICB0aGlzLm1heFBheWxvYWQgPSBtc2cuYXJnMTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXZpY2VWZXJzaW9uID0gbXNnLmFyZzA7XG4gICAgICAgICAgICAgICAgaWYgKCFbZXhwb3J0cy5WRVJTSU9OX1dJVEhfQ0hFQ0tTVU0sIGV4cG9ydHMuVkVSU0lPTl9OT19DSEVDS1NVTV0uaW5jbHVkZXMoZGV2aWNlVmVyc2lvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGBWZXJzaW9uICR7bXNnLmFyZzB9IG5vdCBzdXBwb3J0ZWQuYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMudXNlQ2hlY2tzdW0gPSBkZXZpY2VWZXJzaW9uID09PSBleHBvcnRzLlZFUlNJT05fV0lUSF9DSEVDS1NVTTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuQ09OTkVDVEVEO1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgd2lsbCByZXNvbHZlIHRoZSBwcm9taXNlcyBhd2FpdGVkIGJ5XG4gICAgICAgICAgICAgICAgLy8gXCJlbnN1cmVDb25uZWN0aW9uRXN0YWJsaXNoZWRcIi5cbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdDb25uUHJvbWlzZXMuZm9yRWFjaCgoY29ublByb21pc2UpID0+IGNvbm5Qcm9taXNlLnJlc29sdmUoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nQ29ublByb21pc2VzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnT0tBWScpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25uZWN0aW5nU3RyZWFtcy5oYXMobXNnLmFyZzEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbm5lY3RpbmdTdHJlYW0gPSAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5jb25uZWN0aW5nU3RyZWFtcy5nZXQobXNnLmFyZzEpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RyZWFtID0gbmV3IEFkYk92ZXJXZWJ1c2JTdHJlYW0odGhpcywgbXNnLmFyZzEsIG1zZy5hcmcwKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJlYW1zLmFkZChzdHJlYW0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmRlbGV0ZShtc2cuYXJnMSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RpbmdTdHJlYW0ucmVzb2x2ZShzdHJlYW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh0aGlzLndyaXRlSW5Qcm9ncmVzcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud3JpdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyB0aGlzLndyaXRlUXVldWUubGVuZ3RoOykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgZ28gdGhyb3VnaCB0aGUgcXVldWVkIHdyaXRlcyBhbmQgY2hvb3NlIHRoZSBmaXJzdCBvbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvcnJlc3BvbmRpbmcgdG8gYSBzdHJlYW0gdGhhdCdzIHN0aWxsIGFjdGl2ZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHF1ZXVlZEVsZW1lbnQgPSAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy53cml0ZVF1ZXVlLnNoaWZ0KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcXVldWVkU3RyZWFtID0gdGhpcy5nZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKHF1ZXVlZEVsZW1lbnQubG9jYWxTdHJlYW1JZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVldWVkU3RyZWFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVldWVkU3RyZWFtLndyaXRlKHF1ZXVlZEVsZW1lbnQubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnV1JURScpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdHJlYW0gPSAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5nZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKG1zZy5hcmcxKSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5zZW5kTWVzc2FnZSgnT0tBWScsIHN0cmVhbS5sb2NhbFN0cmVhbUlkLCBzdHJlYW0ucmVtb3RlU3RyZWFtSWQpO1xuICAgICAgICAgICAgICAgIHN0cmVhbS5zaWduYWxTdHJlYW1EYXRhKG1zZy5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoYFVuZXhwZWN0ZWQgbWVzc2FnZSAke21zZ30gaW4gc3RhdGUgJHt0aGlzLnN0YXRlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChsb2NhbFN0cmVhbUlkKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc3RyZWFtIG9mIHRoaXMuc3RyZWFtcykge1xuICAgICAgICAgICAgaWYgKHN0cmVhbS5sb2NhbFN0cmVhbUlkID09PSBsb2NhbFN0cmVhbUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cmVhbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyAgVGhlIGhlYWRlciBhbmQgdGhlIG1lc3NhZ2UgZGF0YSBtdXN0IGJlIHNlbnQgY29uc2VjdXRpdmVseS4gVXNpbmcgMiBhd2FpdHNcbiAgICAvLyAgQW5vdGhlciBtZXNzYWdlIGNhbiBpbnRlcmxlYXZlIGFmdGVyIHRoZSBmaXJzdCBoZWFkZXIgaGFzIGJlZW4gc2VudCxcbiAgICAvLyAgcmVzdWx0aW5nIGluIHNvbWV0aGluZyBsaWtlIFtoZWFkZXIxXSBbaGVhZGVyMl0gW2RhdGExXSBbZGF0YTJdO1xuICAgIC8vICBJbiB0aGlzIHdheSB3ZSBhcmUgd2FpdGluZyBib3RoIHByb21pc2VzIHRvIGJlIHJlc29sdmVkIGJlZm9yZSBjb250aW51aW5nLlxuICAgIGFzeW5jIHNlbmRNZXNzYWdlKGNtZCwgYXJnMCwgYXJnMSwgZGF0YSkge1xuICAgICAgICBjb25zdCBtc2cgPSBBZGJNc2cuY3JlYXRlKHsgY21kLCBhcmcwLCBhcmcxLCBkYXRhLCB1c2VDaGVja3N1bTogdGhpcy51c2VDaGVja3N1bSB9KTtcbiAgICAgICAgY29uc3QgbXNnSGVhZGVyID0gbXNnLmVuY29kZUhlYWRlcigpO1xuICAgICAgICBjb25zdCBtc2dEYXRhID0gbXNnLmRhdGE7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkobXNnSGVhZGVyLmxlbmd0aCA8PSB0aGlzLm1heFBheWxvYWQgJiZcbiAgICAgICAgICAgIG1zZ0RhdGEubGVuZ3RoIDw9IHRoaXMubWF4UGF5bG9hZCk7XG4gICAgICAgIGNvbnN0IHNlbmRQcm9taXNlcyA9IFt0aGlzLndyYXBVc2IodGhpcy5kZXZpY2UudHJhbnNmZXJPdXQodGhpcy51c2JXcml0ZUVwRW5kcG9pbnQsIG1zZ0hlYWRlci5idWZmZXIpKV07XG4gICAgICAgIGlmIChtc2cuZGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZXMucHVzaCh0aGlzLndyYXBVc2IodGhpcy5kZXZpY2UudHJhbnNmZXJPdXQodGhpcy51c2JXcml0ZUVwRW5kcG9pbnQsIG1zZ0RhdGEuYnVmZmVyKSkpO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKHNlbmRQcm9taXNlcyk7XG4gICAgfVxuICAgIHdyYXBVc2IocHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gKDAsIHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLndyYXBSZWNvcmRpbmdFcnJvcikocHJvbWlzZSwgdGhpcy5yZWFjaERpc2Nvbm5lY3RTdGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG59XG5leHBvcnRzLkFkYkNvbm5lY3Rpb25PdmVyV2VidXNiID0gQWRiQ29ubmVjdGlvbk92ZXJXZWJ1c2I7XG4vLyBBbiBBZGJPdmVyV2VidXNiU3RyZWFtIGlzIGluc3RhbnRpYXRlZCBhZnRlciB0aGUgY3JlYXRpb24gb2YgYSBzb2NrZXQgdG8gdGhlXG4vLyBkZXZpY2UuIFRoYW5rcyB0byB0aGlzLCB3ZSBjYW4gc2VuZCBjb21tYW5kcyBhbmQgcmVjZWl2ZSB0aGVpciBvdXRwdXQuXG4vLyBNZXNzYWdlcyBhcmUgcmVjZWl2ZWQgaW4gdGhlIG1haW4gYWRiIGNsYXNzLCBhbmQgYXJlIGZvcndhcmRlZCB0byBhbiBpbnN0YW5jZVxuLy8gb2YgdGhpcyBjbGFzcyBiYXNlZCBvbiBhIHN0cmVhbSBpZCBtYXRjaC5cbmNsYXNzIEFkYk92ZXJXZWJ1c2JTdHJlYW0ge1xuICAgIGNvbnN0cnVjdG9yKGFkYiwgbG9jYWxTdHJlYW1JZCwgcmVtb3RlU3RyZWFtSWQpIHtcbiAgICAgICAgdGhpcy5vblN0cmVhbURhdGFDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5vblN0cmVhbUNsb3NlQ2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMucmVtb3RlU3RyZWFtSWQgPSAtMTtcbiAgICAgICAgdGhpcy5hZGJDb25uZWN0aW9uID0gYWRiO1xuICAgICAgICB0aGlzLmxvY2FsU3RyZWFtSWQgPSBsb2NhbFN0cmVhbUlkO1xuICAgICAgICB0aGlzLnJlbW90ZVN0cmVhbUlkID0gcmVtb3RlU3RyZWFtSWQ7XG4gICAgICAgIC8vIFdoZW4gdGhlIHN0cmVhbSBpcyBjcmVhdGVkLCB0aGUgY29ubmVjdGlvbiBoYXMgYmVlbiBhbHJlYWR5IGVzdGFibGlzaGVkLlxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgfVxuICAgIGFkZE9uU3RyZWFtRGF0YUNhbGxiYWNrKG9uU3RyZWFtRGF0YSkge1xuICAgICAgICB0aGlzLm9uU3RyZWFtRGF0YUNhbGxiYWNrcy5wdXNoKG9uU3RyZWFtRGF0YSk7XG4gICAgfVxuICAgIGFkZE9uU3RyZWFtQ2xvc2VDYWxsYmFjayhvblN0cmVhbUNsb3NlKSB7XG4gICAgICAgIHRoaXMub25TdHJlYW1DbG9zZUNhbGxiYWNrcy5wdXNoKG9uU3RyZWFtQ2xvc2UpO1xuICAgIH1cbiAgICAvLyBVc2VkIGJ5IHRoZSBjb25uZWN0aW9uIG9iamVjdCB0byBzaWduYWwgbmV3bHkgcmVjZWl2ZWQgZGF0YSwgbm90IGV4cG9zZWRcbiAgICAvLyBpbiB0aGUgaW50ZXJmYWNlLlxuICAgIHNpZ25hbFN0cmVhbURhdGEoZGF0YSkge1xuICAgICAgICBmb3IgKGNvbnN0IG9uU3RyZWFtRGF0YSBvZiB0aGlzLm9uU3RyZWFtRGF0YUNhbGxiYWNrcykge1xuICAgICAgICAgICAgb25TdHJlYW1EYXRhKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFVzZWQgYnkgdGhlIGNvbm5lY3Rpb24gb2JqZWN0IHRvIHNpZ25hbCB0aGUgc3RyZWFtIGlzIGNsb3NlZCwgbm90IGV4cG9zZWRcbiAgICAvLyBpbiB0aGUgaW50ZXJmYWNlLlxuICAgIHNpZ25hbFN0cmVhbUNsb3NlZCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBvblN0cmVhbUNsb3NlIG9mIHRoaXMub25TdHJlYW1DbG9zZUNhbGxiYWNrcykge1xuICAgICAgICAgICAgb25TdHJlYW1DbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25TdHJlYW1EYXRhQ2FsbGJhY2tzID0gW107XG4gICAgICAgIHRoaXMub25TdHJlYW1DbG9zZUNhbGxiYWNrcyA9IFtdO1xuICAgIH1cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgdGhpcy5jbG9zZUFuZFdhaXRGb3JUZWFyZG93bigpO1xuICAgIH1cbiAgICBhc3luYyBjbG9zZUFuZFdhaXRGb3JUZWFyZG93bigpIHtcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgYXdhaXQgdGhpcy5hZGJDb25uZWN0aW9uLnN0cmVhbUNsb3NlKHRoaXMpO1xuICAgIH1cbiAgICB3cml0ZShtc2cpIHtcbiAgICAgICAgdGhpcy5hZGJDb25uZWN0aW9uLnN0cmVhbVdyaXRlKG1zZywgdGhpcyk7XG4gICAgfVxuICAgIGlzQ29ubmVjdGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNDb25uZWN0ZWQ7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJPdmVyV2VidXNiU3RyZWFtID0gQWRiT3ZlcldlYnVzYlN0cmVhbTtcbmNvbnN0IEFEQl9NU0dfU0laRSA9IDYgKiA0OyAvLyA2ICogaW50MzIuXG5jbGFzcyBBZGJNc2cge1xuICAgIGNvbnN0cnVjdG9yKGNtZCwgYXJnMCwgYXJnMSwgZGF0YUxlbiwgZGF0YUNoZWNrc3VtLCB1c2VDaGVja3N1bSA9IGZhbHNlKSB7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkoY21kLmxlbmd0aCA9PT0gNCk7XG4gICAgICAgIHRoaXMuY21kID0gY21kO1xuICAgICAgICB0aGlzLmFyZzAgPSBhcmcwO1xuICAgICAgICB0aGlzLmFyZzEgPSBhcmcxO1xuICAgICAgICB0aGlzLmRhdGFMZW4gPSBkYXRhTGVuO1xuICAgICAgICB0aGlzLmRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhTGVuKTtcbiAgICAgICAgdGhpcy5kYXRhQ2hlY2tzdW0gPSBkYXRhQ2hlY2tzdW07XG4gICAgICAgIHRoaXMudXNlQ2hlY2tzdW0gPSB1c2VDaGVja3N1bTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZSh7IGNtZCwgYXJnMCwgYXJnMSwgZGF0YSwgdXNlQ2hlY2tzdW0gPSB0cnVlIH0pIHtcbiAgICAgICAgY29uc3QgZW5jb2RlZERhdGEgPSB0aGlzLmVuY29kZURhdGEoZGF0YSk7XG4gICAgICAgIGNvbnN0IG1zZyA9IG5ldyBBZGJNc2coY21kLCBhcmcwLCBhcmcxLCBlbmNvZGVkRGF0YS5sZW5ndGgsIDAsIHVzZUNoZWNrc3VtKTtcbiAgICAgICAgbXNnLmRhdGEgPSBlbmNvZGVkRGF0YTtcbiAgICAgICAgcmV0dXJuIG1zZztcbiAgICB9XG4gICAgZ2V0IGRhdGFTdHIoKSB7XG4gICAgICAgIHJldHVybiB0ZXh0RGVjb2Rlci5kZWNvZGUodGhpcy5kYXRhKTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgJHt0aGlzLmNtZH0gWyR7dGhpcy5hcmcwfSwke3RoaXMuYXJnMX1dICR7dGhpcy5kYXRhU3RyfWA7XG4gICAgfVxuICAgIC8vIEEgYnJpZWYgZGVzY3JpcHRpb24gb2YgdGhlIG1lc3NhZ2UgY2FuIGJlIGZvdW5kIGhlcmU6XG4gICAgLy8gaHR0cHM6Ly9hbmRyb2lkLmdvb2dsZXNvdXJjZS5jb20vcGxhdGZvcm0vc3lzdGVtL2NvcmUvKy9tYWluL2FkYi9wcm90b2NvbC50eHRcbiAgICAvL1xuICAgIC8vIHN0cnVjdCBhbWVzc2FnZSB7XG4gICAgLy8gICAgIHVpbnQzMl90IGNvbW1hbmQ7ICAgIC8vIGNvbW1hbmQgaWRlbnRpZmllciBjb25zdGFudFxuICAgIC8vICAgICB1aW50MzJfdCBhcmcwOyAgICAgICAvLyBmaXJzdCBhcmd1bWVudFxuICAgIC8vICAgICB1aW50MzJfdCBhcmcxOyAgICAgICAvLyBzZWNvbmQgYXJndW1lbnRcbiAgICAvLyAgICAgdWludDMyX3QgZGF0YV9sZW5ndGg7Ly8gbGVuZ3RoIG9mIHBheWxvYWQgKDAgaXMgYWxsb3dlZClcbiAgICAvLyAgICAgdWludDMyX3QgZGF0YV9jaGVjazsgLy8gY2hlY2tzdW0gb2YgZGF0YSBwYXlsb2FkXG4gICAgLy8gICAgIHVpbnQzMl90IG1hZ2ljOyAgICAgIC8vIGNvbW1hbmQgXiAweGZmZmZmZmZmXG4gICAgLy8gfTtcbiAgICBzdGF0aWMgZGVjb2RlSGVhZGVyKGR2KSB7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkoZHYuYnl0ZUxlbmd0aCA9PT0gQURCX01TR19TSVpFKTtcbiAgICAgICAgY29uc3QgY21kID0gdGV4dERlY29kZXIuZGVjb2RlKGR2LmJ1ZmZlci5zbGljZSgwLCA0KSk7XG4gICAgICAgIGNvbnN0IGNtZE51bSA9IGR2LmdldFVpbnQzMigwLCB0cnVlKTtcbiAgICAgICAgY29uc3QgYXJnMCA9IGR2LmdldFVpbnQzMig0LCB0cnVlKTtcbiAgICAgICAgY29uc3QgYXJnMSA9IGR2LmdldFVpbnQzMig4LCB0cnVlKTtcbiAgICAgICAgY29uc3QgZGF0YUxlbiA9IGR2LmdldFVpbnQzMigxMiwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGRhdGFDaGVja3N1bSA9IGR2LmdldFVpbnQzMigxNiwgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGNtZENoZWNrc3VtID0gZHYuZ2V0VWludDMyKDIwLCB0cnVlKTtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShjbWROdW0gPT09IChjbWRDaGVja3N1bSBeIDB4RkZGRkZGRkYpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBBZGJNc2coY21kLCBhcmcwLCBhcmcxLCBkYXRhTGVuLCBkYXRhQ2hlY2tzdW0pO1xuICAgIH1cbiAgICBlbmNvZGVIZWFkZXIoKSB7XG4gICAgICAgIGNvbnN0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KEFEQl9NU0dfU0laRSk7XG4gICAgICAgIGNvbnN0IGR2ID0gbmV3IERhdGFWaWV3KGJ1Zi5idWZmZXIpO1xuICAgICAgICBjb25zdCBjbWRCeXRlcyA9IHRleHRFbmNvZGVyLmVuY29kZSh0aGlzLmNtZCk7XG4gICAgICAgIGNvbnN0IHJhd01zZyA9IEFkYk1zZy5lbmNvZGVEYXRhKHRoaXMuZGF0YSk7XG4gICAgICAgIGNvbnN0IGNoZWNrc3VtID0gdGhpcy51c2VDaGVja3N1bSA/IGdlbmVyYXRlQ2hlY2tzdW0ocmF3TXNnKSA6IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKVxuICAgICAgICAgICAgZHYuc2V0VWludDgoaSwgY21kQnl0ZXNbaV0pO1xuICAgICAgICBkdi5zZXRVaW50MzIoNCwgdGhpcy5hcmcwLCB0cnVlKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDgsIHRoaXMuYXJnMSwgdHJ1ZSk7XG4gICAgICAgIGR2LnNldFVpbnQzMigxMiwgcmF3TXNnLmJ5dGVMZW5ndGgsIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMTYsIGNoZWNrc3VtLCB0cnVlKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDIwLCBkdi5nZXRVaW50MzIoMCwgdHJ1ZSkgXiAweEZGRkZGRkZGLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGJ1ZjtcbiAgICB9XG4gICAgc3RhdGljIGVuY29kZURhdGEoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVaW50OEFycmF5KFtdKTtcbiAgICAgICAgaWYgKCgwLCBvYmplY3RfdXRpbHNfMS5pc1N0cmluZykoZGF0YSkpXG4gICAgICAgICAgICByZXR1cm4gdGV4dEVuY29kZXIuZW5jb2RlKGRhdGEgKyAnXFwwJyk7XG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZGJGaWxlSGFuZGxlciA9IHZvaWQgMDtcbmNvbnN0IGN1c3RvbV91dGlsc18xID0gcmVxdWlyZShcImN1c3RvbV91dGlsc1wiKTtcbmNvbnN0IGRlZmVycmVkXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9kZWZlcnJlZFwiKTtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2xvZ2dpbmdcIik7XG5jb25zdCBhcnJheV9idWZmZXJfYnVpbGRlcl8xID0gcmVxdWlyZShcIi4uL2FycmF5X2J1ZmZlcl9idWlsZGVyXCIpO1xuY29uc3QgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEgPSByZXF1aXJlKFwiLi9yZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdcIik7XG5jb25zdCByZWNvcmRpbmdfdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3JlY29yZGluZ191dGlsc1wiKTtcbi8vIGh0dHBzOi8vY3MuYW5kcm9pZC5jb20vYW5kcm9pZC9wbGF0Zm9ybS9zdXBlcnByb2plY3QvKy9tYWluOnBhY2thZ2VzL1xuLy8gbW9kdWxlcy9hZGIvZmlsZV9zeW5jX3Byb3RvY29sLmg7bD0xNDRcbmNvbnN0IE1BWF9TWU5DX1NFTkRfQ0hVTktfU0laRSA9IDY0ICogMTAyNDtcbi8vIEFkYiBkb2VzIG5vdCBhY2N1cmF0ZWx5IHNlbmQgc29tZSBmaWxlIHBlcm1pc3Npb25zLiBJZiB5b3UgbmVlZCBhIHNwZWNpYWwgc2V0XG4vLyBvZiBwZXJtaXNzaW9ucywgZG8gbm90IHJlbHkgb24gdGhpcyB2YWx1ZS4gUmF0aGVyLCBzZW5kIGEgc2hlbGwgY29tbWFuZCB3aGljaFxuLy8gZXhwbGljaXRseSBzZXRzIHBlcm1pc3Npb25zLCBzdWNoIGFzOlxuLy8gJ3NoZWxsOmNobW9kICR7cGVybWlzc2lvbnN9ICR7cGF0aH0nXG5jb25zdCBGSUxFX1BFUk1JU1NJT05TID0gMiAqKiAxNSArIDBvNjQ0O1xuY29uc3QgdGV4dERlY29kZXIgPSBuZXcgY3VzdG9tX3V0aWxzXzEuX1RleHREZWNvZGVyKCk7XG4vLyBGb3IgZGV0YWlscyBhYm91dCB0aGUgcHJvdG9jb2wsIHNlZTpcbi8vIGh0dHBzOi8vY3MuYW5kcm9pZC5jb20vYW5kcm9pZC9wbGF0Zm9ybS9zdXBlcnByb2plY3QvKy9tYWluOnBhY2thZ2VzL21vZHVsZXMvYWRiL1NZTkMuVFhUXG5jbGFzcyBBZGJGaWxlSGFuZGxlciB7XG4gICAgY29uc3RydWN0b3IoYnl0ZVN0cmVhbSkge1xuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0gPSBieXRlU3RyZWFtO1xuICAgICAgICB0aGlzLnNlbnRCeXRlQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmlzUHVzaE9uZ29pbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgYXN5bmMgcHVzaEJpbmFyeShiaW5hcnksIHBhdGgpIHtcbiAgICAgICAgLy8gRm9yIGEgZ2l2ZW4gYnl0ZVN0cmVhbSwgd2Ugb25seSBzdXBwb3J0IHB1c2hpbmcgb25lIGJpbmFyeSBhdCBhIHRpbWUuXG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0RmFsc2UpKHRoaXMuaXNQdXNoT25nb2luZyk7XG4gICAgICAgIHRoaXMuaXNQdXNoT25nb2luZyA9IHRydWU7XG4gICAgICAgIGNvbnN0IHRyYW5zZmVyRmluaXNoZWQgPSAoMCwgZGVmZXJyZWRfMS5kZWZlcikoKTtcbiAgICAgICAgdGhpcy5ieXRlU3RyZWFtLmFkZE9uU3RyZWFtRGF0YUNhbGxiYWNrKChkYXRhKSA9PiB0aGlzLm9uU3RyZWFtRGF0YShkYXRhLCB0cmFuc2ZlckZpbmlzaGVkKSk7XG4gICAgICAgIHRoaXMuYnl0ZVN0cmVhbS5hZGRPblN0cmVhbUNsb3NlQ2FsbGJhY2soKCkgPT4gdGhpcy5pc1B1c2hPbmdvaW5nID0gZmFsc2UpO1xuICAgICAgICBjb25zdCBzZW5kTWVzc2FnZSA9IG5ldyBhcnJheV9idWZmZXJfYnVpbGRlcl8xLkFycmF5QnVmZmVyQnVpbGRlcigpO1xuICAgICAgICAvLyAnU0VORCcgaXMgdGhlIEFQSSBtZXRob2QgdXNlZCB0byBzZW5kIGEgZmlsZSB0byBkZXZpY2UuXG4gICAgICAgIHNlbmRNZXNzYWdlLmFwcGVuZCgnU0VORCcpO1xuICAgICAgICAvLyBUaGUgcmVtb3RlIGZpbGUgbmFtZSBpcyBzcGxpdCBpbnRvIHR3byBwYXJ0cyBzZXBhcmF0ZWQgYnkgdGhlIGxhc3RcbiAgICAgICAgLy8gY29tbWEgKFwiLFwiKS4gVGhlIGZpcnN0IHBhcnQgaXMgdGhlIGFjdHVhbCBwYXRoLCB3aGlsZSB0aGUgc2Vjb25kIGlzIGFcbiAgICAgICAgLy8gZGVjaW1hbCBlbmNvZGVkIGZpbGUgbW9kZSBjb250YWluaW5nIHRoZSBwZXJtaXNzaW9ucyBvZiB0aGUgZmlsZSBvblxuICAgICAgICAvLyBkZXZpY2UuXG4gICAgICAgIHNlbmRNZXNzYWdlLmFwcGVuZChwYXRoLmxlbmd0aCArIDYpO1xuICAgICAgICBzZW5kTWVzc2FnZS5hcHBlbmQocGF0aCk7XG4gICAgICAgIHNlbmRNZXNzYWdlLmFwcGVuZCgnLCcpO1xuICAgICAgICBzZW5kTWVzc2FnZS5hcHBlbmQoRklMRV9QRVJNSVNTSU9OUy50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5ieXRlU3RyZWFtLndyaXRlKG5ldyBVaW50OEFycmF5KHNlbmRNZXNzYWdlLnRvQXJyYXlCdWZmZXIoKSkpO1xuICAgICAgICB3aGlsZSAoIShhd2FpdCB0aGlzLnNlbmROZXh0RGF0YUNodW5rKGJpbmFyeSkpKVxuICAgICAgICAgICAgO1xuICAgICAgICByZXR1cm4gdHJhbnNmZXJGaW5pc2hlZDtcbiAgICB9XG4gICAgb25TdHJlYW1EYXRhKGRhdGEsIHRyYW5zZmVyRmluaXNoZWQpIHtcbiAgICAgICAgdGhpcy5zZW50Qnl0ZUNvdW50ID0gMDtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB0ZXh0RGVjb2Rlci5kZWNvZGUoZGF0YSk7XG4gICAgICAgIGlmIChyZXNwb25zZS5zcGxpdCgnXFxuJylbMF0uaW5jbHVkZXMoJ0ZBSUwnKSkge1xuICAgICAgICAgICAgLy8gU2FtcGxlIGZhaWx1cmUgcmVzcG9uc2UgKHdoZW4gdGhlIGZpbGUgaXMgdHJhbnNmZXJyZWQgc3VjY2Vzc2Z1bGx5XG4gICAgICAgICAgICAvLyBidXQgdGhlIGRhdGUgaXMgbm90IGZvcm1hdHRlZCBjb3JyZWN0bHkpOlxuICAgICAgICAgICAgLy8gJ09LQVlGQUlMXFxucGF0aCB0b28gbG9uZydcbiAgICAgICAgICAgIHRyYW5zZmVyRmluaXNoZWQucmVqZWN0KG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihgJHtyZWNvcmRpbmdfdXRpbHNfMS5CSU5BUllfUFVTSF9GQUlMVVJFfTogJHtyZXNwb25zZX1gKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGV4dERlY29kZXIuZGVjb2RlKGRhdGEpLnN1YnN0cmluZygwLCA0KSA9PT0gJ09LQVknKSB7XG4gICAgICAgICAgICAvLyBJbiBjYXNlIG9mIHN1Y2Nlc3MsIHRoZSBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhlIGxhc3QgcmVxdWVzdCB3aXRoXG4gICAgICAgICAgICAvLyAnT0tBWScuXG4gICAgICAgICAgICB0cmFuc2ZlckZpbmlzaGVkLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihgJHtyZWNvcmRpbmdfdXRpbHNfMS5CSU5BUllfUFVTSF9VTktOT1dOX1JFU1BPTlNFfTogJHtyZXNwb25zZX1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBzZW5kTmV4dERhdGFDaHVuayhiaW5hcnkpIHtcbiAgICAgICAgY29uc3QgZW5kUG9zaXRpb24gPSBNYXRoLm1pbih0aGlzLnNlbnRCeXRlQ291bnQgKyBNQVhfU1lOQ19TRU5EX0NIVU5LX1NJWkUsIGJpbmFyeS5ieXRlTGVuZ3RoKTtcbiAgICAgICAgY29uc3QgY2h1bmsgPSBhd2FpdCBiaW5hcnkuc2xpY2UodGhpcy5zZW50Qnl0ZUNvdW50LCBlbmRQb3NpdGlvbik7XG4gICAgICAgIC8vIFRoZSBmaWxlIGlzIHNlbnQgaW4gY2h1bmtzLiBFYWNoIGNodW5rIGlzIHByZWZpeGVkIHdpdGggXCJEQVRBXCIgYW5kIHRoZVxuICAgICAgICAvLyBjaHVuayBsZW5ndGguIFRoaXMgaXMgcmVwZWF0ZWQgdW50aWwgdGhlIGVudGlyZSBmaWxlIGlzIHRyYW5zZmVycmVkLiBFYWNoXG4gICAgICAgIC8vIGNodW5rIG11c3Qgbm90IGJlIGxhcmdlciB0aGFuIDY0ay5cbiAgICAgICAgY29uc3QgY2h1bmtMZW5ndGggPSBjaHVuay5ieXRlTGVuZ3RoO1xuICAgICAgICBjb25zdCBkYXRhTWVzc2FnZSA9IG5ldyBhcnJheV9idWZmZXJfYnVpbGRlcl8xLkFycmF5QnVmZmVyQnVpbGRlcigpO1xuICAgICAgICBkYXRhTWVzc2FnZS5hcHBlbmQoJ0RBVEEnKTtcbiAgICAgICAgZGF0YU1lc3NhZ2UuYXBwZW5kKGNodW5rTGVuZ3RoKTtcbiAgICAgICAgZGF0YU1lc3NhZ2UuYXBwZW5kKG5ldyBVaW50OEFycmF5KGNodW5rLmJ1ZmZlciwgY2h1bmsuYnl0ZU9mZnNldCwgY2h1bmtMZW5ndGgpKTtcbiAgICAgICAgdGhpcy5zZW50Qnl0ZUNvdW50ICs9IGNodW5rTGVuZ3RoO1xuICAgICAgICBjb25zdCBpc0RvbmUgPSB0aGlzLnNlbnRCeXRlQ291bnQgPT09IGJpbmFyeS5ieXRlTGVuZ3RoO1xuICAgICAgICBpZiAoaXNEb25lKSB7XG4gICAgICAgICAgICAvLyBXaGVuIHRoZSBmaWxlIGlzIHRyYW5zZmVycmVkIGEgc3luYyByZXF1ZXN0IFwiRE9ORVwiIGlzIHNlbnQsIHRvZ2V0aGVyXG4gICAgICAgICAgICAvLyB3aXRoIGEgdGltZXN0YW1wLCByZXByZXNlbnRpbmcgdGhlIGxhc3QgbW9kaWZpZWQgdGltZSBmb3IgdGhlIGZpbGUuIFRoZVxuICAgICAgICAgICAgLy8gc2VydmVyIHJlc3BvbmRzIHRvIHRoaXMgbGFzdCByZXF1ZXN0LlxuICAgICAgICAgICAgZGF0YU1lc3NhZ2UuYXBwZW5kKCdET05FJyk7XG4gICAgICAgICAgICAvLyBXZSBzZW5kIHRoZSBkYXRlIGluIHNlY29uZHMuXG4gICAgICAgICAgICBkYXRhTWVzc2FnZS5hcHBlbmQoTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gMTAwMCkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnl0ZVN0cmVhbS53cml0ZShuZXcgVWludDhBcnJheShkYXRhTWVzc2FnZS50b0FycmF5QnVmZmVyKCkpKTtcbiAgICAgICAgcmV0dXJuIGlzRG9uZTtcbiAgICB9XG59XG5leHBvcnRzLkFkYkZpbGVIYW5kbGVyID0gQWRiRmlsZUhhbmRsZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiS2V5ID0gdm9pZCAwO1xuY29uc3QganNibl9yc2FfMSA9IHJlcXVpcmUoXCJqc2JuLXJzYVwiKTtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9iYXNlL2xvZ2dpbmdcIik7XG5jb25zdCBzdHJpbmdfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9iYXNlL3N0cmluZ191dGlsc1wiKTtcbmNvbnN0IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xID0gcmVxdWlyZShcIi4uL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZ1wiKTtcbmNvbnN0IFdPUkRfU0laRSA9IDQ7XG5jb25zdCBNT0RVTFVTX1NJWkVfQklUUyA9IDIwNDg7XG5jb25zdCBNT0RVTFVTX1NJWkUgPSBNT0RVTFVTX1NJWkVfQklUUyAvIDg7XG5jb25zdCBNT0RVTFVTX1NJWkVfV09SRFMgPSBNT0RVTFVTX1NJWkUgLyBXT1JEX1NJWkU7XG5jb25zdCBQVUJLRVlfRU5DT0RFRF9TSVpFID0gMyAqIFdPUkRfU0laRSArIDIgKiBNT0RVTFVTX1NJWkU7XG5jb25zdCBBREJfV0VCX0NSWVBUT19BTEdPUklUSE0gPSB7XG4gICAgbmFtZTogJ1JTQVNTQS1QS0NTMS12MV81JyxcbiAgICBoYXNoOiB7IG5hbWU6ICdTSEEtMScgfSxcbiAgICBwdWJsaWNFeHBvbmVudDogbmV3IFVpbnQ4QXJyYXkoWzB4MDEsIDB4MDAsIDB4MDFdKSwgLy8gNjU1MzdcbiAgICBtb2R1bHVzTGVuZ3RoOiBNT0RVTFVTX1NJWkVfQklUUyxcbn07XG5jb25zdCBBREJfV0VCX0NSWVBUT19FWFBPUlRBQkxFID0gdHJ1ZTtcbmNvbnN0IEFEQl9XRUJfQ1JZUFRPX09QRVJBVElPTlMgPSBbJ3NpZ24nXTtcbmNvbnN0IFNJR05JTkdfQVNOMV9QUkVGSVggPSBbXG4gICAgMHgwMCxcbiAgICAweDMwLFxuICAgIDB4MjEsXG4gICAgMHgzMCxcbiAgICAweDA5LFxuICAgIDB4MDYsXG4gICAgMHgwNSxcbiAgICAweDJCLFxuICAgIDB4MEUsXG4gICAgMHgwMyxcbiAgICAweDAyLFxuICAgIDB4MUEsXG4gICAgMHgwNSxcbiAgICAweDAwLFxuICAgIDB4MDQsXG4gICAgMHgxNCxcbl07XG5jb25zdCBSMzIgPSBqc2JuX3JzYV8xLkJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdCgzMik7IC8vIDEgPDwgMzJcbmZ1bmN0aW9uIGlzVmFsaWRKc29uV2ViS2V5KGtleSkge1xuICAgIHJldHVybiBrZXkubiAhPT0gdW5kZWZpbmVkICYmIGtleS5lICE9PSB1bmRlZmluZWQgJiYga2V5LmQgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBrZXkucCAhPT0gdW5kZWZpbmVkICYmIGtleS5xICE9PSB1bmRlZmluZWQgJiYga2V5LmRwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAga2V5LmRxICE9PSB1bmRlZmluZWQgJiYga2V5LnFpICE9PSB1bmRlZmluZWQ7XG59XG4vLyBDb252ZXJ0IGEgQmlnSW50ZWdlciB0byBhbiBhcnJheSBvZiBhIHNwZWNpZmllZCBzaXplIGluIGJ5dGVzLlxuZnVuY3Rpb24gYmlnSW50VG9GaXhlZEJ5dGVBcnJheShibiwgc2l6ZSkge1xuICAgIGNvbnN0IHBhZGRlZEJuQnl0ZXMgPSBibi50b0J5dGVBcnJheSgpO1xuICAgIGxldCBmaXJzdE5vblplcm9JbmRleCA9IDA7XG4gICAgd2hpbGUgKGZpcnN0Tm9uWmVyb0luZGV4IDwgcGFkZGVkQm5CeXRlcy5sZW5ndGggJiZcbiAgICAgICAgcGFkZGVkQm5CeXRlc1tmaXJzdE5vblplcm9JbmRleF0gPT09IDApIHtcbiAgICAgICAgZmlyc3ROb25aZXJvSW5kZXgrKztcbiAgICB9XG4gICAgY29uc3QgYm5CeXRlcyA9IFVpbnQ4QXJyYXkuZnJvbShwYWRkZWRCbkJ5dGVzLnNsaWNlKGZpcnN0Tm9uWmVyb0luZGV4KSk7XG4gICAgY29uc3QgcmVzID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7XG4gICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShibkJ5dGVzLmxlbmd0aCA8PSByZXMubGVuZ3RoKTtcbiAgICByZXMuc2V0KGJuQnl0ZXMsIHJlcy5sZW5ndGggLSBibkJ5dGVzLmxlbmd0aCk7XG4gICAgcmV0dXJuIHJlcztcbn1cbmNsYXNzIEFkYktleSB7XG4gICAgY29uc3RydWN0b3IoandrUHJpdmF0ZSkge1xuICAgICAgICB0aGlzLmp3a1ByaXZhdGUgPSBqd2tQcml2YXRlO1xuICAgIH1cbiAgICBzdGF0aWMgYXN5bmMgR2VuZXJhdGVOZXdLZXlQYWlyKCkge1xuICAgICAgICAvLyBDb25zdHJ1Y3QgYSBuZXcgQ3J5cHRvS2V5UGFpciBhbmQga2VlcCBpdHMgcHJpdmF0ZSBrZXkgaW4gSldCIGZvcm1hdC5cbiAgICAgICAgY29uc3Qga2V5UGFpciA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZ2VuZXJhdGVLZXkoQURCX1dFQl9DUllQVE9fQUxHT1JJVEhNLCBBREJfV0VCX0NSWVBUT19FWFBPUlRBQkxFLCBBREJfV0VCX0NSWVBUT19PUEVSQVRJT05TKTtcbiAgICAgICAgY29uc3QgandrUHJpdmF0ZSA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZXhwb3J0S2V5KCdqd2snLCBrZXlQYWlyLnByaXZhdGVLZXkpO1xuICAgICAgICBpZiAoIWlzVmFsaWRKc29uV2ViS2V5KGp3a1ByaXZhdGUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoJ0NvdWxkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIHByaXZhdGUga2V5LicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQWRiS2V5KGp3a1ByaXZhdGUpO1xuICAgIH1cbiAgICBzdGF0aWMgRGVzZXJpYWxpemVLZXkoc2VyaWFsaXplZEtleSkge1xuICAgICAgICByZXR1cm4gbmV3IEFkYktleShKU09OLnBhcnNlKHNlcmlhbGl6ZWRLZXkpKTtcbiAgICB9XG4gICAgLy8gUGVyZm9ybSBhbiBSU0Egc2lnbmluZyBvcGVyYXRpb24gZm9yIHRoZSBBREIgYXV0aCBjaGFsbGVuZ2UuXG4gICAgLy9cbiAgICAvLyBGb3IgdGhlIFJTQSBzaWduYXR1cmUsIHRoZSB0b2tlbiBpcyBleHBlY3RlZCB0byBoYXZlIGFscmVhZHlcbiAgICAvLyBoYWQgdGhlIFNIQS0xIG1lc3NhZ2UgZGlnZXN0IGFwcGxpZWQuXG4gICAgLy9cbiAgICAvLyBIb3dldmVyLCB0aGUgYWRiIHRva2VuIHdlIHJlY2VpdmUgZnJvbSB0aGUgZGV2aWNlIGlzIG1hZGUgdXAgb2YgMjAgcmFuZG9tbHlcbiAgICAvLyBnZW5lcmF0ZWQgYnl0ZXMgdGhhdCBhcmUgdHJlYXRlZCBsaWtlIGEgU0hBLTEuIFRoZXJlZm9yZSwgd2UgbmVlZCB0byB1cGRhdGVcbiAgICAvLyB0aGUgbWVzc2FnZSBmb3JtYXQuXG4gICAgc2lnbih0b2tlbikge1xuICAgICAgICBjb25zdCByc2FLZXkgPSBuZXcganNibl9yc2FfMS5SU0FLZXkoKTtcbiAgICAgICAgcnNhS2V5LnNldFByaXZhdGVFeCgoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUubikpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUuZSkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUuZCkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUucCkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUucSkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUuZHApKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLmRxKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5xaSkpKTtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShyc2FLZXkubi5iaXRMZW5ndGgoKSA9PT0gTU9EVUxVU19TSVpFX0JJVFMpO1xuICAgICAgICAvLyBNZXNzYWdlIExheW91dCAoc2l6ZSBlcXVhbHMgdGhhdCBvZiB0aGUga2V5IG1vZHVsdXMpOlxuICAgICAgICAvLyAwMCAwMSBGRiBGRiBGRiBGRiAuLi4gRkYgW0FTTi4xIFBSRUZJWF0gW1RPS0VOXVxuICAgICAgICBjb25zdCBtZXNzYWdlID0gbmV3IFVpbnQ4QXJyYXkoTU9EVUxVU19TSVpFKTtcbiAgICAgICAgLy8gSW5pdGlhbGx5IGZpbGwgdGhlIGJ1ZmZlciB3aXRoIHRoZSBwYWRkaW5nXG4gICAgICAgIG1lc3NhZ2UuZmlsbCgweEZGKTtcbiAgICAgICAgLy8gYWRkIHByZWZpeFxuICAgICAgICBtZXNzYWdlWzBdID0gMHgwMDtcbiAgICAgICAgbWVzc2FnZVsxXSA9IDB4MDE7XG4gICAgICAgIC8vIGFkZCB0aGUgQVNOLjEgcHJlZml4XG4gICAgICAgIG1lc3NhZ2Uuc2V0KFNJR05JTkdfQVNOMV9QUkVGSVgsIG1lc3NhZ2UubGVuZ3RoIC0gU0lHTklOR19BU04xX1BSRUZJWC5sZW5ndGggLSB0b2tlbi5sZW5ndGgpO1xuICAgICAgICAvLyB0aGVuIHRoZSBhY3R1YWwgdG9rZW4gYXQgdGhlIGVuZFxuICAgICAgICBtZXNzYWdlLnNldCh0b2tlbiwgbWVzc2FnZS5sZW5ndGggLSB0b2tlbi5sZW5ndGgpO1xuICAgICAgICBjb25zdCBtZXNzYWdlSW50ZWdlciA9IG5ldyBqc2JuX3JzYV8xLkJpZ0ludGVnZXIoQXJyYXkuZnJvbShtZXNzYWdlKSk7XG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IHJzYUtleS5kb1ByaXZhdGUobWVzc2FnZUludGVnZXIpO1xuICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYmlnSW50VG9GaXhlZEJ5dGVBcnJheShzaWduYXR1cmUsIE1PRFVMVVNfU0laRSkpO1xuICAgIH1cbiAgICAvLyBDb25zdHJ1Y3QgcHVibGljIGtleSB0byBtYXRjaCB0aGUgYWRiIGZvcm1hdDpcbiAgICAvLyBnby9jb2Rlc2VhcmNoL3J2Yy1hcmMvc3lzdGVtL2NvcmUvbGliY3J5cHRvX3V0aWxzL2FuZHJvaWRfcHVia2V5LmM7bD0zOC01M1xuICAgIGdldFB1YmxpY0tleSgpIHtcbiAgICAgICAgY29uc3QgcnNhS2V5ID0gbmV3IGpzYm5fcnNhXzEuUlNBS2V5KCk7XG4gICAgICAgIHJzYUtleS5zZXRQdWJsaWMoKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkoKCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmp3a1ByaXZhdGUubikpKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5qd2tQcml2YXRlLmUpKSkpKTtcbiAgICAgICAgY29uc3QgbjBpbnYgPSBSMzIuc3VidHJhY3QocnNhS2V5Lm4ubW9kSW52ZXJzZShSMzIpKS5pbnRWYWx1ZSgpO1xuICAgICAgICBjb25zdCByID0ganNibl9yc2FfMS5CaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoMSkucG93KE1PRFVMVVNfU0laRV9CSVRTKTtcbiAgICAgICAgY29uc3QgcnIgPSByLm11bHRpcGx5KHIpLm1vZChyc2FLZXkubik7XG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihQVUJLRVlfRU5DT0RFRF9TSVpFKTtcbiAgICAgICAgY29uc3QgZHYgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDAsIE1PRFVMVVNfU0laRV9XT1JEUywgdHJ1ZSk7XG4gICAgICAgIGR2LnNldFVpbnQzMihXT1JEX1NJWkUsIG4waW52LCB0cnVlKTtcbiAgICAgICAgY29uc3QgZHZVOCA9IG5ldyBVaW50OEFycmF5KGR2LmJ1ZmZlciwgZHYuYnl0ZU9mZnNldCwgZHYuYnl0ZUxlbmd0aCk7XG4gICAgICAgIGR2VTguc2V0KGJpZ0ludFRvRml4ZWRCeXRlQXJyYXkocnNhS2V5Lm4sIE1PRFVMVVNfU0laRSkucmV2ZXJzZSgpLCAyICogV09SRF9TSVpFKTtcbiAgICAgICAgZHZVOC5zZXQoYmlnSW50VG9GaXhlZEJ5dGVBcnJheShyciwgTU9EVUxVU19TSVpFKS5yZXZlcnNlKCksIDIgKiBXT1JEX1NJWkUgKyBNT0RVTFVTX1NJWkUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMiAqIFdPUkRfU0laRSArIDIgKiBNT0RVTFVTX1NJWkUsIHJzYUtleS5lLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuICgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjRFbmNvZGUpKGR2VTgpICsgJyB1aS5wZXJmZXR0by5kZXYnO1xuICAgIH1cbiAgICBzZXJpYWxpemVLZXkoKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmp3a1ByaXZhdGUpO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiS2V5ID0gQWRiS2V5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYktleU1hbmFnZXIgPSBleHBvcnRzLm1heWJlU3RvcmVLZXkgPSB2b2lkIDA7XG5jb25zdCBhZGJfYXV0aF8xID0gcmVxdWlyZShcIi4vYWRiX2F1dGhcIik7XG5mdW5jdGlvbiBpc1Bhc3N3b3JkQ3JlZGVudGlhbChjcmVkKSB7XG4gICAgcmV0dXJuIGNyZWQgIT09IG51bGwgJiYgY3JlZC50eXBlID09PSAncGFzc3dvcmQnO1xufVxuZnVuY3Rpb24gaGFzUGFzc3dvcmRDcmVkZW50aWFsKCkge1xuICAgIHJldHVybiAnUGFzc3dvcmRDcmVkZW50aWFsJyBpbiB3aW5kb3c7XG59XG4vLyBob3cgbG9uZyB3ZSB3aWxsIHN0b3JlIHRoZSBrZXkgaW4gbWVtb3J5XG5jb25zdCBLRVlfSU5fTUVNT1JZX1RJTUVPVVQgPSAxMDAwICogNjAgKiAzMDsgLy8gMzAgbWludXRlc1xuLy8gVXBkYXRlIGNyZWRlbnRpYWwgc3RvcmUgd2l0aCB0aGUgZ2l2ZW4ga2V5LlxuYXN5bmMgZnVuY3Rpb24gbWF5YmVTdG9yZUtleShrZXkpIHtcbiAgICBpZiAoIWhhc1Bhc3N3b3JkQ3JlZGVudGlhbCgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY3JlZGVudGlhbCA9IG5ldyBQYXNzd29yZENyZWRlbnRpYWwoe1xuICAgICAgICBpZDogJ3dlYnVzYi1hZGIta2V5JyxcbiAgICAgICAgcGFzc3dvcmQ6IGtleS5zZXJpYWxpemVLZXkoKSxcbiAgICAgICAgbmFtZTogJ1dlYlVTQiBBREIgS2V5JyxcbiAgICAgICAgaWNvblVSTDogJ2Zhdmljb24uaWNvJ1xuICAgIH0pO1xuICAgIC8vIFRoZSAnU2F2ZSBwYXNzd29yZD8nIENocm9tZSBkaWFsb2d1ZSBvbmx5IGFwcGVhcnMgaWYgdGhlIGtleSBpc1xuICAgIC8vIG5vdCBhbHJlYWR5IHN0b3JlZCBpbiBDaHJvbWUuXG4gICAgYXdhaXQgbmF2aWdhdG9yLmNyZWRlbnRpYWxzLnN0b3JlKGNyZWRlbnRpYWwpO1xuICAgIC8vICdwcmV2ZW50U2lsZW50QWNjZXNzJyBndWFyYW50ZWVzIHRoZSB1c2VyIGlzIGFsd2F5cyBub3RpZmllZCB3aGVuXG4gICAgLy8gY3JlZGVudGlhbHMgYXJlIGFjY2Vzc2VkLiBTb21ldGltZXMgdGhlIHVzZXIgaXMgYXNrZWQgdG8gY2xpY2sgYSBidXR0b25cbiAgICAvLyBhbmQgb3RoZXIgdGltZXMgb25seSBhIG5vdGlmaWNhdGlvbiBpcyBzaG93biB0ZW1wb3JhcmlseS5cbiAgICBhd2FpdCBuYXZpZ2F0b3IuY3JlZGVudGlhbHMucHJldmVudFNpbGVudEFjY2VzcygpO1xufVxuZXhwb3J0cy5tYXliZVN0b3JlS2V5ID0gbWF5YmVTdG9yZUtleTtcbmNsYXNzIEFkYktleU1hbmFnZXIge1xuICAgIC8vIEZpbmRzIGEga2V5LCBieSBwcmlvcml0eTpcbiAgICAvLyAtIGxvb2tpbmcgaW4gbWVtb3J5IChpLmUuIHRoaXMua2V5KVxuICAgIC8vIC0gbG9va2luZyBpbiB0aGUgY3JlZGVudGlhbCBzdG9yZVxuICAgIC8vIC0gYW5kIGZpbmFsbHkgY3JlYXRpbmcgb25lIGZyb20gc2NyYXRjaCBpZiBuZWVkZWRcbiAgICBhc3luYyBnZXRLZXkoKSB7XG4gICAgICAgIC8vIDEuIElmIHdlIGhhdmUgYSBwcml2YXRlIGtleSBpbiBtZW1vcnksIHdlIHJldHVybiBpdC5cbiAgICAgICAgaWYgKHRoaXMua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rZXk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMi4gV2UgdHJ5IHRvIGdldCB0aGUgcHJpdmF0ZSBrZXkgZnJvbSB0aGUgYnJvd3Nlci5cbiAgICAgICAgLy8gVGhlIG1lZGlhdGlvbiBpcyBzZXQgYXMgJ29wdGlvbmFsJywgYmVjYXVzZSB3ZSB1c2VcbiAgICAgICAgLy8gJ3ByZXZlbnRTaWxlbnRBY2Nlc3MnLCB3aGljaCBzb21ldGltZXMgcmVxdWVzdHMgdGhlIHVzZXIgdG8gY2xpY2tcbiAgICAgICAgLy8gb24gYSBidXR0b24gdG8gYWxsb3cgdGhlIGF1dGgsIGJ1dCBzb21ldGltZXMgb25seSBzaG93cyBhXG4gICAgICAgIC8vIG5vdGlmaWNhdGlvbiBhbmQgZG9lcyBub3QgcmVxdWlyZSB0aGUgdXNlciB0byBjbGljayBvbiBhbnl0aGluZy5cbiAgICAgICAgLy8gSWYgd2UgaGFkIHNldCBtZWRpYXRpb24gdG8gJ3JlcXVpcmVkJywgdGhlIHVzZXIgd291bGQgaGF2ZSBiZWVuXG4gICAgICAgIC8vIGFza2VkIHRvIGNsaWNrIG9uIGEgYnV0dG9uIGV2ZXJ5IHRpbWUuXG4gICAgICAgIGlmIChoYXNQYXNzd29yZENyZWRlbnRpYWwoKSkge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZWRpYXRpb246ICdvcHRpb25hbCcsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgY3JlZGVudGlhbCA9IGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5nZXQob3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAoaXNQYXNzd29yZENyZWRlbnRpYWwoY3JlZGVudGlhbCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hc3NpZ25LZXkoYWRiX2F1dGhfMS5BZGJLZXkuRGVzZXJpYWxpemVLZXkoY3JlZGVudGlhbC5wYXNzd29yZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIDMuIFdlIGdlbmVyYXRlIGEgbmV3IGtleSBwYWlyLlxuICAgICAgICByZXR1cm4gdGhpcy5hc3NpZ25LZXkoYXdhaXQgYWRiX2F1dGhfMS5BZGJLZXkuR2VuZXJhdGVOZXdLZXlQYWlyKCkpO1xuICAgIH1cbiAgICAvLyBBc3NpZ25zIHRoZSBrZXkgYSBuZXcgdmFsdWUsIHNldHMgYSB0aW1lb3V0IGZvciBzdG9yaW5nIHRoZSBrZXkgaW4gbWVtb3J5XG4gICAgLy8gYW5kIHRoZW4gcmV0dXJucyB0aGUgbmV3IGtleS5cbiAgICBhc3NpZ25LZXkoa2V5KSB7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICBpZiAodGhpcy5rZXlJbk1lbW9yeVRpbWVySWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmtleUluTWVtb3J5VGltZXJJZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5rZXlJbk1lbW9yeVRpbWVySWQgPVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmtleSA9IHVuZGVmaW5lZCwgS0VZX0lOX01FTU9SWV9USU1FT1VUKTtcbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG59XG5leHBvcnRzLkFkYktleU1hbmFnZXIgPSBBZGJLZXlNYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlJlY29yZGluZ0Vycm9yID0gZXhwb3J0cy5zaG93UmVjb3JkaW5nTW9kYWwgPSBleHBvcnRzLndyYXBSZWNvcmRpbmdFcnJvciA9IHZvaWQgMDtcbmNvbnN0IGVycm9yc18xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvZXJyb3JzXCIpO1xuY29uc3QgcmVjb3JkaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi9yZWNvcmRpbmdfdXRpbHNcIik7XG4vLyBUaGUgcGF0dGVybiBmb3IgaGFuZGxpbmcgcmVjb3JkaW5nIGVycm9yIGNhbiBoYXZlIHRoZSBmb2xsb3dpbmcgbmVzdGluZyBpblxuLy8gY2FzZSBvZiBlcnJvcnM6XG4vLyBBLiB3cmFwUmVjb3JkaW5nRXJyb3IgLT4gd3JhcHMgYSBwcm9taXNlXG4vLyBCLiBvbkZhaWx1cmUgLT4gaGFzIHVzZXIgZGVmaW5lZCBsb2dpYyBhbmQgY2FsbHMgc2hvd1JlY29yZGluZ01vZGFsXG4vLyBDLiBzaG93UmVjb3JkaW5nTW9kYWwgLT4gc2hvd3MgVVggZm9yIGEgZ2l2ZW4gZXJyb3I7IHRoaXMgaXMgbm90IGNhbGxlZFxuLy8gICAgZGlyZWN0bHkgYnkgd3JhcFJlY29yZGluZ0Vycm9yLCBiZWNhdXNlIHdlIHdhbnQgdGhlIGNhbGxlciAoc3VjaCBhcyB0aGVcbi8vICAgIFVJKSB0byBkaWN0YXRlIHRoZSBVWFxuLy8gVGhpcyBtZXRob2QgdGFrZXMgYSBwcm9taXNlIGFuZCBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGUgaW4gY2FzZSB0aGUgcHJvbWlzZVxuLy8gZmFpbHMuIEl0IHRoZW4gYXdhaXRzIHRoZSBwcm9taXNlIGFuZCBleGVjdXRlcyB0aGUgY2FsbGJhY2sgaW4gY2FzZSBvZlxuLy8gZmFpbHVyZS4gSW4gdGhlIHJlY29yZGluZyBjb2RlIGl0IGlzIHVzZWQgdG8gd3JhcDpcbi8vIDEuIEFjZXNzaW5nIHRoZSBXZWJVU0IgQVBJLlxuLy8gMi4gTWV0aG9kcyByZXR1cm5pbmcgcHJvbWlzZXMgd2hpY2ggY2FuIGJlIHJlamVjdGVkLiBGb3IgaW5zdGFuY2U6XG4vLyBhKSBXaGVuIHRoZSB1c2VyIGNsaWNrcyAnQWRkIGEgbmV3IGRldmljZScgYnV0IHRoZW4gZG9lc24ndCBzZWxlY3QgYSB2YWxpZFxuLy8gICAgZGV2aWNlLlxuLy8gYikgV2hlbiB0aGUgdXNlciBzdGFydHMgYSB0cmFjaW5nIHNlc3Npb24sIGJ1dCBjYW5jZWxzIGl0IGJlZm9yZSB0aGV5XG4vLyAgICBhdXRob3JpemUgdGhlIHNlc3Npb24gb24gdGhlIGRldmljZS5cbmFzeW5jIGZ1bmN0aW9uIHdyYXBSZWNvcmRpbmdFcnJvcihwcm9taXNlLCBvbkZhaWx1cmUpIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgcHJvbWlzZTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gU29tZXRpbWVzIHRoZSBtZXNzYWdlIGlzIHdyYXBwZWQgaW4gYW4gRXJyb3Igb2JqZWN0LCBzb21ldGltZXMgbm90LCBzb1xuICAgICAgICAvLyB3ZSBtYWtlIHN1cmUgd2UgdHJhbnNmb3JtIGl0IGludG8gYSBzdHJpbmcuXG4gICAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICgwLCBlcnJvcnNfMS5nZXRFcnJvck1lc3NhZ2UpKGUpO1xuICAgICAgICBvbkZhaWx1cmUoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG5leHBvcnRzLndyYXBSZWNvcmRpbmdFcnJvciA9IHdyYXBSZWNvcmRpbmdFcnJvcjtcbmZ1bmN0aW9uIHNob3dBbGxvd1VTQkRlYnVnZ2luZygpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd0Nvbm5lY3Rpb25Mb3N0RXJyb3IoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dFeHRlbnNpb25Ob3RJbnN0YWxsZWQoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dGYWlsZWRUb1B1c2hCaW5hcnkoc3RyKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dJc3N1ZVBhcnNpbmdUaGVUcmFjZWRSZXNwb25zZShzdHIpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd05vRGV2aWNlU2VsZWN0ZWQoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dXZWJzb2NrZXRDb25uZWN0aW9uSXNzdWUoc3RyKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbmZ1bmN0aW9uIHNob3dXZWJVU0JFcnJvclYyKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG4vLyBTaG93cyBhIG1vZGFsIGZvciBldmVyeSBrbm93biB0eXBlIG9mIGVycm9yIHdoaWNoIGNhbiBhcmlzZSBkdXJpbmcgcmVjb3JkaW5nLlxuLy8gSW4gdGhpcyB3YXksIGVycm9ycyBvY2N1cmluZyBhdCBkaWZmZXJlbnQgbGV2ZWxzIG9mIHRoZSByZWNvcmRpbmcgcHJvY2Vzc1xuLy8gY2FuIGJlIGhhbmRsZWQgaW4gYSBjZW50cmFsIGxvY2F0aW9uLlxuZnVuY3Rpb24gc2hvd1JlY29yZGluZ01vZGFsKG1lc3NhZ2UpIHtcbiAgICBpZiAoW1xuICAgICAgICAnVW5hYmxlIHRvIGNsYWltIGludGVyZmFjZS4nLFxuICAgICAgICAnVGhlIHNwZWNpZmllZCBlbmRwb2ludCBpcyBub3QgcGFydCBvZiBhIGNsYWltZWQgYW5kIHNlbGVjdGVkICcgK1xuICAgICAgICAgICAgJ2FsdGVybmF0ZSBpbnRlcmZhY2UuJyxcbiAgICAgICAgLy8gdGhyb3duIHdoZW4gY2FsbGluZyB0aGUgJ3Jlc2V0JyBtZXRob2Qgb24gYSBXZWJVU0IgZGV2aWNlLlxuICAgICAgICAnVW5hYmxlIHRvIHJlc2V0IHRoZSBkZXZpY2UuJyxcbiAgICBdLnNvbWUoKHBhcnRPZk1lc3NhZ2UpID0+IG1lc3NhZ2UuaW5jbHVkZXMocGFydE9mTWVzc2FnZSkpKSB7XG4gICAgICAgIHNob3dXZWJVU0JFcnJvclYyKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKFtcbiAgICAgICAgJ0EgdHJhbnNmZXIgZXJyb3IgaGFzIG9jY3VycmVkLicsXG4gICAgICAgICdUaGUgZGV2aWNlIHdhcyBkaXNjb25uZWN0ZWQuJyxcbiAgICAgICAgJ1RoZSB0cmFuc2ZlciB3YXMgY2FuY2VsbGVkLicsXG4gICAgXS5zb21lKChwYXJ0T2ZNZXNzYWdlKSA9PiBtZXNzYWdlLmluY2x1ZGVzKHBhcnRPZk1lc3NhZ2UpKSB8fFxuICAgICAgICBpc0RldmljZURpc2Nvbm5lY3RlZEVycm9yKG1lc3NhZ2UpKSB7XG4gICAgICAgIHNob3dDb25uZWN0aW9uTG9zdEVycm9yKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IHJlY29yZGluZ191dGlsc18xLkFMTE9XX1VTQl9ERUJVR0dJTkcpIHtcbiAgICAgICAgc2hvd0FsbG93VVNCRGVidWdnaW5nKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzTWVzc2FnZUNvbXBvc2VkT2YobWVzc2FnZSwgW3JlY29yZGluZ191dGlsc18xLkJJTkFSWV9QVVNIX0ZBSUxVUkUsIHJlY29yZGluZ191dGlsc18xLkJJTkFSWV9QVVNIX1VOS05PV05fUkVTUE9OU0VdKSkge1xuICAgICAgICBzaG93RmFpbGVkVG9QdXNoQmluYXJ5KG1lc3NhZ2Uuc3Vic3RyaW5nKG1lc3NhZ2UuaW5kZXhPZignOicpICsgMSkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXNzYWdlID09PSByZWNvcmRpbmdfdXRpbHNfMS5OT19ERVZJQ0VfU0VMRUNURUQpIHtcbiAgICAgICAgc2hvd05vRGV2aWNlU2VsZWN0ZWQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocmVjb3JkaW5nX3V0aWxzXzEuV0VCU09DS0VUX1VOQUJMRV9UT19DT05ORUNUID09PSBtZXNzYWdlKSB7XG4gICAgICAgIHNob3dXZWJzb2NrZXRDb25uZWN0aW9uSXNzdWUobWVzc2FnZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IHJlY29yZGluZ191dGlsc18xLkVYVEVOU0lPTl9OT1RfSU5TVEFMTEVEKSB7XG4gICAgICAgIHNob3dFeHRlbnNpb25Ob3RJbnN0YWxsZWQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNNZXNzYWdlQ29tcG9zZWRPZihtZXNzYWdlLCBbXG4gICAgICAgIHJlY29yZGluZ191dGlsc18xLlBBUlNJTkdfVU5LTldPTl9SRVFVRVNUX0lELFxuICAgICAgICByZWNvcmRpbmdfdXRpbHNfMS5QQVJTSU5HX1VOQUJMRV9UT19ERUNPREVfTUVUSE9ELFxuICAgICAgICByZWNvcmRpbmdfdXRpbHNfMS5QQVJTSU5HX1VOUkVDT0dOSVpFRF9QT1JULFxuICAgICAgICByZWNvcmRpbmdfdXRpbHNfMS5QQVJTSU5HX1VOUkVDT0dOSVpFRF9NRVNTQUdFLFxuICAgIF0pKSB7XG4gICAgICAgIHNob3dJc3N1ZVBhcnNpbmdUaGVUcmFjZWRSZXNwb25zZShtZXNzYWdlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHttZXNzYWdlfWApO1xuICAgIH1cbn1cbmV4cG9ydHMuc2hvd1JlY29yZGluZ01vZGFsID0gc2hvd1JlY29yZGluZ01vZGFsO1xuZnVuY3Rpb24gaXNEZXZpY2VEaXNjb25uZWN0ZWRFcnJvcihtZXNzYWdlKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2UuaW5jbHVkZXMoJ0RldmljZSB3aXRoIHNlcmlhbCcpICYmXG4gICAgICAgIG1lc3NhZ2UuaW5jbHVkZXMoJ3dhcyBkaXNjb25uZWN0ZWQuJyk7XG59XG5mdW5jdGlvbiBpc01lc3NhZ2VDb21wb3NlZE9mKG1lc3NhZ2UsIGlzc3Vlcykge1xuICAgIGZvciAoY29uc3QgaXNzdWUgb2YgaXNzdWVzKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLmluY2x1ZGVzKGlzc3VlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLy8gRXhjZXB0aW9uIHRocm93biBieSB0aGUgUmVjb3JkaW5nIGxvZ2ljLlxuY2xhc3MgUmVjb3JkaW5nRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG5leHBvcnRzLlJlY29yZGluZ0Vycm9yID0gUmVjb3JkaW5nRXJyb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUEFSU0lOR19VTlJFQ09HTklaRURfTUVTU0FHRSA9IGV4cG9ydHMuUEFSU0lOR19VTlJFQ09HTklaRURfUE9SVCA9IGV4cG9ydHMuUEFSU0lOR19VTkFCTEVfVE9fREVDT0RFX01FVEhPRCA9IGV4cG9ydHMuUEFSU0lOR19VTktOV09OX1JFUVVFU1RfSUQgPSBleHBvcnRzLlJFQ09SRElOR19JTl9QUk9HUkVTUyA9IGV4cG9ydHMuQlVGRkVSX1VTQUdFX0lOQ09SUkVDVF9GT1JNQVQgPSBleHBvcnRzLkJVRkZFUl9VU0FHRV9OT1RfQUNDRVNTSUJMRSA9IGV4cG9ydHMuTUFMRk9STUVEX0VYVEVOU0lPTl9NRVNTQUdFID0gZXhwb3J0cy5FWFRFTlNJT05fTk9UX0lOU1RBTExFRCA9IGV4cG9ydHMuRVhURU5TSU9OX05BTUUgPSBleHBvcnRzLkVYVEVOU0lPTl9VUkwgPSBleHBvcnRzLkVYVEVOU0lPTl9JRCA9IGV4cG9ydHMuZmluZEludGVyZmFjZUFuZEVuZHBvaW50ID0gZXhwb3J0cy5BREJfREVWSUNFX0ZJTFRFUiA9IGV4cG9ydHMuTk9fREVWSUNFX1NFTEVDVEVEID0gZXhwb3J0cy5DVVNUT01fVFJBQ0VEX0NPTlNVTUVSX1NPQ0tFVF9QQVRIID0gZXhwb3J0cy5ERUZBVUxUX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSCA9IGV4cG9ydHMuQUxMT1dfVVNCX0RFQlVHR0lORyA9IGV4cG9ydHMuVFJBQ0VCT1hfRkVUQ0hfVElNRU9VVCA9IGV4cG9ydHMuVFJBQ0VCT1hfREVWSUNFX1BBVEggPSBleHBvcnRzLkJJTkFSWV9QVVNIX1VOS05PV05fUkVTUE9OU0UgPSBleHBvcnRzLkJJTkFSWV9QVVNIX0ZBSUxVUkUgPSBleHBvcnRzLmlzQ3JPUyA9IGV4cG9ydHMuaXNMaW51eCA9IGV4cG9ydHMuaXNNYWNPcyA9IGV4cG9ydHMuYnVpbGRBYmRXZWJzb2NrZXRDb21tYW5kID0gZXhwb3J0cy5XRUJTT0NLRVRfQ0xPU0VEX0FCTk9STUFMTFlfQ09ERSA9IGV4cG9ydHMuV0VCU09DS0VUX1VOQUJMRV9UT19DT05ORUNUID0gdm9pZCAwO1xuLy8gQmVnaW4gV2Vic29ja2V0IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnRzLldFQlNPQ0tFVF9VTkFCTEVfVE9fQ09OTkVDVCA9ICdVbmFibGUgdG8gY29ubmVjdCB0byBkZXZpY2UgdmlhIHdlYnNvY2tldC4nO1xuLy8gaHR0cHM6Ly93d3cucmZjLWVkaXRvci5vcmcvcmZjL3JmYzY0NTUjc2VjdGlvbi03LjQuMVxuZXhwb3J0cy5XRUJTT0NLRVRfQ0xPU0VEX0FCTk9STUFMTFlfQ09ERSA9IDEwMDY7XG4vLyBUaGUgbWVzc2FnZXMgcmVhZCBieSB0aGUgYWRiIHNlcnZlciBoYXZlIHRoZWlyIGxlbmd0aCBwcmVwZW5kZWQgaW4gaGV4LlxuLy8gVGhpcyBtZXRob2QgYWRkcyB0aGUgbGVuZ3RoIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIG1lc3NhZ2UuXG4vLyBFeGFtcGxlOiAnaG9zdDp0cmFjay1kZXZpY2VzJyAtPiAnMDAxMmhvc3Q6dHJhY2stZGV2aWNlcydcbi8vIGdvL2NvZGVzZWFyY2gvYW9zcC1hbmRyb2lkMTEvc3lzdGVtL2NvcmUvYWRiL1NFUlZJQ0VTLlRYVFxuZnVuY3Rpb24gYnVpbGRBYmRXZWJzb2NrZXRDb21tYW5kKGNtZCkge1xuICAgIGNvbnN0IGhkciA9IGNtZC5sZW5ndGgudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDQsICcwJyk7XG4gICAgcmV0dXJuIGhkciArIGNtZDtcbn1cbmV4cG9ydHMuYnVpbGRBYmRXZWJzb2NrZXRDb21tYW5kID0gYnVpbGRBYmRXZWJzb2NrZXRDb21tYW5kO1xuLy8gU2FtcGxlIHVzZXIgYWdlbnQgZm9yIENocm9tZSBvbiBNYWMgT1M6XG4vLyAnTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTVfNykgQXBwbGVXZWJLaXQvNTM3LjM2XG4vLyAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMDQuMC4wLjAgU2FmYXJpLzUzNy4zNidcbmZ1bmN0aW9uIGlzTWFjT3ModXNlckFnZW50KSB7XG4gICAgcmV0dXJuIHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCcgbWFjIG9zICcpO1xufVxuZXhwb3J0cy5pc01hY09zID0gaXNNYWNPcztcbi8vIFNhbXBsZSB1c2VyIGFnZW50IGZvciBDaHJvbWUgb24gTGludXg6XG4vLyBNb3ppbGxhLzUuMCAoWDExOyBMaW51eCB4ODZfNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pXG4vLyBDaHJvbWUvMTA1LjAuMC4wIFNhZmFyaS81MzcuMzZcbmZ1bmN0aW9uIGlzTGludXgodXNlckFnZW50KSB7XG4gICAgcmV0dXJuIHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCcgbGludXggJyk7XG59XG5leHBvcnRzLmlzTGludXggPSBpc0xpbnV4O1xuLy8gU2FtcGxlIHVzZXIgYWdlbnQgZm9yIENocm9tZSBvbiBDaHJvbWUgT1M6XG4vLyBcIk1vemlsbGEvNS4wIChYMTE7IENyT1MgeDg2XzY0IDE0ODE2Ljk5LjApIEFwcGxlV2ViS2l0LzUzNy4zNlxuLy8gKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTAzLjAuNTA2MC4xMTQgU2FmYXJpLzUzNy4zNlwiXG4vLyBUaGlzIGNvbmRpdGlvbiBpcyB3aWRlciwgaW4gdGhlIHVubGlrZWx5IHBvc3NpYmlsaXR5IG9mIGRpZmZlcmVudCBjYXNpbmcsXG5mdW5jdGlvbiBpc0NyT1ModXNlckFnZW50KSB7XG4gICAgcmV0dXJuIHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCcgY3JvcyAnKTtcbn1cbmV4cG9ydHMuaXNDck9TID0gaXNDck9TO1xuLy8gRW5kIFdlYnNvY2tldCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCZWdpbiBBZGIgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuQklOQVJZX1BVU0hfRkFJTFVSRSA9ICdCaW5hcnlQdXNoRmFpbHVyZSc7XG5leHBvcnRzLkJJTkFSWV9QVVNIX1VOS05PV05fUkVTUE9OU0UgPSAnQmluYXJ5UHVzaFVua25vd25SZXNwb25zZSc7XG4vLyBJbiBjYXNlIHRoZSBkZXZpY2UgZG9lc24ndCBoYXZlIHRoZSB0cmFjZWJveCwgd2UgdXBsb2FkIHRoZSBsYXRlc3QgdmVyc2lvblxuLy8gdG8gdGhpcyBwYXRoLlxuZXhwb3J0cy5UUkFDRUJPWF9ERVZJQ0VfUEFUSCA9ICcvZGF0YS9sb2NhbC90bXAvdHJhY2Vib3gnO1xuLy8gRXhwZXJpbWVudGFsbHksIHRoaXMgdGFrZXMgOTAwbXMgb24gdGhlIGZpcnN0IGZldGNoIGFuZCAyMC0zMG1zIGFmdGVyXG4vLyBiZWNhdXNlIG9mIGNhY2hpbmcuXG5leHBvcnRzLlRSQUNFQk9YX0ZFVENIX1RJTUVPVVQgPSAzMDAwMDtcbi8vIE1lc3NhZ2Ugc2hvd24gdG8gdGhlIHVzZXIgd2hlbiB0aGV5IG5lZWQgdG8gYWxsb3cgYXV0aGVudGljYXRpb24gb24gdGhlXG4vLyBkZXZpY2UgaW4gb3JkZXIgdG8gY29ubmVjdC5cbmV4cG9ydHMuQUxMT1dfVVNCX0RFQlVHR0lORyA9ICdQbGVhc2UgYWxsb3cgVVNCIGRlYnVnZ2luZyBvbiBkZXZpY2UgYW5kIHRyeSBhZ2Fpbi4nO1xuLy8gSWYgdGhlIEFuZHJvaWQgZGV2aWNlIGhhcyB0aGUgdHJhY2luZyBzZXJ2aWNlIG9uIGl0IChmcm9tIEFQSSB2ZXJzaW9uIDI5KSxcbi8vIHRoZW4gd2UgY2FuIGNvbm5lY3QgdG8gdGhpcyBjb25zdW1lciBzb2NrZXQuXG5leHBvcnRzLkRFRkFVTFRfVFJBQ0VEX0NPTlNVTUVSX1NPQ0tFVF9QQVRIID0gJ2xvY2FsZmlsZXN5c3RlbTovZGV2L3NvY2tldC90cmFjZWRfY29uc3VtZXInO1xuLy8gSWYgdGhlIEFuZHJvaWQgZGV2aWNlIGRvZXMgbm90IGhhdmUgdGhlIHRyYWNpbmcgc2VydmljZSBvbiBpdCAoYmVmb3JlIEFQSVxuLy8gdmVyc2lvbiAyOSksIHdlIHdpbGwgaGF2ZSB0byBwdXNoIHRoZSB0cmFjZWJveCBvbiB0aGUgZGV2aWNlLiBUaGVuLCB3ZVxuLy8gY2FuIGNvbm5lY3QgdG8gdGhpcyBjb25zdW1lciBzb2NrZXQgKHVzaW5nIGl0IGRvZXMgbm90IHJlcXVpcmUgc3lzdGVtIGFkbWluXG4vLyBwcml2aWxlZ2VzKS5cbmV4cG9ydHMuQ1VTVE9NX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSCA9ICdsb2NhbGFic3RyYWN0OnRyYWNlZF9jb25zdW1lcic7XG4vLyBFbmQgQWRiIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCZWdpbiBXZWJ1c2IgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuTk9fREVWSUNFX1NFTEVDVEVEID0gJ05vIGRldmljZSBzZWxlY3RlZC4nO1xuZXhwb3J0cy5BREJfREVWSUNFX0ZJTFRFUiA9IHtcbiAgICBjbGFzc0NvZGU6IDI1NSwgLy8gVVNCIHZlbmRvciBzcGVjaWZpYyBjb2RlXG4gICAgc3ViY2xhc3NDb2RlOiA2NiwgLy8gQW5kcm9pZCB2ZW5kb3Igc3BlY2lmaWMgc3ViY2xhc3NcbiAgICBwcm90b2NvbENvZGU6IDEsIC8vIEFkYiBwcm90b2NvbFxufTtcbmZ1bmN0aW9uIGZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludChkZXZpY2UpIHtcbiAgICBjb25zdCBhZGJEZXZpY2VGaWx0ZXIgPSBleHBvcnRzLkFEQl9ERVZJQ0VfRklMVEVSO1xuICAgIGZvciAoY29uc3QgY29uZmlnIG9mIGRldmljZS5jb25maWd1cmF0aW9ucykge1xuICAgICAgICBmb3IgKGNvbnN0IGludGVyZmFjZV8gb2YgY29uZmlnLmludGVyZmFjZXMpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgYWx0IG9mIGludGVyZmFjZV8uYWx0ZXJuYXRlcykge1xuICAgICAgICAgICAgICAgIGlmIChhbHQuaW50ZXJmYWNlQ2xhc3MgPT09IGFkYkRldmljZUZpbHRlci5jbGFzc0NvZGUgJiZcbiAgICAgICAgICAgICAgICAgICAgYWx0LmludGVyZmFjZVN1YmNsYXNzID09PSBhZGJEZXZpY2VGaWx0ZXIuc3ViY2xhc3NDb2RlICYmXG4gICAgICAgICAgICAgICAgICAgIGFsdC5pbnRlcmZhY2VQcm90b2NvbCA9PT0gYWRiRGV2aWNlRmlsdGVyLnByb3RvY29sQ29kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvblZhbHVlOiBjb25maWcuY29uZmlndXJhdGlvblZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNiSW50ZXJmYWNlTnVtYmVyOiBpbnRlcmZhY2VfLmludGVyZmFjZU51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZHBvaW50czogYWx0LmVuZHBvaW50cyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9IC8vIGlmIChhbHRlcm5hdGUpXG4gICAgICAgICAgICB9IC8vIGZvciAoaW50ZXJmYWNlLmFsdGVybmF0ZXMpXG4gICAgICAgIH0gLy8gZm9yIChjb25maWd1cmF0aW9uLmludGVyZmFjZXMpXG4gICAgfSAvLyBmb3IgKGNvbmZpZ3VyYXRpb25zKVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5leHBvcnRzLmZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludCA9IGZpbmRJbnRlcmZhY2VBbmRFbmRwb2ludDtcbi8vIEVuZCBXZWJ1c2IgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEJlZ2luIENocm9tZSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0cy5FWFRFTlNJT05fSUQgPSAnbGZta3BoZnBkYmppamhwb21nZWNmaWtoZm9oYW9pbmUnO1xuZXhwb3J0cy5FWFRFTlNJT05fVVJMID0gYGh0dHBzOi8vY2hyb21lLmdvb2dsZS5jb20vd2Vic3RvcmUvZGV0YWlsL3BlcmZldHRvLXVpLyR7ZXhwb3J0cy5FWFRFTlNJT05fSUR9YDtcbmV4cG9ydHMuRVhURU5TSU9OX05BTUUgPSAnQ2hyb21lIGV4dGVuc2lvbic7XG5leHBvcnRzLkVYVEVOU0lPTl9OT1RfSU5TVEFMTEVEID0gYFRvIHRyYWNlIENocm9tZSBmcm9tIHRoZSBQZXJmZXR0byBVSSwgeW91IG5lZWQgdG8gaW5zdGFsbCBvdXJcbiAgICAke2V4cG9ydHMuRVhURU5TSU9OX1VSTH0gYW5kIHRoZW4gcmVsb2FkIHRoaXMgcGFnZS5gO1xuZXhwb3J0cy5NQUxGT1JNRURfRVhURU5TSU9OX01FU1NBR0UgPSAnTWFsZm9ybWVkIGV4dGVuc2lvbiBtZXNzYWdlLic7XG5leHBvcnRzLkJVRkZFUl9VU0FHRV9OT1RfQUNDRVNTSUJMRSA9ICdCdWZmZXIgdXNhZ2Ugbm90IGFjY2Vzc2libGUnO1xuZXhwb3J0cy5CVUZGRVJfVVNBR0VfSU5DT1JSRUNUX0ZPUk1BVCA9ICdUaGUgYnVmZmVyIHVzYWdlIGRhdGEgaGFzIGFtIGluY29ycmVjdCBmb3JtYXQnO1xuLy8gRW5kIENocm9tZSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBCZWdpbiBUcmFjZWQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0cy5SRUNPUkRJTkdfSU5fUFJPR1JFU1MgPSAnUmVjb3JkaW5nIGluIHByb2dyZXNzJztcbmV4cG9ydHMuUEFSU0lOR19VTktOV09OX1JFUVVFU1RfSUQgPSAnVW5rbm93biByZXF1ZXN0IGlkJztcbmV4cG9ydHMuUEFSU0lOR19VTkFCTEVfVE9fREVDT0RFX01FVEhPRCA9ICdVbmFibGUgdG8gZGVjb2RlIG1ldGhvZCc7XG5leHBvcnRzLlBBUlNJTkdfVU5SRUNPR05JWkVEX1BPUlQgPSAnVW5yZWNvZ25pemVkIGNvbnN1bWVyIHBvcnQgcmVzcG9uc2UnO1xuZXhwb3J0cy5QQVJTSU5HX1VOUkVDT0dOSVpFRF9NRVNTQUdFID0gJ1VucmVjb2duaXplZCBmcmFtZSBtZXNzYWdlJztcbi8vIEVuZCBUcmFjZWQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeSA9IGV4cG9ydHMuQU5EUk9JRF9XRUJVU0JfVEFSR0VUX0ZBQ1RPUlkgPSB2b2lkIDA7XG5jb25zdCBlcnJvcnNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9iYXNlL2Vycm9yc1wiKTtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9iYXNlL2xvZ2dpbmdcIik7XG5jb25zdCBhZGJfa2V5X21hbmFnZXJfMSA9IHJlcXVpcmUoXCIuLi9hdXRoL2FkYl9rZXlfbWFuYWdlclwiKTtcbmNvbnN0IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xID0gcmVxdWlyZShcIi4uL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZ1wiKTtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4uL3JlY29yZGluZ191dGlsc1wiKTtcbmNvbnN0IGFuZHJvaWRfd2VidXNiX3RhcmdldF8xID0gcmVxdWlyZShcIi4uL3RhcmdldHMvYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0XCIpO1xuZXhwb3J0cy5BTkRST0lEX1dFQlVTQl9UQVJHRVRfRkFDVE9SWSA9ICdBbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeSc7XG5jb25zdCBTRVJJQUxfTlVNQkVSX0lTU1VFID0gJ2FuIGludmFsaWQgc2VyaWFsIG51bWJlcic7XG5jb25zdCBBREJfSU5URVJGQUNFX0lTU1VFID0gJ2FuIGluY29tcGF0aWJsZSBhZGIgaW50ZXJmYWNlJztcbmZ1bmN0aW9uIGNyZWF0ZURldmljZUVycm9yTWVzc2FnZShkZXZpY2UsIGlzc3VlKSB7XG4gICAgY29uc3QgcHJvZHVjdE5hbWUgPSBkZXZpY2UucHJvZHVjdE5hbWU7XG4gICAgcmV0dXJuIGBVU0IgZGV2aWNlJHtwcm9kdWN0TmFtZSA/ICcgJyArIHByb2R1Y3ROYW1lIDogJyd9IGhhcyAke2lzc3VlfWA7XG59XG5jbGFzcyBBbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeSB7XG4gICAgY29uc3RydWN0b3IodXNiKSB7XG4gICAgICAgIHRoaXMudXNiID0gdXNiO1xuICAgICAgICB0aGlzLmtpbmQgPSBleHBvcnRzLkFORFJPSURfV0VCVVNCX1RBUkdFVF9GQUNUT1JZO1xuICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlID0gKCkgPT4geyB9O1xuICAgICAgICB0aGlzLnJlY29yZGluZ1Byb2JsZW1zID0gW107XG4gICAgICAgIHRoaXMudGFyZ2V0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgLy8gQWRiS2V5TWFuYWdlciBzaG91bGQgb25seSBiZSBpbnN0YW50aWF0ZWQgb25jZSwgc28gd2UgY2FuIHVzZSB0aGUgc2FtZSBrZXlcbiAgICAgICAgLy8gZm9yIGFsbCBkZXZpY2VzLlxuICAgICAgICB0aGlzLmtleU1hbmFnZXIgPSBuZXcgYWRiX2tleV9tYW5hZ2VyXzEuQWRiS2V5TWFuYWdlcigpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgZ2V0TmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICdBbmRyb2lkIFdlYlVzYic7XG4gICAgfVxuICAgIGxpc3RUYXJnZXRzKCkge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnRhcmdldHMudmFsdWVzKCkpO1xuICAgIH1cbiAgICBsaXN0UmVjb3JkaW5nUHJvYmxlbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlY29yZGluZ1Byb2JsZW1zO1xuICAgIH1cbiAgICBhc3luYyBjb25uZWN0TmV3VGFyZ2V0KCkge1xuICAgICAgICBsZXQgZGV2aWNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGV2aWNlID0gYXdhaXQgdGhpcy51c2IucmVxdWVzdERldmljZSh7IGZpbHRlcnM6IFtyZWNvcmRpbmdfdXRpbHNfMS5BREJfREVWSUNFX0ZJTFRFUl0gfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcigoMCwgZXJyb3JzXzEuZ2V0RXJyb3JNZXNzYWdlKShlKSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGV2aWNlVmFsaWQgPSB0aGlzLmNoZWNrRGV2aWNlVmFsaWRpdHkoZGV2aWNlKTtcbiAgICAgICAgaWYgKCFkZXZpY2VWYWxpZC5pc1ZhbGlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoZGV2aWNlVmFsaWQuaXNzdWVzLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbmRyb2lkVGFyZ2V0ID0gbmV3IGFuZHJvaWRfd2VidXNiX3RhcmdldF8xLkFuZHJvaWRXZWJ1c2JUYXJnZXQoZGV2aWNlLCB0aGlzLmtleU1hbmFnZXIsIHRoaXMub25UYXJnZXRDaGFuZ2UpO1xuICAgICAgICB0aGlzLnRhcmdldHMuc2V0KCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShkZXZpY2Uuc2VyaWFsTnVtYmVyKSwgYW5kcm9pZFRhcmdldCk7XG4gICAgICAgIHJldHVybiBhbmRyb2lkVGFyZ2V0O1xuICAgIH1cbiAgICBzZXRPblRhcmdldENoYW5nZShvblRhcmdldENoYW5nZSkge1xuICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlID0gb25UYXJnZXRDaGFuZ2U7XG4gICAgfVxuICAgIGFzeW5jIGluaXQoKSB7XG4gICAgICAgIGxldCBkZXZpY2VzID0gW107XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkZXZpY2VzID0gYXdhaXQgdGhpcy51c2IuZ2V0RGV2aWNlcygpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChfKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIFdlYlVTQiBub3QgYXZhaWxhYmxlIG9yIGRpc2FsbG93ZWQgaW4gaWZyYW1lLlxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgZGV2aWNlIG9mIGRldmljZXMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRGV2aWNlVmFsaWRpdHkoZGV2aWNlKS5pc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRzLnNldCgoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoZGV2aWNlLnNlcmlhbE51bWJlciksIG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfMS5BbmRyb2lkV2VidXNiVGFyZ2V0KGRldmljZSwgdGhpcy5rZXlNYW5hZ2VyLCB0aGlzLm9uVGFyZ2V0Q2hhbmdlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51c2IuYWRkRXZlbnRMaXN0ZW5lcignY29ubmVjdCcsIChldikgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tEZXZpY2VWYWxpZGl0eShldi5kZXZpY2UpLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldHMuc2V0KCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShldi5kZXZpY2Uuc2VyaWFsTnVtYmVyKSwgbmV3IGFuZHJvaWRfd2VidXNiX3RhcmdldF8xLkFuZHJvaWRXZWJ1c2JUYXJnZXQoZXYuZGV2aWNlLCB0aGlzLmtleU1hbmFnZXIsIHRoaXMub25UYXJnZXRDaGFuZ2UpKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVzYi5hZGRFdmVudExpc3RlbmVyKCdkaXNjb25uZWN0JywgYXN5bmMgKGV2KSA9PiB7XG4gICAgICAgICAgICAvLyBXZSBkb24ndCBjaGVjayBkZXZpY2UgdmFsaWRpdHkgd2hlbiBkaXNjb25uZWN0aW5nIGJlY2F1c2UgaWYgdGhlIGRldmljZVxuICAgICAgICAgICAgLy8gaXMgaW52YWxpZCB3ZSB3b3VsZCBub3QgaGF2ZSBjb25uZWN0ZWQgaW4gdGhlIGZpcnN0IHBsYWNlLlxuICAgICAgICAgICAgY29uc3Qgc2VyaWFsTnVtYmVyID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKGV2LmRldmljZS5zZXJpYWxOdW1iZXIpO1xuICAgICAgICAgICAgYXdhaXQgKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMudGFyZ2V0cy5nZXQoc2VyaWFsTnVtYmVyKSlcbiAgICAgICAgICAgICAgICAuZGlzY29ubmVjdChgRGV2aWNlIHdpdGggc2VyaWFsICR7c2VyaWFsTnVtYmVyfSB3YXMgZGlzY29ubmVjdGVkLmApO1xuICAgICAgICAgICAgdGhpcy50YXJnZXRzLmRlbGV0ZShzZXJpYWxOdW1iZXIpO1xuICAgICAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2hlY2tEZXZpY2VWYWxpZGl0eShkZXZpY2UpIHtcbiAgICAgICAgY29uc3QgZGV2aWNlVmFsaWRpdHkgPSB7IGlzVmFsaWQ6IHRydWUsIGlzc3VlczogW10gfTtcbiAgICAgICAgaWYgKCFkZXZpY2Uuc2VyaWFsTnVtYmVyKSB7XG4gICAgICAgICAgICBkZXZpY2VWYWxpZGl0eS5pc3N1ZXMucHVzaChjcmVhdGVEZXZpY2VFcnJvck1lc3NhZ2UoZGV2aWNlLCBTRVJJQUxfTlVNQkVSX0lTU1VFKSk7XG4gICAgICAgICAgICBkZXZpY2VWYWxpZGl0eS5pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoMCwgcmVjb3JkaW5nX3V0aWxzXzEuZmluZEludGVyZmFjZUFuZEVuZHBvaW50KShkZXZpY2UpKSB7XG4gICAgICAgICAgICBkZXZpY2VWYWxpZGl0eS5pc3N1ZXMucHVzaChjcmVhdGVEZXZpY2VFcnJvck1lc3NhZ2UoZGV2aWNlLCBBREJfSU5URVJGQUNFX0lTU1VFKSk7XG4gICAgICAgICAgICBkZXZpY2VWYWxpZGl0eS5pc1ZhbGlkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWNvcmRpbmdQcm9ibGVtcy5wdXNoKC4uLmRldmljZVZhbGlkaXR5Lmlzc3Vlcyk7XG4gICAgICAgIHJldHVybiBkZXZpY2VWYWxpZGl0eTtcbiAgICB9XG59XG5leHBvcnRzLkFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5ID0gQW5kcm9pZFdlYnVzYlRhcmdldEZhY3Rvcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQW5kcm9pZFRhcmdldCA9IHZvaWQgMDtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4uL3JlY29yZGluZ191dGlsc1wiKTtcbmNsYXNzIEFuZHJvaWRUYXJnZXQge1xuICAgIGNvbnN0cnVjdG9yKGFkYkNvbm5lY3Rpb24sIG9uVGFyZ2V0Q2hhbmdlKSB7XG4gICAgICAgIHRoaXMuYWRiQ29ubmVjdGlvbiA9IGFkYkNvbm5lY3Rpb247XG4gICAgICAgIHRoaXMub25UYXJnZXRDaGFuZ2UgPSBvblRhcmdldENoYW5nZTtcbiAgICAgICAgdGhpcy5jb25zdW1lclNvY2tldFBhdGggPSByZWNvcmRpbmdfdXRpbHNfMS5ERUZBVUxUX1RSQUNFRF9DT05TVU1FUl9TT0NLRVRfUEFUSDtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyBjYWxsZWQgd2hlbiBhIHVzYiBVU0JDb25uZWN0aW9uRXZlbnQgb2YgdHlwZSAnZGlzY29ubmVjdCcgZXZlbnQgaXNcbiAgICAvLyBlbWl0dGVkLiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgd2hlbiB0aGUgVVNCIGNvbm5lY3Rpb24gaXMgbG9zdCAoZXhhbXBsZTpcbiAgICAvLyB3aGVuIHRoZSB1c2VyIHVucGx1Z2dlZCB0aGUgY29ubmVjdGluZyBjYWJsZSkuXG4gICAgYXN5bmMgZGlzY29ubmVjdChkaXNjb25uZWN0TWVzc2FnZSkge1xuICAgICAgICBhd2FpdCB0aGlzLmFkYkNvbm5lY3Rpb24uZGlzY29ubmVjdChkaXNjb25uZWN0TWVzc2FnZSk7XG4gICAgfVxuICAgIC8vIFN0YXJ0cyBhIHRyYWNpbmcgc2Vzc2lvbiBpbiBvcmRlciB0byBmZXRjaCBpbmZvcm1hdGlvbiBzdWNoIGFzIGFwaUxldmVsXG4gICAgLy8gYW5kIGRhdGFTb3VyY2VzIGZyb20gdGhlIGRldmljZS4gVGhlbiwgaXQgY2FuY2VscyB0aGUgc2Vzc2lvbi5cbiAgICBhc3luYyBmZXRjaFRhcmdldEluZm8obGlzdGVuZXIpIHtcbiAgICB9XG4gICAgLy8gV2UgZG8gbm90IHN1cHBvcnQgbG9uZyB0cmFjaW5nIG9uIEFuZHJvaWQuXG4gICAgY2FuQ3JlYXRlVHJhY2luZ1Nlc3Npb24ocmVjb3JkaW5nTW9kZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGFzeW5jIGNyZWF0ZVRyYWNpbmdTZXNzaW9uKHRyYWNpbmdTZXNzaW9uTGlzdGVuZXIpIHtcbiAgICB9XG4gICAgY2FuQ29ubmVjdFdpdGhvdXRDb250ZW50aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGJDb25uZWN0aW9uLmNhbkNvbm5lY3RXaXRob3V0Q29udGVudGlvbigpO1xuICAgIH1cbiAgICBnZXRBZGJDb25uZWN0aW5vKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGJDb25uZWN0aW9uO1xuICAgIH1cbn1cbmV4cG9ydHMuQW5kcm9pZFRhcmdldCA9IEFuZHJvaWRUYXJnZXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQW5kcm9pZFdlYnVzYlRhcmdldCA9IHZvaWQgMDtcbmNvbnN0IGxvZ2dpbmdfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9iYXNlL2xvZ2dpbmdcIik7XG5jb25zdCBhZGJfY29ubmVjdGlvbl9vdmVyX3dlYnVzYl8xID0gcmVxdWlyZShcIi4uL2FkYl9jb25uZWN0aW9uX292ZXJfd2VidXNiXCIpO1xuY29uc3QgYW5kcm9pZF90YXJnZXRfMSA9IHJlcXVpcmUoXCIuL2FuZHJvaWRfdGFyZ2V0XCIpO1xuY2xhc3MgQW5kcm9pZFdlYnVzYlRhcmdldCBleHRlbmRzIGFuZHJvaWRfdGFyZ2V0XzEuQW5kcm9pZFRhcmdldCB7XG4gICAgY29uc3RydWN0b3IoZGV2aWNlLCBrZXlNYW5hZ2VyLCBvblRhcmdldENoYW5nZSkge1xuICAgICAgICBzdXBlcihuZXcgYWRiX2Nvbm5lY3Rpb25fb3Zlcl93ZWJ1c2JfMS5BZGJDb25uZWN0aW9uT3ZlcldlYnVzYihkZXZpY2UsIGtleU1hbmFnZXIpLCBvblRhcmdldENoYW5nZSk7XG4gICAgICAgIHRoaXMuZGV2aWNlID0gZGV2aWNlO1xuICAgIH1cbiAgICBnZXRJbmZvKCkge1xuICAgICAgICBjb25zdCBuYW1lID0gKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuZGV2aWNlLnByb2R1Y3ROYW1lKSArICcgJyArXG4gICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5kZXZpY2Uuc2VyaWFsTnVtYmVyKSArICcgV2ViVXNiJztcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRhcmdldFR5cGU6ICdBTkRST0lEJyxcbiAgICAgICAgICAgIC8vICdhbmRyb2lkQXBpTGV2ZWwnIHdpbGwgYmUgcG9wdWxhdGVkIGFmdGVyIEFEQiBhdXRob3JpemF0aW9uLlxuICAgICAgICAgICAgYW5kcm9pZEFwaUxldmVsOiB0aGlzLmFuZHJvaWRBcGlMZXZlbCxcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzOiB0aGlzLmRhdGFTb3VyY2VzIHx8IFtdLFxuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnRzLkFuZHJvaWRXZWJ1c2JUYXJnZXQgPSBBbmRyb2lkV2VidXNiVGFyZ2V0O1xuIiwiLy8gQ29weXJpZ2h0IChDKSAyMDE5IFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuXG5leHBvcnQgY29uc3QgX1RleHREZWNvZGVyID0gVGV4dERlY29kZXI7XG5leHBvcnQgY29uc3QgX1RleHRFbmNvZGVyID0gVGV4dEVuY29kZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0X2ZhY3RvcnlfMSA9IHJlcXVpcmUoXCIuL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvdGFyZ2V0X2ZhY3Rvcmllcy9hbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeVwiKTtcbmNvbnN0IGNvbm5lY3RCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbm5lY3RfYnV0dG9uXCIpO1xuY29uc3QgcnVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJydW5fYnV0dG9uXCIpO1xucnVuQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbmNvbnN0IHNjcmlwdEFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcmlwdF9hcmVhXCIpO1xuc2NyaXB0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG5jb25zdCBvdXRwdXRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXRwdXRfYXJlYVwiKTtcbm91dHB1dEFyZWEuZGlzYWJsZWQgPSB0cnVlO1xuY29uc3QgbG9nY2F0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nY2F0X2FyZWFcIik7XG5sb2djYXRBcmVhLmRpc2FibGVkID0gdHJ1ZTtcbmNvbnN0IGJ1Z3JlcG9ydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVncmVwb3J0X2J1dHRvblwiKTtcbmJ1Z3JlcG9ydEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5jb25zdCBzdGFydFJlY29yZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVjb3JkX2J1dHRvblwiKTtcbnN0YXJ0UmVjb3JkQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbmNvbnN0IHdlYnVzYiA9IG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeV8xLkFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5KG5hdmlnYXRvci51c2IpO1xudmFyIGFkYkNvbm5lY3Rpb247XG5zY3JpcHRBcmVhLnZhbHVlID0gXCJnZXRwcm9wXCI7XG5jb25zdCBsb2djYXREZWNvZGUgPSBuZXcgVGV4dERlY29kZXIoKTtcbnZhciB0b1J1biA9IFtdO1xuZnVuY3Rpb24gbG9nY2F0RGF0YShkYXRhKSB7XG4gICAgbG9nY2F0QXJlYS52YWx1ZSA9IGxvZ2NhdEFyZWEudmFsdWUgKyBsb2djYXREZWNvZGUuZGVjb2RlKGRhdGEpO1xuICAgIGxvZ2NhdEFyZWEuc2Nyb2xsVG9wID0gbG9nY2F0QXJlYS5zY3JvbGxIZWlnaHQ7XG59XG5mdW5jdGlvbiBkZXZpY2VDb25uZWN0ZWQoZGV2KSB7XG4gICAgY29uc3QgYWRiVGFyZ2V0ID0gZGV2O1xuICAgIGFkYkNvbm5lY3Rpb24gPSBhZGJUYXJnZXQuYWRiQ29ubmVjdGlvbjtcbiAgICBjb25zb2xlLmxvZyhcIlN0YXJ0IGxvZ2NhdFwiKTtcbiAgICBhZGJDb25uZWN0aW9uLnNoZWxsKFwibG9nY2F0XCIpLnRoZW4oKGJ5dGVzKSA9PiB7IGJ5dGVzLmFkZE9uU3RyZWFtRGF0YUNhbGxiYWNrKGxvZ2NhdERhdGEpOyB9KTtcbiAgICBjb25uZWN0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBjb25uZWN0QnV0dG9uLmlubmVyVGV4dCA9IFwiQ29ubmVjdGVkXFxuXCIgKyBkZXYuZ2V0SW5mbygpLm5hbWU7XG4gICAgcnVuQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgc2NyaXB0QXJlYS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIG91dHB1dEFyZWEuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBsb2djYXRBcmVhLmRpc2FibGVkID0gZmFsc2U7XG4gICAgO1xuICAgIGJ1Z3JlcG9ydEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIDtcbiAgICBzdGFydFJlY29yZEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xufVxuZnVuY3Rpb24gY29ubmVjdERldmljZSgpIHtcbiAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3QgZGV2aWNlXCIpO1xuICAgIGxldCBkZXZpY2VQID0gd2VidXNiLmNvbm5lY3ROZXdUYXJnZXQoKS50aGVuKChkZXZpY2UpID0+IGRldmljZUNvbm5lY3RlZChkZXZpY2UpLCAocmVhc29uKSA9PiB7IGNvbnNvbGUubG9nKFwiRmFpbGVkIHRvIGNvbm5lY3RcIik7IH0pO1xufVxuZnVuY3Rpb24gcmVjdXJzZUNvbW1hbmRMaW5lKHJlc3VsdCkge1xuICAgIGNvbnNvbGUubG9nKFwiR290IFwiICsgcmVzdWx0KTtcbiAgICBvdXRwdXRBcmVhLnZhbHVlID0gb3V0cHV0QXJlYS52YWx1ZSArIHJlc3VsdDtcbiAgICBvdXRwdXRBcmVhLnNjcm9sbFRvcCA9IG91dHB1dEFyZWEuc2Nyb2xsSGVpZ2h0O1xuICAgIHZhciBuZXh0Q01EID0gZ2V0TmV4dENNRCgpO1xuICAgIGlmIChuZXh0Q01EID09IFwiXCIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJGaW5pc2hlZFwiKTtcbiAgICAgICAgc2NyaXB0QXJlYS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBydW5CdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUnVubmluZyBuZXh0OiBcIiArIG5leHRDTUQpO1xuICAgICAgICBhZGJDb25uZWN0aW9uLnNoZWxsQW5kR2V0T3V0cHV0KG5leHRDTUQpLnRoZW4oKHZhbCkgPT4geyByZWN1cnNlQ29tbWFuZExpbmUodmFsKTsgfSk7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0TmV4dENNRCgpIHtcbiAgICBpZiAodG9SdW4ubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgbmV4dENvbW1hbmQgPSB0b1J1blswXTtcbiAgICAgICAgdG9SdW4uc2hpZnQoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXR1cm5pbmc6IFwiICsgbmV4dENvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dENvbW1hbmQ7XG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xufVxuZnVuY3Rpb24gcnVuVGVzdCgpIHtcbiAgICBydW5CdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIHNjcmlwdEFyZWEuZGlzYWJsZWQgPSB0cnVlO1xuICAgIG91dHB1dEFyZWEudmFsdWUgPSBcIlwiO1xuICAgIGxldCB0ZXN0U2NyaXB0ID0gc2NyaXB0QXJlYS52YWx1ZTtcbiAgICBpZiAodGVzdFNjcmlwdC5zcGxpdChcIlxcblwiKS5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRvUnVuID0gdGVzdFNjcmlwdC5zcGxpdChcIlxcblwiKTtcbiAgICB9XG4gICAgdG9SdW4gPSBbdGVzdFNjcmlwdF07XG4gICAgdmFyIGNvbW1hbmQgPSBnZXROZXh0Q01EKCk7XG4gICAgY29uc29sZS5sb2coXCJSdW5uaW5nOiBcIiArIHRlc3RTY3JpcHQpO1xuICAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBzY3JpcHRcbiAgICBhZGJDb25uZWN0aW9uLnNoZWxsQW5kR2V0T3V0cHV0KGNvbW1hbmQpLnRoZW4oKHZhbCkgPT4geyByZWN1cnNlQ29tbWFuZExpbmUodmFsKTsgfSk7XG59XG5jb25uZWN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY29ubmVjdERldmljZSwgZmFsc2UpO1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJydW5fYnV0dG9uXCIpPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJ1blRlc3QsIGZhbHNlKTtcbmlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHsgdmlkZW86IHtcbiAgICAgICAgICAgIGZhY2luZ01vZGU6ICdlbnZpcm9ubWVudCdcbiAgICAgICAgfSB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XG4gICAgICAgIGxldCB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpO1xuICAgICAgICB2aWRlb0VsZW1lbnQuc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyMHIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTb21ldGhpbmcgd2VudCB3cm9uZyFcIiwgZXJyMHIpO1xuICAgIH0pO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9