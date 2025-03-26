
import type { Load } from './$types';
import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();
let playlists: any[] = [];
type track = {
  name: string,
  id: string
}

let tracks: track[]
let selectedPlaylist = {
  name: "",
  description: "",
  image: "",
  track_total: ""
}


async function getYoutubeVideosIDs(playlist_id) {
  try {
    tracks = [] 
    let nextPageToken = '';
    do {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist_id}&key=AIzaSyBpApkytNIEHrjmAzY3hxh4f0Z_fhKsG50&maxResults=500&pageToken=${nextPageToken}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    nextPageToken = data.nextPageToken
    
    await data.items.forEach((item) => {
      if (item.snippet && item.snippet.resourceId) {
        tracks.push({
          name: item.snippet.title,
          id: item.snippet.resourceId.videoId
        });
      }
    });

    } while (nextPageToken)
    
    return {status: 200}

  
  } catch (error) {
    console.error('Error fetching playlist items:', error);
  }
}

async function getUserPlaylists(accessToken: string){
  const response = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true', {
    headers: { Authorization: `Bearer ${accessToken}` }
});

if (!response.ok) {
    return json({ error: 'Failed to fetch playlists' }, { status: response.status });
}

const data = await response.json();

playlists = data.items
selectedPlaylist = playlists[0]
await getYoutubeVideosIDs(selectedPlaylist.id)
}

export const actions = {
  setPlaylist: async ({ request }) => {
      const formData = await request.formData();
      const playlist = formData.get('playlist');
      await getYoutubeVideosIDs(playlist)
      return {tracks };
  }
};

export const load: Load = async ({ locals }) => {
let auth
let title
  try {
        const name = locals.user.name
        
        const accessToken = locals.user.accessToken
        if (!accessToken) { auth = false }
        else { 
          auth = true
          await getUserPlaylists(accessToken)
          title = playlists[0].snippet.title
      }

    return {playlists, tracks, selectedPlaylist, title, auth, name };
} catch (error) {
    console.log('Token verification failed:', error);
    return {playlists, tracks, selectedPlaylist, title, auth};
  }
}
