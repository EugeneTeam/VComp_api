import {findEntry} from './utils/helper';

export enum ArticleStatus {
    VISIBLE = 'VISIBLE',
    HIDDEN = 'HIDDEN'
}

export interface IArticle {
    id: number
    articleCategoryId: number
    title: string
    text: string
    image: string
    status: ArticleStatus
    source: string | null
}

export const getArticle = async (articleId: number): Promise<IArticle| null> => {
    return findEntry(articleId, 'article');
}
