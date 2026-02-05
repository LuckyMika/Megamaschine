<script lang="ts">
	import { lex } from '$lib/lexer';
	import { Parser } from '$lib/parser';

	let accumulator = 0;
	let mnemonic = 'mov';
	let operand = '100';

	let assembly = '';

	function buildProgram() {
		const tokens = lex(assembly);
		console.log(tokens);

		const ast = new Parser(tokens).parseProgram();

		console.log(ast);
	}
</script>

<div class="h-dvh bg-neutral-800">
	<h1 class="text-center text-4xl font-bold text-green-400">Megamaschine</h1>

	<div class="my-5 flex items-center justify-evenly">
		<div class="">
			<span class="min-w-35 border-2 border-white px-2 py-1 text-center text-white"
				>{accumulator}</span
			>
		</div>
		<div class="flex">
			<span class="m-0 min-w-15 border-2 border-white px-2 py-1 text-center text-white"
				>{mnemonic}</span
			>
			<span class="m-0 min-w-15 border-2 border-white px-2 py-1 text-center text-white"
				>{operand}</span
			>
		</div>
	</div>
	<div class="mx-auto h-4/6 max-w-fit min-w-8/12">
		<textarea
			bind:value={assembly}
			class="min-h-full w-full resize-none bg-neutral-600"
			name="Editor"
			id="editor"
		></textarea>
		<button on:click={buildProgram} class="cursor-pointer">Do stuff!</button>
	</div>
</div>
