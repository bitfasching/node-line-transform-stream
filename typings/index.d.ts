declare module "line-transform-stream" {
  import { Transform } from "stream";
  type transformCallback = (string:string)=>string;
  class LineTransformStream extends Transform{
    constructor( transformCallback:transformCallback, stringEncoding?:string)
  }
  export = LineTransformStream;
}