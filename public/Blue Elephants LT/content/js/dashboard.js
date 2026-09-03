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

    var data = {"OkPercent": 98.17255418794568, "KoPercent": 1.8274458120543173};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6100468334470829, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "GET Video Detail from Module"], "isController": false}, {"data": [1.0, 500, 1500, "GET Video List"], "isController": false}, {"data": [0.5984572230014025, 500, 1500, "GET question detail"], "isController": false}, {"data": [0.0, 500, 1500, "POST Generate Questions AI"], "isController": false}, {"data": [0.0, 500, 1500, "GET Training Program Filter"], "isController": false}, {"data": [0.5399124726477024, 500, 1500, "GET Learning Modules"], "isController": false}, {"data": [0.25, 500, 1500, "DELETE Remove Module"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "GET Remaining Users"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "POST Assign Questions to Module"], "isController": false}, {"data": [0.5, 500, 1500, "POST Admin Login"], "isController": false}, {"data": [1.0, 500, 1500, "GET competency"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "GET training overview"], "isController": false}, {"data": [0.988, 500, 1500, "POST User Login"], "isController": false}, {"data": [0.6506532249768542, 500, 1500, "POST videos seen "], "isController": false}, {"data": [0.0, 500, 1500, "POST Scorm upload"], "isController": false}, {"data": [0.0, 500, 1500, "POST generate-ai-from-description"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Remove Program"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "GET Remaining Data from Module"], "isController": false}, {"data": [0.5746572620703357, 500, 1500, "GET video"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "GET Module List"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "GET Video Module List"], "isController": false}, {"data": [0.0, 500, 1500, "GET User"], "isController": false}, {"data": [0.652472902814464, 500, 1500, "GET module detail"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "DELETE Remove User"], "isController": false}, {"data": [0.616995550396595, 500, 1500, "POST question answer"], "isController": false}, {"data": [0.0, 500, 1500, "POST Assign Program to Initiative"], "isController": false}, {"data": [1.0, 500, 1500, "POST encrypt email"], "isController": false}, {"data": [0.0, 500, 1500, "POST Bulk Create Questions - New"], "isController": false}, {"data": [0.8, 500, 1500, "POST Assign Module to Initiative"], "isController": false}, {"data": [0.43582089552238806, 500, 1500, "POST encrypt company code"], "isController": false}, {"data": [0.0, 500, 1500, "GET Dashboard Overview"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "GET scorm"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "POST Question Filter"], "isController": false}, {"data": [0.6424898807570287, 500, 1500, "GET programId"], "isController": false}, {"data": [0.5, 500, 1500, "GET Remaining Programs"], "isController": false}, {"data": [0.0, 500, 1500, "GET Manage Skills"], "isController": false}, {"data": [0.0, 500, 1500, "GET Remaining Modules"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "POST Module Filter"], "isController": false}, {"data": [0.0, 500, 1500, "POST Generate SCORM AI"], "isController": false}, {"data": [0.0, 500, 1500, "POST complete"], "isController": false}, {"data": [0.0, 500, 1500, "POST business-kpi"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "GET Rankings"], "isController": false}, {"data": [0.0, 500, 1500, "POST Assign Users and Groups to Initiative"], "isController": false}, {"data": [0.0, 500, 1500, "POST run"], "isController": false}, {"data": [0.5572152433231289, 500, 1500, "GET program"], "isController": false}, {"data": [0.0, 500, 1500, "GET Video With Filter"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "POST GET intitative List"], "isController": false}, {"data": [0.0, 500, 1500, "POST Upload Competency File"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 84982, 1553, 1.8274458120543173, 13274.483337647876, 8, 109062, 254.0, 41010.8, 43014.95, 48941.990000000005, 34.037961567407635, 539.9428328694012, 84.43953554763961], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Video Detail from Module", 3, 1, 33.333333333333336, 10740.333333333334, 69, 32072, 80.0, 32072.0, 32072.0, 32072.0, 0.021027988252363895, 0.03443059274394219, 0.01251959326613723], "isController": false}, {"data": ["GET Video List", 3, 0, 0.0, 116.66666666666667, 77, 164, 109.0, 164.0, 164.0, 164.0, 0.02037614361106017, 0.15781562009699046, 0.0124100796537414], "isController": false}, {"data": ["GET question detail", 10695, 224, 2.0944366526414213, 14192.4474988312, 8, 59056, 157.0, 41786.8, 43313.799999999996, 48694.31999999999, 4.351548125803073, 7.766306362999878, 2.65443370800929], "isController": false}, {"data": ["POST Generate Questions AI", 3, 0, 0.0, 49141.0, 43135, 58277, 46011.0, 58277.0, 58277.0, 58277.0, 0.013759448154399355, 0.10392145705676231, 4.356056751417223], "isController": false}, {"data": ["GET Training Program Filter", 3, 0, 0.0, 2503.0, 2213, 2894, 2402.0, 2894.0, 2894.0, 2894.0, 0.021137776024125247, 0.0900488524829841, 0.013617076416583291], "isController": false}, {"data": ["GET Learning Modules", 11425, 298, 2.6083150984682715, 15879.335142231945, 80, 67194, 338.0, 42013.4, 43822.799999999996, 49765.49999999999, 4.605411933438596, 35.979617364463834, 3.184379471255377], "isController": false}, {"data": ["DELETE Remove Module", 4, 1, 25.0, 22883.5, 79, 42101, 24677.0, 42101.0, 42101.0, 42101.0, 0.0023041328655175573, 0.0029476699744414065, 0.0011756927951493395], "isController": false}, {"data": ["GET Remaining Users", 3, 0, 0.0, 21121.333333333332, 315, 32209, 30840.0, 32209.0, 32209.0, 32209.0, 0.019306013179571663, 0.08622975482972096, 0.01260672605410832], "isController": false}, {"data": ["POST Assign Questions to Module", 3, 0, 0.0, 12288.333333333334, 66, 36640, 159.0, 36640.0, 36640.0, 36640.0, 0.019139244382631773, 0.010647450732395085, 0.012697194027279802], "isController": false}, {"data": ["POST Admin Login", 6, 0, 0.0, 17340.5, 297, 36578, 15699.0, 36578.0, 36578.0, 36578.0, 0.07161015431988256, 0.19057578666738276, 0.04300805166672634], "isController": false}, {"data": ["GET competency", 3, 0, 0.0, 117.66666666666667, 73, 198, 82.0, 198.0, 198.0, 198.0, 0.021527752861397152, 0.073980627264899, 0.012564863567866243], "isController": false}, {"data": ["GET training overview", 3, 0, 0.0, 9506.0, 212, 28094, 212.0, 28094.0, 28094.0, 28094.0, 0.022300024530026982, 0.015128011432479244, 0.0163693213916702], "isController": false}, {"data": ["POST User Login", 1000, 0, 0.0, 323.324, 268, 699, 300.0, 401.0, 456.0, 558.9000000000001, 2.4836637020000945, 4.075905574831546, 1.1758789375383416], "isController": false}, {"data": ["POST videos seen ", 9721, 136, 1.3990330212941056, 11737.211603744468, 36, 61386, 179.0, 41261.8, 42909.5, 48663.240000000005, 4.026729430790044, 2.3122453844944615, 2.60944850316451], "isController": false}, {"data": ["POST Scorm upload", 3, 0, 0.0, 48965.666666666664, 35913, 65173, 45811.0, 65173.0, 65173.0, 65173.0, 0.016411917240171995, 0.06153934722966837, 568.8445790155174], "isController": false}, {"data": ["POST generate-ai-from-description", 3, 0, 0.0, 42684.0, 37333, 47289, 43430.0, 47289.0, 47289.0, 47289.0, 0.01860199785456958, 0.03530261962634787, 0.01358212278248684], "isController": false}, {"data": ["DELETE Remove Program", 3, 0, 0.0, 78.33333333333333, 62, 99, 74.0, 99.0, 99.0, 99.0, 0.02493060980271577, 0.013650158101617165, 0.017691643675104292], "isController": false}, {"data": ["GET Remaining Data from Module", 3, 0, 0.0, 19905.0, 82, 30841, 28792.0, 30841.0, 30841.0, 30841.0, 0.01972425491627054, 0.07621960615593995, 0.012102936366266264], "isController": false}, {"data": ["GET video", 10066, 223, 2.215378501887542, 14554.247566063948, 60, 59710, 187.0, 41798.0, 43469.65, 49249.13, 4.140791859596468, 8.931843231501158, 2.435761240731965], "isController": false}, {"data": ["GET Module List", 3, 0, 0.0, 13859.666666666666, 102, 41315, 162.0, 41315.0, 41315.0, 41315.0, 0.019592732402460847, 0.08338391387687927, 0.011607673493645424], "isController": false}, {"data": ["GET Video Module List", 3, 0, 0.0, 24627.333333333336, 100, 42351, 31431.0, 42351.0, 42351.0, 42351.0, 0.01929943066679533, 0.049750062321078196, 0.01143390749139567], "isController": false}, {"data": ["GET User", 6, 1, 16.666666666666668, 32747.166666666668, 19285, 41616, 33334.0, 41616.0, 41616.0, 41616.0, 0.0032207052700400337, 0.01522600997291387, 0.001492931088716474], "isController": false}, {"data": ["GET module detail", 10979, 160, 1.4573276254668002, 11388.462519355142, 165, 62004, 321.0, 41276.0, 42751.0, 49114.40000000001, 4.466712232908591, 469.22940582904624, 2.6392511790773647], "isController": false}, {"data": ["DELETE Remove User", 9, 0, 0.0, 23128.11111111111, 86, 42481, 29885.0, 42481.0, 42481.0, 42481.0, 0.0409051863231237, 0.023346493062025898, 0.028029107164770636], "isController": false}, {"data": ["POST question answer", 10338, 156, 1.5089959373186304, 12922.509286128872, 62, 61124, 166.0, 41298.1, 42786.1, 48902.66, 4.2521424208584495, 2.586169361016681, 2.817887382544746], "isController": false}, {"data": ["POST Assign Program to Initiative", 3, 0, 0.0, 31694.333333333332, 29058, 35866, 30159.0, 35866.0, 35866.0, 35866.0, 0.019602462069235896, 0.010707334424537055, 0.015403757628624821], "isController": false}, {"data": ["POST encrypt email", 1003, 0, 0.0, 56.577268195413765, 46, 139, 53.0, 69.60000000000002, 77.0, 92.96000000000004, 2.492563314338825, 1.4801390557707936, 0.8146785854516808], "isController": false}, {"data": ["POST Bulk Create Questions - New", 3, 0, 0.0, 33686.666666666664, 28261, 41495, 31304.0, 41495.0, 41495.0, 41495.0, 0.015981248668229277, 0.011023524065096954, 0.12108709114638824], "isController": false}, {"data": ["POST Assign Module to Initiative", 5, 0, 0.0, 499.2, 246, 918, 396.0, 918.0, 918.0, 918.0, 0.0027800342389016864, 0.0015138155191519339, 0.0021018579177321146], "isController": false}, {"data": ["POST encrypt company code", 1005, 2, 0.19900497512437812, 14557.163184079604, 139, 49471, 10468.0, 35522.6, 37077.5, 44097.439999999995, 2.491052041919077, 1.3744840516899495, 0.7550033275993694], "isController": false}, {"data": ["GET Dashboard Overview", 6, 0, 0.0, 35791.5, 7517, 53577, 47852.0, 53577.0, 53577.0, 53577.0, 0.0032628379076508115, 0.01306887663889629, 0.0019330615208087486], "isController": false}, {"data": ["GET scorm", 3, 0, 0.0, 9932.333333333334, 97, 29598, 102.0, 29598.0, 29598.0, 29598.0, 0.022491453247765848, 0.11726012865111259, 0.012336620677892401], "isController": false}, {"data": ["POST Question Filter", 3, 0, 0.0, 19732.0, 81, 30647, 28468.0, 30647.0, 30647.0, 30647.0, 0.017130131902015646, 0.07313205725746588, 0.013042766444926626], "isController": false}, {"data": ["GET programId", 9141, 139, 1.5206213762170442, 12232.534405426139, 64, 65776, 170.0, 41361.200000000004, 42935.99999999999, 48580.479999999996, 3.8099660141528506, 8.84286873565688, 2.205783765255911], "isController": false}, {"data": ["GET Remaining Programs", 4, 0, 0.0, 14432.0, 64, 40539, 8562.5, 40539.0, 40539.0, 40539.0, 0.0023235820340637126, 0.00296460930420336, 0.001522014306004136], "isController": false}, {"data": ["GET Manage Skills", 3, 0, 0.0, 31785.666666666668, 29928, 34679, 30750.0, 34679.0, 34679.0, 34679.0, 0.017382436785871553, 4.636612237307924, 0.010417013711845552], "isController": false}, {"data": ["GET Remaining Modules", 6, 0, 0.0, 28282.666666666668, 15288, 41573, 25748.5, 41573.0, 41573.0, 41573.0, 0.0032279375845988643, 0.008002595261818018, 0.0021109787133655983], "isController": false}, {"data": ["POST Module Filter", 3, 0, 0.0, 23900.666666666664, 119, 42516, 29067.0, 42516.0, 42516.0, 42516.0, 0.020779364705556403, 0.05363267667654841, 0.01661266917866098], "isController": false}, {"data": ["POST Generate SCORM AI", 3, 3, 100.0, 66818.33333333333, 60829, 78509, 61117.0, 78509.0, 78509.0, 78509.0, 0.015252195045070235, 0.0092099029324887, 0.012417233010325735], "isController": false}, {"data": ["POST complete", 3, 0, 0.0, 25006.666666666668, 3407, 37414, 34199.0, 37414.0, 37414.0, 37414.0, 0.01745688150268836, 8.062891461475571, 0.01772396269755371], "isController": false}, {"data": ["POST business-kpi", 3, 1, 33.333333333333336, 36305.333333333336, 19292, 47762, 41862.0, 47762.0, 47762.0, 47762.0, 0.01844247178301817, 5.7067083146347155, 0.030083081414291685], "isController": false}, {"data": ["GET Rankings", 3, 0, 0.0, 23376.666666666668, 98, 36018, 34014.0, 36018.0, 36018.0, 36018.0, 0.01772525849335303, 0.015221104135893648, 0.011366783604135894], "isController": false}, {"data": ["POST Assign Users and Groups to Initiative", 3, 0, 0.0, 25503.0, 7975, 59780, 8754.0, 59780.0, 59780.0, 59780.0, 0.022769188733805415, 0.012963317413875543, 0.015490756658090271], "isController": false}, {"data": ["POST run", 3, 3, 100.0, 95749.66666666667, 88922, 109062, 89265.0, 109062.0, 109062.0, 109062.0, 0.013409079734857797, 0.008603286509571848, 0.008114413810905156], "isController": false}, {"data": ["GET program", 9473, 205, 2.1640451810408527, 15352.134276364359, 64, 59529, 227.0, 41923.2, 43644.59999999999, 49708.00000000002, 3.936881888140689, 10.531493633008882, 2.222994548189504], "isController": false}, {"data": ["GET Video With Filter", 3, 0, 0.0, 32461.666666666668, 28481, 38546, 30358.0, 38546.0, 38546.0, 38546.0, 0.01708895370032811, 0.10959849147261211, 0.010307887762600255], "isController": false}, {"data": ["POST GET intitative List", 6, 0, 0.0, 15274.833333333334, 237, 47201, 363.5, 47201.0, 47201.0, 47201.0, 0.003267838586202314, 0.009159947287040405, 0.0022328102839969588], "isController": false}, {"data": ["POST Upload Competency File", 3, 0, 0.0, 41818.0, 36775, 44943, 43736.0, 44943.0, 44943.0, 44943.0, 0.016756219350082105, 0.011454446821345188, 301.8974694792446], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 3, 0.1931745009658725, 0.003530159327857664], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 1168, 75.20927237604636, 1.3744086983125838], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pt-strive-api.bes-learning.com:443 failed to respond", 2, 0.128783000643915, 0.0023534395519051094], "isController": false}, {"data": ["500/Internal Server Error", 3, 0.1931745009658725, 0.003530159327857664], "isController": false}, {"data": ["404/Not Found", 1, 0.0643915003219575, 0.0011767197759525547], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 376, 24.21120412105602, 0.44244663575816057], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 84982, 1553, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 1168, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 376, "400/Bad Request", 3, "500/Internal Server Error", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pt-strive-api.bes-learning.com:443 failed to respond", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET Video Detail from Module", 3, 1, "404/Not Found", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET question detail", 10695, 224, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 165, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pt-strive-api.bes-learning.com:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET Learning Modules", 11425, 298, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 226, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 72, "", "", "", "", "", ""], "isController": false}, {"data": ["DELETE Remove Module", 4, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST videos seen ", 9721, 136, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 99, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 36, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: pt-strive-api.bes-learning.com:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET video", 10066, 223, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 163, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 60, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET User", 6, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET module detail", 10979, 160, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 127, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 33, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST question answer", 10338, 156, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 121, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 35, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST encrypt company code", 1005, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET programId", 9141, 139, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 104, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 35, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Generate SCORM AI", 3, 3, "400/Bad Request", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST business-kpi", 3, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST run", 3, 3, "500/Internal Server Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET program", 9473, 205, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to pt-strive-api.bes-learning.com:443 [pt-strive-api.bes-learning.com/18.140.133.97] failed: Connection timed out: connect", 161, "Non HTTP response code: java.net.SocketException/Non HTTP response message: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond", 44, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
