import "./dashboardHeader.css";
import qcLogo from "../../assets/logos/qcg-logo.svg";
import ydoLogo from "../../assets/logos/ydo-logo.svg";

const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <img
        className="dashboard-header-logo"
        src={qcLogo}
        alt="QC Government Logo"
      />
      <span className="dashboard-header-text">
        QC SCHOLARSHIP PROGRAM DASHBOARD
      </span>
      <img className="dashboard-header-logo" src={ydoLogo} alt="YDO Logo" />
    </div>
  );
};

export default DashboardHeader;
