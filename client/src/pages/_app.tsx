import type { ColorScheme, MantineProviderProps } from '@mantine/core'
import { ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getCookie, setCookie } from 'cookies-next'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import RelativeTime from 'dayjs/plugin/relativeTime'
import type { AppContext, AppProps } from 'next/app'
import NextApp from 'next/app'
import { Roboto, Roboto_Mono } from 'next/font/google'
import { useMemo, useState } from 'react'

import { Navbar } from '@/core/components/layouts/navbar'
import { COLOR_SCHEME_COOKIE } from '@/core/constants/strings'
import { AuthModal } from '@/features/auth/components/auth-modal'

dayjs.extend(LocalizedFormat)
dayjs.extend(RelativeTime)

const roboto = Roboto({
  subsets: ['latin-ext'],
  weight: ['400', '500', '700', '900'],
  variable: '--roboto',
})
const robotoMono = Roboto_Mono({
  subsets: ['latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--roboto-mono',
})
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
      fontFamily: roboto.style.fontFamily,
      fontFamilyMonospace: robotoMono.style.fontFamily,
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
            <AuthModal />
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
