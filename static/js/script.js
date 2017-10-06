$("#residentModal").on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var planet = button.data("planet");
    var residents = button.data("urls").replace(/'/g, '').slice(1,-1).split(',');
    var modal = $(this);
    modal.find(".modal-title").text(`Residents of ${planet}`);
    var modalTableBody = modal.find("#resident-table-body");
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
    planetName = voteButton.data("planet");
    planetId = voteButton.data("planet-id");
    $.ajax({
    type: "POST",
    url: "/vote",
    data: { 'planet': planetName, 'planet_id': planetId },
    success: function(response) {
    voteButton[0].innerHTML = "Voted";
    voteButton.attr("class", "voted")
},
    error: function(xhr, thrownError) {
    alert(xhr.status);
    alert(thrownError);
}
});
    return false;
}

$(".voted").on('click', function (event) {
    alert("You already voted on that planet!");
})

$("#voteStatisticsModal").on('show.bs.modal', function(event) {
    $.ajax({
        type: "GET",
        url: "/statistics",
        success: function(response) {
            var tableBody = $("#voteStatisticsModal").find("#vote-table-body")
            tableBody.empty()
            for (let i = 0; i < response.length; i++) {
                let planet = response[i]
                let planetVoteText = `<tr>
                                    <td> ${planet["planet_name"]} </td>
                                    <td> ${planet["votes"]}       </td>
                                  </tr>`;
                tableBody.append(planetVoteText);
            };
        },
        error: function() {
            alert("Error");
        }
    })
});