import { baseApi } from '../..';
import { Endpoints } from '../../endpoints';
import { Category } from '@/types';

const categoriesApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getCategories: build.query<Category[], void>({
			query: () => ({
				url: `${Endpoints.Categories}`,
			}),
			providesTags: ['Categories'],
		}),

		getCategory: build.query<Category, { id: string }>({
			query: ({ id }) => ({
				url: `${Endpoints.Categories}/${id}`,
			}),
			providesTags: ['Categories'],
		}),
	}),
	overrideExisting: false,
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = categoriesApi; 