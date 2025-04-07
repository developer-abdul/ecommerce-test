'use client';

import { Button, Card, Col, Empty, Row, Table, Typography } from 'antd';
import { Tree } from 'antd';
import React, { useState } from 'react';
import type { GetProp, GetProps, TableProps, TreeDataNode } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Product } from '@/types';
import { SorterResult } from 'antd/es/table/interface';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { Title } = Typography;
const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
	{
		title: 'Catergory 1',
		key: '0-0',
	},
	{
		title: 'Catergory 2',
		key: '0-1',
	},
];

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

const DashboardProductsPage = () => {
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);
	const [loading, setLoading] = useState(false);
	const [tableParams, setTableParams] = useState<TableParams>({
		pagination: {
			current: 1,
			pageSize: 10,
		},
	});

	const onSelect: DirectoryTreeProps['onSelect'] = (keys: React.Key[]) => {
		if (keys.length > 0) {
			setSelectedCategoryId(keys[0] as string);
		}
		console.log('Trigger Select', keys);
	};

	const columns: TableProps<Product>['columns'] = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: true,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			sorter: true,
		},
		{
			title: 'Category',
			dataIndex: 'category',
			key: 'category',
			sorter: true,
		},
		{
			title: 'Last Updated',
			dataIndex: 'lastUpdated',
			key: 'lastUpdated',
			sorter: true,
		},
		{
			title: 'Actions',
			key: 'actions',
			render: (_: unknown, record: Product) => (
				<Button
					type="primary"
					icon={<EyeOutlined />}
					onClick={() => {
						console.log(record);
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

		// `dataSource` is useless since `pageSize` changed
		if (pagination.pageSize !== tableParams.pagination?.pageSize) {
			//   setData([]);
		}
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
							selectedCategoryId && !loading
								? 'Product Listings'
								: 'Please select a category'
						}
					>
						{selectedCategoryId ? (
							<>
								<Table<Product>
									// dataSource={data}
									rowKey="id"
									columns={columns}
									pagination={tableParams.pagination}
									loading={loading}
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
