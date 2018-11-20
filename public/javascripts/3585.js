!function (e, t) {
    t.fn.extend({
        simpleSlider: function (e) {
            function i(e, t) {
                var i, n;
                "left" == l.style ? (n = "lr", i = t ? s : o) : "top" == l.style && (n = "bt", i = t ? r : a), t && (e < h ? e = l.items * Math.floor(e / l.items) - 1 : e > h && (e = l.items * Math.ceil(e / l.items), e = Math.min(e, p.length - l.items))), e = Math.max(e, 0), e = Math.min(e, p.length - 1);
                var m, u = p.eq(e);
                tools.getRelPos(u, c), tools.getRelPos(u, d);
                tools.tabActive(p.eq(e)), t ? d.css({
                    transform: function () {
                        var t, o = -i[e];
                        return "lr" == n ? t = "translate3D(" + o + "px, 0px, 0px)" : "bt" == n && (t = "translate3D(0px, " + o + "px, 0px)"), t
                    }
                }) : p[e - 1] && tools.getRelPos(c, p.eq(e - 1))[l.style] < 0 ? (m = tools.getRelPos(p.eq(e - 1), d), d.css({
                    transform: function () {
                        return "translate3D(" + m.left + "px, " + m.top + "px, 0px)"
                    }
                })) : p.eq(e + 1)[0] && tools.getRelPos(c, p.eq(e + 1))[l.style] >= c.outerWidth() && d.css({
                    transform: function () {
                        var t, o = -i[e + 1];
                        return "lr" == n ? t = "translate3D(" + o + "px, 0px, 0px)" : "tb" == n && (t = "translate3D(0px, " + o + "px, 0px)"), t
                    }
                }), h = e, c.trigger("change-simpleSlider", [{item: h}])
            }

            var n = 0, o = [], s = [], a = [], r = [], l = {style: "top", items: 3, dir: !0, margin: 22, speed: 800},
                d = t(this), c = d.parent(),
                p = (parseInt(c.css("padding-left")).toFixed(2), parseInt(c.css("padding-right")).toFixed(2), parseInt(c.css("padding-top")).toFixed(2), parseInt(c.css("padding-bottom")).toFixed(2), d.children()),
                h = 0;
            if (p.eq(0).addClass("active"), p.wrapAll('<div class="simple-slider-outer"><div class="simple-slider-stage"></div></div>'), d = t(this).find(".simple-slider-stage"), c = d.parent(), t.extend(l, e, !0), l.dir && t('\n                <div class="owl-nav">\n                    <div class="owl-prev">\n                        <i class="icon iconfont icon-back"></i>\n                    </div>\n                    <div class="owl-next">\n                        <i class="iconfont icon-more"></i>\n                    </div>\n                </div>').insertAfter(c), l.items = l.items ? l.items : Math.round(c.width() / p.eq(0).width()), c.css({overflow: "hidden"}), d.css({transition: l.speed / 1e3 + "s"}), "left" == l.style) l.margin = l.margin ? l.margin : -parseInt(t(this).css("margin-right")), p.each(function (e, i) {
                t(i).css({
                    width: function () {
                        return n += ((c.width() + l.margin) / l.items).toFixed(3) - l.margin + l.margin, ((c.width() + l.margin) / l.items).toFixed(3) - l.margin
                    }
                }), o.push(Math.max(n - c.width())), s.push(n)
            }), s.unshift(0), d.css({width: n}), p.css({float: "left", "margin-right": l.margin}); else {
                l.margin = l.margin ? l.margin : parseInt(t(this).css("margin-bottom")), p.each(function (e, i) {
                    t(i).css({
                        width: function () {
                            return t(this).outerWidth()
                        }, height: function () {
                            return t(this).outerHeight()
                        }
                    })
                });
                p.eq(0).height();
                p.css({float: "none", "margin-bottom": l.margin}), d.css({height: "auto"}), c.css({
                    height: function () {
                        return (p.eq(0).outerHeight() + l.margin) * l.items - l.margin
                    }
                }), p.each(function (e, t) {
                    r.push((p.eq(0).outerHeight() + l.margin) * Math.min(p.length - l.items, e))
                })
            }
            return p.on("click", function () {
                i(t(this).index())
            }), t(this).find(".owl-prev").click(function (e) {
                i(h - 1, !0)
            }), t(this).find(".owl-next").click(function (e) {
                i(h + 1, !0)
            }), {
                el: c, now: function () {
                    return h
                }, to: function (e) {
                    i(e)
                }, next: function () {
                    this.to(h + 1)
                }, prev: function () {
                    this.to(h - 1)
                }
            }
        }
    })
}(window, jQuery);
var newStyleContent = {
    sliderDirThemb: "\n        #topSlider .content_list .owl-prev:hover #sliderDotThemb,\n        #topSlider .content_list .owl-prev:hover #sliderDirThemb {\n            visibility: visible;\n            opacity: 1\n        }\n        #sliderDirThemb,\n        #sliderDotThemb {\n            width: 100px;\n            height: 50px;\n            position: absolute;\n            border: 3px solid #fff;\n            visibility: hidden;\n            opacity: 0;\n            box-sizing: border-box;\n            transition: visibility 0.36s ease, opacity 0.36s ease;\n        } \n        \n        #sliderDirThemb.dot,\n        #sliderDotThemb.dot {\n            top: auto !important;\n            bottom: 40px;\n            transition: all 0.36s ease;\n            transform: translateX(-50%);\n        }\n        #sliderDirThemb.dir,\n        #sliderDotThemb.dir {\n            bottom: auto !important;\n        }\n        #sliderDirThemb .owl-item .thumb-item,\n        #sliderDotThemb .owl-item .thumb-item {\n            width: 100px;\n            height: 44px;\n            background-position: center center;\n            background-size: cover;\n        }\n        #sliderDirThemb .owl-dots,\n        #sliderDotThemb .owl-dots {\n        }\n        #sliderDirThemb .owl-stage-outer,\n        #sliderDotThemb .owl-stage-outer {\n        }\n        #sliderDirThemb.showStage,\n        #sliderDotThemb.showStage {\n            visibility: visible;\n            opacity: 1\n        }\n    ",
    sliderDotThemb: "\n        #topSlider .content_list .owl-prev:hover #sliderDotThemb,\n        #topSlider .content_list .owl-prev:hover #sliderDirThemb {\n            visibility: visible;\n            opacity: 1\n        }\n        #sliderDirThemb,\n        #sliderDotThemb {\n            width: 100px;\n            height: 50px;\n            position: absolute;\n            border: 3px solid #fff;\n            visibility: hidden;\n            opacity: 0;\n            box-sizing: border-box;\n            transition: visibility 0.36s ease, opacity 0.36s ease;\n        } \n        \n        #sliderDirThemb.dot,\n        #sliderDotThemb.dot {\n            top: auto !important;\n            bottom: 40px;\n            transition: all 0.36s ease;\n            transform: translateX(-50%);\n        }\n        #sliderDirThemb.dir,\n        #sliderDotThemb.dir {\n            bottom: auto !important;\n        }\n        #sliderDirThemb .owl-item .thumb-item,\n        #sliderDotThemb .owl-item .thumb-item {\n            width: 100px;\n            height: 44px;\n            background-position: center center;\n            background-size: cover;\n        }\n        #sliderDirThemb .owl-dots,\n        #sliderDotThemb .owl-dots {\n        }\n        #sliderDirThemb .owl-stage-outer,\n        #sliderDotThemb .owl-stage-outer {\n        }\n        #sliderDirThemb.showStage,\n        #sliderDotThemb.showStage {\n            visibility: visible;\n            opacity: 1\n        }\n    ",
    npostSlider: "\n        #postSlider .tab_button .content_list {\n            width: 240px;\n        }\n    ",
    timeTurnEn: "\n        .date_wrap {\n            opacity: 0 !important;\n        }\n        .date_wrap.showTime {\n\n            opacity: 1 !important;\n        }\n    ",
    parallax: "\n        .module {\n            position: relative;\n            z-index: 1\n        }\n    "
}, tools = {
    getRelPos: function (e, t) {
        var i = $(e).offset(), n = $(t).offset();
        return {left: Math.round(n.left - i.left), top: Math.round(n.top - i.top)}
    }, hideEl: function (e, t) {
        $(window).scroll(function (i) {
            var n = $(window).scrollTop();
            t < n ? $(e).removeClass("outPos").addClass("inPos") : $(e).removeClass("inPos").addClass("outPos")
        })
    }, tabActive: function (e, t) {
        t = t || "active", e.siblings().removeClass(t), e.addClass(t)
    }
}, job = {
    initThings: function () {
        $(".item_block").off(), $("#topSlider .progress").remove()
    }, headerHover: function () {
        function e(e) {
            return $(e).width()
        }

        function t(e) {
            return $(e).position()
        }

        var i, n, o = $("#navWrapper .nav"), s = $("#navWrapper .nav>.navitem", "#header"),
            a = $("#navWrapper .nav>.navitem>.active", "#header").closest(".navitem");
        i = $('<li class="jsMoveEl"><span></span></li>').appendTo("#navWrapper .nav"), n = i.find("span"), o.css("position", "relative"), i.css({
            position: "absolute",
            left: t(a).left,
            bottom: "0",
            width: e(a),
            height: "2px",
            "z-index": -1
        }), n.css({
            position: "absolute",
            left: "0",
            right: 0,
            top: "0",
            margin: "auto",
            width: "100%",
            height: "2px",
            "z-index": -1
        }), s.on("mouseenter", function () {
            var o = this, s = $(this).find(".subnav:not(:animated)");
            s[0] ? (s.slideDown(200), i.stop().animate({
                width: e(o),
                left: t(o).left,
                opacity: 0
            })) : i.stop().animate({width: e(o), left: t(o).left, opacity: 1}), n.stop().animate({
                width: "100%",
                opacity: "1"
            })
        }), s.on("mouseleave", function () {
            var e = $(this).find(".subnav");
            e.length && e.slideUp()
        }), o.on("mouseleave", function () {
            i.stop().animate({width: e(a), left: t(a).left})
        })
    }, parallax: function (e) {
        var t = $(e).offset().top, i = $(e).data("slider-height");
        "0" == i ? $("#indexPage #topSlider").height($(window).height()) : $("#indexPage #topSlider").height(i), $(window).on("scroll", function () {
            $(e).css({position: "fixed", "z-index": -1}), $(e).css("top", function () {
                return t - 1 * $(document).scrollTop() / ($(e).height() / 140).toFixed(2)
            })
        })
    }, parallaxPage: function (e) {
        if (0 !== $el.length) {
            var t = $(e).offset().top;
            $(e).parent().height(function () {
                return $(e).height()
            }), $(e).css({
                width: "100%", height: function () {
                    return $(e).height()
                }
            }), $(window).scroll(function () {

                $(e).css({position: "fixed", "z-index": -1}), $(e).css("top", function () {
                    return t - 1 * $(document).scrollTop() / 2
                })
            })
        }
    }, sliderDotThemb: function () {
        var e, t = [], i = $("#topSlider .content_list .owl-item:not(.cloned) .item_block .item_bg"),
            n = '<div id="sliderDotThemb" class="topSliderThumb owl-carousel owl-theme">';
        this.topSliderApp;
        i.each(function (e, i) {
            n += '<div class="thumb-item" style="background-image:url(' + $(i).data("thumb").replace("_80x80.jpg", ".jpg") + ')"></div>', t.push($(i).data("thumb"))
        }), n += "</div>", e = $(n).appendTo($("#topSlider")).owlCarousel({
            center: !1,
            items: 1,
            loop: !0,
            margin: 10,
            autoWidth: !1,
            nav: !1,
            responsive: !1,
            dots: !1
        }), $("#topSlider .content_list").find(".owl-dot").on({
            mouseenter: function () {
                var t = this, i = tools.getRelPos("#topSlider", t);
                $("#sliderDotThemb").css({
                    left: function () {
                        return i.left + $(t).width() / 2
                    }
                }), $("#sliderDotThemb").removeClass("dir prev-dir next-dir"), setTimeout(function () {
                    $("#sliderDotThemb").addClass("showStage dot")
                }), e.trigger("to.owl.carousel", $(this).index())
            }
        }), $("#topSlider .owl-dots").on({
            mouseleave: function () {
                $("#sliderDotThemb").removeClass("showStage")
            }, mouseenter: function () {
            }
        })
    }, sliderDirThemb: function (e) {
        var t, i = [], n = $("#topSlider .content_list .owl-item:not(.cloned) .item_block .item_bg"),
            o = '<div id="sliderDirThemb" class="topSliderThumb owl-carousel owl-theme">', s = this.topSliderApp;
        n.each(function (e, t) {
            o += '<div class="thumb-item" style="background-image:url(' + $(t).data("thumb").replace("_80x80.jpg", ".jpg") + ')"></div>', i.push($(t).data("thumb"))
        }), o += "</div>", t = $(o).appendTo($("#topSlider")).owlCarousel({
            center: !1,
            items: 1,
            loop: !0,
            margin: 10,
            autoWidth: !1,
            nav: !1,
            responsive: !1,
            dots: !1
        }), $("#topSlider .content_list ").find(".owl-prev").add($("#topSlider .content_list ").find(".owl-next")).on({
            mouseenter: function () {
                var i = this, n = $("#topSlider .content_list .owl-dots .owl-dot.active").index();
                $(i).hasClass("owl-prev") ? n -= 1 : $(i).hasClass("owl-next") && (n += 1), t.trigger("to.owl.carousel", [n]), s.on("changed.owl.carousel", function (e) {
                    var n = e.item.index;
                    $(i).hasClass("owl-prev") || $(i).hasClass("owl-next") && (n -= 1), t.trigger("to.owl.carousel", [n])
                }), $("#sliderDirThemb").removeClass("dot").addClass(function () {
                    return $(i).hasClass(".owl-prev") ? "prev-dir dir showStage" : "next-dir dir showStage"
                }).css({
                    left: function () {
                        return "top" == e ? tools.getRelPos("#topSlider", i).left + ($(i).outerWidth() - $(this).outerWidth()) / 2 : "LR" == e ? $(i).offset().left + $("#sliderDirThemb").outerWidth() + $(i).outerWidth() >= $(window).width() ? tools.getRelPos("#topSlider", i).left - $("#sliderDirThemb").outerWidth() : tools.getRelPos("#topSlider", i).left + $(i).outerWidth() : void 0
                    }, top: function () {
                        return "LR" == e ? tools.getRelPos("#topSlider", i).top + ($(i).outerHeight() - $(this).outerHeight()) / 2 : "top" == e ? tools.getRelPos("#topSlider", i).top - $(this).outerHeight() : void 0
                    }
                }), "top" === e && $("#sliderDirThemb").css({transition: "left 0.36s ease"})
            }, mouseleave: function () {
                $("#sliderDirThemb").removeClass("showStage")
            }
        })
    }, sliderTitle: function () {
        var e, t = $("#topSlider .content_list .owl-item:not(.cloned) .item_block .title"),
            i = '<div id="sliderTitle" class="sliderTitle owl-carousel owl-theme">', n = this.topSliderApp;
        t.each(function (e, t) {
            i += "<p>" + $(t).text() + "</p>"
        }), i += "</div>";
        var o = $(i);
        e = o.appendTo($("#topSlider")).owlCarousel({
            center: !1,
            loop: !0,
            autoWidth: !1,
            nav: !1,
            responsive: !1,
            animateOut: "slideOutDown",
            animateIn: "flipInX",
            items: 1,
            margin: 30,
            stagePadding: 30,
            dots: !1,
            smartSpeed: 450
        }), n.on("changed.owl.carousel", function (t) {
            var i = t.target, n = t.item.index, o = $(i).find(".owl-item:not(.cloned)").toArray(),
                s = $(i).find(".owl-item")[n], a = o.indexOf(s);
            e.trigger("to.owl.carousel", [a])
        })
    }, npostSlider: function () {
        var e = $("#postSlider .tab_content").addClass("owl-carousel owl-theme").owlCarousel({
            center: !1,
            items: 1,
            loop: !1,
            autoWidth: !1,
            responsive: !1,
            nav: !0,
            dots: !1,
            smartSpeed: 800,
            navText: ['<i class="icon iconfont icon-back"></i>', '<i class="iconfont icon-more"></i>']
        }), t = $("#postSlider .tab_button").addClass("owl-carousel owl-theme").owlCarousel({
            center: !1,
            items: 3,
            loop: !1,
            autoWidth: !1,
            responsive: !1,
            nav: !1,
            dots: !1,
            margin: 10
        });
        $("#postSlider .tab_button").find('.item_block[data-tab-index="0"]').addClass("current"), e.on("changed.owl.carousel", function (e) {
            var i = e.item.index, n = $("#postSlider .tab_button").find(".item_block");
            t.trigger("to.owl.carousel", [i]), $("#postSlider .tab_button").find(".item_block").removeClass("current"), n.eq(i).addClass("current")
        }), $("#postSlider .tab_button").find(".owl-item").click(function () {
            var t = $(this).index();
            e.trigger("to.owl.carousel", [t])
        })
    }, postTabHiden: function () {
        var e;
        $("#postSlider")[0] ? (e = $("#postSlider").offset().top + $("#postSlider").height(), tools.hideEl($(".ff_postPage .conTabBtn"), e)) : $(".ff_postPage .conTabBtn").addClass("inPos")
    }, specialModule: function () {
        $(".team_tabs").find(".tab_content .content_list").addClass("owl-carousel owl-theme").owlCarouselPor({
            center: !1,
            items: 2,
            loop: !1,
            nav: !0,
            dots: !1,
            margin: 10,
            navText: ['<i class="icon iconfont icon-back"></i>', '<i class="iconfont icon-more"></i>']
        })
    }, teamTabs: function () {
        var e = $(".ff_indexPage .team_tabs .tab_content .content_list").addClass("owl-carousel owl-theme").owlCarousel({
                center: !1,
                items: 1,
                loop: !1,
                autoWidth: !1,
                responsive: !1,
                nav: !0,
                dots: !1,
                smartSpeed: 800,
                navText: ['<i class="icon iconfont icon-back"></i>', '<i class="iconfont icon-more"></i>']
            }), t = $(".ff_indexPage .team_tabs .tab_button .item_block"),
            i = $(".ff_indexPage .team_tabs .tab_button .content_list").simpleSlider({dir: !0});
        t.click(function () {
            var t = $(this).index();
            e.trigger("to.owl.carousel", [t])
        }), e.on("changed.owl.carousel", function (e) {
            var t = e.item.index;
            i.to(t)
        }), i.el.on("change-simpleSlider", function (e, t) {
        })
    }, teamTabsTwo: function () {
        $(".ff_indexPage .team_tabs .tab_content .content_list").simpleSlider({style: "top"});
        setTimeout(function () {
            $(".ff_indexPage .team_tabs .tab_content .content_list .item_block:gt(3)").removeClass("wow").css({visibility: "visible"})
        })
    }, searchForm: function (e) {
        var t = $("#search-nav .searchOnOff"), i = {
            searchShow: function () {
                var i, n = this, o = $("#headTop").outerWidth(!0);
                t.click(function () {
                    $("#navWrapper .nav").addClass("navShow"), $("#search-nav").addClass("navShow"), $(".bodyMask").addClass("open"), $(".searchGroup input").off().click(function (e) {
                        return e.cancelBubble = !0, !1
                    }), $("body").off().on({
                        "mousewheel.stopScroll": function () {
                            return !1
                        }
                    }), i = setInterval(function () {
                        $("#navWrapper .nav").find(".navitem").eq(0).css("opacity") <= .02 && ($("#navWrapper .nav").addClass("navStop"), "LR" == e.type && $("#search-nav").css({left: o}), $("#search-nav").addClass("navStop").find("input").focus(), $("body").off().on({
                            "click.hideSearch": function () {
                                n.searchHide()
                            }
                        }), clearInterval(i))
                    }, 100)
                })
            }, searchHide: function () {
                $("#navWrapper .nav").addClass("navHide"), $("#search-nav").addClass("navHide"), $(".bodyMask").removeClass("open"), $("body").off("mousewheel.stopScroll"), $("body").off("click.hideSearch"), "LR" == e.type && $("#search-nav").css({left: "auto"}), timer = setInterval(function () {
                    $("#search-nav.navHide").css("opacity") >= .98 && ($("#navWrapper .nav").removeClass("navShow navStop navHide"), $("#search-nav").removeClass("navShow navStop navHide"), clearInterval(timer))
                }, 100)
            }, searchNormal: function () {
                t.click(function () {
                    $("#search-nav").toggleClass("search-open")
                })
            }
        };
        switch (e.style) {
            case"one":
                i.searchShow();
                break;
            case"two":
                i.searchNormal()
        }
    }, timeTurnEn: function (e) {
        var t = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        $(e).addClass("showTime").find(".m").text(function () {
            return t[parseInt($(this).text())]
        })
    }
}, selfTools = {
    bindPage: function (e, t, i) {
        e.name;
        for (var n = 0; n < t.length; n++) {
            var o = e, s = t[n];
            YY.Page[s].prototype.things.push([o, i])
        }
    }, addStyle: function () {
        var e = '<style id="ff_add">';
        for (var t in newStyleContent) newStyleContent.hasOwnProperty(t) && config[t].open && (e += newStyleContent[t]);
        e += "</style>", $(e).insertBefore($("link")[0])
    }
}, pageConfig = {list: ["indexMain", "baseMain", "postMain"]}, config = {
    initThings: {open: !0, page: ["indexMain"], fn: job.initThings},
    headerHover: {open: !1, page: pageConfig.list, fn: job.headerHover},
    parallax: {open: !1, page: ["indexMain"], fn: job.parallax, parameter: ["#topSlider .content_list"]},
    parallaxPage: {open: !1, page: ["baseMain"], fn: job.parallaxPage, parameter: [".npagePage #banner div"]},
    sliderDotThemb: {open: !1, page: ["indexMain"], fn: job.sliderDotThemb},
    sliderDirThemb: {open: !0, page: ["indexMain"], fn: job.sliderDirThemb, parameter: ["top"]},
    sliderTitle: {open: !0, page: ["indexMain"], fn: job.sliderTitle},
    npostSlider: {open: !0, page: ["postMain"], fn: job.npostSlider},
    postTabHiden: {open: !1, page: ["postMain"], fn: job.postTabHiden},
    specialModule: {open: !1, page: ["indexMain"], fn: job.specialModule},
    teamTabs: {open: !1, page: ["indexMain"], fn: job.teamTabs},
    teamTabsTwo: {open: !0, page: ["indexMain"], fn: job.teamTabsTwo},
    searchForm: {open: !0, page: pageConfig.list, fn: job.searchForm, parameter: [{style: "two", type: "LR"}]},
    timeTurnEn: {open: !1, page: pageConfig.list, fn: job.timeTurnEn, parameter: [".service .item_block .date_wrap"]}
};
selfTools.addStyle(), function () {
    for (var e = 0; e < pageConfig.list.length; e++) {
        var t = pageConfig.list[e];
        YY.Page[t].prototype.things = [], YY.Page[t].prototype.interfaceFun = function () {
            for (var e = this, t = 0; t < this.things.length; t++) {
                var i = this.things[t][0], n = this.things[t][1];
                i.apply(e, n)
            }
        }
    }
    for (var i in this.config) if (this.config.hasOwnProperty(i)) {
        var n = this.config[i];
        n.open && selfTools.bindPage(n.fn, n.page, n.parameter)
    }
}();