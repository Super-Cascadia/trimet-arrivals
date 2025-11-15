import React from "react";
import { Provider } from "react-redux";

interface ProviderMockProps {
  children: React.ReactNode;
  store?: any;
}

export function ProviderMock({ children, store }: ProviderMockProps) {
  return <Provider store={store}>{children}</Provider>;
}
