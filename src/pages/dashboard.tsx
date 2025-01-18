import React from "react";
import useSWR from "swr";
import fetcher from "@/utils/api";
import AdminLayout from "@/components/Layout/AdminLayout";
import KeyMetricsCard from "@/components/Dashboard/KeyMetricsCard";
import RecentOrdersTable from "@/components/Dashboard/RecentOrdersTable";

const Dashboard: React.FC = () => {
  const { data: metrics, error: metricsError } = useSWR("/api/dashboard/metrics", fetcher);
  const { data: recentOrders, error: ordersError } = useSWR("/api/dashboard/recent-orders", fetcher);

  if (metricsError || ordersError) {
    return <div>Error loading data.</div>;
  }

  if (!metrics || !recentOrders) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KeyMetricsCard title="Total Sales" value={metrics.totalSales} prefix="$" />
        <KeyMetricsCard title="Total Customers" value={metrics.totalCustomers} />
        <KeyMetricsCard title="Total Orders" value={metrics.totalOrders} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
