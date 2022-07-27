<script lang="ts">
	import { getAllLocations } from '$lib/utils/map';
	import MarbleCell from './MarbleCell.svelte';
	import Marble from './Marble.svelte';

	import v from '$lib/utils/vector';

	import { marbles } from '$lib/stores/game/marbles';
	import Rotator from './Rotator.svelte';

	import { ui } from '$lib/stores/game/ui';
	const { rotateAngle } = ui;
</script>

<Rotator>
	<div
		class="gameboard w-[85vmin] h-[85vmin] rounded-full shadow relative  cursor-default"
		style:transform="rotate({$rotateAngle}rad)"
	>
		{#each getAllLocations() as location (v.toString(location))}
			<MarbleCell {location} />
		{/each}

		{#each $marbles as marble (marble.id)}
			<Marble {marble} />
		{/each}
	</div>
</Rotator>
