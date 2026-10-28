Pythonのアノテーション
=========================

書式
-------------------------

- docstringで書き、`Args:`・`Returns:`・`Raises:`の節を使う
- 型ヒントは追加しない。型ヒントはコードの一部であり、コメント以外の行を変えることになるため
- 型ヒントがない引数は、`Args:`の中で`name (型): 説明`の形で型を書く
- 型が特定できない場合は`Any`を使う
- 既存のコードにdocstringの形式の手がかりがない場合は、Google Python Style Guideの形式(`Args:`・`Returns:`・`Raises:`)で書く

要素ごとの書き方
-------------------------

- モジュール: ファイルの先頭に、モジュールの内容と使い方を書く。テストのモジュールには書かなくてよい
- クラス: クラスの定義の直後に、インスタンスが何を表すかを1行で書く。公開する属性は`Attributes:`の節に書く(プロパティは除く)
- プロパティ(`@property`): ゲッターのdocstringに書く
- ジェネレーター: `Returns:`ではなく`Yields:`の節に、生成する値を書く

静的解析
-------------------------

- mypyなどの型検査は型ヒントを読み、docstringの型は読まない
- Ruffの`D`ルールやpydocstyleを設定している場合は、docstringの有無と書式が検査される

見本
-------------------------

```python
def filter_items(items: list[str], keyword: str) -> list[str]:
    """
    受け取ったリストを、キーワードを含む要素だけに絞り込む。

    Args:
        items: 対象のリスト。
        keyword: 絞り込むキーワード。空文字の場合はすべての要素を返す。

    Returns:
        キーワードを含む要素のリスト。
    """
    return [item for item in items if keyword in item]
```
