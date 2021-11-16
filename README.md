kski-query
==========

KSKI Query is a fuzzy search query builder for Japanese text.

KSKI Queryは日本語文字列用の曖昧検索用のクエリ作成ライブラリです。
自然な文章を入力すると、曖昧検索に対応していない検索エンジンのためのクエリを生成します。

``` javascript
import KskiQuery from 'kski-query';

// 同音異義語の定義
const homonyms = [
  ['ライブラリ', 'ツール'],
  ['検索', 'サーチ'],
];

const q = new KskiQuery('日本語で曖昧検索をするためのクエリ作成ライブラリ', homonyms);

console.log(q.query);
// 日本語 曖昧検索 OR 曖昧サーチ するため クエリ作成ライブラリ OR クエリ作成ツール

console.log(q.regexp);
// /^(?=(日本語))(?=(曖昧検索|曖昧サーチ))(?=(するため))(?=(クエリ作成ライブラリ|クエリ作成ツール))/
```
