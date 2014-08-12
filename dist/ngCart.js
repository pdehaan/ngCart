/*! ngCart v0.0.1 */
 "use strict";function log(a){console.log(a)}angular.module("ngCart",[]).config([function(){}]).provider("$ngCart",function(){this.$get=function(){}}).run(["ngCart",function(a){Modernizr.localstorage&&angular.isArray(JSON.parse(localStorage.getItem("cart"))),a.init()}]).service("ngCart",["ngCartItem",function(a){this.init=function(){this.$cart={shipping:null,tax:null,items:[]}},this.addItem=function(b,c,d,e,f){var g=this.itemInCart(b);g!==!1?this.quantity(g.setQuantity(1,!0)):this.$cart.items.push(new a(b,c,d,e,f)),this.$saveCart(this.$cart)},this.itemInCart=function(a){var b=_.find(this.getCart().items,{_id:a});return void 0===b?!1:b},this.setShipping=function(a){this.$cart.shipping=a},this.getShipping=function(){return 0==this.getCart().items.length?0:this.getCart().shipping},this.setTax=function(a){this.$cart.tax=a},this.getTax=function(){return this.getSubTotal()/100*this.getCart().tax},this.setCart=function(a){this.$cart=a},this.getCart=function(){return this.$cart},this.totalItems=function(){return this.getCart().items.length},this.getSubTotal=function(){var a=0;return angular.forEach(this.getCart().items,function(b){a+=b.getTotal()}),a},this.totalCost=function(){return this.getSubTotal()+this.getShipping()+this.getTax()},this.removeItem=function(a){this.$cart.splice(a,1),this.$saveCart(this.$cart)},this.empty=function(){this.$cart=[],Modernizr.localstorage&&localStorage.removeItem("cart")},this.$saveCart=function(){Modernizr.localstorage&&localStorage.setItem("cart",JSON.stringify(this.getCart()))}}]).factory("ngCartItem",[function(){var a=function(a,b,c,d,e){this.setId(a),this.setName(b),this.setPrice(c),this.setQuantity(d),this.setData(e)};return a.prototype.setId=function(a){a?this._id=a:console.error("A ID must be provided")},a.prototype.getId=function(){return this._id},a.prototype.setName=function(a){a?this._name=a:console.error("A name must be provided")},a.prototype.getName=function(){return this._name},a.prototype.setPrice=function(a){var a=parseFloat(a);a?(0>=a&&console.error("A price must be over 0"),this._price=a):console.error("A price must be provided")},a.prototype.getPrice=function(){return this._price},a.prototype.setQuantity=function(a,b){var a=parseInt(a);a%1===0?b===!0?(this._quantity+=a,this._quantity<1&&(this._quantity=1)):this._quantity=a:(this._quantity=1,console.info("Quantity must be an integer and was defaulted to 1"))},a.prototype.getQuantity=function(){return this._quantity},a.prototype.setData=function(a){a&&(this._data=a)},a.prototype.getData=function(){return this._data?this._data:void console.info("This item has no data")},a.prototype.getTotal=function(){return this.getQuantity()*this.getPrice()},a}]).controller("CartController",["$scope","ngCart",function(a,b){a.scopeCart=b}]).directive("addtocart",["ngCart",function(a){return{restrict:"E",controller:["$scope",function(b){b.ngCart=a}],scope:{id:"@",name:"@",quantity:"@",price:"@",data:"="},transclude:!0,templateUrl:"/template/addtocart.html",link:function(b,c,d){b.attrs=d,b.inCart=function(){return a.itemInCart(d.id)}}}}]).directive("cart",["ngCart",function(a){return{restrict:"E",controller:["$scope",function(b){b.ngCart=a}],scope:{},templateUrl:"/template/cart.html",link:function(){}}}]).directive("summary",["ngCart",function(a){return{restrict:"E",controller:["$scope",function(b){b.ngCart=a}],scope:{},transclude:!0,templateUrl:"/template/summary.html"}}]).value("version","0.2");