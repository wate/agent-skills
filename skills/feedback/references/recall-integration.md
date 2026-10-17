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

- `assets/vscode-copilot/hooks/feedback.json`をひな形とし、コマンドのパスをスキルの実際の配置から生成して`.github/hooks/feedback.json`へ書き出します
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
注入されない場合は、`.github/hooks/feedback.json`のコマンドが指すファイルが実在するかを確認します。

### 手動で登録する場合

スクリプトを使えない場合は、`assets/vscode-copilot/hooks/feedback.json`を`.github/hooks/`へコピーします。
ひな形のコマンドは`.github/skills/feedback/`への配置を前提としています。
ほかの場所へ配置した場合は、`command`のパスを実際の配置に合わせて書き換えます。

opencode
-------------------------

opencodeには、ファイルの内容をコンテキストへ自動注入する2つの機構があります。
優先して使うのは方式1の`instructions`設定です。

### 方式1: instructions設定(安定機構・推奨)

`opencode.jsonc`または`opencode.json`の`instructions`は、ファイルまたはglobの配列を指定する安定した設定です。
`experimental`配下には属さず、`experimental.policies`や`experimental.session.compacting`等の実験的機能と同等に扱われていません。
指定されたファイルの内容は、`AGENTS.md`の読み込みと同様にモデルへ読み込みます。

- 公式スキーマ`opencode.ai/config.json`の`Config`定義で、`instructions`はトップレベルの配列プロパティとして確認済みです。
- 公式ドキュメント[rules](https://opencode.ai/docs/rules/)に、次の記載があります。
  > All instruction files are combined with your `AGENTS.md` files
- 記述例

```jsonc
{
  "instructions": [".github/feedback/index.md"]
}
```

この方式はAGENTS.md方式(AGENTS.mdの文中で「index.mdを確認せよ」と指し送りする方式)と区別されます。
AGENTS.md方式は指し送り先自体がコンテキストへ入らないため、AIが自発的に読まない限り注入されません。
`instructions`設定はファイル内容そのものを毎ターン読み込ませるため、注入の自動化としては確実です。

#### 登録手順

セットアップスクリプト`scripts/opencode/setup-instructions.mjs`で、設定ファイルへの登録を自動化できます。
プロジェクトルートで、スキルの配置先に合わせたパスを指定して実行します。
次の例は、スキルを`.agents/skills/feedback/`に置いた場合です。

```sh
node .agents/skills/feedback/scripts/opencode/setup-instructions.mjs
```

- 設定ファイルが存在しない場合は、`opencode.jsonc`を新規作成します
- `opencode.jsonc`が存在する場合は、そのファイルの`instructions`配列へ`.github/feedback/index.md`を追記します(登録済みなら変更なし)
- `opencode.jsonc`がなく`opencode.json`のみ存在する場合は、`opencode.json`を更新します
- 既存ファイルへ追記する際は、コメントを保持したまま挿入します
- `--root <ディレクトリ>`で対象プロジェクトを指定できます。省略した場合はカレントディレクトリを対象にします

opencodeはプロジェクト設定として`opencode.jsonc`を`opencode.json`より優先します。
同一ディレクトリに両方がある場合はどちらも読み込まれ、競合するキーは`opencode.jsonc`が優先されます。

登録後は、opencodeを再起動して設定を読み込ませます。

#### 備考

`instructions`の内容は`AGENTS.md`と併合されます、優先順位による上書きは発生しません。
`opencode.jsonc`または`opencode.json`がグローバルとプロジェクトの両方にある場合も、
`instructions`は上書きではなく重複を除いた和集合でマージされます。
実装では、`AGENTS.md`系ファイルと`instructions`の解決結果が1つの配列にまとめられます。
該当箇所は[packages/opencode/src/session/instruction.ts](https://github.com/anomalyco/opencode/blob/main/packages/opencode/src/session/instruction.ts)の`system`関数です。

指定したファイルが存在しない場合、そのエントリはエラーを出さずにスキップされます。
読み込みに失敗した結果は空として扱われ、注入対象から除外されるためです。
パスの誤りも無言で見逃されるため、導入時は注入が効いているかの確認を推奨します。

### 方式2: experimentalフック(補足)

[プラグイン機構](https://opencode.ai/docs/plugins/)(`.opencode/plugins/`配下にJS/TSモジュールを配置)で、より動的な制御が可能です。

汎用`event`フック(`session.created`など)は通知専用で、出力パラメータを持たずコンテキストへは注入できません。
[packages/plugin/src/index.ts](https://github.com/anomalyco/opencode/blob/main/packages/plugin/src/index.ts)の`event`フックの型は
`(input: { event: Event }) => Promise<void>`です。

コンテキスト注入に対応するのは`experimental.chat.system.transform`フックです。

- 型定義は`packages/plugin/src/index.ts`にあります。

```typescript
"experimental.chat.system.transform"?: (
  input: { sessionID?: string; model: Model },
  output: { system: string[] }
) => Promise<void>
```

- 呼び出し箇所: [packages/opencode/src/session/llm/request.ts](https://github.com/anomalyco/opencode/blob/main/packages/opencode/src/session/llm/request.ts)の`prepare`関数内
    - `output.system`配列へpushした文字列が、そのままLLMへ送るシステムプロンプトに追加される
- 発火タイミング: セッション開始時1回ではなく、LLMへのリクエストのたび(毎ターン)に呼ばれる

`experimental.`が付くため仕様の不安定性があります。
静的なファイル注入で足りる場合は方式1に留めます。
動的な注入条件(エントリ単位でフィルタする等)が必要な場合のみ方式2を使います。

### メモリ注入への適用

方式1・方式2のどちらでも、対象ファイルを直接指すとその全内容が毎ターンコンテキストへ加わります。
エントリが増えるほどトークン消費が大きくなります。
このため、注入対象は索引(要約)とし、全文はAIが必要時に読み込む2段引きを維持します。

- 注入対象: `.github/feedback/index.md`などの要約
- 読み込み対象: 各エントリの本体(必要時のみ)

その他のツール
-------------------------

現時点でフック機構による強制注入の対応は未検証です。
AGENTS.md方式のみに依存します。
