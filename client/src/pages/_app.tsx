
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineProviderProps,
} from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getCookie, setCookie } from 'cookies-next'
import type { AppContext, AppProps } from 'next/app'
import NextApp from 'next/app'
import { useMemo, useState } from 'react'

import { Navbar } from '@/core/components/navbar'
import { COLOR_SCHEME_COOKIE } from '@/core/constants/strings'

export default function App({
  Component,
  pageProps,
  colorScheme: colorSchemeProp,
}: AppProps & { colorScheme: ColorScheme }) {
  const [queryClient] = useState(() => new QueryClient())
  const [colorScheme, setColorScheme] = useState<ColorScheme>(colorSchemeProp)

  const mantineTheme = useMemo<MantineProviderProps['theme']>(
    () => ({
      colorScheme,
      primaryColor: 'grape',
      globalStyles: () => ({
        body: {
          minHeight: '100vh',
        },
      }),
    }),
    [colorScheme]
  )

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value ?? (colorScheme === 'dark' ? 'light' : 'dark')
    setColorScheme(nextColorScheme)
    setCookie(COLOR_SCHEME_COOKIE, nextColorScheme)
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={mantineTheme} withGlobalStyles withNormalizeCSS>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools />
          <Navbar />
          <Component {...pageProps} />
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext)
  return {
    ...appProps,
    colorScheme: getCookie(COLOR_SCHEME_COOKIE, appContext.ctx) ?? 'dark',
  }
}
