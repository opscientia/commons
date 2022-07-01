import React, { ReactElement } from 'react'
import { StatsTotal } from './_types'

export default function MarketStatsTotal({
  total
}: {
  total: StatsTotal
}): ReactElement {
  return (
    <>
      <p>
        <strong>{total.orders}</strong> orders across{' '}
        <strong>{total.nfts}</strong> assets with{' '}
        <strong>{total.datatokens}</strong> different datatokens.
      </p>
      <abbr title="Total Value Locked">TVL</abbr> across{' '}
      <strong>{total.pools}</strong> asset pools that contain , plus datatokens
      for each pool.
    </>
  )
}
