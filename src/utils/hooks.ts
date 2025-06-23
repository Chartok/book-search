import { useState } from 'react';

export function useForm<T>(callback: () => void, initialState: T) {
  const [values, setValues] = useState(initialState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    callback();
  };

  return { onChange, onSubmit, values };
}
