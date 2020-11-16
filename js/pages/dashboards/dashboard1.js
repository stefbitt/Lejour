/*
Template Name: Admin Pro Admin
Author: Wrappixel
Email: niravjoshi87@gmail.com
File: js
*/
$(function() {
    "use strict";
    // ============================================================== 
    // Newsletter
    // ============================================================== 


    let years = [];
    let weddingsForYear = [];

    fetch("https://sheet2api.com/v1/ByR2h1huRjyQ/fiap/wedding").then(function(response) {
        return response.json();
    }).then(function(weddings) {

        weddings.filter(data => {
            return data.WEDDING_DATE != "NULL";
        });

        weddings.map(data => {
            let wedding_date = moment(data.WEDDING_DATE);

            if (!years.includes(wedding_date.years())) {
                years.push(wedding_date.years());
            }
        });

        years = years.filter((year => { return !isNaN(year) }));
        years = years.sort();

        let weddingsForYear1 = [];
        years.map((year, i) => {
            weddingsForYear[i] = weddings.filter(wedding => {
                let wedding_date = moment(wedding.WEDDING_DATE);
                return wedding_date.years() == year;
            }).length;
        });

        years.map((year, i) => {
            weddingsForYear1[i] = weddings.filter(wedding => {
                let wedding_date = moment(wedding.WEDDING_DATE);
                return wedding_date.years() == year;
            });
        });

        makeChart(years, weddingsForYear);

    }).catch(function(data) {
        console.error("Error retrieve data users");
        console.error(data);
    });

});

function makeChart(years, weddingsForYear) {
    //ct-visits
    new Chartist.Line('#ct-visits', {
        labels: years,
        series: [
            weddingsForYear
        ]
    }, {
        top: 0,
        low: 1,
        showPoint: true,
        fullWidth: true,
        plugins: [
            Chartist.plugins.tooltip()
        ],
        axisY: {
            labelInterpolationFnc: function(value) {
                return (value / 1);
            }
        },
        showArea: true
    });


    var chart = [chart];

    var sparklineLogin = function() {
        $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#7ace4c'
        });
        $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#7460ee'
        });
        $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#11a0f8'
        });
        $('#sparklinedash4').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#f33155'
        });
    }
    var sparkResize;
    $(window).on("resize", function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();
}