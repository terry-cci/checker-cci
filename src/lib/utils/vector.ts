export type Vector = [x: number, y: number];
export type Matrix = [Vector, Vector];

export const skew: Matrix = [
	[1, 0],
	[-Math.cos(Math.PI / 3), Math.sin(Math.PI / 3)]
];

export default {
	add(a: Vector, b: Vector) {
		return [a[0] + b[0], a[1] + b[1]] as Vector;
	},

	times(a: Vector, k: number) {
		return [a[0] * k, a[1] * k] as Vector;
	},

	sub(a: Vector, b: Vector) {
		return this.add(a, this.times(b, -1));
	},

	timesMatrix(a: Vector, m: Matrix) {
		return this.add(this.times(m[0], a[0]), this.times(m[1], a[1]));
	},

	equals(a: Vector | undefined, b: Vector | undefined) {
		if (!a && !b) return true;
		if (!(a && b)) return false;
		return a[0] === b[0] && a[1] === b[1];
	},

	cmp(a: Vector, b: Vector) {
		if (a[0] !== b[0]) return a[0] - b[0];
		return a[1] - b[1];
	},

	toString(a: Vector) {
		return `(${a[0]}, ${a[1]})`;
	}
};
