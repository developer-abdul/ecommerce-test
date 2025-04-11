'use client';

import { Button, Card, Col, Empty, Row, Table, Typography } from 'antd';
import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import type { GetProp, GetProps, TableProps, TreeDataNode } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Category, Product } from '@/types';
import { SorterResult } from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import { useGetCategoriesQuery } from '@/store/api/splits/categories';
import { useGetProductsQuery } from '@/store/api/splits/products';

const { Title } = Typography;
const { DirectoryTree } = Tree;

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

type TablePaginationConfig = Exclude<
	GetProp<TableProps, 'pagination'>,
	boolean
>;
interface TableParams {
	pagination?: TablePaginationConfig;
	sortField?: SorterResult<unknown>['field'];
	sortOrder?: SorterResult<unknown>['order'];
	filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

// Define TreeCategory interface
interface TreeCategory extends TreeDataNode {
	title: string;
	key: string;
	children?: TreeCategory[];
	isLeaf: boolean;
}

const DashboardProductsPage = () => {
	const router = useRouter();

	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);
	const [tableParams, setTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 5,
			pageSizeOptions: ['5', '10', '20', '50'],
			showSizeChanger: true,
		},
	});

	// Fetch categories
	const { data: categories = [] } = useGetCategoriesQuery();

	// Fetch products
	const { data: products = [], isLoading: isLoadingProducts } =
		useGetProductsQuery();

	const convertToTreeData = (categories: Category[]): TreeCategory[] => {
		// Filter out categories that don't have a parent_id
		const rootCategories = categories.filter((cat) => !cat.parent_id);

		// Create a recursive function to build the tree
		const buildTree = (parentCategory: Category): TreeCategory => {
			// Filter all children of this parent
			const children = categories.filter(
				(cat) =>
					cat.parent_id &&
					cat.parent_id.toString() === parentCategory.id.toString()
			);

			return {
				title: parentCategory.name,
				key: parentCategory.id,
				children: children.length > 0 ? children.map(buildTree) : undefined,
				isLeaf: children.length === 0,
			};
		};

		// Build the tree starting from each root category
		return rootCategories.map(buildTree);
	};

	// Transform categories into tree data to support the tree view of Ant Design
	const [treeData, setTreeData] = useState<TreeDataNode[]>([]);

	useEffect(() => {
		if (categories.length > 0) {
			const mappedCategories = convertToTreeData(categories);
			setTreeData(mappedCategories);
		}
	}, [categories]);

	const onSelect: DirectoryTreeProps['onSelect'] = (keys: React.Key[]) => {
		if (keys.length > 0) {
			setSelectedCategoryId(keys[0] as string);
		}
	};

	// Filter products by selected category
	const filteredProducts = selectedCategoryId
		? products.filter((product) => product.category_id === selectedCategoryId)
		: [];

	const columns: TableProps<Product>['columns'] = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: (a, b) => a.id.localeCompare(b.id),
			sortDirections: ['ascend', 'descend'],
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
			sortDirections: ['ascend', 'descend'],
		},
		{
			title: 'Last Updated',
			dataIndex: 'updatedAt',
			key: 'updatedAt',
			render: (date: string) => new Date(date).toLocaleDateString(),
			sorter: (a, b) =>
				new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
			sortDirections: ['ascend', 'descend'],
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: unknown, record: Product) => (
				<Button
					type="primary"
					icon={<EyeOutlined />}
					onClick={() => {
						router.push(`/dashboard/products/${record.id}`);
					}}
				>
					View
				</Button>
			),
		},
	];

	const handleTableChange: TableProps<Product>['onChange'] = (
		pagination,
		filters,
		sorter
	) => {
		setTableParams({
			pagination,
			filters,
			sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
			sortField: Array.isArray(sorter) ? undefined : sorter.field,
		});
	};

	return (
		<div>
			<Title level={2}>Products</Title>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={8} lg={6}>
					<Card title="Categories">
						{treeData.length > 0 ? (
							<DirectoryTree
								multiple
								defaultExpandAll
								onSelect={onSelect}
								treeData={treeData}
							/>
						) : (
							<Empty description="No categories found" />
						)}
					</Card>
				</Col>
				<Col xs={24} md={16} lg={18}>
					<Card
						title={
							selectedCategoryId && !isLoadingProducts
								? 'Product Listings'
								: 'Please select a category'
						}
					>
						{selectedCategoryId ? (
							<>
								<Table<Product>
									dataSource={filteredProducts}
									rowKey="id"
									columns={columns}
									pagination={tableParams.pagination}
									loading={isLoadingProducts}
									onChange={handleTableChange}
								/>
							</>
						) : (
							<Empty description="Select a category to view products" />
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default DashboardProductsPage;
