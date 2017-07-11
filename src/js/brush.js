// HTML DOM changes on brush-related elements
var brushID, xCoordinates = [], isMenuOpen = [], previousBrush = 'some-id-i-used-to-know', brushExtent = [], arrayOfColorsBrushes = [];

function adjustIdeogramSVG(){
    // &+- providing a larger svg for the dropdown menu 
    $('#ideogram').attr('width', '1200');
    $('#ideogram').attr('height', '1200');
    
    // &+- change cursor
    $('.background').css('cursor', 'zoom-in');
}

function dropdownMenuSetup(){
    // &+- makes the dropdown be located somewhere outside the user's view
    $('.dynamic-dropdown').attr('transform', 'translate(300, 300)');

    // &+- add dropdown menu after using the brush
    $('.dynamic-dropdown').wrapInner(dropdownMenuForm);
    
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

    // DROPDOWN MENU
    dropdownMenuSetup();

    // thank you https://stackoverflow.com/a/10905506 for this wonderful just-press-enter-at-the-search-box-to-search technique
    $('#search-keyword').bind("keypress", {}, keypressInBox);
    function keypressInBox(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode                        
            e.preventDefault();
            triggerSearchBox();
        }
    };
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
    $('.show-genes').attr('class', 'inactive-link show-genes'); 
    $("html, body").animate({ scrollTop: $(document).height(), scrollLeft: 0 }, "slow");
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
            if (i < 9) {
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
            console.log(webService);
            $.ajax({
                dataType: "json",
                crossDomain: true,
                url: webService,
                data: arrayCatch,
                success: function(arrayCatch) {
                    buildHtmlTable(arrayCatch, "#gene-table-content");  
                    $('.show-genes').attr('class', 'active-link show-genes');                   
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

var annotObject = {}, annotArray = [], activeURLs = 0, counterURLs = 0, brushSelectionAnnot = 0, brushSelectionAnnotArray = [], isCheckboxPresent = false;

// &+- generate the links for each chromosome using the brush extent as the start and end values
function generateGeneAnnotURLs(geneAnnotArrayURL){
    var chrNum,
        pathname = "http://172.29.4.215:8080/iric-portal/ws/genomics/gene/osnippo/",                     
        start = 'start=' + $('#startBPTextbox').val() + '&',
        end = 'end=' + $('#endBPTextbox').val();

    for (var i = 0; i < ideogram.numChromosomes; i++) {
        if(isBrushActive[i]){
            activeURLs = activeURLs + 1;
            console.log("active brush " + (i+1));
            if (i < 9) {
                chrNum = "chr0" + (i+1) + "?";
            } else {
                chrNum = "chr" + (i+1) + "?";
            }

            var extent = arrayOfBrushes[i].extent(),
                from = Math.floor(extent[0]),
                to = Math.ceil(extent[1]),
                start = 'start=' + from + '&',
                end = 'end=' + to,
                webService = pathname + chrNum + start + end;

            geneAnnotArrayURL[i] = webService;
        }
        else{
            geneAnnotArrayURL[i] = null;
        }
    }

    return geneAnnotArrayURL;
}

// &+- process the annotations and put it in an object that can be processed by ideogram.js
function processCollectedAnnots(webService, func) {
    d3.json(webService, function(error, data) {
        if(error){
            func(null);
        }
        else{
            if(data.length <= 0){
                func(null);
            }
            else{
                var compiledAnnots = [], getNumber = true;
                data.forEach(function(d){
                    var annotContent = [
                        (d.uniquename + '\n' + d.description),
                        d.fmin,
                        d.fmax - d.fmin,
                        allTracksCount,
                        d.contig
                    ];
                    compiledAnnots.push(annotContent);
                    if(getNumber){
                        var number = parseInt(String(d.contig).replace(/[^0-9\.]/g, ''), 10);
                        annotObject["chr"] = number;
                        getNumber = !getNumber;
                    }
                });
                annotObject["annots"] = compiledAnnots;
                annotArray.push(annotObject);

                var keys = ["name", "start", "length", "trackIndex", "chrName"];
                var rawAnnots = { "keys": keys, "annots": annotArray };
                var processedAnnots = ideogram.processAnnotData(rawAnnots);

                func(processedAnnots);
            }
        }
    });
}

// &=- insertion to the brush selection checkbox element
function appendCheckbox(){
    var open_tag = "<li>",
        close_tag = "</li>",
        attr = '<input type="checkbox" onclick="toggleFilter(this)"',
        label = "",
        id = "",
        colorBlock = '<div class="color-block" id="color-block-' + (brushSelectionAnnot) + '"></div>';

    var item,
        id = 'brush-selection-' + brushSelectionAnnot;
        label = "<label for='" + id + "'>" + colorBlock + id + "</label>";

    attr = attr + 'id="' + id + '" tracks="' + id + '"></input>';
    item = open_tag + attr + label + close_tag;

    $(item).appendTo("#brush-slct");
    $('#color-block' + (brushSelectionAnnot+100)).css({"outline-color": arrayOfColorsBrushes[brushSelectionAnnot], "background-color": arrayOfColorsBrushes[brushSelectionAnnot]});    
    brushSelectionAnnot = brushSelectionAnnot + 1;
    $('#' + id).prop('checked', true);
}

// &+- creation of the checkbox element (created when a user clicks "Plot all genes option")
function brushSelectionCheckbox(){
    $.getJSON('/ideogram-extension/data/filter/brushSelection.json', function(data) {
        var list_items = [],
            html_wrapper = "<" + data['html']['type'] + "/>",
            html_label = "<" + data['html']['html'][0]['type'] + ">" + data['html']['html'][0]['html'] + "</" + data['html']['html'][0]['type'] + ">";

        list_items.push(html_label);
        
        $(html_wrapper, {
            "id": data['html']['id'],
            html: list_items.join("")
        }).appendTo("#form-render-brush");
    })
    .done(function() {
        isCheckboxPresent = !isCheckboxPresent;
        appendCheckbox();
    })
}

// &+- plot the genes coming from http://172.29.4.215:8080/iric-portal/ws/genomics/gene/osnippo/ on the current brush
function plotGeneAnnotation(){
    // &+- make this option inactive while it is ongoing
    $('.plot-genes').attr('class', 'inactive-link plot-genes'); 
    var annotArray = [],
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
        spinner = new Spinner(spinnerConfig).spin(buffering),
        geneAnnotArrayURL = [];

    geneAnnotArrayURL = generateGeneAnnotURLs(geneAnnotArrayURL);

    var temp = ideogram.config.annotationsColor;
    ideogram.config.annotationsColor = getRandomColor();
    arrayOfColorsBrushes.push(ideogram.config.annotationsColor);

    asyncLoop({
        length: 13,
        functionToLoop: function(loop, i) {
            setTimeout(function() {
                processCollectedAnnots(geneAnnotArrayURL[i - 1],
                    function(processedAnnots) {
                        // &+- change setTimeout time to cover all/longer processes
                        if(ideogram.config.annotationsLayout === 'histogram') ideogram.config.annotationsLayout = 'tracks';
                        ideogram.drawProcessedAnnots(processedAnnots);
                        ideogram.config.annotationsLayout = 'tracks';
                        counterURLs = counterURLs + 1;
                        if(counterURLs == activeURLs){
                            ideogram.config.annotationsColor = temp;
                            toggleSpinner(spinner, false);
                            $('.plot-genes').attr('class', 'active-link plot-genes');                 

                            // &+- make the checkbox element for brush selection appear
                            $('#instructions').animate({ marginTop: 540 });
                            $('#form-render-brush').css('margin-top', '495');
                            $('#form-render-brush').css('height', '70');
                            $('#form-render-brush').css('width', '250');

                            addTrack('brush-selection-' + brushSelectionAnnot);
                            if(isCheckboxPresent === false){
                                brushSelectionCheckbox();
                            }
                            else{
                                appendCheckbox();
                            }

                        }
                    }
                );
                loop();
            }, 1000);
        },
        callback: function() {
        }
    });
}

// &+- thank you https://stackoverflow.com/a/1484514 for this color randomizer
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// &+- plot the position of the genes with the description that matches the input in the searchbox
function triggerSearchBox(){
    $('#searchbox-keyword-message').text('');
    disabled="disabled"
    var spinnerConfig = {
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

    var pathname = 'http://172.29.4.215:8080/iric-portal/ws/genomics/gene/osnippo/search/word/',
        keyword = $("#search-keyword").val(),
        webService = pathname + keyword,
        temp = ideogram.config.annotationsColor,
        colors = ideogram.config.annotationsColor = getRandomColor();

    asyncLoop({
        length: 1,
        functionToLoop: function(loop, i) {
            setTimeout(function() {
                processCollectedAnnots(webService,
                    function(processedAnnots) {
                        if(processedAnnots === null){
                            $('#searchbox-keyword-message').text('No results found.');
                        }
                        else{
                            if(ideogram.config.annotationsLayout === 'histogram') ideogram.config.annotationsLayout = 'tracks';
                            ideogram.drawProcessedAnnots(processedAnnots);
                            ideogram.config.annotationsLayout = 'tracks';
                            $("#searchbox-color").html('testing <b>1 2 3</b>');
                            $('#searchbox-color').css('color', colors);
                            $('#searchbox-keyword-message').text('Results are in this');
                            $('#searchbox-keyword-message').css('font-weight', 'normal');
                            $('#searchbox-keyword-message').css('color', 'black');
                        }
                        toggleSpinner(spinner, false);                            
                    }
                );
                loop();
            }, 1000);
        },
        callback: function() {
            // console.log("here at callback function");
        }
    });
}

var isNightMode = true;
function turnNightMode(){
    $('style').detach();
    if(isNightMode){
        var cssConfig = "<style>"                   +
            "html"                                  +
                "{"                                 +
                    "background-color: #212121;"    +
                    "color: #EEEEEE;"               +
                "}\n"                               +
            ".color-block"                          +
                "{"                                 +
                    "outline-color: #212121;"       +
                    "background-color: #212121;"    +
                "}\n"                               +
            "#search-keyword"                       +
                "{"                                 +
                    "color: #EEEEEE;"               +
                    "background-color: #212121;"    +
                "}\n"                               +
            ".domain"                               +
                "{"                                 +
                    "stroke: #EEEEEE !important;"   +
                "}\n"                               +
            ".tick text"                            +
                "{"                                 +
                    "fill: #EEEEEE;"                +
                "}\n"                               +
            ".tick line"                            +
                "{"                                 +
                    "stroke: #EEEEEE !important;"   +
                "}\n"                               +
            ".nightmodebutton button"               +
                "{"                                 +
                    "background-color: #FAFAFA;"    +
                    "color: black;"                 +
                "}\n"                               +                        
            ".acen"                                 +
                "{"                                 +
                    "fill: #80CBC4 !important;"     +
                "}\n"                               +
            ".chromosome text"                      +
                "{"                                 +
                    "fill: #EEEEEE;"                +
                "}\n"                               +
            ".file_menu"                            +
                "{"                                 +
                    "background-color: #BDBDBD;"    +
                "}\n"                               +
            ".white-text"                           +
                "{"                                 +
                    "color: #212121;"               +
                "}\n"                               +
            ".white-text-default"                   +
                "{"                                 +
                    "color: #212121;"               +
                "}\n"                               +                
            ".white-text-smaller"                   +
                "{"                                 +
                    "color: #212121;"               +
                "}\n"                               +
            ".submit-chr-details"                   +
                "{"                                 +
                    "color: #212121;"               +
                    "background-color: #EEEEEE;"    +
                "}\n"                               + 
            ".file_menu li a "                      +
                "{"                                 +
                    "color: #212121;"               +
                "}\n"                               +
            "#form-render::-webkit-scrollbar-track,"      +
            "#form-render-qtl::-webkit-scrollbar-track,"  +
            "#form-render-brush::-webkit-scrollbar-track" +
                "{"                                 +
                    "background-color: #303030;"    +
                "}\n"                               +
            "#gene-table-content tbody::-webkit-scrollbar-thumb," +
            "#form-render::-webkit-scrollbar-thumb," +
            "#form-render-qtl::-webkit-scrollbar-thumb," +
            "#form-render-brush::-webkit-scrollbar-thumb" + 
                "{"                                 +
                    "background-color: #80CBC4;"    +
                "}\n"                               +
            ".table thead"                          +
                "{"                                 +
                    "background-color: #424242;"    +
                "}\n"                               +
            ".table tbody"                          +
                "{"                                 +
                    "background-color: #616161;"    +
                "}\n"                               +
            "</style>";
        $('.nightmodebutton button').text('Day mode');
        $(document.head).append(cssConfig);
        ideogram.config.annotationsColor = 'white';
    }
    else{
        var cssConfig = "<style>"                   +
            "html"                                  +
                "{"                                 +
                    "background-color: white;"      +
                    "color: black;"                 +
                "}\n"                               +
            ".color-block"                          +
                "{"                                 +
                    "outline-color: white;"         +
                    "background-color: white;"      +
                "}\n"                               +
            "#search-keyword"                       +
                "{"                                 +
                    "color: black;"                 +
                    "background-color: white;"      +
                "}\n"                               +
            ".domain"                               +
                "{"                                 +
                    "stroke: #000 !important;"      +
                "}\n"                               +
            ".tick text"                            +
                "{"                                 +
                    "fill: #000;"                   +
                "}\n"                               +
            ".tick line"                            +
                "{"                                 +
                    "stroke: #000 !important;"      +
                "}\n"                               +
            ".nightmodebutton button"               +
                "{"                                 +
                    "background-color: #757575;"    +
                    "color: white;"                 +
                "}\n"                               +                        
            ".acen"                                 +
                "{"                                 +
                    "fill: #FDD !important;"        +
                "}\n"                               +
            ".chromosome text"                      +
                "{"                                 +
                    "fill: #000;"                   +
                "}\n"                               +
            ".file_menu"                            +
                "{"                                 +
                    "background-color: #212121;"    +
                "}\n"                               +
            ".white-text"                           +
                "{"                                 +
                    "color: #E0E0E0;"               +
                "}\n"                               +
            ".white-text-default"                   +
                "{"                                 +
                    "color: #E0E0E0;"               +
                "}\n"                               +
            ".white-text-smaller"                   +
                "{"                                 +
                    "color: #E0E0E0;"               +
                "}\n"                               +
            ".submit-chr-details"                   +
                "{"                                 +
                    "color: #EEEEEE;"               +
                    "background-color: #424242;"    +
                "}\n"                               + 
            ".file_menu li a "                      +
                "{"                                 +
                    "color: #FFFFFF;"               +
                "}\n"                               +
            "#form-render::-webkit-scrollbar,"      +
            "#form-render-qtl::-webkit-scrollbar,"  +
            "#form-render-brush::-webkit-scrollbar" +
                "{"                                 +
                    "background-color: white;"      +
                "}\n"                               +
            "#gene-table-content tbody::-webkit-scrollbar-thumb," +
            "#form-render::-webkit-scrollbar-thumb," +
            "#form-render-qtl::-webkit-scrollbar-thumb," +
            "#form-render-brush::-webkit-scrollbar-thumb" + 
                "{"                                 +
                    "background-color: #FDD;"       +
                "}\n"                               +
            ".table thead"                          +
                "{"                                 +
                    "background-color: #212121;"    +
                "}\n"                               +
            ".table tbody"                          +
                "{"                                 +
                    "background-color: #303030;"    +
                "}\n"                               +                
            "</style>";
        $('.nightmodebutton button').text('Night mode');
        $(document.head).append(cssConfig);
        ideogram.config.annotationsColor = 'black';        
    }
    isNightMode = !isNightMode;
}