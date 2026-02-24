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
  filePath: string;
  originalFileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

export interface MediaItem {
  id: number;
  title: string;
  platform: Platform;
  status: MediaStatus;
  releaseDate?: string;
  images?: MediaImage[];
}
