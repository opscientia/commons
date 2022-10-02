import React, { Component } from 'react'

import { checkCookies, getCookie, getCookies } from 'cookies-next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Test page for ORCID Authentication" />
      </Head>

      <a href="/api/orcid">Login with ORCID</a>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  try {
    const cookieExists = getCookie('token', { req, res })
    console.log(cookieExists)
    if (cookieExists) return { redirect: { destination: '/dashboard' } }
    return { props: {} }
  } catch (err) {
    return { props: {} }
  }
}
