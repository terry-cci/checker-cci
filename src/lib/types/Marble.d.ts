import type { Vector } from '$/utils/vector';

export type Team = {
	id: number;
	color: string;
};

export type TeamWithCells = Team & {
	cells: Vector[];
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
