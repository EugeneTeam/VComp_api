import {findEntryById} from './utils/helper';

export const getArticleById = async (articleId: number): Promise<any> => {
    return findEntryById(articleId, 'article');
}
