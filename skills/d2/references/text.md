テキストと記法
=========================

Markdownテキスト
-------------------------

### スタンドアロンMarkdown

```d2
explanation: |md
    # ヘッダー
    - リスト1
    - リスト2
    
    通常のMarkdown記法が使えます
|
```

### シェイプへのMarkdownラベル

シェイプを明示的に宣言する必要があります。

```d2
explanation: |md
    # ヘッダー
    - リスト
|
explanation.shape: rectangle
```

コードブロック
-------------------------

### 基本的なコード表示

言語名を指定するとシンタックスハイライトされます。

```d2
code: |go
    awsSession := From(c.Request.Context())
    client := s3.New(awsSession)
    
    ctx, cancelFn := context.WithTimeout(c.Request.Context(), AWS_TIMEOUT)
    defer cancelFn()
|
```

### サポート言語

[Chromaライブラリ](https://github.com/alecthomas/chroma?tab=readme-ov-file#supported-languages)がサポートするすべての言語が使用可能です。

### 便利なエイリアス

- `md` → `markdown`
- `tex` → `latex`
- `js` → `javascript`
- `go` → `golang`
- `py` → `python`
- `rb` → `ruby`
- `ts` → `typescript`

LaTeX数式
-------------------------

### 基本的な数式

```d2
formula: |latex
    \lim_{h \rightarrow 0 } \frac{f(x+h)-f(x)}{h}
|
```

### フォントサイズの制御

LaTeX内でサイズコマンドを使用:

- `\tiny{ }`
- `\small{ }`
- `\normal{ }`
- `\large{ }`
- `\huge{ }`

### 注意事項

- MathJaxベースのため、フルLaTeXではない
- 数式表示に特化(ドキュメントレイアウトエンジンは含まれない)
- [サポートされるコマンド一覧](https://docs.mathjax.org/en/latest/input/tex/macros/index.html)
- 改行は`displaylines`コマンドで代用

### 利用可能なLaTeXプラグイン

- amscd
- braket
- cancel
- color
- gensymb
- mhchem
- physics

多言語サポート
-------------------------

ラテン文字以外の言語も完全サポート:

- 中国語、日本語、韓国語
- ラオス語、クメール語
- 絵文字

```d2
poem: |md
    床前明月光、
    疑是地上霜。
|

greeting: トマトが赤くなったのはなぜですか？
```

高度な機能
-------------------------

### 非Markdownテキスト

GitHub風のMarkdown以外のテキストが必要な場合:

```d2
title: A winning strategy {
    shape: text
    near: top-center
    style: {
        font-size: 55
        italic: true
    }
}
```

### ブロック文字列のカスタム区切り

パイプ記号`|`を使う言語の場合、区切り文字を変更できます。

```d2
# 通常
my_code: |ts
    declare function getSmallPet(): Fish | Bird;
|

# パイプ2個
my_code: ||ts
    declare function getSmallPet(): Fish | Bird;
||

# パイプ3個
my_code: |||ts
    declare function getSmallPet(): Fish | Bird;
    const works = (a > 1) || (b < 2)
|||

# カスタム区切り文字
my_code: |`ts
    declare function getSmallPet(): Fish | Bird;
    const works = (a > 1) || (b < 2)
`|
```

ベストプラクティス
-------------------------

- スタンドアロンテキストにはMarkdownを活用
- コードブロックは言語指定でハイライト
- LaTeXは数式表示に限定
- 多言語コンテンツも安心して使用
- `shape: text`は最小限の使用に留める
- 区切り文字の衝突はカスタム区切りで対応
