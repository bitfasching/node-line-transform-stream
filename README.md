# Line Transform Stream

A transform stream class to conveniently modify streamable data line by line.
Written in ES2015.

- encodes input data as string
- buffers input until newline character `\n`
- runs callback when line complete
- outputs processed lines

## Usage

Pass your transform function to the constructor. This example reads lines from `stdin`, replaces whitespaces by underscores and writes back to `stdout`.

```javascript
// import module
const LineTransformStream = require( 'line-transform-stream' )

// create new line transform stream
const filter = new LineTransformStream( ( line ) =>
{
    // replace every whitespace by an underscore
    return line.replace( /\s/g, '_' )
})

// say hello
process.stdout.write( "Type a phrase and hit Enter:\n" )

// connect stdin via transform stream to stdout
process.stdin.pipe( filter ).pipe( process.stdout )
```

## Reference

### new LineTransformStream( transformCallback, stringEncoding )

- **transformCallback** `Function` Callback to process a line of text. Called with a `String` as single argument. Must return a `String` or throw an `Error`. Any thrown `Error` is caught and emitted as stream error event.
- **stringEncoding** `String` Optional. Specifies a valid encoding option for [Buffer.toString()](https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end). Defaults to "utf8".
