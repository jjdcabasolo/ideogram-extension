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
        top: '50%',
        left: '50%',
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
var renderForm = function(filepath) {
    $.getJSON(filepath, function(data) {
        console.log(data['html']['id']);
            var list_items = [],
                html_wrapper = "<" + data['html']['type'] + "/>",
                html_label = "<" + data['html']['html'][0]['type'] + ">" + data['html']['html'][0]['html'] + "</" + data['html']['html'][0]['type'] + ">";

            list_items.push(html_label);

            for (var i = 1; i < data['html']['html'].length; i++) {
                var open_tag = "<" + data['html']['html'][i]['type'] + ">",
                    close_tag = "</" + data['html']['html'][i]['type'] + ">",
                    attr = "<input",
                    label = "",
                    id = "";

                $.each(data['html']['html'][i]['html'], function(key, val) {
                    var item;
                    if (key == 'id') id = val;
                    if (key == 'caption') {
                        label = "<label for='" + id + "'>" + val + "</label>";
                    } else {
                        var new_attr = " " + key + "='" + val + "'";
                        attr = attr + new_attr;
                    }
                });

                attr = attr + "></input>";
                item = open_tag + attr + label + close_tag;
                list_items.push(item);
            }
            
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
            // data = [-1];
            // func(data);
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
    var i, j;

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
                annot[3] = filterMap["traitGenes"][selectedTrack]; // numerical value of selected track
                annots.push(annot);
            }

            /* combine all annots of chromosome number chrNum */
            allTraitData["annots"][chrNum - 1]["annots"].push.apply(allTraitData["annots"][chrNum - 1]["annots"], annots);
        }
    }

    return allTraitData;
}

/* 
 * populate arr with trackData.json filepaths given selected track
 */
function getTrackDataUrls(selectedTrack) {
    var i, arr = [];

    for (i = 1; i < 13; i++) {
        var initFilepath = "http://172.29.4.215:8080/jbrowse-dev2/data/tracks/" + selectedTrack + "/chr";

        if (i > 9) {
            initFilepath = initFilepath + i.toString();
        } else {
            initFilepath = initFilepath + "0" + i.toString();
        }
        arr.push(initFilepath + "/trackData.json");
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

                    });

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
            return new Ideogram(config);
        }
    });
}

/*
 * remove data of selectedTrack in the allTraitData array
 */
function removeSelectedTrack(selectedTrack) {
    var num = filterMap["traitGenes"][selectedTrack],
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
    allTracks.push({
        track: track,
        trackIndex: allTracksCount,
        mapping: filterMap["traitGenes"][track]
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
