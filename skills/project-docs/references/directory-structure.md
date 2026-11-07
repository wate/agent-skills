ディレクトリ構造の出力規則
==========================

基本方針
-------------------------

ディレクトリ構造を、人間がプロジェクトを理解できる形で整理します。
ファイルは原則として出力せず、ディレクトリと、指定された例外ファイルだけを書きます。

階層制御
-------------------------

ルート直下を1階層目と数えます。
出力する深さは、ルート直下のディレクトリの種類で決めます。

- アプリケーション本体: 3階層目まで出力します。
    - フレームワークの規約で配置が決まるディレクトリです(`src/`・`app/`・`templates/`・`tests/`・`config/`・`resources/`・`plugins/`・公開ルート等)。
- ドキュメント、開発環境・AI・CIの設定: 2階層目まで出力します。
    - `docs/`・`.devcontainer/`・`.github/`・`.vscode/`・`bin/`等です。
- 一時領域・ログ・依存パッケージ: 1階層目だけを出力します。
    - `tmp/`・`logs/`・`vendor/`・`node_modules/`等です。
- どの種類か判断できないディレクトリは、2階層目まで出力し、報告で種類の確認を求めます。
- ユーザーが深さを指定したパスは、その指定に従います。
- 「出力対象ファイル」に挙げたファイルは、深さに関係なく出力します。

### 既存文書を更新する場合

既存文書の深さは、人が削って整えた結果として扱います。既定の深さに戻しません。

- 既存文書に載っているパスは、載っている深さをユーザーが指定した深さとして扱います。
- 変更するのは次の3つだけです。
    - 実在しなくなったパスを削除します。
    - 新しく追加されたディレクトリを、既定の深さで追加します。
    - 実態と合わなくなった説明を直します。
- 既存文書にないディレクトリは、人が削ったのか新しく追加されたのかを文書から区別できません。追加した行は報告で一覧にし、不要なら削れるようにします。

表記規則
-------------------------

- ディレクトリの末尾には`/`を付けます。
- 説明は`# 日本語説明文`の形式で書きます。
- インデントは階層に応じて4スペース単位にします。
- 縦線は`│`、分岐は`├`、終端は`└`を使います。
- 横線`─`は使いません。
- カレントディレクトリ表記`./`は使いません。

出力順序
-------------------------

名前の昇順ではなく、読み進めて理解しやすい順に並べます。

1. `README.*`を最初に置きます。
2. ディレクトリは次の順序で並べます。
    - 開発環境の構築に関わるもの(`.devcontainer/`、`bin/`等)
    - ドキュメントと設定(`docs/`、`config/`等)
    - リソースとソースコード(`resources/`、`src/`、`templates/`等)
    - テスト(`tests/`等)
    - 一時領域とログ(`tmp/`、`logs/`等)
    - 依存パッケージと公開ルート(`vendor/`、`webroot/`等)
3. トップディレクトリの設定ファイルは最後に置きます。
    - 設定ファイル同士は名前の昇順にします。

出力対象ファイル
-------------------------

存在する場合だけ、次のファイルを出力対象に含めます。
以下は代表例です。プロジェクト固有の設定ファイルは、この一覧にないものも対象にします。

### 開発環境

- `.devcontainer/`
- `docker/`
- `compose.yml`・`docker-compose.yml`

### 依存パッケージ

- PHP: `vendor/`
- Node.js: `node_modules/`
- Python: `.venv/`・`venv/`
- Ruby: `vendor/bundle/`

### 公開ルート

公開ルートはフレームワークによって異なります。存在するものだけを出力します。

- CakePHP: `webroot/index.php`
- Laravel・Symfony: `public/index.php`
- Rails: `public/`
- Django: `manage.py`、`wsgi.py`・`asgi.py`
- Express・Node.js: `public/`、`server.js`・`app.js`
- Next.js: `public/`、`app/`・`pages/`
- Flask: `static/`、`templates/`、`app.py`
- 静的サイト: `public/`、`dist/`、`htdocs/`

フレームワークが不明な場合は、`public/`・`webroot/`・`htdocs/`など、実際に存在する公開ルートだけを書きます。

### パッケージマネージャー設定

各言語のパッケージマネージャー設定ファイル。

### Linter設定

- EditorConfig: `.editorconfig`
- Markdownlint: `.markdownlint.yml`、`.markdownlint.yaml`、`.markdownlint.json`
- PHP: `phpcs.xml`、`phpstan.neon`、`phpstan.neon.dist`、`phpstan.dist.neon`
- PHP: `.php-cs-fixer.dist.php`、`.php-cs-fixer.php`
- Prettier: `.prettierrc`、`.prettierrc.*`
- ESLint: `.eslint.config.js`、`.eslintrc`、`.eslintrc.*`
- ESLint: `package.json`の`eslintConfig`セクション
- Stylelint: `stylelint.config.js`、`.stylelintrc`、`.stylelintrc.*`
- Stylelint: `package.json`の`stylelint`セクション
- yamllint: `.yamllint`、`.yamllint.yml`、`.yamllint.yaml`
- textlint: `.textlintrc`、`.textlintrc.*`
- Ansible-lint: `.ansible-lint`、`.ansible-lint.yml`、`.ansible-lint.yaml`
- Ruby: `.rubocop.yml`、`.rubocop_todo.yml`

### デプロイ・ビルド設定

- `ansible.cfg`
- `deploy.yml`
- `inventory.yml`
- `Taskfile.yml`・`Makefile`・`justfile`
- `mkdocs.yml`
- `tsconfig.json`
- `rollup.config.js`・`vite.config.js`・`webpack.config.js`
- `Dockerfile`・`compose.yml`・`docker-compose.yml`
- `.github/workflows/`・`.gitlab-ci.yml`
- `.tbls.yml`または`tbls.yml`
- `README.*`

### Gitフック設定

- pre-commit: `.pre-commit-config.yaml`
- Lefthook: `lefthook.yml`・`.lefthook.yml`・`lefthook.yaml`・`.lefthook.yaml`
- Husky: `.husky/`・`package.json`の`husky`セクション
- lint-staged: `.lintstagedrc`・`lint-staged.config.js`・`package.json`の`lint-staged`セクション

除外対象
-------------------------

- `.devcontainer/*`の設定内容
- `vendor/*`の依存パッケージ内容
- `node_modules/*`の依存パッケージ内容
- `.venv/*`・`venv/*`の依存パッケージ内容
- `tree.txt`

プロジェクト固有の除外対象は、依頼時にユーザーが指定します。

品質確認
-------------------------

- 罫線記号と階層が対応しているか。
- 各ディレクトリの役割が明確か。
- 例外の適用範囲がユーザーの指定と一致しているか。
- 読み進めて理解しやすい順に並んでいるか。

エラーハンドリング
-------------------------

- アクセス権限がない: 読める範囲だけを書き、読めなかったパスを報告します。
- パスが存在しない: 存在するパスだけを書き、存在しないパスは書きません。
- 文字コードが不明: UTF-8として扱い、判別できない場合はユーザーへ確認します。

出力
-------------------------

- 出力形式は`assets/directory_structure.md`を正本とします。
- 出力前にテンプレートを読み、見出しの追加・削除・順序変更をしません。
- 出力後に見出しをテンプレートと突き合わせます。
