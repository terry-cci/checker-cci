<script lang="ts">
	import type { Marble } from '$lib/types/Marble';
	import type { Vector } from '$lib/utils/vector';

	import { GAP } from '$lib/utils/map';

	import Positioner from './Positioner.svelte';
	import { lightenHex } from '$lib/utils/color';
	import { marbles } from '$lib/stores/game/marbles';

	export let marble: Marble;

	const MARBLE_SIZE_FACTOR = 2 / 3;
	const size: Vector = [GAP * MARBLE_SIZE_FACTOR, GAP * MARBLE_SIZE_FACTOR];

	const { selectedMarble } = marbles;
	$: selected = $selectedMarble?.id === marble.id;

	const selectedClasses = 'z-10 scale-110';
</script>

<Positioner location={marble.location} {size}>
	<div
		class="relative gameboard__marble h-full bg-gray-500 rounded-full border-[0.6vmin] cursor-pointer hover:scale-110 transition-transform {selected
			? selectedClasses
			: ''}"
		style:background-color={selected ? lightenHex(marble.team.color, 100) : marble.team.color}
		style:border-color={selected ? '#62ff00' : lightenHex(marble.team.color, 100)}
		style="border-style: outset;"
		on:click={() => marbles.selectMarble(marble)}
	/>
</Positioner>
