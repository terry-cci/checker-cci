import type { Vector } from '$/utils/vector';

export type Team = {
	id: number;
	color: string;
	goal: number;
};

export type TeamData = Team & {
	cells: Vector[];
	victory: boolean;
};

export type Marble = {
	id: number;
	team: Team;
	location: Vector;
};

export type MoveType = 'jump' | 'move';

export type MovableLocation = {
	type: MoveType;
	location: Vector;
};
