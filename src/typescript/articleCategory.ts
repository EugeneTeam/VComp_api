import {findEntry} from './utils/helper'

export interface IArticleCategory {
    id: number
    name: string | null
    parentId: number | null
}

export const getArticleCategory = async (categoryId: number): Promise<IArticleCategory | null>  => {
    return findEntry(categoryId, 'article')
}
