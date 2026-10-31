---
name: drawio
description: draw.io XML形式の図表ファイル(.drawio, .xml)の作成・読み取り・編集、およびPNG/SVG/PDFへのエクスポートを行う際に必ず参照する。mxfile/mxCell構造のテンプレート、XML直接編集パターン、D2/Mermaidとの使い分け基準等のプロジェクト固有ルールを提供。ユーザーが「draw.io」「drawio」「diagrams.net」「.drawio」「スイムレーン図」「業務フロー図」「ワークフロー図」「ER図」「ワイヤーフレーム」「画面イメージ」に言及された場合は必ずこのスキルを読み込むこと
user-invocable: true
---
draw.io XML形式図表ファイル操作
===============================

概要
-------------------------

draw.io XML形式の図表ファイルの作成・読み取り・編集をプログラマティックに行うためのスキルです。
新規図表の生成、既存図表の読み込みと解析、テキストベースで記述でき、バージョン管理システムとの統合が容易な図表操作手順を提供します。

**注意**: draw.io XMLの完全仕様は公開されていないため、本スキルは実務で一般的な要素を中心に扱います。詳細はreferences/配下の各ドキュメントを参照してください。

非適用場面
-------------------------

以下の場合は本スキルを適用しません。

- D2形式の図表作成・編集依頼 (`d2`スキルを使用)
    - 形式の指定がない場合は図の読み手で判断する
    - AIやツールがテキストとして読む図は`d2`スキル、人間が図として見る図は本スキル
    - 読み手も判断できない場合は、推測せずユーザーへ確認する
- Mermaid形式の図表作成依頼 (Mermaid描画機能を使用)
- デザインツール上で画面を作る依頼
    - デザインツールのデータを参考に、draw.ioで画面イメージを描く依頼は本スキルの対象
- 図表のレビューのみで、draw.io XMLの作成・編集を伴わない依頼

適用場面
-------------------------

- システムフロー図やビジネスプロセス図の作成
- UML図(クラス図、シーケンス図、状態遷移図など)の生成
- システム構成図やネットワーク図の作成
- 顧客へ見せる画面イメージ(ワイヤーフレーム)の作成
- 既存draw.ioファイルの読み込みと要素情報の抽出
- `mxfile`・`mxCell`を含むXMLの直接編集
- draw.io形式で作成した図を配布用にPNG/SVG/PDFへ変換する場合
- バージョン管理システム(Git)での差分追跡が必要な図表
- GUI操作なしで図表を自動生成する場合
- 同様のパターンを持つ複数の図表を効率的に作成する場合

前提条件
-------------------------

PNG/SVG/PDFへのエクスポートには、draw.ioデスクトップアプリケーション(diagrams.net desktop)のインストールが必要です。
アプリ本体がエクスポート用CLIを兼ねています(`--export`オプション)。
画面のないLinux環境での実行方法は[形式変換CLIリファレンス](references/cli_usage.md)の「Linuxヘッドレス環境での実行」を参照してください。
CLIは次の順で探します。

1. `command -v drawio`で、`drawio`コマンドが`PATH`上にあるかを確認します
    - macOSでHomebrew(`brew install --cask drawio`)を使って入れた場合は、`drawio`コマンドとして使えます
2. ない場合は、アプリ本体の実行ファイルを直接指定します
    - macOS: `/Applications/draw.io.app/Contents/MacOS/draw.io`
    - Windows: `C:\Program Files\draw.io\draw.io.exe`
    - Linux: 配布物(`.deb`、AppImage、snap等)により実行パスが異なるため、環境ごとに実体パスを確認する

XML編集のみ(エクスポートを伴わない)であればdraw.io本体は不要です。
XMLの構文検証には`xmllint`(libxml2に同梱)を使います。
詳細なコマンド例は[形式変換ガイド](references/format_conversion.md)・[形式変換CLIリファレンス](references/cli_usage.md)を参照してください。

仕様
-------------------------

### 基本構造

draw.io XML文書の基本構造は以下の通りです。

```xml
<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="AI" etag="unique-id">
  <diagram id="diagram1" name="図表名">
    <mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1"
                  connect="1" arrows="1" fold="1" page="1" pageScale="1"
                  pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- ここにmxCell要素を追加 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 主要な要素

#### mxCell(ノード)

図形やテキストボックスを表現します。

```xml
<mxCell id="node1" value="ノード名" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;"
        vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="120" height="60" as="geometry"/>
</mxCell>
```

主要属性は次のとおりです。

- `id`: ノードの一意なID
- `value`: ノード内に表示するテキスト
- `style`: ノードのスタイル(図形の種類、色、フォントなど)
- `vertex`: ノードが頂点であることを示す(常に`vertex="1"`)
- `parent`: 親となるmxCellのID(通常は`1`、グループの場合はグループID)

#### mxCell(エッジ)

ノード間の接続線を表現します。

```xml
<mxCell id="edge1" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;"
        edge="1" parent="1" source="node1" target="node2">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

主要属性は次のとおりです。

- `id`: エッジの一意なID
- `style`: エッジのスタイル(線の種類、色、矢印など)
- `edge`: エッジであることを示す(常に`edge="1"`)
- `parent`: 親となるmxCellのID(通常は`1`)
- `source`: 接続元のmxCellのID
- `target`: 接続先のmxCellのID

#### mxCell(グループ/サブグラフ)

関連するノードをグループ化します。

```xml
<mxCell id="group1" value="グループ名" style="group" vertex="1" parent="1">
  <mxGeometry x="50" y="50" width="300" height="200" as="geometry"/>
</mxCell>
```

#### mxGeometry

ノードやエッジの位置とサイズを定義します。

- ノード: `x`, `y`, `width`, `height`属性で位置とサイズを指定
- エッジ: `relative="1"`で相対座標を使用、必要に応じて`mxPoint`要素で経路を定義

### 推奨されるファイル構造

```xml
<!-- {図表タイトル} -->
<!-- ========================= -->

<mxfile host="app.diagrams.net" modified="2026-02-01T00:00:00.000Z" agent="AI" etag="unique-id">
  <diagram id="diagram1" name="図表名">
    <mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1"
                  connect="1" arrows="1" fold="1" page="1" pageScale="1"
                  pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- グループ定義 -->
        <!-- ここにグループを記述 -->

        <!-- ノード定義 -->
        <!-- ここにノードを記述 -->

        <!-- エッジ定義 -->
        <!-- ここにエッジを記述 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### レイアウト設計指針

#### グリッドとガイドの活用

- グリッドサイズ: 10単位(デフォルト)を基準に配置
- ノード間隔: 最低50〜100単位の間隔を確保
- 整列: 同じ階層のノードは水平または垂直に揃える

#### 階層的配置

- フロー図: 上から下、または左から右の流れ
- 組織図: 上位から下位への階層構造
- ネットワーク図: 論理的な関係性を考慮した配置

### 推奨カラーパレット

| 要素種別          | 塗りつぶし色 | 線色    | 用途                                         |
| ----------------- | ------------ | ------- | -------------------------------------------- |
| UI/フロントエンド | #dae8fc      | #6c8ebf | ユーザーインターフェース、クライアント側処理 |
| バックエンド      | #d5e8d4      | #82b366 | サーバー、API、ビジネスロジック              |
| データベース      | #ffe6cc      | #d79b00 | データストア、永続化層                       |
| 外部システム      | #f8cecc      | #b85450 | 外部API、サードパーティサービス              |
| ユーザー/アクター | #e1d5e7      | #9673a6 | 人物、ユーザーロール                         |
| プロセス/処理     | #fff2cc      | #d6b656 | ビジネスプロセス、処理ステップ               |

この配色はdraw.ioの標準パレットと同じ値で、GUIで手直ししても標準の色と混ざりません。
`d2`スキルの推奨カラーパレットとは、意図的にそろえていません。

### スタイル属性リファレンス

#### ノードスタイル主要属性

- `rounded`: 角丸(0=角張る, 1=角丸)
- `fillColor`: 塗りつぶし色(例: `#dae8fc`)
- `strokeColor`: 線の色(例: `#6c8ebf`)
- `strokeWidth`: 線の太さ(数値)
- `fontColor`: テキストの色
- `fontSize`: フォントサイズ(数値)
- `fontStyle`: フォントスタイル(0=通常, 1=太字, 2=斜体, 3=太字+斜体)
- `align`: テキスト水平位置(`left`, `center`, `right`)
- `verticalAlign`: テキスト垂直位置(`top`, `middle`, `bottom`)
- `whiteSpace`: テキスト折り返し(`wrap`)
- `html`: HTML描画(1=有効)
- `shape`: 図形タイプ(rectangle, ellipse, rhombusなど)

#### エッジスタイル主要属性

- `edgeStyle`: エッジのスタイル(`orthogonalEdgeStyle`=直角線, `elbowEdgeStyle`=肘線, `entityRelationEdgeStyle`=ER図スタイル)
- `rounded`: 角を丸める(0=角張る, 1=角丸)
- `orthogonalLoop`: ループを直角に(1=有効)
- `jettySize`: 接続点サイズ(`auto`=自動調整)
- `strokeColor`: 線の色
- `strokeWidth`: 線の太さ
- `startArrow`: 始点の矢印(`none` / `classic` / `open` / `diamond` / `oval`)
- `endArrow`: 終点の矢印(`none` / `classic` / `open` / `diamond` / `oval`)
- `dashed`: 破線(1=有効)
- `curved`: 曲線(1=有効)

### 詳細リファレンス

より詳細な情報は以下のドキュメントを参照してください。

- [実装例とサンプルコード](references/examples.md)
- [スタイル属性詳細](references/styles.md)
- [図形タイプ一覧](references/shapes.md)
- [エッジスタイル詳細](references/edge_styles.md)
- [mxGeometry高度な機能](references/geometry.md)
- [形式変換ガイド](references/format_conversion.md)
- [形式変換CLIリファレンス](references/cli_usage.md)
- [ER図の生成](references/er-diagram.md): 概要ER図の生成手順、カーディナリティ判定、レイアウト
- [スイムレーン図の生成](references/swimlane.md): 業務プロセスのスイムレーン図の生成手順
- [ワイヤーフレームの生成](references/wireframe.md): 顧客へ見せる画面イメージの生成手順

作成手順
-------------------------

図を新しく作る場合は、次の順で進めます。

1. 図種に対応するサンプルと生成手順を特定します
    - スイムレーン図: [サンプル](assets/workflow_example.drawio)と[生成手順](references/swimlane.md)
    - ER図: [サンプル](assets/er_diagram_example.drawio)と[生成手順](references/er-diagram.md)
    - ワイヤーフレーム: [サンプル](assets/wireframe_example.drawio)と[生成手順](references/wireframe.md)
    - その他の図: [実装例とサンプルコード](references/examples.md)の該当する例
2. 出力する前に、サンプルを開いて読み込みます
3. サンプルの構成に合わせて書きます
    - 要素の並び(グループ、ノード、エッジの順)とスタイルの書き方をそろえます
    - 「技術的制約と禁止事項」の必須要素とID管理に従います
    - 仕様にある要素と関係だけを書きます
4. 出力後、`xmllint --noout <ファイル>`でXMLの構文を検証します
    - 終了コードが0以外の場合は、表示された行を直して再検証します
    - 画像の出力が必要な場合は、`--export`の終了コードと出力ファイルの有無も確認します([形式変換CLIリファレンス](references/cli_usage.md)を参照)
    - `xmllint`が使えない環境では、未検証である旨を依頼者へ伝えて終えます

「詳細リファレンス」節の一覧は索引であり、サンプルの代わりにはなりません。

トラブルシューティング
-------------------------

### 基本的な確認項目

- XMLがインポートできない: XML構文エラーをチェック、必須要素(`<mxfile>`, `<diagram>`, `<mxGraphModel>`, `<root>`)の存在を確認
- ノードが表示されない: `vertex="1"`属性、`parent`属性、`mxGeometry`要素の存在を確認
- エッジが表示されない: `edge="1"`属性、`source`/`target`属性、参照先ノードIDの存在を確認
- レイアウトが崩れる: ノード座標の重複チェック、グループ内のノード座標がグループサイズ内に収まるか確認
- テキストが表示されない: `value`属性の存在、`whiteSpace=wrap`属性、ノードサイズの十分性を確認
- 日本語が文字化けする: UTF-8エンコーディング、`html=1`属性の設定を確認

技術的制約と禁止事項
-------------------------

### 必須要素

以下の要素は省略できません。

- `<mxfile>`: ルート要素
- `<diagram>`: ダイアグラム要素
- `<mxGraphModel>`: グラフモデル要素
- `<root>`: ルート要素
- `<mxCell id="0"/>`: ルートmxCell
- `<mxCell id="1" parent="0"/>`: ドキュメントmxCell

### ID管理

- すべての`mxCell`要素は一意な`id`属性を持つ必要があります。
- ID `0`と`1`は予約されています(ルートとドキュメント用)。
- ノード、エッジ、グループのIDは重複してはいけません。

### 構文制約

- XML構文に厳格に従う必要があります(タグの閉じ忘れ、属性値のクォート忘れは不可)。
- `mxGeometry`要素はノードとグループに必須です。
- エッジの`source`と`target`属性は存在する`mxCell`のIDを参照する必要があります。

### 品質制約

- 論理的整合性: 意図的な自己ループを除き、循環参照(エッジのsourceとtargetが同一)を避ける
- 視覚的明瞭性: ノードの重なりを避ける、エッジの不必要な交差を減らす
- 整合性: 提供された仕様に存在しない要素や関係の追加禁止

参考リソース
-------------------------

- [draw.io公式ドキュメント](https://www.diagrams.net/doc/)
