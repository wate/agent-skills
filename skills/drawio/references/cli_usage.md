draw.io CLI リファレンス
=========================

概要
-------------------------

draw.ioデスクトップアプリに同梱されるCLIを使って、`.drawio`ファイルをPNG/SVG/PDFへ変換する際のオプション・コマンドパターンをまとめます。

形式変換の運用方針・命名規約・実務フローは[形式変換ガイド](format_conversion.md)を参照してください。

バイナリの場所
-------------------------

draw.io CLIはデスクトップアプリに同梱されており、`PATH`には含まれていないため、フルパスで指定するか、シェルの設定でエイリアスを定義して使います。

### macOS

```bash
/Applications/draw.io.app/Contents/MacOS/draw.io
```

### Windows

```powershell
"C:\Program Files\draw.io\draw.io.exe"
```

### Linux

インストール方法(`.deb`/AppImage/snap等)によって異なります。
`which drawio`または`which draw.io`で実体パスを確認してください。

### 動作確認

```bash
draw.io --help
```

Linuxヘッドレス環境での実行
---------------------------

画面のないLinux環境では、仮想フレームバッファー(Xvfb)上でアプリを実行します。
Ubuntu系コンテナでの手順は次のとおりです。
`DRAWIO_VERSION`を使用するバージョンに置き換えてから実行します。

```bash
apt-get update
apt-get install -y xvfb fonts-noto-cjk librsvg2-bin ca-certificates wget

# 公式配布のdebを取得する
DRAWIO_VERSION="<version>"
wget "https://github.com/jgraph/drawio-desktop/releases/download/v${DRAWIO_VERSION}/drawio-amd64-${DRAWIO_VERSION}.deb"
apt-get install -y "./drawio-amd64-${DRAWIO_VERSION}.deb"

# 仮想ディスプレイ上で動作を確認する
xvfb-run -a drawio --no-sandbox --version

# 変換する
xvfb-run -a drawio --no-sandbox --export --embed-diagram --format svg \
    --output er.drawio.svg er.drawio
rsvg-convert -z 2 -o er.png er.drawio.svg
```

`drawio`はUbuntuのaptリポジトリに存在しないため、公式GitHub Releasesの`.deb`またはAppImageを使います。
AppImageはFUSEが使えない環境では`--appimage-extract`で展開して実行します。

前提と注意点は次のとおりです。

- `apt-get`とGitHub Releasesへの通信には、root権限と外向き通信が必要です
- rootで実行する場合は`--no-sandbox`を付けます
- 日本語を含む図は`fonts-noto-cjk`がないと文字化けします
- `.deb`はamd64で100MB台、インストール後は数百MBのディスクを使います
- コンテナが揮発性の場合は、`.deb`を永続ボリュームに置くと再取得を避けられます
- 再現性を確保するため、`drawio`のバージョンは固定します

基本構文
-------------------------

```
draw.io --export --format <format> --output <output> <input>
```

主要なオプション
-------------------------

### エクスポート系

| オプション        | 省略形 | 説明                                          |
| ----------------- | ------ | --------------------------------------------- |
| `--export`        | `-x`   | エクスポートモードで実行                      |
| `--format`        | `-f`   | 出力形式を指定(`png` / `svg` / `pdf` / `xml`) |
| `--output`        | `-o`   | 出力ファイルパスを指定                        |
| `--embed-diagram` | `-e`   | 出力画像にソースの draw.io XML を埋め込む     |
| `--page-index`    | `-p`   | エクスポートするページ番号(1 始まり)          |
| `--page-count`    |        | エクスポートするページ数                      |
| `--all-pages`     |        | 全ページをエクスポート                        |
| `--transparent`   |        | PNG の背景を透過にする                        |
| `--scale`         |        | 出力スケールを倍率で指定(例: `2.0` = 2倍)     |

### その他

| オプション  | 説明             |
| ----------- | ---------------- |
| `--help`    | ヘルプを表示     |
| `--version` | バージョンを表示 |

コマンドパターン
-------------------------

### 単一ファイルをエクスポート

```bash
# PNG
draw.io --export --format png --output diagram.png diagram.drawio

# SVG
draw.io --export --format svg --output diagram.svg diagram.drawio

# PDF
draw.io --export --format pdf --output diagram.pdf diagram.drawio
```

### draw.io XML を埋め込んでエクスポート(推奨)

出力ファイルにソースのdraw.ioデータが埋め込まれるため、あとからdiagrams.netで再編集できます。
[命名規約](format_conversion.md)に従い、拡張子を`*.drawio.png`/`*.drawio.svg`/`*.drawio.pdf`にします。

```bash
draw.io --export --embed-diagram --format png --output er.drawio.png er.drawio
draw.io --export --embed-diagram --format svg --output er.drawio.svg er.drawio
draw.io --export --embed-diagram --format pdf --output er.drawio.pdf er.drawio
```

### 特定ページのみエクスポート

`--page-index`は1始まりです。
v27.0.2より前のバージョンは0始まりだったため、古いCLIでは`0`が1ページ目になります。
`0`を指定すると`Invalid page index: pages are numbered from 1 (0-based before v27.0.2)`で失敗します。

```bash
# 1 ページ目（index 1）
draw.io --export --format png --page-index 1 --output page1.png diagram.drawio

# 2 ページ目（index 2）
draw.io --export --format png --page-index 2 --output page2.png diagram.drawio
```

### 全ページをまとめて PDF に出力

```bash
draw.io --export --format pdf --all-pages --output all.pdf diagram.drawio
```

### 透過背景で PNG を出力

```bash
draw.io --export --format png --transparent --output diagram.transparent.png diagram.drawio
```

### HiDPI 用に 2 倍スケールで出力

```bash
draw.io --export --format png --scale 2.0 --output diagram@2x.png diagram.drawio
```

### 複数ファイルを一括エクスポート(シェル)

```bash
find docs -name "*.drawio" | while read -r f; do
    draw.io --export --embed-diagram --format png \
        --output "${f%.drawio}.drawio.png" "$f"
done
```

参考
-------------------------

- [形式変換ガイド](format_conversion.md) - 運用方針・命名規約・実務フロー
- `draw.io --help` - 最新オプション一覧(CLIオプションはバージョンにより変わるため、常にヘルプを確認する)
- [diagrams.net 公式](https://www.diagrams.net/)
