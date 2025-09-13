import type { ReactNode } from 'react';

interface ChakraProviderWrapperProps {
    children: ReactNode;
}

export const ChakraProviderWrapper = ({ children }: ChakraProviderWrapperProps) => {
    return <>{children}</>;
};