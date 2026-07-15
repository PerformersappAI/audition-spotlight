export interface CourseChapter {
  slug: string;
  num: number;
  roman: string;
  title: string;
  desc: string;
  time: string;
  moduleKey: string;
  kicker: string;
  dek: string;
  seoTitle: string;
  seoDesc: string;
  body: string;
  takeaways: string[];
}

export interface CourseModule {
  key: string;
  label: string;
}

export interface CourseMosaicCell {
  text: string;
}

export interface Course {
  slug: string;
  title: string;
  categoryLabel: string;
  subtitle: string;
  level: string;
  chapterCount: string;
  readTime: string;
  pairsWithName: string | null;
  pairsWithUrl: string | null;
  pairsWithDesc: string | null;
  seoTitle: string;
  seoDesc: string;
  learn: string[];
  mosaic: string[];
  modules: CourseModule[];
  chapters: CourseChapter[];
}
