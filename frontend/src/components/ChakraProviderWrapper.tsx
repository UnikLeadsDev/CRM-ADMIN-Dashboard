import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface ChakraProviderWrapperProps {
    children: ReactNode;
}

export const ChakraProviderWrapper = ({ children }: ChakraProviderWrapperProps) => {
    return (
        <ChakraProvider>
            {children}
        </ChakraProvider>
    );
};