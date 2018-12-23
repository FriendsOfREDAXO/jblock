<?php
/**
 * @author mail[at]joachim-doerr[dot]com Joachim Doerr
 * @package redaxo5
 * @license MIT
 */

if (rex::isBackend() && is_object(rex::getUser())) {

    // use theme helper class
    if (MBlock\Utils\MBlockThemeHelper::getCssAssets($this->getConfig('mblock_theme'))) {
        // foreach all css files
        foreach (MBlock\Utils\MBlockThemeHelper::getCssAssets($this->getConfig('mblock_theme')) as $css) {
            // add assets css file
            try {
                rex_view::addCssFile($this->getAssetsUrl($css));
            } catch (rex_exception $e) {
                rex_logger::logException($e);
            }
        }
    }

    // register extensions
    // alfred post post
    rex_extension::register('REX_FORM_SAVED', function (rex_extension_point $params) {
        /** @var rex_form|null $form */
        $form = ($params->hasParam('form')) ? $params->getParam('form') : null;
        if ($form instanceof mblock_rex_form)
            return MBlock\Processor\MBlockRexFormProcessor::postPostSaveAction($params->getSubject(), $form, $_POST); // execute post post
        else
            return $params->getSubject();
    });

    // assets
    try {
        rex_view::addJsFile($this->getAssetsUrl('mblock_sortable.min.js'));
        rex_view::addJsFile($this->getAssetsUrl('mblock_smooth_scroll.min.js'));
        rex_view::addJsFile($this->getAssetsUrl('mblock.js'));
        rex_view::addCssFile($this->getAssetsUrl('mblock.css'));
    } catch (rex_exception $e) {
        rex_logger::logException($e);
    }

}
try {
    rex_set_session('mblock_count', 0);
} catch (rex_exception $e) {
    rex_login::startSession();
    // reset count per page init
    rex_set_session('mblock_count', 0);
}
