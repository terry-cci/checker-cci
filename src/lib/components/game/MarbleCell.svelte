<script lang="ts">
	import { marbles } from '$lib/stores/game/marbles';

	import { GAP } from '$lib/utils/map';

	import v, { type Vector } from '$lib/utils/vector';

	import Positioner from './Positioner.svelte';

	export let location: Vector;

	const CELL_SIZE_FACTOR = 1 / 2;
	const size: Vector = [GAP * CELL_SIZE_FACTOR, GAP * CELL_SIZE_FACTOR];

	const { selectedMarble, selectedCell, movableLocations } = marbles;

	$: selected = v.equals($selectedCell, location);
	$: hinted = $movableLocations.find((movableLocation) => v.equals(movableLocation, location));

	const selectedClasses = 'bg-[#85ff39]';

	function handleClick() {
		if (!hinted) return;
		if (selected) {
			if (!$selectedMarble) throw 'No marble is selected';
			marbles.moveMarble($selectedMarble.id, location);
			return;
		}
		marbles.selectCell(location);
	}
</script>

<Positioner {location} {size}>
	<div
		class="gameboard__cell transition-all bg-gray-900 border-[0.4vmin] border-gray-800  h-full rounded-full {selected
			? selectedClasses
			: ''}"
		style:border-width={selected || hinted ? '0.7vmin' : '0.4vmin'}
		style:border-color={selected || hinted ? '#999' : 'rgb(31, 41, 55)'}
		style="border-style: inset;"
		on:click={() => handleClick()}
	>
		<!-- {hinted} -->
	</div>
</Positioner>
