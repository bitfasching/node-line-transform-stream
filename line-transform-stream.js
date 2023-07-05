/**
 * Line Transform Stream
 *
 * A transform stream class to conveniently modify streamable data line by line.
 * Written in ES2015 (ES6).
 *
 * Nick Schwarzenberg <nick@bitfasching.de>
 * mtripg6666tdr <contact@usamyon.moe>
 * v1.0.1, 07/2023
 *
 * License: MIT
 */

'use strict'


// built-in module dependency
const Transform = require( 'stream' ).Transform


// extend Transform stream class
class LineTransformStream extends Transform
{
    constructor( transformCallback, stringEncoding='utf8', newlineCharacter='\n' )
    {
        // fail if callback is not a function
        if ( typeof transformCallback != 'function' )
        {
            // throw type error
            throw new TypeError( "Callback must be a function." )
        }

        // initialize parent
        super()

        // set callback for transforming lines
        this.transformCallback = transformCallback

        // set string encoding
        this.stringEncoding = stringEncoding

        // set newline character
        this.newlineCharacter = newlineCharacter

        // initialize internal line buffer
        this.lineBuffer = ''
    }

    // implement transform method (input encoding will be ignored in favor of encoding set in constructor)
    _transform( data, encoding, streamCallback )
    {
        // convert buffer to string
        const text = data.toString( this.stringEncoding )

        // split data at newline
        const lines = text.split( this.newlineCharacter )

        // prepend previously buffered data to first line
        lines[0] = this.lineBuffer + lines[0]

        // last "line" is probably not a complete line,
        // remove it from the processing array and store it for next time
        this.lineBuffer = lines.pop()

        // process and push data with adding newline back
        this.handleLines( streamCallback, this.transformCallback, lines, this.newlineCharacter )
    }

    // implement flush method to catch end of stream
    _flush( streamCallback )
    {
        // anything remaining in line buffer?
        if ( this.lineBuffer != '' )
        {
            // pass remaining buffer contents as single line
            const lines = [ this.lineBuffer ]

            // process and push data
            this.handleLines( streamCallback, this.transformCallback, [ this.lineBuffer ], '' )
        }
        else
        {
            // otherwise run callback immediately
            streamCallback( null )
        }
    }

    // handle array of lines of text
    handleLines( streamCallback, transformCallback, lines, appendToOutput )
    {
        // processed output will be collected
        let processedOutput = ''

        try
        {
            // process line by line
            lines.forEach( line =>
            {
                // pass line through processing callback
                processedOutput += transformCallback( line )

                // add back whatever has been removed from line
                // (will be the newline character unless at the end of stream)
                processedOutput += appendToOutput
            })
        }
        catch ( error )
        {
            // catch processing errors and emit as stream error
            streamCallback( error )

            // don't fire the callback again below
            return
        }

        // indicate end of processing and push aggregated output
        streamCallback( null, processedOutput )
    }
}


// export custom stream class
module.exports = LineTransformStream
