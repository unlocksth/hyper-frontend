$(document).ready(function () {
    $(".header__menu").find(".header__menu__link").removeClass("active");
    $(".header__menu").find("#shop__menu__link").addClass("active");

    commonProductCategory()
    getBannerOne({ no_of_image: 1 });
});

function getBannerOne(data) {
    $.ajax({
        url: "/api/getBanner",
        type: "GET",
        data: data,
        dataType: 'json',
        success: function (result) {
            if (result.status == "SUCCESS" && result.data) {
                $("#breadCrumb").safeUrl({
                    changeUrl: baseUrl + result.data[0].images[0],
                    originUrl: $("#breadCrumb").data('setbg')
                });
            }

            getDiscountProduct({ status: true })
        },
        error: function (xhr) {
           console.log("Banner ", xhr)
        }
    });
}

function getDiscountProduct(data) {
    $.ajax({
        url: "/api/getProduct",
        type: "GET",
        data: data,
        dataType: 'json',
        success: async function (result) {
            if (result.status == "SUCCESS" && result.data) {

                let discProddHtml = "",
                    discProdClone = $('#discountProduct').find('.product__discount__slider').clone()
                
                $.each(result.data, async function (Idx, Obj) {
                    discProdClone.find('a:last').text(`${Obj.name}`)
                    discProdClone.find('span:first').text(`${Obj.category_id.name}`)
                    discProdClone.find('.product__item__price').html(`${Obj.price}MMK <span>${Obj.price}MMK</span>`)
  
                    discProddHtml += discProdClone.html();
                });

                $('#discountProduct').find('.product__discount__slider').html(discProddHtml)

                /*-----------------------------
                    Product Discount Slider
                -------------------------------*/
                $(".product__discount__slider").owlCarousel({
                    loop: true,
                    margin: 0,
                    items: 3,
                    dots: true,
                    smartSpeed: 1200,
                    autoHeight: false,
                    autoplay: true,
                    responsive: {
                    
                        320: {
                            items: 1,
                        },
                    
                        480: {
                            items: 2,
                        },
                    
                        768: {
                            items: 2,
                        },
                    
                        992: {
                            items: 3,
                        }
                    }
                });

            }

            getProductSliders({ status: true })
        },
        error: function (xhr) {
           console.log("Product Slider ", xhr)
        }
    });
}

function getProductSliders(data) {
    $.ajax({
        url: "/api/getProduct",
        type: "GET",
        data: data,
        dataType: 'json',
        success: async function (result) {
            if (result.status == "SUCCESS" && result.data) {

                let lttProdClone = $('#productSliders').find('.latest-product__slider:first').clone()

                let lttProdSlideClone = lttProdClone.find('.latest-prdouct__slider__item').clone();
                    lttProdSlideHtml = "", lttProdHtml = "";
                
                $.each(result.data, async function (Idx, Obj) {
                    lttProdSlideClone.find('h6').text(`${Obj.name}`)
                    lttProdSlideClone.find('span').text(`${Obj.price}MMK`)
                    lttProdHtml += lttProdSlideClone.html();

                    if (((Idx + 1) % 3) == 0) {
                        lttProdSlideHtml += `<div class="latest-product__slider owl-carousel"><div class="latest-prdouct__slider__item">` + lttProdHtml + `</div></div>`;
                        lttProdHtml = "";
                    } 
                });

                $('#productSliders').find('.latest-product__slider:first').html(lttProdSlideHtml)

                $(".latest-product__slider").owlCarousel({
                    loop: true,
                    margin: 0,
                    items: 1,
                    dots: false,
                    nav: true,
                    navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
                    smartSpeed: 1200,
                    autoHeight: false,
                    autoplay: true
                });
            }
        },
        error: function (xhr) {
           console.log("Product Slider ", xhr)
        }
    });
}

