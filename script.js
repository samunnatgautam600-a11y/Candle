// Candle Product Data
const products = [
    {
        id: 1,
        name: "Cozy Bear Shaped Candle",
        category: "shaped",
        price: 450,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
        description: "Adorable handmade teddy bear soy wax candle with a sweet vanilla aura."
    },
    {
        id: 2,
        name: "Romantic Pink Rose Bloom",
        category: "floral",
        price: 350,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
        description: "Intricately detailed rose flower candle infused with soft floral fragrance."
    },
    {
        id: 3,
        name: "Mint Daisy Flower Candle",
        category: "floral",
        price: 380,
        image: "https://images.unsplash.com/photo-1596433809252-260c2745df68?auto=format&fit=crop&w=600&q=80",
        description: "Pastel mint daisy blossom candle featuring soothing lavender notes."
    },
    {
        id: 4,
        name: "Crystal Gel Glass Jar Candle",
        category: "glass",
        price: 650,
        image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
        description: "Elegant clear glass jar filled with translucent gel wax chips and warm glow."
    },
    {
        id: 5,
        name: "Honey Bear Duo Set",
        category: "shaped",
        price: 850,
        image: "https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=600&q=80",
        description: "Set of 2 cute mini bear candles crafted from 100% natural beeswax."
    },
    {
        id: 6,
        name: "Coral Blossom Daisy",
        category: "floral",
        price: 380,
        image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=600&q=80",
        description: "Vibrant coral daisy bloom candle with a subtle refreshing citrus aroma."
    }
];

// App State
let cart = [];
let isLoggedIn = false; 
let currentUser = null;

// DOM Element Selectors
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.getElementById('cart-count');

// Auth Modal Selectors
const authModal = document.getElementById('auth-modal');
const openAuthBtn = document.getElementById('open-auth-btn');
const closeAuthBtn = document.getElementById('close-auth');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Render Products Grid
function renderProducts(filter = 'all') {
    productGrid.innerHTML = '';
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-wrap">
                <img src="${p.image}" alt="${p.name}" class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${p.name}</h3>
                <p class="product-desc">${p.description}</p>
                <div class="product-bottom">
                    <span class="price">Rs. ${p.price}</span>
                    <button class="add-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Category Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// Cart Functions
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:2rem;">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Rs. ${item.price} × ${item.quantity}</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(div);
        });
    }

    cartTotalPrice.textContent = `Rs. ${total}`;
    cartCount.textContent = count;
}

function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeCart() {
    cartSidebar.classList.remove('active');
    if (!authModal.classList.contains('active')) overlay.classList.remove('active');
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);

// CHECKOUT LOGIC REQUIRES PHONE SIGN-UP / LOGIN
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty! Please add candles before checking out.");
        return;
    }

    // BLOCK CHECKOUT IF USER IS NOT LOGGED IN WITH PHONE NUMBER
    if (!isLoggedIn) {
        alert("Please Sign Up or Login with your Phone Number first to complete your order!");
        closeCart();       
        openAuthModal();   
        return;
    }

    // Process WhatsApp order with Phone Number details
    let message = `Hello Lumina Candles! Order details from ${currentUser.name} (Phone: ${currentUser.phone}):%0A%0A`;
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} (Qty: ${item.quantity}) - Rs. ${item.price * item.quantity}%0A`;
        total += item.price * item.quantity;
    });

    message += `%0ATotal Amount: Rs. ${total}%0ADelivery Location: Jhapa, Nepal`;

    window.open(`https://wa.me/9779844603100?text=${message}`, '_blank');
}

// Authentication Modal Controls
function openAuthModal() {
    authModal.classList.add('active');
    overlay.classList.add('active');
}

function closeAuthModal() {
    authModal.classList.remove('active');
    if (!cartSidebar.classList.contains('active')) overlay.classList.remove('active');
}

openAuthBtn.addEventListener('click', () => {
    if (isLoggedIn) {
        if (confirm("Are you sure you want to log out?")) {
            isLoggedIn = false;
            currentUser = null;
            openAuthBtn.innerHTML = '<i class="fa-solid fa-user"></i> Sign Up';
            alert("You have logged out.");
        }
    } else {
        openAuthModal();
    }
});

closeAuthBtn.addEventListener('click', closeAuthModal);
overlay.addEventListener('click', () => {
    closeCart();
    closeAuthModal();
});

function switchAuthTab(tab) {
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Login using Phone Number
function handleLogin(e) {
    e.preventDefault();
    const phoneInput = e.target.querySelector('input[type="tel"]').value;
    
    isLoggedIn = true;
    currentUser = { name: "Valued Customer", phone: phoneInput };
    
    openAuthBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> ${phoneInput}`;
    alert("Logged in successfully! You can now proceed to checkout.");
    closeAuthModal();
}

// Sign Up using Full Name and Phone Number
function handleSignup(e) {
    e.preventDefault();
    const nameInput = e.target.querySelector('input[type="text"]').value;
    const phoneInput = e.target.querySelector('input[type="tel"]').value;
    
    isLoggedIn = true;
    currentUser = { name: nameInput, phone: phoneInput };
    
    openAuthBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> ${nameInput}`;
    alert(`Account created successfully! Welcome ${nameInput}. You can now complete your purchase.`);
    closeAuthModal();
}

// Initialize website
renderProducts();
