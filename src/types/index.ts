export interface Category {
	id: string;
	parent_id?: string;
	name: string;
}

export interface Product {
	id: string;
	name: string;
	category_id: string;
	attributes: AttributeValue[];
	createdAt: string;
	updatedAt: string;
}

export type AttributeType = 'number' | 'text' | 'url' | 'tags' | 'boolean';

export interface AttributeValue {
	id: string;
	name: string;
	type: AttributeType;
	value: string | number | boolean | string[];
}
