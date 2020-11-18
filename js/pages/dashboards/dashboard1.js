/*
Template Name: Admin Pro Admin
Author: Wrappixel
Email: niravjoshi87@gmail.com
File: js
*/

var _users = [];
var _weddings = [];
var _appointment = [];
var _invoices = [];

$(function() {
    "use strict";

    let years = [];
    let weddingsForYear = [];

    getUser();
    getAppoitment();
    getInvoices();

    fetch("https://sheet2api.com/v1/ByR2h1huRjyQ/fiap/wedding").then(function(response) {
        return response.json();
    }).then(function(weddings) {
        _weddings = weddings;
        $("#qtd-wedding").text(weddings.length);

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

        addingYearComboBox(years);
        makeChart(years, weddingsForYear);

    }).catch(function(data) {
        console.error("Error retrieve data users");
        console.error(data);
    });

});

function getUser() {
    fetch("https://sheet2api.com/v1/ByR2h1huRjyQ/fiap/user").then(function(response) {
        return response.json();
    }).then(function(data) {
        _users = data;
        $("#qtd-users").text(data.length);
    }).catch(function() {
        console.error("Error retrieve data users");
    });
}

function getInvoices() {
    fetch("https://sheet2api.com/v1/ByR2h1huRjyQ/fiap/invoice").then(function(response) {
        return response.json();
    }).then(function(data) {
        _invoices = data;
    }).catch(function() {
        console.error("Error retrieve data invoices");
    });
}

function getAppoitment() {
    fetch("https://sheet2api.com/v1/ByR2h1huRjyQ/fiap/appointment").then(function(response) {
        return response.json();
    }).then(function(appointment) {

        let distinctVendors = [];
        _appointment = appointment;

        appointment.map((data) => {
            if (!distinctVendors.includes(data.VENDOR_ID)) {
                distinctVendors.push(data.VENDOR_ID);
            }
        });

        $("#qtd-vendor").text(distinctVendors.length);
    }).catch(function() {
        console.error("Error retrieve data vendors");
    });
}

function searchReport() {
    let ano = $("#filtro_ano").val();
    let mes = $("#filtro_mes").val();

    loadUserByAnoMes(ano, mes);
    loadCasamentosByAnoMes(ano, mes);
    loadPagamentosPendentesByMesAno(ano, mes);
}

function loadUserByAnoMes(ano, mes) {
    let userByAnoMes = _users.filter((user) => {
        let createdAt = moment(user.CREATED_AT);
        return createdAt.years() == ano && createdAt.months() == mes;
    });

    $("#qtd-users-mes").text(userByAnoMes.length);
}

function loadCasamentosByAnoMes(ano, mes) {
    let casamentosByAnoMes = _weddings.filter((user) => {
        let createdAt = moment(user.WEDDING_DATE);
        return createdAt.years() == ano && createdAt.months() == mes
    });

    $("#qtd-wedding-mes").text(casamentosByAnoMes.length);
}

function loadPagamentosPendentesByMesAno(ano, mes) {

    $("#qtd-pagamentos-pendentes-mes").text(casamentosByAnoMes.length);

}

function addingYearComboBox(years) {
    let filtroAno = $("#filtro_ano");
    years.map((year) => {
        let option = `<option value='${year}'>${year}</option>`;
        filtroAno.append(option)
    });
}

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
            barColor: '#68BFB7'
        });
        $('#sparklinedash2').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#DB5D79'
        });
        $('#sparklinedash3').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#84B8E2'
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