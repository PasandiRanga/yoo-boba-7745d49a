
import { Address } from "@/models/OrderModel";
import { Label } from "@/components/ui/label";
import AddressForm from "./AddressForm";

interface BillingAddressFormProps {
  sameAsBilling: boolean;
  setSameAsBilling: (value: boolean) => void;
  billingAddress: Address;
  handleBillingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BillingAddressForm = ({
  sameAsBilling,
  setSameAsBilling,
  billingAddress,
  handleBillingChange,
}: BillingAddressFormProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="sameAsBilling"
          checked={sameAsBilling}
          onChange={() => setSameAsBilling(!sameAsBilling)}
          className="mr-2"
        />
        <Label htmlFor="sameAsBilling">Same as shipping address</Label>
      </div>

      {!sameAsBilling && (
        <AddressForm 
          title="" 
          address={billingAddress} 
          handleAddressChange={handleBillingChange}
          idPrefix="billing"
        />
      )}
    </div>
  );
};

export default BillingAddressForm;
