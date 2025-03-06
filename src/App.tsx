import React, { useState, useCallback, useRef } from 'react';
import { Menu, X, Clock, Settings, Moon, Sun, Edit, Trash2, Plus } from 'lucide-react';

interface MonthData {
  name: string;
  expected: number;
  actual: number;
  diff: number;
}

// Helper function to format time from decimal hours to hours and minutes
const formatTime = (decimalHours: number, showMinutes = true): string => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  
  if (showMinutes && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${hours}h`;
};

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTool, setActiveTool] = useState('time');
  const [darkMode, setDarkMode] = useState(false);
  const [months, setMonths] = useState<MonthData[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragCounterRef = useRef(0);

  const tools = [
    { id: 'time', name: 'Time Calculator', icon: <Clock size={18} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={18} /> }
  ];

  // Dynamic styles based on dark mode
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 to-orange-50',
    sidebar: darkMode 
      ? 'bg-gray-800 border-r border-gray-700' 
      : 'bg-gradient-to-b from-amber-100 to-orange-100 border-r border-amber-200',
    card: darkMode 
      ? 'bg-gray-800' 
      : 'bg-amber-50 bg-opacity-70',
    text: darkMode ? 'text-gray-100' : 'text-gray-800',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-500',
    tableHead: darkMode ? 'bg-gray-700' : 'bg-amber-100 bg-opacity-70',
    tableDivide: darkMode ? 'divide-gray-700' : 'divide-amber-200',
    tableRow: darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-100 hover:bg-opacity-50',
    border: darkMode ? 'border-gray-700' : 'border-amber-200',
    highlight: darkMode 
      ? 'from-gray-700 to-gray-800' 
      : 'from-amber-100 to-orange-100',
    statCard: darkMode 
      ? 'bg-gray-700' 
      : 'bg-white bg-opacity-60 backdrop-blur-sm',
    tipBg: darkMode ? 'bg-gray-700' : 'bg-green-50 bg-opacity-70',
    tipText: darkMode ? 'text-gray-300' : 'text-green-800',
    primaryButton: darkMode 
      ? '!bg-gradient-to-r !from-amber-600 !to-orange-600 hover:!from-amber-700 hover:!to-orange-700 !text-white' 
      : '!bg-gradient-to-r !from-amber-500 !to-orange-500 hover:!from-amber-600 hover:!to-orange-600 !text-white',
    secondaryButton: darkMode
      ? '!bg-gray-700 hover:!bg-gray-600 !text-white'
      : '!bg-white hover:!bg-gray-100 !text-gray-700',
    primaryText: 'text-amber-600',
    secondaryText: 'text-blue-500',
    accentText: 'text-emerald-500',
    toggleButton: darkMode 
      ? '!bg-gray-700 hover:!bg-gray-600 !text-white' 
      : '!bg-amber-200 hover:!bg-amber-300 !text-gray-700',
    // Colors for positive and negative values
    positiveText: darkMode ? 'text-green-400' : 'text-green-600',
    negativeText: darkMode ? 'text-red-400' : 'text-red-600',
    dropZoneBg: darkMode ? 'bg-green-900 bg-opacity-5' : 'bg-green-50 bg-opacity-10',
    dropZoneBorder: darkMode ? 'border-green-600' : 'border-green-500',
    dropZoneText: darkMode ? 'text-green-400' : 'text-green-600',
  };

  // Function to edit a month
  const handleEditMonth = (index: number) => {
    const monthToEdit = months[index];
    
    const name = prompt(`Edit month name:`, monthToEdit.name);
    if (!name) return;
    
    // For expected hours, only use whole hours
    const existingExpectedHours = Math.floor(monthToEdit.expected);
    const expectedHours = parseInt(prompt(`Enter expected hours for ${name}:`, existingExpectedHours.toString()) || "0", 10);
    if (isNaN(expectedHours)) return;
    
    // For actual hours, calculate hours and minutes
    const existingActualHours = Math.floor(monthToEdit.actual);
    const existingActualMinutes = Math.round((monthToEdit.actual - existingActualHours) * 60);
    
    const actualHours = parseInt(prompt(`Enter actual hours for ${name}:`, existingActualHours.toString()) || "0", 10);
    const actualMinutes = parseInt(prompt(`Enter actual minutes for ${name}:`, existingActualMinutes.toString()) || "0", 10);
    if (isNaN(actualHours) || isNaN(actualMinutes)) return;
    
    // Convert to decimal hours (expected is whole number, actual has minutes)
    const expected = expectedHours;
    const actual = parseFloat((actualHours + actualMinutes / 60).toFixed(2));
    
    const updatedMonths = [...months];
    updatedMonths[index] = {
      ...updatedMonths[index],
      name,
      expected,
      actual,
      diff: parseFloat((actual - expected).toFixed(2))
    };
    setMonths(updatedMonths);
  };

  // Function to delete a month
  const handleDeleteMonth = (index: number) => {
    if (window.confirm(`Are you sure you want to delete ${months[index].name}?`)) {
      const updatedMonths = [...months];
      updatedMonths.splice(index, 1);
      setMonths(updatedMonths);
    }
  };

  const handleExportData = () => {
    const timeData = {
      months: months
    };
    
    const dataStr = JSON.stringify(timeData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = "time_data.json";
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Function to process imported file 
  const processImportedFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const data = JSON.parse(result);
        
        if (data && Array.isArray(data.months)) {
          setMonths(data.months);
        } else {
          alert('Invalid file format. Expected a JSON with a months array.');
        }
      } catch (error) {
        alert('Error parsing the file: ' + error);
      }
    };
    
    reader.readAsText(file);
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files?.length) return;
      
      const file = target.files[0];
      processImportedFile(file);
    };
    
    input.click();
  };

  // Calculate totals
  const totals = months.reduce((acc, month) => {
    acc.expected += month.expected;
    acc.actual += month.actual;
    acc.diff += month.diff;
    return acc;
  }, { expected: 0, actual: 0, diff: 0 });

  // Approximate work days based on 8 hours per day
  const totalDays = Math.round(totals.expected / 8);

  const TimeCalculator = () => (
    <div className={`${theme.card} rounded-xl shadow-md p-6 min-h-full backdrop-blur-sm`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-medium ${theme.text} flex items-center gap-2`}>
          <Clock className={theme.primaryText} size={24} />
          <span>Time Calculator</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className={`${theme.primaryButton} !px-3 !py-2 !rounded-lg !text-sm !flex !items-center !gap-1 !shadow-md`}
            title="Export time data as JSON"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4m-5 8h14"></path></svg> Export
          </button>
          <button
            onClick={handleImportData}
            className={`${theme.primaryButton} !px-3 !py-2 !rounded-lg !text-sm !flex !items-center !gap-1 !shadow-md`}
            title="Import time data from JSON"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V9m0 0 4 4m-4-4-4 4m-5 8h14"></path></svg> Import
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`${theme.toggleButton} !p-2 !rounded-lg !shadow-md !h-10 !w-10 !flex !items-center !justify-center`}
          >
            {darkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-700" />}
          </button>
        </div>
      </div>
      
      {/* Tip Box */}
      <div className={`${theme.tipBg} p-4 rounded-lg mb-6 shadow-inner flex items-center gap-3`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme.tipText}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span className={theme.tipText}>You can drag and drop a JSON file anywhere on this page to import your time data.</span>
      </div>
      
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-amber-100 to-orange-100'} p-6 rounded-xl mb-8 shadow-md`}>
        <h3 className={`text-lg font-medium ${theme.text} mb-4`}>Year Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${theme.statCard} p-4 rounded-lg shadow-md`}>
            <div className={theme.textMuted}>Total Months</div>
            <div className={`text-2xl font-medium ${theme.text}`}>{totalDays}</div>
          </div>
          <div className={`${theme.statCard} p-4 rounded-lg shadow-md`}>
            <div className={theme.textMuted}>Expected Hours</div>
            <div className={`text-2xl font-medium ${theme.secondaryText}`}>{formatTime(totals.expected, false)}</div>
          </div>
          <div className={`${theme.statCard} p-4 rounded-lg shadow-md`}>
            <div className={theme.textMuted}>Actual Hours</div>
            <div className={`text-2xl font-medium ${theme.primaryText}`}>{formatTime(totals.actual)}</div>
          </div>
          <div className={`${theme.statCard} p-4 rounded-lg shadow-md`}>
            <div className={theme.textMuted}>Balance</div>
            <div className={`text-2xl font-medium ${totals.diff >= 0 ? theme.positiveText : theme.negativeText}`}>
              {totals.diff > 0 ? '+' : (totals.diff < 0 ? '-' : '')}{formatTime(Math.abs(totals.diff))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-medium ${theme.text}`}>Monthly Breakdown</h3>
          <button 
            className={`${theme.primaryButton} !px-3 !py-2 !rounded-lg !text-sm !flex !items-center !gap-1 !shadow-md`}
            onClick={() => {
              const name = prompt("Enter month name:");
              if (!name) return;
              
              // For expected hours, only ask for whole hours
              const expectedHours = parseInt(prompt("Enter expected hours:") || "0", 10);
              if (isNaN(expectedHours)) return;
              
              // For actual hours, ask for both hours and minutes
              const actualHours = parseInt(prompt("Enter actual hours:") || "0", 10);
              const actualMinutes = parseInt(prompt("Enter actual minutes:") || "0", 10);
              if (isNaN(actualHours) || isNaN(actualMinutes)) return;
              
              // Convert to decimal hours (expected is whole number, actual has minutes)
              const expected = expectedHours;
              const actual = parseFloat((actualHours + actualMinutes / 60).toFixed(2));
              
              setMonths([...months, {
                name,
                expected,
                actual,
                diff: parseFloat((actual - expected).toFixed(2))
              }]);
            }}
          >
            <Plus size={16} /> Add Month
          </button>
        </div>
        
        <div className={`overflow-hidden border ${theme.border} rounded-xl shadow-md`}>
          <table className={`min-w-full divide-y ${theme.tableDivide}`}>
            <thead className={theme.tableHead}>
              <tr>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme.textMuted} uppercase tracking-wider`}>
                  Month
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme.textMuted} uppercase tracking-wider`}>
                  Expected Hours
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme.textMuted} uppercase tracking-wider`}>
                  Actual Hours
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme.textMuted} uppercase tracking-wider`}>
                  Difference
                </th>
                <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme.textMuted} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme.text} divide-y ${theme.tableDivide}`}>
              {months.map((month, index) => (
                <tr key={index} className={theme.tableRow}>
                  <td className="px-6 py-4 whitespace-nowrap">{month.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(month.expected, false)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatTime(month.actual)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${month.diff >= 0 ? theme.positiveText : theme.negativeText}`}>
                    {month.diff > 0 ? '+' : (month.diff < 0 ? '-' : '')}{formatTime(Math.abs(month.diff))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEditMonth(index)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteMonth(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className={`${theme.card} rounded-xl shadow-md p-6 min-h-full backdrop-blur-sm`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-medium ${theme.text} flex items-center gap-2`}>
          <Settings className={theme.primaryText} size={24} />
          <span>Settings</span>
        </h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`${theme.toggleButton} !p-2 !rounded-lg !shadow-md !h-10 !w-10 !flex !items-center !justify-center`}
        >
          {darkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-700" />}
        </button>
      </div>
      
      <div className={`flex items-center justify-center h-64 ${theme.border} border border-dashed rounded-lg bg-opacity-50 backdrop-blur-sm shadow-inner`}>
        <p className={`text-lg ${theme.textMuted}`}>Settings content will be implemented soon</p>
      </div>
    </div>
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Increment the counter when entering a new element
    dragCounterRef.current += 1;
    
    // Always set dragging to true when entering
    setIsDraggingFile(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Decrement the counter when leaving an element
    dragCounterRef.current -= 1;
    
    // Only set dragging to false when all elements are left
    if (dragCounterRef.current === 0) {
      setIsDraggingFile(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Reset counter and dragging state
    dragCounterRef.current = 0;
    setIsDraggingFile(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        processImportedFile(file);
      } else {
        alert('Please drop a JSON file');
      }
    }
  }, []);

  const renderContent = () => {
    switch (activeTool) {
      case 'time':
        return <TimeCalculator />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <TimeCalculator />;
    }
  };

  return (
    <div 
      className={`flex h-screen w-screen ${theme.bg} relative`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* File Drop Overlay */}
      {isDraggingFile && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div 
            className={`w-5/6 h-5/6 max-w-5xl max-h-screen rounded-xl border-[6px] border-dashed ${theme.dropZoneBorder} flex flex-col items-center justify-center`}
            style={{ backgroundColor: darkMode ? 'rgba(20, 83, 45, 0.5)' : 'rgba(240, 253, 244, 0.5)' }}
          >
            <div className={`text-6xl mb-6 ${theme.dropZoneText}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M12 12v6"/>
                <path d="M9 15h6"/>
              </svg>
            </div>
            <h2 className={`text-3xl font-bold mb-3 ${theme.dropZoneText}`}>Drop JSON File Here</h2>
            <p className={`text-xl ${theme.dropZoneText} opacity-80`}>Release to import your time data</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} flex flex-col ${theme.sidebar} transition-all duration-300 ease-in-out z-10 shadow-md`}>
        <div className="flex justify-between items-center p-4 border-b border-opacity-20 border-gray-400">
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
            <h1 className="text-xl font-medium text-amber-600 whitespace-nowrap">Luhi Tools</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-lg transition-colors text-gray-500 hover:bg-gray-200 hover:bg-opacity-20 flex-shrink-0"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <div className="flex flex-col gap-1 p-2 mt-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-3 !p-3 !py-3 rounded-lg transition-all ${
                activeTool === tool.id 
                  ? darkMode ? '!bg-gray-700 !shadow-md' : '!bg-white !bg-opacity-60 !backdrop-blur-sm !shadow-md' 
                  : darkMode ? 'hover:!bg-gray-700 hover:!bg-opacity-50' : 'hover:!bg-white hover:!bg-opacity-40'
              } ${activeTool === tool.id ? theme.text : theme.textMuted}`}
              style={activeTool === tool.id ? {
                backgroundColor: darkMode ? '#374151' : 'rgba(255, 255, 255, 0.6)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '0.75rem'
              } : {
                padding: '0.75rem'
              }}
            >
              <div className={activeTool === tool.id ? theme.primaryText : ''}>{tool.icon}</div>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>
                <span className={`whitespace-nowrap ${activeTool === tool.id ? 'font-medium' : ''}`}>{tool.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;