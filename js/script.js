let selectedElemet;
let EditAction = 0;
$(document).ready(function () {
    var contextMenu = $("#MenuItems").jqxMenu({ width: '120px',   autoOpenPopup: false, mode: 'popup' });
    var attachContextMenu = function () {
        // open the context menu when the user presses the mouse right button.
        $("#CategoryTree a").on('mousedown', function (event) {
            selectedElemet = $(event.target);
            if (selectedElemet.is('span')) { selectedElemet = selectedElemet.parent()}
            var rightClick = isRightClick(event);
            if (rightClick && selectedElemet != null) {
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
        switch (item) {
            case "Add Item":
                if (selectedElemet != null) {
                    EditAction = 1;
                    $(".modal-title").text('Add New Category');
                    $("#title-text").val('');
                    $("#myModal").modal();
                }
                break;
            case "Edit Item":
                if (selectedElemet != null) {
                    EditAction = 2;
                    $(".modal-title").text('Edit Category');
                    $("#title-text").val(selectedElemet.text().trim());
                    $("#myModal").modal();
                }
                break;
            case "Remove Item":
                if (selectedElemet != null) {
                    var selectedElemetParent = selectedElemet.parent();
                    if (selectedElemetParent.find('a').length - 1 == 0) {  //remove glyphicon if there is no items
                        selectedElemetParent.prev().find('i').remove();
                    }
                    if(selectedElemet.next().is('div'))
                      selectedElemet.next().remove();
                    selectedElemet.remove();
                    attachContextMenu();
                }
                break;
        }
    });
    $("#save").on("click",function(){
        UpdateValue();
    });
    // disable the default browser's context menu.
    $(document).on('contextmenu', function (e) {
        if ($(e.target).parents('#CategoryTree').length > 0) {
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
        var titleText = $('#title-text').val();
        switch (EditAction) {
            case 1: //Add Item
                var nextSelectedElement = selectedElemet.next();
                var selectedForAdd = $(selectedElemet).closest("a");
                if (nextSelectedElement.is('div')){
                    if (nextSelectedElement.find("a").length > 0){
                        nextSelectedElement.append('<a href="#" class="list-group-item"><span>' + titleText + '</span></a>');
                    }
                }else{
                    var uniqueID = 'item-' + Math.floor(Date.now() / 1000);
                    selectedForAdd.attr({'href': '#' + uniqueID,'data-toggle' :'collapse'}).prepend('<i class="glyphicon glyphicon-chevron-right"></i>');
                    selectedForAdd.after('<div class="list-group collapse" id="'+uniqueID+'"> <a href="#" class="list-group-item"><span>' + titleText + ' </span> </a></div>');
                }
                selectedForAdd.next().collapse('show');
                break;
            case 2: //Edit Item
                selectedElemet.find('span').text(titleText );
                break;
        }
        $("#myModal").modal('hide');
        attachContextMenu();
    }
    $('.list-group-item').on('click', function() {
        $('.glyphicon', this)
            .toggleClass('glyphicon-chevron-right')
            .toggleClass('glyphicon-chevron-down');
    });
});
