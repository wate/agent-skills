#!/usr/bin/env node

/**
 * VS Code Copilot Chat用 SessionStartフック登録スクリプト
 *
 * `assets/vscode-copilot/hooks/feedback.json`をひな形とし、コマンドのパスを
 * スキルの実際の配置から生成して、プロジェクトの`.github/hooks/feedback.json`へ書き出します。
 * スキルが`.github/skills/`以外(`.agents/skills/`、`.claude/skills/`など)に置かれていても、
 * 実在するパスを指すフック定義になります。
 *
 * - フック定義が存在しない場合: 新規作成する
 * - 生成結果と同じ内容が存在する場合: 変更しない
 * - 内容の異なるフック定義が存在する場合: 差分を表示して中止する(上書きしない)
 * - スキルがプロジェクト外にある場合: 登録せずに中止する
 *
 * `--check`を指定すると書き込まずに登録状態だけを確認し、終了コードで返します。
 * 0=登録済み、2=未登録、3=内容が異なる(差分を表示)、1=エラー
 *
 * シェルコマンドを実行しないため、zxではなくNode.js標準モジュールで実装しています。
 *
 * 使用例(プロジェクトルートで実行。スキルを`.agents/skills/feedback/`へ置いた場合):
 *   node .agents/skills/feedback/scripts/vscode-copilot/setup-hook.mjs
 *   node .agents/skills/feedback/scripts/vscode-copilot/setup-hook.mjs --root /path/to/project
 *   node .agents/skills/feedback/scripts/vscode-copilot/setup-hook.mjs --check
 */

import { existsSync, mkdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/** このスクリプトのあるディレクトリ */
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

/** フック定義のひな形 */
const TEMPLATE_PATH = path.resolve(SCRIPT_DIR, '../../assets/vscode-copilot/hooks/feedback.json');

/** フック本体のスクリプト */
const SESSION_START_PATH = path.join(SCRIPT_DIR, 'session-start.mjs');

/** 書き出し先のフック定義(プロジェクトルート相対) */
const HOOK_FILE_PATH = '.github/hooks/feedback.json';

/** --check の終了コード */
const EXIT_REGISTERED = 0;
const EXIT_NOT_REGISTERED = 2;
const EXIT_DIFFERENT = 3;

/** 注入対象の索引ファイル(プロジェクトルート相対) */
const MEMORY_INDEX_PATH = '.github/feedback/index.md';

/**
 * ヘルプテキストを表示します。
 *
 * @returns {void}
 */
function showHelp() {
  console.log(`
VS Code Copilot Chat用 SessionStartフック登録スクリプト

使用方法:
  setup-hook.mjs [オプション]

オプション:
  --root <ディレクトリ>  プロジェクトルート(デフォルト: カレントディレクトリ)
  --check                書き込まずに登録状態だけを確認し、終了コードで返す
  --help, -h             このヘルプを表示

動作:
  ${HOOK_FILE_PATH}が存在しない場合、スキルの配置に合わせたフック定義を新規作成します。
  同じ内容が登録済みの場合は変更しません。
  内容の異なるフック定義が存在する場合は、差分を表示して中止します(上書きしません)。
  スキルがプロジェクト外にある場合は、登録せずに中止します。

--check の終了コード:
  ${EXIT_REGISTERED}  登録済み
  ${EXIT_NOT_REGISTERED}  未登録
  ${EXIT_DIFFERENT}  内容の異なるフック定義が存在する(差分を表示)
  1  エラー
`);
}

/**
 * コマンドライン引数からプロジェクトルートを解決します。
 *
 * @param {string[]} args コマンドライン引数(スクリプトパスを除く)
 * @returns {string} プロジェクトルートの絶対パス
 */
function resolveProjectRoot(args) {
  const index = args.findIndex((arg) => arg === '--root');
  if (index !== -1 && args[index + 1]) {
    return path.resolve(args[index + 1]);
  }
  return process.cwd();
}

/**
 * フック本体スクリプトのパスを、プロジェクトルートからの相対パスで求めます。
 *
 * シンボリックリンクと`/tmp`のような別名を解消するため、双方を実パスへ正規化してから比較します。
 *
 * @param {string} projectRoot プロジェクトルートの絶対パス
 * @returns {string} `/`区切りの相対パス
 * @throws {Error} スキルがプロジェクト外にある場合や、プロジェクトルートがスキル内を指している場合
 */
function resolveSessionStartPath(projectRoot) {
  const realRoot = realpathSync(projectRoot);
  const realScript = realpathSync(SESSION_START_PATH);
  const skillDir = path.dirname(path.dirname(path.dirname(realScript)));
  const relative = path.relative(realRoot, realScript);

  if (!path.relative(skillDir, realRoot).startsWith('..')) {
    throw new Error(
      [
        `プロジェクトルートがfeedbackスキルの内部を指しています: ${realRoot}`,
        'プロジェクトルートで実行するか、--root でプロジェクトルートを指定してください。',
      ].join('\n'),
    );
  }

  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(
      [
        `feedbackスキルがプロジェクト外にあります: ${skillDir}`,
        `${HOOK_FILE_PATH} はリポジトリで共有するため、個人環境のパスは登録しません。`,
        'スキルをプロジェクト内(.github/skills/ や .agents/skills/ など)へ配置してから再実行してください。',
      ].join('\n'),
    );
  }
  return relative.split(path.sep).join('/');
}

/**
 * フック定義の内容を、スキルの配置に合わせて生成します。
 *
 * @param {string} sessionStartPath フック本体スクリプトの相対パス
 * @returns {string} 書き出すJSON文字列(末尾改行付き)
 * @throws {Error} ひな形の形式が想定と異なる場合
 */
function buildHookContent(sessionStartPath) {
  const template = JSON.parse(readFileSync(TEMPLATE_PATH, 'utf8'));
  const entry = template.hooks?.SessionStart?.[0];
  if (!entry || typeof entry.command !== 'string') {
    throw new Error(`ひな形の形式が想定と異なります: ${TEMPLATE_PATH}`);
  }

  const quoted = /\s/.test(sessionStartPath) ? `"${sessionStartPath}"` : sessionStartPath;
  entry.command = `node ${quoted}`;
  return `${JSON.stringify(template, null, 2)}\n`;
}

/**
 * JSON文字列を比較用に正規化します。解析できない場合は元の文字列を返します。
 *
 * @param {string} text JSON文字列
 * @returns {string} 正規化した文字列
 */
function normalizeJson(text) {
  try {
    return JSON.stringify(JSON.parse(text));
  } catch {
    return text;
  }
}

/**
 * 2つのテキストの行単位の差分を、unified形式に近い記法で求めます。
 *
 * @param {string} before 変更前のテキスト
 * @param {string} after 変更後のテキスト
 * @returns {string[]} 差分の行(`-`は既存のみ、`+`は生成結果のみ、空白は共通)
 */
function diffLines(before, after) {
  const a = before.replace(/\n$/, '').split('\n');
  const b = after.replace(/\n$/, '').split('\n');
  const lcs = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const lines = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      lines.push(`  ${a[i]}`);
      i += 1;
      j += 1;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      lines.push(`- ${a[i]}`);
      i += 1;
    } else {
      lines.push(`+ ${b[j]}`);
      j += 1;
    }
  }
  while (i < a.length) lines.push(`- ${a[i++]}`);
  while (j < b.length) lines.push(`+ ${b[j++]}`);
  return lines;
}

/**
 * セットアップの本体処理を実行します。
 *
 * @param {string} projectRoot プロジェクトルートの絶対パス
 * @param {boolean} checkOnly trueの場合は書き込まずに登録状態だけを確認する
 * @returns {number} 終了コード
 * @throws {Error} スキルがプロジェクト外にある場合や、既存のフック定義と内容が異なる場合(登録時)
 */
function main(projectRoot, checkOnly) {
  if (!existsSync(projectRoot) || !statSync(projectRoot).isDirectory()) {
    throw new Error(`プロジェクトルートが存在しません: ${projectRoot}`);
  }

  const content = buildHookContent(resolveSessionStartPath(projectRoot));

  if (!existsSync(path.join(projectRoot, MEMORY_INDEX_PATH))) {
    console.warn(`注意: ${MEMORY_INDEX_PATH} がまだ存在しません。ファイルが作成されるまで注入されません。`);
  }

  const hookPath = path.join(projectRoot, HOOK_FILE_PATH);
  if (!existsSync(hookPath)) {
    if (checkOnly) {
      console.log(`未登録: ${HOOK_FILE_PATH} が存在しません。`);
      return EXIT_NOT_REGISTERED;
    }
    mkdirSync(path.dirname(hookPath), { recursive: true });
    writeFileSync(hookPath, content, 'utf8');
    console.log(`作成: ${hookPath}`);
    console.log('SessionStartフックを登録しました。VS Codeを再起動するか、フック設定を再読み込みしてください。');
    return EXIT_REGISTERED;
  }

  const existing = readFileSync(hookPath, 'utf8');
  if (normalizeJson(existing) === normalizeJson(content)) {
    console.log(`${checkOnly ? '登録済み' : '変更なし'}: ${HOOK_FILE_PATH} は既に登録されています。`);
    return EXIT_REGISTERED;
  }

  console.log(`差分(- 既存 / + 生成結果): ${hookPath}`);
  for (const line of diffLines(existing, content)) {
    console.log(line);
  }
  if (checkOnly) {
    console.log(`内容が異なります: ${HOOK_FILE_PATH} はスキルの配置と一致しません。内容を確認して手動で修正してください。`);
    return EXIT_DIFFERENT;
  }
  throw new Error(
    `${HOOK_FILE_PATH} の内容が生成結果と異なるため、上書きせず中止しました。内容を確認して手動で修正してください。`,
  );
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

try {
  process.exitCode = main(resolveProjectRoot(args), args.includes('--check'));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`エラー: ${message}`);
  process.exit(1);
}
