
import { AddressInfo } from "@/models/OrderModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressFormProps {
  title: string;
  address: AddressInfo;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  idPrefix?: string;
}

const AddressForm = ({ 
  title, 
  address, 
  handleAddressChange,
  idPrefix = ""
}: AddressFormProps) => {
  const prefix = idPrefix ? `${idPrefix}_` : "";
  
  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor={`${prefix}street1`}>Street Address *</Label>
          <Input
            id={`${prefix}street1`}
            name="street1"
            value={address.street1}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}street2`}>Apartment, suite, etc. (optional)</Label>
          <Input
            id={`${prefix}street2`}
            name="street2"
            value={address.street2}
            onChange={handleAddressChange}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`${prefix}city`}>City *</Label>
            <Input
              id={`${prefix}city`}
              name="city"
              value={address.city}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}state`}>State/Province *</Label>
            <Input
              id={`${prefix}state`}
              name="state"
              value={address.state}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div>
            <Label htmlFor={`${prefix}zipCode`}>ZIP/Postal Code *</Label>
            <Input
              id={`${prefix}zipCode`}
              name="zipCode"
              value={address.zipCode}
              onChange={handleAddressChange}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor={`${prefix}country`}>Country *</Label>
          <Input
            id={`${prefix}country`}
            name="country"
            value={address.country}
            onChange={handleAddressChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
