$(document).ready(() => {
    populateCategorySelectDropdown();

    $('#categorySelectDropdown').on('change', function() {
        populateTable(this.value);
    });
});

/**
 * Populate Categories
 */
function populateCategorySelectDropdown() {
    $.ajax({
        url: `/api/categories`,
        type: 'GET',
        success: (res, status) => {
            if (status === 'success') {
                processCategorySelectDropdownHTML(res);
                return;
            }

            console.log(res);
        }
    });
}

/**
 * Populate Table
 * @param {Number} categoryId
 */
 function populateTable(categoryId) {
    $.ajax({
        url: `/api/categories/${categoryId}/items`,
        type: 'GET',
        success: (res, status) => {
            if (status === 'success') {
                processTableHTML(res);
                return;
            }

            console.log(res);
        }
    });
}

/**
 * Process Category Select Dropdown HTML
 * @param {Array} categories
 */
function processCategorySelectDropdownHTML (categories) {
    let categorySelectDropdownHTML = '<option selected disabled>Select Category</option>';

    categorySelectDropdownHTML += categories.map((category) => {
        return `<option value="${category.id}">${category.name}</option>`;
    }).join('');

    document.querySelector('#categorySelectDropdown').innerHTML = categorySelectDropdownHTML;
}

/**
 * Process Table HTML
 * @param {Array} items
 */
function processTableHTML(items) {

    if (items.length === 0) {
        document.querySelector('#categoryItemsTable').innerHTML = `<tr><td colspan="3" class="text-center"><span> No Items </span></td></tr>`;
        return;
    }

    let itemMap = items.map((item) => {
        return `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
            </tr>
        `;
    });

    document.querySelector('#categoryItemsTable').innerHTML = itemMap.join('');
}