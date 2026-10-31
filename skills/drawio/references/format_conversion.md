draw.io形式と画像形式の変換ガイド
=================================

概要
-------------------------

このドキュメントは、draw.io形式(`.drawio`)と配布用形式(PNG/SVG/PDF)の変換方針をまとめたものです。

運用方針
-------------------------

- 編集・保守用の正本は`.drawio`を保持します。
- 配布・共有用は、再編集性を優先して埋め込みXML付き画像(`*.drawio.png`/`*.drawio.svg`)を標準とします。
- 互換性や容量要件が厳しい場合のみ、埋め込みなしの通常画像(`*.png`/`*.svg`)を使用します。
- 同じ図の派生物は、同じベース名で管理します(例: `er.drawio`と`er.png`)。

### 命名規約(埋め込みデータの識別)

- 埋め込みXMLなしの通常画像: `*.png`/`*.svg`
- draw.io図データ(埋め込みXML)ありの画像: `*.drawio.png`/`*.drawio.svg`
- 例:
    - 通常PNG: `er.png`
    - 埋め込みPNG: `er.drawio.png`
    - 通常SVG: `er.svg`
    - 埋め込みSVG: `er.drawio.svg`

対応範囲
-------------------------

### 1. draw.io形式 -> 画像形式

対応しています。

- 例: `er.drawio`を`er.drawio.png`へ変換してSlack等へ添付
- 画像形式はPNG/SVG/PDFを想定

### 2. 画像形式 -> draw.io形式

条件付きで対応できます。

- 対応可能なケース:
    - diagrams.netで書き出したPNG/SVG/PDFに図データ(埋め込みXML)が含まれている場合
- 対応不可または限定的なケース:
    - 埋め込みXMLがない通常の画像ファイル
    - この場合は新規に`.drawio`を作成して再構築します

コマンド例
-------------------------

以下は代表的なCLI例です。
実際のコマンド名やオプションは利用環境によって異なるため、手元のdraw.io/diagrams.net CLI仕様を優先してください。

コマンド名は環境によって`drawio`または`draw.io`になります。
コマンド衝突を避けるため、以下は`draw.io`で記載しています。

### 実行コマンドとインストール先の確認

- 実運用では`PATH`が通っていないケースが多いため、フルパス実行を基本とします。
- macOSの例:

```bash
/Applications/draw.io.app/Contents/MacOS/draw.io --help
```

- Windowsの例(PowerShell):

```powershell
"C:\Program Files\draw.io\draw.io.exe" --help
```

- Linuxはインストール方法(AppImage、snap、package manager等)で実行パスが変わるため、環境ごとに実体パスを確認してから利用します。

### draw.io形式 -> PNG/SVG/PDF

```bash
# PNGへ変換
draw.io --export --format png --output er.png er.drawio

# SVGへ変換
draw.io --export --format svg --output er.svg er.drawio

# PDFへ変換
draw.io --export --format pdf --output er.pdf er.drawio

# PNGを透過背景で出力
draw.io --export --format png --transparent --output er.transparent.png er.drawio

# 2ページ目をPNGで出力(ページ番号は1始まり。index 2=2ページ目)
draw.io --export --format png --page-index 2 --output er.page2.png er.drawio
```

`--page-index`の基準はバージョンで変わります。v27.0.2以降は1始まり、それより前は0始まりです。
手元のCLIで`draw.io --version`を確認し、0始まりの時代のCLIでは`--page-index 1`が2ページ目になります。

### 画像に図データを埋め込んで書き出す(復元しやすくする)

```bash
# 埋め込みXML付きPNGを書き出す例
draw.io --export --format png --embed-diagram --output er.drawio.png er.drawio

# 埋め込みXML付きSVG/PDFの例
draw.io --export --format svg --embed-diagram --output er.drawio.svg er.drawio
draw.io --export --format pdf --embed-diagram --output er.drawio.pdf er.drawio
```

### SVGからPNG/PDFへ変換する(rsvg-convert)

あらかじめ書き出した`.drawio.svg`は、`rsvg-convert`(librsvg)でdraw.io本体を起動せずに画像化できます。
CIなどでdraw.ioのPNGエクスポートが使えない場合や、同じSVGから解像度違いの画像を作る場合に使います。
`rsvg-convert`はSVG専用のため、`.drawio`を直接入力することはできません。

前提として`rsvg-convert --version`で動作を確認します。
macOSでは`brew install librsvg`、Debian系では`apt install librsvg2-bin`で導入できます。

```bash
# 1. draw.ioからSVGを書き出す(埋め込みXMLを残すため--embed-diagramを付ける)
draw.io --export --embed-diagram --format svg --output er.drawio.svg er.drawio

# 2. SVGを2倍スケールのPNGへ変換
rsvg-convert -z 2 -o er.png er.drawio.svg

# 幅を1600pxに固定してPNGへ変換
rsvg-convert -w 1600 -o er.w1600.png er.drawio.svg

# PDFへ変換
rsvg-convert -f pdf -o er.pdf er.drawio.svg

# 白背景のPNGへ変換(既定は透過)
rsvg-convert -b white -o er.white.png er.drawio.svg
```

主なオプションは次のとおりです。

| オプション                         | 説明                                           |
| ---------------------------------- | ---------------------------------------------- |
| `-z`, `--zoom`                     | 倍率指定(`-z 2`で2倍)                          |
| `-w`, `--width` / `-h`, `--height` | 出力の幅・高さ(px)                             |
| `-d`, `--dpi-x` / `-p`, `--dpi-y`  | DPI指定(既定は96)                              |
| `-f`, `--format`                   | 出力形式(`png` / `pdf` / `ps` / `eps` / `svg`) |
| `-b`, `--background-color`         | 背景色(既定は透過)                             |
| `-a`, `--keep-aspect-ratio`        | 縦横比を維持                                   |

運用上の注意点は次のとおりです。

- `rsvg-convert`の出力PNG/PDFには埋め込みXMLが残らないため、
  再編集用には`.drawio`と`er.drawio.svg`を正本として保持します
- 出力形式はPNG/PDF等に限られ、draw.io形式へは戻せません
- 日本語はfontconfigのフォントで描画されるため、環境にフォントがないと文字化けや代替字形になります
- draw.io側で外部画像を参照している図は、画像を埋め込んでからエクスポートしないと欠ける場合があります

### 画像形式 -> draw.io形式

CLIでの復元はツール依存のため、以下の運用を推奨します。

1. 埋め込みXML付き画像をdiagrams.netで開きます。
2. `.drawio`として保存し直します。

埋め込みXMLがない画像の場合は、`.drawio`へ自動復元できないため再作成します。

補足として、埋め込みXMLの有無は拡張子命名で識別します。
`*.drawio.png`/`*.drawio.svg`は復元候補、`*.png`/`*.svg`は通常画像として扱います。

実務フロー
-------------------------

### ER図をPNGで納品する場合

1. `.drawio`でER図を作成します。
2. `.drawio`を正本として保存します。
3. 配布用に埋め込みXML付きPNG(`*.drawio.png`)を書き出します。
4. 互換性要件がある場合のみ、通常PNG(`*.png`)も併せて出力します。
5. 要望があれば、同時にSVG/PDFも出力します。

### 修正依頼が来た場合

1. 正本の`.drawio`を編集します。
2. PNG/SVG/PDFを書き出し直します。
3. 配布物のみを直接修正しない運用を徹底します。

依頼文の解釈例
-------------------------

- 「drawioでER図を書いて、保存形式はpng形式で」
    - 期待成果物(標準): `.drawio`(編集用) と`.drawio.png`(配布用)
    - 追加要件がある場合: `.png`(互換配布用) も併せて出力

補足
-------------------------

ツールや環境によって、画像出力時の設定項目名は異なる場合があります。
運用上は「正本は`.drawio`」「配布は画像形式」を基準に統一します。

参考
-------------------------

- Qiita記事: https://qiita.com/u4da3/items/646cc46bff68b380cbfa

この種の記事は導入時の参考として有用です。
ただし、CLIオプションはバージョン差分が出やすいため、最終的には`draw.io --help`または`drawio --help`の結果を優先してください。
