document.addEventListener('DOMContentLoaded', function() {
  const statsContainer = document.getElementById('dashboard-stats');
  const recentOrdersTable = document.getElementById('recent-orders');
  
  // Fetch dashboard stats
  fetch('/api/dashboard')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update stats cards
        statsContainer.innerHTML = `
          <div class="stat-card">
            <h3>Total Products</h3>
            <p>${data.data.totalProducts}</p>
          </div>
          <div class="stat-card">
            <h3>Total Customers</h3>
            <p>${data.data.totalCustomers}</p>
          </div>
          <div class="stat-card">
            <h3>Total Orders</h3>
            <p>${data.data.totalOrders}</p>
          </div>
          <div class="stat-card">
            <h3>Total Sales</h3>
            <p>$${data.data.totalSales.toFixed(2)}</p>
          </div>
        `;
      }
    })
    .catch(error => console.error('Error fetching dashboard stats:', error));

  // Fetch recent orders
  fetch('/api/dashboard/recent-orders')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Clear existing rows
        recentOrdersTable.innerHTML = '';
        
        // Add new rows
        data.data.forEach(order => {
          const row = document.createElement('tr');
          
          const orderId = document.createElement('td');
          orderId.textContent = order.id;
          row.appendChild(orderId);
          
          const customer = document.createElement('td');
          customer.textContent = order.customer;
          row.appendChild(customer);
          
          const date = document.createElement('td');
          date.textContent = new Date(order.date).toLocaleString();
          row.appendChild(date);
          
          const status = document.createElement('td');
          status.textContent = order.status;
          row.appendChild(status);
          
          const total = document.createElement('td');
          total.textContent = `$${order.total}`;
          row.appendChild(total);
          
          recentOrdersTable.appendChild(row);
        });
      }
    })
    .catch(error => {
      console.error('Error fetching recent orders:', error);
      recentOrdersTable.innerHTML = `<tr><td colspan="5">Error loading recent orders</td></tr>`;
    });

  // Add event listeners to dashboard buttons
  const addProductBtn = document.getElementById('add-product-btn');
  const viewOrdersBtn = document.getElementById('view-orders-btn');
  const generateReportBtn = document.getElementById('generate-report-btn');

  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      window.location.href = '/admin/products/';
    });
  }

  if (viewOrdersBtn) {
    viewOrdersBtn.addEventListener('click', () => {
      window.location.href = '/admin/orders/';
    });
  }

  if (generateReportBtn) {
    generateReportBtn.addEventListener('click', () => {
      window.location.href = '/admin/reports/';
    });
  }
});
