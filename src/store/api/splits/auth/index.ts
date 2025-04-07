import { baseApi } from '../..';
import { Endpoints } from '../../endpoints';

const authApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		authenticateUser: build.mutation({
			query: (data) => ({
				url: `${Endpoints.Auth}/login`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['Auth'],
		}),
	}),
	overrideExisting: false,
});

export const { useAuthenticateUserMutation } = authApi;
