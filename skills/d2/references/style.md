スタイル属性
=========================

利用可能なスタイル属性
-------------------------

### シェイプとコネクション共通

- `opacity`: 0-1の浮動小数点
- `stroke`: CSS色名、16進数、グラデーション
- `stroke-width`: 1-15の整数
- `stroke-dash`: 0-10の整数
- `animated`: true/false
- `font`: mono(現在はmonoのみ)
- `font-size`: 8-100の整数
- `font-color`: CSS色名、16進数、グラデーション
- `bold`: true/false
- `italic`: true/false
- `underline`: true/false
- `text-transform`: uppercase, lowercase, title, none

### シェイプのみ

- `fill`: CSS色名、16進数、グラデーション
- `fill-pattern`: dots, lines, grain, none
- `border-radius`: 0-20の整数(999で丸薬型)
- `shadow`: true/false
- `3d`: true/false(矩形/正方形のみ)
- `multiple`: true/false
- `double-border`: true/false(矩形/楕円)

基本的な使用例
-------------------------

### 個別スタイル指定

```d2
x: {
    style: {
        fill: "#f4a261"
        stroke: deepskyblue
        stroke-width: 2
        opacity: 0.7
    }
}
```

### コネクションのスタイル

```d2
x -> y: {
    style: {
        stroke: red
        stroke-dash: 3
        animated: true
    }
}
```

### ルートレベルのスタイル

```d2
style: {
    fill: LightBlue        # 背景色
    stroke: FireBrick      # 枠線
    stroke-width: 2
    double-border: true    # 二重枠
}
```

特殊なスタイル挙動
-------------------------

### sql_tableとclass

- `fill`: ヘッダーに適用
- `stroke`: ボディに適用
- `font-color`: ヘッダーテキストのみ

### 透明fill

```d2
x: {
    style.fill: transparent
}
```

### グラデーション

```d2
x: {
    style.fill: "linear-gradient(#f69d3c, #3f87a6)"
}
```

### ボーダー半径

- 通常値: 0-20
- 999: 丸薬型(pill)
- コネクションにも適用可(角の丸み、ELK等)

推奨事項
-------------------------

- デフォルトの変更には[glob](https://d2lang.com/tour/globs/#changing-defaults)を使用
- `font-size`でレイアウトが変わる場合があるため、早めに指定
- `border-radius: 999`で完全な丸薬型を作成
- sql_tableやclassでは、テーマがボディの色を制御
