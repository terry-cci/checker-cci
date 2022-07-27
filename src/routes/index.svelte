<script lang="ts">
	import GameBoard from '$lib/components/game/GameBoard.svelte';
	import { marbles } from '$lib/stores/game/marbles';

	let playerCount: number = 2;
</script>

<div class="h-full flex items-center justify-center relative">
	<div class="absolute left-0 top-0 flex flex-col bg-black shadow z-10 p-4">
		<input
			type="number"
			placeholder="玩家人數"
			class="bg-black text-white border border-gray-600 rounded shadow p-2"
			bind:value={playerCount}
			min="1"
			max="6"
		/>

		<button
			on:click={() => marbles.init(playerCount)}
			class="bg-gray-700 py-2 px-4 mt-4 shadow rounded hover:brightness-110 transition-colors active:bg-black"
		>
			初始化棋盤
		</button>
	</div>

	<GameBoard />
</div>
