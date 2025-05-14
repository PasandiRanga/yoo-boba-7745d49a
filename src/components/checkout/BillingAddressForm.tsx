
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
    <div className="">
      <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
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
