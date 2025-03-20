<script lang="ts">
    let { show }: { show: boolean } = $props()

    function toggleModal() {
        show = !show
    }

</script>

<button onclick={toggleModal} class=" z-50 absolute bg-neutral-950  border border-neutral-500 text-neutral-200 border-2 px-4 py-2 rounded-xl top-0 right-0 m-4 cursor-pointer">
    <p>Playlists</p>
</button>

<form action="?/login" method="POST" class="w-screen h-screen absolute  z-30 {!show ? "hidden" : ""}">
    <div class=" w-screen h-screen bg-opacity-50">
        <div class="border w-1/2 h-1/2  bg-opacity-50 mx-auto my-auto border-neutral-500 top-0 bottom-0 bg-neutral-950 absolute left-0 right-0 rounded-lg p-12">
            <button type="submit" class="border rounded-full py-2 px-4 border-2 border-neutral-500 bg-red-500 test-neutral-300">
                Login with Google
            </button>
        </div>
    </div>
</form>