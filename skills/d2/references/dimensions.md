寸法設定
=========================

基本構文
-------------------------

```d2
x: {
    width: 200
    height: 150
}
```

制約事項
-------------------------

### コンテナには適用不可

コンテナは子要素に合わせてサイズ変更されるため、`width`と`height`を指定できません。

### 対象シェイプ

以下のシェイプに適用可能:

- 基本シェイプ(rectangle, circle, oval等)
- image
- text
- sql_table
- class
- その他非コンテナシェイプ

使用例
-------------------------

### 画像サイズの制御

```d2
small jerry: "" {
    shape: image
    icon: https://example.com/jerry.jpg
    width: 200
    height: 200
}

big jerry: "" {
    shape: image
    icon: https://example.com/jerry.jpg
    width: 500
    height: 400
}

big jerry -> small jerry
```

### sql_tableの幅制御

```d2
users: {
    shape: sql_table
    width: 300

    id: int {constraint: primary_key}
    name: varchar(255)
}
```

レイアウトエンジンとの相互作用
-------------------------

### ELK

コンテナの`width`/`height`をサポート(制限付き)。

### TALA

コンテナの`width`/`height`は未対応(将来対応予定)。

### dagre

コンテナの`width`/`height`は非対応。

グリッド図との併用
-------------------------

グリッド図内の要素に`width`/`height`を指定すると、配置の制御が可能です。

```d2
grid-columns: 2

pod1: {
    width: 200
    height: 100
}

pod2: {
    width: 200
    height: 100
}
```

詳細は[grid-diagrams.md](grid-diagrams.md)を参照してください。

ベストプラクティス
-------------------------

- 画像サイズは明示的に指定して統一感を出す
- sql_tableやclassの幅は内容に応じて調整
- グリッド図内では`width`で要素を揃える
- コンテナには指定しない(子要素の調整で対応)
- 基本シェイプのサイズは必要な場合のみ指定
