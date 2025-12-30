import { Heading, Paragraph } from '@components';
import { Phone } from 'lucide-react';

const AddressCard = ({ label, address }) => {
  if (!address) return null;

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <Heading variant="small" className="mb-3 text-sm sm:text-base font-semibold text-gray-900">
        {label}
      </Heading>

      <Paragraph
        variant="F"
        className="space-y-1 text-sm sm:text-base text-gray-600 leading-relaxed"
      >
        <span className="block font-medium text-gray-800">
          {address.firstName} {address.lastName}
        </span>

        <span className="block">
          {address.address}, {address.city}
        </span>

        {address.postalCode && <span className="block">{address.postalCode}</span>}

        {address.phone && (
          <span className="flex gap-2 items-center">
            <Phone size={18} /> {address.phone}
          </span>
        )}

        {address.email && <span className="block break-all text-blue-600">{address.email}</span>}
      </Paragraph>
    </div>
  );
};

export default AddressCard;
