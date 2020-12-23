// -----------------
// Global Variables
// -----------------
const gallery = document.getElementById('gallery');

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

fetchData('https://randomuser.me/api/?results=12')
    .then(generateCards);

/**
 * Generate the HTML for each employee card
 * @param {Object} data JSON Object provided by fetchData
 */
function generateCards(data) {
    let cardHTML = '';
    data.results.map(employee => {
        cardHTML = `
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
    });
}

// ---------------------------
// Event Listeners
// ---------------------------