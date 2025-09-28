import React, { useState } from 'react';
import { ArrowLeft, Filter, Printer, Download, Upload, Search } from 'lucide-react';

interface PartnerApplication {
  id: number;
  applicationDate: string;
  referenceId: string;
  applicantName: string;
  mobileNo: string;
  referredEmployeeId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const ChannelPartnerApplicationDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockData: PartnerApplication[] = [
    {
      id: 1,
      applicationDate: '20-02-2025 15:10:08',
      referenceId: 'ASFH68809',
      applicantName: 'Sanjay Patil',
      mobileNo: '9878458975',
      referredEmployeeId: 'ASFH68809',
      status: 'Pending'
    },
    {
      id: 2,
      applicationDate: '25-01-2025 22:24:44',
      referenceId: 'FGHJ67892',
      applicantName: 'Rani Sharma',
      mobileNo: '9878458975',
      referredEmployeeId: 'FGHJ67892',
      status: 'Pending'
    },
    {
      id: 3,
      applicationDate: '26-01-2025 12:14:24',
      referenceId: 'FGJH66342',
      applicantName: 'Vinay Nayyar',
      mobileNo: '9878458975',
      referredEmployeeId: 'FGJH66342',
      status: 'Pending'
    },
    {
      id: 4,
      applicationDate: '26-01-2025 21:14:14',
      referenceId: 'FFHN74592',
      applicantName: 'Monika Bedi',
      mobileNo: '9878458975',
      referredEmployeeId: 'FFHN74592',
      status: 'Pending'
    },
    {
      id: 5,
      applicationDate: '24-01-2025 11:24:56',
      referenceId: 'FFHN74592',
      applicantName: 'Kamalal Mehta',
      mobileNo: '9878458975',
      referredEmployeeId: 'FFHN74592',
      status: 'Pending'
    }
  ];

  const filteredData = mockData.filter(item =>
    item.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hover:text-blue-600 cursor-pointer">Admin Dashboard</span>
            <span className="mx-2">›</span>
            <span>Channel Partner Application Dashboard</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-800">
              Channel Partner Application Dashboard
            </h1>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by REFERENCE ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <button className="flex items-center px-1 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              
              <button className="flex items-center px-1 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              
              <button className="flex items-center px-1 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              
              <button className="flex items-center px-1 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mx-0">
          <table className="w-full border-collapse mx-0 px-0">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">
                  SR NO
                </th>
                <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">
                  APPLICATION DATE
                </th>
                <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">
                  REFRANCE ID
                </th>
                <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">
                  APPLICANT NAME
                </th>
                <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">
                  APPLICANT MOBILE NO.
                </th>
                <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">
                  REFERED EMPLOYEE ID
                </th>
                <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">
                  APPLICATION STATUS
                </th>
                <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">
                  APPLICATION DETAILS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    {item.id}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    {item.applicationDate}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    {item.referenceId}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    {item.applicantName}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    {item.mobileNo}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                    {item.referredEmployeeId}
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                      ● Pending
                    </span>
                  </td>
                  <td className="px-1 py-4 whitespace-nowrap">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      See Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPartnerApplicationDashboard;