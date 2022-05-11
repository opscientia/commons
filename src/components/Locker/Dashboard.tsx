import React, { ReactElement, useState, useEffect } from 'react'
import DataSetTeaser from './DataSetTeaser'
import { useWeb3 } from '@context/Web3'

interface FileMetadata {
  address: string
  filename: string
  cid: string
  requestid: number
}

export default function Dashboard(): ReactElement {
  // const data = useStaticQuery(query)
  const web3Context = useWeb3()
  const [filesMetadata, setFilesMetadata] = useState<FileMetadata[]>()

  function getAndSetFiles() {
    fetch(
      process.env.NEXT_PUBLIC_RBAC_API_URL +
        `/fileMetadata?address=${web3Context.accountId}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Basic ' + process.env.NEXT_PUBLIC_RBAC_AUTH_TOKEN
        }
      }
    )
      .then((resp) => resp.json())
      .then((files) => {
        setFilesMetadata(files)
      })
  }

  useEffect(() => {
    getAndSetFiles()
  }, [web3Context])

  function deletePin(requestId: number) {
    const filesMetadataTemp = filesMetadata.slice()
    const newFilesMetadata = filesMetadataTemp.filter(
      (file) => file.requestid !== requestId
    )
    setFilesMetadata(newFilesMetadata)
  }

  function handleClick(event) {
    const confirmation = prompt(`Do you want to delete ${event.target.name}?`)
    if (confirmation.toLowerCase() === 'yes') {
      fetch(
        process.env.NEXT_PUBLIC_RBAC_API_URL +
          `/fileMetadata?address=${web3Context.accountId}&requestid=${event.target.name}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Basic ' + process.env.NEXT_PUBLIC_RBAC_AUTH_TOKEN
          }
        }
      )
        .then((resp) => resp.json())
        .then((data) => {
          deletePin(event.target.name)
        })
        .catch((err) => console.log(err))
    }
  }

  return (
    <>
      <ul>
        {filesMetadata && filesMetadata.length > 0 ? (
          filesMetadata.map((file) => (
            <li key={file.requestid} style={{ marginBottom: '10px' }}>
              <DataSetTeaser
                filename={file.filename}
                description=""
                cid={file.cid}
                requestId={file.requestid}
                discipline=""
              />
              <button
                name={file.requestid.toString()}
                type="submit"
                onClick={handleClick}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <div>
            <p>Uploaded data sets appear here</p>
          </div>
        )}
      </ul>
    </>
  )
}
