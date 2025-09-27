import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronDown, User, Phone, Mail, CreditCard, MapPin, IndianRupee } from 'lucide-react';

interface FormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  pancardNumber: string;
  aadharNumber: string;
  areaPincode: string;
  requirementType: string;
  customRequirementType: string;
  monthlyIncome: string;
  sourceOfIncome: string;
  customSourceOfIncome: string;
  loanAmount: string;
  referralCode: string;
  privacyPolicy: boolean;
  notificationsOptIn: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const LeadForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobileNumber: '',
    email: '',
    pancardNumber: '',
    aadharNumber: '',
    areaPincode: '',
    requirementType: '',
    customRequirementType: '',
    monthlyIncome: '',
    sourceOfIncome: '',
    customSourceOfIncome: '',
    loanAmount: '',
    referralCode: '',
    privacyPolicy: false,
    notificationsOptIn: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastLeadId, setLastLeadId] = useState<string | null>(null);

  const requirementTypes = [
    'Personal Loan',
    'Home Loan',
    'Car Loan',
    'Credit Card',
    'Business Loan',
    'Education Loan',
    'Other',
  ];
  const incomeSourceTypes = [
    'Salary',
    'Business',
    'Freelancer',
    'Retired',
    'Investment',
    'Other',
  ];

  const validateField = (name: string, value: string | boolean): string => {
    switch (name) {
      case 'fullName':
        return typeof value === 'string' && value.trim().length < 2
          ? 'Full name must be at least 2 characters'
          : '';

      case 'mobileNumber':
        return typeof value === 'string' && !/^[6-9]\d{9}$/.test(value)
          ? 'Enter a valid 10-digit mobile number'
          : '';

      case 'email':
        return typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? 'Enter a valid email address'
          : '';

      case 'pancardNumber':
        return typeof value === 'string' &&
          value.trim() !== '' &&
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())
          ? 'Enter valid PAN (ABCDE1234F format)'
          : '';

      case 'aadharNumber':
        return typeof value === 'string' && value.trim() !== '' && !/^\d{12}$/.test(value)
          ? 'Enter a valid 12-digit Aadhar number'
          : '';

      case 'areaPincode':
        return typeof value === 'string' && !/^\d{6}$/.test(value)
          ? 'Enter a valid 6-digit pincode'
          : '';

      case 'monthlyIncome':
        return typeof value === 'string' && (!value || parseFloat(value) <= 0)
          ? 'Enter a valid income amount'
          : '';

      case 'loanAmount':
        return typeof value === 'string' && (!value || parseFloat(value) <= 0)
          ? 'Enter a valid loan amount'
          : '';

      default:
        return '';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue as any,
    }));

    if (errors[name]) {
      const error = validateField(name, newValue as string | boolean);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== 'referralCode') {
        const value = formData[key as keyof FormData];

        if (key === 'privacyPolicy' || key === 'notificationsOptIn') {
          if (!value) {
            newErrors[key] =
              key === 'privacyPolicy'
                ? 'You must accept the Privacy Policy and Terms & Conditions'
                : 'You must agree to receive calls and notifications';
          }
        } else if (
          !value ||
          (typeof value === 'string' && value.trim() === '')
        ) {
          if (
            !(key === 'customRequirementType' && formData.requirementType !== 'Other') &&
            !(key === 'customSourceOfIncome' && formData.sourceOfIncome !== 'Other') &&
            key !== 'pancardNumber' &&
            key !== 'aadharNumber'
          ) {
            newErrors[key] = 'This field is required';
          }
        } else {
          const fieldError = validateField(key, value);
          if (fieldError) {
            newErrors[key] = fieldError;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) {
    toast.error('Please fix all form errors before submitting');
    return;
  }
  setIsSubmitting(true);

  try {
    const requirementToSend =
      formData.requirementType === 'Other'
        ? formData.customRequirementType
        : formData.requirementType;

    const incomeSourceToSend =
      formData.sourceOfIncome === 'Other'
        ? formData.customSourceOfIncome
        : formData.sourceOfIncome;

    // ✅ First API: Create lead
    const response = await fetch('http://localhost:3001/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber,
        email: formData.email.toLowerCase(),
        pancardNumber: formData.pancardNumber.toUpperCase(),
        aadharNumber: formData.aadharNumber,
        areaPincode: formData.areaPincode,
        requirementType: requirementToSend,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        sourceOfIncome: incomeSourceToSend,
        loanAmount: parseFloat(formData.loanAmount),
        referralCode: formData.referralCode || null,
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to create lead');


    // ✅ Second API: Fetch latest lead_id from DB
    const idResponse = await fetch('http://localhost:3001/api/getid'); 
        const idResult = await idResponse.json();

        if (idResult.success) {
          setLastLeadId(idResult.leadid); // leadid is just the value
        }

    setShowSuccessDialog(true);
    setFormData({
      fullName: '',
      mobileNumber: '',
      email: '',
      pancardNumber: '',
      aadharNumber: '',
      areaPincode: '',
      requirementType: '',
      customRequirementType: '',
      monthlyIncome: '',
      sourceOfIncome: '',
      customSourceOfIncome: '',
      loanAmount: '',
      referralCode: '',
      privacyPolicy: false,
      notificationsOptIn: false,
    });
    setErrors({});
    console.log('Lead submitted successfully:', result);
  } catch (error: any) {
    console.error('Submit error:', error);
    toast.error(error.message || 'Failed to submit lead. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <h1 className="text-xl font-bold">Quick Loan Request Form</h1>
          </div>

          {/* Form */}
          <div className="p-6">
            <p className="text-gray-600 text-xs font-medium mb-4 uppercase tracking-wide">
              FILL-UP THE DETAILS
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.fullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    maxLength={10}
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>
                )}
              </div>

              {/* Email ID */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Pancard Number */}
              <div>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="pancardNumber"
                    placeholder="Pancard Number"
                    value={formData.pancardNumber}
                    onChange={handleInputChange}
                    maxLength={10}
                    style={{ textTransform: 'uppercase' }}
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.pancardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.pancardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.pancardNumber}</p>
                )}
              </div>

              {/* Aadhar Number */}
              <div>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="aadharNumber"
                    placeholder="Aadhar Number"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    maxLength={12}
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.aadharNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.aadharNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.aadharNumber}</p>
                )}
              </div>

              {/* Area Pincode */}
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="areaPincode"
                    placeholder="Area Pincode"
                    value={formData.areaPincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.areaPincode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.areaPincode && (
                  <p className="text-red-500 text-sm mt-1">{errors.areaPincode}</p>
                )}
              </div>

              {/* Type of Requirements */}
              <div>
                <div className="relative">
                  <select
                    name="requirementType"
                    value={formData.requirementType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none text-xs ${
                      errors.requirementType ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.requirementType ? 'text-gray-500' : ''}`}
                  >
                    <option value="">Select type of Requirements</option>
                    {requirementTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.requirementType && (
                  <p className="text-red-500 text-sm mt-1">{errors.requirementType}</p>
                )}
              </div>

              {/* Custom Requirement Field (only if "Other") */}
              {formData.requirementType === 'Other' && (
                <div>
                  <input
                    type="text"
                    name="customRequirementType"
                    placeholder="Enter your requirement"
                    value={formData.customRequirementType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.customRequirementType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.customRequirementType && (
                    <p className="text-red-500 text-sm mt-1">{errors.customRequirementType}</p>
                  )}
                </div>
              )}

              {/* Monthly in Hand Income */}
              <div>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="monthlyIncome"
                    placeholder="Monthly in Hand Income (₹)"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.monthlyIncome ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.monthlyIncome && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>
                )}
              </div>

              {/* Source of Income */}
                  <div>
                    <div className="relative">
                      <select
                        name="sourceOfIncome"
                        value={formData.sourceOfIncome}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none text-xs ${
                          errors.sourceOfIncome ? 'border-red-500' : 'border-gray-300'
                        } ${!formData.sourceOfIncome ? 'text-gray-500' : ''}`}
                      >
                        <option value="">Source of Income</option>
                        {incomeSourceTypes.map((source) => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                    
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* If user selects Other, show input */}
                    {formData.sourceOfIncome === "Other" && (
                      <input
                        type="text"
                        name="customSourceOfIncome"
                        value={formData.customSourceOfIncome || ""}
                        onChange={handleInputChange}
                        placeholder="Enter your source of income"
                        className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs"
                      />
                    )}

                    {errors.sourceOfIncome && (
                      <p className="text-red-500 text-sm mt-1">{errors.sourceOfIncome}</p>
                    )}
                  </div>


              {/* Required Loan Amount */}
              <div>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="loanAmount"
                    placeholder="Required Loan Amount (₹)"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-11 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs ${
                      errors.loanAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.loanAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.loanAmount}</p>
                )}
              </div>

              {/* Add Referral Code */}
              <div>
                <input
                  type="text"
                  name="referralCode"
                  placeholder="Add Referral Code"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xs"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-4">
                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="privacyPolicy"
                      checked={formData.privacyPolicy}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">
                      I have read the{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                      ,{' '}
                      <a href="#" className="text-blue-600 hover:underline">
                        Terms & Conditions
                      </a>
                      .
                    </span>
                  </label>
                  {errors.privacyPolicy && (
                    <p className="text-red-500 text-sm mt-1 ml-7">{errors.privacyPolicy}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="notificationsOptIn"
                      checked={formData.notificationsOptIn}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-700">
                      I Agree to get Call & Notification on SMS, Email for next Application Process.
                    </span>
                  </label>
                  {errors.notificationsOptIn && (
                    <p className="text-red-500 text-sm mt-1 ml-7">{errors.notificationsOptIn}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showSuccessDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-green-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-2">Your Quick Loan Request Form</h2>
      <p className="text-base text-green-500 font-semibold mb-2">
        Submitted Successfully
      </p>
      <p className="text-sm mb-2">
        Your Lead ID is: <span className="font-bold">{lastLeadId}</span>
      </p>
      <p className="text-xs text-gray-500 mb-6">
        Our associate will get in touch
      </p>
      <button
        onClick={() => setShowSuccessDialog(false)}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Done
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default LeadForm;