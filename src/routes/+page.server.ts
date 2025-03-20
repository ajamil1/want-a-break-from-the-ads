
import type { Load } from './$types';
import { redirect } from "@sveltejs/kit";

import dotenv from 'dotenv';


dotenv.config();
let playlists: any[] = [];
type track = {
  name: string,
  id: string
}
let spotify_tracks: string[]
let tracks: track[]
let title: string = ""
let id: string = ""
let selectedPlaylist = {
  name: "",
  description: "",
  image: "",
  track_total: ""
}


async function getYoutubeVideosIDs() {
  
  try {
    tracks = [] 
    let nextPageToken = '';
    const PLAYLIST_ID = `PLRdMBDNqSy0Q0NcuZjytIt9sxZOOhW942`
    do {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=AIzaSyBpApkytNIEHrjmAzY3hxh4f0Z_fhKsG50&maxResults=500&pageToken=${nextPageToken}`);
    
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
    
    //console.log(tracks)
    return {status: 200}

  
  } catch (error) {
    console.error('Error fetching playlist items:', error);
  }
}

// export const actions = {
//   login: async() => {
//     const CLIENT_ID = process.env.YOUTUBE_CLIENT_ as string;
//     const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=http://localhost:4000/callback&response_type=token&scope=https://www.googleapis.com/auth/youtube.readonly`;
//     redirect(302, authUrl);
//   }
// }


export const load: Load = async ({ cookies }) => {

  try {
      await getYoutubeVideosIDs()

    return {playlists, tracks, selectedPlaylist, title, id, spotify_tracks};
}catch (error) {
    // Handle verification errors (e.g., token expired, invalid signature)
    console.log('Token verification failed:', error);
    return null;
  }
}
