export type MediaType = 'GAME' | 'MOVIE' | 'SERIES';
export type MediaStatus = 'BACKLOG' | 'IN_PROGRESS' | 'FINISHED';

export interface MediaItem {
  id: number;
  title: string;
  type: MediaType;
  status: MediaStatus;
}