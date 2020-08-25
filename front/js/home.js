'use strict';

$(document).ready(() => {
    console.log('Document ready.')

    // Get Twitter trends
    $.ajax({
        url: "http://127.0.0.1:3000/getTrends",
        method: "GET",
        dataType: "json"
    }).done((trends) => {
        console.log("/getTrends success.");

        // Get articles
        $.ajax({
            url: 'http://127.0.0.1:3000/getArticles',
            method: 'GET',
            dataType: 'json',
        }).done((articles) => {
            console.log('/getArticles success.');
            
            for (let i = 0; i < 5; i++) {

                let trend = trends[i].name;
                    
                // Convert non-hashtag trends to hashtags
                if (! /\#/.test(trend) || /\040/.test(trend)) {
                    trend = `#${trend}`;
                    // Delete spaces
                    trend = trend.replace(/\040/g, "");
                }

                // HTML
                let output = "";
                output +=
                    `<article id="article-${i + 1}">
                        <h1><a href="./view/trend-${i + 1}.html">${trend}</a></h1>`;
                
                // Match trends with existing article headlines
                for (const article of articles) {
                    
                    const {_id, headline, author, ...body} = article;

                    const paragraphs = Object.values(body);
                    
                    if (trend === headline) {
                        output += `<p>${paragraphs[0]}</p>`
                    }
                }
                
                output +=`</article>`;

                $(".homepage-grid").append(output);
                
            }

            // Add placeholder paragraph to articles with no text
            $("article").each(function(index) {
                if ($(this).children().length < 2) {
                    $(this).append(
                        `<p class="article-placeholder">
                        Know what's going on? Take a stab at <strong>writing this article</strong>.
                        </p>`
                    );
                };
            });
        
        }).fail((er1, er2) => {
            console.log('/getArticles fail.');
            console.log(er1);
            console.log(er2);
        });
    }).fail((er1, er2) => {
        console.log('/getTrends fail.');
        console.log(er1);
        console.log(er2);
    });
});