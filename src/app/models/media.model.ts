export type MediaStatus = 'BACKLOG' | 'IN_PROGRESS' | 'FINISHED';

export type ImageType =
  | 'COVER'
  | 'BACK_COVER'
  | 'SPINE'
  | 'MEDIA'
  | 'TOP'
  | 'SCREENSHOT'
  | 'MANUAL'
  | 'OTHER';

export interface Platform {
  id: number;
  name: string;
  shortName: string;
}

export interface MediaImage {
  id: number;
  imageType: ImageType;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  createdAt: string;
}

export interface MediaItem {
  id: number;
  title: string;
  platform: Platform;
  status: MediaStatus;
  releaseDate?: string;
  images?: MediaImage[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
