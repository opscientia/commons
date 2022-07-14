import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  ReactElement,
  useCallback,
  ReactNode
} from 'react'
import { Config, LoggerInstance, Purgatory } from '@oceanprotocol/lib'
import { CancelToken } from 'axios'
import { useWeb3 } from './Web3'
import { useCancelToken } from '@hooks/useCancelToken'
import { getOceanConfig, getDevelopmentConfig } from '@utils/ocean'
import { AssetExtended } from 'src/@types/AssetExtended'
import { Dataset } from 'src/@types/Dataset'
import { Chunk } from 'src/@types/Chunk'
import { useIsMounted } from '@hooks/useIsMounted'
import { useMarketMetadata } from './MarketMetadata'

export interface DatasetProviderValue {
  dataset: Dataset
  title: string
  owner: string
  cids: string[]
  error?: string
  loading: boolean
  fetchDataset: () => Promise<void>
}

const DatasetContext = createContext({} as DatasetProviderValue)

function DatasetProvider({
  _id,
  children
}: {
  _id: string
  children: ReactNode
}): ReactElement {
  const { appConfig } = useMarketMetadata()

  const [dataset, setDataset] = useState<Dataset>()
  const [title, setTitle] = useState<string>()
  const [owner, setOwner] = useState<string>()
  const [cids, setCids] = useState<Dataset>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const isMounted = useIsMounted()

  // -----------------------------------
  // Helper: Get and set dataset based on passed _id
  // -----------------------------------
  const fetchDataset = useCallback(async () => {
    if (!_id) return

    LoggerInstance.log('[dataset] Fetching dataset...')
    setLoading(true)

    const resp = await fetch(
      process.env.NEXT_PUBLIC_PROXY_API_URL +
        `/metadata/datasets/published?id=${_id}`,
      {
        method: 'GET'
      }
    )
    const datasetTemp = await resp.json()

    if (!datasetTemp) {
      setError(
        `\`${_id}\`` +
          '\n\nWe could not find a dataset for this _id in the cache. If you just published a new dataset, wait some seconds and refresh this page.'
      )
      LoggerInstance.error(
        `[dataset] Failed getting dataset for ${_id}`,
        datasetTemp
      )
    } else {
      // Set dataset fields
      setError(undefined)
      setDataset((prevState) => ({
        ...prevState,
        ...datasetTemp
      }))
      setTitle(datasetTemp.title)
      setOwner(datasetTemp.uploader)

      // Get cids
      const resp = await fetch(
        process.env.NEXT_PUBLIC_PROXY_API_URL +
          `/metadata/chunks/published?datasetId=${datasetTemp._id}`,
        {
          method: 'GET'
        }
      )
      const chunks = await resp.json()
      const cidsTemp = chunks?.map((chunk: Chunk) => chunk.storageIds?.cid)
      setCids(cidsTemp)

      LoggerInstance.log('[dataset] Got dataset', datasetTemp)
    }

    setLoading(false)
  }, [_id])

  // -----------------------------------
  // 1. Get and set asset based on passed _id
  // -----------------------------------
  useEffect(() => {
    if (!isMounted) return

    fetchDataset()
  }, [fetchDataset, isMounted])

  return (
    <DatasetContext.Provider
      value={
        {
          dataset,
          title,
          owner,
          cids,
          error,
          loading,
          fetchDataset
        } as DatasetProviderValue
      }
    >
      {children}
    </DatasetContext.Provider>
  )
}

// Helper hook to access the provider values
const useDataset = (): DatasetProviderValue => useContext(DatasetContext)

export { DatasetProvider, useDataset, DatasetContext }
export default DatasetProvider
