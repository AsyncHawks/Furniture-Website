import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@templates';
import { Input, AuthForm, Paragraph } from '@components';
import { useAuthPending } from '@hooks';
import { authAPI } from '@services';

const RequestPasswordPage = () => {
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
      const res = await authAPI.requestPasswordSet(email);

      setMessageType('success');
      setMessage(res.message || 'Password set email sent');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Could not send password set email');
    } finally {
      stop();
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="We'll send you a password reset link"
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
        submitText="Send Password Set Link"
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

export default RequestPasswordPage;
