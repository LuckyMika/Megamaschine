<script lang="ts">
	let accumulator = 0;
	let mnemonic = 'mov';
	let operand = '100';
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
</div>

