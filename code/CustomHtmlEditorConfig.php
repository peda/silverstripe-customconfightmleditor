<?php

class CustomHtmlEditorConfig {

    protected static $configs = array();

    public static function addConfig($identifier) {
        self::$configs[$identifier] = $identifier;
    }

    public static function removeConfig($identifier) {
        unset(self::$configs[$identifier]);
    }

    public static function get() {
        return self::$configs;
    }
}
