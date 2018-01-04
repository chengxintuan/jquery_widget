;(function ($) {
    var Cart = (function () {
        var getToken = function () {
            return $.cookie("DR_SESSION_TOKEN");
        }

        var api = {
            getTokenApi: function () {
                return $.ajax({
                    url: 'https://buy.webex.com/store/ciscoctg/en_US/SessionToken/currency.USD?apiKey=3db6d8afe2d24a78a2e7b976457a40f5&format=json',
                    method: 'GET',
                    contentType: 'application/json',
                    dataType: 'jsonp'
                }).then(function (data) {
                    $.cookie("DR_SESSION_TOKEN", data.access_token, {expires: 30, path: '/'});
                    return data;
                });
            },
            add_prodApi: function (prod_id, quantity) {
                return $.ajax({
                    url: "https://api.digitalriver.com/v1/shoppers/me/carts/active?productId=" + prod_id,
                    method: 'DELETE',
                    data: {
                        token: getToken(),
                        format: "json",
                        method: "post",
                        quantity: quantity,
                        expand: "lineItems.lineItem.product.sku"
                    }
                });
            },
            del_prodApi: function (prod_id) {
                return $.ajax({
                    url: 'https://api.digitalriver.com/v1/shoppers/me/carts/active/line-items/' + prod_id,
                    method: 'DELETE',
                    data: {
                        token: getToken()
                    }
                });
            },
            checkoutApi: function () {
                window.location.href = "https://api.digitalriver.com/v1/shoppers/me/carts/active/web-checkout?token=" + token + "&themeID=4777108300";
            },
            getProdListApi: function () {
                return $.ajax({
                    url: 'https://api.digitalriver.com/v1/shoppers/me/carts/active',
                    method: 'DELETE',
                    data: {
                        token: getToken(),
                        method: "GET",
                        format: "json",
                        expand: "lineItems.lineItem.product.sku",
                        t: Date.now()
                    },
                    error: function (data) {
                        var error_msg = JSON.stringify(data);
                        if (error_msg.indexOf("invalid_token") > 0) {
                            api.getTokenApi();
                        }
                    },
                });
            }
        }

        var init = function () {
            if ($.cookie("DR_SESSION_TOKEN") === undefined) {
                api.getTokenApi();
            }
        }

        return {
            init: init,

        }
    })();
})(jQuery);