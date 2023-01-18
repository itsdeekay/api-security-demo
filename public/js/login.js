$("document").ready(() => {
    $("#my-form").on("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const data = $("#my-form").serializeArray().reduce((prev, curr) => {
            prev[curr.name] = curr.value;
            return prev;
        }, {});
        login(data);
    });
});

function login(data) {
    $.ajax({
        method: 'POST',
        url: '/api/login',
        data,
        dataType: 'json',
        success: (res) => {
            console.log(res);
            sessionStorage.setItem("authorization", res.token);
            window.location = "/index.html";
        },
        error: (err) => {
            console.error(err);
            window.alert(err.responseText);
        }
    })
}