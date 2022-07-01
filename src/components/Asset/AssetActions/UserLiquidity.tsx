import React, { ReactElement } from 'react'
import styles from './UserLiquidity.module.css'

function UserLiquidityLine({
  title,
  amount,
  symbol
}: {
  title: string
  amount: string
  symbol: string
}) {
  return (
    <div>
      <span>{title}</span>
    </div>
  )
}

export default function UserLiquidity({
  amount,
  symbol,
  amountMax,
  titleAvailable = 'Balance',
  titleMaximum = 'Maximum'
}: {
  amount: string
  symbol: string
  titleAvailable?: string
  titleMaximum?: string
  amountMax?: string
}): ReactElement {
  return (
    <div className={styles.userLiquidity}>
      <UserLiquidityLine
        title={titleAvailable}
        amount={amount}
        symbol={symbol}
      />
      {amountMax && (
        <UserLiquidityLine
          title={titleMaximum}
          amount={amountMax}
          symbol={symbol}
        />
      )}
    </div>
  )
}
