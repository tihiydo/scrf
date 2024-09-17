'use client'

import { GetOneCollection } from '@/api/requests/collections/get-one';
import React from 'react'
import { EditCollectionForm } from './_components/edit-collection-form';

type Props = {
  params: {
    collection: string;
  }
}

const AdminCollectionPage = ({ params }: Props) => {
  const collectionQuery = GetOneCollection.useQuery({
    slug: params.collection,
    params: {
      limit: 1000000
    }
  })

  const collection = collectionQuery.data?.collection;

  console.log('fetched collection', collection)

  return (
    <div>
      {collection ? (
        <EditCollectionForm collection={collection} />
      ) : null}
    </div>
  )
}

export default AdminCollectionPage