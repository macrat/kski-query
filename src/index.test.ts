import Query from '.';


describe('simpleQuery', () => {
  const tests = [
    ['KSKIは日本語用の曖昧検索ライブラリです', 'KSKI 日本語用 曖昧検索ライブラリ'],
    ['助詞でわかち書きをして検索に使用します', '助詞 わかち書き て検索 使用'],
    ['日本語で曖昧検索をするためのクエリ作成ライブラリ', '日本語 曖昧検索 するため クエリ作成ライブラリ'],
  ];
  test.each(tests)('%s', (input, expected) => {
    const q = new Query(input as string);
    expect(q.simpleQuery).toBe(expected);
  });
});


describe('query', () => {
  const tests = [
    ['KSKIは日本語用の曖昧検索ライブラリです', 'KSKI OR kski-query 日本語用 曖昧検索ライブラリ OR 曖昧サーチライブラリ'],
    ['助詞でわかち書きをして検索に使用します', '助詞 わかち書き て検索 OR てサーチ 使用'],
  ];
  test.each(tests)('%s', (input, expected) => {
    const q = new Query(input as string, [
      ['検索', 'サーチ'],
      ['KSKI', 'kski-query'],
    ]);
    expect(q.query).toBe(expected);
  });
});


describe('regexp', () => {
  const tests = [
    ['KSKIは日本語用の曖昧検索ライブラリです', '^(?=.*(KSKI|kski-query))(?=.*(日本語用))(?=.*(曖昧検索ライブラリ|曖昧サーチライブラリ))'],
    ['助詞でわかち書きをして検索に使用します', '^(?=.*(助詞))(?=.*(わかち書き))(?=.*(て検索|てサーチ))(?=.*(使用))'],
    ['[記号]はエスケープされます', '^(?=.*(\\[記号\\]))(?=.*(エスケープされ))'],
  ];
  test.each(tests)('%s', (input, expected) => {
    const q = new Query(input as string, [
      ['検索', 'サーチ'],
      ['KSKI', 'kski-query'],
    ]);
    expect(q.regexp.source).toBe(expected);
  });
});


describe('match', () => {
  const tests = [
    ['KSKIは日本語用の曖昧検索ライブラリです', '日本語用曖昧検索ライブラリ「kski-query」', true],
    ['助詞でわかち書きをして検索に使用します', 'わかち書きを助詞でして検索に使用する', true],
    ['じょしでわかち書きをして検索に使用します', '助詞でわかち書きをして検索に使用します', false],
  ];
  test.each(tests)('%s', (input, text, expected) => {
    const q = new Query(input as string, [
      ['検索', 'サーチ'],
      ['KSKI', 'kski-query'],
    ]);
    expect(q.match(text as string)).toBe(expected as boolean);
  });
});
