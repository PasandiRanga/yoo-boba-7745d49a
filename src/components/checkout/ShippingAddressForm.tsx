import React from 'react';
import StyledInput from "@/components/ui/styledInput";
import StyledSelect from "@/components/ui/styledSelect";
import { SelectItem } from "@/components/ui/select";

interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ShippingAddressFormProps {
  shippingAddress: Address;
  handleShippingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShippingCountryChange: (value: string) => void;
  isAuthenticated: boolean;
  user: any;
}

const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  shippingAddress,
  handleShippingChange,
  handleShippingCountryChange,
  isAuthenticated,
  user
}) => {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
        {isAuthenticated && user && user.Address && (
          <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
            Auto-filled
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="shipping_street1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Street Address *
          </label>
          <StyledInput
            type="text"
            name="street1"
            id="shipping_street1"
            placeholder="Enter street address"
            value={shippingAddress.street1}
            onChange={handleShippingChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="shipping_street2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Apartment, suite, etc. (Optional)
          </label>
          <StyledInput
            type="text"
            name="street2"
            id="shipping_street2"
            placeholder="Apartment, suite, etc."
            value={shippingAddress.street2}
            onChange={handleShippingChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City *
            </label>
            <StyledInput
              type="text"
              name="city"
              id="shipping_city"
              placeholder="Enter city"
              value={shippingAddress.city}
              onChange={handleShippingChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              State/Province *
            </label>
            <StyledInput
              type="text"
              name="state"
              id="shipping_state"
              placeholder="Enter state/province"
              value={shippingAddress.state}
              onChange={handleShippingChange}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shipping_zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ZIP/Postal Code *
            </label>
            <StyledInput
              type="text"
              name="zipCode"
              id="shipping_zipCode"
              placeholder="Enter ZIP/postal code"
              value={shippingAddress.zipCode}
              onChange={handleShippingChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="shipping_country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Country *
            </label>
            <StyledSelect
              name="country"
              id="shipping_country"
              placeholder="Select country"
              value={shippingAddress.country}
              onValueChange={handleShippingCountryChange}
              required
            >
              <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
              <SelectItem value="India">India</SelectItem>
              <SelectItem value="Maldives">Maldives</SelectItem>
              <SelectItem value="Bangladesh">Bangladesh</SelectItem>
              <SelectItem value="Pakistan">Pakistan</SelectItem>
            </StyledSelect>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;