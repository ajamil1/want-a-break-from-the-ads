<script lang="ts">
	import Login from '$lib/components/Login.svelte';
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';
    let { data } = $props();

    type track = {
        name: string,
        id: string
    }

    let username = data.name
    
    let playlists = data.playlists
    let showPlaylists = $state(false)
    let title = data.title
    let tracks = $state(data.tracks)
    let played_tracks: number[] = []
    let spotify_tracks: string[] = data.spotify_tracks
    let selectedPlaylist = data.selectedPlaylist
    let currentlyPlaying = $state("")
    let buffering = $state(false)
    let videoVsTracks = $state(true)
    let playlistID: string

    async function playTrack(name: string, id: string) {
        buffering = true
        currentlyPlaying = name
        selectedTrack.name = name
        selectedTrack.id = id
        played_tracks = []
        
        await player.loadVideoById(selectedTrack.id);

    }

    async function nextTrack() {
        let x = Math.floor(Math.random() * tracks.length);
        for (let i = 0; i <= played_tracks.length-1; i++) {
            if (played_tracks[i] == x) {
                x = Math.floor(Math.random() * tracks.length);
            }
        }
        selectedTrack = tracks[x]
        currentlyPlaying = tracks[x].name
        played_tracks.push(x)

        
        await player.loadVideoById(selectedTrack.id);
    }

    let image: string
    let description: string
    let track_total: number
    let name: string
    let selectedTrack: {
        name: ""
        id: ""
    } = $state({
        name: "",
        id: "",
    })
    let id = ""
    let form
    let paused = $state(true)
    let playerState = null


    function setSelectedPlaylist(playlist: any){
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
                'onError': onPlayerError,

            }
        });
    }

    function onPlayerReady(event) {
        buffering = false
        event.target.playVideo();
    }

    async function onPlayerError(event) {
        buffering = true
        await nextTrack()
    }

    function onPlayerBuffer(event) {
        buffering = true
    }
    

    async function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            buffering = false
            await nextTrack()
        }
        else if (event.data === YT.PlayerState.PLAYING) {
            paused = false
            buffering = false
        }
        else if (event.data === YT.PlayerState.PAUSED) {
            paused = true
            buffering = false
        }
        else if (event.data === YT.PlayerState.BUFFERING) {
            buffering = true
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
            player.seekTo(duration - 1, true);
            paused = false
        }
    }

    function videoVsTracksToggle() {  
        showPlaylists = false
        if (videoVsTracks == true) {videoVsTracks = false } 
        else {videoVsTracks = true}
    }

    function togglePlaylistModal() {
        showPlaylists = !showPlaylists
    }

    async function handleResponse({result}) {
        if (result.status === 200) {
            tracks =  [...result.data.tracks]
            showPlaylists = false
            skipToEnd()
        }
    }

    let logoutDropdown =$state(false)
    function toggleLogoutDropdown(){
        logoutDropdown = !logoutDropdown
    }


    function login() {
        window.location.href = '/auth';
    }


    // Load the YouTube IFrame API when the component mounts
    onMount(() => {
           selectedTrack = tracks[Math.floor(Math.random() * tracks.length)];
            const script = document.createElement('script');
            script.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(script);
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        } 
    );
    </script>

    



<div class=" w-full h-screen bg-black place-content-center text-center max-h-screen overflow-hidden">
    <button onclick={togglePlaylistModal} class="z-50 absolute bg-neutral-950 {paused ? "hue-rotate-[0rad]" : "hue-rotate-[4.6rad]"} {buffering && paused || buffering ? "hue-rotate-[7rad]" : ""} saturate-50 border border-2 duration-1000 z-40 bg-rose-950 border-rose-600 text-neutral-200 px-4 py-2 rounded-xl top-0 right-0 m-4 cursor-pointer">
        <p>Playlists</p>
    </button>

    <div class="top-0 left-0 m-4 flex flex-col justify-start items-left w-full">
        <button onclick={toggleLogoutDropdown} class=" rounded-xl flex flex-col items-center z-50 absolute {paused ? "hue-rotate-[0rad]" : "hue-rotate-[4.6rad]"} {buffering && paused || buffering ? "hue-rotate-[7rad]" : ""} border border-2 duration-1000 z-40 bg-rose-950 border-rose-600 text-neutral-200 px-4 py-2 rounded-xl top-0 left-0 m-4 cursor-pointer saturate-50">
            <p><span class="mr-1"></span> {username}</p>
            <a href="/" class=" {logoutDropdown == false ? "pointer-events-none cursor-default opacity-0 mt-8 " : "opacity-100 cursor-pointer mt-10 "} border border-2 w-full duration-100 z-40 absolute bg-rose-950 border-rose-600 text-neutral-200 py-2 rounded-xl">
                <p>Logout</p>
            </a>
        </button>
        
    </div>
    
    <div class="w-screen h-screen absolute duration-100 z-30 {!showPlaylists ? "pointer-events-none opacity-0" : "opacity-100"}">
        <div class=" w-screen h-screen bg-opacity-50">
            <div class="border w-1/2 h-1/2  bg-opacity-50 mx-auto my-auto border-neutral-500 top-0 bottom-0 bg-neutral-950 absolute left-0 right-0 rounded-lg p-12">
                
                <div class="flex flex-col gap-3 my-3 overflow-scroll h-11/12">
                    {#each playlists as playlist, i}
                    <form action="?/setPlaylist" method="POST"  use:enhance={() => handleResponse} data-sveltekit-reload>
                        <input class="hidden" id="playlist" name="playlist" value={playlist.id}/>
                        <button class="border cursor-pointer bg-black rounded-full px-4 py-2">
                            <p class="text-neutral-300 truncate">{playlist.snippet.title}</p>
                        </button>
                    </form>
                    {/each}
                </div>
            </div>
        </div>
    </div>
    
    {#if playlists.length == 0}
        <div class="absolute left-0 right-0 top-0 bottom-0 h-screen w-screen z-50" >
            <button onclick={login} class="cursor-pointer hover:bg-neutral-300 hover:text-black transition-all h-fit max-w-32 mx-auto my-auto absolute left-0 right-0 top-0 bottom-0 border rounded-full py-4 px-2 text-xl border border-neutral-500 bg-neutral-950 text-neutral-300">
                Login
            </button>
        </div>
    {/if}
    
    <div class=" flex flex-col items-center z-30 bg-black w-screen pt-4  {playlists.length == 0 ? "hidden" : ""}"> 
        <div class="flex flex-col gap-4 absolute bottom-0 z-30 py-5 bg-black">
            {#if selectedTrack != undefined}
            <p class="text-neutral-300 text-lg px-12 truncate font-base  z-40 bg-black w-screen font-sans">{selectedTrack.name}</p>
            {/if}
        <div class="flex flex-row  text-neutral-300 justify-center gap-5 w-screen">
            <button class="{paused ? "hue-rotate-[0rad]" : "hue-rotate-[4.6rad]"} {buffering && paused || buffering ? "hue-rotate-[7rad]" : ""} brightness-150 size-14 rounded-full bg-radial-[at_50%_50%] duration-1000 from-teal-200 via-rose-400 to-black to-90%" onclick={() => pauseOrPlay()}>
                {#if paused == true}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd" />
                  </svg>
                  {:else if buffering == true}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class=" animate-spin">
                    <path fill-rule="evenodd" d="M19.449 8.448 16.388 11a4.52 4.52 0 0 1 0 2.002l3.061 2.55a8.275 8.275 0 0 0 0-7.103ZM15.552 19.45 13 16.388a4.52 4.52 0 0 1-2.002 0l-2.55 3.061a8.275 8.275 0 0 0 7.103 0ZM4.55 15.552 7.612 13a4.52 4.52 0 0 1 0-2.002L4.551 8.45a8.275 8.275 0 0 0 0 7.103ZM8.448 4.55 11 7.612a4.52 4.52 0 0 1 2.002 0l2.55-3.061a8.275 8.275 0 0 0-7.103 0Zm8.657-.86a9.776 9.776 0 0 1 1.79 1.415 9.776 9.776 0 0 1 1.414 1.788 9.764 9.764 0 0 1 0 10.211 9.777 9.777 0 0 1-1.415 1.79 9.777 9.777 0 0 1-1.788 1.414 9.764 9.764 0 0 1-10.212 0 9.776 9.776 0 0 1-1.788-1.415 9.776 9.776 0 0 1-1.415-1.788 9.764 9.764 0 0 1 0-10.212 9.774 9.774 0 0 1 1.415-1.788A9.774 9.774 0 0 1 6.894 3.69a9.764 9.764 0 0 1 10.211 0ZM14.121 9.88a2.985 2.985 0 0 0-1.11-.704 3.015 3.015 0 0 0-2.022 0 2.985 2.985 0 0 0-1.11.704c-.326.325-.56.705-.704 1.11a3.015 3.015 0 0 0 0 2.022c.144.405.378.785.704 1.11.325.326.705.56 1.11.704.652.233 1.37.233 2.022 0a2.985 2.985 0 0 0 1.11-.704c.326-.325.56-.705.704-1.11a3.016 3.016 0 0 0 0-2.022 2.985 2.985 0 0 0-.704-1.11Z" clip-rule="evenodd" />
                  </svg>
                  
                  
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="">
                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z" clip-rule="evenodd" />
                    </svg>
                {/if}
                
            </button>
            <button class=" w-19 rounded-lg px-2 h-8 mt-3 {paused ? "hue-rotate-[0rad]" : "hue-rotate-[4.6rad]"} {buffering && paused || buffering ? "hue-rotate-[7rad]" : ""} saturate-60 text-neutral-300 brightness-150 rounded-full bg-conic-180 duration-1000 from-neutral-950 via-rose-700 to-neutral-950 to-90% cursor-pointer" onclick={() => videoVsTracksToggle()}>
                <p>{videoVsTracks == true ? "Video" : "Tracklist"}</p>
            </button>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button class="{paused ? "hue-rotate-[0rad]" : "hue-rotate-[4.6rad]"} {buffering && paused || buffering ? "hue-rotate-[7rad]" : ""} brightness-150 size-14 rounded-full bg-radial-[at_50%_50%]  duration-1000 from-teal-200 via-rose-400 to-black to-90%" onclick={() => skipToEnd()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clip-rule="evenodd" />
                  </svg>
                  
            </button>
        </div>
        
    </div>
    </div>
    <div class=" h-full  overflow-hidden">
    {#if tracks != undefined}
    <div id="player" class="text-neutral-300 w-full pointer-events-none top-0 z-0 left-0 right-0 bg-black absolute px-12 w-screen h-1/2 bottom-0 my-auto overflow-hidden">
    </div>
    <div class="h-10/12 w-screen pb-10 overflow-scroll absolute bg-black z-20 duration-400 {videoVsTracks ? "opacity-0 pointer-events-none" : ""} "   >
        {#each tracks as track}    
    <div class= "{track.name == currentlyPlaying ? "hue-rotate-[3rad]" : "hue-rotate-[1rad]"} {paused ? "hue-rotate-[3rad] saturate-0 opacity-60" : " hue-rotate-[1rad] opacity-100"} {buffering ? "hue-rotate-[4rad]" : ""} flex flex-row text-rose-400 transition-all duration-600 flex mx-3 sm:w-9/12 max-w-150 sm:mx-auto my-3 py-3 px-4 rounded-full cursor-pointer brightness-150 bg-radial-[at_50%_100%] from-teal-700  to-neutral-950 to-%100 truncate transition-all duration-200  " >
        <input type="hidden" name="query" value={selectedTrack}>
        <input type="hidden" name="tracks" value={tracks}>
        <button onclick={() => playTrack(track.name, track.id)} class="cursor-pointer flex flex-row items-center gap-1 w-full ">              
            <div class=" relative flex flex-row text-left w-screen truncate text-ellipsis cursor-pointer ">       
                <p class="text-neutral-400 text-lg font-base cursor-pointer w-10/12 truncate">{track.name}</p>
                {#if !paused}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="{track.name == currentlyPlaying ? "opacity-100" : "opacity-0"} duration-500 size-7 my-auto absolute right-0 top-0 bottom-0 text-neutral-400">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                </svg>
                {:else}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="{track.name == currentlyPlaying ? "opacity-100" : "opacity-0"} duration-500 size-7 my-auto absolute right-0 top-0 bottom-0 text-neutral-400">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
                </svg>
                {/if}
                
                </div>
            </button>
        
        </div>
        
    {/each}
    </div>
    {/if}
    </div>
</div>



