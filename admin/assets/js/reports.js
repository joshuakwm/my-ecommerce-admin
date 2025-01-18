document.addEventListener('DOMContentLoaded', () => {
    const reportsTable = document.getElementById('reports-table');
    const generateReportBtn = document.getElementById('generate-report');
    const dateRangePicker = document.getElementById('report-date-range');
    const chartCanvas = document.getElementById('sales-chart');
    let salesChart;

    // Initialize DataTable
    const dataTable = $(reportsTable).DataTable({
        ajax: '/api/reports',
        columns: [
            { data: 'report_id' },
            { 
                data: 'date_range',
                render: data => formatDateRange(data)
            },
            { 
                data: 'total_sales',
                render: data => `$${parseFloat(data).toFixed(2)}`
            },
            { data: 'orders_count' },
            {
                data: null,
                render: (data) => `
                    <button class="btn btn-sm btn-view" data-id="${data.report_id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-download" data-id="${data.report_id}">
                        <i class="fas fa-download"></i>
                    </button>
                `,
                orderable: false
            }
        ],
        order: [[0, 'desc']]
    });

    // Initialize date range picker
    $(dateRangePicker).daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear',
            format: 'YYYY-MM-DD'
        }
    });

    $(dateRangePicker).on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
    });

    $(dateRangePicker).on('cancel.daterangepicker', function() {
        $(this).val('');
    });

    // Handle generate report button click
    generateReportBtn.addEventListener('click', async () => {
        const dateRange = dateRangePicker.value;
        if (!dateRange) {
            showToast('Please select a date range', 'error');
            return;
        }

        const [startDate, endDate] = dateRange.split(' - ');
        
        try {
            const response = await fetch('/api/reports/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const report = await response.json();
            dataTable.ajax.reload();
            updateChart(report.chart_data);
            showToast('Report generated successfully!', 'success');
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to generate report', 'error');
        }
    });

    // Handle view report button click
    reportsTable.addEventListener('click', async (e) => {
        if (e.target.closest('.btn-view')) {
            const reportId = e.target.closest('.btn-view').dataset.id;
            try {
                const response = await fetch(`/api/reports/${reportId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch report');
                }
                const report = await response.json();

                // Populate report details
                document.getElementById('report-id').textContent = report.report_id;
                document.getElementById('report-date-range').textContent = formatDateRange(report.date_range);
                document.getElementById('report-total-sales').textContent = 
                    `$${report.total_sales.toFixed(2)}`;
                document.getElementById('report-orders-count').textContent = report.orders_count;

                // Show report details view
                document.getElementById('reports-list').classList.add('d-none');
                document.getElementById('report-details').classList.remove('d-none');
            } catch (error) {
                console.error('Error:', error);
                showToast('Failed to load report details', 'error');
            }
        }
    });

    // Handle download report button click
    reportsTable.addEventListener('click', async (e) => {
        if (e.target.closest('.btn-download')) {
            const reportId = e.target.closest('.btn-download').dataset.id;
            try {
                const response = await fetch(`/api/reports/${reportId}/download`);
                if (!response.ok) {
                    throw new Error('Failed to download report');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `report_${reportId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                showToast('Report downloaded successfully!', 'success');
            } catch (error) {
                console.error('Error:', error);
                showToast('Failed to download report', 'error');
            }
        }
    });

    // Format date range
    function formatDateRange(dateRange) {
        if (!dateRange) return 'N/A';
        const { start_date, end_date } = dateRange;
        return `${new Date(start_date).toLocaleDateString()} - ${new Date(end_date).toLocaleDateString()}`;
    }

    // Update sales chart
    function updateChart(chartData) {
        if (salesChart) {
            salesChart.destroy();
        }

        salesChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Sales',
                    data: chartData.data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sales ($)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Sales: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
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
