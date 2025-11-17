import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFileDownload, FaPlus } from 'react-icons/fa';
import StatsCards from './components/StatsCards';
import RecentActivity from './components/RecentActivity';
import VillageMap from './components/VillageMap';
import PendingReports from './components/PendingReports';

const Dashboard: React.FC = () => {
  const handleExportReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PM-AJAY Dashboard Report', 105, 20, { align: 'center' });
    
    // Add subtitle with date
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Generated on: ${currentDate}`, 105, 28, { align: 'center' });
    
    // Add separator line
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);
    
    // Overview Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Village Development Overview', 20, 42);
    
    // Stats data
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: 48,
      head: [['Metric', 'Value', 'Status']],
      body: [
        ['Total Villages Registered', '248', 'Active'],
        ['Assessments Completed', '156', '63%'],
        ['Pending Assessments', '92', '37%'],
        ['Problem Reports', '45', '18 Pending'],
        ['Active Projects', '89', 'In Progress'],
        ['Adarsh Gram Declarations', '12', 'Completed'],
      ],
      theme: 'striped',
      headStyles: { fillColor: [234, 179, 8] }, // Yellow color
      margin: { left: 20, right: 20 },
    });
    
    // Recent Activity Section
    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recent Activities', 20, finalY + 15);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Activity', 'Village', 'Date']],
      body: [
        ['Gap assessment completed', 'Rampur', new Date().toLocaleDateString()],
        ['New village registered', 'Krishnanagar', new Date().toLocaleDateString()],
        ['Problem report resolved', 'Shanti Nagar', new Date().toLocaleDateString()],
        ['Project milestone completed', 'Anandpur', new Date().toLocaleDateString()],
      ],
      theme: 'striped',
      headStyles: { fillColor: [234, 179, 8] },
      margin: { left: 20, right: 20 },
    });
    
    // Pending Reports Section
    const finalY2 = (doc as any).lastAutoTable.finalY || 140;
    if (finalY2 > 250) {
      doc.addPage();
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Pending Problem Reports', 20, 20);
      
      autoTable(doc, {
        startY: 25,
        head: [['Village', 'Issue', 'Priority', 'Days Pending']],
        body: [
          ['Rampur', 'Water Supply', 'High', '5'],
          ['Krishnanagar', 'Road Maintenance', 'Medium', '8'],
          ['Shanti Nagar', 'Electricity', 'High', '3'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [234, 179, 8] },
        margin: { left: 20, right: 20 },
      });
    } else {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Pending Problem Reports', 20, finalY2 + 15);
      
      autoTable(doc, {
        startY: finalY2 + 20,
        head: [['Village', 'Issue', 'Priority', 'Days Pending']],
        body: [
          ['Rampur', 'Water Supply', 'High', '5'],
          ['Krishnanagar', 'Road Maintenance', 'Medium', '8'],
          ['Shanti Nagar', 'Electricity', 'High', '3'],
        ],
        theme: 'striped',
        headStyles: { fillColor: [234, 179, 8] },
        margin: { left: 20, right: 20 },
      });
    }
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(
        `PM-AJAY Adarsh Gram Platform - Page ${i} of ${pageCount}`,
        105,
        285,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    const fileName = `Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Overview of village development progress and pending assessments
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleExportReport}
              className="btn-secondary flex items-center whitespace-nowrap"
            >
              <div className="w-4 h-4 bg-black rounded flex items-center justify-center mr-2">
                {React.createElement(FaFileDownload as React.ComponentType<any>, { className: "text-white", style: { fontSize: '10px' } })}
              </div>
              Export Report
            </button>
            <button className="btn-primary flex items-center whitespace-nowrap">
              <div className="w-4 h-4 bg-black rounded flex items-center justify-center mr-2">
                {React.createElement(FaPlus as React.ComponentType<any>, { className: "text-white", style: { fontSize: '10px' } })}
              </div>
              New Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Map and Pending Reports */}
        <div className="lg:col-span-2 space-y-8">
          <VillageMap />
          <PendingReports />
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;