/* Makes jQuery accessible via $ using function escope because tray load another lib which creates conflict with jQuery $ */
(function ($) {
  $.fn.changeElementType = function (newType) {
    var attrs = {};

    $.each(this[0].attributes, function (idx, attr) {
      attrs[attr.nodeName] = attr.nodeValue;
    });

    this.replaceWith(function () {
      return $("<" + newType + "/>", attrs).append($(this).contents());
    });
  };

  $(".tracking-search").on("click", function (event) {
    event.preventDefault();
    var code = $(".tracking-number input").val(),
      url = $(".tracking-number input").data("rastreio");
    window.open(url + code + "/");
  });

  Number.prototype.formatMoney = function (
    precision = 2,
    decimal = ".",
    thousands = ",",
    withCurrency = false,
  ) {
    const placeholderRegex = /{{\s*(\w+)\s*}}/;
    const format = "R$ {{amount}}";

    let number = this.toFixed(precision);

    let parts = number.split(".");
    let dollarsAmount = parts[0].replace(
      /(\d)(?=(\d\d\d)+(?!\d))/g,
      `$1${thousands}`,
    );
    let centsAmount = parts[1] ? decimal + parts[1] : "";
    let value = dollarsAmount + centsAmount;

    return withCurrency ? format.replace(placeholderRegex, value) : value;
  };

  window.theme = {
    ...window.theme,

    settings: {
      lastScrollPosition: 0,
      storeId: 0,
      productVariantsQuantities: null,
      productThumbs: null,
      productGallery: null,
      productGalleryPerView: 1,
      productGalleryView: null,
    },

    /* General */

    recoveryStoreId: function () {
      this.settings.storeId = $("html").data("store");
    },

    resets: function () {
      // logo tray
      let trayLogo = $(".logotray-message a");
      trayLogo
        .attr("rel", "noopener")
        .attr("href", trayLogo.attr("href").replace("http", "https"));

      // modal remove id duplcate

      $('[role="dialog"] .modal-title').removeAttr("id");

      /* Advanced search page */
      $('.page-search #Vitrine input[type="image"]').after(
        '<button type="submit" class="botao-commerce">BUSCAR</button>',
      );
      $('.page-search #Vitrine input[type="image"]').remove();
      $(".advancedSearchFormBTimg").addClass("botao-commerce");

      $('.page-central_senha input[type="image"]')
        .after(
          '<button type="submit" class="botao-commerce">CONTINUAR</button>',
        )
        .remove();
      $(".caixa-cadastro #email_cadastro").attr("placeholder", "Seu e-mail");

      $('#imagem[src*="filtrar.gif"]').after(
        '<button type="submit" class="botao-commerce">Filtrar</button>',
      );
      $('#imagem[src*="filtrar.gif"]').remove();

      $('input[src*="gerarordem.png"]').after(
        '<button type="submit" class="botao-commerce">Gerar ordem de devolu&ccedil;&atilde;o</button>',
      );
      $('input[src*="gerarordem.png"]').remove();
      $(".txt-forma-pagamento").each(function () {
        $(this).text($(this).text().replace(" - Vindi", ""));
      });
    },

    initMasks: function () {
      let phoneMaskBehavior = function (val) {
        return val.replace(/\D/g, "").length === 11
          ? "(00) 00000-0000"
          : "(00) 0000-00009";
      };

      let phoneMaskOptions = {
        onKeyPress: function (val, e, field, options) {
          field.mask(phoneMaskBehavior.apply({}, arguments), options);
        },
      };

      $(".phone-mask").mask(phoneMaskBehavior, phoneMaskOptions);

      $(".zip-code-mask").mask("00000-000");
    },

    initLazyload: function (selector = ".lazyload") {
      new LazyLoad({
        elements_selector: selector,
      });
    },

    newsletter: function () {
      if ($(".modal-newsletter").length) {
        var timeout = $(".modal-newsletter").attr("data-time"); // milliseconds
        var cookie_expire = $(".modal-newsletter").attr("data-frequency"); // days

        var cookie = localStorage.getItem("news_popup");
        if (cookie == undefined || cookie == null) {
          cookie = 0;
        }

        if (
          (new Date().getTime() - cookie) / (1000 * 60 * 60 * 24) >
          cookie_expire
        ) {
          setTimeout(() => {
            $(".modal-newsletter").addClass("show");
          }, timeout);

          $(
            ".modal-newsletter .close-icon, .modal-newsletter .modal-shadow",
          ).click(() => {
            localStorage.setItem("news_popup", new Date().getTime());
          });
        }
      }
    },

    exitPopup: function () {
      if ($(".modal-exit-sales").length) {
        var cookie_expire = $(".modal-exit-sales").attr("data-frequency"); // days

        var cookie = localStorage.getItem("exit_popup");
        if (cookie == undefined || cookie == null) {
          cookie = 0;
        }

        if (
          (new Date().getTime() - cookie) / (1000 * 60 * 60 * 24) >=
          cookie_expire
        ) {
          $(document).mouseleave(function (e) {
            if (e.clientY < 0) {
              $(".modal-exit-sales").addClass("show");
              localStorage.setItem("exit_popup", new Date().getTime());
            }
          });
        }

        $(
          ".modal-exit-sales .close-icon, .modal-exit-sales .modal-shadow",
        ).click(() => {
          $(".modal-exit-sales").removeClass("show");
          setTimeout(() => {
            $(".modal-exit-sales").remove();
          }, 150);
        });

        // swiper slide exit sales
        if ($(".product-exit-sale-content").length) {
          let sizeProdExitItem = $(".product-exit-sale-content .item").length;
          if (sizeProdExitItem >= 1) {
            new Swiper(".products-exit-sales-wrapper .swiper-container", {
              loop: false,
              spaceBetween: 0,
              reverseDirection: false,
              slidesPerView: 3,
              autoplay: {
                delay: 3000,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              },
              lazy: {
                loadPrevNext: true,
              },
              navigation: {
                nextEl: ".btn-next",
                prevEl: ".btn-prev",
              },
            });
          }
        }

        if ($(".btn-copy-cupom").length) {
          // click button copy cupom code
          $(".btn-copy-cupom").click(function () {
            let cupomCode = $(".cupom").text();
            let $temp = $("<input>");
            $("body").append($temp);
            $temp.val(cupomCode).select();
            document.execCommand("copy");
            $temp.remove();
            $(".cupom").text("Copiado");
          });
        }
      }
    },

    getLoader: function (message = null) {
      return `
                <div class="loader show">
                    <div class="spinner">
                        <div class="double-bounce-one"></div>
                        <div class="double-bounce-two"></div>
                    </div>
                    ${message ? `<div class="message">${message}</div>` : ""}
                </div>`;
    },

    scrollToElement: function (target, adjust = 0) {
      if (target && target !== "#") {
        $("html,body").animate(
          {
            scrollTop: Math.round($(target).offset().top) - adjust,
          },
          600,
        );
      }
    },

    overlay: function () {
      $('[data-toggle="overlay-shadow"]').on("click", function () {
        let target = $($(this).data("target"));
        target.addClass("show").attr("data-overlay-shadow-target", "");

        $(".overlay-shadow").addClass("show");
        $("body").addClass("overflowed");
      });

      $(".overlay-shadow").on("click", function () {
        $("[data-overlay-shadow-target]")
          .removeClass("show")
          .removeAttr("data-overlay-shadow-target");
        $(".overlay-shadow").removeClass("show");
        $("body").removeClass("overflowed");
        $(".search-bar-mobile").removeClass("show");
      });

      $(".close-overlay").on("click", function () {
        $(".overlay-shadow").trigger("click");
      });
    },

    toggleModalTheme: function () {
      $("body").on("click", '[data-toggle="modal-theme"]', function () {
        $($(this).data("target")).addClass("show");
      });

      $(
        ".modal-theme:not(.no-action) .modal-shadow, .modal-theme:not(.no-action) .close-icon",
      ).on("click", function () {
        $(".modal-theme").removeClass("show");
      });
    },

    generateBreadcrumb: function (local = "") {
      let items;
      let breadcrumb = "";
      let pageName = document.title.split(" - ")[0];

      if (local == "news-page") {
        items = [
          { text: "Home", link: "/" },
          { text: "Not&iacute;cias", link: "/noticias" },
          { text: pageName },
        ];
      } else {
        items = [{ text: "Home", link: "/" }, { text: pageName }];
      }

      $.each(items, function (index, item) {
        if (this.link) {
          breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <a itemprop="item" class="t-color" href="${item.link}">
                                <span itemprop="name">${item.text}</span>
                            </a>
                            <meta itemprop="position" content="${index + 1}" />
                        </li>   
                    `;
        } else {
          breadcrumb += `
                        <li class="breadcrumb-item flex align-center" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <span itemprop="name">${item.text}</span>
                            <meta itemprop="position" content="${index + 1}" />
                        </li>          
                    `;
        }
      });

      $(".page-content > .container").prepend(`
                <ol class="breadcrumb flex f-wrap" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumb}
                </ol>
            `);
    },

    processRteElements: function () {
      $(`.col-panel .tablePage, 
               .page-extra .page-content table, 
               .page-extras .page-content table, 
               .board_htm table,
               .rte table,
               .page-noticia table
            `).wrap('<div class="table-overflow"></div>');

      $(`.page-noticia iframe[src*="youtube.com/embed"], 
               .page-noticia iframe[src*="player.vimeo"],
               .board_htm iframe[src*="youtube.com/embed"],
               .board_htm iframe[src*="player.vimeo"],
               .rte iframe[src*="youtube.com/embed"],
               .rte iframe[src*="player.vimeo"]
            `).wrap('<div class="rte-video-wrapper"></div>');
    },

    loadThemeVersion: function () {
      const themeVersion = Cookies.get("theme-version");

      if (themeVersion) {
        $("html").attr("data-tray-theme-version", themeVersion);
        return;
      }

      $.getJSON(
        `${theme.themePath}js/version.json?t=${Date.now()}`,
        function (data) {
          Cookies.set("theme-version", data.version, { expires: 7 });
          $("html").attr("data-tray-theme-version", data.version);
        },
      );
    },

    powerDisplay: function () {
      if ($(".plugoo-side-showcase ").length) {
        $(".plugoo-side-showcase .tablist li").on("click", function () {
          if (!$(this).is(".active")) {
            $(".plugoo-side-showcase .tablist li").removeClass("active");
            const tab = $(this).attr("class");
            $(this).addClass("active");
            $(`.plugoo-side-products`).removeClass("active");
            $(`#${tab}`).addClass("active");
          }
        });
        $(".plugoo-side-showcase .tablist li:first-child").click();

        $(".plugoo-side-button, .shadow.side-showcase").on(
          "click",
          function () {
            $(".plugoo-side-showcase").toggleClass("active");
            $("body").toggleClass("not-scroll");
          },
        );

        if ($(".plugoo-products-history").length) {
          const locale = $(
            ".plugoo-side-products .plugoo-products-history .content",
          );

          preHTML = function (linkProd, imgProd, nameProd, priceProd, formPay) {
            return `
                            <div class="item item-actions-fixed">
                            <div class="product-side flex items-center">
                            <div class="image">
                            <a class="" href="${linkProd}">
                            <img class="small-img" src="${imgProd}" data-src="${imgProd}" alt="${nameProd}">
                            </a>
                            </div>
                            <a class="product-info">
                            <div class="product-name">
                            ${nameProd}
                            </div>
                            <div class="product-price">
                            <div class="price display-cash">
                            
                            <span class="current-price">
                            ${priceProd != "0.00" ? `R$ ${priceProd.replace(".", ",")}` : ""}
                            </span>
                            
                            <span class="product-installments">
                            ${formPay}
                            </span>
                            </div>
                            </div>
                            </a>
                            <div class="actions actions-fixed">
                            <a class="product-button" href="${linkProd}">
                            VER MAIS
                            </a>
                            </div>
                            </div>
                            </div>`;
          };

          clearHistory = function () {
            loading(locale, true);
            localStorage.removeItem("historyProds");
            $(".plugoo-products-history .content .products").html(
              `<span class="empty">Voc&ecirc; n&atilde;o visualizou nenhum produto anteriormente</span>`,
            );
            $(".plugoo-products-history .history-actions").remove();
            loading(locale, false);
          };

          $(".item .product a").on("click", function () {
            let historyProds = [];
            if (localStorage.getItem("historyProds")) {
              historyProds = JSON.parse(localStorage.getItem("historyProds"));
            }
            const prodClicked = $(this)
              .closest(".item")
              .find(".actions")
              .data("product");
            if (!prodClicked) return;

            if (!historyProds.includes(prodClicked)) {
              historyProds.push(prodClicked);
              fetch(`/web_api/products/${prodClicked}`)
                .then(function (response) {
                  if (!response.ok) {
                    throw new Error("Erro ao carregar os dados");
                  }
                  return response.json();
                })
                .then(function (data) {
                  const imgProd =
                    data.Product.ProductImage[0].thumbs["30"].https;
                  const nameProd = data.Product.name;
                  const formPay = data.Product.payment_option_html;
                  const linkProd = data.Product.url.https;
                  const priceProd = data.Product.price;

                  const HTMLCreated = preHTML(
                    linkProd,
                    imgProd,
                    nameProd,
                    priceProd,
                    formPay,
                  );

                  if (
                    $(
                      ".plugoo-side-products .plugoo-products-history .products .item",
                    ).length >= 1
                  ) {
                    $(
                      ".plugoo-side-products .plugoo-products-history .products",
                    ).prepend(HTMLCreated);
                  } else {
                    $(
                      ".plugoo-side-products .plugoo-products-history .empty",
                    ).remove();
                    $(
                      "#tab-2 .container:not(.plugoo-products-history)",
                    ).remove();
                    $(
                      ".plugoo-side-products .plugoo-products-history .products",
                    ).prepend(HTMLCreated);
                    if (
                      !$(".plugoo-products-history .history-actions").length
                    ) {
                      $(".plugoo-products-history").append(
                        `<div class="history-actions"> <a class="clear-history" onclick="clearHistory()">Limpar Historico</a></div>`,
                      );
                    }
                  }
                })
                .catch(function (error) {
                  console.error("powerDisplay: Error requisition:", error);
                });
            }

            localStorage.setItem("historyProds", JSON.stringify(historyProds));
          });

          loading = function (local, status) {
            if (status) {
              local.after(
                `<div class="loading-plugoo"><div></div><div></div><div></div><div></div></div>`,
              );
            } else {
              local.parent().find(".loading-plugoo").remove();
            }
          };

          if (localStorage.getItem("historyProds")) {
            let historyProds = JSON.parse(
              localStorage.getItem("historyProds"),
            ).reverse();
            let itemsToShow = 0;

            $(".plugoo-products-history").append(
              `<div class="history-actions"> <a class="clear-history" onclick="clearHistory()">Limpar Historico</a></div>`,
            );
            if (historyProds.length > 5) {
              $(".plugoo-products-history .history-actions").append(
                `<a class="load-more">Ver mais</a>`,
              );
            }
            $("#tab-2 .container:not(.plugoo-products-history)").remove();
            function showNextItems() {
              $(".load-more").addClass("disabled");
              loading(locale, true);
              let allHTML = "";
              const items = historyProds
                .slice(itemsToShow, itemsToShow + 5)
                .map((url) => fetch(`/web_api/products/${url}`));
              itemsToShow += 5;
              Promise.all(items)
                .then(function (responses) {
                  return Promise.all(
                    responses.map(function (response) {
                      if (!response.ok) {
                        throw new Error("Erro ao carregar os dados");
                      }
                      return response.json();
                    }),
                  );
                })
                .then(function (dataArray) {
                  dataArray.forEach(function (data) {
                    const imgProd =
                      data.Product.ProductImage[0].thumbs["30"].https;
                    const nameProd = data.Product.name;
                    const formPay = data.Product.payment_option_html;
                    const linkProd = data.Product.url.https;
                    const priceProd = data.Product.price;

                    allHTML += preHTML(
                      linkProd,
                      imgProd,
                      nameProd,
                      priceProd,
                      formPay,
                    );
                  });
                  $(
                    ".plugoo-side-products .plugoo-products-history .empty",
                  ).remove();
                  $(
                    ".plugoo-side-products .plugoo-products-history .products",
                  ).append(allHTML);
                  if (items.length < 5) {
                    $(".load-more").remove();
                  }
                })
                .catch(function (error) {
                  console.error("[powerDisplay] Erro na requisition:", error);
                })
                .finally(function () {
                  loading(locale, false);
                  $(".load-more").removeClass("disabled");
                });
            }

            showNextItems();

            $(".load-more").on("click", function () {
              showNextItems();
            });
          }
        }
      }
    },

    searchDesktop: function () {
      if ($(".search-content-full").length) {
        $(".search-content-full .input-search").focus(function () {
          $(".top-terms-search").hide();
          $("#banner-brands").hide();
        });

        $(".search-content-full .input-search").blur(function () {
          if ($(".suggestion").hasClass("is-hidden")) {
            $(".top-terms-search").show();
            $("#banner-brands").show();
          }
        });

        $(".search-wrapper").on("click", function () {
          $(".search-content-full").toggleClass("active");
          $(".overlay-search").toggleClass("is-overlay-on");
        });

        $(".overlay-search, .button-search-close").on("click", function () {
          $(".search-content-full").removeClass("active");
          $(".overlay-search").removeClass("is-overlay-on");
        });
      }
    },

    /* Scroll behavior */

    setCorrectHeaderDesk: function () {
      let internal = this;
      let deltaOne = 32;
      let deltaTwo = 280;
      let header = $(".header");
      let nav = $(".header .nav");
      let navbarHeight = $(".header").outerHeight() * 2;
      let position = $(window).scrollTop();

      position > deltaOne
        ? header.addClass("hide-top-bar")
        : header.removeClass("hide-top-bar");
      position > deltaTwo
        ? header.addClass("fixed")
        : header.removeClass("fixed");

      if (
        position > internal.settings.lastScrollPosition ||
        position <= navbarHeight
      ) {
        nav.removeClass("show-nav");
      } else if (position > navbarHeight) {
        nav.addClass("show-nav");
      }

      internal.settings.lastScrollPosition = position;
    },

    setCorrectHeaderMobile: function () {
      let header = $(".header");
      let headerMobile = $(".menu-bar-mobile");
      let headerHeight = $(".header").outerHeight() - 50;
      let position = $(window).scrollTop() - 10;

      if (position > headerHeight) {
        headerMobile.addClass("show");
        header.addClass("not-visible");
      } else {
        headerMobile.removeClass("show");
        $(".search-bar-mobile").removeClass("show");
        $(".overlay-shadow").removeClass("show");
        header.removeClass("not-visible");
      }
    },

    scrollHeader: function () {
      let internal = this;

      if ($(window).width() >= 768) {
        this.setCorrectHeaderDesk();
      } else {
        this.setCorrectHeaderMobile();
      }

      $(window).on("scroll", function () {
        if ($(window).width() >= 768) {
          internal.setCorrectHeaderDesk();
        } else {
          internal.setCorrectHeaderMobile();
        }
      });
    },

    /* Main menu */

    fixSubcategoriesHeight: function () {
      let topContent = $(".header").height();
      let windowHeight = $(window).height();
      let extraMargin = 30;

      $(".nav .list > .first-level.sub .second-level").css(
        "max-height",
        windowHeight - topContent - extraMargin,
      );
    },

    mainMenu: function () {
      let internal = this;

      this.fixSubcategoriesHeight();

      $(window).on("resize", function () {
        internal.fixSubcategoriesHeight();
      });

      if ($(window).width() > 768) {
        const nav = document.querySelectorAll(".first-level.sub");
        const overlay = document.querySelector(".overlay-nav");

        var fadeOut_handler = function () {
          overlay.classList.remove("is-overlay-on");
        };

        var fadeIn_handler = function () {
          overlay.classList.add("is-overlay-on");
        };

        for (var item of nav) {
          item.addEventListener("mouseover", fadeIn_handler, false);
          item.addEventListener("mouseout", fadeOut_handler, false);
        }
      }
    },

    mainMenuMobile: function () {
      $(".menu-search").on("click", function (event) {
        $(".search-bar-mobile").toggleClass("show");
        $(".overlay-shadow").toggleClass("show");
      });

      $(".nav-mobile .first-level > .sub > a").on("click", function (event) {
        let item = $(this).parent();

        item.toggleClass("show");

        if (item.hasClass("show")) {
          item.children(".sub").slideDown();
        } else {
          item.children(".sub").slideUp();
        }

        event.preventDefault();
        return false;
      });

      $(".box-help-mobile").on("click", function (event) {
        $(".box-help-mobile ul").fadeToggle("slow", "linear");
      });

      $(".track-order").on("click", function (event) {
        $(".track-content").fadeToggle("slow", "linear");
      });

      $("#tracking button").on("click", function (event) {
        event.preventDefault();
        var code = $("#track-order-input").val(),
          url = $("#track-order-input").data("rastreio");
        window.open(url + code + "/");
      });

      $(".menu-sales").on("click", function () {
        $(".modal-sales").addClass("show");
      });
    },

    /* Index */

    bannerHome: function () {
      if ($(".banner-home").length) {
        let slideshow = $(".banner-home");
        let size = $(".swiper-slide", slideshow).length;
        let settings = slideshow.data("settings");

        if (size > 1) {
          new Swiper(".banner-home .swiper-container", {
            preloadImages: false,
            loop: true,
            autoHeight: true,
            lazy: true,
            effect: "fade",
            keyboard: {
              enabled: true,
            },
            autoplay: {
              delay: 4000,
              disableOnInteraction: false,
            },
            navigation: {
              nextEl: ".banner-home .btn-next",
              prevEl: ".banner-home .btn-prev",
            },
            lazy: {
              loadPrevNext: true,
            },
            pagination: {
              el: ".banner-home .dots",
              bulletClass: "dot",
              bulletActiveClass: "dot-active",
              clickable: !settings.isMobile,
            },
          });

          if (settings.stopOnHover) {
            $(".banner-home .swiper-container").on("mouseenter", function () {
              this.swiper.autoplay.stop();
            });

            $(".banner-home .swiper-container").on("mouseleave", function () {
              this.swiper.autoplay.start();
            });
          }
        }
      }
    },

    slideBanners: function () {
      if ($(".benefits-items").length) {
        let size = $(".benefits-item").length;

        if (size > 0) {
          new Swiper(".benefits-items .swiper-container", {
            loop: true,
            spaceBetween: 16,

            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },

            breakpoints: {
              0: {
                slidesPerView: 1,
              },
              550: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 6,
                allowTouchMove: false,
                loop: true,
              },
            },
          });
        }
      }
    },

    storeReviewsIndex: function () {
      if (!$(".section-avaliacoes .dep_lista").length) {
        $(".section-avaliacoes").remove();
      } else {
        $(".dep_lista").changeElementType("div");
        $(".dep_item").changeElementType("div");

        $(".dep_item").addClass("swiper-slide");
        $(".section-avaliacoes .dep_lista")
          .addClass("swiper-wrapper")
          .wrap('<div class="swiper-container"></div>');
        $(".section-avaliacoes .swiper-container").append(`
                    <div class="prev">
                        <i class="icon icon-arrow-left"></i>
                    </div>
                    <div class="next">
                        <i class="icon icon-arrow-right"></i>
                    </div>            
                    <div class="dots"></div>
                `);

        let swiper = new Swiper(".section-avaliacoes .swiper-container", {
          slidesPerView: 3,
          lazy: {
            loadPrevNext: true,
          },
          navigation: {
            nextEl: ".section-avaliacoes .next",
            prevEl: ".section-avaliacoes .prev",
          },
          loop: false,
          breakpoints: {
            0: {
              slidesPerView: 1,
            },
            600: {
              slidesPerView: 2,
            },
            1000: {
              slidesPerView: 3,
            },
          },
          pagination: {
            el: ".section-avaliacoes .dots",
            type: "bullets",
            bulletClass: "dot",
            bulletActiveClass: "dot-active",
            clickable: false,
          },
          on: {
            init: function () {
              $(".section-avaliacoes").addClass("show");
            },
          },
        });

        $(".section-avaliacoes .dep_dados").wrap(
          '<a href="/depoimentos-de-clientes" title="Ver depoimento"></a>',
        );
        $(".dep_lista li:hidden").remove();
      }
    },

    loadNews: function () {
      if ($(".section-news").length) {
        let dataFiles = $("html").data("files");

        $.ajax({
          url: `/loja/busca_noticias.php?loja=${this.settings.storeId}&${dataFiles}`,
          method: "get",
          success: function (response) {
            let target;
            let news;

            if (!$(response).find(".noticias").length) {
              $(".section-news").remove();
              return;
            }

            target = $(".section-news .news-content .swiper-wrapper");
            news = $($(response).find(".noticias"));

            // news.find('li:nth-child(n+4)').remove();
            news
              .find("li")
              .wrapInner(
                '<div class="swiper-slide"><div class="box-noticia"></div></div>',
              );
            news.find(".swiper-slide").unwrap();
            news = news.contents();

            news.each(function (index, news) {
              // let image  = $(news).find('img').closest('div').remove();
            });

            target.append(news);

            new Swiper(".section-news .news-content", {
              lazy: {
                loadPrevNext: false,
              },
              pagination: {
                el: ".news-content .dots",
                bulletClass: "dot",
                bulletActiveClass: "dot-active",
                clickable: false,
              },
              breakpoints: {
                0: {
                  slidesPerView: 2,
                },
                550: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 4,
                  allowTouchMove: true,
                },
              },
            });
          },
        });
      }
    },

    youtubeVideo: function () {
      if ($(".box-video").length) {
        document
          .querySelector(".thumbnail-video")
          .addEventListener("click", function () {
            document.querySelector(".thumbnail-video").style.display = "none";
            document.querySelector("#youtube").style.display = "block";
          });
      }
    },

    preHeader: function () {
      if ($(".top-header").length > 0) {
        new Swiper(".top-header .swiper-container", {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: false,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: ".top-header .swiper-button-next",
            prevEl: ".top-header .swiper-button-prev",
          },
        });
      }
    },

    /* Category and search pages */

    slideCatalog: function () {
      if ($(".slide-catalog").length) {
        new Swiper(".slide-catalog", {
          slidesPerView: 1,
          preloadImages: false,
          lazy: {
            loadPrevNext: true,
          },
          pagination: {
            el: ".slide-catalog .dots",
            bulletClass: "dot",
            bulletActiveClass: "dot-active",
            clickable: true,
          },
        });
      }
    },

    sortMobile: function () {
      let options = $();
      let selectedValue = $("#select_ordem").val();

      $("#select_ordem option").each(function () {
        options = options.add(
          `<li ${selectedValue === $(this).val() ? 'class="active"' : ""} data-option="${$(this).val()}">
                        ${$(this).text()}
                    </li>
                `,
        );
      });

      $(".catalog-header .sort-mobile .sort-panel .sort-options").append(
        options,
      );

      $(".catalog-header .sort-mobile .sort-panel .sort-options").on(
        "click",
        "li",
        function () {
          let option = $(this).data("option");
          $("#select_ordem").val(option).trigger("change");
        },
      );
    },

    usabilityCatalog: function () {
      var description = document.querySelector(".description .board_htm");
      if (description) {
        var boardHtm = document.querySelector(".board_htm");
        var buttonMore = document.querySelector("button.button-more");

        var lineHeight = parseFloat(getComputedStyle(boardHtm)["line-height"]);

        if (boardHtm.scrollHeight > lineHeight * 3) {
          buttonMore.style.display = "block";
          boardHtm.classList.add("limited");
        }

        buttonMore.addEventListener("click", function () {
          boardHtm.classList.toggle("limited");
          this.innerHTML =
            this.innerHTML === "Ver mais" ? "Ver menos" : "Ver mais";
        });
      }

      if (document.querySelector(".smart-filter")) {
        var filterTitles = document.querySelectorAll(".filter-title");
        const downSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>`;

        filterTitles.forEach(function (filterTitle) {
          filterTitle.innerHTML = filterTitle.innerHTML + downSvg;
          filterTitle.addEventListener("click", function () {
            var filterList = this.nextElementSibling;
            filterList.classList.toggle("hide");
          });
        });

        var filterBlocks = document.querySelectorAll(".filter-block");
        var filterBlocksArray = Array.from(filterBlocks);

        filterBlocksArray.forEach(function (filterBlock) {
          var filterTitle = filterBlock.querySelector(".filter-title");
          var filterList = filterBlock.querySelector(".filter-list");

          filterTitle.addEventListener("click", function () {
            var filterType = filterBlock.getAttribute("data-filter-type");
            var filterListState = filterList.classList.contains("hide");

            localStorage.setItem(filterType, filterListState);
          });

          var filterType = filterBlock.getAttribute("data-filter-type");
          var filterListState = localStorage.getItem(filterType);

          if (filterListState == "true") {
            filterList.classList.add("hide");
          } else {
            filterList.classList.remove("hide");
          }
        });
      }
    },

    /* Product page */

    sizeTables: function () {
      // display size tables on product page when clicking on the size chart button
    },
    initProductGallery: function () {
      let zoomActive = $(".product-gallery").hasClass("zoom-true");

      let gallerySettings = {
        slidesPerView: this.settings.productGalleryPerView,
        lazy: {
          loadPrevNext: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1, // set to 1 for screens less than 575px wide
            direction: "horizontal",
            centerInsufficientSlides: true,
          },
          575: {
            slidesPerView: this.settings.productGalleryPerView, // use the original setting from here onwards
            direction: "horizontal",
            centerInsufficientSlides: true,
          },
          768: {
            slidesPerView: this.settings.productGalleryPerView,
            direction: "horizontal",
            centerInsufficientSlides: true,
          },
          1000: {
            slidesPerView: this.settings.productGalleryPerView,
            direction: "horizontal",
          },
          1201: {
            slidesPerView: this.settings.productGalleryPerView,
          },
        },
        on: {
          init: function () {
            if (!zoomActive) return;

            if (this.slides.length === 1) {
              this.unsetGrabCursor();
              this.allowTouchMove = false;
            }

            let wrapper = $(".product-wrapper .product-gallery").find(
              `.image[data-index="1"] .zoom`,
            );

            if (!wrapper.find("img:first").next().length) {
              wrapper.zoom({
                touch: false,
                url: wrapper.find("img").attr("src"),
              });
            }
          },
          slideChange: function () {
            if (!zoomActive) return;
            let index = this.activeIndex + 1;
            let wrapper = $(".product-wrapper .product-gallery").find(
              `.image[data-index="${index}"] .zoom`,
            );

            if (!wrapper.find("img:first").next().length) {
              wrapper.zoom({
                touch: false,
                url: wrapper.find("img").attr("src"),
              });
            }
          },
        },
      };

      if (
        $(".product-wrapper .product-gallery .product-thumbs .swiper-slide")
          .length
      ) {
        this.settings.productThumbs = new Swiper(
          ".product-wrapper .product-gallery .product-thumbs .thumbs-list",
          {
            slidesPerView: this.settings.productGalleryPerView,
            spaceBetween: 0,
            updateOnWindowResize: true,
            centerInsufficientSlides: false,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            direction: "vertical",
            navigation: {
              nextEl:
                ".product-wrapper .product-gallery .product-thumbs .controls .next",
              prevEl:
                ".product-wrapper .product-gallery .product-thumbs .controls .prev",
            },
            pagination: {
              el: ".product-wrapper .product-gallery .product-thumbs .thumbs-list .dots",
              bulletClass: "dot",
              bulletActiveClass: "dot-active",
              clickable: true,
            },
            lazy: {
              loadPrevNext: true,
            },
            breakpoints: {
              0: {
                slidesPerView: 3,
                direction: "horizontal",
                centerInsufficientSlides: true,
              },
              575: {
                slidesPerView: 4,
                direction: "horizontal",
                centerInsufficientSlides: true,
              },
              768: {
                slidesPerView: 2,
                direction: "horizontal",
                centerInsufficientSlides: true,
              },
              1000: {
                slidesPerView: 3,
                direction: "horizontal",
              },
              1201: {
                slidesPerView: 4,
              },
            },
            on: {
              init: function () {
                $(".product-wrapper .product-gallery .product-thumbs").addClass(
                  "show",
                );
              },
            },
          },
        );

        gallerySettings.thumbs = {
          autoScrollOffset: 1,
          multipleActiveThumbs: true,
          swiper: this.settings.productThumbs,
        };
      }

      this.settings.productGallery = new Swiper(
        ".product-wrapper .product-gallery .product-images",
        gallerySettings,
      );
    },

    recreateProductGallery: function (images) {
      let productName = $(
        ".product-wrapper .product-form .product-name",
      ).text();
      let htmlThumbs = ``;
      let htmlImages = ``;

      $.each(images, function (index, item) {
        let slideIndex = index + 1;

        htmlImages += `
                    <div class="image swiper-slide ${slideIndex === 1 ? "active" : ""}" data-index="${slideIndex}">
                        <div class="zoom">
                            <img class="swiper-lazy" data-src="${item.https}" alt="${productName}">
                        </div>
                    </div>
                `;

        htmlThumbs += `<li class="swiper-slide ${slideIndex === 1 ? "active" : ""}" data-index="${slideIndex}">
                        <div class="thumb">
                            <img src="${item.thumbs[90].https}" alt="${productName}">
                        </div>
                    </li>
                `;
      });

      if (theme.settings.productThumbs) {
        theme.settings.productThumbs.destroy();
      }

      if (theme.settings.productGallery) {
        theme.settings.productGallery.destroy();
      }

      $(".product-wrapper .product-gallery .product-images .image").remove();
      $(
        ".product-wrapper .product-gallery .product-thumbs .swiper-slide",
      ).remove();
      $(
        ".product-wrapper .product-gallery .product-images .swiper-wrapper",
      ).html(htmlImages);

      if (images.length > 1) {
        $(".product-wrapper .product-gallery .product-thumbs").addClass("show");
        $(
          ".product-wrapper .product-gallery .product-thumbs .thumbs-list .swiper-wrapper",
        ).html(htmlThumbs);
      } else {
        $(".product-wrapper .product-gallery .product-thumbs").removeClass(
          "show",
        );
      }

      theme.initProductGallery();
    },

    toggleProductVideo: function () {
      let internal = this;

      $(".product-wrapper .product-box .product-video").on(
        "click",
        function () {
          $(".modal-video")
            .find("iframe")
            .attr("data-src", $(this).data("url"));
          $(".modal-video").addClass("show");

          internal.initLazyload(".iframe-lazy");
        },
      );

      $(".modal-video, .modal-video .close-icon").on("click", function (event) {
        if (!$(event.target).hasClass("modal-info")) {
          setTimeout(function () {
            $(".modal-video .video iframe")
              .removeAttr("src")
              .removeClass("loaded")
              .removeAttr("data-was-processed data-ll-status");
          }, 300);
        }
      });
    },

    openSizeGuide: function () {
      if ($(".product-size-table").length) {
        // click guia de medidas abrir modal
        $(".product-size-table").on("click", function () {
          $(".modal-size-table").addClass("show");
        });
        // click fechar modal
        $(".modal-size-table .close").on("click", function () {
          $(".modal-size-table").removeClass("show");
        });
      }
    },

    goToProductReviews: function () {
      let internal = this;

      $(
        ".product-wrapper .product-box .product-form .product-rating .total",
      ).on("click", function () {
        let target;
        let adjust;

        if ($(window).width() < 768) {
          target =
            ".product-tabs .tabs-content .tab-link-mobile.comments-link-tab";
          adjust = 60;
        } else {
          target = ".product-tabs .tabs-nav .tab-link.comments-link-tab";
          adjust = 120;
        }

        $(target).trigger("click");
        internal.scrollToElement(target, adjust);
      });

      setTimeout(() => {
        $("#form-comments .submit-review").on("click", function (e) {
          if (!$("#form-comments .stars .starn.star-on").length) {
            var textError =
              "Avalia&ccedil;&atilde;o do produto obrigat&oacute;ria, avalie por favor.";
            $("#div_erro .blocoAlerta").text(textError).show();
            setTimeout(() => {
              $("#div_erro .blocoAlerta").hide();
            }, 5000);
          }
        });
      }, 3000);
    },

    getShippingRates: function () {
      let internal = this;
      var quantity = 1;

      $(".shipping-form").on("submit", function (event) {
        event.preventDefault();

        let variant = $("#form_comprar").find(
          'input[type="hidden"][name="variacao"]',
        );
        let url = $("#shippingSimulatorButton").attr("data-url");
        let cep = $("input", this).val().split("-");

        if (jQuery("#quant:visible").is(":visible")) {
          quantity = jQuery("#quant:visible").val();
        }

        if (variant.length && variant.val() === "") {
          $(".product-shipping .result")
            .addClass("loaded")
            .html(
              `<div class="error-message">Por favor, selecione as varia&ccedil;&otilde;es antes de calcular o frete.</div>`,
            );
          return;
        }

        variant = variant.val() || 0;

        url = url
          .replace("cep1=%s", `cep1=${cep[0]}`)
          .replace("cep2=%s", `cep2=${cep[1]}`)
          .replace("acao=%s", `acao=${variant}`)
          .replace("dade=%s", `dade=${quantity}`);

        $(".product-shipping .result")
          .removeClass("loaded")
          .addClass("loading")
          .html(internal.getLoader("Carregando fretes..."));

        /* Validate zip code first using viacep web service */
        $.ajax({
          url: `https://viacep.com.br/ws/${cep[0] + cep[1]}/json/`,
          method: "get",
          dataType: "json",
          success: function (viacepResponse) {
            if (viacepResponse.erro) {
              let message = "Cep inv&aacute;lido. Verifique e tente novamente.";
              $(".product-shipping .result")
                .removeClass("loading")
                .addClass("loaded")
                .html(`<div class="error-message">${message}</div>`);

              return;
            }

            $.ajax({
              url: url,
              method: "get",
              success: function (response) {
                if (
                  response.includes(
                    "N&atilde;o foi poss&iacute;vel estimar o valor do frete",
                  )
                ) {
                  let message =
                    "N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarte.";
                  $(".product-shipping .result")
                    .removeClass("loading")
                    .addClass("loaded")
                    .html(`<div class="error-message">${message}</div>`);

                  return;
                }

                let shippingRates = $(
                  response.replace(/Prazo de entrega: /gi, ""),
                );
                let local = shippingRates
                  .find("p .color")
                  .html()
                  .replace(/\s\s\\\s/g, "")
                  .replace(/ \\/g, ",");

                shippingRates
                  .find("table:first-child, p, table tr td:first-child")
                  .remove();
                shippingRates
                  .find("table, table th, table td")
                  .removeAttr(
                    "align class width border cellpadding cellspacing height colspan",
                  );

                shippingRates.find("table").addClass("shipping-rates-table");

                var frete = shippingRates.find("table th:first-child").text();
                if (frete == "Forma de Envio:") {
                  shippingRates.find("table th:first-child").html("Frete");
                }

                var valor = shippingRates.find("table th:nth-child(2)").text();
                if (valor == "Valor:") {
                  shippingRates.find("table th:nth-child(2)").html("Valor");
                }

                var prazo = shippingRates.find("table th:last-child").text();
                if (prazo == "Prazo de Entrega e ObservaÃ¯Â¿Â½Ã¯Â¿Â½es:") {
                  shippingRates.find("table th:last-child").html("Prazo");
                }
                shippingRates = shippingRates.children();

                $(".product-shipping .result")
                  .removeClass("loading")
                  .addClass("loaded")
                  .html("")
                  .append(shippingRates);
              },
              error: function (request, status, error) {
                console.error(
                  `[Theme] Could not recover shipping rates. Error: ${error}`,
                );

                if (request.responseText !== "") {
                  console.error(
                    `[Theme] Error Details: ${request.responseText}`,
                  );
                }

                let message =
                  "N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.";
                $(".product-shipping .result")
                  .removeClass("loading")
                  .addClass("loaded")
                  .html(`<div class="error-message">${message}</div>`);
              },
            });
          },
          error: function (request, status, error) {
            console.error(`[Theme] Could not validate cep. Error: ${error}`);
            console.error(`[Theme] Error Details: ${request.responseJSON}`);

            let message =
              "N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarde.";
            $(".product-shipping .result")
              .removeClass("loading")
              .addClass("loaded")
              .html(`<div class="error-message">${message}</div>`);
          },
        });

        return false;
      });
    },

    productBuyTogether: function () {
      let internal = this;

      $(".compreJunto form .fotosCompreJunto").append(
        '<div class="plus color to">=</div>',
      );

      $(".compreJunto .produto img").each(function () {
        let imagUrl = $(this).attr("src").replace("/90_", "/180_");
        let link = $(this).parent().attr("href") || "";
        let name = $(this).attr("alt");

        $(this)
          .addClass("lazyload-buy-together")
          .attr("src", "")
          .attr("data-src", imagUrl);
        internal.initLazyload(".lazyload-buy-together");

        if (link !== "") {
          $(this).unwrap();
          $(this)
            .parents("span")
            .after(`<a class="product-name" href="${link}">${name}</a>`);
        } else {
          $(this)
            .parents("span")
            .after(`<span class="product-name">${name}</span>`);
        }
      });

      // verificar se class selectedVariant existe
      if ($("#selectedVariant").length > 0) {
        document
          .getElementById("button-buy")
          .addEventListener("click", function (e) {
            var checkVariant = document.getElementById("selectedVariant").value;
            var erroVariant = document.getElementById("span_erro_carrinho");
            if (checkVariant == "") {
              erroVariant.style.display = "block";
            }
          });
      }
    },

    loadProductPaymentOptionsTab: function () {
      let productId = $("#form_comprar").data("id");
      let price = $("#preco_atual").val();
      let paymentTab = $(".product-tabs .tabs-content .payment-tab");
      let previousPrice = paymentTab.attr("data-loaded-price");

      if (previousPrice !== price) {
        $.ajax({
          url: `/mvc/store/product/payment_options?loja=${theme.settings.storeId}&IdProd=${productId}&preco=${price}`,
          method: "get",
          success: function (response) {
            let html = $(response);

            html = html.find("#atualizaFormas").unwrap();
            html = html.find("ul.Forma1").unwrap();

            html.find("li").each(function () {
              let image = $("img", this).remove();
              $("a", this).prepend(image);
            });

            html.find("table br").remove();
            html.find("table td:first-child").remove();

            html
              .find("table")
              .removeAttr(
                "id class width cellpadding cellspacing border style",
              );
            html.find("table td, table th").removeAttr("class width style");
            html.find("li").removeAttr("id style");
            html.find("li a").removeAttr("id class name");
            html.find("li a img").removeAttr("border");

            html.removeClass().addClass("payment-options");
            html.find("li").addClass("option");
            html.find("li a").attr("href", "javascript:void(0)");
            html.find("table").wrap('<div class="option-details"></div>');
            html.find(".option-details").css("display", "none");

            paymentTab.attr("data-loaded-price", price);
            paymentTab.html("").append(html);
          },
        });
      }
    },

    productTabsAction: function () {
      let internal = this;

      $('.tab-link-mobile[href*="AbaPersonalizada"]').each(function () {
        let target = $(this).attr("href").split("#")[1];
        target = $(`#${target}`);

        $(target).detach().insertAfter(this);
      });

      $(".product-tabs .tabs-content .tab[data-url]").each(function () {
        let tab = $(this);
        let url = tab.data("url");

        if (tab.hasClass("payment-tab")) {
          internal.loadProductPaymentOptionsTab();
        } else {
          $.ajax({
            url: url,
            method: "get",
            success: function (response) {
              tab.html(response);
            },
          });
        }
      });

      $(".product-tabs .tabs-content .tab.payment-tab").on(
        "click",
        ".option a",
        function () {
          let parent = $(this).parent();
          let table = $(this).next();

          if (parent.hasClass("show")) {
            parent.removeClass("show");
            table.slideUp();
          } else {
            parent.addClass("show");
            table.slideDown();
          }
        },
      );

      $(".product-tabs .tabs-nav .tab-link").on("click", function (event) {
        let tabs = $(this).closest(".product-tabs");

        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          target.removeClass("active").slideUp();
        } else {
          $(".product-tabs .tabs-content .tab-link").removeClass("active");
          $(".product-tabs .tabs-content .tab").removeClass("active").slideUp();

          $(this).addClass("active");
          target.addClass("active").slideDown();
        }

        event.preventDefault();
        event.stopPropagation();
        return false;
      });

      $(".product-tabs .tabs-content .tab-link-mobile").on(
        "click",
        function (event) {
          let target = $(this).attr("href").split("#")[1];
          target = $(`#${target}`);

          if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            target.removeClass("active").slideUp();
          } else {
            $(".product-tabs .tabs-content .tab-link-mobile").removeClass(
              "active",
            );
            $(".product-tabs .tabs-content .tab")
              .removeClass("active")
              .slideUp();

            $(this).addClass("active");
            target.addClass("active").slideDown();
          }

          event.preventDefault();
          event.stopPropagation();
          return false;
        },
      );

      internal.productTabActionsOnResize();

      $(window).on("resize", function () {
        internal.productTabActionsOnResize();
      });
    },

    productTabActionsOnResize: function () {
      if ($(".product-tabs .tabs-nav li").length) {
        if (
          $(window).width() < 768 &&
          $(".product-tabs .tabs-nav .tab-link.active").length > 0
        ) {
          $(".product-tabs .tabs-nav .tab-link").removeClass("active");
          $(".product-tabs .tabs-content .tab-link-mobile").removeClass(
            "active",
          );
          $(".product-tabs .tabs-content .tab").removeClass("active").slideUp();
        } else if (
          $(window).width() >= 768 &&
          $(".product-tabs .tabs-nav .tab-link.active").length == 0
        ) {
          let firstLink = $(".product-tabs .tabs-nav .tab-link").first();
          if (firstLink.length) {
            let target = firstLink.attr("href").split("#")[1];
            $(".product-tabs .tabs-content .tab-link-mobile").removeClass(
              "active",
            );
            firstLink.addClass("active");
            $(`#${target}`).show();
          }
        }
      }
    },

    observerProductPriceChange: function () {
      if ($(".product-wrapper .product-form .product-price-tray").length) {
        let target = $(
          ".product-wrapper .product-form .product-price-tray",
        ).get(0);

        let options = {
          childList: true,
          subtree: true,
        };

        let observer = new MutationObserver(function () {
          theme.loadProductPaymentOptionsTab();
        });

        observer.observe(target, options);
      }
    },

    productReviews: function () {
      let commentsBlock = $(
        `<div class="product-comments">${window.commentsBlock}</div>`,
      );

      commentsBlock.find(".hreview-comentarios + .tray-hide").remove();

      $.ajax({
        url: "/mvc/store/greeting",
        method: "get",
        dataType: "json",
        success: function (response) {
          if (!Array.isArray(response.data)) {
            commentsBlock
              .find("#comentario_cliente form.tray-hide")
              .removeClass("tray-hide");

            commentsBlock
              .find("#form-comments #nome_coment")
              .val(response.data.name);
            commentsBlock
              .find("#form-comments #email_coment")
              .val(response.data.email);

            commentsBlock
              .find('#form-comments [name="ProductComment[customer_id]"]')
              .val(response.data.id);
          } else {
            commentsBlock
              .find("#comentario_cliente a.tray-hide")
              .removeClass("tray-hide");
          }

          $("#tray-comment-block").before(commentsBlock);

          $("#form-comments #bt-submit-comments")
            .before(
              '<button type="submit" class="submit-review">Enviar</button>',
            )
            .remove();

          $(".ranking .rating").each(function () {
            let review = Number(
              $(this)
                .attr("class")
                .replace(/[^0-9]/g, ""),
            );

            for (i = 1; i <= 5; i++) {
              if (i <= review) {
                $(this).append('<div class="icon active"></div>');
              } else {
                $(this).append('<div class="icon"></div>');
              }
            }
          });

          $("#tray-comment-block").remove();

          theme.chooseProductRating();
          theme.sendProductReview();
        },
      });
    },

    chooseProductRating: function () {
      $("#form-comments .rateBlock .starn").on("click", function () {
        let message = $(this).data("message");
        let rating = $(this).data("id");

        $(this).parent().find("#rate").html(message);
        $(this).closest("form").find("#nota_comentario").val(rating);

        $(this).parent().find(".starn").removeClass("star-on");

        $(this).prevAll().addClass("star-on");

        $(this).addClass("star-on");
      });
    },

    sendProductReview: function () {
      $("#form-comments").on("submit", function (event) {
        let form = $(this);

        $.ajax({
          url: form.attr("action"),
          method: "post",
          dataType: "json",
          data: form.serialize(),
          success: function (response) {
            form.closest(".product-comments").find(".blocoAlerta").hide();
            form.closest(".product-comments").find(".blocoSucesso").show();

            setTimeout(function () {
              form.closest(".product-comments").find(".blocoSucesso").hide();
              $("#form-comments #mensagem_coment").val("");

              form.find("#nota_comentario").val("");
              form.find("#rate").html("");

              form.find(".starn").removeClass("star-on");
            }, 8000);
          },
          error: function (response) {
            form.closest(".product-comments").find(".blocoSucesso").hide();
            form
              .closest(".product-comments")
              .find(".blocoAlerta")
              .html(response.responseText)
              .show();
          },
        });

        event.preventDefault();
      });
    },

    productRelatedCarousel: function () {
      $(".section-product-related .product").on("mouseenter", function () {
        $(".showcase").addClass("z-index");
      });

      $(".section-product-related product").on("mouseleave", function () {
        $(".showcase").removeClass("z-index");
      });

      new Swiper(".section-product-related .swiper-container", {
        slidesPerView: 4,
        preloadImages: false,
        loop: false,
        lazy: {
          loadPrevNext: true,
        },
        navigation: {
          nextEl: ".section-product-related .next",
          prevEl: ".section-product-related .prev",
        },
        pagination: {
          el: ".section-product-related .dots",
          bulletClass: "dot",
          bulletActiveClass: "dot-active",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
          },
          620: {
            slidesPerView: 3,
          },
          1200: {
            slidesPerView: 4,
          },
        },
      });
    },

    productsMenu: function () {
      if ($(".product-menu").length) {
        $(".product-menu-content .product").on("mouseenter", function () {
          $(".product-menu-content").addClass("z-index");
        });

        $(".product-menu-content .product").on("mouseleave", function () {
          $(".product-menu-content").removeClass("z-index");
        });

        let size = $(".product-menu .item").length;
        if (size >= 2) {
          new Swiper(".product-menu .swiper-container", {
            loop: false,
            spaceBetween: 0,
            reverseDirection: false,
            slidesPerView: 1,
            lazy: {
              loadPrevNext: true,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            breakpoints: {
              0: {
                slidesPerView: 1,
              },
              620: {
                slidesPerView: 1,
              },
              1200: {
                slidesPerView: 1,
              },
            },
          });
        }
      }

      if ($(".product-menu-sale").length) {
        $(".product-menu-sale-content .product").on("mouseenter", function () {
          $(".product-menu-sale-content").addClass("z-index");
        });

        $(".product-menu-sale-content .product").on("mouseleave", function () {
          $(".product-menu-sale-content").removeClass("z-index");
        });

        // $(".product-menu-sale .product .space-image img").removeClass("swiper-lazy");

        let size = $(".product-menu-sale .item").length;
        if (size >= 1) {
          new Swiper(".product-menu-sale .swiper-container", {
            loop: false,
            spaceBetween: 0,
            reverseDirection: false,
            slidesPerView: 3,
            autoplay: {
              delay: 2500,
              disableOnInteraction: true,
            },
            lazy: true,

            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        }
      }

      setTimeout(() => {
        if ($(".mob-product-menu-sale").length) {
          let sizeMob = $(".mob-product-menu-sale .item").length;
          if (sizeMob >= 1) {
            new Swiper(".mob-product-menu-sale .swiper-container", {
              loop: false,
              spaceBetween: 0,
              reverseDirection: false,
              slidesPerView: 1,
              autoplay: {
                delay: 3500,
                disableOnInteraction: true,
              },
              lazy: {
                loadPrevNext: true,
              },
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              },
            });
          }
        }
      }, 1000);

      if ($(".plugoo-countdown").length > 0) {
        $(".pg-timer-content").each(function () {
          // Set the date we're counting down to
          var $this = $(this);
          var $DataEnd = $this.data("end");
          var countDownDate = new Date(`${$DataEnd}T00:00:00`).getTime();

          if ($DataEnd === "") {
            $this.parents(".plugoo-countdown").remove();
          }

          // Update the count down every 1 second
          var x = setInterval(function () {
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            var minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60),
            );
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            var $Template =
              '<div class="pg-timer">' +
              '<span class="pg-timer-days">' +
              days +
              " dias </span>" +
              '<span class="pg-timer-hours">' +
              hours +
              "h</span>" +
              '<span class="dois-pontos-contador"> </span>' +
              '<span class="pg-timer-minutes">' +
              minutes +
              "m</span>" +
              '<span class="dois-pontos-contador"> </span>' +
              '<span class="pg-timer-seconds">' +
              seconds +
              "s</span>" +
              "</div>";

            $this.html($Template);

            // If the count down is over, write some text
            if (distance < 0) {
              clearInterval(x);
              $this.html("Essa oferta encerrou :(");
              $this.parents(".plugoo-countdown").hide();
            }
          }, 1000);
        });
      }
    },

    productsHome: function () {
      $(".product-video .product").on("mouseenter", function () {
        $(".showcase").addClass("z-index");
      });

      $(".product-video .product").on("mouseleave", function () {
        $(".showcase").removeClass("z-index");
      });

      if ($(".product-video").length) {
        let size = $(".product-video .item").length;
        if (size >= 2) {
          // $(".product-video .product .space-image img").addClass("swiper-lazy");
          // $('.product-video .swiper-container').removeClass('f-wrap')
          new Swiper(".product-video .swiper-container", {
            loop: false,
            spaceBetween: 0,
            reverseDirection: false,
            slidesPerView: 2,

            lazy: {
              loadPrevNext: true,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
            breakpoints: {
              0: {
                slidesPerView: 2,
              },
              620: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 2,
              },
            },
          });
        }
      }

      if ($(".box-slide").length) {
        let size = $(".box-slide .item").length;

        if (size > 4) {
          new Swiper(".box-slide .swiper-container", {
            loop: true,
            spaceBetween: 0,
            centeredSlides: false,
            slidesPerView: 4,
            lazy: {
              loadPrevNext: true,
            },
            autoplay: {
              delay: 4000,
              disableOnInteraction: true,
            },
            navigation: {
              nextEl: ".btn-next",
              prevEl: ".btn-prev",
            },
            pagination: {
              el: ".box-slide .dots",
              bulletClass: "dot",
              bulletActiveClass: "dot-active",
              clickable: true,
            },
            breakpoints: {
              0: {
                slidesPerView: 1,
              },
              520: {
                slidesPerView: 2,
              },
              620: {
                slidesPerView: 3,
              },
              1200: {
                slidesPerView: 4,
              },
            },
          });
        } else {
          $(".box-slide .swiper-container .categorias-itens").addClass(
            "justify-center",
          );
          $(".box-slide .swiper-container .categorias-itens .item").css(
            "width",
            "auto",
          );
        }
      }

      if ($(".instafeed-slide").length) {
        let size = $(".instafeed-slide .item").length;

        if (size > 1) {
          let swiper = null;
          const swiperConfig = {
            loop: false,
            spaceBetween: 0,
            centeredSlides: false,
            slidesPerView: 5,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            pagination: {
              el: ".dots",
              bulletClass: "dot",
              bulletActiveClass: "dot-active",
              clickable: true,
            },
            breakpoints: {
              0: {
                slidesPerView: 2,
              },
              620: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 5,
              },
            },
          };

          function initializeSwiper() {
            if (window.innerWidth <= 768 && swiper === null) {
              swiper = new Swiper(
                ".instafeed-slide .swiper-container",
                swiperConfig,
              );
            }
          }

          function destroySwiper() {
            if (window.innerWidth > 768 && swiper !== null) {
              swiper.destroy(true, true);
              swiper = null;
            }
          }

          function checkScreenSize() {
            initializeSwiper();
            destroySwiper();
          }

          // Execute na carga da pÃ¡gina
          checkScreenSize();

          // Adicione listeners de evento resize
          window.addEventListener("resize", checkScreenSize);
        }
      }

      if ($(".site-main #banner-brands").length) {
        let size = $(".brands-slide .item").length;

        if (size > 1) {
          new Swiper(".site-main #banner-brands .swiper-container", {
            loop: false,
            spaceBetween: 0,
            centeredSlides: false,
            slidesPerView: 5,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            pagination: {
              el: ".dots",
              bulletClass: "dot",
              bulletActiveClass: "dot-active",
              clickable: true,
            },
            breakpoints: {
              0: {
                slidesPerView: 2,
              },
              620: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 5,
              },
            },
          });
        }
      }

      $(".section-showcase .product").on("mouseenter", function () {
        $(".showcase").addClass("z-index");
      });

      $(".section-showcase product").on("mouseleave", function () {
        $(".showcase").removeClass("z-index");
      });

      if ($(".showcase-slide").length) {
        var dataLine = $(".showcase-slide").data("prod-line") || 1;
        var dataSwiper = $(".showcase-slide").data("prod-swiper") || 0;
        if (dataSwiper == 0) {
          new Swiper(".showcase-slide .swiper-container", {
            slidesPerView: dataLine,
            preloadImages: false,
            loop: false,
            reverseDirection: false,
            spaceBetween: 0,
            lazy: true,

            navigation: {
              nextEl: ".section-showcase .btn-next",
              prevEl: ".section-showcase .btn-prev",
            },
            pagination: {
              el: ".section-showcase .dots",
              bulletClass: "dot",
              bulletActiveClass: "dot-active",
              clickable: true,
            },
            breakpoints: {
              0: {
                slidesPerView: 2,
              },
              620: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: dataLine,
                spaceBetween: 0,
              },
            },
          });
        } else if (dataSwiper == 1) {
          new Swiper(".showcase-slide .swiper-container", {
            slidesPerView: dataLine,
            preloadImages: false,
            loop: false,
            reverseDirection: false,
            lazy: true,
            navigation: {
              nextEl: ".section-showcase .btn-next",
              prevEl: ".section-showcase .btn-prev",
            },
            pagination: {
              el: ".section-showcase .dots",
              bulletClass: "dot",
              bulletActiveClass: "dot-active",
              clickable: true,
            },
            breakpoints: {
              0: {
                slidesPerView: 1.25,
                spaceBetween: 0,
                centeredSlides: false,
                roundLengths: true,
              },
              620: {
                slidesPerView: 3,
                spaceBetween: 0,
                centeredSlides: false,
              },
              1200: {
                slidesPerView: dataLine,
                spaceBetween: 0,
                centeredSlides: false,
              },
            },
          });
        }
      }
    },

    addCart: function () {
      $('[data-app="product.quantity"]').each(function () {
        var $this = $(this);
        var $input = $this.parent().find("input")[0];
        var value = parseInt($($input).attr("value"));
        var quantyUp = $this.find('[data-action="plus"]');
        var quantyDown = $this.find('[data-action="minus"]');
        var qtnMin = $($input).attr("min");
        var qtnMax = $($input).attr("max");

        quantyUp.on("click", function (e) {
          e.preventDefault();
          if (value < qtnMax) {
            value = value + 1;
            $($input).attr("value", value);
          }
        });

        quantyDown.on("click", function (e) {
          e.preventDefault();
          if (value > qtnMin) {
            value = value - 1;
            $($input).attr("value", value);
          }
        });
      });

      $('.product [data-app="product.buy-button"]').on("click", function () {
        var $input = $(this).parent().parent().find("input")[0];
        var $productId = $(this).attr("data-product");
        var $dataSession = $("html").attr("data-session");
        var $productQtd = parseInt($($input).attr("value"));
        var self = this;

        function animateAddProd() {
          // animate loadind click button
          $(self).addClass("loading");
          setTimeout(() => {
            $(self).removeClass("loading");
            $(self).text("Adicionado");
          }, 1500);
        }

        $.ajax({
          method: "POST",
          url: "/web_api/cart/",
          contentType: "application/json; charset=utf-8",
          data:
            '{"Cart":{"session_id":"' +
            $dataSession +
            '","product_id":"' +
            $productId +
            '","quantity":"' +
            $productQtd +
            '"}}',
        })
          .done(function (response, textStatus, jqXHR) {
            animateAddProd();
            var qtdCart = parseInt($("span[data-cart=amount]").html());
            $("span[data-cart=amount]").html(qtdCart + 1);

            const infoSuccess = `<div class="btn-info al-success" role="alert">
                        <div class="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            <p class="info-response">Produto adicionado ao carrinho</p>
                        </div>
                    </div>`;

            setTimeout(() => {
              $("body")
                .append(infoSuccess)
                .delay(3000)
                .queue(function (next) {
                  $(".btn-info").remove();
                  next();
                });
            }, 1200);
          })
          .fail(function (jqXHR, status, errorThrown) {
            var response = $.parseJSON(jqXHR.responseText);
            console.error(response);
            animateAddProd();

            // Exibe a mensagem de erro (estoque insuficiente, etc)
            const infoError = `<div class="btn-info al-error" role="alert">
                        <div class="flex">
                            <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
                            <p class="info-response">${response.causes[0]}</p>
                        </div>
                    </div>`;
            setTimeout(() => {
              $("body")
                .append(infoError)
                .delay(3000)
                .queue(function (next) {
                  $(".btn-info").remove();
                  next();
                });
            }, 1200);
          });
      });
    },

    bannerMiniSlide: function () {
      if ($("#mini-banner").length) {
        // let size = $('#mini-banner .item').length;
        // if(size > 0){
        //     new Swiper('#mini-banner .swiper-container', {
        //         loop: false,
        //         slidesPerView: 2,
        //         centeredSlides: true,
        //         spaceBetween: 80,
        //         autoplay: {
        //           delay: 2500,
        //           disableOnInteraction: false,
        //         },
        //         navigation: {
        //             nextEl: '.swiper-button-next',
        //             prevEl: '.swiper-button-prev',
        //         },
        //         pagination: {
        //             el                : '.box-slide .dots',
        //             bulletClass       : 'dot',
        //             bulletActiveClass : 'dot-active',
        //             clickable         : true
        //         },
        //         breakpoints: {
        //             0: {
        //                 slidesPerView: 1
        //             },
        //             620: {
        //                 slidesPerView: 1
        //             },
        //             1200: {
        //                 slidesPerView: 2
        //             },
        //         }
        //     });
        // }
      }
    },

    organizeProductHistory: function () {
      let target = $(".products-history .container").get(0);

      if (!target) {
        return;
      }

      let observer = new MutationObserver(function (mutationsList, observer) {
        $.each(mutationsList, function () {
          if (
            this.type == "childList" &&
            $(this.target).prop("id") == "produtos"
          ) {
            $('.products-history .container img[src*="sobconsulta"]').after(
              '<div class="botao-commerce">Sob consulta</div>',
            );

            setTimeout(function () {
              $(".products-history .history-loader").removeClass("show");
            }, 200);

            return false;
          }
        });
      });

      observer.observe(target, { childList: true, subtree: true });

      $(".products-history").on("click", "#linksPag a", function () {
        $(".products-history #produtos").html("");
        $(".products-history .history-loader").addClass("show");
      });
    },

    shareBtn: function () {
      // click btn
      $(".share-button").on("click", function () {
        $(this).parent().toggleClass("active");
      });

      var pageLink = window.location.href;
      var pageTitle = String(document.title).replace(/\&/g, "%26");

      // click fb-h
      $(".fb-h").on("click", function () {
        window.open(
          `http://www.facebook.com/sharer.php?u=${pageLink}&quote=${pageTitle}`,
          "sharer",
          "toolbar=0,status=0,width=626,height=436",
        );
        return false;
      });

      $(".wp-h").on("click", function () {
        let newPageTitle = encodeURI(pageTitle);
        window.open(
          `https://api.whatsapp.com/send?text=${newPageTitle}%20-%20Acesse:%20${pageLink}`,
          "sharer",
          "toolbar=0,status=0,width=626,height=436",
        );
        return false;
      });

      $(".tw-h").on("click", function () {
        window.open(
          `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageLink}`,
          "sharer",
          "toolbar=0,status=0,width=626,height=436",
        );
        return false;
      });

      $(".pi-h").on("click", function () {
        window.open(
          `https://www.pinterest.com/pin/create/button/?&text=${pageTitle}&url=${pageLink}&description=${pageTitle}`,
          "sharer",
          "toolbar=0,status=0,width=626,height=436",
        );
        return false;
      });
    },

    loadProductVariantImage: function (id) {
      $.ajax({
        url: `/web_api/variants/${id}`,
        method: "get",
        success: function (response) {
          let images = response.Variant.VariantImage;

          if (images.length) {
            theme.recreateProductGallery(images);
          }
        },
        error: function (request, status, error) {
          console.log(
            `[Theme] An error occurred while retrieving product variant image. Details: ${error}`,
          );
        },
      });
    },

    detectProductVariantChanges: function () {
      let internal = this;

      $(".product-variants").on(
        "click",
        ".lista_cor_variacao li[data-id]",
        function () {
          internal.loadProductVariantImage($(this).data("id"));
        },
      );

      $(".product-variants").on("click", ".lista-radios-input", function () {
        internal.loadProductVariantImage($(this).find("input").val());
      });

      $(".product-variants").on("change", "select", function () {
        internal.loadProductVariantImage($(this).val());
      });
    },

    floatingBuyButton: function () {
      if (
        $("html").is(".page-product") &&
        $(".plugoo-floating-button").length
      ) {
        $(".plugoo-floating-button .floating-actions p").on(
          "click",
          function () {
            const elementoTopo = $("#product-form-scroll").offset().top;
            $("html, body").animate({ scrollTop: elementoTopo }, "slow");
            $(".product-box #button-buy").trigger("click");
          },
        );

        correctAttSearch = function () {
          let productBoxHeight = $(".product-box").outerHeight();
          let position = $(window).scrollTop() - 10;
          if (position > productBoxHeight) {
            $(".plugoo-floating-button").addClass("show");
            $(".plugoo-insta-float, .plugoo-wp-float").addClass("floating-buy");
          } else {
            $(".plugoo-floating-button").removeClass("show");
            $(".plugoo-insta-float, .plugoo-wp-float").removeClass(
              "floating-buy",
            );
          }
        };
        scrollFloatingBuyButton = function () {
          let internal = this;
          this.correctAttSearch();
          $(window).on("scroll", function () {
            internal.correctAttSearch();
          });
        };
        scrollFloatingBuyButton();
        let handleObserver = 0;
        formatPrice = function (valueprice) {
          const priceFormated = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(valueprice);
          return priceFormated;
        };
        variationChange = function () {
          var variantVersion = $("#selectedVariant").val();
          fetch(`/web_api/variants/${variantVersion}`)
            .then(function (response) {
              if (!response.ok) {
                throw new Error("Erro ao carregar os dados");
              }
              return response.json();
            })
            .then(function (data) {
              const full_price =
                data.Variant.promotional_price > 0
                  ? data.Variant.promotional_price
                  : data.Variant.price;
              const imgVar = data.Variant.VariantImage[0].thumbs["90"].https;
              $(".floating-price").html(`${formatPrice(full_price)}`);
              $(".floating-product-info .product-image img").attr(
                "src",
                `${imgVar}`,
              );
            })
            .finally(function () {
              handleObserver = 0;
            });
        };

        const elementToObserve = $("#selectedVariant").get(0);
        function handleMutation(mutations) {
          mutations.forEach(function (mutation) {
            if (
              mutation.type === "attributes" &&
              mutation.attributeName === "value" &&
              $("#selectedVariant").val() != "" &&
              handleObserver == 0
            ) {
              variationChange();
              handleObserver += 1;
            }
          });
        }
        var config = {
          attributes: true,
          attributeFilter: ["value"],
        };
        var observer = new MutationObserver(handleMutation);
        observer.observe(elementToObserve, config);
      }
    },

    /* Store reviews page */

    organizeStoreReviewsPage: function () {
      if ($(".page-content .container .btns-paginator").length) {
        $(".page-content .container .btns-paginator")
          .parent()
          .addClass("store-review-paginator");
      }

      $(".page-content .container").append(
        '<div class="botao-commerce show-modal-store-review" data-toggle="modal-theme" data-target=".modal-store-reviews">Deixe seu depoimento</div>',
      );
      $("#depoimento #aviso_depoimento").after(
        '<button type="button" class="botao-commerce send-store-review">Enviar</button>',
      );

      $(".page-content h2:first").appendTo(".modal-store-reviews .modal-info");
      $("#depoimento").appendTo(".modal-store-reviews .modal-info");

      $("#comentario_cliente").remove();
      $(".modal-store-reviews #depoimento a").remove();

      $(".page-depoimentos .page-content").addClass("show");
      $(".page-depoimentos").addClass("show-menu");
    },

    validateStoreReviewForm: function () {
      $(".modal-store-reviews #depoimento").validate({
        rules: {
          nome_depoimento: {
            required: true,
          },
          email_depoimento: {
            required: true,
            email: true,
          },
          msg_depoimento: {
            required: true,
          },
          input_captcha: {
            required: true,
          },
        },
        messages: {
          nome_depoimento: {
            required: "Por favor, informe seu nome completo",
          },
          email_depoimento: {
            required: "Por favor, informe seu e-mail",
            email: "Por favor, preencha com um e-mail v&aacute;lido",
          },
          msg_depoimento: {
            required: "Por favor, escreva uma mensagem no seu depoimento",
          },
          input_captcha: {
            required:
              "Por favor, preencha com o c&oacute;digo da imagem de verifica&ccedil;&atilde;o",
          },
        },
        errorElement: "span",
        errorClass: "error-block",
        errorPlacement: function (error, element) {
          if (element.prop("type") === "radio") {
            error.insertAfter(element.parent(".nota_dep"));
          } else if (element.is("textarea")) {
            error.insertAfter(element.parent().find("h5"));
          } else {
            error.insertAfter(element);
          }
        },
      });

      $(".modal-store-reviews #depoimento .send-store-review").on(
        "click",
        function () {
          let form = $(".modal-store-reviews #depoimento");
          let button = $(this);

          if (form.valid()) {
            button.html("Enviando...").attr("disabled", true);
            enviaDepoimentoLoja();
          }
        },
      );

      /* Create observer to detect Tray return */

      let target = $("#aviso_depoimento").get(0);
      let config = { attributes: true };

      let observerReviewMessage = new MutationObserver(function (
        mutationsList,
        observer,
      ) {
        $(".depoimentos-modal #depoimento .send-store-review")
          .html("Enviar")
          .removeAttr("disabled");
      });

      observerReviewMessage.observe(target, config);
    },

    /* News page */
    organizeNewsPage: function () {
      if (!window.location.href.includes("busca_noticias")) {
        $("#listagemCategorias").parent().before("<h1>Not&iacute;cias</h1>");
      }
      $(".noticias").find("li").wrapInner('<div class="box-noticia"></div>');

      $(".page-busca_noticias .box-noticia").each(function () {
        let link = $(this).find("#noticia_imagem a").attr("href");
        $(this)
          .find("p")
          .after(`<a href="${link}" class="button-show">Ver mais</a>`);
      });

      $(".page-busca_noticias .page-content").addClass("show");
      $(".page-busca_noticias").addClass("show-menu");
    },

    /* Contact page */
    organizeContactPage: function () {
      $(".page-contact .page-content > .container").prepend(`
                <h1>Fale conosco</h1>
                <p class="description">Precisa falar com a gente? Utilize uma das op&ccedil;&otilde;es abaixo para entrar em contato conosco.</p>
                <div class="cols">
                    <div class="box-form">                        
                    </div>
                    <div class="info-form"></div>
                </div>
            `);

      $($(".page-content .container3").eq(1)).appendTo(".info-form");
      $($(".page-content .container3 .container2 .container2").eq(0)).appendTo(
        ".box-form",
      );

      if ($(".info-form h3:contains(Empresa)").length) {
        $(".info-form h3:contains(Empresa)")
          .parent()
          .insertBefore($(".info-form h3:contains(Endere)").parent());
      }

      $(".info-form h3:contains(Endere)").parent().after($(".map-iframe"));
      $(".page-contact form img.image")
        .after(
          '<div class="flex justify-end"><span class="botao-commerce flex align-center justify-center">Enviar</span></div>',
        )
        .remove();
      $(".page-contact #telefone_contato")
        .removeAttr("onkeypress maxlength")
        .addClass("phone-mask");

      if ($(".page-contact .contato-telefones .block:nth-child(1)").length) {
        let phoneNumberFormatted = $(
          ".page-contact .contato-telefones .block:nth-child(1)",
        ).text();
        let phoneNumber = phoneNumberFormatted.replace(/\D/g, "");

        $(".page-contact .contato-telefones .block:nth-child(1)").html(
          `<a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberFormatted}</a>`,
        );
      }

      if ($(".page-contact .contato-telefones .block:nth-child(2)").length) {
        let phoneNumberFormatted = $(
          ".page-contact .contato-telefones .block:nth-child(2)",
        ).text();
        let phoneNumber = phoneNumberFormatted.replace(/\D/g, "");

        $(".page-contact .contato-telefones .block:nth-child(2)").html(
          `<a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?l=pt&phone=55${phoneNumber}" title="Fale conosco no WhatsApp">${phoneNumberFormatted}</a>`,
        );
      }

      $(".page-contact .page-content").addClass("active");
    },

    /* Gifts page */
    gifts: function () {
      $('#form_presentes input[type="image"]')
        .prev()
        .html('<div class="botao-commerce">Continuar Comprando</div>');
      $('#form_presentes input[type="image"]')
        .wrap('<div class="relative-button"></div>')
        .after('<button class="botao-commerce">Avan&ccedil;ar</button>')
        .remove();
    },

    /* Newsletter page */
    organizeNewsletterPage: function () {
      if ($(".page-newsletter .formulario-newsletter").length) {
        $(
          ".page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input",
        )
          .attr("placeholder", "Digite o c&oacute;digo ao lado")
          .trigger("focus");
        $(".formulario-newsletter .newsletterBTimg")
          .html("Enviar")
          .removeClass()
          .addClass("botao-commerce");
      } else {
        $(".page-newsletter .page-content").addClass(
          "success-message-newsletter",
        );
        $(
          ".page-newsletter .page-content.success-message-newsletter .board p:first-child a",
        )
          .addClass("botao-commerce")
          .html("Voltar para p&aacute;gina inicial");
      }

      setTimeout(function () {
        $(".page-newsletter .page-content").addClass("show");
      }, 200);
    },

    /* To Action in ajax.html */
    updateCartTotal: function () {
      $('[data-cart="amount"]').text($(".cart-preview-item").length);
    },

    /* Footer */
    organizeFooter: function () {
      $(".footer .box .title").on("click", function (event) {
        let item = $(this).parent();

        item.toggleClass("show");

        if (item.hasClass("show")) {
          item.children(".overflow").slideDown();
        } else {
          item.children(".overflow").slideUp();
        }

        event.preventDefault();
        return false;
      });
    },

    /* Cookies */
    cookiesAlert: function () {
      if ($(".plugoo_cookie").length > 0) {
        $(window).on("load", function () {
          const bar = document.querySelector(".plugoo_cookie");
          const btnClose = document.querySelector(".plugoo_cookie_close");
          const btnAccept = document.querySelector(".plugoo_cookie .-accept");

          if (!Cookies.get("privacidade")) {
            bar.classList.add("-active");
          }

          btnClose.onclick = (e) => {
            e.preventDefault();
            setCookie();
          };

          btnAccept.onclick = (e) => {
            e.preventDefault();
            setCookie();
          };

          function setCookie() {
            Cookies.set("privacidade", 1, { expires: 30, path: "" });
            bar.classList.remove("-active");
          }
        });
      }
    },

    modalAgeRestrict: function () {
      if ($(".modal-restrict-age").length) {
        var timeout = 500; // milliseconds
        var cookie_expire = 30; // days

        var cookie = localStorage.getItem("age_restriction");
        if (cookie == undefined || cookie == null) {
          cookie = 0;
        }

        if (
          (new Date().getTime() - cookie) / (1000 * 60 * 60 * 24) >
          cookie_expire
        ) {
          setTimeout(() => {
            $(".modal-restrict-age").addClass("show");
          }, timeout);

          $(".btn-confirm-age").click(() => {
            localStorage.setItem("age_restriction", new Date().getTime());
            $(".modal-restrict-age").removeClass("show");
            $(".modal-restrict-age").addClass("hide");
          });
        }

        $(".btn-restrict-age").click(function () {
          window.location.reload();
        });
      }
    },
  };

  $(function () {
    theme.resets();
    theme.recoveryStoreId();
    theme.scrollHeader();

    setTimeout(function () {
      theme.processRteElements();
      theme.loadThemeVersion();
      theme.initLazyload();
      theme.mainMenu();
      theme.mainMenuMobile();
      theme.initMasks();
      theme.toggleModalTheme();
      theme.overlay();
      theme.organizeFooter();
      theme.productsMenu();
      theme.slideBanners();
      theme.addCart();
      theme.newsletter();
      theme.exitPopup();
      theme.cookiesAlert();
      theme.modalAgeRestrict();
      theme.powerDisplay();
      theme.searchDesktop();
      theme.preHeader();
    }, 20);

    if ($("html").hasClass("page-home")) {
      setTimeout(function () {
        theme.bannerHome();
        theme.loadNews();
        theme.productsHome();
        theme.bannerMiniSlide();
        theme.youtubeVideo();
      }, 40);
      theme.storeReviewsIndex();
    } else if ($("html").hasClass("page-newsletter")) {
      theme.organizeNewsletterPage();
    } else if (
      $("html").hasClass("page-catalog") ||
      $("html").hasClass("page-search")
    ) {
      theme.slideCatalog();
      theme.sortMobile();
      theme.usabilityCatalog();
    } else if ($("html").hasClass("page-product")) {
      theme.initProductGallery();
      theme.toggleProductVideo();
      theme.openSizeGuide();
      theme.detectProductVariantChanges();
      theme.goToProductReviews();
      theme.getShippingRates();
      theme.productBuyTogether();
      theme.productTabsAction();
      theme.productReviews();
      theme.productRelatedCarousel();
      theme.organizeProductHistory();
      theme.shareBtn();
      theme.observerProductPriceChange();
    } else if ($("html").hasClass("page-busca_noticias")) {
      theme.organizeNewsPage();
      theme.generateBreadcrumb("news-page-listing");
    } else if ($("html").hasClass("page-noticia")) {
      theme.generateBreadcrumb("news-page");
    } else if ($("html").hasClass("page-depoimentos")) {
      theme.organizeStoreReviewsPage();
      theme.validateStoreReviewForm();
    } else if ($("html").hasClass("page-contact")) {
      theme.organizeContactPage();
    } else if ($("html").hasClass("page-finalizar_presentes")) {
      theme.gifts();
    }
  });

  // setTimeout(function(){
  //     var cart = {
  //         customerId: null,
  //         loadCustomerId: function(){
  //             if(!cart.customerId){
  //                 const customerInfo = dataLayer.find(element => ('customerId' in element));
  //                 cart.customerId = customerInfo ? customerInfo.customerId : null;
  //                 console.log('cart.customerId',cart.customerId);
  //             }
  //         },
  //         session: function () {
  //             return jQuery("html").attr("data-session");
  //         },

  //         filterVariant: function(variants, color, selects){
  //             var i = 0;
  //             var select = color || (selects && selects.length > 0 ? selects.eq(0).val() : null);
  //             var select2 = (selects && selects.length > 1) ? selects.eq(1).val() : null;

  //             while(i < variants.length){
  //                 if(variants[i].option == select && (!variants[i].option2 || variants[i].option2 == select2)){
  //                     return variants[i];
  //                 }
  //                 i++;
  //             }
  //             return 500;
  //         },

  //         updateProductImage: function(variantId) {
  //             let variant = this.variants.find(v => v.id === variantId);
  //             // supondo que "variant.image1" contÃ©m a URL da imagem do produto
  //             if (variant && variant.image1) {
  //                 $('#product-image').attr('src', variant.image1);
  //             }
  //         },
  //         stockAlert: function(e){
  //             var variant = cart.filterVariant(jQuery(e).data('variants'), jQuery(e).find('select'));
  //             var quant = Number(e.find('input[type="number"]').val());
  //             var color = e.attr('data-selected-color');
  //             var variant = cart.filterVariant(jQuery(e).data('variants'), color, e.find('select'));

  //             e.find('input[type="number"]').attr('max', variant.stock).attr('data-variant', variant.id);

  //             var numberFormat = new Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' });
  //             var price = numberFormat.format(variant.price.price);
  //             var payment = variant.price.payment;

  //             e.closest('.product').find('.product-price').html('<div class="price-off new-price current-price">'+ price +'</div><div class="product-payment">'+ payment +'</div>');

  //             if(Number(variant.stock) >= quant) {
  //                 jQuery(e).removeClass('dont-stock');
  //             } else{
  //                 jQuery(e).addClass('dont-stock');
  //             }

  //         },
  //         initAdd: function () {

  //             jQuery('body').on('change', '.add-cart input', function(){
  //                 var total = Number(jQuery(this).val());
  //                 jQuery(this).val(total > 0 ? total : 1);
  //             });

  //             jQuery('body').on('click', '.first.option-select li', function() {
  //                 var selectedColor = jQuery(this).data('value');
  //                 jQuery(this).siblings().removeClass('active');
  //                 jQuery(this).addClass('active');
  //                 jQuery(this).parents('.list-variants').attr('data-selected-color', selectedColor);
  //                 cart.stockAlert(jQuery(this).parents('.list-variants'));
  //             });

  //             jQuery('body').on('change', '.list-variants select', function() {

  //                 if(jQuery(this).hasClass('first')){
  //                     alert('first');
  //                     if(jQuery(this).parents('.list-variants').find('.second').val() || !jQuery(this).parents('.list-variants').find('.second').length){
  //                         cart.stockAlert(jQuery(this).parents('.list-variants'));
  //                     }
  //                 } else{
  //                     if(jQuery(this).parents('.list-variants').find('.first').val()){
  //                         cart.stockAlert(jQuery(this).parents('.list-variants'));
  //                     }
  //                 }

  //             });

  //             jQuery('body').on('submit', '.list-variants', function(e){
  //                 e.preventDefault();

  //                 if(jQuery(this).hasClass('dont-stock')) return false;
  //                 var id = jQuery(this).data('id');
  //                 var quant = jQuery(this).find('input').val();
  //                 var href = jQuery(this).parents('.product').find('> a').attr('href');
  //                 var variant = jQuery(this).data('variants').length ? jQuery(this).find('input').attr('data-variant') : 0;
  //                 var validaApi = jQuery(this).data('api-cart');
  //                 console.log('id', id);
  //                 console.log('quant', quant);
  //                 console.log('variant', variant);
  //                 console.log('href', href);
  //                 console.log('validaApi', validaApi);

  //                 cart.addToCart(id, quant, variant, href, validaApi);
  //             });
  //         },

  //         addToCart: function(productId, quantity, variant, href){

  //             cart.loadCustomerId();

  //             const data = {
  //                 Cart: {
  //                     session_id : cart.session(),
  //                     product_id : productId,
  //                     variant_id : variant ? variant : 0,
  //                     quantity   : quantity
  //                 }
  //             };

  //             if(cart.customerId){
  //                 data.Cart.customer_id = cart.customerId;
  //             }

  //             jQuery.ajax({
  //                 method: 'post',
  //                 url: '/web_api/cart/',
  //                 dataType: 'json',
  //                 data: data,
  //                 success: function(response) {
  //                     // exibe o carrinho lateral ou faz a aÃ§Ã£o desejada pelo parceiro
  //                     // Exemplo: cart.showCart();
  //                 },
  //                 error: function( ){
  //                     window.location.href = href;
  //                 }
  //             });

  //         }
  //     }

  //     cart.initAdd();
  // }, 200);
})(jQuery);

(function ($) {
  $(document).ready(function () {
    if ($(".plugoo-stories-products").length && $("html").is(".page-home")) {
      var barToAnimateProgress;
      var progressBarContainer;
      var duration = 5000;
      var interval = 100;
      var startTime;
      var remainingTime = "";
      var elementPostNext = "";
      var startTimeClick, endTimeClick, durationOfClick;

      endAnimation = function () {
        if (barToAnimateProgress) {
          barToAnimateProgress.stop(true, true).clearQueue();
        }
      };

      stopAnimation = function () {
        if (barToAnimateProgress) {
          barToAnimateProgress.clearQueue().stop(true);
          remainingTime =
            (remainingTime != "" ? remainingTime : duration) -
            (jQuery.now() - startTime);
        }
      };

      goNext = function (elementPost) {
        remainingTime = "";
        let idNextPost;

        if (elementPostNext == "") {
          elementPostNext = elementPost.closest("ul.show").find(".posts");
        } else {
          elementPostNext = elementPostNext.closest("ul.show").find(".posts");
        }

        if (
          elementPostNext
            .closest(".product-story-content")
            .find("ul")
            .last()
            .is(".show") &&
          elementPostNext
            .closest(".product-story-content")
            .find("ul")
            .last()
            .find("li")
            .last()
            .is(".show")
        ) {
          $(".plugoo-stories-products .close-story").trigger("click");
        }

        if (elementPostNext.last().is(".show")) {
          elementPost
            .removeClass("show")
            .closest("ul.show")
            .removeClass("show")
            .next()
            .addClass("show")
            .find("li:first-child")
            .addClass("show");
          idNextPost = elementPost
            .closest(".product-story-content")
            .find("ul.show > .posts.show")
            .attr("id");
          barToAnimateProgress = elementPost
            .closest(".product-story-content")
            .find(`ul.show [data-post="${idNextPost}"] .story-bar-progress`);
          progressBarContainer = elementPost
            .closest(".product-story-content")
            .find(`ul.show [data-post="${idNextPost}"]`);
          elementPostNext = elementPost
            .closest(".plugoo-stories-products")
            .find("ul.show .posts.show");
        } else {
          elementPostNext
            .closest("ul")
            .find(".show")
            .removeClass("show")
            .next("li")
            .addClass("show");
          idNextPost = elementPost
            .closest(".product-story-content")
            .find("ul.show > .posts.show")
            .attr("id");
          barToAnimateProgress = elementPost
            .closest(".product-story-content")
            .find(`ul.show [data-post="${idNextPost}"] .story-bar-progress`);
          progressBarContainer = elementPost
            .closest(".product-story-content")
            .find(`ul.show [data-post="${idNextPost}"]`);
        }
      };

      goBack = function (elementPost) {
        remainingTime = "";
        let idPreviousPost;
        if (
          !elementPostNext
            .closest(".product-story-content")
            .find("ul")
            .first()
            .is(".show")
        ) {
          if (elementPostNext.first().is(".show")) {
            elementPost
              .removeClass("show")
              .closest("ul.show")
              .removeClass("show")
              .prev()
              .addClass("show")
              .find("li:first-child")
              .addClass("show");
            idPreviousPost = elementPost
              .closest(".product-story-content")
              .find("ul.show > .posts.show")
              .attr("id");
            barToAnimateProgress = elementPost
              .closest(".product-story-content")
              .find(
                `ul.show [data-post="${idPreviousPost}"] .story-bar-progress`,
              );
            progressBarContainer = elementPost
              .closest(".product-story-content")
              .find(`ul.show [data-post="${idPreviousPost}"]`);
            elementPostNext = elementPost
              .closest(".plugoo-stories-products")
              .find("ul.show .posts.show");
            elementPostNext
              .closest(".plugoo-stories-products")
              .find(`ul.show .story-bar-progress`)
              .css("width", "0%");
          } else {
            elementPostNext
              .closest("ul")
              .find(".show")
              .removeClass("show")
              .prev("li")
              .addClass("show");
            idPreviousPost = elementPost
              .closest(".product-story-content")
              .find("ul.show > .posts.show")
              .attr("id");
            barToAnimateProgress = elementPost
              .closest(".product-story-content")
              .find(
                `ul.show [data-post="${idPreviousPost}"] .story-bar-progress`,
              );
            progressBarContainer = elementPost
              .closest(".product-story-content")
              .find(`ul.show [data-post="${idPreviousPost}"]`);
            elementPostNext
              .closest(".plugoo-stories-products")
              .find(
                `ul.show [data-post="${idPreviousPost}"] .story-bar-progress`,
              )
              .css("width", "0%");
          }
        }
      };

      progressTest = function (
        progressBar,
        progressBarContainer,
        duration,
        interval,
        elementPost,
      ) {
        startTime = jQuery.now();
        barToAnimateProgress = progressBar.animate(
          {
            width: "100%",
          },
          {
            duration: remainingTime != "" ? remainingTime : duration,
            complete: function () {
              goNext(elementPost);
              progressTest(
                barToAnimateProgress,
                progressBarContainer,
                duration,
                interval,
                elementPostNext,
              );
            },
          },
        );
      };
      $(".plugoo-stories-products .actions > div").on({
        mousedown: handleStart,
        mouseup: handleEnd,
        click: handleClick,
        touchstart: handleStart,
        touchend: handleEnd,
        contextmenu: teste,
      });

      function teste(event) {
        event.preventDefault();
      }

      function handleStart(event) {
        event.stopPropagation();
        stopAnimation();
        $(".plugoo-stories-products").addClass("paused");
        startTimeClick = new Date().getTime();
      }

      function handleEnd(event) {
        event.stopPropagation();
        endTimeClick = new Date().getTime();
        durationOfClick = endTimeClick - startTimeClick;
        $(".plugoo-stories-products").removeClass("paused");
        progressTest(
          barToAnimateProgress,
          progressBarContainer,
          duration,
          interval,
          elementPostNext,
        );
      }

      function handleClick(event) {
        event.stopPropagation();
        if (durationOfClick <= 120) {
          if ($(this).is(".next-story")) {
            let nextStory = $(this)
              .closest(".plugoo-stories-products")
              .find(`ul.show > .posts.show`);
            stopAnimation();
            $(this)
              .closest(".plugoo-stories-products")
              .find(
                `ul.show .story-full-bar[data-post="${nextStory.attr("id")}"] .story-bar-progress`,
              )
              .css("width", "100%");
            goNext(nextStory);
            progressTest(
              barToAnimateProgress,
              progressBarContainer,
              duration,
              interval,
              elementPostNext,
            );
          } else {
            let backStory = $(this)
              .closest(".plugoo-stories-products")
              .find(`ul.show > .posts.show`);
            stopAnimation();
            !$(this)
              .closest(".plugoo-stories-products")
              .find(`ul`)
              .first()
              .is(".show")
              ? $(this)
                  .closest(".plugoo-stories-products")
                  .find(
                    `ul.show .story-full-bar[data-post="${backStory.attr("id")}"] .story-bar-progress`,
                  )
                  .css("width", "0%")
              : "";
            goBack(backStory);
            progressTest(
              barToAnimateProgress,
              progressBarContainer,
              duration,
              interval,
              elementPostNext,
            );
          }
        }
      }

      $(".plugoo-stories-products .stories a").on("click", function () {
        $(this)
          .closest(".plugoo-stories-products")
          .find(".product-story-content")
          .removeClass("hidden")
          .addClass("show");
        $(this)
          .closest(".plugoo-stories-products")
          .find(
            `[data-story="${$(this).attr("id")}"], [data-story="${$(this).attr("id")}"] li:first-child`,
          )
          .addClass("show");
        $(this)
          .closest(".plugoo-stories-products")
          .find(".shadow.blur")
          .addClass("show");
        elementPostNext = $(this)
          .closest(".plugoo-stories-products")
          .find(`[data-story="${$(this).attr("id")}"] .posts.show`);
        let idCheck = elementPostNext.attr("id");
        barToAnimateProgress = $(this)
          .closest(".plugoo-stories-products")
          .find("ul.show")
          .find(`[data-post="${idCheck}"] .story-bar-progress`);
        progressBarContainer = $(this)
          .closest(".plugoo-stories-products")
          .find(`.product-story-content ul.show [data-post="${idCheck}"]`);
        progressBarContainer
          .closest(".plugoo-stories-products")
          .find(".story-bar-progress")
          .removeAttr("style");
        progressTest(
          barToAnimateProgress,
          progressBarContainer,
          duration,
          interval,
          elementPostNext,
        );
        $("html").addClass("not-scroll");
      });

      $(".plugoo-stories-products .close-story").on("click", function () {
        $(this)
          .closest(".plugoo-stories-products")
          .find(".product-story-content")
          .removeClass("show")
          .addClass("hidden");
        $(this)
          .closest(".plugoo-stories-products")
          .find("ul.show, ul.show > li.show ")
          .removeClass("show");
        $(this)
          .closest(".plugoo-stories-products")
          .find(".shadow.blur")
          .removeClass("show");
        endAnimation();
        $("html").removeClass("not-scroll");
      });

      let showcaseSize = $(
        ".plugoo-stories-products .swiper-wrapper  .item",
      ).length;

      if (showcaseSize >= 1) {
        new Swiper(".plugoo-stories-products .swiper-container", {
          loop: false,
          spaceBetween: 0,
          reverseDirection: false,
          breakpoints: {
            320: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
            1200: {
              slidesPerView: 6,
            },
          },
          autoplay: {
            delay: 3000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          },
          lazy: {
            loadPrevNext: true,
          },
          pagination: {
            el: ".plugoo-stories-products .dots",
            bulletClass: "dot",
            bulletActiveClass: "dot-active",
            clickable: true,
          },
          navigation: {
            nextEl: ".plugoo-stories-products .swiper-button-next",
            prevEl: ".plugoo-stories-products .swiper-button-prev",
          },
        });
      }
    }

    if ($(".plugoo-cart-preview-sidebar").length) {
      function verifyCartValue(benefit, text) {
        let actualValue = $(".cart-preview-footer .value")
          .text()
          .replace("R$", "")
          .replace(".", "")
          .replace(",", ".");
        let progressBar = $(`.plugoo-progress-bar.${benefit}`).data(
          `min-${benefit}`,
        );
        let remain = parseFloat(progressBar) - parseFloat(actualValue);
        let percent = (actualValue / progressBar) * 100;
        let priceRemain = Intl.NumberFormat("pt-br", {
          style: "currency",
          currency: "brl",
        }).format(remain);
        $(`.plugoo-progress-bar.${benefit}`).each(function () {
          if (parseFloat(actualValue) >= parseFloat(progressBar)) {
            $(this).find(".percent-bar").css("width", `100%`);
            $(this)
              .attr("data-progress", "3")
              .find(".plugoo-text-remain")
              .html(`Voc&ecirc; ganhou <b class="plugoo-brinde">${text}</b>`);
          } else if (percent >= 50 && percent <= 99.9) {
            $(this).find(".percent-bar").css("width", `${percent}%`);
            $(this)
              .attr("data-progress", "2")
              .find(".plugoo-text-remain")
              .html(
                `Adicione mais <b class="plugoo-remain fifty">${priceRemain}</b> para ganhar ${text}`,
              );
          } else {
            $(this).find(".percent-bar").css("width", `${percent}%`);
            $(this)
              .attr("data-progress", "1")
              .find(".plugoo-text-remain")
              .html(
                `Adicione mais <b class="plugoo-remain fifty">${priceRemain}</b> para ganhar ${text}`,
              );
          }
        });
      }

      var cartPreviewFooter = $(".cart-preview-footer")[0];
      function mutationCallback(mutationsList) {
        mutationsList.forEach((mutation) => {
          if (mutation.type === "childList") {
            if ($(".plugoo-progress-bar.gift").length) {
              verifyCartValue("gift", "um presente!");
            }
            if ($(".plugoo-progress-bar.freeship").length) {
              verifyCartValue("freeship", "frete gratis!");
            }
          } else if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style"
          ) {
            if ($(".plugoo-cart-preview-sidebar .list .error").length) {
              $(".cart-preview-footer .value").html(`R$ 0`);
            }
          }
        });
      }
      var observer = new MutationObserver(mutationCallback);
      var config = {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ["style"],
      };

      observer.observe(cartPreviewFooter, config);
    }
  });
})(jQuery);

(function ($) {
  pegarValor = function () {
    sizes = $("#selecao-provador")
      .find(".conteiner-info [data-sizes]")
      .data("sizes");

    let provador = {};

    $.each(sizes, function (i, e) {
      provador[i] = {};
      $.map(e, function (element) {
        valTotal = [];
        $.map(element.value, function (val) {
          valTotal.push(val);
        });
        provador[i][element.id] = valTotal;
      });
    });

    return provador;
  };

  $("html.page-product .product-size-provador").on("click", function () {
    let dataGenderShow = $(this).attr("data-gender-show");
    if (dataGenderShow == 2) {
      $("#modal-provador button#feminino").css("display", "none");
      $("#modal-provador button#feminino").removeClass("show");
      $("#modal-provador button#masculino").addClass("show");
      if (
        $(".conteiner-img img.busto[data-gender= woman]:visible").length > 0
      ) {
        $(".conteiner-img img.busto[data-gender= man]:hidden").toggle();
        $(".conteiner-img img.busto[data-gender= woman]:visible").toggle();
      }
      alterarImgEDescricao("man");
    } else if (dataGenderShow == 1) {
      $("#modal-provador button#masculino").css("display", "none");
    }

    $(".modal-theme.modal-size-provador").toggleClass("show");
  });

  let imagemProduto = $(".conteiner-imagem img").attr("src");
  $("#resultado-provador img.produto-genero").attr("src", imagemProduto);

  let medidaEncontrada = false;
  let naoRecomendado;
  let recomendado;
  let tamanhosObjAtivos = [];
  let tamanhosAtivados = [];
  let recomendadoTotal = [];
  let melhorMedida = "";
  let mySwiper;

  // Mudar imagens e descriÃ§Ãµes do filtro
  alterarImgEDescricao = function (gender) {
    habilitarEDesabilitar = function (habilitar, desabilitar1, desabilitar2) {
      $(
        ".conteiner-img img." +
          habilitar +
          "[data-gender= " +
          gender +
          "]:hidden",
      ).toggle();
      $(
        ".conteiner-img img." +
          desabilitar1 +
          "[data-gender= " +
          gender +
          "]:visible",
      ).toggle();
      $(
        ".conteiner-img img." +
          desabilitar2 +
          "[data-gender= " +
          gender +
          "]:visible",
      ).toggle();
      $(".descricao-img." + habilitar + ":hidden").toggle();
      $(".descricao-img." + desabilitar1 + ":visible").toggle();
      $(".descricao-img." + desabilitar2 + ":visible").toggle();
    };

    $(".info-pessoa #cintura").on("mouseover", function () {
      habilitarEDesabilitar("cintura", "busto", "quadril");
    });
    $(".info-pessoa #busto").on("mouseover", function () {
      habilitarEDesabilitar("busto", "cintura", "quadril");
    });
    $(".info-pessoa #quadril").on("mouseover", function () {
      habilitarEDesabilitar("quadril", "cintura", "busto");
    });
  };

  // InicializaÃ§Ã£o das imagens e descriÃ§Ãµes do filtro
  alterarImgEDescricao("woman");

  // AlteraÃ§Ã£o de valores dos inputs
  campoInput = function (parteCorpo, intMax, intMin) {
    $(`#${parteCorpo} input[type='range']`).on("input", function () {
      tamanhoParteCorpo = $(this).val();
      $(`#${parteCorpo} #numeroInput`).val(tamanhoParteCorpo);
    });
    $(`#${parteCorpo} #numeroInput`).on("input", function () {
      $(this).css("border-color", "#000000");
      tamanhoParteCorpo = $(this).val();
      if (tamanhoParteCorpo > intMax) {
        $(this).val(intMax);
      } else if (tamanhoParteCorpo < intMin) {
        $(this).css("border-color", "#ff0000");
      }
      $(`#${parteCorpo} input[type='range']`).val(tamanhoParteCorpo);
    });
  };

  // Input Busto
  campoInput("busto", 180, 60);

  // Input Cintura
  campoInput("cintura", 174, 38);

  // Input Quadril
  campoInput("quadril", 168, 44);

  // Icone de justo, levemente justo, levemente folgado e folgado
  iconeAdd = function (id) {
    $(`#${id} [data-icon="icon-status"]`).append(`
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
        </svg>    
      `);
  };

  // Icone Ideal
  iconeIdeal = function (idIdeal) {
    $(`#${idIdeal} [data-icon="icon-status"]`).append(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
      </svg>
      `);
  };

  // Ãcone nÃ£o recomendado (Apertado e Largo)
  iconeNaoRec = function (idNaoRec) {
    $(
      `#${idNaoRec} [data-icon="icon-status"].apertado, #${idNaoRec} [data-icon="icon-status"].largo`,
    ).html(`
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>`);
  };

  // DefiniÃ§Ã£o dos tamanhos atravÃ©s dos inputs (busto, cintura, quadril)
  tamanhosPartesCorpo = function () {
    tamanhoParteCorpo = [];
    $(`.conteiner-medidas input[type='range']`).each(function () {
      tamanhoParteCorpo.push($(this).val());
    });
  };

  // DefiniÃ§Ã£o da tabela de medidas baseado no genero
  tabelaPorGenero = function (genero) {
    provador = pegarValor();
    intervalo = 10;
    tamanhosObjAtivos = [];
    tamanhosAtivados = [];

    $.each(provador[genero], function (medidas, tamanho) {
      tamanhos = {};
      tamanhos.BustoMin = parseInt(tamanho[0]) - intervalo;
      tamanhos.BustoIdeal = parseInt(tamanho[0]);
      tamanhos.BustoMax = parseInt(tamanho[0]) + intervalo;
      tamanhos.CinturaMin = parseInt(tamanho[1]) - intervalo;
      tamanhos.CinturaIdeal = parseInt(tamanho[1]);
      tamanhos.CinturaMax = parseInt(tamanho[1]) + intervalo;
      tamanhos.QuadrilMin = parseInt(tamanho[2]) - intervalo;
      tamanhos.QuadrilIdeal = parseInt(tamanho[2]);
      tamanhos.QuadrilMax = parseInt(tamanho[2]) + intervalo;
      tamanhosAtivados.push(medidas);
      tamanhosObjAtivos.push(tamanhos);
    });
  };

  // Define os ajustes das partes
  ajustesPartesCorpo = function (
    bodyPart,
    parteCorpo,
    valParteCorpo,
    valMin,
    valIdeal,
    valMax,
    modificador,
  ) {
    let naoRecomendado = 0;
    let recomendado = 0;

    apertado = function (bodyPart, valParteCorpo, parteCorpo) {
      if (valParteCorpo > valMax) {
        naoRecomendado++;
        recomendado -= 1;
        if (modificador) {
          $(`#forma-${parteCorpo} span`).text("Apertado");
          $(
            `#${bodyPart}, #forma-${parteCorpo} [data-icon='icon-status']`,
          ).addClass("apertado");
          iconeNaoRec(`forma-${parteCorpo}`);
        }
      }
    };

    justo = function (bodyPart, valParteCorpo, parteCorpo) {
      if (valParteCorpo == valMax) {
        recomendado += 1;
        if (modificador) {
          $(`#forma-${parteCorpo} span`).text("Justo");
          $(
            `#${bodyPart}, #forma-${parteCorpo} [data-icon='icon-status']`,
          ).addClass("justo");
          iconeAdd(`forma-${parteCorpo}`);
        }
      }
    };

    levementeJusto = function (bodyPart, valParteCorpo, parteCorpo) {
      if (valParteCorpo <= valMax - 1 && valParteCorpo > valIdeal) {
        levementeJustoBusto = true;
        recomendado += 2;
        if (modificador) {
          $(`#forma-${parteCorpo} span`).text("Levemente Justo");
          $(
            `#${bodyPart}, #forma-${parteCorpo} [data-icon='icon-status']`,
          ).addClass("levemente-justo");
          iconeAdd(`forma-${parteCorpo}`);
        }
      }
    };

    ideal = function (bodyPart, valParteCorpo, parteCorpo) {
      if (valParteCorpo == valIdeal) {
        idealBusto = true;
        recomendado += 3;
        if (modificador) {
          $(`#forma-${parteCorpo} span`).text("Ideal");
          $(
            `#${bodyPart}, #forma-${parteCorpo} [data-icon='icon-status']`,
          ).addClass("ideal");
          iconeIdeal(`forma-${parteCorpo}`);
        }
      }
    };

    levementeFolgado = function (bodyPart, valParteCorpo, parteCorpo) {
      if (valParteCorpo >= valMin + 1 && valParteCorpo < valIdeal) {
        levementeFolgadoBusto = true;
        recomendado += 2;
        if (modificador) {
          $(`#forma-${parteCorpo} span`).text("Levemente Folgado");
          $(
            `#${bodyPart}, #forma-${parteCorpo} [data-icon='icon-status']`,
          ).addClass("levemente-folgado");
          iconeAdd(`forma-${parteCorpo}`);
        }
      }
    };

    folgado = function (bodyPart, valParteCorpo, parteCorpo) {
      if (valParteCorpo == valMin) {
        folgadoBusto = true;
        recomendado += 1;
        if (modificador) {
          $(`#forma-${parteCorpo} span`).text("Folgado");
          $(
            `#${bodyPart}, #forma-${parteCorpo} [data-icon='icon-status']`,
          ).addClass("folgado");
          iconeAdd(`forma-${parteCorpo}`);
        }
      }
    };

    largo = function (bodyPart, valParteCorpo, parteCorpo) {
      if (valParteCorpo < valMin) {
        naoRecomendado++;
        recomendado -= 1;
        if (modificador) {
          $(`#forma-${parteCorpo} span`).text("Largo");
          $(
            `#${bodyPart}, #forma-${parteCorpo} [data-icon='icon-status']`,
          ).addClass("largo");
          iconeNaoRec(`forma-${parteCorpo}`);
        }
      }
    };

    apertado(bodyPart, valParteCorpo, parteCorpo);
    justo(bodyPart, valParteCorpo, parteCorpo);
    levementeJusto(bodyPart, valParteCorpo, parteCorpo);
    ideal(bodyPart, valParteCorpo, parteCorpo);
    levementeFolgado(bodyPart, valParteCorpo, parteCorpo);
    folgado(bodyPart, valParteCorpo, parteCorpo);
    largo(bodyPart, valParteCorpo, parteCorpo);

    return { valNaoRecomendado: naoRecomendado, valRecomendado: recomendado };
  };

  // Define a melhor opÃ§Ã£o entre os que servem
  determinarMelhorOpcao = function (recomendadoTotal) {
    let valores = [];
    recomendadoTotal.forEach((element) => {
      valores.push(element.valor);
    });
    let maiorRecomendado = Math.max.apply(null, valores);
    let indiceMaior = valores.indexOf(maiorRecomendado);

    $(
      `.opcoes-medidas div.botao-medidas[data-medida="${recomendadoTotal[indiceMaior].medida.toLowerCase()}"]`,
    ).append(`
        <div class="recomendado">
          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 37 37"><defs><linearGradient id="linear-gradient-recommended-icon" x1="0.184" y1="0.101" x2="0.852" y2="0.904" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#68e2c1"></stop><stop offset="1" stop-color="#5ebc7b"></stop></linearGradient><filter id="group-filter" x="0" y="0" width="37" height="37" filterUnits="userSpaceOnUse"><feOffset dy="3"></feOffset><feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur><feFlood flood-opacity="0.161"></feFlood><feComposite operator="in" in2="blur"></feComposite><feComposite in="SourceGraphic"></feComposite></filter></defs><g id="Group_363" data-name="Group 363" transform="translate(-825 -564)"><g transform="matrix(1, 0, 0, 1, 825, 564)" filter="url(#group-filter)"><g id="group-filter-2" data-name="Rectangle 438" transform="translate(11 8)" stroke="#fff" stroke-width="2" fill="url(#linear-gradient-recommended-icon)"><rect width="15" height="15" rx="7.5" stroke="none"></rect><rect x="-1" y="-1" width="17" height="17" rx="8.5" fill="none"></rect></g></g><g id="Group_83" data-name="Group 83" transform="translate(840.285 577.205)"><line id="Line_173" data-name="Line 173" y1="5" x2="4" transform="translate(1.715 -0.205)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line><line id="Line_174" data-name="Line 174" x1="2" y1="2" transform="translate(-0.285 2.795)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line></g></g></svg>
        </div>
      `);

    $(`.melhor-opcao > div`).append(`
          <div class="recomendado">
            <svg width="28" height="28" viewBox="0 0 28 28"><defs><linearGradient id="linear-gradient-ideal" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#68E2C1"></stop><stop offset="1" stop-color="#5EBC7B"></stop></linearGradient></defs><g id="ideal" transform="translate(19558 13689)"><g id="Rectangle_438" data-name="Rectangle 438" transform="translate(-19556 -13687)" stroke="#fff" stroke-width="2" fill="url(#linear-gradient-ideal)"><rect width="24" height="24" rx="12" stroke="none"></rect><rect x="-1" y="-1" width="26" height="26" rx="13" fill="none"></rect></g><g id="Group_83" data-name="Group 83" transform="translate(3.5 -82.071)"><line id="Line_173" data-name="Line 173" y1="8" x2="7" transform="translate(-19549.5 -13596.929)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line><line id="Line_174" data-name="Line 174" x1="3" y1="4" transform="translate(-19552.5 -13592.929)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line></g></g></svg>        
          </div>
        `);

    $(".melhor-opcao > div span").text(
      recomendadoTotal[indiceMaior].medida.toUpperCase(),
    );
    $(".melhor-opcao > span").html(`MELHOR OP&Ccedil;&Atilde;O`);
    valSelecionado = recomendadoTotal[indiceMaior].index;

    return indiceMaior;
  };

  // Verificar se a medida estÃ¡ dentro do intervalo especificado (MÃ¡ximo e MÃ­nimo)
  verificarMedida = function (medida, valMin, valMax) {
    if (medida >= valMin && medida <= valMax) {
      return true;
    } else {
      return false;
    }
  };

  newSwiper = function (action) {
    if (action == "create") {
      mySwiper = new Swiper(".opcoes-medidas.swiper-container", {
        slidesPerView: 3,
        spaceBetween: 10,
        initialSlide: valSelecionado,
        centeredSlides: true,
        slideToClickedSlide: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
      mySwiper.on("touchEnd", function () {
        setTimeout(() => {
          let novaMedida = $("#modal-provador .footer-resultado")
            .find(".botao-medidas.swiper-slide-active")
            .attr("data-medida");
          selecionarNovaMedida(novaMedida);
        }, 50);
      });
    } else if (action == "destroy") {
      if (mySwiper && mySwiper.destroy) {
        mySwiper.destroy();
      }
    }
  };

  // Recebe tabela e valores das partes do corpo para definir as melhores opÃ§Ãµes
  valPartesProximo = function (genero) {
    // Chamada para pegar valores dos inputs (busto, cintura, quadril)
    tamanhosPartesCorpo();

    // Chamada da tabela de medidas do genero
    tabelaPorGenero(genero);

    // VerificaÃ§Ã£o do tamanho
    verificacaoTamanho = function (
      tamanhoMedida,
      indexMedida,
      valMinBusto,
      valIdealBusto,
      valMaxBusto,
      valMinCintura,
      valIdealCintura,
      valMaxCintura,
      valMinQuadril,
      valIdealQuadril,
      valMaxQuadril,
      melhorOpcao,
    ) {
      busto = tamanhoParteCorpo[0];
      cintura = tamanhoParteCorpo[1];
      quadril = tamanhoParteCorpo[2];

      let recomendado = 0;
      let naoRecomendado = 0;

      // Verifica a medida de Busto
      let resultadoBusto = verificarMedida(busto, valMinBusto, valMaxBusto);
      // Verifica a medida de Cintura
      let resultadoCintura = verificarMedida(
        cintura,
        valMinCintura,
        valMaxCintura,
      );
      // Verifica a medida de Quadril
      let resultadoQuadril = verificarMedida(
        quadril,
        valMinQuadril,
        valMaxQuadril,
      );
      // Teste para definir PP/P/M/G/GG/G1/G2/G3/G4

      if (
        (resultadoBusto && resultadoCintura) ||
        (resultadoBusto && resultadoQuadril) ||
        (resultadoCintura && resultadoQuadril)
      ) {
        recomendado += ajustesPartesCorpo(
          "chest",
          "busto",
          busto,
          valMinBusto,
          valIdealBusto,
          valMaxBusto,
          melhorOpcao,
        ).valRecomendado;
        recomendado += ajustesPartesCorpo(
          "waist",
          "cintura",
          cintura,
          valMinCintura,
          valIdealCintura,
          valMaxCintura,
          melhorOpcao,
        ).valRecomendado;
        recomendado += ajustesPartesCorpo(
          "hip",
          "quadril",
          quadril,
          valMinQuadril,
          valIdealQuadril,
          valMaxQuadril,
          melhorOpcao,
        ).valRecomendado;

        recomendadoTotal.push({
          medida: tamanhoMedida,
          valor: recomendado,
          index: indexMedida,
        });

        medidaEncontrada = true;
      } else {
        naoRecomendado += ajustesPartesCorpo(
          "chest",
          "busto",
          busto,
          valMinBusto,
          valIdealBusto,
          valMaxBusto,
          false,
        ).valNaoRecomendado;
        naoRecomendado += ajustesPartesCorpo(
          "waist",
          "cintura",
          cintura,
          valMinCintura,
          valIdealCintura,
          valMaxCintura,
          false,
        ).valNaoRecomendado;
        naoRecomendado += ajustesPartesCorpo(
          "hip",
          "quadril",
          quadril,
          valMinQuadril,
          valIdealQuadril,
          valMaxQuadril,
          false,
        ).valNaoRecomendado;

        if (naoRecomendado >= 2) {
          $(
            `.opcoes-medidas div.botao-medidas[data-medida="${tamanhoMedida.toLowerCase()}"]`,
          ).append(`
              <div class="nao-recomendado">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 37 37"><defs><linearGradient id="linear-gradient-carousel-icon-not-recommended" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#ff4981"></stop><stop offset="1" stop-color="#ed1154"></stop></linearGradient><filter id="group-not-recommended-filter" x="0" y="0" width="37" height="37" filterUnits="userSpaceOnUse"><feOffset dy="3"></feOffset><feGaussianBlur stdDeviation="3" result="blur"></feGaussianBlur><feFlood flood-opacity="0.161"></feFlood><feComposite operator="in" in2="blur"></feComposite><feComposite in="SourceGraphic"></feComposite></filter></defs><g id="NÃ£o_serve" data-name="NÃ£o serve" transform="translate(19567 13785.095)"><g transform="matrix(1, 0, 0, 1, -19567, -13785.09)" filter="url(#group-not-recommended-filter)"><g id="group-not-recommended-filter-2" data-name="Not recommended rect" transform="translate(11 8)" stroke="#fff" stroke-width="2" fill="url(#linear-gradient-carousel-icon-not-recommended)"><rect width="15" height="15" rx="7.5" stroke="none"></rect><rect x="-1" y="-1" width="17" height="17" rx="8.5" fill="none"></rect></g></g><g id="Group_142" data-name="Group 142" transform="translate(-19551.238 -13772.289)"><g id="Group_96" data-name="Group 96" transform="translate(0)"><g id="Group_89" data-name="Group 89" transform="translate(0 0)"><line id="Line_173" data-name="Line 173" x2="2.748" y2="2.747" transform="translate(0)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line><line id="Line_174" data-name="Line 174" x1="2.748" y2="2.747" transform="translate(0 2.747)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line></g></g><g id="Group_97" data-name="Group 97" transform="translate(2.641)"><g id="Group_89-2" data-name="Group 89" transform="translate(0)"><line id="Line_173-2" data-name="Line 173" x1="2.748" y2="2.747" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line><line id="Line_174-2" data-name="Line 174" x2="2.748" y2="2.747" transform="translate(0 2.747)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line></g></g></g></g></svg>
              </div>
            `);
        }
      }
    };

    // Chama a melhor opÃ§Ã£o entre os que servem
    melhorMedida = "";
    let indexMelhorMedida = 0;
    let condicao = true;

    do {
      condicao = false;
      if (melhorMedida != "") {
        verificacaoTamanho(
          tamanhosAtivados[indexMelhorMedida],
          parseInt(indexMelhorMedida),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].BustoMin),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].BustoIdeal),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].BustoMax),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].CinturaMin),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].CinturaIdeal),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].CinturaMax),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].QuadrilMin),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].QuadrilIdeal),
          parseInt(tamanhosObjAtivos[indexMelhorMedida].QuadrilMax),
          true,
        );
      } else {
        tamanhosAtivados.forEach(function (objetos, index) {
          // Adicionar botÃµes das medidas
          $(".footer-resultado .botoes-opcoes").append(`
              <div class="botao-medidas swiper-slide" data-medida="${tamanhosAtivados[index]}">
                <span>${tamanhosAtivados[index].toUpperCase()}</span>
              </div>
            `);
          // Chamada de verificaÃ§Ã£o
          verificacaoTamanho(
            tamanhosAtivados[index],
            parseInt(index),
            parseInt(tamanhosObjAtivos[index].BustoMin),
            parseInt(tamanhosObjAtivos[index].BustoIdeal),
            parseInt(tamanhosObjAtivos[index].BustoMax),
            parseInt(tamanhosObjAtivos[index].CinturaMin),
            parseInt(tamanhosObjAtivos[index].CinturaIdeal),
            parseInt(tamanhosObjAtivos[index].CinturaMax),
            parseInt(tamanhosObjAtivos[index].QuadrilMin),
            parseInt(tamanhosObjAtivos[index].QuadrilIdeal),
            parseInt(tamanhosObjAtivos[index].QuadrilMax),
            false,
          );
        });

        if (medidaEncontrada == true) {
          let indice = determinarMelhorOpcao(recomendadoTotal);
          melhorMedida = recomendadoTotal[indice].medida;
          indexMelhorMedida = recomendadoTotal[indice].index;
          condicao = true;
        }
      }
    } while (condicao == true);
  };

  // BotÃ£o escolha de gÃªnero
  //Feminino
  $("#feminino").click(function () {
    // Opacidade do botÃ£o
    $("#feminino").addClass("show");
    $("#masculino").removeClass("show");
    // Chamar funÃ§Ã£o para alteraÃ§Ãµes das imagens e descriÃ§Ãµes do filtro
    alterarImgEDescricao("woman");
    $(".conteiner-img img.busto[data-gender= woman]:hidden").toggle();
    $(".conteiner-img img.busto[data-gender= man]:visible").toggle();

    // Adicionar descriÃ§Ã£o
    $(".conteiner-img .descricao-img.busto span").html(
      `Contorne com a fita m&eacute;trica seu busto (regi&atilde;o mam&aacute;ria) e respire normalmente. Perceba as varia&ccedil;&otilde;es enquanto respira e registre o maior n&uacute;mero.`,
    );
  });

  // Masculino
  $("#masculino").click(function () {
    // Opacidade do botÃ£o
    $("#masculino").addClass("show");
    $("#feminino").removeClass("show");

    // Chamar funÃ§Ã£o para alteraÃ§Ãµes das imagens e descriÃ§Ãµes do filtro
    alterarImgEDescricao("man");
    $(".conteiner-img img.busto[data-gender= man]:hidden").toggle();
    $(".conteiner-img img.busto[data-gender= woman]:visible").toggle();

    // Adicionar descriÃ§Ã£o
    $(".conteiner-img .descricao-img.busto span").html(
      `Contorne com a fita m&eacute;trica seu t&oacute;rax e respire normalmente. Perceba as varia&ccedil;&otilde;es enquanto respira e registre o maior n&uacute;mero.`,
    );
  });

  // PrÃ³ximo
  $(".botao-next button").on("click", function () {
    if ($("#feminino").hasClass("show")) {
      novoGenero = "woman";
      valPartesProximo("woman");
    } else if ($("#masculino").hasClass("show")) {
      novoGenero = "man";
      valPartesProximo("man");
    }
    if (medidaEncontrada == true) {
      // MudanÃ§a de tela para resultado
      $("#resultado-provador, #selecao-provador").toggle();
      $(".conteiner-info.resultado").addClass("ativoTabela");
      if ($(".botoes-opcoes .botao-medidas").length > 3) {
        newSwiper("create");
      } else {
        $(`.botao-medidas:nth-child(${valSelecionado + 1})`).addClass(
          "medida-selecionada",
        );
      }
    } else {
      $(`.footer-resultado .botoes-opcoes div.botao-medidas`).remove();
      $("p.text:first-child").html(`N&atilde;o encontramos nenhum tamanho`);
      $(".titulos p.text:last-child").html(
        `N&atilde;o conseguimos encontrar um tamanho para as medidas abaixo. Ajuste se necess&aacute;rio.`,
      );
    }
  });

  novasMedidasRecomendadas = function (
    genero,
    novaMedida,
    valMinBusto,
    valIdealBusto,
    valMaxBusto,
    valMinCintura,
    valIdealCintura,
    valMaxCintura,
    valMinQuadril,
    valIdealQuadril,
    valMaxQuadril,
  ) {
    let naoRecomendado = 0;
    let recomendado = 0;

    // Chamada para pegar valores dos inputs (busto, cintura, quadril)
    tamanhosPartesCorpo();
    // Chamada da tabela de medidas do genero
    tabelaPorGenero(genero);

    $(".melhor-opcao > div span").text(novaMedida.toUpperCase());
    $(".melhor-opcao div div").remove();

    busto = tamanhoParteCorpo[0];
    cintura = tamanhoParteCorpo[1];
    quadril = tamanhoParteCorpo[2];

    $("[data-icon='icon-status'] svg, .melhor-opcao div div").remove();

    naoRecomendado += ajustesPartesCorpo(
      "chest",
      "busto",
      busto,
      valMinBusto,
      valIdealBusto,
      valMaxBusto,
      true,
    ).valNaoRecomendado;
    naoRecomendado += ajustesPartesCorpo(
      "waist",
      "cintura",
      cintura,
      valMinCintura,
      valIdealCintura,
      valMaxCintura,
      true,
    ).valNaoRecomendado;
    naoRecomendado += ajustesPartesCorpo(
      "hip",
      "quadril",
      quadril,
      valMinQuadril,
      valIdealQuadril,
      valMaxQuadril,
      true,
    ).valNaoRecomendado;

    // Verifica a medida de Busto
    let resultadoBusto = verificarMedida(busto, valMinBusto, valMaxBusto);
    // Verifica a medida de Cintura
    let resultadoCintura = verificarMedida(
      cintura,
      valMinCintura,
      valMaxCintura,
    );
    // Verifica a medida de Quadril
    let resultadoQuadril = verificarMedida(
      quadril,
      valMinQuadril,
      valMaxQuadril,
    );

    // Teste para definir PP/P/M/G/GG
    if (
      (resultadoBusto && resultadoCintura) ||
      (resultadoBusto && resultadoQuadril) ||
      (resultadoCintura && resultadoQuadril)
    ) {
      if (novaMedida == melhorMedida) {
        $(`.melhor-opcao > div`).append(`
            <div class="recomendado">
              <svg width="28" height="28" viewBox="0 0 28 28"><defs><linearGradient id="linear-gradient-ideal" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#68E2C1"></stop><stop offset="1" stop-color="#5EBC7B"></stop></linearGradient></defs><g id="ideal" transform="translate(19558 13689)"><g id="Rectangle_438" data-name="Rectangle 438" transform="translate(-19556 -13687)" stroke="#fff" stroke-width="2" fill="url(#linear-gradient-ideal)"><rect width="24" height="24" rx="12" stroke="none"></rect><rect x="-1" y="-1" width="26" height="26" rx="13" fill="none"></rect></g><g id="Group_83" data-name="Group 83" transform="translate(3.5 -82.071)"><line id="Line_173" data-name="Line 173" y1="8" x2="7" transform="translate(-19549.5 -13596.929)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line><line id="Line_174" data-name="Line 174" x1="3" y1="4" transform="translate(-19552.5 -13592.929)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line></g></g></svg>
            </div>
          `);

        $(".melhor-opcao > span").html(`MELHOR OP&Ccedil;&Atilde;O`);
      } else {
        $(".melhor-opcao > span").html(`TAMB&Eacute;M SERVE`);
      }
    } else if (naoRecomendado >= 2) {
      $(".melhor-opcao > span").html(`N&Atilde;O &Eacute; RECOMENDADO`);

      $(`.melhor-opcao > div`).append(`
        <div class="nao-recomendado">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28"><g transform="translate(19558 13606)"><g id="Rectangle_434" data-name="Rectangle 434" transform="translate(-19556 -13604)" fill="#ed4848" stroke="#fff" stroke-width="2"><rect width="24" height="24" rx="12" stroke="none"></rect><rect x="-1" y="-1" width="26" height="26" rx="13" fill="none"></rect></g><g id="Group_368" data-name="Group 368" transform="translate(-1.035 173)"><g id="Group_96" data-name="Group 96" transform="translate(-19546.967 -13768.5)"><g id="Group_89" data-name="Group 89" transform="translate(0 0)"><line id="Line_173" data-name="Line 173" x2="4.473" y2="4.472" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line><line id="Line_174" data-name="Line 174" x1="4.473" y2="4.472" transform="translate(0 3.528)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line></g></g><g id="Group_97" data-name="Group 97" transform="translate(-19543.439 -13768.5)"><g id="Group_89-2" data-name="Group 89" transform="translate(0)"><line id="Line_173-2" data-name="Line 173" x1="4.473" y2="4.472" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line><line id="Line_174-2" data-name="Line 174" x2="4.473" y2="4.472" transform="translate(0 3.528)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="1.5"></line></g></g></g></g></svg>
        </div>
        `);
    } else {
      $(".melhor-opcao > span").html(`TAMB&Eacute;M SERVE`);
    }
  };

  passarNovasMedidas = function (novaMedida) {
    tamanhosAtivados.forEach(function (objetos, index) {
      if (novaMedida == tamanhosAtivados[index]) {
        novasMedidasRecomendadas(
          novoGenero,
          tamanhosAtivados[index],
          parseInt(tamanhosObjAtivos[index].BustoMin),
          parseInt(tamanhosObjAtivos[index].BustoIdeal),
          parseInt(tamanhosObjAtivos[index].BustoMax),
          parseInt(tamanhosObjAtivos[index].CinturaMin),
          parseInt(tamanhosObjAtivos[index].CinturaIdeal),
          parseInt(tamanhosObjAtivos[index].CinturaMax),
          parseInt(tamanhosObjAtivos[index].QuadrilMin),
          parseInt(tamanhosObjAtivos[index].QuadrilIdeal),
          parseInt(tamanhosObjAtivos[index].QuadrilMax),
        );
      }
    });
  };

  function selecionarNovaMedida(novaMedida) {
    $(".ajuste-forma li div, #hip, #waist, #chest").removeClass();
    passarNovasMedidas(novaMedida);
  }
  // Selecionar em outros tamanhos (click botÃ£o medida)
  $(document).on("click", ".opcoes-medidas div.botao-medidas", function () {
    let novaMedida = $(this).attr("data-medida");
    selecionarNovaMedida(novaMedida);
  });
  // Selecionar em outros tamanhos (click seta slick
  $(document).on(
    "click",
    "#modal-provador .footer-resultado .swiper-button-prev, #modal-provador .footer-resultado .swiper-button-next",
    function () {
      let novaMedida = $(this)
        .closest(".footer-resultado")
        .find(".botao-medidas.swiper-slide-active")
        .attr("data-medida");
      selecionarNovaMedida(novaMedida);
    },
  );
  // Editar Medidas - Voltar para pÃ¡gina de medidas
  $(".melhor-opcao button").click(function () {
    $("#resultado-provador, #selecao-provador").toggle();
    newSwiper("destroy");
    $(
      `[data-icon="icon-status"] svg, .opcoes-medidas div.botao-medidas div, .botoes-opcoes .nao-recomendado, .footer-resultado .botoes-opcoes div.botao-medidas, .melhor-opcao > div .recomendado`,
    ).remove();
    $(
      `#chest, #waist, #hip, .ajuste-forma [data-icon="icon-status"]`,
    ).removeClass();
    $("p.text:first-child").text("Minhas Medidas");
    $(".titulos p.text:last-child").html(
      `Ajuste as medidas conforme necess&aacute;rio.`,
    );
    medidaEncontrada = false;
    recomendadoTotal = [];
  });

  // Permite apenas a entrada de nÃºmeros no campo input
  $(".box-numeroInput #numeroInput").on("input", function () {
    $(this).val(
      $(this)
        .val()
        .replace(/[^0-9]/g, ""),
    );
  });

  $(".tabela table tbody tr > td").on("mouseover", function () {
    var tamSel = $(this).index();

    $(".tabela table thead tr th").removeAttr("style");
    $(`.tabela table thead tr th:nth-child(${tamSel + 1})`).attr(
      "style",
      "background: var(--color_primary); color: #fff",
    );
  });

  $(".tabela table tbody tr > td").on("mouseout", function () {
    $(".tabela table thead tr th").removeAttr("style");
  });
})(jQuery);
