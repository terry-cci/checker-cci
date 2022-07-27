<script lang="ts">
	import { getAllLocations } from '$lib/utils/map';
	import MarbleCell from './MarbleCell.svelte';
	import Marble from './Marble.svelte';

	import v from '$lib/utils/vector';

	import { marbles } from '$lib/stores/game/marbles';
</script>

<div
	class="gameboard w-[90vmin] h-[90vmin] border-[1vmin] border-gray-700 rounded-full shadow border-double relative"
>
	{#each getAllLocations() as location (v.toString(location))}
		<MarbleCell {location} />
	{/each}

	{#each $marbles as marble (marble.id)}
		<Marble {marble} />
	{/each}
</div>
