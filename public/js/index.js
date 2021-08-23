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
        success: (res) => {
            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let categories = res.data;
            processCategorySelectDropdownHTML(categories);
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

            if (res.code !== 200) {
                confirm(res.msg);
                return;
            }

            let items = res.data;
            processTableHTML(items);
        }
    });
}

/**
 * Process Category Select Dropdown HTML
 * @param {Array} categories
 */
function processCategorySelectDropdownHTML (categories) {

    if (categories.length === 0) {
        return;
    }

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