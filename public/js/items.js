$(document).ready(() => {
    populateTable();
});

/**
 * Requests
 */

/**
 * Populate Item Table
 */
 function populateTable() {
    $.ajax({
        url: '/api/items',
        type: 'GET',
        success: (res) => {
            if (res.length === 0) {
                return;
            }
            processTableHTML(res);
        }
    });
}

/**
 * Populate Create Modal
 */
 function populateCreateModal() {
    $.ajax({
        url: '/api/categories',
        type: 'GET',
        success: (res) => {
            if (res.length === 0) {
                return;
            }
            processCreateModalCategoriesHTML(res);
        }
    });
}

/**
 * Create Item
 * @param {Array} item {
 *  name: 'item 1',
 *  category_ids: [ 1, 2, 3]
 * }
 */
function createItem(item) {

    // Create Item
    $.ajax({
        url: '/api/items',
        type: 'POST',
        data: { name: item.name },
        dataType: 'json',
        success: (res, status) => {
            if (status === 'success') {
                const id = res.insertId;
                // Create Item_Category
                $.ajax({
                    url: `/api/items/${id}/categories`,
                    type: 'POST',
                    contentType: "application/json; charset=utf-8",
                    dataType: 'JSON',
                    data: JSON.stringify({ category_ids: item.category_ids }),
                    success: (res, status) => {
                        if (status === 'success') {
                            confirm('Item Created Successfully');
                            window.location.reload();
                        }
                        
                        console.log(res);
                    }
                });
            }
            console.log(res);
        }
    });
}

/**
 * Processors
 */

/**
 * Process Table HTML
 * @param {Array} items
 */
 function processTableHTML(items) {

    let itemsMap = items.map((item) => {
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>
                    <div>
                        <a class="view-button btn btn-success btn-icon-split btn-sm"
                        data-toggle="modal" data-target="#viewModal" data-id="${item.id}">
                            <span class="icon text-white-50">
                                <i class="fas fa-eye"></i>
                            </span>
                            <span class="text">View</span>
                        </a>
                        <a class="edit-button btn btn-primary btn-icon-split btn-sm" 
                        data-toggle="modal" data-target="#editModal" data-id="${item.id}">
                            <span class="icon text-white-50">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span class="text">Edit</span>
                        </a>
                        <a class="delete-button btn btn-danger btn-icon-split btn-sm"
                        data-toggle="modal" data-target="#deleteModal" data-id="${item.id}">
                            <span class="icon text-white-50">
                                <i class="fas fa-trash"></i>
                            </span>
                            <span class="text">Delete</span>
                        </a>
                    </div>
                </td>
            </tr>
        `;
    });

    document.querySelector('#itemsTable').innerHTML = itemsMap.join('');

}

/**
 * Process Create Modal Categories HTML
 * @param {Array} categories
 */
function processCreateModalCategoriesHTML(categories) {

    let categoriesMap = categories.map((category) => {
        return `
            <label class="badge bg-success text-white">
                ${category.name}
                <input type="checkbox" name="category_ids" value="${category.id}">
            </label>
        `;
    });

    document.querySelector('#createModal .categories').innerHTML = categoriesMap.join('');
}

/**
 * Listeners
*/

/**
 * Add Item Button onclick Listener
 */
 function addItemButtonOnClick() {
    let itemName = document.querySelector('#createModal input[name=name]').value;
    let categoryIds = $('#createModal input[name=category_ids]:checked').map(function() { return $(this).val() } ).get();

    createItem({
        name: itemName,
        category_ids: categoryIds
    });
}