import v, { skew, type Vector } from './vector';
import map from '$lib/data/map.json';

import { marbles } from '$lib/stores/game/marbles';

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

export const getMovableLocations = (startLocation: Vector) => {
	const movableLocations: Vector[] = [];

	// adjacent locations
	DIRECTIONS.forEach((direction) => {
		const newLocation = v.add(startLocation, direction);

		if (!isInBound(newLocation)) return;
		if (marbles.marbleOnLocation(newLocation)) return;

		movableLocations.push(newLocation);
	});

	// jumping
	DIRECTIONS.forEach((direction) => {
		let currentLocation = v.add(startLocation, direction);
		let firstBlockingDistance: number | undefined;
		let distance = 1;

		while (isInBound(currentLocation)) {
			if (marbles.marbleOnLocation(currentLocation)) {
				if (!firstBlockingDistance) {
					firstBlockingDistance = distance;
				} else {
					break;
				}
			} else if (firstBlockingDistance && distance === firstBlockingDistance * 2) {
				movableLocations.push(currentLocation);
				break;
			}

			currentLocation = v.add(currentLocation, direction);
			distance++;
		}
	});

	return movableLocations;
};