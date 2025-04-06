'use client';

import React, { useState } from 'react';
import {
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	ShoppingOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

const { Header, Sider, Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const pathname = usePathname();
	const { data: session } = useSession();

	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	// Handle logout
	const handleLogout = async () => {
		await signOut({ redirect: false });
		router.push('/login');
	};

	const getCurrentKey = () => {
		if (pathname?.includes('/products')) return '2';
		return '1';
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider trigger={null} collapsible collapsed={collapsed}>
				<div className="demo-logo-vertical" />
				<Menu
					theme="dark"
					mode="inline"
					defaultSelectedKeys={[getCurrentKey()]}
					items={[
						{
							key: '1',
							icon: <UserOutlined />,
							label: <Link href="/dashboard">Dashboard</Link>,
						},
						{
							key: '2',
							icon: <ShoppingOutlined />,
							label: <Link href="/dashboard/products">Products</Link>,
						},
						{
							key: '3',
							icon: <LogoutOutlined />,
							label: <span onClick={handleLogout}>Logout</span>,
						},
					]}
				/>
			</Sider>
			<Layout>
				<Header
					className="flex justify-between !pl-0 !pr-1 "
					style={{ background: colorBgContainer }}
				>
					<Button
						type="text"
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						style={{
							fontSize: '16px',
							width: 64,
							height: 64,
						}}
					/>
					<div className="flex items-center gap-2">
						<Button
							type="primary"
							onClick={handleLogout}
							icon={<LogoutOutlined />}
						>
							Logout
						</Button>
					</div>
				</Header>
				<Content
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
					}}
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
};

export default DashboardLayout;
