;(function($) {
  $.outOfView = {
      init: function() {
        $("[data-outofview]").css('transition', 'none').addClass('outofview');
        window.setTimeout(function(){
          $("[data-outofview]").css('transition', '');
          $.outOfView.scroll();
        }, 100);
      }
    , scroll: function() {
       var $window = $(window)
         , scrolled = $(window).scrollTop()
         , windowHeight = $(window).height();

       $("[data-outofview].outofview").each(function() {
         var $this = $(this)
           , dataCoefficient = $(this).data('outofview-coefficient')
           , coefficient = dataCoefficient ? parseInt(dataCoefficient, 10) / 100 : 1
           , windowHeightPadded = windowHeight * coefficient
           , offsetTop = $this.offset().top
           , offsetBottom = offsetTop + $this.outerHeight() * coefficient;

          // If the distance from the bottom of the element to the top of the document
          // is greater than the distance from the top of the window to the top of the
          // document, OR the distance from the top of the element is less than the distance
          // from the bottom of the window to the top of the document... remove the class.
          // The element is in view.
         if ( scrolled < offsetBottom || scrolled + windowHeightPadded > offsetTop) {
           if ($this.data('outofview-timeout')) {
             window.setTimeout(function() {
               $this.removeClass('outofview');
             }, parseInt($this.data('outofview-timeout'), 10));
           } else {
             $this.removeClass('outofview');
           }
         }
       });
       // Hidden...
       $("[data-outofview]:not(.outofview)").each(function () {
         var $this = $(this)
           , dataCoefficient = $(this).data('outofview-coefficient')
           , coefficient = dataCoefficient ? parseInt(dataCoefficient, 10) / 100 : 1
           , windowHeightPadded = windowHeight * coefficient
           , offsetTop = $this.offset().top
           , offsetBottom = offsetTop + $this.outerHeight() * coefficient;

          // If the distance from the bottom of the element to the top of the document
          // is less than the distance from the top of the window to the top of the
          // document, OR the distance from the top of the element is greater than the distance
          // from the bottom of the window to the top of the document... add the class.
          // The element is out of view.
         if ( scrolled > offsetBottom || scrolled + windowHeightPadded < offsetTop) {
           $(this).addClass('outofview');
         }
       });
      }
  };

  // Reveal animations as they appear on screen
  $(window).on('scroll', $.outOfView.scroll);
  $.outOfView.init();
})(jQuery);
