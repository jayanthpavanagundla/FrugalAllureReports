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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.98, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET submit/e-doc/public/user/assignment"], "isController": false}, {"data": [1.0, 500, 1500, "POST hit/e-doc/public/sso-1"], "isController": false}, {"data": [1.0, 500, 1500, "POST hit/e-doc/public/sso"], "isController": false}, {"data": [1.0, 500, 1500, "GET open assm/e-doc/public/user/check-assignment-availability/146"], "isController": false}, {"data": [1.0, 500, 1500, "GET start/e-doc/public/user/assignment-session-check/146"], "isController": false}, {"data": [1.0, 500, 1500, "POST start/e-doc/public/user/activity-track-log"], "isController": false}, {"data": [1.0, 500, 1500, "GET assm/e-doc/public/user/assignment"], "isController": false}, {"data": [1.0, 500, 1500, "POST start/e-doc/public/user/track-time"], "isController": false}, {"data": [1.0, 500, 1500, "POST hit/e-doc/public/sso-0"], "isController": false}, {"data": [0.0, 500, 1500, "GET open assm/e-doc/public/user/assignment-detail/146"], "isController": false}, {"data": [1.0, 500, 1500, "POST start/e-doc/public/user/compare"], "isController": false}, {"data": [1.0, 500, 1500, "GET open assm/e-doc/public/user/assignment-info/146"], "isController": false}, {"data": [1.0, 500, 1500, "GET logout/e-doc/public/logout"], "isController": false}, {"data": [1.0, 500, 1500, "POST start/e-doc/public/user/drag-drop"], "isController": false}, {"data": [1.0, 500, 1500, "GET logout/e-doc/public/logout-1"], "isController": false}, {"data": [1.0, 500, 1500, "GET logout/e-doc/public/logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "GET hit/e-doc/public/home"], "isController": false}, {"data": [1.0, 500, 1500, "POST start/e-doc/public/user/view-media"], "isController": false}, {"data": [1.0, 500, 1500, "POST submit/e-doc/public/user/submit-assignment"], "isController": false}, {"data": [1.0, 500, 1500, "POST start/e-doc/public/user/upload-audio"], "isController": false}, {"data": [1.0, 500, 1500, "POST start/e-doc/public/user/save-written-synopsis"], "isController": false}, {"data": [1.0, 500, 1500, "POST start/e-doc/public/user/save-consent"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10000, 0, 0.0, 126.94670000000119, 34, 2849, 74.0, 126.0, 171.0, 2343.9699999999993, 3.8119024366442757, 48.86640744479317, 292.1365059773489], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET submit/e-doc/public/user/assignment", 200, 0, 0.0, 127.2700000000001, 102, 184, 125.0, 140.9, 149.95, 174.93000000000006, 0.19386532563558748, 4.731080698016951, 0.2853076618484671], "isController": false}, {"data": ["POST hit/e-doc/public/sso-1", 200, 0, 0.0, 76.40999999999997, 36, 131, 74.0, 98.80000000000001, 110.94999999999999, 126.95000000000005, 0.6702075968031098, 15.431392471474288, 0.9843674078045674], "isController": false}, {"data": ["POST hit/e-doc/public/sso", 200, 0, 0.0, 244.45999999999998, 155, 373, 237.5, 290.0, 307.84999999999997, 367.95000000000005, 0.6695300234000743, 55.05272732008892, 1.5999446434668936], "isController": false}, {"data": ["GET open assm/e-doc/public/user/check-assignment-availability/146", 200, 0, 0.0, 77.05999999999999, 47, 149, 73.0, 97.9, 104.0, 127.97000000000003, 0.6701536997510379, 0.9221157841300902, 0.9293147008266345], "isController": false}, {"data": ["GET start/e-doc/public/user/assignment-session-check/146", 200, 0, 0.0, 75.35000000000001, 45, 175, 72.0, 99.0, 114.84999999999997, 138.0, 0.6694112528031597, 0.9178255848980822, 0.8955990393948523], "isController": false}, {"data": ["POST start/e-doc/public/user/activity-track-log", 200, 0, 0.0, 53.550000000000004, 41, 99, 52.0, 63.0, 68.94999999999999, 81.98000000000002, 0.669731805898328, 0.947696666744802, 1.4349527169345035], "isController": false}, {"data": ["GET assm/e-doc/public/user/assignment", 200, 0, 0.0, 143.37500000000006, 106, 229, 141.5, 176.60000000000002, 191.74999999999994, 215.94000000000005, 0.6699853273213316, 16.35046194441467, 0.9716095811251734], "isController": false}, {"data": ["POST start/e-doc/public/user/track-time", 440, 0, 0.0, 59.44090909090912, 45, 130, 57.0, 71.90000000000003, 77.0, 92.3599999999999, 0.24029390128617312, 0.3287614801776646, 0.38578434933053574], "isController": false}, {"data": ["POST hit/e-doc/public/sso-0", 200, 0, 0.0, 167.8150000000001, 118, 300, 162.0, 205.9, 223.95, 294.5900000000004, 0.6697093796147162, 39.64755392834779, 0.6167375913316167], "isController": false}, {"data": ["GET open assm/e-doc/public/user/assignment-detail/146", 200, 0, 0.0, 2352.0899999999992, 2028, 2849, 2342.5, 2563.4, 2674.8, 2833.8900000000003, 0.6649599361638461, 104.52406856256442, 0.9844524054925692], "isController": false}, {"data": ["POST start/e-doc/public/user/compare", 440, 0, 0.0, 61.1, 45, 108, 59.0, 75.0, 83.0, 96.3599999999999, 0.24028983322793349, 0.6535226421287058, 0.4289548975983031], "isController": false}, {"data": ["GET open assm/e-doc/public/user/assignment-info/146", 200, 0, 0.0, 82.105, 51, 175, 79.0, 106.0, 117.89999999999998, 164.74000000000024, 0.6700818504980384, 15.728672917553128, 0.9848370947261208], "isController": false}, {"data": ["GET logout/e-doc/public/logout", 200, 0, 0.0, 88.74999999999999, 73, 125, 87.0, 102.0, 107.94999999999999, 120.95000000000005, 0.19388054825541434, 15.9504362630421, 0.564601362204732], "isController": false}, {"data": ["POST start/e-doc/public/user/drag-drop", 440, 0, 0.0, 60.26818181818178, 46, 116, 58.0, 73.0, 81.0, 103.7199999999998, 0.2402879960854901, 0.346352619357601, 0.3862441812077312], "isController": false}, {"data": ["GET logout/e-doc/public/logout-1", 200, 0, 0.0, 42.995000000000005, 35, 70, 42.0, 51.0, 54.94999999999999, 67.99000000000001, 0.19388863037071508, 4.252270201074627, 0.28306982656662016], "isController": false}, {"data": ["GET logout/e-doc/public/logout-0", 200, 0, 0.0, 45.669999999999995, 34, 74, 44.0, 55.0, 59.94999999999999, 65.99000000000001, 0.19389069799681824, 11.698955728936927, 0.281558074141864], "isController": false}, {"data": ["GET hit/e-doc/public/home", 200, 0, 0.0, 93.14, 58, 163, 90.5, 115.9, 123.89999999999998, 162.97000000000003, 0.6701536997510379, 15.698180260455235, 0.9430580872473101], "isController": false}, {"data": ["POST start/e-doc/public/user/view-media", 880, 0, 0.0, 58.03068181818177, 42, 140, 55.0, 72.89999999999998, 83.0, 105.13999999999965, 0.3618471639817333, 0.5752804521115839, 0.5650328273503824], "isController": false}, {"data": ["POST submit/e-doc/public/user/submit-assignment", 200, 0, 0.0, 84.83999999999992, 55, 137, 84.0, 101.9, 106.0, 115.96000000000004, 0.19200952367237414, 0.2717009763684279, 0.31257800386899187], "isController": false}, {"data": ["POST start/e-doc/public/user/upload-audio", 200, 0, 0.0, 115.42500000000004, 84, 207, 112.0, 137.0, 149.95, 184.97000000000003, 0.6694426220728621, 1.3800781929902664, 2512.28963942356], "isController": false}, {"data": ["POST start/e-doc/public/user/save-written-synopsis", 4400, 0, 0.0, 79.43295454545479, 56, 288, 76.0, 97.0, 108.0, 130.0, 1.7656146546016334, 2.477722908850143, 2.8311906863826968], "isController": false}, {"data": ["POST start/e-doc/public/user/save-consent", 200, 0, 0.0, 76.39000000000009, 47, 178, 73.0, 96.80000000000001, 111.89999999999998, 128.99, 0.6693104429161856, 0.9471004216655791, 1.0503729314124124], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
