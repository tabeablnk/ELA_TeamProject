<?php

    include_once 'XLog.php';
    include_once 'XNetwork.php';
    include_once 'XMovieMapApi.php';

    $_log = new XLog();
    $_network = new XNetwork();
    $_movie = new XMovieMapApi();

    $movie = $_GET['movie'];

    // TODO: get movie response
    $_movie->getMovieResponse($movie);

    // TODO: serializing data on here..
    $_movie->initilazeData();

    // TODO: display data on here..
    $_movie->displayData();

    header("Content-type: application/json; charset=utf-8");
?>