/**
 * Created by joachimdoerr on 30.07.16.
 */
$(function () {
    initjBlock();
    $(document).on('pjax:end', function() {
        initjBlock();
    });
});

function initjBlock() {
    var rform = $('#REX_FORM'),
        jblock = $('.jblock_wrapper');
    // init by siteload
    if (rform.length && jblock.length) {
        initjblocksort(jblock);
    }
}

// List with handle
function initsort(element) {
    // reindex
    reindexit(element);
    // init
    initjblocksort(element);
}

function initjblocksort(element) {
    // add linking
    addlinking(element);
    // remove removeme
    removeme(element);
    // init sortable
    sortit(element);
}

function removeme(element) {
    var finded = element.find('> div');
    if (finded.length == 1) {
        finded.find('.removeme').hide();
    } else {
        finded.find('.removeme').show();
    }
    finded.each(function(index){
        if (index==0) {
            $(this).find('.moveup').hide();
        }
    });
}

function sortit(element) {
    element.sortable({
        handle: '.sorthandle',
        animation: 150,
        onEnd: function () {
            reindexit(element);
        }
    });
}

function reindexit(element) {

    // remove removeme
    removeme(element);

    element.find('> div').each(function(index) {
        // find input elements
        $(this).find('input,textarea,select').each(function() {
            var attr = $(this).attr('name');
            // For some browsers, `attr` is undefined; for others,
            // `attr` is false. Check for both.
            if (typeof attr !== typeof undefined && attr !== false) {
                var value = $(this).attr('name').replace($(this).attr('name').match(/\]\[\d+\]\[/g), '][' + index + '][');
                $(this).attr('name', value);
            }

            replacefor(element, $(this), index);

            // select rex button
            if ($(this).prop("nodeName") == 'SELECT' && (
                    $(this).attr('id').indexOf("REX_MEDIALIST_SELECT_") >= 0 ||
                    $(this).attr('id').indexOf("REX_LINKLIST_SELECT_") >= 0
                )) {
                $(this).attr('id', $(this).attr('id').replace(/\d+/, index));
                if ($(this).attr('name') != undefined) {
                    $(this).attr('name', $(this).attr('name').replace(/\d+/, index));
                }
            }

            // input rex button
            if ($(this).prop("nodeName") == 'INPUT' && (
                    $(this).attr('id').indexOf("REX_LINK_") >= 0 ||
                    $(this).attr('id').indexOf("REX_LINKLIST_") >= 0 ||
                    $(this).attr('id').indexOf("REX_MEDIA_") >= 0 ||
                    $(this).attr('id').indexOf("REX_MEDIALIST_") >= 0
                )) {
                $(this).attr('id', $(this).attr('id').replace(/\d+/, index));
                // button
                $(this).parent().find('a.btn-popup').each(function(){
                    $(this).attr('onclick', $(this).attr('onclick').replace(/\(\d+/, '(' + index));
                    $(this).attr('onclick', $(this).attr('onclick').replace(/_\d+/, '_' + index));
                });
            }
        });

        $(this).find('.redactor-box').each(function(){
            var toolbar = $(this).find('.redactor-toolbar'),
                voice = $(this).find('.redactor-voice-label'),
                redctorin = $(this).find('.redactor-in');
            toolbar.attr('id', toolbar.attr('id').replace(/\d+/, index));
            voice.attr('id', voice.attr('id').replace(/\d+/, index));
            redctorin.attr('id', redctorin.attr('id').replace(/\d+/, index));

            $(this).find('textarea').each(function(){
                if($(this).attr('id')) {
                    $(this).attr('id', $(this).attr('id').replace(/(.{1})\s*$/, index));
                }
            });
        });
    });

    // if(typeof redactorInit === 'function') redactorInit();

}

function replacefor(element, item, index) {
    if (item.attr('id').indexOf("REX_MEDIA") >= 0 ||
        item.attr('id').indexOf("REX_LINK") >= 0 ||
        item.attr('id').indexOf("redactor") >= 0
    ) { } else {
        item.attr('id', item.attr('id').replace(/_\d_+/, '_' + index + '_'));
        if (item.parent().find('label').length) {
            label = item.parent().find('label');
        }
        if (item.parent().parent().find('label').length) {
            label = item.parent().parent().find('label');
        }
        if (label.length) {
            label.attr('for', label.attr('for').replace(/_\d_+/, '_' + index + '_'));
        }
    }
    replacecheckboxfor(element);
}

function replacecheckboxfor(element) {
    element.find('input:checkbox').each(function() {
        $(this).parent().find('label').attr('for', $(this).attr('id'));
    });
}

function additem(element, item) {
    if (item.parent().hasClass(element.attr('class'))) {
        // unset sortable
        element.sortable("destory");
        // add element
        item.after(item.clone());
        // reinit
        initsort(element);
    }
}

function removeitem(element, item) {
    if (item.parent().hasClass(element.attr('class'))) {
        // unset sortable
        element.sortable("destory");
        // remove element
        item.remove();
        // reinit
        initsort(element);
    }
}

// function moveup(element, item) {
//
// }
//
// function movedown(element) {
//     element.find('> div').each(function(){
//         var json = $(this);
//         json.find('.moveup').unbind().bind('click', function(){
//             alert(json.parents());
//             var parent = $(this).parents(),
//                 replace = parent.index()-1;
//
//             if(replace <= 0)
//                 return false;
//
//             // updateIndex(parent.prev(),(parent.index()-2).toString(),1,1);
//             parent.insertBefore(parent.prev());
//             // updateIndex(parent,replace.toString(),-1,1);
//         });
//     });
// }

function addlinking(element) {
    element.find('> div .addme').unbind().bind('click', function() {
        additem(element, $(this).closest('div[class^="sortitem"]'));
        return false;
    });
    element.find('> div .removeme').unbind().bind('click', function() {
        removeitem(element, $(this).closest('div[class^="sortitem"]'));
        return false;
    });
    // movedown(element);
    // element.find('> div .moveup').unbind().bind('click', function() {
    // //     moveup($(this).parent().parent());
    // //     return false;
    // // });
    // // element.find('> div .movedown').unbind().bind('click', function() {
    // //     movedown(element, $(this).closest('div[class^="sortitem"]'));
    // //     return false;
    // });
}
