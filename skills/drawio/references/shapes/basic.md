基本図形(高頻度)
=========================

概要
-------------------------

このファイルは、基本図形のうち利用頻度が高いものをまとめています。
標準図形と基本図形カテゴリーを対象にしています。

標準図形(mxGraph組み込み)
-------------------------

以下はmxGraphライブラリに組み込まれている標準図形です。

| 図形名       | 値               | 説明                       |
| ------------ | ---------------- | -------------------------- |
| 長方形       | `rectangle`      | 長方形(デフォルト)です。   |
| 楕円         | `ellipse`        | 円・楕円です。             |
| 二重楕円     | `doubleEllipse`  | 二重線の楕円です。         |
| ひし形       | `rhombus`        | ひし形(判定ボックス)です。 |
| 六角形       | `hexagon`        | 六角形です。               |
| 三角形       | `triangle`       | 三角形です。               |
| 円柱         | `cylinder`       | 3D円柱(データベース)です。 |
| 雲形         | `cloud`          | 雲です。                   |
| アクター     | `actor`          | UMLアクター(人型)です。    |
| 矢印         | `arrow`          | 矢印シェイプです。         |
| 矢印コネクタ | `arrowConnector` | 矢印付きコネクタです。     |
| ラベル       | `label`          | ラベルシェイプです。       |
| スイムレーン | `swimlane`       | スイムレーンです。         |
| コネクタ     | `connector`      | 基本コネクタです。         |
| 画像         | `image`          | 画像シェイプです。         |
| 線           | `line`           | 単純な線です。             |

基本図形カテゴリー(mxBasic.js)
-------------------------

`mxgraph.basic.*`名前空間で定義される拡張図形です。

```xml
<mxCell value="クロス" style="shape=mxgraph.basic.cross2;..." vertex="1" parent="1">
```

### 主要な図形

- 図形名: `mxgraph.basic.cross2`です。
- 図形名: `mxgraph.basic.rectCallout`です。
- 図形名: `mxgraph.basic.roundRectCallout`です。
- 図形名: `mxgraph.basic.oval_callout`です。
- 図形名: `mxgraph.basic.cloud_callout`です。
- 図形名: `mxgraph.basic.wave`です。
- 図形名: `mxgraph.basic.hexagon`です。
- 図形名: `mxgraph.basic.octagon`です。
- 図形名: `mxgraph.basic.isocube`です。
- 図形名: `mxgraph.basic.pentagon`です。
- 図形名: `mxgraph.basic.star`です。
- 図形名: `mxgraph.basic.cone`です。
- 図形名: `mxgraph.basic.4_point_star`です。

参考情報
-------------------------

- 参照ファイル: https://raw.githubusercontent.com/jgraph/drawio/master/src/main/webapp/shapes/mxBasic.jsです。
