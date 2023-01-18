$("document").ready(() => {
    $("#my-table").append('<tr id="no-records"><td colspan="5">No Records</td></tr>');
    getRecords();
    $("#my-form").on("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const data = $("#my-form").serializeArray().reduce((prev, curr) => {
            prev[curr.name] = curr.value;
            return prev;
        }, {});
        createRecord(data);
    });
});


function getRecords() {
    $.ajax({
        method: 'GET',
        url: '/api/data',
        dataType: 'json',
        headers: {
            'authorization' : sessionStorage.getItem("authorization")
        },
        success: (res) => {
            if (res && res.length > 0) {
                $("#no-records").remove();
                res.forEach(row => {
                    const cols = [];
                    cols.push(`<td>${row._id}</td>`);
                    cols.push(`<td>${row.name}</td>`);
                    cols.push(`<td>${row.email}</td>`);
                    cols.push(`<td>${row.contactNo}</td>`);
                    cols.push('<td></td>');
                    $("#my-table").append(`<tr>${cols.join('\n')}</tr>`);
                });
            }
        },
        error: (err) => {
            console.error(err);
            window.alert(err.responseText);
        }
    });
}

function createRecord(data) {
    $.ajax({
        method: 'POST',
        url: '/api/data',
        data,
        dataType: 'json',
        headers: {
            'authorization' : sessionStorage.getItem("authorization")
        },
        success: (res) => {
            console.log(res);
            $("#no-records").remove();
            const cols = [];
            cols.push(`<td>${res._id}</td>`);
            cols.push(`<td>${res.name}</td>`);
            cols.push(`<td>${res.email}</td>`);
            cols.push(`<td>${res.contactNo}</td>`);
            cols.push('<td></td>');
            $("#my-table").append(`<tr>${cols.join('\n')}</tr>`);
            $("#email").val('');
            $("#name").val('');
            $("#contactNo").val('');
        },
        error: (err) => {
            console.error(err);
            window.alert(err.responseText);
        }
    })
}