<script lang="ts">
	import BaseMarble from '$lib/components/game/BaseMarble.svelte';
	import GameBoard from '$lib/components/game/GameBoard.svelte';
	import { gameflow } from '$lib/stores/game/gameflow';
	import { marbles } from '$lib/stores/game/marbles';
	import { clamp } from '$lib/utils/math';

	let playerCount: number = 2;

	$: playerCount = clamp(playerCount, 6);

	const { activeTeam, movedMarble, teams } = gameflow;
</script>

<div class="h-full flex items-center justify-center relative">
	<div
		class="absolute left-0 top-0 flex flex-col gap-y-2 bg-black shadow z-10 p-4 sidebar max-w-xs bottom-0"
	>
		<input
			type="number"
			placeholder="玩家人數"
			class="bg-black text-white border border-gray-600 rounded shadow p-2"
			bind:value={playerCount}
			min="1"
			max="6"
		/>

		<button on:click={() => marbles.init(playerCount)}> 初始化棋盤 </button>

		{#if $activeTeam}
			<div class="text-center my-4">
				<p>當前走子</p>

				<div class="w-10 h-10 mx-auto mt-2">
					<BaseMarble team={$activeTeam} />
				</div>
			</div>
		{/if}

		<button on:click={() => gameflow.nextTeam()} disabled={!$movedMarble}> 完成走子 </button>

		<button on:click={() => gameflow.undoMove()} disabled={!$movedMarble}> 取消走子 </button>

		<!-- <pre class="overflow-auto">{JSON.stringify($teams, ['id', 'victory'], 2)}</pre> -->
	</div>

	<GameBoard />
</div>
