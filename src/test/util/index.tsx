import { Provider } from 'react-redux';
import React from 'react';

interface ProviderMockProps {
    children: JSX.Element
    store?: any
}

export function ProviderMock({ children, store }: ProviderMockProps) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}