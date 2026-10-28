JavaScript・TypeScriptのアノテーション
======================================

JavaScriptとTypeScriptの判定
----------------------------

書式がJavaScriptとTypeScriptで異なるため、書く前にどちらかを判定します。

- TypeScript: `.ts`・`.tsx`・`.mts`・`.cts`のファイルと、`lang="ts"`または`lang="tsx"`の`<script>`
- JavaScript: `.js`・`.jsx`・`.mjs`・`.cjs`のファイルと、`lang`のない`<script>`

書式
-------------------------

- JSDoc形式で書き、`@param`・`@returns`・`@throws`のタグを使う
- JavaScriptでは、タグに`{型}`を書く(`@param {string[]} items`)
- TypeScriptでは、型は型注釈に任せ、タグに`{型}`を書かない
- 型が特定できない場合は`unknown`を使う

JavaScriptで型を組み立てるタグ
------------------------------

TypeScriptなら型の宣言で書く内容を、JavaScriptではJSDocのタグで書きます。

- 複数の箇所で使うオブジェクトの形は、`@typedef`で名前を付け、各プロパティを`@property`で書く
- コールバック関数の型は、`@callback`で名前を付け、引数と戻り値を`@param`・`@returns`で書く
- 型引数を持つ関数やクラスは、`@template`で型引数を宣言する

クラス
-------------------------

- クラス、コンストラクタ、フィールド、メソッドのそれぞれにJSDocを書く
- JavaScriptのフィールドの型は、フィールドの直前に`/** @type {型} */`で書く
- TypeScriptのコンストラクタの引数で宣言したプロパティ(`constructor(private name: string)`)は、コンストラクタの`@param`で説明する
- TypeScriptのオーバーロードは、各シグネチャの直前にJSDocを書く。実装のシグネチャは外から見えないため、実装には書かない

コンポーネントのprops
-------------------------

TypeScriptでは、propsの説明をpropsの型(`interface`・`type`)の各プロパティに書きます。
エディターは、コンポーネントを使う側でpropsを補完するときに、この説明を表示します。
コンポーネント関数のJSDocには役割だけを書き、propsを`@param`で1つずつ書き直しません。

JavaScriptでは、型を書く場所がJSDocしかないため、`@param {Object} props`の後に、`@param {型} props.名前 説明`の形で各propsを書きます。

省略できるpropsには、省略した場合の振る舞いや既定値を説明に書きます。

Vueの単一ファイルコンポーネント
-------------------------------

- コメントを書くのは`<script>`と`<script setup>`の中だけにし、`<template>`と`<style>`には書かない
- `defineProps`に型引数を渡している場合は、型引数の各プロパティにJSDocを書く
- `defineProps`にオブジェクトを渡している場合は、オブジェクトの各キーの直前にJSDocを書く
- `defineEmits`に型引数を渡している場合は、型引数の各イベントにJSDocを書き、イベントが起きる条件と渡す値を説明する
- `defineModel`(Vue 3.4以降)は、`v-model`で受け渡すpropsと`update:名前`のイベントを宣言する。呼び出しの直前にJSDocを書き、受け渡す値の意味を説明する
- `defineSlots`(Vue 3.3以降)では、スロット名をキーにした型引数の各スロットにJSDocを書き、スロットへ渡す値を説明する
- `defineExpose`で公開した変数と関数は、親がテンプレート参照から使う。宣言の直前のJSDocに、親から使われることと使い方を書く
- `<script setup>`は、`defineExpose`で公開したもの以外を親へ公開しない。公開していない関数の説明に、親から呼べるように書かない
- propsの既定値は、`withDefaults`の第2引数、Vue 3.5以降の`defineProps`の分割代入の既定値、`defineModel`の`default`のいずれかで決まる。既定値がある場合は、各propsの説明に既定値を書く
- `defineOptions`はコンポーネントの設定(`inheritAttrs`など)を書くだけのため、説明を書く対象にしない
- `<script setup>`には、コンポーネント全体の説明を付ける宣言がない。説明が必要な場合は、ブロックの先頭に通常のブロックコメントで書く

`defineModel`と`defineSlots`に書いたJSDocを、コンポーネントを使う側のエディターが表示するかは、公式ドキュメントに記載がなく、未確認です。

静的解析
-------------------------

- TypeScriptの`checkJs`を有効にしたJavaScriptでは、JSDocの型が型検査に使われる
- ESLintの`eslint-plugin-jsdoc`を設定している場合は、タグの有無と書式が検査される
- Vueの単一ファイルコンポーネントの型検査は`vue-tsc`で行う。`tsc`は`.vue`ファイルを検査しない

見本
-------------------------

JavaScriptでは、型をタグに書きます。

```js
/**
 * 受け取ったリストを、キーワードを含む要素だけに絞り込む
 *
 * @param {string[]} items 対象のリスト
 * @param {string} keyword 絞り込むキーワード。空文字の場合はすべての要素を返す
 * @returns {string[]} キーワードを含む要素のリスト
 */
export function filterItems(items, keyword) {
    return items.filter((item) => item.includes(keyword));
}
```

TypeScriptでは、型を型注釈に任せます。

```ts
/**
 * 受け取ったリストを、キーワードを含む要素だけに絞り込む
 *
 * @param items 対象のリスト
 * @param keyword 絞り込むキーワード。空文字の場合はすべての要素を返す
 * @returns キーワードを含む要素のリスト
 */
export function filterItems(items: string[], keyword: string): string[] {
    return items.filter((item) => item.includes(keyword));
}
```

次のReactとVueの見本は、このスキルの作成時には型検査をしていません(未検証)。

Reactのコンポーネントでは、propsの説明を型の各プロパティに書きます。

```tsx
type StatusBadgeProps = {
    /** 表示するステータス */
    status: 'active' | 'completed';
    /** バッジに添える件数。省略した場合は件数を表示しない */
    count?: number;
};

/**
 * ステータスを色付きのバッジで表示する
 */
export function StatusBadge({ status, count }: StatusBadgeProps) {
    return <span className={`badge badge-${status}`}>{status}{count ?? ''}</span>;
}
```

Vueの単一ファイルコンポーネントでは、`defineProps`と`defineEmits`の型引数に書きます。

```vue
<script setup lang="ts">
/*
 * ステータスを色付きのバッジで表示し、クリックされたことを親に知らせる
 */
const props = defineProps<{
    /** 表示するステータス */
    status: 'active' | 'completed';
    /** バッジに添える件数。省略した場合は件数を表示しない */
    count?: number;
}>();

const emit = defineEmits<{
    /** バッジがクリックされたときに、表示中のステータスを渡す */
    select: [status: 'active' | 'completed'];
}>();
</script>
```

`withDefaults`・`defineModel`・`defineSlots`・`defineExpose`を使う場合も、宣言ごとに説明を書きます。

```vue
<script setup lang="ts">
/*
 * キーワードの入力欄と、絞り込んだ結果の一覧を表示する
 */
const props = withDefaults(defineProps<{
    /** 一覧に表示する最大件数。既定値は20件 */
    limit?: number;
}>(), {
    limit: 20,
});

/** 入力されたキーワード。親とv-modelで受け渡す */
const keyword = defineModel<string>({ required: true });

defineSlots<{
    /** 一覧の1行。表示する要素と、0始まりの行番号を渡す */
    item(props: { item: string; index: number }): any;
}>();

/** 入力欄を空にする。親がテンプレート参照から呼ぶ */
function clear(): void {
    keyword.value = '';
}

defineExpose({ clear });
</script>
```
