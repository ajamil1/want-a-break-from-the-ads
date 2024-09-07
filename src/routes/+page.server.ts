import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { Load } from './$types';
import Cookies from 'js-cookie'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Fuse from 'fuse.js';

dotenv.config();
let jwt: any
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




async function getUserPlaylists(accessToken: string) {
  try {
    
    let url = 'https://api.spotify.com/v1/me/playlists';
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      let count = 0
      if (playlists.length != 0) {
        count = playlists.length
      }
      playlists = playlists.concat(data.items);
      url = data.next; // Get the URL for the next page
      hasNextPage = !!url; // Continue if there's another page

      let i = playlists.length-1
      while (count >= 0) {
        playlists.splice([i], 1);
        count--
        i--
      }
    }
    
  } catch (error) {
    return error;
  }
}

async function getPlaylistTracks(accessToken: string, playlistId: string) {
  let songs: any[] = [];
  spotify_tracks = []
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching tracks for playlist ${playlistId}: ${response.status}`);
    }

    const data = await response.json();
    songs = songs.concat(data.items.map((item: any) => item.track));
    //console.log(tracks)
    url = data.next; // Get the URL for the next page
    hasNextPage = !!url; // Continue if there's another page
  }

  let artists = ""
  let song: spotifyTrack

  for(let i = 0; i <= songs.length-1; i++) {
    //console.log(tracks[i].name)
    for(let j = 0; j <= songs[i].artists.length-1; j++) {
      //console.log(tracks[i].artists[j].name)
      artists = artists + songs[i].artists[j].name + ", " 
    }
    artists = artists.substring(0, artists.length - 2);
    song = artists + " - " + songs[i].name 
    
    //console.log(song)
    spotify_tracks.push(song)
    tracks = spotify_tracks
    artists = ""
  }

  //console.log(spotify_tracks)
  await getYoutubeVideosIDs()
  return {status: 200}
}

export const load: Load = async ({ cookies }) => {
  const secretKey = process.env.JWT_SECRET as string;
  const token = cookies.get('auth_token')
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);

    if (decoded && typeof decoded === 'object') {
      // Access the payload (data part of the JWT)
      const access_token = decoded.access_token;
      
      await getUserPlaylists(access_token)
    
      //console.log(spotify_tracks)
      //console.log(tracks)

    return {playlists, tracks, selectedPlaylist, title, id, spotify_tracks};
  } 
}catch (error) {
    // Handle verification errors (e.g., token expired, invalid signature)
    console.log('Token verification failed:', error);
    return null;
  }
}
  

export const actions: Actions = {
  getPlaylistTracks: async ({ request, cookies }) => {
    const formData = await request.formData()
    selectedPlaylist = {
      name: formData.get('playlistName') as string,
      description: formData.get('playlistDescription') as string,
      image: formData.get('playlistImage') as string,
      track_total: formData.get('playlistTrackTotal') as string
    }
    
    const playlistID = formData.get('playlistID') as string
    //console.log(playlistID)
    const secretKey = process.env.JWT_SECRET as string;
    const token = cookies.get('auth_token')
    try {
      // Verify and decode the token
      const decoded = jwt.verify(token, secretKey);
  
      if (decoded && typeof decoded === 'object') {
        // Access the payload (data part of the JWT)
        const access_token = decoded.access_token;
        
        await getPlaylistTracks(access_token, playlistID) 
  
      }
      
      
  } 
  catch (error) {
      // Handle verification errors (e.g., token expired, invalid signature)
      console.log('Token verification failed:', error);
      return null;
    }
  },
  
  loginSpotify: async ({ request }) => {
    const formData = await request.formData();
    const state = formData.get('state') as string;

    const params = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID as string,
      response_type: 'code',
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string,
      state: state,
      scope: 'user-read-private user-read-email playlist-read-private',
    });

    throw redirect(302, `https://accounts.spotify.com/authorize?${params.toString()}`);
  },
  getYoutubeIDs: async({ url, request })  => {
    const api_key = process.env.YOUTUBE_API_KEY as string;
    const playlistId = 'PLRdMBDNqSy0S5yhcUcas6PxgZG7Ywlspt';
    const maxResults = 1; // Adjust as needed

    const formData = await request.formData();
    const query = formData.get('query') as string;

    searchVideoByTitle(query)
    
  }
};
