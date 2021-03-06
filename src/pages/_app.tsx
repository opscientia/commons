// import App from "next/app";
import React, { ReactElement } from 'react'
import type { AppProps /*, AppContext */ } from 'next/app'
import Web3Provider from '@context/Web3'
import { UserPreferencesProvider } from '@context/UserPreferences'
import PricesProvider from '@context/Prices'
import ConsentProvider from '@context/CookieConsent'
// import App from 'src/components/App'

import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../stylesGlobal/styles.css'
import Decimal from 'decimal.js'
import MarketMetadataProvider from '@context/MarketMetadata'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const App = dynamic(
  () => {
    return import('src/components/App')
  },
  { ssr: false }
)

function MyApp({ Component, pageProps }: AppProps): ReactElement {
  Decimal.set({ rounding: 1 })
  return (
    <MarketMetadataProvider>
      <Web3Provider>
        <UserPreferencesProvider>
          <PricesProvider>
            <ConsentProvider>
              <App>
                <Component {...pageProps} />
              </App>
            </ConsentProvider>
          </PricesProvider>
        </UserPreferencesProvider>
      </Web3Provider>
    </MarketMetadataProvider>
  )
}

export default MyApp
