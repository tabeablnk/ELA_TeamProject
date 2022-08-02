<?php

class XNetwork
{
    public function GetWebSource($url_address, $hdrArray = null)
    {
        $ch = curl_init($url_address);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);

        if(!empty($hdrArray))
            curl_setopt($ch, CURLOPT_HTTPHEADER, $hdrArray);

        $content = curl_exec($ch);
        curl_close($ch);
        return $content;
    }

    //====================================================
    //====================================================

    private function get_WebResponse($url_address, $HeaderArray = null, $PostArray = null)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url_address);
        curl_setopt($ch, CURLOPT_FAILONERROR, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        if(!empty($HeaderArray))
            curl_setopt($ch, CURLOPT_HTTPHEADER, $HeaderArray);

        if(!empty($PostArray)){
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS,
                        $PostArray);
        }

        $retValue = curl_exec($ch);
        curl_close($ch);
        return $retValue;
    }
    public function GetResponse($url, $HeaderArray = null, $PostArray = null)
    {
        $resp = $this->get_WebResponse($url, $HeaderArray, $PostArray);
        while(empty($resp))
            $resp = $this->get_WebResponse($url, $HeaderArray, $PostArray);

        return $resp;
    }
}

?>