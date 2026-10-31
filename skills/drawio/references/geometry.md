mxGeometry高度な機能リファレンス
=========================

概要
-------------------------

このドキュメントは、draw.io XMLファイルのmxGeometry要素の高度な機能について説明します。
基本的なx, y, width, height以外の機能を中心に解説します。

基本構造の復習
-------------------------

```xml
<mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
```

エッジの制御点
-------------------------

### points配列

エッジの中間点(制御点)を指定します。

```xml
<mxCell id="edge1" style="edgeStyle=orthogonalEdgeStyle;..." edge="1" parent="1" source="node1" target="node2">
  <mxGeometry relative="1" as="geometry">
    <Array as="points">
      <mxPoint x="300" y="200"/>
      <mxPoint x="300" y="300"/>
    </Array>
  </mxGeometry>
</mxCell>
```

### sourcePointとtargetPoint

エッジが接続されていない場合の始点と終点を指定します。

```xml
<mxCell id="edge1" style="edgeStyle=orthogonalEdgeStyle;..." edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="100" y="100" as="sourcePoint"/>
    <mxPoint x="300" y="300" as="targetPoint"/>
  </mxGeometry>
</mxCell>
```

相対座標系
-------------------------

### relative属性

`relative="1"`を指定すると、用途に応じて座標が相対的に解釈されます。
主な用途は、エッジ、エッジラベル、ポートの位置指定です。

ノード(頂点)では、`x`と`y`の相対指定が中心で、`width`と`height`は通常ピクセル値で指定します。

#### ノード(頂点)の場合

親セル内での相対位置を指定します。

```xml
<!-- 親セルの左上から20%、20%の位置に配置し、サイズはピクセル指定 -->
<mxCell id="child" value="子ノード" style="..." vertex="1" parent="parent1">
  <mxGeometry x="0.2" y="0.2" width="120" height="60" relative="1" as="geometry"/>
</mxCell>
```

#### エッジラベルの場合

エッジ上でのラベル位置を指定します。

- x座標: -1(始点)から1(終点)で、0が中心
- y座標: エッジからの直交距離(ピクセル)

```xml
<!-- エッジの中心から少し上にラベルを配置 -->
<mxCell id="label" value="ラベル" style="..." vertex="1" parent="edge1">
  <mxGeometry x="0" y="-20" relative="1" as="geometry"/>
</mxCell>
```

offset属性
-------------------------

### 用途

offsetは、計算された位置からの追加のオフセットを指定します。

#### エッジラベルの場合

```xml
<mxCell id="label" value="ラベル" style="..." vertex="1" parent="edge1">
  <mxGeometry x="0" y="-20" relative="1" as="geometry">
    <mxPoint x="10" y="5" as="offset"/>
  </mxGeometry>
</mxCell>
```

#### ノード内のラベルの場合

ノードの中心からのオフセットを指定します。

```xml
<mxCell id="node1" value="ノード" style="..." vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry">
    <mxPoint x="5" y="5" as="offset"/>
  </mxGeometry>
</mxCell>
```

alternateBounds
-------------------------

### 概要

代替の境界を保存します。
collapse/expand動作などで、2つの状態を切り替える際に使用されます。

```xml
<mxGeometry x="100" y="100" width="120" height="60" as="geometry">
  <mxRectangle x="100" y="100" width="30" height="30" as="alternateBounds"/>
</mxGeometry>
```

### swap動作

alternateBoundsとx, y, width, heightの値を入れ替えることで、状態を切り替えます。

ポート(Port)
-------------------------

### 概要

ポートは、親セル内での相対的な接続点を定義します。

```xml
<!-- 親ノード -->
<mxCell id="parent1" value="親" style="..." vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="200" height="100" as="geometry"/>
</mxCell>

<!-- ポート: 親の右端中央 -->
<mxCell id="port1" value="" style="shape=circle;..." vertex="1" parent="parent1">
  <mxGeometry x="1.0" y="0.5" width="10" height="10" relative="1" as="geometry">
    <mxPoint x="-5" y="-5" as="offset"/>
  </mxGeometry>
</mxCell>
```

実用例
-------------------------

### 複雑なエッジ経路

```xml
<mxCell id="edge1" style="edgeStyle=orthogonalEdgeStyle;..." edge="1" parent="1" source="node1" target="node2">
  <mxGeometry relative="1" as="geometry">
    <Array as="points">
      <mxPoint x="200" y="150"/>
      <mxPoint x="200" y="250"/>
      <mxPoint x="350" y="250"/>
    </Array>
  </mxGeometry>
</mxCell>
```

### エッジラベルの精密配置

```xml
<!-- エッジの開始地点から30%の位置、エッジから15ピクセル上 -->
<mxCell id="label1" value="開始" style="..." vertex="1" parent="edge1">
  <mxGeometry x="-0.4" y="-15" relative="1" as="geometry">
    <mxPoint x="5" y="0" as="offset"/>
  </mxGeometry>
</mxCell>

<!-- エッジの終了地点近く、エッジから10ピクセル下 -->
<mxCell id="label2" value="終了" style="..." vertex="1" parent="edge1">
  <mxGeometry x="0.7" y="10" relative="1" as="geometry">
    <mxPoint x="-5" y="0" as="offset"/>
  </mxGeometry>
</mxCell>
```

### グループ内の相対配置

```xml
<mxCell id="group1" value="グループ" style="group" vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="300" height="200" as="geometry"/>
</mxCell>

<!-- グループ内で相対位置指定 -->
<mxCell id="child1" value="子1" style="..." vertex="1" parent="group1">
  <mxGeometry x="0.1" y="0.1" width="120" height="60" relative="1" as="geometry"/>
</mxCell>

<mxCell id="child2" value="子2" style="..." vertex="1" parent="group1">
  <mxGeometry x="0.55" y="0.1" width="120" height="60" relative="1" as="geometry"/>
</mxCell>
```

参考情報
-------------------------

このリファレンスは、draw.ioのmxGraphライブラリのソースコード(`mxGeometry.js`)から抽出した情報を基に作成されています。

- 公式リポジトリ: https://github.com/jgraph/drawio/
- ソースコード: https://raw.githubusercontent.com/jgraph/drawio/master/src/main/webapp/mxgraph/src/model/mxGeometry.js
