(function ($) {
  'use strict';

  $(function () {
    $('#wizard').smartWizard();
    $('.buttonNext').addClass('btn btn-success');
    $('.buttonPrevious').addClass('btn btn-primary');
    $('.buttonFinish').addClass('btn btn-default');
    $('#package-tags').tagsInput({
      width: 'auto'
    });
    $('.tags').tagsInput({
      'width': 'auto'
    });
    // $('#package-thumbnails').dropzone({
    //   url: '/package/thumbnails/upload'
    // });
  });
}(jQuery));