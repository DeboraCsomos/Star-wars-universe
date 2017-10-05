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

$(".vote").one("click", function (event) {
    return saveVote(event);
})
function saveVote(event) {
    var voteButton = $(event.target);
    console.log(voteButton);
    planetName = voteButton.data("planet");
    planetId = voteButton.data("planet-id");
    $.ajax({
    type: "POST",
    url: "/vote",
    data: { 'planet': planetName, 'planet_id': planetId },
    success: function(response) {
    voteButton[0].innerHTML = "Voted";
    voteButton.attr("class", "voted")
    voteButton.on('click', function (event) {
        alert("You already voted on that planet!");
    })
},
    error: function(xhr, thrownError) {
    alert(xhr.status);
    alert(thrownError);
}
});
    return false;
}