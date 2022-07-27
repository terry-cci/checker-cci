import type { Marble, MovableLocation } from '$lib/types/Marble';
import { derived, get, writable } from 'svelte/store';

import v, { type Vector } from '$lib/utils/vector';
import { getMarblesOfTeam, getMovableLocations } from '$lib/utils/map';
import { gameflow } from './gameflow';

function createMarbles() {
	const marbles = writable<Marble[]>([]);
	const selectedMarble = writable<Marble | undefined>(undefined);
	const selectedCell = writable<Vector | undefined>(undefined);

	const movableLocations = derived(
		[selectedMarble, marbles, gameflow.moveType],
		([$selectedMarble]) => {
			if (!$selectedMarble) return [];
			return getMovableLocations($selectedMarble.location);
		}
	);

	function init(playerCount: number) {
		selectedMarble.set(undefined);
		selectedCell.set(undefined);
		gameflow.setTeams(playerCount);
		gameflow.nextTeam();

		const newMarbles = get(gameflow.teams).flatMap(getMarblesOfTeam);

		marbles.set(newMarbles);
	}

	function selectMarble(marble: Marble | undefined) {
		// team not active
		if (marble && marble.team.id !== get(gameflow.activeTeam)?.id) return;
		// has done other moves
		if (get(gameflow.movedMarble)) return;

		selectedMarble.set(marble);
		selectedCell.set(undefined);
	}

	function selectCell(location: Vector | undefined) {
		selectedCell.set(location);
	}

	function marbleOnLocation(location: Vector) {
		return get(marbles).find((marble) => v.equals(marble.location, location));
	}

	function setMarbleLocation(marble: Marble, location: Vector) {
		marbles.update((marbles) => {
			const newMarbles = [...marbles];
			const m = newMarbles.find((m) => m.id === marble.id);
			if (!m) throw `Marble #${marble.id} not found`;
			m.location = location;
			return newMarbles;
		});
	}

	function moveMarble(marble: Marble, to: MovableLocation) {
		// mark the original location
		if (!get(gameflow.movedMarble)) gameflow.markOriginalLocation(marble, marble.location);
		setMarbleLocation(marble, to.location);
		gameflow.moveType.set(to.type);
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
		moveMarble,
		setMarbleLocation
	};
}

export const marbles = createMarbles();
