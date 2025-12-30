import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@templates';
import { Input, AuthForm, Paragraph } from '@components';
import { useAuthPending } from '@hooks';
import { useDispatch } from 'react-redux';
import { loginThunk, fetchRemoteCart } from '@store';

const LoginPage = () => {
  const { pending, message, setMessage, start, stop } = useAuthPending();

  const [messageType, setMessageType] = useState('error');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = { email: '', password: '' };

    if (!values.email) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      nextErrors.email = 'Enter a valid email';

    if (!values.password) nextErrors.password = 'Password is required';
    else if (values.password.length < 8) nextErrors.password = 'Minimum 8 characters';

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setMessage('');
    setMessageType('error');
    start();

    try {
      const res = await dispatch(loginThunk(values)).unwrap();

      // Fetch user's cart from backend after successful login
      await dispatch(fetchRemoteCart()).unwrap();

      setMessageType('success');
      setMessage(res.message || 'Logged in successfully');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setMessageType('error');
      setMessage(err || 'Invalid email or password');
    } finally {
      stop();
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Log in with your account"
      footer={
        <div className="space-y-2 text-sm w-full">
          <div className="flex gap-4 w-full justify-center">
            <Paragraph variant="H" className="text-gray-500">
              Don't have an account?
            </Paragraph>
            <Link to="/signup" className="underline font-medium">
              Sign Up
            </Link>
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/verify-email" className="underline">
              Verify your email address
            </Link>
            <Link to="/request-password-set" className="underline">
              Set Password
            </Link>
          </div>
        </div>
      }
    >
      <AuthForm
        onSubmit={handleSubmit}
        pending={pending}
        message={message}
        messageType={messageType}
        submitText="Sign In"
      >
        <Input
          placeholder="Email address"
          value={values.email}
          onChange={(v) => {
            setValues((s) => ({ ...s, email: v }));
            setErrors((e) => ({ ...e, email: '' }));
          }}
          error={errors.email}
          disabled={pending}
        />

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={values.password}
            onChange={(v) => {
              setValues((s) => ({ ...s, password: v }));
              setErrors((e) => ({ ...e, password: '' }));
            }}
            error={errors.password}
            disabled={pending}
            inputClassName="pr-12"
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute top-7 -translate-y-1/2 right-4 text-gray-500 hover:text-black"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default LoginPage;
