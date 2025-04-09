import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '@/types';

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					// Fetch user from JSON Server
					const response = await fetch(
						`${process.env.NEXT_PUBLIC_API_URL}/users`
					);
					const users = await response.json();

					const user = users.find(
						(user: User) =>
							user.email === credentials.email &&
							user.password === credentials.password
					);

					if (!user) {
						return null;
					}

					return {
						id: user.id.toString(),
						name: user.name,
						email: user.email,
					};
				} catch (error) {
					console.error('Authentication error:', error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (token && session.user) {
				session.user.name = token.name as string;
				session.user.email = token.email as string;
			}
			return session;
		},
	},
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
	},
};

export default NextAuth(authOptions);
