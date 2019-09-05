(function() {
    this.init = () => {
        console.log('INIT CHECKOUT');

        this.checkout = new Checkout();
        this.buttonBuy = document.getElementById('checkout-buy-button');
        this.ulObj = document.getElementById('checkout-list');
        this.buttonOrder = document.getElementById('checkout-button-order');
        this.buttonOrder.addEventListener('click', this.send.bind(this));
        if (this.buttonBuy != undefined)
            this.buttonBuy.addEventListener('click', this.buy.bind(this));
        this.render();
    };

    this.render = () => {
        var html = '';
        for (var id in this.checkout.products) {
            html += '<li>' + this.checkout.products[id].product.name + '</li>';
        };
        this.ulObj.innerHTML = html;
    };

    this.buy = (event) => {
        this.checkout.add(new Product(
            this.buttonBuy.dataset.id,
            this.buttonBuy.dataset.title,
            this.buttonBuy.dataset.price
        ));
        this.render();
    };

    this.send = (event) => {
        var text = "text%0a \
        text%0a \
        text";
        fetch(
            "https://api.telegram.org/bot" + bot + "/sendMessage?chat_id=" + room + "&text=" + text,
            {
                method: 'GET'
            });
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