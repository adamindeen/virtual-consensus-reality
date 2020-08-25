'use strict';

$(document).ready(function() {
    console.log("Document ready.")

    // Get the current page number
    const path = window.location.pathname,
        page = path.split("/").pop(),
        pageNum = page.replace(/\-*[a-z]*\.*/g, "");

    let trend = "";

    // Get Twitter trends
    $.ajax({
        url: "http://127.0.0.1:3000/getTrends",
        method: "GET",
        dataType: "json"
    }).done((trends) => {
        console.log("/getTrends success.");

        trend = trends[pageNum - 1].name;

        // Convert non-hashtag trends to hashtags
        if (! /\#/.test(trend) || /\040/.test(trend)) {
            trend = `#${trend}`;
            // Delete spaces
            trend = trend.replace(/\040/g, "");
        }

        $("header").append(`<h1>${trend}</h1>`);

    }).fail((er1, er2) => {
        console.log('/getTrends fail.');
        console.log(er1);
        console.log(er2);
    });

    // Create auto-resize event handler
    $(".paragraph-text").first().on("input", function() {
        this.style.height = "auto";
        this.style.height = `${this.scrollHeight}px`;
    });

    let paragraphs = $(".form-paragraph").length;



    // New paragraph button
    $("#new-paragraph").click((event) => {
        // Block default action
        event.preventDefault();

        // Get the number of existing paragraphs
        paragraphs = $(".form-paragraph").length;

        $("#form-paragraphs").append(
            `<div class="form-paragraph" id="paragraph-${paragraphs + 1}">

                <h2 class="paragraph-heading">Paragraph ${paragraphs + 1}</h2>

                <textarea class="paragraph-text" name="paragraph-${paragraphs +1}" placeholder="Nothing here yet." required></textarea>

                <button type="button" class="paragraph-delete">Delete</button>
            </div>`
        );

        // Create auto-resize event handler
        $(".paragraph-text").last().on("input", function () {
            this.style.height = "auto";
            this.style.height = `${this.scrollHeight}px`;
        });
    });



    // Delete button
    $("body").on("click", ".paragraph-delete", function(event) {
        // Block default action
        event.preventDefault();

        $(this).parent().remove();

        // Rearrange paragraph numbers
        $(".paragraph-heading").each(function(index) {
            index += 1;
            $(this).html(`Paragraph ${index}`);
        });

        $(".paragraph-text").each(function(index) {
            index += 1;
            $(this).attr("name", `paragraph-${index}`);
            $(this).attr("id", `paragraph-${index}`);
        })
    });



    // Submit
    $('form').submit(function(event) {
        // Block form action
        event.preventDefault();

        // Get form values
        let formPost = $("form").serializeArray();

        // Convert to object
        let formObject = {};
        for (const field of formPost) {
            formObject[field.name] = field.value;
        }

        // Separate login details from article text
        let {username, password, ...body} = formObject;

        // Add author
        formPost.unshift({name: "author", value: username});

        // Add headline
        formPost.unshift({name: "headline", value: trend});

        // POST to server
        $.ajax({
            url: "http://127.0.0.1:3000/saveArticle",
            method: "POST",
            dataType: "json",
            data: formPost,
        }).done((data) => {
            console.log("AJAX POST success.");

            $(".form-status").html(
                `<span class="status-good">Article successfully updated.</span>`
            );
        }).fail((xhr, status, error) => {
            console.log("AJAX POST fail.");
            console.log(error);
            
            $(".form-status").html(
                `<span class="status-bad">${error}</span>`
            );
        });
    });
});