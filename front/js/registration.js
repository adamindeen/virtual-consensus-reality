'use strict';

import passwordMatch from "./validation.js";

$(document).ready(function() {
    console.log("Document ready.");

    // Submit button
    $('form').submit(function(event) {
        // Block form action
        event.preventDefault();

        // Get form values
        const formPost = $("form").serializeArray();

        // Convert to object
        let formObject = {};
        for (const field of formPost) {
            formObject[field.name] = field.value;
        }

        // Get values
        const {username, password1, password2} = formObject;

        // Check password match
        if (passwordMatch(password1, password2)) {

            // POST to server
            $.ajax({
                url: "http://127.0.0.1:3000/saveUser",
                method: "POST",
                data: formPost,
            }).done(() => {
                console.log("saveUser success.");

                $(".form-status").html(
                    `<span class="status-good">User successfully added.</span>`
                );

            }).fail((xhr, status, error) => {
                console.log("saveUser fail.");
                console.log(error);
                
                $(".form-status").html(
                    `<span class="status-bad">${error}</span>`
                );
            });
        } else {

            $(".form-status").html(
                `<span class="status-bad">Passwords do not match.</span>`
            );
        }
    });
});