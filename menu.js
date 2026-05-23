async function loadMenus() {

    const response = await fetch("menu.json");
    const menus = await response.json();

    const favoriteGrid = document.getElementById("favoriteGrid");

    favoriteGrid.innerHTML = menus.map(menu => `
        <div class="favorite-card">

            <img 
                src="${menu.image_url}" 
                alt="${menu.name}"
                class="favorite-img"
                loading="lazy"
            >

            <div class="favorite-content">

                <h3>${menu.name}</h3>

                <p>${menu.description}</p>

                <div class="favorite-bottom">

                    <span class="favorite-price">
                        Rp ${Number(menu.price).toLocaleString("id-ID")}
                    </span>

                    <button class="buy-btn">
                        Buy Now
                    </button>

                </div>

            </div>

        </div>
    `).join("");
}

loadMenus();