$("#residentModal").on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var planet = button.data("planet");
    var residents = button.data("urls").replace(/'/g, '').slice(1,-1).split(',');
    var modal = $(this);
    modal.find(".modal-title").text(`Residents of ${planet}`);
    var tableBody = modal.find("#resident-table-body");
    var loading = `<tr id="loading" align="center">
                    <td colspan="8"><img src="/static/loading_sm.gif" alt="Loading..."></td>
               </tr>`
    tableBody.empty();
    tableBody.append(loading);
    var deferring = [];
    var residentRows = [];
    for (let i = 0; i < residents.length; i++) {
        deferring.push(
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
                residentRows.push(resident);
            }
        })
        )
    }
    $.when.apply($, deferring).done(function() {
        $("#loading").detach();
        tableBody.append(residentRows);
    })
});


$(".vote").one("click", function (event) {
    return saveVote(event);
});


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
    return false; // end ajax call
};


$(".voted").on('click', function (event) {
    alert("You already voted on that planet!");
});


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
    });
});


$("#login-form").submit(function(event){
    // 'this' refers to the current submitted form  
    var logstr = $(this).serialize();
    
    // -- Start AJAX Call --
    $.ajax({
        type: "POST",
        url: "/login",  // Send the login info to this page
        data: logstr,
        success: function(response) {
            var username = response;
            logoutText = `<li class="nav-item">
                            <a class="nav-link" href="/logout">Logout</a>
                          </li>
                          </ul>`
            loggedInText = `<span class="navbar-text">
                                Signed in as ${username}
                            </span>`
            $("nav #registration, nav #login").detach();
            $("nav ul").append(logoutText)
            $("nav").append(loggedInText);
            $("#loginModal").modal('hide');
            window.location.reload(true);
        },
        error: function(){
            alert('Invalid username or password!');
        }
    });
    return false; // end ajax call
});


$("#loginModal").on('show.bs.modal', function(event) {
    var modal = $(this);
        modal.find(".modal-title").text("Login page");
        modal.find("form"). attr("id", "login-form")
        modal.find(".submit_button").text("login")
});


$("#registration-form").submit(function(event) {
    var regstr = $(this).serialize();
    $.ajax({
        type: "POST",
        url: "/registration",  // Send the login info to this page
        data: regstr,
        success: function(response) {
            console.log("4th")
            var username = response;
            logoutText = `<li class="nav-item">
                          <a class="nav-link" href="/logout">Logout</a>
                          </li>
                          </ul>`
            loggedInText = `<span class="navbar-text">
                            Signed in as ${username}
                            </span>`
            $("nav ul li:last-child").replaceWith(logoutText);
            $("nav").append(loggedInText);
            $("#registrationModal").modal('hide');
            window.location.reload(true);
        },
        error: function(){
            console.log("error");
            alert('Sorry, that user already exists!');
          }
    });
    return false; // end ajax call
});

$("#registrationModal").on('show.bs.modal', function(event) {
    var modal = $(this);
    modal.find(".modal-title").text("Registration page");
    modal.find("form"). attr("id", "registration-form")
    modal.find(".submit_button").text("register")
});