$(document).ready(() => {
    populateTable();

    // Add Event Listeners (Delegation)
    $('#categoriesTable').on('click', 'a.view-button', tableViewModalButtonOnClick);
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
            if (res.length === 0) {
                return;
            }
            processTableHTML(res);
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
        success: (res, status) => {
            if (status === 'success') {
                processViewModalHTML(res);
                return;
            }

            console.log(res);
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
            if (status === 'success') {
                confirm('Added Succesfully');
                window.location.reload();
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
                        <a href="#" class="btn btn-primary btn-icon-split btn-sm" 
                        data-toggle="modal" data-target="#editModal">
                            <span class="icon text-white-50">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span class="text">Edit</span>
                        </a>
                        <a href="#" class="btn btn-danger btn-icon-split btn-sm"
                        data-toggle="modal" data-target="#deleteModal">
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



