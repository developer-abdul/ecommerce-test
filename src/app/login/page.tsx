'use client';

import React, { useEffect, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Card, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

type LoginFormValues = {
	email: string;
	password: string;
};

const { Title, Text } = Typography;

const LoginPage = () => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { status } = useSession();

	useEffect(() => {
		if (status === 'authenticated') {
			router.push('/dashboard');
		}
	}, [status, router]);

	const onFinish = async (values: LoginFormValues) => {
		try {
			setLoading(true);
			const { email, password } = values;

			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				message.error('Invalid email or password');
			} else {
				message.success('Login successful');
				router.push('/dashboard');
			}

		} catch (error) {
			message.error('An error occurred during login');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-50">
			<Card className="w-full max-w-md shadow-lg">
				<div className="text-center mb-6">
					<Title level={2}>Back Office Login</Title>
					<Text>Login to access the admin panel</Text>
				</div>

				<Form name="login" onFinish={onFinish}>
					<Form.Item
						name="email"
						rules={[{ required: true, message: 'Please input your Email!' }]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder="email"
							size="large"
						/>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[{ required: true, message: 'Please input your Password!' }]}
					>
						<Input
							prefix={<LockOutlined />}
							type="password"
							placeholder="Password"
							size="large"
						/>
					</Form.Item>
					<Form.Item>
						<Button
							block
							type="primary"
							htmlType="submit"
							size="large"
							loading={loading}
						>
							Log in
						</Button>
					</Form.Item>
				</Form>
				<Text className="text-center text-sm flex flex-col">
					<div>This is only for demo purpose - Demo credentials:</div>
					<div>Email: admin@example.com</div>
					<div>Password: password123</div>
				</Text>
			</Card>
		</div>
	);
};

export default LoginPage;
