<script lang="ts">
	import BaseMarble from '$lib/components/game/BaseMarble.svelte';
	import GameBoard from '$lib/components/game/GameBoard.svelte';
	import { gameflow } from '$lib/stores/game/gameflow';
	import { marbles } from '$lib/stores/game/marbles';

	let playerCount: number = 2;

	const { activeTeam } = gameflow;
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

		{#if $activeTeam}
			<div class="text-center my-4">
				<p>當前走子</p>

				<div class="w-10 h-10 mx-auto mt-2">
					<BaseMarble team={$activeTeam} />
				</div>
			</div>
		{/if}

		<button
			on:click={() => gameflow.nextTeam()}
			class="bg-gray-700 py-2 px-4 mt-4 shadow rounded hover:brightness-110 transition-colors active:bg-black"
		>
			完成走子
		</button>

		<button
			on:click={() => gameflow.undoMove()}
			class="bg-gray-700 py-2 px-4 mt-4 shadow rounded hover:brightness-110 transition-colors active:bg-black"
		>
			取消走子
		</button>
	</div>

	<GameBoard />
</div>
