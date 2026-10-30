インタラクティブ機能
=========================

ツールチップ
-------------------------

### 基本構文

```d2
x: {
    tooltip: ツールチップの内容
}
```

ホバー時に表示されるテキストです。

### 用途

1. 補足情報の追加
    - 詳細な説明が必要だが、常時表示は不要な情報
2. 図表の整理
    - 図表が複雑になりすぎる場合にテキストを格納

### 使用例

```d2
x: {
    tooltip: Total abstinence is easier than perfect moderation
}

y: {
    tooltip: Gee, I feel kind of LIGHT in the head now,\nknowing I can't make my satellite dish PAYMENTS!
}

x -> y
```

### 静的フォーマット(PNG等)への変換

SVGから静的フォーマットにエクスポートした場合:

1. ツールチップアイコンに番号が付与される
2. 図表の下部に番号対応の付録が追加される

### 注意事項

- ツールチップはHTML `title`タグで実装
- Markdown記法は期待通りにレンダリングされない
- 基本的なテキストフォーマットのみサポート

### 常時表示(TALAレイアウトエンジンのみ対応)

**注意**: `near`属性はTALAレイアウトエンジンでのみサポートされています。
dagre/ELKレイアウトエンジンでは使用できません。

TALAを使用する場合、`near`を指定するとホバーではなく常時表示になります。

```d2
vars: {
  d2-config: {
    layout-engine: tala
  }
}

codedeploy: {
    tooltip: |md
        重要な注意事項
    |
    tooltip.near: center-left
}
```

詳細は[positions.md](positions.md)を参照してください。

リンク
-------------------------

### 基本構文

```d2
x: I'm a Mac {
    link: https://apple.com
}

y: And I'm a PC {
    link: https://microsoft.com
}

x -> y: gazoontite {
    link: https://google.com
}
```

クリックで外部リンクに遷移します。

### フラグメント識別子の扱い

`#`を含むURIフラグメント(例: `https://example.com/page#fragment`)を使用する場合、引用符またはエスケープが必要です。

```d2
x: {
    link: "https://example.com/page#fragment"
}

# または

x: {
    link: https://example.com/page\#fragment
}
```

`#`がコメントとして解釈されるのを防ぐためです。

### 使用例

```d2
github: {
    icon: https://icons.terrastruct.com/dev/github.svg
    link: https://github.com/terrastruct/d2
}

docs: {
    icon: https://icons.terrastruct.com/essentials/documentation.svg
    link: https://d2lang.com/tour/intro
}

github -> docs: Learn more
```

ベストプラクティス
-------------------------

### ツールチップ

- 補足説明に活用
- 長文は避ける(簡潔に)
- Markdownは使用せず、プレーンテキストを使用
- 重要情報は図表本体に記載
- 常時表示が必要な場合は注意が必要です(`near`はTALAレイアウトエンジンでのみサポート)

### リンク

- 公式ドキュメントや関連資料へのリンク
- プロジェクト管理ツールへのリンク
- `#`を含むURLは必ず引用符で囲む
- アイコンと組み合わせて視認性を向上
