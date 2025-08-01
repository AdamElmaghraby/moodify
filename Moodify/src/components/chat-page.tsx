import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MdSend } from "react-icons/md";
import clsx from "clsx";
import { useRef } from "react";
import { useAutosizeTextArea } from "@/hooks/use-autosize-textarea";
import { VercelV0Chat } from "@/components/chat-input";
import ChatBackground from "@/components/chat-background";
import { BackgroundBeams } from "./ui/background-beams";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShiningText } from "@/components/ui/shimmer-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

// Define a type for the user data we expect from the backend
interface User {
  username: string;
}

// Define types for the playlist response
interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration?: string;
}

interface PlaylistResponse {
  songs: Song[];
  description?: string;
}

const promptSuggestions = [
  "Make me a playlist for a rainy day",
  "Give me songs to focus and study",
  "Suggest upbeat tracks for a workout",
  "Chill tracks for a late night drive",
  "Songs to boost my mood",
];

const ChatPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [numTracks, setNumTracks] = useState("20");
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [parsedPlaylist, setParsedPlaylist] = useState<PlaylistResponse | null>(
    null
  );
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [playlistCreationError, setPlaylistCreationError] = useState<
    string | null
  >(null);
  const [playlistCreationSuccess, setPlaylistCreationSuccess] = useState<{
    playlist_id: string;
    playlist_url: string;
    songs_added: number;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("https://127.0.0.1:3000/api/me", {
          credentials: "include",
        });
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Did not receive user info (invalid content type)");
        }
        if (!response.ok) {
          throw new Error("You are not logged in. Please log in.");
        }
        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setSubmitting(true);
    setResponse(null);
    setRequestError(null);
    try {
      const res = await fetch("https://127.0.0.1:3000/api/generate-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt, length: Number(numTracks) }),
      });
      if (!res.ok) throw new Error("Request failed");
      const text = await res.text();
      setResponse(text);

      // Try to parse the response as JSON
      try {
        const parsed = JSON.parse(text);
        console.log("Parsed playlist data:", parsed); // Debug log
        // The backend returns a direct array of songs, not an object with songs property
        if (Array.isArray(parsed)) {
          setParsedPlaylist({ songs: parsed });
        } else if (parsed.songs && Array.isArray(parsed.songs)) {
          setParsedPlaylist(parsed);
        } else {
          // If it's not in the expected format, treat as raw response
          setParsedPlaylist(null);
        }
        setIsDialogOpen(true);
      } catch (parseError) {
        // If it's not valid JSON, just show the raw text
        setParsedPlaylist(null);
        setIsDialogOpen(true);
      }
    } catch (err) {
      setRequestError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!parsedPlaylist || !parsedPlaylist.songs) {
      setPlaylistCreationError("No playlist data available");
      return;
    }

    setIsCreatingPlaylist(true);
    setPlaylistCreationError(null);
    setPlaylistCreationSuccess(null);

    try {
      const playlistData = {
        playlist_name: `Moodify - ${prompt}`,
        songs: parsedPlaylist.songs.map((song) => ({
          title: song.title,
          artist: song.artist,
        })),
      };

      const res = await fetch("https://127.0.0.1:3000/api/create-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(playlistData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to create playlist: ${res.status} - ${errorText}`
        );
      }

      const result = await res.json();
      setPlaylistCreationSuccess(result);
    } catch (err) {
      setPlaylistCreationError((err as Error).message);
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center w-full max-w-4xl relative z-10">
          {user && (
            <h2 className="text-4xl font-bold text-black dark:text-white">
              {submitting ? (
                <ShiningText
                  text="Generating Playlist..."
                  className="text-4xl font-mono "
                  tag="span"
                />
              ) : (
                `Hello, ${user.username}!`
              )}
            </h2>
          )}
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center gap-4"
          >
            <VercelV0Chat
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onSubmit={handleSubmit}
              numTracks={numTracks}
              setNumTracks={setNumTracks}
              disabled={submitting}
            />
            {requestError && (
              <p className="text-red-500">Error: {requestError}</p>
            )}
          </form>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[60vw] max-w-none sm:max-w-none max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Playlist</DialogTitle>
            <DialogDescription>
              Here's your personalized playlist based on: "{prompt}"
            </DialogDescription>
          </DialogHeader>

          {parsedPlaylist && parsedPlaylist.songs ? (
            <div className="space-y-3">
              {parsedPlaylist.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {parsedPlaylist.description}
                </p>
              )}
              {parsedPlaylist.songs.map((song, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      {/* Song ID on the left */}
                      <div className="w-8 text-center text-sm text-muted-foreground font-medium">
                        {song.id}
                      </div>

                      {/* Title and Artist in the middle */}
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="font-semibold text-lg truncate">
                          {song.title}
                        </h3>
                        <p className="text-muted-foreground truncate">
                          {song.artist}
                        </p>
                      </div>

                      {/* Album - hidden on mobile */}
                      <div className="hidden md:block w-32 text-sm text-muted-foreground truncate">
                        {song.album}
                      </div>

                      {/* Duration on the right - hidden on mobile */}
                      <div className="hidden md:block w-16 text-right text-sm text-muted-foreground">
                        {song.duration || "--:--"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-900 text-white p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{response}</pre>
            </div>
          )}

          {/* Create Playlist Button and Status */}
          {parsedPlaylist && parsedPlaylist.songs && (
            <div className="mt-6 space-y-4">
              <Button
                onClick={handleCreatePlaylist}
                disabled={isCreatingPlaylist}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
              >
                <FontAwesomeIcon icon={faSpotify} className="text-xl" />
                {isCreatingPlaylist
                  ? "Creating Playlist..."
                  : "Create Playlist on Spotify"}
              </Button>

              {playlistCreationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">Error creating playlist:</p>
                  <p className="text-sm">{playlistCreationError}</p>
                </div>
              )}

              {playlistCreationSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-medium">
                    Playlist created successfully! 🎉
                  </p>
                  <p className="text-sm mb-2">
                    Added {playlistCreationSuccess.songs_added} songs to your
                    playlist.
                  </p>
                  <a
                    href={playlistCreationSuccess.playlist_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
                  >
                    <FontAwesomeIcon icon={faSpotify} />
                    Open in Spotify
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BackgroundBeams />
    </>
  );
};

export default ChatPage;
