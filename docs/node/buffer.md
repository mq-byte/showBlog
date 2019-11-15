# Buffer

## 理解Buffer
- 缓冲区Buffer是暂时存放输入输出数据的一段内存。(重点理解这句)
- 在处理TCP和文件流的时候，必须要处理二进制数据，所以出现了Buffer
- 是一个固定内存分配的全局对象，字节数需要提前确定
- Buffer好比由一个8位字节元素组成的数组，可以有效的在JavasScript中表示二进制数据


## 创建Buffer
```js
// Creates a zero-filled Buffer of length 10.
const buf1 = Buffer.alloc(10);

// Creates a Buffer of length 10, filled with 0x1.
const buf2 = Buffer.alloc(10, 1);

// Creates an uninitialized buffer of length 10.
// This is faster than calling Buffer.alloc() but the returned
// Buffer instance might contain old data that needs to be
// overwritten using either fill() or write().
const buf3 = Buffer.allocUnsafe(10);

// Creates a Buffer containing [0x1, 0x2, 0x3].
const buf4 = Buffer.from([1, 2, 3]);

// Creates a Buffer containing UTF-8 bytes [0x74, 0xc3, 0xa9, 0x73, 0x74].
const buf5 = Buffer.from('tést');

// Creates a Buffer containing Latin-1 bytes [0x74, 0xe9, 0x73, 0x74].
const buf6 = Buffer.from('tést', 'latin1');
```

## `Buffer.from()`, `Buffer.alloc()`, and `Buffer.allocUnsafe()`

Buffer.from(array) 返回一个新的 Buffer，其中包含提供的八位字节数组的副本。

Buffer.from(arrayBuffer[, byteOffset [, length]]) 返回一个新的 Buffer，它与给定的 ArrayBuffer 共享相同的已分配内存。

Buffer.from(buffer) 返回一个新的 Buffer，其中包含给定 Buffer 的内容的副本。

Buffer.from(string[, encoding]) 返回一个新的 Buffer，其中包含提供的字符串的副本。

Buffer.alloc(size[, fill[, encoding]]) 返回一个指定大小的已初始化的 Buffer。 此方法比 Buffer.allocUnsafe(size) 慢，但能确保新创建的 Buffer 实例永远不会包含可能敏感的旧数据。 如果 size 不是数字，则将会抛出 TypeError。

Buffer.allocUnsafe(size) 和 Buffer.allocUnsafeSlow(size) 分别返回一个指定大小的未初始化的 Buffer。 由于 Buffer 是未初始化的，因此分配的内存片段可能包含敏感的旧数据。

## The `--zero-fill-buffers` 命令行配置

```console
$ node --zero-fill-buffers
> Buffer.allocUnsafe(5);
<Buffer 00 00 00 00 00>
```

## Buffers and Character Encodings 字符编码
<!-- YAML
changes:
  - version: v6.4.0
    pr-url: https://github.com/nodejs/node/pull/7111
    description: Introduced `latin1` as an alias for `binary`.
  - version: v5.0.0
    pr-url: https://github.com/nodejs/node/pull/2859
    description: Removed the deprecated `raw` and `raws` encodings.
-->

When string data is stored in or extracted out of a `Buffer` instance, a
character encoding may be specified.

```js
const buf = Buffer.from('hello world', 'ascii');

console.log(buf.toString('hex'));
// Prints: 68656c6c6f20776f726c64
console.log(buf.toString('base64'));
// Prints: aGVsbG8gd29ybGQ=

console.log(Buffer.from('fhqwhgads', 'ascii'));
// Prints: <Buffer 66 68 71 77 68 67 61 64 73>
console.log(Buffer.from('fhqwhgads', 'utf16le'));
// Prints: <Buffer 66 00 68 00 71 00 77 00 68 00 67 00 61 00 64 00 73 00>
```

The character encodings currently supported by Node.js include:

* `'ascii'`: 仅适用于 7 位 ASCII 数据。此编码速度很快，如果设置则会剥离高位.

* `'utf8'`:多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8.

* `'utf16le'`:  2 或 4 个字节，小端序编码的 Unicode 字符.

* `'ucs2'`: `'utf16le'`的别名.

* `'base64'`: Base64 编码.

* `'latin1'`: 单字节编码字符串.

* `'binary'`: `'latin1'`的别名.

* `'hex'`: 将每个字节编码成两个十六进制的字符.

现代的 Web 浏览器遵循 WHATWG 编码标准，将 'latin1' 和 'ISO-8859-1' 别名为 'win-1252'。 这意味着当执行 http.get() 之类的操作时，如果返回的字符集是 WHATWG 规范中列出的字符集之一，则服务器可能实际返回 'win-1252' 编码的数据，而使用 'latin1' 编码可能错误地解码字符。

## Buffers and [TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
跳过他，或者了解[TypedArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)

```js
const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// 拷贝 `arr` 的内容。
const buf1 = Buffer.from(arr);
// 与 `arr` 共享内存。
const buf2 = Buffer.from(arr.buffer);

console.log(buf1);
// 打印: <Buffer 88 a0>
console.log(buf2);
// 打印: <Buffer 88 13 a0 0f>

arr[1] = 6000;

console.log(buf1);
// 打印: <Buffer 88 a0>
console.log(buf2);
// 打印: <Buffer 88 13 70 17>
```

## Buffers and 迭代器


```js
const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b);
}
// Prints:
//   1
//   2
//   3
```

### Class Method: Buffer.alloc(size\[, fill\[, encoding\]\])

* `size` {integer}  `Buffer` 长度.
* `fill` {string|Buffer|Uint8Array|integer} 用于预填充新 `Buffer`的值 **Default:** `0`.
* `encoding` {string}  **Default:** `'utf8'`.

```js
const buf = Buffer.alloc(5);
console.log(buf);
// Prints: <Buffer 00 00 00 00 00>
```

```js
const buf = Buffer.alloc(5, 'a');
console.log(buf);
// Prints: <Buffer 61 61 61 61 61>
```

```js
const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// Prints: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

### Buffer.allocUnsafe(size)

对这个预分配的内部内存池的使用是调用 Buffer.alloc(size, fill) 和 Buffer.allocUnsafe(size).fill(fill) 两者之间的关键区别。 具体来说， Buffer.alloc(size, fill) 永远不会使用内部的 Buffer 池，而 Buffer.allocUnsafe(size).fill(fill) 在 size 小于或等于 Buffer.poolSize 的一半时将会使用内部的 Buffer池。 该差异虽然很微妙，但当应用程序需要 Buffer.allocUnsafe() 提供的额外性能时，则非常重要。

```js
const buf = Buffer.allocUnsafe(10);

console.log(buf);
// Prints (contents may vary): <Buffer a0 8b 28 3f 01 00 00 00 50 32>

buf.fill(0);

console.log(buf);
// Prints: <Buffer 00 00 00 00 00 00 00 00 00 00>
```

### Class Method: Buffer.allocUnsafeSlow(size)

当使用 Buffer.allocUnsafe() 创建新的 Buffer 实例时，如果要分配的内存小于 4KB，则会从一个预分配的 Buffer 切割出来。 这可以避免垃圾回收机制因创建太多独立的 Buffer 而过度使用。 这种方式通过消除跟踪和清理的需要来改进性能和内存使用。

当开发人员需要在内存池中保留一小块内存时，可以使用 Buffer.allocUnsafeSlow() 创建一个非内存池的 Buffer 实例并拷贝相关的比特位出来。
```js
const store = [];

socket.on('readable', () => {
  let data;
  while (null !== (data = readable.read())) {
    // 为剩下的数据分配内存。
    const sb = Buffer.allocUnsafeSlow(10);

    // 拷贝数据到新分配的内存。
    data.copy(sb, 0, 0, 10);

    store.push(sb);
  }
});
```


### Buffer.byteLength(string\[, encoding\])

返回字符串的实际字节长度。 与 String.prototype.length 不同，后者返回字符串的字符数。

```js
const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} characters, ` +
            `${Buffer.byteLength(str, 'utf8')} bytes`);
// Prints: ½ + ¼ = ¾: 9 characters, 12 bytes
```


### Buffer.compare(buf1, buf2)
比较 buf1 与 buf2，主要用于 Buffer 实例数组的排序。 相当于调用 buf1.compare(buf2)。

* `buf1` {Buffer|Uint8Array}
* `buf2` {Buffer|Uint8Array}
* Returns: {integer}

```js
const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// Prints: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (This result is equal to: [buf2, buf1].)
```

### Buffer.concat(list\[, totalLength\])


```js
// 用含有三个 `Buffer` 实例的数组创建一个单一的 `Buffer`。

const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// 打印: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);

console.log(bufA);
// 打印: <Buffer 00 00 00 00 ...>
console.log(bufA.length);
// 打印: 42
```

### Buffer.from(array)

```js
// Creates a new Buffer containing UTF-8 bytes of the string 'buffer'.
const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
```


### Buffer.from(arrayBuffer\[, byteOffset\[, length\]\])

```js
const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// Shares memory with `arr`.
const buf = Buffer.from(arr.buffer);

console.log(buf);
// Prints: <Buffer 88 13 a0 0f>

// Changing the original Uint16Array changes the Buffer also.
arr[1] = 6000;

console.log(buf);
// Prints: <Buffer 88 13 70 17>
```


```js
const ab = new ArrayBuffer(10);
const buf = Buffer.from(ab, 0, 2);

console.log(buf.length);
// Prints: 2
```

### Buffer.from(buffer)

* `buffer` {Buffer|Uint8Array} 

复制 `buffer` 数据给一个新的 `Buffer` 实例.

```js
const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);

buf1[0] = 0x61;

console.log(buf1.toString());
// Prints: auffer
console.log(buf2.toString());
// Prints: buffer
```

### Buffer.from(object\[, offsetOrEncoding\[, length\]\])

* `object` {Object} 实现 `Symbol.toPrimitive` 或者 `valueOf()`的对象.
* `offsetOrEncoding` {integer|string} 字节偏移量或字符编码, 取决 `object.valueOf()` 或者 `object[Symbol.toPrimitive]()`的返回值.
* `length` {integer} A length,取决 `object.valueOf()` 或者 `object[Symbol.toPrimitive]()`的返回值.

```js
class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// Prints: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

### Buffer.isBuffer(obj)
是否是buffer

### Buffer.isEncoding(encoding)
如果 encoding 是支持的字符编码，则返回 true，否则返回 false。

```js
console.log(Buffer.isEncoding('utf-8'));
// Prints: true

console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false

console.log(Buffer.isEncoding(''));
// Prints: false
```

### Class Property: Buffer.poolSize

* {integer} **Default:** `8192`

这是用于缓冲池的预分配的内部 Buffer 实例的大小（以字节为单位）。 该值可以修改。

### buf\[index\]

```js
// 拷贝 ASCII 字符串到 `Buffer`，每次拷贝一个字节。

const str = 'http://nodejs.cn/';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('ascii'));
// 打印: http://nodejs.cn/
```

### buf.buffer

```js
const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// Prints: true
```

### buf.byteOffset

```js
// 创建一个小于 `Buffer.poolSize` 的 buffer。
const nodeBuffer = new Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

// 当将 Node.js Buffer 赋值给一个 Int8 的 TypedArray 时，记得使用 byteOffset。
new Int8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.length);
```

### buf.compare(target\[, targetStart\[, targetEnd\[, sourceStart\[, sourceEnd\]\]\]\])

* `0` is returned if `target` is the same as `buf`
* `1` is returned if `target` should come *before* `buf` when sorted.
* `-1` is returned if `target` should come *after* `buf` when sorted.

```js
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// Prints: 0
console.log(buf1.compare(buf2));
// Prints: -1
console.log(buf1.compare(buf3));
// Prints: -1
console.log(buf2.compare(buf1));
// Prints: 1
console.log(buf2.compare(buf3));
// Prints: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// Prints: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (This result is equal to: [buf1, buf3, buf2].)
```

The optional `targetStart`, `targetEnd`, `sourceStart`, and `sourceEnd`
arguments can be used to limit the comparison to specific ranges within `target`
and `buf` respectively.

```js
const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// Prints: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// Prints: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// Prints: 1
```

[`ERR_OUT_OF_RANGE`][] is thrown if `targetStart < 0`, `sourceStart < 0`,
`targetEnd > target.byteLength`, or `sourceEnd > source.byteLength`.

### buf.copy(target\[, targetStart\[, sourceStart\[, sourceEnd\]\]\])
拷贝 buf 中某个区域的数据到 target 中的某个区域，即使 target 的内存区域与 buf 的重叠。

```js
// 创建两个 `Buffer` 实例。
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf1[i] = i + 97;
}

// 拷贝 `buf1` 中第 16 至 19 字节偏移量的数据到 `buf2` 第 8 字节偏移量开始。
buf1.copy(buf2, 8, 16, 20);

console.log(buf2.toString('ascii', 0, 25));
// 打印: !!!!!!!!qrst!!!!!!!!!!!!!
```

```js
// 创建一个 `Buffer`，并拷贝同一 `Buffer` 中一个区域的数据到另一个重叠的区域。

const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// 打印: efghijghijklmnopqrstuvwxyz
```

### buf.entries()

```js
const buf = Buffer.from('buffer');

for (const pair of buf.entries()) {
  console.log(pair);
}
// Prints:
//   [0, 98]
//   [1, 117]
//   [2, 102]
//   [3, 102]
//   [4, 101]
//   [5, 114]
```

### buf.equals(otherBuffer)

```js
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// Prints: true
console.log(buf1.equals(buf3));
// Prints: false
```

### buf.fill(value\[, offset\[, end\]\]\[, encoding\])

```js
// Fill a `Buffer` with the ASCII character 'h'.

const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// Prints: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
```
如果 value 不是字符串、 Buffer、或整数，则会被转换为 uint32 值。 如果得到的整数大于 255（十进制），则 buf 将会使用 value & 255 填充。

```js
// Fill a `Buffer` with a two-byte character.

console.log(Buffer.allocUnsafe(3).fill('\u0222'));
// Prints: <Buffer c8 a2 c8>
```

如果 value 包含无效的字符，则截掉无效的字符。 如果截掉后没有数据，则不填充：

```js
const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// Prints: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Prints: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Throws an exception.
```

### buf.includes(value\[, byteOffset\]\[, encoding\])

```js
const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// Prints: true
console.log(buf.includes('is'));
// Prints: true
console.log(buf.includes(Buffer.from('a buffer')));
// Prints: true
console.log(buf.includes(97));
// Prints: true (97 is the decimal ASCII value for 'a')
console.log(buf.includes(Buffer.from('a buffer example')));
// Prints: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// Prints: true
console.log(buf.includes('this', 4));
// Prints: false
```

### buf.indexOf(value\[, byteOffset\]\[, encoding\])


```js
const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
console.log(buf.indexOf(Buffer.from('a buffer example')));
// Prints: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// Prints: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// Prints: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// Prints: 6
```

```js
const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));

// Passing a byteOffset that coerces to NaN or 0.
// Prints: 1, searching the whole buffer.
console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
```

### buf.keys()

```js
const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5
```

### buf.lastIndexOf(value\[, byteOffset\]\[, encoding\])
```js
const buf = Buffer.from('this buffer is a buffer');

console.log(buf.lastIndexOf('this'));
// Prints: 0
console.log(buf.lastIndexOf('buffer'));
// Prints: 17
console.log(buf.lastIndexOf(Buffer.from('buffer')));
// Prints: 17
console.log(buf.lastIndexOf(97));
// Prints: 15 (97 is the decimal ASCII value for 'a')
console.log(buf.lastIndexOf(Buffer.from('yolo')));
// Prints: -1
console.log(buf.lastIndexOf('buffer', 5));
// Prints: 5
console.log(buf.lastIndexOf('buffer', 4));
// Prints: -1

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.lastIndexOf('\u03a3', undefined, 'utf16le'));
// Prints: 6
console.log(utf16Buffer.lastIndexOf('\u03a3', -5, 'utf16le'));
// Prints: 4
```

```js
const b = Buffer.from('abcdef');

// Passing a value that's a number, but not a valid byte.
// Prints: 2, equivalent to searching for 99 or 'c'.
console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));

// Passing a byteOffset that coerces to NaN.
// Prints: 1, searching the whole buffer.
console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));

// Passing a byteOffset that coerces to 0.
// Prints: -1, equivalent to passing 0.
console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
```

### buf.length

```js
// Create a `Buffer` and write a shorter ASCII string to it.

const buf = Buffer.alloc(1234);

console.log(buf.length);
// Prints: 1234

buf.write('some string', 0, 'ascii');

console.log(buf.length);
// Prints: 1234
```

```js
let buf = Buffer.allocUnsafe(10);

buf.write('abcdefghj', 0, 'ascii');

console.log(buf.length);
// Prints: 10

buf = buf.slice(0, 5);

console.log(buf.length);
// Prints: 5
```

### buf.subarray(\[start\[, end\]\])
返回一个新的 Buffer，它引用与原始的 Buffer 相同的内存，但是由 start 和 end 索引进行偏移和裁剪。

```js
// 使用 ASCII 字母创建一个 `Buffer`，然后进行切片，再修改原始 `Buffer` 中的一个字节。

const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// 打印: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// 打印: !bc
```
指定负的索引会导致切片的生成是相对于 buf 的末尾而不是开头。

```js
const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// 打印: buffe
// (相当于 buf.subarray(0, 5)。)

console.log(buf.subarray(-6, -2).toString());
// 打印: buff
// (相当于 buf.subarray(0, 4)。)

console.log(buf.subarray(-5, -2).toString());
// 打印: uff
// (相当于 buf.subarray(1, 4)。)
```

### buf.slice(\[start\[, end\]\])
返回一个新的 Buffer，它引用与原始的 Buffer 相同的内存，但是由 start 和 end 索引进行偏移和裁剪。

```js
const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// Prints: cuffer

console.log(buf.toString());
// Prints: buffer
```

### buf.swap16()
将 buf 解析成无符号的 16 位整数的数组，并且以字节顺序原地进行交换。 如果 buf.length 不是 2 的倍数，则抛出 ERR_INVALID_BUFFER_SIZE。

```js
const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

console.log(buf1);
// 打印: <Buffer 01 02 03 04 05 06 07 08>

buf1.swap16();

console.log(buf1);
// 打印: <Buffer 02 01 04 03 06 05 08 07>

const buf2 = Buffer.from([0x1, 0x2, 0x3]);

buf2.swap16();
// 抛出异常 ERR_INVALID_BUFFER_SIZE。
```

buf.swap16() 的一个方便用途是在 UTF-16 小端序和 UTF-16 大端序之间执行快速的原地转换：

```js
const buf = Buffer.from('This is little-endian UTF-16', 'utf16le');
buf.swap16(); // 转换为大端序 UTF-16 文本。
```

### buf.swap32()
### buf.swap64()

### buf.toJSON()
返回 buf 的 JSON 格式。 当字符串化 Buffer 实例时，JSON.stringify() 会调用该函数。

```js
const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// 打印: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value.data) :
    value;
});

console.log(copy);
// 打印: <Buffer 01 02 03 04 05>
```

### buf.toString(\[encoding\[, start\[, end\]\]\])

```js
const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 is the decimal ASCII value for 'a'.
  buf1[i] = i + 97;
}

console.log(buf1.toString('ascii'));
// Prints: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('ascii', 0, 5));
// Prints: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// Prints: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// Prints: té
console.log(buf2.toString(undefined, 0, 3));
// Prints: té
```

### buf.values()

```js
const buf = Buffer.from('buffer');

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (const value of buf) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

### buf.write(string\[, offset\[, length\]\]\[, encoding\])
根据 encoding 指定的字符编码将 string 写入到 buf 中的 offset 位置。

```js
const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} bytes: ${buf.toString('utf8', 0, len)}`);
// Prints: 12 bytes: ½ + ¼ = ¾
```

## buffer.INSPECT_MAX_BYTES
返回当调用 buf.inspect() 时将会返回的最大字节数。 这可以被用户模块重写。 有关 buf.inspect() 行为的更多详细信息，参阅 util.inspect()。

该属性是在 require('buffer') 返回的 buffer 模块上，而不是在 Buffer 全局变量或 Buffer 实例上。

## buffer.kMaxLength
buffer.constants.MAX_LENGTH 的别名。

## buffer.transcode(source, fromEnc, toEnc)

```js
const buffer = require('buffer');

const newBuf = buffer.transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// Prints: '?'
```

## Buffer Constants 常量
buffer.constants 是在 require('buffer') 返回的 buffer 模块上，而不是在 Buffer 全局变量或 Buffer 实例上。

### buffer.constants.MAX_LENGTH

单个 Buffer 实例允许的最大内存。

在 32 位的架构上，该值是 (2^30)-1 (~1GB)。

 在 64 位的架构上，该值是 (2^31)-1 (~2GB)。

也可使用 buffer.kMaxLength。

### buffer.constants.MAX_STRING_LENGTH

单个 string 实例允许的最大长度。

表示 string 原始数据类型能有的最大 length，以 UTF-16 代码为单位。

该值取决于使用的 JS 引擎。