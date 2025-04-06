'use client';

import { Card, Col, Empty, Row, Typography } from 'antd';
import { Tree } from 'antd';
import React, { useState } from 'react';
import type { GetProps, TreeDataNode } from 'antd';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { Title } = Typography;
const { DirectoryTree } = Tree;

const treeData: TreeDataNode[] = [
	{
		title: 'parent 0',
		key: '0-0',
		children: [
			{ title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
			{ title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
		],
	},
	{
		title: 'parent 1',
		key: '0-1',
		children: [
			{ title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
			{ title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
		],
	},
];

const DashboardProductsPage = () => {
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null
	);
	const [loading, setLoading] = useState(false);

	const onSelect: DirectoryTreeProps['onSelect'] = (keys: React.Key[]) => {
		if (keys.length > 0) {
			setSelectedCategoryId(keys[0] as string);
		}
		console.log('Trigger Select', keys);
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
								draggable
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
								? 'Products'
								: 'Please select a category'
						}
					>
						{selectedCategoryId ? (
							<>
								<div>Products</div>
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
