<?php

    class XLog
    {
        public function err($message)
        {
            $data = array(
                "status" => "failed",
                "message" => $message
            );
            echo json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
        }

    }

?>