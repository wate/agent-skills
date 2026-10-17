#!/usr/bin/env node

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const MEMORY_INDEX_PATH = '.github/feedback/index.md';

/**
 * 標準入力からフックのJSONペイロードを読み取ります。
 *
 * @returns {Promise<string>} 標準入力の文字列
 */
function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

/**
 * JSONを標準出力へ書き出します。
 *
 * @param {object} payload 出力するJSONオブジェクト
 * @returns {void}
 */
function printJson(payload) {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

/**
 * 追加コンテキストなしで、通常の処理へ委ねます。
 *
 * @param {string} [systemMessage] 任意の補足メッセージ
 * @returns {void}
 */
function neutral(systemMessage = '') {
  if (systemMessage) {
    printJson({ continue: true, systemMessage });
    return;
  }

  printJson({ continue: true });
}

/**
 * index.mdの内容を追加コンテキストとして注入します。
 *
 * @param {string} content index.mdの内容
 * @returns {void}
 */
function injectMemoryContext(content) {
  printJson({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: content,
    },
  });
}

/**
 * フック本体を実行し、index.mdの内容をセッション開始時に注入します。
 *
 * @returns {Promise<void>} 実行結果
 */
async function main() {
  try {
    const rawInput = await readStdin();
    const payload = rawInput.trim() ? JSON.parse(rawInput) : {};
    const workspaceCwd =
      typeof payload.cwd === 'string' && payload.cwd.trim() ? path.resolve(payload.cwd) : process.cwd();
    const memoryIndexPath = path.resolve(workspaceCwd, MEMORY_INDEX_PATH);

    if (!existsSync(memoryIndexPath)) {
      neutral();
      return;
    }

    const content = readFileSync(memoryIndexPath, 'utf8').trim();
    if (!content) {
      neutral();
      return;
    }

    injectMemoryContext(content);
  } catch (error) {
    neutral(`memory hook warning: ${error instanceof Error ? error.message : String(error)}`);
  }
}

await main();
