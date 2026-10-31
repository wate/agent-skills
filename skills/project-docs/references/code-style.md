コーディング規約の収集と統合
============================

基本方針
-------------------------

Linter設定ファイルの内容を読み、プロジェクトの実態に即した規約へ統合します。
設定ファイルにないルールは追加しません。

対象のLinter設定
-------------------------

### EditorConfig

- `.editorconfig`

### Markdownlint

- `.markdownlint.yml`
- `.markdownlint.yaml`
- `.markdownlint.json`

### PHP

- `phpcs.xml`
- `phpstan.neon`
- `phpstan.neon.dist`
- `phpstan.dist.neon`
- `.php-cs-fixer.dist.php`
- `.php-cs-fixer.php`

### Prettier

- `.prettierrc`
- `.prettierrc.*`

### ESLint

- `.eslint.config.js`
- `.eslintrc`
- `.eslintrc.*`
- `package.json`の`eslintConfig`セクション

### Stylelint

- `stylelint.config.js`
- `.stylelintrc`
- `.stylelintrc.*`
- `package.json`の`stylelint`セクション

### yamllint

- `.yamllint`
- `.yamllint.yml`
- `.yamllint.yaml`

### textlint

- `.textlintrc`
- `.textlintrc.*`

### Ansible-lint

- `.ansible-lint`
- `.ansible-lint.yml`
- `.ansible-lint.yaml`

### Ruby

- `.rubocop.yml`
- `.rubocop_todo.yml`

基本ルール
-------------------------

EditorConfigを起点に、次を整理します。

- 文字コード
- 改行コード
- インデントの種類と幅
- 行末スペースの扱い
- ファイル末尾の改行

言語別規約
-------------------------

言語ごとに、設定ファイルの内容を次の観点で整理します。

- 命名規則
- インデントと行長
- ファイル構成と名前空間
- 禁止・許可する構文
- 静的解析のレベル
- テスト・カバレッジの設定

言語間でルールが競合する場合は、より具体的な言語固有ルールを優先します。

制約
-------------------------

- 既存のLinter設定ファイルの内容だけを基準にします。
- 独自ルールの追加はしません。
- 抽象的表現を避け、開発者がすぐ適用できる具体的なルールを書きます。
- 開発効率を損なう過度に厳格なルールは書きません。
- 特定のIDE・エディタに依存するルールは書きません。
- プロジェクトの進捗を妨げる極端な変更は提案しません。

品質確認
-------------------------

- すべてのLinter設定ファイルを反映したか。
- 言語間・ツール間でルールが矛盾していないか。
- 実際の開発現場で適用できる現実的なルールか。

エラーハンドリング
-------------------------

- 設定ファイルがない: 存在する設定ファイルだけを対象にし、ないものは無視します。
- 設定内容を解析できない: 解析できる部分だけを書き、不明部分は省略します。
- ルールが競合する: より具体的な言語固有ルールを優先します。

出力
-------------------------

- 出力形式は`assets/code_style.md`を正本とします。
- 出力前にテンプレートを読み、見出しの追加・削除・順序変更をしません。
- 出力後に見出しをテンプレートと突き合わせます。
