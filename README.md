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

### handoff

進行中の作業の進捗・未決事項・課題をMarkdown形式で構造化し、  
次のセッションで即座に再開できる引き継ぎ資料を生成します。

読み込みのトリガーは次のとおりです。

- `引き継ぎ資料を作って`と依頼したとき
- `handoff`と指定したとき
- 作業の中断やセッション切り替えのとき

スキルの仕様は[`skills/handoff/SKILL.md`](skills/handoff/SKILL.md)に記載しています。

### workplan

あらゆる作業の実施内容を洗い出し、情報密度判定とWBS分解に基づく作業プランを生成します。

読み込みのトリガーは次のとおりです。

- `作業プランを作って`と依頼したとき
- `workplan`と指定したとき
- `タスクを分解したい`や`WBSで整理したい`と依頼したとき

スキルの仕様は[`skills/workplan/SKILL.md`](skills/workplan/SKILL.md)に記載しています。

チケット駆動の開発と相性がよく、[MD-Ticket](https://github.com/wate/MD-Ticket)を使えば簡単に始められます。  
チケットがテキストファイルなので、MCPの設定なしでAIがそのまま読み込めます。

MCPなどを利用すればBacklogやRedmineなどのプロジェクト管理ツールでも同じように進められます。

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

- `引き継ぎ資料を作って`
- `作業プランを作って`

チャット入力欄でスラッシュコマンドを入力すると、明示的に呼び出せます。

- `/handoff`
- `/workplan`

ライセンス
-------------------------

[Apache License 2.0](LICENSE)の下で公開しています。

参考リンク
-------------------------

- [Agent Skills](https://agentskills.io/): スキル形式のオープン標準
- [skills CLI](https://github.com/vercel-labs/skills): スキルのインストールと管理を行うCLI
- [skills.sh](https://skills.sh/): 公開スキルの検索サイト
- [VS CodeでのAgent Skillsの利用方法](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
