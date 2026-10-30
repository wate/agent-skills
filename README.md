agent-skills
=========================

概要
-------------------------

AIエージェント向けのスキルを公開するリポジトリです。  
自作スキルのうち汎用的に利用できるものを、順次公開しています。

スキルは`SKILL.md`と付属ファイルで構成される再利用可能な指示セットです。  
エージェントはタスクの内容に応じて、必要なスキルだけを読み込みます。  
形式はオープン標準の[Agent Skills](https://agentskills.io/)に準拠しているため、  
GitHub Copilot、Claude Code、Codex、Cursorなどの複数のエージェントで利用できます。

収録スキル
-------------------------

### agent-guide

プロジェクトの構成・ツールキット・ドキュメントの実在を確かめ、  
AIエージェントが最初に読むオンボーディング文書`AGENTS.md`を生成します。  
全体像と進め方の導線だけを書き、詳細なルールは専門ドキュメントへ委ねます。

読み込みのトリガーは次のとおりです。

- `AGENTS.mdを作って`と依頼したとき
- `AGENTS.mdを更新して`と依頼したとき
- `AGENTS.md`がないプロジェクトで作業するとき

プロジェクト種別をシステム開発系と非開発系(業務改善等)に判定し、種別ごとの出力例へ当てはめて生成します。  
参照先は生成前に実在を確認し、存在しないファイルやディレクトリはリンクしません。

スキルの仕様は[`skills/agent-guide/SKILL.md`](skills/agent-guide/SKILL.md)に記載しています。

### handoff

進行中の作業の進捗・未決事項・課題をMarkdown形式で構造化し、  
次のセッションで即座に再開できる引き継ぎ資料を生成します。

読み込みのトリガーは次のとおりです。

- `引き継ぎ資料を作って`と依頼したとき
- `handoff`と指定したとき
- 作業の中断やセッション切り替えのとき
- 会話が長期化し、以前の文脈を参照しにくくなったとき(セッション切り替えと引き継ぎを提案)

スキルの仕様は[`skills/handoff/SKILL.md`](skills/handoff/SKILL.md)に記載しています。

### workplan

あらゆる作業の実施内容を洗い出し、情報密度判定とWBS分解に基づく作業プランを生成します。

読み込みのトリガーは次のとおりです。

- `作業プランを作って`と依頼したとき
- `workplan`と指定したとき
- `実施計画を整理したい`や`進め方を整理したい`と依頼したとき
- `タスクを分解したい`や`WBSで整理したい`と依頼したとき

スキルの仕様は[`skills/workplan/SKILL.md`](skills/workplan/SKILL.md)に記載しています。

チケット駆動の開発と相性がよく、[MD-Ticket](https://github.com/wate/MD-Ticket)を使えば簡単に始められます。  
チケットがテキストファイルなので、MCPの設定なしでAIがそのまま読み込めます。

MCPなどを利用すればBacklogやRedmineなどのプロジェクト管理ツールでも同じように進められます。

### refine

ドキュメントや指示の記述を7つの検証観点で点検し、詰めの甘さを検出して、  
意味が一意に伝わる記述へ書き直します。  
検証できない完了条件、曖昧な動詞、複合操作、暗黙の前提などを検出します。

読み込みのトリガーは次のとおりです。

- `リファインして`や`記述を詰めて`と依頼したとき
- `曖昧な指示を具体化して`や`完了条件を具体化して`と依頼したとき

読み取り専用の点検や評価だけを依頼した場合は読み込みません。  
対象ファイルを書き換えますが、確認なしで反映するのは機械的に改善できる箇所だけです。  
判断が必要な箇所は、1つずつ質問してから反映します。

スキルの仕様は[`skills/refine/SKILL.md`](skills/refine/SKILL.md)に記載しています。

### annotate-code

ソースコードのクラス・関数・メソッド・プロパティに、言語の標準形式のドキュメントコメントを追加・改善します。  
コードの動作は変えず、静的解析の前後比較と差分の確認で検証します。  
PHP、JavaScript・TypeScript、Python、Ruby、Goの書式に対応しています。

読み込みのトリガーは次のとおりです。

- `アノテーションを付けて`と依頼したとき
- `Docコメントを書いて`と依頼したとき
- `PHPDocを整えて`や`JSDocを追加して`と依頼したとき

説明文は、規約が別の言語を指定していない限り日本語で書きます。  
プロジェクトの規約と既存コードの書き方を優先し、どちらからも決まらない点だけをスキルの規則で補います。

スキルの仕様は[`skills/annotate-code/SKILL.md`](skills/annotate-code/SKILL.md)に、  
言語別の書式は[`skills/annotate-code/references/`](skills/annotate-code/references/)に記載しています。

### d2

D2言語形式の図表ファイル(`.d2`)の作成・読み取り・編集を行います。  
ノード・エッジ・コンテナの構文、レイアウトエンジン(dagre・ELK・TALA)の選択基準、  
スタイル設定を規則化し、図種別ごとのテンプレートと生成手順を提供します。

読み込みのトリガーは次のとおりです。

- `D2で図を作って`と依頼したとき
- `.d2`ファイルの作成・編集・読み取りを依頼したとき
- `テキストベースの図表`や`画面遷移図`、`シーケンス図`、`フローチャート`、`アクティビティ図`、`ER図`に言及したとき

フローチャート、シーケンス図、画面遷移図、アクティビティ図、ER図、UMLクラス図、ユースケース図のテンプレートを同梱しています。  
図はテンプレートを読み込んでから書き、出力後は`d2 validate`で構文を検証します。  
サイズや位置はレイアウトエンジンに任せ、`width`・`height`・`near`の使用を作図の目的に限定しています。

スキルの仕様は[`skills/d2/SKILL.md`](skills/d2/SKILL.md)に、  
テンプレートは[`skills/d2/assets/`](skills/d2/assets/)、機能別のリファレンスは[`skills/d2/references/`](skills/d2/references/)に記載しています。

### feedback

AIへの是正指摘、決定事項、外部の参照先などを4カテゴリーに分類して記録し、  
セッションをまたいで想起させます。  
記録は`.github/feedback/`へ1件1ファイルで保存し、索引`index.md`から必要なものだけを読み込みます。

読み込みのトリガーは次のとおりです。

- 指摘や訂正をしたとき
- 決定事項や制約が判明したとき
- 参照先のURLやチケットを渡したとき
- `これを記憶しておいて`と依頼したとき
- 記録の精査や集計を依頼したとき

記録を次のセッションで想起させるには、索引をセッションへ読み込ませる設定が必要です。

- VS Code Copilot Chat: 記録を保存するときに、スキルがSessionStartフックの登録状態を確認します
    - 未登録なら、登録してよいかを1回だけ確認し、承認されると`.github/hooks/feedback.json`を作成します
    - VS Codeを再起動するか、フック設定を再読み込みすると有効になります
- opencode: `instructions`設定へ索引を登録するスクリプトを同梱しています
- そのほかのエージェント: `AGENTS.md`へ、セッション開始時に索引を確認する指示を追記します

スクリプトは、プロジェクトのルートで実行します。  
次の例は`.agents/skills/`へインストールした場合です。インストール先に合わせてパスを読み替えます。

```bash
# VS Code Copilot Chat: SessionStartフックを登録する
node .agents/skills/feedback/scripts/vscode-copilot/setup-hook.mjs

# opencode: instructions設定へ索引を登録する
node .agents/skills/feedback/scripts/opencode/setup-instructions.mjs
```

フックの登録は、スキルをプロジェクトへインストールした場合だけ対応しています。  
`--global`でインストールした場合は登録しません。  
`.github/hooks/`はリポジトリで共有する設定のため、個人環境のパスを書き込まないためです。

`.github/feedback/`の記録がたまると(目安20件)、保存時に精査を提案します。  
承認すると、原本へ反映済みの記録を洗い出す集計レポートを生成します。  
集計手順は[`skills/feedback/references/report.md`](skills/feedback/references/report.md)に記載しています。

スキルの仕様は[`skills/feedback/SKILL.md`](skills/feedback/SKILL.md)に、  
エージェントごとの設定手順は[`skills/feedback/references/recall-integration.md`](skills/feedback/references/recall-integration.md)に記載しています。

インストール
-------------------------

`npx`の実行にはNode.jsが必要です。
CLIがエージェントを自動検出し、配置先を対話形式で選択できます。

```bash
# 収録スキルの一覧を確認する
npx skills add wate/agent-skills --list

# すべてのスキルをインストールする
npx skills add wate/agent-skills

# スキルを指定してインストールする
npx skills add wate/agent-skills --skill handoff --skill workplan

# 全プロジェクトで使えるようにインストールする
npx skills add wate/agent-skills --global

# 対象エージェントを指定してインストールする
npx skills add wate/agent-skills --agent claude-code
```

対話形式では、配置先(プロジェクトまたは個人)と方式(シンボリックリンクまたはコピー)を選択します。  
確認を省略する場合は`-y`を付けます。

スキルのディレクトリをエージェントの配置先へ直接コピーする方法もあります。  
配置先はエージェントごとに異なります。

| エージェント      | プロジェクト      | 個人                 |
| ----------------- | ----------------- | -------------------- |
| GitHub Copilot    | `.github/skills/` | `~/.copilot/skills/` |
| Claude Code       | `.claude/skills/` | `~/.claude/skills/`  |
| Codex・Cursorほか | `.agents/skills/` | `~/.agents/skills/`  |

対応エージェントの一覧は[skills CLI](https://github.com/vercel-labs/skills)を参照してください。

使い方
-------------------------

依頼内容が`description`の条件に一致すると、エージェントがスキルを自動で読み込みます。

- `AGENTS.mdを作って`
- `引き継ぎ資料を作って`
- `作業プランを作って`
- `この作業プランをリファインして`
- `関数にアノテーションを付けて`
- `D2で画面遷移図を作って`
- `これを記憶しておいて`

チャット入力欄でスラッシュコマンドを入力すると、明示的に呼び出せます。

- `/agent-guide`
- `/handoff`
- `/workplan`
- `/refine`
- `/annotate-code`
- `/d2`
- `/feedback`

ライセンス
-------------------------

[Apache License 2.0](LICENSE)の下で公開しています。

参考リンク
-------------------------

- [Agent Skills](https://agentskills.io/): スキル形式のオープン標準
- [skills CLI](https://github.com/vercel-labs/skills): スキルのインストールと管理を行うCLI
- [skills.sh](https://skills.sh/): 公開スキルの検索サイト
- [VS CodeでのAgent Skillsの利用方法](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
