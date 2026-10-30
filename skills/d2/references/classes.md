クラス機能
=========================

基本構文
-------------------------

クラスは属性をまとめて再利用するための機能です。

```d2
classes: {
    unhealthy: {
        style.fill: red
        style.stroke: orange
    }
}

x.class: unhealthy
```

コネクションへのクラス適用
-------------------------

### 宣言時の適用

```d2
a -> b: {class: something}
```

### 後からの適用

```d2
a -> b
(a -> b)[0].class: something
```

複数クラスの適用
-------------------------

### 配列記法

```d2
classes: {
    d2: {
        label: ""
        icon: https://play.d2lang.com/assets/icons/d2-logo.svg
    }
    sphere: {
        shape: circle
        style.stroke-width: 0
    }
}

logo.class: [d2; sphere]
```

### 適用順序

左から右に適用されます。

```d2
classes: {
    uno: {label: 1}
    dos: {label: 2}
}

x.class: [uno; dos]  # labelは「2」になる
y.class: [dos; uno]  # labelは「1」になる
```

クラスのオーバーライド
-------------------------

オブジェクトに直接定義された属性は、クラスの属性を上書きします。

```d2
classes: {
    unhealthy: {
        style.fill: red
    }
}

x.class: unhealthy
x.style.fill: orange  # 最終的にorangeになる
```

高度な活用
-------------------------

### タグとしての使用

クラス属性はSVG要素に`class`として出力されるため、カスタムCSSやJavaScriptで活用可能です。

```d2
x.class: important

# SVG出力で <g class="important"> として扱える
# Webページ上で .important { ... } のCSSを適用可能
```

ベストプラクティス
-------------------------

- 繰り返し使うスタイルはクラスで定義
- 複数クラスの順序を意識して使用
- クラスで共通部分を定義し、個別オブジェクトで微調整
- タグ機能を活用してSVG後処理を効率化
