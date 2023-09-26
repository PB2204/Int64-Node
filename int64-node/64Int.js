// Int64.js
//
// Copyright (c) 2023 Pabitra Banerjee

// Constants for masking and values
const MAX_INT31_MASK = 0x7fffffff;   // Maximum positive 31-bit integer
const MIN_INT31_VAL = 0x80000000;   // Minimum 31-bit integer value (negative)
const MAX_INT32_MASK = 0xffffffff;   // Maximum positive 32-bit integer
const MIN_INT32_VAL = 0x100000000;  // Minimum 32-bit integer value (negative)

// Map for converting hex octets to strings
const HEX_MAP = [];
for (let i = 0; i < 256; i++) {
  HEX_MAP[i] = (i > 0xF ? '' : '0') + i.toString(16);
}

class Int64Wrapper {
  constructor(a1, a2) {
    if (a1 instanceof Buffer) {
      this.buffer = a1;
      this.offset = a2 || 0;
    } else if (Object.prototype.toString.call(a1) == '[object Uint8Array]') {
      this.buffer = Buffer.from(a1);
      this.offset = a2 || 0;
    } else {
      this.buffer = this.buffer || Buffer.alloc(8);
      this.offset = 0;
      this.setValue.apply(this, arguments);
    }
  }

  // Maximum positive 53-bit integer
  static get MAX_INT() {
    return Math.pow(2, 53);
  }

  // Minimum 53-bit integer value (negative)
  static get MIN_INT() {
    return -Math.pow(2, 53);
  }

  // Perform 2's complement for negative numbers
  _2scomplement() {
    const b = this.buffer;
    const o = this.offset;
    let carry = 1;
    for (let i = o + 7; i >= o; i--) {
      let v = (b[i] ^ 0xff) + carry;
      b[i] = v & 0xff;
      carry = v >> 8;
    }
  }

  // Set the value based on different input types
  setValue(hi, lo) {
    let negate = false;
    if (arguments.length === 1) {
      if (typeof hi === 'number') {
        negate = hi < 0;
        hi = Math.abs(hi);
        lo = hi % MAX_INT32_MASK;
        hi = hi / MAX_INT32_MASK | 0;
        if (hi > MAX_INT32_MASK) throw new RangeError(`${hi} is outside Int64 range`);
      } else if (typeof hi === 'string') {
        hi = (hi + '').replace(/^0x/, '');
        lo = hi.slice(-8);
        hi = hi.length > 8 ? hi.slice(0, -8) : '';
        hi = parseInt(hi, 16);
        lo = parseInt(lo, 16);
      } else {
        throw new Error(`${hi} must be a Number or String`);
      }
    }

    const b = this.buffer;
    const o = this.offset;
    for (let i = 7; i >= 0; i--) {
      b[o + i] = lo & 0xff;
      lo = i === 4 ? hi : lo >>> 8;
    }

    if (negate) this._2scomplement();
  }

  // Convert to a native JS number
  toNumber(allowImprecise) {
    const b = this.buffer;
    const o = this.offset;

    const negate = b[o] & 0x80;
    let x = 0;
    let carry = 1;
    for (let i = 7, m = 1; i >= 0; i--, m *= 256) {
      let v = b[o + i];

      if (negate) {
        v = (v ^ 0xff) + carry;
        carry = v >> 8;
        v = v & 0xff;
      }

      x += v * m;
    }

    if (!allowImprecise && x >= Int64Wrapper.MAX_INT) {
      return negate ? -Infinity : Infinity;
    }

    return negate ? -x : x;
  }

  valueOf() {
    return this.toNumber(false);
  }

  toString(radix) {
    return this.valueOf().toString(radix || 10);
  }

  // Return a string representation
  toOctetString(sep) {
    const out = new Array(8);
    const b = this.buffer;
    const o = this.offset;
    for (let i = 0; i < 8; i++) {
      out[i] = HEX_MAP[b[o + i]];
    }
    return out.join(sep || '');
  }

  // Get the 8 bytes in a buffer
  toBuffer(rawBuffer) {
    if (rawBuffer && this.offset === 0) return this.buffer;

    const out = Buffer.alloc(8);
    this.buffer.copy(out, 0, this.offset, this.offset + 8);
    return out;
  }

  // Copy 8 bytes of int64 into target buffer at target offset
  copy(targetBuffer, targetOffset) {
    this.buffer.copy(targetBuffer, targetOffset || 0, this.offset, this.offset + 8);
  }

  // Compare with another Int64Wrapper
  compare(other) {
    if ((this.buffer[this.offset] & 0x80) !== (other.buffer[other.offset] & 0x80)) {
      return other.buffer[other.offset] - this.buffer[this.offset];
    }

    for (let i = 0; i < 8; i++) {
      if (this.buffer[this.offset + i] !== other.buffer[other.offset + i]) {
        return this.buffer[this.offset + i] - other.buffer[other.offset + i];
      }
    }
    return 0;
  }

  // Check if two Int64Wrappers are equal
  equals(other) {
    return this.compare(other) === 0;
  }

  // Pretty output in console.log
  inspect() {
    return `[Int64Wrapper value:${this} octets:${this.toOctetString(' ')}]`;
  }
}

module.exports = Int64Wrapper;