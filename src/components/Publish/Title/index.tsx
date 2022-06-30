import React, { ReactElement } from 'react'
import NetworkName from '@shared/NetworkName'
import Tooltip from '@shared/atoms/Tooltip'
import styles from './index.module.css'
import content from '../../../../content/publish/index.json'
import { useWeb3 } from '@context/Web3'
import Info from '@images/info.svg'
import AvailableNetworks from 'src/components/Publish/AvailableNetworks'

export default function Title({
  networkId
}: {
  networkId: number
}): ReactElement {
  return <>{content.title} </>
}
