import type { Marble } from '$lib/types/Marble';
import { derived, get, writable } from 'svelte/store';

import map from '$lib/data/map.json';
import v, { type Vector } from '$lib/utils/vector';
import { getMovableLocations } from '$lib/utils/map';

function createMarbles() {
	const marbles = writable<Marble[]>([]);
	const selectedMarble = writable<Marble | undefined>(undefined);
	const selectedCell = writable<Vector | undefined>(undefined);

	const movableLocations = derived([selectedMarble, marbles], ([$selectedMarble]) => {
		if (!$selectedMarble) return [];
		return getMovableLocations($selectedMarble.location);
	});

	function init(playerCount: number) {
		selectedMarble.set(undefined);
		selectedCell.set(undefined);

		const teamIndices = map.teamSetting[playerCount.toString() as keyof typeof map.teamSetting];

		const newMarbles = teamIndices.flatMap((teamIdx) => {
			const team = map.teams[teamIdx];

			const teamMarbles = team.cells.map(([x, y], marbleIdx) => {
				const marble: Marble = {
					id: team.id * 100 + marbleIdx + 1,
					team: {
						id: team.id,
						color: team.color
					},
					location: [x, y]
				};

				return marble;
			});

			return teamMarbles;
		});

		marbles.set(newMarbles);
	}

	function selectMarble(marble: Marble) {
		selectedMarble.set(marble);
	}

	function selectCell(location: Vector) {
		selectedCell.set(location);
	}

	function marbleOnLocation(location: Vector) {
		return get(marbles).find((marble) => v.equals(marble.location, location));
	}

	function moveMarble(marbleId: number, to: Vector) {
		marbles.update((marbles) => {
			const newMarbles = [...marbles];

			const marble = newMarbles.find((m) => m.id === marbleId);
			if (!marble) throw `Marble #${marbleId} not found`;
			marble.location = to;

			return newMarbles;
		});
	}

	return {
		subscribe: marbles.subscribe,
		selectedMarble,
		selectedCell,
		movableLocations,
		selectCell,
		init,
		selectMarble,
		marbleOnLocation,
		moveMarble
	};
}

export const marbles = createMarbles();
