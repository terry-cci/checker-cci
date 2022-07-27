import type { Vector } from '$/utils/vector';

export type Team = {
	id: number;
	color: string;
};

export type Marble = {
	id: number;
	team: Team;
	location: Vector;
};
