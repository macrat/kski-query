import TinySegmenter from 'tiny-segmenter';


function escapeRegExp(s: string): string {
  return s.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}


export default class KskiQuery {
  private _rawQuery: string;
  private _segments: string[];
  private _simpleQuery: string[];
  private _kskiQuery: string[][];

  static defaultSeparators = [
    'で',
    'に',
    'を',
    'は',
    'か',
    'が',
    'が',
    'けど',
    'けれど',
    'し',
    'でも',
    'と',
    'な',
    'に',
    'の',
    'ので',
    'のに',
    'へ',
    'も',
    'や',

    'です',
    'ます',
    'だ',
    'である',
  ];

  constructor(query: string, homonyms: [string, string][] = [], separators?: string[]) {
    this._rawQuery = query.trim().replace(/\s+/g, ' ');

    this._segments = (new TinySegmenter()).segment(this._rawQuery);

    this._simpleQuery = [];
    let s = '';
    for (const x of this._segments) {
      if ((separators ?? KskiQuery.defaultSeparators).includes(x)) {
        if (s.length > 0 && !this._simpleQuery.includes(s)) {
          this._simpleQuery.push(s);
        }
        s = '';
      } else {
        s += x
      }
    }
    if (s.length > 0 && !this._simpleQuery.includes(s)) {
      this._simpleQuery.push(s);
    }

    this._kskiQuery = this._simpleQuery.map((q) => ([
      q,
      ...homonyms.map(([x, y]) => ([
        ...(q.includes(x) ? [q.replace(x, y)] : []),
        ...(q.includes(y) ? [q.replace(y, x)] : []),
      ])).flat(),
    ]));
  }

  // rawQuery is the original query;
  get rawQuery(): string {
    return this._rawQuery;
  }

  // segments is the tokenized query.
  get segments(): string[] {
    return this._segments;
  }

  // simpleQuery is the simple query without homonyms variants.
  get simpleQuery(): string {
    return this._simpleQuery.join(' ');
  }

  // simpleQueryList is the same as simpleQuery but separated keywords.
  get simpleQueryList(): string[] {
    return this._simpleQuery;
  }

  // query is the intelligent query.
  // This string includes "OR" keyword to specify homonyms.
  get query(): string {
    return this._kskiQuery.map((qs) => qs.join(' OR ')).join(' ');
  }

  // queryList is the array of keywords.
  // Each keywords are arrays that includes strings that replaced homonyms.
  get queryList(): string[][] {
    return this._kskiQuery;
  }

  // regexpStr is the regular expression of this query.
  get regexpStr(): string {
    return '^' + this._kskiQuery.map((qs) => (
      '(?=.*(' + qs.map(escapeRegExp).join('|') + '))'
    )).join('');
  }

  // regexp is the RegExp instance of this query.
  get regexp(): RegExp {
    return new RegExp(this.regexpStr, 'i');
  }

  // match tests if the string is match to this query or not.
  match(s: string): boolean {
    return this.regexp.test(s);
  }
};
