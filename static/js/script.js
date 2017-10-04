$("#residentModal").on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var planet = button.data("planet");
    var residents = button.data("urls").replace(/'/g, '').slice(1,-1).split(',');
    var modal = $(this);
    modal.find(".modal-title").text(`Residents of ${planet}`);
    var modalTableBody = modal.find("#table-body");
    modalTableBody.empty();
    for (let i = 0; i < residents.length; i++) {
        $.ajax({
            dataType: "json",
            url: residents[i],
            success: function(response) {
                resident = `<tr>
                                <td>${response["name"]}</td>
                                <td>${response["height"]}</td>
                                <td>${response["mass"]}</td>
                                <td>${response["skin_color"]}</td>
                                <td>${response["hair_color"]}</td>
                                <td>${response["eye_color"]}</td>
                                <td>${response["birth_year"]}</td>
                                <td>${response["gender"]}</td>
                            </tr>`
                console.log(resident);
                modalTableBody.append(resident);
            }
        });
    }
});