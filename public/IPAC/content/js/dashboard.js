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

    var data = {"OkPercent": 97.27165759923923, "KoPercent": 2.728342400760768};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.22463934149459228, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2548885932138458, 500, 1500, "POST create_postComments"], "isController": false}, {"data": [0.15745743252939837, 500, 1500, "POST leader_board"], "isController": false}, {"data": [0.18856819280893117, 500, 1500, "POST list_news"], "isController": false}, {"data": [0.22888474101726553, 500, 1500, "POST send_otp"], "isController": false}, {"data": [0.2567215335358345, 500, 1500, "POST like_post"], "isController": false}, {"data": [0.2597449669550767, 500, 1500, "GET completed_tasks"], "isController": false}, {"data": [0.23017463557452425, 500, 1500, "POST list_banner"], "isController": false}, {"data": [0.20831059450400705, 500, 1500, "POST follow/unfollow_user"], "isController": false}, {"data": [0.18333909105666016, 500, 1500, "GET get_stories"], "isController": false}, {"data": [0.25864465572558837, 500, 1500, "POST view_story"], "isController": false}, {"data": [0.26524173049442096, 500, 1500, "GET pending_tasks"], "isController": false}, {"data": [0.2617900691184142, 500, 1500, "POST get_districts"], "isController": false}, {"data": [0.21795363881401617, 500, 1500, "GET get_presignedUrl"], "isController": false}, {"data": [0.18244225226322414, 500, 1500, "POST get_userProfile"], "isController": false}, {"data": [0.25855168376519044, 500, 1500, "POST view_news"], "isController": false}, {"data": [0.2729719730289249, 500, 1500, "POST create_story"], "isController": false}, {"data": [0.15489649190685334, 500, 1500, "GET shorts_list"], "isController": false}, {"data": [0.10277552510795124, 500, 1500, "POST create_short"], "isController": false}, {"data": [0.2758296410532586, 500, 1500, "POST get_ac"], "isController": false}, {"data": [0.27147947085728846, 500, 1500, "POST view_post"], "isController": false}, {"data": [0.22799725859212727, 500, 1500, "POST grid_lists"], "isController": false}, {"data": [0.21866957038210255, 500, 1500, "POST user_register"], "isController": false}, {"data": [0.18242584340398219, 500, 1500, "POST get_postComments"], "isController": false}, {"data": [0.2563412676956878, 500, 1500, "POST get_shortComments"], "isController": false}, {"data": [0.24471701886540898, 500, 1500, "POST verify_otp"], "isController": false}, {"data": [0.18101693252336296, 500, 1500, "POST list_post"], "isController": false}, {"data": [0.2757596919169025, 500, 1500, "POST create_post"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5804660, 158371, 2.728342400760768, 13323.623010995361, 22, 181954, 15738.0, 60081.0, 114098.15000000002, 180023.0, 641.2372040552868, 2508.783113766921, 278.1526333549789], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST create_postComments", 242759, 3, 0.0012357935236180738, 6391.944842415743, 23, 30072, 15223.0, 22373.9, 23946.9, 26329.950000000008, 27.27924687572901, 25.254254562832703, 13.426495542607087], "isController": false}, {"data": ["POST leader_board", 236918, 23619, 9.969272068817059, 21395.793080306095, 25, 61992, 57451.0, 60081.0, 60086.0, 60098.0, 26.486996588255536, 159.99122870936793, 11.588052273130508], "isController": false}, {"data": ["POST list_news", 241939, 28841, 11.92077341809299, 23503.0030379556, 22, 62027, 60022.0, 60084.0, 60088.0, 60110.0, 27.044782472708622, 456.3007574270199, 11.09257782798781], "isController": false}, {"data": ["POST send_otp", 15001, 0, 0.0, 11420.615425638289, 84, 49376, 8863.0, 27556.600000000006, 31082.6, 39854.29999999999, 2.070693455236593, 2.032272385266383, 0.5358725484019936], "isController": false}, {"data": ["POST like_post", 243620, 5, 0.002052376652163205, 6423.114777111902, 23, 30107, 15423.0, 22548.9, 24028.95, 26360.980000000003, 27.37017675346023, 25.41865227108597, 12.081358305408346], "isController": false}, {"data": ["GET completed_tasks", 235891, 0, 0.0, 6388.841214798335, 24, 30093, 15138.5, 22331.800000000003, 23842.0, 26214.99, 26.50017019622558, 24.818030486504227, 8.954150293588489], "isController": false}, {"data": ["POST list_banner", 242505, 2, 8.24725263396631E-4, 12428.135555967705, 22, 56739, 30140.5, 43681.9, 46167.9, 49811.990000000005, 27.18811003815899, 47.12751520481222, 10.832753834453499], "isController": false}, {"data": ["POST follow/unfollow_user", 232715, 6750, 2.9005435833530284, 18474.24032400123, 25, 61082, 46190.0, 60023.0, 60024.0, 60081.990000000005, 26.061019393882383, 23.769831908440672, 11.55438852136205], "isController": false}, {"data": ["GET get_stories", 240257, 10324, 4.297065225987172, 38775.69589231531, 25, 181803, 99924.0, 180024.0, 180025.0, 180085.0, 26.674733063370326, 61.16266404985953, 8.440043584438975], "isController": false}, {"data": ["POST view_story", 238124, 4, 0.001679797080512674, 6382.55592044477, 22, 29691, 15218.5, 22267.9, 23794.0, 26160.980000000003, 26.730033997939717, 61.36856543991619, 11.4855527137567], "isController": false}, {"data": ["GET pending_tasks", 237227, 0, 0.0, 6326.588078085557, 29, 29906, 14979.0, 22263.9, 23766.9, 26231.980000000003, 26.655156365486445, 30.014317312642152, 8.459879716671477], "isController": false}, {"data": ["POST get_districts", 245376, 0, 0.0, 6351.64058424621, 23, 30047, 15296.0, 22397.9, 23868.95, 26300.93000000001, 27.55013261622628, 58.89378935246028, 11.46127686751525], "isController": false}, {"data": ["GET get_presignedUrl", 231875, 0, 0.0, 12617.085295957022, 26, 55033, 30665.5, 44066.9, 46328.0, 50127.990000000005, 25.98992907761672, 38.57880097458731, 9.822357236654065], "isController": false}, {"data": ["POST get_userProfile", 246330, 28632, 11.623431981488247, 23443.69555068428, 22, 62041, 60022.0, 60081.0, 60086.0, 60100.0, 27.5509577517309, 37.2090958412809, 11.972819581896628], "isController": false}, {"data": ["POST view_news", 240859, 1, 4.151806658667519E-4, 6395.316400881772, 24, 29947, 15189.0, 22380.800000000003, 23789.95, 26282.960000000006, 27.060869119719285, 66.33060419815551, 11.548428532419528], "isController": false}, {"data": ["POST create_story", 240554, 2, 8.31414152331701E-4, 6249.077724752008, 23, 33796, 14918.0, 22377.9, 23944.850000000002, 26380.99, 27.033548125939287, 44.773886182149084, 16.26236440465205], "isController": false}, {"data": ["GET shorts_list", 235199, 10577, 4.497042929604293, 40421.723187599004, 25, 181954, 103312.0, 180024.0, 180025.0, 180085.0, 26.00600086598582, 547.4735338862907, 8.076073661882184], "isController": false}, {"data": ["POST create_short", 235523, 35, 0.014860544405429619, 7331.702615031347, 23, 60081, 15866.5, 23369.9, 24929.700000000004, 27429.980000000003, 26.46815354839783, 24.528359555844542, 15.793005198103213], "isController": false}, {"data": ["POST get_ac", 245106, 1, 4.079867485904058E-4, 6200.787222671031, 23, 30050, 14960.5, 22320.9, 23937.95, 26276.0, 27.543558999196527, 30.798130472968417, 11.78131821457267], "isController": false}, {"data": ["POST view_post", 243337, 1, 4.10952711671468E-4, 6254.22528427646, 24, 30050, 14874.0, 22329.800000000003, 23832.95, 26302.830000000027, 27.314075329587993, 73.9266277134184, 11.656486268745404], "isController": false}, {"data": ["POST grid_lists", 237834, 9, 0.003784151971543177, 12463.175710789841, 22, 60023, 30102.0, 43795.700000000004, 46143.95, 49932.93000000001, 26.660302588168197, 45.40445838819978, 10.544349199713952], "isController": false}, {"data": ["POST user_register", 15153, 153, 1.009701049297169, 17020.196990694978, 28, 60096, 13241.0, 41498.0, 46695.499999999985, 60022.0, 2.067340199636875, 2.6618570297241035, 1.049820662194183], "isController": false}, {"data": ["POST get_postComments", 243033, 5, 0.0020573337777174293, 6785.644118288551, 22, 30457, 15640.0, 22992.9, 24529.850000000002, 26915.970000000005, 27.317526838354805, 97.26304659107821, 12.324891022574814], "isController": false}, {"data": ["POST get_shortComments", 233037, 1, 4.291164064075662E-4, 6390.15997030513, 27, 30099, 15168.5, 22246.9, 23775.700000000004, 26310.94000000001, 26.185436040204106, 45.59447319900193, 11.967553786655616], "isController": false}, {"data": ["POST verify_otp", 15001, 0, 0.0, 11122.170521965232, 28, 49446, 8328.0, 27391.000000000007, 30816.699999999997, 40062.78, 2.0623077885423067, 2.666643580025612, 0.7612813174931158], "isController": false}, {"data": ["POST list_post", 244618, 49404, 20.196387837362746, 26626.95638096924, 23, 61590, 60022.0, 60025.0, 60083.0, 60102.0, 27.33558453505324, 478.19115089522904, 10.784733605778806], "isController": false}, {"data": ["POST create_post", 244869, 2, 8.167632489208516E-4, 6207.483184886506, 23, 37154, 14894.5, 22316.700000000004, 23899.95, 26274.99, 27.501767512695487, 25.43363233317713, 18.47774566039834], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 44, 0.027782864287022244, 7.580116664886487E-4], "isController": false}, {"data": ["504/Gateway Time-out", 158313, 99.96337713343983, 2.727343203564033], "isController": false}, {"data": ["500/Internal Server Error", 14, 0.008840002273143441, 2.4118553024638824E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5804660, 158371, "504/Gateway Time-out", 158313, "502/Bad Gateway", 44, "500/Internal Server Error", 14, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["POST create_postComments", 242759, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST leader_board", 236918, 23619, "504/Gateway Time-out", 23617, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["POST list_news", 241939, 28841, "504/Gateway Time-out", 28839, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST like_post", 243620, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST list_banner", 242505, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST follow/unfollow_user", 232715, 6750, "504/Gateway Time-out", 6749, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["GET get_stories", 240257, 10324, "504/Gateway Time-out", 10324, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST view_story", 238124, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST get_userProfile", 246330, 28632, "504/Gateway Time-out", 28628, "502/Bad Gateway", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["POST view_news", 240859, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST create_story", 240554, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET shorts_list", 235199, 10577, "504/Gateway Time-out", 10577, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST create_short", 235523, 35, "504/Gateway Time-out", 20, "500/Internal Server Error", 14, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["POST get_ac", 245106, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST view_post", 243337, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST grid_lists", 237834, 9, "502/Bad Gateway", 6, "504/Gateway Time-out", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["POST user_register", 15153, 153, "504/Gateway Time-out", 153, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST get_postComments", 243033, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST get_shortComments", 233037, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST list_post", 244618, 49404, "504/Gateway Time-out", 49403, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["POST create_post", 244869, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
