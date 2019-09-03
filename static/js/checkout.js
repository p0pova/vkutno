(function() {
    this.init = () => {
        console.log('INIT CHECKOUT');

        this.checkout = new Checkout();
        this.button = document.getElementById('checkout-buy-button');
        if (this.button != undefined)
            this.button.addEventListener('click', this.buy.bind(this));
    };

    this.buy = (event) => {
        this.checkout.add(new Product(
            this.button.dataset.id,
            this.button.dataset.title,
            this.button.dataset.price
        ));
    };

    var Checkout = function() {
        this.init = () => {
            console.log('init checkout');

            this.products = {};
            this.checkoutCountObj = document.getElementById('checkout-bar-count');
            this.getStor();
        };

        this.showCount = () => {
            this.checkoutCountObj.innerHTML = this.getCount();
        };

        this.getCount = () => {
            var count = 0;
            for (var id in this.products) {
                count += this.products[id].count;
            };
            return count;
        };

        this.add = (product, count = 1) => {
            if (this.products[product.id] == undefined) {
                this.products[product.id] = {'product': product, 'count': count};
            } else {
                this.products[product.id].count += count;
            }
            this.setStor();
        };
        
        this.del = (id, count = 1) => {
            if (this.products[id] == undefined) {
                return;
            };
            this.products[id].count -= count;
            if (this.products[id].count <= 0) {
                delete this.products[id];
            };
            this.setStor();
        };

        this.clear = (id) => {
            if (this.products[id] == undefined) {
                return;
            };
            delete this.products[id];
            this.setStor();
        };

        this.setStor = () => {
            window.localStorage['products'] = JSON.stringify(this.products);
            this.showCount();
        }
        
        this.getStor = () => {
            if (window.localStorage['products'] != undefined) {
                this.products = JSON.parse(window.localStorage['products']);
                this.showCount();
            }
        }

        this.init();
    };

    var Product = function(id, name, price) {
        this.init = (id, name, price) => {
            console.log('init product');

            this.id = id;
            this.name = name;
            this.price = price;
        };

        this.init(id, name, price);
    };

    

    this.init();
})();