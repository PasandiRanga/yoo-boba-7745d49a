import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTopButton from "@/components/ui/back-to-top";
import FloatingBubbles from "@/components/animations/floatingBubbles";
import { User, Mail, Phone, MapPin, Edit3, Save, X, Trash2, AlertTriangle } from 'lucide-react';
import { updateCustomer, fetchCustomerById, deleteCustomer } from '@/services/customerService';
import { toast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    emailaddress: '',
    contactno: '',
    company: '',
    address: '',
  });

  // Load detailed user data from backend
  useEffect(() => {
    const loadUserData = async () => {
      if (user?.customerid) {
        try {
          const detailedUser = await fetchCustomerById(user.customerid);
          console.log("Fetched detailed user data:", detailedUser);
          setFetchedUserData(detailedUser);
          
          // Update form data with fetched data
          setFormData({
            first_name: detailedUser.first_name || '',
            last_name: detailedUser.last_name || '',
            emailaddress: detailedUser.emailaddress || '',
            contactno: detailedUser.contactno || '',
            company: detailedUser.company || '',
            address: typeof detailedUser.address === 'string' ? detailedUser.address : '',
          });
        } catch (error) {
          console.error('Error fetching detailed user data:', error);
          toast({
            title: "Error",
            description: "Failed to load profile details.",
            variant: "destructive",
          });
        }
      }
    };

    loadUserData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.customerid) return;
    
    setIsLoading(true);
    try {
      // Prepare update data in the format expected by the backend
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        emailaddress: formData.emailaddress,
        contactno: formData.contactno,
        company: formData.company,
        address: formData.address,
      };

      const updatedCustomer = await updateCustomer(user.customerid, updateData);
      
      // Update the context with new data - convert back to the context format
      const contextUpdateData = {
        ...user,
        FullName: `${formData.first_name} ${formData.last_name}`,
        emailaddress: formData.emailaddress,
        ContactNo: formData.contactno,
        Address: formData.address,
      };
      
      updateUser(contextUpdateData);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to the current fetched data
    if (fetchedUserData) {
      setFormData({
        first_name: fetchedUserData.first_name || '',
        last_name: fetchedUserData.last_name || '',
        emailaddress: fetchedUserData.emailaddress || '',
        contactno: fetchedUserData.contactno || '',
        company: fetchedUserData.company || '',
        address: typeof fetchedUserData.address === 'string' ? fetchedUserData.address : '',
      });
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (!user?.customerid) return;
    
    // Check if user typed the confirmation text correctly
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      toast({
        title: "Error",
        description: "Please type 'DELETE MY ACCOUNT' to confirm deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCustomer(user.customerid);
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      
      // Log out user and redirect to home page
      logout();
      navigate('/');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteConfirmText('');
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteConfirmText('');
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteConfirmText('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Please log in to view your profile
            </h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      <FloatingBubbles />
      
      <Navbar />
      
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mb-6 shadow-lg">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-4">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 p-8 md:p-12 mb-8">
            
            {/* Edit Button */}
            <div className="flex justify-end mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-purple-600" />
                Personal Information
              </h2>
              
              {/* Full Name - Split into First and Last */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white">
                      {fetchedUserData?.first_name || 'Not provided'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white">
                      {fetchedUserData?.last_name || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="emailaddress"
                    value={formData.emailaddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white">
                    {fetchedUserData?.emailaddress || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="contactno"
                    value={formData.contactno}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white">
                    {fetchedUserData?.contactno || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white min-h-[100px]">
                    {fetchedUserData?.address || 'Not provided'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Security</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Keep your account secure by updating your password regularly.
              </p>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                Change Password
              </button>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Orders</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                View your order history and track current orders.<br/><br/>
              </p>
              <button onClick={() => navigate("/my-orders")} className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                View Orders
              </button>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Permanently delete your account and all associated data.
              </p>
              <button 
                onClick={openDeleteModal}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Delete Account</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to permanently delete your account? This will:
              </p>
              
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                <li>Delete all your personal information</li>
                <li>Remove your order history</li>
                <li>Cancel any active subscriptions</li>
                <li>Make your account permanently inaccessible</li>
              </ul>
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200 text-sm font-medium mb-2">
                  To confirm deletion, type "DELETE MY ACCOUNT" below:
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default ProfilePage;