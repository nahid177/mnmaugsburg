// src/interfaces/InformationTypes.ts

export interface Media {
    image: string | File | null;
    video: string | File | null;
  }
  
  export interface BigTitleItem {
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
    _id: string; // If you're converting ObjectId to string
    name: string;
    nameColor?: string;
    content: CategoryContentItem[];
  }
  
  export interface InformationData {
    _id: string; // Added _id property
    typename: string;
    typenameColor?: string;
    bigTitleName: string;
    bigTitleNameColor?: string;
    bigTitle: BigTitleItem[];
    categories?: Category[];
  }
  
  export interface APIResponse<T> {
    success: boolean;
    data: T;
    error?: string;
  }
  