import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LastModifiedProductComponent from '../LastModifiedProductComponent';
import { useGetProductsQuery } from '@/store/api/splits/products';
import { Product } from '@/types';

jest.mock('@/store/api/splits/products', () => ({
	useGetProductsQuery: jest.fn(),
}));

jest.mock('next/link', () => {
	const MockLink = ({
		children,
		href,
	}: {
		children: React.ReactNode;
		href: string;
	}) => <a href={href}>{children}</a>;
	MockLink.displayName = 'Link';
	return MockLink;
});

describe('LastModifiedProductComponent', () => {
	const mockProducts: Product[] = [
		{
			id: '1',
			name: 'Product 1',
			updatedAt: '2024-04-01T10:00:00Z',
			createdAt: '2024-04-01T10:00:00Z',
			category_id: '1',
			attributes: [
				{
					id: '8',
					name: 'Price',
					type: 'number',
					value: 100,
				},
				{
					id: '9',
					name: 'Description',
					type: 'text',
					value: 'Product 1 Description',
				},
				{
					id: '10',
					name: 'Stock',
					type: 'number',
					value: 10,
				},
			],
		},
		{
			id: '2',
			name: 'Product 2',
			updatedAt: '2024-04-09T10:00:00Z',
			createdAt: '2024-04-01T10:00:00Z',
			category_id: '1',
			attributes: [
				{
					id: '11',
					name: 'Price',
					type: 'number',
					value: 200,
				},
				{
					id: '9',
					name: 'Description',
					type: 'text',
					value: 'Product 2 Description',
				},
				{
					id: '10',
					name: 'Stock',
					type: 'number',
					value: 20,
				},
			],
		},
		{
			id: '3',
			name: 'Product 3',
			updatedAt: '2024-04-05T10:00:00Z',
			createdAt: '2024-04-01T10:00:00Z',
			category_id: '1',
			attributes: [
				{
					id: '12',
					name: 'Price',
					type: 'number',
					value: 300,
				},
				{
					id: '13',
					name: 'Description',
					type: 'text',
					value: 'Product 3 Description',
				},
				{
					id: '14',
					name: 'Stock',
					type: 'number',
					value: 30,
				},
			],
		},
	];

	it('returns null when no products are available', () => {
		(useGetProductsQuery as jest.Mock).mockReturnValue({
			data: [],
			isLoading: false,
		});

		const { container } = render(<LastModifiedProductComponent />);
		expect(container).toBeEmptyDOMElement();
	});

	it('displays the most recently updated product', () => {
		(useGetProductsQuery as jest.Mock).mockReturnValue({
			data: mockProducts,
			isLoading: false,
		});

		render(<LastModifiedProductComponent />);

		expect(screen.getByText('Product 2')).toBeInTheDocument();
		expect(screen.getByText(/Updated/)).toBeInTheDocument();
	});

	it('links to the correct product page', () => {
		(useGetProductsQuery as jest.Mock).mockReturnValue({
			data: mockProducts,
			isLoading: false,
		});

		render(<LastModifiedProductComponent />);

		const link = screen.getByRole('link');
		expect(link).toHaveAttribute('href', '/dashboard/products/2');
	});
});
