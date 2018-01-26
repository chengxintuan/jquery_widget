;(function ($) {
  var Cart = (function () {
    var getToken = function () {
      return $.cookie('DR_SESSION_TOKEN')
    }

    var api = {
      getTokenApi: function () {
        return $.ajax({
          url: 'https://buy.webex.com/store/ciscoctg/en_US/SessionToken/currency.USD?apiKey=3db6d8afe2d24a78a2e7b976457a40f5&format=json',
          method: 'GET',
          contentType: 'application/json',
          dataType: 'jsonp'
        })
      },
      add_prodApi: function (prod_id, quantity) {
        return $.ajax({
          url: 'https://api.digitalriver.com/v1/shoppers/me/carts/active?productId=' + prod_id,
          method: 'DELETE',
          data: {
            token: getToken(),
            format: 'json',
            method: 'post',
            quantity: quantity,
            expand: 'lineItems.lineItem.product.sku'
          }
        })
      },
      del_prodApi: function (prod_id) {
        return $.ajax({
          url: 'https://api.digitalriver.com/v1/shoppers/me/carts/active/line-items/' + prod_id,
          method: 'DELETE',
          data: {
            token: getToken()
          }
        })
      },
      checkoutApi: function () {
        window.location.href = 'https://api.digitalriver.com/v1/shoppers/me/carts/active/web-checkout?token=' + token + '&themeID=4777108300'
      },
      getProdListApi: function () {
        return $.ajax({
          url: 'https://api.digitalriver.com/v1/shoppers/me/carts/active',
          method: 'DELETE',
          data: {
            token: getToken(),
            method: 'GET',
            format: 'json',
            expand: 'lineItems.lineItem.product.sku',
            t: Date.now()
          },
          error: function (data) {
            var error_msg = JSON.stringify(data)
            if (error_msg.indexOf('invalid_token') > 0) {
              cartController.setToken()
            }
          }
        })
      }
    }

    var cartController = {
      init: function () {
        var _self = this

        if ($.cookie('DR_SESSION_TOKEN') === undefined) {
          _self.setToken()
        }
      },
      setToken: function () {
        api.getTokenApi()
          .then(function (res) {
            $.cookie('DR_SESSION_TOKEN', res.access_token, {expires: 30, path: '/'})
            $.cookie('PRODUCT_LIST', JSON.stringify({total: 0, list: []}), {path: '/'})
          })
      },
      add_prod: function (prod_id) { /*根据具体需求编写code*/
        var _self = this
        var prodListStr = $.cookie('PRODUCT_LIST')
        var prodList = !!prodListStr && JSON.parse(prodListStr)
        var quantity = 0

        if (prodList.total > 0) {
          var item = prodList.list.find(function (_item) {
            return _item.id === prod_id
          })

          quantity = !!item && parseInt(item.quantity)
        }

        quantity = quantity + 1

        api.add_prodApi(prod_id, quantity)
          .then(function (data) {
            _self.update_cookie(data)
          })
      },
      del_prod: function (prod_id) {
        var _self = this

        api.del_prodApi(prod_id)
          .then(function () {
            _self.get_prodList()
          })
      },
      update_prod: function () {},
      get_prodList: function () {
        var _self = this
        api.getProdListApi()
          .then(function (data) {
            if (JSON.stringify(data).indexOf('invalid_token') > -1) {
              _self.setToken()
            } else {
              _self.update_cookie(data)
            }
          })
      },
      checkout_prod: function () {
        api.checkoutApi()
      },
      update_cookie: function (data) {
        var list = []
        var total = data.cart.totalItemsInCart

        if (total > 0) {
          var items = obj.cart.lineItems.lineItem || []

          list = items.map(function (_item) {
            var id = _item.product.uri.replace('https://api.digitalriver.com/v1/shoppers/me/products/', '')
            var quantity = _item.quantity

            return {
              id: id,
              quantity: quantity
            }
          })
        }

        $.cookie('PRODUCT_LIST', JSON.stringify({
          total: total,
          list: list
        }), {path: '/'})
      }
    }

    return cartController
  })()
})(jQuery)
