import "./dashboardNavButton.css";

interface NavButtonProps {
  nav_url: string;
  nav_text: string;
  isDisabled?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const DashboardNavButton = ({
  nav_url,
  nav_text,
  isDisabled = false,
  isActive = false,
  onClick,
}: NavButtonProps) => {

  return (
    <a
      href={isDisabled ? undefined : nav_url}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        onClick?.();
      }}
      className={[
        "dashboard-navButton-container",
        isDisabled && "dashboard-navButton--disabled",
        isActive && "dashboard-navButton-container--active",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-disabled={isDisabled || undefined}
      aria-current={isActive ? "page" : undefined}
      tabIndex={isDisabled ? -1 : 0}
    >
      <span className="dashboard-navButton-label">{nav_text}</span>
    </a>
  );
};

export default DashboardNavButton;
