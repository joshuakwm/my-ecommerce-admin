document.addEventListener('DOMContentLoaded', () => {
    const customersTable = document.getElementById('customers-table');
    const exportBtn = document.getElementById('export-customers');
    const profileModal = new bootstrap.Modal('#customerProfileModal');
    
    // Initialize DataTable
    const dataTable = $(customersTable).DataTable({
        processing: true,
        serverSide: true,
        ajax: '/api/customers',
        columns: [
            { data: 'customer_id' },
            { data: 'name' },
            { data: 'email' },
            { 
                data: 'registration_date',
                render: data => new Date(data).toLocaleDateString()
            },
            {
                data: 'newsletter_opt_in',
                render: data => `
                    <span class="badge ${data ? 'bg-success' : 'bg-secondary'}">
                        ${data ? 'Subscribed' : 'Not Subscribed'}
                    </span>
                `
            },
            {
                data: null,
                render: (data) => `
                    <a href="/admin/customers/${data.customer_id}" class="btn btn-sm btn-view">
                        <i class="fas fa-eye"></i> View
                    </a>
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
        dataTable.column(4).search(status).draw();
    });

    // Handle export button click
    exportBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/customers/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    search: searchInput.value,
                    status: filterStatus.value
                })
            });

            if (!response.ok) {
                throw new Error('Failed to export customers');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'customers_export.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            showToast('Customers exported successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to export customers', 'error');
        }
    });

    // Handle view button clicks
    customersTable.addEventListener('click', async (e) => {
        const viewBtn = e.target.closest('.btn-view');
        if (!viewBtn) return;
        
        e.preventDefault();
        const customerId = viewBtn.getAttribute('href').split('/').pop();
        
        try {
            const response = await fetch(`/api/customers/${customerId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch customer details');
            }
            
            const customer = await response.json();
            
            // Populate modal
            document.getElementById('customerName').textContent = customer.name;
            document.getElementById('customerEmail').textContent = customer.email;
            document.getElementById('customerPhone').textContent = customer.phone || 'N/A';
            document.getElementById('customerAddress').textContent = 
                customer.address ? `${customer.address.street}, ${customer.address.city}` : 'N/A';
            document.getElementById('customerRegDate').textContent = 
                new Date(customer.registration_date).toLocaleDateString();
            document.getElementById('customerStatus').textContent = 
                customer.newsletter_opt_in ? 'Subscribed' : 'Not Subscribed';
            
            // Show modal
            profileModal.show();
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to load customer details', 'error');
        }
    });

    // Utility function to show toast messages
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});
