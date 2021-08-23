$(document).ready(() => {
    populateTable();

    // Add Event Listeners (Delegation)
    $('#categoriesTable').on('click', 'a.view-button', tableViewModalButtonOnClick);
    $('#categoriesTable').on('click', 'a.edit-button', tableEditModalButtonOnClick);
    $('#categoriesTable').on('click', 'a.delete-button', tableDeleteModalButtonOnClick);
});

/**
 * Requests
 */

/**
 * Populate Category Table
 */
function populateTable() {
    $.ajax({
        url: '/api/categories',
        type: 'GET',
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let categories = res.data;
            if (categories.length === 0) {
                return;
            }
            processTableHTML(categories);
        }
    });
}

/**
 * Populate View Modal
 * @param {Number} id
 */
 function populateViewModal(id) {
    $.ajax({
        url: `/api/categories/${id}`,
        type: 'GET',
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let category = res.data;
            processViewModalHTML(category);
        }
    });
}

/**
 * Populate Edit Modal
 * @param {Number} id
 */
 function populateEditModal(id) {
    $.ajax({
        url: `/api/categories/${id}`,
        type: 'GET',
        success: (res) => {

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let category = res.data;
            processEditModalHTML(category);
        }
    });
}

/**
 * Populate Delete Modal
 * @param {Number} id
 */
 function populateDeleteModal(id) {
    $.ajax({
        url: `/api/categories/${id}`,
        type: 'GET',
        success: (res) => {

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let category = res.data;
            processDeleteModalHTML(category);

        }
    });
}


/**
 * Create Category
 * @param {Object} category {
 *  name: 'Category Name'
 * }
 */
 function createCategory(category) {
    $.ajax({
        url: '/api/categories',
        type: 'POST',
        data: category,
        dataType: 'json',
        success: (res, status) => {

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            confirm('Added Succesfully');
            window.location.reload();
        }
    });
}

/**
 * Update Category
 * @param {Object} category {
 *  id: 1,
 *  name: 'Category Name',
 *  is_deleted: 0,
 * }
 */
 function updateCategory(category) {
    $.ajax({
        url: `/api/categories/${category.id}`,
        type: 'PUT',
        data: category,
        dataType: 'json',
        success: (res) => {

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            confirm('Updated Successfully');
            window.location.reload();

        }
    });
}

/**
 * Delete Category
 * @param {Object} category {
 *  id: 1,
 * }
 */
 function deleteCategory(category) {
    $.ajax({
        url: `/api/categories/${category.id}`,
        type: 'DELETE',
        success: (res) => {

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            confirm('Deleted Successfully');
            window.location.reload();

        }
    });
}



/**
 * Processors
 */

/**
 * Process Table HTML
 * @param {Array} categories
 */
 function processTableHTML(categories) {

    let categoriesMap = categories.map((category) => {
        return `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>
                    <div>
                        <a class="view-button btn btn-success btn-icon-split btn-sm"
                        data-toggle="modal" data-target="#viewModal" data-id="${category.id}">
                            <span class="icon text-white-50">
                                <i class="fas fa-eye"></i>
                            </span>
                            <span class="text">View</span>
                        </a>
                        <a class="edit-button btn btn-primary btn-icon-split btn-sm" 
                        data-toggle="modal" data-target="#editModal" data-id="${category.id}">
                            <span class="icon text-white-50">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span class="text">Edit</span>
                        </a>
                        <a class="delete-button btn btn-danger btn-icon-split btn-sm"
                        data-toggle="modal" data-target="#deleteModal" data-id="${category.id}">
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

    document.querySelector('#categoriesTable').innerHTML = categoriesMap.join('');

}

/**
 * Process View Modal HTML
 * @param {Array} category
 */
 function processViewModalHTML(category) {
    document.querySelector('#viewModal input[name=id]').value = category.id;
    document.querySelector('#viewModal input[name=name]').value = category.name;
}

/**
 * Process Edit Modal HTML
 * @param {Array} category
 */
 function processEditModalHTML(category) {
    document.querySelector('#editModal input[name=id]').value = category.id;
    document.querySelector('#editModal input[name=name]').value = category.name;
 }

 /**
 * Process Delete Modal HTML
 * @param {Array} category
 */
  function processDeleteModalHTML(category) {
    document.querySelector('#deleteModal input[name=id]').value = category.id;
    document.querySelector('#deleteModal input[name=name]').value = category.name;
 }

/**
 * Listeners
*/

/**
 * Add Category Button onclick Listener
 */
 function addCategoryButtonOnClick() {
    let categoryName = document.querySelector('#createModal input[name=name]').value;

    createCategory({
        name: categoryName
    });
}

/**
 * View Category Button onclick Listener
 */
 function tableViewModalButtonOnClick() {
    let categoryId = $(this).data('id');
    populateViewModal(categoryId);
}

/**
 * Edit Category Button onclick Listener
 */
 function tableEditModalButtonOnClick() {
    let categoryId = $(this).data('id');
    populateEditModal(categoryId);
}

/**
 * Edit Delete Button onclick Listener
 */
 function tableDeleteModalButtonOnClick() {
    let categoryId = $(this).data('id');
    populateDeleteModal(categoryId);
}

/**
 * Edit Category SAVE onclick Listener
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
 * Delete Category DELETE onclick Listener
*/
function deleteModalDeleteButtonOnClick() {
    let categoryId = document.querySelector('#deleteModal input[name=id]').value;

    deleteCategory({
        id: categoryId,
    });
}



