'use client';

import {
	ArrowLeftOutlined,
	MinusCircleOutlined,
	PlusOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Empty,
	Form,
	Input,
	Row,
	Select,
	Spin,
	Space,
	Tag,
	Typography,
	message,
	Switch,
	InputNumber,
	Divider,
} from 'antd';
import React, { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
	useGetProductQuery,
	useUpdateProductMutation,
} from '@/store/api/splits/products';
import { useGetCategoriesQuery } from '@/store/api/splits/categories';
import { AttributeType, AttributeValue, Product } from '@/types';

const { Title, Text } = Typography;
const { Option } = Select;

type Props = {
	params: Promise<{
		id: string;
	}>;
};

const DashboardProductPage = ({ params }: Props) => {
	const router = useRouter();

	const { id } = use(params);

	const [form] = Form.useForm();
	const [attributeForm] = Form.useForm();

	const { data: product, isLoading: isLoadingProduct } = useGetProductQuery({
		id,
	});
	const { data: categories = [] } = useGetCategoriesQuery();
	const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

	const [editingAttribute, setEditingAttribute] =
		useState<AttributeValue | null>(null);

	useEffect(() => {
		if (product) {
			form.setFieldsValue({
				name: product.name,
				category_id: product.category_id,
			});
		}
	}, [product, form]);

	const handleBack = () => {
		router.push('/dashboard/products');
	};

	const handleSave = async () => {
		try {
			const values = await form.validateFields();

			if (!product) return;

			const updatedProduct: Partial<Product> = {
				name: values.name,
				category_id: values.category_id,
				attributes: product.attributes,
			};

			await updateProduct({ id, product: updatedProduct }).unwrap();
		} catch (error) {
			console.error(error);
		}
	};

	const getDefaultValueForType = (
		type: AttributeType
	): string | number | boolean | string[] => {
		switch (type) {
			case 'number':
				return 0;
			case 'text':
				return '';
			case 'url':
				return 'https://';
			case 'tags':
				return [];
			case 'boolean':
				return false;
			default:
				return '';
		}
	};

	const handleAddAttribute = async () => {
		try {
			const values = await attributeForm.validateFields();

			if (!product) return;

			const newAttribute: AttributeValue = {
				id: `attr_${Date.now()}`,
				name: values.name,
				type: values.type,
				value: getDefaultValueForType(values.type),
			};

			const updatedAttributes = [...product.attributes, newAttribute];

			await updateProduct({
				id,
				product: { attributes: updatedAttributes },
			}).unwrap();

			attributeForm.resetFields();
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdateAttribute = async () => {
		try {
			const values = await attributeForm.validateFields();

			if (!product || !editingAttribute) return;

			const updatedAttributes = product.attributes.map((attr) =>
				attr.id === editingAttribute.id
					? { ...attr, name: values.name, type: values.type }
					: attr
			);

			await updateProduct({
				id,
				product: { attributes: updatedAttributes },
			}).unwrap();

			setEditingAttribute(null);
			attributeForm.resetFields();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteAttribute = async (attributeId: string) => {
		if (!product) return;

		const updatedAttributes = product.attributes.filter(
			(attr) => attr.id !== attributeId
		);

		try {
			await updateProduct({
				id,
				product: { attributes: updatedAttributes },
			}).unwrap();
		} catch (error) {
			console.error(error);
		}
	};

	const handleAttributeValueChange = async (
		attributeId: string,
		value: string | number | boolean | string[]
	) => {
		if (!product) return;

		const updatedAttributes = product.attributes.map((attr) =>
			attr.id === attributeId ? { ...attr, value } : attr
		);

		try {
			await updateProduct({
				id,
				product: { attributes: updatedAttributes },
			}).unwrap();
		} catch (error) {
			console.error(error);
		}
	};

	const handleEditAttribute = (attribute: AttributeValue) => {
		setEditingAttribute(attribute);
		attributeForm.setFieldsValue({
			name: attribute.name,
			type: attribute.type,
		});
	};

	const renderAttributeValueEditor = (attribute: AttributeValue) => {
		switch (attribute.type) {
			case 'number':
				return (
					<InputNumber
						value={attribute.value as number}
						onChange={(value) =>
							handleAttributeValueChange(attribute.id, value || 0)
						}
						style={{ width: '100%' }}
					/>
				);
			case 'text':
				return (
					<Input
						value={attribute.value as string}
						onChange={(e) =>
							handleAttributeValueChange(attribute.id, e.target.value)
						}
					/>
				);
			case 'url':
				return (
					<Input
						value={attribute.value as string}
						onChange={(e) =>
							handleAttributeValueChange(attribute.id, e.target.value)
						}
					/>
				);
			case 'tags':
				return (
					<Select
						mode="tags"
						style={{ width: '100%' }}
						placeholder="Add tags"
						value={attribute.value as string[]}
						onChange={(value) =>
							handleAttributeValueChange(attribute.id, value)
						}
						tokenSeparators={[',']}
					/>
				);
			case 'boolean':
				return (
					<Switch
						checked={attribute.value as boolean}
						onChange={(checked) =>
							handleAttributeValueChange(attribute.id, checked)
						}
					/>
				);
			default:
				return null;
		}
	};

	if (isLoadingProduct) {
		return (
			<div className="flex justify-center items-center h-64">
				<Spin size="large" tip="Loading" />
			</div>
		);
	}

	if (!product) {
		return (
			<div>
				<Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
					Back to Products
				</Button>
				<Empty description="Product not found" />
			</div>
		);
	}

	return (
		<div>
			<div>
				<Button
					icon={<ArrowLeftOutlined />}
					onClick={handleBack}
					className="mb-4"
				>
					Back to Products
				</Button>
			</div>
			<Card>
				<Title level={2}>Product Details</Title>

				<Form form={form} layout="vertical" className="mb-8">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="name"
								label="Product Name"
								rules={[
									{ required: true, message: 'Please enter product name' },
								]}
							>
								<Input />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="category_id"
								label="Category"
								rules={[
									{ required: true, message: 'Please select a category' },
								]}
							>
								<Select>
									{categories.map((category) => (
										<Option key={category.id} value={category.id}>
											{category.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item>
						<Button
							type="primary"
							icon={<SaveOutlined />}
							onClick={handleSave}
							loading={isUpdating}
						>
							Save Product
						</Button>
					</Form.Item>
				</Form>

				<Divider />

				<Title level={3}>Attributes</Title>

				<div className="mb-6">
					<Form form={attributeForm} layout="inline" className="mb-4">
						<Form.Item
							name="name"
							rules={[
								{ required: true, message: 'Please enter attribute name' },
							]}
						>
							<Input placeholder="Attribute Name" style={{ width: 200 }} />
						</Form.Item>

						<Form.Item
							name="type"
							rules={[
								{ required: true, message: 'Please select attribute type' },
							]}
						>
							<Select placeholder="Attribute Type" style={{ width: 150 }}>
								<Option value="text">Text</Option>
								<Option value="number">Number</Option>
								<Option value="url">URL</Option>
								<Option value="tags">Tags</Option>
								<Option value="boolean">Boolean</Option>
							</Select>
						</Form.Item>

						<Form.Item>
							{editingAttribute ? (
								<Space>
									<Button type="primary" onClick={handleUpdateAttribute}>
										Update
									</Button>
									<Button
										onClick={() => {
											setEditingAttribute(null);
											attributeForm.resetFields();
										}}
									>
										Cancel
									</Button>
								</Space>
							) : (
								<Button
									type="primary"
									icon={<PlusOutlined />}
									onClick={handleAddAttribute}
								>
									Add Attribute
								</Button>
							)}
						</Form.Item>
					</Form>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{product.attributes.map((attribute) => (
						<Card
							key={attribute.id}
							size="small"
							title={
								<div className="flex justify-between items-center">
									<Text strong>{attribute.name}</Text>
									<Space>
										<Tag color="blue">{attribute.type}</Tag>
										<Button
											type="text"
											icon={<MinusCircleOutlined />}
											onClick={() => handleDeleteAttribute(attribute.id)}
											danger
										/>
										<Button
											type="text"
											onClick={() => handleEditAttribute(attribute)}
										>
											Edit
										</Button>
									</Space>
								</div>
							}
						>
							{renderAttributeValueEditor(attribute)}
						</Card>
					))}
				</div>

				{product.attributes.length === 0 && (
					<Empty description="No attributes added yet" />
				)}
			</Card>
		</div>
	);
};

export default DashboardProductPage;
