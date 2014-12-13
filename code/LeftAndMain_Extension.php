<?php
/*
 * Adding javascript files to LeftAndMain layout (as sites are loaded using Ajax, all the configurations need to be loaded at the first page load)
 */
class LeftAndMain_Extension extends LeftAndMainExtension {

	public function init() { 
            Requirements::javascript('htmleditor/javascript/CustomHtmlEditorField.js');
            CustomConfigHtmlEditorField::include_js();
	}
}

