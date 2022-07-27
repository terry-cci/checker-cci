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

		if (!$selectedMarble) throw 'No marble is selected';
		marbles.moveMarble($selectedMarble, movable);
		return;
	}
</script>

<Positioner {location} {size}>
	<div
		class="relative z-20 gameboard__cell transition-all h-full rounded-full border-gray-600"
		style:cursor={movable ? 'pointer' : 'default'}
		style:border-width={selected || movable ? '0.7vmin' : '0.4vmin'}
		style:border-color={selected || movable ? '#999' : 'rgb(55 65 81)'}
		style:background-color={selected ? '#ff00fc' : movable ? '#ccc' : '#090c12'}
		style="border-style: inset;"
		class:gameboard__cell--hinted={movable}
		class:gameboard__cell--selected={selected}
		on:click={() => handleClick()}
	/>
</Positioner>
