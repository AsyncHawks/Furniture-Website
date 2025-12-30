import { Input } from '@components';

const AddressForm = ({ data, onChange, errors = {}, prefix = '' }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          value={data.firstName}
          onChange={(val) => handleChange('firstName', val)}
          placeholder="First Name"
          error={errors.firstName}
        />
        <Input
          value={data.lastName}
          onChange={(val) => handleChange('lastName', val)}
          placeholder="Last Name (optional)"
          error={errors.lastName}
        />
      </div>

      <Input
        value={data.address}
        onChange={(val) => handleChange('address', val)}
        placeholder="Address"
        error={errors.address}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          value={data.city}
          onChange={(val) => handleChange('city', val)}
          placeholder="City"
          error={errors.city}
        />
        <Input
          value={data.postalCode}
          onChange={(val) => handleChange('postalCode', val)}
          placeholder="Postal Code (optional)"
          error={errors.postalCode}
        />
      </div>

      <Input
        value={data.email}
        onChange={(val) => handleChange('email', val)}
        placeholder="Email"
        type="email"
        error={errors.email}
      />

      <Input
        value={data.phone}
        onChange={(val) => handleChange('phone', val)}
        placeholder="Phone (optional)"
        type="phone"
        error={errors.phone}
      />
    </div>
  );
};

export default AddressForm;
