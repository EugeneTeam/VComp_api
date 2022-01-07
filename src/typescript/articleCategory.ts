import {findEntryById} from './utils/helper'

export interface IArticleCategory {
    id: number
    name: string | null
    parentId: number | null
}

export const getArticleCategoryById = async (categoryId: number): Promise<IArticleCategory | null>  => {
    return findEntryById(categoryId, 'articleCategory')
}
