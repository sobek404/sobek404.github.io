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
const webusb = new android_webusb_target_factory_1.AndroidWebusbTargetFactory(navigator.usb);
var adbConnection;
scriptArea.value = "getprop";
function deviceConnected(dev) {
    const adbTarget = dev;
    adbConnection = adbTarget.adbConnection;
    adbConnection.shellAndGetOutput("dumpsys SurfaceFlinger").then((output) => { console.log(output); });
}
function connectDevice() {
    console.log("Connect device");
    let deviceP = webusb.connectNewTarget().then((device) => deviceConnected(device), (reason) => { console.log("Failed to connect"); });
}
function runTest() {
    runButton.disabled = true;
    scriptArea.disabled = true;
    outputArea.value = "";
    let testScript = scriptArea.value;
    // do something with the script
    adbConnection.shellAndGetOutput(testScript).then((val) => {
        runButton.disabled = false;
        scriptArea.disabled = false;
        outputArea.value = val;
    });
    console.log(testScript);
}
document.getElementById("connect_button")?.addEventListener('click', connectDevice, false);
document.getElementById("run_button")?.addEventListener('click', runTest, false);
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRSxRQUFRO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0EsY0FBYyxTQUFTOztBQUV2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkJBQTJCLFFBQVE7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQixrQkFBa0IsUUFBUTtBQUMxQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxTQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGFBQWE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJEQUEyRDtBQUMzRCwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLElBQUksSUFBOEI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFLEtBQUssRUFJTjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCO0FBQ0E7QUFDQSxnQkFBZ0IsWUFBWTtBQUM1QjtBQUNBLElBQUk7QUFDSjtBQUNBLGdCQUFnQixTQUFTO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixPQUFPO0FBQ2hDO0FBQ0EsNkJBQTZCLE9BQU87QUFDcEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0Esb0NBQW9DLFNBQVM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixRQUFRO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1GQUFtRixVQUFVO0FBQzdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHVCQUF1QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRkFBMEYsS0FBSyxXQUFXLFdBQVc7QUFDckg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxzREFBc0Q7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNBOzs7Ozs7O1VDZlA7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ05hO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHdDQUF3QyxtQkFBTyxDQUFDLHFLQUE0RTtBQUM1SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRkFBaUYsc0JBQXNCO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBLG9HQUFvRyxtQ0FBbUM7QUFDdkk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLGFBQWE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0wiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vbm9kZV9tb2R1bGVzL0Bwcm90b2J1ZmpzL2Jhc2U2NC9pbmRleC5qcyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vbm9kZV9tb2R1bGVzL0Bwcm90b2J1ZmpzL3V0ZjgvaW5kZXguanMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL25vZGVfbW9kdWxlcy9qc2JuLXJzYS9qc2JuLmpzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2UvZGVmZXJyZWQudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS9lcnJvcnMudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS9sb2dnaW5nLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2Uvb2JqZWN0X3V0aWxzLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2Jhc2Uvc3RyaW5nX3V0aWxzLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9hcnJheV9idWZmZXJfYnVpbGRlci50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvYWRiX2Nvbm5lY3Rpb25faW1wbC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvYWRiX2Nvbm5lY3Rpb25fb3Zlcl93ZWJ1c2IudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL2FkYl9maWxlX2hhbmRsZXIudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL2F1dGgvYWRiX2F1dGgudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL2F1dGgvYWRiX2tleV9tYW5hZ2VyLnRzIiwid2VicGFjazovL3BhbF9naXQvLi9zcmMvV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi9yZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmcudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvY29tbW9uL3JlY29yZGluZ1YyL3JlY29yZGluZ191dGlscy50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvdGFyZ2V0X2ZhY3Rvcmllcy9hbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeS50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvdGFyZ2V0cy9hbmRyb2lkX3RhcmdldC50cyIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL1dlYkFkYi9jb21tb24vcmVjb3JkaW5nVjIvdGFyZ2V0cy9hbmRyb2lkX3dlYnVzYl90YXJnZXQudHMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC8uL3NyYy9XZWJBZGIvYmFzZS91dGlscy9pbmRleC1icm93c2VyLmpzIiwid2VicGFjazovL3BhbF9naXQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGFsX2dpdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BhbF9naXQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wYWxfZ2l0Ly4vc3JjL3BhbC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuXHJcbi8qKlxyXG4gKiBBIG1pbmltYWwgYmFzZTY0IGltcGxlbWVudGF0aW9uIGZvciBudW1iZXIgYXJyYXlzLlxyXG4gKiBAbWVtYmVyb2YgdXRpbFxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqL1xyXG52YXIgYmFzZTY0ID0gZXhwb3J0cztcclxuXHJcbi8qKlxyXG4gKiBDYWxjdWxhdGVzIHRoZSBieXRlIGxlbmd0aCBvZiBhIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBCYXNlNjQgZW5jb2RlZCBzdHJpbmdcclxuICogQHJldHVybnMge251bWJlcn0gQnl0ZSBsZW5ndGhcclxuICovXHJcbmJhc2U2NC5sZW5ndGggPSBmdW5jdGlvbiBsZW5ndGgoc3RyaW5nKSB7XHJcbiAgICB2YXIgcCA9IHN0cmluZy5sZW5ndGg7XHJcbiAgICBpZiAoIXApXHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB2YXIgbiA9IDA7XHJcbiAgICB3aGlsZSAoLS1wICUgNCA+IDEgJiYgc3RyaW5nLmNoYXJBdChwKSA9PT0gXCI9XCIpXHJcbiAgICAgICAgKytuO1xyXG4gICAgcmV0dXJuIE1hdGguY2VpbChzdHJpbmcubGVuZ3RoICogMykgLyA0IC0gbjtcclxufTtcclxuXHJcbi8vIEJhc2U2NCBlbmNvZGluZyB0YWJsZVxyXG52YXIgYjY0ID0gbmV3IEFycmF5KDY0KTtcclxuXHJcbi8vIEJhc2U2NCBkZWNvZGluZyB0YWJsZVxyXG52YXIgczY0ID0gbmV3IEFycmF5KDEyMyk7XHJcblxyXG4vLyA2NS4uOTAsIDk3Li4xMjIsIDQ4Li41NywgNDMsIDQ3XHJcbmZvciAodmFyIGkgPSAwOyBpIDwgNjQ7KVxyXG4gICAgczY0W2I2NFtpXSA9IGkgPCAyNiA/IGkgKyA2NSA6IGkgPCA1MiA/IGkgKyA3MSA6IGkgPCA2MiA/IGkgLSA0IDogaSAtIDU5IHwgNDNdID0gaSsrO1xyXG5cclxuLyoqXHJcbiAqIEVuY29kZXMgYSBidWZmZXIgdG8gYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAqIEBwYXJhbSB7VWludDhBcnJheX0gYnVmZmVyIFNvdXJjZSBidWZmZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IHN0YXJ0IFNvdXJjZSBzdGFydFxyXG4gKiBAcGFyYW0ge251bWJlcn0gZW5kIFNvdXJjZSBlbmRcclxuICogQHJldHVybnMge3N0cmluZ30gQmFzZTY0IGVuY29kZWQgc3RyaW5nXHJcbiAqL1xyXG5iYXNlNjQuZW5jb2RlID0gZnVuY3Rpb24gZW5jb2RlKGJ1ZmZlciwgc3RhcnQsIGVuZCkge1xyXG4gICAgdmFyIHBhcnRzID0gbnVsbCxcclxuICAgICAgICBjaHVuayA9IFtdO1xyXG4gICAgdmFyIGkgPSAwLCAvLyBvdXRwdXQgaW5kZXhcclxuICAgICAgICBqID0gMCwgLy8gZ290byBpbmRleFxyXG4gICAgICAgIHQ7ICAgICAvLyB0ZW1wb3JhcnlcclxuICAgIHdoaWxlIChzdGFydCA8IGVuZCkge1xyXG4gICAgICAgIHZhciBiID0gYnVmZmVyW3N0YXJ0KytdO1xyXG4gICAgICAgIHN3aXRjaCAoaikge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBjaHVua1tpKytdID0gYjY0W2IgPj4gMl07XHJcbiAgICAgICAgICAgICAgICB0ID0gKGIgJiAzKSA8PCA0O1xyXG4gICAgICAgICAgICAgICAgaiA9IDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgY2h1bmtbaSsrXSA9IGI2NFt0IHwgYiA+PiA0XTtcclxuICAgICAgICAgICAgICAgIHQgPSAoYiAmIDE1KSA8PCAyO1xyXG4gICAgICAgICAgICAgICAgaiA9IDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgY2h1bmtbaSsrXSA9IGI2NFt0IHwgYiA+PiA2XTtcclxuICAgICAgICAgICAgICAgIGNodW5rW2krK10gPSBiNjRbYiAmIDYzXTtcclxuICAgICAgICAgICAgICAgIGogPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpID4gODE5MSkge1xyXG4gICAgICAgICAgICAocGFydHMgfHwgKHBhcnRzID0gW10pKS5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjaHVuaykpO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaikge1xyXG4gICAgICAgIGNodW5rW2krK10gPSBiNjRbdF07XHJcbiAgICAgICAgY2h1bmtbaSsrXSA9IDYxO1xyXG4gICAgICAgIGlmIChqID09PSAxKVxyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gNjE7XHJcbiAgICB9XHJcbiAgICBpZiAocGFydHMpIHtcclxuICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgcGFydHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmsuc2xpY2UoMCwgaSkpKTtcclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmsuc2xpY2UoMCwgaSkpO1xyXG59O1xyXG5cclxudmFyIGludmFsaWRFbmNvZGluZyA9IFwiaW52YWxpZCBlbmNvZGluZ1wiO1xyXG5cclxuLyoqXHJcbiAqIERlY29kZXMgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcgdG8gYSBidWZmZXIuXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgU291cmNlIHN0cmluZ1xyXG4gKiBAcGFyYW0ge1VpbnQ4QXJyYXl9IGJ1ZmZlciBEZXN0aW5hdGlvbiBidWZmZXJcclxuICogQHBhcmFtIHtudW1iZXJ9IG9mZnNldCBEZXN0aW5hdGlvbiBvZmZzZXRcclxuICogQHJldHVybnMge251bWJlcn0gTnVtYmVyIG9mIGJ5dGVzIHdyaXR0ZW5cclxuICogQHRocm93cyB7RXJyb3J9IElmIGVuY29kaW5nIGlzIGludmFsaWRcclxuICovXHJcbmJhc2U2NC5kZWNvZGUgPSBmdW5jdGlvbiBkZWNvZGUoc3RyaW5nLCBidWZmZXIsIG9mZnNldCkge1xyXG4gICAgdmFyIHN0YXJ0ID0gb2Zmc2V0O1xyXG4gICAgdmFyIGogPSAwLCAvLyBnb3RvIGluZGV4XHJcbiAgICAgICAgdDsgICAgIC8vIHRlbXBvcmFyeVxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOykge1xyXG4gICAgICAgIHZhciBjID0gc3RyaW5nLmNoYXJDb2RlQXQoaSsrKTtcclxuICAgICAgICBpZiAoYyA9PT0gNjEgJiYgaiA+IDEpXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGlmICgoYyA9IHM2NFtjXSkgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEVuY29kaW5nKTtcclxuICAgICAgICBzd2l0Y2ggKGopIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgdCA9IGM7XHJcbiAgICAgICAgICAgICAgICBqID0gMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gdCA8PCAyIHwgKGMgJiA0OCkgPj4gNDtcclxuICAgICAgICAgICAgICAgIHQgPSBjO1xyXG4gICAgICAgICAgICAgICAgaiA9IDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9ICh0ICYgMTUpIDw8IDQgfCAoYyAmIDYwKSA+PiAyO1xyXG4gICAgICAgICAgICAgICAgdCA9IGM7XHJcbiAgICAgICAgICAgICAgICBqID0gMztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gKHQgJiAzKSA8PCA2IHwgYztcclxuICAgICAgICAgICAgICAgIGogPSAwO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGogPT09IDEpXHJcbiAgICAgICAgdGhyb3cgRXJyb3IoaW52YWxpZEVuY29kaW5nKTtcclxuICAgIHJldHVybiBvZmZzZXQgLSBzdGFydDtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBUZXN0cyBpZiB0aGUgc3BlY2lmaWVkIHN0cmluZyBhcHBlYXJzIHRvIGJlIGJhc2U2NCBlbmNvZGVkLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFN0cmluZyB0byB0ZXN0XHJcbiAqIEByZXR1cm5zIHtib29sZWFufSBgdHJ1ZWAgaWYgcHJvYmFibHkgYmFzZTY0IGVuY29kZWQsIG90aGVyd2lzZSBmYWxzZVxyXG4gKi9cclxuYmFzZTY0LnRlc3QgPSBmdW5jdGlvbiB0ZXN0KHN0cmluZykge1xyXG4gICAgcmV0dXJuIC9eKD86W0EtWmEtejAtOSsvXXs0fSkqKD86W0EtWmEtejAtOSsvXXsyfT09fFtBLVphLXowLTkrL117M309KT8kLy50ZXN0KHN0cmluZyk7XHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyoqXHJcbiAqIEEgbWluaW1hbCBVVEY4IGltcGxlbWVudGF0aW9uIGZvciBudW1iZXIgYXJyYXlzLlxyXG4gKiBAbWVtYmVyb2YgdXRpbFxyXG4gKiBAbmFtZXNwYWNlXHJcbiAqL1xyXG52YXIgdXRmOCA9IGV4cG9ydHM7XHJcblxyXG4vKipcclxuICogQ2FsY3VsYXRlcyB0aGUgVVRGOCBieXRlIGxlbmd0aCBvZiBhIHN0cmluZy5cclxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBTdHJpbmdcclxuICogQHJldHVybnMge251bWJlcn0gQnl0ZSBsZW5ndGhcclxuICovXHJcbnV0ZjgubGVuZ3RoID0gZnVuY3Rpb24gdXRmOF9sZW5ndGgoc3RyaW5nKSB7XHJcbiAgICB2YXIgbGVuID0gMCxcclxuICAgICAgICBjID0gMDtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgYyA9IHN0cmluZy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIGlmIChjIDwgMTI4KVxyXG4gICAgICAgICAgICBsZW4gKz0gMTtcclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OClcclxuICAgICAgICAgICAgbGVuICs9IDI7XHJcbiAgICAgICAgZWxzZSBpZiAoKGMgJiAweEZDMDApID09PSAweEQ4MDAgJiYgKHN0cmluZy5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4RkMwMCkgPT09IDB4REMwMCkge1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGxlbiArPSA0O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBsZW4gKz0gMztcclxuICAgIH1cclxuICAgIHJldHVybiBsZW47XHJcbn07XHJcblxyXG4vKipcclxuICogUmVhZHMgVVRGOCBieXRlcyBhcyBhIHN0cmluZy5cclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBidWZmZXIgU291cmNlIGJ1ZmZlclxyXG4gKiBAcGFyYW0ge251bWJlcn0gc3RhcnQgU291cmNlIHN0YXJ0XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBlbmQgU291cmNlIGVuZFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBTdHJpbmcgcmVhZFxyXG4gKi9cclxudXRmOC5yZWFkID0gZnVuY3Rpb24gdXRmOF9yZWFkKGJ1ZmZlciwgc3RhcnQsIGVuZCkge1xyXG4gICAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0O1xyXG4gICAgaWYgKGxlbiA8IDEpXHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB2YXIgcGFydHMgPSBudWxsLFxyXG4gICAgICAgIGNodW5rID0gW10sXHJcbiAgICAgICAgaSA9IDAsIC8vIGNoYXIgb2Zmc2V0XHJcbiAgICAgICAgdDsgICAgIC8vIHRlbXBvcmFyeVxyXG4gICAgd2hpbGUgKHN0YXJ0IDwgZW5kKSB7XHJcbiAgICAgICAgdCA9IGJ1ZmZlcltzdGFydCsrXTtcclxuICAgICAgICBpZiAodCA8IDEyOClcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9IHQ7XHJcbiAgICAgICAgZWxzZSBpZiAodCA+IDE5MSAmJiB0IDwgMjI0KVxyXG4gICAgICAgICAgICBjaHVua1tpKytdID0gKHQgJiAzMSkgPDwgNiB8IGJ1ZmZlcltzdGFydCsrXSAmIDYzO1xyXG4gICAgICAgIGVsc2UgaWYgKHQgPiAyMzkgJiYgdCA8IDM2NSkge1xyXG4gICAgICAgICAgICB0ID0gKCh0ICYgNykgPDwgMTggfCAoYnVmZmVyW3N0YXJ0KytdICYgNjMpIDw8IDEyIHwgKGJ1ZmZlcltzdGFydCsrXSAmIDYzKSA8PCA2IHwgYnVmZmVyW3N0YXJ0KytdICYgNjMpIC0gMHgxMDAwMDtcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9IDB4RDgwMCArICh0ID4+IDEwKTtcclxuICAgICAgICAgICAgY2h1bmtbaSsrXSA9IDB4REMwMCArICh0ICYgMTAyMyk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGNodW5rW2krK10gPSAodCAmIDE1KSA8PCAxMiB8IChidWZmZXJbc3RhcnQrK10gJiA2MykgPDwgNiB8IGJ1ZmZlcltzdGFydCsrXSAmIDYzO1xyXG4gICAgICAgIGlmIChpID4gODE5MSkge1xyXG4gICAgICAgICAgICAocGFydHMgfHwgKHBhcnRzID0gW10pKS5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjaHVuaykpO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAocGFydHMpIHtcclxuICAgICAgICBpZiAoaSlcclxuICAgICAgICAgICAgcGFydHMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmsuc2xpY2UoMCwgaSkpKTtcclxuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFN0cmluZywgY2h1bmsuc2xpY2UoMCwgaSkpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFdyaXRlcyBhIHN0cmluZyBhcyBVVEY4IGJ5dGVzLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFNvdXJjZSBzdHJpbmdcclxuICogQHBhcmFtIHtVaW50OEFycmF5fSBidWZmZXIgRGVzdGluYXRpb24gYnVmZmVyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBvZmZzZXQgRGVzdGluYXRpb24gb2Zmc2V0XHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEJ5dGVzIHdyaXR0ZW5cclxuICovXHJcbnV0Zjgud3JpdGUgPSBmdW5jdGlvbiB1dGY4X3dyaXRlKHN0cmluZywgYnVmZmVyLCBvZmZzZXQpIHtcclxuICAgIHZhciBzdGFydCA9IG9mZnNldCxcclxuICAgICAgICBjMSwgLy8gY2hhcmFjdGVyIDFcclxuICAgICAgICBjMjsgLy8gY2hhcmFjdGVyIDJcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgYzEgPSBzdHJpbmcuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBpZiAoYzEgPCAxMjgpIHtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYzEgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiA2ICAgICAgIHwgMTkyO1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgICAgICAgJiA2MyB8IDEyODtcclxuICAgICAgICB9IGVsc2UgaWYgKChjMSAmIDB4RkMwMCkgPT09IDB4RDgwMCAmJiAoKGMyID0gc3RyaW5nLmNoYXJDb2RlQXQoaSArIDEpKSAmIDB4RkMwMCkgPT09IDB4REMwMCkge1xyXG4gICAgICAgICAgICBjMSA9IDB4MTAwMDAgKyAoKGMxICYgMHgwM0ZGKSA8PCAxMCkgKyAoYzIgJiAweDAzRkYpO1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiAxOCAgICAgIHwgMjQwO1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gMTIgJiA2MyB8IDEyODtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxID4+IDYgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSAgICAgICAmIDYzIHwgMTI4O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGJ1ZmZlcltvZmZzZXQrK10gPSBjMSA+PiAxMiAgICAgIHwgMjI0O1xyXG4gICAgICAgICAgICBidWZmZXJbb2Zmc2V0KytdID0gYzEgPj4gNiAgJiA2MyB8IDEyODtcclxuICAgICAgICAgICAgYnVmZmVyW29mZnNldCsrXSA9IGMxICAgICAgICYgNjMgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9mZnNldCAtIHN0YXJ0O1xyXG59O1xyXG4iLCJcbihmdW5jdGlvbigpIHtcblxuLy8gQ29weXJpZ2h0IChjKSAyMDA1ICBUb20gV3Vcbi8vIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBTZWUgXCJMSUNFTlNFXCIgZm9yIGRldGFpbHMuXG5cbi8vIEJhc2ljIEphdmFTY3JpcHQgQk4gbGlicmFyeSAtIHN1YnNldCB1c2VmdWwgZm9yIFJTQSBlbmNyeXB0aW9uLlxuXG52YXIgaW5Ccm93c2VyID1cbiAgICB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcblxuLy8gQml0cyBwZXIgZGlnaXRcbnZhciBkYml0cztcblxuLy8gSmF2YVNjcmlwdCBlbmdpbmUgYW5hbHlzaXNcbnZhciBjYW5hcnkgPSAweGRlYWRiZWVmY2FmZTtcbnZhciBqX2xtID0gKChjYW5hcnkgJiAweGZmZmZmZikgPT0gMHhlZmNhZmUpO1xuXG4vLyAocHVibGljKSBDb25zdHJ1Y3RvclxuZnVuY3Rpb24gQmlnSW50ZWdlcihhLCBiLCBjKSB7XG4gIGlmIChhICE9IG51bGwpXG4gICAgaWYgKCdudW1iZXInID09IHR5cGVvZiBhKVxuICAgICAgdGhpcy5mcm9tTnVtYmVyKGEsIGIsIGMpO1xuICAgIGVsc2UgaWYgKGIgPT0gbnVsbCAmJiAnc3RyaW5nJyAhPSB0eXBlb2YgYSlcbiAgICAgIHRoaXMuZnJvbVN0cmluZyhhLCAyNTYpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuZnJvbVN0cmluZyhhLCBiKTtcbn1cblxuLy8gcmV0dXJuIG5ldywgdW5zZXQgQmlnSW50ZWdlclxuZnVuY3Rpb24gbmJpKCkge1xuICByZXR1cm4gbmV3IEJpZ0ludGVnZXIobnVsbCk7XG59XG5cbi8vIGFtOiBDb21wdXRlIHdfaiArPSAoeCp0aGlzX2kpLCBwcm9wYWdhdGUgY2Fycmllcyxcbi8vIGMgaXMgaW5pdGlhbCBjYXJyeSwgcmV0dXJucyBmaW5hbCBjYXJyeS5cbi8vIGMgPCAzKmR2YWx1ZSwgeCA8IDIqZHZhbHVlLCB0aGlzX2kgPCBkdmFsdWVcbi8vIFdlIG5lZWQgdG8gc2VsZWN0IHRoZSBmYXN0ZXN0IG9uZSB0aGF0IHdvcmtzIGluIHRoaXMgZW52aXJvbm1lbnQuXG5cbi8vIGFtMTogdXNlIGEgc2luZ2xlIG11bHQgYW5kIGRpdmlkZSB0byBnZXQgdGhlIGhpZ2ggYml0cyxcbi8vIG1heCBkaWdpdCBiaXRzIHNob3VsZCBiZSAyNiBiZWNhdXNlXG4vLyBtYXggaW50ZXJuYWwgdmFsdWUgPSAyKmR2YWx1ZV4yLTIqZHZhbHVlICg8IDJeNTMpXG5mdW5jdGlvbiBhbTEoaSwgeCwgdywgaiwgYywgbikge1xuICB3aGlsZSAoLS1uID49IDApIHtcbiAgICB2YXIgdiA9IHggKiB0aGlzW2krK10gKyB3W2pdICsgYztcbiAgICBjID0gTWF0aC5mbG9vcih2IC8gMHg0MDAwMDAwKTtcbiAgICB3W2orK10gPSB2ICYgMHgzZmZmZmZmO1xuICB9XG4gIHJldHVybiBjO1xufVxuLy8gYW0yIGF2b2lkcyBhIGJpZyBtdWx0LWFuZC1leHRyYWN0IGNvbXBsZXRlbHkuXG4vLyBNYXggZGlnaXQgYml0cyBzaG91bGQgYmUgPD0gMzAgYmVjYXVzZSB3ZSBkbyBiaXR3aXNlIG9wc1xuLy8gb24gdmFsdWVzIHVwIHRvIDIqaGR2YWx1ZV4yLWhkdmFsdWUtMSAoPCAyXjMxKVxuZnVuY3Rpb24gYW0yKGksIHgsIHcsIGosIGMsIG4pIHtcbiAgdmFyIHhsID0geCAmIDB4N2ZmZiwgeGggPSB4ID4+IDE1O1xuICB3aGlsZSAoLS1uID49IDApIHtcbiAgICB2YXIgbCA9IHRoaXNbaV0gJiAweDdmZmY7XG4gICAgdmFyIGggPSB0aGlzW2krK10gPj4gMTU7XG4gICAgdmFyIG0gPSB4aCAqIGwgKyBoICogeGw7XG4gICAgbCA9IHhsICogbCArICgobSAmIDB4N2ZmZikgPDwgMTUpICsgd1tqXSArIChjICYgMHgzZmZmZmZmZik7XG4gICAgYyA9IChsID4+PiAzMCkgKyAobSA+Pj4gMTUpICsgeGggKiBoICsgKGMgPj4+IDMwKTtcbiAgICB3W2orK10gPSBsICYgMHgzZmZmZmZmZjtcbiAgfVxuICByZXR1cm4gYztcbn1cbi8vIEFsdGVybmF0ZWx5LCBzZXQgbWF4IGRpZ2l0IGJpdHMgdG8gMjggc2luY2Ugc29tZVxuLy8gYnJvd3NlcnMgc2xvdyBkb3duIHdoZW4gZGVhbGluZyB3aXRoIDMyLWJpdCBudW1iZXJzLlxuZnVuY3Rpb24gYW0zKGksIHgsIHcsIGosIGMsIG4pIHtcbiAgdmFyIHhsID0geCAmIDB4M2ZmZiwgeGggPSB4ID4+IDE0O1xuICB3aGlsZSAoLS1uID49IDApIHtcbiAgICB2YXIgbCA9IHRoaXNbaV0gJiAweDNmZmY7XG4gICAgdmFyIGggPSB0aGlzW2krK10gPj4gMTQ7XG4gICAgdmFyIG0gPSB4aCAqIGwgKyBoICogeGw7XG4gICAgbCA9IHhsICogbCArICgobSAmIDB4M2ZmZikgPDwgMTQpICsgd1tqXSArIGM7XG4gICAgYyA9IChsID4+IDI4KSArIChtID4+IDE0KSArIHhoICogaDtcbiAgICB3W2orK10gPSBsICYgMHhmZmZmZmZmO1xuICB9XG4gIHJldHVybiBjO1xufVxuaWYgKGluQnJvd3NlciAmJiBqX2xtICYmIChuYXZpZ2F0b3IuYXBwTmFtZSA9PSAnTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyJykpIHtcbiAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTI7XG4gIGRiaXRzID0gMzA7XG59IGVsc2UgaWYgKGluQnJvd3NlciAmJiBqX2xtICYmIChuYXZpZ2F0b3IuYXBwTmFtZSAhPSAnTmV0c2NhcGUnKSkge1xuICBCaWdJbnRlZ2VyLnByb3RvdHlwZS5hbSA9IGFtMTtcbiAgZGJpdHMgPSAyNjtcbn0gZWxzZSB7ICAvLyBNb3ppbGxhL05ldHNjYXBlIHNlZW1zIHRvIHByZWZlciBhbTNcbiAgQmlnSW50ZWdlci5wcm90b3R5cGUuYW0gPSBhbTM7XG4gIGRiaXRzID0gMjg7XG59XG5cbkJpZ0ludGVnZXIucHJvdG90eXBlLkRCID0gZGJpdHM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5ETSA9ICgoMSA8PCBkYml0cykgLSAxKTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLkRWID0gKDEgPDwgZGJpdHMpO1xuXG52YXIgQklfRlAgPSA1MjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLkZWID0gTWF0aC5wb3coMiwgQklfRlApO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRjEgPSBCSV9GUCAtIGRiaXRzO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRjIgPSAyICogZGJpdHMgLSBCSV9GUDtcblxuLy8gRGlnaXQgY29udmVyc2lvbnNcbnZhciBCSV9STSA9ICcwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonO1xudmFyIEJJX1JDID0gbmV3IEFycmF5KCk7XG52YXIgcnIsIHZ2O1xucnIgPSAnMCcuY2hhckNvZGVBdCgwKTtcbmZvciAodnYgPSAwOyB2diA8PSA5OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2O1xucnIgPSAnYScuY2hhckNvZGVBdCgwKTtcbmZvciAodnYgPSAxMDsgdnYgPCAzNjsgKyt2dikgQklfUkNbcnIrK10gPSB2djtcbnJyID0gJ0EnLmNoYXJDb2RlQXQoMCk7XG5mb3IgKHZ2ID0gMTA7IHZ2IDwgMzY7ICsrdnYpIEJJX1JDW3JyKytdID0gdnY7XG5cbmZ1bmN0aW9uIGludDJjaGFyKG4pIHtcbiAgcmV0dXJuIEJJX1JNLmNoYXJBdChuKTtcbn1cbmZ1bmN0aW9uIGludEF0KHMsIGkpIHtcbiAgdmFyIGMgPSBCSV9SQ1tzLmNoYXJDb2RlQXQoaSldO1xuICByZXR1cm4gKGMgPT0gbnVsbCkgPyAtMSA6IGM7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvcHkgdGhpcyB0byByXG5mdW5jdGlvbiBibnBDb3B5VG8ocikge1xuICBmb3IgKHZhciBpID0gdGhpcy50IC0gMTsgaSA+PSAwOyAtLWkpIHJbaV0gPSB0aGlzW2ldO1xuICByLnQgPSB0aGlzLnQ7XG4gIHIucyA9IHRoaXMucztcbn1cblxuLy8gKHByb3RlY3RlZCkgc2V0IGZyb20gaW50ZWdlciB2YWx1ZSB4LCAtRFYgPD0geCA8IERWXG5mdW5jdGlvbiBibnBGcm9tSW50KHgpIHtcbiAgdGhpcy50ID0gMTtcbiAgdGhpcy5zID0gKHggPCAwKSA/IC0xIDogMDtcbiAgaWYgKHggPiAwKVxuICAgIHRoaXNbMF0gPSB4O1xuICBlbHNlIGlmICh4IDwgLTEpXG4gICAgdGhpc1swXSA9IHggKyB0aGlzLkRWO1xuICBlbHNlXG4gICAgdGhpcy50ID0gMDtcbn1cblxuLy8gcmV0dXJuIGJpZ2ludCBpbml0aWFsaXplZCB0byB2YWx1ZVxuZnVuY3Rpb24gbmJ2KGkpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgci5mcm9tSW50KGkpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHByb3RlY3RlZCkgc2V0IGZyb20gc3RyaW5nIGFuZCByYWRpeFxuZnVuY3Rpb24gYm5wRnJvbVN0cmluZyhzLCBiKSB7XG4gIHZhciBrO1xuICBpZiAoYiA9PSAxNilcbiAgICBrID0gNDtcbiAgZWxzZSBpZiAoYiA9PSA4KVxuICAgIGsgPSAzO1xuICBlbHNlIGlmIChiID09IDI1NilcbiAgICBrID0gODsgIC8vIGJ5dGUgYXJyYXlcbiAgZWxzZSBpZiAoYiA9PSAyKVxuICAgIGsgPSAxO1xuICBlbHNlIGlmIChiID09IDMyKVxuICAgIGsgPSA1O1xuICBlbHNlIGlmIChiID09IDQpXG4gICAgayA9IDI7XG4gIGVsc2Uge1xuICAgIHRoaXMuZnJvbVJhZGl4KHMsIGIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0aGlzLnQgPSAwO1xuICB0aGlzLnMgPSAwO1xuICB2YXIgaSA9IHMubGVuZ3RoLCBtaSA9IGZhbHNlLCBzaCA9IDA7XG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIHZhciB4ID0gKGsgPT0gOCkgPyBzW2ldICYgMHhmZiA6IGludEF0KHMsIGkpO1xuICAgIGlmICh4IDwgMCkge1xuICAgICAgaWYgKHMuY2hhckF0KGkpID09ICctJykgbWkgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIG1pID0gZmFsc2U7XG4gICAgaWYgKHNoID09IDApXG4gICAgICB0aGlzW3RoaXMudCsrXSA9IHg7XG4gICAgZWxzZSBpZiAoc2ggKyBrID4gdGhpcy5EQikge1xuICAgICAgdGhpc1t0aGlzLnQgLSAxXSB8PSAoeCAmICgoMSA8PCAodGhpcy5EQiAtIHNoKSkgLSAxKSkgPDwgc2g7XG4gICAgICB0aGlzW3RoaXMudCsrXSA9ICh4ID4+ICh0aGlzLkRCIC0gc2gpKTtcbiAgICB9IGVsc2VcbiAgICAgIHRoaXNbdGhpcy50IC0gMV0gfD0geCA8PCBzaDtcbiAgICBzaCArPSBrO1xuICAgIGlmIChzaCA+PSB0aGlzLkRCKSBzaCAtPSB0aGlzLkRCO1xuICB9XG4gIGlmIChrID09IDggJiYgKHNbMF0gJiAweDgwKSAhPSAwKSB7XG4gICAgdGhpcy5zID0gLTE7XG4gICAgaWYgKHNoID4gMCkgdGhpc1t0aGlzLnQgLSAxXSB8PSAoKDEgPDwgKHRoaXMuREIgLSBzaCkpIC0gMSkgPDwgc2g7XG4gIH1cbiAgdGhpcy5jbGFtcCgpO1xuICBpZiAobWkpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLCB0aGlzKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgY2xhbXAgb2ZmIGV4Y2VzcyBoaWdoIHdvcmRzXG5mdW5jdGlvbiBibnBDbGFtcCgpIHtcbiAgdmFyIGMgPSB0aGlzLnMgJiB0aGlzLkRNO1xuICB3aGlsZSAodGhpcy50ID4gMCAmJiB0aGlzW3RoaXMudCAtIDFdID09IGMpIC0tdGhpcy50O1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gc3RyaW5nIHJlcHJlc2VudGF0aW9uIGluIGdpdmVuIHJhZGl4XG5mdW5jdGlvbiBiblRvU3RyaW5nKGIpIHtcbiAgaWYgKHRoaXMucyA8IDApIHJldHVybiAnLScgKyB0aGlzLm5lZ2F0ZSgpLnRvU3RyaW5nKGIpO1xuICB2YXIgaztcbiAgaWYgKGIgPT0gMTYpXG4gICAgayA9IDQ7XG4gIGVsc2UgaWYgKGIgPT0gOClcbiAgICBrID0gMztcbiAgZWxzZSBpZiAoYiA9PSAyKVxuICAgIGsgPSAxO1xuICBlbHNlIGlmIChiID09IDMyKVxuICAgIGsgPSA1O1xuICBlbHNlIGlmIChiID09IDQpXG4gICAgayA9IDI7XG4gIGVsc2VcbiAgICByZXR1cm4gdGhpcy50b1JhZGl4KGIpO1xuICB2YXIga20gPSAoMSA8PCBrKSAtIDEsIGQsIG0gPSBmYWxzZSwgciA9ICcnLCBpID0gdGhpcy50O1xuICB2YXIgcCA9IHRoaXMuREIgLSAoaSAqIHRoaXMuREIpICUgaztcbiAgaWYgKGktLSA+IDApIHtcbiAgICBpZiAocCA8IHRoaXMuREIgJiYgKGQgPSB0aGlzW2ldID4+IHApID4gMCkge1xuICAgICAgbSA9IHRydWU7XG4gICAgICByID0gaW50MmNoYXIoZCk7XG4gICAgfVxuICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgIGlmIChwIDwgaykge1xuICAgICAgICBkID0gKHRoaXNbaV0gJiAoKDEgPDwgcCkgLSAxKSkgPDwgKGsgLSBwKTtcbiAgICAgICAgZCB8PSB0aGlzWy0taV0gPj4gKHAgKz0gdGhpcy5EQiAtIGspO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZCA9ICh0aGlzW2ldID4+IChwIC09IGspKSAmIGttO1xuICAgICAgICBpZiAocCA8PSAwKSB7XG4gICAgICAgICAgcCArPSB0aGlzLkRCO1xuICAgICAgICAgIC0taTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGQgPiAwKSBtID0gdHJ1ZTtcbiAgICAgIGlmIChtKSByICs9IGludDJjaGFyKGQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbSA/IHIgOiAnMCc7XG59XG5cbi8vIChwdWJsaWMpIC10aGlzXG5mdW5jdGlvbiBibk5lZ2F0ZSgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgfHRoaXN8XG5mdW5jdGlvbiBibkFicygpIHtcbiAgcmV0dXJuICh0aGlzLnMgPCAwKSA/IHRoaXMubmVnYXRlKCkgOiB0aGlzO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gKyBpZiB0aGlzID4gYSwgLSBpZiB0aGlzIDwgYSwgMCBpZiBlcXVhbFxuZnVuY3Rpb24gYm5Db21wYXJlVG8oYSkge1xuICB2YXIgciA9IHRoaXMucyAtIGEucztcbiAgaWYgKHIgIT0gMCkgcmV0dXJuIHI7XG4gIHZhciBpID0gdGhpcy50O1xuICByID0gaSAtIGEudDtcbiAgaWYgKHIgIT0gMCkgcmV0dXJuICh0aGlzLnMgPCAwKSA/IC1yIDogcjtcbiAgd2hpbGUgKC0taSA+PSAwKVxuICAgIGlmICgociA9IHRoaXNbaV0gLSBhW2ldKSAhPSAwKSByZXR1cm4gcjtcbiAgcmV0dXJuIDA7XG59XG5cbi8vIHJldHVybnMgYml0IGxlbmd0aCBvZiB0aGUgaW50ZWdlciB4XG5mdW5jdGlvbiBuYml0cyh4KSB7XG4gIHZhciByID0gMSwgdDtcbiAgaWYgKCh0ID0geCA+Pj4gMTYpICE9IDApIHtcbiAgICB4ID0gdDtcbiAgICByICs9IDE2O1xuICB9XG4gIGlmICgodCA9IHggPj4gOCkgIT0gMCkge1xuICAgIHggPSB0O1xuICAgIHIgKz0gODtcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDQpICE9IDApIHtcbiAgICB4ID0gdDtcbiAgICByICs9IDQ7XG4gIH1cbiAgaWYgKCh0ID0geCA+PiAyKSAhPSAwKSB7XG4gICAgeCA9IHQ7XG4gICAgciArPSAyO1xuICB9XG4gIGlmICgodCA9IHggPj4gMSkgIT0gMCkge1xuICAgIHggPSB0O1xuICAgIHIgKz0gMTtcbiAgfVxuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHRoZSBudW1iZXIgb2YgYml0cyBpbiBcInRoaXNcIlxuZnVuY3Rpb24gYm5CaXRMZW5ndGgoKSB7XG4gIGlmICh0aGlzLnQgPD0gMCkgcmV0dXJuIDA7XG4gIHJldHVybiB0aGlzLkRCICogKHRoaXMudCAtIDEpICsgbmJpdHModGhpc1t0aGlzLnQgLSAxXSBeICh0aGlzLnMgJiB0aGlzLkRNKSk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIDw8IG4qREJcbmZ1bmN0aW9uIGJucERMU2hpZnRUbyhuLCByKSB7XG4gIHZhciBpO1xuICBmb3IgKGkgPSB0aGlzLnQgLSAxOyBpID49IDA7IC0taSkgcltpICsgbl0gPSB0aGlzW2ldO1xuICBmb3IgKGkgPSBuIC0gMTsgaSA+PSAwOyAtLWkpIHJbaV0gPSAwO1xuICByLnQgPSB0aGlzLnQgKyBuO1xuICByLnMgPSB0aGlzLnM7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzID4+IG4qREJcbmZ1bmN0aW9uIGJucERSU2hpZnRUbyhuLCByKSB7XG4gIGZvciAodmFyIGkgPSBuOyBpIDwgdGhpcy50OyArK2kpIHJbaSAtIG5dID0gdGhpc1tpXTtcbiAgci50ID0gTWF0aC5tYXgodGhpcy50IC0gbiwgMCk7XG4gIHIucyA9IHRoaXMucztcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPDwgblxuZnVuY3Rpb24gYm5wTFNoaWZ0VG8obiwgcikge1xuICB2YXIgYnMgPSBuICUgdGhpcy5EQjtcbiAgdmFyIGNicyA9IHRoaXMuREIgLSBicztcbiAgdmFyIGJtID0gKDEgPDwgY2JzKSAtIDE7XG4gIHZhciBkcyA9IE1hdGguZmxvb3IobiAvIHRoaXMuREIpLCBjID0gKHRoaXMucyA8PCBicykgJiB0aGlzLkRNLCBpO1xuICBmb3IgKGkgPSB0aGlzLnQgLSAxOyBpID49IDA7IC0taSkge1xuICAgIHJbaSArIGRzICsgMV0gPSAodGhpc1tpXSA+PiBjYnMpIHwgYztcbiAgICBjID0gKHRoaXNbaV0gJiBibSkgPDwgYnM7XG4gIH1cbiAgZm9yIChpID0gZHMgLSAxOyBpID49IDA7IC0taSkgcltpXSA9IDA7XG4gIHJbZHNdID0gYztcbiAgci50ID0gdGhpcy50ICsgZHMgKyAxO1xuICByLnMgPSB0aGlzLnM7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gblxuZnVuY3Rpb24gYm5wUlNoaWZ0VG8obiwgcikge1xuICByLnMgPSB0aGlzLnM7XG4gIHZhciBkcyA9IE1hdGguZmxvb3IobiAvIHRoaXMuREIpO1xuICBpZiAoZHMgPj0gdGhpcy50KSB7XG4gICAgci50ID0gMDtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGJzID0gbiAlIHRoaXMuREI7XG4gIHZhciBjYnMgPSB0aGlzLkRCIC0gYnM7XG4gIHZhciBibSA9ICgxIDw8IGJzKSAtIDE7XG4gIHJbMF0gPSB0aGlzW2RzXSA+PiBicztcbiAgZm9yICh2YXIgaSA9IGRzICsgMTsgaSA8IHRoaXMudDsgKytpKSB7XG4gICAgcltpIC0gZHMgLSAxXSB8PSAodGhpc1tpXSAmIGJtKSA8PCBjYnM7XG4gICAgcltpIC0gZHNdID0gdGhpc1tpXSA+PiBicztcbiAgfVxuICBpZiAoYnMgPiAwKSByW3RoaXMudCAtIGRzIC0gMV0gfD0gKHRoaXMucyAmIGJtKSA8PCBjYnM7XG4gIHIudCA9IHRoaXMudCAtIGRzO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIC0gYVxuZnVuY3Rpb24gYm5wU3ViVG8oYSwgcikge1xuICB2YXIgaSA9IDAsIGMgPSAwLCBtID0gTWF0aC5taW4oYS50LCB0aGlzLnQpO1xuICB3aGlsZSAoaSA8IG0pIHtcbiAgICBjICs9IHRoaXNbaV0gLSBhW2ldO1xuICAgIHJbaSsrXSA9IGMgJiB0aGlzLkRNO1xuICAgIGMgPj49IHRoaXMuREI7XG4gIH1cbiAgaWYgKGEudCA8IHRoaXMudCkge1xuICAgIGMgLT0gYS5zO1xuICAgIHdoaWxlIChpIDwgdGhpcy50KSB7XG4gICAgICBjICs9IHRoaXNbaV07XG4gICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgfVxuICAgIGMgKz0gdGhpcy5zO1xuICB9IGVsc2Uge1xuICAgIGMgKz0gdGhpcy5zO1xuICAgIHdoaWxlIChpIDwgYS50KSB7XG4gICAgICBjIC09IGFbaV07XG4gICAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICAgIGMgPj49IHRoaXMuREI7XG4gICAgfVxuICAgIGMgLT0gYS5zO1xuICB9XG4gIHIucyA9IChjIDwgMCkgPyAtMSA6IDA7XG4gIGlmIChjIDwgLTEpXG4gICAgcltpKytdID0gdGhpcy5EViArIGM7XG4gIGVsc2UgaWYgKGMgPiAwKVxuICAgIHJbaSsrXSA9IGM7XG4gIHIudCA9IGk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgKiBhLCByICE9IHRoaXMsYSAoSEFDIDE0LjEyKVxuLy8gXCJ0aGlzXCIgc2hvdWxkIGJlIHRoZSBsYXJnZXIgb25lIGlmIGFwcHJvcHJpYXRlLlxuZnVuY3Rpb24gYm5wTXVsdGlwbHlUbyhhLCByKSB7XG4gIHZhciB4ID0gdGhpcy5hYnMoKSwgeSA9IGEuYWJzKCk7XG4gIHZhciBpID0geC50O1xuICByLnQgPSBpICsgeS50O1xuICB3aGlsZSAoLS1pID49IDApIHJbaV0gPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgeS50OyArK2kpIHJbaSArIHgudF0gPSB4LmFtKDAsIHlbaV0sIHIsIGksIDAsIHgudCk7XG4gIHIucyA9IDA7XG4gIHIuY2xhbXAoKTtcbiAgaWYgKHRoaXMucyAhPSBhLnMpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhyLCByKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXNeMiwgciAhPSB0aGlzIChIQUMgMTQuMTYpXG5mdW5jdGlvbiBibnBTcXVhcmVUbyhyKSB7XG4gIHZhciB4ID0gdGhpcy5hYnMoKTtcbiAgdmFyIGkgPSByLnQgPSAyICogeC50O1xuICB3aGlsZSAoLS1pID49IDApIHJbaV0gPSAwO1xuICBmb3IgKGkgPSAwOyBpIDwgeC50IC0gMTsgKytpKSB7XG4gICAgdmFyIGMgPSB4LmFtKGksIHhbaV0sIHIsIDIgKiBpLCAwLCAxKTtcbiAgICBpZiAoKHJbaSArIHgudF0gKz0geC5hbShpICsgMSwgMiAqIHhbaV0sIHIsIDIgKiBpICsgMSwgYywgeC50IC0gaSAtIDEpKSA+PVxuICAgICAgICB4LkRWKSB7XG4gICAgICByW2kgKyB4LnRdIC09IHguRFY7XG4gICAgICByW2kgKyB4LnQgKyAxXSA9IDE7XG4gICAgfVxuICB9XG4gIGlmIChyLnQgPiAwKSByW3IudCAtIDFdICs9IHguYW0oaSwgeFtpXSwgciwgMiAqIGksIDAsIDEpO1xuICByLnMgPSAwO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGRpdmlkZSB0aGlzIGJ5IG0sIHF1b3RpZW50IGFuZCByZW1haW5kZXIgdG8gcSwgciAoSEFDIDE0LjIwKVxuLy8gciAhPSBxLCB0aGlzICE9IG0uICBxIG9yIHIgbWF5IGJlIG51bGwuXG5mdW5jdGlvbiBibnBEaXZSZW1UbyhtLCBxLCByKSB7XG4gIHZhciBwbSA9IG0uYWJzKCk7XG4gIGlmIChwbS50IDw9IDApIHJldHVybjtcbiAgdmFyIHB0ID0gdGhpcy5hYnMoKTtcbiAgaWYgKHB0LnQgPCBwbS50KSB7XG4gICAgaWYgKHEgIT0gbnVsbCkgcS5mcm9tSW50KDApO1xuICAgIGlmIChyICE9IG51bGwpIHRoaXMuY29weVRvKHIpO1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAociA9PSBudWxsKSByID0gbmJpKCk7XG4gIHZhciB5ID0gbmJpKCksIHRzID0gdGhpcy5zLCBtcyA9IG0ucztcbiAgdmFyIG5zaCA9IHRoaXMuREIgLSBuYml0cyhwbVtwbS50IC0gMV0pOyAgLy8gbm9ybWFsaXplIG1vZHVsdXNcbiAgaWYgKG5zaCA+IDApIHtcbiAgICBwbS5sU2hpZnRUbyhuc2gsIHkpO1xuICAgIHB0LmxTaGlmdFRvKG5zaCwgcik7XG4gIH0gZWxzZSB7XG4gICAgcG0uY29weVRvKHkpO1xuICAgIHB0LmNvcHlUbyhyKTtcbiAgfVxuICB2YXIgeXMgPSB5LnQ7XG4gIHZhciB5MCA9IHlbeXMgLSAxXTtcbiAgaWYgKHkwID09IDApIHJldHVybjtcbiAgdmFyIHl0ID0geTAgKiAoMSA8PCB0aGlzLkYxKSArICgoeXMgPiAxKSA/IHlbeXMgLSAyXSA+PiB0aGlzLkYyIDogMCk7XG4gIHZhciBkMSA9IHRoaXMuRlYgLyB5dCwgZDIgPSAoMSA8PCB0aGlzLkYxKSAvIHl0LCBlID0gMSA8PCB0aGlzLkYyO1xuICB2YXIgaSA9IHIudCwgaiA9IGkgLSB5cywgdCA9IChxID09IG51bGwpID8gbmJpKCkgOiBxO1xuICB5LmRsU2hpZnRUbyhqLCB0KTtcbiAgaWYgKHIuY29tcGFyZVRvKHQpID49IDApIHtcbiAgICByW3IudCsrXSA9IDE7XG4gICAgci5zdWJUbyh0LCByKTtcbiAgfVxuICBCaWdJbnRlZ2VyLk9ORS5kbFNoaWZ0VG8oeXMsIHQpO1xuICB0LnN1YlRvKHksIHkpOyAgLy8gXCJuZWdhdGl2ZVwiIHkgc28gd2UgY2FuIHJlcGxhY2Ugc3ViIHdpdGggYW0gbGF0ZXJcbiAgd2hpbGUgKHkudCA8IHlzKSB5W3kudCsrXSA9IDA7XG4gIHdoaWxlICgtLWogPj0gMCkge1xuICAgIC8vIEVzdGltYXRlIHF1b3RpZW50IGRpZ2l0XG4gICAgdmFyIHFkID1cbiAgICAgICAgKHJbLS1pXSA9PSB5MCkgPyB0aGlzLkRNIDogTWF0aC5mbG9vcihyW2ldICogZDEgKyAocltpIC0gMV0gKyBlKSAqIGQyKTtcbiAgICBpZiAoKHJbaV0gKz0geS5hbSgwLCBxZCwgciwgaiwgMCwgeXMpKSA8IHFkKSB7ICAvLyBUcnkgaXQgb3V0XG4gICAgICB5LmRsU2hpZnRUbyhqLCB0KTtcbiAgICAgIHIuc3ViVG8odCwgcik7XG4gICAgICB3aGlsZSAocltpXSA8IC0tcWQpIHIuc3ViVG8odCwgcik7XG4gICAgfVxuICB9XG4gIGlmIChxICE9IG51bGwpIHtcbiAgICByLmRyU2hpZnRUbyh5cywgcSk7XG4gICAgaWYgKHRzICE9IG1zKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ocSwgcSk7XG4gIH1cbiAgci50ID0geXM7XG4gIHIuY2xhbXAoKTtcbiAgaWYgKG5zaCA+IDApIHIuclNoaWZ0VG8obnNoLCByKTsgIC8vIERlbm9ybWFsaXplIHJlbWFpbmRlclxuICBpZiAodHMgPCAwKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8ociwgcik7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgbW9kIGFcbmZ1bmN0aW9uIGJuTW9kKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5hYnMoKS5kaXZSZW1UbyhhLCBudWxsLCByKTtcbiAgaWYgKHRoaXMucyA8IDAgJiYgci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKSA+IDApIGEuc3ViVG8ociwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyBNb2R1bGFyIHJlZHVjdGlvbiB1c2luZyBcImNsYXNzaWNcIiBhbGdvcml0aG1cbmZ1bmN0aW9uIENsYXNzaWMobSkge1xuICB0aGlzLm0gPSBtO1xufVxuZnVuY3Rpb24gY0NvbnZlcnQoeCkge1xuICBpZiAoeC5zIDwgMCB8fCB4LmNvbXBhcmVUbyh0aGlzLm0pID49IDApXG4gICAgcmV0dXJuIHgubW9kKHRoaXMubSk7XG4gIGVsc2VcbiAgICByZXR1cm4geDtcbn1cbmZ1bmN0aW9uIGNSZXZlcnQoeCkge1xuICByZXR1cm4geDtcbn1cbmZ1bmN0aW9uIGNSZWR1Y2UoeCkge1xuICB4LmRpdlJlbVRvKHRoaXMubSwgbnVsbCwgeCk7XG59XG5mdW5jdGlvbiBjTXVsVG8oeCwgeSwgcikge1xuICB4Lm11bHRpcGx5VG8oeSwgcik7XG4gIHRoaXMucmVkdWNlKHIpO1xufVxuZnVuY3Rpb24gY1NxclRvKHgsIHIpIHtcbiAgeC5zcXVhcmVUbyhyKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5cbkNsYXNzaWMucHJvdG90eXBlLmNvbnZlcnQgPSBjQ29udmVydDtcbkNsYXNzaWMucHJvdG90eXBlLnJldmVydCA9IGNSZXZlcnQ7XG5DbGFzc2ljLnByb3RvdHlwZS5yZWR1Y2UgPSBjUmVkdWNlO1xuQ2xhc3NpYy5wcm90b3R5cGUubXVsVG8gPSBjTXVsVG87XG5DbGFzc2ljLnByb3RvdHlwZS5zcXJUbyA9IGNTcXJUbztcblxuLy8gKHByb3RlY3RlZCkgcmV0dXJuIFwiLTEvdGhpcyAlIDJeREJcIjsgdXNlZnVsIGZvciBNb250LiByZWR1Y3Rpb25cbi8vIGp1c3RpZmljYXRpb246XG4vLyAgICAgICAgIHh5ID09IDEgKG1vZCBtKVxuLy8gICAgICAgICB4eSA9ICAxK2ttXG4vLyAgIHh5KDIteHkpID0gKDEra20pKDEta20pXG4vLyB4W3koMi14eSldID0gMS1rXjJtXjJcbi8vIHhbeSgyLXh5KV0gPT0gMSAobW9kIG1eMilcbi8vIGlmIHkgaXMgMS94IG1vZCBtLCB0aGVuIHkoMi14eSkgaXMgMS94IG1vZCBtXjJcbi8vIHNob3VsZCByZWR1Y2UgeCBhbmQgeSgyLXh5KSBieSBtXjIgYXQgZWFjaCBzdGVwIHRvIGtlZXAgc2l6ZSBib3VuZGVkLlxuLy8gSlMgbXVsdGlwbHkgXCJvdmVyZmxvd3NcIiBkaWZmZXJlbnRseSBmcm9tIEMvQysrLCBzbyBjYXJlIGlzIG5lZWRlZCBoZXJlLlxuZnVuY3Rpb24gYm5wSW52RGlnaXQoKSB7XG4gIGlmICh0aGlzLnQgPCAxKSByZXR1cm4gMDtcbiAgdmFyIHggPSB0aGlzWzBdO1xuICBpZiAoKHggJiAxKSA9PSAwKSByZXR1cm4gMDtcbiAgdmFyIHkgPSB4ICYgMzsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8geSA9PSAxL3ggbW9kIDJeMlxuICB5ID0gKHkgKiAoMiAtICh4ICYgMHhmKSAqIHkpKSAmIDB4ZjsgICAgICAgICAgICAgICAgICAgICAvLyB5ID09IDEveCBtb2QgMl40XG4gIHkgPSAoeSAqICgyIC0gKHggJiAweGZmKSAqIHkpKSAmIDB4ZmY7ICAgICAgICAgICAgICAgICAgIC8vIHkgPT0gMS94IG1vZCAyXjhcbiAgeSA9ICh5ICogKDIgLSAoKCh4ICYgMHhmZmZmKSAqIHkpICYgMHhmZmZmKSkpICYgMHhmZmZmOyAgLy8geSA9PSAxL3ggbW9kIDJeMTZcbiAgLy8gbGFzdCBzdGVwIC0gY2FsY3VsYXRlIGludmVyc2UgbW9kIERWIGRpcmVjdGx5O1xuICAvLyBhc3N1bWVzIDE2IDwgREIgPD0gMzIgYW5kIGFzc3VtZXMgYWJpbGl0eSB0byBoYW5kbGUgNDgtYml0IGludHNcbiAgeSA9ICh5ICogKDIgLSB4ICogeSAlIHRoaXMuRFYpKSAlIHRoaXMuRFY7ICAvLyB5ID09IDEveCBtb2QgMl5kYml0c1xuICAvLyB3ZSByZWFsbHkgd2FudCB0aGUgbmVnYXRpdmUgaW52ZXJzZSwgYW5kIC1EViA8IHkgPCBEVlxuICByZXR1cm4gKHkgPiAwKSA/IHRoaXMuRFYgLSB5IDogLXk7XG59XG5cbi8vIE1vbnRnb21lcnkgcmVkdWN0aW9uXG5mdW5jdGlvbiBNb250Z29tZXJ5KG0pIHtcbiAgdGhpcy5tID0gbTtcbiAgdGhpcy5tcCA9IG0uaW52RGlnaXQoKTtcbiAgdGhpcy5tcGwgPSB0aGlzLm1wICYgMHg3ZmZmO1xuICB0aGlzLm1waCA9IHRoaXMubXAgPj4gMTU7XG4gIHRoaXMudW0gPSAoMSA8PCAobS5EQiAtIDE1KSkgLSAxO1xuICB0aGlzLm10MiA9IDIgKiBtLnQ7XG59XG5cbi8vIHhSIG1vZCBtXG5mdW5jdGlvbiBtb250Q29udmVydCh4KSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHguYWJzKCkuZGxTaGlmdFRvKHRoaXMubS50LCByKTtcbiAgci5kaXZSZW1Ubyh0aGlzLm0sIG51bGwsIHIpO1xuICBpZiAoeC5zIDwgMCAmJiByLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLlpFUk8pID4gMCkgdGhpcy5tLnN1YlRvKHIsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8geC9SIG1vZCBtXG5mdW5jdGlvbiBtb250UmV2ZXJ0KHgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgeC5jb3B5VG8ocik7XG4gIHRoaXMucmVkdWNlKHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8geCA9IHgvUiBtb2QgbSAoSEFDIDE0LjMyKVxuZnVuY3Rpb24gbW9udFJlZHVjZSh4KSB7XG4gIHdoaWxlICh4LnQgPD0gdGhpcy5tdDIpICAvLyBwYWQgeCBzbyBhbSBoYXMgZW5vdWdoIHJvb20gbGF0ZXJcbiAgICB4W3gudCsrXSA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5tLnQ7ICsraSkge1xuICAgIC8vIGZhc3RlciB3YXkgb2YgY2FsY3VsYXRpbmcgdTAgPSB4W2ldKm1wIG1vZCBEVlxuICAgIHZhciBqID0geFtpXSAmIDB4N2ZmZjtcbiAgICB2YXIgdTAgPSAoaiAqIHRoaXMubXBsICtcbiAgICAgICAgICAgICAgKCgoaiAqIHRoaXMubXBoICsgKHhbaV0gPj4gMTUpICogdGhpcy5tcGwpICYgdGhpcy51bSkgPDwgMTUpKSAmXG4gICAgICAgIHguRE07XG4gICAgLy8gdXNlIGFtIHRvIGNvbWJpbmUgdGhlIG11bHRpcGx5LXNoaWZ0LWFkZCBpbnRvIG9uZSBjYWxsXG4gICAgaiA9IGkgKyB0aGlzLm0udDtcbiAgICB4W2pdICs9IHRoaXMubS5hbSgwLCB1MCwgeCwgaSwgMCwgdGhpcy5tLnQpO1xuICAgIC8vIHByb3BhZ2F0ZSBjYXJyeVxuICAgIHdoaWxlICh4W2pdID49IHguRFYpIHtcbiAgICAgIHhbal0gLT0geC5EVjtcbiAgICAgIHhbKytqXSsrO1xuICAgIH1cbiAgfVxuICB4LmNsYW1wKCk7XG4gIHguZHJTaGlmdFRvKHRoaXMubS50LCB4KTtcbiAgaWYgKHguY29tcGFyZVRvKHRoaXMubSkgPj0gMCkgeC5zdWJUbyh0aGlzLm0sIHgpO1xufVxuXG4vLyByID0gXCJ4XjIvUiBtb2QgbVwiOyB4ICE9IHJcbmZ1bmN0aW9uIG1vbnRTcXJUbyh4LCByKSB7XG4gIHguc3F1YXJlVG8ocik7XG4gIHRoaXMucmVkdWNlKHIpO1xufVxuXG4vLyByID0gXCJ4eS9SIG1vZCBtXCI7IHgseSAhPSByXG5mdW5jdGlvbiBtb250TXVsVG8oeCwgeSwgcikge1xuICB4Lm11bHRpcGx5VG8oeSwgcik7XG4gIHRoaXMucmVkdWNlKHIpO1xufVxuXG5Nb250Z29tZXJ5LnByb3RvdHlwZS5jb252ZXJ0ID0gbW9udENvbnZlcnQ7XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5yZXZlcnQgPSBtb250UmV2ZXJ0O1xuTW9udGdvbWVyeS5wcm90b3R5cGUucmVkdWNlID0gbW9udFJlZHVjZTtcbk1vbnRnb21lcnkucHJvdG90eXBlLm11bFRvID0gbW9udE11bFRvO1xuTW9udGdvbWVyeS5wcm90b3R5cGUuc3FyVG8gPSBtb250U3FyVG87XG5cbi8vIChwcm90ZWN0ZWQpIHRydWUgaWZmIHRoaXMgaXMgZXZlblxuZnVuY3Rpb24gYm5wSXNFdmVuKCkge1xuICByZXR1cm4gKCh0aGlzLnQgPiAwKSA/ICh0aGlzWzBdICYgMSkgOiB0aGlzLnMpID09IDA7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXNeZSwgZSA8IDJeMzIsIGRvaW5nIHNxciBhbmQgbXVsIHdpdGggXCJyXCIgKEhBQyAxNC43OSlcbmZ1bmN0aW9uIGJucEV4cChlLCB6KSB7XG4gIGlmIChlID4gMHhmZmZmZmZmZiB8fCBlIDwgMSkgcmV0dXJuIEJpZ0ludGVnZXIuT05FO1xuICB2YXIgciA9IG5iaSgpLCByMiA9IG5iaSgpLCBnID0gei5jb252ZXJ0KHRoaXMpLCBpID0gbmJpdHMoZSkgLSAxO1xuICBnLmNvcHlUbyhyKTtcbiAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgei5zcXJUbyhyLCByMik7XG4gICAgaWYgKChlICYgKDEgPDwgaSkpID4gMClcbiAgICAgIHoubXVsVG8ocjIsIGcsIHIpO1xuICAgIGVsc2Uge1xuICAgICAgdmFyIHQgPSByO1xuICAgICAgciA9IHIyO1xuICAgICAgcjIgPSB0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gei5yZXZlcnQocik7XG59XG5cbi8vIChwdWJsaWMpIHRoaXNeZSAlIG0sIDAgPD0gZSA8IDJeMzJcbmZ1bmN0aW9uIGJuTW9kUG93SW50KGUsIG0pIHtcbiAgdmFyIHo7XG4gIGlmIChlIDwgMjU2IHx8IG0uaXNFdmVuKCkpXG4gICAgeiA9IG5ldyBDbGFzc2ljKG0pO1xuICBlbHNlXG4gICAgeiA9IG5ldyBNb250Z29tZXJ5KG0pO1xuICByZXR1cm4gdGhpcy5leHAoZSwgeik7XG59XG5cbi8vIHByb3RlY3RlZFxuQmlnSW50ZWdlci5wcm90b3R5cGUuY29weVRvID0gYm5wQ29weVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZnJvbUludCA9IGJucEZyb21JbnQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tU3RyaW5nID0gYm5wRnJvbVN0cmluZztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNsYW1wID0gYm5wQ2xhbXA7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kbFNoaWZ0VG8gPSBibnBETFNoaWZ0VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kclNoaWZ0VG8gPSBibnBEUlNoaWZ0VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5sU2hpZnRUbyA9IGJucExTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuclNoaWZ0VG8gPSBibnBSU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLnN1YlRvID0gYm5wU3ViVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseVRvID0gYm5wTXVsdGlwbHlUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNxdWFyZVRvID0gYm5wU3F1YXJlVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZSZW1UbyA9IGJucERpdlJlbVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaW52RGlnaXQgPSBibnBJbnZEaWdpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmlzRXZlbiA9IGJucElzRXZlbjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmV4cCA9IGJucEV4cDtcblxuLy8gcHVibGljXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50b1N0cmluZyA9IGJuVG9TdHJpbmc7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5uZWdhdGUgPSBibk5lZ2F0ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFicyA9IGJuQWJzO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY29tcGFyZVRvID0gYm5Db21wYXJlVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRMZW5ndGggPSBibkJpdExlbmd0aDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZCA9IGJuTW9kO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93SW50ID0gYm5Nb2RQb3dJbnQ7XG5cbi8vIFwiY29uc3RhbnRzXCJcbkJpZ0ludGVnZXIuWkVSTyA9IG5idigwKTtcbkJpZ0ludGVnZXIuT05FID0gbmJ2KDEpO1xuXG4vLyBQb29sIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQgYW5kIGdyZWF0ZXIgdGhhbiAzMi5cbi8vIEFuIGFycmF5IG9mIGJ5dGVzIHRoZSBzaXplIG9mIHRoZSBwb29sIHdpbGwgYmUgcGFzc2VkIHRvIGluaXQoKVxudmFyIHJuZ19wc2l6ZSA9IDI1NjtcblxuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGVmYXVsdDogQmlnSW50ZWdlcixcbiAgICBCaWdJbnRlZ2VyOiBCaWdJbnRlZ2VyLFxuICB9O1xufSBlbHNlIHtcbiAgdGhpcy5qc2JuID0ge1xuICAgIEJpZ0ludGVnZXI6IEJpZ0ludGVnZXIsXG4gIH07XG59XG5cbi8vIENvcHlyaWdodCAoYykgMjAwNS0yMDA5ICBUb20gV3Vcbi8vIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4vLyBTZWUgXCJMSUNFTlNFXCIgZm9yIGRldGFpbHMuXG5cbi8vIEV4dGVuZGVkIEphdmFTY3JpcHQgQk4gZnVuY3Rpb25zLCByZXF1aXJlZCBmb3IgUlNBIHByaXZhdGUgb3BzLlxuXG4vLyBWZXJzaW9uIDEuMTogbmV3IEJpZ0ludGVnZXIoXCIwXCIsIDEwKSByZXR1cm5zIFwicHJvcGVyXCIgemVyb1xuLy8gVmVyc2lvbiAxLjI6IHNxdWFyZSgpIEFQSSwgaXNQcm9iYWJsZVByaW1lIGZpeFxuXG4vLyAocHVibGljKVxuZnVuY3Rpb24gYm5DbG9uZSgpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5jb3B5VG8ocik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgaW50ZWdlclxuZnVuY3Rpb24gYm5JbnRWYWx1ZSgpIHtcbiAgaWYgKHRoaXMucyA8IDApIHtcbiAgICBpZiAodGhpcy50ID09IDEpXG4gICAgICByZXR1cm4gdGhpc1swXSAtIHRoaXMuRFY7XG4gICAgZWxzZSBpZiAodGhpcy50ID09IDApXG4gICAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAodGhpcy50ID09IDEpXG4gICAgcmV0dXJuIHRoaXNbMF07XG4gIGVsc2UgaWYgKHRoaXMudCA9PSAwKVxuICAgIHJldHVybiAwO1xuICAvLyBhc3N1bWVzIDE2IDwgREIgPCAzMlxuICByZXR1cm4gKCh0aGlzWzFdICYgKCgxIDw8ICgzMiAtIHRoaXMuREIpKSAtIDEpKSA8PCB0aGlzLkRCKSB8IHRoaXNbMF07XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiB2YWx1ZSBhcyBieXRlXG5mdW5jdGlvbiBibkJ5dGVWYWx1ZSgpIHtcbiAgcmV0dXJuICh0aGlzLnQgPT0gMCkgPyB0aGlzLnMgOiAodGhpc1swXSA8PCAyNCkgPj4gMjQ7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiB2YWx1ZSBhcyBzaG9ydCAoYXNzdW1lcyBEQj49MTYpXG5mdW5jdGlvbiBiblNob3J0VmFsdWUoKSB7XG4gIHJldHVybiAodGhpcy50ID09IDApID8gdGhpcy5zIDogKHRoaXNbMF0gPDwgMTYpID4+IDE2O1xufVxuXG4vLyAocHJvdGVjdGVkKSByZXR1cm4geCBzLnQuIHJeeCA8IERWXG5mdW5jdGlvbiBibnBDaHVua1NpemUocikge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLkxOMiAqIHRoaXMuREIgLyBNYXRoLmxvZyhyKSk7XG59XG5cbi8vIChwdWJsaWMpIDAgaWYgdGhpcyA9PSAwLCAxIGlmIHRoaXMgPiAwXG5mdW5jdGlvbiBiblNpZ051bSgpIHtcbiAgaWYgKHRoaXMucyA8IDApXG4gICAgcmV0dXJuIC0xO1xuICBlbHNlIGlmICh0aGlzLnQgPD0gMCB8fCAodGhpcy50ID09IDEgJiYgdGhpc1swXSA8PSAwKSlcbiAgICByZXR1cm4gMDtcbiAgZWxzZVxuICAgIHJldHVybiAxO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjb252ZXJ0IHRvIHJhZGl4IHN0cmluZ1xuZnVuY3Rpb24gYm5wVG9SYWRpeChiKSB7XG4gIGlmIChiID09IG51bGwpIGIgPSAxMDtcbiAgaWYgKHRoaXMuc2lnbnVtKCkgPT0gMCB8fCBiIDwgMiB8fCBiID4gMzYpIHJldHVybiAnMCc7XG4gIHZhciBjcyA9IHRoaXMuY2h1bmtTaXplKGIpO1xuICB2YXIgYSA9IE1hdGgucG93KGIsIGNzKTtcbiAgdmFyIGQgPSBuYnYoYSksIHkgPSBuYmkoKSwgeiA9IG5iaSgpLCByID0gJyc7XG4gIHRoaXMuZGl2UmVtVG8oZCwgeSwgeik7XG4gIHdoaWxlICh5LnNpZ251bSgpID4gMCkge1xuICAgIHIgPSAoYSArIHouaW50VmFsdWUoKSkudG9TdHJpbmcoYikuc3Vic3RyKDEpICsgcjtcbiAgICB5LmRpdlJlbVRvKGQsIHksIHopO1xuICB9XG4gIHJldHVybiB6LmludFZhbHVlKCkudG9TdHJpbmcoYikgKyByO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjb252ZXJ0IGZyb20gcmFkaXggc3RyaW5nXG5mdW5jdGlvbiBibnBGcm9tUmFkaXgocywgYikge1xuICB0aGlzLmZyb21JbnQoMCk7XG4gIGlmIChiID09IG51bGwpIGIgPSAxMDtcbiAgdmFyIGNzID0gdGhpcy5jaHVua1NpemUoYik7XG4gIHZhciBkID0gTWF0aC5wb3coYiwgY3MpLCBtaSA9IGZhbHNlLCBqID0gMCwgdyA9IDA7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7ICsraSkge1xuICAgIHZhciB4ID0gaW50QXQocywgaSk7XG4gICAgaWYgKHggPCAwKSB7XG4gICAgICBpZiAocy5jaGFyQXQoaSkgPT0gJy0nICYmIHRoaXMuc2lnbnVtKCkgPT0gMCkgbWkgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHcgPSBiICogdyArIHg7XG4gICAgaWYgKCsraiA+PSBjcykge1xuICAgICAgdGhpcy5kTXVsdGlwbHkoZCk7XG4gICAgICB0aGlzLmRBZGRPZmZzZXQodywgMCk7XG4gICAgICBqID0gMDtcbiAgICAgIHcgPSAwO1xuICAgIH1cbiAgfVxuICBpZiAoaiA+IDApIHtcbiAgICB0aGlzLmRNdWx0aXBseShNYXRoLnBvdyhiLCBqKSk7XG4gICAgdGhpcy5kQWRkT2Zmc2V0KHcsIDApO1xuICB9XG4gIGlmIChtaSkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsIHRoaXMpO1xufVxuXG4vLyAocHJvdGVjdGVkKSBhbHRlcm5hdGUgY29uc3RydWN0b3JcbmZ1bmN0aW9uIGJucEZyb21OdW1iZXIoYSwgYiwgYykge1xuICBpZiAoJ251bWJlcicgPT0gdHlwZW9mIGIpIHtcbiAgICAvLyBuZXcgQmlnSW50ZWdlcihpbnQsaW50LFJORylcbiAgICBpZiAoYSA8IDIpXG4gICAgICB0aGlzLmZyb21JbnQoMSk7XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmZyb21OdW1iZXIoYSwgYyk7XG4gICAgICBpZiAoIXRoaXMudGVzdEJpdChhIC0gMSkpICAvLyBmb3JjZSBNU0Igc2V0XG4gICAgICAgIHRoaXMuYml0d2lzZVRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhIC0gMSksIG9wX29yLCB0aGlzKTtcbiAgICAgIGlmICh0aGlzLmlzRXZlbigpKSB0aGlzLmRBZGRPZmZzZXQoMSwgMCk7ICAvLyBmb3JjZSBvZGRcbiAgICAgIHdoaWxlICghdGhpcy5pc1Byb2JhYmxlUHJpbWUoYikpIHtcbiAgICAgICAgdGhpcy5kQWRkT2Zmc2V0KDIsIDApO1xuICAgICAgICBpZiAodGhpcy5iaXRMZW5ndGgoKSA+IGEpXG4gICAgICAgICAgdGhpcy5zdWJUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYSAtIDEpLCB0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gbmV3IEJpZ0ludGVnZXIoaW50LFJORylcbiAgICB2YXIgeCA9IG5ldyBBcnJheSgpLCB0ID0gYSAmIDc7XG4gICAgeC5sZW5ndGggPSAoYSA+PiAzKSArIDE7XG4gICAgYi5uZXh0Qnl0ZXMoeCk7XG4gICAgaWYgKHQgPiAwKVxuICAgICAgeFswXSAmPSAoKDEgPDwgdCkgLSAxKTtcbiAgICBlbHNlXG4gICAgICB4WzBdID0gMDtcbiAgICB0aGlzLmZyb21TdHJpbmcoeCwgMjU2KTtcbiAgfVxufVxuXG4vLyAocHVibGljKSBjb252ZXJ0IHRvIGJpZ2VuZGlhbiBieXRlIGFycmF5XG5mdW5jdGlvbiBiblRvQnl0ZUFycmF5KCkge1xuICB2YXIgaSA9IHRoaXMudCwgciA9IG5ldyBBcnJheSgpO1xuICByWzBdID0gdGhpcy5zO1xuICB2YXIgcCA9IHRoaXMuREIgLSAoaSAqIHRoaXMuREIpICUgOCwgZCwgayA9IDA7XG4gIGlmIChpLS0gPiAwKSB7XG4gICAgaWYgKHAgPCB0aGlzLkRCICYmIChkID0gdGhpc1tpXSA+PiBwKSAhPSAodGhpcy5zICYgdGhpcy5ETSkgPj4gcClcbiAgICAgIHJbaysrXSA9IGQgfCAodGhpcy5zIDw8ICh0aGlzLkRCIC0gcCkpO1xuICAgIHdoaWxlIChpID49IDApIHtcbiAgICAgIGlmIChwIDwgOCkge1xuICAgICAgICBkID0gKHRoaXNbaV0gJiAoKDEgPDwgcCkgLSAxKSkgPDwgKDggLSBwKTtcbiAgICAgICAgZCB8PSB0aGlzWy0taV0gPj4gKHAgKz0gdGhpcy5EQiAtIDgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZCA9ICh0aGlzW2ldID4+IChwIC09IDgpKSAmIDB4ZmY7XG4gICAgICAgIGlmIChwIDw9IDApIHtcbiAgICAgICAgICBwICs9IHRoaXMuREI7XG4gICAgICAgICAgLS1pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoKGQgJiAweDgwKSAhPSAwKSBkIHw9IC0yNTY7XG4gICAgICBpZiAoayA9PSAwICYmICh0aGlzLnMgJiAweDgwKSAhPSAoZCAmIDB4ODApKSArK2s7XG4gICAgICBpZiAoayA+IDAgfHwgZCAhPSB0aGlzLnMpIHJbaysrXSA9IGQ7XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufVxuXG5mdW5jdGlvbiBibkVxdWFscyhhKSB7XG4gIHJldHVybiAodGhpcy5jb21wYXJlVG8oYSkgPT0gMCk7XG59XG5mdW5jdGlvbiBibk1pbihhKSB7XG4gIHJldHVybiAodGhpcy5jb21wYXJlVG8oYSkgPCAwKSA/IHRoaXMgOiBhO1xufVxuZnVuY3Rpb24gYm5NYXgoYSkge1xuICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpID4gMCkgPyB0aGlzIDogYTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgb3AgYSAoYml0d2lzZSlcbmZ1bmN0aW9uIGJucEJpdHdpc2VUbyhhLCBvcCwgcikge1xuICB2YXIgaSwgZiwgbSA9IE1hdGgubWluKGEudCwgdGhpcy50KTtcbiAgZm9yIChpID0gMDsgaSA8IG07ICsraSkgcltpXSA9IG9wKHRoaXNbaV0sIGFbaV0pO1xuICBpZiAoYS50IDwgdGhpcy50KSB7XG4gICAgZiA9IGEucyAmIHRoaXMuRE07XG4gICAgZm9yIChpID0gbTsgaSA8IHRoaXMudDsgKytpKSByW2ldID0gb3AodGhpc1tpXSwgZik7XG4gICAgci50ID0gdGhpcy50O1xuICB9IGVsc2Uge1xuICAgIGYgPSB0aGlzLnMgJiB0aGlzLkRNO1xuICAgIGZvciAoaSA9IG07IGkgPCBhLnQ7ICsraSkgcltpXSA9IG9wKGYsIGFbaV0pO1xuICAgIHIudCA9IGEudDtcbiAgfVxuICByLnMgPSBvcCh0aGlzLnMsIGEucyk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAmIGFcbmZ1bmN0aW9uIG9wX2FuZCh4LCB5KSB7XG4gIHJldHVybiB4ICYgeTtcbn1cbmZ1bmN0aW9uIGJuQW5kKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3BfYW5kLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgfCBhXG5mdW5jdGlvbiBvcF9vcih4LCB5KSB7XG4gIHJldHVybiB4IHwgeTtcbn1cbmZ1bmN0aW9uIGJuT3IoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmJpdHdpc2VUbyhhLCBvcF9vciwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzIF4gYVxuZnVuY3Rpb24gb3BfeG9yKHgsIHkpIHtcbiAgcmV0dXJuIHggXiB5O1xufVxuZnVuY3Rpb24gYm5Yb3IoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmJpdHdpc2VUbyhhLCBvcF94b3IsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAmIH5hXG5mdW5jdGlvbiBvcF9hbmRub3QoeCwgeSkge1xuICByZXR1cm4geCAmIH55O1xufVxuZnVuY3Rpb24gYm5BbmROb3QoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmJpdHdpc2VUbyhhLCBvcF9hbmRub3QsIHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgfnRoaXNcbmZ1bmN0aW9uIGJuTm90KCkge1xuICB2YXIgciA9IG5iaSgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudDsgKytpKSByW2ldID0gdGhpcy5ETSAmIH50aGlzW2ldO1xuICByLnQgPSB0aGlzLnQ7XG4gIHIucyA9IH50aGlzLnM7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzIDw8IG5cbmZ1bmN0aW9uIGJuU2hpZnRMZWZ0KG4pIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgaWYgKG4gPCAwKVxuICAgIHRoaXMuclNoaWZ0VG8oLW4sIHIpO1xuICBlbHNlXG4gICAgdGhpcy5sU2hpZnRUbyhuLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgPj4gblxuZnVuY3Rpb24gYm5TaGlmdFJpZ2h0KG4pIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgaWYgKG4gPCAwKVxuICAgIHRoaXMubFNoaWZ0VG8oLW4sIHIpO1xuICBlbHNlXG4gICAgdGhpcy5yU2hpZnRUbyhuLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIHJldHVybiBpbmRleCBvZiBsb3dlc3QgMS1iaXQgaW4geCwgeCA8IDJeMzFcbmZ1bmN0aW9uIGxiaXQoeCkge1xuICBpZiAoeCA9PSAwKSByZXR1cm4gLTE7XG4gIHZhciByID0gMDtcbiAgaWYgKCh4ICYgMHhmZmZmKSA9PSAwKSB7XG4gICAgeCA+Pj0gMTY7XG4gICAgciArPSAxNjtcbiAgfVxuICBpZiAoKHggJiAweGZmKSA9PSAwKSB7XG4gICAgeCA+Pj0gODtcbiAgICByICs9IDg7XG4gIH1cbiAgaWYgKCh4ICYgMHhmKSA9PSAwKSB7XG4gICAgeCA+Pj0gNDtcbiAgICByICs9IDQ7XG4gIH1cbiAgaWYgKCh4ICYgMykgPT0gMCkge1xuICAgIHggPj49IDI7XG4gICAgciArPSAyO1xuICB9XG4gIGlmICgoeCAmIDEpID09IDApICsrcjtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybnMgaW5kZXggb2YgbG93ZXN0IDEtYml0IChvciAtMSBpZiBub25lKVxuZnVuY3Rpb24gYm5HZXRMb3dlc3RTZXRCaXQoKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpXG4gICAgaWYgKHRoaXNbaV0gIT0gMCkgcmV0dXJuIGkgKiB0aGlzLkRCICsgbGJpdCh0aGlzW2ldKTtcbiAgaWYgKHRoaXMucyA8IDApIHJldHVybiB0aGlzLnQgKiB0aGlzLkRCO1xuICByZXR1cm4gLTE7XG59XG5cbi8vIHJldHVybiBudW1iZXIgb2YgMSBiaXRzIGluIHhcbmZ1bmN0aW9uIGNiaXQoeCkge1xuICB2YXIgciA9IDA7XG4gIHdoaWxlICh4ICE9IDApIHtcbiAgICB4ICY9IHggLSAxO1xuICAgICsrcjtcbiAgfVxuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIG51bWJlciBvZiBzZXQgYml0c1xuZnVuY3Rpb24gYm5CaXRDb3VudCgpIHtcbiAgdmFyIHIgPSAwLCB4ID0gdGhpcy5zICYgdGhpcy5ETTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnQ7ICsraSkgciArPSBjYml0KHRoaXNbaV0gXiB4KTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRydWUgaWZmIG50aCBiaXQgaXMgc2V0XG5mdW5jdGlvbiBiblRlc3RCaXQobikge1xuICB2YXIgaiA9IE1hdGguZmxvb3IobiAvIHRoaXMuREIpO1xuICBpZiAoaiA+PSB0aGlzLnQpIHJldHVybiAodGhpcy5zICE9IDApO1xuICByZXR1cm4gKCh0aGlzW2pdICYgKDEgPDwgKG4gJSB0aGlzLkRCKSkpICE9IDApO1xufVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzIG9wICgxPDxuKVxuZnVuY3Rpb24gYm5wQ2hhbmdlQml0KG4sIG9wKSB7XG4gIHZhciByID0gQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KG4pO1xuICB0aGlzLmJpdHdpc2VUbyhyLCBvcCwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzIHwgKDE8PG4pXG5mdW5jdGlvbiBiblNldEJpdChuKSB7XG4gIHJldHVybiB0aGlzLmNoYW5nZUJpdChuLCBvcF9vcik7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgJiB+KDE8PG4pXG5mdW5jdGlvbiBibkNsZWFyQml0KG4pIHtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sIG9wX2FuZG5vdCk7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgXiAoMTw8bilcbmZ1bmN0aW9uIGJuRmxpcEJpdChuKSB7XG4gIHJldHVybiB0aGlzLmNoYW5nZUJpdChuLCBvcF94b3IpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyArIGFcbmZ1bmN0aW9uIGJucEFkZFRvKGEsIHIpIHtcbiAgdmFyIGkgPSAwLCBjID0gMCwgbSA9IE1hdGgubWluKGEudCwgdGhpcy50KTtcbiAgd2hpbGUgKGkgPCBtKSB7XG4gICAgYyArPSB0aGlzW2ldICsgYVtpXTtcbiAgICByW2krK10gPSBjICYgdGhpcy5ETTtcbiAgICBjID4+PSB0aGlzLkRCO1xuICB9XG4gIGlmIChhLnQgPCB0aGlzLnQpIHtcbiAgICBjICs9IGEucztcbiAgICB3aGlsZSAoaSA8IHRoaXMudCkge1xuICAgICAgYyArPSB0aGlzW2ldO1xuICAgICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjICs9IHRoaXMucztcbiAgfSBlbHNlIHtcbiAgICBjICs9IHRoaXMucztcbiAgICB3aGlsZSAoaSA8IGEudCkge1xuICAgICAgYyArPSBhW2ldO1xuICAgICAgcltpKytdID0gYyAmIHRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjICs9IGEucztcbiAgfVxuICByLnMgPSAoYyA8IDApID8gLTEgOiAwO1xuICBpZiAoYyA+IDApXG4gICAgcltpKytdID0gYztcbiAgZWxzZSBpZiAoYyA8IC0xKVxuICAgIHJbaSsrXSA9IHRoaXMuRFYgKyBjO1xuICByLnQgPSBpO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgKyBhXG5mdW5jdGlvbiBibkFkZChhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuYWRkVG8oYSwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzIC0gYVxuZnVuY3Rpb24gYm5TdWJ0cmFjdChhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuc3ViVG8oYSwgcik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzICogYVxuZnVuY3Rpb24gYm5NdWx0aXBseShhKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMubXVsdGlwbHlUbyhhLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXNeMlxuZnVuY3Rpb24gYm5TcXVhcmUoKSB7XG4gIHZhciByID0gbmJpKCk7XG4gIHRoaXMuc3F1YXJlVG8ocik7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzIC8gYVxuZnVuY3Rpb24gYm5EaXZpZGUoYSkge1xuICB2YXIgciA9IG5iaSgpO1xuICB0aGlzLmRpdlJlbVRvKGEsIHIsIG51bGwpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyAlIGFcbmZ1bmN0aW9uIGJuUmVtYWluZGVyKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5kaXZSZW1UbyhhLCBudWxsLCByKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIFt0aGlzL2EsdGhpcyVhXVxuZnVuY3Rpb24gYm5EaXZpZGVBbmRSZW1haW5kZXIoYSkge1xuICB2YXIgcSA9IG5iaSgpLCByID0gbmJpKCk7XG4gIHRoaXMuZGl2UmVtVG8oYSwgcSwgcik7XG4gIHJldHVybiBuZXcgQXJyYXkocSwgcik7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgKj0gbiwgdGhpcyA+PSAwLCAxIDwgbiA8IERWXG5mdW5jdGlvbiBibnBETXVsdGlwbHkobikge1xuICB0aGlzW3RoaXMudF0gPSB0aGlzLmFtKDAsIG4gLSAxLCB0aGlzLCAwLCAwLCB0aGlzLnQpO1xuICArK3RoaXMudDtcbiAgdGhpcy5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzICs9IG4gPDwgdyB3b3JkcywgdGhpcyA+PSAwXG5mdW5jdGlvbiBibnBEQWRkT2Zmc2V0KG4sIHcpIHtcbiAgaWYgKG4gPT0gMCkgcmV0dXJuO1xuICB3aGlsZSAodGhpcy50IDw9IHcpIHRoaXNbdGhpcy50KytdID0gMDtcbiAgdGhpc1t3XSArPSBuO1xuICB3aGlsZSAodGhpc1t3XSA+PSB0aGlzLkRWKSB7XG4gICAgdGhpc1t3XSAtPSB0aGlzLkRWO1xuICAgIGlmICgrK3cgPj0gdGhpcy50KSB0aGlzW3RoaXMudCsrXSA9IDA7XG4gICAgKyt0aGlzW3ddO1xuICB9XG59XG5cbi8vIEEgXCJudWxsXCIgcmVkdWNlclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5mdW5jdGlvbiBOdWxsRXhwKCkge31cbmZ1bmN0aW9uIG5Ob3AoeCkge1xuICByZXR1cm4geDtcbn1cbmZ1bmN0aW9uIG5NdWxUbyh4LCB5LCByKSB7XG4gIHgubXVsdGlwbHlUbyh5LCByKTtcbn1cbmZ1bmN0aW9uIG5TcXJUbyh4LCByKSB7XG4gIHguc3F1YXJlVG8ocik7XG59XG5cbk51bGxFeHAucHJvdG90eXBlLmNvbnZlcnQgPSBuTm9wO1xuTnVsbEV4cC5wcm90b3R5cGUucmV2ZXJ0ID0gbk5vcDtcbk51bGxFeHAucHJvdG90eXBlLm11bFRvID0gbk11bFRvO1xuTnVsbEV4cC5wcm90b3R5cGUuc3FyVG8gPSBuU3FyVG87XG5cbi8vIChwdWJsaWMpIHRoaXNeZVxuZnVuY3Rpb24gYm5Qb3coZSkge1xuICByZXR1cm4gdGhpcy5leHAoZSwgbmV3IE51bGxFeHAoKSk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSBsb3dlciBuIHdvcmRzIG9mIFwidGhpcyAqIGFcIiwgYS50IDw9IG5cbi8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbmZ1bmN0aW9uIGJucE11bHRpcGx5TG93ZXJUbyhhLCBuLCByKSB7XG4gIHZhciBpID0gTWF0aC5taW4odGhpcy50ICsgYS50LCBuKTtcbiAgci5zID0gMDsgIC8vIGFzc3VtZXMgYSx0aGlzID49IDBcbiAgci50ID0gaTtcbiAgd2hpbGUgKGkgPiAwKSByWy0taV0gPSAwO1xuICB2YXIgajtcbiAgZm9yIChqID0gci50IC0gdGhpcy50OyBpIDwgajsgKytpKVxuICAgIHJbaSArIHRoaXMudF0gPSB0aGlzLmFtKDAsIGFbaV0sIHIsIGksIDAsIHRoaXMudCk7XG4gIGZvciAoaiA9IE1hdGgubWluKGEudCwgbik7IGkgPCBqOyArK2kpIHRoaXMuYW0oMCwgYVtpXSwgciwgaSwgMCwgbiAtIGkpO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSBcInRoaXMgKiBhXCIgd2l0aG91dCBsb3dlciBuIHdvcmRzLCBuID4gMFxuLy8gXCJ0aGlzXCIgc2hvdWxkIGJlIHRoZSBsYXJnZXIgb25lIGlmIGFwcHJvcHJpYXRlLlxuZnVuY3Rpb24gYm5wTXVsdGlwbHlVcHBlclRvKGEsIG4sIHIpIHtcbiAgLS1uO1xuICB2YXIgaSA9IHIudCA9IHRoaXMudCArIGEudCAtIG47XG4gIHIucyA9IDA7ICAvLyBhc3N1bWVzIGEsdGhpcyA+PSAwXG4gIHdoaWxlICgtLWkgPj0gMCkgcltpXSA9IDA7XG4gIGZvciAoaSA9IE1hdGgubWF4KG4gLSB0aGlzLnQsIDApOyBpIDwgYS50OyArK2kpXG4gICAgclt0aGlzLnQgKyBpIC0gbl0gPSB0aGlzLmFtKG4gLSBpLCBhW2ldLCByLCAwLCAwLCB0aGlzLnQgKyBpIC0gbik7XG4gIHIuY2xhbXAoKTtcbiAgci5kclNoaWZ0VG8oMSwgcik7XG59XG5cbi8vIEJhcnJldHQgbW9kdWxhciByZWR1Y3Rpb25cbmZ1bmN0aW9uIEJhcnJldHQobSkge1xuICAvLyBzZXR1cCBCYXJyZXR0XG4gIHRoaXMucjIgPSBuYmkoKTtcbiAgdGhpcy5xMyA9IG5iaSgpO1xuICBCaWdJbnRlZ2VyLk9ORS5kbFNoaWZ0VG8oMiAqIG0udCwgdGhpcy5yMik7XG4gIHRoaXMubXUgPSB0aGlzLnIyLmRpdmlkZShtKTtcbiAgdGhpcy5tID0gbTtcbn1cblxuZnVuY3Rpb24gYmFycmV0dENvbnZlcnQoeCkge1xuICBpZiAoeC5zIDwgMCB8fCB4LnQgPiAyICogdGhpcy5tLnQpXG4gICAgcmV0dXJuIHgubW9kKHRoaXMubSk7XG4gIGVsc2UgaWYgKHguY29tcGFyZVRvKHRoaXMubSkgPCAwKVxuICAgIHJldHVybiB4O1xuICBlbHNlIHtcbiAgICB2YXIgciA9IG5iaSgpO1xuICAgIHguY29weVRvKHIpO1xuICAgIHRoaXMucmVkdWNlKHIpO1xuICAgIHJldHVybiByO1xuICB9XG59XG5cbmZ1bmN0aW9uIGJhcnJldHRSZXZlcnQoeCkge1xuICByZXR1cm4geDtcbn1cblxuLy8geCA9IHggbW9kIG0gKEhBQyAxNC40MilcbmZ1bmN0aW9uIGJhcnJldHRSZWR1Y2UoeCkge1xuICB4LmRyU2hpZnRUbyh0aGlzLm0udCAtIDEsIHRoaXMucjIpO1xuICBpZiAoeC50ID4gdGhpcy5tLnQgKyAxKSB7XG4gICAgeC50ID0gdGhpcy5tLnQgKyAxO1xuICAgIHguY2xhbXAoKTtcbiAgfVxuICB0aGlzLm11Lm11bHRpcGx5VXBwZXJUbyh0aGlzLnIyLCB0aGlzLm0udCArIDEsIHRoaXMucTMpO1xuICB0aGlzLm0ubXVsdGlwbHlMb3dlclRvKHRoaXMucTMsIHRoaXMubS50ICsgMSwgdGhpcy5yMik7XG4gIHdoaWxlICh4LmNvbXBhcmVUbyh0aGlzLnIyKSA8IDApIHguZEFkZE9mZnNldCgxLCB0aGlzLm0udCArIDEpO1xuICB4LnN1YlRvKHRoaXMucjIsIHgpO1xuICB3aGlsZSAoeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB4LnN1YlRvKHRoaXMubSwgeCk7XG59XG5cbi8vIHIgPSB4XjIgbW9kIG07IHggIT0gclxuZnVuY3Rpb24gYmFycmV0dFNxclRvKHgsIHIpIHtcbiAgeC5zcXVhcmVUbyhyKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG59XG5cbi8vIHIgPSB4KnkgbW9kIG07IHgseSAhPSByXG5mdW5jdGlvbiBiYXJyZXR0TXVsVG8oeCwgeSwgcikge1xuICB4Lm11bHRpcGx5VG8oeSwgcik7XG4gIHRoaXMucmVkdWNlKHIpO1xufVxuXG5CYXJyZXR0LnByb3RvdHlwZS5jb252ZXJ0ID0gYmFycmV0dENvbnZlcnQ7XG5CYXJyZXR0LnByb3RvdHlwZS5yZXZlcnQgPSBiYXJyZXR0UmV2ZXJ0O1xuQmFycmV0dC5wcm90b3R5cGUucmVkdWNlID0gYmFycmV0dFJlZHVjZTtcbkJhcnJldHQucHJvdG90eXBlLm11bFRvID0gYmFycmV0dE11bFRvO1xuQmFycmV0dC5wcm90b3R5cGUuc3FyVG8gPSBiYXJyZXR0U3FyVG87XG5cbi8vIChwdWJsaWMpIHRoaXNeZSAlIG0gKEhBQyAxNC44NSlcbmZ1bmN0aW9uIGJuTW9kUG93KGUsIG0pIHtcbiAgdmFyIGkgPSBlLmJpdExlbmd0aCgpLCBrLCByID0gbmJ2KDEpLCB6O1xuICBpZiAoaSA8PSAwKVxuICAgIHJldHVybiByO1xuICBlbHNlIGlmIChpIDwgMTgpXG4gICAgayA9IDE7XG4gIGVsc2UgaWYgKGkgPCA0OClcbiAgICBrID0gMztcbiAgZWxzZSBpZiAoaSA8IDE0NClcbiAgICBrID0gNDtcbiAgZWxzZSBpZiAoaSA8IDc2OClcbiAgICBrID0gNTtcbiAgZWxzZVxuICAgIGsgPSA2O1xuICBpZiAoaSA8IDgpXG4gICAgeiA9IG5ldyBDbGFzc2ljKG0pO1xuICBlbHNlIGlmIChtLmlzRXZlbigpKVxuICAgIHogPSBuZXcgQmFycmV0dChtKTtcbiAgZWxzZVxuICAgIHogPSBuZXcgTW9udGdvbWVyeShtKTtcblxuICAvLyBwcmVjb21wdXRhdGlvblxuICB2YXIgZyA9IG5ldyBBcnJheSgpLCBuID0gMywgazEgPSBrIC0gMSwga20gPSAoMSA8PCBrKSAtIDE7XG4gIGdbMV0gPSB6LmNvbnZlcnQodGhpcyk7XG4gIGlmIChrID4gMSkge1xuICAgIHZhciBnMiA9IG5iaSgpO1xuICAgIHouc3FyVG8oZ1sxXSwgZzIpO1xuICAgIHdoaWxlIChuIDw9IGttKSB7XG4gICAgICBnW25dID0gbmJpKCk7XG4gICAgICB6Lm11bFRvKGcyLCBnW24gLSAyXSwgZ1tuXSk7XG4gICAgICBuICs9IDI7XG4gICAgfVxuICB9XG5cbiAgdmFyIGogPSBlLnQgLSAxLCB3LCBpczEgPSB0cnVlLCByMiA9IG5iaSgpLCB0O1xuICBpID0gbmJpdHMoZVtqXSkgLSAxO1xuICB3aGlsZSAoaiA+PSAwKSB7XG4gICAgaWYgKGkgPj0gazEpXG4gICAgICB3ID0gKGVbal0gPj4gKGkgLSBrMSkpICYga207XG4gICAgZWxzZSB7XG4gICAgICB3ID0gKGVbal0gJiAoKDEgPDwgKGkgKyAxKSkgLSAxKSkgPDwgKGsxIC0gaSk7XG4gICAgICBpZiAoaiA+IDApIHcgfD0gZVtqIC0gMV0gPj4gKHRoaXMuREIgKyBpIC0gazEpO1xuICAgIH1cblxuICAgIG4gPSBrO1xuICAgIHdoaWxlICgodyAmIDEpID09IDApIHtcbiAgICAgIHcgPj49IDE7XG4gICAgICAtLW47XG4gICAgfVxuICAgIGlmICgoaSAtPSBuKSA8IDApIHtcbiAgICAgIGkgKz0gdGhpcy5EQjtcbiAgICAgIC0tajtcbiAgICB9XG4gICAgaWYgKGlzMSkgeyAgLy8gcmV0ID09IDEsIGRvbid0IGJvdGhlciBzcXVhcmluZyBvciBtdWx0aXBseWluZyBpdFxuICAgICAgZ1t3XS5jb3B5VG8ocik7XG4gICAgICBpczEgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKG4gPiAxKSB7XG4gICAgICAgIHouc3FyVG8ociwgcjIpO1xuICAgICAgICB6LnNxclRvKHIyLCByKTtcbiAgICAgICAgbiAtPSAyO1xuICAgICAgfVxuICAgICAgaWYgKG4gPiAwKVxuICAgICAgICB6LnNxclRvKHIsIHIyKTtcbiAgICAgIGVsc2Uge1xuICAgICAgICB0ID0gcjtcbiAgICAgICAgciA9IHIyO1xuICAgICAgICByMiA9IHQ7XG4gICAgICB9XG4gICAgICB6Lm11bFRvKHIyLCBnW3ddLCByKTtcbiAgICB9XG5cbiAgICB3aGlsZSAoaiA+PSAwICYmIChlW2pdICYgKDEgPDwgaSkpID09IDApIHtcbiAgICAgIHouc3FyVG8ociwgcjIpO1xuICAgICAgdCA9IHI7XG4gICAgICByID0gcjI7XG4gICAgICByMiA9IHQ7XG4gICAgICBpZiAoLS1pIDwgMCkge1xuICAgICAgICBpID0gdGhpcy5EQiAtIDE7XG4gICAgICAgIC0tajtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHoucmV2ZXJ0KHIpO1xufVxuXG4vLyAocHVibGljKSBnY2QodGhpcyxhKSAoSEFDIDE0LjU0KVxuZnVuY3Rpb24gYm5HQ0QoYSkge1xuICB2YXIgeCA9ICh0aGlzLnMgPCAwKSA/IHRoaXMubmVnYXRlKCkgOiB0aGlzLmNsb25lKCk7XG4gIHZhciB5ID0gKGEucyA8IDApID8gYS5uZWdhdGUoKSA6IGEuY2xvbmUoKTtcbiAgaWYgKHguY29tcGFyZVRvKHkpIDwgMCkge1xuICAgIHZhciB0ID0geDtcbiAgICB4ID0geTtcbiAgICB5ID0gdDtcbiAgfVxuICB2YXIgaSA9IHguZ2V0TG93ZXN0U2V0Qml0KCksIGcgPSB5LmdldExvd2VzdFNldEJpdCgpO1xuICBpZiAoZyA8IDApIHJldHVybiB4O1xuICBpZiAoaSA8IGcpIGcgPSBpO1xuICBpZiAoZyA+IDApIHtcbiAgICB4LnJTaGlmdFRvKGcsIHgpO1xuICAgIHkuclNoaWZ0VG8oZywgeSk7XG4gIH1cbiAgd2hpbGUgKHguc2lnbnVtKCkgPiAwKSB7XG4gICAgaWYgKChpID0geC5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB4LnJTaGlmdFRvKGksIHgpO1xuICAgIGlmICgoaSA9IHkuZ2V0TG93ZXN0U2V0Qml0KCkpID4gMCkgeS5yU2hpZnRUbyhpLCB5KTtcbiAgICBpZiAoeC5jb21wYXJlVG8oeSkgPj0gMCkge1xuICAgICAgeC5zdWJUbyh5LCB4KTtcbiAgICAgIHguclNoaWZ0VG8oMSwgeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHkuc3ViVG8oeCwgeSk7XG4gICAgICB5LnJTaGlmdFRvKDEsIHkpO1xuICAgIH1cbiAgfVxuICBpZiAoZyA+IDApIHkubFNoaWZ0VG8oZywgeSk7XG4gIHJldHVybiB5O1xufVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzICUgbiwgbiA8IDJeMjZcbmZ1bmN0aW9uIGJucE1vZEludChuKSB7XG4gIGlmIChuIDw9IDApIHJldHVybiAwO1xuICB2YXIgZCA9IHRoaXMuRFYgJSBuLCByID0gKHRoaXMucyA8IDApID8gbiAtIDEgOiAwO1xuICBpZiAodGhpcy50ID4gMClcbiAgICBpZiAoZCA9PSAwKVxuICAgICAgciA9IHRoaXNbMF0gJSBuO1xuICAgIGVsc2VcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnQgLSAxOyBpID49IDA7IC0taSkgciA9IChkICogciArIHRoaXNbaV0pICUgbjtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIDEvdGhpcyAlIG0gKEhBQyAxNC42MSlcbmZ1bmN0aW9uIGJuTW9kSW52ZXJzZShtKSB7XG4gIHZhciBhYyA9IG0uaXNFdmVuKCk7XG4gIGlmICgodGhpcy5pc0V2ZW4oKSAmJiBhYykgfHwgbS5zaWdudW0oKSA9PSAwKSByZXR1cm4gQmlnSW50ZWdlci5aRVJPO1xuICB2YXIgdSA9IG0uY2xvbmUoKSwgdiA9IHRoaXMuY2xvbmUoKTtcbiAgdmFyIGEgPSBuYnYoMSksIGIgPSBuYnYoMCksIGMgPSBuYnYoMCksIGQgPSBuYnYoMSk7XG4gIHdoaWxlICh1LnNpZ251bSgpICE9IDApIHtcbiAgICB3aGlsZSAodS5pc0V2ZW4oKSkge1xuICAgICAgdS5yU2hpZnRUbygxLCB1KTtcbiAgICAgIGlmIChhYykge1xuICAgICAgICBpZiAoIWEuaXNFdmVuKCkgfHwgIWIuaXNFdmVuKCkpIHtcbiAgICAgICAgICBhLmFkZFRvKHRoaXMsIGEpO1xuICAgICAgICAgIGIuc3ViVG8obSwgYik7XG4gICAgICAgIH1cbiAgICAgICAgYS5yU2hpZnRUbygxLCBhKTtcbiAgICAgIH0gZWxzZSBpZiAoIWIuaXNFdmVuKCkpXG4gICAgICAgIGIuc3ViVG8obSwgYik7XG4gICAgICBiLnJTaGlmdFRvKDEsIGIpO1xuICAgIH1cbiAgICB3aGlsZSAodi5pc0V2ZW4oKSkge1xuICAgICAgdi5yU2hpZnRUbygxLCB2KTtcbiAgICAgIGlmIChhYykge1xuICAgICAgICBpZiAoIWMuaXNFdmVuKCkgfHwgIWQuaXNFdmVuKCkpIHtcbiAgICAgICAgICBjLmFkZFRvKHRoaXMsIGMpO1xuICAgICAgICAgIGQuc3ViVG8obSwgZCk7XG4gICAgICAgIH1cbiAgICAgICAgYy5yU2hpZnRUbygxLCBjKTtcbiAgICAgIH0gZWxzZSBpZiAoIWQuaXNFdmVuKCkpXG4gICAgICAgIGQuc3ViVG8obSwgZCk7XG4gICAgICBkLnJTaGlmdFRvKDEsIGQpO1xuICAgIH1cbiAgICBpZiAodS5jb21wYXJlVG8odikgPj0gMCkge1xuICAgICAgdS5zdWJUbyh2LCB1KTtcbiAgICAgIGlmIChhYykgYS5zdWJUbyhjLCBhKTtcbiAgICAgIGIuc3ViVG8oZCwgYik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHYuc3ViVG8odSwgdik7XG4gICAgICBpZiAoYWMpIGMuc3ViVG8oYSwgYyk7XG4gICAgICBkLnN1YlRvKGIsIGQpO1xuICAgIH1cbiAgfVxuICBpZiAodi5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpICE9IDApIHJldHVybiBCaWdJbnRlZ2VyLlpFUk87XG4gIGlmIChkLmNvbXBhcmVUbyhtKSA+PSAwKSByZXR1cm4gZC5zdWJ0cmFjdChtKTtcbiAgaWYgKGQuc2lnbnVtKCkgPCAwKVxuICAgIGQuYWRkVG8obSwgZCk7XG4gIGVsc2VcbiAgICByZXR1cm4gZDtcbiAgaWYgKGQuc2lnbnVtKCkgPCAwKVxuICAgIHJldHVybiBkLmFkZChtKTtcbiAgZWxzZVxuICAgIHJldHVybiBkO1xufVxuXG52YXIgbG93cHJpbWVzID0gW1xuICAyLCAgIDMsICAgNSwgICA3LCAgIDExLCAgMTMsICAxNywgIDE5LCAgMjMsICAyOSwgIDMxLCAgMzcsICA0MSwgIDQzLFxuICA0NywgIDUzLCAgNTksICA2MSwgIDY3LCAgNzEsICA3MywgIDc5LCAgODMsICA4OSwgIDk3LCAgMTAxLCAxMDMsIDEwNyxcbiAgMTA5LCAxMTMsIDEyNywgMTMxLCAxMzcsIDEzOSwgMTQ5LCAxNTEsIDE1NywgMTYzLCAxNjcsIDE3MywgMTc5LCAxODEsXG4gIDE5MSwgMTkzLCAxOTcsIDE5OSwgMjExLCAyMjMsIDIyNywgMjI5LCAyMzMsIDIzOSwgMjQxLCAyNTEsIDI1NywgMjYzLFxuICAyNjksIDI3MSwgMjc3LCAyODEsIDI4MywgMjkzLCAzMDcsIDMxMSwgMzEzLCAzMTcsIDMzMSwgMzM3LCAzNDcsIDM0OSxcbiAgMzUzLCAzNTksIDM2NywgMzczLCAzNzksIDM4MywgMzg5LCAzOTcsIDQwMSwgNDA5LCA0MTksIDQyMSwgNDMxLCA0MzMsXG4gIDQzOSwgNDQzLCA0NDksIDQ1NywgNDYxLCA0NjMsIDQ2NywgNDc5LCA0ODcsIDQ5MSwgNDk5LCA1MDMsIDUwOSwgNTIxLFxuICA1MjMsIDU0MSwgNTQ3LCA1NTcsIDU2MywgNTY5LCA1NzEsIDU3NywgNTg3LCA1OTMsIDU5OSwgNjAxLCA2MDcsIDYxMyxcbiAgNjE3LCA2MTksIDYzMSwgNjQxLCA2NDMsIDY0NywgNjUzLCA2NTksIDY2MSwgNjczLCA2NzcsIDY4MywgNjkxLCA3MDEsXG4gIDcwOSwgNzE5LCA3MjcsIDczMywgNzM5LCA3NDMsIDc1MSwgNzU3LCA3NjEsIDc2OSwgNzczLCA3ODcsIDc5NywgODA5LFxuICA4MTEsIDgyMSwgODIzLCA4MjcsIDgyOSwgODM5LCA4NTMsIDg1NywgODU5LCA4NjMsIDg3NywgODgxLCA4ODMsIDg4NyxcbiAgOTA3LCA5MTEsIDkxOSwgOTI5LCA5MzcsIDk0MSwgOTQ3LCA5NTMsIDk2NywgOTcxLCA5NzcsIDk4MywgOTkxLCA5OTdcbl07XG52YXIgbHBsaW0gPSAoMSA8PCAyNikgLyBsb3dwcmltZXNbbG93cHJpbWVzLmxlbmd0aCAtIDFdO1xuXG4vLyAocHVibGljKSB0ZXN0IHByaW1hbGl0eSB3aXRoIGNlcnRhaW50eSA+PSAxLS41XnRcbmZ1bmN0aW9uIGJuSXNQcm9iYWJsZVByaW1lKHQpIHtcbiAgdmFyIGksIHggPSB0aGlzLmFicygpO1xuICBpZiAoeC50ID09IDEgJiYgeFswXSA8PSBsb3dwcmltZXNbbG93cHJpbWVzLmxlbmd0aCAtIDFdKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxvd3ByaW1lcy5sZW5ndGg7ICsraSlcbiAgICAgIGlmICh4WzBdID09IGxvd3ByaW1lc1tpXSkgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh4LmlzRXZlbigpKSByZXR1cm4gZmFsc2U7XG4gIGkgPSAxO1xuICB3aGlsZSAoaSA8IGxvd3ByaW1lcy5sZW5ndGgpIHtcbiAgICB2YXIgbSA9IGxvd3ByaW1lc1tpXSwgaiA9IGkgKyAxO1xuICAgIHdoaWxlIChqIDwgbG93cHJpbWVzLmxlbmd0aCAmJiBtIDwgbHBsaW0pIG0gKj0gbG93cHJpbWVzW2orK107XG4gICAgbSA9IHgubW9kSW50KG0pO1xuICAgIHdoaWxlIChpIDwgailcbiAgICAgIGlmIChtICUgbG93cHJpbWVzW2krK10gPT0gMCkgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB4Lm1pbGxlclJhYmluKHQpO1xufVxuXG4vLyAocHJvdGVjdGVkKSB0cnVlIGlmIHByb2JhYmx5IHByaW1lIChIQUMgNC4yNCwgTWlsbGVyLVJhYmluKVxuZnVuY3Rpb24gYm5wTWlsbGVyUmFiaW4odCkge1xuICB2YXIgbjEgPSB0aGlzLnN1YnRyYWN0KEJpZ0ludGVnZXIuT05FKTtcbiAgdmFyIGsgPSBuMS5nZXRMb3dlc3RTZXRCaXQoKTtcbiAgaWYgKGsgPD0gMCkgcmV0dXJuIGZhbHNlO1xuICB2YXIgciA9IG4xLnNoaWZ0UmlnaHQoayk7XG4gIHQgPSAodCArIDEpID4+IDE7XG4gIGlmICh0ID4gbG93cHJpbWVzLmxlbmd0aCkgdCA9IGxvd3ByaW1lcy5sZW5ndGg7XG4gIHZhciBhID0gbmJpKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdDsgKytpKSB7XG4gICAgLy8gUGljayBiYXNlcyBhdCByYW5kb20sIGluc3RlYWQgb2Ygc3RhcnRpbmcgYXQgMlxuICAgIGEuZnJvbUludChsb3dwcmltZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbG93cHJpbWVzLmxlbmd0aCldKTtcbiAgICB2YXIgeSA9IGEubW9kUG93KHIsIHRoaXMpO1xuICAgIGlmICh5LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgIT0gMCAmJiB5LmNvbXBhcmVUbyhuMSkgIT0gMCkge1xuICAgICAgdmFyIGogPSAxO1xuICAgICAgd2hpbGUgKGorKyA8IGsgJiYgeS5jb21wYXJlVG8objEpICE9IDApIHtcbiAgICAgICAgeSA9IHkubW9kUG93SW50KDIsIHRoaXMpO1xuICAgICAgICBpZiAoeS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpID09IDApIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh5LmNvbXBhcmVUbyhuMSkgIT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gcHJvdGVjdGVkXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jaHVua1NpemUgPSBibnBDaHVua1NpemU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50b1JhZGl4ID0gYm5wVG9SYWRpeDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21SYWRpeCA9IGJucEZyb21SYWRpeDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21OdW1iZXIgPSBibnBGcm9tTnVtYmVyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYml0d2lzZVRvID0gYm5wQml0d2lzZVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2hhbmdlQml0ID0gYm5wQ2hhbmdlQml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYWRkVG8gPSBibnBBZGRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRNdWx0aXBseSA9IGJucERNdWx0aXBseTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRBZGRPZmZzZXQgPSBibnBEQWRkT2Zmc2V0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlMb3dlclRvID0gYm5wTXVsdGlwbHlMb3dlclRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHlVcHBlclRvID0gYm5wTXVsdGlwbHlVcHBlclRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kSW50ID0gYm5wTW9kSW50O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubWlsbGVyUmFiaW4gPSBibnBNaWxsZXJSYWJpbjtcblxuLy8gcHVibGljXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jbG9uZSA9IGJuQ2xvbmU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnRWYWx1ZSA9IGJuSW50VmFsdWU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5ieXRlVmFsdWUgPSBibkJ5dGVWYWx1ZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNob3J0VmFsdWUgPSBiblNob3J0VmFsdWU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaWdudW0gPSBiblNpZ051bTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRvQnl0ZUFycmF5ID0gYm5Ub0J5dGVBcnJheTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmVxdWFscyA9IGJuRXF1YWxzO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubWluID0gYm5NaW47XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tYXggPSBibk1heDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFuZCA9IGJuQW5kO1xuQmlnSW50ZWdlci5wcm90b3R5cGUub3IgPSBibk9yO1xuQmlnSW50ZWdlci5wcm90b3R5cGUueG9yID0gYm5Yb3I7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmROb3QgPSBibkFuZE5vdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm5vdCA9IGJuTm90O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRMZWZ0ID0gYm5TaGlmdExlZnQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaGlmdFJpZ2h0ID0gYm5TaGlmdFJpZ2h0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZ2V0TG93ZXN0U2V0Qml0ID0gYm5HZXRMb3dlc3RTZXRCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5iaXRDb3VudCA9IGJuQml0Q291bnQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50ZXN0Qml0ID0gYm5UZXN0Qml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2V0Qml0ID0gYm5TZXRCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jbGVhckJpdCA9IGJuQ2xlYXJCaXQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mbGlwQml0ID0gYm5GbGlwQml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYWRkID0gYm5BZGQ7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGJuU3VidHJhY3Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tdWx0aXBseSA9IGJuTXVsdGlwbHk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kaXZpZGUgPSBibkRpdmlkZTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnJlbWFpbmRlciA9IGJuUmVtYWluZGVyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2aWRlQW5kUmVtYWluZGVyID0gYm5EaXZpZGVBbmRSZW1haW5kZXI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3cgPSBibk1vZFBvdztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludmVyc2UgPSBibk1vZEludmVyc2U7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5wb3cgPSBiblBvdztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmdjZCA9IGJuR0NEO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaXNQcm9iYWJsZVByaW1lID0gYm5Jc1Byb2JhYmxlUHJpbWU7XG5cbi8vIEpTQk4tc3BlY2lmaWMgZXh0ZW5zaW9uXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zcXVhcmUgPSBiblNxdWFyZTtcblxuLy8gQmlnSW50ZWdlciBpbnRlcmZhY2VzIG5vdCBpbXBsZW1lbnRlZCBpbiBqc2JuOlxuXG4vLyBCaWdJbnRlZ2VyKGludCBzaWdudW0sIGJ5dGVbXSBtYWduaXR1ZGUpXG4vLyBkb3VibGUgZG91YmxlVmFsdWUoKVxuLy8gZmxvYXQgZmxvYXRWYWx1ZSgpXG4vLyBpbnQgaGFzaENvZGUoKVxuLy8gbG9uZyBsb25nVmFsdWUoKVxuLy8gc3RhdGljIEJpZ0ludGVnZXIgdmFsdWVPZihsb25nIHZhbClcblxuLy8gRGVwZW5kcyBvbiBqc2JuLmpzIGFuZCBybmcuanNcblxuLy8gVmVyc2lvbiAxLjE6IHN1cHBvcnQgdXRmLTggZW5jb2RpbmcgaW4gcGtjczFwYWQyXG5cbi8vIGNvbnZlcnQgYSAoaGV4KSBzdHJpbmcgdG8gYSBiaWdudW0gb2JqZWN0XG5mdW5jdGlvbiBwYXJzZUJpZ0ludChzdHIsIHIpIHtcbiAgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKHN0ciwgcik7XG59XG5cbmZ1bmN0aW9uIGxpbmVicmsocywgbikge1xuICB2YXIgcmV0ID0gJyc7XG4gIHZhciBpID0gMDtcbiAgd2hpbGUgKGkgKyBuIDwgcy5sZW5ndGgpIHtcbiAgICByZXQgKz0gcy5zdWJzdHJpbmcoaSwgaSArIG4pICsgJ1xcbic7XG4gICAgaSArPSBuO1xuICB9XG4gIHJldHVybiByZXQgKyBzLnN1YnN0cmluZyhpLCBzLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIGJ5dGUySGV4KGIpIHtcbiAgaWYgKGIgPCAweDEwKVxuICAgIHJldHVybiAnMCcgKyBiLnRvU3RyaW5nKDE2KTtcbiAgZWxzZVxuICAgIHJldHVybiBiLnRvU3RyaW5nKDE2KTtcbn1cblxuLy8gUEtDUyMxICh0eXBlIDIsIHJhbmRvbSkgcGFkIGlucHV0IHN0cmluZyBzIHRvIG4gYnl0ZXMsIGFuZCByZXR1cm4gYSBiaWdpbnRcbmZ1bmN0aW9uIHBrY3MxcGFkMihzLCBuKSB7XG4gIGlmIChuIDwgcy5sZW5ndGggKyAxMSkgeyAgLy8gVE9ETzogZml4IGZvciB1dGYtOFxuICAgIGFsZXJ0KCdNZXNzYWdlIHRvbyBsb25nIGZvciBSU0EnKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2YXIgYmEgPSBuZXcgQXJyYXkoKTtcbiAgdmFyIGkgPSBzLmxlbmd0aCAtIDE7XG4gIHdoaWxlIChpID49IDAgJiYgbiA+IDApIHtcbiAgICB2YXIgYyA9IHMuY2hhckNvZGVBdChpLS0pO1xuICAgIGlmIChjIDwgMTI4KSB7ICAvLyBlbmNvZGUgdXNpbmcgdXRmLThcbiAgICAgIGJhWy0tbl0gPSBjO1xuICAgIH0gZWxzZSBpZiAoKGMgPiAxMjcpICYmIChjIDwgMjA0OCkpIHtcbiAgICAgIGJhWy0tbl0gPSAoYyAmIDYzKSB8IDEyODtcbiAgICAgIGJhWy0tbl0gPSAoYyA+PiA2KSB8IDE5MjtcbiAgICB9IGVsc2Uge1xuICAgICAgYmFbLS1uXSA9IChjICYgNjMpIHwgMTI4O1xuICAgICAgYmFbLS1uXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcbiAgICAgIGJhWy0tbl0gPSAoYyA+PiAxMikgfCAyMjQ7XG4gICAgfVxuICB9XG4gIGJhWy0tbl0gPSAwO1xuICB2YXIgcm5nID0gbmV3IFNlY3VyZVJhbmRvbSgpO1xuICB2YXIgeCA9IG5ldyBBcnJheSgpO1xuICB3aGlsZSAobiA+IDIpIHsgIC8vIHJhbmRvbSBub24temVybyBwYWRcbiAgICB4WzBdID0gMDtcbiAgICB3aGlsZSAoeFswXSA9PSAwKSBybmcubmV4dEJ5dGVzKHgpO1xuICAgIGJhWy0tbl0gPSB4WzBdO1xuICB9XG4gIGJhWy0tbl0gPSAyO1xuICBiYVstLW5dID0gMDtcbiAgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKGJhKTtcbn1cblxuLy8gXCJlbXB0eVwiIFJTQSBrZXkgY29uc3RydWN0b3JcbmZ1bmN0aW9uIFJTQUtleSgpIHtcbiAgdGhpcy5uID0gbnVsbDtcbiAgdGhpcy5lID0gMDtcbiAgdGhpcy5kID0gbnVsbDtcbiAgdGhpcy5wID0gbnVsbDtcbiAgdGhpcy5xID0gbnVsbDtcbiAgdGhpcy5kbXAxID0gbnVsbDtcbiAgdGhpcy5kbXExID0gbnVsbDtcbiAgdGhpcy5jb2VmZiA9IG51bGw7XG59XG5cbi8vIFNldCB0aGUgcHVibGljIGtleSBmaWVsZHMgTiBhbmQgZSBmcm9tIGhleCBzdHJpbmdzXG5mdW5jdGlvbiBSU0FTZXRQdWJsaWMoTiwgRSkge1xuICBpZiAoTiAhPSBudWxsICYmIEUgIT0gbnVsbCAmJiBOLmxlbmd0aCA+IDAgJiYgRS5sZW5ndGggPiAwKSB7XG4gICAgdGhpcy5uID0gcGFyc2VCaWdJbnQoTiwgMTYpO1xuICAgIHRoaXMuZSA9IHBhcnNlSW50KEUsIDE2KTtcbiAgfSBlbHNlXG4gICAgYWxlcnQoJ0ludmFsaWQgUlNBIHB1YmxpYyBrZXknKTtcbn1cblxuLy8gU2V0IHRoZSBwcml2YXRlIGtleSBmaWVsZHMgTiwgZSwgZCBhbmQgQ1JUIHBhcmFtcyBmcm9tIGhleCBzdHJpbmdzXG5mdW5jdGlvbiBSU0FTZXRQcml2YXRlRXgoTixFLEQsUCxRLERQLERRLEMpIHtcbiAgICBpZihOICE9IG51bGwgJiYgRSAhPSBudWxsICYmIE4ubGVuZ3RoID4gMCAmJiBFLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMubiA9IHBhcnNlQmlnSW50KE4sMTYpO1xuICAgICAgdGhpcy5lID0gcGFyc2VJbnQoRSwxNik7XG4gICAgICB0aGlzLmQgPSBwYXJzZUJpZ0ludChELDE2KTtcbiAgICAgIHRoaXMucCA9IHBhcnNlQmlnSW50KFAsMTYpO1xuICAgICAgdGhpcy5xID0gcGFyc2VCaWdJbnQoUSwxNik7XG4gICAgICB0aGlzLmRtcDEgPSBwYXJzZUJpZ0ludChEUCwxNik7XG4gICAgICB0aGlzLmRtcTEgPSBwYXJzZUJpZ0ludChEUSwxNik7XG4gICAgICB0aGlzLmNvZWZmID0gcGFyc2VCaWdJbnQoQywxNik7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgIGFsZXJ0KFwiSW52YWxpZCBSU0EgcHJpdmF0ZSBrZXlcIik7XG4gIH1cblxuLy8gUGVyZm9ybSByYXcgcHJpdmF0ZSBvcGVyYXRpb24gb24gXCJ4XCI6IHJldHVybiB4XmQgKG1vZCBuKVxuZnVuY3Rpb24gUlNBRG9Qcml2YXRlKHgpIHtcbiAgaWYodGhpcy5wID09IG51bGwgfHwgdGhpcy5xID09IG51bGwpXG4gICAgcmV0dXJuIHgubW9kUG93KHRoaXMuZCwgdGhpcy5uKTtcblxuICAvLyBUT0RPOiByZS1jYWxjdWxhdGUgYW55IG1pc3NpbmcgQ1JUIHBhcmFtc1xuICB2YXIgeHAgPSB4Lm1vZCh0aGlzLnApLm1vZFBvdyh0aGlzLmRtcDEsIHRoaXMucCk7XG4gIHZhciB4cSA9IHgubW9kKHRoaXMucSkubW9kUG93KHRoaXMuZG1xMSwgdGhpcy5xKTtcblxuICB3aGlsZSh4cC5jb21wYXJlVG8oeHEpIDwgMClcbiAgICB4cCA9IHhwLmFkZCh0aGlzLnApO1xuICByZXR1cm4geHAuc3VidHJhY3QoeHEpLm11bHRpcGx5KHRoaXMuY29lZmYpLm1vZCh0aGlzLnApLm11bHRpcGx5KHRoaXMucSkuYWRkKHhxKTtcbn1cblxuLy8gUGVyZm9ybSByYXcgcHVibGljIG9wZXJhdGlvbiBvbiBcInhcIjogcmV0dXJuIHheZSAobW9kIG4pXG5mdW5jdGlvbiBSU0FEb1B1YmxpYyh4KSB7XG4gIHJldHVybiB4Lm1vZFBvd0ludCh0aGlzLmUsIHRoaXMubik7XG59XG5cbi8vIFJldHVybiB0aGUgUEtDUyMxIFJTQSBlbmNyeXB0aW9uIG9mIFwidGV4dFwiIGFzIGFuIGV2ZW4tbGVuZ3RoIGhleCBzdHJpbmdcbmZ1bmN0aW9uIFJTQUVuY3J5cHQodGV4dCkge1xuICB2YXIgbSA9IHBrY3MxcGFkMih0ZXh0LCAodGhpcy5uLmJpdExlbmd0aCgpICsgNykgPj4gMyk7XG4gIGlmIChtID09IG51bGwpIHJldHVybiBudWxsO1xuICB2YXIgYyA9IHRoaXMuZG9QdWJsaWMobSk7XG4gIGlmIChjID09IG51bGwpIHJldHVybiBudWxsO1xuICB2YXIgaCA9IGMudG9TdHJpbmcoMTYpO1xuICBpZiAoKGgubGVuZ3RoICYgMSkgPT0gMClcbiAgICByZXR1cm4gaDtcbiAgZWxzZVxuICAgIHJldHVybiAnMCcgKyBoO1xufVxuXG4vLyBSZXR1cm4gdGhlIFBLQ1MjMSBSU0EgZW5jcnlwdGlvbiBvZiBcInRleHRcIiBhcyBhIEJhc2U2NC1lbmNvZGVkIHN0cmluZ1xuLy8gZnVuY3Rpb24gUlNBRW5jcnlwdEI2NCh0ZXh0KSB7XG4vLyAgdmFyIGggPSB0aGlzLmVuY3J5cHQodGV4dCk7XG4vLyAgaWYoaCkgcmV0dXJuIGhleDJiNjQoaCk7IGVsc2UgcmV0dXJuIG51bGw7XG4vL31cblxuLy8gcHJvdGVjdGVkXG5SU0FLZXkucHJvdG90eXBlLmRvUHVibGljID0gUlNBRG9QdWJsaWM7XG5cbi8vIHB1YmxpY1xuUlNBS2V5LnByb3RvdHlwZS5kb1ByaXZhdGUgPSBSU0FEb1ByaXZhdGU7XG5SU0FLZXkucHJvdG90eXBlLnNldFB1YmxpYyA9IFJTQVNldFB1YmxpYztcblJTQUtleS5wcm90b3R5cGUuc2V0UHJpdmF0ZUV4ID0gUlNBU2V0UHJpdmF0ZUV4O1xuUlNBS2V5LnByb3RvdHlwZS5lbmNyeXB0ID0gUlNBRW5jcnlwdDtcbi8vIFJTQUtleS5wcm90b3R5cGUuZW5jcnlwdF9iNjQgPSBSU0FFbmNyeXB0QjY0O1xuXG4vLyBSYW5kb20gbnVtYmVyIGdlbmVyYXRvciAtIHJlcXVpcmVzIGEgUFJORyBiYWNrZW5kLCBlLmcuIHBybmc0LmpzXG5cbi8vIEZvciBiZXN0IHJlc3VsdHMsIHB1dCBjb2RlIGxpa2Vcbi8vIDxib2R5IG9uQ2xpY2s9J3JuZ19zZWVkX3RpbWUoKTsnIG9uS2V5UHJlc3M9J3JuZ19zZWVkX3RpbWUoKTsnPlxuLy8gaW4geW91ciBtYWluIEhUTUwgZG9jdW1lbnQuXG5cbnZhciBybmdfc3RhdGU7XG52YXIgcm5nX3Bvb2w7XG52YXIgcm5nX3BwdHI7XG5cbi8vIE1peCBpbiBhIDMyLWJpdCBpbnRlZ2VyIGludG8gdGhlIHBvb2xcbmZ1bmN0aW9uIHJuZ19zZWVkX2ludCh4KSB7XG4gIHJuZ19wb29sW3JuZ19wcHRyKytdIF49IHggJiAyNTU7XG4gIHJuZ19wb29sW3JuZ19wcHRyKytdIF49ICh4ID4+IDgpICYgMjU1O1xuICBybmdfcG9vbFtybmdfcHB0cisrXSBePSAoeCA+PiAxNikgJiAyNTU7XG4gIHJuZ19wb29sW3JuZ19wcHRyKytdIF49ICh4ID4+IDI0KSAmIDI1NTtcbiAgaWYgKHJuZ19wcHRyID49IHJuZ19wc2l6ZSkgcm5nX3BwdHIgLT0gcm5nX3BzaXplO1xufVxuXG4vLyBNaXggaW4gdGhlIGN1cnJlbnQgdGltZSAody9taWxsaXNlY29uZHMpIGludG8gdGhlIHBvb2xcbmZ1bmN0aW9uIHJuZ19zZWVkX3RpbWUoKSB7XG4gIHJuZ19zZWVkX2ludChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG59XG5cbi8vIEluaXRpYWxpemUgdGhlIHBvb2wgd2l0aCBqdW5rIGlmIG5lZWRlZC5cbmlmIChybmdfcG9vbCA9PSBudWxsKSB7XG4gIHJuZ19wb29sID0gbmV3IEFycmF5KCk7XG4gIHJuZ19wcHRyID0gMDtcbiAgdmFyIHQ7XG4gIGlmIChpbkJyb3dzZXIgJiYgd2luZG93LmNyeXB0byAmJiB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcykge1xuICAgIC8vIFVzZSB3ZWJjcnlwdG8gaWYgYXZhaWxhYmxlXG4gICAgdmFyIHVhID0gbmV3IFVpbnQ4QXJyYXkoMzIpO1xuICAgIHdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKHVhKTtcbiAgICBmb3IgKHQgPSAwOyB0IDwgMzI7ICsrdCkgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSB1YVt0XTtcbiAgfVxuICBpZiAoaW5Ccm93c2VyICYmIG5hdmlnYXRvci5hcHBOYW1lID09ICdOZXRzY2FwZScgJiZcbiAgICAgIG5hdmlnYXRvci5hcHBWZXJzaW9uIDwgJzUnICYmIHdpbmRvdy5jcnlwdG8pIHtcbiAgICAvLyBFeHRyYWN0IGVudHJvcHkgKDI1NiBiaXRzKSBmcm9tIE5TNCBSTkcgaWYgYXZhaWxhYmxlXG4gICAgdmFyIHogPSB3aW5kb3cuY3J5cHRvLnJhbmRvbSgzMik7XG4gICAgZm9yICh0ID0gMDsgdCA8IHoubGVuZ3RoOyArK3QpIHJuZ19wb29sW3JuZ19wcHRyKytdID0gei5jaGFyQ29kZUF0KHQpICYgMjU1O1xuICB9XG4gIHdoaWxlIChybmdfcHB0ciA8IHJuZ19wc2l6ZSkgeyAgLy8gZXh0cmFjdCBzb21lIHJhbmRvbW5lc3MgZnJvbSBNYXRoLnJhbmRvbSgpXG4gICAgdCA9IE1hdGguZmxvb3IoNjU1MzYgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICBybmdfcG9vbFtybmdfcHB0cisrXSA9IHQgPj4+IDg7XG4gICAgcm5nX3Bvb2xbcm5nX3BwdHIrK10gPSB0ICYgMjU1O1xuICB9XG4gIHJuZ19wcHRyID0gMDtcbiAgcm5nX3NlZWRfdGltZSgpO1xuICAvLyBybmdfc2VlZF9pbnQod2luZG93LnNjcmVlblgpO1xuICAvLyBybmdfc2VlZF9pbnQod2luZG93LnNjcmVlblkpO1xufVxuXG5mdW5jdGlvbiBybmdfZ2V0X2J5dGUoKSB7XG4gIGlmIChybmdfc3RhdGUgPT0gbnVsbCkge1xuICAgIHJuZ19zZWVkX3RpbWUoKTtcbiAgICBybmdfc3RhdGUgPSBwcm5nX25ld3N0YXRlKCk7XG4gICAgcm5nX3N0YXRlLmluaXQocm5nX3Bvb2wpO1xuICAgIGZvciAocm5nX3BwdHIgPSAwOyBybmdfcHB0ciA8IHJuZ19wb29sLmxlbmd0aDsgKytybmdfcHB0cilcbiAgICAgIHJuZ19wb29sW3JuZ19wcHRyXSA9IDA7XG4gICAgcm5nX3BwdHIgPSAwO1xuICAgIC8vIHJuZ19wb29sID0gbnVsbDtcbiAgfVxuICAvLyBUT0RPOiBhbGxvdyByZXNlZWRpbmcgYWZ0ZXIgZmlyc3QgcmVxdWVzdFxuICByZXR1cm4gcm5nX3N0YXRlLm5leHQoKTtcbn1cblxuZnVuY3Rpb24gcm5nX2dldF9ieXRlcyhiYSkge1xuICB2YXIgaTtcbiAgZm9yIChpID0gMDsgaSA8IGJhLmxlbmd0aDsgKytpKSBiYVtpXSA9IHJuZ19nZXRfYnl0ZSgpO1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmZ1bmN0aW9uIFNlY3VyZVJhbmRvbSgpIHt9XG5cblNlY3VyZVJhbmRvbS5wcm90b3R5cGUubmV4dEJ5dGVzID0gcm5nX2dldF9ieXRlcztcblxuLy8gcHJuZzQuanMgLSB1c2VzIEFyY2ZvdXIgYXMgYSBQUk5HXG5cbmZ1bmN0aW9uIEFyY2ZvdXIoKSB7XG4gIHRoaXMuaSA9IDA7XG4gIHRoaXMuaiA9IDA7XG4gIHRoaXMuUyA9IG5ldyBBcnJheSgpO1xufVxuXG4vLyBJbml0aWFsaXplIGFyY2ZvdXIgY29udGV4dCBmcm9tIGtleSwgYW4gYXJyYXkgb2YgaW50cywgZWFjaCBmcm9tIFswLi4yNTVdXG5mdW5jdGlvbiBBUkM0aW5pdChrZXkpIHtcbiAgdmFyIGksIGosIHQ7XG4gIGZvciAoaSA9IDA7IGkgPCAyNTY7ICsraSkgdGhpcy5TW2ldID0gaTtcbiAgaiA9IDA7XG4gIGZvciAoaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICAgIGogPSAoaiArIHRoaXMuU1tpXSArIGtleVtpICUga2V5Lmxlbmd0aF0pICYgMjU1O1xuICAgIHQgPSB0aGlzLlNbaV07XG4gICAgdGhpcy5TW2ldID0gdGhpcy5TW2pdO1xuICAgIHRoaXMuU1tqXSA9IHQ7XG4gIH1cbiAgdGhpcy5pID0gMDtcbiAgdGhpcy5qID0gMDtcbn1cblxuZnVuY3Rpb24gQVJDNG5leHQoKSB7XG4gIHZhciB0O1xuICB0aGlzLmkgPSAodGhpcy5pICsgMSkgJiAyNTU7XG4gIHRoaXMuaiA9ICh0aGlzLmogKyB0aGlzLlNbdGhpcy5pXSkgJiAyNTU7XG4gIHQgPSB0aGlzLlNbdGhpcy5pXTtcbiAgdGhpcy5TW3RoaXMuaV0gPSB0aGlzLlNbdGhpcy5qXTtcbiAgdGhpcy5TW3RoaXMual0gPSB0O1xuICByZXR1cm4gdGhpcy5TWyh0ICsgdGhpcy5TW3RoaXMuaV0pICYgMjU1XTtcbn1cblxuQXJjZm91ci5wcm90b3R5cGUuaW5pdCA9IEFSQzRpbml0O1xuQXJjZm91ci5wcm90b3R5cGUubmV4dCA9IEFSQzRuZXh0O1xuXG4vLyBQbHVnIGluIHlvdXIgUk5HIGNvbnN0cnVjdG9yIGhlcmVcbmZ1bmN0aW9uIHBybmdfbmV3c3RhdGUoKSB7XG4gIHJldHVybiBuZXcgQXJjZm91cigpO1xufVxuXG4vLyBQb29sIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQgYW5kIGdyZWF0ZXIgdGhhbiAzMi5cbi8vIEFuIGFycmF5IG9mIGJ5dGVzIHRoZSBzaXplIG9mIHRoZSBwb29sIHdpbGwgYmUgcGFzc2VkIHRvIGluaXQoKVxudmFyIHJuZ19wc2l6ZSA9IDI1NjtcblxuaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICBkZWZhdWx0OiBCaWdJbnRlZ2VyLFxuICAgICAgQmlnSW50ZWdlcjogQmlnSW50ZWdlcixcbiAgICAgIFJTQUtleTogUlNBS2V5LFxuICB9O1xufSBlbHNlIHtcbiAgdGhpcy5qc2JuID0ge1xuICAgIEJpZ0ludGVnZXI6IEJpZ0ludGVnZXIsXG4gICAgUlNBS2V5OiBSU0FLZXksXG4gIH07XG59XG5cbn0pLmNhbGwodGhpcyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAxOCBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZGVmZXIgPSB2b2lkIDA7XG4vLyBDcmVhdGUgYSBwcm9taXNlIHdpdGggZXhwb3NlZCByZXNvbHZlIGFuZCByZWplY3QgY2FsbGJhY2tzLlxuZnVuY3Rpb24gZGVmZXIoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBsZXQgcmVzb2x2ZSA9IG51bGw7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBsZXQgcmVqZWN0ID0gbnVsbDtcbiAgICBjb25zdCBwID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiBbcmVzb2x2ZSwgcmVqZWN0XSA9IFtyZXMsIHJlal0pO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocCwgeyByZXNvbHZlLCByZWplY3QgfSk7XG59XG5leHBvcnRzLmRlZmVyID0gZGVmZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaWdub3JlQ2FjaGVVbmFjdGlvbmFibGVFcnJvcnMgPSBleHBvcnRzLmdldEVycm9yTWVzc2FnZSA9IHZvaWQgMDtcbi8vIEF0dGVtcHQgdG8gY29lcmNlIGFuIGVycm9yIG9iamVjdCBpbnRvIGEgc3RyaW5nIG1lc3NhZ2UuXG4vLyBTb21ldGltZXMgYW4gZXJyb3IgbWVzc2FnZSBpcyB3cmFwcGVkIGluIGFuIEVycm9yIG9iamVjdCwgc29tZXRpbWVzIG5vdC5cbmZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShlKSB7XG4gICAgaWYgKGUgJiYgdHlwZW9mIGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnN0IGVycm9yT2JqZWN0ID0gZTtcbiAgICAgICAgaWYgKGVycm9yT2JqZWN0Lm1lc3NhZ2UpIHsgLy8gcmVndWxhciBFcnJvciBPYmplY3RcbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcoZXJyb3JPYmplY3QubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXJyb3JPYmplY3QuZXJyb3I/Lm1lc3NhZ2UpIHsgLy8gQVBJIHJlc3VsdFxuICAgICAgICAgICAgcmV0dXJuIFN0cmluZyhlcnJvck9iamVjdC5lcnJvci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBhc1N0cmluZyA9IFN0cmluZyhlKTtcbiAgICBpZiAoYXNTdHJpbmcgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKHN0cmluZ2lmeUVycm9yKSB7XG4gICAgICAgICAgICAvLyBpZ25vcmUgZmFpbHVyZXMgYW5kIGp1c3QgZmFsbCB0aHJvdWdoXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFzU3RyaW5nO1xufVxuZXhwb3J0cy5nZXRFcnJvck1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2U7XG4vLyBPY2Nhc2lvbmFsbHkgb3BlcmF0aW9ucyB1c2luZyB0aGUgY2FjaGUgQVBJIHRocm93OlxuLy8gJ1Vua25vd25FcnJvcjogVW5leHBlY3RlZCBpbnRlcm5hbCBlcnJvci4ge30nXG4vLyBJdCdzIG5vdCBjbGVhciB1bmRlciB3aGljaCBjaXJjdW1zdGFuY2VzIHRoaXMgY2FuIG9jY3VyLiBBIGRpdmUgb2Zcbi8vIHRoZSBDaHJvbWl1bSBjb2RlIGRpZG4ndCBzaGVkIG11Y2ggbGlnaHQ6XG4vLyBodHRwczovL3NvdXJjZS5jaHJvbWl1bS5vcmcvY2hyb21pdW0vY2hyb21pdW0vc3JjLysvbWFpbjp0aGlyZF9wYXJ0eS9ibGluay9yZW5kZXJlci9tb2R1bGVzL2NhY2hlX3N0b3JhZ2UvY2FjaGVfc3RvcmFnZV9lcnJvci5jYztsPTI2O2RyYz00Y2ZlODY0ODJiMDAwZTg0ODAwOTA3Nzc4M2JhMzVmODNmM2MzY2ZlXG4vLyBodHRwczovL3NvdXJjZS5jaHJvbWl1bS5vcmcvY2hyb21pdW0vY2hyb21pdW0vc3JjLysvbWFpbjpjb250ZW50L2Jyb3dzZXIvY2FjaGVfc3RvcmFnZS9jYWNoZV9zdG9yYWdlX2NhY2hlLmNjO2w9MTY4NjtkcmM9YWI2OGMwNWJlYjc5MGQwNGQxY2I3ZmQ4ZmFhMGExOTdmYjQwZDM5OVxuLy8gR2l2ZW4gdGhlIGVycm9yIGlzIG5vdCBhY3Rpb25hYmxlIGF0IHByZXNlbnQgYW5kIGNhY2hpbmcgaXMgJ2Jlc3Rcbi8vIGVmZm9ydCcgaW4gYW55IGNhc2UgaWdub3JlIHRoaXMgZXJyb3IuIFdlIHdpbGwgd2FudCB0byB0aHJvdyBmb3Jcbi8vIGVycm9ycyBpbiBnZW5lcmFsIHRob3VnaCBzbyBhcyBub3QgdG8gaGlkZSBlcnJvcnMgd2UgYWN0dWFsbHkgY291bGRcbi8vIGZpeC5cbi8vIFNlZSBiLzIyNzc4NTY2NSBmb3IgYW4gZXhhbXBsZS5cbmZ1bmN0aW9uIGlnbm9yZUNhY2hlVW5hY3Rpb25hYmxlRXJyb3JzKGUsIHJlc3VsdCkge1xuICAgIGlmIChnZXRFcnJvck1lc3NhZ2UoZSkuaW5jbHVkZXMoJ1Vua25vd25FcnJvcicpKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cbn1cbmV4cG9ydHMuaWdub3JlQ2FjaGVVbmFjdGlvbmFibGVFcnJvcnMgPSBpZ25vcmVDYWNoZVVuYWN0aW9uYWJsZUVycm9ycztcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDE4IFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hc3NlcnRVbnJlYWNoYWJsZSA9IGV4cG9ydHMucmVwb3J0RXJyb3IgPSBleHBvcnRzLnNldEVycm9ySGFuZGxlciA9IGV4cG9ydHMuYXNzZXJ0RmFsc2UgPSBleHBvcnRzLmFzc2VydFRydWUgPSBleHBvcnRzLmFzc2VydEV4aXN0cyA9IHZvaWQgMDtcbmxldCBlcnJvckhhbmRsZXIgPSAoXykgPT4geyB9O1xuZnVuY3Rpb24gYXNzZXJ0RXhpc3RzKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBkb2VzblxcJ3QgZXhpc3QnKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZXhwb3J0cy5hc3NlcnRFeGlzdHMgPSBhc3NlcnRFeGlzdHM7XG5mdW5jdGlvbiBhc3NlcnRUcnVlKHZhbHVlLCBvcHRNc2cpIHtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihvcHRNc2cgPz8gJ0ZhaWxlZCBhc3NlcnRpb24nKTtcbiAgICB9XG59XG5leHBvcnRzLmFzc2VydFRydWUgPSBhc3NlcnRUcnVlO1xuZnVuY3Rpb24gYXNzZXJ0RmFsc2UodmFsdWUsIG9wdE1zZykge1xuICAgIGFzc2VydFRydWUoIXZhbHVlLCBvcHRNc2cpO1xufVxuZXhwb3J0cy5hc3NlcnRGYWxzZSA9IGFzc2VydEZhbHNlO1xuZnVuY3Rpb24gc2V0RXJyb3JIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICBlcnJvckhhbmRsZXIgPSBoYW5kbGVyO1xufVxuZXhwb3J0cy5zZXRFcnJvckhhbmRsZXIgPSBzZXRFcnJvckhhbmRsZXI7XG5mdW5jdGlvbiByZXBvcnRFcnJvcihlcnIpIHtcbiAgICBsZXQgZXJyTG9nID0gJyc7XG4gICAgbGV0IGVycm9yT2JqID0gdW5kZWZpbmVkO1xuICAgIGlmIChlcnIgaW5zdGFuY2VvZiBFcnJvckV2ZW50KSB7XG4gICAgICAgIGVyckxvZyA9IGVyci5tZXNzYWdlO1xuICAgICAgICBlcnJvck9iaiA9IGVyci5lcnJvcjtcbiAgICB9XG4gICAgZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50KSB7XG4gICAgICAgIGVyckxvZyA9IGAke2Vyci5yZWFzb259YDtcbiAgICAgICAgZXJyb3JPYmogPSBlcnIucmVhc29uO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXJyTG9nID0gYCR7ZXJyfWA7XG4gICAgfVxuICAgIGlmIChlcnJvck9iaiAhPT0gdW5kZWZpbmVkICYmIGVycm9yT2JqICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGVyclN0YWNrID0gZXJyb3JPYmouc3RhY2s7XG4gICAgICAgIGVyckxvZyArPSAnXFxuJztcbiAgICAgICAgZXJyTG9nICs9IGVyclN0YWNrICE9PSB1bmRlZmluZWQgPyBlcnJTdGFjayA6IEpTT04uc3RyaW5naWZ5KGVycm9yT2JqKTtcbiAgICB9XG4gICAgZXJyTG9nICs9ICdcXG5cXG4nO1xuICAgIGVyckxvZyArPSBgVUE6ICR7bmF2aWdhdG9yLnVzZXJBZ2VudH1cXG5gO1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyTG9nLCBlcnIpO1xuICAgIGVycm9ySGFuZGxlcihlcnJMb2cpO1xufVxuZXhwb3J0cy5yZXBvcnRFcnJvciA9IHJlcG9ydEVycm9yO1xuLy8gVGhpcyBmdW5jdGlvbiBzZXJ2ZXMgdHdvIHB1cnBvc2VzLlxuLy8gMSkgQSBydW50aW1lIGNoZWNrIC0gaWYgd2UgYXJlIGV2ZXIgY2FsbGVkLCB3ZSB0aHJvdyBhbiBleGNlcHRpb24uXG4vLyBUaGlzIGlzIHVzZWZ1bCBmb3IgY2hlY2tpbmcgdGhhdCBjb2RlIHdlIHN1c3BlY3Qgc2hvdWxkIG5ldmVyIGJlIHJlYWNoZWQgaXNcbi8vIGFjdHVhbGx5IG5ldmVyIHJlYWNoZWQuXG4vLyAyKSBBIGNvbXBpbGUgdGltZSBjaGVjayB3aGVyZSB0eXBlc2NyaXB0IGFzc2VydHMgdGhhdCB0aGUgdmFsdWUgcGFzc2VkIGNhbiBiZVxuLy8gY2FzdCB0byB0aGUgXCJuZXZlclwiIHR5cGUuXG4vLyBUaGlzIGlzIHVzZWZ1bCBmb3IgZW5zdXJpbmcgd2UgZXhoYXN0aXZlbHkgY2hlY2sgdW5pb24gdHlwZXMuXG5mdW5jdGlvbiBhc3NlcnRVbnJlYWNoYWJsZShfeCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBjb2RlIHNob3VsZCBub3QgYmUgcmVhY2hhYmxlJyk7XG59XG5leHBvcnRzLmFzc2VydFVucmVhY2hhYmxlID0gYXNzZXJ0VW5yZWFjaGFibGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMyBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuaXNFbnVtVmFsdWUgPSBleHBvcnRzLmlzU3RyaW5nID0gZXhwb3J0cy5zaGFsbG93RXF1YWxzID0gZXhwb3J0cy5sb29rdXBQYXRoID0gdm9pZCAwO1xuLy8gR2l2ZW4gYW4gb2JqZWN0LCByZXR1cm4gYSByZWYgdG8gdGhlIG9iamVjdCBvciBpdGVtIGF0IGF0IGEgZ2l2ZW4gcGF0aC5cbi8vIEEgcGF0aCBpcyBkZWZpbmVkIHVzaW5nIGFuIGFycmF5IG9mIHBhdGgtbGlrZSBlbGVtZW50czogSS5lLiBbc3RyaW5nfG51bWJlcl0uXG4vLyBSZXR1cm5zIHVuZGVmaW5lZCBpZiB0aGUgcGF0aCBkb2Vzbid0IGV4aXN0LlxuLy8gTm90ZTogVGhpcyBpcyBhbiBhcHByb3ByaWF0ZSB1c2Ugb2YgYGFueWAsIGFzIHdlIGFyZSBrbm93aW5nbHkgZ2V0dGluZyBmYXN0XG4vLyBhbmQgbG9vc2Ugd2l0aCB0aGUgdHlwZSBzeXN0ZW0gaW4gdGhpcyBmdW5jdGlvbjogaXQncyBiYXNpY2FsbHkgSmF2YVNjcmlwdC5cbi8vIEF0dGVtcHRpbmcgdG8gcHJldGVuZCBpdCdzIGFueXRoaW5nIGVsc2Ugd291bGQgcmVzdWx0IGluIHN1cGVyZmx1b3VzIHR5cGVcbi8vIGFzc2VydGlvbnMgd2hpY2ggd291bGQgaGF2ZSBubyBiZW5lZml0LlxuLy8gSSdtIHN1cmUgd2UgY291bGQgY29udmluY2UgVHlwZVNjcmlwdCB0byBmb2xsb3cgdGhlIHBhdGggYW5kIHR5cGUgZXZlcnl0aGluZ1xuLy8gY29ycmVjdGx5IGFsb25nIHRoZSB3YXksIGJ1dCB0aGF0J3MgYSBqb2IgZm9yIGFub3RoZXIgZGF5LlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbmZ1bmN0aW9uIGxvb2t1cFBhdGgodmFsdWUsIHBhdGgpIHtcbiAgICBsZXQgbyA9IHZhbHVlO1xuICAgIGZvciAoY29uc3QgcCBvZiBwYXRoKSB7XG4gICAgICAgIGlmIChwIGluIG8pIHtcbiAgICAgICAgICAgIG8gPSBvW3BdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbztcbn1cbmV4cG9ydHMubG9va3VwUGF0aCA9IGxvb2t1cFBhdGg7XG5mdW5jdGlvbiBzaGFsbG93RXF1YWxzKGEsIGIpIHtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoYSA9PT0gbnVsbCB8fCBiID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3Qgb2JqQSA9IGE7XG4gICAgY29uc3Qgb2JqQiA9IGI7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqQSkpIHtcbiAgICAgICAgaWYgKG9iakFba2V5XSAhPT0gb2JqQltrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqQikpIHtcbiAgICAgICAgaWYgKG9iakFba2V5XSAhPT0gb2JqQltrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5leHBvcnRzLnNoYWxsb3dFcXVhbHMgPSBzaGFsbG93RXF1YWxzO1xuZnVuY3Rpb24gaXNTdHJpbmcocykge1xuICAgIHJldHVybiB0eXBlb2YgcyA9PT0gJ3N0cmluZycgfHwgcyBpbnN0YW5jZW9mIFN0cmluZztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbi8vIEdpdmVuIGEgc3RyaW5nIGVudW0gfGVudW18LCBjaGVjayB0aGF0IHx2YWx1ZXwgaXMgYSB2YWxpZCBtZW1iZXIgb2YgfGVudW18LlxuZnVuY3Rpb24gaXNFbnVtVmFsdWUoZW5tLCB2YWx1ZSkge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKGVubSkuaW5jbHVkZXModmFsdWUpO1xufVxuZXhwb3J0cy5pc0VudW1WYWx1ZSA9IGlzRW51bVZhbHVlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMTkgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnVuZG9Db21tb25DaGF0QXBwUmVwbGFjZW1lbnRzID0gZXhwb3J0cy5zcWxpdGVTdHJpbmcgPSBleHBvcnRzLmJpbmFyeURlY29kZSA9IGV4cG9ydHMuYmluYXJ5RW5jb2RlID0gZXhwb3J0cy51dGY4RGVjb2RlID0gZXhwb3J0cy51dGY4RW5jb2RlID0gZXhwb3J0cy5oZXhFbmNvZGUgPSBleHBvcnRzLmJhc2U2NERlY29kZSA9IGV4cG9ydHMuYmFzZTY0RW5jb2RlID0gdm9pZCAwO1xuY29uc3QgYmFzZTY0XzEgPSByZXF1aXJlKFwiQHByb3RvYnVmanMvYmFzZTY0XCIpO1xuY29uc3QgdXRmOF8xID0gcmVxdWlyZShcIkBwcm90b2J1ZmpzL3V0ZjhcIik7XG5jb25zdCBsb2dnaW5nXzEgPSByZXF1aXJlKFwiLi9sb2dnaW5nXCIpO1xuLy8gVGV4dERlY29kZXIvRGVjb2RlciByZXF1aXJlcyB0aGUgZnVsbCBET00gYW5kIGlzbid0IGF2YWlsYWJsZSBpbiBhbGwgdHlwZXNcbi8vIG9mIHRlc3RzLiBVc2UgZmFsbGJhY2sgaW1wbGVtZW50YXRpb24gZnJvbSBwcm90YnVmanMuXG5sZXQgVXRmOERlY29kZXI7XG5sZXQgVXRmOEVuY29kZXI7XG50cnkge1xuICAgIFV0ZjhEZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGYtOCcpO1xuICAgIFV0ZjhFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG59XG5jYXRjaCAoXykge1xuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gU2lsZW5jZSB0aGUgd2FybmluZyB3aGVuIHdlIGtub3cgd2UgYXJlIHJ1bm5pbmcgdW5kZXIgTm9kZUpTLlxuICAgICAgICBjb25zb2xlLndhcm4oJ1VzaW5nIGZhbGxiYWNrIFVURjggRW5jb2Rlci9EZWNvZGVyLCBUaGlzIHNob3VsZCBoYXBwZW4gb25seSBpbiAnICtcbiAgICAgICAgICAgICd0ZXN0cyBhbmQgTm9kZUpTLWJhc2VkIGVudmlyb25tZW50cywgbm90IGluIGJyb3dzZXJzLicpO1xuICAgIH1cbiAgICBVdGY4RGVjb2RlciA9IHsgZGVjb2RlOiAoYnVmKSA9PiAoMCwgdXRmOF8xLnJlYWQpKGJ1ZiwgMCwgYnVmLmxlbmd0aCkgfTtcbiAgICBVdGY4RW5jb2RlciA9IHtcbiAgICAgICAgZW5jb2RlOiAoc3RyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheSgoMCwgdXRmOF8xLmxlbmd0aCkoc3RyKSk7XG4gICAgICAgICAgICBjb25zdCB3cml0dGVuID0gKDAsIHV0ZjhfMS53cml0ZSkoc3RyLCBhcnIsIDApO1xuICAgICAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh3cml0dGVuID09PSBhcnIubGVuZ3RoKTtcbiAgICAgICAgICAgIHJldHVybiBhcnI7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbmZ1bmN0aW9uIGJhc2U2NEVuY29kZShidWZmZXIpIHtcbiAgICByZXR1cm4gKDAsIGJhc2U2NF8xLmVuY29kZSkoYnVmZmVyLCAwLCBidWZmZXIubGVuZ3RoKTtcbn1cbmV4cG9ydHMuYmFzZTY0RW5jb2RlID0gYmFzZTY0RW5jb2RlO1xuZnVuY3Rpb24gYmFzZTY0RGVjb2RlKHN0cikge1xuICAgIC8vIGlmIHRoZSBzdHJpbmcgaXMgaW4gYmFzZTY0dXJsIGZvcm1hdCwgY29udmVydCB0byBiYXNlNjRcbiAgICBjb25zdCBiNjQgPSBzdHIucmVwbGFjZUFsbCgnLScsICcrJykucmVwbGFjZUFsbCgnXycsICcvJyk7XG4gICAgY29uc3QgYXJyID0gbmV3IFVpbnQ4QXJyYXkoKDAsIGJhc2U2NF8xLmxlbmd0aCkoYjY0KSk7XG4gICAgY29uc3Qgd3JpdHRlbiA9ICgwLCBiYXNlNjRfMS5kZWNvZGUpKGI2NCwgYXJyLCAwKTtcbiAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHdyaXR0ZW4gPT09IGFyci5sZW5ndGgpO1xuICAgIHJldHVybiBhcnI7XG59XG5leHBvcnRzLmJhc2U2NERlY29kZSA9IGJhc2U2NERlY29kZTtcbi8vIGVuY29kZSBiaW5hcnkgYXJyYXkgdG8gaGV4IHN0cmluZ1xuZnVuY3Rpb24gaGV4RW5jb2RlKGJ5dGVzKSB7XG4gICAgcmV0dXJuIGJ5dGVzLnJlZHVjZSgocHJldiwgY3VyKSA9PiBwcmV2ICsgKCcwJyArIGN1ci50b1N0cmluZygxNikpLnNsaWNlKC0yKSwgJycpO1xufVxuZXhwb3J0cy5oZXhFbmNvZGUgPSBoZXhFbmNvZGU7XG5mdW5jdGlvbiB1dGY4RW5jb2RlKHN0cikge1xuICAgIHJldHVybiBVdGY4RW5jb2Rlci5lbmNvZGUoc3RyKTtcbn1cbmV4cG9ydHMudXRmOEVuY29kZSA9IHV0ZjhFbmNvZGU7XG4vLyBOb3RlOiBub3QgYWxsIGJ5dGUgc2VxdWVuY2VzIGNhbiBiZSBjb252ZXJ0ZWQgdG88PmZyb20gVVRGOC4gVGhpcyBjYW4gYmVcbi8vIHVzZWQgb25seSB3aXRoIHZhbGlkIHVuaWNvZGUgc3RyaW5ncywgbm90IGFyYml0cmFyeSBieXRlIGJ1ZmZlcnMuXG5mdW5jdGlvbiB1dGY4RGVjb2RlKGJ1ZmZlcikge1xuICAgIHJldHVybiBVdGY4RGVjb2Rlci5kZWNvZGUoYnVmZmVyKTtcbn1cbmV4cG9ydHMudXRmOERlY29kZSA9IHV0ZjhEZWNvZGU7XG4vLyBUaGUgYmluYXJ5RW5jb2RlL0RlY29kZSBmdW5jdGlvbnMgYmVsb3cgYWxsb3cgdG8gZW5jb2RlIGFuIGFyYml0cmFyeSBiaW5hcnlcbi8vIGJ1ZmZlciBpbnRvIGEgc3RyaW5nIHRoYXQgY2FuIGJlIEpTT04tZW5jb2RlZC4gYmluYXJ5RW5jb2RlKCkgYXBwbGllc1xuLy8gVVRGLTE2IGVuY29kaW5nIHRvIGVhY2ggYnl0ZSBpbmRpdmlkdWFsbHkuXG4vLyBVbmxpa2UgdXRmOEVuY29kZS9EZWNvZGUsIGFueSBhcmJpdHJhcnkgYnl0ZSBzZXF1ZW5jZSBjYW4gYmUgY29udmVydGVkIGludG8gYVxuLy8gdmFsaWQgc3RyaW5nLCBhbmQgdmljZXZlcnNhLlxuLy8gVGhpcyBzaG91bGQgYmUgb25seSB1c2VkIHdoZW4gYSBieXRlIGFycmF5IG5lZWRzIHRvIGJlIHRyYW5zbWl0dGVkIG92ZXIgYW5cbi8vIGludGVyZmFjZSB0aGF0IHN1cHBvcnRzIG9ubHkgSlNPTiBzZXJpYWxpemF0aW9uIChlLmcuLCBwb3N0bWVzc2FnZSB0byBhXG4vLyBjaHJvbWUgZXh0ZW5zaW9uKS5cbmZ1bmN0aW9uIGJpbmFyeUVuY29kZShidWYpIHtcbiAgICBsZXQgc3RyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBidWYubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cbmV4cG9ydHMuYmluYXJ5RW5jb2RlID0gYmluYXJ5RW5jb2RlO1xuZnVuY3Rpb24gYmluYXJ5RGVjb2RlKHN0cikge1xuICAgIGNvbnN0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KHN0ci5sZW5ndGgpO1xuICAgIGNvbnN0IHN0ckxlbiA9IHN0ci5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJMZW47IGkrKykge1xuICAgICAgICBidWZbaV0gPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1Zjtcbn1cbmV4cG9ydHMuYmluYXJ5RGVjb2RlID0gYmluYXJ5RGVjb2RlO1xuLy8gQSBmdW5jdGlvbiB1c2VkIHRvIGludGVycG9sYXRlIHN0cmluZ3MgaW50byBTUUwgcXVlcnkuIFRoZSBvbmx5IHJlcGxhY2VtZW50XG4vLyBpcyBkb25lIGlzIHRoYXQgc2luZ2xlIHF1b3RlIHJlcGxhY2VkIHdpdGggdHdvIHNpbmdsZSBxdW90ZXMsIGFjY29yZGluZyB0b1xuLy8gU1FMaXRlIGRvY3VtZW50YXRpb246XG4vLyBodHRwczovL3d3dy5zcWxpdGUub3JnL2xhbmdfZXhwci5odG1sI2xpdGVyYWxfdmFsdWVzX2NvbnN0YW50c19cbi8vXG4vLyBUaGUgcHVycG9zZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHRvIHVzZSBpbiBzaW1wbGUgY29tcGFyaXNvbnMsIHRvIGVzY2FwZVxuLy8gc3RyaW5ncyB1c2VkIGluIEdMT0IgY2xhdXNlcyBzZWUgZXNjYXBlUXVlcnkgZnVuY3Rpb24uXG5mdW5jdGlvbiBzcWxpdGVTdHJpbmcoc3RyKSB7XG4gICAgcmV0dXJuIGAnJHtzdHIucmVwbGFjZUFsbCgnXFwnJywgJ1xcJ1xcJycpfSdgO1xufVxuZXhwb3J0cy5zcWxpdGVTdHJpbmcgPSBzcWxpdGVTdHJpbmc7XG4vLyBDaGF0IGFwcHMgKGluY2x1ZGluZyBHIENoYXQpIHNvbWV0aW1lcyByZXBsYWNlIEFTQ0lJIGNoYXJhY3RlcnMgd2l0aCBzaW1pbGFyXG4vLyBsb29raW5nIHVuaWNvZGUgY2hhcmFjdGVycyB0aGF0IGJyZWFrIGNvZGUgc25pcHBldHMuXG4vLyBUaGlzIGZ1bmN0aW9uIGF0dGVtcHRzIHRvIHVuZG8gdGhlc2UgcmVwbGFjZW1lbnRzLlxuZnVuY3Rpb24gdW5kb0NvbW1vbkNoYXRBcHBSZXBsYWNlbWVudHMoc3RyKSB7XG4gICAgLy8gUmVwbGFjZSBub24tYnJlYWtpbmcgc3BhY2VzIHdpdGggbm9ybWFsIHNwYWNlcy5cbiAgICByZXR1cm4gc3RyLnJlcGxhY2VBbGwoJ1xcdTAwQTAnLCAnICcpO1xufVxuZXhwb3J0cy51bmRvQ29tbW9uQ2hhdEFwcFJlcGxhY2VtZW50cyA9IHVuZG9Db21tb25DaGF0QXBwUmVwbGFjZW1lbnRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFycmF5QnVmZmVyQnVpbGRlciA9IHZvaWQgMDtcbmNvbnN0IHV0ZjhfMSA9IHJlcXVpcmUoXCJAcHJvdG9idWZqcy91dGY4XCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IG9iamVjdF91dGlsc18xID0gcmVxdWlyZShcIi4uL2Jhc2Uvb2JqZWN0X3V0aWxzXCIpO1xuLy8gUmV0dXJuIHRoZSBsZW5ndGgsIGluIGJ5dGVzLCBvZiBhIHRva2VuIHRvIGJlIGluc2VydGVkLlxuZnVuY3Rpb24gdG9rZW5MZW5ndGgodG9rZW4pIHtcbiAgICBpZiAoKDAsIG9iamVjdF91dGlsc18xLmlzU3RyaW5nKSh0b2tlbikpIHtcbiAgICAgICAgcmV0dXJuICgwLCB1dGY4XzEubGVuZ3RoKSh0b2tlbik7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRva2VuIGluc3RhbmNlb2YgVWludDhBcnJheSkge1xuICAgICAgICByZXR1cm4gdG9rZW4uYnl0ZUxlbmd0aDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkodG9rZW4gPj0gMCAmJiB0b2tlbiA8PSAweGZmZmZmZmZmKTtcbiAgICAgICAgLy8gMzItYml0IGludGVnZXJzIHRha2UgNCBieXRlc1xuICAgICAgICByZXR1cm4gNDtcbiAgICB9XG59XG4vLyBJbnNlcnQgYSB0b2tlbiBpbnRvIHRoZSBidWZmZXIsIGF0IHBvc2l0aW9uIGBieXRlT2Zmc2V0YC5cbi8vXG4vLyBAcGFyYW0gZGF0YVZpZXcgQSBEYXRhVmlldyBpbnRvIHRoZSBidWZmZXIgdG8gd3JpdGUgaW50by5cbi8vIEBwYXJhbSB0eXBlZEFycmF5IEEgVWludDhBcnJheSB2aWV3IGludG8gdGhlIGJ1ZmZlciB0byB3cml0ZSBpbnRvLlxuLy8gQHBhcmFtIGJ5dGVPZmZzZXQgUG9zaXRpb24gdG8gd3JpdGUgYXQsIGluIHRoZSBidWZmZXIuXG4vLyBAcGFyYW0gdG9rZW4gVG9rZW4gdG8gaW5zZXJ0IGludG8gdGhlIGJ1ZmZlci5cbmZ1bmN0aW9uIGluc2VydFRva2VuKGRhdGFWaWV3LCB0eXBlZEFycmF5LCBieXRlT2Zmc2V0LCB0b2tlbikge1xuICAgIGlmICgoMCwgb2JqZWN0X3V0aWxzXzEuaXNTdHJpbmcpKHRva2VuKSkge1xuICAgICAgICAvLyBFbmNvZGUgdGhlIHN0cmluZyBpbiBVVEYtOFxuICAgICAgICBjb25zdCB3cml0dGVuID0gKDAsIHV0ZjhfMS53cml0ZSkodG9rZW4sIHR5cGVkQXJyYXksIGJ5dGVPZmZzZXQpO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHdyaXR0ZW4gPT09ICgwLCB1dGY4XzEubGVuZ3RoKSh0b2tlbikpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0b2tlbiBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcbiAgICAgICAgLy8gQ29weSB0aGUgYnl0ZXMgZnJvbSB0aGUgb3RoZXIgYXJyYXlcbiAgICAgICAgdHlwZWRBcnJheS5zZXQodG9rZW4sIGJ5dGVPZmZzZXQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKSh0b2tlbiA+PSAwICYmIHRva2VuIDw9IDB4ZmZmZmZmZmYpO1xuICAgICAgICAvLyAzMi1iaXQgbGl0dGxlLWVuZGlhbiB2YWx1ZVxuICAgICAgICBkYXRhVmlldy5zZXRVaW50MzIoYnl0ZU9mZnNldCwgdG9rZW4sIHRydWUpO1xuICAgIH1cbn1cbi8vIExpa2UgYSBzdHJpbmcgYnVpbGRlciwgYnV0IGZvciBhbiBBcnJheUJ1ZmZlciBpbnN0ZWFkIG9mIGEgc3RyaW5nLiBUaGlzXG4vLyBhbGxvd3MgdXMgdG8gYXNzZW1ibGUgbWVzc2FnZXMgdG8gc2VuZC9yZWNlaXZlIG92ZXIgdGhlIHdpcmUuIERhdGEgY2FuIGJlXG4vLyBhcHBlbmRlZCB0byB0aGUgYnVmZmVyIHVzaW5nIGBhcHBlbmQoKWAuIFRoZSBkYXRhIHdlIGFwcGVuZCBjYW4gYmUgb2YgdGhlXG4vLyBmb2xsb3dpbmcgdHlwZXM6XG4vL1xuLy8gLSBzdHJpbmc6IHRoZSBBU0NJSSBzdHJpbmcgaXMgYXBwZW5kZWQuIFRocm93cyBhbiBlcnJvciBpZiB0aGVyZSBhcmVcbi8vICAgICAgICAgICBub24tQVNDSUkgY2hhcmFjdGVycy5cbi8vIC0gbnVtYmVyOiB0aGUgbnVtYmVyIGlzIGFwcGVuZGVkIGFzIGEgMzItYml0IGxpdHRsZS1lbmRpYW4gaW50ZWdlci5cbi8vIC0gVWludDhBcnJheTogdGhlIGJ5dGVzIGFyZSBhcHBlbmRlZCBhcy1pcyB0byB0aGUgYnVmZmVyLlxuY2xhc3MgQXJyYXlCdWZmZXJCdWlsZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy50b2tlbnMgPSBbXTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFuIGBBcnJheUJ1ZmZlcmAgdGhhdCBpcyB0aGUgY29uY2F0ZW5hdGlvbiBvZiBhbGwgdGhlIHRva2Vucy5cbiAgICB0b0FycmF5QnVmZmVyKCkge1xuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIHNpemUgb2YgdGhlIGJ1ZmZlciB3ZSBuZWVkLlxuICAgICAgICBsZXQgYnl0ZUxlbmd0aCA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdGhpcy50b2tlbnMpIHtcbiAgICAgICAgICAgIGJ5dGVMZW5ndGggKz0gdG9rZW5MZW5ndGgodG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFsbG9jYXRlIHRoZSBidWZmZXIuXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihieXRlTGVuZ3RoKTtcbiAgICAgICAgY29uc3QgZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcoYnVmZmVyKTtcbiAgICAgICAgY29uc3QgdHlwZWRBcnJheSA9IG5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG4gICAgICAgIC8vIEZpbGwgdGhlIGJ1ZmZlciB3aXRoIHRoZSB0b2tlbnMuXG4gICAgICAgIGxldCBieXRlT2Zmc2V0ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0aGlzLnRva2Vucykge1xuICAgICAgICAgICAgaW5zZXJ0VG9rZW4oZGF0YVZpZXcsIHR5cGVkQXJyYXksIGJ5dGVPZmZzZXQsIHRva2VuKTtcbiAgICAgICAgICAgIGJ5dGVPZmZzZXQgKz0gdG9rZW5MZW5ndGgodG9rZW4pO1xuICAgICAgICB9XG4gICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0VHJ1ZSkoYnl0ZU9mZnNldCA9PT0gYnl0ZUxlbmd0aCk7XG4gICAgICAgIC8vIFJldHVybiB0aGUgdmFsdWVzLlxuICAgICAgICByZXR1cm4gYnVmZmVyO1xuICAgIH1cbiAgICAvLyBBZGQgb25lIG9yIG1vcmUgdG9rZW5zIHRvIHRoZSB2YWx1ZSBvZiB0aGlzIG9iamVjdC5cbiAgICBhcHBlbmQodG9rZW4pIHtcbiAgICAgICAgdGhpcy50b2tlbnMucHVzaCh0b2tlbik7XG4gICAgfVxufVxuZXhwb3J0cy5BcnJheUJ1ZmZlckJ1aWxkZXIgPSBBcnJheUJ1ZmZlckJ1aWxkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiQ29ubmVjdGlvbkltcGwgPSB2b2lkIDA7XG5jb25zdCBjdXN0b21fdXRpbHNfMSA9IHJlcXVpcmUoXCJjdXN0b21fdXRpbHNcIik7XG5jb25zdCBkZWZlcnJlZF8xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvZGVmZXJyZWRcIik7XG5jb25zdCBhcnJheV9idWZmZXJfYnVpbGRlcl8xID0gcmVxdWlyZShcIi4uL2FycmF5X2J1ZmZlcl9idWlsZGVyXCIpO1xuY29uc3QgYWRiX2ZpbGVfaGFuZGxlcl8xID0gcmVxdWlyZShcIi4vYWRiX2ZpbGVfaGFuZGxlclwiKTtcbmNvbnN0IHRleHREZWNvZGVyID0gbmV3IGN1c3RvbV91dGlsc18xLl9UZXh0RGVjb2RlcigpO1xuY2xhc3MgQWRiQ29ubmVjdGlvbkltcGwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyBvblN0YXR1cyBhbmQgb25EaXNjb25uZWN0IGFyZSBzZXQgdG8gY2FsbGJhY2tzIHBhc3NlZCBmcm9tIHRoZSBjYWxsZXIuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucyBmb3IgaW5zdGFuY2UgaW4gdGhlIEFuZHJvaWRXZWJ1c2JUYXJnZXQsIHdoaWNoIGluc3RhbnRpYXRlc1xuICAgICAgICAvLyB0aGVtIHdpdGggY2FsbGJhY2tzIHBhc3NlZCBmcm9tIHRoZSBVSS5cbiAgICAgICAgdGhpcy5vblN0YXR1cyA9ICgpID0+IHsgfTtcbiAgICAgICAgdGhpcy5vbkRpc2Nvbm5lY3QgPSAoXykgPT4geyB9O1xuICAgIH1cbiAgICAvLyBTdGFydHMgYSBzaGVsbCBjb21tYW5kLCBhbmQgcmV0dXJucyBhIHByb21pc2UgcmVzb2x2ZWQgd2hlbiB0aGUgY29tbWFuZFxuICAgIC8vIGNvbXBsZXRlcy5cbiAgICBhc3luYyBzaGVsbEFuZFdhaXRDb21wbGV0aW9uKGNtZCkge1xuICAgICAgICBjb25zdCBhZGJTdHJlYW0gPSBhd2FpdCB0aGlzLnNoZWxsKGNtZCk7XG4gICAgICAgIGNvbnN0IG9uU3RyZWFtaW5nRW5kZWQgPSAoMCwgZGVmZXJyZWRfMS5kZWZlcikoKTtcbiAgICAgICAgLy8gV2Ugd2FpdCBmb3IgdGhlIHN0cmVhbSB0byBiZSBjbG9zZWQgYnkgdGhlIGRldmljZSwgd2hpY2ggaGFwcGVuc1xuICAgICAgICAvLyBhZnRlciB0aGUgc2hlbGwgY29tbWFuZCBpcyBzdWNjZXNzZnVsbHkgcmVjZWl2ZWQuXG4gICAgICAgIGFkYlN0cmVhbS5hZGRPblN0cmVhbUNsb3NlQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgICAgb25TdHJlYW1pbmdFbmRlZC5yZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb25TdHJlYW1pbmdFbmRlZDtcbiAgICB9XG4gICAgLy8gU3RhcnRzIGEgc2hlbGwgY29tbWFuZCwgdGhlbiBnYXRoZXJzIGFsbCBpdHMgb3V0cHV0IGFuZCByZXR1cm5zIGl0IGFzXG4gICAgLy8gYSBzdHJpbmcuXG4gICAgYXN5bmMgc2hlbGxBbmRHZXRPdXRwdXQoY21kKSB7XG4gICAgICAgIGNvbnN0IGFkYlN0cmVhbSA9IGF3YWl0IHRoaXMuc2hlbGwoY21kKTtcbiAgICAgICAgY29uc3QgY29tbWFuZE91dHB1dCA9IG5ldyBhcnJheV9idWZmZXJfYnVpbGRlcl8xLkFycmF5QnVmZmVyQnVpbGRlcigpO1xuICAgICAgICBjb25zdCBvblN0cmVhbWluZ0VuZGVkID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIGFkYlN0cmVhbS5hZGRPblN0cmVhbURhdGFDYWxsYmFjaygoZGF0YSkgPT4ge1xuICAgICAgICAgICAgY29tbWFuZE91dHB1dC5hcHBlbmQoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhZGJTdHJlYW0uYWRkT25TdHJlYW1DbG9zZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICAgIG9uU3RyZWFtaW5nRW5kZWQucmVzb2x2ZSh0ZXh0RGVjb2Rlci5kZWNvZGUoY29tbWFuZE91dHB1dC50b0FycmF5QnVmZmVyKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvblN0cmVhbWluZ0VuZGVkO1xuICAgIH1cbiAgICBhc3luYyBwdXNoKGJpbmFyeSwgcGF0aCkge1xuICAgICAgICBjb25zdCBieXRlU3RyZWFtID0gYXdhaXQgdGhpcy5vcGVuU3RyZWFtKCdzeW5jOicpO1xuICAgICAgICBhd2FpdCAobmV3IGFkYl9maWxlX2hhbmRsZXJfMS5BZGJGaWxlSGFuZGxlcihieXRlU3RyZWFtKSkucHVzaEJpbmFyeShiaW5hcnksIHBhdGgpO1xuICAgICAgICAvLyBXZSBuZWVkIHRvIHdhaXQgdW50aWwgdGhlIGJ5dGVzdHJlYW0gaXMgY2xvc2VkLiBPdGhlcndpc2UsIHdlIGNhbiBoYXZlIGFcbiAgICAgICAgLy8gcmFjZSBjb25kaXRpb246XG4gICAgICAgIC8vIElmIHRoaXMgaXMgdGhlIGxhc3Qgc3RyZWFtLCBpdCB3aWxsIHRyeSB0byBkaXNjb25uZWN0IHRoZSBkZXZpY2UuIEluIHRoZVxuICAgICAgICAvLyBtZWFudGltZSwgdGhlIGNhbGxlciBtaWdodCBjcmVhdGUgYW5vdGhlciBzdHJlYW0gd2hpY2ggd2lsbCB0cnkgdG8gb3BlblxuICAgICAgICAvLyB0aGUgZGV2aWNlLlxuICAgICAgICBhd2FpdCBieXRlU3RyZWFtLmNsb3NlQW5kV2FpdEZvclRlYXJkb3duKCk7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJDb25uZWN0aW9uSW1wbCA9IEFkYkNvbm5lY3Rpb25JbXBsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYk92ZXJXZWJ1c2JTdHJlYW0gPSBleHBvcnRzLkFkYkNvbm5lY3Rpb25PdmVyV2VidXNiID0gZXhwb3J0cy5BZGJTdGF0ZSA9IGV4cG9ydHMuREVGQVVMVF9NQVhfUEFZTE9BRF9CWVRFUyA9IGV4cG9ydHMuVkVSU0lPTl9OT19DSEVDS1NVTSA9IGV4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNID0gdm9pZCAwO1xuY29uc3QgY3VzdG9tX3V0aWxzXzEgPSByZXF1aXJlKFwiY3VzdG9tX3V0aWxzXCIpO1xuY29uc3QgZGVmZXJyZWRfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2RlZmVycmVkXCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IG9iamVjdF91dGlsc18xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2Uvb2JqZWN0X3V0aWxzXCIpO1xuY29uc3QgYWRiX2Nvbm5lY3Rpb25faW1wbF8xID0gcmVxdWlyZShcIi4vYWRiX2Nvbm5lY3Rpb25faW1wbFwiKTtcbmNvbnN0IGFkYl9rZXlfbWFuYWdlcl8xID0gcmVxdWlyZShcIi4vYXV0aC9hZGJfa2V5X21hbmFnZXJcIik7XG5jb25zdCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMSA9IHJlcXVpcmUoXCIuL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZ1wiKTtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX3V0aWxzXCIpO1xuY29uc3QgdGV4dEVuY29kZXIgPSBuZXcgY3VzdG9tX3V0aWxzXzEuX1RleHRFbmNvZGVyKCk7XG5jb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBjdXN0b21fdXRpbHNfMS5fVGV4dERlY29kZXIoKTtcbmV4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNID0gMHgwMTAwMDAwMDtcbmV4cG9ydHMuVkVSU0lPTl9OT19DSEVDS1NVTSA9IDB4MDEwMDAwMDE7XG5leHBvcnRzLkRFRkFVTFRfTUFYX1BBWUxPQURfQllURVMgPSAyNTYgKiAxMDI0O1xudmFyIEFkYlN0YXRlO1xuKGZ1bmN0aW9uIChBZGJTdGF0ZSkge1xuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiRElTQ09OTkVDVEVEXCJdID0gMF0gPSBcIkRJU0NPTk5FQ1RFRFwiO1xuICAgIC8vIEF1dGhlbnRpY2F0aW9uIHN0ZXBzLCBzZWUgQWRiQ29ubmVjdGlvbk92ZXJXZWJVc2IncyBoYW5kbGVBdXRoZW50aWNhdGlvbigpLlxuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiQVVUSF9TVEFSVEVEXCJdID0gMV0gPSBcIkFVVEhfU1RBUlRFRFwiO1xuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiQVVUSF9XSVRIX1BSSVZBVEVcIl0gPSAyXSA9IFwiQVVUSF9XSVRIX1BSSVZBVEVcIjtcbiAgICBBZGJTdGF0ZVtBZGJTdGF0ZVtcIkFVVEhfV0lUSF9QVUJMSUNcIl0gPSAzXSA9IFwiQVVUSF9XSVRIX1BVQkxJQ1wiO1xuICAgIEFkYlN0YXRlW0FkYlN0YXRlW1wiQ09OTkVDVEVEXCJdID0gNF0gPSBcIkNPTk5FQ1RFRFwiO1xufSkoQWRiU3RhdGUgfHwgKGV4cG9ydHMuQWRiU3RhdGUgPSBBZGJTdGF0ZSA9IHt9KSk7XG52YXIgQXV0aENtZDtcbihmdW5jdGlvbiAoQXV0aENtZCkge1xuICAgIEF1dGhDbWRbQXV0aENtZFtcIlRPS0VOXCJdID0gMV0gPSBcIlRPS0VOXCI7XG4gICAgQXV0aENtZFtBdXRoQ21kW1wiU0lHTkFUVVJFXCJdID0gMl0gPSBcIlNJR05BVFVSRVwiO1xuICAgIEF1dGhDbWRbQXV0aENtZFtcIlJTQVBVQkxJQ0tFWVwiXSA9IDNdID0gXCJSU0FQVUJMSUNLRVlcIjtcbn0pKEF1dGhDbWQgfHwgKEF1dGhDbWQgPSB7fSkpO1xuZnVuY3Rpb24gZ2VuZXJhdGVDaGVja3N1bShkYXRhKSB7XG4gICAgbGV0IHJlcyA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmJ5dGVMZW5ndGg7IGkrKylcbiAgICAgICAgcmVzICs9IGRhdGFbaV07XG4gICAgcmV0dXJuIHJlcyAmIDB4RkZGRkZGRkY7XG59XG5jbGFzcyBBZGJDb25uZWN0aW9uT3ZlcldlYnVzYiBleHRlbmRzIGFkYl9jb25uZWN0aW9uX2ltcGxfMS5BZGJDb25uZWN0aW9uSW1wbCB7XG4gICAgLy8gV2UgdXNlIGEga2V5IHBhaXIgZm9yIGF1dGhlbnRpY2F0aW5nIHdpdGggdGhlIGRldmljZSwgd2hpY2ggd2UgZG8gaW5cbiAgICAvLyB0d28gd2F5czpcbiAgICAvLyAtIEZpcnN0bHksIHNpZ25pbmcgd2l0aCB0aGUgcHJpdmF0ZSBrZXkuXG4gICAgLy8gLSBTZWNvbmRseSwgc2VuZGluZyBvdmVyIHRoZSBwdWJsaWMga2V5IChhdCB3aGljaCBwb2ludCB0aGUgZGV2aWNlIGFza3MgdGhlXG4gICAgLy8gICB1c2VyIGZvciBwZXJtaXNzaW9ucykuXG4gICAgLy8gT25jZSB3ZSd2ZSBzZW50IHRoZSBwdWJsaWMga2V5LCBmb3IgZnV0dXJlIHJlY29yZGluZ3Mgd2Ugb25seSBuZWVkIHRvXG4gICAgLy8gc2lnbiB3aXRoIHRoZSBwcml2YXRlIGtleSwgc28gdGhlIHVzZXIgZG9lc24ndCBuZWVkIHRvIGdpdmUgcGVybWlzc2lvbnNcbiAgICAvLyBhZ2Fpbi5cbiAgICBjb25zdHJ1Y3RvcihkZXZpY2UsIGtleU1hbmFnZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBkZXZpY2U7XG4gICAgICAgIHRoaXMua2V5TWFuYWdlciA9IGtleU1hbmFnZXI7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5ESVNDT05ORUNURUQ7XG4gICAgICAgIHRoaXMuY29ubmVjdGluZ1N0cmVhbXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc3RyZWFtcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5tYXhQYXlsb2FkID0gZXhwb3J0cy5ERUZBVUxUX01BWF9QQVlMT0FEX0JZVEVTO1xuICAgICAgICB0aGlzLndyaXRlSW5Qcm9ncmVzcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLndyaXRlUXVldWUgPSBbXTtcbiAgICAgICAgLy8gRGV2aWNlcyBhZnRlciBEZWMgMjAxNyBkb24ndCB1c2UgY2hlY2tzdW0uIFRoaXMgd2lsbCBiZSBhdXRvLWRldGVjdGVkXG4gICAgICAgIC8vIGR1cmluZyB0aGUgY29ubmVjdGlvbi5cbiAgICAgICAgdGhpcy51c2VDaGVja3N1bSA9IHRydWU7XG4gICAgICAgIHRoaXMubGFzdFN0cmVhbUlkID0gMDtcbiAgICAgICAgdGhpcy51c2JSZWFkRW5kcG9pbnQgPSAtMTtcbiAgICAgICAgdGhpcy51c2JXcml0ZUVwRW5kcG9pbnQgPSAtMTtcbiAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBlbmRpbmdDb25uUHJvbWlzZXMgPSBbXTtcbiAgICB9XG4gICAgc2hlbGwoY21kKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW5TdHJlYW0oJ3NoZWxsOicgKyBjbWQpO1xuICAgIH1cbiAgICBjb25uZWN0U29ja2V0KHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub3BlblN0cmVhbShwYXRoKTtcbiAgICB9XG4gICAgYXN5bmMgY2FuQ29ubmVjdFdpdGhvdXRDb250ZW50aW9uKCkge1xuICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5vcGVuKCk7XG4gICAgICAgIGNvbnN0IHVzYkludGVyZmFjZU51bWJlciA9IGF3YWl0IHRoaXMuc2V0dXBVc2JJbnRlcmZhY2UoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLmNsYWltSW50ZXJmYWNlKHVzYkludGVyZmFjZU51bWJlcik7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5yZWxlYXNlSW50ZXJmYWNlKHVzYkludGVyZmFjZU51bWJlcik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIG9wZW5TdHJlYW0oZGVzdGluYXRpb24pIHtcbiAgICAgICAgY29uc3Qgc3RyZWFtSWQgPSArK3RoaXMubGFzdFN0cmVhbUlkO1xuICAgICAgICBjb25zdCBjb25uZWN0aW5nU3RyZWFtID0gKDAsIGRlZmVycmVkXzEuZGVmZXIpKCk7XG4gICAgICAgIHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuc2V0KHN0cmVhbUlkLCBjb25uZWN0aW5nU3RyZWFtKTtcbiAgICAgICAgLy8gV2UgY3JlYXRlIHRoZSBzdHJlYW0gYmVmb3JlIHRyeWluZyB0byBlc3RhYmxpc2ggdGhlIGNvbm5lY3Rpb24sIHNvXG4gICAgICAgIC8vIHRoYXQgaWYgd2UgZmFpbCB0byBjb25uZWN0LCB3ZSB3aWxsIHJlamVjdCB0aGUgY29ubmVjdGluZyBzdHJlYW0uXG4gICAgICAgIGF3YWl0IHRoaXMuZW5zdXJlQ29ubmVjdGlvbkVzdGFibGlzaGVkKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ09QRU4nLCBzdHJlYW1JZCwgMCwgZGVzdGluYXRpb24pO1xuICAgICAgICByZXR1cm4gY29ubmVjdGluZ1N0cmVhbTtcbiAgICB9XG4gICAgYXN5bmMgZW5zdXJlQ29ubmVjdGlvbkVzdGFibGlzaGVkKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuQ09OTkVDVEVEKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2Uub3BlbigpO1xuICAgICAgICAgICAgaWYgKCEoYXdhaXQgdGhpcy5jYW5Db25uZWN0V2l0aG91dENvbnRlbnRpb24oKSkpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRldmljZS5yZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdXNiSW50ZXJmYWNlTnVtYmVyID0gYXdhaXQgdGhpcy5zZXR1cFVzYkludGVyZmFjZSgpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5kZXZpY2UuY2xhaW1JbnRlcmZhY2UodXNiSW50ZXJmYWNlTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLnN0YXJ0QWRiQXV0aCgpO1xuICAgICAgICBpZiAoIXRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHRoaXMudXNiUmVjZWl2ZUxvb3AoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjb25uUHJvbWlzZSA9ICgwLCBkZWZlcnJlZF8xLmRlZmVyKSgpO1xuICAgICAgICB0aGlzLnBlbmRpbmdDb25uUHJvbWlzZXMucHVzaChjb25uUHJvbWlzZSk7XG4gICAgICAgIGF3YWl0IGNvbm5Qcm9taXNlO1xuICAgIH1cbiAgICBhc3luYyBzZXR1cFVzYkludGVyZmFjZSgpIHtcbiAgICAgICAgY29uc3QgaW50ZXJmYWNlQW5kRW5kcG9pbnQgPSAoMCwgcmVjb3JkaW5nX3V0aWxzXzEuZmluZEludGVyZmFjZUFuZEVuZHBvaW50KSh0aGlzLmRldmljZSk7XG4gICAgICAgIC8vIGBmaW5kSW50ZXJmYWNlQW5kRW5kcG9pbnRgIHdpbGwgYWx3YXlzIHJldHVybiBhIG5vbi1udWxsIHZhbHVlIGJlY2F1c2VcbiAgICAgICAgLy8gd2UgY2hlY2sgZm9yIHRoaXMgaW4gJ2FuZHJvaWRfd2VidXNiX3RhcmdldF9mYWN0b3J5Jy4gSWYgbm8gaW50ZXJmYWNlIGFuZFxuICAgICAgICAvLyBlbmRwb2ludHMgYXJlIGZvdW5kLCB3ZSBkbyBub3QgY3JlYXRlIGEgdGFyZ2V0LCBzbyB3ZSBjYW4gbm90IGNvbm5lY3QgdG9cbiAgICAgICAgLy8gaXQsIHNvIHdlIHdpbGwgbmV2ZXIgcmVhY2ggdGhpcyBsb2dpYy5cbiAgICAgICAgY29uc3QgeyBjb25maWd1cmF0aW9uVmFsdWUsIHVzYkludGVyZmFjZU51bWJlciwgZW5kcG9pbnRzIH0gPSAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoaW50ZXJmYWNlQW5kRW5kcG9pbnQpO1xuICAgICAgICB0aGlzLnVzYkludGVyZmFjZU51bWJlciA9IHVzYkludGVyZmFjZU51bWJlcjtcbiAgICAgICAgdGhpcy51c2JSZWFkRW5kcG9pbnQgPSB0aGlzLmZpbmRFbmRwb2ludE51bWJlcihlbmRwb2ludHMsICdpbicpO1xuICAgICAgICB0aGlzLnVzYldyaXRlRXBFbmRwb2ludCA9IHRoaXMuZmluZEVuZHBvaW50TnVtYmVyKGVuZHBvaW50cywgJ291dCcpO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHRoaXMudXNiUmVhZEVuZHBvaW50ID49IDAgJiYgdGhpcy51c2JXcml0ZUVwRW5kcG9pbnQgPj0gMCk7XG4gICAgICAgIGF3YWl0IHRoaXMuZGV2aWNlLnNlbGVjdENvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvblZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHVzYkludGVyZmFjZU51bWJlcjtcbiAgICB9XG4gICAgYXN5bmMgc3RyZWFtQ2xvc2Uoc3RyZWFtKSB7XG4gICAgICAgIGNvbnN0IG90aGVyU3RyZWFtc1F1ZXVlID0gdGhpcy53cml0ZVF1ZXVlLmZpbHRlcigocXVldWVFbGVtZW50KSA9PiBxdWV1ZUVsZW1lbnQubG9jYWxTdHJlYW1JZCAhPT0gc3RyZWFtLmxvY2FsU3RyZWFtSWQpO1xuICAgICAgICBjb25zdCBkcm9wcGVkUGFja2V0Q291bnQgPSB0aGlzLndyaXRlUXVldWUubGVuZ3RoIC0gb3RoZXJTdHJlYW1zUXVldWUubGVuZ3RoO1xuICAgICAgICBpZiAoZHJvcHBlZFBhY2tldENvdW50ID4gMCkge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgRHJvcHBpbmcgJHtkcm9wcGVkUGFja2V0Q291bnR9IHF1ZXVlZCBtZXNzYWdlcyBkdWUgdG8gc3RyZWFtIGNsb3NpbmcuYCk7XG4gICAgICAgICAgICB0aGlzLndyaXRlUXVldWUgPSBvdGhlclN0cmVhbXNRdWV1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0cmVhbXMuZGVsZXRlKHN0cmVhbSk7XG4gICAgICAgIGlmICh0aGlzLnN0cmVhbXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICAgICAgLy8gV2UgZGlzY29ubmVjdCBCRUZPUkUgY2FsbGluZyBgc2lnbmFsU3RyZWFtQ2xvc2VkYC4gT3RoZXJ3aXNlLCB0aGVyZSBjYW5cbiAgICAgICAgICAgIC8vIGJlIGEgcmFjZSBjb25kaXRpb246XG4gICAgICAgICAgICAvLyBTdHJlYW0gQTogc3RyZWFtQS5vblN0cmVhbUNsb3NlXG4gICAgICAgICAgICAvLyBTdHJlYW0gQjogZGV2aWNlLm9wZW5cbiAgICAgICAgICAgIC8vIFN0cmVhbSBBOiBkZXZpY2UucmVsZWFzZUludGVyZmFjZVxuICAgICAgICAgICAgLy8gU3RyZWFtIEI6IGRldmljZS50cmFuc2Zlck91dCAtPiBDUkFTSFxuICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNjb25uZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgc3RyZWFtLnNpZ25hbFN0cmVhbUNsb3NlZCgpO1xuICAgIH1cbiAgICBzdHJlYW1Xcml0ZShtc2csIHN0cmVhbSkge1xuICAgICAgICBjb25zdCByYXcgPSAoKDAsIG9iamVjdF91dGlsc18xLmlzU3RyaW5nKShtc2cpKSA/IHRleHRFbmNvZGVyLmVuY29kZShtc2cpIDogbXNnO1xuICAgICAgICBpZiAodGhpcy53cml0ZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIHRoaXMud3JpdGVRdWV1ZS5wdXNoKHsgbWVzc2FnZTogcmF3LCBsb2NhbFN0cmVhbUlkOiBzdHJlYW0ubG9jYWxTdHJlYW1JZCB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLndyaXRlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2VuZE1lc3NhZ2UoJ1dSVEUnLCBzdHJlYW0ubG9jYWxTdHJlYW1JZCwgc3RyZWFtLnJlbW90ZVN0cmVhbUlkLCByYXcpO1xuICAgIH1cbiAgICAvLyBXZSBkaXNjb25uZWN0IGluIDIgY2FzZXM6XG4gICAgLy8gMS4gV2hlbiB3ZSBjbG9zZSB0aGUgbGFzdCBzdHJlYW0gb2YgdGhlIGNvbm5lY3Rpb24uIFRoaXMgaXMgdG8gcHJldmVudCB0aGVcbiAgICAvLyBicm93c2VyIGhvbGRpbmcgb250byB0aGUgVVNCIGludGVyZmFjZSBhZnRlciBoYXZpbmcgZmluaXNoZWQgYSB0cmFjZVxuICAgIC8vIHJlY29yZGluZywgd2hpY2ggd291bGQgbWFrZSBpdCBpbXBvc3NpYmxlIHRvIHVzZSBcImFkYiBzaGVsbFwiIGZyb20gdGhlIHNhbWVcbiAgICAvLyBtYWNoaW5lIHVudGlsIHRoZSBicm93c2VyIGlzIGNsb3NlZC5cbiAgICAvLyAyLiBXaGVuIHdlIGdldCBhIFVTQiBkaXNjb25uZWN0IGV2ZW50LiBUaGlzIGhhcHBlbnMgZm9yIGluc3RhbmNlIHdoZW4gdGhlXG4gICAgLy8gZGV2aWNlIGlzIHVucGx1Z2dlZC5cbiAgICBhc3luYyBkaXNjb25uZWN0KGRpc2Nvbm5lY3RNZXNzYWdlKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSBBZGJTdGF0ZS5ESVNDT05ORUNURUQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDbGVhciB0aGUgcmVzb3VyY2VzIGluIGEgc3luY2hyb25vdXMgbWV0aG9kLCBiZWNhdXNlIHRoaXMgY2FuIGJlIHVzZWRcbiAgICAgICAgLy8gZm9yIGVycm9yIGhhbmRsaW5nIGNhbGxiYWNrcyBhcyB3ZWxsLlxuICAgICAgICB0aGlzLnJlYWNoRGlzY29ubmVjdFN0YXRlKGRpc2Nvbm5lY3RNZXNzYWdlKTtcbiAgICAgICAgLy8gV2UgaGF2ZSBhbHJlYWR5IGRpc2Nvbm5lY3RlZCBzbyB0aGVyZSBpcyBubyBuZWVkIHRvIHBhc3MgYSBjYWxsYmFja1xuICAgICAgICAvLyB3aGljaCBjbGVhcnMgcmVzb3VyY2VzIG9yIG5vdGlmaWVzIHRoZSB1c2VyIGludG8gJ3dyYXBSZWNvcmRpbmdFcnJvcicuXG4gICAgICAgIGF3YWl0ICgwLCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS53cmFwUmVjb3JkaW5nRXJyb3IpKHRoaXMuZGV2aWNlLnJlbGVhc2VJbnRlcmZhY2UoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMudXNiSW50ZXJmYWNlTnVtYmVyKSksICgpID0+IHsgfSk7XG4gICAgICAgIHRoaXMudXNiSW50ZXJmYWNlTnVtYmVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBUaGlzIGlzIGEgc3luY2hyb25vdXMgbWV0aG9kIHdoaWNoIGNsZWFycyBhbGwgcmVzb3VyY2VzLlxuICAgIC8vIEl0IGNhbiBiZSB1c2VkIGFzIGEgY2FsbGJhY2sgZm9yIGVycm9yIGhhbmRsaW5nLlxuICAgIHJlYWNoRGlzY29ubmVjdFN0YXRlKGRpc2Nvbm5lY3RNZXNzYWdlKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVsZXRlIHRoZSBzdHJlYW1zIEJFRk9SRSBjaGVja2luZyB0aGUgQWRiIHN0YXRlIGJlY2F1c2U6XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlIGNyZWF0ZSBzdHJlYW1zIGJlZm9yZSBjaGFuZ2luZyB0aGUgQWRiIHN0YXRlIGZyb20gRElTQ09OTkVDVEVELlxuICAgICAgICAvLyBJbiBjYXNlIHdlIGNhbiBub3QgY2xhaW0gdGhlIGRldmljZSwgd2Ugd2lsbCBjcmVhdGUgYSBzdHJlYW0sIGJ1dCBmYWlsXG4gICAgICAgIC8vIHRvIGNvbm5lY3QgdG8gdGhlIFdlYlVTQiBkZXZpY2Ugc28gdGhlIHN0YXRlIHdpbGwgcmVtYWluIERJU0NPTk5FQ1RFRC5cbiAgICAgICAgY29uc3Qgc3RyZWFtc1RvRGVsZXRlID0gdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5lbnRyaWVzKCk7XG4gICAgICAgIC8vIENsZWFyIHRoZSBzdHJlYW1zIGJlZm9yZSByZWplY3Rpbmcgc28gd2UgYXJlIG5vdCBjYXVnaHQgaW4gYSBsb29wIG9mXG4gICAgICAgIC8vIGhhbmRsaW5nIHByb21pc2UgcmVqZWN0aW9ucy5cbiAgICAgICAgdGhpcy5jb25uZWN0aW5nU3RyZWFtcy5jbGVhcigpO1xuICAgICAgICBmb3IgKGNvbnN0IFtpZCwgc3RyZWFtXSBvZiBzdHJlYW1zVG9EZWxldGUpIHtcbiAgICAgICAgICAgIHN0cmVhbS5yZWplY3QoYEZhaWxlZCB0byBvcGVuIHN0cmVhbSB3aXRoIGlkICR7aWR9IGJlY2F1c2UgYWRiIHdhcyBkaXNjb25uZWN0ZWQuYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkRJU0NPTk5FQ1RFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5ESVNDT05ORUNURUQ7XG4gICAgICAgIHRoaXMud3JpdGVJblByb2dyZXNzID0gZmFsc2U7XG4gICAgICAgIHRoaXMud3JpdGVRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLnN0cmVhbXMuZm9yRWFjaCgoc3RyZWFtKSA9PiBzdHJlYW0uY2xvc2UoKSk7XG4gICAgICAgIHRoaXMub25EaXNjb25uZWN0KGRpc2Nvbm5lY3RNZXNzYWdlKTtcbiAgICB9XG4gICAgYXN5bmMgc3RhcnRBZGJBdXRoKCkge1xuICAgICAgICBjb25zdCBWRVJTSU9OID0gdGhpcy51c2VDaGVja3N1bSA/IGV4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNIDogZXhwb3J0cy5WRVJTSU9OX05PX0NIRUNLU1VNO1xuICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuQVVUSF9TVEFSVEVEO1xuICAgICAgICBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKCdDTlhOJywgVkVSU0lPTiwgdGhpcy5tYXhQYXlsb2FkLCAnaG9zdDoxOlVzYkFEQicpO1xuICAgIH1cbiAgICBmaW5kRW5kcG9pbnROdW1iZXIoZW5kcG9pbnRzLCBkaXJlY3Rpb24sIHR5cGUgPSAnYnVsaycpIHtcbiAgICAgICAgY29uc3QgZXAgPSBlbmRwb2ludHMuZmluZCgoZXApID0+IGVwLnR5cGUgPT09IHR5cGUgJiYgZXAuZGlyZWN0aW9uID09PSBkaXJlY3Rpb24pO1xuICAgICAgICBpZiAoZXApXG4gICAgICAgICAgICByZXR1cm4gZXAuZW5kcG9pbnROdW1iZXI7XG4gICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihgQ2Fubm90IGZpbmQgJHtkaXJlY3Rpb259IGVuZHBvaW50YCk7XG4gICAgfVxuICAgIGFzeW5jIHVzYlJlY2VpdmVMb29wKCkge1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydEZhbHNlKSh0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nKTtcbiAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IHRydWU7XG4gICAgICAgIGZvciAoOyB0aGlzLnN0YXRlICE9PSBBZGJTdGF0ZS5ESVNDT05ORUNURUQ7KSB7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB0aGlzLndyYXBVc2IodGhpcy5kZXZpY2UudHJhbnNmZXJJbih0aGlzLnVzYlJlYWRFbmRwb2ludCwgQURCX01TR19TSVpFKSk7XG4gICAgICAgICAgICBpZiAoIXJlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNVc2JSZWNlaXZlTG9vcFJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1cyAhPT0gJ29rJykge1xuICAgICAgICAgICAgICAgIC8vIExvZyBhbmQgaWdub3JlIG1lc3NhZ2VzIHdpdGggaW52YWxpZCBzdGF0dXMuIFRoZXNlIGNhbiBvY2N1clxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGRldmljZSBpcyBjb25uZWN0ZWQvZGlzY29ubmVjdGVkIHJlcGVhdGVkbHkuXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgUmVjZWl2ZWQgbWVzc2FnZSB3aXRoIHVuZXhwZWN0ZWQgc3RhdHVzICcke3Jlcy5zdGF0dXN9J2ApO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbXNnID0gQWRiTXNnLmRlY29kZUhlYWRlcihyZXMuZGF0YSk7XG4gICAgICAgICAgICBpZiAobXNnLmRhdGFMZW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHRoaXMud3JhcFVzYih0aGlzLmRldmljZS50cmFuc2ZlckluKHRoaXMudXNiUmVhZEVuZHBvaW50LCBtc2cuZGF0YUxlbikpO1xuICAgICAgICAgICAgICAgIGlmICghcmVzcCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzVXNiUmVjZWl2ZUxvb3BSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbXNnLmRhdGEgPSBuZXcgVWludDhBcnJheShyZXNwLmRhdGEuYnVmZmVyLCByZXNwLmRhdGEuYnl0ZU9mZnNldCwgcmVzcC5kYXRhLmJ5dGVMZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMudXNlQ2hlY2tzdW0gJiYgZ2VuZXJhdGVDaGVja3N1bShtc2cuZGF0YSkgIT09IG1zZy5kYXRhQ2hlY2tzdW0pIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBpZ25vcmUgbWVzc2FnZXMgd2l0aCBhbiBpbnZhbGlkIGNoZWNrc3VtLiBUaGVzZSBzb21ldGltZXMgYXBwZWFyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgcGFnZSBpcyByZS1sb2FkZWQgaW4gYSBtaWRkbGUgb2YgYSByZWNvcmRpbmcuXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUaGUgc2VydmVyIGNhbiBzdGlsbCBzZW5kIG1lc3NhZ2VzIHN0cmVhbXMgZm9yIHByZXZpb3VzIHN0cmVhbXMuXG4gICAgICAgICAgICAvLyBUaGlzIGhhcHBlbnMgZm9yIGluc3RhbmNlIGlmIHdlIHJlY29yZCwgcmVsb2FkIHRoZSByZWNvcmRpbmcgcGFnZSBhbmRcbiAgICAgICAgICAgIC8vIHRoZW4gcmVjb3JkIGFnYWluLiBXZSBjYW4gYWxzbyByZWNlaXZlIGEgJ1dSVEUnIG9yICdPS0FZJyBhZnRlclxuICAgICAgICAgICAgLy8gd2UgaGF2ZSBzZW50IGEgJ0NMU0UnIGFuZCBtYXJrZWQgdGhlIHN0YXRlIGFzIGRpc2Nvbm5lY3RlZC5cbiAgICAgICAgICAgIGlmICgobXNnLmNtZCA9PT0gJ0NMU0UnIHx8IG1zZy5jbWQgPT09ICdXUlRFJykgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5nZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKG1zZy5hcmcxKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ09LQVknICYmICF0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmhhcyhtc2cuYXJnMSkgJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5nZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKG1zZy5hcmcxKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ0FVVEgnICYmIG1zZy5hcmcwID09PSBBdXRoQ21kLlRPS0VOICYmXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9PT0gQWRiU3RhdGUuQVVUSF9XSVRIX1BVQkxJQykge1xuICAgICAgICAgICAgICAgIC8vIElmIHdlIHN0YXJ0IGEgcmVjb3JkaW5nIGJ1dCBmYWlsIGJlY2F1c2Ugb2YgYSBmYXVsdHkgcGh5c2ljYWxcbiAgICAgICAgICAgICAgICAvLyBjb25uZWN0aW9uIHRvIHRoZSBkZXZpY2UsIHdoZW4gd2Ugc3RhcnQgYSBuZXcgcmVjb3JkaW5nLCB3ZSB3aWxsXG4gICAgICAgICAgICAgICAgLy8gcmVjZWl2ZWQgbXVsdGlwbGUgQVVUSCB0b2tlbnMsIG9mIHdoaWNoIHdlIHNob3VsZCBpZ25vcmUgYWxsIGJ1dFxuICAgICAgICAgICAgICAgIC8vIG9uZS5cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGhhbmRsZSB0aGUgQURCIG1lc3NhZ2UgZnJvbSB0aGUgZGV2aWNlXG4gICAgICAgICAgICBpZiAobXNnLmNtZCA9PT0gJ0NMU0UnKSB7XG4gICAgICAgICAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuZ2V0U3RyZWFtRm9yTG9jYWxTdHJlYW1JZChtc2cuYXJnMSkpLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChtc2cuY21kID09PSAnQVVUSCcgJiYgbXNnLmFyZzAgPT09IEF1dGhDbWQuVE9LRU4pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBhd2FpdCB0aGlzLmtleU1hbmFnZXIuZ2V0S2V5KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09IEFkYlN0YXRlLkFVVEhfU1RBUlRFRCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBEdXJpbmcgdGhpcyBzdGVwLCB3ZSBzZW5kIGJhY2sgdGhlIHRva2VuIHJlY2VpdmVkIHNpZ25lZCB3aXRoIG91clxuICAgICAgICAgICAgICAgICAgICAvLyBwcml2YXRlIGtleS4gSWYgdGhlIGRldmljZSBoYXMgcHJldmlvdXNseSByZWNlaXZlZCBvdXIgcHVibGljIGtleSxcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGRpYWxvZyBhc2tpbmcgZm9yIHVzZXIgY29uZmlybWF0aW9uIHdpbGwgbm90IGJlIGRpc3BsYXllZCBvblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZGV2aWNlLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuQVVUSF9XSVRIX1BSSVZBVEU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2UoJ0FVVEgnLCBBdXRoQ21kLlNJR05BVFVSRSwgMCwga2V5LnNpZ24obXNnLmRhdGEpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIG91ciBzaWduYXR1cmUgd2l0aCB0aGUgcHJpdmF0ZSBrZXkgaXMgbm90IGFjY2VwdGVkIGJ5IHRoZVxuICAgICAgICAgICAgICAgICAgICAvLyBkZXZpY2UsIHdlIGdlbmVyYXRlIGEgbmV3IGtleXBhaXIgYW5kIHNlbmQgdGhlIHB1YmxpYyBrZXkuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5BVVRIX1dJVEhfUFVCTElDO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKCdBVVRIJywgQXV0aENtZC5SU0FQVUJMSUNLRVksIDAsIGtleS5nZXRQdWJsaWNLZXkoKSArICdcXDAnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblN0YXR1cyhyZWNvcmRpbmdfdXRpbHNfMS5BTExPV19VU0JfREVCVUdHSU5HKTtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgKDAsIGFkYl9rZXlfbWFuYWdlcl8xLm1heWJlU3RvcmVLZXkpKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobXNnLmNtZCA9PT0gJ0NOWE4nKSB7XG4gICAgICAgICAgICAgICAgLy9hc3NlcnRUcnVlKFxuICAgICAgICAgICAgICAgIC8vICAgIFtBZGJTdGF0ZS5BVVRIX1dJVEhfUFJJVkFURSwgQWRiU3RhdGUuQVVUSF9XSVRIX1BVQkxJQ10uaW5jbHVkZXMoXG4gICAgICAgICAgICAgICAgLy8gICAgICAgIHRoaXMuc3RhdGUpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gQWRiU3RhdGUuQ09OTkVDVEVEO1xuICAgICAgICAgICAgICAgIHRoaXMubWF4UGF5bG9hZCA9IG1zZy5hcmcxO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRldmljZVZlcnNpb24gPSBtc2cuYXJnMDtcbiAgICAgICAgICAgICAgICBpZiAoIVtleHBvcnRzLlZFUlNJT05fV0lUSF9DSEVDS1NVTSwgZXhwb3J0cy5WRVJTSU9OX05PX0NIRUNLU1VNXS5pbmNsdWRlcyhkZXZpY2VWZXJzaW9uKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEuUmVjb3JkaW5nRXJyb3IoYFZlcnNpb24gJHttc2cuYXJnMH0gbm90IHN1cHBvcnRlZC5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy51c2VDaGVja3N1bSA9IGRldmljZVZlcnNpb24gPT09IGV4cG9ydHMuVkVSU0lPTl9XSVRIX0NIRUNLU1VNO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBBZGJTdGF0ZS5DT05ORUNURUQ7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyB3aWxsIHJlc29sdmUgdGhlIHByb21pc2VzIGF3YWl0ZWQgYnlcbiAgICAgICAgICAgICAgICAvLyBcImVuc3VyZUNvbm5lY3Rpb25Fc3RhYmxpc2hlZFwiLlxuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0Nvbm5Qcm9taXNlcy5mb3JFYWNoKChjb25uUHJvbWlzZSkgPT4gY29ublByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdDb25uUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdPS0FZJykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmhhcyhtc2cuYXJnMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29ubmVjdGluZ1N0cmVhbSA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmNvbm5lY3RpbmdTdHJlYW1zLmdldChtc2cuYXJnMSkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHJlYW0gPSBuZXcgQWRiT3ZlcldlYnVzYlN0cmVhbSh0aGlzLCBtc2cuYXJnMSwgbXNnLmFyZzApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmVhbXMuYWRkKHN0cmVhbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGluZ1N0cmVhbXMuZGVsZXRlKG1zZy5hcmcxKTtcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdGluZ1N0cmVhbS5yZXNvbHZlKHN0cmVhbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHRoaXMud3JpdGVJblByb2dyZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cml0ZUluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IHRoaXMud3JpdGVRdWV1ZS5sZW5ndGg7KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBnbyB0aHJvdWdoIHRoZSBxdWV1ZWQgd3JpdGVzIGFuZCBjaG9vc2UgdGhlIGZpcnN0IG9uZVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29ycmVzcG9uZGluZyB0byBhIHN0cmVhbSB0aGF0J3Mgc3RpbGwgYWN0aXZlLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcXVldWVkRWxlbWVudCA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLndyaXRlUXVldWUuc2hpZnQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBxdWV1ZWRTdHJlYW0gPSB0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQocXVldWVkRWxlbWVudC5sb2NhbFN0cmVhbUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZWRTdHJlYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWV1ZWRTdHJlYW0ud3JpdGUocXVldWVkRWxlbWVudC5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1zZy5jbWQgPT09ICdXUlRFJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmVhbSA9ICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmdldFN0cmVhbUZvckxvY2FsU3RyZWFtSWQobXNnLmFyZzEpKTtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKCdPS0FZJywgc3RyZWFtLmxvY2FsU3RyZWFtSWQsIHN0cmVhbS5yZW1vdGVTdHJlYW1JZCk7XG4gICAgICAgICAgICAgICAgc3RyZWFtLnNpZ25hbFN0cmVhbURhdGEobXNnLmRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihgVW5leHBlY3RlZCBtZXNzYWdlICR7bXNnfSBpbiBzdGF0ZSAke3RoaXMuc3RhdGV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc1VzYlJlY2VpdmVMb29wUnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICBnZXRTdHJlYW1Gb3JMb2NhbFN0cmVhbUlkKGxvY2FsU3RyZWFtSWQpIHtcbiAgICAgICAgZm9yIChjb25zdCBzdHJlYW0gb2YgdGhpcy5zdHJlYW1zKSB7XG4gICAgICAgICAgICBpZiAoc3RyZWFtLmxvY2FsU3RyZWFtSWQgPT09IGxvY2FsU3RyZWFtSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyZWFtO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vICBUaGUgaGVhZGVyIGFuZCB0aGUgbWVzc2FnZSBkYXRhIG11c3QgYmUgc2VudCBjb25zZWN1dGl2ZWx5LiBVc2luZyAyIGF3YWl0c1xuICAgIC8vICBBbm90aGVyIG1lc3NhZ2UgY2FuIGludGVybGVhdmUgYWZ0ZXIgdGhlIGZpcnN0IGhlYWRlciBoYXMgYmVlbiBzZW50LFxuICAgIC8vICByZXN1bHRpbmcgaW4gc29tZXRoaW5nIGxpa2UgW2hlYWRlcjFdIFtoZWFkZXIyXSBbZGF0YTFdIFtkYXRhMl07XG4gICAgLy8gIEluIHRoaXMgd2F5IHdlIGFyZSB3YWl0aW5nIGJvdGggcHJvbWlzZXMgdG8gYmUgcmVzb2x2ZWQgYmVmb3JlIGNvbnRpbnVpbmcuXG4gICAgYXN5bmMgc2VuZE1lc3NhZ2UoY21kLCBhcmcwLCBhcmcxLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IEFkYk1zZy5jcmVhdGUoeyBjbWQsIGFyZzAsIGFyZzEsIGRhdGEsIHVzZUNoZWNrc3VtOiB0aGlzLnVzZUNoZWNrc3VtIH0pO1xuICAgICAgICBjb25zdCBtc2dIZWFkZXIgPSBtc2cuZW5jb2RlSGVhZGVyKCk7XG4gICAgICAgIGNvbnN0IG1zZ0RhdGEgPSBtc2cuZGF0YTtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShtc2dIZWFkZXIubGVuZ3RoIDw9IHRoaXMubWF4UGF5bG9hZCAmJlxuICAgICAgICAgICAgbXNnRGF0YS5sZW5ndGggPD0gdGhpcy5tYXhQYXlsb2FkKTtcbiAgICAgICAgY29uc3Qgc2VuZFByb21pc2VzID0gW3RoaXMud3JhcFVzYih0aGlzLmRldmljZS50cmFuc2Zlck91dCh0aGlzLnVzYldyaXRlRXBFbmRwb2ludCwgbXNnSGVhZGVyLmJ1ZmZlcikpXTtcbiAgICAgICAgaWYgKG1zZy5kYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlcy5wdXNoKHRoaXMud3JhcFVzYih0aGlzLmRldmljZS50cmFuc2Zlck91dCh0aGlzLnVzYldyaXRlRXBFbmRwb2ludCwgbXNnRGF0YS5idWZmZXIpKSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoc2VuZFByb21pc2VzKTtcbiAgICB9XG4gICAgd3JhcFVzYihwcm9taXNlKSB7XG4gICAgICAgIHJldHVybiAoMCwgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEud3JhcFJlY29yZGluZ0Vycm9yKShwcm9taXNlLCB0aGlzLnJlYWNoRGlzY29ubmVjdFN0YXRlLmJpbmQodGhpcykpO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiQ29ubmVjdGlvbk92ZXJXZWJ1c2IgPSBBZGJDb25uZWN0aW9uT3ZlcldlYnVzYjtcbi8vIEFuIEFkYk92ZXJXZWJ1c2JTdHJlYW0gaXMgaW5zdGFudGlhdGVkIGFmdGVyIHRoZSBjcmVhdGlvbiBvZiBhIHNvY2tldCB0byB0aGVcbi8vIGRldmljZS4gVGhhbmtzIHRvIHRoaXMsIHdlIGNhbiBzZW5kIGNvbW1hbmRzIGFuZCByZWNlaXZlIHRoZWlyIG91dHB1dC5cbi8vIE1lc3NhZ2VzIGFyZSByZWNlaXZlZCBpbiB0aGUgbWFpbiBhZGIgY2xhc3MsIGFuZCBhcmUgZm9yd2FyZGVkIHRvIGFuIGluc3RhbmNlXG4vLyBvZiB0aGlzIGNsYXNzIGJhc2VkIG9uIGEgc3RyZWFtIGlkIG1hdGNoLlxuY2xhc3MgQWRiT3ZlcldlYnVzYlN0cmVhbSB7XG4gICAgY29uc3RydWN0b3IoYWRiLCBsb2NhbFN0cmVhbUlkLCByZW1vdGVTdHJlYW1JZCkge1xuICAgICAgICB0aGlzLm9uU3RyZWFtRGF0YUNhbGxiYWNrcyA9IFtdO1xuICAgICAgICB0aGlzLm9uU3RyZWFtQ2xvc2VDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5yZW1vdGVTdHJlYW1JZCA9IC0xO1xuICAgICAgICB0aGlzLmFkYkNvbm5lY3Rpb24gPSBhZGI7XG4gICAgICAgIHRoaXMubG9jYWxTdHJlYW1JZCA9IGxvY2FsU3RyZWFtSWQ7XG4gICAgICAgIHRoaXMucmVtb3RlU3RyZWFtSWQgPSByZW1vdGVTdHJlYW1JZDtcbiAgICAgICAgLy8gV2hlbiB0aGUgc3RyZWFtIGlzIGNyZWF0ZWQsIHRoZSBjb25uZWN0aW9uIGhhcyBiZWVuIGFscmVhZHkgZXN0YWJsaXNoZWQuXG4gICAgICAgIHRoaXMuX2lzQ29ubmVjdGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgYWRkT25TdHJlYW1EYXRhQ2FsbGJhY2sob25TdHJlYW1EYXRhKSB7XG4gICAgICAgIHRoaXMub25TdHJlYW1EYXRhQ2FsbGJhY2tzLnB1c2gob25TdHJlYW1EYXRhKTtcbiAgICB9XG4gICAgYWRkT25TdHJlYW1DbG9zZUNhbGxiYWNrKG9uU3RyZWFtQ2xvc2UpIHtcbiAgICAgICAgdGhpcy5vblN0cmVhbUNsb3NlQ2FsbGJhY2tzLnB1c2gob25TdHJlYW1DbG9zZSk7XG4gICAgfVxuICAgIC8vIFVzZWQgYnkgdGhlIGNvbm5lY3Rpb24gb2JqZWN0IHRvIHNpZ25hbCBuZXdseSByZWNlaXZlZCBkYXRhLCBub3QgZXhwb3NlZFxuICAgIC8vIGluIHRoZSBpbnRlcmZhY2UuXG4gICAgc2lnbmFsU3RyZWFtRGF0YShkYXRhKSB7XG4gICAgICAgIGZvciAoY29uc3Qgb25TdHJlYW1EYXRhIG9mIHRoaXMub25TdHJlYW1EYXRhQ2FsbGJhY2tzKSB7XG4gICAgICAgICAgICBvblN0cmVhbURhdGEoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gVXNlZCBieSB0aGUgY29ubmVjdGlvbiBvYmplY3QgdG8gc2lnbmFsIHRoZSBzdHJlYW0gaXMgY2xvc2VkLCBub3QgZXhwb3NlZFxuICAgIC8vIGluIHRoZSBpbnRlcmZhY2UuXG4gICAgc2lnbmFsU3RyZWFtQ2xvc2VkKCkge1xuICAgICAgICBmb3IgKGNvbnN0IG9uU3RyZWFtQ2xvc2Ugb2YgdGhpcy5vblN0cmVhbUNsb3NlQ2FsbGJhY2tzKSB7XG4gICAgICAgICAgICBvblN0cmVhbUNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vblN0cmVhbURhdGFDYWxsYmFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5vblN0cmVhbUNsb3NlQ2FsbGJhY2tzID0gW107XG4gICAgfVxuICAgIGNsb3NlKCkge1xuICAgICAgICB0aGlzLmNsb3NlQW5kV2FpdEZvclRlYXJkb3duKCk7XG4gICAgfVxuICAgIGFzeW5jIGNsb3NlQW5kV2FpdEZvclRlYXJkb3duKCkge1xuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICBhd2FpdCB0aGlzLmFkYkNvbm5lY3Rpb24uc3RyZWFtQ2xvc2UodGhpcyk7XG4gICAgfVxuICAgIHdyaXRlKG1zZykge1xuICAgICAgICB0aGlzLmFkYkNvbm5lY3Rpb24uc3RyZWFtV3JpdGUobXNnLCB0aGlzKTtcbiAgICB9XG4gICAgaXNDb25uZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Nvbm5lY3RlZDtcbiAgICB9XG59XG5leHBvcnRzLkFkYk92ZXJXZWJ1c2JTdHJlYW0gPSBBZGJPdmVyV2VidXNiU3RyZWFtO1xuY29uc3QgQURCX01TR19TSVpFID0gNiAqIDQ7IC8vIDYgKiBpbnQzMi5cbmNsYXNzIEFkYk1zZyB7XG4gICAgY29uc3RydWN0b3IoY21kLCBhcmcwLCBhcmcxLCBkYXRhTGVuLCBkYXRhQ2hlY2tzdW0sIHVzZUNoZWNrc3VtID0gZmFsc2UpIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShjbWQubGVuZ3RoID09PSA0KTtcbiAgICAgICAgdGhpcy5jbWQgPSBjbWQ7XG4gICAgICAgIHRoaXMuYXJnMCA9IGFyZzA7XG4gICAgICAgIHRoaXMuYXJnMSA9IGFyZzE7XG4gICAgICAgIHRoaXMuZGF0YUxlbiA9IGRhdGFMZW47XG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGFMZW4pO1xuICAgICAgICB0aGlzLmRhdGFDaGVja3N1bSA9IGRhdGFDaGVja3N1bTtcbiAgICAgICAgdGhpcy51c2VDaGVja3N1bSA9IHVzZUNoZWNrc3VtO1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlKHsgY21kLCBhcmcwLCBhcmcxLCBkYXRhLCB1c2VDaGVja3N1bSA9IHRydWUgfSkge1xuICAgICAgICBjb25zdCBlbmNvZGVkRGF0YSA9IHRoaXMuZW5jb2RlRGF0YShkYXRhKTtcbiAgICAgICAgY29uc3QgbXNnID0gbmV3IEFkYk1zZyhjbWQsIGFyZzAsIGFyZzEsIGVuY29kZWREYXRhLmxlbmd0aCwgMCwgdXNlQ2hlY2tzdW0pO1xuICAgICAgICBtc2cuZGF0YSA9IGVuY29kZWREYXRhO1xuICAgICAgICByZXR1cm4gbXNnO1xuICAgIH1cbiAgICBnZXQgZGF0YVN0cigpIHtcbiAgICAgICAgcmV0dXJuIHRleHREZWNvZGVyLmRlY29kZSh0aGlzLmRhdGEpO1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuY21kfSBbJHt0aGlzLmFyZzB9LCR7dGhpcy5hcmcxfV0gJHt0aGlzLmRhdGFTdHJ9YDtcbiAgICB9XG4gICAgLy8gQSBicmllZiBkZXNjcmlwdGlvbiBvZiB0aGUgbWVzc2FnZSBjYW4gYmUgZm91bmQgaGVyZTpcbiAgICAvLyBodHRwczovL2FuZHJvaWQuZ29vZ2xlc291cmNlLmNvbS9wbGF0Zm9ybS9zeXN0ZW0vY29yZS8rL21haW4vYWRiL3Byb3RvY29sLnR4dFxuICAgIC8vXG4gICAgLy8gc3RydWN0IGFtZXNzYWdlIHtcbiAgICAvLyAgICAgdWludDMyX3QgY29tbWFuZDsgICAgLy8gY29tbWFuZCBpZGVudGlmaWVyIGNvbnN0YW50XG4gICAgLy8gICAgIHVpbnQzMl90IGFyZzA7ICAgICAgIC8vIGZpcnN0IGFyZ3VtZW50XG4gICAgLy8gICAgIHVpbnQzMl90IGFyZzE7ICAgICAgIC8vIHNlY29uZCBhcmd1bWVudFxuICAgIC8vICAgICB1aW50MzJfdCBkYXRhX2xlbmd0aDsvLyBsZW5ndGggb2YgcGF5bG9hZCAoMCBpcyBhbGxvd2VkKVxuICAgIC8vICAgICB1aW50MzJfdCBkYXRhX2NoZWNrOyAvLyBjaGVja3N1bSBvZiBkYXRhIHBheWxvYWRcbiAgICAvLyAgICAgdWludDMyX3QgbWFnaWM7ICAgICAgLy8gY29tbWFuZCBeIDB4ZmZmZmZmZmZcbiAgICAvLyB9O1xuICAgIHN0YXRpYyBkZWNvZGVIZWFkZXIoZHYpIHtcbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRUcnVlKShkdi5ieXRlTGVuZ3RoID09PSBBREJfTVNHX1NJWkUpO1xuICAgICAgICBjb25zdCBjbWQgPSB0ZXh0RGVjb2Rlci5kZWNvZGUoZHYuYnVmZmVyLnNsaWNlKDAsIDQpKTtcbiAgICAgICAgY29uc3QgY21kTnVtID0gZHYuZ2V0VWludDMyKDAsIHRydWUpO1xuICAgICAgICBjb25zdCBhcmcwID0gZHYuZ2V0VWludDMyKDQsIHRydWUpO1xuICAgICAgICBjb25zdCBhcmcxID0gZHYuZ2V0VWludDMyKDgsIHRydWUpO1xuICAgICAgICBjb25zdCBkYXRhTGVuID0gZHYuZ2V0VWludDMyKDEyLCB0cnVlKTtcbiAgICAgICAgY29uc3QgZGF0YUNoZWNrc3VtID0gZHYuZ2V0VWludDMyKDE2LCB0cnVlKTtcbiAgICAgICAgY29uc3QgY21kQ2hlY2tzdW0gPSBkdi5nZXRVaW50MzIoMjAsIHRydWUpO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGNtZE51bSA9PT0gKGNtZENoZWNrc3VtIF4gMHhGRkZGRkZGRikpO1xuICAgICAgICByZXR1cm4gbmV3IEFkYk1zZyhjbWQsIGFyZzAsIGFyZzEsIGRhdGFMZW4sIGRhdGFDaGVja3N1bSk7XG4gICAgfVxuICAgIGVuY29kZUhlYWRlcigpIHtcbiAgICAgICAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkoQURCX01TR19TSVpFKTtcbiAgICAgICAgY29uc3QgZHYgPSBuZXcgRGF0YVZpZXcoYnVmLmJ1ZmZlcik7XG4gICAgICAgIGNvbnN0IGNtZEJ5dGVzID0gdGV4dEVuY29kZXIuZW5jb2RlKHRoaXMuY21kKTtcbiAgICAgICAgY29uc3QgcmF3TXNnID0gQWRiTXNnLmVuY29kZURhdGEodGhpcy5kYXRhKTtcbiAgICAgICAgY29uc3QgY2hlY2tzdW0gPSB0aGlzLnVzZUNoZWNrc3VtID8gZ2VuZXJhdGVDaGVja3N1bShyYXdNc2cpIDogMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspXG4gICAgICAgICAgICBkdi5zZXRVaW50OChpLCBjbWRCeXRlc1tpXSk7XG4gICAgICAgIGR2LnNldFVpbnQzMig0LCB0aGlzLmFyZzAsIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoOCwgdGhpcy5hcmcxLCB0cnVlKTtcbiAgICAgICAgZHYuc2V0VWludDMyKDEyLCByYXdNc2cuYnl0ZUxlbmd0aCwgdHJ1ZSk7XG4gICAgICAgIGR2LnNldFVpbnQzMigxNiwgY2hlY2tzdW0sIHRydWUpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMjAsIGR2LmdldFVpbnQzMigwLCB0cnVlKSBeIDB4RkZGRkZGRkYsIHRydWUpO1xuICAgICAgICByZXR1cm4gYnVmO1xuICAgIH1cbiAgICBzdGF0aWMgZW5jb2RlRGF0YShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoW10pO1xuICAgICAgICBpZiAoKDAsIG9iamVjdF91dGlsc18xLmlzU3RyaW5nKShkYXRhKSlcbiAgICAgICAgICAgIHJldHVybiB0ZXh0RW5jb2Rlci5lbmNvZGUoZGF0YSArICdcXDAnKTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFkYkZpbGVIYW5kbGVyID0gdm9pZCAwO1xuY29uc3QgY3VzdG9tX3V0aWxzXzEgPSByZXF1aXJlKFwiY3VzdG9tX3V0aWxzXCIpO1xuY29uc3QgZGVmZXJyZWRfMSA9IHJlcXVpcmUoXCIuLi8uLi9iYXNlL2RlZmVycmVkXCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uLy4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEgPSByZXF1aXJlKFwiLi4vYXJyYXlfYnVmZmVyX2J1aWxkZXJcIik7XG5jb25zdCByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMSA9IHJlcXVpcmUoXCIuL3JlY29yZGluZ19lcnJvcl9oYW5kbGluZ1wiKTtcbmNvbnN0IHJlY29yZGluZ191dGlsc18xID0gcmVxdWlyZShcIi4vcmVjb3JkaW5nX3V0aWxzXCIpO1xuLy8gaHR0cHM6Ly9jcy5hbmRyb2lkLmNvbS9hbmRyb2lkL3BsYXRmb3JtL3N1cGVycHJvamVjdC8rL21haW46cGFja2FnZXMvXG4vLyBtb2R1bGVzL2FkYi9maWxlX3N5bmNfcHJvdG9jb2wuaDtsPTE0NFxuY29uc3QgTUFYX1NZTkNfU0VORF9DSFVOS19TSVpFID0gNjQgKiAxMDI0O1xuLy8gQWRiIGRvZXMgbm90IGFjY3VyYXRlbHkgc2VuZCBzb21lIGZpbGUgcGVybWlzc2lvbnMuIElmIHlvdSBuZWVkIGEgc3BlY2lhbCBzZXRcbi8vIG9mIHBlcm1pc3Npb25zLCBkbyBub3QgcmVseSBvbiB0aGlzIHZhbHVlLiBSYXRoZXIsIHNlbmQgYSBzaGVsbCBjb21tYW5kIHdoaWNoXG4vLyBleHBsaWNpdGx5IHNldHMgcGVybWlzc2lvbnMsIHN1Y2ggYXM6XG4vLyAnc2hlbGw6Y2htb2QgJHtwZXJtaXNzaW9uc30gJHtwYXRofSdcbmNvbnN0IEZJTEVfUEVSTUlTU0lPTlMgPSAyICoqIDE1ICsgMG82NDQ7XG5jb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBjdXN0b21fdXRpbHNfMS5fVGV4dERlY29kZXIoKTtcbi8vIEZvciBkZXRhaWxzIGFib3V0IHRoZSBwcm90b2NvbCwgc2VlOlxuLy8gaHR0cHM6Ly9jcy5hbmRyb2lkLmNvbS9hbmRyb2lkL3BsYXRmb3JtL3N1cGVycHJvamVjdC8rL21haW46cGFja2FnZXMvbW9kdWxlcy9hZGIvU1lOQy5UWFRcbmNsYXNzIEFkYkZpbGVIYW5kbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihieXRlU3RyZWFtKSB7XG4gICAgICAgIHRoaXMuYnl0ZVN0cmVhbSA9IGJ5dGVTdHJlYW07XG4gICAgICAgIHRoaXMuc2VudEJ5dGVDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuaXNQdXNoT25nb2luZyA9IGZhbHNlO1xuICAgIH1cbiAgICBhc3luYyBwdXNoQmluYXJ5KGJpbmFyeSwgcGF0aCkge1xuICAgICAgICAvLyBGb3IgYSBnaXZlbiBieXRlU3RyZWFtLCB3ZSBvbmx5IHN1cHBvcnQgcHVzaGluZyBvbmUgYmluYXJ5IGF0IGEgdGltZS5cbiAgICAgICAgKDAsIGxvZ2dpbmdfMS5hc3NlcnRGYWxzZSkodGhpcy5pc1B1c2hPbmdvaW5nKTtcbiAgICAgICAgdGhpcy5pc1B1c2hPbmdvaW5nID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgdHJhbnNmZXJGaW5pc2hlZCA9ICgwLCBkZWZlcnJlZF8xLmRlZmVyKSgpO1xuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0uYWRkT25TdHJlYW1EYXRhQ2FsbGJhY2soKGRhdGEpID0+IHRoaXMub25TdHJlYW1EYXRhKGRhdGEsIHRyYW5zZmVyRmluaXNoZWQpKTtcbiAgICAgICAgdGhpcy5ieXRlU3RyZWFtLmFkZE9uU3RyZWFtQ2xvc2VDYWxsYmFjaygoKSA9PiB0aGlzLmlzUHVzaE9uZ29pbmcgPSBmYWxzZSk7XG4gICAgICAgIGNvbnN0IHNlbmRNZXNzYWdlID0gbmV3IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEuQXJyYXlCdWZmZXJCdWlsZGVyKCk7XG4gICAgICAgIC8vICdTRU5EJyBpcyB0aGUgQVBJIG1ldGhvZCB1c2VkIHRvIHNlbmQgYSBmaWxlIHRvIGRldmljZS5cbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKCdTRU5EJyk7XG4gICAgICAgIC8vIFRoZSByZW1vdGUgZmlsZSBuYW1lIGlzIHNwbGl0IGludG8gdHdvIHBhcnRzIHNlcGFyYXRlZCBieSB0aGUgbGFzdFxuICAgICAgICAvLyBjb21tYSAoXCIsXCIpLiBUaGUgZmlyc3QgcGFydCBpcyB0aGUgYWN0dWFsIHBhdGgsIHdoaWxlIHRoZSBzZWNvbmQgaXMgYVxuICAgICAgICAvLyBkZWNpbWFsIGVuY29kZWQgZmlsZSBtb2RlIGNvbnRhaW5pbmcgdGhlIHBlcm1pc3Npb25zIG9mIHRoZSBmaWxlIG9uXG4gICAgICAgIC8vIGRldmljZS5cbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKHBhdGgubGVuZ3RoICsgNik7XG4gICAgICAgIHNlbmRNZXNzYWdlLmFwcGVuZChwYXRoKTtcbiAgICAgICAgc2VuZE1lc3NhZ2UuYXBwZW5kKCcsJyk7XG4gICAgICAgIHNlbmRNZXNzYWdlLmFwcGVuZChGSUxFX1BFUk1JU1NJT05TLnRvU3RyaW5nKCkpO1xuICAgICAgICB0aGlzLmJ5dGVTdHJlYW0ud3JpdGUobmV3IFVpbnQ4QXJyYXkoc2VuZE1lc3NhZ2UudG9BcnJheUJ1ZmZlcigpKSk7XG4gICAgICAgIHdoaWxlICghKGF3YWl0IHRoaXMuc2VuZE5leHREYXRhQ2h1bmsoYmluYXJ5KSkpXG4gICAgICAgICAgICA7XG4gICAgICAgIHJldHVybiB0cmFuc2ZlckZpbmlzaGVkO1xuICAgIH1cbiAgICBvblN0cmVhbURhdGEoZGF0YSwgdHJhbnNmZXJGaW5pc2hlZCkge1xuICAgICAgICB0aGlzLnNlbnRCeXRlQ291bnQgPSAwO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IHRleHREZWNvZGVyLmRlY29kZShkYXRhKTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnNwbGl0KCdcXG4nKVswXS5pbmNsdWRlcygnRkFJTCcpKSB7XG4gICAgICAgICAgICAvLyBTYW1wbGUgZmFpbHVyZSByZXNwb25zZSAod2hlbiB0aGUgZmlsZSBpcyB0cmFuc2ZlcnJlZCBzdWNjZXNzZnVsbHlcbiAgICAgICAgICAgIC8vIGJ1dCB0aGUgZGF0ZSBpcyBub3QgZm9ybWF0dGVkIGNvcnJlY3RseSk6XG4gICAgICAgICAgICAvLyAnT0tBWUZBSUxcXG5wYXRoIHRvbyBsb25nJ1xuICAgICAgICAgICAgdHJhbnNmZXJGaW5pc2hlZC5yZWplY3QobmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGAke3JlY29yZGluZ191dGlsc18xLkJJTkFSWV9QVVNIX0ZBSUxVUkV9OiAke3Jlc3BvbnNlfWApKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0ZXh0RGVjb2Rlci5kZWNvZGUoZGF0YSkuc3Vic3RyaW5nKDAsIDQpID09PSAnT0tBWScpIHtcbiAgICAgICAgICAgIC8vIEluIGNhc2Ugb2Ygc3VjY2VzcywgdGhlIHNlcnZlciByZXNwb25kcyB0byB0aGUgbGFzdCByZXF1ZXN0IHdpdGhcbiAgICAgICAgICAgIC8vICdPS0FZJy5cbiAgICAgICAgICAgIHRyYW5zZmVyRmluaXNoZWQucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKGAke3JlY29yZGluZ191dGlsc18xLkJJTkFSWV9QVVNIX1VOS05PV05fUkVTUE9OU0V9OiAke3Jlc3BvbnNlfWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIHNlbmROZXh0RGF0YUNodW5rKGJpbmFyeSkge1xuICAgICAgICBjb25zdCBlbmRQb3NpdGlvbiA9IE1hdGgubWluKHRoaXMuc2VudEJ5dGVDb3VudCArIE1BWF9TWU5DX1NFTkRfQ0hVTktfU0laRSwgYmluYXJ5LmJ5dGVMZW5ndGgpO1xuICAgICAgICBjb25zdCBjaHVuayA9IGF3YWl0IGJpbmFyeS5zbGljZSh0aGlzLnNlbnRCeXRlQ291bnQsIGVuZFBvc2l0aW9uKTtcbiAgICAgICAgLy8gVGhlIGZpbGUgaXMgc2VudCBpbiBjaHVua3MuIEVhY2ggY2h1bmsgaXMgcHJlZml4ZWQgd2l0aCBcIkRBVEFcIiBhbmQgdGhlXG4gICAgICAgIC8vIGNodW5rIGxlbmd0aC4gVGhpcyBpcyByZXBlYXRlZCB1bnRpbCB0aGUgZW50aXJlIGZpbGUgaXMgdHJhbnNmZXJyZWQuIEVhY2hcbiAgICAgICAgLy8gY2h1bmsgbXVzdCBub3QgYmUgbGFyZ2VyIHRoYW4gNjRrLlxuICAgICAgICBjb25zdCBjaHVua0xlbmd0aCA9IGNodW5rLmJ5dGVMZW5ndGg7XG4gICAgICAgIGNvbnN0IGRhdGFNZXNzYWdlID0gbmV3IGFycmF5X2J1ZmZlcl9idWlsZGVyXzEuQXJyYXlCdWZmZXJCdWlsZGVyKCk7XG4gICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZCgnREFUQScpO1xuICAgICAgICBkYXRhTWVzc2FnZS5hcHBlbmQoY2h1bmtMZW5ndGgpO1xuICAgICAgICBkYXRhTWVzc2FnZS5hcHBlbmQobmV3IFVpbnQ4QXJyYXkoY2h1bmsuYnVmZmVyLCBjaHVuay5ieXRlT2Zmc2V0LCBjaHVua0xlbmd0aCkpO1xuICAgICAgICB0aGlzLnNlbnRCeXRlQ291bnQgKz0gY2h1bmtMZW5ndGg7XG4gICAgICAgIGNvbnN0IGlzRG9uZSA9IHRoaXMuc2VudEJ5dGVDb3VudCA9PT0gYmluYXJ5LmJ5dGVMZW5ndGg7XG4gICAgICAgIGlmIChpc0RvbmUpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gdGhlIGZpbGUgaXMgdHJhbnNmZXJyZWQgYSBzeW5jIHJlcXVlc3QgXCJET05FXCIgaXMgc2VudCwgdG9nZXRoZXJcbiAgICAgICAgICAgIC8vIHdpdGggYSB0aW1lc3RhbXAsIHJlcHJlc2VudGluZyB0aGUgbGFzdCBtb2RpZmllZCB0aW1lIGZvciB0aGUgZmlsZS4gVGhlXG4gICAgICAgICAgICAvLyBzZXJ2ZXIgcmVzcG9uZHMgdG8gdGhpcyBsYXN0IHJlcXVlc3QuXG4gICAgICAgICAgICBkYXRhTWVzc2FnZS5hcHBlbmQoJ0RPTkUnKTtcbiAgICAgICAgICAgIC8vIFdlIHNlbmQgdGhlIGRhdGUgaW4gc2Vjb25kcy5cbiAgICAgICAgICAgIGRhdGFNZXNzYWdlLmFwcGVuZChNYXRoLmZsb29yKERhdGUubm93KCkgLyAxMDAwKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ieXRlU3RyZWFtLndyaXRlKG5ldyBVaW50OEFycmF5KGRhdGFNZXNzYWdlLnRvQXJyYXlCdWZmZXIoKSkpO1xuICAgICAgICByZXR1cm4gaXNEb25lO1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiRmlsZUhhbmRsZXIgPSBBZGJGaWxlSGFuZGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BZGJLZXkgPSB2b2lkIDA7XG5jb25zdCBqc2JuX3JzYV8xID0gcmVxdWlyZShcImpzYm4tcnNhXCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IHN0cmluZ191dGlsc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2Jhc2Uvc3RyaW5nX3V0aWxzXCIpO1xuY29uc3QgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEgPSByZXF1aXJlKFwiLi4vcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXCIpO1xuY29uc3QgV09SRF9TSVpFID0gNDtcbmNvbnN0IE1PRFVMVVNfU0laRV9CSVRTID0gMjA0ODtcbmNvbnN0IE1PRFVMVVNfU0laRSA9IE1PRFVMVVNfU0laRV9CSVRTIC8gODtcbmNvbnN0IE1PRFVMVVNfU0laRV9XT1JEUyA9IE1PRFVMVVNfU0laRSAvIFdPUkRfU0laRTtcbmNvbnN0IFBVQktFWV9FTkNPREVEX1NJWkUgPSAzICogV09SRF9TSVpFICsgMiAqIE1PRFVMVVNfU0laRTtcbmNvbnN0IEFEQl9XRUJfQ1JZUFRPX0FMR09SSVRITSA9IHtcbiAgICBuYW1lOiAnUlNBU1NBLVBLQ1MxLXYxXzUnLFxuICAgIGhhc2g6IHsgbmFtZTogJ1NIQS0xJyB9LFxuICAgIHB1YmxpY0V4cG9uZW50OiBuZXcgVWludDhBcnJheShbMHgwMSwgMHgwMCwgMHgwMV0pLCAvLyA2NTUzN1xuICAgIG1vZHVsdXNMZW5ndGg6IE1PRFVMVVNfU0laRV9CSVRTLFxufTtcbmNvbnN0IEFEQl9XRUJfQ1JZUFRPX0VYUE9SVEFCTEUgPSB0cnVlO1xuY29uc3QgQURCX1dFQl9DUllQVE9fT1BFUkFUSU9OUyA9IFsnc2lnbiddO1xuY29uc3QgU0lHTklOR19BU04xX1BSRUZJWCA9IFtcbiAgICAweDAwLFxuICAgIDB4MzAsXG4gICAgMHgyMSxcbiAgICAweDMwLFxuICAgIDB4MDksXG4gICAgMHgwNixcbiAgICAweDA1LFxuICAgIDB4MkIsXG4gICAgMHgwRSxcbiAgICAweDAzLFxuICAgIDB4MDIsXG4gICAgMHgxQSxcbiAgICAweDA1LFxuICAgIDB4MDAsXG4gICAgMHgwNCxcbiAgICAweDE0LFxuXTtcbmNvbnN0IFIzMiA9IGpzYm5fcnNhXzEuQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KDMyKTsgLy8gMSA8PCAzMlxuZnVuY3Rpb24gaXNWYWxpZEpzb25XZWJLZXkoa2V5KSB7XG4gICAgcmV0dXJuIGtleS5uICE9PSB1bmRlZmluZWQgJiYga2V5LmUgIT09IHVuZGVmaW5lZCAmJiBrZXkuZCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIGtleS5wICE9PSB1bmRlZmluZWQgJiYga2V5LnEgIT09IHVuZGVmaW5lZCAmJiBrZXkuZHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBrZXkuZHEgIT09IHVuZGVmaW5lZCAmJiBrZXkucWkgIT09IHVuZGVmaW5lZDtcbn1cbi8vIENvbnZlcnQgYSBCaWdJbnRlZ2VyIHRvIGFuIGFycmF5IG9mIGEgc3BlY2lmaWVkIHNpemUgaW4gYnl0ZXMuXG5mdW5jdGlvbiBiaWdJbnRUb0ZpeGVkQnl0ZUFycmF5KGJuLCBzaXplKSB7XG4gICAgY29uc3QgcGFkZGVkQm5CeXRlcyA9IGJuLnRvQnl0ZUFycmF5KCk7XG4gICAgbGV0IGZpcnN0Tm9uWmVyb0luZGV4ID0gMDtcbiAgICB3aGlsZSAoZmlyc3ROb25aZXJvSW5kZXggPCBwYWRkZWRCbkJ5dGVzLmxlbmd0aCAmJlxuICAgICAgICBwYWRkZWRCbkJ5dGVzW2ZpcnN0Tm9uWmVyb0luZGV4XSA9PT0gMCkge1xuICAgICAgICBmaXJzdE5vblplcm9JbmRleCsrO1xuICAgIH1cbiAgICBjb25zdCBibkJ5dGVzID0gVWludDhBcnJheS5mcm9tKHBhZGRlZEJuQnl0ZXMuc2xpY2UoZmlyc3ROb25aZXJvSW5kZXgpKTtcbiAgICBjb25zdCByZXMgPSBuZXcgVWludDhBcnJheShzaXplKTtcbiAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKGJuQnl0ZXMubGVuZ3RoIDw9IHJlcy5sZW5ndGgpO1xuICAgIHJlcy5zZXQoYm5CeXRlcywgcmVzLmxlbmd0aCAtIGJuQnl0ZXMubGVuZ3RoKTtcbiAgICByZXR1cm4gcmVzO1xufVxuY2xhc3MgQWRiS2V5IHtcbiAgICBjb25zdHJ1Y3Rvcihqd2tQcml2YXRlKSB7XG4gICAgICAgIHRoaXMuandrUHJpdmF0ZSA9IGp3a1ByaXZhdGU7XG4gICAgfVxuICAgIHN0YXRpYyBhc3luYyBHZW5lcmF0ZU5ld0tleVBhaXIoKSB7XG4gICAgICAgIC8vIENvbnN0cnVjdCBhIG5ldyBDcnlwdG9LZXlQYWlyIGFuZCBrZWVwIGl0cyBwcml2YXRlIGtleSBpbiBKV0IgZm9ybWF0LlxuICAgICAgICBjb25zdCBrZXlQYWlyID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5nZW5lcmF0ZUtleShBREJfV0VCX0NSWVBUT19BTEdPUklUSE0sIEFEQl9XRUJfQ1JZUFRPX0VYUE9SVEFCTEUsIEFEQl9XRUJfQ1JZUFRPX09QRVJBVElPTlMpO1xuICAgICAgICBjb25zdCBqd2tQcml2YXRlID0gYXdhaXQgY3J5cHRvLnN1YnRsZS5leHBvcnRLZXkoJ2p3aycsIGtleVBhaXIucHJpdmF0ZUtleSk7XG4gICAgICAgIGlmICghaXNWYWxpZEpzb25XZWJLZXkoandrUHJpdmF0ZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcignQ291bGQgbm90IGdlbmVyYXRlIGEgdmFsaWQgcHJpdmF0ZSBrZXkuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBZGJLZXkoandrUHJpdmF0ZSk7XG4gICAgfVxuICAgIHN0YXRpYyBEZXNlcmlhbGl6ZUtleShzZXJpYWxpemVkS2V5KSB7XG4gICAgICAgIHJldHVybiBuZXcgQWRiS2V5KEpTT04ucGFyc2Uoc2VyaWFsaXplZEtleSkpO1xuICAgIH1cbiAgICAvLyBQZXJmb3JtIGFuIFJTQSBzaWduaW5nIG9wZXJhdGlvbiBmb3IgdGhlIEFEQiBhdXRoIGNoYWxsZW5nZS5cbiAgICAvL1xuICAgIC8vIEZvciB0aGUgUlNBIHNpZ25hdHVyZSwgdGhlIHRva2VuIGlzIGV4cGVjdGVkIHRvIGhhdmUgYWxyZWFkeVxuICAgIC8vIGhhZCB0aGUgU0hBLTEgbWVzc2FnZSBkaWdlc3QgYXBwbGllZC5cbiAgICAvL1xuICAgIC8vIEhvd2V2ZXIsIHRoZSBhZGIgdG9rZW4gd2UgcmVjZWl2ZSBmcm9tIHRoZSBkZXZpY2UgaXMgbWFkZSB1cCBvZiAyMCByYW5kb21seVxuICAgIC8vIGdlbmVyYXRlZCBieXRlcyB0aGF0IGFyZSB0cmVhdGVkIGxpa2UgYSBTSEEtMS4gVGhlcmVmb3JlLCB3ZSBuZWVkIHRvIHVwZGF0ZVxuICAgIC8vIHRoZSBtZXNzYWdlIGZvcm1hdC5cbiAgICBzaWduKHRva2VuKSB7XG4gICAgICAgIGNvbnN0IHJzYUtleSA9IG5ldyBqc2JuX3JzYV8xLlJTQUtleSgpO1xuICAgICAgICByc2FLZXkuc2V0UHJpdmF0ZUV4KCgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5uKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5lKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5kKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5wKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5xKSksICgwLCBzdHJpbmdfdXRpbHNfMS5oZXhFbmNvZGUpKCgwLCBzdHJpbmdfdXRpbHNfMS5iYXNlNjREZWNvZGUpKHRoaXMuandrUHJpdmF0ZS5kcCkpLCAoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSh0aGlzLmp3a1ByaXZhdGUuZHEpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkodGhpcy5qd2tQcml2YXRlLnFpKSkpO1xuICAgICAgICAoMCwgbG9nZ2luZ18xLmFzc2VydFRydWUpKHJzYUtleS5uLmJpdExlbmd0aCgpID09PSBNT0RVTFVTX1NJWkVfQklUUyk7XG4gICAgICAgIC8vIE1lc3NhZ2UgTGF5b3V0IChzaXplIGVxdWFscyB0aGF0IG9mIHRoZSBrZXkgbW9kdWx1cyk6XG4gICAgICAgIC8vIDAwIDAxIEZGIEZGIEZGIEZGIC4uLiBGRiBbQVNOLjEgUFJFRklYXSBbVE9LRU5dXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBuZXcgVWludDhBcnJheShNT0RVTFVTX1NJWkUpO1xuICAgICAgICAvLyBJbml0aWFsbHkgZmlsbCB0aGUgYnVmZmVyIHdpdGggdGhlIHBhZGRpbmdcbiAgICAgICAgbWVzc2FnZS5maWxsKDB4RkYpO1xuICAgICAgICAvLyBhZGQgcHJlZml4XG4gICAgICAgIG1lc3NhZ2VbMF0gPSAweDAwO1xuICAgICAgICBtZXNzYWdlWzFdID0gMHgwMTtcbiAgICAgICAgLy8gYWRkIHRoZSBBU04uMSBwcmVmaXhcbiAgICAgICAgbWVzc2FnZS5zZXQoU0lHTklOR19BU04xX1BSRUZJWCwgbWVzc2FnZS5sZW5ndGggLSBTSUdOSU5HX0FTTjFfUFJFRklYLmxlbmd0aCAtIHRva2VuLmxlbmd0aCk7XG4gICAgICAgIC8vIHRoZW4gdGhlIGFjdHVhbCB0b2tlbiBhdCB0aGUgZW5kXG4gICAgICAgIG1lc3NhZ2Uuc2V0KHRva2VuLCBtZXNzYWdlLmxlbmd0aCAtIHRva2VuLmxlbmd0aCk7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VJbnRlZ2VyID0gbmV3IGpzYm5fcnNhXzEuQmlnSW50ZWdlcihBcnJheS5mcm9tKG1lc3NhZ2UpKTtcbiAgICAgICAgY29uc3Qgc2lnbmF0dXJlID0gcnNhS2V5LmRvUHJpdmF0ZShtZXNzYWdlSW50ZWdlcik7XG4gICAgICAgIHJldHVybiBuZXcgVWludDhBcnJheShiaWdJbnRUb0ZpeGVkQnl0ZUFycmF5KHNpZ25hdHVyZSwgTU9EVUxVU19TSVpFKSk7XG4gICAgfVxuICAgIC8vIENvbnN0cnVjdCBwdWJsaWMga2V5IHRvIG1hdGNoIHRoZSBhZGIgZm9ybWF0OlxuICAgIC8vIGdvL2NvZGVzZWFyY2gvcnZjLWFyYy9zeXN0ZW0vY29yZS9saWJjcnlwdG9fdXRpbHMvYW5kcm9pZF9wdWJrZXkuYztsPTM4LTUzXG4gICAgZ2V0UHVibGljS2V5KCkge1xuICAgICAgICBjb25zdCByc2FLZXkgPSBuZXcganNibl9yc2FfMS5SU0FLZXkoKTtcbiAgICAgICAgcnNhS2V5LnNldFB1YmxpYygoMCwgc3RyaW5nX3V0aWxzXzEuaGV4RW5jb2RlKSgoMCwgc3RyaW5nX3V0aWxzXzEuYmFzZTY0RGVjb2RlKSgoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKHRoaXMuandrUHJpdmF0ZS5uKSkpKSwgKDAsIHN0cmluZ191dGlsc18xLmhleEVuY29kZSkoKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NERlY29kZSkoKCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmp3a1ByaXZhdGUuZSkpKSkpO1xuICAgICAgICBjb25zdCBuMGludiA9IFIzMi5zdWJ0cmFjdChyc2FLZXkubi5tb2RJbnZlcnNlKFIzMikpLmludFZhbHVlKCk7XG4gICAgICAgIGNvbnN0IHIgPSBqc2JuX3JzYV8xLkJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdCgxKS5wb3coTU9EVUxVU19TSVpFX0JJVFMpO1xuICAgICAgICBjb25zdCByciA9IHIubXVsdGlwbHkocikubW9kKHJzYUtleS5uKTtcbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKFBVQktFWV9FTkNPREVEX1NJWkUpO1xuICAgICAgICBjb25zdCBkdiA9IG5ldyBEYXRhVmlldyhidWZmZXIpO1xuICAgICAgICBkdi5zZXRVaW50MzIoMCwgTU9EVUxVU19TSVpFX1dPUkRTLCB0cnVlKTtcbiAgICAgICAgZHYuc2V0VWludDMyKFdPUkRfU0laRSwgbjBpbnYsIHRydWUpO1xuICAgICAgICBjb25zdCBkdlU4ID0gbmV3IFVpbnQ4QXJyYXkoZHYuYnVmZmVyLCBkdi5ieXRlT2Zmc2V0LCBkdi5ieXRlTGVuZ3RoKTtcbiAgICAgICAgZHZVOC5zZXQoYmlnSW50VG9GaXhlZEJ5dGVBcnJheShyc2FLZXkubiwgTU9EVUxVU19TSVpFKS5yZXZlcnNlKCksIDIgKiBXT1JEX1NJWkUpO1xuICAgICAgICBkdlU4LnNldChiaWdJbnRUb0ZpeGVkQnl0ZUFycmF5KHJyLCBNT0RVTFVTX1NJWkUpLnJldmVyc2UoKSwgMiAqIFdPUkRfU0laRSArIE1PRFVMVVNfU0laRSk7XG4gICAgICAgIGR2LnNldFVpbnQzMigyICogV09SRF9TSVpFICsgMiAqIE1PRFVMVVNfU0laRSwgcnNhS2V5LmUsIHRydWUpO1xuICAgICAgICByZXR1cm4gKDAsIHN0cmluZ191dGlsc18xLmJhc2U2NEVuY29kZSkoZHZVOCkgKyAnIHVpLnBlcmZldHRvLmRldic7XG4gICAgfVxuICAgIHNlcmlhbGl6ZUtleSgpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuandrUHJpdmF0ZSk7XG4gICAgfVxufVxuZXhwb3J0cy5BZGJLZXkgPSBBZGJLZXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQWRiS2V5TWFuYWdlciA9IGV4cG9ydHMubWF5YmVTdG9yZUtleSA9IHZvaWQgMDtcbmNvbnN0IGFkYl9hdXRoXzEgPSByZXF1aXJlKFwiLi9hZGJfYXV0aFwiKTtcbmZ1bmN0aW9uIGlzUGFzc3dvcmRDcmVkZW50aWFsKGNyZWQpIHtcbiAgICByZXR1cm4gY3JlZCAhPT0gbnVsbCAmJiBjcmVkLnR5cGUgPT09ICdwYXNzd29yZCc7XG59XG5mdW5jdGlvbiBoYXNQYXNzd29yZENyZWRlbnRpYWwoKSB7XG4gICAgcmV0dXJuICdQYXNzd29yZENyZWRlbnRpYWwnIGluIHdpbmRvdztcbn1cbi8vIGhvdyBsb25nIHdlIHdpbGwgc3RvcmUgdGhlIGtleSBpbiBtZW1vcnlcbmNvbnN0IEtFWV9JTl9NRU1PUllfVElNRU9VVCA9IDEwMDAgKiA2MCAqIDMwOyAvLyAzMCBtaW51dGVzXG4vLyBVcGRhdGUgY3JlZGVudGlhbCBzdG9yZSB3aXRoIHRoZSBnaXZlbiBrZXkuXG5hc3luYyBmdW5jdGlvbiBtYXliZVN0b3JlS2V5KGtleSkge1xuICAgIGlmICghaGFzUGFzc3dvcmRDcmVkZW50aWFsKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjcmVkZW50aWFsID0gbmV3IFBhc3N3b3JkQ3JlZGVudGlhbCh7XG4gICAgICAgIGlkOiAnd2VidXNiLWFkYi1rZXknLFxuICAgICAgICBwYXNzd29yZDoga2V5LnNlcmlhbGl6ZUtleSgpLFxuICAgICAgICBuYW1lOiAnV2ViVVNCIEFEQiBLZXknLFxuICAgICAgICBpY29uVVJMOiAnZmF2aWNvbi5pY28nXG4gICAgfSk7XG4gICAgLy8gVGhlICdTYXZlIHBhc3N3b3JkPycgQ2hyb21lIGRpYWxvZ3VlIG9ubHkgYXBwZWFycyBpZiB0aGUga2V5IGlzXG4gICAgLy8gbm90IGFscmVhZHkgc3RvcmVkIGluIENocm9tZS5cbiAgICBhd2FpdCBuYXZpZ2F0b3IuY3JlZGVudGlhbHMuc3RvcmUoY3JlZGVudGlhbCk7XG4gICAgLy8gJ3ByZXZlbnRTaWxlbnRBY2Nlc3MnIGd1YXJhbnRlZXMgdGhlIHVzZXIgaXMgYWx3YXlzIG5vdGlmaWVkIHdoZW5cbiAgICAvLyBjcmVkZW50aWFscyBhcmUgYWNjZXNzZWQuIFNvbWV0aW1lcyB0aGUgdXNlciBpcyBhc2tlZCB0byBjbGljayBhIGJ1dHRvblxuICAgIC8vIGFuZCBvdGhlciB0aW1lcyBvbmx5IGEgbm90aWZpY2F0aW9uIGlzIHNob3duIHRlbXBvcmFyaWx5LlxuICAgIGF3YWl0IG5hdmlnYXRvci5jcmVkZW50aWFscy5wcmV2ZW50U2lsZW50QWNjZXNzKCk7XG59XG5leHBvcnRzLm1heWJlU3RvcmVLZXkgPSBtYXliZVN0b3JlS2V5O1xuY2xhc3MgQWRiS2V5TWFuYWdlciB7XG4gICAgLy8gRmluZHMgYSBrZXksIGJ5IHByaW9yaXR5OlxuICAgIC8vIC0gbG9va2luZyBpbiBtZW1vcnkgKGkuZS4gdGhpcy5rZXkpXG4gICAgLy8gLSBsb29raW5nIGluIHRoZSBjcmVkZW50aWFsIHN0b3JlXG4gICAgLy8gLSBhbmQgZmluYWxseSBjcmVhdGluZyBvbmUgZnJvbSBzY3JhdGNoIGlmIG5lZWRlZFxuICAgIGFzeW5jIGdldEtleSgpIHtcbiAgICAgICAgLy8gMS4gSWYgd2UgaGF2ZSBhIHByaXZhdGUga2V5IGluIG1lbW9yeSwgd2UgcmV0dXJuIGl0LlxuICAgICAgICBpZiAodGhpcy5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmtleTtcbiAgICAgICAgfVxuICAgICAgICAvLyAyLiBXZSB0cnkgdG8gZ2V0IHRoZSBwcml2YXRlIGtleSBmcm9tIHRoZSBicm93c2VyLlxuICAgICAgICAvLyBUaGUgbWVkaWF0aW9uIGlzIHNldCBhcyAnb3B0aW9uYWwnLCBiZWNhdXNlIHdlIHVzZVxuICAgICAgICAvLyAncHJldmVudFNpbGVudEFjY2VzcycsIHdoaWNoIHNvbWV0aW1lcyByZXF1ZXN0cyB0aGUgdXNlciB0byBjbGlja1xuICAgICAgICAvLyBvbiBhIGJ1dHRvbiB0byBhbGxvdyB0aGUgYXV0aCwgYnV0IHNvbWV0aW1lcyBvbmx5IHNob3dzIGFcbiAgICAgICAgLy8gbm90aWZpY2F0aW9uIGFuZCBkb2VzIG5vdCByZXF1aXJlIHRoZSB1c2VyIHRvIGNsaWNrIG9uIGFueXRoaW5nLlxuICAgICAgICAvLyBJZiB3ZSBoYWQgc2V0IG1lZGlhdGlvbiB0byAncmVxdWlyZWQnLCB0aGUgdXNlciB3b3VsZCBoYXZlIGJlZW5cbiAgICAgICAgLy8gYXNrZWQgdG8gY2xpY2sgb24gYSBidXR0b24gZXZlcnkgdGltZS5cbiAgICAgICAgaWYgKGhhc1Bhc3N3b3JkQ3JlZGVudGlhbCgpKSB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lZGlhdGlvbjogJ29wdGlvbmFsJyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBjcmVkZW50aWFsID0gYXdhaXQgbmF2aWdhdG9yLmNyZWRlbnRpYWxzLmdldChvcHRpb25zKTtcbiAgICAgICAgICAgIGlmIChpc1Bhc3N3b3JkQ3JlZGVudGlhbChjcmVkZW50aWFsKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFzc2lnbktleShhZGJfYXV0aF8xLkFkYktleS5EZXNlcmlhbGl6ZUtleShjcmVkZW50aWFsLnBhc3N3b3JkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4gV2UgZ2VuZXJhdGUgYSBuZXcga2V5IHBhaXIuXG4gICAgICAgIHJldHVybiB0aGlzLmFzc2lnbktleShhd2FpdCBhZGJfYXV0aF8xLkFkYktleS5HZW5lcmF0ZU5ld0tleVBhaXIoKSk7XG4gICAgfVxuICAgIC8vIEFzc2lnbnMgdGhlIGtleSBhIG5ldyB2YWx1ZSwgc2V0cyBhIHRpbWVvdXQgZm9yIHN0b3JpbmcgdGhlIGtleSBpbiBtZW1vcnlcbiAgICAvLyBhbmQgdGhlbiByZXR1cm5zIHRoZSBuZXcga2V5LlxuICAgIGFzc2lnbktleShrZXkpIHtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIGlmICh0aGlzLmtleUluTWVtb3J5VGltZXJJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMua2V5SW5NZW1vcnlUaW1lcklkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtleUluTWVtb3J5VGltZXJJZCA9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMua2V5ID0gdW5kZWZpbmVkLCBLRVlfSU5fTUVNT1JZX1RJTUVPVVQpO1xuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH1cbn1cbmV4cG9ydHMuQWRiS2V5TWFuYWdlciA9IEFkYktleU1hbmFnZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIENvcHlyaWdodCAoQykgMjAyMiBUaGUgQW5kcm9pZCBPcGVuIFNvdXJjZSBQcm9qZWN0XG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbi8vIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuLy9cbi8vICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuLy8gZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuLy8gV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4vLyBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUmVjb3JkaW5nRXJyb3IgPSBleHBvcnRzLnNob3dSZWNvcmRpbmdNb2RhbCA9IGV4cG9ydHMud3JhcFJlY29yZGluZ0Vycm9yID0gdm9pZCAwO1xuY29uc3QgZXJyb3JzXzEgPSByZXF1aXJlKFwiLi4vLi4vYmFzZS9lcnJvcnNcIik7XG5jb25zdCByZWNvcmRpbmdfdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3JlY29yZGluZ191dGlsc1wiKTtcbi8vIFRoZSBwYXR0ZXJuIGZvciBoYW5kbGluZyByZWNvcmRpbmcgZXJyb3IgY2FuIGhhdmUgdGhlIGZvbGxvd2luZyBuZXN0aW5nIGluXG4vLyBjYXNlIG9mIGVycm9yczpcbi8vIEEuIHdyYXBSZWNvcmRpbmdFcnJvciAtPiB3cmFwcyBhIHByb21pc2Vcbi8vIEIuIG9uRmFpbHVyZSAtPiBoYXMgdXNlciBkZWZpbmVkIGxvZ2ljIGFuZCBjYWxscyBzaG93UmVjb3JkaW5nTW9kYWxcbi8vIEMuIHNob3dSZWNvcmRpbmdNb2RhbCAtPiBzaG93cyBVWCBmb3IgYSBnaXZlbiBlcnJvcjsgdGhpcyBpcyBub3QgY2FsbGVkXG4vLyAgICBkaXJlY3RseSBieSB3cmFwUmVjb3JkaW5nRXJyb3IsIGJlY2F1c2Ugd2Ugd2FudCB0aGUgY2FsbGVyIChzdWNoIGFzIHRoZVxuLy8gICAgVUkpIHRvIGRpY3RhdGUgdGhlIFVYXG4vLyBUaGlzIG1ldGhvZCB0YWtlcyBhIHByb21pc2UgYW5kIGEgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZSBpbiBjYXNlIHRoZSBwcm9taXNlXG4vLyBmYWlscy4gSXQgdGhlbiBhd2FpdHMgdGhlIHByb21pc2UgYW5kIGV4ZWN1dGVzIHRoZSBjYWxsYmFjayBpbiBjYXNlIG9mXG4vLyBmYWlsdXJlLiBJbiB0aGUgcmVjb3JkaW5nIGNvZGUgaXQgaXMgdXNlZCB0byB3cmFwOlxuLy8gMS4gQWNlc3NpbmcgdGhlIFdlYlVTQiBBUEkuXG4vLyAyLiBNZXRob2RzIHJldHVybmluZyBwcm9taXNlcyB3aGljaCBjYW4gYmUgcmVqZWN0ZWQuIEZvciBpbnN0YW5jZTpcbi8vIGEpIFdoZW4gdGhlIHVzZXIgY2xpY2tzICdBZGQgYSBuZXcgZGV2aWNlJyBidXQgdGhlbiBkb2Vzbid0IHNlbGVjdCBhIHZhbGlkXG4vLyAgICBkZXZpY2UuXG4vLyBiKSBXaGVuIHRoZSB1c2VyIHN0YXJ0cyBhIHRyYWNpbmcgc2Vzc2lvbiwgYnV0IGNhbmNlbHMgaXQgYmVmb3JlIHRoZXlcbi8vICAgIGF1dGhvcml6ZSB0aGUgc2Vzc2lvbiBvbiB0aGUgZGV2aWNlLlxuYXN5bmMgZnVuY3Rpb24gd3JhcFJlY29yZGluZ0Vycm9yKHByb21pc2UsIG9uRmFpbHVyZSkge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBhd2FpdCBwcm9taXNlO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICAvLyBTb21ldGltZXMgdGhlIG1lc3NhZ2UgaXMgd3JhcHBlZCBpbiBhbiBFcnJvciBvYmplY3QsIHNvbWV0aW1lcyBub3QsIHNvXG4gICAgICAgIC8vIHdlIG1ha2Ugc3VyZSB3ZSB0cmFuc2Zvcm0gaXQgaW50byBhIHN0cmluZy5cbiAgICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gKDAsIGVycm9yc18xLmdldEVycm9yTWVzc2FnZSkoZSk7XG4gICAgICAgIG9uRmFpbHVyZShlcnJvck1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbmV4cG9ydHMud3JhcFJlY29yZGluZ0Vycm9yID0gd3JhcFJlY29yZGluZ0Vycm9yO1xuZnVuY3Rpb24gc2hvd0FsbG93VVNCRGVidWdnaW5nKCkgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93Q29ubmVjdGlvbkxvc3RFcnJvcigpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd0V4dGVuc2lvbk5vdEluc3RhbGxlZCgpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd0ZhaWxlZFRvUHVzaEJpbmFyeShzdHIpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd0lzc3VlUGFyc2luZ1RoZVRyYWNlZFJlc3BvbnNlKHN0cikgeyBjb25zb2xlLmxvZyhcIk5PVCBJTVBMRU1FTlRFRCEhISEhXCIpOyB9XG5mdW5jdGlvbiBzaG93Tm9EZXZpY2VTZWxlY3RlZCgpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd1dlYnNvY2tldENvbm5lY3Rpb25Jc3N1ZShzdHIpIHsgY29uc29sZS5sb2coXCJOT1QgSU1QTEVNRU5URUQhISEhIVwiKTsgfVxuZnVuY3Rpb24gc2hvd1dlYlVTQkVycm9yVjIoKSB7IGNvbnNvbGUubG9nKFwiTk9UIElNUExFTUVOVEVEISEhISFcIik7IH1cbi8vIFNob3dzIGEgbW9kYWwgZm9yIGV2ZXJ5IGtub3duIHR5cGUgb2YgZXJyb3Igd2hpY2ggY2FuIGFyaXNlIGR1cmluZyByZWNvcmRpbmcuXG4vLyBJbiB0aGlzIHdheSwgZXJyb3JzIG9jY3VyaW5nIGF0IGRpZmZlcmVudCBsZXZlbHMgb2YgdGhlIHJlY29yZGluZyBwcm9jZXNzXG4vLyBjYW4gYmUgaGFuZGxlZCBpbiBhIGNlbnRyYWwgbG9jYXRpb24uXG5mdW5jdGlvbiBzaG93UmVjb3JkaW5nTW9kYWwobWVzc2FnZSkge1xuICAgIGlmIChbXG4gICAgICAgICdVbmFibGUgdG8gY2xhaW0gaW50ZXJmYWNlLicsXG4gICAgICAgICdUaGUgc3BlY2lmaWVkIGVuZHBvaW50IGlzIG5vdCBwYXJ0IG9mIGEgY2xhaW1lZCBhbmQgc2VsZWN0ZWQgJyArXG4gICAgICAgICAgICAnYWx0ZXJuYXRlIGludGVyZmFjZS4nLFxuICAgICAgICAvLyB0aHJvd24gd2hlbiBjYWxsaW5nIHRoZSAncmVzZXQnIG1ldGhvZCBvbiBhIFdlYlVTQiBkZXZpY2UuXG4gICAgICAgICdVbmFibGUgdG8gcmVzZXQgdGhlIGRldmljZS4nLFxuICAgIF0uc29tZSgocGFydE9mTWVzc2FnZSkgPT4gbWVzc2FnZS5pbmNsdWRlcyhwYXJ0T2ZNZXNzYWdlKSkpIHtcbiAgICAgICAgc2hvd1dlYlVTQkVycm9yVjIoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoW1xuICAgICAgICAnQSB0cmFuc2ZlciBlcnJvciBoYXMgb2NjdXJyZWQuJyxcbiAgICAgICAgJ1RoZSBkZXZpY2Ugd2FzIGRpc2Nvbm5lY3RlZC4nLFxuICAgICAgICAnVGhlIHRyYW5zZmVyIHdhcyBjYW5jZWxsZWQuJyxcbiAgICBdLnNvbWUoKHBhcnRPZk1lc3NhZ2UpID0+IG1lc3NhZ2UuaW5jbHVkZXMocGFydE9mTWVzc2FnZSkpIHx8XG4gICAgICAgIGlzRGV2aWNlRGlzY29ubmVjdGVkRXJyb3IobWVzc2FnZSkpIHtcbiAgICAgICAgc2hvd0Nvbm5lY3Rpb25Mb3N0RXJyb3IoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gcmVjb3JkaW5nX3V0aWxzXzEuQUxMT1dfVVNCX0RFQlVHR0lORykge1xuICAgICAgICBzaG93QWxsb3dVU0JEZWJ1Z2dpbmcoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNNZXNzYWdlQ29tcG9zZWRPZihtZXNzYWdlLCBbcmVjb3JkaW5nX3V0aWxzXzEuQklOQVJZX1BVU0hfRkFJTFVSRSwgcmVjb3JkaW5nX3V0aWxzXzEuQklOQVJZX1BVU0hfVU5LTk9XTl9SRVNQT05TRV0pKSB7XG4gICAgICAgIHNob3dGYWlsZWRUb1B1c2hCaW5hcnkobWVzc2FnZS5zdWJzdHJpbmcobWVzc2FnZS5pbmRleE9mKCc6JykgKyAxKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IHJlY29yZGluZ191dGlsc18xLk5PX0RFVklDRV9TRUxFQ1RFRCkge1xuICAgICAgICBzaG93Tm9EZXZpY2VTZWxlY3RlZCgpO1xuICAgIH1cbiAgICBlbHNlIGlmIChyZWNvcmRpbmdfdXRpbHNfMS5XRUJTT0NLRVRfVU5BQkxFX1RPX0NPTk5FQ1QgPT09IG1lc3NhZ2UpIHtcbiAgICAgICAgc2hvd1dlYnNvY2tldENvbm5lY3Rpb25Jc3N1ZShtZXNzYWdlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gcmVjb3JkaW5nX3V0aWxzXzEuRVhURU5TSU9OX05PVF9JTlNUQUxMRUQpIHtcbiAgICAgICAgc2hvd0V4dGVuc2lvbk5vdEluc3RhbGxlZCgpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc01lc3NhZ2VDb21wb3NlZE9mKG1lc3NhZ2UsIFtcbiAgICAgICAgcmVjb3JkaW5nX3V0aWxzXzEuUEFSU0lOR19VTktOV09OX1JFUVVFU1RfSUQsXG4gICAgICAgIHJlY29yZGluZ191dGlsc18xLlBBUlNJTkdfVU5BQkxFX1RPX0RFQ09ERV9NRVRIT0QsXG4gICAgICAgIHJlY29yZGluZ191dGlsc18xLlBBUlNJTkdfVU5SRUNPR05JWkVEX1BPUlQsXG4gICAgICAgIHJlY29yZGluZ191dGlsc18xLlBBUlNJTkdfVU5SRUNPR05JWkVEX01FU1NBR0UsXG4gICAgXSkpIHtcbiAgICAgICAgc2hvd0lzc3VlUGFyc2luZ1RoZVRyYWNlZFJlc3BvbnNlKG1lc3NhZ2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke21lc3NhZ2V9YCk7XG4gICAgfVxufVxuZXhwb3J0cy5zaG93UmVjb3JkaW5nTW9kYWwgPSBzaG93UmVjb3JkaW5nTW9kYWw7XG5mdW5jdGlvbiBpc0RldmljZURpc2Nvbm5lY3RlZEVycm9yKG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gbWVzc2FnZS5pbmNsdWRlcygnRGV2aWNlIHdpdGggc2VyaWFsJykgJiZcbiAgICAgICAgbWVzc2FnZS5pbmNsdWRlcygnd2FzIGRpc2Nvbm5lY3RlZC4nKTtcbn1cbmZ1bmN0aW9uIGlzTWVzc2FnZUNvbXBvc2VkT2YobWVzc2FnZSwgaXNzdWVzKSB7XG4gICAgZm9yIChjb25zdCBpc3N1ZSBvZiBpc3N1ZXMpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UuaW5jbHVkZXMoaXNzdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG4vLyBFeGNlcHRpb24gdGhyb3duIGJ5IHRoZSBSZWNvcmRpbmcgbG9naWMuXG5jbGFzcyBSZWNvcmRpbmdFcnJvciBleHRlbmRzIEVycm9yIHtcbn1cbmV4cG9ydHMuUmVjb3JkaW5nRXJyb3IgPSBSZWNvcmRpbmdFcnJvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QQVJTSU5HX1VOUkVDT0dOSVpFRF9NRVNTQUdFID0gZXhwb3J0cy5QQVJTSU5HX1VOUkVDT0dOSVpFRF9QT1JUID0gZXhwb3J0cy5QQVJTSU5HX1VOQUJMRV9UT19ERUNPREVfTUVUSE9EID0gZXhwb3J0cy5QQVJTSU5HX1VOS05XT05fUkVRVUVTVF9JRCA9IGV4cG9ydHMuUkVDT1JESU5HX0lOX1BST0dSRVNTID0gZXhwb3J0cy5CVUZGRVJfVVNBR0VfSU5DT1JSRUNUX0ZPUk1BVCA9IGV4cG9ydHMuQlVGRkVSX1VTQUdFX05PVF9BQ0NFU1NJQkxFID0gZXhwb3J0cy5NQUxGT1JNRURfRVhURU5TSU9OX01FU1NBR0UgPSBleHBvcnRzLkVYVEVOU0lPTl9OT1RfSU5TVEFMTEVEID0gZXhwb3J0cy5FWFRFTlNJT05fTkFNRSA9IGV4cG9ydHMuRVhURU5TSU9OX1VSTCA9IGV4cG9ydHMuRVhURU5TSU9OX0lEID0gZXhwb3J0cy5maW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQgPSBleHBvcnRzLkFEQl9ERVZJQ0VfRklMVEVSID0gZXhwb3J0cy5OT19ERVZJQ0VfU0VMRUNURUQgPSBleHBvcnRzLkNVU1RPTV9UUkFDRURfQ09OU1VNRVJfU09DS0VUX1BBVEggPSBleHBvcnRzLkRFRkFVTFRfVFJBQ0VEX0NPTlNVTUVSX1NPQ0tFVF9QQVRIID0gZXhwb3J0cy5BTExPV19VU0JfREVCVUdHSU5HID0gZXhwb3J0cy5UUkFDRUJPWF9GRVRDSF9USU1FT1VUID0gZXhwb3J0cy5UUkFDRUJPWF9ERVZJQ0VfUEFUSCA9IGV4cG9ydHMuQklOQVJZX1BVU0hfVU5LTk9XTl9SRVNQT05TRSA9IGV4cG9ydHMuQklOQVJZX1BVU0hfRkFJTFVSRSA9IGV4cG9ydHMuaXNDck9TID0gZXhwb3J0cy5pc0xpbnV4ID0gZXhwb3J0cy5pc01hY09zID0gZXhwb3J0cy5idWlsZEFiZFdlYnNvY2tldENvbW1hbmQgPSBleHBvcnRzLldFQlNPQ0tFVF9DTE9TRURfQUJOT1JNQUxMWV9DT0RFID0gZXhwb3J0cy5XRUJTT0NLRVRfVU5BQkxFX1RPX0NPTk5FQ1QgPSB2b2lkIDA7XG4vLyBCZWdpbiBXZWJzb2NrZXQgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmV4cG9ydHMuV0VCU09DS0VUX1VOQUJMRV9UT19DT05ORUNUID0gJ1VuYWJsZSB0byBjb25uZWN0IHRvIGRldmljZSB2aWEgd2Vic29ja2V0Lic7XG4vLyBodHRwczovL3d3dy5yZmMtZWRpdG9yLm9yZy9yZmMvcmZjNjQ1NSNzZWN0aW9uLTcuNC4xXG5leHBvcnRzLldFQlNPQ0tFVF9DTE9TRURfQUJOT1JNQUxMWV9DT0RFID0gMTAwNjtcbi8vIFRoZSBtZXNzYWdlcyByZWFkIGJ5IHRoZSBhZGIgc2VydmVyIGhhdmUgdGhlaXIgbGVuZ3RoIHByZXBlbmRlZCBpbiBoZXguXG4vLyBUaGlzIG1ldGhvZCBhZGRzIHRoZSBsZW5ndGggYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbWVzc2FnZS5cbi8vIEV4YW1wbGU6ICdob3N0OnRyYWNrLWRldmljZXMnIC0+ICcwMDEyaG9zdDp0cmFjay1kZXZpY2VzJ1xuLy8gZ28vY29kZXNlYXJjaC9hb3NwLWFuZHJvaWQxMS9zeXN0ZW0vY29yZS9hZGIvU0VSVklDRVMuVFhUXG5mdW5jdGlvbiBidWlsZEFiZFdlYnNvY2tldENvbW1hbmQoY21kKSB7XG4gICAgY29uc3QgaGRyID0gY21kLmxlbmd0aC50b1N0cmluZygxNikucGFkU3RhcnQoNCwgJzAnKTtcbiAgICByZXR1cm4gaGRyICsgY21kO1xufVxuZXhwb3J0cy5idWlsZEFiZFdlYnNvY2tldENvbW1hbmQgPSBidWlsZEFiZFdlYnNvY2tldENvbW1hbmQ7XG4vLyBTYW1wbGUgdXNlciBhZ2VudCBmb3IgQ2hyb21lIG9uIE1hYyBPUzpcbi8vICdNb3ppbGxhLzUuMCAoTWFjaW50b3NoOyBJbnRlbCBNYWMgT1MgWCAxMF8xNV83KSBBcHBsZVdlYktpdC81MzcuMzZcbi8vIChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEwNC4wLjAuMCBTYWZhcmkvNTM3LjM2J1xuZnVuY3Rpb24gaXNNYWNPcyh1c2VyQWdlbnQpIHtcbiAgICByZXR1cm4gdXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJyBtYWMgb3MgJyk7XG59XG5leHBvcnRzLmlzTWFjT3MgPSBpc01hY09zO1xuLy8gU2FtcGxlIHVzZXIgYWdlbnQgZm9yIENocm9tZSBvbiBMaW51eDpcbi8vIE1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbylcbi8vIENocm9tZS8xMDUuMC4wLjAgU2FmYXJpLzUzNy4zNlxuZnVuY3Rpb24gaXNMaW51eCh1c2VyQWdlbnQpIHtcbiAgICByZXR1cm4gdXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJyBsaW51eCAnKTtcbn1cbmV4cG9ydHMuaXNMaW51eCA9IGlzTGludXg7XG4vLyBTYW1wbGUgdXNlciBhZ2VudCBmb3IgQ2hyb21lIG9uIENocm9tZSBPUzpcbi8vIFwiTW96aWxsYS81LjAgKFgxMTsgQ3JPUyB4ODZfNjQgMTQ4MTYuOTkuMCkgQXBwbGVXZWJLaXQvNTM3LjM2XG4vLyAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xMDMuMC41MDYwLjExNCBTYWZhcmkvNTM3LjM2XCJcbi8vIFRoaXMgY29uZGl0aW9uIGlzIHdpZGVyLCBpbiB0aGUgdW5saWtlbHkgcG9zc2liaWxpdHkgb2YgZGlmZmVyZW50IGNhc2luZyxcbmZ1bmN0aW9uIGlzQ3JPUyh1c2VyQWdlbnQpIHtcbiAgICByZXR1cm4gdXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoJyBjcm9zICcpO1xufVxuZXhwb3J0cy5pc0NyT1MgPSBpc0NyT1M7XG4vLyBFbmQgV2Vic29ja2V0IC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEJlZ2luIEFkYiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0cy5CSU5BUllfUFVTSF9GQUlMVVJFID0gJ0JpbmFyeVB1c2hGYWlsdXJlJztcbmV4cG9ydHMuQklOQVJZX1BVU0hfVU5LTk9XTl9SRVNQT05TRSA9ICdCaW5hcnlQdXNoVW5rbm93blJlc3BvbnNlJztcbi8vIEluIGNhc2UgdGhlIGRldmljZSBkb2Vzbid0IGhhdmUgdGhlIHRyYWNlYm94LCB3ZSB1cGxvYWQgdGhlIGxhdGVzdCB2ZXJzaW9uXG4vLyB0byB0aGlzIHBhdGguXG5leHBvcnRzLlRSQUNFQk9YX0RFVklDRV9QQVRIID0gJy9kYXRhL2xvY2FsL3RtcC90cmFjZWJveCc7XG4vLyBFeHBlcmltZW50YWxseSwgdGhpcyB0YWtlcyA5MDBtcyBvbiB0aGUgZmlyc3QgZmV0Y2ggYW5kIDIwLTMwbXMgYWZ0ZXJcbi8vIGJlY2F1c2Ugb2YgY2FjaGluZy5cbmV4cG9ydHMuVFJBQ0VCT1hfRkVUQ0hfVElNRU9VVCA9IDMwMDAwO1xuLy8gTWVzc2FnZSBzaG93biB0byB0aGUgdXNlciB3aGVuIHRoZXkgbmVlZCB0byBhbGxvdyBhdXRoZW50aWNhdGlvbiBvbiB0aGVcbi8vIGRldmljZSBpbiBvcmRlciB0byBjb25uZWN0LlxuZXhwb3J0cy5BTExPV19VU0JfREVCVUdHSU5HID0gJ1BsZWFzZSBhbGxvdyBVU0IgZGVidWdnaW5nIG9uIGRldmljZSBhbmQgdHJ5IGFnYWluLic7XG4vLyBJZiB0aGUgQW5kcm9pZCBkZXZpY2UgaGFzIHRoZSB0cmFjaW5nIHNlcnZpY2Ugb24gaXQgKGZyb20gQVBJIHZlcnNpb24gMjkpLFxuLy8gdGhlbiB3ZSBjYW4gY29ubmVjdCB0byB0aGlzIGNvbnN1bWVyIHNvY2tldC5cbmV4cG9ydHMuREVGQVVMVF9UUkFDRURfQ09OU1VNRVJfU09DS0VUX1BBVEggPSAnbG9jYWxmaWxlc3lzdGVtOi9kZXYvc29ja2V0L3RyYWNlZF9jb25zdW1lcic7XG4vLyBJZiB0aGUgQW5kcm9pZCBkZXZpY2UgZG9lcyBub3QgaGF2ZSB0aGUgdHJhY2luZyBzZXJ2aWNlIG9uIGl0IChiZWZvcmUgQVBJXG4vLyB2ZXJzaW9uIDI5KSwgd2Ugd2lsbCBoYXZlIHRvIHB1c2ggdGhlIHRyYWNlYm94IG9uIHRoZSBkZXZpY2UuIFRoZW4sIHdlXG4vLyBjYW4gY29ubmVjdCB0byB0aGlzIGNvbnN1bWVyIHNvY2tldCAodXNpbmcgaXQgZG9lcyBub3QgcmVxdWlyZSBzeXN0ZW0gYWRtaW5cbi8vIHByaXZpbGVnZXMpLlxuZXhwb3J0cy5DVVNUT01fVFJBQ0VEX0NPTlNVTUVSX1NPQ0tFVF9QQVRIID0gJ2xvY2FsYWJzdHJhY3Q6dHJhY2VkX2NvbnN1bWVyJztcbi8vIEVuZCBBZGIgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEJlZ2luIFdlYnVzYiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0cy5OT19ERVZJQ0VfU0VMRUNURUQgPSAnTm8gZGV2aWNlIHNlbGVjdGVkLic7XG5leHBvcnRzLkFEQl9ERVZJQ0VfRklMVEVSID0ge1xuICAgIGNsYXNzQ29kZTogMjU1LCAvLyBVU0IgdmVuZG9yIHNwZWNpZmljIGNvZGVcbiAgICBzdWJjbGFzc0NvZGU6IDY2LCAvLyBBbmRyb2lkIHZlbmRvciBzcGVjaWZpYyBzdWJjbGFzc1xuICAgIHByb3RvY29sQ29kZTogMSwgLy8gQWRiIHByb3RvY29sXG59O1xuZnVuY3Rpb24gZmluZEludGVyZmFjZUFuZEVuZHBvaW50KGRldmljZSkge1xuICAgIGNvbnN0IGFkYkRldmljZUZpbHRlciA9IGV4cG9ydHMuQURCX0RFVklDRV9GSUxURVI7XG4gICAgZm9yIChjb25zdCBjb25maWcgb2YgZGV2aWNlLmNvbmZpZ3VyYXRpb25zKSB7XG4gICAgICAgIGZvciAoY29uc3QgaW50ZXJmYWNlXyBvZiBjb25maWcuaW50ZXJmYWNlcykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBhbHQgb2YgaW50ZXJmYWNlXy5hbHRlcm5hdGVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFsdC5pbnRlcmZhY2VDbGFzcyA9PT0gYWRiRGV2aWNlRmlsdGVyLmNsYXNzQ29kZSAmJlxuICAgICAgICAgICAgICAgICAgICBhbHQuaW50ZXJmYWNlU3ViY2xhc3MgPT09IGFkYkRldmljZUZpbHRlci5zdWJjbGFzc0NvZGUgJiZcbiAgICAgICAgICAgICAgICAgICAgYWx0LmludGVyZmFjZVByb3RvY29sID09PSBhZGJEZXZpY2VGaWx0ZXIucHJvdG9jb2xDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uVmFsdWU6IGNvbmZpZy5jb25maWd1cmF0aW9uVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2JJbnRlcmZhY2VOdW1iZXI6IGludGVyZmFjZV8uaW50ZXJmYWNlTnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kcG9pbnRzOiBhbHQuZW5kcG9pbnRzLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0gLy8gaWYgKGFsdGVybmF0ZSlcbiAgICAgICAgICAgIH0gLy8gZm9yIChpbnRlcmZhY2UuYWx0ZXJuYXRlcylcbiAgICAgICAgfSAvLyBmb3IgKGNvbmZpZ3VyYXRpb24uaW50ZXJmYWNlcylcbiAgICB9IC8vIGZvciAoY29uZmlndXJhdGlvbnMpXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbmV4cG9ydHMuZmluZEludGVyZmFjZUFuZEVuZHBvaW50ID0gZmluZEludGVyZmFjZUFuZEVuZHBvaW50O1xuLy8gRW5kIFdlYnVzYiAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gQmVnaW4gQ2hyb21lIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnRzLkVYVEVOU0lPTl9JRCA9ICdsZm1rcGhmcGRiamlqaHBvbWdlY2Zpa2hmb2hhb2luZSc7XG5leHBvcnRzLkVYVEVOU0lPTl9VUkwgPSBgaHR0cHM6Ly9jaHJvbWUuZ29vZ2xlLmNvbS93ZWJzdG9yZS9kZXRhaWwvcGVyZmV0dG8tdWkvJHtleHBvcnRzLkVYVEVOU0lPTl9JRH1gO1xuZXhwb3J0cy5FWFRFTlNJT05fTkFNRSA9ICdDaHJvbWUgZXh0ZW5zaW9uJztcbmV4cG9ydHMuRVhURU5TSU9OX05PVF9JTlNUQUxMRUQgPSBgVG8gdHJhY2UgQ2hyb21lIGZyb20gdGhlIFBlcmZldHRvIFVJLCB5b3UgbmVlZCB0byBpbnN0YWxsIG91clxuICAgICR7ZXhwb3J0cy5FWFRFTlNJT05fVVJMfSBhbmQgdGhlbiByZWxvYWQgdGhpcyBwYWdlLmA7XG5leHBvcnRzLk1BTEZPUk1FRF9FWFRFTlNJT05fTUVTU0FHRSA9ICdNYWxmb3JtZWQgZXh0ZW5zaW9uIG1lc3NhZ2UuJztcbmV4cG9ydHMuQlVGRkVSX1VTQUdFX05PVF9BQ0NFU1NJQkxFID0gJ0J1ZmZlciB1c2FnZSBub3QgYWNjZXNzaWJsZSc7XG5leHBvcnRzLkJVRkZFUl9VU0FHRV9JTkNPUlJFQ1RfRk9STUFUID0gJ1RoZSBidWZmZXIgdXNhZ2UgZGF0YSBoYXMgYW0gaW5jb3JyZWN0IGZvcm1hdCc7XG4vLyBFbmQgQ2hyb21lIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEJlZ2luIFRyYWNlZCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnRzLlJFQ09SRElOR19JTl9QUk9HUkVTUyA9ICdSZWNvcmRpbmcgaW4gcHJvZ3Jlc3MnO1xuZXhwb3J0cy5QQVJTSU5HX1VOS05XT05fUkVRVUVTVF9JRCA9ICdVbmtub3duIHJlcXVlc3QgaWQnO1xuZXhwb3J0cy5QQVJTSU5HX1VOQUJMRV9UT19ERUNPREVfTUVUSE9EID0gJ1VuYWJsZSB0byBkZWNvZGUgbWV0aG9kJztcbmV4cG9ydHMuUEFSU0lOR19VTlJFQ09HTklaRURfUE9SVCA9ICdVbnJlY29nbml6ZWQgY29uc3VtZXIgcG9ydCByZXNwb25zZSc7XG5leHBvcnRzLlBBUlNJTkdfVU5SRUNPR05JWkVEX01FU1NBR0UgPSAnVW5yZWNvZ25pemVkIGZyYW1lIG1lc3NhZ2UnO1xuLy8gRW5kIFRyYWNlZCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBDb3B5cmlnaHQgKEMpIDIwMjIgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5ID0gZXhwb3J0cy5BTkRST0lEX1dFQlVTQl9UQVJHRVRfRkFDVE9SWSA9IHZvaWQgMDtcbmNvbnN0IGVycm9yc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2Jhc2UvZXJyb3JzXCIpO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IGFkYl9rZXlfbWFuYWdlcl8xID0gcmVxdWlyZShcIi4uL2F1dGgvYWRiX2tleV9tYW5hZ2VyXCIpO1xuY29uc3QgcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXzEgPSByZXF1aXJlKFwiLi4vcmVjb3JkaW5nX2Vycm9yX2hhbmRsaW5nXCIpO1xuY29uc3QgcmVjb3JkaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi4vcmVjb3JkaW5nX3V0aWxzXCIpO1xuY29uc3QgYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0XzEgPSByZXF1aXJlKFwiLi4vdGFyZ2V0cy9hbmRyb2lkX3dlYnVzYl90YXJnZXRcIik7XG5leHBvcnRzLkFORFJPSURfV0VCVVNCX1RBUkdFVF9GQUNUT1JZID0gJ0FuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5JztcbmNvbnN0IFNFUklBTF9OVU1CRVJfSVNTVUUgPSAnYW4gaW52YWxpZCBzZXJpYWwgbnVtYmVyJztcbmNvbnN0IEFEQl9JTlRFUkZBQ0VfSVNTVUUgPSAnYW4gaW5jb21wYXRpYmxlIGFkYiBpbnRlcmZhY2UnO1xuZnVuY3Rpb24gY3JlYXRlRGV2aWNlRXJyb3JNZXNzYWdlKGRldmljZSwgaXNzdWUpIHtcbiAgICBjb25zdCBwcm9kdWN0TmFtZSA9IGRldmljZS5wcm9kdWN0TmFtZTtcbiAgICByZXR1cm4gYFVTQiBkZXZpY2Uke3Byb2R1Y3ROYW1lID8gJyAnICsgcHJvZHVjdE5hbWUgOiAnJ30gaGFzICR7aXNzdWV9YDtcbn1cbmNsYXNzIEFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5IHtcbiAgICBjb25zdHJ1Y3Rvcih1c2IpIHtcbiAgICAgICAgdGhpcy51c2IgPSB1c2I7XG4gICAgICAgIHRoaXMua2luZCA9IGV4cG9ydHMuQU5EUk9JRF9XRUJVU0JfVEFSR0VUX0ZBQ1RPUlk7XG4gICAgICAgIHRoaXMub25UYXJnZXRDaGFuZ2UgPSAoKSA9PiB7IH07XG4gICAgICAgIHRoaXMucmVjb3JkaW5nUHJvYmxlbXMgPSBbXTtcbiAgICAgICAgdGhpcy50YXJnZXRzID0gbmV3IE1hcCgpO1xuICAgICAgICAvLyBBZGJLZXlNYW5hZ2VyIHNob3VsZCBvbmx5IGJlIGluc3RhbnRpYXRlZCBvbmNlLCBzbyB3ZSBjYW4gdXNlIHRoZSBzYW1lIGtleVxuICAgICAgICAvLyBmb3IgYWxsIGRldmljZXMuXG4gICAgICAgIHRoaXMua2V5TWFuYWdlciA9IG5ldyBhZGJfa2V5X21hbmFnZXJfMS5BZGJLZXlNYW5hZ2VyKCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gJ0FuZHJvaWQgV2ViVXNiJztcbiAgICB9XG4gICAgbGlzdFRhcmdldHMoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMudGFyZ2V0cy52YWx1ZXMoKSk7XG4gICAgfVxuICAgIGxpc3RSZWNvcmRpbmdQcm9ibGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVjb3JkaW5nUHJvYmxlbXM7XG4gICAgfVxuICAgIGFzeW5jIGNvbm5lY3ROZXdUYXJnZXQoKSB7XG4gICAgICAgIGxldCBkZXZpY2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkZXZpY2UgPSBhd2FpdCB0aGlzLnVzYi5yZXF1ZXN0RGV2aWNlKHsgZmlsdGVyczogW3JlY29yZGluZ191dGlsc18xLkFEQl9ERVZJQ0VfRklMVEVSXSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHJlY29yZGluZ19lcnJvcl9oYW5kbGluZ18xLlJlY29yZGluZ0Vycm9yKCgwLCBlcnJvcnNfMS5nZXRFcnJvck1lc3NhZ2UpKGUpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZXZpY2VWYWxpZCA9IHRoaXMuY2hlY2tEZXZpY2VWYWxpZGl0eShkZXZpY2UpO1xuICAgICAgICBpZiAoIWRldmljZVZhbGlkLmlzVmFsaWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyByZWNvcmRpbmdfZXJyb3JfaGFuZGxpbmdfMS5SZWNvcmRpbmdFcnJvcihkZXZpY2VWYWxpZC5pc3N1ZXMuam9pbignXFxuJykpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFuZHJvaWRUYXJnZXQgPSBuZXcgYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0XzEuQW5kcm9pZFdlYnVzYlRhcmdldChkZXZpY2UsIHRoaXMua2V5TWFuYWdlciwgdGhpcy5vblRhcmdldENoYW5nZSk7XG4gICAgICAgIHRoaXMudGFyZ2V0cy5zZXQoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKGRldmljZS5zZXJpYWxOdW1iZXIpLCBhbmRyb2lkVGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIGFuZHJvaWRUYXJnZXQ7XG4gICAgfVxuICAgIHNldE9uVGFyZ2V0Q2hhbmdlKG9uVGFyZ2V0Q2hhbmdlKSB7XG4gICAgICAgIHRoaXMub25UYXJnZXRDaGFuZ2UgPSBvblRhcmdldENoYW5nZTtcbiAgICB9XG4gICAgYXN5bmMgaW5pdCgpIHtcbiAgICAgICAgbGV0IGRldmljZXMgPSBbXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRldmljZXMgPSBhd2FpdCB0aGlzLnVzYi5nZXREZXZpY2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKF8pIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gV2ViVVNCIG5vdCBhdmFpbGFibGUgb3IgZGlzYWxsb3dlZCBpbiBpZnJhbWUuXG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBkZXZpY2Ugb2YgZGV2aWNlcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tEZXZpY2VWYWxpZGl0eShkZXZpY2UpLmlzVmFsaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldHMuc2V0KCgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKShkZXZpY2Uuc2VyaWFsTnVtYmVyKSwgbmV3IGFuZHJvaWRfd2VidXNiX3RhcmdldF8xLkFuZHJvaWRXZWJ1c2JUYXJnZXQoZGV2aWNlLCB0aGlzLmtleU1hbmFnZXIsIHRoaXMub25UYXJnZXRDaGFuZ2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVzYi5hZGRFdmVudExpc3RlbmVyKCdjb25uZWN0JywgKGV2KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0RldmljZVZhbGlkaXR5KGV2LmRldmljZSkuaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0cy5zZXQoKDAsIGxvZ2dpbmdfMS5hc3NlcnRFeGlzdHMpKGV2LmRldmljZS5zZXJpYWxOdW1iZXIpLCBuZXcgYW5kcm9pZF93ZWJ1c2JfdGFyZ2V0XzEuQW5kcm9pZFdlYnVzYlRhcmdldChldi5kZXZpY2UsIHRoaXMua2V5TWFuYWdlciwgdGhpcy5vblRhcmdldENoYW5nZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMub25UYXJnZXRDaGFuZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXNiLmFkZEV2ZW50TGlzdGVuZXIoJ2Rpc2Nvbm5lY3QnLCBhc3luYyAoZXYpID0+IHtcbiAgICAgICAgICAgIC8vIFdlIGRvbid0IGNoZWNrIGRldmljZSB2YWxpZGl0eSB3aGVuIGRpc2Nvbm5lY3RpbmcgYmVjYXVzZSBpZiB0aGUgZGV2aWNlXG4gICAgICAgICAgICAvLyBpcyBpbnZhbGlkIHdlIHdvdWxkIG5vdCBoYXZlIGNvbm5lY3RlZCBpbiB0aGUgZmlyc3QgcGxhY2UuXG4gICAgICAgICAgICBjb25zdCBzZXJpYWxOdW1iZXIgPSAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykoZXYuZGV2aWNlLnNlcmlhbE51bWJlcik7XG4gICAgICAgICAgICBhd2FpdCAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy50YXJnZXRzLmdldChzZXJpYWxOdW1iZXIpKVxuICAgICAgICAgICAgICAgIC5kaXNjb25uZWN0KGBEZXZpY2Ugd2l0aCBzZXJpYWwgJHtzZXJpYWxOdW1iZXJ9IHdhcyBkaXNjb25uZWN0ZWQuYCk7XG4gICAgICAgICAgICB0aGlzLnRhcmdldHMuZGVsZXRlKHNlcmlhbE51bWJlcik7XG4gICAgICAgICAgICB0aGlzLm9uVGFyZ2V0Q2hhbmdlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjaGVja0RldmljZVZhbGlkaXR5KGRldmljZSkge1xuICAgICAgICBjb25zdCBkZXZpY2VWYWxpZGl0eSA9IHsgaXNWYWxpZDogdHJ1ZSwgaXNzdWVzOiBbXSB9O1xuICAgICAgICBpZiAoIWRldmljZS5zZXJpYWxOdW1iZXIpIHtcbiAgICAgICAgICAgIGRldmljZVZhbGlkaXR5Lmlzc3Vlcy5wdXNoKGNyZWF0ZURldmljZUVycm9yTWVzc2FnZShkZXZpY2UsIFNFUklBTF9OVU1CRVJfSVNTVUUpKTtcbiAgICAgICAgICAgIGRldmljZVZhbGlkaXR5LmlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISgwLCByZWNvcmRpbmdfdXRpbHNfMS5maW5kSW50ZXJmYWNlQW5kRW5kcG9pbnQpKGRldmljZSkpIHtcbiAgICAgICAgICAgIGRldmljZVZhbGlkaXR5Lmlzc3Vlcy5wdXNoKGNyZWF0ZURldmljZUVycm9yTWVzc2FnZShkZXZpY2UsIEFEQl9JTlRFUkZBQ0VfSVNTVUUpKTtcbiAgICAgICAgICAgIGRldmljZVZhbGlkaXR5LmlzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY29yZGluZ1Byb2JsZW1zLnB1c2goLi4uZGV2aWNlVmFsaWRpdHkuaXNzdWVzKTtcbiAgICAgICAgcmV0dXJuIGRldmljZVZhbGlkaXR5O1xuICAgIH1cbn1cbmV4cG9ydHMuQW5kcm9pZFdlYnVzYlRhcmdldEZhY3RvcnkgPSBBbmRyb2lkV2VidXNiVGFyZ2V0RmFjdG9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BbmRyb2lkVGFyZ2V0ID0gdm9pZCAwO1xuY29uc3QgcmVjb3JkaW5nX3V0aWxzXzEgPSByZXF1aXJlKFwiLi4vcmVjb3JkaW5nX3V0aWxzXCIpO1xuY2xhc3MgQW5kcm9pZFRhcmdldCB7XG4gICAgY29uc3RydWN0b3IoYWRiQ29ubmVjdGlvbiwgb25UYXJnZXRDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5hZGJDb25uZWN0aW9uID0gYWRiQ29ubmVjdGlvbjtcbiAgICAgICAgdGhpcy5vblRhcmdldENoYW5nZSA9IG9uVGFyZ2V0Q2hhbmdlO1xuICAgICAgICB0aGlzLmNvbnN1bWVyU29ja2V0UGF0aCA9IHJlY29yZGluZ191dGlsc18xLkRFRkFVTFRfVFJBQ0VEX0NPTlNVTUVSX1NPQ0tFVF9QQVRIO1xuICAgIH1cbiAgICAvLyBUaGlzIGlzIGNhbGxlZCB3aGVuIGEgdXNiIFVTQkNvbm5lY3Rpb25FdmVudCBvZiB0eXBlICdkaXNjb25uZWN0JyBldmVudCBpc1xuICAgIC8vIGVtaXR0ZWQuIFRoaXMgZXZlbnQgaXMgZW1pdHRlZCB3aGVuIHRoZSBVU0IgY29ubmVjdGlvbiBpcyBsb3N0IChleGFtcGxlOlxuICAgIC8vIHdoZW4gdGhlIHVzZXIgdW5wbHVnZ2VkIHRoZSBjb25uZWN0aW5nIGNhYmxlKS5cbiAgICBhc3luYyBkaXNjb25uZWN0KGRpc2Nvbm5lY3RNZXNzYWdlKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuYWRiQ29ubmVjdGlvbi5kaXNjb25uZWN0KGRpc2Nvbm5lY3RNZXNzYWdlKTtcbiAgICB9XG4gICAgLy8gU3RhcnRzIGEgdHJhY2luZyBzZXNzaW9uIGluIG9yZGVyIHRvIGZldGNoIGluZm9ybWF0aW9uIHN1Y2ggYXMgYXBpTGV2ZWxcbiAgICAvLyBhbmQgZGF0YVNvdXJjZXMgZnJvbSB0aGUgZGV2aWNlLiBUaGVuLCBpdCBjYW5jZWxzIHRoZSBzZXNzaW9uLlxuICAgIGFzeW5jIGZldGNoVGFyZ2V0SW5mbyhsaXN0ZW5lcikge1xuICAgIH1cbiAgICAvLyBXZSBkbyBub3Qgc3VwcG9ydCBsb25nIHRyYWNpbmcgb24gQW5kcm9pZC5cbiAgICBjYW5DcmVhdGVUcmFjaW5nU2Vzc2lvbihyZWNvcmRpbmdNb2RlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgYXN5bmMgY3JlYXRlVHJhY2luZ1Nlc3Npb24odHJhY2luZ1Nlc3Npb25MaXN0ZW5lcikge1xuICAgIH1cbiAgICBjYW5Db25uZWN0V2l0aG91dENvbnRlbnRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYkNvbm5lY3Rpb24uY2FuQ29ubmVjdFdpdGhvdXRDb250ZW50aW9uKCk7XG4gICAgfVxuICAgIGdldEFkYkNvbm5lY3Rpbm8oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkYkNvbm5lY3Rpb247XG4gICAgfVxufVxuZXhwb3J0cy5BbmRyb2lkVGFyZ2V0ID0gQW5kcm9pZFRhcmdldDtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy8gQ29weXJpZ2h0IChDKSAyMDIyIFRoZSBBbmRyb2lkIE9wZW4gU291cmNlIFByb2plY3Rcbi8vXG4vLyBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuLy8geW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuLy8gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbi8vXG4vLyBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4vLyBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbi8vIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BbmRyb2lkV2VidXNiVGFyZ2V0ID0gdm9pZCAwO1xuY29uc3QgbG9nZ2luZ18xID0gcmVxdWlyZShcIi4uLy4uLy4uL2Jhc2UvbG9nZ2luZ1wiKTtcbmNvbnN0IGFkYl9jb25uZWN0aW9uX292ZXJfd2VidXNiXzEgPSByZXF1aXJlKFwiLi4vYWRiX2Nvbm5lY3Rpb25fb3Zlcl93ZWJ1c2JcIik7XG5jb25zdCBhbmRyb2lkX3RhcmdldF8xID0gcmVxdWlyZShcIi4vYW5kcm9pZF90YXJnZXRcIik7XG5jbGFzcyBBbmRyb2lkV2VidXNiVGFyZ2V0IGV4dGVuZHMgYW5kcm9pZF90YXJnZXRfMS5BbmRyb2lkVGFyZ2V0IHtcbiAgICBjb25zdHJ1Y3RvcihkZXZpY2UsIGtleU1hbmFnZXIsIG9uVGFyZ2V0Q2hhbmdlKSB7XG4gICAgICAgIHN1cGVyKG5ldyBhZGJfY29ubmVjdGlvbl9vdmVyX3dlYnVzYl8xLkFkYkNvbm5lY3Rpb25PdmVyV2VidXNiKGRldmljZSwga2V5TWFuYWdlciksIG9uVGFyZ2V0Q2hhbmdlKTtcbiAgICAgICAgdGhpcy5kZXZpY2UgPSBkZXZpY2U7XG4gICAgfVxuICAgIGdldEluZm8oKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSAoMCwgbG9nZ2luZ18xLmFzc2VydEV4aXN0cykodGhpcy5kZXZpY2UucHJvZHVjdE5hbWUpICsgJyAnICtcbiAgICAgICAgICAgICgwLCBsb2dnaW5nXzEuYXNzZXJ0RXhpc3RzKSh0aGlzLmRldmljZS5zZXJpYWxOdW1iZXIpICsgJyBXZWJVc2InO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGFyZ2V0VHlwZTogJ0FORFJPSUQnLFxuICAgICAgICAgICAgLy8gJ2FuZHJvaWRBcGlMZXZlbCcgd2lsbCBiZSBwb3B1bGF0ZWQgYWZ0ZXIgQURCIGF1dGhvcml6YXRpb24uXG4gICAgICAgICAgICBhbmRyb2lkQXBpTGV2ZWw6IHRoaXMuYW5kcm9pZEFwaUxldmVsLFxuICAgICAgICAgICAgZGF0YVNvdXJjZXM6IHRoaXMuZGF0YVNvdXJjZXMgfHwgW10sXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydHMuQW5kcm9pZFdlYnVzYlRhcmdldCA9IEFuZHJvaWRXZWJ1c2JUYXJnZXQ7XG4iLCIvLyBDb3B5cmlnaHQgKEMpIDIwMTkgVGhlIEFuZHJvaWQgT3BlbiBTb3VyY2UgUHJvamVjdFxuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4vLyBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbi8vXG4vLyAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuLy9cbi8vIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbi8vIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuLy8gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuLy8gbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbmV4cG9ydCBjb25zdCBfVGV4dERlY29kZXIgPSBUZXh0RGVjb2RlcjtcbmV4cG9ydCBjb25zdCBfVGV4dEVuY29kZXIgPSBUZXh0RW5jb2RlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeV8xID0gcmVxdWlyZShcIi4vV2ViQWRiL2NvbW1vbi9yZWNvcmRpbmdWMi90YXJnZXRfZmFjdG9yaWVzL2FuZHJvaWRfd2VidXNiX3RhcmdldF9mYWN0b3J5XCIpO1xuY29uc3QgcnVuQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJydW5fYnV0dG9uXCIpO1xuY29uc3Qgc2NyaXB0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NyaXB0X2FyZWFcIik7XG5jb25zdCBvdXRwdXRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdXRwdXRfYXJlYVwiKTtcbmNvbnN0IHdlYnVzYiA9IG5ldyBhbmRyb2lkX3dlYnVzYl90YXJnZXRfZmFjdG9yeV8xLkFuZHJvaWRXZWJ1c2JUYXJnZXRGYWN0b3J5KG5hdmlnYXRvci51c2IpO1xudmFyIGFkYkNvbm5lY3Rpb247XG5zY3JpcHRBcmVhLnZhbHVlID0gXCJnZXRwcm9wXCI7XG5mdW5jdGlvbiBkZXZpY2VDb25uZWN0ZWQoZGV2KSB7XG4gICAgY29uc3QgYWRiVGFyZ2V0ID0gZGV2O1xuICAgIGFkYkNvbm5lY3Rpb24gPSBhZGJUYXJnZXQuYWRiQ29ubmVjdGlvbjtcbiAgICBhZGJDb25uZWN0aW9uLnNoZWxsQW5kR2V0T3V0cHV0KFwiZHVtcHN5cyBTdXJmYWNlRmxpbmdlclwiKS50aGVuKChvdXRwdXQpID0+IHsgY29uc29sZS5sb2cob3V0cHV0KTsgfSk7XG59XG5mdW5jdGlvbiBjb25uZWN0RGV2aWNlKCkge1xuICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdCBkZXZpY2VcIik7XG4gICAgbGV0IGRldmljZVAgPSB3ZWJ1c2IuY29ubmVjdE5ld1RhcmdldCgpLnRoZW4oKGRldmljZSkgPT4gZGV2aWNlQ29ubmVjdGVkKGRldmljZSksIChyZWFzb24pID0+IHsgY29uc29sZS5sb2coXCJGYWlsZWQgdG8gY29ubmVjdFwiKTsgfSk7XG59XG5mdW5jdGlvbiBydW5UZXN0KCkge1xuICAgIHJ1bkJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgc2NyaXB0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG4gICAgb3V0cHV0QXJlYS52YWx1ZSA9IFwiXCI7XG4gICAgbGV0IHRlc3RTY3JpcHQgPSBzY3JpcHRBcmVhLnZhbHVlO1xuICAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIHRoZSBzY3JpcHRcbiAgICBhZGJDb25uZWN0aW9uLnNoZWxsQW5kR2V0T3V0cHV0KHRlc3RTY3JpcHQpLnRoZW4oKHZhbCkgPT4ge1xuICAgICAgICBydW5CdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgc2NyaXB0QXJlYS5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBvdXRwdXRBcmVhLnZhbHVlID0gdmFsO1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKHRlc3RTY3JpcHQpO1xufVxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25uZWN0X2J1dHRvblwiKT8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjb25uZWN0RGV2aWNlLCBmYWxzZSk7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJ1bl9idXR0b25cIik/LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcnVuVGVzdCwgZmFsc2UpO1xuaWYgKG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoeyB2aWRlbzogdHJ1ZSB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XG4gICAgICAgIGxldCB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZGVvXCIpO1xuICAgICAgICB2aWRlb0VsZW1lbnQuc3JjT2JqZWN0ID0gc3RyZWFtO1xuICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyMHIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJTb21ldGhpbmcgd2VudCB3cm9uZyFcIiwgZXJyMHIpO1xuICAgIH0pO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9