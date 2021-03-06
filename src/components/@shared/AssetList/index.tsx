import AssetTeaser from '@shared/AssetTeaser/AssetTeaser'
import React, { ReactElement, useEffect, useState } from 'react'
import Pagination from '@shared/Pagination'
import styles from './index.module.css'
import classNames from 'classnames/bind'
import Loader from '@shared/atoms/Loader'
import { useIsMounted } from '@hooks/useIsMounted'
// not sure why this import is required
import { AssetExtended } from 'src/@types/AssetExtended'
import { Asset } from '@oceanprotocol/lib'
import { useWeb3 } from '@context/Web3'

const cx = classNames.bind(styles)

function LoaderArea() {
  return (
    <div className={styles.loaderWrap}>
      <Loader />
    </div>
  )
}

declare type AssetListProps = {
  assets: Asset[]
  showPagination: boolean
  page?: number
  totalPages?: number
  isLoading?: boolean
  onPageChange?: React.Dispatch<React.SetStateAction<number>>
  className?: string
  noPublisher?: boolean
}

export default function AssetList({
  assets,
  showPagination,
  page,
  totalPages,
  isLoading,
  onPageChange,
  className,
  noPublisher
}: AssetListProps): ReactElement {
  const { accountId } = useWeb3()
  const [assetsWithPrices, setAssetsWithPrices] = useState<AssetExtended[]>()
  const [loading, setLoading] = useState<boolean>(isLoading)
  const isMounted = useIsMounted()

  // // This changes the page field inside the query
  function handlePageChange(selected: number) {
    onPageChange(selected + 1)
  }

  const styleClasses = cx({
    assetList: true,
    [className]: className
  })

  return assetsWithPrices && !loading ? (
    <>
      <div className={styleClasses}>
        {assetsWithPrices.length > 0 ? (
          assetsWithPrices.map((assetWithPrice) => (
            <AssetTeaser
              asset={assetWithPrice}
              key={assetWithPrice.id}
              noPublisher={noPublisher}
            />
          ))
        ) : (
          <div className={styles.empty}>No results found</div>
        )}
      </div>

      {showPagination && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onChangePage={handlePageChange}
        />
      )}
    </>
  ) : (
    <LoaderArea />
  )
}
