import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@templates';
import { Input, AuthForm, Paragraph } from '@components';
import { useAuthPending } from '@hooks';
import { authAPI } from '@services';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const { pending, message, setMessage, start, stop } = useAuthPending();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [messageType, setMessageType] = useState('error');

  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = { password: '', confirmPassword: '' };

    if (!values.password) nextErrors.password = 'Password is required';
    else if (values.password.length < 8) nextErrors.password = 'Minimum 8 characters';

    if (!values.confirmPassword) nextErrors.confirmPassword = 'Confirm password is required';
    else if (values.password !== values.confirmPassword)
      nextErrors.confirmPassword = "Passwords don't match";

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    if (!email || !token) {
      setMessageType('error');
      setMessage('Invalid password reset link');
      return;
    }

    setMessage('');
    setMessageType('error');
    start();

    try {
      const res = await authAPI.resetPassword({
        email,
        token,
        password: values.password,
      });

      setMessageType('success');
      setMessage(res.message || 'Password reset successfully');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Could not reset password');
    } finally {
      stop();
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Set a new password for your account"
      footer={
        <div className="flex gap-2 justify-center text-sm">
          <Paragraph variant="H" className="text-gray-500">
            Remembered your password?
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
        submitText="Reset Password"
      >
        <div className="mb-4 text-center font-medium text-gray-700">{email}</div>

        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
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
            placeholder="Confirm New Password"
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

export default ResetPasswordPage;
