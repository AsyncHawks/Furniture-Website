import { AlertCircle } from 'lucide-react';
import { BWButton, Divider } from '@components';

const AuthForm = ({ onSubmit, pending, messageType = 'error', message, submitText, children }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}

      <Divider className="pt-4" />

      {message && (
        <div
          className={`flex items-center gap-2 rounded-md border  px-4 py-2 text-sm
            ${messageType === 'success' ? 'text-green-600 border-green-500 bg-green-50' : 'text-red-600 border-red-500 bg-red-50'}`}
        >
          <AlertCircle className="h-4 w-4" />
          {message}
        </div>
      )}

      <BWButton
        buttonType="submit"
        disabled={pending}
        text={pending ? 'Please wait...' : submitText}
        className="text-base! w-full rounded-sm py-2 disabled:opacity-50"
      />
    </form>
  );
};

export default AuthForm;
