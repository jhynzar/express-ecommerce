$(document).ready(() => {
    populateTable();

    $('#itemsTable').on('click', 'a.view-button', tableViewModalButtonOnClick);
    $('#itemsTable').on('click', 'a.edit-button', tableEditModalButtonOnClick);
    $('#itemsTable').on('click', 'a.delete-button', tableDeleteModalButtonOnClick);
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
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }
            let items = res.data;
            if (items.length === 0) {
                return;
            }
            processTableHTML(items);
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
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let items = res.data;
            if (items.length === 0) {
                return;
            }
            processCreateModalCategoriesHTML(items);
        }
    });
}

/**
 * Populate View Modal
 * @param {Number} id
 */
 function populateViewModal(id) {
    $.ajax({
        url: `/api/items/${id}`,
        type: 'GET',
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let item = res.data;
            processViewModalHTML(item);
        }
    });

    $.ajax({
        url: `/api/items/${id}/categories`,
        type: 'GET',
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let categories = res.data;
            processViewModalCategoriesHTML(categories);
        }
    });

}

/**
 * Populate Edit Modal
 * @param {Number} id
 */
 function populateEditModal(id) {
    $.ajax({
        url: `/api/items/${id}`,
        type: 'GET',
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let item = res.data;
            processEditModalHTML(item);
        }
    });

    $.ajax({
        url: '/api/categories',
        type: 'GET',
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let categories = res.data;
            processEditModalCategoriesHTML(categories, id);
        }
    });

}

/**
 * Populate Delete Modal
 * @param {Number} id
 */
 function populateDeleteModal(id) {
    $.ajax({
        url: `/api/items/${id}`,
        type: 'GET',
        success: (res) => {

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let item = res.data;
            processDeleteModalHTML(item);
        }
    });

    $.ajax({
        url: `/api/items/${id}/categories`,
        type: 'GET',
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let categories = res.data;
            processDeleteModalCategoriesHTML(categories);
        }
    });

}

/**
 * Create Item
 * @param {Array} item {
 *  name: 'item 1',
 *  qty: 11,
 *  category_ids: [ 1, 2, 3]
 * }
 */
function createItem(item) {

    // Create Item
    $.ajax({
        url: '/api/items',
        type: 'POST',
        data: { name: item.name, qty: item.qty },
        dataType: 'json',
        success: (res) => {
            
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            const id = res.data.id;

            if (item.category_ids.length === 0) {
                confirm('Item Created Successfully, (No Categories)');
                window.location.reload();
                return;
            }

            // Create Item_Category
            $.ajax({
                url: `/api/items/${id}/categories`,
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'JSON',
                data: JSON.stringify({ category_ids: item.category_ids }),
                success: (res) => {

                    if (res.code !== 200) {
                        confirm(res.msg);
                        return;
                    }
        
                    confirm('Item Created Successfully');
                    window.location.reload();
                    return;
                }
            });
        }
    });
}

/**
 * Update Item
 * @param {Array} updateData {
 *  item: {
 *      id: 1,
 *      name: ItemName,
 *      qty: 11,
 *      is_deleted: 0
 *  },
 *  category: {
 *      all: [1,2,3,4,5,6]
 *      checked: [1,2,3],
 *  }
 * }
 */
 function updateItem(updateData) {

    // Update Item
    $.ajax({
        url: `/api/items/${updateData.item.id}`,
        type: 'PUT',
        data: { 
            name: updateData.item.name, 
            qty: updateData.item.qty,
            is_deleted: updateData.item.is_deleted 
        },
        dataType: 'json',
        success: (res) => {

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            // Delete All Categories
            $.ajax({
                url: `/api/items/${updateData.item.id}/categories`,
                type: 'DELETE',
                contentType: "application/json; charset=utf-8",
                dataType: 'JSON',
                data: JSON.stringify({ category_ids: updateData.category.all }),
                success: (res) => {

                    if (res.code !== 200) {
                        confirm(res.msg);
                        return;
                    }

                    // If there's no checked, skip adding new categories
                    if (updateData.category.checked.length === 0) {
                        confirm('Item Updated Successfully');
                        window.location.reload();
                        return;
                    }

                    // Add New Categories
                    $.ajax({
                        url: `/api/items/${updateData.item.id}/categories`,
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: 'JSON',
                        data: JSON.stringify({ category_ids: updateData.category.checked }),
                        success: (res) => {

                            if (res.code !== 200) {
                                confirm(res.msg);
                                return;
                            }

                            confirm('Item Updated Successfully');
                            window.location.reload();
                        }
                    });
                }
            });
        }
    });
}


/**
 * Delete Item
 * @param {Array} item {
 *  id: 1,
 *  category_ids: [ 1, 2, 3]
 * }
 */
 function deleteItem(item) {

    // Create Item
    $.ajax({
        url: `/api/items/${item.id}`,
        type: 'DELETE',
        success: (res) => {

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }
            
            confirm('Item Deleted Successfully');
            window.location.reload();
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
 * Process View Modal HTML
 * @param {Object} item
 */
function processViewModalHTML(item) {
    document.querySelector('#viewModal input[name=id]').value = item.id;
    document.querySelector('#viewModal input[name=name]').value = item.name;
    document.querySelector('#viewModal input[name=qty]').value = item.quantity;
}

/**
 * Process View Modal Categories HTML
 * @param {Object} categories
 */
function processViewModalCategoriesHTML(categories) {
    if (categories.length === 0) {
        return;
    }

    let categoriesMap = categories.map((category) => {
        return `
            <label class="badge bg-success text-white">
                ${category.name}
            </label>
        `;
    });

    document.querySelector('#viewModal .categories').innerHTML = categoriesMap.join('');
}

/**
 * Process Edit Modal HTML
 * @param {Object} item
 */
function processEditModalHTML(item) {
    document.querySelector('#editModal input[name=id]').value = item.id;
    document.querySelector('#editModal input[name=name]').value = item.name;
    document.querySelector('#editModal input[name=qty]').value = item.quantity;
}

/**
 * Process Edit Modal Categories HTML
 * @param {Object} categoriesAll
 */
function processEditModalCategoriesHTML(categoriesAll, id) {

    if (categoriesAll.length === 0) {
        return;
    }

    // Get Categories of current item
    $.ajax({
        url: `/api/items/${id}/categories`,
        type: 'GET',
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let categories = res.data;
            const currentCategoryIds = categories.map((category) => category.id);

            // Populate HTML with checked categories
            let categoriesMap = categoriesAll.map((category) => {
                return `
                    <label class="badge bg-success text-white">
                        ${category.name}
                        <input type="checkbox" ${ (currentCategoryIds.includes(category.id) === true) ? 'checked' : '' } name="category_ids" value="${category.id}">
                    </label>
                `;
            });
        
            document.querySelector('#editModal .categories').innerHTML = categoriesMap.join('');
        }
    });

}

/**
 * Process Delete Modal HTML
 * @param {Object} item
 */
 function processDeleteModalHTML(item) {
    document.querySelector('#deleteModal input[name=id]').value = item.id;
    document.querySelector('#deleteModal input[name=name]').value = item.name;
}

/**
 * Process Delete Modal Categories HTML
 * @param {Object} categories
 */
function processDeleteModalCategoriesHTML(categories) {
    if (categories.length === 0) {
        return;
    }

    let categoriesMap = categories.map((category) => {
        return `
            <label class="badge bg-primary text-white">
                ${category.name}
                <input hidden type="checkbox" name="category_ids" value="${category.id}">
            </label>
        `;
    });

    document.querySelector('#deleteModal .categories').innerHTML = categoriesMap.join('');
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
    let itemQty = document.querySelector('#createModal input[name=qty]').value;
    let categoryIds = $('#createModal input[name=category_ids]:checked').map(function() { return $(this).val() } ).get();

    createItem({
        name: itemName,
        qty: itemQty,
        category_ids: categoryIds
    });
}

/**
 * View Item Button onclick Listener
 */
 function tableViewModalButtonOnClick() {
    let itemId = $(this).data('id');
    populateViewModal(itemId);
}

/**
 * Edit Item Button onclick Listener
 */
 function tableEditModalButtonOnClick() {
    let itemId = $(this).data('id');
    populateEditModal(itemId);
}

/**
 * Delete Item Button onclick Listener
 */
 function tableDeleteModalButtonOnClick() {
    let itemId = $(this).data('id');
    populateDeleteModal(itemId);
}

/**
 * Edit Item SAVE onclick Listener
*/
function editModalSaveButtonOnClick() {
    let categoryId = document.querySelector('#editModal input[name=id]').value;
    let categoryName = document.querySelector('#editModal input[name=name]').value;


    updateCategory({
        id: categoryId,
        name: categoryName,
        is_deleted: 0,
    });
}

/**
 * Edit Item SAVE onclick Listener
*/
function editModalSaveButtonOnClick() {
    let itemId = document.querySelector('#editModal input[name=id]').value;
    let itemName = document.querySelector('#editModal input[name=name]').value;
    let itemQty = document.querySelector('#editModal input[name=qty]').value;
    let categoryIdsChecked = $('#editModal input[name=category_ids]:checked').map(function() { return $(this).val() } ).get();
    let categoryIdsAll = $('#editModal input[name=category_ids]').map(function() { return $(this).val() } ).get();

    updateItem({
        item: {
            id: itemId,
            name: itemName,
            qty: itemQty,
            is_deleted: 0,
        },
        category: {
            all: categoryIdsAll,
            checked: categoryIdsChecked
        }
    });
}

/**
 * Delete Item DELETE onclick Listener
*/
function deleteModalDeleteButtonOnClick() {
    let itemId = document.querySelector('#deleteModal input[name=id]').value;
    let categoryIds = $('#deleteModal input[name=category_ids]').map(function() { return $(this).val() } ).get();

    deleteItem({
        id: itemId,
        category_ids: categoryIds
    });
}