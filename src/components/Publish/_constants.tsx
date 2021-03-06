import React from 'react'
import { allowDynamicPricing, allowFixedPricing } from '../../../app.config.js'
import { FormPublishData, PublishFeedback, StepContent } from './_types'
import content from '../../../content/publish/form.json'
import MetadataFields from './Metadata'
import DatasetsFields from './Datasets'
import Preview from './Preview'
import Submission from './Submission'
import { ServiceComputeOptions } from '@oceanprotocol/lib'
import contentFeedback from '../../../content/publish/feedback.json'

export const wizardSteps: StepContent[] = [
  {
    step: 1,
    title: content.metadata.title,
    component: <MetadataFields />
  },
  {
    step: 2,
    // title: content.services.title,
    title: content.datasets.title,
    component: <DatasetsFields />
  },
  {
    step: 3,
    title: content.preview.title,
    component: <Preview />
  },
  {
    step: 4,
    title: content.submission.title,
    component: <Submission />
  }
]

export const initialValues: FormPublishData = {
  user: {
    stepCurrent: 1,
    chainId: 1,
    accountId: ''
  },
  metadata: {
    title: '',
    authors: '',
    description: '',
    keywords: '',
    termsAndConditions: false
  },
  datasets: { datasetId: '' }
}

export const initialPublishFeedback: PublishFeedback = contentFeedback
