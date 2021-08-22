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