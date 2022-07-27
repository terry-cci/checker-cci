<script lang="ts">
	import type { Team } from '$lib/types/Marble';

	import { lightenHex } from '$lib/utils/color';

	export let team: Team;
	export let selected = false;
	let inheritClass = '';
	export { inheritClass as class };

	import { scale } from 'svelte/transition';
</script>

<div
	class="relative gameboard__marble shadow h-full rounded-full border-[0.6vmin] {inheritClass}"
	style:background-image="radial-gradient(circle at top left, {lightenHex(team.color, 100)}, {selected
		? lightenHex(team.color, 50)
		: team.color},
	{lightenHex(team.color, -100)} 100%)"
	style:background-color={selected ? lightenHex(team.color, 50) : team.color}
	style:border-color={selected ? '#62ff00' : lightenHex(team.color, 100)}
	style="border-style: outset;"
	on:click
	transition:scale
/>
