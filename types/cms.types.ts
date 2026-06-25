export interface IPage {
  _id: string;
  name?: string;
  slug?: string;
  content?: string;
  description?: string;
  status?: string;
}

export interface IPost {
  _id: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: { url?: string };
  author?: string;
  tagIds?: string[];
  status?: string;
  publishedDate?: string;
}

export interface ICategoryPost {
  _id: string;
  name?: string;
  slug?: string;
  parentId?: string;
  order?: string;
}
