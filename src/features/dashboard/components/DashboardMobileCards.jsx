function DashboardMobileCards({ children }) {
  if (!children) return null;

  return <div className="mobile-card-list dashboard-mobile-cards">{children}</div>;
}

export default DashboardMobileCards;
