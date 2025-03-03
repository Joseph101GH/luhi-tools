import React, { useState } from 'react';
import { Menu, X, Clock, Settings, Moon, Sun, Save, Upload } from 'lucide-react';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTool, setActiveTool] = useState('time');
  const [darkMode, setDarkMode] = useState(false);

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
      : 'from-gradient-to-r from-amber-100 to-orange-100',
    statCard: darkMode 
      ? 'bg-gray-700' 
      : 'bg-white bg-opacity-60 backdrop-blur-sm',
    tipBg: darkMode ? 'bg-gray-700' : 'bg-green-50 bg-opacity-70',
    tipText: darkMode ? 'text-gray-300' : 'text-green-800',
    primaryButton: 'bg-purple-500 hover:bg-purple-600 text-white',
    secondaryButton: 'bg-transparent hover:bg-gray-200 hover:bg-opacity-20 border border-gray-300 dark:border-gray-600',
    primaryText: 'text-purple-500',
    secondaryText: 'text-blue-500',
    accentText: 'text-emerald-500',
    toggleButton: darkMode 
      ? 'bg-gray-700 hover:bg-gray-600' 
      : 'bg-amber-200 hover:bg-amber-300'
  };

  const handleExportData = () => {
    const timeData = {
      months: [
        { name: "January", expected: 168, actual: 160, diff: -8 },
        { name: "February", expected: 174, actual: 184, diff: 10 },
        { name: "March", expected: 176, actual: 175, diff: -1 },
        { name: "April", expected: 168, actual: 172, diff: 4 },
      ]
    };
    
    const dataStr = JSON.stringify(timeData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = "time_data.json";
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const TimeCalculator = () => (
    <div className={`${theme.card} rounded-xl shadow-md p-6 min-h-full backdrop-blur-sm`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${theme.text} flex items-center gap-2`}>
          <Clock className={theme.primaryText} size={20} />
          <span>Time Calculator</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            className={`p-2 rounded-lg ${theme.secondaryButton} transition-colors flex items-center gap-1`}
          >
            <Save size={16} />
            <span className="text-sm">Export</span>
          </button>
          <button
            className={`p-2 rounded-lg ${theme.secondaryButton} transition-colors flex items-center gap-1`}
          >
            <Upload size={16} />
            <span className="text-sm">Import</span>
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${theme.toggleButton} transition-colors`}
          >
            {darkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-500" />}
          </button>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-amber-100 to-orange-100'} p-6 rounded-xl mb-8 shadow-md`}>
        <h3 className={`text-lg font-medium ${theme.text} mb-4`}>Year Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`${theme.statCard} p-4 rounded-lg shadow-md`}>
            <div className={theme.textMuted}>Total Days</div>
            <div className={`text-2xl font-medium ${theme.text}`}>86</div>
          </div>
          <div className={`${theme.statCard} p-4 rounded-lg shadow-md`}>
            <div className={theme.textMuted}>Expected Hours</div>
            <div className={`text-2xl font-medium ${theme.secondaryText}`}>686</div>
          </div>
          <div className={`${theme.statCard} p-4 rounded-lg shadow-md`}>
            <div className={theme.textMuted}>Actual Hours</div>
            <div className={`text-2xl font-medium ${theme.primaryText}`}>691</div>
          </div>
          <div className={`${theme.statCard} p-4 rounded-lg shadow-md`}>
            <div className={theme.textMuted}>Balance</div>
            <div className={`text-2xl font-medium ${theme.accentText}`}>+5</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-medium ${theme.text}`}>Monthly Breakdown</h3>
          <button className={`${theme.primaryButton} px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors shadow-md`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> Add Month
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
                  Balance
                </th>
                <th scope="col" className={`px-6 py-3 text-right text-xs font-medium ${theme.textMuted} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme.card} divide-y ${theme.tableDivide}`}>
              {[
                { name: "January", expected: 168, actual: 160, diff: -8 },
                { name: "February", expected: 174, actual: 184, diff: 10 },
                { name: "March", expected: 176, actual: 175, diff: -1 },
                { name: "April", expected: 168, actual: 172, diff: 4 },
              ].map((month, i) => (
                <tr key={i} className={theme.tableRow}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme.text}`}>
                    {month.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.textMuted}`}>
                    {month.expected}h
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.textMuted}`}>
                    {month.actual}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      month.diff > 0 
                        ? darkMode ? 'bg-gray-600 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                        : month.diff < 0 
                        ? darkMode ? 'bg-gray-600 text-red-400' : 'bg-red-100 text-red-800'
                        : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {month.diff > 0 ? '+' : ''}{month.diff}h
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className={`${theme.secondaryText} hover:opacity-80 mr-3`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className={`${theme.primaryText} hover:opacity-80`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className={`mt-8 p-4 ${theme.tipBg} border ${darkMode ? 'border-gray-600' : 'border-green-100'} rounded-lg flex items-start gap-3`}>
        <div className={theme.accentText}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className={`text-sm ${theme.tipText}`}>
          <p className="font-medium">Reminder about Data Persistence</p>
          <p>This app doesn't store your data automatically. Remember to export your data regularly using the Export button above, and import it when needed.</p>
        </div>
      </div>
    </div>
  );

  const SettingsPage = () => (
    <div className={`${theme.card} rounded-xl shadow-md p-6 min-h-full backdrop-blur-sm`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-medium ${theme.text} flex items-center gap-2`}>
          <Settings className={theme.primaryText} size={20} />
          <span>Settings</span>
        </h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-lg ${theme.toggleButton} transition-colors`}
        >
          {darkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-500" />}
        </button>
      </div>
      
      <div className={`flex items-center justify-center h-64 ${theme.border} border border-dashed rounded-lg`}>
        <p className={`text-lg ${theme.textMuted}`}>Settings content will be implemented soon</p>
      </div>
    </div>
  );

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
    <div className={`flex h-screen w-screen ${theme.bg}`}>
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} flex flex-col ${theme.sidebar} transition-all duration-300 z-10 shadow-md`}>
        <div className="flex justify-between items-center p-3 border-b border-opacity-20 border-gray-400">
          {isSidebarOpen && <h1 className="text-lg font-medium text-purple-600">Luhi Tools</h1>}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={`p-1 rounded-lg transition-colors text-gray-500 hover:bg-gray-200 hover:bg-opacity-20`}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <Menu size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        <div className="flex flex-col gap-1 p-2 mt-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTool === tool.id 
                  ? darkMode ? 'bg-purple-900 bg-opacity-50' : 'bg-white bg-opacity-80 shadow-sm' 
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-white hover:bg-opacity-40'
              } ${activeTool === tool.id ? theme.text : theme.textMuted}`}
            >
              <div className={activeTool === tool.id ? theme.primaryText : ''}>{tool.icon}</div>
              {isSidebarOpen && <span className={activeTool === tool.id ? 'font-medium' : ''}>{tool.name}</span>}
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
}

export default App;
