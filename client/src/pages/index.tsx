import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Main from '../components/main'

export default function Home() {

const config = {
  initialColorMode: "light",
  useSystemColorMode: false, // set to true if you want to use the system color mode
};

const theme = extendTheme({ config });

    return (
      <main>
          <ChakraProvider theme={theme} >
            <Main />
          </ChakraProvider>
        </main>

    );
};
