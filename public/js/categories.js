$(document).ready(() => {
    populateTable();
});

/**
 * Populate Category Table
 * @returns {Array}
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
                        data-toggle="modal" data-target="#viewModal">
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
