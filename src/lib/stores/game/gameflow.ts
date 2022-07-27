import type { Marble, MoveType, TeamWithCells } from '$lib/types/Marble';
import { derived, get, writable } from 'svelte/store';

import map from '$lib/data/map.json';
import { marbles } from './marbles';
import type { Vector } from '$lib/utils/vector';

function createGameflow() {
	const activeTeamIdx = writable<number | undefined>(undefined);
	const teams = writable<TeamWithCells[]>([]);
	const moveType = writable<MoveType | undefined>(undefined);
	const movedMarble = writable<Marble | undefined>(undefined);
	const originalLocation = writable<Vector | undefined>(undefined);

	const activeTeam = derived([teams, activeTeamIdx], ([$teams, $activeTeamIdx]) =>
		$activeTeamIdx === undefined ? undefined : $teams[$activeTeamIdx]
	);

	function resetValues() {
		moveType.set(undefined);
		movedMarble.set(undefined);
		originalLocation.set(undefined);
		marbles.selectMarble(undefined);
	}

	function nextTeam() {
		resetValues();
		activeTeamIdx.update((idx) => (idx === undefined ? 0 : (idx + 1) % get(teams).length));
	}

	function markOriginalLocation(marble: Marble, location: Vector) {
		originalLocation.set(location);
		movedMarble.set(marble);
	}

	function undoMove() {
		const marble = get(movedMarble);
		const from = get(originalLocation);
		if (!marble || !from) throw 'No marble was moved';

		marbles.setMarbleLocation(marble, from);
		resetValues();
	}

	function setTeams(playerCount: number) {
		const teamIndices = map.teamSetting[playerCount.toString() as keyof typeof map.teamSetting];
		const newTeams = teamIndices.map((idx) => map.teams[idx] as TeamWithCells);
		teams.set(newTeams);
		activeTeamIdx.set(undefined);
	}

	return {
		activeTeamIdx,
		activeTeam,
		setTeams,
		teams,
		nextTeam,
		moveType,
		markOriginalLocation,
		movedMarble,
		originalLocation,
		undoMove,
		resetValues
	};
}

export const gameflow = createGameflow();
