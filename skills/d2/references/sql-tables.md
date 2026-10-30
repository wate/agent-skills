SQLテーブル図
=========================

基本構文
-------------------------

```d2
my_table: {
    shape: sql_table
    
    id: int {constraint: primary_key}
    name: varchar(255)
    created_at: timestamp
}
```

各キーがテーブルの行(フィールド)を定義します

- キー名: フィールド名
- 値: データ型
- `constraint`: SQL制約

制約の記法
-------------------------

### 短縮表記

以下は自動的に短縮されます

| 完全記法    | 短縮記法 |
| ----------- | -------- |
| primary_key | PK       |
| foreign_key | FK       |
| unique      | UNQ      |

### 制約の指定

```d2
my_table: {
    shape: sql_table
    
    id: int {constraint: primary_key}
    email: varchar {constraint: unique}
    user_id: int {constraint: foreign_key}
}
```

### 複数制約

```d2
x: int {
    constraint: [primary_key; unique]
}
```

### 認識されない制約

認識されない制約は短縮されずにそのまま表示されます。

外部キー接続
-------------------------

### 基本的な外部キー

```d2
objects: {
    shape: sql_table
    id: int {constraint: primary_key}
    disk_id: int {constraint: foreign_key}
}

disks: {
    shape: sql_table
    id: int {constraint: primary_key}
}

objects.disk_id -> disks.id
```

### レイアウトエンジンによる違い

- TALA/ELK: 接続が正確な行を指す
- dagre: テーブル全体への接続

コンテナへのネスト
-------------------------

sql_tableは他のシェイプと同様にコンテナにネスト可能です。

```d2
cloud: {
    disks: {
        shape: sql_table
        id: int {constraint: primary_key}
    }
    
    blocks: {
        shape: sql_table
        id: int {constraint: primary_key}
        disk: int {constraint: foreign_key}
    }
    
    blocks.disk -> disks.id
}
```

予約語のエスケープ
-------------------------

予約語をフィールド名として使用する場合は引用符で囲みます。

```d2
my_table: {
    shape: sql_table
    "label": string
    "style": text
}
```

スタイル適用
-------------------------

### fill/strokeの特殊な挙動

- `fill`: ヘッダーに適用
- `stroke`: ボディに適用
- `font-color`: ヘッダーテキストのみ

```d2
my_table: {
    shape: sql_table
    id: int {constraint: primary_key}
    
    style: {
        fill: "#3498db"        # ヘッダー背景
        stroke: "#e8f5e9"      # ボディ背景
        font-color: white      # ヘッダーテキスト色
    }
}
```

ベストプラクティス
-------------------------

- ER図作成にはsql_tableを使用
- 制約は標準的な名称を使用(PK/FK/UNQ等)
- 外部キーは明示的に行レベルで接続
- TALA/ELKを使用すると行への正確な接続が可能
- テーマを活用してボディの色を統一
