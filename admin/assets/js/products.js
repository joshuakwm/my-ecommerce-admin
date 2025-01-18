$(document).ready(function() {
    // Initialize DataTable
    const productsTable = $('#products-table').DataTable({
        ajax: {
            url: '/api/products',
            dataSrc: ''
        },
        columns: [
            { data: 'product_id' },
            { data: 'name' },
            { data: 'category' },
            { 
                data: 'price',
                render: function(data) {
                    return `$${parseFloat(data).toFixed(2)}`;
                }
            },
            { data: 'stock_quantity' },
            {
                data: 'featured',
                render: function(data) {
                    return data ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>';
                }
            },
            {
                data: null,
                render: function(data) {
                    return `
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary edit-product" data-id="${data.product_id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-product" data-id="${data.product_id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                },
                orderable: false
            }
        ]
    });

    // Add Product Modal
    $('#add-product').click(function() {
        $('#addProductModal').modal('show');
    });

    // Add Product Form Submission
    $('#add-product-form').submit(function(e) {
        e.preventDefault();
        
        const formData = {
            name: $('#name').val(),
            category: $('#category').val(),
            price: $('#price').val(),
            stock_quantity: $('#stock_quantity').val(),
            description: $('#description').val(),
            image_url: $('#image_url').val(),
            featured: $('#featured').is(':checked')
        };

        $.ajax({
            url: '/api/products',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function() {
                productsTable.ajax.reload();
                $('#addProductModal').modal('hide');
                $('#add-product-form')[0].reset();
            },
            error: function(xhr) {
                alert('Error adding product: ' + xhr.responseJSON.message);
            }
        });
    });

    // Edit Product Modal
    $('#products-table').on('click', '.edit-product', function() {
        const productId = $(this).data('id');
        
        $.get(`/api/products/${productId}`, function(product) {
            $('#edit-product-id').val(product.product_id);
            $('#edit-name').val(product.name);
            $('#edit-category').val(product.category);
            $('#edit-price').val(product.price);
            $('#edit-stock').val(product.stock_quantity);
            $('#edit-description').val(product.description);
            $('#edit-image-url').val(product.image_url);
            $('#edit-featured').prop('checked', product.featured);
            
            $('#editProductModal').modal('show');
        });
    });

    // Edit Product Form Submission
    $('#edit-product-form').submit(function(e) {
        e.preventDefault();
        
        const productId = $('#edit-product-id').val();
        const formData = {
            name: $('#edit-name').val(),
            category: $('#edit-category').val(),
            price: $('#edit-price').val(),
            stock_quantity: $('#edit-stock').val(),
            description: $('#edit-description').val(),
            image_url: $('#edit-image-url').val(),
            featured: $('#edit-featured').is(':checked')
        };

        $.ajax({
            url: `/api/products/${productId}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function() {
                productsTable.ajax.reload();
                $('#editProductModal').modal('hide');
            },
            error: function(xhr) {
                alert('Error updating product: ' + xhr.responseJSON.message);
            }
        });
    });

    // Delete Product
    $('#products-table').on('click', '.delete-product', function() {
        if (confirm('Are you sure you want to delete this product?')) {
            const productId = $(this).data('id');
            
            $.ajax({
                url: `/api/products/${productId}`,
                method: 'DELETE',
            success: function() {
                productsTable.ajax.reload();
            },
                error: function(xhr) {
                    alert('Error deleting product: ' + xhr.responseJSON.message);
                }
            });
        }
    });
});
