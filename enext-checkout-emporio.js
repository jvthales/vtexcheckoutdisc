/* jquery cookie */

/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function(key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function(key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key);
    };

}));

/*mask*/

! function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function(a) {
    var b, c = navigator.userAgent,
        d = /iphone/i.test(c),
        e = /chrome/i.test(c),
        f = /android/i.test(c);
    a.mask = {
        definitions: {
            9: "[0-9]",
            a: "[A-Za-z]",
            "*": "[A-Za-z0-9]"
        },
        autoclear: !0,
        dataName: "rawMaskFn",
        placeholder: "_"
    }, a.fn.extend({
        caret: function(a, b) {
            var c;
            if (0 !== this.length && !this.is(":hidden")) return "number" == typeof a ? (b = "number" == typeof b ? b : a, this.each(function() {
                this.setSelectionRange ? this.setSelectionRange(a, b) : this.createTextRange && (c = this.createTextRange(), c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select())
            })) : (this[0].setSelectionRange ? (a = this[0].selectionStart, b = this[0].selectionEnd) : document.selection && document.selection.createRange && (c = document.selection.createRange(), a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length), {
                begin: a,
                end: b
            })
        },
        unmask: function() {
            return this.trigger("unmask")
        },
        mask: function(c, g) {
            var h, i, j, k, l, m, n, o;
            if (!c && this.length > 0) {
                h = a(this[0]);
                var p = h.data(a.mask.dataName);
                return p ? p() : void 0
            }
            return g = a.extend({
                autoclear: a.mask.autoclear,
                placeholder: a.mask.placeholder,
                completed: null
            }, g), i = a.mask.definitions, j = [], k = n = c.length, l = null, a.each(c.split(""), function(a, b) {
                "?" == b ? (n--, k = a) : i[b] ? (j.push(new RegExp(i[b])), null === l && (l = j.length - 1), k > a && (m = j.length - 1)) : j.push(null)
            }), this.trigger("unmask").each(function() {
                function h() {
                    if (g.completed) {
                        for (var a = l; m >= a; a++)
                            if (j[a] && C[a] === p(a)) return;
                        g.completed.call(B)
                    }
                }

                function p(a) {
                    return g.placeholder.charAt(a < g.placeholder.length ? a : 0)
                }

                function q(a) {
                    for (; ++a < n && !j[a];);
                    return a
                }

                function r(a) {
                    for (; --a >= 0 && !j[a];);
                    return a
                }

                function s(a, b) {
                    var c, d;
                    if (!(0 > a)) {
                        for (c = a, d = q(b); n > c; c++)
                            if (j[c]) {
                                if (!(n > d && j[c].test(C[d]))) break;
                                C[c] = C[d], C[d] = p(d), d = q(d)
                            }
                        z(), B.caret(Math.max(l, a))
                    }
                }

                function t(a) {
                    var b, c, d, e;
                    for (b = a, c = p(a); n > b; b++)
                        if (j[b]) {
                            if (d = q(b), e = C[b], C[b] = c, !(n > d && j[d].test(e))) break;
                            c = e
                        }
                }

                function u() {
                    var a = B.val(),
                        b = B.caret();
                    if (o && o.length && o.length > a.length) {
                        for (A(!0); b.begin > 0 && !j[b.begin - 1];) b.begin--;
                        if (0 === b.begin)
                            for (; b.begin < l && !j[b.begin];) b.begin++;
                        B.caret(b.begin, b.begin)
                    } else {
                        for (A(!0); b.begin < n && !j[b.begin];) b.begin++;
                        B.caret(b.begin, b.begin)
                    }
                    h()
                }

                function v() {
                    A(), B.val() != E && B.change()
                }

                function w(a) {
                    if (!B.prop("readonly")) {
                        var b, c, e, f = a.which || a.keyCode;
                        o = B.val(), 8 === f || 46 === f || d && 127 === f ? (b = B.caret(), c = b.begin, e = b.end, e - c === 0 && (c = 46 !== f ? r(c) : e = q(c - 1), e = 46 === f ? q(e) : e), y(c, e), s(c, e - 1), a.preventDefault()) : 13 === f ? v.call(this, a) : 27 === f && (B.val(E), B.caret(0, A()), a.preventDefault())
                    }
                }

                function x(b) {
                    if (!B.prop("readonly")) {
                        var c, d, e, g = b.which || b.keyCode,
                            i = B.caret();
                        if (!(b.ctrlKey || b.altKey || b.metaKey || 32 > g) && g && 13 !== g) {
                            if (i.end - i.begin !== 0 && (y(i.begin, i.end), s(i.begin, i.end - 1)), c = q(i.begin - 1), n > c && (d = String.fromCharCode(g), j[c].test(d))) {
                                if (t(c), C[c] = d, z(), e = q(c), f) {
                                    var k = function() {
                                        a.proxy(a.fn.caret, B, e)()
                                    };
                                    setTimeout(k, 0)
                                } else B.caret(e);
                                i.begin <= m && h()
                            }
                            b.preventDefault()
                        }
                    }
                }

                function y(a, b) {
                    var c;
                    for (c = a; b > c && n > c; c++) j[c] && (C[c] = p(c))
                }

                function z() {
                    B.val(C.join(""))
                }

                function A(a) {
                    var b, c, d, e = B.val(),
                        f = -1;
                    for (b = 0, d = 0; n > b; b++)
                        if (j[b]) {
                            for (C[b] = p(b); d++ < e.length;)
                                if (c = e.charAt(d - 1), j[b].test(c)) {
                                    C[b] = c, f = b;
                                    break
                                }
                            if (d > e.length) {
                                y(b + 1, n);
                                break
                            }
                        } else C[b] === e.charAt(d) && d++, k > b && (f = b);
                    return a ? z() : k > f + 1 ? g.autoclear || C.join("") === D ? (B.val() && B.val(""), y(0, n)) : z() : (z(), B.val(B.val().substring(0, f + 1))), k ? b : l
                }
                var B = a(this),
                    C = a.map(c.split(""), function(a, b) {
                        return "?" != a ? i[a] ? p(b) : a : void 0
                    }),
                    D = C.join(""),
                    E = B.val();
                B.data(a.mask.dataName, function() {
                    return a.map(C, function(a, b) {
                        return j[b] && a != p(b) ? a : null
                    }).join("")
                }), B.one("unmask", function() {
                    B.off(".mask").removeData(a.mask.dataName)
                }).on("focus.mask", function() {
                    if (!B.prop("readonly")) {
                        clearTimeout(b);
                        var a;
                        E = B.val(), a = A(), b = setTimeout(function() {
                            B.get(0) === document.activeElement && (z(), a == c.replace("?", "").length ? B.caret(0, a) : B.caret(a))
                        }, 10)
                    }
                }).on("blur.mask", v).on("keydown.mask", w).on("keypress.mask", x).on("input.mask paste.mask", function() {
                    B.prop("readonly") || setTimeout(function() {
                        var a = A(!0);
                        B.caret(a), h()
                    }, 0)
                }), e && f && B.off("input.mask").on("input.mask", u), A()
            })
        }
    })
});

/*end mask*/

createNascField = function() {

    $('.box-client-info-pf').append('<div class="x-datenasc input" id="box-age-add" style="float: left; width: 100%;"><label>Data de Nascimento</label><input id="x-age" type="tel" /></div>');

    $("#x-age").mask("99/99/9999", {
        placeholder: "dd/mm/yyyy"
    });

    //$('#go-to-shipping').attr('style','background:#A2A1A0 !important;');
    //$('#go-to-shipping').attr('blockclick','true');

    $('#x-age').on('blur', validateAgeCampo);
    $('#x-age').on('keyup', function() {
        if (jQuery.isNumeric(($('#x-age').val().split('/')[2]))) {
            validateAgeCampo();
        }
    });
};

var sAge;

validateAge = function() {
    var tdate = new Date();
    var dd = tdate.getDate(); //yields day
    if (dd < 10) {
        dd = "0" + String(dd)
    };
    var MM = tdate.getMonth() + 1; //yields month
    if (MM < 10) {
        MM = "0" + String(MM)
    };
    var yyyy = tdate.getFullYear(); //yields year
    var date = parseInt(String(yyyy) + String((MM)) + String(dd));

    var getAge = $('#x-age').val();
    var aAge = getAge.split('/');

    var age = parseInt(String(aAge[2]) + String(aAge[1]) + String(aAge[0]));

    if (date - age >= 180000) {
        sAge = String(aAge[2]) + '-' + String(aAge[1]) + '-' + String(aAge[0]) + 'T00:00:00';
        return true;
    } else {
        return false;
    }
}

validateAgeCampo = function() {

    if (validateAge()) {

        $('.x-alert-menor').hide();
        $('#x-age').removeClass('error');
        $('#x-age').addClass('success');
        //$('#go-to-shipping').attr('style','background:#FF6014 !important;');
        //$('#go-to-shipping').attr('blockclick','false');

    } else {

        //$('#go-to-shipping').attr('style','background:#A2A1A0 !important;');
        //$('#go-to-shipping').attr('blockclick','true');

        $('#x-age').addClass('error');
        $('#x-age').removeClass('success');

        if (($('.x-alert-menor').length < 1)) {
            $('.x-datenasc').append('<span class="help error x-alert-menor">Você precisa ser maior de idade</span>');
        } else {
            $('.x-alert-menor').show();
        }

    }

};

console.log('live A');

clickSubmit = function() {

    $('#client-profile-data .submit.btn-submit-wrapper').click(function() {

        if (validateAge()) {

            if ($(".help.error:visible:contains(' ')").length == 0) {

                var email = $('#client-email').val();
                if (email == undefined) {
                    email = $('p.client-email.text.required').find('span').text();
                }

                var doc = String($('#client-document').val()).replace(/\./g, '').replace(/\-/g, '');
                var fName = $('#client-first-name').val();
                var lName = $('#client-last-name').val();
                var hPhone = '+55' + $('#client-phone').val();
                var cDoc = String($('#client-company-document').val()).replace(/\./g, '').replace(/\//g, '');

                if (cDoc.length == 0) {
                    cDoc = null;
                }

                

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    //"url": "https://zcon4pbga2.execute-api.us-west-2.amazonaws.com/prod/customer/create-update",
                    "url": "https://api.emporio.com/emporio-customer/" + email + "/create-update",
                    "type": "PUT",
                    "processData": false,
                    "data": JSON.stringify({
						"email": email,
                        "birthDate": sAge,
                        "document": doc,
                        "firstName": fName,
                        "lastName": lName,
                        "homePhone": hPhone,
                        "corporateDocument": cDoc
                    })
                }

                console.log('Dados',email,sAge,doc,fName,lName,hPhone,cDoc);

                $.ajax(settings).done(function(response) {
					console.log(response);
                });

            }
        } else {
            $('#x-age').focus();
            $('#x-age').addClass('error');
            $('#x-age').removeClass('success');

            if (($('.x-alert-menor').length < 1)) {
                $('.x-datenasc').append('<span class="help error x-alert-menor">Você precisa ser maior de idade</span>');
            } else {
                $('.x-alert-menor').show();
            }
        }

    });

}

desabilitaAge = function() {

    $('#edit-profile-data').click(function() {

        $('#x-age').off('blur');

        $('.submit.btn-submit-wrapper').off('click');

        $('#box-age-add').remove();

        $('#go-to-shipping').attr('style', '');
        $('#go-to-shipping').attr('blockclick', 'false');

        setTimeout(function() {
            if ($('.btn-submit-wrapper #go-to-shipping').is(':visible') && $('.btn-submit-wrapper #go-to-payment').is(':visible')) {
                $('.btn-submit-wrapper #go-to-shipping').hide();
            }
        }, 100)

    })

}

scrollLogin = function() {
    $(document).on('click', '.link-box-edit.btn.btn-small, .link.edit.address-edit, .link.create.address-create', function() {
        window.scrollTo(0, 0);
    })
}

hideUnderPrint = function() {

    $('.payment-transaction-details-btn.muted').hide();
}

hideValeReload = function() {

    if (!$('.payment-card-number.input.text.required.clearLeft').is(':visible')) {
        setTimeout(hideValeReload, 500);
    } else {
        if ($('.payment-discounts-list').is(':visible')) {
            $('.gift-card-section').addClass('acao-b');
            $('.gift-card-provider-default').css({
                'overflow': 'hidden',
                'height': '0px'
            });
        }
    }

}

limitaVale = function() {

    $(document).on('click', '#show-gift-card-group', function() {

        $('.vtex-front-messages-close-all.close').click();

        verificaValeValido();

    })

}

verificaValeValido = function() {
    if ($('.vtex-front-messages-detail').is(':visible')) {} else if ($('.payment-discounts-list').is(':visible')) {
        $('.gift-card-section').addClass('acao-b');
        $('.gift-card-provider-default').css({
            'overflow': 'hidden',
            'height': '0px'
        });
    } else {
        setTimeout(verificaValeValido, 100);
    }

}

var lil = {
	717: 20,
    721: 20,
    728: 20,
    737: 20,
    738: 20,
    749: 20,
    643: 20,
    744: 20,
    745: 20,
    748: 20,
    746: 20,
    747: 20,
    738: 20,
    737: 20,
    720: 20,
    750: 20,
    751: 20,
    752: 20,
    823: 3,
    700: 1,
    763: 5,
    819: 5,
    865: 5,
    866: 5,
    1087: 15,
	568: 20,
	69		: 120 ,
	84      : 120 ,
	577     : 20  ,
	575     : 20  ,
	576     : 20  ,
	573     : 20  ,
	578     : 20  ,
	66      : 120 ,
	1533    : 7   ,
	120     : 20  ,
	684     : 120 ,
	793     : 10  ,
	588     : 15  ,
	1501    : 40  ,
	1087    : 5   ,
	1555    : 20  ,
	1559    : 20  ,
	568     : 20  ,
	613     : 5   ,
	614     : 20  ,
	122     : 20  ,
	58      : 120 ,
	80      : 120 ,
	100     : 120 ,
	665     : 10  ,
	663     : 20  ,
	35      : 120 ,
	601     : 10  ,
	569     : 20  ,
	596     : 150  ,
	1534    : 20  ,
	1553    : 20  ,
	1552    : 20  ,
	916     : 120 ,
	105     : 120 ,
	617     : 30  ,
	648     : 120 ,
	794     : 10  ,
	581     : 20  ,
	605     : 10  ,
	584     : 20  ,
	758     : 15  ,
	1532    : 5   ,
	740     : 5   ,
	905     : 15  ,
	899     : 20  ,
	896     : 15  ,
	582     : 20  ,
	571     : 15  ,
	570     : 20  ,
	583     : 20  ,
	121     : 20  ,
	1209    : 120 ,
	664     : 10  ,
	55      : 120 ,
	901     : 15,
    1702: 5
};


fVerArrow = function(obj, lim) {

    if (obj.val() > lim) {
        obj.closest('.quantity').find('.icon-minus-sign').click();
    }

}

cArrow = function() {

    $(document).on('click', '.icon-plus-sign', function() {
        var s = parseInt($(this).closest('.product-item').attr('data-sku'));
        var d = $(this).closest('.quantity').find('input');
        if (lil[s] != undefined && d.val() > lil[s]) {
            d.val(lil[s]);
            $(this).closest('.quantity').find('.icon-minus-sign').click();
            setTimeout(function() {
                fVerArrow(d, lil[s]);
            }, 2000)
        }
    });

    $(document).on('keyup', '.quantity input', function() {

        var sB = parseInt($(this).closest('.product-item').attr('data-sku'));
        var dB = $(this);

        if (lil[sB] != undefined && dB.val() > lil[sB]) {
            for (var i = dB.val() - lil[sB]; i > 0; i--) {
                $(this).closest('.quantity').find('.icon-minus-sign').click();
            }
            $(this).val(lil[sB]);

        }

    });

}

var diaSeg = false;

alertBol = function() {

    $(document).on('click', '.shipping-option-item', function() {

        if ($(this).find('input').val() == 'Dia Seguinte') {
            diaSeg = true;
        } else {
            diaSeg = false;
        }

    });

    $(document).on('click', 'btn-go-to-payment-wrapper > .btn-go-to-payment', function() {

        if (diaSeg) {
            adicionaTextoFrete();
        }

    });

    $(document).on('click', '#payment-group-bankInvoicePaymentGroup', function() {

        if (diaSeg) {
            adicionaTextoFrete();
        }

    });

}

adicionaTextoFrete = function() {

    $('#info-frete-next').remove();

    $('.bankInvoicePaymentGroup').append('<span id="info-frete-next" style="color: #f00;"> <br />  Boleto Bancário tem prazo de aprovação de até 48h após o pagamento do mesmo. Favor considerar esse período no seu prazo de entrega, que só é  contabilizado após a confirmação do seu pagamento. <br />' +
        '<br />' +
        'Grato <br />' +
        'Equipe Empório da Cerveja');

}

var checaCEP = false;

fValidaCEP = function() {

    $(document).on('keyup', '.address-data #ship-postal-code', function() {

        //fContaValidaCep();

    })

    $(document).on('blur', '#ship-street', function() {

        fContaValidaCep();
        fContaCepExiste();

    })

}

fContaValidaCep = function() {

    checaCEP = true;

    if ($('.address-data #ship-postal-code').val() != undefined && $('.address-data #ship-postal-code').val() != '') {

        var numCode = Number($('.address-data #ship-postal-code').val().substr($('.address-data #ship-postal-code').val().length - 3, 3));

        if (970 <= numCode && numCode <= 999) {

            $('.address-data #ship-postal-code').val('');

            var texto = '<span class="postal-code-errors" id="cep-especial"><span class="help error error-list filled" id="parsley-id-4044"><span class="error-description parsley-required">Não entregamos em CEPs especiais.</span></span></span>';
            $('.address-data #ship-postal-code').after(texto);

        } else {
            $('#cep-especial').remove();
        }

    } else {
        $('#cep-especial').remove();
        $('#cep-inexistente').remove();
    }

}

fContaCepExiste = function() {

    if ($('.address-data #ship-postal-code').val() != undefined && $('.address-data #ship-postal-code').val() != '') {

        if ($('#ship-state').attr('disabled') != 'disabled') {

            $('#cep-inexistente').remove();
            var texto = '<span class="postal-code-errors" id="cep-inexistente"><span class="help error error-list filled" id="parsley-id-4044"><span class="error-description parsley-required">Digite um CEP válido.</span></span></span>';
            $('.address-data #ship-postal-code').after(texto);
            $('.address-data #ship-postal-code').val('');

        } else {
            $('#cep-inexistente').remove();
        }
    }
}

fCarregaTextB = function() {


    var contB = '<div class="bar-frete">' +
        '	<div class="b-center">' +
        '		<img src="/arquivos/frete-canecas.png" alt="" /><div class="text"> FRETE GRATIS OU COM DESCONTO - Acima de R$ 139,90. <a href="http://www.emporiodacerveja.com.br/institucional/perguntas-frequentes?p=frete" target="_blank">Veja as Regiões</a>. </div>' +
        '	</div>' +
        '</div>'

    $('.x-header').after(contB);

}

var gData;

getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

fCarregaTextA = function() {

    setTimeout(function() {

        if ($('.cart-template.full-cart.span12.active').length != 0) {

            var cont;

            if ($(window).width() > 767) {
				/* HTML-FRETE-CK */
                cont = '<div class="f-box-table t-full"><div id="box-info-frete"><div class="f-box-table t-full"><h2>Política de Frete</h2></div><div class="f-box-table t-full m-t"><div class="box-foto"></div><div class="l-cont"><div class="box-cont-f box-reg"><strong>Região</strong></div><div class="box-cont-f box-compras-a"><strong>Compras a partir de R$ 49,90</strong></div><div class="box-cont-f box-compras-b"><strong>Compras a partir de R$ 99,90*</strong></div></div></div><div class="hr"></div><div class="f-box-table t-full m-t"><div class="box-foto"><img src="/arquivos/ck-ico-fconvencional.png?v=2" alt="" /></div><div class="l-cont"><div class="box-cont-f box-reg"><div class="m-txt">Capitais das regiões SUL e SUDESTE, e a cidades de Goiânia/GO e Brasilia/DF</div></div><div class="box-cont-f box-compras-a"><div class="m-txt"><strong>Frete Promocionado</strong></div></div><div class="box-cont-f box-compras-b"><div class="m-txt"><strong>Apenas R$ 9,90</strong><br /><small>Limite de até R$ 1000 por pedido</small></div></div></div><div class="l-cont"><div class="box-cont-f box-reg"><div class="m-txt">Demais cidades das regiões SUL e SUDESTE</div></div><div class="box-cont-f box-compras-a"><div class="m-txt"><strong>Frete Promocionado</strong></div></div><div class="box-cont-f box-compras-b"><div class="m-txt"><strong>Apenas R$ 19,90</strong><br /><small>Limite de até R$ 1000 por pedido</small></div></div></div><div class="l-cont"><div class="hr"></div></div><div class="l-cont"><div class="box-cont-f box-reg"><div class="m-txt">Regiões NO, NE e CO <br />(Exceto Goiânia e Brasilia)</div></div><div class="box-cont-f box-compras-a"><div class="m-txt"><strong>Frete Promocionado</strong></div></div><div class="box-cont-f box-compras-b"><div class="m-txt"><strong>Frete Promocionado</strong></div></div></div></div><div class="hr"></div><div class="f-box-table t-full m-t"><div class="box-foto"><img src="/arquivos/ck-ico-fexpresso.png" alt="" /></div><div class="l-cont"><div class="box-cont-f cont-f-full"><strong>Reduz o prazo de entrega em até 40%</strong></div></div></div><div class="hr"></div><div class="f-box-table t-full m-t"><div class="box-foto"><img src="/arquivos/ck-ico-fdiaseguinte.png" alt="" /></div><div class="l-cont"><div class="box-cont-f cont-f-full"><strong>Entrega no dia seguinte nas cidades de São Paulo, Guarulhos, São Caetano, Santo André, São Bernardo, Mauá, Diadema, Embu das Artes, Taboão da Serra, Carapicuíba, Osasco, Barueri e Santana de Parnaíba</strong></div></div></div><div class="hr"></div><div class="f-box-table t-full m-t"><div class="l-cont"><div class="box-cont-f cont-f-full t-right"><small>* Conferir regras de utilização na página Política de Frete</small></div></div></div></div></div>';

            } else {
                cont = '<div class="f-box-table t-full"><div id="box-info-frete"><div class="f-box-table t-full"><h2>Política de Frete</h2></div><div class="hr"></div><div class="f-box-table t-full m-t"><div class="box-foto"><img src="/arquivos/ck-ico-fconvencional.png?v=2" alt="" /></div><div class="l-cont"><div class="box-cont-f cont-f-full"><strong>Compras a partir de R$ 49,90</strong></div></div><div class="l-cont"><div class="box-cont-f box-reg"><div class="m-txt">Capitais das regiões SUL e SUDESTE, e a cidades de Goiânia/GO e Brasilia/DF</div></div><div class="box-cont-f box-compras-a"><div class="m-txt"><strong>Frete Promocionado</strong></div></div></div><div class="l-cont"><div class="box-cont-f box-reg"><div class="m-txt">Demais cidades das regiões SUL e SUDESTE</div></div><div class="box-cont-f box-compras-a"><div class="m-txt"><strong>Frete Promocionado</strong></div></div></div><div class="l-cont"><div class="hr"></div></div><div class="l-cont"><div class="box-cont-f cont-f-full"><strong>Compras a partir de R$ 99,90</strong></div></div><div class="l-cont"><div class="box-cont-f box-reg"><div class="m-txt">Capitais das regiões SUL e SUDESTE, e a cidades Goiânia/GO e Brasilia/DF</div></div><div class="box-cont-f box-compras-b"><div class="m-txt"><strong>Apenas R$ 9,90</strong><br /><small>Limite de até R$ 1000 por pedido</small></div></div></div><div class="l-cont"><div class="box-cont-f box-reg"><div class="m-txt">Demais cidades das regiões SUL e SUDESTE</div></div><div class="box-cont-f box-compras-a"><div class="m-txt"><strong>Apenas R$ 19,90</strong><br /><small>Limite de até R$ 1000 por pedido</small></div></div></div><div class="l-cont"><div class="hr"></div></div><div class="l-cont"><div class="box-cont-f box-reg"><div class="m-txt">Regiões NO, NE e CO <br />(Exceto Goiânia e Brasilia)</div></div><div class="box-cont-f box-compras-a"><div class="m-txt"><strong>Frete Promocionado</strong></div></div></div></div><div class="hr"></div><div class="f-box-table t-full m-t"><div class="box-foto"><img src="/arquivos/ck-ico-fexpresso.png" alt="" /></div><div class="l-cont"><div class="box-cont-f cont-f-full"><strong>Reduz o prazo de entrega em até 40%</strong></div></div></div><div class="hr"></div><div class="f-box-table t-full m-t"><div class="box-foto"><img src="/arquivos/ck-ico-fdiaseguinte.png" alt="" /></div><div class="l-cont"><div class="box-cont-f cont-f-full"><strong>Entrega no dia seguinte nas cidades de São Paulo, Guarulhos, São Caetano, Santo André, São Bernardo, Mauá, Diadema, Embu das Artes, Taboão da Serra, Carapicuíba, Osasco, Barueri e Santana de Parnaíba</strong></div></div></div><div class="hr"></div><div class="f-box-table t-full m-t"><div class="l-cont"><div class="box-cont-f cont-f-full t-right"><small>* Conferir regras de utilização na página Política de Frete</small></div></div></div></div></div>';
            }


            $('.cart-template.full-cart.span12.active').append(cont);

            $('.dropdown-menu.shipping-sla-options li').each(function() {

                $(this).click(function() {
                    fCarregaTextAgain();
                });

            })

            //fIconFreteCheck();

            if ($('.accordion-group .accordion-inner .table .Shipping .info .postal-code-for-sla:first').length > 0) {
                if ($('.accordion-group .accordion-inner .table .Shipping .info .postal-code-for-sla:first').text().trim().split(' ')[0] == 'Entrega') {
                    $('.accordion-group .accordion-inner .table .Shipping .info .postal-code-for-sla:first').prepend('Prazo de ');
                }
            } else {
                $('.info span:contains("Entrega")').text('Prazo de entrega');
            }

            //$('#shipping-calculate-link').text('Insira seu CEP')

        } else {
            fCarregaTextA();
        }

    }, 300)
}

fCarregaTextAgain = function() {

    if ($('.accordion-group .accordion-inner .table .Shipping .info .postal-code-for-sla:first').text().trim().split(' ')[0] == 'Entrega') {

        $('.dropdown-menu.shipping-sla-options li').each(function() {

            $(this).click(function() {
                fCarregaTextAgain();
            });

        })


        $('.accordion-group .accordion-inner .table .Shipping .info .postal-code-for-sla').each(function() {
            if ($(this).text().trim().split(' ')[0] == 'Entrega') {
                $(this).prepend('Prazo de ');
            }
        })

    } else {

        setTimeout(function() {

            fCarregaTextAgain();

        }, 300)

    }

}

fIconFreteCheck = function() {

    $('.dropdown-menu.shipping-sla-options li span').each(function() {
        var txtNow = $(this).text().trim().split(' ')[0];

        if (txtNow == 'Convencional') {
            $(this).append('<img src="/arquivos/frete-convencional-short.png" class="ico-frete" alt="" />');
        } else if (txtNow == 'Expressa') {
            $(this).append('<img src="/arquivos/frete-expresso-short.png" class="ico-frete" alt="" />');
        } else if (txtNow == 'Dia') {
            $(this).append('<img src="/arquivos/frete-diaseguinte-short.png" class="ico-frete" alt="" />');
        }

    })

}

//altera texto da info de frete (logado)

reWorkShipButton = function() {
    $(document).on('click', '#cart-shipping-calculate', function() {
        alteraFreteText();
    })
}

alteraFreteText = function() {
    if (!$('#cart-shipping-calculate').is(':visible')) {
        fCarregaTextAgain();
        $('.accordion-group .accordion-inner .table .Shipping .info .postal-code-for-sla').each(function() {
            if ($(this).text().trim().split(' ')[0] == 'Entrega') {
                $(this).prepend('Prazo de ');
            }
        })
    } else {
        setTimeout(alteraFreteText, 300);
    }

}


// End of Google Analytics Content Experiment code

getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

comunicadoFrete = function() {

    fCarregaTextA();

}

// Limiter

var BASE_URL = "https://6xfitbxkm5.execute-api.us-west-2.amazonaws.com/dev/";

var updateCart = function() {
    vtexjs.checkout.getOrderForm().then(function(orderForm) {
        return vtexjs.checkout.updateItems([orderForm.items]);
    });
};

var removeCustomerFromClusters = function(userId) {
    vtexjs.checkout.getOrderForm().then(function(orderForm) {
        var value = orderForm.value;
        $.ajax({
            url: BASE_URL + "customer/" + userId + "/removeCustomerFromCluster",
            method: "PUT",
            data: JSON.stringify({
                "orderValue": value
            }),
            success: function(response) {
                if (response.userRemovedFromCluster) {
                    updateCart();
                }
            }
        });
    });
};

var addCustomerToClusters = function(userId) {
    $.ajax({
        url: BASE_URL + "customer/" + userId + "/addCustomerToClusters",
        method: "PUT"
    });
};

var getCreditsUser = function(userId) {
    $.ajax({
        url: BASE_URL + "customer/" + userId + "/credits",
        method: "GET",
        success: function(response) {
            updateCredits(response.value);
        }
    });
};

var updateCredits = function(value) {

};

$(document).ajaxComplete(function() {

    if (checaCEP) {

        setTimeout(function() {

            fContaValidaCep();
            fContaCepExiste();

        }, 1000)

    }

});

fBuscaCep = function() {

    $(document).on('click', '#cart-dont-know-postal-code', function() {
        window.open('http://www.buscacep.correios.com.br/sistemas/buscacep/');
    })

}

fPrepareCep = function() {

    $('.accordion-inner tr.Shipping td.monetary').remove();
    $('.accordion-inner tr.Shipping td.space').remove();
    $('.accordion-inner tr.Shipping td.info').attr('colspan', '3');
    $('.accordion-inner td.empty').remove()

}

/* funct var clica prosseguir de shipping */

var fFrete = false;

cFrete = function() {

    $(document).on('click', '#cart-to-orderform', function() {
        fFrete = false;
    })

    $(document).on('click', '#edit-profile-data', function() {
        funcReleaseBox()
    });

}

funcReleaseBox = function() {
    fFrete = true;
}


/* cc events */

function redirectShipping() {

    $('.submit.btn.btn-large.btn-success.btn-go-to-payment').attr('onclick', 'funcReleaseBox()');

    if (!fFrete) {

        $(".row-fluid.orderform-template.span12.active")
            .each(function() {
                $("div.retirar")
                    .hide(), $(".box-info .shipping-options.just-one p span.sla").each(function() {
                        var Retirar = RegExp("(Dia Seguinte|Convencional|Expressa)"),
                            und = RegExp("undefined ");
                        console.log($(this).text());
                        undTxt = und.test($(this).text()), txt = Retirar.test($(this).text()), txt && (location.href = window.location.pathname + "#/shipping"), $("html, body").animate({
                            scrollTop: $(document).height()
                        }, 1000), setTimeout(function() {
                            /*if ($('#seller-1-sla-DiaSeguinte').length > 0) {
                                $('#seller-1-sla-DiaSeguinte').click();
                            } else {
                                $('#seller-1-sla-Expressa').click();
                            }*/
                        }, 1500), undTxt && (location.href = window.location.pathname + "#/shipping")

                    })
            })

    }
}

function newTexto() {

    /* belt mobile */
    //if($('#client-profile-data .form-step.box-edit').is(':visible')){
    /*
	if ($('#client-profile-data #go-to-shipping').is(':visible') && document.location.hash != '#/email') {
        $('#client-profile-data #go-to-shipping').addClass('sticky-b');
    } else {
        $('#client-profile-data #go-to-shipping').removeClass('sticky-b');
    }

    if ($('#client-profile-data #go-to-payment').is(':visible') && document.location.hash != '#/email') {
        $('#client-profile-data #go-to-payment').addClass('sticky-b');
    } else {
        $('#client-profile-data #go-to-payment').removeClass('sticky-b');
    }

    if ($('.btn-go-to-payment').is(':visible') && document.location.hash != '#/email') {
        $('.btn-go-to-payment').addClass('sticky-b');
    } else {
        $('.btn-go-to-payment').removeClass('sticky-b');
    }

    if ($('#payment-data-submit').is(':visible') && document.location.hash != '#/email') {
        $('#payment-data-submit').addClass('sticky-b');
    } else {
        $('#payment-data-submit').removeClass('sticky-b');
    }
	*/

    /* fim belt */

    $('.accordion-inner td.empty').remove();
    $("p.shipping-selected-sla .sla").each(function() {
        var retirar = RegExp("retirar");
        txt = retirar.test($(this).text());
        var loja = RegExp("Loja");
        txtLoja = loja.test($(this).text());

        var retirarGeral = RegExp("Retirar na Loja");
        if (geralTxt = retirarGeral.test($(this)
                .text()), geralTxt ? $(this)
            .parent()
            .hide() : $(this)
            .parent()
            .show(), txt) {
            $("p.shipping-selected-sla")
                .html("<span class='text'>" + $(".step.accordion-group.shipping-data div.retirar > p")
                    .html() + " - " + $(".step.accordion-group.shipping-data div.retirar p+p")
                    .html() + "</span><br /><span class='sla'><span style='display:none;'>Loja</span>" + $(".step.accordion-group.shipping-data div.retirar p+p+p")
                    .html() + " - " + $(".step.accordion-group.shipping-data div.retirar p+p+p+p")
                    .html() + " - " + $(".step.accordion-group.shipping-data div.retirar p+p+p+p+p")
                    .html() + "</span>");
            var mudagratis = $(this)
                .html();
            atribuir = mudagratis.replace(/ - Grátis/, "")
                .replace(/Até/, "Retirar em"), $(this)
                .html(atribuir), $("button#payment-data-submit")
                .fadeIn(), $(".mini-cart .table td")
                .each(function() {
                    var mudagratis = $(this)
                        .html();
                    atribuir = mudagratis.replace(/Escolha um tipo de Entrega/, "R$ 0")
                        .replace(/Grátis/, "R$ 0"), $(this)
                        .html(atribuir)
                })
        } else txtLoja || ($(".shipping-data .address")
            .fadeIn(), $("button#payment-data-submit")
            .fadeIn())
    })
}

function ZeraValores() {
    return setTimeout(function() {
            window.transportadora = "seller-1-sla-RetirarnaLoja", $(".label-vertical-group.input.btn")
                .attr("class", "shipping-option-item label-vertical-group input btn "), $(".label-vertical-group.input.btn i")
                .attr("class", "icon-circle-blank"), $(".address-list-placeholder")
                .fadeIn(), $(".address-form-placeholder")
                .fadeIn()
        }, 500), $("span.accordion-toggle.collapsed.accordion-shipping-title.accordion-toggle-active .icon-home + span")
        .text("Entrega"), !1
}

function arrumarEntregaCarrinho() {
    $("ul.dropdown-menu.shipping-sla-options li")
        .each(function() {
            $(this)
                .attr("data-bind", ""), $(this)
                .attr("href", "");
            var retirar = RegExp("retirar");
            txt = retirar.test($(this)
                .find("a span")
                .text());
            var retirarLoja = RegExp("Retirar na Loja");
            txtLoja = retirarLoja.test($(this)
                .find("a span")
                .text());
            var expressa = RegExp("Expressa");
            encontrei_Expressa = expressa.test($(this)
                .find("a span")
                .text());
            var SExpressa = RegExp("Super Expressa");
            if (encontrei_SExpressa = SExpressa.test($(this)
                    .find("a span")
                    .text()), $(".gift-list-alert-name")
                .text()
                .length < 1)
                if (txtLoja) {
                    var mudagratis = $(this)
                        .text();
                    atribuir = mudagratis.replace(/Grátis/, "Frete Grátis")
                        .replace(/Até/, "Retirar em"), $(this)
                        .text(atribuir)
                } else {
                    var mudagratis = $(this)
                        .text();
                    $(this)
                        .text(mudagratis)
                }
            else {
                txtLoja && $(this)
                    .hide(), encontrei_Expressa && $(this)
                    .hide(), encontrei_SExpressa && $(this)
                    .hide();
                var mudagratis = $(this)
                    .text();
                $(this)
                    .text(mudagratis), $("i.icon-remove-sign")
                    .remove()
            }
            txt && ($(this)
                    .hide(), $(".empty")
                    .hide()), $(".full-cart .summary-totalizers tr.Shipping")
                .find(".postal-code-for-sla")
                .css({
                    "margin-right": " -88px"
                }), $(".full-cart .summary-totalizers tr.Shipping")
                .find(".btn-group.shipping-sla-selector")
                .css({
                    "margin-right": " -88px"
                }), $(".full-cart .summary-totalizers tr.Shipping")
                .find(" .monetary")
                .hide(), $(".full-cart .summary-totalizers tr.Shipping")
                .find(".empty")
                .hide(), $(this)
                .parent()
                .fadeIn()
        })
}


function cliqueSelecioneTransportadora() {
    $("#selecineiTransportadora")
        .each(function() {
            $(this)
                .click(function(e) {
                    e.preventDefault();
                    var minha = $("#meuEnd h3 + p")
                        .text();
                    $("label.shipping-option-item.label-vertical-group.input.btn span.shipping-option-item-name")
                        .each(function() {
                            var transportadora = $(this)
                                .text()
                                .split(","),
                                end = transportadora[3] + "," + transportadora[4];
                            console.log(minha + "vai " + end), minha == end && ($(this)
                                .parent()
                                .parent()
                                .click(), $(".minhaModalNew")
                                .fadeOut("slow"), $(".minhaModalNew+.area")
                                .fadeOut("fast"), $("p.cancel-address-form")
                                .length > 0 ? $(".address-form-placeholder")
                                .fadeIn() : $(".address-form-placeholder")
                                .fadeOut(), $("div#shipping-data")
                                .addClass("retirarNaLoja"), $(".btn-retira")
                                .text("Retirar em outra loja"), $("span.accordion-toggle.collapsed.accordion-shipping-title.accordion-toggle-active .icon-home + span")
                                .text("Retirar na Loja"), $(".address-list-placeholder")
                                .hide(), $(".step.accordion-group.shipping-data.active div.retirar")
                                .length < 1 ? $(".step.accordion-group.shipping-data.active .address-shipping-options")
                                .before("<div class='retirar'><p><strong>Cidade:</strong> " + transportadora[2] + "</p><p><strong>Loja:</strong> " + transportadora[1] + "</p><p>" + end + "</p><p>" + $("#meuEnd p +br +p")
                                    .html() + "</p><p style='font-style: italic; margin-top: 5px;'>Retirar em 1 dia útil</p></div>") : $(".step.accordion-group.shipping-data.active div.retirar")
                                .html("<p><strong>Cidade:</strong> " + transportadora[2] + "</p><p><strong>Loja:</strong> " + transportadora[1] + "</p><p>" + end + "</p><p>" + $("#meuEnd p +br +p")
                                    .html() + "</p><p style='font-style: italic; margin-top: 5px;'>Retirar em 1 dia útil</p>"), $("div.retirar")
                                .fadeIn(), setTimeout(function() {
                                    $("div.retirar")
                                        .fadeIn()
                                }, 1500))
                        })
                })
        })
}


$(document)
    .ready(function() {
        window.transportadora = "seller-1-sla-RetirarnaLoja", ZeraValores(), 1 > $(".minhaModalNew")
            .length && $("body")
            .append("<div class='minhaModalNew' style='z-index: 999999; display:none;  position: fixed;  height: 100%;   width: 100%;   background: rgba(0,0,0,.80);   top: 0px;   left: 0px;'></div><div class='area' style=' display: none; border-radius: 3px 3px 3px 3px;   background: #fff;   left: 50%;   margin-left: -387px;   position: fixed;   top: 20%;   width: 770px;     height: 371px;   z-index: 9999999;'><div class='loading loading-bg loadingModal' data-bind='visible: loading' style='margin-top: 0;'><div class='loading-img'><i class='icon-spinner icon-spin icon-3x'><span data-i18n='global.loading'>Carregando...</span></i></div></div><a href='#' class='fechararea' style=' background-color: #ed2939; width: 22px; border-radius: 30px; text-transform: lowercase; color: #fff; font-weight: bold; font-size: 14px; display: inline-block; text-align: center; padding-bottom: 3px; padding-left: 1px; position: absolute; right: -8px; z-index: 999999; top: -8px;'>X</a><div class='box-left'><div id='info'></div><div id='meuEnd'></div></div><div id='map-canvas'></div></div>"), setInterval(function() {
                $(".step.accordion-group.shipping-data")
                    .hasClass("active") && ($(".gift-list-alert-name")
                        .text()
                        .length < 1 ? $(".address-shipping-options .delivery-shipping-options .shipping-options .sla-items-list .btn-group-vertical")
                        .find(".shipping-option-item")
                        .each(function() {
                            var retirar = RegExp("retirar,");
                            encontrei_retirar = retirar.test($(this)
                                .attr("for"));
                            var Retirar = RegExp("Retirar");
                            encontrei_Retirar = Retirar.test($(this)
                                    .attr("for")), $("body")
                                .addClass("cornelliau"), encontrei_retirar || encontrei_Retirar || ($(this)
                                    .show(), $(".step.accordion-group.shipping-data.active .address-shipping-options")
                                    .delay(1e3)
                                    .fadeIn(), $(".shipping-option-item .shipping-option-item-text-wrapper .shipping-option-item-name")
                                    .each(function(index) {
                                        var mudagratis = $(this)
                                            .html();
                                        atribuir = mudagratis.replace(/ 09710-011/, "")
                                            .replace(/ 01048-100/, ""), $(this)
                                            .html(atribuir)
                                    }));                            
                        }) : ($(".delivery-shipping-options h4 span")
                            .css("margin-top", "-4px"), $(".address-shipping-options .delivery-shipping-options .shipping-options .sla-items-list .btn-group-vertical")
                            .find(".shipping-option-item")
                            .each(function() {
                                var ecologica = RegExp("Normal");
                                encontrei_ecologica = ecologica.test($(this)
                                    .attr("for")), encontrei_ecologica && ($(this)
                                    .show(), $(this)
                                    .click())
                            }), $("p.link.create.address-create")
                            .hide(), $("p.link.edit.address-edit")
                            .hide(), $(".address-item label")
                            .each(function() {
                                "input gift-list-label" == $(this)
                                    .attr("class") || $(this)
                                    .parent()
                                    .parent()
                                    .hide()
                            })), "seller-1-sla-RetirarnaLoja" == window.transportadora ? ($(".mini-cart .table td")
                            .each(function() {
                                var mudagratis = $(this)
                                    .html();
                                atribuir = mudagratis.replace(/Grátis/, "Escolha um tipo de Entrega"), $(this)
                                    .html(atribuir)
                            })) : ($("p.submit.btn-submit-wrapper.btn-go-to-payment-wrapper button.submit.btn.btn-large.btn-success.btn-go-to-payment")
                            .fadeIn(), $(".mini-cart .table td")
                            .each(function() {
                                var mudagratis = $(this)
                                    .html();
                                atribuir = mudagratis.replace(/Escolha um tipo de Entrega/, "R$ 0")
                                    .replace(/Grátis/, "R$ 0"), $(this)
                                    .html(atribuir)
                            }))), redirectShipping(), newTexto(), arrumarEntregaCarrinho()
            }, 1e3), $("body")
            .on("click", "div#shipping-data .btn-retirar", function(e) {
                $("input#ship-number")
                    .each(function() {
                        $("input#ship-number")
                            .val()
                            .length > 1 ? ($(".minhaModalNew")
                                .fadeIn(), $(".minhaModalNew + .area")
                                .fadeIn()) : ($(".minhaModalNew")
                                .fadeOut(), $(".minhaModalNew + .area")
                                .fadeOut())
                    }), $(".address-item.active")
                    .each(function() {
                        $(".minhaModalNew")
                            .fadeIn(), $(".minhaModalNew + .area")
                            .fadeIn()
                    })
            }), $("body")
            .on("click", ".delivery-shipping-options .shipping-option-item", function() {
                var meutexto = $(this)
                    .attr("for");
                window.transportadora = meutexto;
                var retirar = RegExp("retirar");
                txt = retirar.test($(this)
                    .attr("for")), txt || ($("fieldset.shipping-options")
                    .fadeIn(), $(".address-list-placeholder")
                    .fadeIn(), $(".address-form-placeholder")
                    .fadeIn(), $("div.retirar")
                    .html(""), $("div#shipping-data")
                    .removeClass("retirarNaLoja"), $("span.accordion-toggle.collapsed.accordion-shipping-title.accordion-toggle-active .icon-home + span")
                    .text("Entrega"))
            }), $("body")
            .on("click", "button#go-to-payment", function(e) {
                e.preventDefault(), location.href = window.location.pathname + "#/shipping"
            })

        /* NOVA POLITICA DE PRIVACIDADE
	$('p.newsletter').after('<p class="privacidade" data-bind="visible: checkout.saveData">' +
		'	<label class="checkbox privacidade-label" data-bind="fadeVisible: checkout.canEditData">' +
		'		<input type="checkbox" id="opt-in-privacidade" data-bind="checked: checkout.optinPrivacidade, enable: checkout.saveData">' +
        '		<span class="" data-i18n="global.optinPrivacidade">Concordo com a política de privacidade e compras do Empório da Cerveja.</span> ' +
       	'	</label>' +
		'		<span class="privacidade-text-link">Consulte nossa política de privacidade e termos de uso ' +
		' 			<a href="http://www.emporiodacerveja.com.br/institucional/politica-emkt" target="_blank">clicando aqui.</a>' +
		'		</span>' +
		'</p>') */
    });


/* PushEvents */


pushEventsCk = function(category, action, label, value) {

    dataLayer.push({
        'event': 'virtualPageEvent',
        'eventCategory': category,
        'eventAction': action,
        'eventLabel': label,
        'eventValue': value
    });

}

sendCkEvents = function() {
    $(document).on('click', '#btn-client-pre-email', function() {
        pushEventsCk('PageEvent', 'Login - Checkout');
    })
}



/* end cc events */



clickLogo = function() {

    $('.x-header h1').click(function() {

        window.location.href = "/";

    })

}

fM = function() {
    $(document).on('focusout', '#client-pre-email', function() {
        $.cookie('kM', $('#client-pre-email').val(), {
            expires: 365,
            path: '/'
        });
    })
}

var cI = false;

callUB = function() {

    $('#payment-data-submit').click(function() {
        cI = true;
		
		//vtexjs.checkout.sendAttachment('openTextField', {value: "{'multiplus' : 'true'}"});


		for(var iC = 0; iC < vtexjs.checkout.orderForm.items.length; iC++){
			var objN = vtexjs.checkout.orderForm.items[iC];
			var cat = '';
			switch(objN.productCategoryIds.split('/')[1]) {
				case '10':
					cat = 'Acessórios'
				break
				case '24':
					cat = 'Alimentos'
				break
				case '9':
					cat = 'Cervejas'
				break	
				case '18':
					cat = 'Clubes'
				break
				case '51':
					cat = 'Destilados'
				break
				case '11':
					cat = 'Kits'
				break
				case '42':
					cat = 'Não Alcoólicos'
				break
				case '28':
					cat = 'Outras Bebidas'
				break
				case '19':
					cat = 'Vinhos'
				break		
			}
			pushEventsCk('Store Order',cat,objN.name + ' - qtd: ' + objN.quantity, Number(String(objN.sellingPrice).substr(0,String(objN.sellingPrice).length - 2) + '.' + String(objN.sellingPrice).substr(String(objN.sellingPrice).length - 2,String(objN.sellingPrice).length)) * objN.quantity)
		}
		
    });

    window.onbeforeunload = unloadFunctionCA;
}

unloadFunctionCA = function() {

    if (!document.activeElement.href && window.location.pathname != '/aguarde' && window.location.pathname != '/checkout/orderPlaced/' && !cI) {

        fGetCA();

    }

    return null
}

fGetRand = function(numb) {
    return Math.floor((Math.random() * numb) + 1);
}

fGetCA = function() {

    var mailN = null;

    if (vtexjs.checkout.orderForm['clientProfileData'] && vtexjs.checkout.orderForm['clientProfileData'].email) {
        mailN = vtexjs.checkout.orderForm['clientProfileData'].email;
    } else if ($.cookie('kM')) {
        mailN = $.cookie('kM').replace('%40', '@');
    }

    if (vtexjs.checkout.orderForm.items.length > 0 && mailN) {

        /*
        var statNow = fGetRand(3), cTime;

        switch (statNow){

        	case 1:
        		cTime = 15 * 60;
        		break;
        	case 2:
        		cTime = 30 * 60;
        		break;
        	case 3:
        		cTime = 60 * 60;
        		break
        }
        */

        cTime = 15 * 60;

        /*get date*/

        var fullDate = new Date();
        cTFullDate = fullDate.toISOString().replace('Z', '');
        cFullDate = cTFullDate.substr(0, cTFullDate.lastIndexOf("."));

        /*end date*/

        var cEMail = mailN;
        var cSkus = '?';
        var cPrice = 0;
        for (iC = 0; iC < vtexjs.checkout.orderForm.items.length; iC++) {

            if (iC != 0) {
                cSkus += '&'
            }
            cPrice += vtexjs.checkout.orderForm.items[iC].price * Number(vtexjs.checkout.orderForm.items[iC].quantity);


            cSkus += 'sku=' + String(vtexjs.checkout.orderForm.items[iC].id) + '&qty=' + String(vtexjs.checkout.orderForm.items[iC].quantity) + '&seller=' + String(vtexjs.checkout.orderForm.items[iC].seller);
        }
        cSkus += '&sc=' + String(vtexjs.checkout.orderForm.salesChannel);

        cPrice = cPrice;
        cPrice *= 0.01;

        var settings = {
            "async": false,
            "crossDomain": true,
            //"url": "https://dyeiab3xz5.execute-api.us-west-2.amazonaws.com/prod/trigger/abandoned_cart",
			"url": "https://api.emporio.com/campaign/trigger/abandoned_cart",
            "type": "POST",
            "headers": {
                "content-type": "application/json",
            },
            "processData": false,
            "data": JSON.stringify({
                "rclastcart": cSkus,
                "rclastcartvalue": cPrice,
                "rclastsessiondate": cFullDate,
                "email": cEMail,
                "cTimeFull": cTime
            })
        }


        $.ajax(settings).done(function(response) {
            //console.log(response);
        });

    }

}

newHeader = function() {

    $('.x-header .x-left').after(' <div class="icon-center"> <div class="box-table"> <a href="/emporio-da-cerveja" class="ck-icon emporio-cerv"></a> <div class="point"></div>	<a href="/winefor"class="ck-icon winefor"></a> <div class="point"></div> <a href="javascript:void(0)" class="ck-icon destilados"></a> <div class="point"></div>	<a href="/acessorios" class="ck-icon acessorios"></a> <div class="point"></div>	<a href="/sucos" class="ck-icon naoalcoolicos"></a> <div class="point"></div>	<a href="/alimentos" class="ck-icon gourmet"></a> </div> </div> ');

}

funcCI = function(){
	
	if(document.location.host == "personnalite.emporio.com" || document.location.host == "itaupersonnalite.emporio.com"){
		
		var aPer = [
			490172,
			490172,
			549167,
			490172,
			549167,
			549167,
			490172,
			490172,
			514868,
			490172,
			514868,
			514868,
			553636,
			477176,
			552072,
			515640,
			589916,
			482481,
			523432,
			414505,
			519699,
			414504,
			523431,
			414506
			
		]
		
		$(document).on('blur','input[name="cardNumber"]',function(){
			if($(this).val() != ''){
				var bC = Number($(this).val().replace(' ','').substr(0,6));
				
				var aResp = $.grep(aPer,function(a){
					return a == bC
				})
				
				if(aResp.length <= 0){
					
					$('.payment-submit-wrap').css('display','none');
					$('body').append('<div id="shadow-pers"> <div class="marg-form"> <div class="box-form-i"> <div class="header-i"><h2>Atenção!</h2></div> <div class="marg-i"> <p>Esta loja é exclusiva para clientes <strong>Itaú Personnalité</strong>.</p> <p>As compras só podem ser pagas com cartão de crédito <strong>Itaú Personnalité</strong>.</p> </div> <div class="spc-bts"> <div class="box-bts"> <a href="javascript:void(0);" id="cb-a" class="bt-loja-i cor-i">Alterar o Cartão de crédito</a> <a href="javascript:void(0);" id="cb-b" class="bt-loja-i">Ir para a loja convencional</a>			 </div> </div> </div> </div> </div>');
					
					$('#cb-a').click(function(){
						$('input[name="cardNumber"]').val('');
						$('input.card-cvv').val('');
						$('#shadow-pers').fadeOut(400,function(){
							$('#shadow-pers').remove();							
						})
						
					})
					
					$('#cb-b').click(function(){
						
						var obj = vtexjs.checkout.orderForm.items,
							url = "http://www.emporio.com/aguarde?"
						
						for(var iN = 0; iN < obj.length; iN++){
							if(iN != 0){
								url += '&';
							}							
							url += 'sku=' + obj[iN].id + '&qty=' + obj[iN].quantity + '&seller=' + obj[iN].seller;
						}
						
						url += '&utm_source=Personnalite-back'
						
						window.location.href = url;

					})
					
					
					
				} else {
					
					$('.payment-submit-wrap').css('display','block');
				}
			}
		})
		
	}	
}

getStore = function(){
	
	var lilP = {
		613 : 2,
		568 : 8
	}
	
	lil = $.extend(lil,lilP);
		
	if(document.location.host == "personnalite.emporio.com" || document.location.host == "itaupersonnalite.emporio.com"){
		$('.x-bottom').append('<p><br /> Esse site é válido apenas para clientes Itau Personnalite, durante o período de 01/01/2017 e 31/12/2017.</p>');
	}
	
}

gGiftNF = function(){
	
	if(window.location.hash == "#/cart"){
		if($('.add-service.btn.btn-mini').length > 0){			
			fGeraNP();
		} else if($('.item-service .icon.icon-remove.item-remove-ico').length > 0){
			presentSet = true;
			fGeraNP();
			fSetNE('set');
		} else {
			setTimeout(function(){
				gGiftNF();
			},300)
		}
	}
}

fSetNE = function(acao){
	if(acao == 'set'){
		$('#bt-nota-preco').addClass('ativo');
		$('#bt-nota-preco .box-cb input').attr('checked','checked');
		listNE(acao);
	} else {
		$('#bt-nota-preco').removeClass('ativo');
		$('#bt-nota-preco .box-cb input').removeAttr('checked');
		listNE(acao);
	}
}

var presentSet = false,
	flagNE = false;

fGeraNP = function(){
	$('.checkout-container .summary-template-holder:first').prepend('<div id="bt-nota-preco">  <div class="box-cb"> <input type="checkbox" /> </div> <div class="img-nf"></div> <div class="box-txt-info"> <h4>Nota para Presente</h4> <p>A nota impressa irá com o valor zerado.</p> </div> </div>')
	
	//click no botao de gift
	$('#bt-nota-preco').click(function(){
		
		if(!flagNE){
		
			flagNE = true;
			showLoading('#bt-nota-preco');
			
			if(!presentSet){
				pushEventsCk('PageEvent','IsGift Set')
				presentSet = true;
				fSetNE('set');
				$('.add-service.btn.btn-mini').each(function(){
					$(this).click();
				})
			} else {
				presentSet = false;
				fSetNE('unset');
				pushEventsCk('PageEvent','IsGift Unset')
				$('.item-service .icon.icon-remove.item-remove-ico').each(function(){
					$(this).click();
				})
			}
		}

	})	
	
	//removi produto
	
	$(document).on('click','.icon.icon-remove.item-remove-ico',function(){
		setTimeout(function(){
			
			if($('.add-service.btn.btn-mini').length < 1 && $('.item-service .icon.icon-remove.item-remove-ico').length < 1){
				$('#bt-nota-preco').remove();
			}
			
		},500)
	})	
	
}

listNE = function(acao){
	if(acao == 'set'){
		if($('.item-service .icon.icon-remove.item-remove-ico').length > 0){
			callListNe();
		} else {
			setTimeout(function(){
				listNE(acao);
			},300)
		}
	} else {
		if($('.add-service.btn.btn-mini').length > 0){
			callListNe();
		} else {
			setTimeout(function(){
				listNE(acao);
			},300)
		}
	}
}

callListNe = function(){
	removeLoading();
	flagNE = false;
}

showLoading = function(target, size) {

    $(target).append('<div id="loading-cup"></div>');
    if (size) {
        $('#loading-cup').height(size);
    }
    if (target == 'body') {
        $('#loading-cup').css('position', 'fixed');
    } else {
        $('#loading-cup').css('position', 'absolute'); 
    }

}

removeLoading = function() {
    $('#loading-cup').remove();
}

fixAddressClick = function(){
	$(document).on('click','.link.edit.address-edit, .link.create.address-create',function(){
		$('html, body').animate({
			scrollTop: '0px'
		},400)
	})
}

/* validaMultiplus = function() {
	vtexjs.checkout.getOrderForm()
		.then(function(orderForm) {
			var obs = "{'multiplus' : false}"
			return vtexjs.checkout.sendAttachment('openTextField', { value: obs });
	});
} */

omniWarning = function(){
	
	$('.vtex-front-messages-template.vtex-front-messages-instance.vtex-front-messages-type-warning.vtex-front-messages-template-opened').each(function(){
		
		if($(this).children('.vtex-front-messages-detail').html().indexOf("estava indisponível") < 0){
			$(this).fadeIn(200);
		} else {
			$(this).css('display','none');
		}
	})
	
}

$(document).ready(function() {
	
    clickSubmit();
    createNascField();
    //desabilitaAge();
    scrollLogin();
    //createCookieDadosUser();
    //birthDateActions();
    //$('.payment-submit-wrap').show(0);
    hideUnderPrint();
    limitaVale();
    hideValeReload();
    cArrow();
    fValidaCEP();
    //fTextFrete();
    //sendExperiment();
    comunicadoFrete();
    //alteraFreteText();
    reWorkShipButton();
    fBuscaCep();
    cFrete();
    clickLogo();
    sendCkEvents();
    fM();
    callUB();
    newHeader();
	getStore();
	funcCI();
	gGiftNF();
	fixAddressClick();
	//validaMultiplus();
	omniWarning();
	
});


$(document).ajaxStop(function() {
    alertBol();
});

$(window).resize(function(){
    fixStart();
})

$(window).load(function() {
    $(".scheduled-sla-value-container").click(function() {
        $(".picker__footer").css("display", "none");
        $(".picker__holder").css("font-size", "13px");
    });
});
