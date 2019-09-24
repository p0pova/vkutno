(function() {
    test = (e) => {console.log(e);}

    this.init = () => {
        console.log('INIT CHECKOUT');

        this.checkout = new Checkout();
        this.buttonBuy = document.getElementById('checkout-buy-button');
        this.ulObj = document.getElementById('checkout-list');
        
        this.buttonOrder = document.getElementById('checkout-button-order');
        this.buttonUpdate = document.getElementById('checkout-update');
        if (this.buttonOrder != undefined) {
            this.buttonOrder.addEventListener('click', this.send.bind(this));
            this.buttonUpdate.addEventListener('click', this.update.bind(this));
            this.render();
        }
        if (this.buttonBuy != undefined)
            this.buttonBuy.addEventListener('click', this.buy.bind(this));
    };

    this.render = () => {
        var html = '';
        for (var id in this.checkout.products) {
            html += '<li data-id="' + this.checkout.products[id].product.id + '"><span class="checkout-list-name">' 
                + this.checkout.products[id].product.name + 
                '</span><input id="' + this.getIdInputCount(this.checkout.products[id].product.id) + '" class="checkout-list-count" type="number" value="'
                + this.checkout.products[id].count + 
                '" /><span class="checkout-list-price">' 
                + this.checkout.products[id].product.price + 
                ' грн</span><span id="' + this.getIdDeleteBtn(this.checkout.products[id].product.id) + '" class="checkout-list-delete">x</span></li>';
        };
        this.ulObj.innerHTML = html;
        this.checkout.showSum();
        for (var id in this.checkout.products) {
            var _this = this;
            var el = document.getElementById(this.getIdDeleteBtn(this.checkout.products[id].product.id));
            el.onclick = function(event) {
                _this.checkout.clear(id);
                _this.render();
            }
        }
    };

    this.update = () => {
        for (var id in this.checkout.products) {
            var count = document.getElementById(this.getIdInputCount(this.checkout.products[id].product.id)).value;
            this.checkout.set(id, count);
        }
        this.render();
    }

    this.buy = (event) => {
        this.checkout.add(new Product(
            this.buttonBuy.dataset.id,
            this.buttonBuy.dataset.title,
            this.buttonBuy.dataset.price
        ));
    };

    this.getIdInputCount = (id) => {
        return 'input-count-' + id;
    }

    this.getIdDeleteBtn = (id) => {
        return 'delete-btn-' + id;
    }

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
            this.sumObj = document.getElementById('checkout-sum');
            this.getStor();
        };

        this.showCount = () => {
            this.checkoutCountObj.innerHTML = this.getCount();
        };

        this.showSum = () => {
            this.sumObj.innerHTML = this.getSum();
        };

        this.getCount = () => {
            var count = 0;
            for (var id in this.products) {
                count += parseInt(this.products[id].count);
            };
            return count;
        };

        this.getSum = () => {
            var sum = 0;
            for (var id in this.products) {
                sum += this.products[id].count * this.products[id].product.price;
            };
            return sum;
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

        this.set = (id, count) => {
            if (this.products[id] == undefined) {
                return;
            };
            this.products[id].count = count;
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