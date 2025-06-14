import React from 'react';
import StyledInput from "@/components/ui/styledInput";

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  userId?: string;
}

interface CustomerInfoFormProps {
  customer: Customer;
  handleCustomerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAuthenticated: boolean;
  user: any;
}

const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({ 
  customer, 
  handleCustomerChange, 
  isAuthenticated, 
  user 
}) => {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Customer Information</h2>
        {isAuthenticated && user && (
          <span className="text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
            Auto-filled
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <StyledInput
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Enter your first name"
            value={customer.firstName}
            onChange={handleCustomerChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <StyledInput
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Enter your last name"
            value={customer.lastName}
            onChange={handleCustomerChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <StyledInput
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email address"
            value={customer.email}
            onChange={handleCustomerChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <StyledInput
            type="tel"
            name="phone"
            id="phone"
            placeholder="Enter your phone number"
            value={customer.phone}
            onChange={handleCustomerChange}
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company (Optional)
          </label>
          <StyledInput
            type="text"
            name="company"
            id="company"
            placeholder="Enter company name"
            value={customer.company}
            onChange={handleCustomerChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoForm;