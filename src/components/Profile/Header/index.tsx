import React, { ReactElement, useState } from 'react'
import Markdown from '@shared/Markdown'
import Account from './Account'
import styles from './index.module.css'
import OrcidHeader from './OrcidHeader'

const isDescriptionTextClamped = () => {
  const el = document.getElementById('description')
  if (el) return el.scrollHeight > el.clientHeight
}

const LinkExternal = ({ url, text }: { url: string; text: string }) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      {text}
    </a>
  )
}

export default function AccountHeader({
  accountId,
  orcid
}: {
  accountId: string
  orcid: string
}): ReactElement {
  const [isShowMore, setIsShowMore] = useState(false)

  const toogleShowMore = () => {
    setIsShowMore(!isShowMore)
  }

  return (
    <div className={styles.grid}>
      <div>
        <Account accountId={accountId} />
        <OrcidHeader orcid={orcid} />
      </div>
      <div className={styles.meta}></div>
    </div>
  )
}
