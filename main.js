/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
    "use strict";

    var AppInit            = brackets.getModule('utils/AppInit'),
        Commands           = brackets.getModule("command/Commands"),
        CommandManager     = brackets.getModule("command/CommandManager"),
        Menus              = brackets.getModule("command/Menus"),
        PanelManager       = brackets.getModule("view/PanelManager"),
        ProjectManager     = brackets.getModule("project/ProjectManager");

    var SHOW_BROWSER_COMMAND_ID = "com.ambethia.browser.show",
        SHOW_BROWSER_COMMAND    = "Show Browser",
        HIDE_BROWSER_COMMAND    = "Hide Browser";
    
    var browserPanel, $browserContainer;
    
    function resizeIframe() {
        var iframe = $("#browser-iframe");
        if (iframe) {
            iframe.attr("width", $browserContainer.innerWidth() + "px");
            iframe.attr("height", $browserContainer.innerHeight() + "px");
        }
    }
    
    function loadBrowserFrame() {
        var iframe = $("#browser-iframe");
        var url = ProjectManager.getBaseUrl();
        iframe.attr("src", url);
    }
    
    function toggleBrowser(collapsed) {
        if (browserPanel !== null) {
            if (browserPanel.isVisible()) {
                browserPanel.hide();
                CommandManager.get(SHOW_BROWSER_COMMAND_ID).setName(SHOW_BROWSER_COMMAND);
            } else {
                browserPanel.show();
                CommandManager.get(SHOW_BROWSER_COMMAND_ID).setName(HIDE_BROWSER_COMMAND);
                loadBrowserFrame();
            }
        }
    }
        
    AppInit.htmlReady(function () {
        var browserPanelHTML = require("text!browser-panel.html");
        browserPanel = PanelManager.createBottomPanel("browser", $(browserPanelHTML), 100);
        $browserContainer = $('#browser-panel');
        
        $(".close", $browserContainer).click(function () {
            toggleBrowser(true);
        });
        
        $(PanelManager).on("editorAreaResize", resizeIframe);
        
        loadBrowserFrame();
    });
    
    AppInit.appReady(function () {
        CommandManager.register(SHOW_BROWSER_COMMAND, SHOW_BROWSER_COMMAND_ID, toggleBrowser);
        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(SHOW_BROWSER_COMMAND_ID, "Ctrl-Alt-B", Menus.AFTER, Commands.VIEW_HIDE_SIDEBAR);
    });
});
