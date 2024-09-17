import { Form, message } from 'antd'
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea'
import { Button } from '@/components/ui/button';
import { FictionsInput } from '../../_components/fictions-input';
import { Fiction } from '@/entities/fiction';
import { CreateCollection } from '@/api/requests/collections/create';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createSchemaFieldRule } from 'antd-zod';


type FormFields = {
    name: string;
    description?: string;
    fictions?: Fiction[]
};

const FormSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    fictions: z.array(z.object({
        id: z.string()
    })).optional()
});

const rule = createSchemaFieldRule(FormSchema);


type Props = {}

const NewCollectionForm = (props: Props) => {
    const router = useRouter()
    const createMutation = CreateCollection.useMutation({
        onSuccess: (collection) => {
            router.push('/admin/collections')
            message.success(`Collection "${collection.name}" has been created successfully`)
        },
        onError: (error) => {
            message.error(error.response?.data.message)
        }
    });

    return (
        <Form<FormFields>
            disabled={createMutation.isPending}
            layout='vertical'
            onFinish={(data) => {
                createMutation.mutate({
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
                isLoading={createMutation.isPending}
            >
                Save
            </Button>
        </Form>
    )
}

export default NewCollectionForm