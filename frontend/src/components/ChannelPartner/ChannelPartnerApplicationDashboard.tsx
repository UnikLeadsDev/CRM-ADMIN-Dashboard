import React, { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Printer, Upload, Search } from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from 'react-router-dom';

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
  const [partners, setPartners] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();


  // Filter states
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // Fetch data from backend
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('http://44.193.214.12:3001/api/getpartners'); // adjust base URL if needed
        const data = await res.json();

        if (data.success && data.partners) {
          const mapped: PartnerApplication[] = data.partners.map((p: any) => ({
            id: p.id,
            applicationDate: new Date(p.application_date).toLocaleDateString(), // keep only date
            referenceId: p.application_reference_id,
            applicantName: `${p.first_name} ${p.middle_name ?? ''} ${p.last_name}`.trim(),
            mobileNo: p.mobile_number,
            referredEmployeeId: p.authorized_person_employee_id,
            status: p.final_decision as 'Pending' | 'Approved' | 'Rejected',
          }));
          setPartners(mapped);
        }
      } catch (err) {
        console.error('Error fetching partners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // PDF Export
  const handlePrintPDF = () => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [
        [
          "SR NO",
          "APPLICATION DATE",
          "REFERENCE ID",
          "APPLICANT NAME",
          "APPLICANT MOBILE NO.",
          "REFERRED EMPLOYEE ID",
          "APPLICATION STATUS",
        ],
      ],
      body: filteredData.map((item) => [
        item.id,
        item.applicationDate,
        item.referenceId,
        item.applicantName,
        item.mobileNo,
        item.referredEmployeeId,
        item.status,
      ]),
    });

    doc.save("applications.pdf");
  };

  // Excel Export
  const handleExportExcel = () => {
    if (!filteredData || filteredData.length === 0) return;

    const exportData = filteredData.map((item) => ({
      "SR NO": item.id,
      "APPLICATION DATE": item.applicationDate,
      "REFERENCE ID": item.referenceId,
      "APPLICANT NAME": item.applicantName,
      "APPLICANT MOBILE NO.": item.mobileNo,
      "REFERRED EMPLOYEE ID": item.referredEmployeeId,
      "APPLICATION STATUS": item.status,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");
    XLSX.writeFile(wb, "applications.xlsx");
  };

  // Apply search + filter
  const filteredData = partners
    .filter(item =>
      item.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(item =>
      (!filterDate || item.applicationDate === new Date(filterDate).toLocaleDateString()) &&
      (!employeeId || item.referredEmployeeId.includes(employeeId))
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
                  placeholder="Search by REFERENCE ID or Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  className="flex items-center px-1 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>

                {filterPanelOpen && (
                  <div className="absolute right-0 mt-2 p-4 border border-gray-300 bg-white rounded-md shadow-md space-y-3 z-10 w-64">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium">Date:</label>
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="border px-2 py-1 rounded-md w-full"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium">Employee ID:</label>
                      <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="Enter Employee ID"
                        className="border px-2 py-1 rounded-md w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrintPDF}
                className="flex items-center px-1 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportExcel}
                className="flex items-center px-1 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden mx-0">
            <table className="w-full border-collapse mx-0 px-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">SR NO</th>
                  <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">APPLICATION DATE</th>
                  <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">REFERENCE ID</th>
                  <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">APPLICANT NAME</th>
                  <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">APPLICANT MOBILE NO.</th>
                  <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">REFERRED EMPLOYEE ID</th>
                  <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">APPLICATION STATUS</th>
                  <th className="px-1 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider border-r border-gray-200">APPLICATION DETAILS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{item.id}</td>
                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{item.applicationDate}</td>
                    <td className="px-1 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">{item.referenceId}</td>
                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{item.applicantName}</td>
                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{item.mobileNo}</td>
                    <td className="px-1 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">{item.referredEmployeeId}</td>
                    <td className="px-1 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border 
                        ${item.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' : 
                          item.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' : 
                          'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                        ● {item.status}
                      </span>
                    </td>
                    <td className="px-1 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/partner/${item.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        See Details
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found matching your search/filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelPartnerApplicationDashboard;
