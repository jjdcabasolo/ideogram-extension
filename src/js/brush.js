// HTML DOM changes on brush-related elements
$(document).ready(function() {
    var brushID, xCoordinates = [], isMenuOpen = [];
    
    // BRUSH SETTINGS
    // providing wider space for the overlay of each chromosome
    var count = 0, numChromosomes = 12;
    for(count = 0; count < numChromosomes; count++) {
        isMenuOpen[count] = false;
        $('#brush' + count + ' .background').attr('x', "-26");        
        $('#brush' + count + ' .background').attr('width', (parseFloat($('#brush' + count + ' .background').attr('width')) + parseFloat(54)));        
    }

    // change cursor
    $('.background').css('cursor', 'zoom-in');

    // disappearing / appearing brush
    $('.brush').hover(function(){ 
        $('#' + this.id).css('visibility', 'visible');
    }, function(){ 
        var number = parseInt(this.id.replace(/[^0-9\.]/g, ''), 10);
        if(!isMenuOpen[number]){
            // resets the brush after the brush disappears
            $('.extent').attr('height', '0'); 
        }
    });
    
    // DROPDOWN MENU
    // makes the dropdown be located somewhere outside the user's view
    $('.dynamic-dropdown').attr('transform', 'translate(-100, -100)');

    // add dropdown menu after using the brush
    $('.dynamic-dropdown').wrapInner('<foreignObject width="100" height="500" requiredExtensions="http://www.w3.org/1999/xhtml"><ul class="hover"><li class="hoverli"><ul class="file_menu"><li><a href="#">Show in JBrowse</a></li><li><a href="#">Show statistics</a></li></ul></li></ul></foreignObject>');
    
    // makes the dropdown menu appear when the mouse is hovered on the selection of the brush
    $(".extent").hover(
        function( event ) {
            // make the menu visible
            $('.file_menu').css('display', 'visible');

            // for the foreignobject tag inside the svg tag
            $('.dynamic-dropdown').attr('transform', 'translate(' + (event.pageX-270) + ', ' + (event.pageY-50) + ')'); 
            $('ul.file_menu').stop(true, true).slideDown('medium');

            // makes the brush visible when the mouse is on the menu
            brushID =  $(this).parent().attr('id');
            $('#' + $(this).parent().attr('id')).css('visibility', 'visible');

            var number = parseInt(brushID.replace(/[^0-9\.]/g, ''), 10);
            isMenuOpen[number] = true;
        },
        function() {
        }
    );

    // makes the brush re-appear again when the mouse is on the menu
    $('.dynamic-dropdown').hover(function(){ 
    }, function(){ 
        // make the menu return to nowhere
        $('ul.file_menu').stop(true, true).slideUp('medium');        
        $('.dynamic-dropdown').attr('transform', 'translate(-100, -100)');    

        // resets the brush
        $('.extent').attr('height', '0'); 
    });
});  