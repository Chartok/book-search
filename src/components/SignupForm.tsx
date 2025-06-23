import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { REGISTER_USER } from '../utils/mutations.js';
import { AuthContext } from '../context/authContext.js';
import { useForm } from '../utils/hooks.js';

export default function SignupForm() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [errors, setErrors] = useState<string | null>(null);

  const signupCallback = () => {
    registerUser();
  };

  const { onChange, onSubmit, values } = useForm(signupCallback, {
    username: '',
    email: '',
    password: '',
  });

  const [registerUser] = useMutation(REGISTER_USER, {
    variables: { registerInput: values },
    onCompleted(data) {
      login(data.registerUser);
      navigate('/');
    },
    onError(err) {
      setErrors(err.message);
    },
  });

  return (
    <form onSubmit={onSubmit}>
      <h3>Sign Up</h3>
      <input name="username" placeholder="Username" onChange={onChange} />
      <input name="email" placeholder="Email" onChange={onChange} />
      <input name="password" type="password" placeholder="Password" onChange={onChange} />
      {errors && <p>{errors}</p>}
      <button type="submit">Register</button>
    </form>
  );
}
