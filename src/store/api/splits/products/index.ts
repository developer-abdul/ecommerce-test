import { Product } from '@/types';
import { baseApi } from '../..';
import { Endpoints } from '../../endpoints';

const productsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getProducts: build.query<Product[], void>({
			query: () => ({
				url: `${Endpoints.Products}`,
			}),
			providesTags: ['Products'],
		}),

		getProduct: build.query<Product, { id: string }>({
			query: ({ id }) => ({
				url: `${Endpoints.Products}/${id}`,
			}),
			providesTags: ['Products'],
		}),

		updateProduct: build.mutation<
			Product,
			{ id: string; product: Partial<Product> }
		>({
			query: ({ id, product }) => ({
				url: `${Endpoints.Products}/${id}`,
				method: 'PATCH',
				body: product,
			}),
			invalidatesTags: ['Products'],
		}),
	}),
	overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductQuery, useUpdateProductMutation } = productsApi;
