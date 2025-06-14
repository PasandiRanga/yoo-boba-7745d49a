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

interface BillingAddressFormProps {
  billingAddress: Address;
  sameAsBilling: boolean;
  setSameAsBilling: (value: boolean) => void;
  handleBillingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBillingCountryChange: (value: string) => void;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  billingAddress,
  sameAsBilling,
  setSameAsBilling,
  handleBillingChange,
  handleBillingCountryChange
}) => {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sameAsBilling}
            onChange={(e) => setSameAsBilling(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Same as shipping address
          </span>
        </label>
      </div>
      
      {!sameAsBilling && (
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="billing_street1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Street Address *
            </label>
            <StyledInput
              type="text"
              name="street1"
              id="billing_street1"
              placeholder="Enter street address"
              value={billingAddress.street1}
              onChange={handleBillingChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="billing_street2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Apartment, suite, etc. (Optional)
            </label>
            <StyledInput
              type="text"
              name="street2"
              id="billing_street2"
              placeholder="Apartment, suite, etc."
              value={billingAddress.street2}
              onChange={handleBillingChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing_city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City *
              </label>
              <StyledInput
                type="text"
                name="city"
                id="billing_city"
                placeholder="Enter city"
                value={billingAddress.city}
                onChange={handleBillingChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="billing_state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State/Province *
              </label>
              <StyledInput
                type="text"
                name="state"
                id="billing_state"
                placeholder="Enter state/province"
                value={billingAddress.state}
                onChange={handleBillingChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billing_zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ZIP/Postal Code *
              </label>
              <StyledInput
                type="text"
                name="zipCode"
                id="billing_zipCode"
                placeholder="Enter ZIP/postal code"
                value={billingAddress.zipCode}
                onChange={handleBillingChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="billing_country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Country *
              </label>
              <StyledSelect
                name="country"
                id="billing_country"
                placeholder="Select country"
                value={billingAddress.country}
                onValueChange={handleBillingCountryChange}
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
      )}
    </div>
  );
};

export default BillingAddressForm;