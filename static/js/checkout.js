(function() {
    this.init = () => {
        console.log('INIT CHECKOUT');

        this.checkout = new Checkout();
        
    };

    var Checkout = function() {
        this.init = () => {
            console.log('init checkout');

            this.products = {};
            this.getStor();
        };

        this.add = (product, count = 1) => {
            if (this.products[product.id] == undefined) {
                this.products[product.id] = {'product': product, 'count': count};
            } else {
                this.products[product.id].count += count;
            }
            this.setStor();
        };

        this.setStor = () => {
            window.localStorage['products'] = JSON.stringify(this.products);
        }

        this.getStor = () => {
            this.products = JSON.parse(window.localStorage['products']);
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