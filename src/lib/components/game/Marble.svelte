<script lang="ts">
	import type { Marble } from '$lib/types/Marble';
	import type { Vector } from '$lib/utils/vector';

	import { GAP } from '$lib/utils/map';

	import Positioner from './Positioner.svelte';
	import { marbles } from '$lib/stores/game/marbles';
	import BaseMarble from './BaseMarble.svelte';

	export let marble: Marble;

	const MARBLE_SIZE_FACTOR = 3 / 4;
	const size: Vector = [GAP * MARBLE_SIZE_FACTOR, GAP * MARBLE_SIZE_FACTOR];

	const { selectedMarble } = marbles;
	$: selected = $selectedMarble?.id === marble.id;

	const selectedClasses = 'z-10 scale-110';
</script>

<Positioner location={marble.location} {size}>
	<BaseMarble
		class="cursor-pointer hover:scale-110 transition-transform {selected ? selectedClasses : ''}"
		{selected}
		team={marble.team}
		on:click={() => marbles.selectMarble(marble)}
	/>
</Positioner>
