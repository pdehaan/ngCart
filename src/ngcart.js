'use strict';

function log(a){
    console.log (a);
}

angular.module('ngCart', [])

    .config([function () {

    }])

    .provider('$ngCart', function () {

        var shipping = false;
        var tax = false;

        this.$get = function () {

        };

    })

    .run(['ngCart', function (ngCart) {

        if (Modernizr.localstorage && angular.isArray(JSON.parse(localStorage.getItem('cart')))) {
            ngCart.setCart(JSON.parse(localStorage.getItem('cart')));
        } else {
            ngCart.setCart([]);
        }

    }])

    .service('ngCart', ['ngCartItem', function (ngCartItem) {


        this.setShipping = function(shipping){
            this.$cart.shipping = shipping;
        }

        this.setTax = function(tax){
            this.$cart.tax = tax;
        }

        this.getShipping = function(){
            if (this.getCart().length == 0) return 0;
            return  this.getCart().shipping;
        }


        this.getTax = function(){
            return ((this.getSubTotal()/100) * this.getCart().tax );
        }

        this.setCart = function (cart) {
            this.$cart = cart;
        }

        this.getCart = function(){
            return this.$cart;
        }

        this.addItem = function (id, name, price, quantity, data) {

            if (!quantity) quantity = 1;
            quantity = parseInt(quantity);
            price = parseInt(price);

            var inCart = this.itemInCart(id)

            if (inCart !== false){
                this.quantity(inCart, quantity);
            } else {
            //var i =  angular.copy(ngCartItem); // TODO: This might be better achieved with a new constructor
           // i.setItem(item);
                var i = {
                    id: id,
                    name: name,
                    price: price,
                    quantity: quantity,
                    data: data
                }
                this.$cart.push(i);
            }
           this.$saveCart(this.$cart);
        };

        this.itemInCart = function (itemId) {
            var a=  _.find(this.getCart(), {id:itemId});
            if (a === undefined) return false
            else return a;
        }

        this.totalItems = function () {
            return this.getCart().length;
        }

        this.getSubTotal = function(){
            var total = 0;
            angular.forEach(this.getCart(), function (item) {
                total += (item.price * item.quantity);
            });
            return total;
        }


        this.totalCost= function () {
            var shipping = (!this.getShipping() ? 0 : this.getShipping());
            var tax = (!this.getTax() ? 0 : this.getTax());
            return this.getSubTotal() + shipping + tax;
        }

        this.quantity = function (item, offset) {
            var quantity = item.quantity + offset;
            if (quantity < 1) quantity = 1;
            item.quantity = quantity;
            this.$saveCart();
        }

        this.removeItem = function (index) {
            this.$cart.splice(index, 1);
            this.$saveCart(this.$cart);
        }

        this.empty = function () {
            this.$cart = [];
            if (Modernizr.localstorage)  localStorage.removeItem('cart');
        }

        this.$saveCart = function () {
            if (Modernizr.localstorage)  localStorage.setItem('cart', JSON.stringify(this.getCart()));

        }

    }])

    .service('ngCartItem', [ function () {
        this.$item = null;        
        this.$quantity = 1;
        
        this.getTotal = function(){
            return this.$quantity * this.$item.price;
        }
        this.getQuantity = function(){
            return this.$quantity;
        }

        this.getItem = function(){
            return this.$item;
        }

        this.setItem = function (item){
             this.$item = item;
        }
        this.setQuantity = function (int){
             this.$quantity = int;
        }

    }])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart){

        $scope.scopeCart = ngCart;


    }])

    .directive('addtocart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : ['$scope',  function($scope){
                $scope.ngCart = ngCart;
            }],
            scope: {
                id:'@',
                name:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: '/template/addtocart.html',
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return ngCart.itemInCart(attrs.id);
                }
            }
        };
    }])

    .directive('cart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : ['$scope',  function($scope){
                $scope.ngCart = ngCart;
            }],
            scope: {},
            templateUrl: '/template/cart.html',
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('summary', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : ['$scope',  function($scope){
                $scope.ngCart = ngCart;
            }],
            scope: {},
            transclude: true,
            templateUrl: '/template/summary.html'

        };
    }])

    .value('version', '0.1')
    .value('key', 'test');


