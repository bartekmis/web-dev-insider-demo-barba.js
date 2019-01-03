'use strict';

/**
 * 
 * Form validation - success/error/redirect/or just message
 * jQuery dependency needed
 * HTML: onsubmit="return XXX._form(this);" and loading layer inside form <div class="loading"></div>
 */

var UTILS = UTILS || {};

UTILS.form = function form(form, url) {
    let data = $(form).serialize(),
        loading = true;

    $(form).find('.loading').fadeIn();
    $(form).find('button[type="submit"]').text('Sending...');

    $.ajax({
        url: url,
        method: 'POST',
        data: data,
        dataType: 'json'
    })
    .then(function(response) {
        $(form).find('button[type="submit"]').text('Submit');
        $(form).find('.loading').fadeOut();

        if (response.url) {
            window.location.href = response.url;
        } else {
            $(form).find('.loading').fadeOut();

            if ( $(form).find('.form__response--ok').length === 0 ) {
                $(form).prepend( '<div class="form__response form__response--ok"><p>'+response.message+'</p></div>' );
            } else {
                $('.form__response--ok p').html(response.message);
            }
        }

        // remove error response if exists and reset the form
        $(form).find('.form__response--error').remove();
        $(form)[0].reset();

    }, function(response) {
        let errorMessage = '';

        if (response.status == 422) {
            for (var field in response.responseJSON) {
                if (response.responseJSON.hasOwnProperty(field)) {
                    errorMessage += response.responseJSON[ field ].join('<br>') + '<br>';
                }
            }
        } else if (response.status == 404) {
            errorMessage = 'Page not found - incorrect url.';
        } else if (response.responseJSON.message) {
            errorMessage = response.responseJSON.message;
        }

        if (errorMessage) {
            if ( $(form).find('.form__response--error').length === 0 ) {
                $(form).prepend( '<div class="form__response form__response--error"><p>'+errorMessage+'</p></div>' );
            } else {
                $('.form__response--error p').html(errorMessage);
            }
        }

        // remove success response if exists
        $(form).find('.form__response--ok').remove();

        $(form).find('button[type="submit"]').text('Submit');
        $(form).find('.loading').fadeOut();
    });

    return false;
};
