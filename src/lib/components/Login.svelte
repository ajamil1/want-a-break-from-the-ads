<script lang="ts">
    import { enhance } from '$app/forms';
    let { show, playlists, tracks, title }: { show: boolean, playlists: any[], tracks: any[], title: string } = $props()

    function togglePlaylistModal() {
        show = !show
    }

    function handleResponse({result}) {
        if (result.type === 'success') {
            tracks =  result.data.tracks
            console.log(tracks)

        }
    }

    function login() {
        window.location.href = '/auth';
    }


</script>

<button onclick={togglePlaylistModal} class=" z-50 absolute bg-neutral-950  border border-neutral-500 text-neutral-200 border-2 px-4 py-2 rounded-xl top-0 right-0 m-4 cursor-pointer">
    <p>Playlists</p>
</button>

<div class="w-screen h-screen absolute  z-30 {!show ? "hidden" : ""}">
    <div class=" w-screen h-screen bg-opacity-50">
        <div class="border w-1/2 h-1/2  bg-opacity-50 mx-auto my-auto border-neutral-500 top-0 bottom-0 bg-neutral-950 absolute left-0 right-0 rounded-lg p-12">
            {#if playlists.length == 0}
            <button onclick={login} class="border rounded-full py-2 px-4 border-2 border-neutral-500 bg-red-500 test-neutral-300">
                Login with Google
            </button>
            {/if}
            <div class="flex flex-col gap-3 my-3 overflow-scroll h-11/12">
                {#each playlists as playlist, i}
                <form action="?/setPlaylist" method="POST" use:enhance={() =>handleResponse}>
                    <input class="hidden" id="playlist" name="playlist" value={playlist.id}/>
                    <button type="submit" class="border bg-black rounded-full px-4 py-2">
                        <p class="text-neutral-300">{playlist.snippet.title}</p>
                    </button>
                </form>
                {/each}
            </div>
        </div>
    </div>
</div>