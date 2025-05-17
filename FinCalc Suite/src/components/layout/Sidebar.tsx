import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calculator, 
  Home, 
  DollarSign, 
  Building, 
  LineChart, 
  Landmark,
  Book,
  BrainCircuit,
  FlaskConical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`bg-indigo-900 text-white transition-all duration-300 hidden md:block ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          <div className="p-4 flex justify-end">
            <button
              onClick={toggleSidebar}
              className="text-indigo-300 hover:text-white transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
          
          <nav className="mt-6">
            <ul className="space-y-2 px-2">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <Home size={20} />
                  {!isCollapsed && <span className="ml-3">Dashboard</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/loan-calculator"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <DollarSign size={20} />
                  {!isCollapsed && <span className="ml-3">Loan Calculator</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/mortgage-calculator"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <Building size={20} />
                  {!isCollapsed && <span className="ml-3">Mortgage Calculator</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/investment-calculator"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <LineChart size={20} />
                  {!isCollapsed && <span className="ml-3">Investment Calculator</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/retirement-calculator"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <Landmark size={20} />
                  {!isCollapsed && <span className="ml-3">Retirement Calculator</span>}
                </NavLink>
              </li>
              
              <li className="pt-4 mt-4 border-t border-indigo-800">
                <NavLink
                  to="/glossary"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <Book size={20} />
                  {!isCollapsed && <span className="ml-3">Financial Glossary</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/quiz"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <BrainCircuit size={20} />
                  {!isCollapsed && <span className="ml-3">Financial Quiz</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/simulator"
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <FlaskConical size={20} />
                  {!isCollapsed && <span className="ml-3">Scenario Simulator</span>}
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className={`p-4 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="text-xs text-indigo-300">
            <p>FinCalc Suite v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;