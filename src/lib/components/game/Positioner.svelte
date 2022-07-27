<script lang="ts">
	import v, { type Vector } from '$lib/utils/vector';
	import { locateRenderLocation } from '$lib/utils/map';

	export let location: Vector;
	export let size: Vector;

	import { ui } from '$lib/stores/game/ui';
	const { rotateAngle } = ui;

	$: renderLocation = v.sub(locateRenderLocation(location), v.times(size, 1 / 2));
</script>

<div
	style:width={size[0] + '%'}
	style:height={size[1] + '%'}
	style:left={renderLocation[0] + '%'}
	style:bottom={renderLocation[1] + '%'}
	style:transform="rotate({-$rotateAngle}rad)"
	class="absolute duration-500"
	style="transition-property: left, bottom;"
	data-x={location[0]}
	data-y={location[1]}
>
	<slot />
</div>
