<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { data } = $props();
	let deletedItem = $state();
	let addItem = $state(false);
	let groceries = $state(data.groceries);
	let found = $state(false);

	onMount(() => {
		console.log("test")
		while ((found == false)) {
			try {
				console.log(found)
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
				found = true
				
			} catch (error) {
				console.log(error)
			}
		}
	});

	$effect(() => {
		groceries = data.groceries;
	});
</script>

<div class="w-full h-full bg-black overflow-hidden">
	<div
		class="backdrop-blur-md bg-black/50 absolute right-0 left-0 w-full h-full px-4 z-40 {addItem == true
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
		{#each groceries as item}
			<form
				use:enhance={() => {
					console.log('ITEM: ' + deletedItem);
					return async ({ result }) => {
						deletedItem = result.data.item;
						console.log(result.data.item);
						setTimeout(() => {
							groceries = result.data.groceries;
						}, 500);
					};
				}}
				method="POST"
				class="{item.name == deletedItem
					? 'hue-rotate-180 opacity-0 duration-600 '
					: 'opacity-100'}  bg-black flex flex-row flex mx-3 sm:w-9/12 max-w-150 sm:mx-auto my-3 py-3 px-4 rounded-2xl cursor-pointer border-2 bg-linear-to-t from-cyan-900/50 to-cyan-200/70 border-cyan-300/50 truncate"
				action="?/deleteItem"
			>
				<input value={item.name} name="name" id="name" hidden />
				<button
					type="submit"
					onclick={() => console.log(item.name)}
					class="cursor-pointer flex flex-row items-center gap-1 w-full"
				>
					<div
						class=" relative flex flex-row text-left w-screen truncate text-ellipsis cursor-pointer"
					>
						<p class="capitalize text-cyan-100 text-2xl cursor-pointer w-full truncate">
							{item.name}
						</p>
					</div>
				</button>
			</form>
		{/each}
		<form
			class="bg-black flex flex-row transition-all duration-600 flex mx-3 sm:w-9/12 max-w-150 sm:mx-auto my-3 py-3 px-4 rounded-2xl cursor-pointer border-2 bg-white border-black truncate transition-all duration-200"
			action="?/addItem"
		>
			<button
				onclick={() => (addItem = true)}
				class="cursor-pointer flex flex-row items-center gap-1 w-full"
			>
				<div
					class=" relative flex flex-row text-center w-screen truncate text-ellipsis cursor-pointer"
				>
					<div
						class="text-black text-2xl justify-center font-base cursor-pointer w-full truncate flex flex-row gap-4"
					>
						<p>Add Item</p>
						<p>+</p>
					</div>
				</div>
			</button>
		</form>
	</div>
</div>
