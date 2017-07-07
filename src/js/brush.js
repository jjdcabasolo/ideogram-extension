// HTML DOM changes on brush-related elements
var brushID, xCoordinates = [], isMenuOpen = [], previousBrush = 'some-id-i-used-to-know', brushExtent = [];

function adjustIdeogramSVG(){
    // &+- providing a larger svg for the dropdown menu 
    $('#ideogram').attr('width', '1000');
    $('#ideogram').attr('height', '1200');
}

function widenBrush(){
    // &+- providing wider space for the overlay of each chromosome
    var count = 0, numChromosomes = 12;
    for(count = 0; count < numChromosomes; count++) {
        isMenuOpen[count] = false;
        $('#brush' + count + ' .background').attr('x', '-26');        
        $('#brush' + count + ' .background').attr('width', '78.5');        
    }

    // &+- change cursor
    $('.background').css('cursor', 'zoom-in');
}

function dropdownMenuSetup(){
    // &+- makes the dropdown be located somewhere outside the user's view
    $('.dynamic-dropdown').attr('transform', 'translate(-300, -300)');

    // &+- add dropdown menu after using the brush
    $('.dynamic-dropdown').wrapInner('<foreignObject width="100" height="500" requiredExtensions="http://www.w3.org/1999/xhtml"><ul class="hover"><li class="hoverli"><ul class="file_menu"><li class="header-menu"><b class="white-text">Options</b></li><li><a href="#" id="brush0" class="show-jbrowse" onclick="redirectToJBrowse(this.id)">Show in JBrowse</a></li><li><a href="#" onclick="showStatiscalTable()">Show statistics</a></li><li><a href="#" onclick="plotGeneAnnotation()">Plot all genes</a></li><hr id="divider"><li class="header-menu"><b class="white-text">Brush</b></li><li><a href="#" id="brush0" class="identify-the-brush" onclick="deleteThisBrush(this.id)">Delete this brush</a></li><li><a href="#" onclick="deleteAllBrush()">Delete all brush</a></li><hr id="divider"><li class="header-menu"><b class="white-text">Set base pair range</b></li><li><form class="white-text-default"><label for="StartBP">Start:</label><input type="number" name="StartBP" value="startBp" class="inline-textbox" id="startBPTextbox"></form></li><li><form class="white-text-default"><label for="EndBP">End:</label><input type="number" name="EndBP" value="stopBp" class="inline-textbox" id="endBPTextbox"></form></li><li id="range-details"><p class="white-text-smaller" id="chr-name-details"><b class="white-text-smaller" id="chr-name"></b>max:<b class="white-text-smaller" id="chr-name-max"></b><button type="button" id="brush0" class="submit-chr-details" onclick="setTheBrush(this.id)">Submit</button></p></li><li><p class="red-text" id="message-input-menu"></li></ul></li></ul></foreignObject>');
    
    // &+- makes the dropdown menu appear when the mouse is hovered on the selection of the brush
    $(".extent").hover(
        function( event ) {
            brushID = $(this).parent().attr('id');
            
            // &+- used in getting the details for start and end
            if(previousBrush === 'some-id-i-used-to-know') $('#' + previousBrush).attr('id', ('some-id-' + brushID));
            else $('#some-id-' + previousBrush).attr('id', ('some-id-' + brushID));
            previousBrush = brushID;

            // &+- makes the show in JBrowse unable to click
            var countingTrue = 0;
            for (var i = 0; i < ideogram.numChromosomes; i++) {
                if(isBrushActive[i]) countingTrue++;
            }
            if(countingTrue > 1){
                // &+- make it inactive
                $('.show-jbrowse').attr('class', 'inactive-link show-jbrowse'); 
            }
            else{
                // &+- make it active again
                $('.show-jbrowse').attr('class', 'active-link show-jbrowse');                 
            }

            // &+- displays the current chromosome name in the bottom of the menu
            var number = parseInt(brushID.replace(/[^0-9\.]/g, ''), 10),
                limit = ideogram.chromosomesArray[number].bands[1].bp.stop;
            $('#chr-name').text('chr ' + (number + 1) + ' | ');
            $('#chr-name-max').text(' ' + limit);

            // &+- displays the current base pairs on focus
            $('#startBPTextbox').val(selectedRegion[number].from);
            $('#endBPTextbox').val(selectedRegion[number].to);

            // &+- make the menu visible
            $('.file_menu').css('display', 'visible');

            // &+- for the foreignObjectobject tag inside the svg tag
            $('.dynamic-dropdown').attr('transform', 'translate(' + (event.pageX-270) + ', ' + (event.pageY-50) + ')'); 
            $('ul.file_menu').stop(true, true).slideDown('medium');

            // &+- add the brush id to the anchor tag (used in brush deletion and submission of coordinates)
            $('.identify-the-brush').attr('id', brushID); 
            $('.submit-chr-details').attr('id', brushID); 
            $('.show-jbrowse').attr('id', brushID); 

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
        $('#message-input-menu').text('');        

        // &+- reset colors
        $('#startBPTextbox').css('background-color', 'white');
        $('#startBPTextbox').css('color', 'black');

        $('#endBPTextbox').css('background-color', 'white');
        $('#endBPTextbox').css('color', 'black');
    });
}

$(document).ready(function() {    
    // SVG MENU SETTINGS
    adjustIdeogramSVG();

    // BRUSH SETTINGS
    widenBrush();

    // DROPDOWN MENU
    dropdownMenuSetup();

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

// &+- makes the JBrowse appear with the set coordinates
function redirectToJBrowse(brush){
    var number = (parseInt(brush.replace(/[^0-9\.]/g, ''), 10) + 1),
        startBP = $('#startBPTextbox').val(),
        endBP = $('#endBPTextbox').val(),
        pathname = 'http://172.29.4.215:8080/jbrowse-dev2/',           
        chrLocation,         
        extent = startBP + '..' + endBP,
        footer = '&tracks=DNA';

    if(number < 10){
        chrLocation = '?loc=chr0' + number + '%3A';
    } else {
        chrLocation = '?loc=chr' + number + '%3A';
    }

    $('#jbrowse').prop('src', pathname + chrLocation + extent + footer);
    $('#jbrowse').show();
}

// &+- this just resets the brush and makes the menu disappear [all brushes]
function deleteAllBrush(){
    $('.extent').attr('height', '0');
    $('ul.file_menu').stop(true, true).slideUp('medium');        

    // &+- makes the brush inactive in the back end
    for (var i = 0; i < ideogram.numChromosomes; i++) {
        isBrushActive[i] = false;
    }
}

// &+- this just resets the brush and makes the menu disappear [selected brush]
function deleteThisBrush(brush){
    var brushToChange = '#' + brush + ' > .extent';
    $(brushToChange).attr('height', '0');
    $('ul.file_menu').stop(true, true).slideUp('medium');        

    // &+- makes the brush inactive in the back end
    isBrushActive[parseInt(brush.replace(/[^0-9\.]/g, ''), 10)] = false;
}

// &+- setting the brush extent by inputting start and end coordinates
function setTheBrush(brush){
    var start = $('#startBPTextbox').val(),
        end = $('#endBPTextbox').val(),
        number = parseInt(brush.replace(/[^0-9\.]/g, ''), 10),
        limit = ideogram.chromosomesArray[number].bands[1].bp.stop;

    // &+- FORM CHECKING
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
        else if(parseInt(end, 10) > limit){
            // &+- upper range is more than the upper boundary
            $('#startBPTextbox').css('background-color', 'white');
            $('#startBPTextbox').css('color', 'black');
            $('#endBPTextbox').css('background-color', '#FF5722');
            $('#endBPTextbox').css('color', '#EEEEEE');

            $('#message-input-menu').text('The end range exceeded the chromosome length.');        
            $('#message-input-menu').css('color', '#FF5722');      
        }
        else{
            // &+- the user had encountered no error/s
            $('#startBPTextbox').css('background-color', 'white');
            $('#startBPTextbox').css('color', 'black');
            $('#endBPTextbox').css('background-color', 'white');
            $('#endBPTextbox').css('color', 'black');

            $('#message-input-menu').text('');        

            var count = parseInt(brush.replace(/[^0-9\.]/g, ''), 10);
            var brushdelete = arrayOfBrushes[count];

            // &+- clears the brush first
            d3.select('#' + brush).call(brushdelete.clear());

            // &+- then recreates it with the specified end and start values
            d3.select('#' + brush).call(brushdelete.extent([parseInt(start, 10), parseInt(end, 10)]));
        }
    }
} 

// &+- make the table that will contain the data (the whole gene)
function showStatiscalTable(table){

    $('#gene-table-content').empty();

    var pathname = "http://172.29.4.215:8080/iric-portal/ws/genomics/gene/osnippo/",                     
        start = 'start=' + $('#startBPTextbox').val() + '&',
        end = 'end=' + $('#endBPTextbox').val(),
        isHeaderPresent = false,
        spinnerConfig = {
            lines: 9,
            length: 9,
            width: 14,
            radius: 20,
            scale: 1,
            corners: 1,
            color: '#000',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            className: 'gt-spinner',
            top: '20%',
            left: '50%',
            shadow: true,
            hwaccel: false,
            position: 'absolute'
        },
        buffering = document.getElementById("gt-div"),
        spinner = new Spinner(spinnerConfig).spin(buffering),
        chrNum, webService, extent, from, to, arrayCatch, myList;

    for (var i = 0; i < ideogram.numChromosomes; i++) {
        if(isBrushActive[i]){
            if (i < 10) {
                chrNum = "chr0" + (i+1) + "?";
            } else {
                chrNum = "chr" + (i+1) + "?";
            }

            // &+- get the extent of the active brushes
            extent = arrayOfBrushes[i].extent(),
            from = Math.floor(extent[0]),
            to = Math.ceil(extent[1]);

            start = 'start=' + from + '&';
            end = 'end=' + to;

            // snp-seek.irri.org -> 172.29.4.215:8080/iric-portal
            // http://snp-seek.irri.org/ws/genomics/gene/osnippo/chr06?start=1&end=100000        
            webService = pathname + chrNum + start + end;
    
            $.ajax({
                dataType: "json",
                crossDomain: true,
                url: webService,
                data: arrayCatch,
                success: function(arrayCatch) {
                    buildHtmlTable(arrayCatch, "#gene-table-content");    
                    toggleSpinner(spinner, false);
                    isHeaderPresent = true;
                }
            });

        }
    }

    // &+- code snippet for converting JSON to HTML table. thank you https://stackoverflow.com/a/11480797
    // Builds the HTML Table out of myList.
    function buildHtmlTable(myList, selector) {
        var columns = addAllColumnHeaders(myList, selector, isHeaderPresent),
            tBodyProper = $('<tbody/>');

        for(var i = 0; i < myList.length; i++) {
            var row = $('<tr/>');
            for(var colIndex = 0; colIndex < columns.length; colIndex++) {
                var cellValue = myList[i][columns[colIndex]];
                if(cellValue == null){
                    row.append($('<td/>').html(""));
                }
                else{
                    var stringValue = String(cellValue);
                    stringValue = stringValue.replace(/,/g, '<br>');
                    row.append($('<td/>').html(stringValue));
                }
            }
            if(!isHeaderPresent){
                $(tBodyProper).append(row);
            }
            else{
                $(selector + ' tBody').append(row);            
            }
        }

        if(!isHeaderPresent){
            $(selector).append(tBodyProper);
        }
    }

    // Adds a header row to the table and returns the set of columns.
    // Need to do union of keys from all records as some records may not contain
    // all records.
    function addAllColumnHeaders(myList, selector, isHeaderPresent) {
        var columnSet = [];
        var headerTr = $('<tr/>');
        var tHeadProper = $('<thead/>');

        for (var i = 0; i < myList.length; i++) {
            var rowHash = myList[i];
            for (var key in rowHash) {
                if ($.inArray(key, columnSet) == -1) {
                    columnSet.push(key);
                    headerTr.append($('<th/>').html(key));
                }
            }
        }

        if(!isHeaderPresent){
            $(tHeadProper).append(headerTr);
            $(selector).append(tHeadProper);        
        }

        return columnSet;
    }
}

function plotGeneAnnotation(){
    // &+- transforming to a 
    var pathname = "http://172.29.4.215:8080/iric-portal/ws/genomics/gene/osnippo/",                     
        start = 'start=' + $('#startBPTextbox').val() + '&',
        end = 'end=' + $('#endBPTextbox').val(),
        compiledAnnots = [],
        annotObject = {},
        annotArray = [],
        spinnerConfig = {
            lines: 9,
            length: 9,
            width: 14,
            radius: 20,
            scale: 1,
            corners: 1,
            color: '#000',
            opacity: 0.25,
            rotate: 0,
            direction: 1,
            speed: 1,
            trail: 60,
            fps: 20,
            zIndex: 2e9,
            className: 'spinner',
            top: '20%',
            left: '25%',
            shadow: true,
            hwaccel: false,
            position: 'absolute'
        },
        buffering = document.getElementById("chromosome-render"),
        spinner = new Spinner(spinnerConfig).spin(buffering);
        // count = 0;

    for (var i = 0; i < ideogram.numChromosomes; i++) {
        if(isBrushActive[i]){
            if (i < 10) {
                chrNum = "chr0" + (i+1) + "?";
                annotObject["chr"] = (i+1);
            } else {
                chrNum = "chr" + (i+1) + "?";
                annotObject["chr"] = (i+1);
            }

            // &+- get the extent of the active brushes
            extent = arrayOfBrushes[i].extent(),
            from = Math.floor(extent[0]),
            to = Math.ceil(extent[1]);

            start = 'start=' + from + '&';
            end = 'end=' + to;

            // snp-seek.irri.org -> 172.29.4.215:8080/iric-portal
            // http://snp-seek.irri.org/ws/genomics/gene/osnippo/chr06?start=1&end=100000        
            webService = pathname + chrNum + start + end;

            d3.json(webService, function (error, data) {
                data.forEach(function (d) {
                    var annotContent = [
                        (d.uniquename + ' | ' + d.description),
                        d.fmin,
                        d.fmin - d.fmax
                    ];
                    compiledAnnots.push(annotContent);
                });
                annotObject["annots"] = compiledAnnots;
                annotArray.push(annotObject);
                console.log(annotArray);
                var keys = ["name", "start", "length"];
                var rawAnnots = { "keys": keys, "annots": annotArray };
                var processedAnnots = ideogram.processAnnotData(rawAnnots);
                console.log(processedAnnots);
                toggleSpinner(spinner, false);
            });
    
            // $.ajax({
            //     dataType: "json",
            //     crossDomain: true,
            //     url: webService,
            //     data: arrayCatch,
            //     success: function(arrayCatch) {


            //     }
            // });

        }
    }



        // for (j = 0; j < compiledAnnots.length; j++) {
        // }

    // annotObject = "{ chr: '" + chrNum + "', " + "annots: " + annotContent + " }";
    // var json = JSON.stringify(eval("(" + annotObject + ")"));


    // 0: "chr11"
    // 1: 28983108
    // 2: 2595
    // 3: 1
}

// asyncLoop({
//     length: 13,
//     functionToLoop: function(loop, i) {
//         setTimeout(function() {
//             getJsonData(trackDataUrls[i - 1],
//                 function(trackData, tdUrl) {
//                     /* if featureCount is not 0 */
//                     // console.log(trackData.featureCount);
//                     if (trackData.featureCount) {
//                         var data = trackData.intervals.nclist,
//                             len = data.length,
//                             obj = {};

//                         /* perform async again */
//                         if (data[0].length == 4) {
//                             data = [];

//                             /* get initial file path */
//                             var newUrl = tdUrl.replace("/trackData.json", "");

//                             /* get lf-<num> urls */
//                             populateLfUrls(newUrl, len, i);

//                         } else {
//                             obj["chrNum"] = i;
//                             obj["data"] = data;
//                             traitData.push(obj);
//                         }
//                     }
//                 }
//             );
//             loop();
//         }, 100);
//     },
//     callback: function() {

//         /* if other json files need to be accessed to retrieve data */
//         if (lfUrls.length) {
//             for (k = 0; k < 12; k++) {
//                 var lfData, obj = {};
//                 for (j = 0; j < lfUrls.length; j++) {
//                     if (lfUrls[j][1] == k + 1) {
//                         $.ajax({
//                             dataType: "json",
//                             async: false,
//                             url: lfUrls[j][0],
//                             data: lfData,
//                             success: function(lfData) {
//                                 tempData.push.apply(tempData, lfData);
//                             }
//                         });
//                     }
//                 }
//                 obj["chrNum"] = k + 1;
//                 obj["data"] = tempData;
//                 traitData.push(obj);
//                 tempData = [];
//             }
//         }

//         lfUrls = [];

//         config.rawAnnots = reformatTraitData(selectedTrack);
//         config.selectedTrack = selectedTrack;
//         config.allTracks = allTracks;
//         toggleSpinner(spinner, false);

//         ideogram = new Ideogram(config);
//         // &+- providing a larger svg for the dropdown menu 
//         $('#ideogram').attr('width', '1000');
//         $('#ideogram').attr('height', '1200');

//         // &+- change cursor
//         $('.background').css('cursor', 'zoom-in');

//         // &+- makes the dropdown be located somewhere outside the user's view
//         $('.dynamic-dropdown').attr('transform', 'translate(-300, -300)');

//         // &+- add dropdown menu after using the brush
//         $('.dynamic-dropdown').wrapInner('<foreignObject width="100" height="500" requiredExtensions="http://www.w3.org/1999/xhtml"><ul class="hover"><li class="hoverli"><ul class="file_menu"><li class="header-menu"><b class="white-text">Options</b></li><li><a href="#" id="brush0" class="show-jbrowse" onclick="redirectToJBrowse(this.id)">Show in JBrowse</a></li><li><a href="#" onclick="showStatiscalTable()">Show statistics</a></li><li><a href="#" onclick="plotGeneAnnotation()">Plot all genes</a></li><hr id="divider"><li class="header-menu"><b class="white-text">Brush</b></li><li><a href="#" id="brush0" class="identify-the-brush" onclick="deleteThisBrush(this.id)">Delete this brush</a></li><li><a href="#" onclick="deleteAllBrush()">Delete all brush</a></li><hr id="divider"><li class="header-menu"><b class="white-text">Set base pair range</b></li><li><form class="white-text-default"><label for="StartBP">Start:</label><input type="number" name="StartBP" value="startBp" class="inline-textbox" id="startBPTextbox"></form></li><li><form class="white-text-default"><label for="EndBP">End:</label><input type="number" name="EndBP" value="stopBp" class="inline-textbox" id="endBPTextbox"></form></li><li id="range-details"><p class="white-text-smaller" id="chr-name-details"><b class="white-text-smaller" id="chr-name"></b>max:<b class="white-text-smaller" id="chr-name-max"></b><button type="button" id="brush0" class="submit-chr-details" onclick="setTheBrush(this.id)">Submit</button></p></li><li><p class="red-text" id="message-input-menu"></li></ul></li></ul></foreignObject>');
        
//         // &+- makes the dropdown menu appear when the mouse is hovered on the selection of the brush
//         $(".extent").hover(
//             function( event ) {
//                 brushID = $(this).parent().attr('id');
                
//                 // &+- used in getting the details for start and end
//                 if(previousBrush === 'some-id-i-used-to-know') $('#' + previousBrush).attr('id', ('some-id-' + brushID));
//                 else $('#some-id-' + previousBrush).attr('id', ('some-id-' + brushID));
//                 previousBrush = brushID;

//                 // &+- makes the show in JBrowse unable to click
//                 var countingTrue = 0;
//                 for (var i = 0; i < ideogram.numChromosomes; i++) {
//                     if(isBrushActive[i]) countingTrue++;
//                 }
//                 if(countingTrue > 1){
//                     // &+- make it inactive
//                     $('.show-jbrowse').attr('class', 'inactive-link show-jbrowse'); 
//                 }
//                 else{
//                     // &+- make it active again
//                     $('.show-jbrowse').attr('class', 'active-link show-jbrowse');                 
//                 }

//                 // &+- displays the current chromosome name in the bottom of the menu
//                 var number = parseInt(brushID.replace(/[^0-9\.]/g, ''), 10),
//                     limit = ideogram.chromosomesArray[number].bands[1].bp.stop;
//                 $('#chr-name').text('chr ' + (number + 1) + ' | ');
//                 $('#chr-name-max').text(' ' + limit);

//                 // &+- displays the current base pairs on focus
//                 $('#startBPTextbox').val(selectedRegion[number].from);
//                 $('#endBPTextbox').val(selectedRegion[number].to);

//                 // &+- make the menu visible
//                 $('.file_menu').css('display', 'visible');

//                 // &+- for the foreignObjectobject tag inside the svg tag
//                 $('.dynamic-dropdown').attr('transform', 'translate(' + (event.pageX-270) + ', ' + (event.pageY-50) + ')'); 
//                 $('ul.file_menu').stop(true, true).slideDown('medium');

//                 // &+- add the brush id to the anchor tag (used in brush deletion and submission of coordinates)
//                 $('.identify-the-brush').attr('id', brushID); 
//                 $('.submit-chr-details').attr('id', brushID);
//                 $('.show-jbrowse').attr('id', brushID);  

//                 // &+- makes the brush visible when the mouse is on the menu
//                 $('#' + $(this).parent().attr('id')).css('visibility', 'visible');

//                 isMenuOpen[number] = true;
//             },
//             function() {
//             }
//         );

//         // &+- makes the brush re-appear again when the mouse is on the menu
//         $('.dynamic-dropdown').hover(function(){ 
//         }, function(){ 
//             // &+- make the menu return to nowhere
//             $('ul.file_menu').stop(true, true).slideUp('medium');        

//             // &+- clear form contents
//             $('#startBPTextbox').val('');
//             $('#endBPTextbox').val('');
//             $('#message-input-menu').text('');        

//             // &+- reset colors
//             $('#startBPTextbox').css('background-color', 'white');
//             $('#startBPTextbox').css('color', 'black');

//             $('#endBPTextbox').css('background-color', 'white');
//             $('#endBPTextbox').css('color', 'black');
//         });

//         return ideogram;
//     }
// });