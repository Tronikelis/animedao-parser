import { AxiosVideos } from "./types";
import { Anime, SearchAnime, RecentEpisodes, Upcoming } from "./types";
declare const search: (key: string) => Promise<SearchAnime[]>;
declare const getAnime: (slug: string) => Promise<Anime>;
declare const getVideo: (id: string | number) => Promise<AxiosVideos>;
declare const recent: () => Promise<RecentEpisodes[]>;
declare const upcoming: () => Promise<Upcoming[]>;
export { search, getAnime, getVideo, recent, upcoming };
