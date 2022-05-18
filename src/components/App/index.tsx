import React, { ReactElement } from 'react'
import Alert from '@shared/atoms/Alert'
import Footer from '../Footer/Footer'
import Header from '../Header'
import Styles from '../../stylesGlobal/Styles'
import { useWeb3 } from '@context/Web3'
import { useAccountPurgatory } from '@hooks/useAccountPurgatory'
import AnnouncementBanner from '@shared/AnnouncementBanner'
import PrivacyPreferenceCenter from '../Privacy/PrivacyPreferenceCenter'
import styles from './index.module.css'
import { ToastContainer } from 'react-toastify'
import { useRouter } from 'next/router'
import content from '../../../content/purgatory.json'
import { useMarketMetadata } from '@context/MarketMetadata'

export default function App({
  children
}: {
  children: ReactElement
}): ReactElement {
  const router = useRouter()

  const { siteContent, appConfig } = useMarketMetadata()
  const { accountId } = useWeb3()
  const { isInPurgatory, purgatoryData } = useAccountPurgatory(accountId)

  return (
    <div className={styles.app}>
      {router.pathname === '/' && siteContent?.warning.main !== '' && (
        <AnnouncementBanner text={siteContent?.warning.main} />
      )}
      <Header />

      {isInPurgatory && (
        <Alert
          title={content.account.title}
          badge={`Reason: ${purgatoryData?.reason}`}
          text={content.account.description}
          state="error"
        />
      )}
      <main className={styles.main}>{children}</main>
      <Footer />

      {appConfig?.privacyPreferenceCenter === 'true' && (
        <PrivacyPreferenceCenter style="small" />
      )}

      <ToastContainer position="bottom-right" newestOnTop />
    </div>
  )
}