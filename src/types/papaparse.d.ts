declare module "papaparse" {
  export interface ParseConfig<T = any> {
    delimiter?: string;
    newline?: string;
    quoteChar?: string;
    escapeChar?: string;
    header?: boolean;
    dynamicTyping?: boolean;
    preview?: number;
    encoding?: string;
    worker?: boolean;
    comments?: boolean | string;
    step?: (results: ParseStepResult<T>, parser: any) => void;
    complete?: (results: ParseResult<T>, file?: any) => void;
    error?: (error: any, file?: any) => void;
    download?: boolean;
    skipEmptyLines?: boolean | "greedy";
    fastMode?: boolean;
  }

  export interface ParseStepResult<T> {
    data: T;
    errors: any[];
    meta: ParseMeta;
  }

  export interface ParseResult<T> {
    data: T[];
    errors: any[];
    meta: ParseMeta;
  }

  export interface ParseMeta {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    fields?: string[];
    truncated: boolean;
    cursor: number;
  }

  export function parse<T = any>(
    csvString: string,
    config?: ParseConfig<T>
  ): ParseResult<T>;

  const papa: {
    parse: typeof parse;
  };

  export default papa;
}
