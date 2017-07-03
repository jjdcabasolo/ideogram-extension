// HTML DOM changes on brush-related elements
$(document).ready(function() {
    var brushID, xCoordinates = [], isMenuOpen = [];
    
    // BRUSH SETTINGS
    // &+- providing wider space for the overlay of each chromosome
    var count = 0, numChromosomes = 12;
    for(count = 0; count < numChromosomes; count++) {
        isMenuOpen[count] = false;
        $('#brush' + count + ' .background').attr('x', "-26");        
        $('#brush' + count + ' .background').attr('width', (parseFloat($('#brush' + count + ' .background').attr('width')) + parseFloat(54)));        
    }

    // &+- change cursor
    $('.background').css('cursor', 'zoom-in');

    // &+- disappearing / appearing brush
    $('.brush').hover(function(){ 
        $('#' + this.id).css('visibility', 'visible');
    }, function(){ 
    });
    
    // DROPDOWN MENU
    // &+- makes the dropdown be located somewhere outside the user's view
    $('.dynamic-dropdown').attr('transform', 'translate(-200, -200)');

    // &+- add dropdown menu after using the brush
    $('.dynamic-dropdown').wrapInner('<foreignObject width="100" height="500" requiredExtensions="http://www.w3.org/1999/xhtml"><ul class="hover"><li class="hoverli"><ul class="file_menu"><li><b class="white-text">Options</b></li><li><a href="#">Show in JBrowse</a></li><li><a href="#">Show statistics</a></li><hr id="divider"><li><b class="white-text">Brush</b></li><li><a href="#" id="brush0" class="identifyTheBrush" onclick="deleteThisBrush(this.id)">Delete this brush</a></li><li><a href="#" onclick="deleteAllBrush()">Delete all brush</a></li></ul></li></ul></foreignObject>');
    
    // &+- makes the dropdown menu appear when the mouse is hovered on the selection of the brush
    $(".extent").hover(
        function( event ) {
            brushID =  $(this).parent().attr('id');
            
            // &+- make the menu visible
            $('.file_menu').css('display', 'visible');

            // &+- for the foreignObjectobject tag inside the svg tag
            $('.dynamic-dropdown').attr('transform', 'translate(' + (event.pageX-270) + ', ' + (event.pageY-50) + ')'); 
            $('ul.file_menu').stop(true, true).slideDown('medium');

            // &+- add the brush id to the anchor tag shit
            $('.identifyTheBrush').attr('id', brushID); 

            // &+- makes the brush visible when the mouse is on the menu
            $('#' + $(this).parent().attr('id')).css('visibility', 'visible');

            var number = parseInt(brushID.replace(/[^0-9\.]/g, ''), 10);
            isMenuOpen[number] = true;
        },
        function() {
        }
    );

    // &+- makes the brush re-appear again when the mouse is on the menu
    $('.dynamic-dropdown').hover(function(){ 
    }, function(){ 
        // &+- make the menu return to nowhere
        $('ul.file_menu').stop(true, true).slideUp('medium');        
        $('.dynamic-dropdown').attr('transform', 'translate(-200, -200)');    
    });

    // &+- TODO: multiple brushes
    // $('#brush0').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 0)});
    // $('#brush1').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 1)});
    // $('#brush2').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 2)});
    // $('#brush3').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 3)});
    // $('#brush4').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 4)});
    // $('#brush5').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 5)});
    // $('#brush6').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 6)});
    // $('#brush7').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 7)});
    // $('#brush8').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 8)});
    // $('#brush9').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 9)});
    // $('#brush10').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 10)});
    // $('#brush11').mouseenter(function(){console.log("creating another"); createAnotherBrush(0, 0, 11)});
});  

// &+- this just resets the brush and makes the menu disappear [all brushes]
function deleteAllBrush(){
    $('.extent').attr('height', '0');
    $('ul.file_menu').stop(true, true).slideUp('medium');        
    $('.dynamic-dropdown').attr('transform', 'translate(-200, -200)');   
}

// &+- this just resets the brush and makes the menu disappear [selected brush]
function deleteThisBrush(brush){
    var brushToChange = '#' + brush + ' > .extent';
    $(brushToChange).attr('height', '0');
    $('ul.file_menu').stop(true, true).slideUp('medium');        
    $('.dynamic-dropdown').attr('transform', 'translate(-200, -200)');  
}