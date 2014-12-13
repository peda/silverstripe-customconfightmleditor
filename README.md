# CustomConfigHtmlEditor

## Installation
This module must be installed in a module folder called `htmleditor`

## Usage
The following block adds a new editor configuration called `reduced` within `_config.php`
```
//config defintion
$reduced = HtmlEditorConfig::get('reduced');
$reduced->disablePlugins('table');
$reduced->setButtonsForLine(1, 'bold', 'italic', 'underline', 'strikethrough', 'separator', 'charmap', 'separator', 'sslink', 'unlink', 'code');
$reduced->setButtonsForLine(2);
$reduced->setButtonsForLine(3);
$reduced->setOption('force_br_newlines',true);
$reduced->setOption('force_p_newlines',false);
$reduced->setOption('convert_newlines_to_brs',false);
$reduced->setOption('invalid_elements','p');
$reduced->setOption('paste_auto_cleanup_on_paste',true);
$reduced->setOption('paste_text_sticky',true);
$reduced->setOption('paste_text_sticky_default',true);
$reduced->setOption('paste_remove_styles',true);
$reduced->setOption('paste_remove_styles_if_webkit',true);
$reduced->setOption('paste_strip_class_attributes',true);
$reduced->setOption('language', 'de');
$reduced->enablePlugins(array('ssbuttons' => "../../../framework/thirdparty/tinymce_ssbuttons/editor_plugin_src.js"));
```

To create a new instance of the editor just do the following:
```
CustomHtmlEditorConfig::withConfigName('reduced', 'Field', 'Field Lable');
```
