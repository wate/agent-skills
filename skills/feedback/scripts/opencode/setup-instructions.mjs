#!/usr/bin/env node

/**
 * opencode用 instructions設定セットアップスクリプト
 *
 * プロジェクトルートの設定ファイルを対象に、`.github/feedback/index.md`を
 * `instructions`設定へ登録します。opencodeはこの設定により索引をセッションへ
 * 自動注入します。
 *
 * - ファイルが存在しない場合: `opencode.jsonc`を新規作成する
 * - `opencode.jsonc`が存在する場合: そのファイルへ追記する(登録済みなら変更しない)
 * - `opencode.json`のみ存在する場合: そのファイルへ追記する
 *
 * 既存ファイルへはコメントを保持したまま挿入するため、文字列とコメントを考慮した
 * 位置探索で挿入位置を求めます。シェルコマンドを実行しないため、zxではなくNode.js標準モジュールで実装しています。
 *
 * 使用例(プロジェクトルートで実行。スキルを`.agents/skills/feedback/`へ置いた場合):
 *   node .agents/skills/feedback/scripts/opencode/setup-instructions.mjs
 *   node .agents/skills/feedback/scripts/opencode/setup-instructions.mjs --root /path/to/project
 */

import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/** 設定ファイルのファイル名(優先順位順) */
const CONFIG_FILENAMES = ['opencode.jsonc', 'opencode.json'];

/** 新規作成する設定ファイルのファイル名 */
const DEFAULT_CONFIG_FILENAME = CONFIG_FILENAMES[0];

/** instructionsへ登録する索引ファイルのパス(プロジェクトルート相対) */
const INSTRUCTION_PATH = '.github/feedback/index.md';

/** 新規作成する設定ファイルの内容(ドキュメントの記述例に対応) */
const INITIAL_CONFIG_CONTENT = `{
  "instructions": ["${INSTRUCTION_PATH}"]
}
`;

/**
 * ヘルプテキストを表示します。
 *
 * @returns {void}
 */
function showHelp() {
  console.log(`
opencode用 instructions設定セットアップスクリプト

使用方法:
  setup-instructions.mjs [オプション]

オプション:
  --root <ディレクトリ>  プロジェクトルート(デフォルト: カレントディレクトリ)
  --help, -h             このヘルプを表示

動作:
  ${DEFAULT_CONFIG_FILENAME}が存在しない場合、${INSTRUCTION_PATH}をinstructionsへ登録した設定を新規作成します。
  ${CONFIG_FILENAMES.join(' / ')}が存在する場合、instructions配列へ追記します(登録済みなら変更なし)。
  既存ファイルへ追記する際は、コメントを保持したまま挿入します。
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
 * 文字列リテラルを読み取ります。
 *
 * @param {string} text 対象テキスト
 * @param {number} index `"`の位置
 * @returns {{ value: string, end: number } | undefined} 文字列の値と終端位置
 */
function readStringLiteral(text, index) {
  let value = '';
  let i = index + 1;
  while (i < text.length) {
    const char = text[i];
    if (char === '\\') {
      value += text[i + 1] ?? '';
      i += 2;
      continue;
    }
    if (char === '"') {
      return { value, end: i + 1 };
    }
    value += char;
    i += 1;
  }
  return undefined;
}

/**
 * JSONC形式のテキストをトークン列へ分解します。
 *
 * 空白とコメントは読み飛ばします。各トークンは種別とテキスト上の位置を持ちます。
 *
 * @param {string} text JSONC形式のテキスト
 * @returns {Array<{ type: string, value?: string, start: number, end: number }>} トークン列
 */
function tokenizeJsonc(text) {
  const tokens = [];
  const punctuation = '{}[],:';
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    if (/\s/.test(char)) {
      i += 1;
      continue;
    }
    if (char === '/' && text[i + 1] === '/') {
      while (i < text.length && text[i] !== '\n' && text[i] !== '\r') i += 1;
      continue;
    }
    if (char === '/' && text[i + 1] === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end === -1 ? text.length : end + 2;
      continue;
    }
    if (char === '"') {
      const literal = readStringLiteral(text, i);
      const end = literal?.end ?? text.length;
      tokens.push({ type: 'string', value: literal?.value ?? '', start: i, end });
      i = end;
      continue;
    }
    if (punctuation.includes(char)) {
      tokens.push({ type: char, start: i, end: i + 1 });
      i += 1;
      continue;
    }
    const start = i;
    while (i < text.length && !/[\s{}[\],:]/.test(text[i])) i += 1;
    tokens.push({ type: 'literal', value: text.slice(start, i), start, end: i });
  }
  return tokens;
}

/**
 * トークン列からオブジェクトを復元します。
 *
 * コメントはトークン化の時点で除去され、末尾カンマは連結時に取り除きます。
 *
 * @param {Array<object>} tokens JSONCのトークン列
 * @param {string} source エラーメッセージへ表示するファイルパス
 * @returns {object} 解析結果のオブジェクト
 * @throws {Error} オブジェクトとして解析できない場合
 */
function parseJsoncObject(tokens, source) {
  const normalized = tokens
    .filter((token, index) => {
      if (token.type !== ',') return true;
      const next = tokens[index + 1];
      return next !== undefined && next.type !== ']' && next.type !== '}';
    })
    .map((token) =>
      token.type === 'string' ? JSON.stringify(token.value) : token.type === 'literal' ? token.value : token.type,
    )
    .join(' ');

  let value;
  try {
    value = JSON.parse(normalized);
  } catch {
    throw new Error(`${source} をJSONCとして解析できませんでした。手動で確認してください。`);
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${source} のルートがオブジェクトではありません。手動で修正してください。`);
  }
  return value;
}

/**
 * 値のトークン範囲を読み飛ばし、次のトークン位置を返します。
 *
 * @param {Array<object>} tokens JSONCのトークン列
 * @param {number} index 値の開始トークン位置
 * @returns {number} 値の直後のトークン位置
 */
function skipTokenValue(tokens, index) {
  const token = tokens[index];
  if (token?.type !== '{' && token?.type !== '[') return index + 1;

  const close = token.type === '{' ? '}' : ']';
  let depth = 0;
  let i = index;
  while (i < tokens.length) {
    if (tokens[i].type === token.type) depth += 1;
    if (tokens[i].type === close) {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
    i += 1;
  }
  return tokens.length;
}

/**
 * ルート直下にある指定キーの配列を探します。
 *
 * @param {Array<object>} tokens JSONCのトークン列
 * @param {string} key 探索するキー名
 * @returns {{ openBracket: number, isEmpty: boolean, firstElementStart: number } | undefined} 配列の位置情報
 */
function findArrayProperty(tokens, key) {
  if (tokens[0]?.type !== '{') return undefined;

  let i = 1;
  while (i < tokens.length && tokens[i].type !== '}') {
    const name = tokens[i];
    if (name.type !== 'string' || tokens[i + 1]?.type !== ':') return undefined;
    i += 2;
    if (name.value === key) {
      if (tokens[i]?.type !== '[') return undefined;
      return {
        openBracket: tokens[i].start,
        isEmpty: tokens[i + 1]?.type === ']',
        firstElementStart: tokens[i + 1]?.start ?? tokens[i].end,
      };
    }
    i = skipTokenValue(tokens, i);
    if (tokens[i]?.type === ',') i += 1;
  }
  return undefined;
}

/**
 * 既存の配列の先頭へ値を挿入します。
 *
 * @param {string} text JSONC形式のテキスト
 * @param {{ openBracket: number, isEmpty: boolean, firstElementStart: number }} location 配列の位置情報
 * @param {string} valueLiteral 挿入する値のリテラル
 * @returns {string} 挿入後のテキスト
 */
function insertIntoArray(text, location, valueLiteral) {
  const { openBracket, isEmpty, firstElementStart } = location;
  if (isEmpty) {
    return `${text.slice(0, openBracket + 1)}${valueLiteral}${text.slice(openBracket + 1)}`;
  }

  const leading = text.slice(openBracket + 1, firstElementStart);
  const lineBreak = leading.lastIndexOf('\n');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const insertion = lineBreak === -1 ? `${valueLiteral}, ` : `${eol}${leading.slice(lineBreak + 1)}${valueLiteral},`;
  return `${text.slice(0, openBracket + 1)}${insertion}${text.slice(openBracket + 1)}`;
}

/**
 * ルートオブジェクトへ`instructions`プロパティを挿入します。
 *
 * @param {string} text JSONC形式のテキスト
 * @param {object} config 解析済みの設定オブジェクト
 * @param {number} openBrace ルートオブジェクトの`{`位置
 * @returns {string} 挿入後のテキスト
 */
function insertInstructionsProperty(text, config, openBrace) {
  const literal = `[${JSON.stringify(INSTRUCTION_PATH)}]`;
  const separator = Object.keys(config).length === 0 ? '' : ',';
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const insertion = `${eol}  "instructions": ${literal}${separator}`;
  return `${text.slice(0, openBrace + 1)}${insertion}${text.slice(openBrace + 1)}`;
}

/**
 * 更新または作成する設定ファイルのパスを決定します。
 *
 * @param {string} projectRoot プロジェクトルートの絶対パス
 * @returns {string} 設定ファイルのパス
 */
function resolveConfigPath(projectRoot) {
  for (const filename of CONFIG_FILENAMES) {
    const candidate = path.join(projectRoot, filename);
    if (existsSync(candidate)) return candidate;
  }
  return path.join(projectRoot, DEFAULT_CONFIG_FILENAME);
}

/**
 * 既存の設定ファイルへ索引ファイルを追記します。
 *
 * @param {string} configPath 設定ファイルのパス
 * @returns {void}
 * @throws {Error} 設定の解析や更新に失敗した場合
 */
function updateConfig(configPath) {
  const text = readFileSync(configPath, 'utf8');
  const tokens = tokenizeJsonc(text);
  const config = parseJsoncObject(tokens, configPath);

  if (config.instructions !== undefined && !Array.isArray(config.instructions)) {
    throw new Error(`${configPath} の instructions が配列ではありません。手動で修正してください。`);
  }
  if (config.instructions?.includes(INSTRUCTION_PATH)) {
    console.log(`変更なし: ${INSTRUCTION_PATH} は既に instructions に登録されています。`);
    return;
  }

  const location = findArrayProperty(tokens, 'instructions');
  let updated;
  if (location) {
    updated = insertIntoArray(text, location, JSON.stringify(INSTRUCTION_PATH));
  } else if (config.instructions) {
    throw new Error(`${configPath} の instructions の位置を特定できませんでした。手動で修正してください。`);
  } else {
    updated = insertInstructionsProperty(text, config, tokens[0].start);
  }

  writeFileSync(configPath, updated, 'utf8');
  console.log(`更新: ${configPath}`);
  console.log(`instructions へ ${INSTRUCTION_PATH} を追加しました。`);
}

/**
 * セットアップの本体処理を実行します。
 *
 * @param {string} projectRoot プロジェクトルートの絶対パス
 * @returns {void}
 * @throws {Error} 設定の読み込みや更新に失敗した場合
 */
function main(projectRoot) {
  if (!existsSync(projectRoot) || !statSync(projectRoot).isDirectory()) {
    throw new Error(`プロジェクトルートが存在しません: ${projectRoot}`);
  }

  if (!existsSync(path.join(projectRoot, INSTRUCTION_PATH))) {
    console.warn(`注意: ${INSTRUCTION_PATH} がまだ存在しません。ファイルが作成されるまで注入されません。`);
  }

  const configPath = resolveConfigPath(projectRoot);
  if (!existsSync(configPath)) {
    writeFileSync(configPath, INITIAL_CONFIG_CONTENT, 'utf8');
    console.log(`作成: ${configPath}`);
    console.log(`instructions へ ${INSTRUCTION_PATH} を登録しました。`);
    return;
  }

  if (path.basename(configPath) !== DEFAULT_CONFIG_FILENAME) {
    console.log(`注意: ${DEFAULT_CONFIG_FILENAME} がないため ${path.basename(configPath)} を更新します。`);
  }
  updateConfig(configPath);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

try {
  main(resolveProjectRoot(args));
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`エラー: ${message}`);
  process.exit(1);
}
