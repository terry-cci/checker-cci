import { writable } from 'svelte/store';

function createUi() {
	const rotateAngle = writable(0);
	return { rotateAngle };
}

export const ui = createUi();
