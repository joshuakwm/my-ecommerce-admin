document.addEventListener('DOMContentLoaded', () => {
    const logisticsTable = document.getElementById('logistics-table');
    const addPartnerBtn = document.getElementById('add-partner');
    const addPartnerModal = new bootstrap.Modal('#addPartnerModal');
    const addPartnerForm = document.getElementById('add-partner-form');

    // Initialize DataTable
    const dataTable = $(logisticsTable).DataTable({
        ajax: '/api/logistics',
        columns: [
            { data: 'partner_id' },
            { data: 'name' },
            { data: 'region' },
            { 
                data: 'contact_details',
                render: data => {
                    const details = JSON.parse(data);
                    return `
                        <div>
                            <div>${details.contactPerson}</div>
                            <div>${details.phone}</div>
                            <div>${details.email}</div>
                        </div>
                    `;
                }
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
                                <button class="dropdown-item" onclick="editPartner(${data.partner_id})">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item text-danger" onclick="deletePartner(${data.partner_id})">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                `,
                orderable: false
            }
        ]
    });

    // Handle add partner button click
    addPartnerBtn.addEventListener('click', () => {
        addPartnerForm.reset();
        addPartnerModal.show();
    });

    // Handle add partner form submission
    addPartnerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(addPartnerForm);
        const contactDetails = {
            contactPerson: formData.get('contactPerson'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };

        try {
            const response = await fetch('/api/logistics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    region: formData.get('region'),
                    contact_details: JSON.stringify(contactDetails)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add partner');
            }

            dataTable.ajax.reload();
            addPartnerModal.hide();
            showToast('Partner added successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to add partner', 'error');
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

// Global function to edit partner
window.editPartner = async function(partnerId) {
    try {
        // Fetch partner details
        const response = await fetch(`/api/logistics/${partnerId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch partner details');
        }
        
        const partner = await response.json();
        const contactDetails = JSON.parse(partner.contact_details);

        // Populate edit form
        document.getElementById('edit-name').value = partner.name;
        document.getElementById('edit-region').value = partner.region;
        document.getElementById('edit-contactPerson').value = contactDetails.contactPerson;
        document.getElementById('edit-phone').value = contactDetails.phone;
        document.getElementById('edit-email').value = contactDetails.email;
        document.getElementById('edit-partner-id').value = partner.partner_id;

        // Show edit modal
        new bootstrap.Modal('#editPartnerModal').show();
    } catch (error) {
        console.error('Error:', error);
        showToast('Failed to fetch partner details', 'error');
    }
}

// Global function to delete partner
window.deletePartner = async function(partnerId) {
    if (confirm('Are you sure you want to delete this partner?')) {
        try {
            const response = await fetch(`/api/logistics/${partnerId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete partner');
            }

            location.reload();
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to delete partner', 'error');
        }
    }
}
