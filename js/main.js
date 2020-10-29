const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");


let login = localStorage.getItem('loginDelivery');

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
    modal.classList.toggle("is-open");
}

////

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

chekAuth();

function createCardRestaurant() {
    const card = `<a href="restaurant.html" class="card card-restaurant">
        <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image">
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">Пицца плюс</h3>
                    <span class="card-tag tag">50 мин</span>
                </div>       
                <div class="card-info">
                    <div class="rating">
                        4.5
                    </div>
                    <div class="price">От 900 ₽</div>
                    <div class="category">Пицца</div>
                </div>                
            </div>
    </a>`;

    cardsRestaurants.insertAdjacentHTML('beforeend', card)
}

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

function openGoods(event){
    event.preventDefault();
    const target = event.target
    const restaurant = target.closest('.card-restaurant');

    if(restaurant){
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
    }

}

console.log('cardsRestaurants', cardsRestaurants)
cardsRestaurants.addEventListener('click', openGoods)
