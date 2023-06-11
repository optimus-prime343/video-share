import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  MantineProviderProps,
} from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getCookie, setCookie } from 'cookies-next'
import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import type { AppContext, AppProps } from 'next/app'
import NextApp from 'next/app'
import { useMemo, useState } from 'react'

import { Navbar } from '@/core/components/layouts/navbar'
import { COLOR_SCHEME_COOKIE } from '@/core/constants/strings'

dayjs.extend(RelativeTime)
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
      components: {
        Button: {
          defaultProps: {
            radius: 'xl',
          },
        },
      },
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
        <Notifications position='top-center' />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools position='bottom-right' />
          <ModalsProvider modalProps={{ centered: true }}>
            <Navbar />
            <Component {...pageProps} />
          </ModalsProvider>
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
