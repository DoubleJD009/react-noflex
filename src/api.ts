const API_KEY = "b19d30b8c8f394c32043be94a3017a9b";
const LANGUAGE = "ko-KO";
const REGION = "KR";

const BASE_PATH = "https://api.themoviedb.org/3";
const BASE_PARAM = `api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`;

export enum TYPES {
  "LATEST" = "latest",
  "POPULAR" = "popular",
  "TOP_RATED" = "top_rated",
  "UPCOMING" = "upcoming",
}

export enum TYPES_TV {
  "LATEST" = "latest",
  "AIRING_TODAY" = "airing_today",
  "POPULAR" = "popular",
  "TOP_RATED" = "top_rated",
}
export interface IResult {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
}
  
export interface IGetBaseResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IResult[];
  total_pages: number;
  total_results: number;
}

export interface IGetMovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: [
    {
      id: number;
      logo_path: string;
      name: string;
      origin_country: string;
    }
  ];
  production_countries: [
    {
      iso_3166_1: string;
      name: string;
    }
  ];
  release_date?: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface ITvShow {
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ITvShows {
  page: number;
  results: ITvShow[];
  total_pages: number;
}

export interface ITvShowsDetail {
  adult: boolean;
  backdrop_path: string;
  episode_run_time: [number];
  first_air_date: string;
  last_air_date: string;
  genres: [
    {
      id: number;
      name: string;
    }
  ];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: [string];
  networks: [
    {
      name: string;
      id: number;
      logo_path: string;
      origin_country: string;
    }
  ];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: [string];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;

  vote_average: number;
  vote_count: number;
  release_date?: string;
}

export interface IGetSearchResult {
  page: number;
  results: ISearch[]; 
  total_pages: number;
  total_results: number;
}
interface ISearch {
  id: number;
  overview: string;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type: string;
}

export function getMoviesLatest(type: TYPES): Promise<IResult> {
  return fetch(`${BASE_PATH}/movie/${type}?${BASE_PARAM}`).then(
    (response) => response.json()
  );
}

export function getMovies(type: TYPES): Promise<IGetBaseResult> {
  return fetch(`${BASE_PATH}/movie/${type}?${BASE_PARAM}`).then(
    (response) => response.json()
  );
}

export async function getMovieDetail(movieId: string | undefined) {
  if(!movieId) return null;
  return (
    await fetch(
      `${BASE_PATH}/movie/${movieId}?${BASE_PARAM}`
    )
  ).json();
}

export async function getTvShowsLatest(type: TYPES_TV): Promise<IResult> {
  return (
    await fetch(
      `${BASE_PATH}/tv/${type}?${BASE_PARAM}`
    )
  ).json();
}

export async function getTvShows(type: TYPES_TV): Promise<IGetBaseResult> {
  return (
    await fetch(
      `${BASE_PATH}/tv/${type}?${BASE_PARAM}&page=1`
    )
  ).json();
}

export async function getTvShowsDetail(tvId: string | undefined) {
  return (
    await fetch(`${BASE_PATH}/tv/${tvId}?${BASE_PARAM}`)
  ).json();
}

export async function getSearchResult(keyword: string, type:string): Promise<IGetSearchResult> {
  return (
    await fetch(
      `${BASE_PATH}/search/${type}?${BASE_PARAM}&query=${keyword}`
    )
  ).json();
}