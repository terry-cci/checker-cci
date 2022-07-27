import v, { skew, type Vector } from './vector';
import map from '$lib/data/map.json';

import { marbles } from '$lib/stores/game/marbles';
import type { Marble, MovableLocation, TeamWithCells } from '$lib/types/Marble';
import { get } from 'svelte/store';
import { gameflow } from '$lib/stores/game/gameflow';

export const GAP = (100 * Math.cos(Math.PI / 6)) / 12;
export const ORIGIN: Vector = [50 * (1 - Math.cos(Math.PI / 6)), 25];

const DIRECTIONS: Vector[] = [
	[-1, -1],
	[-1, 0],
	[0, -1],
	[0, 1],
	[1, 0],
	[1, 1]
];

export const locateRenderLocation = (location: Vector) =>
	v.add(v.times(v.timesMatrix(location, skew), GAP), ORIGIN);

export const isInBound = (location: Vector) =>
	map.bounds[location[0]] &&
	map.bounds[location[0]][0] <= location[1] &&
	map.bounds[location[0]][1] >= location[1];

export const getAllLocations = () =>
	map.bounds.flatMap(([startY, endY], x) => {
		const column = [];
		for (let y = startY; y <= endY; y++) {
			column.push([x, y] as Vector);
		}
		return column;
	});

export const getMarblesOfTeam = (team: TeamWithCells) => {
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
};

export const getFirstBlocking = (from: Vector, direction: Vector) => {
	let currentLocation = v.add(from, direction);
	let distance = 1;

	while (isInBound(currentLocation)) {
		if (marbles.marbleOnLocation(currentLocation)) {
			return {
				location: currentLocation,
				distance
			};
		}

		currentLocation = v.add(currentLocation, direction);
		distance++;
	}
	return undefined;
};

export const getMovableLocations = (startLocation: Vector) => {
	const movableLocations: MovableLocation[] = [];

	// adjacent locations
	if (get(gameflow.moveType) === undefined) {
		DIRECTIONS.forEach((direction) => {
			const newLocation = v.add(startLocation, direction);

			if (!isInBound(newLocation)) return;
			if (marbles.marbleOnLocation(newLocation)) return;

			movableLocations.push({ location: newLocation, type: 'move' });
		});
	}

	// jumping
	if (get(gameflow.moveType) !== 'move') {
		DIRECTIONS.forEach((direction) => {
			const firstBlocking = getFirstBlocking(startLocation, direction);
			if (!firstBlocking) return;
			const secondBlocking = getFirstBlocking(firstBlocking.location, direction);

			if (!secondBlocking || secondBlocking.distance > firstBlocking.distance) {
				const destination = v.add(
					firstBlocking.location,
					v.times(direction, firstBlocking.distance)
				);
				if (isInBound(destination)) {
					movableLocations.push({ location: destination, type: 'jump' });
				}
			}
		});
	}

	return movableLocations;
};
