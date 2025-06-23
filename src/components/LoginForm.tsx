import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { LOGIN_USER } from '../utils/mutations.js';
import { AuthContext } from '../context/authContext.js';
import { useForm } from '../utils/hooks.js';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState<string | null>(null);

  const loginCallback = () => {
    loginUser();
  };

  const { onChange, onSubmit, values } = useForm(loginCallback, {
    email: '',
    password: '',
  });

  const [loginUser] = useMutation(LOGIN_USER, {
    variables: { loginInput: values },
    onCompleted(data) {
      login(data.loginUser);
      navigate('/');
    },
    onError(err) {
      setErrors(err.message);
    },
  });

  return (
    <form onSubmit={onSubmit}>
      <h3>Login</h3>
      <input name="email" placeholder="Email" onChange={onChange} />
      <input name="password" type="password" placeholder="Password" onChange={onChange} />
      {errors && <p>{errors}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
