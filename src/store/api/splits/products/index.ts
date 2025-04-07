import { baseApi } from '../..';
import { Endpoints } from '../../endpoints';

const productsApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getProducts: build.query({
			query: () => ({
				url: `${Endpoints.Products}`,
			}),
			providesTags: ['Products'],
		}),

		getProduct: build.query({
			query: ({ id }) => ({
				url: `${Endpoints.Products}/${id}`,
			}),
			providesTags: ['Products'],
		}),
	}),
	overrideExisting: false,
});

export const { useGetProductsQuery, useGetProductQuery } = productsApi;
