import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@templates';
import { Input, AuthForm, Paragraph } from '@components';
import { useAuthPending } from '@hooks';
import { authAPI } from '@services';

const VerifyEmailPage = () => {
  const { pending, message, setMessage, start, stop } = useAuthPending();

  const [messageType, setMessageType] = useState('error');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email');
      return;
    }

    setMessage('');
    setMessageType('error');
    start();

    try {
      const res = await authAPI.sendVerifyEmail(email);

      setMessageType('success');
      setMessage(res.message || 'Verification email sent');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Could not send verification email');
    } finally {
      stop();
    }
  };

  return (
    <AuthLayout
      title="Verify Email"
      subtitle="We'll send you a verification link"
      footer={
        <div className="flex justify-center gap-2 text-sm">
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
        pending={pending}
        message={message}
        messageType={messageType}
        submitText="Send Verification Link"
      >
        <Input
          placeholder="Email address"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setEmailError('');
          }}
          error={emailError}
          disabled={pending}
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
