Rubyのアノテーション
=========================

書式
-------------------------

- YARD形式で書き、`@param`・`@return`・`@raise`のタグを使う
- 型はタグに`[型]`で書く(`@param items [Array<String>]`)
- 型が特定できない場合は`[Object]`を使う
- 既存のコードがRDoc形式の場合は、YARDのタグを混ぜずにRDoc形式で書く

要素ごとの書き方
-------------------------

- オプションのハッシュ: `@option 引数名 [型] :キー (既定値) 説明`で、キーごとに書く。キーワード引数には`@option`ではなく`@param`を使う
- ブロックを受け取るメソッド: `@yield`でブロックへ渡す値を、`@yieldparam`で各値の型と意味を、`@yieldreturn`でブロックの戻り値を書く
- 属性: `attr_reader`・`attr_accessor`などの宣言の直前に書く。`@!attribute`は、メタプログラミングで動的に宣言する属性にだけ使う

静的解析
-------------------------

- SteepはRBS、Sorbetは`sig`の型を読み、YARDの型は読まない
- YARDのコメントの有無は、`yard stats --list-undoc`で確かめられる(このスキルの作成時には未検証)

見本
-------------------------

```ruby
# 受け取ったリストを、キーワードを含む要素だけに絞り込む
#
# @param items [Array<String>] 対象のリスト
# @param keyword [String] 絞り込むキーワード。空文字の場合はすべての要素を返す
# @return [Array<String>] キーワードを含む要素のリスト
def filter_items(items, keyword)
  items.select { |item| item.include?(keyword) }
end
```
