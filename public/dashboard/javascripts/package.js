(function ($) {
  'use strict';

  $(function () {

    $('#package-tags').tagsInput({
      width: 'auto'
    });

    var formWizard = $('#wizard');
    formWizard.smartWizard();
    formWizard.find('.stepContainer').css('height', 'auto');

    $('.buttonNext').addClass('btn btn-success');
    $('.buttonPrevious').addClass('btn btn-primary');
    $('.buttonFinish').addClass('btn btn-default');

    // $('#package-thumbnails').dropzone({
    //   url: '/package/thumbnails/upload'
    // });
  });
}(jQuery));