'use client';

import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';

type LoginFormValues = {
	email: string;
	password: string;
};

const LoginPage = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const onFinish = async (values: LoginFormValues) => {
		try {
			setLoading(true);
			const { email, password } = values;

			// Need to work on the NextAuth Login
		} catch (error) {
			message.error('An error occurred during login');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50">
			<Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
				<Form.Item
					name="username"
					rules={[{ required: true, message: 'Please input your Username!' }]}
				>
					<Input prefix={<UserOutlined />} placeholder="Username" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: 'Please input your Password!' }]}
				>
					<Input
						prefix={<LockOutlined />}
						type="password"
						placeholder="Password"
					/>
				</Form.Item>
				<Form.Item>
					<Button block type="primary" htmlType="submit">
						Log in
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default LoginPage;
