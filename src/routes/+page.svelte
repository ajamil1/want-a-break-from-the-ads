<div class=" w-full h-screen bg-black place-content-center text-center max-h-screen overflow-hidden">
    <div class="absolute left-0 right-0 top-0 bottom-0 h-screen w-screen z-50 flex flex-col " >
        <button onclick={ () => window.location.href = '/auth'} class="cursor-pointer hover:bg-neutral-300 hover:text-black transition-all h-fit max-w-32 mx-auto my-auto absolute left-0 right-0 top-0 bottom-0 border rounded-full py-4 px-2 text-xl border border-neutral-500 bg-neutral-950 text-neutral-300">
            Login
        </button>
        <button onclick={ () => window.location.href = '/privacy'} class=" cursor-pointer hover:text-blue-800 transition-all h-fit max-w-32 mx-auto my-auto absolute left-0 right-0 top-26 bottom-0 text-sm text-neutral-600">
            Privacy Policy
        </button>
        <button onclick={ () => window.location.href = '/tos'} class=" cursor-pointer hover:text-blue-800 transition-all h-fit max-w-32 mx-auto my-auto absolute left-0 right-0 top-39 bottom-0 text-sm text-neutral-600">
            Terms of Service
        </button>
    </div> 
</div>