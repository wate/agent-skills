draw.io XML実装例とサンプルコード
=========================

シンプルなフロー図
-------------------------

### 概要

2つのノードを持つ最小限のフロー図の例です。

### XMLコード

```xml
<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="AI" etag="simple-flow-001">
  <diagram id="simple-flow" name="シンプルなフロー">
    <mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- ノード1: 開始 -->
        <mxCell id="start" value="開始" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
                vertex="1" parent="1">
          <mxGeometry x="200" y="100" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- ノード2: 終了 -->
        <mxCell id="end" value="終了" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;"
                vertex="1" parent="1">
          <mxGeometry x="200" y="250" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- エッジ: 開始→終了 -->
        <mxCell id="edge-start-end"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="start" target="end">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### ポイント

- ノード間隔: Y座標で150単位の間隔(100→250)を確保
- カラー: 開始ノードは緑系、終了ノードは赤系
- エッジスタイル: `orthogonalEdgeStyle`で直角線を使用

ビジネスプロセス図
-------------------------

### 概要

グループ化とサブプロセスを含むビジネスプロセス図の例です。

### XMLコード

```xml
<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="AI" etag="business-process-001">
  <diagram id="business-process" name="ビジネスプロセス">
    <mxGraphModel dx="1200" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- グループ1: 受注プロセス -->
        <mxCell id="group-order" value="受注プロセス" style="group" vertex="1" parent="1">
          <mxGeometry x="50" y="50" width="400" height="250" as="geometry"/>
        </mxCell>

        <!-- ノード: 受注受付 -->
        <mxCell id="order-receive" value="受注受付"
                style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1"
                parent="group-order">
          <mxGeometry x="40" y="80" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- ノード: 在庫確認 -->
        <mxCell id="stock-check" value="在庫確認"
                style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1"
                parent="group-order">
          <mxGeometry x="240" y="80" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- エッジ: 受注受付→在庫確認 -->
        <mxCell id="edge-receive-check"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="group-order" source="order-receive" target="stock-check">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- グループ2: 出荷プロセス -->
        <mxCell id="group-shipping" value="出荷プロセス" style="group" vertex="1" parent="1">
          <mxGeometry x="550" y="50" width="400" height="250" as="geometry"/>
        </mxCell>

        <!-- ノード: 梱包 -->
        <mxCell id="packing" value="梱包" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
                vertex="1" parent="group-shipping">
          <mxGeometry x="40" y="80" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- ノード: 出荷 -->
        <mxCell id="shipping" value="出荷" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
                vertex="1" parent="group-shipping">
          <mxGeometry x="240" y="80" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- エッジ: 梱包→出荷 -->
        <mxCell id="edge-packing-shipping"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="group-shipping" source="packing" target="shipping">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: 在庫確認→梱包(グループ間) -->
        <mxCell id="edge-check-packing"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="stock-check" target="packing">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### ポイント

- グループ化: 関連するプロセスをグループでまとめる
- グループ間の接続: 親を`1`に設定してグループを跨ぐエッジを作成
- カラー統一: グループ内のノードは同系色で統一

条件分岐を含むフロー図
-------------------------

### 概要

判断ノード(菱形)と条件分岐を持つフロー図の例です。

### XMLコード

```xml
<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="AI" etag="conditional-flow-001">
  <diagram id="conditional-flow" name="条件分岐フロー">
    <mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- ノード: 開始 -->
        <mxCell id="start" value="開始" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
                vertex="1" parent="1">
          <mxGeometry x="300" y="50" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- ノード: 処理 -->
        <mxCell id="process" value="データ取得"
                style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="300" y="150" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- ノード: 判断(菱形) -->
        <mxCell id="decision" value="データあり?"
                style="shape=rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1"
                parent="1">
          <mxGeometry x="300" y="250" width="120" height="100" as="geometry"/>
        </mxCell>

        <!-- ノード: 処理A(Yes) -->
        <mxCell id="process-yes" value="データ処理"
                style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="500" y="270" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- ノード: 処理B(No) -->
        <mxCell id="process-no" value="エラー処理"
                style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1" parent="1">
          <mxGeometry x="100" y="270" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- ノード: 終了 -->
        <mxCell id="end" value="終了" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
                vertex="1" parent="1">
          <mxGeometry x="300" y="450" width="120" height="60" as="geometry"/>
        </mxCell>

        <!-- エッジ: 開始→処理 -->
        <mxCell id="edge-start-process"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="start" target="process">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: 処理→判断 -->
        <mxCell id="edge-process-decision"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="process" target="decision">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: 判断→処理A(Yes) -->
        <mxCell id="edge-decision-yes" value="Yes"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="decision" target="process-yes">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: 判断→処理B(No) -->
        <mxCell id="edge-decision-no" value="No"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="decision" target="process-no">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: 処理A→終了 -->
        <mxCell id="edge-yes-end"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="process-yes" target="end">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="560" y="400"/>
              <mxPoint x="360" y="400"/>
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- エッジ: 処理B→終了 -->
        <mxCell id="edge-no-end" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
                edge="1" parent="1" source="process-no" target="end">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="160" y="400"/>
              <mxPoint x="360" y="400"/>
            </Array>
          </mxGeometry>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### ポイント

- 菱形ノード: `style="shape=rhombus;..."`で判断ノードを表現
- エッジラベル: `value="Yes"`でエッジにラベルを付加
- 経路指定: `<mxPoint>`要素でエッジの経路を明示的に指定

ER図
-------------------------

### 概要

2つのエンティティとリレーションを持つER図の例です。

### XMLコード

```xml
<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="AI" etag="er-basic-001">
  <diagram id="er-basic" name="ER図">
    <mxGraphModel dx="1200" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- エンティティ: 顧客 -->
        <mxCell id="entity-customer" value="顧客"
                style="shape=mxgraph.er.entity;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1"
                parent="1">
          <mxGeometry x="120" y="180" width="140" height="70" as="geometry"/>
        </mxCell>

        <!-- 属性: 顧客ID -->
        <mxCell id="attr-customer-id" value="顧客ID"
                style="shape=mxgraph.er.attribute;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#6c8ebf;"
                vertex="1" parent="1">
          <mxGeometry x="120" y="80" width="120" height="50" as="geometry"/>
        </mxCell>

        <!-- エンティティ: 注文 -->
        <mxCell id="entity-order" value="注文"
                style="shape=mxgraph.er.entity;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;" vertex="1"
                parent="1">
          <mxGeometry x="520" y="180" width="140" height="70" as="geometry"/>
        </mxCell>

        <!-- 属性: 注文ID -->
        <mxCell id="attr-order-id" value="注文ID"
                style="shape=mxgraph.er.attribute;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor=#d6b656;"
                vertex="1" parent="1">
          <mxGeometry x="520" y="80" width="120" height="50" as="geometry"/>
        </mxCell>

        <!-- リレーション: 注文を持つ -->
        <mxCell id="relation-has" value="注文を持つ"
                style="shape=mxgraph.er.has;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;" vertex="1"
                parent="1">
          <mxGeometry x="320" y="180" width="140" height="70" as="geometry"/>
        </mxCell>

        <!-- エッジ: 顧客ID→顧客 -->
        <mxCell id="edge-attr-customer"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="attr-customer-id" target="entity-customer">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: 注文ID→注文 -->
        <mxCell id="edge-attr-order"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="attr-order-id" target="entity-order">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: 顧客→リレーション -->
        <mxCell id="edge-customer-has"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="entity-customer" target="relation-has">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: リレーション→注文 -->
        <mxCell id="edge-has-order"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1"
                parent="1" source="relation-has" target="entity-order">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### ポイント

- エンティティ: `mxgraph.er.entity`で表現しています。
- 属性: `mxgraph.er.attribute`で表現しています。
- リレーション: `mxgraph.er.has`で表現しています。

システム構成図
-------------------------

### 概要

異なる図形タイプを組み合わせたシステム構成図の例です。

### XMLコード

```xml
<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="AI" etag="system-arch-001">
  <diagram id="system-arch" name="システム構成図">
    <mxGraphModel dx="1200" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1"
                  page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- ノード: ユーザー(楕円) -->
        <mxCell id="user" value="ユーザー"
                style="shape=ellipse;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;" vertex="1"
                parent="1">
          <mxGeometry x="100" y="200" width="120" height="80" as="geometry"/>
        </mxCell>

        <!-- ノード: Webサーバー -->
        <mxCell id="web-server" value="Webサーバー"
                style="rounded=0;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1">
          <mxGeometry x="350" y="200" width="150" height="80" as="geometry"/>
        </mxCell>

        <!-- ノード: アプリケーションサーバー -->
        <mxCell id="app-server" value="アプリケーション&#xa;サーバー"
                style="rounded=0;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
          <mxGeometry x="600" y="200" width="150" height="80" as="geometry"/>
        </mxCell>

        <!-- ノード: データベース(円柱) -->
        <mxCell id="database" value="データベース"
                style="shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#ffe6cc;strokeColor=#d79b00;"
                vertex="1" parent="1">
          <mxGeometry x="850" y="190" width="100" height="100" as="geometry"/>
        </mxCell>

        <!-- エッジ: ユーザー→Webサーバー -->
        <mxCell id="edge-user-web" value="HTTPS"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;startArrow=classic;startFill=1;endArrow=classic;endFill=1;"
                edge="1" parent="1" source="user" target="web-server">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: Webサーバー→アプリケーションサーバー -->
        <mxCell id="edge-web-app" value="API呼び出し"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;startArrow=classic;startFill=1;endArrow=classic;endFill=1;"
                edge="1" parent="1" source="web-server" target="app-server">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- エッジ: アプリケーションサーバー→データベース -->
        <mxCell id="edge-app-db" value="SQL"
                style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;startArrow=classic;startFill=1;endArrow=classic;endFill=1;"
                edge="1" parent="1" source="app-server" target="database">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### ポイント

- 図形タイプ: `shape=ellipse`(楕円), `shape=cylinder3`(円柱), デフォルト(矩形)
- 双方向矢印: `startArrow=classic;startFill=1`で始点にも矢印を追加
- 複数行テキスト: `value`内で`&#xa;`を使用して改行

スタイルバリエーション
-------------------------

### 破線エッジ

```xml
<mxCell id="dashed-edge"
        style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;dashPattern=5 5;"
        edge="1" parent="1" source="node1" target="node2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 太字テキスト

```xml
<mxCell id="bold-node" value="重要な処理"
        style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontStyle=1;" vertex="1"
        parent="1">
  <mxGeometry x="200" y="100" width="120" height="60" as="geometry"/>
</mxCell>
```

### 影付きノード

```xml
<mxCell id="shadow-node" value="強調ノード"
        style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;shadow=1;" vertex="1" parent="1">
  <mxGeometry x="200" y="100" width="120" height="60" as="geometry"/>
</mxCell>
```

### カスタム矢印

```xml
<!-- ひし形始点、開いた矢印終点 -->
<mxCell id="custom-arrow-edge"
        style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;startArrow=diamond;startFill=1;endArrow=open;endFill=0;"
        edge="1" parent="1" source="node1" target="node2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

レイアウトパターン
-------------------------

### 水平レイアウト(左から右)

```xml
<!-- ノード1 -->
<mxCell id="h1" value="ステップ1" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="200" width="120" height="60" as="geometry"/>
</mxCell>

<!-- ノード2 -->
<mxCell id="h2" value="ステップ2" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="300" y="200" width="120" height="60" as="geometry"/>
</mxCell>

<!-- ノード3 -->
<mxCell id="h3" value="ステップ3" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="500" y="200" width="120" height="60" as="geometry"/>
</mxCell>
```

### 垂直レイアウト(上から下)

```xml
<!-- ノード1 -->
<mxCell id="v1" value="ステップ1" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="300" y="50" width="120" height="60" as="geometry"/>
</mxCell>

<!-- ノード2 -->
<mxCell id="v2" value="ステップ2" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="300" y="200" width="120" height="60" as="geometry"/>
</mxCell>

<!-- ノード3 -->
<mxCell id="v3" value="ステップ3" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="300" y="350" width="120" height="60" as="geometry"/>
</mxCell>
```

### グリッドレイアウト(2x2)

```xml
<!-- 左上 -->
<mxCell id="g11" value="項目1" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="150" height="80" as="geometry"/>
</mxCell>

<!-- 右上 -->
<mxCell id="g12" value="項目2" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="300" y="100" width="150" height="80" as="geometry"/>
</mxCell>

<!-- 左下 -->
<mxCell id="g21" value="項目3" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="230" width="150" height="80" as="geometry"/>
</mxCell>

<!-- 右下 -->
<mxCell id="g22" value="項目4" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
  <mxGeometry x="300" y="230" width="150" height="80" as="geometry"/>
</mxCell>
```

よくあるパターンと推奨事項
-------------------------

### ID命名規則

- 意味のあるID: `user`, `web-server`, `database`など
- エッジID: `edge-{source}-{target}`形式を推奨
- グループID: `group-{名前}`形式を推奨

### スタイル指定の順序

推奨される属性の記述順序:

1. 図形タイプ(`rounded`, `shape`, `rhombus`など)
2. レイアウト(`whiteSpace`, `html`)
3. 色(`fillColor`, `strokeColor`)
4. 線(`strokeWidth`, `dashed`)
5. テキスト(`fontColor`, `fontSize`, `fontStyle`, `align`, `verticalAlign`)
6. その他(`shadow`など)

### 座標系とグリッド

- グリッドサイズ: 10単位を基準
- ノード間隔: 最低50単位、推奨100単位以上
- グループマージン: グループ境界とノード間に20〜40単位のマージン

### パフォーマンス考慮事項

- 大規模図表: 100ノード以上の場合はグループ化を活用
- 複雑なエッジ: 経路指定は必要最小限に
- スタイルの再利用: 同じスタイルを複数ノードで使用
