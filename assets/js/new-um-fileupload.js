(function( $ ){
    var notifications = [];
    var methods = {
        init : function( options ) {
            var $this = $(this),
                uniqid = methods.uniqid.apply( this, [] ),
                default_settings = {
                    object : this,
                    uniqid : uniqid,
                    browse_button: "wpo_fileupload_button_" + uniqid,
                    container: "wpo_fileupload_inner_" + uniqid,
                    drop_element: "wpo_drop_area_" + uniqid,
                    filelist: "wpo_fileupload_filelist_" + uniqid,
                    runtimes: "html5,flash,html4",
                    max_files: 0,
                    chunk_size: '10mb',
                    file_data_name: 'file',
                    flash_swf_url: um_scripts.includes_url + '/js/plupload/plupload.flash.swf',
                    silverlight_xap_url: um_scripts.includes_url + '/js/plupload/plupload.silverlight.xap',
                    filters: {
                        mime_types: [{
                            title: 'Allowed Files',
                            extensions: '*'
                        }]
                    },
                    multipart: true,
                    urlstream_upload: true,
                    disallowed_extensions: [],
                    multipart_params : {}
                };

            if( typeof options.name == 'undefined' ) {
                $.error('Element name does not exists');
                return;
            } else {
                var name = options.name;
            }

            options = ( typeof options == 'undefined' || options == '' ) ? {} : options;
            var settings = jQuery.extend( default_settings, options );

            var description = '';

            if( settings.filters.mime_types.extensions != '*' && settings.disallowed_extensions.length > 0 ) {
                description = wpo_uploader.messages.disallowed_ext + ': ' + settings.disallowed_extensions.join(', ') + '<br />';
            }

            if( settings.filters.max_file_size != '' ) {
                var size = parseInt( settings.filters.max_file_size ) / 1024;
                description += wpo_uploader.messages.max_file_size + ': ' + size + 'Kb';
            }

            $this.addClass('wpo_fileupload');
            $this.html('<div class="wpo_fileupload_inner" id="wpo_fileupload_inner_' + uniqid + '">' +
                '<div class="wpo_drop_area" id="wpo_drop_area_' + uniqid + '">' +
                '<span class="wpo_drop_instructions">' +
                wpo_uploader.messages.drop_files_here +
                '</span>' +
                '<br />' +
                wpo_uploader.messages.select_files_button.replace(/wpo_fileupload_button_/g, settings.browse_button ) +
                '<input type="hidden" name="' + name + '" /><br />' +
                '<span class="description">' + description + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="wpo_fileupload_messages"></div>' +
                '<div class="wpo_fileupload_filelist"></div>');


            uploader = new plupload.Uploader( settings );
            $this.data( 'umFileUploader', uploader );
            $this.data( 'umFileUploaderSettings', settings );
            uploader.init();

            if( typeof( settings.BeforeUpload ) == 'function' ) {
                uploader.bind('BeforeUpload', settings.BeforeUpload );
            }

            if( typeof( settings.FilesAdded ) == 'function' ) {
                uploader.bind( 'FilesAdded', settings.FilesAdded );
            }

            if( typeof( settings.UploadProgress ) == 'function' ) {
                uploader.bind('UploadProgress', settings.UploadProgress);
            }

            if( typeof( settings.FileUploaded ) == 'function' ) {
                uploader.bind('FileUploaded', settings.FileUploaded);
            }

            if( typeof( settings.Error ) == 'function' ) {
                uploader.bind('Error', settings.Error);
            }
        },
        progress_bar_init: function( id, size ) {
            return '<div class="wpo_progress_bar" id="wpo_progress_bar_' + id + '">' +
                '<div class="wpo_progress_bar_inner" style="right: 100%;"></div>' +
                '<div class="wpo_progress_bar_content">0%</div>' +
                '<div class="wpo_file_size">' + size + '</div>' +
                '</div>';
        },
        progress_bar_value: function( id, value ) {
            jQuery('#' + id + ' .wpo_progress_bar_inner').css('right', ( 100 - value ) +  '%' );
            if( value < 100 ) {
                jQuery('#' + id + ' .wpo_progress_bar_content').html(value + '%');
            } else {
                jQuery('#' + id + ' .wpo_progress_bar_content').html( 'Completed' );
                jQuery('#wpo_progress_bar_' + id ).addClass( 'wpo_file_completed' );
            }
        },
        get_uploader: function() {
            return $(this).data( 'umFileUploader' );
        },
        get_settings: function() {
            return $(this).data( 'umFileUploaderSettings' );
        },
        get_files_count: function( up ) {
            /*var value = '';
             if( jQuery( up.settings.object ).find('input[type="hidden"]').length > 0 ) {
             value = jQuery( up.settings.object ).find('input[type="hidden"]').val();
             }
             var file_ids = new Array();
             if( value != '' ) {
             file_ids = value.split(',');
             }*/

            return typeof( up.files !== 'undefined' ) ? up.files.length : 0;
        },
        get_file_ids_count: function( up ) {
            var value = '';
            if( jQuery( up.settings.object ).find('input[type="hidden"]').length > 0 ) {
                value = jQuery( up.settings.object ).find('input[type="hidden"]').val();
            }
            var file_ids = new Array();
            if( value != '' ) {
                file_ids = value.split(',');
            }

            return file_ids.length;
        },
        addMessage: function( message ) {
            var id = methods.uniqid.apply( this, [] );
            notifications.push( id );
            $(this).find('.wpo_fileupload_messages').append("<li id='" + id + "'>" + message + "</li>");
            setTimeout( function() {
                if( typeof( notifications[0] ) !== 'undefined' ) {
                    $( '#' + notifications[0] ).remove();
                    notifications.splice(0, 1);
                }
            }, 5000 );
        },
        uniqid: function() {
            var ts=String(new Date().getTime()), i = 0, out = '';
            for(i=0;i<ts.length;i+=2) {
                out+=Number(ts.substr(i, 2)).toString(36);
            }
            return out;
        }
    };

    $.fn.umFileUploader = function ( method ) {

        if ( methods[ method ] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        } else if ( typeof method === 'object' || !method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error('Method ' + method + ' does not exists in jQuery.umFileUploader');
        }

    };

})( jQuery );


jQuery( documet ).ready( function() {
    jQuery('.um_uploader_block').umFileUploader({
        name : 'um_uploader',
        max_files : 0,
        url : 'ajax_plupload_process',
        filters: {
            mime_types: [{
                title: 'Allowed Files',
                extensions: 'jpg'
            }],
            max_file_size: max_file_size
        },
        disallowed_extensions: ['php', 'asp', 'exe', 'com', 'htaccess', 'phtml', 'php3', 'php4', 'php5', 'php6'],
        FilesAdded : function( up, files ) {
            var disallowed = up.settings.disallowed_extensions,
                extension;

            jQuery( up.settings.object ).find('.wpo_fileupload_messages > div').remove();
            jQuery.each(files, function (i, file) {
                extension = file.name.split('.').pop();

                if ( jQuery.inArray( extension, disallowed ) > -1 ) {
                    methods.addMessage.apply( up.settings.object, [ 'Can\'t upload file with same extension.' ] );
                    up.removeFile(file);
                    return;
                }

                if ( file.status == plupload.FAILED ) {
                    up.removeFile(file);
                    return;
                }

                var size = typeof file.size !== 'undefined' ? plupload.formatSize( file.size ) : '';
                var progress = jQuery( up.settings.object ).wpoFileUploader( 'progress_bar_init', file.id, size );
                //debugger;
                jQuery(up.settings.object)
                    .find('.wpo_fileupload_filelist')
                    .prepend('<ul data-id="' + file.id + '" id="' + file.id + '">' +
                        '<li class="wpo_file_icon"></li>' +
                        '<li class="wpo_file_title">' + file.name + ' <span class="wpo_file_edit"> click to edit</span></li>' +
                '<li class="wpo_file_progress">' + progress + '</li>' +
                '</ul>');

            });

            up.refresh();
            up.start();
        },
        BeforeUpload: function(up) {
            var file_cat_id = jQuery( '#category_id' ).val();
            var file_assigns = jQuery( 'input[name="file_assigns"]' ).val();
            up.settings.multipart_params.category = file_cat_id;
            up.settings.multipart_params.assigns = file_assigns;
        },
        UploadProgress : function( up, file ) {
            jQuery( up.settings.object ).wpoFileUploader( 'progress_bar_value', file.id, file.percent );
        },
        FileUploaded : function(up, file, data) {
            var response = jQuery.parseJSON(data.response);

            if( data.status == 200 ) {
                if( typeof response.id != 'undefined' && !isNaN( response.id ) ) {
                    jQuery('#' + file.id).data('id', response.id );
                    reset_template[list_table_uniqueid] = true;
                    load_content( list_table_uniqueid );
                    return true;
                } else if( typeof response.status != 'undefined' && response.status == false ) {
                    jQuery(this).wpo_notice({
                        message: response.message,
                        type: 'error'
                    });
                    jQuery('#' + file.id ).remove();
                    return false;
                }
            }
            jQuery(this).wpo_notice({
                message: 'Unknown error',
                type: 'error'
            });
            jQuery('#' + file.id ).remove();
        },
        Error : function( up, error ) {
            console.log(up, error);
        }
    });

});