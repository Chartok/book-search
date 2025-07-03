import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface UseFormProps<T> {
	initialValues: T;
	onSubmit: (values: T, e: FormEvent) => void;
}

export function useForm<T extends Record<string, unknown>>({
	initialValues,
	onSubmit,
}: UseFormProps<T>) {
	const [values, setValues] = useState<T>(initialValues);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onSubmit(values, e);
	};

	const reset = () => {
		setValues(initialValues);
	};

	return {
		values,
		setValues,
		handleChange,
		handleSubmit,
		reset,
	};
}
