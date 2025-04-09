import React from 'react';
import { useGetProductsQuery } from '@/store/api/splits/products';
import { ClockCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

const LastModifiedProductComponent = () => {
	const { data: products, isLoading } = useGetProductsQuery();

	const lastModifiedProduct = products
		? [...products].sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		  )[0]
		: null;

	if (isLoading || !lastModifiedProduct) {
		return <></>;
	}

	return (
		<Link
			href={`/dashboard/products/${lastModifiedProduct.id}`}
			className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
		>
			<div className="flex-shrink-0">
				<ClockCircleOutlined className="text-blue-500 text-xl" />
			</div>
			<div className="flex-1 min-w-0">
				<div className="font-medium text-sm">
					{lastModifiedProduct.name}
				</div>
				<div className="text-xs text-gray-500">
					Updated {new Date(lastModifiedProduct.updatedAt).toLocaleDateString()}
				</div>
			</div>
		</Link>
	);
};

export default LastModifiedProductComponent;
