// HTML DOM changes on brush-related elements
$(document).ready(function() {
    setUpBrush();

    searchEnterOverride();
    collapsibleArrowAnimate();
    exportSVG();

    // &+- ZOOM BUTTONS
    setUpZoomButtons();
});  

var panZoomTiger, isZoomOn = false, isPanOn = true;
function setUpZoomButtons(){
    var svgElement = document.querySelector('#ideogram');
    panZoomTiger = svgPanZoom(svgElement, {
        panEnabled: false,
        controlIconsEnabled: true,
        mouseWheelZoomEnabled: true,
        zoomScaleSensitivity: 0.5,
        minZoom: 1,
        maxZoom: 5,
    });

    $('g#svg-pan-zoom-zoom-in').attr('transform', 'translate(-250.5 33) scale(0.027)'); 
    $('g#svg-pan-zoom-zoom-out').attr('transform', 'translate(-200.5 33) scale(0.027)'); 
    $('g#svg-pan-zoom-reset-pan-zoom').attr('transform', 'translate(-150.5 28.5) scale(0.7)'); 
}

function toggleZoom(){
    if(isZoomOn){
        panZoomTiger.enableZoom();
        panZoomTiger.enablePan();
        $('#enable-zoom button').text('Zoom enabled');
        $('g#svg-pan-zoom-controls, #enable-pan button').css('visibility', 'visible'); 
    }
    else{
        panZoomTiger.disableZoom();
        panZoomTiger.disablePan();
        $('#enable-zoom button').text('Zoom disabled');
        $('g#svg-pan-zoom-controls, #enable-pan button').css('visibility', 'hidden'); 
    }
    isZoomOn = !isZoomOn;
}

function togglePan(){
    if(isPanOn){
        panZoomTiger.enablePan();
        $('#enable-pan button').text('Pan enabled');
    }
    else{
        panZoomTiger.disablePan();
        $('#enable-pan button').text('Pan disabled');
    }
    isPanOn = !isPanOn;
}

function setUpBrush(){
    // &+- SVG MENU SETTINGS
    adjustIdeogramSVG();
    // &+- DROPDOWN MENU
    dropdownMenuSetup();
}

var brushID, xCoordinates = [], isMenuOpen = [], previousBrush = 'some-id-i-used-to-know', brushExtent = [], arrayOfColorsBrushes = [];

function adjustIdeogramSVG(){
    // &+- providing a larger svg for the dropdown menu 
    // $('#ideogram').attr('width', '1200');
    // $('#ideogram').attr('height', '1200');

    $('#ideogram').attr('width', '1000');
    $('#ideogram').attr('height', '900');
    
    // &+- change cursor
    $('.background').css('cursor', 'zoom-in');
}

function dropdownMenuSetup(){
    // &+- makes the dropdown be located somewhere outside the user's view
    // $('.dynamic-dropdown').attr('transform', 'translate(-1000, -1000)');

    // &+- add dropdown menu after using the brush
    $('.dynamic-dropdown').wrapInner(dropdownMenuForm);
    $('ul.file_menu').stop(true, true).slideUp(1);   

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
                $('#defaultOpen').attr('class', 'inactive-link tablinks'); 
                $('.show-jbrowse').attr('class', 'inactive-link show-jbrowse'); 
            }
            else{
                // &+- make it active again
                $('#defaultOpen').attr('class', 'active-link tablinks'); 
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

// &+- "SHOW IN JBROWSE" option at brush menu, ideogram page
// &+- makes the JBrowse appear with the set coordinates
function redirectToJBrowse(brush){
    // &+- automatically open the jbrowse tab
    $("html, body").animate({ scrollTop: $(document).height(), scrolllLft: 0 }, "slow");
    document.getElementById("defaultOpen").click();
    $('#no-content-jb').remove();
    $('#goToTable').attr('class', 'inactive-link tablinks'); 
    $('#JBrowseView').css('height', '460');

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
    $('#goToTable').attr('class', 'active-link tablinks'); 
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

// &+- "SET BASE PAIR RANGE" option at brush menu
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

function countActiveBrushes(){
    var countActive = 0;
    for (var i = 0; i < ideogram.numChromosomes; i++) {
        if(isBrushActive[i]){
            countActive = countActive + 1;
        }
    }
    return countActive;
}

var isHeaderPresent = false;

// &+- "SHOW ALL GENES" option at brush menu
// &+- make the table that will contain the data (the whole gene)
function showStatiscalTable(table){
    // &+- automatically open the genetable tab
    $('#defaultOpen').attr('class', 'inactive-link tablinks'); 
    document.getElementById("goToTable").click();
    $('#no-content-gt').remove();
    $('#GeneTable').css('height', '440');

    // &+- make the link inactive, automatically scroll the page to the lowermost left page
    $('.show-genes').attr('class', 'inactive-link show-genes'); 
    $("html, body").animate({ scrollTop: $(document).height(), scrollLeft: 0 }, "slow");
    $('#gene-table-content').empty();

    var pathname = "http://172.29.4.215:8080/iric-portal/ws/genomics/gene/osnippo/",                     
        start = 'start=' + $('#startBPTextbox').val() + '&',
        end = 'end=' + $('#endBPTextbox').val(),
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
            top: '-100px',
            left: '38%',
            shadow: true,
            hwaccel: false,
            position: 'absolute'
        },
        buffering = document.getElementById("gt-div"),
        spinner = new Spinner(spinnerConfig).spin(buffering),
        chrNum, webService, extent, from, to, arrayCatch, myList, countActive = 0, counterIndex = 0;

    countActive = countActiveBrushes();

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
            // console.log(webService);
            $.ajax({
                dataType: "json",
                crossDomain: true,
                url: webService,
                data: arrayCatch,
                success: function(arrayCatch) {
                    buildHtmlTable(arrayCatch, "#gene-table-content");  
                    counterIndex = counterIndex + 1;
                    $('#defaultOpen').attr('class', 'active-link tablinks'); 
                    $('.show-genes').attr('class', 'active-link show-genes');                   

                    toggleSpinner(spinner, false);
                    isHeaderPresent = true;
                    if(counterIndex == countActive){
                        $('#GeneTable').css('height', '480');
                        // console.log(counterIndex + "==" + countActive);
                        // &+- export to csv, txt, xls
                        $("table").tableExport({
                            headings: true,                   
                            footers: true,
                            formats: ["xls", "csv", "txt"],          
                            fileName: "gene-table",                        
                            emptyCSS: ".tableexport-empty",  
                            trimWhitespace: false        
                        });    

                        isHeaderPresent = false;
                    }
                }
            });
        }
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

// &+- ANNOTATION CREATION (data coming from brush selection and serach queries)
var annotObject = {}, annotArray = [], activeURLs = 0, counterURLs = 0, geneQueryCount = 0, searchQueryAnnot = 0, brushSelectionCount = 0, geneQueryCountArray = [], isCheckboxPresent = false;

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

                    var number = parseInt(String(d.contig).replace(/[^0-9\.]/g, ''), 10);
                    allTraitData["annots"][number - 1]["annots"].push(annotContent);
                    
                    if(getNumber){
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
function appendCheckbox(categoryQuery, nameNum){
    var open_tag = "<li>",
        close_tag = "</li>",
        attr = '<input type="checkbox" onclick="toggleFilter(this)"',
        label = "",
        id = "",
        colorBlock = '<div class="color-block" id="color-block-' + (geneQueryCount+59) + '" style="background-color: '+ arrayOfColorsBrushes[geneQueryCount] +' "></div>';

    var item,
        id = categoryQuery + '-' + (geneQueryCount+59);
        label = "<label for='" + id + "'>" + colorBlock + categoryQuery + '-' + (nameNum) + "</label>";

    attr = attr + 'id="' + id + '" tracks="' + id + '"></input>';
    item = open_tag + attr + label + close_tag;

    $(item).appendTo("#category-content-gq ul");
    // $('#color-block' + (geneQueryCount+59)).css("background-color", arrayOfColorsBrushes[geneQueryCount]);    
    
    $('#' + id).prop('checked', true); 
    geneQueryCount = geneQueryCount + 1;

    var searchIdentifier = new RegExp("search");
    if(searchIdentifier.test(categoryQuery)){
        searchQueryAnnot = searchQueryAnnot + 1;
    }else{
        brushSelectionCount = brushSelectionCount + 1;
    }
}

/* Add clickable annotations and display in jBrowse [*] */
function addAnnotationLinks(){
    d3.selectAll(".annot")
        .on("click", function(d, i) {
            toggleLinearScale("visible");
            // var pathname = "http://oryzasnp.org/jbrowse-dev2/",
            var pathname = "http://172.29.4.215:8080/jbrowse-dev2/",                     
                locOnChr = d.start.toString() + ".." + (d.start + d.length).toString(),
                track = "&tracks=DNA%2C" + ideogram.config.selectedTrack + "&highlight=",
                chrNum;

            if (d.chr < 10) {
                chrNum = "?loc=chr0" + d.chr + "%3A"
            } else {
                chrNum = "?loc=chr" + d.chr + "%3A"
            }
            console.log("src", pathname + chrNum + locOnChr + track);
            $("#jbrowse").prop("src", pathname + chrNum + locOnChr + track);
            $("#jbrowse").show();
        }
    );
}

// &+- "PLOT ALL GENES" option @ brush menu
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
    console.log(activeURLs);

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
                        ideogram.config.allTracks = allTracks;

                        if(processedAnnots !== null){
                            processedAnnots.push({'mapping': 'asdf'});
                            brushAnnots.push(processedAnnots);
                        }
                        ideogram.drawProcessedAnnots(processedAnnots);
                        counterURLs = counterURLs + 1;
                        if(counterURLs == activeURLs){
                            ideogram.config.annotationsColor = temp;
                            toggleSpinner(spinner, false);
                            
                            addAnnotationLinks();

                            $('.plot-genes').attr('class', 'active-link plot-genes');                 

                            // &+- make the checkbox element for brush selection appear
                            $('#form-render-brush').css('margin-top', '495');
                            $('#form-render-brush').css('height', '70');
                            $('#form-render-brush').css('width', '250');

                            addTrack('brush-selection-' + (geneQueryCount+59));
                            appendCheckbox('brush-selection', brushSelectionCount);
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

// &+- thank you https://stackoverflow.com/a/1484514 for this color randomizer :: used in search annotation and brush selection annotation
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// &+- "SEARCH GENE POSITION BY KEYWORD" section in ideogram page
// thank you https://stackoverflow.com/a/10905506 for this wonderful just-press-enter-at-the-search-box-to-search technique
function searchEnterOverride(){
    $('#search-keyword').bind("keypress", {}, keypressInBox);
    function keypressInBox(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode                        
            e.preventDefault();
            triggerSearchBox();
        }
    };    
}

// &+- adjustments on search results and transform it to an array of objects which the ideogram.js can procress
function fixAnnotChr(processedAnnots){
    var annotArray = processedAnnots,
        obj = annotArray['0'],
        annot = obj['annots'];

    for (var i = 0; i < annot.length; i++) {
        var innerObj = annot[i];
            number = parseInt(innerObj['chrName'].replace(/[^0-9\.]/g, ''), 10);

        processedAnnots['0']['annots'][i]['chr'] = number;
    }

    // &+- construction of a empty copy of annots
    var modifiedAnnot = [], goToConstruct = false;
    for(var j = 0; j < ideogram.numChromosomes; j++) {
        var arr = ['1'];
        arr.splice(0, 1);
        var annotObj = { 'chr': (j+1).toString(), 'annots': arr};
        modifiedAnnot.push(annotObj);
    }

    for(var i = 0; i < annot.length; i++) {
        var chrObj = annot[i];
        for(var k = 0; k < ideogram.numChromosomes; k++) {
            if(modifiedAnnot[k]['chr'] == chrObj['chr']){
                chrObj['chrIndex'] = (chrObj['chr'] - 1);
                modifiedAnnot[k]['annots'].push(chrObj);
            }
        }
    }

    return modifiedAnnot;
}

// &+- plot the position of the genes with the description that matches the input in the searchbox
function triggerSearchBox(){
    // &+- automatically open the genetable tab
    $('#defaultOpen').attr('class', 'inactive-link tablinks'); 
    document.getElementById("goToTable").click();
    $('#no-content-gt').remove();
    $('#GeneTable').css('height', '440');

    // &+- disable another search
    $("input#search-keyword").prop('disabled', true);
    $("#search-button").prop('disabled', true);    

    // &+- automatic scrolling to bottom
    $('#gene-table-content').empty();

    // &+- clear message
    $('#searchbox-keyword-message').text('');
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
        colors,
        arrayCatch;
               
    ideogram.config.allTracks = allTracks;
    colors = ideogram.config.annotationsColor = getRandomColor();
    arrayOfColorsBrushes.push(ideogram.config.annotationsColor);

    asyncLoop({
        length: 1,
        functionToLoop: function(loop, i) {
            setTimeout(function() {
                processCollectedAnnots(webService,
                    function(processedAnnots) {
                        if(processedAnnots === null){
                            $('#searchbox-keyword-message').text('No results found.');

                            toggleSpinner(spinner, false);

                            $("input#search-keyword").prop('disabled', false);
                            $("#search-button").prop('disabled', false);    

                            $('#GeneTable').css('height', '140');
                            $('#GeneTable').append('<div id="no-content-gt"><h3>Gene table has no results yet.</h3><p>You can get to view genomic data by performing one of the following:</p><p class="li-content">- Searching a keyword</p><p class="li-content">- Create a brush, then click "Plot all genes" to view the results.</p></div>');

                            $('#defaultOpen').attr('class', 'active-link tablinks'); 
                            $('.show-genes').attr('class', 'active-link show-genes');  

                        }
                        else{
                            processedAnnots = fixAnnotChr(processedAnnots);

                            // processedAnnots.push({'mapping': 'asdf'});
                            brushAnnots.push(processedAnnots);
                            ideogram.drawProcessedAnnots(processedAnnots);

                            $('#searchbox-keyword-message').text('Annotations are in this color.');
                            $('#searchbox-keyword-message').css('color', colors);

                            addTrack('search-query-' + (geneQueryCount+59));
                            appendCheckbox('search-query', searchQueryAnnot);

                            // &+- put the results in a table
                            $.ajax({
                                dataType: "json",
                                crossDomain: true,
                                url: webService,
                                data: arrayCatch,
                                success: function(arrayCatch) {
                                    var isHeaderPresent = false;
                                    buildHtmlTable(arrayCatch, "#gene-table-content");  

                                    // &+- tab links activation
                                    $('#defaultOpen').attr('class', 'active-link tablinks'); 
                                    $('.show-genes').attr('class', 'active-link show-genes');  

                                    // &+- search activation
                                    $("input#search-keyword").prop('disabled', false);
                                    $("#search-button").prop('disabled', false);    

                                    addAnnotationLinks();

                                    toggleSpinner(spinner, false);

                                    $('#GeneTable').css('height', '480');
                                    // &+- export to csv, txt, xls
                                    $("table").tableExport({
                                        headings: true,                   
                                        footers: true,
                                        formats: ["xls", "csv", "txt"],          
                                        fileName: "gene-table",                        
                                        emptyCSS: ".tableexport-empty",  
                                        trimWhitespace: false        
                                    });    
                                }
                            });

                        }
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

// "TURN NIGHT MODE ON" at settings tab, ideogram page
var isNightMode = true;
function turnNightMode(){
    $('style').detach();
    if(isNightMode){
        var cssConfig = "<style>"                   +
            "body"                                  +
                "{"                                 +
                    "background-color: #363636;"    +
                    "color: #EEEEEE;"               +
                "}\n"                               +
            ".color-block"                          +
                "{"                                 +
                    "outline-color: #363636;"       +
                    "background-color: #363636;"    +
                "}\n"                               +
            "#search-keyword"                       +
                "{"                                 +
                    "color: #EEEEEE;"               +
                    "background-color: #363636;"    +
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
                    "color: #363636;"               +
                "}\n"                               +
            ".white-text-default"                   +
                "{"                                 +
                    "color: #363636;"               +
                "}\n"                               +                
            ".white-text-smaller"                   +
                "{"                                 +
                    "color: #363636;"               +
                "}\n"                               +
            ".submit-chr-details"                   +
                "{"                                 +
                    "color: #363636;"               +
                    "background-color: #EEEEEE;"    +
                "}\n"                               + 
            ".file_menu li a "                      +
                "{"                                 +
                    "color: #363636;"               +
                "}\n"                               +
            "#form-render::-webkit-scrollbar-track,"+
            "#form-render-qtl::-webkit-scrollbar-track," +
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
        ideogram.config.annotationTracks = nightModeColor;
        ideogram.config.annotationsColor = 'white';
    }
    else{
        var cssConfig = "<style>"                   +
            "body"                                  +
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
            "#form-render::-webkit-scrollbar-thumb,"+
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
        ideogram.config.annotationTracks = defaultColor;
        ideogram.config.annotationsColor = 'black';        
    }
    isNightMode = !isNightMode;
}

// &+- TABS (show results and ideogram settings/instructions tabs)
var emptyJB = true, emptyGT = true;
// &+- tabs:: thank you https://www.w3schools.com/howto/howto_js_tabs.asp for this awesome tab html structure and css
function toggleResult(evt, category) {
    if($('#jbrowse').is(":empty") && emptyJB){
        $('#JBrowseView').css('height', '140');
        $('#JBrowseView').append('<div id="no-content-jb"><h3>JBrowse is not active yet.</h3><p>To make it appear, you can do either perform one of the following:</p><p class="li-content">- Click on an annotation.</p><p class="li-content">- Create a brush, then click "Show in JBrowse."</p></div>');
        emptyJB = !emptyJB;
    }
    else if(!($('#jbrowse').is(":empty"))){
        $('#no-content-jb').remove();
        $('#JBrowseView').css('height', '460');
    }

    if($('#gene-table-content').is(":empty") && emptyGT){
        $('#GeneTable').css('height', '140');
        $('#GeneTable').append('<div id="no-content-gt"><h3>Gene table has no results yet.</h3><p>You can get to view genomic data by performing one of the following:</p><p class="li-content">- Searching a keyword</p><p class="li-content">- Create a brush, then click "Plot all genes" to view the results.</p></div>');
        emptyGT = !emptyGT;
    }
    else if(!($('#gene-table-content').is(":empty"))){
        $('#no-content-gt').remove();
        $('#GeneTable').css('height', '440');
    }

    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(category).style.display = "block";
    evt.currentTarget.className += " active";
}

// &+- tab settings for the instruction and color scheme settings
function anotherTab(evt, category) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent-anotherone");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks-anotherone");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(category).style.display = "block";
    evt.currentTarget.className += " active";
}

// &+- ANNOTATION CLICK :: opening the jbrowse tab and triggering the application of jbrowse settings
function showJBrowseAnnotClick(){
    $('.annot').click(function() {
        $("html, body").animate({ scrollTop: $(document).height(), scrollLeft: 0 }, "slow");
        document.getElementById("defaultOpen").click();
        $('#JBrowseView').css('height', '460');
        $('#no-content-jb').remove();
    });
}

// &+- COLLAPSIBLE STRUCTURE JQUERY
// &+- thank you https://stackoverflow.com/a/17348698 for rotating the triangle pointer to show whether the contents of the collapsible is visible or not
function collapsibleArrowAnimate(){
    // &+- collapsible icon : onclick, it rotates downward to indicate that the collapsible content is visible, else, rotates (/points) to the right 
    var arrowTGOn = true, arrowQTLOn = true, arrowGQOn = true;
    jQuery.fn.rotate = function(degrees) {
        $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                     '-moz-transform' : 'rotate('+ degrees +'deg)',
                     '-ms-transform' : 'rotate('+ degrees +'deg)',
                     'transform' : 'rotate('+ degrees +'deg)'});
    };

    $('#collapsible-tg').click(function() {
        if(arrowTGOn){
            $('#arrow-tg').rotate(0);
            $('#collapsible-tg').css('background-color', '#E0E0E0');
        }
        else{
            $('#arrow-tg').rotate(-90);
            $('#collapsible-tg').css('background-color', '#EEEEEE');
        }
        arrowTGOn = !arrowTGOn;
    });
    
    $('#collapsible-qtl').click(function() {
        if(arrowQTLOn) {
            $('#arrow-qtl').rotate(0);
            $('#collapsible-qtl').css('background-color', '#E0E0E0');
        }
        else{
            $('#arrow-qtl').rotate(-90);
            $('#collapsible-qtl').css('background-color', '#EEEEEE');
        }
        arrowQTLOn = !arrowQTLOn;
    });
    
    $('#collapsible-gq').click(function() {
        if(arrowGQOn){
            $('#arrow-gq').rotate(0);
            $('#collapsible-gq').css('background-color', '#E0E0E0');
        }
        else{
            $('#arrow-gq').rotate(-90);
            $('#collapsible-gq').css('background-color', '#EEEEEE');
        }
        arrowGQOn = !arrowGQOn;
    });
}

// &+- thank you https://webdevdoor.com/jquery/expandable-collapsible-panels-jquery for the collapsible settings
function plugCollapsibleJQuery(){
    var panelspeed = 500; //panel animate speed in milliseconds
    var totalpanels = 3; //total number of collapsible panels   
    var defaultopenpanel = 0; //leave 0 for no panel open   
    var accordian = false; //set panels to behave like an accordian, with one panel only ever open at once      

    var panelheight = new Array();
    var currentpanel = defaultopenpanel;
    var iconheight = parseInt($('.icon-close-open').css('height'));

    //Initialise collapsible panels
    function panelinit() {
        for (var i = 1; i <= totalpanels; i++) {
            panelheight[i] = parseInt($('#cp-' + i).find('.expandable-panel-content').css('height'));
            $('#cp-' + i).find('.expandable-panel-content').css('margin-top', -panelheight[i]);
            if (defaultopenpanel == i) {
                $('#cp-' + i).find('.icon-close-open').css('background-position', '0px -' + iconheight + 'px');
                $('#cp-' + i).find('.expandable-panel-content').css('margin-top', 0);
            }
        }
    }

    $('.expandable-panel-heading').click(function () {
        var obj = $(this).next();
        var objid = parseInt($(this).parent().attr('ID').substr(3, 2));
        currentpanel = objid;
        if (accordian == true) {
            resetpanels();
        }

        if (parseInt(obj.css('margin-top')) <= (panelheight[objid] * -1)) {
            obj.clearQueue();
            obj.stop();
            obj.prev().find('.icon-close-open').css('background-position', '0px -' + iconheight + 'px');
            obj.animate({
                'margin-top': 0
            }, panelspeed);
        } else {
            obj.clearQueue();
            obj.stop();
            obj.prev().find('.icon-close-open').css('background-position', '0px 0px');
            obj.animate({
                'margin-top': (panelheight[objid] * -1)
            }, panelspeed);
        }
    });

    function resetpanels() {
        for (var i = 1; i <= totalpanels; i++) {
            if (currentpanel != i) {
                $('#cp-' + i).find('.icon-close-open').css('background-position', '0px 0px');
                $('#cp-' + i).find('.expandable-panel-content').animate({
                    'margin-top': -panelheight[i]
                }, panelspeed);
            }
        }
    }
    
    panelinit();
}

// "EXPORT TO PNG" button at ideogram page
// &+- thank you https://stackoverflow.com/a/41735524 for this function that exports svg to .png
function exportSVG(){
    $(".exportImageButton").on("click", function() {
        var svg = document.querySelector("svg");
        var svgData = new XMLSerializer().serializeToString(svg);
        var canvas = document.createElement("canvas");
        var svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width * 3;
        canvas.height = svgSize.height * 3;
        canvas.style.width = svgSize.width;
        canvas.style.height = svgSize.height;
        var ctx = canvas.getContext("2d");
        ctx.scale(3, 3);
        var img = document.createElement("img");
        img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            var canvasdata = canvas.toDataURL("image/png", 1);

            var pngimg = '<img src="' + canvasdata + '">';
            d3.select("#pngdataurl").html(pngimg);

            var a = document.createElement("a");
            a.download = "download_img" + ".png";
            a.href = canvasdata;
            document.body.appendChild(a);
            a.click();
        };
    });
}
