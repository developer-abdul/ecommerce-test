import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
	reducerPath: 'api',
	tagTypes: ['Auth', 'Products'],
	baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
	endpoints: () => ({}),
});
