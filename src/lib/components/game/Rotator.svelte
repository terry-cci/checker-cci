<script lang="ts">
	import { ui } from '$lib/stores/game/ui';

	import v, { type Vector } from '$lib/utils/vector';

	const { rotateAngle } = ui;

	let rotatorDiv: HTMLDivElement;

	let startAngle: number | undefined = undefined;

	function getRelativeVector(clientPosition: Vector) {
		const rect = rotatorDiv.getBoundingClientRect();
		const center: Vector = [rect.x + rect.width / 2, rect.y + rect.height / 2];
		return v.sub(clientPosition, center);
	}

	function startDrag(clientPosition: Vector) {
		const startVector = getRelativeVector(clientPosition);
		startAngle = v.getAngle(startVector);
	}

	function doDrag(clientPosition: Vector) {
		if (!startAngle) return;
		const dragVector = getRelativeVector(clientPosition);
		const dragAngle = v.getAngle(dragVector);

		$rotateAngle += dragAngle - startAngle;
		startAngle = dragAngle;
	}

	function stopDrag() {
		startAngle = undefined;
	}
</script>

<svelte:body on:mousemove={(e) => doDrag([e.clientX, e.clientY])} on:mouseup={(e) => stopDrag()} />

<div
	class="flex items-center justify-center w-[95vmin] h-[95vmin] bg-gray-900 rounded-full border-[1vmin] border-double border-gray-700 cursor-grab shadow origin-center"
	style:background-image="radial-gradient(circle at center, black 60%, #1a1f26 100%)"
	on:mousedown|self={(e) => startDrag([e.clientX, e.clientY])}
	bind:this={rotatorDiv}
>
	<slot />
</div>
