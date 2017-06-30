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
    "quantitativeTraitLoci": {
        "qtaroqtl": 1,
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
};

var colors = [
    {
        "id": "oryzabase_trait_genes",   
        "color": "#ff0000"
    },
    {
        "id": "qtaro_trait_genes",
        "id2": "qtaroqtlt",      
        "color": "#ff4000"
    },
    {
        "id": "qtarogenes_bacterial_blight_resistance",
        "id2": "qtaroqtl_bacterial_blight_resistance",      
        "color": "#ff8000"
    },
    {
        "id": "qtarogenes_blast_resistance",
        "id2": "qtaroqtl_blast_resistance",      
        "color": "#ffbf00"
    },
    {
        "id": "qtarogenes_cold_tolerance",
        "id2": "qtaroqtl_cold_tolerance",      
        "color": "#bfff00"
    },
    {
        "id": "qtarogenes_culm_leaf",
        "id2": "qtaroqtl_culm_leaf",      
        "color": "#80ff00"
    },
    {
        "id": "qtarogenes_drought_tolerance",
        "id2": "qtaroqtl_drought_tolerance",      
        "color": "#40ff00"
    },
    {
        "id": "qtarogenes_dwarf",
        "id2": "qtaroqtl_dwarf",      
        "color": "#00ff00"
    },
    {
        "id": "qtarogenes_eating_quality",
        "id2": "qtaroqtl_eating_quality",      
        "color": "#00ff40"
    },
    {
        "id": "qtarogenes_flowering",
        "id2": "qtaroqtl_flowering",      
        "color": "#00ff80"
    },
    {
        "id": "qtarogenes_germination_dormancy",
        "id2": "qtaroqtl_germination_dormancy",      
        "color": "#00ffbf"
    },
    {
        "id": "qtarogenes_insect_resistance",
        "id2": "qtaroqtl_insect_resistance",      
        "color": "#00ffff"
    },
    {
        "id": "qtarogenes_lethality",
        "id2": "qtaroqtl_lethality",      
        "color": "#00bfff"
    },
    {
        "id": "qtarogenes_lodging_resistance",
        "id2": "qtaroqtl_lodging_resistance",      
        "color": "#0080ff"
    },
    {
        "id": "qtarogenes_morphological_trait",
        "id2": "qtaroqtl_morphological_trait",      
        "color": "#0040ff"
    },
    {
        "id": "qtarogenes_other_disease_resistance",
        "id2": "qtaroqtl_other_disease_resistance",      
        "color": "#0000ff"
    },
    {
        "id": "qtarogenes_other_soil_stress_tolerance",
        "id2": "qtaroqtl_other_soil_stress_tolerance",      
        "color": "#4000ff"
    },
    {
        "id": "qtarogenes_other_stress_resistance",
        "id2": "qtaroqtl_other_stress_resistance",      
        "color": "#8000ff"
    },
    {
        "id": "qtarogenes_others",
        "id2": "qtaroqtl_others",      
        "color": "#bf00ff"
    },
    {
        "id": "qtarogenes_panicle_flower",
        "id2": "qtaroqtl_panicle_flower",      
        "color": "#ff00ff"
    },
    {
        "id": "qtarogenes_physiological_trait",
        "id2": "qtaroqtl_physiological_trait",      
        "color": "#ff00bf"
    },
    {
        "id": "qtarogenes_resistance_or_tolerance",
        "id2": "qtaroqtl_resistance_or_tolerance",      
        "color": "#ff0080"
    },
    {
        "id": "qtarogenes_root",
        "id2": "qtaroqtl_root",      
        "color": "#ff0040"
    },
    {
        "id": "qtarogenes_salinity_tolerance",
        "id2": "qtaroqtl_salinity_tolerance",      
        "color": "#b94646"
    },
    {
        "id": "qtarogenes_seed",
        "id2": "qtaroqtl_seed",      
        "color": "#99ccff"
    },
    {
        "id": "qtarogenes_sheath_blight_resistance",
        "id2": "qtaroqtl_sheath_blight_resistance",      
        "color": "#D0906D"
    },
    {
        "id": "qtarogenes_shoot_seedling",
        "id2": "qtaroqtl_shoot_seedling",      
        "color": "#004080"
    },
    {
        "id": "qtarogenes_source_activity",
        "id2": "qtaroqtl_source_activity",      
        "color": "#ddb880"
    },
    {
        "id": "qtarogenes_sterility",
        "id2": "qtaroqtl_sterility",      
        "color": "#a6ccf2"
    },
    {
        "id": "qtarogenes_submergency_tolerance",
        "id2": "qtaroqtl_submergency_tolerance",      
        "color": "#ff9999"
    }
];

$(document).ready(function(){
    var colorFillBlock;

    // adding color blocks to the trait genes section
    for (var i = 0; i < colors.length; i++) {
        colorFillBlock = colors[i]["color"];
        var classID = '#color-block-' + (filterMap["traitGenes"][key] - 1);
        $(classID).css({"outline-color": colorFillBlock, "background-color": colorFillBlock});
        console.log(colorFillBlock);
    }=
    // adding color blocks to the qtl section
    jQuery.each(filterMap["quantitativeTraitLoci"], function(key, value){
        colorFillBlock = colors[filterMap["quantitativeTraitLoci"][key] - 1]["color"];
        var classID = '#color-block-' + (filterMap["quantitativeTraitLoci"][key] - 1 + 30);
        $(classID).css({"outline-color": colorFillBlock, "background-color": colorFillBlock});
    });
});