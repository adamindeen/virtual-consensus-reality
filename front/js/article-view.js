'use strict';

$(document).ready(() => {

    // Get the current page number
    const path = window.location.pathname,
        page = path.split("/").pop(),
        pageNum = page.replace(/\-*[a-z]*\.*/g, "");

    // Add a button linking to the corresponding edit page
    $(".article-edit").append(`<button class="button-link"><a href="../edit/trend-${pageNum}.html">Edit this article</a></button>`);

    // Get Twitter trends
    $.ajax({
        url: "http://127.0.0.1:3000/getTrends",
        method: "GET",
        dataType: "json"
    }).done((trends) => {
        console.log("/getTrends success.");

        let trend = trends[pageNum - 1].name;

        // Convert non-hashtag trends to hashtags
        if (! /\#/.test(trend) || /\040/.test(trend)) {
            trend = `#${trend}`;
            // Delete spaces
            trend = trend.replace(/\040/g, "");
        }

        $("header").append(`<h1>${trend}</h1>`);

        $.ajax({
            url: 'http://127.0.0.1:3000/getArticles',
            method: 'GET',
            dataType: 'json',
        }).done((articles) => {
            console.log('/getArticles success.');

            let output = "";
            
            // Match the trend with the appropriate article
            for (const article of articles) {
                const {_id, author, headline, ...body} = article;

                const paragraphs = Object.values(body);
                
                if (headline === trend) {

                    for (const paragraph of paragraphs) {

                        // Add the paragraphs
                        output += `<p>${paragraph}</p>`
                    }

                    // Add paragraphs
                    $('.article-body').html(output);

                    // Add author
                    $("footer").append(
                        `<span>Written by ${author}</span>`
                    )

                    break;
                }
            }

            // Add placeholder paragraph to articles with no text
            $(".article-body").each(function() {
                if ($(this).children().length < 1) {
                    $(this).append(
                        `<p class="article-placeholder">
                        Know what's going on? Take a stab at <strong>writing this article</strong>.
                        </p>`
                    );
                };
            });
        }).fail((er1, er2) => {
            console.log('/getTrends fail.');
            console.log(er1);
            console.log(er2);
        });

    }).fail((er1, er2) => {
        console.log('/getArticles fail.');
        console.log(er1);
        console.log(er2);
    });
});