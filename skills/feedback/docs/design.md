feedbackスキル設計文書
=========================

このドキュメントは、feedbackスキルをmemoryスキルへ発展させるにあたって確定した設計内容をまとめたものです。
確定日は2026年7月12日です。

目的
-------------------------

現行のfeedbackスキルは、ユーザーの明示的な呼び出しがないとログへ記録されないという運用上の煩わしさを抱えています。
本設計は、Claude本体のメモリ機構([claude-memory-mechanism.md](claude-memory-mechanism.md)参照)を土台に、記録を自律化し、対象カテゴリーをfeedback単体から多カテゴリーへ拡張することを目的とします。
今回はまずClaude機構の忠実な移植によって精度を確認する段階と位置づけ、GitHub Copilot・opencode等ツール非依存でのさらなる最適化は次フェーズへ回します。

カテゴリー構成
-------------------------

Claude本体メモリ機構に合わせ、以下4種の排他的なカテゴリーで分類します。

- `user`: ユーザーの役割、目的、責任範囲、既有知識
- `feedback`: AIへの是正指摘に加え、検証済みで非自明な判断の追認も含む
- `project`: 進行中の作業、決定事項、締切、背景のうちコードから読み取れないもの
- `reference`: チケット管理やダッシュボードなど外部システムの参照先

次のものは保存しません。より信頼できる正本が別に存在するためです。

- コードパターン、アーキテクチャ、ファイル配置(コードそのものが正本)
- 変更履歴や変更者(git log、git blameが正本)
- デバッグの解法(コードとコミットメッセージが正本)
- AGENTS.mdにすでに書かれている内容
- 進行中タスクの一時的な状態

保存レイアウト
-------------------------

- 保存ディレクトリ: `.github/feedback/`
- 索引ファイル: `.github/feedback/index.md`をディレクトリ直下に必ず1つ置く
- 索引ファイルの初期化: 導入時にスキル同梱のひな形`assets/index.md`を`.github/feedback/index.md`へ複製して用意する(手順は[references/recall-integration.md](../references/recall-integration.md)を参照)
- 個別メモリ: `.github/feedback/<type>_<name>.md`として1メモリを1ファイルで保存する。ファイル名の先頭にカテゴリー(`user`/`feedback`/`project`/`reference`)を必ず付与し、gitignoreでカテゴリー単位の選択制御ができるようにする
- gitignore方針: 初期状態では索引ファイルを含む`.github/feedback/`配下全体をgitignore対象とし、ローカルに蓄積する(安全側デフォルト)。誤ってリモートへコミットする事故を避けるため、共有したいカテゴリーがある場合のみ、後述のひな形に沿って明示的にオプトインする

```gitignore
.github/feedback/*.md
# 必要に応じてカテゴリー単位でコメントを外し、共有(git管理下)へ切り替える
# !.github/feedback/index.md
# !.github/feedback/user_*.md
# !.github/feedback/feedback_*.md
# !.github/feedback/project_*.md
# !.github/feedback/reference_*.md
```

project/referenceは進行中の作業や外部参照先などチームで有用な情報が多く、feedbackより共有の需要が高い傾向にあります。
ただし初期状態では全カテゴリーを一律ローカル(gitignore対象)とし、共有は都度の明示的な判断でオプトインします。

ログ形式
-------------------------

TSV形式は廃止し、Claude本体メモリ機構を移植します。個別メモリファイルはフロントマターと見出し付きの本文で構成します。

```markdown
---
name: kebab-case-slug
description: 一行要約。将来の関連度判定に使うため具体的に書く
metadata:
  type: feedback
---
メモリのタイトル
=========================

ルールや事実の本体。

Why
-------------------------

理由や経緯。

How to apply
-------------------------

発動条件や適用方法。
```

- ファイル名は`<type>_<name>.md`とする。`<type>`は`metadata.type`と、`<name>`は`name`と一致させる(保存レイアウト節のgitignoreひな形と対応させるため)
- `metadata.type`はカテゴリー構成節の4種から選ぶ
- h1にはメモリのタイトルを書き、フロントマターの`description`と主旨を揃える
- feedbackとprojectのタイプは、h1の直後にルールや事実の本体を書き、続けて`Why`と`How to apply`のh2セクションを置く
- referenceのタイプは上記構成の適用外とし、参照先とその取得方法を書く
- 関連するメモリがある場合は、末尾に`関連`のh2セクションを置き、`- [メモリのタイトル](ファイル名) - 関係の要約`の記法でリンクする

索引ファイル`index.md`は、フロントマターを持たず1行1メモリの一覧のみを記載します。記法は`- [メモリのタイトル](ファイル名) - 一言フック`とし、1行150文字以内に収めます。

記録トリガー
-------------------------

手動呼び出し前提から自律記録へ転換します。次の場面で保存を判断します。

- ユーザーが明示的に記憶を指示した場合。種別を判断して保存する
- 是正や指摘を受けた場合。`feedback`カテゴリーとして保存する
- 非自明な選択が反論なく受け入れられた場合。`feedback`カテゴリーとして追認を保存する
- 役割、背景、外部参照に関する新情報を知った場合。該当カテゴリーへ保存する
- 「忘れて」と指示された場合。該当ファイルを探して削除する

保存前に既存メモリを検索し、重複がある場合は新規作成せず既存ファイルを更新します。
手動呼び出し(「これを記録しておいて」等)は補助的な位置づけとして引き続き受け付けます。

想起導線
-------------------------

Claude本体のシステムプロンプト自動注入はハーネス固有の機能であり、そのままでは移植できません。
そのため、全ツール共通のベースラインと、ツール固有の注入機構を組み合わせて実現します。

データの実体は`.github/feedback/`配下の1箇所のみであり、複数の経路は同じ実体への異なる配信経路にすぎないため、SSOT違反にはなりません。
索引から個別ファイルへの2段引き(索引を見て関連しそうなエントリがあれば個別ファイルを読みに行く)は、セッション開始時に限らず、作業内容が判明した時点でも都度行います。

### AGENTS.md方式(全ツール共通のベースライン)

AGENTS.mdへ、セッション開始時に`.github/feedback/index.md`を確認する旨の指示文を追加します。
フック機構を持たないツールは、この方式のみに依存します。
記載例は[references/recall-integration.md](../references/recall-integration.md)を参照してください。

### ツール固有の注入機構

VS Code Copilot Chatでは、SessionStartフックで`.github/feedback/index.md`の中身を強制注入します。
opencodeでは、`instructions`設定で`.github/feedback/index.md`をコンテキストへ注入します。

スクリプト本体はスキルに同梱します。
フック登録用のテンプレートは`.github/skills/feedback/assets/vscode-copilot/hooks/feedback.json`として提供します。
スクリプト・アセット類は`vscode-copilot/`ディレクトリで区切り、他ツールに対応する際は並列のディレクトリを追加します。

登録手順は[references/recall-integration.md](../references/recall-integration.md)を参照してください。
仕様の根拠は[vscode-copilot-hooks-mechanism.md](vscode-copilot-hooks-mechanism.md)です。
VS Code向けのフックはPreview機能のため、実装後は実機での動作検証を必須とします。

### `session-start.mjs`のシェバン選択

`session-start.mjs`は`#!/usr/bin/env node`を使います。
他スキルの補助スクリプトは`#!/usr/bin/env zx`を使いますが、本スクリプトはzxを使わずNode.js標準モジュールのみで実装しているためです。
シェバンを分けた理由は2つあります。

1. `feedback.json`テンプレートの`command`がNode実行を明示しており、シェバン経由の直接実行(`./session-start.mjs`)を前提にしていないこと
2. フックの`timeout`が5秒と短く、起動頻度も高いため、zxの初期化コストを避けてNode起動を高速化したいこと

陳腐化への防御
-------------------------

メモリの記述は書かれた時点の主張であり、現時点の事実の保証ではありません。

- ファイルパスは使用前に実在を確認する
- 関数名やフラグ名はgrepで確認する
- 現在の状態を問われた場合は、記憶よりもgit logやコードを優先する

関連資料
-------------------------

- [Claudeメモリ機構リファレンス](claude-memory-mechanism.md): 本設計の元ネタとなるメモリ機構の仕様
- [VS Code Copilot Chat Agent Hooksリファレンス](vscode-copilot-hooks-mechanism.md): 想起導線のフック実装根拠。公式ドキュメント出典つき
