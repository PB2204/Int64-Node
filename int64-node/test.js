const assert = require('assert');
const Int64Wrapper = require('./64Int');

exports.setUp = function(done) {
  done();
};

exports.testBufferToString = function(test) {
  const int64 = new Int64Wrapper(0xfffaffff, 0xfffff700);
  test.equal(
    int64.toBuffer().toString('hex'),
    'fffafffffffff700',
    'Buffer to string conversion'
  );
  test.done();
};

exports.testBufferCopy = function(test) {
  const srcInt64 = new Int64Wrapper(0xfffaffff, 0xfffff700);
  const dstBuffer = Buffer.alloc(8);

  srcInt64.copy(dstBuffer);

  test.deepEqual(
    dstBuffer,
    Buffer.from([0xff, 0xfa, 0xff, 0xff, 0xff, 0xff, 0xf7, 0x00]),
    'Copy to buffer'
  );

  test.done();
};

exports.testValueRepresentation = function(test) {
  const testCases = [
    [0, '0000000000000000', 0],
    [1, '0000000000000001', 1],
    [-1, 'ffffffffffffffff', -1],
    [1e18, '0de0b6b3a7640000', 1e18],
    ['0001234500654321', '0001234500654321', 0x1234500654321],
    ['0ff1234500654321', '0ff1234500654321', 0xff1234500654300], // Imprecise!
    [0xff12345, 0x654321, '0ff1234500654321', 0xff1234500654300], // Imprecise!
    [0xfffaffff, 0xfffff700, 'fffafffffffff700', -0x5000000000900],
    [0xafffffff, 0xfffff700, 'affffffffffff700', -0x5000000000000800], // Imprecise!
    ['0x0000123450654321', '0000123450654321', 0x123450654321],
    ['0xFFFFFFFFFFFFFFFF', 'ffffffffffffffff', -1]
  ];

  for (const [arg, expectedOctets, expectedNumber] of testCases) {
    const int64 = new Int64Wrapper();
    int64.setValue.apply(int64, arg);

    test.equal(int64.toOctetString(), expectedOctets, `Constructor with ${arg.join(', ')}`);
    test.equal(int64.toNumber(true), expectedNumber);
  }

  test.done();
};

exports.testBufferOffsets = function(test) {
  const sourceBuffer = Buffer.alloc(16);
  sourceBuffer.writeUInt32BE(0xfffaffff, 2);
  sourceBuffer.writeUInt32BE(0xfffff700, 6);

  const int64 = new Int64Wrapper(sourceBuffer, 2);
  assert.equal(
    int64.toBuffer().toString('hex'), 'fffafffffffff700',
    'Construct from offset'
  );

  const targetBuffer = Buffer.alloc(16);
  int64.copy(targetBuffer, 4);
  assert.equal(
    targetBuffer.slice(4, 12).toString('hex'), 'fffafffffffff700',
    'Copy to offset'
  );

  test.done();
};

exports.testInstanceOf = function(test) {
  const int64 = new Int64Wrapper();
  assert(int64 instanceof Int64Wrapper, 'Variable is not an instance of Int64Wrapper');
  const obj = {};
  assert(!(obj instanceof Int64Wrapper), 'Object is an instance of Int64Wrapper');
  test.done();
};

exports.testCompare = function(test) {
  const intMin = new Int64Wrapper(MIN_INT32_VAL, 0);
  const intMinPlusOne = new Int64Wrapper(MIN_INT32_VAL, 1);
  const zero = new Int64Wrapper(0, 0);
  const intMaxMinusOne = new Int64Wrapper(MAX_INT31_MASK, MAX_INT32_MASK - 1);
  const intMax = new Int64Wrapper(MAX_INT31_MASK, MAX_INT32_MASK);

  assert(intMin.compare(intMinPlusOne) < 0, "INT64_MIN is not less than INT64_MIN+1");
  assert(intMin.compare(zero) < 0, "INT64_MIN is not less than 0");
  assert(intMin.compare(zero) < intMax, "INT64_MIN is not less than INT64_MAX");
  assert(intMax.compare(intMaxMinusOne) > 0, "INT64_MAX is not greater than INT64_MAX-1");
  assert(intMax.compare(zero) > 0, "INT64_MAX is not greater than 0");
  assert(intMax.compare(intMin) > 0, "INT64_MAX is not greater than INT_MIN");
  test.done();
};

exports.testEquals = function(test) {
  const intMin = new Int64Wrapper(MIN_INT32_VAL, 0);
  const zero = new Int64Wrapper(0, 0);
  const intMax = new Int64Wrapper(MAX_INT31_MASK, MAX_INT32_MASK);

  assert(intMin.equals(intMin), "INT64_MIN !== INT64_MIN");
  assert(intMax.equals(intMax), "INT64_MAX !== INT64_MAX");
  assert(zero.equals(zero), "0 !== 0");
  assert(!intMin.equals(zero), "INT64_MIN === 0");
  assert(!intMin.equals(intMax), "INT64_MIN === INT64_MAX");
  assert(!intMax.equals(zero), "INT64_MAX === 0");
  assert(!intMax.equals(intMin), "INT64_MAX === INT64_MIN");
  test.done();
};
