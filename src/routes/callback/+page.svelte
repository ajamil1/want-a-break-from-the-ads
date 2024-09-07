<script context="module">
	import { onMount } from "svelte";
    import { goto } from '$app/navigation';
    export let data

    

    export const load = async ({ fetch }) => {
      // Trigger the action to handle the token exchange
      await fetch('/callback', { method: 'POST' });
    };


    
    
  </script>
  
  <div class=" w-full h-screen bg-black place-content-center text-center">
    <p class="text-neutral-300 text-6xl mx-2 font-bold mb-12">Redirecting...</p>
</div>
