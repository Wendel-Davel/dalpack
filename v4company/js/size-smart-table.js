(function($) {
    $('html.page-product .product-size-smart-table').on('click', function() {
        $('.modal-theme.modal-size-smart-table').toggleClass('show');
    })

    if ($(window).width() >= 770) {
        $(".tabela table tbody tr > td").on('mouseover', function() {  
            var tamSel = $(this).index();

            $(".tabela table thead tr th").removeAttr("style");
            $(`.tabela table thead tr th:nth-child(${tamSel + 1})`).attr("style", "background: var(--color_primary); color: #fff");
        });

        $(".tabela table tbody tr > td").on('mouseout', function() {  
            $(".tabela table thead tr th").removeAttr("style");
        });
    }
})(jQuery);