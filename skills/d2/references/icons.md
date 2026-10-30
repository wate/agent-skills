アイコンと画像
=========================

基本的な使用方法
-------------------------

### オブジェクトへのアイコン追加

```d2
deploy: {
    icon: https://icons.terrastruct.com/aws%2FDeveloper%20Tools%2FAWS-CodeDeploy.svg
}

backup: {
    icon: https://icons.terrastruct.com/aws%2FStorage%2FAWS-Backup.svg
}

deploy -> backup: {
    icon: https://icons.terrastruct.com/infra%2F002-backup.svg
}
```

### ローカル画像の使用

D2 CLIローカル実行時はローカルパスを指定可能です。

```d2
my_logo: {
    icon: ./images/my_cat.png
}
```

スタンドアロンのアイコンシェイプ
-------------------------

アイコンのみを表示したい場合は`shape: image`を指定します。

```d2
server: {
    shape: image
    icon: https://icons.terrastruct.com/tech/022-server.svg
}

github: {
    shape: image
    icon: https://icons.terrastruct.com/dev/github.svg
}

server -> github
```

アイコンの配置
-------------------------

### 自動配置

レイアウトエンジンが自動的に配置を決定します。

- コンテナ: 左上に配置
- 非コンテナ: 中央に配置

### アイコンの位置指定

`near`を使用してアイコン位置を明示的に指定できます。

```d2
x: worker {
    label.near: top-center
    icon: https://icons.terrastruct.com/essentials%2F005-programmer.svg
    icon.near: outside-top-right
}
```

詳細は[positions.md](positions.md)を参照してください。

無料アイコンコレクション
-------------------------

Terrastructが提供する無料アイコン集:

[https://icons.terrastruct.com](https://icons.terrastruct.com/)

ソフトウェアアーキテクチャ図でよく使われるアイコンが揃っています。

コンテナ内での使用例
-------------------------

```d2
vpc: VPC {
    icon: https://icons.terrastruct.com/aws%2F_Group%20Icons%2FVirtual-private-cloud-VPC_light-bg.svg
    style: {
        stroke: green
        font-color: green
        fill: white
    }
    
    az: Availability Zone {
        style: {
            stroke: blue
            font-color: blue
            fill: white
        }
        
        ec2: EC2 Instance {
            icon: https://icons.terrastruct.com/aws%2FCompute%2F_Instance%2FAmazon-EC2_C5_Instance_light-bg.svg
        }
    }
}
```

ベストプラクティス
-------------------------

- ソフトウェアアーキテクチャ図にはアイコンを積極的に活用
- icons.terrastruct.comの無料コレクションを活用
- ローカルアイコンのパスは相対パスを使用
- スタンドアロン表示には`shape: image`を明示
- 位置調整が必要な場合は`near`で微調整
- コンテナへのアイコンは自動的に左上に配置される
