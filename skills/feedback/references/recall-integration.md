想起導線の組み込み手順
=========================

feedbackスキルが記録した内容を、各コーディングエージェントのセッションへ実際に組み込むための手順です。

索引ファイルの初期化
-------------------------

`.github/feedback/index.md`はAGENTS.md方式・VS Codeフック・opencodeの全経路が共通で参照するため、導入時に必ず1つ用意します。

存在しない場合は、スキル同梱のひな形`assets/index.md`を`.github/feedback/index.md`へ複製して初期化します。
複製するのはひな形のみで、以降は記憶の保存に合わせて索引へ1行ずつ追記します。
初期化はフックの動作ではなくセットアップ時の作業であり、フックは索引が無い場合に何も行いません。

全ツール共通(AGENTS.md方式)
---------------------------

AGENTS.mdへ、セッション開始時に`.github/feedback/index.md`を確認する旨の指示文を追加します。
フック機構を持たないツールは、この方式のみに依存します。

記載例は次のとおりです。

```markdown
- セッション開始時に[メモリ索引](.github/feedback/index.md)を確認し、蓄積された情報を内在化する
```

VS Code Copilot Chat
-------------------------

SessionStartフックによる強制注入に対応しています。

新規Copilot Chatセッション開始時に、`.github/feedback/index.md`が存在すればその内容をコンテキストへ強制注入します。存在しない場合は何もしません。

### 登録手順

セットアップスクリプト`scripts/vscode-copilot/setup-hook.mjs`で、フック定義の登録を自動化できます。
プロジェクトルートで、スキルの配置先に合わせたパスを指定して実行します。
次の例は、スキルを`.agents/skills/feedback/`に置いた場合です。

```sh
node .agents/skills/feedback/scripts/vscode-copilot/setup-hook.mjs
```

- `assets/vscode-copilot/hooks/feedback.json`をひな形とし、`.github/hooks/feedback.json`へ書き出します
    - コマンドのパスは、スキルの実際の配置から生成します
    - `.agents/skills/`や`.claude/skills/`へ配置した場合も、実在するパスを指すフック定義になります
- 同じ内容が登録済みの場合は、変更しません
- 内容の異なる`.github/hooks/feedback.json`が存在する場合は、差分を表示して中止します(上書きしません)
- スキルがプロジェクト外(ホームディレクトリ配下へのグローバル導入など)にある場合は、登録せずに中止します
    - `.github/hooks/`はリポジトリで共有するため、個人環境のパスを書き込まないためです
- `--root <ディレクトリ>`で対象プロジェクトを指定できます。省略した場合はカレントディレクトリを対象にします
- スクリプト本体(`scripts/vscode-copilot/session-start.mjs`)の追加コピーは不要です

登録後は、VS Codeを再起動するか、フック設定を再読み込みします。

VS Code Copilot Chatで`feedback`スキルがメモリを保存すると、スキルが登録状態を確認します。
未登録の場合は、利用者の承認を得てからこのスクリプトで登録します。
そのため、導入時に上記のコマンドを実行していなくても、最初の保存時に登録できます。

確認には`--check`を使います。書き込まずに登録状態だけを調べ、終了コードで返します。

- 0: 登録済み
- 2: 未登録
- 3: 内容の異なる`.github/hooks/feedback.json`が存在する(差分を表示)
- 1: エラー

### 登録の確認

`.github/feedback/index.md`がある状態で、Copilot Chatの新しいセッションを開始します。
「セッション開始時に受け取った記憶索引の項目名を挙げてください」と尋ね、`index.md`の項目が挙がるかを確認します。
注入されない場合は、`.github/hooks/feedback.json`のコマンドの指すファイルが実在するかを確認します。

### 手動で登録する場合

スクリプトを使えない場合は、`assets/vscode-copilot/hooks/feedback.json`を`.github/hooks/`へコピーします。
ひな形のコマンドは`.github/skills/feedback/`への配置を前提としています。
ほかの場所へ配置した場合は、`command`のパスを実際の配置に合わせて書き換えます。

opencode
-------------------------

opencodeには、ファイルの内容をコンテキストへ自動注入する2つの機構があります。
v2のドキュメントは`opencode.ai/v2/docs/`にあります。

### 方式1: instructions設定

`opencode.jsonc`または`opencode.json`の`instructions`は、注入するファイルを配列で指定する設定です。
指定したファイルの内容は、`AGENTS.md`の後に、書いた順で読み込まれます。

- 出典: [v2のInstructions](https://opencode.ai/v2/docs/instructions/)の「Configuration」
- 指定できる形式は、相対パス・glob・`~/`始まりのパス・絶対パス・HTTP(S)のURLです
- 相対パスは、ワークスペースからプロジェクトルートまでの各ディレクトリで探します
- 記述例

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": [".github/feedback/index.md"]
}
```

この方式はAGENTS.md方式(AGENTS.mdの文中で`index.md`の確認を指示する方式)と区別されます。
AGENTS.md方式は指し送り先自体がコンテキストへ入らないため、AIが自発的に読まない限り注入されません。
`instructions`設定はファイル内容そのものを読み込ませるため、注入の自動化としては確実です。
v2では、ファイルを変更すると、次のモデルへのリクエストの前に変更が反映されます。

#### 登録手順

セットアップスクリプト`scripts/opencode/setup-instructions.mjs`で、設定ファイルへの登録を自動化できます。
プロジェクトルートで、スキルの配置先に合わせたパスを指定して実行します。
次の例は、スキルを`.agents/skills/feedback/`に置いた場合です。

```sh
node .agents/skills/feedback/scripts/opencode/setup-instructions.mjs
```

- 設定ファイルを、ルート直下の`opencode.jsonc`・`opencode.json`、`.opencode/`配下の`opencode.jsonc`・`opencode.json`の順で探します
    - 最初に見つかったファイルの`instructions`配列へ、`.github/feedback/index.md`を追記します(登録済みなら変更なし)
- 設定ファイルがどこにもない場合は、ルート直下に`$schema`付きの`opencode.jsonc`を新規作成します
- 既存ファイルへ追記する際は、コメントを保持したまま挿入します
- `--root <ディレクトリ>`で対象プロジェクトを指定できます。省略した場合はカレントディレクトリを対象にします

v2のプロジェクト設定は、ルート直下と`.opencode/`配下の2か所に置けます。
両方ある場合は、ルート直下の設定の後に`.opencode/`配下の設定をマージするため、`.opencode/`側が優先されます。
出典は[v2のConfig](https://opencode.ai/v2/docs/config/)の「Locations」です。

登録後は、opencodeを再起動して設定を読み込ませます。

#### 備考

`instructions`の内容は`AGENTS.md`と結合されます。優先順位による上書きは発生しません。
グローバルとプロジェクトの両方に設定がある場合も、各設定の`instructions`は結合されます。
実装は[packages/core/src/config/plugin/instruction.ts](https://github.com/anomalyco/opencode/blob/dev/packages/core/src/config/plugin/instruction.ts)にあります。

v2が認識する指示ファイルは`AGENTS.md`だけです。`CLAUDE.md`へのフォールバックはありません。

指定したファイルが存在しない場合、そのエントリはエラーを出さずにスキップされます。
パスの誤りも無言で見逃されるため、導入時は注入が効いているかを確認します。
確認には、1回だけ質問して終了する`opencode run`を使えます。

```sh
opencode run "セッション開始時に受け取った記憶索引の項目名を挙げてください"
```

### 方式2: プラグインのcontextフック

[プラグイン機構](https://opencode.ai/v2/docs/build/plugins/)で、より動的な制御が可能です。
v2のプラグインは、`Plugin.define({ id, setup })`をdefault exportするモジュールです。
ローカルのプラグインは`.opencode/plugins/`配下に置きます。
v1のプラグインはv2で動きません。

コンテキスト注入に対応するのは、`ctx.session.hook("context")`です。
v1の`experimental.chat.system.transform`の移行先に当たります。

```typescript
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "example.context",
  async setup(ctx) {
    await ctx.session.hook("context", (event) => {
      event.system.push({ type: "text", text: "..." })
    })
  },
})
```

- 「Migrate request hooks」の出典: [v2のMigrate plugins from V1](https://opencode.ai/v2/docs/build/plugins/migrate-v1)
- 発火タイミング: プロバイダーへ送る直前に呼ばれます
    - 「Runtime Hooks」の出典: [packages/plugin/src/README.md](https://github.com/anomalyco/opencode/blob/dev/packages/plugin/src/README.md)
- `context`には`experimental.`の接頭辞がありません。v1の`experimental.chat.system.transform`とは扱いが異なります
- プラグインは、opencodeのリリースに合う`@opencode/plugin`の版に依存させます

静的なファイル注入だけなら方式1で足ります。
方式2は、項目単位で絞るなどの動的な注入条件を扱えます。
方式1と方式2の両方で同じ索引を登録すると、索引が2回注入されます。

### メモリ注入への適用

方式1・方式2のどちらでも、対象ファイルを直接指すとその全内容がコンテキストへ加わります。
エントリが増えるほどトークン消費が大きくなります。
このため、注入対象は索引(要約)とし、全文はAIが必要時に読み込む2段引きを維持します。

- 注入対象: `.github/feedback/index.md`などの要約
- 読み込み対象: 各エントリの本体(必要時のみ)

その他のツール
-------------------------

現時点でフック機構による強制注入の対応は未検証です。
AGENTS.md方式のみに依存します。
