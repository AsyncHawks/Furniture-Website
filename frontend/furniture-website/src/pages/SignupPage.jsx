import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@templates';
import { Input, AuthForm, Paragraph } from '@components';
import { useAuthPending } from '@hooks';
import { authAPI } from '@services';

const SignupPage = () => {
  const { pending, message, setMessage, start, stop } = useAuthPending();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [messageType, setMessageType] = useState('error');

  const [values, setValues] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = { fullname: '', email: '', password: '', confirmPassword: '' };

    if (!values.fullname) nextErrors.fullname = 'Full name is required';

    if (!values.email) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      nextErrors.email = 'Enter a valid email';

    if (!values.password) nextErrors.password = 'Password is required';
    else if (values.password.length < 8) nextErrors.password = 'Minimum 8 characters';

    if (!values.confirmPassword) nextErrors.confirmPassword = 'Confirm password is required';
    else if (values.password !== values.confirmPassword)
      nextErrors.confirmPassword = "Passwords don't match";

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setMessage('');
    setMessageType('error');
    start();

    try {
      const res = await authAPI.signup({
        full_name: values.fullname,
        email: values.email,
        password: values.password,
        confirm_password: values.confirmPassword,
      });

      // Store tokens in localStorage
      if (res.tokens) {
        localStorage.setItem('accessToken', res.tokens.access);
        localStorage.setItem('refreshToken', res.tokens.refresh);
      }

      setMessageType('success');
      setMessage(res.message || 'Account created successfully');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Signup failed');
    } finally {
      stop();
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Sign up to get started"
      footer={
        <div className="flex gap-2 justify-center text-sm">
          <Paragraph variant="H" className="text-gray-500">
            Already have an account?
          </Paragraph>
          <Link to="/login" className="underline font-medium">
            Sign In
          </Link>
        </div>
      }
    >
      <AuthForm
        onSubmit={handleSubmit}
        messageType={messageType}
        pending={pending}
        message={message}
        submitText="Create Account"
      >
        <Input
          placeholder="Full Name"
          value={values.fullname}
          onChange={(v) => {
            setValues((s) => ({ ...s, fullname: v }));
            setErrors((e) => ({ ...e, fullname: '' }));
          }}
          error={errors.fullname}
          disabled={pending}
        />

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

        <div className="relative">
          <Input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={(v) => {
              setValues((s) => ({ ...s, confirmPassword: v }));
              setErrors((e) => ({ ...e, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            disabled={pending}
            inputClassName="pr-12"
          />

          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute top-7 -translate-y-1/2 right-4 text-gray-500 hover:text-black"
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </AuthForm>
    </AuthLayout>
  );
};

export default SignupPage;
