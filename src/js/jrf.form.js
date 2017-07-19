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
        },
        "brush": {

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
    lfUrls = [],
    dropdownMenuForm = '<foreignObject width="100" height="500" requiredExtensions="http://www.w3.org/1999/xhtml"><ul class="hover"><li class="hoverli"><ul class="file_menu"><li class="header-menu"><b class="white-text">Options</b></li><li><a id="brush0" class="show-jbrowse" onclick="redirectToJBrowse(this.id)">Show in JBrowse</a></li><li><a class="show-genes" onclick="showStatiscalTable()">Show all genes</a></li><li><a class="plot-genes" onclick="plotGeneAnnotation()">Plot all genes</a></li><hr id="divider"><li class="header-menu"><b class="white-text">Brush</b></li><li><a id="brush0" class="identify-the-brush" onclick="deleteThisBrush(this.id)">Delete this brush</a></li><li><a onclick="deleteAllBrush()">Delete all brush</a></li><hr id="divider"><li class="header-menu"><b class="white-text">Set base pair range</b></li><li><form class="white-text-default"><label for="StartBP">Start:</label><input type="number" name="StartBP" value="startBp" class="inline-textbox" id="startBPTextbox"></form></li><li><form class="white-text-default"><label for="EndBP">End:</label><input type="number" name="EndBP" value="stopBp" class="inline-textbox" id="endBPTextbox"></form></li><li id="range-details"><p class="white-text-smaller" id="chr-name-details"><b class="white-text-smaller" id="chr-name"></b>max:<b class="white-text-smaller" id="chr-name-max"></b><button type="button" id="brush0" class="submit-chr-details" onclick="setTheBrush(this.id)">Submit</button></p></li><li><p class="red-text" id="message-input-menu"></li></ul></li></ul></foreignObject>',
    defaultColor = [
        {
          "id": "oryzabase_trait_genes",
          "displayName": "Oryzabase Trait Gene Loci",
          "color": "#424242"
        },
        {
          "id": "qtaro_trait_genes",
          "id2": "QTARO QTL",
          "displayName": "All QTARO trait genes",
          "color": "#F44336"
        },
        {
          "id": "qtarogenes_bacterial_blight_resistance",
          "id2": "qtaroqtl_bacterial_blight_resistance",
          "displayName": "Bacterial blight resistance",
          "color": "#9C27B0"
        },
        {
          "id": "qtarogenes_blast_resistance",
          "id2": "qtaroqtl_blast_resistance",
          "displayName": "Blast resistance",
          "color": "#673AB7"
        },
        {
          "id": "qtarogenes_cold_tolerance",
          "id2": "qtaroqtl_cold_tolerance",
          "displayName": "Cold tolerance",
          "color": "#3F51B5"
        },
        {
          "id": "qtarogenes_culm_leaf",
          "id2": "qtaroqtl_culm_leaf",
          "displayName": "Culm leaf",
          "color": "#2196F3"
        },
        {
          "id": "qtarogenes_drought_tolerance",
          "id2": "qtaroqtl_drought_tolerance",
          "displayName": "Drought tolerance",
          "color": "#00BCD4"
        },
        {
          "id": "qtarogenes_dwarf",
          "id2": "qtaroqtl_dwarf",
          "displayName": "Dwarf",
          "color": "#009688"
        },
        {
          "id": "qtarogenes_eating_quality",
          "id2": "qtaroqtl_eating_quality",
          "displayName": "Eating quality",
          "color": "#8BC34A"
        },
        {
          "id": "qtarogenes_flowering",
          "id2": "qtaroqtl_flowering",
          "displayName": "Flowering Trait",
          "color": "#69F0AE"
        },
        {
          "id": "qtarogenes_germination_dormancy",
          "id2": "qtaroqtl_germination_dormancy",
          "displayName": "Germination dormancy",
          "color": "#FFC107"
        },
        {
          "id": "qtarogenes_insect_resistance",
          "id2": "qtaroqtl_insect_resistance",
          "displayName": "Insect resistance",
          "color": "#FF9800"
        },
        {
          "id": "qtarogenes_lethality",
          "id2": "qtaroqtl_lethality",
          "displayName": "Lethality Trait",
          "color": "#FF5722"
        },
        {
          "id": "qtarogenes_lodging_resistance",
          "id2": "qtaroqtl_lodging_resistance",
          "displayName": "Lodging resistance",
          "color": "#795548"
        },
        {
          "id": "qtarogenes_morphological_trait",
          "id2": "qtaroqtl_morphological_trait",
          "displayName": "Morphological trait",
          "color": "#9E9E9E"
        },
        {
          "id": "qtarogenes_other_disease_resistance",
          "id2": "qtaroqtl_other_disease_resistance",
          "displayName": "Other disease resistance",
          "color": "#607D8B"
        },
        {
          "id": "qtarogenes_other_soil_stress_tolerance",
          "id2": "qtaroqtl_other_soil_stress_tolerance",
          "displayName": "Other soil stress tolerance",
          "color": "#B71C1C"
        },
        {
          "id": "qtarogenes_other_stress_resistance",
          "id2": "qtaroqtl_other_stress_resistance",
          "displayName": "Other stress resistance",
          "color": "#880E4F"
        },
        {
          "id": "qtarogenes_others",
          "id2": "qtaroqtl_others",
          "displayName": "Others",
          "color": "#4A148C"
        },
        {
          "id": "qtarogenes_panicle_flower",
          "id2": "qtaroqtl_panicle_flower",
          "displayName": "Panicle flower",
          "color": "#311B92"
        },
        {
          "id": "qtarogenes_physiological_trait",
          "id2": "qtaroqtl_physiological_trait",
          "displayName": "Physiological trait",
          "color": "#1A237E"
        },
        {
          "id": "qtarogenes_resistance_or_tolerance",
          "id2": "qtaroqtl_resistance_or_tolerance",
          "displayName": "Resistance or tolerance",
          "color": "#0D47A1"
        },
        {
          "id": "qtarogenes_root",
          "id2": "qtaroqtl_root",
          "displayName": "Root",
          "color": "#01579B"
        },
        {
          "id": "qtarogenes_salinity_tolerance",
          "id2": "qtaroqtl_salinity_tolerance",
          "displayName": "Salinity tolerance",
          "color": "#006064"
        },
        {
          "id": "qtarogenes_seed",
          "id2": "qtaroqtl_seed",
          "displayName": "Seed",
          "color": "#004D40"
        },
        {
          "id": "qtarogenes_sheath_blight_resistance",
          "id2": "qtaroqtl_sheath_blight_resistance",
          "displayName": "Sheath blight resistance",
          "color": "#1B5E20"
        },
        {
          "id": "qtarogenes_shoot_seedling",
          "id2": "qtaroqtl_shoot_seedling",
          "displayName": "Shoot seedling",
          "color": "#827717"
        },
        {
          "id": "qtarogenes_source_activity",
          "id2": "qtaroqtl_source_activity",
          "displayName": "Source activity",
          "color": "#3E2723"
        },
        {
          "id": "qtarogenes_sterility",
          "id2": "qtaroqtl_sterility",
          "displayName": "Sterility",
          "color": "#212121"
        },
        {
          "id": "qtarogenes_submergency_tolerance",
          "id2": "qtaroqtl_submergency_tolerance",
          "displayName": "Submergency tolerance",
          "color": "#BDBDBD"
        }
    ],
    nightModeColor = [
        {
        "id": "oryzabase_trait_genes",
        "displayName": "Oryzabase Trait Gene Loci",
        "color": "#FF1744"
        },
        {
            "id": "qtaro_trait_genes",
            "id2": "QTARO QTL",
            "displayName": "All QTARO trait genes",
            "color": "#F44336"
        },
        {
            "id": "qtarogenes_bacterial_blight_resistance",
            "id2": "qtaroqtl_bacterial_blight_resistance",
            "displayName": "Bacterial blight resistance",
            "color": "#9C27B0"
        },
        {
            "id": "qtarogenes_blast_resistance",
            "id2": "qtaroqtl_blast_resistance",
            "displayName": "Blast resistance",
            "color": "#673AB7"
        },
        {
            "id": "qtarogenes_cold_tolerance",
            "id2": "qtaroqtl_cold_tolerance",
            "displayName": "Cold tolerance",
            "color": "#3F51B5"
        },
        {
            "id": "qtarogenes_culm_leaf",
            "id2": "qtaroqtl_culm_leaf",
            "displayName": "Culm leaf",
            "color": "#2196F3"
        },
        {
            "id": "qtarogenes_drought_tolerance",
            "id2": "qtaroqtl_drought_tolerance",
            "displayName": "Drought tolerance",
            "color": "#00BCD4"
        },
        {
            "id": "qtarogenes_dwarf",
            "id2": "qtaroqtl_dwarf",
            "displayName": "Dwarf",
            "color": "#009688"
        },
        {
            "id": "qtarogenes_eating_quality",
            "id2": "qtaroqtl_eating_quality",
            "displayName": "Eating quality",
            "color": "#8BC34A"
        },
        {
            "id": "qtarogenes_flowering",
            "id2": "qtaroqtl_flowering",
            "displayName": "Flowering Trait",
            "color": "#69F0AE"
        },
        {
            "id": "qtarogenes_germination_dormancy",
            "id2": "qtaroqtl_germination_dormancy",
            "displayName": "Germination dormancy",
            "color": "#FFC107"
        },
        {
            "id": "qtarogenes_insect_resistance",
            "id2": "qtaroqtl_insect_resistance",
            "displayName": "Insect resistance",
            "color": "#FF9800"
        },
        {
            "id": "qtarogenes_lethality",
            "id2": "qtaroqtl_lethality",
            "displayName": "Lethality Trait",
            "color": "#FF5722"
        },
        {
            "id": "qtarogenes_lodging_resistance",
            "id2": "qtaroqtl_lodging_resistance",
            "displayName": "Lodging resistance",
            "color": "#795548"
        },
        {
            "id": "qtarogenes_morphological_trait",
            "id2": "qtaroqtl_morphological_trait",
            "displayName": "Morphological trait",
            "color": "#9E9E9E"
        },
        {
            "id": "qtarogenes_other_disease_resistance",
            "id2": "qtaroqtl_other_disease_resistance",
            "displayName": "Other disease resistance",
            "color": "#607D8B"
        },
        {
            "id": "qtarogenes_other_soil_stress_tolerance",
            "id2": "qtaroqtl_other_soil_stress_tolerance",
            "displayName": "Other soil stress tolerance",
            "color": "#E57373"
        },
        {
            "id": "qtarogenes_other_stress_resistance",
            "id2": "qtaroqtl_other_stress_resistance",
            "displayName": "Other stress resistance",
            "color": "#F06292"
        },
        {
            "id": "qtarogenes_others",
            "id2": "qtaroqtl_others",
            "displayName": "Others",
            "color": "#BA68C8"
        },
        {
            "id": "qtarogenes_panicle_flower",
            "id2": "qtaroqtl_panicle_flower",
            "displayName": "Panicle flower",
            "color": "#9575CD"
        },
        {
            "id": "qtarogenes_physiological_trait",
            "id2": "qtaroqtl_physiological_trait",
            "displayName": "Physiological trait",
            "color": "#7986CB"
        },
        {
            "id": "qtarogenes_resistance_or_tolerance",
            "id2": "qtaroqtl_resistance_or_tolerance",
            "displayName": "Resistance or tolerance",
            "color": "#64B5F6"
        },
        {
            "id": "qtarogenes_root",
            "id2": "qtaroqtl_root",
            "displayName": "Root",
            "color": "#4FC3F7"
        },
        {
            "id": "qtarogenes_salinity_tolerance",
            "id2": "qtaroqtl_salinity_tolerance",
            "displayName": "Salinity tolerance",
            "color": "#4DD0E1"
        },
        {
            "id": "qtarogenes_seed",
            "id2": "qtaroqtl_seed",
            "displayName": "Seed",
            "color": "#4DB6AC"
        },
        {
            "id": "qtarogenes_sheath_blight_resistance",
            "id2": "qtaroqtl_sheath_blight_resistance",
            "displayName": "Sheath blight resistance",
            "color": "#81C784"
        },
        {
            "id": "qtarogenes_shoot_seedling",
            "id2": "qtaroqtl_shoot_seedling",
            "displayName": "Shoot seedling",
            "color": "#AED581"
        },
        {
            "id": "qtarogenes_source_activity",
            "id2": "qtaroqtl_source_activity",
            "displayName": "Source activity",
            "color": "#DCE775"
        },
        {
            "id": "qtarogenes_sterility",
            "id2": "qtaroqtl_sterility",
            "displayName": "Sterility",
            "color": "#FFF176"
        },
        {
            "id": "qtarogenes_submergency_tolerance",
            "id2": "qtaroqtl_submergency_tolerance",
            "displayName": "Submergency tolerance",
            "color": "#FFD54F"
        }
    ],
    protanopiaNoRed = [
        {
            "id": "oryzabase_trait_genes",
            "displayName": "Oryzabase Trait Gene Loci",
            "color": "#000E1F"
        },
        {
            "id": "qtaro_trait_genes",
            "id2": "QTARO QTL",
            "displayName": "All QTARO trait genes",
            "color": "#001D3E"
        },
        {
            "id": "qtarogenes_bacterial_blight_resistance",
            "id2": "qtaroqtl_bacterial_blight_resistance",
            "displayName": "Bacterial blight resistance",
            "color": "#002C5D"
        },
        {
            "id": "qtarogenes_blast_resistance",
            "id2": "qtaroqtl_blast_resistance",
            "displayName": "Blast resistance",
            "color": "#003B7C"
        },
        {
            "id": "qtarogenes_cold_tolerance",
            "id2": "qtaroqtl_cold_tolerance",
            "displayName": "Cold tolerance",
            "color": "#004A9C"
        },
        {
            "id": "qtarogenes_culm_leaf",
            "id2": "qtaroqtl_culm_leaf",
            "displayName": "Culm leaf",
            "color": "#1D366A"
        },
        {
            "id": "qtarogenes_drought_tolerance",
            "id2": "qtaroqtl_drought_tolerance",
            "displayName": "Drought tolerance",
            "color": "#003F85"
        },
        {
            "id": "qtarogenes_dwarf",
            "id2": "qtaroqtl_dwarf",
            "displayName": "Dwarf",
            "color": "#004A9B"
        },
        {
            "id": "qtarogenes_eating_quality",
            "id2": "qtaroqtl_eating_quality",
            "displayName": "Eating quality",
            "color": "#0056B4"
        },
        {
            "id": "qtarogenes_flowering",
            "id2": "qtaroqtl_flowering",
            "displayName": "Flowering Trait",
            "color": "#5A699B"
        },
        {
            "id": "qtarogenes_germination_dormancy",
            "id2": "qtaroqtl_germination_dormancy",
            "displayName": "Germination dormancy",
            "color": "#3A6DD4"
        },
        {
            "id": "qtarogenes_insect_resistance",
            "id2": "qtaroqtl_insect_resistance",
            "displayName": "Insect resistance",
            "color": "#0075F8"
        },
        {
            "id": "qtarogenes_lethality",
            "id2": "qtaroqtl_lethality",
            "displayName": "Lethality Trait",
            "color": "#8F9BCD"
        },
        {
            "id": "qtarogenes_lodging_resistance",
            "id2": "qtaroqtl_lodging_resistance",
            "displayName": "Lodging resistance",
            "color": "#7FA0FF"
        },
        {
            "id": "qtarogenes_morphological_trait",
            "id2": "qtaroqtl_morphological_trait",
            "displayName": "Morphological trait",
            "color": "#C4CEFF"
        },
        {
            "id": "qtarogenes_other_disease_resistance",
            "id2": "qtaroqtl_other_disease_resistance",
            "displayName": "Other disease resistance",
            "color": "#312B00"
        },
        {
            "id": "qtarogenes_other_soil_stress_tolerance",
            "id2": "qtaroqtl_other_soil_stress_tolerance",
            "displayName": "Other soil stress tolerance",
            "color": "#625700"
        },
        {
            "id": "qtarogenes_other_stress_resistance",
            "id2": "qtaroqtl_other_stress_resistance",
            "displayName": "Other stress resistance",
            "color": "#635A2F"
        },
        {
            "id": "qtarogenes_others",
            "id2": "qtaroqtl_others",
            "displayName": "Others",
            "color": "#938200"
        },
        {
            "id": "qtarogenes_panicle_flower",
            "id2": "qtaroqtl_panicle_flower",
            "displayName": "Panicle flower",
            "color": "#94852D"
        },
        {
            "id": "qtarogenes_physiological_trait",
            "id2": "qtaroqtl_physiological_trait",
            "displayName": "Physiological trait",
            "color": "#978C60"
        },
        {
            "id": "qtarogenes_resistance_or_tolerance",
            "id2": "qtaroqtl_resistance_or_tolerance",
            "displayName": "Resistance or tolerance",
            "color": "#C4AE00"
        },
        {
            "id": "qtarogenes_root",
            "id2": "qtaroqtl_root",
            "displayName": "Root",
            "color": "#C5B02B"
        },
        {
            "id": "qtarogenes_salinity_tolerance",
            "id2": "qtaroqtl_salinity_tolerance",
            "displayName": "Salinity tolerance",
            "color": "#C7B55E"
        },
        {
            "id": "qtarogenes_seed",
            "id2": "qtaroqtl_seed",
            "displayName": "Seed",
            "color": "#CBBE92"
        },
        {
            "id": "qtarogenes_sheath_blight_resistance",
            "id2": "qtaroqtl_sheath_blight_resistance",
            "displayName": "Sheath blight resistance",
            "color": "#F5DA00"
        },
        {
            "id": "qtarogenes_shoot_seedling",
            "id2": "qtaroqtl_shoot_seedling",
            "displayName": "Shoot seedling",
            "color": "#F6DB29"
        },
        {
            "id": "qtarogenes_source_activity",
            "id2": "qtaroqtl_source_activity",
            "displayName": "Source activity",
            "color": "#F8DF5C"
        },
        {
            "id": "qtarogenes_sterility",
            "id2": "qtaroqtl_sterility",
            "displayName": "Sterility",
            "color": "#FBE68F"
        },
        {
            "id": "qtarogenes_submergency_tolerance",
            "id2": "qtaroqtl_submergency_tolerance",
            "displayName": "Submergency tolerance",
            "color": "#FFF0C6"
        }
    ],    
    deutanopiaNoGreen = [
        {
            "id": "oryzabase_trait_genes",
            "displayName": "Oryzabase Trait Gene Loci",
            "color": "#000E1F"
        },
        {
            "id": "qtaro_trait_genes",
            "id2": "QTARO QTL",
            "displayName": "All QTARO trait genes",
            "color": "#001D3E"
        },
        {
            "id": "qtarogenes_bacterial_blight_resistance",
            "id2": "qtaroqtl_bacterial_blight_resistance",
            "displayName": "Bacterial blight resistance",
            "color": "#002C5D"
        },
        {
            "id": "qtarogenes_blast_resistance",
            "id2": "qtaroqtl_blast_resistance",
            "displayName": "Blast resistance",
            "color": "#003B7C"
        },
        {
            "id": "qtarogenes_cold_tolerance",
            "id2": "qtaroqtl_cold_tolerance",
            "displayName": "Cold tolerance",
            "color": "#004A9C"
        },
        {
            "id": "qtarogenes_culm_leaf",
            "id2": "qtaroqtl_culm_leaf",
            "displayName": "Culm leaf",
            "color": "#1D366A"
        },
        {
            "id": "qtarogenes_drought_tolerance",
            "id2": "qtaroqtl_drought_tolerance",
            "displayName": "Drought tolerance",
            "color": "#003F85"
        },
        {
            "id": "qtarogenes_dwarf",
            "id2": "qtaroqtl_dwarf",
            "displayName": "Dwarf",
            "color": "#004A9B"
        },
        {
            "id": "qtarogenes_eating_quality",
            "id2": "qtaroqtl_eating_quality",
            "displayName": "Eating quality",
            "color": "#0056B4"
        },
        {
            "id": "qtarogenes_flowering",
            "id2": "qtaroqtl_flowering",
            "displayName": "Flowering Trait",
            "color": "#5A699B"
        },
        {
            "id": "qtarogenes_germination_dormancy",
            "id2": "qtaroqtl_germination_dormancy",
            "displayName": "Germination dormancy",
            "color": "#3A6DD4"
        },
        {
            "id": "qtarogenes_insect_resistance",
            "id2": "qtaroqtl_insect_resistance",
            "displayName": "Insect resistance",
            "color": "#0075F8"
        },
        {
            "id": "qtarogenes_lethality",
            "id2": "qtaroqtl_lethality",
            "displayName": "Lethality Trait",
            "color": "#8F9BCD"
        },
        {
            "id": "qtarogenes_lodging_resistance",
            "id2": "qtaroqtl_lodging_resistance",
            "displayName": "Lodging resistance",
            "color": "#7FA0FF"
        },
        {
            "id": "qtarogenes_morphological_trait",
            "id2": "qtaroqtl_morphological_trait",
            "displayName": "Morphological trait",
            "color": "#C4CEFF"
        },
        {
            "id": "qtarogenes_other_disease_resistance",
            "id2": "qtaroqtl_other_disease_resistance",
            "displayName": "Other disease resistance",
            "color": "#36290B"
        },
        {
            "id": "qtarogenes_other_soil_stress_tolerance",
            "id2": "qtaroqtl_other_soil_stress_tolerance",
            "displayName": "Other soil stress tolerance",
            "color": "#6D5216"
        },
        {
            "id": "qtarogenes_other_stress_resistance",
            "id2": "qtaroqtl_other_stress_resistance",
            "displayName": "Other stress resistance",
            "color": "#A47B21"
        },
        {
            "id": "qtarogenes_others",
            "id2": "qtaroqtl_others",
            "displayName": "Others",
            "color": "#DAA52C"
        },
        {
            "id": "qtarogenes_panicle_flower",
            "id2": "qtaroqtl_panicle_flower",
            "displayName": "Panicle flower",
            "color": "#FFD28E"
        },
        {
            "id": "qtarogenes_physiological_trait",
            "id2": "qtaroqtl_physiological_trait",
            "displayName": "Physiological trait",
            "color": "#6D5636"
        },
        {
            "id": "qtarogenes_resistance_or_tolerance",
            "id2": "qtaroqtl_resistance_or_tolerance",
            "displayName": "Resistance or tolerance",
            "color": "#A47E3B"
        },
        {
            "id": "qtarogenes_root",
            "id2": "qtaroqtl_root",
            "displayName": "Root",
            "color": "#DBA741"
        },
        {
            "id": "qtarogenes_salinity_tolerance",
            "id2": "qtaroqtl_salinity_tolerance",
            "displayName": "Salinity tolerance",
            "color": "#FFD495"
        },
        {
            "id": "qtarogenes_seed",
            "id2": "qtaroqtl_seed",
            "displayName": "Seed",
            "color": "#A5866A"
        },
        {
            "id": "qtarogenes_sheath_blight_resistance",
            "id2": "qtaroqtl_sheath_blight_resistance",
            "displayName": "Sheath blight resistance",
            "color": "#DBAC6D"
        },
        {
            "id": "qtarogenes_shoot_seedling",
            "id2": "qtaroqtl_shoot_seedling",
            "displayName": "Shoot seedling",
            "color": "#FFD8A8"
        },
        {
            "id": "qtarogenes_source_activity",
            "id2": "qtaroqtl_source_activity",
            "displayName": "Source activity",
            "color": "#DCB79D"
        },
        {
            "id": "qtarogenes_sterility",
            "id2": "qtaroqtl_sterility",
            "displayName": "Sterility",
            "color": "#FFE1C5"
        },
        {
            "id": "qtarogenes_submergency_tolerance",
            "id2": "qtaroqtl_submergency_tolerance",
            "displayName": "Submergency tolerance",
            "color": "#FFEEE5"
        }
    ],
    tritanopiaNoBlue = [
        {
            "id": "oryzabase_trait_genes",
            "displayName": "Oryzabase Trait Gene Loci",
            "color": "#152F33"
        },
        {
            "id": "qtaro_trait_genes",
            "id2": "QTARO QTL",
            "displayName": "All QTARO trait genes",
            "color": "#2A5E66"
        },
        {
            "id": "qtarogenes_bacterial_blight_resistance",
            "id2": "qtaroqtl_bacterial_blight_resistance",
            "displayName": "Bacterial blight resistance",
            "color": "#408E99"
        },
        {
            "id": "qtarogenes_blast_resistance",
            "id2": "qtaroqtl_blast_resistance",
            "displayName": "Blast resistance",
            "color": "#55BDCC"
        },
        {
            "id": "qtarogenes_cold_tolerance",
            "id2": "qtaroqtl_cold_tolerance",
            "displayName": "Cold tolerance",
            "color": "#71ECFF"
        },
        {
            "id": "qtarogenes_culm_leaf",
            "id2": "qtaroqtl_culm_leaf",
            "displayName": "Culm leaf",
            "color": "#3E6067"
        },
        {
            "id": "qtarogenes_drought_tolerance",
            "id2": "qtaroqtl_drought_tolerance",
            "displayName": "Drought tolerance",
            "color": "#4D8F9A"
        },
        {
            "id": "qtarogenes_dwarf",
            "id2": "qtaroqtl_dwarf",
            "displayName": "Dwarf",
            "color": "#5FBECD"
        },
        {
            "id": "qtarogenes_eating_quality",
            "id2": "qtaroqtl_eating_quality",
            "displayName": "Eating quality",
            "color": "#7AECFF"
        },
        {
            "id": "qtarogenes_flowering",
            "id2": "qtaroqtl_flowering",
            "displayName": "Flowering Trait",
            "color": "#70929D"
        },
        {
            "id": "qtarogenes_germination_dormancy",
            "id2": "qtaroqtl_germination_dormancy",
            "displayName": "Germination dormancy",
            "color": "#7CC0CF"
        },
        {
            "id": "qtarogenes_insect_resistance",
            "id2": "qtaroqtl_insect_resistance",
            "displayName": "Insect resistance",
            "color": "#96EDFF"
        },
        {
            "id": "qtarogenes_lethality",
            "id2": "qtaroqtl_lethality",
            "displayName": "Lethality Trait",
            "color": "#A3C4D3"
        },
        {
            "id": "qtarogenes_lodging_resistance",
            "id2": "qtaroqtl_lodging_resistance",
            "displayName": "Lodging resistance",
            "color": "#BCEFFF"
        },
        {
            "id": "qtarogenes_morphological_trait",
            "id2": "qtaroqtl_morphological_trait",
            "displayName": "Morphological trait",
            "color": "#E3F4FF"
        },
        {
            "id": "qtarogenes_other_disease_resistance",
            "id2": "qtaroqtl_other_disease_resistance",
            "displayName": "Other disease resistance",
            "color": "#FD1700"
        },
        {
            "id": "qtarogenes_other_soil_stress_tolerance",
            "id2": "qtaroqtl_other_soil_stress_tolerance",
            "displayName": "Other soil stress tolerance",
            "color": "#CA1200"
        },
        {
            "id": "qtarogenes_other_stress_resistance",
            "id2": "qtaroqtl_other_stress_resistance",
            "displayName": "Other stress resistance",
            "color": "#FF3332"
        },
        {
            "id": "qtarogenes_others",
            "id2": "qtaroqtl_others",
            "displayName": "Others",
            "color": "#970E00"
        },
        {
            "id": "qtarogenes_panicle_flower",
            "id2": "qtaroqtl_panicle_flower",
            "displayName": "Panicle flower",
            "color": "#CC3234"
        },
        {
            "id": "qtarogenes_physiological_trait",
            "id2": "qtaroqtl_physiological_trait",
            "displayName": "Physiological trait",
            "color": "#FF656B"
        },
        {
            "id": "qtarogenes_resistance_or_tolerance",
            "id2": "qtaroqtl_resistance_or_tolerance",
            "displayName": "Resistance or tolerance",
            "color": "#650900"
        },
        {
            "id": "qtarogenes_root",
            "id2": "qtaroqtl_root",
            "displayName": "Root",
            "color": "#993235"
        },
        {
            "id": "qtarogenes_salinity_tolerance",
            "id2": "qtaroqtl_salinity_tolerance",
            "displayName": "Salinity tolerance",
            "color": "#CC656C"
        },
        {
            "id": "qtarogenes_seed",
            "id2": "qtaroqtl_seed",
            "displayName": "Seed",
            "color": "#FF97A2"
        },
        {
            "id": "qtarogenes_sheath_blight_resistance",
            "id2": "qtaroqtl_sheath_blight_resistance",
            "displayName": "Sheath blight resistance",
            "color": "#320400"
        },
        {
            "id": "qtarogenes_shoot_seedling",
            "id2": "qtaroqtl_shoot_seedling",
            "displayName": "Shoot seedling",
            "color": "#663236"
        },
        {
            "id": "qtarogenes_source_activity",
            "id2": "qtaroqtl_source_activity",
            "displayName": "Source activity",
            "color": "#99646C"
        },
        {
            "id": "qtarogenes_sterility",
            "id2": "qtaroqtl_sterility",
            "displayName": "Sterility",
            "color": "#CD97A3"
        },
        {
            "id": "qtarogenes_submergency_tolerance",
            "id2": "qtaroqtl_submergency_tolerance",
            "displayName": "Submergency tolerance",
            "color": "#FFCAD9"
        }
    ],
    brushAnnots = [];

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

function fillColorBlock(){
    var index = 0, colorFillBlock;
    
    // &+- adding color blocks to the trait genes section
    $.each(ideogram.config.annotationTracks, function(key, val) {
        colorFillBlock = val['color'];
        traitGeneID = '#color-block-' + (index);
        qtlID = '#color-block-' + (index + 30);
        $(traitGeneID).css('background-color', colorFillBlock);
        $(qtlID).css('background-color', colorFillBlock);
        index = index + 1;
    });
}


var renderCollapsible = function(filepath) {
    $.getJSON(filepath, function(data) {
        for (var category in data) {
            var content = data[category],
                list_items = [],
                ultag = $('<ul/>');

            for (var i = 0; i < content['collapsible_content'].length; i++) {
                var open_tag = "<" + content['collapsible_content'][i]['tag'] + " class='hoverable-li'>",
                    close_tag = "</" + content['collapsible_content'][i]['tag'] + ">",
                    attr = "<input",
                    label = "",
                    id = "",
                    colorBlock;

                // &+- inserts the div tag of the color block
                if(category === 'traitGenes'){
                    colorBlock = '<div class="color-block" id="color-block-' + (i) + '"></div>';
                }
                else if(category === 'qtl'){
                    colorBlock = '<div class="color-block" id="color-block-' + (i+30) + '"></div>';                    
                }

                $.each(content['collapsible_content'][i]['html'], function(key, val) {
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

            $(list_items.join('')).appendTo(ultag);
            $(ultag).appendTo('#' + content['id']);
            $('#' + content['appendToClass']).text(' ' + content['header']);
        }
    })
    .done(function() {
        console.log("Form rendered");
        fillColorBlock();
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
    var i, j, category;

    // &+- added to determine if the option is a qtl
    var qtlIdentifier = new RegExp("(qtl|QTL)"),
        brushIdentifier = new RegExp("brush"),
        searchIdentifier = new RegExp("search");

    if(qtlIdentifier.test(selectedTrack)){
        category = "qtl";
    } 
    else if(brushIdentifier.test(selectedTrack) || searchIdentifier.test(selectedTrack)){
        category = "brush";
    } 
    else {
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
            setUpBrush();
            setUpZoomButtons();
            return ideogram;
        }
    });
}

var brushTrackCount = 100;

/*
 * remove data of selectedTrack in the allTraitData array
 */
function removeSelectedTrack(selectedTrack) {
    // &+-
    console.log(allTraitData);
    var qtlIdentifier = new RegExp("(qtl|QTL)"),
        brushIdentifier = new RegExp("brush"),
        searchIdentifier = new RegExp("search"),
        category, i, j, num;

    if(brushIdentifier.test(selectedTrack) || searchIdentifier.test(selectedTrack)){
        category = "brush";    

        num = filterMap[category][selectedTrack];
        for (i = 0; i < 12; i++) {
            var numOfAnnots = allTraitData["annots"][i]["annots"].length;

            for (j = 0; j < numOfAnnots; j++) {
                console.log(allTraitData["annots"][i]["annots"][j]);
                // if (allTraitData["annots"][i]["annots"][j][3] === num) {
                //     allTraitData["annots"][i]["annots"].splice(j, 1);
                //     j--;
                //     numOfAnnots--;
                // }
            }
        }
    }
    else{
        if(qtlIdentifier.test(selectedTrack)){
            category = "qtl";
        }
        else{
            category = "traitGenes";
        }

        num = filterMap[category][selectedTrack];
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
    }
    
    // console.log(allTraitData);
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
    // &+- determines whether the track to be added is a qtl or trait gene 
    var qtlIdentifier = new RegExp("(qtl|QTL)"),
        brushIdentifier = new RegExp("brush"),
        category, mapValue;

    if(jQuery.isEmptyObject(filterMap['brush'])){
        filterMap.brush = {};        
    }

    if(qtlIdentifier.test(track)){
        category = "qtl";
        mapValue = filterMap["qtl"][track];
    } 
    else if(brushIdentifier.test(track)){
        // &+-
        if(!filterMap.brush.hasOwnProperty(track)){
            brushTrackCount = brushTrackCount + 1;
        }
        mapValue = brushTrackCount;
        filterMap.brush[track] = brushTrackCount;
    }    
    else {
        category = "traitGenes";
        mapValue = filterMap["traitGenes"][track];
    }

    allTracks.push({
        track: track,
        trackIndex: allTracksCount,
        mapping: mapValue
    });
    allTracksCount++;
}

function removeTrack(track) {
    var saveIndex = 0;

    // &+- redesigned the deletion of the track 
    // &+- step 1: find and delete the track at the track array
    for(var i = 0; i < allTracks.length; i++) {
        var obj = allTracks[i];
        if(obj['track'] === track){
            allTracks.splice(i, 1);
            allTracksCount--;
            saveIndex = i;
            break;
        }
    }

    // &+- step 2: decrement all of the remaining track indices
    for(var i = saveIndex; i < allTracks.length; i++) {
        var obj = allTracks[i]['trackIndex'];
        allTracks[i]['trackIndex'] = obj - 1;
    }
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