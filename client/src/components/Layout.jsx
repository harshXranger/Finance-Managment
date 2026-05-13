import {
  FaChartPie,
  FaWallet,
  FaMoneyBillWave,
  FaSyncAlt,
  FaChartBar,
  FaBell,
  FaRobot,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import logo from "../assets/logo.png";


const Layout = ({ children, user, onLogout }) => (
  <div className="shell">

    {/* Sidebar */}
    <aside className="sidebar">

      {/* Brand */}
      <div className="sidebar-top">
        <div className="brand-wrapper">
          
          <div class="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div>
            <h1 className="brand-title">WealthWave</h1>

            <p className="brand-text">
              See the story behind every rupee you earn,
              spend, and save.
            </p>
          </div>
        </div>
      </div>



      <div className="profile-card">
        <div className="profile-info">

          <div className="profile-details">
            <h3 className="profile-name">
              {user?.name}
            </h3>

            <p className="profile-email">
              {user?.email}
            </p>
          </div>

        </div>


        <button
          className="ghost-button"
          onClick={onLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>


      <nav className="sidebar-nav">
        <a href="#overview">
          <FaChartPie />
          <span> Overview</span>
        </a>

        <a href="#transactions">
          <FaWallet />
          <span> Transactions</span>
        </a>

        <a href="#budgets">
          <FaMoneyBillWave />
          <span>Budgets</span>
        </a>

        <a href="#recurring">
          <FaSyncAlt />
          <span>Recurring</span>
        </a>

        <a href="#reports">
          <FaChartBar />
          <span>Reports</span>
        </a>

        <a href="#notifications">
          <FaBell />
          <span>Notifications</span>
        </a>

        <a href="#assistant">
          <FaRobot />
          <span>Assistant</span>
        </a>
      </nav>
    </aside>

    {/* Main Content */}
    <main className="main-content">
      {children}
    </main>
  </div>
);

export default Layout;