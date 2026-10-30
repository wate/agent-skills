シーケンス図
=========================

基本構文
-------------------------

```d2
shape: sequence_diagram

alice -> bob: メッセージ
bob -> alice: 返信
```

重要なルール
-------------------------

### スコープルール

シーケンス図内では、子要素が同じスコープを共有します。

```d2
office: {
    shape: sequence_diagram
    alice: Alice
    bob: Bobby

    talk1: {
        alice -> bob: hi
        bob -> alice: hello
    }

    talk2: {
        # 同じaliceとbobを参照
        alice -> bob: bye
    }
}
```

### 順序ルール

定義順序が表示順序になります。

- アクター(参加者)の定義順序 -> 左から右への配置順序
- メッセージの定義順序 -> 上から下への表示順序

```d2
shape: sequence_diagram

# アクター順序を明示的に定義
a; b; c; d

# メッセージは定義順に表示
c -> d
d -> a
b -> d
```

主要機能
-------------------------

### スパン(Activation Box)

ネストしたオブジェクトで開始と終了を表現します。

```d2
shape: sequence_diagram

alice.t1 -> bob
alice.t2 -> bob.a
alice.t2.a -> bob.a
alice.t2.a <- bob.a
alice.t2 <- bob.a
```

### グループ(Fragment)

メッセージのサブセットをラベル付けします。

```d2
shape: sequence_diagram

# アクターを事前定義(グループ使用時は必須)
alice
bob

shower thoughts: {
    alice -> bob: メッセージ1
    alice -> bob: メッセージ2
}

life advice: {
    bob -> alice: メッセージ3
}
```

**注意**: グループ内で参照するアクターは、トップレベルで事前に定義する必要があります。

### ノート

アクターにネストした接続なしのオブジェクトとして表現します。

```d2
shape: sequence_diagram

alice -> bob

bob."ノートの内容"

important: {
    bob."別のノート"
}
```

### セルフメッセージ

```d2
shape: sequence_diagram

father -> father: 内的葛藤
```

カスタマイズ
-------------------------

### メッセージのスタイル

```d2
shape: sequence_diagram

scorer.t -> itemResponse.t: getItem()
scorer.t <- itemResponse.t: item {
    style.stroke-dash: 5
}
```

### ライフラインのスタイル

アクターの`stroke`と`stroke-dash`がライフライン(縦線)に継承されます。

```d2
shape: sequence_diagram

alice -> bob: メッセージ

alice.style: {
    stroke: red
    stroke-dash: 0
}
```

### アクターのシェイプ

```d2
shape: sequence_diagram

scorer: {
    shape: person
}
```

用語対応
-------------------------

| D2での呼称 | 他ツールでの呼称                         |
| ---------- | ---------------------------------------- |
| Actor      | Participant                              |
| Span       | Activation Box, Lifespan, Activation Bar |
| Group      | Fragment, Edge Group, Frame              |

ベストプラクティス
-------------------------

- グループを使用する場合は、アクターを明示的に事前定義
- 順序制御が必要な場合は、アクター定義を先頭に記述
- スパンを使ってメッセージ処理の期間を視覚化
- ノートで補足説明を追加
- セルフメッセージで内部処理を表現

生成手順
-------------------------

システム向け(API連携・サービス間)と業務向け(業務プロセス)の2つの用途を扱います。

### 1. 入力の分析

入力から参加者とやり取りを抽出します。

- システム向け: システムアーキテクチャ、API仕様からコンポーネントとメッセージを抽出します
- 業務向け: 業務プロセス、アクター、操作順序から担当者とやり取りを抽出します

### 2. アクターの判定

- アクターは`shape: person`などで種別を区別します
- グループを使用する場合は、アクターをトップレベルで事前定義します

### 3. メッセージの並べ方

- アクターの定義順を左から右への配置順とします
- メッセージの定義順を上から下への表示順とします
- 処理期間はスパンで表現します
- 補足はノートで追加します

### 4. 出力

- システム向けの出力先は`docs/system/{機能}_sequence.d2`を既定値とします
- 業務向けの出力先は`docs/workflow/{業務プロセス}_sequence.d2`を既定値とします
- 呼び出し元の指示がある場合は、その出力先を優先します

出力サンプル
-------------------------

- [システムシーケンス図のサンプル](../assets/system_sequence_example.d2)
- [業務プロセスシーケンス図のサンプル](../assets/workflow_sequence_example.d2)

出力前に必ずサンプルを参照し、書式を一致させてください。
