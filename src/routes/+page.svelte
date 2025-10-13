<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	let { data } = $props();
	let deletedItem = $state();

	let addItem = $state(false);
	let groceries = $state(data.groceries);
	$effect(() => {
		groceries = data.groceries;
	});
</script>

<div class="w-full h-full bg-black overflow-hidden">
	<div
		class="absolute backdrop-blur-md bg-black/50 w-screen h-screen left-0 top-0 z-30 {addItem ==
		true
			? 'opacity-100'
			: 'hidden opacity-0'}"
	>
		<form
			action="?/addItem"
			use:enhance={() => {
                deletedItem = null
				addItem = false;
			}}
			method="POST"
		>
			<input type="submit" hidden />
			<input
				name="name"
				id="name"
				class="bg-black flex flex-row transition-all duration-600 flex mx-3 sm:w-9/12 max-w-150 sm:mx-auto my-3 py-3 px-4 rounded-2xl cursor-pointer border-2 bg-neutral-500/15 border-neutral-500 truncate transition-all duration-200 mx-auto mt-60 text-neutral-100 text-3xl"
				placeholder="Enter Item Name"
			/>
		</form>
	</div>
	<div class="h-full w-screen bg-black pb-10 overflow-scroll absolute z-20 duration-400">
		{#each groceries as item}
			<form
				use:enhance={() => {
					console.log("ITEM: " +  deletedItem);
					return async ({ result }) => {
                        deletedItem = result.data.item
                        console.log(result.data.item)
						setTimeout(() => {
							groceries = result.data.groceries;
						}, 500);
					};
				}}
				method="POST"
				class="{item.name == deletedItem
					? 'hue-rotate-180 opacity-0 duration-500 '
					: 'opacity-100'}  bg-black flex flex-row flex mx-3 sm:w-9/12 max-w-150 sm:mx-auto my-3 py-3 px-4 rounded-2xl cursor-pointer border-2 bg-emerald-500/15 border-emerald-500 truncate "
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
						<p class="text-emerald-500 text-2xl cursor-pointer w-full truncate">
							{item.name}
						</p>
					</div>
				</button>
			</form>
		{/each}
		<form
			class="bg-black flex flex-row transition-all duration-600 flex mx-3 sm:w-9/12 max-w-150 sm:mx-auto my-3 py-3 px-4 rounded-2xl cursor-pointer border-2 border-dashed bg-rose-500/15 border-rose-500 truncate transition-all duration-200"
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
						class="text-rose-500 text-2xl justify-center font-base cursor-pointer w-full truncate flex flex-row gap-4"
					>
						<p>Add Item</p>
						<p>+</p>
					</div>
				</div>
			</button>
		</form>
	</div>
</div>
