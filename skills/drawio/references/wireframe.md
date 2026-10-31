ワイヤーフレーム(draw.io形式)
=============================

概要
-------------------------

画面の要件から、draw.io形式のワイヤーフレームを生成する手順を提供します。
ヒアリングや要件確認の場で、顧客へ画面イメージを見せる場面を対象にします。

精細度は、ラフな線画とHTMLのモックアップの中間です。
配色、角丸、影を付け、実際の業務画面へ近い見た目にします。
画面に何を置くかは呼び出し元から受け取り、本手順は描き方だけを扱います。

適用場面
-------------------------

- 顧客へ見せる画面イメージを作るとき。
- デザイン案の画像をもとに、編集できる画面イメージを作るとき。
- 打ち合わせの場で、配置をGUIで直す前提の画面イメージを作るとき。

非適用場面
-------------------------

- ブラウザーで動きを確かめるHTMLのモックアップが必要な場合(`mockup`スキルを参照)。
- 画面遷移を設計する場合(`screen-flow`スキルを参照)。
- 画面の構成要素やUIパターンを選ぶ場合(`ui-pattern`スキルを参照)。
- デザインツール上で画面を作る場合。

生成手順
-------------------------

### 1. 入力の確認

受け付ける入力は次のとおりです。

- 必須: 画面ごとの要件(画面名、置く項目、操作、表示するデータの例)
- 任意: デザイン案の画像(デザインツールから書き出した画像、手描きのラフ、既存システムの画面など)
- 任意: 主な色コード(メインの色、背景、文字)

入力に応じて、見た目の決め方を切り替えます。

- デザイン案の画像がない場合は、「3. 部品のスタイル」の汎用テーマで描きます
- デザイン案の画像がある場合は、画像から配置と色を読み取り、汎用テーマの色・角丸・影を置き換えます
    - 角丸は、カード・ボタン・入力欄の角を画像で見比べ、部品ごとに`arcSize`を置き換えます
    - 両端が丸いボタンやタブは、`arcSize`を部品の高さの半分にします
- 色コードが渡された場合は、画像から読み取った色より色コードを優先します
- 画面の要件が足りない場合は、推測で項目を足さず、依頼者へ確認します

デザイン案の再現は、配置と雰囲気を近づける程度にします。
ピクセル単位では合わせません。

### 2. ページとレイヤーの構成

- 1画面を1ページ(`<diagram>`)にし、`name`属性に画面名を入れます
- 各ページの`<root>`に、次の順で2つのレイヤーを置きます
    - `<mxCell id="1" value="画面" parent="0" />`: 画面の要素を置きます
    - `<mxCell id="{ページID}-note" value="注記" parent="0" />`: 番号、付箋、未確定の表示欄を置きます
- 要素の`id`は`{ページID}-{要素名}`にし、ページをまたいでも重複させません
- 画面の幅は1040を基準にし、注記は画面の右側(x=1060から幅240)に並べます
- `pageWidth`は1320にし、`pageHeight`は画面の高さに合わせます
- 画面レイヤーの最初の要素に、ページ全体(幅1320、高さは`pageHeight`)を覆うページの背景を置きます
    - 背景のない部分は、エディターからPNGへ書き出すと透過になります。注記の並ぶ右側の余白が透けないようにするためです

### 3. 部品のスタイル

汎用テーマの色は次のとおりです。

- アクセント(主ボタン、選択中のメニュー、リンク): `#2563EB`
- 画面の背景: `#F5F7FA`
- カードと入力欄の地: `#FFFFFF`
- 文字: 本文`#1F2937`、ラベルと表の見出し`#374151`、補足`#6B7280`、プレースホルダー`#9CA3AF`
- 枠線: カードと表`#E5E7EB`、入力欄と副ボタン`#D1D5DB`
- サイドメニュー: 地`#1E293B`、文字`#CBD5E1`
- 表の見出し行の地: `#F3F4F6`
- 注記: 線と番号`#E8590C`、地`#FFF4E5`、文字`#7C2D12`

角丸は`absoluteArcSize=1`で実寸を指定し、カードは8、ボタンと入力欄は6、注記は4にします。
影はカードだけに付けます。

各部品の`style`属性は次の文字列を使います。

```text
ページの背景: rounded=0;html=1;fillColor=#FFFFFF;strokeColor=none;
画面の背景: rounded=0;html=1;fillColor=#F5F7FA;strokeColor=none;
ヘッダー: rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E5E7EB;fontColor=#1F2937;fontSize=16;fontStyle=1;align=left;spacingLeft=16;
ヘッダーのユーザー名: text;html=1;fontColor=#6B7280;fontSize=13;align=right;verticalAlign=middle;
サイドメニュー: rounded=0;html=1;fillColor=#1E293B;strokeColor=none;
サイドメニューの項目: text;html=1;fontColor=#CBD5E1;fontSize=13;align=left;verticalAlign=middle;spacingLeft=20;
サイドメニューの選択中の項目: rounded=0;html=1;fillColor=#2563EB;strokeColor=none;fontColor=#FFFFFF;fontSize=13;align=left;verticalAlign=middle;spacingLeft=20;
画面タイトル: text;html=1;fontColor=#1F2937;fontSize=20;fontStyle=1;align=left;verticalAlign=middle;
カード: rounded=1;absoluteArcSize=1;arcSize=8;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E5E7EB;shadow=1;fontColor=#1F2937;fontSize=14;fontStyle=1;align=left;verticalAlign=top;spacingLeft=16;spacingTop=10;
主ボタン: rounded=1;absoluteArcSize=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#2563EB;strokeColor=#2563EB;fontColor=#FFFFFF;fontSize=13;fontStyle=1;
副ボタン: rounded=1;absoluteArcSize=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D1D5DB;fontColor=#374151;fontSize=13;
項目ラベル: text;html=1;fontColor=#374151;fontSize=12;align=left;verticalAlign=bottom;
入力欄: rounded=1;absoluteArcSize=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D1D5DB;fontColor=#9CA3AF;fontSize=13;align=left;spacingLeft=10;
入力欄(複数行): rounded=1;absoluteArcSize=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D1D5DB;fontColor=#9CA3AF;fontSize=13;align=left;verticalAlign=top;spacingLeft=10;spacingTop=8;
プルダウン: rounded=1;absoluteArcSize=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#D1D5DB;fontColor=#1F2937;fontSize=13;align=left;spacingLeft=10;
プルダウンの三角: triangle;direction=south;html=1;fillColor=#6B7280;strokeColor=none;
表の見出し行: rounded=0;whiteSpace=wrap;html=1;fillColor=#F3F4F6;strokeColor=#E5E7EB;fontColor=#374151;fontSize=12;fontStyle=1;align=left;spacingLeft=10;
表の本文行: rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E5E7EB;fontColor=#1F2937;fontSize=12;align=left;spacingLeft=10;
表の操作リンク: rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E5E7EB;fontColor=#2563EB;fontSize=12;align=left;spacingLeft=10;
注記の番号: ellipse;whiteSpace=wrap;html=1;fillColor=#E8590C;strokeColor=#FFFFFF;strokeWidth=2;fontColor=#FFFFFF;fontSize=11;fontStyle=1;
注記: rounded=1;absoluteArcSize=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#FFF4E5;strokeColor=#E8590C;fontColor=#7C2D12;fontSize=12;align=left;verticalAlign=top;spacingLeft=8;spacingTop=6;
未確定の表示欄: rounded=1;absoluteArcSize=1;arcSize=4;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#E8590C;dashed=1;fontColor=#E8590C;fontSize=12;fontStyle=1;
```

デザイン案に合わせる場合も、置き換えるのは色・角丸・影の値だけにします。
部品の種類と組み合わせ方は変えません。

### 4. 画面の骨格

- ヘッダー(高さ56)、サイドメニュー(幅200)、画面タイトル、カードの順に置きます
- コンテンツはx=232から幅776の範囲に置き、カードの間は20あけます
- カードの中の要素は、カードの左右から24内側に置きます
- 入力欄、プルダウン、ボタンの高さは36、表の見出し行は36、本文行は40にします
- ログイン画面のようにサイドメニューを持たない画面では、サイドメニューを省き、同じ部品で組み立てます

### 5. 部品の配置

- 項目ラベルは入力欄の上に高さ20で置き、入力欄との間を4あけます
- 必須の項目は、ラベルに「(必須)」と書きます
- プルダウンは、入力欄と同じ矩形の右端から24の位置へ、プルダウンの三角(幅10、高さ6)を重ねます
- 表は、列ごとに表の見出し行と表の本文行のセルを並べて組み立てます
- ボタンは、主ボタンを右端に置き、副ボタンをその左に並べます
- ダミーの文言は、業務に合う日本語で書きます

### 6. 注記の書き方

- 確認したい点ごとに番号を振り、注記の番号(22×22)を対象の要素の右上に重ねます
- 番号はファイル全体の通し番号にし、次のページでは前のページの続きから振ります
- 付箋は画面の右側に番号順で上から並べ、文頭に同じ番号を書きます
- 「画面イメージ(デザインは未確定)」の表示欄を、各ページの右上(x=1060、y=13、幅240、高さ30)に置きます
- 確認したい点は、呼び出し元から渡されたものだけを書きます

### 7. XML生成

- 要素の並びは、骨格、カードごとの部品、注記の順にし、まとまりごとにコメントを付けます
- 基本的なXML構造は`SKILL.md`を参照してください

### 8. 見た目の確認

`xmllint --noout`で構文を検証した後、ページごとにPNGへ書き出して画像を読み込みます。

```bash
drawio --export --format png --page-index 1 --output page1.png wireframe.drawio
```

`--page-index`は、v27.0.2以降は1始まりです。
`--transparent`は付けません。
画像では、次の点を確かめます。

- 要素どうしが重なっていない
- 文字が要素やカードからはみ出していない
- 注記の番号が、対象の要素の近くにある
- 注記の並ぶ右側の余白が透けていない
- デザイン案がある場合は、デザイン案の画像と並べて、色・メニューの位置・角丸が合っている

崩れていた場合は、座標と幅を直して書き出し直します。
書き出した画像は確認用で、出力物には含めません。
draw.io本体がない環境では、見た目を確認していない旨を依頼者へ伝えて終えます。

### 9. 配布用の書き出し

配布用のPDFは、依頼があった場合だけ書き出します。
注記レイヤーを隠し、全ページを1つのPDFにまとめます。

```bash
drawio --export --format pdf --all-pages --layers 0 --output wireframe.pdf wireframe.drawio
```

`--layers`には、書き出すレイヤーの番号を`<root>`の中の並び順(0始まり)で、カンマ区切りで指定します。
打ち合わせで注記も見せる場合は、`--layers`を付けません。
`--layers`が使えるかは、`drawio --help`の出力で確認します。

出力
-------------------------

- 出力先: `docs/wireframe/{画面群名}.drawio`(既定値)
- ファイル名: 画面群名の英語スネークケース
- 呼び出し元の指示がある場合は、その出力先を優先します

出力サンプル
-------------------------

[ワイヤーフレームのサンプル](../assets/wireframe_example.drawio)

1ページ目は一覧画面、2ページ目は登録画面です。
出力前に必ずサンプルを参照し、書式を一致させてください。

図種固有の制約・禁止事項
-------------------------

- 画面の要件にない項目、ボタン、表の列を足しません
- サンプルの会社名、人名、商品名、説明文を写しません
- サイドメニューの項目は、同じファイルで描く画面の名前だけにします
- 1ページに複数の画面を描きません
- 注記の要素を画面レイヤーに置かず、画面の要素を注記レイヤーに置きません
- 手描き風(`sketch=1`)と、グレーだけの配色は使いません
- 汎用テーマとデザイン案にない色を使いません
- `mxgraph.mockup.*`の図形は、汎用テーマの部品で代わりが利かない場合だけ使います

図種固有のエラー対応
-------------------------

- 文字がはみ出す: 要素の幅を広げるか、ダミーの文言を短くします
- 要素が重なる: 同じ行の要素の`x`と`width`を足し合わせ、カードの内側に収まるよう並べ直します
- 書き出しに注記が残る: 注記の要素の`parent`が、注記レイヤーのIDになっているかを確認します
- `--page-index`で終了コードが1になる: 1始まりで指定し直します(v27.0.2より前は0始まり)
- 角丸が大きすぎる: `absoluteArcSize=1`の有無を確認します
- PNGの余白が透ける: ページの背景の有無と、`--transparent`を付けていないかを確認します
