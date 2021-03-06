// &+- relocated this javascript code to a separate file which will load
// &+- all of the necessary functions, such as activating a track and
// &+- initializing the ideogram

/* 
 * toggles view using radio buttons
 */
function getViewType(viewType) {

  var text = "";

  // change view to viewType
  if (viewType === "Histogram") {
    config.annotationsLayout = "histogram";
    text = "<b>Histogram view</b><br>Hover your mouse on a histogram bar to see count";
    
    // &+- reinitialize colorSettings (color blocks)
    // for (i = 0; i < colorSettings.length; i++) {
    //   colorFillBlock = "transparent";
    //   traitGeneID = '#color-block-' + (i);
    //   qtlID = '#color-block-' + (i + 30);
    //   $(traitGeneID).css({"outline-color": colorFillBlock, "background-color": colorFillBlock});
    //   $(qtlID).css({"outline-color": colorFillBlock, "background-color": colorFillBlock});
    // }
    // isTracksOn = false;
  
  } else if (viewType === "Tracks") {
    config.annotationsLayout = "tracks";
    text = "<b>Tracks view</b><br>Hover your mouse on an annotation to see gene feature's name";
  
    // &+- determine whether the user has clicked a trait/qtl while the user was on histogram mode going to track mode
    // jQuery.each(filterMap["qtl"], function(key, value){
    //   if(key === "QTARO QTL") key = "qtaroqtl"; 

    //   // &+- toggles on qtl 
    //   var IDForm = "filter-qtl-" + key;
    //   if($('input#' + IDForm).is(':checked')){
    //     fillColorBlock();
    //   }
    //   isTracksOn = true;

    //   // &+- changes radio to checkbox
    //   $('#filter-qtl-' + key).attr('name', key);
    //   $('#filter-qtl-' + key).attr('type', 'checkbox');
    // });
    // jQuery.each(filterMap["traitGenes"], function(key, value){
    //   // &+- toggles on trait genes
    //   var IDForm = "filter-traitGenes-" + key;
    //   if($('input#' + IDForm).is(':checked')){
    //     fillColorBlock();
    //   }
    //   isTracksOn = true;

    //   // &+- changes radio to checkbox
    //   $('#filter-traitGenes-' + key).attr('name', key);
    //   $('#filter-traitGenes-' + key).attr('type', 'checkbox');
    // });
  }

  // show linear scale
  toggleLinearScale("show");

  // clear current view
  d3.select("svg").remove();

  ideogram = new Ideogram(config);
  setUpBrush();
};

/*
 * triggered when checkbox is clicked to filter both histogram
 * and tracks view, as well the data in allTraitData
 */
function toggleFilter(checkbox) {
  console.log(allTracks);

  var id = checkbox.id,
    color, counts, key, count, isBrushAnnot = false, isSearchAnnot = false;
  /* get value of tracks attribute */
  var selectedTrack = $("#" + id).attr("tracks"),
      number = parseInt(checkbox.id.replace(/[^0-9\.]/g, ''), 10);

  if(selectedTrack.indexOf('brush') !== -1){
    color = arrayOfColorsBrushes[(number-59)];
    isBrushAnnot = true;
  }
  else if(selectedTrack.indexOf('search') !== -1){
    color = arrayOfColorsBrushes[(number-59)];
    isSearchAnnot = true;
  }    
  else{
    if(isTracksOn){
      // &+- added qtl data, more filering, more fun!
      if(checkbox.id.match('traitGenes') != null){
        color = colorSettings[filterMap["traitGenes"][selectedTrack] - 1]["color"];
      }
      else if(checkbox.id.match('qtl') != null){
        color = colorSettings[filterMap["qtl"][selectedTrack]]["color"];      
      }
    }
  }
    // console.log(color);
  
  if ($("#" + id).is(':checked')) {
    addTrack(selectedTrack);

    // &+- this is used for recraeting the annotations made via brush selection and search query
    if(isBrushAnnot){
      configureBrushAnnot((number-59), color, false, checkbox.id);
    }
    else if(isSearchAnnot){
      configureSearchAnnot((number-59), color, false, checkbox.id);
    }

    // &+- recreating the tracks at the default data set (QTL and traitgenes)
    /* get trackData urls */
    var trackDataUrls = getTrackDataUrls(selectedTrack);

    /* empty traitData to avoid duplication */
    traitData = [];

    /* clear current view */
    d3.select("#ideogram").remove();

    /* create new view w/ selectedTrack annots */
    ideogram = getTrackData(selectedTrack, trackDataUrls, config);

    /* show annots/tracks (tracks view filtering) */
    d3.selectAll("path[fill = '" + color + "']").attr("visibility", "show");
  }
  else {
    removeTrack(selectedTrack);

    /* update allTraitData */
    var ra = removeSelectedTrack(selectedTrack);
    config.rawAnnots = ra;

    /* clear current view */
    d3.select("#ideogram").remove();

    /* new view without selectedTrack*/
    ideogram = new Ideogram(config);

    /* hide annots/tracks (tracks view filtering) */
    d3.selectAll("path[fill = '" + color + "']").attr("visibility", "hidden");
  }
  if (getAllTracksCount() > 0) {
    $("#jb-div").show();
  }

}

// &+- fills up the color blocks. the color in the color blocks will correspond to the
// &+- color used in the tracks annotations (only) || triggered when a user picks one from the 
// &+- checkbox of trait genes/qtl
function colorBlindMode(category){
    if(category === 'proto') config.annotationTracks = protanopiaNoRed;
    else if(category === 'deuto') config.annotationTracks = deutanopiaNoGreen;
    else if(category === 'trito') config.annotationTracks = tritanopiaNoBlue;
    else config.annotationTracks = defaultColor;
    
    toggleLinearScale("show");

    d3.select("svg").remove();

    ideogram = new Ideogram(config);
    adjustIdeogramSVG();
    dropdownMenuSetup();
    fillColorBlock();
}

// &+- programatically open the tabs
document.getElementById("defaultOpen").click();
document.getElementById("goToInstr").click();

// &+- this filtermap was used to get the index of the color listed on jrf.form.js which was initially coded by Ms. Lawas
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
    "qtarogenes_shoot_seedling": 27,
    "qtarogenes_source_activity": 28,
    "qtarogenes_sterility": 29,
    "qtarogenes_submergency_tolerance": 30
  },
  "qtl": {
    "QTARO QTL": 31,
    "qtaroqtl_bacterial_blight_resistance": 32,
    "qtaroqtl_blast_resistance": 33,
    "qtaroqtl_cold_tolerance": 34,
    "qtaroqtl_culm_leaf": 35,
    "qtaroqtl_drought_tolerance": 36,
    "qtaroqtl_dwarf": 37,
    "qtaroqtl_eating_quality": 38,
    "qtaroqtl_flowering": 39,
    "qtaroqtl_germination_dormancy": 40,
    "qtaroqtl_insect_resistance": 41,
    "qtaroqtl_lethality": 42,
    "qtaroqtl_lodging_resistance": 43,
    "qtaroqtl_morphological_trait": 44,
    "qtaroqtl_other_disease_resistance": 45,
    "qtaroqtl_other_soil_stress_tolerance": 46,
    "qtaroqtl_other_stress_resistance": 47,
    "qtaroqtl_others": 48,
    "qtaroqtl_panicle_flower": 49,
    "qtaroqtl_physiological_trait": 50,
    "qtaroqtl_resistance_or_tolerance": 51,
    "qtaroqtl_root": 52,
    "qtaroqtl_salinity_tolerance": 53,
    "qtaroqtl_seed": 54,
    "qtaroqtl_sheath_blight_resistance": 55,
    "qtaroqtl_shoot_seedling": 56,
    "qtaroqtl_source_activity": 57,
    "qtaroqtl_sterility": 58,
    "qtaroqtl_submergency_tolerance": 59
  }
};

/* annotColorConfig */
var colorSettings = defaultColor;

/* width and height config */
var w = $(window).width() * .01,
  h = $(window).height() * .9;

// $+- brush function:: data presentation
function writeSelectedRange(){}

// &+- to determine whether the color blocks must appear or not
var isTracksOn = false;

var config = {
  organism: "rice",
  barWidth: 4,
  chrWidth: 18,
  chrHeight: 800,
  chrMargin: 30,
  annotationHeight: 4,
  annotationTracks: colorSettings,
  annotationsLayout: "tracks",
  container: "#chromosome-render",

  // &+- added the brush feature
  brush: true,
  onBrushMove: writeSelectedRange,
  onLoad: writeSelectedRange,
};

var ideogram;

/* render default view as histogram */
getViewType("Tracks");
$('#view-type_tracks').attr('checked', true);

renderCollapsible("/ideogram-extension/data/filter/dataSet.json");
plugCollapsibleJQuery();
fillColorBlock();

/* default of jbrowse is hidden */
$("#jbrowse").hide();