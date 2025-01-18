document.addEventListener('DOMContentLoaded', () => {
    const ordersTable = document.getElementById('orders-table');
    const searchInput = document.getElementById('order-search');
    const filterStatus = document.getElementById('filter-status');
    const dateRangePicker = document.getElementById('date-range');
    const exportBtn = document.getElementById('export-orders');

    // Initialize DataTable
    const dataTable = $(ordersTable).DataTable({
        ajax: '/api/orders',
        columns: [
            { data: 'order_id' },
            { data: 'customer.name' },
            { 
                data: 'total_amount',
                render: data => `$${parseFloat(data).toFixed(2)}`
            },
            { 
                data: 'status',
                render: data => `
                    <span class="badge ${getStatusBadgeClass(data)}">
                        ${data}
                    </span>
                `
            },
            { 
                data: 'created_at',
                render: data => new Date(data).toLocaleDateString()
            },
            {
                data: null,
                render: (data) => `
                    <div class="dropdown">
                        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            Actions
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" href="/admin/orders/${data.order_id}">
                                    <i class="fas fa-eye"></i> View Details
                                </a>
                            </li>
                            <li>
                                <button class="dropdown-item" onclick="updateOrderStatus(${data.order_id})">
                                    <i class="fas fa-edit"></i> Update Status
                                </button>
                            </li>
                        </ul>
                    </div>
                `,
                orderable: false
            }
        ],
        order: [[0, 'desc']]
    });

    // Handle search input
    searchInput.addEventListener('input', (e) => {
        dataTable.search(e.target.value).draw();
    });

    // Handle status filter
    filterStatus.addEventListener('change', (e) => {
        const status = e.target.value;
        dataTable.column(3).search(status).draw();
    });

    // Handle date range filter
    dateRangePicker.addEventListener('change', (e) => {
        const dates = e.target.value.split(' - ');
        if (dates.length === 2) {
            const startDate = new Date(dates[0]);
            const endDate = new Date(dates[1]);
            dataTable.column(4).search(`${startDate.toISOString()}|${endDate.toISOString()}`).draw();
        }
    });

    // Handle export button click
    exportBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/orders/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    search: searchInput.value,
                    status: filterStatus.value,
                    dateRange: dateRangePicker.value
                })
            });

            if (!response.ok) {
                throw new Error('Failed to export orders');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'orders_export.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            showToast('Orders exported successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to export orders', 'error');
        }
    });

    // Utility function to get status badge class
    function getStatusBadgeClass(status) {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-warning';
            case 'processing':
                return 'bg-info';
            case 'shipped':
                return 'bg-primary';
            case 'delivered':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    }

    // Utility function to show toast messages
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});

// Global function to update order status
window.updateOrderStatus = async function(orderId) {
    const status = prompt('Enter new status (Pending, Processing, Shipped, Delivered, Cancelled):');
    if (status) {
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update order status');
        }
    }
}
