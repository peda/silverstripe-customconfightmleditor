<?php

class CustomConfigHtmlEditorField extends HtmlEditorField
{

    public static function include_js()
    {
        $availableConfigs = HtmlEditorConfig::get_available_configs_map();
        foreach ($availableConfigs as $identifier => $friendlyName) {
            self::include_js_internal($identifier);
        }
    }
        
    private static function include_js_internal($configName)
    {
        require_once 'tinymce/tiny_mce_gzip.php';

        $configObj = HtmlEditorConfig::get_active();

        if (Config::inst()->get('HtmlEditorField', 'use_gzip')) {
            $internalPlugins = array();
            foreach ($configObj->getPlugins() as $plugin => $path) {
                if (!$path) {
                    $internalPlugins[] = $plugin;
                }
            }
            $tag = TinyMCE_Compressor::renderTag(array(
                'url' => THIRDPARTY_DIR . '/tinymce/tiny_mce_gzip.php',
                'plugins' => implode(',', $internalPlugins),
                'themes' => 'advanced',
                'languages' => $configObj->getOption('language')
            ), true);
            preg_match('/src="([^"]*)"/', $tag, $matches);
            Requirements::javascript(html_entity_decode($matches[1]));
        } else {
            Requirements::javascript(MCE_ROOT . 'tiny_mce_src.js');
        }

                
        $config = HtmlEditorConfig::get($configName);
        $config->setOption('mode', 'none');
        $config->setOption('editor_selector', "htmleditor$configName");

                
        Requirements::customScript("
			".str_replace("ssTinyMceConfig", "ssTinyMceConfig".$configName, $config->generateJS())."
			", "htmlEditorConfig-$configName");
    }

    public function __construct($name, $title = null, $value = '')
    {
        this::__construct('cms', $name, $title, $value);

        $this->setConfigName("cms");

        //it's safe to call it again in here, just in case it's used outside of LeftAndMain layout - by giving the customScript a name we do ensure, that it's only included once
        self::include_js();
    }

    public static function withConfigName($config, $name, $title = null, $value = '')
    {
        $instance = new self($name, $title, $value);

        $instance->setConfigName($config);

        //it's safe to call it again in here, just in case it's used outside of LeftAndMain layout - by giving the customScript a name we do ensure, that it's only included once
        self::include_js();
    }

    private function setConfigName($config)
    {
        $this->setAttribute("data-configname", "ssTinyMceConfig$config");
    }
}
