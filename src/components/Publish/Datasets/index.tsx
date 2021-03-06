import Input from '@shared/FormInput'
import { Field, useFormikContext } from 'formik'
import React, { ReactElement, useEffect } from 'react'
import IconDownload from '@images/download.svg'
import IconCompute from '@images/compute.svg'
import content from '../../../../content/publish/form.json'
import { getFieldContent } from '../_utils'
import { FormPublishData } from '../_types'
import Alert from '@shared/atoms/Alert'
import { useMarketMetadata } from '@context/MarketMetadata'
import styles from '../index.module.css'

export default function DatasetsFields(): ReactElement {
  const { siteContent } = useMarketMetadata()

  // connect with Form state, use for conditional field rendering
  const { values, setFieldValue } = useFormikContext<FormPublishData>()

  return (
    <>
      <Field
        // {...getFieldContent('files', content.services.fields)}
        {...getFieldContent('datasetId', content.datasets.fields)}
        component={Input}
        name="datasets.datasetId"
      />
    </>
  )
}
