// src/interfaces/InformationTypes.ts

export interface Media {
  image: string | File | null;
  video: string | File | null;
}

export interface BigTitleItem {
  _id: string; // Ensured as string

  title: string;
  titleColor?: string;
  detail: string;
  detailColor?: string;
  subtitle?: string[];
  subtitleColor?: string;
  subdetail?: string[];
  subdetailColor?: string;
  media: Media;
}

export interface CategoryContentItem {
  _id: string; // Ensured as string

  title: string;
  titleColor?: string;
  detail: string;
  detailColor?: string;
  subtitle?: string[];
  subtitleColor?: string;
  subdetail?: string[];
  subdetailColor?: string;
  media: Media;
}

export interface Category {
  _id: string; // Ensured as string
  name: string;
  nameColor?: string;
  content: CategoryContentItem[];
}

export interface InformationData {
  _id: string; // Ensured as string
  typename: string;
  typenameColor?: string;
  bigTitleName: string;
  bigTitleNameColor?: string;
  bigTitle: BigTitleItem[];
  categories?: Category[];
}

export type Content = {
  _id: string; // Changed from Types.ObjectId | undefined to string
  title: string;
  titleColor?: string;
  detail: string;
  detailColor?: string;
  subtitle?: string[];
  subtitleColor?: string;
  subdetail?: string[];
  subdetailColor?: string;
  media?: Media;
};

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export type IModel = InformationData;
