グリッド図
=========================

基本構文
-------------------------

### grid-rows

```d2
grid-rows: 3

Executive
Legislative
Judicial
```

### grid-columns

```d2
grid-columns: 3

Executive
Legislative
Judicial
```

### 両方指定

```d2
grid-rows: 2
grid-columns: 2

Executive
Legislative
Judicial
```

width/heightの制御
-------------------------

```d2
grid-rows: 2

Executive
Legislative
Judicial
The American Government.width: 400
```

### セルの拡張

行または列のみを指定すると、オブジェクトが空間を埋めるように拡張されます。

```d2
grid-rows: 3

Executive
Legislative
Judicial
The American Government.width: 400
Voters
Non-voters
# Voters と Non-voters が残りのスペースを埋める
```

支配方向(Dominant Direction)
-------------------------

行と列の両方を指定した場合、最初に出現したほうが支配方向になります。

### 行優先

```d2
grid-rows: 4
grid-columns: 2
# オブジェクトは行を埋めてから列へ
```

### 列優先

```d2
grid-columns: 2
grid-rows: 4
# オブジェクトは列を埋めてから行へ
```

ギャップサイズの制御
-------------------------

### 全体のギャップ

```d2
grid-gap: 0  # または任意の値
```

### 個別のギャップ

```d2
vertical-gap: 10
horizontal-gap: 20
```

`grid-gap`は両方を同時に設定するショートカットです。

### ギャップ0の活用例

#### データテーブル

```d2
grid-rows: 2
grid-columns: 4
grid-gap: 0

classes: {
    header: {
        style.underline: true
    }
}

Element.class: header
Atomic Number.class: header
Atomic Mass.class: header
Melting Point.class: header

Hydrogen
1
"1.008"
"-259.16"
```

#### 地図表現

ギャップ0で隣接する領域を表現可能(例: 都道府県マップ)。

コネクション
-------------------------

### グリッド自体への接続

通常の接続と同様に動作します。

### グリッドセル間の接続

グリッド内のシェイプ間の接続は中心から中心への直線接続(パスファインディングなし)。

```d2
x: {
    grid-rows: 1
    a
    b
    c
}

x.a -> x.c  # 直線接続
```

ネスト
-------------------------

現在はグリッド内にグリッドをネスト可能です。

```d2
grid-gap: 0
grid-columns: 1

header
body: "" {
    grid-gap: 0
    grid-columns: 2
    content
    sidebar
}
footer
```

整列テクニック
-------------------------

### 不可視要素によるパディング

```d2
classes: {
    invisible: {
        style.opacity: 0
        label: ""
    }
}

grid-columns: 1

us-east-1: {
    grid-rows: 1
    a; b; c; d; e
}

us-west-1: {
    grid-rows: 1
    pad1.class: invisible
    pad2.class: invisible
    a
}

us-east-1.c -> us-west-1.a
```

トラブルシューティング
-------------------------

### セル内の余分なパディング

グリッド列内の要素は同じwidthを持ち、グリッド行内の要素は同じheightを持ちます。

**解決策**: 明示的に`width`を指定して揃える。

```d2
pod1: {
    width: 200
}

pod2: {
    width: 200
}
```

ベストプラクティス
-------------------------

- 単純なテーブルはMarkdownテーブル機能も検討
- ギャップ0で密なレイアウトを実現
- 不可視要素で整列を調整
- セル間接続は直線のみと認識
- width指定で要素サイズを統一
