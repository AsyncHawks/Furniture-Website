import { Paragraph, BWButton, Divider } from '@components';

const ProductsFilterSidebar = ({ onClose, onClearParams, children }) => {
  return (
    <div className="flex flex-col gap-4 h-full pb-2 md:pb-5">
      <Paragraph variant="G">Filter By</Paragraph>
      <Divider />
      <div className="flex-1 overflow-y-auto w-full px-2 overflow-x-hidden flex flex-col gap-4">
        {children}
      </div>
      <div className="flex flex-col gap-3">
        <BWButton
          variant="white"
          text="CLEAR ALL"
          onClick={() => {
            onClearParams();
            onClose();
          }}
        />
        <BWButton variant="black" text="APPLY FILTERS" onClick={onClose} />
      </div>
    </div>
  );
};

export default ProductsFilterSidebar;
