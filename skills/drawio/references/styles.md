draw.io XMLスタイル属性詳細リファレンス
=========================

概要
-------------------------

このドキュメントは、draw.io XMLファイルのmxCell要素のstyle属性で使用可能な属性の詳細リストです。
mxGraphライブラリのmxConstants.jsから抽出した情報を基に作成しています。

スタイル属性の基本
-------------------------

### 記述形式

スタイル属性は、セミコロン区切りで複数の属性を指定します。

```xml
style="属性名1=値1;属性名2=値2;属性名3=値3"
```

### 値の型

- 文字列: 色名、キーワード
- 数値: サイズ、角度、透明度
- 真偽値: 0(無効)、1(有効)

ノード(頂点)スタイル属性
-------------------------

### 図形と基本スタイル

| 属性名       | 型     | 説明             | 値の例                                 |
| ------------ | ------ | ---------------- | -------------------------------------- |
| `shape`      | 文字列 | 図形タイプ       | rectangle, ellipse, rhombus, cylinder3 |
| `rounded`    | 真偽値 | 角丸の有効化     | 0=角張る, 1=角丸                       |
| `whiteSpace` | 文字列 | テキスト折り返し | wrap                                   |
| `html`       | 真偽値 | HTML描画の有効化 | 1=有効                                 |

### 色とグラデーション

| 属性名              | 型     | 説明                       | 値の例                   |
| ------------------- | ------ | -------------------------- | ------------------------ |
| `fillColor`         | 色     | 塗りつぶし色               | #dae8fc, none            |
| `strokeColor`       | 色     | 線の色                     | #6c8ebf, none            |
| `gradientColor`     | 色     | グラデーション終点色       | #ffffff                  |
| `gradientDirection` | 文字列 | グラデーション方向         | north, south, east, west |
| `swimlaneFillColor` | 色     | スイムレーン用塗りつぶし色 | #ffffff                  |

### 線のスタイル

| 属性名        | 型     | 説明               | 値の例   |
| ------------- | ------ | ------------------ | -------- |
| `strokeWidth` | 数値   | 線の太さ(ピクセル) | 1, 2, 3  |
| `dashed`      | 真偽値 | 破線の有効化       | 1=有効   |
| `dashPattern` | 文字列 | 破線パターン       | 3 3, 5 2 |

### 透明度

| 属性名        | 型   | 説明                      | 値の例      |
| ------------- | ---- | ------------------------- | ----------- |
| `opacity`     | 数値 | 全体の透明度(0-100)       | 50, 75, 100 |
| `fillOpacity` | 数値 | 塗りつぶしの透明度(0-100) | 50, 75, 100 |

### テキスト配置

| 属性名                  | 型     | 説明               | 値の例              |
| ----------------------- | ------ | ------------------ | ------------------- |
| `align`                 | 文字列 | テキスト水平位置   | left, center, right |
| `verticalAlign`         | 文字列 | テキスト垂直位置   | top, middle, bottom |
| `labelPosition`         | 文字列 | ラベルの水平配置   | left, center, right |
| `verticalLabelPosition` | 文字列 | ラベルの垂直配置   | top, middle, bottom |
| `labelWidth`            | 数値   | ラベル幅(ピクセル) | 100, 200            |

### フォント

| 属性名       | 型     | 説明                     | 値の例                              |
| ------------ | ------ | ------------------------ | ----------------------------------- |
| `fontColor`  | 色     | テキストの色             | #000000, #333333                    |
| `fontSize`   | 数値   | フォントサイズ(ポイント) | 12, 14, 16                          |
| `fontStyle`  | 数値   | フォントスタイル         | 0=通常, 1=太字, 2=斜体, 3=太字+斜体 |
| `fontFamily` | 文字列 | フォントファミリー       | Arial, Helvetica                    |

### 画像

| 属性名               | 型     | 説明               | 値の例                       |
| -------------------- | ------ | ------------------ | ---------------------------- |
| `image`              | URL    | 画像のURL          | http://example.com/image.png |
| `imageWidth`         | 数値   | 画像幅(ピクセル)   | 48, 64                       |
| `imageHeight`        | 数値   | 画像高さ(ピクセル) | 48, 64                       |
| `imageAlign`         | 文字列 | 画像の水平位置     | left, center, right          |
| `imageVerticalAlign` | 文字列 | 画像の垂直位置     | top, middle, bottom          |
| `imageAspect`        | 真偽値 | アスペクト比維持   | 0=無視, 1=維持               |

### 特殊効果

| 属性名   | 型     | 説明       | 値の例 |
| -------- | ------ | ---------- | ------ |
| `shadow` | 真偽値 | 影の有効化 | 1=有効 |
| `glass`  | 真偽値 | ガラス効果 | 1=有効 |

エッジ(線)スタイル属性
-------------------------

### 基本スタイル

| 属性名      | 型     | 説明             | 値の例                              |
| ----------- | ------ | ---------------- | ----------------------------------- |
| `edgeStyle` | 文字列 | エッジのスタイル | orthogonalEdgeStyle, elbowEdgeStyle |
| `rounded`   | 真偽値 | 角を丸める       | 0=角張る, 1=角丸                    |
| `curved`    | 真偽値 | 曲線             | 1=有効                              |

### 接続点

| 属性名           | 型          | 説明           | 値の例       |
| ---------------- | ----------- | -------------- | ------------ |
| `jettySize`      | 文字列/数値 | 接続点サイズ   | auto, 10, 20 |
| `orthogonalLoop` | 真偽値      | ループを直角に | 1=有効       |

### 矢印

| 属性名       | 型     | 説明                 | 値の例                             |
| ------------ | ------ | -------------------- | ---------------------------------- |
| `startArrow` | 文字列 | 始点の矢印           | none, classic, open, diamond, oval |
| `endArrow`   | 文字列 | 終点の矢印           | none, classic, open, diamond, oval |
| `startSize`  | 数値   | 始点矢印のサイズ     | 6, 8, 10                           |
| `endSize`    | 数値   | 終点矢印のサイズ     | 6, 8, 10                           |
| `startFill`  | 真偽値 | 始点矢印の塗りつぶし | 0=空, 1=塗りつぶし                 |
| `endFill`    | 真偽値 | 終点矢印の塗りつぶし | 0=空, 1=塗りつぶし                 |

### 色と線

エッジも`strokeColor`、`strokeWidth`、`dashed`、`dashPattern`、`opacity`などの属性を使用できます。

特殊なスタイル値
-------------------------

### 色の特殊値

- `none`: 色なし(透明)
- `inherit`: 親セルから継承
- `swimlane`: スイムレーンの色を使用
- `indicated`: インジケーターシェイプの色を使用

### 使用例

```xml
<!-- ノード: グラデーション、影、角丸 -->
<mxCell id="node1" value="サンプル" 
  style="rounded=1;fillColor=#dae8fc;strokeColor=#6c8ebf;gradientColor=#ffffff;gradientDirection=south;shadow=1;opacity=90"
  vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
</mxCell>

<!-- エッジ: 破線、カスタム矢印 -->
<mxCell id="edge1" 
  style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;dashPattern=5 5;startArrow=diamond;startFill=1;endArrow=open;endFill=0"
  edge="1" parent="1" source="node1" target="node2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

参考情報
-------------------------

このリファレンスは、draw.ioのmxGraphライブラリのソースコード(`mxConstants.js`)から抽出した情報を基に作成されています。

- 公式リポジトリ: https://github.com/jgraph/drawio/
- ソースコード: https://raw.githubusercontent.com/jgraph/drawio/master/src/main/webapp/mxgraph/src/util/mxConstants.js
