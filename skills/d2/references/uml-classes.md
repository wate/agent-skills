UMLクラス図
=========================

基本構文
-------------------------

```d2
MyClass: {
    shape: class
    
    field: "[]string"
    method(a uint64): (x, y int)
    voidMethod()
}
```

### フィールドとメソッドの定義ルール

- フィールド: 値がデータ型
- メソッド: キーに`(`が含まれる
- 戻り値なしメソッド: 値を省略(void)

可視性の指定
-------------------------

### 可視性記号

| 記号 | 意味      |
| ---- | --------- |
| なし | public    |
| +    | public    |
| -    | private   |
| #    | protected |

### 使用例

```d2
Parser: {
    shape: class
    
    # Public
    +reader: io.RuneReader
    readerPos: d2ast.Position
    
    # Private
    -lookahead: "[]rune"
    
    # Protected(#はコメントと区別するためエスケープ)
    \#lookaheadPos: d2ast.Position
    
    # メソッド
    +peek(): (r rune, eof bool)
    rewind()
    commit()
    \#peekn(n int): (s string, eof bool)
}
```

複雑な型の記述
-------------------------

### 配列・スライス

```d2
field: "[]string"
matrix: "[][]int"
```

### インターフェース・パッケージ型

```d2
reader: io.RuneReader
position: d2ast.Position
```

### 引用符の使用

複雑な型や特殊文字を含む場合は引用符で囲みます。

予約語のエスケープ
-------------------------

```d2
my_class: {
    shape: class
    "label": string
    "style": text
}
```

完全な例
-------------------------

```d2
DebitCard: {
    shape: class
    +cardno
    +ownedBy
    
    +access()
}

Bank: {
    shape: class
    +code
    +address
    
    +manages()
    +maintains()
}

Customer: {
    shape: class
    +name
    +address
    +dob
    
    +owns()
}

Account: {
    shape: class
    +type
    +owner
}

# 関係性の定義
DebitCard -> Customer: owned by
Customer -> Account: has
Bank -> Account: manages
```

スタイル適用
-------------------------

### fill/strokeの特殊な挙動

sql_tableと同様の挙動:

- `fill`: ヘッダーに適用
- `stroke`: ボディに適用
- `font-color`: ヘッダーテキストのみ

```d2
MyClass: {
    shape: class
    +field: string
    
    style: {
        fill: "#3498db"        # ヘッダー背景
        stroke: "#e8f5e9"      # ボディ背景
        font-color: white      # ヘッダーテキスト色
    }
}
```

ベストプラクティス
-------------------------

- 可視性記号を適切に使用
- `#`記号はエスケープ(`\#`)して使用
- 複雑な型は引用符で囲む
- メソッドと戻り値を明確に記述
- クラス間の関係性も明示的に定義
- テーマを活用してボディの色を統一
