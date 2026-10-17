VS Code Copilot Chat Agent Hooksリファレンス
============================================

このドキュメントは、VS Code上のCopilot Chatが持つAgent hooks機能の仕様を、公式ドキュメントを調査した結果としてまとめたものです。
feedbackスキルの想起導線(SessionStartフックによる強制コンテキスト注入)を設計する際の根拠資料として使用します。
調査日は2026年7月12日です。VS Code側の表記は英語のため、本ドキュメントでは日本語へ要約しています。

出典
-------------------------

- [Agent hooks in Visual Studio Code (Preview)](https://code.visualstudio.com/docs/agent-customization/hooks)
- [Hooks reference](https://code.visualstudio.com/docs/agents/reference/hooks-reference)

機能ステータス
-------------------------

- 2026年7月12日時点でPreview機能。設定形式や挙動は将来のリリースで変更される可能性があると公式ドキュメントに明記されている。
- 組織のポリシーでフック機能自体が無効化されている場合がある。

設定ファイルの配置先
-------------------------

VS Codeは以下の場所からフック設定ファイルを探索する。`chat.hookFilesLocations`設定で変更可能。

- ワークスペース(共有): `.github/hooks/*.json`
- ワークスペース(Claude形式との互換): `.claude/settings.json`、`.claude/settings.local.json`
- ユーザー単位: `~/.copilot/hooks`、`~/.claude/settings.json`
- カスタムエージェント単位: `.agent.md`のフロントマター内`hooks`フィールド
- プラグイン単位: `hooks.json`または`hooks/hooks.json`

ワークスペースのフックはユーザー単位のフックより優先される。

フック定義の基本構造
-------------------------

`.github/hooks/<任意名>.json`に以下の形式で記述する。

```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "実行するコマンド"
      }
    ]
  }
}
```

フックエントリのプロパティ
--------------------------

- `type`: 文字列。`"command"`固定(必須)
- `command`: 実行コマンド。クロスプラットフォーム
- `windows`: Windows向けコマンド上書き
- `linux`: Linux向けコマンド上書き
- `osx`: macOS向けコマンド上書き
- `cwd`: 作業ディレクトリ。リポジトリルート相対
- `env`: 追加の環境変数
- `timeout`: タイムアウト秒数。デフォルト30秒

フックのライフサイクルイベント
------------------------------

VS Codeは以下8種類のフックイベントに対応する。

- `SessionStart`: 新しいエージェントセッションの最初のプロンプト送信時に発火
- `UserPromptSubmit`: ユーザーがプロンプトを送信したときに発火
- `PreToolUse`: エージェントがツールを呼び出す前に発火
- `PostToolUse`: ツールが正常完了した後に発火
- `PreCompact`: 会話コンテキストが圧縮される前に発火
- `SubagentStart`: サブエージェントが生成されたときに発火
- `SubagentStop`: サブエージェントが完了したときに発火
- `Stop`: エージェントセッションが終了したときに発火

入力(共通フィールド)
-------------------------

全フックはstdin経由で以下のJSONを受け取る。

- `timestamp`: ISO8601形式の発火時刻
- `cwd`: エージェントセッションの作業ディレクトリ。任意
- `session_id`: セッションの一意識別子。任意
- `hook_event_name`: イベント名。例えば`SessionStart`
- `transcript_path`: 会話トランスクリプトファイルへの絶対パス。任意。安定APIではないため公式ドキュメントは`tool_name`等の明文化されたフィールドの利用を推奨している

入力(SessionStart固有)
-------------------------

共通フィールドに加えて以下を受け取る。

- `source`: セッションの開始方法を示す文字列。現時点では常に`"new"`固定で、他の値は存在しない

出力(共通フィールド)
-------------------------

全フックはstdoutへ以下のJSONを返せる。

```json
{
  "continue": true,
  "stopReason": "停止理由の例",
  "systemMessage": "ユーザーへ表示する警告の例"
}
```

- `continue`: 真偽値。`false`にするとエージェントセッション全体を停止する。デフォルトは`true`
- `stopReason`: `continue`が`false`の場合にユーザーへ表示される理由
- `systemMessage`: ユーザーへ表示される警告メッセージ。他の判定結果に関わらず表示される

出力(SessionStart固有)
-------------------------

`hookSpecificOutput`オブジェクトを通じて、エージェントの会話へ追加コンテキストを注入できる。

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "注入したいテキスト"
  }
}
```

- `hookSpecificOutput.hookEventName`: `"SessionStart"`固定
- `hookSpecificOutput.additionalContext`: エージェントの会話に追加されるコンテキスト文字列。feedbackスキルの想起導線として使う本命のフィールド

制御方法の優先順位
-------------------------

複数の制御手段を併用した場合、もっとも制限の強い判定が優先される。

- 終了コード2: もっとも単純な操作ブロック手段。標準エラー出力の内容がモデルへcontextとして渡る。JSON出力は不要
- `continue: false`: エージェントセッション全体を停止する。単一ツール呼び出しのブロックより強い措置
- `hookSpecificOutput`: 各フックイベント固有のきめ細かい制御。例えば`PreToolUse`の`permissionDecision`
- `systemMessage`: 他の判定結果に関わらずユーザーへ警告を表示する

トラブルシューティング
-------------------------

- フックが実行されない場合: ファイルが`.github/hooks/`配下にあり拡張子が`.json`であること、`type`プロパティが`"command"`であることを確認する
- 権限エラーの場合: フックスクリプトに実行権限(`chmod +x`)を付与する
- タイムアウトエラーの場合: `timeout`値を増やすかスクリプトを最適化する
- JSONパースエラーの場合: スクリプトの標準出力が正しいJSON形式になっているか確認する(`jq`等の利用を推奨)

feedbackスキル設計への対応づけ
----------------------------

- SessionStartフックの`hookSpecificOutput.additionalContext`に`.github/feedback/index.md`の中身を出力することで、AIの自発的な読み込み判断に頼らない強制的な想起導線を実現できる可能性がある
- `source`フィールドが現状`"new"`固定のため、セッションの種別による条件分岐はできない
- Preview機能である点と、`.claude/settings.json`もフック探索対象に含まれる点(Claude Code形式との互換性)は、実装前に実機で必ず検証する
