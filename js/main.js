'use strict'

// import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';

let login = localStorage.getItem('loginDelivery');

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const btnAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants')
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');



const getData = async function (url){

    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`Error status ${response.status}, url ${url}`)
    }

    return await response.json();
}


function toggleModal() {
    modal.classList.toggle("is-open");
}

function toggleModalAuth() {
    modalAuth.classList.toggle("is-open");
}

function authorized() {
    userName.textContent = login;

    function logOut() {
        login = null;
        localStorage.removeItem('loginDelivery');

        btnAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';
        buttonOut.removeEventListener('click', logOut);
        chekAuth();
    }

    btnAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';

    buttonOut.addEventListener('click', logOut);

}

function notAuthorized() {

    function logIn(event) {
        event.preventDefault();
        login = loginInput.value;

        localStorage.setItem('loginDelivery', login);

        if (login) {
            toggleModalAuth();
            btnAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            logInForm.removeEventListener('submit', logIn);
            loginInput.value = '';
            chekAuth();
        } else {
            alert('Input name!')
        }
    }

    btnAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);

}

function chekAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized()
    }
}

function createCardRestaurant(restaurant) {

    const {image, kitchen, name, price, products, time_of_delivery: timeOfDelivery, stars} = restaurant;

    const cardRestaurant = document.createElement('a');
    cardRestaurant.className = 'card card-restaurant';
    cardRestaurant.products = products;
    cardRestaurant.info = {kitchen, name, price, stars };


    const card = `
        <img src=${image} alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${timeOfDelivery}</span>
                </div>       
                <div class="card-info">
                    <div class="rating">
                        ${stars}
                    </div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                </div>                
            </div>
`;
    cardRestaurant.insertAdjacentHTML('beforeend', card)
    cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant)
}

function createCardGood(product) {

    const {description, id, image, name, price} = product;

    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
    <a href="restaurant.html" class="card card-restaurant">
        <img src=${image} alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">50 мин</span>
                </div>       
                <div class="card-info">
                ${description}
                    <div class="rating">
                        4.5
                    </div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">Пицца</div>
                </div>                
            </div>
    </a>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);

    console.log(card);
}

function openGoods(event) {

    event.preventDefault();
    const target = event.target
    const restaurant = target.closest('.card-restaurant');

    if (restaurant) {
        console.log(restaurant.dataset)
        cardsMenu.textContent = '';
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');

        const {name, kitchen, price, stars} = restaurant.info;

        restaurantTitle.textContent = name;
        restaurantRating.textContent = stars;
        restaurantPrice.textContent = `от ${price} рублей`;
        restaurantCategory.textContent = kitchen;
        location.hesh =`#${name}`;

        getData(`./db/${restaurant.products}`)
            .then(data => {
                data.forEach(createCardGood)
            })

        createCardGood();
    }
}

function init(){
    getData('./db/partners.json').then((data) => {
        data.forEach(createCardRestaurant)
    })

    cartButton.addEventListener("click", toggleModal);

    close.addEventListener("click", toggleModal);

    cardsRestaurants.addEventListener('click', openGoods);

    logo.addEventListener('click', () => {
        containerPromo.classList.remove('hide');
        restaurants.classList.remove('hide');
        menu.classList.add('hide');
    });

    chekAuth();

    inputSearch.addEventListener('keypress', function (event) {

        if(event.charCode === 13){

            const value = event.target.value;

            if(!value){
                event.target.style.backgroundColor = 'red';
                event.target.value = 'What do you want to find?'
                // event.target.value = '';

                setTimeout(() => {
                    event.target.style.backgroundColor = '';
                    event.target.value = '';
                }, 1500)

                return;
            }
                getData('./db/partners.json')
                .then(data => {
                    return data.map(item => item.products)
                })
                .then(links => {
                    links.forEach(item => {
                        getData(`./db/${item}`)
                            .then(data => {

                                const resultSearch = data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
                                console.log(resultSearch)

                                containerPromo.classList.add('hide');
                                restaurants.classList.add('hide');
                                menu.classList.remove('hide');

                                restaurantTitle.textContent = 'Результат поиска';
                                restaurantRating.textContent = '';
                                restaurantPrice.textContent = ``;
                                restaurantCategory.textContent = `Разное`;
                                resultSearch.forEach(createCardGood)
                            })
                    })

                })
        }
    })
}

init();

//Slider
new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    effect: 'coverflow',
    scrollbar:{
        el: '.swiper-scrollbar',
        draggable: true
    }
})