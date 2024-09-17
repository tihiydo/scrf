'use client'

import { Form, message } from 'antd'
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createSchemaFieldRule } from 'antd-zod';
import { FictionsInput } from '../../../_components/fictions-input';
import { Collection } from '@/entities/collection';
import { EditCollection } from '@/api/requests/collections/edit-one';
import { useEffect } from 'react';
import { GetOneCollection } from '@/api/requests/collections/get-one';
import { useQueryClient } from '@tanstack/react-query';
import { fictionGetter } from '@/utils/fiction';
import { Fiction } from '@/entities/fiction';



const FormSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  fictions: z.array(z.object({
    id: z.string()
  })).optional()
});
type FormFields = z.infer<typeof FormSchema>


const rule = createSchemaFieldRule(FormSchema);


type Props = {
  collection: Collection;
}

const EditCollectionForm = ({ collection }: Props) => {
  const [form] = Form.useForm<FormFields>();


  const queryClient = useQueryClient();
  const router = useRouter()
  const editMutation = EditCollection.useMutation({
    onSuccess: (collection) => {
      router.push('/admin/collections')
      message.success(`Collection "${collection.name}" has been udpated successfully`)
      queryClient.invalidateQueries({
        queryKey: GetOneCollection.queryKey(
          collection.slug,
          {
            limit: 1000000
          }
        )
      })

    },
    onError: (error) => {
      message.error(error.response?.data.message)
    }
  });

  useEffect(() => {
    form.setFieldsValue({
      name: collection.name ?? '',
      description: collection.description ?? '',
      fictions: collection.collectionFictions
        .map(cf => cf.fiction)
        .filter(f => f != null)
    })
  }, [collection])

  return (
    <Form<FormFields>
      form={form}
      initialValues={{
        name: collection.name ?? '',
        description: collection.description ?? '',
        fictions: collection.collectionFictions
          .map(cf => cf.fiction)
          .filter(f => f != null)
      } as FormFields}
      disabled={editMutation.isPending}
      layout='vertical'
      onFinish={(data) => { 
        editMutation.mutate({
          slug: collection.slug,
          name: data.name,
          description: data.description,
          fictions: data.fictions?.map(f => f.id)
        });
      }}
    >
      <Form.Item<FormFields> label="Name" name={'name'} required rules={[rule]}>
        <Input size='middle' />
      </Form.Item>

      <Form.Item<FormFields> label="Description" name={'description'} rules={[rule]}>
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item<FormFields> name={'fictions'} rules={[rule]}>
        <FictionsInput />
      </Form.Item>

      <Button
        variant={'pimary'}
        type='submit'
        isLoading={editMutation.isPending}
      >
        Save
      </Button>
    </Form>
  )
}

export default EditCollectionForm