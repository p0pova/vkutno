(function() {
    test = (e) => {console.log(e);}

    this.init = () => {
        console.log('INIT CHECKOUT');

        this.checkout = new Checkout();
        this.buttonBuy = document.getElementById('checkout-buy-button');
        this.ulObj = document.getElementById('checkout-list');
        this.blockInfoObj = document.getElementById('block-info');
        
        this.buttonOrder = document.getElementById('checkout-button-order');
        this.buttonUpdate = document.getElementById('checkout-update');
        this.inputName = document.getElementById('checkout-input-name');
        this.inputPhone = document.getElementById('checkout-input-phone');
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
            this.checkout.set(id, parseInt(count));
        }
        this.render();
    }

    this.buy = (event) => {
        this.checkout.add(new Product(
            this.buttonBuy.dataset.id,
            this.buttonBuy.dataset.title,
            this.buttonBuy.dataset.price
        ));
        this.info('Товар добавлен в корзину');
    };

    this.info = (text) => {
        this.blockInfoObj.innerHTML = text;
        this.blockInfoObj.setAttribute('style', 'display: block');
    }

    this.getIdInputCount = (id) => {
        return 'input-count-' + id;
    }

    this.getIdDeleteBtn = (id) => {
        return 'delete-btn-' + id;
    }

    this.setSendText = () => {
        var text = 'Заказ с сайта %0a';
        text += 'на сумму: ' + this.checkout.getSum() + ' грн %0a';
        text += '======================================';
        text += 'Имя: ' + this.inputName.value;
        text += 'Телефон: ' + this.inputPhone.value;
        text += '======================================';
        for (var id in this.checkout.products) {
            text += this.checkout.products[id].product.id + '. ' + this.checkout.products[id].product.name + ' - ' + this.checkout.products[id].count + ' шт %0a';
        }

        return text;
    }

    this.send = (event) => {
        if (this.checkout.getCount() == 0) {
            this.info('Корзина пуста');
            return;
        }
        if (this.inputName.value == '' || this.inputPhone.value == '') {
            this.info('Не заполнены поля покупателя');
            return;
        }
        var text = "text%0a \
        text%0a \
        text";
        var text = this.setSendText();
        this.info('Заказ отправлен');
        this.checkout.clearAll();
        console.log(text);
        return;
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

        this.clearAll = () =>{
            for (var id in this.products) {
                this.clear(id);
            };
        }

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