import type { Marble, MoveType, TeamData } from '$lib/types/Marble';
import { derived, get, writable } from 'svelte/store';

import map from '$lib/data/map.json';
import { marbles } from './marbles';
import type { Vector } from '$lib/utils/vector';

function createGameflow() {
	const activeTeamIdx = writable<number | undefined>(undefined);
	const teams = writable<TeamData[]>([]);
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
		checkTeamVictories();
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

	function getGoalCellsForTeam(teamId: number) {
		const team = get(teams).find((team) => team.id === teamId);
		if (!team) throw `Team #${teamId} not found`;

		const goalTeam = map.teams.find((t) => t.id === team.goal);
		if (!goalTeam) throw `Team #${team.goal} not found`;

		return goalTeam.cells;
	}

	function checkTeamVictories() {
		get(teams).forEach((team) => {
			const goalCells = getGoalCellsForTeam(team.id);
			const victory = goalCells.every(
				(cell) => marbles.marbleOnLocation(cell as Vector)?.team.id === team.id
			);

			teams.update((oldTeams) => {
				const newTeams = [...oldTeams];
				const teamToUpdate = newTeams.find((t) => t.id === team.id) as TeamData;

				teamToUpdate.victory = victory;

				return newTeams;
			});
		});
	}

	function setTeams(playerCount: number) {
		const teamIndices = map.teamSetting[playerCount.toString() as keyof typeof map.teamSetting];
		const newTeams = teamIndices.map((idx) => ({ ...map.teams[idx], victory: false } as TeamData));
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
