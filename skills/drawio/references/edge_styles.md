エッジスタイルリファレンス
=========================

概要
-------------------------

このドキュメントは、draw.io XMLファイルでエッジ(線・矢印)の描画スタイルを制御するための詳細仕様を提供します。

基本的なエッジスタイルの指定
-------------------------

### EdgeStyle属性

エッジの接続方式を決定する主要な属性です。

```xml
<mxCell style="edgeStyle=orthogonalEdgeStyle;..." edge="1" parent="1" source="node1" target="node2">
```

利用可能なエッジスタイル
-------------------------

### orthogonalEdgeStyle

直交スタイル。
水平・垂直の線のみを使用してノード間を接続します。

```xml
<mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;..." edge="1" parent="1" source="1" target="2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

#### 主要パラメータ

- `jettySize`: 接続点から最初の線分の長さ(ピクセル単位)。デフォルトは10
- `sourceJettySize`: ソース側のジェッティサイズ。EdgeStyle固有の設定
- `targetJettySize`: ターゲット側のジェッティサイズ。EdgeStyle固有の設定

### elbowEdgeStyle

肘スタイル。
3つのセグメントでノードを接続します(ソース→中間→ターゲット)。

```xml
<mxCell style="edgeStyle=elbowEdgeStyle;elbow=vertical;..." edge="1" parent="1" source="1" target="2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

#### 主要パラメータ

- `elbow`: 中間セグメントの方向。`horizontal`(水平)または`vertical`(垂直)

### entityRelationEdgeStyle

エンティティリレーションスタイル。
データベースのER図で使用される接続スタイルです。

```xml
<mxCell style="edgeStyle=entityRelationEdgeStyle;segment=30;..." edge="1" parent="1" source="1" target="2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

#### 主要パラメータ

- `segment`: 水平セグメントの長さ(ピクセル単位)。デフォルトは30

### segmentEdgeStyle

セグメントスタイル。
ユーザー定義の制御点を使用してエッジを描画します。

```xml
<mxCell style="edgeStyle=segmentEdgeStyle;..." edge="1" parent="1" source="1" target="2">
  <mxGeometry relative="1" as="geometry">
    <Array as="points">
      <mxPoint x="300" y="200"/>
      <mxPoint x="300" y="300"/>
    </Array>
  </mxGeometry>
</mxCell>
```

### loopEdgeStyle

ループスタイル。
同じノードへの自己参照接続に使用されます。

```xml
<mxCell style="edgeStyle=loopEdgeStyle;loop=1;..." edge="1" parent="1" source="1" target="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

#### 主要パラメータ

- `orthogonalLoop`: 直交ループを使用するか。`0`(なし)または`1`(あり)

### sideToSideEdgeStyle

サイド・トゥ・サイドスタイル。
ノードの左右側面を接続します。

```xml
<mxCell style="edgeStyle=sideToSideEdgeStyle;..." edge="1" parent="1" source="1" target="2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### topToBottomEdgeStyle

トップ・トゥ・ボトムスタイル。
ノードの上下側面を接続します。

```xml
<mxCell style="edgeStyle=topToBottomEdgeStyle;..." edge="1" parent="1" source="1" target="2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

エッジの接続点制御
-------------------------

### 明示的な接続点指定

ノードのどの位置に接続するかを明示的に指定します。

```xml
<mxCell style="edgeStyle=orthogonalEdgeStyle;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;..."
        edge="1" parent="1" source="1" target="2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

#### パラメータ

- `exitX`, `exitY`: ソースノードからの相対的な出口位置(0.0〜1.0)
- `exitDx`, `exitDy`: 出口位置からのオフセット(ピクセル単位)
- `entryX`, `entryY`: ターゲットノードへの相対的な入口位置(0.0〜1.0)
- `entryDx`, `entryDy`: 入口位置からのオフセット(ピクセル単位)
- `exitPerimeter`: ソースノードの周囲から接続するか。`0`(なし)または`1`(あり、デフォルト)
- `entryPerimeter`: ターゲットノードの周囲へ接続するか。`0`(なし)または`1`(あり、デフォルト)

### ポート制約

接続方向を制限します。

```xml
<mxCell style="portConstraint=north;..." vertex="1" parent="1">
```

#### 指定可能な値

- `north`: 上側のみ
- `south`: 下側のみ
- `east`: 右側のみ
- `west`: 左側のみ
- 複数指定も可能(ビット演算)

エッジの外観制御
-------------------------

### rounded(角の丸み)

エッジの角を丸くします。

```xml
<mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=1;arcSize=20;..." edge="1" parent="1" source="1" target="2">
```

#### パラメータ

- `rounded`: `0`(角ばった)または`1`(丸い)
- `arcSize`: 丸みの半径(ピクセル単位)。デフォルトは20

### curved(曲線)

エッジを曲線で描画します。

```xml
<mxCell style="curved=1;..." edge="1" parent="1" source="1" target="2">
```

### bezier(ベジェ曲線)

ベジェ曲線を使用します。
制御点を直接ベジェ制御点として解釈します。

```xml
<mxCell style="bezier=1;..." edge="1" parent="1" source="1" target="2">
  <mxGeometry relative="1" as="geometry">
    <Array as="points">
      <mxPoint x="200" y="100"/>
      <mxPoint x="300" y="300"/>
    </Array>
  </mxGeometry>
</mxCell>
```

**注意**: 制御点の数は3n+1個(n = ベジェセグメント数)である必要があります。

### orthogonal(直交接続)

エッジの接続点を可能な限り垂直または水平に配置します。

```xml
<mxCell style="orthogonal=1;..." edge="1" parent="1" source="1" target="2">
```

矢印マーカー
-------------------------

### 利用可能な矢印タイプ

| マーカー名     | 説明                                |
| -------------- | ----------------------------------- |
| `classic`      | 標準的な矢印                        |
| `classicThin`  | 細い標準矢印                        |
| `block`        | ブロック矢印                        |
| `blockThin`    | 細いブロック矢印                    |
| `open`         | オープン矢印                        |
| `openThin`     | 細いオープン矢印                    |
| `oval`         | 楕円形マーカー                      |
| `diamond`      | ひし形マーカー                      |
| `diamondThin`  | 細いひし形マーカー                  |
| `ERone`        | ERダイアグラム用マーカー(1)         |
| `ERmandOne`    | ERダイアグラム用マーカー(必須1)     |
| `ERmany`       | ERダイアグラム用マーカー(多)        |
| `ERoneToMany`  | ERダイアグラム用マーカー(1対多)     |
| `ERzeroToOne`  | ERダイアグラム用マーカー(0または1)  |
| `ERzeroToMany` | ERダイアグラム用マーカー(0または多) |

### 矢印サイズと塗りつぶし

```xml
<mxCell style="startArrow=classic;startSize=8;startFill=1;endArrow=block;endSize=12;endFill=0;..." edge="1" parent="1"
        source="1" target="2">
```

#### パラメータ

- `startArrow`, `endArrow`: 矢印のタイプ
- `startSize`, `endSize`: 矢印のサイズ(ピクセル単位)。デフォルトは6
- `startFill`, `endFill`: 矢印を塗りつぶすか。`0`(塗りつぶさない)または`1`(塗りつぶす、デフォルト)
- `startFillColor`, `endFillColor`: 矢印の塗りつぶし色。未指定時はstrokeColorを使用

エッジスタイルの無効化
-------------------------

### noEdgeStyle

エッジスタイルをオフにして、シンプルな直線で接続します。

```xml
<mxCell style="noEdgeStyle=1;..." edge="1" parent="1" source="1" target="2">
```

参考情報
-------------------------

このリファレンスは、draw.ioのmxGraphライブラリのソースコード(`mxConstants.js`)から抽出した情報を基に作成されています。

- 公式リポジトリ: https://github.com/jgraph/drawio/
- ソースコード: https://raw.githubusercontent.com/jgraph/drawio/master/src/main/webapp/mxgraph/src/util/mxConstants.js
