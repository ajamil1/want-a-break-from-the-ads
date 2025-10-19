<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { data } = $props();
	let deletedItem = $state();
	let addItem = $state(false);
	let groceries = $state(data.groceries);
	let found = $state(false);
	let focus = $state()
	let count: any = $state(0)

	onMount(() => {
		console.log('test');
		while (found == false) {
			try {
				console.log(found);
				document.addEventListener('gesturestart', function (e) {
					e.preventDefault();
					// special hack to prevent zoom-to-tabs gesture in safari
					document.body.style.zoom = '0.99';
				});

				document.addEventListener('gesturechange', function (e) {
					e.preventDefault();
					// special hack to prevent zoom-to-tabs gesture in safari
					document.body.style.zoom = '0.99';
				});

				document.addEventListener('gestureend', function (e) {
					e.preventDefault();
					// special hack to prevent zoom-to-tabs gesture in safari
					document.body.style.zoom = '0.99';
				});
				found = true;
			} catch (error) {
				console.log(error);
			}
		}
	});

	$effect(() => {
		groceries = data.groceries;
	});
</script>

<div class="w-full h-full bg-black overflow-hidden">
	<div
		class="backdrop-blur-md bg-black/50 absolute right-0 left-0 w-full h-full px-4 z-40 {addItem ==
		true
			? 'opacity-100'
			: 'hidden opacity-0'}"
	>
		<form
			action="?/addItem"
			use:enhance={() => {
				deletedItem = null;
				addItem = false;
			}}
			method="POST"
		>
			<input type="submit" hidden />
			<input
				name="name"
				id="name"
				class="capitalize bg-black flex flex-row transition-all duration-600 flex py-3 w-full px-4 rounded-2xl cursor-pointer border-2 bg-cyan-500/15 border-cyan-200 truncate transition-all duration-200 mt-60 text-cyan-100 text-3xl"
				placeholder="Enter Item Name"
			/>
		</form>
	</div>
	<div class="h-full w-screen bg-black pb-10 overflow-scroll absolute z-20 duration-400">
		<form
			class="bg-black w-screen sticky top-0 flex flex-row transition-all duration-600 z-50 flex py-3 px-4 mx-auto cursor-pointer bg-neutral-950/50 backdrop-blur-sm truncate transition-all duration-200"
			action="?/addItem"
		>
			<div
				class="cursor-pointer flex flex-row items-center overflow-hidden w-full"
			>
				<div
					class=" relative flex flex-row text-center truncate text-ellipsis cursor-pointer w-full"
				>
					<div
						class="text-neutral-300 text-2xl justify-center font-base cursor-pointer truncate flex flex-row gap-4 w-full z-10"
					>
						<p>Jamil Family Groceries</p>
					</div>
				</div>
			</div>
		</form>
		{#each groceries as item}
			<form
				use:enhance={() => {
					console.log('ITEM: ' + deletedItem);
					return async ({ result }) => {
						deletedItem = result.data.item;
						console.log(result.data.item);
						setTimeout(() => {
							groceries = result.data.groceries;
							focus = null
							count = 0
						}, 400);
						
					};
				}}
				method="POST"
				class="{item.name == deletedItem
					? 'hue-rotate-180 opacity-0 duration-300 '
					: 'opacity-100'} {focus != null && focus != item ? " brightness-50 " : ""} bg-black flex flex-row flex mx-3 sm:w-9/12 max-w-150 sm:mx-auto my-3 py-3 px-4 rounded-2xl cursor-pointer border-2 bg-linear-to-t  {focus == item ? "from-rose-900/50 to-rose-200/70 border-rose-300/50 " : "from-cyan-900/50 to-cyan-200/70 border-cyan-300/50"} truncate"
				action="?/deleteItem"
			>
				<input value={item.name} name="name" id="name" hidden />
				<button
					type="{focus == item && count >= 2 ? "submit" : "button"}"
					onclick={() => {
						if (focus != item) {
							count = 0
						}
						focus = item
						count++
						console.log(count)
					}}
					class="cursor-pointer flex flex-row items-center gap-1 w-full"
				>
					<div
						class=" relative flex flex-row text-left w-screen truncate text-ellipsis cursor-pointer"
					>
						<p class="capitalize text-cyan-100 text-xl cursor-pointer w-full truncate">
							{item.name}
						</p>
					</div>
				</button>
			</form>
		{/each}
	</div>
	<form
		class="bg-black w-screen absolute bottom-0 flex flex-row transition-all duration-600 z-50 flex py-3 px-4 mx-auto cursor-pointer bg-neutral-950/50 backdrop-blur-sm truncate transition-all duration-200"
		action="?/addItem"
	>
		<button
			onclick={() => (addItem = !addItem)}
			class="cursor-pointer flex flex-row items-center overflow-hidden w-full"
		>
			<div class=" relative flex flex-row text-center truncate text-ellipsis cursor-pointer w-full">
				<div
					class="text-neutral-300 text-2xl justify-center font-base cursor-pointer truncate flex flex-row gap-4 w-full z-10"
				>
					{#if addItem != true}
						<p>Add Item</p>
						<p>+</p>
					{:else}
						<p>Close</p>
					{/if}
				</div>
			</div>
		</button>
	</form>
</div>
