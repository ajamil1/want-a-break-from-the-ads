<script lang="ts">
	import { redirect } from '@sveltejs/kit';
    import { onMount } from 'svelte';
    export let data
    let state = Math.random().toString(36).substring(2, 15);

    type track = {
        name: string,
        id: string
    }
    
    let playlists = data.playlists
    let tracks: track[] = data.tracks
    let played_tracks: number[] = []
    let spotify_tracks: string[] = data.spotify_tracks
    let selectedPlaylist = data.selectedPlaylist
    let playlistID: string
    
    //console.log(tracks)

    async function nextTrack() {
        let x = Math.floor(Math.random() * tracks.length);
        for (let i = 0; i <= played_tracks.length-1; i++) {
            if (played_tracks[i] == x) {
                x = Math.floor(Math.random() * tracks.length);
            }
        }
        selectedTrack = tracks[x]
        played_tracks.push(x)
        console.log(played_tracks)
        await player.loadVideoById(selectedTrack.id);
    }

    let image: string
    let description: string
    let track_total: number
    let name: string
    let selectedTrack: {
        name: ""
        id: ""
    }
    let title = data.title
    let id = ""
    let form
    let paused = false
    let playerState = null
    //console.log(id)

    function setSelectedPlaylist(playlist: any){
        console.log(playlist)
        playlistID = playlist.id
        image = playlist.images[0].url
        description = playlist.description
        track_total = playlist.tracks.total
        name = playlist.name
    }

    let player;

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            videoId: selectedTrack.id, // Replace with your video ID
            playerVars: {
                'controls': 0,  // Hide controls
                'autoplay': 1,  // Optional: Auto-play the video
                'rel': 0,       // Prevent related videos from showing after playback
                'modestbranding': 1 // Minimal YouTube branding
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    }

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    async function onPlayerError(event) {
        await nextTrack()
    }
    

    async function onPlayerStateChange(event) {
        //console.log(event)
        if (event.data === YT.PlayerState.ENDED) {
            console.log('Audio has ended.');
            await nextTrack()
            
        }
    }

    function pauseOrPlay() {
        if (paused == false) {
            paused = true
            player.pauseVideo();
        }
        else {
            paused = false
            player.playVideo();
        }
    }

    function skipToEnd() {
        if (player) {
            const duration = player.getDuration();
            player.seekTo(duration - 1, true); // Seek to the last second of the video
        }
    }


    // Load the YouTube IFrame API when the component mounts
    onMount(() => {
           selectedTrack = tracks[Math.floor(Math.random() * tracks.length)];
           console.log(tracks)
           console.log(spotify_tracks)
            const script = document.createElement('script');
            script.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(script);
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        } 
    );
    </script>



<div class=" w-full h-screen bg-black place-content-center text-center max-h-screen overflow-scroll overflow-x-hidden">
    {#if playlists == undefined}
        <p class="text-neutral-300 text-6xl mx-2 font-bold mb-12">Want a break from the ads?</p>
        <form method="POST" action="?/loginSpotify">
            <input type="hidden" name="state" value={state} />
            <button type="submit" class="p-3 rounded-3xl border border-emerald-500 bg-neutral-900 font-medium text-neutral-500 text-emerald-500 hover:text-neutral-300 hover:bg-emerald-500 duration-150 ">
                <p>Login to Spotify</p>
            </button>
        </form>
    {:else if spotify_tracks == undefined}
    <form method="POST" action="?/getPlaylistTracks">
        <input type="hidden" name="playlistID" value={playlistID}>
        <input type="hidden" name="playlistImage" value={image}>
        <input type="hidden" name="playlistName" value={name}>
        <input type="hidden" name="playlistDescription" value={description}>
        <input type="hidden" name="playlistTrackTotal" value={track_total}>
        {#each playlists as playlist}
        
        <div class= "flex flex-row gap-3 place-content-start text-right mx-5 bg-neutral-900 my-5 rounded-lg duration-300 shadow-xl hover:bg-neutral-700">
            <button type="submit" on:click={() => setSelectedPlaylist(playlist)} class="flex flex-row items-center gap-1 w-full ">
                <img src ={playlist.images[0].url} class="h-24 w-24 rounded-l-lg "/>
                <div class="flex flex-col text-left  mx-2 w-48 truncate text-ellipsis">       
                    {#if playlist.name == ""} <p class="text-neutral-300 text-lg font-bold">Unnamed Playlist</p>
                    {:else} <p class="text-neutral-300 text-lg font-bold ">{playlist.name}</p>
                    {/if}
                    <p class="text-neutral-400 mr-5 ">{playlist.description}</p>
                    <p class="text-neutral-400 mr-5 ">{playlist.tracks.total} tracks</p>
                </div>
            </button>
        </div>
        {/each}
    </form>
    
    {:else if spotify_tracks != undefined}
    <button class= "flex flex-row gap-3 place-content-start text-right mx-5 bg-neutral-900 rounded-lg duration-300 shadow-xl hover:bg-neutral-700 top-0 mt-5 z-20">
        <button class="flex flex-row items-center top-0 mr-12 ">
            <img src ={selectedPlaylist.image} class="h-24 w-24 rounded-l-lg "/>
            <div class="flex flex-col text-left  mx-2 w-48 truncate text-ellipsis">       
                {#if selectedPlaylist.name == ""} <p class="text-neutral-300 text-lg font-bold">Unnamed Playlist</p>
                {:else} <p class="text-neutral-300 text-lg font-bold ">{selectedPlaylist.name}</p>
                {/if}
                <p class="text-neutral-400 mr-5 ">{selectedPlaylist.description}</p>
                <p class="text-neutral-400 mr-5 ">{selectedPlaylist.track_total} tracks</p>
            </div>
        </button>
    </button>
    <div class="fixed bottom-0 flex flex-col z-20 w-full">
        <!-- <form bind:this={form} method="POST" action="?/getPlaylistTracks">
            <input type="hidden" name="query" value={selectedTrack}>
            <input type="hidden" name="tracks" value={tracks}>
            <button type="submit" action="?/getYoutubeVideo" class="text-emerald-300 text-2xl bg-emerald-900 px-3 py-2 hover:border-neutral-500 border border-black hover:text-green-400 duration-150 w-full">Start Listening</button>
        </form> -->
        
        <button on:click={() => spotify_tracks = undefined} class="text-rose-300 text-2xl bg-rose-900 px-3 py-2 hover:border-neutral-500 border border-black hover:text-neutral-400 duration-150 w-full">Back to Playlists</button>
    </div>
    
    <div class="z-0 bg-black pb-40 pt-12 flex flex-col items-center"> 
        <div id="player" class="text-neutral-300 px-12 w-full h-96 pt-12   pointer-events-none">
        </div>
        {#if selectedTrack != undefined}
        <p class="text-neutral-300 text-lg mx-2 font-bold mb-4">{selectedTrack.name}</p>
        {/if}
        <div class="flex flex-row  text-neutral-300 justify-center gap-2 mb-4">
            <button on:click={() => pauseOrPlay() }>{paused ? "" : ""}
                {#if paused == true}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-14">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd" />
                  </svg>
                  
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-14">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z" clip-rule="evenodd" />
                    </svg>
                {/if}
                
            </button>
            <button on:click={() => skipToEnd()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-14">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clip-rule="evenodd" />
                  </svg>
                  
            </button>
        </div>
        
        
    </div>
    
        {#each spotify_tracks as track}
        
        <div class= "flex flex-row gap-3 place-content-start text-right mx-5 bg-neutral-900 my-1 rounded-sm my-5 duration-300 shadow-xl hover:bg-neutral-700">
            <input type="hidden" name="query" value={selectedTrack}>
            <input type="hidden" name="tracks" value={tracks}>
            <button class="flex flex-row items-center gap-1 w-full ">              
                <div class="flex flex-col text-left  mx-2 w-screen truncate text-ellipsis">       
                    <p class="text-neutral-400 text-lg font-base font-mono">{track}</p>
                    </div>
                </button>
            
            </div>
            
        {/each}
    
    {/if}
</div>


