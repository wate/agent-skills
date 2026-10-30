位置設定
=========================

near(定位置配置)
-------------------------

本スキルでは、`near`を図のタイトルや凡例の配置に限って使い、フローを構成するノードには使いません。

### 基本的な値

```
top-left      top-center      top-right
center-left                   center-right
bottom-left   bottom-center   bottom-right
```

### タイトル配置

```d2
title: |md
    # A winning strategy
| {near: top-center}

poll the people -> results
results -> unfavorable -> poll the people
results -> favorable -> will of the people
```

### 凡例配置

```d2
direction: right

x -> y: {style.stroke: green}
y -> z: {style.stroke: red}

legend: {
    near: bottom-center
    color1: foo {
        shape: text
        style.font-color: green
    }
    color2: bar {
        shape: text
        style.font-color: red
    }
}
```

### 長文説明の配置

```d2
explanation: |md
    # LLMs
    大規模言語モデルの説明...
| {
    near: center-left
}

ML Platform -> Pre-trained models
ML Platform -> Model registry
```

ラベルとアイコンの位置
-------------------------

### 内側配置

`near`を`label`または`icon`にネストして指定します。

```d2
x: worker {
    label.near: top-center
    icon: https://icons.terrastruct.com/essentials%2F005-programmer.svg
    icon.near: outside-top-right
}

y: profits {
    label.near: bottom-right
    icon: https://icons.terrastruct.com/essentials%2Fprofits.svg
    icon.near: outside-top-left
}

x -> y
```

### 外側配置

`outside-`プレフィックスで境界の外側に配置できます。

```
outside-top-left      outside-top-center      outside-top-right
outside-left-center                           outside-right-center
outside-bottom-left   outside-bottom-center   outside-bottom-right
```

### 境界配置

`border-`プレフィックスで境界線上に配置できます。

```d2
app: Your application {
    label.near: border-top-center
}
```

ツールチップの位置
-------------------------

`tooltip`に`near`を指定すると、ホバーではなく常時表示になります。

```d2
codedeploy: {
    tooltip: |md
        God has abandoned this pipeline
    |
    tooltip.near: center-left
}
```

near(オブジェクト指定) - TALA専用
-------------------------

**注記**: この機能はTALAレイアウトエンジンでのみサポートされています。
dagre/ELKではオブジェクトを指定できないため、定数の`near`(top-left等)を使用します。

オブジェクトのIDを指定して近接配置できます。

```d2
vars: {
    d2-config: {
        layout-engine: tala
    }
}

aws: {
    load_balancer -> api
    api -> db
}

gcloud: {
    auth -> db
}

gcloud -> aws

explanation: |md
    # Why do we use AWS?
    - It has more uptime than GCloud
    - We have free credits
| {
    near: aws
}
```

top/left(絶対位置) - TALA専用
-------------------------

**注記**: この機能はTALAレイアウトエンジンでのみサポートされています。
dagre/ELKでは使用できません。

TALAエンジンでは`top`と`left`で絶対位置を指定できます。

```d2
vars: {
    d2-config: {
        layout-engine: tala
    }
}

x: {
    top: 100
    left: 200
}
```

詳細は[公式ドキュメントの「Top and left」](https://d2lang.com/tour/positions/)を参照してください。

ベストプラクティス
-------------------------

- タイトルは`top-center`、凡例は`bottom-center`が一般的
- 長文説明は`center-left`または`center-right`で配置
- アイコンは`outside-*`で境界外に配置すると見やすい
- ツールチップの常時表示は補足情報に最適
- オブジェクト指定の`near`はTALA専用
- 絶対位置指定はTALA専用
