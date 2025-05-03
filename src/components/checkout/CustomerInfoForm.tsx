
import { Customer } from "@/models/OrderModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerInfoFormProps {
  customer: Customer;
  handleCustomerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomerInfoForm = ({ customer, handleCustomerChange }: CustomerInfoFormProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={customer.firstName}
            onChange={handleCustomerChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={customer.lastName}
            onChange={handleCustomerChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={customer.email}
            onChange={handleCustomerChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            name="phone"
            value={customer.phone}
            onChange={handleCustomerChange}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            name="company"
            value={customer.company}
            onChange={handleCustomerChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoForm;
