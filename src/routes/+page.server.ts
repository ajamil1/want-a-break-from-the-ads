
import type { Load } from './$types';

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
    const API_KEY = process.env.YOUTUBE_API_KEY as string;
    const PLAYLIST_ID = `PLRdMBDNqSy0Q0NcuZjytIt9sxZOOhW942`
    do {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=500&pageToken=${nextPageToken}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    nextPageToken = data.nextPageToken
    console.log(nextPageToken)
    
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
