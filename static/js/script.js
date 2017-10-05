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

$("#login").submit(function(event){
    // 'this' refers to the current submitted form  
    var str = $(this).serialize();
    
    // -- Start AJAX Call --
    $.ajax({  
        type: "POST",
        url: "/login",  // Send the login info to this page
        data: str,
        success: function(response) {
            console.log(response);
            var username = response;
            console.log(username)
            sessionStorage.setItem("username", username);
            logoutText = `<li class="nav-item">
                          <a class="nav-link" href="/logout">Logout</a>
                          </li>
                          </ul>`
            loggedInText = `<span class="navbar-text">
                            Signed in as ${username}
                            </span>`
            $("nav ul li:last-child").replaceWith(logoutText);
            $("nav").append(loggedInText);
            $("#loginModal").modal('hide');
        },    
    })
});