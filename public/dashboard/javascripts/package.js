(function ($) {
  'use strict';

  /*
   * 保存单日行程
   */
  function saveSchedule(e) {
    e.preventDefault();
    console.log('save btn clicked');
  }


  $(function () {

    $('#package-tags').tagsInput({
      width: 'auto'
    });
    $('.tags').tagsInput({
      'width': 'auto'
    });
    var formWizard = $('#wizard');
    formWizard.smartWizard();
    formWizard.find('.stepContainer').css('height', 'auto');

    $('.buttonNext').addClass('btn btn-success');
    $('.buttonPrevious').addClass('btn btn-primary');
    $('.buttonFinish').addClass('btn btn-default');
    $('#schedule-save-btn').on('click', saveSchedule);
  });
}(jQuery));