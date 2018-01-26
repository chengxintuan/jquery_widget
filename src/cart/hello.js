
Webex.digitalRiver.add_prod_1step = function(prid){
    //console.log("0");
    var qty = 0;
    var old_qty = 0;
    var exit_prod;
    var del_id;

    var timestamp = (new Date()).valueOf();
    $.ajax({
        url: "https://api.digitalriver.com/v1/shoppers/me/carts/active",
        data: {
            token: token,
            method: "GET",
            format: "json",
            expand: "lineItems.lineItem.product.sku",
            t: timestamp
        },
        dataType: "jsonp",
        error: function (data) {
            var error_msg = JSON.stringify(data);
            if (error_msg.indexOf("invalid_token") > 0) {
                Webex.digitalRiver.get_token();
            }
        },
        success: function (data) {
            var error_msg = JSON.stringify(data);
            if (error_msg.indexOf("invalid_token") > 0) {
                Webex.digitalRiver.get_token();
            }
            else {
                var total_item = data.cart.totalItemsInCart;

                if (total_item > 0) {
                    var items = data.cart.lineItems.lineItem;
                    var items_count = items.length;

                    for (var i = 0; i < items_count; i++) {
                        sub_item = items[i];
                        var sub_uri = sub_item.product.uri;
                        var sub_id = sub_uri.replace("https://api.digitalriver.com/v1/shoppers/me/products/", "");
                        var sub_num = sub_item.quantity;
                        var item_id = sub_item.id;

                        for (var j = 1; j <= prod_list_num; j++) {
                            var prod_id = page_prod_lists[j][0].id;
                            if (prod_id === sub_id) {
                                exit_prod = sub_id;
                                old_qty = sub_num;
                                del_id = item_id;
                            }
                        }
                    }

                    if (exit_prod != prid) {
                        var delete_success = 0;
                        $.ajax({
                            url: 'https://api.digitalriver.com/v1/shoppers/me/carts/active/line-items/' + del_id,
                            type: 'DELETE',
                            async: false,
                            data: {
                                token: token
                            },
                            error: function () {
                            },
                            success: function (data) {
                                delete_success = 1;
                            }
                        });

                        qty = 1;
                    }
                    else {
                        qty = old_qty + 1;
                    }

                    //console.log(qty);

                    var add_url = "https://api.digitalriver.com/v1/shoppers/me/carts/active?productId=" + prid;
                    var attr_para = "&attribute=";
                    var prov_env = getQueryString("prov_env");
                    if (prov_env) {
                        attr_para = attr_para + "[name.prov_env,value." + prov_env + "],";
                    }
                    var TrackID = getQueryString("TrackID");
                    if (TrackID) {
                        attr_para = attr_para + "[name.TrackID,value." + TrackID + "],";
                    }
                    var DG = getQueryString("DG");
                    if (DG) {
                        attr_para = attr_para + "[name.DG,value." + DG + "],";
                    }
                    if(attr_para != "&attribute="){
                        attr_para = attr_para.substring(0,attr_para.length-1);
                        add_url = add_url + attr_para;
                    }

                    $.ajax({

                        url: add_url,
                        data: {
                            token: token,
                            format: "json",
                            method: "post",
                            quantity: qty,
                            expand: "lineItems.lineItem.product.sku"
                        },
                        dataType: "jsonp",
                        error: function (data) {
                        },
                        success: function (data) {
                            //console.log(data);
                            Webex.digitalRiver.checkout_prod();
                        }
                    });


                }
                else {
                    qty = 1;
                    var add_url = "https://api.digitalriver.com/v1/shoppers/me/carts/active?productId=" + prid;
                    var attr_para = "&attribute=";
                    var prov_env = getQueryString("prov_env");
                    if (prov_env) {
                        attr_para = attr_para + "[name.prov_env,value." + prov_env + "],";
                    }
                    var TrackID = getQueryString("TrackID");
                    if (TrackID) {
                        attr_para = attr_para + "[name.TrackID,value." + TrackID + "],";
                    }
                    var DG = getQueryString("DG");
                    if (DG) {
                        attr_para = attr_para + "[name.DG,value." + DG + "],";
                    }
                    if(attr_para != "&attribute="){
                        attr_para = attr_para.substring(0,attr_para.length-1);
                        add_url = add_url + attr_para;
                    }

                    $.ajax({

                        url: add_url,
                        data: {
                            token: token,
                            format: "json",
                            method: "post",
                            quantity: qty,
                            expand: "lineItems.lineItem.product.sku"
                        },
                        dataType: "jsonp",
                        error: function (data) {
                        },
                        success: function (data) {
                            //console.log(data);
                            Webex.digitalRiver.checkout_prod();
                        }
                    });
                }
            }
        }
    });
};

$(document).ready(function() {
    $(".add_dr_prod").bind("click", function () {
        var add_id = $(this).attr("addid");
        Webex.digitalRiver.add_prod_1step(add_id);
    });

    var choose_mobile_ann = document.getElementById("choose-mobile-ann");
    choose_mobile_ann.checked = true;
    var choose_mobile_ann_fixed = document.getElementById("choose-mobile-ann-fixed");
    choose_mobile_ann_fixed.checked = true;
    var choose_mobile_month = document.getElementById("choose-mobile-month");

    var choose_mobile_month_fixed = document.getElementById("choose-mobile-month-fixed");


    var w;
    var dtop;
    var max_scroll;

    $(window).scroll(function (e) {
        w = $(window).width();
        dtop = $(document).scrollTop();
        max_scroll = $(".offers-box").height() + 200;
        if (w < 768) {
            if(dtop > 250 && dtop < max_scroll){
                $(".offer-prod-plan-selection-tnt-mobile-fixed").css("display","block")
            }
            else {
                $(".offer-prod-plan-selection-tnt-mobile-fixed").css("display","none")
            }
        }
        else{
            $(".offer-prod-plan-selection-tnt-mobile-fixed").css("display","none")
        }
    });

});