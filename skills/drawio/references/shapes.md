図形カタログリファレンス
=========================

概要
-------------------------

このドキュメントは、draw.io XMLファイルで使用可能な図形タイプのカタログです。
利用頻度が高いカテゴリーは分割し、それ以外はその他に集約しています。

分割方針
-------------------------

- 利用頻度が高いカテゴリーは、カテゴリーごとのファイルに分割しています。
- 利用頻度が低いカテゴリーは、その他のファイルにまとめています。
- 参照元のソースは、https://github.com/jgraph/drawioです。

基本的な図形指定
-------------------------

### shape属性

ノードの形状を決定する主要な属性です。

```xml
<mxCell value="ノード" style="shape=rectangle;..." vertex="1" parent="1">
```

カスタム図形の使用方法
-------------------------

### 基本的な記述

```xml
<mxCell value="テキスト" style="shape=カテゴリ名.図形名;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
</mxCell>
```

### 図形固有パラメータ

多くのカスタム図形には、形状を調整するための固有パラメータがあります。

```xml
<!-- 例: フローチャートのdocument2図形のwave size調整 -->
<mxCell style="shape=mxgraph.flowchart.document2;size=0.25;..." vertex="1" parent="1">
```

利用頻度が高いカテゴリー
-------------------------

- 基本図形: [shapes/basic.md](./shapes/basic.md)です。
- フローチャート: [shapes/flowchart.md](./shapes/flowchart.md)です。
- UML: [shapes/uml.md](./shapes/uml.md)です。
- 矢印: [shapes/arrows.md](./shapes/arrows.md)です。
- ネットワーク: [shapes/networks.md](./shapes/networks.md)です。
- クラウドサービス: [shapes/cloud.md](./shapes/cloud.md)です。
- ER: [shapes/er.md](./shapes/er.md)です。
- Bootstrap: [shapes/bootstrap.md](./shapes/bootstrap.md)です。
- Mockup: [shapes/mockup.md](./shapes/mockup.md)です。

その他
-------------------------

利用頻度が低いカテゴリーは、以下に集約しています。

- その他の専門図形セット: [shapes/others.md](./shapes/others.md)です。

参考情報
-------------------------

このカタログは、draw.ioのmxGraphライブラリのshapesディレクトリから抽出した情報を基に作成しています。
詳細は各カテゴリーのJavaScriptファイルを参照してください。

- 公式リポジトリ: https://github.com/jgraph/drawio/
- ソースコード: https://github.com/jgraph/drawio/tree/master/src/main/webapp/shapes/です。
