// HTML DOM changes on brush-related elements
$(document).ready(function() {
    var brushID, xCoordinates = [], isMenuOpen = [], previousBrush = 'some-id-i-used-to-know';
    
    // SVG MENU SETTINGS
    // &+- providing a larger svg for the dropdown menu 
    $('#ideogram').attr('width', '100%');
    $('#ideogram').attr('height', '1200');

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
    $('.dynamic-dropdown').attr('transform', 'translate(300, 300)');

    // &+- add dropdown menu after using the brush
    $('.dynamic-dropdown').wrapInner('<foreignObject width="100" height="500" requiredExtensions="http://www.w3.org/1999/xhtml"><ul class="hover"><li class="hoverli"><ul class="file_menu"><li class="header-menu"><b class="white-text">Options</b></li><li><a href="#">Show in JBrowse</a></li><li><a href="#">Show statistics</a></li><hr id="divider"><li class="header-menu"><b class="white-text">Brush</b></li><li><a href="#" id="brush0" class="identify-the-brush" onclick="deleteThisBrush(this.id)">Delete this brush</a></li><li><a href="#" onclick="deleteAllBrush()">Delete all brush</a></li><hr id="divider"><li class="header-menu"><b class="white-text">Set base pair range</b></li><li><form class="white-text-default"><label for="StartBP">Start:</label><input type="number" name="StartBP" value="startBp" class="inline-textbox" id="startBPTextbox"></form></li><li><form class="white-text-default"><label for="EndBP">End:</label><input type="number" name="EndBP" value="stopBp" class="inline-textbox" id="endBPTextbox"></form></li><li id="range-details"><p class="white-text-smaller" id="chr-name-details"><b class="white-text-smaller" id="chr-name"></b>max:<b class="white-text-smaller" id="chr-name-max"></b><button type="button" id="brush0" class="submit-chr-details" onclick="setTheBrush(this.id)">Submit</button></p></li><li><p class="red-text" id="message-input-menu"></li></ul></li></ul></foreignObject>');
    
    // &+- makes the dropdown menu appear when the mouse is hovered on the selection of the brush
    $(".extent").hover(
        function( event ) {
            brushID = $(this).parent().attr('id');
            
            // &+- used in getting the details for start and end
            if(previousBrush === 'some-id-i-used-to-know') $('#' + previousBrush).attr('id', ('some-id-' + brushID));
            else $('#some-id-' + previousBrush).attr('id', ('some-id-' + brushID));
            previousBrush = brushID;
            
            var number = parseInt(brushID.replace(/[^0-9\.]/g, ''), 10),
                limit = ideogram.chromosomesArray[number].bands[1].bp.stop;
            $('#chr-name').text('chr ' + (number + 1) + ' | ');
            $('#chr-name-max').text(' ' + limit);

            // &+- make the menu visible
            $('.file_menu').css('display', 'visible');

            // &+- for the foreignObjectobject tag inside the svg tag
            $('.dynamic-dropdown').attr('transform', 'translate(' + (event.pageX-270) + ', ' + (event.pageY-50) + ')'); 
            $('ul.file_menu').stop(true, true).slideDown('medium');

            // &+- add the brush id to the anchor tag (used in brush deletion and submission of coordinates)
            $('.identify-the-brush').attr('id', brushID); 
            $('.submit-chr-details').attr('id', brushID); 

            // &+- makes the brush visible when the mouse is on the menu
            $('#' + $(this).parent().attr('id')).css('visibility', 'visible');

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

        // &+- clear form contents
        $('#startBPTextbox').val('');
        $('#endBPTextbox').val('');

        // &+- reset colors
        $('#startBPTextbox').css('background-color', 'white');
        $('#startBPTextbox').css('color', 'black');

        $('#endBPTextbox').css('background-color', 'white');
        $('#endBPTextbox').css('color', 'black');

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
    $('.dynamic-dropdown').attr('transform', 'translate(300, 300)');   
}

// &+- this just resets the brush and makes the menu disappear [selected brush]
function deleteThisBrush(brush){
    var brushToChange = '#' + brush + ' > .extent';
    $(brushToChange).attr('height', '0');
    $('ul.file_menu').stop(true, true).slideUp('medium');        
    $('.dynamic-dropdown').attr('transform', 'translate(300, 300)');  
}

function setTheBrush(brushIndex){
    var start = $('#startBPTextbox').val();
    var end = $('#endBPTextbox').val();

    // &+- empty input fields
    if(start === '' && end === ''){
        $('#startBPTextbox').css('background-color', '#EF5350');
        $('#startBPTextbox').css('color', '#EEEEEE');
        $('#endBPTextbox').css('background-color', '#EF5350');
        $('#endBPTextbox').css('color', '#EEEEEE');

        $('#message-input-menu').text('Empty input field for start and end range.');
        $('#message-input-menu').css('color', '#EF5350');        

    }
    else if(start === ''){
        $('#startBPTextbox').css('background-color', '#EF5350');
        $('#startBPTextbox').css('color', '#EEEEEE');
        $('#endBPTextbox').css('background-color', 'white');
        $('#endBPTextbox').css('color', 'black');

        $('#message-input-menu').text('Empty input field for start range.');
        $('#message-input-menu').css('color', '#EF5350');        

    }
    else if(end === ''){
        $('#startBPTextbox').css('background-color', 'white');
        $('#startBPTextbox').css('color', 'black');
        $('#endBPTextbox').css('background-color', '#EF5350');
        $('#endBPTextbox').css('color', '#EEEEEE');

        $('#message-input-menu').text('Empty input field for end range.');
        $('#message-input-menu').css('color', '#EF5350');        

    }
    else{
        // &+- the input range is invalid
        if(parseInt(start, 10) > parseInt(end, 10) && start.length > 0  && end.length > 0){
            $('#startBPTextbox').css('background-color', '#EF6C00');
            $('#startBPTextbox').css('color', '#EEEEEE');
            $('#endBPTextbox').css('background-color', '#EF6C00');
            $('#endBPTextbox').css('color', '#EEEEEE');

            $('#message-input-menu').text('Invalid range. Please check your start and end base pairs.');        
            $('#message-input-menu').css('color', '#EF6C00');        
        }
        else{
            // &+- the user has encountered no errors
            $('#startBPTextbox').css('background-color', 'white');
            $('#startBPTextbox').css('color', 'black');
            $('#endBPTextbox').css('background-color', 'white');
            $('#endBPTextbox').css('color', 'black');

            $('#message-input-menu').text('');        

            var count = parseInt(brushIndex.replace(/[^0-9\.]/g, ''), 10);
            var brushdelete = arrayOfBrushes[count];

            // &+- clears the brush first
            d3.select('#' + brushIndex).call(brushdelete.clear());

            // &+- then recreates it with the specified end and start values
            d3.select('#' + brushIndex).call(brushdelete.extent([parseInt(start, 10), parseInt(end, 10)]));
        }
    }
} 