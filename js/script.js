let selectedElemet;
let EditAction = 0;
$(document).ready(function () {
    // Create Category Tree
    $('#CategoryTree').jqxTree({ height: '800px', width: '300px', theme: 'material', toggleMode: 'click' });
    $('#CategoryTree').css('visibility', 'visible');
    var contextMenu = $("#MenuItems").jqxMenu({ width: '120px',   autoOpenPopup: false, mode: 'popup' });
    var attachContextMenu = function () {
        // open the context menu when the user presses the mouse right button.
        $("#CategoryTree li").on('mousedown', function (event) {
            var target = $(event.target).parents('li:first')[0];
            var rightClick = isRightClick(event);
            if (rightClick && target != null) {
                $("#CategoryTree").jqxTree('selectItem', target);
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
                return false;
            }
        });
    }
    attachContextMenu();
    $("#MenuItems").on('itemclick', function (event) {
        var item = $.trim($(event.args).text());
        var selectedItem = $('#CategoryTree').jqxTree('selectedItem');
        selectedElemet = selectedItem.element;
        switch (item) {
            case "Add Item":
                if (selectedItem != null) {
                    EditAction = 1;
                    $(".modal-title").text('Add New Category');
                    $("#title-text").val('');
                    $("#myModal").modal();
                }
                break;
            case "Edit Item":
                if (selectedItem != null) {
                    EditAction = 2;
                    $(".modal-title").text('Edit Category');
                    $("#title-text").val($(selectedItem.element).find('div').first().text());
                    $("#myModal").modal();
                }
                break;
            case "Remove Item":
                if (selectedItem != null) {
                    $('#CategoryTree').jqxTree('removeItem', selectedItem.element);
                    attachContextMenu();
                }
                break;
        }
    });
    $("#save").click(function() {
        UpdateValue();
    });
    // disable the default browser's context menu.
    $(document).on('contextmenu', function (e) {
        if ($(e.target).parents('.jqx-tree').length > 0) {
            return false;
        }
        return true;
    });
    function isRightClick(event) {
        var rightclick;
        if (!event) var event = window.event;
        if (event.which) rightclick = (event.which == 3);
        else if (event.button) rightclick = (event.button == 2);
        return rightclick;
    }
    function UpdateValue() {
        switch (EditAction) {
            case 1:
                $('#CategoryTree').jqxTree('addTo', { label: $('#title-text').val() }, selectedElemet);
                $('#CategoryTree').jqxTree('expandItem', selectedElemet);
                break;
            case 2:
                $('#CategoryTree').jqxTree('updateItem', selectedElemet, { label: $('#title-text').val() });
                break;
        }
        $("#myModal").modal('hide');
        attachContextMenu();
    }
});
