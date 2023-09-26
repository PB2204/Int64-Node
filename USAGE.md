# Practical Usage Guide for int64-node

int64-node is a JavaScript library designed to handle 64-bit integer numbers in Node.js applications. This guide provides practical usage examples and scenarios for integrating int64-node into your projects effectively.

## Table of Contents

1. [Working with Large Integers](#working-with-large-integers)
2. [Storing and Parsing Int64 Values](#storing-and-parsing-int64-values)
3. [Performing Arithmetic Operations](#performing-arithmetic-operations)
4. [Serializing and Deserializing Int64](#serializing-and-deserializing-int64)
5. [Handling Buffer Offset](#handling-buffer-offset)
6. [Avoiding Loss of Precision](#avoiding-loss-of-precision)

## 1. Working with Large Integers

JavaScript's native Number type has limitations when dealing with large integers. int64-node allows you to work with 64-bit integers with full precision. This is particularly useful when working with:

- Unique Identifiers: Storing and manipulating large unique identifiers, such as UUIDs.
- File Sizes: Managing file sizes and offsets in file handling applications.
- Timestamps: Handling timestamps that exceed the limits of the native JavaScript Date object.

## 2. Storing and Parsing Int64 Values

You can create Int64 instances in various ways:

```javascript
const Int64 = require('int64-node');

// Create from raw values
const int1 = new Int64(0x12345678, 0x9abcdef0);

// Create from a hexadecimal string
const int2 = new Int64('123456789abcdef0');

// Create from a Buffer
const buffer = Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0]);
const int3 = new Int64(buffer);
```

## 3. Performing Arithmetic Operations

Int64 instances behave similarly to JavaScript Numbers, allowing you to perform arithmetic operations:

```javascript
const result1 = int1 + 1; // 4886718346
const result2 = int2 - 0x100; // 123456789abcdeef
```

Keep in mind that while you can perform operations, Int64 is primarily for carrying 64-bit integer values, not for 64-bit integer arithmetic.

## 4. Serializing and Deserializing Int64

You can convert Int64 instances to different representations:

```javascript
const octetString = int1.toOctetString(); // '0000000123456789'
const binaryString = int1.toString(2); // '100100011010001010110011110001001'
```

When needed, you can parse these representations back into Int64 instances.

## 5. Handling Buffer Offset

Int64 allows you to work with Buffers and specify an offset:

```javascript
const bufferWithInt = new Buffer(16);
int1.copy(bufferWithInt, 4); // Copy Int64 into buffer at offset 4
```

This is useful when you need to manipulate specific regions within a Buffer.

## 6. Avoiding Loss of Precision

By using int64-node, you can avoid loss of precision that occurs with native JavaScript Numbers for values beyond ±2^53. int64-node provides a reliable way to handle 64-bit integers without worrying about inaccuracies.

These practical use cases demonstrate the benefits of using int64-node when working with large integers in Node.js applications. Incorporating int64-node can help ensure accurate and reliable integer handling in your projects.