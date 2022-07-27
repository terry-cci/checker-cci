<script lang="ts">
	import { marbles } from '$lib/stores/game/marbles';

	import { GAP } from '$lib/utils/map';

	import v, { type Vector } from '$lib/utils/vector';

	import Positioner from './Positioner.svelte';

	export let location: Vector;

	const CELL_SIZE_FACTOR = 3 / 5;
	const size: Vector = [GAP * CELL_SIZE_FACTOR, GAP * CELL_SIZE_FACTOR];

	const { selectedMarble, selectedCell, movableLocations } = marbles;

	$: selected = v.equals($selectedCell, location);
	$: movable = $movableLocations.find((movableLocation) =>
		v.equals(movableLocation.location, location)
	);

	function handleClick() {
		if (!movable) return;

		if (selected) {
			if (!$selectedMarble) throw 'No marble is selected';
			marbles.moveMarble($selectedMarble, movable);
			return;
		}
		marbles.selectCell(location);
	}
</script>

<Positioner {location} {size}>
	<div
		class="relative z-20 gameboard__cell transition-all duration-500 h-full rounded-full border-gray-600"
		style:cursor={movable ? 'pointer' : 'default'}
		style:border-width={selected || movable ? '0.7vmin' : '0.4vmin'}
		style:border-color={selected || movable ? '#999' : 'rgb(55 65 81)'}
		style:background-color={selected ? '#85ff39' : 'rgb(17 24 39'}
		style="border-style: inset;"
		on:click={() => handleClick()}
	/>
</Positioner>
