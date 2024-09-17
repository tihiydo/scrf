'use client'
import React, { useEffect, useState } from 'react'
import CollectionTable from './_components/table/table'
import { GetManyCollections } from '@/api/requests/collections/get-many'
import { EditManyCollections } from '@/api/requests/collections/edit-many'
import { Button } from '@/components/ui/button'
import { useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {}

const AdminCollectionsPage = (props: Props) => {
  const queryClient = useQueryClient();
  const editManyCollectionsMutation = EditManyCollections.useMutation({
    onSuccess: () => {
      message.success('Collections position updated')
      queryClient.invalidateQueries({
        queryKey: GetManyCollections.queryKey({
          limit: 10000,
        })
      })
    },
    onError: (error) => {
      message.error(error.response?.data.message)
    }
  })
  const collectionsQuery = GetManyCollections.useQuery({
    params: {
      limit: 10000,
    },
  })
  const collections = collectionsQuery.data?.collections ?? [];

  const [collectionsPositions, setCollectionsPositions] = useState<string[]>([]);

  useEffect(() => {
    setCollectionsPositions(collections.map(c => c.id))
  }, [collections])

  return (
    <div>
      <Link href={'/admin/collections/new'}>
        <Button variant={'pimary'}>
          New Collection
        </Button>
      </Link>

      <CollectionTable
        collections={collections}
        onPositionChange={(collections) => {
          setCollectionsPositions(collections)
        }}
      />

      <Button
        onClick={() => {
          editManyCollectionsMutation.mutate({ collections: collectionsPositions })
        }}
        isLoading={editManyCollectionsMutation.isPending}
        variant={'pimary'}
      >
        Save
      </Button>
    </div>
  )
}

export default AdminCollectionsPage