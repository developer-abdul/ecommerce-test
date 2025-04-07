'use client';

import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '.';
import { SessionProvider } from 'next-auth/react';

export const Providers = ({ children }: PropsWithChildren) => {
	return (
		<SessionProvider>
			<Provider store={store}>{children}</Provider>
		</SessionProvider>
	);
};
