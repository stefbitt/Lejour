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
var _meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
var _weddingsForYear = [];
var _years = [];

$(function() {
    "use strict";

    getUser();
    getAppoitment();
    getInvoices();
    loadUserHasCasamentos();

    fetch("https://sheet2api.com/v1/ByR2h1huRjyQ/fiap/wedding").then(function(response) {
        return response.json();
    }).then(function(weddings) {

        weddings = weddings.filter(data => {
            return data.WEDDING_DATE != "NULL";
        });

        $("#qtd-wedding").text(weddings.length);
        _weddings = weddings;

        weddings.map(data => {
            let wedding_date = moment(data.WEDDING_DATE);

            if (!_years.includes(wedding_date.years())) {
                _years.push(wedding_date.years());
            }
        });

        _years = _years.filter((year => { return !isNaN(year) }));
        _years = _years.sort();

        _years.map((year, i) => {
            _weddingsForYear[i] = weddings.filter(wedding => {
                let wedding_date = moment(wedding.WEDDING_DATE);
                return wedding_date.years() == year;
            }).length;
        });

        addingYearComboBox(_years);
        makeChart(_years, _weddingsForYear);

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

function chanceReportYear() {
    let year = $("#filtro_ano_wedding").val();

    if (!isNaN(year)) {
        let weddings = _weddings.filter((wedding) => {
            let wedding_date = moment(wedding.WEDDING_DATE);
            return wedding_date.years() == year;
        });
    
        let weddingsByMes = [];
         for(let i = 0; i < 12; i++) {
            weddingsByMes[i] = weddings.filter((item) => {
                let wedding_date = moment(item.WEDDING_DATE);
                return wedding_date.months() == i;
            }).reduce((acumulador, valorAtual) => {
                return acumulador + (valorAtual.BUDGET != "NULL" ? valorAtual.BUDGET : 0);
            }, 0);
         }
    
         make(weddingsByMes);
    } else {
        makeChart(_years, _weddingsForYear);
    }

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

    let pagamentosPendentes = _invoices.filter((invoices) => {
        let createdAt = moment(invoices.CREATED_AT);
        let accepted = invoices.ACCEPTED;
        return createdAt.years() == ano && createdAt.months() == mes && accepted.toLowerCase() == "false";

    })

    $("#qtd-pagamentos-pendentes-mes").text(pagamentosPendentes.length);

}

function addingYearComboBox(years) {
    let filtroAno = $(".filtro_ano");
    years.map((year) => {
        let option = `<option value='${year}'>${year}</option>`;
        filtroAno.append(option)
    });
}

function loadUserHasCasamentos() {
    let usersIDs = _users.map((user) => {
        return user.ID;
    });

    _weddings.map((weddings) => {

    });

}

function make(weddingsByMes) {
    new Chartist.Line('#ct-visits', {
        labels: _meses,
        series: [weddingsByMes]
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
                return (value / 1) + 'k';
            }
        },
        showArea: true
    });
}

function makeChart(years, weddingsForYear) {
    //ct-visits
    new Chartist.Line('#ct-visits', {
        labels: years,
        series: [weddingsForYear]
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

    var sparklineLogin = function() {
        $('#sparklinedash').sparkline([0, 5, 6, 10, 9, 12, 4, 9], {
            type: 'bar',
            height: '30',
            barWidth: '4',
            resize: true,
            barSpacing: '5',
            barColor: '#68BFB7'
        });
        $('#sparklinedash7').sparkline([52,48], {
            type: 'pie',
            height: '60',
            barWidth: '8',
            resize: true,
            barSpacing: '10',
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