<?php

    include_once 'XNetwork.php';

    class XMovieMapApi
    {
        private $_movies_data = array();
        private $_org_movie_name = "";
        private $_response = null;
        private $_matched = null;
        private $_m_value = 0;
        private $_message = "";
        private $_json_data = null;

        //=============================================================================
        private function _net()
        {
            $net = new XNetwork(); return $net;
        }
        //=============================================================================
        public function getMovieResponse($movie)
        {
            // TODO: set original movie name to other variable
            $this->_org_movie_name = $movie;

            // TODO: if found space between charecters
            if(strpos($movie, ' '))
                $movie = str_replace(' ', '+', $movie);

            // TODO: send request for get result from movie name search on here..
            $request_header = array(
                "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Host: www.movie-map.com"
            );

            // TODO: response value
            $this->_response = $this->_net()->GetResponse("https://www.movie-map.com/".$movie, $request_header);
        }
        //=============================================================================
        public function initilazeData()
        {
            // TODO: explode the value from source on here..
            preg_match_all('#<a href="(.*?)" class=S id=(.*?)>(.*?)</a>#', $this->_response, $this->_matched);

            // TODO: check movie is existed or no on here...
            if(!empty($this->_matched[3])) {
                foreach ( $this->_matched[3] as $name ) {
                    $this->_m_value++;

                    // TODO: adding to array
                    array_push($this->_movies_data, $name);
                }
                $this->_message = "good";
            }
            else{
                // TODO: not found movie
                $this->_message = "not found movie";
            }
        }
        //=============================================================================
        public function displayData()
        {
            // TODO: converting to json data for client on here...
            $json_data = array(
                "search" => $this->_org_movie_name,
                "movies" => $this->_movies_data,
                "found" => $this->_m_value,
                "message" => $this->_message
            );

            $this->_json_data = json_encode($json_data, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);

            echo $this->_json_data;
        }
    }

?>