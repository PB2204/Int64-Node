# int64-node

**int64-node** is a JavaScript library that provides support for handling 64-bit integer numbers in Node.js. JavaScript's native Numbers are represented as IEEE 754 double-precision floats, which limits the range of values that can be accurately represented to `±2^53`. For projects requiring precise 64-bit integer handling, such as [node-thrift](https://github.com/wadey/node-thrift), `int64-node` comes to the rescue.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Learning](#learning)
- [Code of Conduct](#code-of-conduct)
- [Developer Details](#developer-details)

## Installation

You can install int64-node via npm:

```bash
npm install int64-node
```

## Usage

### Creating Int64 Instances

```javascript
// Require the int64-node module
const Int64 = require('int64-node');

// Create Int64 instances
const int1 = new Int64(0x12345678, 0x9abcdef0);
const int2 = new Int64('123456789abcdef0');
```

### Performing Arithmetic Operations

```javascript
// Perform arithmetic operations
const result1 = int1 + 1; // 4886718346
const result2 = int2 + 1; // Infinity
```

### Converting to Different Representations

```javascript
// Convert to different representations
const octetString1 = int1.toOctetString(); // '0000000123456789'
const octetString2 = int2.toOctetString(); // '123456789abcdef0'
const binaryString1 = int1.toString(2); // '100100011010001010110011110001001'
const binaryString2 = int2.toString(2); // 'Infinity'
```

### Checking Integer Precision

```javascript
// Check if the value is within integer-precise range
const isInt1Finite = isFinite(int1); // true
const isInt2Finite = isFinite(int2); // false
```

### Copying to a Buffer

```javascript
// Copy to a buffer
const buffer1 = int1.toBuffer(); // <Buffer 12 34 56 78 9a bc de f0>
const buffer2 = new Buffer(16);
int2.copy(buffer2, 0); // Copies the Int64 value to the buffer
```

### Creating Int64 Instances from a Buffer

```javascript
// Create Int64 instances from a Buffer
const intFromBuffer = new Int64(new Buffer([0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0]));

// Create Int64 instances from a Buffer with an offset
const intFromOffset = new Int64(new Buffer([0, 0, 0, 0, 0x12, 0x34, 0x56, 0x78, 0x9a, 0xbc, 0xde, 0xf0]), 4);
```

## License

int64-node is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Interested in contributing? Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## Learning

Explore our [Learning Resources](LEARN.md) to get started with int64-node.

## Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and inclusive community.

## Developer Details

- Author: [Pabitra Banerjee](https://pabitrabanerjee.me)
- Email: [rockstarpabitra2204@gmail.com](mailto:rockstarpabitra2204@gmail.com)
- GitHub: [PB2204](https://github.com/PB2204)

## Happy Coding 🚀