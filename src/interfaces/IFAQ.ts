// src/interfaces/IFAQ.ts

import mongoose from "mongoose";

export interface IFAQ {
    _id: string;
    question: string;
    answer: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface IFAQFromDB {
    _id: mongoose.Types.ObjectId;
    question: string;
    answer: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  