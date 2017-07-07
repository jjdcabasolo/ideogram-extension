/*
 * global variables like config objects and arrays
 */
var filterMap = {
        "traitGenes": {
            "oryzabase_trait_genes": 1,
            "qtaro_trait_genes": 2,
            "qtarogenes_bacterial_blight_resistance": 3,
            "qtarogenes_blast_resistance": 4,
            "qtarogenes_cold_tolerance": 5,
            "qtarogenes_culm_leaf": 6,
            "qtarogenes_drought_tolerance": 7,
            "qtarogenes_dwarf": 8,
            "qtarogenes_eating_quality": 9,
            "qtarogenes_flowering": 10,
            "qtarogenes_germination_dormancy": 11,
            "qtarogenes_insect_resistance": 12,
            "qtarogenes_lethality": 13,
            "qtarogenes_lodging_resistance": 14,
            "qtarogenes_morphological_trait": 15,
            "qtarogenes_other_disease_resistance": 16,
            "qtarogenes_other_soil_stress_tolerance": 17,
            "qtarogenes_other_stress_resistance": 18,
            "qtarogenes_others": 19,
            "qtarogenes_panicle_flower": 20,
            "qtarogenes_physiological_trait": 21,
            "qtarogenes_resistance_or_tolerance": 22,
            "qtarogenes_root": 23,
            "qtarogenes_salinity_tolerance": 24,
            "qtarogenes_seed": 25,
            "qtarogenes_sheath_blight_resistance": 26,
            "qtarogenes_shoot_sibling": 27,
            "qtarogenes_source_activity": 28,
            "qtarogenes_sterility": 29,
            "qtarogenes_submergency_tolerance": 30
        },
        "qtl": {
            "QTARO QTL": 1,
            "qtaroqtl_bacterial_blight_resistance": 2,
            "qtaroqtl_blast_resistance": 3,
            "qtaroqtl_cold_tolerance": 4,
            "qtaroqtl_culm_leaf": 5,
            "qtaroqtl_drought_tolerance": 6,
            "qtaroqtl_dwarf": 7,
            "qtaroqtl_eating_quality": 8,
            "qtaroqtl_flowering": 9,
            "qtaroqtl_germination_dormancy": 10,
            "qtaroqtl_insect_resistance": 11,
            "qtaroqtl_lethality": 12,
            "qtaroqtl_lodging_resistance": 13,
            "qtaroqtl_morphological_trait": 14,
            "qtaroqtl_other_disease_resistance": 15,
            "qtaroqtl_other_soil_stress_tolerance": 16,
            "qtaroqtl_other_stress_resistance": 17,
            "qtaroqtl_others": 18,
            "qtaroqtl_panicle_flower": 19,
            "qtaroqtl_physiological_trait": 20,
            "qtaroqtl_resistance_or_tolerance": 21,
            "qtaroqtl_root": 22,
            "qtaroqtl_salinity_tolerance": 23,
            "qtaroqtl_seed": 24,
            "qtaroqtl_sheath_blight_resistance": 25,
            "qtaroqtl_shoot_seedling": 26,
            "qtaroqtl_source_activity": 27,
            "qtaroqtl_sterility": 28,
            "qtaroqtl_submergency_tolerance": 29
        }
    },
    allTraitData = {
        "keys": ["name", "start", "length", "trackIndex"],
        "annots": [{
            "chr": "1",
            "annots": []
        }, {
            "chr": "2",
            "annots": []
        }, {
            "chr": "3",
            "annots": []
        }, {
            "chr": "4",
            "annots": []
        }, {
            "chr": "5",
            "annots": []
        }, {
            "chr": "6",
            "annots": []
        }, {
            "chr": "7",
            "annots": []
        }, {
            "chr": "8",
            "annots": []
        }, {
            "chr": "9",
            "annots": []
        }, {
            "chr": "10",
            "annots": []
        }, {
            "chr": "11",
            "annots": []
        }, {
            "chr": "12",
            "annots": []
        }]
    },
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
    traitData = [],
    lfUrls = [];
/*
 *  jQuery-based script to generate a form given a JSON object from .json file.
 *  JSON format based on format of jquery.dform and should be:
 *  {"html": {"type": html_wrapper_tag, "attr1": attr1,"attr2": attr2, ...
 *         "html": [
 *              {"item_type": item_tag, "item_attr1": item_attr1, ...
 *                  "html": {
 *                      "input_attr1": attr1, //<input input_attr1=attr1...>
 *                      "input_attr2": attr2,...
 *                      "caption": caption //<label>label</label>
 *                  }                    
 *              }....]}}
 */
var renderForm = function(filepath, category) {
    $.getJSON(filepath, function(data) {
            var list_items = [],
                html_wrapper = "<" + data['html']['type'] + "/>",
                html_label = "<" + data['html']['html'][0]['type'] + ">" + data['html']['html'][0]['html'] + "</" + data['html']['html'][0]['type'] + ">";

            list_items.push(html_label);

            for (var i = 1; i < data['html']['html'].length; i++) {
                var open_tag = "<" + data['html']['html'][i]['type'] + ">",
                    close_tag = "</" + data['html']['html'][i]['type'] + ">",
                    attr = "<input",
                    label = "",
                    id = "",
                    colorBlock;

                // &+- inserts the div tag of the color block
                if(data['html']['id'] === 'traitGenes'){
                    colorBlock = '<div class="color-block" id="color-block-' + (i-1) + '"></div>';
                }
                else if(data['html']['id'] === 'qtl'){
                    colorBlock = '<div class="color-block" id="color-block-' + (i-1+30) + '"></div>';                    
                }

                $.each(data['html']['html'][i]['html'], function(key, val) {
                    var item;
                    if (key == 'id') id = val;
                    if (key == 'caption') {
                        // &+- added color block for color coding before the label
                        label = "<label for='" + id + "'>" + colorBlock + val + "</label>";
                    } else {
                        var new_attr = " " + key + "='" + val + "'";
                        attr = attr + new_attr;
                    }
                });

                attr = attr + "></input>";
                item = open_tag + attr + label + close_tag;
                list_items.push(item);
            }
            // console.log(list_items);
            
            if(data['html']['id'] === 'traitGenes'){
                $(html_wrapper, {
                    "id": data['html']['id'],
                    html: list_items.join("")
                }).appendTo("#form-render");
            }
            else if(data['html']['id'] === 'qtl'){
                $(html_wrapper, {
                    "id": data['html']['id'],
                    html: list_items.join("")
                }).appendTo("#form-render-qtl");
            }
        })
        .done(function() {
            console.log("Form rendered");
        })
        .fail(function() {
            console.warn("Error form render");
        });
}

/*
 * toggles the spinner to show or hide
 */
function toggleSpinner(spinner, loading) {
    if (!loading) {
        spinner.stop();
    }
}

/* 
 * retrieve and parse json using D3.js
 */
function getJsonData(addr, func) {
    d3.json(addr, function(error, data) {
        if (error) {
            // console.log(addr + ":" + error);
            data = null;
            func(data);
        } else {
            func(data, addr);
        }
    });
}

/*
 * enables looping of asynchronous functions 
 * within synchronous ones
 * (reference for asyncLoop: http://jsfiddle.net/NXTv7/8/)
 */
var asyncLoop = function(o) {
    var i = 0,
        length = o.length;

    var loop = function() {

        if (i == length) {
            o.callback();
            return;
        }
        i++;
        o.functionToLoop(loop, i);
    }
    loop(); //init
}

/* 
 * change format of annots from jBrowse to the format of ideogram.js
 */
function reformatTraitData(selectedTrack) {
    var i, j, category, isQTL = false;

    // &+- added to determine if the option is a qtl
    var qtlIdentifier = new RegExp("(qtl|QTL)");
    if(qtlIdentifier.test(selectedTrack)){
        category = "qtl";
        isQTL = true;
    } else {
        category = "traitGenes";
    }

    /* assign annots */
    for (i = 0; i < traitData.length; i++) {
        var td = traitData[i],
            annots = [],
            chrNum;

        if (td["data"].length) {

            /* assign chromosome number */
            chrNum = td["chrNum"];

            /* populate annots array */
            for (j = 0; j < td["data"].length; j++) {
                var d = td["data"],
                    annot = new Array(4);

                annot[0] = d[j][7]; // name
                annot[1] = d[j][1]; // start
                annot[2] = d[j][2] - d[j][1]; // length

                // &+- changed into a dynamic variable to take different data sources
                annot[3] = filterMap[category][selectedTrack]; // numerical value of selected track
                annots.push(annot);
            }

            /* combine all annots of chromosome number chrNum */
            allTraitData["annots"][chrNum - 1]["annots"].push.apply(allTraitData["annots"][chrNum - 1]["annots"], annots);
        }
    }

    // console.log(allTraitData);
    return allTraitData;
}

/* 
 * populate arr with trackData.json filepaths given selected track
 */
var isURLExisting = [];
function getTrackDataUrls(selectedTrack) {
    var i, arr = [];

    for (i = 1; i < 13; i++) {
        var initFilepath = "http://172.29.4.215:8080/jbrowse-dev2/data/tracks/" + selectedTrack + "/chr";

        if (i > 9) {
            initFilepath = initFilepath + i.toString();
        } else {
            initFilepath = initFilepath + "0" + i.toString();
        }

        // &+- non-asynchronous function that determines if the filepath exists
        var request;
        if(window.XMLHttpRequest){
            request = new XMLHttpRequest();
        }
        else{
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
        request.open('GET', (initFilepath + "/trackData.json"), false);
        request.send();
        if (request.status !== 404) {
            // &+- the URL exists
            arr.push(initFilepath + "/trackData.json");
        }
        else{
            // &+- URL DNE :(
            arr.push("");
        };
    }
    return arr;
}

/*
 * populate lfUrls with lf-<num>.json filepaths given
 * the initial filepath and maximum number of .json files
 */
function populateLfUrls(initFilepath, size, chrNum) {
    var i, lfUrl;
    for (i = 1; i <= size; i++) {
        lfUrl = initFilepath + "/lf-" + i.toString() + ".json";
        // console.log(lfUrls);
        lfUrls.push([lfUrl, chrNum]);
    }
}

/*
 * get all track data given a selected track
 */
function getTrackData(selectedTrack, trackDataUrls) {
    var buffering = document.getElementById("chromosome-render"),
        spinner = new Spinner(spinnerConfig).spin(buffering),
        chr = [],
        tempData = [],
        i, j, k;

    toggleSpinner(spinner, true);

    /* get trackData.json content per chromosome */
    asyncLoop({
        length: 13,
        functionToLoop: function(loop, i) {
            setTimeout(function() {
                getJsonData(trackDataUrls[i - 1],
                    function(trackData, tdUrl) {
                        /* if featureCount is not 0 */
                        if (trackData.featureCount) {
                            var data = trackData.intervals.nclist,
                                len = data.length,
                                obj = {};

                            /* perform async again */
                            if (data[0].length == 4) {
                                data = [];

                                /* get initial file path */
                                var newUrl = tdUrl.replace("/trackData.json", "");

                                /* get lf-<num> urls */
                                populateLfUrls(newUrl, len, i);

                            } else {
                                obj["chrNum"] = i;
                                obj["data"] = data;
                                traitData.push(obj);
                            }
                        }
                    }
                );
                loop();
            }, 100);
        },
        callback: function() {

            /* if other json files need to be accessed to retrieve data */
            if (lfUrls.length) {
                for (k = 0; k < 12; k++) {
                    var lfData, obj = {};
                    for (j = 0; j < lfUrls.length; j++) {
                        if (lfUrls[j][1] == k + 1) {
                            $.ajax({
                                dataType: "json",
                                async: false,
                                url: lfUrls[j][0],
                                data: lfData,
                                success: function(lfData) {
                                    tempData.push.apply(tempData, lfData);
                                }
                            });
                        }
                    }
                    obj["chrNum"] = k + 1;
                    obj["data"] = tempData;
                    traitData.push(obj);
                    tempData = [];
                }
            }

            lfUrls = [];

            config.rawAnnots = reformatTraitData(selectedTrack);
            config.selectedTrack = selectedTrack;
            config.allTracks = allTracks;
            toggleSpinner(spinner, false);

            ideogram = new Ideogram(config);
            // &+- providing a larger svg for the dropdown menu 
            $('#ideogram').attr('width', '1000');
            $('#ideogram').attr('height', '1200');

            // &+- change cursor
            $('.background').css('cursor', 'zoom-in');

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

            return ideogram;
        }
    });
}

/*
 * remove data of selectedTrack in the allTraitData array
 */
function removeSelectedTrack(selectedTrack) {
    // console.log("etoh" + selectedTrack);
    // &+-
    var qtlIdentifier = new RegExp("(qtl|QTL)"),
        category;
    if(qtlIdentifier.test(selectedTrack)){
        category = "qtl";
    } else {
        category = "traitGenes";
    }
    var num = filterMap[category][selectedTrack],
        i, j;

    for (i = 0; i < 12; i++) {
        var numOfAnnots = allTraitData["annots"][i]["annots"].length;
        for (j = 0; j < numOfAnnots; j++) {
            if (allTraitData["annots"][i]["annots"][j][3] === num) {
                allTraitData["annots"][i]["annots"].splice(j, 1);
                j--;
                numOfAnnots--;
            }
        }
    }
    return allTraitData;
}

/*
 *  get allTraitData
 */
function getAllTraitData() {
    return allTraitData;
}

/*
 * variables and functions below were used to
 * format the annot format in ideogram.js
 */

var allTracks = [],
    allTracksCount = 0;

function addTrack(track) {
    // console.log(track+"asdfasdfasdf");
    // &+- 
    var qtlIdentifier = new RegExp("(qtl|QTL)"),
        category;
    if(qtlIdentifier.test(track)){
        category = "qtl";
    } else {
        category = "traitGenes";
    }

    allTracks.push({
        track: track,
        trackIndex: allTracksCount,
        mapping: filterMap[category][track]
    });
    allTracksCount++;
}

function removeTrack(track) {
    var i, rem = -1;
    for (i = 0; i < allTracks.length; i++) {
        if (track === allTracks[i]) {
            rem = i;
        } else if (rem != -1) {
            allTracks[i]["trackIndex"]--;
        }
    }
    allTracks.splice(rem, 1);
    allTracksCount--;
}

function getAllTracksCount(){
    return allTracksCount;
}

/* 
 * reference: http://bl.ocks.org/benjchristensen/2579599
 */
function displayLinearScale() {
    // define dimensions of graph
    var m = [50, 50, 70, 100]; // margins
    var w = 10; // - m[1] - m[3]; // width
    var h = 800; //1000 - m[0] - m[2]; // height        

    var y = d3.scale.linear().domain([0, 43270923]).range([0, h]);
    // automatically determining max range can work something like this
    // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

    var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function(d, i) {
            // verbose logging to show what's actually being done
            // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
            // return the X coordinate where we want to plot this datapoint
            return x(i);
        })
        .y(function(d) {
            // verbose logging to show what's actually being done
            // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
            // return the Y coordinate where we want to plot this datapoint
            return y(d);
        })

    // Add an SVG element with the desired dimensions and margin.
    var graph = d3.select("#ideogram").append("svg:svg")
        .attr("id", "linear-scale")
        .attr("width", w + m[1] + m[3] + 950)
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + 950 + ",30)");

    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y).ticks(7).orient("right");
    // Add the y-axis to the left
    graph = graph.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxisLeft);
}
