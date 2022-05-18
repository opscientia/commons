import React, { ReactElement } from 'react'
// import Logo from '../../atoms/Logo'
import Markdown from '@shared/Markdown'
import styles from './Intro.module.css'

export default function Intro({
  title,
  tagline
}: {
  title: string
  tagline: string
}): ReactElement {
  return (
    <div className={styles.powered}>
      <h1>{title}</h1>
      <Markdown className={styles.tagline} text={tagline} />
      <Markdown
        className={styles.description}
        text="*powered by* Ocean Protocol, datalad, and Estuary"
      />
      <a
        href="https://oceanprotocol.com/"
        target="_blank"
        rel="noreferrer noopener"
      >
        {/* <Logo /> */}
      </a>
    </div>
  )
}