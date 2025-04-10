'use client';
import React from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import { AppstoreOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useGetProductsQuery } from '@/store/api/splits/products';
import { useGetCategoriesQuery } from '@/store/api/splits/categories';

const { Title } = Typography;

const DashboardPage = () => {
	const router = useRouter();
	const { data: session } = useSession();

	const { data: products, isLoading: productsLoading } = useGetProductsQuery();

	const { data: categories, isLoading: categoriesLoading } =
		useGetCategoriesQuery();

	const productsCount = products?.length || 0;
	const categoriesCount = categories?.length || 0;

	return (
		<div>
			<Title level={2}>Dashboard</Title>
			<Title level={5} className="text-gray-500 mb-6">
				Welcome, {session?.user?.name || session?.user?.email}
			</Title>

			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={8}>
					<Card
						hoverable
						onClick={() => router.push('/dashboard/products')}
						loading={productsLoading}
					>
						<Statistic
							title="Total Products"
							value={productsCount}
							prefix={<ShoppingOutlined />}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={8}>
					<Card hoverable loading={categoriesLoading}>
						<Statistic
							title="Total Categories"
							value={categoriesCount}
							prefix={<AppstoreOutlined />}
						/>
					</Card>
				</Col>
			</Row>

			<Title level={4} className="mt-8 mb-4">
				Quick Actions
			</Title>

			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} lg={8}>
					<Card
						title="Manage Products"
						hoverable
						onClick={() => router.push('/dashboard/products')}
						className="cursor-pointer h-full"
						extra={<ShoppingOutlined />}
					>
						<p>View, edit and manage your product inventory</p>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={8}>
					<Card
						title="Browse Categories"
						hoverable
						onClick={() => router.push('/dashboard/products')}
						className="cursor-pointer h-full"
						extra={<AppstoreOutlined />}
					>
						<p>Explore your product categories</p>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default DashboardPage;
