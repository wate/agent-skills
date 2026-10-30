D2言語クイックリファレンス
=========================

D2図表作成時に必要な基本構文とスタイル属性のクイックリファレンスです。

基本構文
-------------------------

### ノード定義

```d2
# シンプルなノード
ユーザー
Webサーバー

# ラベル付きノード
server: Web Server
db: Database

# 図形の種類を指定
circle_node: {
  shape: circle
}
```

### エッジ(接続)定義

```d2
# 基本的な接続
x -- y          # 線
x -> y          # 右向き矢印
x <- y          # 左向き矢印
x <-> y         # 双方向矢印

# ラベル付き接続
x -> y: connects to

# 接続の連鎖
A -> B -> C -> D
```

### コンテナ(グループ化)

```d2
# ネスト構文
server: {
  api
  db
  auth
}

# コンテナにラベル
clouds: {
  label: Cloud Services
  aws
  gcloud
}
```

よく使う図形
-------------------------

### 基本図形

- `rectangle` - 四角形(デフォルト)
- `circle` - 円
- `oval` - 楕円
- `diamond` - ひし形
- `cylinder` - 円柱(データベース用)
- `cloud` - クラウド
- `person` - 人物

### 特殊図形

- `sequence_diagram` - シーケンス図
- `sql_table` - データベーステーブル
- `code` - コードブロック

スタイル属性
-------------------------

### 基本スタイル

```d2
server: {
  style.fill: lightblue        # 塗りつぶし色
  style.stroke: darkblue       # 線の色
  style.stroke-width: 2        # 線の太さ（1-15）
  style.stroke-dash: 5         # 破線（0-10）
  style.font-size: 16          # フォントサイズ（8-100）
  style.font-color: white      # フォント色
  style.bold: true             # 太字
  style.border-radius: 10      # 角の丸み
  style.opacity: 0.8           # 透明度（0.0-1.0）
}
```

### 色の指定方法

- CSS色名: `lightblue`, `darkgreen`, `red`
- 16進数カラーコード: `"#ff0000"`, `"#00ff00"`

クラス機能
-------------------------

同じスタイルを複数の要素に再利用できます。

```d2
# クラス定義
classes: {
  server: {
    style: {
      fill: lightblue
      stroke: darkblue
      stroke-width: 2
    }
    shape: rectangle
  }
  
  database: {
    style: {
      fill: lightgreen
      stroke: darkgreen
    }
    shape: cylinder
  }
}

# クラスの適用
web_server: {
  class: server
}

user_db: {
  class: database
}

# 複数クラスの適用
critical_server: {
  class: [base, important]
}

# クラスの上書き
special_server: {
  class: server
  style.fill: red
}
```

### 外部ファイルの読み込み

共通スタイルやクラス定義は、別の`.d2`ファイルへ切り出して再利用できます。

```d2
# 共通定義側(common_styles.d2)
status_complete: {
  shape: circle
  style: {
    fill: white
    stroke: blue
    font-color: blue
  }
}

# 利用側(task_status.d2)
classes: {
  ## ステータス：完了
  status_complete: @common_styles.status_complete
}

classes: {
  ...@common_styles
}
```

- `@file.object`: 外部ファイルの特定オブジェクトを読み込みます。
- `...@file`: mapの中へ一括展開します。
- 相対パスは読み込むファイルから解決されます。
- `.d2`拡張子は省略できます。
