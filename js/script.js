// -----------------
// Global Variables
// -----------------
const gallery = document.getElementById('gallery');
const search = document.querySelector('.search-container');
let employeeList = {};
let searchedList = {};

/**
 * Check the status of the URL and convert it to JSON, console log errors
 * @param {String} url The URL of the API 
 */
function fetchData(url) {
    return fetch(url)
            .then(checkStatus)
            .then(response => response.json())
            .catch(error => console.log('There was an error:', error));
}

/**
 * Check the status of the Promise fetched with fetchData
 * @param {Promise} response The Promise fetched with fetchData 
 */
function checkStatus(response) {
    if(response.ok) {
       return Promise.resolve(response); 
    } else {
       return Promise.reject(new Error(response.statusText)); 
    }
 }

// ---------------------------
// Fetch Data & Generate Cards
// ---------------------------

fetchData('https://randomuser.me/api/?results=12&nat=us')
    .then(saveEmployeeList)
    .then(generateCards)
    .then(generateSearch);

/**
 * Save Employee list object to the employees variable
 * @param {Object} data Object holding all of the employee names 
 */
function saveEmployeeList(data) {
    employeeList = data;
    searchedList = employeeList;
    return data;
}

/**
 * Generate the HTML for each employee card
 * @param {Object} data JSON Object provided by fetchData
 */
function generateCards(data) {
    data.results.map(employee => {
        // Add Card HTML
        const cardHTML = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${employee.picture.large}" alt="${employee.name.first} ${employee.name.last}">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>
        `;
        gallery.insertAdjacentHTML('beforeend', cardHTML);
        gallery.lastElementChild.addEventListener('click', e => {
            const index = searchedList.results.indexOf(employee);
            generateModal(employee, index);
        });
    });
}

/**
 * Display the modal with the employee data that was clicked
 * @param {Object} data The data of the employee card currently clicked
 */
function generateModal(data, index) {
    const employee = data;    
    const dob = new Date(employee.dob.date);

    const modalHTML = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employee.picture.large}" alt="${employee.name.first} ${employee.name.last}">
                    <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="modal-text">${employee.email}</p>
                    <p class="modal-text cap">${employee.location.city}</p>
                    <hr>
                    <p class="modal-text">${employee.phone}</p>
                    <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                    <p class="modal-text">Birthday: ${dob.getMonth() + 1}/${dob.getDate()}/${dob.getFullYear()}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // If there is no next employee
    if (!searchedList.results[index+1]) {
        // Remove the next button
        document.querySelector('#modal-next').style.visibility = 'hidden';
    } else {
        // Else add event listener to next button
        document.querySelector('#modal-next').addEventListener('click', () => {
            removeModal();
            generateModal(searchedList.results[index+1], index+1);
        });
    }

    // If there is no previous employee
    if (!searchedList.results[index-1]) {
        // Remove the previous button
        document.querySelector('#modal-prev').style.visibility = 'hidden';
    } else {
        // Else add event listener to previous button
        document.querySelector('#modal-prev').addEventListener('click', () => {
            removeModal();
            generateModal(searchedList.results[index-1], index-1);
        });
    }

    document.querySelector('#modal-close-btn').addEventListener('click', () => {
        removeModal();
    });
}

function removeModal() {
    document.querySelector('.modal-container').remove();
}

// ---------------------------
// Add Search Form
// ---------------------------

function generateSearch() {
    const searchHTML = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
    search.insertAdjacentHTML('beforeend', searchHTML);
}