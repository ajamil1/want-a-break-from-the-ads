
import type { Load } from './$types';
import { prisma } from '$lib/server/database';
import { json, redirect } from '@sveltejs/kit';
import dotenv from 'dotenv';

dotenv.config();
let playlists: any[] = [];
type track = {
  name: string,
  id: string
}

let selectedPlaylistIndex: any = null

let tracks: track[]
let selectedPlaylist = {
  name: "",
  description: "",
  image: "",
  track_total: ""
}


async function getYoutubeVideosIDs(playlist_id: string, accessToken: string) {
  try {
    tracks = [] 
    let nextPageToken = '';
    do {
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist_id}&key=AIzaSyBpApkytNIEHrjmAzY3hxh4f0Z_fhKsG50&maxResults=500&pageToken=${nextPageToken}`;

      const response = await fetch(url, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Accept": "application/json"
          }
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    nextPageToken = data.nextPageToken
    
    await data.items.forEach((item, i) => {
      if (item.snippet && item.snippet.resourceId) {
        tracks.push({
          name: item.snippet.title,
          id: item.snippet.resourceId.videoId
        });
      }
    });

    } while (nextPageToken)
    
    return {tracks}

  
  } catch (error) {
    console.error('Error fetching playlist items:', error);
  }
}

async function getUserPlaylists(accessToken: string, index?: number){
  if (!index) {index = 0}
  
  try {
    const response = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });



  if (!response.ok) {
    return json({ error: 'Failed to fetch playlists' }, { status: response.status });
  }

  const data = await response.json();

  playlists = data.items
  selectedPlaylist = playlists[index]
  selectedPlaylistIndex = index

  await getYoutubeVideosIDs(selectedPlaylist.id, accessToken)
 }
  catch(e) {
    console.log(e)
  }
}

export const actions = {
  setPlaylist: async ({ request, url }) => {
    const userID = url.pathname.split('/').slice(0).join('/').slice(6)
    const user = await prisma.user.findUnique({
      where: { id: userID },  // Check if a user with this id exists
    });
    const accessToken: string = user?.accessToken
    const formData = await request.formData();
    const index = formData.get('index');
    await getUserPlaylists(accessToken, index)
    return {tracks, selectedPlaylist};
  }
};

export const load: Load = async ({ locals, url, cookies }) => {
  let auth
  let title
  const userID = url.pathname.split('/').slice(1).join('/').slice(5)
  const cookie = cookies.get('userId');
  if (cookie != userID) {
    console.log("ID MISMATCH: " + cookie + " != " + userID);
    return redirect(302, '/');
  }
  const user = await prisma.user.findUnique({
    where: { id: userID },  // Check if a user with this id exists
});
  try {
        const name = user?.name
        const accessToken = user?.accessToken
        
        if (!accessToken) { auth = false }
        else { 
          auth = true
          await getUserPlaylists(accessToken)
      }

    return {playlists, tracks, selectedPlaylistIndex, auth, name };
} catch (error) {
    console.log('Token verification failed:', error);
    return {playlists, tracks, selectedPlaylist, title, auth};
  }
}
