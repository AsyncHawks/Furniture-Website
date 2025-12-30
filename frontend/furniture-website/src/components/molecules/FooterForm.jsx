import { Input, Button } from '@components';

const FooterForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.reset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-120 h-11 sm:h-12 flex items-center border border-(--color-brand-primary) rounded overflow-hidden"
    >
      <Input
        type="email"
        placeholder="example@gmail.com"
        className="h-full!"
        inputClassName="min-w-7 bg-transparent h-full! rounded-none!"
      />
      <Button type="submit" className="bg-(--color-brand-primary-dark) text-(--color-text-inverse)">
        Submit
      </Button>
    </form>
  );
};

export default FooterForm;
