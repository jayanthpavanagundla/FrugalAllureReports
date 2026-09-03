/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 90.77195878215035, "KoPercent": 9.228041217849649};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8648593306576248, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9244385230300723, 500, 1500, "POST MPIN Login"], "isController": false}, {"data": [0.9950794114781253, 500, 1500, "GET Most Active"], "isController": false}, {"data": [0.9999844667432974, 500, 1500, "GET History"], "isController": false}, {"data": [0.7066150203254814, 500, 1500, "POST Order Trail"], "isController": false}, {"data": [0.9982602752493087, 500, 1500, "POST Intraday"], "isController": false}, {"data": [0.9962779156327544, 500, 1500, "GET Option Chain"], "isController": false}, {"data": [0.9995937637241985, 500, 1500, "GET Fifty-Two-Week-High  BSE"], "isController": false}, {"data": [0.025215105162523902, 500, 1500, "POST Exit Order "], "isController": false}, {"data": [0.7133479212253829, 500, 1500, "POST DELETE WatchList"], "isController": false}, {"data": [0.9965469158303871, 500, 1500, "GET widgetCategories"], "isController": false}, {"data": [0.9876019681470931, 500, 1500, "GET Trending Stock"], "isController": false}, {"data": [0.9963925348100423, 500, 1500, "POST GetHoldings"], "isController": false}, {"data": [0.9931213561852897, 500, 1500, "GET market Breadth "], "isController": false}, {"data": [0.9957378737577929, 500, 1500, "GET getTopLosersMonth"], "isController": false}, {"data": [0.999978086514441, 500, 1500, "GET Fifty-Two-Week-Low Nse"], "isController": false}, {"data": [0.02538980823227194, 500, 1500, "POST Modify Order BSE"], "isController": false}, {"data": [0.3329694323144105, 500, 1500, "POST ADD Watch List"], "isController": false}, {"data": [1.0, 500, 1500, "POST GET Symbols"], "isController": false}, {"data": [0.9993495978125249, 500, 1500, "POST GetProfile"], "isController": false}, {"data": [1.0, 500, 1500, "POST GetHoldingsBySymbol"], "isController": false}, {"data": [0.9963185747625152, 500, 1500, "GET getTopGainerMonth"], "isController": false}, {"data": [0.709004331076069, 500, 1500, "POST Place Order V2 NSE"], "isController": false}, {"data": [0.012014337551995751, 500, 1500, "POST Config Settings"], "isController": false}, {"data": [0.618828702778333, 500, 1500, "POST Init Request"], "isController": false}, {"data": [0.9996596398770312, 500, 1500, "GET Fifty-Two-Week-Low BSE"], "isController": false}, {"data": [0.02538980823227194, 500, 1500, "POST Modify Order NSE"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD WatchList Symbols"], "isController": false}, {"data": [0.996118754048683, 500, 1500, "GET Key Indices"], "isController": false}, {"data": [0.9997584541062802, 500, 1500, "GET Fifty-Two-Week-High Nse"], "isController": false}, {"data": [0.9956331877729258, 500, 1500, "POST GET WatchList"], "isController": false}, {"data": [0.703442703891557, 500, 1500, "POST SquareOff NSE"], "isController": false}, {"data": [0.9968104262280683, 500, 1500, "GET Open Interest"], "isController": false}, {"data": [0.7076992103374012, 500, 1500, "POST Place Order V2  BSE"], "isController": false}, {"data": [0.025567502986857827, 500, 1500, "POST Cancel Order "], "isController": false}, {"data": [0.9956002308789736, 500, 1500, "GET Top Losers"], "isController": false}, {"data": [0.9963350096966112, 500, 1500, "GET getTopGainerWeek"], "isController": false}, {"data": [0.712882096069869, 500, 1500, "POST RENAME WatchList"], "isController": false}, {"data": [0.995815876756568, 500, 1500, "GET getTopLosersweek"], "isController": false}, {"data": [0.995145525629887, 500, 1500, "GET Top Gainer"], "isController": false}, {"data": [1.0, 500, 1500, "POST REMOVE WatchList Symbols"], "isController": false}, {"data": [0.18066469970779314, 500, 1500, "GET optionChainGreek"], "isController": false}, {"data": [0.9999645555980888, 500, 1500, "POST getIpoDetails"], "isController": false}, {"data": [0.6744960060859643, 500, 1500, "POST Order Trail "], "isController": false}, {"data": [0.2603323793889914, 500, 1500, "POST BrokerageDetails"], "isController": false}, {"data": [0.7030148874092915, 500, 1500, "POST SquareOff BSE"], "isController": false}, {"data": [0.9965676139511628, 500, 1500, " GET topTradedMinConfig"], "isController": false}, {"data": [0.9997736954206603, 500, 1500, "POST ClientReport"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2568790, 237049, 9.228041217849649, 1123.4163812534966, 0, 31137, 13.0, 41.0, 10014.0, 30007.0, 1028.4325390788272, 15641.04461575844, 745.9770639781674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST MPIN Login", 5254, 314, 5.976398934145413, 144.95717548534446, 38, 15137, 66.0, 140.0, 256.0, 1457.3999999999833, 2.114794626634498, 4.777482669873877, 0.6732646955887172], "isController": false}, {"data": ["GET Most Active", 92367, 45, 0.048718698236383126, 66.4191432004942, 6, 30023, 12.0, 18.0, 22.0, 68.0, 37.109562541306175, 99.80583471920343, 24.48489740062414], "isController": false}, {"data": ["GET History", 32189, 0, 0.0, 14.562987355929119, 8, 529, 13.0, 16.0, 18.0, 38.0, 12.946036797005146, 12.98396463918387, 9.57045884309853], "isController": false}, {"data": ["POST Order Trail", 73061, 20921, 28.634976252720328, 77.34360329040128, 6, 19243, 17.0, 59.0, 76.0, 472.9900000000016, 29.33244900917018, 55.93188812497215, 20.446068262050087], "isController": false}, {"data": ["POST Intraday", 32189, 0, 0.0, 31.267638012985703, 15, 994, 23.0, 35.0, 59.0, 385.0, 12.945864976747798, 14.020472909387994, 11.049498036794505], "isController": false}, {"data": ["GET Option Chain", 91078, 28, 0.030742879729462658, 34.70621884538482, 7, 30007, 12.0, 16.0, 18.0, 33.0, 36.87392306994701, 348.4097293874171, 23.766395728676784], "isController": false}, {"data": ["GET Fifty-Two-Week-High  BSE", 91080, 0, 0.0, 13.485166886253724, 6, 981, 12.0, 15.0, 19.0, 43.0, 36.862017551954075, 55.76100116013366, 24.57354483209327], "isController": false}, {"data": ["POST Exit Order ", 8368, 8157, 97.47848948374761, 69.871773422562, 7, 20009, 29.0, 41.0, 61.0, 468.85999999999694, 3.3602930458237474, 2.997649965199403, 2.6176392131802353], "isController": false}, {"data": ["POST DELETE WatchList", 457, 0, 0.0, 1350.1553610503283, 18, 24818, 475.0, 3505.3999999999996, 6712.199999999996, 14454.680000000008, 0.184348304540172, 0.18056772407596924, 0.15158327385041487], "isController": false}, {"data": ["GET widgetCategories", 91078, 17, 0.018665319835745185, 27.747546059421133, 7, 30012, 12.0, 15.0, 17.0, 27.0, 36.87422164857464, 40.2539979454154, 23.946638082326302], "isController": false}, {"data": ["GET Trending Stock", 92676, 719, 0.7758211403168026, 287.89618671500745, 7, 30040, 13.0, 20.0, 23.0, 45.9900000000016, 37.19610796648353, 60.720123400920755, 24.324072432066412], "isController": false}, {"data": ["POST GetHoldings", 37561, 0, 0.0, 54.45363541971752, 9, 1043, 42.0, 124.0, 253.0, 551.9900000000016, 15.099790232673692, 5803.857436911009, 11.590268674688987], "isController": false}, {"data": ["GET market Breadth ", 91079, 28, 0.030742542188649413, 51.95323839743577, 8, 30009, 14.0, 19.0, 24.0, 654.900000000016, 36.87332771671517, 789.2326872122276, 23.730002895815716], "isController": false}, {"data": ["GET getTopLosersMonth", 91269, 42, 0.04601781546855997, 53.668945644194814, 7, 30039, 13.0, 20.0, 23.950000000000728, 52.0, 36.854310612518326, 69.08795536451218, 24.244445325090318], "isController": false}, {"data": ["GET Fifty-Two-Week-Low Nse", 91268, 0, 0.0, 13.314929657711467, 7, 735, 12.0, 16.0, 19.0, 44.9900000000016, 36.858788612819964, 103.99720384049371, 24.535350299436264], "isController": false}, {"data": ["POST Modify Order BSE", 16739, 16314, 97.46101917677281, 70.59059680984527, 7, 18450, 31.0, 49.0, 70.0, 486.0, 6.720654600350105, 5.738335875518935, 7.355660182410025], "isController": false}, {"data": ["POST ADD Watch List", 458, 3, 0.6550218340611353, 3534.3253275109187, 534, 30008, 1132.0, 11097.4, 17351.949999999983, 29485.85999999997, 0.18481252625407202, 0.18044709322783148, 0.1923927275262117], "isController": false}, {"data": ["POST GET Symbols", 458, 0, 0.0, 16.436681222707424, 10, 83, 15.0, 21.0, 26.0, 48.96999999999946, 0.18476041254014908, 0.23892253163316102, 0.14668966347181758], "isController": false}, {"data": ["POST GetProfile", 37669, 0, 0.0, 29.116992752661353, 11, 9051, 26.0, 60.0, 81.0, 133.0, 15.112938816449349, 87.64448658475426, 11.511808864092277], "isController": false}, {"data": ["POST GetHoldingsBySymbol", 37561, 0, 0.0, 18.96645456723725, 8, 233, 16.0, 32.0, 56.0, 98.0, 15.100178736973628, 15.498327981014924, 12.165671345706292], "isController": false}, {"data": ["GET getTopGainerMonth", 91269, 39, 0.04273082864937711, 42.09133440708234, 6, 30036, 11.0, 14.0, 16.0, 38.0, 36.8555756026096, 67.3133228124157, 24.2812692662795], "isController": false}, {"data": ["POST Place Order V2 NSE", 83582, 23587, 28.22019095020459, 126.85301859252039, 6, 19990, 33.0, 72.0, 212.0, 3128.730000000043, 33.55539800214062, 29.582329655880727, 37.323826488709145], "isController": false}, {"data": ["POST Config Settings", 67794, 53822, 79.39050653450158, 22895.23006460759, 0, 31137, 30005.0, 30014.0, 30016.0, 30026.0, 27.257616926628707, 86.75202310478466, 8.704208261372017], "isController": false}, {"data": ["POST Init Request", 5003, 1786, 35.698580851489105, 8267.363981611024, 14, 30320, 173.0, 30016.0, 30017.0, 30022.0, 2.013560847329587, 2.016662701491919, 1.3862894505540615], "isController": false}, {"data": ["GET Fifty-Two-Week-Low BSE", 91080, 0, 0.0, 13.681368028106984, 7, 1090, 12.0, 16.0, 19.0, 43.0, 36.866642974006346, 104.24953057820481, 24.540625723530134], "isController": false}, {"data": ["POST Modify Order NSE", 16739, 16314, 97.46101917677281, 78.8540534082081, 7, 18340, 32.0, 51.0, 113.0, 631.0, 6.720646505396311, 5.738524222698151, 7.392590158126305], "isController": false}, {"data": ["POST ADD WatchList Symbols", 458, 0, 0.0, 23.305676855895197, 14, 231, 20.0, 33.0, 46.0, 73.86999999999978, 0.18476018893948057, 0.160402156217967, 0.2170571360294874], "isController": false}, {"data": ["GET Key Indices", 91079, 35, 0.03842817773581177, 41.976470975746075, 6, 30044, 11.0, 14.0, 16.0, 30.0, 36.87107370166488, 81.42061112626112, 23.72855231386441], "isController": false}, {"data": ["GET Fifty-Two-Week-High Nse", 91080, 0, 0.0, 14.068818620992602, 7, 1032, 13.0, 17.0, 22.0, 44.0, 36.85933235559786, 75.08343259665254, 24.571754783761012], "isController": false}, {"data": ["POST GET WatchList", 458, 0, 0.0, 113.78602620087338, 14, 21178, 21.0, 29.100000000000023, 36.0, 77.44999999999857, 0.18476093427714707, 7.628116866913432, 0.1427206045051009], "isController": false}, {"data": ["POST SquareOff NSE", 66837, 19359, 28.96449571345213, 109.1501862740698, 6, 19470, 31.0, 54.0, 209.0, 2879.730000000043, 26.891155937080562, 23.69488481954476, 29.20211465042342], "isController": false}, {"data": ["GET Open Interest", 91078, 21, 0.023057159797096993, 28.612200531412785, 6, 29821, 11.0, 14.0, 16.0, 28.0, 36.87393799876355, 74.70585442478247, 23.694385940611735], "isController": false}, {"data": ["POST Place Order V2  BSE", 83580, 23853, 28.539124192390524, 103.87313950705786, 6, 29537, 31.0, 49.0, 70.0, 3271.930000000011, 33.55512044794761, 29.574292117638034, 37.19244307462942], "isController": false}, {"data": ["POST Cancel Order ", 8370, 8156, 97.44324970131422, 69.69617682198323, 7, 26667, 29.0, 41.0, 60.0, 388.5799999999981, 3.367493747807307, 2.872245998259726, 2.5052936595614694], "isController": false}, {"data": ["GET Top Losers", 91823, 32, 0.03484965640416889, 60.22765538046078, 6, 30047, 12.0, 17.0, 22.0, 53.0, 37.00323112844481, 69.32749568643044, 24.270177019812927], "isController": false}, {"data": ["GET getTopGainerWeek", 91269, 30, 0.03286986819182855, 47.43899900294728, 0, 30031, 11.0, 14.0, 16.0, 41.0, 36.857674189451416, 67.38442153259155, 24.24639223343315], "isController": false}, {"data": ["POST RENAME WatchList", 458, 3, 0.6550218340611353, 1226.4432314410476, 32, 19499, 470.5, 2616.900000000003, 6446.199999999999, 10978.969999999927, 0.18474118486058091, 0.1807945889034683, 0.15839404271191992], "isController": false}, {"data": ["GET getTopLosersweek", 91656, 36, 0.03927729772191673, 55.313640132670145, 7, 30025, 12.0, 17.0, 21.0, 47.0, 36.898417034720886, 68.03958221178446, 24.237421697269415], "isController": false}, {"data": ["GET Top Gainer", 92080, 48, 0.052128583840139006, 65.41927671590021, 6, 30029, 12.0, 16.0, 21.0, 46.9900000000016, 36.994360850902446, 53.76689911998278, 24.30048512536822], "isController": false}, {"data": ["POST REMOVE WatchList Symbols", 458, 0, 0.0, 17.3056768558952, 11, 86, 16.0, 22.0, 25.049999999999955, 43.63999999999987, 0.18475996533935324, 0.18079051295901558, 0.20063777486070392], "isController": false}, {"data": ["GET optionChainGreek", 70498, 16693, 23.678685920167947, 7431.375528383744, 266, 30013, 10013.0, 11262.700000000004, 18787.95, 24326.860000000022, 28.3481297343725, 2418.3578657428416, 19.10176710616897], "isController": false}, {"data": ["POST getIpoDetails", 70533, 0, 0.0, 14.288474898274462, 7, 1081, 13.0, 22.0, 25.0, 66.0, 28.36924217968514, 179.77344971091492, 19.753193041128423], "isController": false}, {"data": ["POST Order Trail ", 10516, 3334, 31.704069988588817, 78.6838151388359, 7, 17573, 31.0, 51.0, 73.0, 686.8299999999999, 4.257857054069845, 7.922418227513142, 2.966065415636045], "isController": false}, {"data": ["POST BrokerageDetails", 68837, 3845, 5.585658875314148, 9070.345802402808, 201, 30212, 21274.5, 30006.0, 30007.0, 30009.0, 27.67428948873904, 33.146780454075724, 25.755466682390924], "isController": false}, {"data": ["POST SquareOff BSE", 66835, 19423, 29.061120670307474, 99.51202214408596, 6, 19241, 31.0, 49.0, 99.0, 1805.0, 26.890805665999576, 23.693028710893966, 29.096692068288604], "isController": false}, {"data": [" GET topTradedMinConfig", 74001, 45, 0.06080998905420197, 64.90051485790791, 7, 30033, 12.0, 23.0, 33.0, 104.9900000000016, 29.748786949303124, 30.113517161099562, 19.290229037438742], "isController": false}, {"data": ["POST ClientReport", 37560, 0, 0.0, 41.04968051118183, 21, 666, 30.0, 96.0, 147.0, 294.0, 15.099892057480899, 4604.637738570933, 11.442886949809743], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 95108, 40.12166260984016, 3.702443562922621], "isController": false}, {"data": ["503/Service Unavailable", 13026, 5.495066420866572, 0.5070869942657827], "isController": false}, {"data": ["504/Gateway Timeout", 47599, 20.079814721850756, 1.8529735790002297], "isController": false}, {"data": ["502/Bad Gateway", 1, 4.218537095705951E-4, 3.8928834198202266E-5], "isController": false}, {"data": ["500/Internal Server Error", 17505, 7.384549186033268, 0.6814492426395307], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pll.blinkx.in:443 failed to respond", 2, 8.437074191411903E-4, 7.785766839640453E-5], "isController": false}, {"data": ["401/Unauthorized", 63808, 26.91764150028053, 2.48397105251889], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2568790, 237049, "400/Bad Request", 95108, "401/Unauthorized", 63808, "504/Gateway Timeout", 47599, "500/Internal Server Error", 17505, "503/Service Unavailable", 13026], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST MPIN Login", 5254, 314, "400/Bad Request", 314, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET Most Active", 92367, 45, "503/Service Unavailable", 41, "504/Gateway Timeout", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Order Trail", 73061, 20921, "401/Unauthorized", 10567, "400/Bad Request", 10294, "500/Internal Server Error", 60, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET Option Chain", 91078, 28, "503/Service Unavailable", 25, "504/Gateway Timeout", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Exit Order ", 8368, 8157, "400/Bad Request", 6870, "401/Unauthorized", 1284, "500/Internal Server Error", 3, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET widgetCategories", 91078, 17, "503/Service Unavailable", 16, "504/Gateway Timeout", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Trending Stock", 92676, 719, "504/Gateway Timeout", 681, "503/Service Unavailable", 38, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET market Breadth ", 91079, 28, "503/Service Unavailable", 26, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["GET getTopLosersMonth", 91269, 42, "503/Service Unavailable", 35, "504/Gateway Timeout", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Modify Order BSE", 16739, 16314, "400/Bad Request", 13857, "401/Unauthorized", 2448, "500/Internal Server Error", 9, "", "", "", ""], "isController": false}, {"data": ["POST ADD Watch List", 458, 3, "504/Gateway Timeout", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET getTopGainerMonth", 91269, 39, "503/Service Unavailable", 33, "504/Gateway Timeout", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["POST Place Order V2 NSE", 83582, 23587, "401/Unauthorized", 12263, "400/Bad Request", 11013, "500/Internal Server Error", 311, "", "", "", ""], "isController": false}, {"data": ["POST Config Settings", 67794, 53822, "504/Gateway Timeout", 41930, "503/Service Unavailable", 11890, "502/Bad Gateway", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pll.blinkx.in:443 failed to respond", 1, "", ""], "isController": false}, {"data": ["POST Init Request", 5003, 1786, "504/Gateway Timeout", 1079, "503/Service Unavailable", 707, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Modify Order NSE", 16739, 16314, "400/Bad Request", 13854, "401/Unauthorized", 2445, "500/Internal Server Error", 15, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET Key Indices", 91079, 35, "503/Service Unavailable", 28, "504/Gateway Timeout", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST SquareOff NSE", 66837, 19359, "401/Unauthorized", 9829, "400/Bad Request", 9412, "500/Internal Server Error", 118, "", "", "", ""], "isController": false}, {"data": ["GET Open Interest", 91078, 21, "503/Service Unavailable", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST Place Order V2  BSE", 83580, 23853, "401/Unauthorized", 12270, "400/Bad Request", 11399, "500/Internal Server Error", 184, "", "", "", ""], "isController": false}, {"data": ["POST Cancel Order ", 8370, 8156, "400/Bad Request", 6986, "401/Unauthorized", 1166, "500/Internal Server Error", 4, "", "", "", ""], "isController": false}, {"data": ["GET Top Losers", 91823, 32, "503/Service Unavailable", 27, "504/Gateway Timeout", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["GET getTopGainerWeek", 91269, 30, "503/Service Unavailable", 27, "504/Gateway Timeout", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pll.blinkx.in:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["POST RENAME WatchList", 458, 3, "500/Internal Server Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET getTopLosersweek", 91656, 36, "503/Service Unavailable", 32, "504/Gateway Timeout", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["GET Top Gainer", 92080, 48, "503/Service Unavailable", 42, "504/Gateway Timeout", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET optionChainGreek", 70498, 16693, "500/Internal Server Error", 16686, "504/Gateway Timeout", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Order Trail ", 10516, 3334, "401/Unauthorized", 1706, "400/Bad Request", 1620, "500/Internal Server Error", 8, "", "", "", ""], "isController": false}, {"data": ["POST BrokerageDetails", 68837, 3845, "504/Gateway Timeout", 3845, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST SquareOff BSE", 66835, 19423, "401/Unauthorized", 9830, "400/Bad Request", 9489, "500/Internal Server Error", 104, "", "", "", ""], "isController": false}, {"data": [" GET topTradedMinConfig", 74001, 45, "503/Service Unavailable", 38, "504/Gateway Timeout", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
